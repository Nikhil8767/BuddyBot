import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message,
      });

      setChat([
        ...chat,
        { role: "user", text: message },
        { role: "bot", text: res.data.reply },
      ]);

      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chatbot 🚀</h2>

      <div>
        {chat.map((msg, i) => (
          <p key={i}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;