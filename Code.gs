/**
 * ============================================================
 *  Instagram AutoPilot — Google Apps Script
 *  Author  : Farman920
 *  GitHub  : https://github.com/Farman920/instagram-autopilot
 *  License : MIT
 * ============================================================
 *
 *  HOW IT WORKS
 *  ────────────
 *  1. Picks a random tech topic from the `queries` list.
 *  2. Asks DeepSeek-V3 (via HuggingFace Router) to research it
 *     and return a one-sentence trending headline.
 *  3. Asks DeepSeek-V3 to craft a detailed image-generation prompt
 *     focused on the topic's logo (NO text in the image).
 *  4. Generates a 1080×1080 image for free via Pollinations AI.
 *  5. Asks DeepSeek-V3 to write an engaging Instagram caption
 *     with emojis and 5 relevant hashtags.
 *  6. Uploads the image + caption to Instagram via Facebook Graph API.
 *  7. Waits 30 s for Instagram to process the image.
 *  8. Publishes the post.
 *
 *  SET UP
 *  ──────
 *  • Replace the three placeholder values in the CONFIG object below.
 *  • In the Apps Script editor, go to Triggers → Add Trigger
 *    and run `run` on a time-based schedule (e.g. every 6 hours).
 */

// ── ① CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG = {
  HF_TOKEN   : 'YOUR_HUGGINGFACE_TOKEN',          // HuggingFace API token
  IG_ACCOUNT : 'YOUR_INSTAGRAM_BUSINESS_ACCOUNT', // Instagram Business Account ID
  FB_TOKEN   : 'YOUR_FACEBOOK_ACCESS_TOKEN'        // Facebook / Meta access token
};

// ── ② CONSTANTS ───────────────────────────────────────────────────────────────
const MODEL_ID      = 'deepseek-ai/DeepSeek-V3';
const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';

/** Tech topics that the bot randomly cycles through. Feel free to edit! */
const TOPICS = [
  'JavaScript coding news 2026',
  'Python programming updates',
  'React framework news',
  'Next.js features',
  'AI engineering tools'
];

// ── ③ HUGGINGFACE HELPER ──────────────────────────────────────────────────────
/**
 * Sends a chat-completion request to DeepSeek-V3 via HuggingFace Router.
 *
 * @param {string} systemPrompt - The system role instruction.
 * @param {string} userPrompt   - The user message / request.
 * @param {number} maxTokens    - Token limit for the response.
 * @param {string} fallback     - Text to return if the API call fails.
 * @returns {string} The model's text response, or the fallback string.
 */
function callDeepSeek(systemPrompt, userPrompt, maxTokens, fallback) {
  const payload = {
    model   : MODEL_ID,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   }
    ],
    max_tokens: maxTokens
  };

  const options = {
    method          : 'post',
    contentType     : 'application/json',
    headers         : { Authorization: 'Bearer ' + CONFIG.HF_TOKEN },
    payload         : JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(HF_ROUTER_URL, options);
    const json     = JSON.parse(response.getContentText());

    if (json.choices && json.choices.length > 0) {
      return json.choices[0].message.content.trim();
    }

    Logger.log('[DeepSeek] Unexpected response: ' + response.getContentText());
    return fallback;
  } catch (error) {
    Logger.log('[DeepSeek] Exception: ' + error.toString());
    return fallback;
  }
}

// ── ④ STEP FUNCTIONS ──────────────────────────────────────────────────────────

/**
 * STEP 1 — Research
 * Returns a single trending headline for the given query.
 */
function researchTopic(query) {
  return callDeepSeek(
    'You are a tech news researcher.',
    `Research a specific trending news item for "${query}". Provide a concise one-sentence title.`,
    60,
    'New JavaScript Features Released'
  );
}

/**
 * STEP 2 — Visual Prompt
 * Returns an image-generation prompt centred on the topic's logo.
 * No text or letters are included — only the visual symbol.
 */
function buildVisualPrompt(topic) {
  return callDeepSeek(
    'You are a professional graphic designer.',
    `Topic: "${topic}". Identify the main logo or symbol associated with this tech.
Describe a high-quality, professional 3D render where that specific LOGO is the central focus.
The logo should be made of premium materials like glowing glass or neon.
STRICTLY NO TEXT, NO LETTERS. Just the visual logo/icon.`,
    120,
    'The iconic yellow JavaScript logo shield, 3D glass render, 8k resolution.'
  );
}

/**
 * STEP 3 — Instagram Caption
 * Returns an engaging caption with emojis and 5 hashtags.
 */
function buildCaption(topic) {
  return callDeepSeek(
    'You are an expert tech influencer.',
    `Topic: "${topic}". Write a professional Instagram caption explaining why this is important. Use emojis and 5 hashtags.`,
    300,
    `Exciting news about ${topic}! 🚀 #TechNews #Coding #Developer #Innovation #Software`
  );
}

/**
 * STEP 4 — Image URL
 * Builds a Pollinations AI URL that generates a 1080×1080 image.
 */
function buildImageUrl(visualPrompt) {
  const fullPrompt =
    `${visualPrompt}, high-end product photography, masterpiece, 8k, photorealistic, ` +
    'clean composition, no text, no words, no letters.';

  return (
    'https://image.pollinations.ai/prompt/' +
    encodeURIComponent(fullPrompt) +
    `?width=1080&height=1080&nologo=true&seed=${Date.now()}`
  );
}

// ── ⑤ MAIN FUNCTION ───────────────────────────────────────────────────────────
/**
 * `run` is the entry point. Attach it to a time-based Apps Script Trigger
 * to post automatically (e.g. every 6 hours).
 */
function run() {
  // Pick a random topic
  const query = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  Logger.log('🔍 Query selected: ' + query);

  // Step 1 — Research
  const topic = researchTopic(query);
  Logger.log('📰 Researched topic: ' + topic);

  // Step 2 — Visual prompt
  const visualPrompt = buildVisualPrompt(topic);
  Logger.log('🎨 Visual prompt: ' + visualPrompt);

  // Step 3 — Image URL (Pollinations AI — completely free)
  const imageUrl = buildImageUrl(visualPrompt);
  Logger.log('🖼️  Image URL: ' + imageUrl);

  // Step 4 — Caption
  const caption = buildCaption(topic);
  Logger.log('📝 Caption: ' + caption);

  // Step 5 — Upload image container to Instagram
  const uploadUrl      = `https://graph.facebook.com/v21.0/${CONFIG.IG_ACCOUNT}/media`;
  const uploadResponse = UrlFetchApp.fetch(uploadUrl, {
    method : 'post',
    payload: {
      image_url   : imageUrl,
      caption     : caption,
      access_token: CONFIG.FB_TOKEN
    },
    muteHttpExceptions: true
  });

  const uploadData = JSON.parse(uploadResponse.getContentText());
  const mediaId    = uploadData.id;

  if (!mediaId) {
    Logger.log('❌ Upload failed: ' + uploadResponse.getContentText());
    return;
  }
  Logger.log('⏳ Media container created (ID: ' + mediaId + '). Waiting 30 s…');

  // Step 6 — Wait for Instagram to process the image
  Utilities.sleep(30000);

  // Step 7 — Publish
  const publishUrl      = `https://graph.facebook.com/v21.0/${CONFIG.IG_ACCOUNT}/media_publish`;
  const publishResponse = UrlFetchApp.fetch(publishUrl, {
    method : 'post',
    payload: {
      creation_id : mediaId,
      access_token: CONFIG.FB_TOKEN
    },
    muteHttpExceptions: true
  });

  if (publishResponse.getResponseCode() === 200) {
    Logger.log('✅ Success! Posted: ' + topic);
  } else {
    Logger.log('❌ Publish failed: ' + publishResponse.getContentText());
  }
}
