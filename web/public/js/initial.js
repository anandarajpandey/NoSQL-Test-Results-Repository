$(function(){
    $("#tags").chosen({});
    $(".sidebar .trigger").on("click",function(){
       $(this).parent().toggleClass("hidden");
    });
    $(".draw_chart_button").on("click", function(){
        var mock = {
            'tests' : ['5157052f137a0074b7000001','5156fe14137a0073cf000001', '5152e5ae137a001011000001', '51531609137a0016ec000001'],
            'axes' : ['throughput'],
            'group' : ['DataSetSize-6GB']
        }
        var chart = new Chart(mock);
        chart.draw($("#chart"));
    })
});