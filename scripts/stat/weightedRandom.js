define(["lodash"], function(_) {

    return function(arr) {
        var sumOfWeights = _.sum(arr);
        var random = Math.floor(Math.random() * sumOfWeights)

        var cumSum = 0;
        var cumIndex = 0;
        while(cumSum + arr[cumIndex] < random) {
            cumSum = cumSum + arr[cumIndex];
            cumIndex++;
        }

        return {
            ix: cumIndex,
            elem: arr[cumIndex]
        };
    }

})