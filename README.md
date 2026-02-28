# Staff Recognition App

A Firebase-powered app for teachers to recognize each other and redeem prizes.

## Features

- Google login via Firebase Auth
- Admin panel to add teachers and prizes
- Teachers can award points and redeem prizes
- Real-time syncing with Firestore
- Modular Firebase SDK for fast loading

## Setup

1. Clone the repo
2. Replace `firebase-config.js` with your Firebase config
3. Run locally or deploy with Firebase Hosting

## Firebase Setup

- Firestore collections:
  - `teachers`: name, email, bank, earned, isAdmin
  - `recognitions`: senderId, recipientId, message, points, timestamp
  - `prizes`: name, cost
  - `redemptions`: teacherId, prizeId, timestamp

## Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
