import React from "react";
import { useNavigate } from "react-router-dom";

const ReportsHome = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px",
            }}
        >
            <h2>Reports Dashboard</h2>

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/hr/candidates-report")}
                    style={{
                        marginRight: "20px",
                        padding: "12px 22px",
                        backgroundColor: "#0074D9",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Candidates Report
                </button>

                <button
                    onClick={() => navigate("/hr/interviews-report")}
                    style={{
                        padding: "12px 22px",
                        backgroundColor: "#28A745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Interviews Report
                </button>
            </div>
        </div>
    );
};

export default ReportsHome;
