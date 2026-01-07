import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.status(200).json({
    reply: "Hello from your AI Chatbot API 🚀",
    input: req.body?.message || null
  });
}
