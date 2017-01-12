define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;
    var number = require('../util/number');
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the median value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function median(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }
        var predata = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (isNumber(data[i])) {
                predata.push(data[i]);
            }
        }

        predata.sort(function (a, b) {
            return a - b;
        });

        var medianData;

        if ((len % 2) === 0) {
            var n = len / 2;
            medianData = (predata[n] + predata[n + 1]) / 2;
        }
        else {
            var m = (len + 1) / 2;
            medianData = predata[m];
        }

        return medianData;
    }

    return median;

});