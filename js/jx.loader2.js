/**
 * Jx loader module
 * */
Jx().$package(function(J){
	var EMPTY_FUNC=function(){};
	var depends={}, //key:module name, value:array of module name
		sheet2Module={},
		module2Sheet={};
	var included,
		processing,
		fullList; //所有模块顺序加载列表
	/**
	 * @namespace
	 * @name loader
	 * @description loader for configure
	 */
	//重载J.loader
	var $L = J.loader = {};
	/**
	 * @param {array} list
	 * @return {object} json
	 */
	var jsonEncode = function(list){
		var json={};
		for(var i=0,l=list.length;i<l;i++){
			json[list[i]]=true;
		}
		return json;
	};
	/**
	 * @param {object} json
	 * @return {array} list
	 */
	var jsonDecode = function(json){
		var list=[];
		for(var i in json){
			if(json.hasOwnProperty(i)){
				list.push(i);
			}
		}
		return list;
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
		fullList=null; //reset fullList
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
	 * @memberOf loader
	 * @method require
	 * @param {array} modules 请求的模块
	 * @param {function} callback
	 * @example
	 * Jx().$require(['dom'],function(J){
	 * 	var $D=J.dom,
	 * 		node=$D.node('div');
	 * });
	 */
	var require = function(modules,callback){
		if('string'===typeof(modules)){
			modules=Array.prototype.slice.call(arguments,0,-1);
			callback=arguments[arguments.length-1];
		}
		var list=getRequiredList(modules);
		return list;
	};
	/**
	 * @param {array} modules
	 * @return {array} require list
	 */
	var getRequiredList = function(modules){
		var list=getFullList(),
			resList,
			map,
			result=[];
		processing={};
		included={};
		resList=deepSearch(modules);
		processing=included=null;
		map=jsonEncode(resList);
		for(var i=0,l=list.length;i<l;i++){
			if(list[i] in map){
				result.push(list[i]);
			}
		}
		return result;
	};
	/**
	 * @return {array} require list
	 */
	var getFullList = function(){
		if(!fullList){
			processing={};
			included={};
			var list=jsonDecode(depends);
			list.sort();
			fullList=deepSearch(list);
			processing=included=null;
		}
		return fullList;
	}
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
			if(!included[module]){
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
	$L.addDepend = addDepend;
	$L.addDepends = addDepends;
	$L.addSheet = addSheet;
	$L.addSheets = addSheets;
	$L.joinUrlByList = EMPTY_FUNC;
	$L.featureDetect = null;
	$L.markModuleLoaded = EMPTY_FUNC;
	J.$require = $L.require = require;
	J.loader2 = {};
	J.loader2._depends=depends;
	J.loader2._sheets=sheet2Module;
});