const puppeteer = require('puppeteer');
const assert = require('assert');

(async () => {
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:8000/');

        await page.click('button');

        const text = await page.$eval('#target', el => el.innerText);

        assert.strictEqual(text, 'Hello World!');
        console.log(text);
    } finally {
        await browser.close();
    }
})();
