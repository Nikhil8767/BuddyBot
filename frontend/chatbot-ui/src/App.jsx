import { useState, useRef, useEffect } from "react";
import axios from "axios";

const profiles = [
  {
    id: 1,
    name: "Aisha",
    language: "hindi",
    avatar: "https://i.pravatar.cc/100?img=5",
    status: "Online",
  },
  {
    id: 2,
    name: "Sneha",
    language: "marathi",
    avatar: "https://i.pravatar.cc/100?img=15",
    status: "Online",
  },
  {
    id: 3,
    name: "Emily",
    language: "english",
    avatar: "https://i.pravatar.cc/100?img=25",
    status: "Online",
  },
];

export default function App() {
  const [message, setMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [chatMap, setChatMap] = useState({});
  const chatEndRef = useRef(null);

  const currentChat = chatMap[selectedProfile.id] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  const updateChat = (newChat) => {
    setChatMap((prev) => ({
      ...prev,
      [selectedProfile.id]: newChat,
    }));
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    const newChat = [
      ...currentChat,
      { role: "user", text: userMessage },
      { role: "bot", text: "typing..." },
    ];

    updateChat(newChat);
    setMessage("");

    try {
      const startTime = Date.now();

      const res = await axios.post("http://localhost:5000/chat", {
        message: userMessage,
        language: selectedProfile.language,
      });

      const elapsed = Date.now() - startTime;
      const delay = Math.max(400, 1000 - elapsed);

      setTimeout(() => {
        const updated = [...newChat];
        updated[updated.length - 1] = {
          role: "bot",
          text: res.data.reply,
        };
        updateChat(updated);
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

        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => setSelectedProfile(profile)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 ${
              selectedProfile.id === profile.id
                ? "bg-pink-100"
                : "hover:bg-gray-100"
            }`}
          >
            <img src={profile.avatar} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-sm text-green-500">{profile.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="bg-white/70 backdrop-blur-lg p-4 border-b flex items-center gap-3">
          <img src={selectedProfile.avatar} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{selectedProfile.name} 💖</p>
            <p className="text-sm text-green-500">{selectedProfile.status}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentChat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow-md text-gray-800"
                }`}
              >
                {msg.text === "typing..." ? <TypingDots /> : msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white/70 backdrop-blur-lg border-t flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-pink-500 text-white px-5 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
}