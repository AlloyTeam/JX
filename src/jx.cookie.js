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
