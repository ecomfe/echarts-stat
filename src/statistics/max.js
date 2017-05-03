define(function (require) {

    var number = require('../util/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the max value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function max(data) {

        var maxData = -Infinity;
        for (var i = 0; i < data.length; i++) {
            if (isNumber(data[i]) && data[i] > maxData) {
                maxData = data[i];
            }
        }
        return maxData;
    }

    return max;

});