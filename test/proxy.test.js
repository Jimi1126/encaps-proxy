const Proxy = require("../src/Proxy");
const assert = require("assert");

let user = {
  name: "张三",
  age: 18,
  hobby: ["上网冲浪", "打豆豆"],
  getName: function() {
    return this.name;
  },
  study: function() {
    console.log("%s爱学习", this.name)
  }
}

let userPrxoy1 = new Proxy(user);
describe("非安全模式代理", ()=> {
  it("代理对象与原对象不相等", ()=> {
    assert.notDeepStrictEqual(user, userPrxoy1);
  });
  it("代理对象具备原对象所有属性与方法", ()=> {
    let proxyFields = Object.getOwnPropertyNames(userPrxoy1);
    let targetFields = Object.getOwnPropertyNames(user);
    assert.ok(targetFields.every((field)=> {return proxyFields.includes(field)}));
  });
  it("代理对象是对原对象的封装，属性按值传递到代理对象上，基本属性在代理修改后在原对象也有体现", ()=> {
    userPrxoy1.age = 19;
    assert.strictEqual(userPrxoy1.age, user.age);
  });
  it("代理对象是对原对象的封装，属性按值传递到代理对象上，引用属性指向相同地址", ()=> {
    assert.strictEqual(userPrxoy1.hobby, user.hobby);
  });
  it("代理对象是对原对象的封装，在函数上进行封装，可以添加了额外的定义，但结果一致", ()=> {
    assert.strictEqual(userPrxoy1.getName(), user.getName());
  });
  it("代理对象是对原对象的封装，在函数上进行封装，可以添加了额外的定义，但结果一致", ()=> {
    assert.strictEqual(userPrxoy1.getName(), user.getName());
  });
});

let userPrxoy2 = new Proxy(user, true);
describe("安全模式代理", ()=> {
  it("代理对象与原对象不相等", ()=> {
    assert.notDeepStrictEqual(user, userPrxoy2);
  });
  it("代理对象不具备原对象所有属性与方法", ()=> {
    let proxyFields = Object.getOwnPropertyNames(userPrxoy2);
    let targetFields = Object.getOwnPropertyNames(user);
    assert.ok(!targetFields.every((field)=> {return proxyFields.includes(field)}));
  });
  it("代理对象是对原对象的封装，不提供属性直接访问", ()=> {
    assert.strictEqual(userPrxoy2.age, undefined);
  });
  it("代理对象是对原对象的封装，提供属性get访问", ()=> {
    assert.strictEqual(userPrxoy2.getAge(), user.age);
  });
  it("代理对象是对原对象的封装，提供属性get访问，引用属性指向原对象", ()=> {
    assert.strictEqual(userPrxoy2.getHobby(), user.hobby);
  });
  it("代理对象是对原对象的封装，安全模式下函数与非安全模式下一致，可以添加了额外的定义，但结果一致", ()=> {
    assert.strictEqual(userPrxoy2.getName(), user.getName());
  });
});