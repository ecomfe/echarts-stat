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

    function quantityExponent(val) {
        if (val === 0) {
            return 0;
        }
        var exp = Math.floor(Math.log(val) / Math.LN10);
        // Fix pricision loss.
        if (val / Math.pow(10, exp) >= 10) {
            exp++;
        }
        return exp;
    }

    return {
        isNumber: isNumber,
        isInteger: isInteger,
        quantityExponent: quantityExponent
    };

});