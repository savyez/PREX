import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
    path: '.env'
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Axios configuration with API key from environment variables
const axiosConfig = {
    headers: {
        'x-cg-demo-api-key': process.env.API_KEY
    }
};

const REFRESH_MS = 30 * 60 * 1000;
let latestPrices = [];
let refreshingPrices = false;

function buildSparklineData(prices) {
    const w = 300;
    const h = 120;
    const pad = 10;

    if (!Array.isArray(prices) || prices.length < 2) {
        return {
            points: '',
            linePath: '',
            areaPath: ''
        };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = (max - min) || 1;

    const points = prices.map((p, i) => {
        const x = pad + (i / (prices.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (p - min) / range) * (h - pad * 2);
        return {
            x: x.toFixed(2),
            y: y.toFixed(2)
        };
    });

    const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');
    const linePath = `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
    const baseY = (h - pad).toFixed(2);
    const areaPath = `M ${points[0].x} ${points[0].y} L ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
    const lastPoint = points[points.length - 1];

    return {
        points: pointsStr,
        linePath,
        areaPath,
        lastX: lastPoint.x,
        lastY: lastPoint.y
    };
}

async function refreshPricesSnapshot() {
    if (refreshingPrices) {
        return;
    }
    refreshingPrices = true;
    try {
        const response = await axios.get(process.env.COINGECKO_URL + '/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_rank_asc',
                per_page: 12,
                page: 1,
                sparkline: true
            },
            ...axiosConfig
        });
        latestPrices = response.data.map((coin) => {
            const prices = coin.sparkline_in_7d && coin.sparkline_in_7d.price ? coin.sparkline_in_7d.price : [];
            const sparkline = buildSparklineData(prices);
            const sparklineUp = prices.length > 1 ? prices[prices.length - 1] >= prices[0] : false;
            const sparklineMin = prices.length ? Math.min(...prices) : null;
            const sparklineMax = prices.length ? Math.max(...prices) : null;
            return {
                ...coin,
                sparklinePoints: sparkline.points,
                sparklineLinePath: sparkline.linePath,
                sparklineAreaPath: sparkline.areaPath,
                sparklineLastX: sparkline.lastX,
                sparklineLastY: sparkline.lastY,
                sparklineUp,
                sparklineMin,
                sparklineMax
            };
        });
    } finally {
        refreshingPrices = false;
    }
}

setInterval(() => {
    refreshPricesSnapshot().catch((error) => {
        console.error('Auto refresh failed:', error.message);
    });
}, REFRESH_MS);

refreshPricesSnapshot().catch((error) => {
    console.error('Initial refresh failed:', error.message);
});

// Home Route
app.get('/', (_req, res) => {
    res.render('index.ejs');
});

// Prices Route
app.get('/prices', async (_req, res) => {
    try {
        if (!latestPrices.length) {
            await refreshPricesSnapshot();
        }
        const result = latestPrices;
        res.render('prices.ejs', { 
            coins: result,
        });
    } catch (error) {
        res.status(500).send('Error fetching data from external API');
    }
});

app.get('/search', async (req, res) => {
    const coinId = (req.query.query || '').toString().trim();

    if (!coinId) {
        res.render('coin.ejs');
        return;
    }

    try {
        const response = await axios.get(process.env.COINGECKO_URL + '/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: coinId,
                sparkline: true
            },
            ...axiosConfig
        });
        const result = response.data.map((coin) => {
            const prices = coin.sparkline_in_7d && coin.sparkline_in_7d.price ? coin.sparkline_in_7d.price : [];
            const sparkline = buildSparklineData(prices);
            const sparklineUp = prices.length > 1 ? prices[prices.length - 1] >= prices[0] : false;
            const sparklineMin = prices.length ? Math.min(...prices) : null;
            const sparklineMax = prices.length ? Math.max(...prices) : null;
            return {
                ...coin,
                sparklinePoints: sparkline.points,
                sparklineLinePath: sparkline.linePath,
                sparklineAreaPath: sparkline.areaPath,
                sparklineLastX: sparkline.lastX,
                sparklineLastY: sparkline.lastY,
                sparklineUp,
                sparklineMin,
                sparklineMax
            };
        });
        const coin = Array.isArray(result) ? result[0] : undefined;
        res.render('coin.ejs', { 
            coin
        });
    } catch (error) {
        res.status(500).render('coin.ejs', { error });
    }
});

export default app;
