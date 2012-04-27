
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;


    J.ui = J.ui || {};
    /**
     * 列表滚动类
     * @class 
     * @memberOf ui
     * @name Marquee
     * @constructor
     * @param {Object} option
     * option.speed || 40;//滚动速度
       option.stopTime || 3000;//滚动时长
       option.lineHeight || 20;//列表每行的高度
       target;//需要滚动的列表
     * @since version 1.0
     */
    J.ui.Marquee = new J.Class(
    /**
     * @lends ui.Marquee.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(option){
            var marqueeContext = this;
            this.speed = option.speed || 40;
            this.stopTime = option.stopTime || 3000;
            this.lineHeight = option.lineHeight || 20;
            this.target = option.target;
            this.timer = null;
            this.lineTimer = null;
            this.intervaler = null;
            this.scrollHeight = this.lineHeight;
            this.isStop = false;
            
            this._onTimeRun = function(){
                marqueeContext.scrollOneLine();
            };
    
        },
        /**
         * 滚动一行
         */
        scrollOneLine : function(){
            if (this.scrollHeight > 0) {
                this.scrollHeight--;
                var currentTop = this.target.style.top.match(/-?\d+/);
                currentTop = (!currentTop) ? 0 : parseInt(currentTop[0]);
                this.target.style.top = (--currentTop) + 'px';
                

                this.lineTimer = setTimeout(this._onTimeRun, this.speed);
            }else{
                if(!this.isStop){
                    this.update();
                }
            }

        },
        /**
         * 停止当前行滚动
         */
        stop : function() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        },
        /**
         * 完全停止滚动
         */
        stopAll : function(){
            this.stop();
            if(this.lineTimer){
                clearTimeout(this.lineTimer);
            }
        },
        /**
         * 重设列表的位置
         */
        reset : function(){
            this.target.style.top = '0px';
        },
        /**
         * 执行一次滚动
         */
        update : function(){
            if(this.isStop){
                return;
            }
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.scrollHeight = this.lineHeight;
            var currentTop = this.target.style.top.match(/\d+/);
            var height = $D.getScrollHeight(this.target);
            if(!!currentTop && !!height){
                currentTop = parseInt(currentTop[0]);
                if(currentTop >= height){
                    this.target.style.top = this.lineHeight + 'px';
                    this.scrollOneLine();
                    return;
                }
            }

            this.timer = setTimeout(this._onTimeRun, this.stopTime);
        },
        /**
         * 继续执行上一次未完成的滚动
         */
        walkOnLastLine : function(){
            this._onTimeRun();
        }
        
    });



});
