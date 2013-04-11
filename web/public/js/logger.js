var Log = (function Logger(config){
    return {
        //write message to console log or jQuery object
        'add' : function(message, $obj){
            if(config.logger){
                var deltaTime = new Date().getTime() - config.startTime;
                if (config.logger.showTime && typeof message != "function" && typeof message != "object"){
                    message += " -- "+ deltaTime + "ms";
                }
                if($obj){
                    $obj.append(message+"\n");
                }else{
                    console.log(message);
                }
            }

        }
    }
})(window.config);