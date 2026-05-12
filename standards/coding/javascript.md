# Google JavaScript 编码规范（中文版 + 正误示例）

> 来源：[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
> 本文档参考原始指南整理，并为主要规则补充了 **正确做法 ✅** 与 **错误做法 ❌** 的对照示例。
> 需特别注意：**Google 官方已不再持续更新这份 JavaScript 指南，并明确建议新项目优先迁移到 TypeScript。**

---

## 一、总则与文件基础

---

### 1. JavaScript 规范适用于存量与特定场景，新项目优先考虑 TypeScript

> **规则：如果项目可以使用 TypeScript，优先遵循 TypeScript 规范；保留 JavaScript 时也必须维持统一风格**

Google 这份 JavaScript 规范依然完整且可用，但官方已经把推荐方向转向 TypeScript。对于无法立即迁移的项目、构建链受限的代码、脚本工具或历史模块，仍应严格执行一致的 JavaScript 编码规范。

✅ **正确做法**

```javascript
// 历史脚本仍使用 JavaScript，但风格保持统一。
export function parseEnvFile(content) {
  return content.split('\n');
}
```

❌ **错误做法**

```javascript
// 因为是旧项目就放弃风格约束。
function parseEnvFile(content){return content.split('\n')}
```

---

### 2. 文件名必须全小写，扩展名必须是 `.js`

> **规则：文件名只能使用小写字母，可包含 `_` 或 `-`，扩展名固定为 `.js`**

文件名应与项目惯例保持一致，但不得混入额外标点，也不要使用大小写混搭命名。

✅ **正确做法**

```javascript
// user_profile.js
// data-loader.js
// app.js
```

❌ **错误做法**

```javascript
// UserProfile.js
// data.loader.js
// app.JS
```

---

### 3. 源文件统一使用 UTF-8 编码

> **规则：JavaScript 源码文件编码必须为 UTF-8**

编码统一是跨平台协作和工具链稳定运行的前提，尤其是当源码中包含注释、模板字符串或 Unicode 字符时。

✅ **正确做法**

```javascript
const welcomeMessage = '你好';
```

❌ **错误做法**

```javascript
// 文件以其他本地编码保存，导致跨环境乱码。
const welcomeMessage = '你好';
```

---

### 4. 源文件中的空白字符只使用普通空格，不使用 Tab

> **规则：除换行外，源码中唯一允许直接出现的空白字符是 ASCII 空格（0x20）**

这意味着：
- 缩进不能使用 Tab
- 字符串中的其他空白字符应转义表达
- 代码中不要混用不可见空白字符

✅ **正确做法**

```javascript
function renderList(items) {
  for (const item of items) {
    console.log(item);
  }
}
```

❌ **错误做法**

```javascript
function renderList(items) {
	for (const item of items) {
	  console.log(item);
	}
}
```

---

### 5. 有专用转义序列时，优先使用专用转义序列

> **规则：对 `\n`、`\t`、`\r`、`\\` 等字符，优先使用专用转义，不要写成数字转义**

专用转义更短、更直观，也更容易被维护者立即理解。

✅ **正确做法**

```javascript
const line = 'first\nsecond';
const path = 'C:\\Temp\\demo.txt';
```

❌ **错误做法**

```javascript
const line = 'first\x0asecond';
const path = 'C:\u005CTemp\u005Cdemo.txt';
```

---

### 6. 非 ASCII 字符以“更易读”为准，不要机械转义

> **规则：非 ASCII 字符既可以直接写 Unicode，也可以写转义，但原则只有一个：可读性更高**

像 `μ` 这种可打印且含义明确的字符，直接写出来通常更清晰；像 BOM 之类不可见字符，则更适合用转义并配注释说明。

✅ **正确做法**

```javascript
const units = 'μs';
return '\ufeff' + content;  // Prepend a byte order mark.
```

❌ **错误做法**

```javascript
const units = '\u03bcs';
```

---

## 二、源文件结构

---

### 1. 源文件结构必须按固定顺序组织

> **规则：文件内容按“版权信息 → `@fileoverview` → 模块声明/导入 → 依赖声明 → 实现代码”的顺序排列**

Google 风格强调文件开头的结构稳定，这样读者可以快速定位“这是什么文件、依赖什么、主体代码从哪里开始”。每个存在的区块之间通常只留 **一个空行**。

✅ **正确做法**

```javascript
/**
 * @fileoverview User preference storage.
 */

import {readFile} from './fs.js';

export function loadPreferences() {
  return readFile('prefs.json');
}
```

❌ **错误做法**

```javascript
export function loadPreferences() {
  return readFile('prefs.json');
}

import {readFile} from './fs.js';
```

---

### 2. 文件较复杂时应提供 `@fileoverview`

> **规则：当文件不只是一个简单类定义时，建议添加文件级 JSDoc，说明用途、依赖和边界**

`@fileoverview` 不是机械模板，而是帮助第一次阅读该文件的人迅速理解上下文。

✅ **正确做法**

```javascript
/**
 * @fileoverview 负责加载、缓存和持久化用户偏好配置。
 * 依赖浏览器 localStorage，并在不可用时回退到内存存储。
 */
```

❌ **错误做法**

```javascript
/** @fileoverview file */
```

---

### 3. `goog.module` 文件必须只声明一个模块名，并保持单行

> **规则：`goog.module(...)` 必须单独一行，不能换行，也不能声明多个模块名**

这是 Google JS 指南中对 Closure 风格模块的硬要求。模块名本身定义了命名空间。

✅ **正确做法**

```javascript
goog.module('search.urlHistory.urlHistoryService');
```

❌ **错误做法**

```javascript
goog.module(
    'search.urlHistory.urlHistoryService');
```

```javascript
goog.module('foo.one');
goog.module('foo.two');
```

---

### 4. `goog.module` 命名空间不能形成直接父子冲突

> **规则：模块命名空间不能直接命名为另一个模块的父节点**

例如已经存在 `foo.bar` 时，就不应再出现 `foo.bar.baz` 作为直接冲突结构；否则命名和目录层级都容易变得难以维护。

✅ **正确做法**

```javascript
goog.module('foo.bar.qux');
```

❌ **错误做法**

```javascript
goog.module('foo.bar');
goog.module('foo.bar.baz');
```

---

### 5. ES Modules 使用 `import` / `export`，导入路径必须显式带 `.js`

> **规则：ES Module 中导入其他 ES Module 时，必须使用 `import`，并且路径后缀 `.js` 不能省略**

这条规则可减少不同运行环境与打包器之间的解释差异。

✅ **正确做法**

```javascript
import './sideeffects.js';
import * as parent from '../parent.js';
import {name} from './sibling.js';
```

❌ **错误做法**

```javascript
import './sideeffects';
import {name} from './sibling';
```

---

### 6. 不要重复导入同一个文件

> **规则：同一路径的模块只导入一次，避免拆成多条分散声明**

重复导入会增加读者判断依赖全貌的成本，也容易导致命名不统一。

✅ **正确做法**

```javascript
import {short, aLongNameThatBreaksAlignment} from './long/path/to/a/file.js';
```

❌ **错误做法**

```javascript
import {short} from './long/path/to/a/file.js';
import {aLongNameThatBreaksAlignment} from './long/path/to/a/file.js';
```

---

### 7. 模块导入名应从文件名自然推导

> **规则：`import * as name` 的别名应使用 `lowerCamelCase`，并从文件路径自然演变而来**

如果导入的是整个模块命名空间，别名应体现来源文件，而不是凭个人喜好随意起名。

✅ **正确做法**

```javascript
import * as fileOne from '../file-one.js';
import * as fileTwo from '../file_two.js';
import * as vectorMath from './vector/math.js';
```

❌ **错误做法**

```javascript
import * as FILE_ONE from '../file-one.js';
import * as helper from './vector/math.js';
```

---

### 8. 默认导出被禁止，统一使用命名导出

> **规则：不要使用 `export default`，统一使用 named exports**

默认导出会让导入方自由命名，最终导致同一个符号在不同文件中出现不同名字，影响一致性和可搜索性。

✅ **正确做法**

```javascript
export class Foo {}
```

```javascript
class Foo {}
export {Foo};
```

❌ **错误做法**

```javascript
export default class Foo {}
```

---

### 9. 导出的变量在模块初始化后不应继续对外可变

> **规则：不要导出可随时被外部观察到变化的可变变量；需要可变状态时，导出访问函数或包装对象**

模块导出应尽量稳定。若状态需要更新，应把可变细节留在模块内部，对外暴露 getter、setter 或封装行为。

✅ **正确做法**

```javascript
let counter = 0;

export function getCounter() {
  return counter;
}

export function incrementCounter() {
  counter += 1;
}
```

❌ **错误做法**

```javascript
export let counter = 0;

export function incrementCounter() {
  counter += 1;
}
```

---

### 10. 不要制造 ES Module 循环依赖

> **规则：即使规范允许，也不要让 ES Module 互相形成循环引用**

循环依赖会让初始化顺序、运行时值可见性以及调试行为显著复杂化。

✅ **正确做法**

```javascript
// a.js
export function parse() {}

// b.js
import {parse} from './a.js';
```

❌ **错误做法**

```javascript
// a.js
import './b.js';

// b.js
import './a.js';
```

---

### 11. `goog.require` / `goog.requireType` 必须集中、排序、且只出现在文件顶部

> **规则：Closure 依赖声明形成连续块，只能在模块声明后、实现代码前出现**

要求包括：
- 使用 `const` 别名
- 不在函数体内临时 `goog.require`
- 不混入空行
- 不使用全限定命名空间直接访问依赖
- 长行也**不能**为了 80 列限制而换行

✅ **正确做法**

```javascript
const asserts = goog.require('goog.asserts');
const testingAsserts = goog.require('goog.testing.asserts');
const {MyClass} = goog.require('some.package');
const {MyType} = goog.requireType('other.package');
```

❌ **错误做法**

```javascript
const SomeDataStructure =
    goog.require('proto.identical.package.identifiers.SomeDataStructure');
```

```javascript
function someFunction(param) {
  const alias = goog.require('my.long.name.alias');
}
```

---

## 三、格式规范

---

### 1. 所有控制结构默认都要写花括号

> **规则：`if`、`else`、`for`、`while`、`do` 等控制结构都必须使用 `{}`**

即使只有一条语句，也应优先加花括号，避免以后补代码时埋下歧义。

✅ **正确做法**

```javascript
if (isReady) {
  start();
}

for (let i = 0; i < items.length; i++) {
  render(items[i]);
}
```

❌ **错误做法**

```javascript
if (isReady)
  start();

for (let i = 0; i < items.length; i++) render(items[i]);
```

---

### 2. 只有极短的单行 `if` 才可以省略花括号

> **规则：只有“无 `else`、无需换行、单行就能看清”的极短 `if` 才允许省略花括号**

这是唯一明确允许省略花括号的控制结构场景，但应非常克制使用。

✅ **正确做法**

```javascript
if (shortCondition()) foo();
```

❌ **错误做法**

```javascript
if (shortCondition())
  foo();
```

```javascript
if (shortCondition()) foo(); else bar();
```

---

### 3. 非空代码块使用 K&R 风格大括号

> **规则：左花括号不换行，右花括号单独成行；`else` / `catch` 等与前一个 `}` 同行连接**

这就是 Google JS 使用的经典 K&R 风格。

✅ **正确做法**

```javascript
if (condition(foo)) {
  try {
    something();
  } catch (err) {
    recover();
  }
}
```

❌ **错误做法**

```javascript
if (condition(foo))
{
  try
  {
    something();
  }
  catch (err)
  {
    recover();
  }
}
```

---

### 4. 空代码块可以写成 `{}`，但多分支语句中不要偷懒

> **规则：空块可以紧凑写成 `{}`，但如果它属于 `if/else` 或 `try/catch/finally` 这种多分支结构，就不要压缩得难读**

✅ **正确做法**

```javascript
function doNothing() {}
```

❌ **错误做法**

```javascript
if (condition) {
  doSomething();
} else if (otherCondition) {} else {
  doSomethingElse();
}
```

---

### 5. 缩进统一为 2 个空格

> **规则：每进入一层块结构，缩进增加 2 个空格**

这条规则同时适用于代码和注释。

✅ **正确做法**

```javascript
class Queue {
  push(value) {
    if (value != null) {
      this.items_.push(value);
    }
  }
}
```

❌ **错误做法**

```javascript
class Queue {
    push(value) {
        if (value != null) {
            this.items_.push(value);
        }
    }
}
```

---

### 6. 数组和对象字面量可以按“块结构”排版

> **规则：数组、对象可以单行，也可以像块一样多行排版；关键是保持可读性与一致性**

Google 指南允许多种合法排版方式，但不鼓励为了省垂直空间而刻意把大结构挤成一坨。

✅ **正确做法**

```javascript
const numbers = [
  1,
  2,
  3,
];
```

```javascript
const config = {
  host: 'localhost',
  port: 8080,
};
```

❌ **错误做法**

```javascript
const numbers = [1,
2,
    3];
```

```javascript
const config = {host: 'localhost',
port: 8080};
```

---

### 7. 类按块结构缩进，方法后不加分号

> **规则：类声明中的方法体按普通块缩进；类声明结尾不加分号，类表达式所在语句仍要加分号**

✅ **正确做法**

```javascript
class Foo {
  constructor(x) {
    this.x = x;
  }

  getValue() {
    return this.x;
  }
}

const Exported = class extends Foo {
  render() {
    return this.x;
  }
};
```

❌ **错误做法**

```javascript
class Foo {
  constructor(x) {
    this.x = x;
  };
};
```

---

### 8. 每行只写一条语句，语句末尾必须加分号

> **规则：禁止依赖自动分号插入（ASI）**

每条语句都应明确结束，这能显著减少隐式语义变化的风险。

✅ **正确做法**

```javascript
const name = getName();
log(name);
```

❌ **错误做法**

```javascript
const name = getName()
log(name)
```

```javascript
const a = 1; const b = 2;
```

---

### 9. 列宽默认上限 80，但有明确例外

> **规则：JavaScript 代码默认不超过 80 列；`goog.module`、`goog.require`、ES `import` / `export from` 等可例外**

另外，某些必须保持完整可搜索或可复制的 URL、命令、长路径，也可合理超出 80 列。

✅ **正确做法**

```javascript
const summary =
    calculateSummary(currentEstimate, pendingTasks, dependencyGraph);
```

❌ **错误做法**

```javascript
const summary = calculateSummary(currentEstimate, pendingTasks, dependencyGraph, userPreferences, featureFlags, currentRuntimeState);
```

---

### 10. 换行时优先在更高语法层级断开，续行至少多缩进 4 个空格

> **规则：长表达式换行时，优先在赋值、运算符、参数列表等更高层级断开，而不是切碎内部片段**

✅ **正确做法**

```javascript
currentEstimate =
    calc(currentEstimate + x * currentEstimate) /
        2.0;
```

❌ **错误做法**

```javascript
currentEstimate = calc(currentEstimate + x *
    currentEstimate) / 2.0;
```

---

### 11. 水平空格只在必要位置出现，不做视觉对齐表演

> **规则：在关键字、运算符、逗号、注释等位置使用单个空格；不要用大量额外空格做列对齐**

水平对齐虽然暂时好看，但会让以后每次改动都波及相邻行，放大 diff 和冲突面。

✅ **正确做法**

```javascript
const result = left + right;
const map = {foo: 1, bar: 2};
```

❌ **错误做法**

```javascript
const result      = left + right;
const map         = {foo: 1,   bar: 2};
```

---

### 12. 函数参数优先保持同一行，超长时按可读方式换行

> **规则：能放在函数名同一行就放同一行；放不下时，续行统一 4 空格缩进，必要时每个参数一行**

✅ **正确做法**

```javascript
doSomething(
    veryDescriptiveArgumentNumberOne,
    veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy,
    artichokeDescriptorAdapterIterator);
```

❌ **错误做法**

```javascript
doSomething(veryDescriptiveArgumentNumberOne,
  veryDescriptiveArgumentTwo,
       tableModelEventHandlerProxy,
 artichokeDescriptorAdapterIterator);
```

---

### 13. 可选括号只在不会造成歧义时省略

> **规则：不要假设读者背得出完整运算符优先级表；必要时主动加括号提升可读性**

但像 `return`、`throw`、`typeof` 后面那种把整个表达式再包一层括号的写法，通常没必要。

✅ **正确做法**

```javascript
const result = (a + b) * c;
return value + 1;
const casted = /** @type {!Foo} */ (foo);
```

❌ **错误做法**

```javascript
const result = a + b * c;
return (value + 1);
```

---

### 14. 实现注释使用普通注释，不要滥用 JSDoc

> **规则：实现细节注释用 `//` 或 `/* ... */`，JSDoc 只用于文档与类型标注**

多行块注释第二行开始的 `*` 要与首行对齐，不要画“星号盒子”。

✅ **正确做法**

```javascript
/*
 * This is
 * okay.
 */

// And so
// is this.
```

❌ **错误做法**

```javascript
/**************
 * noisy box *
 **************/
```

```javascript
/** 这里其实只是实现注释，不该用 JSDoc。 */
const value = compute();
```

---

### 15. 参数名注释只在名称和实参含义不够清晰时使用

> **规则：如果调用点很难看出字面值的含义，可以加“参数名注释”，推荐写在值前面并带 `=`**

✅ **正确做法**

```javascript
someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');
```

❌ **错误做法**

```javascript
someFunction(obviousParam, true, 'hello');
```

---

## 四、语言特性

---

### 1. 局部变量只使用 `const` 和 `let`，禁止 `var`

> **规则：默认使用 `const`，只有确实需要重新赋值时才使用 `let`**

`var` 的作用域与提升行为容易造成误解，因此被明确禁止。

✅ **正确做法**

```javascript
const config = loadConfig();
let retryCount = 0;
retryCount += 1;
```

❌ **错误做法**

```javascript
var config = loadConfig();
var retryCount = 0;
```

---

### 2. 每次声明只声明一个变量，并尽量在首次使用附近声明

> **规则：不要在一条语句里声明多个变量，也不要习惯性把所有局部变量堆到函数开头**

变量应尽量缩小作用域，并在真正需要时立即初始化。

✅ **正确做法**

```javascript
const response = await fetch(url);
const data = await response.json();
```

❌ **错误做法**

```javascript
let response, data;
response = await fetch(url);
data = await response.json();
```

```javascript
let a = 1, b = 2;
```

---

### 3. 局部变量类型在需要时补 JSDoc，不要混用两套写法

> **规则：当编译器难以推断类型时，可以对局部变量补充 JSDoc；但不要把行内类型和块级 JSDoc 混在一起**

✅ **正确做法**

```javascript
const /** !Array<number> */ data = [];
```

```javascript
/**
 * Some description.
 * @type {!Array<number>}
 */
const moreData = [];
```

❌ **错误做法**

```javascript
/** Some description. */
const /** !Array<number> */ data = [];
```

---

### 4. 数组字面量使用尾逗号，不用可变参数版 `Array` 构造器

> **规则：多行数组最后一个元素后保留尾逗号；不要写 `new Array(x1, x2)` 这类易误解代码**

`new Array(1)` 与 `new Array('1')` 的语义差异非常危险。

✅ **正确做法**

```javascript
const values = [
  'first value',
  'second value',
];

const list = [x1, x2, x3];
```

❌ **错误做法**

```javascript
const values = [
  'first value',
  'second value'
];
```

```javascript
const list = new Array(x1, x2, x3);
const maybeLength = new Array(x1);
```

---

### 5. 不要给数组挂非数字属性

> **规则：数组只用于按索引存储元素；需要键值关联时用 `Map` 或普通对象**

✅ **正确做法**

```javascript
const usersById = new Map();
usersById.set('u1', user);
```

❌ **错误做法**

```javascript
const users = [];
users.primary = currentUser;
```

---

### 6. 解构赋值可以用，但默认值写法必须清晰

> **规则：数组解构参数如果可选，默认值要写成 `=[]`；对象解构参数如果可选，默认值要写成 `={}`**

同时，不要在参数解构中使用过深嵌套、复杂计算键或难理解的默认结构。

✅ **正确做法**

```javascript
const [a, b, c, ...rest] = generateResults();
let [, second,, fourth] = someArray;

/** @param {!Array<number>=} param1 */
function optionalDestructuring([first = 4, secondValue = 2] = []) {}
```

```javascript
/**
 * @param {{num: (number|undefined), str: (string|undefined)}=} param1
 */
function destructured({num, str = 'some default'} = {}) {}
```

❌ **错误做法**

```javascript
function badDestructuring([a, b] = [4, 2]) {}
```

```javascript
function nestedTooDeeply({x: {num, str}}) {}
```

---

### 7. 展开运算符优先于旧式 `apply` / `concat` 拼接

> **规则：展开数组、迭代器或函数参数时，优先使用 `...`，且 `...` 后不留空格**

✅ **正确做法**

```javascript
const merged = [...foo, ...bar];
myFunction(...array, ...iterable, ...generator());
```

❌ **错误做法**

```javascript
const merged = foo.concat(bar);
myFunction.apply(null, array);
```

---

### 8. 对象字面量统一使用字面量写法，不用 `Object` 构造器

> **规则：新建对象使用 `{}` 或对象字面量，不要 `new Object()`**

✅ **正确做法**

```javascript
const options = {};
const point = {x: 0, y: 1};
```

❌ **错误做法**

```javascript
const options = new Object();
```

---

### 9. 对象字面量中不要混用带引号和不带引号的键

> **规则：一个对象字面量要么是 struct 风格（普通键），要么是 dict 风格（带引号或计算键），不要混搭**

混搭会破坏属性重命名和静态分析的一致性。

✅ **正确做法**

```javascript
const size = {
  width: 42,
  maxWidth: 43,
};
```

```javascript
const labels = {
  'max-width': '43px',
  'min-width': '12px',
};
```

❌ **错误做法**

```javascript
const mixed = {
  width: 42,
  'maxWidth': 43,
};
```

---

### 10. 对象方法优先使用方法简写，属性允许使用属性简写

> **规则：在对象字面量中，优先使用 `method() {}` 与 `{foo, bar}` 形式，提高简洁度**

✅ **正确做法**

```javascript
const foo = 1;
const bar = 2;

const obj = {
  foo,
  bar,
  method() {
    return this.foo + this.bar;
  },
};
```

❌ **错误做法**

```javascript
const obj = {
  foo: foo,
  bar: bar,
  method: function() {
    return this.foo + this.bar;
  },
};
```

---

### 11. 枚举使用 `@enum`，值只能是字符串字面量或数字

> **规则：枚举必须是模块局部或直接挂在 `exports` 上；枚举值不能靠运行时表达式拼接出来**

✅ **正确做法**

```javascript
/**
 * Supported temperature scales.
 * @enum {string}
 */
const TemperatureScale = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};
```

❌ **错误做法**

```javascript
const ABSOLUTE_ZERO = '-273°F';

/** @enum {string} */
const TemperatureInFahrenheit = {
  MIN_POSSIBLE: ABSOLUTE_ZERO,
  ZERO_FAHRENHEIT: 0 + '°F',
};
```

---

### 12. 类字段必须在构造函数中定义

> **规则：具体对象的所有字段都应在构造函数中初始化；不要在后续流程中随意增删实例字段**

这有利于运行时优化，也能减少实例形状变化。

✅ **正确做法**

```javascript
class Foo {
  constructor() {
    /** @private @const {!Bar} */
    this.bar_ = computeBar();

    /** @protected @const {!Baz} */
    this.baz = computeBaz();
  }
}
```

❌ **错误做法**

```javascript
class Foo {
  constructor() {}
}

const foo = new Foo();
foo.bar = computeBar();
```

---

### 13. 类中的计算属性只应在确有必要时用于 `Symbol`

> **规则：类里使用计算属性名时，通常只允许 `Symbol` 场景，例如 `[Symbol.iterator]`**

✅ **正确做法**

```javascript
class Range {
  * [Symbol.iterator]() {
    yield 1;
    yield 2;
  }
}
```

❌ **错误做法**

```javascript
class Weird {
  ['dynamicName']() {
    return 1;
  }
}
```

---

### 14. 静态方法不要依赖动态分发，能用模块级函数就别塞进私有静态方法

> **规则：优先使用模块局部函数代替私有静态方法；静态方法只在基类本身上调用，不依赖 `this`**

✅ **正确做法**

```javascript
function normalizeInput(value) {
  return String(value).trim();
}

class Parser {
  static parse(value) {
    return normalizeInput(value);
  }
}
```

❌ **错误做法**

```javascript
class Base {
  static foo() {
    return this.staticField;
  }
}
```

---

### 15. 除兼容场景外，优先使用 ES6 class；不要直接操作 `prototype`

> **规则：正常业务代码不要手工改写原型链，也不要给内建对象做 mixin**

原型操作只应出现在极少数框架级或历史兼容代码中。

✅ **正确做法**

```javascript
class UserService {
  constructor(repository) {
    this.repository_ = repository;
  }

  load(id) {
    return this.repository_.findById(id);
  }
}
```

❌ **错误做法**

```javascript
function UserService(repository) {
  this.repository_ = repository;
}

UserService.prototype.load = function(id) {
  return this.repository_.findById(id);
};

Array.prototype.first = function() {
  return this[0];
};
```

---

### 16. 不要使用 getter / setter 属性，除非框架逼你这样做

> **规则：优先提供普通方法，而不是 JavaScript 的属性式 getter / setter**

getter / setter 容易让读取表达式暗含副作用，也更难静态推断。

✅ **正确做法**

```javascript
class Queue {
  getNextId() {
    return this.nextId_;
  }
}
```

❌ **错误做法**

```javascript
class Queue {
  get next() {
    return this.nextId_++;
  }
}
```

---

### 17. 不要创建“只有静态成员的容器类”来做命名空间

> **规则：如果只是为了导出一组工具函数和常量，直接导出函数/常量，不要额外包一层类**

✅ **正确做法**

```javascript
/** @return {number} */
export function bar() {
  return 1;
}

/** @const {number} */
export const FOO = 1;
```

❌ **错误做法**

```javascript
export class Container {
  static bar() {
    return 1;
  }
}

Container.FOO = 1;
```

---

### 18. 不要定义嵌套命名空间类型

> **规则：不要把类、枚举、typedef、接口再挂在另一个模块局部类名下面**

这些值应该直接成为顶层导出，名称冲突通过更清晰的命名解决，而不是靠层级嵌套。

✅ **正确做法**

```javascript
export class Foo {}
export class FooBar {}

/** @enum {string} */
export const FooBaz = {
  A: 'a',
};
```

❌ **错误做法**

```javascript
class Foo {}
Foo.Bar = class {};
Foo.Baz = {A: 'a'};

export {Foo};
```

---

### 19. 顶层函数可以直接导出，也可以先声明再导出

> **规则：顶层函数的风格可以二选一，但都要保持清晰和一致**

✅ **正确做法**

```javascript
/** @param {string} str */
export function processString(str) {
  return str.trim();
}
```

```javascript
/** @param {string} str */
const processString = (str) => str.trim();
export {processString};
```

❌ **错误做法**

```javascript
exports = processString;
```

---

### 20. 嵌套函数优先使用箭头函数，避免 `bind(this)` 和 `const self = this`

> **规则：对于局部回调和闭包，优先使用箭头函数来继承外围 `this`**

✅ **正确做法**

```javascript
class CallbackExample {
  constructor() {
    /** @private {number} */
    this.cachedValue_ = 0;

    getNullableValue((result) => {
      this.cachedValue_ = result == null ? 0 : result;
    });
  }
}
```

❌ **错误做法**

```javascript
class CallbackExample {
  constructor() {
    const self = this;
    getNullableValue(function(result) {
      self.cachedValue_ = result;
    });
  }
}
```

---

### 21. 箭头函数只有在“确实需要返回值”或显式 `void` 时才用单表达式形式

> **规则：如果逻辑并不需要返回值，就不要把单调用表达式直接写成隐式返回；必要时写 `void` 表达意图**

✅ **正确做法**

```javascript
const add = (numParam, strParam) => numParam + Number(strParam);
getValue((result) => void alert(`Got ${result}`));
```

❌ **错误做法**

```javascript
const notify = () => anotherFunction();
```

---

### 22. 生成器可以使用，但 `function*` / `yield*` 的星号位置要统一

> **规则：定义生成器时，`*` 跟在 `function` 后，命名生成器与函数名之间留空格；`yield*` 则贴在 `yield` 后**

✅ **正确做法**

```javascript
/** @return {!Iterator<number>} */
function* gen1() {
  yield 42;
}

const gen2 = function*() {
  yield* gen1();
};
```

❌ **错误做法**

```javascript
function *gen1() {
  yield * gen2();
}
```

---

### 23. 可选参数必须有默认值，且不要再用 `opt_` 前缀

> **规则：可选参数放在必选参数后面，JSDoc 类型用 `=`，运行时代码给默认值；接口和抽象方法例外，不写默认值**

✅ **正确做法**

```javascript
/**
 * @param {string} required
 * @param {string=} optional
 * @param {!Node=} node
 */
function maybeDoSomething(required, optional = '', node = undefined) {}
```

❌ **错误做法**

```javascript
/**
 * @param {string} required
 * @param {string=} opt_optional
 */
function maybeDoSomething(required, opt_optional) {}
```

---

### 24. 可变参数使用 rest，不要访问 `arguments`

> **规则：使用 `...numbers` 这样的 rest 参数；不要把参数或局部变量命名为 `arguments`**

✅ **正确做法**

```javascript
/**
 * @param {!Array<string>} array
 * @param {...number} numbers
 */
function variadic(array, ...numbers) {}
```

❌ **错误做法**

```javascript
function variadic() {
  const arguments = [];  // 禁止遮蔽内建名称
  return arguments;
}
```

---

### 25. 普通字符串统一使用单引号，复杂拼接优先模板字符串

> **规则：普通字符串默认使用单引号；多段拼接、嵌入表达式、多行文本优先使用模板字符串**

✅ **正确做法**

```javascript
const name = 'Alice';
const message = `Hello, ${name}!`;
```

❌ **错误做法**

```javascript
const name = "Alice";
const message = 'Hello, ' + name + '!';
```

---

### 26. 禁止字符串续行反斜杠

> **规则：不要通过在字符串行尾写反斜杠来实现跨行**

这种写法隐蔽且容易被行尾空格破坏。

✅ **正确做法**

```javascript
const longString = 'This is a very long string that far exceeds the 80 ' +
    'column limit. It stays readable after concatenation.';
```

❌ **错误做法**

```javascript
const longString = 'This is a very long string that far exceeds the 80 \
    column limit and is easy to break accidentally.';
```

---

### 27. 数字字面量前缀固定小写，禁止无意义前导零

> **规则：十六进制用 `0x`，八进制用 `0o`，二进制用 `0b`；不要写模糊的前导零**

✅ **正确做法**

```javascript
const hexMask = 0xff;
const octalMode = 0o755;
const binaryFlag = 0b1010;
```

❌ **错误做法**

```javascript
const ambiguous = 0755;
const wrongHex = 0XFF;
```

---

### 28. `for-of` 优先于 `for-in`，异常必须抛 `Error`

> **规则：遍历可迭代对象优先用 `for-of`；`for-in` 只用于 dict 风格对象并结合 `hasOwnProperty`；抛异常时始终抛 `Error` 或其子类**

✅ **正确做法**

```javascript
for (const item of items) {
  render(item);
}

for (const key in dict) {
  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    console.log(key);
  }
}

throw new Error('Invalid configuration');
```

❌ **错误做法**

```javascript
for (const index in items) {
  render(items[index]);
}

throw 'Invalid configuration';
```

---

### 29. 空 `catch` 极少合理，确实忽略时必须写注释说明

> **规则：捕获异常后什么都不做是非常危险的；如果确实允许失败，也要明确说明理由**

✅ **正确做法**

```javascript
try {
  return handleNumericResponse(response);
} catch (ok) {
  // It's not numeric; that's fine, just continue.
}
return handleTextResponse(response);
```

❌ **错误做法**

```javascript
try {
  shouldFail();
} catch (expected) {
}
```

---

### 30. `switch` 必须有 `default`，fall-through 必须明确注释

> **规则：每个 `switch` 都要有最后一个 `default` 分支；如果会落入下一个 `case`，必须写明 `// fall through`**

✅ **正确做法**

```javascript
switch (input) {
  case 1:
  case 2:
    prepareOneOrTwo();
    // fall through
  case 3:
    handleOneTwoOrThree();
    break;
  default:
    handleLargeNumber(input);
}
```

❌ **错误做法**

```javascript
switch (input) {
  case 1:
    prepareOne();
  case 2:
    handleTwo();
}
```

---

### 31. 只在类和明确声明的上下文里使用 `this`

> **规则：`this` 只应用于类构造器、方法、其内部箭头函数，或在 JSDoc 中显式声明了 `@this` 的函数**

不要把 `this` 当成“全局对象引用”或事件目标的快捷方式。

✅ **正确做法**

```javascript
class UserCache {
  constructor() {
    this.items_ = [];
  }

  add(item) {
    this.items_.push(item);
  }
}
```

❌ **错误做法**

```javascript
function handleClick() {
  this.globalValue = 1;
}
```

---

### 32. 默认使用 `===` / `!==`，只有判空时才允许 `== null`

> **规则：相等判断默认使用严格相等；唯一常见例外是同时捕获 `null` 和 `undefined` 的判空场景**

✅ **正确做法**

```javascript
if (status === 'ready') {
  start();
}

if (someObjectOrPrimitive == null) {
  handleMissingValue();
}
```

❌ **错误做法**

```javascript
if (status == 'ready') {
  start();
}
```

---

### 33. 明确禁止危险和非标准特性

> **规则：禁止 `with`、`eval`、`Function(string)`、自动分号插入依赖、非标准提案特性、原始类型包装对象、修改内建对象，以及省略 `new` 的括号**

✅ **正确做法**

```javascript
const value = Boolean(0);
const foo = new Foo();
```

❌ **错误做法**

```javascript
with (context) {
  doSomething();
}
```

```javascript
const fn = new Function('return 1');
const wrapped = new Boolean(false);
new Foo;
Array.prototype.first = function() {
  return this[0];
};
```

---

## 五、命名规范

---

### 1. 标识符只使用 ASCII 字母和数字，命名必须有描述性

> **规则：命名应尽量完整、清晰、可被新读者立即理解；不要使用含糊缩写、匈牙利命名或删字母缩写法**

短变量名只适用于非常短的小作用域（大致 10 行以内）。

✅ **正确做法**

```javascript
const errorCount = 3;
const dnsConnectionIndex = 1;
const customerId = 'u-001';
```

❌ **错误做法**

```javascript
const n = 3;
const nErr = 3;
const cstmrId = 'u-001';
const kSecondsPerDay = 86400;
```

---

### 2. 包名使用 `lowerCamelCase`

> **规则：Closure 风格下的 package name 使用 `lowerCamelCase`，不要写成全小写拼接或 snake_case**

✅ **正确做法**

```javascript
goog.module('my.exampleCode.deepSpace');
```

❌ **错误做法**

```javascript
goog.module('my.examplecode.deepspace');
goog.module('my.example_code.deep_space');
```

---

### 3. 类、接口、record、typedef 名称使用 `UpperCamelCase`

> **规则：类型名通常是名词或名词短语；未导出的类只是模块局部符号，不要再额外标 `@private`**

✅ **正确做法**

```javascript
class Request {}
class ImmutableView {}
class VisibilityMode {}
```

❌ **错误做法**

```javascript
class request {}
class immutable_view {}
```

---

### 4. 方法名使用 `lowerCamelCase`，私有方法可选尾随下划线

> **规则：方法名通常是动词或动宾短语；测试方法可以用下划线分隔逻辑片段**

✅ **正确做法**

```javascript
class Mailer {
  sendMessage() {}
  stop_() {}
}

function testPop_emptyStack_throws() {}
```

❌ **错误做法**

```javascript
class Mailer {
  SendMessage() {}
  stop_message() {}
}
```

---

### 5. 枚举名使用 `UpperCamelCase`，枚举成员使用 `CONSTANT_CASE`

> **规则：枚举本身像类型，枚举值像常量**

✅ **正确做法**

```javascript
/** @enum {string} */
const TemperatureScale = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};
```

❌ **错误做法**

```javascript
/** @enum {string} */
const temperatureScale = {
  Celsius: 'celsius',
};
```

---

### 6. 常量才使用 `CONSTANT_CASE`，且必须是真正常量

> **规则：不是所有 `const` 都应该写成全大写；只有“深层语义上不可变”的值才是常量**

模块局部 `const` 如果内部状态仍可变，也不应写成全大写。

✅ **正确做法**

```javascript
const NUMBER = 5;
/** @const */
export const NAMES = Object.freeze(['Ed', 'Ann']);
```

❌ **错误做法**

```javascript
const MUTABLE_COLLECTION = new Set();
const LOGGER = log.getLogger('app.main');
```

---

### 7. 非常量字段、参数、局部变量都使用 `lowerCamelCase`

> **规则：实例字段、局部变量、参数一律 `lowerCamelCase`；私有字段可选尾随下划线；单字符参数不应用于公共 API**

✅ **正确做法**

```javascript
class Cache {
  constructor() {
    this.computedValues = [];
    this.index_ = 0;
  }
}

function loadUser(userId, retryLimit) {}
```

❌ **错误做法**

```javascript
class Cache {
  constructor() {
    this.ComputedValues = [];
    this.index_value = 0;
  }
}

function loadUser(i, r) {}
```

---

### 8. 模板类型参数全大写，模块局部未导出名称默认就是私有

> **规则：模板参数名使用 `TYPE`、`KEY`、`VALUE` 这类全大写标识；模块局部未导出符号无需写 `@private`**

✅ **正确做法**

```javascript
/**
 * @template TYPE
 */
function identity(value) {
  return value;
}
```

❌ **错误做法**

```javascript
/**
 * @template Type
 */
function identity(value) {
  return value;
}
```

---

### 9. 驼峰转换要把缩写当普通词处理

> **规则：先把短语拆词，再统一小写处理，再按 Upper/Lower CamelCase 拼接；不要把缩写整段大写保留下来**

✅ **正确做法**

```javascript
const xmlHttpRequest = createRequest();
const newCustomerId = 'u-001';
const supportsIpv6OnIos = true;
```

❌ **错误做法**

```javascript
const XMLHTTPRequest = createRequest();
const newCustomerID = 'u-001';
const supportsIPv6OnIOS = true;
```

---

## 六、JSDoc 规范

---

### 1. 类、字段、方法都应使用 JSDoc，且必须格式正确

> **规则：JSDoc 既给人看，也被工具消费；因此它不是“可随便写”的注释，而是必须合法、稳定、可解析**

✅ **正确做法**

```javascript
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} arg A number to do something to.
 */
function doSomething(arg) {}
```

❌ **错误做法**

```javascript
/** @param number arg */
function doSomething(arg) {}
```

---

### 2. 单行 JSDoc 只适用于非常短的场景

> **规则：极短注释可以写成单行；一旦溢出或语义复杂，就必须改为标准多行形式**

✅ **正确做法**

```javascript
/** @private @const {!Foo} A short bit of JSDoc. */
this.foo_ = foo;
```

❌ **错误做法**

```javascript
/** @private @const {!Foo} This comment is too long to stay on one line and still be readable. */
this.foo_ = foo;
```

---

### 3. JSDoc 正文使用 Markdown，不要依赖纯文本排版假象

> **规则：列表、链接、强调等都按 Markdown 写；不要用纯空格缩进假装做列表**

✅ **正确做法**

```javascript
/**
 * Computes weight based on three factors:
 *
 *  - items sent
 *  - items received
 *  - last timestamp
 */
```

❌ **错误做法**

```javascript
/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */
```

---

### 4. 大多数 JSDoc 标签必须各占一行，简单标签可以合并

> **规则：`@param`、`@return`、`@template` 这类标签通常各占一行；`@private @const` 这类简单标签可合并**

✅ **正确做法**

```javascript
/**
 * @export @final
 * @implements {Iterable<TYPE>}
 * @template TYPE
 */
class MyClass {}
```

❌ **错误做法**

```javascript
/**
 * @param {number} left @param {number} right
 */
function add(left, right) {}
```

---

### 5. JSDoc 换行时，说明文字续行缩进 4 个空格；`@fileoverview` / `@desc` 的正文不额外缩进

> **规则：块标签的换行要保持规则性，读者和工具都能稳定解析**

✅ **正确做法**

```javascript
/**
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
```

❌ **错误做法**

```javascript
/**
 * @param {string} foo This is a param with a description too long to fit in
 *   one line.
 */
```

---

### 6. 文件级注释用来说明文件职责、依赖和兼容信息

> **规则：`@fileoverview` 用于给陌生读者提供进入文件的最小必要上下文**

✅ **正确做法**

```javascript
/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * @package
 */
```

❌ **错误做法**

```javascript
/** @fileoverview utils */
```

---

### 7. 类、接口、record 必须写类级说明

> **规则：类注释要说明“这个类是什么、何时使用、有哪些额外注意事项”；构造函数上的文字描述可省略**

✅ **正确做法**

```javascript
/**
 * A fancier event target that does cool things.
 * @implements {Iterable<string>}
 */
class MyFancyTarget extends EventTarget {}
```

❌ **错误做法**

```javascript
class MyFancyTarget extends EventTarget {}
```

---

### 8. `@enum` 和 `@typedef` 必须在前一行用完整 JSDoc 声明

> **规则：公共枚举和 typedef 必须带说明；枚举成员可以单独补注释**

✅ **正确做法**

```javascript
/**
 * A useful type union, which is reused often.
 * @typedef {!FruitType|!FruitTypeEnum}
 */
let CoolUnionType;

/**
 * Types of fruits.
 * @enum {string}
 */
const FruitTypeEnum = {
  /** This kind is very sour. */
  SOUR: 'sour',
};
```

❌ **错误做法**

```javascript
let CoolUnionType;
const FruitTypeEnum = {SOUR: 'sour'};
```

---

### 9. 方法和命名函数必须写参数与返回类型，`@override` 也不能省略

> **规则：函数说明以第三人称动词短语开头；即使 override 后签名未变，也要把 `@param` / `@return` 写全**

✅ **正确做法**

```javascript
/** A class that does something. */
class SomeClass extends SomeBaseClass {
  /**
   * Operates on an instance of MyClass and returns something.
   * @param {!MyClass} obj
   * @param {!OtherClass} obviousOtherClass
   * @return {boolean} Whether something occurred.
   */
  someMethod(obj, obviousOtherClass) {
    return true;
  }

  /**
   * @param {string} param
   * @return {string}
   * @override
   */
  overriddenMethod(param) {
    return param;
  }
}
```

❌ **错误做法**

```javascript
class SomeClass extends SomeBaseClass {
  overriddenMethod(param) {
    return param;
  }
}
```

---

### 10. 只有“纯类型信息”时才允许内联 JSDoc，不能在内联里写描述文字

> **规则：如果只需要声明参数/返回类型，可以把类型直接写在函数签名里；一旦需要描述或标签，就改成函数上方完整 JSDoc**

✅ **正确做法**

```javascript
function /** string */ foo(/** number */ arg) {
  return String(arg);
}
```

❌ **错误做法**

```javascript
/** No function description allowed inline here. */ function bar() {}
function /** Function description is illegal here. */ baz() {}
```

---

### 11. 属性类型必须写清楚，私有属性可以适度省略文字说明

> **规则：字段一定要有类型；公共常量和属性则通常还需要文字说明**

✅ **正确做法**

```javascript
class MyClass {
  /** @param {string=} someString */
  constructor(someString = 'default string') {
    /** @private @const {string} */
    this.someString_ = someString;

    /**
     * Maximum number of things per pane.
     * @type {number}
     */
    this.someProperty = 4;
  }
}
```

❌ **错误做法**

```javascript
class MyClass {
  constructor() {
    this.someProperty = 4;
  }
}
```

---

### 12. 非原始引用类型必须显式标明可空性，原始类型默认非空

> **规则：`string`、`number` 这类原始类型默认非空；引用类型必须显式写 `!` 或 `?`，避免歧义**

✅ **正确做法**

```javascript
const /** ?MyObject */ myObject = null;
const /** number */ someNum = 5;
const /** ?number */ someNullableNum = null;
const /** !MyTypeDef */ def = createDef();
```

❌ **错误做法**

```javascript
const /** MyObject */ myObject = null;
const /** !number */ someNum = 5;
const /** number? */ someNullableNum = null;
```

---

### 13. 类型断言必须写成 `/** @type {...} */ (expr)`，括号不能省略

> **规则：当编译器推断不准，而断言函数也无能为力时，可以通过类型断言收紧类型**

✅ **正确做法**

```javascript
const count = /** @type {number} */ (x);
```

❌ **错误做法**

```javascript
const count = /** @type {number} */ x;
```

---

### 14. 泛型参数必须写全，不要让容器元素类型变成未知

> **规则：`Array`、`Promise`、`Object` 等泛型容器都应明确模板参数**

✅ **正确做法**

```javascript
const /** !Array<string> */ books = [];
const /** !Promise<!Response> */ response = fetchData();
const /** !Object<string, !User> */ users = {};
```

❌ **错误做法**

```javascript
const /** !Array */ books = [];
const /** !Promise */ response = fetchData();
const /** !Object */ users = {};
```

---

### 15. 函数类型表达式必须显式写返回类型

> **规则：只在函数定义本体不在当前位置时，才使用 `function(...)` 类型表达式；并且一定写出返回类型**

✅ **正确做法**

```javascript
/**
 * @param {function(): *} inputFunction1
 * @param {function(): undefined} inputFunction2
 */
function foo(inputFunction1, inputFunction2) {}
```

❌ **错误做法**

```javascript
/** @param {function()} generateNumber */
function foo(generateNumber) {
  const /** number */ x = generateNumber();
}
```

---

### 16. 可见性注解只用于导出符号和属性，不用于局部变量

> **规则：`@private`、`@protected`、`@package` 可放在 `@fileoverview`、导出符号或属性上；不要给函数内部局部变量写可见性**

✅ **正确做法**

```javascript
class Foo {
  constructor() {
    /** @private {number} */
    this.retryCount_ = 0;
  }
}
```

❌ **错误做法**

```javascript
function work() {
  /** @private {number} */
  const retryCount = 0;
}
```

---

## 七、工程策略与实践

---

### 1. 规范没有明确定义的地方，以局部一致性优先

> **规则：如果规范没有明确规定，先看当前文件，再看同包其他文件，保持风格连续**

风格指南的目标不是覆盖一切，而是减少团队内的随机差异。

✅ **正确做法**

- 修改已有文件时，沿用该文件当前的导入分组、空行节奏、注释形式。
- 如果同一个包已有稳定模式，新增文件尽量与其一致。

❌ **错误做法**

- 在同一文件中同时引入另一套完全不同的换行和注释风格。
- 因个人偏好强行重排整个文件，却与本次功能无关。

---

### 2. 编译器警告的处理顺序是：先修复，再精确抑制，最后才留 TODO

> **规则：对警告的优先处理顺序非常明确：**
> 1. 先修复或绕开问题  
> 2. 如果确定是误报，再写注释并最小范围 `@suppress`  
> 3. 实在没法处理时，最后才留 `TODO`，且不要把警告静音掉

✅ **正确做法**

```javascript
/** @suppress {uselessCode} Unrecognized 'use asm' declaration. */
function fn() {
  'use asm';
  return 0;
}
```

❌ **错误做法**

```javascript
/** @suppress {all} */
function fn() {
  riskyCode();
}
```

---

### 3. 警告抑制范围必须尽可能小

> **规则：优先只抑制单个变量、单个函数、很小的方法，不要一把把整类或整文件都屏蔽**

✅ **正确做法**

```javascript
/** @suppress {uselessCode} Unrecognized 'use asm' declaration. */
function fn() {
  'use asm';
  return 0;
}
```

❌ **错误做法**

```javascript
/** @suppress {checkTypes} */
export class EntireFileIgnoreEverything {}
```

---

### 4. 废弃 API 必须用 `@deprecated`，且写清迁移方式

> **规则：不是只标“已废弃”，还要告诉调用者该怎么改**

✅ **正确做法**

```javascript
/**
 * @deprecated Use `loadUserProfile()` instead.
 */
export function loadProfile() {
  return loadUserProfile();
}
```

❌ **错误做法**

```javascript
/** @deprecated */
export function loadProfile() {}
```

---

### 5. 修改旧代码时，不必为风格一次性“大扫除”，但新增代码必须符合规范

> **规则：旧文件不要求每次顺手全部改成新风格；若变更很大，则应把文件整体拉回规范轨道**

同时，不要让与业务无关的大量风格修复淹没本次改动的主题；必要时拆成独立提交。

✅ **正确做法**

- 在老文件中新增逻辑时，让新代码尽量符合 Google Style。
- 如果本次对该文件改动较大，可顺带系统性整理风格。
- 若风格修复很多，单独拆一个变更更利于审查。

❌ **错误做法**

- 因为文件历史风格不好，就继续复制坏风格写新代码。
- 在一个功能改动里顺便全文件大洗牌，导致审查者看不出真正业务变化。

---

### 6. 新增文件默认必须符合 Google Style

> **规则：全新文件不受同目录旧代码历史包袱影响，从一开始就按规范写**

✅ **正确做法**

```javascript
// 新建模块时，直接使用 const/let、命名导出、统一 JSDoc、2 空格缩进。
export function normalizeName(name) {
  return name.trim();
}
```

❌ **错误做法**

```javascript
// 因为同目录有旧代码，就继续沿用 var、default export、缺省分号等坏习惯。
export default function(name){return name.trim()}
```

---

### 7. 项目可以加本地规则，但不能让它们压过基础可维护性

> **规则：团队可以在 Google Style 之上增补规则，但不要过度细化到阻碍清理和重构**

好的附加规则应服务于清晰度、一致性与自动化，而不是制造形式主义负担。

✅ **正确做法**

- 在项目内额外规定 import 分组顺序、测试文件命名模式。
- 使用 formatter / linter 自动固化本地约定。

❌ **错误做法**

- 为极边缘情况增加大量人工判断规则。
- 把对历史清理友好的变更卡在本地小规则上。

---

### 8. 生成代码大多不要求完全遵守风格，但暴露给手写代码的标识符必须规范

> **规则：构建产物和生成代码可以部分豁免，但凡要被手写源码引用的名字，必须满足命名规范**

✅ **正确做法**

- 生成的客户端代码可保留工具输出格式。
- 若生成符号要被业务代码直接调用，其导出名仍使用规范命名。

❌ **错误做法**

- 让生成代码暴露一批无法理解、不可预测、与项目命名风格冲突的公共标识符。

---

## 八、最后建议

---

### 1. 在今天的工程实践里，JavaScript 规范更多是“存量治理规则”

> **规则：如果项目条件允许，优先使用 TypeScript；如果必须写 JavaScript，就把风格、JSDoc、模块边界和可维护性做到位**

Google 官方已经明确把推荐方向转向 TypeScript，但这不意味着 JavaScript 可以随意写。恰恰相反，在没有类型系统兜底的情况下，**命名、结构、JSDoc、模块纪律和格式一致性会更重要**。

✅ **正确做法**

- 新功能优先评估是否直接落在 TypeScript。
- JavaScript 文件保持稳定的 JSDoc、导出边界和命名规则。
- 对存量 JS 做增量治理，而不是无限期放任。

❌ **错误做法**

- 因为“以后会迁移 TypeScript”，就放弃当前 JavaScript 文件的维护质量。
- 让 JS 文件同时失去类型注释、结构规范和命名一致性，增加未来迁移成本。
