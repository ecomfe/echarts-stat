define(function (require) {

    /**
     * Estimating quantiles from a sorted sample of numbers
     * @see https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample
     * R-7 method
     * @param  {Array.<number>} data  sorted array
     * @param  {number} p
     */
    return function (data, p) {

        var len = data.length;

        if (!len) {
            return 0;
        }
        if (p <= 0 || len < 2) {
            return data[0];
        }
        if (p >= 1) {
            return data[len -1];
        }
        // in the wikipedia's R-7 method h = (N - 1)p + 1, but here array index start from 0
        var h = (len - 1) * p;
        var i = Math.floor(h);
        var a = data[i];
        var b = data[i + 1];
        return a + (b - a) * (h - i);
    };

});