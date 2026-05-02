# 📖 Detailed Setup Guide

This guide walks you through every step with more detail than the main README.

---

## Part 1 — HuggingFace Setup

### 1.1 Create a HuggingFace Account
- Visit [huggingface.co](https://huggingface.co)
- Click **Sign Up** in the top-right corner
- Verify your email address

### 1.2 Generate an API Token
- Go to your profile → **Settings** → **Access Tokens**
- Or visit directly: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Click **New token**
- Give it a name (e.g. `instagram-bot`)
- Select **Read** role
- Click **Generate token**
- **Copy the token immediately** — it won't be shown again!

Your token looks like: `hf_ABCdefGHIjklMNOpqrSTUvwxyz123456`

---

## Part 2 — Meta / Facebook Setup

### 2.1 Convert Instagram to Business/Creator Account
If you haven't already:
1. Open Instagram app → Profile → ☰ Menu → **Settings**
2. **Account** → **Switch to Professional Account**
3. Choose **Business** or **Creator**

### 2.2 Create a Facebook Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **Get Started** and log in with your Facebook account
3. Complete the developer verification

### 2.3 Create a Facebook App
1. Go to **My Apps** → **Create App**
2. Select **Other** as use case → **Next**
3. Select **Business** as app type → **Next**
4. Give it a name (e.g. `InstagramAutoPilot`) → **Create App**

### 2.4 Add Instagram Graph API
1. In your app dashboard, click **Add Product**
2. Find **Instagram Graph API** → click **Set Up**
3. In the left sidebar, go to **Instagram Graph API** → **Settings**

### 2.5 Get Your Instagram Business Account ID
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your app from the dropdown
3. Click **Generate Access Token** and grant all required permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
4. In the query field, type: `me/accounts`
5. Click **Submit** → find your Facebook Page → copy its `id`
6. Now query: `/{your-page-id}?fields=instagram_business_account`
7. Copy the `id` from `instagram_business_account` — this is your **IG Account ID**

### 2.6 Generate a Long-Lived Access Token
Short-lived tokens expire in ~1 hour. Exchange for a long-lived token (60 days):

```
GET https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={your-app-id}
  &client_secret={your-app-secret}
  &fb_exchange_token={short-lived-token}
```

You can do this directly in the Graph API Explorer or via browser.

> 💡 **Tip**: Set a calendar reminder for 55 days from now to renew the token.

---

## Part 3 — Google Apps Script Setup

### 3.1 Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click **New project** (top left)
3. Rename the project: click **Untitled project** → type `Instagram AutoPilot`

### 3.2 Add the Code
1. Click on `Code.gs` in the left panel (it's already there by default)
2. Select **all** the placeholder code and delete it
3. Open the [`Code.gs`](../Code.gs) file from this repository
4. Copy everything and paste it into the Apps Script editor

### 3.3 Fill In Your Credentials
Find the `CONFIG` object at the top of the file and replace the placeholders:

```javascript
const CONFIG = {
  HF_TOKEN   : 'hf_YOUR_ACTUAL_TOKEN_HERE',
  IG_ACCOUNT : '17841YOUR_ACCOUNT_ID_HERE',
  FB_TOKEN   : 'EAAYOUR_FACEBOOK_TOKEN_HERE'
};
```

### 3.4 Save the Project
- Press **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac)
- Or click the 💾 save icon in the toolbar

---

## Part 4 — First Test Run

### 4.1 Run the Script Manually
1. In the function dropdown (next to the ▶️ Run button), make sure `run` is selected
2. Click ▶️ **Run**
3. A permissions dialog will appear → click **Review Permissions**
4. Choose your Google account → click **Advanced** → **Go to Instagram AutoPilot (unsafe)**
5. Click **Allow**

### 4.2 View the Logs
- Go to **View** → **Logs** (or press Ctrl+Enter)
- You should see output like:
```
🔍 Query selected: JavaScript coding news 2026
📰 Researched topic: TypeScript 5.8 Introduces...
🎨 Visual prompt: The iconic blue TypeScript...
🖼️  Image URL: https://image.pollinations.ai/...
📝 Caption: 🚀 TypeScript just dropped...
⏳ Media container created (ID: 17846...). Waiting 30 s…
✅ Success! Posted: TypeScript 5.8 Introduces...
```

### 4.3 Check Instagram
- Open Instagram on your phone or web
- Go to your profile — the new post should be visible! 🎉

---

## Part 5 — Automating with Triggers

### 5.1 Open Triggers
- In Apps Script, click the ⏰ clock icon in the left sidebar
- Or go to **Edit** → **Current project's triggers**

### 5.2 Add a New Trigger
1. Click **+ Add Trigger** (bottom right)
2. Configure:
   - **Choose which function to run**: `run`
   - **Choose which deployment should run**: `Head`
   - **Select event source**: `Time-driven`
   - **Select type of time based trigger**: `Hour timer`
   - **Select hour interval**: `Every 6 hours`
3. Click **Save**

### 5.3 Verify the Trigger
- Back in the Triggers panel, you should see your new trigger listed
- It will automatically run `run` every 6 hours from now on

---

## 🔄 Maintenance

### Renewing Your Facebook Token
Every ~55 days, you need to refresh your access token:
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Generate a new short-lived token
3. Exchange it for a long-lived token (see Part 2.6)
4. Update `CONFIG.FB_TOKEN` in your Apps Script project

### Adding More Topics
Edit the `TOPICS` array in `Code.gs` to add or change topics:
```javascript
const TOPICS = [
  'JavaScript coding news 2026',
  'Your custom topic here',
  // Add more...
];
```

---

## ⚠️ Important Notes

- **Do not share** your `CONFIG` credentials anywhere publicly
- Instagram allows up to **25 posts per 24 hours** on Business accounts via API
- If you set a trigger more frequent than every hour, you risk hitting rate limits
- Pollinations AI images are generated on-demand and are completely free
- All AI calls use free-tier HuggingFace quota — for heavy usage, consider upgrading

---

*Back to [README](../README.md)*
