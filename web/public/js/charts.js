var Chart = function(source){

    if(!source){
        throw Error("no source for chart");
    }

    var data = {};

    (function getData(){
        $.ajax({
            'type'  :   'GET',
            'url'   :   '/api/getColumnChartData',
            'data'  :    source,
            'dataType': 'json',
            'error' :   function(xhr, code, text){
                Log.add(code+" "+text);
            },
            'success':  function(response){
                data = response;
                $(document).trigger("gotChartData", [data]);
            }
        });
    })();

    var drawChart = function(data, $container){
        Log.add("start drow chart");
        $.plot($container,[
                { label: "Bar1", data: [ [2,10], [6,20] , [10, 30]], bars : {show : true} },
                { label: "Bar2", data: [ [1,1], [5,22] , [9, 23]], bars : {show : true} },
                { label: "Bar2", data: [ [3,3], [7,40] , [11, 25]], bars : {show : true} }
        ],
            {
                grid: {
                    hoverable: true,
                    autoHighlight: true,
                    backgroundColor: '#222'
                },
                bars : {
                    barWidth:0.5
                }
            }
        );
    };

    var drawLoader = function($container){
        Log.add("wait of response");
        $container.html("loading");
    }

    return {
        'draw' : function($container){
            if($container){
                if(data.length > 0){
                    drawChart(data, $container);
                }else{
                    drawLoader($container);
                    $(document).on("gotChartData", function(e, response){
                        drawChart(response, $container);
                        $(document).off("gotChartData");
                    });
                }
                return true;
            }else{
                Log.add("jQuery container for chart not found");
                return false;
            }
        }
    }
};