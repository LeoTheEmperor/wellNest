import { useState } from "react";

function Message({ text, sender, mood, emoji, suggestions, isCrisis, hotline, isError }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isUser = sender === "user";

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        margin: "8px"
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        {/* Message bubble */}
        <div
          style={{
            backgroundColor: isError ? "#ff6b6b" : (isUser ? "#4CAF50" : "#e5e5ea"),
            color: isError ? "white" : (isUser ? "white" : "black"),
            padding: "12px 15px",
            borderRadius: "15px",
            position: "relative"
          }}
        >
          {/* Mood emoji for bot messages */}
          {!isUser && !isError && emoji && (
            <span style={{ marginRight: "8px" }}>{emoji}</span>
          )}
          
          {text}
          
          {/* Mood indicator for bot messages */}
          {!isUser && !isError && mood && mood !== 'neutral' && (
            <div style={{
              fontSize: "11px",
              opacity: 0.8,
              marginTop: "5px",
              fontStyle: "italic"
            }}>
              Mood detected: {mood}
            </div>
          )}
        </div>

        {/* Crisis alert */}
        {!isUser && !isError && isCrisis && (
          <div style={{
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "8px",
            color: "#c62828"
          }}>
            <strong>🚨 Crisis Support</strong>
            <div style={{ marginTop: "5px" }}>
              If you're in immediate distress, please call: {hotline}
            </div>
          </div>
        )}

        {/* Suggestions toggle button */}
        {!isUser && !isError && suggestions && suggestions.length > 0 && (
          <button
            onClick={toggleSuggestions}
            style={{
              backgroundColor: "#e3f2fd",
              border: "1px solid #2196f3",
              borderRadius: "8px",
              padding: "8px 12px",
              marginTop: "8px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#1976d2"
            }}
          >
            {showSuggestions ? "Hide" : "Show"} Suggestions 💡
          </button>
        )}

        {/* Suggestions list */}
        {!isUser && !isError && suggestions && showSuggestions && (
          <div style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "8px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>
              Suggestions for you:
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "8px",
                  margin: "4px 0",
                  borderRadius: "5px",
                  fontSize: "13px",
                  borderLeft: "3px solid #4CAF50"
                }}
              >
                • {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;