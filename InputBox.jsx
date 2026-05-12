import { useState } from "react";

function InputBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSend();
    e.preventDefault();
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="How are you feeling today?"
        style={{
          flex: 1,
          padding: "14px 16px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none"
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "14px 24px",
          borderRadius: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }}
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;