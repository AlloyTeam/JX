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
    
    var $E = J.event;
    var soundObjectList = [];

    
    /**
     * @namespace
     * @name sound
     */
    J.sound = J.Class({
        /**
         * 声音类
         * @ignore
         * 
         * @param {string} url  mp3 url
         * @param {boolean} autoLoadAndPlay  加载完成自动播放
         * @param {boolean} needEventSupport  是否需要事件监听
         */
        init : function(url,autoLoadAndPlay,needEventSupport){
            var audio = this._audio = new J.Audio();
            soundObjectList.push(this);
            var context = this;
            if(needEventSupport){
                audio.on('durationchange',function(){
                    $E.notifyObservers(context,'durationchange');
                },false);
                audio.on('timeupdate',function(){
                    $E.notifyObservers(context,'timeupdate');
                },false);
                audio.on('canplay',function(){
                    $E.notifyObservers(context,'canplay');
                },false);
                audio.on('ended',function(){
                    $E.notifyObservers(context,'ended');
                },false);
                audio.on('play',function(){
                    $E.notifyObservers(context,'play');
                },false);
                audio.on('pause',function(){
                    $E.notifyObservers(context,'pause');
                },false);
                audio.on('progress',function(){
                    $E.notifyObservers(context,'progress');
                },false);
                audio.on('error',function(){
                    $E.notifyObservers(context,'error');
                },false);
            }
            if(autoLoadAndPlay){
                audio.play(url);
            }else{
                this._url = url;
            }
        },
        /*
         * @param {string} url: mp3 url,可选
         */
        load : function(url){
            if(url){
                this._url = url;
            }
            this.play();
            this.pause();
        },
        
        getVolume : function(){
            return this._audio.getVolume();
        },
        setVolume : function(value){
            this._audio.setVolume();
            return true;
        },
        mute : function(){
            this._audio.setMute(true);
        },
        unMute : function(){
            this._audio.setMute(false);
        },
        isMute : function(){
            return this._audio.getMute();
        },
        play : function(){
            this._audio.play(this._url);
            delete this._url;
        },
        pause : function(){
            this._audio.pause();
        },
        stop : function(){
            this._audio.stop();
        },
        getDuration : function(){
            return this._audio.getDuration();
        },
        getPosition : function(){
            return this._audio.getPosition();
        },
        setPosition : function(value){
            this._audio.setPosition(value);
            return true;
        },
        buffered : function(){
            return this._audio.getBuffered();
        },
        free : function(){
            this._audio.free();
            var index = J.array.indexOf(soundObjectList, this);
            if(-1 !== index){
                soundObjectList.splice(index, 1);
            }
        }
    });

    J.sound.init = function(){};
    J.sound.isReady = true;
    J.sound.Global = {
        _mute : false,
        getVolume : function(){
            return 1;
        },
        setVolume : function(value){
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].setVolume(value);
            }
            return true;
        },
        mute : function(){
            this._mute = true;
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].mute();
            }
        },
        unMute : function(){
            this._mute = false;
            for(var i in soundObjectList){
                soundObjectList[i] && soundObjectList[i].unMute();
            }
        },
        isMute : function(){
            return this._mute;
        },
        removeAll : function(){
            for(var obj; obj = soundObjectList.pop();){
                obj.free();
            }
        }
    };
});
