require.config({
    paths: {
        'ko-lib': '../bower_components/knockout/dist/knockout',
        'knockout': 'lib/ko-lib',
        'chart': '../bower_components/Chart.js/Chart',
        'lodash': '../bower_components/lodash/lodash',
        'd3': '../bower_components/d3/d3.min'
    },
    shim: {
        'chart': {
            exports: "Chart",
        },
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