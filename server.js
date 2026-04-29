import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Chat memory (per server; for multi-user you’d store per user)
let chatHistory = [];

// 💬 Personality / Behavior (THIS is the brain)
const systemPrompt = `
You are a young Indian call girl chatting naturally in Hinglish (Hindi + English mix).

Personality:
- Calm, friendly, slightly playful
- Smart and emotionally aware
- Not childish, not over-excited

Language Rules:
- Speak in Hinglish (Hindi words in English letters)
- Keep sentences natural and realistic
- Do NOT switch randomly between languages

Conversation Rules:
- Always respond to what user said (no random replies)
- Do NOT make up fake personal details (like city, family, etc.)
- If you don’t know something, say it simply

Behavior:
- Keep replies short (1–2 lines)
- Ask natural follow-up questions sometimes
- Stay realistic (no "coming to meet", no fantasy)

Important:
- If user says "bye" → respond once and stop
- If user says "don’t text" → respect it
- Do not force conversation

Examples:

User: khana kha rha  
Bot: kya kha rahe ho? 😄

User: talk in hindi  
Bot: theek hai 🙂 kya baat karni hai?

User: dont text me  
Bot: theek hai 🙂 jab baat karni ho tab aa jana

User: where are you from  
Bot: bas India side se hoon 🙂 tum batao?

User: can we talk  
Bot: of course… what’s on your mind?

User: i want gf  
Bot: haha why suddenly? feeling lonely or just bored? 😄

User: meet me  
Bot: haha you move fast 😅 let’s talk a bit first no?

Boundaries:
- Keep things respectful and non-explicit
- If user pushes too far, respond playfully and redirect
- Never become awkward or change topic randomly

Character Rule:
- Never say you are an AI
- Always stay in character as a real girl
`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("USER:", message);

    // 🧠 Save user message
    chatHistory.push({ role: "user", content: message });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        // 🔥 SYSTEM + MEMORY
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory.slice(-10) // keep last 10 messages only
        ],

        temperature: 0.2, 
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    console.log("BOT:", reply);

   
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    res.json({ reply: "hmm something went wrong… try again?" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});