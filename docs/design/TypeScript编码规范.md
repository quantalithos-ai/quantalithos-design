# TypeScript 编码规范

> 基于 [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)（2024-02-29 中文版）整理，
> 每条规则均附 **✅ 正确做法** 与 **❌ 错误做法**，方便团队 Code Review 时直接引用。

---

## 一、命名规范

### 1.1 标识符命名法

| 命名法 | 适用范围 | 示例 |
|--------|---------|------|
| UpperCamelCase（帕斯卡） | 类、接口、类型、枚举、装饰器、类型参数 | `UserService`、`TodoItem` |
| lowerCamelCase（驼峰） | 变量、参数、函数、方法、属性、模块别名 | `loadHttpUrl`、`firstName` |
| CONSTANT_CASE（全大写下划线） | 全局常量、枚举值、静态只读属性 | `MAX_RETRY_COUNT`、`HttpStatus.OK` |

#### ✅ 正确做法

```typescript
class UserProfile { ... }
interface OrderStorage { ... }
type CoffeeResponse = Latte | Americano;
const MAX_CONNECTIONS = 10;
enum Direction { UP, DOWN, LEFT, RIGHT }
```

#### ❌ 错误做法

```typescript
class user_profile { ... }       // 类应使用 UpperCamelCase
interface IOrderStorage { ... }  // 不要加 I 前缀
type coffeeResponse = ...;       // 类型应使用 UpperCamelCase
const maxConnections = 10;       // 全局常量应使用 CONSTANT_CASE
```

### 1.2 缩写视为一个词

缩写应作为一个整体单词处理，不要全大写。

#### ✅ 正确做法

```typescript
function loadHttpUrl() { ... }
function parseXmlStream() { ... }
```

#### ❌ 错误做法

```typescript
function loadHTTPURL() { ... }
function parseXMLStream() { ... }
```

### 1.3 禁止使用 `_` 前缀/后缀

#### ✅ 正确做法

```typescript
class Foo {
  private bar: string;       // 使用 private 修饰符
  constructor(private baz: Baz) {}
}
// 忽略不需要的元素使用额外逗号
const [a, , b] = [1, 5, 10];
```

#### ❌ 错误做法

```typescript
class Foo {
  private _bar: string;      // 不要加 _ 前缀
  private baz_: Baz;         // 不要加 _ 后缀
}
const _ = unusedValue;       // 禁止使用单下划线标识符
```

### 1.4 导入模块命名空间

导入模块命名空间使用 lowerCamelCase，文件名使用 snake_case。

#### ✅ 正确做法

```typescript
import * as fooBar from './foo_bar';
import * as $ from 'jquery';       // 例外：jQuery 的 $ 约定
```

#### ❌ 错误做法

```typescript
import * as foo_bar from './foo_bar';  // 命名空间不要用 snake_case
import * as FooBar from './foo_bar';   // 命名空间不要用 UpperCamelCase
```

### 1.5 命名应具有描述性

#### ✅ 正确做法

```typescript
function findUserById(id: number): User { ... }
const elapsedTimeInMs = calculateElapsed(start, end);
// 不超过 10 行的作用域中可使用短变量名
for (let i = 0; i < arr.length; i++) { ... }
```

#### ❌ 错误做法

```typescript
function fub(id: number): User { ... }           // 含义不清
const e = calculateElapsed(start, end);           // 缩写无意义
```

---

## 二、文件编码与注释

### 2.1 文件编码使用 UTF-8

#### ✅ 正确做法

```typescript
const units = 'μs';                              // 易读，直接使用 Unicode 字符
const output = '\ufeff' + content;               // 非输出字符使用转义 + 注释
```

#### ❌ 错误做法

```typescript
const units = '\u03bcs';                         // 即使有注释也不直观
const output = '\ufeff' + content;               // 省略注释，读者无法理解
```

### 2.2 JSDoc vs 普通注释

- **JSDoc `/** ... */`** 用于文档（面向使用者）
- **行注释 `// ...`** 用于实现说明（面向维护者）

#### ✅ 正确做法

```typescript
/**
 * 发送 POST 请求，开始煮咖啡
 * @param amountLitres 煮咖啡的量，注意和煮锅的尺寸对应！
 */
brew(amountLitres: number, logger: Logger) { ... }

// 这个实现煮出来的咖啡味道差极了
// TODO(b/12345): 优化煮咖啡的过程
```

#### ❌ 错误做法

```typescript
/** @param fooBarService Foo 应用的 Bar 服务 */   // 照抄参数名，没有额外信息
// 下面这段代码是用户服务
```

### 2.3 对所有导出的顶层模块进行注释

#### ✅ 正确做法

```typescript
/** 用户配置管理器，负责加载和持久化用户偏好设置 */
export class UserConfigManager { ... }
```

#### ❌ 错误做法

```typescript
export class UserConfigManager { ... }            // 导出的顶层符号缺少文档
```

### 2.4 省略对 TypeScript 多余的注释

#### ✅ 正确做法

```typescript
class Foo implements Bar { ... }                  // implements 已经说明
enum Direction { UP, DOWN }                       // enum 已经说明
private helper(): void { ... }                    // private 已经说明
```

#### ❌ 错误做法

```typescript
/** @implements Bar */ class Foo implements Bar { ... }
/** @enum {number} */ enum Direction { UP, DOWN }
/** @private */ private helper(): void { ... }
```

### 2.5 不要使用 @override

#### ✅ 正确做法

```typescript
class Child extends Parent {
  doSomething(): void { ... }     // TypeScript 编译器自身会检查 override
}
```

#### ❌ 错误做法

```typescript
class Child extends Parent {
  /** @override */
  doSomething(): void { ... }     // @override 不是编译器强制的，容易不一致
}
```

### 2.6 将文档置于装饰器之前

#### ✅ 正确做法

```typescript
/** 打印 "bar" 的组件。 */
@Component({
  selector: 'foo',
  template: 'bar',
})
export class FooComponent {}
```

#### ❌ 错误做法

```typescript
@Component({
  selector: 'foo',
  template: 'bar',
})
/** 打印 "bar" 的组件。 */                      // JSDoc 禁止放在装饰器和类之间
export class FooComponent {}
```

---

## 三、语言特性

### 3.1 可见性：省略多余的 public

#### ✅ 正确做法

```typescript
class Foo {
  bar = new Bar();                  // 默认 public，省略修饰符
  constructor(public baz: Baz) {}   // public 且非 readonly 的参数属性可使用 public
}
```

#### ❌ 错误做法

```typescript
class Foo {
  public bar = new Bar();           // 不需要 public 修饰符
  constructor(public readonly baz: Baz) {}  // readonly 已隐含 public
}
```

### 3.2 构造函数必须使用括号

#### ✅ 正确做法

```typescript
const x = new Foo();
```

#### ❌ 错误做法

```typescript
const x = new Foo;                  // 即使无参数也必须加括号
```

### 3.3 省略不必要的构造函数

#### ✅ 正确做法

```typescript
class DefaultConstructor { }                              // 编译器提供默认构造函数
class ParameterProperties {
  constructor(private myService: MyService) {}            // 参数属性不能省略
}
class NoInstantiation {
  private constructor() {}                                // 私有构造函数不能省略
}
```

#### ❌ 错误做法

```typescript
class UnnecessaryConstructor {
  constructor() {}                                        // 空构造函数不需要
}
class UnnecessaryOverride extends Base {
  constructor(value: number) { super(value); }            // 仅调用 super 不需要
}
```

### 3.4 不要使用 #private 语法

#### ✅ 正确做法

```typescript
class Clazz {
  private ident = 1;
}
```

#### ❌ 错误做法

```typescript
class Clazz {
  #ident = 1;                       // #private 语法有体积/性能/兼容性问题
}
```

### 3.5 使用 readonly 标记不可变属性

#### ✅ 正确做法

```typescript
class Foo {
  private readonly barService: BarService;
  readonly name: string = 'default';
}
```

#### ❌ 错误做法

```typescript
class Foo {
  private barService: BarService;   // 构造函数外不被修改应加 readonly
  name: string = 'default';         // 只读属性应加 readonly
}
```

### 3.6 使用参数属性简化构造函数

#### ✅ 正确做法

```typescript
class Foo {
  constructor(private readonly barService: BarService) {}
}
```

#### ❌ 错误做法

```typescript
class Foo {
  private readonly barService: BarService;
  constructor(barService: BarService) {
    this.barService = barService;    // 冗余的显式赋值
  }
}
```

### 3.7 声明时直接初始化字段

#### ✅ 正确做法

```typescript
class Foo {
  private readonly userList: string[] = [];  // 声明即初始化，省略构造函数
}
```

#### ❌ 错误做法

```typescript
class Foo {
  private readonly userList: string[];
  constructor() {
    this.userList = [];               // 没必要放在构造函数里
  }
}
```

### 3.8 禁止使用 obj['foo'] 绕过可见性

#### ✅ 正确做法

```typescript
class Foo {
  public templateData: string;        // 外部使用的属性设为 public
}
// 使用方直接访问
foo.templateData;
```

#### ❌ 错误做法

```typescript
class Foo {
  private templateData: string;       // 模板使用的属性不应设为 private
}
(foo as any)['templateData'];         // 禁止绕过可见性限制
```

### 3.9 存取器必须非平凡

取值器和设值器至少有一个包含逻辑；如果都只是简单传递，应直接使用 public 属性。

#### ✅ 正确做法

```typescript
class Foo {
  private wrappedBar = '';
  get bar() { return this.wrappedBar || 'bar'; }
  set bar(wrapped: string) { this.wrappedBar = wrapped.trim(); }
}
```

#### ❌ 错误做法

```typescript
class Bar {
  private barInternal = '';
  get bar() { return this.barInternal; }       // 没有任何逻辑
  set bar(value: string) { this.barInternal = value; }  // 应直接使用 public 属性
}
```

### 3.10 禁止实例化原始类型封装类

#### ✅ 正确做法

```typescript
const s = 'hello';
const b = false;
const n = 5;
```

#### ❌ 错误做法

```typescript
const s = new String('hello');     // new Boolean(false) 在布尔表达式中为 true！
const b = new Boolean(false);
const n = new Number(5);
```

### 3.11 禁止使用 Array() 构造函数

#### ✅ 正确做法

```typescript
const a = [2];
const b = [2, 3];
const filled = Array.from({length: 5}).fill(0);
```

#### ❌ 错误做法

```typescript
const a = new Array(2);            // 2 被视作长度，结果是 [undefined, undefined]
const b = new Array(2, 3);         // 2, 3 被视作元素，结果是 [2, 3]
```

### 3.12 强制类型转换

- 转 string：`String()`、模板字符串
- 转 boolean：`Boolean()`、`!!`
- 转 number：`Number()`，必须检查 NaN
- 禁止 `+` 运算符转数字
- 禁止 `parseInt`/`parseFloat`（除非十进制）
- 条件语句中不要 `!!foo`，直接 `if (foo)`

#### ✅ 正确做法

```typescript
const str = String(42);
const bool = !!value;
const n = Number(inputStr);
if (isNaN(n)) throw new Error('Invalid number');
if (foo) { ... }                   // 条件中直接使用，不需要 !!
```

#### ❌ 错误做法

```typescript
const x = +y;                      // 禁止一元 + 转数字
const n = parseInt(inputStr, 10);  // 禁止 parseInt（非十进制除外）
if (!!foo) { ... }                 // 条件语句中不需要 !!
```

### 3.13 变量声明：const / let，禁止 var

#### ✅ 正确做法

```typescript
const foo = otherValue;            // 不可变用 const
let bar = someValue;               // 需要重新赋值用 let
```

#### ❌ 错误做法

```typescript
var foo = someValue;               // 禁止 var
```

### 3.14 异常：使用 new Error()

#### ✅ 正确做法

```typescript
throw new Error('Foo is not a valid bar.');
```

#### ❌ 错误做法

```typescript
throw Error('Foo is not a valid bar.');   // 缺少 new
```

### 3.15 对象迭代

禁止裸 `for...in`，应使用 `hasOwnProperty` 过滤或 `Object.keys`/`Object.entries`。

#### ✅ 正确做法

```typescript
for (const x of Object.keys(someObj)) { ... }
for (const [key, value] of Object.entries(someObj)) { ... }
```

#### ❌ 错误做法

```typescript
for (const x in someObj) { ... }          // 可能遍历到原型链上的属性
```

### 3.16 容器迭代

禁止在数组上使用 `for...in`，禁止 `.forEach()`。

#### ✅ 正确做法

```typescript
for (const x of someArr) { ... }
for (let i = 0; i < someArr.length; i++) { ... }
for (const [i, x] of someArr.entries()) { ... }
```

#### ❌ 错误做法

```typescript
for (const x in someArr) { ... }          // x 是下标（string 类型）！
someArr.forEach((item, index) => { ... }); // .forEach() 导致编译器控制流分析失效
```

### 3.17 展开运算符类型匹配

创建对象时展开对象，创建数组时展开可迭代类型。禁止展开原始类型（含 null/undefined）。

#### ✅ 正确做法

```typescript
const foo = shouldUseFoo ? {num: 7} : {};
const bar = {num: 5, ...foo};
const ids = [...fooStrings, 'd', 'e'];
```

#### ❌ 错误做法

```typescript
const bar = {num: 5, ...(shouldUseFoo && foo)}; // 可能展开 undefined
const ids = {...fooStrings};                     // 数组展开到对象，结果错误
```

### 3.18 控制流语句必须使用大括号

多行控制流语句必须使用大括号；单行 if 可省略。

#### ✅ 正确做法

```typescript
if (x) {
  doSomethingWithALongMethodName(x);
}
if (x) x.doFoo();                     // 单行可省略大括号
```

#### ❌ 错误做法

```typescript
if (x)
  x.doFoo();                          // 多行必须大括号
for (let i = 0; i < x; i++)
  doSomethingWithALongMethodName(i);
```

### 3.19 switch 语句

- 必须包含 `default` 分支
- 非空 case 不允许穿透
- 空 case 可以合并

#### ✅ 正确做法

```typescript
switch (x) {
  case X:
  case Y:
    doSomething();
    break;
  default:
    // 什么也不做
}
```

#### ❌ 错误做法

```typescript
switch (x) {
  case X:
    doSomething();             // 非空 case 不允许穿透
  case Y:
    // ...
  // 缺少 default
}
```

### 3.20 相等性判断：使用 === 和 !==

#### ✅ 正确做法

```typescript
if (foo === 'bar' || baz !== bam) { ... }
// 例外：与 null 比较时可用 == 覆盖 null 和 undefined
if (foo == null) { ... }
```

#### ❌ 错误做法

```typescript
if (foo == 'bar' || baz != bam) { ... }   // 类型隐式转换，行为难以理解
```

### 3.21 函数声明优先于箭头函数

命名函数应使用 `function` 声明。

#### ✅ 正确做法

```typescript
function foo(): number {
  return 42;
}
```

#### ❌ 错误做法

```typescript
const foo = () => 42;               // 命名函数应使用 function 声明
```

### 3.22 不要使用 function 表达式，使用箭头函数

#### ✅ 正确做法

```typescript
bar(() => { this.doSomething(); });
```

#### ❌ 错误做法

```typescript
bar(function() { ... });            // 使用箭头函数代替 function 表达式
```

### 3.23 箭头函数：返回值未使用时使用代码块体

#### ✅ 正确做法

```typescript
myPromise.then(v => { console.log(v); });      // 返回值未使用，用代码块体
const longThings = myValues.filter(v => v.length > 1000).map(v => String(v)); // 返回值被使用
```

#### ❌ 错误做法

```typescript
myPromise.then(v => console.log(v));            // 返回值未使用，不应使用表达式体
```

### 3.24 禁止依赖 this 重绑定

#### ✅ 正确做法

```typescript
document.body.onclick = () => {
  document.body.textContent = 'hello';
};
```

#### ❌ 错误做法

```typescript
function clickHandler() {
  this.textContent = 'Hello';       // this 指向不明确
}
document.body.onclick = clickHandler;
```

### 3.25 不要依赖自动分号插入（ASI）

#### ✅ 正确做法

```typescript
const x = 42;
doSomething();
```

#### ❌ 错误做法

```typescript
const x = 42                       // 缺少分号，依赖 ASI 可能导致意外行为
doSomething()
```

### 3.26 禁止使用 @ts-ignore / @ts-expect-error / @ts-nocheck

#### ✅ 正确做法

```typescript
// 提供更具体的类型，或使用 unknown / 类型守卫
if (x instanceof Foo) {
  x.foo();
}
// 在单元测试中如必须使用，添加注释说明
// tslint:disable-next-line:no-any
const mockService = ({get() { return mockBook; }} as any) as BookService;
```

#### ❌ 错误做法

```typescript
// @ts-ignore                       // 禁止使用
// @ts-expect-error                 // 禁止使用
// @ts-nocheck                      // 禁止使用
```

### 3.27 类型断言与非空断言

- 尽量避免，应使用运行时检查
- 必须使用 `as` 语法，禁止 `<Foo>x` 语法
- 对象字面量使用类型注解 `: Foo` 而非 `as Foo`
- 非空断言 `!` 必须有注释说明为何安全

#### ✅ 正确做法

```typescript
// 运行时检查优于断言
if (x instanceof Foo) { x.foo(); }
if (y) { y.bar(); }

// 类型断言使用 as 语法
const x = (z as Foo).length;

// 对象字面量使用类型注解
const foo: Foo = { bar: 123, baz: 'abc' };   // 接口变更时会报错

// 非空断言加注释
// y 不能为 null，因为 ...
y!.bar();
```

#### ❌ 错误做法

```typescript
(x as Foo).foo();                  // 无理由的类型断言
y!.bar();                          // 无理由的非空断言

const x = (<Foo>z).length;        // 禁止尖括号语法

const foo = { bar: 123, bam: 'abc' } as Foo;  // 对象字面量应用 : Foo
// 当 baz 字段被重命名后，bam 不会报错，掩盖了 bug
```

### 3.28 枚举

- 使用普通 `enum`，禁止 `const enum`
- 枚举值使用 CONSTANT_CASE

#### ✅ 正确做法

```typescript
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
}
```

#### ❌ 错误做法

```typescript
const enum Direction {              // 禁止 const enum
  Up = 'UP',                       // 枚举值应使用 CONSTANT_CASE
  Down = 'DOWN',
}
```

### 3.29 禁止在生产代码中使用 debugger

#### ✅ 正确做法

```typescript
function debugMe() {
  console.log('debug info:', data);  // 使用日志替代
}
```

#### ❌ 错误做法

```typescript
function debugMe() {
  debugger;                         // 生产代码禁止 debugger
}
```

### 3.30 装饰器

不要自定义装饰器；仅使用框架提供的装饰器（如 Angular `@Component`）。

#### ✅ 正确做法

```typescript
/** 用户列表组件 */
@Component({
  selector: 'user-list',
  template: '...',
})
export class UserListComponent { ... }
```

#### ❌ 错误做法

```typescript
function MyCustomDecorator(target: any) { ... }  // 不要自定义装饰器
```

### 3.31 禁止使用的特性

| 特性 | 原因 |
|------|------|
| `with` 语句 | ES5 严格模式已禁用，使代码难以理解 |
| `eval()` / `Function(...string)` | 安全风险，CSP 环境下不可用 |
| 修改内置对象原型 | 影响全局，难以调试 |
| 非标准 ECMAScript 特性 | 兼容性风险 |

---

## 四、代码管理（模块 / 导入 / 导出）

### 4.1 使用 ES6 模块，禁止命名空间

#### ✅ 正确做法

```typescript
import { Foo } from './foo';
export class Bar { ... }
```

#### ❌ 错误做法

```typescript
namespace Rocket { function launch() { ... } }  // 禁止命名空间
/// <reference path="..." />                     // 禁止 <reference>
import x = require('mydep');                     // 禁止 require
```

### 4.2 使用具名导出，禁止默认导出

#### ✅ 正确做法

```typescript
export class Foo { ... }
export const SOME_CONSTANT = 42;
export function helper() { ... }
```

#### ❌ 错误做法

```typescript
export default class Foo { ... }    // 默认导出不提供标准名称
```

**原因**：默认导出允许导入时任意命名（`import Foo from './bar'` 和 `import Bar from './bar'` 均合法），增加了维护难度和调试风险。

### 4.3 不要导出可变值

#### ✅ 正确做法

```typescript
let foo = 3;
export function getFoo() { return foo; }
```

#### ❌ 错误做法

```typescript
export let foo = 3;                 // 可变导出在重新导出时行为不一致
```

### 4.4 不要创建容器类

#### ✅ 正确做法

```typescript
export const FOO = 1;
export function bar() { return 1; }
```

#### ❌ 错误做法

```typescript
export class Container {
  static FOO = 1;
  static bar() { return 1; }
}
```

### 4.5 导入：模块导入 vs 解构导入

- 从大型 API 导入多个符号时使用模块导入
- 少量高频使用的符号使用解构导入

#### ✅ 正确做法

```typescript
import * as tableview from './tableview';
let item: tableview.Item = ...;

import { describe, it, expect } from './testing';
describe('foo', () => { it('bar', () => { expect(...); }); });
```

#### ❌ 错误做法

```typescript
import {TableViewItem, TableViewHeader, TableViewRow, TableViewModel, TableViewRenderer} from './tableview';
let item: TableViewItem = ...;      // 过长的解构导入，应使用模块导入
```

### 4.6 不要使用 `import type` / `export type`

#### ✅ 正确做法

```typescript
import { Foo } from './foo';
export { Bar } from './bar';
// 类型定义仍然可以
export type MyType = string | number;
```

#### ❌ 错误做法

```typescript
import type { Foo } from './foo';   // 工具链自动区分类型和值
export type { Bar } from './bar';   // 不提供保证，外部仍可绕过
```

### 4.7 根据特征而非类型组织代码

#### ✅ 正确做法

```
src/
  products/
  checkout/
  backend/
```

#### ❌ 错误做法

```
src/
  views/
  models/
  controllers/
```

---

## 五、类型系统

### 5.1 善用类型推导，省略冗余类型注解

#### ✅ 正确做法

```typescript
const x = 15;                       // 类型可推导
const x = new Set<string>();        // Set 类型可从初始化推导
```

#### ❌ 错误做法

```typescript
const x: boolean = true;            // boolean 显然可推导
const x: Set<string> = new Set();   // Set 类型可推导（注意泛型参数写在 new 侧）
```

### 5.2 可空类型别名：不要在别名中包含 null/undefined

#### ✅ 正确做法

```typescript
type CoffeeResponse = Latte | Americano;
class CoffeeService {
  getLatte(): CoffeeResponse | undefined { ... }  // 在使用时联合 undefined
}
```

#### ❌ 错误做法

```typescript
type CoffeeResponse = Latte | Americano | undefined;  // 别名中不要包含 undefined
class CoffeeService {
  getLatte(): CoffeeResponse { ... }                // 掩盖了空值来源
}
```

### 5.3 使用可选参数而非 `| undefined`

#### ✅ 正确做法

```typescript
interface CoffeeOrder {
  sugarCubes: number;
  milk?: Whole | LowFat | HalfHalf;    // 可选字段
}
function pourCoffee(volume?: Milliliter) { ... }
```

#### ❌ 错误做法

```typescript
interface CoffeeOrder {
  sugarCubes: number;
  milk: Whole | LowFat | HalfHalf | undefined;  // 应使用可选字段 ?
}
```

### 5.4 使用接口而非类型别名定义对象类型

#### ✅ 正确做法

```typescript
interface User {
  firstName: string;
  lastName: string;
}
```

#### ❌ 错误做法

```typescript
type User = {
  firstName: string,
  lastName: string,
}
```

### 5.5 Array 类型：简单类型用 `T[]`，复杂类型用 `Array<T>`

#### ✅ 正确做法

```typescript
const a: string[] = [];
const b: readonly string[] = [];
const c: ns.MyObj[] = [];
const d: Array<string | number> = [];
const e: ReadonlyArray<string | number> = [];
```

#### ❌ 错误做法

```typescript
const f: Array<string> = [];               // 简单类型用 T[] 更短
const g: ReadonlyArray<string> = [];       // 简单类型用 readonly T[]
const h: {n: number, s: string}[] = [];    // 大括号+中括号难以阅读
const i: (string | number)[] = [];         // 联合类型用 Array<T>
```

### 5.6 索引类型键名应有意义

#### ✅ 正确做法

```typescript
const users: {[userName: string]: number} = ...;
// 更好：使用 Map
const users = new Map<string, number>();
```

#### ❌ 错误做法

```typescript
const users: {[key: string]: number} = ...;  // key 无意义
```

### 5.7 映射类型与条件类型：优先使用接口和继承

#### ✅ 正确做法

```typescript
interface FoodPreferences {
  favoriteIcecream: string;
  favoriteChocolate: string;
}
interface User extends FoodPreferences {
  shoeSize: number;
}
```

#### ❌ 错误做法

```typescript
type FoodPreferences = Pick<User, 'favoriteIcecream' | 'favoriteChocolate'>;
// 复杂类型表达式增加理解难度，IDE 支持也不完善
```

### 5.8 避免使用 any

优先级：提供更具体的类型 > 使用 `unknown` > 关闭 lint 警告

#### ✅ 正确做法

```typescript
interface MyUserJson {
  name: string;
  email: string;
}
const val: unknown = value;          // unknown 比 any 安全
// 如确需 any，添加注释
// tslint:disable-next-line:no-any
const mockService = ({get() { return mockBook; }} as any) as BookService;
```

#### ❌ 错误做法

```typescript
const danger: any = value;
danger.whoops();                     // 完全未经检查的访问
```

### 5.9 元组类型替代 Pair

#### ✅ 正确做法

```typescript
function splitInHalf(input: string): [string, string] {
  return [x, y];
}
const [leftHalf, rightHalf] = splitInHalf('my string');

// 如需有意义的名称，使用内联对象类型
function splitHostPort(address: string): {host: string, port: number} { ... }
```

#### ❌ 错误做法

```typescript
interface Pair {
  first: string;
  second: string;
}
function splitInHalf(input: string): Pair { ... }
```

### 5.10 不要使用包装类型

#### ✅ 正确做法

```typescript
let s: string;
let b: boolean;
let n: number;
let o: object;          // 非基本类型
let e: {};              // 除 null/undefined 外的所有类型
```

#### ❌ 错误做法

```typescript
let s: String;          // 使用 string
let b: Boolean;         // 使用 boolean
let n: Number;          // 使用 number
let o: Object;          // 使用 {} 或 object
```

### 5.11 声明对象字面量时显式标注类型

显式类型注解能让错误出现在声明处而非调用处。

#### ✅ 正确做法

```typescript
const foo: Foo = {
  a: 123,
  b: 'abc',
};
```

#### ❌ 错误做法

```typescript
const badFoo = {
  a: 123,
  b: 'abc',
};                                  // 类型靠推导，缺少字段时错误出现在调用处
```

---

## 六、一致性

对于本文未明确的代码风格问题，应与**同一文件中已有代码的写法保持一致**。如果同一文件中无参考，则以同一文件夹下其它文件的写法为准。

### 核心原则

1. **避免已知有问题的代码范式**（尤其是对语言新手而言）
2. **跨项目保持一致的用法**（两种等价写法只选一种）
3. **代码应具有长期可维护性**（使用自动化工具、编写测试）
4. **Code Review 应关注代码质量，而非强制推行规则**

---

> **参考资源**
> - [Google TypeScript Style Guide（英文原文）](https://google.github.io/styleguide/tsguide.html)
> - [Google TypeScript Style Guide（中文翻译）](https://zh-google-styleguide.readthedocs.io/en/latest/google-typescript-styleguide/contents.html)
