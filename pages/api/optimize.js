import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { seedPrompt } = req.body;
  if (!seedPrompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert AI image prompt engineer." },
        { role: "user", content: `Enhance this prompt: "${seedPrompt}"` },
      ],
      temperature: 0.7,
    });

    res.status(200).json({ enhancedPrompt: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Failed to enhance prompt" });
  }
}
