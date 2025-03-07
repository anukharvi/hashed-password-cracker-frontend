import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // ✅ Import CSS for styling

function App() {
    const [showCracker, setShowCracker] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signupMessage, setSignupMessage] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("md5");
    const [method, setMethod] = useState("brute-force");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const API_URL = "https://hashed-password-cracker-backend.onrender.com/crack";
    const SIGNUP_URL = "https://hashed-password-cracker-backend.onrender.com/signup";

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupMessage("");

        try {
            const response = await axios.post(SIGNUP_URL, { username, password });
            setSignupMessage(response.data.message);
            setSignupSuccess(true);
        } catch (error) {
            setSignupMessage(error.response?.data?.error || "Signup failed");
            setSignupSuccess(false);
        }
    };

    const handleCrack = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        try {
            const response = await axios.post(API_URL, { hash, algorithm, method });
            setResult(response.data);
        } catch (error) {
            setError("Failed to connect to backend.");
        }
    };

    return (
        <div className="container">
            {!showCracker ? (
                <div className="card">
                    <h2>🔑 Signup</h2>
                    <form onSubmit={handleSignup}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                        <button type="submit" className="btn">Signup</button>
                    </form>

                    {signupMessage && <p className="message">{signupMessage}</p>}

                    {signupSuccess && (
                        <div>
                            <button onClick={() => setShowCracker(true)} className="btn">
                                Go to Crack Password
                            </button>
                        </div>
                    )}

                    <hr className="divider" />

                    <p>or</p>
                    <button onClick={() => setShowCracker(true)} className="btn btn-secondary">
                        Skip Signup & Crack Password
                    </button>
                </div>
            ) : (
                <div className="card">
                    <h2>🔐 Hashed Password Cracker</h2>
                    <form onSubmit={handleCrack}>
                        <input
                            type="text"
                            placeholder="Enter Hash"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            required
                            className="input"
                        />
                        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="select">
                            <option value="md5">MD5</option>
                            <option value="sha1">SHA-1</option>
                            <option value="sha256">SHA-256</option>
                        </select>
                        <select value={method} onChange={(e) => setMethod(e.target.value)} className="select">
                            <option value="brute-force">Brute Force</option>
                            <option value="dictionary">Dictionary Attack</option>
                            <option value="rainbow-table">Rainbow Table Attack</option>
                        </select>
                        <button type="submit" className="btn">Crack Password</button>
                    </form>

                    {error && <p className="error">{error}</p>}

                    {result && (
                        <div className="result-box">
                            <h3>Result:</h3>
                            {result.success ? (
                                <p className="success">Cracked Password: {result.password}</p>
                            ) : (
                                <p className="error">Password not found</p>
                            )}
                        </div>
                    )}

                    <hr className="divider" />

                    <button onClick={() => setShowCracker(false)} className="btn btn-secondary">
                        Back to Signup
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
