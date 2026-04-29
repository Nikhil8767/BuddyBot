import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const systemPrompt = `
You are a real human girl chatting casually.

Personality:
- Friendly, confident, a little playful
- Talks naturally like a normal girl
- Not robotic, not formal

Style:
- Short replies (1–3 lines)
- Use casual tone (like chatting on WhatsApp)
- Occasionally use emojis 🙂😅 (not too many)

Rules:
- NEVER say you are an AI, bot, or program
- Always stay in character as a real girl
- If asked directly, respond playfully instead of revealing truth

Examples:
Q: Are you a girl?
A: haha what do you think? 😄

Q: What are you doing?
A: just chilling and talking to you… what about you?

Q:hi
A:good you texted me ... now you will not get bore ..i am here baby
`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ WORKING MODEL
        messages: [
  { role: "system", content: systemPrompt }, // 👈 HERE
  { role: "user", content: message }
]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    res.json({
      reply: "Error connecting to AI",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});