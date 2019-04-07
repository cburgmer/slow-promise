# slow-promise
Slow-Promise gives you ES6 promises in less than 20 LOC and 700 bytes (not even minified).

Its downsides are

* it's slow,
* it relies on another Promise implementation being present doing the hard work.

## Why?

The author wants to make browser testing a better experience, most prominently
more stable. They believe that one reason tests via a browser tend to be fragile
and flaky is because humans are generally bad at modelling asynchrony.

*A hypothetical*

Assume on a good day you write a new passing test, only to see it fail rather
randomly the following day. It just happened to be that your app felt
somewhat slow and unresponsive. Chances are you just sit through it and wait for
everything to go faster again. Naturally your tests will be back to green.

What if this happens again and again? Your team will get used to brittle test,
and start re-running failing tests. Eventually this will become the norm.

What if you could stop this process early on, and just surface those poorly
written tests? Those which depend on your application being at its best!
Imagine you could slow down your app on every given day and force those out.

Slow-Promise isn't good much, but it is good at that!

## Howto

    $ npm test
    $ npm run dist
    $ open test_integration.html
