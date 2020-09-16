define(function (require) {

    var clustering = require('../clustering');
    var numberUtil = require('../util/number');

    var isNumber = numberUtil.isNumber;

    return {

        type: 'ecStat:clustering',

        /**
         * @param {number} params.config.clusterCount Mandatory.
         *        The number of clusters in a dataset. It has to be greater than 1.
         * @param {numer[]} [params.config.dimensions] Optional.
         *        Target dimensions to calculate the regression.
         *        By default: use all of the data.
         * @param {number} [params.config.outputClusterIndexDimension] Optional.
         *        By default next to the last dimension of input data.
         * @param {number} [params.config.outputDistanceDimension] Optional.
         *        By default next to the `outputClusterIndexDimension`.
         */
        transform: function transform(params) {
            var source = params.source;
            var config = params.config || {};
            var clusterCount = config.clusterCount;

            if (!isNumber(clusterCount) || clusterCount <= 0) {
                throw new Error('config param "clusterCount" need to be specified as an interger greater than 1.');
            }

            if (clusterCount === 1) {
                return [{
                    data: source.data
                }, {
                    data: []
                }];
            }

            var result = clustering.hierarchicalKMeans(source.data, {
                clusterCount: clusterCount,
                stepByStep: false,
                dimensions: config.dimensions,
                outputType: clustering.OutputType.SINGLE,
                outputClusterIndexDimension: config.outputClusterIndexDimension,
                outputDistanceDimension: config.outputDistanceDimension
            });

            return [{
                data: result.data
            }, {
                data: result.centroids
            }];
        }
    };

});
