$(function(){

    $(".tags").chosen({'search_contains' : true});
    $(".axe").chosen({});


    var res = new Results($(".tests_table"));

    $("#search").submit(function(){
        res.searchByTags($(this).find(".tags").val());
        return false;
    });

    $("#chart_settings").submit(function(){
        var selected_tests = res.getSelectedResults(),
            axe = $(".axe").val(),
            group = $(this).find(".tags").val();

        var $chart = $("#chart");
        var $second_chart = $("#second_chart");
        if(selected_tests.length > 0){

            var data = {
                'tests' : selected_tests,
                'axe' : axe,
                'group' : group,
                'type' : 'read'
            }
                ;
            var chart = new Chart(data, $chart);
            chart.draw();

            if(axe == 'latency'){
                data.type = 'write';

                var second_chart = new Chart(data, $second_chart);
                second_chart.draw();

            }else{
                $second_chart.html('');
            }

        }else{
            $chart.html('Please, select a few tests results');
        }

        return false;
    });

});