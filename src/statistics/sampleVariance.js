define(function (require) {

    var number = require('../util/number');
    var isNumber = number.isNumber;
    var mean = require('./mean');

    /**
     * Computing the variance of list of sample
     * @param  {Array.<number>} data
     * @return {number}
     */
    function sampleVariance(data) {

        var len = data.length;
        if (!len || len < 2) {
            return 0;
        }
        if (data.length >= 2) {

            var meanValue = mean(data);
            var sum = 0;
            var temple;

            for (var i = 0; i < data.length; i++) {
                if (isNumber(data[i])) {
                    temple = data[i] - meanValue;
                    sum += temple * temple;
                }
            }
            return sum / (data.length - 1);
        }
    }

    return sampleVariance;

});
