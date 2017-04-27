define(function (require) {

    var variance = require('./sampleVariance');

    return function (data) {

        var squaredDeviation = variance(data);

        return squaredDeviation ? Math.sqrt(squaredDeviation) : squaredDeviation;
    }
});