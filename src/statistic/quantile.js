define(function (require) {

    var array = require('../util/array');
    var isArray = array.isArray;

    /**
     *
     * @see https://github.com/d3/d3-array/blob/master/src/quantile.js
     * @param  {Array.<number>} data
     * @param  {number} p
     */
    return function (data, p) {

        if (!isArray(data)) {
            throw new Error('quantile operation require an array');
        }

        var len;
        if (!(len = data.length)) return 0;
        if ((p = +p) <=0 || len < 2) return +data[0];
        if (p >= 1) return +data[len -1];

        var h = (len - 1) * p;
        var i = Math.floor(h);
        var a = +data[i];
        var b = +data[i + 1];
        return a + (b - a) * (h - i);
    };

});