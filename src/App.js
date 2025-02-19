import React, { useState } from "react";
import axios from "axios";

function App() {
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("md5");
    const [method, setMethod] = useState("brute-force");
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/crack", {
                hash,
                algorithm,
                method,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Hashed Password Cracker</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Hash"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                />
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                    <option value="md5">MD5</option>
                    <option value="sha1">SHA-1</option>
                    <option value="sha256">SHA-256</option>
                </select>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="brute-force">Brute Force</option>
                    <option value="dictionary">Dictionary Attack</option>
                </select>
                <button type="submit">Crack</button>
            </form>
            {result && (
                <div>
                    <h3>Result:</h3>
                    {result.success ? (
                        <p>Cracked Password: {result.password}</p>
                    ) : (
                        <p>Password not found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
