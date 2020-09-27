# ecStat

A statistical and data mining tool for [Apache ECharts (incubating)](https://github.com/apache/incubator-echarts). You can use it to analyze data and then visualize the results with ECharts, or just use it to process data.

It works both in node.js and in the browser.

*Read this in other languages: [English](README.md), [简体中文](README.zh-CN.md).*

## Installing

If you use npm, you can install it with:

```sh
npm install echarts-stat
```

Otherwise, download this tool from [dist directory](https://github.com/ecomfe/echarts-stat/tree/master/dist):

```html
<script src='./dist/ecStat.js'></script>
<script>

var result = ecStat.clustering.hierarchicalKMeans(data, clusterNumber, false);

</script>
```

## API Reference

* [Histogram](#histogram)
* [Clustering](#clustering)
* [Regression](#regression)
* [Statistics](#statistic)

### Histogram

A histogram is a graphical representation of the distribution of numerical data. It is an estimate of the probability distribution of a quantitative variable. It is a kind of bar graph. To construct a histogram, the first step is to "bin" the range of values - that is, divide the entire range of values into a series of intervals - and then count how many original sample values fall into each interval. The bins are usually specified as consecutive, non-overlapping intervals of a variable. Here the bins(intervals) must be adjacent, and are of equal size.

#### Syntax

* Used as echarts transform (since echarts 5.0)
    ```js
    echarts.registerTransform(ecStat.transform.histogram);
    ```
    ```js
    chart.setOption({
        dataset: [{
            source: data
        }, {
            type: 'ecStat:histogram',
            config: config
        }],
        ...
    });
    ```
* Standalone
    ```js
    var bins = ecStat.histogram(data, config);
    // or
    var bins = ecStat.histogram(data, method);
    ```


##### Parameter

* `data` - `number[] | number[][]`. Data samples of numbers.
    ```js
    // One-dimension array
    var data = [8.6, 8.8, 10.5, 10.7, 10.8, 11.0, ... ];
    ```
    or
    ```js
    // Two-dimension array
    var data = [[8.3, 143], [8.6, 214], ...];
    ```

* `config` - `object`.
    * `config.method` - `'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'`. Optional. Methods to calculate the number of bin. There is no "best" number of bin, and different bin size can reveal different feature of data.

        * `squareRoot` - This is the default method, which is also used by Excel histogram. Returns the number of bin according to [Square-root choice](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition):
            ```js
            var bins = ecStat.histogram(data);
            ```

        * `scott` - Returns the number of bin according to [Scott's normal reference Rule](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition):
            ```js
            var bins = ecStat.histogram(data, 'scott');
            ```

        * `freedmanDiaconis` - Returns the number of bin according to [The Freedman-Diaconis rule](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition):
            ```js
            var bins = ecStat.histogram(data, 'freedmanDiaconis');
            ```

        * `sturges` - Returns the number of bin according to [Sturges' formula](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition):
            ```js
            var bins = ecStat.histogram(data, 'sturges');
            ```

    * `config.dimensions` - `(number | string)`. Optional. Specify the dimensions of data that are used to regression calculation. By default `0`, which means the column 0 and 1 is used in the regression calculation. In echarts transform usage, both dimension name (`string`) and dimension index (`number`) can be specified. In standalone usage, only dimension index can be specified (not able to define dimension name).


##### Return Value (only for standalone usage)

* Used as echarts transform (since echarts 5.0)
    ```js
    dataset: [{
        source: [...]
    }, {
        transform: 'ecStat:histogram'
        // // The result data of this dataset is like:
        // [
        //     // MeanOfV0V1, VCount, V0, V1, DisplayableName
        //     [  10,         212           8,  12, '8 - 12'],
        //     ...
        // ]
        // // The rest of the input dimensions that other than
        // // config.dimensions specified are kept in the output.
    }]
    ```
* Standalone
    * `result` - `object`. Contain detailed messages of each bin and data used for [ECharts](https://github.com/ecomfe/echarts) to draw the histogram.
        * `result.bins` - `BinItem[]`. An array of bins, where each bin is an object (`BinItem`), containing three attributes:
            * `x0` - `number`. The lower bound of the bin (inclusive).
            * `x1` - `number`. The upper bound of the bin (exclusive).
            * `sample` - `number[]`. Containing the associated elements from the input data.
        * `result.data` - `[MeanOfV0V1, VCount, V0, V1, DisplayableName][]`. Used for bar chart to draw the histogram, where the length of `sample` is the number of sample values in this bin. For example:
            ```js
            var bins.data = [
                // MeanOfV0V1, VCount, V0, V1, DisplayableName
                [  10,         212,          8,  12, '8 - 12'],
                ...
            ];
            // The rest of the input dimensions that other than
            // config.dimensions specified are kept in the output.
            ```
        * `result.customData` - `[V0, V1, VCount][]`. Used for custom chart to draw the histogram, where the length of `sample` is the number of sample values in this bin.

#### Examples

[test/transform/histogram_bar.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/histogram_bar.html)

[test/standalone/histogram_bar.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/histogram_bar.html)


![histogram](img/histogram.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xBk5VZddJW)


### Clustering

Clustering can divide the original data set into multiple data clusters with different characteristics. And through [ECharts](https://github.com/ecomfe/echarts), you can visualize the results of clustering, or visualize the process of clustering.

#### Syntax


* Used as echarts transform (since echarts 5.0)
    ```js
    echarts.registerTransform(ecStat.transform.clustering);
    ```
    ```js
    chart.setOption({
        dataset: [{
            source: data
        }, {
            type: 'ecStat:clustering',
            config: config
        }],
        ...
    });
    ```
* Standalone
    ```js
    var result = ecStat.clustering.hierarchicalKMeans(data, config);
    // or
    var result = ecStat.clustering.hierarchicalKMeans(data, clusterCount, stepByStep);
    ```

##### Parameter

* `data` － `number[][]`. Two-dimensional numeric array, each data point can have more than two numeric attributes in the original data set. In the following example, `data[0]` is called `data point` and `data[0][1]` is one of the numeric attributes of `data[0]`.

    ```js
    var data = [
        [232, 4.21, 51, 0.323, 19],
        [321, 1.62, 18, 0.139, 10],
        [551, 11.21, 13, 0.641, 15],
        ...
    ];
    ```

* `config` - `object`.
    * `config.clusterCount` － `number`. Mandatory. The number of clusters generated. **Note that it must be greater than 1.**
    * `config.dimensions` - `(number | string)[]`. Optional. Specify which dimensions (columns) of data will be used to clustering calculation. The other columns will also be kept in the output data. By default all of the columns of the data will be used as dimensions. In echarts transform usage, both dimension name (`string`) and dimension index (`number`) can be specified. In standalone usage, only dimension index can be specified (not able to define dimension name).
    * `config.stepByStep` － `boolean`. Optional. Control whether doing the clustering step by step. By default `false`.
    * `config.outputType` - `'single' | 'multiple'`. Optional. Specify the format of the output. In "standalone" usage, it is by default `'multiple'`. In "transform" usage, it can not be specified, always be `'single'`.
    * `config.outputClusterIndexDimension` - `(number | {index: number, name?: string})`. Mandatory. It only works in `config.outputType: 'single'`. In this mode, the cluster index will be written to that dimension index of the output data. If be a `number`, it means dimension index. Dimension index is mandatory, while dimension name is optional, which only enables the downstream refer this dimension by name.
    * `config.outputCentroidDimensions` - `(number | {index: number, name?: string})[]` Optional. It only works in `config.outputType: 'single'`. If specify, the cluster centroid will be written to those dimensions of the result data. By default the centroids will not be written to the result data. If be a `number`, it means dimension index. Dimension index is mandatory, while dimension name is optional, which only enables the downstream refer this dimension by name.

##### Return Value

For example, the input data is:
```js
var data = [
    // dimensions:
    // 0    1      2    3      4
    [ 232,  4.21,  51,  0.323, 'xxx'],
    [ 321,  1.62,  18,  0.139, 'xzx'],
    [ 551,  11.21, 13,  0.641, 'yzy'],
    ...
];
```
And we specify the `config` as:
```js
config = {
    dimensions: [2, 3],
    outputClusterIndexDimension: 5
}
```
The result will be:

* Used as echarts transform (since echarts 5.0)
    ```js
    dataset: [{
        source: [ ... ],
    }, {
        transform: 'ecStat:clustering',
        config: {
            clusterCount: 6,
            outputClusterIndexDimension: 5,
            outputCentroidDimensions: [6, 7]
        }
        // The result data of this dataset will be:
        // [
        //    // dim2, dim3 are used in clustering.
        //    // All of the input data are kept in the output.
        //    // dim5 is the output cluster index.
        //    // dim6 is the output distance value.
        //    // dimensions:
        //    // 0    1      2    3       4       5   6   7
        //    [ 232,  4.21,  51,  0.323,  'xxx',  0,  14, 0.145 ],
        //    [ 321,  1.62,  18,  0.139,  'xzx',  2,  24, 0.321 ],
        //    [ 551,  11.21, 13,  0.641,  'yzy',  0,  14, 0.145 ],
        //    ...
        // ]
    }, {
        fromDatasetIndex: 1,
        fromTransformResult: 1
        // The result data of this dataset will be:
        // centroids: [
        //     // center of cluster0
        //     [14, 0.145],
        //     // center of cluster1
        //     [24, 0.321],
        //     ...
        // ]
    }]
    ```
* Standalone
    * `outputType: 'single'`:
        * `result` - `object`. For example:
            ```js
            result = {
                data: [
                    // dim2, dim3 are used in clustering.
                    // All of the input data are kept in the output.
                    // dim5 is the output cluster index.
                    // dim6 is the output distance value.
                    // dimensions:
                    // 0    1      2    3      4      5  6
                    [ 232,  4.21,  51,  0.323, 'xxx', 0, 89 ],
                    [ 321,  1.62,  18,  0.139, 'xzx', 2, 23 ],
                    [ 551,  11.21, 13,  0.641, 'yzy', 0, ?? ],
                    ...
                ],
                centroids: [
                    // center of cluster0
                    [14, 0.145],
                    // center of cluster1
                    [24, 0.321],
                    ...
                ]
            }
            ```
    * `outputType: 'multiple'`:
        * `result` － `object`. Including the centroids, and pointsInCluster. For example:
            ```js
            result = {
                pointsInCluster: [
                    // points in cluster0
                    [
                        [ 232,  4.21,  51,  0.323, 'xxx' ],
                        [ 551,  11.21, 13,  0.641, 'yzy' ],
                        ...
                    ],
                    // points in cluster1
                    [
                        [ 321,  1.62,  18,  0.139, 'xzx' ],
                        ...
                    ],
                    ...
                ],
                centroids: [
                    // center of cluster0
                    [14, 0.145],
                    // center of cluster1
                    [24, 0.321],
                    ...
                ]
            };
            ```

#### Examples

You can not only do cluster analysis through this interface, but also use [ECharts](https://github.com/ecomfe/echarts) to visualize the results.

**Note: the clustering algorithm can handle multiple numeric attributes, but for the convenience of visualization, two numeric attributes are chosen here as an example.**

##### Directly visualize the final results of clustering

[test/transform/clustering_bikmeans.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/clustering_bikmeans.html)

[test/standalone/clustering_bikmeans.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/clustering_bikmeans.html)

![static clustering](img/static-clustering.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xSkBOEaGtx)

##### Visualize the process of clustering

[test/standalone/clustering_animation.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/clustering_animation.html)

![dynamic clustering](http://g.recordit.co/DTTS8d0D4O.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyr-esMtg)


### Regression

Regression algorithm can according to the value of the dependent and independent variables of the data set, fitting out a curve to reflect their trends. The regression algorithm here only supports two numeric attributes.

#### Syntax

* Used as echarts transform (since echarts 5.0)
    ```js
    echarts.registerTransform(ecStat.transform.regression);
    ```
    ```js
    chart.setOption({
        dataset: [{
            source: data
        }, {
            type: 'ecStat:regression',
            config: {
                method: regressionType,
                ...opt
            }
        }],
        ...
    });
    ```
* Standalone
    ```js
    var myRegression = ecStat.regression(regressionType, data, opt);
    // or
    var myRegression = ecStat.regression('polynomial', data, order);
    ```

##### Parameters

* `regressionType` - `string`. Mandatory. There are four types of regression, which are `'linear'`, `'exponential'`, `'logarithmic'`, `'polynomial'`.
* `data` - `number[][]`. Two-dimensional numeric array, Each data object should have two numeric attributes in the original data set. For Example:
    ```js
    var data = [
        [1, 2],
        [3, 5],
        ...
    ];
    ```
* `opt` - `object`.
    * `opt.dimensions` - `(number | string)[] | (number | string)`. Optional. Specify the dimensions of data that are used to regression calculation. By default `[0, 1]`, which means the column 0 and 1 is used in the regression calculation. In echarts transform usage, both dimension name (`string`) and dimension index (`number`) can be specified. In standalone usage, only dimension index can be specified (not able to define dimension name).
    * `opt.order` - `number`. Optional. By default `2`. The order of polynomial. If you choose other types of regression, you can ignore it.

##### Return Value (only for standalone usage)

* Used as echarts transform (since echarts 5.0)
    ```js
    dataset: [{
        source: [...]
    }, {
        transform: 'ecStat:regression',
        // // The result of this dataset is like:
        // [
        //     // ValueOnX, ValueOnY
        //     [  23,       51      ],
        //     [  24,       62      ],
        //     ...
        // ]
        // // The rest of the input dimensions that other than
        // // config.dimensions specified are kept in the output.
    }]
    ```
* Standalone
    * `myRegression` - `object`. Including points, parameter, and expression. For Example:

        ```js
        myRegression.points = [
            // ValueOnX, ValueOnY
            [  23,       51      ],
            [  24,       62      ],
            ...
        ];
        // The rest of the input dimensions that other than
        // config.dimensions specified are kept in the output.

        // This is the parameter of linear regression,
        // for other types, it should be a little different
        myRegression.parameter = {
            gradient: 1.695,
            intercept: 3.008
        };

        myRegression.expression = 'y = 1.7x + 3.01';
        ```

#### Examples

You can not only do regression analysis through this interface, you can also use [ECharts](https://github.com/ecomfe/echarts) to visualize the results.

##### Linear Regression

[test/transform/regression_linear.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_linear.html)

[test/standalone/regression_linear.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_linear.html)

![linear regression](img/linear.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xS1bQ2AMKe)

##### Exponential Regression

[test/transform/regression_exponential.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_exponential.html)

[test/standalone/regression_exponential.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_exponential.html)

![exponential regression](img/exponential.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyaNv0fFe&v=5)

##### Logarithmic Regression

[test/transform/regression_logarithmic.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_logarithmic.html)

[test/standalone/regression_logarithmic.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_logarithmic.html)

![logarithmic regression](img/logarithmic.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xry3aWkmYe)

##### Polynomial Regression

[test/transform/regression_polynomial.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_polynomial.html)

[test/standalone/regression_polynomial.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_polynomial.html)

![polynomial regression](img/polynomial.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xB16yW0MFl)



### Statistics

This interface provides basic summary statistical services.

#### ecStat.statistics.deviation()

##### Syntax
```js
var sampleDeviation = ecStat.statistics.deviation(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `sampleDeviation`: `number`. Return the deviation of the numeric array *dataList*. If the *dataList* is empty or the length less than 2, return 0.


#### ecStat.statistics.sampleVariance()

##### Syntax
```js
var varianceValue = ecStat.statistics.sampleVariance(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `varianceValue`: `number`. Return the variance of the numeric array *dataList*. If the *dataList* is empty or the length less than 2, return 0.


#### ecStat.statistics.quantile()

##### Syntax
```js
var quantileValue = ecStat.statistics.quantile(dataList, p);
```
##### Parameter

* `dataList` : `number[]`. Sorted array of numbers.
* `p`: `number`.  where 0 =< *p* <= 1. For example, the first quartile at p = 0.25, the seconed quartile at p = 0.5(same as the median), and the third quartile at p = 0.75.

##### Return Value

* `quantileValue`: `number`. Return the quantile of the sorted array of numbers. If p <= 0 or the length of *dataList* less than 2, return the first element of the sorted array *dataList*; if p >= 1, return the last element of the sorted array *dataList*; If *dataList* is empty, return 0.


#### ecStat.statistics.max()

##### Syntax
```js
var maxValue = ecStat.statistics.max(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `maxValue`: `number`. The maximum value of the *dataList*.


#### ecStat.statistics.min()

##### Syntax
```js
var minValue = ecStat.statistics.min(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `minValue`: `number`. The minimum value of the *dataList*.


#### ecStat.statistics.mean()

##### Syntax
```js
var meanValue = ecStat.statistics.mean(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `meanValue`: `number`. The average of the *dataList*.


#### ecStat.statistics.median()

##### Syntax
```js
var medianValue = ecStat.statistics.median(dataList);
```
##### Parameter

* `dataList` : `number[]`. Sorted array of numbers

##### Return Value

* `medianValue`: `number`. The median of the *dataList*.


#### ecStat.statistics.sum()

##### Syntax
```js
var sumValue = ecStat.statistics.sum(dataList);
```
##### Parameter

* `dataList` : `number[]`

##### Return Value

* `sumValue`: `number`. The sum of the *dataList*.

