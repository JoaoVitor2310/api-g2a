# API G2A

### Para rodar:
`sudo apt install -y git nodejs` Git e Node serão necessários para baixar e executar o projeto respectivamente.
`git clone https://github.com/JoaoVitor2310/api-gamivo`
`cd api-gamivo` Entre no diretório com os arquivos.
`npm install`
`sudo apt-get install npm` Para instalar o npm.
`cp .env-example .env` Não esqueça de inserir todas as variáveis de ambiente.
`pm2 start index.js` Para manter a aplicação rodando em segundo plano.
Caso tenha erro ao rodar o pm2: `npm install -g pm2`
Se for modificar a API: `npm run dev`
`pm2 startup` Para finalmente iniciar a API