const express = require('express');
const puppeteer = require ('puppeteer');
require('dotenv').config();

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false
});
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.g2a.com/pt/');

  // Set screen size
  await page.setViewport({width: 1920, height: 1080});

  
  
//   // Type into search box
//   await page.type('.topbar-button-5d5f2afa-dc93-44e0-bbed-71501fdd4f94', 'automate beyond recorder');

//   // Wait and click on login button
  const loginResultSelector = '.indexes__StyledButton-kft35s-1.cIPKCC';
  await page.waitForSelector(loginResultSelector);
  await page.click(loginResultSelector);

//   // Locate the full title with a unique string
//   const textSelector = await page.waitForSelector(
//     'text/Customize and automate'
//   );
//   const fullTitle = await textSelector?.evaluate(el => el.textContent);

//   // Print the full title
//   console.log('The title of this blog post is "%s".', fullTitle);

//   await browser.close();
})();








// const app = express();
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Server online');
// })

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Listening to port ${port}.`);
// })