<div align="center">

#  ShareAlbum
### Digital Album Sharing Platform for Events

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com/)

> A platform to create dedicated digital albums for ceremonies, with a unique QR Code for each event.

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [User Flow](#-user-flow)
- [Features](#-features)
- [Getting Started](#-getting-started)

---

## 🎯 About

ShareAlbum is an interactive web platform that lets users:

- 📁 Create a **dedicated digital album** for each ceremony
- 📲 Let guests join via a **unique QR Code**
- 🔐 Keep content secure with **personal authentication**
- 🖼️ Upload and view photos & videos in a **shared gallery**
- 👤 Manage personal content through a **profile page**

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Frontend** | React.js | SPA with React Hooks |
| **Deployment** | Netlify | Auto-deploy from GitHub, free SSL |
| **Backend** | Supabase | Auth, Database & Storage — no dedicated server |
| **Database** | PostgreSQL | Stores users, ceremonies, and media metadata |
| **Storage** | Supabase Storage | Stores photos and videos |
| **Auth** | Supabase Auth | Email sign-up/login with JWT |
| **QR Code** | qrcode.react | Generates a QR Code per ceremony |

---

## 🔄 User Flow

1. Sign Up / Login → Email Verification → Receive JWT
2. Create Ceremony → Generate QR Code → Share with Guests
3. Guest Scans QR → Opens Ceremony Page
4. Upload Photo/Video → Saved to Storage → Shown in Gallery
5. Manage Content via Profile Page

---

## ✨ Features

- ⚡ **SPA** — Smooth navigation with React Router, no full-page reloads
- 🔒 **Secure** — Only authenticated users can upload content
- 📱 **Responsive** — Works on mobile and desktop
- 🚀 **Extensible** — Ready for likes, comments, and social sharing

---

## 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/username/sharealbum.git
cd sharealbum
```
**2. Install dependencies**
```bash
npm install
```
**3. Set up environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```
**4. Start the development server**
```bash
npm start
```
---

<div align="center">
made with 🩷
</div>
