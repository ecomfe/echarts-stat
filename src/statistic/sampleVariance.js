define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;
    var number = require('../util/number');
    var isNumber = number.isNumber;
    var mean = require('./mean');

    /**
     * Computing the variance of list of sample
     * @param  {Array.<number>} data
     * @return {bunber}      [description]
     */
    function sampleVariance (data) {

        if (isArray(data) && data.length >= 2) {

            var meanValue = mean(data);
            var sum = 0;
            var temple;

            for (var i = 0; i < data.length; i++) {
                if (isNumber(data[i])) {
                    temple = data[i] - meanValue;
                    sum += temple * temple;
                }
            }
            return sum / data.length - 1;
        }
        else {

            throw new Error('sampleVariance operation requires at least two data points array');
        }
    }

    return sampleVariance;

});