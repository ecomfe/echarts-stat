define(function (require) {

    /**
     * Test whether value is a number.
     * @param  {*}  value
     * @return {boolean}
     */
    function isNumber(value) {

        value = value === null ? NaN : +value;
        return typeof value === 'number' && !isNaN(value);
    }

    /**
     * Test if a number is integer.
     * @param  {number}  value
     * @return {boolean}
     */
    function isInteger(value) {
        return isFinite(value) && value === Math.round(value);
    }

    return {
        isNumber: isNumber,
        isInteger: isInteger
    };

});