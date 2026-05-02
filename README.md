# Booknshow Platform
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-E7364D?style=flat-square)
![React](https://img.shields.io/badge/React-18.x-333333?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-v9.x-FFCA28?style=flat-square&logo=firebase)

<div align="center">
  <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="300">
    <text x="10" y="70" font-family="Inter, sans-serif" font-size="64" font-weight="800" fill="#333333" letter-spacing="-2">book</text>
    <g transform="translate(170, 10) rotate(-12)">
      <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
      <text x="21" y="72" font-family="Inter, sans-serif" font-size="60" font-weight="900" fill="#FFFFFF">n</text>
    </g>
    <text x="250" y="70" font-family="Inter, sans-serif" font-size="64" font-weight="800" fill="#333333" letter-spacing="-2">show</text>
  </svg>
  <p>The global enterprise marketplace for verified live event ticketing.</p>
</div>

## Project Overview
Booknshow is a high-performance Multi-Page Application (MPA) built with React and Vite, designed to handle thousands of concurrent users for high-demand ticket sales. It utilizes a zero-lag animation architecture powered by Framer Motion and a real-time distributed database via Google Firebase.

## Strict Branding Config
- Primary Red: #E7364D
- Secondary Red: #EB5B6E
- Background: #FFFFFF
- Deep Text: #333333
- Muted Text: #626262
- Borders: #A3A3A3
- Light Accent: #FAD8DC

## Core Functional Modules
- Fleet Command: Real-time deployment detection and instant cache-busting.
- Identity Sync: Firestore 6-segment pathing for cross-platform user data hydration.
- Dynamic Rails: Admin-configurable homepage sections and hero banners.
- Smart Search: Keyword-enforced search engine with real-time API highlighting.
- Secure Checkout: Integrated with parbet-api for HMAC-SHA256 verified transactions.

## Local Development
```bash
npm install
npm run dev
