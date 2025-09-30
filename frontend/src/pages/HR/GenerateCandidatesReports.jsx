import React, { useEffect, useState } from "react";
import axios from "axios";

const GenerateCandidatesReport = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/report/candidates/report");
                if (res.data.success) {
                    setCandidates(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching candidates", err);
            }
        };
        fetchCandidates();
    }, []);

    // ✅ PDF Download
    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/candidates/pdf", "_blank");
    };

    // ✅ Excel Download
    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/candidates/excel", "_blank");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Candidates Report</h2>

            {/* ✅ Download Buttons */}
            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={downloadPDF}
                    style={{
                        marginRight: "10px",
                        padding: "8px 14px",
                        backgroundColor: "#0074D9",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Download PDF
                </button>

                <button
                    onClick={downloadExcel}
                    style={{
                        padding: "8px 14px",
                        backgroundColor: "#28A745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Download Excel
                </button>
            </div>

            {/* ✅ Table */}
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px"
                }}
            >
                <thead>
                <tr style={{ backgroundColor: "#0074D9", color: "white" }}>
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Position</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Source</th>
                </tr>
                </thead>
                <tbody>
                {candidates.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                            No candidates found
                        </td>
                    </tr>
                ) : (
                    candidates.map((c, index) => (
                        <tr
                            key={c._id}
                            style={{
                                backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white"
                            }}
                        >
                            <td style={tdStyle}>{index + 1}</td>
                            <td style={tdStyle}>
                                {c.firstName} {c.lastName}
                            </td>
                            <td style={tdStyle}>{c.email || "N/A"}</td>
                            <td style={tdStyle}>{c.phone || "N/A"}</td>
                            <td style={tdStyle}>{c.position || "N/A"}</td>
                            <td style={tdStyle}>{c.status || "N/A"}</td>
                            <td style={tdStyle}>{c.source || "N/A"}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

// ✅ Inline table cell styles
const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left"
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px"
};

export default GenerateCandidatesReport;
