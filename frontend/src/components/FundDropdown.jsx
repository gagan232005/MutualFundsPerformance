export default function FundDropdown({ setAMC, setFund }) {
    const amcs = ["SBI", "HDFC", "ICICI", "AXIS", "KOTAK"];

    const fundMap = {
        SBI: ["sbi_1y", "sbi_3y"],
        HDFC: ["hdfc_1y", "hdfc_3y"],
        ICICI: ["icici_1y", "icici_3y"],
        AXIS: ["axis_1y", "axis_3y"],
        KOTAK: ["kotak_1y", "kotak_3y"],
    };

    return (
        <div>
            <label>Select AMC</label>
            <select
                className="dropdown"
                onChange={(e) => setAMC(e.target.value)}
            >
                <option value="">Select AMC</option>
                {amcs.map((a) => (
                    <option key={a}>{a}</option>
                ))}
            </select>

            <label>Select Fund ({amcs})</label>
            <select
                className="dropdown"
                onChange={(e) => setFund(e.target.value)}
            >
                <option value="">Select Fund</option>
                {fundMap[amcs]?.map((f) => (
                    <option value={f}>{f}</option>
                ))}
            </select>
        </div>
    );
}
