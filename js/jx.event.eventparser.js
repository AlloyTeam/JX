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
