import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

const app = express();
const port = 3000;

app.use(express.json());



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});