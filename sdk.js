Jx().$package('sdk',function(J){
	var observer={
		onNavClick:function(e){
			var obj=e.target,topNode=e.currentTarget;
			while(obj.nodeName!='A' && obj!=topNode){
				obj=obj.parentNode;
			}
			if(obj==topNode){
				return;
			}
			var nodes=topNode.getElementsByTagName('a');
			for(var i=0,l=nodes.length;i<l;i++){
				nodes[i].className=nodes[i]==obj?'button current':'button';
			}
		}
	};
	this.init=function(){
		sdk.list.init();
		sdk.pack.init();
		J.event.on(J.dom.id('proc'),'click',observer.onNavClick);
	};
	J.event.onDomReady(this.init);
});
Jx().$package('sdk.list',function(J){
	var $D=J.dom,
		$E=J.event,
		packageContext=this;
	var depends=J.loader2._depends,
		sheets=J.loader2._sheets,
		currentList={js:[],css:[]};
	var observer={
		onListClick:function(e){
			//var obj=e.target;
			var els=$D.id('moduleList').children,
				els2=$D.id('cssList').children,
				list=[],
				result,
				result2=[],
				map1,map2,module;
			for(var i=0,len=els.length;i<len;i++){
				var el=els[i];
				if(el.nodeName=='LABEL' && el.children[0].checked){
					list.push(el.getAttribute('module'));
				}
			}
			result=J.loader.require(list);
			map1=jsonEncode(list);
			map2=jsonEncode(result);
			for(var i=0,len=els.length;i<len;i++){
				var el=els[i];
				if(el.nodeName=='LABEL'){
					module=el.getAttribute('module');
					el.children[0].indeterminate=!map1[module] && !!map2[module];
				}
			}
			for(var i=0,len=els2.length;i<len;i++){
				var el=els2[i],c,m;
				if(el.nodeName=='LABEL'){
					sheet=el.getAttribute('sheet');
					c=el.children[0];
					if(c.checked){
						c.indeterminate=false;
						result2.push(sheet);
					}else if((m=sheets[sheet]) && map2[m]){
						c.indeterminate=true;
						result2.push(sheet);
					}else{
						c.indeterminate=false;
					}
				}
			}
			
			packageContext.setList({js:result,css:result2});
		},
		onListChange:function(list){
			$D.id('listText').value='['+list.js.join(',')+'],['+list.css.join(',')+']';
		},
		onResetClick:function(){
			packageContext.reset();
		}
	};
	var jsonEncode=function(list){
		var json={};
		for(var i=0,l=list.length;i<l;i++){
			json[list[i]]=true;
		}
		return json;
	};
	this.init=function(){
		var html='';
		for(var i in depends){
			html+='<label class="item" id="label_'+i+'" module="'+i+'"><input type="checkbox" id="cb_'+i+'" />'+i+'</label>';
		}
		var listEl=$D.id('moduleList');
		listEl.innerHTML=html;
		html='';
		for(var i in sheets){
			html+='<label class="item" id="css_label_'+i+'" sheet="'+i+'"><input type="checkbox" id="css_cb_'+i+'" />'+i+'</label>';
		}
		var cssListEl=$D.id('cssList');
		cssListEl.innerHTML=html;
		$E.on($D.id('lists'),'click',observer.onListClick);
		$E.on($D.id('resetList'),'click',observer.onResetClick);
		$E.addObserver(packageContext,'listChange',observer.onListChange);
	};
	this.setList=function(list){
		currentList=list;
		$E.notifyObservers(packageContext,'listChange',currentList);
	};
	this.getList=function(){
		return currentList;
	};
	this.reset=function(){
		var els=$D.tagName('input',$D.id('lists'));
		for(var i=0,len=els.length;i<len;i++){
			var el=els[i];
			if(el.type=='checkbox'){
				el.checked=false;
				el.indeterminate=false;
			}
		}
		packageContext.setList({js:[],css:[]});
	};
});
Jx().$package('sdk.pack',function(J){
	var $D=J.dom,
		$E=J.event,
		packageContext=this;
	var catPaneEl,res,linkEl,currentCat='cat1';
	var observer={
		onCatChange:function(){
			var els=$D.name('category',catPaneEl);
			for(var i=0,el;el=els[i];i++){
				if(el.checked){
					currentCat=el.value;
					break;
				}
			}
			switch(currentCat){
				default:
				case 'cat1':
					$D.show(res[0]);
					$D.hide(res[1]);
					$D.hide(res[2]);
					break;
				case 'cat2':
					$D.hide(res[0]);
					$D.show(res[1]);
					$D.hide(res[2]);
					break;
				case 'cat3':
					$D.hide(res[0]);
					$D.hide(res[1]);
					$D.show(res[2]);
					break;
			}
			packageContext.hideLink();
		},
		onListChange:function(list){
			$D.id('res3List').innerHTML=list.js.join(',');
			packageContext.hideLink();
		},
		onBuildClick:function(){
			packageContext.createLink();
		}
	};
	this.init=function(){
		catPaneEl=$D.id('catPane');
		res=[$D.id('res1'),$D.id('res2'),$D.id('res3')];
		linkEl=$D.id('link');
		$E.on(catPaneEl,'click',observer.onCatChange);
		$E.on($D.id('buildBtn'),'click',observer.onBuildClick);
		$E.addObserver(sdk.list,'listChange',observer.onListChange);
	};
	this.hideLink=function(){
		linkEl.innerHTML='';
	};
	this.createLink=function(){
		var list=sdk.list.getList(),text,html='';
		if(currentCat=='cat1'){
			if(list.css.length){
				text='{\n\tprojects: [\n\t\t{\n\t\t\tname: "Jx Framework",\n\t\t\ttarget: "jx.custom.css",\n\t\t\tinclude: [\n\t\t\t\t"style/jx.'+
					list.css.join('.css",\n\t\t\t\t"style/jx.').toLowerCase()+
					'.css"\n\t\t\t]\n\t\t}\n\t],\n\tlevel: 0,\n\tshrink: false,\n\tencode: "utf-8"\n}';
				html+='<a href="'+sdk.util.str2file(text)+'" download="jx.custom.css.qzmin">jx.custom.css.qzmin</a> | ';
			}
			text='{\n\tprojects: [\n\t\t{\n\t\t\tname: "Jx Framework",\n\t\t\ttarget: "jx.custom.js",\n\t\t\tinclude: [\n\t\t\t\t"js/jx.core.js",\n\t\t\t\t"js/jx.'+
				list.js.join('.js",\n\t\t\t\t"js/jx.').toLowerCase()+
				'.js"\n\t\t\t]\n\t\t}\n\t],\n\tlevel: 0,\n\tshrink: false,\n\tencode: "utf-8"\n}';
			html+='<a href="'+sdk.util.str2file(text)+'" download="jx.custom.js.qzmin">jx.custom.js.qzmin</a>';
		}else if(currentCat=='cat2'){
			text='{\n\tprojects: [\n\t\t{\n\t\t\tname: "Jx Framework",\n\t\t\ttarget: "jx.custom.js",\n\t\t\tinclude: ['+
				(list.css.length?'\n\t\t\t\t"style/jx.'+list.css.join('.css.js",\n\t\t\t\t"style/jx.').toLowerCase()+'.css.js",':'')+
				'\n\t\t\t\t"js/jx.core.js",\n\t\t\t\t"js/jx.'+
				list.js.join('.js",\n\t\t\t\t"js/jx.').toLowerCase()+
				'.js"\n\t\t\t]\n\t\t}\n\t],\n\tlevel: 0,\n\tshrink: false,\n\tencode: "utf-8"\n}';
			html='<a href="'+sdk.util.str2file(text)+'" download="jx.custom.js.qzmin">jx.custom.js.qzmin</a>';
		}else{
			text='{\n\tprojects: [\n\t\t{\n\t\t\tname: "Jx Framework",\n\t\t\ttarget: "jx.core_with_loader.js",\n\t\t\tinclude: ['+
				'\n\t\t\t\t"js/jx.core.js",\n\t\t\t\t"js/jx.loader.js",\n\t\t\t\t"config.js"'+
				'\n\t\t\t]\n\t\t}\n\t],\n\tlevel: 0,\n\tshrink: false,\n\tencode: "utf-8"\n}';
			html='<a href="'+sdk.util.str2file(text)+'" download="jx.core_with_loader.js.qzmin">jx.core_with_loader.js.qzmin</a>';
		}
		linkEl.innerHTML=html;
	};
});
Jx().$package('sdk.util',function(J){
	this.str2file=function(text){
		var code=Base64.encode(text);
		var uri='data:application/octetstream;charset=utf-8;base64,'+code;
		return uri;
	}
});