require.config({
    paths: {
        'ko-lib': '../bower_components/knockout/dist/knockout',
        'knockout': 'lib/ko-lib',
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
        jStat: {
            exports: "jStat"
        }
    }

});


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
                }
            }

var isValid = function(row) {
    return row[2] && parseFloat(row[16]) <= 50;
}

var average = function(x) {return _.reduce(x, function(a,m,i,p) {
       return a + m.temp/p.length;
       } ,0);}



require(['knockout', 'papaparse', 'lodash', 'jStat'], function(ko, Papa, _, jStat) {

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
    }

    var chartViews = ["freq", "annualAvg"]
    var selectedView = ko.observable(chartViews[0]);

    var data = ko.observable();

    Papa.parse('/js-statistics/data/5908727016585dat.txt', {
        download: true,
        complete: function(results) {
            data(_.map(results.data, function(r) {return isValid(r) ? new DataObject(r): {}}));
            ko.applyBindings(viewModel);
        },
        error: function() {alert('boo')}
    })



    var viewModel = {
        selectedView: selectedView,
        freq: ko.computed(function() {
            return _.map(data(), function(d) {
                return Math.floor(d.temp);
            })
        }),
        averageOverYears: ko.computed(function() {
            var aggData = _.groupBy(data(), 'year');
            var x = _.mapValues(aggData, function(x) {
                 return average(x);
             });

             delete x[undefined];
             delete x[2016];

             return {
               'labels': _.keys(x),
               'datasets': [
                   {
                       label: "Frequency of Nodes",
                       data: _.values(x),

                               fillColor: "rgba(220,30,30,0.2)",
                               strokeColor: "rgba(220,30,30,1)",
                               pointColor: "rgba(220,30,30,1)",
                               pointStrokeColor: "#fff",
                               pointHighlightFill: "#fff",
                               pointHighlightStroke: "rgba(220,30,30,1)"
                   }
               ]
           };

        }),

        hourlyAverage: ko.computed(function() {
            var aggData = _.groupBy(data(), function(d) {return d.time ? d.time.substring(0, 2) : undefined;});
            var x = _.mapValues(aggData, function(x) {
                 return _.reduce(x, function(a,m,i,p) {
                 return a + m.temp/p.length;
                 } ,0);
             });

            var values = [];

            delete x.undefined;

            _.forOwn(x, function(value, key) {
                values.push({k: key, v: value});
            })

            values = _.sortBy(values, function(d) {return d.k})

             return {
               'labels': _.map(values, 'k'),
               'datasets': [
                   {
                       label: "Frequency of Nodes",
                       data: _.map(values, 'v'),

                               fillColor: "rgba(220,30,30,0.2)",
                               strokeColor: "rgba(220,30,30,1)",
                               pointColor: "rgba(220,30,30,1)",
                               pointStrokeColor: "#fff",
                               pointHighlightFill: "#fff",
                               pointHighlightStroke: "rgba(220,30,30,1)"
                   }
               ]
           };

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