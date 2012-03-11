JX(Javascript eXtension tools - Javascript 扩展工具库)
=======================================================
站在巨人的肩上 Standing on shoulders of giants

1. 简介
-------
JX 适用于 Web Page 和 Web App 的开发, 目前已经应用与WebQQ2.0和WebQQ3.0[http://web.qq.com/]等WebApp。



2. 特性
-------

* 微内核设计

  内核可完全分离出来，用于构建自己的框架
  
* 自由拼装各个模块

* 命名空间、原生对象零污染

* 无缝集成各种js框架

  与jQuery, YUI, Mootools, Prototype.js 等框架无缝集成
  与多种局部框架无缝集成，如：Mini, Sizzle, cssQuery, xpath, JSON 等等
  
* 多版本共存

  如采用的JET版本过旧，旧有的Javascript代码不能与新版本JET兼容，则可以采用多版本共存的方式保持程序的可延续性

* 分层设计

  Javascript核心层，与Javascript解释引擎无关的封装和扩展
  浏览器端Javascript层，对浏览器中的Javascript引擎部分的封装和扩展

3. 代码示范
-----------
* JET 代码组织方式一(传统)：

    var J = new Jet();
    J.out(J.version);
	
* JET 代码组织方式二(推荐)：

    Jet().$package(function(J){
        J.out(J.version);
    });

### JET设计理念
不要重复自己（Don’t Repeat Yourself）


//=========================================================

感谢 David Flanagan, John Resig, 以及QZFL, MooTools, YUI, Prototype, Dojo, ExtJs的作者们！


