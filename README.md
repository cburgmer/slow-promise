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
randomly the following day, which just happens to be when your app feels
somewhat slow and unresponsive. Chances are you just sit through and wait for
everything to go faster again. Naturally your tests will be back to green.

What if this happens again and again? Your team will get used to brittle test,
and start re-running failing tests. Eventually this will become the norm.

What if you can stop this process early on, and just surface the poorly written
tests which depend on your application being at its best? Imaging you could slow
down your app on every given day.

Slow-Promise isn't good much but it is good at that!
