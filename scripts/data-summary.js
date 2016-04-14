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
        freq: ko.computed(function() {
            return _.map(data(), function(d) {
                return Math.floor(d.temp);
            })
        })

    }

});