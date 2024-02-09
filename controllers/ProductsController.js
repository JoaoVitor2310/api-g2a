const axios = require('axios');
const { getToken } = require('../functions/getToken');
require('dotenv').config();

const url = process.env.URL;
const slugify = require('slugify');
const token = process.env.TOKEN;
const taxaGamivoPorcentagemMaiorIgual4 = Number(process.env.TAXA_GAMIVO_PORCENTAGEM_MAIORIGUAL_4);
const taxaGamivoFixoMaiorIgual4 = Number(process.env.TAXA_GAMIVO_FIXO_MAIORIGUAL_4);
const taxaGamivoPorcentagemMenorQue4 = Number(process.env.TAXA_GAMIVO_PORCENTAGEM_MENOR_QUE4);
const taxaGamivoFixoMenorQue4 = Number(process.env.TAXA_GAMIVO_FIXO_MENOR_QUE4);

const compareById = async (req, res) => {
      const { productId, visibility = "retail", countryCode = "BR" } = req.body; // Variáveis necessárias para comparar
      const { offerId, offerType, offerSize } = req.body; // Variáveis que iremos manter para o próximo endpoint

      const { myOffers } = req.body; // Variáveis que iremos manter para o próximo endpoint


      const token = await getToken();

      // for(let offer of myOffers){
      //       console.log(offer.productId);
      // }
      // res.json('a');
      // return;
      try {
            const response = await axios.get(`${url}/v3/products/${productId}/offers?visibility=${visibility}&countryCode=${countryCode}&itemsPerPage=100`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            
            // console.log(response.data.data[0]); // Debug
            const quantidade = response.data.data.length;
            
            let menorPrecoSemCandango = Number.MAX_SAFE_INTEGER, menorPrecoComTaxa; // 
            let menorPrecoTotal = Number.MAX_SAFE_INTEGER; // Define um preço alto para depois ser substituído pelos menores preços de verdade
            let menorPreco; // Só para enviar na resposta
            let segundoMenorPreco; // Como vem ordenado, o segundo é sempre o segundo menor preço
            let offerId;
            
            if (response.data.data[0].seller.name !== 'Bestbuy86') { // Checar se nós já somos o menor preço
                  
                  //Separar caso que só tem ele vendendo
                  if (response.data[1]) {
                        segundoMenorPreco = response.data[1].retail_price;
                  }
                  
                  for (const produto of response.data.data) {
                        
                        


                        if (produto.seller.name !== 'Bestbuy86') {
                              let ignoreSeller = false; // True = candango, false = vendedor experiente
                              // Obtém o preço de varejo do produto
                              
                              const precoAtual = produto.price.retail.final[0].value;
                              const quantidadeVendas = produto.seller.ratingsCount;
                              console.log(`precoAtual: ${precoAtual}`); // Debug
                              console.log(`quantidadeVendas: ${quantidadeVendas}`); // Debug
                              
                              
                              if (quantidadeVendas < 200) {
                                    ignoreSeller = true;
                                    qtdCandango++;
                              }
                              
                              if (precoAtual < menorPrecoTotal) {
                                    menorPrecoTotal = precoAtual; // Define um preço independente se é candango ou não
                              }
                              
                              if (precoAtual < menorPrecoSemCandango) {
                                    if (!ignoreSeller) { // Se não for candango
                                          menorPrecoSemCandango = precoAtual; // Define um preço considerando SOMENTE vendedores experientes
                                    }
                              }
                        } else {
                              offerId = produto.id;
                        }
                  }
                  
                  if (qtdCandango >= 3) {
                        console.log(`MAIS DE 3 CANDANGOS NO ID: ${id} `); // Considera o preço menor independente
                        menorPreco = menorPrecoTotal;
                  } else {
                        menorPreco = menorPrecoSemCandango; // Considera SOMENTE os preços dos vendedores experientes
                  }
                  
                  if (response.data.data.length == 1 || menorPrecoTotal == Number.MAX_SAFE_INTEGER) {
                        console.log(`Você é o único vendedor do productId: ${id}`)
                        res.json({ id, menorPreco: -2 }); // Sem concorrentes
                  } else {
                        
                        if (menorPrecoTotal !== menorPrecoSemCandango) {
                              console.log(`TEM CANDANGO NESSE JOGO.`)
                              console.log(`menorPrecoTotal: ${menorPrecoTotal}, menorPrecoSemCandango: ${menorPrecoSemCandango}`);
                              if (menorPrecoSemCandango == Number.MAX_SAFE_INTEGER) { // Caso os concorrentes sejam < 3 candangos e não tenha nenhum normal
                                    res.json({ id, menorPreco: -4 });
                                    return;
                              }
                        }
                        // res.json(quantidade);
                        // return;
                        
                        if (segundoMenorPreco > 1.0) { // Lógica para os samfiteiros
                              const diferenca = segundoMenorPreco - menorPreco;
                              const dezPorCentoSegundoMenorPreco = 0.1 * segundoMenorPreco;

                              if (diferenca >= dezPorCentoSegundoMenorPreco) {
                                    console.log('SAMFITEIRO!');
                                    if (response.data.data[1].seller.name == 'Bestbuy86') { // Tem samfiteiro, mas ele é o segundo, não altera o preço
                                          console.log('Já somos o segundo melhor preço!');
                                          res.json({ id, menorPreco: -4 });
                                          return;
                                    } else { // Tem samfiteiro, mas ele não é o segundo, altera o preço
                                          console.log(`Menor preço antes: ${menorPreco}`);
                                          menorPreco = response.data.data[1].price.final[0].value;
                                          console.log(`Menor preço depois: ${menorPreco}`);
                                    }
                              }
                        }

                        // if (menorPreco < 4) { // Calcula a taxa do novo preço
                        //       menorPrecoComTaxa = menorPreco + (menorPreco * taxaGamivoPorcentagemMenorQue4) + taxaGamivoFixoMenorQue4;
                        // } else {
                        //       menorPrecoComTaxa = menorPreco + (menorPreco * taxaGamivoPorcentagemMaiorIgual4) + taxaGamivoFixoMaiorIgual4;
                        // }

                        // Calcula o novo preço sem a taxa, a gamivo irá adicionar as taxas dps, e o menorPreco será atingido
                        menorPreco = menorPreco - 0.02;
                        if (menorPreco < 4) {
                              menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMenorQue4) / (1 + taxaGamivoPorcentagemMenorQue4);
                        }
                        else {
                              menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMaiorIgual4) / (1 + taxaGamivoPorcentagemMaiorIgual4)
                        }
                        console.log(`Para o menorPreco ${menorPreco.toFixed(3)} ser listado, o preço sem taxa deve ser: ${menorPrecoSemTaxa.toFixed(3)}`);

                        if (menorPrecoSemTaxa < 0) {
                              menorPrecoSemTaxa = 0.00;
                        }

                        res.json({ id, menorPreco: menorPrecoSemTaxa.toFixed(3), offerId });

                  }
                  res.json('response.data'); // Debug
                  return;

            } else {

                  // console.log(response.data.data[0]); // Debug
                  // res.json('response.data');
                  // return;

                  if (response.data[1]) {
                        segundoMenorPreco = response.data[1].retail_price;
                        const nossoPreco = response.data[0].retail_price;
                        const diferenca = segundoMenorPreco - nossoPreco;

                        if (diferenca >= 0.10) {
                              menorPreco = segundoMenorPreco - 0.02;

                              if (menorPreco < 4) {
                                    menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMenorQue4) / (1 + taxaGamivoPorcentagemMenorQue4);
                              }
                              else {
                                    menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMaiorIgual4) / (1 + taxaGamivoPorcentagemMaiorIgual4)
                              }

                              if (menorPrecoSemTaxa < 0) {
                                    menorPrecoSemTaxa = 0.00;
                              }

                              offerId = response.data[0].id;
                              console.log("ESTAMOS COM O PREÇO ABAIXO, IREMOS AUMENTAR!");
                              res.json({ id, menorPreco: menorPrecoSemTaxa.toFixed(3), offerId });
                        } else {
                              res.json({ id, menorPreco: -4 });
                        }
                  } else {
                        res.json({ id, menorPreco: -4 });
                  }
            }



      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

module.exports = {
      compareById,
}