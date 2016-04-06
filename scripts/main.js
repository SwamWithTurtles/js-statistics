require.config({
    paths: {
        'ko-lib': '../bower_components/knockout/dist/knockout',
        'knockout': 'lib/ko-lib',
        'chart': '../bower_components/Chart.js/Chart'
    },
    shim: {
        'chart': {
            exports: 'Chart'
        }
    }

})
require(['knockout', 'data/stubData'], function(ko, d) {
    var viewModel = {
        d: ko.observable(d)
    };

    ko.applyBindings(viewModel);
})