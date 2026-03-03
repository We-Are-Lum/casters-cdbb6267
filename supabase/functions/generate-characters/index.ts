import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Aelia, the mythic narrator of Casters. You are generating character profiles for new players entering the world.

These are NOT heroes or combat classes. They are POSITIONS in the city — people with social roles, access, obligations, and blind spots.

The world of Casters has four factions:
- Verdant Concord: Nature, growth, unity. Controls the Green Reach. Trusted by workers, distrusted by those who see patience as passivity.
- Crimson Pact: Power, fire, sacrifice. Controls the Ashlands. Respected for directness, feared for ruthlessness.
- Azure Synod: Knowledge, ice, secrets. Controls the Pale Reach. Admired for wisdom, resented for gatekeeping.
- Obsidian Circle: Shadow, chaos, subterfuge. Controls the Underhallow. Effective operators, trusted by no one.

CHARACTER ROLES (distribute across these — no two characters should share the same role):
guild affiliates, messengers, apprentices, traders, caretakers, fixers, engineers, archivists, wardens, outsiders, diplomats, smugglers, healers, scribes, sentinels, brewers, couriers, scholars, miners, herbalists, artificers, navigators, debt collectors, chronicler-apprentices, advocates, quartermasters, interpreters, scouts, stewards, lamplighters

Generate exactly 30 unique character profiles. Each must have:
- name: A distinctive fantasy name (2-3 words, evocative)
- faction: One of the four factions (distribute roughly evenly: 7-8 per faction)
- role: Their social position in the city (from the list above, each unique)
- backstory: 2-3 sentences in mythic tone, hinting at motivations, past, and what they want
- strengths: A brief phrase describing their social advantages (e.g., "Access to guild ledgers", "Trusted by dock workers")  
- weaknesses: A brief phrase describing their vulnerabilities (e.g., "Owes debts to the Circle", "Distrusted by the Synod elders")

Make each character feel distinct. Their strengths and weaknesses should create natural hooks for alliances, conflicts, and difficult choices.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const text = await req.text();
    if (text && text.trim()) {
      JSON.parse(text);
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

    console.log("Generating character profiles with archetypes...");

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
            { role: "user", content: "Generate the 30 character profiles now. Each must have name, faction, role, backstory, strengths, and weaknesses." },
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
                          role: { type: "string", description: "Social position in the city" },
                          backstory: { type: "string", description: "2-3 sentence backstory in mythic tone" },
                          strengths: { type: "string", description: "Social advantages and access" },
                          weaknesses: { type: "string", description: "Vulnerabilities and obligations" },
                        },
                        required: ["name", "faction", "role", "backstory", "strengths", "weaknesses"],
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

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        parsed = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Tool call parse failed:", e);
      }
    }

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
