# Rust 编码规范（中文版）

> 来源：[Rust Coding Guidelines](https://rust-coding-guidelines.github.io/rust-coding-guidelines-zh/overview.html) V 1.0 beta
> 整理日期：2026-04-30
> 状态：已发布章节（122条规则）/ 未发布章节（Trait、错误处理、内存管理、并发、Unsafe、性能、安全等暂缺）

---

## 为什么需要 Rust 编码规范

### 前言

在刚学 Rust 的时候，我赞叹于 Rust 提供的工具之先进性。比如 rustfmt，可以自动格式化代码，clippy 可以帮助你规范代码中写的不地道的地方。它们确实是非常优秀的工具。当时我也认为 Rust 根本不需要像其他语言那样制定编码规范。

但随着对 Rust 越来越深入了解的过程中，我也逐渐发现这些工具的很多不足之处，覆盖的并不全面。比如 rustfmt 配置和使用不当会导致代码错误，而且无法识别 Rust 代码中各种命名的语义；clippy存在一些误报或lint不合理，以及无法覆盖到 Unsafe Rust 等问题。开发者，尤其是新手们，如果长期像使用一个黑盒一样去依赖rustfmt和clippy，但并不去了解其lint背后的原因，只是知其然而无法知其所以然，那在代码质量有一定要求的前提下是无法提升开发效率的。

所以，rutfmt和clippy并不是万能的。我们还需要一个全面且通用的编码规范，并且也能覆盖到像 rustfmt 和 clippy 这样的工具，让广大 Rust 团队通过规范化的原则和规则去了解编写地道 Rust 代码的基本框架，就可以快速落地 Rust ，增强团队间的协作与信任。

### Rustfmt 的局限性

Rust 有自动化格式化工具 rustfmt ，可以帮助开发者摆脱手工调整代码格式的工作，提升生产力。但它并不能代替编码规范对 Rust 代码的编码风格进行规范。

rustfmt主要存在以下缺陷：

1. **Rust 语言是一门非常注重语义的语言**。Rust 中的变量、类型和函数等命名是非常讲究语义的，尤其是所有权语义。rustfmt 工具无法判断代码中命名的语义。这方面利用 Clippy 可以满足部分需求，但是对于开发者来说比较片面。
2. **Rustfmt 如果使用不当或配置不当，会导致问题**。因为rustfmt是自动格式化工具，它会自动修改代码，但是它修改的时候并不会编译代码。如果开发者配置自动保存以后自动执行rustfmt，就会导致代码被修改错误，或者，有一些rustfmt 配置选项配置错误，也可能导致代码修改错误。
3. **rustfmt 工具中的配置项都比较零散**，大部分开发者不会去了解其每一个配置项的含义。
4. **rustfmt 没有覆盖到代码注释和文档注释的编码规范**。

综上所述，需要通过提供一个通用的编码规范，让开发者明确地从命名、格式和注释三方面整体上了解 Rust 遵循什么样的编码风格。

### Clippy 的局限性

Clippy是 Rust 的 linter，是 Rust 生态系统中的主要组件之一。它对已开发的代码执行额外的静态检查，报告发现的问题并解释如何修复它们（有时它甚至可以自动修复它们）。使用它能对 Rust 初学者甚至专业人士都带来好处。

但使用 Clippy 并不是意味着它能代替编码规范，它也存在很多缺陷：

1. **Clippy 缺乏很多 Unsafe Rust 相关的 lint 检测**。Unsafe Rust 是 Rust 非常重要的一部分，需要一个完整的编码规范来覆盖，帮助开发者编写安全的 Unsafe 代码。
2. **Clippy 中的 lint 截止目前有 500多条**，而且还有不断增长的趋势，开发者不可能一条条去了解每个 lint，所以需要一个编码规范帮助开发者对lint进行一个梳理归类。
3. **Clippy 中的lint 的建议和分级 （allow/warning/deny）有些争议**。其中有些 lint 默认是 allow，但不代表在一些场景下，它就是合理的写法；同样，有些 lint 是 warning，但不代表在一些场景下是不合理的。

综上所述，Clippy 虽然是一个十分有用的工具，但它无法替代编码规范。

### 编码规范作用

Rust 编码规范的作用主要是如下方面：

- 遵循 Rust 语言特性，提高代码的可读性、可维护性、健壮性和可移植性。
- 提高 Unsafe Rust 代码编写的规范性和安全性。
- 编程规范条款力争系统化、易应用、易检查，帮助开发者提升开发效率。
- 给开发者一个明确的且全局的视野，在其开发代码的过程中就能遵循好的代码规范，而非等写完代码以后再通过rustfmt和clippy这类的工具，一条一条去修改warning。
- 规范不等于教程，但是开发人员水平参差不齐，对于一些因为知识盲点而可能导致程序错误的地方，规范也将覆盖到。

---

## 编码规范基本约定

### 内容组织说明

编程规范绝不是为了增加开发者的负担而编写的，目的是为了帮助开发者写出高质量的 Rust 代码。

为了达成这个目的，规范条款分为**原则**和**规则**两个类别：

- **原则（Principle, P）**：编程开发时指导的一个大方向，或是指一类情况。也有少部分原则是 Rust 编译器可检测的情况，但是因为编译器诊断信息比较迷惑，所以增加了原则，帮助开发者去避免这类情况。
- **规则（Guideline, G）**：相对原则来说，更加具体，包含正例和反例来进一步说明。有些规则也会增加例外的情况。规则基本都是可以通过 lint 进行检测的。

### 规则内容与 rustfmt 和 clippy 的关系

规范主要分为两大部分内容：**代码风格** 和 **代码实践**。

#### 代码风格

在代码风格中包含代码命名、格式和注释：

- **命名部分**：主要是通过 clippy lint 来检查，有些命名规则 clippy lint未提供检测，则需要自定义lint来支持。
- **格式部分**：主要用 rustfmt 来自动修改，编码规范中的规则对 rustfmt 的大部分配置项进行了分类描述，为了方便开发者进行参考，制定自己的配置项。编码规范中也提供了配置模版。
- **注释部分**：其中包括普通注释和文档注释，规则条目通过 rustfmt 和 clippy 合作来进行规范。

#### 代码实践

代码实践的内容是按照 Rust 语言特性进行分类，每个语言特性都尽量针对日常编码最佳实践进行总结，提取为一条条的原则和规则，方便开发者进行参考。其中大部分规则都是建议，涉及要求的规则基本都是和安全相关。

这部分内容的规则条目基本都依赖 Clippy lint 去检测，但并非是把 Clippy 500 多条 lint 都一一对应为规则。Clippy lint 中涉及很多技巧类的lint，就没有放到规范中。

规则主要是侧重于通用场景下，代码可读性、维护性、安全性、性能这四方面的考量，它仅仅覆盖一小部分（不到 1/5）clippy lint 。另外还有一些规则是clippy lint没有的，需要自定义lint。

### Rust 文档注释与 rustdoc

Rust 除普通注释外，还提供可以直接生成 API 文档的文档注释能力，通常配合 `rustdoc` 和 `cargo doc` 使用。对于公开函数、结构体、枚举、trait、模块等对外接口，应优先使用文档注释，而不是只写普通行注释。

- `///`：用于为其后的语言项编写文档注释，例如函数、结构体、枚举、trait、type alias 以及公开模块成员。
- `//!`：用于为当前模块或当前 crate 编写文档注释，通常放在模块文件或 crate 根文件顶部。
- `cargo doc`：用于为当前 crate 生成 HTML 文档；`cargo doc --open` 可在生成后直接打开。
- 公共 API 的文档注释宜先写单句摘要，再补充行为说明、边界条件、错误语义、panic 条件和必要示例。
- 文档中的示例应尽量保持可编译、可运行，避免文档与实现脱节。

**示例**:

```rust
//! 用户认证模块。

/// 校验 token 是否有效。
///
/// 返回 `Ok(true)` 表示通过校验，返回 `Ok(false)` 表示校验失败。
///
/// # Errors
///
/// 当 token 格式非法时返回错误。
pub fn validate_token(token: &str) -> Result<bool, AuthError> {
    todo!()
}
```

### 内容约定

通过标题前的编号来标识：

- 标识为 **P** 为原则（Principle）。编号方式为 `P.Element.Number`。
- 标识为 **G** 为规则（Guideline）。编号方式为 `G.Element.Number`。
- 当有子目录时。编号方式为 `P.Element.SubElement.Number` 或 `G.Element.SubElement.Number`。
- Number 从 01 开始递增。其中 Element 为领域知识中关键元素的三位英文字母缩略语。

| Element | 解释 | Element | 解释 |
|---------|------|---------|------|
| NAM | 命名 (Naming) | CMT | 注释 (Comment) |
| FMT | 格式 (Format) | TYP | 数据类型 (Data Type) |
| CNS | 常量 (Const) | VAR | 变量 (Variables) |
| EXP | 表达式 (Expression) | CTF | 控制流程 (Control Flow) |
| REF | 引用 (Reference) | PTR | 指针 (Pointer) |
| STR | 字符串 (String) | INT | 整数 (Integer) |
| MOD | 模块 (Module) | CAR | 包管理 (Cargo) |
| MEM | 内存 (Memory) | FUD | 函数设计 (Function Design) |
| MAC | 宏 (Macro) | STV | 静态变量 (Static Variables) |
| GEN | 泛型 (Generic) | TRA | 特质 (Trait) |
| ASY | 异步 (Async) | UNS | 非安全 (Unsafe Rust) |
| CLT | 集合 (Collection) | SCT | 结构体 (Struct) |
| ENM | 枚举体 (Enum) | VEC | 动态长度数组 (Vector) |
| SLC | 切片类型 (Slice) | TUP | 元组 (Tuple) |
| ARR | 固定长度数组类型 (Array) | BOL | 布尔 (Bool) |
| CHR | 字符类型 (Char) | FLT | 浮点数 (Float) |
| SEC | 信息安全 (Security) | | |

---

## 一、命名（Naming）

### [P.NAM.01] 同一个 crate 中标识符的命名规则应该使用统一的词序

**级别**: 原则(P)

**描述**: 具体选择什么样的词序并不重要，但务必要保证同一个 crate 内词序的一致性。若提供与标准库中相似功能的东西时，也要与标准库名称的词性顺序一致。

拿错误类型来举个例子：当 crate 中类型名称都按照 动词-宾语-error 这样的顺序来命名错误类型时，如果要增加新的错误类型，则也需要按同样的词序来增加。

以下是来自标准库的处理错误的一些类型示例：`JoinPathsError`、`ParseBoolError`、`ParseCharError`、`ParseFloatError`、`ParseIntError`、`RecvTimeoutError`、`StripPrefixError`

如果你想新增和标准库相似的错误类型，比如"解析地址错误"类型，为了保持词性一致，应该使用 `ParseAddrError` 名称，而不是 `AddrParseError`。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合：与标准库错误类型一致
struct ParseAddrError{}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：与标准库错误类型词序 "动-宾-Error" 不一致，应该为 ParseAddrError
struct AddrParseError {}
}
```

---

### [P.NAM.02] 为 cargo feature 命名时不应含有无意义的占位词

**级别**: 原则(P)

**描述**: 给 Cargo feature 命名时，不应带有无实际含义的的词语，比如使用 abc 命名来替代 use-abc 或 with-abc。这条原则经常出现在对 Rust 标准库进行可选依赖(optional-dependency) 配置的 crate 上。并且 Cargo 要求 features 应该是相互叠加的，所以像 no-abc 这种负向的 feature 命名实际上并不正确。

#### ✅ 正确的做法

```rust
# In Cargo.toml

[features]
// 符合
default = ["std"]
std = []

rust
// In lib.rs

#![cfg_attr(not(feature = "std"), no_std)
```

#### ❌ 错误的做法

```rust
# In Cargo.toml

[features]
// 不符合
default = ["use-std"]
std = []
// 不符合
no-abc=[]

rust
// In lib.rs

#![cfg_attr(not(feature = "use-std"), no_std)
```

---

### [P.NAM.03] 标识符命名应该符合阅读习惯

**级别**: 原则(P)

**描述**: 标识符的命名要清晰、明了，有明确含义，容易理解。符合英文阅读习惯的命名将明显提高代码可读性。一些好的实践包括但不限于：

- 使用正确的英文单词并符合英文语法，不要使用拼音
- 仅使用常见或领域内通用的单词缩写
- 布尔型变量或函数避免使用否定形式，双重否定不利于理解
- 不要使用 Unicode 标识符

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
let first_name: &str = "John";
let last_name: &str = "Smith";
const ERR_DIR_NOT_SUPPORTED: u32 = 336;
const ERR_DVER_CANCEL_TIMEOUT: u32 = 594;
// 符合
fn is_number(s:&str) -> bool {/* ... */} 
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：使用拼音
let ming: &str = "John";
let xing: &str = "Smith";
// 不符合：含义不明确
const ERROR_NO_1: u32 = 336;
const ERROR_NO_2: u32 = 594;
// 不符合：函数名字表示的函数作用不明了
fn not_number(s:&str) -> bool {/* ... */}
}
```

---

### [P.NAM.04] 作用域越大命名越精确，反之应简短

**级别**: 原则(P)

**描述**: 对于全局函数、全局变量、宏、类型名、枚举命名，应当精确描述并全局唯一。对于函数局部变量，或者结构体、枚举中的成员变量，在其命名能够准确表达含义的前提下，应该尽量简短，避免冗余信息重复描述。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
static MAX_THREAD_COUNT: i32 = 42; 

// 符合：上下文信息已经知道它是 Event
enum WebEvent {
 PageLoad,
 PageUnload,
 KeyPress(char),
 Paste(String),
 Click { x: i64, y: i64 },
}

// 符合：在使用它的地方自然就知道是描述谁的大小
type Size = u16; 
pub struct HeaderMap {
 mask: Size,
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：描述不精确
static GET_COUNT: i32 = 42; 

// 不符合：信息冗余
enum WebEvent {
 PageLoadEvent,
 PageUnloadEvent,
 KeyPressEvent(char),
 PasteEvent(String),
 ClickEvent { x: i64, y: i64 },
}

// 不符合：信息冗余
type MaskSize = u16; 
pub struct HeaderMap {
 mask: MaskSize,
}
}
```

---

### [P.NAM.05] 用于访问或获取数据的 getter 类方法通常不要使用 get_ 前缀

**级别**: 原则(P)

**描述**: 因为 Rust 所有权语义的存在，此例子中两个方法的参数分别是共享引用 &self 和 独占引用 &mut self ，分别代表了 getter 的语义。也存在一些例外情况可以用 get_ 前缀。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
pub struct First;
pub struct Second;

pub struct S {
 first: First,
 second: Second,
}

impl S {
 // 符合
 pub fn first(&self) -> &First {
  &self.first
 }

 // 符合
 pub fn first_mut(&mut self) -> &mut First {
  &mut self.first
 }

 // set_前缀是可以的
 pub fn set_first(&mut self, f: First) {
  self.first = f;
 }
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
pub struct First;
pub struct Second;

pub struct S {
 first: First,
 second: Second,
}

impl S {
 // 不符合：访问成员函数名字不用get_前缀。
 pub fn get_first(&self) -> &First {
  &self.first
 }

 // 不符合：同样不建议 `get_mut_first`, or `mut_first`.
 pub fn get_first_mut(&mut self) -> &mut First {
  &mut self.first
 }

 // set_前缀是可以的
 pub fn set_first(&mut self, f: First) -> &mut First {
  self.first = f;
 }
}
}
```

**例外**: 但也存在例外情况：只有当需要显式的语义来通过 getter 获取某种数据，才会使用 get 命名。例如，Cell::get 可以访问一个 Cell 的内容。对于进行运行时验证的getter，例如边界检查，可以考虑添加一个 Unsafe 的 _unchecked 配套方法。

```rust
#![allow(unused)]
fn main() {
// 进行一些运行时验证，例如边界检查
fn get(&self, index: K) -> Option<&V>;
fn get_mut(&mut self, index: K) -> Option<&mut V>;
// 没有运行时验证，用于在某些情况下提升性能
unsafe fn get_unchecked(&self, index: K) -> &V;
unsafe fn get_unchecked_mut(&mut self, index: K) -> &mut V;
}
```

来自标准库的例子：`std::io::Cursor::get_mut`、`std::ptr::Unique::get_mut`、`std::sync::PoisonError::get_mut`、`std::sync::atomic::AtomicBool::get_mut`、`std::collections::hash_map::OccupiedEntry::get_mut`、`<[T]>::get_unchecked`

---

### [P.NAM.06] 遵循 iter/iter_mut/into_iter 规范来生成迭代器

**级别**: 原则(P)

**描述**: 此规则包含两条基本子规则：

1. 对于容纳 U 类型的容器 (container)，其迭代器方法应该遵循 iter/iter_mut/into_iter 这三种命名方式。
2. 返回的迭代器类型名称也应该和其方法名保持一致，如一个叫做 into_iter() 的方法应该返回一个叫做 IntoIter 的类型。

#### ✅ 正确的做法

```rust
// 符合
fn iter(&self) -> Iter // Iter 实现 Iterator<Item = &U>
fn iter_mut(&mut self) -> IterMut // IterMut 实现 Iterator<Item = &mut U>
fn into_iter(self) -> IntoIter // IntoIter 实现 Iterator<Item = U>
```

#### ❌ 错误的做法

```rust
// 不符合：没必要加 `to_` 前缀
fn to_iter(&self) -> Iter // Iter 实现 Iterator<Item = &U>
fn to_iter_mut(&mut self) -> IterMut // IterMut 实现 Iterator<Item = &mut U>
fn to_into_iter(self) -> IntoIter // IntoIter 实现 Iterator<Item = U>
```

**例外**: 标准库中存在一个例外：str 类型是有效 UTF-8 字节的切片（slice），概念上与同质集合略有差别，所以 str 没有提供 iter / iter_mut / into_iter 命名的迭代器方法，而是提供 str::bytes 方法来输出字节迭代器、str::chars 方法来输出字符迭代器。

**参考**: 参考 [RFC 199](https://github.com/rust-lang/rfcs/blob/master/text/0199-ownership-variants.md)

还有有一些来自标准库的例子可参考：`Vec::iter`、`Vec::iter_mut`、`Vec::into_iter`、`BTreeMap::iter`、`BTreeMap::iter_mut`、`BTreeMap::keys` 返回 `btree_map::Keys`、`BTreeMap::values` 返回 `btree_map::Values`

---

### [P.NAM.07] 避免使用语言内置保留字、关键字、内置类型和 trait 等特殊名称

**级别**: 原则(P)

**描述**: 命名必须要避免使用语言内置的保留字、关键字、内置类型和 trait 等特殊名称。具体可以参考 The Rust Reference-Keywords。

#### ✅ 正确的做法

```rust
// 符合
type Size = u16; 

fn main() {
 // 符合
 let tried = 1;
}
```

#### ❌ 错误的做法

```rust
// 不符合：Rust 内置了 Sized trait 
type Sized = u16; 

fn main() {
 // 不符合：try 为保留关键字
 let try = 1;
}
```

**例外**: 在一些特定场合，比如对接遗留数据库中的字段和 Rust 关键字冲突：

```rust
#![allow(unused)]

fn main() {
struct SomeTable{
 // 使用 `r#`+type 来解决这种问题
 r#type: String
}
}
```

或者当序列化为 json 或 proto 时，存在成员为关键字，则可以通过相关库提供的功能来使用：

```rust
#![allow(unused)]

fn main() {
pub struct UserRepr {
 // ...
 #[serde(rename="self")]
 pub self_: Option<String>,
 // ...
}
}
```

---

### [P.NAM.08] 避免在变量的命名中添加类型标识

**级别**: 原则(P)

**描述**: 因为 Rust 语言类型系统崇尚显式的哲学，所以不需要在变量命名中也添加关于类型的标识。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
let account: Vec<u8> = read_some_input(); // 符合
let account = String::from_utf8(account)?; // 符合
let account: Account = account.parse()?; // 符合
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
let account_bytes: Vec<u8> = read_some_input(); // 不符合：account 的类型很清楚，没必要在命名中加 `_bytes`
let account_str = String::from_utf8(account_bytes)?; // 不符合：account 的类型很清楚，没必要在命名中加 `_str`
let account: Account = account_str.parse()?; // 不符合：account 的类型很清楚，没必要在命名中加 `_str`
}
```

---

### [P.NAM.09] 定义全局静态变量时需加前缀 G_ 以便和常量有所区分

**级别**: 原则(P)

**描述**: 为了提升代码可读性和可维护性，有必要将常量的命名和全局静态变量加以区分。所以在定义全局静态变量时，需要以前缀 G_ 命名。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
static G_EVENT: [i32;5]=[1,2,3,4,5];
const MAGIC_NUM: i32 = 65 ;
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：无法通过命名直接区分常量和静态变量
static EVENT: [i32;5]=[1,2,3,4,5];
const MAGIC_NUM: i32 = 65 ;
}
```

---

### [G.NAM.01] 使用统一的命名风格

**级别**: 规则(G) - 要求

**描述**: Rust 倾向于在"类型"级的结构中使用驼峰（UpperCamelCase）命名风格，在 "变量、值（实例）、函数名"等结构中使用蛇形（snake_case）命名风格。

下面是汇总信息：

| Item | 规范 |
|------|------|
| 包（Crates） | 通常使用 snake_case |
| 模块（Modules） | snake_case |
| 类型（Types） | UpperCamelCase |
| 特质（Traits） | UpperCamelCase |
| 枚举体（Enum variants） | UpperCamelCase |
| 函数（Functions） | snake_case |
| 方法（Methods） | snake_case |
| 通用构造函数（General constructors） | new 或者 with_more_details |
| 转换构造函数（Conversion constructors） | from_some_other_type |
| 宏（Macros） | snake_case! |
| 本地变量（Local variables） | snake_case |
| 静态变量（Statics） | SCREAMING_SNAKE_CASE |
| 常量（Constants） | SCREAMING_SNAKE_CASE |
| 类型参数（Type parameters） | 简明的 UpperCamelCase，通常使用单个大写字母：T |
| 生存期（Lifetimes） | 简短的 lowercase，通常使用单个小写字母 'a, 'de, 'src，尽量保持语义 |
| 特性（Features） | snake_case |

**说明**:

- 在 UpperCamelCase 情况下，由首字母缩写组成的缩略语和复合词的缩写，算作单个词。比如，应该使用 Uuid 而非 UUID，使用 Usize 而不是 USize，或者是 Stdin 而不是 StdIn。
- 在 snake_case 中，首字母缩写和缩略词是小写的 is_xid_start。
- 在 snake_case 或者 SCREAMING_SNAKE_CASE 情况下，每个词不应该由单个字母组成——除非这个字母是最后一个词。比如，使用 btree_map 而不使用 b_tree_map，使用 PI_2 而不使用 PI2。
- 关于包命名：由于历史问题，包名有两种形式 snake_case 或 kebab-case，但实际在代码中需要引入包名的时候，Rust 只能识别 snake_case，也会自动将 kebab-case 识别为 kebab_case。所以建议使用 snake_case。
- Crate 的名称通常不应该使用 -rs 或者 -rust 作为后缀或者前缀。但是有些情况下，比如是其他语言移植的同名 Rust 实现，则可以使用 -rs 后缀来表明这是 Rust 实现的版本。

**参考**: Rust 命名规范在 RFC 0430 中有也描述。

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group |
|-----------|-------------|-------------|------------|
| Rustc: non_camel_case_types | no | yes | Style |
| Rustc: non_snake_case | no | yes | Style |

---

### [G.NAM.02] 类型转换函数命名需要遵循所有权语义

**级别**: 规则(G) - 建议

**描述**: 进行特定类型转换的方法名应该包含以下前缀：

| 名称前缀 | 内存代价 | 所有权 |
|---------|---------|--------|
| as_ | 无代价 | borrowed -> borrowed |
| to_ | 代价昂贵 | borrowed -> borrowed / borrowed -> owned (非 Copy 类型) / owned -> owned (Copy 类型) |
| into_ | 看情况 | owned -> owned (非 Copy 类型) |

以 as_ 和 into_ 作为前缀的类型转换通常是降低抽象层次，要么是查看背后的数据 (as)，要么是分解(deconstructe) 背后的数据 (into)。相对来说，以 to_ 作为前缀的类型转换处于同一个抽象层次，但是底层会做更多工作，比如多了内存拷贝等操作。

当一个类型用更高级别的语义 (higher-level semantics) 封装 (wraps) 一个内部类型时，应该使用 into_inner() 方法名来取出被封装类型的值。这适用于以下封装器：读取缓存 (BufReader)、编码或解码 (GzDecoder)、取出原子 (AtomicBool)、或者任何相似的语义封装 (BufWriter)。

#### ✅ 正确的做法

标准库 API 命名有如下示例：

**as_**
- `str::as_bytes()` 用于查看 UTF-8 字节的 str 切片，这是无内存代价的（不会产生内存分配）。传入值是 &str 类型，输出值是 &[u8] 类型。

**to_**
- `Path::to_str` 对操作系统路径进行 UTF-8 字节检查，开销昂贵。虽然输入和输出都是借用，但是这个方法对运行时产生不容忽视的代价，所以不应使用 as_str 名称。
- `str::to_lowercase()` 生成正确的 Unicode 小写字符，涉及遍历字符串的字符，可能需要分配内存。输入值是 &str 类型，输出值是 String 类型。
- `f64::to_radians()` 把浮点数的角度制转换成弧度制。输入和输出都是 f64。没必要传入 &f64，因为复制 f64 花销很小。但是使用 into_radians 名称就会具有误导性，因为输入数据没有被消耗。

**into_**
- `String::into_bytes()` 从 String 提取出背后的 Vec<u8> 数据，这是无代价的。它转移了 String 的所有权，然后返回具有所有权的 Vec<u8>。
- `BufReader::into_inner()` 转移了 buffered reader 的所有权，取出其背后的 reader，这是无代价的。存于缓冲区的数据被丢弃了。
- `BufWriter::into_inner()` 转移了 buffered writer 的所有权，取出其背后的 writer，这可能以很大的代价刷新所有缓存数据。

如果类型转换方法返回的类型具有 mut 修饰，那么这个方法的名称应如同返回类型组成部分的顺序那样，带有 mut。比如 Vec::as_mut_slice 返回 &mut [T] 类型，这个方法的功能正如其名称所述，所以这个名称优于 as_slice_mut。

其他参考示例：`Result::as_ref`、`RefCell::as_ptr`、`slice::to_vec`、`Option::into_iter`

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | Lint Level |
|-----------|-------------|-------------|------------|------------|
| wrong_self_convention | yes | no | Style | warn |

---

## 二、格式（Format）

### [P.FMT.01] 使用 rustfmt 进行自动格式化代码

**级别**: 原则(P)

**描述**: 应该总是在项目中添加 rustfmt.toml 或 .rustfmt.toml 文件。即使它是空文件，这是向潜在的合作者表明你希望代码是自动格式化的。

**例外**: 在特殊的情况下，可以通过条件编译属性 `#[cfg_attr(rustfmt, rustfmt_skip)]` 或 `#[rustfmt::skip]` 来关闭自动格式化。比如 vec! 中的元素排布是固定格式，这样有助于开发的便利。

```rust
fn main() {
 #[rustfmt::skip] 
 let got = vec![
  0x00, 0x05, 0x01, 0x00,
  0xff,
  0x00,
  0x00,
 
  0x01, 0x0c, 0x02, 0x00,
  0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef,
  b'd', b'e', b'a', b'd', b'b', b'e', b'e', b'f', 0x00,
  0x00,
 
  127, 0x06, 0x03, 0x00,
  0x01, 0x02,
  b'a', b'b', b'c', b'd', 0x00,
  b'1', b'2', b'3', b'4', 0x00,
  0x00,
 ];
}
```

---

### [P.FMT.02] 缩进使用空格而非制表符

**级别**: 原则(P)

**描述**: 缩进要使用四个空格，不要使用制表符（\t）代替。可以通过 IDE 或编辑器把缩进设置为四个空格。

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| tab_spaces | 4 | yes（默认） | 缩进空格数 |
| hard_tabs | false | yes（默认） | 禁止使用tab缩进 |

---

### [P.FMT.03] 行间距最大宽度空一行

**级别**: 原则(P)

**描述**: 代码行之间，最小间隔 0 行，最大间隔 1 行。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
fn foo() {
 println!("a");
}
// 符合：空一行 
fn bar() {
 println!("b");
 println!("c");
}
}
```

或者

```rust
#![allow(unused)]
fn main() {
fn foo() {
 println!("a");
}
fn bar() {
 println!("b");
 // 符合：空一行 
 println!("c");
}

}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
fn foo() {
 println!("a");
}
// 不符合：空两行 
// 不符合：空两行
fn bar() {
 println!("b");
// 不符合：空两行 
// 不符合：空两行
 println!("c");
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| blank_lines_lower_bound | 0（默认） | No | 不空行 |
| blank_lines_upper_bound | 1（默认） | No | 最大空一行 |

---

### [P.FMT.04] 语言项（Item) 定义时左花括号（brace）位置应该与语言项保持同一行

**级别**: 原则(P)

**描述**: 为了保持代码结构的良好可读性，Rust 中定义各种语言项，包括控制结构（if/match 等）、函数、结构体、枚举等，要求左花括号与其定义保持同一行。但是如果携带 where 语句，则要求换行，并且 where 子句和 where 关键字不在同一行。

只需要使用 rustfmt 默认配置即可。

#### ✅ 正确的做法

**函数**:

```rust
#![allow(unused)]
fn main() {
// 符合：左花括号和函数语言项定义在同一行
fn lorem() { 
 // body
}

fn lorem<T>(ipsum: T)
where // 符合：`where` 子句和 `where` 关键字不在同一行
 T: Add + Sub + Mul + Div,
{ // 符合：当有 `where` 子句的时候，花括号换行
 // body
}
}
```

**结构体与枚举**:

```rust
#![allow(unused)]
fn main() {
// 符合
struct Lorem {
 ipsum: bool,
}

// 符合
struct Dolor<T>
where 
 T: Eq,
{
 sit: T,
}
}
```

**流程控制**:

```rust
// 符合
// "AlwaysSameLine" (default)
fn main() {
 if lorem {
  println!("ipsum!");
 } else {
  println!("dolor!");
 }
}
```

#### ❌ 错误的做法

如果设置 brace_style = "AlwaysNextLine"，则不符合：

```rust
#![allow(unused)]
fn main() {
// 不符合：左花括号与函数语言项定义未保持同一行
fn lorem()
{
 // body
}
}
```

如果设置 brace_style = "PreferSameLine"，则不符合（where 语句应换行）：

```rust
#![allow(unused)]
fn main() {
// 不符合：左花括号与 where 语句应该换行
fn lorem<T>(ipsum: T)
where
 T: Add + Sub + Mul + Div, { // 注意这里和 `SameLineWhere`的区别
 // body
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| brace_style | SameLineWhere（默认） | No | 应该与语言项保持同一行，但是 where 语句例外 |
| brace_style | AlwaysNextLine | No | 应该在语言项的下一行 |
| brace_style | PreferSameLine | No | 总是优先与语言项保持同一行，where 语句也不例外 |
| where_single_line | false（默认） | No | 强制将 where 子句放在同一行上 |
| control_brace_style | in control-flow AlwaysSameLine（默认） | No | 总在同一行上，用于控制流程中默认值 |
| control_brace_style | in control-flow ClosingNextLine | No | 用于控制流程中 else 分支在 if 分支结尾处换行 |

---

### [P.FMT.05] 存在多个标识符时应该保持块状（Block）缩进

**级别**: 原则(P)

**描述**: 当在表达式或语言项定义中出现多个标识符，则应该让其保持块状风格缩进。

#### ✅ 正确的做法

**数组**:

```rust
fn main() {
 // 符合：缩进四个空格
 let lorem = vec![
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
 ];
}
```

**流程控制**:

```rust
fn main() {
 // 符合：缩进四个空格
 if lorem_ipsum
  && dolor_sit
  && amet_consectetur
  && lorem_sit
  && dolor_consectetur
  && amet_ipsum
  && lorem_consectetur
 {
  // ...
 }
}
```

**函数参数**:

```rust
#![allow(unused)]
fn main() {
fn lorem() {}
fn lorem(ipsum: usize) {}

// 符合：缩进四个空格
fn lorem(
 ipsum: usize,
 dolor: usize,
 sit: usize,
 amet: usize,
 consectetur: usize,
 adipiscing: usize,
 elit: usize,
) {
 // body
}

}
```

**函数调用**:

```rust
fn main() {
 // 符合：缩进四个空格
 lorem(
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
 );
}
```

**泛型**:

```rust
#![allow(unused)]
fn main() {
// 符合：缩进四个空格
fn lorem<
 Ipsum: Eq = usize,
 Dolor: Eq = usize,
 Sit: Eq = usize,
 Amet: Eq = usize,
 Adipiscing: Eq = usize,
 Consectetur: Eq = usize,
 Elit: Eq = usize,
>(
 ipsum: Ipsum,
 dolor: Dolor,
 sit: Sit,
 amet: Amet,
 adipiscing: Adipiscing,
 consectetur: Consectetur,
 elit: Elit,
) -> T {
 // body
}
}
```

**结构体**:

```rust
fn main() {
 let lorem = Lorem {
  ipsum: dolor,
  sit: amet,
 };
}
```

#### ❌ 错误的做法

```rust
fn main() {
 // 不符合：缩进不符合标准，只是为了对齐
 let lorem = vec!["ipsum",
 "dolor",
 "sit",
 "amet",
 "consectetur",
 "adipiscing",
 "elit"];
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| indent_style | Block（默认） | No | 多个标识符定义保持块状风格，缩进符合标准 |
| indent_style | Visual | No | 多个标识符定义保持对齐风格，但不符合缩进标准 |

---

### [P.FMT.06] 当有多行表达式操作时，操作符应该置于行首

**级别**: 原则(P)

**描述**: 当有多行表达式操作时，操作符应该置于行首，这样有利于代码的可读性和可维护性。

#### ✅ 正确的做法

```rust
fn main() {
 // 符合
 let or = foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo
  || barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar;

 // 符合
 let sum = 123456789012345678901234567890
  + 123456789012345678901234567890
  + 123456789012345678901234567890;

 // 符合
 let range = aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  ..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb;
}
```

#### ❌ 错误的做法

```rust
fn main() {
 // 不符合
 let or = foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo ||
  barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar;
 // 不符合
 let sum = 123456789012345678901234567890 +
  123456789012345678901234567890 +
  123456789012345678901234567890;
 // 不符合
 let range = aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..
  bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb;
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| binop_separator | Front（默认） | No | 换行后，操作符置于行首 |

---

### [P.FMT.07] 枚举变体和结构体字段都应左对齐

**级别**: 原则(P)

**描述**: 对于自定义了判别式的枚举体，和有字段的结构体而言，默认只需要左对齐就可以。这个宽度可以设置为任意值，但默认是 0。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合: 无论变体长度多长，都左对齐
enum Bar {
 A = 0,
 Bb = 1,
 RandomLongVariantGoesHere = 10,
 Ccc = 71,
}
// 符合
enum Bar {
 VeryLongVariantNameHereA = 0,
 VeryLongVariantNameHereBb = 1,
 VeryLongVariantNameHereCcc = 2,
}
}
```

#### ❌ 错误的做法

当 enum_discrim_align_threshold = 20 时：

```rust
#![allow(unused)]
fn main() {
// 不符合：设置了变体长度最大是20
enum Foo {
 A = 0,
 Bb = 1,
 RandomLongVariantGoesHere = 10, // 注意，该变体长度已经超过了20，所以它不会被对齐
 Ccc = 2,
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| enum_discrim_align_threshold | 0（默认） | No | 具有判别式的枚举变体与其他变体进行垂直对齐的最大长度 |
| struct_field_align_threshold | 0（默认） | No | 结构体字段垂直对齐的最大长度 |

---

### [P.FMT.08] 函数参数超过五个或导入模块个数超过四个需换行

**级别**: 原则(P)

**描述**: 五个以内函数参数可以置于一行，超过五个则使用「块」状缩进。导入模块每行超过四个，则换行。

#### ✅ 正确的做法

```rust
#![allow(unused)]

fn main() {
trait Lorem {
 fn lorem(ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet, consectetur: Consectetur);

 fn lorem(ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet) {
  // body
 }

 // 符合
 fn lorem(
  ipsum: Ipsum,
  dolor: Dolor,
  sit: Sit,
  amet: Amet,
  consectetur: Consectetur,
  adipiscing: Adipiscing,
  elit: Elit,
 );

 // 符合
 fn lorem(
  ipsum: Ipsum,
  dolor: Dolor,
  sit: Sit,
  amet: Amet,
  consectetur: Consectetur,
  adipiscing: Adipiscing,
  elit: Elit,
 ) {
  // body
 }
}

use foo::{xxxxxxxxxxxxxxxxxx, yyyyyyyyyyyyyyyyyy, zzzzzzzzzzzzzzzzzz};

// 符合
use foo::{
 aaaaaaaaaaaaaaaaaa, bbbbbbbbbbbbbbbbbb, cccccccccccccccccc, dddddddddddddddddd,
 eeeeeeeeeeeeeeeeee,
};
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
trait Lorem {
 fn lorem(ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet);

 fn lorem(ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet) {
  // body
 }

 // 不符合：超过五个参数未使用块状缩进
 fn lorem(
  ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet, consectetur: Consectetur,
  adipiscing: Adipiscing, elit: Elit,
 );

 fn lorem(
  ipsum: Ipsum, dolor: Dolor, sit: Sit, amet: Amet, consectetur: Consectetur,
  adipiscing: Adipiscing, elit: Elit,
 ) {
  // body
 }
}

use foo::{xxxxxxxxxxxxxxxxxx, yyyyyyyyyyyyyyyyyy, zzzzzzzzzzzzzzzzzz};

// 不符合：模块换行即可，无需使用块状缩进
use foo::{
 aaaaaaaaaaaaaaaaaa,
 bbbbbbbbbbbbbbbbbb,
 cccccccccccccccccc,
 dddddddddddddddddd,
 eeeeeeeeeeeeeeeeee,
 ffffffffffffffffff,
};
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| fn_args_layout | Tall（默认） | Yes | 函数参数五个或以内可以一行，超过五个则使用块状缩进 |
| imports_layout | Mixed（默认） | No | 导入模块每行超过四个则换行 |

---

### [P.FMT.09] 不同的场景，使用不同的空格风格

**级别**: 原则(P)

**描述**: 在冒号之后添加空格，在冒号之前不要加空格。在范围（range）操作符（.. 和 ..=）前后不要使用空格。在 + 或 = 操作符前后要加空格。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
// 当 `space_after_colon=true`
fn lorem<T: Eq>(t: T) {
 let lorem: Dolor = Lorem {
  ipsum: dolor,
  sit: amet,
 };
}

// 符合
// 当 `space_before_colon=false`
fn lorem<T: Eq>(t: T) {
 let lorem: Dolor = Lorem {
  ipsum: dolor,
  sit: amet,
 };
}

// 符合
// 当 `spaces_around_ranges=false`
let lorem = 0..10;
let ipsum = 0..=10;

// 符合
// 当 `type_punctuation_density="Wide"`
fn lorem<Ipsum: Dolor + Sit = Amet>() {
 // body
 let answer = 1 + 2;
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：冒号之后未加空格
// 当 `space_after_colon=false`
fn lorem<T:Eq>(t:T) {
 let lorem:Dolor = Lorem {
  ipsum:dolor,
  sit:amet,
 };
}

// 不符合：冒号之前加空格
// 当 `space_before_colon=true`
fn lorem<T : Eq>(t : T) {
 let lorem : Dolor = Lorem {
  ipsum : dolor,
  sit : amet,
 };
}

// 不符合：`..`前后加空格
// 当 `spaces_around_ranges=true`
let lorem = 0 .. 10;
let ipsum = 0 ..= 10;

// 不符合：`+`和`=`前后加空格
// 当 `type_punctuation_density="Compressed"`
fn lorem<Ipsum: Dolor+Sit=Amet>() {
 // body
 let answer = 1 + 2;
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| space_after_colon | true（默认） | No | 在冒号后面要加空格 |
| space_before_colon | false（默认） | No | 在冒号前面不要加空格 |
| spaces_around_ranges | false（默认） | No | 在 .. 和 ..= 范围操作符前后不要加空格 |
| type_punctuation_density | "Wide"（默认） | No | 在 + 或 = 操作符前后要加空格（此处特指类型签名） |

---

### [P.FMT.10] match 分支应该具有良好的可读性

**级别**: 原则(P)

**描述**: 当 match 分支右侧代码体太长无法和 => 置于同一行需要使用块(block)来包裹。在 match 分支左侧匹配表达式前不要增加管道符( | )

#### ✅ 正确的做法

```rust
// 当 `match_arm_blocks=true`
fn main() {
 match lorem {
  // 符合
  ipsum => { 
   foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(x)
  }
  dolor => println!("{}", sit),
  // 符合
  sit => foo(
   "foooooooooooooooooooooooo",
   "baaaaaaaaaaaaaaaaaaaaaaaarr",
   "baaaaaaaaaaaaaaaaaaaazzzzzzzzzzzzz",
   "qqqqqqqqquuuuuuuuuuuuuuuuuuuuuuuuxxx",
  ),
 }
}

// 当 `match_arm_leading_pipes="Never"`
fn foo() {

 match foo {
  // 符合
  "foo" | "bar" => {}
  "baz"
  | "something relatively long"
  | "something really really really realllllllllllllly long" => println!("x"),
  "qux" => println!("y"),
  _ => {}
 }
}
```

#### ❌ 错误的做法

```rust
// 不符合：与 `=>` 不同行应该用块来包裹
// 当 `match_arm_blocks=false`
fn main() {
 match lorem {
  ipsum => 
   foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(x),
  dolor => println!("{}", sit),
  sit => foo(
   "foooooooooooooooooooooooo",
   "baaaaaaaaaaaaaaaaaaaaaaaarr",
   "baaaaaaaaaaaaaaaaaaaazzzzzzzzzzzzz",
   "qqqqqqqqquuuuuuuuuuuuuuuuuuuuuuuuxxx",
  ),
 }
}

// 当 `match_arm_leading_pipes="Alaways"`
fn foo() {
 match foo {
  // 不符合：分支左侧匹配表达式前不要加管道符
  | "foo" | "bar" => {}
  | "baz"
  | "something relatively long"
  | "something really really really realllllllllllllly long" => println!("x"),
  | "qux" => println!("y"),
  | _ => {}
 }
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| match_arm_blocks | true（默认） | No | 当 match 分支右侧代码体太长无法和 => 置于同一行需要使用块(block)来包裹 |
| match_arm_leading_pipes | Never（默认） | No | 在 match 分支左侧匹配表达式前不要增加管道符 |

---

### [P.FMT.11] 导入模块分组应该具有良好的可读性

**级别**: 原则(P)

**描述**: 导入同一模块的类型，应该置于同一个块内（imports_granularity="Crate"）。模块导入应该按以下规则进行分组（group_imports="StdExternalCrate"）：

1. 导入来自 std、core 和 alloc 的模块需要置于前面。
2. 导入来自第三方库的模块应该置于中间。
3. 导入来自本地 self、super 和 crate 前缀的模块，置于后面。

分组内使用字典序进行排序（reorder_imports=true）。

#### ✅ 正确的做法

**例1**:

```rust
#![allow(unused)]
fn main() {
// 符合
// 当 `imports_granularity="Crate"`
use foo::{
 a, b,
 b::{f, g},
 c,
 d::e,
};
use qux::{h, i};
}
```

**例2**:

```rust
#![allow(unused)]
fn main() {
// 符合
// 当 `group_imports="StdExternalCrate"` 且 `reorder_imports=true`
use alloc::alloc::Layout;
use core::f32;
use std::sync::Arc;

use broker::database::PooledConnection;
use chrono::Utc;
use juniper::{FieldError, FieldResult};
use uuid::Uuid;

use super::schema::{Context, Payload};
use super::update::convert_publish_payload;
use crate::models::Event;
}
```

#### ❌ 错误的做法

**例1**:

```rust
#![allow(unused)]
fn main() {
// 不符合：同一模块类型应该置于同一个块内
// 当 `imports_granularity="Preserve"`
use foo::b;
use foo::b::{f, g};
use foo::{a, c, d::e};
use qux::{h, i};
}
```

**例2**:

```rust
#![allow(unused)]
fn main() {
// 不符合：当按默认值设置时，模块导入比较乱，影响可读性
use super::update::convert_publish_payload;
use chrono::Utc;

use alloc::alloc::Layout;
use juniper::{FieldError, FieldResult};
use uuid::Uuid;

use std::sync::Arc;

use broker::database::PooledConnection;

use super::schema::{Context, Payload};
use crate::models::Event;
use core::f32;
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| imports_granularity | Preserve（默认），Crate(推荐) | No | 默认保留开发者的模块导入顺序 |
| reorder_imports | true（默认） | No | 模块分组内根据模块首字母按字典序进行排序 |
| group_imports | Preserve（默认），StdExternalCrate（建议） | No | 默认保留开发者的模块导入分组 |

---

### [P.FMT.12] 声明宏分支应该具有良好的可读性

**级别**: 原则(P)

**描述**: 在声明宏中，模式匹配分支（=> 左侧）应该使用紧凑格式（format_macro_matchers=true）。而分支代码体（=> 右侧）使用宽松格式。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 当 `format_macro_matchers=true` 且 `format_macro_bodies=true`
macro_rules! foo {
 // 符合：匹配分支紧凑格式，`$a:ident` 和 `$b:ty` 各自配对
 ($a:ident : $b:ty) => {
  $a(42): $b; // 在代码体内，则宽松一点
 };
 // 符合
 ($a:ident $b:ident $c:ident) => {
  $a = $b + $c;
 };
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：匹配分支使用了宽松格式
// 当 `format_macro_matchers=false`且 `format_macro_bodies=true`
macro_rules! foo {
 ($a: ident : $b: ty) => {
  $a(42): $b;
 };
 ($a: ident $b: ident $c: ident) => {
  $a = $b + $c;
 };
}

// 不符合：分支代码体使用了紧凑格式
// 当 `format_macro_matchers=false`且 `format_macro_bodies=false`
macro_rules! foo {
 ($a: ident : $b: ty) => {
  $a(42):$b;
 };
 ($a: ident $b: ident $c: ident) => {
  $a=$b+$c;
 };
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| format_macro_matchers | false（默认），true(建议) | No | 声明宏模式匹配分支（=> 左侧）中要使用紧凑格式 |
| format_macro_bodies | true（默认） | No | 声明宏分支代码体（=> 右侧）使用宽松格式 |

---

### [P.FMT.13] 具名结构体字段初始化时不要省略字段名

**级别**: 原则(P)

**描述**: 因为本规则依赖于 rustfmt，而 rustfmt 会根据相应配置项对代码进行自动更改，为了确保不会因为 rustfmt 配置项的更改而导致代码错误，请在遵循 rustfmt 使用注意事项的基础上遵循本规则：省略字段名的时候需要注意变量名和字段名保持一致。变量名和字段名不一致的情况下，不要省略字段名。

#### ✅ 正确的做法

```rust
struct Foo {
 a: u32,
 y: u32,
 z: u32,
}

fn main() {
 let x = 1;
 let y = 2;
 let z = 3;
 // 符合
 let a = Foo { a: x, y: y, z: z };
}
```

#### ❌ 错误的做法

```rust
struct Foo {
 a: u32, // 注意这里是 a
 y: u32,
 z: u32,
}

fn main() {
 let x = 1;
 let y = 2;
 let z = 3;
 // 不符合：如果允许省略字段名，并且 rustfmt 配置 `use_field_init_shorthand`改为`true`时，
 // 下面代码中字段`a`就会被 rustfmt 删除，变为 `Foo{x, y, z}`，从而造成错误
 let a = Foo { a: x, y, z };
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| use_field_init_shorthand | false（默认） | Yes | 具名结构体字段初始化不能省略字段名 |

---

### [P.FMT.14] extern 外部函数需要显式指定 C-ABI

**级别**: 原则(P)

**描述**: 当使用 extern 指定外部函数时，建议显式指定 C-ABI。虽然 extern 不指定的话默认就是 C-ABI，但是 Rust 语言显式指定是一种约定俗成。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
extern "C" {
 pub static lorem: c_int;
}

extern "Rust" {
 type MyType;
 fn f(&self) -> usize;
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：不要省略 C-ABI 指定
extern {
 pub static lorem: c_int;
}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| force_explicit_abi | true（默认） | Yes | extern 外部函数总是要指定 ABI |

---

### [P.FMT.15] 解构元组的时候允许使用 .. 来指代剩余元素

**级别**: 原则(P)

**描述**: rustfmt 可以由 condense_wildcard_suffixes 配置项来格式化此规则，其默认选项是 false，表示不允许解构元组的时候使用 .. 来指代剩余元素，所以需要修改默认配置项的值为 true 才符合规范。

#### ✅ 正确的做法

设置 condense_wildcard_suffixes = true 时，会强行更改代码为下面形式。

```rust
fn main() {
 // 符合
 let (lorem, ipsum, ..) = (1, 2, 3, 4);
 let (lorem, _,ipsum, ..) = (1, 2, 3, 4, 5);
}
```

#### ❌ 错误的做法

默认情况下，rustfmt 不会自动更改代码，会保留原来的写法。

```rust
fn main() {
 // 不符合：应该使用`..`
 let (lorem, ipsum, _, _) = (1, 2, 3, 4);
 let (lorem, _,ipsum, _, _) = (1, 2, 3, 4, 5);
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| condense_wildcard_suffixes | false（默认），true（推荐） | No | 解构元组的时候是否允许使用 .. 来指代剩余元素 |

---

### [P.FMT.16] 不要将派生宏中多个不相关的特质合并为同一行

**级别**: 原则(P)

**描述**: 不要将派生宏（Derive）中多个特质（trait）合并为同一行，这样可以增加代码可读性，明确语义。rustfmt 配置项 merge_derives 用于匹配此格式，其默认值是让派生宏中多个特质在同一行，所以需要修改其默认值。

#### ✅ 正确的做法

修改默认设置 merge_derives = false，符合。

```rust
#![allow(unused)]
fn main() {
// 符合
#[derive(Eq, PartialEq)]
#[derive(Debug)]
#[derive(Copy, Clone)]
pub enum Foo {}
}
```

#### ❌ 错误的做法

当使用默认设置 merge_derives = true 时，不符合。

```rust
#![allow(unused)]
fn main() {
// 不符合：不相关的特质放到一行
#[derive(Eq, PartialEq, Debug, Copy, Clone)]
pub enum Foo {}
}
```

**rustfmt 配置**:

| 对应选项 | 可选值 | 是否 stable | 说明 |
|---------|--------|-------------|------|
| merge_derives | true（默认），false（推荐） | Yes | 是否将多个 Derive 宏合并为同一行 |

---

## 三、常量（Const）

### [G.CNS.01] 对于科学计算中涉及浮点数近似值的常量宜使用预定义常量

**级别**: 规则(G) - 建议

**描述**: Rust 标准库中已经提供了一些特殊常量的定义，其精确度通常会比开发者自行定义的高，所以若考虑数值精确度时则宜使用标准库已定义的特殊常量。这些特殊常量都可以在标准库中找到，例如 std::f32::consts

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
let x = std::f32::consts::PI; // 符合
let y = std::f64::consts::FRAC_1_PI; // 符合
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
let x = 3.14; // 不符合：自定义 Pi
let y = 1_f64 / x; // 不符合
}
```

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | level |
|-----------|-------------|-------------|------------|-------|
| approx_constant | yes | no | Correctness | deny |

该 Lint 默认为 deny，但在某些场景下，可以设置为 allow，`#![allow(clippy::approx_constant)]`。

---

### [G.CNS.02] 不应断言常量布尔类型

**级别**: 规则(G) - 建议

**描述**: 此类语句会被编译器优化掉。最好直接使用 panic! 或 unreachable! 代替。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
panic!("something");
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合
const B: bool = false;
assert!(B);
assert!(true);
}
```

**例外**: 该示例需要维护一个常量的不变性，确保它在未来修改时不会被无意中破坏。类似于 static_assertions 的作用。

```rust
#![allow(unused)]
#![allow(clippy::assertions_on_constants)]
fn main() {
const MIN_OVERFLOW: usize = 8192;
const MAX_START: usize = 2048;
const MAX_END: usize = 2048;
const MAX_PRINTED: usize = MAX_START + MAX_END;
assert!(MAX_PRINTED < MIN_OVERFLOW);
}
```

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | level |
|-----------|-------------|-------------|------------|-------|
| assertions_on_constants | yes | no | Style | warn |

---

### [G.CNS.03] 不应将内部可变性容器声明为常量

**级别**: 规则(G) - 要求

**描述**: 由于常量有内联的特性。若将一个内容可变容器声明为常量，那么在引用它的时候同样会新建一个实例，这样会破坏内容可变容器的使用目的，所以需要将它的值存储为静态（static）或者直接将其定义为静态。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
use std::sync::atomic::{AtomicUsize, Ordering::SeqCst};
const CONST_ATOM: AtomicUsize = AtomicUsize::new(12);

// 符合
static STATIC_ATOM: AtomicUsize = CONST_ATOM;
STATIC_ATOM.store(9, SeqCst);
assert_eq!(STATIC_ATOM.load(SeqCst), 9); // 使用`static`, 故上下文的STATIC_ATOM皆指向同一个实例

// 符合：或直接声明为 static
static ANOTHER_STATIC_ATOM: AtomicUsize = AtomicUsize::new(15);
ANOTHER_STATIC_ATOM.store(9, SeqCst);
assert_eq!(ANOTHER_STATIC_ATOM.load(SeqCst), 9);
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
use std::sync::atomic::{AtomicUsize, Ordering::SeqCst};
const CONST_ATOM: AtomicUsize = AtomicUsize::new(12);

// 不符合
CONST_ATOM.store(6, SeqCst); // 此处相当于新建了一个 atomic 实例，所以原容器内容并未改变
assert_eq!(CONST_ATOM.load(SeqCst), 12); // 仍为 12，因为这两行的 CONST_ATOM 为不同实例
}
```

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | level |
|-----------|-------------|-------------|------------|-------|
| borrow_interior_mutable_const | yes | no | Style | warn |
| declare_interior_mutable_const | yes | no | Style | warn |

---

### [G.CNS.04] 不应在常量定义中增加显式的 'static 生命周期

**级别**: 规则(G) - 要求

**描述**: 在常量和静态变量声明时已经默认含有隐式的 'static 生命周期，所以不需要额外增加显式 'static。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
const FOO: &[(&str, &str, fn(&Bar) -> bool)] = &[...]
 static FOO: &[(&str, &str, fn(&Bar) -> bool)] = &[...]
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合
const FOO: &'static [(&'static str, &'static str, fn(&Bar) -> bool)] =
&[...]
static FOO: &'static [(&'static str, &'static str, fn(&Bar) -> bool)] =
&[...]
}
```

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | level |
|-----------|-------------|-------------|------------|-------|
| redundant_static_lifetimes | yes | no | Style | warn |

---

### [G.CNS.05] 对于适用 const fn 的函数或方法宜尽可能地使用 const fn

**级别**: 规则(G) - 建议

**描述**: 函数或方法缺失 const 关键词时无法被指派给常量。但是要注意不是所有函数都能使用 const fn，因为相比一般函数或方法，const fn 在使用时会有限制，必须满足 const 安全，如果不满足，编译器会报告错误信息。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
const fn foo() -> usize {
 10
} 

const BAZ: usize = foo(); // 符合
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
fn foo() -> usize {
 10
}

// 不符合：必须是 constant 函数才能用于声明 const 常量
const BAZ: usize = foo(); 
}
```

**例外**:

```rust
#![allow(unused)]
fn main() {
const fn foo() -> bool {
 for _i in 0..5 {} // ERROR, 因为 for loop 默认不能用在 const fn 内（需要注明 #![feature(const_for)]）
 false
}
}
```

**Lint 检测**:

| lint name | Clippy 可检测 | Rustc 可检测 | Lint Group | level |
|-----------|-------------|-------------|------------|-------|
| missing_const_for_fn | yes | no | Perf | warn |

---

## 四、静态变量（Static Variables）

### [G.STV.01] 不宜直接使用可变静态变量作为全局变量

**级别**: 规则(G) - 建议

**描述**: 对可变静态变量直接进行全局修改是 Unsafe 的。在多线程应用中，修改静态变量会导致数据竞争（data race）。

#### ✅ 正确的做法

如果必须使用的话，可以通过 thread_local! 宏在本地线程中使用内部可变性容器：

```rust
#![allow(unused)]
fn main() {
thread_local!{
 // 符合
 static NEXT_USER_ID: Cell<u64> = Cell::new(0);
}
}
```

若需要变更的值的类型为整数或布尔时，可直接使用 atomic：

```rust
#![allow(unused)]
fn main() {
use std::sync::atomic::{AtomicUsize, Ordering::SeqCst};

// 符合
static NUM_OF_APPLES: AtomicUsize = AtomicUsize::new(0);

fn buy_apple(count: usize) {
 NUM_OF_APPLES.fetch_add(count, SeqCst);
}

fn eat_apple() {
 NUM_OF_APPLES.fetch_sub(1, SeqCst);
}
}
```

补充说明：若需修改整数或布尔之外的数据类型时，可考虑使用 Mutex 或 Rwlock 配合 once_cell 对全局变量进行变更。（注: once_cell 目前已经被引入到 Nightly 版本的标准库中但还不稳定, 可参考 std::lazy。若要在 Stable 版本下使用，则需要引入第三方库 once_cell。）

上述示例亦可通过使用第三方库 lazy_static 的方式实现。

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合
static mut NUM_OF_APPLES: usize = 0;

unsafe fn buy_apples(count: usize) {
 NUM_OF_APPLES += count;
}

unsafe fn eat_apple() {
 NUM_OF_APPLES -= 1;
}
}
```

**例外**: 在使用 FFI 引用外部，例如 C 的函数时，其本身有可能会返回全局变量。通常情况下直接修改 static mut 会有线程安全风险，但若配合使用 std::sync::Once 则可保证该变量只初始化一次，不会产生线程安全风险。

**定制化参考**: 这条规则如果需要定制 Lint，则应考虑两种情况：
1. 代码中定义为 static mut 的变量是否仅被用于 FFI
2. 代码中定义为 static mut 的变量是否经过 call_once 初始化

---

## 五、变量（Variables）

### [P.VAR.01] 一般情况下避免先声明可变变量再赋值

**级别**: 原则(P)

**描述**: 一般情况下，不要先声明一个可变的变量，然后在后续过程中再去改变它的值。声明一个变量的时候，要对其进行初始化。如果后续可能会改变其值，要考虑优先使用变量遮蔽（继承式可变）功能。如果需要在一个子作用域内改变其值，再使用可变绑定或可变引用。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
let base : u8 = if cfg!(not(USB_PROTOCOL_NEW_ARCH)) {
 other_instance.base
} else {
 42u8
}
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合
let mut base : u8;
if cfg!(not(USB_PROTOCOL_NEW_ARCH)) {
 base = other_instance.base;
} else {
 base = 42u8;
}
}
```

---

### [P.VAR.02] 利用变量遮蔽功能保证变量安全使用

**级别**: 原则(P)

**描述**: 在某些场景，可能会临时准备或处理一些数值，但在此之后，数据只用于检查而非修改。那么可以将其通过变量遮蔽功能，重新绑定为不可变变量，来表明这种临时可变，但后面不变的意图。

#### ✅ 正确的做法

```rust
#![allow(unused)]
fn main() {
// 符合
let mut data = get_vec();
data.sort(); // 临时需要排序
let data = data; // 符合：后面就不需要改动了，由编译器可以确保

// `data` 在后面不会再被改变
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
fn main() {
// 不符合：代码语义上没有表现出来先改变，后不变那种顺序语义
let data = {
 let mut data = get_vec();
 data.sort()
 data 
}

// `data` 在后面不会再被改变
}
```

---

### [G.VAR.01] 以解构元组方式定义超过四个变量时不应使用太多无意义变量名

**级别**: 规则(G) - 建议

**描述**: 在以解构元组的方式定义超过四个变量时，变量名可能是无特别语义的，如用单个字符表示的临时变量。但是不宜使用过多无意义变量名。

#### ✅ 正确的做法

元组元素超过四个的，建议使用包含语义的变量命。

```rust
#![allow(unused)]
#![warn(clippy::many_single_char_names)]
fn main() {
// 符合
let (width, high, len, shape, color, status) = (...);
}
```

#### ❌ 错误的做法

```rust
#![allow(unused)]
#![warn(clippy::