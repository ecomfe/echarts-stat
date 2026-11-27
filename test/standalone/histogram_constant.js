var assert = require('assert');
var histogram = require('../../').histogram;

['scott', 'freedmanDiaconis'].forEach(function (method) {
    var values = [5, 5, 5];
    assert.deepStrictEqual(histogram(values, method), histogram(values, 'squareRoot'));
});

['squareRoot', 'sturges', 'scott', 'freedmanDiaconis'].forEach(function (method) {
    var result = histogram([[-1.25]], { method: method, dimensions: 0 });
    assert.deepStrictEqual(result.customData, [[-2, -1, 1]]);
    assert.deepStrictEqual(result.bins[0].sample, [-1.25]);
});

assert.deepStrictEqual(histogram([0.4, 1.9], 'scott').customData, [[0, 2, 2]]);
