define(function (require) {

    var histogram = require('../histogram');
    var transformHelper = require('./helper');

    return {

        type: 'ecStat:histogram',

        /**
         * @param {'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'} [params.config.method='squareRoot']
         * @param {DimnensionLoose[]} [params.config.dimensions=[0, 1]] dimensions that used to calculate regression.
         *        By default [0, 1].
         */
        transform: function transform(params) {
            var source = params.source;
            var config = params.config || {};

            var result = histogram(source.data, {
                method: config.method,
                dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions)
            });

            return [{
                data: result.data
            }, {
                data: result.customData
            }];
        }
    };

});
