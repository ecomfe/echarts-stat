define(function (require) {

    var dataProcess = require('./util/dataProcess');
    var dataPreprocess = dataProcess.dataPreprocess;
    var normalizeDimensions = dataProcess.normalizeDimensions;

    var regreMethods = {

        /**
         * Common linear regression algorithm
         */
        linear: function (predata, opt) {

            var showR2 = opt.showR2 !== false;
            var precision = opt.precision || 5;
            var xDimIdx = opt.dimensions[0];
            var yDimIdx = opt.dimensions[1];
            var sumX = 0;
            var sumY = 0;
            var sumXY = 0;
            var sumXX = 0;
            var sumYY = 0;
            var len = predata.length;

            for (var i = 0; i < len; i++) {
                var rawItem = predata[i];
                sumX += rawItem[xDimIdx];
                sumY += rawItem[yDimIdx];
                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
                sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
                sumYY += rawItem[yDimIdx] * rawItem[yDimIdx];
            }

            var gradient = ((len * sumXY) - (sumX * sumY)) / ((len * sumXX) - (sumX * sumX));
            var intercept = (sumY / len) - ((gradient * sumX) / len);
            var r2 = Math.pow(
                (len * sumXY - sumX * sumY) /
                Math.sqrt((len * sumXX - sumX * sumX) * (len * sumYY - sumY * sumY)),
                2
            );

            var result = [];
            for (var j = 0; j < predata.length; j++) {
                var rawItem = predata[j];
                var resultItem = rawItem.slice();
                resultItem[xDimIdx] = rawItem[xDimIdx];
                resultItem[yDimIdx] = gradient * rawItem[xDimIdx] + intercept;
                result.push(resultItem);
            }

            var expression
            if (showR2) {
                expression = `y = ${gradient.toFixed(precision)}x ${intercept >= 0 ? '+' : ''} ${intercept.toFixed(precision)}, R2 = ${r2.toFixed(precision)}`
            } else {
                expression = `y = ${gradient.toFixed(precision)}x ${intercept >= 0 ? '+' : ''} ${intercept.toFixed(precision)}`
            }

            return {
                points: result,
                parameter: {
                    gradient: gradient,
                    intercept: intercept,
                    r2: r2
                },
                expression: expression
            };
        },

        /**
         * If the raw data include [0,0] point, we should choose linearThroughOrigin
         *   instead of linear.
         */
        linearThroughOrigin: function (predata, opt) {

            var showR2 = opt.showR2 !== false;
            var precision = opt.precision || 5;
            var xDimIdx = opt.dimensions[0];
            var yDimIdx = opt.dimensions[1];
            var sumXX = 0;
            var sumXY = 0;
            var sumYY = 0;

            for (var i = 0; i < predata.length; i++) {
                var rawItem = predata[i];
                sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
                sumYY += rawItem[yDimIdx] * rawItem[yDimIdx];
            }

            var gradient = sumXY / sumXX;
            var result = [];
            var r2 = Math.pow(sumXY / Math.sqrt(sumXX * sumYY), 2);

            for (var j = 0; j < predata.length; j++) {
                var rawItem = predata[j];
                var resultItem = rawItem.slice();
                resultItem[xDimIdx] = rawItem[xDimIdx];
                resultItem[yDimIdx] = rawItem[xDimIdx] * gradient;
                result.push(resultItem);
            }

            var expression;
            if (showR2) {
                expression = `y = ${gradient.toFixed(precision)}x, R2 = ${r2.toFixed(precision)}`;
            } else {
                expression = `y = ${gradient.toFixed(precision)}x`;
            }

            return {
                points: result,
                parameter: {
                    gradient: gradient,
                    r2: r2
                },
                expression: expression
            };
        },

        /**
         * Exponential regression
         */
        exponential: function (predata, opt) {

            var showR2 = opt.showR2 !== false;
            var precision = opt.precision || 5;
            var xDimIdx = opt.dimensions[0];
            var yDimIdx = opt.dimensions[1];
            var sumX = 0;
            var sumY = 0;
            var sumXXY = 0;
            var sumYlny = 0;
            var sumXYlny = 0;
            var sumXY = 0;
            var sumlnY = 0;
            var sumXlnY = 0;
            var sumlnYlnY = 0;

            for (var i = 0; i < predata.length; i++) {
                var rawItem = predata[i];
                sumX += rawItem[xDimIdx];
                sumY += rawItem[yDimIdx];
                sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
                sumXXY += rawItem[xDimIdx] * rawItem[xDimIdx] * rawItem[yDimIdx];
                sumYlny += rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
                sumXYlny += rawItem[xDimIdx] * rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
                sumlnY += Math.log(rawItem[yDimIdx]);
                sumXlnY += rawItem[xDimIdx] * Math.log(rawItem[yDimIdx]);
                sumlnYlnY += Math.pow(Math.log(rawItem[yDimIdx]), 2);
            }

            var denominator = (sumY * sumXXY) - (sumXY * sumXY);
            var coefficient = Math.pow(Math.E, (sumXXY * sumYlny - sumXY * sumXYlny) / denominator);
            var index = (sumY * sumXYlny - sumXY * sumYlny) / denominator;
            var result = [];
            var r2 = Math.pow(
                (predata.length * sumXlnY - sumX * sumlnY) /
                Math.sqrt((predata.length * sumX * sumX - sumX * sumX) * (predata.length * sumlnYlnY - sumlnY * sumlnY)),
                2
            );

            for (var j = 0; j < predata.length; j++) {
                var rawItem = predata[j];
                var resultItem = rawItem.slice();
                resultItem[xDimIdx] = rawItem[xDimIdx];
                resultItem[yDimIdx] = coefficient * Math.pow(Math.E, index * rawItem[xDimIdx]);
                result.push(resultItem);
            }

            var expression;
            if (showR2) {
                expression = `y = ${coefficient.toFixed(precision)}e^(${index.toFixed(precision)}x), R2 = ${r2.toFixed(precision)}`;
            } else {
                expression = `y = ${coefficient.toFixed(precision)}e^(${index.toFixed(precision)}x)`;
            }

            return {
                points: result,
                parameter: {
                    coefficient: coefficient,
                    index: index,
                    r2: r2
                },
                expression: expression
            };

        },

        /**
         * Logarithmic regression
         */
        logarithmic: function (predata, opt) {

            var showR2 = opt.showR2 !== false;
            var precision = opt.precision || 5;
            var xDimIdx = opt.dimensions[0];
            var yDimIdx = opt.dimensions[1];
            var sumlnx = 0;
            var sumYlnx = 0;
            var sumY = 0;
            var sumlnxlnx = 0;
            var sumYY = 0;

            for (var i = 0; i < predata.length; i++) {
                var rawItem = predata[i];
                sumlnx += Math.log(rawItem[xDimIdx]);
                sumYlnx += rawItem[yDimIdx] * Math.log(rawItem[xDimIdx]);
                sumY += rawItem[yDimIdx];
                sumlnxlnx += Math.pow(Math.log(rawItem[xDimIdx]), 2);
                sumYY += Math.pow(rawItem[yDimIdx], 2);
            }

            var gradient = (i * sumYlnx - sumY * sumlnx) / (i * sumlnxlnx - sumlnx * sumlnx);
            var intercept = (sumY - gradient * sumlnx) / i;
            var result = [];
            var r2 = Math.pow(
                (predata.length * sumYlnx - sumY * sumlnx) /
                Math.sqrt((predata.length * sumlnxlnx - sumlnx * sumlnx) * (predata.length * sumYY - sumY * sumY)),
                2
            );

            for (var j = 0; j < predata.length; j++) {
                var rawItem = predata[j];
                var resultItem = rawItem.slice();
                resultItem[xDimIdx] = rawItem[xDimIdx];
                resultItem[yDimIdx] = gradient * Math.log(rawItem[xDimIdx]) + intercept;
                result.push(resultItem);
            }

            var expression;
            if (showR2) {
                expression = `y = ${intercept.toFixed(precision)} + ${gradient.toFixed(precision)}ln(x), R2 = ${r2.toFixed(precision)}`;
            } else {
                expression = `y = ${intercept.toFixed(precision)} + ${gradient.toFixed(precision)}ln(x)`;
            }

            return {
                points: result,
                parameter: {
                    gradient: gradient,
                    intercept: intercept,
                    r2: r2
                },
                expression: expression
            };

        },

        /**
         * Polynomial regression
         */
        polynomial: function (predata, opt) {

            var showR2 = opt.showR2 !== false;
            var precision = opt.precision || 5;
            var xDimIdx = opt.dimensions[0];
            var yDimIdx = opt.dimensions[1];
            var order = opt.order;
            var sumY = 0;
            var sumYY = 0;
            var sumX = 0;
            var sumXX = 0;
            var sumXY = 0;

            if (order == null) {
                order = 2;
            }

            for (var i = 0; i < predata.length; i++) {
                var rawItem = predata[i];
                sumY += rawItem[yDimIdx];
                sumYY += Math.pow(rawItem[yDimIdx], 2);
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
                sumX += value;
                sumXX += value * value;
                sumXY += rawItem[yDimIdx] * value;
                result.push(resultItem);
            }

            var r2 = Math.pow(
                (predata.length * sumXY - sumX * sumY) /
                Math.sqrt((predata.length * sumXX - sumX * sumX) * (predata.length * sumYY - sumY * sumY)),
                2
            );

            var expression = 'y = ';
            for (var i = coeArray.length - 1; i >= 0; i--) {
                if (i > 1) {
                    expression += coeArray[i].toFixed(precision) + 'x^' + i + ' + ';
                }
                else if (i === 1) {
                    expression += coeArray[i].toFixed(precision) + 'x' + ' + ';
                }
                else {
                    expression += coeArray[i].toFixed(precision);
                }
            }

            if (showR2) {
                expression += `, R2 = ${r2.toFixed(precision)}`;
            }

            return {
                points: result,
                parameter: {
                    cofficients: coeArray,
                    r2: r2
                },
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
            dimensions: dimensions,
            showR2: opt.showR2,
            precision: opt.precision
        });

        // Sort for line chart.
        var xDimIdx = dimensions[0];
        result.points.sort(function (itemA, itemB) {
            return itemA[xDimIdx] - itemB[xDimIdx];
        });

        return result;
    };

    return regression;

});