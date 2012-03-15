/**
 * MaskLayer模块
**/
Jx().$package(function(J){
	var $ = J.dom.id,
		$D = J.dom,
		$E = J.event;
		
	J.ui = J.ui || {};
	/**
	 * MaskLayer 遮罩层类
	 * 
	 * @memberOf ui
	 * @Class
	 * 
	 * @param {Object} option 其他选项，如:zIndex,appendTo...
	 * @returns
	 * 
	 * */
	var _id = 0;
	J.ui.MaskLayer = new J.Class({
		// == Doc ===================
		/*************************************
		 * 初始化函数
		 * init: function(option){}
		 * @param option {object} 设置参数
		 * 
		 ************************************/
		_getMaskId: function(){
			return _id++;	
		},
		init:function(option){
			option = option || {};
			var mid = this._getMaskId();
			var context = this;
			this._initZIndex = option.zIndex = !J.isUndefined(option.zIndex) ? option.zIndex : 9000000;
			this._initOpacity = option.opacity = !J.isUndefined(option.opacity) ? option.opacity : 0.5;
			option.appendTo = option.appendTo || document.body;
			option.className = option.className || '';
			this.option = option;
			this.container = $D.node("div", {
				"id": "ui_maskLayer_" + mid,
				"class" : "ui_maskLayer " + option.className
			});
			var html = '<div id="ui_maskLayerBody_' + mid + '" class="ui_maskLayerBody"></div>';
			if(J.browser.ie){
                html += '<iframe class="ui_maskBgIframe"></iframe>';
            }
			this.container.innerHTML = html;
            
			this.reset();
			option.appendTo.appendChild(this.container);
			
			var observer = {
				onMaskLayerClick : function(){
					$E.notifyObservers(context, "click", context);
				}
			};
			
			$E.on(this.container, "click", observer.onMaskLayerClick);
			
			this.body = $D.id("ui_maskLayerBody_" + mid);
		},
        /**
         * 获取遮罩的dom节点
         * @return {HTMLElement} 
         */
        getElement : function(){
            return this.container;  
        },
		append : function(el){
			this.body.appendChild(el);
		},
		
		show : function(){
			$D.show(this.container);
			$E.notifyObservers(this, "show");
			this._isShow = true;
		},
		hide : function(){
			$D.hide(this.container);
			$E.notifyObservers(this, "hide");
			this._isShow = false;
		},
		isShow : function(){
			return this._isShow;
		},
		toggleShow : function(){
			if(this.isShow()){
				this.hide();
			}else{
				this.show();
			}
		},
		getZIndex : function(){
			return this._zIndex;
		},
		
		setZIndex : function(zIndex){
			$D.setStyle(this.container, "zIndex", zIndex);
			this._zIndex = zIndex;
		},
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
		setOpacity: function(opacity){
            $D.setStyle(this.container, 'opacity', opacity);
        },
        /**
         * 重置遮罩的透明度,zindex等,重新设置为初始值
         * @return {MaskLayer} 返回自身
         */
        reset: function(){
            this.setOpacity(this._initOpacity);
            this.setZIndex(this._initZIndex);
            return this;
        },
		fadeIn : function(){
			this.show();
		},
		
		fadeOut : function(){
			this.hide();
		},
		
		remove : function(){
			if(this.option.appendTo)	{
				this.option.appendTo.removeChild(this.container);
			}
		},
		
		// 关于
		about : function(){
			
		}
	});

});