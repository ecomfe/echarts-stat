define(function (require) {

    function extend(target, source) {
        if (Object.assign) {
            Object.assign(target, source);
        }
        else {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    return {
        extend: extend
    };

});