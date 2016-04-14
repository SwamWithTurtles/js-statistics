define(['ko-lib', 'lodash', 'chart'], function(ko, _, Chart) {

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

            labels = _.map(data, function(d) { return d.label});
            counts = _.map(data, function(d) {return d.count})

            var data = {
                 'labels': labels,
                 'datasets': [
                     {
                         label: "Frequency of Nodes",
                         data: counts,

                                 fillColor: "rgba(220,30,30,0.2)",
                                 strokeColor: "rgba(220,30,30,1)",
                                 pointColor: "rgba(220,30,30,1)",
                                 pointStrokeColor: "#fff",
                                 pointHighlightFill: "#fff",
                                 pointHighlightStroke: "rgba(220,30,30,1)"
                     }
                 ]
             };

            var ctx = element.getContext("2d");
            ctx.canvas.width = 600;
            ctx.canvas.height = 600;
            var myNewChart = new Chart(ctx).Bar(data, {
                animation: false,
            });
        }
    }
});