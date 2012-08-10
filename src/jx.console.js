/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, All rights reserved.
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jet.console
 *
 * Need package:
 * jet.core.js
 * jet.base.js
 * jet.array.js
 * jet.string.js
 * jet.dom.js
 * jet.browser.js
 * jet.event.js
 */


/**
 * 10.[Browser part]: console 控制台
 */
Jx().$package(function(J){
    var $ = J.dom.id,
        $D = J.dom,
        $E = J.event,
        $S = J.string/*,
        $H = J.http*/;
        
    
    var topNamespace = this,
        query = J.string.mapQuery(window.location.search);
    var _open=window.open;
    var open=function(sURL, sName, sFeatures, bReplace){
        if(sName == undefined){
            sName="_blank";
        };
        if(sFeatures == undefined){
            sFeatures="";
        };
        if(bReplace == undefined){
            bReplace=false;
        };
        
        var win=_open(sURL, sName, sFeatures, bReplace);
        if(!win){
            J.out("你的机器上有软件拦截了弹出窗口");
            return false;
        }
        
        return true;
    };
    window.open = open;
    /**
     * 日志对象
     * @author tealin
     * @class Log
     * @ignore
     * @memberOf console
     * @name Log
     */
    var Log = new J.Class(
        
        {
        _defaultType : 3,
        _defaultTag : 'information',
        _defaultTemplate : '<%=msg%>(<%=type%>#<%=tag%>@<%=time%>)',
        /**
         * 信息类型常量，一共五种类型:<br/><br/>
         * PROFILE  : 0 <br/>
         * WARNING  : 1 <br/>
         * ERROR    : 2 <br/>
         * INFO     : 3 <br/>
         * DEBUG    : 4 <br/>
         * 
         * @type Object
         */
        TYPE : ['PROFILE' ,'WARNING', 'ERROR', 'INFO','DEBUG'],

        init : function(option){
            this.msg = option.msg||'';
            this.tag = option.tag||this._defaultTag;
            this.type = J.isUndefined(option.type)?this._defaultType:option.type;
            this.time = new Date().valueOf();
            this._template = option.template||this._defaultTemplate;
        },
//      setTemplate : function(template){
//          this._template = template;
//          try{
//              this.toString();
//          }catch(e){
//              alert("格式错误!输入格式类似为:<%=msg%>(<%=type%>#<%=tag%>@<%=time%>)");
//          }
//      },
        /**
         * 格式化输出
         * @param {Object} data 模版数据
         * @param {Boolen} isEncode 是否转义
         * @param {String} template 输出模版
         * @return {String} 输出字符串
         */
        format : function(data,isEncode,template){
            template = template||this._template;
            if(isEncode){
                return $S.encodeHtml($S.template(template,data));
            }else{
                return $S.template(template,data);
            }
        },
        /**
         * 格式化数据对象
         * @return {Object} 数据对象
         */
        parseOption : function(){
            var context = this;
            var option = {
                msg : context.msg,
                time : context.time,
                type : context.TYPE[context.type],
                tag : context.tag       
            }
            return option;
        },
        /**
         * 普通输出函数
         * @param {Boolen} isEncode 是否转义
         * @param {String} template 输出模版
         * @return {String} 输出字符串
         */
        toString : function(isEncode,template){
            return this.format(this.parseOption(),isEncode,template||this._template);
        }
    });
    
    
    
    
    
    J.config={
        debugLevel: 1
    };
    
    
    
    
    
    /**
     * Jx 控制台，用于显示调试信息以及进行一些简单的脚本调试等操作。可以配合 J.debug J.runtime 来进行数据显示和调试.
     * 
     * @type console
     * @namespace
     * @name console
     */
    J.console = {
        /**
         * 在console里显示信息
         * 
         * @param {String} msg 信息
         * @param {Number} type 信息类型
         * 
         * @example
         * J.console.print("这里是提示信息",J.console.TYPE.ERROR)
         */
//      print : function(msg, type){
//          if(J.console.log){
//              J.console.log((type === 4 ? (new Date() + ":") : "") + msg);
//          }
//      }
    };

    /**
     * 数据监控和上报系统
     * 
     * @ignore
     * @type J.Report
     */
    J.Report = {
        /**
         * 数据分析上报接口
         * 
         * @param {string} source 数据来源
         * @param {number} type 数据返回结果,<br/> <br/>1 加载完成 <br/>2 加载失败 <br/>3 数据异常
         *            无法解释/截断 <br/>4 速度超时 <br/>5 访问无权限 <br/> 对应的转义符是 %status%
         * 
         * @param {string} url 请求的数据路径
         * @param {number} time 响应时间
         * @ignore
         */
        receive : J.emptyFunc,
    
        /**
         * 添加监控规则,
         * 
         * @param {String} url 需要监控的url
         * @param {String} reportUrl 出现异常后上报的地址 上报地址有几个变量替换 <br/>%status% 数据状态
         *            <br/>%percent% 统计百分比 <br/>%url% 监听的url地址,自动encode
         *            <br/>%fullUrl% 监听的完整的url地址，包括这个地址请求时所带 <br/>%source% js处理来源
         *            <br/>%time% 请求花掉的时间 <br/>%scale% 比例,通常是指 1:n 其中的 n 就是 %scale%
         * 
         * <br/>
         * @example
         * J.Report.addRule("http://imgcache.qq.com/data2.js","http://imgcache.qq.com/ok?flag1=3234&flag2=%status%&1=%percent%&flag4=123456");
         * @ignore
         */
        addRule : J.emptyFunc
    };
    
    

    
    J.extend(J.console,
    /**
     * @lends console
     */
    {
        /**
         * 是否进行了初始化
         * 
         * @type Boolean
         */
        _isCreated : false,
        /**
         * 日志记录最大数目
         */
        _maxLength : 1000,
    
        /**
         * console表现模板
         * 
         * @type String
         */
        _html :    '<div id="ConsoleBoxHead" class="consoleBoxHead">\
                        <a href="###" id="ConsoleCloseButton" class="consoleCloseButton" title="关闭">X</a>\
                        <a href="###" id="ConsoleClearButton" class="consoleCloseButton" title="清除所有日志">C</a>\
                        <a href="###" id="ConsoleRefreshButton" class="consoleCloseButton" title="还原所有日志">R</a>\
                        <a href="###" id="ConsoleHelpButton" class="consoleCloseButton" title="控制台帮助">H</a>\
                        <h5 class="title" title="控制台">Console</h5>\
                    </div>\
                    <div id="consoleMain" class="consoleMain">\
                        <ul id="ConsoleOutput" class="consoleOutput"></ul>\
                    </div>\
                    <div class="consoleInputBox">\
                        &gt;<input id="ConsoleInput" class="consoleInput" title="请输入控制台指令或者Javascript语句..." />\
                    </div>',

        /**
         * console的css文本
         *
         * @type String
         */
        _cssText :    '\
                        html{\
                            _background:url(about:blank);\
                        }\
                        \
                        .consoleBox{\
                            display:none;\
                            position:fixed;\
                            _position: absolute;\
                            _top:expression(documentElement.scrollTop+documentElement.clientHeight-this.offsetHeight);\
                            _left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth-200);\
                            right: 200px;\
                            bottom: 30px;\
                            z-index: 10000000;\
                            border: 2px solid #bbb;\
                            padding: 5px;\
                            width: 300px;\
                            height:310px;\
                            background: #000;\
                            box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.75);\
                            filter: Alpha(opacity:75);\
                            font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                            font-size: 12px;\
                            color: #fff;\
                        }\
                        \
                        html.webkit .consoleBox{\
                            background: rgba(0,0,0,0.75);\
                        }\
                        \
                        .consoleBoxHead{\
                            height:20px;\
                            background: rgba(255,255,255,0.15);\
                            overflow:hidden;\
                            cursor:default;\
                            padding: 2px;\
                        }\
                        \
                        .consoleBoxHead .title{\
                            margin:0;\
                            padding: 0 0 0 3px;\
                            height:20px;\
                            line-height:20px;\
                            font-family: Verdana;\
                        }\
                        \
                        .consoleBoxHead .consoleCloseButton{\
                            float:right;\
                            border:0px solid #000;\
                            width:20px;\
                            height:18px;\
                            line-height:16px;\
                            background: white;\
                            margin:1px 1px;\
                            padding:0px;\
                            color:#666;\
                            font-family: Verdana;\
                            font-weight:bold;\
                            cursor:pointer;\
                            border-radius:3px;\
                            -moz-border-radius:3px;\
                            -webkit-border-radius:3px;\
                            text-align:center;\
                            text-decoration:none;\
                        }\
                        \
                        .consoleBoxHead .consoleCloseButton:hover{\
                            background: orange;\
                            color:white;\
                            text-decoration:none;\
                        }\
                        \
                        #ConsoleCloseButton:hover{\
                            background: red;\
                        }\
                        \
                        #ConsoleClearButton:hover{\
                            background: blue;\
                        }\
                        \
                        #ConsoleRefreshButton:hover{\
                            background: green;\
                        }\
                        \
                        .consoleMain{\
                            position:relative;\
                            top:2px;\
                            bottom:0px;\
                            width:100%;\
                            height:255px;\
                            overflow:auto;\
                        }\
                        html.mobileSafari .consoleMain{\
                            overflow:hidden;\
                        }\
                        \
                        ul.consoleOutput{\
                            display:block;\
                            margin:0;\
                            padding:0;\
                            width:100%;\
                            list-style:none;\
                        }\
                        \
                        ul.consoleOutput li{\
                            list-style:none;\
                            padding:3px;\
                            border-bottom:1px solid #333333;\
                            word-break: break-all;\
                            word-wrap: break-word;\
                            overflow: hidden;\
                            zoom: 1;\
                        }\
                        \
                        .consoleOutput .log_icon{\
                            width:13px;\
                            height:13px;\
                            background:#fff;\
                            overflow:hidden;\
                            float:left;\
                            margin-top:2px;\
                            font-weight:bold;\
                            text-align:center;\
                            font-size:12px;\
                            color:#8B8B8B;\
                            line-height:135%;\
                            cursor:default;\
                            border-radius:3px;\
                            -moz-border-radius:3px;\
                            -webkit-border-radius:3px;\
                        }\
                        \
                        .consoleOutput .log_text{\
                            margin: 0px 0px 0px 20px;\
                            line-height:150%;\
                            zoom: 1;\
                        }\
                        \
                        .log_error_type{}\
                        \
                        .log_error_type .log_icon{\
                            background:#FF0000;\
                            color:#660000;\
                        }\
                        \
                        .log_error_type .log_text{\
                            color:#FF0000;\
                        }\
                        \
                        .log_warning_type{}\
                        \
                        .log_warning_type .log_icon{\
                            background:#FFFF00;\
                            color:#8C7E00;\
                        }\
                        \
                        .log_warning_type .log_text{\
                            color:#FFFF00;\
                        }\
                        \
                        .log_debug_type{}\
                        \
                        .log_debug_type .log_icon{\
                            background:#33CC00;\
                            color:#006600;\
                        }\
                        \
                        .log_debug_type .log_text{\
                            color:#33cc00;\
                        }\
                        \
                        .log_info_type{}\
                        \
                        .log_info_type .log_icon{\
                            background:#0066FF;\
                            color:#000066\
                        }\
                        \
                        .log_info_type .log_text{\
                            color:#0066FF;\
                        }\
                        \
                        .log_profile_type{}\
                        \
                        .log_profile_type .log_icon{\
                        }\
                        \
                        .log_profile_type .log_text{\
                            color:white;\
                        }\
                        \
                        #JxConsole .consoleInputBox{\
                            font-family: Verdana;\
                            font-size:12px;\
                            margin:5px 0;\
                            padding:2px 0;\
                            border-top:1px solid #aaa;\
                            width:100%;\
                            color:#CCFF00;\
                        }\
                        \
                        #JxConsole  input.consoleInput{\
                            border:0px solid #666;\
                            background:transparent;\
                            color:#CCFF00;\
                            font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                            font-size:12px;\
                            width:285px;\
                            height:25px;\
                            margin-left:4px;\
                            outline:none;\
                        }\
                         ',

        /**
         * 提示框是否打开了
         * 
         * @type Boolean
         */
        _opened : false,
        
        //日志记录对象
        _log_record: [],
        
        _cmd_history:[],
        _cmd_last_index:0,
        /**
         * 是否为自定义的控制台 
         */
        isCustomConsole : true,
        _templateArr : ['<%=msg%>','<%=msg%>(<%=type%>#<%=tag%>@<%=time%>)'],
        _templateType :0,
    
        /**
         * 样式类
         * 
         * @type Array
         */
        _typeInfo : [["log_profile_type", "└"], ["log_warning_type", "!"], ["log_error_type", "x"], ["log_info_type", "i"],["log_debug_type", "√"]],
        TYPE : {
            PROFILE : 0,
            WARNING : 1,
            ERROR : 2,
            INFO : 3,
            DEBUG : 4
        },

        /**
         * 显示console
         */
        show : function() {
            if (!this._isCreated) {
                this._create();
            }
            this._opened = true;
            
            this._main.style.display = "block";
            this.render();
            
                
            //输入焦点过来
            window.setTimeout(J.bind(this.focusCommandLine, this), 0);
        },
    
        /**
         * 隐藏console
         */
        hide : function(e) {
            e && e.preventDefault();
            this.clear();
            J.console._main.style.display = "none";
            J.console._opened = false;
            
        },
        
        /**
         * 开启console
         */
        enable : function() {
            J.option.console = true;
            this.show();
            
        },
        
        /**
         * 关闭console
         */
        disable : function() {
            J.option.console = false;
            this.hide();
            
        },
    
        /**
         * 初始化控制台
         * 
         * @ignore
         */
        _init : function() {
            // 快捷键开启
            $E.on(document, "keydown", J.bind(this.handleDocumentKeydown, this));
            if (J.option.console) {
                this.show();
            }
            this.setToDebug();
            //this.out("Welcome to JET(Javascript Extension Tools)...");
        },
        /**
         * 建立控制台面板,初始化DOM事件监听
         */
        _create:function(){

            $D.addStyles(this._cssText);
            //$H.loadCss(J.path+"jx.console.css");
            this._main = document.createElement("div");
            
            this._main.id="JxConsole";
            this._main.style.display="none";
            this._main.className = "consoleBox";
            this._main.innerHTML = this._html;
            window.document.body.appendChild(this._main);
            var w = $D.getClientWidth(),
                h = $D.getClientHeight(),
                w1 = 300,
                h1 = 310,
                l = w - 210 - w1,
                t = h - 50 - h1; 
            $D.setStyle(this._main,"top",t+"px");
            $D.setStyle(this._main,"left",l+"px");
            
            
            this._headEl = $("ConsoleBoxHead");
            this._inputEl = $("ConsoleInput");
            this._closeButtonEl = $("ConsoleCloseButton");
            this._clsButtonEl = $("ConsoleClearButton");
            this._refreshButtonEl = $("ConsoleRefreshButton");
            this._helpButtonEl = $("ConsoleHelpButton");
            this._outputEl = $("ConsoleOutput");
            this._consoleMainEl = $("consoleMain");
            if(J.ui && J.ui.Drag){
                new J.ui.Drag(this._headEl,this._main);
            }
    
            // 绑定方法
            $E.on(this._inputEl, "keyup", J.bind(this.onInputKeyup,this));
            $E.on(this._clsButtonEl, "click", J.bind(this.clear,this));
            $E.on(this._refreshButtonEl, "click", J.bind(this.refresh,this));
            $E.on(this._helpButtonEl, "click", J.bind(this.help,this));
            $E.on(this._closeButtonEl, "click", J.bind(this.hide,this));
            
            
            //mobileSafari下控制台滚动条
            var options = {
                hScrollbar: true,
                vScrollbar: true,
                checkDOMChanges: false,
                desktopCompatibility: true
            };
            
            if(J.browser.mobileSafari){
                if(J.ui && J.ui.iScroll && !this.consoleScroller){
                    this.consoleScroller = new J.ui.iScroll(this._outputEl, options);
                    //$D.setStyle(this._outputEl,"overflow","");
                    J.debug("!!!!2", "console");
                }
            }

            
            this._isCreated = true;
            
            
            
            
        },
        
        handleDocumentKeydown: function(e){
            switch(e.keyCode){
                case 192:   // `~键:192
                    if(e.ctrlKey&&e.shiftKey){
                        
                        this.toggleShow();
                        e.preventDefault();
                    }
                    break;
                default: break;
            }
        },
        
        focusCommandLine: function(){
            this._inputEl.focus();
        },
        /**
         * 控制台开关
         */
        toggleShow:function(){
            if(this._opened){
                this.hide();
                
                //J.option.debug = J.DEBUG.NO_DEBUG;
            }else{
                this.show();
                //J.option.debug = J.DEBUG.SHOW_ALL;
                
            }
            
        },
        
        /**
         * 控制台记录信息
         * 
         * @param {String} msg 要输出的信息
         * @param {Number} type 要输出的信息的类型，可选项
         * @return {String} 返回要输出的信息
         */
        outConsoleShow:function(msg, type){
            this.outConsole(msg, type);
            
            if ((!this._opened) && J.option.console) {
                this.show();
            }
        },
        
        /**
         * 向控制台输出信息并显示
         * 
         * @param {String} msg 要输出的信息
         * @param {Number} type 要输出的信息的类型，可选项
         * @return {String} 返回要输出的信息
         */
        outConsole: function(log) {
            if(this._opened){
                var _item = document.createElement("li");
                this._outputEl.appendChild(_item);
                
                var _ti = J.console._typeInfo[log.type] || J.console._typeInfo[0];
                var template = this._templateArr[this._templateType];
                _item.className = _ti[0];
                _item.innerHTML = '<div class="log_icon" title="'+_ti[0]+'">' + _ti[1] + '</div><div class="log_text">' + log.toString(true,template)+'</div>';
                if(this.consoleScroller){
                    this.consoleScroller.refresh();
                }
                this._consoleMainEl.scrollTop = this._consoleMainEl.scrollHeight;
            }
        },
        /**
         * 往控制台打印
         * @param {String} html 打印的信息
         */
        print : function(html){
            var _item = document.createElement("li");
            this._outputEl.appendChild(_item);
            _item.innerHTML = html;
            this._consoleMainEl.scrollTop = this._consoleMainEl.scrollHeight;
        },
        /**
         * 向控制台输出信息的方法,通过url里面的consolefilter参数可以控制tag输出
         * 
         * @param {String} msg 要输出的信息
         * @param {String} tag 自定义标签
         * @param {Number} type 要输出的信息的类型，可选项
         * @return {String} 返回要输出的信息
         */
        out:function(msg,tag,type){ 
            //type = J.isUndefined(type)?0:type;
            var template = this._templateArr[this._templateType];
            var log = new Log({
                        msg : msg,
                        tag : tag,
                        type : type
                    });
            this.logRecord(log);
            //如果需要过滤显示的话需要特殊处理
            if(query&&query.consolefilter){
                var consolefilter = query.consolefilter;
                if(log.tag == consolefilter){
                    if(!this.isCustomConsole){
                        topNamespace.console.log(log.toString(false,template));
                    }else{
                        this.outConsole(log);
                    }
                }
            }else{
                if(!this.isCustomConsole){
                    topNamespace.console.log(log.toString(false,template));
                }else{
                    this.outConsole(log);
                }
            }
        },
        /**
         * 关键日志正常输出
         * @param {String} msg 输出的日志
         * @tag {String} tag 日志标志,默认为system
         */

        profile : function(msg,tag){
            var type = 0;
            tag = tag||"system";
            this.out(msg,tag,type);
        },
        /**
         * 关键日志警告输出
         * @param {String} msg 输出的日志
         * @tag {String} tag 日志标志,默认为system
         */

        warn : function(msg,tag){
            var type = 1;
            this.out(msg,tag,type);
        },
        /**
         * 关键日志错误输出
         * @param {String} msg 输出的日志
         * @tag {String} tag 日志标志,默认为system
         */

        error : function(msg,tag){
            var type = 2;
            this.out(msg,tag,type);
        },
        /**
         * 日志灌水输出
         * @param {String} msg 输出的日志
         * @tag {String} tag 日志标志,默认为system
         */

        info : function(msg,tag){
            var type = 3;
            this.out(msg,tag,type);
        },
        /**
         * 日志调试输出
         * @param {String} msg 输出的日志
         * @tag {String} tag 日志标志,默认为system
         */

        debug : function(msg,tag){
            var type = 4;
            this.out(msg,tag,type);
        },
        /**
         * 设置debug类型,是firebug or custom
         */
        setToDebug:function(){
            if(query.console&&query.console == "firebug"){
                this.isCustomConsole = false;
            }else{
                this.isCustomConsole = true;
            }
        },
        /**
         * 关闭out输出
         */
        setToNoDebug:function(){
            this.out = J.emptyFunc;
        },
        /**
         * log记录,当有query.console的时候,不限记录数量,没有时限制最大数量
         * @param {Log} log 日志对象
         */
        logRecord: function(log){
            this._log_record.push(log);
            if(!query.console){
                if(this._log_record.length>this._maxLength){
                    this._log_record.shift();   
                }
            }
        },
        /**
         * 设置模版类型
         * @param {Number} temp 模版类型
         */
        setTemplate : function(temp){
            if(this._templateArr[temp]){
                this._templateType = temp;
            }
        },
        /**
         * 过滤输出,支持正则,不区分大小写
         * @param {RegExp} s 过滤的字符活正则
         * @return {String} 过滤后的结果
         */
        filter : function(s){
            var reg = new RegExp(s,"i");
            var result = [];
            var logArr = this._log_record;
            J.array.forEach(logArr,function(log){
                var logStr = log.toString(true);
                if(reg.test(logStr)){
                    result.push(log);
                }
            });
            return result;
        },
        /**
         * 过滤type
         * @param {Log[]} logArr 日志数组
         * @param {Number} type 类型
         * @return {Log[]} logArr 匹配的日志数组
         */
        filterByType : function(logArr,type){
            var result = [];
            logArr = logArr||[];
            J.array.forEach(logArr,function(log){
                var isFound = false;
                J.array.forEach(type,function(i){
                    if(log.type == i){
                        isFound = true;
                    }
                });
                if(isFound){
                    result.push(log);
                }
            });
            return result;
        },
        /**
         * 过滤tag
         * @param {Log[]} logArr 日志数组
         * @param {String} tag 类型
         * @return {Log[]} logArr 匹配的日志数组
         */
        filterByTag : function(logArr,tag){
            var result = [];
            logArr = logArr||[];
            J.array.forEach(logArr,function(log){
                var isFound = false;
                J.array.forEach(tag,function(i){
                    if(log.tag == i){
                        isFound = true;
                    }
                });
                if(isFound){
                    result.push(log);
                }
            });
            return result;
        },
        /**
         * 过滤Msg
         * @param {Log[]} logArr 日志数组
         * @param {String} msg 类型
         * @return {Log[]} logArr 匹配的日志数组
         */
        filterByMsg : function(logArr,msg){
            var result = [];
            logArr = logArr||[];
            J.array.forEach(logArr,function(log){
                var isFound = false;
                J.array.forEach(msg,function(i){
                    if(log.msg.indexOf(i)>-1){
                        isFound = true;
                    }
                });
                if(isFound){
                    result.push(log);
                }
            });
            return result;
        },
        /**
         * 获取日志报告
         * @author tealin
         * @param {Int|Array} type 需要报告的类型,多选时用数组表示
         * @param {String|Array} tag 需要报告的标志,多选时用数组表示
         * @param {String|Array} msg 需要报告筛选的信息,多选时用数组表示
         * @return {String} log 日志对象
         */
        getReport : function(type,tag,msg){
            var result = [];
            var logArr = this._log_record;
            var context = this;
            
            //格式化各个参数
            if(!type||type == ""){
                type = false;
            }else if(!J.isArray(type)){
                type = [type];
            }
            if(!tag||tag == ""){
                tag = false;
            }else if(!J.isArray(tag)){
                tag = [tag];
            }
            if(!msg||msg == ""){
                msg = false;
            }else if(!J.isArray(msg)){
                msg = [msg];
            }
            if(type){
                logArr = this.filterByType(logArr,type);
            }
            if(tag){
                logArr = this.filterByTag(logArr,tag);
            }
            if(msg){
                logArr = this.filterByMsg(logArr,msg);
            }
            J.array.forEach(logArr,function(log){
                result.push(log.toString(false,context._templateArr[1]));
                
            });
            return result.join(",");
        },
        /**
         * 渲染log列表
         * @author tealin
         */
        render : function(logArr,isShowAll){
            var num = 15;
            var logArr = logArr||this._log_record;
            if(!isShowAll){
                logArr = logArr.slice(-num);
            }
            var context = this;
            //避免重复
            context.clear();
            J.array.forEach(logArr,function(log){
                context.outConsole(log);
            });
        },
        /**
         * 清空log
         */
        clear : function(e) {
            e && e.preventDefault();
            J.console._outputEl.innerHTML = "";
        },
        /**
         * 刷新控制台
         */
        refresh : function(e){
            e && e.preventDefault();
            this.clear();
            this.render();
        },
        /**
         * 显示帮助
         */
        help : function(e){
            e && e.preventDefault();
            var _rv = "&lt;&lt; Console Help &gt;&gt;<br/>\
                                help|h  : 控制台帮助<br/>\
                                clear|cls : 清空控制台输出<br/>\
                                refresh|r : 刷新控制台输出<br/>\
                                filter|f : 过滤控制台输出<br/>\
                                setTemplate|s : 设置输出模版类型<br/>\
                                hide  : 隐藏控制台，或者使用 Ctrl+Shift+`[~] 快捷键";
            this.print(_rv);
        },
        onInputKeyup : function(e){
            switch(e.keyCode){
                case 13://执行命令
                    this._cmd_history.push(J.console._inputEl.value);
                    this._cmd_last_index=this._cmd_history.length;
                    this._execCommand(J.console._inputEl.value);
                    break;
                case 38://上一命令
                    if(this._cmd_history.length==0)return;
                    var s="";
                    if(this._cmd_last_index>0){
                        this._cmd_last_index--;
                        s=this._cmd_history[this._cmd_last_index];
                    }else{
                        this._cmd_last_index=-1;
                    }
                    J.console._inputEl.value=s;
                    break;
                case 40://下一命令
                    if(this._cmd_history.length==0)return;
                    var s="";
                    if(this._cmd_last_index<this._cmd_history.length-1){
                        this._cmd_last_index++;
                        s=this._cmd_history[this._cmd_last_index];
                    }else{
                        this._cmd_last_index=this._cmd_history.length;
                    }
                    J.console._inputEl.value=s;
                    break;
                default:
                    break;
            }
        },
        /**
         * 执行命令
         * @param {String} cmd 命令
         */
        _execCommand : function(cmd) {
            // 控制台命令
            if(cmd == "help"||cmd == "h"){
                this.help();
            }else if(cmd == "clear"||cmd == "cls"){//清除控制台
                J.console.clear();
            }else if(cmd == "hide"){//隐藏控制台
                J.console.hide();
            }else if(cmd == "refresh"||cmd == "r"){
                this.refresh();
            }else if(cmd == "showall"||cmd == "sa"){
                this.clear();
                this.render(null,true);
            }else if(new RegExp(/^(?:filter|f)(?:\(|\s+)(.+)(?:\)|\s*)$/i).test(cmd)){//过滤
                var filterCmd = RegExp.$1;
                var result = eval("this.filter('"+filterCmd+"')");
                if(result.length>0){
                    this.render(result,true);
                }else{
                    this.clear();
                    this.out("NO RESULT!",1);
                }
            }else if(new RegExp(/^(?:setTemplate|s)(?:\(|\s+)(\d+)(?:\)|\s*)$/i).test(cmd)){
                var temp = parseInt(RegExp.$1);
                this.setTemplate(temp);
                this.refresh();
            }else{//执行js脚本
                this._execScript(cmd);
            }
            J.console._inputEl.value = "";
        },
        /**
         * 执行js代码
         * @param {String} cmd 代码
         */
        _execScript : function(cmd){
            var _rv = '<span style="color:#ccff00">' + cmd + '</span><br/>';
            try {
                _rv += (eval(cmd) || "").toString().replace(/</g, "&lt;").replace(/>/g, "&gt;")
                J.console.print(_rv, 0);
            } catch (e) {
                _rv += e.description;
                J.console.print(_rv, 1);
            }
        }
    });
    

    J.profile = J.console.profile;
    J.warn = J.console.warn;
    J.error = J.console.error;
    J.info = J.console.info;
    // log === info
    J.log = J.console.log = J.console.info;
    J.debug = J.console.debug;
    
    
    
    
        $E.onDomReady(function(){
                J.console._init();
                if(query.console == "true"){
                    J.console=J.extend(J.console,{
                        'profile':J.emptyFunc,
                        'warn':J.emptyFunc,
                        'error':J.emptyFunc,
                        'info':J.emptyFunc,
                        'debug':J.emptyFunc
                    });
                    J.console.show();
                    
                }
        });
        if(query.console&&query.console == "firebug"){
            /* not available any longer
            if(!topNamespace.console){
                // http://getfirebug.com/releases/lite/1.2/firebug-lite.js
                $H.loadScript(J.path+"firebug/firebug-lite.js",{
                    onSuccess : function(){
                        if(firebug){
                            firebug.env.height = 220;
                            // http://getfirebug.com/releases/lite/1.2/firebug-lite.css
                            firebug.env.css = "../../source/firebug/firebug-lite.css";
                            J.out("...控制台开启");
                            J.out("...测试成功");
                        }
                        
                    }
                });
            }
            */
        }
    

    
    
    
    
    
    
    
    
    /**
     * runtime处理工具静态类
     * @ignore
     */
    J.runtime = (function() {
        /**
         * 是否debug环境
         * @ignore
         * @return {Boolean} 是否呢
         */
        function isDebugMode() {
            return (J.config.debugLevel > 0);
        }
    
        /**
         * log记录器
         * 
         * @ignore
         * @param {String} msg 信息记录器
         * @param {String} type log的类型
         */
        function log(msg, type) {
            var info;
            if (isDebugMode()) {
                info = msg + '\n=STACK=\n' + stack();
            } else {
                if (type == 'error') {
                    info = msg;
                } else if (type == 'warn') {
                    // TBD
                }
            }
            J.Debug.errorLogs.push(info);
        }
    
        /**
         * 警告信息记录
         * @ignore
         * @param {String} sf 信息模式
         * @param {All} args 填充参数
         */
        function warn(sf, args) {
            log(write.apply(null, arguments), 'warn');
        }
    
        /**
         * 错误信息记录
         * @ignore
         * @param {String} sf 信息模式
         * @param {All} args 填充参数
         */
        function error(sf, args) {
            log(write.apply(null, arguments), 'error');
        }
    
        /**
         * 获取当前的运行堆栈信息
         * @ignore
         * @param {Error} e 可选，当时的异常对象
         * @param {Arguments} a 可选，当时的参数表
         * @return {String} 堆栈信息
         */
        function stack(e, a) {
            /**
             * @ignore
             */
            function genTrace(ee, aa) {
                if (ee.stack) {
                    return ee.stack;
                } else if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
                    var cnt = 0;
                    return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function() {
                        cnt++;
                        return (cnt % 2 == 0) ? "\n" : " @ ";
                    });
                } else {
                    var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
                    var eas = entry.arguments;
                    var r = [];
                    for (var i = 0, len = eas.length; i < len; i++) {
                        r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
                    }
                    var fnp = /function\s+([^\s\(]+)\(/;
                    var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
                    return (fname + "(" + r.join() + ");").replace(/\n/g, "");
                }
            }
    
            var res;
    
            if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
                res = genTrace(e, a);
            } else {
                try {
                    ({}).sds();
                } catch (err) {
                    res = genTrace(err, arguments);
                }
            }
    
            return res.replace(/\n/g, " <= ");
        }
    
        return {
            /**
             * 获取当前的运行堆栈信息
             * @ignore
             * @param {Error} e 可选，当时的异常对象
             * @param {Arguments} a 可选，当时的参数表
             * @return {String} 堆栈信息
             */
            stack : stack,
            /**
             * 警告信息记录
             * @ignore
             * @param {String} sf 信息模式
             * @param {All} args 填充参数
             */
            warn : warn,
            /**
             * 错误信息记录
             * @ignore
             * @param {String} sf 信息模式
             * @param {All} args 填充参数
             */
            error : error,
            
            /**
             * 是否调试模式
             * @ignore
             */
            isDebugMode : isDebugMode
        };
    
    })();

});














