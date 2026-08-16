# TECH TATTVA — Official Website
**Technical Club @ KMCE**

Welcome to the official source code for **Tech Tattva**, the technical club of K.M. College of Engineering (KMCE).

This website is built with clean, modern, pure static web technologies (**HTML5, CSS3, Vanilla JavaScript, and JSON**) with zero build tools or package managers required.

---

## 📁 Project Structure

```
├── index.html                 # Main Single Page Application HTML shell
├── css/
│   ├── style.css              # White-only design system & page layouts
│   └── admin.css              # Admin management dashboard styles
├── js/
│   ├── router.js              # Vanilla JS client-side router (/home, /events, /about, etc.)
│   ├── app.js                 # App initialization, header/footer, home/about views
│   ├── events.js               # Events list and detail page renderer
│   ├── announcements.js        # Announcements list and detail page renderer
│   └── admin.js                # Admin dashboard & interactive management
├── data/
│   ├── site.json              # Club metadata, tagline, activities & social links
│   ├── events.json            # Upcoming & past events list
│   └── announcements.json     # Official notices & announcements
├── assets/
│   ├── logo/
│   │   └── tech_tattva_logo.jpg# Official Tech Tattva logo (DO NOT replace or alter)
│   └── events/                # Event poster vector graphics
├── api/
│   └── admin.js               # Vercel Serverless Function for automated GitHub commits
├── vercel.json                # Vercel SPA routing configuration
└── README.md                  # Project documentation
```

---

## ✏️ Maintaining Content

Content on the website is stored in simple, human-readable JSON files in the `data/` directory. There are two ways to maintain website content:

### Method 1: Manual JSON Editing via GitHub
1. Open `data/events.json` or `data/announcements.json` directly in GitHub or your local editor.
2. Edit or add your new event / announcement following the existing JSON template:

```json
{
  "id": "event-005",
  "slug": "web-dev-workshop",
  "title": "Modern Web Development",
  "status": "upcoming",
  "date": "10 October 2026",
  "time": "10:00 AM",
  "venue": "Seminar Hall 1",
  "description": "Learn HTML, CSS and JS basics.",
  "poster": "assets/events/ai-workshop.svg",
  "registrationLink": "https://forms.gle/example"
}
```

3. Commit and push your changes to GitHub. Vercel will automatically redeploy the website!

---

### Method 2: Admin Dashboard (`/admin`)
1. Navigate to `/admin` on the website.
2. Click **+ Add Event** or **+ Add Announcement** to create or edit content.
3. Click **Push to GitHub** to trigger the Vercel serverless function (`api/admin.js`), which automatically commits the changes to your GitHub repository.
4. Alternatively, click **Export JSON Data** to download the updated JSON file to commit manually.

---

## ⚡ How the Vercel Serverless Function Works

1. The Admin Dashboard sends updated JSON data to `/api/admin`.
2. The Vercel function reads the `GITHUB_TOKEN` environment variable configured securely in your Vercel project settings.
3. It calls the GitHub REST API to commit the updated JSON file directly to your GitHub repository branch.
4. GitHub triggers a fresh Vercel deployment automatically.

---

## 🔒 Environment Variables (`.env`)

Secrets and admin passcode configuration are stored in [.env](file:///e:/ClubPage/.env):

```env
ADMIN_PASSCODE=techtattva2026
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=techtattva-kmce
GITHUB_REPO=techtattva-website
GITHUB_BRANCH=main
```

> [!IMPORTANT]
> The `.env` file is listed in `.gitignore` so your passcode and GitHub access tokens are never committed to public repositories. When deploying to Vercel, add `ADMIN_PASSCODE` and `GITHUB_TOKEN` under **Vercel Project Settings → Environment Variables**.

---

## 🚀 How to Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repository into your **Vercel** dashboard.
3. Keep default settings:
   - **Framework Preset**: Other / None
   - **Build Command**: None
   - **Output Directory**: `./` (Root)
4. Add Environment Variable in Vercel Project Settings (Optional for Admin GitHub Commits):
   - `GITHUB_TOKEN` = Your GitHub Personal Access Token (with `repo` permissions)
   - `GITHUB_OWNER` = `techtattva-kmce`
   - `GITHUB_REPO` = `techtattva-website`
5. Click **Deploy**. Your website will be live at `https://techtattva-kmce.vercel.app`!
