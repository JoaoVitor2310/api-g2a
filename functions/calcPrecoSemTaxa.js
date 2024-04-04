const axios = require('axios');
require('dotenv').config();

const calcPrecoSemTaxa = (menorPreco) => {
    let menorPrecoSemTaxa;
    menorPreco = menorPreco.toFixed(2);
    
    switch (true) {
        case (menorPreco >= 0.1 && menorPreco <= 1.22):
            menorPrecoSemTaxa = menorPreco / 1.23;
            // console.log(1.23);
            break;
        case (menorPreco >= 1.23 && menorPreco <= 3.82):
            menorPrecoSemTaxa = menorPreco / 1.30;
            // console.log(1.30);
            break;
        case (menorPreco >= 3.83 && menorPreco <= 5.01):
            menorPrecoSemTaxa = menorPreco / 1.2775;
            // console.log(1.2775);
            break;
        case (menorPreco >= 5.02 && menorPreco <= 8.69):
            menorPrecoSemTaxa = menorPreco / 1.255;
            // console.log(1.255);
            break;
        case (menorPreco >= 8.70 && menorPreco <= 9.84):
            menorPrecoSemTaxa = menorPreco / 1.243;
            // console.log(1.243);
            break;
        case (menorPreco >= 9.85 && menorPreco <= 10.87):
            menorPrecoSemTaxa = menorPreco / 1.2315;
            // console.log(1.2315);
            break;
        case (menorPreco >= 10.88 && menorPreco <= 12.56):
            menorPrecoSemTaxa = menorPreco / 1.2085;
            // console.log(1.2085);
            break;
        case (menorPreco >= 12.57 && menorPreco <= 13.03):
            menorPrecoSemTaxa = menorPreco / 1.1970;
            // console.log(1.1970);
            break;
        case (menorPreco >= 13.04 && menorPreco <= 14.08):
            menorPrecoSemTaxa = menorPreco / 1.1850;
            // console.log(1.1850);
            break;
        case (menorPreco >= 14.09 && menorPreco <= 15.10): //
            menorPrecoSemTaxa = menorPreco / 1.1740;
            // console.log(1.1740);
            break;
        case (menorPreco >= 15.11 && menorPreco <= 16.17):
            menorPrecoSemTaxa = menorPreco / 1.1620;
            // console.log(1.1620);
            break;
        case (menorPreco >= 16.18 && menorPreco <= 17.17):
            menorPrecoSemTaxa = menorPreco / 1.1560;
            // console.log(1.1560);
            break;
        case (menorPreco >= 17.18 && menorPreco <= 19.35):
            menorPrecoSemTaxa = menorPreco / 1.1450;
            // console.log(1.1450);
            break;
        case (menorPreco >= 19.36 && menorPreco <= 19.82):
            menorPrecoSemTaxa = menorPreco / 1.1390;
            // console.log(1.1390);
            break;
        case (menorPreco >= 19.83 && menorPreco <= 22.31):
            menorPrecoSemTaxa = menorPreco / 1.1330;
            // console.log(1.1330);
            break;
        case (menorPreco >= 22.32 && menorPreco <= 24.41):
            menorPrecoSemTaxa = menorPreco / 1.1160;
            // console.log(1.1160);
            break;
        case (menorPreco >= 24.42 && menorPreco <= 25.24):
            menorPrecoSemTaxa = menorPreco / 1.11;
            // console.log(1.11);
            break;
        case (menorPreco >= 25.25 && menorPreco <= 26.22):
            menorPrecoSemTaxa = menorPreco / 1.098;
            // console.log(1.098);
            break;
        case (menorPreco >= 26.23 && menorPreco <= 28.25):
            menorPrecoSemTaxa = menorPreco / 1.093;
            // console.log(1.093);
            break;
        case (menorPreco >= 28.26 && menorPreco <= 51.49):
            menorPrecoSemTaxa = menorPreco / 1.087;
            // console.log(1.087);
            break;
        case (menorPreco >= 51.50):
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