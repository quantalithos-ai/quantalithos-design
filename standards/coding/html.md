# Google HTML/CSS 编码规范（中文版 + 正误示例）

> 来源：[Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
> 本文档参考原始指南整理，并为主要规则补充了 **正确做法 ✅** 与 **错误做法 ❌** 的对照示例。
> 适用于原始 HTML、CSS、Sass、GSS 等工作文件；允许后续由工具压缩、混淆或编译，但不能牺牲源代码可读性与一致性。

---

## 一、通用规则

---

### 1. 外部资源统一使用 HTTPS

> **规则：嵌入图片、样式、脚本等资源时，优先使用 `https:`**

协议相对地址（如 `//cdn.example.com/...`）和明文 `http:` 都会增加安全与兼容风险。只要资源支持 HTTPS，就应明确写出 `https:`。

✅ **正确做法**

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<link rel="stylesheet" href="https://cdn.example.com/styles/main.css">
```

```css
@import 'https://fonts.googleapis.com/css?family=Open+Sans';
```

❌ **错误做法**

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
```

```css
@import '//fonts.googleapis.com/css?family=Open+Sans';
@import 'http://fonts.googleapis.com/css?family=Open+Sans';
```

---

### 2. 缩进统一为 2 个空格

> **规则：HTML 与 CSS 一律使用 2 个空格缩进，禁止混用 Tab**

2 空格缩进能在较窄列宽中保留更好的层级可读性。HTML 的嵌套结构和 CSS 的规则块都应统一此风格。

✅ **正确做法**

```html
<ul>
  <li>Apple</li>
  <li>Orange</li>
</ul>
```

```css
.card {
  color: #333;
  margin: 0;
}
```

❌ **错误做法**

```html
<ul>
	<li>Apple</li>
    <li>Orange</li>
</ul>
```

```css
.card {
	color: #333;
    margin: 0;
}
```

---

### 3. 代码统一使用小写

> **规则：HTML 元素、属性、CSS 选择器、属性名、颜色值等统一小写**

除字符串内容或 `text/CDATA` 等特殊场景外，源码中的标记与样式表达都应保持小写，以减少视觉噪声和大小写不一致问题。

✅ **正确做法**

```html
<img src="logo.png" alt="Company logo">
<a href="/docs">docs</a>
```

```css
.button-primary {
  color: #e5e5e5;
}
```

❌ **错误做法**

```html
<IMG SRC="logo.png" ALT="Company logo">
<A HREF="/docs">docs</A>
```

```css
.ButtonPrimary {
  COLOR: #E5E5E5;
}
```

---

### 4. 删除所有行尾空格

> **规则：源码末尾不要保留多余空白字符**

行尾空格没有语义价值，却会让 diff 噪声增多，也更容易造成格式化和合并冲突。

✅ **正确做法**

```html
<p>Yes please.</p>
```

```css
.notice {
  color: #444;
}
```

❌ **错误做法**

```html
<p>Yes please.   </p>
```

```css
.notice {    
  color: #444;   
}    
```

---

### 5. 文件编码使用 UTF-8（无 BOM）

> **规则：HTML 文档显式声明 UTF-8，样式文件默认按 UTF-8 处理**

编辑器与团队协作应统一为 UTF-8，无 BOM。HTML 模板或页面需要通过 `<meta charset="utf-8">` 声明编码；普通 CSS 文件通常不需要额外声明编码。

✅ **正确做法**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>示例页面</title>
  </head>
</html>
```

❌ **错误做法**

```html
<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=gbk">
    <title>示例页面</title>
  </head>
</html>
```

---

### 6. 注释解释目的与原因，而不是逐字翻译代码

> **规则：只在必要时写注释，重点说明代码覆盖范围、目的和选择原因**

HTML/CSS 的注释不要求无处不在，但复杂结构、兼容性处理、布局策略、设计约束等都应该有简明说明。

✅ **正确做法**

```html
<!-- Product card: keeps summary and action buttons aligned across breakpoints -->
<section class="product-card">
  ...
</section>
```

```css
/* Keep avatar square so lazy-loaded images do not cause layout shift. */
.user-avatar {
  aspect-ratio: 1 / 1;
}
```

❌ **错误做法**

```html
<!-- div start -->
<div class="product-card"></div>
```

```css
/* set color */
.title {
  color: #222;
}
```

---

### 7. 待办事项统一写成 `TODO: ...`

> **规则：所有待办、后续动作、临时提醒统一使用 `TODO:` 前缀**

不要混用 `@@`、`FIXME`、`待补充` 等多种格式。统一关键字更便于工具扫描和团队检索。

✅ **正确做法**

```html
<!-- TODO: Remove optional tags after template migration. -->
<ul>
  <li>Apples</li>
  <li>Oranges</li>
</ul>
```

```css
/* TODO: Replace magic width with design token. */
.sidebar {
  width: 248px;
}
```

❌ **错误做法**

```html
<!-- @@ later cleanup -->
<div class="legacy-block"></div>
```

```css
/* fixme maybe update */
.sidebar {
  width: 248px;
}
```

---

## 二、HTML 规范

---

### 1. 文档必须声明 `<!doctype html>`

> **规则：所有 HTML 文档默认进入标准模式，必须以 `<!doctype html>` 开头**

缺失 doctype 或使用不合适的 doctype 可能触发 quirks mode，导致布局和盒模型行为偏离预期。

✅ **正确做法**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dashboard</title>
  </head>
  <body>
    <main>...</main>
  </body>
</html>
```

❌ **错误做法**

```html
<html>
  <head>
    <title>Dashboard</title>
  </head>
  <body>
    <main>...</main>
  </body>
</html>
```

---

### 2. 尽量保持 HTML 有效

> **规则：优先编写可通过校验器检查的有效 HTML**

有效 HTML 是可维护性的基线。除非为了极端的性能或体积目标做出明确取舍，否则应避免未闭合标签、非法嵌套、重复属性等问题。

✅ **正确做法**

```html
<!doctype html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```

❌ **错误做法**

```html
<title>Test</title>
<article>This is only a test.
```

---

### 3. 按语义选择元素，而不是只看默认样式

> **规则：标题用标题标签、段落用 `p`、链接用 `a`，元素要符合其语义职责**

语义化 HTML 对可访问性、SEO、复用性和后续维护都更友好。不要为了省事把所有内容都写成 `div` 和 `span`。

✅ **正确做法**

```html
<a href="/recommendations/">All recommendations</a>
```

```html
<h2>Order Summary</h2>
<p>Your order has been shipped.</p>
```

❌ **错误做法**

```html
<div onclick="goToRecommendations();">All recommendations</div>
```

```html
<div class="title">Order Summary</div>
<div>Your order has been shipped.</div>
```

---

### 4. 多媒体必须提供替代内容

> **规则：图片、视频、音频、`canvas` 等多媒体内容要提供可替代访问方式**

图片应提供有意义的 `alt` 文本；视频和音频应尽量提供字幕、文稿或其他辅助说明。纯装饰图片可使用空 `alt`。

✅ **正确做法**

```html
<img src="spreadsheet.png" alt="Spreadsheet screenshot.">
```

```html
<img src="divider.svg" alt="">
<video controls>
  <source src="demo.mp4" type="video/mp4">
  <track kind="captions" src="demo.zh.vtt" srclang="zh" label="中文">
</video>
```

❌ **错误做法**

```html
<img src="spreadsheet.png">
```

```html
<canvas id="sales-chart"></canvas>
```

---

### 5. 严格分离结构、表现和行为

> **规则：HTML 负责结构，CSS 负责样式，JavaScript 负责行为**

不要在 HTML 中写内联样式，也不要把行为逻辑直接写在标签属性里。模板只保留必要的结构信息，把表现层和交互层挪到专门文件中。

✅ **正确做法**

```html
<!doctype html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I am separating structure from presentation.</p>
<button class="menu-button" data-action="open-menu">Menu</button>
<script src="menu.js"></script>
```

❌ **错误做法**

```html
<!doctype html>
<title>Mixed concerns</title>
<h1 style="font-size: 1em; color: red;">Mixed concerns</h1>
<button onclick="openMenu()" style="padding: 12px;">Menu</button>
<center>Legacy layout</center>
```

---

### 6. 不滥用实体引用

> **规则：在 UTF-8 环境中，普通字符直接写字符本身；只对 HTML 特殊字符做必要转义**

像 `&mdash;`、`&rdquo;`、`&#x263a;` 这类实体引用通常没有必要。真正必须转义的是 `<`、`&` 等在 HTML 中有特殊意义的字符，以及某些不可见控制字符。

✅ **正确做法**

```html
<p>The currency symbol for the Euro is “€”.</p>
<p>Use &lt;section&gt; for grouped content.</p>
```

❌ **错误做法**

```html
<p>The currency symbol for the Euro is &ldquo;&eur;&rdquo;.</p>
<p>Smile: &#x263a;</p>
```

---

### 7. 可选标签可以省略，但要全项目一致（可选）

> **规则：出于体积和可扫描性考虑，可省略 HTML5 允许省略的标签，但不要半套执行**

这是一条可选规则。如果团队决定采用，就应系统性地省略同类可选标签，而不是同一个项目里有人省略、有人保留。

✅ **正确做法**

```html
<!doctype html>
<title>Saving bytes</title>
<p>Qed.
```

❌ **错误做法**

```html
<!doctype html>
<html>
  <head>
    <title>Spending bytes</title>
  </head>
  <body>
    <p>Sic.</p>
  </body>
</html>
```

---

### 8. 样式与脚本默认省略 `type` 属性

> **规则：HTML5 下引用 CSS 和 JavaScript 时不要再写默认 `type`**

`text/css` 和 `text/javascript` 已是默认值。除非你使用的不是 CSS 或 JavaScript，否则不要额外写 `type`。

✅ **正确做法**

```html
<link rel="stylesheet" href="https://www.google.com/css/maia.css">
<script src="https://www.google.com/js/gweb/analytics/autotrack.js"></script>
```

❌ **错误做法**

```html
<link rel="stylesheet" href="https://www.google.com/css/maia.css" type="text/css">
<script src="https://www.google.com/js/gweb/analytics/autotrack.js" type="text/javascript"></script>
```

---

### 9. 避免无意义 `id`，必要时使用连字符

> **规则：优先用 `class` 做样式钩子，用 `data-*` 做脚本钩子；必须使用 `id` 时，值应带连字符**

现代组件化页面中，`id` 很容易与全局命名冲突。HTML 规范还可能把某些 `id` 暴露到 `window` 上，进一步增加副作用风险。

✅ **正确做法**

```html
<div class="user-profile" data-role="profile-card"></div>
```

```html
<div aria-describedby="user-profile">
  <div id="user-profile"></div>
</div>
```

❌ **错误做法**

```html
<div id="userProfile"></div>
```

```html
<div id="profile"></div>
```

---

### 10. 块级、列表、表格元素应独占一行

> **规则：每个块级元素、列表项、表格结构元素都应单独换行，并按层级缩进**

即使 CSS 可以改变元素的显示方式，HTML 源码仍应按结构层级排版。这样在 diff、审查和模板维护时更直观。

✅ **正确做法**

```html
<blockquote>
  <p><em>Space</em>, the final frontier.</p>
</blockquote>
```

```html
<table>
  <thead>
    <tr>
      <th scope="col">Income</th>
      <th scope="col">Taxes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$5.00</td>
      <td>$4.50</td>
    </tr>
  </tbody>
</table>
```

❌ **错误做法**

```html
<blockquote><p><em>Space</em>, the final frontier.</p></blockquote>
```

```html
<table><thead><tr><th>Income</th><th>Taxes</th></tr></thead><tbody><tr><td>$5.00</td><td>$4.50</td></tr></tbody></table>
```

---

### 11. 长属性行按一致方式换行（可选）

> **规则：HTML 没有强制列宽，但超长标签应按统一策略换行，并让续行明显区别于子元素**

当一个标签有较多属性时，可以整块换行，也可以保留一部分在首行，但整个项目要保持一致。

✅ **正确做法**

```html
<button
  mat-icon-button
  color="primary"
  class="menu-button"
  (click)="openMenu()">
  <mat-icon>menu</mat-icon>
</button>
```

```html
<button mat-icon-button color="primary" class="menu-button"
    (click)="openMenu()">
  <mat-icon>menu</mat-icon>
</button>
```

❌ **错误做法**

```html
<button mat-icon-button color="primary" class="menu-button" (click)="openMenu()"
  ><mat-icon>menu</mat-icon></button>
```

```html
<button
mat-icon-button
color="primary"
class="menu-button"
(click)="openMenu()">
  <mat-icon>menu</mat-icon>
</button>
```

---

### 12. HTML 属性值使用双引号

> **规则：属性值统一使用双引号 `""`**

HTML 中统一双引号可以减少风格分歧，也更符合 Google 原始指南。

✅ **正确做法**

```html
<a class="maia-button maia-button-secondary" href="/login">Sign in</a>
```

❌ **错误做法**

```html
<a class='maia-button maia-button-secondary' href='/login'>Sign in</a>
```

---

## 三、CSS 规范

---

### 1. 尽量保持 CSS 有效

> **规则：除非遇到校验器缺陷或必须使用专有语法，否则应编写有效 CSS**

无效 CSS 往往意味着某些声明根本不会生效。把有效性作为底线，有助于更早发现失效样式和冗余规则。

✅ **正确做法**

```css
.card {
  border: 1px solid #ddd;
  padding: 16px;
}
```

❌ **错误做法**

```css
.card {
  colour: red;
  padding 16px;
}
```

---

### 2. 类名要表达用途，而不是表达颜色或外观

> **规则：类名应体现语义或功能，必要时可使用通用辅助类名**

与其写 `.button-green`、`.left-box` 这种绑定表现的名字，不如使用 `.submit-button`、`.gallery`、`.aux` 等更稳定的命名。

✅ **正确做法**

```css
.gallery {}
.login {}
.video {}
.aux {}
.alt {}
```

❌ **错误做法**

```css
.yee-1901 {}
.button-green {}
.clear {}
```

---

### 3. 类名尽量短，但必须足够清晰

> **规则：命名要“尽可能短，但又足够表达语义”**

太长会降低扫描效率，太短又会失去含义。应优先选择简单、明确、可长期稳定使用的名字。

✅ **正确做法**

```css
.nav {}
.author {}
```

❌ **错误做法**

```css
.navigation {}
.atr {}
```

---

### 4. 多个单词之间使用连字符分隔

> **规则：类名中的多个单词统一使用 `-` 连接，不使用下划线，也不要直接拼接**

连字符是 HTML/CSS 中最易读、最常见、最稳定的命名分隔方式。

✅ **正确做法**

```css
.video-id {}
.ads-sample {}
.error-status {}
```

❌ **错误做法**

```css
.demoimage {}
.error_status {}
.userProfile {}
```

---

### 5. 大型项目可使用应用前缀（可选）

> **规则：当样式可能嵌入其他系统时，可使用短前缀作为命名空间**

对大型站点、组件库或第三方嵌入内容，前缀能减少命名冲突，也便于统一搜索和批量替换。

✅ **正确做法**

```css
.adw-help {}
.maia-note {}
.app-header {}
```

❌ **错误做法**

```css
.help {}
.note {}
.header {}
```

---

### 6. 避免类型限定选择器

> **规则：不要把元素类型和类名绑定在一起，除非这是必要的辅助选择器**

像 `ul.example`、`div.error` 这类写法通常不必要，还会增加选择器耦合和后续重构成本。

✅ **正确做法**

```css
.example {}
.error {}
```

❌ **错误做法**

```css
ul.example {}
div.error {}
```

---

### 7. 避免使用 `id` 选择器

> **规则：CSS 中优先使用类选择器，不要依赖 `#id` 做样式定位**

`id` 必须在页面内全局唯一，而现代页面通常由很多组件拼装而成，很难长期保证这一点。类选择器更灵活，也更适合复用。

✅ **正确做法**

```css
.example {
  color: #444;
}
```

❌ **错误做法**

```css
#example {
  color: #444;
}
```

---

### 8. 能用简写属性就用简写

> **规则：在不损失表达准确性的前提下，优先使用 CSS 简写属性**

简写能减少重复、提升可读性，也更接近样式整体意图。

✅ **正确做法**

```css
.article {
  border-top: 0;
  font: 100%/1.6 palatino, georgia, serif;
  padding: 0 1em 2em;
}
```

❌ **错误做法**

```css
.article {
  border-top-style: none;
  font-family: palatino, georgia, serif;
  font-size: 100%;
  line-height: 1.6;
  padding-bottom: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 0;
}
```

---

### 9. `0` 后通常不写单位

> **规则：值为 `0` 时省略单位，但语法要求必须带单位的场景除外**

像 `margin: 0;`、`padding: 0;` 都不需要写 `px`。但某些简写语法（如部分 `flex-basis` 场景）仍可能需要单位。

✅ **正确做法**

```css
.container {
  margin: 0;
  padding: 0;
  flex: 1 1 0px;
}
```

❌ **错误做法**

```css
.container {
  margin: 0px;
  padding: 0em;
}
```

---

### 10. 小数前保留前导 `0`

> **规则：`-1` 到 `1` 之间的小数必须写前导零**

前导零可以避免视觉漏读，也更符合多数格式化工具习惯。

✅ **正确做法**

```css
.caption {
  font-size: 0.8em;
  opacity: 0.6;
}
```

❌ **错误做法**

```css
.caption {
  font-size: .8em;
  opacity: .6;
}
```

---

### 11. 颜色值能写 3 位时就写 3 位

> **规则：对可压缩的十六进制颜色，优先使用 3 位简写**

这既更短，也更易扫读。

✅ **正确做法**

```css
.notice {
  color: #ebc;
}
```

❌ **错误做法**

```css
.notice {
  color: #eebbcc;
}
```

---

### 12. 避免使用 `!important`

> **规则：不要用 `!important` 打断 CSS 的正常层叠与优先级推导**

`!important` 会显著提高维护成本。需要覆盖时，应优先通过更合理的结构、层级或选择器特异性解决。

✅ **正确做法**

```css
.dialog .title {
  font-weight: bold;
}
```

❌ **错误做法**

```css
.title {
  font-weight: bold !important;
}
```

---

### 13. 避免浏览器嗅探与 CSS Hack

> **规则：不要优先依赖 UA 检测、滤镜补丁或历史 Hack；先寻找更稳健的方案**

Hacks 会让样式系统越来越脆弱，也会在未来造成难以清理的兼容性债务。

✅ **正确做法**

```css
.card {
  display: grid;
  gap: 16px;
}
```

```css
@supports not (display: grid) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

❌ **错误做法**

```css
* html .card {
  height: 1%;
}
```

```css
.card {
  _width: 300px;
}
```

---

### 14. 声明顺序保持一致，默认可按字母序（可选）

> **规则：同一个项目内保持一致的属性排序；没有工具时可考虑按字母序**

稳定的排序规则能减少无意义 diff。厂商前缀属性排序时可忽略前缀本身的影响，但同组前缀仍应有序。

✅ **正确做法**

```css
.card {
  background: #fff;
  border: 1px solid #ddd;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  color: #222;
  text-align: center;
}
```

❌ **错误做法**

```css
.card {
  text-align: center;
  color: #222;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #ddd;
}
```

---

### 15. 缩进所有块内容

> **规则：规则内声明、嵌套块内容都必须缩进，以体现层级结构**

媒体查询、supports 规则、容器查询等场景尤其需要依靠缩进清晰表达结构。

✅ **正确做法**

```css
@media screen and (min-width: 768px) {
  .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
  }
}
```

❌ **错误做法**

```css
@media screen and (min-width: 768px) {
.layout {
display: grid;
grid-template-columns: 240px 1fr;
}
}
```

---

### 16. 每条声明都要以分号结尾

> **规则：即使最后一条声明也必须写分号**

这样更利于追加属性、减少编辑错误，也能保持统一格式。

✅ **正确做法**

```css
.test {
  display: block;
  height: 100px;
}
```

❌ **错误做法**

```css
.test {
  display: block;
  height: 100px
}
```

---

### 17. 冒号后保留一个空格

> **规则：属性名与值之间写一个空格，属性名与冒号之间不留空格**

这是 CSS 最基本的格式一致性要求之一。

✅ **正确做法**

```css
h3 {
  font-weight: bold;
}
```

❌ **错误做法**

```css
h3 {
  font-weight:bold;
}
```

---

### 18. 选择器与声明块之间保留一个空格

> **规则：最后一个选择器和左花括号之间使用一个空格，左花括号与选择器同一行**

缺少空格或另起一行都会让格式显得割裂。

✅ **正确做法**

```css
.video {
  margin-top: 1em;
}
```

❌ **错误做法**

```css
.video{
  margin-top: 1em;
}
```

```css
.video
{
  margin-top: 1em;
}
```

---

### 19. 选择器和声明分行书写

> **规则：多个选择器分多行，每条声明单独占一行**

一行塞入太多选择器和属性会让阅读与 diff 都变差。

✅ **正确做法**

```css
h1,
h2,
h3 {
  font-weight: normal;
  line-height: 1.2;
}
```

❌ **错误做法**

```css
a:focus, a:active {
  position: relative; top: 1px;
}
```

---

### 20. 规则之间使用空行分隔

> **规则：两个规则块之间留一个空行**

空行能建立视觉分组，也便于快速扫描样式表结构。

✅ **正确做法**

```css
html {
  background: #fff;
}

body {
  margin: auto;
  width: 50%;
}
```

❌ **错误做法**

```css
html {
  background: #fff;
}
body {
  margin: auto;
  width: 50%;
}
```

---

### 21. CSS 字符串与属性选择器使用单引号

> **规则：属性选择器与字符串值优先使用单引号，`url()` 中不要加引号；`@charset` 是例外，必须用双引号**

这条规则只针对 CSS，不要和 HTML 的双引号规则混淆。

✅ **正确做法**

```css
@import url(https://www.google.com/css/maia.css);

input[type='search'] {
  font-family: 'open sans', arial, sans-serif;
}
```

```css
@charset "utf-8";
```

❌ **错误做法**

```css
@import url("https://www.google.com/css/maia.css");

input[type="search"] {
  font-family: "open sans", arial, sans-serif;
}
```

---

### 22. 使用分节注释组织样式表（可选）

> **规则：大型样式表可以按区域或模块使用节注释分组**

当一个文件承担多个页面区域或组件样式时，节注释能显著提高导航效率。

✅ **正确做法**

```css
/* Header */

.app-header {}

/* Footer */

.app-footer {}

/* Gallery */

.app-gallery {}
```

❌ **错误做法**

```css
.app-header {}
.app-footer {}
.app-gallery {}
```

---

## 四、最后原则

---

### 1. 一致性优先于个人偏好

> **规则：如果你在修改已有文件，先观察周围代码的写法，再让新增代码融入现有风格**

风格指南的意义不是制造争论，而是建立共同语言。全局规范提供基本词汇，本地文件风格提供上下文一致性。即使某段历史代码不完全符合你最喜欢的写法，也应优先保持文件内部的连续性和可读性。

✅ **正确做法**

- 在改动现有模板前，先看相邻代码是否已经统一使用 2 空格、双引号、连字符类名。
- 在补充样式时，延续当前文件的排序和分组方式。
- 必要时通过格式化工具和 lint 规则把一致性固化下来。

❌ **错误做法**

- 在同一文件中混用 2 空格和 4 空格。
- 一部分 HTML 属性用单引号，另一部分用双引号。
- 新增 CSS 规则完全采用另一套排序和换行方式，使文件出现明显风格断层。
