var results = function($container){

    var _$container = $container;

    var $results_container = _$container.find(".results");

    var $select_all = $("#select_all");

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
        if(data.length > 0){
            $results_container.empty();
            selected_results = [];
            for (var key in data){
                var result = data[key];
                var $row =  $(["<tr class='test_row'>",
                    "<td><input type='checkbox' class='test' id='", result.id, "'></td>",
                    "<td>", result.name, "</td>",
                    "<td>", result.throughput, "</td>",
                    "<td>", result.read.o, "</td>",
                    "<td>", result.read.s, "</td>",
                    "<td>", result.write.o, "</td>",
                    "<td>", result.write.s, "</td>",
                    "</tr>"].join('')).on("click", row_handler);
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