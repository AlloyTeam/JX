/**
 * 7.[Number part]: number 扩展包
 * 已移到J.format.number实现
 */
Jx().$package(function(J){
    
    /**
     * number 名字空间
     * 
     * @namespace
     * @name number
     * @type Object
     */
    J.number = J.number || {};
    
    /**
     * 格式化数字显示方式
     * @param num 要格式化的数字
     * @param pattern 格式
     * @example 
     * J.number.format(12345.999,'#,##0.00');
     *  //out: 12,34,5.99
     * J.number.format(12345.999,'0'); 
     *  //out: 12345
     * J.number.format(1234.888,'#.0');
     *  //out: 1234.8
     * J.number.format(1234.888,'000000.000000');
     *  //out: 001234.888000
     */  
    J.number.format = J.format.number;
    
});
