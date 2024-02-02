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

// app.get('/token', async (req, res) => {
//       try {
//             // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
//             const grant_type = "client_credentials";

//             const response = await axios.post(`${url}/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`, { // url + endpoint + token G2A
//                   // headers: {
//                   //       'Authorization': `Bearer ${token}`
//                   // },
//             });
//             // Retorne os dados da consulta
//             res.json(response.data); // nossa resposta
//       } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao consultar a API externa.' });
//       }
// })


const port = process.env.PORT || 4000;

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})