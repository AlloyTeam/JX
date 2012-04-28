/* == UI类 PopupBox ========================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * -------------------------------------------- 2010.10.14 ----- */
 
 
Jx().$package(function(J){
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        currentPopupBox = null;
        
    
    J.ui = J.ui || {};
    // PopupBox类
    /**
     * 【Panel】弹出框定义
     * @extends ui.Panel
     * @class 
     * @memberOf ui
     * @name PopupBox
     * @constructor
     * @param option ,{
     *  id,name,container,body,html,
     *  noCatchMouseUp:不捕捉鼠标点击事件,default:false,
     *  noCloseOnEsc:按esc不隐藏,default:false
     * }
     * @since version 1.0
     * 
     */
    var PopupBox = new J.Class({ extend: J.ui.Panel },
    /**
     * @lends ui.PopupBox.prototype
     */
    {
        /***
         * @ignore
         */
        init:function(option){
            this.parentPopupBox = option.parentPopupBox;
            //调用父类的初始化代码
            PopupBox.callSuper(this, 'init',option);
            
            var context = this;
            this.catchMouseUp = true;
            if(option.noCatchMouseUp){
                this.catchMouseUp = false;
            }
            this.closeOnEsc = true;
            if(option.noCloseOnEsc){
                this.closeOnEsc = false;
            }
            this.onDocumentKeydown = function(e){
                if(e.keyCode === 27){
                    // 阻止默认事件,因为像ff下，esc可能会有stop页面的功能
                    e.preventDefault();
                    context.hide();
                }
            };
            this.onMouseUp = function(){
                if(context.isShow()){
                    context.hide();
                }
            };
            this.onDocumentClick = function(){
                context.hide();
            };
            this.onWindowResize = function(){
                context.hide();
            };
            
        },
        /**
         * 显示弹出框
         */
        show : function(){
                
            if(currentPopupBox){
                if(this.parentPopupBox == currentPopupBox){
                    
                }else{
                    currentPopupBox.hide();
                }
            }
            if(this.catchMouseUp){
                $E.on(document.body, "mouseup", this.onMouseUp);
            }else{//没有off的必要,因为mouseup事件只在catchMouseUp为true时才注册
//              $E.off(document, "mouseup", this.onMouseUp);
            }
            
            if(this.closeOnEsc){
                $E.on(document, "keydown", this.onDocumentKeydown);
            }else{
//              $E.off(document, "keydown", this.onDocumentKeydown);
            }
            $E.on(document.body, "click", this.onDocumentClick);
            $E.on(window, "resize", this.onWindowResize);
            if(!this.parentPopupBox){//如果不是子popupbox, 才赋值
                currentPopupBox = this;
            }
            PopupBox.callSuper(this, 'show');

        },
        /**
         * 隐藏弹出框
         */
        hide : function(){
            $E.off(document.body, "click", this.onDocumentClick);
            $E.off(document, "keydown", this.onDocumentKeydown);
            $E.off(window, "resize", this.onWindowResize);
            $E.off(document.body, "mouseup", this.onMouseUp);
            if(currentPopupBox){
                if(this.parentPopupBox){
                    //有parent,说明是子popupbox, 不做处理
                }else{
                    if(currentPopupBox !== this ){
                        currentPopupBox.hide();
                    }
                    currentPopupBox = null;
                }
            }
            PopupBox.callSuper(this, 'hide');
        },
        /**
         * 销毁
         */
        destroy: function(){
            this.container.parentNode.removeChild(this.container);  
        }
    });
    J.ui.PopupBox = PopupBox;
    
});

