define(function (require) {

    var number = require('../util/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the sum of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function sum(data) {

        var len = data.length;

        if (!len) {
            return 0;
        }
        var sumData = 0;
        for (var i = 0; i < len; i++) {
            if (isNumber(data[i])) {
                sumData += data[i];
            }
        }
        return sumData;
    }

    return sum;

});