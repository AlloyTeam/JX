/**
 * 3.[Browser part]: Browser 资料分析包
 */
Jx().$package(function(J){
    J.browserOptions = {
        adjustBehaviors: true,
        htmlClass: true
    };
    //J.query = J.string.mapQuery(window.location.search);
    J.host = window.location.host;
    
    // 设置 domain
    // document.domain = 'kdv.cn';
    
    
    var pf = navigator.platform.toLowerCase(),
        ua = navigator.userAgent.toLowerCase(),
        plug = navigator.plugins,
        
        platform,
        browser,
        engine,

        toFixedVersion,
        s;
    
    /**
     * @ignore
     * @param String ver
     * @param Number floatLength
     * @return Number 
     */
    toFixedVersion = function(ver, floatLength){
        ver= (""+ver).replace(/_/g,".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    };
    
    /**
     * platform 名字空间
     * 
     * @namespace
     * @name platform
     * @type Object
     */
    platform = {
        getPlatform:function(){
            return pf;
        },
        
        /**
         * 操作系统的名称
         * 
         * @property name
         * @memberOf platform
         */
        name: (window.orientation != undefined) ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
        
        version: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * iPod touch
         * Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPod: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPad:0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0_1 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A400 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPhone:0,
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        android:0,
        
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        win: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        linux: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        mac: 0,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    platform[platform.name] = true;
    
    // 探测操作系统版本
    (s = ua.match(/windows ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/windows nt ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/linux ([\d.]+)/)) ? platform.set("linux",toFixedVersion(s[1])) :
    (s = ua.match(/mac ([\d.]+)/)) ? platform.set("mac",toFixedVersion(s[1])):
    (s = ua.match(/ipod ([\d.]+)/)) ? platform.set("iPod",toFixedVersion(s[1])):
    (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? platform.set("iPad",toFixedVersion(s[1])):
    (s = ua.match(/iphone ([\d.]+)/)) ? platform.set("iPhone",toFixedVersion(s[1])):
    (s = ua.match(/android ([\d.]+)/)) ? platform.set("android",toFixedVersion(s[1])) : 0;
    
    /**
     * browser 名字空间
     * 
     * @namespace
     * @name browser
     */
    browser = {
        /**
         * @namespace
         * @name features
         * @memberOf browser
         */
        features: 
        /**
         * @lends browser.features
         */    
        {
            /**
             * @property xpath
             */
            xpath: !!(document.evaluate),
            
            /**
             * @property air
             */
            air: !!(window.runtime),
            
            /**
             * @property query
             */
            query: !!(document.querySelector)
        },
        
        /**
         * 获取浏览器的插件信息
         * 
         */
        getPlugins: function(){
            return plug;
        },
        
        /**
         * @namespace
         * @name plugins
         * @memberOf browser
         */
        plugins: 
        /**
         * @lends browser.plugins
         */    
        {
            flash: (function(){
                //var ver = "none";
                var ver = 0;
                if (plug && plug.length) {
                    var flash = plug['Shockwave Flash'];
                    if (flash && flash.description) {
                        ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
                    }
                } else {
                    var startVer = 13;
                    while (startVer--) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                            ver = toFixedVersion(startVer);
                            break;
                        } catch(e) {}
                    }
                }
                
                return ver;
            })()
        },
        
        
        
        /**
         * 获取浏览器的userAgent信息
         * 
         * @memberOf browser
         */
        getUserAgent: function(){
            return ua;
        },
        
        /**
         * 用户使用的浏览器的名称，如：chrome
         * 
         * 
         * @description {String} 用户使用的浏览器的名称，如：chrome
         * @type Number
         */
        name: "unknown",
        
        /**
         * 浏览器的版本
         * @property version
         * @memberOf browser
         */
        version: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        ie: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        firefox: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        chrome: 0,
        
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        opera: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        safari: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        mobileSafari: 0,
        
        /**
         * 用户使用的是否是adobe 的air内嵌浏览器
         */
        adobeAir: 0,
        
        /**
         * 是否支持css3的borderimage
         * 
         * @description {boolean} 检测是否支持css3属性borderimage
         */
        //borderimage: false,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    // 探测浏览器并存入 browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
    (s = ua.match(/adobeair\/([\d.]+)/)) ? browser.set("adobeAir",toFixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;

    //mobile safari 判断，可与safari字段并存
    (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? browser.set("mobileSafari",toFixedVersion(s[1])) : 0;
    if(platform.iPad) browser.set('mobileSafari', '0.0');
    
    //browser.set("borderimage",browser.firefox>3 || browser.safari || browser.chrome);
    
    if(browser.ie){
        if(!document.documentMode) document.documentMode=Math.floor(browser.ie);
        else if(document.documentMode!==Math.floor(browser.ie)) browser.set("ie",toFixedVersion(document.documentMode));
    }
    
    //J.out(browser.name);
    //J.out(browser.ua);
    
    //!!navigator.userAgent.match(/Apple.*Mobile.*Safari/);
    
    /**
     * engine 名字空间
     * 
     * @namespace
     * @name engine
     * @memberOf browser
     */
    engine = {
        /**
         * 浏览器的引擎名字
         * 
         * @memberOf browser.engine
         */
        name: 'unknown',
        
        /**
         * 浏览器的引擎版本
         * 
         * @memberOf browser.engine
         */
        version: 0,
        
        /**
         * trident 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        trident: 0,
        
        /**
         * gecko 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * 
         */
        gecko: 0,
        
        /**
         * webkit 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        webkit: 0,
        
        /**
         * presto 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * @property presto
         */
        presto: 0,
        
        /**
         * 设置浏览器引擎的类型和版本
         * @ignore
         * @memberOf browser.engine
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
        
    };
    
    /*
    // 探测浏览器的内核并存入 browser.engine 对象
    (s = (!window.ActiveXObject) ? 0 : ((window.XMLHttpRequest) ? 5 : 4)) ? engine.set("trident", s):
    (s = (document.getBoxObjectFor == undefined) ? 0 : ((document.getElementsByClassName) ? 19 : 18)) ? engine.set("gecko",s) :
    (s = (navigator.taintEnabled) ? false : ((browser.features.xpath) ? ((browser.features.query) ? 525 : 420) : 419)) ? engine.set("webkit", s) :
    (s = (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925))) ? engine.set("presto", s) : 0;
    */
    
    // 探测浏览器的内核并存入 browser.engine 对象
    
    (s = ua.match(/trident\/([\d.]+)/)) ? engine.set("trident",toFixedVersion(s[1])):
    (s = ua.match(/gecko\/([\d.]+)/)) ? engine.set("gecko",toFixedVersion(s[1])) :
    (s = ua.match(/applewebkit\/([\d.]+)/)) ? engine.set("webkit",toFixedVersion(s[1])) :
    (s = ua.match(/presto\/([\d.]+)/)) ? engine.set("presto",toFixedVersion(s[1])) : 0;
    
    if(browser.ie){
        if(browser.ie == 6){
            engine.set("trident", toFixedVersion("4"));
        }else if(browser.ie == 7 || browser.ie == 8){
            engine.set("trident", toFixedVersion("5"));
        }
    }
    
    
    /**
     * 调整浏览器行为
     * 
     * @ignore
     */
    var adjustBehaviors = function() {
        // ie6 背景图片不能被缓存的问题
        if (browser.ie && browser.ie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            }catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
    }
    
    if(J.browserOptions.adjustBehaviors){
         adjustBehaviors();
    }
    
    var filterDot = function(string){
        //return J.string.replaceAll(string, "\.", "_");
        return String(string).replace(/\./gi,"_");
    };
    
    // 给html标签添加不同浏览器的参数className
    var addHtmlClassName = function() {
        var htmlTag = document.documentElement;
        var htmlClassName = [htmlTag.className];
        htmlClassName.push('javascriptEnabled');
        htmlClassName.push(platform.name);
        htmlClassName.push(platform.name + filterDot(platform.version));
        htmlClassName.push(browser.name);
        htmlClassName.push(browser.name + filterDot(browser.version));
        if(document.documentMode){
            htmlClassName.push('documentMode_' + document.documentMode);
        }
        htmlClassName.push(engine.name);
        htmlClassName.push(engine.name + filterDot(engine.version));
        
        if(browser.plugins.flash){
            htmlClassName.push("flash");
            htmlClassName.push("flash" + filterDot(browser.plugins.flash));
        }
        if(typeof(window['webTop']) != 'undefined' && window['webTop']) {
             htmlClassName.push("webTop");
        }
        htmlTag.className = htmlClassName.join(' ');
       
    }

    
    if(J.browserOptions.htmlClass){
        addHtmlClassName();
    }
    
    J.platform = platform;
    J.browser = browser;
    J.browser.engine = engine;
});
