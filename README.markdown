JX(Javascript eXtension tools - Javascript 扩展工具库)
=======================================================
站在巨人的肩上 Standing on shoulders of giants

### 简介

JX 是模块化的Web前端框架，创建于2008年，不仅适用于 Web Page 项目，也适用当前流行的Web App项目, JX兼容全部主流浏览器，包括非常不情愿的IE6。


### 特性

- 微内核设计：内核可完全分离出来，用于构建自己的框架
  
- 自由拼装各个模块

- 命名空间、原生对象零污染

- 无缝集成各种js框架：与jQuery, YUI, Mootools, Prototype.js 等框架无缝集成；与多种局部框架无缝集成，如：Mini, Sizzle, cssQuery, xpath, JSON 等等
  
- 多版本共存：如采用的Jx版本过旧，旧有的Javascript代码不能与新版本Jx兼容，则可以采用多版本共存的方式保持程序的可延续性

- 分层设计：Javascript核心层，与Javascript解释引擎无关的封装和扩展；浏览器端Javascript层，对浏览器中的Javascript引擎部分的封装和扩展

### 代码示范
- JX 代码组织方式一(传统)：

		var J = new Jx();
		J.out(J.version);
	
- JX 代码组织方式二(推荐)：

		Jx().$package(function(J){
			J.out(J.version);
		});

### 设计理念
- 不要重复自己（Don’t Repeat Yourself）

### 谁在用JX
- [腾讯 WebQQ](http://web.qq.com)
- [腾讯 Q+](http://www.qplus.com)



### 感谢

感谢团队每一位成员做出的努力，有你我们会更精彩！


