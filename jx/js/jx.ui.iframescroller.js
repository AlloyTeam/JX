Jx().$package(function(J){
	var $D = J.dom,
		$E = J.event;
		
	var iframeScroller = function(iframe){
		this.container=iframe.parentNode;
		if(J.platform.iPad && J.platform.iPad.split(".")[0]>=4) {
	        this.container=iframe.parentNode.parentNode;
		}
		//console.info("container width:"+$D.getWidth(this.container));
		this.iframe=iframe;
		this.holding=false;
		this.posx=0;
		this.posy=0;
		this.offsetX=0;
		this.offsetY=0;
		var context = this;
		this.observers={
			onTouchStart:function(e){
				var touch = e.changedTouches[0];
				context.posx = touch.pageX;
				context.posy = touch.pageY;
				//console.info("iframe height: "+ $D.getHeight(context.iframe));
				context.minX = $D.getWidth(context.container) - $D.getWidth(context.iframe);
				context.minY = $D.getHeight(context.container) - $D.getHeight(context.iframe);
				
				//console.info("minx:"+context.minX+",miny:"+context.minY);
				
				$E.on(context.iframe,"touchmove",context.observers.onTouchMove);
				$E.on(context.iframe,"touchend",context.observers.onTouchEnd);
			},
			onTouchMove:function(e){
				if(e.changedTouches.length>1)return;
				e.preventDefault();
				e.stopPropagation();
				var touch = e.changedTouches[0];
				var posx = touch.pageX;
				var posy = touch.pageY;
				var dx = context.posx - posx;
				var dy = context.posy - posy;				
				
				var newpx = context.offsetX - dx;
				var newpy = context.offsetY - dy;
				
				//console.info("iframe touch move:"+newpx+","+newpy);
				
				if(newpx > 0) newpx = 0;
				else if(newpx < context.minX) newpx = context.minX;
				if(newpy > 0) newpy = 0;
				else if(newpy < context.minY) newpy = context.minY;
				
				//console.info("apple sucks: "+newpy);
				//console.info("iframe touch move:"+newpx+","+newpy);
				
				iframe.style['left'] = newpx + 'px';
				iframe.style['top'] = newpy + 'px';
				
			
				context.offsetX = newpx;
				context.offsetY = newpy;
				context.posx = posx;
				context.posy = posy;
			},
			onTouchEnd:function(){
				$E.off(context.iframe,"touchmove",context.observers.onTouchMove);
				$E.off(context.iframe,"touchend",context.observers.onTouchEnd);
			}
		};
		this.destroy=function(){
			$E.off(this.iframe,"touchstart",this.observers.onTouchStart);	
			$E.off(this.iframe,"touchmove",this.observers.onTouchMove);
			$E.off(this.iframe,"touchend",this.observers.onTouchEnd);
			this.iframe=null;
			this.container=null;
		}
		$E.on(this.iframe,"touchstart",this.observers.onTouchStart);			
	}
	J.ui = J.ui || {};
	J.ui.IframeScroller = iframeScroller;
});
