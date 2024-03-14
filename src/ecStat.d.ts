// 

declare namespace EChartsStat {

	type InputData = Array<Array<number>>
	type OutputData = Array<Array<number>>

	interface HistogramBins {
		bins: Array<HistogramBinsBin>
		data: OutputData
		customData:OutputData
	}
	interface HistogramBinsBin {
		x0: number
		x1: number
		sample: Array<number>
	}
	function histogram(data: Array<number>, binMethod: 'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'): HistogramBins

	namespace clustering {
		interface Result {
			centroids: OutputData
			clusterAssment: OutputData
			pointsInCluster: OutputData
		}
		function hierarchicalKMeans(data: InputData, clusterNumer: number, stepByStep: boolean): Result
		function kMeans(data: InputData, clusterNumer: number): Result
	}

	interface RegressionParameter {
		linear: {
			gradient: number
			intercept: number
		}
		exponential: {
			coefficient: number
			index: number
		}
		logarithmic: {
			gradient: number
			intercept: number
		}
		polynomial: any[]
	}

	interface RegressionResult<T extends keyof RegressionParameter> {
		points: OutputData
		expression: string
		parameter: RegressionParameter[T]
	}
	function regression<T extends keyof RegressionParameter>(regreMethod: T, data: InputData, order: number): RegressionResult<T>

	namespace statistics {
		function deviation(data: Array<number>): number
		function sampleVariance(data: Array<number>): number
		function quantile(data: Array<number>, p: number): number
		function max(data: Array<number>): number
		function mean(data: Array<number>): number
		function median(data: Array<number>): number
		function min(data: Array<number>): number
		function sum(data: Array<number>): number
	}

}

declare module 'echarts-stat' {
	export = EChartsStat
}




