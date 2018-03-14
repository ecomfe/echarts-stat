define(function (require) {

    var max = require('./statistics/max');
    var min = require('./statistics/min');
    var quantile = require('./statistics/quantile');
    var deviation = require('./statistics/deviation');
    var dataProcess = require('./util/dataProcess');
    var dataPreprocess = dataProcess.dataPreprocess;
    var getPrecision = dataProcess.getPrecision;
    var array = require('./util/array');
    var ascending = array.ascending;
    var map = array.map;
    var range = require('./util/range');
    var bisect = array.bisect;
    var tickStep = require('./util/tickStep');

    /**
     * Compute bins for histogram
     * @param  {Array.<number>} data
     * @param  {string} threshold
     * @return {Object}
     */
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
        var precision = -Math.floor(Math.log(Math.abs(maxValue - minValue) / binsNumber) / Math.LN10);
        
        // return the xAxis coordinate for each bins, except the end point of the value
        var rangeArray = range(
                // use function toFixed() to avoid data like '0.700000001'
                +((Math.ceil(minValue / step) * step).toFixed(precision)),
                +((Math.floor(maxValue / step) * step).toFixed(precision)),
                step,
                precision
            );

        var len = rangeArray.length;

        var bins = new Array(len + 1);

        for (var i = 0; i <= len; i++) {
            bins[i] = {};
            bins[i].sample = [];
            bins[i].x0 = i > 0 
                ? rangeArray[i - 1]
                : (rangeArray[i] - minValue) === step
                ? minValue
                : (rangeArray[i] - step);
            bins[i].x1 = i < len
                ? rangeArray[i]
                : (maxValue - rangeArray[i-1]) === step
                ? maxValue
                : rangeArray[i - 1] + step;
        }

        for (var i = 0; i < values.length; i++) {
            if (minValue <= values[i] && values[i] <= maxValue) {
                bins[bisect(rangeArray, values[i], 0, len)].sample.push(values[i]);
            }
        }

        var data = map(bins, function (bin) {
            // use function toFixed() to avoid data like '6.5666638489'
            return [+((bin.x0 + bin.x1) / 2).toFixed(precision), bin.sample.length];
        });

        var customData = map(bins, function (bin) {
            return [bin.x0, bin.x1, bin.sample.length];
        });

        return {
            bins: bins,
            data: data,
            customData: customData
        };
    }

    /**
     * Four kinds of threshold methods used to
     * compute how much bins the histogram should be divided
     * @see  https://en.wikipedia.org/wiki/Histogram
     * @type {Object}
     */
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

            return Math.ceil(
                (max - min) / (2 * (quantile(data, 0.75) - quantile(data, 0.25)) * Math.pow(data.length, -1 / 3))
            );
        },

        sturges: function (data) {

            return Math.ceil(Math.log(data.length) / Math.LN2) + 1;

        }
    };

    return computeBins;

});