$(function(){

    $(".tags").chosen({});
    $(".axe").chosen({});

    var res = new results($(".tests_table"));

    $(".search_tests_button").on("click", function(){
        res.searchByTags($("#search .tags").val());
    });

    $(".draw_chart_button").on("click", function(){
        var selected_tests = res.getSelectedResults();
        if(selected_tests.length > 0){
            var mock = {
                'tests' : selected_tests,
                'axes' : ['throughput'],
                'group' : ['DataSetSize-6GB']
            };
            var chart = new Chart(mock, $("#chart"));
            chart.draw();
        }else{
            $("#chart").html('Please, select a few tests results');
        }

    })
});