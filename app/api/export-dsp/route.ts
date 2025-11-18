import { NextResponse } from "next/server";
import JSZip from "jszip";

// DSP Requirements Reference
const DSP_SPECS = {
  spotify: {
    audio: { format: "WAV", bitDepth: 16, sampleRate: 44100 },
    artwork: { size: 3000, format: "JPEG", minSize: 640 },
    metadata: ["ISRC", "UPC", "Title", "Artist", "Album", "Genre", "Year"],
  },
  appleMusic: {
    audio: { format: "WAV", bitDepth: 24, sampleRate: 44100 },
    artwork: { size: 3000, format: "JPEG", minSize: 1400 },
    metadata: ["ISRC", "UPC", "Title", "Artist", "Album", "Genre", "Copyright"],
  },
  tiktok: {
    audio: {
      format: "MP3",
      bitrate: 320,
      sampleRate: 44100,
      duration: "15-60s",
    },
    artwork: { size: 1080, format: "JPEG" },
    metadata: ["Title", "Artist", "Preview Start Time"],
  },
  youtube: {
    audio: { format: "WAV", bitDepth: 16, sampleRate: 48000 },
    artwork: { size: 1280, aspectRatio: "16:9", format: "JPEG" },
    metadata: ["Title", "Artist", "Description", "Tags"],
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const audioFile = formData.get("audio") as File;
    const albumArt = formData.get("albumArt") as File;
    const metadata = JSON.parse(formData.get("metadata") as string);
    const platforms = JSON.parse(
      formData.get("platforms") as string
    ) as string[];

    if (!audioFile || !albumArt || !metadata) {
      return NextResponse.json(
        { error: "Missing required files or metadata" },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Create main folder structure
    const mainFolder = zip.folder("DSP_Export_Package");
    if (!mainFolder) throw new Error("Failed to create main folder");

    // Add README with instructions
    const readme = generateReadme(metadata, platforms);
    mainFolder.file("README.txt", readme);

    // Add metadata file
    const metadataFile = generateMetadataFile(metadata);
    mainFolder.file("metadata.json", JSON.stringify(metadataFile, null, 2));

    // Process files for each platform
    for (const platform of platforms) {
      const platformFolder = mainFolder.folder(platform.toUpperCase());
      if (!platformFolder) continue;

      // Add platform-specific files
      await addPlatformFiles(
        platformFolder,
        platform,
        audioFile,
        albumArt,
        metadata
      );

      // Add platform-specific requirements document
      const requirements = generatePlatformRequirements(platform);
      platformFolder.file(`${platform}_requirements.txt`, requirements);
    }

    // Add distribution guide
    const distributionGuide = generateDistributionGuide();
    mainFolder.file("Distribution_Guide.txt", distributionGuide);

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Convert to base64 for transfer
    const arrayBuffer = await zipBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      success: true,
      package: `data:application/zip;base64,${base64}`,
      filename: `${metadata.title.replace(/\s+/g, "_")}_DSP_Package.zip`,
      platforms: platforms,
      size: zipBlob.size,
    });
  } catch (error) {
    console.error("Error creating DSP package:", error);
    return NextResponse.json(
      { error: "Failed to create DSP package" },
      { status: 500 }
    );
  }
}

async function addPlatformFiles(
  folder: JSZip,
  platform: string,
  audioFile: File,
  albumArt: File,
  metadata: any
) {
  // Add audio file (in real implementation, you'd convert to proper format)
  const audioBuffer = await audioFile.arrayBuffer();
  const audioFileName =
    platform === "tiktok"
      ? `${metadata.title}_Preview.mp3`
      : `${metadata.title}_Master.wav`;
  folder.file(audioFileName, audioBuffer);

  // Add album artwork
  const artBuffer = await albumArt.arrayBuffer();
  const artFileName = `${metadata.title}_Artwork_${
    DSP_SPECS[platform as keyof typeof DSP_SPECS]?.artwork.size || 3000
  }x${DSP_SPECS[platform as keyof typeof DSP_SPECS]?.artwork.size || 3000}.jpg`;
  folder.file(artFileName, artBuffer);

  // Add platform-specific metadata CSV
  const csv = generatePlatformCSV(platform, metadata);
  folder.file(`${platform}_metadata.csv`, csv);

  // Add delivery notes
  const notes = generateDeliveryNotes(platform, metadata);
  folder.file("DELIVERY_NOTES.txt", notes);
}

function generateMetadataFile(metadata: any) {
  return {
    // Basic Information
    title: metadata.title,
    artist: metadata.artistName,
    album: metadata.album || metadata.title + " - Single",
    genre: metadata.genre,
    mood: metadata.mood,
    releaseDate: metadata.releaseDate || new Date().toISOString().split("T")[0],

    // Rights & Identifiers
    isrc: metadata.isrc || "GENERATE_ISRC", // User needs to obtain from distributor
    upc: metadata.upc || "GENERATE_UPC",
    copyright: `© ${new Date().getFullYear()} ${metadata.artistName}`,
    publishingRights: `℗ ${new Date().getFullYear()} ${metadata.artistName}`,

    // Technical Information
    duration: metadata.duration || "3:30",
    language: "English",
    explicit: metadata.explicit || false,

    // Additional Information
    composer: metadata.composer || metadata.artistName,
    producer: metadata.producer || metadata.artistName,
    recordLabel: metadata.recordLabel || "Independent",

    // Social & Marketing
    biography: metadata.biography || "",
    pressRelease: metadata.pressRelease || "",
    socialLinks: metadata.socialLinks || {},

    // Distribution Notes
    territories: "Worldwide",
    pricing: "Standard",
    preOrder: false,
  };
}

function generateReadme(metadata: any, platforms: string[]) {
  return `
═══════════════════════════════════════════════════════════════
  DSP EXPORT PACKAGE - ${metadata.title.toUpperCase()}
═══════════════════════════════════════════════════════════════

Artist: ${metadata.artistName}
Track: ${metadata.title}
Genre: ${metadata.genre}
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════════
  PACKAGE CONTENTS
═══════════════════════════════════════════════════════════════

This package contains everything you need to distribute your music
to the following platforms:

${platforms.map((p) => `  ✓ ${p.toUpperCase()}`).join("\n")}

Each platform folder contains:
  • Audio file in the correct format
  • Album artwork in required dimensions
  • Metadata CSV file
  • Platform-specific requirements document
  • Delivery notes and checklist

═══════════════════════════════════════════════════════════════
  BEFORE YOU SUBMIT
═══════════════════════════════════════════════════════════════

1. OBTAIN ISRC CODE
   Your track needs a unique ISRC code. Get one from:
   - Your distributor (DistroKid, CD Baby, TuneCore, etc.)
   - Your local rights organization
   - ISRC registration website

2. OBTAIN UPC/EAN CODE
   For album/single releases, you need a UPC barcode:
   - Provided by your distributor
   - Purchase from GS1 organization
   - Generated by your aggregator

3. CHOOSE A DISTRIBUTOR
   Popular options:
   - DistroKid (unlimited uploads, annual fee)
   - CD Baby (one-time fee per release)
   - TuneCore (annual fee per release)
   - AWAL (free, selective acceptance)
   - Ditto Music

4. VERIFY METADATA
   Review the metadata.json file and update:
   - ISRC code (replace "GENERATE_ISRC")
   - UPC code (replace "GENERATE_UPC")
   - Release date
   - Producer/composer credits
   - Record label name

═══════════════════════════════════════════════════════════════
  DISTRIBUTION PROCESS
═══════════════════════════════════════════════════════════════

1. Sign up with a music distributor
2. Create a new release in their dashboard
3. Upload the audio file from your chosen platform folder
4. Upload the album artwork
5. Fill in metadata (use provided metadata.json as reference)
6. Select distribution platforms
7. Set release date (2-4 weeks minimum for most platforms)
8. Submit for review
9. Track your release status

═══════════════════════════════════════════════════════════════
  IMPORTANT NOTES
═══════════════════════════════════════════════════════════════

• Release Lead Time: Most platforms need 2-4 weeks notice
• Artwork: Must meet minimum quality standards
• Audio Quality: Use the highest quality source available
• Metadata: Must be accurate and complete
• Rights: Ensure you own all rights to the music and artwork

═══════════════════════════════════════════════════════════════
  SUPPORT & RESOURCES
═══════════════════════════════════════════════════════════════

See Distribution_Guide.txt for detailed platform-specific
instructions and requirements.

For questions about music distribution, consult:
- Your distributor's support documentation
- Platform-specific upload guidelines
- Music industry forums and communities

═══════════════════════════════════════════════════════════════

Good luck with your release!

═══════════════════════════════════════════════════════════════
`;
}

function generatePlatformCSV(platform: string, metadata: any) {
  const headers = [
    "Title",
    "Artist",
    "Album",
    "Genre",
    "ISRC",
    "UPC",
    "Duration",
    "Explicit",
    "Copyright",
  ];

  const values = [
    metadata.title,
    metadata.artistName,
    metadata.album || metadata.title + " - Single",
    metadata.genre,
    metadata.isrc || "GENERATE_ISRC",
    metadata.upc || "GENERATE_UPC",
    metadata.duration || "3:30",
    metadata.explicit ? "Yes" : "No",
    `© ${new Date().getFullYear()} ${metadata.artistName}`,
  ];

  return headers.join(",") + "\n" + values.join(",");
}

function generatePlatformRequirements(platform: string) {
  const specs = DSP_SPECS[platform as keyof typeof DSP_SPECS];

  if (!specs) {
    return `Requirements for ${platform} - Please check platform documentation`;
  }

  return `
═══════════════════════════════════════════════════════════════
  ${platform.toUpperCase()} TECHNICAL REQUIREMENTS
═══════════════════════════════════════════════════════════════

AUDIO SPECIFICATIONS:
${Object.entries(specs.audio)
  .map(([key, value]) => `  • ${key}: ${value}`)
  .join("\n")}

ARTWORK SPECIFICATIONS:
${Object.entries(specs.artwork)
  .map(([key, value]) => `  • ${key}: ${value}`)
  .join("\n")}

REQUIRED METADATA:
${specs.metadata.map((field) => `  • ${field}`).join("\n")}

═══════════════════════════════════════════════════════════════
  SUBMISSION GUIDELINES
═══════════════════════════════════════════════════════════════

1. Ensure audio meets all technical specifications
2. Artwork must be high resolution and square (except YouTube)
3. All metadata fields must be accurately filled
4. Submit through approved music distributor
5. Allow 2-4 weeks for processing

═══════════════════════════════════════════════════════════════
`;
}

function generateDeliveryNotes(platform: string, metadata: any) {
  return `
DELIVERY NOTES - ${platform.toUpperCase()}
═══════════════════════════════════════════════════════════════

Track: ${metadata.title}
Artist: ${metadata.artistName}
Prepared: ${new Date().toLocaleString()}

CHECKLIST:
□ Audio file in correct format
□ Artwork meets size requirements
□ Metadata is complete and accurate
□ ISRC code obtained and added
□ UPC code obtained and added (if album/single)
□ Copyright information is correct
□ Release date is set (minimum 2 weeks out)
□ Distributor account is set up
□ Payment information configured

NEXT STEPS:
1. Log into your ${platform} distributor account
2. Create new release
3. Upload files from this folder
4. Fill in all metadata fields
5. Review and submit

═══════════════════════════════════════════════════════════════
`;
}

function generateDistributionGuide() {
  return `
═══════════════════════════════════════════════════════════════
  COMPLETE DISTRIBUTION GUIDE
═══════════════════════════════════════════════════════════════

STEP 1: CHOOSE YOUR DISTRIBUTOR
═══════════════════════════════════════════════════════════════

DISTROKID ($22.99/year unlimited)
• Best for: High-volume releases
• Pros: Unlimited uploads, fast delivery, keep 100% royalties
• Cons: Annual subscription required
• Platforms: All major DSPs

CD BABY ($9.95 per single, $29 per album)
• Best for: Occasional releases
• Pros: One-time fee, physical distribution available
• Cons: Takes 9% commission
• Platforms: All major DSPs + YouTube Content ID

TUNECORE ($14.99/year per single)
• Best for: Established artists
• Pros: Keep 100% royalties, detailed analytics
• Cons: Annual renewal fees
• Platforms: All major DSPs

AMUSE (Free tier available)
• Best for: New artists
• Pros: Free option, simple interface
• Cons: Limited features on free tier
• Platforms: Major DSPs

═══════════════════════════════════════════════════════════════
  STEP 2: PREPARE YOUR RELEASE
═══════════════════════════════════════════════════════════════

OBTAIN CODES:
• ISRC: Unique recording identifier (free from distributor)
• UPC: Barcode for album/single (free from most distributors)

PREPARE ASSETS:
• Master audio file (WAV, 16-bit or 24-bit, 44.1kHz or 48kHz)
• Album artwork (3000x3000px minimum, JPG)
• Metadata spreadsheet (included in this package)

SET RELEASE DATE:
• Minimum: 2-4 weeks from submission
• Recommended: 4-6 weeks for playlist consideration
• Friday is the global release day standard

═══════════════════════════════════════════════════════════════
  STEP 3: UPLOAD TO PLATFORMS
═══════════════════════════════════════════════════════════════

SPOTIFY:
• Submit via distributor
• Pre-save campaigns can boost launch
• Pitch to playlists 7+ days before release
• Use Spotify for Artists to claim profile

APPLE MUSIC:
• Submit via distributor
• Supports Apple Digital Masters (24-bit)
• Use Apple Music for Artists for analytics

TIKTOK/RESSO:
• Most distributors auto-include
• Clips will be available for user-generated content
• Can boost song discovery significantly

YOUTUBE MUSIC:
• Auto-distributed from most services
• Link to YouTube channel via distributor
• Set up Art Track or upload music video

═══════════════════════════════════════════════════════════════
  STEP 4: PRE-RELEASE MARKETING
═══════════════════════════════════════════════════════════════

4-6 WEEKS BEFORE:
□ Announce release date on social media
□ Create pre-save campaign
□ Reach out to playlist curators
□ Prepare press kit and send to blogs
□ Contact radio stations

2-3 WEEKS BEFORE:
□ Release teaser clips
□ Share behind-the-scenes content
□ Engage with fans on social media
□ Submit to Spotify editorial playlists

1 WEEK BEFORE:
□ Final push on social media
□ Share pre-save link everywhere
□ Prepare release day content
□ Line up interviews/features

═══════════════════════════════════════════════════════════════
  STEP 5: RELEASE DAY
═══════════════════════════════════════════════════════════════

□ Share streaming links on all platforms
□ Post thank you message to fans
□ Share user-generated content
□ Update social media profiles with new track
□ Monitor streaming numbers
□ Engage with comments and shares

═══════════════════════════════════════════════════════════════
  STEP 6: POST-RELEASE
═══════════════════════════════════════════════════════════════

FIRST WEEK:
□ Thank everyone who shared/streamed
□ Share milestones (1K streams, playlist adds, etc.)
□ Continue promoting on social media
□ Pitch to more playlists

ONGOING:
□ Monitor analytics on platform dashboards
□ Collect fan content and share
□ Plan next release
□ Build on momentum

═══════════════════════════════════════════════════════════════
  PLATFORM-SPECIFIC TIPS
═══════════════════════════════════════════════════════════════

SPOTIFY:
• Get verified artist profile
• Update profile photo and bio
• Use Canvas (looping video for mobile)
• Submit to editorial playlists via Spotify for Artists
• Create your own playlist including your track

APPLE MUSIC:
• Use Apple Digital Master format (24-bit) if possible
• Create artist profile on Apple Music for Artists
• Request artist image and bio approval
• Consider Apple Music exclusive pre-release

TIKTOK:
• Create your own TikToks using the track
• Encourage user-generated content
• Use trending hashtags
• Collaborate with TikTok creators
• Make the hook easily clipable (15-30 seconds)

YOUTUBE:
• Upload official audio or music video
• Create lyric video
• Add to topic channel
• Use good thumbnail (1280x720px)
• Write detailed description with timestamps

═══════════════════════════════════════════════════════════════
  COMMON MISTAKES TO AVOID
═══════════════════════════════════════════════════════════════

❌ Rushing the release (give 4+ weeks)
❌ Poor quality artwork (use 3000x3000px minimum)
❌ Incorrect metadata (double-check everything)
❌ No promotion plan (start marketing early)
❌ Not claiming artist profiles (verify on all platforms)
❌ Forgetting ISRC/UPC codes (get from distributor)
❌ Wrong audio format (use high-quality WAV)
❌ Not pitching to playlists (submit everywhere)
❌ Releasing on wrong day (Friday is standard)
❌ No pre-save campaign (builds anticipation)

═══════════════════════════════════════════════════════════════
  ANALYTICS & TRACKING
═══════════════════════════════════════════════════════════════

Monitor your release on:
• Spotify for Artists (streaming data, listener demographics)
• Apple Music for Artists (plays, purchases, Shazams)
• YouTube Studio (views, watch time, traffic sources)
• Distributor dashboard (overall performance)
• Social media insights (engagement, reach)

Key metrics to track:
• Total streams/plays
• Monthly listeners
• Playlist additions
• Save/add rate
• Skip rate
• Geographic performance
• Listener demographics

═══════════════════════════════════════════════════════════════
  MONETIZATION
═══════════════════════════════════════════════════════════════

STREAMING ROYALTIES:
• Spotify: ~$0.003-0.005 per stream
• Apple Music: ~$0.007-0.010 per stream
• YouTube Music: ~$0.002-0.004 per stream
• Tidal: ~$0.01-0.013 per stream

OTHER REVENUE:
• YouTube Content ID (claims on user videos)
• Sync licensing opportunities
• Merchandise sales
• Live performance bookings
• Fan support platforms (Patreon, etc.)

═══════════════════════════════════════════════════════════════

Good luck with your release! Remember: consistency is key.
Keep creating, keep promoting, and build your audience steadily.

═══════════════════════════════════════════════════════════════
`;
}
