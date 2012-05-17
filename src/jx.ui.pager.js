Jx().$package("jx.ui", function(J){
    var $D = J.dom,
        $E = J.event;
	this.Pager=new J.Class({
		init:function(pageContainer,count,pageSize,pageHandle,prevCount,nextCount,lastCount,firstCount){
			var curPage=this.curPage=1;
			prevCount=prevCount===undefined?4:prevCount;
			nextCount=nextCount===undefined?4:nextCount;
			lastCount=lastCount===undefined?2:lastCount;
			firstCount=firstCount===undefined?2:firstCount;
			this.count=count;
			this.pageSize=pageSize;
			this.prevCount=prevCount;
			this.nextCount=nextCount;
			this.lastCount=lastCount;
			this.firstCount=firstCount;
			this.pageHandle=pageHandle;
			if(!pageContainer){
				pageContainer=document.createElement('div');
				document.body.appendChild(pageContainer);
			}
			if(pageContainer.className){
				pageContainer.className+=' pager';
			}
			else{
				pageContainer.className='pager';
			}
			this.pageContainer=pageContainer;
			this.resetPager();
			this.bindEvent();
		},
		resetPager:function(_count,_pageSize){
			var curPage=this.curPage;
			var count=this.count=_count=_count===undefined?this.count:_count;
			var pageSize=this.pageSize=_pageSize=_pageSize===undefined?this.pageSize:_pageSize;
			var prevCount=this.prevCount;
			var nextCount=this.nextCount;
			var lastCount=this.lastCount;
			var firstCount=this.firstCount;
			var pageCount=parseInt((count-1)/pageSize)+1;
			var pageContainer=this.pageContainer;
			var s=[];
			var start=Math.max(Math.min(Math.max(curPage-prevCount,1),pageCount-prevCount-nextCount),1);
			var end=Math.min(start+prevCount+nextCount,pageCount);
			s.push('<a href="###" value="1" class="pager_first">首页</a>');
			if(curPage>1){
				s.push('<a href="###" value="');
				s.push(curPage-1);
				s.push('" class="pager_prev">上一页</a>');
			}
			else{
				s.push('<span class="pager_prev">上一页</span>');
			}
			if(start>firstCount+1){
				for(var j=1;j<=firstCount;++j){
					s.push('<a href="###" value="');
					s.push(j);
					s.push('">');
					s.push(j);
					s.push('</a>');
				}
				s.push('<span>...</span>');
			}
			else{
				for(var j=1;j<start;++j){
					s.push('<a href="###" value="');
					s.push(j);
					s.push('">');
					s.push(j);
					s.push('</a>');
				}
			}
			for(var i=start;i<curPage;++i){
				s.push('<a value="');
				s.push(i);
				s.push('" href="###">');
				s.push(i);
				s.push('</a>');
			}
			s.push('<span class="pager_cur">');
			s.push(curPage);
			s.push('</span>');
			for(var i=curPage+1;i<=end;++i){
				s.push('<a value="');
				s.push(i);
				s.push('" href="###">');
				s.push(i);
				s.push('</a>');
			}
			if(end+lastCount+1<pageCount){
				s.push('<span>...</span>');
				for(var j=lastCount-1;j>=0;--j){
					s.push('<a href="###" value="');
					s.push(pageCount-j);
					s.push('">');
					s.push(pageCount-j);
					s.push('</a>');
				}
			}
			else{
				for(var j=end+1;j<=pageCount;++j){
					s.push('<a href="###" value="');
					s.push(j);
					s.push('">');
					s.push(j);
					s.push('</a>');
				}
			}
			if(pageCount>curPage){
				s.push('<a href="###" value="');
				s.push(curPage+1);
				s.push('" class="pager_next">下一页</a>');
			}
			else{
				s.push('<span class="pager_next">下一页</span>');
			}
			s.push('<a href="###" value="');
			s.push(pageCount);
			s.push('" class="pager_last">尾页</a>');
			pageContainer.innerHTML=s.join('');
		},
		bindEvent:function(){
			var context=this;
			var pageContainer=this.pageContainer;
			var pageHandle=this.pageHandle;
			$E.on(pageContainer,'click',function(e){
				var target=e.target;
				if(target.tagName=='A'){
					context.curPage=parseInt(target.getAttribute('value'));
					pageHandle&&pageHandle(context.curPage);
					context.resetPager();
				}
				e.preventDefault();
			});
		},
		getPage:function(){
			return this.curPage;
		}
	});
})