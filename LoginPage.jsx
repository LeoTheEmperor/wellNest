import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          onLogin(data.user_id);
        }, 1000);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.message) {
        setSuccess("Signup successful! You can now login.");
        // Clear form for login
        setPassword("");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "350px",
      margin: "100px auto",
      gap: "15px",
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: "0", color: "#4CAF50", fontSize: "28px" }}>
          WellNest
        </h2>
        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
          Your mental health companion
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: "12px",
          backgroundColor: "#ffebee",
          border: "1px solid #f44336",
          borderRadius: "6px",
          color: "#c62828",
          fontSize: "14px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div style={{
          padding: "12px",
          backgroundColor: "#e8f5e8",
          border: "1px solid #4CAF50",
          borderRadius: "6px",
          color: "#2e7d32",
          fontSize: "14px",
          textAlign: "center"
        }}>
          {success}
        </div>
      )}

      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px", fontWeight: "bold" }}>
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.3s",
            boxSizing: "border-box"
          }}
          onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px", fontWeight: "bold" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.3s",
            boxSizing: "border-box"
          }}
          onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: isLoading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {isLoading && (
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ffffff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
          )}
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleSignup}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: isLoading ? "#cccccc" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {isLoading && (
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ffffff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
          )}
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ margin: "0", color: "#666", fontSize: "12px" }}>
          By signing up, you agree to our terms and privacy policy
        </p>
      </div>

      {/* Add CSS animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;