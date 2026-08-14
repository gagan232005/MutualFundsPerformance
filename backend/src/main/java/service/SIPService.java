package com.gagan.mutualfunds.service;

import org.springframework.stereotype.Service;
import java.nio.file.*;
import java.util.*;

@Service
public class SIPService {

    public Map<String, String> calculateSIP(String file) throws Exception {

        List<String> lines = Files.readAllLines(Paths.get("data/" + file));
        List<Double> navs = new ArrayList<>();

        for (int i = 1; i < lines.size(); i++) {
            String[] parts = lines.get(i).split(",");
            navs.add(Double.parseDouble(parts[1]));
        }

        Map<String, String> result = new LinkedHashMap<>();
        result.put("1 Year", computeSIPCAGR(navs, 12));
        result.put("3 Years", computeSIPCAGR(navs, 36));
        result.put("5 Years", computeSIPCAGR(navs, 60));

        return result;
    }

    private String computeSIPCAGR(List<Double> navs, int months) {

        if (navs.size() < months) return "N/A";

        double sipAmount = 1000.0;
        double units = 0;
        double invested = 0;

        int start = navs.size() - months;

        for (int i = start; i < navs.size(); i++) {
            invested += sipAmount;
            units += sipAmount / navs.get(i);
        }

        double finalValue = units * navs.get(navs.size() - 1);
        double years = months / 12.0;

        double cagr = Math.pow(finalValue / invested, 1 / years) - 1;

        return String.format("%.2f%%", cagr * 100);
    }
}
