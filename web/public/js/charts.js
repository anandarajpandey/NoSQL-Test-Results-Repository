google.load("visualization", "1", {packages:["corechart"]});

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
        data = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Performance',
            hAxis: {title: 'Test', titleTextStyle: {color: 'red'}}
        };

        var gchart = new google.visualization.ColumnChart(document.getElementById('chart'));
        gchart.draw(data, options);

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