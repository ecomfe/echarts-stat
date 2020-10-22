(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ecStat"] = factory();
	else
		root["ecStat"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    return {

	        clustering: __webpack_require__(1),
	        regression: __webpack_require__(5),
	        statistics: __webpack_require__(6),
	        histogram: __webpack_require__(15),

	        transform: {
	            regression: __webpack_require__(18),
	            histogram: __webpack_require__(21),
	            clustering: __webpack_require__(22)
	        }

	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var dataProcess = __webpack_require__(2);
	    var dataPreprocess = dataProcess.dataPreprocess;
	    var normalizeDimensions = dataProcess.normalizeDimensions;
	    var arrayUtil = __webpack_require__(3);
	    var numberUtil = __webpack_require__(4);
	    var arraySize = arrayUtil.size;
	    var sumOfColumn = arrayUtil.sumOfColumn;
	    var arraySum = arrayUtil.sum;
	    var zeros = arrayUtil.zeros;
	    // var isArray = arrayUtil.isArray;
	    var numberUtil = __webpack_require__(4);
	    var isNumber = numberUtil.isNumber;
	    var mathPow = Math.pow;

	    var OutputType = {
	        /**
	         * Data are all in one. Cluster info are added as an attribute of data.
	         * ```ts
	         * type OutputDataSingle = {
	         *     // Each index of `data` is the index of the input data.
	         *     data: OutputDataItem[];
	         *     // The index of `centroids` is the cluster index.
	         *     centroids: [ValueOnX, ValueOnY][];
	         * };
	         * type InputDataItem = (ValueOnX | ValueOnY | OtherValue)[];
	         * type OutputDataItem = (...InputDataItem | ClusterIndex | SquareDistanceToCentroid)[];
	         * ```
	         */
	        SINGLE: 'single',
	        /**
	         * Data are separated by cluster. Suitable for retrieving data form each cluster.
	         * ```ts
	         * type OutputDataMultiple = {
	         *     // Each index of `clusterAssment` is the index of the input data.
	         *     clusterAssment: [ClusterIndex, SquareDistanceToCentroid][];
	         *     // The index of `centroids` is the cluster index.
	         *     centroids: [ValueOnX, ValueOnY][];
	         *     // The index of `pointsInCluster` is the cluster index.
	         *     pointsInCluster: DataItemListInOneCluster[];
	         * }
	         * type DataItemListInOneCluster = InputDataItem[];
	         * type InputDataItem = (ValueOnX | ValueOnY | OtherValue)[];
	         * type SquareDistanceToCentroid = number;
	         * type ClusterIndex = number;
	         * type ValueOnX = number;
	         * type ValueOnY = number;
	         * type OtherValue = unknown;
	         * ```
	         */
	        MULTIPLE: 'multiple'
	    }

	    /**
	     * KMeans of clustering algorithm.
	     * @param {Array.<Array.<number>>} data two-dimension array
	     * @param {number} k the number of clusters in a dataset
	     * @return {Object}
	     */
	    function kMeans(data, k, dataMeta) {

	        // create array to assign data points to centroids, also holds SE of each point
	        var clusterAssigned = zeros(data.length, 2);
	        var centroids = createRandCent(k, calcExtents(data, dataMeta.dimensions));
	        var clusterChanged = true;
	        var minDist;
	        var minIndex;
	        var distIJ;
	        var ptsInClust;

	        while (clusterChanged) {
	            clusterChanged = false;
	            for (var i = 0; i < data.length; i++) {
	                minDist = Infinity;
	                minIndex = -1;
	                for (var j = 0; j < k; j++) {
	                    distIJ = distEuclid(data[i], centroids[j], dataMeta);
	                    if (distIJ < minDist) {
	                        minDist = distIJ;
	                        minIndex = j;
	                    }
	                }
	                if (clusterAssigned[i][0] !== minIndex) {
	                    clusterChanged = true;
	                }
	                clusterAssigned[i][0] = minIndex;
	                clusterAssigned[i][1] = minDist;
	            }
	            //recalculate centroids
	            for (var i = 0; i < k; i++) {
	                ptsInClust = [];
	                for (var j = 0; j < clusterAssigned.length; j++) {
	                    if (clusterAssigned[j][0] === i) {
	                        ptsInClust.push(data[j]);
	                    }
	                }
	                centroids[i] = meanInColumns(ptsInClust, dataMeta);
	            }
	        }

	        var clusterWithKmeans = {
	            centroids: centroids,
	            clusterAssigned: clusterAssigned
	        };
	        return clusterWithKmeans;
	    }

	    /**
	     * Calculate the average of each column in a two-dimensional array
	     * and returns the values as an array.
	     */
	    function meanInColumns(dataList, dataMeta) {
	        var meanArray = [];
	        var sum;
	        var mean;
	        for (var j = 0; j < dataMeta.dimensions.length; j++) {
	            var dimIdx = dataMeta.dimensions[j];
	            sum = 0;
	            for (var i = 0; i < dataList.length; i++) {
	                sum += dataList[i][dimIdx];
	            }
	            mean = sum / dataList.length;
	            meanArray.push(mean);
	        }
	        return meanArray;
	    }

	    /**
	     * The combine of hierarchical clustering and k-means.
	     * @param {Array} data two-dimension array.
	     * @param {Object|number} [clusterCountOrConfig] config or clusterCountOrConfig.
	     * @param {number} clusterCountOrConfig.clusterCount Mandatory.
	     *        The number of clusters in a dataset. It has to be greater than 1.
	     * @param {boolean} [clusterCountOrConfig.stepByStep=false] Optional.
	     * @param {OutputType} [clusterCountOrConfig.outputType='multiple'] Optional.
	     *        See `OutputType`.
	     * @param {number} [clusterCountOrConfig.outputClusterIndexDimension] Mandatory.
	     *        Only work in `OutputType.SINGLE`.
	     * @param {number} [clusterCountOrConfig.outputCentroidDimensions] Optional.
	     *        If specified, the centroid will be set to those dimensions of the result data one by one.
	     *        By default not set centroid to result.
	     *        Only work in `OutputType.SINGLE`.
	     * @param {Array.<number>} [clusterCountOrConfig.dimensions] Optional.
	     *        Target dimensions to calculate the regression.
	     *        By default: use all of the data.
	     * @return {Array} See `OutputType`.
	     */
	    function hierarchicalKMeans(data, clusterCountOrConfig, stepByStep) {
	        var config = (
	            isNumber(clusterCountOrConfig)
	                ? {clusterCount: clusterCountOrConfig, stepByStep: stepByStep}
	                : clusterCountOrConfig
	        ) || {clusterCount: 2};

	        var k = config.clusterCount;

	        if (k < 2) {
	            return;
	        }

	        var dataMeta = parseDataMeta(data, config);
	        var isOutputTypeSingle = dataMeta.outputType === OutputType.SINGLE;

	        var dataSet = dataPreprocess(data, {dimensions: dataMeta.dimensions});

	        var clusterAssment = zeros(dataSet.length, 2);
	        var outputSingleData;
	        var setClusterIndex;
	        var getClusterIndex;

	        function setDistance(dataIndex, dist) {
	            clusterAssment[dataIndex][1] = dist;
	        }
	        function getDistance(dataIndex) {
	            return clusterAssment[dataIndex][1];
	        };

	        if (isOutputTypeSingle) {
	            outputSingleData = [];
	            var outputClusterIndexDimension = dataMeta.outputClusterIndexDimension;

	            setClusterIndex = function (dataIndex, clusterIndex) {
	                outputSingleData[dataIndex][outputClusterIndexDimension] = clusterIndex;
	            };
	            getClusterIndex = function (dataIndex) {
	                return outputSingleData[dataIndex][outputClusterIndexDimension];
	            };

	            for (var i = 0; i < dataSet.length; i++) {
	                outputSingleData.push(dataSet[i].slice());
	                setDistance(i, 0);
	                setClusterIndex(i, 0);
	            }
	        }
	        else {
	            setClusterIndex = function (dataIndex, clusterIndex) {
	                clusterAssment[dataIndex][0] = clusterIndex;
	            };
	            getClusterIndex = function (dataIndex) {
	                return clusterAssment[dataIndex][0];
	            };
	        }

	        // initial center point.
	        var centroid0 = meanInColumns(dataSet, dataMeta);
	        var centList = [centroid0];
	        for (var i = 0; i < dataSet.length; i++) {
	            var dist = distEuclid(dataSet[i], centroid0, dataMeta);
	            setDistance(i, dist);
	        }

	        var lowestSSE;
	        var ptsInClust;
	        var ptsNotClust;
	        var clusterInfo;
	        var sseSplit;
	        var sseNotSplit;
	        var index = 1;
	        var result = {
	            data: outputSingleData,
	            centroids: centList,
	            isEnd: false
	        };
	        if (!isOutputTypeSingle) {
	            // Only for backward compat.
	            result.clusterAssment = clusterAssment;
	        }

	        function oneStep() {
	            //the existing clusters are continuously divided
	            //until the number of clusters is k
	            if (index < k) {
	                lowestSSE = Infinity;
	                var centSplit;
	                var newCentroid;
	                var newClusterAss;

	                for (var j = 0; j < centList.length; j++) {
	                    ptsInClust = [];
	                    ptsNotClust = [];
	                    for (var i = 0; i < dataSet.length; i++) {
	                        if (getClusterIndex(i) === j) {
	                            ptsInClust.push(dataSet[i]);
	                        }
	                        else {
	                            ptsNotClust.push(getDistance(i));
	                        }
	                    }
	                    clusterInfo = kMeans(ptsInClust, 2, dataMeta);
	                    sseSplit = sumOfColumn(clusterInfo.clusterAssigned, 1);
	                    sseNotSplit = arraySum(ptsNotClust);
	                    if (sseSplit + sseNotSplit < lowestSSE) {
	                        lowestSSE = sseNotSplit + sseSplit;
	                        centSplit = j;
	                        newCentroid = clusterInfo.centroids;
	                        newClusterAss = clusterInfo.clusterAssigned;
	                    }
	                }

	                for (var i = 0; i < newClusterAss.length; i++) {
	                    if (newClusterAss[i][0] === 0) {
	                        newClusterAss[i][0] = centSplit;
	                    }
	                    else if (newClusterAss[i][0] === 1) {
	                        newClusterAss[i][0] = centList.length;
	                    }
	                }

	                centList[centSplit] = newCentroid[0];
	                centList.push(newCentroid[1]);
	                for (var i = 0, j = 0; i < dataSet.length && j < newClusterAss.length; i++) {
	                    if (getClusterIndex(i) === centSplit) {
	                        setClusterIndex(i, newClusterAss[j][0]);
	                        setDistance(i, newClusterAss[j++][1]);
	                    }
	                }

	                var pointInClust = [];
	                if (!isOutputTypeSingle) {
	                    for (var i = 0; i < centList.length; i++) {
	                        pointInClust[i] = [];
	                        for (var j = 0; j < dataSet.length; j++) {
	                            if (getClusterIndex(j) === i) {
	                                pointInClust[i].push(dataSet[j]);
	                            }
	                        }
	                    }
	                    result.pointsInCluster = pointInClust;
	                }

	                index++;
	            }
	            else {
	                result.isEnd = true;
	            }
	        }

	        if (!config.stepByStep) {
	            while (oneStep(), !result.isEnd);
	        }
	        else {
	            result.next = function () {
	                oneStep();
	                setCentroidToResultData(result, dataMeta);
	                return result;
	            };
	        }
	        setCentroidToResultData(result, dataMeta);
	        return result;
	    }

	    function setCentroidToResultData(result, dataMeta) {
	        var outputCentroidDimensions = dataMeta.outputCentroidDimensions;
	        if (dataMeta.outputType !== OutputType.SINGLE || outputCentroidDimensions == null) {
	            return;
	        }
	        var outputSingleData = result.data;
	        var centroids = result.centroids;

	        for (var i = 0; i < outputSingleData.length; i++) {
	            var line = outputSingleData[i];
	            var clusterIndex = line[dataMeta.outputClusterIndexDimension];
	            var centroid = centroids[clusterIndex];
	            var dimLen = Math.min(centroid.length, outputCentroidDimensions.length);
	            for (var j = 0; j < dimLen; j++) {
	                line[outputCentroidDimensions[j]] = centroid[j];
	            }
	        }
	    }

	    /**
	     * Create random centroid of kmeans.
	     */
	    function createRandCent(k, extents) {
	        //constructs a two-dimensional array with all values 0
	        var centroids = zeros(k, extents.length);
	        //create random cluster centers, within bounds of each dimension
	        for (var j = 0; j < extents.length; j++) {
	            var extentItem = extents[j];
	            for (var i = 0; i < k; i++) {
	                centroids[i][j] = extentItem.min + extentItem.span * Math.random();
	            }
	        }
	        return centroids;
	    }

	    /**
	     * Distance method for calculating similarity
	     */
	    function distEuclid(dataItem, centroid, dataMeta) {
	        // The distance should be normalized between different dimensions,
	        // otherwise they may provide different weight in the final distance.
	        // The greater weight offers more effect in the cluster determination.

	        var powerSum = 0;
	        var dimensions = dataMeta.dimensions;
	        var extents = dataMeta.rawExtents;
	        //subtract the corresponding elements in the vectors
	        for (var i = 0; i < dimensions.length; i++) {
	            var span = extents[i].span;
	            // If span is 0, do not count.
	            if (span) {
	                var dimIdx = dimensions[i];
	                var dist = (dataItem[dimIdx] - centroid[i]) / span;
	                powerSum += mathPow(dist, 2);
	            }
	        }

	        return powerSum;
	    }

	    function parseDataMeta(dataSet, config) {
	        var size = arraySize(dataSet);
	        if (size.length < 1) {
	            throw new Error('The input data of clustering should be two-dimension array.');
	        }
	        var colCount = size[1];
	        var defaultDimensions = [];
	        for (var i = 0; i < colCount; i++) {
	            defaultDimensions.push(i);
	        }
	        var dimensions = normalizeDimensions(config.dimensions, defaultDimensions);
	        var outputType = config.outputType || OutputType.MULTIPLE;

	        var outputClusterIndexDimension = config.outputClusterIndexDimension;
	        if (outputType === OutputType.SINGLE && !numberUtil.isNumber(outputClusterIndexDimension)) {
	            throw new Error('outputClusterIndexDimension is required as a number.');
	        }
	        var extents = calcExtents(dataSet, dimensions);

	        return {
	            dimensions: dimensions,
	            rawExtents: extents,
	            outputType: outputType,
	            outputClusterIndexDimension: outputClusterIndexDimension,
	            outputCentroidDimensions: config.outputCentroidDimensions,
	        };
	    }

	    function calcExtents(dataSet, dimensions) {
	        var extents = [];
	        var dimLen = dimensions.length;
	        for (var i = 0; i < dimLen; i++) {
	            extents.push({ min: Infinity, max: -Infinity });
	        }
	        for (var i = 0; i < dataSet.length; i++) {
	            var line = dataSet[i];
	            for (var j = 0; j < dimLen; j++) {
	                var extentItem = extents[j];
	                var val = line[dimensions[j]];
	                extentItem.min > val && (extentItem.min = val);
	                extentItem.max < val && (extentItem.max = val);
	            }
	        }
	        for (var i = 0; i < dimLen; i++) {
	            extents[i].span = extents[i].max - extents[i].min;
	        }
	        return extents;
	    }

	    return {
	        OutputType: OutputType,
	        hierarchicalKMeans: hierarchicalKMeans
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var array = __webpack_require__(3);
	    var isArray = array.isArray;
	    var size = array.size;
	    var number = __webpack_require__(4);
	    var isNumber = number.isNumber;

	    /**
	     * @param  {Array.<number>|number} dimensions like `[2, 4]` or `4`
	     * @param  {Array.<number>} [defaultDimensions=undefined] By default `undefined`.
	     * @return {Array.<number>} number like `4` is normalized to `[4]`,
	     *         `null`/`undefined` is normalized to `defaultDimensions`.
	     */
	    function normalizeDimensions(dimensions, defaultDimensions) {
	        return typeof dimensions === 'number'
	            ? [dimensions]
	            : dimensions == null
	            ? defaultDimensions
	            : dimensions;
	    }

	    /**
	     * Data preprocessing, filter the wrong data object.
	     *  for example [12,] --- missing y value
	     *              [,12] --- missing x value
	     *              [12, b] --- incorrect y value
	     *              ['a', 12] --- incorrect x value
	     * @param  {Array.<Array>} data
	     * @param  {Object?} [opt]
	     * @param  {Array.<number>} [opt.dimensions] Optional. Like [2, 4],
	     *         means that dimension index 2 and dimension index 4 need to be number.
	     *         If null/undefined (by default), all dimensions need to be number.
	     * @param  {boolean} [opt.toOneDimensionArray] Convert to one dimension array.
	     *         Each value is from `opt.dimensions[0]` or dimension 0.
	     * @return {Array.<Array.<number>>}
	     */
	    function dataPreprocess(data, opt) {
	        opt = opt || {};
	        var dimensions = opt.dimensions;
	        var numberDimensionMap = {};
	        if (dimensions != null) {
	            for (var i = 0; i < dimensions.length; i++) {
	                numberDimensionMap[dimensions[i]] = true;
	            }
	        }
	        var targetOneDim = opt.toOneDimensionArray
	            ? (dimensions ? dimensions[0] : 0)
	            : null;

	        function shouldBeNumberDimension(dimIdx) {
	            return !dimensions || numberDimensionMap.hasOwnProperty(dimIdx);
	        }

	        if (!isArray(data)) {
	            throw new Error('Invalid data type, you should input an array');
	        }
	        var predata = [];
	        var arraySize = size(data);

	        if (arraySize.length === 1) {
	            for (var i = 0; i < arraySize[0]; i++) {
	                var item = data[i];
	                if (isNumber(item)) {
	                    predata.push(item);
	                }
	            }
	        }
	        else if (arraySize.length === 2) {
	            for (var i = 0; i < arraySize[0]; i++) {
	                var isCorrect = true;
	                var item = data[i];
	                for (var j = 0; j < arraySize[1]; j++) {
	                    if (shouldBeNumberDimension(j) && !isNumber(item[j])) {
	                        isCorrect = false;
	                    }
	                }
	                if (isCorrect) {
	                    predata.push(
	                        targetOneDim != null
	                            ? item[targetOneDim]
	                            : item
	                    );
	                }
	            }
	        }
	        return predata;
	    }

	    /**
	     * @param {string|number} val
	     * @return {number}
	     */
	    function getPrecision(val) {
	        var str = val.toString();
	        // scientific notation is not considered
	        var dotIndex = str.indexOf('.');
	        return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
	    }

	    return {
	        normalizeDimensions: normalizeDimensions,
	        dataPreprocess: dataPreprocess,
	        getPrecision: getPrecision
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var objToString = Object.prototype.toString;
	    var arrayProto = Array.prototype;
	    var nativeMap = arrayProto.map;

	    /**
	     * Get the size of a array
	     * @param  {Array} data
	     * @return {Array}
	     */
	    function size(data) {
	        var s = [];
	        while (isArray(data)) {
	            s.push(data.length);
	            data = data[0];
	        }
	        return s;
	    }

	    /**
	     * @param {*}  value
	     * @return {boolean}
	     */
	    function isArray(value) {
	        return objToString.call(value) === '[object Array]';
	    }

	    /**
	     * constructs a (m x n) array with all values 0
	     * @param  {number} m  the row
	     * @param  {number} n  the column
	     * @return {Array}
	     */
	    function zeros(m, n) {
	        var zeroArray = [];
	        for (var i = 0; i < m ; i++) {
	            zeroArray[i] = [];
	            for (var j = 0; j < n; j++) {
	                zeroArray[i][j] = 0;
	            }
	        }
	        return zeroArray;
	    }

	    /**
	     * Sums each element in the array.
	     * Internal use, for performance considerations, to avoid
	     * unnecessary judgments and calculations.
	     * @param  {Array} vector
	     * @return {number}
	     */
	    function sum(vector) {
	        var sum = 0;
	        for (var i = 0; i < vector.length; i++) {
	            sum += vector[i];
	        }
	        return sum;
	    }

	    /**
	     * Computes the sum of the specified column elements in a two-dimensional array
	     * @param  {Array.<Array>} dataList  two-dimensional array
	     * @param  {number} n  the specified column, zero-based
	     * @return {number}
	     */
	    function sumOfColumn(dataList, n) {
	        var sum = 0;
	        for (var i = 0; i < dataList.length; i++) {
	            sum += dataList[i][n];
	        }
	        return sum;
	    }


	    function ascending(a, b) {

	        return a > b ? 1 : a < b ? -1 : a === b ? 0 : NaN;

	    }

	    /**
	     * Binary search algorithm --- this bisector is specidfied to histogram, which every bin like that [a, b),
	     * so the return value use to add 1.
	     * @param  {Array.<number>} array
	     * @param  {number} value
	     * @param  {number} start
	     * @param  {number} end
	     * @return {number}
	     */
	    function bisect(array, value, start, end) { //移出去

	        if (start == null) {
	            start = 0;
	        }
	        if (end == null) {
	            end = array.length;
	        }
	        while (start < end) {
	            var mid = Math.floor((start + end) / 2);
	            var compare = ascending(array[mid], value);
	            if (compare > 0) {
	                end = mid;
	            }
	            else if (compare < 0) {
	                start = mid + 1;
	            }
	            else {
	                return mid + 1;
	            }
	        }
	        return start;
	    }

	    /**
	     * 数组映射
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function map(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.map && obj.map === nativeMap) {
	            return obj.map(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                result.push(cb.call(context, obj[i], i, obj));
	            }
	            return result;
	        }
	    }

	    return {
	        size: size,
	        isArray: isArray,
	        zeros: zeros,
	        sum: sum,
	        sumOfColumn: sumOfColumn,
	        ascending: ascending,
	        bisect: bisect,
	        map: map
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    /**
	     * Test whether value is a number.
	     * @param  {*}  value
	     * @return {boolean}
	     */
	    function isNumber(value) {

	        value = value === null ? NaN : +value;
	        return typeof value === 'number' && !isNaN(value);
	    }

	    /**
	     * Test if a number is integer.
	     * @param  {number}  value
	     * @return {boolean}
	     */
	    function isInteger(value) {
	        return isFinite(value) && value === Math.round(value);
	    }

	    function quantityExponent(val) {
	        if (val === 0) {
	            return 0;
	        }
	        var exp = Math.floor(Math.log(val) / Math.LN10);
	        // Fix pricision loss.
	        if (val / Math.pow(10, exp) >= 10) {
	            exp++;
	        }
	        return exp;
	    }

	    return {
	        isNumber: isNumber,
	        isInteger: isInteger,
	        quantityExponent: quantityExponent
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var dataProcess = __webpack_require__(2);
	    var dataPreprocess = dataProcess.dataPreprocess;
	    var normalizeDimensions = dataProcess.normalizeDimensions;

	    var regreMethods = {

	        /**
	         * Common linear regression algorithm
	         */
	        linear: function (predata, opt) {

	            var xDimIdx = opt.dimensions[0];
	            var yDimIdx = opt.dimensions[1];
	            var sumX = 0;
	            var sumY = 0;
	            var sumXY = 0;
	            var sumXX = 0;
	            var len = predata.length;

	            for (var i = 0; i < len; i++) {
	                var rawItem = predata[i];
	                sumX += rawItem[xDimIdx];
	                sumY += rawItem[yDimIdx];
	                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
	                sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
	            }

	            var gradient = ((len * sumXY) - (sumX * sumY)) / ((len * sumXX) - (sumX * sumX));
	            var intercept = (sumY / len) - ((gradient * sumX) / len);

	            var result = [];
	            for (var j = 0; j < predata.length; j++) {
	                var rawItem = predata[j];
	                var resultItem = rawItem.slice();
	                resultItem[xDimIdx] = rawItem[xDimIdx];
	                resultItem[yDimIdx] = gradient * rawItem[xDimIdx] + intercept;
	                result.push(resultItem);
	            }

	            var expression = 'y = ' + Math.round(gradient * 100) / 100 + 'x + ' + Math.round(intercept * 100) / 100;

	            return {
	                points: result,
	                parameter: {
	                    gradient: gradient,
	                    intercept: intercept
	                },
	                expression: expression
	            };
	        },

	        /**
	         * If the raw data include [0,0] point, we should choose linearThroughOrigin
	         *   instead of linear.
	         */
	        linearThroughOrigin: function (predata, opt) {

	            var xDimIdx = opt.dimensions[0];
	            var yDimIdx = opt.dimensions[1];
	            var sumXX = 0;
	            var sumXY = 0;

	            for (var i = 0; i < predata.length; i++) {
	                var rawItem = predata[i];
	                sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
	                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
	            }

	            var gradient = sumXY / sumXX;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var rawItem = predata[j];
	                var resultItem = rawItem.slice();
	                resultItem[xDimIdx] = rawItem[xDimIdx];
	                resultItem[yDimIdx] = rawItem[xDimIdx] * gradient;
	                result.push(resultItem);
	            }

	            var expression = 'y = ' + Math.round(gradient * 100) / 100 + 'x';

	            return {
	                points: result,
	                parameter: {
	                    gradient: gradient
	                },
	                expression: expression
	            };
	        },

	        /**
	         * Exponential regression
	         */
	        exponential: function (predata, opt) {

	            var xDimIdx = opt.dimensions[0];
	            var yDimIdx = opt.dimensions[1];
	            var sumX = 0;
	            var sumY = 0;
	            var sumXXY = 0;
	            var sumYlny = 0;
	            var sumXYlny = 0;
	            var sumXY = 0;

	            for (var i = 0; i < predata.length; i++) {
	                var rawItem = predata[i];
	                sumX += rawItem[xDimIdx];
	                sumY += rawItem[yDimIdx];
	                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
	                sumXXY += rawItem[xDimIdx] * rawItem[xDimIdx] * rawItem[yDimIdx];
	                sumYlny += rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
	                sumXYlny += rawItem[xDimIdx] * rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
	            }

	            var denominator = (sumY * sumXXY) - (sumXY * sumXY);
	            var coefficient = Math.pow(Math.E, (sumXXY * sumYlny - sumXY * sumXYlny) / denominator);
	            var index = (sumY * sumXYlny - sumXY * sumYlny) / denominator;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var rawItem = predata[j];
	                var resultItem = rawItem.slice();
	                resultItem[xDimIdx] = rawItem[xDimIdx];
	                resultItem[yDimIdx] = coefficient * Math.pow(Math.E, index * rawItem[xDimIdx]);
	                result.push(resultItem);
	            }

	            var expression = 'y = ' + Math.round(coefficient * 100) / 100 + 'e^(' + Math.round(index * 100) / 100 + 'x)';

	            return {
	                points: result,
	                parameter: {
	                    coefficient: coefficient,
	                    index: index
	                },
	                expression: expression
	            };

	        },

	        /**
	         * Logarithmic regression
	         */
	        logarithmic: function (predata, opt) {

	            var xDimIdx = opt.dimensions[0];
	            var yDimIdx = opt.dimensions[1];
	            var sumlnx = 0;
	            var sumYlnx = 0;
	            var sumY = 0;
	            var sumlnxlnx = 0;

	            for (var i = 0; i < predata.length; i++) {
	                var rawItem = predata[i];
	                sumlnx += Math.log(rawItem[xDimIdx]);
	                sumYlnx += rawItem[yDimIdx] * Math.log(rawItem[xDimIdx]);
	                sumY += rawItem[yDimIdx];
	                sumlnxlnx += Math.pow(Math.log(rawItem[xDimIdx]), 2);
	            }

	            var gradient = (i * sumYlnx - sumY * sumlnx) / (i * sumlnxlnx - sumlnx * sumlnx);
	            var intercept = (sumY - gradient * sumlnx) / i;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var rawItem = predata[j];
	                var resultItem = rawItem.slice();
	                resultItem[xDimIdx] = rawItem[xDimIdx];
	                resultItem[yDimIdx] = gradient * Math.log(rawItem[xDimIdx]) + intercept;
	                result.push(resultItem);
	            }

	            var expression =
	                'y = '
	                + Math.round(intercept * 100) / 100
	                + ' + '
	                + Math.round(gradient * 100) / 100 + 'ln(x)';

	            return {
	                points: result,
	                parameter: {
	                    gradient: gradient,
	                    intercept: intercept
	                },
	                expression: expression
	            };

	        },

	        /**
	         * Polynomial regression
	         */
	        polynomial: function (predata, opt) {

	            var xDimIdx = opt.dimensions[0];
	            var yDimIdx = opt.dimensions[1];
	            var order = opt.order;

	            if (order == null) {
	                order = 2;
	            }
	            //coefficient matrix
	            var coeMatrix = [];
	            var lhs = [];
	            var k = order + 1;

	            for (var i = 0; i < k; i++) {
	                var sumA = 0;
	                for (var n = 0; n < predata.length; n++) {
	                    var rawItem = predata[n];
	                    sumA += rawItem[yDimIdx] * Math.pow(rawItem[xDimIdx], i);
	                }
	                lhs.push(sumA);

	                var temp = [];
	                for (var j = 0; j < k; j++) {
	                    var sumB = 0;
	                    for (var m = 0; m < predata.length; m++) {
	                        sumB += Math.pow(predata[m][xDimIdx], i + j);
	                    }
	                    temp.push(sumB);
	                }
	                coeMatrix.push(temp);
	            }
	            coeMatrix.push(lhs);

	            var coeArray = gaussianElimination(coeMatrix, k);

	            var result = [];

	            for (var i = 0; i < predata.length; i++) {
	                var value = 0;
	                var rawItem = predata[i];
	                for (var n = 0; n < coeArray.length; n++) {
	                    value += coeArray[n] * Math.pow(rawItem[xDimIdx], n);
	                }
	                var resultItem = rawItem.slice();
	                resultItem[xDimIdx] = rawItem[xDimIdx];
	                resultItem[yDimIdx] = value;
	                result.push(resultItem);
	            }

	            var expression = 'y = ';
	            for (var i = coeArray.length - 1; i >= 0; i--) {
	                if (i > 1) {
	                    expression += Math.round(coeArray[i] * Math.pow(10, i + 1)) / Math.pow(10, i + 1) + 'x^' + i + ' + ';
	                }
	                else if (i === 1) {
	                    expression += Math.round(coeArray[i] * 100) / 100 + 'x' + ' + ';
	                }
	                else {
	                    expression += Math.round(coeArray[i] * 100) / 100;
	                }
	            }

	            return {
	                points: result,
	                parameter: coeArray,
	                expression: expression
	            };

	        }

	    };

	    /**
	     * Gaussian elimination
	     * @param  {Array.<Array.<number>>} matrix   two-dimensional number array
	     * @param  {number} number
	     * @return {Array}
	     */
	    function gaussianElimination(matrix, number) {

	        for (var i = 0; i < matrix.length - 1; i++) {
	            var maxColumn = i;
	            for (var j = i + 1; j < matrix.length - 1; j++) {
	                if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxColumn])) {
	                    maxColumn = j;
	                }
	            }
	            // the matrix here is the transpose of the common Augmented matrix.
	            //  so the can perform the primary column transform, in fact, equivalent
	            //  to the primary line changes
	            for (var k = i; k < matrix.length; k++) {
	                var temp = matrix[k][i];
	                matrix[k][i] = matrix[k][maxColumn];
	                matrix[k][maxColumn] = temp;
	            }
	            for (var n = i + 1; n < matrix.length - 1; n++) {
	                for (var m = matrix.length - 1; m >= i; m--) {
	                    matrix[m][n] -= matrix[m][i] / matrix[i][i] * matrix[i][n];
	                }
	            }
	        }

	        var data = new Array(number);
	        var len = matrix.length - 1;
	        for (var j = matrix.length - 2; j >= 0; j--) {
	            var temp = 0;
	            for (var i = j + 1; i < matrix.length - 1; i++) {
	                temp += matrix[i][j] * data[i];
	            }
	            data[j] = (matrix[len][j] - temp) / matrix[j][j];

	        }

	        return data;
	    }

	    /**
	     * @param  {string} regreMethod
	     * @param  {Array.<Array.<number>>} data   two-dimensional number array
	     * @param  {Object|number} [optOrOrder]  opt or order
	     * @param  {number} [optOrOrder.order]  order of polynomials
	     * @param  {Array.<number>|number} [optOrOrder.dimensions=[0, 1]]  Target dimensions to calculate the regression.
	     *         By defualt: use [0, 1] as [x, y].
	     * @return {Array}
	     */
	    var regression = function (regreMethod, data, optOrOrder) {
	        var opt = typeof optOrOrder === 'number'
	            ? { order: optOrOrder }
	            : (optOrOrder || {});

	        var dimensions = normalizeDimensions(opt.dimensions, [0, 1]);

	        var predata = dataPreprocess(data, { dimensions: dimensions });
	        var result = regreMethods[regreMethod](predata, {
	            order: opt.order,
	            dimensions: dimensions
	        });

	        // Sort for line chart.
	        var xDimIdx = dimensions[0];
	        result.points.sort(function (itemA, itemB) {
	            return itemA[xDimIdx] - itemB[xDimIdx];
	        });

	        return result;
	    };

	    return regression;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var statistics = {};

	    statistics.max = __webpack_require__(7);
	    statistics.deviation = __webpack_require__(8);
	    statistics.mean = __webpack_require__(10);
	    statistics.median = __webpack_require__(12);
	    statistics.min = __webpack_require__(14);
	    statistics.quantile = __webpack_require__(13);
	    statistics.sampleVariance = __webpack_require__(9);
	    statistics.sum = __webpack_require__(11);

	    return statistics;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var number = __webpack_require__(4);
	    var isNumber = number.isNumber;

	    /**
	     * Is a method for computing the max value of a list of numbers,
	     * which will filter other data types.
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function max(data) {

	        var maxData = -Infinity;
	        for (var i = 0; i < data.length; i++) {
	            if (isNumber(data[i]) && data[i] > maxData) {
	                maxData = data[i];
	            }
	        }
	        return maxData;
	    }

	    return max;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var variance = __webpack_require__(9);

	    /**
	     * Computing the deviation
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    return function (data) {

	        var squaredDeviation = variance(data);

	        return squaredDeviation ? Math.sqrt(squaredDeviation) : squaredDeviation;
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var number = __webpack_require__(4);
	    var isNumber = number.isNumber;
	    var mean = __webpack_require__(10);

	    /**
	     * Computing the variance of list of sample
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function sampleVariance(data) {

	        var len = data.length;
	        if (!len || len < 2) {
	            return 0;
	        }
	        if (data.length >= 2) {

	            var meanValue = mean(data);
	            var sum = 0;
	            var temple;

	            for (var i = 0; i < data.length; i++) {
	                if (isNumber(data[i])) {
	                    temple = data[i] - meanValue;
	                    sum += temple * temple;
	                }
	            }
	            return sum / (data.length - 1);
	        }
	    }

	    return sampleVariance;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var sum = __webpack_require__(11);

	    /**
	     * Is a method for computing the mean value of a list of numbers,
	     * which will filter other data types.
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function mean(data) {

	        var len = data.length;

	        if (!len) {
	            return 0;
	        }

	        return sum(data) / data.length;

	    }

	    return mean;


	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var number = __webpack_require__(4);
	    var isNumber = number.isNumber;

	    /**
	     * Is a method for computing the sum of a list of numbers,
	     * which will filter other data types.
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function sum(data) {

	        var len = data.length;

	        if (!len) {
	            return 0;
	        }
	        var sumData = 0;
	        for (var i = 0; i < len; i++) {
	            if (isNumber(data[i])) {
	                sumData += data[i];
	            }
	        }
	        return sumData;
	    }

	    return sum;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var quantile = __webpack_require__(13);

	    /**
	     * Is a method for computing the median value of a sorted array of numbers
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function median(data) {

	        return quantile(data, 0.5);
	    }

	    return median;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    /**
	     * Estimating quantiles from a sorted sample of numbers
	     * @see https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample
	     * R-7 method
	     * @param  {Array.<number>} data  sorted array
	     * @param  {number} p
	     */
	    return function (data, p) {

	        var len = data.length;

	        if (!len) {
	            return 0;
	        }
	        if (p <= 0 || len < 2) {
	            return data[0];
	        }
	        if (p >= 1) {
	            return data[len -1];
	        }
	        // in the wikipedia's R-7 method h = (N - 1)p + 1, but here array index start from 0
	        var h = (len - 1) * p;
	        var i = Math.floor(h);
	        var a = data[i];
	        var b = data[i + 1];
	        return a + (b - a) * (h - i);
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var number = __webpack_require__(4);
	    var isNumber = number.isNumber;

	    /**
	     * Is a method for computing the min value of a list of numbers,
	     * which will filter other data types.
	     * @param  {Array.<number>} data
	     * @return {number}
	     */
	    function min(data) {

	        var minData = Infinity;
	        for (var i = 0; i < data.length; i++) {
	            if (isNumber(data[i]) && data[i] < minData) {
	                minData = data[i];
	            }
	        }
	        return minData;
	    }

	    return min;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var max = __webpack_require__(7);
	    var min = __webpack_require__(14);
	    var quantile = __webpack_require__(13);
	    var deviation = __webpack_require__(8);
	    var dataProcess = __webpack_require__(2);
	    var dataPreprocess = dataProcess.dataPreprocess;
	    var normalizeDimensions = dataProcess.normalizeDimensions;
	    var array = __webpack_require__(3);
	    var ascending = array.ascending;
	    var map = array.map;
	    var range = __webpack_require__(16);
	    var bisect = array.bisect;
	    var tickStep = __webpack_require__(17);

	    /**
	     * Compute bins for histogram
	     * @param  {Array.<number>} data
	     * @param  {Object|string} optOrMethod Optional settings or `method`.
	     * @param  {Object|string} optOrMethod.method 'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'
	     * @param  {Array.<number>|number} optOrMethod.dimensions If data is a 2-d array,
	     *         which dimension will be used to calculate histogram.
	     * @return {Object}
	     */
	    function computeBins(data, optOrMethod) {
	        var opt = typeof optOrMethod === 'string'
	            ? { method: optOrMethod }
	            : (optOrMethod || {});

	        var threshold = opt.method == null
	            ? thresholdMethod.squareRoot
	            : thresholdMethod[opt.method];
	        var dimensions = normalizeDimensions(opt.dimensions);

	        var values = dataPreprocess(data, {
	            dimensions: dimensions,
	            toOneDimensionArray: true
	        });
	        var maxValue = max(values);
	        var minValue = min(values);
	        var binsNumber = threshold(values, minValue, maxValue);
	        var tickStepResult = tickStep(minValue, maxValue, binsNumber);
	        var step = tickStepResult.step;
	        var toFixedPrecision = tickStepResult.toFixedPrecision;

	        // return the xAxis coordinate for each bins, except the end point of the value
	        var rangeArray = range(
	            // use function toFixed() to avoid data like '0.700000001'
	            +((Math.ceil(minValue / step) * step).toFixed(toFixedPrecision)),
	            +((Math.floor(maxValue / step) * step).toFixed(toFixedPrecision)),
	            step,
	            toFixedPrecision
	        );

	        var len = rangeArray.length;

	        var bins = new Array(len + 1);

	        for (var i = 0; i <= len; i++) {
	            bins[i] = {};
	            bins[i].sample = [];
	            bins[i].x0 = i > 0
	                ? rangeArray[i - 1]
	                : (rangeArray[i] - minValue) === step
	                ? minValue
	                : (rangeArray[i] - step);
	            bins[i].x1 = i < len
	                ? rangeArray[i]
	                : (maxValue - rangeArray[i-1]) === step
	                ? maxValue
	                : rangeArray[i - 1] + step;
	        }

	        for (var i = 0; i < values.length; i++) {
	            if (minValue <= values[i] && values[i] <= maxValue) {
	                bins[bisect(rangeArray, values[i], 0, len)].sample.push(values[i]);
	            }
	        }

	        var data = map(bins, function (bin) {
	            // use function toFixed() to avoid data like '6.5666638489'
	            return [
	                +((bin.x0 + bin.x1) / 2).toFixed(toFixedPrecision),
	                bin.sample.length,
	                bin.x0,
	                bin.x1,
	                bin.x0 + ' - ' + bin.x1
	            ];
	        });

	        var customData = map(bins, function (bin) {
	            return [bin.x0, bin.x1, bin.sample.length];
	        });

	        return {
	            bins: bins,
	            data: data,
	            customData: customData
	        };
	    }

	    /**
	     * Four kinds of threshold methods used to
	     * compute how much bins the histogram should be divided
	     * @see  https://en.wikipedia.org/wiki/Histogram
	     * @type {Object}
	     */
	    var thresholdMethod = {

	        squareRoot: function (data) {

	            var bins = Math.ceil(Math.sqrt(data.length));

	            return bins > 50 ? 50 : bins;
	        },

	        scott: function (data, min, max) {

	            return Math.ceil((max - min) / (3.5 * deviation(data) * Math.pow(data.length, -1 / 3)));
	        },

	        freedmanDiaconis: function (data, min, max) {

	            data.sort(ascending);

	            return Math.ceil(
	                (max - min) / (2 * (quantile(data, 0.75) - quantile(data, 0.25)) * Math.pow(data.length, -1 / 3))
	            );
	        },

	        sturges: function (data) {

	            return Math.ceil(Math.log(data.length) / Math.LN2) + 1;

	        }
	    };

	    return computeBins;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var dataProcess = __webpack_require__(2);
	    var getPrecision = dataProcess.getPrecision;

	    /**
	     * Computing range array.
	     * Adding param precision to fix range value, avoiding range[i] = 0.7000000001.
	     * @param  {number} start
	     * @param  {number} end
	     * @param  {number} step
	     * @param  {number} precision
	     * @return {Array.<number>}
	     */
	    return function (start, end, step, precision) {

	        var len = arguments.length;

	        if (len < 2) {
	            end = start;
	            start = 0;
	            step = 1;
	        }
	        else if (len < 3) {
	            step = 1;
	        }
	        else if (len < 4) {
	            step = +step;
	            precision = getPrecision(step);
	        }
	        else {
	            precision = +precision;
	        }

	        var n = Math.ceil(((end - start) / step).toFixed(precision));
	        var range = new Array(n + 1);
	        for (var i = 0; i < n + 1; i++) {
	            range[i] = +(start + i * step).toFixed(precision);
	        }
	        return range;
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var numberUtil = __webpack_require__(4);

	    /**
	     * Computing the length of step
	     * @see  https://github.com/d3/d3-array/blob/master/src/ticks.js
	     * @param {number} start
	     * @param {number} stop
	     * @param {number} count
	     */
	    return function (start, stop, count) {

	        var step0 = Math.abs(stop - start) / count;
	        var precision = numberUtil.quantityExponent(step0);

	        var step1 = Math.pow(10, precision);
	        var error = step0 / step1;

	        if (error >= Math.sqrt(50)) {
	            step1 *= 10;
	        }
	        else if (error >= Math.sqrt(10)) {
	            step1 *= 5;
	        }
	        else if(error >= Math.sqrt(2)) {
	            step1 *= 2;
	        }

	        var toFixedPrecision = precision < 0 ? -precision : 0;
	        var resultStep = +(
	            (stop >= start ? step1 : -step1).toFixed(toFixedPrecision)
	        );

	        return {
	            step: resultStep,
	            toFixedPrecision: toFixedPrecision
	        };
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var regression = __webpack_require__(5);
	    var transformHelper = __webpack_require__(19);
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

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var arrayUtil = __webpack_require__(3);
	    var numberUtil = __webpack_require__(4);
	    var objectUtil = __webpack_require__(20);

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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    function extend(target, source) {
	        if (Object.assign) {
	            Object.assign(target, source);
	        }
	        else {
	            for (var key in source) {
	                if (source.hasOwnProperty(key)) {
	                    target[key] = source[key];
	                }
	            }
	        }
	        return target;
	    }

	    function isObject(value) {
	        const type = typeof value;
	        return type === 'function' || (!!value && type === 'object');
	    }

	    return {
	        extend: extend,
	        isObject: isObject
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var histogram = __webpack_require__(15);
	    var transformHelper = __webpack_require__(19);

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

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var clustering = __webpack_require__(1);
	    var numberUtil = __webpack_require__(4);
	    var transformHelper = __webpack_require__(19);

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

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ])
});
;