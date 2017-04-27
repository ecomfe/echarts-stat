define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;
    var sum = require('./sum');

    /**
     * Is a method for computing the mean value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function mean(data) {

        if (isArray(data) && data.length > 0) {

            return sum(data) / data.length;

        }
        else {

            throw new Error('mean operation requires at least one data point array');

        }
    }

    return mean;


});