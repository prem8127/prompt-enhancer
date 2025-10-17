export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { seedPrompt } = req.body;
  if (!seedPrompt || seedPrompt.trim() === "") {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    let prompt = seedPrompt.trim();
    prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);

    // === Subject detection ===
    const subjects = {
      character: ["person", "girl", "boy", "man", "woman", "hero", "villain", "mage", "robot", "dragon"],
      landscape: ["forest", "mountain", "river", "city", "village", "castle", "desert", "beach", "canyon", "skyline"],
      object: ["car", "mech", "spaceship", "bike", "weapon", "artifact", "statue", "building"],
      animal: ["cat", "dog", "dragon", "bird", "tiger", "lion", "wolf", "horse", "fish"],
    };
    let subjectType = "general";
    outer: for (const type in subjects) {
      for (const keyword of subjects[type]) {
        if (prompt.toLowerCase().includes(keyword)) {
          subjectType = type;
          break outer;
        }
      }
    }

    // === Adjective pools ===
    const adjectives = {
      character: ["heroic", "mysterious", "dynamic", "vibrant", "ethereal", "regal", "fierce", "graceful", "intense"],
      landscape: ["breathtaking", "vast", "misty", "lush", "serene", "dramatic", "majestic", "stormy", "golden"],
      object: ["futuristic", "ornate", "sleek", "mechanical", "ancient", "glowing", "detailed", "shiny", "intricate"],
      animal: ["graceful", "ferocious", "majestic", "playful", "realistic", "mythical", "vivid", "agile", "enigmatic"],
      general: ["highly detailed", "cinematic", "ultra-realistic", "vividly colored", "dynamic", "surreal", "fantastical"],
    };

    const styles = [
      "digital painting", "concept art", "oil painting", "watercolor", "photorealistic",
      "cyberpunk", "fantasy illustration", "anime style", "surrealism", "low-poly"
    ];

    const moods = [
      "dramatic lighting", "sunset ambiance", "foggy atmosphere", "moody shadows",
      "soft focus", "wide-angle perspective", "macro shot", "cinematic depth of field",
      "glowing neon lights", "ethereal mist"
    ];

    const environments = [
      "in a bustling cityscape", "on top of a misty mountain", "under a starry night sky",
      "by a tranquil river", "inside a futuristic laboratory", "among ancient ruins",
      "in a dense forest", "on a golden desert", "floating in a surreal dreamscape"
    ];

    // === Build dynamic sentences ===
    const shuffledAdj = adjectives[subjectType].sort(() => 0.5 - Math.random()).slice(0, 4);
    const adjectiveString = shuffledAdj.join(", ");

    const styleHint = styles[Math.floor(Math.random() * styles.length)];
    const moodHint = moods[Math.floor(Math.random() * moods.length)];
    const environmentHint = environments[Math.floor(Math.random() * environments.length)];

    // Construct paragraph-like prompt
    const enhancedPrompt = `${prompt} is ${adjectiveString} ${environmentHint}. It is rendered in ${styleHint} style with ${moodHint}, capturing a sense of depth and atmosphere. The scene is designed to be cinematic and visually stunning, with careful attention to lighting, perspective, and composition. Every detail enhances the realism and artistic quality of the image, making it perfect for AI-generated artwork.`;

    res.status(200).json({ enhancedPrompt });
  } catch (err) {
    console.error("Enhancement Error:", err);
    res.status(500).json({ error: "Failed to enhance prompt" });
  }
}

