const axios = require('axios');
require('dotenv').config();

const url = process.env.URL;
const client_id = process.env.G2A_ClientID;
const client_secret = process.env.G2A_ClientSecret;

const getToken = async () => {
    try {
          // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
          const grant_type = "client_credentials";

          const response = await axios.post(`${url}/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`, {
                // url + endpoint + token G2A
                // headers: {
                //     'Authorization': `Bearer ${token}`
                // },
          });

          // Retorne os dados da consulta
          return response.data.access_token; // nossa resposta
    } catch (error) {
          console.error(error);
          throw new Error('Erro ao consultar a API externa.');
    }
};

module.exports = {
    getToken
}