<div align="center">

<img src="https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Instagram%20API-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
<img src="https://img.shields.io/badge/DeepSeek--V3-000000?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

<br/><br/>

# 🤖 Instagram AutoPilot

**A fully automated Instagram posting bot built with Google Apps Script.**  
It researches trending tech topics, generates AI images, writes captions, and posts — completely on autopilot, for free.

<br/>

> Made by [Farman920](https://github.com/Farman920)

</div>

---

## ✨ What It Does

Every time the script runs (on a schedule you control), it:

| Step | Action | Tool Used |
|------|--------|-----------|
| 1️⃣ | Picks a random trending tech topic | Built-in list |
| 2️⃣ | Researches a specific headline for that topic | DeepSeek-V3 (HuggingFace) |
| 3️⃣ | Creates a detailed image-generation prompt (logo-focused, no text) | DeepSeek-V3 |
| 4️⃣ | Generates a free 1080×1080 AI image | Pollinations AI |
| 5️⃣ | Writes an engaging caption with emojis & hashtags | DeepSeek-V3 |
| 6️⃣ | Uploads and publishes the post to Instagram | Meta Graph API v21.0 |

---

## 🛠️ Tech Stack

```
Google Apps Script   →  Runtime + Scheduler (free, no server needed)
DeepSeek-V3          →  AI model for research, prompts & captions
HuggingFace Router   →  Free API gateway to DeepSeek-V3
Pollinations AI      →  Free AI image generation (1080×1080)
Meta Graph API       →  Instagram Business posting
```

---

## 📋 Prerequisites

Before you start, make sure you have:

- [ ] A **Google Account** (for Google Apps Script)
- [ ] A **HuggingFace account** — [Sign up free](https://huggingface.co/join)
- [ ] An **Instagram Business or Creator account**
- [ ] A **Facebook Developer account** — [developers.facebook.com](https://developers.facebook.com)
- [ ] A **Facebook App** with Instagram Graph API permissions

---

## 🚀 Setup Guide

### Step 1 — Get Your HuggingFace Token

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **New token** → choose **Read** access → copy the token
3. Save it — you'll need it shortly

---

### Step 2 — Get Your Facebook / Instagram Credentials

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps** → **Create App**
2. Add the **Instagram Graph API** product to your app
3. Under **Instagram Basic Display** or **Graph API Explorer**, generate a **User Access Token** with these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
4. Find your **Instagram Business Account ID**:
   - Go to Graph API Explorer
   - Run: `GET /me/accounts` → find your page → then `GET /{page-id}?fields=instagram_business_account`
   - Copy the `id` value

> ⚠️ **Long-lived tokens** expire after 60 days. Use the [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to exchange for a long-lived token.

---

### Step 3 — Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **New project**
3. Delete the default code
4. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it
5. Fill in your credentials in the `CONFIG` object at the top:

```javascript
const CONFIG = {
  HF_TOKEN   : 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxx',  // Your HuggingFace token
  IG_ACCOUNT : '17841XXXXXXXXXX',                  // Your Instagram Business Account ID
  FB_TOKEN   : 'EAAxxxxxxxxxxxxxxxxxx'             // Your Facebook access token
};
```

6. Click 💾 **Save** (Ctrl+S)

---

### Step 4 — Test the Script

1. In the toolbar, make sure `run` is selected in the function dropdown
2. Click ▶️ **Run**
3. You'll be asked to authorize — click **Review Permissions** → **Allow**
4. Open **View → Logs** (Ctrl+Enter) to see the output
5. Check your Instagram account — the post should appear! ✅

---

### Step 5 — Set Up Automatic Scheduling

1. In Apps Script, click ⏰ **Triggers** (clock icon on the left sidebar)
2. Click **+ Add Trigger**
3. Configure:
   - **Function**: `run`
   - **Event source**: Time-driven
   - **Type**: Hour timer → **Every 6 hours** (or your preferred frequency)
4. Click **Save**

> 🎉 Done! Your bot will now post automatically every 6 hours (or whatever interval you set).

---

## 📁 Project Structure

```
instagram-autopilot/
│
├── Code.gs              ← Main Google Apps Script file (copy this into GAS)
├── README.md            ← This file
├── LICENSE              ← MIT License
│
└── docs/
    └── setup-guide.md   ← Detailed visual setup guide
```

---

## ⚙️ Customization

### Change Topics
Edit the `TOPICS` array in `Code.gs`:

```javascript
const TOPICS = [
  'JavaScript coding news 2026',
  'Python programming updates',
  'React framework news',
  'Next.js features',
  'AI engineering tools'
  // Add your own topics here ↓
  // 'Machine Learning breakthroughs',
  // 'Cybersecurity news',
];
```

### Change Posting Frequency
In the Apps Script Trigger settings, choose any interval:
- Every 1 hour → ~24 posts/day
- Every 6 hours → ~4 posts/day
- Every 12 hours → ~2 posts/day

### Change Image Style
Edit the suffix added to every image prompt in `buildImageUrl()`:

```javascript
// Current style: product photography, photorealistic
'high-end product photography, masterpiece, 8k, photorealistic, clean composition'

// Example alternative: cinematic style
'cinematic lighting, dramatic shadows, 4k, dark background, volumetric fog'
```

---

## 🔍 How the AI Pipeline Works

```
Random Topic Query
       ↓
  DeepSeek-V3  →  Trending Headline (60 tokens)
       ↓
  DeepSeek-V3  →  Logo-focused Image Prompt (120 tokens)
       ↓
 Pollinations  →  1080×1080 Free AI Image
       ↓
  DeepSeek-V3  →  Instagram Caption + Hashtags (300 tokens)
       ↓
Meta Graph API →  Upload Container
       ↓
  Wait 30 sec  →  Image Processing
       ↓
Meta Graph API →  Publish Post ✅
```

---

## ❓ Troubleshooting

| Problem | Possible Fix |
|---------|-------------|
| `❌ Upload failed` | Check your FB token hasn't expired. Regenerate it. |
| `[DeepSeek] Unexpected response` | Check your HuggingFace token is valid and has quota |
| Image posts but is blank | Pollinations AI might be slow — increase `Utilities.sleep()` to `60000` |
| Script times out | Apps Script has a 6-min limit. The 30s sleep is safe but don't add more waits. |
| `Authorization required` | Re-run the script manually once to grant permissions |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Credits

| Service | Purpose | Cost |
|---------|---------|------|
| [HuggingFace](https://huggingface.co) | DeepSeek-V3 API routing | Free tier |
| [Pollinations AI](https://pollinations.ai) | AI image generation | Free |
| [Google Apps Script](https://script.google.com) | Script runtime + scheduler | Free |
| [Meta Graph API](https://developers.facebook.com) | Instagram posting | Free |

---

<div align="center">

**⭐ If this project helped you, please give it a star!**

Made with ❤️ by [Farman920](https://github.com/Farman920)

</div>
