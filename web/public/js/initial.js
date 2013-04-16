$(function(){
    //todo refactor this file
    $(".tags").chosen({});

    var selected_tests = [];
    function rows_hadler(){
        $(".test_row").on("click", function(e){
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
    }
    rows_hadler();

    $(".search_tests_button").on("click", function(){
        $.ajax({
            type    : "GET",
            url     : "/api/getResults",
            data    : {'tags': $("#search .tags").val()},
            'dataType': 'json',
            success : function(response){
                draw_results_table(response, $("#search_results"));
            },
            error   : function(e, mesage){
                Log.add(mesage);
            }
        });
    });

    function draw_results_table(results, $container){
        $(".test_row").remove();
        for (var key in results){
            var result = results[key];
            $row =  $(["<tr class='test_row'>",
                            "<td><input type='checkbox' class='test' id='", result.id, "'></td>",
                            "<td>", result.name, "</td>",
                            "<td>", result.throughput, "</td>",
                            "<td>", result.read.o, "</td>",
                            "<td>", result.read.s, "</td>",
                            "<td>", result.write.o, "</td>",
                            "<td>", result.write.s, "</td>",
                      "</tr>"].join(''));
            $container.prepend($row);
        }
        rows_hadler();
    }

    $(".draw_chart_button").on("click", function(){

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