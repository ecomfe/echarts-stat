define(function (require) {

    var quantile = require('./quantile');

    /**
     * Is a method for computing the median value of a sorted array of numbers
     * @param  {Array.<number>} data
     * @return {number}
     */
    function median(data) {

        return quantile(data, 0.5);
    }

    return median;

});