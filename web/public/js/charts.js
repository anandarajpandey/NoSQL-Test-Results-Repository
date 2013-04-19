google.load("visualization", "1", {packages:["corechart"]});

var Chart = function(source, $container){

    if(!source){
        throw Error("no source for chart");
    }

    var data = {};
    var _$container = $container;

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
            hAxis: {title: 'Test', titleTextStyle: {color: 'red'}},
            width: 620,
            height: 320
        };

        var gchart = new google.visualization.ColumnChart(document.getElementById('chart'));
        gchart.draw(data, options);

    };

    var drawLoader = function(){
        Log.add("wait of response");
        _$container.html("Loading...");
    };

    return {
        'draw' : function(){
            if(_$container){
                if(data.length > 0){
                    drawChart(data, _$container);
                }else{
                    drawLoader(_$container);
                    $(document).on("gotChartData", function(e, response){
                        drawChart(response, _$container);
                        $(document).off("gotChartData");
                    });
                }
                return true;
            }else{
                Log.add("jQuery container for chart not found");
                return false;
            }
        },
        'setError' : function(html){
            _$container.html(html);
        },
        'setContainer' : function($container){
             _$container = $container;
        }
    }
};