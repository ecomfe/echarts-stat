define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;
    var number = require('../util/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the max value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function max(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }

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