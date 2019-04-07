const { SlowPromise, setSlowPromiseDelay } = require("./index");

window.Promise = SlowPromise;

if (document.currentScript) {
    const delayStr = document.currentScript.getAttribute(
        "data-slow-promise-delay"
    );
    if (delayStr !== null) {
        const delay = parseInt(delayStr, 10);
        setSlowPromiseDelay(delay);
    }
}
