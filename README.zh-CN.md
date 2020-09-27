# ecStat

ecStat 是 [Apache ECharts (incubating)](https://github.com/apache/incubator-echarts) 的统计和数据挖掘工具。你可以把它当作一个工具库直接用来分析数据；你也可以将其与 ECharts 结合使用，用 ECharts 可视化数据分析的结果。

同时支持 Node 和浏览器中使用。

*其他语言版本: [English](README.md), [简体中文](README.zh-CN.md).*

## 安装

如果你使用 npm ，直接运行下面的命令:

```sh
 npm install echarts-stat
```

或者， 从 [dist](https://github.com/ecomfe/echarts-stat/tree/master/dist) 目录直接下载引用:

```html
<script src='./dist/ecStat.js'></script>
<script>

var result = ecStat.clustering.hierarchicalKMeans(data, clusterNumber, false);

</script>
```

## API

* [直方图](#histogram)
* [聚类](#clustering)
* [回归](#regression)
* [基本统计方法](#statistic)

### 直方图

直方图主要用来可视化数值型数据的分布情况。用以直观判断数值型数据的概率分布，是一种特殊类型的柱状图。构建直方图的第一步是将总的数值区间切割成一个个小的区间间隔，然后统计落入每个区间间隔中的数值样本个数，并且每个小区间间隔都是连续的、大小相等的、相互不重叠的，即 [[x0, x1), [x1, x2), [x2, x3]]。

#### 调用方式

* 作为 echarts transform 使用（echarts 5.0 开始支持）
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
* 独立使用
    ```js
    var bins = ecStat.histogram(data, config);
    ```

##### 参数说明

* `data` - `number[] | number[][]`. 数值样本.
    ```js
    // 一维数组
    var data = [8.6, 8.8, 10.5, 10.7, 10.8, 11.0, ... ];
    ```
    or
    ```js
    // 二维数组
    var data = [[8.3, 143], [8.6, 214], ...];
    ```

* `config` - `object`.
    * `method` - `string`. 可选参数。直方图提供了四种计算小区间间隔个数的方法，分别是 `squareRoot`, `scott`, `freedmanDiaconis` 和 `sturges`。这里的每个小区间间隔又称为 `bin`，所有的小区间间隔组成的数组称为 `bins`。当然，对于一个直方图来说，没有所谓的最佳区间间隔个数，不同的区间间隔大小会揭示数据样本不同的数值特性。

        * `squareRoot` - 默认方法，Excel 的直方图中也是使用这个方法计算 `bins`。依照 [Square-root choice](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition) 返回 bin 的个数:
            ```js
            var bins = ecStat.histogram(data);
            ```

        * `scott` - 依照 [Scott's normal reference Rule](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition) 返回 bin 的个数:
            ```js
            var bins = ecStat.histogram(data, 'scott');
            ```

        * `freedmanDiaconis` - 依照 [The Freedman-Diaconis rule](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition) 返回 bin 的个数:
            ```js
            var bins = ecStat.histogram(data, 'freedmanDiaconis');
            ```

        * `sturges` - 依照 [Sturges' formula](https://en.wikipedia.org/wiki/Histogram#Mathematical_definition) 返回 bin 的个数:
            ```js
            var bins = ecStat.histogram(data, 'sturges');
            ```

    * `config.dimensions` - `(number | string)`. 可选参数。指定数据的哪些维度会被用于回归计算。默认为 `0`。在“echarts transform”模式下，维度名（`string`）和维度序数（`number`）都可被指定。在“独立使用”模式下，只有维度序数可被指定（因为此模式下并没有支持定义维度名）。


##### 返回值说明


* 作为 echarts transform 使用（echarts 5.0 开始支持）
    ```js
    dataset: [{
        source: [...]
    }, {
        transform: 'ecStat:histogram'
        // // 本 dataset 中得到的结果数据如：
        // [
        //     // MeanOfV0V1, VCount, V0, V1, DisplayableName
        //     [  10,         212,          8,  12, '8 - 12'],
        //     ...
        // ]
        // // config.dimensions 之外的其他维度的数据
        // // 也会保留在结果中。
    }]
    ```
* 独立使用
    * `bins` - `object`. 返回值包含了每一个 bin 的详细信息，以及用 [ECharts](https://github.com/ecomfe/echarts) 绘制直方图所需要的数据信息。
        * `bins.bins` - `BinItem[]`. 包含所有小区间间隔的数组，其中每个区间间隔是一个对象 (`BinItem`)，包含如下三个属性：
            * `x0` - `number`. 区间间隔的下界 (包含)。
            * `x1` - `number`. 区间间隔的上界 (不包含)。
            * `sample` - `number[]`. 落入该区间间隔的原始输入样本数据。
        * `bins.data` - `[MeanOfV0V1, VCount, V0, V1, DisplayableName][]`. 用 ECharts 柱状图绘制直方图所需要的数据信息。这是一个二维数据，其中每个数据项是一个一维数组。该一维数组包含了 x0 和 x1 的均值，以及上述 sample 数组的长度，示例如下：
            ```js
            var bins.data = [
                // MeanOfV0V1, VCount, V0, V1, DisplayableName
                [  10,         212,          8,  12, '8 - 12'],
                ...
            ];
            // config.dimensions 之外的其他维度的数据
            // 也会保留在结果中。
            ```
        * `bins.customData` - `[V0, V1, VCount][]`. 用 ECharts 自定义图表绘制直方图所需要的数据信息。这是一个二维数据，其中每个数据项是一个一维数组。该一维数组包含了 x0 和 x1，以及上述 sample 数组的长度，示例如下：
            ```js
            var bins.customData = [
                [x0_0, x1_0, len_0],
                ...
            ];
            ```

#### 实例

[test/transform/histogram_bar.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/histogram_bar.html)
[test/standalone/histogram_bar.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/histogram_bar.html)

![histogram](img/histogram.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xBk5VZddJW)


### 聚类

聚类可以将原始输入数据分割成多个具有不同特征的数据簇。并且通过 [ECharts](https://github.com/ecomfe/echarts) 既可以可视化聚类的结果，也可以可视化聚类的分割过程。

#### 调用方式


* 作为 echarts transform 使用（echarts 5.0 开始支持）
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
* 独立使用
    ```js
    var result = ecStat.clustering.hierarchicalKMeans(data, config);
    // or
    var result = ecStat.clustering.hierarchicalKMeans(data, clusterCount, stepByStep);
    ```

##### 参数说明

* `data` － `number[][]`. 这是一个二维数组，其中每个数据对象是具有多个数值属性的一维数组。如下，`data[0]` 就是一个数据对象，`data[0][1]` 是该数据对象的一个数值属性。
    ```js
    var data = [
        [232, 4.21, 51, 0.323, 19],
        [321, 1.62, 18, 0.139, 10],
        [551, 11.21, 13, 0.641, 15],
        ...
        ];
    ```
* `config` - `object`.
    * `config.clusterCount` － `number`. 必填参数。要生成的数据簇的个数。 **注意，该数值必须大于 1。**
    * `config.dimensions` - `(number | string)[]`. 可选参数。指定哪些维度（即，列）要被用于聚类的计算。没有被用于计算的其他维度的值也会被拷贝到结果中。默认所有维度都会被用用于计算。在“echarts transform”模式下，维度名（`string`）和维度序数（`number`）都可被指定。在“独立使用”模式下，只有维度序数可被指定（因为此模式下并没有支持定义维度名）。
    * `config.stepByStep` － `boolean`. 可选参数。该参数主要用于可视化聚类算法每一步的分割过程，即动态地展示数据簇如何从 2 个到 3 个，4 个， .... 。默认为 `false`。
    * `config.outputType` - `'single' | 'multiple'`. 可选参数。指定输出格式。在“独立使用”中，它默认为`'multiple'`。在“transform”中，它不能被指定，总为`'single'`模式。
    * `config.outputClusterIndexDimension` - `(number | {index: number, name?: string})`. 必填参数。簇的索引（clusterIndex）将被写入这列。此设定只在 `config.outputType: 'single'` 时生效。如果只给一个 `number`，则表示 dimension index 。 dimension index 是必须给出的，但是 dimension name 是可选的，只用于后续的 dataset 能用 name 来引用。
    * `config.outputCentroidDimensions` - `(number | {index: number, name?: string})` 可选参数。此设定只在 `config.outputType: 'single'` 时生效。如果指定，会把每蔟的中心写入 `result.data` 指定的维度中。默认每蔟的中心不会被写入 `result.data` 中。如果只给一个 `number`，则表示 dimension index 。 dimension index 是必须给出的，但是 dimension name 是可选的，只用于后续的 dataset 能用 name 来引用。


##### 返回值说明

例如，输入数据是：
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
然后我们指定的 `config` 是：
```js
config = {
    dimensions: [2, 3],
    outputClusterIndexDimension: 5
}
```
则结果是：


* 作为 echarts transform 使用（echarts 5.0 开始支持）
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
        // 本 dataset 得到的结果数据是例如：
        // [
        //    // dim2, dim3 被用于聚类计算。
        //    // 所有其他列被保留在结果数据中。
        //    // dim5 是计算得到的 cluster index 。
        //    // dim6 是计算得到的距离值。
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
        // 本 dataset 得到的结果数据是例如：
        // centroids: [
        //     // cluster0 的中心点数据。
        //     [14, 0.145],
        //     // cluster1 的中心点数据。
        //     [24, 0.321],
        //     ...
        // ]
    }]
    ```
* 独立使用
    * `outputType: 'single'`:
        * `result` - `object`. 例如
            ```js
            result = {
                data: [
                    // dim2, dim3 被用于聚类计算。
                    // 所有其他列被保留在结果数据中。
                    // dim5 是计算得到的 cluster index 。
                    // dim6 是计算得到的 squared distance 。
                    // dimensions:
                    // 0    1      2    3      4      5  6
                    [ 232,  4.21,  51,  0.323, 'xxx', 0, 89 ],
                    [ 321,  1.62,  18,  0.139, 'xzx', 2, 23 ],
                    [ 551,  11.21, 13,  0.641, 'yzy', 0, ?? ],
                    ...
                ],
                centroids: [
                    // cluster0 的中心。
                    [14, 0.145],
                    // cluster1 的中心。
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
                    // cluster0 中的数据项
                    [
                        [ 232,  4.21,  51,  0.323, 'xxx' ],
                        [ 551,  11.21, 13,  0.641, 'yzy' ],
                        ...
                    ],
                    // cluster1 中的数据项
                    [
                        [ 321,  1.62,  18,  0.139, 'xzx' ],
                        ...
                    ],
                    ...
                ],
                centroids: [
                    // cluster0 的中心。
                    [14, 0.145],
                    // cluster1 的中心。
                    [24, 0.321],
                    ...
                ]
            };
            ```

#### 实例

调用该接口不仅可以做聚类分析，还可以将聚类的结果用 [ECharts](https://github.com/ecomfe/echarts) 展现出来。

**注意：聚类算法可以处理具有多个数值属性的一组数据对象，这里为了可视化的方便，我们以具有两个数值属性的数据对象为例。**

##### 直接可视化聚类算法的最终结果

[test/transform/clustering_bikmeans.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/clustering_bikmeans.html)
[test/standalone/clustering_bikmeans.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/clustering_bikmeans.html)


![static clustering](img/static-clustering.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xSkBOEaGtx)

##### 可视化聚类的过程

[test/standalone/clustering_animation.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/clustering_animation.html)

![dynamic clustering](http://g.recordit.co/DTTS8d0D4O.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyr-esMtg)


### 回归

回归算法根据原始输入数据集中自变量和因变量的值拟合出一条曲线，以反映它们的变化趋势。目前只支持单个自变量的回归算法。

#### 调用方式

* 作为 echarts transform 使用（echarts 5.0 开始支持）
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
* 独立使用
    ```js
    var myRegression = ecStat.regression(regressionType, data, opt);
    // or
    var myRegression = ecStat.regression('polynomial', data, order);
    ```

##### 参数说明

* `regressionType` - `string`. 必填参数。回归类型，提供了四种类型的回归算法，分别是 `'linear'`, `'exponential'`, `'logarithmic'`, `'polynomial'`。
* `data` - `number[][]`. 原始的输入数据是一个二维的数值数组，其中每个数据对象是包含两个数值属性的一维数组，分别表示自变量和因变量的值。如下：
    ```js
    var data = [
        [1, 2],
        [3, 5],
        ...
    ];
    ```
* `opt` - `object`.
    * `opt.dimensions` - `(number | string)[]`. 可选参数。指定数据的哪些维度会被用于回归计算。默认为 `[0, 1]`。在“echarts transform”模式下，维度名（`string`）和维度序数（`number`）都可被指定。在“独立使用”模式下，只有维度序数可被指定（因为此模式下并没有支持定义维度名）。
    * `order` - `number`. 可选参数。默认为 `2`。多项式的阶数（只在 `'polynomial'` 中生效）。对于非多项式回归，可以忽略该参数。

##### 返回值说明

* 作为 echarts transform 使用（echarts 5.0 开始支持）
    ```js
    dataset: [{
        source: [...]
    }, {
        transform: 'ecStat:regression',
        // // 本 dataset 得到的结果数据例如：
        // [
        //     // ValueOnX, ValueOnY
        //     [  23,       51      ],
        //     [  24,       62      ],
        //     ...
        // ]
        // // config.dimensions 之外的其他维度的数据
        // // 也会保留在结果中。
    }]
    ```
* 独立使用
    * `myRegression` - `object`. 包括用于绘制折线图的拟合数据点 `points`，回归曲线的参数 `parameter`，以及拟合出的曲线表达式 `expression`。如下：

        ```js
        myRegression.points = [
            // ValueOnX, ValueOnY
            [  23,       51      ],
            [  24,       62      ],
            ...
        ];
        // config.dimensions 之外的其他维度的数据
        // 也会保留在结果中。

        // this is the parameter of linear regression,
        // for other types, it shoule be a little different
        myRegression.parameter = {
            gradient: 1.695,
            intercept: 3.008
        };

        myRegression.expression = 'y = 1.7x + 3.01';
        ```

#### 实例

不仅可以调用该接口做回归分析，还可以将分析的结果用 [ECharts](https://github.com/ecomfe/echarts) 展现出来。

##### 线性回归

[test/transform/regression_linear.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_linear.html)
[test/standalone/regression_linear.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_linear.html)

![linear regression](img/linear.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xS1bQ2AMKe)

##### 指数回归

[test/transform/regression_exponential.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_exponential.html)
[test/standalone/regression_exponential.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_exponential.html)

![exponential regression](img/exponential.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyaNv0fFe&v=5)

##### 对数回归

[test/transform/regression_logarithmic.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_logarithmic.html)
[test/standalone/regression_logarithmic.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_logarithmic.html)

![logarithmic regression](img/logarithmic.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xry3aWkmYe)

##### 多项式回归

[test/transform/regression_polynomial.html](https://github.com/ecomfe/echarts-stat/blob/master/test/transform/regression_polynomial.html)
[test/standalone/regression_polynomial.html](https://github.com/ecomfe/echarts-stat/blob/master/test/standalone/regression_polynomial.html)

![polynomial regression](img/polynomial.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xB16yW0MFl)



### 基本统计方法

这些接口提供了基本汇总统计功能。

#### ecStat.statistics.deviation()

##### 调用方式
```js
var sampleDeviation = ecStat.statistics.deviation(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `sampleDeviation`: `number`. 返回输入数组 *dataList* 的标准差。如果 *dataList* 为空或者长度小于 2，返回 0.


#### ecStat.statistics.sampleVariance()

##### 调用方式
```js
var varianceValue = ecStat.statistics.sampleVariance(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `varianceValue`: `number`. 返回输入数组 *dataList* 的样本方差。如果 *dataList* 为空或者长度小于 2，返回 0.


#### ecStat.statistics.quantile()

##### 调用方式
```js
var quantileValue = ecStat.statistics.quantile(dataList, p);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值数组，该数组必须是按从小到大有序排列的.
* `p`: `number`. 分位数，取值在 [0, 1] 之间. 例如, 第一四分位数对应的 p 值是 0.25；第二四分位数，也就是中位数，对应的 p 值是 0.5；第三四分位数对应的 p 值是 0.75.

##### 返回值说明

* `quantileValue`: `number`. 计算得到的分位数值。如果输入的 *p* 值小于等于 0 或者 *dataList* 的长度小于2，则返回有序数组 *dataList* 的第一个值；如果输入的 *p* 值大于等于1，则返回有序数组 *dataList* 的最后一个值；如果输入的有序数组 *dataList* 为空，则返回 0.


#### ecStat.statistics.max()

##### 调用方式
```js
var maxValue = ecStat.statistics.max(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `maxValue`: `number`. 返回输入数组 *dataList* 的最大值。


#### ecStat.statistics.min()

##### 调用方式
```js
var minValue = ecStat.statistics.min(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `minValue`: `number`. 返回输入数组 *dataList* 的最小值。


#### ecStat.statistics.mean()

##### 调用方式
```js
var meanValue = ecStat.statistics.mean(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `meanValue`: `number`. 返回输入数组 *dataList* 的平均值。


#### ecStat.statistics.median()

##### 调用方式
```js
var medianValue = ecStat.statistics.median(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值数组，该数组必须是按从小到大有序排列的.

##### 返回值说明

* `medianValue`: `number`. 返回输入数组 *dataList* 的中位数。


#### ecStat.statistics.sum()

##### 调用方式
```js
var sumValue = ecStat.statistics.sum(dataList);
```
##### 参数说明

* `dataList` : `number[]`. 输入的数值样本集。

##### 返回值说明

* `sumValue`: `number`. 返回输入数组 *dataList* 的求和结果。



