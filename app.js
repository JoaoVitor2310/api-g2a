const XLSX = require('xlsx');
const path = require('path');

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

// Exemplo de uso
const filePath = path.join(__dirname, 'OneDrive/Documentos/projetobestbuy/data-data.xlsx');
const data = readExcel(filePath);

if (data) {
    console.log('Dados lidos do arquivo Excel:', data);
} else {
    console.log('Falha ao ler o arquivo Excel.');
}
