/* == jx.ui.Rotation =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-5-31 ----- */
 
Jx().$package(function (J) {
 	 var $D = J.dom,
		 isLegacyIE = J.browser.ie && (J.browser.ie < 9 || $D.getDoc().documentMode < 9);
	 
	 // Rotation类
	/**
	 * 【Rotation】
	 * 
	 * @class Jx.ui.Rotation
	 * @memberOf Jx.ui
	 * @name Rotation
	 * @extends Object
	 * @param {Element} el 需要旋转的DOM节点，IE只可用于 img 元素
	 * @since version 1.0
	 * @description Jx.ui.Rotation是一个（图片）旋转组件。
	 */
	 var Rotation = new J.Class(
	 /**
	 * @lends Jx.ui.Rotation.prototype
	 */	
	 {
	 	/**
		* @private
		* @param {Element} el 需要旋转的DOM节点，IE只可用于 img 元素
	 	* @return
	 	*/
		init: function(el){
			this.el = el;
			this.type = 0;

			// rotation type 2 class names
			this.type2class = [
				'',
				'rotation-90deg',
				'rotation-180deg',
				'rotation-270deg'
			];

			// create a style node
			if (isLegacyIE) {
				$D.createStyleNode('\
					.rotation-90deg {\
						filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\
					}\
					.rotation-180deg {\
						filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\
					}\
					.rotation-270deg {\
						filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\
					}\
				', 'rotation-style');
			} else {
				$D.createStyleNode('\
					.rotation-90deg {\
						-moz-transform:rotate(90deg);\
						-webkit-transform:rotate(90deg);\
						-o-transform: rotate(90deg);\
						-ms-transform: rotate(90deg);\
						transform:rotate(90deg);\
					}\
					.rotation-180deg {\
						-moz-transform:rotate(180deg);\
						-webkit-transform:rotate(180deg);\
						-o-transform: rotate(180deg);\
						-ms-transform: rotate(180deg);\
						transform:rotate(180deg);\
					}\
					.rotation-270deg {\
						-moz-transform:rotate(270deg);\
						-webkit-transform:rotate(270deg);\
						-o-transform: rotate(270deg);\
						-ms-transform: rotate(270deg);\
						transform:rotate(270deg);\
					}\
				', 'rotation-style');
			}

			// cleaning
			styleText = null;
		},

	 	/**
		* @private
	 	* @return
	 	*/
		uninit: function(){
			this.el = null;
			this.type = 0;
		},

		/**
		* 向左旋转（逆时针）
		* @param
	 	* @return
	 	*/
		left: function(){
			// anticlockwise
			var type = this.type;
			type -= 1;
			if (-1 === type) {
				type = 3;
			}

			return this.rotate(type);
		},
		
		/**
		* 向右旋转（顺时针）
		* @param
	 	* @return
	 	*/
		right: function(){
			// clockwise
			var type = this.type;
			type += 1;
			if (4 === type) {
				type = 0;
			}

			return this.rotate(type);
		},
		
		/**
		* 转向特定方向
		* @param {Integer} type 旋转的方向类型：0: 0deg; 1: 90deg; 2: 180deg; 3: 270deg
	 	* @return
	 	*/
		rotate: function(type){
			type = parseInt(type, 10);
			if (isNaN(type) || !(type in this.type2class) || type === this.type) {
				return false;
			}

			$D.removeClass(this.el, this.type2class[this.type]);

			$D.addClass(this.el, this.type2class[type]);

			var isRotated = type % 2 !== this.type % 2;
			this.type = type;

			if (isRotated) { // if rotated
				// center it for ie
				this.center();
			}

			return this.type;
		},
		
		/**
		* 修正 IE 滤镜无法居中的问题
		* @param
	 	* @return
	 	*/
		center: function(){
			// for ie only
			if (!isLegacyIE) {
				return;
			}

			// center it
			if ('absolute' === $D.getStyle(this.el, 'position')) {
				var l = parseInt($D.getStyle(this.el, 'left'), 10),
					t = parseInt($D.getStyle(this.el, 'top'), 10),
					w = parseInt($D.getStyle(this.el, 'width'), 10),
					h = parseInt($D.getStyle(this.el, 'height'), 10);

				// swap the w/h
				if (0 === this.type % 2) {
					var swp = w;
					w = h;
					h = swp;
					swp = null;
				}

				// calc the offset
				var offset = (h - w) / 2;
				l -= offset;
				t += offset;
				offset = null;

				// update the pos
				$D.setStyle(this.el, 'left', l + 'px');
				$D.setStyle(this.el, 'top', t + 'px');
			}
		},
		
		/**
		* 重置
		* @param
	 	* @return
	 	*/
		reset: function(){
			$D.removeClass(this.el, this.type2class[this.type]);
			this.type = 0;
		},
		
		/**
		* 是否横放
		* @param
	 	* @return 
	 	*/
		isLandscape: function(){
			return this.type % 2;
		}
	 });
	 
	 J.ui = J.ui || {};
	 J.ui.Rotation = Rotation;
});
