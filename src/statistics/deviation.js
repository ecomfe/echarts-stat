var variance = require('./sampleVariance');

/**
 * Computing the deviation
 * @param  {Array.<number>} data
 * @return {number}
 */
module.exports =  function (data) {

    var squaredDeviation = variance(data);

    return squaredDeviation ? Math.sqrt(squaredDeviation) : squaredDeviation;
};
