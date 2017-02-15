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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var number = __webpack_require__(1);
    var objToString = Object.prototype.toString;

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
     * Sums each element in the array
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

    return {
        size: size,
        isArray: isArray,
        zeros: zeros,
        sum: sum,
        sumOfColumn: sumOfColumn
    };

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    /**
     * Test whether value is a number.
     * @param  {*}  value
     * @return {boolean}
     */
    function isNumber(value) {
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

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var size = array.size;
    var number = __webpack_require__(1);
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
        return predata;
    }

    return dataPreprocess;
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    return {

        clustering: __webpack_require__(4),
        regression: __webpack_require__(5),
        statistic: __webpack_require__(6)

    };

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var dataPreprocess = __webpack_require__(2);
    var array = __webpack_require__(0);
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
     * @param  {[type]} k   the number of clusters in a dataset
     * @param  {boolean}  stepByStep
     * @return {}
     */
    function hierarchicalKMeans(data, k, stepByStep) {

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

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var dataPreprocess = __webpack_require__(2);


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

            var string = 'y = ' + Math.round(intercept * 100) / 100 + ' + ' + Math.round(gradient * 100) / 100 + 'ln(x)';

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

        var data = Array(number);
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

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var statistic = {};

    statistic.max = __webpack_require__(7);
    statistic.mean = __webpack_require__(8);
    statistic.median = __webpack_require__(9);
    statistic.min = __webpack_require__(10);
    statistic.sum = __webpack_require__(11);

    return statistic;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var number = __webpack_require__(1);
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the max value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function max(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }

        var maxData = -Infinity;
        for (var i = 0; i < data.length; i++) {
            if (isNumber(data[i]) && data[i] > maxData) {
                maxData = data[i];
            }
        }
        return maxData;
    }

    return max;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var number = __webpack_require__(1);
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the mean value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function mean(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }
        var sumData = 0;
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (isNumber(data[i])) {
                sumData += data[i];
            }
        }
        return sumData / len;
    }

    return mean;


}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var number = __webpack_require__(1);
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the median value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function median(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }
        var predata = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (isNumber(data[i])) {
                predata.push(data[i]);
            }
        }

        predata.sort(function (a, b) {
            return a - b;
        });

        var medianData;

        if ((len % 2) === 0) {
            var n = len / 2;
            medianData = (predata[n] + predata[n + 1]) / 2;
        }
        else {
            var m = (len + 1) / 2;
            medianData = predata[m];
        }

        return medianData;
    }

    return median;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var number = __webpack_require__(1);
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the min value of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function min(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }

        var minData = Infinity;
        for (var i = 0; i < data.length; i++) {
            if (isNumber(data[i]) && data[i] < minData) {
                minData = data[i];
            }
        }
        return minData;
    }

    return min;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

    var array = __webpack_require__(0);
    var isArray = array.isArray;
    var number = __webpack_require__(1);
    var isNumber = number.isNumber;

    /**
     * Is a method for computing the sum of a list of numbers,
     * which will filter other data types.
     * @param  {Array.<number>} data
     * @return {number}
     */
    function sum(data) {

        if (!isArray(data)) {
            throw new Error('Invalid data type, you should input an array');
        }
        var sumData = 0;
        for (var i = 0; i < data.length; i++) {
            if (isNumber(data[i])) {
                sumData += data[i];
            }
        }
        return sumData;
    }

    return sum;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ })
/******/ ]);
});