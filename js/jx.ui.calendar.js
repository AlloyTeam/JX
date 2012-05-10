/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jet!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/**	
 * @description
 * Package: jet.calendar
 * 
 * Need package:
 * jet.core.js
 * 
 */


/**
 *  Yukin.2011-11-13
 *	3.[Javascript core]: calendar 日历类
 */
Jet().$package(function(J){
	var packageContext = this,
		$D = J.dom,
		$E = J.event,
		calendarCount = 1;
	/**
	 * calendar 名字空间
	 * 
	 * @namespace
	 * @name string
	 */
	var CalendarClass = function(){				
		var inputH = 20;
		var inputW = 100;
		var sUserAgent = navigator.userAgent;
		var isOpera = sUserAgent.indexOf("Opera") > -1;
		var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
		var _classContext = this,
			_dom = { main : null,//日历窗口dom
					 target : null, //获取值存放目标
					 title : null,//标题：显示当前年月
					 date : null, //天列表
					 
					 selectMonth : null,
					 selectYear: null
					},
			_now = {year: null, month: null, date: null},//随着选择变化的选中日期对象
			_today = null,//当日日期对象
			_hightList = [],//需要高亮的日期列表	
			_isOnlyHight = false,
			_callBack = null,//赋值后回调
			_timer = null,
			_needSelect = true;//对于日期和年是否需要支持下来选择
			
		function HS_DateAdd(interval,number,date){
			number = parseInt(number);
			if (typeof(date)=="string"){
				var date = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2]);
			}
			if (typeof(date)=="object"){
				var date = date;
			}
			switch(interval){
				case "y":return new Date(date.getFullYear()+number,date.getMonth(),date.getDate()); break;
				case "m":return new Date(date.getFullYear(),date.getMonth()+number,HS_checkDate(date.getFullYear(),date.getMonth()+number,date.getDate())); break;
				case "d":return new Date(date.getFullYear(),date.getMonth(),date.getDate()+number); break;
				case "w":return new Date(date.getFullYear(),date.getMonth(),7*number+date.getDate()); break;
			}
		}
		 
		function HS_checkDate(year,month,date){
			var enddate = ["31","28","31","30","31","30","31","31","30","31","30","31"];
			var returnDate = "";
			if (year%4==0){
				enddate[1]="29";
			}
			if (date>enddate[month]){
				returnDate = enddate[month];
			}else{
				returnDate = date;
			}
			return returnDate;
		}
		 
		function HS_WeekDay(date){
			var theDate;
			if (typeof(date)=="string"){
				theDate = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2]);
			}
			if (typeof(date)=="object"){
				theDate = date;
			}
			return theDate.getDay();
		}
		//设置当前日期对象(根据选择动态变化)
		function setNow( date ){
			var now;
			if (typeof(arguments[0])=="string"){
				var selectDate = arguments[0].split("-");
				var year = selectDate[0];
				var month = parseInt(selectDate[1])-1+"";
				var date = selectDate[2];
				now = new Date(year,month,date);
			}else if (typeof(arguments[0])=="object"){
				now = arguments[0];
			}
			_now.year = now.getFullYear();
			_now.month = now.getMonth();
			_now.date = now.getDate();
		}
		function HS_calender(){
			var lis = "";			 
			setNow(arguments[0]); 
			var yearMonthStr = _now.year+"-"+_now.month;	
			var lastMonthEndDate = HS_DateAdd("d","-1",yearMonthStr+"-01").getDate();
			var lastMonthDate = HS_WeekDay(yearMonthStr+"-01");
			var thisMonthLastDate = HS_DateAdd("d","-1",_now.year+"-"+(parseInt(_now.month)+1).toString()+"-01");
			var thisMonthEndDate = thisMonthLastDate.getDate();
			var thisMonthEndDay = thisMonthLastDate.getDay();
			
			var today = _today.getFullYear()+"-";
			var month = _today.getMonth() + 1;
			today += month < 10 ? '0' : '';
			today += month.toString() + '-';
			today += _today.getDate() < 10 ? '0'  : '';
			today += _today.getDate().toString();
			 //生成日期内容：可能存在三部分：上个月，当前月，下个月的		 
			 //上个月
            var i;
			for (i=0; i<lastMonthDate; i++){ // Last Month's Date
				lis = "<li class='lastMonthDate'>"+lastMonthEndDate+"</li>" + lis;
				lastMonthEndDate--;
			}
			//当前月	
			var month = parseInt(_now.month)+1;
			month = month < 10 ? '0' + month.toString() : month;
			
			for (i=1; i<=thisMonthEndDate; i++){ // Current Month's Date
				var date = i < 10 ? '0' + i.toString() : i;
				var dateStr = _now.year + "-" + month + "-" + date;
				var checkHight = checkHightLight(dateStr); 
				var hightClass = checkHight ? ' class="have"' : '';				
				var todayClass = today == dateStr ? ' class="today"' : '';	
				if( _isOnlyHight ){
					if( checkHight ){
						lis += "<li "+hightClass+"><a href='###' "+todayClass+" title='"+dateStr+"'>"+i+"</a></li>";	
					}else{
						lis += "<li "+hightClass+">"+i+"</li>";		
					}
				}else{
					lis += "<li "+hightClass+"><a href='###' "+todayClass+" title='"+dateStr+"'>"+i+"</a></li>";		
				}
			}
			//下个月
			var j=1;
			for (i=thisMonthEndDay; i<6; i++){ // Next Month's Date
				lis += "<li class='nextMonthDate'>"+j+"</li>";
				j++;
			}
			 
			//生成标题
			var CalenderTitle = "<a href='###' class='nextMonth' title='下一个月'>»</a>";
			CalenderTitle += "<a href='###' class='lastMonth' title='上一个月'>«</a>";
			CalenderTitle += "<span class='selectThisYear'><a href='###' class='toSelectYear' title='点击这里选择年份' >"+
							  _now.year+"</a></span>年<span class='selectThisMonth'>"+
							  "<a href='###' class='toSelectMonth' title='点击这里选择月份'>"+
							  (parseInt(_now.month)+1).toString()+"</a></span>月";
			if (arguments.length>1){				
				_dom.date.innerHTML = lis;
				_dom.title.innerHTML =  CalenderTitle;
				bindTitleClick();
				bindDateClick();
				bindSelectClick();
			}else{
				//日历内容框架
				var CalenderBox ="<div id='calender' class='calender'>\
									<div class='calenderTitle'>"+CalenderTitle+"</div>\
								    <div class='calenderBody'>\
										<ul class='day'>\
											<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>\
								  		</ul>\
										<ul class='date' id='thisMonthDate'>"+lis+"</ul>\
									</div>\
								    <div class='calenderBottom'>\
										<span><a href='###' class='closeCalender' >关闭</a><span></span>\
										<span><a href='###' class='calToToday' title='"+dateStr+"'>今天</a></span>\
								     	<span><a href='###' class='calEmptyInput' title=''>置空</a></span>\
									</div>\
								  </div>";
								  
				return CalenderBox;
			}
		}
		function _selectThisDay(dom){		
			if( _dom.target.tagName == 'INPUT' ){
				_dom.target.value = dom.title;	
			}else{
				_dom.target.innerHTML = dom.title;	
			}
			_callBack(dom.title);
			_classContext.close();
		}
		 
		function _setEmpty(d){
			if( _dom.target.tagName == 'INPUT' ){
				_dom.target.value = '';	
			}else{
				_dom.target.innerHTML = '';	
			}
			if( _dom.main ){
				$D.hide(_dom.main);
			}
		}
		//生成选择年的select列表
		function CalenderselectYear(obj){
			var opt = "";
			var thisYear = obj.innerHTML;
            var i;
			for (i=1970; i<=2020; i++){
				if (i==thisYear){
					opt += "<option value="+i+" selected>"+i+"</option>";
				}else{
					opt += "<option value="+i+">"+i+"</option>";
				}
			}
			opt = "<select class='selectYear'>"+opt+"</select>";
			obj.parentNode.innerHTML = opt;
			_dom.selectYear = $D.mini('.selectYear', _dom.title)[0];
			$E.on(_dom.selectYear , 'onblur', function(){
					selectThisYear(this);									
			});
			$E.on(_dom.selectYear ,  'change', function(){
					selectThisYear(this);									
			});
		}
		 
		function selectThisYear(obj){
			var month = '';
			if( _dom.selectMonth ){
				month = _dom.selectMonth.value;
			}else{
				month = obj.value+"-"+obj.parentNode.parentNode.getElementsByTagName("span")[1].getElementsByTagName("a")[0].innerHTML;
			}
			HS_calender(month + "-1", obj.parentNode);
		}
		 
		function CalenderselectMonth(obj){
			var opt = "";
			var thisMonth = obj.innerHTML;
            var i;
			for (i=1; i<=12; i++){
			if (i==thisMonth){
				opt += "<option value="+i+" selected>"+i+"</option>";
			}else{
				opt += "<option value="+i+">"+i+"</option>";
			}
			}
			opt = "<select class='selectMonth'>"+opt+"</select>";
			obj.parentNode.innerHTML = opt;
			_dom.selectMonth = $D.mini('.selectMonth', _dom.title)[0];
			$E.on(_dom.selectMonth , 'onblur', function(){
					selectThisMonth(this);									
			});
			$E.on(_dom.selectMonth, 'change', function(){
					selectThisMonth(this);									
			});
		}
		 
		function selectThisMonth(obj){ 
			var year = '';
			if( _dom.selectYear ){
				year = _dom.selectYear.value;
			}else{
				year = obj.parentNode.parentNode.getElementsByTagName("span")[0].getElementsByTagName("a")[0].innerHTML;
			}
			HS_calender(year+"-"+obj.value+"-1",obj.parentNode);
		}
		 //获取控件X坐标
		function getDefineX(objectId){	  
			var iPositionX=objectId.offsetLeft;  
			while(objectId=objectId.offsetParent){  	
				iPositionX+=objectId.offsetLeft;  	
			}
			return iPositionX;  
		}
		//获取控件Y坐标
		function getDefineY(objectId)  
		{
			var iPositionY=objectId.offsetTop;  
			while(objectId=objectId.offsetParent){
				iPositionY+=objectId.offsetTop;  
			}  
			return iPositionY;  
		}
		 
		var oSpanClick = function(oEvent){
			if(oEvent.type =="click"){
				if(isIE){
					oEvent = window.event;
					oEvent.returnValue = false;
				}else{
					oEvent.preventDefault();
				}
			}
		}
		 
		//绑定公共按钮
		var bindActClick = function(){
			//关闭
			$E.on($D.mini('.closeCalender', _dom.main)[0], 'click', _classContext.close );	
			//定位今天
			$E.on($D.mini('.calToToday', _dom.main)[0], 'click', function(){ _selectThisDay(this); } );	
			//清除输入
			$E.on($D.mini('.calEmptyInput', _dom.main)[0], 'click', function(){ _setEmpty(this); } );																	
			 									
		};
		//绑定日期点击
		var bindDateClick = function(){
			//绑定日期单击
			var domArr = $D.mini('a',_dom.date); 
			for(var key in domArr){ 
				$E.on( domArr[key], 'click', function(){ 
					_selectThisDay(this);							  
				});
			}
				
		};
		//绑定选择年月
		var bindSelectClick = function(){
			var toSelectYear  = $D.mini('.toSelectYear', _dom.title)[0];
			var toSelectMonth = $D.mini('.toSelectMonth', _dom.title)[0];
			if( !_needSelect ){
				toSelectYear.title = '';
				$D.setStyle(toSelectYear,'cursor','default');
				toSelectMonth.title = '';
				$D.setStyle(toSelectMonth,'cursor','default');
				return false;	
			}
			$E.on( toSelectYear, 'click', function(){ 
				CalenderselectYear(this);
			});				
			$E.on( toSelectMonth, 'click', function(){ 
				CalenderselectMonth(this);
			});	
		};
		//绑定标题点击项：上下月
		var bindTitleClick = function(){
			var tmpDate = _now.year+"-"+_now.month+"-"+_now.date; 
			$E.on( $D.mini('.nextMonth', _dom.title)[0], 'click', function(){ 
				HS_calender(HS_DateAdd('m', 1, tmpDate),this);
			});				
			$E.on( $D.mini('.lastMonth', _dom.title)[0], 'click', function(){ 
				HS_calender(HS_DateAdd('m', -1, tmpDate),this);
			});	
		};
		//判断日期是否在高亮列表中
		var checkHightLight = function(date){
			for(var key in _hightList ){
				if( _hightList[key] == date ){
					return true;	
				}
			}
			return false;			 
		};
		
		
		
		//关闭日历
		this.close = function( ){	
			if( _dom.main ){
				$D.hide(_dom.main);
			}
		};
		//显示日历
		this.show = function(){
			if( _dom.main ){
				$D.show(_dom.main);
				var targetObj = _dom.target;
				_dom.main.style.left = getDefineX(targetObj)+"px";			
				_dom.main.style.top = getDefineY(targetObj)+inputH+"px";
			}
		};
		//销毁日历
		this.destroy = function(){
			if( _dom.main ){
				_dom.main.parentNode.removeChild(_dom.main);
				_dom.main = null;
			}	
		};
		 
	 
		/*  设置日历 
		 *  targetObj:目标对象。可以为input、div  
		 *	opt:初始化参数:showBottom:是否显示日历操作按钮，
		 *					hightList:需要高亮的日期列表.格式：['2011-01-01','2011-01-05']
		 *					isOnlyHight:是否只有高亮的日期才可以点击
		 *					_needSelect:标题中的当前的年和月是否需要点击出现下拉选择列表,
		 *					today:今天的时间戳
		 *	callBack:targetObj赋值后回调此函数
		 *	
		 */
		this.setCalendar = function( targetObj, opt, callBack ){
			//首次生成日历，之后隐藏或显示调用日历
			/*_dom.main = $D.id('calenderspan');//document.getElementById('calenderspan');
			if(_dom.main == null){
				_dom.main = document.createElement("span");
				_dom.main.id = "calenderspan";
				_dom.main.innerHTML = HS_calender(new Date());
				_dom.main.style.position = "absolute";
				document.body.insertBefore(_dom.main,document.body.lastChild);
				bindActClick();
			}else{
				$D.show(_dom.main);//_dom.main.style.display = '';
			}*/
			//屏蔽鼠标点击事件
			/*if(isIE){
				_dom.main.attachEvent("onclick",oSpanClick);
			}else{
				_dom.main.addEventListener("click",oSpanClick,false);
				//inputObj.addEventListener("click",oSpanClick,false);
			}*/
			opt = opt || {};
			opt.showBottom = opt.showBottom || false;
			_hightList = opt.hightList || [];//高亮指定日期列表.dateList:{'2011-01-01','2010-01-02'}
			_isOnlyHight = opt.isOnlyHight || false;//是否只是高亮列表才可以点击
			_needSelect = J.isUndefined(opt.needSelect) ? true : opt.needSelect;
			opt.today = opt.today || 0;
			if( !J.isUndefined(callBack) ){
				_callBack = callBack;//设置成功后回调	
			}
			if( !_dom.main ){ 				 
				_dom.main = document.createElement("span");
				_dom.main.id = "calenderspan_" + ( calendarCount++ );
				_today = new Date();
				if( opt.today != 0 ){
					_today.setTime(opt.today);
				}
				_dom.main.innerHTML = HS_calender( _today ); ;
				_dom.main.className = 'calendarBox';//style.position = "absolute";
				_dom.main.style.display = 'none';
				document.body.insertBefore(_dom.main, document.body.lastChild);
				
				_dom.title  = $D.mini('.calenderTitle', _dom.main)[0];
				_dom.date = $D.mini('.date', _dom.main)[0];
				bindTitleClick();
				bindActClick();
				bindDateClick();
				bindSelectClick();
				if( !opt.showBottom ){
					if( _dom.main ){
						$D.hide( $D.mini('.calenderBottom', _dom.main)[0] );
					}
				}
				$E.on(_dom.main, 'mouseout',function(evt){ 
					var el = _dom.main;	
					var reltg = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;  
					try{
						var _ic = el.contains ? el != reltg && el.contains(reltg) : !!(el.compareDocumentPosition(reltg) & 16);    
						if(!_ic){
							_classContext.close();
						} 
					}catch(e){}
				});				 
			}
			_dom.target = targetObj;			 			
		}
		
		 
		
	};
	J.ui = J.ui || {};
	if(!J.ui.calendar ){
		J.ui.calendar = new CalendarClass;
	}
	//日历类，可以实例化多个
	J.ui.CalendarClass = CalendarClass;

});








