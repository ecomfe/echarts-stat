define(function (require) {

    var array = require('./array');
    var isArray = array.isArray;
    var size = array.size;
    var number = require('./number');
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

});