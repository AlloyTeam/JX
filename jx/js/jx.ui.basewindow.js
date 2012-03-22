/* == EQQ 类模块 ========================================
 * Copyright (c) 2009, Tencent.com All rights reserved.
 * version: 1.0
 * -------------------------------------------- 2010.3.16 ----- */

/*if(typeof(progress) == 'function'){
    progress("qqweb.part2.js loaded",0);
}*/
Jx().$package(function (J) {
	J.ui = J.ui || {};
    var packageContext = this,
		$D = J.dom,
		$E = J.event,
		dragProxy;

	var createDragProxy = function () {
        var maskEl = $D.node("div", {
            "class": "dragMask"
        });
        var proxyEl = $D.node("div", {
            "class": "dragProxy"
        });
        maskEl.appendChild(proxyEl);
        $D.getDoc().body.appendChild(maskEl);
        return { maskEl: maskEl, proxyEl: proxyEl };
    };

    var getDragProxy = function () {
        if (!dragProxy) {
            dragProxy = createDragProxy();
        }
        return dragProxy;
    };
    // Window类
	/**
	 * 【BaseWindow】
	 * 
	 * @class J.ui.BaseWindow
	 * @name BaseWindow
	 * @extends Object
	 * @param {Object} option 参数对象
	 * @since version 1.0
	 * @description window组件,可直接实例化,必须重写下列方法,不可直接使用baseWindow,垮平台的话可以在不同的文件夹重写此类
	 */
    var BaseWindow = new J.Class(
    /**
	 * @lends BaseWindow.prototype
	 */	
    		
    {
		
        _zIndex: 1,
        _inBorder: 5,
        _outBorder: 5,

		
		_windowFlag: 0,
		/**
		 * 初始化函数
		 * @param {Object} option 参数对象
		 * @return
		 */
        init: function (option) { 
            var windowContext = this;
            J.profile("windowCreat"+option.windowId,"baseWindow");
            option = this.parseOption(option);
            this.subWinWidth = 0 ;
            this.subWinMarginLeft = 0;
			this.desktopIndex = option.desktopIndex;
            this.setPrivateProperty();
			this.appendTo = option.appendTo;
            if(J.isUndefined(this._windowId)){
                throw '[BaseWindow.init]: _windowId is undefined!';
            }
			if(!this._appId){
				//J.out("创建窗口需要传入appId!"+option.title);
				//alert("创建窗口需要传入appId!"+option.title);
			}

            this.createDom();
            $D.setStyle(this._window_outer,"zIndex",this.option.zIndex);
            this.createEvent();
            if(this.option.hideWinBorder){
            	this.hideWinBorder();
            }
            if(this.option.hasToolBar){
                this.showToolBar();
            }

        },
        /**
		 * 解析参数(此函数为接口,需在继承类里做具体实现)
		 * @return {Int}  window的状态标志位
		 */
        parseOption : function(){
        	throw 'parseOption does not implement a required interface(Error in BaseWindow.parseOption())';
        },
        /**
         * 设置私有属性(此函数为接口,需在继承类里做具体实现)
         */
        setPrivateProperty : function(){
        	throw 'setPrivateProperty does not implement a required interface(Error in BaseWindow.setPrivateProperty())';
        },
        /**
		 * 获取window模版 此函数为接口,需在继承类里做具体实现
		 * @return {String} html html模版
		 */
        getTemplate : function(){
        	throw 'getTemplate does not implement a required interface(Error in BaseWindow.getTemplate())';
        },
        /**
		 * 初始化添加观察者或者事件时候的回调方法,这里的方法一般是window必须实现的(可在继承类继续添加)
		 * @param
		 * @return 
		 */
        initObserver : function(){
        	var windowContext = this;
            this.observer = {
            	onMousedown: function () {
                    //console.dir(windowContext);
                    if(J.browser.ie) {

                    }
                    else {
	                    $D.setStyle(windowContext._dragProxy.proxyEl, "left", windowContext.getX() + windowContext._outBorder + "px");
	                    $D.setStyle(windowContext._dragProxy.proxyEl, "top", windowContext.getY() + windowContext._outBorder + "px");
	                    $D.setStyle(windowContext._dragProxy.proxyEl, "width", windowContext._width - windowContext._outBorder * 2 + "px");
	                    $D.setStyle(windowContext._dragProxy.proxyEl, "height", windowContext._height - windowContext._outBorder * 2 + "px");
	                    $D.setStyle(windowContext._dragProxy.maskEl, "zIndex", 60002);
	                    $D.show(windowContext._dragProxy.maskEl);                   	
                    }
                },
            	onMove: function (xy) {
                    windowContext._x = xy.x;
                    windowContext._y = xy.y;
                    if(windowContext.subMode==1&&windowContext.isSubWinFloat&&windowContext.subWin){
                    	var subXY = $D.getRelativeXY(windowContext._subBodyOuter,windowContext.container.parentNode);
                    	var offsetY =  J.browser.ie?2:0;
            			windowContext.subWin.setXY(subXY[0],subXY[1]+offsetY);
                    }
                    if(windowContext.subMode==2){
                    	var x = windowContext.getX();
						var y = windowContext.getY();
            			windowContext.subWin.setXY(x+windowContext.getWidth(),y);
                    }
                    //J.out("move: "+xy.x)
                    $E.notifyObservers(windowContext, "dragMove", xy);
                },
                onBeforeDragStart: function(){
                    $E.notifyObservers(windowContext, "beforeDragStart");
                },
	        	onDragStart: function(o){
	                $E.notifyObservers(windowContext, "dragStart", o);
	            },
	            onDragEnd: function(o){
	            	if(windowContext.mask){
	            		windowContext.mask.hide();
	            	}
	              $E.notifyObservers(windowContext, "dragEnd", o);
	            },
                onResize: function (o) {
                	if(o.width) {
                    	windowContext.setWinWidth(o.width);
                	}
                	if(o.height) {
                    	windowContext.setWinHeight(o.height);
                	}
                    $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                },
                onDragProxyEnd: function (xy) {               
   					if(xy) {
   						$D.hide(windowContext._dragProxy.maskEl);
                    	windowContext.setXY(xy.x - windowContext._outBorder, xy.y - windowContext._outBorder);
                    }
                },
                onDragProxyResizeEnd: function (o) {
                    $D.hide(windowContext._dragProxy.maskEl);
                    windowContext.setXY(o.x - windowContext._outBorder, o.y - windowContext._outBorder);

                    var easing = 1.1;
                    var easingInterval = 200;
                    var mostStick = 5;
                    var currentStick = 0;
                    var easingFun = function () {
                        currentStick++;
                        var currentBodySize = windowContext.getBodySize();
                        var dw = o.width - currentBodySize.width;
                        var dh = o.height - currentBodySize.height;
                        windowContext.setWidth(currentBodySize.width + dw * easing + windowContext._outBorder * 2);
                        windowContext.setHeight(currentBodySize.height + dh * easing + windowContext._outBorder * 2);
                        $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                        if (currentStick < mostStick && (dw >= 5 || dw <= -5)) {
                            J.out("setting timeout " + dw + " " + dh + " " + currentStick + " mostStick:" + mostStick,"baseWindow");
                            setTimeout(easingFun, easingInterval);
                        } else {
                            windowContext.setWidth(o.width + windowContext._outBorder * 2);
                            windowContext.setHeight(o.height + windowContext._outBorder * 2);
                            $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());
                        }
                    };
                    //TODO Resize动画
                    //easingFun();
                    windowContext.setWidth(o.width + windowContext._outBorder * 2);
                    windowContext.setHeight(o.height + windowContext._outBorder * 2);

                    $E.notifyObservers(windowContext, "resize", windowContext.getBodySize());

                }
        	};
        	//throw 'initObserver does not implement a required interface(Error in BaseWindow.initObserver())';
        },
        /**
		 * 初始化节点引用(此函数为接口,需在继承类里做具体实现)
		 * @param
		 * @return 
		 */
        initDomReference : function(){
        	throw 'initDomReference does not implement a required interface(Error in BaseWindow.initDomReference())';
        },
        /**
		 * 初始化添加按钮(此函数为接口,需在继承类里做具体实现)
		 * @param
		 * @return 
		 */
        initButtons : function(){
        	throw 'initButtons does not implement a required interface(Error in BaseWindow.initButtons())';
        },
        /**
		 * 初始化添加事件(此函数为接口,需在继承类里做具体实现)
		 * @param
		 * @return 
		 */
        createEvent : function(){
        	throw 'createEvent does not implement a required interface(Error in BaseWindow.createEvent())';
        },
		/**
		 * getAppId
         * 遗留方法不知道干嘛用的
         * @deprecated
		 * @return 
		 */
		getAppId : function(){
			return this._appId;
		},
		/**
         * 获取一个按钮的引用,不存在返回null值
         * @param {String} name 
         * @return {HTMLElement} , null
		 */
        getButton : function(name){
            return this['_' + name + 'Button'] || null;
        },
		
		/**
		 * 获取window的状态标志位(当前,非当前...)
		 * @return {Int}  window的状态标志位
		 */
		getWindowFlags:function(){
			return this._windowFlag;
		},
		/**
		 * 设置window的状态标志位(当前,非当前...)
		 * @param {Int}  window的状态标志位
		 */
		setWindowFlags:function(flag){
			this._windowFlag = flag;
		},
		/**
		 * 创建window窗口及相关动作的设置(initDomReference,initObserver,initButtons)
		 */
        createDom: function () {
        	J.out("CreateDom","baseWindow");
            var windowContext = this;

            var windowId = this._windowId;
            this.getId = function () {
                return windowId;
            };
            var html = this.getTemplate();
            //var windowId = this.getId();

            this.container = $D.node("div", {
                "id": "appWindow_" + windowId,
                "class": "window window_current"
            });

            this.container.innerHTML = html;
            this.appendTo.appendChild(this.container);
            this.initDomReference();
           	J.out("initDomReference","baseWindow");
            this.initObserver();
            J.out("initObserver","baseWindow");
            this.initButtons();
            J.out("initButtons","baseWindow");
//            $D.setStyle(this._bodyOuter, 'borderWidth', this.option.bodyBorder + 'px');
            this._width = Number(this._width);
            this._height = Number(this._height);
            this.setWidth(this._width);
            this.setHeight(this._height);
            this._toolbarHeight = 0;
            
            if(!J.isUndefined(this.option.x) && !J.isUndefined(this.option.y)){
                this.setXY(this.option.x, this.option.y);
            }

            this.setTitle(this.option.title);

            if (this.option.html) {
                this.setHtml(this.option.html);
            }

//            if (this.option.isTask) {
//                // 添加到layout, 注意子类Chatbox不写入，Chatbox自行管理
////           		alloy.layout.addWindow(this);
//            }
			
            //创建flash隐藏时的节点 
            //if (this.option.flashMode) { //@rehorn
//            if (this.option.alterMode) {
//                this.createAlterDom(windowId);
//            }
            

        },
//        /**
//		 * 创建茶杯,提示信息
//		 * @param {Int} windowId windowId
//		 */
//        createAlterDom: function (windowId) {
//			// windowId = ( typeof(windowId === undefined) ? windowId : this.getId();
//			windowId = ( typeof(windowId) === 'undefined') ? this.getId() : windowId;																	
//            this.alterDom = $D.node("div", {
//                "id": "appWindow_" + windowId + "_alt",
//                "class": "flash_alt"
//            });
//            this.alterDom.innerHTML = "<div class='appIframeAlter'></div><div  class='appIframeAlterTxt'>运行中，点击恢复显示 :)</div>";
//			this.body.appendChild(this.alterDom);
//        },
//        /**
//		 * 显示茶杯,提示信息
//		 */
//        showAlterDom: function () {
//            $D.setStyle(this.body, "background", "#FFF");
//            $D.show(this.alterDom);
//        },
//         /**
//		 * 隐藏茶杯,提示信息
//		 */
//        hideAlterDom: function () {
//            $D.setStyle(this.body, "background", "transparent none");
//            $D.hide(this.alterDom);
//        },
        
        getTitleBarHeight: function(){
            return this._titleBarHeight || (this._titleBarHeight = $D.getHeight(this._titleBar));
        },
        
         /**
		 * 设置标题栏
		 * @param {String} title 标题
		 */
        setTitle: function (title) {
            var title = J.string.encodeHtml(title);
            if(this.option.titleIcon){
                var icon = '<span class="window_title_icon" style="background:url('+this.option.titleIcon+') no-repeat center center;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                title = icon + title;
            }
            this._title.innerHTML = title;
        },
        /**
		 * 设置标题栏html
		 * @param {String} title 标题html
		 */
        setTitleHtml: function (htmlTitle) {
            this._title.innerHTML = htmlTitle;
        },
        
        setToolBarHtml: function (html) {
            this._toolBar.innerHTML = html;
        },
        
        /*
        */
        showToolBarBtn: function(){
        	$D.show(this._toggleToolbar);	
        },
        hideToolBarBtn: function(){
        	$D.hide(this._toggleToolbar);
        },
        setToolbar: function(isShow){
        	if(isShow){
        		this.showToolBar();
        	}else{
        		this.hideToolBar();
        	}
        },
        toggleToolBar: function(){
        	if(this._toolbarIsShow){
        		this.hideToolBar();
        	}else{
        		this.showToolBar();
        	}
        },
        
        showToolBar: function(){
            return;
            this._toolbarIsShow = true;
            $D.show(this._toolBar);
            this._toolbarHeight = $D.getClientHeight(this._toolBar);
            $D.setStyle(this.body, 'top', this._toolbarHeight + 'px');
            this.setHeight(this.getBodyHeight());
            
            this._toggleToolbar.title = '收起工具条';
			$D.replaceClass(this._toggleToolbar, 'app_toolbar_toggle_down', 'app_toolbar_toggle_up');
			alloy.util.report2app('apptoolbar|open');
        },
        
        hideToolBar: function(){
            this._toolbarIsShow = false;
            $D.hide(this._toolBar);
            $D.setStyle(this.body, 'top', '0px');
            this._toolbarHeight = 0;
            this.setHeight(this.getBodyHeight());
            
            
			$D.replaceClass(this._toggleToolbar, 'app_toolbar_toggle_up', 'app_toolbar_toggle_down');
			this._toggleToolbar.title = '展开工具条';
			alloy.util.report2app('apptoolbar|close');
        },
        
        isToolBarShow: function(){
        	return this._toolbarIsShow;	
        },
        
        getToolBarHeight: function(){
        	return this._toolbarHeight;	
        },

        getToolBar: function(){
            return this._toolButtonBar;
        },
        /**
		 * 控制所有按钮显示
		 */
        setButton: function (opt) {
			for (var i in opt) {
				var isAvailable = !!opt[i],	// toBool
					btnList = [];

				switch (i) {
				/*case 'hasCloseButton':			// 关闭按钮（暂不开放）
					btnList.push(this._closeButton);
					break;*/
				case 'hasRefreshButton':			// 刷新按钮
//					btnList.push(this._refreshButton);
					break;
				default:
					switch (this.windowType) {
					case 'window':
						// for window only
						switch (i) {
						case 'hasFullButton':		// 全屏按钮
//							btnList.push(this._fullButton);
//							btnList.push(this._restorefullButton);
							break;
						case 'hasMaxButton':		// 最大化按钮
						//case 'hasRestoreButton':	// 恢复按钮
							btnList.push(this._maxButton);
							btnList.push(this._restoreButton);
							break;
						case 'hasMinButton':		// 最小化按钮
							btnList.push(this._minButton);
							break;
						}
						break;
					case 'widget':
						// for widget only
						switch (i) {
						case 'hasPinUpButton':		// 置顶按钮
						//case 'hasPinDownButton':	// 置顶取消按钮
							btnList.push(this._pinUpButton);
							btnList.push(this._pinDownButton);
							break;
						}
						break;
					}
				}

				// change button's availability
				if (btnList.length) {
					J.array.forEach(btnList, function (curBtn) {
						curBtn && curBtn.setAvailability(isAvailable);
						curBtn = null;
					});
					btnList = null;
				}
			}
        },
        /**
		 * 显示关闭按钮
		 */
        showCloseButton: function () {
        	if(this._closeButton){
        		this._closeButton.show();
        	}
        },
		/**
		 * 显示全屏按钮
		 */
        showFullButton: function () {
        	if(this._fullButton){
        		this._fullButton.hide();
        	}
        },
		/**
		 * 显示最大化按钮
		 */
       	showMaxButton: function () {
       		if(this._restoreButton){
       			this._restoreButton.hide();
       		}
       		if(this._maxButton){
       			 this._maxButton.show();
       		}
        },
		/**
		 * 显示还原按钮
		 */
        showRestoreButton: function () {
        	if(this._maxButton){
        		this._maxButton.hide();
        	}
        	if(this._restoreButton){
        		this._restoreButton.show();
        	}
        },
        /**
		 * 显示最小化按钮
		 */
        showMinButton: function () {
        	if(this._minButton){
        		this._minButton.show();
        	}
        },
        /**
		 * 显示刷新按钮
		 */
        showRefreshButton: function () {
        	if(this._refreshButton){
        		this._refreshButton.show();
        	}
        },
        /**
		 * 显示置顶按钮
		 */
        showPinUpButton: function () {
        	if(this._pinDownButton){
        		this._pinDownButton.hide();
        	}
        	if(this._pinUpButton){
        		this._pinUpButton.show();
        	}
        },
        /**
		 * 显示取消置顶按钮
		 */
        showPinDownButton: function () {
        	if(this._pinUpButton){
        		this._pinUpButton.hide();
        	}
        	if(this._pinDownButton){
        		this._pinDownButton.show();
        	}
        },
		/**
		 * 禁止ok按钮
		 */
		disableOkButton: function(isDisable){		 
			this._okButton.disable(isDisable);
		},
		/**
		 * 显示下方控制菜单栏,并显示指定按钮
		 * @param {Button} button 按钮类
		 */
		showControlButton : function(button){
			$D.show(this._controlArea);
            $D.setStyle(this.body, "bottom", "29px");
            $D.addClass(this._window_outer, 'window_has_controlArea');
            button.show();
		},
		/**
		 * 隐藏下方控制菜单栏
		 */
		hideControlArea : function(){
			$D.hide(this._controlArea);
            $D.setStyle(this.body, "bottom", "0");
            $D.removeClass(this._window_outer, 'window_has_controlArea');
		},
		/**
		* 获取所有按钮
		*/
		getButtons : function(){
			if(this._buttons){
				return this._buttons;
			}
		},
        /**
		 * 显示窗口
		 */
        show: function () {
            $D.show(this.container);
            var visibility = $D.getStyle(this.container,"visibility");
            if(visibility){
            	$D.setStyle(this.container,"visibility","visible");
            }
            var windowContext = this;
            J.info(">>>> Window: show","baseWindow");
            $E.notifyObservers(this, "show", this.getBodySize());
            this._isShow = true;

            
        },
        /**
		 * 隐藏窗口
		 */
        hide: function (visibility) {
        	if(visibility){
        		$D.setStyle(this.container,"visibility","hidden");
        	}else{
        		$D.hide(this.container);
        	}
            $E.notifyObservers(this, "hide");
            this._isShow = false;
        },
        /**
		 * 窗口是否显示
		 * @return {Boolen} 窗口是否显示
		 */
        isShow: function () {
            return this._isShow;
        },
        /**
		 * 窗口显示隐藏开关
		 */
        toggleShow: function () {
            if (this.isShow()) {
                this.hide();
            } else {
                this.show();
            }
        },

       /**
		 * 设置窗口为当前
		 */
        setCurrent: function (option) {
//			var touchpad = $D.id('touchpad');
//			var id = this.getAppId();
//			
//			//这里可以修改,抛出事件给app类
//			if(touchpad){
//				if(id==undefined || id=='appMarket'){
//					touchpad.style.width = '1px';
//					touchpad.style.height = '1px';
//					//console.log('hide touchpad');
//				}else{
//					touchpad.style.width = '100%';
//					touchpad.style.height = '100%';
//					//console.log('show touchpad');
//				}
//			}
            this.setCurrentWithoutFocus(option);
            //TODO if crash?
            this.focus();
        },


        /**
		 * 设置窗口为非当前
		 */
        setNotCurrent: function () {
            // 将样式设置为非当前
			//if(this === alloy.layout.getCurrentWindow())return;
			this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_CURRENT | BaseWindow.CONST.WINDOW_FLAG_NOT_CURRENT);

			this.setStyleNotCurrent();
			$E.notifyObservers(this, "setNotCurrent");
			
			//if(this === alloy.layout.getCurrentWindow()){
			//	alloy.layout.setCurrentWindow(null);
			//}
            //$E.notifyObservers(this, "setNotCurrent");
        },

        /**
		 * 设置窗口为当前激活的样式,并广播出去,windowmanager可以接收通知并处理相应的zindex
		 */
        setCurrentWithoutFocus: function (option) {
			if(option && option.fromInit && this.windowType==='widget'){
				this.show();
				this.setNotCurrent();
				return;
			}
        	var c= this;                
            if(!(this.getWindowFlags() & BaseWindow.CONST.WINDOW_FLAG_CURRENT)){
            	c.setStyleCurrent();
            	c.show();
            	this.setWindowFlags(this.getWindowFlags() | BaseWindow.CONST.WINDOW_FLAG_CURRENT);
            }
			$E.notifyObservers(c, "setCurrent");
 
        },

        /**
		 * 设置窗口为当前的样式
		 */
        setStyleCurrent: function () {
            $D.addClass(this.container, "window_current");
        },

        /**
		 * 设置窗口为非当前的样式
		 */
        setStyleNotCurrent: function () {
			//避免被设为非当前的窗口已经被关闭出错(IE下)
			if(!this.container){
				return;
			}
            $D.removeClass(this.container, "window_current");
        },

        /**
		 * 广播需要聚焦的通知,chatbox做聚焦聊天输入框的相关处理
		 */
        focus: function () {
            $E.notifyObservers(this, "focus");
        },
		
        /**
		 * 设置窗口大小模式
		 */
        setBoxStatus: function (status) {
            this._status = status;

        },
         /**
		 * 获取窗口大小模式
		 */
        getBoxStatus: function () {
            return this._status;
        },
        
        
        /**
         * 调整窗口尺寸
		 * @param {Int} clientWidth 窗口宽度
		 * @param {Int} clientHeight 窗口高度
		 * @parma {Int} x 窗口X位置(可缺省,默认为0)
		 * @param {Int} y 窗口y位置(可缺省,默认为0)
         */
        adjustSize: function(clientWidth, clientHeight, x, y) {
			if(!J.isUndefined(x)&&!J.isUndefined(y)){
				this.setXY(x,y);
			}
            this.setWinWidth(clientWidth);
            this.setWinHeight(clientHeight);
            $E.notifyObservers(this, "resize", this.getBodySize());
        },
        /**
		 * 窗口最大化,并广播出去,通过管理者设置最大化的大小
		 */
        max: function () {
        	if(!(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN)){
				this._restoreX=this._x;
				this._restoreY=this._y;
			}
        	var beforeMaxState= this.getBoxStatus();
            this.setDisableDrag();

			this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_NORMAL | BaseWindow.CONST.WINDOW_FLAG_MAX);
            this.setBoxStatus("max");
            
            
            this.showRestoreButton();
			//this._fullButton.show();//隐藏全屏
//			this._restorefullButton.hide();

			//TODO deewiidu 存储max之前的变量
            $E.notifyObservers(this, "max",beforeMaxState);
			$E.notifyObservers(this, "resize", this.getBodySize());
////            $E.on(window, "resize", this.observer.onWindowResize);
//            $E.addObserver(alloy.layout, "sideBarPinUp", this.observer.onWindowResize);
//            $E.addObserver(alloy.layout, "sideBarPinDown", this.observer.onWindowResize);
        },

        /**
		 * 窗口全屏,并广播出去,通过管理者设置最大化的大小
		 */
		fullscreen:function(){
			if(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_NORMAL){
				this._restoreX=this._x;
				this._restoreY=this._y;
			}
            this.setDisableDrag();
			this.setWindowFlags(this.getWindowFlags() | BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN);
			this.setBoxStatus("fullscreen");
			this._maxButton.hide();
			this._restoreButton.hide();
			this._fullButton.hide();
			this._restorefullButton.show();
			$E.notifyObservers(this, "fullscreen", this.getBodySize());
			$E.notifyObservers(this, "resize", this.getBodySize());
		},
		
		/**
		 * 全屏还原
		 */
		restorefull:function(){
			if(this.getWindowFlags()&BaseWindow.CONST.WINDOW_FLAG_NORMAL){
				this.restore();
			}
			else{
				this.max();
			}
			this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_FULLSCREEN);
			$E.notifyObservers(this, "restorefull",this.getBoxStatus());
			$E.notifyObservers(this, "resize", this.getBodySize());
			
		},
		/**
		 * 窗口最小化
		 */
        min: function () {
        	var stat= this.getBoxStatus();
			this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_CURRENT | BaseWindow.CONST.WINDOW_FLAG_NOT_CURRENT | BaseWindow.CONST.WINDOW_FLAG_MIN);
            if(this.option.isVisibilityMode){
            	this.hide(true);
            }else if (!this.option.flashMode) {//flash mode 由app自已处理hide的具体方式
                this.hide();
           	}
            var s= stat||"min"; //Yukin:这里为什么要读取原来的设置呢？？？
			this.setBoxStatus(s);
			this._isShow = false; 
            $E.notifyObservers(this, "min");  
            $E.notifyObservers(this, "resize", this.getBodySize());
        },

        /**
		 * 窗口还原
		 */
        restore: function () { 
			this.setWindowFlags(this.getWindowFlags() & ~BaseWindow.CONST.WINDOW_FLAG_MAX | BaseWindow.CONST.WINDOW_FLAG_NORMAL);
//            $E.off(window, "resize", this.observer.onWindowResize);
//            $E.removeObserver(alloy.layout, "sideBarPinUp", this.observer.onWindowResize);
//            $E.removeObserver(alloy.layout, "sideBarPinDown", this.observer.onWindowResize);

            this.setXY(this._restoreX, this._restoreY);
            
            if (this._restoreWidth < 0) {
                this._restoreWidth = 0;
            }
            if (this._restoreHeight < 0) {
                this._restoreHeight = 0;
            }

            this.setWidth(this._restoreWidth);
            this.setHeight(this._restoreHeight);
            if(this._dragController){
            	this._dragController.lock();
            } 
            this.setEnableDrag();

            if (this.option.hasMaxButton) {
//            	this._fullButton.show();
                this.showMaxButton();
            	//this._fullButton.show();//隐藏全屏
             	this._restorefullButton.hide();
				if (this.option.noFullButton) {
					this._fullButton.hide();
				}
			}
            //TODO deewiidu 这里调换了位置  不然chtbox的类在执行restore的时候根本没法得到正确的state
            this.setBoxStatus("restore");
            $E.notifyObservers(this, "restore");
            $E.notifyObservers(this, "resize", this.getBodySize());
            

        },
        /**
		 * 设置窗口zIndex的层次,0为最低级
		 * @param {Int} level 窗口zIndex的层次
		 */
        setZIndexLevel : function (level){
        	this.zIndexLevel = level;
        },
        /**
		 * 获取窗口zIndex的层次,0为最低级
		 * @return {Int} level 窗口zIndex的层次
		 */
        getZIndexLevel : function(){
        	return this.zIndexLevel;	
        },
        /**
         * 锁定zindex,锁定后setCurrent将不会变更层级
         * @param {Boolean} isLock true将锁定
         */
        setLockZIndex : function (isLock){
        	this._isLockZIndex = isLock;
        },
        /**
		 * 获取ZIndex是否被锁定
		 */
        isLockZIndex : function(){
        	return this._isLockZIndex;	
        },
        /**
		 *设置窗口宽度
		 * @param {Int} width 窗口宽度
		 */
        setWidth: function (width) {
        	this.setBodyWidth(width);
        	return;	
        },
        setWinWidth : function(width){
        	width = width||this._width;
        	var padding = this.isBorderHide?0:10;
            var borderWidth = this.option.bodyBorder * 2;
            this._bodyWidth = width - padding*2 - borderWidth -this.subWinWidth - this.subWinMarginLeft;
            this._width = width;
            $D.setStyle(this.container, "width", width+ "px");
            $D.setStyle(this._bodyOuter, "width", this._bodyWidth + this.subWinWidth + this.subWinMarginLeft + "px");
			$D.setStyle(this.body, "width", this._bodyWidth + "px");
			$D.setStyle(this._window_outer,"padding",padding+"px");
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreWidth = this._bodyWidth;		
            }
        },
        setBodyWidth : function(bodyWidth){
        	bodyWidth = bodyWidth||this._bodyWidth;
        	var padding = 10,
        		width,
        		borderWidth = this.option.bodyBorder * 2;
        	if(this.isBorderHide){
        		width = bodyWidth + borderWidth;
        		$D.setStyle(this._window_outer,"padding","0px");
        	}else{
        		width = bodyWidth + borderWidth + padding*2;
        		$D.setStyle(this._window_outer,"padding",padding+"px");
        	}
        	this._bodyWidth = bodyWidth;
        	width = width + this.subWinWidth + this.subWinMarginLeft;
        	this._width = width;
        	$D.setStyle(this.container, "width", width + "px");
            $D.setStyle(this._bodyOuter, "width", bodyWidth + this.subWinWidth + this.subWinMarginLeft + "px");
			$D.setStyle(this.body, "width", bodyWidth + "px");
			if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreWidth = this._bodyWidth;			
            }
        },
        getBodyWidth : function(){
        	return this._bodyWidth;
        },
        /**
		 *获取窗口宽度
		 * @return {Int} 窗口宽度
		 */
        getWidth:function(){
        	return this._width;
        },
        getWinWidth:function(){
            return this._width; 
        },
        /**
		 *获取窗口高度
		 * @return {Int} 窗口高度
		 */
        getHeight:function(){
        	return this._height;
        },
        getWinHeight : function(){
            return this._height;  
        },
        
        /**
		 *设置窗口高度
		 * @param {Int} height 窗口高度
		 */
        setHeight: function (height) {
        	this.setBodyHeight(height);
        	return;   
        },
        setWinHeight : function(height){
        	height = height||this._height;
        	var titleBarHeight = this.getTitleBarHeight(), 
        		borderWidth = this.option.bodyBorder * 2,
        		controlAreaHeight = 0,
        		toolbarHeight = 0,
        		padding = 10,
        		bodyHeight;
//        	if(J.browser.ie&&J.browser.ie<7){
//            	titleBarHeight = 29;
//            }
            if(this._controlArea&&$D.isShow(this._controlArea)){
            	controlAreaHeight = 29;
            }
            if(this._toolbarHeight){
                toolbarHeight = this._toolbarHeight;
            }
            var windowOuterHeight;
            if(this.isBorderHide){
            	bodyHeight = height;
            	$D.setStyle(this._window_outer,"padding","0px");
            	$D.setStyle(this._bodyOuter, "top", "0");
                windowOuterHeight = height - borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
            	$D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }else{
            	bodyHeight = height - titleBarHeight - toolbarHeight - controlAreaHeight - padding*2 - borderWidth;
            	$D.setStyle(this._window_outer,"padding",padding+"px");
            	$D.setStyle(this._bodyOuter, "top", titleBarHeight +"px");
                windowOuterHeight = height - padding*2 -borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
            	$D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }
            this._bodyHeight = bodyHeight + 1;
            
            this._height = height;
            $D.setStyle(this.body, "height", (this._bodyHeight-borderWidth) + "px");
            $D.setStyle(this._bodyOuter, "height", (this._bodyHeight+toolbarHeight-borderWidth) + "px");
            $D.setStyle(this.container, "height", height + "px");
        	
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreHeight = this._bodyHeight;
            }
            //TODO notify setNewHeight
            $E.notifyObservers(this, "setNewHeight", height);
        },
        setBodyHeight : function(bodyHeight){
        	bodyHeight = bodyHeight||this._bodyHeight;
        	var titleBarHeight = this.getTitleBarHeight(), 
        		borderWidth = this.option.bodyBorder * 2,
        		controlAreaHeight = 0,
        		toolbarHeight = 0,
        		padding = 10,
        		height;
//        	if(J.browser.ie&&J.browser.ie<7){
//            	titleBarHeight = 29;
//            }
            if(this._controlArea&&$D.isShow(this._controlArea)){
            	controlAreaHeight = 29;
            }
            if(this._toolbarHeight){
                toolbarHeight = this._toolbarHeight;
            }
            var windowOuterHeight;
            if(this.isBorderHide){
            	height = bodyHeight;
            	$D.setStyle(this._window_outer,"padding","0px");
            	$D.setStyle(this._bodyOuter, "top", "0");
            	windowOuterHeight = height - borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }else{
            	height = bodyHeight + titleBarHeight + toolbarHeight + controlAreaHeight + padding*2+borderWidth;
            	$D.setStyle(this._window_outer,"padding",padding+"px");
            	$D.setStyle(this._bodyOuter, "top", titleBarHeight + "px");
            	windowOuterHeight = height - padding*2 -borderWidth;
                if(J.browser.ie == 6){
                    windowOuterHeight = windowOuterHeight - windowOuterHeight % 2;
                }
                $D.setStyle(this._window_outer, "height", windowOuterHeight + "px");
            }
            this._bodyHeight = bodyHeight + 1;

            this._height = height;
            $D.setStyle(this.body, "height", (this._bodyHeight-borderWidth) + "px");
            $D.setStyle(this._bodyOuter, "height", (this._bodyHeight+toolbarHeight-borderWidth) + "px");
            $D.setStyle(this.container, "height", height + "px");
            //模式的处理
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this._restoreHeight = this._bodyHeight;
            }
            //TODO notify setNewHeight
            $E.notifyObservers(this, "setNewHeight", this._height);
        },
        /**
		 *获取窗体body部分高度
		 * @return {Int} 窗体body部分高度
		 */
		getBodyHeight: function () {
			return this._bodyHeight;
		},
		
		/**
		 *设置窗口的外框尺寸
		 * @param {Int} width 
		 * @param {Int} height 
		 */
		setWinSize: function(option){
			this.setWinWidth(option.width);
			this.setWinHeight(option.height);
			$E.notifyObservers(this, "resize", this.getBodySize());
		},
		
		/**
		 *设置窗口的内部Body尺寸
		 * @param {Int} width
		 * @param {Int} height 
		 */
		setBodySize: function(option){
			this.setBodyWidth(option.width);
			this.setBodyHeight(option.height);
			$E.notifyObservers(this, "resize", this.getBodySize());
		},

		/**
		 *获取窗口的zIndex
		 * @return {Int} 窗口的zIndex
		 */
        getZIndex: function () {
            return this._zIndex;
        },
		/**
		 *设置窗口的zIndex
		 * @param {Int} zIndex 窗口的zIndex
		 */
        setZIndex: function (zIndex) {
            $D.setStyle(this.container, "zIndex", zIndex);
            $D.setStyle(this._window_inner, "zIndex", zIndex);
            this._zIndex = zIndex;
        },

        // 设置窗口位置
        /**
		 *设置窗口位置
		 * @param {Int} x 窗口x位置
		 * @param {Int} y 窗口y位置
 		 */
        setXY: function (x, y) { 
        	//var co= this.container;
        	//$D.hide(co);
            if (x || x === 0) {
                this.setX(x);
            }
            if (y || y === 0) {
                this.setY(y);
            }
            //$D.show(co);

        },

        /**
		 *设置窗口x位置
		 * @param {Int} x 窗口x位置置
 		 */
        setX: function (x) {
            this._x = x;
            //this._restoreX = this._x;
            $D.setStyle(this.container, "left", x + "px");
            $E.notifyObservers(this, "positionChanged");
            //$D.setStyle(this.container, "right", "");
        },
         /**
		 *设置窗口y位置
		 * @param {Int} y 窗口y位置
 		 */
        setY: function (y) {
            this._y = y;
            //this._restoreY = this._y;
            $D.setStyle(this.container, "top", y + "px");
            $E.notifyObservers(this, "positionChanged");
            //$D.setStyle(this.container, "bottom", "");
        },

         /**
		 *获取窗口x位置
		 * @return {Int} 窗口x位置
 		 */
        getX: function (x) {
            return parseInt($D.getStyle(this.container, "left"));
            //$D.setStyle(this.container, "right", "");
        },
         /**
		 *获取窗口还原x位置
		 * @return {Int} 窗口还原x位置
 		 */
        getRestoreX : function(){
        	return this._restoreX;
        },
        /**
		 *获取窗口还原y位置
		 * @return {Int} 窗口还原y位置
 		 */
        getRestoreY : function(){
        	return this._restoreY;
        },
        /**
		 *获取窗口左上角坐标
		 * @return {Int} 窗口左上角坐标
 		 */
		getLeft: function(){
			return this._x;
		},
         /**
		 *获取窗口y位置
		 * @return {Int} 窗口y位置
 		 */
        getY: function (y) {
            return parseInt($D.getStyle(this.container, "top"));
            //$D.setStyle(this.container, "bottom", "");
        },
        
        /**
		 *获取窗口xy位置
		 * @return {Object} 窗口xy位置
 		 */
        getXY: function (x) {
            return {
            	x:this.getX(),
            	y:this.getY()
            };
        },
        
        /**
		 *获取窗口还原xy位置
		 * @return {Object} 窗口还原xy位置
 		 */
        getRestoreXY : function(){
        	return {
            	x:this.getRestoreX(),
            	y:this.getRestoreY()
            };
        },

         /**
		 *设置窗口left位置,会将right清空
		 * @param {Int} 窗口left位置
 		 */
        setLeft: function (left) {
            $D.setStyle(this.container, "left", left + "px");
            $D.setStyle(this.container, "right", "");
        },
        /**
		 *设置窗口top位置,会将bottom清空
		 * @param {Int} 窗口top位置
 		 */
        setTop: function (top) {
            $D.setStyle(this.container, "top", top + "px");
            $D.setStyle(this.container, "bottom", "");
        },
       /**
		 *设置窗口right位置,会将left清空
		 * @param {Int} 窗口right位置
 		 */
        setRight: function (right) {
            $D.setStyle(this.container, "right", right + "px");
            $D.setStyle(this.container, "left", "");
        },
         /**
		 *设置窗口bottom位置,会将top清空
		 * @param {Int} 窗口bottom位置
 		 */
        setBottom: function (bottom) {
            $D.setStyle(this.container, "bottom", bottom + "px");
            $D.setStyle(this.container, "top", "");
        },
		 /**
		 *设置窗口居中,广播出通知,需由管理者去设置
 		 */
        setWindowCentered: function () {  
//            this.setXY(l, t);
            
            $E.notifyObservers(this, "setCenter");
        },
        
         /**
		 *设置窗口相对某窗口居中
		 *@param {Element} parentWindow 需要相对居中的节点
 		 */
		setWindowCenteredRelative: function(parentWindow){
			var x=parentWindow.getX()+((parentWindow.getWidth()-this._width)/2);
			this.setX(x);
		},

        // 开启drag
        /**
		 *开启拖拽
 		 */
        enableDrag: function () {
            this.option.dragable = true;
            if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") {
                this.setEnableDrag();
            }

        },
        /**
		 *关闭拖拽
 		 */
        disableDrag: function () {
            this.option.dragable = false;
            this.setDisableDrag();
        },

        /**
		 *开启拖拽代理
 		 */
        enableDragProxy: function () {
            this.option.dragProxy = true;
            //this.setEnableDragProxy();

        },
        /**
		 *关闭拖拽代理
 		 */
        disableDragProxy: function () {
            this.option.dragProxy = false;
            //this.setDisableDragProxy();
        },



        /**
		 *开启拖拽brige
 		 */
        setEnableDrag: function () {
        	var c= this;
            if (this.option.dragable) {
                if (this._dragController) {
                    if (this.option.dragProxy) {
                        $E.on(this.container, "mousedown", this.observer.onMousedown);
                    }
                    this._dragController.unlock();
                } else {

                    if (this.option.dragProxy) {
					
                        this._dragProxy = getDragProxy();
                        $E.on(this.container, "mousedown", this.observer.onMousedown);
                        this._dragController = new J.ui.Drag(this.container, this._dragProxy.proxyEl, {
                            isLimited: true,
                            clientEl: this.option.dragLimitEl || this.option.appendTo,//az 2011-9-20
                            leftMargin: this._leftMargin + this._outBorder,
                            topMargin: this._topMargin + this._outBorder,
                            rightMargin: this._rightMargin + this._outBorder,
                            bottomMargin: this._bottomMargin + this._outBorder,
                            isOverLeft: true,
                            isOverRight: true,
                            /*isOverBottom: true,*/
                            isLockCursorInScreen: true
                        });

                        $E.addObserver(this._dragController, "end", this.observer.onDragProxyEnd);
	              
	                   	
                    } else {
                        this._dragController = new J.ui.Drag(this.container, this.container, {
                            isLimited: true,
                            clientEl: this.option.dragLimitEl || this.option.appendTo,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            isOverLeft: true,
                            isOverRight: true,
                            /*isOverBottom: true,*/
                            isLockCursorInScreen: true
                        });
                        $E.addObserver(this._dragController, "move", this.observer.onMove);  
                    }
                    $E.addObserver(this._dragController, "beforeStart", this.observer.onBeforeDragStart);  
                    $E.addObserver(this._dragController, "start", this.observer.onDragStart);  
                    $E.addObserver(this._dragController, "end", this.observer.onDragEnd);  

                    //刚初始化,锁住
//                    this._dragController.lock();
                }
                this.setEnableResize();
            }
        },
        /**
		 *开启拖拽brige
 		 */
        setDisableDrag: function () {
            if (this._dragController) {
                this._dragController.lock();
                if (this.option.dragProxy) {
                    $E.off(this.container, "mousedown", this.observer.onMousedown);
                }
            }
            this.setDisableResize();
        },
        setDragLimite: function(option){
            this._dragController.setLimite(option);
        },
		onDrag:function(e){
			if(J.browser.ie && J.browser.ie<=6 && (e.target.tagName=='A' || e.target.parentNode && e.target.parentNode.tagName=='A')) return;
			this.startDrag([e.pageX,e.pageY]);
		},
		startDrag : function(xy){
			var context = this;
			var node=context.container.children[0];
			$D.hide(node);
			if(context.mask){
				context.mask.remove();
			}
			context.mask =  new J.ui.MaskLayer({appendTo:context.container,opacity: 0});
			context.mask.show();
			$D.show(node);
			if(typeof(xy)!='undefined'){
				var xy1=$D.getClientXY(this.body);
				this._dragController.dragStartIn(xy[0]+xy1[0],xy[1]+xy1[1]);
			}
			else{
				var onMove = function(e){
					context._dragController.dragStart(e);
					$E.off(document, "mousemove",onMove);
				}
				$E.on(document, "mousemove",onMove);
			}
		},

        /**
		 *开启Resize
 		 */
        enableResize: function () {
            this.option.resize = true;
            if (this.getBoxStatus() !== "max") {
                this.setEnableResize();
            }
        },
        /**
		 *关闭Resize
 		 */
        disableResize: function () {
            this.option.dragable = false;
            this.setDisableResize();
        },
       /**
		 *开启Resize brige
 		 */
        setEnableResize: function () {
            if (this.option.resize) {
                if (this._resizeController) {
                    if (this.option.dragProxy) {
                        $E.addObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                    }
                    this._resizeController.show();
                } else {
                    if (this.option.dragProxy) {
                        this._dragProxy = getDragProxy();
                        this._resizeController = new J.ui.Resize(this._window_inner, this._dragProxy.proxyEl, {
                        	isLimited: true,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            minWidth: this._minWidth,
                            minHeight: this._minHeight,
                            dragProxy: this._dragProxy
                        });
                        $E.addObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                        $E.addObserver(this._resizeController, "end", this.observer.onDragProxyResizeEnd);

                    }
                    else {
                        this._resizeController = new J.ui.Resize(this._window_inner, this.container, {
                        	isLimited: true,
                            leftMargin: this._leftMargin,
                            topMargin: this._topMargin,
                            rightMargin: this._rightMargin,
                            bottomMargin: this._bottomMargin,
                            minWidth: this._minWidth,
                            minHeight: this._minHeight
                        });
                        $E.addObserver(this._resizeController, "resize", this.observer.onResize);
                    }
					$E.addObserver(this._resizeController, "mousedown", this.observer.onDragStart);  
                    $E.addObserver(this._resizeController, "end", this.observer.onDragEnd);  
                }
            }
        },

        /**
		 *关闭Resize brige
 		 */
        setDisableResize: function () {
            if (this._resizeController) {
                this._resizeController.hide();
                if (this.option.dragProxy) {
                    $E.removeObserver(this._resizeController, "mousedown", this.observer.onMousedown);
                }
            }
        },
		setLimite : function(option){
			option = option || {};
			if (this.isLimited) {
				this._leftMargin = option.leftMargin;
	        	this._topMargin =   option.topMargin;
	        	this._rightMargin =  option.rightMargin;
	        	this._bottomMargin = option.bottomMargin;	
			}
		},
        setMinLimite : function(option){
        	if(this._resizeController){
        		this._resizeController.setWidth(this._width);
        		this._resizeController.setMinLimite(option);	
        	}
        },
		/**
		 *设置窗口body的html
		 *@param {String} html 窗口body的html
 		 */
        setHtml: function (html) {
            this.html = html;
            this.body.innerHTML = html;
//            if (this.option.alterMode) {//转移到app类去了
//                this.createAlterDom(this.getId());
//            }
        },
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
		setBorderOpacity: function(opacity){
            //$D.setStyle(this.container, 'opacity', 1);
            if(J.browser.ie && J.browser.ie < 9){
            	return;  //ie8以下不支持
            }
            $D.setStyle(this._bg_container, 'opacity', opacity);
        },
        /**
         * 设置遮罩的透明度
         * @param {Decimal} opacity 透明度,0~1之间的小数
         */
		setOpacity: function(opacity){
			if(J.browser.ie && J.browser.ie < 9){
            	return;  //ie8以下不支持
            }
            $D.setStyle(this.container, 'opacity', opacity);
        },
		/**
		 *设置窗口body的节点
		 *@param {Element} node 窗口body的节点
 		 */
        append: function (node) {
            this.body.appendChild(node);
        },

		/**
		 *获取窗口的size
		 *@return {Object} size的对象
 		 */
        getSize: function () {
            return {
                width: $D.getClientWidth(this.container),
                height: $D.getClientHeight(this.container)
            };
        },
        /**
		 *获取窗口body的size
		 *@return {Object} size的对象
 		 */
        getBodySize: function () {

            return {
                width: parseInt($D.getStyle(this.body, "width"), 10),
                height: parseInt($D.getStyle(this.body, "height"), 10)
            };
        },
 		/**
		 *获取窗口本身的dom对象
		 *@return {Element} 窗口本身的dom对象
 		 */
		getSelfDomObj : function(){
			return this.container;			
		},
		hideWinBorder : function(){
			if(!this.isBorderHide){
				this.isBorderHide = true;
				$D.hide(this._window_bg);
				$D.hide(this._titleBar);
				this.setWidth(this.getBodyWidth());
				this.setHeight(this.getBodyHeight());
			}	
		},
		showWinBorder : function(){
			if(this.isBorderHide){
				this.isBorderHide = false;
				$D.show(this._window_bg);
				$D.show(this._titleBar);
				this.setWidth(this.getBodyWidth());
				this.setHeight(this.getBodyHeight());
			}
		},
		toggleWinBorder : function(){
			if(!this.isBorderHide){
				this.hideWinBorder();
			}else{
				this.showWinBorder();
			}
		},
		//subMode:0,无子窗口；1，内嵌子窗口；2，跟随子窗口
		setSubMode : function(mode,option){
			switch(mode){
			 case 1 :
			     this.setSubWinInner(option);
			     break;
			 case 2 : 
			     this.setSubWinFollow(option);
			     break;
			 default : 
			 	this.setSubWinNone(option);
			     break;
			}
			this.subMode = mode;
		},
		setSubWinInner : function(option){
			option = option||{};
		  	this.subMode = 1;
		  	this.subWinWidth =this.subWinWidth||200;
		  	this.subWinMarginLeft = 10;
		  	var windowId = this.getId();
//		  	$D.setStyle(this.container, "width", this._width+ this.subWinWidth + this.subWinMarginLeft + "px");
//            $D.setStyle(this._bodyOuter, "width", this._bodyWidth+ this.subWinWidth +this.subWinMarginLeft + "px");
            //储存以便还原
            if(this.getBoxStatus() != "fullscreen"&&this.getBoxStatus() != "max"){
            	this.setBodyWidth(option.width||this._bodyWidth);
				this.setBodyHeight(option.height||this._bodyHeight);
            }else{
            	this.setWinWidth();
				this.setWinHeight();
            }       
            if(this._subBodyOuter){
            	$D.show(this._subBodyOuter);
            }else{
            	this._subBodyOuter = $D.node("div",{
            		"class" : "window_bodyArea",
            		"id" : "window_sub_body_"+windowId
            	});
            	this._bodyOuter.appendChild(this._subBodyOuter);
            }
            $D.setStyle(this._subBodyOuter, "width",this.subWinWidth + "px");
            $D.setStyle(this._subBodyOuter, "height",this._bodyHeight + "px");
            $D.setStyle(this._subBodyOuter, "right","5px");
//			$D.setStyle(this._subBodyOuter, "background","#eee");
			$D.setStyle(this.subWin.container, "left","0");
			$D.setStyle(this.subWin.container, "top","0");
			this.subWin.hideWinBorder();
			if(this.isSubWinFloat){
            	var subXY = $D.getRelativeXY(this._subBodyOuter,this.container.parentNode);
            	var offsetY =  J.browser.ie?2:0;
            	this.subWin.setXY(subXY[0],subXY[1]+offsetY);
            }else{
            	this._subBodyOuter.appendChild(this.subWin.container);
            }
            this.setCurrent();
            if(option.isSubWinFloat){
            	this.subWin.setZIndex(this.getZIndex()+1);
            }
            var context = this;
            this.setMinLimite({
            	minWidth:context._width,
            	minHeight:context._height
            });
		  	
		},
		hideSubWinInner : function(){
			this.subWinWidth = 0;
			this.subWinMarginLeft = 0;
			this.subWin.showWinBorder();
			this.setBodyWidth(this._bodyWidth);
//			$D.setStyle(this.container, "width", this._width + "px");
//            $D.setStyle(this._bodyOuter, "width", this._bodyWidth + "px");
			if(this._subBodyOuter){
            	$D.hide(this._subBodyOuter);
            }
            var x = this.getX();
			var y = this.getY();
            this.subWin.setXY(x+this.getWidth(),y);
            if(!this.isSubWinFloat){
            	this.subWin.option.appendTo.appendChild(this.subWin.container);
            }
            var _restoreX = this._restoreX;
            var _restoreY = this._restoreY;
            //设置为原来大小
            if(this.getBoxStatus() == "fullscreen"){
				this.fullscreen();
				this._restoreX=_restoreX;
				this._restoreY=_restoreY;
				this._restoreWidth = this.option.width;
            	this._restoreHeight = this.option.height;
			}else if(this.getBoxStatus() == "max"){
				this.max();
				this._restoreX=_restoreX;
				this._restoreY=_restoreY;
				this._restoreWidth = this.option.width;
            	this._restoreHeight = this.option.height;
			}else{
				this.setWidth(this.option.width);
				this.setHeight(this.option.height);
			}
            var context = this;
            this.setMinLimite({
            	minWidth:context._minWidth,
            	minHeight:context._minHeight
            });
//            this.subWin.setXY(this.subWin._x,this.subWin._y);
            //this.subWin.option.appendTo.appendChild(this.subWin.container);
		},
		setSubWinFollow : function(){
			if(this.subMode!=2){
				this.removeSubordinate();	
			}
		  	this.subMode = 2;
		  	var x = this.getX();
			var y = this.getY();
            this.subWin.setXY(x+this.getWidth(),y);
            var windowContext = this;
            var onMove = function(){
            	windowContext.setSubWinNone();
				$E.removeObserver(this.subWin._dragController, "move", onMove); 
            }
            $E.addObserver(this.subWin._dragController, "move", onMove); 
		},
		setSubWinNone : function(){
			if(this.subMode==0){
				return;
			}
			this.subMode = 0;
			this.hideSubWinInner();
			
		},
		getSubMode : function(){
			return this.subMode;
		},
		//添加一个从属子窗口
		addSubordinate : function(window,option){
			if(!this.subWin){
				this.subWin = window;
				if(option.subWinWidth){
					this.subWinWidth = 	option.subWinWidth;
				}
				if(!option||!option.mode){
					var mode =  1;	
				}else{
					var mode = option.mode;	
				}
				if(option.isSubWinFloat){
					this.isSubWinFloat = true;
				}else{
					this.isSubWinFloat = false;
				}
				this.setSubMode (mode,option);
			}
		},
		//移除一个从属子窗口
		removeSubordinate : function(){
			if(this.subWin){
				this.setSubMode (0);
				//重置所有属性
				this.subWin = null;
				this.subWinWidth = 0;
				this.isSubWinFloat = false;//子窗口是否以浮动形式跟着内嵌窗口
			}
		},
		/**
		 *关闭窗口
 		 */
        close: function () {
        	var context = this;
        	if($E.notifyObservers(context, "beforeClose", context) === false){
        		return false;
        	}
        	if($E.notifyObservers(context, "close", context) === false){
        		return false;
        	}
    		context.destroy();
        	$E.notifyObservers(context, "afterClose", context);
        },
        /**
		 *销毁窗口对象
 		 */
        destroy: function () {
        	var context = this;
        	$E.notifyObservers(context, "destroy", context);
			var appendTo = context.container.parentNode;
			context.container.innerHTML = "";
            appendTo.removeChild(context.container);
            for (var p in context) {
                if (context.hasOwnProperty(p)) {
                    delete context[p];
                }
            }
            this._isDestroy = true;
        },
		isDestroy : function(){
			return this._isDestroy;
		}
		//touch move handler on window
//		touchMoveHandler: function(info){
//			var app, appid = this.getAppId();
//			if(appid) app = alloy.app['app' + appid];
//			if(app && ('touchMoveHandler' in app)) app.touchMoveHandler(info);
//			
//			//if(('EQQ' in window) && (this.body.children[0] == EQQ.View.MainPanel.EQQ_MainPanel)){
//			//	EQQ.View.MainPanel.touchMoveHandler(info);
//			//}
//		}

    });
	
    BaseWindow.CONST = {
		WINDOW_FLAG_MIN:1,
		WINDOW_FLAG_NORMAL:2,
		WINDOW_FLAG_MAX:4,
		WINDOW_FLAG_CURRENT:8,
		WINDOW_FLAG_NOT_CURRENT:16,
		WINDOW_FLAG_FULLSCREEN:32
	};

    J.ui.BaseWindow = BaseWindow;

});

