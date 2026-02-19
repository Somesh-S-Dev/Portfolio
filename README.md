# 🚀 Portfolio — Dynamic Glassmorphism Portfolio

> An Angular 17 portfolio with dynamic time/weather-based theming, a horizontal journey timeline, live GitHub integration, session-based contact, and smooth glassmorphism UI.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Quick Start](#-quick-start)
5. [Configuration Guide](#-configuration-guide)
   - [profile.json](#1-profilejson--your-identity)
   - [education.json](#2-educationjson)
   - [experience.json](#3-experiencejson)
   - [certifications.json](#4-certificationsjson)
   - [badges.json](#5-badgesjson)
   - [timeline.json](#6-timelinejson--journey-milestones)
6. [Image Setup Guide](#-image-setup-guide)
7. [EmailJS Setup](#-emailjs-setup-contact-form)
8. [Weather API Setup](#-openweathermap-weather-api-optional)
9. [Theming System](#-theming-system)
10. [Adding & Removing Content](#-adding--removing-content)
11. [Deployment](#-deployment)
12. [FAQ](#-faq)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dynamic Time Themes** | Dawn → Morning → Noon → Afternoon → Evening → Night, auto-transitions hourly |
| **Weather Backgrounds** | Sunny rays, drifting clouds, rain droplets, breeze + leaf, stars |
| **Journey Timeline** | Horizontal draggable timeline from college start to today. Click any node to jump to its section |
| **Live GitHub Projects** | Fetches public repos in real-time. Click a card to read the rendered README popup |
| **Session Contact Form** | Saves visitor info in a cookie for 30 days — send multiple messages without re-filling |
| **Hover Certificate Proof** | Hover the "Proof" button on experience cards to preview certificate; move away to dismiss |
| **Dynamic Badges & Certs** | Add or remove by editing JSON only — no code changes required |
| **Floating Nav** | Scroll-to-top + LinkedIn DM buttons on the right edge |
| **QR Resume Download** | Auto-generated QR code in the footer links to your resume PDF |
| **Fully Responsive** | Desktop, tablet, and mobile |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (Standalone Components, Signals) |
| Styling | SCSS with CSS custom properties |
| Icons | Font Awesome 6 |
| Fonts | Syne · DM Sans · JetBrains Mono |
| Email | EmailJS (no backend needed) |
| Weather | OpenWeatherMap API |
| GitHub | GitHub REST API v3 |
| Markdown | `marked` library |

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── about/               # Hero — name, bio, skill badges
│   │   │   ├── badges/              # Credly / course badges with hover tooltip
│   │   │   ├── certifications/      # Certificate grid + popup viewer
│   │   │   ├── contact/             # Cookie-session multi-message form
│   │   │   ├── education/           # Degree cards with image backgrounds
│   │   │   ├── experience/          # Work/internship timeline + hover-proof
│   │   │   ├── footer/              # Address, socials, QR code
│   │   │   ├── header/              # Fixed nav, theme switcher, tenure ticker
│   │   │   ├── projects/            # Live GitHub projects + README popup
│   │   │   ├── scroll-nav/          # Floating scroll-to-top + LinkedIn DM
│   │   │   ├── timeline/            # Horizontal journey timeline (NEW)
│   │   │   └── weather-bg/          # Animated weather/time backgrounds
│   │   ├── models/
│   │   │   └── portfolio.models.ts  # All TypeScript interfaces
│   │   └── services/
│   │       ├── contact.service.ts
│   │       ├── cookie.service.ts
│   │       ├── data.service.ts      # Loads all JSON files
│   │       ├── github.service.ts
│   │       ├── theme.service.ts     # Time-based theme engine
│   │       └── weather.service.ts
│   ├── assets/
│   │   ├── data/                    # ← ALL your content lives here (JSON)
│   │   │   ├── profile.json
│   │   │   ├── education.json
│   │   │   ├── experience.json
│   │   │   ├── certifications.json
│   │   │   ├── badges.json
│   │   │   └── timeline.json
│   │   ├── images/                  # ← ALL your images live here
│   │   │   ├── education/
│   │   │   ├── experience/
│   │   │   ├── certifications/
│   │   │   └── badges/
│   │   └── resume.pdf               # ← Your resume PDF
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Fill in src/assets/data/profile.json with your details

# 3. Start development server
npm start
# → Open http://localhost:4200
```

Before going live, complete the [Configuration Guide](#-configuration-guide) and [Image Setup Guide](#-image-setup-guide) below.

---

## 🔧 Configuration Guide

All content is driven entirely by JSON files in `src/assets/data/`. You never touch component code to update content.

---

### 1. `profile.json` — Your Identity

```jsonc
{
  "name": "Your Full Name",
  "tagline": "Your Role & Creative Title",
  "brief": "One-to-two sentence bio shown in the About section.",
  "email": "you@example.com",
  "linkedin": "https://linkedin.com/in/your-handle",
  "github": "your-github-username",       // Used to fetch live repos
  "instagram": "https://instagram.com/handle",
  "currentRole": "Software Engineer",
  "currentCompany": "Your Company",
  "dateOfJoining": "2024-06-01",          // ISO date — drives the tenure counter
  "address": "City, State, Country",
  "companyAddress": "Company Name, Area, City - PIN",
  "resumeUrl": "assets/resume.pdf",       // Place your PDF at src/assets/resume.pdf
  "skills": {
    "languages":  ["Python", "TypeScript"],
    "frameworks": ["Angular", "React"],
    "tools":      ["Docker", "AWS"],
    "other":      ["System Design", "REST APIs"]
  },
  "emailjsServiceId":  "service_xxxxxxx", // From EmailJS dashboard
  "emailjsTemplateId": "template_xxxxxxx",
  "emailjsPublicKey":  "your_public_key"
}
```

---

### 2. `education.json`

```jsonc
[
  {
    "id": "edu1",                          // Unique string per entry
    "institution": "Anna University",
    "degree": "Bachelor of Engineering",
    "stream": "Computer Science & Engineering",
    "cgpa": "8.7 / 10",
    "yearStart": 2021,
    "yearEnd": 2026,
    "location": "Chennai, India",
    "image": "assets/images/education/anna-university.jpg",
    "highlights": [
      "Department Rank Holder",
      "Published 2 research papers"
    ]
  }
]
```

---

### 3. `experience.json`

```jsonc
[
  {
    "id": "exp1",
    "company": "Awesome Corp",
    "logo": "assets/images/experience/awesome-corp.png",
    "role": "Software Engineer",
    "type": "full-time",           // "internship" | "full-time" | "part-time" | "contract"
    "dateFrom": "2024-06-01",
    "dateTo": null,                // null = Present  (shows a live green dot)
    "location": "Chennai, India (Hybrid)",
    "description": "One-to-two sentence summary of the role.",
    "tasks": [
      "Built RESTful microservices serving 50k RPM",
      "Reduced API latency by 40% via Redis caching"
    ],
    "projects": [
      "Real-time Analytics Dashboard",
      "User Auth Platform"
    ],
    "techStack": ["Python", "FastAPI", "AWS", "Kubernetes"],
    "certificateImage": "assets/images/experience/awesome-corp-cert.jpg"
  }
]
```

---

### 4. `certifications.json`

```jsonc
[
  {
    "id": "cert1",
    "title": "AWS Certified Solutions Architect",
    "provider": "Amazon Web Services",
    "issueDate": "2023-09",              // "YYYY-MM"
    "credentialId": "AWS-SAA-XXXX",
    "credentialUrl": "https://www.credly.com/badges/your-badge-id",
    "image":   "assets/images/certifications/aws-saa.jpg",  // Shown in popup
    "bgImage": "assets/images/certifications/aws-saa.jpg"   // Blurred card background
  }
]
```

---

### 5. `badges.json`

```jsonc
[
  {
    "id": "badge1",
    "title": "AWS Cloud Practitioner",
    "issuer": "Amazon Web Services",
    "earnedDate": "2022-11",             // "YYYY-MM"
    "image": "assets/images/badges/aws-cloud-practitioner.png",
    "credlyUrl": "https://www.credly.com/badges/your-badge-id",
    "description": "Short description of what this badge validates."
  }
]
```

---

### 6. `timeline.json` — Journey Milestones

```jsonc
[
  {
    "id": "t1",                          // Unique string
    "date": "2021-08",                   // "YYYY-MM" — sorted automatically
    "label": "Started B.E. CSE",         // Short title on the node card
    "detail": "Enrolled at Anna University — the beginning of everything.",
    "type": "education",                 // Controls node colour — see table below
    "icon": "fa-graduation-cap",         // Font Awesome icon name (without "fas ")
    "sectionId": "education",            // Page section to scroll to on click
    "highlight": false                   // true = pulsing glow ring + bolder node
  }
]
```

**Node types and colours:**

| type | colour |
|---|---|
| `education` | Purple (accent-1) |
| `work` | Green (accent-3) |
| `certification` | Pink (accent-2) |
| `project` | Gold |
| `achievement` | Violet |

**Valid `sectionId` values:** `about` · `contact` · `timeline` · `education` · `experience` · `projects` · `certifications` · `badges`

**Tips for a great timeline:**
- Include your earliest milestone (college start) and a future milestone (graduation) so "Today" falls naturally in the middle
- Set `"highlight": true` on the 2-3 most important milestones (first job, graduation, major achievement)
- Events are sorted by `date` at runtime, so insertion order in the file doesn't matter

---

## 🖼 Image Setup Guide

### Folder Structure

Create this exact structure inside `src/assets/images/`:

```
src/assets/images/
│
├── education/
│   └── anna-university.jpg       # One image per institution
│
├── experience/
│   ├── awesome-corp.png          # Company LOGO (square)
│   ├── awesome-corp-cert.jpg     # Certificate or offer letter scan
│   ├── techstartup.png
│   └── techstartup-cert.jpg
│
├── certifications/
│   ├── aws-saa.jpg               # Full certificate image (landscape)
│   ├── gcp-pcd.jpg
│   └── meta-fe.jpg
│
└── badges/
    ├── aws-cloud-practitioner.png   # Badge icon (square, transparent bg)
    ├── google-it-support.png
    └── docker-essentials.png
```

> **Naming rule:** Use lowercase with hyphens. No spaces, no special characters.
> Example: `aws-solutions-architect.jpg` not `AWS Solutions Architect.jpg`

---

### Education Images

**What to use:**  
A campus photo, institution banner, or any photo that represents the place. It is rendered at roughly 8-18% opacity as a card background, so artistic quality matters more than resolution.

**Recommended specs:**
- Format: `.jpg` or `.webp`
- Dimensions: 1200 × 600 px or wider (landscape ratio)
- File size: under 300 KB (compress at [squoosh.app](https://squoosh.app))

**How to get one:**  
Google `"[Institution name]" campus site:wikipedia.org` or `"[Institution name]" campus photo` and use a freely licensed image (Wikipedia images are CC-licensed). Alternatively, take your own.

**JSON link:**
```json
"image": "assets/images/education/anna-university.jpg"
```

---

### Experience Logos & Certificates

#### Company Logos

**What to use:** The company's official logo, ideally on a transparent background.

**How to get one (in order of preference):**
1. Use the Clearbit Logo API (free, high quality):
   `https://logo.clearbit.com/companyname.com`
   Right-click → Save image as PNG
2. Company website → right-click the header logo → Inspect → copy `src` URL
3. LinkedIn company page → company logo image

**Recommended specs:**
- Format: `.png` with transparent background
- Dimensions: 200 × 200 px square minimum
- If no logo is available, the component automatically shows a coloured fallback circle with the company's first letter — so it's optional

**JSON link:**
```json
"logo": "assets/images/experience/awesome-corp.png"
```

#### Experience Certificates

**What to use:** Your internship completion certificate, offer letter, or any official document proving the experience.

**How to get it:**
- Digital certificates: export to PDF → take a screenshot or convert to JPG
- Physical certificates: photograph or scan at 300 DPI

**Recommended specs:**
- Format: `.jpg`
- Dimensions: landscape, 1600 × 1100 px ideal
- These are displayed **only on hover** in a popup — not permanently visible

**JSON link:**
```json
"certificateImage": "assets/images/experience/awesome-corp-cert.jpg"
```

---

### Certification Images

**What to use:** The official digital certificate image from the issuing platform.

**How to get it by platform:**

| Platform | How to download |
|---|---|
| **Credly** | Open badge → Share → Download → Save PNG |
| **Coursera** | My Certificates → View → Screenshot or PDF |
| **AWS Cert Portal** | Certification → Print certificate → Export as PDF → screenshot |
| **Google Cloud** | Certification portal → Download PDF → screenshot |
| **LinkedIn Learning** | Certificate → Download → PDF → screenshot |
| **edX** | Verified certificate → Print → screenshot |

**Recommended specs:**
- Format: `.jpg` or `.png`
- Dimensions: landscape, 1600 × 1100 px ideal
- You can use the same file for both `image` and `bgImage`

**JSON link:**
```json
"image":   "assets/images/certifications/aws-saa.jpg",
"bgImage": "assets/images/certifications/aws-saa.jpg"
```

---

### Badge Images

**What to use:** The digital badge PNG from the issuing platform.

**How to get it by platform:**

| Platform | How to download |
|---|---|
| **Credly** | Open badge → Share → Download badge image (PNG) |
| **IBM Cognitive Class** | Badge page → Download badge |
| **GitHub** | Profile → Achievements → right-click badge → Save image |
| **Microsoft Learn** | Trophy/badge page → right-click → Save image |
| **Google Cloud** | Skills Boost → badge page → right-click badge icon |

**Recommended specs:**
- Format: `.png` with transparent background
- Dimensions: 300 × 300 px square — displayed at 100 × 100 px on screen

**JSON link:**
```json
"image": "assets/images/badges/aws-cloud-practitioner.png"
```

---

### How Image Paths Work

Every image path in JSON follows this exact pattern:

```
"image": "assets/images/<subfolder>/<filename>.<ext>"
```

Angular's build process copies everything from `src/assets/` to the output and serves it at `/assets/`. The `src/` prefix is implicit — never include it in the JSON path.

**Checklist before `npm start`:**
- [ ] File exists at `src/assets/images/<correct-subfolder>/<filename>`
- [ ] Filename in JSON matches file on disk exactly (case-sensitive on Linux/Mac)
- [ ] No spaces in filename (use hyphens)
- [ ] Extension matches exactly: `.jpg` ≠ `.JPG`
- [ ] File size is reasonable (images above 1 MB will slow the page)

**What happens if an image is missing?**

| Section | Fallback behaviour |
|---|---|
| Education | Card renders normally, background is just the gradient |
| Experience logo | Shows a coloured circle with the company's first letter |
| Experience certificate | Proof popup shows a broken image icon |
| Certifications | Popup shows broken image — always provide this file |
| Badges | Badge slot shows a fallback medal icon |

---

## 📧 EmailJS Setup (Contact Form)

[EmailJS](https://www.emailjs.com/) sends emails directly from the browser — no backend server needed.

### Steps

**Step 1 — Create a free account** at [emailjs.com](https://www.emailjs.com)

**Step 2 — Add an Email Service**
- Dashboard → Email Services → Add New Service
- Choose Gmail, Outlook, SendGrid, etc.
- Connect and authorise your email account
- Copy the **Service ID** (e.g. `service_abc1234`)

**Step 3 — Create an Email Template**
- Dashboard → Email Templates → Create New Template
- Set the subject and body. Use these exact variable names in the template:

```
Subject: New message from {{from_name}}

Name:     {{from_name}}
Email:    {{from_email}}
Phone:    {{from_phone}}
LinkedIn: {{from_linkedin}}
      
Message:
{{message}}
```

- Copy the **Template ID** (e.g. `template_xyz9876`)

**Step 4 — Copy your Public Key**
- Dashboard → Account → General → Public Key

**Step 5 — Paste into `profile.json`:**
```json
"emailjsServiceId":  "service_abc1234",
"emailjsTemplateId": "template_xyz9876",
"emailjsPublicKey":  "abcDEFG_your_key"
```

Messages arrive in the inbox of whichever email you connected in Step 2.

---

## 🌦 OpenWeatherMap Weather API (Optional)

Adds animated weather effects (rain, sunny rays, clouds, breeze) matching the visitor's actual weather.

### Steps

1. Create a free account at [openweathermap.org](https://openweathermap.org/)
2. Go to **API Keys** → copy your key (free tier: 1000 calls/day)
3. Open `src/app/services/weather.service.ts` and replace:

```typescript
private apiKey = 'YOUR_OPENWEATHER_API_KEY';
```

Weather activates only when the visitor grants location permission. If they decline, the page silently falls back to time-based theming only.

---

## 🎨 Theming System

| Local Time | Theme | Feel |
|---|---|---|
| 5am – 8am | 🌅 Dawn | Warm purples + soft orange |
| 8am – 12pm | ☀️ Morning | Bright light blues (light mode) |
| 12pm – 3pm | 🌞 Noon | Warm whites + amber |
| 3pm – 6pm | 🌇 Afternoon | Deep burnt oranges |
| 6pm – 9pm | 🌆 Evening | Deep purples |
| 9pm – 5am | 🌙 Night | Near-black + electric accents |

The header toggle lets visitors switch between **Dynamic** (auto), **Light**, and **Dark**.

To change accent colours, edit the CSS custom properties inside the `[data-theme="..."]` blocks in `src/styles.scss`.

---

## ➕ Adding & Removing Content

| Content | How |
|---|---|
| GitHub Projects | Automatic — push repos to GitHub. Archive or privatise to remove |
| Certifications | Edit `certifications.json` + add image to `images/certifications/` |
| Badges | Edit `badges.json` + add image to `images/badges/` |
| Timeline events | Edit `timeline.json` (auto-sorted by date) |
| Experience | Edit `experience.json` + add logo + cert image |
| Education | Edit `education.json` + add image |

---

## 🚀 Deployment

Build first:
```bash
ng build
# Output → dist/portfolio/browser/
```

| Platform | Command / Steps |
|---|---|
| **Vercel** | `vercel --prod` · Add `vercel.json` with SPA rewrite |
| **Netlify** | Drag `dist/portfolio/browser/` to Netlify UI · Add `_redirects` |
| **GitHub Pages** | `npx angular-cli-ghpages --dir=dist/portfolio/browser` |
| **Firebase** | `firebase deploy` after `firebase init hosting` |

**SPA routing:** All platforms need to redirect `/*` → `/index.html`.

**Vercel `vercel.json`:**
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Netlify `public/_redirects`:**
```
/* /index.html 200
```

---

## ❓ FAQ

**GitHub projects section shows an error**  
Check that `github` in `profile.json` exactly matches your GitHub username. GitHub limits unauthenticated API requests to 60/hour — if hitting this in dev, wait a few minutes.

**Contact form sends but emails don't arrive**  
Verify that the template variable names in EmailJS match exactly (`{{from_name}}`, `{{message}}`, etc.) and that your template is published, not in draft.

**Weather effects don't appear**  
The visitor must grant location permission. If testing in Chrome, go to DevTools → Application → Permissions and reset site permissions. Also confirm your OpenWeatherMap key is valid.

**Images aren't loading**  
Check filename casing — Linux and macOS file systems are case-sensitive. `AWS-SAA.jpg` ≠ `aws-saa.jpg`. Confirm the file is inside `src/assets/images/` (not just `assets/images/`).

**The timeline "Today" marker isn't positioned correctly**  
The marker position is computed from the earliest and latest `date` values in `timeline.json`. Ensure you have a past event (college start) and a future event (graduation or next goal) so "today" falls naturally between them.

**How do I add a completely new page section?**  
Create a new component under `src/app/components/`, add it to `app.component.html`, import it in `app.component.ts`, and add a nav entry to the `sections` array in `header.component.ts`.

---

*Made with care using Angular 17 · Glassmorphism · SCSS · Signals · GitHub API · EmailJS*
