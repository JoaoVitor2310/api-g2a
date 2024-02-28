const axios = require('axios');
const { getToken } = require('../functions/getToken');
require('dotenv').config();
const url = process.env.URL;


const offerList = async (req, res) => {
      // Lista os jogos que estão a venda em páginas de 100
      // Offset = A partir de qual jogo vai mostrar
      // Limit = Limite por página, não pode ser maior que 100

      const { itemsPerPage, page, active } = req.query;

      const token = await getToken();

      try {
            // Offerlist normal
            const response = await axios.get(`${url}/v3/sales/offers?itemsPerPage=${itemsPerPage}&page=${page}&active=${active}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // const quantidade = response.data.length;
            // console.log(quantidade);
            res.json(response.data);
      } catch (error) {
            console.error(error.response.data.errors);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

const returnOffersData = async (req, res) => {
      // Lista os jogos que estão a venda em páginas de 100
      // Offset = A partir de qual jogo vai mostrar
      // Limit = Limite por página, não pode ser maior que 100

      let itemsPerPage = 100, page = 1, active = true;

      const token = await getToken();
      let myOffers = [], quantidade = 0, quatidadeTotal = 0, isDone = false, impossibleGame = 0;

      try {
            while (!isDone) {
                  try {
                        const response = await axios.get(`${url}/v3/sales/offers?itemsPerPage=${itemsPerPage}&page=${page}&active=${active}`, {
                              headers: {
                                    'Authorization': `Bearer ${token}`
                              },
                        });

                        // res.json(response.data); // Debug
                        // return;

                        quantidade = response.data.data.length // Quantidade de ofertas naquela página
                        quatidadeTotal += quantidade; // Quantidade total de ofertas

                        if (quantidade == 0) { // Aqui que termina o loop do while
                              console.log(`Acabou!`);
                              // console.log(totalNaoGames);
                              res.json({ myOffers });
                              isDone = true;
                              return;
                        }

                        for (let i = 0; i < response.data.data.length; i++) {
                              let productId = response.data.data[i].product.id;
                              let gameName = response.data.data[i].product.name;
                              // console.log(gameName);
                              let offerId = response.data.data[i].id;
                              let offerType = response.data.data[i].type;
                              let offerSize = response.data.data[i].inventory.size;

                              // if (response.data.data[i].product.name.includes("Monsters' Den: Godfall")) { // Debug: Procurando jogo pelo nome
                              //       res.json(response.data.data[i]);
                              //       isDone = true;
                              //       return;
                              // }

                              if (response.data.data[i].inventory.size == response.data.data[i].inventory.sold) {
                                    impossibleGame++;
                                    // console.log(offerId);
                              } else {
                                    const newGame = new Object;
                                    newGame.productId = productId;
                                    newGame.offerId = offerId;
                                    newGame.offerType = offerType;
                                    newGame.offerSize = offerSize;
                                    newGame.gameName = gameName;
                                    myOffers.push(newGame);
                              }

                        }
                        page++;
                        console.log(`Página: ${page}`);
                  } catch (error) {
                        console.error(error.response.data.errors);
                        res.status(500).json({ error: 'Erro ao consultar a API externa.' });
                  }
            }
      } catch (error) {
            console.error(error.response.data.errors);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}


const searchOfferById = async (req, res) => {
      // Procura a oferta pelo id
      const { offerId } = req.params;

      const token = await getToken();

      try {
            // Offerlist normal
            const response = await axios.get(`${url}/v3/sales/offers/${offerId}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            res.json(response.data);
      } catch (error) {
            // console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

const editOffer = async (req, res) => {
      // Passo a passo
      // Recebe o offerId, valorPago, menorPreco, productId pelo body
      // Define o limite da api?
      // Edita pelo offerId
      // Edita os dados
      // Armazena a hora que foi editado

      const { productId, menorPreco, offerId, offerType, offerSize, gameName } = req.body;
      // console.log(productId, menorPreco, offerId, offerType, offerSize, gameName);

      const dataToEdit = {
            offerType,
            variant: {
                  visibility: "all",
                  active: true,
                  archive: false,
                  inventory: {
                        size: Number(offerSize),
                  },
                  price: {
                        retail: menorPreco,
                        // business: "0.57"
                  }
            }
      }

      // console.log(dataToEdit);
      // res.json('a'); // Debug
      // return;

      const token = await getToken();

      if (offerId) {
            try {
                  // Offerlist normal
                  const response = await axios.patch(`${url}/v3/sales/offers/${offerId}`, dataToEdit, {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        },
                  });

                  if (response.data.data.jobId) {
                        console.log('OK!')
                  //       res.json(response.data);
                  } else {
                        console.log('Erro ao editar o preço');
                  //       res.json(-5);
                  }

                  res.json(response.data);
            } catch (error) {
                  console.error(error.response.data.errors);
                  res.status(500).json({ error: 'Erro ao consultar a API externa.' });
            }
      } else {
            console.log('Já somos o melhor preço.');
            res.json(-5);
      }
}

const returnOfferId = async (req, res) => {
      // Retornar o offerId daquele productId

      const { productId } = req.params; // O jogo está sendo recebido pelo id nos params
      try {
            const response = await axios.get(`${url}/api/public/v1/products/${productId}/offers`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });

            // console.log(response.data);
            // res.json(response.data);

            var objetoEncontrado = response.data.find(function (objeto) { // Procura pelo objeto que é vendido por nós, e retorna a offerId
                  return objeto.seller_name === 'Bestbuy86'; // Nome do vendedor tem que ser da nossa loja
            });

            if (!objetoEncontrado) { // Se nós temos o produto mas a oferta não está ativa(status = 0)
                  res.json(-3); // offerId é retornada como -3 para identificar que não estamos vendendo aquele jogo atualmente
                  return;
            }

            res.json(objetoEncontrado.id); // offerId é retornada
            return;
      } catch (error) {
            console.error(error.response.data.errors);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

module.exports = {
      offerList,
      searchOfferById,
      editOffer,
      returnOfferId,
      returnOffersData
}