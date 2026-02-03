# PREX
Real-time crypto price tracker built with Express and EJS. It pulls market data from CoinGecko, renders price cards, and shows a 7-day chart for a single coin.

## Features
- Node.js + Express + Axios
- EJS views with partials
- 7-day sparkline charts for coins
- Coin search by id (e.g., `bitcoin`, `ethereum`)
- Server refreshes market data every 30 minutes
- Static assets in `public/` (images, styles)
- Environment configuration via `.env`

## Prerequisites
- Node.js (16+ recommended)
- npm

## Quick start
1. Install dependencies
```bash
npm install
```
2. Create a `.env` file
```bash
PORT=3000
COINGECKO_URL=https://api.coingecko.com/api/v3
API_KEY=your_demo_or_pro_key
```
3. Start the app
```bash
npm start
# or
node index.js
```
4. Open http://localhost:3000 (or the port you set)

## Routes
- `GET /` Home page
- `GET /prices` Market list (top 12 by market cap)
- `GET /search?query=coin-id` Single coin chart (7 days)

## Project structure
```
.
|-- .env
|-- .gitignore
|-- index.js
|-- package.json
|-- README.md
|-- public/
|   |-- images/
|   |-- styles/
|       |-- main.css
|       |-- coin.css
|-- views/
|   |-- index.ejs
|   |-- prices.ejs
|   |-- coin.ejs
|   |-- partials/
|       |-- header.ejs
|       |-- footer.ejs
```

## Notes
- CoinGecko rate limits apply; use an API key if required.
- Check `package.json` for available npm scripts.

## Netlify Env Vars
Netlify does not read your local `.env` file in production. Set these in the Netlify UI or CLI so Functions can access them at runtime:
- `COINGECKO_URL` = `https://api.coingecko.com/api/v3`
- `API_KEY` = your CoinGecko key

CLI example:
```bash
netlify env:set COINGECKO_URL https://api.coingecko.com/api/v3
netlify env:set API_KEY your_demo_or_pro_key
```

## Contributing
Submit issues or pull requests. Keep changes focused and include tests where appropriate.
