// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const { getToken } = require('../functions/getToken');
require('dotenv').config();
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;



const attPrices = async (req, res) => {
    // Recebe os jogos que estão a venda, compara para saber se tem o melhor preço e edita a oferta

    // Passo a passo
    // 1- Receber a lista das nossas ofertas(/returnOffersData). FEITO
    // 2 - Comparar com os vendedores concorrentes daquele jogo(/compareById). EM PROGRESSO
    // 3 - Buscar o offerId daquele jogo.
    // 4 - Editar oferta para inserir o preço atualizado.

    const hora1 = new Date().toLocaleTimeString();

    try {
        let jogosAtualizados = [];

        const response1 = await axios.get(`${nossaURL}/api/offers/returnOffersData`);
        const { myOffers } = response1.data;
        // res.json(myOffers);
        // return;
        //Comparar somente um por vez
        for (let offer of myOffers) {
            // let productId = 34229;
            try {
                
                const dataToCompare = {
                    "productId": offer.productId,
                    "offerId": offer.offerId,
                    "offerType": offer.offerType,
                    "offerSize": offer.offerSize,
                    "gameName": offer.gameName,
                }
                console.log(`offerId: ${offer.offerId}`);
                const response2 = await axios.post(`${nossaURL}/api/products/compareById`, dataToCompare); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes, -4 quando já for o melhor preço
                // console.log(response2.data);
                
                console.log(response2.data);
                
                // res.json(response2);
                // return;
                
                
                // const dataToEdit = {
                    //     productId: response2.data.id,
                    //     menorPreco: response2.data.menorPreco,
                    //     offerId: response2.data.offerId
                    // };
                // // console.log(dataToEdit);
                
                // try {
                    //     const response3 = await axios.put(`${nossaURL}/api/offers/editOffer`, dataToEdit, {
                        //         headers: {
                            //             'Authorization': `Bearer ${token}`
                            //         },
                            //     }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
                            //     console.log(response3.data);
                            //     if (response3.data > 0) {
                //         jogosAtualizados.push(response3.data);
                //     }
                // } catch (error) {
                    //     res.status(500).json({ error: 'Erro ao consultar a nossa API /editOffer.', dataToEdit });
                    // }
                    
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Erro ao consultar a nossa API /compareById.' });
                }
            }
            const hora2 = new Date().toLocaleTimeString();
        console.log(`Horário de início: ${hora1}, horário de término: ${hora2}`);
        res.json({ jogosAtualizados, error: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API /returnOffersData.' });
    }
}

module.exports = {
    attPrices
}