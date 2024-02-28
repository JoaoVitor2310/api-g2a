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

    // const response1 = await axios.get(`${nossaURL}/api/offers/returnOffersData`);
    // const { myOffers } = response1.data;

    // Apresentação
    const myOffers = [
      {
        productId: '10000190405001',
        // menorPreco: '2.80',
        offerId: '1b8ad65b-6350-4a26-b739-fc260fd99659',
        offerType: 'game',
        offerSize: 1,
        gameName: 'Death Crown Steam Key GLOBAL'
      },
      {
        productId: "10000178835001",
        // menorPreco: -4,
        offerId: "e087dd86-0ab3-4ff1-ba7b-d0188e5254b0",
        offerType: 'game',
        offerSize: 1,
        gameName: "Retro Sphere Steam Key GLOBAL"
      },
      {
        productId: '10000001090003',
        // menorPreco: '3.02',
        offerId: '7192bbbf-0e92-4b06-b799-90e72e1f0da7',
        offerType: 'game',
        offerSize: 10,
        gameName: 'Kung Fury: Street Rage Steam Key GLOBAL'
      },
      {
        productId: '10000500096002',
        // menorPreco: '3.90',
        offerId: '65995352-fa42-4091-9096-f1c1f38fe85c',
        offerType: 'game',
        offerSize: 2,
        gameName: 'DC League of Super-Pets: The Adventures of Krypto and Ace (PC) - Steam Key - GLOBAL'
      },
      {
        productId: '10000176345001',
        // menorPreco: '9.28',
        offerId: 'a0445116-c5cd-4596-9aff-64156b891409',
        offerType: 'game',
        offerSize: 1,
        gameName: 'Mercury Race Steam Key GLOBAL'
      },
      {
        productId: '10000004599002',
        // menorPreco: '2.11',
        offerId: '0f2d5521-efce-4f10-a0ec-2b9bba6ba7da',
        offerType: 'game',
        offerSize: 10,
        gameName: 'ROOT Steam Key GLOBAL'
      },
      {
        productId: '10000195492001',
        offerId: '0dab28d2-eb76-409e-8bd3-246202b2df2b',
        offerType: 'game',
        offerSize: 1,
        gameName: 'Monsters Den: Godfall (PC) - Steam Key - GLOBAL'
      }
    ]

    let jogosAtualizados = [];

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
        console.log(response2.data);

        if (response2.data.menorPreco !== -4) {

          try {
            const response3 = await axios.patch(`${nossaURL}/api/offers/editOffer`, response2.data); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
            if (response3.data) {
              jogosAtualizados.push(response2.data.gameName);
            }
          } catch (error) {
            const jogosFormatados = jogosAtualizados.join('\n');
            res.status(500).json({ error: 'Erro ao consultar a nossa API /editOffer.', jogosFormatados, dados: response2.data });
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
      to: 'bestbuy86bra@gmail.com', // Destinatário
      subject: `Jogos atualizados no dia ${dataFormatada} ${hora2}`, // Assunto
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
    // sendMail(transporter, mailOptions);

    res.json({ jogosAtualizados, error: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar a nossa API /returnOffersData.' });
  }
}

module.exports = {
  attPrices
}