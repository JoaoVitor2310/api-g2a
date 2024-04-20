const express = require('express');
const axios = require('axios');
const router = require('./routes/Router');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
      res.send('Desenvolvido por João Vitor Gouveia e Lucas Corrado.');
})

app.use('/g2a', router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})