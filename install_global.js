const { SlowPromise, slowFetch, setDelay } = require("./index");

window.Promise = SlowPromise;
window.fetch = slowFetch;

if (document.currentScript) {
    const delayStr = document.currentScript.getAttribute(
        "data-slow-promise-delay"
    );
    if (delayStr !== null) {
        const delay = parseInt(delayStr, 10);
        setDelay(delay);
    }
}

module.exports.setDelay = setDelay;
