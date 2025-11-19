import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize the Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// --- 1. REFINED SYSTEM PROMPTS ---
// These prompts establish a more professional and expert persona for the AI.
const SYSTEM_PROMPTS = {
  biography: `You are an elite music journalist for a publication like Rolling Stone. Your writing is evocative, professional, and captures the artist's core essence. Your primary goal is to create compelling narratives that resonate with industry professionals. You will ALWAYS use 'Brandon237' as the artist name in the output when requested.`,
  pressRelease: `You are a senior PR agent at a major record label. Your press releases are professional, newsworthy, and adhere strictly to industry-standard formatting. Your tone is formal and authoritative. You will use 'Brandon237' as the artist name when requested.`,
  socialMedia: `You are a savvy social media manager for top-tier musical artists. Your goal is to maximize engagement with concise, high-impact posts. Your output MUST ONLY be a valid, clean JSON array of strings. Do not include any additional text, commentary, or markdown formatting like \`\`\`json. Just the array. You will use 'Brandon273' as the artist name.`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { title, genre, mood, artistName } = body;

    // Validation remains the same
    if (!title || !genre || !mood || !artistName) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, genre, mood, and artistName",
        },
        { status: 400 }
      );
    }

    // --- ENHANCED USER PROMPTS ---

    const biographyPrompt = `Write a compelling 150-word artist biography for Brandon237.
- The biography MUST begin with the name "Brandon237".
- Highlight their Cameroonian heritage as a core influence.
- Describe their style as a fusion of traditional African rhythms with modern ${genre} production.
- Reference their latest track "${title}" and its ${mood} atmosphere.
- End with their future potential in the global music scene.
- Use vivid, professional language suitable for an Electronic Press Kit (EPK).`;

    const pressReleasePrompt = `Write a professional music press release (180-200 words) for the artist Brandon237 and their new single "${title}".
- HEADLINE: Announce the new single "${title}" by Brandon237.
- INTRODUCTION: Announce the release for today, mentioning the track's ${genre} genre and ${mood} mood.
- BODY: Include a powerful quote from Brandon237 about the track's inspiration. Detail how the song blends Cameroonian musical heritage with contemporary sounds.
- CONCLUSION: State the track's availability on all major streaming platforms. Include a call to action for listeners and a placeholder for press contact: [Contact: press@brandon237.com].
- Adhere to a formal press release structure.`;

    const socialMediaPrompt = `Generate exactly 3 distinct social media posts for the artist Brandon237 to announce the new track "${title}".
- POST 1 (Announcement): High-energy, celebratory. Use emojis like 🎵🔥🇨🇲. Include hashtags: #NewMusic #CameroonMusic #${genre.replace(
      /\s+/g,
      ""
    )}.
- POST 2 (Personal Insight): A more intimate look at the song's meaning or creative process. Use emojis like ✨🙏.
- POST 3 (Call to Action): Directly ask fans to stream/share and describe how the ${mood} vibe is perfect for [activity, e.g., 'your weekend playlist'].
- Return ONLY a valid JSON array of 3 strings.`;

    // --- 2. PROFESSIONAL IMAGE PROMPT ("Art Director's Brief") ---
    // This prompt gives the AI more structured, artistic, and detailed instructions.
    const albumArtPrompt = `
      Create a professional, high-resolution album cover for the song "${title}".

      CONCEPT: A powerful, abstract visualization of music and heritage. It should represent the fusion of traditional Cameroonian culture with modern, digital ${genre} soundscapes. The feeling is ${mood} and deeply atmospheric.

      STYLE: Afrofuturism meets minimalist design. A vibrant, high-quality digital painting with sharp focus and cinematic lighting. The aesthetic should be modern, sophisticated, and worthy of a major label release.

      COMPOSITION: A central, glowing geometric symbol that incorporates elements of traditional Cameroonian Ndop patterns and stylized sound waves. The symbol should be dynamic, with subtle light trails emanating from it. The background is a deep, textured gradient, providing depth and focus on the central element. Balanced for a 1:1 square format.

      COLOR & LIGHTING: The color palette is dominated by warm, rich earth tones (terracotta, deep orange) contrasted with a vibrant, electric ${
        mood === "energetic" ? "yellow" : "blue"
      } that forms the central glowing symbol. The lighting is dramatic and cinematic, creating a sense of importance and mystique.

      NEGATIVE PROMPT (Elements to AVOID): text, letters, words, signatures, watermarks, faces, people, cluttered scenes, blurry details, amateurish design, photo-realism.
    `;

    // --- API Calls using Promise.allSettled ---
    const [bioResult, releaseResult, socialResult, artResult] =
      await Promise.allSettled([
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.biography },
            { role: "user", content: biographyPrompt },
          ],
          max_tokens: 350,
          temperature: 0.7,
        }),
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.pressRelease },
            { role: "user", content: pressReleasePrompt },
          ],
          max_tokens: 400,
          temperature: 0.6,
        }),
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.socialMedia },
            { role: "user", content: socialMediaPrompt },
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
        hf.textToImage({
          model: "black-forest-labs/FLUX.1-schnell", // A great choice for speed and quality
          inputs: albumArtPrompt,
        }),
      ]);

    // --- Processing Logic (Your existing logic is excellent, no changes needed here) ---

    // Extract biography with better error handling and ensure it starts with Brandon237
    let biography = "Unable to generate biography at this time.";
    if (bioResult.status === "fulfilled") {
      const content = bioResult.value.choices[0].message.content;
      biography = content
        ? content.replace(/^\s*#.*$/gm, "").trim()
        : biography;
      if (!biography.toLowerCase().startsWith("brandon237")) {
        biography = `Brandon237 ${biography}`;
      }
    } else {
      console.error("Biography generation failed:", bioResult.reason);
      biography = `Brandon237 is an innovative ${genre} artist from Cameroon, creating a unique fusion of traditional African rhythms and contemporary production. Their latest track "${title}" showcases a ${mood} atmosphere that captures the vibrant essence of Cameroonian musical heritage while pushing boundaries in modern music production.`;
    }

    // Extract press release
    let pressRelease = "Unable to generate press release at this time.";
    if (releaseResult.status === "fulfilled") {
      const content = releaseResult.value.choices[0].message.content;
      pressRelease = content
        ? content.replace(/^\s*#.*$/gm, "").trim()
        : pressRelease;
    } else {
      console.error("Press release generation failed:", releaseResult.reason);
      pressRelease = `FOR IMMEDIATE RELEASE\n\nBrandon237 Releases "${title}" - A ${
        mood.charAt(0).toUpperCase() + mood.slice(1)
      } ${genre} Journey\n\nCameroonian artist Brandon237 today unveiled their latest single "${title}", a captivating ${genre} track that masterfully blends traditional African rhythms with contemporary production. The ${mood} atmosphere of the track showcases Brandon237's ability to honor cultural heritage while innovating for modern audiences.\n\n"${title}" is now available on all major streaming platforms and is available for licensing.\n\nContact: press@brandon237.com`;
    }

    // Extract social media blurbs
    let socialBlurbs: string[] = [];
    if (socialResult.status === "fulfilled") {
      try {
        const socialText =
          socialResult.value.choices[0].message.content || "[]";
        let cleanedText = socialText.replace(/```json\n?|\n?```/g, "").trim();
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          socialBlurbs = parsed.slice(0, 3).map((p) => String(p));
        }
      } catch (error) {
        console.error("Failed to parse social media JSON:", error);
      }
    } else {
      console.error("Social media generation failed:", socialResult.reason);
    }

    if (socialBlurbs.length === 0) {
      const genreHashtag = genre.replace(/\s+/g, "");
      socialBlurbs = [
        `🎵 NEW MUSIC ALERT! "${title}" by Brandon237 is OUT NOW! Immerse yourself in ${mood} ${genre} vibes straight from Cameroon 🇨🇲✨ #CameroonMusic #${genreHashtag} #NewMusic #Brandon237`,
        `Brandon237 here! So excited to finally share "${title}" with you all 🔥 This ${mood} track represents where I come from and where I'm going. Stream it now! 💫 #${genreHashtag} #NewRelease`,
        `Need that perfect ${mood} vibe? 🎶 "${title}" by Brandon237 is the answer. Hit play and let the music take over! 🚀 #CameroonMusic #${genreHashtag} #StreamNow`,
      ];
    }

    // Convert image blob to base64
    let artDataUrl = "";
    if (artResult.status === "fulfilled") {
      try {
        // --- FIX IS HERE ---
        // We are asserting that 'artResult.value' is a Blob.
        const arrayBuffer = await (artResult.value as Blob).arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);
        artDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
      } catch (error) {
        console.error("Failed to process album art:", error);
      }
    } else {
      console.error("Album art generation failed:", artResult.reason);
    }

    if (!artDataUrl) {
      const svgPlaceholder = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f59e0b"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="50" font-weight="bold" fill="#fff">${title.substring(
        0,
        20
      )}</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="rgba(255,255,255,0.9)">Brandon237</text></svg>`;
      artDataUrl = `data:image/svg+xml;base64,${Buffer.from(
        svgPlaceholder
      ).toString("base64")}`;
    }

    return NextResponse.json({
      biography,
      pressRelease,
      socialBlurbs,
      albumArt: artDataUrl,
    });
  } catch (error) {
    console.error("Error in /api/generate-epk:", error);
    return NextResponse.json(
      {
        error:
          "Failed to generate AI content. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}
