/**
 * tab模块
 */
Jx().$package(function(J){
	var $ = J.dom.id,
		$D = J.dom,
		$E = J.event;
		
		
	/**
	 * Tab类
	 * 
	 * @memberOf ui
	 * 
	 * @param {Element} triggers tab head元素
	 * @param {Element} sheets tab body元素
	 * @param {Object} config 其他选项，如:isLimited,leftMargin...
	 * @returns
	 * 
	 * 
	 */
	J.ui = J.ui || {};
	J.ui.Tab = function(triggers,sheets,config){
		this.tabs = [];             //tab的集合
		this.currentTab = null;     //当前tab
		this.config = {
			defaultIndex : 0,       //默认的tab索引
			triggerEvent : 'click', //默认的触发事件
			slideEnabled : false,   //是否自动切换
			slideInterval : 5*1000,   //切换时间间隔
			slideDelay : 300,       //鼠标离开tab继续切换的延时
			autoInit : true,        //是否自动初始化
			onShow:function(){ }    //默认的onShow事件处理函数
		};
	
		this.setConfig(config);

		if(triggers && sheets) {
			this.addRange(triggers,sheets);
			if(this.config.autoInit){
				this.init();
			}
		}
	};
	
	J.ui.Tab.prototype = {
		/**
		 * 设置config
		 * @param {object} config 配置项如{'slideEnabled':true,'defaultIndex':0,'autoInit':false}
		 */
		setConfig:function(config){
			if(!config) return;
			for(var i in config){
				this.config[i] = config[i];
			}
		},
		/**
		 * 增加tab
		 * @param tab={trigger:aaaa, sheet:bbbb} 
		 * @param {string|HTMLElement} trigger
		 * @param {string|HTMLElement} sheet
		 * */
		add:function(tab){
			if(!tab) return;
			
			if(tab.trigger){
				this.tabs.push(tab);
				tab.trigger.style.display = 'block';
			}
		},
		
		/**
		 * 增加tab数组
		 * @param {array} triggers HTMLElement数组
		 * @param {array} sheets HTMLElement数组
		 * */
		addRange:function(triggers, sheets){
			if(!triggers||!sheets) return;
			if(triggers.length && sheets.length && triggers.length == sheets.length){
				for(var i = 0, len = triggers.length; i < len; i++){
					this.add({trigger:triggers[i],sheet:sheets[i]});
				}
			}
		},
		
		/**
		 * 设置tab为当前tab并显示
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		select:function(tab){
			if(!tab || (!!this.currentTab && tab.trigger == this.currentTab.trigger)) return;
			if(this.currentTab){
				$D.removeClass(this.currentTab.trigger, 'current');
				if(this.currentTab.sheet){
					this.currentTab.sheet.style.display = 'none';
				}
				
			}
			this.currentTab = tab;
			this.show();
		},
		
		/**
		 * 设置tab为隐藏的
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		remove:function(tab){
			if(!tab) return;
			
			
			if(tab.trigger){
				$D.removeClass(tab.trigger, 'current');
				tab.trigger.style.display = 'none';
			}
			if(tab.sheet){
				tab.sheet.style.display = 'none';
			}
			
			var index=this.indexOf(tab);
			this.tabs.splice(index,index);
	
			if(tab.trigger == this.currentTab.trigger){
				if(index==0){
					//this.currentTab=this.tabs[(index+1)];
					this.select(this.tabs[(index+1)]);
				}else{
					//this.currentTab=this.tabs[(index-1)];
					this.select(this.tabs[(index-1)]);
				}
			}
		},
		/**
		 * 显示当前被选中的tab
		 * */
		show:function(){
			
			if(this.currentTab.trigger){
				this.currentTab.trigger.style.display = 'block';
			}
			$D.addClass(this.currentTab.trigger, 'current');
			if(this.currentTab.sheet){
				this.currentTab.sheet.style.display = 'block';
			}
			//触发自定义显示对象
			//tealin
			this.config.onShow.call(this);
			$E.notifyObservers(this, "show", this.currentTab);

		},
		/**
		 * 自动切换
		 * */
		slide:function(){
			var	config = this.config,
				_this = this,
				intervalId,
				delayId;
			J.array.forEach(this.tabs, function(tab, index, tabs){
				$E.on(tab.trigger, 'mouseover' , clear);
				$E.on(tab.sheet, 'mouseover' , clear);
				
				$E.on(tab.trigger, 'mouseout' , delay);
				$E.on(tab.sheet, 'mouseout' , delay);
			});
			start();
			function start() {
				var i = _this.indexOf(_this.currentTab);
				if( i == -1 ) return;
				intervalId = window.setInterval(function(){
					var tab = _this.tabs[ ++i % _this.tabs.length ];
					if(tab){
						_this.select(tab);
					}
				},config['slideInterval']);
			}
			function clear() {
				window.clearTimeout(delayId);
				window.clearInterval(intervalId);	
			}
			function delay() {
				delayId = window.setTimeout(start,config['slideDelay']);
			}
		},
		/**
		* 切换到下一个
		**/
		next:function(){
			var _this = this;
			var i = _this.indexOf(_this.currentTab);
			if(i == -1) return;
			if(++i == _this.tabs.length){
				i = 0;
			}
			var tab = _this.tabs[i];
			if(tab){
				_this.select(tab);
			}
		},
		/**
		* 切换到上一个
		**/
		prev:function(){
			var _this = this;
			var i = _this.indexOf(_this.currentTab);
			if(i == -1) return;
			if(--i == -1){
				i = _this.tabs.length - 1;
			}
			var tab = _this.tabs[i];
			if(tab){
				_this.select(tab);
			}
		},
		/**
		 * 获取tab在tabs数组中的索引
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		indexOf:function(tab){
			for(var i = 0, len = this.tabs.length; i < len; i++){
				if(tab.trigger == this.tabs[i].trigger)
					return i;
			}
			return -1;
		},
		/**
		 * 初始化函数
		 * */
		init:function(){
			var config = this.config,
				_this = this;

			J.array.forEach(this.tabs, function(tab, index, tabs){
				$E.on(tab.trigger,config['triggerEvent'], function(){
					_this.select.call(_this,tab);
				});
				if(tab.sheet){
					tab.sheet.style.display = 'none';
				}
			});
			
			this.select(this.tabs[config['defaultIndex']]);
			if(config['slideEnabled']){
				this.slide();
			}
		}
	};

});
