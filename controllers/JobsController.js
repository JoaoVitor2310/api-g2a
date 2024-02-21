// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const { getToken } = require('../functions/getToken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const emailPass = process.env.EmailPass;
const nossaURL = process.env.NOSSAURL;



const attPrices = async (req, res) => {
  // Recebe os jogos que estão a venda, compara para saber se tem o melhor preço e edita a oferta

  // Passo a passo
  // 1- Receber a lista das nossas ofertas(/returnOffersData). FEITO
  // 2 - Comparar com os vendedores concorrentes daquele jogo(/compareById). EM PROGRESSO
  // 3 - Buscar o offerId daquele jogo.
  // 4 - Editar oferta para inserir o preço atualizado.

  const hora1 = new Date().toLocaleTimeString();
  const dataAtual = new Date();
  const dia = dataAtual.getDate();
  const mes = dataAtual.getMonth() + 1; // Adicione 1 porque os meses são indexados de 0 a 11
  const ano = dataAtual.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;
  // console.log(dataFormatada);

  try {
    // Configurações de transporte para enviar e-mails usando SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'joaovitormatosgouveia@gmail.com',
        pass: emailPass, // Senha de app. Em gmail.com clique no ícone de perfil -> Gerenciar sua conta do Google -> Segurança -> Verificação em duas etapas -> Senhas de app -> Escreva o nome do app e guarde a senha que será entregue
      },
    });
    
    // res.json('a'); // Debug
    // return;

    const response1 = await axios.get(`${nossaURL}/api/offers/returnOffersData`);
    const { myOffers } = response1.data;
    // res.json(myOffers); // Debug
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
        const response2 = await axios.post(`${nossaURL}/api/products/compareById`, dataToCompare); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes, -4 quando já for o melhor preço
        // console.log(response2.data);

        console.log(response2.data);

        // const dataToEdit = {
        //     productId: response2.data.id,
        //     menorPreco: response2.data.menorPreco,
        //     offerId: response2.data.offerId
        // };
        // // console.log(dataToEdit);


        if (response2.data.menorPreco !== -4) {

          try {
            const response3 = await axios.patch(`${nossaURL}/api/offers/editOffer`, response2.data); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
            if (response3.data) {
              jogosAtualizados.push(response2.data.gameName);
            }
          } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar a nossa API /editOffer.' });
          }
        }

      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API /compareById.' });
      }
    }
    const hora2 = new Date().toLocaleTimeString();
    console.log(`Horário de início: ${hora1}, horário de término: ${hora2}`);


    const jogosFormatados = jogosAtualizados.join('\n');

    // Definir informações do e-mail
    const mailOptions = {
      from: 'joaovitormatosgouveia@gmail.com', // Remetente
      to: 'lucas.corrado.albertao@gmail.com', // Destinatário
      subject: `Jogos atualizados no dia ${dataFormatada}`, // Assunto
      text: `Olá, esses foram os jogos atualizados na G2A!\n${jogosFormatados}`,
    };

    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado.')
      } catch (error) {
        console.error(error);
      }
    }
    sendMail(transporter, mailOptions);

    res.json({ jogosAtualizados, error: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar a nossa API /returnOffersData.' });
  }
}

module.exports = {
  attPrices
}