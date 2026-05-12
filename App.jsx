import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import PsychiatristPage from "./pages/PsychiatristPage";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUserId(null);
    // Simple redirect without reload issues
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}>
        {/* Navigation Header */}
        <nav style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "15px 25px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
          borderRadius: "0 0 20px 20px"
        }}>
          <h1 style={{ margin: "0", fontSize: "24px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            WellNest
            <span style={{ fontSize: "20px" }}>{"\ud83d\udc9c"}</span>
          </h1>
          
          {userId && (
            <div style={{ display: "flex", gap: "15px" }}>
              <Link 
                to="/chat" 
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "25px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  fontWeight: "500",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.25)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {"\ud83d\udcac"} Chat
              </Link>
              
              <Link 
                to="/psychiatrist" 
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "25px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  fontWeight: "500",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.25)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {"\ud83d\udc68\u200d\u2695\ufe0f"} Psychiatrists
              </Link>
              
              <Link 
                to="/contact" 
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "25px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  fontWeight: "500",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.25)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {"\ud83d\udee1\ufe0f"} Support
              </Link>
              
              {userId && (
                <button
                  onClick={handleLogout}
                  style={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "12px 20px",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {"\ud83d\udeaa"} Logout
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                userId ? <ChatPage userId={userId} /> : <LoginPage onLogin={setUserId} />
              } 
            />
            <Route 
              path="/chat" 
              element={<ChatPage userId={userId} />} 
            />
            <Route 
              path="/psychiatrist" 
              element={<PsychiatristPage />} 
            />
            <Route 
              path="/contact" 
              element={<ContactPage />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;