/**    
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * http://code.google.com/p/j-et/
 *
 * @version    1.0
 * @author    Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/**    
 * @description
 * Package: Jx
 *
 * Need package:
 * no.
 * 
 */

/**
 * 1.[JET core]: JET 微内核
 */
;(function(tn){
    var version = "1.0.%Version%",
        mark = "JxMark",
        topNamespace = tn,
        undefined,
        
        // 将顶级命名空间中可能存在的 Jx 对象引入
        Jx = topNamespace.Jx,
        
        VERSIONS = {},
        PACKAGES = {},
        
        DEBUG = {
            NO_DEBUG: 0,
            SHOW_ALL: 1
        },
        
        option = {
            debug: 1
        },
        
        /**
         * @ignore
         */
        out = function(msg,tag,type){
            msg = String(msg);
            //type = type||"";
            //type = (typeof type == "undefined")?0:type;
            if(option.debug){
                if(this.console){
                    if(this.console.out){
                        this.console.out(msg,tag,type);
                    }else{
                        alert(msg+" - 消息类型["+type+"]");
                    }
                    
                }
            }
            return msg;
        };

    try{
        // 判断Jx名字空间是否已经存在
        if(typeof Jx === "undefined" || (Jx.mark && Jx.mark === mark)){
            
            // 如果已经有Jx对象则记录已有的信息
            if(Jx){
                VERSIONS = Jx.VERSIONS;
                PACKAGES = Jx.PACKAGES;
            }
            
            /**
             * 【Jx 对象原型】
             * Jx
             * @class 
             * @constructor Jx
             * @global
             * 
             * @since version 1.0
             * @description Jx 对象原型的描述
             * 
             * @param {Number} ver 要使用的 Jx 的版本号，当前是1.0
             * @param {Boolean} isCreateNew 是否创建一个新的 Jx 实例，默认为 false 不创建新的 Jx 实例，只返回同一版本在全局中的唯一一个实例，注意：除非特殊需要，否则一般不要创建新的 Jx 实例
             * @return {Object} 返回对应版本的 Jx 对象
             * 
             * @example
             * //代码组织方式一(传统)：
             * var J = new Jx();
             * J.out(J.version);    //输出当前Jx的版本
             * 
             * @example
             * //代码组织方式二(推荐)：
             * Jx().$package(function(J){
             *     J.out(J.version);    //输出当前Jx的版本
             * };
             * //注：此种方式可以利用匿名函数来防止变量污染全局命名空间，尤其适合大型WebApp的构建！
             * 
             * @example
             * //范例：
             * Jx().$package("tencent.alloy", function(J){
             *     var $ = J.dom.id,
             *     $D = J.dom,
             *     $E = J.event,
             *     $H = J.http;
             *     this.name = "腾讯Q+ Web";
             *     J.out(this.name);
             * };
             * 
             */
            Jx = function(ver, isCreateNew){
                var J = this;

                var instanceOf = function(o, type) {
                    return (o && o.hasOwnProperty && (o instanceof type));
                };

                if(isCreateNew){
                    // 如果是第一次执行则初始化对象
                    if ( !( instanceOf(J, Jx) ) ) {
                        J = new Jx(ver);
                    } else {
                        J._init();
                    }
                }else{
                    if(ver){
                        ver = String(ver);
                        try{
                            if(Jx.VERSIONS[ver]){
                                J = Jx.VERSIONS[ver];
                            }else{
                                J = Jx.VERSIONS[Jx.DEFAULT_VERSION];
                                throw new Error("没有找到 JET version " + ver + ", 所以返回默认版本 JET version " + Jx.DEFAULT_VERSION + "!");
                            }
                        }catch(e){
                            //J.out(e.fileName+";"+e.lineNumber+","+typeof e.stack+";"+e.name+","+e.message, 2);
                            J.out("A.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
                        }
                    }else{
                        J = Jx.VERSIONS[Jx.DEFAULT_VERSION];
                    }
                }
                return J;
            };
            
            Jx.prototype = {
                /**
                 * 当前 Jx 的版本号，此版本是 1.0 <br/>
                 * Version 1.0
                 * 
                 * @description {Num} 当前 Jx 的版本号！
                 * @constant
                 * @type Number
                 */
                version: version,
                
                DEBUG: DEBUG,
                
                /**
                 * Jx 配置
                 * @ignore
                 */
                option: option,
                
                /**
                 * Jx 的初始化方法
                 * initialize method
                 * 
                 * @private
                 * @param {Object} o config 对象
                 */
                _init: function(){
                    this.constructor = Jx;
                    //return true;
                },
            
                /**
                 * 创建一个命名空间，创建的命名空间将会在 window 根命名空间下。
                 * Create a new namespace, the top namespace is window.
                 * 
                 * @since version 1.0
                 * @description 可以一次性连续创建命名空间
                 * 
                 * @param {String} name 命名空间名称
                 * @returns {Object} 返回对最末命名空间的引用
                 * 
                 * @example
                 * //在全局环境中创建tencent.alloy名字空间, $namespace完成的操作相当于在全局环境中执行如下语句：
                 * //var tencent = {};
                 * //tencent.alloy = {};
                 * 
                 * J.$namespace("tencent.alloy");
                 * 
                 * //注：Jx的$namespace方法与其他JS框架的namespace的方法不同，其他框架如YUI是在其YAHOO对像下创
                 * //建命名空间，而Jx的$namespace测试直接在顶级命名空间window的下边直接创建命名空间。
                 * 
                 */
                $namespace: function(name) {
                    // Handle "", null, undefined, false
                    if ( !name ) {
                        return topNamespace;
                    }

                    name = String(name);

                    var i,
                        ni,
                        nis = name.split("."),
                        ns = topNamespace;

                    for(i = 0; i < nis.length; i=i+1){
                        ni = nis[i];
                        ns[ni] = ns[ni] || {};
                        ns = ns[nis[i]];
                    }

                    return ns;
                },
    
                /**
                 * 创建一个 Javascript 代码包
                 * 
                 * @param {String} name 要创建的包的名字空间
                 * @param {Function} func 要创建的包的包体
                 * @returns {Mixed} 返回任何自定义的变量
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     //这时上下文对象this指向全局window对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * @example
                 * //创建一个名字为tencent.kinvix的package包：
                 * Jx().$package("tencent.kinvix", function(J){
                 *     //这时上下文对象this指向window对象下的tencent.kinvix对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * 
                 * 
                 */
                $package: function(){
                    var name = arguments[0],
                        func = arguments[arguments.length-1],
                        ns = topNamespace,
                        returnValue;
                        if(typeof func === "function"){
                            // handle name as ""
                            if(typeof name === "string"){
                                ns = this.$namespace(name);
                                if( Jx.PACKAGES[name] ){
                                    //throw new Error("Package name [" + name + "] is exist!");
                                }else{
                                    Jx.PACKAGES[name] = {
                                        isLoaded: true,
                                        returnValue: returnValue    // undefined as default
                                    };
                                }
                                ns.packageName = name;
                            }else if(typeof name === "object"){
                                ns = name;
                            }
                            
                            returnValue = func.call(ns, this);
                            typeof name === "string" && (Jx.PACKAGES[name].returnValue = returnValue);
                        }else{
                            throw new Error("Function required");
                        }
    
                },
                
                /**
                 * 检查一个 Javascript 模块包是否已经存在
                 * 
                 * @param {String} name 包名
                 * @return {Object} 如果已加载则返回包对象，否则返回 undefined
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     // 输出undefined
                 *     J.out(J.checkPackage("tencent.kinvix"));
                 * };
                 * 
                 * 
                 * @example
                 * //创建一个名字为tencent.kinvix的package包：
                 * Jx().$package("tencent.kinvix", function(J){
                 *     //这时上下文对象this指向window下的tencent.kinvix对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * Jx().$package(function(J){
                 *     // J.checkPackage("tencent.kinvix")结果返回的将是tencent.kinvix的引用
                 *     var kinvix = J.checkPackage("tencent.kinvix");
                 *     if(kinvix){
                 *         J.out("tencent.kinvix包已加载...");
                 *     }
                 * };
                 * 
                 */
                checkPackage: function(name){
                    return Jx.PACKAGES[name];
                },
                
                /**
                 * 标准化 Javascript 的核心输出方法，注意：在不同的Javascript嵌入宿主中会覆盖此方法！
                 * 
                 * @method out
                 * @function
                 * 
                 * @param {String} msg 要输出的信息
                 * @param {Number} type 输出信息的类型
                 * @return {String} msg 返回要输出的信息
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     // 向Jx的控制台输出信息,在不同的js宿主中具体实现细节会不同,但不会影响out方法的使用;
                 *     J.out("Hello, world!");
                 * };
                 * 
                 */
                out: out,
                
                /**
                 * 我就是传说中的debug哥！
                 * 
                 * @method debug
                 * @function
                 * 
                 * @see 想知道我到底是谁吗?请参考J.console.debug
                 */
                debug: function(){},
                profile : function(){},
                warn : function(){},
                error : function(){},
                
                startTime: +new Date(),
                
                /**
                 * 关于 Jx
                 * 
                 * @return {String} 返回 Jx 的 about 信息
                 */
                about: function(){
                    return this.out("JET (Javascript Extend Tools)\nversion: " + this.version + "\n\nCopyright (c) 2009, All rights reserved.");
                },
                
                /**
                 * Jx 对象转化为字符串的方法
                 * 
                 * @ignore
                 * @return {String} 返回 Jx 对象串行化后的信息
                 */
                toString: function(){
                    return "JET version " + this.version + " !";
                }
            };

            /**
             * Jx 版本库对象
             * 
             * @ignore
             * @type Object
             */
            Jx.VERSIONS = VERSIONS;
            
            /**
             * 记录加载的包的对象
             * 
             * @ignore
             * @type Object
             */
            Jx.PACKAGES = PACKAGES;

            /**
             * 创建一个当前版本 Jx 的实例
             * 
             * @ignore
             * @type Object
             */
            Jx.VERSIONS[version] = new Jx(version, true);
        
            /**
             * Jx 默认版本的版本号，默认将会是最后一个加载的Jx版本
             * 
             * @constant
             * @type Number
             */
            Jx.DEFAULT_VERSION = version;
            /**
             * Jx 对象验证标记
             * 
             * @ignore
             * @description 用于验证已存在的Jx对象是否是本框架某子版本的Jx对象
             * @type String
             */
            Jx.mark = mark;
            
            // 让顶级命名空间的 Jx 对象引用新的 Jx 对象
            topNamespace.Jet = topNamespace.Jx = Jx;
        }else{
            throw new Error("\"Jx\" name is defined in other javascript code !!!");
        }
    }catch(e){
        // 微内核初始化失败，输出出错信息
        out("JET 微内核初始化失败! " + "B.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 1);
    }
})(this);

/**
 * 2.[Javascript core]: 常用工具函数扩展
 */
Jx().$package(function(J){
    var isUndefined,
        isNull,
        isNumber,
        isString,
        isBoolean,
        isObject,
        isArray,
        isArguments,
        isFunction,
        $typeof,
        
        $return,
        $try,
        
        emptyFunc,
        
        checkJSON,
        random,
        extend,
        clone,
        now,
        timedChunk,

        getLength,


        rebuild,
        pass,
        bind,
        bindNoEvent,

        

        
        Class;

    /**
     * 判断变量的值是否是 undefined
     * Determines whether or not the provided object is undefined
     * 
     * @method isUndefined
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 undefined 时返回 true
     */
    isUndefined = function(o) {
        return typeof(o) === "undefined";
    };
        
    /**
     * 判断变量的值是否是 null
     * Determines whether or not the provided object is null
     * 
     * @method isNull
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 null 时返回 true
     */
    isNull = function(o) {
        return o === null;
    };
    
    /**
     * 判断变量的类型是否是 Number
     * Determines whether or not the provided object is a number
     * 
     * @memberOf Jx.prototype
     * @name isNumber
     * @function
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 number 时返回 true
     */
    isNumber = function(o) {
        return (o === 0 || o) && o.constructor === Number;
    };
    
    /**
     * 判断变量的类型是否是 Boolean
     * Determines whether or not the provided object is a boolean
     * 
     * 
     * @method isBoolean
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 boolean 时返回 true
     */
    isBoolean = function(o) {
        return (o === false || o) && (o.constructor === Boolean);
    };
    
    /**
     * 判断变量的类型是否是 String
     * Determines whether or not the provided object is a string
     * 
     * 
     * @method isString
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 string 时返回 true
     */
    isString = function(o) {
        return (o === "" || o) && (o.constructor === String);
    };
    
    /**
     * 判断变量的类型是否是 Object
     * Determines whether or not the provided object is a object
     * 
     * 
     * @method isObject
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 object 时返回 true
     */
    isObject = function(o) {
        return o && (o.constructor === Object || Object.prototype.toString.call(o) === "[object Object]");
    };
    
    /**
     * 判断变量的类型是否是 Array
     * Determines whether or not the provided object is a array
     * 
     * 
     * @method isArray
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 array 时返回 true
     */
    isArray = function(o) {
        return o && (o.constructor === Array || Object.prototype.toString.call(o) === "[object Array]");
    };
    
    /**
     * 判断变量的类型是否是 Arguments
     * Determines whether or not the provided object is a arguments
     * 
     * 
     * @method isArguments
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 arguments 时返回 true
     */
    isArguments = function(o) {
        return o && o.callee && isNumber(o.length) ? true : false;
    };
    
    /**
     * 判断变量的类型是否是 Function
     * Determines whether or not the provided object is a function
     * 
     * 
     * @method isFunction
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 function 时返回 true
     */
    isFunction = function(o) {
        return o && (o.constructor === Function);
    };
    
    /**
     * 判断变量类型的方法
     * Determines the type of object
     * 
     * 
     * @method $typeof
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {String} 返回变量的类型，如果不识别则返回 other
     */
    $typeof = function(o) {
        if(isUndefined(o)){
            return "undefined";
        }else if(isNull(o)){
            return "null";
        }else if(isNumber(o)){
            return "number";
        }else if(isBoolean(o)){
            return "boolean";
        }else if(isString(o)){
            return "string";
        }else if(isObject(o)){
            return "object";
        }else if(isArray(o)){
            return "array";
        }else if(isArguments(o)){
            return "arguments";
        }else if(isFunction(o)){
            return "function";
        }else{
            return "other";
        }
        
    };
    /**
     * @ignore
     */
    checkJSON = function(){
        
        return true;
    };
    
    /**
     * 生成随机数的方法
     * 
     * @method random
     * @memberOf Jx.prototype
     * 
     * @param {Number} min 生成随机数的最小值
     * @param {Number} max 生成随机数的最大值
     * @return {Number} 返回生成的随机数
     */
    random = function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    
    
    
    /**
     * 克隆一个对象
     * 
     * @method clone
     * @memberOf Jx.prototype
     * 
     * @param {Object} o 要克隆的对象
     * @return {Object} 返回通过克隆创建的对象
     * 
     * @example
     * Jx().$package(function(J){
     *     var objA = {name: "Kinvix"};
     *     // 克隆一个 objA 对象，并存入 objB 中。
     *     var objB = J.clone(objA);
     * };
     */
    clone = function(o){
        /**
         * @ignore
         */
        var tempClass = function(){};
        tempClass.prototype = o;
        
        // 返回新克隆的对象
        return (new tempClass());
    };

    

    

    
    
    
    /**
     * 生成一个返回值是传入的 value 值的函数
     * 
     * @method $return
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} value 要返回的值
     * @return {Mixed} 返回一个返回值是 value 的函数
     */
    $return = function(result){
        return J.isFunction(result) ? result : function(){
                return result;
            };
    };
    
    /**
     * 从第一个函数开始try，直到尝试出第一个可以成功执行的函数就停止继续后边的函数，并返回这个个成功执行的函数结果
     * 
     * @method $try
     * @memberOf Jx.prototype
     * 
     * @param {Function} fn1, fn2, .... 要尝试的函数
     * @return {Mixed} 返回第一个成功执行的函数的返回值
     * 
     * @example
     * Jx().$package(function(J){
     *     // 按顺序执行 funcA, funcB, funcC，当中途有一个 func 的执行结果返回 true 则不再往下执行，并返回成功执行的 func 的返回值；
     *     J.$try(funcA, funcB, funcC);
     * };
     */
    $try = function(){
        var i,
            l = arguments.length,
            result;
            
        for(i = 0; i < l; i++){
            try{
                result = arguments[i]();
                // 如果上边语句执行成功则执行break跳出循环
                break;
            }catch(e){
                J.out("C.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
        return result;
    };
    
    /**
     * 对一个对象或数组进行扩展
     * 
     * @method extend
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} beExtendObj 被扩展的对象或数组
     * @param {Mixed} extendObj1, extendObj2, .... 用来参照扩展的对象或数组
     * @return {Mixed} 返回被扩展后的对象或数组
     * 
     * @example
     * Jx().$package(function(J){
     *     // 用 objB 和objC 扩展 objA 对象；
     *     J.extend(objA, objB, objC);
     * };
     * 
     */
    extend = function(beExtendObj, extendObj1, extendObj2){
        var a = arguments,
            i,
            p,
            beExtendObj,
            extendObj;
            
        if(a.length === 1){
            beExtendObj = this;
            i=0;
        }else{
            beExtendObj = a[0] || {};
            i=1;
        }
        
        for(; i<arguments.length; i++){
            extendObj = arguments[i];
            for(p in extendObj){
                var src = beExtendObj[p],
                    obj = extendObj[p];
                if ( src === obj ){
                    continue;
                }
                
                if ( obj && isObject(obj) && !isArray(obj) && !obj.nodeType && !isFunction(obj)){
                    src = beExtendObj[p] || {};//2010-12-28
                    beExtendObj[p] = extend( src, 
                        // Never move original objects, clone them
                        obj || ( obj.length != null ? [ ] : { } ));

                // Don't bring in undefined values
                }else if ( obj !== undefined ){
                    beExtendObj[p] = obj;
                }
            }
        }

        return beExtendObj;
    };
    
    
    /*
    extend = function(beExtendObj, target, extendObj2) {
        
        // copy reference to target object
        var target = arguments[0] || {}, 
        i = 2, 
        length = arguments.length, 
        options;
    
    
        target = arguments[1] || {};


    
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !J.isFunction(target) ){
            target = {};
        }
        // extend jQuery itself if only one argument is passed
        if ( length == i ) {
            target = this;
            --i;
        }
    
        for ( ; i < length; i++ ){
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ){
                // Extend the base object
                for ( var name in options ) {
                    var src = target[ name ], 
                        copy = options[ name ];
    
                    // Prevent never-ending loop
                    if ( target === copy ){
                        continue;
                    }
                    // Recurse if we're merging object values
                    if ( copy && typeof copy === "object" && !copy.nodeType ){
                        target[ name ] = extend( target, 
                            // Never move original objects, clone them
                            src || ( copy.length != null ? [ ] : { } )
                        , copy );
    
                    // Don't bring in undefined values
                    }else if ( copy !== undefined ){
                        target[ name ] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    */
    
    /**
     * 获取当前时间的函数
     * 
     * @method now
     * @memberOf Jx.prototype
     * 
     * 
     * 
     * @example
     * alert(J.now());
     * 
     */
    now = function(){
        return +new Date;
    }
    
    
    /**
     * 通用分时处理函数
     * 
     * @method timedChunk
     * @memberOf Jx.prototype
     * 
     * 
     * 
     * @example
     * Jx().$package(function(J){
     * };
     * 
     */
    timedChunk = function(items, process, context, isShift, callback) {
        var todo = items.concat(), delay = 25;
        if(isShift){
            todo = items;
        }
 
        window.setTimeout(function() {
            var start = +new Date();
 
            do {
                process.call(context, todo.shift());
            } while(todo.length > 0 && (+new Date() - start < 50));
 
            if(todo.length > 0) {
                window.setTimeout(arguments.callee, delay);
            } else if(callback) {
                callback(items);
            }
 
        }, delay);
    }
    

    
    /**
     * 获取对象自身具有的属性和方法的数量
     * 
     * @method getLength
     * @memberOf Jx.prototype
     * 
     * @param {Object} obj 要获取的对象
     * @return {Number} 返回对象自身具有属性和方法的数量
     */
    getLength = function(obj) {
        var p,
            count = 0;
        for(p in obj){
            if(obj.hasOwnProperty(p)){
                count++;
            }
        }
        return count;
    };
    
    /**
     * 一个空函数函数
     * 
     * @memberOf Jx.prototype
     */
    emptyFunc = function(){};
    


        
    /**
     * 函数的重构方法
     * 
     * 
     * @private
     * @memberOf Jx.prototype
     * @param {Object} option 选项对象
     * @return {Function} 返回重构后的函数的执行结果
     */
    rebuild = function(func, option){
        option = option || {};
        
        func.$$rebuildedFunc = func.$$rebuildedFunc || function(){
            var self2 = this,
                scope,
                args,
                returns;
            scope = option.contextObj || self2;
            args = Array.prototype.slice.call(arguments, 0);

            if(args !== undefined){
                args = args.concat(option.arguments);
            }
            if(option.event === false){
                args = args.slice(1);
            }

            return func.apply(scope, args);
        };

        return func.$$rebuildedFunc;
    };
    
    /**
     * 给函数传入参数并执行
     * 
     * @memberOf Jx.prototype
     * @param {Mixed} args 参数列表
     * @return {Mixed} 返回函数执行结果
     * 
     * @example
     * Jx().$package(function(J){
     *     // 将"a"、"b"两个字符串传入funcA函数并执行
     *     funcA.pass("a","b");
     * };
     * 
     */
    pass = function(func, var_args) {
        var slice = Array.prototype.slice;
        var a = slice.call(arguments, 1);
        return function(){
            var context = this;
            return func.apply(context, a.concat(slice.call(arguments)));
        };
    };
    /*
    pass = function(func){
        var args = Array.prototype.slice.call(arguments, 1);
        return rebuild(func, {contextObj: null, arguments: args});
    };
    */
    
    /*
     * 给函数绑定一个上下文对象再执行
     * 
     * @memberOf Jx.prototype
     * @param {Object} contextObj 要绑定的上下文对象
     * @param {Mixed} args 参数列表
     * @return {Mixed} 返回函数执行结果
     * 
     * @example
     * Jx().$package(function(J){
     *     // 以 contextObjB 对象为上下文对象 this 来执行funcA函数
     *     funcA.bind(contextObjB);
     * };
     * 
     */
    /*
    bind = function(func, contextObj){
        var args = Array.prototype.slice.call(arguments, 2);
        //args = [this].extend(args);
        return rebuild(func, {contextObj: contextObj, arguments: args});
    };
    */
    
    /**
     * 将一个函数绑定给一个对象作方法，返回的函数将总被传入{@code obj} as {@code this}
     * 
     * @memberOf Jx.prototype
     * @param {Function} func 要绑定的函数
     * @param {Object} contextObj 要绑定的对象
     * @param {Mixed} args 参数列表，长度任意
     * @return {Function} 返回一个被绑定this上下文对象的函数
     * 
     * @example
     * Jx().$package(function(J){
     *   funcB = J.bind(funcA, obj, a, b)
     *   funcB(c, d) // 相当于执行 funcA.call(obj, a, b, c, d)
     * };
     */
    
    bind = function(func, context, var_args) {
        var slice = Array.prototype.slice;
        var a = slice.call(arguments, 2);
        return function(){
            return func.apply(context, a.concat(slice.call(arguments)));
        };
    };
    


    
    

    
    
    /**
     * 创建Class类的类
     * Class
     * @class 
     * @memberOf Jx
     * @param {Object} option = {extend: superClass} 在option对象的extend属性中指定要继承的对象，可以不写
     * @param {Object} object 扩展的对象
     * @return {Object} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var Person = new J.Class({
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *  
     *  // 继承Person
     *     var Person2 = new J.Class({extend : Person}, {
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *     
     * };
     * 
     */
    Class = function(){
        var length = arguments.length;
        var option = arguments[length-1];
        
        option.init = option.init || function(){};
        
        // 如果参数中有要继承的父类
        if(length === 2){
            /**
             * @ignore
             */
            var superClass = arguments[0].extend;
            
            /**
             * @ignore
             */
            var tempClass = function() {};
            tempClass.prototype = superClass.prototype;
            
            /**
             * @ignore
             */
            var subClass = function() {
                this.init.apply(this, arguments);
            }
            
            // 加一个对父类原型引用的静态属性
            subClass.superClass = superClass.prototype;
            //subClass.superClass = superClass;
            /**
             * @ignore
             */
            subClass.callSuper = function(context,func){
                var slice = Array.prototype.slice;
                var a = slice.call(arguments, 2);
                var func = subClass.superClass[func];
                //var func = subClass.superClass.prototype[func];
                if(func){
                    func.apply(context, a.concat(slice.call(arguments)));
                }
            };
            
            // 指定原型
            subClass.prototype = new tempClass();
            
            // 重新指定构造函数
            subClass.prototype.constructor = subClass;
            
            J.extend(subClass.prototype, option);
            
            /**
             * @ignore
             */
            subClass.prototype.init = function(){
                // 调用父类的构造函数
                // subClass.superClass.init.apply(this, arguments);
                // 调用此类自身的构造函数
                option.init.apply(this, arguments);
            };
            
            return subClass;
            
        // 如果参数中没有父类，则单纯构建一个类
        }else if(length === 1){
            /**
             * @ignore
             */
            var newClass = function() {
                // 加了return，否则init返回的对象不生效
                return this.init.apply(this, arguments);
            }
            newClass.prototype = option;
            return newClass;
        }
        
        
    };
    
    var Chunk = new Class({
        init : function(items, process, context, isShift, callback) {
            var todo = items.concat(), delay = 25;
            if(isShift){
                todo = items;
            }
            //this.timeout;
             this.timeout = window.setTimeout(function() {
                var start = +new Date();
     
                do {
                    process.call(context, todo.shift());
                } while(todo.length > 0 && (+new Date() - start < 50));
     
                if(todo.length > 0) {
                    this.timeout = window.setTimeout(arguments.callee, delay);
                } else if(callback) {
                    callback(items);
                }
     
            }, delay);
        },
        stop : function(){
            clearTimeout(this.timeout);
        }
    
    });
    /*
    Class = function(obj){
        var tempClass = function() {
            this.init.apply(this, arguments);
        }
        tempClass.prototype = obj;
        return tempClass;
    };
    */
    
    
    
    
    
    J.isUndefined = isUndefined;
    J.isNull = isNull;
    J.isNumber = isNumber;
    J.isString = isString;
    J.isBoolean = isBoolean;
    J.isObject = isObject;
    J.isArray = isArray;
    J.isArguments = isArguments;
    J.isFunction = isFunction;
    J.$typeof = $typeof;
    
    J.$return = $return;
    J.$try = $try;
    
    J.emptyFunc = emptyFunc;
    
    J.clone = clone;

    J.getLength = getLength;
    J.checkJSON = checkJSON;
    J.random = random;
    J.extend = extend;
    
    J.now = now;
    J.timedChunk = timedChunk;
    
    
    J.rebuild = rebuild;
    J.pass = pass;
    J.bind = bind;
    J.bindNoEvent = bindNoEvent;
    

    
    J.Class = Class;
    J.Chunk = Chunk;
    


});
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
 * Package: jx.array
 *
 * Need package:
 * jx.core.js
 * 
 */

/**
 * 4.[Javascript core]: array 数组处理
 */
Jx().$package(function(J){
    
    /**
     * array 名字空间
     * 
     * @namespace
     * @name array
     */
    J.array = J.array || {};
    var $A = J.array,
        // javascript1.6扩展
        indexOf,
        lastIndexOf,
        forEach,
        filter,
        some,
        map,
        every,
        // javascript1.8扩展
        reduce,
        reduceRight,
        
        // JET扩展
        toArray,
        remove,
        replace,
        bubbleSort,
        binarySearch,
        
        //集合的操作
        contains,
        uniquelize,
        intersect,
        minus,
        union;
    
    
    
    /**
     * 正向查找数组元素在数组中的索引下标
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Object} obj 要查找的数组的元素
     * @param {Number} fromIndex 开始的索引编号
     * 
     * @return {Number}返回正向查找的索引编号
     */
    indexOf = Array.prototype.indexOf 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.indexOf.apply(arguments[0], args);
        }
        : function (arr, obj, fromIndex) {
    
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, arr.length + fromIndex);
            }
            for (var i = fromIndex; i < arr.length; i++) {
                if (arr[i] === obj){
                    return i;
                }
            }
            return -1;
        };
    
    
        
    /**
     * 反向查找数组元素在数组中的索引下标
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Object} obj 要查找的数组元素
     * @param {Number} fromIndex 开始的索引编号
     * 
     * @return {Number}返回反向查找的索引编号
     */
    lastIndexOf = Array.prototype.lastIndexOf 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.lastIndexOf.apply(arguments[0], args);
        }
        : function (arr, obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = arr.length - 1;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, arr.length + fromIndex);
            }
            for (var i = fromIndex; i >= 0; i--) {
                if (arr[i] === obj){
                    return i;
                }
            }
            return -1;
        };
    
    

    
    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     */
    forEach = Array.prototype.forEach 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.forEach.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    fun.call(thisp, arr[i], i, arr);
                }
            }
        };
    
    /**
     * 用一个自定义函数来过滤数组
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 过滤函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Array}返回筛选出的新数组
     */
    filter = Array.prototype.filter 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.filter.apply(arguments[0], args);
        }
        : function(arr, fun) {
            var len = arr.length;
            if (typeof fun != "function") {
              throw new TypeError();
            }
            var res   = [];
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    var val = arr[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, arr)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
    
    
    


    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果有任意一个或多个数组成员使得函数执行结果返回 true，则最终返回 true，否则返回 false
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    some = Array.prototype.some 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.some.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
    
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr && fun.call(thisp, arr[i], i, arr)) {
                    return true;
                }
            }
    
            return false;
        };
    

    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，并把函数的返回结果以映射的方式存入到返回的数组中
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Array}返回映射后的新数组
     */
    map = Array.prototype.map 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.map.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var res   = new Array(len);
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    res[i] = fun.call(thisp, arr[i], i, arr);
                }
            }
    
            return res;
        };
    
    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果所有的数组成员都使得函数执行结果返回 true，则最终返回 true，否则返回 false
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    every = Array.prototype.every 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.every.apply(arguments[0], args);
        }
        : function(arr, fun) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr && !fun.call(thisp, arr[i], i, arr)) {
                    return false;
                }
            }
            return true;
        };
    
    
    
    
    
    /**
     * 对该数组的每项和前一次调用的结果运行一个函数，收集最后的结果。
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.8_Reference:Objects:Array:reduce
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    reduce = Array.prototype.reduce 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.reduce.apply(arguments[0], args);
        }
        : function(arr, fun /*, initial*/){
            var len = arr.length >>> 0;
            if (typeof fun != "function"){
                throw new TypeError();
            }
            // no value to return if no initial value and an empty array
            if (len == 0 && arguments.length == 2){
                throw new TypeError();
            }
            var i = 0;
            if (arguments.length >= 3){
                var rv = arguments[2];
            }
            else{
                do{
                    if (i in arr){
                      rv = arr[i++];
                      break;
                    }
                
                    // if array contains no values, no initial value to return
                    if (++i >= len){
                        throw new TypeError();
                    }
                }
                while (true);
            }
            
            for (; i < len; i++){
                if (i in arr){
                    rv = fun.call(null, rv, arr[i], i, arr);
                }
            }
            
            return rv;
        };
    
    
    
    /**
     * 同上，但从右向左执行。
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.8_Reference:Objects:Array:reduceRight
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    reduceRight = Array.prototype.reduceRight 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.reduceRight.apply(arguments[0], args);
        }
        : function(arr, fun /*, initial*/){
            var len = arr.length >>> 0;
            if (typeof fun != "function"){
                throw new TypeError();
            }
            // no value to return if no initial value, empty array
            if (len == 0 && arguments.length == 2){
                throw new TypeError();
            }
            var i = len - 1;
            if (arguments.length >= 3){
                var rv = arguments[2];
            }
            else{
                do{
                    if (i in arr){
                        rv = arr[i--];
                        break;
                    }
            
                    // if array contains no values, no initial value to return
                    if (--i < 0){
                        throw new TypeError();
                    }
                }
                while(true);
            }
            
            for (; i >= 0; i--){
                if (i in arr){
                    rv = fun.call(null, rv, arr[i], i, arr);
                }
            }
            
            return rv;
        };

    
    
    
    /**
     * 将任意变量转换为数组的方法
     * 
     * @memberOf array
     * @param {Mixed} o 任意变量
     * @return {Array} 返回转换后的数组
     */
    toArray = function(o){
        var type = J.$typeof(o);
        return (type) ? ((type != 'array' && type != 'arguments') ? [o] : o) : [];
    };
    
    
    
    
    /**
     * 从数组中移除一个或多个数组成员
     * 
     * @memberOf array
     * @param {Array} arr 要移除的数组成员，可以是单个成员也可以是成员的数组
     * @return {Boolean} 找到并移除, 返回 true
     */
    remove = function(arr, members){
        var members = toArray(members),
            i,
            j,
            flag = false;
        for(i=0; i<members.length; i++){
            for(j=0; j<arr.length; j++){
                if(arr[j] === members[i]){
                    arr.splice(j,1);
                    flag = true;
                }
            }
        }
        return flag;
    };
    
    /**
     * 替换一个数组成员
     * 
     * @memberOf array
     * @param {Object} oldValue 当前数组成员
     * @param {Object} newValue 要替换成的值
     * @return {Boolean} 如果找到旧值并成功替换则返回 true，否则返回 false
     */
    replace = function(arr, oldValue, newValue){
        var i;
        for(i=0; i<arr.length; i++){
            if(arr[i] === oldValue){
                arr[i] = newValue;
                return true;
            }
        }
        return false;
    };
    
    /**
     * 冒泡排序,默认从小到大排序
     * @memberOf array
     * @param {Array} arr 需要排序的数组
     * @param {Function} compareFunc 比较方法, 传入两个参数 a,b, 若返回 大于0 则表示 a > b, 小于 0 则 a < b
     *  可选, 默认返回 a - b的结果
     * @return {Array} 排序后的数组
     * @example
     * 
     * bubbleSort([3,5,6,2], function(a, b){
     *  return a - b;
     * });
     * 
     */
    bubbleSort = function(arr, compareFunc) {
        compareFunc = compareFunc || function(num1, num2){
            return num1 - num2;
        };
        //数组长度
        var n = arr.length;
        //交换顺序的临时变量
        var temp;//
        //交换标志
        var exchange;
        //最多做n-1趟排序
        for (var time=0; time<n-1; time++){
            exchange = false;
            for (var i=n-1; i>time; i--) {
                if (compareFunc(arr[i], arr[i - 1]) < 0) {
                //if (arr[i] < arr[i - 1]) {
                    exchange = true;
                    temp = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = temp;
                }
            }
            //若本趟排序未发生交换，提前终止算法
            if (!exchange) {
                break;
            }
        }
        return arr;
    };
    
    /**
     * 二叉搜索
     * @memberOf array
     * @param {Array} arr 源数组
     * @param {Object} item 查找的目标
     * @param {Function} compareFunc 比较方法, 传入两个参数 a,b, 若返回 大于0 则表示 a > b, 小于 0 则 a < b
     * @return {Number} item 所处的 index
     * 
     */
    binarySearch = function(arr, item, compareFunc){
        var start = 0;
        var end = arr.length;
        var current = Math.floor(arr.length/2);
        while(end != current){
            if(compareFunc(item, arr[current]) > 0){
                start = current + 1;
            }
            else{
                end = current;
            };
    
            current = Math.floor((start + end) / 2);
        };
        return current;
    };
    
    /**
     * 判断arr是否包含元素o
     * @memberOf array
     * @name contains
     * @function
     * @param {Array} arr
     * @param {Obejct} o
     * @return {Boolean}
     */
    contains = function(arr, o){
        return (indexOf(arr, o) > -1);
    };
    
    /**
     * 唯一化一个数组
     * @memberOf array
     * @param {Array} arr
     * @return {Array} 由不重复元素构成的数组
     */
    uniquelize = function(arr){
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++){
            if(!contains(result, arr[i])){
                result.push(arr[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的交集
     * a ∩ b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a ∩ b
     */
    intersect = function(a, b){
        var result = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(contains(b, a[i])){
                result.push(a[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的差集
     * a - b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a - b
     */
    minus = function(a, b){
        var result = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(!contains(b, a[i])){
                result.push(a[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的并集
     * a U b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a U b
     */
    union = function(a, b){
        return uniquelize(a.concat(b));
    };
    
    $A.indexOf = indexOf;
    $A.lastIndexOf = lastIndexOf;
    $A.forEach = forEach;
    $A.filter = filter;
    $A.some = some;
    $A.map = map;
    $A.every = every;
    $A.reduce = reduce;
    $A.reduceRight = reduceRight;

    $A.toArray = toArray;
    $A.remove = remove;
    $A.replace = replace;
    $A.bubbleSort = bubbleSort;
    $A.binarySearch = binarySearch;
    
    $A.contains = contains;
    $A.uniquelize = uniquelize;
    $A.intersect = intersect;
    $A.minus = minus;
    $A.union = union;
    
});








/**
 * 3.[Browser part]: Browser 资料分析包
 */
Jx().$package(function(J){
    J.browserOptions = {
        adjustBehaviors: true,
        htmlClass: true
    };
    //J.query = J.string.mapQuery(window.location.search);
    J.host = window.location.host;
    
    // 设置 domain
    // document.domain = 'kdv.cn';
    
    
    var pf = navigator.platform.toLowerCase(),
        ua = navigator.userAgent.toLowerCase(),
        plug = navigator.plugins,
        
        platform,
        browser,
        engine,

        toFixedVersion,
        s;
    
    /**
     * @ignore
     * @param String ver
     * @param Number floatLength
     * @return Number 
     */
    toFixedVersion = function(ver, floatLength){
        ver= (""+ver).replace(/_/g,".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    };
    
    /**
     * platform 名字空间
     * 
     * @namespace
     * @name platform
     * @type Object
     */
    platform = {
        getPlatform:function(){
            return pf;
        },
        
        /**
         * 操作系统的名称
         * 
         * @property name
         * @memberOf platform
         */
        name: (window.orientation != undefined) ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
        
        version: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * iPod touch
         * Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPod: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPad:0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0_1 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A400 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPhone:0,
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        android:0,
        
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        win: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        linux: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        mac: 0,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    platform[platform.name] = true;
    
    // 探测操作系统版本
    (s = ua.match(/windows ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/windows nt ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/linux ([\d.]+)/)) ? platform.set("linux",toFixedVersion(s[1])) :
    (s = ua.match(/mac ([\d.]+)/)) ? platform.set("mac",toFixedVersion(s[1])):
    (s = ua.match(/ipod ([\d.]+)/)) ? platform.set("iPod",toFixedVersion(s[1])):
    (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? platform.set("iPad",toFixedVersion(s[1])):
    (s = ua.match(/iphone ([\d.]+)/)) ? platform.set("iPhone",toFixedVersion(s[1])):
    (s = ua.match(/android ([\d.]+)/)) ? platform.set("android",toFixedVersion(s[1])) : 0;
    
    /**
     * browser 名字空间
     * 
     * @namespace
     * @name browser
     */
    browser = {
        /**
         * @namespace
         * @name features
         * @memberOf browser
         */
        features: 
        /**
         * @lends browser.features
         */    
        {
            /**
             * @property xpath
             */
            xpath: !!(document.evaluate),
            
            /**
             * @property air
             */
            air: !!(window.runtime),
            
            /**
             * @property query
             */
            query: !!(document.querySelector)
        },
        
        /**
         * 获取浏览器的插件信息
         * 
         */
        getPlugins: function(){
            return plug;
        },
        
        /**
         * @namespace
         * @name plugins
         * @memberOf browser
         */
        plugins: 
        /**
         * @lends browser.plugins
         */    
        {
            flash: (function(){
                //var ver = "none";
                var ver = 0;
                if (plug && plug.length) {
                    var flash = plug['Shockwave Flash'];
                    if (flash && flash.description) {
                        ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
                    }
                } else {
                    var startVer = 13;
                    while (startVer--) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                            ver = toFixedVersion(startVer);
                            break;
                        } catch(e) {}
                    }
                }
                
                return ver;
            })()
        },
        
        
        
        /**
         * 获取浏览器的userAgent信息
         * 
         * @memberOf browser
         */
        getUserAgent: function(){
            return ua;
        },
        
        /**
         * 用户使用的浏览器的名称，如：chrome
         * 
         * 
         * @description {String} 用户使用的浏览器的名称，如：chrome
         * @type Number
         */
        name: "unknown",
        
        /**
         * 浏览器的版本
         * @property version
         * @memberOf browser
         */
        version: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        ie: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        firefox: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        chrome: 0,
        
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        opera: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        safari: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        mobileSafari: 0,
        
        /**
         * 用户使用的是否是adobe 的air内嵌浏览器
         */
        adobeAir: 0,
        
        /**
         * 是否支持css3的borderimage
         * 
         * @description {boolean} 检测是否支持css3属性borderimage
         */
        //borderimage: false,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    // 探测浏览器并存入 browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
    (s = ua.match(/adobeair\/([\d.]+)/)) ? browser.set("adobeAir",toFixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;

    //mobile safari 判断，可与safari字段并存
    (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? browser.set("mobileSafari",toFixedVersion(s[1])) : 0;
    if(platform.iPad) browser.set('mobileSafari', '0.0');
    
    //browser.set("borderimage",browser.firefox>3 || browser.safari || browser.chrome);
    
    if(browser.ie){
        if(!document.documentMode) document.documentMode=Math.floor(browser.ie);
        else if(document.documentMode!==Math.floor(browser.ie)) browser.set("ie",toFixedVersion(document.documentMode));
    }
    
    //J.out(browser.name);
    //J.out(browser.ua);
    
    //!!navigator.userAgent.match(/Apple.*Mobile.*Safari/);
    
    /**
     * engine 名字空间
     * 
     * @namespace
     * @name engine
     * @memberOf browser
     */
    engine = {
        /**
         * 浏览器的引擎名字
         * 
         * @memberOf browser.engine
         */
        name: 'unknown',
        
        /**
         * 浏览器的引擎版本
         * 
         * @memberOf browser.engine
         */
        version: 0,
        
        /**
         * trident 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        trident: 0,
        
        /**
         * gecko 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * 
         */
        gecko: 0,
        
        /**
         * webkit 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        webkit: 0,
        
        /**
         * presto 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * @property presto
         */
        presto: 0,
        
        /**
         * 设置浏览器引擎的类型和版本
         * @ignore
         * @memberOf browser.engine
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
        
    };
    
    /*
    // 探测浏览器的内核并存入 browser.engine 对象
    (s = (!window.ActiveXObject) ? 0 : ((window.XMLHttpRequest) ? 5 : 4)) ? engine.set("trident", s):
    (s = (document.getBoxObjectFor == undefined) ? 0 : ((document.getElementsByClassName) ? 19 : 18)) ? engine.set("gecko",s) :
    (s = (navigator.taintEnabled) ? false : ((browser.features.xpath) ? ((browser.features.query) ? 525 : 420) : 419)) ? engine.set("webkit", s) :
    (s = (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925))) ? engine.set("presto", s) : 0;
    */
    
    // 探测浏览器的内核并存入 browser.engine 对象
    
    (s = ua.match(/trident\/([\d.]+)/)) ? engine.set("trident",toFixedVersion(s[1])):
    (s = ua.match(/gecko\/([\d.]+)/)) ? engine.set("gecko",toFixedVersion(s[1])) :
    (s = ua.match(/applewebkit\/([\d.]+)/)) ? engine.set("webkit",toFixedVersion(s[1])) :
    (s = ua.match(/presto\/([\d.]+)/)) ? engine.set("presto",toFixedVersion(s[1])) : 0;
    
    if(browser.ie){
        if(browser.ie == 6){
            engine.set("trident", toFixedVersion("4"));
        }else if(browser.ie == 7 || browser.ie == 8){
            engine.set("trident", toFixedVersion("5"));
        }
    }
    
    
    /**
     * 调整浏览器行为
     * 
     * @ignore
     */
    var adjustBehaviors = function() {
        // ie6 背景图片不能被缓存的问题
        if (browser.ie && browser.ie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            }catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
    }
    
    if(J.browserOptions.adjustBehaviors){
         adjustBehaviors();
    }
    
    var filterDot = function(string){
        //return J.string.replaceAll(string, "\.", "_");
        return String(string).replace(/\./gi,"_");
    };
    
    // 给html标签添加不同浏览器的参数className
    var addHtmlClassName = function() {
        var htmlTag = document.documentElement;
        var htmlClassName = [htmlTag.className];
        htmlClassName.push('javascriptEnabled');
        htmlClassName.push(platform.name);
        htmlClassName.push(platform.name + filterDot(platform.version));
        htmlClassName.push(browser.name);
        htmlClassName.push(browser.name + filterDot(browser.version));
        if(document.documentMode){
            htmlClassName.push('documentMode_' + document.documentMode);
        }
        htmlClassName.push(engine.name);
        htmlClassName.push(engine.name + filterDot(engine.version));
        
        if(browser.plugins.flash){
            htmlClassName.push("flash");
            htmlClassName.push("flash" + filterDot(browser.plugins.flash));
        }
        if(typeof(window['webTop']) != 'undefined' && window['webTop']) {
             htmlClassName.push("webTop");
        }
        htmlTag.className = htmlClassName.join(' ');
       
    }

    
    if(J.browserOptions.htmlClass){
        addHtmlClassName();
    }
    
    J.platform = platform;
    J.browser = browser;
    J.browser.engine = engine;
});
/**
 * 4.[Browser part]: dom 扩展包
 */
Jx().$package(function(J){
    var $D,
        $B,
        id,
        name,
        tagName,
        getText,
        getAttributeByParent,
        node,
        setClass,
        getClass,
        hasClass,
        addClass,
        removeClass,
        toggleClass,
        replaceClass,
        createStyleNode,
        setStyle,
        getStyle,
        setCssText,
        getCssText,
        addCssText,
        show,
        isShow,
        recover,
        hide,
        
        setTransform,
        getTransform,
        
        getScrollHeight,
        getScrollWidth,
        getClientHeight,
        getClientWidth,
        getOffsetHeight,
        getOffsetWidth,
        
        getScrollLeft,
        getScrollTop,
        getClientXY,
        setClientXY,
        getXY,
        setXY,
        getRelativeXY,
        getPosX,
        getPosY,
        getWidth,
        getHeight,
        
        getSelection,
        getSelectionText,
        getTextFieldSelection,
        
        contains,
        getHref,
    
        getDoc,
        _getDoc=null,
        getWin,
        w,
        getDocumentElement,
        DocumentElement,
        getDocHead,
        HeadElement;
    /**
     * dom 名字空间
     * 
     * @namespace
     * @name dom
     * @type Object
     */
    J.dom = J.dom || {};
    $D = J.dom;
    $B = J.browser;
    
        

    // find targeted window and @TODO create facades
    w = ($D.win) ? ($D.win.contentWindow) : $D.win  || window;
    $D.win = w;
    $D.doc = w.document;
    
    // feature detection 必须对已创建的对象检测
    var hasClassListProperty = document && Object.prototype.hasOwnProperty.call(document.documentElement,'classList');

    /**
     * 获取DocumentElement
     * 
     * @memberOf dom
     * 
     * @return {HTMLElement} documentElement
     * 
     */
    getDocumentElement = function(){
        if(DocumentElement) {
            return DocumentElement;
        }
        if(document.compatMode === 'CSS1Compat'){
            DocumentElement= document.documentElement;
        }else{
            DocumentElement= document.body;
        }
        return DocumentElement;
        
    };
    
    /**
     * 获取元素所属的根文档
     * 
     * @memberOf dom
     * @return {HTMLElement} document
     * 
     */
    getDoc = function(element) {
        if(element) {
            element = element || window.document;
            _getDoc= (element["nodeType"] === 9) ? element : element["ownerDocument"]
                || $D.doc;
            return _getDoc;        
        }else {
            if(_getDoc) {
                return _getDoc;
            }
            else {
                element = element || window.document;
                _getDoc= (element["nodeType"] === 9) ? element : element["ownerDocument"]
                    || $D.doc;
                return _getDoc;
            }            
        }

    };
    
    /**
     * 获取元素所属的 window 对象
     * returns the appropriate window.
     * 
     * @memberOf dom
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    getWin = function(element) {
        var doc = getDoc(element);
        return (element.document) ? element : doc["defaultView"] ||
            doc["parentWindow"] || $D.win;
    };
    
    /**
     * 获取文档的头节点
     * returns the head of the doc
     * 
     * @memberOf dom
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    getDocHead = function() {
        if(!HeadElement){        
           var doc = getDoc();
           HeadElement = doc.getElementsByTagName('head') ? doc.getElementsByTagName('head')[0] : doc.documentElement;
        }
        return HeadElement;
    };
    
    /**
     * 
     * 根据 id 获取元素
     * 
     * @method id
     * @memberOf dom
     * 
     * @param {String} id 元素的 id 名称
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     * 
     * @example
     * 
     * 
     */
    id = function(id, doc) {
        return getDoc(doc).getElementById(id);
    };
    
    /**
     * 
     * 根据 name 属性获取元素
     * 
     * @memberOf dom
     * 
     * @param {String} name 元素的 name 属性
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     */
    name = function(name, doc) {
        var el = doc;
        return getDoc(doc).getElementsByName(name);
    };
    
    /**
     * 
     * 根据 tagName 获取元素
     * 
     * @memberOf dom
     * 
     * @param {String} tagName 元素的 tagName 标签名
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     */
    tagName = function(tagName, el) {
        var el = el || getDoc();
        return el.getElementsByTagName(tagName);
    };
    
    /**
     * 获取元素中的文本内容
     * Returns the text content of the HTMLElement. 
     * 
     * @memberOf dom
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText = function(element) {
        var text = element ? element[TEXT_CONTENT] : '';
        if (text === UNDEFINED && INNER_TEXT in element) {
            text = element[INNER_TEXT];
        } 
        return text || '';
    };
    
    
    /**
     * 从起始元素查找某个属性，直到找到，或者到达顶层元素位置
     * Returns the text content of the HTMLElement. 
     * 
     * @memberOf dom
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getAttributeByParent = function(attribute, startNode,  topNode){
        var jumpOut = false;
        var el = startNode;
        var result;
        do{
            result = el.getAttribute(attribute);
            // 如果本次循环未找到result
            if(J.isUndefined(result) || J.isNull(result)){
                // 如果本次循环已经到了监听的dom
                if(el === topNode){
                    jumpOut = true;
                }
                // 如果本次循环还未到监听的dom，则继续向上查找
                else {
                    el = el.parentNode;
                }
            }
            // 如果找到了result
            else{
                jumpOut = true;
            }
        }
        while(!jumpOut);
        
        return result;
    };
    
    
    /** 
     * 生成一个 DOM 节点
     * Generates an HTML element, this is not appended to a document
     * 
     * @memberOf dom
     * 
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     */
    node = function(type, attrObj, win){
        var p,
            w = win || $D.win,
            d = document,
            n = d.createElement(type);
        var mapObj = {
            "class":function(){
                n.className = attrObj["class"];
            },
            "style":function(){
                setCssText(n, attrObj["style"]);
            }
        }
        for (p in attrObj) {
            if(mapObj[p]){
                mapObj[p]();
            }else{
                n.setAttribute(p, attrObj[p]);
            }
        }

        return n;
    };
    
    


    /**
     * 获取文档的 scroll 高度，即文档的实际高度
     * Returns the height of the document.
     * 
     * @method getDocumentHeight
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The height of the actual document (which includes the body and its margin).
     */
    getScrollHeight = function(el) {
        var scrollHeight;
        if(el){
            scrollHeight = el.scrollHeight;
        }else{
            scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
        return scrollHeight || 0;
    };
    
    /**
     * 获取文档的 scroll 宽度，即文档的实际宽度
     * Returns the width of the document.
     * 
     * @method getDocumentWidth
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The width of the actual document (which includes the body and its margin).
     */
    getScrollWidth = function(el) {
        var scrollWidth;
        if(el){
            scrollWidth = el.scrollWidth;
        }else{
            scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        }
        return scrollWidth || 0;
    };

    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getClientHeight
     * @memberOf dom
     * @return {Number} The height of the viewable area of the page (excludes scrollbars).
     */
    getClientHeight = function(el) {
        //var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.clientHeight; // IE, Gecko
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getClientWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    
    getClientWidth = function(el) {
        //var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.clientWidth; // IE, Gecko
    };
    
    
    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getOffsetHeight
     * @memberOf dom
     * @return {Number} The height of the viewable area of the page (excludes scrollbars).
     */
    getOffsetHeight = function(el) {
        var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.offsetHeight; 
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getOffsetWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    getOffsetWidth = function(el) {
        var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.offsetWidth;
    };
    
    /**
     * 获取当前文档的左边已卷动的宽度
     * Returns the left scroll value of the document 
     * @method getDocumentScrollLeft
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Number}  The amount that the document is scrolled to the left
     */
    getScrollLeft = function(el) {
        var scrollLeft;
        if(el){
            scrollLeft = el.scrollLeft;
        }else{
            scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        }
        return scrollLeft || 0;
    };

    /**
     * 获取当前文档的上边已卷动的宽度
     * Returns the top scroll value of the document 
     * @method getDocumentScrollTop
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Number}  The amount that the document is scrolled to the top
     */
    getScrollTop = function(el) {
        var scrollTop;
        if(el){
            scrollTop = el.scrollTop;
        }else{
            scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
        return scrollTop || 0;
    };

    
    /**
     * 
     * 设置元素的class属性
     * 
     * @method setClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    setClass = function(el, className){
        el.className = className;
    };
    
    /**
     * 
     * 获取元素的class属性
     * 
     * @method getClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    getClass = function(el){
        return el.className;
    };

    /**
     * 
     * 判断元素是否含有 class
     * @function
     * @method hasClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    hasClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return el.classList.contains(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
            };
        }
    }();

    /**
     * 
     * 给元素添加 class
     * @function
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    addClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className || hasClass(el, className)) {
                    return;
                }
                el.classList.add(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className || hasClass(el, className)) {
                    return;
                }
                el.className += ' ' + className;
            };
        }
    }();

    /**
     * 
     * 给元素移除 class
     * @function
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    removeClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className || !hasClass(el, className)) {
                    return;
                }
                el.classList.remove(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className || !hasClass(el, className)) {
                    return;
                }
                el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
            };
        }
    }();
    
    /*
    removeClass2 = function(el, className){
        replaceClass(el, className, "");
    };
    */
    
    
    /**
     * 
     * 对元素 class 的切换方法，即：如果元素用此class则移除此class，如果没有此class则添加此class
     * 
     * @function
     * @method toggleClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    toggleClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className) {
                    return;
                }
                el.classList.toggle(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className) {
                    return;
                }
                hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
            };
        }
    }();

    /**
     * 
     * 替换元素 oldClassName 为 newClassName
     * 
     * @method toggleClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} oldClassName 被替换的 class 名称
     * @param {String} newClassName 要替换成的 class 名称
     */
    replaceClass = function(el, oldClassName, newClassName){
        removeClass(el, oldClassName);
        addClass(el, newClassName);
        //el.className = (" "+el.className+" ").replace(" "+oldClassName+" "," "+newClassName+" ");
    };
    /*
    replaceClass2 = function(el, oldClassName, newClassName){
        var i,
            tempClassNames = el.className.split(" ");
            
        for(i=0; i<tempClassNames.length; i++){
            if(tempClassNames[i] === oldClassName){
                tempClassNames[i] = newClassName;
            }
        }
        //J.out(tempClassNames);

        el.className = tempClassNames.join(" ");
    };
    */
    
    /**
     * 
     * 创建 style 标签
     * 
     * @method setStyle
     * @memberOf dom
     * 
     * @param 样式内容，支持string和object
     * @param {String} id 样式标签的 id
     */
    createStyleNode = function(styles, id){
        var styleNode = $D.node('style', {
            'id': id || '',
            'type': 'text/css'
        });

        $D.getDocHead().appendChild(styleNode);

        var stylesType = typeof(styles);
        if(stylesType == "string"){     //参数是文本
            if(styleNode.styleSheet){    //IE
                styleNode.styleSheet.cssText = styles;
            }else{
                var tn = document.createTextNode(styles);
                styleNode.appendChild(tn);
            }
        }else if(stylesType == "object"){   //参数是对象
            var i = 0,
                styleSheet = document.styleSheets[document.styleSheets.length-1];
            for(selector in styles){
                if(styleSheet.insertRule){
                    var rule = selector + "{" + styles[selector] + "}";
                    styleSheet.insertRule(rule, i++);
                }else {                  //IE
                    styleSheet.addRule(selector, styles[selector], i++);
                }
            }
        }

        return styleNode;
    };
    
    /**
     * 
     * 设置元素的样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method setStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @param {String} value css 属性值
     */
    setStyle = function(el, styleName, value){
        if(!el){
            return;
        }
        
        var name = J.browser.name;
        if(styleName === "float" || styleName === "cssFloat"){
            if(name === "ie"){
                styleName = "styleFloat";
            }else{
                styleName = "cssFloat";
            }
        }
        
        //J.out(styleName);
        
        if(styleName === "opacity" && name === "ie" && J.browser.ie<9){
            var opacity = value*100;
            
            /*
            if(el.style.filter.alpha){
                
                el.style.filter.alpha.opacity = opacity;
                J.debug("filter alpha!")
            }else{
                addCssText(el,'filter:alpha(opacity="' + opacity + '")');
            }*/
            //addCssText(el,'filter:alpha(opacity="' + opacity + '")');
            //J.out(">>>el.style.filter.alpha.opacity: "+el.style.filter.alpha.opacity);
            el.style.filter = 'alpha(opacity="' + opacity + '")';

            if(!el.style.zoom){
                el.style.zoom = 1;
            }

            return;
        }
        el.style[styleName] = value;
    };
    
    

    
    /**
     * 
     * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method getStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @return {String} 返回元素样式
     */
    getStyle = function(el, styleName){
        if(!el){
            return;
        }
        
        var win = getWin(el);
        var name = J.browser.name;
        //J.out(name);
        if(styleName === "float" || styleName === "cssFloat"){
            if(name === "ie"){
                styleName = "styleFloat";
            }else{
                styleName = "cssFloat";
            }
        }
        if(styleName === "opacity" && name === "ie" && J.browser.ie<9){
            var opacity = 1,
                result = el.style.filter.match(/opacity=(\d+)/);
            if(result && result[1]){
                opacity = result[1]/100;
            }
            return opacity;
        }
        
        if(el.style[styleName]){
            return el.style[styleName];
        }else if(el.currentStyle){
            //alert(el.currentStyle[styleName]);
            return el.currentStyle[styleName];
        }else if(win.getComputedStyle){
            //J.out(win.getComputedStyle(el, null));
            return win.getComputedStyle(el, null)[styleName];
        }else if(document.defaultView && document.defaultView.getComputedStyle){
            styleName = styleName.replace(/([/A-Z])/g, "-$1");
            styleName = styleName.toLowerCase();
            var style = document.defaultView.getComputedStyle(el, "");
            return style && style.getPropertyValue(styleName);
        }

    };

    /**
     * 
     * 给元素添加cssText
     *  
     * @method addCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} cssText css 属性
     */
    addCssText = function(el, cssText){
        el.style.cssText += ';' + cssText;
    };
    
    /**
     * 
     * 给元素设置cssText
     *  
     * @method setCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} cssText css 属性
     */
    setCssText = function(el, cssText){
        el.style.cssText = cssText;
    };
    /**
     * 
     * 获取元素的cssText
     *  
     * @method getCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    getCssText = function(el){
        return el.style.cssText;
    };
    
    /**
     * 
     * 显示元素
     * 
     * @method show
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} displayStyle 强制指定以何种方式显示，如：block，inline，inline-block等等
     */
    show = function(el, displayStyle){
        var display;
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(_oldDisplay){
            display = _oldDisplay;
        }else{
            display = getStyle(el, "display");
        }

        if(displayStyle){
            setStyle(el, "display", displayStyle);
        }else{
            if(display === "none"){
                setStyle(el, "display", "block");
            }else{
                setStyle(el, "display", display);
            }
        }
    };
    
    /**
     * 
     * 判断元素是否是显示状态
     * 
     * @method isShow
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    isShow = function(el){
        var display = getStyle(el, "display");
        if(display === "none"){
            return false;
        }else{
            return true;
        }
    };
    
    /**
     * 
     * 还原元素原来的display属性
     * 
     * @method recover
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    recover = function(el){
        var display;
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(_oldDisplay){
            display = _oldDisplay;
        }else{
            display = getStyle(el, "display");
        }
        if(display === "none"){
            setStyle(el, "display", "");
        }else{
            setStyle(el, "display", display);
        }
    };
    
    /**
     * 
     * 隐藏元素
     * 
     * @method hide
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    hide = function(el){
        var display = getStyle(el, "display");
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(!_oldDisplay){
            if(display === "none"){
                el.setAttribute("_oldDisplay", "");
            }else{
                el.setAttribute("_oldDisplay", display);
            }
        }
        setStyle(el, "display", "none");
    };
    

    //获取当前浏览器支持的transform属性
    var transform = function() {
        var styles = document.createElement('a').style,
            props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'];

        for (var i = props.length; i--;) {
            if (props[i] in styles) return props[i];
        }
    } ();
    /**
     *
     * 设置元素的transform属性
     * 
     * @method setTransform
     * @memberOf dom
     * 
     * @param {element} target  要设置属性的元素
     * @param {mixed}   value   属性值，类型视具体属性而定
     * @param {string}  style   要设置的属性，如果不指定则默认为transform
     */
    setTransform = function(target, value, style){
        var v = target.style[transform] || '';
        
        switch(style) {
            case 'translate3d'  :
            case 'translate3d-x':
            case 'translate3d-y':
            case 'translate3d-z':
                if(!/translate3d\([^)]*\)/.test(v)) v += ' translate3d(0px,0px,0px)';
                if (style != 'translate3d') {
                    var temp = {x : '$1', y : '$2', z : '$3'};
                    var map = {'translate3d-x':'x', 'translate3d-y':'y', 'translate3d-z':'z'};
                    temp[map[style]] = value;
                    value = temp;
                }
                v = v.replace(/translate3d\(([^,]*)px,([^,]*)px,([^,]*)px\)/,
                    'translate3d(' + value.x + 'px,' + value.y + 'px,' + value.z + 'px)');
                break;
            case 'translate'    :
            case 'translate-x':
            case 'translate-y':
                if(!/translate\([^)]*\)/.test(v)) v += ' translate(0px,0px)';
                if (style != 'translate') {
                    var temp = {x : '$1', y : '$2'};
                    var map = {'translate3d-x':'x', 'translate3d-y':'y'};
                    temp[map[style]] = value;
                    value = temp;
                }
                v = v.replace(/translate\(([^,]*)px,([^,]*)px\)/,
                    'translate(' + value.x + 'px,' + value.y + 'px)');
                break;
            case 'scale':
                v = (/scale\([^)]*\)/.test(v)?
                    v.replace(/scale\([^)]*\)/, 'scale(' + value + ')'):
                    v + ' scale(' + value + ')'
                );
                break;
            case 'rotate':
                v = (/rotate\([^)]*\)/.test(v)?
                    v.replace(/rotate\([^)]*\)/, 'rotate(' + value + 'deg)'):
                    v + ' rotate(' + value + 'deg)'
                );
                break;
            default:
                //没有设置style的话，直接修改transform属性
                v = value;
        }
        
        target.style[transform] = v;
    };
    
    /**
     *
     * 获取CSS3 transform属性的值，或具体的scale等的值
     * 
     * @method getTransform
     * @memberOf dom
     * 
     * @param {element} target  要获取属性的元素
     * @param {string}  style   要获取的属性，如果不指定则默认为transform
     */
    getTransform = function(target, style){
        //获取属性。就算设置的时候写的是0，读取的时候还是会读到 0px
        var v = target.style[transform] || 'scale(1) translate(0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)';
        
        switch(style){
            case 'scale':
                v = /scale\(([^)]*)\)/.exec(v);
                v = v? Number(v[1]): 1;
                break;
            case 'translate3d':
            case 'translate3d-x':
            case 'translate3d-y':
            case 'translate3d-z':
                v = /translate3d\(([^,]*)px,([^,]*)px,([^,]*)px\)/.exec(v) || [0,0,0,0];
                if(style != 'translate3d') {
                    var map = {'translate3d-x':1, 'translate3d-y':2, 'translate3d-z':3};
                    v = Number(v[map[style]]);
                }
                else {
                    v = {x : Number(v[1]), y : Number(v[2]), z : Number(v[3])};
                }
                break;
            case 'translate':
            case 'translate-x':
            case 'translate-y':
                v = /translate\(([^,]*)px,([^,]*)px\)/.exec(v) || [0,0,0];
                if(style != 'translate') {
                    var map = {'translate-x':1, 'translate-y':2};
                    v = Number(v[map[style]]);
                }
                else {
                    v = {x : Number(v[1]), y : Number(v[2])};
                }
                break;
            case 'rotate':
                v = /rotate\(([^)]*)deg\)/.exec(v);
                v = v? Number(v[1]): 0;
                break;
            default:
        }
        
        return v;
    };
    
    
    /**
     * 获取对象坐标
     *
     * @method getClientXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return Array [left,top]
     */
    getClientXY = function(el) {
        var _t = 0,
            _l = 0;

        if (el) {
            //这里只检查document不够严谨, 在el被侵染置换(jQuery做了这么恶心的事情)
            //的情况下, el.getBoundingClientRect() 调用回挂掉
            if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) { // 顶IE的这个属性，获取对象到可视范围的距离。
                //现在firefox3，chrome2，opera9.63都支持这个属性。
                var box = {left:0,top:0,right:0,bottom:0};//
                try{
                    box=el.getBoundingClientRect();
                }catch(ex){
                    return [0,0];
                }
                var oDoc = el.ownerDocument;
                
                var _fix = J.browser.ie ? 2 : 0; //修正ie和firefox之间的2像素差异
                
                _t = box.top - _fix + getScrollTop(oDoc);
                _l = box.left - _fix + getScrollLeft(oDoc);
            } else {//这里只有safari执行。
                while (el.offsetParent) {
                    _t += el.offsetTop;
                    _l += el.offsetLeft;
                    el = el.offsetParent;
                }
            }
        }
        return [_l, _t];
    };
    
    /**
     * 设置dom坐标
     * 
     * @method setClientXY
     * @memberOf dom
     
     * @param {HTMLElement} el
     * @param {string|number} x 横坐标
     * @param {string|number} y 纵坐标
     */
    setClientXY = function(el, x, y) {
        x = parseInt(x) + getScrollLeft();
        y = parseInt(y) + getScrollTop();
        setXY(el, x, y);
    };

    /**
     * 获取对象坐标
     * 
     * @method getXY
     * @memberOf dom
     *
     * @param {HTMLElement} el
     * @return Array [top,left]
     */
    getXY = function(el) {
        var xy = getClientXY(el);

        xy[0] = xy[0] + getScrollLeft();
        xy[1] = xy[1] + getScrollTop();
        return xy;
    }

    /**
     * 设置dom坐标
     * @method setXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @param {string|number} x 横坐标
     * @param {string|number} y 纵坐标
     */
    setXY = function(el, x, y) {
        var _ml = parseInt(getStyle(el, "marginLeft")) || 0;
        var _mt = parseInt(getStyle(el, "marginTop")) || 0;

        setStyle(el, "left", parseInt(x) - _ml + "px");
        setStyle(el, "top", parseInt(y) - _mt + "px");
    };
    
    /**
     * 获取对象相对一个节点的坐标
     *
     * @method getRelativeXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @param {HTMLElement} relativeEl 
     * @return Array [top,left]
     * 
     */
    getRelativeXY = function(el, relativeEl) {
        var xyEl = getXY(el);
        var xyRelativeEl = getXY(relativeEl);
        var xy=[];
        
        xy[0] = xyEl[0] - xyRelativeEl[0];
        xy[1] = xyEl[1] - xyRelativeEl[1];
        return xy;
    }
    
    var parseCssPx = function(value){
        if(!value || value == 'auto') return 0;
        else return parseInt(value.substr(0, value.length-2));
    }
    /**
     * 获取x坐标的简便方法
     *
     * @method getPosX
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getPosX = function(el){
        return parseCssPx($D.getStyle(el, 'left'));
    }
    /**
     * 获取y坐标的简便方法
     *
     * @method getPosY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getPosY = function(el){
        return parseCssPx($D.getStyle(el, 'top'));
    }
    /**
     * 获取宽度的简便方法
     *
     * @method getWidth
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getWidth = function(el){
        return parseCssPx($D.getStyle(el, 'width'));
    }
    /**
     * 获取高度的简便方法
     *
     * @method getHeight
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getHeight = function(el){
        return parseCssPx($D.getStyle(el, 'height'));
    }
    
    /**
     * 获取选择的文本
     *
     * @method getSelectionText
     * @memberOf dom
     * 
     * @param {Window} win
     * @return {String} 返回选择的文本
     */
    getSelectionText = function(win) {
        win = win || window;
        var doc = win.document;
        if (win.getSelection) {
            // This technique is the most likely to be standardized.
            // getSelection() returns a Selection object, which we do not document.
            return win.getSelection().toString();
        }else if (doc.getSelection) {
            // This is an older, simpler technique that returns a string
            return doc.getSelection();
        }else if (doc.selection) {
            // This is the IE-specific technique.
            // We do not document the IE selection property or TextRange objects.
            return doc.selection.createRange().text;
        }
    
    };


    /**
     * FireFox 下获取 input 或者 textarea 中选中的文字
     *
     * @method getTextFieldSelection
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String} 返回选择的文本
     */
    getTextFieldSelection = function(el) {
        if (el.selectionStart != undefined && el.selectionEnd != undefined) {
            var start = el.selectionStart;
            var end = el.selectionEnd;
            return el.value.substring(start, end);
        }else{
            return ""; // Not supported on this browser
        }
    
    };
    
    /**
     * 判断一个节点是否是某个父节点的子节点, 
     * 默认不包含parent === child的情况
     * @memberOf dom
     * @name contains
     * @function
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     * @param {Boolean} containSelf 指示是否包括parent等于child的情况
     * @return {Boolean} 包含则返回true
     */
    contains = function(parent, child, containSelf){
        if(!containSelf && parent === child){
            return false;
        }
        if(parent.compareDocumentPosition){//w3c
            var res = parent.compareDocumentPosition(child);
            if(res == 20 || res == 0){
                return true;
            }
        }else{
            if(parent.contains(child)){//ie
                return true;
            }
        }
        return false;
    };
    
    /**
     * 取一个a标签的href的绝对路径
     * @method getFullHref
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String} 返回一个完整的url
     */
    getHref = function(el){
        var result;
        if($B.ie && $B.ie<=7){
            result=el.getAttribute('href',4);
        }else{
            result=el.href;
        }
        return result || null;
    };
    
    
    
    var scripts = tagName("script");
    for(var i=0; i<scripts.length; i++){
        
        if(scripts[i].getAttribute("hasJx")=="true"){
            //J.out("hasJx: "+(scripts[i].getAttribute("hasJx")=="true"));
            J.src = scripts[i].src;
        }
    }
    if(!J.src){
        J.src = scripts[scripts.length-1].src;
    }
    
    J.filename = J.src.replace(/(.*\/){0,}([^\\]+).*/ig,"$2");
    //J.out(J.src+" _ "+J.filename)
    J.path = J.src.split(J.filename)[0];
    
    
    $D.getDoc = getDoc;
    
    $D.id = id;
    $D.name = name;
    $D.tagName = tagName;
    $D.getText = getText;
    $D.getAttributeByParent = getAttributeByParent;
    $D.node = node;
    $D.setClass = setClass;
    $D.getClass = getClass;
    $D.hasClass = hasClass;
    
    $D.addClass = addClass;
    $D.removeClass = removeClass;
    $D.toggleClass = toggleClass;
    $D.replaceClass = replaceClass;
    
    $D.createStyleNode = createStyleNode;
    $D.setStyle = setStyle;
    $D.getStyle = getStyle;
    
    $D.setCssText = setCssText;
    $D.getCssText = getCssText;
    $D.addCssText = addCssText;
    
    $D.show = show;
    $D.isShow = isShow;
    $D.recover = recover;
    $D.hide = hide;
    
    
    $D.getScrollLeft = getScrollLeft;
    $D.getScrollTop = getScrollTop;
    $D.getScrollHeight = getScrollHeight;
    $D.getScrollWidth = getScrollWidth;
    
    $D.getClientHeight = getClientHeight;
    $D.getClientWidth = getClientWidth;
    
    $D.getOffsetHeight = getOffsetHeight;
    $D.getOffsetWidth = getOffsetWidth;
    
    $D.getClientXY = getClientXY;
    $D.setClientXY = setClientXY;
    
    $D.getXY = getXY;
    $D.setXY = setXY;
    $D.getRelativeXY = getRelativeXY;
    $D.getPosX = getPosX;
    $D.getPosY = getPosY;
    $D.getWidth = getWidth;
    $D.getHeight = getHeight;
    $D.getSelection = getSelection;
    $D.getSelectionText = getSelectionText;
    
    $D.getTextFieldSelection = getTextFieldSelection;
    
    $D.getDocumentElement = getDocumentElement;
    $D.getDocHead = getDocHead;
    
    $D.contains = contains;
    $D.getHref = getHref;
    
});
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
    
    // In DOM-compliant browsers, our functions are trivial wrappers around
    // addEventListener( ) and removeEventListener( ).
    if (document.addEventListener) {
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
    // In IE 5 and later, we use attachEvent( ) and detachEvent( ), with a number of
    // hacks to make them compatible with addEventListener and removeEventListener.
    else if (document.attachEvent) {//<del>这里不能用特性判断, 否则opera也会使用这个方法绑定事件</del>
        //<del>ie都用这个方法是因为ie9对标准的addEventListener支持不完整</del>
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
                    //if(!isMove){
                        //@TODO fire the event
                    //}
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
     * Publish
     * @class 
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
    hexToRgb = function(string, array){
        var hex = string.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (hex) ? hex.slice(1).hexToRgb(array) : null;
    };

    /**
     * 将颜色 RGB 写法转换成 Hex 写法
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    rgbToHex = function(string, array){
        var rgb = string.match(/\d{1,3}/g);
        return (rgb) ? rgb.rgbToHex(array) : null;
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
    /*var _open=window.open;
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
    window.open = open;*/
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
                            margin-left:3px;\
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

            $D.createStyleNode(this._cssText);
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
         * @param {Array} logArr 日志数组
         * @param {Number} type 类型
         * @return {Array} logArr 匹配的日志数组
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
         * @param {Array} logArr 日志数组
         * @param {String} tag 类型
         * @return {Array} logArr 匹配的日志数组
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
         * @param {Array} logArr 日志数组
         * @param {String} msg 类型
         * @return {Array} logArr 匹配的日志数组
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
                }// else if (type == 'warn') {
                    // TBD
                //}
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
 * Package: jet.cookie
 *
 * Need package:
 * jet.core.js
 * 
 */


/**
 * cookie类
 * 
 * @namespace J.cookie
 */
Jx().$package(function(J){
    var domainPrefix = window.location.host;
    
    /**
     * cookie 名字空间
     * @namespace 
     * @name cookie
     */
    J.cookie = 
    /**
     * @lends cookie
     */ 
    {
        
        /**
         * 设置一个cookie
         * 
         * @param {String} name cookie名称
         * @param {String} value cookie值
         * @param {String} domain 所在域名
         * @param {String} path 所在路径
         * @param {Number} hour 存活时间，单位:小时
         * @return {Boolean} 是否成功
         */
        set : function(name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }
            window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
    
        /**
         * 获取指定名称的cookie值
         * 
         * @param {String} name cookie名称
         * @return {String} 获取到的cookie值
         */
        get : function(name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            // var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*?)(?:;|$)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
            // document.cookie.match(new
            // RegExp("(?:^|;+|\\s+)speedMode=([^;]*?)(?:;|$)"))
        },
    
        /**
         * 删除指定cookie,复写为过期
         * 
         * @param {String} name cookie名称
         * @param {String} domain 所在域
         * @param {String} path 所在路径
         */
        remove : function(name, domain, path) {
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    };

});

Jx().$package(function(J){
    /**
     * localStorage 名字空间
     * @namespace 
     * @name localStorage
     */
    J.localStorage = 
    /**
     * @lends localStorage
     */ 
    {
        
        /**
         * 设置一个localStorage
         * @param {String} name
         * @param {String} value
         */
        setItem : function(name, value) {
            if(this.isSupports()){
                window.localStorage.setItem(name,value);
            }
        },
        /**
         * 根据名字读取值
         * @param {String} name
         * @return {String}
         */
        getItem : function(name) {
            if(this.isSupports()){
                return window.localStorage.getItem(name);
            }
            return null;
        },
        /**
         * 根据名字移除值
         * @param {String} name
         */
        removeItem : function(name) {
            if(this.isSupports()){
                window.localStorage.removeItem(name);
            }
        },
        /**
         * 清空 localStorage
         */
        clear : function(){
            if(this.isSupports()){
                window.localStorage.clear();
            }
        },
        /**
         * 判断是否支持 localStorage
         */
        isSupports : function(){
            return ('localStorage' in window)&&window['localStorage']!== null;
        }
    };

});
/**
 * format 扩展包
 */
Jx().$package(function(J){
    
    /**
     * number 名字空间
     * 
     * @namespace
     * @name format
     * @type Object
     */
    J.format = J.format || {};
    
    /**
     * 让日期和时间按照指定的格式显示的方法
     * @method date
     * @memberOf format
     * @param {String} format 格式字符串
     * @return {String} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var d = new Date();
     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
     *     J.format.date(d, "YYYY-MM-DD hh:mm:ss");
     * };
     * 
     */
    var date = function(date, formatString){
        /*
         * eg:formatString="YYYY-MM-DD hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth()+1,    //month
            "D+" : date.getDate(),    //day
            "h+" : date.getHours(),    //hour
            "m+" : date.getMinutes(),    //minute
            "s+" : date.getSeconds(),    //second
            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
            "S" : date.getMilliseconds()    //millisecond
        }
    
        if(/(Y+)/.test(formatString)){
            formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
    
        for(var k in o){
            if(new RegExp("("+ k +")").test(formatString)){
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return formatString;
    };
    
    /**
     * @memberOf format
     * @method number
     * 格式化数字显示方式
     * @param num 要格式化的数字
     * @param pattern 格式
     * @example 
     * J.format.number(12345.999,'#,##0.00');
     *  //out: 12,34,5.99
     * J.format.number(12345.999,'0'); 
     *  //out: 12345
     * J.format.number(1234.888,'#.0');
     *  //out: 1234.8
     * J.format.number(1234.888,'000000.000000');
     *  //out: 001234.888000
     */  
    var number = function(num, pattern) {
        var strarr = num ? num.toString().split('.') : ['0'];
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr = '';
    
        // 整数部分
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length - 1;
        var comma = false;
        for (var f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    else
                        retstr = '0' + retstr;
                    break;
                case ',' :
                    comma = true;
                    retstr = ',' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0)
                        retstr = ',' + retstr;
                }
            } else
                retstr = str.substr(0, i + 1) + retstr;
        }
    
        retstr = retstr + '.';
        // 处理小数部分
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    break;
                case '0' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    else
                        retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    };
    
    J.format.date = date;
    J.format.number = number;
    
});
/**
 * 6.[Date part]: date 扩展包
 * 已移到J.format.date实现
 */
Jx().$package(function(J){
    
    /**
     * dom 名字空间
     * 
     * @namespace
     * @name date
     * @type Object
     */
    J.date = J.date || {};
    
    /**
     * 让日期和时间按照指定的格式显示的方法
     * 
     * @memberOf date
     * @name format
     * @function
     * @param {String} format 格式字符串
     * @return {String} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var d = new Date();
     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
     *     J.date.format(d, "YYYY-MM-DD hh:mm:ss");
     * };
     * 
     */
    J.date.format = J.format.date;
    
});
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
 * 这个文件用来配置一些开发的时候需要用到的功能
 * 把
 *    J.profile
 *    J.warn
 *    J.error
 *    J.info
 *    J.debug
 *   都转向window.console(如果有的话)
 */


;Jx().$package(function(J){
    
    if(window.console){
        var logFunc = [
            'profile',
            'warn',
            'error',
            'info',
            'debug'
        ];
        var defaultLogFunc = 'log';
        var bulidFunc = function(context, funcName){
            return function(arg){
                context[funcName](arg);
            };
        }
        for(var i = 0, len = logFunc.length, name; i < len; i++){
            name = logFunc[i];
            //profile是用来检测性能的
            J[name] = console[name] ? bulidFunc(console, name == 'profile' ? defaultLogFunc : name) : bulidFunc(console, defaultLogFunc);
        }
    }
});














Jx().$package(function(J){
    var EventParser=J.Class({
        init: function() {
            var _this= this;
            this.op= [
                {
                    ".": function(word,target) {
                        return target.className==word;
                    },
                    "+": function(word,target) {
                        return target.getAttribute(word);
                    },
                    "#": function(word,target) {
                        return target.id==word;
                    },
                    ".~": function(word,target) {
                        return $D.hasClass(target,word);
                    }
                },
                {
                    ">": function(word,e) {
                        var p,wordP,wordS,s;
                        s= word.split(">");
                        wordP= s[0];
                        wordS= s[1];
                        //通配符支持
                        if( (wordS=="*"?true:_this.match(wordS,e)) && 
                            (p= _this.operate(_this.detectAncestor, wordP, e)())) {//检测符合特征的祖先节点
                            return _this.packEvent(e, p);
                        }
                        return false;
                    }
                },
                {
                    "!": function(word,e) {
                        word= word.substr(1);
                        return !_this.match(word,e);
                    }
                },
                {
                    "&&": function(word,e) {
                        var wordL,wordR,s;
                        s= word.split("&&");
                        wordL= s[0];
                        wordR= s.slice(1).join("");
                        if(_this.match(wordL,e)) {
                            if(wordR.indexOf("&&")==-1) {
                                return _this.match(wordR,e);
                            }else {
                                return arguments.callee(wordR,e);
                            }
                        }
                        return false;
                    }
                }
            ];
            //优先级从下往上递减,对应于this.op
            this.op2Level= [
                [".","#","+",".~"],//第一级操作符
                ">",//第二级操作符
                "!",//第三级操作符
                "&&"//第四级操作符
            ];
        },
        //寻找符合特征的祖先节点
        detectAncestor: function(word, e, func) {
            //if over 5...sorry.
            //I think you should never touch the limit.
            var max=5;
            var target= e.target;
            return function () {
                if(func(word,target)) {
                    return target;
                }else if(max>0) {
                    max--;
                    if(target.parentNode) {
                        target= target.parentNode;
                    }else {
                        max= 0;
                    }
                    return arguments.callee();
                }
                return null;
            }
        },
        //用于对target跟特征的匹配
        //因为e.target并不总是我们期待的target
        detect: function(word, e, func) {
            var target= e.target;
            if(target.nodeType!=1) {//ipad下总是发生
                target= target.parentNode;
                if(func(word,target)) {
                    return this.packEvent(e,target);
                }
            }else {
                return func(word,target);
            }
            return false;
        },
        packEvent: function(e, target) {
            return [true,
                    {
                        target: target,
                        oTarget: e.target,
                        stopPropagation: function(){
                           e.stopPropagation();
                        },
                        preventDefault: function(){
                            e.preventDefault();
                        },
                        pageX: e.pageX,
                        pageY: e.pageY
                    }
            ];
        },
        operate: function(func,word,e) {
            var p,
                i=3;//("..#").length=3 由长至短检查是否有对应的第一级操作符
            while(i>0) {
                if(p= this.op[0][word.substr(0,i)]) {
                    var result= null;
                    if(result= func(word.substr(i),e,p)) {
                        return result;
                    }
                }
                i--;
            }
            return false;
        },
        //按照层级进行匹配
        match: function(word,e) {
            var p;
            //level > 0
            for(var len=this.op2Level.length;len>0;len--) { //这里稍耗性能
                var sig= this.op2Level[len];
                if(word.indexOf(sig) != -1 ) {
                    return this.op[len][sig](word,e,p);
                }
            }
            //level 0
            return this.operate(this.detect,word,e);
        },
        //拆解并列条件（并列条件以","号分隔）
        router: function(story/* .aa,.~bb,#cc,.aa>.dd */,e/* event */,p) {
            var words= story.split(",");
            var result;
            for(p= words.length-1;p>=0;p--) {
                if(result= this.match(words[p],e)) {
                    return result;
                }
            }
            return false;
        },
        //总入口
        parse: function(story,func,e) {
            var result= this.router(story,e);
            if(result.length==2) {
                func(result[1]);
            }else if(result){
                func(e);
            }
        }
    });
    J.event.eventParser= new EventParser();
});
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
 * Package: jet.fx
 * 
 * Need package:
 * jet.core.js
 * 
 */
 
 

Jx().$package(function(J){
    /**
     * 动画包
     * @namespace
     * @name fx
     */
    J.fx = J.fx || {};
    
    var $D = J.dom,
        $E = J.event;

    /**
     * 动画缓动公式
     * 
     * Linear：无缓动效果；
     * Quadratic：二次方的缓动（t^2）；
     * Cubic：三次方的缓动（t^3）；
     * Quartic：四次方的缓动（t^4）；
     * Quintic：五次方的缓动（t^5）；
     * Sinusoidal：正弦曲线的缓动（sin(t)）；
     * Exponential：指数曲线的缓动（2^t）；
     * Circular：圆形曲线的缓动（sqrt(1-t^2)）；
     * Elastic：指数衰减的正弦曲线缓动；
     * Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
     * Bounce：指数衰减的反弹缓动。
     * 
     * 每个效果都分三个缓动方式（方法），分别是：
     * easeIn：从0开始加速的缓动；
     * easeOut：减速到0的缓动；
     * easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     * 其中Linear是无缓动效果，没有以上效果。
     * 
     * p,pos: current（当前）；
     * x: value（其他参数）；
     */
    var Transition = new J.Class({
        init:function(transition, params){
            params = J.array.toArray(params);
            
            var newTransition =  J.extend(transition, {
                //从0开始加速的缓动；
                easeIn: function(pos){
                    return transition(pos, params);
                },
                //减速到0的缓动；
                easeOut: function(pos){
                    return 1 - transition(1 - pos, params);
                },
                //前半段从0开始加速，后半段减速到0的缓动。
                easeInOut: function(pos){
                    return (pos <= 0.5) ? transition(2 * pos, params) / 2 : (2 - transition(2 * (1 - pos), params)) / 2;
                }
            });
            
            return newTransition;
        }
    });
    
    /**
     * 
     * 动画缓动公式
     * 
     * Linear：无缓动效果；
     * Quadratic：二次方的缓动（t^2）；
     * Cubic：三次方的缓动（t^3）；
     * Quartic：四次方的缓动（t^4）；
     * Quintic：五次方的缓动（t^5）；
     * Sinusoidal：正弦曲线的缓动（sin(t)）；
     * Exponential：指数曲线的缓动（2^t）；
     * Circular：圆形曲线的缓动（sqrt(1-t^2)）；
     * Elastic：指数衰减的正弦曲线缓动；
     * Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
     * Bounce：指数衰减的反弹缓动。
     * 
     * 每个效果都分三个缓动方式（方法），分别是：
     * easeIn：从0开始加速的缓动；
     * easeOut：减速到0的缓动；
     * easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     * 其中Linear是无缓动效果，没有以上效果。
     * 
     * p,pos: current（当前）；
     * x: value（其他参数）；
     *  
     * @memberOf fx
     * @namespace
     * @name transitions
     */
    var transitions = {
        /**
         * linear：无缓动效果；
         * @memberOf fx.transitions
         * @function
         * @name linear
         */ 
        linear: function(p){
            return p;
        },
        extend : function(newTransitions){
            for (var transition in newTransitions){
                this[transition] = new Transition(newTransitions[transition]);
            }
        }
    
    };
    

    
    
    transitions.extend(
    /**
     * @lends fx.transitions
     */
    {
        
        /**
         * pow：n次方的缓动（t^n）,n默认为6；
         */
        pow: function(p, x){
            return Math.pow(p, x && x[0] || 6);
        },
        
        /**
         * exponential：指数曲线的缓动（2^t）；
         */
        exponential: function(p){
            return Math.pow(2, 8 * (p - 1));
        },
        
        /**
         * circular：圆形曲线的缓动（sqrt(1-t^2)）；
         */
        circular: function(p){
            return 1 - Math.sin(Math.acos(p));
        },
    
        /**
         * sinusoidal：正弦曲线的缓动（sin(t)）；
         */
        sinusoidal: function(p){
            return 1 - Math.sin((1 - p) * Math.PI / 2);
        },
    
        /**
         * back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
         */
        back: function(p, x){
            x = x && x[0] || 1.618;
            return Math.pow(p, 2) * ((x + 1) * p - x);
        },
        
        /**
         * bounce：指数衰减的反弹缓动。
         */
        bounce: function(p){
            var value;
            for (var a = 0, b = 1; 1; a += b, b /= 2){
                if (p >= (7 - 4 * a) / 11){
                    value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                    break;
                }
            }
            return value;
        },
    
        /**
         * elastic：指数衰减的正弦曲线缓动；
         */
        elastic: function(p, x){
            return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
        }
    
    });

    // quadratic,cubic,quartic,quintic：2-5次方的缓动（t^5）；
    var pows = ['quadratic', 'cubic', 'quartic', 'quintic'];
    J.array.forEach(pows, function(transition, i){
        transitions[transition] = new Transition(function(p){
            return Math.pow(p, [i + 2]);
        });
    });
    
    
    
    /**
     * 节拍器类
     * @class 
     * @memberOf fx
     * @name Beater
     * @constructor
     * 
     * @param {Number} duration: 节拍时长，单位毫秒
     * @param {Number} loop: 循环次数,默认为1,0为无限循环
     * @param {Number} fps: fps你懂的
     * @return 节拍器实例
     */
    var Beater = new J.Class(
    /**
     * @lends fx.Beater.prototype
     */    
    {
        /**
         * @ignore
         */
        init : function(option){
            
            this.setOption(option);
        },

        setOption: function(option){
            this.option = option = J.extend({
                duration:500,
                loop:1,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:1000/(option && option.duration || 500)
            }, option);
        },
        
        start: function(){
            if (!this.check()){
                return this;
            }
            var option = this.option;
            this.time = 0;
            this.loop = option.loop;
            this.onStart.apply(this, arguments);
            this.startTimer();
            return this;
        },
        
        pause: function(){
            this.stopTimer();
            return this;
        },

        resume: function(){
            this.startTimer();
            return this;
        },

        end: function(){
            if (this.stopTimer()){
                this.onEnd.apply(this, arguments);
            }
            return this;
        },

        cancel: function(){
            if (this.stopTimer()){
                this.onCancel.apply(this, arguments);
            }
            return this;
        },

        onStart: function(){
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            $E.notifyObservers(this, "cancel");
        },

        onLoop: function(){
            $E.notifyObservers(this, "loop");
        },

        onBeater: function(){
            $E.notifyObservers(this, "beater");
        },

        check: function(){
            if (!this.timer){
                return true;
            }
            return false;
        },

        setDuration: function(duration){
            this.option.duration = duration || 500;
        },
        
        update: function(){
            var that = this,
                time = J.now(),
                option = that.option;
            if (time < that.time + that.option.duration){
                that.onBeater((time - that.time) / option.duration);
            } else {
                that.onBeater(1);
                that.onLoop();
                if(option.loop<=0 || --that.loop){
                    that.time = time;
                }else{
                    that.stopTimer();
                    that.onEnd();
                }
            }
        },

        stopTimer: function(){
            if (!this.timer){
                return false;
            }
            this.time = J.now() - this.time;
            this.timer = removeInstance(this);
            return true;
        },

        startTimer: function(){
            if (this.timer) return false;
            this.time = J.now() - this.time;
            this.timer = addInstance(this);
            return true;
        }
    });
    
    var instances = {}, timers = {};

    var loop = function(list){
        for (var i = list.length; i--;){
            if (list[i]){
                list[i].update();
            }
        }
    };

    var addInstance = function(instance){
        var fps = instance.option.fps,
            list = instances[fps] || (instances[fps] = []);
        list.push(instance);
        if (!timers[fps]){
            timers[fps] = setInterval(function(){
                loop(list);
            }, Math.round(1000 / fps));
        }
        return true;
    };

    var removeInstance = function(instance){
        var fps = instance.option.fps,
            list = instances[fps] || [];
        J.array.remove(list,instance);
        if (!list.length && timers[fps]){
            timers[fps] = clearInterval(timers[fps]);
        }
        return false;
    };
    
    
    
    /**
     * 动画类
     * @class 
     * @name Animation
     * @memberOf fx
     * @extends fx.Beater
     * 
     * @param {Element} element  动画的dom
     * @param {String} property  css 属性
     * @param {Mix} from  起始值
     * @param {Mix} to  到达值
     * @param {String} unit  单位
     * @param {Number} duration  动画时长，单位毫秒
     * @param {Number} loop  循环次数,默认为1,0为无限循环
     * @param {Function} transition  变化公式
     * @param {Number} fps  fps你懂的
     * @param {Function} css属性转换器
     * @return 动画实例
     */
    var Animation = new J.Class({extend:Beater},
    /**
     * @lends fx.Animation.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(option){
            Animation.superClass['init'].apply(this,arguments);
            this.option = this.option || {};
            option = J.extend(this.option, {
                element: null, 
                property: "", 
                from: 0, 
                to: 1,
                unit:false,
                transition: transitions.linear,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:25,
                converter:converter
            }, option);
            this.from = option.from;
            this.to = option.to;
        },

        getTransition: function(){
            var transition = this.option.transition || transitions.sinusoidal.easeInOut;
            return transition;
        },

        set: function(now){
            var option = this.option;
            this.render(option.element, option.property, now, option.unit);
            return this;
        },
        
        setFromTo: function(from, to){
            this.from = from;
            this.to = to;
        },
        
        render: function(element, property, value, unit){
            $D.setStyle(element, property, this.option.converter(value,unit));
        },

        compute: function(from, to, delta){
            return compute(from, to, delta);
        },

        onStart: function(from,to){
            var that = this;
            var option = that.option;
            that.from = J.isNumber(from) ? from : option.from;
            that.to = J.isNumber(to) ? to : option.to;
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            var that = this;
            var delta = that.option.transition(1);
            that.set(that.compute(that.from, that.to, delta));
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            var that = this;
            var delta = that.option.transition(0);
            that.set(that.compute(that.from, that.to, delta));
            $E.notifyObservers(this, "cancel");
        },

        onBeater: function(progress){
            var that = this;
            var delta = that.option.transition(progress);
            that.set(that.compute(that.from, that.to, delta));
        }
    });
    
    var compute = function(from, to, delta){
        return (to - from) * delta + from;
    };

    var converter = function(value,unit){
        return (unit) ? value + unit : value;
    };
    
    /**
     * TODO 这是原来的动画类, peli改了原来的动画类,抽出了节拍器, 
     * 但是新的动画类有问题,但是我没时间改, 就先用着旧的
     * by az , 2011-3-28
     * @ignore
     * 
     * @param {Element} element: 动画的dom
     * @param {String} property: css 属性
     * @param {Mix} from: 起始值
     * @param {Mix} to: 到达值
     * @param {String} unit: 单位
     * @param {Number} duration: 动画时长，单位毫秒
     * @param {Function} transition: 变化公式
     * @param {Number} fps: fps你懂的
     * 
     * @return 动画实例
     */
    var Animation2 = new J.Class({
        init : function(option){
            //el, style, begin, end, fx, total
            this.option = option = J.extend({
                element: null, 
                property: "", 
                from: 0, 
                to: 0,
                unit:false,
                duration:500,
                transition: transitions.linear,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:25
            }, option);
            
            this.from = option.from;
            this.to = option.to;
            

        },

        
        getTransition: function(){
            var transition = this.option.transition || transitions.sinusoidal.easeInOut;
            return transition;
        },
        update: function(){
            var that = this,
                time = J.now();
            var option = that.option;
            if (time < that.time + that.option.duration){
                var delta = option.transition((time - that.time) / option.duration);
                that.set(that.compute(that.from, that.to, delta));
            } else {
                that.set(that.compute(that.from, that.to, 1));
                that.end();
                
            }
        },

        set: function(now){
            var option = this.option;
            this.render(option.element, option.property, now, option.unit);
            return this;
        },
        
        setDuration: function(duration){
            this.option.duration = duration || 500;
        },
        
        setFromTo: function(from, to){
            this.from = from;
            this.to = to;
        },
        
        render: function(element, property, value, unit){
            value = (unit) ? value + unit : value;
            $D.setStyle(element, property, value);
        },

        compute: function(from, to, delta){
            return compute(from, to, delta);
        },

        check: function(){
            if (!this.timer){
                return true;
            }
            return false;
        },

        start: function(from, to){
            var that = this;
            if (!that.check(from, to)){
                return that;
            }
            var option = that.option;
            that.from = J.isNumber(from) ? from : option.from;
            that.to = J.isNumber(to) ? to : option.to;
            
            that.time = 0;
            that.startTimer();
            that.onStart();
            
            return that;
        },

        end: function(){
            if (this.stopTimer()){
                this.onEnd();
            }
            return this;
        },

        cancel: function(){
            if (this.stopTimer()){
                this.onCancel();
            }
            return this;
        },

        onStart: function(){
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            $E.notifyObservers(this, "cancel");
        },

        pause: function(){
            this.stopTimer();
            return this;
        },

        resume: function(){
            this.startTimer();
            return this;
        },

        stopTimer: function(){
            if (!this.timer){
                return false;
            }
            this.time = J.now() - this.time;
            this.timer = removeInstance(this);
            return true;
        },

        startTimer: function(){
            if (this.timer) return false;
            this.time = J.now() - this.time;
            this.timer = addInstance(this);
            return true;
        }
    });
    
    J.fx.Beater = Beater;
    J.fx.Animation = Animation;
    J.fx.Animation2 = Animation2;
    J.fx.transitions = transitions;
});













/** 
 * JET (Javascript Extend Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * 
 *
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/** 
 * @description
 * Package: jet.json
 *
 * Need package:
 * jet.core.js
 * 
 */

/**
 * [Javascript core part]: JSON 扩展
 */
 
 
Jx().$package(function(J){
    var JSON = window['JSON'] || {};

    /**
     * @namespace
     * @name json
     */

    
    
    
    
/*
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

"use strict";

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

/*
if (!this.JSON) {
    this.JSON = {};
}
*/

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    // if (typeof Date.prototype.toJSON !== 'function') {
    // if (typeof Date.prototype.toJSON !== 'function' && false) {
        // /** 
         // * @ignore
         // */
        // Date.prototype.toJSON = function (key) {

            // return isFinite(this.valueOf()) ?
                   // this.getUTCFullYear()   + '-' +
                 // f(this.getUTCMonth() + 1) + '-' +
                 // f(this.getUTCDate())      + 'T' +
                 // f(this.getUTCHours())     + ':' +
                 // f(this.getUTCMinutes())   + ':' +
                 // f(this.getUTCSeconds())   + 'Z' : null;
        // };
        // /** 
         // * @ignore
         // */
        // String.prototype.toJSON =
        // /** 
         // * @ignore
         // */
        // Number.prototype.toJSON =
        // /** 
         // * @ignore
         // */
        // Boolean.prototype.toJSON = function (key) {
            // return this.valueOf();
        // };

    // }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        /**
         * 把给定object转换成json字符串
         * 
         * @name stringify
         * @memberOf json
         * @function
         * @param {Object} value
         * @return {String}
         */
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        /**
         * 把给定json字符串转换成对象
         * @function 
         * @name parse
         * @memberOf json
         * @param {String} text
         * @return {Object}
         */
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

    
    J.json = JSON;


});


















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

    
    // /**
    //  * comet方法
    //  * 
    //  * @memberOf http
    //  * @method  comet
    //  * @param {String} uri uri地址
    //  * @param {Object} option 配置对象
    //  * @return {Object} 返回一个comet dom对象
    //  */
    // comet = function(uri, option){

    //     uri = uri || "";
    //     option = {
    //         method : option.method || "GET",
    //         data : option.data || null,
    //         arguments : option.arguments || null,
    //         callback : option.callback || function(){},
    //         onLoad : option.onLoad || function(){},

    //         contentType: option.contentType ? option.contentType : "utf-8"
    //     };

    //     var connection;
    //     if(J.browser.ie){
    //         var htmlfile = new ActiveXObject("htmlfile");
    //         htmlfile.open();
    //         htmlfile.close();
    //         var iframediv = htmlfile.createElement("div");
    //         htmlfile.appendChild(iframediv);
    //         htmlfile.parentWindow._parent = self;
    //         iframediv.innerHTML = '<iframe id="_cometIframe" src="'+uri+'?callback=window.parent._parent.'+option.callback+'"></iframe>';
            
    //         connection = htmlfile.getElementById("_cometIframe");
        
    //     }
    //     else{
    //         connection = $D.node("iframe");
    //         connection.setAttribute("id", "_cometIframe");
    //         connection.setAttribute("src", uri+'?callback=window.parent._parent.'+option.callback);
    //         connection.style.position = "absolute";
    //         connection.style.visibility = "hidden";
    //         connection.style.left = connection.style.top = "-999px";
    //         connection.style.width = connection.style.height = "1px";
    //         document.body.appendChild(connection);
    //         self._parent = self;
    //     };

    //     $E.on(connection,"load", option.onLoad);

    //     return connection;
        
    // };
    

    
    
    
    
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



/** 
 * @description
 * Package: jet.mini
 *
 * Need package:
 * jet.core.js
 * 
 */
 
Jx().$package(function(J){

    
/**
 * "mini" Selector Engine
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.01 (BETA)
 */


var mini = (function(){
    
    var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
        exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
        exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
        exprNodeName = /^([\w\*\-_]+)/,
        na = [null,null];
    
    function _find(selector, context) {
        
        /*
         * This is what you call via x()
         * Starts everything off...
         */
        
        context = context || document;
        
        var simple = /^[\w\-_#]+$/.test(selector);
        
        if (!simple && context.querySelectorAll) {
            return realArray(context.querySelectorAll(selector));
        }
        
        if (selector.indexOf(',') > -1) {
            var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
            for(; sIndex < len; ++sIndex) {
                ret = ret.concat( _find(split[sIndex], context) );
            }
            return unique(ret);
        }
        
        var parts = selector.match(snack),
            part = parts.pop(),
            id = (part.match(exprId) || na)[1],
            className = !id && (part.match(exprClassName) || na)[1],
            nodeName = !id && (part.match(exprNodeName) || na)[1],
            collection;
            
        if (className && !nodeName && context.getElementsByClassName) {
            
            collection = realArray(context.getElementsByClassName(className));
            
        } else {
            
            collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
            
            if (className) {
                collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
            }
            
            if (id) {
                var byId = context.getElementById(id);
                return byId?[byId]:[];
            }
        }
        
        return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
        
    }
    
    function realArray(c) {
        
        /**
         * Transforms a node collection into
         * a real array
         */
        
        try {
            return Array.prototype.slice.call(c);
        } catch(e) {
            var ret = [], i = 0, len = c.length;
            for (; i < len; ++i) {
                ret[i] = c[i];
            }
            return ret;
        }
        
    }
    
    function filterParents(selectorParts, collection, direct) {
        
        /**
         * This is where the magic happens.
         * Parents are stepped through (upwards) to
         * see if they comply with the selector.
         */
        
        var parentSelector = selectorParts.pop();
        
        if (parentSelector === '>') {
            return filterParents(selectorParts, collection, true);
        }
        
        var ret = [],
            r = -1,
            id = (parentSelector.match(exprId) || na)[1],
            className = !id && (parentSelector.match(exprClassName) || na)[1],
            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
            cIndex = -1,
            node, parent,
            matches;
            
        nodeName = nodeName && nodeName.toLowerCase();
            
        while ( (node = collection[++cIndex]) ) {
            
            parent = node.parentNode;
            
            do {
                
                matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                matches = matches && (!id || parent.id === id);
                matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                
                if (direct || matches) { break; }
                
            } while ( (parent = parent.parentNode) );
            
            if (matches) {
                ret[++r] = node;
            }
        }
        
        return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
        
    }
    
    
    var unique = (function(){
        
        var uid = +new Date();
                
        var data = (function(){
         
            var n = 1;
         
            return function(elem) {
         
                var cacheIndex = elem[uid],
                    nextCacheIndex = n++;
         
                if(!cacheIndex) {
                    elem[uid] = nextCacheIndex;
                    return true;
                }
         
                return false;
         
            };
         
        })();
        
        return function(arr) {
        
            /**
             * Returns a unique array
             */
            
            var length = arr.length,
                ret = [],
                r = -1,
                i = 0,
                item;
                
            for (; i < length; ++i) {
                item = arr[i];
                if (data(item)) {
                    ret[++r] = item;
                }
            }
            
            uid += 1;
            
            return ret;
    
        };
    
    })();
    
    function filterByAttr(collection, attr, regex) {
        
        /**
         * Filters a collection by an attribute.
         */
        
        var i = -1, node, r = -1, ret = [];
        
        while ( (node = collection[++i]) ) {
            if (regex.test(node[attr])) {
                ret[++r] = node;
            }
        }
        
        return ret;
    }
    
    return _find;
    
})();




    /*
     * ////////////////////////////////////////////////////////////////
     * 
     * Adapter to JET
     * 
     * ////////////////////////////////////////////////////////////////
     */
    /**
     * 一个据说比jq还快的筛选器，可以满足日常99%的筛选需要
     * @function
     * @memberOf dom
     * @name mini
     * 
     * @param {String} query string 筛选器语法
     * @returns {Element} 返回筛选出的dom元素
     * 
     * @example
     * //创建一个匿名package包：
     * Jx().$package(function(J){
     *  //这时上下文对象this指向全局window对象
     *  var lists = J.dom.mini(".list");
     * };
     * 
     */
    J.dom.mini = mini;



});
/**
 * 7.[Number part]: number 扩展包
 * 已移到J.format.number实现
 */
Jx().$package(function(J){
    
    /**
     * number 名字空间
     * 
     * @namespace
     * @name number
     * @type Object
     */
    J.number = J.number || {};
    
    /**
     * 格式化数字显示方式
     * @memberOf number
     * @function
     * @name format
     * 
     * @param num 要格式化的数字
     * @param pattern 格式
     * @example 
     * J.number.format(12345.999,'#,##0.00');
     *  //out: 12,34,5.99
     * J.number.format(12345.999,'0'); 
     *  //out: 12345
     * J.number.format(1234.888,'#.0');
     *  //out: 1234.8
     * J.number.format(1234.888,'000000.000000');
     *  //out: 001234.888000
     */  
    J.number.format = J.format.number;
    
});
/**
 * [Javascript core part]: audio 扩展
 */
 
/** 
 * @description
 * Package: jx.audio
 * 
 * Need package:
 * jx.core.js
 * 
 */
Jx().$package(function(J){
    
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        $B = J.browser;

    var EMPTY_FUNC = function(){ return 0; };
    var BaseAudio = J.Class({
        init : function(){ throw 'BaseAudio does not implement a required interface'; },
        play : EMPTY_FUNC,
        pause : EMPTY_FUNC,
        stop : EMPTY_FUNC,

        getVolume : EMPTY_FUNC,
        setVolume : EMPTY_FUNC,
        getLoop : EMPTY_FUNC,
        setLoop : EMPTY_FUNC,
        setMute : EMPTY_FUNC,
        getMute : EMPTY_FUNC,
        getPosition : EMPTY_FUNC,
        setPosition : EMPTY_FUNC,

        getBuffered : EMPTY_FUNC,
        getDuration : EMPTY_FUNC,
        free : EMPTY_FUNC,

        on : EMPTY_FUNC,
        off : EMPTY_FUNC
    });

    var AUDIO_MODE = {
        NONE : 0,
        NATIVE : 1,
        WMP : 2,
        FLASH : 3,
        MOBILE : 4
    };
    /**
     * @ignore
     */
    var audioModeDetector = function(){
        if(window.Audio && (new Audio).canPlayType('audio/mpeg')){ //支持audio
            if((/\bmobile\b/i).test(navigator.userAgent)){
                return AUDIO_MODE.MOBILE;
            }
            return AUDIO_MODE.NATIVE;
        }else if(J.browser.plugins.flash>=9){ //支持flash控件
            return AUDIO_MODE.FLASH;
        }else if(!!window.ActiveXObject && (function(){
                try{
                    new ActiveXObject("WMPlayer.OCX.7");
                }catch(e){
                    return false;
                }
                return true;
            })()){ //支持wmp控件
            return AUDIO_MODE.WMP;
        }else{
            return AUDIO_MODE.NONE; //啥都不支持
        }
    };

    var getContainer = function(){
        var _container;
        return function(mode){
            if(!_container){
                var node = document.createElement('div');
                node.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;margin:0;padding:0;left:0;top:0;';
                (document.body || document.documentElement).appendChild(node);
                if(mode == AUDIO_MODE.FLASH){
                    node.innerHTML = '<object id="JxAudioObject" name="JxAudioObject" ' + (J.browser.ie ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' +
                        J.path + 'style/swf/jxaudioobject.swf"') + 'width="1" height="1" align="top"><param name="movie" value="' +
                        J.path + 'style/swf/jxaudioobject.swf" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="quality" value="high" /><param name="wmode" value="opaque" /></object>';
                    _container = J.dom.id('JxAudioObject') || window['JxAudioObject'] || document['JxAudioObject'];
                }else{
                    _container = node;
                }
            }
            return _container;
        }
    }();
    var getSequence = function(){
        var _seq = 0;
        return function(){
            return _seq++;
        }
    }();

    var audioMode = audioModeDetector();
    switch(audioMode){
        case AUDIO_MODE.NATIVE:
        case AUDIO_MODE.MOBILE:
            var NativeAudio = J.Class({extend:BaseAudio},{
                init : function(option){
                    option = option || {};
                    var el = this._el = new Audio();
                    el.loop = Boolean(option.loop); //default by false
                    /*el.autoplay = option.autoplay !== false; //defalut by true*/
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        this._el.src = url;
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    this._el.pause();
                },
                stop : function(){
                    this._el.currentTime = Infinity;
                },

                getVolume : function(){
                    return !this._el.muted && this._el.volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._el.volume = Math.max(0,Math.min(value,1));
                        this._el.muted = false;
                    }
                },
                getLoop : function(){
                    return this._el.loop;
                },
                setLoop : function(value){
                    this._el.loop = value !== false;
                },
                /*getAutoplay : function(){
                    return thie._el.autoplay;
                },
                setAutoplay : function(value){
                    this._el.autoplay = value !== false;
                },*/
                getMute : function(){
                    return this._el.muted;
                },
                setMute : function(value){
                    this._el.muted = value !== false;
                },
                getPosition : function(){
                    return this._el.currentTime;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._el.currentTime = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.buffered.length && this._el.buffered.end(0) || 0;
                },
                getDuration : function(){
                    return this._el.duration;
                },
                free : function(){
                    this._el.pause();
                    this._el = null;
                },
                on : function(event, handler){
                    this._el.addEventListener(event,handler,false);
                },
                off : function(event, handler){
                    this._el.removeEventListener(event,handler,false);
                }
            });
            if(audioMode = AUDIO_MODE.NATIVE){
                J.Audio = NativeAudio;
                break;
            }
            var playingStack = [];
            var stackPop = function(){
                var len = playingStack.length;
                playingStack.pop().off('ended', stackPop);
                if(len >= 2){
                    playingStack[len - 2]._el.play();
                }
            };
            J.Audio = J.Class({extend:NativeAudio},{
                init : function(option){
                    NativeAudio.prototype.init.call(this, option);
                },
                play : function(url){
                    var len = playingStack.length;
                    if(len && playingStack[len - 1] !== this){
                        var index = J.array.indexOf(playingStack, this);
                        if(-1 !== index){
                            playingStack.splice(index, 1);
                        }else{
                            this.on('ended', stackPop);
                        }
                    }
                    playingStack.push(this);

                    if(url){
                        this._el.src = url;
                        // this._el.load();
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    for(var i = 0, len = playingStack.length; i < len; i++){
                        playingStack[i].off('ended', stackPop);
                    }
                    playingStack = [];
                    this._el.pause();
                }
            });

            break;
        case AUDIO_MODE.FLASH :
            var addToQueue = function(audioObject){
                var tryInvokeCount = 0,
                    queue = [],
                    flashReady = false;
                var tryInvoke = function(){
                    ++tryInvokeCount;
                    var container = getContainer();
                    if(container.audioLoad && typeof container.audioLoad === 'function'){
                        flashReady = true;
                        for(var i=0,len=queue.length;i<len;i++){
                            queue[i]._sync();
                        }
                        queue = null;
                    }else if(tryInvokeCount < 30000){
                        setTimeout(tryInvoke, 100);
                    }
                }
                return function(audioObject){
                    if(flashReady){
                        audioObject._sync();
                        return;
                    }
                    if(-1 === J.array.indexOf(queue, audioObject)){
                        queue.push(audioObject);
                    }
                    if(tryInvokeCount === 0){
                        tryInvoke();
                    }
                }
            }();
            var registerEvent, unregisterEvent;
            (function(){
                var list = [];
                window.Jx['AudioEventDispatcher'] = function(seq, event, param){
                    var audioObject = list[seq],events;
                    audioObject && audioObject._handler && (events = audioObject._handler[event]);
                    for(var i=0,len=events && events.length;i<len;i++){
                        events[i].call(audioObject, param);
                    }
                };
                registerEvent = function(audioObject){
                    list[audioObject._seq] = audioObject;
                };
                unregisterEvent = function(audioObject){
                    list[audioObject._seq] = null;
                };
            })();
            J.Audio = J.Class({
                init : function(option){
                    this._seq = getSequence();
                    this._volume = 1;
                    this._muted = false;
                    option = option || {};
                    this._loop = Boolean(option.loop); //default by false
                    this._paused = true;
                    var container = getContainer(AUDIO_MODE.FLASH);
                    if(option.src){
                        this.play(option.src);
                    }
                },
                play : function(url){
                    var container = getContainer();
                    if(url){
                        this._src = url;
                        this._paused = false;
                        if(container.audioLoad){
                            this._sync();
                        }else{
                            addToQueue(this);
                        }
                    }else{
                        this._paused = false;
                        container.audioPlay && container.audioPlay(this._seq);
                    }
                },
                pause : function(){
                    var container = getContainer();
                    this._paused = true;
                    container.audioPause && container.audioPause(this._seq);
                },
                stop : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioStop && container.audioStop(this._seq);
                },

                getVolume : function(){
                    return !this._muted && this._volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._volume = Math.max(0,Math.min(value,1));
                        this._muted = false;
                        var container = getContainer();
                        container.audioSetVolume && container.audioSetVolume(this._seq, this._volume);
                    }
                },
                getLoop : function(){
                    return this._loop;
                },
                setLoop : function(value){
                    this._loop = value !== false;
                    var container = getContainer();
                    container.audioSetLoop && container.audioSetLoop(this._loop);
                },
                getMute : function(){
                    return this._muted;
                },
                setMute : function(value){
                    this._muted = value !== false;
                    var container = getContainer();
                    container.audioSetVolume && container.audioSetVolume(this._seq, this.getVolume());
                },
                getPosition : function(){
                    var container = getContainer();
                    return container.audioGetPosition && container.audioGetPosition(this._seq)/1000 || 0;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        var container = getContainer();
                        container.audioSetPosition(this._seq, Math.max(0,value)*1000);
                    }
                },

                getBuffered : function(){
                    var container = getContainer();
                    return container.audioGetBuffered && container.audioGetBuffered(this._seq)/1000 || 0;
                },
                getDuration : function(){
                    var container = getContainer();
                    return container.audioGetDuration && container.audioGetDuration(this._seq)/1000 || 0;
                },
                free : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioFree && container.audioFree(this._seq);
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                        registerEvent(this);
                    }
                    if(!this._handler[event] || !this._handler[event].length){
                        this._handler[event] = [handler];
                        var container = getContainer();
                        container.audioOn && container.audioOn(this._seq, event);
                    }else{
                        if(-1 === J.array.indexOf(this._handler[event],handler)){
                            this._handler[event].push(handler);
                        }
                    }
                },
                off : function(event, handler){
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.array.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                        if(!this._handler[event].length){
                            var container = getContainer();
                            container.audioOff && container.audioOff(this._seq, event);
                            delete this._handler[event];
                        }
                    }
                },

                _sync : function(){
                    if(this._src){
                        var container = getContainer(),
                            seq = this._seq;
                        container.audioLoad(seq, this._src);
                        var volume = this.getVolume();
                        if(volume != 1){
                            container.audioSetVolume(seq, volume);
                        }
                        if(this._loop){
                            container.audioSetLoop(seq, true);
                        }
                        for(var event in this._handler){
                            container.audioOn(seq, event);
                        }
                        if(!this._paused){
                            container.audioPlay(seq);
                        }
                    }
                }
            });
            break;
        case AUDIO_MODE.WMP:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    this._seq = getSequence();
                    option = option || {};
                    var wrap = document.createElement('div');
                    getContainer(AUDIO_MODE.WMP).appendChild(wrap);
                    wrap.innerHTML = '<object id="WMPObject'+this._seq+'" classid="CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6" standby="" type="application/x-oleobject" width="0" height="0">\
                        <param name="AutoStart" value="true"><param name="ShowControls" value="0"><param name="uiMode" value="none"></object>';
                    var el = this._el = J.dom.id('WMPObject'+this._seq) || window['WMPObject'+this._seq];
                    if(option.loop){ //default by false
                        this._el.settings.setMode('loop', true);
                    }
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        var a = document.createElement('a');
                        a.href = url;
                        url = J.dom.getHref(a);
                        this._isPlaying = false;
                        this._isBuffering = false;
                        // this._duration = 0;
                        this._canPlayThroughFired = false;
                        this._el.URL = J.dom.getHref(a);
                    }
                    if(this._el.playState !== 3){ //not playing
                        this._el.controls.play();
                    }
                    if(this._hasPoll()){
                        this._startPoll();
                    }
                },
                pause : function(){
                    this._el.controls.pause();
                },
                stop : function(){
                    this._el.controls.stop();
                },

                getVolume : function(){
                    return !this._el.settings.mute && this._el.settings.volume / 100 || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        var newVolume = Math.max(0,Math.min(value,1)) * 100;
                        if(this._el.settings.volume !== newVolume || this._el.settings.mute){
                            this._el.settings.volume = newVolume;
                            this._el.settings.mute = false;
                            this._fire('volumechange');
                        }
                    }
                },
                getLoop : function(){
                    return this._el.settings.getMode('loop');
                },
                setLoop : function(value){
                    this._el.settings.setMode('loop', value !== false);
                },
                getMute : function(){
                    return this._el.settings.mute;
                },
                setMute : function(value){
                    var newMute = value !== false;
                    if(this._el.settings.mute !== newMute){
                        this._el.settings.mute = newMute;
                        this._fire('volumechange');
                    }
                },
                getPosition : function(){
                    return this._el.controls.currentPosition;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._fire('seeking');
                        this._el.controls.currentPosition = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.network.downloadProgress * .01 * this.getDuration();
                },
                getDuration : function(){
                    return (this._el.currentMedia || 0).duration || 0;
                },
                free : function(){
                    this._el.controls.stop();
                    this._el = null;
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                    }
                    var context = this;
                    switch(event){
                        case 'timeupdate':
                            this._startPoll();
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._onPositionChange = function(position){
                                    context._fire('timeupdate');
                                    context._fire('seeked');
                                }
                                this._el.attachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._onBuffering = function(isStart){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(isStart){
                                        context._isBuffering = true;
                                        context._fire('waiting');
                                    }else{
                                        context._isBuffering = false;
                                        context._fire('playing');
                                    }
                                };
                                this._el.attachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            // this._el.attachEvent('MediaError',handler);
                            this._el.attachEvent('Error',handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._onPlayStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 2){
                                        context._isPlaying = false;
                                        context._fire('pause');
                                    }else if(state === 3){
                                        if(!context._isPlaying){
                                            context._isPlaying = true;
                                            context._fire('play');
                                        }
                                    }else if(state === 6){ //Buffering
                                        context._fire('progress');
                                    }else if(state === 1){ //MediaEnded, Stopped
                                        if(context._isPlaying){
                                            context._isPlaying = false;
                                            context._fire('ended');
                                            context._stopPoll();
                                        }
                                    }/*else{
                                        console.log('playstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._onOpenStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 21){
                                        context._fire('loadstart');
                                    }else if(state === 13){
                                        context._fire('loadeddata');
                                        context._fire('canplay');
                                    }/*else{
                                        console.log('openstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            this._startPoll();
                            break;
                        default:
                            break;
                    }
                    (this._handler[event] || (this._handler[event] = [])).push(handler);
                },
                off : function(event, handler){
                    if(!this._handler){
                        return;
                    }
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.array.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                    }

                    switch(event){
                        case 'timeupdate':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._el.detachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._el.detachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            this._el.detachEvent('Error', handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._el.detachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._el.detachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                            break;
                        default:
                            break;
                    }
                },
                _fire : function(event){
                    var events;
                    if(!this._handler || !(events = this._handler[event])){
                        return;
                    }
                    for(var i=0,len=events.length;i<len;i++){
                        events[i].call(this);
                    }
                },
                _startPoll : function(){
                    if(this._timer !== undefined){
                        return;
                    }
                    this._canPlayThroughFired = this._canPlayThroughFired || this._el.network.downloadProgress === 100;
                    this._duration = this.getDuration();
                    var context = this;
                    this._timer = setInterval(function(){
                        if(context._isPlaying && !context._isBuffering && (context._handler['timeupdate'] || 0).length && (context._el.currentMedia || 0).sourceURL){
                            context._fire('timeupdate');
                        }

                        var duration = context.getDuration();
                        if(context._duration !== duration){
                            context._duration = duration;
                            context._fire('durationchange');
                        }
                        if(!context._canPlayThroughFired){
                            if(context._el.network.downloadProgress === 100){
                                context._canPlayThroughFired = true;
                                context._fire('canplaythrough');
                            }
                        }
                    },1000);
                },
                _stopPoll : function(){
                    clearInterval(this._timer);
                    delete this._timer;
                },
                _hasPositionChange : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['seeked'] && this._handler['seeked'].length);
                },
                _hasBuffering : function(){
                    return (this._handler['waiting'] && this._handler['waiting'].length) ||
                        (this._handler['playing'] && this._handler['playing'].length);
                },
                _hasPlayStateChange : function(){
                    return (this._handler['progress'] && this._handler['progress'].length) ||
                        (this._handler['ended'] && this._handler['ended'].length) ||
                        (this._handler['play'] && this._handler['play'].length) ||
                        (this._handler['pause'] && this._handler['pause'].length);
                },
                _hasOpenStateChange : function(){
                    return (this._handler['loadstart'] && this._handler['loadstart'].length) ||
                        (this._handler['loadeddata'] && this._handler['loadeddata'].length) ||
                        (this._handler['canplay'] && this._handler['canplay'].length);
                },
                _hasPoll : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['canplaythrough'] && this._handler['canplaythrough'].length) ||
                        (this._handler['durationchange'] && this._handler['durationchange'].length);
                }
            });
            break;
        case AUDIO_MODE.NONE:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    J.warn('Audio is not supported','Audio');
                }
            });
            break;
        default:
            break;
    }
});
/**
 * [Javascript core part]: swfobject 扩展
 */
 
 
Jx().$package(function(J){




/*  SWFObject v2.2 <http://code.google.com/p/swfobject/> 
    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
/**
 * @namespace swfobject 名字空间
 * @name swfobject
 */
var swfobject = function() {
    
    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",
        
        win = window,
        doc = document,
        nav = navigator,
        
        plugin = false,
        domLoadFnArr = [main],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedAltContent,
        storedAltContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,
    
    /* Centralized function for browser feature detection
        - User agent string detection is only used when no good alternative is possible
        - Is executed directly for optimal performance
    */
    /**
     * @ignore
     */
    ua = function() {
        var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
            u = nav.userAgent.toLowerCase(),
            p = nav.platform.toLowerCase(),
            windows = p ? /win/.test(p) : /win/.test(u),
            mac = p ? /mac/.test(p) : /mac/.test(u),
            webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
            ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
            playerVersion = [0,0,0],
            d = null;
        if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
            d = nav.plugins[SHOCKWAVE_FLASH].description;
            if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                plugin = true;
                ie = false; // cascaded feature detection for Internet Explorer
                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
            }
        }
        else if (typeof win.ActiveXObject != UNDEF) {
            try {
                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                if (a) { // a will return null when ActiveX is disabled
                    d = a.GetVariable("$version");
                    if (d) {
                        ie = true; // cascaded feature detection for Internet Explorer
                        d = d.split(" ")[1].split(",");
                        playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
            }
            catch(e) {}
        }
        return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
    }(),
    
    /* Cross-browser onDomLoad
        - Will fire an event as soon as the DOM of a web page is loaded
        - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
        - Regular onload serves as fallback
    */ 
    /**
     * @ignore
     */
    onDomLoad = function() {
        if (!ua.w3) { return; }
        if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
            callDomLoadFunctions();
        }
        if (!isDomLoaded) {
            if (typeof doc.addEventListener != UNDEF) {
                doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
            }       
            if (ua.ie && ua.win) {
                doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                    if (doc.readyState == "complete") {
                        doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                        callDomLoadFunctions();
                    }
                });
                if (win == top) { // if not inside an iframe
                    (function(){
                        if (isDomLoaded) { return; }
                        try {
                            doc.documentElement.doScroll("left");
                        }
                        catch(e) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        callDomLoadFunctions();
                    })();
                }
            }
            if (ua.wk) {
                (function(){
                    if (isDomLoaded) { return; }
                    if (!/loaded|complete/.test(doc.readyState)) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                    callDomLoadFunctions();
                })();
            }
            addLoadEvent(callDomLoadFunctions);
        }
    }();
    
    function callDomLoadFunctions() {
        if (isDomLoaded) { return; }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
            t.parentNode.removeChild(t);
        }
        catch (e) { return; }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }
    
    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        }
        else { 
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }
    
    /* Cross-browser onload
        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
        - Will fire an event as soon as a web page including all of its style are loaded 
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener != UNDEF) {
            win.addEventListener("load", fn, false);
        }
        else if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("load", fn, false);
        }
        else if (typeof win.attachEvent != UNDEF) {
            addListener(win, "onload", fn);
        }
        else if (typeof win.onload == "function") {
            var fnOld = win.onload;
            /**
             * @ignore
             */
            win.onload = function() {
                fnOld();
                fn();
            };
        }
        else {
            win.onload = fn;
        }
    }
    
    /* Main function
        - Will preferably execute onDomLoad, otherwise onload (as a fallback)
    */
    function main() { 
        if (plugin) {
            testPlayerVersion();
        }
        else {
            matchVersions();
        }
    }
    
    /* Detect the Flash Player version for non-Internet Explorer browsers
        - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
          a. Both release and build numbers can be detected
          b. Avoid wrong descriptions by corrupt installers provided by Adobe
          c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
        - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
    */
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.style.position = 'absolute';
        o.style.left = '-9999px';
        o.style.top = '-9999px';
        o.style.width = '1px';
        o.style.height = '1px';
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function(){
                if (typeof t.GetVariable != UNDEF) {
                    var d = t.GetVariable("$version");
                    if (d) {
                        d = d.split(" ")[1].split(",");
                        ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
                else if (counter < 10) {
                    counter++;
                    setTimeout(arguments.callee, 10);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            })();
        }
        else {
            matchVersions();
        }
    }
    
    /* Perform Flash Player and SWF version matching; static publishing only
    */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {success:false, id:id};
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cb(cbObj);
                            }
                        }
                        else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
                            if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        }
                        else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                            displayAltContent(obj);
                            if (cb) { cb(cbObj); }
                        }
                    }
                }
                else {  // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable != UNDEF) { 
                            cbObj.success = true;
                            cbObj.ref = o;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }
    
    function getObjectById(objectIdStr) {
        var r = null;
        var o = getElementById(objectIdStr);
        if (o && o.nodeName == "OBJECT") {
            if (typeof o.SetVariable != UNDEF) {
                r = o;
            }
            else {
                var n = o.getElementsByTagName(OBJECT)[0];
                if (n) {
                    r = n;
                }
            }
        }
        return r;
    }
    
    /* Requirements for Adobe Express Install
        - only one instance can be active at a time
        - fp 6.0.65 or higher
        - Win/Mac OS only
        - no Webkit engines older than version 312
    */
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }
    
    /* Show the Adobe Express Install dialog
        - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
    */
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {success:false, id:replaceElemIdStr};
        var obj = getElementById(replaceElemIdStr);
        if (obj) {
            if (obj.nodeName == "OBJECT") { // static publishing
                storedAltContent = abstractAltContent(obj);
                storedAltContentId = null;
            }
            else { // dynamic publishing
                storedAltContent = obj;
                storedAltContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
            if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
            doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
            var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
            if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + fv;
            }
            else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && ua.win && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                (function(){
                    if (obj.readyState == 4) {
                        obj.parentNode.removeChild(obj);
                    }
                    else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }
    
    /* Functions to abstract and display alternative content
    */
    function displayAltContent(obj) {
        if (ua.ie && ua.win && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
            el.parentNode.replaceChild(abstractAltContent(obj), el);
            obj.style.display = "none";
            (function(){
                if (obj.readyState == 4) {
                    obj.parentNode.removeChild(obj);
                }
                else {
                    setTimeout(arguments.callee, 10);
                }
            })();
        }
        else {
            obj.parentNode.replaceChild(abstractAltContent(obj), obj);
        }
    } 

    function abstractAltContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        }
        else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }
    
    /* Cross-browser dynamic SWF creation
    */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        if (ua.wk && ua.wk < 312) { return r; }
        if (el) {
            if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                attObj.id = id;
            }
            if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                var att = "";
                for (var i in attObj) {
                    if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                        if (i.toLowerCase() == "data") {
                            parObj.movie = attObj[i];
                        }
                        else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            att += ' class="' + attObj[i] + '"';
                        }
                        else if (i.toLowerCase() != "classid") {
                            att += ' ' + i + '="' + attObj[i] + '"';
                        }
                    }
                }
                var par = "";
                for (var j in parObj) {
                    if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                        par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                    }
                }
                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                r = getElementById(attObj.id);  
            }
            else { // well-behaving browsers
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                for (var m in attObj) {
                    if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                        if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            o.setAttribute("class", attObj[m]);
                        }
                        else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                            o.setAttribute(m, attObj[m]);
                        }
                    }
                }
                for (var n in parObj) {
                    if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                        createObjParam(o, n, parObj[n]);
                    }
                }
                el.parentNode.replaceChild(o, el);
                r = o;
            }
        }
        return r;
    }
    
    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);  
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }
    
    /* Cross-browser SWF removal
        - Especially needed to safely and completely remove a SWF in Internet Explorer
    */
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName == "OBJECT") {
            if (ua.ie && ua.win) {
                obj.style.display = "none";
                (function(){
                    if (obj.readyState == 4) {
                        removeObjectInIE(id);
                    }
                    else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            else {
                obj.parentNode.removeChild(obj);
            }
        }
    }
    
    function removeObjectInIE(id) {
        var obj = getElementById(id);
        if (obj) {
            for (var i in obj) {
                if (typeof obj[i] == "function") {
                    obj[i] = null;
                }
            }
            obj.parentNode.removeChild(obj);
        }
    }
    
    /* Functions to optimize JavaScript compression
    */
    function getElementById(id) {
        var el = null;
        try {
            el = doc.getElementById(id);
        }
        catch (e) {}
        return el;
    }
    
    function createElement(el) {
        return doc.createElement(el);
    }
    
    /* Updated attachEvent function for Internet Explorer
        - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
    */  
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }
    
    /* Flash Player and SWF content version matching
    */
    function hasPlayerVersion(rv) {
        var pv = ua.pv, v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = parseInt(v[2], 10) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }
    
    /* Cross-browser dynamic CSS creation
        - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
    */  
    function createCSS(sel, decl, media, newStyle) {
        if (ua.ie && ua.mac) { return; }
        var h = doc.getElementsByTagName("head")[0];
        if (!h) { return; } // to also support badly authored HTML pages that lack a head element
        var m = (media && typeof media == "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (ua.ie && ua.win) {
            if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                dynamicStylesheet.addRule(sel, decl);
            }
        }
        else {
            if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }
    
    function setVisibility(id, isVisible) {
        if (!autoHideShow) { return; }
        var v = isVisible ? "visible" : "hidden";
        if (isDomLoaded && getElementById(id)) {
            getElementById(id).style.visibility = v;
        }
        else {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    /* Filter to avoid XSS attacks
    */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) != null;
        return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
    }
    
    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
    */
    var cleanup = function() {
        if (ua.ie && ua.win) {
            window.attachEvent("onunload", function() {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();
    
    return {
        /* Public API
            - Reference: http://code.google.com/p/swfobject/wiki/documentation
        */ 
        registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            }
            else if (callbackFn) {
                callbackFn({success:false, id:objectIdStr});
            }
        },
        
        getObjectById: function(objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },
        
        /**
         * swfobject 嵌入flash的方法
         * 
         * @memberOf swfobject
         * 
         * @param {String} path swf文件的路径
         * @returns 
         * 
         * @example
         * Jx().$package(function(J){
         *  J.swfobject.embedSWF( path, 'swfSound_Flash_div', '1', '1', '8.0.0', './expressInstall.swf', flashvars, params, attributes);
         * };
         * 
         */
        embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
            var callbackObj = {success:false, id:replaceElemIdStr};
            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(replaceElemIdStr, false);
                addDomLoadEvent(function() {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {}; 
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                            }
                            else {
                                par.flashvars = k + "=" + flashvarsObj[k];
                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == replaceElemIdStr) {
                            setVisibility(replaceElemIdStr, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                    }
                    else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    }
                    else { // show alternative content
                        setVisibility(replaceElemIdStr, true);
                    }
                    if (callbackFn) { callbackFn(callbackObj); }
                });
            }
            else if (callbackFn) { callbackFn(callbackObj); }
        },
        
        switchOffAutoHideShow: function() {
            autoHideShow = false;
        },
        
        ua: ua,
        
        getFlashPlayerVersion: function() {
            return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
        },
        
        hasFlashPlayerVersion: hasPlayerVersion,
        
        createSWF: function(attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            }
            else {
                return undefined;
            }
        },
        
        showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },
        
        removeSWF: function(objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },
        
        createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },
        
        addDomLoadEvent: addDomLoadEvent,
        
        addLoadEvent: addLoadEvent,
        
        getQueryParamValue: function(param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
                if (param == null) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },
        
        // For internal usage only
        expressInstallCallback: function() {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedAltContent) {
                    obj.parentNode.replaceChild(storedAltContent, obj);
                    if (storedAltContentId) {
                        setVisibility(storedAltContentId, true);
                        if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
                    }
                    if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
                }
                isExpressInstallActive = false;
            } 
        }
    };
}();


    
    J.swfobject = swfobject;

;(function(){

// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion()
{
    var version;
    var axo;
    var e;

    // NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

    try {
        // version will be set for 7.X or greater players
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {
    }

    if (!version)
    {
        try {
            // version will be set for 6.X players only
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            
            // installed player is some revision of 6.0
            // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
            // so we have to be careful. 
            
            // default to the first public version
            version = "WIN 6,0,21,0";

            // throws if AllowScripAccess does not exist (introduced in 6.0r47)     
            axo.AllowScriptAccess = "always";

            // safe to call for 6.0r47 or greater
            version = axo.GetVariable("$version");

        } catch (e) {
        }
    }

    if (!version)
    {
        try {
            // version will be set for 4.X or 5.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {
        }
    }

    if (!version)
    {
        try {
            // version will be set for 3.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {
        }
    }

    if (!version)
    {
        try {
            // version will be set for 2.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    }
    
    return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
    // NS/Opera version >= 3 check for Flash plugin in plugin array
    var flashVer = -1;
    
    if (navigator.plugins != null && navigator.plugins.length > 0) {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");           
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            var versionRevision = descArray[3];
            if (versionRevision == "") {
                versionRevision = descArray[4];
            }
            if (versionRevision[0] == "d") {
                versionRevision = versionRevision.substring(1);
            } else if (versionRevision[0] == "r") {
                versionRevision = versionRevision.substring(1);
                if (versionRevision.indexOf("d") > 0) {
                    versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                }
            }
            var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
            //alert("flashVer="+flashVer);
        }
    }
    // MSN/WebTV 2.6 supports Flash 4
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
    // WebTV 2.5 supports Flash 3
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
    // older WebTV supports Flash 2
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
    else if ( isIE && isWin && !isOpera ) {
        flashVer = ControlVersion();
    }   
    return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
    var versionStr = GetSwfVer();
    if (versionStr == -1 ) {
        return false;
    } else if (versionStr != 0) {
        var tempArray, tempString, versionArray;
        if(isIE && isWin && !isOpera) {
            // Given "WIN 2,0,0,11"
            tempArray         = versionStr.split(" ");  // ["WIN", "2,0,0,11"]
            tempString        = tempArray[1];           // "2,0,0,11"
            versionArray      = tempString.split(",");  // ['2', '0', '0', '11']
        } else {
            versionArray      = versionStr.split(".");
        }
        var versionMajor      = versionArray[0];
        var versionMinor      = versionArray[1];
        var versionRevision   = versionArray[2];

            // is the major.revision >= requested major.revision AND the minor version >= requested minor
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer))
                return true;
            else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision))
                    return true;
            }
        }
        return false;
    }
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
    var str = '';
    if (isIE && isWin && !isOpera)
    {
        str += '<object ';
        for (var i in objAttrs)
            str += i + '="' + objAttrs[i] + '" ';
        for (var i in params)
            str += '><param name="' + i + '" value="' + params[i] + '" /> ';
        str += '></object>';
    } else {
        str += '<embed ';
        for (var i in embedAttrs)
            str += i + '="' + embedAttrs[i] + '" ';
        str += '> </embed>';
    }

    document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){   
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie": 
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "id":
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}
J.GetSwfVer= GetSwfVer;
})();


});
/**
 * [Javascript core part]: sound 扩展
 */
 
/** 
 * @description
 * Package: jet.sound
 * 
 * Need package:
 * jet.core.js
 * 
 */
Jx().$package(function(J){
    
    var $E = J.event;
    var soundObjectList = [];

    
    /**
     * @namespace
     * @name sound
     */
    J.sound = J.Class({
        /**
         * 声音类
         * @ignore
         * 
         * @param {string} url  mp3 url
         * @param {boolean} autoLoadAndPlay  加载完成自动播放
         * @param {boolean} needEventSupport  是否需要事件监听
         */
        init : function(url,autoLoadAndPlay,needEventSupport){
            var audio = this._audio = new J.Audio();
            soundObjectList.push(this);
            var context = this;
            if(needEventSupport){
                audio.on('durationchange',function(){
                    $E.notifyObservers(context,'durationchange');
                },false);
                audio.on('timeupdate',function(){
                    $E.notifyObservers(context,'timeupdate');
                },false);
                audio.on('canplay',function(){
                    $E.notifyObservers(context,'canplay');
                },false);
                audio.on('ended',function(){
                    $E.notifyObservers(context,'ended');
                },false);
                audio.on('play',function(){
                    $E.notifyObservers(context,'play');
                },false);
                audio.on('pause',function(){
                    $E.notifyObservers(context,'pause');
                },false);
                audio.on('progress',function(){
                    $E.notifyObservers(context,'progress');
                },false);
                audio.on('error',function(){
                    $E.notifyObservers(context,'error');
                },false);
            }
            if(autoLoadAndPlay){
                audio.play(url);
            }else{
                this._url = url;
            }
        },
        /*
         * @param {string} url: mp3 url,可选
         */
        load : function(url){
            if(url){
                this._url = url;
            }
            this.play();
            this.pause();
        },
        
        getVolume : function(){
            return this._audio.getVolume();
        },
        setVolume : function(value){
            this._audio.setVolume();
            return true;
        },
        mute : function(){
            this._audio.setMute(true);
        },
        unMute : function(){
            this._audio.setMute(false);
        },
        isMute : function(){
            return this._audio.getMute();
        },
        play : function(){
            this._audio.play(this._url);
            delete this._url;
        },
        pause : function(){
            this._audio.pause();
        },
        stop : function(){
            this._audio.stop();
        },
        getDuration : function(){
            return this._audio.getDuration();
        },
        getPosition : function(){
            return this._audio.getPosition();
        },
        setPosition : function(value){
            this._audio.setPosition(value);
            return true;
        },
        buffered : function(){
            return this._audio.getBuffered();
        },
        free : function(){
            this._audio.free();
            var index = J.array.indexOf(soundObjectList, this);
            if(-1 !== index){
                soundObjectList.splice(index, 1);
            }
        }
    });

    J.sound.init = function(){};
    J.sound.isReady = true;
    J.sound.Global = {
        _mute : false,
        getVolume : function(){
            return 1;
        },
        setVolume : function(value){
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].setVolume(value);
            }
            return true;
        },
        mute : function(){
            this._mute = true;
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].mute();
            }
        },
        unMute : function(){
            this._mute = false;
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].unMute();
            }
        },
        isMute : function(){
            return this._mute;
        },
        removeAll : function(){
            for(var obj; obj = soundObjectList.pop();){
                obj.free();
            }
        }
    };
});
/**
 * MaskLayer模块
**/
Jx().$package(function(J){
    var $ = J.dom.id,
        $D = J.dom,
        $E = J.event;
        
    J.ui = J.ui || {};
    
    var _id = 0;
    /**
     * MaskLayer 遮罩层类
     * 
     * @memberOf ui
     * @class
     * @name MaskLayer
     * @constructor
     * @param {Object} option 其他选项，如:zIndex,appendTo...
     * 
     **/
    J.ui.MaskLayer = new J.Class(
    /**
     * @lends ui.MaskLayer.prototype
     */
    {
        _getMaskId: function(){
            return _id++;   
        },
        /**
         * @ignore
         */
        init:function(option){
            option = option || {};
            var mid = this._getMaskId();
            var context = this;
            this._initZIndex = option.zIndex = !J.isUndefined(option.zIndex) ? option.zIndex : 9000000;
            this._initOpacity = option.opacity = !J.isUndefined(option.opacity) ? option.opacity : 0.5;
            option.appendTo = option.appendTo || document.body;
            option.className = option.className || '';
            this.option = option;
            this.container = $D.node("div", {
                "id": "ui_maskLayer_" + mid,
                "class" : "ui_maskLayer " + option.className
            });
            var html = '<div id="ui_maskLayerBody_' + mid + '" class="ui_maskLayerBody"></div>';
            if(J.browser.ie){
                html += '<iframe class="ui_maskBgIframe"></iframe>';
            }
            this.container.innerHTML = html;
            
            this.reset();
            option.appendTo.appendChild(this.container);
            
            var observer = {
                /**
                 * @ignore
                 */
                onMaskLayerClick : function(){
                    $E.notifyObservers(context, "click", context);
                }
            };
            
            $E.on(this.container, "click", observer.onMaskLayerClick);
            
            this.body = $D.id("ui_maskLayerBody_" + mid);
        },
        /**
         * 获取遮罩的dom节点
         * @return {HTMLElement} 
         */
        getElement : function(){
            return this.container;  
        },
        /**
         * 添加一个dom到遮罩中
         */
        append : function(el){
            this.body.appendChild(el);
        },
        /**
         * 显示
         */
        show : function(){
            $D.show(this.container);
            $E.notifyObservers(this, "show");
            this._isShow = true;
        },
        /**
         * 隐藏
         */
        hide : function(){
            $D.hide(this.container);
            $E.notifyObservers(this, "hide");
            this._isShow = false;
        },
        /**
         * 指示遮罩是否显示中
         */
        isShow : function(){
            return this._isShow;
        },
        /**
         * 切换遮罩的显示隐藏
         */
        toggleShow : function(){
            if(this.isShow()){
                this.hide();
            }else{
                this.show();
            }
        },
        /**
         * 获取遮罩的层级
         */
        getZIndex : function(){
            return this._zIndex;
        },
        /**
         * 设置遮罩的层级
         */
        setZIndex : function(zIndex){
            $D.setStyle(this.container, "zIndex", zIndex);
            this._zIndex = zIndex;
        },
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
        setOpacity: function(opacity){
            $D.setStyle(this.container, 'opacity', opacity);
        },
        /**
         * 重置遮罩的透明度,zindex等,重新设置为初始值
         * @return {MaskLayer} 返回自身
         */
        reset: function(){
            this.setOpacity(this._initOpacity);
            this.setZIndex(this._initZIndex);
            return this;
        },
        /**
         * 淡入显示遮罩
         */
        fadeIn : function(){
            this.show();
        },
        /**
         * 淡出显示遮罩
         */
        fadeOut : function(){
            this.hide();
        },
        /**
         * 移除遮罩
         */
        remove : function(){
            if(this.option.appendTo)    {
                this.option.appendTo.removeChild(this.container);
            }
        }
    });

});/** 
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
 * Package: jet.ui
 *
 * Need package:
 * jet.core.js
 * 
 */




/**
 * 拖拽模块
 */
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;

    var ieSelectFix = function (e) {
        e.preventDefault();
        //return false;
    };
    
    var _workAreaWidth=false,
        _workAreaHeight=false,
        _clientWidth,
        _clientHeight,
        _width=false,
        _height=false,
        _limit_right,
        _limit_left,
        _limit_top,
        _limit_bottom;
        
    //for ipad
    var _dragOffsetX,
        _dragOffsetY;
        
    var _dragMaskLayer,
        _maskLayerZIndex = 9000000;
    
    /**
     * 拖拽类
     * 
     * @memberOf ui
     * @class
     * @name Drag
     * @constructor
     * 
     * @param {Element} apperceiveEl 监听拖拽动作的元素
     * @param {Element} effectEl 展现拖拽结果的元素
     * @param {Object} option 其他选项，如:isLimited,leftMargin...
     * 
     * var limiteOption = {
            isLimited : 是否有界限,
            clientEl :盒子模型,边界用
            rightMargin : 边界距离,
            leftMargin : 边界距离,
            bottomMargin : 边界距离,
            topMargin : 边界距离,
            isOverLeft:
            isOverRight:
            isOverTop:
            isOverBottom:能否超出边界,支持拖出去
        };
     */
    J.ui = J.ui || {};
    J.ui.Drag = new J.Class(
    /**
     * @lends ui.Drag.prototype
     */    
    {
        /** @ignore */
        init: function (apperceiveEl, effectEl, option) {
            var context = this;
            var curDragElementX, curDragElementY, dragStartX, dragStartY;
            this.apperceiveEl = apperceiveEl;
            option = option || {};
            this.isLimited = option.isLimited || false;
            this.dragType = option.dragType;
            this.isLocked = option.isLocked || false;
            this.isLockCursorInScreen = option.isLockCursorInScreen || false;
            var isMoved = false;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
            if(option.xOnly){
                this._xOnly = option.xOnly||false;
            }
            if(option.yOnly){
                this._yOnly = option.yOnly||false;
            }
            //TODO for flex wmode-non-transparent

            if (effectEl === false) {
                this.effectEl = false;
            } else {
                this.effectEl = effectEl || apperceiveEl;
            }

            /** @ignore */
            this.dragStart = function (e) {
                if(e.changedTouches){//多点触摸
                    if(e.changedTouches.length>1){
                        return;
                    }
                    e=e.changedTouches[0];
                    document.body.style['WebkitTouchCallout']='none';
                }else{
                    e.preventDefault();
                    e.stopPropagation();
                }
                context.dragStartIn(e.pageX,e.pageY);
                
            };
            /** @ignore */
            this.dragStartIn = function (x,y) {
                if(context.isLocked){
                    return;
                }
                //缓存高宽
                $E.notifyObservers(context, "beforeStart");
                $E.notifyObservers(document, "beforeStart");
//              if(this.dragType){//jet框架跟alloy耦合不好
//                  $E.notifyObservers(alloy, "dragBeforeStart",this.dragType);
//              }
                _clientWidth = $D.getClientWidth(),
                _clientHeight = $D.getClientHeight();
                _workAreaWidth = option.clientEl?$D.getClientWidth(option.clientEl):_clientWidth;
                _workAreaHeight = option.clientEl?$D.getClientHeight(option.clientEl):_clientHeight;
                _width = context.effectEl ? parseInt($D.getClientWidth(context.effectEl)) : 0;
                _height = context.effectEl ? parseInt($D.getClientHeight(context.effectEl)) : 0;

                if (context.isLimited) {
                    _limit_right = _workAreaWidth - _width - context._rightMargin;
                    _limit_left = context._leftMargin;
                    _limit_top = context._topMargin;
                    _limit_bottom = _workAreaHeight - _height - context._bottomMargin;
                }
                if(!_dragMaskLayer){
                    _dragMaskLayer = new J.ui.MaskLayer({opacity: 0});
//                    _maskLayerZIndex = alloy.layout.getTopZIndex(2);
                }
                _dragMaskLayer.setZIndex(_maskLayerZIndex);
                _dragMaskLayer.show();
//                context._oldZIndex = $D.getStyle(context.effectEl, 'zIndex') || 0;
//                J.out('dragStart - _oldZIndex: ' + context._oldZIndex + '::' + _maskLayerZIndex);
//                $D.setStyle(context.effectEl, 'zIndex', _maskLayerZIndex + 1);
                
                
                context._oldX=curDragElementX = context.effectEl ? (parseInt($D.getStyle(context.effectEl, "left")) || 0) : 0;
                context._oldY=curDragElementY = context.effectEl ? (parseInt($D.getStyle(context.effectEl, "top")) || 0) : 0;
                dragStartX = x;
                dragStartY = y;
                if(J.browser.mobileSafari){
                    $E.on(document, 'touchmove', context.dragMove);
                    $E.on(document, 'touchend', context.dragStop);
                    
                    var oldMatrix=new WebKitCSSMatrix(window.getComputedStyle(context.apperceiveEl).webkitTransform);
                    _dragOffsetX = x - oldMatrix.m41;
                    _dragOffsetY = y - oldMatrix.m42;
                    
                }else{
                    $E.on(document, "mousemove", context.dragMove);
                    $E.on(document, "mouseup", context.dragStop);
                }
                if (J.browser.ie) {
                    $E.on(document.body, "selectstart", ieSelectFix);
                }
                if(J.browser.mobileSafari){
                    $E.notifyObservers(context, "start", { x: x, y: y });
                }else{
                    $E.notifyObservers(context, "start", { x: curDragElementX, y: curDragElementY });
                }      
            };
            /** @ignore */
            this.dragMove = function (e) {
                if(context.isLocked){
                    return;
                }
                if(e.browserEvent){
                    e.browserEvent.preventDefault();
                    e.browserEvent.stopPropagation();
                }else{
                    e.preventDefault();
                    e.stopPropagation();
                }
                if(e.changedTouches){//多点触摸
                    
                    e=e.changedTouches[0];
                }
                var x,y;
                var pageX = e.pageX,
                    pageY = e.pageY;
                if(context.isLockCursorInScreen){//限制鼠标超出浏览器外
                    pageX < 0 ? (pageX = 0) : (pageX > _clientWidth ? (pageX = _clientWidth) : 0);
                    pageY < 0 ? (pageY = 0) : (pageY > _clientHeight ? (pageY = _clientHeight) : 0);
                }
                if(!J.browser.mobileSafari){
                    x = curDragElementX + (pageX - dragStartX);
                    y = curDragElementY + (pageY - dragStartY);
                }
                if (context.isLimited) {
                    if(x>_limit_right &&!option.isOverRight ){
                        x=_limit_right;
                    }
                    if(x<_limit_left && !option.isOverLeft){
                        x=_limit_left;
                    }
                }
                if (context._oldX !== x&&!context._yOnly) {
                    context._oldX = x;
                    if (context.effectEl && !J.browser.mobileSafari) {
                        context.effectEl.style.left = x + "px";
                    }
                    isMoved = true;
                }
                
                //J.out("context._topMargin: "+context._topMargin);
                if (context.isLimited) {
                    if (y > _limit_bottom && !option.isOverBottom) {
                        y = _limit_bottom;
                    }
                    if (y < _limit_top && !option.isOverTop) {
                        y = _limit_top;
                    }
                }

                if (context._oldY !== y&&!context._xOnly) {
                    context._oldY = y;
                    if (context.effectEl && !J.browser.mobileSafari) {
                        context.effectEl.style.top = y + "px";
                    }
                    isMoved = true;
                }
                
                //for ipad...BAD SMELL.
                var notifyX = x,
                    notifyY = y;
                if(context.effectEl && J.browser.mobileSafari){
                    context._oldX = curDragElementX + (pageX - dragStartX);
                    context._oldY = curDragElementY + (pageY - dragStartY);
                    var eX = pageX,
                        eY = pageY;
                    if(!context._yOnly){
                        x = pageX - _dragOffsetX;
                    }else{
                        x = curDragElementX;
                    }
                    if(!context._xOnly){
                        y = eY - _dragOffsetY;
                    }else{
                        y = curDragElementY;
                    }
                    context.effectEl.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
                    notifyX = pageX;
                    notifyY = pageY;
                }


                if (isMoved) {
                    $E.notifyObservers(context, "move", { x: notifyX, y: notifyY, orientEvent:e });
                }

            };
            /** @ignore */
            this.dragStop = function (e) {
                _dragMaskLayer.hide();
                if(context.isLocked){
                    return;
                }
//                J.out('dragStop - _oldZIndex: ' + context._oldZIndex);
//                $D.setStyle(context.effectEl, 'zIndex', context._oldZIndex);
                
                document.body.style['WebkitTouchCallout']='auto';
                if(isMoved || J.browser.mobileSafari) {
                    var x=context._oldX;
                    var y=context._oldY;
                    if (context.isLimited) {
                        if(x>_limit_right&&!option.isOverRight){
                            x=_limit_right;
                        }
                        if(x<_limit_left&&!option.isOverLeft){
                            x=_limit_left;
                        }
                    }
                    if (context.isLimited) {
                        if (y > _limit_bottom&&!option.isOverBottom) {
                            y = _limit_bottom;
                        }
                        if (y < _limit_top&&!option.isOverTop) {
                            y = _limit_top;
                        }
                    }
                    if(J.browser.mobileSafari){
                        e.preventDefault();
                        if(option.noEndCallback && context.effectEl){
                            context.effectEl.style.webkitTransform  = 'none';
                            $D.setStyle(context.effectEl,'left',x+'px');
                            $D.setStyle(context.effectEl,'top',y+'px');
                        }
                        $E.notifyObservers(context, "end", { x: x, y: y, orientEvent:e.changedTouches[0] });
                    }else{
                        $E.notifyObservers(context, "end", { x: x, y: y, orientEvent:e });
                    }
                }
                else {
                    $E.notifyObservers(context, "end", {orientEvent:e});
                }
                if (context.isLimited&&(context.isOverRight||context.isOverLeft||context.isOverTop||context.isOverBottom)) {
                    var x = curDragElementX + (e.pageX - dragStartX);
                    var y = curDragElementY + (e.pageY - dragStartY);
                    var tempR = _workAreaWidth - _width - context._rightMargin;
                    var tempL = context._leftMargin;
                    var tempB = _workAreaHeight - context._bottomMargin;
                    var tempT = context._topMargin;
                    if (x > tempR||x < tempL||y > tempB||y < tempT) {
                        //超出边界
                        $E.notifyObservers(context,"overFlowBorder",{x: x,y: y});
                        //J.out("overFlow");
                    }
                }
                _workAreaWidth = false;
                _workAreaHeight = false;
                _width = false;
                _height = false;
                if(J.browser.mobileSafari){
                    $E.off(document, 'touchmove', context.dragMove);
                    $E.off(document, 'touchend', context.dragStop);
                }else{
                    $E.off(document, "mousemove", context.dragMove);
                    $E.off(document, "mouseup", context.dragStop);
                }
                if (J.browser.ie) {
                    $E.off(document.body, "selectstart", ieSelectFix);
                }
                isMoved= false;
                //J.out("end")
            };

            //if(J.browser.mobileSafari){
            //  $E.on(this.apperceiveEl, "touchstart", this.dragStart);
            //}else{
                $E.on(this.apperceiveEl, "drag", this.dragStart);
            //}
        },
        /**
         * 设置展现拖拽结果的元素
         * @param {HTMLElement} el
         */
        setEffect: function(el){
            this.effectEl = el;
        },
        /**
         * 锁定拖拽
         */
        lock: function () {
            //if(J.browser.mobileSafari){
            //  $E.off(this.apperceiveEl, "touchstart", this.dragStart);
            //}else{
                this.isLocked = true;
                $E.off(this.apperceiveEl, "drag", this.dragStart);
            //}
        },
        /**
         * 解锁
         */
        unlock: function () {
            //if(J.platform.iPad){/
            //  $E.on(this.apperceiveEl, "touchstart", this.dragStart);
            //}else{
                this.isLocked = false;
                $E.on(this.apperceiveEl, "drag", this.dragStart);
            //}
        },
        /**
         * 显示监听拖拽动作的元素
         */
        show: function () {
            $D.show(this.apperceiveEl);
        },
        /**
         * 隐藏监听拖拽动作的元素
         */
        hide: function () {
            $D.hide(this.apperceiveEl);
        },
        /**
         * 设置拖拽边界
         */
        setLimite : function(option){
            option = option || {};
            this.isLimited = option.isLimited || true;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
        }
    });



});
/**
 * Resize 模块
 */
Jx().$package(function (J) {
    J.ui = J.ui || {};
    var $D = J.dom,
        $E = J.event;

    var id = 0;
    var handleNames = {
        t: "t",
        r: "r",
        b: "b",
        l: "l",
        rt: "rt",
        rb: "rb",
        lb: "lb",
        lt: "lt"
    };
        
    var clientHeight = 0;
    var clientWidth = 0;
    /**
    * resize类
    * 
    * @memberOf ui
    * @class
    * @name Resize
    * @constructor
    * @param {Element} apperceiveEl 监听resize动作的元素
    * @param {Element} effectEl 展现resize结果的元素
    * @param {Object} option 其他选项，如:dragProxy,size,minWidth...
    * 
    */
    J.ui.Resize = new J.Class(
    /**
     * @lends ui.Resize.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (apperceiveEl, effectEl, option) {
            var context = this;
            option = option || {};

            this.apperceiveEl = apperceiveEl;
            if (effectEl === false) {
                this.effectEl = false;
            } else {
                this.effectEl = effectEl || apperceiveEl;
            }
            
            this.size = option.size || 5;
            this.minWidth = option.minWidth || 0;
            this.minHeight = option.minHeight || 0;
            this._dragProxy = option.dragProxy;
            this.isLimited = option.isLimited || false;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }

            this._left = this.getLeft();
            this._top = this.getTop();
            this._width = this.getWidth();
            this._height = this.getHeight();

            this.id = this.getId();

            var styles = {
                t: "cursor:n-resize; z-index:1; left:0; top:-5px; width:100%; height:5px;",
                r: "cursor:e-resize; z-index:1; right:-5px; top:0; width:5px; height:100%;",
                b: "cursor:s-resize; z-index:1; left:0; bottom:-5px; width:100%; height:5px;",
                l: "cursor:w-resize; z-index:1; left:-5px; top:0; width:5px; height:100%;",
                rt: "cursor:ne-resize; z-index:2; right:-5px; top:-5px; width:5px; height:5px;",
                rb: "cursor:se-resize; z-index:2; right:-5px; bottom:-5px; width:5px; height:5px;",
                lt: "cursor:nw-resize; z-index:2; left:-5px; top:-5px; width:5px; height:5px;",
                lb: "cursor:sw-resize; z-index:2; left:-5px; bottom:-5px; width:5px; height:5px;"
            };

            this._onMousedown = function () {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
            };
            this._onDragEnd = function () {
//                J.out("this._width： " + context._width);
//              J.out("this._height： " + context._height);
                $E.notifyObservers(context, "end", {
                    x: context.getLeft(),
                    y: context.getTop(),
                    width: context.getWidth(),
                    height: context.getHeight()
                });
            };

            for (var p in handleNames) {
                var tempEl = $D.node("div", {
                    "id": "window_" + this.id + "_resize_" + handleNames[p]
                });

                this.apperceiveEl.appendChild(tempEl);
                $D.setCssText(tempEl, "position:absolute; overflow:hidden; background:url(" + J.path + "style/image/transparent.gif);" + styles[p]);
                if (this._dragProxy) {
                    //$E.on(tempEl, "mousedown", this._onMousedown);
                } else {

                }

                this["_dragController_" + handleNames[p]] = new J.ui.Drag(tempEl, false);

            }



            // 左侧
            this._onDragLeftStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startLeft = context._left = context.getLeft();
                context._startWidth = context._width = context.getWidth();
                context._startHeight = context._height = context.getHeight();
            };
            this._onDragLeft = function (xy) {
                var w = context._startWidth - xy.x;
                var x = context._startLeft + xy.x;
                if (w < context.minWidth) {
                    w = context.minWidth;
                    x = context._startLeft + (context._startWidth - w);
                }
                if (context.isLimited && (x - context._leftMargin) < 0) {
                    x = context._leftMargin;
                    w = context._startLeft + context._startWidth - context._leftMargin;
                }
                context.setLeft(x);
                context.setWidth(w);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });

            };

            // 上侧
            this._onDragTopStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startTop = context._top = context.getTop();
                context._startHeight = context._height = context.getHeight();
            };
            this._onDragTop = function (xy) {
                var h = context._startHeight - xy.y;
                var y = context._startTop + xy.y;
                if (h < context.minHeight) {
                    h = context.minHeight;
                    y = context._startTop + (context._startHeight - h);
                }
                if (context.isLimited && (y - context._topMargin) < 0) {
                    y = context._topMargin;
                    h = context._startTop + context._startHeight - context._topMargin;
                }
                context.setTop(y);
                context.setHeight(h);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };



            // 右侧
            this._onDragRightStart = function (xy) {
                 $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startWidth = context._width = context.getWidth();
                context._startLeft = context._left = context.getLeft();
                context._startHeight = context._height = context.getHeight();
                clientWidth = qqweb.layout.getClientWidth();
            };
            this._onDragRight = function (xy) {
                var w = context._startWidth + xy.x;
                if (w < context.minWidth) {
                    w = context.minWidth;
                }
                var clientWidth = $D.getClientWidth() || 0;
                var maxWidth = clientWidth - context._startLeft - context._rightMargin;
                if (context.isLimited && maxWidth < w) {
                    w = maxWidth;
                }
                context.setWidth(w);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };


            // 下侧
            this._onDragBottomStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startHeight = context._height = context.getHeight();
                context._startTop = context._top = context.getTop();
                clientHeight = $D.getClientHeight();
            };
            this._onDragBottom = function (xy) {
                var h = context._startHeight + xy.y;
                if (h < context.minHeight) {
                    h = context.minHeight;
                }
                var clientHeight = $D.getClientHeight() || 0;
                var maxHeight = clientHeight - context._startTop - context._bottomMargin;
                if (context.isLimited && maxHeight < h) {
                    h = maxHeight;
                }
                context.setHeight(h);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };

            // 左上
            this._onDragLeftTopStart = function (xy) {
                context._onDragLeftStart(xy);
                context._onDragTopStart(xy);
            };
            this._onDragLeftTop = function (xy) {
                context._onDragLeft(xy);
                context._onDragTop(xy);
            };

            // 左下
            this._onDragLeftBottomStart = function (xy) {
                context._onDragLeftStart(xy);
                context._onDragBottomStart(xy);
            };
            this._onDragLeftBottom = function (xy) {
                context._onDragLeft(xy);
                context._onDragBottom(xy);
            };


            // 右下
            this._onDragRightBottomStart = function (xy) {
                context._onDragRightStart(xy);
                context._onDragBottomStart(xy);
            };
            this._onDragRightBottom = function (xy) {
                context._onDragRight(xy);
                context._onDragBottom(xy);
            };

            // 右上
            this._onDragRightTopStart = function (xy) {
                context._onDragRightStart(xy);
                context._onDragTopStart(xy);
            };
            this._onDragRightTop = function (xy) {
                context._onDragRight(xy);
                context._onDragTop(xy);
            };



            $E.addObserver(this["_dragController_" + handleNames.t], "start", this._onDragTopStart);
            $E.addObserver(this["_dragController_" + handleNames.t], "move", this._onDragTop);
            $E.addObserver(this["_dragController_" + handleNames.t], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.r], "start", this._onDragRightStart);
            $E.addObserver(this["_dragController_" + handleNames.r], "move", this._onDragRight);
            $E.addObserver(this["_dragController_" + handleNames.r], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.b], "start", this._onDragBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.b], "move", this._onDragBottom);
            $E.addObserver(this["_dragController_" + handleNames.b], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.l], "start", this._onDragLeftStart);
            $E.addObserver(this["_dragController_" + handleNames.l], "move", this._onDragLeft);
            $E.addObserver(this["_dragController_" + handleNames.l], "end", this._onDragEnd);



            $E.addObserver(this["_dragController_" + handleNames.rb], "start", this._onDragRightBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.rb], "move", this._onDragRightBottom);
            $E.addObserver(this["_dragController_" + handleNames.rb], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.rt], "start", this._onDragRightTopStart);
            $E.addObserver(this["_dragController_" + handleNames.rt], "move", this._onDragRightTop);
            $E.addObserver(this["_dragController_" + handleNames.rt], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.lt], "start", this._onDragLeftTopStart);
            $E.addObserver(this["_dragController_" + handleNames.lt], "move", this._onDragLeftTop);
            $E.addObserver(this["_dragController_" + handleNames.lt], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.lb], "start", this._onDragLeftBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.lb], "move", this._onDragLeftBottom);
            $E.addObserver(this["_dragController_" + handleNames.lb], "end", this._onDragEnd);
        },
        /**
         * 设置effectEl的宽度
         * @param {Number} w
         */
        setWidth: function (w) {
            $D.setStyle(this.effectEl, "width", w + "px");
            this._width = w;
        },
        /**
         * 设置effectEl的高度
         * @param {Number} h
         */
        setHeight: function (h) {
            $D.setStyle(this.effectEl, "height", h + "px");
            this._height = h;
        },
        /**
         * 设置effectEl的x坐标
         * @param {Number} x
         */
        setLeft: function (x) {
            $D.setStyle(this.effectEl, "left", x + "px");
            this._left = x;
        },
        /**
         * 设置effectEl的y坐标
         * @param {Number} y
         */
        setTop: function (y) {
            $D.setStyle(this.effectEl, "top", y + "px");
            this._top = y;
        },
        /**
         * 获取effectEl的宽度
         * @return {Number}
         */
        getWidth: function () {
            return parseInt($D.getStyle(this.effectEl, "width"));
        },
        /**
         * 获取effectEl的高度
         * @return {Number}
         */
        getHeight: function () {
            return parseInt($D.getStyle(this.effectEl, "height"));
        },
        /**
         * 获取effectEl的x
         * @return {Number}
         */
        getLeft: function () {
            return parseInt($D.getStyle(this.effectEl, "left"));
        },
        /**
         * 获取effectEl的y
         * @return {Number}
         */
        getTop: function () {
            return parseInt($D.getStyle(this.effectEl, "top"));
        },
        /**
         * @private
         */
        getId: function () {
            return id++;
        },
        /**
         * 锁定resize
         */
        lock: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].lock();
            }
        },
        /**
         * 解锁resize
         */
        unlock: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].unlock();
            }
        },
        /**
         * 显示触发resize的节点
         */
        show: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].show();
            }
        },
        /**
         * 隐藏触发resize的节点
         */
        hide: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].hide();
            }
        },
        /**
         * 设置resize的限定边界
         */
        setLimite : function(option){
            option = option || {};
            this.isLimited = option.isLimited || true;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
        },
        /**
         * 设置最小宽高
         */
        setMinLimite : function(option){
            option = option||{};
            this.minWidth = option.minWidth||0;
            this.minHeight = option.minHeight||0;
        }
    });



});

Jx().$package(function (J) {
    /**
     * ui 包
     * @namespace 
     * @name ui
     */
    J.ui = J.ui || {};
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        dragProxy;

    var createDragProxy = function () {
        var maskEl = $D.node("div", {
            "class": "dragMask"
        });
        var proxyEl = $D.node("div", {
            "class": "dragProxy"
        });
        maskEl.appendChild(proxyEl);
        $D.getDoc().body.appendChild(maskEl);
        return { maskEl: maskEl, proxyEl: proxyEl };
    };

    var getDragProxy = function () {
        if (!dragProxy) {
            dragProxy = createDragProxy();
        }
        return dragProxy;
    };
    // Window类
    /**
     * 【BaseWindow】
     * 
     * @class 
     * @memberOf ui
     * @name BaseWindow
     * @constructor
     * @param {Object} option 参数对象
     * @since version 1.0
     * @description window组件,可直接实例化,必须重写下列方法,不可直接使用baseWindow,垮平台的话可以在不同的文件夹重写此类
     */
    var BaseWindow = new J.Class(
    /**
     * @lends ui.BaseWindow.prototype
     */ 
            
    {
        
        _zIndex: 1,
        _inBorder: 5,
        _outBorder: 5,

        
        _windowFlag: 0,
        /**
         * 初始化函数
         * @ignore
         * @param {Object} option 参数对象
         * @return
         */
        init: function (option) { 
            var windowContext = this;
            J.profile("windowCreat"+option.windowId,"baseWindow");
            option = this.parseOption(option);
            this.subWinWidth = 0 ;
            this.subWinMarginLeft = 0;
            this.desktopIndex = option.desktopIndex;
            this.setPrivateProperty();
            this.appendTo = option.appendTo;
            if(J.isUndefined(this._windowId)){
                throw '[BaseWindow.init]: _windowId is undefined!';
            }
            if(!this._appId){
                //J.out("创建窗口需要传入appId!"+option.title);
                //alert("创建窗口需要传入appId!"+option.title);
            }

            this.createDom();
            $D.setStyle(this._window_outer,"zIndex",this.option.zIndex);
            this.createEvent();
            if(this.option.hideWinBorder){
                this.hideWinBorder();
            }
            if(this.option.hasToolBar){
                this.showToolBar();
            }

        },
        /**
         * 解析参数(此函数为接口,需在继承类里做具体实现)
         * @return {Number}  window的状态标志位
         */
        parseOption : function(){
            throw 'parseOption does not implement a required interface(Error in BaseWindow.parseOption())';
        },
        /**
         * 设置私有属性(此函数为接口,需在继承类里做具体实现)
         */
        setPrivateProperty : function(){
            throw 'setPrivateProperty does not implement a required interface(Error in BaseWindow.setPrivateProperty())';
        },
        /**
         * 获取window模版 此函数为接口,需在继承类里做具体实现
         * @return {String} html html模版
         */
        getTemplate : function(){
            throw 'getTemplate does not implement a required interface(Error in BaseWindow.getTemplate())';
        },
        /**
         * 初始化添加观察者或者事件时候的回调方法,这里的方法一般是window必须实现的(可在继承类继续添加)
         * @param
         * @return 
         */
        initObserver : function(){
            var windowContext = this;
            this.observer = 
             /**
              * @ignore
              */   
             {
                onMousedown: function () {
                    //console.dir(windowContext);
                    if(J.browser.ie) {

                    }
                    else {
                        $D.setStyle(windowContext._dragProxy.proxyEl, "left", windowContext.getX() + windowContext._outBorder + "px");
                        $D.setStyle(windowContext._dragProxy.proxyEl, "top", windowContext.getY() + windowContext._outBorder + "px");
                        $D.setStyle(windowContext._dragProxy.proxyEl, "width", windowContext._width - windowContext._outBorder * 2 + "px");
                        $D.setStyle(windowContext._dragProxy.proxyEl, "height", windowContext._height - windowContext._outBorder * 2 + "px");
                        $D.setStyle(windowContext._dragProxy.maskEl, "zIndex", 60002);
                        $D.show(windowContext._dragProxy.maskEl);                       
                    }
                },
                onMove: function (xy) {
                    windowContext._x = xy.x;
                    windowContext._y = xy.y;
                    if(windowContext.subMode==1&&windowContext.isSubWinFloat&&windowContext.subWin){
                        var subXY = $D.getRelativeXY(windowContext._subBodyOuter,windowContext.container.parentNode);
                        var offsetY =  J.browser.ie?2:0;
                        windowContext.subWin.setXY(subXY[0],subXY[1]+offsetY);
                    }
                    if(windowContext.subMode==2){
                        var x = windowContext.getX();
                        var y = windowContext.getY();
                        windowContext.subWin.setXY(x+windowContext.getWidth(),y);
                    }
                    //J.out("move: "+xy.x)
                    $E.notifyObservers(windowContext, "dragMove", xy);
                },
                onBeforeDragStart: function(){
                    $E.notifyObservers(windowContext, "beforeDragStart");
                },
                onDragStart: function(o){
                    $E.notifyObservers(windowContext, "dragStart", o);
                },
                onDragEnd: function(o){
                    if(windowContext.mask){
                        windowContext.mask.hide();
                    }
                  $E.notifyObservers(windowContext, "dragEnd", o);
                },
                onResize: function (o) {
                    if(o.width) {
                        windowContext.setWinWidth(o.width);
                    }
                    if(o.height) {
                        windowContext.setWinHeight(o.height);
                    }
                    $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                },
                onDragProxyEnd: function (xy) {               
                    if(xy) {
                        $D.hide(windowContext._dragProxy.maskEl);
                        windowContext.setXY(xy.x - windowContext._outBorder, xy.y - windowContext._outBorder);
                    }
                },
                onDragProxyResizeEnd: function (o) {
                    $D.hide(windowContext._dragProxy.maskEl);
                    windowContext.setXY(o.x - windowContext._outBorder, o.y - windowContext._outBorder);

                    var easing = 1.1;
                    var easingInterval = 200;
                    var mostStick = 5;
                    var currentStick = 0;
                    var easingFun = function () {
                        currentStick++;
                        var currentBodySize = windowContext.getBodySize();
                        var dw = o.width - currentBodySize.width;
                        var dh = o.height - currentBodySize.height;
                        windowContext.setWidth(currentBodySize.width + dw * easing + windowContext._outBorder * 2);
                        windowContext.setHeight(currentBodySize.height + dh * easing + windowContext._outBorder * 2);
                        $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                        if (currentStick < mostStick && (dw >= 5 || dw <= -5)) {
                            J.out("setting timeout " + dw + " " + dh + " " + currentStick + " mostStick:" + mostStick,"baseWindow");
                            setTimeout(easingFun, easingInterval);
                        } else {
                            windowContext.setWidth(o.width + windowContext._outBorder * 2);
                            windowContext.setHeight(o.height + windowContext._outBorder * 2);
                            $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                        }
                    };
                    //TODO Resize动画
                    //easingFun();
                    windowContext.setWidth(o.width + windowContext._outBorder * 2);
                    windowContext.setHeight(o.height + windowContext._outBorder * 2);

                    $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());

                }
            };
            //throw 'initObserver does not implement a required interface(Error in BaseWindow.initObserver())';
        },
        /**
         * 初始化节点引用(此函数为接口,需在继承类里做具体实现)
         * @param
         * @return 
         */
        initDomReference : function(){
            throw 'initDomReference does not implement a required interface(Error in BaseWindow.initDomReference())';
        },
        /**
         * 初始化添加按钮(此函数为接口,需在继承类里做具体实现)
         * @param
         * @return 
         */
        initButtons : function(){
            throw 'initButtons does not implement a required interface(Error in BaseWindow.initButtons())';
        },
        /**
         * 初始化添加事件(此函数为接口,需在继承类里做具体实现)
         * @param
         * @return 
         */
        createEvent : function(){
            throw 'createEvent does not implement a required interface(Error in BaseWindow.createEvent())';
        },
        /**
         * getAppId
         * 遗留方法不知道干嘛用的
         * @deprecated
         * @return 
         */
        getAppId : function(){
            return this._appId;
        },
        /**
         * 获取一个按钮的引用,不存在返回null值
         * @param {String} name 
         * @return {HTMLElement} , null
         */
        getButton : function(name){
            return this['_' + name + 'Button'] || null;
        },
        
        /**
         * 获取window的状态标志位(当前,非当前...)
         * @return {Number}  window的状态标志位
         */
        getWindowFlags:function(){
            return this._windowFlag;
        },
        /**
         * 设置window的状态标志位(当前,非当前...)
         * @param {Number}  window的状态标志位
         */
        setWindowFlags:function(flag){
            this._windowFlag = flag;
        },
        /**
         * 创建window窗口及相关动作的设置(initDomReference,initObserver,initButtons)
         */
        createDom: function () {
            J.out("CreateDom","baseWindow");
            var windowContext = this;

            var windowId = this._windowId;
            /**
             * 获取窗口id
             */
            this.getId = function () {
                return windowId;
            };
            var html = this.getTemplate();
            //var windowId = this.getId();

            this.container = $D.node("div", {
                "id": "appWindow_" + windowId,
                "class": "window window_current"
            });

            this.container.innerHTML = html;
            this.appendTo.appendChild(this.container);
            this.initDomReference();
            J.out("initDomReference","baseWindow");
            this.initObserver();
            J.out("initObserver","baseWindow");
            this.initButtons();
            J.out("initButtons","baseWindow");
//            $D.setStyle(this._bodyOuter, 'borderWidth', this.option.bodyBorder + 'px');
            this._width = Number(this._width);
            this._height = Number(this._height);
            this.setWidth(this._width);
            this.setHeight(this._height);
            this._toolbarHeight = 0;
            
            if(!J.isUndefined(this.option.x) && !J.isUndefined(this.option.y)){
                this.setXY(this.option.x, this.option.y);
            }

            this.setTitle(this.option.title);

            if (this.option.html) {
                this.setHtml(this.option.html);
            }

//            if (this.option.isTask) {
//                // 添加到layout, 注意子类Chatbox不写入，Chatbox自行管理
////                alloy.layout.addWindow(this);
//            }
            
            //创建flash隐藏时的节点 
            //if (this.option.flashMode) { //@rehorn
//            if (this.option.alterMode) {
//                this.createAlterDom(windowId);
//            }
            

        },

        /**
         * 获取标题栏的高度
         * @return {Number}
         */
        getTitleBarHeight: function(){
            return this._titleBarHeight || (this._titleBarHeight = $D.getHeight(this._titleBar));
        },
        
         /**
         * 设置标题栏
         * @param {String} title 标题
         */
        setTitle: function (title) {
            var title = J.string.encodeHtml(title);
            if(this.option.titleIcon){
                var icon = '<span class="window_title_icon" style="background:url('+this.option.titleIcon+') no-repeat center center;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                title = icon + title;
            }
            this._title.innerHTML = title;
        },
        /**
         * 设置标题栏html
         * @param {String} title 标题html
         */
        setTitleHtml: function (htmlTitle) {
            this._title.innerHTML = htmlTitle;
        },
        /**
         * 设置工具栏的html
         * @param {String} html
         */
        setToolBarHtml: function (html) {
            this._toolBar.innerHTML = html;
        },
        
        /**
         * 显示工具栏
         */
        showToolBarBtn: function(){
            $D.show(this._toggleToolbar);   
        },
        /**
         * 隐藏工具栏
         */
        hideToolBarBtn: function(){
            $D.hide(this._toggleToolbar);
        },
        /**
         * 设置工具栏显示或隐藏
         * @param {Boolean} isShow
         */
        setToolbar: function(isShow){
            if(isShow){
                this.showToolBar();
            }else{
                this.hideToolBar();
            }
        },
        /**
         * 切换工具栏的显示和隐藏状态
         */
        toggleToolBar: function(){
            if(this._toolbarIsShow){
                this.hideToolBar();
            }else{
                this.showToolBar();
            }
        },
        /**
         * 显示工具栏
         */
        showToolBar: function(){
            return;
            this._toolbarIsShow = true;
            $D.show(this._toolBar);
            this._toolbarHeight = $D.getClientHeight(this._toolBar);
            $D.setStyle(this.body, 'top', this._toolbarHeight + 'px');
            this.setHeight(this.getBodyHeight());
            
            this._toggleToolbar.title = '收起工具条';
            $D.replaceClass(this._toggleToolbar, 'app_toolbar_toggle_down', 'app_toolbar_toggle_up');
            alloy.util.report2app('apptoolbar|open');
        },
        /**
         * 隐藏工具栏
         */
        hideToolBar: function(){
            this._toolbarIsShow = false;
            $D.hide(this._toolBar);
            $D.setStyle(this.body, 'top', '0px');
            this._toolbarHeight = 0;
            this.setHeight(this.getBodyHeight());
            
            
            $D.replaceClass(this._toggleToolbar, 'app_toolbar_toggle_up', 'app_toolbar_toggle_down');
            this._toggleToolbar.title = '展开工具条';
            alloy.util.report2app('apptoolbar|close');
        },
        /**
         * 指示工具栏是否显示
         * @return {Boolean}
         */
        isToolBarShow: function(){
            return this._toolbarIsShow; 
        },
        /**
         * 获取工具栏的高度
         * @param {Number}
         */
        getToolBarHeight: function(){
            return this._toolbarHeight; 
        },
        /**
         * 获取工具栏的dom
         * @return {HTMLElement}
         */
        getToolBar: function(){
            return this._toolButtonBar;
        },
        /**
         * 控制所有按钮显示
         */
        setButton: function (opt) {
            for (var i in opt) {
                var isAvailable = !!opt[i], // toBool
                    btnList = [];

                switch (i) {
                /*case 'hasCloseButton':            // 关闭按钮（暂不开放）
                    btnList.push(this._closeButton);
                    break;*/
                case 'hasRefreshButton':            // 刷新按钮
//                  btnList.push(this._refreshButton);
                    break;
                default:
                    switch (this.windowType) {
                    case 'window':
                        // for window only
                        switch (i) {
                        case 'hasFullButton':       // 全屏按钮
//                          btnList.push(this._fullButton);
//                          btnList.push(this._restorefullButton);
                            break;
                        case 'hasMaxButton':        // 最大化按钮
                        //case 'hasRestoreButton':  // 恢复按钮
                            btnList.push(this._maxButton);
                            btnList.push(this._restoreButton);
                            break;
                        case 'hasMinButton':        // 最小化按钮
                            btnList.push(this._minButton);
                            break;
                        }
                        break;
                    case 'widget':
                        // for widget only
                        switch (i) {
                        case 'hasPinUpButton':      // 置顶按钮
                        //case 'hasPinDownButton':  // 置顶取消按钮
                            btnList.push(this._pinUpButton);
                            btnList.push(this._pinDownButton);
                            break;
                        }
                        break;
                    }
                }

                // change button's availability
                if (btnList.length) {
                    J.array.forEach(btnList, function (curBtn) {
                        curBtn && curBtn.setAvailability(isAvailable);
                        curBtn = null;
                    });
                    btnList = null;
                }
            }
        },
        /**
         * 显示关闭按钮
         */
        showCloseButton: function () {
            if(this._closeButton){
                this._closeButton.show();
            }
        },
        /**
         * 显示全屏按钮
         */
        showFullButton: function () {
            if(this._fullButton){
                this._fullButton.hide();
            }
        },
        /**
         * 显示最大化按钮
         */
        showMaxButton: function () {
            if(this._restoreButton){
                this._restoreButton.hide();
            }
            if(this._maxButton){
                 this._maxButton.show();
            }
        },
        /**
         * 显示还原按钮
         */
        showRestoreButton: function () {
            if(this._maxButton){
                this._maxButton.hide();
            }
            if(this._restoreButton){
                this._restoreButton.show();
            }
        },
        /**
         * 显示最小化按钮
         */
        showMinButton: function () {
            if(this._minButton){
                this._minButton.show();
            }
        },
        /**
         * 显示刷新按钮
         */
        showRefreshButton: function () {
            if(this._refreshButton){
                this._refreshButton.show();
            }
        },
        /**
         * 显示置顶按钮
         */
        showPinUpButton: function () {
            if(this._pinDownButton){
                this._pinDownButton.hide();
            }
            if(this._pinUpButton){
                this._pinUpButton.show();
            }
        },
        /**
         * 显示取消置顶按钮
         */
        showPinDownButton: function () {
            if(this._pinUpButton){
                this._pinUpButton.hide();
            }
            if(this._pinDownButton){
                this._pinDownButton.show();
            }
        },
        /**
         * 禁止ok按钮
         */
        disableOkButton: function(isDisable){        
            this._okButton.disable(isDisable);
        },
        /**
         * 显示下方控制菜单栏,并显示指定按钮
         * @param {Button} button 按钮类
         */
        showControlButton : function(button){
            $D.show(this._controlArea);
            $D.setStyle(this.body, "bottom", "29px");
            $D.addClass(this._window_outer, 'window_has_controlArea');
            button.show();
        },
        /**
         * 隐藏下方控制菜单栏
         */
        hideControlArea : function(){
            $D.hide(this._controlArea);
            $D.setStyle(this.body, "bottom", "0");
            $D.removeClass(this._window_outer, 'window_has_controlArea');
        },
        /**
        * 获取所有按钮
        */
        getButtons : function(){
            if(this._buttons){
                return this._buttons;
            }
        },
        /**
         * 显示窗口
         */
        show: function () {
            $D.show(this.container);
            var visibility = $D.getStyle(this.container,"visibility");
            if(visibility){
                $D.setStyle(this.container,"visibility","visible");
            }
            var windowContext = this;
            J.info(">>>> Window: show","baseWindow");
            $E.notifyObservers(this, "show", this.getBodySize());
            this._isShow = true;

            
        },
        /**
         * 隐藏窗口
         */
        hide: function (visibility) {
            if(visibility){
                $D.setStyle(this.container,"visibility","hidden");
            }else{
                $D.hide(this.container);
            }
            $E.notifyObservers(this, "hide");
            this._isShow = false;
        },
        /**
         * 窗口是否显示
         * @return {Boolen} 窗口是否显示
         */
        isShow: function () {
            return this._isShow;
        },
        /**
         * 窗口显示隐藏开关
         */
        toggleShow: function () {
            if (this.isShow()) {
                this.hide();
            } else {
                this.show();
            }
        },

       /**
         * 设置窗口为当前
         */
        setCurrent: function (option) {
//          var touchpad = $D.id('touchpad');
//          var id = this.getAppId();
//          
//          //这里可以修改,抛出事件给app类
//          if(touchpad){
//              if(id==undefined || id=='appMarket'){
//                  touchpad.style.width = '1px';
//                  touchpad.style.height = '1px';
//                  //console.log('hide touchpad');
//              }else{
//                  touchpad.style.width = '100%';
//                  touchpad.style.height = '100%';
//                  //console.log('show touchpad');
//              }
//          }
            this.setCurrentWithoutFocus(option);
            //TODO if crash?
            this.focus();
        },


        /**
         * 设置窗口为非当前
         */
        setNotCurrent: function () {
            // 将样式设置为非当前
            //if(this === alloy.layout.getCurrentWindow())return;
            this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_CURRENT | BaseWindow.CONST.WINDOW_FLAG_NOT_CURRENT);

            this.setStyleNotCurrent();
            $E.notifyObservers(this, "setNotCurrent");
            
            //if(this === alloy.layout.getCurrentWindow()){
            //  alloy.layout.setCurrentWindow(null);
            //}
            //$E.notifyObservers(this, "setNotCurrent");
        },

        /**
         * 设置窗口为当前激活的样式,并广播出去,windowmanager可以接收通知并处理相应的zindex
         */
        setCurrentWithoutFocus: function (option) {
            if(option && option.fromInit && this.windowType==='widget'){
                this.show();
                this.setNotCurrent();
                return;
            }
            var c= this;                
            if(!(this.getWindowFlags() & BaseWindow.CONST.WINDOW_FLAG_CURRENT)){
                c.setStyleCurrent();
                c.show();
                this.setWindowFlags(this.getWindowFlags() | BaseWindow.CONST.WINDOW_FLAG_CURRENT);
            }
            $E.notifyObservers(c, "setCurrent");
 
        },

        /**
         * 设置窗口为当前的样式
         */
        setStyleCurrent: function () {
            $D.addClass(this.container, "window_current");
        },

        /**
         * 设置窗口为非当前的样式
         */
        setStyleNotCurrent: function () {
            //避免被设为非当前的窗口已经被关闭出错(IE下)
            if(!this.container){
                return;
            }
            $D.removeClass(this.container, "window_current");
        },

        /**
         * 广播需要聚焦的通知,chatbox做聚焦聊天输入框的相关处理
         */
        focus: function () {
            $E.notifyObservers(this, "focus");
        },
        
        /**
         * 设置窗口大小模式
         */
        setBoxStatus: function (status) {
            this._status = status;

        },
         /**
         * 获取窗口大小模式
         */
        getBoxStatus: function () {
            return this._status;
        },
        
        
        /**
         * 调整窗口尺寸
         * @param {Number} clientWidth 窗口宽度
         * @param {Number} clientHeight 窗口高度
         * @parma {Number} x 窗口X位置(可缺省,默认为0)
         * @param {Number} y 窗口y位置(可缺省,默认为0)
         */
        adjustSize: function(clientWidth, clientHeight, x, y) {
            if(!J.isUndefined(x)&&!J.isUndefined(y)){
                this.setXY(x,y);
            }
            this.setWinWidth(clientWidth);
            this.setWinHeight(clientHeight);
            $E.notifyObservers(this, "resize", this.getBodySize());
        },
        /**
         * 窗口最大化,并广播出去,通过管理者设置最大化的大小
         */
        max: function () {
            if(!(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN)){
                this._restoreX=this._x;
                this._restoreY=this._y;
            }
            var beforeMaxState= this.getBoxStatus();
            this.setDisableDrag();

            this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_NORMAL | BaseWindow.CONST.WINDOW_FLAG_MAX);
            this.setBoxStatus("max");
            
            
            this.showRestoreButton();
            //this._fullButton.show();//隐藏全屏
//          this._restorefullButton.hide();

            //TODO deewiidu 存储max之前的变量
            $E.notifyObservers(this, "max",beforeMaxState);
            $E.notifyObservers(this, "resize", this.getBodySize());
////            $E.on(window, "resize", this.observer.onWindowResize);
//            $E.addObserver(alloy.layout, "sideBarPinUp", this.observer.onWindowResize);
//            $E.addObserver(alloy.layout, "sideBarPinDown", this.observer.onWindowResize);
        },

        /**
         * 窗口全屏,并广播出去,通过管理者设置最大化的大小
         */
        fullscreen:function(){
            if(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_NORMAL){
                this._restoreX=this._x;
                this._restoreY=this._y;
            }
            this.setDisableDrag();
            this.setWindowFlags(this.getWindowFlags() | BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN);
            this.setBoxStatus("fullscreen");
            this._maxButton.hide();
            this._restoreButton.hide();
            this._fullButton.hide();
            this._restorefullButton.show();
            $E.notifyObservers(this, "fullscreen", this.getBodySize());
            $E.notifyObservers(this, "resize", this.getBodySize());
        },
        
        /**
         * 全屏还原
         */
        restorefull:function(){
            if(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_NORMAL){
                this.restore();
            }
            else{
                this.max();
            }
            this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN);
            $E.notifyObservers(this, "restorefull",this.getBoxStatus());
            $E.notifyObservers(this, "resize", this.getBodySize());
            
        },
        /**
         * 窗口最小化
         */
        min: function () {
            var stat= this.getBoxStatus();
            this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_CURRENT | BaseWindow.CONST.WINDOW_FLAG_NOT_CURRENT | BaseWindow.CONST.WINDOW_FLAG_MIN);
            if(this.option.isVisibilityMode){
                this.hide(true);
            }else if (!this.option.flashMode) {//flash mode 由app自已处理hide的具体方式
                this.hide();
            }
            var s= stat||"min"; //Yukin:这里为什么要读取原来的设置呢？？？
            this.setBoxStatus(s);
            this._isShow = false; 
            $E.notifyObservers(this, "min");  
            $E.notifyObservers(this, "resize", this.getBodySize());
        },

        /**
         * 窗口还原
         */
        restore: function () { 
            this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_MAX | BaseWindow.CONST.WINDOW_FLAG_NORMAL);
//            $E.off(window, "resize", this.observer.onWindowResize);
//            $E.removeObserver(alloy.layout, "sideBarPinUp", this.observer.onWindowResize);
//            $E.removeObserver(alloy.layout, "sideBarPinDown", this.observer.onWindowResize);

            this.setXY(this._restoreX, this._restoreY);
            
            if (this._restoreWidth < 0) {
                this._restoreWidth = 0;
            }
            if (this._restoreHeight < 0) {
                this._restoreHeight = 0;
            }

            this.setWidth(this._restoreWidth);
            this.setHeight(this._restoreHeight);
            if(this._dragController){
                this._dragController.lock();
            } 
            this.setEnableDrag();

            if (this.option.hasMaxButton) {
//              this._fullButton.show();
                this.showMaxButton();
                //this._fullButton.show();//隐藏全屏
                this._restorefullButton.hide();
                if (this.option.noFullButton) {
                    this._fullButton.hide();
                }
            }
            //TODO deewiidu 这里调换了位置  不然chtbox的类在执行restore的时候根本没法得到正确的state
            this.setBoxStatus("restore");
            $E.notifyObservers(this, "restore");
            $E.notifyObservers(this, "resize", this.getBodySize());
            

        },
        /**
         * 设置窗口zIndex的层次,0为最低级
         * @param {Number} level 窗口zIndex的层次
         */
        setZIndexLevel : function (level){
            this.zIndexLevel = level;
        },
        /**
         * 获取窗口zIndex的层次,0为最低级
         * @return {Number} level 窗口zIndex的层次
         */
        getZIndexLevel : function(){
            return this.zIndexLevel;    
        },
        /**
         * 锁定zindex,锁定后setCurrent将不会变更层级
         * @param {Boolean} isLock true将锁定
         */
        setLockZIndex : function (isLock){
            this._isLockZIndex = isLock;
        },
        /**
         * 获取ZIndex是否被锁定
         */
        isLockZIndex : function(){
            return this._isLockZIndex;  
        },
        /**
         *设置窗口的内容宽度, 效果等同于 setBodyWidth
         * @see setBodyWidth
         * @param {Number} width 窗口宽度
         * 
         */
        setWidth: function (width) {
            this.setBodyWidth(width);
            return; 
        },
        /**
         * 设置窗体宽度
         * @param {Number} width
         */
        setWinWidth : function(width){
            width = width||this._width;
            var padding = this.isBorderHide?0:10;
            var borderWidth = this.option.bodyBorder * 2;
            this._bodyWidth = width - padding*2 - borderWidth -this.subWinWidth - this.subWinMarginLeft;
            this._width = width;
            $D.setStyle(this.container, "width", width+ "px");
            $D.setStyle(this._bodyOuter, "width", this._bodyWidth + this.subWinWidth + this.subWinMarginLeft + "px");
            $D.setStyle(this.body, "width", this._bodyWidth + "px");
            $D.setStyle(this._window_outer,"padding",padding+"px");
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreWidth = this._bodyWidth;       
            }
        },
        /**
         * 设置窗口内宽度(不包括外框)
         * @param {Number} bodyWidth 窗口宽度
         */
        setBodyWidth : function(bodyWidth){
            bodyWidth = bodyWidth||this._bodyWidth;
            var padding = 10,
                width,
                borderWidth = this.option.bodyBorder * 2;
            if(this.isBorderHide){
                width = bodyWidth + borderWidth;
                $D.setStyle(this._window_outer,"padding","0px");
            }else{
                width = bodyWidth + borderWidth + padding*2;
                $D.setStyle(this._window_outer,"padding",padding+"px");
            }
            this._bodyWidth = bodyWidth;
            width = width + this.subWinWidth + this.subWinMarginLeft;
            this._width = width;
            $D.setStyle(this.container, "width", width + "px");
            $D.setStyle(this._bodyOuter, "width", bodyWidth + this.subWinWidth + this.subWinMarginLeft + "px");
            $D.setStyle(this.body, "width", bodyWidth + "px");
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreWidth = this._bodyWidth;           
            }
        },
        getBodyWidth : function(){
            return this._bodyWidth;
        },
        /**
         *获取窗口宽度
         * @return {Number} 窗口宽度
         */
        getWidth:function(){
            return this._width;
        },
        /**
         *获取窗口宽度
         * @return {Number} 窗口宽度
         */
        getWinWidth:function(){
            return this._width; 
        },
        /**
         *获取窗口高度
         * @return {Number} 窗口高度
         */
        getHeight:function(){
            return this._height;
        },
        /**
         *获取窗口高度
         * @return {Number} 窗口高度
         */
        getWinHeight : function(){
            return this._height;  
        },
        
        /**
         * 设置窗口内高度(不包括外框)
         * @param {Number} height 窗口高度
         */
        setHeight: function (height) {
            this.setBodyHeight(height);
            return;   
        },
        /**
         * 设置窗口高度
         * @param {Number} height 窗口高度
         */
        setWinHeight : function(height){
            height = height||this._height;
            var titleBarHeight = this.getTitleBarHeight(), 
                borderWidth = this.option.bodyBorder * 2,
                controlAreaHeight = 0,
                toolbarHeight = 0,
                padding = 10,
                bodyHeight;
//          if(J.browser.ie&&J.browser.ie<7){
//              titleBarHeight = 29;
//            }
            if(this._controlArea&&$D.isShow(this._controlArea)){
                controlAreaHeight = 29;
            }
            if(this._toolbarHeight){
                toolbarHeight = this._toolbarHeight;
            }
            var windowOuterHeight;
            if(this.isBorderHide){
                bodyHeight = height;
                $D.setStyle(this._window_outer,"padding","0px");
                $D.setStyle(this._bodyOuter, "top", "0");
                windowOuterHeight = height - borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }else{
                bodyHeight = height - titleBarHeight - toolbarHeight - controlAreaHeight - padding*2 - borderWidth;
                $D.setStyle(this._window_outer,"padding",padding+"px");
                $D.setStyle(this._bodyOuter, "top", titleBarHeight +"px");
                windowOuterHeight = height - padding*2 -borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }
            this._bodyHeight = bodyHeight + 1;
            
            this._height = height;
            $D.setStyle(this.body, "height", (this._bodyHeight-borderWidth) + "px");
            $D.setStyle(this._bodyOuter, "height", (this._bodyHeight+toolbarHeight-borderWidth) + "px");
            $D.setStyle(this.container, "height", height + "px");
            
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreHeight = this._bodyHeight;
            }
            //TODO notify setNewHeight
            $E.notifyObservers(this, "setNewHeight", height);
        },
        /**
         * 设置窗口内高度(不包括外框)
         * @param {Number} bodyHeight 窗口高度
         */
        setBodyHeight : function(bodyHeight){
            bodyHeight = bodyHeight||this._bodyHeight;
            var titleBarHeight = this.getTitleBarHeight(), 
                borderWidth = this.option.bodyBorder * 2,
                controlAreaHeight = 0,
                toolbarHeight = 0,
                padding = 10,
                height;
//          if(J.browser.ie&&J.browser.ie<7){
//              titleBarHeight = 29;
//            }
            if(this._controlArea&&$D.isShow(this._controlArea)){
                controlAreaHeight = 29;
            }
            if(this._toolbarHeight){
                toolbarHeight = this._toolbarHeight;
            }
            var windowOuterHeight;
            if(this.isBorderHide){
                height = bodyHeight;
                $D.setStyle(this._window_outer,"padding","0px");
                $D.setStyle(this._bodyOuter, "top", "0");
                windowOuterHeight = height - borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }else{
                height = bodyHeight + titleBarHeight + toolbarHeight + controlAreaHeight + padding*2+borderWidth;
                $D.setStyle(this._window_outer,"padding",padding+"px");
                $D.setStyle(this._bodyOuter, "top", titleBarHeight + "px");
                windowOuterHeight = height - padding*2 -borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }
            this._bodyHeight = bodyHeight + 1;

            this._height = height;
            $D.setStyle(this.body, "height", (this._bodyHeight-borderWidth) + "px");
            $D.setStyle(this._bodyOuter, "height", (this._bodyHeight+toolbarHeight-borderWidth) + "px");
            $D.setStyle(this.container, "height", height + "px");
            //模式的处理
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreHeight = this._bodyHeight;
            }
            //TODO notify setNewHeight
            $E.notifyObservers(this, "setNewHeight", this._height);
        },
        /**
         *获取窗体body部分高度
         * @return {Number} 窗体body部分高度
         */
        getBodyHeight: function () {
            return this._bodyHeight;
        },
        
        /**
         *设置窗口的外框尺寸
         * @param {Number} width 
         * @param {Number} height 
         */
        setWinSize: function(option){
            this.setWinWidth(option.width);
            this.setWinHeight(option.height);
            $E.notifyObservers(this, "resize", this.getBodySize());
        },
        
        /**
         *设置窗口的内部Body尺寸
         * @param {Number} width
         * @param {Number} height 
         */
        setBodySize: function(option){
            this.setBodyWidth(option.width);
            this.setBodyHeight(option.height);
            $E.notifyObservers(this, "resize", this.getBodySize());
        },

        /**
         *获取窗口的zIndex
         * @return {Number} 窗口的zIndex
         */
        getZIndex: function () {
            return this._zIndex;
        },
        /**
         *设置窗口的zIndex
         * @param {Number} zIndex 窗口的zIndex
         */
        setZIndex: function (zIndex) {
            $D.setStyle(this.container, "zIndex", zIndex);
            $D.setStyle(this._window_inner, "zIndex", zIndex);
            this._zIndex = zIndex;
        },

        // 设置窗口位置
        /**
         *设置窗口位置
         * @param {Number} x 窗口x位置
         * @param {Number} y 窗口y位置
         */
        setXY: function (x, y) { 
            //var co= this.container;
            //$D.hide(co);
            if (x || x === 0) {
                this.setX(x);
            }
            if (y || y === 0) {
                this.setY(y);
            }
            //$D.show(co);

        },

        /**
         *设置窗口x位置
         * @param {Number} x 窗口x位置置
         */
        setX: function (x) {
            this._x = x;
            //this._restoreX = this._x;
            $D.setStyle(this.container, "left", x + "px");
            $E.notifyObservers(this, "positionChanged");
            //$D.setStyle(this.container, "right", "");
        },
         /**
         *设置窗口y位置
         * @param {Number} y 窗口y位置
         */
        setY: function (y) {
            this._y = y;
            //this._restoreY = this._y;
            $D.setStyle(this.container, "top", y + "px");
            $E.notifyObservers(this, "positionChanged");
            //$D.setStyle(this.container, "bottom", "");
        },

         /**
         *获取窗口x位置
         * @return {Number} 窗口x位置
         */
        getX: function (x) {
            return parseInt($D.getStyle(this.container, "left"));
            //$D.setStyle(this.container, "right", "");
        },
         /**
         *获取窗口还原x位置
         * @return {Number} 窗口还原x位置
         */
        getRestoreX : function(){
            return this._restoreX;
        },
        /**
         *获取窗口还原y位置
         * @return {Number} 窗口还原y位置
         */
        getRestoreY : function(){
            return this._restoreY;
        },
        /**
         *获取窗口左上角坐标
         * @return {Number} 窗口左上角坐标
         */
        getLeft: function(){
            return this._x;
        },
         /**
         *获取窗口y位置
         * @return {Number} 窗口y位置
         */
        getY: function (y) {
            return parseInt($D.getStyle(this.container, "top"));
            //$D.setStyle(this.container, "bottom", "");
        },
        
        /**
         *获取窗口xy位置
         * @return {Object} 窗口xy位置
         */
        getXY: function (x) {
            return {
                x:this.getX(),
                y:this.getY()
            };
        },
        
        /**
         *获取窗口还原xy位置
         * @return {Object} 窗口还原xy位置
         */
        getRestoreXY : function(){
            return {
                x:this.getRestoreX(),
                y:this.getRestoreY()
            };
        },

         /**
         *设置窗口left位置,会将right清空
         * @param {Number} 窗口left位置
         */
        setLeft: function (left) {
            $D.setStyle(this.container, "left", left + "px");
            $D.setStyle(this.container, "right", "");
        },
        /**
         *设置窗口top位置,会将bottom清空
         * @param {Number} 窗口top位置
         */
        setTop: function (top) {
            $D.setStyle(this.container, "top", top + "px");
            $D.setStyle(this.container, "bottom", "");
        },
       /**
         *设置窗口right位置,会将left清空
         * @param {Number} 窗口right位置
         */
        setRight: function (right) {
            $D.setStyle(this.container, "right", right + "px");
            $D.setStyle(this.container, "left", "");
        },
         /**
         *设置窗口bottom位置,会将top清空
         * @param {Number} 窗口bottom位置
         */
        setBottom: function (bottom) {
            $D.setStyle(this.container, "bottom", bottom + "px");
            $D.setStyle(this.container, "top", "");
        },
         /**
         *设置窗口居中,广播出通知,需由管理者去设置
         */
        setWindowCentered: function () {  
//            this.setXY(l, t);
            
            $E.notifyObservers(this, "setCenter");
        },
        
         /**
         *设置窗口相对某窗口居中
         *@param {Element} parentWindow 需要相对居中的节点
         */
        setWindowCenteredRelative: function(parentWindow){
            var x=parentWindow.getX()+((parentWindow.getWidth()-this._width)/2);
            this.setX(x);
        },

        // 开启drag
        /**
         *开启拖拽
         */
        enableDrag: function () {
            this.option.dragable = true;
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this.setEnableDrag();
            }

        },
        /**
         *关闭拖拽
         */
        disableDrag: function () {
            this.option.dragable = false;
            this.setDisableDrag();
        },

        /**
         *开启拖拽代理
         */
        enableDragProxy: function () {
            this.option.dragProxy = true;
            //this.setEnableDragProxy();

        },
        /**
         *关闭拖拽代理
         */
        disableDragProxy: function () {
            this.option.dragProxy = false;
            //this.setDisableDragProxy();
        },
        /**
         *开启拖拽brige
         */
        setEnableDrag: function () {
            var c= this;
            if (this.option.dragable) {
                if (this._dragController) {
                    if (this.option.dragProxy) {
                        $E.on(this.container, "mousedown", this.observer.onMousedown);
                    }
                    this._dragController.unlock();
                } else {

                    if (this.option.dragProxy) {
                    
                        this._dragProxy = getDragProxy();
                        $E.on(this.container, "mousedown", this.observer.onMousedown);
                        this._dragController = new J.ui.Drag(this.container, this._dragProxy.proxyEl, {
                            isLimited: true,
                            clientEl: this.option.dragLimitEl || this.option.appendTo,//az 2011-9-20
                            leftMargin: this._leftMargin + this._outBorder,
                            topMargin: this._topMargin + this._outBorder,
                            rightMargin: this._rightMargin + this._outBorder,
                            bottomMargin: this._bottomMargin + this._outBorder,
                            isOverLeft: true,
                            isOverRight: true,
                            /*isOverBottom: true,*/
                            isLockCursorInScreen: true
                        });

                        $E.addObserver(this._dragController, "end", this.observer.onDragProxyEnd);
                  
                        
                    } else {
                        this._dragController = new J.ui.Drag(this.container, this.container, {
                            isLimited: true,
                            clientEl: this.option.dragLimitEl || this.option.appendTo,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            isOverLeft: true,
                            isOverRight: true,
                            /*isOverBottom: true,*/
                            isLockCursorInScreen: true
                        });
                        $E.addObserver(this._dragController, "move", this.observer.onMove);  
                    }
                    $E.addObserver(this._dragController, "beforeStart", this.observer.onBeforeDragStart);  
                    $E.addObserver(this._dragController, "start", this.observer.onDragStart);  
                    $E.addObserver(this._dragController, "end", this.observer.onDragEnd);  

                    //刚初始化,锁住
//                    this._dragController.lock();
                }
                this.setEnableResize();
            }
        },
        /**
         *开启拖拽brige
         */
        setDisableDrag: function () {
            if (this._dragController) {
                this._dragController.lock();
                if (this.option.dragProxy) {
                    $E.off(this.container, "mousedown", this.observer.onMousedown);
                }
            }
            this.setDisableResize();
        },
        /**
         * 设置拖拽的限制边界
         * @param {Object} option option={ leftMargin: 0,
                topMargin: 0,
                rightMargin: 0,
                bottomMargin: 0}
         *
         */
        setDragLimite: function(option){
            this._dragController.setLimite(option);
        },
        /**
         * @ignore
         */
        onDrag:function(e){
            if(J.browser.ie && J.browser.ie<=6 && (e.target.tagName=='A' || e.target.parentNode && e.target.parentNode.tagName=='A')) return;
            this.startDrag([e.pageX,e.pageY]);
        },
        /**
         * 开启拖动
         */
        startDrag : function(xy){
            var context = this;
            var node=context.container.children[0];
            $D.hide(node);
            if(context.mask){
                context.mask.remove();
            }
            context.mask =  new J.ui.MaskLayer({appendTo:context.container,opacity: 0});
            context.mask.show();
            $D.show(node);
            if(typeof(xy)!='undefined'){
                var xy1=$D.getClientXY(this.body);
                this._dragController.dragStartIn(xy[0]+xy1[0],xy[1]+xy1[1]);
            }
            else{
                var onMove = function(e){
                    context._dragController.dragStart(e);
                    $E.off(document, "mousemove",onMove);
                }
                $E.on(document, "mousemove",onMove);
            }
        },

        /**
         *开启Resize
         */
        enableResize: function () {
            this.option.resize = true;
            if (this.getBoxStatus() !== "max") {
                this.setEnableResize();
            }
        },
        /**
         *关闭Resize
         */
        disableResize: function () {
            this.option.dragable = false;
            this.setDisableResize();
        },
       /**
         *开启Resize brige
         */
        setEnableResize: function () {
            if (this.option.resize) {
                if (this._resizeController) {
                    if (this.option.dragProxy) {
                        $E.addObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                    }
                    this._resizeController.show();
                } else {
                    if (this.option.dragProxy) {
                        this._dragProxy = getDragProxy();
                        this._resizeController = new J.ui.Resize(this._window_inner, this._dragProxy.proxyEl, {
                            isLimited: true,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            minWidth: this._minWidth,
                            minHeight: this._minHeight,
                            dragProxy: this._dragProxy
                        });
                        $E.addObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                        $E.addObserver(this._resizeController, "end", this.observer.onDragProxyResizeEnd);

                    }
                    else {
                        this._resizeController = new J.ui.Resize(this._window_inner, this.container, {
                            isLimited: true,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            minWidth: this._minWidth,
                            minHeight: this._minHeight
                        });
                        $E.addObserver(this._resizeController, "resize", this.observer.onResize);
                    }
                    $E.addObserver(this._resizeController, "mousedown", this.observer.onDragStart);  
                    $E.addObserver(this._resizeController, "end", this.observer.onDragEnd);  
                }
            }
        },

        /**
         *关闭Resize brige
         */
        setDisableResize: function () {
            if (this._resizeController) {
                this._resizeController.hide();
                if (this.option.dragProxy) {
                    $E.removeObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                }
            }
        },
        /**
         * 设置边界限制
         * @param {Object} option option={ leftMargin: 0,
                topMargin: 0,
                rightMargin: 0,
                bottomMargin: 0}
         *
         */
        setLimite : function(option){
            option = option || {};
            if (this.isLimited) {
                this._leftMargin = option.leftMargin;
                this._topMargin =   option.topMargin;
                this._rightMargin =  option.rightMargin;
                this._bottomMargin = option.bottomMargin;   
            }
        },
        /**
         * 设置窗口的最小宽高
         * @param {Object} option option={ minHeight: 0, minWidth: 0}
         */
        setMinLimite : function(option){
            if(this._resizeController){
                this._resizeController.setWidth(this._width);
                this._resizeController.setMinLimite(option);    
            }
        },
        /**
         *设置窗口body的html
         *@param {String} html 窗口body的html
         */
        setHtml: function (html) {
            this.html = html;
            this.body.innerHTML = html;
//            if (this.option.alterMode) {//转移到app类去了
//                this.createAlterDom(this.getId());
//            }
        },
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
        setBorderOpacity: function(opacity){
            //$D.setStyle(this.container, 'opacity', 1);
            if(J.browser.ie && J.browser.ie < 9){
                return;  //ie8以下不支持
            }
            $D.setStyle(this._bg_container, 'opacity', opacity);
        },
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
        setOpacity: function(opacity){
            if(J.browser.ie && J.browser.ie < 9){
                return;  //ie8以下不支持
            }
            $D.setStyle(this.container, 'opacity', opacity);
        },
        /**
         *设置窗口body的节点
         *@param {Element} node 窗口body的节点
         */
        append: function (node) {
            this.body.appendChild(node);
        },

        /**
         *获取窗口的size
         *@return {Object} size的对象
         */
        getSize: function () {
            return {
                width: $D.getClientWidth(this.container),
                height: $D.getClientHeight(this.container)
            };
        },
        /**
         *获取窗口body的size
         *@return {Object} size的对象
         */
        getBodySize: function () {

            return {
                width: parseInt($D.getStyle(this.body, "width"), 10),
                height: parseInt($D.getStyle(this.body, "height"), 10)
            };
        },
        /**
         *获取窗口本身的dom对象
         *@return {Element} 窗口本身的dom对象
         */
        getSelfDomObj : function(){
            return this.container;          
        },
        /**
         * 隐藏窗口的边框
         */
        hideWinBorder : function(){
            if(!this.isBorderHide){
                this.isBorderHide = true;
                $D.hide(this._window_bg);
                $D.hide(this._titleBar);
                this.setWidth(this.getBodyWidth());
                this.setHeight(this.getBodyHeight());
            }   
        },
        /**
         * 显示窗口边框
         */
        showWinBorder : function(){
            if(this.isBorderHide){
                this.isBorderHide = false;
                $D.show(this._window_bg);
                $D.show(this._titleBar);
                this.setWidth(this.getBodyWidth());
                this.setHeight(this.getBodyHeight());
            }
        },
        /**
         * 切换窗口边框的显示隐藏
         */
        toggleWinBorder : function(){
            if(!this.isBorderHide){
                this.hideWinBorder();
            }else{
                this.showWinBorder();
            }
        },
        /**
         * 设置窗口的子窗口模式
         * @param {Object} mode 0,无子窗口；1，内嵌子窗口；2，跟随子窗口
         * @param {Object} option
         */
        setSubMode : function(mode,option){
            switch(mode){
             case 1 :
                 this.setSubWinInner(option);
                 break;
             case 2 : 
                 this.setSubWinFollow(option);
                 break;
             default : 
                this.setSubWinNone(option);
                 break;
            }
            this.subMode = mode;
        },
        /**
         * 设置子窗口的内容
         */
        setSubWinInner : function(option){
            option = option||{};
            this.subMode = 1;
            this.subWinWidth =this.subWinWidth||200;
            this.subWinMarginLeft = 10;
            var windowId = this.getId();
//          $D.setStyle(this.container, "width", this._width+ this.subWinWidth + this.subWinMarginLeft + "px");
//            $D.setStyle(this._bodyOuter, "width", this._bodyWidth+ this.subWinWidth +this.subWinMarginLeft + "px");
            //储存以便还原
            if(this.getBoxStatus() != "fullscreen"&&this.getBoxStatus() != "max"){
                this.setBodyWidth(option.width||this._bodyWidth);
                this.setBodyHeight(option.height||this._bodyHeight);
            }else{
                this.setWinWidth();
                this.setWinHeight();
            }       
            if(this._subBodyOuter){
                $D.show(this._subBodyOuter);
            }else{
                this._subBodyOuter = $D.node("div",{
                    "class" : "window_bodyArea",
                    "id" : "window_sub_body_"+windowId
                });
                this._bodyOuter.appendChild(this._subBodyOuter);
            }
            $D.setStyle(this._subBodyOuter, "width",this.subWinWidth + "px");
            $D.setStyle(this._subBodyOuter, "height",this._bodyHeight + "px");
            $D.setStyle(this._subBodyOuter, "right","5px");
//          $D.setStyle(this._subBodyOuter, "background","#eee");
            $D.setStyle(this.subWin.container, "left","0");
            $D.setStyle(this.subWin.container, "top","0");
            this.subWin.hideWinBorder();
            if(this.isSubWinFloat){
                var subXY = $D.getRelativeXY(this._subBodyOuter,this.container.parentNode);
                var offsetY =  J.browser.ie?2:0;
                this.subWin.setXY(subXY[0],subXY[1]+offsetY);
            }else{
                this._subBodyOuter.appendChild(this.subWin.container);
            }
            this.setCurrent();
            if(option.isSubWinFloat){
                this.subWin.setZIndex(this.getZIndex()+1);
            }
            var context = this;
            this.setMinLimite({
                minWidth:context._width,
                minHeight:context._height
            });
            
        },
        /**
         * 隐藏子窗口
         */
        hideSubWinInner : function(){
            this.subWinWidth = 0;
            this.subWinMarginLeft = 0;
            this.subWin.showWinBorder();
            this.setBodyWidth(this._bodyWidth);
//          $D.setStyle(this.container, "width", this._width + "px");
//            $D.setStyle(this._bodyOuter, "width", this._bodyWidth + "px");
            if(this._subBodyOuter){
                $D.hide(this._subBodyOuter);
            }
            var x = this.getX();
            var y = this.getY();
            this.subWin.setXY(x+this.getWidth(),y);
            if(!this.isSubWinFloat){
                this.subWin.option.appendTo.appendChild(this.subWin.container);
            }
            var _restoreX = this._restoreX;
            var _restoreY = this._restoreY;
            //设置为原来大小
            if(this.getBoxStatus() == "fullscreen"){
                this.fullscreen();
                this._restoreX=_restoreX;
                this._restoreY=_restoreY;
                this._restoreWidth = this.option.width;
                this._restoreHeight = this.option.height;
            }else if(this.getBoxStatus() == "max"){
                this.max();
                this._restoreX=_restoreX;
                this._restoreY=_restoreY;
                this._restoreWidth = this.option.width;
                this._restoreHeight = this.option.height;
            }else{
                this.setWidth(this.option.width);
                this.setHeight(this.option.height);
            }
            var context = this;
            this.setMinLimite({
                minWidth:context._minWidth,
                minHeight:context._minHeight
            });
//            this.subWin.setXY(this.subWin._x,this.subWin._y);
            //this.subWin.option.appendTo.appendChild(this.subWin.container);
        },
        /**
         * 让子窗口跟随父窗口
         */
        setSubWinFollow : function(){
            if(this.subMode!=2){
                this.removeSubordinate();   
            }
            this.subMode = 2;
            var x = this.getX();
            var y = this.getY();
            this.subWin.setXY(x+this.getWidth(),y);
            var windowContext = this;
            var onMove = function(){
                windowContext.setSubWinNone();
                $E.removeObserver(this.subWin._dragController, "move", onMove); 
            }
            $E.addObserver(this.subWin._dragController, "move", onMove); 
        },
        /**
         * 去除子窗口
         */
        setSubWinNone : function(){
            if(this.subMode==0){
                return;
            }
            this.subMode = 0;
            this.hideSubWinInner();
            
        },
        /**
         * 获取子窗口模式, 0,无子窗口；1，内嵌子窗口；2，跟随子窗口
         */
        getSubMode : function(){
            return this.subMode;
        },
        /**
         * 添加一个从属子窗口
         * @param {ui.BaseWindow} window
         * @param {Object} option
         */
        addSubordinate : function(window,option){
            if(!this.subWin){
                this.subWin = window;
                if(option.subWinWidth){
                    this.subWinWidth =  option.subWinWidth;
                }
                if(!option||!option.mode){
                    var mode =  1;  
                }else{
                    var mode = option.mode; 
                }
                if(option.isSubWinFloat){
                    this.isSubWinFloat = true;
                }else{
                    this.isSubWinFloat = false;
                }
                this.setSubMode (mode,option);
            }
        },
        /**
         * 移除一个从属子窗口
         */
        removeSubordinate : function(){
            if(this.subWin){
                this.setSubMode (0);
                //重置所有属性
                this.subWin = null;
                this.subWinWidth = 0;
                this.isSubWinFloat = false;//子窗口是否以浮动形式跟着内嵌窗口
            }
        },
        /**
         *关闭窗口
         */
        close: function () {
            var context = this;
            if($E.notifyObservers(context, "beforeClose", context) === false){
                return false;
            }
            if($E.notifyObservers(context, "close", context) === false){
                return false;
            }
            context.destroy();
            $E.notifyObservers(context, "afterClose", context);
        },
        /**
         *销毁窗口对象
         */
        destroy: function () {
            var context = this;
            $E.notifyObservers(context, "destroy", context);
            var appendTo = context.container.parentNode;
            context.container.innerHTML = "";
            appendTo.removeChild(context.container);
            for (var p in context) {
                if (context.hasOwnProperty(p)) {
                    delete context[p];
                }
            }
            this._isDestroy = true;
        },
        /**
         * 指示窗口是否已经销毁
         */
        isDestroy : function(){
            return this._isDestroy;
        }

    });
    
    /**
     * @constant
     * @property
     * @memberOf ui.BaseWindow
     * @name CONST
     */
    BaseWindow.CONST = {
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_MIN
         */
        WINDOW_FLAG_MIN:1,
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_NORMAL
         */
        WINDOW_FLAG_NORMAL:2,
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_MAX
         */
        WINDOW_FLAG_MAX:4,
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_CURRENT
         */
        WINDOW_FLAG_CURRENT:8,
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_NOT_CURRENT
         */
        WINDOW_FLAG_NOT_CURRENT:16,
        /**
         * @constant
         * @property
         * @memberOf ui.BaseWindow
         * @name CONST.WINDOW_FLAG_FULLSCREEN
         */
        WINDOW_FLAG_FULLSCREEN:32
    };

    J.ui.BaseWindow = BaseWindow;

});

/* == UI类 Panel ========================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * -------------------------------------------- 2010.10.14 ----- */
 
 
Jx().$package(function(J){
    var packageContext = this,
        $D = J.dom,
        $E = J.event;
        
    
    
    /**
     * 【Panel】面板类定义
     * 
     * @class 
     * @memberOf ui
     * @name Panel
     * @constructor
     * @param {Object} option ,{
     *  id,name,container,body,html
     * }
     * @since version 1.0
     * 
     */
    var Panel = new J.Class(
    /**
     * @lends ui.Panel.prototype
     */
    {
        /**
         * @ignore
         */
        init: function(option){
            option = option || {};
            this.id = option.id;
            this.name = option.name;
            this.container = option.container;
            this.body = option.body || option.container;
            
            option.html = option.html || "";
            if(option.html){
                this.setHtml(option.html);
            }
            if($D.isShow(this.container)){
                this.show();
            }else{
                this.hide();
            }

        },
        /**
         * 设置panel的内容
         * @param {String} html
         */
        setHtml: function(html){
            this.html = html;
            this.body.innerHTML = html;
        },
        /**
         * 把node添加到尾部
         * @param {HTMLElement} node 
         */
        append: function(node){
            this.body.appendChild(node);
        },
        /**
         * 返回container的大小
         * @return  {Object}, {widht:xxx,height:xxx}
         */
        getSize: function(){
            return {
                width:$D.getClientWidth(this.container),
                height:$D.getClientHeight(this.container)
            };
        },
        /**
         * 返回body的大小,body跟container可能不一样
         * 在没有设置body的时候,body就是container
         * @return {Object} {widht:xxx,height:xxx}
         */
        getBodySize: function(){
            
            return {
                width: parseInt($D.getStyle(this.body, "width"), 10),
                height: parseInt($D.getStyle(this.body, "height"), 10)
            };
        },
        /**
         * 显示面板
         * 
         */
        show: function(){
            $D.show(this.container);
            $E.notifyObservers(this, "show", this.getBodySize());
            this._isShow = true;
        },
        /**
         * 隐藏面板
         */
        hide: function(){
            $D.hide(this.container);
            $E.notifyObservers(this, "hide");
            this._isShow = false;
        },
        /**
         * 返回面板是否显示
         * @return {Boolean} 
         */
        isShow: function(){
            return this._isShow;
        },
        /**
         * 切换面板的显示与隐藏
         */
        toggleShow: function(){
            if(this.isShow()){
                this.hide();
            }else{
                this.show();
            }
        },
        /**
         * 获取z-index
         * @return {Number}
         */
        getZIndex: function(){
            return this._zIndex;
        },
        /**
         * 设置z-index
         * @param {Number} zIndex
         */
        setZIndex: function(zIndex){
            $D.setStyle(this.container, "zIndex", zIndex);
            this._zIndex = zIndex;
        },
        /**
         * 设置面板坐标
         * @param {Number} x
         * @param {Number} y
         */
        setXY: function(x, y){
            this.setX(x);
            this.setY(y);
        },
        /**
         * 设置面板位置 X
         * @param {Number} x
         */ 
        setX: function(x) {
            $D.setStyle(this.container, "left", x + "px");
        },
        /**
         * 设置面板位置 Y
         * @param {Number} y
         */ 
        setY: function(y) {
            $D.setStyle(this.container, "top", y + "px");
        },
        /**
         * 设置宽度
         * @param {Number} w
         */
        setWidth: function(w){
            $D.setStyle(this.container, "width", w + "px");
        },
        /**
         * 获取宽度
         * @return {Number} 
         */
        getWidth: function(){
            return parseInt($D.getStyle(this.container, "width"));
        },
        /**
         * 设置高度
         * @param {Number} h
         */
        setHeight: function(h){
            $D.setStyle(this.container, "height", h + "px");
        },
        /**
         * 获取高度
         * @return {Number} 
         */
        getHeight: function(){
            return parseInt($D.getStyle(this.container, "height"));
        }
    });
    J.ui = J.ui || {};
    J.ui.Panel = Panel;
    
});

/* == boxy类 =============================================
 * 弹出框
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-3-28 ----- */
 
 
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
    J.ui = J.ui || {};
    /**
     * 【Boxy】
     * 
     * @class 
     * @memberOf ui
     * @name Boxy
     * @constructor
     * @param {Object} option 参数对象
     */
    var Boxy = new J.Class(
    /**
     * @lends ui.Boxy.prototype
     */ 
    {
        /**
         * @ignore
         */
        init: function (option) {
            var _this = this;
            option = option || {};
            this._id = (option.id || (new Date().getTime()));
            option.name = option.id;
            option.width = option.width || 300;
            option.height = option.height || 300;
            option.appendTo = option.appendTo || document.body;
            option.zIndex = option.zIndex || 1;
            var node = $D.node('div',{
                'class':'ui_boxy'
            });
            node.innerHTML = '\
                <div style="position:relative; z-index:1;"><div class="ui_boxyClose" id="ui_boxyClose_'+this._id+'"></div></div>\
                <div class="ui_boxyWrapper" id="ui_boxyWrapper_'+this._id+'"></div>\
                ';
            option.appendTo.appendChild(node);
            option.container = node;
            option.body = $D.id('ui_boxyWrapper_'+this._id);
            this._option = option;
            
            this._panel = new J.ui.Panel(option);
            this._panel.setWidth(option.width);
            this._panel.setHeight(option.height);
            this._maskLayer;
            if(option.modal){
                this._maskLayer = new J.ui.MaskLayer({ 
                        appendTo: option.appendTo,
                        zIndex: option.zIndex,
                        opacity: 0.5
                    });
                this._maskLayer.show();
            }
            this._panel.setZIndex(option.zIndex + 1);
            this.setCenter(option);
            new J.ui.Drag(node, node, {isLimited: true});
            
            var closeBtn = $D.id("ui_boxyClose_" + this._id);
            var wrapper = this._wrapper = $D.id("ui_boxyWrapper_" + this._id);
            $E.on(closeBtn, 'click', function(e){
                //_this.hide();
                _this.close();
                option.onClose && option.onClose.apply(_this);
                $E.notifyObservers(_this, 'close'); 
            });
            
        },
        /**
         * 获取弹出框所处的面板
         * @return {ui.Panel} 
         */
        getPanel: function(){
            return this._panel;
        },
        /**
         * 显示弹出框
         */
        show: function(){
            this._panel.show(); 
        },
        /**
         * 隐藏弹出框
         */
        hide: function(){
            this._panel.hide();
        },
        /**
         * 设置弹出框的层级
         * @param {Number} index 层级
         */
        setZIndex: function(index){
            this._panel.setZIndex(index); 
        },
        /**
         * 将弹出框居中
         */
        setCenter: function(option){
            var w = $D.getClientWidth(),
                h = $D.getClientHeight();
            var l = (w > option.width) ? (w - option.width) / 2 : 0;
            var t = (h > option.height) ? (h - option.height) / 2 : 0;
            this._panel.setXY(l,t);
        },
        /**
         * 指示弹出框是否显示
         */
        isShow: function(){
            return this._panel.isShow();
        },
        /**
         * 关闭弹出框
         */
        close: function(){
            //this._panel.hide();
            this._maskLayer && this._maskLayer.remove();
            this._option.appendTo.removeChild(this._option.container);
        }
    });
    
    J.ui.Boxy = Boxy;
});/**  J.ui.Bubble
 * @deprecated QQ Web bubble 模块
 *  Copyright (c) 2009, Tencent.com All rights reserved.
 *  -------- 2009.11.17 -----
 *  
 *  -------------------------
 *  melody
 *  -------------------------
 * @version 1.0
 * @author Tencent
 *  
 **/


Jet().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
        
    J.ui = J.ui || {};
    /**
     * 带箭头的气泡类
     * @class
     * @memberOf ui
     * @name Bubble
     * @constructor
     * @param {Object} option 构造参数
     * {
     *   bubbleParent, {HTMLElement} 气泡的dom的父节点
     * }
     * @description 
     * 注意, bubble的自动关闭都是hide调用, 是不会把自己删除的, 要删除bubble, 调用close方法
     * 
     */
    var Bubble = J.ui.Bubble = J.Class(
    /**
     * @lends ui.Bubble.prototype
     */
    {
        /**
         * 初始化气泡
         * @private
         * @ignore
         */
        init: function(option){
            option = option || {};
            var defaultOption = {
                bubbleParent: document.body,
                className: '',
                hasCloseButton: true,
                closeOnHide: false,
                zIndex: 1000000
            };
            option = this.option = J.extend(defaultOption, option);
            var id = this._getId();
            
            var html = '<div id="bubble_tip_pointer_' + id + '" class="bubble_tip_pointer bubble_tip_pointer_left"></div>\
                <div class="bubble_tip_head"></div>\
                <div class="bubble_tip_body">\
                    <div class="bubble_tip_title"><a id="bubble_tip_close_' + id + '" href="###" class="bubble_tip_close" title="关闭">x</a>\
                        <span id="bubble_tip_title_' + id + '"></span></div>\
                    <div id="bubble_tip_content_' + id + '" class="bubble_tip_content"></div>\
                </div>\
                <div id="bubble_tip_foot_' + id + '" class="bubble_tip_foot">\
                    <a id="bubble_tip_btn_next_' + id + '" href="###" class="bubble_tip_btn"></a>\
                    <a id="bubble_tip_btn_ok_' + id + '" href="###" class="bubble_tip_btn"></a>\
                </div>\
                <iframe width="100%" height="100%" class="bubble_tip_bg_iframe" src="about:blank"></iframe>';
            var divNode = $D.node("div",{
                'class': 'bubble_tip_container ' + option.className
            });
            divNode.innerHTML = html;
            $D.setCssText(divNode, 'left: -10000px; top: 0px; z-index: ' + option.zIndex + ';');
            option.bubbleParent.appendChild(divNode);
            
            
            this._container = divNode;
            this._title = $D.id('bubble_tip_title_' + id);
            this._content = $D.id('bubble_tip_content_' + id);
            this._pointer = $D.id('bubble_tip_pointer_' + id);
            this._okBtn = $D.id('bubble_tip_btn_ok_' + id);
            this._nextBtn = $D.id('bubble_tip_btn_next_' + id);
            this._closeBtn = $D.id('bubble_tip_close_' + id);
            if(!option.hasCloseButton){
                $D.hide(this._closeBtn);
            }
            var context = this;
            
            var observer = {
                /**
                 * @ignore
                 */
                onCloseBtnClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleClose', context);
                    context.hide();
                },
                /**
                 * @ignore
                 */
                onOkButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleOkBtnClick', context);
                    context.hide();
                },
                /**
                 * @ignore
                 */
                onNextButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleNextBtnClick', context);
                }
            };
            
            $E.on(this._closeBtn, 'click', observer.onCloseBtnClick);
            $E.on(this._okBtn, 'click', observer.onOkButtonClick);
            $E.on(this._nextBtn, 'click', observer.onNextButtonClick);
            
        },
        /**
         * 获取容器的Dom元素
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._container;
        },
        /**
         * 显示气泡
         * @param {Object} option
         * @example
         * option 的默认参数为:
         * {
         *       pointerPosition: 'top right',//箭头的位置
         *       pointerOffset: 20,//箭头在气泡边上的偏移值
         *       pointerSize: [18, 12],//箭头的高度/宽度
         *       position: [0,0],//气泡的位置,直接设置position的时候,不要设置target,否则不起作用
         *       target: null,//{HTMLElement} 气泡所指的dom节点, ps: 如果该属性存在, 则忽略position的设置
         *       targetOffset: [x, y]//气泡位置的便宜, x/y可正负 
         *  };
         *  
         * pointerPosition的值可为
         *  "top left"
         *  "top right"
         *  "bottom left"
         *  "bottom right"
         *  "left top"
         *  "left bottom"
         *  "right top"
         *  "right bottom"
         *  
         *  @description
         *  TODO 后续可添加通过设置targetPosition来直接指定箭头以及气泡的位置
         */
        show: function(option){
            option = option || {};
            var defaultOption = {
                pointerPosition: 'top right',
                pointerOffset: 20,
                pointerSize: [18, 12],
                position: [0, 0],
                target: null,
                targetOffset: [0, 0]
            };
            option = J.extend(defaultOption, option);
            //检查箭头的位置参数是否合法
            if(!this._checkPointerPosition(option.pointerPosition)){
                throw new Error('Bubble >>>> the pointerPosition\'s value is not correct');
            }
            //设置箭头在bubble内的位置
            this._setPointerPosition(option.pointerPosition, option.pointerOffset);
            //设置气泡的位置
            this._setBubblePosition(option);
            
            $D.show(this._container);
        },
        /**
         * 设置气泡的z-index
         * @param {Number} zIndex
         */
        setZIndex: function(zIndex){
            $D.setStyle(this._container, 'zIndex', zIndex);  
        },
        /**
         * 设置气泡外框的样式
         * @param {String} property 属性
         * @param {String} value 值
         */
        setContainerStyle: function(property, value){
            $D.setStyle(this._container, property, value);
        },
        /**
         * 设置标题文字
         * @param {String} text 标题文字
         */
        setTitle: function(text){
            this._title.innerHTML = text;
        },
        /**
         * 设置主题内容
         * @param {String} html 主题内容, 可包含html标签
         */
        setContent: function(html){
            this._content.innerHTML = html;  
        },
        /**
         * 显示一个的按钮
         * @param {String} type 按钮的类型
         * @param {String} text 按钮的文字
         * @param {Boolean} highlight 是否显示高亮的按钮
         */
        showButton: function(type, text, highlight){
            var btn = this['_' + type + 'Btn'];
            highlight = J.isUndefined(highlight) ? false : true;
            if(btn){
                btn.innerHTML = text;
                $D.show(btn);
                if(highlight){
                    $D.addClass(btn, 'bubble_tip_btn_next');
                }else{
                    $D.addClass(btn, 'bubble_tip_btn_ok');
                }
            }
            return btn;
        },
        /**
         * 隐藏按钮
         * @param {String} type 按钮类型
         */
        hideButton: function(type){
            var btn = this['_' + type + 'Btn'];
            if(btn){
                $D.hide(btn);
            }
        },
        /**
         * 隐藏气泡
         */
        hide: function(){
            $D.hide(this._container); 
            if(this.option.closeOnHide){
                this.close();
            }
        },
        /**
         * 关闭并注销气泡
         */
        close: function(){
            if(!this._isClosed){
                this._isClosed = true;
                $E.off(this._closeBtn, 'click');
                $E.off(this._okBtn, 'click');
                $E.off(this._nextBtn, 'click');
                if(this._container.parentNode){
                    this._container.parentNode.removeChild(this._container);
                }
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
            }else{
                J.warn('Trying to close a closed bubbleTip!', 'BubbleTip');
            }
        },
        /**
         * 指示是否已关闭气泡
         */
        isClose: function(){
            return this._isClosed;
        },
        /**
         * 返回一个内部使用的id
         * @private
         * @return {Number} 
         */
        _getId: function(){
            if(!Bubble.__id){
                Bubble.__id = 0;
            }
            return Bubble.__id++;
        },
        /**
         * 设置箭头的指示方向和位置
         * @private
         * @param {String} position 箭头的位置, 由两个单词(top/bottom/left/right中的一个)组成
         * @param {Number} offset 箭头的偏移位置
         * @example
         *  position的值可为
         *  "top left"
         *  "top right"
         *  "bottom left"
         *  "bottom right"
         *  "left top"
         *  "left bottom"
         *  "right top"
         *  "right bottom"
         */
        _setPointerPosition: function(position, offset){
            var posArr = position.split(' ');
            var pointer = this._pointer;
            $D.setClass(pointer, 'bubble_tip_pointer bubble_tip_pointer_' + posArr[0]);
            $D.setCssText(pointer, '');
            $D.setStyle(pointer, posArr[1], offset + 'px');
        },
        /**
         * 设置气泡的位置
         * @private
         * @param {Object} option show 的参数
         */
        _setBubblePosition: function(option){
            var position = option.position;//直接设置position后就不要设置target
            
            if(option.target){
                var posArr = option.pointerPosition.split(' ');
                var posObj = this._calculateBubblePosition(option.target, option.pointerSize, option.pointerOffset);
                var sub = 0;
                if(/top|bottom/.test(posArr[0])){
                    sub = 1;
                }
                position[0] = posObj[posArr[sub] + sub];
                sub = (sub + 1) % 2;
                position[1] = posObj[posArr[sub] + sub];
            }
            var x = position[0] + option.targetOffset[0];
            var y = position[1] + option.targetOffset[1];
            $D.setStyle(this._container, 'left', x + 'px');
            $D.setStyle(this._container, 'top', y + 'px');
        },
        /**
         * 计算气泡的位置
         * @param {HTMLElement} target 箭头所指的dom
         * @param {Array} pointerSize 箭头的大小,[width, height]
         * @param {Number} pointerOffset 箭头的偏移
         * @private
         * @return {Object} 计算得到的结果
         * @example 
         * 返回的结果格式为
         * {
         *       top0: tt + th + ph,
         *       bottom0: tt - bh - ph,
         *       left0: tl + tw + ph,
         *       right0: tl - bw - ph,
         *       
         *       top1: tt + th / 2 - pw,
         *       bottom1: tt + th / 2 - bw + pw,
         *       left1: tl + tw / 2- pw,
         *       right1: tl + tw / 2 - bw + pw
         *   }
         */
        _calculateBubblePosition: function(target, pointerSize, pointerOffset){
            var container = this._container,
                targetPos = $D.getClientXY(target);
            var bw = $D.getOffsetWidth(container), bh = $D.getOffsetHeight(container),
                tw = $D.getWidth(target), th = $D.getHeight(target),
                tl = targetPos[0], tt = targetPos[1],
                pw = pointerOffset + (pointerSize[0] / 2), ph = pointerSize[1];
            return {
                top0: tt + th + ph,
                bottom0: tt - bh - ph,
                left0: tl + tw + ph,
                right0: tl - bw - ph,
                
                top1: tt + th / 2 - pw,
                bottom1: tt + th / 2 - bh + pw,
                left1: tl + tw / 2- pw,
                right1: tl + tw / 2 - bw + pw
            };
        },
        /**
         * 检查箭头的位置参参数是否合法
         * @private
         * @param {String} position 位置参数
         */
        _checkPointerPosition: function(position){
            var posArr = position.split(' ');
            var lrRegex = /left|right/,
                tbRegex = /top|bottom/;
            if(tbRegex.test(posArr[0]) && lrRegex.test(posArr[1])){
                return true;
            }else if(lrRegex.test(posArr[0]) && tbRegex.test(posArr[1])){
                return true;
            }
            return false;
        }
        
    });

});
/* == J.ui.Button =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2010-10-13 ----- */
 
 
 Jx().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
    var _id = 0;
    J.ui = J.ui || {};
    /**
     * 【Button】
     * 
     * @class 
     * @memberOf ui
     * @name Button
     * @constructor
     * @param {Object} option 参数对象
     */
    J.ui.Button = new J.Class(
    /**
     * @lends ui.Button.prototype
     */
    {
        _class: 'ui_button',
        _available: true, // available for user?
        _shownInLogic: false, // should be shown in logic
        _getButtionId: function(){
            return _id++;   
        },
        /**
         * @ignore
         */
        init: function (option){
            option = option || {};
            var context = this;
            var bid = this._getButtionId();
            var buttonOption = {
                appendTo: $D.getDocumentElement(),
                className: '',
                text: '',
                title : ''
            };
            J.extend(buttonOption, option);
            
            this._node = $D.node('a', {
                 'id': 'ui_button_' + bid,
                 'class': this._class + ' ' + $S.encodeScript(buttonOption.className),
                 'title': $S.encodeScript(buttonOption.title),
                 'hidefocus': '',
                 'href': '###'
            });
            this._node.innerHTML = $S.encodeHtml(buttonOption.text);
            buttonOption.appendTo.appendChild(this._node);
            if(buttonOption.event){
                this.attachEvent(buttonOption.event);
            }
            if(buttonOption.isStopPropagation){
                $E.on(this._node,"mousedown",function(e){
                    e.stopPropagation();
                })
                $E.on(this._node,"click",function(e){
                    e.stopPropagation();
                })
                
            }
        },
        /**
         * 自定义事件绑定
         * @param eventObj {Object} 事件对象
         */
        attachEvent : function(eventObj){
            for(var i in eventObj){
                $E.on(this._node, i, eventObj[i]);
            }
        },
        /**
         * 移除自定义事件
         * @param eventObj {Object} 事件对象
         */
        removeEvent : function(eventObj){
            for(var i in eventObj){
                $E.off(this._node, i, eventObj[i]);
            }
        },
        /**
         * 设置按钮是否可用
         * @param {Boolean} val
         */
        setAvailability: function(val){
            // change the availability
            this._available = !!val;

            // show/hide the button by logic
            this._shownInLogic && $D[this._available ? 'show' : 'hide'](this._node);
        },
        /**
         * 隐藏按钮
         */
        hide: function(){
            // shown in logic?
            this._shownInLogic = false;

            // do nothing if it's unavailable
            if (!this._available) {
                return;
            }

            $D.hide(this._node);
            $E.notifyObservers(this, "hide");
        },
        /**
         * 显示按钮
         */
        show: function(){
            // shown in logic?
            this._shownInLogic = true;

            // do nothing if it's unavailable
            if (!this._available) {
                return;
            }

            $D.show(this._node);
            $E.notifyObservers(this, "show");
        },
        /**
         * 设置按钮文本
         * @param {String} text
         */
        setText: function(text){
            this._node.innerHTML = $S.encodeHtml(text);
        },
        /**
         * 设置按钮的title(鼠标移上去的tips)
         * @param {String} title
         */
        setTitle : function(title){
            this._node.title = $S.encodeScript(title);
        },
        /**
         * 获取button dom对象
         * @return {HTMLElement}
         */
        getNode: function(){
            return this._node;
        },
        /**
         * 设置按钮是否禁用
         * @param {Boolean} isDisable
         */
        disable: function(isDisable){
            isDisable = isDisable || false;
            if(isDisable){
                $D.addClass(this._node, 'window_button_disabled');
            }else{
                $D.removeClass(this._node, 'window_button_disabled');
            }
        }
    });
});/* == UI类 PopupBox ========================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * -------------------------------------------- 2010.10.14 ----- */
 
 
Jx().$package(function(J){
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        currentPopupBox = null;
        
    
    J.ui = J.ui || {};
    // PopupBox类
    /**
     * 【Panel】弹出框定义
     * @extends ui.Panel
     * @class 
     * @memberOf ui
     * @name PopupBox
     * @constructor
     * @param option ,{
     *  id,name,container,body,html,
     *  noCatchMouseUp:不捕捉鼠标点击事件,default:false,
     *  noCloseOnEsc:按esc不隐藏,default:false
     * }
     * @since version 1.0
     * 
     */
    var PopupBox = new J.Class({ extend: J.ui.Panel },
    /**
     * @lends ui.PopupBox.prototype
     */
    {
        /***
         * @ignore
         */
        init:function(option){
            this.parentPopupBox = option.parentPopupBox;
            //调用父类的初始化代码
            PopupBox.callSuper(this, 'init',option);
            
            var context = this;
            this.catchMouseUp = true;
            if(option.noCatchMouseUp){
                this.catchMouseUp = false;
            }
            this.closeOnEsc = true;
            if(option.noCloseOnEsc){
                this.closeOnEsc = false;
            }
            this.onDocumentKeydown = function(e){
                if(e.keyCode === 27){
                    // 阻止默认事件,因为像ff下，esc可能会有stop页面的功能
                    e.preventDefault();
                    context.hide();
                }
            };
            this.onMouseUp = function(){
                if(context.isShow()){
                    context.hide();
                }
            };
            this.onDocumentClick = function(){
                context.hide();
            };
            this.onWindowResize = function(){
                context.hide();
            };
            
        },
        /**
         * 显示弹出框
         */
        show : function(){
                
            if(currentPopupBox){
                if(this.parentPopupBox == currentPopupBox){
                    
                }else{
                    currentPopupBox.hide();
                }
            }
            if(this.catchMouseUp){
                $E.on(document.body, "mouseup", this.onMouseUp);
            }else{//没有off的必要,因为mouseup事件只在catchMouseUp为true时才注册
//              $E.off(document, "mouseup", this.onMouseUp);
            }
            
            if(this.closeOnEsc){
                $E.on(document, "keydown", this.onDocumentKeydown);
            }else{
//              $E.off(document, "keydown", this.onDocumentKeydown);
            }
            $E.on(document.body, "click", this.onDocumentClick);
            $E.on(window, "resize", this.onWindowResize);
            if(!this.parentPopupBox){//如果不是子popupbox, 才赋值
                currentPopupBox = this;
            }
            PopupBox.callSuper(this, 'show');

        },
        /**
         * 隐藏弹出框
         */
        hide : function(){
            $E.off(document.body, "click", this.onDocumentClick);
            $E.off(document, "keydown", this.onDocumentKeydown);
            $E.off(window, "resize", this.onWindowResize);
            $E.off(document.body, "mouseup", this.onMouseUp);
            if(currentPopupBox){
                if(this.parentPopupBox){
                    //有parent,说明是子popupbox, 不做处理
                }else{
                    if(currentPopupBox !== this ){
                        currentPopupBox.hide();
                    }
                    currentPopupBox = null;
                }
            }
            PopupBox.callSuper(this, 'hide');
        },
        /**
         * 销毁
         */
        destroy: function(){
            this.container.parentNode.removeChild(this.container);  
        }
    });
    J.ui.PopupBox = PopupBox;
    
});

/* == J.ui.ContextMenu =============================================
 * Copyright (c) 2011, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-1-18 ----- */
 
 
 Jet().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
    
    var startId = 0,
        topZIndex = 9000000;
    
    var flashItemId = 0;
    var contextHash = {};
    var flashItemHash = {};
    
    var onSelfContextMenu = function(e){
        e.preventDefault();
        e.stopPropagation();
    };
    var stopPropagation = function(e){
        e.stopPropagation();
    };
    J.ui = J.ui || {};
    
    /**
     * 【ContextMenu】
     * 
     * @memberOf ui
     * @name ContextMenu
     * @class
     * @constructor
     * @param {Object} option 构造参数
     * {
     * id: '',//random
     * name: id,
     * container: document.body,
     * className: '' ,
     * width: null,
     * triggerEvent: 'contextmenu',
     * triggers: null,//HTMLElement数组 ,触发右键菜单的dom
     * items: []
     * }
     * 
     * @since version 1.0
     * @description
     * triggers 参数是指触发右键菜单显示的dom,
     * 右击该节点就显示菜单
     * 也可以不使用这个属性, 调用的地方自己控制显示隐藏菜单
     */
    var ContextMenu = J.ui.ContextMenu = new J.Class(
    /**
     * @lends ui.ContextMenu.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            var context = this;
            var id = this.id = 'context_menu_' + (option.id || (startId++));
            var name = option.name || id;
            var parent = this._parent = option.container || (option.parentMenu ? option.parentMenu._parent : null) || document.body;
            var className = option.className || '';
            this.parentMenu = option.parentMenu;
            var context = this;
            var container = this._el = $D.id(id) || $D.node('div', {
                id: id,
                'class': 'context_menu',
                style: 'display: none;'
            });
            var html = '<div class="context_menu_container "' + className + '"><ul id="'+ id +'_body" class="context_menu_item_list"></ul></div>';
//                html += '<div class="context_menu_outer_r"></div><div class="context_menu_outer_b"></div>'
//                + '<div class="context_menu_outer_rt"></div><div class="context_menu_outer_rb"></div><div class="context_menu_outer_lb"></div>';
            
            if(J.browser.ie){//遮ie的flash
                html += '<iframe class="context_menu_iframe" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';
            }
            container.innerHTML = html;
            parent.appendChild(container);
            
            if(option.width){
                $D.setStyle(container, 'width', option.width + 'px');
            }
            this._body = $D.id(id + '_body');
            $E.off(container, 'contextmenu');//防止绑定多个事件
            $E.on(container, 'contextmenu', onSelfContextMenu);
            $E.addObserver(document, 'beforeStart', function(){
                if(context.isShow()){
                    context.hide();
                }
            });
            this._popupBox = new J.ui.PopupBox({
                id: id,
                name: name,
                noCatchMouseUp: true,
                parentPopupBox: this.parentMenu ? this.parentMenu._popupBox : null,
                container: container
            });
            $E.addObserver(this._popupBox, 'hide', function(){
                context.hideSubmenu();
                $E.notifyObservers(context, 'onHide');
            });
            
            this.setZIndex(topZIndex);
            this._itemArr = [];
            this._key2Item = {};
            if(option.items){
                this._items_config= option.items;
                this.addItems(option.items);
            }
            if(option.triggers){
                var evnet = option.triggerEvent || 'contextmenu';
                /**
                 * @ignore
                 */
                var onTriggerContextMenu = function(e){
                    e.preventDefault();
                    context.show(e.clientX, e.clientY);
                };
                for(var i = 0, t; t = option.triggers[i]; i++){
//                    $E.off(t, 'contextmenu');//这里没必要
                    $E.on(t, evnet, onTriggerContextMenu);
                }
            }
            if(option.beforeShow){
                $E.addObserver(this, 'BeforeShow', option.beforeShow);
            }
            contextHash[id] = this;
        },
        /**
         * 获取改菜单的id
         */
        getId: function(){
            return this.id;
        },
        /**
         * 设置菜单的css类
         */
        setClass: function(className){
            $D.setClass(this._el, 'context_menu ' + className);
        },
        /**
         * 添加菜单项
         * @param {Object} option 
         * {<br/>
         *  title: 鼠标tips<br/>
            text: 菜单项的文字<br/>
            link: 指向链接<br/>
            icon: 图标的配置{ url, style, className }<br/>
            enable: 是否启用<br/>
            onClick: 点击处理函数<br/>
            argument: 点击处理函数接收的额外参数<br/>
         * }
         */
        addItem: function(option){
            var type = option.type || 'item';
            var item;
            option.parentMenu = this;
            switch(type){
            case 'item': 
                item = new ContextMenuItem(option);
                break;
            case 'flash': 
                item = new FlashContextMenuItem(option);
                break;
            case 'separator':
                item = new ContextMenuSeparator(option);
                break;
            case 'submenu':
                option.parentMenu = this;
                item = new ContextSubmenuItem(option);
                break;
            default:
                item = null;
                break;
            }
            if(item){
                this._body.appendChild(item.getElement());
                this._itemArr.push(item);
            }
        },
        /**
         * 批量添加菜单项
         * @param {Array} optionArray
         * @see ui.ContextMenu#addItem
         */
        addItems: function(optionArray){
            for(var i = 0, len = optionArray.length; i < len; i++){
                this.addItem(optionArray[i]);
            }
        },
        /**
         * 刷新, 重回菜单
         */
        refresh: function() {
            if(this._items_config) {
                this.clearItems();
                this.addItems(this._items_config);
            }
        },
        /**
         * 清空所有菜单项
         */
        clearItems: function(){
            var item = this._itemArr.shift();
            while(item){
                this._body.removeChild(item.getElement());
                item.destory();
                item = this._itemArr.shift();
            }
        },
        /**
         * 移除指定下标的菜单项
         * @param {Number} index
         */
        removeItemAt: function(index) {
            for(var i=0; i< this._itemArr.length;i++) {
                var item= this._itemArr[i];
                if(index==i && item) {
                    this._body.removeChild(item.getElement());
                    item.destory();
                    this._itemArr.splice(i,1);
                }
            }
        },
        /**
         * 获取指定下标的菜单项
         * @param {Number} index
         * @return {ContextMenuItem}, {ContextSubmenuItem}, {ContextMenuSeparator}
         */
        getItemAt: function(index){
            if(index < this._itemArr.length){
                if(index < 0){
                    index = this._itemArr.length + index;
                }
                return this._itemArr[index];
            }else{
                return null;
            }
        },
        /**
         * 获取菜单本身的dom
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 获取菜单主体的dom
         * @return {HTMLElement}
         */
        getBody: function(){
            return this._body;
        },
        /**
         * 设置菜单的层级
         * @param {Number} zIndex
         * 
         */
        setZIndex: function(zIndex){
            this._popupBox.setZIndex(zIndex);
        },
        /**
         * 获取菜单的层级
         * @return {Number}
         */
        getZIndex: function(zIndex){
            return this._popupBox.getZIndex();  
        },
        /**
         * 这两个方法可以用来保存临时数据,
         * show之前保存, 供给item的回调使用
         * @param {Object} arg
         */
        setArgument: function(arg){
            this._argument = arg;
        },
        /**
         * @return {Object}
         */
        getArgument: function(){
            return this._argument;
        },
        /**
         * 显示菜单
         * @param {Number} x
         * @param {Number} y
         * @param {Number} offset 菜单位置相对于给定xy的偏移, 0为不偏移
         * @param {HTMLElement} relativeEl 相对某一元素定位
         */
        show: function(x, y, offset, relativeEl){
            $E.notifyObservers(this, 'BeforeShow', this);
            var x = x || 0,
                y = y || 0,
                offset = typeof(offset) === 'undefined' ? 5 : offset;
            var popup = this._popupBox;
            var px = x + offset,
                py = y + offset;
            var rw = 0, rh = 0, ie = J.browser.ie;
            if(relativeEl){
                rw = $D.getOffsetWidth(relativeEl);
                rh = $D.getOffsetHeight(relativeEl);
                px += rw + 5;
                py -= 1;
                if(ie == 9 || ie == 8){
                    px += 2;
                }
            }
            popup.setX('-10000');
            popup.show();
            var w = $D.getClientWidth(this._el),
                h = $D.getClientHeight(this._el),
                bodyWidth = $D.getClientWidth(),
                bodyHeight = $D.getClientHeight();
            if(px + w > bodyWidth && x - w - offset > 0){
                if(rw){
                    px = x - w - offset - 5;
                    if(ie == 9 || ie == 8){
                        px += 2;
                    }
                }else{
                    px = x - w - offset;
                }
            }
            if(py + h > bodyHeight && y - h - offset > 0){
                if(rh){
                    py = y - h - offset + rh + 1;
                }else{
                    py = y - h - offset;
                }
            }
            popup.setXY(px, py);
            $E.notifyObservers(this, 'onShow', this);
        },
        /**
         * 隐藏菜单
         */
        hide: function(){
            this._popupBox.hide();
            $E.notifyObservers(this, 'onHide', this);
        },
        /**
         * 隐藏所有子菜单
         */
        hideSubmenu: function(){
            for(var i in this._itemArr){
                if(this._itemArr[i].getSubmenu){
                    this._itemArr[i].getSubmenu().hide();
                }
            }
        },
        /**
         * 指示菜单是否显示
         * @return {Boolean}
         */
        isShow: function(){
            return this._popupBox.isShow();
        },
        /**
         * 销毁菜单
         */
        destory: function(){
            this._el.innerHTML = '';
            $E.off(this._el, 'contextmenu');
            this.clearItems();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
        
    });
    
    /**
     * 获取给定id的菜单, 无则返回null
     * @static
     * @function
     * @memberOf ui.ContextMenu
     * @name getMenu
     * @return {ui.ContextMenu},{Null}
     */
    ContextMenu.getMenu = function(id){
        return contextHash[id];
    };
    
    /**
     * 【ContextMenuItem】菜单项
     * @see ui.ContextMenu
     * 
     * @class 
     * @name ContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     * {
     * title: text,
     * text: '',
     * link: 'javascript:void(0);',
     * icon: null,
     * onClick: null 
     * }
     * icon 为object, 包括{url,className,style}其中一个
     * onClick的回调参数为event, contextMenuItem
     * @example 
     *  //item instanceOf ContextMenuItem
     * var onClick = function(event, item){
     * }
     * 
     * @since version 1.0
     * @description
     */
    var ContextMenuItem = J.ui.ContextMenuItem = new J.Class(
    /**
     * @lends ui.ContextMenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (opt){
            var option = {
                title: opt.title || opt.text || '',
                text: opt.text || '',
                link: opt.link || 'javascript:void(0);',
                icon: opt.icon || null,
                enable: typeof(opt.enable)==='undefined' ? true : opt.enable,
                onClick: opt.onClick || null,
                argument: opt.argument
            };
            
            this.option = option;
            this.parentMenu = opt.parentMenu;
            
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            this.render();
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var onClickFunc, context = this;
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context, context.parentMenu);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                }
            }
            $E.on(liNode, 'click', onClickFunc);
        },
        /**
         * 设置菜单项的文本
         * @param {Object} text
         */
        setText: function(text, title){
            this.option.text = text;
            this.option.title = title || text;
            this.render();
        },
        /**
         * 设置菜单项的图标
         * @param {Object} icon
         *  { style, url, className }
         */
        setIcon: function(icon){
            this.option.icon = icon;
            this.render();
        },
        /**
         * 绘制菜单项的内容
         */
        render: function(){
            var option = this.option;
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<span class="context_menu_item_text">' + option.text + '</span>';

            html += '</a>';
            this._el.innerHTML = html;
        },
        /**
         * 获取菜单项的dom
         * @return {HTMLElement} 
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示该菜单项
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏该菜单项
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 禁用菜单项
         */
        disable: function(){
            this._isEnable = false;
            $D.addClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 启用菜单项
         */
        enable: function(){
            this._isEnable = true;
            $D.removeClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 销毁该菜单项
         */
        destory: function(){
            this._el.innerHTML = '';
            $E.off(this._el, 'click');
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    
    /**
     * 【FlashContextMenuItem】flash 菜单项,用于需要用到flash的时候,
     * 例如需要在右键菜单放置flash上传控件的时候
     * @see ui.ContextMenu
     * 
     * @class 
     * @name FlashContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     */
    var FlashContextMenuItem = J.ui.FlashContextMenuItem = new J.Class(
    /**
     * @lends ui.FlashContextMenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (opt){
            //TODO hard code flash上传按钮环境
            var option = {
                title: opt.title || opt.text || '',
                text: opt.text || '',
                link: opt.link || 'javascript:void(0);',
                icon: opt.icon || null,
                enable: typeof(opt.enable)==='undefined' ? true : opt.enable,
                onClick: opt.onClick || null,
                folderId: opt.folderId || -1, //右键所属的文件夹：特殊id desktop:-1,explorer:-2
                argument: opt.argument
            };
            
            this.option = option;
            this.parentMenu = opt.parentMenu;
            
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
                
            var flashLiNode = this._flashLi = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            
            var itemId = this._itemId = 'context_menu_flashItem_' + (++flashItemId);
            var flashUlNode = this._flashUl = $D.node('ul', {
                'id': itemId,
                'class': 'context_menu_item_list context_menu_flashitem_item'
            });
            flashItemHash[flashItemId] = flashUlNode;
            flashUlNode.appendChild(flashLiNode);
            this.render();
            document.body.appendChild(flashUlNode);
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var onClickFunc, context = this;
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context, context.parentMenu);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                }
            }
            $E.on(liNode, 'click', onClickFunc);
            
            var context = this;
            var observer = {
                /**
                 * @ignore
                 */
                onShow: function(opt){
                    var xy = $D.getClientXY(context._el);
                    var offsetX = 0,
                        offsetY = 0;
                    if(J.browser.ie){
                        offsetX = 2;
                        offsetY = 2;
                        if(J.browser.ie == 6 || J.browser.ie == 7){
                            offsetY = 1;
                        }
                    }
                    $D.setXY(context._flashUl, xy[0] + offsetX + 'px', xy[1] + offsetY + 'px');
                    $D.setStyle(context._flashUl, 'width', $D.getClientWidth(context._el) + 'px');
                    $D.setStyle(context._flashUl, 'height', $D.getClientHeight(context._el) + 'px');
                    $D.setStyle(context._flashUl, 'zIndex', context.parentMenu.getZIndex() + 1);
                    if(alloy.portal.getLoginLevel() > 1 && alloy.storage.getDefaultDisk()){
                        context._flashUploader.showFileSelector();
                    }else{
                        context._flashUploader.hideFileSelector();
                    }
                },
                /**
                 * @ignore
                 */
                onHide: function(opt){
                    $D.setXY(context._flashUl, 0, 0);
                    $D.setStyle(context._flashUl, 'width', '1px');
                    $D.setStyle(context._flashUl, 'height', '1px');
                }
            };
            $E.addObserver(this.parentMenu, 'onShow', observer.onShow);
            $E.addObserver(this.parentMenu, 'onHide', observer.onHide);
        },
        /**
         * 未实现
         */
        setText: function(text, title){
        },
        /**
         * 未实现
         */
        setIcon: function(icon){
        },
        /**
         * 绘制菜单项
         */
        render: function(){
            var option = this.option;
            var elHtml = '<a class="context_menu_item" href="' + option.link + '"></a>';
            this._el.innerHTML = elHtml;
            
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<div class="explorer_upload_holder2" style="padding:0 5px"></div>';
            html += '</a>';
            this._flashLi.innerHTML = html;
            
            var holder = $D.mini('.explorer_upload_holder2', this._flashLi)[0];
            var opt = {
                callback:'alloy.flashUploadManager.flashEventListener',
                mode: 0,
                autoshow: false,
                holder: holder,
                text: '<span class="context_menu_item_text">' + option.text + '</span>',
                width: '100%',
                height: '100%',
                extInfo: '{"folderId":'+ this.option.folderId +'}'
            }
            this._flashUploader = new alloy.flashUploadManager.FlashUploader(opt);
            
            $D.setXY(this._flashUl, 0, 0);
            $D.setStyle(this._flashUl, 'width', '1px');
            $D.setStyle(this._flashUl, 'height', '1px');
        },
        /**
         * 获取菜单项的dom
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 禁用
         */
        disable: function(){
            this._isEnable = false;
            $D.addClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 启用
         */
        enable: function(){
            this._isEnable = true;
            $D.removeClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 销毁
         */
        destory: function(){
            this._el.innerHTML = '';
            this._flashUl.innerHTML = '';
            document.body.removeChild(this._flashUl);
            $E.off(this._el, 'click');
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    
    /**
     * @static
     * @function
     * @name getItem
     * @memberOf ui.FlashContextMenuItem
     * @return {HTMLElement},{Null}
     */
    FlashContextMenuItem.getItem = function(id){
        return flashItemHash[id];
    };
    
    /**
     * 【ContextMenuSeparator】菜单项分隔符
     * @see ui.ContextMenu
     * 
     * @class 
     * @name ContextMenuSeparator
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     */
    var ContextMenuSeparator = J.ui.ContextMenuSeparator = new J.Class(
    /**
     * @lends ui.ContextMenuSeparator.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            var html = '<span class="context_menu_separator"></span>';
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_separator_container'
            });
            liNode.innerHTML = html;
        },
        /**
         * 获取分隔符的dom
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 销毁
         */
        destory: function(){
            this._el.innerHTML = '';
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    /**
     * 【ContextSubmenuItem】子菜单项, 关联着一个子菜单
     * 
     * @class 
     * @name ContextSubmenuItem
     * @extends  ui.ContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     * {
     * title: text,
     * text: '',
     * link: 'javascript:void(0);',
     * icon: null,
     * items: null,//子菜单的菜单项, 必选项
     * subWidth: null,//子菜单的宽
     * subContainer: null //子菜单的容器
     * }
     * icon 为object, 包括{url,className,style}其中一个
     * 
     * @since version 1.0
     * @description
     */
    var ContextSubmenuItem = J.ui.ContextSubmenuItem = new J.Class({extend: ContextMenuItem}, 
    /**
     * @lends ui.ContextSubmenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            if(!option.items){
                throw new Error('J.ui.ContextSubmenuItem: option.items is null!');
            }
            option.title = option.title || option.text || '';
            var defaultOption = {
                title: null,
                text: '',
                autoHide: true,
                link: 'javascript:void(0);',
                icon: null,
                enable: true,
                subWidth: null,
                parentMenu: option.parentMenu
            };
            delete option.parentMenu;//不删除的话, extend会导致parentMenu指针不对
            option = this.option = J.extend(defaultOption, option);
            this.parentMenu = option.parentMenu;
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            this.render();
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var subOption = {
                parentMenu: option.parentMenu,
                width: option.subWidth,
                beforeShow: option.beforeShow,
                items: option.items
            };
            this._submenu = new ContextMenu(subOption);
                
            var onClickFunc, context = this;
            
            var submenuTimer = context.sunmenuTimer = 0, submenuHideTimeout = 200;
            /**
             * @ignore
             */
            var hideSubmenu = function(){
                if(context._submenu.isShow()){
                    context._submenu.hide();
                }
            };
            var observer = {
                /** @ignore */
                onItemMouseenter: function(e){
                    e.stopPropagation();
                    if(context._isEnable){
                        var xy = $D.getClientXY(this);
                        context._submenu.setZIndex(context.parentMenu.getZIndex());
                        context._submenu.show(xy[0], xy[1], 0, this);
                    }
                },
                /** @ignore */
                onItemMouseleave: function(e){
                    if(submenuTimer){
                        window.clearTimeout(submenuTimer);
                        submenuTimer = 0;
                    }
                    submenuTimer = window.setTimeout(hideSubmenu, submenuHideTimeout);
                },
                /** @ignore */
                onSubmenuMouseenter: function(e){
                    if(submenuTimer){
                        window.clearTimeout(submenuTimer);
                        submenuTimer = 0;
                    }
                    $D.addClass(liNode, 'context_menu_item_hover');
                },
                /** @ignore */
                onSubmenuMouseleave: function(e){
                    observer.onItemMouseleave(e);
                    //$D.removeClass(liNode, 'context_menu_item_hover');
                },
                /** @ignore */
                onSubmenuShow: function(){
                    $D.addClass(liNode, 'context_menu_item_hover'); 
                },
                /** @ignore */
                onSubmenuHide: function(){
                    $D.removeClass(liNode, 'context_menu_item_hover');
                }
            };
            
            var submenuEl = context._submenu.getElement();
            $E.on(liNode, 'mouseenter', observer.onItemMouseenter);
            if(option.autoHide){
                $E.on(liNode, 'mouseleave', observer.onItemMouseleave);
                $E.on(submenuEl, 'mouseenter', observer.onSubmenuMouseenter);
                $E.on(submenuEl, 'mouseleave', observer.onSubmenuMouseleave);
            }
            //$E.addObserver(context._submenu, 'onShow', observer.onSubmenuShow);
            $E.addObserver(context._submenu, 'onHide', observer.onSubmenuHide);
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context);
                        observer.onItemMouseenter.call(this, e);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    observer.onItemMouseenter.call(this, e);
                }
            }
            $E.on(liNode, 'click', onClickFunc);
        },
        /**
         * 获取该菜单项关联的子菜单
         */
        getSubmenu: function(){
            return this._submenu;
        },
        /**
         * 绘制菜单项的内容
         */
        render: function(){
            var option = this.option;
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<span class="context_menu_item_text">' + option.text + '</span><span class="context_menu_item_subicon"></span></a>';
            this._el.innerHTML = html;
        }
    });
});/* == J.ui.DivSelect =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-3-14 ----- */
 
Jet().$package(function (J) {
    var packageContext = this,
        $D = J.dom,
        $S = J.string,
        $E = J.event;
    J.ui = J.ui || {};
    /*
       * div模式select相关，可以移植到其他地方 示例： html:<div id="testdiv"></div> js:
       * divSelect.show("testdiv","test",selOptions,"",160,"test()");
       * 
       */
    /**
     * 
     * div模拟的下拉框, 直接 new一个实例即可
     * 
     * @memberOf ui
     * @name DivSelect
     * @class
     * @constructor
     * @param {String} objId 容器
     * @param {String} selectName 名称
     * @param {Object} dataObj 数据[数组]
     * @param {Object} selOption 默认项
     * @param {Number} width 宽度
     * @param {Boolean} isUpper
     * 
     * @example
     * html: &lt;div id="testdiv"&gt;&lt/div&gt; 
     * js: new DivSelect("testdiv","test",selOptions,"",160);
     * 
     */
     var DivSelect = J.ui.DivSelect = new J.Class(

     {
        /*
         * 主调函数 参数含义：容器，名称，数据[数组]，默认项，宽度 注意：数据格式
         */
        /** @ignore */
        init : function(objId, selectName, dataObj, selOption, width, isUpper) {

          this._selectName = selectName;
          this._dataObj = dataObj;
          this._selOption = selOption;
          this._isUpper = isUpper || false;

          // _divSelect = divSelect; ;
          var data = dataObj.data;
          var _Obj = document.getElementById(objId);
          if (!_Obj || typeof(_Obj) === "undefined") {
            return false;
          }
          var s1 = document.createElement("div");
          if (isNaN(width) || width == "") {
            width = 150;
          } else if (width < 26) {
            width = 26;
          }
          s1.style.width = width;
          var top = ""
          if(this._isUpper){
              s1.style.position = "relative";
              var height = (15*(data.length)); //每个item 15px
              top = "top:-"+((height>150?150:height)+4)+"px;";
          }

          var str = "";
          /*
           * //判断是否有数据
           */
          // 判断是否有数据
          if (data.length > 0) {
            // 有数据时显示数据选项列表
            str += "<input type='hidden' name='" + selectName
                + "' id='" + selectName + "' value='"
                + this.relv(selOption, data) + "'>";
            str += "<div id='_a_" + selectName + "' style='width:"
                + width
                + "px;height:18px; border:1px #728EA4 solid;'>";

            str += "<div id='_v_"
                + selectName
                + "' style='position:relative;float:left;left:2px;width:"
                + (width - 22)
                + "px;height:18px;font-size:12px;overflow:hidden;line-height:18px;'>"
                + this.reStr(data, selOption) + "</div>";
            str += "<div id='_arr_"
                + selectName
                + "' class='divSelect_arr' style='position:relative;float:right;right:0px;width:18px;height:18px;text-align:center;font-family:Webdings;font-size:16px;overflow:hidden;background-color:#FFF;cursor:pointer!important;cursor:hand;'></div>";
            str += "</div>";
            str += "<div id='_b_"
                + selectName
                + "' style='position:absolute; background-color:#FFFFFF; width:"
                + width
                + "px; height:"
                + this.height(data.length)
                + "px;border:1px #728EA4 solid;overflow-x:hidden;overflow-y:auto;display:none; z-index:99999;" + top + "'>";
            for (var i = 0; i < data.length; i++) {
              var style = data[i][0] == selOption
                  ? this.style(2)
                  : this.style(1);
              str += "<div id='_s_" + selectName + i
                  + "' style='" + style + "' >" + data[i][1]
                  + "</div>";
            }
            str += "</div>";
          } else {
            // 没有数据时显示一个空窗体
            str += "<input type='hidden' name='" + selectName
                + "' id='" + selectName + "' value='"
                + selOption + "'>";
            str += "<div id='_a_" + selectName + "' style='width:"
                + width
                + "px;height:18px; border:1px #728EA4 solid;'>";
            str += "<div id='_v_"
                + selectName
                + "' style='position:relative;float:left;left:2px;width:"
                + (width - 22)
                + "px;height:18px;font-size:12px;overflow:hidden;line-height:18px;'></div>";
            str += "<div id='_arr_"
                + selectName
                + "' class='divSelect_arr' style='position:relative;float:right;right:0px;width:18px;height:18px;text-align:center;font-family:Webdings;font-size:16px;overflow:hidden;background-color:#FFF;cursor:pointer!important;cursor:hand;'></div>";
            str += "</div>";
            str += "<div id='_b_"
                + selectName
                + "' style='position:absolute; background-color:#FFFFFF; width:"
                + width
                + "px; height:"
                + this.height(0)
                + "px;border:1px #728EA4 solid;overflow-x:hidden;overflow-y:auto;display:none; z-index:99999;'></div>";
          }

          s1.innerHTML = str;
          _Obj.appendChild(s1);

          var divSelectObj = this;

          var clickShowOption = function() {
            divSelectObj.showOptions();
          }

          $E.on($D.id('_v_' + selectName), "click", clickShowOption);
          $E.on($D.id('_arr_' + selectName), "click",
                  clickShowOption);
          if (data.length > 0) {
            var optionOver = function() {
              divSelectObj.css(this, 3);
            };
            var optionOut = function() {
              divSelectObj.css(this, 1);
            };
            var optionClick = function() {
              divSelectObj.selected(this);
            };
            for (var i = 0; i < data.length; i++) {
              $E.on($D.id('_s_' + selectName + i), "mouseover",
                  optionOver);
              $E.on($D.id('_s_' + selectName + i), "mouseout",
                  optionOut);
              $E.on($D.id('_s_' + selectName + i), "click",
                  optionClick);
            }

          }
        },
        /*
         * clickShowOption : function(){ divSelectObj.showOptions(); },
         */
        /**
         * 返回选定项的值
         * @param {String} n id
         * @return {String}
         */
        value : function(n) {
          n = n || this._selectName;
          return document.getElementById(n).value;
        },
        /**
         * 返回选定项的文本
         * @param {String} n id
         * @return {String}
         */
        text : function(n) {
          n = n || this._selectName;
          return document.getElementById("_v_" + n).innerHTML;
        },
        /**
         * 选中给节点
         * @param {HTMLElement} optionObj 
         */
        selected : function(optionObj) {
          var data = this._dataObj.data;
          var value = optionObj.innerHTML;
          for (var i = 0; i < data.length; i++) {
            if (data[i][1] === value) {
              $D.id(this._selectName).value = data[i][0];
            }
            $D.id('_s_' + this._selectName + i).style.cssText = this.style(1);
          }

          $D.id("_v_" + this._selectName).innerHTML = value;

          optionObj.style.cssText = this.style(2);
          this.hidden();
          $E.notifyObservers(this, "selectedChanged");
        },
        relv : function(v, d) {
          for (var i = 0; i < d.length; i++) {
            if (d[i][0] == v) {
              return v;
            }
          }
          if (v == null || v == "") {
            return d[0][0];
          }
        },
        reStr : function(d, m) {
          for (var i = 0; i < d.length; i++) {
            if (d[i][0] == m) {
              return d[i][1];
            }
          }
          if (m == null || m == "") {
            return d[0][1];
          }
        },
        /**
         * 获取列表的高度
         * @return {Number}
         */
        height : function(l) {
          var h;
          if (l > 10 || l < 1)
            h = 10 * 15;
          else
            h = l * 15;
          h += 2;
          return h;
        },
        showOptions : function(n) {
          n = n || this._selectName;
          var o = document.getElementById("_b_" + n)
          if (o.style.display == "none")
            o.style.display = "";
          else
            o.style.display = "none";

        },
        hidden : function() {
          document.getElementById("_b_" + this._selectName).style.display = "none";
        },
        style : function(m) {
          var cs = "";
          switch (m) {
            case 1 :
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#FFFFFF; color:#000000; font-weight:normal;";
              break;
            case 2 :
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#315DAD; color:#FFFFFF; font-weight:bold;";
              break;
            case 3 : //mouseover
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#D8D8D8; color:#000000; font-weight:normal;";
              break;
          }
          return cs;
        },
        css : function(optionObj, type) {
          if (type === 1) {
            if ($D.id("_v_" + this._selectName).innerHTML != optionObj.innerHTML) {
              optionObj.style.cssText = this.style(type);
            }
          } else {
            if ($D.id("_v_" + this._selectName).innerHTML != optionObj.innerHTML) {
              optionObj.style.cssText = this.style(type);
            }
          }
        }
      });
      
});
    
    Jx().$package(function(J){
    var $D = J.dom,
        $E = J.event;
    
    /**
     * iPad滚动模拟
     * 
     * @memberOf ui
     * @class
     * @name IframeScroller
     * @constructor
     * 
     * @param {HTMLElement} iframe
     * 
     */
    var IframeScroller = function(iframe){
        this.container=iframe.parentNode;
        if(J.platform.iPad && J.platform.iPad.split(".")[0]>=4) {
            this.container=iframe.parentNode.parentNode;
        }
        //console.info("container width:"+$D.getWidth(this.container));
        this.iframe=iframe;
        this.holding=false;
        this.posx=0;
        this.posy=0;
        this.offsetX=0;
        this.offsetY=0;
        var context = this;
        /** @ignore */
        this.observers={
            /** @ignore */
            onTouchStart:function(e){
                var touch = e.changedTouches[0];
                context.posx = touch.pageX;
                context.posy = touch.pageY;
                //console.info("iframe height: "+ $D.getHeight(context.iframe));
                context.minX = $D.getWidth(context.container) - $D.getWidth(context.iframe);
                context.minY = $D.getHeight(context.container) - $D.getHeight(context.iframe);
                
                //console.info("minx:"+context.minX+",miny:"+context.minY);
                
                $E.on(context.iframe,"touchmove",context.observers.onTouchMove);
                $E.on(context.iframe,"touchend",context.observers.onTouchEnd);
            },
            /** @ignore */
            onTouchMove:function(e){
                if(e.changedTouches.length>1)return;
                e.preventDefault();
                e.stopPropagation();
                var touch = e.changedTouches[0];
                var posx = touch.pageX;
                var posy = touch.pageY;
                var dx = context.posx - posx;
                var dy = context.posy - posy;               
                
                var newpx = context.offsetX - dx;
                var newpy = context.offsetY - dy;
                
                //console.info("iframe touch move:"+newpx+","+newpy);
                
                if(newpx > 0) newpx = 0;
                else if(newpx < context.minX) newpx = context.minX;
                if(newpy > 0) newpy = 0;
                else if(newpy < context.minY) newpy = context.minY;
                
                //console.info("apple sucks: "+newpy);
                //console.info("iframe touch move:"+newpx+","+newpy);
                
                iframe.style['left'] = newpx + 'px';
                iframe.style['top'] = newpy + 'px';
                
            
                context.offsetX = newpx;
                context.offsetY = newpy;
                context.posx = posx;
                context.posy = posy;
            },
            /** @ignore */
            onTouchEnd:function(){
                $E.off(context.iframe,"touchmove",context.observers.onTouchMove);
                $E.off(context.iframe,"touchend",context.observers.onTouchEnd);
            }
        };
        /**
         * 销毁
         * @name destroy
         * @function
         * @memberOf ui.IframeScroller.prototype
         */
        this.destroy=function(){
            $E.off(this.iframe,"touchstart",this.observers.onTouchStart);   
            $E.off(this.iframe,"touchmove",this.observers.onTouchMove);
            $E.off(this.iframe,"touchend",this.observers.onTouchEnd);
            this.iframe=null;
            this.container=null;
        }
        $E.on(this.iframe,"touchstart",this.observers.onTouchStart);            
    }
    J.ui = J.ui || {};
    J.ui.IframeScroller = IframeScroller;
});
/* == jx.ui.loading =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-5-31 ----- */
 
Jx().$package(function (J) {
     var $D = J.dom,
         $E = J.event;
     
     // Loading类
    /**
     * 【Loading】
     * 
     * @class 
     * @memberOf ui
     * @name Loading
     * @constructor
     * 
     * @param {Element} el 需要生成Loading的DOM节点
     * @since version 1.0
     * @description Jx.ui.Loading是一个加载条组件，当页面的某个区域需要较长的加载时间时，可以使用这个组件显示一个加载条，达到较好的用户体验效果。
     */
     var Loading = new J.Class(
     /**
     * @lends ui.Loading.prototype
     */ 
     {
        /**
        * @private
        * @param {Element} el 需要生成Loading的DOM节点
        * @return
        */
        init: function(el){
            this.el = el;
            this.parentEl = el.parentNode;
            this.loadingContainer = $D.node('div',{
                'class': 'loading_container'
            });
            this.loadingContainer.innerHTML =  '<div class="loading_img" id ="loading_img"></div>';
            this.parentEl.appendChild(this.loadingContainer);
            this.loadingImg = $D.id('loading_img');
            
            var w = $D.getClientWidth(this.el),
                h = $D.getClientHeight(this.el);
            
            $D.setStyle(this.loadingContainer, 'width', w + 'px');
            $D.setStyle(this.loadingContainer, 'height', h + 'px');
            this.setCenter(this.loadingImg, this.loadingContainer);
        },
        /**
        * @private
        * 居中
        * @param {Element} el 需要居中DOM节点
        * @param {Element} parentEl el居中相对节点
        * @return
        */
        setCenter: function(el, parentEl){
//          var w=el.offsetWidth,
//              h=el.offsetHeight,
//              pt=parentEl.scrollTop,
//              pl=parentEl.scrollLeft,
//              pw=parentEl.offsetWidth,
//              ph=parentEl.offsetHeight;
//      
//          $D.setStyle(el,'left',(pw-w)/2+pl+'px');
//          $D.setStyle(el,'top',(ph-h)/2+pt+'px');
//          $D.setStyle(el,'position','absolute');
            var w = $D.getClientWidth(parentEl),
                h = $D.getClientHeight(parentEl),
                ew = $D.getClientWidth(el),
                eh = $D.getClientHeight(el);
            var l = (w > ew) ? (w - ew) / 2 : 0;
            var t = (h > eh) ? (h - eh) / 2 : 0;
            $D.setStyle(el, 'position', 'relative');
            $D.setXY(el, l, t);
        },
        
        /**
        * @private
        * 定位
        * @param 
        * @return
        */
        setXY: function(x, y){
            //TODO
        },
        
        /**
        * 显示loading
        * @param 
        * @return
        */
        show: function(){
            $D.hide(this.el);
            $D.show(this.loadingContainer);
        },
        
        /**
        * 隐藏loading
        * @param 
        * @return
        */
        hide: function(){
            $D.hide(this.loadingContainer);
            $D.show(this.el);
        }
     });
     
     J.ui = J.ui || {};
     J.ui.Loading = Loading;
});
 
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;


    J.ui = J.ui || {};
    /**
     * 列表滚动类
     * @class 
     * @memberOf ui
     * @name Marquee
     * @constructor
     * @param {Object} option
     * option.speed || 40;//滚动速度
       option.stopTime || 3000;//滚动时长
       option.lineHeight || 20;//列表每行的高度
       target;//需要滚动的列表
     * @since version 1.0
     */
    J.ui.Marquee = new J.Class(
    /**
     * @lends ui.Marquee.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(option){
            var marqueeContext = this;
            this.speed = option.speed || 40;
            this.stopTime = option.stopTime || 3000;
            this.lineHeight = option.lineHeight || 20;
            this.target = option.target;
            this.timer = null;
            this.lineTimer = null;
            this.intervaler = null;
            this.scrollHeight = this.lineHeight;
            this.isStop = false;
            
            this._onTimeRun = function(){
                marqueeContext.scrollOneLine();
            };
    
        },
        /**
         * 滚动一行
         */
        scrollOneLine : function(){
            if (this.scrollHeight > 0) {
                this.scrollHeight--;
                var currentTop = this.target.style.top.match(/-?\d+/);
                currentTop = (!currentTop) ? 0 : parseInt(currentTop[0]);
                this.target.style.top = (--currentTop) + 'px';
                

                this.lineTimer = setTimeout(this._onTimeRun, this.speed);
            }else{
                if(!this.isStop){
                    this.update();
                }
            }

        },
        /**
         * 停止当前行滚动
         */
        stop : function() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        },
        /**
         * 完全停止滚动
         */
        stopAll : function(){
            this.stop();
            if(this.lineTimer){
                clearTimeout(this.lineTimer);
            }
        },
        /**
         * 重设列表的位置
         */
        reset : function(){
            this.target.style.top = '0px';
        },
        /**
         * 执行一次滚动
         */
        update : function(){
            if(this.isStop){
                return;
            }
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.scrollHeight = this.lineHeight;
            var currentTop = this.target.style.top.match(/\d+/);
            var height = $D.getScrollHeight(this.target);
            if(!!currentTop && !!height){
                currentTop = parseInt(currentTop[0]);
                if(currentTop >= height){
                    this.target.style.top = this.lineHeight + 'px';
                    this.scrollOneLine();
                    return;
                }
            }

            this.timer = setTimeout(this._onTimeRun, this.stopTime);
        },
        /**
         * 继续执行上一次未完成的滚动
         */
        walkOnLastLine : function(){
            this._onTimeRun();
        }
        
    });



});
/**
 * 桌面通知模块
 * 目前只有chrome的实现
 * 来自: http://0xfe.muthanna.com/notifyme.html
 * azreal, 2010-9-11
 */
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;

    J.ui = J.ui || {};
    /**
     * chrome的桌面提醒封装
     * 
     * @memberOf ui
     * @class
     * @name Notifier
     * @constructor
     * 
     **/
    J.ui.Notifier = new J.Class(
    /**
     * @lends ui.Notifier.prototype
     */
    {
        /**
         * 如果浏览器支持桌面提醒, 返回true
         */
        hasSupport: function(){
            if (window.webkitNotifications) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *  向浏览器请求使用桌面提醒, 若用户点击了同意, 则执行回到函数
         *  @param {Function} cb
         */
        requestPermission: function(cb){
            window.webkitNotifications.requestPermission(function() {
                if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
            });
        },
        /**
         * 弹出一个桌面提醒
         * @param {String} icon 图标的url
         * @param {String} title 标题
         * @param {String} body 提醒内容
         */ 
        notify : function(icon, title, body) {
            if (window.webkitNotifications.checkPermission() == 0) {
                var popup = window.webkitNotifications.createNotification(icon, title, body);
                popup.show();
                return popup;
            }
          return false;
        }
        
    });



});
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
        
    J.ui = J.ui || {};

    /**
     * 【Pagination】
     * 
     * @class 
     * @memberOf ui
     * @name Pagination
     * @param {Object} option 参数对象 option:{el:DOM分页容器, count: 总数, prePage: 每页数量, type: 分页类型(1/2), callback: 回调}<br/>
     * option.type 分页类型,type=1:带省略号,有页码列表;type=2:无省略号,没页码列表
     * @since version 1.0
     * @description Jx.ui.Pagination是一个分页组件，当在页面上需要使用列表来展示较多数据时，可以使用该组件实现分页切换效果。
     */
     J.ui.Pagination = new J.Class(
     /**
     * @lends ui.Pagination.prototype
     */
     {
        /**
        * @ignore
        */
        init:function(option){
            this.pagebarEl = option.el;
            this.count = option.count;
            this.perPage = option.perPage || 10;
            this.callback = option.callback||function(){};
            this.type = option.type||1;
            this.maxPage = Math.ceil(this.count/this.perPage);
            this.currentPage=option.currentPage||1;
            var paginationEl = this.pagebarEl.children[0];
            this.pagelistEl = paginationEl.children[1];
            this.preEl = paginationEl.children[0];
            this.nextEl = paginationEl.children[2];
            
            
            if (this.maxPage > 1) {
                $D.show(this.pagebarEl);
            } else {
                $D.hide(this.pagebarEl);
            }
            //this.setPage(this.currentPage);
            this.turnTo(this.currentPage, true);
            $E.on(this.preEl,"click",J.bind(this.onPreElClick,this));
            $E.on(this.nextEl,"click",J.bind(this.onNextElClick,this));
        },
        
        /**
        * 重置分页组件
        * @param {Object} option 参数对象 option:{el:DOM分页容器, count: 总数, prePage: 每页数量, type: 分页类型(1/2), callback: 回调}
        * @return
        */
        reset : function(option){
            this.count = J.isNumber(option.count)?option.count:this.count;
            this.perPage = option.perPage ||this.perPage|| 10;
            this.callback = option.callback||this.callback||function(){};
            this.type = option.type||this.type||1;
            this.currentPage = option.currentPage||this.currentPage||1;
            this.maxPage = Math.ceil(this.count/this.perPage);
            if (this.maxPage > 1) {
                $D.show(this.pagebarEl);
            } else {
                $D.hide(this.pagebarEl);
            }
            this.setPage(this.currentPage);
        },
        
        /**
        * @private
        * 设置
        */
        setPage:function(page){
            var html = "", totalPage = this.maxPage;
            this.currentPage = page;

            if (page > totalPage || page < 1) {
                return;
            }
            //第一种模版,带省略号
            if(this.type == 1){
                if( totalPage > 8 ){
                    html += '<a class="w'+ ((page+'').length) + (page==1?' cur':"")+'" href="#" >1</a>';
                    if(page < 4){
                        for(var i=2; i<5; i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                        html += '<span>...</span>';
                    }else if( (page+3) > totalPage){
                        html += '<span>...</span>';  
                        for(var i=(totalPage-3); i<totalPage; i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                    }else{ 
                        html += '<span>...</span>';
                        for(var i=(page-1); i < (page+2); i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                        html += '<span>...</span>';
                    }
                    html += '<a class="w'+ ((totalPage+'').length) +(page==totalPage?' cur':"")+'" href="#" >'+totalPage+'</a>';
                }else{
                    for( var i=1; i<=totalPage; i++){
                        html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                    }
                }
    
                this.pagelistEl.innerHTML = html;
                $D.setStyle(this.pagebarEl,"width","auto");
                $D.setStyle(this.pagebarEl,"width",$D.getClientWidth(this.pagebarEl.children[0])+10+"px");
                var pagelink = $D.tagName("a",this.pagelistEl), i=0, len=pagelink.length;
                for (; i<len; i++) {
                    $E.on(pagelink[i],"click",J.bind(this.onPagesElClick,this));
                }
                
            }else if(this.type==2){//第二种模版,不带省略号
                html = page+"/"+totalPage;
                this.pagelistEl.innerHTML = html;
            }
            

            $D.removeClass(this.preEl,"preBtn_dis");
            $D.removeClass(this.nextEl,"nextBtn_dis");

            if(page == 1){
                $D.addClass(this.preEl,"preBtn_dis");
            } else if(page == totalPage){
                $D.addClass(this.nextEl,"nextBtn_dis");
            }
        },
        
        /**
        * 切换到 指定页
        * @param page {Number} 页码
        * @param force {Boolean} 内部使用参数，可以不填或false
        */
        turnTo: function(page, force){
            if (isNaN(page) || page < 1 || page > this.maxPage || (!force && page == this.currentPage)) {
                return;
            }

            this.setPage(page);
            this.callback({start:this.getStart(), end:this.getEnd()});
        },
        
        /**
        * @private 
        */
        onPagesElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            var page = +e.currentTarget.innerHTML;
            this.turnTo(page);
            /*if (isNaN(page) || page < 1 || page > this.maxPage || page == this.currentPage) {
                return;
            }

            this.setPage(page);
            this.callback({start:this.getStart(), end:this.getEnd()});*/
            //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
        },
        
        /**
        * @private 
        */
        onPreElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            if (this.currentPage > 1) {
                this.currentPage--;
                this.setPage(this.currentPage);
                this.callback({start:this.getStart(), end:this.getEnd()});
                //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
            }
        },
        
        /**
        * @private 
        */
        onNextElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            if (this.currentPage < this.maxPage) {
                this.currentPage++;
                this.setPage(this.currentPage);
                this.callback({start:this.getStart(), end:this.getEnd()});
                //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
            }
        },
        
        /**
        * 获取当前页列表起始索引值
        * @param
        * @return {Number} 当前页列表起始索引值
        */
        getStart:function(){
            return (this.currentPage-1)*this.perPage;
        },
        
        /**
        * 获取当前页列表结束索引值
        * @param
        * @return {Number} 当前页列表结束索引值
        */
        getEnd:function(){
            var end = (this.currentPage*this.perPage)-1;
            if(end > this.count - 1)
                end = this.count - 1;
            return end;
        }
    });
});/**
 * 富文本模块
 * @author azrael
 * 2011-5-16
 */
;Jx().$package(function (J) {
    var packageContext=this,
    $E = J.event, $D = J.dom, $B = J.browser;
/**
 * 处理基本逻辑的文本编辑器
 * @class 
 * @name BaseEditor
 * @memberOf ui
 * @constructor
 * @param {Object} option
 * option = {<br/>
 *  appendTo: {HTMLElement} //富文本的容器<br/>
 *  className: {String},<br/>
 *  richClassName: {String},<br/>
 *  textClassName: {String},<br/>
 *  keepCursor: {Boolean} default: false //是否保存光标位置, 因为要进行保存选区和还原, 如果不关心光标位置, 则设置为false<br/>
 *  brNewline: {Boolean} default: false //使用统一使用br标签进行换行 <br/>
 *  clearNode: {Boolean} default: false //是否要对粘贴或拖拽进输入框的内容进行过滤, NOTE: opera只支持 ctrl+v 粘贴进来的内容<br/>
 *  nodeFilter: {Function} default: null //clearNode时过滤节点的函数, return true则不过滤该节点, 参数为 HTMLElement<br/>
 * }
 * @description
 * BaseEditor只处理编辑器自身的逻辑
 * 保存当前光标位置, 防止插入到页面其他地方
 * 
 * 富文本的扩展功能如设置字体样式/工具条等在RichEditor实现
 * @see ui.RichEditor
 * @example 
 * 
 * new J.ui.BaseEditor({
 *       appendTo: el,
 *       className: 'rich_editor',
 *       keepCursor: true,
 *       brNewline: true,
 *       clearNode: true 
 *   });
 * 
 */
var BaseEditor = new J.Class(
/**
 * @lends ui.BaseEditor.prototype
 */
{
    /**
     * @ignore
     */
    init: function(option){
        if(!option.appendTo){
            throw new Error('BaseEditor: appendTo is undefined.');
        }
        this.option = {
            keepCursor: option.keepCursor || false,
            brNewline: option.brNewline || false,
            clearNode: option.clearNode || false,
            nodeFilter: option.nodeFilter || null
        }
        var className = option.className || 'rich_editor'
        var container = this._container = $D.node('div', {
            'class': className
        });
        var divArea = this._divArea = $D.node('div', {
            'class': option.richClassName || (className + '_div')
        });
        var textArea = this._textArea = $D.node('textarea', {
            'class': option.textClassName || (className + '_text')
        });
        container.appendChild(divArea);
        container.appendChild(textArea);
        option.appendTo.appendChild(container);
        
        this.setState(true);
        this.clear();
        
        var context = this;
        
        /** @ignore */
        this._private = {
            /** @ignore */
            startTimeoutSaveRange : function(timeout){
                this.clearTimeoutSaveRange();
                this._keyupTimer = window.setTimeout(this.timeoutSaveRange, timeout || 0);
            },
            /** @ignore */
            timeoutSaveRange : function(){
                context.saveRange(true);
            },
            /** @ignore */
            clearTimeoutSaveRange : function(){
                if(this._keyupTimer){
                    window.clearTimeout(this._keyupTimer);
                    this._keyupTimer = 0;
                }
            },
            /** @ignore */
            startTimeoutClearNodes : function(timeout){
                this.clearTimeoutClearNodes();
                this._clearNodesTimer = window.setTimeout(this.timeoutClearNodes, timeout || 0);
            },
            /** @ignore */
            timeoutClearNodes : function(){
                context.clearNodes();
            },
            /** @ignore */
            clearTimeoutClearNodes : function(){
                if(this._clearNodesTimer){
                    window.clearTimeout(this._clearNodesTimer);
                    this._clearNodesTimer = 0;
                }
            }
        };
        
        $E.on(divArea, 'blur', J.bind(BaseEditor.observer.onBlur, context));
        $E.on(divArea, 'mouseup', J.bind(BaseEditor.observer.onMouseup, context));
        $E.on(divArea, 'drop', J.bind(BaseEditor.observer.onDrop, context));
        $E.on(divArea, 'paste', J.bind(BaseEditor.observer.onPaste, context));
        $E.on(divArea, 'keyup', J.bind(BaseEditor.observer.onKeyup, context));
        if($B.ie){
            $E.on(divArea, 'keydown', J.bind(BaseEditor.observer.onBackspaceKeydown, context));
        }
        if($B.adobeAir){//air需要用keyup来监听ctrl+v
            $E.on(divArea, 'keyup', J.bind(BaseEditor.observer.onAdobeAirKeyup, context));
        }
        if(J.platform.linux && $B.firefox){
            //1. keydown事件在ubuntu的firefox用了中文输入法时不会触发
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onLinuxKeypress, context));
        }else if(J.platform.win && $B.opera){
            //1. windows的 opera的keydown事件无法阻止默认行为, 另外window的opera的 ctrl+ v的keyCode 是86
            //ubuntu的opera的ctrl+v的keyCode是118...
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onKeydown, context));
        }else {
            $E.on(divArea, 'keydown', J.bind(BaseEditor.observer.onKeydown, context));
        }
        $E.addObserver(this, 'Paste', J.bind(BaseEditor.observer.onEditorPaste, context));
        //hacky trick
        if($B.firefox){
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onKeypress, context));
        }
    },
    /**
     * 按键抬起操作
     * @ignore
     */
    onKeyUp: function() {
        
    },
    /**
     * 返回是否启用了富文本
     */
    isEnable: function(){
        return this._isEnable;
    },
    /**
     * 设置是否启用富文本
     * @param {Boolean} state
     */
    setState: function(state){
        this._isEnable = state;
        var textArea = this._textArea;
        var divArea = this._divArea;
        if(state){
            $D.show(divArea);
            $D.hide(textArea);
            textArea.readonly = true;
            divArea.setAttribute('contentEditable', true);
        }else{
            $D.hide(divArea);
            $D.show(textArea);
            textArea.readonly = false;
            divArea.setAttribute('contentEditable', false);
        }
    },
    /**
     * 指示编辑框是否可编辑
     * @return {Boolean}
     */
    isEditable: function(){
        return this._isEditable;
    },
    /**
     * 设置是否可编辑, true 可编辑, false 只读
     * @param {Boolean} isEditable
     */
    setEditable: function(isEditable){ 
        this._isEditable = isEditable;
        if(this._isEnable){
            this._divArea.setAttribute('contenteditable', isEditable);
        }else{
            this._textArea.readonly = !isEditable;
        }
    },
    /**
     * 销毁
     */
    destory: function(){
        $E.off(divArea, 'focus');
        $E.off(divArea, 'blur');
        $E.off(divArea, 'mousedown');
        $E.off(divArea, 'mouseup');
        $E.off(divArea, 'keyup');
        $E.off(divArea, 'paste');
        $E.off(divArea, 'drop');
        $E.off(divArea, 'keypress');
        $E.off(divArea, 'keydown');
            
        this.setState(false);
        this._container.parentNode.removeChild(this._container);
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                delete this[p];
            }
        }
    },
    /**
     * 返回编辑区的html
     * @return {String}
     */
    getHtml: function(){
        return this._divArea.innerHTML;
    },
    /**
     * 设置编辑区的内容
     * @param {String} html
     */
    setHtml: function(html){
        this._divArea.innerHTML = html;
    },
    /**
     * 清空编辑器 
     */
    clear: function(){
        if(this._isEnable){
            if(this.option.keepCursor){
                this.saveRange(true);
            }
            if($B.ie){
                this.setHtml('');
            }else{
                this.setHtml('<br/>');
            }
        }else{
            this.setText('');
        }
    },
    /**
     * 设置纯文本输入框的内容
     * @param {String} text
     */
    setText: function(text){
        this._textArea.value = text;
    },
    /**
     * 获取纯文本框的内容
     * NOTE: 如果要取得富文本里的纯文本内容, 请先调用save方法
     * @see save
     * @return {String}
     */
    getText: function(){
        return this._textArea.value;
    },
    /**
     * 判断输入框内容是否是空的
     * @param {Boolean} 
     */
    isEmpty: function(){
        if(this._isEnable){
            var html = this.getHtml();
            if(html === ''){
                return true;
            }else if(!$B.ie && html.toLowerCase() === '<br>'){
                return true;
            }else{
                return false;
            }
        }else{
            var text = this.getText();
            if(text === ''){
                return true;
            }else{
                return false;
            }
        }
    },
    /**
     * 让编辑区获得输入焦点
     */
    focus: function(){
        if(this._isEnable){
            this._divArea.focus();
            if(this.option.keepCursor){
                this.restoreRange();
            }
        }else{
            this._textArea.focus();
        }
    },
    /**
     * 移除输入焦点
     */
    blur: function(){
        if(this._isEnable){
            this._divArea.blur();
        }else{
            this._textArea.blur();
        }
    },
    /**
     * 把编辑区的内容保存到文本框
     * NOTE: 这里只是简单的转换, 子类最好根据需要重写该方法
     */
    save: function(){
        this.setText(this.getHtml());
    },
    /**
     * 把纯文本框里的文本还原到富文本输入框
     * NOTE: 这里只是简单的转换, 子类最好根据需要重写该方法
     */
    restore: function(){
        this.setHtml(this.getText());
    },
    /**
     * 获取输入框中的选中区
     * @return {Range}, null
     */
    getRange: function(){
        return BaseEditor.getRange(this._divArea);
    },
    /**
     * 保存当前光标位置
     * 如果调用时确认当前光标是在输入框中, 不执行检测会节约些许性能
     * @param {Boolean} checkRange 指示是否检查range是否在文本框中
     * 
     */
    saveRange: function(checkRange){
        var lastRange = checkRange ? this.getRange() : BaseEditor.getRange();
        if(!lastRange){
            return;
        }
        this._lastRange = lastRange;
//        if(lastRange.getBookmark){// for ie
//            this._lastBookmark = lastRange.getBookmark();
//        }
    },
    /**
     * 还原保存的光标位置
     * NOTE: 调用时需确保光标是在输入框中
     */
    restoreRange: function(){
        if(this._lastRange){
            var selection = BaseEditor.getSelection();
            if(selection.addRange){
                /*
                 * 对于高级浏览器, 直接把原来的range添加到selection就可以还原选区了
                 */
                selection.removeAllRanges();
                selection.addRange(this._lastRange);
            }else{//ie
                //NOTE: ie还可以使用其专有的bookmark来还原, 
                //但是如果在输入框以外的地方选中了文字, 偶尔会出现还原失败的情况
                /*if(this._lastBookmark){ //ie 
                /*
                 * 这里的原理是:
                 * 1. 先把保存lastRange的bookmark
                 * 2. 把新的range的选中位置移动到上次保存的bookmark
                 * 3. 选中该range就能把上次保存的选区还原了
                 *
                    var range = BaseEditor.getRange();
                    if(range){
                        range.moveToBookmark(this._lastBookmark);
                        range.select();
                    }
                }*/
                /*
                 * 这里的原理是:
                 * 1. 先把保存lastRange, 如"ABCDEFG"中的"CDE"
                 * 2. 把新的range的结尾移动到lastRange的开头(即"C"的左边),
                 * 3. 然后调用 collapse(false)把光标的插入点移动到range的结尾
                 * 也就是把range的开头和结尾合并在一起, 因为新的range的开头都是在内容的起点
                 * 不这样处理的话, 调用select之后会选中"AB"(即选中"C"之前的所有内容)
                 * 4. 把range的结尾移动到lastRange的结尾(即"E"的右边)
                 * 5. 选中该range就能把上次保存的选区还原了(即选中"CDE")
                 */
                var range = BaseEditor.getRange();
                if(range){
                    //TODO 如果选中的内容是图片, 这里就会出错了
                    range.setEndPoint('EndToStart', this._lastRange);
                    range.collapse(false);
                    range.setEndPoint('EndToEnd', this._lastRange);
                    range.select();
//                    range.setEndPoint('EndToEnd', this._lastRange);
//                    range.setEndPoint('StartToStart', this._lastRange);
//                    range.select();
                }
//                这个方法说不定可以
//                this._lastRange.select();
            }
        }
    },
    /**
     * 在光标处插入一段html
     * NOTE:调用时需确保光标在输入框中
     * @param {String} html
     */
    insertHtml: function(html){
        if(html === ''){
            return;
        }
        var range = this.getRange();
        if(!range){//如果拿不到输入框中的range, 就直接添加到最后
            if(this.isEmpty()){
                this._divArea.innerHTML = html;
            }else{
                this._divArea.innerHTML += html;
            }
            range = BaseEditor.getRange();
            var divLastNode = this._divArea.lastChild;
            if(range.selectNode){
                range.setEndAfter(divLastNode);
                range.setStartAfter(divLastNode);
                var selection = BaseEditor.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }else if(range.moveToElementText){
                range.moveToElementText(divLastNode);
                range.collapse(false);
                range.select();
            }
        }else if(range.pasteHTML){//ie, ie9 也在这里
//            html += '<img style="display:inline;width:1px;height:1px;">';
            range.pasteHTML(html);
            range.collapse(false);
            range.select();
        }else if(range.createContextualFragment){//ie9竟然不支持这个方法
            // 使用img标签是因为img是行内元素的同时, 又能设置宽高占位
            html += '<img style="display:inline;width:1px;height:1px;">';
            var fragment = range.createContextualFragment(html);
            var lastNode = fragment.lastChild;
            //如果已经选中了内容, 先把选中的删除
            range.deleteContents();
            range.insertNode(fragment);
            //插入后把开始和结束位置都放到lastNode后面, 然后添加到selection
            range.setEndAfter(lastNode);
            range.setStartAfter(lastNode);
            var selection = BaseEditor.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            //把光标滚动到可视区
//            if(lastNode.nodeType === 1){
//                ff开了firbug的时候, 会导致样式错乱, 换用scrollTop的方式
//                lastNode.scrollIntoView();
//            }
            var divArea = this._divArea;
            var pos = $D.getRelativeXY(lastNode, divArea);
            divArea.scrollTop = pos[1] < divArea.scrollHeight ? divArea.scrollHeight : pos[1];
            // 删除附加的节点, 这里只能这样删, chrome直接remove节点会导致光标消失掉
            if(!$B.opera){//TODO opera的光标还原有问题, 要想办法解决
                document.execCommand('Delete', false, null);
            }
            if(BaseEditor.contains(divArea, lastNode)){//for opera
                divArea.removeChild(lastNode);
            }
        }
        if(this.option.keepCursor){
            //插入后把最后的range设置为刚刚的插入点
            this.saveRange();
        }
    },
    /**
     * 往纯文本框插入一段文本
     * @param {String} text
     */
    insertText: function(text){
        if(text === ''){
            return;
        }
        var textArea = this._textArea;
        if($B.ie){
            var range = BaseEditor.getRange();
            if(range){
                range.text = text;
            }else{
                textArea.value += text;
            }
        }else{
            if(J.isUndefined(textArea.selectionStart)){
                textArea.value += text;
            }else{
                var value = textArea.value,
                    start = textArea.selectionStart, 
                    end = textArea.selectionEnd,
                    cursorPoint = start + text.length;
                textArea.value = value.substring(0, start) + text + value.substring(end);
                textArea.setSelectionRange(cursorPoint, cursorPoint);
            };
            
        }
    },
    /**
     * 将输入框里的内容在光标处换行
     * NOTE: 执行该方法前, 需保证光标已经在输入框
     */
    newline: function(){
        if(this._isEnable){
            this.insertHtml('<br/>');
        }else{
            this.insertText('\n');
        }
    },
    /**
     * 清理节点, 把除了br,img之外的节点都清理掉
     */
    clearNodes: function(){
        /* 
         * 这里的原理是:
         * 倒序遍历输入框的直接子节点
         * 1. 如果是文本节点则跳过
         * 2. 如果是element,且不是br,则用其包含的文本保存替换该节点
         * 3. 如果是其他, 如comment,则移除
         * 最后把光标位置还原
         */
        var divArea = this._divArea;
        var text, textNode, cursorNode;
        var childNodes = divArea.childNodes;

        for(var c = childNodes.length - 1, node; c >= 0; c--){
            node = childNodes[c];
            if(node.nodeType === 3){//text
                
            }else if(node.nodeType === 1){//element
                if(node.nodeName !== 'BR'){
                    if(this.option.nodeFilter && this.option.nodeFilter(node)){
                        //nodeFilter返回true则不过滤
                    }else{
                        text = node.textContent || node.innerText || '';//innerText for ie
                        if(text !== ''){
                            textNode = document.createTextNode(text);
                            if(!cursorNode){
                                cursorNode = textNode;
                            }
                            divArea.replaceChild(textNode, node);
                        }else{
                            divArea.removeChild(node);
                        }
                    }
                    
                }
            }else{//comment etc.
                divArea.removeChild(node);
            }
        }
        if(cursorNode){//清除多余标签后还原光标位置
            var selection = BaseEditor.getSelection();
            if(selection.extend){//ff, chrome 要先扩展选区, 然后把选区开头合并到结尾
                //NOTE: chrome 拷贝某些html会有问题
                selection.extend(cursorNode, cursorNode.length);
                selection.collapseToEnd();
            }
        }
    }
});
/** @ignore */
BaseEditor.observer = /** @ignore */{
    onBlur: function(e){
        //本来想在blur的时候保存range, 但是执行这个事件的时候,
        //光标已经不在输入框了, 也许ie可以用onfocusout事件来做
//        this.saveRange();
        this._private.clearTimeoutSaveRange();
    },
    onMouseup: function(e){
        if(this.option.keepCursor){
            this.saveRange();
        }
    },
    onLinuxKeypress: function(e){//only for linux firefox
        var keyCode = Number(e.keyCode), charCode = Number(e.charCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(charCode === 118 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            $E.notifyObservers(this, 'Paste', e);
        }else if(keyCode === 13 && this.option.brNewline){//enter no matter ctrl or not
            e.preventDefault();
            this.newline();
        }
    },
    onAdobeAirKeyup: function(e){//only for air ctrl+v
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 86 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            $E.notifyObservers(this, 'Paste', e);
        }
    },
    onBackspaceKeydown: function(e){//for ie
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 8 && (!ctrlKey && !altKey && !shiftKey)){//BackSpace
            //ie 在输入框中选中了图片后按回退键, 跟点浏览器的后退按钮一个效果 >_<
            var selection = BaseEditor.getSelection();
            if (selection.type.toLowerCase() === 'control') {
                e.preventDefault();
                selection.clear();
            }
        }
    },
    onKeydown: function(e){//normal browser
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 86 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            //1. opera没有onpaste事件, 因此只能监控ctrl+v的粘贴
            //2. ie剪贴板里有图片时, 监听不到onpaste事件
            $E.notifyObservers(this, 'Paste', e);
        }else if(keyCode === 13 && this.option.brNewline){//enter no matter ctrl or not
            e.preventDefault();
            this.newline();
        }
    },
    onKeyup: function(e){
        //TODO 判断如果是某些按键(如空格)就立即保存
        var keyCode = Number(e.keyCode);
        if(keyCode === 16 || keyCode === 17 || keyCode === 18){
            //排除掉单纯的shift,ctrl,alt键
        }else if(this.option.keepCursor){
            //延时进行保存, 避免连续输入文字的时候做了太多次操作
            this._private.startTimeoutSaveRange(100);
        }
        this.onKeyUp(e);
    },
    onKeypress: function(e) {
        this.onKeyUp(e);
    },
    onPaste: function(e){
        if(this.option.clearNode){
            //这里延时200毫秒, 如果onEditorPaste执行的时候也过滤的话,就可以取消这次了
            this._private.startTimeoutClearNodes(200);
        }
    },
    onDrop: function(e){
        if(this.option.clearNode){
            //因为发出这个事件的时候, 内容还没有粘贴到输入框, 所以要延时
            this._private.startTimeoutClearNodes();
        }
    },
    onEditorPaste: function(e){
        if($E.notifyObservers(this, 'EditorPaste', e)){//如果EditorPaste的监听者返回了false, 则不进行过滤处理
            if(this.option.clearNode){
                //因为发出这个事件的时候, 内容还没有粘贴到输入框, 所以要延时
                this._private.startTimeoutClearNodes();
            }
        }
    }
    
};

/**
 * 获取当前页面的selection对象
 * @memberOf ui.BaseEditor
 * @name getSelection
 * @function
 * @return {Selection}
 */
BaseEditor.getSelection = function() {
    //先判断ie专有的, 因为ie9对range的支持不完全啊>_<
    return (document.selection) ? document.selection : window.getSelection();
};

/**
 * 获取选中区, 如果传入了container, 则返回container的range
 * @memberOf ui.BaseEditor
 * @function
 * @name getRange
 * @param {HTMLElement} container  目标range的容器, 可选
 * @return {Range}, null
 */
BaseEditor.getRange = function(container) {
    var selection = BaseEditor.getSelection();
    if (!selection) {
        return null;
    }
    var range = selection.getRangeAt ? (selection.rangeCount ? selection
                .getRangeAt(0) : null) : selection.createRange();
    if(!range){
        return null;
    }
    if(container){
        if(BaseEditor.containsRange(container, range)){
            return range;
        }else{
            return null;
        }
    }else{
        return range;
    }
    
};

/**
 * 判断一个节点是否是某个父节点的子节点, 
 * 默认不包含parent === child的情况
 * @memberOf ui.BaseEditor
 * @function
 * @name contains
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @param {Boolean} containSelf 指示是否可包含parent等于child的情况
 * @return {Boolean} 包含则返回true
 */
BaseEditor.contains = function(parent, child, containSelf){
    if(!containSelf && parent === child){
        return false;
    }
    if(parent.compareDocumentPosition){//w3c
        var res = parent.compareDocumentPosition(child);
        if(res == 20 || res == 0){
            return true;
        }
    }else{
        if(parent.contains(child)){//ie
            return true;
        }
    }
    return false;
};
/**
 * 判断一个range是否被包含在container中
 * @memberOf ui.BaseEditor
 * @function
 * @name containsRange
 * @param {HTMLElement} container
 * @param {Range} range
 * @return {Boolean}
 */
BaseEditor.containsRange = function(container, range){
    var rangeParent = range.commonAncestorContainer || (range.parentElement && range.parentElement()) || null;
    if(rangeParent){
        return BaseEditor.contains(container, rangeParent, true);
    }
    return false;
};

/**
 * 富文本编辑器
 * @class 
 * @name RichEditor
 * @memberOf ui
 * @extends ui.BaseEditor
 * @constructor
 * @param {Object} option
 * option = {<br/>
 *  appendTo: {HTMLElement} //富文本的容器<br/>
 *  keepCursor: {Boolean} default: false //是否保存光标位置, 因为要进行保存选区和还原, 如果不关心光标位置, 则设置为false<br/>
 *  brNewline: {Boolean} default: false //使用统一使用br标签进行换行 <br/>
 *  clearNode: {Boolean} default: false //是否要对粘贴或拖拽进输入框的内容进行过滤, NOTE: opera只支持 ctrl+v 粘贴进来的内容<br/>
 * }
 * @description
 * RichEditor实现了富文本的扩展功能如设置字体样式/工具条等
 * 包装了BaseEditor
 * 注意: 该类尚未完成
 * @see ui.BaseEditor
 * @example 
 * option = {
 *  appendTo: {HTMLElement} //富文本的容器
 *  keepCursor: {Boolean} default: false //是否保存光标位置, 因为要进行保存选区和还原, 如果不关心光标位置, 则设置为false
 *  brNewline: {Boolean} default: false //使用统一使用br标签进行换行 
 *  clearNode: {Boolean} default: false //是否要对粘贴或拖拽进输入框的内容进行过滤, NOTE: opera只支持 ctrl+v 粘贴进来的内容
 * }
 */
var RichEditor = new J.Class({ extend: BaseEditor}, 
/**
 * @lends ui.RichEditor.prototype
 */
{
    /**
     * @ignore
     */
    init: function(option){
  
        //调用父层初始化方法
        BaseEditor.callSuper(this, "init",option);
    }
    //TODO 未完成
});

J.ui = J.ui || {};
J.ui.BaseEditor = BaseEditor;
J.ui.RichEditor = RichEditor;

// end
});/* == jx.ui.Rotation =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-5-31 ----- */
 
Jx().$package(function (J) {
     var $D = J.dom,
         isLegacyIE = J.browser.ie && (J.browser.ie < 9 || $D.getDoc().documentMode < 9);
     
     // Rotation类
    /**
     * 【Rotation】
     * 
     * @class 
     * @memberOf ui
     * @name Rotation
     * @constructor
     * @param {Element} el 需要旋转的DOM节点，IE只可用于 img 元素
     * @since version 1.0
     * @description Jx.ui.Rotation是一个（图片）旋转组件。
     */
     var Rotation = new J.Class(
     /**
     * @lends ui.Rotation.prototype
     */ 
     {
        /**
        * @private
        * @param {Element} el 需要旋转的DOM节点，IE只可用于 img 元素
        * @return
        */
        init: function(el){
            this.el = el;
            this.type = 0;

            // rotation type 2 class names
            this.type2class = [
                '',
                'rotation-90deg',
                'rotation-180deg',
                'rotation-270deg'
            ];

            // create a style node
            if (isLegacyIE) {
                $D.createStyleNode('\
                    .rotation-90deg {\
                        filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\
                    }\
                    .rotation-180deg {\
                        filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\
                    }\
                    .rotation-270deg {\
                        filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\
                    }\
                ', 'rotation-style');
            } else {
                $D.createStyleNode('\
                    .rotation-90deg {\
                        -moz-transform:rotate(90deg);\
                        -webkit-transform:rotate(90deg);\
                        -o-transform: rotate(90deg);\
                        -ms-transform: rotate(90deg);\
                        transform:rotate(90deg);\
                    }\
                    .rotation-180deg {\
                        -moz-transform:rotate(180deg);\
                        -webkit-transform:rotate(180deg);\
                        -o-transform: rotate(180deg);\
                        -ms-transform: rotate(180deg);\
                        transform:rotate(180deg);\
                    }\
                    .rotation-270deg {\
                        -moz-transform:rotate(270deg);\
                        -webkit-transform:rotate(270deg);\
                        -o-transform: rotate(270deg);\
                        -ms-transform: rotate(270deg);\
                        transform:rotate(270deg);\
                    }\
                ', 'rotation-style');
            }

            // cleaning
            styleText = null;
        },

        /**
        * @private
        * @return
        */
        uninit: function(){
            this.el = null;
            this.type = 0;
        },

        /**
        * 向左旋转（逆时针）
        * @param
        * @return
        */
        left: function(){
            // anticlockwise
            var type = this.type;
            type -= 1;
            if (-1 === type) {
                type = 3;
            }

            return this.rotate(type);
        },
        
        /**
        * 向右旋转（顺时针）
        * @param
        * @return
        */
        right: function(){
            // clockwise
            var type = this.type;
            type += 1;
            if (4 === type) {
                type = 0;
            }

            return this.rotate(type);
        },
        
        /**
        * 转向特定方向
        * @param {Integer} type 旋转的方向类型：0: 0deg; 1: 90deg; 2: 180deg; 3: 270deg
        * @return
        */
        rotate: function(type){
            type = parseInt(type, 10);
            if (isNaN(type) || !(type in this.type2class) || type === this.type) {
                return false;
            }

            $D.removeClass(this.el, this.type2class[this.type]);

            $D.addClass(this.el, this.type2class[type]);

            var isRotated = type % 2 !== this.type % 2;
            this.type = type;

            if (isRotated) { // if rotated
                // center it for ie
                this.center();
            }

            return this.type;
        },
        
        /**
        * 修正 IE 滤镜无法居中的问题
        * @param
        * @return
        */
        center: function(){
            // for ie only
            if (!isLegacyIE) {
                return;
            }

            // center it
            if ('absolute' === $D.getStyle(this.el, 'position')) {
                var l = parseInt($D.getStyle(this.el, 'left'), 10),
                    t = parseInt($D.getStyle(this.el, 'top'), 10),
                    w = parseInt($D.getStyle(this.el, 'width'), 10),
                    h = parseInt($D.getStyle(this.el, 'height'), 10);

                // swap the w/h
                if (0 === this.type % 2) {
                    var swp = w;
                    w = h;
                    h = swp;
                    swp = null;
                }

                // calc the offset
                var offset = (h - w) / 2;
                l -= offset;
                t += offset;
                offset = null;

                // update the pos
                $D.setStyle(this.el, 'left', l + 'px');
                $D.setStyle(this.el, 'top', t + 'px');
            }
        },
        
        /**
        * 重置
        * @param
        * @return
        */
        reset: function(){
            $D.removeClass(this.el, this.type2class[this.type]);
            this.type = 0;
        },
        
        /**
        * 是否横放
        * @param
        * @return 
        */
        isLandscape: function(){
            return this.type % 2;
        }
     });
     
     J.ui = J.ui || {};
     J.ui.Rotation = Rotation;
});
/**
 * 自定义滚动条
 * ippan
 * 前置条件：所传进来的div的positon必须为relative或absolute
 * 此方法会给div增加一个子元素（滚动条）
 */
 Jx().$package(function (J) {
     var $D = J.dom,
         $E = J.event;
    var doc;
    J.ui = J.ui || {};
    /**
     * 
     */
    J.ui.ScrollArea = new J.Class({
        init: function(el,_doc) {
            var self = this;
            doc = _doc ? _doc:document;
            this.container = el;
            this.scrollBar = doc.createElement('div');
            this.scrollBar.className = 'scrollBar';
            if(J.browser.ie){
                this.scrollBar.innerHTML = '<div class="scrollBar_bg scrollBar_bg_t"></div><div class="scrollBar_bg scrollBar_bg_b"></div>';
            }
            this.container.appendChild(this.scrollBar);
            this.wheelThread = 20; //滚动20px
            this.isScrolling = false;
            var scrollBarStartY;
            var observer = {
                onMouseDown:function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    self.isScrolling = true;
                    scrollBarStartY = e.clientY;
                    $D.addClass(self.scrollBar, 'active');
                    $E.on(doc, 'mousemove', observer.onMouseMove);
                    $E.on(doc, 'mouseup', observer.onMouseUp);
                },
                onMouseMove:function(e){
                    var dy =  e.clientY - scrollBarStartY;
                    var scrollY = dy/(self.offsetHeight-self.scrollBarHeight) * (self.scrollHeight - self.offsetHeight);
                    self.scroll(scrollY);
                    scrollBarStartY = e.clientY;
                    e.preventDefault();
                    e.stopPropagation();
                },
                onClick:function(e){
                    e.preventDefault();
                    e.stopPropagation();
                },
                onMouseUp:function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.off(doc, 'mousemove', observer.onMouseMove);
                    $E.off(doc, 'mouseup', observer.onMouseUp);
                    self.isScrolling = false;
                    $D.removeClass(self.scrollBar, 'active');
                },
                onMouseOver: function(e){
                    $D.addClass(self.scrollBar, 'hover');
                },
                onMouseOut: function(e){
                    $D.removeClass(self.scrollBar, 'hover');
                },
                onMouseWheel:function(event){
                    if(!$D.isShow(self.scrollBar)) return;
                    var delta = event.wheelDelta;
                    event.returnValue = false;
                    var _y = (delta < 0) ? self.wheelThread : (0-self.wheelThread);
                    var mul = self.scrollHeight/self.scrollBarHeight/5;
                    if(mul<1){
                        mul = 1;
                    }
                    _y *= mul;
                    self.scroll(_y);
                },
                onDomMouseScroll:function(e){
                    if(!$D.isShow(self.scrollBar)) return;
                    var delta = (e.detail > 0) ? -1 : 1;
                    e.stopPropagation();
                    e.preventDefault();
                    var _y = (delta < 0) ? self.wheelThread : (0-self.wheelThread);
                    var mul = self.scrollHeight/self.scrollBarHeight/5;
                    if(mul<1){
                        mul = 1;
                    }
                    _y *= mul;
                    self.scroll(_y);
                }
            };
            this.observer = observer;
            $E.on(this.scrollBar, 'mousedown', observer.onMouseDown);
            $E.on(this.scrollBar, 'click', observer.onClick);
            $E.on(this.scrollBar, 'mouseover', observer.onMouseOver);
            $E.on(this.scrollBar, 'mouseout', observer.onMouseOut);
            
            //滚动事件兼容 参照jquery mousewheel
            if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
                $E.on(this.container, 'mousewheel', observer.onMouseWheel);
                $E.on(this.scrollBar, 'mousewheel', observer.onMouseWheel);
            } else {
                $E.on(this.container, 'DOMMouseScroll', observer.onDomMouseScroll);
                $E.on(this.scrollBar, 'DOMMouseScroll', observer.onDomMouseScroll);
            }
            this.update();
        },
        update: function(){
            if(this.updateTimer){
                return;
            }
            var that=this;
            this.updateTimer = setTimeout(function(){
                that.updateTimer = 0;
                that.scrollBar.style['height']='0';//防止scrollBar的高度影响区域高度计算
                $D.hide(that.scrollBar);
                that.scrollHeight = that.container.scrollHeight;
                that.offsetHeight = that.container.offsetHeight;
                that.scrollBarHeight = that.offsetHeight/that.scrollHeight*that.offsetHeight;
                //console.info(that.scrollBarHeight,that.scrollHeight,that.offsetHeight);
                if(that.scrollHeight <= that.offsetHeight){
                    //J.out('hide');
                    //that.scrollBar.style['display']='none';
                }else{
                    //J.out('show');
                    $D.show(that.scrollBar);
                    if(that.scrollBarHeight < 30){
                        that.scrollBarHeight = 30;
                    }
                    that.scrollBar.style['height'] = that.scrollBarHeight+'px';
                    that.scrollBar.style['top'] = that.container.scrollTop+that.container.scrollTop/(that.scrollHeight-that.offsetHeight)*(that.offsetHeight-that.scrollBarHeight)+'px';
                    //J.out(that.scrollHeight+' :: '+that.offsetHeight+' '+that.scrollTime);
                }
                //J.out(that.scrollHeight+' '+that.offsetHeight+' '+that.scrollTime);
            },500);
            //console.info(scrollHeight,offsetHeight,this.scrollBarHeight);
        },
        //@param dis 移动滚动条，dis为滚动条移动距离
        scroll: function(dis){
            var maxDis = this.scrollHeight - (this.container.scrollTop + this.offsetHeight);
            if(dis > maxDis){
                dis = maxDis;
            }
            //J.out(this.container.scrollTop + this.offsetHeight+'  '+this.scrollHeight);
            var scrollTop = this.container.scrollTop+dis;
            this.scrollBar.style['top'] = scrollTop+scrollTop/(this.scrollHeight-this.offsetHeight)*(this.offsetHeight-this.scrollBarHeight)+'px';
            this.container.scrollTop = scrollTop;
        },
        getScrollTop : function(){
          return  parseInt(this.container.scrollTop);
        },
        destroy:function(){
            $E.off(this.scrollBar, 'mousedown', this.observer.onMouseDown);
            $E.off(this.scrollBar, 'mouseover', this.observer.onMouseOver);
            $E.off(this.scrollBar, 'mouseout', this.observer.onMouseOut);
            
            //滚动事件兼容 参照jquery mousewheel
            if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
                $E.off(this.container, 'mousewheel', this.observer.onMouseWheel);
                $E.off(this.scrollBar, 'mousewheel', this.observer.onMouseWheel);
            } else {
                $E.off(this.container, 'DOMMouseScroll', this.observer.onDomMouseScroll);
                $E.off(this.scrollBar, 'DOMMouseScroll', this.observer.onDomMouseScroll);
            }
            this.container.removeChild(this.scrollBar);
            this.container = null;
            this.scrollBar = null;
        }
    });
});
 Jx().$package(function (J) {
     var $D = J.dom,
         $E = J.event;
        
    J.ui = J.ui || {};
    /**
     * 自定义滚动条
     * @class
     * @constructor
     * @memberOf ui
     * @name ScrollBar
     * @param {HTMLElement} el 需要生成滚动条的div(至少保证有一个子div，存放需要滚动的内容)
     * @param {Object} option
     * option.onscroll||function(){};<br/>
       option.scrollToBottom||function(){};<br/>
       option.ipadTouchArea||false;<br/>
     * @example 
     * <div id ="scroll"><div id="scrollcontent"></div></div>
     * scroll与scrollcontent的position必须为relative|absolute
     * (可选: 会用js强制设置)scrollcontent的高度为100%, overflow:hidden
     */
    J.ui.ScrollBar = new J.Class(
    /**
     * @lends ui.ScrollBar.prototype
     */
    {
        option: {
            'barClass': 'scrollBar',
            'barHoverClass': null,
            'barActiveClass': null,
            'showBarContainer': false
        },
        /**
         * @ignore
         */
        init: function(el,option) {
            
            var self = this;
            J.extend(this.option, option);
            this.bar = $D.node('div',{
                'class':option.scrollBarClassName||'scrollBar' 
            });
            this.obj = el;
            this.content = this.obj.getElementsByTagName('div')[0] || this.obj;
            $D.setStyle(this.content, 'height', '100%');
            $D.setStyle(this.content, 'overflow', 'hidden');

            //兼容ie圆角
            if(J.browser.ie){
                this.bar.innerHTML = '<div class="scrollBar_bg scrollBar_bg_t"></div><div class="scrollBar_bg scrollBar_bg_b"></div>';
            }
            this.onscroll= option.onscroll||function(){};
            this.scrollToBottom= option.scrollToBottom||function(){};
            this.ipadTouchArea= option.ipadTouchArea||false;
            $D.setStyle(this.bar, 'marginTop', 0);
            this.obj.appendChild(this.bar);
            
            //滚动槽
            if(option.showBarContainer){
                this.barBc = $D.node('div',{
                    'class':'scrollBar_bgc'
                });
                if(J.browser.ie){
                    this.barBc.innerHTML = '<div class="scrollBar_bgc_c scrollBar_bgc_t"></div><div class="scrollBar_bgc_c scrollBar_bgc_b"></div>';
                }
                this.obj.appendChild(this.barBc);
            }
            
            this.setBarHeight();
            this.bar.y;
            this.srcElement;
            this.marginTop;
            this.D; //鼠标滚动方向
            this.wheelThread = 20; //滚动20px
            this.isScrolling = false;
            
            var observer = {
                /** @ignore */
                onMouseDown:function(e){
                    //e.preventDefault();
                    var target = e.target;
                    if(e.changedTouches) {
                        e= e.changedTouches[0];
                    }
                    self.bar.y = e.clientY;
                    self.bar.t = parseInt( self.bar.style.marginTop );
                    if(!J.platform.iPad){
                        $E.on(document, 'mousemove', observer.onMouseMove);
                        $E.on(document, 'mouseup', observer.onMouseUp);
                        e.stopPropagation();
                    }else {
                        if(target == self.bar){
                            $E.on(document, 'touchmove', observer.onMouseMove);
                            $E.on(document, 'touchend', observer.onBarMouseUp);
                        }else{
                            $E.on(document, 'touchmove', observer.onTouchAreaMove);
                            $E.on(document, 'touchend', observer.onMouseUp);
                        }
                    }
                    self.isScrolling = true;
                    if(self.option.barActiveClass)
                        $D.addClass(self.bar, self.option.barActiveClass);
                },
                /** @ignore */
                onMouseMove:function(e){
                    if(e.changedTouches) {
                        e.preventDefault();
                        e= e.changedTouches[0];
                    }
                    self.scroll( e.clientY - self.bar.y );
                    if(!J.platform.iPad) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                /** @ignore */
                onTouchAreaMove:function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.changedTouches) {
                        e= e.changedTouches[0];
                    }
                    self.scroll( - e.clientY + self.bar.y );
                    //if(!J.platform.iPad) {
                    //}
                },
                /** @ignore */
                onBarMouseUp:function(e){
                    if(!J.platform.iPad){
                        $E.off(document, 'mousemove', observer.onMouseMove);
                        $E.off(document, 'mouseup', observer.onMouseUp);
                    }else {
                        $E.off(document, 'touchmove', observer.onMouseMove);
                        $E.off(document, 'touchend', observer.onBarMouseUp);
                    }
                    self.isScrolling = false;
                    if(self.option.barActiveClass)
                        $D.removeClass(self.bar, self.option.barActiveClass);
                },
                /** @ignore */
                onMouseUp:function(e){
                    if(!J.platform.iPad){
                        $E.off(document, 'mousemove', observer.onMouseMove);
                        $E.off(document, 'mouseup', observer.onMouseUp);
                    }else {
                        $E.off(document, 'touchmove', observer.onTouchAreaMove);
                        $E.off(document, 'touchend', observer.onMouseUp);
                    }
                    self.isScrolling = false;
                    if(self.option.barActiveClass)
                        $D.removeClass(self.bar, self.option.barActiveClass);
                },
                /** @ignore */
                onMouseOver: function(e){
                    $D.addClass(self.bar, self.option.barHoverClass);
                },
                /** @ignore */
                onMouseOut: function(e){
                    $D.removeClass(self.bar, self.option.barHoverClass);
                },
                /** @ignore */
                onMouseWheel:function(event){
                    if(!$D.isShow(self.bar)) {
                        self.scrollToBottom(event);
                        return;
                    }
                    self.D = event.wheelDelta;
                    event.returnValue = false;
                    var _y = (self.D < 0) ? self.wheelThread : (0-self.wheelThread);
                    self.bar.y = event.clientY;
                    self.bar.t = parseInt( self.bar.style.marginTop );
//                    var mul = self.content.scrollHeight/parseInt(self.bar.style.height)/5;
//                    if(mul<1){
//                        mul = 1;
//                    }
//                    _y *= mul;
                    self.scroll(_y);
                },
                /** @ignore */
                onClick:function(e){
                    e.stopPropagation();
                },
                /** @ignore */
                onDomMouseScroll:function(e){
                    if(!$D.isShow(self.bar)) {
                        self.scrollToBottom(e);
                        return;
                    }
                    self.D = (e.detail > 0) ? -1 : 1;
                    if(!J.platform.iPad){
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    self.bar.y = e.clientY;
                    self.bar.t = parseInt( self.bar.style.marginTop );
                    var _y = (self.D < 0) ? self.wheelThread : (0-self.wheelThread);
//                    var mul = self.content.scrollHeight/parseInt(self.bar.style.height)/5;
//                    if(mul<1){
//                        mul = 1;
//                    }
//                    _y *= mul;
                    self.scroll(_y);
                }
            };
            
            if(this.option.stopClick){
                $E.on(this.bar, 'click', observer.onClick);
            }
            if(this.option.barHoverClass){
                $E.on(this.bar, 'mouseover', observer.onMouseOver);
                $E.on(this.bar, 'mouseout', observer.onMouseOut);
            }
            if(J.platform.iPad) {
                $E.on(this.bar, 'touchstart', observer.onMouseDown);
                if(this.ipadTouchArea) {
                    $E.on(this.content, 'touchstart', observer.onMouseDown);
                }
            }else {
                $E.on(this.bar, 'mousedown', observer.onMouseDown);
                //滚动事件兼容 参照jquery mousewheel
                if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
                    $E.on(this.content, 'mousewheel', observer.onMouseWheel);
                    $E.on(this.bar, 'mousewheel', observer.onMouseWheel);
                } else {
                    $E.on(this.content, 'DOMMouseScroll', observer.onDomMouseScroll);
                    $E.on(this.bar, 'DOMMouseScroll', observer.onDomMouseScroll);
                }
            }
        },
        /**
         * 滚动条回到顶部
         */
        scrollBack: function() {
            var self= this;
            self.content.scrollTop = "0px";
            self.bar.t= 0;
            self.scroll(0);
        },
        /**
         * 刷新滚动条, 同 update
         */
        refresh: function(){
            //跟iscroll同名接口
            this.update();  
        },
        /**
         * 刷新滚动条
         */
        update: function(){
            this.setBarHeight();
        },
        /**
         * 计算滚动条位置
         * @private
         */
        setBarHeight: function(){
            
            var self = this;
            
            self.onscroll(0,0); //防止影响scrollHeight计算
            self.bar.style['height']='0'; //防止影响scrollHeight计算
            
            $D.hide(self.bar); //防止影响scrollHeight计算
            
            if((self.content.offsetHeight - self.content.scrollHeight) >= 0 ){
                if(self.barBc){
                    $D.hide(self.barBc);
                }
                self.bar.t = 0; //滚动条复位
            }else{
                self.bar.style.height = parseInt(self.content.offsetHeight / self.content.scrollHeight * self.content.offsetHeight) + 'px';
                $D.show(self.bar);
                if(self.barBc){
                    $D.show(self.barBc);
                }
                self.bar.t = parseInt( self.bar.style.marginTop );
            }
            //触发scroll事件，重置滚动条位置，滚动距离为0
            self.scroll(0);
        },
        /**
         * 移动滚动条，dis为滚动条移动距离
         * @param {Number} dis 
         */
        scroll: function(dis){
            var self = this;
            self.marginTop = (self.bar.t||0) + dis;
            if( self.marginTop < 0 ) {
                self.marginTop = 0;
            }
            if( self.marginTop > self.content.clientHeight - self.bar.offsetHeight ){
                self.marginTop = self.content.clientHeight - self.bar.offsetHeight;
                //到底通知
                self.scrollToBottom();
            }else {
                
            }
            self.bar.style.marginTop = self.marginTop + 'px';
            if(dis==0) {
                self.onscroll(dis,dis);
            }
            var scrollTop= ( self.content.scrollHeight - self.content.offsetHeight ) * parseInt( self.marginTop ) / ( self.content.offsetHeight - self.bar.offsetHeight );
            self.content.scrollTop = scrollTop;
            self.onscroll(scrollTop,dis);
            
        },
        /**
         * 获取当前滚动条的位置
         * @return {Number}
         */
        getScrollTop : function(){
          return  parseInt(this.content.scrollTop);
        },
        /**
         * 移动面板内容，dis为面板移动距离
         * @param {Number} dis 
         */
        contentScroll: function(dis){
            var self = this;
            var dis = parseInt(self.obj.offsetHeight / self.content.scrollHeight * dis);
            this.scroll(dis);
        },
        /**
         * 获取当前内容区的滚动位置
         * @return {Number}
         */
        contentPosition: function() {
            return this.content.scrollTop;
        }
    });
});
/**
 * 多容器拖拽排序
 * tealin, 2010-9-21
 */
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
    var _workAreaWidth=false,
        _workAreaHeight=false,
        _width=false,
        _height=false;
    var curDragElementX, curDragElementY, dragStartX, dragStartY;
    J.ui = J.ui || {};
    /**
     * 拖拽排序封装
     * @class
     * @constructor
     * @memberOf ui
     * @name Sortables
     * @param dropTargets 需要拖拽排序的容器列表
     * @param str 排序后需要返回的字段
     
     */
    J.ui.Sortables = new J.Class(
    /**
     * @lends ui.Sortables.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(dropTargets,sortStr,option){
            this.dropTargets=dropTargets.concat();
            this.sortStr=sortStr;
            this.option = option||{};
            this.limiteOption = this.option.limiteOption||{};
            this.dragController = {};
            this._isLock = false;
        },
        /**
         * 添加拖拽目标容器
         * @param {Object} targetObj targetObj = {el:HTMLElement,level:n} level越大，优先级越高
         */
        addDropTarget : function(targetObj){//targetObj = {el:HTMLElement,level:n} level越大，优先级越高
            this.dropTargets.push(targetObj);
        },
        /**
         * 设置一个dom节点, 用于展现拖拽效果
         * @param {HTMLElement} el
         */
        addEffect : function(el){
            this.effectEl = el;
        },
        /**
         * 移除一个拖拽目标容器
         * @param {HTMLElement} el
         */
        removeDropTarget : function(el){
            J.array.remove(this.dropTargets,el);
        },
        /**
         * 刷新拖拽目标容器, 更新其坐标
         */
        refreshDropTarget : function(target){
            var targetPos,
                xy,
                targetWidth,
                dropTargets = this.dropTargets,
                targetHeight;
            this.dropPos = [];
            if(!target){
                for(var i in dropTargets){
                    target = dropTargets[i].el;
                    targetPos = {};
                    xy = $D.getXY(target);
                    targetWidth = $D.getClientWidth(target);
                    targetHeight = $D.getClientHeight(target);
                    targetPos.x = xy[0];
                    targetPos.y = xy[1];
                    targetPos.w = targetWidth;
                    targetPos.h = targetHeight;
                    this.dropPos[i] = targetPos;
                }
            }else{
                for(var i in dropTargets){
                    dropTargetEl = dropTargets[i].el;
                    if(target.el === dropTargetEl){
                        targetPos = {};
                        xy = $D.getXY(dropTargetEl);
                        targetWidth = $D.getClientWidth(dropTargetEl);
                        targetHeight = $D.getClientHeight(dropTargetEl);
                        targetPos.x = xy[0];
                        targetPos.y = xy[1];
                        targetPos.w = targetWidth;
                        targetPos.h = targetHeight;
                        this.dropPos[i] = targetPos;
                        break;
                    }
                }
            }
        },
        /**
         * 添加一个被拖拽节点, 添加之后即可鼠标拖动该元素
         * @param {HTMLElement} el
         */
        addDragClass : function(el){
            var parentEl = el.parentNode, 
                apperceiveEl = el,
//              effectEl =this.effectEl||this.clone(apperceiveEl),//转移到beforeStart里创建
                effectEl = false,
                context = this,
                currentDropTarget = null,
                xyP = $D.getXY(parentEl),//父节点
                xyS = $D.getXY(apperceiveEl),
                addId = el.getAttribute(this.sortStr)||"",
                dropTargets = this.dropTargets,
                nextEl,
                preXY;//子节点
            
//          //获取模型的体积
//          var _width = $D.getClientWidth(apperceiveEl);
//          var _height = $D.getClientHeight(apperceiveEl);
//          var margin ={}; 
//              margin.top= parseInt($D.getStyle(apperceiveEl,"marginTop")||0);
//              margin.buttom= parseInt($D.getStyle(apperceiveEl,"marginbottom")||0);
//              margin.left= parseInt($D.getStyle(apperceiveEl,"marginLeft")||0);
//              margin.right= parseInt($D.getStyle(apperceiveEl,"marginRight")||0);
//          //修正盒子模型
//          _width += (margin.left+margin.right);
//          _height += (margin.top+margin.buttom);

            this.dropPos = [];
            var onDragBeforeStart = function(){
                _width = $D.getClientWidth(apperceiveEl);
                _height = $D.getClientHeight(apperceiveEl);
                var margin ={}; 
                margin.top= parseInt($D.getStyle(apperceiveEl,"marginTop")||0);
                margin.buttom= parseInt($D.getStyle(apperceiveEl,"marginbottom")||0);
                margin.left= parseInt($D.getStyle(apperceiveEl,"marginLeft")||0);
                margin.right= parseInt($D.getStyle(apperceiveEl,"marginRight")||0);
                //修正盒子模型
                _width += (margin.left+margin.right);
                _height += (margin.top+margin.buttom);
                //重新赋值,因为dropTarget是动态添加的
                dropTargets = this.dropTargets;
                //az 2011-6-8
                effectEl = context.effectEl || context.clone(apperceiveEl);
                context.dragController[addId].setEffect(effectEl);
                //重新设置XY.这里不能在dragstart设置,因为在发出start之前已经用了这个高度
                setStartXY();
                this.refreshDropTarget();
                //储存下个一个节点,以便恢复
                parentEl = apperceiveEl.parentNode;
                nextEl = apperceiveEl.nextSibling;
                
                document.body.appendChild(effectEl);
                
                $E.notifyObservers(context, "beforeStart");
            };
            var onDragStart = function(option){
                currentDropTarget = null;
                if(context.option.isDash){
                    apperceiveEl = context.cloneDashedEl(apperceiveEl);
                }else{
                    if(!J.browser.ie){
                        //$D.setStyle(apperceiveEl,"opacity",0.5);
                        $D.addClass(apperceiveEl,"ui_halfOpacity");
                    }
                }
                //J.out("drag开始");
                $E.notifyObservers(context, "start");
            };
            var onDragMove = function(option){
                var moveEvent = option.orientEvent;
                var moveX = moveEvent.pageX;
                var moveY = moveEvent.pageY;
                //减少计算
                if(Math.abs(moveX-preXY[0])+Math.abs(moveY-preXY[1])<1){
                    return;
                }else{
                    if(moveX-preXY[0]>0){
                        var direction = "right";
                    }else{
                        var direction = "left";
                    }
                    preXY = [moveX,moveY];
                }
                //父节点宽度
                var hitTarget = {el:null,level:-1,index:0};
                for(var i in this.dropPos){
                    if(
                        (moveX > this.dropPos[i].x)&&
                        (moveX < this.dropPos[i].x + this.dropPos[i].w)&&
                        (moveY > this.dropPos[i].y)&&
                        (moveY < this.dropPos[i].y + this.dropPos[i].h)
                        ){
                            var dropTargetObj = dropTargets[i];
                            var dropTarget = dropTargetObj.el;
                            var parentWidth = $D.getClientWidth(dropTarget);
                            //每行个数
                            var perRow = Math.floor(parentWidth/_width);
                            
                            //容器的XY
                            var dropTargetXY = $D.getXY(dropTarget);
                            //先对于容器的位置
                            var x = moveX - dropTargetXY[0];
                            var y = moveY - dropTargetXY[1];
                            //var fixX = preIndexXY[1]==indexY?(preXY[0]-moveX>0?(-0.3):0.3):0;
                            var indexY = Math.floor(y/_height);
                            if(direction=="right"){
                                var indexX = Math.ceil(x/_width);
                            }else if(direction=="left"){
                                var indexX = Math.floor(x/_width);
                            }
                            
                            var index = indexX+indexY*perRow;
                            if(hitTarget.level <dropTargetObj.level){
                                hitTarget.level = dropTargetObj.level;
                                hitTarget.el = dropTargetObj.el;
                                hitTarget.index = index;
                            }
                            /*
                            if(dropTarget.getAttribute('customAcceptDrop')){
                                $E.notifyObservers(dropTarget,'dragmove',option);
                                break;
                            }
                            
                            
                            
                            //修正IE下index找不到的时候插不到最后一个的错误
                            if(dropTarget.childNodes[index]){
                                dropTarget.insertBefore(apperceiveEl,dropTarget.childNodes[index]);
                            }else{
                                dropTarget.appendChild(apperceiveEl);
                            }
                            break;
                            */
                    }
                }
                currentDropTarget = hitTarget.el
                if(currentDropTarget){
                    if(currentDropTarget.getAttribute('customAcceptDrop')){
                        $E.notifyObservers(currentDropTarget,'dragmove',option);
                    }else if(currentDropTarget.childNodes[index]){//修正IE下index找不到的时候插不到最后一个的错误
                        currentDropTarget.insertBefore(apperceiveEl,currentDropTarget.childNodes[index]);
                    }else{
                        currentDropTarget.appendChild(apperceiveEl);
                    }
                }
//              try{
                    $E.notifyObservers(context, "move",option);
//              }catch(e){
//                  J.out("move error");
//              }
            };
            var onDragOverFlow = function(option){
                option.el=effectEl;
                $E.notifyObservers(context, "overFlowBorder",option);
            };
            var onDragEnd = function(option){
                var moveEvent = option.orientEvent;
                var moveX = moveEvent.pageX;
                var moveY = moveEvent.pageY;
                if(currentDropTarget && currentDropTarget.getAttribute &&currentDropTarget.getAttribute('customAcceptDrop')){
                    $E.notifyObservers(currentDropTarget, "drop",{'dragEl':el,"queue":queue,"pos":{x:moveX,y:moveY},"apperceiveEl":apperceiveEl,"nextEl":nextEl,"parentEl":parentEl,"currentDropTarget":currentDropTarget});
                }
                document.body.removeChild(effectEl);
                if(context.option.isDash){
                    context.removeDashedEl();
                    apperceiveEl = context.tempEl;
                }else{
                    if(!J.browser.ie){
                        //$D.setStyle(apperceiveEl,"opacity",1);
                        $D.removeClass(apperceiveEl,"ui_halfOpacity");
                    }                   
                }
                //返回队列
                var queue = [];
                for(var i in dropTargets){
                    queue[i] = [];
                    var childNodes = dropTargets[i].el.childNodes;
                    for(var k=0;k<childNodes.length;k++){
                        var node = childNodes[k];
                        if(!node.getAttribute){
                            break;
                        }
                        var attribute=childNodes[k].getAttribute(context.sortStr);
                        if(attribute){
                            queue[i].push(attribute);
                        }
                    }
                }
                //J.out("drag结束");
                try{
                    $E.notifyObservers(context, "end",{"queue":queue,"pos":option,"apperceiveEl":apperceiveEl,"nextEl":nextEl,"parentEl":parentEl});
                }catch(e){
                    J.out("drop error");
                }
                var containerEl=document.elementFromPoint(moveX, moveY);
                if(containerEl){
                    $E.notifyObservers(J.ui, "drop",{'dragEl':el,"pos":{x:moveX,y:moveY},"apperceiveEl":apperceiveEl,"dropEl":containerEl});
                }
            };
            //初始化XY
            var setStartXY = function(){
                //xyP = $D.getXY(parentEl);//父层坐标
                xyS = $D.getXY(apperceiveEl);//子层坐标
                var x = xyS[0];
                var y = xyS[1];
                preXY = [x,y];
                $D.setStyle(effectEl,"left",x+"px");
                $D.setStyle(effectEl,"top",y+"px");
            };
            
            var initDropPos = function(){//废弃，用refreshDropPos
                var target,
                    targetPos,
                    xy,
                    targetWidth,
                    targetHeight;
                this.dropPos = [];
                for(var i in dropTargets){
                    target = dropTargets[i].el;
                    targetPos = {};
                    xy = $D.getXY(target);
                    targetWidth = $D.getClientWidth(target);
                    targetHeight = $D.getClientHeight(target);
                    targetPos.x = xy[0];
                    targetPos.y = xy[1];
                    targetPos.w = targetWidth;
                    targetPos.h = targetHeight;
                    this.dropPos[i] = targetPos;
                }
            }
            
            this.dragController[addId] = new J.ui.Drag(el,effectEl,this.limiteOption);
            $E.addObserver(this.dragController[addId],"beforeStart",J.bind(onDragBeforeStart,this));
            $E.addObserver(this.dragController[addId],"start",J.bind(onDragStart,this));
            $E.addObserver(this.dragController[addId],"move",J.bind(onDragMove,this));
            $E.addObserver(this.dragController[addId],"overFlowBorder",J.bind(onDragOverFlow,this));
            $E.addObserver(this.dragController[addId],"end",J.bind(onDragEnd,this));
        },
        /**
         * 设置拖拽的边界限制
         * @param {Object} option
         * @see ui.Drag#setLimite
         */
        setLimite : function(option){
            for(var i in this.dragController){
                this.dragController[i].setLimite(option);
            }
        },
        /**
         * @private
         */
        cloneDashedEl : function(el){
            var dashedEl = $D.node("div");
            var className = this.option.className;
            if(className){
                $D.setClass(dashedEl,className);
            }else{
                $D.setStyle(dashedEl,"border","dashed 2px #fff");
                $D.setClass(dashedEl,el.className);
                $D.setStyle(dashedEl,"position","relative");
                $D.setStyle(dashedEl,"float","left");
                var width = el.offsetWidth - 10 * parseInt(dashedEl.style.borderWidth) + "px";
                var height = el.offsetHeight - 10 * parseInt(dashedEl.style.borderWidth) + "px"; 
                $D.setStyle(dashedEl,"width",width);
                $D.setStyle(dashedEl,"height",height);
            }
            this.dashedEl = dashedEl;
            if (el.nextSibling) {
                el.parentNode.insertBefore(dashedEl, el.nextSibling);
            }
            else {
                el.parentNode.appendChild(dashedEl);
            }
            this.tempEl = el;
            el.parentNode.removeChild(el);
            return dashedEl;
        },
        /**
         * @private
         */
        removeDashedEl : function(){
            if (this.dashedEl.nextSibling) {
                this.dashedEl.parentNode.insertBefore(this.tempEl, this.dashedEl.nextSibling);
            }
            else {
                this.dashedEl.parentNode.appendChild(this.tempEl);
            }
            this.dashedEl.parentNode.removeChild(this.dashedEl);
        },
        /**
         * @private
         */
        clone : function(el){
            var result;
            var jumpOut = false;
            var cloneEl = el.cloneNode(true);
            cloneEl.setAttribute("id","");
            $D.setStyle(cloneEl,"position","absolute");
            $D.setStyle(cloneEl,"zIndex","9999999");
            $D.setStyle(cloneEl,"background","none");
            return cloneEl;
        },
        /**
         * 锁定, 禁止拖动
         */
        lock: function(){
            this._isLock = true;
            for(var i in this.dragController){
                this.dragController[i].lock();
            }
        },
        /**
         * 解锁, 允许拖动
         */
        unlock: function(){
            this._isLock = false;
            for(var i in this.dragController){
                this.dragController[i].unlock();
            }
        },
        /**
         * 返回是否锁定
         */
        isLock: function(){
            return this._isLock;
        },
        /**
         * @private
         */
        forEachNode : function(arr,fun){
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    fun.call(thisp, arr[i], i, arr);
                }
            }
        }
        
    });
});
/**
 * tab模块
 */
Jx().$package(function(J){
    var $ = J.dom.id,
        $D = J.dom,
        $E = J.event;
    J.ui = J.ui || {};
    /**
     * Tab类
     * 
     * @memberOf ui
     * @name Tab
     * @class
     * @constructor
     * @param {Element} triggers tab head元素
     * @param {Element} sheets tab body元素
     * @param {Object} config 其他选项，如:isLimited,leftMargin...
     * 
     */
    J.ui.Tab = function(triggers,sheets,config){
        this.tabs = [];             //tab的集合
        this.currentTab = null;     //当前tab
        this.config = {
            defaultIndex : 0,       //默认的tab索引
            triggerEvent : 'click', //默认的触发事件
            slideEnabled : false,   //是否自动切换
            slideInterval : 5*1000,   //切换时间间隔
            slideDelay : 300,       //鼠标离开tab继续切换的延时
            autoInit : true,        //是否自动初始化
            /** @ignore */
            onShow:function(){ }    //默认的onShow事件处理函数
        };
    
        this.setConfig(config);

        if(triggers && sheets) {
            this.addRange(triggers,sheets);
            if(this.config.autoInit){
                this.init();
            }
        }
    };
    
    J.ui.Tab.prototype = 
    /**
     * @lends ui.Tab.prototype 
     */
    {
        /**
         * 初始化函数
         * @ignore
         *
         **/
        init:function(){
            var config = this.config,
                _this = this;

            J.array.forEach(this.tabs, function(tab, index, tabs){
                $E.on(tab.trigger,config['triggerEvent'], function(){
                    _this.select.call(_this,tab);
                });
                if(tab.sheet){
                    tab.sheet.style.display = 'none';
                }
            });
            
            this.select(this.tabs[config['defaultIndex']]);
            if(config['slideEnabled']){
                this.slide();
            }
        },
        /**
         * 设置config
         * @param {Object} config 配置项如{'slideEnabled':true,'defaultIndex':0,'autoInit':false}
         */
        setConfig:function(config){
            if(!config) return;
            for(var i in config){
                this.config[i] = config[i];
            }
        },
        /**
         * 增加tab
         * @param {Object} tab {trigger:aaaa, sheet:bbbb} 
         * trigger: {String},{HTMLElement}
         * sheet: {String},{HTMLElement}
         * */
        add:function(tab){
            if(!tab) return;
            
            if(tab.trigger){
                this.tabs.push(tab);
                tab.trigger.style.display = 'block';
            }
        },
        
        /**
         * 增加tab数组
         * @param {Array} triggers HTMLElement 数组
         * @param {Array} sheets HTMLElement 数组
         * */
        addRange:function(triggers, sheets){
            if(!triggers||!sheets) return;
            if(triggers.length && sheets.length && triggers.length == sheets.length){
                for(var i = 0, len = triggers.length; i < len; i++){
                    this.add({trigger:triggers[i],sheet:sheets[i]});
                }
            }
        },
        
        /**
         * 设置tab为当前tab并显示
         * @param {Object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
         * */
        select:function(tab){
            if(!tab || (!!this.currentTab && tab.trigger == this.currentTab.trigger)) return;
            if(this.currentTab){
                $D.removeClass(this.currentTab.trigger, 'current');
                if(this.currentTab.sheet){
                    this.currentTab.sheet.style.display = 'none';
                }
                
            }
            this.currentTab = tab;
            this.show();
        },
        
        /**
         * 设置tab为隐藏的
         * @param {Object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
         * */
        remove:function(tab){
            if(!tab) return;
            
            
            if(tab.trigger){
                $D.removeClass(tab.trigger, 'current');
                tab.trigger.style.display = 'none';
            }
            if(tab.sheet){
                tab.sheet.style.display = 'none';
            }
            
            var index=this.indexOf(tab);
            this.tabs.splice(index,index);
    
            if(tab.trigger == this.currentTab.trigger){
                if(index==0){
                    //this.currentTab=this.tabs[(index+1)];
                    this.select(this.tabs[(index+1)]);
                }else{
                    //this.currentTab=this.tabs[(index-1)];
                    this.select(this.tabs[(index-1)]);
                }
            }
        },
        /**
         * 显示当前被选中的tab
         * */
        show:function(){
            
            if(this.currentTab.trigger){
                this.currentTab.trigger.style.display = 'block';
            }
            $D.addClass(this.currentTab.trigger, 'current');
            if(this.currentTab.sheet){
                this.currentTab.sheet.style.display = 'block';
            }
            //触发自定义显示对象
            //tealin
            this.config.onShow.call(this);
            $E.notifyObservers(this, "show", this.currentTab);

        },
        /**
         * 自动切换
         * */
        slide:function(){
            var config = this.config,
                _this = this,
                intervalId,
                delayId;
            J.array.forEach(this.tabs, function(tab, index, tabs){
                $E.on(tab.trigger, 'mouseover' , clear);
                $E.on(tab.sheet, 'mouseover' , clear);
                
                $E.on(tab.trigger, 'mouseout' , delay);
                $E.on(tab.sheet, 'mouseout' , delay);
            });
            start();
            function start() {
                var i = _this.indexOf(_this.currentTab);
                if( i == -1 ) return;
                intervalId = window.setInterval(function(){
                    var tab = _this.tabs[ ++i % _this.tabs.length ];
                    if(tab){
                        _this.select(tab);
                    }
                },config['slideInterval']);
            }
            function clear() {
                window.clearTimeout(delayId);
                window.clearInterval(intervalId);   
            }
            function delay() {
                delayId = window.setTimeout(start,config['slideDelay']);
            }
        },
        /**
        * 切换到下一个
        **/
        next:function(){
            var _this = this;
            var i = _this.indexOf(_this.currentTab);
            if(i == -1) return;
            if(++i == _this.tabs.length){
                i = 0;
            }
            var tab = _this.tabs[i];
            if(tab){
                _this.select(tab);
            }
        },
        /**
        * 切换到上一个
        **/
        prev:function(){
            var _this = this;
            var i = _this.indexOf(_this.currentTab);
            if(i == -1) return;
            if(--i == -1){
                i = _this.tabs.length - 1;
            }
            var tab = _this.tabs[i];
            if(tab){
                _this.select(tab);
            }
        },
        /**
         * 获取tab在tabs数组中的索引
         * @param {Object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
         * */
        indexOf:function(tab){
            for(var i = 0, len = this.tabs.length; i < len; i++){
                if(tab.trigger == this.tabs[i].trigger)
                    return i;
            }
            return -1;
        }
    };

});
/* == J.ui.TextBox =============================================
 * Copyright (c) 2011, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-1-22 ----- */
 
 
Jet().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
    
    J.ui = J.ui || {};
    
    /**
     * 【TextBox】
     * 
     * @class 
     * @name TextBox
     * @memberOf ui
     * @constructor
     * @param {Object} option 构造参数
     * @example
     * {
     * id: '',//random
     * name: id,
     * container: document.body,
     * className: '' ,
     * title: '',
     * text: '',
     * height: 200,
     * width: 200,
     * limit: 200,
     * readOnly: false,
     * hintLink: [{
     *  text:'',
     *  click:''
     *  }]
     * }
     * 
     * var sharebox = new J.ui.TextBox({
     *      title: '分享',
     *      text: '内容',
     *      hint: [{
     *          text: '更多',
     *          click: ''                   
     *      }]
     *  });
     *  sharebox.show(200, 200);
     * @since version 1.0
     * @description
     */
    var TextBox = J.ui.TextBox= new J.Class(
    /**
     * @lends ui.TextBox.prototype
     */
    {
        /**
         * @ignore
         */
        init: function(option){
            var id = 'share_box_' + (option.id || (new Date().getTime()));
            var name = option.name || id;
            var parent = option.container || document.body;
            var className = option.className || '';
            var content = option.text || '';
            this._titleHeight = 22;
            this._footerHeight = 26;
            this._padding = 4 * 2;
            this._margin = 4 * 2;
            option.width = option.width || 200;
            option.height = option.height || 100;
            option.limit = option.limit || 0;
            option.isPopup = option.isPopup || false;
            option.readOnly = option.readOnly || false;
            option.maskIframe = option.maskIframe || false;
            option.hasCloseButton = option.hasCloseButton === false ? false : true;
            this._isShow = false;
            
            var container = this._el = $D.node('div', {
                id: id,
                'class': 'share_box ' + className
            });
                
            var html = '\
                <div class="share_box_title" id="'+ id +'_title">\
                    <div class="share_box_titleTxt" id="'+ id +'_titleTxt"></div>\
                </div>\
                <div class="share_box_body" id="'+ id +'_body">\
                    <!--textarea class="share_box_text" id="'+ id +'_text"></textarea-->\
                </div>\
                <div class="share_box_footer" id="'+ id +'_footer">\
                    <div class="share_box_showthumb" id="'+id+'_showthumb"></div>\
                    <div class="share_box_hint" id="'+ id +'_hint"></div>\
                    <div class="share_box_count" id="'+ id +'_count"></div>\
                </div>\
                <div>\
                    <img id="'+id+'_thumb" class="share_box_thumb" src="'+option.thumb+'" width=211 height=127 />\
                </div>';
            
            if(option.maskIframe){
                html += '<iframe class="ui_maskBgIframe" src="'+alloy.CONST.MAIN_URL+'domain.html;" border="0"></iframe>';
            }
            
            container.innerHTML = html;
            parent.appendChild(container);
            if(option.isPopup){
                this._panel = new J.ui.PopupBox({
                    id: id,
                    name: name,
                    container: container
                });
            }else{
                this._panel = new J.ui.Panel({
                    id: id,
                    name: name,
                    container: container
                });
            }
            
            
            this._shareBoxTitleTxt = $D.id(id + '_titleTxt');
            this._shareBoxTitle = $D.id(id + '_title');
            this._shareBoxHint = $D.id(id + '_hint');
            this._shareBoxFooter = $D.id(id + '_footer');
            this._shareBoxBody = $D.id(id + '_body');
            this._shareBoxCount = $D.id(id + '_count');
            this._shareBoxShowthumb=$D.id(id + '_showthumb');
            this._shareBoxThumb=$D.id(id + '_thumb');
            
            var areaHtml = '<strong class="share_big_quote share_left_quote">“</strong><textarea class="share_box_text" id="'+ id +'_text"></textarea><strong class="share_big_quote share_right_quote">”</strong>';
            if(option.readOnly){
                //this._shareBoxText.readOnly = 'readonly';
                areaHtml = '<strong class="share_big_quote share_left_quote">“</strong><textarea class="share_box_text" id="'+ id +'_text" readOnly="readonly"></textarea><strong class="share_big_quote share_right_quote">”</strong>';
            }
            if(!option.thumb){
                $D.hide(this._shareBoxShowthumb);
            }
            this._shareBoxBody.innerHTML = areaHtml;
            this._shareBoxText = $D.id(id + '_text');
            
            var context = this;
            var observer = {
                /**
                 * @ignore
                 */
                onSendButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'clickSendButton');
                },
                /**
                 * @ignore
                 */
                onCloseButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    context.hide();
                    $E.notifyObservers(context, 'clickCloseButton');
                },
                /**
                 * @ignore
                 */
                onTextAreaKeyUp: function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    alloy.util.subStringByChar(e, option.limit);
                },
                /**
                 * @ignore
                 */
                toggleThumb: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if($D.isShow(context._shareBoxThumb)){
                        $D.hide(context._shareBoxThumb);
                    }
                    else{
                        $D.show(context._shareBoxThumb);
                    }
                }
            };
            
            this._sendButton = new J.ui.Button({
                'appendTo' : this._shareBoxFooter,
                'className' : 'window_button window_ok',
                'isStopPropagation' : true,
                'text' : '发表' ,
                'event' : {
                    'click' : observer.onSendButtonClick
                }
            });
            this._sendButton.show();
            if(option.hasCloseButton){
                this._closeButton = new J.ui.Button({
                    'appendTo' : this._shareBoxTitle,
                    'className' : 'textbox_button',
                    'isStopPropagation' : true,
                    'title' : '关闭' ,
                    'event' : {
                        'click' : observer.onCloseButtonClick
                    }
                });
                this._closeButton.show();
            }
            
            this._shareBoxText.innerHTML = content;
            
            if(option.title){
                this._shareBoxTitleTxt.innerHTML = option.title;
                $D.show(this._shareBoxTitle);
            }
            if(option.hint){
                var spliter = '',
                    node = null;
                
                for(var i=0; i<option.hint.length; i++){
                    node = $D.node('a', {
                        'href': '###',
                        'class': 'share_box_hintLink'
                    });
                    node.innerHTML = option.hint[i].text;
                    $E.on(node, 'click', option.hint[i].click);
                    this._shareBoxHint.appendChild(node);
                }
            }
            if(option.limit){
                //暂时去掉数字提示
//              this._shareBoxCount.innerHTML = option.maxChar;
//              $D.show(this._shareBoxCount);
                $E.on(this._shareBoxText, 'keyup', observer.onTextAreaKeyUp);
            }
//            if(option.onTextAreaClick){
//                $E.on(this._shareBoxText, 'keyup', option.onTextAreaClick);
//            }
            $E.on(this._shareBoxShowthumb, 'click', observer.toggleThumb);
            
            this.setHeight(option.height);
            this.setWidth(option.width);
        },
        /**
         * 设置高度
         * @param {Number} height
         */
        setHeight: function(height){
            var h = height - this._titleHeight - this._footerHeight;
            $D.setStyle(this._shareBoxText, 'height', h + 'px');
        },
        /**
         * 设置宽度
         * @param {Number} width
         */
        setWidth: function(width){
            $D.setStyle(this._el, 'width', width + 'px');
            $D.setStyle(this._shareBoxText, 'width', (width - this._padding - this._margin) + 'px');
        },
        /**
         * @private
         */
        addMask: function(el){
            if(!J.browser.ie) 
                return;
            
            if(J.isString(el)){
                var iframe = '<iframe class="ui_maskBgIframe" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';
                return el+iframe;
            }else{
                var iframe = $D.node('iframe',{
                    'class': 'ui_maskBgIframe',
                    'src': 'about:blank'
                }); 
                el.appendChild(iframe);
            }
        },
        /**
         * 获取textbox所处节点
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 返回是否显示
         */
        isShow: function(){
            return this._isShow;    
        },
        /**
         * 在指定位置显示textbox
         * @param {Number} x
         * @param {Number} y
         */
        show: function(x, y){
            if(x && y){
                this._panel.setXY(x, y);
            }
            this._panel.show();
            this._isShow = true;
        },
        /**
         * 隐藏
         */
        hide: function(){
            this._panel.hide();
            this._isShow = false;
            $E.notifyObservers(this, 'hide');
        },
        /**
         * 获取用户输入的内容
         */
        getValue: function(){
            return this._shareBoxText.value;
        },
        /**
         * 设置输入框的内容
         */
        setValue: function(value){
            this._shareBoxText.value = value;
        },
        /**
         * 给状态栏设置提醒节点
         * @private
         */
        setHint: function(el){
            this._shareBoxHint.innerHTML = '';
            this._shareBoxHint.appendChild(el);
            $D.show(this._shareBoxHint);
        },
        /**
         * @private
         */
        setThumb: function(url){
            this._shareBoxThumb.src=url;
        }
    });
});     
        
        /** 
 * JX (Javascript eXtension tools) 
 * Copyright (c) 2011, Tencent.com, All rights reserved.
 *
 * @fileOverview Jet!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

Jx().$package(function (J) {
    var $ = J.dom.id,
        $D = J.dom,
        $S = J.string,
        $A = J.array,
        $E = J.event,
        $T = J.fx.transitions;
        
    // Tooltip类
    /**
     * 【Tooltip】
     * 
     * @class 
     * @memberOf ui
     * @constructor
     * @name Tooltip
     * @param {Element} els 需要生成tooltip的DOM节点
     * @param {Object} option 参数对象 option:{text:'tooltip内容，默认去title属性'}
     * @since version 1.0
     * @description Jx.ui.Tooltip是一个长方形的小提示，在用户将指针悬停在一个控件上时显示有关该控件用途的简短说明。
     */
    var Tooltip = new J.Class(
    /**
     * @lends ui.Tooltip.prototype
     */ 
    {
        /**
        * @ignore
        */
        init: function (els, option) {
            var tooltipContext = this;
            option = option || {};
            
            tooltipContext.id = Tooltip.count;
            Tooltip.count++;
            
            $A.forEach(els, function(el,i,els){
                var text = option.text || el.getAttribute("title");
                
                // 检测文字所需要的宽度
                var width;
                var tempEl = $D.node("div",{
                    style:"float:left;width:auto;background:blue;visibility:hidden;"
                });
                document.body.appendChild(tempEl);
                tempEl.innerHTML = text;
                width = $D.getClientWidth(tempEl, "width");
                width += (width % 2);
                document.body.removeChild(tempEl);
                tempEl = null;
                
                
                
                el.removeAttribute("title");

                if(!J.isUndefined(text)) {
                    /**
                     * @ignore
                     */
                    tooltipContext.mouseMove = function(e){
                        var tooltipEL = tooltipContext.tooltipEL;
                        var tipX = e.pageX + 24;
                        var tipY = e.pageY - 18;
                        var tipWidth = $D.getWidth(tooltipEL);
                        var tipHeight = $D.getHeight(tooltipEL);
//                      if(tipX + tipWidth > $D.getScrollLeft(document.body) + $D.getWidth(document.body)){
//                          tipX = e.pageX - tipWidth;
//                      }
//                      if($D.getHeight(document.body)+$D.getScrollTop(document.body) < tipY + tipHeight){
//                          tipY = e.pageY - tipHeight;
//                      }
                        $D.setXY(tooltipEL, tipX, tipY);
                    };
                    
                    $E.on(el, "mouseover", function(e){
                        var tipX = e.pageX + 24;
                        var tipY = e.pageY - 18;
                        if(!tooltipContext.tooltipEL){
                            tooltipContext.createTooltip();
                        }
                        var tooltipTextEL = tooltipContext.tooltipTextEL;
                        tooltipTextEL.innerHTML = text;
                        
                        tooltipContext.showIn({width:width});
                        
                    });
                    
                    $E.on(el, "mouseout", function(e){
                        if(tooltipContext.tooltipEL){
                            tooltipContext.showOut({width:width});
                        }
                    });
                }
            });
            
        },
        
        /**
        * @private
        */
        createTooltip: function(){
            var tooltipContext = this;
            var tooltipEL;
            var tooltipTextEL;
            var tempLeftEL;
            var tempRightEL;
            
            
            var tooltipTextELBg = 'background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip_c.png?t=20111011001);',
                tooltipLeftELBg =  'background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip.png?t=20111011001) no-repeat;',
                tooltipRightELBg = ' background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip.png?t=20111011001) no-repeat right';
            
            if(J.browser.ie && J.browser.ie == 6){
                tooltipTextELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_c.png?t=20111011001", sizingMethod="scale");';
                tooltipLeftELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_l.png?t=20111011001", sizingMethod="scale");';
                tooltipRightELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_r.png?t=20111011001", sizingMethod="scale");';
            }
            
            tooltipContext.tooltipEL = tooltipEL = $D.node("div",{
                id:"jxTooltip_"+tooltipContext.id,
                style:'position: absolute; margin:10px; width:107px; height:38px; z-index: 10000; display: none;'
            });
            
            tooltipContext.tooltipTextEL = tooltipTextEL = $D.node("div",{
                id:"jxTooltipText_"+tooltipContext.id,
                style:'line-height:30px; width:100%; height:38px; color:white; overflow:hidden;' + tooltipTextELBg
            });

            tempLeftEL = $D.node("div",{
                style:'position:absolute; left:-12px; width:12px; height:38px; overflow:hidden;' + tooltipLeftELBg 
            });
            tempRightEL = $D.node("div",{
                style:'position:absolute; right:-12px; width:12px; height:38px; overflow:hidden;' + tooltipRightELBg
            });
            
            tooltipEL.appendChild(tempLeftEL);
            tooltipEL.appendChild(tempRightEL);
            tooltipEL.appendChild(tooltipTextEL);

            document.body.appendChild(tooltipEL);
            //$D.setStyle(tooltipEL, "opacity", 0);
            tooltipContext.showInAnimation = new J.fx.Animation({
                element:tooltipEL,
                property:"width",
                from:0,
                to:1,
                unit:"px",
                duration:300,
                transition:$T.sinusoidal.easeOut
            });
            
            tooltipContext.showOutAnimation = new J.fx.Animation({
                element:tooltipEL,
                property:"width",
                from:1,
                to:0,
                unit:"px",
                duration:300,
                transition:$T.sinusoidal.easeOut
            });
            
            $E.addObserver(tooltipContext.showOutAnimation,"end", function(){
                $D.hide(tooltipEL);
            });
            
        },
        
        /**
        * 显示tooltip
        * @param {Object} option 参数对象 option:{width:'tooltip宽度'}
        * @return 
        */
        showIn:function(option){
            var tooltipContext = this;
            var tooltipEL = tooltipContext.tooltipEL;
            
            tooltipContext.showOutAnimation.end();
            $E.on(document, "mousemove", tooltipContext.mouseMove);
            $D.show(tooltipEL);
            tooltipContext.showInAnimation.start(0,option.width);
        },
        
        /**
        * 隐藏tooltip
        * @param {Object} option 参数对象 option:{width:'tooltip宽度'}
        * @return 
        */
        showOut:function(option){
            var tooltipContext = this;
            var tooltipEL = tooltipContext.tooltipEL;
            
            tooltipContext.showInAnimation.end();
            //alert(option.width)

            tooltipContext.showOutAnimation.start(option.width,0);
            $E.addObserver(tooltipContext.showOutAnimation, 'end', function(e){
                $E.off(document, "mousemove", tooltipContext.mouseMove);
            });
            //$D.hide(tooltipEL);
        },
        
        /**
        * 关于tooltip
        * @private
        */
        about:function(){
            alert("Jx().ui.Tooltip() by Jetyu of Tencent!");
        }
       

    });


    
//  Tooltip.options = {
//      src: "http://image.apple.com/global/elements/zoomerlay/zoomerlay_tooltip.png?t=20111011001",
//      pos: "top",
//      dist: 5,
//      deadspace: 0
//  };
    
    Tooltip.count = 0;
    
    J.ui = J.ui || {};
    J.ui.Tooltip = Tooltip;
});/** 
 * JX (Javascript eXtension tools) 
 * Copyright (c) 2011, Tencent.com, All rights reserved.
 *
 * @fileOverview Jet!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */
 Jx().$package(function (J) {
     var $D = J.dom,
         $E = J.event;
    var doc;
    
    J.ui = J.ui || {};
    
    
     /**
   * 【TouchScroller】
   * 
   * @class 
   * @memberOf ui
   * @name TouchScroller
   * @constructor
   * 
   * @param {Element} dom 需要滚动的内容容器
   * @param {Element} touchdom 用于接收触摸时间的容器，可以省略
   * @since version 1.0
   * @description Jx.ui.TouchScroller 是提供IOS下的html元素触摸滚动功能的一个组件
   */
    var TouchScroller= J.ui.TouchScroller = new J.Class(
    /**
     * @lends ui.TouchScroller.prototype
     */
    {
        //是否要增加动画
        //@TODO options处添加滚动方向设置
        container:null,
        _dx:0,
        _dy:0,
        _posy:0,
        _posx:0,
        _maxOffsetX:0,
        _maxOffsetY:0,
       /**
        * @ignore
        */
        init: function(dom,touchdom,option){
          this.container = J.isString(dom) ? $D.id(dom) : dom;
          this.touchContainer = touchdom||this.container;
          var context = this;
          this.observer = {
            /**
             * @ignore
             */
            onTouchStart : function(e){
              //e.stopPropagation();
              //e.preventDefault();
              if(e.changedTouches.length>1){
                return;
              }
              var touch = e.changedTouches[0];
              context._dx = context.container.scrollLeft;
              context._dy = context.container.scrollTop;
              context._posx = touch.pageX;
              context._posy = touch.pageY;
              context.maxOffsetX = context.container.scrollWidth - context.container.clientWidth;
              context.maxOffsetY = context.container.scrollHeight - context.container.clientHeight;
              $E.on(context.touchContainer,'touchmove',context.observer.onTouchMove);
              $E.on(context.touchContainer,'touchend',context.observer.onTouchEnd);
            },
            /**
             * @ignore
             */
            onTouchMove : function(e){
              //@TODO
              //e.stopPropagation();
              //e.preventDefault();
              var touch=e.changedTouches[0];
              var px=touch.pageX;
              var py=touch.pageY;
              var needMove=false;
              context._dx += context._posx - px;
              context._dy += context._posy - py;
              context._posx=px;
              context._posy=py;
              if(context._dx<0){
                context._dx=0;
              }
              if(context._dy<0){
                context._dy=0;
              }
              if(context._dx>context.maxOffsetX){
                context._dx = context.maxOffsetX;
              }
              if(context._dy>context.maxOffsetY){
                context._dy = context.maxOffsetY;
              }
              context.container.scrollLeft = context._dx;
              context.container.scrollTop = context._dy;
            },
            /**
             * @ignore
             */
            onTouchEnd : function(e){
              $E.off(context.touchContainer,'touchmove',context.observer.onTouchMove);
              $E.off(context.touchContainer,'touchend',context.observer.onTouchEnd);
            }
          };
          $E.on(this.touchContainer,'touchstart',this.observer.onTouchStart);
        },
        /**
         * @private
         */
        destroy : function(){
          $E.off(this.touchContainer,'touchstart',this.observer.onTouchStart);
          this.container=null;
        },
        /**
         * 阻止触摸滚动功能
         */
        disable : function(){
          $E.off(this.touchContainer,'touchstart',this.observer.onTouchStart);
        },
        /**
         * 开启触摸滚动功能
         */
        enable : function(){
          $E.on(this.touchContainer,'touchstart',this.observer.onTouchStart);
        }
    });
});/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jet!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jet.calendar
 * 
 * Need package:
 * jet.core.js
 * 
 */


/**
 *  Yukin.2011-11-13
 *  3.[Javascript core]: calendar 日历类
 */
Jet().$package(function(J){
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        calendarCount = 1;
    /**
     * 【CalendarClass】日历类
     * 
     * @class 
     * @memberOf ui
     * @name CalendarClass
     * @constructor
     * @param {Object} option 参数对象
     */
    var CalendarClass = function(){             
        var inputH = 20;
        var inputW = 100;
        var sUserAgent = navigator.userAgent;
        var isOpera = sUserAgent.indexOf("Opera") > -1;
        var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
        var _classContext = this,
            _dom = { main : null,//日历窗口dom
                     target : null, //获取值存放目标
                     title : null,//标题：显示当前年月
                     date : null, //天列表
                     
                     selectMonth : null,
                     selectYear: null
                    },
            _now = {year: null, month: null, date: null},//随着选择变化的选中日期对象
            _today = null,//当日日期对象
            _hightList = [],//需要高亮的日期列表 
            _isOnlyHight = false,
            _callBack = null,//赋值后回调
            _timer = null,
            _needSelect = true;//对于日期和年是否需要支持下来选择
            
        function HS_DateAdd(interval,number,date){
            number = parseInt(number);
            if (typeof(date)=="string"){
                var date = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2]);
            }
            if (typeof(date)=="object"){
                var date = date;
            }
            switch(interval){
                case "y":return new Date(date.getFullYear()+number,date.getMonth(),date.getDate()); break;
                case "m":return new Date(date.getFullYear(),date.getMonth()+number,HS_checkDate(date.getFullYear(),date.getMonth()+number,date.getDate())); break;
                case "d":return new Date(date.getFullYear(),date.getMonth(),date.getDate()+number); break;
                case "w":return new Date(date.getFullYear(),date.getMonth(),7*number+date.getDate()); break;
            }
        }
         
        function HS_checkDate(year,month,date){
            var enddate = ["31","28","31","30","31","30","31","31","30","31","30","31"];
            var returnDate = "";
            if (year%4==0){
                enddate[1]="29";
            }
            if (date>enddate[month]){
                returnDate = enddate[month];
            }else{
                returnDate = date;
            }
            return returnDate;
        }
         
        function HS_WeekDay(date){
            var theDate;
            if (typeof(date)=="string"){
                theDate = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2]);
            }
            if (typeof(date)=="object"){
                theDate = date;
            }
            return theDate.getDay();
        }
        //设置当前日期对象(根据选择动态变化)
        function setNow( date ){
            var now;
            if (typeof(arguments[0])=="string"){
                var selectDate = arguments[0].split("-");
                var year = selectDate[0];
                var month = parseInt(selectDate[1])-1+"";
                var date = selectDate[2];
                now = new Date(year,month,date);
            }else if (typeof(arguments[0])=="object"){
                now = arguments[0];
            }
            _now.year = now.getFullYear();
            _now.month = now.getMonth();
            _now.date = now.getDate();
        }
        function HS_calender(){
            var lis = "";            
            setNow(arguments[0]); 
            var yearMonthStr = _now.year+"-"+_now.month;    
            var lastMonthEndDate = HS_DateAdd("d","-1",yearMonthStr+"-01").getDate();
            var lastMonthDate = HS_WeekDay(yearMonthStr+"-01");
            var thisMonthLastDate = HS_DateAdd("d","-1",_now.year+"-"+(parseInt(_now.month)+1).toString()+"-01");
            var thisMonthEndDate = thisMonthLastDate.getDate();
            var thisMonthEndDay = thisMonthLastDate.getDay();
            
            var today = _today.getFullYear()+"-";
            var month = _today.getMonth() + 1;
            today += month < 10 ? '0' : '';
            today += month.toString() + '-';
            today += _today.getDate() < 10 ? '0'  : '';
            today += _today.getDate().toString();
             //生成日期内容：可能存在三部分：上个月，当前月，下个月的       
             //上个月
            var i;
            for (i=0; i<lastMonthDate; i++){ // Last Month's Date
                lis = "<li class='lastMonthDate'>"+lastMonthEndDate+"</li>" + lis;
                lastMonthEndDate--;
            }
            //当前月   
            var month = parseInt(_now.month)+1;
            month = month < 10 ? '0' + month.toString() : month;
            
            for (i=1; i<=thisMonthEndDate; i++){ // Current Month's Date
                var date = i < 10 ? '0' + i.toString() : i;
                var dateStr = _now.year + "-" + month + "-" + date;
                var checkHight = checkHightLight(dateStr); 
                var hightClass = checkHight ? ' class="have"' : '';             
                var todayClass = today == dateStr ? ' class="today"' : '';  
                if( _isOnlyHight ){
                    if( checkHight ){
                        lis += "<li "+hightClass+"><a href='###' "+todayClass+" title='"+dateStr+"'>"+i+"</a></li>";    
                    }else{
                        lis += "<li "+hightClass+">"+i+"</li>";     
                    }
                }else{
                    lis += "<li "+hightClass+"><a href='###' "+todayClass+" title='"+dateStr+"'>"+i+"</a></li>";        
                }
            }
            //下个月
            var j=1;
            for (i=thisMonthEndDay; i<6; i++){ // Next Month's Date
                lis += "<li class='nextMonthDate'>"+j+"</li>";
                j++;
            }
             
            //生成标题
            var CalenderTitle = "<a href='###' class='nextMonth' title='下一个月'>»</a>";
            CalenderTitle += "<a href='###' class='lastMonth' title='上一个月'>«</a>";
            CalenderTitle += "<span class='selectThisYear'><a href='###' class='toSelectYear' title='点击这里选择年份' >"+
                              _now.year+"</a></span>年<span class='selectThisMonth'>"+
                              "<a href='###' class='toSelectMonth' title='点击这里选择月份'>"+
                              (parseInt(_now.month)+1).toString()+"</a></span>月";
            if (arguments.length>1){                
                _dom.date.innerHTML = lis;
                _dom.title.innerHTML =  CalenderTitle;
                bindTitleClick();
                bindDateClick();
                bindSelectClick();
            }else{
                //日历内容框架
                var CalenderBox ="<div id='calender' class='calender'>\
                                    <div class='calenderTitle'>"+CalenderTitle+"</div>\
                                    <div class='calenderBody'>\
                                        <ul class='day'>\
                                            <li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>\
                                        </ul>\
                                        <ul class='date' id='thisMonthDate'>"+lis+"</ul>\
                                    </div>\
                                    <div class='calenderBottom'>\
                                        <span><a href='###' class='closeCalender' >关闭</a><span></span>\
                                        <span><a href='###' class='calToToday' title='"+dateStr+"'>今天</a></span>\
                                        <span><a href='###' class='calEmptyInput' title=''>置空</a></span>\
                                    </div>\
                                  </div>";
                                  
                return CalenderBox;
            }
        }
        function _selectThisDay(dom){       
            if( _dom.target.tagName == 'INPUT' ){
                _dom.target.value = dom.title;  
            }else{
                _dom.target.innerHTML = dom.title;  
            }
            _callBack(dom.title);
            _classContext.close();
        }
         
        function _setEmpty(d){
            if( _dom.target.tagName == 'INPUT' ){
                _dom.target.value = ''; 
            }else{
                _dom.target.innerHTML = ''; 
            }
            if( _dom.main ){
                $D.hide(_dom.main);
            }
        }
        //生成选择年的select列表
        function CalenderselectYear(obj){
            var opt = "";
            var thisYear = obj.innerHTML;
            var i;
            for (i=1970; i<=2020; i++){
                if (i==thisYear){
                    opt += "<option value="+i+" selected>"+i+"</option>";
                }else{
                    opt += "<option value="+i+">"+i+"</option>";
                }
            }
            opt = "<select class='selectYear'>"+opt+"</select>";
            obj.parentNode.innerHTML = opt;
            _dom.selectYear = $D.mini('.selectYear', _dom.title)[0];
            $E.on(_dom.selectYear , 'onblur', function(){
                    selectThisYear(this);                                   
            });
            $E.on(_dom.selectYear ,  'change', function(){
                    selectThisYear(this);                                   
            });
        }
         
        function selectThisYear(obj){
            var month = '';
            if( _dom.selectMonth ){
                month = _dom.selectMonth.value;
            }else{
                month = obj.value+"-"+obj.parentNode.parentNode.getElementsByTagName("span")[1].getElementsByTagName("a")[0].innerHTML;
            }
            HS_calender(month + "-1", obj.parentNode);
        }
         
        function CalenderselectMonth(obj){
            var opt = "";
            var thisMonth = obj.innerHTML;
            var i;
            for (i=1; i<=12; i++){
            if (i==thisMonth){
                opt += "<option value="+i+" selected>"+i+"</option>";
            }else{
                opt += "<option value="+i+">"+i+"</option>";
            }
            }
            opt = "<select class='selectMonth'>"+opt+"</select>";
            obj.parentNode.innerHTML = opt;
            _dom.selectMonth = $D.mini('.selectMonth', _dom.title)[0];
            $E.on(_dom.selectMonth , 'onblur', function(){
                    selectThisMonth(this);                                  
            });
            $E.on(_dom.selectMonth, 'change', function(){
                    selectThisMonth(this);                                  
            });
        }
         
        function selectThisMonth(obj){ 
            var year = '';
            if( _dom.selectYear ){
                year = _dom.selectYear.value;
            }else{
                year = obj.parentNode.parentNode.getElementsByTagName("span")[0].getElementsByTagName("a")[0].innerHTML;
            }
            HS_calender(year+"-"+obj.value+"-1",obj.parentNode);
        }
         //获取控件X坐标
        function getDefineX(objectId){    
            var iPositionX=objectId.offsetLeft;  
            while(objectId=objectId.offsetParent){      
                iPositionX+=objectId.offsetLeft;    
            }
            return iPositionX;  
        }
        //获取控件Y坐标
        function getDefineY(objectId)  
        {
            var iPositionY=objectId.offsetTop;  
            while(objectId=objectId.offsetParent){
                iPositionY+=objectId.offsetTop;  
            }  
            return iPositionY;  
        }
         
        var oSpanClick = function(oEvent){
            if(oEvent.type =="click"){
                if(isIE){
                    oEvent = window.event;
                    oEvent.returnValue = false;
                }else{
                    oEvent.preventDefault();
                }
            }
        }
         
        //绑定公共按钮
        var bindActClick = function(){
            //关闭
            $E.on($D.mini('.closeCalender', _dom.main)[0], 'click', _classContext.close );  
            //定位今天
            $E.on($D.mini('.calToToday', _dom.main)[0], 'click', function(){ _selectThisDay(this); } ); 
            //清除输入
            $E.on($D.mini('.calEmptyInput', _dom.main)[0], 'click', function(){ _setEmpty(this); } );                                                                   
                                                
        };
        //绑定日期点击
        var bindDateClick = function(){
            //绑定日期单击
            var domArr = $D.mini('a',_dom.date); 
            for(var key in domArr){ 
                $E.on( domArr[key], 'click', function(){ 
                    _selectThisDay(this);                             
                });
            }
                
        };
        //绑定选择年月
        var bindSelectClick = function(){
            var toSelectYear  = $D.mini('.toSelectYear', _dom.title)[0];
            var toSelectMonth = $D.mini('.toSelectMonth', _dom.title)[0];
            if( !_needSelect ){
                toSelectYear.title = '';
                $D.setStyle(toSelectYear,'cursor','default');
                toSelectMonth.title = '';
                $D.setStyle(toSelectMonth,'cursor','default');
                return false;   
            }
            $E.on( toSelectYear, 'click', function(){ 
                CalenderselectYear(this);
            });             
            $E.on( toSelectMonth, 'click', function(){ 
                CalenderselectMonth(this);
            }); 
        };
        //绑定标题点击项：上下月
        var bindTitleClick = function(){
            var tmpDate = _now.year+"-"+_now.month+"-"+_now.date; 
            $E.on( $D.mini('.nextMonth', _dom.title)[0], 'click', function(){ 
                HS_calender(HS_DateAdd('m', 1, tmpDate),this);
            });             
            $E.on( $D.mini('.lastMonth', _dom.title)[0], 'click', function(){ 
                HS_calender(HS_DateAdd('m', -1, tmpDate),this);
            }); 
        };
        //判断日期是否在高亮列表中
        var checkHightLight = function(date){
            for(var key in _hightList ){
                if( _hightList[key] == date ){
                    return true;    
                }
            }
            return false;            
        };
        
        
        
        /**
         * 关闭日历
         * @name close
         * @function
         * @memberOf ui.CalendarClass.prototype
         */
        this.close = function( ){   
            if( _dom.main ){
                $D.hide(_dom.main);
            }
        };
        /**
         * 显示日历
         * @name show
         * @function
         * @memberOf ui.CalendarClass.prototype
         */
        this.show = function(){
            if( _dom.main ){
                $D.show(_dom.main);
                var targetObj = _dom.target;
                _dom.main.style.left = getDefineX(targetObj)+"px";          
                _dom.main.style.top = getDefineY(targetObj)+inputH+"px";
            }
        };
        /**
         * 销毁日历
         * @name destroy
         * @function
         * @memberOf ui.CalendarClass.prototype
         */
        this.destroy = function(){
            if( _dom.main ){
                _dom.main.parentNode.removeChild(_dom.main);
                _dom.main = null;
            }   
        };
         
        /**
         * 设置日历 
         * 
         * @function
         * @name setCalendar
         * @memberOf ui.CalendarClass.prototype
         *  
         * @param {HTMLElement} targetObj 目标对象。可以为input、div  
         * @param {Object} opt 初始化参数:
         *                  showBottom:是否显示日历操作按钮，<br/>
         *                  hightList:需要高亮的日期列表.格式：['2011-01-01','2011-01-05']<br/>
         *                  isOnlyHight:是否只有高亮的日期才可以点击<br/>
         *                  _needSelect:标题中的当前的年和月是否需要点击出现下拉选择列表,<br/>
         *                  today:今天的时间戳<br/>
         * @param {Function} callBack targetObj赋值后回调此函数
         *  
         */
        this.setCalendar = function( targetObj, opt, callBack ){
            //首次生成日历，之后隐藏或显示调用日历
            /*_dom.main = $D.id('calenderspan');//document.getElementById('calenderspan');
            if(_dom.main == null){
                _dom.main = document.createElement("span");
                _dom.main.id = "calenderspan";
                _dom.main.innerHTML = HS_calender(new Date());
                _dom.main.style.position = "absolute";
                document.body.insertBefore(_dom.main,document.body.lastChild);
                bindActClick();
            }else{
                $D.show(_dom.main);//_dom.main.style.display = '';
            }*/
            //屏蔽鼠标点击事件
            /*if(isIE){
                _dom.main.attachEvent("onclick",oSpanClick);
            }else{
                _dom.main.addEventListener("click",oSpanClick,false);
                //inputObj.addEventListener("click",oSpanClick,false);
            }*/
            opt = opt || {};
            opt.showBottom = opt.showBottom || false;
            _hightList = opt.hightList || [];//高亮指定日期列表.dateList:{'2011-01-01','2010-01-02'}
            _isOnlyHight = opt.isOnlyHight || false;//是否只是高亮列表才可以点击
            _needSelect = J.isUndefined(opt.needSelect) ? true : opt.needSelect;
            opt.today = opt.today || 0;
            if( !J.isUndefined(callBack) ){
                _callBack = callBack;//设置成功后回调  
            }
            if( !_dom.main ){                
                _dom.main = document.createElement("span");
                _dom.main.id = "calenderspan_" + ( calendarCount++ );
                _today = new Date();
                if( opt.today != 0 ){
                    _today.setTime(opt.today);
                }
                _dom.main.innerHTML = HS_calender( _today ); ;
                _dom.main.className = 'calendarBox';//style.position = "absolute";
                _dom.main.style.display = 'none';
                document.body.insertBefore(_dom.main, document.body.lastChild);
                
                _dom.title  = $D.mini('.calenderTitle', _dom.main)[0];
                _dom.date = $D.mini('.date', _dom.main)[0];
                bindTitleClick();
                bindActClick();
                bindDateClick();
                bindSelectClick();
                if( !opt.showBottom ){
                    if( _dom.main ){
                        $D.hide( $D.mini('.calenderBottom', _dom.main)[0] );
                    }
                }
                $E.on(_dom.main, 'mouseout',function(evt){ 
                    var el = _dom.main; 
                    var reltg = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;  
                    try{
                        var _ic = el.contains ? el != reltg && el.contains(reltg) : !!(el.compareDocumentPosition(reltg) & 16);    
                        if(!_ic){
                            _classContext.close();
                        } 
                    }catch(e){}
                });              
            }
            _dom.target = targetObj;                        
        }
        
         
        
    };
    J.ui = J.ui || {};
    if(!J.ui.calendar ){
        /**
         * 默认初始化的日历实例, 可以直接使用
         * @link ui.CalendarClass
         * @field
         * @memberOf ui
         * @name calendar
         */
        J.ui.calendar = new CalendarClass;
    }
    //日历类，可以实例化多个
    J.ui.CalendarClass = CalendarClass;

});










/**
 * 
 * Find more about the scrolling function at
 * http://cubiq.org/iscroll
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 3.7.1 - Last updated: 2010.10.08
 * 
 */

Jx().$package(function(J){
/**
 * iPad 的自定义滚动条
 * @class 
 * @memberOf ui
 * @name iScroll
 * @constructor
 * @param {HTMLElement} el
 * @param {Object} options
 * 
 * @since version 1.0
 */
function iScroll (el, options) {
    var that = this, i;
    that.element = typeof el == 'object' ? el : document.getElementById(el);
    that.wrapper = that.element.parentNode;

    that.element.style.webkitTransitionProperty = '-webkit-transform';
    that.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
    that.element.style.webkitTransitionDuration = '0';
    that.element.style.webkitTransform = translateOpen + '0,0' + translateClose;

    // Default options
    that.options = {
        bounce: has3d,
        momentum: has3d,
        checkDOMChanges: true,
        topOnDOMChanges: false,
        hScrollbar: has3d,
        vScrollbar: has3d,
        fadeScrollbar: isIthing || !isTouch,
        shrinkScrollbar: isIthing || !isTouch,
        desktopCompatibility: false,
        overflow: 'auto',
        snap: false,
        bounceLock: false,
        scrollbarColor: 'rgba(0,0,0,0.5)',
        /** @ignore */
        onScrollEnd: function () {}
    };
    
    // User defined options
    if (typeof options == 'object') {
        for (i in options) {
            that.options[i] = options[i];
        }
    }

    if (that.options.desktopCompatibility) {
        that.options.overflow = 'hidden';
    }
    
    that.onScrollEnd = that.options.onScrollEnd;
    delete that.options.onScrollEnd;
    
    that.wrapper.style.overflow = that.options.overflow;
    
    that.refresh();

    window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);

    if (isTouch || that.options.desktopCompatibility) {
        that.element.addEventListener(START_EVENT, that, false);
        that.element.addEventListener(MOVE_EVENT, that, false);
        that.element.addEventListener(END_EVENT, that, false);
    }
    
    if (that.options.checkDOMChanges) {
        that.element.addEventListener('DOMSubtreeModified', that, false);
    }
}


iScroll.prototype = 
/**
 * @lends ui.iScroll.prototype
 */
{
    x: 0,
    y: 0,
    enabled: true,
    /** @ignore */
    handleEvent: function (e) {
        var that = this;
        
        switch (e.type) {
            case START_EVENT:
                that.touchStart(e);
                break;
            case MOVE_EVENT:
                that.touchMove(e);
                break;
            case END_EVENT:
                that.touchEnd(e);
                break;
            case 'webkitTransitionEnd':
                that.transitionEnd();
                break;
            case 'orientationchange':
            case 'resize':
                that.refresh();
                break;
            case 'DOMSubtreeModified':
                that.onDOMModified(e);
                break;
        }
    },
    /** @ignore */
    onDOMModified: function (e) {
        var that = this;

        // (Hopefully) execute onDOMModified only once
        if (e.target.parentNode != that.element) {
            return;
        }

        setTimeout(function () { that.refresh(); }, 0);

        if (that.options.topOnDOMChanges && (that.x!=0 || that.y!=0)) {
            that.scrollTo(0,0,'0');
        }
    },
    /**
     * 刷新滚动条
     */
    refresh: function () {
        var that = this,
            resetX = that.x, resetY = that.y,
            snap;
        
        that.scrollWidth = that.wrapper.clientWidth;
        that.scrollHeight = that.wrapper.clientHeight;
        that.scrollerWidth = that.element.offsetWidth;
        that.scrollerHeight = that.element.offsetHeight;
        that.maxScrollX = that.scrollWidth - that.scrollerWidth;
        that.maxScrollY = that.scrollHeight - that.scrollerHeight;
        that.directionX = 0;
        that.directionY = 0;

        if (that.scrollX) {
            if (that.maxScrollX >= 0) {
                resetX = 0;
            } else if (that.x < that.maxScrollX) {
                resetX = that.maxScrollX;
            }
        }
        if (that.scrollY) {
            if (that.maxScrollY >= 0) {
                resetY = 0;
            } else if (that.y < that.maxScrollY) {
                resetY = that.maxScrollY;
            }
        }

        // Snap
        if (that.options.snap) {
            that.maxPageX = -Math.floor(that.maxScrollX/that.scrollWidth);
            that.maxPageY = -Math.floor(that.maxScrollY/that.scrollHeight);

            snap = that.snap(resetX, resetY);
            resetX = snap.x;
            resetY = snap.y;
        }

        if (resetX!=that.x || resetY!=that.y) {
            that.setTransitionTime('0');
            that.setPosition(resetX, resetY, true);
        }
        
        that.scrollX = that.scrollerWidth > that.scrollWidth;
        that.scrollY = !that.options.bounceLock && !that.scrollX || that.scrollerHeight > that.scrollHeight;

        // Update horizontal scrollbar
        if (that.options.hScrollbar && that.scrollX) {
            that.scrollBarX = that.scrollBarX || new scrollbar('horizontal', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar, that.options.scrollbarColor);
            that.scrollBarX.init(that.scrollWidth, that.scrollerWidth);
        } else if (that.scrollBarX) {
            that.scrollBarX = that.scrollBarX.remove();
        }

        // Update vertical scrollbar
        if (that.options.vScrollbar && that.scrollY && that.scrollerHeight > that.scrollHeight) {
            that.scrollBarY = that.scrollBarY || new scrollbar('vertical', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar, that.options.scrollbarColor);
            that.scrollBarY.init(that.scrollHeight, that.scrollerHeight);
        } else if (that.scrollBarY) {
            that.scrollBarY = that.scrollBarY.remove();
        }
    },
    /** @ignore */
    setPosition: function (x, y, hideScrollBars) {
        var that = this;
        
        that.x = x;
        that.y = y;

        that.element.style.webkitTransform = translateOpen + that.x + 'px,' + that.y + 'px' + translateClose;

        // Move the scrollbars
        if (!hideScrollBars) {
            if (that.scrollBarX) {
                that.scrollBarX.setPosition(that.x);
            }
            if (that.scrollBarY) {
                that.scrollBarY.setPosition(that.y);
            }
        }
    },
    
    /*
    getPosition: function () {
        var that = this;
        return that.element.style.webkitTransform;
    },
    */
    /**
     * 设置滚动的动画时间
     * @param {Number} time
     */
    setTransitionTime: function(time) {
        var that = this;
        
        time = time || '0';
        that.element.style.webkitTransitionDuration = time;
        
        if (that.scrollBarX) {
            that.scrollBarX.bar.style.webkitTransitionDuration = time;
            that.scrollBarX.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
        }
        if (that.scrollBarY) {
            that.scrollBarY.bar.style.webkitTransitionDuration = time;
            that.scrollBarY.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
        }
    },
    /** @ignore */
    touchStart: function(e) {
        var that = this,
            matrix;
        
        if (!that.enabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        that.scrolling = true;      // This is probably not needed, but may be useful if iScroll is used in conjuction with other frameworks

        that.moved = false;
        that.distX = 0;
        that.distY = 0;

        that.setTransitionTime('0');

        // Check if the scroller is really where it should be
        if (that.options.momentum || that.options.snap) {
            matrix = new WebKitCSSMatrix(window.getComputedStyle(that.element).webkitTransform);
            if (matrix.e != that.x || matrix.f != that.y) {
                document.removeEventListener('webkitTransitionEnd', that, false);
                that.setPosition(matrix.e, matrix.f);
                that.moved = true;
            }
        }

        that.touchStartX = isTouch ? e.changedTouches[0].pageX : e.pageX;
        that.scrollStartX = that.x;

        that.touchStartY = isTouch ? e.changedTouches[0].pageY : e.pageY;
        that.scrollStartY = that.y;

        that.scrollStartTime = e.timeStamp;

        that.directionX = 0;
        that.directionY = 0;
    },
    /** @ignore */
    touchMove: function(e) {
        if (!this.scrolling) {
            return;
        }

        var that = this,
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            leftDelta = that.scrollX ? pageX - that.touchStartX : 0,
            topDelta = that.scrollY ? pageY - that.touchStartY : 0,
            newX = that.x + leftDelta,
            newY = that.y + topDelta;

        //e.preventDefault();
        e.stopPropagation();    // Stopping propagation just saves some cpu cycles (I presume)

        that.touchStartX = pageX;
        that.touchStartY = pageY;

        // Slow down if outside of the boundaries
        if (newX >= 0 || newX < that.maxScrollX) {
            newX = that.options.bounce ? Math.round(that.x + leftDelta / 3) : (newX >= 0 || that.maxScrollX>=0) ? 0 : that.maxScrollX;
        }
        if (newY >= 0 || newY < that.maxScrollY) { 
            newY = that.options.bounce ? Math.round(that.y + topDelta / 3) : (newY >= 0 || that.maxScrollY>=0) ? 0 : that.maxScrollY;
        }

        if (that.distX + that.distY > 5) {          // 5 pixels threshold

            // Lock scroll direction
            if (that.distX-3 > that.distY) {
                newY = that.y;
                topDelta = 0;
            } else if (that.distY-3 > that.distX) {
                newX = that.x;
                leftDelta = 0;
            }

            that.setPosition(newX, newY);
            that.moved = true;
            that.directionX = leftDelta > 0 ? -1 : 1;
            that.directionY = topDelta > 0 ? -1 : 1;
        } else {
            that.distX+= Math.abs(leftDelta);
            that.distY+= Math.abs(topDelta);
//          that.dist+= Math.abs(leftDelta) + Math.abs(topDelta);
        }
    },
    /** @ignore */
    touchEnd: function(e) {
        if (!this.scrolling) {
            return;
        }

        var that = this,
            time = e.timeStamp - that.scrollStartTime,
            point = isTouch ? e.changedTouches[0] : e,
            target, ev,
            momentumX, momentumY,
            newDuration = 0,
            newPositionX = that.x, newPositionY = that.y,
            snap;

        that.scrolling = false;

        if (!that.moved) {
            that.resetPosition();

            if (isTouch) {
                // Find the last touched element
                target = point.target;
                while (target.nodeType != 1) {
                    target = target.parentNode;
                }

                // Create the fake event
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1,
                    point.screenX, point.screenY, point.clientX, point.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    0, null);
                ev._fake = true;
                target.dispatchEvent(ev);
            }

            return;
        }

        if (!that.options.snap && time > 250) {         // Prevent slingshot effect
            that.resetPosition();
            return;
        }

        if (that.options.momentum) {
            momentumX = that.scrollX === true
                ? that.momentum(that.x - that.scrollStartX,
                                time,
                                that.options.bounce ? -that.x + that.scrollWidth/5 : -that.x,
                                that.options.bounce ? that.x + that.scrollerWidth - that.scrollWidth + that.scrollWidth/5 : that.x + that.scrollerWidth - that.scrollWidth)
                : { dist: 0, time: 0 };

            momentumY = that.scrollY === true
                ? that.momentum(that.y - that.scrollStartY,
                                time,
                                that.options.bounce ? -that.y + that.scrollHeight/5 : -that.y,
                                that.options.bounce ? (that.maxScrollY < 0 ? that.y + that.scrollerHeight - that.scrollHeight : 0) + that.scrollHeight/5 : that.y + that.scrollerHeight - that.scrollHeight)
                : { dist: 0, time: 0 };

            newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 1);        // The minimum animation length must be 1ms
            newPositionX = that.x + momentumX.dist;
            newPositionY = that.y + momentumY.dist;
        }

        if (that.options.snap) {
            snap = that.snap(newPositionX, newPositionY);
            newPositionX = snap.x;
            newPositionY = snap.y;
            newDuration = Math.max(snap.time, newDuration);
        }

        that.scrollTo(newPositionX, newPositionY, newDuration + 'ms');
    },
    /** @ignore */
    transitionEnd: function () {
        var that = this;
        document.removeEventListener('webkitTransitionEnd', that, false);
        that.resetPosition();
    },
    /**
     * 重置滚动条的位置
     */
    resetPosition: function () {
        var that = this,
            resetX = that.x,
            resetY = that.y;

        if (that.x >= 0) {
            resetX = 0;
        } else if (that.x < that.maxScrollX) {
            resetX = that.maxScrollX;
        }

        if (that.y >= 0 || that.maxScrollY > 0) {
            resetY = 0;
        } else if (that.y < that.maxScrollY) {
            resetY = that.maxScrollY;
        }
        
        if (resetX != that.x || resetY != that.y) {
            that.scrollTo(resetX, resetY);
        } else {
            if (that.moved) {
                that.onScrollEnd();     // Execute custom code on scroll end
                that.moved = false;
            }

            // Hide the scrollbars
            if (that.scrollBarX) {
                that.scrollBarX.hide();
            }
            if (that.scrollBarY) {
                that.scrollBarY.hide();
            }
        }
    },
    
    snap: function (x, y) {
        var that = this, time;

        if (that.directionX > 0) {
            x = Math.floor(x/that.scrollWidth);
        } else if (that.directionX < 0) {
            x = Math.ceil(x/that.scrollWidth);
        } else {
            x = Math.round(x/that.scrollWidth);
        }
        that.pageX = -x;
        x = x * that.scrollWidth;
        if (x > 0) {
            x = that.pageX = 0;
        } else if (x < that.maxScrollX) {
            that.pageX = that.maxPageX;
            x = that.maxScrollX;
        }

        if (that.directionY > 0) {
            y = Math.floor(y/that.scrollHeight);
        } else if (that.directionY < 0) {
            y = Math.ceil(y/that.scrollHeight);
        } else {
            y = Math.round(y/that.scrollHeight);
        }
        that.pageY = -y;
        y = y * that.scrollHeight;
        if (y > 0) {
            y = that.pageY = 0;
        } else if (y < that.maxScrollY) {
            that.pageY = that.maxPageY;
            y = that.maxScrollY;
        }

        // Snap with constant speed (proportional duration)
        time = Math.round(Math.max(
                Math.abs(that.x - x) / that.scrollWidth * 500,
                Math.abs(that.y - y) / that.scrollHeight * 500
            ));
            
        return { x: x, y: y, time: time };
    },
    /**
     * 滚动到指定位置
     * @param {Number} destX
     * @param {Number} destY
     * @param {Number} runtime 滚动动画的执行时间
     */
    scrollTo: function (destX, destY, runtime) {
        var that = this;

        if (that.x == destX && that.y == destY) {
            that.resetPosition();
            return;
        }

        that.moved = true;
        that.setTransitionTime(runtime || '350ms');
        that.setPosition(destX, destY);

        if (runtime==='0' || runtime=='0s' || runtime=='0ms') {
            that.resetPosition();
        } else {
            document.addEventListener('webkitTransitionEnd', that, false);  // At the end of the transition check if we are still inside of the boundaries
        }
    },
    /**
     * 按页滚动
     * @param {Number} pageX
     * @param {Number} pageY
     * @param {Number} runtime 滚动动画的执行时间
     */
    scrollToPage: function (pageX, pageY, runtime) {
        var that = this, snap;

        if (!that.options.snap) {
            that.pageX = -Math.round(that.x / that.scrollWidth);
            that.pageY = -Math.round(that.y / that.scrollHeight);
        }

        if (pageX == 'next') {
            pageX = ++that.pageX;
        } else if (pageX == 'prev') {
            pageX = --that.pageX;
        }

        if (pageY == 'next') {
            pageY = ++that.pageY;
        } else if (pageY == 'prev') {
            pageY = --that.pageY;
        }

        pageX = -pageX*that.scrollWidth;
        pageY = -pageY*that.scrollHeight;

        snap = that.snap(pageX, pageY);
        pageX = snap.x;
        pageY = snap.y;

        that.scrollTo(pageX, pageY, runtime || '500ms');
    },
    /**
     * 滚动到指定节点处
     * @param {HTMLElement} el
     * @param {Number} runtime 滚动动画的执行时间
     */
    scrollToElement: function (el, runtime) {
        el = typeof el == 'object' ? el : this.element.querySelector(el);

        if (!el) {
            return;
        }

        var that = this,
            x = that.scrollX ? -el.offsetLeft : 0,
            y = that.scrollY ? -el.offsetTop : 0;

        if (x >= 0) {
            x = 0;
        } else if (x < that.maxScrollX) {
            x = that.maxScrollX;
        }

        if (y >= 0) {
            y = 0;
        } else if (y < that.maxScrollY) {
            y = that.maxScrollY;
        }

        that.scrollTo(x, y, runtime);
    },
    
    momentum: function (dist, time, maxDistUpper, maxDistLower) {
        var friction = 2.5,
            deceleration = 1.2,
            speed = Math.abs(dist) / time * 1000,
            newDist = speed * speed / friction / 1000,
            newTime = 0;

        // Proportinally reduce speed if we are outside of the boundaries 
        if (dist > 0 && newDist > maxDistUpper) {
            speed = speed * maxDistUpper / newDist / friction;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            speed = speed * maxDistLower / newDist / friction;
            newDist = maxDistLower;
        }
        
        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return { dist: Math.round(newDist), time: Math.round(newTime) };
    },
    /**
     * 销毁
     */
    destroy: function (full) {
        var that = this;

        window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);      
        that.element.removeEventListener(START_EVENT, that, false);
        that.element.removeEventListener(MOVE_EVENT, that, false);
        that.element.removeEventListener(END_EVENT, that, false);
        document.removeEventListener('webkitTransitionEnd', that, false);

        if (that.options.checkDOMChanges) {
            that.element.removeEventListener('DOMSubtreeModified', that, false);
        }

        if (that.scrollBarX) {
            that.scrollBarX = that.scrollBarX.remove();
        }

        if (that.scrollBarY) {
            that.scrollBarY = that.scrollBarY.remove();
        }
        
        if (full) {
            that.wrapper.parentNode.removeChild(that.wrapper);
        }
        
        return null;
    }
};
/**
 * @ignore
 */
function scrollbar (dir, wrapper, fade, shrink, color) {
    var that = this,
        doc = document;
    
    that.dir = dir;
    that.fade = fade;
    that.shrink = shrink;
    that.uid = ++uid;

    // Create main scrollbar
    that.bar = doc.createElement('div');

    that.bar.style.cssText = 'position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:' + color + ';' +
        '-webkit-transform:' + translateOpen + '0,0' + translateClose + ';' +
        (dir == 'horizontal' ? '-webkit-border-radius:3px 2px;min-width:6px;min-height:5px' : '-webkit-border-radius:2px 3px;min-width:5px;min-height:6px');

    // Create scrollbar wrapper
    that.wrapper = doc.createElement('div');
    that.wrapper.style.cssText = '-webkit-mask:-webkit-canvas(scrollbar' + that.uid + that.dir + ');position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:' + (fade ? '300ms' : '0') + ';-webkit-transition-delay:0;-webkit-transition-property:opacity;' +
        (that.dir == 'horizontal' ? 'bottom:2px;left:2px;right:7px;height:5px' : 'top:2px;right:2px;bottom:7px;width:5px;');

    // Add scrollbar to the DOM
    that.wrapper.appendChild(that.bar);
    wrapper.appendChild(that.wrapper);
}
/**
 * @ignore
 */
scrollbar.prototype = 
/**
 * @ignore
 */
{
    init: function (scroll, size) {
        var that = this,
            doc = document,
            pi = Math.PI,
            ctx;

        // Create scrollbar mask
        if (that.dir == 'horizontal') {
            if (that.maxSize != that.wrapper.offsetWidth) {
                that.maxSize = that.wrapper.offsetWidth;
                ctx = doc.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, that.maxSize, 5);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.beginPath();
                ctx.arc(2.5, 2.5, 2.5, pi/2, -pi/2, false);
                ctx.lineTo(that.maxSize-2.5, 0);
                ctx.arc(that.maxSize-2.5, 2.5, 2.5, -pi/2, pi/2, false);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            if (that.maxSize != that.wrapper.offsetHeight) {
                that.maxSize = that.wrapper.offsetHeight;
                ctx = doc.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, 5, that.maxSize);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.beginPath();
                ctx.arc(2.5, 2.5, 2.5, pi, 0, false);
                ctx.lineTo(5, that.maxSize-2.5);
                ctx.arc(2.5, that.maxSize-2.5, 2.5, 0, pi, false);
                ctx.closePath();
                ctx.fill();
            }
        }

        that.size = Math.max(Math.round(that.maxSize * that.maxSize / size), 6);
        that.maxScroll = that.maxSize - that.size;
        that.toWrapperProp = that.maxScroll / (scroll - size);
        that.bar.style[that.dir == 'horizontal' ? 'width' : 'height'] = that.size + 'px';
    },
    
    setPosition: function (pos) {
        var that = this;
        
        if (that.wrapper.style.opacity != '1') {
            that.show();
        }

        pos = Math.round(that.toWrapperProp * pos);

        if (pos < 0) {
            pos = that.shrink ? pos + pos*3 : 0;
            if (that.size + pos < 7) {
                pos = -that.size + 6;
            }
        } else if (pos > that.maxScroll) {
            pos = that.shrink ? pos + (pos-that.maxScroll)*3 : that.maxScroll;
            if (that.size + that.maxScroll - pos < 7) {
                pos = that.size + that.maxScroll - 6;
            }
        }

        pos = that.dir == 'horizontal'
            ? translateOpen + pos + 'px,0' + translateClose
            : translateOpen + '0,' + pos + 'px' + translateClose;
        that.bar.style.webkitTransform = pos;
    },
    
    

    show: function () {
        if (has3d) {
            this.wrapper.style.webkitTransitionDelay = '0';
        }
        this.wrapper.style.opacity = '1';
    },

    hide: function () {
        if (has3d) {
            this.wrapper.style.webkitTransitionDelay = '350ms';
        }
        this.wrapper.style.opacity = '0';
    },
    
    remove: function () {
        this.wrapper.parentNode.removeChild(this.wrapper);
        return null;
    }
};

// Is translate3d compatible?
var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
    // Device sniffing
    isIthing = (/iphone|ipad/gi).test(navigator.appVersion),
    isTouch = ('ontouchstart' in window),
    // Event sniffing
    START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup',
    // Translate3d helper
    translateOpen = 'translate' + (has3d ? '3d(' : '('),
    translateClose = has3d ? ',0)' : ')',
    // Unique ID
    uid = 0;

// Expose iScroll to the world
J.ui = J.ui || {};
J.ui.iScroll = iScroll;



});