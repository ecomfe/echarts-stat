define(function (require) {

    return {

        clustering: require('./clustering'),
        regression: require('./regression'),
        statistics: require('./statistics'),
        histogram: require('./histogram'),

        transform: {
            regression: require('./transform/regression'),
            histogram: require('./transform/histogram'),
            clustering: require('./transform/clustering')
        }

    };

});