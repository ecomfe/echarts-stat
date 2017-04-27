require.config({
    paths: {
        'data': './data',
    },
    packages: [
        {
            main: 'ecStat',
            location: '../src',
            name: 'ecStat'
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