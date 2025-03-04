import React, { useState } from "react";
import axios from "axios";

function App() {
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("md5");
    const [method, setMethod] = useState("brute-force");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [showSignup, setShowSignup] = useState(false); // ✅ Toggle between Signup & Cracker
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signupMessage, setSignupMessage] = useState("");

    // ✅ Backend API URLs
    const API_URL = "https://hashed-password-cracker-backend.onrender.com/crack";
    const SIGNUP_URL = "https://hashed-password-cracker-backend.onrender.com/signup";

    // ✅ Handle Password Cracking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        try {
            const response = await axios.post(API_URL, { hash, algorithm, method });
            setResult(response.data);
        } catch (error) {
            setError("Failed to connect to backend. Check console for details.");
        }
    };

    // ✅ Handle User Signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupMessage("");

        try {
            const response = await axios.post(SIGNUP_URL, { username, password });
            setSignupMessage(response.data.message);
        } catch (error) {
            setSignupMessage(error.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
            <h2>🔐 Hashed Password Cracker</h2>

            {/* ✅ Toggle Between Signup and Cracker */}
            <button 
                onClick={() => setShowSignup(!showSignup)} 
                style={{ padding: "10px 20px", marginBottom: "10px", cursor: "pointer" }}>
                {showSignup ? "Go to Cracker" : "Go to Signup"}
            </button>

            {showSignup ? (
                // ✅ Signup Form
                <div>
                    <h2>🔑 Signup</h2>
                    <form onSubmit={handleSignup}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
                        />
                        <br />
                        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>Signup</button>
                    </form>

                    {signupMessage && <p style={{ color: "green", fontWeight: "bold" }}>{signupMessage}</p>}
                </div>
            ) : (
                // ✅ Password Cracker Form
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
                        <option value="sha512">SHA-512</option>
                    </select>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}
                        style={{ padding: "10px" }}>
                        <option value="brute-force">Brute Force</option>
                        <option value="dictionary">Dictionary Attack</option>
                        <option value="rainbow-table">Rainbow Table Attack</option>
                    </select>
                    <br /><br />
                    <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>Crack Password</button>
                </form>
            )}

            {/* ✅ Error Message */}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            {/* ✅ Password Cracking Result */}
            {result && !showSignup && (
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
