var Log = (function Logger(config){
    return {
        //write message to console log or jQuery object
        'add' : function(message, $obj){
            if(config.logger){
                if($obj){
                    $obj.append(message+"\n");
                }else{
                    console.log(message);
                }
            }

        }
    }
})(window.config);