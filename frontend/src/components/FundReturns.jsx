import React from "react";

export default function FundReturns({ fund }) {
    if (!fund) return null;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 rounded-2xl bg-[#071826] border border-[#122]">
            <h2 className="text-2xl font-bold text-sky-300 mb-4">
                Fund Returns Overview
            </h2>

            <table className="w-full text-left text-white">
                <thead className="text-sky-400 text-sm border-b border-[#123]">
                <tr>
                    <th className="p-2">Fund Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">NAV (Rs.)</th>
                    <th className="p-2">AUM (Cr)</th>
                    <th className="p-2">5Y Return (%)</th>
                    <th className="p-2">10Y Return (%)</th>
                </tr>
                </thead>

                <tbody>
                <tr className="text-sm">
                    <td className="p-3 font-semibold">{fund.name}</td>
                    <td className="p-3">{fund.type}</td>
                    <td className="p-3">{fund.nav}</td>
                    <td className="p-3">{fund.aum}</td>
                    <td className="p-3 text-green-400">{fund.return5}</td>
                    <td className="p-3 text-green-400">{fund.return10}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
