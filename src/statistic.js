define(function (require) {

    var statistic = {};

    statistic.max = require('./statistic/max');
    statistic.mean = require('./statistic/mean');
    statistic.median = require('./statistic/median');
    statistic.min = require('./statistic/min');
    statistic.sum = require('./statistic/sum');

    return statistic;

});