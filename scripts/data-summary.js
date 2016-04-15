require.config({
    paths: {
        'ko-lib': '../bower_components/knockout/dist/knockout',
        'knockout': 'config/ko-lib',
        'chart': '../bower_components/Chart.js/Chart',
        'lodash': '../bower_components/lodash/lodash',
        'papaparse': '../bower_components/papaparse/papaparse.min',
        'd3': '../bower_components/d3/d3.min',
        'jStat': '../bower_components/jstat/dist/jstat.min'


    },
    shim: {
        'chart': {
            exports: "Chart",
        },
        'papaparse': {
            exports: "Papa"
        },
        'jStat': {
            exports: "jStat"
        }
    }

});

require(['knockout', 'papaparse', 'lodash', 'jStat', 'config/chartOptions'], function(ko, Papa, _, jStat, ChartOptions) {

    var coinTossResult = function() {
        var rand = Math.random()
        return rand < 0.5 ? "Heads" : "Tails";
    }

    var DataObject = function(row) {
       return {
            'date': row[2],
            'year': row[2].substring(0, 4),
            'month': row[2].substring(4, 6),
            'day': row[2].substring(6, 8),
            'time': row[3],
            'temp': parseFloat(row[16])
       };
    };

    var isDataPointValid = function(row) {
        return row[2] && parseFloat(row[16]) <= 50;
    };

    var summaryStats = function(data) {
        var extractedData = _(data).map(function(x) {
            return x.temp;
        }).filter(_.isNumeric).value();


        var roundTo2dp = function(x) { return Math.floor(x * 100) / 100}

        var unrounded = {
            mean: jStat.mean(extractedData),
            mode: jStat.mode(extractedData),
            median: jStat.median(extractedData),

            range: jStat.range(extractedData),
            variance: jStat.variance(extractedData),
            stDev: jStat.stdev(extractedData),

            skewness: jStat.skewness(extractedData),
            kurtosis: jStat.kurtosis(extractedData)
        }

        return _.mapValues(unrounded, roundTo2dp)
    };

    var chartViews = ["freq", "annualAvg"];
    var selectedView = ko.observable(chartViews[0]);

    var chartSplitBy = function(d, splitBy) {
        var aggData = _.groupBy(d, splitBy);
        var tempData = _.mapValues(aggData, function(x) {
            return _.map(x, function(t) { return t.temp});
        });

        var x = _.mapValues(tempData, jStat.mean);

        delete x[undefined];
        delete x[2016];

        var presorted = [];
        _.forOwn(x, function(key, value) {
            if(value !== "NaN") {
                presorted.push({label: value, count: key});
           }
        })

        sortedData = _.sortBy(presorted, function(dataPoint) {
            return parseInt(dataPoint.label);
        });

        labels = _.map(sortedData, 'label');
        counts = _.map(sortedData, 'count')
        return new ChartOptions({seriesName: "Frequency", points: counts}, labels);
    }

    var data = ko.observable();

    Papa.parse('/js-statistics/data/5908727016585dat.txt', {
        download: true,
        complete: function(results) {
            data(_.map(results.data, function(r) {return isDataPointValid(r) ? new DataObject(r): {}}));
            ko.applyBindings(viewModel);
        },
        error: function() { alert('Error :('); }
    });

    var viewModel = {
        selectedView: selectedView,

        freq: ko.computed(function() {
            return _.map(data(), function(d) {
                return Math.floor(d.temp);
            })
        }),

        averageOverYears: ko.computed(function() {
            return chartSplitBy(data(), 'year');
        }),

        hourlyAverage: ko.computed(function() {
            return chartSplitBy(data(), function(d) {return d.time ? d.time.substring(0, 2) : undefined;});
        }),

        summaryStats: ko.computed(function() {
            return summaryStats(data());

        }),

        stratifiedStats: ko.computed(function() {
            var aggData = _.groupBy(data(), 'month');
            var x =  _.mapValues(aggData, summaryStats);
            delete x[undefined];

            var formattedData = [];

            _.forOwn(x, function(value, key) {
                formattedData.push( {
                    name: key,
                    value: value
                });
            })

            formattedData = _.sortBy(formattedData, function(r) {return parseInt(r.name)});

            return formattedData;
        })
    }


});