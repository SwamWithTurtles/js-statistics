define(["knockout", "lodash", "stat/weightedRandom"], function(ko, _, weightedRandom) {

    var frequencies = ko.observableArray([1, 1]);
    var graphNodes = ko.observable({
        name: "0",
        children: [{
            name: "1"
        }]
    });


    var findNodeMeetingCondition = function(predicate, nodesToSearch) {
            var nameAsString = "" + name;
            nodesToSearch = nodesToSearch ? nodesToSearch : graphNodes();

            if(predicate(nodesToSearch)) {return nodesToSearch; }
            if(!_.isArray(nodesToSearch.children) || nodesToSearch.children.length === 0 ) {return false; }

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
                name: "" + frequencies().length,
            });

            frequencies()[chosenIndex]++;
            frequencies.push(1);
            graphNodes.notifySubscribers();
       },
       nodes: graphNodes,
       formatAsData: ko.computed(function() {
            var arr = [];
            var labels = _.range(1, _.max(frequencies()) + 1);

            var freqData = _.countBy(frequencies());
            var counts = _.map(labels, function(ix) { return freqData[ix] ? freqData[ix] : 0; });


            return {
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
       }),

    }};

});