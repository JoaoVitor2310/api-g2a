const axios = require('axios');
const { getToken } = require('../functions/getToken');
require('dotenv').config();
const url = process.env.URL;


const accountData = async (req, res) => { //nosso endpoint
    // Retorna o saldo e o fator de preço
    try {
          // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
          const response = await axios.get(`${url}/api/public/v1/accounts/data`, { // url + endpoint + token GAMIVO
                headers: {
                      'Authorization': `Bearer ${token}`
                },
          });
          // Retorne os dados da consulta
          res.json(response.data); // nossa resposta
    } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao consultar a API externa.' });
    }
}

const calculateFinalPrice = async (req, res) => {
    // Retorna o preço final usando o fator de preço
    const price = 10;
    try {
          const response = await axios.get(`${url}/api/public/v1/accounts/calculate-final-price/${price}`, {
                headers: {
                      'Authorization': `Bearer ${token}`
                },
          });
          res.json(response.data);
    } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao consultar a API externa.' });
    }
}

module.exports = {
    accountData,
    calculateFinalPrice
}