define(function (require) {

    function extend(target, source) {
        if (Object.assign) {
            Object.assign(target, source);
        }
        else {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    function isObject(value) {
        const type = typeof value;
        return type === 'function' || (!!value && type === 'object');
    }

    return {
        extend: extend,
        isObject: isObject
    };

});