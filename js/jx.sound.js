/**
 * [Javascript core part]: sound 扩展
 */
 
/**	
 * @description
 * Package: jet.sound
 * 
 * Need package:
 * jet.core.js
 * 
 */
Jx().$package(function(J){
	/**
	 * @namespace
	 * @name sound
	 */
	var $D = J.dom,
		$E = J.event,
		$B = J.browser,
		swfSound,
		activeXSound,
		audioSound,
		audioSoundForIpad,
		noneSound,
		soundModeDetector,
		soundObjectList,
		shareSoundObject,
		baseSoundPrototype,
		embedSWF,
		soundEventDispatcher;

	
	
	J.sound = J.sound || {};
	/**
	 * 声音类
	 * @memberOf
	 * @class
	 * @param {string} url: mp3 url
	 * @param {boolean} autoLoadAndPlay: 加载完成自动播放
	 * @param {boolean} needEventSupport: 是否需要事件监听
	 */
	baseSoundPrototype = {
		_volume : 100,
		_boolMute : false,
		_url : '',
		_id : -1,
		init : function(){ throw 'init does not implement a required interface'; },
		/*
		 * @param {string} url: mp3 url,可选
		 */
		load : function(){ throw 'load does not implement a required interface'; },
		getVolume : function(){
			return this._volume;
		},
		setVolume : function(value){
			if(!isNaN(value) && value>=0 && value<=100){
				this._volume=value;
				this._correctVolume();
				return true;
			}
			return false;
		},
		_correctVolume : function(){
			this._setDirectVolume(this._volume*J.sound.Global._volume*!this._boolMute*!J.sound.Global._boolMute/100);
		},
		_setDirectVolume : function(){ throw '_setDirectVolume does not implement a required interface'; },
		mute : function(){
			if(!this._boolMute){
				this._boolMute=true;
				this._correntVolume();
			}
		},
		unMute : function(){
			if(this._boolMute){
				this._boolMute=false;
				this._correntVolume();
			}
		},
		isMute : function(){
			return this._boolMute;
		},
		play : function(){ throw 'play does not implement a required interface'; },
		pause : function(){ throw 'pause does not implement a required interface'; },
		stop : function(){ throw 'stop does not implement a required interface'; },
		getDuration : function(){ throw 'getDuration does not implement a required interface'; },
		getPosition : function(){ throw 'getPosition does not implement a required interface'; },
		setPosition : function(){ throw 'setPosition does not implement a required interface'; },
		free : function(){ throw 'free does not implement a required interface'; }
	};
	audioSound = {
		init : function(url,autoLoadAndPlay,needEventSupport){
			var context=this;
			var autoLoadAndPlay = autoLoadAndPlay || false;
			this._needEventSupport = !!needEventSupport;
			this._url=url;
			this._id=soundObjectList.length;
			if(autoLoadAndPlay){
				var obj=new Audio();
				obj.id='audioSoundObject_'+this._id;
				this._onloadCallback=function(){
					context.play();
					context._obj.removeEventListener('canplay',context._onloadCallback,false);
					context._onloadCallback=null;
				}
				obj.addEventListener('canplay',this._onloadCallback,false);
				$D.id('sound_object_container').appendChild(obj);
				this._obj=obj;
				this.load.call(this,url);
			}
			soundObjectList.push(this);
		},
		load : function(url){
			var context=this;
			if(url) this._url=url;
			else if(!this._url) return;
			if(!this._obj){
				var obj=new Audio();
				obj.id='audioSoundObject_'+this._id;
				if(this._needEventSupport){
					obj.addEventListener('durationchange',function(){
						$E.notifyObservers(context,'durationchange');
					},false);
					obj.addEventListener('timeupdate',function(){
						$E.notifyObservers(context,'timeupdate');
					},false);
					obj.addEventListener('canplay',function(){
						$E.notifyObservers(context,'canplay');
					},false);
					obj.addEventListener('ended',function(){
						$E.notifyObservers(context,'ended');
					},false);
					obj.addEventListener('play',function(){
						$E.notifyObservers(context,'play');
					},false);
					obj.addEventListener('pause',function(){
						$E.notifyObservers(context,'pause');
					},false);
					obj.addEventListener('progress',function(){
						$E.notifyObservers(context,'progress');
					},false);
					obj.addEventListener('error',function(){
						$E.notifyObservers(context,'error');
					},false);
				}
				$D.id('sound_object_container').appendChild(obj);
				this._obj=obj;
			}
			this._obj.src=this._url;
			if($B.mobileSafari) this._obj.load();
		},
		_setDirectVolume : function(value){
			if(this._obj) this._obj.volume=value/100;
		},
		play : function(){
			if(this._obj) this._obj.play();
		},
		pause : function(){
			if(!this._obj) return;
			if(this._onloadCallback){
				this._obj.removeEventListener('canplay',this._onloadCallback,false);
				this._onloadCallback=null;
			}
			this._obj.pause();
		},
		stop : function(){
			if(this._obj){
				this._obj.pause();
				this.setPosition(0);
			}
		},
		getDuration : function(){
			if(!this._obj) return 0;
			return this._obj.duration;
		},
		getPosition : function(){
			if(!this._obj) return 0;
			return this._obj.currentTime;
		},
		setPosition : function(value){
			if(!this._obj) return false;
			var obj=this._obj;
			try{
				if(value>=0 && value<obj.duration){
					obj.currentTime=parseFloat(value);
					return true;
				}else{
					return false;
				}
			}catch(e){
				return false;
			}
		},
		buffered : function(){
			if(!this._obj) return 0;
			var obj=this._obj;
			if(!obj.buffered.length) return 0;
			return obj.buffered.end(0);
		},
		free : function(){
			if(this._obj){
				var obj=this._obj;
				obj.pause();
				$D.id('sound_object_container').removeChild(obj);
				this._obj=null;
			}
			soundObjectList[this._id]=null;
		}
	};
	audioSoundForIpad = {
		init : function(url,autoLoadAndPlay,needEventSupport){
			var context=this;
			var autoLoadAndPlay = autoLoadAndPlay || false;
			this._needEventSupport = !!needEventSupport;
			this._url=url;
			this._id=soundObjectList.length;
			if(autoLoadAndPlay){
				if(shareSoundObject) {
					this._obj= shareSoundObject;
				}else {
					var obj=new Audio();
					obj.id='audioSoundObject_'+this._id;
					$D.id('sound_object_container').appendChild(obj);
					this._obj=obj;
					shareSoundObject= obj;
					this.load.call(this,url);
				}
			}
			soundObjectList.push(this);
		},
		load : function(url){
			var context=this;
			if(url) this._url=url;
			else if(!this._url) return;
			if(!this._obj){
				if(shareSoundObject) {
					//obj都指向shareSoundObject
					this._obj= shareSoundObject;
				}else {
					var obj=new Audio();
					obj.id='audioSoundObject_'+this._id;
					$D.id('sound_object_container').appendChild(obj);
					this._obj=obj;
					shareSoundObject= obj;
				}
			}
			if(this._needEventSupport && !this._hashEventSupport){
				var obj= this._obj;
				this._hashEventSupport= true;
				obj.addEventListener('durationchange',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'durationchange');
					}
				},false);
				obj.addEventListener('timeupdate',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'timeupdate');
					}
				},false);
				obj.addEventListener('canplay',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'canplay');
					}
				},false);
				obj.addEventListener('ended',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'ended');
					}
				},false);
				obj.addEventListener('play',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'play');
					}
				},false);
				obj.addEventListener('pause',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'pause');
					}
				},false);
				obj.addEventListener('progress',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'progress');
					}
				},false);
				obj.addEventListener('error',function(){
					if(!obj._inject) {
						$E.notifyObservers(context,'error');
					}
				},false);
			}
			this._obj.src=this._url;
			if($B.mobileSafari) this._obj.load();
		},
		_setDirectVolume : function(value){
			if(this._obj) this._obj.volume=value/100;
		},
		/**
		 * @param {Bool} inject true|false 是否插入当前播放音频（播放后恢复）
		 */
		play : function(inject, url){
			if(this._obj) {
				
				if(inject) {
					this._obj._inject= true;
					var src, currentTime, _this= this;
					if(!this._obj.paused) {
						src= this._obj.src;
						if(!this._obj.ended) {
							currentTime= this._obj.currentTime+0.01;
						}
					}
					this.load(url);
					var innerCall= function() {
						_this._obj.removeEventListener("ended",innerCall,false);
						_this._obj._inject= false;
						if(src) {
							_this._obj.src= src;
							//ipad not support muted
							_this._obj.muted= true;
							_this._obj.load();
							if(currentTime) {
								var setCall= function() {
									try {
										_this._obj.currentTime= currentTime;
										_this._obj.muted= false;
										_this._obj.play();
									}catch(e) {
										setTimeout(setCall, 1000);
									}
								}
								setCall();
							}
						}
					};
					this._obj.addEventListener("ended",innerCall,false);
					setTimeout(function(){
						if(_this._obj._inject) {
							innerCall();
						}
					},3000);
					this._obj.play();
				}else {
					this._obj.play();
				}
			}
		},
		pause : function(){
			if(!this._obj) return;
			this._obj.pause();
		},
		stop : function(){
			if(this._obj){
				this._obj.pause();
				this.setPosition(0);
			}
		},
		getDuration : function(){
			if(!this._obj) return 0;
			return this._obj.duration;
		},
		getPosition : function(){
			if(!this._obj) return 0;
			return this._obj.currentTime;
		},
		setPosition : function(value){
			if(!this._obj) return false;
			var obj=this._obj;
			try{
				if(value>=0 && value<obj.duration){
					obj.currentTime=parseFloat(value);
					return true;
				}else{
					return false;
				}
			}catch(e){
				return false;
			}
		},
		buffered : function(){
			if(!this._obj) return 0;
			var obj=this._obj;
			if(!obj.buffered.length) return 0;
			return obj.buffered.end(0);
		},
		free : function(){
			if(this._obj){
				var obj=this._obj;
				obj.pause();
				$D.id('sound_object_container').removeChild(obj);
				this._obj=null;
			}
			soundObjectList[this._id]=null;
		}
	};
	swfSound = {
		init : function(url,autoLoadAndPlay,needEventSupport){
			this._fid=-1;
			var context=this;
			var autoLoadAndPlay = autoLoadAndPlay || false;
			this._needEventSupport = !!needEventSupport;
			this._url=url;
			this._id=soundObjectList.length;
			if(autoLoadAndPlay){
				var obj=$D.id('JxSwfSound_Flash');
				this._fid=obj.loadSound(this._url,-1,true); //url, callbackid, playWhileReady
				this._correctVolume();
			}
			soundObjectList.push(this);
		},
		load : function(url){
			if(url) this._url=url;
			else if(!this._url) return;
			var obj=$D.id('JxSwfSound_Flash');
			if(this._fid!=-1){
				obj.free(this._fid);
			}
			this._fid=obj.loadSound(this._url,this._needEventSupport?this._id:-1,false);
			this._correctVolume();
		},
		_setDirectVolume : function(value){
			if(this._fid==-1) return;
			var obj=$D.id('JxSwfSound_Flash');
			obj.setVolume(this._fid,value);
		},
		play : function(){
			if(this._fid==-1) return;
			var obj=$D.id('JxSwfSound_Flash');
			obj.playSound(this._fid);
		},
		pause : function(){
			if(this._fid==-1) return;
			var obj=$D.id('JxSwfSound_Flash');
			obj.pauseSound(this._fid);
		},
		stop : function(){
			if(this._fid==-1) return;
			var obj=$D.id('JxSwfSound_Flash');
			obj.stopSound(this._fid);
		},
		getDuration : function(){
			if(this._fid==-1) return 0;
			var obj=$D.id('JxSwfSound_Flash');
			return obj.getDuration(this._fid);
		},
		getPosition : function(){
			if(this._fid==-1) return 0;
			var obj=$D.id('JxSwfSound_Flash');
			return obj.getPosition(this._fid);
		},
		setPosition : function(value){
			if(this._fid==-1) return false;
			var obj=$D.id('JxSwfSound_Flash');
			return obj.setPosition(this._fid,value);
		},
		buffered : function(){
			if(this._fid==-1) return 0;
			var obj=$D.id('JxSwfSound_Flash');
			return obj.getBuffered(this._fid);
		},
		free : function(){
			if(this._fid!=-1){
				var obj=$D.id('JxSwfSound_Flash');
				obj.free(this._fid);
			}
			soundObjectList[this._id]=null;
		}
	};
	embedSWF = function(path) {
		if (path == undefined) {
			path = "./swf/jxswfsound.swf";
		}

		var flashvars = false;

		var attributes = {
			id : 'JxSwfSound_Flash',
			name : 'JxSwfSound_Flash'
		};

		var params = {
			menu : 'false',
			wmode : 'transparent',
			swLiveConnect : 'true',
			allowScriptAccess : 'always'
		};

		var swapNode=$D.node('div',{
			id:'swfSound_Flash_div'
		});
		var container=$D.id('sound_object_container')
		container.appendChild(swapNode);
		$D.setStyle(container,'display','');
		// make sure the flash movie is visible, otherwise the onload is not fired!
		try {
			J.swfobject.embedSWF(path, 'swfSound_Flash_div', '1', '1', '8.0.0',
					'./swf/expressInstall.swf', flashvars, params, attributes);
		} catch (e) {
			J.error('J.Sound module error: ' + e.message, 'Sound');
			// alert( 'Seems like you are missing swfobject! - Please include
			// the swfobject javascript into your HTML!' );
		}
	};
	soundEventDispatcher = function(id,event){
		//alert('SoundEvent:'+id+' '+event);
		var obj=soundObjectList[id];
		if(obj) $E.notifyObservers(obj,event);
	};

	noneSound = {
		init : function(){},
		load : function(){},
		_correctVolume : function(){},
		play : function(){},
		pause : function(){},
		stop : function(){},
		getDuration : function(){return -1},
		getPosition : function(){return 0},
		setPosition : function(){return true},
		free : function(){}
	};
	
	soundModeDetector = function(){
  		if(J.browser.chrome){
            return 1;//chrome新版有问题, 播放不了audio
        }else if(J.platform.iPad) {
			return 4;
		}else if(window.Audio && (new Audio).canPlayType('audio/mpeg')){
			return 3; //以上浏览器的高版本支持audio对象播放mp3格式
		}else if(J.browser.plugins.flash>=9){
			return 1; //支持flash控件
		}
		/*else if(!!window.ActiveXObject && new ActiveXObject("WMPlayer.OCX.7")){
			return 2; //支持wmp控件
		}*/
		else{
			return 0; //一直很安静
		}
	};
	soundObjectList=[];
	//J.profile('[J.sound]sound mode:'+soundModeDetector());
	switch(soundModeDetector()){
		case 1 : //flash mode
			J.sound = new J.Class(J.extend({},baseSoundPrototype,swfSound));
			J.sound.isReady=false;
			J.sound.init = function(option){
				if(J.sound.isReady) return;
				window.JxSwfSoundOnLoadCallback = function(){
					J.sound.isReady=true;
					var d=$D.id('sound_object_container');
					$D.setStyle(d,'width','1px');
					$D.setStyle(d,'height','1px');
					$E.notifyObservers(J.sound,'ready');
				};
				window.soundEventDispatcher=soundEventDispatcher;
				var d=$D.node('div',{
					id:'sound_object_container',
					style:'position:absolute;left:0;top:0;width:100px;height:100px;overflow:hidden;' //此处display不能为none, 否则会出现很多诡异的错误
				});
				(document.body || document.documentElement).appendChild(d);
				embedSWF(option && option.path);
			}
			break;
		case 3 : //html5 mode
			J.sound = new J.Class(J.extend({},baseSoundPrototype,audioSound));
			J.sound.isReady=false;
			J.sound.init = function(){
				if(J.sound.isReady) return;
				var d=$D.node('div',{
					id:'sound_object_container',
					style:'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;' //此处display不能为none, 否则会出现很多诡异的错误
				});
				(document.body || document.documentElement).appendChild(d);
				J.sound.isReady=true;
			}
			break;
		case 4 : //ipad mode
			J.sound = new J.Class(J.extend({},baseSoundPrototype,audioSoundForIpad));
			J.sound.isReady=false;
			J.sound.init = function(){
				if(J.sound.isReady) return;
				var d=$D.node('div',{
					id:'sound_object_container',
					style:'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;' //此处display不能为none, 否则会出现很多诡异的错误
				});
				(document.body || document.documentElement).appendChild(d);
				J.sound.isReady=true;
			}
			break;
		default : //none sound support
			J.sound = new J.Class(J.extend({},baseSoundPrototype,noneSound));
			J.sound.init = function(){};
			J.sound.isReady=false;
			break;
	}
	J.sound.Global = {
		_volume : 100, //between 0 to 100
		_boolMute : false,
		getVolume : function(){
			return this._volume;
		},
		setVolume : function(value){
			if(!isNaN(value) && value>=0 && value<=100){
				this._volume=value;
				//TODO set all sound volume
				for(var i=0,l=soundObjectList.length;i<l;i++){
					if(soundObjectList[i]!=null) soundObjectList[i]._correctVolume();
				}
				return true;
			}
			return false;
		},
		mute : function(){
			if(!this._boolMute){
				this._boolMute=true;
				//TODO mute all sound
				for(var i=0,l=soundObjectList.length;i<l;i++){
					if(soundObjectList[i]!=null) soundObjectList[i]._correctVolume();
				}
			}
		},
		unMute : function(){
			if(this._boolMute){
				this._boolMute=false;
				//TODO resume all sound
				for(var i=0,l=soundObjectList.length;i<l;i++){
					if(soundObjectList[i]!=null) soundObjectList[i]._correctVolume();
				}
			}
		},
		isMute : function(){
			return this._boolMute;
		},
		removeAll : function(){
			//TODO remove all sound
			for(var i=0,l=soundObjectList.length;i<l;i++){
					if(soundObjectList[i]!=null) soundObjectList[i].free();
			}
		}
	};
});
