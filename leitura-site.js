const XLSX = require('xlsx');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Função para ler um arquivo Excel
function readExcel(filePath) {
    try {
        // Carrega o arquivo Excel
        const workbook = XLSX.readFile(filePath);

        // Assume que estamos interessados na primeira planilha (índice 0)
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Converte os dados da planilha para JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Retorna os dados lidos
        return jsonData;
    } catch (error) {
        // Lida com erros
        console.error('Erro ao ler o arquivo Excel:', error.message);
        return null;
    }
}

// Função para adicionar uma venda
async function adicionarVendaAutomatica(filePath, url) {
    try {
        // Faz uma solicitação HTTP para o site
        const response = await axios.get(url);
        const html = response.data;

        // Usa Cheerio para analisar o HTML
        const $ = cheerio.load(html);

        // Extraia as informações relevantes do HTML do seu site
        const nomeDoJogo = $('seletor-para-o-nome-do-jogo').text();
        const quantidadeVendida = parseInt($('seletor-para-a-quantidade-vendida').text(), 10);
        const valorVendido = parseFloat($('seletor-para-o-valor-vendido').text());
        const taxaPlataforma = parseFloat($('seletor-para-a-taxa-da-plataforma').text());

        // Cria um objeto representando a venda
        const venda = {
            'Jogo HB': nomeDoJogo,
            'Quantidade Vendida': quantidadeVendida,
            'Valor Vendido': valorVendido,
            'Taxa Plataforma': taxaPlataforma,
        };

        // Carrega o arquivo Excel
        const workbook = XLSX.readFile(filePath);

        // Adiciona uma nova aba de vendas com as informações da venda
        const novaAba = XLSX.utils.json_to_sheet([venda]);
        XLSX.utils.book_append_sheet(workbook, novaAba, 'Vendas');

        // Salva o arquivo modificado
        XLSX.writeFile(workbook, filePath);

        console.log('Venda adicionada com sucesso.');
    } catch (error) {
        // Lida com erros
        console.error('Erro ao adicionar venda automaticamente:', error.message);
    }
}

// Exemplo de uso para adição de venda automática
const filePathAdicaoAutomatica = path.join(__dirname, 'Bestbuy.xlsx');
const siteURL = 'https://exemplo.com/pagina-do-jogo'; // Substitua com a URL real do seu site
adicionarVendaAutomatica(filePathAdicaoAutomatica, siteURL);
