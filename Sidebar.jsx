import { useState, useEffect } from "react";

function Sidebar({ onSelectChat, userId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(() => {
    // Try to restore last selected chat from localStorage
    return localStorage.getItem('currentChat') || null;
  });

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id: userId })
        });

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  // Sync selected chat ID with localStorage
  useEffect(() => {
    localStorage.setItem('currentChat', selectedChatId);
  }, [selectedChatId]);

  const handleNewChat = async () => {
    if (!userId) {
      alert("Please log in first");
      return;
    }

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
        onSelectChat(data.chat_id);
        setSelectedChatId(data.chat_id);
        // Refresh chats list
        setChats(prev => [{ id: data.chat_id, title: "New Chat" }, ...prev]);
      } else {
        alert("Failed to create chat");
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
      alert("Failed to connect to server. Please check if backend is running.");
    }
  };

  const handleSelectChat = (chatId) => {
    onSelectChat(chatId);
    setSelectedChatId(chatId);
  };

  return (
    <div style={{
      width: "280px",
      padding: "25px",
      borderRight: "1px solid rgba(102, 126, 234, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      boxShadow: "4px 0 15px rgba(102, 126, 234, 0.1)"
    }}>
      <div style={{ 
        textAlign: "center", 
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "2px solid rgba(102, 126, 234, 0.2)"
      }}>
        <h3 style={{ 
          margin: "0", 
          color: "#764ba2", 
          fontSize: "24px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}>
          WellNest
          <span style={{ fontSize: "20px" }}>{"\ud83d\udc9c"}</span>
        </h3>
      </div>
      
      <button
        onClick={handleNewChat}
        style={{
          width: "100%",
          padding: "12px 20px",
          marginBottom: "25px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
        }}
      >
        {"\u2728"} New Chat
      </button>

      <div>
        <h4>Chats</h4>
        {loading ? (
          <p>Loading chats...</p>
        ) : (
          <div>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                style={{
                  padding: "14px",
                  margin: "8px 0",
                  backgroundColor: selectedChatId === chat.id ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(255, 255, 255, 0.8)",
                  color: selectedChatId === chat.id ? "white" : "#333",
                  borderRadius: "15px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: selectedChatId === chat.id ? "2px solid rgba(102, 126, 234, 0.5)" : "1px solid rgba(102, 126, 234, 0.2)",
                  boxShadow: selectedChatId === chat.id ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
                onMouseEnter={(e) => {
                  if (selectedChatId !== chat.id) {
                    e.target.style.backgroundColor = "#d4d4d4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChatId !== chat.id) {
                    e.target.style.backgroundColor = "#e9ecef";
                  }
                }}
              >
                <div style={{ 
                  fontWeight: "600", 
                  marginBottom: "6px",
                  color: selectedChatId === chat.id ? "white" : "#764ba2"
                }}>
                  {chat.title}
                </div>
                <div style={{ 
                  fontSize: "11px", 
                  opacity: selectedChatId === chat.id ? 0.8 : 0.6,
                  color: selectedChatId === chat.id ? "white" : "#666"
                }}>
                  Chat #{chat.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;