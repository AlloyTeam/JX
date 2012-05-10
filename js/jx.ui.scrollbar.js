/**
 * 自定义滚动条
 * rehorn, 2010-10-28
 * id {string} 需要生成滚动条的div(至少保证有一个子div，存放需要滚动的内容)
 * <div id ="scroll"><div id="scrollcontent"></div></div>
 * scroll与scrollcontent的position必须为relative|absolute
 * (可选: 会用js强制设置)scrollcontent的高度为100%, overflow:hidden
 */
 Jx().$package(function (J) {
 	 var $D = J.dom,
	     $E = J.event;
		
	J.ui = J.ui || {};
	J.ui.ScrollBar = new J.Class({
		option: {
			'barClass': 'scrollBar',
			'barHoverClass': null,
			'barActiveClass': null,
			'showBarContainer': false
		},
		init: function(el,option) {
            
			var self = this;
			J.extend(this.option, option);
			this.bar = $D.node('div',{
                'class':option.scrollBarClassName||'scrollBar' 
            });
			this.obj = el;
			this.content = this.obj.getElementsByTagName('div')[0] || this.obj;
			$D.setStyle(this.content, 'height', '100%');
			$D.setStyle(this.content, 'overflow', 'hidden');

			//兼容ie圆角
			if(J.browser.ie){
				this.bar.innerHTML = '<div class="scrollBar_bg scrollBar_bg_t"></div><div class="scrollBar_bg scrollBar_bg_b"></div>';
			}
			this.onscroll= option.onscroll||function(){};
			this.scrollToBottom= option.scrollToBottom||function(){};
			this.ipadTouchArea= option.ipadTouchArea||false;
			$D.setStyle(this.bar, 'marginTop', 0);
			this.obj.appendChild(this.bar);
			
			//滚动槽
			if(option.showBarContainer){
				this.barBc = $D.node('div',{
					'class':'scrollBar_bgc'
				});
				if(J.browser.ie){
					this.barBc.innerHTML = '<div class="scrollBar_bgc_c scrollBar_bgc_t"></div><div class="scrollBar_bgc_c scrollBar_bgc_b"></div>';
				}
				this.obj.appendChild(this.barBc);
			}
			
			this.setBarHeight();
			this.bar.y;
			this.srcElement;
			this.marginTop;
			this.D; //鼠标滚动方向
			this.wheelThread = 20; //滚动20px
			this.isScrolling = false;
			
			var observer = {
				onMouseDown:function(e){
                    //e.preventDefault();
                    var target = e.target;
					if(e.changedTouches) {
						e= e.changedTouches[0];
					}
		            self.bar.y = e.clientY;
		            self.bar.t = parseInt( self.bar.style.marginTop );
		            if(!J.platform.iPad){
		                $E.on(document, 'mousemove', observer.onMouseMove);
		                $E.on(document, 'mouseup', observer.onMouseUp);
                        e.stopPropagation();
		            }else {
		            	if(target == self.bar){
			                $E.on(document, 'touchmove', observer.onMouseMove);
                       		$E.on(document, 'touchend', observer.onBarMouseUp);
			            }else{
		               		$E.on(document, 'touchmove', observer.onTouchAreaMove);
                       		$E.on(document, 'touchend', observer.onMouseUp);
			            }
		            }
					self.isScrolling = true;
					if(self.option.barActiveClass)
						$D.addClass(self.bar, self.option.barActiveClass);
				},
				onMouseMove:function(e){
                    if(e.changedTouches) {
                    	e.preventDefault();
                        e= e.changedTouches[0];
                    }
		            self.scroll( e.clientY - self.bar.y );
		            if(!J.platform.iPad) {
    		            e.preventDefault();
    		            e.stopPropagation();
		            }
				},
				onTouchAreaMove:function(e){
					e.preventDefault();
					e.stopPropagation();
                    if(e.changedTouches) {
                        e= e.changedTouches[0];
                    }
		            self.scroll( - e.clientY + self.bar.y );
		            //if(!J.platform.iPad) {
		            //}
				},
				onBarMouseUp:function(e){
                    if(!J.platform.iPad){
                        $E.off(document, 'mousemove', observer.onMouseMove);
                        $E.off(document, 'mouseup', observer.onMouseUp);
                    }else {
                        $E.off(document, 'touchmove', observer.onMouseMove);
                        $E.off(document, 'touchend', observer.onBarMouseUp);
                    }
					self.isScrolling = false;
					if(self.option.barActiveClass)
						$D.removeClass(self.bar, self.option.barActiveClass);
				},
				onMouseUp:function(e){
                    if(!J.platform.iPad){
                        $E.off(document, 'mousemove', observer.onMouseMove);
                        $E.off(document, 'mouseup', observer.onMouseUp);
                    }else {
                        $E.off(document, 'touchmove', observer.onTouchAreaMove);
                        $E.off(document, 'touchend', observer.onMouseUp);
                    }
					self.isScrolling = false;
					if(self.option.barActiveClass)
						$D.removeClass(self.bar, self.option.barActiveClass);
				},
				onMouseOver: function(e){
					$D.addClass(self.bar, self.option.barHoverClass);
				},
				onMouseOut: function(e){
					$D.removeClass(self.bar, self.option.barHoverClass);
				},
				onMouseWheel:function(event){
                    if(!$D.isShow(self.bar)) {
                        self.scrollToBottom(event);
                        return;
                    }
					self.D = event.wheelDelta;
					event.returnValue = false;
					var _y = (self.D < 0) ? self.wheelThread : (0-self.wheelThread);
					self.bar.y = event.clientY;
		            self.bar.t = parseInt( self.bar.style.marginTop );
//                    var mul = self.content.scrollHeight/parseInt(self.bar.style.height)/5;
//                    if(mul<1){
//                        mul = 1;
//                    }
//                    _y *= mul;
					self.scroll(_y);
				},
				onClick:function(e){
					e.stopPropagation();
				},
				onDomMouseScroll:function(e){
					if(!$D.isShow(self.bar)) {
					    self.scrollToBottom(e);
					    return;
					}
					self.D = (e.detail > 0) ? -1 : 1;
					if(!J.platform.iPad){
    					e.stopPropagation();
    					e.preventDefault();
					}
					self.bar.y = e.clientY;
		            self.bar.t = parseInt( self.bar.style.marginTop );
					var _y = (self.D < 0) ? self.wheelThread : (0-self.wheelThread);
//                    var mul = self.content.scrollHeight/parseInt(self.bar.style.height)/5;
//                    if(mul<1){
//                        mul = 1;
//                    }
//                    _y *= mul;
					self.scroll(_y);
				}
			};
			
			if(this.option.stopClick){
				$E.on(this.bar, 'click', observer.onClick);
			}
			if(this.option.barHoverClass){
				$E.on(this.bar, 'mouseover', observer.onMouseOver);
				$E.on(this.bar, 'mouseout', observer.onMouseOut);
			}
			if(J.platform.iPad) {
			    $E.on(this.bar, 'touchstart', observer.onMouseDown);
			    if(this.ipadTouchArea) {
			    	$E.on(this.content, 'touchstart', observer.onMouseDown);
			    }
			}else {
				$E.on(this.bar, 'mousedown', observer.onMouseDown);
                //滚动事件兼容 参照jquery mousewheel
                if (J.browser.ie || J.browser.engine.webkit || J.browser.opera) {
                    $E.on(this.content, 'mousewheel', observer.onMouseWheel);
                    $E.on(this.bar, 'mousewheel', observer.onMouseWheel);
                } else {
                    $E.on(this.content, 'DOMMouseScroll', observer.onDomMouseScroll);
                    $E.on(this.bar, 'DOMMouseScroll', observer.onDomMouseScroll);
                }
			}
		},
		scrollBack: function() {
			var self= this;
			self.content.scrollTop = "0px";
			self.bar.t= 0;
			self.scroll(0);
		},
		refresh: function(){
			//跟iscroll同名接口
			this.update();	
		},
		update: function(){
			this.setBarHeight();
		},
		setBarHeight: function(){
			
			var self = this;
			
			self.onscroll(0,0); //防止影响scrollHeight计算
			self.bar.style['height']='0'; //防止影响scrollHeight计算
			
			$D.hide(self.bar); //防止影响scrollHeight计算
			
			if((self.content.offsetHeight - self.content.scrollHeight) >= 0 ){
				if(self.barBc){
					$D.hide(self.barBc);
				}
				self.bar.t = 0; //滚动条复位
			}else{
				self.bar.style.height = parseInt(self.content.offsetHeight / self.content.scrollHeight * self.content.offsetHeight) + 'px';
				$D.show(self.bar);
				if(self.barBc){
					$D.show(self.barBc);
				}
				self.bar.t = parseInt( self.bar.style.marginTop );
			}
			//触发scroll事件，重置滚动条位置，滚动距离为0
			self.scroll(0);
		},
		//@param dis 移动滚动条，dis为滚动条移动距离
		scroll: function(dis){
			var self = this;
			self.marginTop = (self.bar.t||0) + dis;
			if( self.marginTop < 0 ) {
	            self.marginTop = 0;
	        }
	        if( self.marginTop > self.content.clientHeight - self.bar.offsetHeight ){
	            self.marginTop = self.content.clientHeight - self.bar.offsetHeight;
	            //到底通知
                self.scrollToBottom();
	        }else {
	        	
	        }
	        self.bar.style.marginTop = self.marginTop + 'px';
	        if(dis==0) {
	        	self.onscroll(dis,dis);
	        }
	        var scrollTop= ( self.content.scrollHeight - self.content.offsetHeight ) * parseInt( self.marginTop ) / ( self.content.offsetHeight - self.bar.offsetHeight );
	        self.content.scrollTop = scrollTop;
	        self.onscroll(scrollTop,dis);
            
		},
        getScrollTop : function(){
          return  parseInt(this.content.scrollTop);
        },
		//@param dis 移动面板内容，dis为面板移动距离
		contentScroll: function(dis){
			var self = this;
			var dis = parseInt(self.obj.offsetHeight / self.content.scrollHeight * dis);
			this.scroll(dis);
		},
		contentPosition: function() {
			return this.content.scrollTop;
		}
	});
});
