var navigate = {

        setUrl : function(data){
            var hash_sting = '!';
            for(var param in data){

                if(data[param] instanceof Array){
                    for(var array_item in data[param]){
                        hash_sting += '&'+ param + '[]=' + data[param][array_item];
                    }
                }else{
                    hash_sting += '&' + param + '=' + data[param];
                }
            }

            window.location.hash = encodeURI(hash_sting);
        },
        getUrlData : function(){

        },
        setHandler : function(){

        }
}