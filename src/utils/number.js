define(function (require) {

    /**
     * Test whether value is a number.
     * @param  {*}  value
     * @return {Boolean}
     */
    function isNumber(value) {
        return typeof value === 'number';
    }

    /**
     * Test if a number is integer.
     * @param  {number}  value
     * @return {Boolean}
     */
    function isInteger(value) {
        return isFinite(value)
        ? (value === Math.round(value))
        : false;
    }

    var number = {
        isNumber: isNumber,
        isInteger: isInteger
    };

    return number;

});