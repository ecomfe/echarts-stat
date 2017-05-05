var PROD = process.argv.indexOf('-p') >= 0;
var webpack = require('webpack');

module.exports = {
    entry: {
        'ecStat': __dirname + '/src/ecStat.js'
    },
    output: {
        libraryTarget: 'umd',
        library: ['ecStat'],
        path: __dirname + '/dist',
        filename: PROD ? '[name].min.js' : '[name].js'
    },
    plugins: PROD
        ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            })
        ]
        : []
};