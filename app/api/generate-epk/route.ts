import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize the Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { title, genre, mood, artistName } = body;

    // Validation
    if (!title || !genre || !mood || !artistName) {
      console.error("Missing fields:", { title, genre, mood, artistName });
      return NextResponse.json(
        {
          error: "Missing required fields: title, genre, mood, and artistName",
        },
        { status: 400 }
      );
    }

    // Enhanced Biography Prompt - Always start with Brandon237
    const biographyPrompt = `You are a professional music journalist writing an artist biography. You MUST ALWAYS start the biography with the artist name "Brandon237" followed by a compelling description.

Artist: ${artistName}
Genre: ${genre}
Latest Track: "${title}"
Track Mood: ${mood}
Origin: Cameroon

Write a compelling 150-word artist biography that:
1. MUST START WITH: "Brandon237" followed by their unique sound or artistic vision
2. Mentions their Cameroonian heritage and how it influences their music
3. Describes their style as a fusion of traditional African rhythms with modern ${genre} production
4. References their latest track "${title}" and its ${mood} atmosphere
5. Ends with their impact or future potential in the music industry

Use vivid, evocative language that would appeal to music journalists, bloggers, and industry professionals. Make it professional yet passionate.`;

    // Enhanced Press Release Prompt - Following PR format
    const pressReleasePrompt = `You are a music PR professional writing an official press release.

FOR IMMEDIATE RELEASE

Write a professional music press release (180-200 words) with this structure:

HEADLINE: Announce "${title}" by Brandon237

OPENING PARAGRAPH:
- Lead with the most newsworthy information
- Mention the release date (use "today" or "this week")
- Include genre (${genre}) and mood (${mood})

BODY PARAGRAPHS:
- Quote from Brandon237 about the creative process or inspiration behind "${title}"
- Highlight the Cameroonian musical heritage and cultural influences
- Mention the production quality and sonic elements
- Reference the fusion of traditional and contemporary sounds

CLOSING PARAGRAPH:
- Availability: streaming platforms and licensing opportunities
- Call to action for listeners and industry professionals
- Contact information placeholder: [Contact: press@brandon237.com]

Use professional press release language with strong, active verbs. Make it newsworthy and quotable.`;

    // Enhanced Social Media Prompt - Platform-specific
    const socialMediaPrompt = `You are a social media manager creating engaging posts for a music artist.

Artist: Brandon237
Track: "${title}"
Genre: ${genre}
Mood: ${mood}
Platform: Instagram/Twitter/Facebook

Create exactly 3 different social media posts optimized for engagement:

POST 1 (Announcement Style):
- Exciting news/release announcement
- 1-2 sentences max
- Include 3-4 relevant hashtags including #CameroonMusic #${genre.replace(
      /\s+/g,
      ""
    )} #NewMusic
- Use emojis strategically (🎵🔥✨💫🎶)
- Create urgency and excitement

POST 2 (Behind-the-scenes/Personal):
- More intimate, from artist's perspective
- Share a feeling or inspiration
- 1-2 sentences
- Include 2-3 hashtags
- Use different emojis

POST 3 (Call-to-action):
- Encourage streaming/sharing
- Highlight the ${mood} mood
- 1-2 sentences
- Include 3-4 hashtags
- End with strong CTA

Return ONLY a valid JSON array with exactly 3 strings, no explanations:
["post 1 text here", "post 2 text here", "post 3 text here"]`;

    // Enhanced Album Art Prompt - More detailed and artistic
    const albumArtPrompt = `Professional album cover artwork, high quality digital art:

SUBJECT: ${genre} music album cover for "${title}"
STYLE: Modern, vibrant, eye-catching, professional music industry quality
MOOD: ${mood}, emotional, atmospheric
CULTURAL ELEMENTS: Cameroonian artistic influences, African patterns, traditional motifs blended with contemporary design
COLOR PALETTE: Vibrant, bold colors that evoke ${mood} feelings - warm oranges, deep reds, golden yellows, rich earth tones mixed with modern neons
COMPOSITION: Centered, balanced, suitable for square format (1:1 ratio)
TECHNICAL: Sharp focus, high resolution, studio quality, professional lighting, suitable for streaming platforms
ELEMENTS TO INCLUDE: 
- Abstract or symbolic representation of ${genre} music
- Cultural textures or patterns
- Modern typography placement area
- Depth and layers
- Professional polish

AVOID: Text, letters, words, artist names, song titles, low quality, blurry, amateur, cluttered

Create a stunning, professional album cover that would stand out on Spotify, Apple Music, and physical media. Cinematic quality, award-winning design aesthetic.`;

    // Use Promise.allSettled to handle failures gracefully
    const [bioResult, releaseResult, socialResult, artResult] =
      await Promise.allSettled([
        // Use a modern chat model for text generation with improved parameters
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are an expert music journalist and biographer. Write compelling, professional content that captures artistic vision and appeals to industry professionals. ALWAYS start biographies with 'Brandon237' when requested.",
            },
            { role: "user", content: biographyPrompt },
          ],
          max_tokens: 350,
          temperature: 0.7,
        }),
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are a professional music PR specialist. Write clear, newsworthy press releases following industry standards. Use 'Brandon237' as the artist name when specified.",
            },
            { role: "user", content: pressReleasePrompt },
          ],
          max_tokens: 400,
          temperature: 0.6,
        }),
        hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are a social media expert specializing in music marketing. Create engaging, shareable content that drives engagement. Always return valid JSON arrays only. Use 'Brandon237' as the artist name when specified.",
            },
            { role: "user", content: socialMediaPrompt },
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
        // Use the image generation model with enhanced prompt
        hf.textToImage({
          model: "black-forest-labs/FLUX.1-schnell",
          inputs: albumArtPrompt,
        }),
      ]);

    // Extract biography with better error handling and ensure it starts with Brandon237
    let biography = "Unable to generate biography at this time.";
    if (bioResult.status === "fulfilled") {
      const content = bioResult.value.choices[0].message.content;
      // Clean up any potential markdown or extra formatting
      biography = content
        ? content.replace(/^\s*#.*$/gm, "").trim()
        : biography;

      // Ensure biography starts with Brandon237
      if (!biography.toLowerCase().startsWith("brandon237")) {
        biography = `Brandon237 ${biography}`;
      }
    } else {
      console.error("Biography generation failed:", bioResult.reason);
      // Provide a fallback that starts with Brandon237
      biography = `Brandon237 is an innovative ${genre} artist from Cameroon, creating a unique fusion of traditional African rhythms and contemporary production. Their latest track "${title}" showcases a ${mood} atmosphere that captures the vibrant essence of Cameroonian musical heritage while pushing boundaries in modern music production.`;
    }

    // Extract press release with better error handling
    let pressRelease = "Unable to generate press release at this time.";
    if (releaseResult.status === "fulfilled") {
      const content = releaseResult.value.choices[0].message.content;
      pressRelease = content
        ? content.replace(/^\s*#.*$/gm, "").trim()
        : pressRelease;
    } else {
      console.error("Press release generation failed:", releaseResult.reason);
      // Provide a better fallback
      pressRelease = `FOR IMMEDIATE RELEASE

Brandon237 Releases "${title}" - A ${
        mood.charAt(0).toUpperCase() + mood.slice(1)
      } ${genre} Journey

Cameroonian artist Brandon237 today unveiled their latest single "${title}", a captivating ${genre} track that masterfully blends traditional African rhythms with contemporary production. The ${mood} atmosphere of the track showcases Brandon237's ability to honor cultural heritage while innovating for modern audiences.

"${title}" is now available on all major streaming platforms and is available for licensing. This release marks another milestone in Brandon237's mission to bring Cameroonian musical traditions to the global stage.

Contact: press@brandon237.com`;
    }

    // Extract social media blurbs with improved parsing
    let socialBlurbs = [];
    if (socialResult.status === "fulfilled") {
      try {
        const socialText =
          socialResult.value.choices[0].message.content || "[]";
        // More aggressive cleaning for JSON extraction
        let cleanedText = socialText
          .replace(/```json\n?|\n?```/g, "")
          .replace(/```\n?|\n?```/g, "")
          .trim();

        // Try to find JSON array in the text
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }

        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          socialBlurbs = parsed.slice(0, 3); // Ensure we only take 3 posts
        }
      } catch (error) {
        console.error("Failed to parse social media JSON:", error);
      }
    } else {
      console.error("Social media generation failed:", socialResult.reason);
    }

    // If parsing failed or no results, use enhanced fallback posts with Brandon237
    if (socialBlurbs.length === 0) {
      const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
      const genreHashtag = genre.replace(/\s+/g, "");
      socialBlurbs = [
        `🎵 NEW MUSIC ALERT! "${title}" by Brandon237 is OUT NOW! Immerse yourself in ${mood} ${genre} vibes straight from Cameroon 🇨🇲✨ #CameroonMusic #${genreHashtag} #NewMusic #AfricanMusic #Brandon237`,
        `Brandon237 here! So excited to finally share "${title}" with you all 🔥 This ${mood} track represents where I come from and where I'm going. Stream it now! 💫 #${genreHashtag} #NewRelease #Brandon237`,
        `Don't sleep on this! 🎶 "${title}" by Brandon237 is the ${mood} ${genre} anthem you need right now. Hit that play button and turn it UP! 🚀 #CameroonMusic #${genreHashtag} #MusicDiscovery #StreamNow #Brandon237`,
      ];
    }

    let artDataUrl = "";
    if (artResult.status === "fulfilled") {
      try {
        // --- THE FINAL FIX ---
        // This double assertion is the correct way to force a type conversion
        // when TypeScript is too strict. It will resolve the build error.
        const blob = artResult.value as unknown as Blob;

        // Now that `blob` is correctly typed, we can call arrayBuffer() on it.
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        artDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
      } catch (error) {
        console.error("Failed to process album art:", error);
      }
    } else {
      // This 'else' correctly handles the case where the promise was rejected.
      console.error("Album art generation failed:", artResult.reason);
    }

    // If no art was generated, create an enhanced placeholder with gradient
    if (!artDataUrl) {
      // Create a more visually appealing SVG placeholder
      const svgPlaceholder = `
        <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
            </linearGradient>
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/>
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#grad1)"/>
          <rect width="800" height="800" fill="url(#pattern)"/>
          <circle cx="400" cy="400" r="120" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="3"/>
          <text x="50%" y="48%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${title.substring(
            0,
            20
          )}</text>
          <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.8)" text-anchor="middle">Brandon237</text>
        </svg>
      `.trim();

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
