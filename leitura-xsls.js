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

        // Ordena os dados por ordem alfabética com base no nome do jogo
        const sortedData = jsonData.sort((a, b) => {
            const nomeJogoA = String(a['Jogo HB']).toLowerCase();
            const nomeJogoB = String(b['Jogo HB']).toLowerCase();
            return nomeJogoA.localeCompare(nomeJogoB);
        });

        // Paginação da saída no console
        const itemsPerPage = 100; // Ajuste conforme necessário
        let startIdx = 0;

        while (startIdx < sortedData.length) {
            const endIdx = Math.min(startIdx + itemsPerPage, sortedData.length);
            const paginatedData = sortedData.slice(startIdx, endIdx);

            console.log(`Página ${Math.floor(startIdx / itemsPerPage) + 1}:`, paginatedData);

            startIdx = endIdx;
        }

        // Retorna os dados lidos e ordenados
        return sortedData.map(item => ({
            'Jogo HB': String(item['Jogo HB']),
            'Valor G2A': item['Valor G2A'],
        }));
    } catch (error) {
        // Lida com erros
        console.error('Erro ao ler o arquivo Excel:', error.message);
        return null;
    }
}

// Exemplo de uso
const filePath = path.join(__dirname, 'Bestbuy.xlsx');
const data = readExcel(filePath);

if (data) {
    console.log('Dados lidos e ordenados por ordem alfabética de Jogo HB:', data);
} else {
    console.log('Falha ao ler o arquivo Excel.');
}
