# Zobrist Project Control MVP

This is a deployable Next.js prototype for your internal project-control app.

## What this version does
- Project dashboard
- New job info
- Contracts
- Change order log
- CO proposal view
- Directory
- RFIs/RFPs
- Submittals
- Schedule
- Closeout

## Important
This version saves data in the browser using localStorage. It is for workflow testing, not production.
The next production step is login + database.

## Local setup
1. Install Node.js from https://nodejs.org
2. Open Terminal/Command Prompt in this folder
3. Run:
   npm install
   npm run dev
4. Open:
   http://localhost:3000

## Deploy to Vercel
1. Create a free account at https://vercel.com
2. Put this folder in a GitHub repo
3. In Vercel, click Add New > Project
4. Import the GitHub repo
5. Deploy
