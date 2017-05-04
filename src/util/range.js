define(function (require) {

    /**
     * Computing range array
     * @param  {number} start
     * @param  {number} stop
     * @param  {number} step
     * @return {Array.<number>}
     */
    return function (start, stop, step) {

        var len = arguments.length;

        if (len < 2) {
            stop = start;
            start = 0;
            step = 1;
        }
        else if (len < 3) {
            step = 1;
        }
        else {
            step = +step;
        }

        var n = Math.ceil((stop - start) / step);
        var range = new Array(n + 1);

        for (var i = 0; i < n + 1; i++) {
            range[i] = start + i * step;
        }
        return range;
    };

});