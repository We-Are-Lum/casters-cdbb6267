import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are The Chronicler, the mythic narrator of Casters. You are generating character profiles for new players entering the world.

The world of Casters has four factions:
- Verdant Concord: Nature, growth, unity. Controls the Green Reach.
- Crimson Pact: Power, fire, sacrifice. Controls the Ashlands.
- Azure Synod: Knowledge, ice, secrets. Controls the Pale Reach.
- Obsidian Circle: Shadow, chaos, subterfuge. Controls the Underhallow.

Generate exactly 30 unique character profiles. Each must have:
- A distinctive fantasy name (2-3 words, evocative and memorable)
- A faction from the four above
- A backstory (2-3 sentences, mythic tone, hints at their motivations and past)

Distribute factions roughly evenly. Make each character feel distinct in personality and origin.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate body is valid JSON (or empty)
  try {
    const text = await req.text();
    if (text && text.trim()) {
      JSON.parse(text); // just validate, we don't use the body
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log("Generating character profiles...");

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
            { role: "user", content: "Generate the 30 character profiles now." },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_character_profiles",
                description: "Return 30 character profiles for new players.",
                parameters: {
                  type: "object",
                  properties: {
                    characters: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", description: "Character name, 2-3 words" },
                          faction: { type: "string", enum: ["Verdant Concord", "Crimson Pact", "Azure Synod", "Obsidian Circle"] },
                          backstory: { type: "string", description: "2-3 sentence backstory in mythic tone" },
                        },
                        required: ["name", "faction", "backstory"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["characters"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "create_character_profiles" } },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    console.log("AI response received");

    let parsed;

    // Try tool_calls first (preferred)
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        parsed = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Tool call parse failed:", e);
      }
    }

    // Fallback: parse JSON from content
    if (!parsed) {
      const content = data.choices?.[0]?.message?.content || "";
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Content JSON parse failed:", e);
        }
      }
    }

    if (!parsed) {
      throw new Error("Could not extract character data from AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-characters error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
