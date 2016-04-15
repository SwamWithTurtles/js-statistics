define(['ko-lib', 'lodash', 'chart', 'config/chartOptions'], function(ko, _, Chart, ChartOptions) {

    ko.bindingHandlers.frequencyChart = {
        update: function(element, valueAccessor) {

            var va = ko.unwrap(valueAccessor());

            var grouped = _.countBy(va);

            var presorted = [];
            _.forOwn(grouped, function(key, value) {
                if(value !== "NaN") {
                    presorted.push({label: value, count: key});
               }
            })

            data = _.sortBy(presorted, function(x) {return parseInt(x.label);});

            labels = _.map(data, 'label');
            counts = _.map(data, 'count')
            var data = new ChartOptions({seriesName: "Frequency", points: counts}, labels);

            var ctx = element.getContext("2d");
            ctx.canvas.width = 600;
            ctx.canvas.height = 600;
            var myNewChart = new Chart(ctx).Bar(data, {
                animation: false,
            });
        }
    }
});