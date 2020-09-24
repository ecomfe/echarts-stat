define(function (require) {

    var dataProcess = require('./util/dataProcess');
    var dataPreprocess = dataProcess.dataPreprocess;
    var normalizeDimensions = dataProcess.normalizeDimensions;
    var arrayUtil = require('./util/array');
    var numberUtil = require('./util/number');
    var arraySize = arrayUtil.size;
    var sumOfColumn = arrayUtil.sumOfColumn;
    var arraySum = arrayUtil.sum;
    var zeros = arrayUtil.zeros;
    // var isArray = arrayUtil.isArray;
    var numberUtil = require('./util/number');
    var isNumber = numberUtil.isNumber;
    var mathPow = Math.pow;

    var OutputType = {
        /**
         * Data are all in one. Cluster info are added as an attribute of data.
         * ```ts
         * type OutputDataSingle = {
         *     // Each index of `data` is the index of the input data.
         *     data: OutputDataItem[];
         *     // The index of `centroids` is the cluster index.
         *     centroids: [ValueOnX, ValueOnY][];
         * };
         * type InputDataItem = (ValueOnX | ValueOnY | OtherValue)[];
         * type OutputDataItem = (...InputDataItem | ClusterIndex | SquareDistanceToCentroid)[];
         * ```
         */
        SINGLE: 'single',
        /**
         * Data are separated by cluster. Suitable for retrieving data form each cluster.
         * ```ts
         * type OutputDataMultiple = {
         *     // Each index of `clusterAssment` is the index of the input data.
         *     clusterAssment: [ClusterIndex, SquareDistanceToCentroid][];
         *     // The index of `centroids` is the cluster index.
         *     centroids: [ValueOnX, ValueOnY][];
         *     // The index of `pointsInCluster` is the cluster index.
         *     pointsInCluster: DataItemListInOneCluster[];
         * }
         * type DataItemListInOneCluster = InputDataItem[];
         * type InputDataItem = (ValueOnX | ValueOnY | OtherValue)[];
         * type SquareDistanceToCentroid = number;
         * type ClusterIndex = number;
         * type ValueOnX = number;
         * type ValueOnY = number;
         * type OtherValue = unknown;
         * ```
         */
        MULTIPLE: 'multiple'
    }

    /**
     * KMeans of clustering algorithm.
     * @param {Array.<Array.<number>>} data two-dimension array
     * @param {number} k the number of clusters in a dataset
     * @return {Object}
     */
    function kMeans(data, k, dataMeta) {

        // create array to assign data points to centroids, also holds SE of each point
        var clusterAssigned = zeros(data.length, 2);
        var centroids = createRandCent(k, calcExtents(data, dataMeta.dimensions));
        var clusterChanged = true;
        var minDist;
        var minIndex;
        var distIJ;
        var ptsInClust;

        while (clusterChanged) {
            clusterChanged = false;
            for (var i = 0; i < data.length; i++) {
                minDist = Infinity;
                minIndex = -1;
                for (var j = 0; j < k; j++) {
                    distIJ = distEuclid(data[i], centroids[j], dataMeta);
                    if (distIJ < minDist) {
                        minDist = distIJ;
                        minIndex = j;
                    }
                }
                if (clusterAssigned[i][0] !== minIndex) {
                    clusterChanged = true;
                }
                clusterAssigned[i][0] = minIndex;
                clusterAssigned[i][1] = minDist;
            }
            //recalculate centroids
            for (var i = 0; i < k; i++) {
                ptsInClust = [];
                for (var j = 0; j < clusterAssigned.length; j++) {
                    if (clusterAssigned[j][0] === i) {
                        ptsInClust.push(data[j]);
                    }
                }
                centroids[i] = meanInColumns(ptsInClust, dataMeta);
            }
        }

        var clusterWithKmeans = {
            centroids: centroids,
            clusterAssigned: clusterAssigned
        };
        return clusterWithKmeans;
    }

    /**
     * Calculate the average of each column in a two-dimensional array
     * and returns the values as an array.
     */
    function meanInColumns(dataList, dataMeta) {
        var meanArray = [];
        var sum;
        var mean;
        for (var j = 0; j < dataMeta.dimensions.length; j++) {
            var dimIdx = dataMeta.dimensions[j];
            sum = 0;
            for (var i = 0; i < dataList.length; i++) {
                sum += dataList[i][dimIdx];
            }
            mean = sum / dataList.length;
            meanArray.push(mean);
        }
        return meanArray;
    }

    /**
     * The combine of hierarchical clustering and k-means.
     * @param {Array} data two-dimension array.
     * @param {Object|number} [clusterCountOrConfig] config or clusterCountOrConfig.
     * @param {number} clusterCountOrConfig.clusterCount Mandatory.
     *        The number of clusters in a dataset. It has to be greater than 1.
     * @param {boolean} [clusterCountOrConfig.stepByStep=false] Optional.
     * @param {OutputType} [clusterCountOrConfig.outputType='multiple'] Optional.
     *        See `OutputType`.
     * @param {number} [clusterCountOrConfig.outputClusterIndexDimension] Mandatory.
     *        Only work in `OutputType.SINGLE`.
     * @param {number} [clusterCountOrConfig.outputCentroidDimensions] Optional.
     *        If specified, the centroid will be set to those dimensions of the result data one by one.
     *        By default not set centroid to result.
     *        Only work in `OutputType.SINGLE`.
     * @param {Array.<number>} [clusterCountOrConfig.dimensions] Optional.
     *        Target dimensions to calculate the regression.
     *        By default: use all of the data.
     * @return {Array} See `OutputType`.
     */
    function hierarchicalKMeans(data, clusterCountOrConfig, stepByStep) {
        var config = (
            isNumber(clusterCountOrConfig)
                ? {clusterCount: clusterCountOrConfig, stepByStep: stepByStep}
                : clusterCountOrConfig
        ) || {clusterCount: 2};

        var k = config.clusterCount;

        if (k < 2) {
            return;
        }

        var dataMeta = parseDataMeta(data, config);
        var isOutputTypeSingle = dataMeta.outputType === OutputType.SINGLE;

        var dataSet = dataPreprocess(data, {dimensions: dataMeta.dimensions});

        var clusterAssment = zeros(dataSet.length, 2);
        var outputSingleData;
        var setClusterIndex;
        var getClusterIndex;

        function setDistance(dataIndex, dist) {
            clusterAssment[dataIndex][1] = dist;
        }
        function getDistance(dataIndex) {
            return clusterAssment[dataIndex][1];
        };

        if (isOutputTypeSingle) {
            outputSingleData = [];
            var outputClusterIndexDimension = dataMeta.outputClusterIndexDimension;

            setClusterIndex = function (dataIndex, clusterIndex) {
                outputSingleData[dataIndex][outputClusterIndexDimension] = clusterIndex;
            };
            getClusterIndex = function (dataIndex) {
                return outputSingleData[dataIndex][outputClusterIndexDimension];
            };

            for (var i = 0; i < dataSet.length; i++) {
                outputSingleData.push(dataSet[i].slice());
                setDistance(i, 0);
                setClusterIndex(i, 0);
            }
        }
        else {
            setClusterIndex = function (dataIndex, clusterIndex) {
                clusterAssment[dataIndex][0] = clusterIndex;
            };
            getClusterIndex = function (dataIndex) {
                return clusterAssment[dataIndex][0];
            };
        }

        // initial center point.
        var centroid0 = meanInColumns(dataSet, dataMeta);
        var centList = [centroid0];
        for (var i = 0; i < dataSet.length; i++) {
            var dist = distEuclid(dataSet[i], centroid0, dataMeta);
            setDistance(i, dist);
        }

        var lowestSSE;
        var ptsInClust;
        var ptsNotClust;
        var clusterInfo;
        var sseSplit;
        var sseNotSplit;
        var index = 1;
        var result = {
            data: outputSingleData,
            centroids: centList,
            isEnd: false
        };
        if (!isOutputTypeSingle) {
            // Only for backward compat.
            result.clusterAssment = clusterAssment;
        }

        function oneStep() {
            //the existing clusters are continuously divided
            //until the number of clusters is k
            if (index < k) {
                lowestSSE = Infinity;
                var centSplit;
                var newCentroid;
                var newClusterAss;

                for (var j = 0; j < centList.length; j++) {
                    ptsInClust = [];
                    ptsNotClust = [];
                    for (var i = 0; i < dataSet.length; i++) {
                        if (getClusterIndex(i) === j) {
                            ptsInClust.push(dataSet[i]);
                        }
                        else {
                            ptsNotClust.push(getDistance(i));
                        }
                    }
                    clusterInfo = kMeans(ptsInClust, 2, dataMeta);
                    sseSplit = sumOfColumn(clusterInfo.clusterAssigned, 1);
                    sseNotSplit = arraySum(ptsNotClust);
                    if (sseSplit + sseNotSplit < lowestSSE) {
                        lowestSSE = sseNotSplit + sseSplit;
                        centSplit = j;
                        newCentroid = clusterInfo.centroids;
                        newClusterAss = clusterInfo.clusterAssigned;
                    }
                }

                for (var i = 0; i < newClusterAss.length; i++) {
                    if (newClusterAss[i][0] === 0) {
                        newClusterAss[i][0] = centSplit;
                    }
                    else if (newClusterAss[i][0] === 1) {
                        newClusterAss[i][0] = centList.length;
                    }
                }

                centList[centSplit] = newCentroid[0];
                centList.push(newCentroid[1]);
                for (var i = 0, j = 0; i < dataSet.length && j < newClusterAss.length; i++) {
                    if (getClusterIndex(i) === centSplit) {
                        setClusterIndex(i, newClusterAss[j][0]);
                        setDistance(i, newClusterAss[j++][1]);
                    }
                }

                var pointInClust = [];
                if (!isOutputTypeSingle) {
                    for (var i = 0; i < centList.length; i++) {
                        pointInClust[i] = [];
                        for (var j = 0; j < dataSet.length; j++) {
                            if (getClusterIndex(j) === i) {
                                pointInClust[i].push(dataSet[j]);
                            }
                        }
                    }
                    result.pointsInCluster = pointInClust;
                }

                index++;
            }
            else {
                result.isEnd = true;
            }
        }

        if (!config.stepByStep) {
            while (oneStep(), !result.isEnd);
        }
        else {
            result.next = function () {
                oneStep();
                setCentroidToResultData(result, dataMeta);
                return result;
            };
        }
        setCentroidToResultData(result, dataMeta);
        return result;
    }

    function setCentroidToResultData(result, dataMeta) {
        var outputCentroidDimensions = dataMeta.outputCentroidDimensions;
        if (dataMeta.outputType !== OutputType.SINGLE || outputCentroidDimensions == null) {
            return;
        }
        var outputSingleData = result.data;
        var centroids = result.centroids;

        for (var i = 0; i < outputSingleData.length; i++) {
            var line = outputSingleData[i];
            var clusterIndex = line[dataMeta.outputClusterIndexDimension];
            var centroid = centroids[clusterIndex];
            var dimLen = Math.min(centroid.length, outputCentroidDimensions.length);
            for (var j = 0; j < dimLen; j++) {
                line[outputCentroidDimensions[j]] = centroid[j];
            }
        }
    }

    /**
     * Create random centroid of kmeans.
     */
    function createRandCent(k, extents) {
        //constructs a two-dimensional array with all values 0
        var centroids = zeros(k, extents.length);
        //create random cluster centers, within bounds of each dimension
        for (var j = 0; j < extents.length; j++) {
            var extentItem = extents[j];
            for (var i = 0; i < k; i++) {
                centroids[i][j] = extentItem.min + extentItem.span * Math.random();
            }
        }
        return centroids;
    }

    /**
     * Distance method for calculating similarity
     */
    function distEuclid(dataItem, centroid, dataMeta) {
        // The distance should be normalized between different dimensions,
        // otherwise they may provide different weight in the final distance.
        // The greater weight offers more effect in the cluster determination.

        var powerSum = 0;
        var dimensions = dataMeta.dimensions;
        var extents = dataMeta.rawExtents;
        //subtract the corresponding elements in the vectors
        for (var i = 0; i < dimensions.length; i++) {
            var span = extents[i].span;
            // If span is 0, do not count.
            if (span) {
                var dimIdx = dimensions[i];
                var dist = (dataItem[dimIdx] - centroid[i]) / span;
                powerSum += mathPow(dist, 2);
            }
        }

        return powerSum;
    }

    function parseDataMeta(dataSet, config) {
        var size = arraySize(dataSet);
        if (size.length < 1) {
            throw new Error('The input data of clustering should be two-dimension array.');
        }
        var colCount = size[1];
        var defaultDimensions = [];
        for (var i = 0; i < colCount; i++) {
            defaultDimensions.push(i);
        }
        var dimensions = normalizeDimensions(config.dimensions, defaultDimensions);
        var outputType = config.outputType || OutputType.MULTIPLE;

        var outputClusterIndexDimension = config.outputClusterIndexDimension;
        if (outputType === OutputType.SINGLE && !numberUtil.isNumber(outputClusterIndexDimension)) {
            throw new Error('outputClusterIndexDimension is required as a number.');
        }
        var extents = calcExtents(dataSet, dimensions);

        return {
            dimensions: dimensions,
            rawExtents: extents,
            outputType: outputType,
            outputClusterIndexDimension: outputClusterIndexDimension,
            outputCentroidDimensions: config.outputCentroidDimensions,
        };
    }

    function calcExtents(dataSet, dimensions) {
        var extents = [];
        var dimLen = dimensions.length;
        for (var i = 0; i < dimLen; i++) {
            extents.push({ min: Infinity, max: -Infinity });
        }
        for (var i = 0; i < dataSet.length; i++) {
            var line = dataSet[i];
            for (var j = 0; j < dimLen; j++) {
                var extentItem = extents[j];
                var val = line[dimensions[j]];
                extentItem.min > val && (extentItem.min = val);
                extentItem.max < val && (extentItem.max = val);
            }
        }
        for (var i = 0; i < dimLen; i++) {
            extents[i].span = extents[i].max - extents[i].min;
        }
        return extents;
    }

    return {
        OutputType: OutputType,
        hierarchicalKMeans: hierarchicalKMeans
    };

});