define(function (require) {

    var statistics = {};

    statistics.max = require('./statistics/max');
    statistics.deviation = require('./statistics/deviation');
    statistics.mean = require('./statistics/mean');
    statistics.median = require('./statistics/median');
    statistics.min = require('./statistics/min');
    statistics.max = require('./statistics/quantile');
    statistics.max = require('./statistics/sampleVariance');
    statistics.sum = require('./statistics/sum');

    return statistics;

});