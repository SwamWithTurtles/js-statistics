require.config({
    paths: {
        'knockout': '../bower_components/knockout/dist/knockout'
    }
})
require(['knockout'], function(ko) {
    var viewModel = {
        t: ko.observable("Knockout is Enabled")
    };

    ko.applyBindings(viewModel);
})