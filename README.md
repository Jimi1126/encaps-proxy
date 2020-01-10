# 概述
当你的对象（或第三方引用对象）需要扩展功能时，而你并不想在原有对象定义上做修改时，或者当你提供对象给他人使用时不希望更改对象里面的数据时，你可以尝试一下本模块。
# 开始
> npm install enc-proxy -save
# 测试
> npm run test
```
> mocha



  非安全模式代理
    √ 代理对象与原对象不相等
    √ 代理对象具备原对象所有属性与方法
    √ 代理对象是对原对象的封装，属性按值传递到代理对象上，基本属性在代理修改后在原对象也有体现
    √ 代理对象是对原对象的封装，属性按值传递到代理对象上，引用属性指向相同地址
    √ 代理对象是对原对象的封装，在函数上进行封装，可以添加了额外的定义，但结果一致
    √ 代理对象是对原对象的封装，在函数上进行封装，可以添加了额外的定义，但结果一致

  安全模式代理
    √ 代理对象与原对象不相等
    √ 代理对象不具备原对象所有属性与方法
    √ 代理对象是对原对象的封装，不提供属性直接访问
    √ 代理对象是对原对象的封装，提供属性get访问
    √ 代理对象是对原对象的封装，提供属性get访问，引用属性指向原对象
    √ 代理对象是对原对象的封装，安全模式下函数与非安全模式下一致，可以添加了额外的定义，但结果一致


  12 passing (9ms)
  ```
# Demo
使用encaps-proxy对数据库操作进行代理以实现日志记录，这里使用coffee编写的代码
```
Proxy = require "encaps-proxy"
LOG = global["mongoLogger"] || console
###
# 数据库操作层代理
###
class DBProxy extends Proxy
	constructor: (target)->
		super(target)
	proxy: (f)->
		that = @
		if f.name is "connect"
			return ->
				f.apply that.target, arguments
		->
			[...params] = arguments
			callback = params.pop()
			startTime = moment()
			paramStr = ""
			paramStr = (JSON.stringify(p) for p in params).join ","
			paramStr = if paramStr.length > 100 then paramStr.substring(0, 100) + "..." else paramStr
			params.push ->
				endTime = moment()
				LOG.info "#{that.target.constructor.name}.#{f.name}:#{paramStr}  --#{endTime - startTime}ms"
				callback.apply @, arguments
			try
				f.apply that.target, params
			catch e
				(LOG.trace || LOG.error)("#{that.target.constructor.name}.#{f.name}:#{paramStr}  --#{moment() - startTime}ms\n#{e.stack}")
				callback e
module.exports = DBProxy
```
当在进行数据库Dao对象获取时进行代理
```
const proxy = new DBProxy (new DBHandler(option));
proxy.insert(...) //这将产生日志
...
```
# 优化
后续
# 更新日志
时间|版本|内容
--|--|--
2020/01/10|1.0.0|新增

# 免责声明
本工具仅用于学习交流使用，禁止用于商业用途，使用本工具所造成的的后果由使用者承担！
有疑问请 mail to: [xfqing_mid@163.com](https://links.jianshu.com/go?to=mailto%3Axfqing_mid%40163.com)
