/**
 * 列表滚动模块,从eqq.util.js移出
 * azreal, 2010-10-26
 */
Jx().$package(function (J) {
    var $D = J.dom,
		$E = J.event;

	/**
	 * 滚动类
	 */
	J.ui = J.ui || {};
	J.ui.Marquee = new J.Class({
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
		
		stop : function() {
			if (this.timer) {
				clearTimeout(this.timer);
			}
		},
		
		stopAll : function(){
			this.stop();
			if(this.lineTimer){
				clearTimeout(this.lineTimer);
			}
		},
		
		reset : function(){
			this.target.style.top = '0px';
		},
		
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
		
		walkOnLastLine : function(){
			this._onTimeRun();
		}
		
	});



});
