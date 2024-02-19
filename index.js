const express = require('express');
const axios = require('axios');
const router = require('./routes/Router');
require('dotenv').config();

const url = process.env.URL;
const client_id = process.env.G2A_ClientID;
const client_secret = process.env.G2A_ClientSecret;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
      res.send('G2A Server Online');
})

app.use('/', router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})