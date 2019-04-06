module.exports.SlowPromise = function (fulfill) {
    return {
        then: f => f()
    };
};
