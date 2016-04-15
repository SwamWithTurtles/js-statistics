define([], function() {

    return function(data, labels) {
        return {
         'labels': labels,
         'datasets': [
             {
                 label: data.seriesName,
                 data: data.points,

                 fillColor: "rgba(220,30,30,0.2)",
                 strokeColor: "rgba(220,30,30,1)",
                 pointColor: "rgba(220,30,30,1)",
                 pointStrokeColor: "#fff",
                 pointHighlightFill: "#fff",
                 pointHighlightStroke: "rgba(220,30,30,1)"
             }
         ]
     };
    }

})