const axios = require('axios');
require('dotenv').config();

const url = process.env.URL;
const client_id = process.env.G2A_ClientID;
const client_secret = process.env.G2A_ClientSecret;

const calcPrecoSemTaxa = (menorPreco) => {
    let menorPrecoSemTaxa;
    switch (true) {
        case (menorPreco >= 0.1 && menorPreco <= 0.99):
            menorPrecoSemTaxa = menorPreco / 1.23;
            // console.log(1.23);
            break;
        case (menorPreco >= 1 && menorPreco <= 2.99):
            menorPrecoSemTaxa = menorPreco / 1.30;
            // console.log(1.30);
            break;
        case (menorPreco >= 3 && menorPreco <= 3.99):
            menorPrecoSemTaxa = menorPreco / 1.2775;
            // console.log(1.2775);
            break;
        case (menorPreco >= 4 && menorPreco <= 6.99):
            menorPrecoSemTaxa = menorPreco / 1.255;
            // console.log(1.255);
            break;
        case (menorPreco >= 7 && menorPreco <= 7.99):
            menorPrecoSemTaxa = menorPreco / 1.243;
            // console.log(1.243);
            break;
        case (menorPreco >= 8 && menorPreco <= 8.99):
            menorPrecoSemTaxa = menorPreco / 1.2315;
            // console.log(1.2315);
            break;
        case (menorPreco >= 9 && menorPreco <= 10.49):
            menorPrecoSemTaxa = menorPreco / 1.2085;
            // console.log(1.2085);
            break;
        case (menorPreco >= 10.50 && menorPreco <= 10.99):
            menorPrecoSemTaxa = menorPreco / 1.1970;
            // console.log(1.1970);
            break;
        case (menorPreco >= 11 && menorPreco <= 11.99):
            menorPrecoSemTaxa = menorPreco / 1.1850;
            // console.log(1.1850);
            break;
        case (menorPreco >= 12 && menorPreco <= 12.99):
            menorPrecoSemTaxa = menorPreco / 1.1740;
            // console.log(1.1740);
            break;
        case (menorPreco >= 13 && menorPreco <= 13.99):
            menorPrecoSemTaxa = menorPreco / 1.1620;
            // console.log(1.1620);
            break;
        case (menorPreco >= 14 && menorPreco <= 14.99):
            menorPrecoSemTaxa = menorPreco / 1.1560;
            // console.log(1.1560);
            break;
        case (menorPreco >= 15 && menorPreco <= 16.99):
            menorPrecoSemTaxa = menorPreco / 1.1450;
            // console.log(1.1450);
            break;
        case (menorPreco >= 17 && menorPreco <= 17.49):
            menorPrecoSemTaxa = menorPreco / 1.1390;
            // console.log(1.1390);
            break;
        case (menorPreco >= 17.50 && menorPreco <= 19.99):
            menorPrecoSemTaxa = menorPreco / 1.1330;
            // console.log(1.1330);
            break;
        case (menorPreco >= 20 && menorPreco <= 21.99):
            menorPrecoSemTaxa = menorPreco / 1.1160;
            // console.log(1.1160);
            break;
        case (menorPreco >= 22 && menorPreco <= 22.99):
            menorPrecoSemTaxa = menorPreco / 1.11;
            // console.log(1.11);
            break;
        case (menorPreco >= 23 && menorPreco <= 23.99):
            menorPrecoSemTaxa = menorPreco / 1.098;
            // console.log(1.098);
            break;
        case (menorPreco >= 24 && menorPreco <= 25.99):
            menorPrecoSemTaxa = menorPreco / 1.093;
            // console.log(1.093);
            break;
        case (menorPreco >= 26 && menorPreco <= 49.49):
            menorPrecoSemTaxa = menorPreco / 1.087;
            // console.log(1.087);
            break;
        case (menorPreco >= 49.50):
            menorPrecoSemTaxa = menorPreco / 1.045;
            // console.log(1.045);
            break;
        default:
            console.log("O menorPreco não se encontra em nenhum dos intervalos especificados");
    }

    if (menorPrecoSemTaxa < 0) {
        menorPrecoSemTaxa = 0.01;
      }

    return menorPrecoSemTaxa;

};

module.exports = {
    calcPrecoSemTaxa
}