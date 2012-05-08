JX(Javascript 扩展工具套件)
===================================================
站在巨人的肩上 Standing on shoulders of giants - [Tencent AlloyTeam](http://www.AlloyTeam.com/)

## 简介

JX 是模块化的非侵入式Web前端框架，开发于2008年，并于2009年开源于GoogleCode - [http://code.google.com/p/j-et/](http://code.google.com/p/j-et/)，于2012年切换到Github，开始我们开源计划的新征途，请记住我们的最新开源地址：[https://github.com/AlloyTeam/JX](https://github.com/AlloyTeam/JX)，谢谢大家来支持^_^。


JX 框架同时适用于 Web Page 和 Web App 项目的开发，特别适合构建和组织大规模、工业级的Web App，腾讯 WebQQ - [http://web.qq.com](http://web.qq.com)、腾讯 Q+ [http://www.QPlus.com](http://www.QPlus.com) 等产品都是采用JX框架开发，兼容目前所有主流浏览器。

## 命名含义
 * JX 是 Javascript eXtension tools 的缩写，即 Javascript 扩展工具套件的意思。


## 设计理念
 * 保持最优的执行效率
 * 保持 Javascript 原有的代码风格，降低学习难度
 * 更好的组织工业级 Javascript 应用程序
 * 探索在前端使用 MVP、MVC 等模式来构建大型 WebApp
 * 探索工业级 Javascript 的开发技术



## 特性

- 微内核设计：内核可完全分离出来，用于构建其他的框架
  
- 自由拼装各个模块

- 命名空间、原生对象零污染

- 无缝集成各种js框架：与jQuery, YUI, Mootools, Prototype.js 等框架无缝集成；与多种局部框架无缝集成，如：Mini, Sizzle, cssQuery, xpath, JSON 等等
  
- 多版本共存：如采用的Jx版本过旧，旧有的Javascript代码不能与新版本Jx兼容，则可以采用多版本共存的方式保持程序的可延续性

- 分层设计：Javascript核心层，与Javascript解释引擎无关的封装和扩展；浏览器端Javascript层，对浏览器中的Javascript引擎部分的封装和扩展


## 架构

第一层：*Core Javascript 扩展模块* / **代码组织模块**(可用于NodeJs等其他js引擎,轻松组织大型应用,无缝接入其它js库)
 
第二层：*Browser Javasccript 扩展模块*(跨浏览器,基础封装) / **可选模块**(设计模式相关模块,选择器模块...)
 
第三层：*UI 组件* / **实时动画模块** / **游戏引擎模块**


## 代码示范
- JX 代码组织方式一(传统)：

		var J = new Jx();
		J.out(J.version);
	
- JX 代码组织方式二(推荐)：

		Jx().$package(function(J){
			J.out(J.version);
		});



## 发展规划
 - **核心底层** - 纯Js底层功能封装/代码组织/无缝接入其它js库 - [完成]
 - **基础扩展** - 跨浏览器封装/工具函数/设计模式相关 - [完成]
 - **UI 基础控件** - 按钮/面板/窗口/树形列表/Tab/lightbox/widgets...
 - **实时动画系统** - 实时定时器/关键帧动画/加速度公式/物理引擎/声音控制器...
 - **游戏引擎** - 角色控制/地图系统/游戏异步通讯系统/寻路算法/键盘控制/人工智能/...
 

## 设计原则
- 不要重复自己（Don’t Repeat Yourself）
业界已经有很多优秀的局部框架，比如JSON、Mini Selector Engine、SWFObject、

## 谁在用JX
- [腾讯 WebQQ](http://web.qq.com)
- [腾讯 Q+](http://www.qplus.com)


## 感谢

感谢团队每一位成员做出的努力，有你我们会更精彩！


Tencent Alloy Team 2012
