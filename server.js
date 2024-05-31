const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`https://api.edamam.com/search`, {
            params: {
                q: query,
                app_id: process.env.APP_ID,
                app_key: process.env.API_KEY
            }
        });
    res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
