const { SlowPromise } = require("./index");

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

    it("does not fulfill if timeout hasn't occurred yet", async () => {
        const p = new SlowPromise(f => f());
        p.then(spy);

        await processNextPromiseChain();
        jasmine.clock().tick(999);
        await processNextPromiseChain();
        expect(spy).not.toHaveBeenCalled();
    });

    it("calls a callback after timeout has occurred", async () => {
        const p = new SlowPromise(f => f());
        p.then(spy);

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
    });
});
