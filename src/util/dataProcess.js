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
     * @param  {Object?} [opt]
     * @param  {Array.<number>|number} [opt.numberDimensions] Optional. Like [2, 4],
     *         means that dimension index 2 and dimension index 4 need to be number.
     *         If null/undefined (by default), all dimensions need to be number.
     * @param  {boolean} [opt.toOneDimensionArray] Convert to one dimension array.
     *         Each value is from `opt.numberDimensions[0]` or dimension 0.
     * @return {Array.<Array.<number>>}
     */
    function dataPreprocess(data, opt) {
        opt = opt || {};
        var numberDimensions = opt.numberDimensions;
        var numberDimensionMap = {};
        if (typeof numberDimensions === 'number') {
            numberDimensions = [numberDimensions];
        }
        if (numberDimensions != null) {
            for (var i = 0; i < numberDimensions.length; i++) {
                numberDimensionMap[numberDimensions[i]] = true;
            }
        }
        var targetOneDim = opt.toOneDimensionArray
            ? (numberDimensions ? numberDimensions[0] : 0)
            : null;

        function shouldBeNumberDimension(dimIdx) {
            return !numberDimensions || numberDimensionMap.hasOwnProperty(dimIdx);
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
        dataPreprocess: dataPreprocess,
        getPrecision: getPrecision
    };

});