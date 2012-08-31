/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jet.http
 *
 * Need package:
 * jet.core.js
 * 
 */

/**
 * 1.[Browser part]: http 包,含有ajax,comet,loadScript,loadCss封装
 */
Jx().$package(function(J){
    var $=J.dom.id,
        $D=J.dom,
        $E=J.event,
        ajax,
        comet,
        load,
        loadCss,
        loadScript,
        formSend;
    
    // 兼容不同浏览器的 Adapter 适配层
    if(typeof window.XMLHttpRequest === "undefined"){
        /**
         * @ignore
         */
        window.XMLHttpRequest = function(){
            return new window.ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >=0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
        };
    }
    
    /**
     * http 名字空间
     * 
     * @namespace
     * @name http
     */
    J.http = J.http || {};

    /**
     * 这是Ajax对象名字空间的一个方法
     * 
     * @memberOf http
     * @method  ajax
     * 
     * @param {String} uri 要加载的数据的uri
     * @param {Object} option 配置对象，如：isAsync,data,arguments,onSuccess,onError,onComplete,onTimeout,timeout,contentType,type
     * @return {Object} ajax 返回一个ajax对象，可以abort掉
     */
    ajax = function(uri, option){
        var httpRequest,
            httpSuccess,
            timeout,
            isTimeout = false,
            isComplete = false;
        
        option = {
            method: (option.method || "GET").toUpperCase(),
            data: option.data || null,
            arguments: option.arguments || null,

            onSuccess: option.onSuccess || function(){},
            onError: option.onError || function(){},
            onComplete: option.onComplete || function(){},
            //尚未测试
            onTimeout: option.onTimeout || function(){},

            isAsync: option.isAsync || true,
            timeout: option.timeout || 30000,
            contentType: option.contentType,
            type: option.type || "xml"
        };
        if(option.data && typeof option.data === "object"){
            option.data = J.string.toQueryString(option.data);
        }

        uri = uri || "";
        timeout = option.timeout;
        
        httpRequest = new window.XMLHttpRequest();

        /**
         * @ignore
         */
        httpSuccess = function(r){
            try{
                return (!r.status && location.protocol == "file:")
                    || (r.status>=200 && r.status<300)
                    || (r.status==304)
                    || (navigator.userAgent.indexOf("Safari")>-1 && typeof r.status=="undefined");
            }catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
            return false;
        }
        
        /**
         * @ignore
         */
        httpRequest.onreadystatechange=function (){
            if(httpRequest.readyState==4){
                if(!isTimeout){
                    var o={};
                        o.responseText = httpRequest.responseText;
                        o.responseXML = httpRequest.responseXML;
                        o.data= option.data;
                        o.status= httpRequest.status;
                        o.uri=uri;
                        o.arguments=option.arguments;
                        if(option.type === 'json'){
                            try{
                                o.responseJSON = J.json.parse(httpRequest.responseText);
                            }catch(e){
                            }
                        }
                    if(httpSuccess(httpRequest)){
                        option.onSuccess(o);
                    }else{
                        option.onError(o);
                    }
                    option.onComplete(o);
                }
                isComplete = true;
                //删除对象,防止内存溢出
                httpRequest=null;
            }
        };
        
        if(option.method === "GET"){
            if(option.data){
                uri += (uri.indexOf("?")>-1?"&":"?") + option.data;
                option.data = null;
            }
            httpRequest.open("GET", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type",option.contentType || "text/plain;charset=UTF-8");
            httpRequest.send();
        }else if(option.method === "POST"){
            httpRequest.open("POST", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type",option.contentType || "application/x-www-form-urlencoded;charset=UTF-8");
            httpRequest.send(option.data);
        }else{
            httpRequest.open(option.method, uri, option.isAsync);
            httpRequest.send();
        }
        
        window.setTimeout(function(){
            var o;
            if(!isComplete){
                isTimeout = true;
                o={};
                o.uri=uri;
                o.arguments=option.arguments;
                option.onTimeout(o);
                option.onComplete(o);
            }
        }, timeout);    
        
        return httpRequest;
    };

    
    /**
     * comet方法
     * 
     * @memberOf http
     * @method  comet
     * @param {String} uri uri地址
     * @param {Object} option 配置对象
     * @return {Object} 返回一个comet dom对象
     */
    comet = function(uri, option){

        uri = uri || "";
        option = {
            method : option.method || "GET",
            data : option.data || null,
            arguments : option.arguments || null,
            callback : option.callback || function(){},
            onLoad : option.onLoad || function(){},

            contentType: option.contentType ? option.contentType : "utf-8"
        };

        var connection;
        if(J.browser.ie){
            var htmlfile = new ActiveXObject("htmlfile");
            htmlfile.open();
            htmlfile.close();
            var iframediv = htmlfile.createElement("div");
            htmlfile.appendChild(iframediv);
            htmlfile.parentWindow._parent = self;
            iframediv.innerHTML = '<iframe id="_cometIframe" src="'+uri+'?callback=window.parent._parent.'+option.callback+'"></iframe>';
            
            connection = htmlfile.getElementById("_cometIframe");
        
        }
        else{
            connection = $D.node("iframe");
            connection.setAttribute("id", "_cometIframe");
            connection.setAttribute("src", uri+'?callback=window.parent._parent.'+option.callback);
            connection.style.position = "absolute";
            connection.style.visibility = "hidden";
            connection.style.left = connection.style.top = "-999px";
            connection.style.width = connection.style.height = "1px";
            document.body.appendChild(connection);
            self._parent = self;
        };

        $E.on(connection,"load", option.onLoad);

        return connection;
        
    };
    

    
    
    
    
    /**
     * 这是load方法
     * 
     * @memberOf http
     * @method load
     * 
     * @param {String} type 一个配置对象
     * @param {Object} option 一个配置对象
     * @return {Object} ajax 返回一个ajax对象
     */
    load = function(type, uri, option){
        var node,
            linkNode,
            scriptNode,
            id,
            head = document.getElementsByTagName("head") ? document.getElementsByTagName("head")[0] : document.documentElement,
            timer,
            isTimeout = false,
            isComplete = false,
            option = option || {},
            isDefer = option.isDefer || false,
            query = option.query || null,
            arguments = option.arguments || null,
            
            onSuccess = option.onSuccess || function(){},
            onError = option.onError || function(){},
            onComplete = option.onComplete || function(){},
            purge,
            //尚未测试
            onTimeout = option.onTimeout || function(){},

//          timeout = option.timeout ? option.timeout : 10000,
            timeout = option.timeout, //az 2011-2-21 修改为默认不需要超时
            charset = option.charset ? option.charset : "utf-8",
            win = option.win || window,
            o,
            
            getId;

        uri = uri || "";
        if(query !== null){
            uri = uri + "?" + query;
        }
        /**
         * @ignore
         */
        getId = function(){
            return load.Id++;
        };
        id = getId();
        
        /**
         * @ignore
         */
        purge = function(id){
            var el=$("jet_load_" + id)
            if(el){
                head.removeChild(el);
            }
        };

        /**
         * Generates a link node
         * @method _linkNode
         * @param uri {string} the uri for the css file
         * @param win {Window} optional window to create the node in
         * @return {HTMLElement} the generated node
         * @private
         */
        linkNode = function(uri, win, charset) {
            var c = charset || "utf-8";
            return $D.node("link", {
                        "id":       "jet_load_" + id,
                        "type":     "text/css",
                        "charset":  c,
                        "rel":      "stylesheet",
                        "href":     uri
                    }, win);
        };
        
        /**
         * Generates a script node
         * @method _scriptNode
         * @param uri {string} the uri for the script file
         * @param win {Window} optional window to create the node in
         * @return {HTMLElement} the generated node
         * @private
         */
        scriptNode = function(uri, win, charset, isDefer) {
            var c = charset || "utf-8";
            var node = $D.node("script", {
                        "id":       "jet_load_" + id,
                        "type":     "text/javascript",
                        "charset":  c,
                        "src":      uri
                    }, win);
            if(isDefer){
                node.setAttribute("defer", "defer");
            }
            
            return node;
        };
        
        
        
        if(type === "script"){
            node = option.node || scriptNode(uri, win, charset, isDefer);
        }else if(type === "css"){
            node = option.node || linkNode(uri, win, charset);
        }
        

        if(J.browser.engine.trident && parseInt(J.browser.ie)<9){
            /**
             * @ignore
             */
            node.onreadystatechange = function() {
                var rs = this.readyState;
                if (rs === "loaded" || rs === "complete") {
                    /**
                     * @ignore
                     */
                    node.onreadystatechange = null;

                    if(!isTimeout){
                        isComplete = true;
                        window.clearTimeout(timer);
                        timer = null;
                        o={};
                        o.id = id;
                        o.uri = uri;
                        o.arguments = arguments;
                        onSuccess(o);
                        onComplete(o);
                        //if(type === "script"){
                            //purge(id);
                        //}
                    }
                }
            };

        // webkit prior to 3.x is no longer supported
        }else if(J.browser.engine.webkit){
            // Safari 3.x supports the load event for script nodes (DOM2)
            $E.on(node, "load", function(){
                var o;
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = arguments;
                    onSuccess(o);
                    onComplete(o);
                    if(type === "script"){
                        purge(id);
                    }
                }
            });


        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        }else{ 
            /**
             * @ignore
             */
            node.onload = function(){
                var o;
                //J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = option.arguments;
                    onSuccess(o);
                    onComplete(o);
                    
                    if(type === "script"){
                        purge(id);
                    }
                }
            };
            /**
             * @ignore
             */
            node.onerror = function(e){
                var o;
                //J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = arguments;
                    o.error = e;
                    onError(o);
                    onComplete(o);
                    //if(type === "script"){
                        purge(id);
                    //}
                }
            };
        }
        
        
        if(option.node){
            if(type === "script"){
                node.src = uri;
            }else if(type === "css"){
                node.href = uri;
            }
        }else{
            head.appendChild(node);
        }
       
        
        if(type === "script"){
            if(timeout){
                timer = window.setTimeout(function(){
                    var o;
                    if(!isComplete){
                        isTimeout = true;
                        o = {};
                        o.uri = uri;
                        o.arguments = arguments;
                        onTimeout(o);
                        onComplete(o);
                        purge(id);
                    }
                }, timeout);
            }
        }
        /**
         * @ignore
         */
        var func = function(node){
            this._node = node;
            this._head = head;
        };
        func.prototype={
            /**
             * @ignore
             */
            abort:function(){
                this._node.src="";
                this._head.removeChild(this._node);
                delete this._node;
            }
            
        };
        return new func(node);
    };
    load.Id=0;
    
    /**
     * 加载CSS
     * 
     * @memberOf http
     * @method loadCss
     * 
     * @param {String} uri 要加载的css的uri
     * @param {Object} option 配置对象，如：isDefer,query,arguments,onSuccess,onError,onComplete,onTimeout,timeout,charset
     * @return {Object} ajax 返回一个ajax对象
     */
    loadCss = function(uri, option){
        return load("css", uri, option);
    };
    
    /**
     * 加载Javascript
     * 
     * @memberOf http
     * @method loadScript
     * 
     * @param {String} uri 要加载的js脚本的uri
     * @param {Object} option 配置对象，如：isDefer,query,arguments,onSuccess,onError,onComplete,onTimeout,timeout,charset
     * @return {Element} 返回控制对象，可以abort掉
     */
    loadScript = function(uri, option){
        return load("script", uri, option);
    };
    
    
    
    /**
     * TODO 这里的form send需要改造，建立一个iframe池，来处理并发问题
     */
    /**
     * @description formSend的iframe池，目前定为长度为2
     * @type {Object}
     */
    var divEl;
    var formSendIframePool = {
        /**
         * @example
         * [[divElement,formElement,iframeElement],[divElement,formElement,iframeElement],,,]
         */
        _iframes: [],
        _tick: 0,
        /**
         * 顺序返回一个iframe
         */
        _select: function() {
            this._tick++;
            return  this._iframes[(this._tick-1)%this._len];
        },
        /**
         * @description 初始化
         * @argument {Number} len the number of iframes in poll
         */
        init: function(len) {
            if(this._isInit==true) {
                return;
            }
            this._len= len;
            var bodyEl=document.body;
            for(var i=0;i<len;i++) {
                divEl = $D.node("div",{
                    "class": "RPCService_hDiv"
                });
                $D.hide(divEl);
                divEl.innerHTML = '<iframe id="RPCService_hIframe_'+i+'" name="RPCService_hIframe_'+i+'" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';  
                bodyEl.appendChild(divEl);
                //not have a iframe yet
                this._iframes[i]=[divEl,null,"RPCService_hIframe_"+i];
            }
            this._isInit= true;
        },
        /**
         * @description 使用的入口
         * @argument {Element} iframeEL
         */
        take: function(formEl) {
            var doms= this._select();
            //if iframe exist
            if(doms[1]) {
                doms[0].removeChild(doms[1]);
            }
            formEl.setAttribute("target",doms[2]);
            doms[1]= formEl;
            doms[0].appendChild(formEl);
        }
    };
    /**
     * 使用form请求数据
     * @memberOf http
     * @param {String} url 
     * @param {Object} option 请求参数
     */
    formSend = function(url, option){
        formSendIframePool.init(2);
        var opt = {
            method: option.method || "GET",
            enctype: option.enctype || "",  //"multipart/form-data",
            data: option.data || {},  //表单项 
            //尚未测试
            onSuccess: option.onSuccess || function(){},   //iframe 载入成功回调,区别与获取数据成功
            onError: option.onError || function(){},      //iframe 载入失败回调
            onComplete: option.onComplete || function(){},
            
            onTimeout: option.onTimeout || function(){},
            timeout: option.timeout ? option.timeout : 10000
        };
        var formEl = $D.node("form",{
                    "class": "RPCService_form",
                    method: opt.method,
                    action: url+"?t=" + (new Date().getTime()),
                    enctype: opt.enctype
                })
         
        if(Object.prototype.toString.call(opt.data).indexOf("String")>-1) {
            var inputEl=$D.node("input");
            inputEl.type="text";
            inputEl.name=opt.data;
            formEl.appendChild(inputEl);            
        }else {
            for(var p in opt.data){
                var inputEl=$D.node("input");
                inputEl.type="text";
                inputEl.name=p;
                inputEl.setAttribute("value",opt.data[p]);
                formEl.appendChild(inputEl);
            }
        }
        formSendIframePool.take(formEl);            
        formEl.submit();
        
        /* 
          iframe事件未处理，当载入成功会自动调用回调函数     
          var iframeEl = $D.id("RPCService_hIframe");
          $E.on(iframeEl, "load", opt.onSuccess); 
          oFrm.onload = oFrm.onreadystatechange = function() {   
             if (this.readyState &amp;&amp; this.readyState != 'complete') return;   
             else {   
                 onComplete();   
             }  
        */
    };
    
    
    
    J.http.ajax = ajax;
    J.http.comet = comet;
    J.http.load = load;
    J.http.loadCss = loadCss;
    J.http.loadScript = loadScript;
    J.http.formSend = formSend;
});



