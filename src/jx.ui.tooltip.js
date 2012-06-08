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
    var $ = J.dom.id,
        $D = J.dom,
        $S = J.string,
        $A = J.array,
        $E = J.event,
        $T = J.fx.transitions;
        
    // Tooltip类
    /**
     * 【Tooltip】
     * 
     * @class 
     * @memberOf ui
     * @constructor
     * @name Tooltip
     * @param {Element} els 需要生成tooltip的DOM节点
     * @param {Object} option 参数对象 option:{text:'tooltip内容，默认去title属性'}
     * @since version 1.0
     * @description Jx.ui.Tooltip是一个长方形的小提示，在用户将指针悬停在一个控件上时显示有关该控件用途的简短说明。
     */
    var Tooltip = new J.Class(
    /**
     * @lends ui.Tooltip.prototype
     */ 
    {
        /**
        * @ignore
        */
        init: function (els, option) {
            var tooltipContext = this;
            option = option || {};
            
            tooltipContext.id = Tooltip.count;
            Tooltip.count++;
            
            $A.forEach(els, function(el,i,els){
                var text = option.text || el.getAttribute("title");
                
                // 检测文字所需要的宽度
                var width;
                var tempEl = $D.node("div",{
                    style:"float:left;width:auto;background:blue;visibility:hidden;"
                });
                document.body.appendChild(tempEl);
                tempEl.innerHTML = text;
                width = $D.getClientWidth(tempEl, "width");
                width += (width % 2);
                document.body.removeChild(tempEl);
                tempEl = null;
                
                
                
                el.removeAttribute("title");

                if(!J.isUndefined(text)) {
                    /**
                     * @ignore
                     */
                    tooltipContext.mouseMove = function(e){
                        var tooltipEL = tooltipContext.tooltipEL;
                        var tipX = e.pageX + 24;
                        var tipY = e.pageY - 18;
                        var tipWidth = $D.getWidth(tooltipEL);
                        var tipHeight = $D.getHeight(tooltipEL);
//                      if(tipX + tipWidth > $D.getScrollLeft(document.body) + $D.getWidth(document.body)){
//                          tipX = e.pageX - tipWidth;
//                      }
//                      if($D.getHeight(document.body)+$D.getScrollTop(document.body) < tipY + tipHeight){
//                          tipY = e.pageY - tipHeight;
//                      }
                        $D.setXY(tooltipEL, tipX, tipY);
                    };
                    
                    $E.on(el, "mouseover", function(e){
                        var tipX = e.pageX + 24;
                        var tipY = e.pageY - 18;
                        if(!tooltipContext.tooltipEL){
                            tooltipContext.createTooltip();
                        }
                        var tooltipTextEL = tooltipContext.tooltipTextEL;
                        tooltipTextEL.innerHTML = text;
                        
                        tooltipContext.showIn({width:width});
                        
                    });
                    
                    $E.on(el, "mouseout", function(e){
                        if(tooltipContext.tooltipEL){
                            tooltipContext.showOut({width:width});
                        }
                    });
                }
            });
            
        },
        
        /**
        * @private
        */
        createTooltip: function(){
            var tooltipContext = this;
            var tooltipEL;
            var tooltipTextEL;
            var tempLeftEL;
            var tempRightEL;
            
            
            var tooltipTextELBg = 'background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip_c.png?t=20111011001);',
                tooltipLeftELBg =  'background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip.png?t=20111011001) no-repeat;',
                tooltipRightELBg = ' background:url(http://qplus1.idqqimg.com/jx/style/image/tooltip.png?t=20111011001) no-repeat right';
            
            if(J.browser.ie && J.browser.ie == 6){
                tooltipTextELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_c.png?t=20111011001", sizingMethod="scale");';
                tooltipLeftELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_l.png?t=20111011001", sizingMethod="scale");';
                tooltipRightELBg = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://qplus1.idqqimg.com/jx/style/image/tooltip_r.png?t=20111011001", sizingMethod="scale");';
            }
            
            tooltipContext.tooltipEL = tooltipEL = $D.node("div",{
                id:"jxTooltip_"+tooltipContext.id,
                style:'position: absolute; margin:10px; width:107px; height:38px; z-index: 10000; display: none;'
            });
            
            tooltipContext.tooltipTextEL = tooltipTextEL = $D.node("div",{
                id:"jxTooltipText_"+tooltipContext.id,
                style:'line-height:30px; width:100%; height:38px; color:white; overflow:hidden;' + tooltipTextELBg
            });

            tempLeftEL = $D.node("div",{
                style:'position:absolute; left:-12px; width:12px; height:38px; overflow:hidden;' + tooltipLeftELBg 
            });
            tempRightEL = $D.node("div",{
                style:'position:absolute; right:-12px; width:12px; height:38px; overflow:hidden;' + tooltipRightELBg
            });
            
            tooltipEL.appendChild(tempLeftEL);
            tooltipEL.appendChild(tempRightEL);
            tooltipEL.appendChild(tooltipTextEL);

            document.body.appendChild(tooltipEL);
            //$D.setStyle(tooltipEL, "opacity", 0);
            tooltipContext.showInAnimation = new J.fx.Animation({
                element:tooltipEL,
                property:"width",
                from:0,
                to:1,
                unit:"px",
                duration:300,
                transition:$T.sinusoidal.easeOut
            });
            
            tooltipContext.showOutAnimation = new J.fx.Animation({
                element:tooltipEL,
                property:"width",
                from:1,
                to:0,
                unit:"px",
                duration:300,
                transition:$T.sinusoidal.easeOut
            });
            
            $E.addObserver(tooltipContext.showOutAnimation,"end", function(){
                $D.hide(tooltipEL);
            });
            
        },
        
        /**
        * 显示tooltip
        * @param {Object} option 参数对象 option:{width:'tooltip宽度'}
        * @return 
        */
        showIn:function(option){
            var tooltipContext = this;
            var tooltipEL = tooltipContext.tooltipEL;
            
            tooltipContext.showOutAnimation.end();
            $E.on(document, "mousemove", tooltipContext.mouseMove);
            $D.show(tooltipEL);
            tooltipContext.showInAnimation.start(0,option.width);
        },
        
        /**
        * 隐藏tooltip
        * @param {Object} option 参数对象 option:{width:'tooltip宽度'}
        * @return 
        */
        showOut:function(option){
            var tooltipContext = this;
            var tooltipEL = tooltipContext.tooltipEL;
            
            tooltipContext.showInAnimation.end();
            //alert(option.width)

            tooltipContext.showOutAnimation.start(option.width,0);
            $E.addObserver(tooltipContext.showOutAnimation, 'end', function(e){
                $E.off(document, "mousemove", tooltipContext.mouseMove);
            });
            //$D.hide(tooltipEL);
        },
        
        /**
        * 关于tooltip
        * @private
        */
        about:function(){
            alert("Jx().ui.Tooltip() by Jetyu of Tencent!");
        }
       

    });


    
//  Tooltip.options = {
//      src: "http://image.apple.com/global/elements/zoomerlay/zoomerlay_tooltip.png?t=20111011001",
//      pos: "top",
//      dist: 5,
//      deadspace: 0
//  };
    
    Tooltip.count = 0;
    
    J.ui = J.ui || {};
    J.ui.Tooltip = Tooltip;
});