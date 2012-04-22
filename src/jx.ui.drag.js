/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */


/**	
 * @description
 * Package: jet.ui
 *
 * Need package:
 * jet.core.js
 * 
 */




/**
 * 拖拽模块
 */
Jx().$package(function (J) {
    var $D = J.dom,
		$E = J.event;

    var ieSelectFix = function (e) {
        e.preventDefault();
        //return false;
    };
	
	var _workAreaWidth=false,
		_workAreaHeight=false,
        _clientWidth,
        _clientHeight,
		_width=false,
		_height=false,
		_limit_right,
		_limit_left,
		_limit_top,
		_limit_bottom;
		
	//for ipad
	var _dragOffsetX,
		_dragOffsetY;
        
    var _dragMaskLayer,
        _maskLayerZIndex = 9000000;
    
    /**
	 * 拖拽类
	 * 
	 * @memberOf Jx.ui
	 * @class
	 * @name Drag
	 * 
	 * @param {Element} apperceiveEl 监听拖拽动作的元素
	 * @param {Element} effectEl 展现拖拽结果的元素
	 * @param {Object} option 其他选项，如:isLimited,leftMargin...
	 * @returns
	 * 
	 * var limiteOption = {
			isLimited : 是否有界限,
			clientEl :盒子模型,边界用
			rightMargin : 边界距离,
			leftMargin : 边界距离,
			bottomMargin : 边界距离,
			topMargin : 边界距离,
			isOverLeft:
			isOverRight:
			isOverTop:
			isOverBottom:能否超出边界,支持拖出去
		};
	 */
    J.ui = J.ui || {};
    J.ui.Drag = new J.Class({
        init: function (apperceiveEl, effectEl, option) {
            var context = this;
            var curDragElementX, curDragElementY, dragStartX, dragStartY;
            this.apperceiveEl = apperceiveEl;
            option = option || {};
            this.isLimited = option.isLimited || false;
			this.dragType = option.dragType;
            this.isLocked = option.isLocked || false;
            this.isLockCursorInScreen = option.isLockCursorInScreen || false;
            var isMoved = false;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
            if(option.xOnly){
            	this._xOnly = option.xOnly||false;
            }
            if(option.yOnly){
            	this._yOnly = option.yOnly||false;
            }
			//TODO for flex wmode-non-transparent

            if (effectEl === false) {
                this.effectEl = false;
            } else {
                this.effectEl = effectEl || apperceiveEl;
            }


            this.dragStart = function (e) {
				if(e.changedTouches){//多点触摸
					if(e.changedTouches.length>1){
						return;
					}
					e=e.changedTouches[0];
					document.body.style['WebkitTouchCallout']='none';
				}else{
					e.preventDefault();
					e.stopPropagation();
				}
				context.dragStartIn(e.pageX,e.pageY);
                
            };
			
            this.dragStartIn = function (x,y) {
                if(context.isLocked){
                    return;
                }
				//缓存高宽
                $E.notifyObservers(context, "beforeStart");
                $E.notifyObservers(document, "beforeStart");
//				if(this.dragType){//jet框架跟alloy耦合不好
//					$E.notifyObservers(alloy, "dragBeforeStart",this.dragType);
//				}
                _clientWidth = $D.getClientWidth(),
                _clientHeight = $D.getClientHeight();
				_workAreaWidth = option.clientEl?$D.getClientWidth(option.clientEl):_clientWidth;
				_workAreaHeight = option.clientEl?$D.getClientHeight(option.clientEl):_clientHeight;
				_width = context.effectEl ? parseInt($D.getClientWidth(context.effectEl)) : 0;
				_height = context.effectEl ? parseInt($D.getClientHeight(context.effectEl)) : 0;

				if (context.isLimited) {
                    _limit_right = _workAreaWidth - _width - context._rightMargin;
                    _limit_left = context._leftMargin;
					_limit_top = context._topMargin;
					_limit_bottom = _workAreaHeight - _height - context._bottomMargin;
                }
                if(!_dragMaskLayer){
                    _dragMaskLayer = new J.ui.MaskLayer({opacity: 0});
//                    _maskLayerZIndex = alloy.layout.getTopZIndex(2);
                }
                _dragMaskLayer.setZIndex(_maskLayerZIndex);
                _dragMaskLayer.show();
//                context._oldZIndex = $D.getStyle(context.effectEl, 'zIndex') || 0;
//                J.out('dragStart - _oldZIndex: ' + context._oldZIndex + '::' + _maskLayerZIndex);
//                $D.setStyle(context.effectEl, 'zIndex', _maskLayerZIndex + 1);
                
                
				context._oldX=curDragElementX = context.effectEl ? (parseInt($D.getStyle(context.effectEl, "left")) || 0) : 0;
				context._oldY=curDragElementY = context.effectEl ? (parseInt($D.getStyle(context.effectEl, "top")) || 0) : 0;
                dragStartX = x;
                dragStartY = y;
				if(J.browser.mobileSafari){
					$E.on(document, 'touchmove', context.dragMove);
					$E.on(document, 'touchend', context.dragStop);
					
					var oldMatrix=new WebKitCSSMatrix(window.getComputedStyle(context.apperceiveEl).webkitTransform);
					_dragOffsetX = x - oldMatrix.m41;
					_dragOffsetY = y - oldMatrix.m42;
					
				}else{
					$E.on(document, "mousemove", context.dragMove);
					$E.on(document, "mouseup", context.dragStop);
				}
                if (J.browser.ie) {
                    $E.on(document.body, "selectstart", ieSelectFix);
                }
                if(J.browser.mobileSafari){
                	$E.notifyObservers(context, "start", { x: x, y: y });
                }else{
                	$E.notifyObservers(context, "start", { x: curDragElementX, y: curDragElementY });
                }      
            };

            this.dragMove = function (e) {
                if(context.isLocked){
                    return;
                }
				if(e.browserEvent){
					e.browserEvent.preventDefault();
					e.browserEvent.stopPropagation();
				}else{
					e.preventDefault();
					e.stopPropagation();
				}
				if(e.changedTouches){//多点触摸
					
					e=e.changedTouches[0];
				}
				var x,y;
                var pageX = e.pageX,
                    pageY = e.pageY;
                if(context.isLockCursorInScreen){//限制鼠标超出浏览器外
                    pageX < 0 ? (pageX = 0) : (pageX > _clientWidth ? (pageX = _clientWidth) : 0);
                    pageY < 0 ? (pageY = 0) : (pageY > _clientHeight ? (pageY = _clientHeight) : 0);
                }
				if(!J.browser.mobileSafari){
					x = curDragElementX + (pageX - dragStartX);
					y = curDragElementY + (pageY - dragStartY);
                }
                if (context.isLimited) {
					if(x>_limit_right &&!option.isOverRight ){
						x=_limit_right;
					}
					if(x<_limit_left && !option.isOverLeft){
						x=_limit_left;
					}
                }
                if (context._oldX !== x&&!context._yOnly) {
                    context._oldX = x;
                    if (context.effectEl && !J.browser.mobileSafari) {
                        context.effectEl.style.left = x + "px";
                    }
                    isMoved = true;
                }
				
                //J.out("context._topMargin: "+context._topMargin);
                if (context.isLimited) {
                    if (y > _limit_bottom && !option.isOverBottom) {
                        y = _limit_bottom;
                    }
                    if (y < _limit_top && !option.isOverTop) {
                        y = _limit_top;
                    }
                }

                if (context._oldY !== y&&!context._xOnly) {
                    context._oldY = y;
                    if (context.effectEl && !J.browser.mobileSafari) {
                        context.effectEl.style.top = y + "px";
                    }
                    isMoved = true;
                }
				
				//for ipad...BAD SMELL.
				var notifyX = x,
					notifyY = y;
				if(context.effectEl && J.browser.mobileSafari){
					context._oldX = curDragElementX + (pageX - dragStartX);
					context._oldY = curDragElementY + (pageY - dragStartY);
                    var eX = pageX,
                        eY = pageY;
					if(!context._yOnly){
						x = pageX - _dragOffsetX;
					}else{
						x = curDragElementX;
					}
					if(!context._xOnly){
						y = eY - _dragOffsetY;
					}else{
						y = curDragElementY;
					}
					context.effectEl.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
					notifyX = pageX;
					notifyY = pageY;
				}


                if (isMoved) {
                    $E.notifyObservers(context, "move", { x: notifyX, y: notifyY, orientEvent:e });
                }

            };
			
            this.dragStop = function (e) {
                _dragMaskLayer.hide();
                if(context.isLocked){
                    return;
                }
//                J.out('dragStop - _oldZIndex: ' + context._oldZIndex);
//                $D.setStyle(context.effectEl, 'zIndex', context._oldZIndex);
                
				document.body.style['WebkitTouchCallout']='auto';
            	if(isMoved || J.browser.mobileSafari) {
					var x=context._oldX;
					var y=context._oldY;
					if (context.isLimited) {
						if(x>_limit_right&&!option.isOverRight){
							x=_limit_right;
						}
						if(x<_limit_left&&!option.isOverLeft){
							x=_limit_left;
						}
					}
					if (context.isLimited) {
						if (y > _limit_bottom&&!option.isOverBottom) {
							y = _limit_bottom;
						}
						if (y < _limit_top&&!option.isOverTop) {
							y = _limit_top;
						}
					}
					if(J.browser.mobileSafari){
						e.preventDefault();
						if(option.noEndCallback && context.effectEl){
							context.effectEl.style.webkitTransform  = 'none';
							$D.setStyle(context.effectEl,'left',x+'px');
							$D.setStyle(context.effectEl,'top',y+'px');
						}
						$E.notifyObservers(context, "end", { x: x, y: y, orientEvent:e.changedTouches[0] });
					}else{
						$E.notifyObservers(context, "end", { x: x, y: y, orientEvent:e });
					}
            	}
            	else {
            		$E.notifyObservers(context, "end", {orientEvent:e});
            	}
            	if (context.isLimited&&(context.isOverRight||context.isOverLeft||context.isOverTop||context.isOverBottom)) {
            		var x = curDragElementX + (e.pageX - dragStartX);
               		var y = curDragElementY + (e.pageY - dragStartY);
                    var tempR = _workAreaWidth - _width - context._rightMargin;
                    var tempL = context._leftMargin;
                    var tempB = _workAreaHeight - context._bottomMargin;
                    var tempT = context._topMargin;
                    if (x > tempR||x < tempL||y > tempB||y < tempT) {
                    	//超出边界
                    	$E.notifyObservers(context,"overFlowBorder",{x: x,y: y});
                    	//J.out("overFlow");
                    }
                }
				_workAreaWidth = false;
				_workAreaHeight = false;
				_width = false;
				_height = false;
				if(J.browser.mobileSafari){
					$E.off(document, 'touchmove', context.dragMove);
					$E.off(document, 'touchend', context.dragStop);
				}else{
					$E.off(document, "mousemove", context.dragMove);
					$E.off(document, "mouseup", context.dragStop);
				}
                if (J.browser.ie) {
                    $E.off(document.body, "selectstart", ieSelectFix);
                }
                isMoved= false;
                //J.out("end")
            };

			//if(J.browser.mobileSafari){
			//	$E.on(this.apperceiveEl, "touchstart", this.dragStart);
			//}else{
				$E.on(this.apperceiveEl, "drag", this.dragStart);
			//}
        },
        /**
         * 设置effectEl
         * @param {HTMLElement} el
         */
        setEffect: function(el){
            this.effectEl = el;
        },
        lock: function () {
			//if(J.browser.mobileSafari){
			//	$E.off(this.apperceiveEl, "touchstart", this.dragStart);
			//}else{
                this.isLocked = true;
				$E.off(this.apperceiveEl, "drag", this.dragStart);
			//}
        },
        unlock: function () {
			//if(J.platform.iPad){/
			//	$E.on(this.apperceiveEl, "touchstart", this.dragStart);
			//}else{
                this.isLocked = false;
				$E.on(this.apperceiveEl, "drag", this.dragStart);
			//}
        },
        show: function () {
            $D.show(this.apperceiveEl);
        },
        hide: function () {
            $D.hide(this.apperceiveEl);
        },
        setLimite : function(option){
        	option = option || {};
            this.isLimited = option.isLimited || true;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
        }
    });



});
