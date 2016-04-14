require.config({
    paths: {
        'ko-lib': '../bower_components/knockout/dist/knockout',
        'knockout': 'lib/ko-lib',
        'chart': '../bower_components/Chart.js/Chart',
        'lodash': '../bower_components/lodash/lodash',
        'papaparse': '../bower_components/papaparse/papaparse.min',
        'd3': '../bower_components/d3/d3.min'
    },
    shim: {
        'chart': {
            exports: "Chart",
        },
        'papaparse': {
            exports: "Papa"
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

require(['knockout', 'papaparse', 'lodash'], function(ko, Papa, _) {

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
                 return _.reduce(x, function(a,m,i,p) {
                 return a + m.temp/p.length;
                 } ,0);
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

        })

    }

});