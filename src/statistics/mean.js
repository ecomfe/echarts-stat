define(function (require) {

    var sum = require('./sum');

    /**
     * Is a method for computing the mean value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function mean(data) {

        var len = data.length;

        if (!len) {
            return 0;
        }

        return sum(data) / data.length;

    }

    return mean;


});