define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;
    var number = require('../util/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the mean value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function mean(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
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