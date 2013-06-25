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








