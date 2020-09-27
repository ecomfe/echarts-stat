define(function (require) {

    var arrayUtil = require('../util/array');
    var numberUtil = require('../util/number');
    var objectUtil = require('../util/object');

    /**
     * type DimensionLoose = DimensionIndex | DimensionName;
     * type DimensionIndex = number;
     * type DimensionName = string;
     *
     * @param {object} transformParams The parameter of echarts transfrom.
     * @param {DimensionLoose | DimensionLoose[]} dimensionsConfig
     * @return {DimensionIndex | DimensionIndex[]}
     */
    function normalizeExistingDimensions(transformParams, dimensionsConfig) {
        if (dimensionsConfig == null) {
            return;
        }
        var upstream = transformParams.upstream;

        if (arrayUtil.isArray(dimensionsConfig)) {
            var result = [];
            for (var i = 0; i < dimensionsConfig.length; i++) {
                var dimInfo = upstream.getDimensionInfo(dimensionsConfig[i]);
                validateDimensionExists(dimInfo, dimensionsConfig[i]);
                result[i] = dimInfo.index;
            }
            return result;
        }
        else {
            var dimInfo = upstream.getDimensionInfo(dimensionsConfig);
            validateDimensionExists(dimInfo, dimensionsConfig);
            return dimInfo.index;
        }

        function validateDimensionExists(dimInfo, dimConfig) {
            if (!dimInfo) {
                throw new Error('Can not find dimension by ' + dimConfig);
            }
        }
    }

    /**
     * @param {object} transformParams The parameter of echarts transfrom.
     * @param {(DimensionIndex | {name: DimensionName, index: DimensionIndex})[]} dimensionsConfig
     * @param {{name: DimensionName | DimensionName[], index: DimensionIndex | DimensionIndex[]}}
     */
    function normalizeNewDimensions(dimensionsConfig) {
        if (arrayUtil.isArray(dimensionsConfig)) {
            var names = [];
            var indices = [];
            for (var i = 0; i < dimensionsConfig.length; i++) {
                var item = parseDimensionNewItem(dimensionsConfig[i]);
                names.push(item.name);
                indices.push(item.index);
            }
            return {name: names, index: indices};
        }
        else if (dimensionsConfig != null) {
            return parseDimensionNewItem(dimensionsConfig);
        }

        function parseDimensionNewItem(dimConfig) {
            if (numberUtil.isNumber(dimConfig)) {
                return { index: dimConfig };
            }
            else if (objectUtil.isObject(dimConfig) && numberUtil.isNumber(dimConfig.index)) {
                return dimConfig;
            }
            throw new Error('Illegle new dimensions config. Expect `{ name: string, index: number }`.');
        }
    }

    return {
        normalizeExistingDimensions: normalizeExistingDimensions,
        normalizeNewDimensions: normalizeNewDimensions
    };
});
