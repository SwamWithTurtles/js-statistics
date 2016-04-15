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


var coinTossResult = function() {
    var rand = Math.random()
    return rand < 0.5 ? "Heads" : "Tails";
}

require(['knockout', 'lodash'], function(ko, Graph, _) {

    var viewModel = {

        lastResult: ko.observable(""),

        tossCoin: function() {
            if(viewModel.lastResult()) {
                viewModel.allResults.push(viewModel.lastResult())
                viewModel.allResults.notifySubscribers();
            }
            viewModel.lastResult(coinTossResult());
        },

        allResults: ko.observableArray()
    }

    ko.applyBindings(viewModel);
});