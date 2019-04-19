## Demo with Puppeteer

This demos a flaky test written against Chrome using Puppeteer (https://github.com/GoogleChrome/puppeteer).

The HTML page implements a button that fetches content via an asynchronous AJAX request on click.

See for yourself

    npm i
    npx http-server -p 8000 -a 127.0.0.1
    open http://localhost:8000

The initial test against this behaviour roughly looks like

``` js
await page.click('button');

const text = await page.$eval('#target', el => el.innerText);
assert.strictEqual(text, 'Hello World!');
```

This works if your network connection is fast enough, try it

    node bad_test.js

This might just work well in most cases, but is likely to even be flaky when run against localhost.

The better test looks like this:

``` js
await page.click('button');
await page.waitFor(() => document.querySelector('#target').innerText !== '');
# ^^^ we explicitly wait for the button click to have an effect on our page
const text = await page.$eval('#target', el => el.innerText);
assert.strictEqual(text, 'Hello World!');
```

Run the stable test:

    node good_test.js

This should run much slower, as slow-promise has injected latency:

``` js
page.on('load', async () => {
    await page.addScriptTag({url: '/node_modules/slow-promise/dist/slow-promise.install.js'});
});
```
