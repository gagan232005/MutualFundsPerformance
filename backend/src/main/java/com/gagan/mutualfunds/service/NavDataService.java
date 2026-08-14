package com.gagan.mutualfunds.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gagan.mutualfunds.exception.FundDataException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Fetches REAL historical mutual fund NAV data from the public AMFI-backed
 * mfapi.in API (https://www.mfapi.in) -- no static/sample CSVs involved.
 *
 * mfapi.in exposes:
 *   GET /mf              -> full list of {schemeCode, schemeName} for every
 *                            scheme registered with AMFI (~30k entries)
 *   GET /mf/{schemeCode}  -> full NAV history for a single scheme, e.g.
 *                            { meta: {...}, data: [{date, nav}, ...] }
 *
 * Both the master scheme list and per-scheme NAV history are cached
 * in-memory with a TTL, since the master list is large and rarely changes
 * intraday, and re-fetching NAV history on every click would be wasteful
 * and would make the app fragile to the upstream API's own rate limiting.
 */
@Service
public class NavDataService {

    private static final DateTimeFormatter MFAPI_DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd-MM-yyyy");

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${mfapi.base-url:https://api.mfapi.in/mf}")
    private String baseUrl;

    @Value("${mfapi.master-list-ttl-minutes:180}")
    private long masterListTtlMinutes;

    @Value("${mfapi.history-ttl-minutes:60}")
    private long historyTtlMinutes;

    // Curated, well-known AMCs -> keyword used to filter the AMFI master list.
    private static final Map<String, String> AMC_KEYWORDS = new LinkedHashMap<>();
    static {
        AMC_KEYWORDS.put("SBI", "SBI");
        AMC_KEYWORDS.put("HDFC", "HDFC");
        AMC_KEYWORDS.put("ICICI", "ICICI Prudential");
        AMC_KEYWORDS.put("AXIS", "Axis");
        AMC_KEYWORDS.put("KOTAK", "Kotak");
    }

    private volatile List<SchemeRef> cachedMasterList = null;
    private volatile long masterListFetchedAt = 0L;

    private final Map<String, CachedHistory> historyCache = new ConcurrentHashMap<>();

    public NavDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public record SchemeRef(String schemeCode, String schemeName) {}

    public record NavPoint(String date, double nav) {}

    private static class CachedHistory {
        final List<NavPoint> monthly;
        final long fetchedAt;
        CachedHistory(List<NavPoint> monthly, long fetchedAt) {
            this.monthly = monthly;
            this.fetchedAt = fetchedAt;
        }
    }

    public List<String> getAmcList() {
        return new ArrayList<>(AMC_KEYWORDS.keySet());
    }

    /**
     * Returns a short, curated list of real, currently-active growth-plan
     * equity schemes for the given AMC, pulled live from the AMFI master
     * list. Limited to a sane dropdown size (10) and sorted alphabetically.
     */
    public List<SchemeRef> getFundsForAmc(String amc) {
        String keyword = AMC_KEYWORDS.get(amc == null ? null : amc.toUpperCase());
        if (keyword == null) return Collections.emptyList();

        List<SchemeRef> master = getMasterList();

        return master.stream()
                .filter(s -> s.schemeName() != null)
                .filter(s -> s.schemeName().toUpperCase().contains(keyword.toUpperCase()))
                .filter(s -> s.schemeName().toUpperCase().contains("GROWTH"))
                .filter(s -> !s.schemeName().toUpperCase().contains("IDCW"))
                .filter(s -> !s.schemeName().toUpperCase().contains("DIVIDEND"))
                .sorted(Comparator.comparing(SchemeRef::schemeName))
                .collect(Collectors.toMap(SchemeRef::schemeName, s -> s, (a, b) -> a, LinkedHashMap::new))
                .values()
                .stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Full scheme master list from AMFI (via mfapi.in), cached in memory.
     */
    private List<SchemeRef> getMasterList() {
        long now = System.currentTimeMillis();
        List<SchemeRef> cached = cachedMasterList;

        if (cached != null && (now - masterListFetchedAt) < masterListTtlMinutes * 60_000L) {
            return cached;
        }

        synchronized (this) {
            if (cachedMasterList != null && (now - masterListFetchedAt) < masterListTtlMinutes * 60_000L) {
                return cachedMasterList;
            }
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(baseUrl, String.class);
                JsonNode root = objectMapper.readTree(response.getBody());

                List<SchemeRef> parsed = new ArrayList<>();
                if (root.isArray()) {
                    for (JsonNode node : root) {
                        String code = node.path("schemeCode").asText(null);
                        String name = node.path("schemeName").asText(null);
                        if (code != null && name != null) {
                            parsed.add(new SchemeRef(code, name));
                        }
                    }
                }

                cachedMasterList = parsed;
                masterListFetchedAt = now;
                return parsed;

            } catch (Exception e) {
                if (cachedMasterList != null) {
                    // Serve stale data rather than fail outright if AMFI/mfapi is briefly down.
                    return cachedMasterList;
                }
                throw new FundDataException(
                        "Could not reach the mutual fund data provider (mfapi.in) to list schemes. " +
                                "Please try again shortly.", e);
            }
        }
    }

    /**
     * Full daily NAV history for a scheme, resampled to one point per
     * calendar month (the last trading day's NAV in that month), covering
     * up to the last `maxMonths` months. Real data, fetched live.
     */
    public List<NavPoint> getMonthlyHistory(String schemeCode, int maxMonths) {
        CachedHistory cached = historyCache.get(schemeCode);
        long now = System.currentTimeMillis();

        if (cached != null && (now - cached.fetchedAt) < historyTtlMinutes * 60_000L) {
            return trimToLast(cached.monthly, maxMonths);
        }

        try {
            String url = baseUrl + "/" + schemeCode;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode dataNode = root.path("data");

            if (!dataNode.isArray() || dataNode.isEmpty()) {
                throw new FundDataException(
                        "No NAV history is available for this scheme right now.", null);
            }

            // mfapi.in returns newest-first; parse into (date, nav) and sort ascending.
            List<NavPoint> daily = new ArrayList<>();
            for (JsonNode node : dataNode) {
                String rawDate = node.path("date").asText(null);
                String rawNav = node.path("nav").asText(null);
                if (rawDate == null || rawNav == null) continue;
                try {
                    double nav = Double.parseDouble(rawNav);
                    LocalDate d = LocalDate.parse(rawDate, MFAPI_DATE_FORMAT);
                    daily.add(new NavPoint(d.toString(), nav));
                } catch (Exception ignore) {
                    // skip malformed rows instead of failing the whole request
                }
            }

            daily.sort(Comparator.comparing(NavPoint::date));

            // Resample: keep the last NAV observed in each calendar month.
            Map<YearMonth, NavPoint> lastPerMonth = new LinkedHashMap<>();
            for (NavPoint p : daily) {
                YearMonth ym = YearMonth.from(LocalDate.parse(p.date()));
                lastPerMonth.put(ym, p); // overwritten as later dates in the same month are seen
            }

            List<NavPoint> monthly = new ArrayList<>(lastPerMonth.values());

            if (monthly.size() < 6) {
                throw new FundDataException(
                        "Not enough NAV history is available for this scheme to run analysis.", null);
            }

            historyCache.put(schemeCode, new CachedHistory(monthly, now));
            return trimToLast(monthly, maxMonths);

        } catch (FundDataException e) {
            throw e;
        } catch (Exception e) {
            if (cached != null) {
                return trimToLast(cached.monthly, maxMonths);
            }
            throw new FundDataException(
                    "Could not fetch live NAV data for this scheme from mfapi.in. Please try again shortly.", e);
        }
    }

    private List<NavPoint> trimToLast(List<NavPoint> points, int maxMonths) {
        if (points.size() <= maxMonths) return points;
        return points.subList(points.size() - maxMonths, points.size());
    }

    public String schemeNameFor(String schemeCode) {
        return getMasterList().stream()
                .filter(s -> s.schemeCode().equals(schemeCode))
                .map(SchemeRef::schemeName)
                .findFirst()
                .orElse(schemeCode);
    }
}
