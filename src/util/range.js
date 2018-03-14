define(function (require) {

    var dataProcess = require('./dataProcess');
    var getPrecision = dataProcess.getPrecision;

    /**
     * Computing range array.
     * Adding param precision to fix range value, avoiding range[i] = 0.7000000001.
     * @param  {number} start
     * @param  {number} end
     * @param  {number} step
     * @param  {number} precision
     * @return {Array.<number>}
     */
    return function (start, end, step, precision) {

        var len = arguments.length;

        if (len < 2) {
            end = start;
            start = 0;
            step = 1;
        }
        else if (len < 3) {
            step = 1;
        }
        else if (len < 4) {
            step = +step;
            precision = getPrecision(step);
        }
        else {
            precision = +precision;
        }

        var n = Math.ceil(((end - start) / step).toFixed(precision));
        var range = new Array(n + 1);
        for (var i = 0; i < n + 1; i++) {
            range[i] = +(start + i * step).toFixed(precision);
        }
        return range;
    };

});