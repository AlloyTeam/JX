/* == jx.ui.loading =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-5-31 ----- */
 
Jx().$package(function (J) {
 	 var $D = J.dom,
	     $E = J.event;
	 
	 // Loading类
	/**
	 * 【Loading】
	 * 
	 * @class Jx.ui.Loading
	 * @memberOf Jx.ui
	 * @name Loading
	 * @extends Object
	 * @param {Element} el 需要生成Loading的DOM节点
	 * @since version 1.0
	 * @description Jx.ui.Loading是一个加载条组件，当页面的某个区域需要较长的加载时间时，可以使用这个组件显示一个加载条，达到较好的用户体验效果。
	 */
	 var Loading = new J.Class(
	 /**
	 * @lends Jx.ui.Loading.prototype
	 */	
	 {
	 	/**
		* @private
		* @param {Element} el 需要生成Loading的DOM节点
	 	* @return
	 	*/
		init: function(el){
			this.el = el;
			this.parentEl = el.parentNode;
			this.loadingContainer = $D.node('div',{
        		'class': 'loading_container'
            });
            this.loadingContainer.innerHTML =  '<div class="loading_img" id ="loading_img"></div>';
            this.parentEl.appendChild(this.loadingContainer);
            this.loadingImg = $D.id('loading_img');
            
            var w = $D.getClientWidth(this.el),
            	h = $D.getClientHeight(this.el);
            
            $D.setStyle(this.loadingContainer, 'width', w + 'px');
            $D.setStyle(this.loadingContainer, 'height', h + 'px');
            this.setCenter(this.loadingImg, this.loadingContainer);
		},
		/**
		* @private
		* 居中
		* @param {Element} el 需要居中DOM节点
		* @param {Element} parentEl el居中相对节点
	 	* @return
	 	*/
		setCenter: function(el, parentEl){
//			var w=el.offsetWidth,
//				h=el.offsetHeight,
//				pt=parentEl.scrollTop,
//				pl=parentEl.scrollLeft,
//				pw=parentEl.offsetWidth,
//				ph=parentEl.offsetHeight;
//		
//			$D.setStyle(el,'left',(pw-w)/2+pl+'px');
//			$D.setStyle(el,'top',(ph-h)/2+pt+'px');
//			$D.setStyle(el,'position','absolute');
			var w = $D.getClientWidth(parentEl),
				h = $D.getClientHeight(parentEl),
				ew = $D.getClientWidth(el),
				eh = $D.getClientHeight(el);
        	var l = (w > ew) ? (w - ew) / 2 : 0;
            var t = (h > eh) ? (h - eh) / 2 : 0;
            $D.setStyle(el, 'position', 'relative');
            $D.setXY(el, l, t);
		},
		
		/**
		* @private
		* 定位
		* @param 
	 	* @return
	 	*/
		setXY: function(x, y){
			//TODO
		},
		
		/**
		* 显示loading
		* @param 
	 	* @return
	 	*/
		show: function(){
			$D.hide(this.el);
			$D.show(this.loadingContainer);
		},
		
		/**
		* 隐藏loading
		* @param 
	 	* @return
	 	*/
		hide: function(){
			$D.hide(this.loadingContainer);
			$D.show(this.el);
		}
	 });
	 
	 J.ui = J.ui || {};
	 J.ui.Loading = Loading;
});
 