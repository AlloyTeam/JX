/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */
 
 
/** 
 * @description
 * Package: jet.fx
 * 
 * Need package:
 * jet.core.js
 * 
 */
 
 

Jx().$package(function(J){
    /**
     * 动画包
     * @namespace
     * @name fx
     */
    J.fx = J.fx || {};
    
    var $D = J.dom,
        $E = J.event;

    /**
     * 动画缓动公式
     * 
     * Linear：无缓动效果；
     * Quadratic：二次方的缓动（t^2）；
     * Cubic：三次方的缓动（t^3）；
     * Quartic：四次方的缓动（t^4）；
     * Quintic：五次方的缓动（t^5）；
     * Sinusoidal：正弦曲线的缓动（sin(t)）；
     * Exponential：指数曲线的缓动（2^t）；
     * Circular：圆形曲线的缓动（sqrt(1-t^2)）；
     * Elastic：指数衰减的正弦曲线缓动；
     * Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
     * Bounce：指数衰减的反弹缓动。
     * 
     * 每个效果都分三个缓动方式（方法），分别是：
     * easeIn：从0开始加速的缓动；
     * easeOut：减速到0的缓动；
     * easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     * 其中Linear是无缓动效果，没有以上效果。
     * 
     * p,pos: current（当前）；
     * x: value（其他参数）；
     */
    var Transition = new J.Class({
        init:function(transition, params){
            params = J.array.toArray(params);
            
            var newTransition =  J.extend(transition, {
                //从0开始加速的缓动；
                easeIn: function(pos){
                    return transition(pos, params);
                },
                //减速到0的缓动；
                easeOut: function(pos){
                    return 1 - transition(1 - pos, params);
                },
                //前半段从0开始加速，后半段减速到0的缓动。
                easeInOut: function(pos){
                    return (pos <= 0.5) ? transition(2 * pos, params) / 2 : (2 - transition(2 * (1 - pos), params)) / 2;
                }
            });
            
            return newTransition;
        }
    });
    
    /**
     * 
     * 动画缓动公式
     * 
     * Linear：无缓动效果；
     * Quadratic：二次方的缓动（t^2）；
     * Cubic：三次方的缓动（t^3）；
     * Quartic：四次方的缓动（t^4）；
     * Quintic：五次方的缓动（t^5）；
     * Sinusoidal：正弦曲线的缓动（sin(t)）；
     * Exponential：指数曲线的缓动（2^t）；
     * Circular：圆形曲线的缓动（sqrt(1-t^2)）；
     * Elastic：指数衰减的正弦曲线缓动；
     * Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
     * Bounce：指数衰减的反弹缓动。
     * 
     * 每个效果都分三个缓动方式（方法），分别是：
     * easeIn：从0开始加速的缓动；
     * easeOut：减速到0的缓动；
     * easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     * 其中Linear是无缓动效果，没有以上效果。
     * 
     * p,pos: current（当前）；
     * x: value（其他参数）；
     *  
     * @memberOf fx
     * @namespace
     * @name transitions
     */
    var transitions = {
        /**
         * linear：无缓动效果；
         * @memberOf fx.transitions
         * @function
         * @name linear
         */ 
        linear: function(p){
            return p;
        },
        extend : function(newTransitions){
            for (var transition in newTransitions){
                this[transition] = new Transition(newTransitions[transition]);
            }
        }
    
    };
    

    
    
    transitions.extend(
    /**
     * @lends fx.transitions
     */
    {
        
        /**
         * pow：n次方的缓动（t^n）,n默认为6；
         */
        pow: function(p, x){
            return Math.pow(p, x && x[0] || 6);
        },
        
        /**
         * exponential：指数曲线的缓动（2^t）；
         */
        exponential: function(p){
            return Math.pow(2, 8 * (p - 1));
        },
        
        /**
         * circular：圆形曲线的缓动（sqrt(1-t^2)）；
         */
        circular: function(p){
            return 1 - Math.sin(Math.acos(p));
        },
    
        /**
         * sinusoidal：正弦曲线的缓动（sin(t)）；
         */
        sinusoidal: function(p){
            return 1 - Math.sin((1 - p) * Math.PI / 2);
        },
    
        /**
         * back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
         */
        back: function(p, x){
            x = x && x[0] || 1.618;
            return Math.pow(p, 2) * ((x + 1) * p - x);
        },
        
        /**
         * bounce：指数衰减的反弹缓动。
         */
        bounce: function(p){
            var value;
            for (var a = 0, b = 1; 1; a += b, b /= 2){
                if (p >= (7 - 4 * a) / 11){
                    value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                    break;
                }
            }
            return value;
        },
    
        /**
         * elastic：指数衰减的正弦曲线缓动；
         */
        elastic: function(p, x){
            return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
        }
    
    });

    // quadratic,cubic,quartic,quintic：2-5次方的缓动（t^5）；
    var pows = ['quadratic', 'cubic', 'quartic', 'quintic'];
    J.array.forEach(pows, function(transition, i){
        transitions[transition] = new Transition(function(p){
            return Math.pow(p, [i + 2]);
        });
    });
    
    
    
    /**
     * 节拍器类
     * @class 
     * @memberOf fx
     * @name Beater
     * @constructor
     * 
     * @param {Number} duration: 节拍时长，单位毫秒
     * @param {Number} loop: 循环次数,默认为1,0为无限循环
     * @param {Number} fps: fps你懂的
     * @return 节拍器实例
     */
    var Beater = new J.Class(
    /**
     * @lends fx.Beater.prototype
     */    
    {
        /**
         * @ignore
         */
        init : function(option){
            
            this.setOption(option);
        },

        setOption: function(option){
            this.option = option = J.extend({
                duration:500,
                loop:1,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:1000/(option && option.duration || 500)
            }, option);
        },
        
        start: function(){
            if (!this.check()){
                return this;
            }
            var option = this.option;
            this.time = 0;
            this.loop = option.loop;
            this.onStart.apply(this, arguments);
            this.startTimer();
            return this;
        },
        
        pause: function(){
            this.stopTimer();
            return this;
        },

        resume: function(){
            this.startTimer();
            return this;
        },

        end: function(){
            if (this.stopTimer()){
                this.onEnd.apply(this, arguments);
            }
            return this;
        },

        cancel: function(){
            if (this.stopTimer()){
                this.onCancel.apply(this, arguments);
            }
            return this;
        },

        onStart: function(){
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            $E.notifyObservers(this, "cancel");
        },

        onLoop: function(){
            $E.notifyObservers(this, "loop");
        },

        onBeater: function(){
            $E.notifyObservers(this, "beater");
        },

        check: function(){
            if (!this.timer){
                return true;
            }
            return false;
        },

        setDuration: function(duration){
            this.option.duration = duration || 500;
        },
        
        update: function(){
            var that = this,
                time = J.now(),
                option = that.option;
            if (time < that.time + that.option.duration){
                that.onBeater((time - that.time) / option.duration);
            } else {
                that.onBeater(1);
                that.onLoop();
                if(option.loop<=0 || --that.loop){
                    that.time = time;
                }else{
                    that.stopTimer();
                    that.onEnd();
                }
            }
        },

        stopTimer: function(){
            if (!this.timer){
                return false;
            }
            this.time = J.now() - this.time;
            this.timer = removeInstance(this);
            return true;
        },

        startTimer: function(){
            if (this.timer) return false;
            this.time = J.now() - this.time;
            this.timer = addInstance(this);
            return true;
        }
    });
    
    var instances = {}, timers = {};

    var loop = function(list){
        for (var i = list.length; i--;){
            if (list[i]){
                list[i].update();
            }
        }
    };

    var addInstance = function(instance){
        var fps = instance.option.fps,
            list = instances[fps] || (instances[fps] = []);
        list.push(instance);
        if (!timers[fps]){
            timers[fps] = setInterval(function(){
                loop(list);
            }, Math.round(1000 / fps));
        }
        return true;
    };

    var removeInstance = function(instance){
        var fps = instance.option.fps,
            list = instances[fps] || [];
        J.array.remove(list,instance);
        if (!list.length && timers[fps]){
            timers[fps] = clearInterval(timers[fps]);
        }
        return false;
    };
    
    
    
    /**
     * 动画类
     * @class 
     * @name Animation
     * @memberOf fx
     * @extends fx.Beater
     * 
     * @param {Element} element  动画的dom
     * @param {String} property  css 属性
     * @param {Mix} from  起始值
     * @param {Mix} to  到达值
     * @param {String} unit  单位
     * @param {Number} duration  动画时长，单位毫秒
     * @param {Number} loop  循环次数,默认为1,0为无限循环
     * @param {Function} transition  变化公式
     * @param {Number} fps  fps你懂的
     * @param {Function} css属性转换器
     * @return 动画实例
     */
    var Animation = new J.Class({extend:Beater},
    /**
     * @lends fx.Animation.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(option){
            Animation.superClass['init'].apply(this,arguments);
            this.option = this.option || {};
            option = J.extend(this.option, {
                element: null, 
                property: "", 
                from: 0, 
                to: 1,
                unit:false,
                transition: transitions.linear,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:25,
                converter:converter
            }, option);
            this.from = option.from;
            this.to = option.to;
        },

        getTransition: function(){
            var transition = this.option.transition || transitions.sinusoidal.easeInOut;
            return transition;
        },

        set: function(now){
            var option = this.option;
            this.render(option.element, option.property, now, option.unit);
            return this;
        },
        
        setFromTo: function(from, to){
            this.from = from;
            this.to = to;
        },
        
        render: function(element, property, value, unit){
            $D.setStyle(element, property, this.option.converter(value,unit));
        },

        compute: function(from, to, delta){
            return compute(from, to, delta);
        },

        onStart: function(from,to){
            var that = this;
            var option = that.option;
            that.from = J.isNumber(from) ? from : option.from;
            that.to = J.isNumber(to) ? to : option.to;
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            var that = this;
            var delta = that.option.transition(1);
            that.set(that.compute(that.from, that.to, delta));
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            var that = this;
            var delta = that.option.transition(0);
            that.set(that.compute(that.from, that.to, delta));
            $E.notifyObservers(this, "cancel");
        },

        onBeater: function(progress){
            var that = this;
            var delta = that.option.transition(progress);
            that.set(that.compute(that.from, that.to, delta));
        }
    });
    
    var compute = function(from, to, delta){
        return (to - from) * delta + from;
    };

    var converter = function(value,unit){
        return (unit) ? value + unit : value;
    };
    
    /**
     * TODO 这是原来的动画类, peli改了原来的动画类,抽出了节拍器, 
     * 但是新的动画类有问题,但是我没时间改, 就先用着旧的
     * by az , 2011-3-28
     * @ignore
     * 
     * @param {Element} element: 动画的dom
     * @param {String} property: css 属性
     * @param {Mix} from: 起始值
     * @param {Mix} to: 到达值
     * @param {String} unit: 单位
     * @param {Number} duration: 动画时长，单位毫秒
     * @param {Function} transition: 变化公式
     * @param {Number} fps: fps你懂的
     * 
     * @return 动画实例
     */
    var Animation2 = new J.Class({
        init : function(option){
            //el, style, begin, end, fx, total
            this.option = option = J.extend({
                element: null, 
                property: "", 
                from: 0, 
                to: 0,
                unit:false,
                duration:500,
                transition: transitions.linear,
                //不建议fps超过62，因为浏览器setInterval方法的限制，最小时间间隔是16ms，所以每秒实际帧速不能超过62帧
                fps:25
            }, option);
            
            this.from = option.from;
            this.to = option.to;
            

        },

        
        getTransition: function(){
            var transition = this.option.transition || transitions.sinusoidal.easeInOut;
            return transition;
        },
        update: function(){
            var that = this,
                time = J.now();
            var option = that.option;
            if (time < that.time + that.option.duration){
                var delta = option.transition((time - that.time) / option.duration);
                that.set(that.compute(that.from, that.to, delta));
            } else {
                that.set(that.compute(that.from, that.to, 1));
                that.end();
                
            }
        },

        set: function(now){
            var option = this.option;
            this.render(option.element, option.property, now, option.unit);
            return this;
        },
        
        setDuration: function(duration){
            this.option.duration = duration || 500;
        },
        
        setFromTo: function(from, to){
            this.from = from;
            this.to = to;
        },
        
        render: function(element, property, value, unit){
            value = (unit) ? value + unit : value;
            $D.setStyle(element, property, value);
        },

        compute: function(from, to, delta){
            return compute(from, to, delta);
        },

        check: function(){
            if (!this.timer){
                return true;
            }
            return false;
        },

        start: function(from, to){
            var that = this;
            if (!that.check(from, to)){
                return that;
            }
            var option = that.option;
            that.from = J.isNumber(from) ? from : option.from;
            that.to = J.isNumber(to) ? to : option.to;
            
            that.time = 0;
            that.startTimer();
            that.onStart();
            
            return that;
        },

        end: function(){
            if (this.stopTimer()){
                this.onEnd();
            }
            return this;
        },

        cancel: function(){
            if (this.stopTimer()){
                this.onCancel();
            }
            return this;
        },

        onStart: function(){
            $E.notifyObservers(this, "start");
        },

        onEnd: function(){
            $E.notifyObservers(this, "end");
        },

        onCancel: function(){
            $E.notifyObservers(this, "cancel");
        },

        pause: function(){
            this.stopTimer();
            return this;
        },

        resume: function(){
            this.startTimer();
            return this;
        },

        stopTimer: function(){
            if (!this.timer){
                return false;
            }
            this.time = J.now() - this.time;
            this.timer = removeInstance(this);
            return true;
        },

        startTimer: function(){
            if (this.timer) return false;
            this.time = J.now() - this.time;
            this.timer = addInstance(this);
            return true;
        }
    });
    
    J.fx.Beater = Beater;
    J.fx.Animation = Animation;
    J.fx.Animation2 = Animation2;
    J.fx.transitions = transitions;
});













