define(function (require) {

    var array = require(./utils/array);
    var size = array.size;
    var isArray = array.isArray;

    /**
     * Create a Matrix
     * @param {Array.<number>} data
     */
    function Matrix(data) {

        if (isArray(data)) {
            this._data = data;
            this._size = size(data);
        }
        else {
            this._data = [];
            this._size = [0];
        }
    }

    /**
     * Get a single element from the matrix.
     * @param  {Array.<number>} index zero-based index
     * @return {number}       value of the element
     */
    Matrix.prototype.get = function (index) {
        if (!isArray(index)) {
            throw new TypeError('array expected');
        }
        if (index.length != this._size.length) {
            throw new Error();
        }

        var data = this._data;
        for (var i = 0; i < index.length; i++) {
            var index_i = index[i];
            validateIndex(index_i, data.length);
            data = data[index_i];
        }
        return data;
    };

    /**
     * Resize the matrix to the given size.
     * @param  {Array.<number>} size    the new size the matrix should have.
     * @param  {number} defaultValue    Defaule value, filled in on new entries,
     *                                  if not provided, the matrix elements will
     *                                  be filled with zeros.
     *
     * @return {Matrix}                 the resized matrix.
     */
    Matrix.prototype.resize = function (size, defaultValue) {
        if (!isArray(size)) {
            throw new TypeError('array expected');
        }
        if (size.length === 0) {
            var v = this._data;
            return v;
        }
        this._size = size.slice(0);
        this._data = array.resize(this._data, this._size, defaultValue);
        return this;
    };

    /**
     * Get the primitive value of the Matrix, a multidimensional array.
     * @return {Array}
     */
    Matrix.prototype.valueof = function () {
        return this._data;
    }

    Matrix.prototype.subset = function () {

    }

    return Matrix;

});