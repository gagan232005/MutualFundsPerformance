export default function AMCSelector({ selectedAMC, onSelect, amcList }) {
    return (
        <select
            className="select"
            value={selectedAMC}
            onChange={(e) => onSelect(e.target.value)}
        >
            <option value="">Select AMC</option>
            {amcList.map((amc) => (
                <option key={amc} value={amc}>
                    {amc}
                </option>
            ))}
        </select>
    );
}