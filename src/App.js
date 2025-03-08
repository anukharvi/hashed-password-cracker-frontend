import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Import CSS for styling

function App() {
    const [showCracker, setShowCracker] = useState(false);
    const [isLogin, setIsLogin] = useState(false); // ✅ Toggle between Signup/Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authMessage, setAuthMessage] = useState("");
    const [authSuccess, setAuthSuccess] = useState(false);
    const [hash, setHash] = useState("");
    const [algorithm, setAlgorithm] = useState("md5");
    const [method, setMethod] = useState("brute-force");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ API URLs
    const API_URL = "https://hashed-password-cracker-backend.onrender.com/crack";
    const SIGNUP_URL = "https://hashed-password-cracker-backend.onrender.com/signup";
    const LOGIN_URL = "https://hashed-password-cracker-backend.onrender.com/login";

    // ✅ Handle Signup/Login
    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthMessage("");

        const url = isLogin ? LOGIN_URL : SIGNUP_URL;

        try {
            const response = await axios.post(url, { username, password });
            setAuthMessage(response.data.message);
            setAuthSuccess(true);
        } catch (error) {
            setAuthMessage(error.response?.data?.error || (isLogin ? "Login failed" : "Signup failed"));
            setAuthSuccess(false);
        }
    };

    // ✅ Handle Crack Password
    const handleCrack = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const response = await axios.post(API_URL, { hash, algorithm, method });
            setResult(response.data);
        } catch (error) {
            setError("Failed to connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Reset
    const handleReset = () => {
        setHash("");
        setAlgorithm("md5");
        setMethod("brute-force");
        setResult(null);
        setError("");
    };

    return (
        <div className="container">
            {!showCracker ? (
                <div className="card">
                    <h2>{isLogin ? "🔓 Login" : "🔑 Signup"}</h2>
                    <form onSubmit={handleAuth}>
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
                        <button type="submit" className="btn">{isLogin ? "Login" : "Signup"}</button>
                    </form>

                    {authMessage && <p className={`message ${authSuccess ? "success" : "error"}`}>{authMessage}</p>}

                    {authSuccess && (
                        <div>
                            <button onClick={() => setShowCracker(true)} className="btn">
                                Go to Crack Password
                            </button>
                        </div>
                    )}

                    <hr className="divider" />
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button className="btn-link" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Signup" : "Login"}
                        </button>
                    </p>

                    <button onClick={() => setShowCracker(true)} className="btn btn-secondary">
                        Skip & Crack Password
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
                        <button type="button" onClick={handleReset} className="btn btn-reset">Reset</button>
                    </form>

                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Cracking in progress... Please wait ⏳</p>
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    {result && !loading && (
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
                        Back to Signup/Login
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
