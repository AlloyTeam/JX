/**
 * Jx loader module
 * */
Jx().$package(function(J){
    var depends={}, //key:module name, value:array of module name
        sheet2Module={},
        module2Sheet={};
        moduleLoaded={};
    var included,
        processing;
    /**
     * @namespace
     * @name loader
     */
    var $L = J.loader = J.loader || {};
    /**
     * @param {string} url
     * @param {function} callback
     */
    var loadScript = function(url,callback){
        var node=document.createElement('script');
        node.onload=node.onreadystatechange=function(){
            var rs=node.readyState;
            if('undefined'===typeof rs || 'loaded'===rs || 'complete'===rs){
                try{
                    callback && callback(J);
                }finally{
                    node.onload=node.onreadystatechange=null;
                    node=null;
                }
            }
        };
        node.async=true;
        node.charset='utf-8';
        node.src=url;
        (document.head || document.documentElement).appendChild(node);
    };
    /**
     * @param {string} key 模块名称
     * @return {array} 依赖模块名称
     */
    var getDepend = function(key){
        if(depends.hasOwnProperty(key)){
            return depends[key];
        }
        return [];
    };
    /**
     * @method addDepend
     * @memberOf loader
     * @param {string} key 模块名称
     * @param {array} list 依赖模块名称
     */
    var addDepend = function(key,list){
        if('string'===typeof list){
            list=Array.prototype.slice.call(arguments,1);
        }
        if(!depends.hasOwnProperty(key)){
            depends[key]=list.slice(0);
        }else{
            depends[key]=depends[key].concat(list);
        }
        depends[key].sort();
    };
    /**
     * @method addDepends
     * @memberOf loader
     * @param {object} depends {key:list,...}
     */
    var addDepends = function(depends){
        for(var key in depends){
            if(depends.hasOwnProperty(key)){
                addDepend(key,depends[key]);
            }
        }
    };
    /**
     * @method addSheet
     * @memberOf loader
     * @param {string} sheet 样式表名称
     * @param {string} module 对应的模块,没有对应模块填null
     */
    var addSheet = function(sheet,module){
        sheet2Module[sheet]=module;
        if(module){
            module2Sheet[module]=sheet;
        }
    };
    /**
     * @method addSheets
     * @memberOf loader
     * @param {object} sheets {sheet:module,...}
     */
    var addSheets = function(sheets){
        for(var sheet in sheets){
            if(sheets.hasOwnProperty(sheet)){
                addSheet(sheet,sheets[sheet]);
            }
        }
    };
    /**
     * @param {string} name 模块名称
     * @return {boolean} 是否已加载
     */
    var isModuleLoaded = function(name){
        if(moduleLoaded[name.toLowerCase()]){
            return true;
        }else{
            if('function'===typeof $L.featureDetect){
                return moduleLoaded[name.toLowerCase()]=$L.featureDetect(name);
            }
            return false;
        }
    };
    /**
     * @param {string} name 模块名称
     */
    var markModuleLoaded = function(name){
        moduleLoaded[name.toLowerCase()]=true;
    };
    /**
     * @memberOf loader
     * @method require
     * @param {array} modules 请求的模块
     * @param {function} callback
     * @example
     * Jx().$require(['dom'],function(J){
     *  var $D=J.dom,
     *      node=$D.node('div');
     * });
     */
    var require = function(modules,callback){
        if('string'===typeof(modules)){
            modules=Array.prototype.slice.call(arguments,0,-1);
            callback=arguments[arguments.length-1];
        }
        var list=getRequiredList(modules),
            cssList=[],
            sheet;
        for(var i=0,len=list.length;i<len;i++){
            if(sheet=module2Sheet[list[i]]){
                cssList.push(sheet+'.css');
            }
        }
        if(list.length){
            var url=$L.joinUrlByList(cssList.concat(list));
            loadScript(url,callback);
        }else{
            try{
                callback && callback(J);
            }finally{}
        }
    };
    /**
     * @param {array} modules
     * @return {array} require list
     */
    var getRequiredList = function(modules){
        modules.sort();
        processing={};
        included={};
        var result=deepSearch(modules);
        processing=included=null;
        return result;
    };
    /**
     * @param {array} modules
     * @return {array} require list
     */
    var deepSearch = function(modules){
        var module,
            dependList,
            resList,
            result=[];
        for(var i=0,l=modules.length;i<l;i++){
            module=modules[i];
            if(processing[module]){
                throw new Error('Dependency error in ['+module+'] module!'); //出现环,不合理的模块依赖关系
            }
            if(isModuleLoaded(module) || included[module]){
                
            }else{
                var dependList=getDepend(module);
                if(dependList.length){
                    processing[module]=true;
                    resList=deepSearch(dependList);
                    result=result.concat(resList);
                    delete processing[module];
                }
                result.push(module);
                included[module]=true;
            }
        }
        return result;
    };
    /**
     * @param {array} require list
     * @return {string} script url
     */
    var joinUrlByList = function(list){
        throw new Error('[loader] module needs your own joinUrlByList method!');
    };
    $L.addDepend = addDepend;
    $L.addDepends = addDepends;
    $L.addSheet = addSheet;
    $L.addSheets = addSheets;
    $L.joinUrlByList = joinUrlByList;
    $L.featureDetect = null;
    $L.markModuleLoaded = markModuleLoaded;
    J.$require = $L.require = require;
});