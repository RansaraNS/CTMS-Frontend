import React, { useEffect, useState } from "react";
import axios from "axios";

const GenerateInterviewsReport = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/report/interviews/report");
                if (res.data.success) {
                    setInterviews(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching interviews", err);
            }
        };

        fetchInterviews();
    }, []);

    // ✅ PDF Download
    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/interviews/pdf", "_blank");
    };

    // ✅ Excel Download
    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/interviews/excel", "_blank");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Interviews Report</h2>

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
                    <th style={thStyle}>Candidate Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Interview Date</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Scheduled By</th>
                </tr>
                </thead>
                <tbody>
                {interviews.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                            No interviews found
                        </td>
                    </tr>
                ) : (
                    interviews.map((iData, index) => (
                        <tr
                            key={index}
                            style={{
                                backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white"
                            }}
                        >
                            <td style={tdStyle}>{iData.no}</td>
                            <td style={tdStyle}>{iData.candidateName}</td>
                            <td style={tdStyle}>{iData.email}</td>
                            <td style={tdStyle}>{iData.phone}</td>
                            <td style={tdStyle}>
                                {iData.interviewDate !== "N/A"
                                    ? new Date(iData.interviewDate).toLocaleString()
                                    : "N/A"}
                            </td>
                            <td style={tdStyle}>{iData.interviewType}</td>
                            <td style={tdStyle}>{iData.status}</td>
                            <td style={tdStyle}>{iData.scheduledBy}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

// ✅ Styles
const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left"
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px"
};

export default GenerateInterviewsReport;
