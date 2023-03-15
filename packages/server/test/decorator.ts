// 类装饰器
function classDecorator (constructor: Function){
  console.log('类装饰器')
  
}

// 属性装饰器
function attrDecorator (){
  console.log('属性装饰器')
}

// 方法装饰器
function methodsDecorator (){
  console.log('方法装饰器')
}

// 参数装饰器
function argumentDecorator (target:any, name:string ,index: number){
  console.log('参数装饰器', index)
}


// 类装饰器
@classDecorator
class Person4 {
  // 属性装饰器
  @attrDecorator
  name: string

  // 方法装饰器(参数装饰器)
  @methodsDecorator
  sayHello(@argumentDecorator name:string , @argumentDecorator age:number){
    console.log('name', name, age)
  }

}

/*
 装饰器执行顺序:
      属性装饰器
      参数装饰器 1
      参数装饰器 0
      方法装饰器
      类装饰器
*/
