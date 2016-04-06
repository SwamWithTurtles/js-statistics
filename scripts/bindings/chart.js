define(['ko-lib', 'chart'], function(ko, Chart) {

    ko.bindingHandlers.chart = {
        init: function(element, valueAccessor) {
            var ctx = element.getContext("2d");
            var myNewChart = new Chart(ctx).Line(ko.unwrap(valueAccessor()));
        }
    }
});