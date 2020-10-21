define(function (require) {

    var regression = require('../regression');
    var transformHelper = require('./helper');
    var FORMULA_DIMENSION = 2;

    return {

        type: 'ecStat:regression',

        /**
         * @param {Paramter<typeof regression>[0]} [params.config.method='linear'] 'linear' by default
         * @param {Paramter<typeof regression>[2]} [params.config.order=2] Only work when method is `polynomial`.
         * @param {DimensionLoose[]|DimensionLoose} [params.config.dimensions=[0, 1]] dimensions that used to calculate regression.
         *        By default [0, 1].
         * @param {'start' | 'end' | 'all'} params.config.formulaOn Include formula on the last (third) dimension of the:
         *        'start': first data item.
         *        'end': last data item (by default).
         *        'all': all data items.
         *        'none': no data item.
         */
        transform: function transform(params) {
            var upstream = params.upstream;
            var config = params.config || {};
            var method = config.method || 'linear';

            var result = regression(method, upstream.cloneRawData(), {
                order: config.order,
                dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions)
            });
            var points = result.points;

            var formulaOn = config.formulaOn;
            if (formulaOn == null) {
                formulaOn = 'end';
            }

            var dimensions;
            if (formulaOn !== 'none') {
                for (var i = 0; i < points.length; i++) {
                    points[i][FORMULA_DIMENSION] =
                    (
                        (formulaOn === 'start' && i === 0)
                        || (formulaOn === 'all')
                        || (formulaOn === 'end' && i === points.length - 1)
                    ) ? result.expression : '';
                }
                dimensions = upstream.cloneAllDimensionInfo();
                dimensions[FORMULA_DIMENSION] = {};
            }

            return [{
                dimensions: dimensions,
                data: points
            }];
        }
    };

});
