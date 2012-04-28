/** 
 * JX (Javascript eXtension tools) 
 * Copyright (c) 2011, Tencent.com, All rights reserved.
 *
 * @fileOverview Jet!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */
 Jx().$package(function (J) {
     var $D = J.dom,
         $E = J.event;
    var doc;
    
    J.ui = J.ui || {};
    
    
     /**
   * 【TouchScroller】
   * 
   * @class 
   * @memberOf ui
   * @name TouchScroller
   * @constructor
   * 
   * @param {Element} dom 需要滚动的内容容器
   * @param {Element} touchdom 用于接收触摸时间的容器，可以省略
   * @since version 1.0
   * @description Jx.ui.TouchScroller 是提供IOS下的html元素触摸滚动功能的一个组件
   */
    var TouchScroller= J.ui.TouchScroller = new J.Class(
    /**
     * @lends ui.TouchScroller.prototype
     */
    {
        //是否要增加动画
        //@TODO options处添加滚动方向设置
        container:null,
        _dx:0,
        _dy:0,
        _posy:0,
        _posx:0,
        _maxOffsetX:0,
        _maxOffsetY:0,
       /**
        * @ignore
        */
        init: function(dom,touchdom,option){
          this.container = J.isString(dom) ? $D.id(dom) : dom;
          this.touchContainer = touchdom||this.container;
          var context = this;
          this.observer = {
            /**
             * @ignore
             */
            onTouchStart : function(e){
              //e.stopPropagation();
              //e.preventDefault();
              if(e.changedTouches.length>1){
                return;
              }
              var touch = e.changedTouches[0];
              context._dx = context.container.scrollLeft;
              context._dy = context.container.scrollTop;
              context._posx = touch.pageX;
              context._posy = touch.pageY;
              context.maxOffsetX = context.container.scrollWidth - context.container.clientWidth;
              context.maxOffsetY = context.container.scrollHeight - context.container.clientHeight;
              $E.on(context.touchContainer,'touchmove',context.observer.onTouchMove);
              $E.on(context.touchContainer,'touchend',context.observer.onTouchEnd);
            },
            /**
             * @ignore
             */
            onTouchMove : function(e){
              //@TODO
              //e.stopPropagation();
              //e.preventDefault();
              var touch=e.changedTouches[0];
              var px=touch.pageX;
              var py=touch.pageY;
              var needMove=false;
              context._dx += context._posx - px;
              context._dy += context._posy - py;
              context._posx=px;
              context._posy=py;
              if(context._dx<0){
                context._dx=0;
              }
              if(context._dy<0){
                context._dy=0;
              }
              if(context._dx>context.maxOffsetX){
                context._dx = context.maxOffsetX;
              }
              if(context._dy>context.maxOffsetY){
                context._dy = context.maxOffsetY;
              }
              context.container.scrollLeft = context._dx;
              context.container.scrollTop = context._dy;
            },
            /**
             * @ignore
             */
            onTouchEnd : function(e){
              $E.off(context.touchContainer,'touchmove',context.observer.onTouchMove);
              $E.off(context.touchContainer,'touchend',context.observer.onTouchEnd);
            }
          };
          $E.on(this.touchContainer,'touchstart',this.observer.onTouchStart);
        },
        /**
         * @private
         */
        destroy : function(){
          $E.off(this.touchContainer,'touchstart',this.observer.onTouchStart);
          this.container=null;
        },
        /**
         * 阻止触摸滚动功能
         */
        disable : function(){
          $E.off(this.touchContainer,'touchstart',this.observer.onTouchStart);
        },
        /**
         * 开启触摸滚动功能
         */
        enable : function(){
          $E.on(this.touchContainer,'touchstart',this.observer.onTouchStart);
        }
    });
});