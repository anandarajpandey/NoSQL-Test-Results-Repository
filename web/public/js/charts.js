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
                _$container.trigger("gotChartData", [data]);
            }
        });
    })();

    var drawChart = function(data){
        Log.add("start drow chart");
        var title = data[0][0];
        data = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Performance',
            hAxis: {title: title, titleTextStyle: {color: 'red'}},
            width: 920,
            height: 420
        };

        var gchart = new google.visualization.ColumnChart(document.getElementById(_$container.attr("id")));
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
                    drawChart(data);
                }else{
                    drawLoader();
                    _$container.on("gotChartData", function(e, response){
                        drawChart(response);
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