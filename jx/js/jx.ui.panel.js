/* == UI类 Panel ========================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * -------------------------------------------- 2010.10.14 ----- */
 
 
Jx().$package(function(J){
	var packageContext = this,
		$D = J.dom,
		$E = J.event;
		
	
	
	// Panel类
	var Panel = new J.Class({
		/**
		 * @param {Object} option ,{
		 * 	id,name,container,body,html
		 * }
		 */
		init: function(option){
			option = option || {};
			this.id = option.id;
			this.name = option.name;
			this.container = option.container;
			this.body = option.body || option.container;
			
			option.html = option.html || "";
			if(option.html){
				this.setHtml(option.html);
			}
			if($D.isShow(this.container)){
				this.show();
			}else{
				this.hide();
			}

		},
		/**
		 * 设置panel的内容
		 * @param {String} html
		 */
		setHtml: function(html){
			this.html = html;
			this.body.innerHTML = html;
		},
		/**
		 * 把node添加到尾部
		 * @param {HTMLElement} node 
		 */
		append: function(node){
			this.body.appendChild(node);
		},
		/**
		 * 返回container的大小
		 * @return  {Object}, {widht:xxx,height:xxx}
		 */
		getSize: function(){
			return {
				width:$D.getClientWidth(this.container),
				height:$D.getClientHeight(this.container)
			};
		},
		/**
		 * 返回body的大小,body跟container可能不一样
		 * 在没有设置body的时候,body就是container
		 * @return {Object} {widht:xxx,height:xxx}
		 */
		getBodySize: function(){
			
            return {
                width: parseInt($D.getStyle(this.body, "width"), 10),
                height: parseInt($D.getStyle(this.body, "height"), 10)
            };
		},
        /**
         * 显示面板
         * 
         */
		show: function(){
			$D.show(this.container);
			$E.notifyObservers(this, "show", this.getBodySize());
			this._isShow = true;
		},
        /**
         * 隐藏面板
         */
		hide: function(){
			$D.hide(this.container);
			$E.notifyObservers(this, "hide");
			this._isShow = false;
		},
        /**
         * 返回面板是否显示
         * @return {Boolean} 
         */
		isShow: function(){
			return this._isShow;
		},
        /**
         * 切换面板的显示与隐藏
         */
		toggleShow: function(){
			if(this.isShow()){
				this.hide();
			}else{
				this.show();
			}
		},
        /**
         * 获取z-index
         * @return {Int}
         */
		getZIndex: function(){
			return this._zIndex;
		},
		/**
         * 设置z-index
         * @param {Int} zIndex
		 */
		setZIndex: function(zIndex){
			$D.setStyle(this.container, "zIndex", zIndex);
			this._zIndex = zIndex;
		},
        /**
         * 设置面板坐标
         * @param {Int} x
         * @param {Int} y
         */
		setXY: function(x, y){
			this.setX(x);
			this.setY(y);
		},
		/**
		 * 设置面板位置 X
         * @param {Int} x
		 */ 
		setX: function(x) {
			$D.setStyle(this.container, "left", x + "px");
		},
		/**
		 * 设置面板位置 Y
         * @param {Int} y
		 */ 
		setY: function(y) {
			$D.setStyle(this.container, "top", y + "px");
		},
		/**
         * 设置宽度
         * @param {Int} w
		 */
		setWidth: function(w){
			$D.setStyle(this.container, "width", w + "px");
		},
        /**
         * 获取宽度
         * @return {Int} 
         */
		getWidth: function(){
			return parseInt($D.getStyle(this.container, "width"));
		},
        /**
         * 设置高度
         * @param {Int} h
         */
		setHeight: function(h){
			$D.setStyle(this.container, "height", h + "px");
		},
        /**
         * 获取高度
         * @return {Int} 
         */
		getHeight: function(){
			return parseInt($D.getStyle(this.container, "height"));
		}
	});
	J.ui = J.ui	|| {};
	J.ui.Panel = Panel;
	
});

