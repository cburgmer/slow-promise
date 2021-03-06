global.window = {};
const fetchMock = require('fetch-mock');

const { SlowPromise, slowFetch, mockFetch } = require("./index");

describe("slow-promise", () => {
    let spy;

    beforeEach(() => {
        spy = jasmine.createSpy();
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    const processNextPromiseChain = async () =>
        new Promise(f => setImmediate(f));

    describe(".then()", () => {
        it("does not fulfill if timeout hasn't occurred yet", async () => {
            const p = new SlowPromise(f => f());
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the fulfilled callback after timeout has occurred", async () => {
            const p = new SlowPromise(f => f());
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("calls the rejected callback after timeout has occurred", async () => {
            const p = new SlowPromise((f, r) => r());
            p.then(undefined, spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("calls a callback with value", async () => {
            const p = new SlowPromise(f => f(42));
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith(42);
        });

        it("does not call callback if not fulfilled", async () => {
            const p = new SlowPromise(() => {});
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("does not call the next leg of the promise chain if the timeout hasn't occurred yet", async () => {
            const p = new SlowPromise(f => f());
            p.then(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the next leg of the promise chain if the timeout has occurred", async () => {
            const p = new SlowPromise(f => f());
            p.then(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("doesn't call the third leg if the timeout hasn't occurred yet", async () => {
            const p = new SlowPromise(f => f());
            p.then(() => {})
                .then(() => {})
                .then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe(".catch()", () => {
        it("does not call the callback if timeout hasn't occurred yet", async () => {
            const p = new SlowPromise((f, r) => r());
            p.catch(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls a callback after timeout has occurred", async () => {
            const p = new SlowPromise((f, r) => r());
            p.catch(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("does not call callback if not settled", async () => {
            const p = new SlowPromise(() => {});
            p.catch(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("does not call callback if fulfilled", async () => {
            const p = new SlowPromise(f => f());
            p.catch(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("does not call the next leg of the promise chain if the timeout hasn't occurred yet", async () => {
            const p = new SlowPromise((f, r) => r());
            p.catch(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the next leg of the promise chain if the timeout has occurred", async () => {
            const p = new SlowPromise((f, r) => r());
            p.catch(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe(".finally()", () => {
        it("does not call callback if timeout hasn't occurred yet", async () => {
            const p = new SlowPromise(f => f());
            p.finally(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls a callback after timeout has occurred when fulfilled", async () => {
            const p = new SlowPromise(f => f());
            p.finally(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("calls a callback after timeout has occurred when rejected", async () => {
            const p = new SlowPromise((f, r) => r());
            p.finally(spy).catch(() => {});

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("does not call callback if not settled", async () => {
            const p = new SlowPromise(() => {});
            p.finally(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("does not call the next leg of the promise chain if the timeout hasn't occurred yet", async () => {
            const p = new SlowPromise(f => f());
            p.finally(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the next leg of the promise chain if the timeout has occurred", async () => {
            const p = new SlowPromise(f => f());
            p.finally(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe(".resolve()", () => {
        it("does not fulfill if timeout hasn't occurred yet", async () => {
            const p = SlowPromise.resolve();
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls a callback after timeout has occurred", async () => {
            const p = SlowPromise.resolve();
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("does not call the next leg of the promise chain if the timeout hasn't occurred yet", async () => {
            const p = SlowPromise.resolve();
            p.then(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the next leg of the promise chain if the timeout has occurred", async () => {
            const p = SlowPromise.resolve();
            p.then(() => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("resolves with value", async () => {
            const p = SlowPromise.resolve(42);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith(42);
        });

        it("resolves a promise with value", async () => {
            const p = SlowPromise.resolve(Promise.resolve(42));
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith(42);
        });
    });

    describe(".reject()", () => {
        it("does not call the reject callback if timeout hasn't occurred yet", async () => {
            const p = SlowPromise.reject();
            p.then(null, spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the reject callback after timeout has occurred", async () => {
            const p = SlowPromise.reject();
            p.then(null, spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("does not call the next leg of the promise chain if the timeout hasn't occurred yet", async () => {
            const p = SlowPromise.reject();
            p.then(null, () => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the next leg of the promise chain if the timeout has occurred", async () => {
            const p = SlowPromise.reject();
            p.then(null, () => {}).then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("rejects with value", async () => {
            const p = SlowPromise.reject(new Error("blargh"));
            p.then(null, spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith(new Error("blargh"));
        });
    });

    describe(".all()", () => {
        it("does not call the callback if timeout hasn't occurred yet", async () => {
            const p = SlowPromise.all([]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the callback after timeout has occurred", async () => {
            const p = SlowPromise.all([]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("resolves with the list of values", async () => {
            const p = SlowPromise.all([
                Promise.resolve(21),
                Promise.resolve(42)
            ]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith([21, 42]);
        });

        it("does not call the callback if one promise hasn't been settled yet", async () => {
            const p = SlowPromise.all([
                new Promise(() => {}),
                Promise.resolve(42)
            ]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe(".race()", () => {
        it("does not call the callback if timeout hasn't occurred yet", async () => {
            const p = SlowPromise.race([Promise.resolve(42)]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the callback after timeout has occurred", async () => {
            const p = SlowPromise.race([Promise.resolve(42)]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("resolves with the value of the settled promise", async () => {
            const p = SlowPromise.race([
                new Promise(() => {}),
                Promise.resolve(42)
            ]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalledWith(42);
        });

        it("does not call the callback if none of the promises has been settled yet", async () => {
            const p = SlowPromise.race([
                new Promise(() => {}),
                new Promise(() => {})
            ]);
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe("fetch", () => {
        let sandboxFetch;
        beforeEach(() => {
            sandboxFetch = fetchMock.sandbox();
            mockFetch(sandboxFetch);
            sandboxFetch.mock('*', 200);
        });
        afterEach(() => {
            sandboxFetch.reset();
        });

        it("does not call the callback if timeout hasn't occurred yet", async () => {
            const p = slowFetch('http://localhost:65432/blargh');
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls the callback after timeout has occurred", async () => {
            const p = slowFetch('http://localhost:65432/blargh');
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });

        it("returns the response", async () => {
            const p = slowFetch('http://localhost:65432/blargh');
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();

            const args = spy.calls.mostRecent().args;
            expect(args.length).toBe(1);
            expect(args[0].status).toBe(200);
        });
    });
});
