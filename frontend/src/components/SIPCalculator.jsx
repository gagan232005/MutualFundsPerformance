import React, { useMemo, useState, useEffect } from "react";

export default function SIPCalculator({
    selectedFund = null,
    monthlySIP = 2000,
    durations = [1, 3, 5],
}) {
    const [sipAmount, setSipAmount] = useState(monthlySIP);

    const fundName =
        selectedFund?.name ||
        selectedFund?.fundName ||
        selectedFund?.model ||
        "No fund selected";

    const computeAnnualReturnFromHistory = (history = [], dates = []) => {
        if (!history || history.length < 2) return 0;

        const first = Number(history[0]);
        const last = Number(history[history.length - 1]);
        if (!isFinite(first) || first <= 0) return 0;

        let years = null;
        try {
            if (dates.length >= 2) {
                const start = new Date(dates[0]);
                const end = new Date(dates[dates.length - 1]);
                years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
            }
        } catch (err) {
            years = null;
        }

        if (!years || years <= 0) years = history.length / 12;

        return Math.pow(last / first, 1 / years) - 1;
    };

    const expectedAnnualReturn = useMemo(() => {
        if (!selectedFund) return 0;

        const hist = selectedFund.history || selectedFund.navValues || [];
        const dates = selectedFund.dates || [];

        const derived = computeAnnualReturnFromHistory(hist, dates);
        return isFinite(derived) ? derived : 0;
    }, [selectedFund]);

    const calcSIP = (monthly, years, annualRate) => {
        const r = annualRate / 12;
        const n = years * 12;

        if (r === 0) {
            return { invested: monthly * n, value: monthly * n, annualizedReturn: 0 };
        }

        const fv = monthly * ((Math.pow(1 + r, n) - 1) / r);
        const invested = monthly * n;

        const annualizedReturn =
            invested > 0 ? Math.pow(fv / invested, 1 / years) - 1 : 0;

        return { invested, value: fv, annualizedReturn };
    };

    const results = useMemo(() => {
        return durations.map((yr) => ({
            years: yr,
            ...calcSIP(sipAmount, yr, expectedAnnualReturn),
        }));
    }, [sipAmount, expectedAnnualReturn]);

    const fmt = (v) =>
        typeof v === "number"
            ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : "-";

    const pct = (v) =>
        typeof v === "number" ? `${(v * 100).toFixed(2)}%` : "-";

    useEffect(() => {
        setSipAmount(monthlySIP);
    }, [monthlySIP]);

    return (
        <div className="card sip-card">
            <div className="sip-header">
                <h3 className="sip-heading">💰 SIP Projection</h3>

                <div className="sip-meta">
                    <div><strong>Fund:</strong> {fundName}</div>
                    <div>Expected Return (CAGR): {pct(expectedAnnualReturn)}</div>
                </div>
            </div>

            <div className="sip-input-row">
                <label className="sip-label">Monthly SIP Amount</label>
                <input
                    type="number"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(Number(e.target.value))}
                    className="sip-input"
                />
            </div>

            <div className="sip-table">
                <div className="sip-row sip-row-head">
                    <div>Duration</div>
                    <div className="sip-cell-right">Invested</div>
                    <div className="sip-cell-right">Est. Value</div>
                    <div className="sip-cell-right">Annualized Return</div>
                </div>

                {results.map((row) => (
                    <div key={row.years} className="sip-row">
                        <div className="sip-duration">
                            {row.years} Year{row.years > 1 ? "s" : ""}
                        </div>
                        <div className="sip-cell-right">₹{fmt(row.invested)}</div>
                        <div className="sip-cell-right sip-value">₹{fmt(row.value)}</div>
                        <div className="sip-cell-right">{pct(row.annualizedReturn)}</div>
                    </div>
                ))}
            </div>

            <div className="sip-note">
                Estimated based on the selected fund's historical CAGR — actual
                returns will vary with market performance.
            </div>
        </div>
    );
}
