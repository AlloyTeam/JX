/**
 * 自定义滚动条
 * ippan
 * 前置条件：所传进来的div的positon必须为relative或absolute
 * 此方法会给div增加一个子元素（滚动条）
 */
 Jx().$package(function (J) {
 	 var $D = J.dom,
	     $E = J.event;
	var doc;
	J.ui = J.ui || {};
	J.ui.ScrollArea = new J.Class({
		init: function(el,_doc) {
			var self = this;
			doc = _doc ? _doc:document;
			this.container = el;
			this.scrollBar = doc.createElement('div');
			this.scrollBar.className = 'scrollBar';
			if(J.browser.ie){
				this.scrollBar.innerHTML = '<div class="scrollBar_bg scrollBar_bg_t"></div><div class="scrollBar_bg scrollBar_bg_b"></div>';
			}
			this.container.appendChild(this.scrollBar);
			this.wheelThread = 20; //滚动20px
			this.isScrolling = false;
			var scrollBarStartY;
			var observer = {
				onMouseDown:function(e){
		            e.preventDefault();
		            e.stopPropagation();
					self.isScrolling = true;
		            scrollBarStartY = e.clientY;
					$D.addClass(self.scrollBar, 'active');
		            $E.on(doc, 'mousemove', observer.onMouseMove);
		            $E.on(doc, 'mouseup', observer.onMouseUp);
				},
				onMouseMove:function(e){
					var dy =  e.clientY - scrollBarStartY;
					var scrollY = dy/(self.offsetHeight-self.scrollBarHeight) * (self.scrollHeight - self.offsetHeight);
		            self.scroll(scrollY);
					scrollBarStartY = e.clientY;
		            e.preventDefault();
		            e.stopPropagation();
				},
				onClick:function(e){
		            e.preventDefault();
		            e.stopPropagation();
				},
				onMouseUp:function(e){
		            e.preventDefault();
		            e.stopPropagation();
					$E.off(doc, 'mousemove', observer.onMouseMove);
					$E.off(doc, 'mouseup', observer.onMouseUp);
					self.isScrolling = false;
					$D.removeClass(self.scrollBar, 'active');
				},
				onMouseOver: function(e){
					$D.addClass(self.scrollBar, 'hover');
				},
				onMouseOut: function(e){
					$D.removeClass(self.scrollBar, 'hover');
				},
				onMouseWheel:function(event){
					if(!$D.isShow(self.scrollBar)) return;
					var delta = event.wheelDelta;
					event.returnValue = false;
					var _y = (delta < 0) ? self.wheelThread : (0-self.wheelThread);
                    var mul = self.scrollHeight/self.scrollBarHeight/5;
                    if(mul<1){
                        mul = 1;
                    }
                    _y *= mul;
					self.scroll(_y);
				},
				onDomMouseScroll:function(e){
					if(!$D.isShow(self.scrollBar)) return;
					var delta = (e.detail > 0) ? -1 : 1;
					e.stopPropagation();
					e.preventDefault();
					var _y = (delta < 0) ? self.wheelThread : (0-self.wheelThread);
                    var mul = self.scrollHeight/self.scrollBarHeight/5;
                    if(mul<1){
                        mul = 1;
                    }
                    _y *= mul;
					self.scroll(_y);
				}
			};
			this.observer = observer;
			$E.on(this.scrollBar, 'mousedown', observer.onMouseDown);
			$E.on(this.scrollBar, 'click', observer.onClick);
			$E.on(this.scrollBar, 'mouseover', observer.onMouseOver);
			$E.on(this.scrollBar, 'mouseout', observer.onMouseOut);
			
			//滚动事件兼容 参照jquery mousewheel
			if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
				$E.on(this.container, 'mousewheel', observer.onMouseWheel);
				$E.on(this.scrollBar, 'mousewheel', observer.onMouseWheel);
			} else {
				$E.on(this.container, 'DOMMouseScroll', observer.onDomMouseScroll);
				$E.on(this.scrollBar, 'DOMMouseScroll', observer.onDomMouseScroll);
			}
			this.update();
		},
		update: function(){
			if(this.updateTimer){
				return;
			}
			var that=this;
			this.updateTimer = setTimeout(function(){
				that.updateTimer = 0;
				that.scrollBar.style['height']='0';//防止scrollBar的高度影响区域高度计算
				$D.hide(that.scrollBar);
				that.scrollHeight = that.container.scrollHeight;
				that.offsetHeight = that.container.offsetHeight;
				that.scrollBarHeight = that.offsetHeight/that.scrollHeight*that.offsetHeight;
				//console.info(that.scrollBarHeight,that.scrollHeight,that.offsetHeight);
				if(that.scrollHeight <= that.offsetHeight){
					//J.out('hide');
					//that.scrollBar.style['display']='none';
				}else{
					//J.out('show');
					$D.show(that.scrollBar);
					if(that.scrollBarHeight < 30){
						that.scrollBarHeight = 30;
					}
					that.scrollBar.style['height'] = that.scrollBarHeight+'px';
					that.scrollBar.style['top'] = that.container.scrollTop+that.container.scrollTop/(that.scrollHeight-that.offsetHeight)*(that.offsetHeight-that.scrollBarHeight)+'px';
					//J.out(that.scrollHeight+' :: '+that.offsetHeight+' '+that.scrollTime);
				}
				//J.out(that.scrollHeight+' '+that.offsetHeight+' '+that.scrollTime);
			},500);
			//console.info(scrollHeight,offsetHeight,this.scrollBarHeight);
		},
		//@param dis 移动滚动条，dis为滚动条移动距离
		scroll: function(dis){
			var maxDis = this.scrollHeight - (this.container.scrollTop + this.offsetHeight);
			if(dis > maxDis){
				dis = maxDis;
			}
			//J.out(this.container.scrollTop + this.offsetHeight+'  '+this.scrollHeight);
            var scrollTop = this.container.scrollTop+dis;
            this.scrollBar.style['top'] = scrollTop+scrollTop/(this.scrollHeight-this.offsetHeight)*(this.offsetHeight-this.scrollBarHeight)+'px';
		    this.container.scrollTop = scrollTop;
        },
        getScrollTop : function(){
          return  parseInt(this.container.scrollTop);
        },
		destroy:function(){
			$E.off(this.scrollBar, 'mousedown', this.observer.onMouseDown);
			$E.off(this.scrollBar, 'mouseover', this.observer.onMouseOver);
			$E.off(this.scrollBar, 'mouseout', this.observer.onMouseOut);
			
			//滚动事件兼容 参照jquery mousewheel
			if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
				$E.off(this.container, 'mousewheel', this.observer.onMouseWheel);
				$E.off(this.scrollBar, 'mousewheel', this.observer.onMouseWheel);
			} else {
				$E.off(this.container, 'DOMMouseScroll', this.observer.onDomMouseScroll);
				$E.off(this.scrollBar, 'DOMMouseScroll', this.observer.onDomMouseScroll);
			}
			this.container.removeChild(this.scrollBar);
			this.container = null;
			this.scrollBar = null;
		}
	});
});