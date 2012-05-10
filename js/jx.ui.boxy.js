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
	var Boxy = new J.Class({
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
		getPanel: function(){
			return this._panel;
		},
		show: function(){
			this._panel.show();	
		},
		hide: function(){
			this._panel.hide();
		},
        setZIndex: function(index){
            this._panel.setZIndex(index); 
        },
		setCenter: function(option){
			var w = $D.getClientWidth(),
				h = $D.getClientHeight();
        	var l = (w > option.width) ? (w - option.width) / 2 : 0;
            var t = (h > option.height) ? (h - option.height) / 2 : 0;
            this._panel.setXY(l,t);
		},
		isShow: function(){
			return this._panel.isShow();
		},
		close: function(){
			//this._panel.hide();
            this._maskLayer && this._maskLayer.remove();
			this._option.appendTo.removeChild(this._option.container);
		}
	});
	
	J.ui.Boxy = Boxy;
});