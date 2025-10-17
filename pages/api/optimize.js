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
      character: ["heroic", "mysterious", "dynamic", "vibrant", "ethereal", "regal", "fierce", "graceful", "intense", "enigmatic"],
      landscape: ["breathtaking", "vast", "misty", "lush", "serene", "dramatic", "majestic", "stormy", "golden", "otherworldly"],
      object: ["futuristic", "ornate", "sleek", "mechanical", "ancient", "glowing", "detailed", "shiny", "intricate", "mysterious"],
      animal: ["graceful", "ferocious", "majestic", "playful", "realistic", "mythical", "vivid", "agile", "enigmatic", "regal"],
      general: ["highly detailed", "cinematic", "ultra-realistic", "vividly colored", "dynamic", "surreal", "fantastical", "immersive"],
    };

    // === Styles, moods, environment, camera ===
    const styles = [
      "digital painting", "concept art", "oil painting", "watercolor", "photorealistic",
      "cyberpunk", "fantasy illustration", "anime style", "surrealism", "low-poly"
    ];

    const moods = [
      "dramatic lighting", "sunset ambiance", "foggy atmosphere", "moody shadows",
      "soft focus", "wide-angle perspective", "macro shot", "cinematic depth of field",
      "glowing neon lights", "ethereal mist", "warm golden light", "cold blue shadows"
    ];

    const environments = [
      "in a bustling cityscape", "on top of a misty mountain", "under a starry night sky",
      "by a tranquil river", "inside a futuristic laboratory", "among ancient ruins",
      "in a dense forest", "on a golden desert", "floating in a surreal dreamscape",
      "in a post-apocalyptic wasteland", "on a cliff overlooking the ocean"
    ];

    const lenses = [
      "shot from a low angle", "from a bird's eye view", "close-up shot", "wide-angle perspective",
      "macro view capturing intricate details", "cinematic framing", "dynamic camera angle"
    ];

    // === Random selection ===
    const shuffledAdj = adjectives[subjectType].sort(() => 0.5 - Math.random()).slice(0, 4);
    const adjectiveString = shuffledAdj.join(", ");

    const styleHint = styles[Math.floor(Math.random() * styles.length)];
    const moodHint = moods[Math.floor(Math.random() * moods.length)];
    const environmentHint = environments[Math.floor(Math.random() * environments.length)];
    const lensHint = lenses[Math.floor(Math.random() * lenses.length)];

    // === Narrative sentences ===
    const sentenceTemplates = [
      `${prompt} is ${adjectiveString} ${environmentHint}, ${lensHint}.`,
      `Rendered in ${styleHint} style with ${moodHint}, creating a vivid and immersive atmosphere.`,
      `The composition emphasizes depth, texture, and intricate details, making the scene cinematic and visually captivating.`,
      `Every element in the scene contributes to storytelling, highlighting the subject's presence and mood.`,
      `Perfect for high-quality AI-generated artwork that blends realism, style, and artistic creativity.`
    ];

    // Shuffle sentences to vary output
    const enhancedPrompt = sentenceTemplates.sort(() => 0.5 - Math.random()).join(" ");

    res.status(200).json({ enhancedPrompt });
  } catch (err) {
    console.error("Enhancement Error:", err);
    res.status(500).json({ error: "Failed to enhance prompt" });
  }
}


