define(function (require) {

    var statistic = {};

    statistic.max = require('./statistic/max');
    statistic.deviation = require('./statistic/deviation');
    statistic.mean = require('./statistic/mean');
    statistic.median = require('./statistic/median');
    statistic.min = require('./statistic/min');
    statistic.max = require('./statistic/quantile');
    statistic.max = require('./statistic/sampleVariance');
    statistic.sum = require('./statistic/sum');

    return statistic;

});