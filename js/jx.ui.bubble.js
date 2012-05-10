/**  J.ui.Bubble
 * @deprecated QQ Web bubble 模块
 *  Copyright (c) 2009, Tencent.com All rights reserved.
 *  -------- 2009.11.17 -----
 *  
 *  -------------------------
 *  melody
 *  -------------------------
 * @version 1.0
 * @author Tencent
 *  
 **/


Jet().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
		
    J.ui = J.ui || {};
    /**
     * 气泡类
     * @class
     * @constructor
     * @param {Object} option 构造参数
     * {
     *   bubbleParent, {HTMLElement} 气泡的dom的父节点
     * }
     * @description 
     * 注意, bubble的自动关闭都是hide调用, 是不会把自己删除的, 要删除bubble, 调用close方法
     * 
     */
    var Bubble = J.ui.Bubble = J.Class(
    /**
     * @lends Bubble.prototype
     */
    {
        /**
         * 初始化气泡
         * @private
         * @ignore
         */
        init: function(option){
            option = option || {};
            var defaultOption = {
                bubbleParent: document.body,
                className: '',
                hasCloseButton: true,
                closeOnHide: false,
                zIndex: 1000000
            };
            option = this.option = J.extend(defaultOption, option);
            var id = this._getId();
            
            var html = '<div id="bubble_tip_pointer_' + id + '" class="bubble_tip_pointer bubble_tip_pointer_left"></div>\
	            <div class="bubble_tip_head"></div>\
	            <div class="bubble_tip_body">\
	                <div class="bubble_tip_title"><a id="bubble_tip_close_' + id + '" href="###" class="bubble_tip_close" title="关闭">x</a>\
                        <span id="bubble_tip_title_' + id + '"></span></div>\
	                <div id="bubble_tip_content_' + id + '" class="bubble_tip_content"></div>\
	            </div>\
	            <div id="bubble_tip_foot_' + id + '" class="bubble_tip_foot">\
	                <a id="bubble_tip_btn_next_' + id + '" href="###" class="bubble_tip_btn"></a>\
                    <a id="bubble_tip_btn_ok_' + id + '" href="###" class="bubble_tip_btn"></a>\
	            </div>\
                <iframe width="100%" height="100%" class="bubble_tip_bg_iframe" src="about:blank"></iframe>';
	        var divNode = $D.node("div",{
	            'class': 'bubble_tip_container ' + option.className
	        });
	        divNode.innerHTML = html;
            $D.setCssText(divNode, 'left: -10000px; top: 0px; z-index: ' + option.zIndex + ';');
	        option.bubbleParent.appendChild(divNode);
            
            
            this._container = divNode;
            this._title = $D.id('bubble_tip_title_' + id);
            this._content = $D.id('bubble_tip_content_' + id);
            this._pointer = $D.id('bubble_tip_pointer_' + id);
            this._okBtn = $D.id('bubble_tip_btn_ok_' + id);
            this._nextBtn = $D.id('bubble_tip_btn_next_' + id);
            this._closeBtn = $D.id('bubble_tip_close_' + id);
            if(!option.hasCloseButton){
                $D.hide(this._closeBtn);
            }
            var context = this;
            
            var observer = {
                onCloseBtnClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleClose', context);
                    context.hide();
                },
                onOkButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleOkBtnClick', context);
                    context.hide();
                },
                onNextButtonClick: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $E.notifyObservers(context, 'onBubbleNextBtnClick', context);
                }
            };
            
            $E.on(this._closeBtn, 'click', observer.onCloseBtnClick);
            $E.on(this._okBtn, 'click', observer.onOkButtonClick);
            $E.on(this._nextBtn, 'click', observer.onNextButtonClick);
            
        },
        /**
         * 获取容器的Dom元素
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._container;
        },
        /**
         * 显示气泡
         * @param {Object} option
         * @example
         * option 的默认参数为:
         * {
         *       pointerPosition: 'top right',//箭头的位置
         *       pointerOffset: 20,//箭头在气泡边上的偏移值
         *       pointerSize: [18, 12],//箭头的高度/宽度
         *       position: [0,0],//气泡的位置,直接设置position的时候,不要设置target,否则不起作用
         *       target: null,//{HTMLElement} 气泡所指的dom节点, ps: 如果该属性存在, 则忽略position的设置
         *       targetOffset: [x, y]//气泡位置的便宜, x/y可正负 
         *  };
         *  
         * pointerPosition的值可为
         *  "top left"
         *  "top right"
         *  "bottom left"
         *  "bottom right"
         *  "left top"
         *  "left bottom"
         *  "right top"
         *  "right bottom"
         *  
         *  @description
         *  TODO 后续可添加通过设置targetPosition来直接指定箭头以及气泡的位置
         */
        show: function(option){
            option = option || {};
            var defaultOption = {
                pointerPosition: 'top right',
                pointerOffset: 20,
                pointerSize: [18, 12],
                position: [0, 0],
                target: null,
                targetOffset: [0, 0]
            };
            option = J.extend(defaultOption, option);
            //检查箭头的位置参数是否合法
            if(!this._checkPointerPosition(option.pointerPosition)){
                throw new Error('Bubble >>>> the pointerPosition\'s value is not correct');
            }
            //设置箭头在bubble内的位置
            this._setPointerPosition(option.pointerPosition, option.pointerOffset);
            //设置气泡的位置
            this._setBubblePosition(option);
            
            $D.show(this._container);
        },
        /**
         * 设置气泡的z-index
         * @param {Int} zIndex
         */
        setZIndex: function(zIndex){
            $D.setStyle(this._container, 'zIndex', zIndex);  
        },
        /**
         * 设置气泡外框的样式
         * @param {String} property 属性
         * @param {String} value 值
         */
        setContainerStyle: function(property, value){
            $D.setStyle(this._container, property, value);
        },
        /**
         * 设置标题文字
         * @param {String} text 标题文字
         */
        setTitle: function(text){
            this._title.innerHTML = text;
        },
        /**
         * 设置主题内容
         * @param {String} html 主题内容, 可包含html标签
         */
        setContent: function(html){
            this._content.innerHTML = html;  
        },
        /**
         * 显示一个的按钮
         * @param {String} type 按钮的类型
         * @param {String} text 按钮的文字
         */
        showButton: function(type, text, highlight){
            var btn = this['_' + type + 'Btn'];
            highlight = J.isUndefined(highlight) ? false : true;
            if(btn){
                btn.innerHTML = text;
                $D.show(btn);
                if(highlight){
                	$D.addClass(btn, 'bubble_tip_btn_next');
                }else{
                	$D.addClass(btn, 'bubble_tip_btn_ok');
                }
            }
            return btn;
        },
        /**
         * 隐藏按钮
         * @param {String} type 按钮类型
         */
        hideButton: function(type){
            var btn = this['_' + type + 'Btn'];
            if(btn){
                $D.hide(btn);
            }
        },
        /**
         * 隐藏气泡
         */
        hide: function(){
            $D.hide(this._container); 
            if(this.option.closeOnHide){
                this.close();
            }
        },
        /**
         * 关闭并注销气泡
         */
        close: function(){
            if(!this._isClosed){
                this._isClosed = true;
                $E.off(this._closeBtn, 'click');
                $E.off(this._okBtn, 'click');
                $E.off(this._nextBtn, 'click');
                if(this._container.parentNode){
                    this._container.parentNode.removeChild(this._container);
                }
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
            }else{
                J.warn('Trying to close a closed bubbleTip!', 'BubbleTip');
            }
        },
        /**
         * 指示是否已关闭气泡
         */
        isClose: function(){
            return this._isClosed;
        },
        /**
         * 返回一个内部使用的id
         * @private
         * @return {Int} 
         */
        _getId: function(){
            if(!Bubble.__id){
                Bubble.__id = 0;
            }
            return Bubble.__id++;
        },
        /**
         * 设置箭头的指示方向和位置
         * @private
         * @param {String} position 箭头的位置, 由两个单词(top/bottom/left/right中的一个)组成
         * @param {Int} offset 箭头的偏移位置
         * @example
         *  position的值可为
         *  "top left"
         *  "top right"
         *  "bottom left"
         *  "bottom right"
         *  "left top"
         *  "left bottom"
         *  "right top"
         *  "right bottom"
         */
        _setPointerPosition: function(position, offset){
            var posArr = position.split(' ');
            var pointer = this._pointer;
            $D.setClass(pointer, 'bubble_tip_pointer bubble_tip_pointer_' + posArr[0]);
            $D.setCssText(pointer, '');
            $D.setStyle(pointer, posArr[1], offset + 'px');
        },
        /**
         * 设置气泡的位置
         * @private
         * @param {Object} option show 的参数
         */
        _setBubblePosition: function(option){
            var position = option.position;//直接设置position后就不要设置target
            
            if(option.target){
                var posArr = option.pointerPosition.split(' ');
                var posObj = this._calculateBubblePosition(option.target, option.pointerSize, option.pointerOffset);
                var sub = 0;
                if(/top|bottom/.test(posArr[0])){
                    sub = 1;
                }
                position[0] = posObj[posArr[sub] + sub];
                sub = (sub + 1) % 2;
                position[1] = posObj[posArr[sub] + sub];
            }
            var x = position[0] + option.targetOffset[0];
            var y = position[1] + option.targetOffset[1];
            $D.setStyle(this._container, 'left', x + 'px');
            $D.setStyle(this._container, 'top', y + 'px');
        },
        /**
         * 计算气泡的位置
         * @param {HTMLElement} target 箭头所指的dom
         * @param {Array} pointerSize 箭头的大小,[width, height]
         * @param {Int} pointerOffset 箭头的偏移
         * @private
         * @return {Object} 计算得到的结果
         * @example 
         * 返回的结果格式为
         * {
         *       top0: tt + th + ph,
         *       bottom0: tt - bh - ph,
         *       left0: tl + tw + ph,
         *       right0: tl - bw - ph,
         *       
         *       top1: tt + th / 2 - pw,
         *       bottom1: tt + th / 2 - bw + pw,
         *       left1: tl + tw / 2- pw,
         *       right1: tl + tw / 2 - bw + pw
         *   }
         */
        _calculateBubblePosition: function(target, pointerSize, pointerOffset){
            var container = this._container,
                targetPos = $D.getClientXY(target);
            var bw = $D.getOffsetWidth(container), bh = $D.getOffsetHeight(container),
                tw = $D.getWidth(target), th = $D.getHeight(target),
                tl = targetPos[0], tt = targetPos[1],
                pw = pointerOffset + (pointerSize[0] / 2), ph = pointerSize[1];
            return {
                top0: tt + th + ph,
                bottom0: tt - bh - ph,
                left0: tl + tw + ph,
                right0: tl - bw - ph,
                
                top1: tt + th / 2 - pw,
                bottom1: tt + th / 2 - bh + pw,
                left1: tl + tw / 2- pw,
                right1: tl + tw / 2 - bw + pw
            };
        },
        /**
         * 检查箭头的位置参参数是否合法
         * @private
         * @param {String} position 位置参数
         */
        _checkPointerPosition: function(position){
            var posArr = position.split(' ');
            var lrRegex = /left|right/,
                tbRegex = /top|bottom/;
            if(tbRegex.test(posArr[0]) && lrRegex.test(posArr[1])){
                return true;
            }else if(lrRegex.test(posArr[0]) && tbRegex.test(posArr[1])){
                return true;
            }
            return false;
        }
        
    });

});
