define(function (require) {

    var variance = require('./sampleVariance');

    /**
     * Computing the deviation
     * @param  {Array.<number>} data
     * @return {number}
     */
    return function (data) {

        var squaredDeviation = variance(data);

        return squaredDeviation ? Math.sqrt(squaredDeviation) : squaredDeviation;
    };
});