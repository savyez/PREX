# PREX
Real-Time Crypto Price Tracker which helps you Monitor cryptocurrency prices live and stay ahead of the market.

## Features
- Node.js + Express
- EJS templates (views/header.ejs, views/footer.ejs, views/index.ejs, views/prices.ejs)
- Static assets in `public/` (images, styles/main.css)
- Environment configuration via `.env`

## Prerequisites
- Node.js (16+ recommended)
- npm

## Quick start
1. Install dependencies
```bash
npm install
```
2. Create a `.env` file (optional)
```
PORT=3000
```
3. Start the app
```bash
npm start
# or
node index.js
```
4. Open http://localhost:3000 (or the port you set)

## Project structure
```
.
├─ .env
├─ .gitignore
├─ index.js
├─ package.json
├─ README.md
├─ public/
│  ├─ images/
│  └─ styles/
│     └─ main.css
└─ views/
    ├─ header.ejs
    ├─ footer.ejs
    ├─ index.ejs
    └─ prices.ejs
```

## Notes
- Check `package.json` for available npm scripts (e.g., `start`, `dev`).
- Add environment variables to `.env` as needed.

## Contributing
Submit issues or pull requests. Keep changes focused and include tests where appropriate.
