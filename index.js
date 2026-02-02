import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

const app = express();
const port = 3000;

app.use(express.json());

app.get ('/', async (_req, res) => {
    try {
        const response = await axios.get( process.env.API_URL + '/tickers');
        const result = response.data;
        res.render('index.ejs', { 
            coins: result,
        });
    } catch (error) {
        res.status(500).send('Error fetching data from external API');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});