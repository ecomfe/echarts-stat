define(function (require) {

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

});