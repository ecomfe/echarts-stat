require.config({
    paths: {
        'data': './data',
    },
    packages: [
        {
            main: 'echarts-stat',
            location: '../src',
            name: 'echarts-stat'
        },
        {
            main: 'echarts',
            location: '../../echarts/src',
            name: 'echarts'
        },
        {
            main: 'zrender',
            location: '../../zrender/src',
            name: 'zrender'
        }
    ]

});