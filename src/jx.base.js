
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
        return (o && (o.constructor === Object)) || (String(o)==="[object Object]");
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
        return (o && (o.constructor === Array)) || (Object.prototype.toString.call(o)==="[object Array]");
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
     * 
     * @class Class
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
            this.timeout;
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
