$(function(){
    $("#tags").chosen({});
    $(".sidebar .trigger").on("click",function(){
       $(this).parent().toggleClass("hidden");
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
        if(selected_tests.length > 0){
            var mock = {
                'tests' : selected_tests,
                'axes' : ['throughput'],
                'group' : ['DataSetSize-6GB']
            }
            var chart = new Chart(mock);
            chart.draw($("#chart"));
        }

    })
});