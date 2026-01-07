export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Only POST allowed", { status: 405 });
  }

  const body = await req.json();

  return new Response(
    JSON.stringify({
      reply: "Hello from your AI Chatbot API 🚀",
      input: body.message,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
