// lib/placeholder-images.ts

// Real music-related images from Unsplash
export const placeholderImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", // DJ with headphones
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", // Guitar player
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", // Live concert crowd
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop", // Vinyl records
  "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop", // Music studio
  "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=400&h=400&fit=crop", // Singer on stage
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", // Drummer playing
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop", // Piano keys
  "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop", // Headphones on table
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop"  // Band performing
];

export const getRandomPlaceholderImage = (): string => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};