/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, All rights reserved.
 *
 * @fileOverview Jx!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
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














