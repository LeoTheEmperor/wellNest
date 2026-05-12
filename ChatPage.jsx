import { useState, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import InputBox from "../components/InputBox";

function ChatPage({ userId }) {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  // Create a new chat session when component loads
  useEffect(() => {
    if (!currentChat && userId) {
      createNewChat();
    }
  }, [userId, currentChat]);

  const createNewChat = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/new_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await res.json();
      if (data.chat_id) {
        setCurrentChat(data.chat_id);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  // Send message
  const handleSend = async (text) => {
    if (!currentChat) return;

    const userMsg = { text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          chat_id: currentChat
        })
      });

      const data = await response.json();

      const botMsg = { 
        text: data.reply, 
        sender: "bot",
        mood: data.mood,
        emoji: data.emoji,
        suggestions: data.suggestions,
        isCrisis: data.is_crisis,
        hotline: data.hotline
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg = { 
        text: "Sorry, I'm having trouble connecting. Please try again.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      padding: "20px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ 
          margin: "0", 
          color: "#764ba2", 
          fontSize: "28px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}>
          WellNest
          <span style={{ fontSize: "24px" }}>{"\ud83d\udc9c"}</span>
        </h2>
      </div>

      {currentChat ? (
        <>
          <ChatBox messages={messages} />
          <InputBox onSend={handleSend} />
        </>
      ) : (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "70vh",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>{"\ud83d\udc9c"}</div>
          <h3 style={{ 
            margin: "0 0 15px 0", 
            color: "#764ba2", 
            fontSize: "32px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}>
            Welcome to WellNest
            <span style={{ fontSize: "24px" }}>{"\ud83d\udc9c"}</span>
          </h3>
          <p style={{ 
            margin: "0 0 10px 0", 
            color: "#666", 
            fontSize: "18px",
            fontWeight: "400"
          }}>
            Your mental health companion
          </p>
          <p style={{ 
            margin: "0", 
            color: "#888", 
            fontSize: "16px"
          }}>
            Creating a new chat session...
          </p>
          <div style={{ 
              marginTop: "30px",
              padding: "15px 30px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}>
              {"\ud83d\udc9d"} Starting your chat...
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;