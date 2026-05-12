import Message from "./Message";

function ChatBox({ messages }) {
  return (
    <div
      style={{
        height: "70vh",
        overflowY: "auto",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        marginBottom: "10px"
      }}
    >
      {messages.map((msg, index) => (
        <Message 
          key={index} 
          text={msg.text} 
          sender={msg.sender}
          mood={msg.mood}
          emoji={msg.emoji}
          suggestions={msg.suggestions}
          isCrisis={msg.isCrisis}
          hotline={msg.hotline}
          isError={msg.isError}
        />
      ))}
    </div>
  );
}

export default ChatBox;