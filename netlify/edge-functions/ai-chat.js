import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.20.4";

export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({ apiKey: Netlify.env.get("ANTHROPIC_API_KEY") });

    const chatCompletion = await client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      system: "You are a helpful assistant knowledgeable about Pokémon.",
      messages: [{ role: "user", content: message }],
    });

    return new Response(JSON.stringify({ response: chatCompletion?.content?.[0]?.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/chat",
};