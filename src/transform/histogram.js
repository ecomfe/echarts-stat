define(function (require) {

    var histogram = require('../histogram');
    var transformHelper = require('./helper');

    return {

        type: 'ecStat:histogram',

        /**
         * @param {'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'} [params.config.method='squareRoot']
         * @param {DimnensionLoose[]} [params.config.dimensions=[0, 1]] dimensions that used to calculate histogram.
         *        By default [0].
         */
        transform: function transform(params) {
            var upstream = params.upstream;
            var config = params.config || {};

            var result = histogram(upstream.cloneRawData(), {
                method: config.method,
                dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions)
            });

            return [{
                dimensions: ['MeanOfV0V1', 'VCount', 'V0', 'V1', 'DisplayableName'],
                data: result.data
            }, {
                data: result.customData
            }];
        }
    };

});
