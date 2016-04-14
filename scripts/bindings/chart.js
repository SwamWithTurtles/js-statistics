define(['ko-lib', 'chart'], function(ko, Chart) {

    ko.bindingHandlers.chart = {
        update: function(element, valueAccessor) {
            var ctx = element.getContext("2d");
            ctx.canvas.width = window.innerWidth * 0.9;
            ctx.canvas.height = window.innerHeight * 0.9;
            var myNewChart = new Chart(ctx).Line(ko.unwrap(valueAccessor()), {
                animation: false,
            });
        }
    }
});