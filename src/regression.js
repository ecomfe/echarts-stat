define(function (require) {

    var array = require('./utils/array');
    var isArray = array.isArray;

    var regreMethods = {

        /**
         * Common linear regression algorithm
         * @param  {Array.<Array.<number>>} data two-dimensional array
         * @return {Object}
         */
        linear: function(data) {

            var sumX = 0;
            var sumY = 0;
            var sumXY = 0;
            var sumXX = 0;
            var len = data.length;

            for (var i = 0; i < len; i++) {
                sumX += data[i][0];
                sumY += data[i][1];
                sumXY += data[i][0] * data[i][1];
                sumXX += data[i][0] * data[i][0];
            }

            var gradient = ((len * sumXY) - (sumX * sumY)) / ((len * sumXX) - (sumX * sumX));
            var intercept = (sumY / len) - ((gradient * sumX) / len);

            var result = [];
            for (var j = 0; j < data.length; j++) {
                var coordinate = [data[j][0], gradient * data[j][0] + intercept];
                result.push(coordinate);
            }

            return {
                points: result,
                parameter: [gradient, intercept]
            };
        },

        /**
         * If the raw data include [0,0] point, we should choose linearThroughOrigin
         *   instead of linear.
         * @param  {Array.<Array>} data  two-dimensional number array
         * @return {Object}
         */
        linearThroughOrigin: function(data) {

            var sumXX = 0;
            var sumXY = 0;

            for (var i = 0; i < data.length; i++) {
                sumXX += data[i][0] * data[i][0];
                sumXY += data[i][0] * data[i][1];
            }

            var gradient = sumXY / sumXX;
            var result = [];

            for (var j = 0; j < data.length; j++) {
                var coordinate = [data[j][0], data[j][0] * gradient];
                result.push(coordinate);
            }

            return {
                points: result,
                parameter: [gradient]
            };
        },

        /**
         * Exponential regression
         * @param  {Array.<Array.<number>>} data  two-dimensional number array
         * @return {Object}
         */
        exponential: function(data) {

            var sumX = 0;
            var sumY = 0;
            var sumXXY = 0;
            var sumYlny = 0;
            var sumXYlny = 0;
            var sumXY = 0;

            for (var i = 0; i < data.length; i++) {
                sumX += data[i][0];
                sumY += data[i][1];
                sumXY += data[i][0] * data[i][1];
                sumXXY += data[i][0] * data[i][0] * data[i][1];
                sumYlny += data[i][1] * Math.log(data[i][1]);
                sumXYlny += data[i][0] * data[i][1] * Math.log(data[i][1]);
            }

            var denominator = (sumY * sumXXY) - (sumXY * sumXY);
            var coefficient = Math.pow(Math.E, (sumXXY * sumYlny - sumXY * sumXYlny) / denominator);
            var index = (sumY * sumXYlny - sumXY * sumYlny) / denominator;
            var result = [];

            for (var j = 0; j < data.length; j++) {
                var coordinate = [data[j][0], coefficient * Math.pow(Math.E, index * data[j][0])];
                result.push(coordinate);
            }

            return {
                points: result,
                parameter: [coefficient, index]
            };

        },

        /**
         * Logarithmic regression
         * @param  {Array.<Array.<number>>} data  two-dimensional number array
         * @return {Object}
         */
        logarithmic: function(data) {

            var sumlnx = 0;
            var sumYlnx = 0;
            var sumY = 0;
            var sumlnxlnx = 0;

            for (var i = 0; i < data.length; i++) {
                sumlnx += Math.log(data[i][0]);
                sumYlnx += data[i][1] * Math.log(data[i][0]);
                sumY += data[i][1];
                sumlnxlnx += Math.pow(Math.log(data[i][0]), 2);
            }

            var gradient = (i * sumYlnx - sumY * sumlnx) / (i * sumlnxlnx - sumlnx * sumlnx);
            var intercept = (sumY - gradient * sumlnx) / i;
            var result = [];

            for (var j = 0; j < data.length; j++) {
                var coordinate = [data[j][0], gradient * Math.log(data[j][0]) + intercept];
                result.push(coordinate);
            }

            return {
                points: result,
                parameter: [gradient, intercept]
            };

        },

        /**
         * Polynomial regression
         * @param  {Array.<Array.<number>>} data  two-dimensional number array
         * @param  {number} order  order of polynomials
         * @return {Object}
         */
        polynomial: function(data, order) {

            if (typeof order === 'undefined') {
                order = 2;
            }
            //coefficient matrix
            var coeMatrix = [];
            var lhs = [];
            var k = order + 1;

            for (var i = 0; i < k; i++) {
                var sumA = 0
                for (var n = 0; n < data.length; n++) {
                    sumA += data[n][1] * Math.pow(data[n][0], i);
                }
                lhs.push(sumA);

                var temp = [];
                for (var j = 0; j < k; j++) {
                    var sumB = 0;
                    for (var m = 0; m < data.length; m++) {
                        sumB += Math.pow(data[m][0], i + j);
                    }
                    temp.push(sumB);
                }
                coeMatrix.push(temp);
            }
            coeMatrix.push(lhs);

            var coeArray = gaussianElimination(coeMatrix, k);
            var result = [];

            for (var i = 0; i < data.length; i++) {
                var value = 0
                for (var n = 0; n < coeArray.length; n++) {
                    value += coeArray[n] * Math.pow(data[i][0], n);
                }
                result.push([data[i][0], value]);
            }

            return {
                points: result,
                parameter: coeArray
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
                for (m = matrix.length - 1; m >= i; m--) {
                    matrix[m][n] -= matrix[m][i] / matrix[i][i] * matrix[i][n];
                }
            }
        }

        var data = new Array(number);
        var len = matrix.length - 1;
        for (var j = matrix.length - 2; j >= 0; j--) {
            var temp = 0;
            for (var i = j + 1; i < matrix.length －1; i++) {
                temp += matrix[i][j] * data[i];
            }
            data[j] = (matrix[len][j] - temp) / matrix[j][j];

        }

        return data;
    }

    var regression = function(regreMethod, data, order) {

        if (typeof regreMethod === 'string') {
            return regreMethods[regreMethod](data, order);
        }
    };

    return regression;

});