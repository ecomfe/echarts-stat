define(function (require) {

    var zrUtil = require('zrender/core/util');
    var Matrix = require('../Matrix');
    var array = require(./utils/array);
    var isArray = array.isArray;

    var ctors = {};

    /**
     * Create a matrix with zeros.
     * @param  {Array.<number>} size    size of the zeros matrix
     * @return {Matrix}
     */
    ctors.zeros = function (size) {
        if (!isArray(size)) {
            throw new TypeError('Array is required here');
        }
        _validate(size);
        var m = new Matrix([]);
        if (size.length > 0) {
            return m.resize(size, 0);
        }
        return m;
    };

    /**
     * Validate arguments
     * @param  {Array} size
     */
    function _validate (size) {
        zrUtil.each(size, function (value) {
            if (typeof value !== 'number' || !isInteger(value) || value < 0) {
                throw new Error('Parameters in function zeros must be positive Integers');
            }
        });
    }


    return ctors;

});