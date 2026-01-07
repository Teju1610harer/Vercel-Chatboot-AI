import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body || {};

  res.status(200).json({
    reply: 'Hello from your AI Chatbot API 🚀',
    input: message ?? null
  });
}
