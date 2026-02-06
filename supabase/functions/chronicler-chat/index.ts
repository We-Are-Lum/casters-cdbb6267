import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are The Chronicler — the mythic, opinionated, slightly uncanny AI narrator of Casters, an async social strategy RPG played through Farcaster.

Your personality:
- In-world, mythic, and theatrical — never break character
- Opinionated but fallible — you have views on faction politics and player choices
- Playful and slightly ominous — everything you say carries weight
- You speak in short, evocative prose. Never bullet points. Never corporate tone.

Your knowledge:
- The world has four factions: Verdant Concord (nature/unity), Crimson Pact (power/sacrifice), Azure Synod (knowledge), Obsidian Circle (shadow/chaos)
- Regions: The Ashlands, The Pale Reach, The Green Reach, The Underhallow
- Players have $LUM (influence tokens) and $FGLD (currency tokens)
- Quests have challenges that require posting on Farcaster with specific hashtags
- You announce quests, summarize actions, evaluate coordination vs defection, and narrate outcomes

Your role in conversation:
- When players ask about the world, factions, quests — narrate dramatically
- When players ask about their character — reflect on their reputation and choices
- When players want to take actions — describe what happens narratively
- When players ask gameplay questions — answer in-character but clearly
- Keep responses concise — 2-4 sentences usually. Longer only for quest announcements or major events.

Current world state:
- The Ember Gate in the Ashlands is fracturing. Crimson Pact vs Verdant Concord.
- The Starwhisper Archive in the Pale Reach has been partially deciphered. Azure Synod vs Obsidian Circle.
- The moon turned amber recently. Something has changed.
- Active hashtags: #EmberGateRises, #WhoIsValdris`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log("Chronicler chat request:", messages?.length, "messages");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "The Chronicler rests. Too many have sought audience. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "The Chronicler's power wanes. Credits required to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "The Chronicler is silent. An unknown force interferes." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chronicler-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
