const axios = require('axios');
const { getToken } = require('../functions/getToken');
require('dotenv').config();

const url = process.env.URL;
const slugify = require('slugify');
const { calcPrecoSemTaxa } = require('../functions/calcPrecoSemTaxa');

const compareById = async (req, res) => {
  const visibility = 'retail', countryCode = 'BR'; // Variáveis necessárias para comparar
  let { productId, offerType, offerSize, gameName, offerId } = req.body; // Variáveis que iremos receber do returnOfferData
  const token = await getToken();
  let casoEspecial = false;

  try {
    const response = await axios.get(
      `${url}/v3/products/${productId}/offers?visibility=${visibility}&countryCode=${countryCode}&itemsPerPage=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // res.json(response.data); // Só descomentar caso queira ver as informações dos vendedores do jogo
    // return;

    let menorPrecoSemCandango = Number.MAX_SAFE_INTEGER, menorPrecoTotal = Number.MAX_SAFE_INTEGER, segundoMenorPreco, menorPreco, qtdCandango = 0;

    if (response.data.data.length == 0) {
      console.log('Jogo fora de estoque na G2A');
      res.json({ productId, offerId, menorPreco: -4, gameName })
    } else {
      // Tem estoque do jogo na g2a
      if (response.data.data[0].seller.name !== 'Bestbuy86') {
        // Somos o segundo ou depois do segundo e kinguin não é o primeiro

        //Separar caso que só tem ele vendendo
        if (response.data.data[1]) {
          segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
        }

        if (response.data.data[0].seller.name == 'Kinguin' && response.data.data[1].seller.name == 'Bestbuy86') {
          casoEspecial = true;
          console.log(`1° - Kinguin, 2° - Bestbuy86`)
          // res.json({ productId, menorPreco: -4, gameName });
          // return;
        } else {
          for (const produto of response.data.data) {
            if (produto.seller.name !== 'Bestbuy86' && produto.seller.name !== 'Kinguin') {
              let ignoreSeller = false; // True = candango, false = vendedor experiente
              // Obtém o preço de varejo do produto

              const precoAtual = produto.price.retail.final[0].value;
              const quantidadeVendas = Number(produto.seller.ratingsCount);
              // console.log(`precoAtual: ${precoAtual}`); // Debug
              // console.log(`quantidadeVendas: ${quantidadeVendas}`); // Debug

              if (quantidadeVendas < 200) {
                ignoreSeller = true;
                qtdCandango++;
              }

              if (Number(precoAtual) < menorPrecoTotal) {
                menorPrecoTotal = precoAtual; // Define um preço independente se é candango ou não
              }

              if (Number(precoAtual) < menorPrecoSemCandango) {
                if (!ignoreSeller) {
                  // Se não for candango
                  menorPrecoSemCandango = precoAtual; // Define um preço considerando SOMENTE vendedores experientes
                }
              }
            } else if (produto.seller.name == 'Bestbuy86') {
              offerId = produto.id; // Na vdd nem precisa, mas é bom para garantir que o offerId está correto.
            }
          }

          console.log(menorPrecoSemCandango);

          if (qtdCandango >= 3) {
            console.log(`MAIS DE 3 CANDANGOS NO ID: ${productId} `); // Considera o preço menor independente
            if (response.data.data[0].seller.ratingsCount < 200) {
              console.log('O PRIMEIRO É CANDANGO');
              if (response.data.data[1].seller.ratingsCount < 200) {
                console.log('O SEGUNDO É CANDANGO');
                if (response.data.data[2].seller.ratingsCount < 200) {
                  console.log('O TERCEIRO É CANDANGO, BATE O PREÇO DO PRIMEIRO');
                  menorPreco = response.data.data[0].price.retail.final[0].value;
                } else {
                  menorPreco = response.data.data[2].price.retail.final[0].value;
                }
              } else {
                menorPreco = response.data.data[1].price.retail.final[0].value;
              }
              // response.data.data[0].price.retail.final[0].value
            } else {
              menorPreco = response.data.data[0].price.retail.final[0].value;
            }
            console.log('Novo menor preço:' + menorPreco);
            // menorPreco = menorPrecoTotal;
          } else {
            menorPreco = menorPrecoSemCandango; // Considera SOMENTE os preços dos vendedores experientes
          }

          if (response.data.data.length == 1 || menorPrecoTotal == Number.MAX_SAFE_INTEGER) {
            console.log(`Você é o único vendedor do productId: ${productId}`);
            // res.json({ productId, menorPreco: -2, gameName }); // Sem concorrentes
            res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // Sem concorrentes. Alterar pro price-researcher
          } else {
            if (menorPrecoTotal !== menorPrecoSemCandango) {
              console.log(`TEM CANDANGO NESSE JOGO.`);
              console.log(
                `menorPrecoTotal: ${menorPrecoTotal}, menorPrecoSemCandango: ${menorPrecoSemCandango}`
              );
              if (menorPrecoSemCandango == Number.MAX_SAFE_INTEGER) {
                // Caso os concorrentes sejam < 3 candangos e não tenha nenhum normal
                res.json({ productId, menorPreco: -4, gameName });
                return;
              }
            }

            if (segundoMenorPreco > 1.0) {
              // Lógica para os samfiteiros
              const diferenca = segundoMenorPreco - menorPreco;
              const dezPorCentoSegundoMenorPreco = 0.1 * segundoMenorPreco;

              if (diferenca >= dezPorCentoSegundoMenorPreco) {
                console.log('SAMFITEIRO!');
                if (response.data.data[1].seller.name == 'Bestbuy86') {
                  // Tem samfiteiro, mas ele é o segundo, não altera o preço
                  console.log('Já somos o segundo melhor preço!');
                  res.json({ productId, menorPreco: -4, gameName });
                  return;
                } else {
                  // Tem samfiteiro, mas não somos o segundo, altera o preço
                  menorPreco = response.data.data[1].price.retail.final[0].value;
                }
              }
            }

            menorPreco = menorPreco - 0.02;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }
            let menorPrecoSemTaxa = calcPrecoSemTaxa(menorPreco);

            console.log(`Para o menorPreco ${menorPreco.toFixed(2)} ser listado, o preço sem taxa deve ser: ${menorPrecoSemTaxa.toFixed(2
            )}`);

            res.json({
              productId,
              menorPreco: menorPrecoSemTaxa.toFixed(2),
              offerId,
              offerType,
              offerSize,
              gameName
            });
          }
        }

      } else if (response.data.data[0].seller.name == 'Bestbuy86') { // Somos o primeiro ou (somos o segundo com Kinguin em primeiro)

        if (response.data.data[1]) { // Se tem segundo lugar
          if (response.data.data[1].seller.name !== 'Kinguin') { // Se o segundo não for a kinguin
            segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
          } else { // kinguin é o segundo
            if (response.data.data[2]) { // "Segundo menor preço" é na vdd o terceiro
              segundoMenorPreco = response.data.data[2].price.retail.final[0].value;
            } else { // Segundo é a kinguin mas não tem o terceiro vendedor
              res.json({ productId, menorPreco: -4, gameName }); 
            }
          }

          let nossoPreco;
          if (response.data.data[0].seller.name == 'Bestbuy86') {
            nossoPreco = response.data.data[0].price.retail.final[0].value;
          } else {
            nossoPreco = response.data.data[1].price.retail.final[0].value;
          }

          const diferenca = segundoMenorPreco - nossoPreco;
          if (diferenca >= 0.1) {
            menorPreco = segundoMenorPreco - 0.02;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }
            let menorPrecoSemTaxa = calcPrecoSemTaxa(menorPreco);

            offerId = response.data.data[0].id;
            console.log('ESTAMOS COM O PREÇO ABAIXO, IREMOS AUMENTAR!');
            console.log(`Para o menorPreco ${menorPreco.toFixed(2)} ser listado, o preço sem taxa deve ser: ${menorPrecoSemTaxa.toFixed(3
            )}`);
            res.json({
              productId,
              menorPreco: menorPrecoSemTaxa.toFixed(2),
              offerId,
              offerType,
              offerSize,
              gameName
            });
          } else {
            console.log('Já somos o melhor preço, nada para fazer!');
            res.json({ productId, menorPreco: nossoPreco, gameName }); // Alterar para o price-researcher?
          }

        } else {
          res.json({ productId, menorPreco: -4, gameName }); // Alterar para o price-researcher?
        }
      }
      
      if (casoEspecial) { // Não somos o primeiro e kinguin é o primeiro, não dá p fazer isso com os ifs acima
        if (response.data.data[1]) { // Se tem segundo lugar
          if (response.data.data[1].seller.name !== 'Kinguin') { // Se o segundo não for a kinguin
            segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
          } else { // kinguin é o segundo
            if (response.data.data[2]) { // "Segundo menor preço" é na vdd o terceiro
              segundoMenorPreco = response.data.data[2].price.retail.final[0].value;
            } else { // Segundo é a kinguin mas não tem o terceiro vendedor
              res.json({ productId, menorPreco: -4, gameName });
            }
          }

          let nossoPreco;
          if (response.data.data[0].seller.name == 'Bestbuy86') {
            nossoPreco = response.data.data[0].price.retail.final[0].value;
          } else {
            nossoPreco = response.data.data[1].price.retail.final[0].value;
          }

          const diferenca = segundoMenorPreco - nossoPreco;
          if (diferenca >= 0.1) {
            menorPreco = segundoMenorPreco - 0.02;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }
            let menorPrecoSemTaxa = calcPrecoSemTaxa(menorPreco);

            offerId = response.data.data[0].id;
            console.log('ESTAMOS COM O PREÇO ABAIXO, IREMOS AUMENTAR!');
            console.log(`Para o menorPreco ${menorPreco.toFixed(2)} ser listado, o preço sem taxa deve ser: ${menorPrecoSemTaxa.toFixed(3
            )}`);
            res.json({
              productId,
              menorPreco: menorPrecoSemTaxa.toFixed(2),
              offerId,
              offerType,
              offerSize,
              gameName
            });
          } else {
            console.log('Já somos o melhor preço, nada para fazer!');
            res.json({ productId, menorPreco: -4, gameName });
          }

        } else {
          res.json({ productId, menorPreco: -4, gameName });
        }
      }

    }
  } catch (error) {
    console.error(error);
    console.log(`Error em ${productId, offerId}`)
    res.status(500).json({ error: 'Erro ao consultar a API externa.' });
  }
};

const priceResearcher = async (req, res) => {
  const { productId } = req.params; // Variáveis que iremos receber do returnOfferData
  const visibility = 'retail', countryCode = 'BR'; // Variáveis necessárias para comparar
  const token = await getToken();
  let casoEspecial = false;

  try {
    const response = await axios.get(
      `${url}/v3/products/${productId}/offers?visibility=${visibility}&countryCode=${countryCode}&itemsPerPage=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // res.json(response.data); // Só descomentar caso queira ver as informações dos vendedores do jogo
    // return;

    let menorPrecoSemCandango = Number.MAX_SAFE_INTEGER, menorPrecoTotal = Number.MAX_SAFE_INTEGER, segundoMenorPreco, menorPreco, qtdCandango = 0;

    if (response.data.data.length == 0) {
      console.log('Jogo fora de estoque na G2A');
      res.json({ productId, offerId, menorPreco: "O", gameName })
    } else {
      // Tem estoque do jogo na g2a
      if (response.data.data[0].seller.name !== 'Bestbuy86') {
        // Somos o segundo ou depois do segundo e kinguin não é o primeiro

        //Separar caso que só tem ele vendendo
        if (response.data.data[1]) {
          segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
        }

        if (response.data.data[0].seller.name == 'Kinguin' && response.data.data[1].seller.name == 'Bestbuy86') {
          casoEspecial = true;
          console.log(`1° - Kinguin, 2° - Bestbuy86`)
          // res.json({ productId, menorPreco: -4, gameName });
          // return;
        } else {
          for (const produto of response.data.data) {
            if (produto.seller.name !== 'Bestbuy86' && produto.seller.name !== 'Kinguin') {
              let ignoreSeller = false; // True = candango, false = vendedor experiente
              // Obtém o preço de varejo do produto

              const precoAtual = produto.price.retail.final[0].value;
              const quantidadeVendas = Number(produto.seller.ratingsCount);
              // console.log(`precoAtual: ${precoAtual}`); // Debug
              // console.log(`quantidadeVendas: ${quantidadeVendas}`); // Debug

              if (quantidadeVendas < 200) {
                ignoreSeller = true;
                qtdCandango++;
              }

              if (Number(precoAtual) < menorPrecoTotal) {
                menorPrecoTotal = precoAtual; // Define um preço independente se é candango ou não
              }

              if (Number(precoAtual) < menorPrecoSemCandango) {
                if (!ignoreSeller) {
                  // Se não for candango
                  menorPrecoSemCandango = precoAtual; // Define um preço considerando SOMENTE vendedores experientes
                }
              }
            } else if (produto.seller.name == 'Bestbuy86') {
              offerId = produto.id; // Na vdd nem precisa, mas é bom para garantir que o offerId está correto.
            }
          }

          if (qtdCandango >= 3) {
            console.log(`MAIS DE 3 CANDANGOS NO ID: ${productId} `); // Considera o preço menor independente
            if (response.data.data[0].seller.ratingsCount < 200) {
              console.log('O PRIMEIRO É CANDANGO');
              if (response.data.data[1].seller.ratingsCount < 200) {
                console.log('O SEGUNDO É CANDANGO');
                if (response.data.data[2].seller.ratingsCount < 200) {
                  console.log('O TERCEIRO É CANDANGO, BATE O PREÇO DO PRIMEIRO');
                  menorPreco = response.data.data[0].price.retail.final[0].value;
                } else {
                  menorPreco = response.data.data[2].price.retail.final[0].value;
                }
              } else {
                menorPreco = response.data.data[1].price.retail.final[0].value;
              }
            } else {
              menorPreco = response.data.data[0].price.retail.final[0].value;
            }
            console.log('Novo menor preço:' + menorPreco);
          } else {
            menorPreco = menorPrecoSemCandango; // Considera SOMENTE os preços dos vendedores experientes
          }

          if (response.data.data.length == 1 || menorPrecoTotal == Number.MAX_SAFE_INTEGER) {
            console.log(`Você é o único vendedor do productId: ${productId}`);
            // res.json({ productId, menorPreco: -2, gameName }); // Sem concorrentes
            res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // Sem concorrentes. Alterar pro price-researcher
          } else {
            if (menorPrecoTotal !== menorPrecoSemCandango) {
              console.log(`TEM CANDANGO NESSE JOGO.`);
              console.log(
                `menorPrecoTotal: ${menorPrecoTotal}, menorPrecoSemCandango: ${menorPrecoSemCandango}`
              );
              if (menorPrecoSemCandango == Number.MAX_SAFE_INTEGER) {
                // Caso os concorrentes sejam < 3 candangos e não tenha nenhum normal
                res.json({ productId, menorPreco: -4, gameName });
                return;
              }
            }

            if (segundoMenorPreco > 1.0) {
              // Lógica para os samfiteiros
              const diferenca = segundoMenorPreco - menorPreco;
              const dezPorCentoSegundoMenorPreco = 0.1 * segundoMenorPreco;

              if (diferenca >= dezPorCentoSegundoMenorPreco) {
                console.log('SAMFITEIRO!');
                if (response.data.data[1].seller.name == 'Bestbuy86') {
                  // Tem samfiteiro, mas ele é o segundo, não altera o preço
                  console.log('Já somos o segundo melhor preço!');
                  res.json({ productId, menorPreco: response.data.data[1].price.retail.final[0].value, gameName }); // Alterar para o price-researcher
                  return;
                } else {
                  // Tem samfiteiro, mas não somos o segundo, altera o preço
                  menorPreco = response.data.data[1].price.retail.final[0].value;
                }
              }
            }

            menorPreco = menorPreco - 0.01;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }

            res.json({
              productId,
              menorPreco: menorPreco.toFixed(2),
            });
          }
        }

      } else if (response.data.data[0].seller.name == 'Bestbuy86') { // Somos o primeiro ou (somos o segundo com Kinguin em primeiro)

        if (response.data.data[1]) { // Se tem segundo lugar
          if (response.data.data[1].seller.name !== 'Kinguin') { // Se o segundo não for a kinguin
            segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
          } else { // kinguin é o segundo
            if (response.data.data[2]) { // "Segundo menor preço" é na vdd o terceiro
              segundoMenorPreco = response.data.data[2].price.retail.final[0].value;
            } else { // Segundo é a kinguin mas não tem o terceiro vendedor
              // res.json({ productId, menorPreco: -4, gameName }); 
              res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // Alterar para o price-researcher
            }
          }

          let nossoPreco;
          if (response.data.data[0].seller.name == 'Bestbuy86') {
            nossoPreco = response.data.data[0].price.retail.final[0].value;
          } else {
            nossoPreco = response.data.data[1].price.retail.final[0].value;
          }

          const diferenca = segundoMenorPreco - nossoPreco;
          if (diferenca >= 0.1) {
            menorPreco = segundoMenorPreco - 0.02;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }

            console.log('ESTAMOS COM O PREÇO ABAIXO, IREMOS AUMENTAR!');
            res.json({
              productId,
              menorPreco: menorPreco.toFixed(2),
            });
          } else {
            console.log('Já somos o melhor preço, nada para fazer!');
            res.json({ productId, menorPreco: nossoPreco.toFixed(2) }); // Alterar para o price-researcher?
          }

        } else {
          // res.json({ productId, menorPreco: -4 }); // Alterar para o price-researcher?
          res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // alterar pro price-researcher?
        }
      }

      if (casoEspecial) { // Não somos o primeiro e kinguin é o primeiro, não dá p fazer isso com os ifs acima
        if (response.data.data[1]) { // Se tem segundo lugar
          if (response.data.data[1].seller.name !== 'Kinguin') { // Se o segundo não for a kinguin
            segundoMenorPreco = response.data.data[1].price.retail.final[0].value;
          } else { // kinguin é o segundo
            if (response.data.data[2]) { // "Segundo menor preço" é na vdd o terceiro
              segundoMenorPreco = response.data.data[2].price.retail.final[0].value;
            } else { // Segundo é a kinguin mas não tem o terceiro vendedor
              // res.json({ productId, menorPreco: -4, gameName });
              res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // Alterar para o price-researcher
            }
          }

          let nossoPreco;
          if (response.data.data[0].seller.name == 'Bestbuy86') {
            nossoPreco = response.data.data[0].price.retail.final[0].value;
          } else {
            nossoPreco = response.data.data[1].price.retail.final[0].value;
          }

          const diferenca = segundoMenorPreco - nossoPreco;
          if (diferenca >= 0.1) {
            menorPreco = segundoMenorPreco - 0.01;
            if (menorPreco < 0.57) {
              menorPreco = 0.57; // Garante que esse será o preço mínimo de venda(0.57 para ter pelo menos 0.01 de lucro)
            }

            console.log('ESTAMOS COM O PREÇO ABAIXO, IREMOS AUMENTAR!');
            res.json({
              productId,
              menorPreco: menorPreco.toFixed(2),
            });
          } else {
            console.log('Já somos o melhor preço, nada para fazer!');
            // res.json({ productId, menorPreco: -4, gameName });
            res.json({ productId, menorPreco: nossoPreco.toFixed(2), gameName }); // Alterar para o price-researcher
          }

        } else {
          // res.json({ productId, menorPreco: -4, gameName });
          res.json({ productId, menorPreco: response.data.data[0].price.retail.final[0].value, gameName }); // Alterar para o price-researcher
        }
      }

    }
  } catch (error) {
    console.error(error);
    console.log(`Error em ${productId, offerId}`)
    res.status(500).json({ error: 'Erro ao consultar a API externa.' });
  }
};

module.exports = {
  compareById,
  priceResearcher
};
