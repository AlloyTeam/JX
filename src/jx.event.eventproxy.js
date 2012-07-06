/**
 * @example
 *     	$E.eventProxy(
			confirm.container,
			{
				".confirm_select click": function(e) {
					var check= J.dom.mini(".confirm_remove_select", confirm.container)[0];
					if(check) {
		        		if(check.checked) {
		        			check.checked= false;
		        		}else {
		        			check.checked= true;
		        		}
	        		}
				},
				".confirm_htmlAllName,.confirm_avatar click": function(e) {
					alloy.portal.runApp("userDetails", user.uin);
				}
			}
		);
 */
Jx().$package(function(J){
    var $E= J.event;
    var hash= {"#":"id", ".":"className", "@":"el","!":"!"};
    var eventsNotBubble= {
        "blur":1,
        "focus":1,
        "change":1
        //"mouseenter":1,//onlyIE
        //"mouseleave":1
    };
    /**
     * @private
     */
    J.event.eventProxy= function(el, eventsObj){
        var events= {},k,v;
        for(k in eventsObj) {
            v= eventsObj[k];
            var arg= k.split(" ");
            var targets= arg[0],event= arg[1];
            events[event]= events[event]||[];
            events[event].push([targets,v]);
        }
        k=v=null;
        for(k in events) {
            v= events[k];
            if(eventsNotBubble[k]||(k.charAt(0)=="@")) {
                for(var len=v.length-1;len>=0;len--) {
                    var targets= v[len][0].split(",");
                    for(var l=targets.length-1;l>=0;l--) {
                        var type= hash[targets[l].charAt(0)];
                        if(type=="id") {
                            $E.on($D.id(targets[l].substr(1)),k,v[len][1]);
                        }else if(type=="el") {
                            $E.on(el,k.substr(1),v[len][1]);
                        }
                    }
                }
            }else {
                $E.on(el,k,function(e) {
                    var dom= e.target;
                    for(var len=v.length-1;len>=0;len--) {
                        J.event.eventParser.parse(v[len][0],v[len][1],e);
                    }
                });
            }
        }
    };
});
