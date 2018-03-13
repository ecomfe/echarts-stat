var dataProcess = require('./dataProcess');
var getPrecision = dataProcess.getPrecision;

/**
 * Computing range array
 * @param  {number} start
 * @param  {number} end
 * @param  {number} step
 * @return {Array.<number>}
 */
module.exports =  function (start, end, step) {

    var len = arguments.length;

    if (len < 2) {
        end = start;
        start = 0;
        step = 1;
    }
    else if (len < 3) {
        step = 1;
    }
    else {
        step = +step;
    }

    var n = Math.ceil((end - start) / step);
    var range = new Array(n + 1);
    var startPre = getPrecision(start);
    var stepPre = getPrecision(step);
    var precision = Math.max(startPre, stepPre);

    for (var i = 0; i < n + 1; i++) {
        range[i] = +((start + i * step).toFixed(precision));
    }
    return range;
};
