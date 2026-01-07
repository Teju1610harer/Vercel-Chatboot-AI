import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  return new Response(
    JSON.stringify({
      reply: "Hello from your AI Chatbot API 🚀",
      input: body.message,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
