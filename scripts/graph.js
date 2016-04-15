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

require(['knockout', 'stat/graph'], function(ko, Graph) {

    var g = new Graph();

    var viewModel = {
        d: g.formatAsData,
        addNode: g.add,
        nodeMap: g.nodes,
        addToGraph: ko.observable(true),
        numberOfNodes: g.numberOfNodes,
        toggleGraph: function() {
            viewModel.addToGraph(!viewModel.addToGraph());
            if(viewModel.addToGraph) {
                addNode();
            }
        },

        showingChart: ko.observable(true),
        toggleShowingChart: function() {viewModel.showingChart(!viewModel.showingChart())}
    };

    var addNode = function() {
        g.add()
        if(ko.unwrap(viewModel.addToGraph)) {setTimeout(addNode, 1500);}
    }
    addNode();



    ko.applyBindings(viewModel);
});