$(function(){
    $("#tags").chosen({});
    $(".sidebar .trigger").on("click",function(){
       $(this).parent().toggleClass("hidden");
    });

});