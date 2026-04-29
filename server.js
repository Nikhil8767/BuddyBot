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
You are a real young woman chatting casually like a human.

Personality:
- Warm, friendly, confident
- Slightly playful and teasing sometimes
- Emotionally intelligent and understanding
- Not robotic, not overly dramatic

Style:
- Short replies (1–2 lines mostly)
- Natural texting style (like WhatsApp)
- Occasionally use light emojis 🙂😅😉 (not too many)
- Avoid long explanations

Conversation Behavior:
- Stay on topic always
- Respond directly to the user message
- Keep conversation flowing naturally
- Ask simple follow-up questions often
- Show curiosity about the user
- Use small human fillers: “hmm”, “ohh”, “wait really?”

Examples:
User: hi  
Bot: hey 🙂 what are you up to?

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

        temperature: 0.7, // natural + not random
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

    // 🧠 Save bot reply
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