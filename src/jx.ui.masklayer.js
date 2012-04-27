/**
 * MaskLayer模块
**/
Jx().$package(function(J){
    var $ = J.dom.id,
        $D = J.dom,
        $E = J.event;
        
    J.ui = J.ui || {};
    
    var _id = 0;
    /**
     * MaskLayer 遮罩层类
     * 
     * @memberOf ui
     * @class
     * @name MaskLayer
     * @constructor
     * @param {Object} option 其他选项，如:zIndex,appendTo...
     * 
     **/
    J.ui.MaskLayer = new J.Class(
    /**
     * @lends ui.MaskLayer.prototype
     */
    {
        _getMaskId: function(){
            return _id++;   
        },
        /**
         * @ignore
         */
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
                /**
                 * @ignore
                 */
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
        /**
         * 添加一个dom到遮罩中
         */
        append : function(el){
            this.body.appendChild(el);
        },
        /**
         * 显示
         */
        show : function(){
            $D.show(this.container);
            $E.notifyObservers(this, "show");
            this._isShow = true;
        },
        /**
         * 隐藏
         */
        hide : function(){
            $D.hide(this.container);
            $E.notifyObservers(this, "hide");
            this._isShow = false;
        },
        /**
         * 指示遮罩是否显示中
         */
        isShow : function(){
            return this._isShow;
        },
        /**
         * 切换遮罩的显示隐藏
         */
        toggleShow : function(){
            if(this.isShow()){
                this.hide();
            }else{
                this.show();
            }
        },
        /**
         * 获取遮罩的层级
         */
        getZIndex : function(){
            return this._zIndex;
        },
        /**
         * 设置遮罩的层级
         */
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
        /**
         * 淡入显示遮罩
         */
        fadeIn : function(){
            this.show();
        },
        /**
         * 淡出显示遮罩
         */
        fadeOut : function(){
            this.hide();
        },
        /**
         * 移除遮罩
         */
        remove : function(){
            if(this.option.appendTo)    {
                this.option.appendTo.removeChild(this.container);
            }
        }
    });

});