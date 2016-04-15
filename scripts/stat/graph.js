define(["knockout", "lodash", "stat/weightedRandom", "config/chartOptions"], function(ko, _, weightedRandom, ChartOptions) {

    var frequencies = ko.observableArray([1, 1]);
    var graphNodes = ko.observable({
        name: "0",
        children: [{
            name: "1"
        }]
    });

    var numberOfNodes = ko.observable(2);

    var hasNoChildren = function(node) {
        !_.isArray(node.children) || node.children.length === 0
    }

    var findNodeMeetingCondition = function(predicate, nodesToSearch) {
        nodesToSearch = nodesToSearch ? nodesToSearch : graphNodes();

        if(predicate(nodesToSearch)) { return nodesToSearch; }
        if(hasNoChildren(nodesToSearch)) { return false; }

        var rec = false;
        var ix = 0;

        while(!rec && ix < nodesToSearch.children.length) {
            rec = findNodeMeetingCondition(predicate, nodesToSearch.children[ix]);
            ix++;
        }

        return rec;
    }

    var findNodeWithName = function(name) {
        var nameAsString = "" + name;

        return findNodeMeetingCondition(function(node) {
            return node.name === nameAsString
        })
    }

    return function() {return {
       frequencies: frequencies,

       add: function() {
            var chosenIndex = weightedRandom(frequencies()).ix;

            var nodeToAdd = findNodeWithName(chosenIndex);
            if(!nodeToAdd.children) {
                nodeToAdd.children = [];
            }
            nodeToAdd.children.push({
                name: "" + numberOfNodes()
            });

            frequencies()[chosenIndex]++;
            frequencies.push(1);

            numberOfNodes(numberOfNodes() + 1);
            graphNodes.notifySubscribers();
       },

       nodes: graphNodes,

       formatAsData: ko.computed(function() {
            var arr = [];
            var labels = _.range(1, _.max(frequencies()) + 1);

            var freqData = _.countBy(frequencies());
            var counts = _.map(labels, function(ix) { return freqData[ix] ? freqData[ix] : 0; });

            return new ChartOptions({seriesName: "Frequency of Nodes", points: counts}, labels)
       }),

       numberOfNodes: numberOfNodes
    }};

});