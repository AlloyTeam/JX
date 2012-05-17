Jx().$package("jx.ui", function(J){
    var $D = J.dom,
        $E = J.event;
	this.Select=new J.Class({
		init:function(arr,el){
			if(arr.length==0){
				return;
			}
			if(!el){
				el=document.createElement('div');
				el.className='select';
				document.body.appendChild(el);
			}
			if(el.className==''){
				el.className='select';
			}
			else if(el.className.indexOf('select')==-1){
				el.className+=' select';
			}
			el.style.visibility='hidden';
			var html=['<div class="select_left"></div><div class="select_middle"></div><div class="select_right"></div><div><h3>'+arr[0][1]+'</h3><i></i></div>'];
			html.push('<div class="select_options"><ul style="display:none">');
			el.setAttribute('value',arr[0][0]);
			for(var i=0;i<arr.length;++i){
				var item=arr[i];
				var value=item[0];
				var text=item[1];
				html.push('<li><a href="###" value="');
				html.push(value);
				html.push('">');
				html.push(text);
				html.push('</a></li>');
			}
			html.push('</ul></div>');
			el.innerHTML=html.join('');
			this.el=el;
			this.list=el.getElementsByTagName('ul')[0];
			this.titleEl=el.getElementsByTagName('h3')[0];
			this.triangleEl=el.getElementsByTagName('i')[0];
			this.bindEvent();
			var selectLeftBgEl=this.selectLeftBgEl=el.childNodes[0];
			var selectMiddleBgEl=this.selectMiddleBgEl=el.childNodes[1];
			var selectRightBgEl=this.selectRightBgEl=el.childNodes[2];
			selectMiddleBgEl.style.width=el.offsetWidth-selectLeftBgEl.offsetWidth-selectRightBgEl.offsetWidth;
			setTimeout(function(){el.style.visibility='';},100);
		},
		bindEvent:function(){
			var context=this;
			var el=this.el;
			function  selectHandle(e){
				context.titleEl.innerHTML=this.innerHTML;
				el.setAttribute('value',this.getAttribute('value'));
			}
			var selectOptions=el.getElementsByTagName('ul')[0].getElementsByTagName('li');
			for(var i=0;i<selectOptions.length;++i){
				var selectItemEl=selectOptions[i];
				var selectItemIn=selectItemEl.firstChild;
				$E.on(selectItemIn,'click',selectHandle);
			}
			this.titleEl.onclick=this.triangleEl.onclick=function(){
				if(context.list.style.display=='none'){
					context.list.style.display='block';
				}
				else{
					context.list.style.display='none';
				}
			}
			$E.on(document,'click',function(e){
				var target=e.target;
				if(target!=context.titleEl&&target!=context.triangleEl){
					context.list.style.display='none';
				}
				e.preventDefault();
			});
		}
	})
});