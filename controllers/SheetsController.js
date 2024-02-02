const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;
const ExcelJS = require('exceljs');
const path = require('path');

const extractFormulaResult = (cell) => {
  if (cell.formula) {
    try {
      return cell.value.result;
    } catch (error) {
      return 'Erro ao avaliar a fórmula';
    }
  }
  return cell.value;
};

const catchFromSheet = (req, res) => {
  const filePath = path.resolve(__dirname, '../sheets/testenaoaguentomais.xlsx');
  const sheetName = 'Venda-Chave-Troca';
  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const data = [];
    let rowCount = 0;

sheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) {
    const vendidoPorCell = row.getCell(5);
    const vendidoPelaGamivo = vendidoPorCell.value === 'Gamivo';

    const jogoHBCell = row.getCell(3);
    const coluna1Cell = row.getCell(1);
    const chaveRecebidaCell = row.getCell(2);
    const valorSimulacaoCell = row.getCell(9);
    const valorPagoCell = row.getCell(12);
    const valorSimulacao = extractFormulaResult(valorSimulacaoCell);
    const valorPago = parseFloat(valorPagoCell.value);
    const colunas2Cell = row.getCell(7);

    const jogo = {
      'Contador do Jogo': rowCount + 1,
      'Tipo de Chave': coluna1Cell.value,
      'Chave Recebida': chaveRecebidaCell.value,
      'Jogo HB': jogoHBCell.value,
      'Observação': row.getCell(4).value,
      'Vendido Por': vendidoPorCell.value,
      'Vendido Pela Gamivo': vendidoPelaGamivo ? true : false,
      'Valor G2A': row.getCell(6).value,
      'Colunas2': {
        result: extractFormulaResult(colunas2Cell),
      },
      'V.R. (Real)': parseFloat(valorSimulacao.toFixed(2)),
      'V. R. (Simulação)': parseFloat(extractFormulaResult(row.getCell(9)).toFixed(2)),
      'Chave Entregue': row.getCell(10).value,
      'Jogo Entregue': row.getCell(11).value,
      'Valor Pago': parseFloat(valorPago.toFixed(2)),
      'Valor Mín. Venda': row.getCell(13).value,
      'Vendido': row.getCell(14).value,
      'Leilões/Mudanças de Preço': row.getCell(15).value,
      'Qtd': row.getCell(16).value,
      'Devoluções': row.getCell(17).value,
      'Receita (R$)': extractFormulaResult(row.getCell(18)),
      'Lucro (%)': extractFormulaResult(row.getCell(19)),
      'Data Adquirida': row.getCell(20).value instanceof Date ? row.getCell(20).value.toLocaleDateString() : null,
      'Data Venda': row.getCell(21).value instanceof Date ? row.getCell(21).value.toLocaleDateString() : null,
      'Data Vendida': row.getCell(22).value instanceof Date ? row.getCell(22).value.toLocaleDateString() : null,
      'Perfil/Origem': row.getCell(23).value,
      'E-mail cliente': row.getCell(24).value,
      'Comissão': extractFormulaResult(row.getCell(25)),
      'Messages': [] // Adiciona a propriedade 'Messages' para armazenar mensagens
    };

    data.push(jogo);
    rowCount++;
  }
});

    const response = {
      'Jogos': data
    };

    res.json(response);
  });
};

const dataKeysAnalyse = (req, res) => {
  try {
    const { key } = req.params;


    // verifica se tem a string barra na chave
    if (key.includes('barra')) {
      key = key.replace('barra', '/');
    }

    const filePath = path.resolve(__dirname, '../sheets/testenaoaguentomais.xlsx');
    const sheetName = 'Venda-Chave-Troca';
    const workbook = new ExcelJS.Workbook();

    workbook.xlsx.readFile(filePath).then(() => {
      const sheet = workbook.getWorksheet(sheetName);

      let foundRow = null;

      sheet.eachRow((row, rowNumber) => {
        const chaveRecebidaCell = row.getCell(2);
        const chaveNaLinha = chaveRecebidaCell ? chaveRecebidaCell.value : null;

        if (chaveNaLinha === key) {
          foundRow = row;
          // Interrompe o loop assim que a chave é encontrada
          return false;
        }
      });

      if (foundRow) {
        const lucroCell = foundRow.getCell(18);
        const lucro = lucroCell ? extractFormulaResult(lucroCell) : null;

        // Ajuste para garantir que o lucro esteja entre -100% e 100%
        const lucroFormatado = lucro !== null ? parseFloat(Math.max(-100, Math.min(100, lucro)).toFixed(2)) : null;

        const valorPagoCell = foundRow.getCell(12);
        const valorPago = valorPagoCell ? parseFloat(valorPagoCell.value.toFixed(2)) : 0;

        const data = {
          'Tipo de Chave': foundRow.getCell(1).value,
          'Chave Recebida': foundRow.getCell(2).value,
          'Jogo HB': foundRow.getCell(3).value,
          'Observação': foundRow.getCell(4).value,
          'Vendido Por': foundRow.getCell(5).value,
          'Valor G2A': parseFloat(foundRow.getCell(6).value.toFixed(2)),
          'Colunas2': parseFloat(extractFormulaResult(foundRow.getCell(7)).toFixed(2)),
          'V.R. (Real)': parseFloat(extractFormulaResult(foundRow.getCell(8)).toFixed(2)),
          'V. R. (Simulação)': parseFloat(extractFormulaResult(foundRow.getCell(9)).toFixed(2)),
          'Chave Entregue': foundRow.getCell(10).value,
          'Jogo Entregue': foundRow.getCell(11).value,
          'Valor Pago': isNaN(valorPago) ? 0 : valorPago,
          'Vendido': foundRow.getCell(13).value,
          'Leilões/Mudanças de Preço': foundRow.getCell(14).value,
          'Qtd': foundRow.getCell(15).value,
          'Devoluções': foundRow.getCell(16).value,
          'Receita (R$)': parseFloat(extractFormulaResult(foundRow.getCell(17)).toFixed(2)),
          'Lucro (%)': lucroFormatado,
          'Data Adquirida': foundRow.getCell(19).value instanceof Date ? foundRow.getCell(19).value.toLocaleDateString() : null,
          'Data Venda': foundRow.getCell(20).value instanceof Date ? foundRow.getCell(20).value.toLocaleDateString() : null,
          'Data Vendida': foundRow.getCell(21).value instanceof Date ? foundRow.getCell(21).value.toLocaleDateString() : null,
          'Perfil/Origem': foundRow.getCell(22).value,
          'E-mail cliente': foundRow.getCell(23).value,
          'Comissão': extractFormulaResult(foundRow.getCell(24)),
        };
        res.json(data);
      } else {
        // console.log('Chave não encontrada na planilha');
        // res.status(404).json({ error: 'Chave não encontrada na planilha' });
        res.status(200).json({ error: 'Chave não encontrada na planilha' });
      }
    });
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ error: 'Erro ao analisar os dados da chave' });
  }
};

module.exports = {
  catchFromSheet,
  dataKeysAnalyse,
};
