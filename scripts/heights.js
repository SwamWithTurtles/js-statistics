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


require(['knockout', 'lodash', 'jStat', 'config/chartOptions'], function(ko, _, jStat, ChartData) {

    var heightResult = function() {
        return Math.floor(jStat.normal.sample(177, 7.4));
    }

    var allResults = ko.observableArray();

    var viewModel = {

        lastResult: ko.observable(""),

        invitePerson: function() {
            if(viewModel.lastResult()) {
                allResults.push(viewModel.lastResult())
                allResults.notifySubscribers();
            }
            viewModel.lastResult(heightResult());
        },
        inviteTenPeople: function() {
            _.times(10, viewModel.invitePerson)
        },


        asData: ko.computed(function() {
            var counts = _.countBy(allResults());
            var barsToDisplay = _.range(_.min(allResults()), _.max(allResults()));

            var maps = _.map(barsToDisplay, function(i) {
                return {name: i, count: counts[i] ? counts[i] : 0};
            })

            return new ChartData({name: "Height", points: _.map(maps, 'count')}, _.map(maps, 'name'));
        })
    }

    ko.applyBindings(viewModel);
});