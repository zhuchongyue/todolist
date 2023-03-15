

function record(args: any) {
  console.log('hhhhhhhhhh: ', args)
}

// 装饰器
function classDecorator<T extends {new (...args:any[]):{}}>(constructor: T){

   // 表达式的写法
  //  constructor.prototype.recordMethods = [];
  console.log('constructor.prototype.recordMethods : ', constructor.prototype.recordMethods )

  constructor.prototype.recordMethods.forEach((name: string) => {
    const oldMethod = constructor.prototype[name]
    constructor.prototype[name] = (...args: any[]) => {
      oldMethod(args)
      record(args)
    }
  }) 

  // const oldSayHello = constructor.prototype.sayHello

  // constructor.prototype.sayHello = (...args: any[]) =>{
  //   oldSayHello(args)
  //   console.log('重载, sayHello', ...args)
  // }

  // constructor.prototype.newMethod = (...args: any[]) => {
  //   console.log('newMethod: ')
  // }
}

function methodDecorator() {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // descriptor.enumerable = value;
    // target.
    console.log('methodDecorator: ')
    if (!target.recordMethods) {
      target.recordMethods = [];
    }
    console.log('methodDecorator 1 : ', target.recordMethods)
    target.recordMethods.push(propertyKey)
    
  };
}

// 装饰类
@classDecorator
class Person {
  // 属性
  name :string;
  age = 18;

  constructor(name:string){
    this.name = name
  }

  // 方法
  @methodDecorator()
  sayHello(name: string){
    console.log('Person sayHello: ', name)
  }

  @methodDecorator()
  sayLove(sign: string) {
    console.log('Person sayLove: ', sign)
  }
}

// 实例化
const student = new Person('jack')
// console.log(student.name)
// // jack
// console.log(student.age)
// // @ts-ignore
// console.log(student.hobby)
// ts报错类型: 类型“Person”上不存在属性“hobby”。。
// 但编译后依然打印结果:读书

// console.log(student)
/*
class_1 {
  age: 18
  hobby: "读书"
  name: "jack"
}
*/

// 调用sayHello 只会答应重载的方法
student.sayHello('JACK')
student.sayLove('XTL caoni')
// 重载, sayHello





// // 普通方法 target对应类的prtotype, key是装饰的方法的名字, descriptor就是函数的属性的控制
// // 静态方法 target对应的是类的构造函数
// function functionDecorator (target: any, key: string, descriptor: PropertyDescriptor ) {
//   console.log('functionDecorator: ', functionDecorator)
//   // 可以被重写
//   descriptor.writable = true;
//   // 对方法进行变更,getName就变了
//   descriptor.value = function () {
//       return 'test descriptor';
//   }
// }

// class Test{
//   name: string;
//   constructor (name: string) {
//       this.name = name;
//   }
//   // 在类创建的时候 就会对类的方法进行装饰
//   @functionDecorator
//   getName() {
//       return this.name
//   }
// }

// const test1 = new Test('paul');
// test1.getName = () => {
//   return 'test getName';
// }
// // 输出test descriptor
// console.info(test1.getName());


// // // @experimentalDecorators
// // function first() {
// //   console.log("first(): factory evaluated: ", arguments);
// //   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
// //     console.log("first(): called", Object.keys(target));
// //   };
// // }

// // function second() {
// //   console.log("second(): factory evaluated");
// //   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
// //     console.log("second(): called");
// //   };
// // }

// // class ExampleClass {
// //   @first()
// //   @second()
// //   method(name: string) {
// //     console.log('method name: ', name)
// //   }
// // }

// // const e = new ExampleClass()

// // e.method('Tom')