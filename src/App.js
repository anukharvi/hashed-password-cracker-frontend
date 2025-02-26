import React, { useState } from "react";
import axios from "axios";

function App() {
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("md5");
    const [method, setMethod] = useState("brute-force");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    // ✅ Correct Backend API URL
    const API_URL = "https://hashed-password-cracker-backend.onrender.com/crack";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setResult(null); // Reset result before new request

        try {
            console.log("🔍 Sending request to backend:", { hash, algorithm, method });

            const response = await axios.post(API_URL, {
                hash,
                algorithm,
                method,
            });

            console.log("✅ API Response:", response.data);
            setResult(response.data);
        } catch (error) {
            console.error("❌ API Error:", error);
            setError("Failed to connect to backend. Check console for details.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
            <h2>🔐 Hashed Password Cracker</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter Hash"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    required
                    style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
                />
                <br />
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
                    style={{ padding: "10px", marginRight: "10px" }}>
                    <option value="md5">MD5</option>
                    <option value="sha1">SHA-1</option>
                    <option value="sha256">SHA-256</option>
                </select>
                <select value={method} onChange={(e) => setMethod(e.target.value)}
                    style={{ padding: "10px" }}>
                    <option value="brute-force">Brute Force</option>
                    <option value="dictionary">Dictionary Attack</option>
                </select>
                <br /><br />
                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>Crack Password</button>
            </form>

            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            {result && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray", display: "inline-block" }}>
                    <h3>Result:</h3>
                    {result.success ? (
                        <p style={{ color: "green", fontWeight: "bold" }}>Cracked Password: {result.password}</p>
                    ) : (
                        <p style={{ color: "red", fontWeight: "bold" }}>Password not found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
