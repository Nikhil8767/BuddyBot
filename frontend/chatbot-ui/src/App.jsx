import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // 🔄 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // 👉 show instantly (no delay feeling)
    setChat((prev) => [
      ...prev,
      { role: "user", text: userMessage },
      { role: "bot", text: "typing..." },
    ]);

    setMessage("");

    try {
      const startTime = Date.now();

      const res = await axios.post("http://localhost:5000/chat", {
        message: userMessage,
      });

      const elapsed = Date.now() - startTime;

      // 🧠 smart delay (fast but natural)
      const delay = Math.max(400, 1000 - elapsed);

      setTimeout(() => {
        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "bot",
            text: res.data.reply,
          };
          return updated;
        });
      }, delay);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-pink-100 to-purple-200">

      {/* Sidebar */}
      <div className="w-1/4 bg-white/70 backdrop-blur-lg border-r p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Chats</h2>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-100 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=5"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">Aisha</p>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="bg-white/70 backdrop-blur-lg p-4 border-b flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?img=5"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">Aisha 💖</p>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-white shadow-md text-gray-800"
                }`}
              >
                {msg.text === "typing..." ? (
                  <TypingDots />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white/70 backdrop-blur-lg border-t flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// 💬 Typing animation
function TypingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
}