define(function (require) {

    var array = require('./array');
    var isArray = array.isArray;
    var size = array.size;
    var number = require('./number');
    var isNumber = number.isNumber;


    // var globalObj = typeof window === 'undefined' ? global: window;
    // var Float64Array = typeof globalObj.Float64Array === 'undefined' ? Array : globalObj.Float64Array;

    /**
     * Data preprocessing, filter the wrong data object.
     *  for example [12,] --- missing y value
     *              [,12] --- missing x value
     *              [12, b] --- incorrect y value
     *              [a, 12] --- incorrect x value
     * @param  {Array.<Array>} data
     * @return {Array.<Array.<number>>}
     */
    function dataPreprocess (data) {

        if (!isArray(data)) {
            throw new TypeError('Invalid data type');
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
});