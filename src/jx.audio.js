/**
 * [Javascript core part]: audio 扩展
 */
 
/** 
 * @description
 * Package: jx.audio
 * 
 * Need package:
 * jx.core.js
 * 
 */
Jx().$package(function(J){
    
    var packageContext = this,
        $D = J.dom,
        $E = J.event,
        $B = J.browser;

    var EMPTY_FUNC = function(){ return 0; };
    var BaseAudio = J.Class({
        init : function(){ throw 'BaseAudio does not implement a required interface'; },
        play : EMPTY_FUNC,
        pause : EMPTY_FUNC,
        stop : EMPTY_FUNC,

        getVolume : EMPTY_FUNC,
        setVolume : EMPTY_FUNC,
        getLoop : EMPTY_FUNC,
        setLoop : EMPTY_FUNC,
        setMute : EMPTY_FUNC,
        getMute : EMPTY_FUNC,
        getPosition : EMPTY_FUNC,
        setPosition : EMPTY_FUNC,

        getBuffered : EMPTY_FUNC,
        getDuration : EMPTY_FUNC,
        free : EMPTY_FUNC,

        on : EMPTY_FUNC,
        off : EMPTY_FUNC
    });

    var AUDIO_MODE = {
        NONE : 0,
        NATIVE : 1,
        WMP : 2,
        FLASH : 3,
        MOBILE : 4
    };
    /**
     * @ignore
     */
    var audioModeDetector = function(){
        if(window.Audio && (new Audio).canPlayType('audio/mpeg')){ //支持audio
            if((/\bmobile\b/i).test(navigator.userAgent)){
                return AUDIO_MODE.MOBILE;
            }
            return AUDIO_MODE.NATIVE;
        }else if(J.browser.plugins.flash>=9){ //支持flash控件
            return AUDIO_MODE.FLASH;
        }else if(!!window.ActiveXObject && (function(){
                try{
                    new ActiveXObject("WMPlayer.OCX.7");
                }catch(e){
                    return false;
                }
                return true;
            })()){ //支持wmp控件
            return AUDIO_MODE.WMP;
        }else{
            return AUDIO_MODE.NONE; //啥都不支持
        }
    };

    var getContainer = function(){
        var _container;
        return function(mode){
            if(!_container){
                var node = document.createElement('div');
                node.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;margin:0;padding:0;left:0;top:0;';
                (document.body || document.documentElement).appendChild(node);
                if(mode == AUDIO_MODE.FLASH){
                    node.innerHTML = '<object id="JxAudioObject" name="JxAudioObject" ' + (J.browser.ie ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' +
                        J.path + 'style/swf/jxaudioobject.swf"') + 'width="1" height="1" align="top"><param name="movie" value="' +
                        J.path + 'style/swf/jxaudioobject.swf" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="quality" value="high" /><param name="wmode" value="opaque" /></object>';
                    _container = J.dom.id('JxAudioObject') || window['JxAudioObject'] || document['JxAudioObject'];
                }else{
                    _container = node;
                }
            }
            return _container;
        }
    }();
    var getSequence = function(){
        var _seq = 0;
        return function(){
            return _seq++;
        }
    }();

    var audioMode = audioModeDetector();
    switch(audioMode){
        case AUDIO_MODE.NATIVE:
        case AUDIO_MODE.MOBILE:
            var NativeAudio = J.Class({extend:BaseAudio},{
                init : function(option){
                    option = option || {};
                    var el = this._el = new Audio();
                    el.loop = Boolean(option.loop); //default by false
                    /*el.autoplay = option.autoplay !== false; //defalut by true*/
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        this._el.src = url;
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    this._el.pause();
                },
                stop : function(){
                    this._el.currentTime = Infinity;
                },

                getVolume : function(){
                    return !this._el.muted && this._el.volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._el.volume = Math.max(0,Math.min(value,1));
                        this._el.muted = false;
                    }
                },
                getLoop : function(){
                    return this._el.loop;
                },
                setLoop : function(value){
                    this._el.loop = value !== false;
                },
                /*getAutoplay : function(){
                    return thie._el.autoplay;
                },
                setAutoplay : function(value){
                    this._el.autoplay = value !== false;
                },*/
                getMute : function(){
                    return this._el.muted;
                },
                setMute : function(value){
                    this._el.muted = value !== false;
                },
                getPosition : function(){
                    return this._el.currentTime;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._el.currentTime = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.buffered.length && this._el.buffered.end(0) || 0;
                },
                getDuration : function(){
                    return this._el.duration;
                },
                free : function(){
                    this._el.pause();
                    this._el = null;
                },
                on : function(event, handler){
                    this._el.addEventListener(event,handler,false);
                },
                off : function(event, handler){
                    this._el.removeEventListener(event,handler,false);
                }
            });
            if(audioMode = AUDIO_MODE.NATIVE){
                J.Audio = NativeAudio;
                break;
            }
            var playingStack = [];
            var stackPop = function(){
                var len = playingStack.length;
                playingStack.pop().off('ended', stackPop);
                if(len >= 2){
                    playingStack[len - 2]._el.play();
                }
            };
            J.Audio = J.Class({extend:NativeAudio},{
                init : function(option){
                    NativeAudio.prototype.init.call(this, option);
                },
                play : function(url){
                    var len = playingStack.length;
                    if(len && playingStack[len - 1] !== this){
                        var index = J.array.indexOf(playingStack, this);
                        if(-1 !== index){
                            playingStack.splice(index, 1);
                        }else{
                            this.on('ended', stackPop);
                        }
                    }
                    playingStack.push(this);

                    if(url){
                        this._el.src = url;
                        // this._el.load();
                    }
                    if(this._el.paused){
                        this._el.play();
                    }
                },
                pause : function(){
                    for(var i = 0, len = playingStack.length; i < len; i++){
                        playingStack[i].off('ended', stackPop);
                    }
                    playingStack = [];
                    this._el.pause();
                }
            });

            break;
        case AUDIO_MODE.FLASH :
            var addToQueue = function(audioObject){
                var tryInvokeCount = 0,
                    queue = [],
                    flashReady = false;
                var tryInvoke = function(){
                    ++tryInvokeCount;
                    var container = getContainer();
                    if(container.audioLoad && typeof container.audioLoad === 'function'){
                        flashReady = true;
                        for(var i=0,len=queue.length;i<len;i++){
                            queue[i]._sync();
                        }
                        queue = null;
                    }else if(tryInvokeCount < 30000){
                        setTimeout(tryInvoke, 100);
                    }
                }
                return function(audioObject){
                    if(flashReady){
                        audioObject._sync();
                        return;
                    }
                    if(-1 === J.array.indexOf(queue, audioObject)){
                        queue.push(audioObject);
                    }
                    if(tryInvokeCount === 0){
                        tryInvoke();
                    }
                }
            }();
            var registerEvent, unregisterEvent;
            (function(){
                var list = [];
                window.Jx['AudioEventDispatcher'] = function(seq, event, param){
                    var audioObject = list[seq],events;
                    audioObject && audioObject._handler && (events = audioObject._handler[event]);
                    for(var i=0,len=events && events.length;i<len;i++){
                        events[i].call(audioObject, param);
                    }
                };
                registerEvent = function(audioObject){
                    list[audioObject._seq] = audioObject;
                };
                unregisterEvent = function(audioObject){
                    list[audioObject._seq] = null;
                };
            })();
            J.Audio = J.Class({
                init : function(option){
                    this._seq = getSequence();
                    this._volume = 1;
                    this._muted = false;
                    option = option || {};
                    this._loop = Boolean(option.loop); //default by false
                    this._paused = true;
                    var container = getContainer(AUDIO_MODE.FLASH);
                    if(option.src){
                        this.play(option.src);
                    }
                },
                play : function(url){
                    var container = getContainer();
                    if(url){
                        this._src = url;
                        this._paused = false;
                        if(container.audioLoad){
                            this._sync();
                        }else{
                            addToQueue(this);
                        }
                    }else{
                        this._paused = false;
                        container.audioPlay && container.audioPlay(this._seq);
                    }
                },
                pause : function(){
                    var container = getContainer();
                    this._paused = true;
                    container.audioPause && container.audioPause(this._seq);
                },
                stop : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioStop && container.audioStop(this._seq);
                },

                getVolume : function(){
                    return !this._muted && this._volume || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        this._volume = Math.max(0,Math.min(value,1));
                        this._muted = false;
                        var container = getContainer();
                        container.audioSetVolume && container.audioSetVolume(this._seq, this._volume);
                    }
                },
                getLoop : function(){
                    return this._loop;
                },
                setLoop : function(value){
                    this._loop = value !== false;
                    var container = getContainer();
                    container.audioSetLoop && container.audioSetLoop(this._loop);
                },
                getMute : function(){
                    return this._muted;
                },
                setMute : function(value){
                    this._muted = value !== false;
                    var container = getContainer();
                    container.audioSetVolume && container.audioSetVolume(this._seq, this.getVolume());
                },
                getPosition : function(){
                    var container = getContainer();
                    return container.audioGetPosition && container.audioGetPosition(this._seq)/1000 || 0;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        var container = getContainer();
                        container.audioSetPosition(this._seq, Math.max(0,value)*1000);
                    }
                },

                getBuffered : function(){
                    var container = getContainer();
                    return container.audioGetBuffered && container.audioGetBuffered(this._seq)/1000 || 0;
                },
                getDuration : function(){
                    var container = getContainer();
                    return container.audioGetDuration && container.audioGetDuration(this._seq)/1000 || 0;
                },
                free : function(){
                    this._paused = true;
                    var container = getContainer();
                    container.audioFree && container.audioFree(this._seq);
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                        registerEvent(this);
                    }
                    if(!this._handler[event] || !this._handler[event].length){
                        this._handler[event] = [handler];
                        var container = getContainer();
                        container.audioOn && container.audioOn(this._seq, event);
                    }else{
                        if(-1 === J.array.indexOf(this._handler[event],handler)){
                            this._handler[event].push(handler);
                        }
                    }
                },
                off : function(event, handler){
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.array.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                        if(!this._handler[event].length){
                            var container = getContainer();
                            container.audioOff && container.audioOff(this._seq, event);
                            delete this._handler[event];
                        }
                    }
                },

                _sync : function(){
                    if(this._src){
                        var container = getContainer(),
                            seq = this._seq;
                        container.audioLoad(seq, this._src);
                        var volume = this.getVolume();
                        if(volume != 1){
                            container.audioSetVolume(seq, volume);
                        }
                        if(this._loop){
                            container.audioSetLoop(seq, true);
                        }
                        for(var event in this._handler){
                            container.audioOn(seq, event);
                        }
                        if(!this._paused){
                            container.audioPlay(seq);
                        }
                    }
                }
            });
            break;
        case AUDIO_MODE.WMP:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    this._seq = getSequence();
                    option = option || {};
                    var wrap = document.createElement('div');
                    getContainer(AUDIO_MODE.WMP).appendChild(wrap);
                    wrap.innerHTML = '<object id="WMPObject'+this._seq+'" classid="CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6" standby="" type="application/x-oleobject" width="0" height="0">\
                        <param name="AutoStart" value="true"><param name="ShowControls" value="0"><param name="uiMode" value="none"></object>';
                    var el = this._el = J.dom.id('WMPObject'+this._seq) || window['WMPObject'+this._seq];
                    if(option.loop){ //default by false
                        this._el.settings.setMode('loop', true);
                    }
                    if(option.src){
                        // el.src = option.src;
                        this.play(option.src);
                    }
                },
                play : function(url){
                    if(url){
                        var a = document.createElement('a');
                        a.href = url;
                        url = J.dom.getHref(a);
                        this._isPlaying = false;
                        this._isBuffering = false;
                        // this._duration = 0;
                        this._canPlayThroughFired = false;
                        this._el.URL = J.dom.getHref(a);
                    }
                    if(this._el.playState !== 3){ //not playing
                        this._el.controls.play();
                    }
                    if(this._hasPoll()){
                        this._startPoll();
                    }
                },
                pause : function(){
                    this._el.controls.pause();
                },
                stop : function(){
                    this._el.controls.stop();
                },

                getVolume : function(){
                    return !this._el.settings.mute && this._el.settings.volume / 100 || 0;
                },
                setVolume : function(value){
                    if(isFinite(value)){
                        var newVolume = Math.max(0,Math.min(value,1)) * 100;
                        if(this._el.settings.volume !== newVolume || this._el.settings.mute){
                            this._el.settings.volume = newVolume;
                            this._el.settings.mute = false;
                            this._fire('volumechange');
                        }
                    }
                },
                getLoop : function(){
                    return this._el.settings.getMode('loop');
                },
                setLoop : function(value){
                    this._el.settings.setMode('loop', value !== false);
                },
                getMute : function(){
                    return this._el.settings.mute;
                },
                setMute : function(value){
                    var newMute = value !== false;
                    if(this._el.settings.mute !== newMute){
                        this._el.settings.mute = newMute;
                        this._fire('volumechange');
                    }
                },
                getPosition : function(){
                    return this._el.controls.currentPosition;
                },
                setPosition : function(value){
                    if(!isNaN(value)){
                        this._fire('seeking');
                        this._el.controls.currentPosition = Math.max(0,value);
                    }
                },
                getBuffered : function(){
                    return this._el.network.downloadProgress * .01 * this.getDuration();
                },
                getDuration : function(){
                    return (this._el.currentMedia || 0).duration || 0;
                },
                free : function(){
                    this._el.controls.stop();
                    this._el = null;
                },

                on : function(event, handler){
                    if(!this._handler){
                        this._handler = {};
                    }
                    var context = this;
                    switch(event){
                        case 'timeupdate':
                            this._startPoll();
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._onPositionChange = function(position){
                                    context._fire('timeupdate');
                                    context._fire('seeked');
                                }
                                this._el.attachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._onBuffering = function(isStart){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(isStart){
                                        context._isBuffering = true;
                                        context._fire('waiting');
                                    }else{
                                        context._isBuffering = false;
                                        context._fire('playing');
                                    }
                                };
                                this._el.attachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            // this._el.attachEvent('MediaError',handler);
                            this._el.attachEvent('Error',handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._onPlayStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 2){
                                        context._isPlaying = false;
                                        context._fire('pause');
                                    }else if(state === 3){
                                        if(!context._isPlaying){
                                            context._isPlaying = true;
                                            context._fire('play');
                                        }
                                    }else if(state === 6){ //Buffering
                                        context._fire('progress');
                                    }else if(state === 1){ //MediaEnded, Stopped
                                        if(context._isPlaying){
                                            context._isPlaying = false;
                                            context._fire('ended');
                                            context._stopPoll();
                                        }
                                    }/*else{
                                        console.log('playstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._onOpenStateChange = function(state){
                                    if(!(context._el.currentMedia || 0).sourceURL){
                                        return;
                                    }
                                    if(state === 21){
                                        context._fire('loadstart');
                                    }else if(state === 13){
                                        context._fire('loadeddata');
                                        context._fire('canplay');
                                    }/*else{
                                        console.log('openstate:',state);
                                    }*/
                                }
                                this._el.attachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            this._startPoll();
                            break;
                        default:
                            break;
                    }
                    (this._handler[event] || (this._handler[event] = [])).push(handler);
                },
                off : function(event, handler){
                    if(!this._handler){
                        return;
                    }
                    var index;
                    if(this._handler && this._handler[event] && -1 !== (index = J.array.indexOf(this._handler[event],handler))){
                        this._handler[event].splice(index,1);
                    }

                    switch(event){
                        case 'timeupdate':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                        case 'seeked':
                            if(!this._hasPositionChange()){
                                this._el.detachEvent('PositionChange', this._onPositionChange);
                            }
                            break;
                        case 'waiting':
                        case 'playing':
                            if(!this._hasBuffering()){
                                this._el.detachEvent('Buffering', this._onBuffering);
                            }
                            break;
                        case 'error':
                            this._el.detachEvent('Error', handler);
                            break;
                        case 'progress':
                        case 'ended':
                        case 'play':
                        case 'pause':
                            if(!this._hasPlayStateChange()){
                                this._el.detachEvent('PlayStateChange', this._onPlayStateChange);
                            }
                            break;
                        case 'loadstart':
                        case 'loadeddata':
                        case 'canplay':
                            if(!this._hasOpenStateChange()){
                                this._el.detachEvent('OpenStateChange', this._onOpenStateChange);
                            }
                            break;
                        case 'canplaythrough':
                        case 'durationchange':
                            if(!this._hasPoll()){
                                this._stopPoll();
                            }
                            break;
                        default:
                            break;
                    }
                },
                _fire : function(event){
                    var events;
                    if(!this._handler || !(events = this._handler[event])){
                        return;
                    }
                    for(var i=0,len=events.length;i<len;i++){
                        events[i].call(this);
                    }
                },
                _startPoll : function(){
                    if(this._timer !== undefined){
                        return;
                    }
                    this._canPlayThroughFired = this._canPlayThroughFired || this._el.network.downloadProgress === 100;
                    this._duration = this.getDuration();
                    var context = this;
                    this._timer = setInterval(function(){
                        if(context._isPlaying && !context._isBuffering && (context._handler['timeupdate'] || 0).length && (context._el.currentMedia || 0).sourceURL){
                            context._fire('timeupdate');
                        }

                        var duration = context.getDuration();
                        if(context._duration !== duration){
                            context._duration = duration;
                            context._fire('durationchange');
                        }
                        if(!context._canPlayThroughFired){
                            if(context._el.network.downloadProgress === 100){
                                context._canPlayThroughFired = true;
                                context._fire('canplaythrough');
                            }
                        }
                    },1000);
                },
                _stopPoll : function(){
                    clearInterval(this._timer);
                    delete this._timer;
                },
                _hasPositionChange : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['seeked'] && this._handler['seeked'].length);
                },
                _hasBuffering : function(){
                    return (this._handler['waiting'] && this._handler['waiting'].length) ||
                        (this._handler['playing'] && this._handler['playing'].length);
                },
                _hasPlayStateChange : function(){
                    return (this._handler['progress'] && this._handler['progress'].length) ||
                        (this._handler['ended'] && this._handler['ended'].length) ||
                        (this._handler['play'] && this._handler['play'].length) ||
                        (this._handler['pause'] && this._handler['pause'].length);
                },
                _hasOpenStateChange : function(){
                    return (this._handler['loadstart'] && this._handler['loadstart'].length) ||
                        (this._handler['loadeddata'] && this._handler['loadeddata'].length) ||
                        (this._handler['canplay'] && this._handler['canplay'].length);
                },
                _hasPoll : function(){
                    return (this._handler['timeupdate'] && this._handler['timeupdate'].length) ||
                        (this._handler['canplaythrough'] && this._handler['canplaythrough'].length) ||
                        (this._handler['durationchange'] && this._handler['durationchange'].length);
                }
            });
            break;
        case AUDIO_MODE.NONE:
            J.Audio = J.Class({extend:BaseAudio},{
                init : function(option){
                    J.warn('Audio is not supported','Audio');
                }
            });
            break;
        default:
            break;
    }
});
