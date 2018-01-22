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
            location: '../../echarts/dist',
            name: 'echarts'
        },
        {
            main: 'zrender',
            location: '../../zrender/dist',
            name: 'zrender'
        }
    ]

});