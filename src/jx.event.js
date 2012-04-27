/**
 * 5.[Browser part]: event 扩展包
 */
Jx().$package(function(J){
    var $E,
        addEventListener,
        addOriginalEventListener,
        removeEventListener,
        removeOriginalEventListener,
        customEvent,
        customEventHandlers=[],
        onDomReady,
        isDomReady,
        Publish,
        addObserver,
        addObservers,
        notifyObservers,
        removeObserver,
        standardizeEvent,
        packageContext=this;
    /**
     * event 名字空间
     * 
     * @namespace
     * @name event
     */
    J.event = J.event || {};
    
    $E = J.event;
    /*
         经典的彩蛋必备代码:老外称之为 Tweetable Konami code
        [上上下下左右左右BA]
        var k=[];
        addEventListener("keyup",function(e){ 
           k.push(e.keyCode);
           if(k.toString().indexOf("38,38,40,40,37,39,37,39,66,65")>=0){      
               cheat();
           }
        },true);
        
        什么不知道 Konami Code? 只能说明你没童年了 - -!
        http://en.wikipedia.org/wiki/Konami_Code
     */
    //az
    /**
     * standardize the ie event
     * @ignore
     */
    standardizeEvent = function(e, element){
        if(!e){
            e = window.event;
        }
        var element = element || e.srcElement;
        var eventDocument = document,
            doc = eventDocument.documentElement,
            body = eventDocument.body;
        /**
         * @ignore
         */
        var event = 
        /**
         * @ignore
         */
        {
            _event: e,// In case we really want the IE event object
            
            type: e.type,           // Event type
            target: e.srcElement,   // Where the event happened
            currentTarget: element, // Where we're handling it
            relatedTarget: e.fromElement ? e.fromElement : e.toElement,
            eventPhase: (e.srcElement == element) ? 2 : 3,

            // Mouse coordinates
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            layerX: e.offsetX,
            layerY: e.offsetY,
            pageX: e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0),
            pageY: e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0),
            wheelDelta: e.wheelDelta,
            
           // Key state
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            //原有的charCode
            charCode: e.keyCode,
            
            //keyCode
            keyCode: e.keyCode,
            /*
             * keyCode 值附表：
             * ===============================
             * 
             * 1.主键盘区字母和数字键的键码值
             * 按键   键码
             * 0    48
             * 1    49
             * 2    50
             * 3    51
             * 4    52
             * 5    53
             * 6    54
             * 7    55
             * 8    56
             * 9    57
             * 
             * A    65
             * B    66
             * C    67
             * D    68
             * E    69
             * F    70
             * G    71
             * H    72
             * I    73
             * J    74
             * K    75
             * L    76
             * M    77
             * N    78
             * O    79
             * P    80
             * Q    81
             * R    82
             * S    83
             * T    84
             * U    85
             * V    86
             * W    87
             * X    88
             * Y    89
             * Z    90
             * 
             * 
             * 3.控制键键码值
             * 按键           键码
             * BackSpace    8
             * Tab          9
             * Clear        12
             * Enter        13
             * Shift        16
             * Control      17
             * Alt          18
             * Cape Lock    20
             * Esc          27
             * Spacebar     32 
             * Page Up      33
             * Page Down    34
             * End          35
             * Home         36
             * Left Arrow   37
             * Up Arrow     38
             * Right Arrow  39
             * Down Arrow   40
             * Insert       45
             * Delete       46
             * 
             * Num Lock     144
             * 
             * ;:           186
             * =+           187
             * ,<           188
             * -_           189
             * .>           190
             * /?           191
             * `~           192
             * 
             * [{           219
             * \|           220
             * }]           221
             * ’"           222
             * 
             * 2.功能键键码值
             * F1   112
             * F2   113
             * F3   114
             * F4   115
             * F5   116
             * F6   117
             * F7   118
             * F8   119
             * F9   120
             * F10  121
             * F11  122
             * F12  123
             * 
             * 2.数字键盘上的键的键码值
             * 按键   键码
             * 0    96
             * 1    97
             * 2    98
             * 3    99
             * 4    100
             * 5    101
             * 6    102
             * 7    103
             * 8    104
             * 9    105
             * 
             * *    106
             * +    107
             * Enter108
             * -    109
             * .    110
             * /    111
             * 
             */
            /**
             * @ignore
             */
            stopPropagation: function(){
                this._event.cancelBubble = true;
            },
            /**
             * @ignore
             */
            preventDefault: function(){
                this._event.returnValue = false;
            }
        }
        /*
         *  relatedTarget 事件属性返回与事件的目标节点相关的节点。
         *  对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。
         *  对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
         *  对于其他类型的事件来说，这个属性没有用。
         *  az 2011/3/11
         */
        var eventType = e.type.toLowerCase();
        if(eventType == 'mouseover'){
            event.relatedTarget = e.fromElement;
        }else if(eventType == 'mouseout'){
            event.relatedTarget = e.toElement;
        }
        
        if(!J.isUndefined(e.button)){
            var v = e.button;
            var btnCodeMap = {
                0: -1,//取消原来的值
                1: 0,//左键
                2: 2,//右键
                3: -1,//取消原来的值
                4: 1//中键
            };
            /*
             * ie 的鼠标按键值
             * 0 没按键 
             * 1 按左键 
             * 2 按右键 
             * 3 按左右键 
             * 4 按中间键 
             * 5 按左键和中间键 
             * 6 按右键和中间键 
             * 7 按所有的键
             */
            if(!J.isUndefined(btnCodeMap[v])){
                event.button = btnCodeMap[v];
            }else{
                event.button = v;
            }
        }
        return event;
    };
    
    // From: David Flanagan.
    
    // In IE 5 and later, we use attachEvent( ) and detachEvent( ), with a number of
    // hacks to make them compatible with addEventListener and removeEventListener.
    if (J.browser.ie/*document.attachEvent*/) {//这里不能用特性判断, 否则opera也会使用这个方法绑定事件
        //ie都用这个方法是因为ie9对标准的addEventListener支持不完整
        /**
         * 兼容ie的写法
         * @ignore
         */
        addEventListener = function(element, eventType, handler,options) {
            if(customEvent["on"+eventType]){
                customEvent["on"+eventType](element, eventType, handler,options);
                return;
            }
            addOriginalEventListener(element, eventType, handler);
        };
        /**
         * @ignore
         */
        addOriginalEventListener = function(element, eventType, handler) {
            if ($E._find(arguments) != -1){
                return;
            }
            /**
             * @ignore
             */
            var wrappedEvent = function(e){
                
                var event = standardizeEvent(e, element);

                if (Function.prototype.call){
                    handler.call(element, event);
                }else {
                    // If we don't have Function.call, fake it like this.
                    element._currentHandler = handler;
                    element._currentHandler(event);
                    element._currentHandler = null;
                }
            };
    
            // Now register that nested function as our event handler.
            element.attachEvent("on" + eventType, wrappedEvent);
    

            var h = {
                element: element,
                eventType: eventType,
                handler: handler,
                wrappedEvent: wrappedEvent
            };
    

            var d = element.document || element;
            // Now get the window associated with that document.
            var w = d.parentWindow || window;
    
            // We have to associate this handler with the window,
            // so we can remove it when the window is unloaded.
            var id = $E._uid();  // Generate a unique property name
            if (!w._allHandlers) w._allHandlers = {};  // Create object if needed
            w._allHandlers[id] = h; // Store the handler info in this object
    
            // And associate the id of the handler info with this element as well.
            if (!element._handlers) element._handlers = [];
            element._handlers.push(id);
    
            // If there is not an onunload handler associated with the window,
            // register one now.
            if (!w._onunloadEventRegistered) {
                w._onunloadEventRegistered = true;
                w.attachEvent("onunload", $E._removeAllEvents);
            }
        };
        
        /**
         * 兼容ie的写法
         * @ignore
         */
        removeEventListener = function(element, eventType, handler) {
            if(customEvent["off"+eventType]){
                customEvent["off"+eventType](element, eventType,handler);
                return;
            }
            if(arguments.length == 3){
                removeOriginalEventListener(element, eventType, handler);
            }else{
                removeOriginalEventListener(element, eventType);
            }
        };
        /**
         * @ignore
         */
        removeOriginalEventListener = function(element, eventType, handler) {
            // Find this handler in the element._handlers[] array.
            var handlersIndex = $E._find(arguments);
            if (handlersIndex == -1) return;  // If the handler was not registered, do nothing
            // Get the window of this element.
            var d = element.document || element;
            var w = d.parentWindow || window;
            for(var j=0; j<handlersIndex.length; j++){
                var i = handlersIndex[j];
                // Look up the unique id of this handler.
                var handlerId = element._handlers[i];
                // And use that to look up the handler info.
                var h = w._allHandlers[handlerId];
                // Using that info, we can detach the handler from the element.
                element.detachEvent("on" + h.eventType, h.wrappedEvent);
                // Remove one element from the element._handlers array.
                element._handlers[i]=null;
                element._handlers.splice(i, 1);
                // And delete the handler info from the per-window _allHandlers object.
                delete w._allHandlers[handlerId];
            }
            if(element._handlers && element._handlers.length==0){
                element._handlers=null;
            }
        };
    
        // A utility function to find a handler in the element._handlers array
        // Returns an array index or -1 if no matching handler is found
        $E._find = function(args) {
            var element = args[0],
                eventType = args[1],
                handler = args[2],
                handlers = element._handlers;
                
            if (!handlers){
                return -1;  // if no handlers registered, nothing found
            }
    
            // Get the window of this element
            var d = element.document || element;
            var w = d.parentWindow || window;
    
            var handlersIndex = [];

            if(args.length === 3){
                // Loop through the handlers associated with this element, looking
                // for one with the right type and function.
                // We loop backward because the most recently registered handler
                // is most likely to be the first removed one.
                for(var i = handlers.length-1; i >= 0; i--) {
                    var handlerId = handlers[i];        // get handler id
                    var h = w._allHandlers[handlerId];  // get handler info
                    // If handler info matches type and handler function, we found it.
                    if (h.eventType == eventType && h.handler == handler){
                        handlersIndex.push(i);
                        return handlersIndex;
                    }
                }
            }else if(args.length === 2){
                
                for(var i = handlers.length-1; i >= 0; i--) {
                    var handlerId = handlers[i];        // get handler id
                    var h = w._allHandlers[handlerId];  // get handler info
                    // If handler info matches type and handler function, we found it.
                    if (h.eventType == eventType){
                        handlersIndex.push(i);
                    }
                }
                if(handlersIndex.length>0){
                    return handlersIndex;
                }
                
            }else if(args.length === 1){

                for(var i = handlers.length-1; i >= 0; i--) {
                    handlersIndex.push(i);
                }
                if(handlersIndex.length>0){
                    return handlersIndex;
                }
            }
            
            
            
            
            
            
            return -1;  // No match found
        };
    
        $E._removeAllEvents = function( ) {
            // This function is registered as the onunload handler with
            // attachEvent. This means that the this keyword refers to the
            // window in which the event occurred.
            var id,
                w = this;
    
            // Iterate through all registered handlers
            for(id in w._allHandlers) {
                // It would throw a refused access error
                // so I catch it. by azrael.
//                try{
//                    J.out('RemoveEvent: ' + id, 'RemoveAllEvents');
                    // Get handler info for this handler id
                    var h = w._allHandlers[id];
                    // Use the info to detach the handler
                    h.element.detachEvent("on" + h.eventType, h.wrappedEvent);
                    h.element._handlers=null;
                    // Delete the handler info from the window
                    delete w._allHandlers[id];
//                }catch(e){
//                    J.out('RemoveEventError: ' + e, 'RemoveAllEvents');
//                }
            }
        }
    
        // Private utility to generate unique handler ids
        $E._counter = 0;
        $E._uid = function(){
            return "h" + $E._counter++;
        };
    }
    // In DOM-compliant browsers, our functions are trivial wrappers around
    // addEventListener( ) and removeEventListener( ).
    else if (document.addEventListener) {
        /**
         * 
         * 添加事件监听器
         * 
         * @method addEventListener
         * @memberOf event
         * 
         * @param element 元素
         * @param eventType 事件类型，不含on
         * @param handler 事件处理器
         * @return {Element} 返回元素
         */
        addEventListener = function(element, eventType, handler, options) {
            //var id = $E._uid( );  // Generate a unique property name
            if(customEvent["on"+eventType]){
                customEvent["on"+eventType](element, eventType, handler, options);
                return;
            }
            addOriginalEventListener(element, eventType, handler);
        };
        /**
         * @ignore
         */
        addOriginalEventListener = function(element, eventType, handler) {
            var isExist = false;
            if(!element){
                J.out('targetModel undefined:'+eventType+handler);
            }
            if(!element._eventTypes){
                element._eventTypes = {};
            }
            if (!element._eventTypes[eventType]){
                element._eventTypes[eventType] = [];
            }
            element.addEventListener(eventType, handler, false);
            
            var handlers= element._eventTypes[eventType];
            for(var i=0; i<handlers.length; i++){
                if(handlers[i] == handler){
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
                handlers.push(handler);
            }
        };
        
        /**
         * 
         * 移除事件监听器
         * 
         * @memberOf event
         * @method removeEventListener
         * 
         * @param element 元素
         * @param eventType 事件类型，不含on
         * @param handler 事件处理器
         * @return {Element} 返回元素
         */
        removeEventListener = function(element, eventType, handler) {
            if(customEvent["off"+eventType]){
                customEvent["off"+eventType](element, eventType,handler);
                return;
            }
            if(arguments.length == 3){
                removeOriginalEventListener(element, eventType, handler);
            }else{
                removeOriginalEventListener(element, eventType);
            }
        };
        /**
         * @ignore
         */
        removeOriginalEventListener = function(element, eventType, handler) {
            if(eventType){
                if(arguments.length == 3){//修复传入了第三个参数,但是第三个参数为 undefined 的问题
                    if(handler){
                        element.removeEventListener(eventType, handler, false);
                        if(element._eventTypes && element._eventTypes[eventType]){
                            var handlers = element._eventTypes[eventType];
                            for(var i=0; i<handlers.length; i++){
                                if(handlers[i] === handler){
                                    handlers[i]=null;
                                    handlers.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }else{
//                        J.out('removeEventListener: handler is undefined. \n caller: '+ removeEventListener.caller);
                        //J.out('removeEventListener: handler is undefined. \n element: '+ element + ', eventType:' + eventType);
                    }
                }else{
                    
                    if(element._eventTypes && element._eventTypes[eventType]){
                        var handlers = element._eventTypes[eventType];
                        
                        for(var i=0; i<handlers.length; i++){
                            element.removeEventListener(eventType, handlers[i], false);
                        }
                        element._eventTypes[eventType] = [];
                    }
                    
                }
            }else{
                if(element._eventTypes){
                    var eventTypes = element._eventTypes;
                    for(var p in eventTypes){
                        var handlers = element._eventTypes[p];
                        for(var i=0; i<handlers.length; i++){
                            element.removeEventListener(p, handlers[i], false);
                        }
                    }
                    eventTypes = {};
                }
            }
            
        };
    }
    customEvent = {
        "ondrag" : function(element, eventType, handler){
            var _oldX,
                _oldY,
                isMove=false,
                orientMousedownEvent;
            var onElMousedown = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                orientMousedownEvent = e;
                if(J.browser.mobileSafari){
                    //console.info("touchstart");
                    e.stopPropagation();
                    touch = e.touches[0];
                    _oldX= touch.pageX;
                    _oldY= touch.pageY;
                }else{
                    //TODO 这里阻止了事件冒泡,可能会有问题
                    e.stopPropagation();
                    e.preventDefault();
                    _oldX= e.clientX;
                    _oldY= e.clientY;
                }
                isMove=false;
                if(J.browser.mobileSafari){
                    $E.addEventListener(document, "touchmove", onElMousemove);
                    $E.addEventListener(element, "touchend", onElMouseup);
                }else{
                    $E.addEventListener(document, "mousemove", onElMousemove);
                }
//                J.out('onElMousedown: '+e.target.id );
            };
            var onElMousemove = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var x,y,touch;
                e.stopPropagation();
                if(J.browser.mobileSafari){
                    //console.info("touchmove");
                    touch = e.changedTouches[0];
                    x= touch.pageX;
                    y= touch.pageY;
                }else{
                    x = e.clientX;
                    y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)>2) {
//                    J.out("customdrag");
                    //console.info("customdrag");
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(document, "touchmove", onElMousemove);
                        $E.removeEventListener(element, "touchend", onElMouseup);
                    }else{
                        $E.removeEventListener(document, "mousemove", onElMousemove);
                    }
                    if(!isMove){
                        handler.call(element,e);
                        isMove=true;
                    }
                }else{
                    //console.info( Math.abs(_oldX-x)+Math.abs(_oldY-y)>2 )
                }
            };
            var onElMouseup = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                /*
                var x,y,touch;
                if(J.browser.mobileSafari){
                    touch = e.touches[0];
                    _oldX= touch.pageX;
                    _oldY= touch.pageY;
                }else{
                    x = e.clientX;
                    y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)<2) {
                    isMove=false;
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(document, "touchmove", onElMousemove);
                    }else{
                        $E.removeEventListener(document, "mousemove", onElMousemove);
                    }
                }else{
                    
                }
                */
                //console.info("touch end");
                if(J.browser.mobileSafari){
                    $E.removeEventListener(document, "touchmove", onElMousemove);
                    if(!isMove){
                        //console.info("not draging");
                        /*
                        var point = e.changedTouches[0];
                        target = document.elementFromPoint(point.pageX,point.pageY); 
                        if(target.tagName=="IFRAME"){
                            return;
                        }else{
                        }
                        // Create the fake event
                        ev = document.createEvent('MouseEvents');
                        ev.initMouseEvent('click', true, true, e.view, 1,
                            point.screenX, point.screenY, point.clientX, point.clientY,
                            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                            0, null);
                        ev._fake = true;
                        target.dispatchEvent(ev);
                        */
                    }else{
                        e.stopPropagation();
                        e.preventDefault();
                        //console.info("is draging");
                    }
                }else{
                    $E.removeEventListener(document, "mousemove", onElMousemove);
                    if(!isMove){
                        //@TODO fire the event
                    }
                }
            };
            if(J.browser.mobileSafari){
                $E.addEventListener(element, "touchstart", onElMousedown);
            }else{
                $E.addEventListener(element, "mousedown", onElMousedown);
                $E.addEventListener(element, "mouseup", onElMouseup);
            }
//            J.out('element: ' + element.id);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[onElMousedown,onElMouseup]});
        },
        "offdrag" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchstart",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "touchend",customEventHandlers[i].actions[1]);
                    }else{
                        $E.removeEventListener(element, "mousedown",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "mouseup",customEventHandlers[i].actions[1]);
                    }
                    customEventHandlers.splice(i,1);
                    break;
                }
            }
        },
        "oncustomclick" : function(element, eventType, handler, options){//@ longTouchable 是否触发长按事件 add by ip
            var _oldX,
                _oldY,
                isMove=false,
                isClicked = false,
                timeStamp=0,
                longTouchTimer,
                options= options?options:{},
                longtouchable = options.longtouchable,
                mouseButton = -1;
            var onElMousedown = function(e){
//                console.log('1: ' + e.button);
                timeStamp = e.timeStamp;
                isMove = false;
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    _oldX = touch.pageX;
                    _oldY = touch.pageY;
                }else{
                    _oldX = e.clientX;
                    _oldY = e.clientY;
                }
                isClicked = false;
                if(longtouchable){
                    longTouchTimer = setTimeout(function(){
                        if(isMove || isClicked){
                            return;
                        }
                        var clickTime = 2000;//TODO (new Date()).getTime() - timeStamp;
                        //console.info('setTimeout',clickTime);
                        if(J.browser.mobileSafari){
                            $E.removeEventListener(element, "touchmove",onElMouseMove);
                            $E.removeOriginalEventListener(element, "touchend",onElClick);
                        }else{
                            $E.removeEventListener(element, "mousemove",onElMouseMove);
                            $E.removeOriginalEventListener(element, "click",onElClick);
                        }
                        handler.call(element,e,clickTime);
                    },1000);
                }
                if(J.browser.mobileSafari){
                    $E.addEventListener(element, "touchmove", onElMouseMove);
                    $E.addOriginalEventListener(element, "touchend", onElClick);
                }else{
                    $E.addEventListener(element, "mousemove", onElMouseMove);
                    $E.addOriginalEventListener(element, "click", onElClick);
                }
//                e.preventDefault();
//                e.stopPropagation();
            };    
            var onElMouseup = function(e){
                mouseButton = e.button;
//                console.log('2: ' + e.button);
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }
            };
            var onElMouseMove = function(e){
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }else{
                    var x = e.clientX;
                    var y = e.clientY;
                }
                isMove = Math.abs(_oldX-x)+Math.abs(_oldY-y) > 1;
                if(isMove){
                    clearTimeout(longTouchTimer);
                    longTouchTimer = null;
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchmove",onElMouseMove);
                        $E.removeOriginalEventListener(element, "touchend",onElClick);
                    }else{
                        $E.removeEventListener(element, "mousemove",onElMouseMove);
                        $E.removeOriginalEventListener(element, "click",onElClick);
                    }
                }
            }
            var onElClick = function(e){
                //console.info('clicked');
                clearTimeout(longTouchTimer);
                longTouchTimer = null;
                isClicked = true;
                if(!J.browser.mobileSafari && mouseButton !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                var clickTime = 0;//e.timeStamp - timeStamp;
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }else{
                    var x = e.clientX;
                    var y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)<1) {
                    isMove=false;
//                    J.out("this is a customclick","click");
                    //console.info('customclick');
//                  if(eventType=="click"){
                        handler.call(element,e,clickTime);
//                  }
                }else{
                    //console.info('not customclick');
                }
            };
            if(J.browser.mobileSafari){
                $E.addEventListener(element, "touchstart", onElMousedown);
            }else{
                $E.addEventListener(element, "mousedown", onElMousedown);
                $E.addEventListener(element, "mouseup", onElMouseup);
            }
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[onElMousedown,onElMouseMove,onElMouseup,onElClick]});
        },
        "offcustomclick" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchstart",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "touchmove",customEventHandlers[i].actions[1]);
                        $E.removeOriginalEventListener(element, "touchend",customEventHandlers[i].actions[3]);
                    }else{
                        $E.removeEventListener(element, "mousedown",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "mousemove",customEventHandlers[i].actions[1]);
                        $E.removeEventListener(element, "mouseup",customEventHandlers[i].actions[2]);
                        $E.removeOriginalEventListener(element, "click",customEventHandlers[i].actions[3]);
                    }
                    customEventHandlers.splice(i,1);
                    break;
                }
            }
        },
        "oncontextmenu" : function(element, eventType, handler){
            if(J.browser.ie == 9){
                /**
                 * @ignore
                 */
                var wrappedEvent = function(e){
                    var event = standardizeEvent(e, element);
                    handler.call(element, event);
                };
                element.attachEvent('oncontextmenu', wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
            }else{
                $E.addOriginalEventListener(element, eventType, handler);
            }
        },
        "offcontextmenu" : function(element, eventType, handler){
            if(J.browser.ie == 9){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        element.detachEvent('oncontextmenu', customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
            }else{
                $E.removeOriginalEventListener(element, eventType, handler);
            }
        },
        "onmousewheel" : function(element, eventType, handler){
            if(J.browser.firefox){
                var wrappedEvent = function(e){
                    e.wheelDelta = -40*e.detail;
                    handler.call(element, e);
                };
                $E.addOriginalEventListener(element, "DOMMouseScroll", wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
            }else{
                $E.addOriginalEventListener(element, "mousewheel" , handler);
            }
        },
        "offmousewheel" : function(element, eventType, handler){
            if(J.browser.firefox){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        $E.removeOriginalEventListener(element, "DOMMouseScroll", customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
            }else{
                $E.removeOriginalEventListener(element, "mousewheel", handler);
            }
        },
        "onmouseenter" : function(element, eventType, handler){
            var onElMouseEnter = function(e){
                var s = e.relatedTarget;
                if(!s){//relatedTarget为null, 鼠标浏览器外移进来
                    handler.call(this, e);
                }else if(this.compareDocumentPosition){//非ie
                    var res = this.compareDocumentPosition(s);
                    if(!(s == this || res == 20 || res == 0)){
                        handler.call(this, e);
                    }
                }else{
                    if(!(s == this || this.contains(s))){
                        handler.call(this, e);
                    }
                }
            };
                        
            $E.addEventListener(element, "mouseover", onElMouseEnter);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler, actions: [onElMouseEnter]});
        },
        "offmouseenter" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    $E.removeEventListener(element, "mouseover",customEventHandlers[i].actions[0]);
                    customEventHandlers.splice(i, 1);
                    break;
                }
            }
        },
        "onmouseleave" : function(element, eventType, handler){
            var onElMouseLeave = function(e){
                var s = e.relatedTarget;
                if(!s){//relatedTarget为null, 鼠标移到浏览器外了
                    handler.call(this, e);
                }else if(this.compareDocumentPosition){//非ie
                    var res = this.compareDocumentPosition(s);
                    if(!(res == 20 || res == 0)){
                        handler.call(this, e);
                    }
                }else{
                    if(!this.contains(s)){
                        handler.call(this, e);
                    }
                }
            };
            $E.addEventListener(element, "mouseout", onElMouseLeave);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler, actions: [onElMouseLeave]});
        },
        "offmouseleave" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    $E.removeEventListener(element, "mouseout",customEventHandlers[i].actions[0]);
                    customEventHandlers.splice(i, 1);
                    break;
                }
            }
        },
        "oninput" : function(element, eventType, handler){
            if(J.browser.ie){
                /**
                 * @ignore
                 */
                var wrappedEvent = function(e){
                    if(e.propertyName.toLowerCase() == "value"){
                        var event = standardizeEvent(e, element);
                        handler.call(element, event);
                    }
                };
                element.attachEvent("onpropertychange", wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
                if(J.browser.ie==9){ //fix ie9 bug, can not fire when characters are deleted
                    $E.addOriginalEventListener(element, "change" , handler);
                }
            }else{
                $E.addOriginalEventListener(element, "input" , handler);
            }
        },
        "offinput" : function(element, eventType, handler){
            if(J.browser.ie){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        element.detachEvent("onpropertychange", customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
                if(J.browser.ie==9){
                    $E.removeOriginalEventListener(element, "change" , handler);
                }
            }else{
                $E.removeOriginalEventListener(element, "input", handler);
            }
        }
        
    }
    
    
    
    
    
    
    
    
    /**
     * 
     * 文档加载完成时事件监听器
     * 
     * @method onDomReady
     * @memberOf event
     * 
     * @param element 元素
     * @param eventType 事件类型，不含on
     * @param handler 事件处理器
     */
    onDomReady = function( f ) {
        // If the DOM is already loaded, execute the function right away
        if ( onDomReady.done ) {
            return f();
        }
    
        // If we’ve already added a function
        if ( onDomReady.timer ) {
            // Add it to the list of functions to execute
            onDomReady.ready.push( f );
        } else {
            // 初始化onDomReady后要执行的function的数组
            onDomReady.ready = [ f ];
            
            // Attach an event for when the page finishes  loading,
            // just in case it finishes first. Uses addEvent.
            $E.on(window, "load", isDomReady);
    
            //  Check to see if the DOM is ready as quickly as possible
            onDomReady.timer = window.setInterval( isDomReady, 300 );
        }
    }
    
    /**
     * 
     * 判断文档加载是否完成
     * 
     * @method isDomReady
     * @memberOf event
     * 
     * @param element 元素
     * @param eventType 事件类型，不含on
     * @param handler 事件处理器
     */
    // Checks to see if the DOM is ready for navigation
    isDomReady = function() {
        // If we already figured out that the page is ready, ignore
        if ( onDomReady.done ) {
            return true;
        }
    
        // Check to see if a number of functions and elements are
        // able to be accessed
        if ( document && document.getElementsByTagName && document.getElementById && document.body ) {
            // Remember that we’re now done
            onDomReady.done = true;
            
            // If they’re ready, we can stop checking
            window.clearInterval( onDomReady.timer );
            onDomReady.timer = null;
    
            // Execute all the functions that were waiting
            for ( var i = 0; i < onDomReady.ready.length; i++ ){
                onDomReady.ready[i]();
            }

            onDomReady.ready = null;
            
            return true;
        }
    }
    
    
    
    
    /**
     * 创建一个消息源发布者的类
     * 
     * @class Publish
     * @return {Object} 返回生成的消息源
     * @memberOf event
     * @constructor
     * @example
     * Jx().$package(function(J){
     *     var onMsg = new J.Publish();
     *  var funcA = function(option){
     *      alert(option);
     *  };
     *  // 注册一个事件的观察者
     *     onMsg.subscribe(funcA);
     *     var option = "demo";
     *     onMsg.deliver(option);
     *     onMsg.unsubscribe(funcA);
     *     onMsg.deliver(option);
     *     
     * };
     * 
     */
    Publish = function(){
        this.subscribers = [];
    };
    
    /**
     * 注册观察者
     * @memberOf event.Publish.prototype
     * @function
     * @param {Function} func 要注册的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.subscribe = function(func){
        var alreadyExists = J.array.some(this.subscribers, function(el){
            return el === func;
        });
        if(!alreadyExists){
            this.subscribers.push(func);
        }
        return func;
    };
    
    /**
     * 触发事件
     * @memberOf event.Publish.prototype
     * @param {Mixed} msg 要注册的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.deliver = function(msg){
        J.array.forEach(this.subscribers, function(fn){
            fn(msg);
        });
    };
    
    /**
     * 注销观察者
     * @memberOf event.Publish.prototype
     * @param {Function} func 要注销的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.unsubscribe = function(func){
        this.subscribers = J.array.filter(this.subscribers, function(el){
            return el !== func;
        });
        return func;
    };
    
    
    
    
    
    
    
    
    /**
     * 
     * 为自定义Model添加事件监听器
     * 
     * @method addObserver
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察的目标
     * @param eventType 事件类型，不含on
     * @param handler 观察者要注册的事件处理器
     */
    addObserver = function(targetModel, eventType, handler){
        var handlers,
            length,
            index,
            i;
        if(handler){
            
        
            // 转换成完整的事件描述字符串
            eventType = "on" + eventType;
            
            // 判断对象是否含有$events对象
            if(!targetModel._$events){
                targetModel._$events={};
            }
            
            // 判断对象的$events对象是否含有eventType描述的事件类型
            if(!targetModel._$events[eventType]){
                //若没有则新建
                targetModel._$events[eventType] = [];
            }else if(targetModel._$events[eventType].length == 0){
                //bug: ie会有引用泄漏的问题, 如果数组为空, 则重新创建一个
                targetModel._$events[eventType] = [];
            }
        
            handlers = targetModel._$events[eventType];
            length = handlers.length;
            index = -1;
        
            // 通过循环，判断对象的handlers数组是否已经含有要添加的handler
            for(i=0; i<length; i++){
                
                var tempHandler = handlers[i];

                if(tempHandler == handler){
                    index = i;
                    break;
                }        
            }
            // 如果没有找到，则加入此handler
            if(index === -1){
                handlers.push(handler);
                //alert(handlers[handlers.length-1])
            }
        }else{
            J.out(">>> 添加的观察者方法不存在："+targetModel+eventType+handler);
        }
    };
    /**
     * 
     * 批量为自定义Model添加事件监听器
     * 
     * @method addObservers
     * @memberOf event
     * 
     * @param obj 目标 model，即被观察的目标
     *     obj = { targetModel : {eventType:handler,eventType2:handler2...} , targetModel2: {eventType:handler,eventType2:handler2...}  }
     */
    addObservers = function(obj){
        //TODO 这里的代码是直接复制addObserver的（为避免太多函数调用耗费栈）
        var t=obj['targetModel'];
        var m=obj['eventMapping'];
        for(var i in m){
            addObserver(t,i,m[i]);
        }
    
    };
    /**
     * 
     * 触发自定义Model事件的监听器
     * 
     * @method notifyObservers
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察目标
     * @param eventType 事件类型，不含on
     * @param options 触发的参数对象
     * @return {Boolean} 
     */
    notifyObservers = function(targetModel, eventType, argument){/*addInvokeTime(eventType);*/
        var handlers,
            i;
            
        eventType = "on" + eventType;
        var flag = true;
        if(targetModel._$events && targetModel._$events[eventType]){
            handlers = targetModel._$events[eventType];
            if(handlers.length > 0){
                // 通过循环，执行handlers数组所包含的所有函数function
                for(i=0; i<handlers.length; i++){
                    if(handlers[i].apply(targetModel, [argument]) === false){
                        flag = false;
                    }
                }
                //return flag;
            }
        }else{
            // throw new Error("还没有定义 [" + targetModel + "] 对象的: " + eventType + " 事件！");
            //return false;
        }
        return flag;
    };
    
    
    /**
     * 
     * 为自定义 Model 移除事件监听器
     * 
     * @method removeObserver
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察的目标
     * @param eventType 事件类型，不含on
     * @param handler 观察者要取消注册的事件处理器
     */
    // 按照对象和事件处理函数来移除事件处理函数
    removeObserver = function(targetModel, eventType, handler){
        var i,
            j,
            flag = false,
            handlers,
            length,
            events = targetModel._$events;
        if(handler){
            
            if(events){
                eventType = "on" + eventType;
                handlers = events[eventType];
                
                if(handlers){
                    length = handlers.length;
                    for(i=0; i<length; i++){
                        //由==修改为===
                        if(handlers[i] == handler){
                            handlers[i] = null;
                            handlers.splice(i, 1);
                            flag = true;
                            break;
                        }    
                    }
                }
                
                
            }
        }else if(eventType){
            if(events){
                eventType = "on" + eventType;
                handlers = events[eventType];
                if(handlers){
                    length = handlers.length;
                    for(i=0; i<length; i++){
                        handlers[i] = null;
                    }
                    delete events[eventType];
                    flag = true;
                }
                
            }
            
        }else if(targetModel){
            if(events){
                for(i in events){
                    delete events[i];
                }
                delete targetModel._$events;
                flag = true;
            }
        }
        return flag;
    };
    
    $E.addEventListener = addEventListener;
    $E.removeEventListener = removeEventListener;
    $E.addOriginalEventListener = addOriginalEventListener;
    $E.removeOriginalEventListener = removeOriginalEventListener;
    // alias
    $E.on = $E.addEventListener;
    $E.off = $E.removeEventListener;
    
    $E.onDomReady = onDomReady;
    
    $E.Publish = Publish;
    
    // Model 事件方法
    $E.addObserver = addObserver;
    $E.addObservers = addObservers;
    $E.notifyObservers = notifyObservers;
    $E.removeObserver = removeObserver;
});
