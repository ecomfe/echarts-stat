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
	        histogram: __webpack_require__(15)

	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var dataProcess = __webpack_require__(2);
	    var dataPreprocess = dataProcess.dataPreprocess;
	    var array = __webpack_require__(3);
	    var arraySize = array.size;
	    var sumOfColumn = array.sumOfColumn;
	    var arraySum = array.sum;
	    var zeros = array.zeros;
	    var isArray = array.isArray;
	    var mathSqrt = Math.sqrt;
	    var mathPow = Math.pow;

	    /**
	     * KMeans of clustering algorithm
	     * @param  {Array.<Array.<number>>} data  two-dimension array
	     * @param  {number} k   the number of clusters in a dataset
	     * @return {Object}
	     */
	    function kMeans(data, k) {

	        var size = arraySize(data);
	        // create array to assign data points to centroids, also holds SE of each point
	        var clusterAssigned = zeros(size[0], 2);
	        var centroids = createRandCent(data, k);
	        var clusterChanged = true;
	        var minDist;
	        var minIndex;
	        var distIJ;
	        var ptsInClust;

	        while (clusterChanged) {
	            clusterChanged = false;
	            for (var i = 0; i < size[0]; i++) {
	                minDist = Infinity;
	                minIndex = -1;
	                for (var j = 0; j < k; j++) {
	                    distIJ = distEuclid(data[i], centroids[j]);
	                    if (distIJ < minDist) {
	                        minDist = distIJ;
	                        minIndex = j;
	                    }
	                }
	                if (clusterAssigned[i][0] !== minIndex) {
	                    clusterChanged = true;
	                }
	                clusterAssigned[i][0] = minIndex;
	                clusterAssigned[i][1] = mathPow(minDist, 2);
	            }
	            //recalculate centroids
	            for (var i = 0; i < k; i++) {
	                ptsInClust = [];
	                for (var j = 0; j < clusterAssigned.length; j++) {
	                    if (clusterAssigned[j][0] === i) {
	                        ptsInClust.push(data[j]);
	                    }
	                }
	                centroids[i] = meanInColumns(ptsInClust);
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
	     *  and returns the values as an array.
	     * @param  {Array.<Array>} dataList two-dimensional array
	     * @return {Array}
	     */
	    function meanInColumns(dataList) {

	        var size = arraySize(dataList);
	        var meanArray = [];
	        var sum;
	        var mean;
	        for (var j = 0; j < size[1]; j++) {
	            sum = 0;
	            for (var i = 0; i < size[0]; i++) {
	                sum += dataList[i][j];
	            }
	            mean = sum / size[0];
	            meanArray.push(mean);
	        }
	        return meanArray;
	    }

	    /**
	     * The combine of hierarchical clustering and k-means.
	     * @param  {Array} data   two-dimension array.
	     * @param  {[type]} k   the number of clusters in a dataset. It has to be greater than 1.
	     * @param  {boolean}  stepByStep
	     * @return {}
	     */
	    function hierarchicalKMeans(data, k, stepByStep) {
	        if (k < 2 ) {
	            return;
	        }
	        var dataSet = dataPreprocess(data);
	        var size = arraySize(dataSet);
	        var clusterAssment = zeros(size[0], 2);
	        // initial center point
	        var centroid0 = meanInColumns(dataSet);
	        var centList = [centroid0];
	        var squareError;
	        for (var i = 0; i < size[0]; i++) {
	            squareError = distEuclid(dataSet[i], centroid0);
	            clusterAssment[i][1] = mathPow(squareError, 2);
	        }
	        var lowestSSE;
	        var ptsInClust;
	        var ptsNotClust;
	        var clusterInfo;
	        var sseSplit;
	        var sseNotSplit;
	        var index = 1;
	        var result = {
	            isEnd: false
	        };

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
	                    for (var i = 0; i < clusterAssment.length; i++) {
	                        if (clusterAssment[i][0] === j) {
	                            ptsInClust.push(dataSet[i]);
	                        }
	                        else {
	                            ptsNotClust.push(clusterAssment[i][1]);
	                        }
	                    }
	                    clusterInfo = kMeans(ptsInClust, 2);
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
	                for ( i = 0, j = 0; i < clusterAssment.length && j < newClusterAss.length; i++) {
	                    if (clusterAssment[i][0] === centSplit) {
	                        clusterAssment[i][0] = newClusterAss[j][0];
	                        clusterAssment[i][1] = newClusterAss[j++][1];
	                    }
	                }

	                var pointInClust = [];
	                for (var i = 0; i < centList.length; i++) {
	                    pointInClust[i] = [];
	                    for (var j = 0; j < clusterAssment.length; j++) {
	                        if (clusterAssment[j][0] === i) {
	                            pointInClust[i].push(dataSet[j]);
	                        }
	                    }
	                }

	                result.clusterAssment = clusterAssment;
	                result.centroids = centList;
	                result.pointsInCluster = pointInClust;


	                index++;
	            }
	            else {
	                result.isEnd = true;
	            }

	            return result;
	        }

	        var step = {
	            next: oneStep
	        };

	        if (!stepByStep) {
	            var result;
	            while (!(result = step.next()).isEnd);
	            return result;
	        }
	        else {
	            return step;
	        }

	    }

	    /**
	     * Create random centroid of kmeans.
	     * @param  {Array.<number>} dataSet  two-dimension array
	     * @param  {number} k   the number of centroids to be created
	     * @return {Array.<number>}   random centroids of kmeans
	     */
	    function createRandCent(dataSet, k) {
	        var size = arraySize(dataSet);
	        //constructs a two-dimensional array with all values 0
	        var centroids = zeros(k, size[1]);
	        var minJ;
	        var maxJ;
	        var rangeJ;
	        //create random cluster centers, within bounds of each dimension
	        for (var j = 0; j < size[1]; j++) {
	            minJ = dataSet[0][j];
	            maxJ = dataSet[0][j];
	            for (var i = 1; i < size[0]; i++) {
	                if (dataSet[i][j] < minJ) {
	                    minJ = dataSet[i][j];
	                }
	                if (dataSet[i][j] > maxJ) {
	                    maxJ = dataSet[i][j];
	                }
	            }
	            rangeJ = maxJ - minJ;
	            for (var i = 0; i < k; i++) {
	                centroids[i][j] = minJ + rangeJ * Math.random();
	            }
	        }
	        return centroids;
	    }

	    /**
	     * Distance method for calculating similarity
	     * @param  {Array.<number>}  vec1
	     * @param  {Array.<nnumber>}  vec2
	     * @return {number}
	     */
	    function distEuclid(vec1, vec2) {

	        if (!isArray(vec1) && !isArray(vec2)) {
	            return mathSqrt(mathPow(vec1 - vec2, 2));
	        }

	        var powerSum = 0;
	        //subtract the corresponding elements in the vectors
	        for (var i = 0; i < vec1.length; i++) {
	            powerSum += mathPow(vec1[i] - vec2[i], 2);
	        }

	        return mathSqrt(powerSum);
	    }

	    return {
	        kMeans: kMeans,
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
	     * Data preprocessing, filter the wrong data object.
	     *  for example [12,] --- missing y value
	     *              [,12] --- missing x value
	     *              [12, b] --- incorrect y value
	     *              ['a', 12] --- incorrect x value
	     * @param  {Array.<Array>} data
	     * @return {Array.<Array.<number>>}
	     */
	    function dataPreprocess(data) {

	        if (!isArray(data)) {
	            throw new Error('Invalid data type, you should input an array');
	        }
	        var predata = [];
	        var arraySize = size(data);

	        if (arraySize.length === 1) {

	            for (var i = 0; i < arraySize[0]; i++) {

	                if (isNumber(data[i])) {
	                    predata.push(data[i]);
	                }
	            }
	        }
	        else if (arraySize.length === 2) {

	            for (var i = 0; i < arraySize[0]; i++) {

	                var isCorrect = true;
	                for (var j = 0; j < arraySize[1]; j++) {
	                    if (!isNumber(data[i][j])) {
	                        isCorrect = false;
	                    }
	                }
	                if (isCorrect) {
	                    predata.push(data[i]);
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

	    return {
	        isNumber: isNumber,
	        isInteger: isInteger
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var dataProcess = __webpack_require__(2);
	    var dataPreprocess = dataProcess.dataPreprocess;

	    var regreMethods = {

	        /**
	         * Common linear regression algorithm
	         * @param  {Array.<Array.<number>>} data two-dimensional array
	         * @return {Object}
	         */
	        linear: function (data) {

	            var predata = dataPreprocess(data);
	            var sumX = 0;
	            var sumY = 0;
	            var sumXY = 0;
	            var sumXX = 0;
	            var len = predata.length;

	            for (var i = 0; i < len; i++) {
	                sumX += predata[i][0];
	                sumY += predata[i][1];
	                sumXY += predata[i][0] * predata[i][1];
	                sumXX += predata[i][0] * predata[i][0];
	            }

	            var gradient = ((len * sumXY) - (sumX * sumY)) / ((len * sumXX) - (sumX * sumX));
	            var intercept = (sumY / len) - ((gradient * sumX) / len);

	            var result = [];
	            for (var j = 0; j < predata.length; j++) {
	                var coordinate = [predata[j][0], gradient * predata[j][0] + intercept];
	                result.push(coordinate);
	            }

	            var string = 'y = ' + Math.round(gradient * 100) / 100 + 'x + ' + Math.round(intercept * 100) / 100;

	            return {
	                points: result,
	                parameter: {
	                    gradient: gradient,
	                    intercept: intercept
	                },
	                expression: string
	            };
	        },

	        /**
	         * If the raw data include [0,0] point, we should choose linearThroughOrigin
	         *   instead of linear.
	         * @param  {Array.<Array>} data  two-dimensional number array
	         * @return {Object}
	         */
	        linearThroughOrigin: function (data) {

	            var predata = dataPreprocess(data);
	            var sumXX = 0;
	            var sumXY = 0;

	            for (var i = 0; i < predata.length; i++) {
	                sumXX += predata[i][0] * predata[i][0];
	                sumXY += predata[i][0] * predata[i][1];
	            }

	            var gradient = sumXY / sumXX;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var coordinate = [predata[j][0], predata[j][0] * gradient];
	                result.push(coordinate);
	            }

	            var string = 'y = ' + Math.round(gradient * 100) / 100 + 'x';

	            return {
	                points: result,
	                parameter: {
	                    gradient: gradient
	                },
	                expression: string
	            };
	        },

	        /**
	         * Exponential regression
	         * @param  {Array.<Array.<number>>} data  two-dimensional number array
	         * @return {Object}
	         */
	        exponential: function (data) {

	            var predata = dataPreprocess(data);
	            var sumX = 0;
	            var sumY = 0;
	            var sumXXY = 0;
	            var sumYlny = 0;
	            var sumXYlny = 0;
	            var sumXY = 0;

	            for (var i = 0; i < predata.length; i++) {
	                sumX += predata[i][0];
	                sumY += predata[i][1];
	                sumXY += predata[i][0] * predata[i][1];
	                sumXXY += predata[i][0] * predata[i][0] * predata[i][1];
	                sumYlny += predata[i][1] * Math.log(predata[i][1]);
	                sumXYlny += predata[i][0] * predata[i][1] * Math.log(predata[i][1]);
	            }

	            var denominator = (sumY * sumXXY) - (sumXY * sumXY);
	            var coefficient = Math.pow(Math.E, (sumXXY * sumYlny - sumXY * sumXYlny) / denominator);
	            var index = (sumY * sumXYlny - sumXY * sumYlny) / denominator;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var coordinate = [predata[j][0], coefficient * Math.pow(Math.E, index * predata[j][0])];
	                result.push(coordinate);
	            }

	            var string = 'y = ' + Math.round(coefficient * 100) / 100 + 'e^(' + Math.round(index * 100) / 100 + 'x)';

	            return {
	                points: result,
	                parameter: {
	                    coefficient: coefficient,
	                    index: index
	                },
	                expression: string
	            };

	        },

	        /**
	         * Logarithmic regression
	         * @param  {Array.<Array.<number>>} data  two-dimensional number array
	         * @return {Object}
	         */
	        logarithmic: function (data) {

	            var predata = dataPreprocess(data);
	            var sumlnx = 0;
	            var sumYlnx = 0;
	            var sumY = 0;
	            var sumlnxlnx = 0;

	            for (var i = 0; i < predata.length; i++) {
	                sumlnx += Math.log(predata[i][0]);
	                sumYlnx += predata[i][1] * Math.log(predata[i][0]);
	                sumY += predata[i][1];
	                sumlnxlnx += Math.pow(Math.log(predata[i][0]), 2);
	            }

	            var gradient = (i * sumYlnx - sumY * sumlnx) / (i * sumlnxlnx - sumlnx * sumlnx);
	            var intercept = (sumY - gradient * sumlnx) / i;
	            var result = [];

	            for (var j = 0; j < predata.length; j++) {
	                var coordinate = [predata[j][0], gradient * Math.log(predata[j][0]) + intercept];
	                result.push(coordinate);
	            }

	            var string =
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
	                expression: string
	            };

	        },

	        /**
	         * Polynomial regression
	         * @param  {Array.<Array.<number>>} data  two-dimensional number array
	         * @param  {number} order  order of polynomials
	         * @return {Object}
	         */
	        polynomial: function (data, order) {

	            var predata = dataPreprocess(data);
	            if (typeof order === 'undefined') {
	                order = 2;
	            }
	            //coefficient matrix
	            var coeMatrix = [];
	            var lhs = [];
	            var k = order + 1;

	            for (var i = 0; i < k; i++) {
	                var sumA = 0;
	                for (var n = 0; n < predata.length; n++) {
	                    sumA += predata[n][1] * Math.pow(predata[n][0], i);
	                }
	                lhs.push(sumA);

	                var temp = [];
	                for (var j = 0; j < k; j++) {
	                    var sumB = 0;
	                    for (var m = 0; m < predata.length; m++) {
	                        sumB += Math.pow(predata[m][0], i + j);
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
	                for (var n = 0; n < coeArray.length; n++) {
	                    value += coeArray[n] * Math.pow(predata[i][0], n);
	                }
	                result.push([predata[i][0], value]);
	            }

	            var string = 'y = ';
	            for (var i = coeArray.length - 1; i >= 0; i--) {
	                if (i > 1) {
	                    string += Math.round(coeArray[i] * Math.pow(10, i + 1)) / Math.pow(10, i + 1) + 'x^' + i + ' + ';
	                }
	                else if (i === 1) {
	                    string += Math.round(coeArray[i] * 100) / 100 + 'x' + ' + ';
	                }
	                else {
	                    string += Math.round(coeArray[i] * 100) / 100;
	                }
	            }

	            return {
	                points: result,
	                parameter: coeArray,
	                expression: string
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

	    var regression = function (regreMethod, data, order) {

	        return regreMethods[regreMethod](data, order);

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
	    var getPrecision = dataProcess.getPrecision;
	    var array = __webpack_require__(3);
	    var ascending = array.ascending;
	    var map = array.map;
	    var range = __webpack_require__(16);
	    var bisect = array.bisect;
	    var tickStep = __webpack_require__(17);

	    /**
	     * Compute bins for histogram
	     * @param  {Array.<number>} data
	     * @param  {string} threshold
	     * @return {Object}
	     */
	    function computeBins(data, threshold) {

	        if (threshold == null) {
	            threshold = thresholdMethod.squareRoot;
	        }
	        else {
	            threshold = thresholdMethod[threshold];
	        }
	        var values = dataPreprocess(data);
	        var maxValue = max(values);
	        var minValue = min(values);
	        var binsNumber = threshold(values, minValue, maxValue);
	        var step = tickStep(minValue, maxValue, binsNumber);
	        var precision = -Math.floor(Math.log(Math.abs(maxValue - minValue) / binsNumber) / Math.LN10);
	        
	        // return the xAxis coordinate for each bins, except the end point of the value
	        var rangeArray = range(
	                // use function toFixed() to avoid data like '0.700000001'
	                +((Math.ceil(minValue / step) * step).toFixed(precision)),
	                +((Math.floor(maxValue / step) * step).toFixed(precision)),
	                step,
	                precision
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
	            return [+((bin.x0 + bin.x1) / 2).toFixed(precision), bin.sample.length];
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

	    /**
	     * Computing the length of step
	     * @see  https://github.com/d3/d3-array/blob/master/src/ticks.js
	     * @param {number} start
	     * @param {number} stop
	     * @param {number} count
	     */
	    return function (start, stop, count) {

	        var step0 = Math.abs(stop - start) / count;
	        var precision = Math.floor(Math.log(step0) / Math.LN10);
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
	        return +((stop >= start ? step1 : -step1).toFixed(-precision));

	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ])
});
;