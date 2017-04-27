define(function (require) {

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

    function ascending(a, b) {

        return a > b ? 1 : a < b ? -1 : a === b ? 0 : NaN;

    }


    return {
        size: size,
        isArray: isArray,
        zeros: zeros,
        sum: sum,
        sumOfColumn: sumOfColumn,
        ascending: ascending
    };

});