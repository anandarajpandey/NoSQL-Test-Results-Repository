var results = function($container){

    var _$container = $container;

    var $results_container = _$container.find(".results");

    var selected_results = [];

    var row_handler = function(e){
        var $this = $(this);
        $this.toggleClass("selected");
        var test = $this.find(".test");
        if(!$(e.target).hasClass("test")){
            test.prop("checked", !test.is(":checked"));
        }
        var index = selected_results.indexOf(test.attr("id"));
        if (index !== -1){
            selected_results.splice(index, 1);
        } else {
            selected_results.push(test.attr("id"));
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