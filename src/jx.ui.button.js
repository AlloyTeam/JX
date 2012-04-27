/* == J.ui.Button =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2010-10-13 ----- */
 
 
 Jx().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
    var _id = 0;
    J.ui = J.ui || {};
    /**
     * 【Button】
     * 
     * @class 
     * @memberOf ui
     * @name Button
     * @constructor
     * @param {Object} option 参数对象
     */
    J.ui.Button = new J.Class(
    /**
     * @lends ui.Button.prototype
     */
    {
        _class: 'ui_button',
        _available: true, // available for user?
        _shownInLogic: false, // should be shown in logic
        _getButtionId: function(){
            return _id++;   
        },
        /**
         * @ignore
         */
        init: function (option){
            option = option || {};
            var context = this;
            var bid = this._getButtionId();
            var buttonOption = {
                appendTo: $D.getDocumentElement(),
                className: '',
                text: '',
                title : ''
            };
            J.extend(buttonOption, option);
            
            this._node = $D.node('a', {
                 'id': 'ui_button_' + bid,
                 'class': this._class + ' ' + $S.encodeScript(buttonOption.className),
                 'title': $S.encodeScript(buttonOption.title),
                 'hidefocus': '',
                 'href': '###'
            });
            this._node.innerHTML = $S.encodeHtml(buttonOption.text);
            buttonOption.appendTo.appendChild(this._node);
            if(buttonOption.event){
                this.attachEvent(buttonOption.event);
            }
            if(buttonOption.isStopPropagation){
                $E.on(this._node,"mousedown",function(e){
                    e.stopPropagation();
                })
                $E.on(this._node,"click",function(e){
                    e.stopPropagation();
                })
                
            }
        },
        /**
         * 自定义事件绑定
         * @param eventObj {Object} 事件对象
         */
        attachEvent : function(eventObj){
            for(var i in eventObj){
                $E.on(this._node, i, eventObj[i]);
            }
        },
        /**
         * 移除自定义事件
         * @param eventObj {Object} 事件对象
         */
        removeEvent : function(eventObj){
            for(var i in eventObj){
                $E.off(this._node, i, eventObj[i]);
            }
        },
        /**
         * 设置按钮是否可用
         * @param {Boolean} val
         */
        setAvailability: function(val){
            // change the availability
            this._available = !!val;

            // show/hide the button by logic
            this._shownInLogic && $D[this._available ? 'show' : 'hide'](this._node);
        },
        /**
         * 隐藏按钮
         */
        hide: function(){
            // shown in logic?
            this._shownInLogic = false;

            // do nothing if it's unavailable
            if (!this._available) {
                return;
            }

            $D.hide(this._node);
            $E.notifyObservers(this, "hide");
        },
        /**
         * 显示按钮
         */
        show: function(){
            // shown in logic?
            this._shownInLogic = true;

            // do nothing if it's unavailable
            if (!this._available) {
                return;
            }

            $D.show(this._node);
            $E.notifyObservers(this, "show");
        },
        /**
         * 设置按钮文本
         * @param {String} text
         */
        setText: function(text){
            this._node.innerHTML = $S.encodeHtml(text);
        },
        /**
         * 设置按钮的title(鼠标移上去的tips)
         * @param {String} title
         */
        setTitle : function(title){
            this._node.title = $S.encodeScript(title);
        },
        /**
         * 获取button dom对象
         * @return {HTMLElement}
         */
        getNode: function(){
            return this._node;
        },
        /**
         * 设置按钮是否禁用
         * @param {Boolean} isDisable
         */
        disable: function(isDisable){
            isDisable = isDisable || false;
            if(isDisable){
                $D.addClass(this._node, 'window_button_disabled');
            }else{
                $D.removeClass(this._node, 'window_button_disabled');
            }
        }
    });
});