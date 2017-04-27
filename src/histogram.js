define(function (require) {

    var max = require('./statistic/max');
    var min = require('./statistic/min');
    var quantile = require('./statistic/quantile');
    var deviation = require('./statistic/deviation');
    var dataPreprocess = require('./util/dataPreprocess');
    var array = require('./util/array');
    var ascending = array.ascending;
    var zrUtil = require('zrender/core/util');


    function computeBins(data, threshold) {

        if (threshold == null) {

            threshold = thresholdMethod.squareRoot;

        }
        else {

            threshold = thresholdMethod[threshold];

        }
        var values = dataPreprocess(data);
        var maxValue = max(values);
        var minValue = min(values);

        var binsNumber = threshold(values, minValue, maxValue);

        var step = tickStep(minValue, maxValue, binsNumber);

        var rangeArray = range(Math.ceil(minValue / step) * step, Math.floor(maxValue / step) * step, step);

        var len = rangeArray.length;
        while (rangeArray[0] <= minValue) {
            rangeArray.shift();
            len--;
        }

        while (rangeArray[len - 1] >= maxValue) {
            rangeArray.pop();
            len--;
        }

        var bins = new Array(len + 1);
        for (var i = 0; i <= len; i++) {
            bins[i] = [];
            bins[i].x0 = i > 0 ? rangeArray[i - 1] : (rangeArray[i] - minValue) === step ? minValue : (rangeArray[i] - step) ;
            bins[i].x1 = i < len ? rangeArray[i]: (maxValue - rangeArray[i-1]) === step ? maxValue : rangeArray[i - 1] + step;
        }

        for (i = 0; i < values.length; i++) {
            if (minValue <= values[i] && values[i] <= maxValue) {
                bins[bisect(rangeArray, values[i], 0, len)].push(values[i]);
            }
        }

        var data = zrUtil.map(bins, function (bin) {
            return [(bin.x0 + bin.x1) / 2, bin.length];
        });

        return {
            bins: bins,
            data: data
        };
    }

    /**
     *
     * @see  https://github.com/d3/d3-array/blob/master/src/ticks.js
     */
    function tickStep(start, stop, count) {

        var e10 = Math.sqrt(50);
        var e5 = Math.sqrt(10);
        var e2 = Math.sqrt(2);

        var step0 = Math.abs(stop - start) / count;
        var step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10));
        var error = step0 / step1;

        if (error >= e10) {
            step1 *= 10;
        }
        else if (error >= e5) {
            step1 *= 5;
        }
        else if(error >= e2) {
            step1 *= 2;
        }
        return stop >= start ? step1 : -step1;

    }

    /**
     *
     *
     */
    function range(start, stop, step) {

        var len = arguments.length;
        step = len < 2 ? (stop = start, start = 0, 1) : len < 3 ? 1 : +step;
        var n = Math.ceil((stop - start) / step);
        var range = new Array(n + 1);

        for (var i = 0; i < n + 1; i++) {
            range[i] = start + i * step;
        }
        return range;
    }

     /**
     * Binary search algorithm --- this bisector is specidfied to histogram, which every bin like that [a, b).
     * so the return value use to add 1.
     * @param  {Array.<number>} array
     * @param  {number} value
     * @param  {number} start
     * @param  {number} end
     * @return {number}
     */
    function bisect(array, value, start, end) {

        if (start == null) {
            start = 0;
        }
        if (end == null) {
            end = array.length;
        }
        while (start < end) {
            var mid = Math.floor((start + end) / 2);
            var compare = ascending(array[mid], value);
            if (compare > 0) {
                end = mid;
            }
            else if (compare < 0) {
                start = mid + 1;
            }
            else {
                return mid + 1;
            }
        }
        return start;
    }


    var thresholdMethod = {

        squareRoot: function (data) {

            var bins = Math.ceil(Math.sqrt(data.length));

            return bins > 50 ? 50 : bins;
        },

        scott: function (data, min, max) {

            return Math.ceil((max - min) / (3.5 * deviation(data) * Math.pow(data.length, -1 / 3)));
        },

        freedmanDiaconis: function (data, min, max) {

            data.sort(ascending);

            return Math.ceil((max - min) / (2 * (quantile(data, 0.75) - quantile(data, 0.25)) * Math.pow(data.length, -1 / 3)));
        },

        sturges: function (data) {

            return Math.ceil(Math.log(data.length) / Math.LN2) + 1;

        }
    };

    return computeBins;

});