/**
 * 6.[Date part]: date 扩展包
 * 已移到J.format.date实现
 */
Jx().$package(function(J){
    
    /**
     * dom 名字空间
     * 
     * @namespace
     * @name date
     * @type Object
     */
    J.date = J.date || {};
    
    /**
     * 让日期和时间按照指定的格式显示的方法
     * 
     * @memberOf date
     * @name format
     * @function
     * @param {String} format 格式字符串
     * @return {String} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var d = new Date();
     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
     *     J.date.format(d, "YYYY-MM-DD hh:mm:ss");
     * };
     * 
     */
    J.date.format = J.format.date;
    
});
