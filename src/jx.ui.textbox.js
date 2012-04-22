/* == J.ui.TextBox =============================================
 * Copyright (c) 2011, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-1-22 ----- */
 
 
Jet().$package(function (J) {
    var $D = J.dom,
    	$S = J.string,
		$E = J.event;
	
	J.ui = J.ui || {};
	
	/**
     * 【TextBox】
     * 
     * @class J.ui.TextBox
     * @name ShareBox
     * @extends Object
     * @param {Object} option 构造参数
     * {
     * id: '',//random
     * name: id,
     * container: document.body,
     * className: '' ,
     * title: '',
     * text: '',
     * height: 200,
     * width: 200,
     * limit: 200,
     * readOnly: false,
     * hintLink: [{
     * 	text:'',
     *  click:''
     *	}]
     * }
     * 
     * var sharebox = new J.ui.TextBox({
	 *		title: '分享',
	 *		text: '内容',
	 *		hint: [{
	 *			text: '更多',
	 *			click: ''					
	 *		}]
	 *	});
	 *	sharebox.show(200, 200);
     * @since version 1.0
     * @description
     */
	var TextBox = J.ui.TextBox= new J.Class({
		init: function(option){
			var id = 'share_box_' + (option.id || (new Date().getTime()));
            var name = option.name || id;
            var parent = option.container || document.body;
            var className = option.className || '';
            var content = option.text || '';
            this._titleHeight = 22;
            this._footerHeight = 26;
            this._padding = 4 * 2;
            this._margin = 4 * 2;
            option.width = option.width || 200;
            option.height = option.height || 100;
            option.limit = option.limit || 0;
            option.isPopup = option.isPopup || false;
            option.readOnly = option.readOnly || false;
            option.maskIframe = option.maskIframe || false;
            option.hasCloseButton = option.hasCloseButton === false ? false : true;
            this._isShow = false;
            
            var container = this._el = $D.node('div', {
                id: id,
                'class': 'share_box ' + className
            });
            	
            var html = '\
            	<div class="share_box_title" id="'+ id +'_title">\
            		<div class="share_box_titleTxt" id="'+ id +'_titleTxt"></div>\
            	</div>\
            	<div class="share_box_body" id="'+ id +'_body">\
            		<!--textarea class="share_box_text" id="'+ id +'_text"></textarea-->\
            	</div>\
           		<div class="share_box_footer" id="'+ id +'_footer">\
           			<div class="share_box_showthumb" id="'+id+'_showthumb"></div>\
           			<div class="share_box_hint" id="'+ id +'_hint"></div>\
           			<div class="share_box_count" id="'+ id +'_count"></div>\
           		</div>\
           		<div>\
           			<img id="'+id+'_thumb" class="share_box_thumb" src="'+option.thumb+'" width=211 height=127 />\
           		</div>';
            
            if(option.maskIframe){
            	html += '<iframe class="ui_maskBgIframe" src="'+alloy.CONST.MAIN_URL+'domain.html;" border="0"></iframe>';
            }
            
            container.innerHTML = html;
            parent.appendChild(container);
            if(option.isPopup){
            	this._panel = new J.ui.PopupBox({
	                id: id,
	                name: name,
	                container: container
	            });
            }else{
            	this._panel = new J.ui.Panel({
	                id: id,
	                name: name,
	                container: container
	            });
            }
            
            
            this._shareBoxTitleTxt = $D.id(id + '_titleTxt');
            this._shareBoxTitle = $D.id(id + '_title');
            this._shareBoxHint = $D.id(id + '_hint');
            this._shareBoxFooter = $D.id(id + '_footer');
            this._shareBoxBody = $D.id(id + '_body');
            this._shareBoxCount = $D.id(id + '_count');
            this._shareBoxShowthumb=$D.id(id + '_showthumb');
            this._shareBoxThumb=$D.id(id + '_thumb');
            
            var areaHtml = '<strong class="share_big_quote share_left_quote">“</strong><textarea class="share_box_text" id="'+ id +'_text"></textarea><strong class="share_big_quote share_right_quote">”</strong>';
            if(option.readOnly){
            	//this._shareBoxText.readOnly = 'readonly';
            	areaHtml = '<strong class="share_big_quote share_left_quote">“</strong><textarea class="share_box_text" id="'+ id +'_text" readOnly="readonly"></textarea><strong class="share_big_quote share_right_quote">”</strong>';
            }
            if(!option.thumb){
            	$D.hide(this._shareBoxShowthumb);
            }
            this._shareBoxBody.innerHTML = areaHtml;
            this._shareBoxText = $D.id(id + '_text');
            
            var context = this;
            var observer = {
            	onSendButtonClick: function(e){
            		e.preventDefault();
            		e.stopPropagation();
            		$E.notifyObservers(context, 'clickSendButton');
            	},
            	onCloseButtonClick: function(e){
            		e.preventDefault();
            		e.stopPropagation();
            		context.hide();
            		$E.notifyObservers(context, 'clickCloseButton');
            	},
            	onTextAreaKeyUp: function(e){
            		e.stopPropagation();
					e.preventDefault();
					alloy.util.subStringByChar(e, option.limit);
            	},
			toggleThumb:function(e){
				e.preventDefault();
				e.stopPropagation();
				if($D.isShow(context._shareBoxThumb)){
					$D.hide(context._shareBoxThumb);
				}
				else{
					$D.show(context._shareBoxThumb);
				}
			}
            };
            
            this._sendButton = new J.ui.Button({
            	'appendTo' : this._shareBoxFooter,
				'className' : 'window_button window_ok',
				'isStopPropagation' : true,
				'text' : '发表' ,
				'event' : {
					'click' : observer.onSendButtonClick
				}
			});
            this._sendButton.show();
            if(option.hasCloseButton){
    			this._closeButton = new J.ui.Button({
                	'appendTo' : this._shareBoxTitle,
    				'className' : 'textbox_button',
    				'isStopPropagation' : true,
    				'title' : '关闭' ,
    				'event' : {
    					'click' : observer.onCloseButtonClick
    				}
    			});
                this._closeButton.show();
            }
            
            this._shareBoxText.innerHTML = content;
            
            if(option.title){
            	this._shareBoxTitleTxt.innerHTML = option.title;
            	$D.show(this._shareBoxTitle);
            }
            if(option.hint){
            	var spliter = '',
            		node = null;
            	
            	for(var i=0; i<option.hint.length; i++){
            		node = $D.node('a', {
            			'href': '###',
            			'class': 'share_box_hintLink'
            		});
            		node.innerHTML = option.hint[i].text;
            		$E.on(node, 'click', option.hint[i].click);
            		this._shareBoxHint.appendChild(node);
            	}
            }
            if(option.limit){
            	//暂时去掉数字提示
//	            this._shareBoxCount.innerHTML = option.maxChar;
//            	$D.show(this._shareBoxCount);
            	$E.on(this._shareBoxText, 'keyup', observer.onTextAreaKeyUp);
            }
//            if(option.onTextAreaClick){
//                $E.on(this._shareBoxText, 'keyup', option.onTextAreaClick);
//            }
            $E.on(this._shareBoxShowthumb, 'click', observer.toggleThumb);
            
            this.setHeight(option.height);
            this.setWidth(option.width);
		},
		setHeight: function(height){
			var h = height - this._titleHeight - this._footerHeight;
			$D.setStyle(this._shareBoxText, 'height', h + 'px');
		},
		setWidth: function(width){
			$D.setStyle(this._el, 'width', width + 'px');
			$D.setStyle(this._shareBoxText, 'width', (width - this._padding - this._margin) + 'px');
		},
		addMask: function(el){
			if(!J.browser.ie) 
				return;
			
			if(J.isString(el)){
				var iframe = '<iframe class="ui_maskBgIframe" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';
				return el+iframe;
			}else{
				var iframe = $D.node('iframe',{
					'class': 'ui_maskBgIframe',
					'src': alloy.CONST.MAIN_URL+'domain.html'
				});	
				el.appendChild(iframe);
			}
		},
		getElement: function(){
			return this._el;
		},
		isShow: function(){
			return this._isShow;	
		},
		show: function(x, y){
			if(x && y){
				this._panel.setXY(x, y);
			}
			this._panel.show();
			this._isShow = true;
		},
		hide: function(){
			this._panel.hide();
			this._isShow = false;
			$E.notifyObservers(this, 'hide');
		},
		getValue: function(){
			return this._shareBoxText.value;
		},
        setValue: function(value){
            this._shareBoxText.value = value;
        },
		setHint: function(el){
			this._shareBoxHint.innerHTML = '';
			this._shareBoxHint.appendChild(el);
			$D.show(this._shareBoxHint);
		},
		setThumb: function(url){
			this._shareBoxThumb.src=url;
		}
	});
});		
		
		