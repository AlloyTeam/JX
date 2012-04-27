/* == boxy类 =============================================
 * 弹出框
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-3-28 ----- */
 
 
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
    J.ui = J.ui || {};
    /**
     * 【Boxy】
     * 
     * @class 
     * @memberOf ui
     * @name Boxy
     * @constructor
     * @param {Object} option 参数对象
     */
    var Boxy = new J.Class(
    /**
     * @lends ui.Boxy.prototype
     */ 
    {
        /**
         * @ignore
         */
        init: function (option) {
            var _this = this;
            option = option || {};
            this._id = (option.id || (new Date().getTime()));
            option.name = option.id;
            option.width = option.width || 300;
            option.height = option.height || 300;
            option.appendTo = option.appendTo || document.body;
            option.zIndex = option.zIndex || 1;
            var node = $D.node('div',{
                'class':'ui_boxy'
            });
            node.innerHTML = '\
                <div style="position:relative; z-index:1;"><div class="ui_boxyClose" id="ui_boxyClose_'+this._id+'"></div></div>\
                <div class="ui_boxyWrapper" id="ui_boxyWrapper_'+this._id+'"></div>\
                ';
            option.appendTo.appendChild(node);
            option.container = node;
            option.body = $D.id('ui_boxyWrapper_'+this._id);
            this._option = option;
            
            this._panel = new J.ui.Panel(option);
            this._panel.setWidth(option.width);
            this._panel.setHeight(option.height);
            this._maskLayer;
            if(option.modal){
                this._maskLayer = new J.ui.MaskLayer({ 
                        appendTo: option.appendTo,
                        zIndex: option.zIndex,
                        opacity: 0.5
                    });
                this._maskLayer.show();
            }
            this._panel.setZIndex(option.zIndex + 1);
            this.setCenter(option);
            new J.ui.Drag(node, node, {isLimited: true});
            
            var closeBtn = $D.id("ui_boxyClose_" + this._id);
            var wrapper = this._wrapper = $D.id("ui_boxyWrapper_" + this._id);
            $E.on(closeBtn, 'click', function(e){
                //_this.hide();
                _this.close();
                option.onClose && option.onClose.apply(_this);
                $E.notifyObservers(_this, 'close'); 
            });
            
        },
        /**
         * 获取弹出框所处的面板
         * @return {ui.Panel} 
         */
        getPanel: function(){
            return this._panel;
        },
        /**
         * 显示弹出框
         */
        show: function(){
            this._panel.show(); 
        },
        /**
         * 隐藏弹出框
         */
        hide: function(){
            this._panel.hide();
        },
        /**
         * 设置弹出框的层级
         * @param {Number} index 层级
         */
        setZIndex: function(index){
            this._panel.setZIndex(index); 
        },
        /**
         * 将弹出框居中
         */
        setCenter: function(option){
            var w = $D.getClientWidth(),
                h = $D.getClientHeight();
            var l = (w > option.width) ? (w - option.width) / 2 : 0;
            var t = (h > option.height) ? (h - option.height) / 2 : 0;
            this._panel.setXY(l,t);
        },
        /**
         * 指示弹出框是否显示
         */
        isShow: function(){
            return this._panel.isShow();
        },
        /**
         * 关闭弹出框
         */
        close: function(){
            //this._panel.hide();
            this._maskLayer && this._maskLayer.remove();
            this._option.appendTo.removeChild(this._option.container);
        }
    });
    
    J.ui.Boxy = Boxy;
});