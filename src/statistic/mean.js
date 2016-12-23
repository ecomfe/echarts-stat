define(function (require) {

    var array = require('../utils/array');
    var isArray = array.isArray;
    var number = require('../utils/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the max value of a list of numbers,
     * which will filtering other data tyoes.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function mean(data) {

        if (!isArray(data)) {
            throw new TypeError('Invalid data type, you should input an array');
        }
        var sumData = 0;
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (isNumber(data[i])) {
                sumData += data[i];
            }
        }
        return sumData / len;
    }

    return mean;


});