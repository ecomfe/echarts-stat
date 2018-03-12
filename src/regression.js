define(function (require) {

    var dataProcess = require('./util/dataProcess');
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

});