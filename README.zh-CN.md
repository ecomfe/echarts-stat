# ecStat

ecStat 是 [ECharts](https://github.com/ecomfe/echarts) 的统计和数据挖掘工具。你可以把它当作一个工具库直接用来处理分析数据；你也可以将其与 ECharts 结合使用，用 ECharts 可视化数据分析或处理的结果。

同时支持 Node 和浏览器中使用。

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

```js
var bins = ecStat.histogram(data, binMethod);
```

##### 参数说明

* `data` - `Array<number>`. 数值样本.

	```js
	var data = [8.6, 8.8, 10.5, 10.7, 10.8, 11.0, ... ];
	```

* `binMethod` - `string`. 直方图提供了四种计算小区间间隔个数的方法，分别是 `squareRoot`, `scott`, `freedmanDiaconis` 和 `sturges`。这里的每个小区间间隔又称为 `bin`，所有的小区间间隔组成的数组称为 `bins`。当然，对于一个直方图来说，没有所谓的最佳区间间隔个数，不同的区间间隔大小会揭示数据样本不同的数值特性。

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

##### 返回值说明

* `bins` - `Object`. 返回值包含了每一个 bin 的详细信息，以及用于绘制 [ECharts](https://github.com/ecomfe/echarts) 柱状图的数据。 
	* `bins.bins` - `Array.<Object>`. 包含所有小区间间隔的数组，其中每个区间间隔是一个对象，包含如下三个属性：
		* `x0` - `number`. 区间间隔的下界 (包含)。
		* `x1` - `number`. 区间间隔的上界 (不包含)。
		* `sample` - `Array.<number>`. 落入该区间间隔的输入样本数据。
	* `bins.data` - `Array.<Array.<number>>`. An array of bins data, each bin data is an array not only containing the mean value of `x0` and `x1`, but also the length of `sample`, which is the number of sample values in that bin.

#### 实例

 When using ECharts bar chart to draw the histogram, we must notice that, setting the `xAxis.scale` as `true`.

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var bins = ecStat.histogram(data);
var option = {
	...
	xAxis: [{
		type: 'value',
		// this must be set as true, otherwise barWidth and bins width can not corresponding on
		scale: true 
	}],
	...
}

</script>
```
![histogram](img/histogram.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xBk5VZddJW)


### 聚类

Clustering can divide the original data set into multiple data clusters with different characteristics. And through [ECharts](https://github.com/ecomfe/echarts), you can visualize the results of clustering, or visualize the process of clustering.

#### 调用方式
```
var result = ecStat.clustering.hierarchicalKMeans(data, clusterNumber, stepByStep);
```
##### 参数说明

* `data` － `two-dimensional Numeric Array`. Each data point can have more than two numeric attributes in the original data set. In the following example, `data[0]` is called `data point` and `data[0][1]` is one of the numeric attributes of `data[0]`.

  ```js
  var data = [
		[1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10],
		[11, 12, 13, 14, 15],
		...
	    ];
  ```
* `clusterNumer` － `number`. The number of clusters generated
* `stepByStep` － `boolean`. Control whether doing the clustering step by step

##### 返回值说明

* `result` － `Object`. Including the centroids, clusterAssment, and pointsInCluster. For Example:

	```js
	result.centroids = [

		[-0.460, -2.778],
		[2.934, 3.128],
	    	...
	];

	// indicate which cluster each data point belonging to, and the distance to cluster centroids
	result.clusterAssment = [

		[1, 0.145],
		[2, 0.680],
		[0, 1.022],
		...
	];

	// concrete data point in each cluster
	result.pointsInCluster = [
		[
			[0.335, -3.376],
			[-0.994, -0.884],
			...
		],
		...
	];
	```

#### 实例

You can not only do cluster analysis through this interface, but also use [ECharts](https://github.com/ecomfe/echarts) to visualize the results.

Note: the clustering algorithm can handle multiple numeric attributes, but for the convenience of visualization, two numeric attributes are chosen here as an example.

##### Directly visualize the results of clustering

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var clusterNumber = 3;
var result = ecStat.clustering.hierarchicalKMeans(data, clusterNumber, false);

</script>
```

![static clustering](img/static-clustering.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xSkBOEaGtx)

##### Visualize the process of clustering

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var clusterNumber = 6;
var result = ecStat.clustering.hierarchicalKMeans(data, clusterNumber, true);

</script>
```

![dynamic clustering](http://g.recordit.co/DTTS8d0D4O.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyr-esMtg)


### 回归

Regression algorithm can according to the value of the dependent and independent variables of the data set, fitting out a curve to reflect their trends. The regression algorithm here only supports two numeric attributes.

#### 调用方式
```
var myRegression = ecStat.regression(regressionType, data, order);
```
##### 参数说明

* `regressionType` - `string`. There are four types of regression, whice are `linear`, `exponential`, `logarithmic`, `polynomial`
* `data` - `two-dimensional Numeric Array`. Each data object should have two numeric attributes in the original data set. For Example:

	```js
	var data = [

		[1, 2],
		[3, 5],
		...
	];
	```
* `order` - `number`. The order of polynomial. If you choose other types of regression, you can ignore it

##### 返回值说明

* `myRegression` - `Object`. Including points, parameter, and expression. For Example:

	```js
	myRegression.points = [
		[1, 2],
		[3, 4],
		...
	];

	// this is the parameter of linear regression, for other types, it shoule be a little different
	myRegression.parameter = {
		gradient: 1.695,
		intercept: 3.008
	};

	myRegression.expression = 'y = 1.7x + 3.01';
	```

#### 实例

You can not only do regression analysis through this interface, you can also use [ECharts](https://github.com/ecomfe/echarts) to visualize the results.

##### Linear Regression

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var myRegression = ecStat.regression('linear', data);

</script>
```

![linear regression](img/linear.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xS1bQ2AMKe)

##### Exponential Regression

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var myRegression = ecStat.regression('exponential', data);

</script>
```

![exponential regression](img/exponential.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xHyaNv0fFe&v=5)

##### Logarithmic Regression

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var myRegression = ecStat.regression('logarithmic', data);

</script>
```

![logarithmic regression](img/logarithmic.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xry3aWkmYe)

##### Polynomial Regression

```html
<script src='https://cdn.bootcss.com/echarts/3.4.0/echarts.js'></script>
<script src='./dist/ecStat.js'></script>
<script>

var myRegression = ecStat.regression('polynomial', data, 3);

</script>
```

![polynomial regression](img/polynomial.png)

[Run](http://gallery.echartsjs.com/editor.html?c=xB16yW0MFl)



### 基本统计方法

This interface provides basic summary statistical services.

#### ecStat.statistics.deviation()

##### 调用方式
```
var sampleDeviation = ecStat.statistics.deviation(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `sampleDeviation`: `number`. Return the deviation of the numeric array *dataList*. If the *dataList* is empty or the length less than 2, return 0.


#### ecStat.statistics.sampleVariance()

##### 调用方式
```
var varianceValue = ecStat.statistics.sampleVariance(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `varianceValue`: `number`. Return the variance of the numeric array *dataList*. If the *dataList* is empty or the length less than 2, return 0. 


#### ecStat.statistics.quantile()

##### 调用方式
```
var quantileValue = ecStat.statistics.quantile(dataList, p);
```
##### 参数说明

* `dataList` : `Array.<number>`. Sorted array of numbers.
* `p`: `number`.  where 0 =< *p* <= 1. For example, the first quartile at p = 0.25, the seconed quartile at p = 0.5(same as the median), and the third quartile at p = 0.75.

##### 返回值说明

* `quantileValue`: `number`. Return the *p*-quantile of the sorted array of numbers. If p <= 0 or the length of *dataList* less than 2, return the first element of the sorted array; if p >= 1, return the last element of the sorted array; If *dataList* is empty, return 0.


#### ecStat.statistics.max()

##### 调用方式
```
var maxValue = ecStat.statistics.max(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `maxValue`: `number`. The maximum value of the *dataList*.


#### ecStat.statistics.min()

##### 调用方式
```
var minValue = ecStat.statistics.min(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `minValue`: `number`. The minimum value of the *dataList*.


#### ecStat.statistics.mean()

##### 调用方式
```
var meanValue = ecStat.statistics.mean(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `meanValue`: `number`. The average of the *dataList*.


#### ecStat.statistics.median()

##### 调用方式
```
var medianValue = ecStat.statistics.median(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`. Sorted array of numbers

##### 返回值说明

* `medianValue`: `number`. The median of the *dataList*.


#### ecStat.statistics.sum()

##### 调用方式
```
var sumValue = ecStat.statistics.sum(dataList);
```
##### 参数说明

* `dataList` : `Array.<number>`

##### 返回值说明

* `sumValue`: `number`. The sum of the *dataList*.



