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
 * Package: Jx.string
 * 
 * Need package:
 * Jx.core.js
 * 
 */

/**
 * 3.[Javascript core]: String 字符串处理
 */
Jx().$package(function(J){
    /**
     * string 名字空间
     * 
     * @namespace
     * @name string
     */
    J.string = J.string || {};
    var $S = J.string,
        toString,
        template,
        isURL,
        parseURL,
        buildURL,
        mapQuery,
        test,
        contains,
        trim,
        clean,
        camelCase,
        hyphenate,
        capitalize,
        escapeRegExp,
        toInt,
        toFloat,
        toSingleLine,
        toHtml,
        toTitle,
        toQueryPair,
        toQueryString,
        
        hexToRgb,
        rgbToHex,
        stripScripts,
        substitute,
        replaceAll,
        
        byteLength,
        cutRight,
        cutByBytes,
        isNumber,
        isEmail,
        
        encodeHtmlSimple,
        decodeHtmlSimple,
        decodeHtmlSimple2,
        encodeHtmlAttributeSimple,
        encodeHtmlAttribute,
        encodeHtml,
        encodeScript,
        encodeHrefScript,
        encodeRegExp,
        encodeUrl,
        encodeUriComponent,
        vaildTencentUrl,
        vaildUrl,
        getCharWidth;

    /**
     * 将任意变量转换为字符串的方法
     * 
     * @method toString
     * @memberOf string
     * 
     * @param {Mixed} o 任意变量
     * @return {String} 返回转换后的字符串
     */
    toString = function(o){
        return (o + "");
    };
    
    /**
     * 多行或单行字符串模板处理
     * 
     * @method template
     * @memberOf string
     * 
     * @param {String} str 模板字符串
     * @param {Object} obj 要套入的数据对象
     * @return {String} 返回与数据对象合成后的字符串
     * 
     * @example
     * <script type="text/html" id="user_tmpl">
     *   <% for ( var i = 0; i < users.length; i++ ) { %>
     *     <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
     *   <% } %>
     * </script>
     * 
     * Jx().$package(function(J){
     *  // 用 obj 对象的数据合并到字符串模板中
     *  J.template("Hello, {name}!", {
     *      name:"Kinvix"
     *  });
     * };
     */
    template = function(str, data){
        /*!
          * jstemplate: a light & fast js tamplate engine
          * License MIT (c) 岑安
          * 
          * Modify by azrael @ 2012/9/28
          */
        var //global = typeof window != 'undefined' ? window : {},
            openTag = '<%',
            closeTag = '%>',
            retTag = '$return',
            vars = 'var ',
            varsInTpl,
            codeArr = ''.trim ?
                [retTag + ' = "";', retTag + ' +=', ';', retTag + ';', 'print=function(){' + retTag + '+=[].join.call(arguments,"")},'] :
                [retTag + ' = [];', retTag + '.push(', ')', retTag + '.join("");', 'print=function(){' + retTag + '.push.apply(arguments)},'],
            keys = ('break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if'
                + ',in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with'
                // Reserved words
                + ',abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto'
                + ',implements,import,int,interface,long,native,package,private,protected,public,short'
                + ',static,super,synchronized,throws,transient,volatile'
                
                // ECMA 5 - use strict
                + ',arguments,let,yield').split(','),
            keyMap = {};
            
        for (var i = 0, len = keys.length; i < len; i ++) {
            keyMap[keys[i]] = 1;
        }
            
        function _getCompileFn (source) {
            vars = 'var ';
            varsInTpl = {};
            varsInTpl[retTag] = 1; 
            var openArr = source.split(openTag),
                tmpCode = '';
                
            for (var i = 0, len = openArr.length; i < len; i ++) {
                var c = openArr[i],
                    cArr = c.split(closeTag);
                if (cArr.length == 1) {
                    tmpCode += _html(cArr[0]);
                } else {
                    tmpCode += _js(cArr[0]);
                    tmpCode += cArr[1] ? _html(cArr[1]) : '';
                }
            }
        
            var code = vars + codeArr[0] + tmpCode + 'return ' + codeArr[3];
            var fn = new Function('$data', code);
            
            return fn;
        }
        
        function _html (s) {
            s = s
            .replace(/('|"|\\)/g, '\\$1')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n');
            
            s = codeArr[1] + '"' + s + '"' + codeArr[2];
            
            return s + '\n';
        }
        
        function _js (s) {
            if (/^=/.test(s)) {
                s = codeArr[1] + s.substring(1).replace(/[\s;]*$/, '') + codeArr[2];
            }
            dealWithVars(s);
            
            return s + '\n';
        }
        
        function dealWithVars (s) {
            s = s.replace(/\/\*.*?\*\/|'[^']*'|"[^"]*"|\.[\$\w]+/g, '');
            var sarr = s.split(/[^\$\w\d]+/);
            for (var i = 0, len = sarr.length; i < len; i ++) {
                var c = sarr[i];
                if (!c || keyMap[c] || /^\d/.test(c)) {
                    continue;
                }
                if (!varsInTpl[c]) {
                    if (c === 'print') {
                        vars += codeArr[4];
                    } else {
                        vars += (c + '=$data.hasOwnProperty("'+c+'")?$data.' + c + ':window.' + c + ',');
                    }
                    varsInTpl[c] = 1;
                }
            }
        }
        
        // function getValue (v, $data){
        //     return $data.hasOwnProperty(v) ? $data[v] : global[v];
        // }

        // function jstemplate (id, source, data) {
        //     if (typeof arguments[1] == 'object' && arguments[2] == undefined) {
        //         data = source;
        //         source = id;
        //         id = null;
        //     }
        //     return (id && _cache[id]) ? _cache[id](data, getValue) : jstemplate.compile(id, source, data);
        // }
        
        // jstemplate.compile = function (id, source, data) {
        //     vars = 'var ';
        //     varsInTpl = {};
            
        //     var compileFn = _getCompileFn(source);
        //     if (id) { 
        //         _cache[id] = compileFn;
        //     }
        //     //console.log(compileFn)
        //     return compileFn(data, getValue);
        // }
        
        // jstemplate.openTag = '<%';
        // jstemplate.closeTag = '%>';
        
        var cache = {};
        return function(str, data){
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                cache[str] || (cache[str] = _getCompileFn(document.getElementById(str).innerHTML)) :
                _getCompileFn(str);
            
            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    }();

    /**
     * 判断是否是一个可接受的 url 串
     * 
     * @method isURL
     * @memberOf string
     * 
     * @param {String} str 要检测的字符串
     * @return {Boolean} 如果是可接受的 url 则返回 true
     */
    isURL = function(str) {
        return isURL.RE.test(str);
    };
        
    /**
     * @ignore
     */
    isURL.RE = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;

    /**
     * 分解 URL 为一个对象，成员为：scheme, user, pass, host, port, path, query, fragment
     * 
     * @method parseURL
     * @memberOf string
     * 
     * @param {String} str URL 地址
     * @return {Object} 如果解析失败则返回 null
     */
    parseURL = function(str) {
        var ret = null;

        if (null !== (ret = parseURL.RE.exec(str))) {
            var specObj = {};
            for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
                var curSpec = parseURL.SPEC[i];
                specObj[curSpec] = ret[i + 1];
            }
            ret = specObj;
            specObj = null;
        }

        return ret;
    };

    /**
     * 将一个对象（成员为：scheme, user, pass, host, port, path, query, fragment）重新组成为一个字符串
     * 
     * @method buildURL
     * @memberOf string
     * 
     * @param {Object} obj URl 对象
     * @return {String} 如果是可接受的 url 则返回 true
     */
    buildURL = function(obj) {
        var ret = '';

        // prefix & surffix
        var prefix = {},
            surffix = {};

        for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
            var curSpec = parseURL.SPEC[i];
            if (!obj[curSpec]) {
                continue;
            }
            switch (curSpec) {
            case 'scheme':
                surffix[curSpec] = '://';
                break;
            case 'pass':
                prefix[curSpec] = ':';
            case 'user':
                prefix['host'] = '@';
                break;
            //case 'host':
            case 'port':
                prefix[curSpec] = ':';
                break;
            //case 'path':
            case 'query':
                prefix[curSpec] = '?';
                break;
            case 'fragment':
                prefix[curSpec] = '#';
                break;
            }

            // rebuild
            if (curSpec in prefix) {
                ret += prefix[curSpec];
            }
            if (curSpec in obj) {
                ret += obj[curSpec];
            }
            if (curSpec in surffix) {
                ret += surffix[curSpec];
            }
        }

        prefix = null;
        surffix = null;
        obj = null;

        return ret;
    };
    
    /**
     * @ignore
     */
    parseURL.SPEC = ['scheme', 'user', 'pass', 'host', 'port', 'path', 'query', 'fragment'];
    parseURL.RE = /^([^:]+):\/\/(?:([^:@]+):?([^@]*)@)?(?:([^/?#:]+):?(\d*))([^?#]*)(?:\?([^#]+))?(?:#(.+))?$/;
    
    /**
     * 将 uri 的查询字符串参数映射成对象
     * 
     * @method mapQuery
     * @memberOf string
     * 
     * @param {String} uri 要映射的 uri
     * @return {Object} 按照 uri 映射成的对象
     * 
     * @example
     * Jx().$package(function(J){
     *  var url = "http://web.qq.com/?qq=4765078&style=blue";
     *  // queryObj 则得到一个{qq:"4765078", style:"blue"}的对象。
     *  var queryObj = J.mapQuery(url);
     * };
     */
    mapQuery = function(uri){
        //window.location.search
        var i,
            key,
            value,
            uri = uri && uri.split('#')[0] || window.location.search, //remove hash
            index = uri.indexOf("?"),
            pieces = uri.substring(index + 1).split("&"),
            params = {};
        if(index === -1){//如果连?号都没有,直接返回,不再进行处理. az 2011/5/11
            return params;
        }
        for(i=0; i<pieces.length; i++){
            try{
                index = pieces[i].indexOf("=");
                key = pieces[i].substring(0,index);
                value = pieces[i].substring(index+1);
                if(!(params[key] = unescape(value))){
                    throw new Error("uri has wrong query string when run mapQuery.");
                }
            }
            catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
        return params;
    };
    
    /**
     * 
     * test的方法
     * 
     * @memberOf string
     * 
     * @param {String|RegExp} regex 正则表达式，或者正则表达式的字符串
     * @param {String} params 正则的参数
     * @return {Boolean} 返回结果
     */
    test = function(string, regex, params){
        return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(string);
    };

    /**
     * 判断是否含有指定的字符串
     * 
     * @memberOf string
     * @name contains
     * @function
     * @param {String} string 是否含有的字符串
     * @param {String} separator 分隔符，可选
     * @return {Boolean} 如果含有，返回 true，否则返回 false
     */
    contains = function(string1, string2, separator){
        return (separator) ? (separator + string1 + separator).indexOf(separator + string2 + separator) > -1 : string1.indexOf(string2) > -1;
    };

    /**
     * 清除字符串开头和结尾的空格
     * 
     * @memberOf string
     * 
     * @return {String} 返回清除后的字符串
     */
    trim = function(string){
        return String(string).replace(/^\s+|\s+$/g, '');
    };

    /**
     * 清除字符串开头和结尾的空格，并把字符串之间的多个空格转换为一个空格
     * 
     * @memberOf string
     * 
     * @return {String} 返回清除后的字符串
     */
    clean = function(string){
        return trim(string.replace(/\s+/g, ' '));
    };

    /**
     * 将“-”连接的字符串转换成驼峰式写法
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    camelCase = function(string){
        return string.replace(/-\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
    };
    
    /**
     * 将驼峰式写法字符串转换成“-”连接的
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    hyphenate = function(string){
        return string.replace(/[A-Z]/g, function(match){
            return ('-' + match.charAt(0).toLowerCase());
        });
    };

    /**
     * 将字符串转换成全大写字母
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    capitalize = function(string){
        return string.replace(/\b[a-z]/g, function(match){
            return match.toUpperCase();
        });
    };

    /**
     * 转换 RegExp 正则表达式
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    escapeRegExp = function(string){
        return string.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    /**
     * 将字符串转换成整数
     * 
     * @memberOf string
     * 
     * @return {Number} 返回转换后的整数
     */
    toInt = function(string, base){
        return parseInt(string, base || 10);
    };

    /**
     * 将字符串转换成浮点数
     * 
     * @memberOf string
     * @param {Sring} string 要转换的字符串
     * @return {Number} 返回转换后的浮点数
     */
    toFloat = function(string){
        return parseFloat(string);
    };
    
    /**
     * 将带换行符的字符串转换成无换行符的字符串
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Sring} 返回转换后的字符串
     */
    toSingleLine = function(str){
        return String(str).replace(/\r/gi,"")
                            .replace(/\n/gi,"");
    };
    
    /**
     * 将字符串转换成html源码
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Sring} 返回转换后的html代码字符串
     */
    toHtml = function(str){
        return String(str).replace(/&/gi,"&amp;")
                            .replace(/\\/gi,"&#92;")
                            .replace(/\'/gi,"&#39;")
                            .replace(/\"/gi,"&quot;")
                            .replace (/</gi,"&lt;")
                            .replace(/>/gi,"&gt;")
                            .replace(/ /gi,"&nbsp;")
                            .replace(/\r\n/g,"<br />")
                            .replace(/\n\r/g,"<br />")
                            .replace(/\n/g,"<br />")
                            .replace(/\r/g,"<br />");
    };
    
    /**
     * 将字符串转换成用于title的字符串
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Number} 返回转换后的in title字符串
     */
    toTitle = function(str){
        return String(str).replace(/\\/gi,"\\")
                            .replace(/\'/gi,"\'")
                            .replace(/\"/gi,"\'");
    };

    /**
     * 将颜色 Hex 写法转换成 RGB 写法
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    hexToRgb = function(string){
        var hex = string.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        var _convert = function(array) {
            var length = array.length;
            if (length !== 3) return null;
            for(var i=0, value; i<length; i++) {
                value = array[i];
                if(value.length === 1) value += value;
                array[i] = parseInt(value, 16);
            }
            return 'rgb(' + array + ')';
        };
        return (hex) ? _convert(hex.slice(1)) : null;
    };

    /**
     * 将颜色 RGB 写法转换成 Hex 写法
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    rgbToHex = function(string){
        var r = string.match(/\d{1,3}/g);
        return (r) ? '#' + ((1 << 24) + ((r[0] << 0) << 16) + ((r[1] << 0) << 8) + (r[2] << 0)).toString(16).slice(1) : null;
    };

    /**
     * 脱去script标签
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    stripScripts = function(string, option){
        var scripts = '';
        var text = string.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
            scripts += arguments[1] + '\n';
            return '';
        });
        if (option === true){
            $exec(scripts);
        }else if($type(option) == 'function'){
            option(scripts, text);
        }
        return text;
    };
    
    /**
     * 。。。。
     * 
     * @memberOf string
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 。。。。
     * 
     * @memberOf string
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };

    /**
     * 。。。。
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    substitute = function(string, object, regexp){
        return string.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) == '\\') return match.slice(1);
            return (object[name] != undefined) ? object[name] : '';
        });
    };
    
    /**
     * 全局替换指定的字符串
     * 
     * @memberOf string
     * @return {String} 返回替换后的字符串
     */
    replaceAll = function(string, reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return string.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
        } else {
            return string.replace(reallyDo, replaceWith);
        }
    };
    
    /**
     * 计算字符串的字节长度
     * 
     * @memberOf string
     * @param {String} string
     * @param {Number} n 指定一个中文的字节数, 默认为2
     * @return {Number} 返回自己长度
     */
    byteLength = function(string,n){
        n= n||2;
        return string.replace(/[^\x00-\xff]/g,({2:"aa",3:"aaa"})[n]).length;
    };
    /**
     * 按字符按给定长度裁剪给定字符串
     * @memberOf string
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    cutRight = function(string, n){
        return string.substring(0, (string.length - n));
    };
    /**
     * 按字节按给定长度裁剪给定字符串
     * @memberOf string
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    cutByBytes = function(string,n) {
        var s= string;
        while(byteLength(s)>n) {
            s= cutRight(s,1);
        }
        return s;
    };
    /**
     * 判断给定字符串是否是数字
     * @memberOf string
     * @name isNumber
     * @function
     * 
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    isNumber = function(string){
        if (string.search(/^\d+$/) !== -1){
            return true;
        }
        else{
            return false;
        }
    };
    /**
     * 判断一个字符串是否是邮箱格式
     * @memberOf string
     * @param {String} emailStr
     * @return {Boolean}
     */
    isEmail = function(emailStr){
        if (emailStr.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1){
            return true;
        }
        else{
            return false;
        }
    };
    
    /*
    JS安全API v1.1
    Created By Web Application Security Group of TSC
    UpDate: 2007-12-08
    */
    
    /**
     * html正文编码, 对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlSimple = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        return sStr;
    };
    
    /**
     * html正文解码, 对HtmlEncode函数的结果进行解码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var decodeHtmlSimple = function(sStr){
        sStr = sStr.replace(/&amp;/g,"&");
        sStr = sStr.replace(/&gt;/g,">");
        sStr = sStr.replace(/&lt;/g,"<");
        sStr = sStr.replace(/&quot;/g,'"');
        sStr = sStr.replace(/&#39;/g,"'");
        return sStr;
    };
    
    var decodeHtmlSimple2 = function(sStr){
        sStr = sStr.replace(/&amp;/g,"&");
        sStr = sStr.replace(/&gt;/g,">");
        sStr = sStr.replace(/&lt;/g,"<");
        sStr = sStr.replace(/\\\\"/g,'"');
        sStr = sStr.replace(/\\\\'/g,"'");
        return sStr;
    };
    
    /**
     * html属性编码：对需要出现在HTML属性里的不信任输入进行编码
        注意:
        (1)该函数不适用于属性为一个URL地址的编码.这些标记包括:a/img/frame/iframe/script/xml/embed/object...
        属性包括:href/src/lowsrc/dynsrc/background/...
        (2)该函数不适用于属性名为 style="[Un-trusted input]" 的编码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlAttributeSimple = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        sStr = sStr.replace(/=/g,"&#61;");
        sStr = sStr.replace(/`/g,"&#96;");
        return sStr;
    };
    
    /**
     * 用做过滤直接放到HTML里的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtml = function(sStr) { 
        return sStr.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r){ 
            return "&#"+r.charCodeAt(0)+";";
        }).replace(/ /g, "&nbsp;").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />"); 
    };
    
    /**
     * 用做过滤HTML标签里面的东东 比如这个例子里的&lt;input value="XXXX"&gt;  XXXX就是要过滤的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlAttribute = function(sStr) { 
        return sStr.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g, function(r){ 
            return "&#"+r.charCodeAt(0)+";";
        }); 
    };
    
    /**
     * 用做过滤直接放到HTML里js中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeScript = function(sStr) {
        sStr+="";//确保为String
        return sStr.replace(/[\\"']/g, function(r){ 
            return "\\"+r; 
        }).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
    };
    
    /**
     * 用做过滤直接放到<a href="javascript:XXXX">中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHrefScript = function(sStr) {
        return encodeHtml(encodeUrl(escScript(sStr)));
    };
    
    /**
     * 用做过滤直接放到正则表达式中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeRegExp = function(sStr) {
        return sStr.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g, function(a,b){
            return "\\"+a;
        });
    };
    
    /**
     * 用做过滤直接URL参数里的  比如 http://show8.qq.com/abc_cgi?a=XXX  XXX就是要过滤的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeUrl = function(sStr) {
        return escape(sStr).replace(/\+/g, "%2B");
    };
    
    /**
        对需要出现在一个URI的一部分的不信任输入进行编码 
        例如:
        <a href="http://search.msn.com/results.aspx?q1=[Un-trusted-input]& q2=[Un-trusted-input]">Click Here!</a>
        以下字符将会被编码: 
        除[a-zA-Z0-9.-_]以外的字符都会被替换成URL编码
     *
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeUriComponent = function(sStr){
        sStr = encodeURIComponent(sStr);
        sStr = sStr.replace(/~/g,"%7E");
        sStr = sStr.replace(/!/g,"%21");
        sStr = sStr.replace(/\*/g,"%2A");
        sStr = sStr.replace(/\(/g,"%28");
        sStr = sStr.replace(/\)/g,"%29");
        sStr = sStr.replace(/'/g,"%27");
        sStr = sStr.replace(/\?/g,"%3F");
        sStr = sStr.replace(/;/g,"%3B");
        return sStr;
    };
    
    /**
    url转向验证
    描述：对通过javascript语句载入（或转向）的页面进行验证，防止转到第三方网页和跨站脚本攻击
    返回值：true -- 合法；false -- 非法
    例：
    合法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.qq.com
        http://xxx.qq.com/hi/redirect.html?url=a.html
        http://xxx.qq.com/hi/redirect.html?url=/a/1.html
    非法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.baidu.com
        http://xxx.qq.com/hi/redirect.html?url=javascript:codehere
        http://xxx.qq.com/hi/redirect.html?url=//www.qq.com
     *
     * @memberOf string
     * @param {String} sUrl
     * @return {String} 
     */
    var vaildTencentUrl = function(sUrl){
        return (/^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i).test(sUrl)||(/^[\w][\w\/\.\-_%]+$/i).test(sUrl)||(/^[\/\\][^\/\\]/i).test(sUrl) ? true : false;
    };
    

    /**
     * 验证给定字符串是否是url, 如果是url 则返回正常的url
     * 
     * @memberOf string
     * @param {String} sUrl
     * @return {String} 
     */
    var vaildUrl = function(url){ 
        var url=encodeURI(url).replace(/(^\s*)|(\s*$)/g, ''),
            protocolReg=/(^[a-zA-Z0-9]+[^.]):/,
            domainReg=/^[\S.]+\.[\S.]+$/,
            domainendReg=/[\w.]+\/(\S*)/,
            jsReg=/;$/,
            jpReg=/^[\s*]*javascript[\s*]*:/;
            
        if((!protocolReg.test(url)) && (!domainReg.test(url))){
            url="";
        }else{
            if(!protocolReg.test(url)){
                url="http://"+url;
            }
            if(!domainendReg.test(url)){
                url=url+"/";
                
            }
            //如果是js为协议就清空
            if(jpReg.test(url)){
                url="";
            }
        }
        
        return url;
    };
    
    /**
     * 获取字符实际宽度
     * @memberOf string
     * @param {String} str 需要计算的字符串
     * @param {Number} fontsize 字体大小，可以不填
     * @return {Number}
     */
    var getCharWidth = function(str,fontsize) {
        var d= document.createElement("div");
        d.style.visibility= "hidden";
        d.style.width= "auto";
        if(fontsize) {
            d.style.fontSize= fontsize + "px";
        }
        d.style.position= "absolute";
        d.innerHTML= J.string.encodeHtmlSimple(str);
        document.body.appendChild(d);
        var width= d.offsetWidth;
        document.body.removeChild(d);
        return width;
    };
    
    /**
     * 按给定宽度裁剪字符串
     * @memberOf string
     * @param {String} str 
     * @param {Number} fontsize 字体大小
     * @param {Number} width 限定的宽度
     * @return {Number}
     */
    var cutByWidth = function(str,fontsize,width) {
        for(var i=str.length;i>=0;--i)
        {
            str=str.substring(0, i);
            if(getCharWidth(str, fontsize)<width)
            {
                return str;
            }
        }
        return '';
    };
    $S.cutByWidth = cutByWidth;
    $S.toString = toString;
    $S.template = template;
    $S.isURL = isURL;
    $S.parseURL = parseURL;
    $S.buildURL = buildURL;
    $S.mapQuery = mapQuery;
    $S.test = test;
    $S.contains = contains;
    $S.trim = trim;
    $S.clean = clean;
    $S.camelCase = camelCase;
    $S.hyphenate = hyphenate;
    $S.capitalize = capitalize;
    $S.escapeRegExp = escapeRegExp;
    $S.toInt = toInt;
    $S.toFloat = toFloat;
    $S.toSingleLine = toSingleLine;
    
    $S.toHtml = toHtml;
    $S.toTitle = toTitle;
    $S.toQueryPair = toQueryPair;
    $S.toQueryString = toQueryString;
    
    $S.hexToRgb = hexToRgb;
    $S.rgbToHex = rgbToHex;
    $S.stripScripts = stripScripts;
    $S.substitute = substitute;
    $S.replaceAll = replaceAll;
    
    $S.byteLength = byteLength;
    $S.cutRight = cutRight;
    
    $S.isNumber = isNumber;
    $S.isEmail = isEmail;
    
    $S.cutByBytes = cutByBytes;
    
    //html正文编码：对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
    $S.encodeHtmlSimple = encodeHtmlSimple;
    
    //html正文解码：对HtmlEncode函数的结果进行解码
    $S.decodeHtmlSimple = decodeHtmlSimple;
    $S.decodeHtmlSimple2 = decodeHtmlSimple2;
    
    /*
    html属性编码：对需要出现在HTML属性里的不信任输入进行编码
    注意:
    (1)该函数不适用于属性为一个URL地址的编码.这些标记包括:a/img/frame/iframe/script/xml/embed/object...
    属性包括:href/src/lowsrc/dynsrc/background/...
    (2)该函数不适用于属性名为 style="[Un-trusted input]" 的编码
    */
    $S.encodeHtmlAttributeSimple = encodeHtmlAttributeSimple;
    
    //用做过滤HTML标签里面的东东 比如这个例子里的<input value="XXXX">  XXXX就是要过滤的
    $S.encodeHtmlAttribute = encodeHtmlAttribute;
    
    //用做过滤直接放到HTML里的
    $S.encodeHtml = encodeHtml;
    
    //用做过滤直接放到HTML里js中的
    $S.encodeScript = encodeScript;
    
    //用做过滤直接放到<a href="javascript:XXXX">中的
    $S.encodeHrefScript = encodeHrefScript;
    
    //用做过滤直接放到正则表达式中的
    $S.encodeRegExp = encodeRegExp;
    
    //用做过滤直接URL参数里的  比如 http://show8.qq.com/abc_cgi?a=XXX  XXX就是要过滤的
    $S.encodeUrl = encodeUrl;
    
    /*
    对需要出现在一个URI的一部分的不信任输入进行编码 
    例如:
    <a href="http://search.msn.com/results.aspx?q1=[Un-trusted-input]& q2=[Un-trusted-input]">Click Here!</a>
    以下字符将会被编码: 
    除[a-zA-Z0-9.-_]以外的字符都会被替换成URL编码
    */
    $S.encodeUriComponent = encodeUriComponent;
    
    /*
    url转向验证
    描述：对通过javascript语句载入（或转向）的页面进行验证，防止转到第三方网页和跨站脚本攻击
    返回值：true -- 合法；false -- 非法
    例：
    合法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.qq.com
        http://xxx.qq.com/hi/redirect.html?url=a.html
        http://xxx.qq.com/hi/redirect.html?url=/a/1.html
    非法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.baidu.com
        http://xxx.qq.com/hi/redirect.html?url=javascript:codehere
        http://xxx.qq.com/hi/redirect.html?url=//www.qq.com
    */
    $S.vaildTencentUrl = vaildTencentUrl;
    
    $S.vaildUrl = vaildUrl;
    
    $S.getCharWidth = getCharWidth;
});