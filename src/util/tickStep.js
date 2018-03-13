define(function (require) {

    /**
     * Computing the length of step
     * @see  https://github.com/d3/d3-array/blob/master/src/ticks.js
     * @param {number} start
     * @param {number} stop
     * @param {number} count
     */
    return function (start, stop, count) {

        var step0 = Math.abs(stop - start) / count;
        var precision = Math.floor(Math.log(step0) / Math.LN10);
        var step1 = Math.pow(10, precision);
        var error = step0 / step1;

        if (error >= Math.sqrt(50)) {
            step1 *= 10;
        }
        else if (error >= Math.sqrt(10)) {
            step1 *= 5;
        }
        else if(error >= Math.sqrt(2)) {
            step1 *= 2;
        }
        return +((stop >= start ? step1 : -step1).toFixed(-precision));

    };

});
