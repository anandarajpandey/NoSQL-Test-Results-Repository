var results = function($container){

    var _$container = $container;

    var $results_container = _$container.find(".results");

    var $select_all = $("#select_all");

    var $test_data_container = $("<div class='test_data_container'>" +
                                    '<button class="button close_test_data"><span class="icon icon48"></span><span class="label">Close</span></button>' +
                                    "<div class='test_data'></div>" +
                                "</div>").appendTo(".content");

    $(".close_test_data").on("click", function(){
        $test_data_container.hide();
        return false;
    });

    $select_all.on("click", function(){
        var select = $(this).prop("checked");
        var $rows = _$container.find(".test_row");
        if($rows.length > 0){
            _$container.find(".test_row").each(function(){
                select_deselect_row($(this), select);
            });
        }else{
            return false;
        }
    });

    var row_handler = function(e){
        var $this = $(this);
        var select = !$this.hasClass("selected");
        select_deselect_row($this, select);
    };

    var select_deselect_row = function($row, select){
        if(select !== false){
            select = true;
        }
        var $test = $row.find('.test');

        if(select){
            $row.addClass("selected");
            $test.prop("checked", true);
        }else{
            $row.removeClass("selected");
            $test.prop("checked", false);
        }
        if($(".test_row").length == $(".selected").length){
            $select_all.prop("checked", true);
        }else{
            $select_all.prop("checked", false);
        }
    };

    var setData = function(data){
        $select_all.prop("checked", false);
        if(data.length > 0){
            $results_container.empty();
            $select_all.prop("checked", "checked");
            for (var key in data){
                var result = data[key];
                var $row =  $(["<tr class='test_row selected'>",
                    "<td><input type='checkbox' class='test' checked id='", result.id, "'></td>",
                    "<td><a href='/api/getTestAllData?id=", result.id, "' target='_blank' data-test_id='",result.id,"' class='show_test_data'>", result.name, "</a></td>",
                    "<td>", result.throughput, "</td>",
                    "<td>", result.read.o, "</td>",
                    "<td>", result.read.s, "</td>",
                    "<td>", result.write.o, "</td>",
                    "<td>", result.write.s, "</td>",
                    "</tr>"].join('')).on("click", row_handler);

                $row.find(".show_test_data").on("click", function(){
                    Log.add($(this).data("testId"));
                    show_test_data($(this).data("test_id"));
                    return false;
                });

                $results_container.append($row);
            }
        }else{
            writeMessage('tests results not found', 1);
        }

    };

    $container.find(".test_row").on("click", row_handler);

    var writeMessage = function(message, error){
        if(error){
            error = 'error';
        }else{
            error = '';
        }
        $results_container.html("<tr><td colspan='7' class='tip_in_table "+error+"'>"+message+"</td></tr>")
    };

    var show_test_data = function(test_id){
        $.ajax({
            type    : 'GET',
            url     : '/api/getTestAllData',
            data    : {'id' : test_id},
            success : function(response){
                $test_data_container.find(".test_data").html(response);
                prettyPrint();
                $test_data_container.show();
            },
            error   : function(error, text){
                Log.add(text);
            }
        });
    };

    return {
        'getSelectedResults' : function(){
            var selected_results = [];
            $(".test:checked").each(function(){
               selected_results.push($(this).attr("id"));
            });
            return selected_results;
        },
        'searchByTags' : function(tags){
            if(tags && tags.length > 0){
                writeMessage("Loading...");
                $.ajax({
                    type    : "GET",
                    url     : "/api/getResults",
                    data    : {'tags': tags},
                    'dataType': 'json',
                    success : function(response){
                        setData(response);
                    },
                    error   : function(e, mesage){
                        Log.add(mesage);
                    }
                });
            }else{
                writeMessage("Select one or more tags for search", 1);
            }

        }
    }
};