$(function(){

    $(".tags").chosen({});
    $(".axe").chosen({});


    var res = new results($(".tests_table"));

    $("#search").submit(function(){
        res.searchByTags($(this).find(".tags").val());
        return false;
    });

    $("#chart_settings").submit(function(){
        var selected_tests = res.getSelectedResults();
        var $chart = $("#chart");
        if(selected_tests.length > 0){
            var mock = {
                'tests' : selected_tests,
                'axes' : ['throughput'],
                'group' : ['DataSetSize-6GB']
            };
            var chart = new Chart(mock, $chart);
            chart.draw();
        }else{
            $chart.html('Please, select a few tests results');
        }
        return false;
    });

});