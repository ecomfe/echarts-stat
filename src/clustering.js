define(function (require) {

    var array = require('./utils/array');
    var arraySize = array.size;
    var sumInColumn = array.sumInColumn;
    var arraySum = array.sum;
    var zeros = array.zeros;
    var isArray = array.isArray;
    var mathSqrt = Math.sqrt;
    var mathPow = Math.pow;

    /**
     * KMeans of clustering algorithm
     * @param  {Array.<number>} dataSet    two-dimension array
     * @param  {number} k   the number of clusters in a dataset
     * @return {Object}
     */
    function kMeans(dataSet, k) {
        var size = arraySize(dataSet);
        // create array to assign data points to centroids, also holds SE of each point
        var clusterAssigned = zeros(size[0], 2);
        var centroids = createRandCent(dataSet, k);
        var clusterChanged = true;
        var minDist;
        var minIndex;
        var distIJ;
        var ptsInClust;
        while (clusterChanged) {
            clusterChanged = false;
            for (var i = 0; i < size[0]; i++) {
                minDist = Infinity;
                minIndex = -1;
                for (var j = 0; j < k; j++) {
                    distIJ = distEclud(dataSet[i], centroids[j]);
                    if (distIJ < minDist) {
                        minDist = distIJ;
                        minIndex = j;
                    }
                }
                if (clusterAssigned[i][0] !== minIndex) {
                    clusterChanged = true;
                }
                clusterAssigned[i][0] = minIndex;
                clusterAssigned[i][1] = mathPow(minDist, 2);
            }
            //recalculate centroids
            for (var i = 0; i < k; i++) {
                ptsInClust = [];
                for (var j = 0; j < clusterAssigned.length; j++) {
                    if (clusterAssigned[j][0] === i) {
                        ptsInClust.push(dataSet[j]);
                    }
                }
                centroids[i] = meanInColumn(ptsInClust);
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
     *  and returns the values as an array.
     * @param  {Array.<Array>} dataList two-dimensional array
     * @return {Object}
     */
    function meanInColumn (dataList) {
        var size = arraySize(dataList);
        var meanArray = [];
        var sum;
        var mean;
        for (var j = 0; j < size[1]; j++) {
            sum = 0;
            for (var i = 0; i < size[0]; i++) {
                sum += dataList[i][j];
            }
            mean = sum / size[0];
            meanArray.push(mean);
        }
        return meanArray;
    }

    /**
     * The combine of hierarchical clustering and k-means.
     * @param  {Array} dataset   two-dimension array.
     * @param  {[type]} k   the number of clusters in a dataset
     * @return {}
     */
    function hierKMeans(dataSet, k, stepByStep) {
        var size = arraySize(dataSet);
        var clusterAssment = zeros(size[0], 2);
        // initial center point
        var centroid0 = meanInColumn(dataSet);
        var centList = [centroid0];
        var squareError;
        for (var i = 0; i < size[0]; i++) {
            squareError = distEclud(dataSet[i], centroid0);
            clusterAssment[i][1] = mathPow(squareError, 2);
        }
        var lowestSSE;
        var ptsInClust;
        var ptsNotClust;
        var clusterInfo;
        var sseSplit;
        var sseNotSplit;
        var index = 1;
        var result = {
            isEnd: false
        };
        function oneStep() {
            if (index < k) {
                lowestSSE = Infinity;
                var centSplit;
                var newCentroid;
                var newClusterAss;
                for (var j = 0; j < centList.length; j++) {
                    ptsInClust = [];
                    ptsNotClust = [];
                    for (var i = 0; i < clusterAssment.length; i++) {
                        if (clusterAssment[i][0] === j) {
                            ptsInClust.push(dataSet[i]);
                        }
                        else {
                            ptsNotClust.push(clusterAssment[i][1]);
                        }
                    }
                    clusterInfo = kMeans(ptsInClust, 2);
                    sseSplit = sumInColumn(clusterInfo.clusterAssigned, 1);
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
                for ( i = 0, j = 0; i < clusterAssment.length && j < newClusterAss.length; i++) {
                    if (clusterAssment[i][0] === centSplit) {
                        clusterAssment[i][0] = newClusterAss[j][0];
                        clusterAssment[i][1] = newClusterAss[j++][1];
                    }
                }
                result.clusterAssment = clusterAssment;
                result.centroids = centList;
                index++;
            }
            else {
                result.isEnd = true;
            }

            return result;
        }

        var step = {
            next: oneStep
        };

        if (!stepByStep) {
            var result;
            while (!(result = step.next()).isEnd);
            return result;
        }
        else {
            return step;
        }
        //the existing clusters are continuously divided
        //until the number of clusters is k
        // while (centList.length < k) {
        //     lowestSSE = Infinity;
        //     var centSplit;
        //     var newCentroid;
        //     var newClusterAss;
        //     for (var j = 0; j < centList.length; j++) {
        //         ptsInClust = [];
        //         ptsNotClust = [];
        //         for (var i = 0; i < clusterAssment.length; i++) {
        //             if (clusterAssment[i][0] === j) {
        //                 ptsInClust.push(dataSet[i]);
        //             }
        //             else {
        //                 ptsNotClust.push(clusterAssment[i][1]);
        //             }
        //         }
        //         clusterInfo = kMeans(ptsInClust, 2);
        //         sseSplit = sumInColumn(clusterInfo.clusterAssigned, 1);
        //         sseNotSplit = arraySum(ptsNotClust);
        //         if (sseSplit + sseNotSplit < lowestSSE) {
        //             lowestSSE = sseNotSplit + sseSplit;
        //             centSplit = j;
        //             newCentroid = clusterInfo.centroids;
        //             newClusterAss = clusterInfo.clusterAssigned;
        //         }
        //     }
        //     for (var i = 0; i < newClusterAss.length; i++) {
        //         if (newClusterAss[i][0] === 0) {
        //             newClusterAss[i][0] = centSplit;
        //         }
        //         else if (newClusterAss[i][0] === 1) {
        //             newClusterAss[i][0] = centList.length;
        //         }
        //     }
        //     centList[centSplit] = newCentroid[0];
        //     centList.push(newCentroid[1]);
        //     for ( i = 0, j = 0; i < clusterAssment.length && j < newClusterAss.length; i++) {
        //         if (clusterAssment[i][0] === centSplit) {
        //             clusterAssment[i][0] = newClusterAss[j][0];
        //             clusterAssment[i][1] = newClusterAss[j++][1];
        //         }
        //     }

        //     cb && cb({
        //         clusterAssment: clusterAssment,
        //         centroids: centList
        //     });
        // }
        // return {
        //     clusterAssment: clusterAssment,
        //     centroids: centList
        // };
    }

    /**
     * Create random centroid of kmeans.
     * @param  {Array.<number>} dataSet  two-dimension array
     * @param  {number} k   the number of centroids to be created
     * @return {Array.<number>}   random centroids of kmeans
     */
    function createRandCent(dataSet, k) {
        var size = arraySize(dataSet);
        //constructs a two-dimensional array with all values 0
        var centroids = zeros(k, size[1]);
        var minJ;
        var maxJ;
        var rangeJ;
        //create random cluster centers, within bounds of each dimension
        for (var j = 0; j < size[1]; j++) {
            minJ = dataSet[0][j];
            maxJ = dataSet[0][j];
            for (var i = 1; i < size[0]; i++) {
                if (dataSet[i][j] < minJ) {
                    minJ = dataSet[i][j];
                }
                if (dataSet[i][j] > maxJ) {
                    maxJ = dataSet[i][j];
                }
            }
            rangeJ = maxJ - minJ;
            for (var i = 1; i < k; i++) {
                centroids[i][j] = minJ + rangeJ * Math.random();
            }
        }
        return centroids;
    }

    /**
     * Distance method for calculating similarity
     * @param  {Array.<number>}  vec1
     * @param  {Array.<nnumber>}  vec2
     * @return {number}
     */
    function distEclud(vec1, vec2) {

        if (!isArray(vec1) && !isArray(vec2)) {
            return mathSqrt(mathPow(vec1 - vec2, 2));
        }
        var temp = [];
        //subtract the corresponding elements in the vectors
        for (var i = 0; i < vec1.length; i++) {
            temp[i] = vec1[i] - vec2[i];
        }
        var powerSum = 0;
        for (var i = 0; i < temp.length; i++) {
            powerSum += mathPow(temp[i], 2);
        }
        return mathSqrt(powerSum);
    }

    var clustering = {
        kMeans: kMeans,
        hierKMeans: hierKMeans
    };

    return clustering;

});