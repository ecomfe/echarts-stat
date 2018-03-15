define(function (require) {

    var statistics = {};

    statistics.max = require('./statistics/max');
    statistics.deviation = require('./statistics/deviation');
    statistics.mean = require('./statistics/mean');
    statistics.median = require('./statistics/median');
    statistics.min = require('./statistics/min');
    statistics.quantile = require('./statistics/quantile');
    statistics.sampleVariance = require('./statistics/sampleVariance');
    statistics.sum = require('./statistics/sum');

    return statistics;

});