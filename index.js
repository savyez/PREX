import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Axios configuration with API key from environment variables
const axiosConfig = {
    headers: {
        'x-cg-demo-api-key': process.env.API_KEY
    }
};


// Home Route
app.get('/', (_req, res) => {
    res.render('index.ejs');
});


// Prices Route
app.get('/prices', async (_req, res) => {
    try {
        const response = await axios.get(process.env.COINGECKO_URL + '/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_rank_asc',
                per_page: 10,
                page: 1
            },
            ...axiosConfig
        });
        const result = response.data;
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
                ids: coinId
            },
            ...axiosConfig
        });
        const result = response.data;
        const coin = Array.isArray(result) ? result[0] : undefined;
        res.render('coin.ejs', { 
            coin
        });
    } catch (error) {
        res.status(500).render('coin.ejs', { error });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
