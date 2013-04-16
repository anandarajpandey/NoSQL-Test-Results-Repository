$(function(){
    $("#tags").chosen({});
    $(".search_test_button").on("click", function(){
        $.ajax({
            type    : "GET",
            url     : "/api/getResults",
            data    : $("#tags").val()
        });
    });
    var selected_tests = [];
    $(".test_row").on("click", function(e){
        //todo refactor this handler
        var that = $(this).toggleClass("selected");
        var test = that.find(".test");
        if(!$(e.target).hasClass("test")){
            test.prop("checked", !test.is(":checked"));
        }
        var index = selected_tests.indexOf(test.attr("id"));
        if (index !== -1){
            selected_tests.splice(index, 1);
        } else {
            selected_tests.push(test.attr("id"));
        }
    });
    $(".draw_chart_button").on("click", function(){
        var mock = {
            'tests' : selected_tests,
            'axes' : ['throughput'],
            'group' : ['DataSetSize-6GB']
        };
        var chart = new Chart(mock, $("#chart"));
        if(selected_tests.length > 0){
            chart.draw();
        }else{
            chart.setError('Please, select a few tests results');
        }

    })
});