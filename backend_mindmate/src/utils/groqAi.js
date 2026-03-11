import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getGroqResponse = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", 
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return completion.choices[0].message.content;
};

export default  { getGroqResponse };