define(function (require) {

    var clustering = require('../clustering');
    var numberUtil = require('../util/number');
    var transformHelper = require('./helper');

    var isNumber = numberUtil.isNumber;

    return {

        type: 'ecStat:clustering',

        /**
         * @param {number} params.config.clusterCount Mandatory.
         *        The number of clusters in a dataset. It has to be greater than 1.
         * @param {(DimensionName | DimensionIndex)[]} [params.config.dimensions] Optional.
         *        Target dimensions to calculate the regression.
         *        By default: use all of the data.
         * @param {(DimensionIndex | {name?: DimensionName, index: DimensionIndex})} [params.config.outputClusterIndexDimension] Mandatory.
         * @param {(DimensionIndex | {name?: DimensionName, index: DimensionIndex})[]} [params.config.outputCentroidDimensions] Optional.
         *        If specified, the centroid will be set to those dimensions of the result data one by one.
         *        By default not set centroid to result.
         */
        transform: function transform(params) {
            var upstream = params.upstream;
            var config = params.config || {};
            var clusterCount = config.clusterCount;

            if (!isNumber(clusterCount) || clusterCount <= 0) {
                throw new Error('config param "clusterCount" need to be specified as an interger greater than 1.');
            }

            if (clusterCount === 1) {
                return [{
                }, {
                    data: []
                }];
            }

            var outputClusterIndexDimension = transformHelper.normalizeNewDimensions(
                config.outputClusterIndexDimension
            );
            var outputCentroidDimensions = transformHelper.normalizeNewDimensions(
                config.outputCentroidDimensions
            );

            if (outputClusterIndexDimension == null) {
                throw new Error('outputClusterIndexDimension is required as a number.');
            }

            var result = clustering.hierarchicalKMeans(upstream.cloneRawData(), {
                clusterCount: clusterCount,
                stepByStep: false,
                dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions),
                outputType: clustering.OutputType.SINGLE,
                outputClusterIndexDimension: outputClusterIndexDimension.index,
                outputCentroidDimensions: (outputCentroidDimensions || {}).index
            });

            var sourceDimAll = upstream.cloneAllDimensionInfo();
            var resultDimsDef = [];
            for (var i = 0; i < sourceDimAll.length; i++) {
                var sourceDimItem = sourceDimAll[i];
                resultDimsDef.push(sourceDimItem.name);
            }

            // Always set to dims def even if name not exists, because the resultDimsDef.length
            // need to be enlarged to tell echarts that there is "cluster index dimension" and "dist dimension".
            resultDimsDef[outputClusterIndexDimension.index] = outputClusterIndexDimension.name;

            if (outputCentroidDimensions) {
                for (var i = 0; i < outputCentroidDimensions.index.length; i++) {
                    if (outputCentroidDimensions.name[i] != null) {
                        resultDimsDef[outputCentroidDimensions.index[i]] = outputCentroidDimensions.name[i];
                    }
                }
            }

            return [{
                dimensions: resultDimsDef,
                data: result.data
            }, {
                data: result.centroids
            }];
        }
    };

});
