const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'api-controle-estoque.yml');

try {
  // Leitura do arquivo YAML
  const yamlContent = fs.readFileSync(filePath, 'utf8');
  
  // Conversão do YAML para objeto JavaScript
  const openApiObject = yaml.load(yamlContent);

  // Agora, openApiObject contém a representação JavaScript da sua especificação OpenAPI
  console.log(openApiObject);
} catch (error) {
  console.error(error);
}
