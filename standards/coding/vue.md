# Vue 3 编码规范

> 基于 Vue.js 官方风格指南（Style Guide）及 Vue 3 最佳实践整理，所有示例以 **Composition API + `<script setup>`** 为主。
> 规则分为四个优先级，每个规则均附带 **正确做法** 和 **错误做法**。

---

## 规则归类

| 优先级 | 含义 | 说明 |
|--------|------|------|
| **A — 必要** | 规避错误 | 无论如何都要遵守，例外极少 |
| **B — 强烈推荐** | 增强可读性 | 违反后代码仍可运行，但应尽量遵守 |
| **C — 推荐** | 最小化选择成本 | 多种等价方案中选一种保持一致性 |
| **D — 谨慎使用** | 有潜在风险 | 过度使用会导致维护困难或 Bug |

---

## 一、优先级 A：必要的（规避错误）

### A-1 组件名为多个单词

组件名应始终是多个单词，根组件 `App` 以及 Vue 内置组件（`<Transition>`、`<Component>` 等）除外。这样做可以避免与现有和未来的 HTML 元素冲突，因为所有 HTML 元素名称都是单个单词的。

```vue
<!-- ❌ 错误 -->
<script setup>
// 组件文件名为 Item.vue，在模板中使用 <Item />
</script>
```

```vue
<!-- ✅ 正确 -->
<script setup>
// 组件文件名为 TodoItem.vue，在模板中使用 <TodoItem />
</script>
```

---

### A-2 Prop 定义尽量详细

在提交的代码中，prop 定义应该尽量详细，至少需要指定其类型。详细的 prop 定义有两个好处：① 写明组件 API，便于理解用法；② 开发环境下格式不正确会告警，帮助捕获潜在错误。

```js
// ❌ 错误：仅原型阶段可接受
const props = defineProps(['status'])
```

```js
// ✅ 正确：至少指定类型
const props = defineProps({
  status: String
})
```

```js
// ✅ 更好：详细定义
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(value)
    }
  }
})
```

---

### A-3 为 `v-for` 设置键值

`key` 配合 `v-for` 始终是必须的，以便维护内部组件及其子树的状态。即使在普通元素上维护可预测的行为（如动画中的对象固化），也是一种好的做法。

```vue
<!-- ❌ 错误 -->
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

```vue
<!-- ✅ 正确 -->
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

---

### A-4 避免 `v-if` 和 `v-for` 用在一起

永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上。在 Vue 3 中 `v-if` 优先级高于 `v-for`，会导致 `v-if` 中引用的 `v-for` 迭代变量不存在而报错。

**场景一：过滤列表 → 用计算属性替代**

```vue
<!-- ❌ 错误 -->
<ul>
  <li v-for="user in users" v-if="user.isActive" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

```vue
<!-- ✅ 正确：使用计算属性 -->
<script setup>
const activeUsers = computed(() => users.filter(user => user.isActive))
</script>
<ul>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

**场景二：隐藏整个列表 → 将 `v-if` 移至容器元素**

```vue
<!-- ❌ 错误 -->
<ul>
  <li v-for="user in users" v-if="shouldShowUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

```vue
<!-- ✅ 正确：v-if 移至外层 -->
<ul v-if="shouldShowUsers">
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

**替代方案：使用 `<template>` 包裹**

```vue
<!-- ✅ 也可：使用 template 分离 -->
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

---

### A-5 为组件样式设置作用域

对于应用来说，顶级 `App` 组件和布局组件中的样式可以是全局的，但是其它所有组件都应该是有作用域的。作用域可以通过 `scoped` attribute、CSS Modules 或 BEM 等策略实现。**组件库应倾向于选用基于 class 的策略而不是 `scoped` attribute**，以便于覆写内部样式。

```vue
<!-- ❌ 错误：无作用域的样式 -->
<template>
  <button class="btn btn-close">×</button>
</template>
<style>
.btn-close { background-color: red; }
</style>
```

```vue
<!-- ✅ 正确：使用 scoped -->
<template>
  <button class="button button-close">×</button>
</template>
<style scoped>
.button { border: none; border-radius: 2px; }
.button-close { background-color: red; }
</style>
```

```vue
<!-- ✅ 正确：使用 CSS Modules -->
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>
<style module>
.button { border: none; border-radius: 2px; }
.buttonClose { background-color: red; }
</style>
```

```vue
<!-- ✅ 正确：使用 BEM 约定 -->
<template>
  <button class="c-Button c-Button--close">×</button>
</template>
<style>
.c-Button { border: none; border-radius: 2px; }
.c-Button--close { background-color: red; }
</style>
```

---

## 二、优先级 B：强烈推荐（增强可读性）

### B-1 组件文件

只要有构建系统可以拼接文件，每个组件就应该单独放在一个文件中。这有助于在需要编辑或查看组件用法时更快找到它。

```js
// ❌ 错误：多个组件写在一个文件里
app.component('TodoList', { /* ... */ })
app.component('TodoItem', { /* ... */ })
```

```
✅ 正确：每个组件一个文件
components/
|- TodoList.vue
|- TodoItem.vue
```

---

### B-2 单文件组件文件名的大小写

单文件组件的文件名应该始终是 **PascalCase** 或始终是 **kebab-case**。PascalCase 在代码编辑器中自动补全效果最好，与 JS(X) 和模板中的引用方式一致。但混合大小写在不区分大小写的文件系统上可能出问题，所以 kebab-case 也完全可以接受。

```
❌ 错误
components/
|- mycomponent.vue
|- myComponent.vue
```

```
✅ 正确
components/
|- MyComponent.vue

或

components/
|- my-component.vue
```

---

### B-3 基础组件名

基础组件（又称展示型组件、无状态/纯组件）应该以特定前缀开头，如 `Base`、`App` 或 `V`。基础组件只包含 HTML 元素、其它基础组件和第三方 UI 组件，**不包含**全局状态（如 Pinia store）。

```
❌ 错误
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

```
✅ 正确
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue

或

components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

---

### B-4 紧密耦合的组件名

和父组件紧密耦合的子组件应该以父组件名作为前缀。这样编辑器按字母排序时，相关文件会紧挨在一起。

```
❌ 错误
components/
|- TodoList.vue
|- TodoItem.vue       ← 与 TodoList 耦合但看不出来
|- TodoButton.vue     ← 与 TodoList 耦合但看不出来

components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue  ← 前缀关系不清晰
```

```
✅ 正确
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue

components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

---

### B-5 组件名中的单词顺序

组件名应该以最高层级（通常是最通用的）单词开头，以描述性修饰词结尾。这样编辑器按字母排序时，组件间的关系一目了然。

```
❌ 错误
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- RunSearchButton.vue
|- SearchInput.vue
```

```
✅ 正确
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
```

---

### B-6 自闭合组件

没有内容的组件在单文件组件、字符串模板和 JSX 中应该自闭合，但在 DOM 内模板中永远不要自闭合。自闭合传达了"不仅有内容，而且不应该有内容"的信息，代码也更整洁。

```vue
<!-- ❌ 错误：SFC 中不自闭合 -->
<MyComponent></MyComponent>

<!-- ❌ 错误：DOM 内模板中自闭合 -->
<my-component/>
```

```vue
<!-- ✅ 正确：SFC 中自闭合 -->
<MyComponent/>

<!-- ✅ 正确：DOM 内模板中不自闭合 -->
<my-component></my-component>
```

---

### B-7 模板中的组件名大小写

在单文件组件和字符串模板中，组件名应该始终使用 **PascalCase**；在 DOM 内模板中使用 **kebab-case**。PascalCase 更容易区分组件和 HTML 原生元素，编辑器自动补全也更好。如果项目已全面使用 kebab-case，保持一致性也可接受。

```vue
<!-- ❌ 错误 -->
<mycomponent/>
<myComponent/>
<!-- DOM 内模板中 -->
<MyComponent></MyComponent>
```

```vue
<!-- ✅ 正确：SFC 中 -->
<MyComponent/>
<!-- ✅ 正确：DOM 内模板中 -->
<my-component></my-component>
<!-- ✅ 也可：全项目统一 kebab-case -->
<my-component></my-component>
```

---

### B-8 JS/JSX 中的组件名大小写

JS/JSX 中的组件名应始终使用 **PascalCase**，除非只通过 `app.component` 进行全局注册的简单应用，此时可以用 kebab-case 字符串。

```js
// ❌ 错误
app.component('myComponent', { /* ... */ })
import myComponent from './MyComponent.vue'
export default { name: 'myComponent' }
```

```js
// ✅ 正确
app.component('MyComponent', { /* ... */ })
import MyComponent from './MyComponent.vue'
export default { name: 'MyComponent' }
```

---

### B-9 完整单词的组件名

组件名应该倾向于使用完整单词而不是缩写。编辑器自动补全让长名称的编写成本很低，而清晰性则是无价的。尤其是不常见的缩写，应始终避免。

```
❌ 错误
components/
|- SdSettings.vue
|- UProfOpts.vue
```

```
✅ 正确
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

---

### B-10 Prop 名大小写

Prop 声明时应始终使用 **camelCase**，在 DOM 内模板中使用时应使用 **kebab-case**。在 SFC 模板中可以使用任一种，但**必须项目内保持一致**，不要混用。

```js
// ❌ 错误
const props = defineProps({ 'greeting-text': String })
```

```vue
<!-- ❌ 错误：DOM 内模板中用 camelCase -->
<welcome-message greetingText="hi"></welcome-message>
```

```js
// ✅ 正确：声明用 camelCase
const props = defineProps({ greetingText: String })
```

```vue
<!-- ✅ 正确：SFC 模板中（二选一，项目统一） -->
<WelcomeMessage greeting-text="hi"/>
<!-- 或 -->
<WelcomeMessage greetingText="hi"/>

<!-- ✅ 正确：DOM 内模板中 -->
<welcome-message greeting-text="hi"></welcome-message>
```

---

### B-11 多 attribute 的元素

拥有多个 attribute 的元素应该跨多行书写，每个 attribute 独占一行。这和 JS 中多行对象写法的惯例一致。

```vue
<!-- ❌ 错误 -->
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
<MyComponent foo="a" bar="b" baz="c"/>
```

```vue
<!-- ✅ 正确 -->
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

---

### B-12 模板中简单的表达式

组件模板应该只包含简单表达式，复杂表达式应重构为计算属性或方法。模板应该是声明式的，描述"应该出现什么"而非"如何计算"。

```vue
<!-- ❌ 错误：复杂表达式直接写在模板中 -->
{{ fullName.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') }}
```

```vue
<!-- ✅ 正确：使用计算属性 -->
{{ normalizedFullName }}
```

```js
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

---

### B-13 简单的计算属性

复杂的计算属性应该拆分成尽可能多的更简单的属性。更简单的计算属性：① 更容易测试；② 更容易阅读；③ 更容易适应需求变化。

```js
// ❌ 错误：一个计算属性做了太多事
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - discount.value > 0 ? basePrice - discount.value : 0
})
```

```js
// ✅ 正确：拆分成多个简单计算属性
const basePrice = computed(() => manufactureCost.value / (1 - profitMargin.value))
const discount = computed(() => basePrice.value * (1 - discountPercent.value / 100))
const finalPrice = computed(() => Math.max(basePrice.value - discount.value, 0))
```

---

### B-14 带引号的 attribute 值

非空 HTML attribute 值应该始终带引号（双引号或单引号均可，保持一致）。不带引号的值在包含空格或特殊字符时会出问题。

```vue
<!-- ❌ 错误 -->
<AppSidebar :style={width:sidebarWidth+'px'}>
```

```vue
<!-- ✅ 正确 -->
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

---

### B-15 指令缩写

指令缩写（`v-bind:` → `:`，`v-on:` → `@`，`v-slot:` → `#`）要么始终使用，要么始终不使用。项目内保持一致性。

```vue
<!-- ❌ 错误：混用 -->
<input v-bind:value="foo" @input="onInput">
<template v-slot:header>...</template>
```

```vue
<!-- ✅ 正确：统一使用缩写 -->
<input :value="foo" @input="onInput">
<template #header>...</template>

<!-- ✅ 正确：统一使用完整语法 -->
<input v-bind:value="foo" v-on:input="onInput">
<template v-slot:header>...</template>
```

---

## 三、优先级 C：推荐（将选择和认知成本最小化）

### C-1 组件/实例的选项顺序

组件选项应保持一致的顺序。推荐顺序如下：

| 类别 | 选项 |
|------|------|
| 1. 全局感知 | `name` |
| 2. 模板编译选项 | `compilerOptions` |
| 3. 模板依赖 | `components`、`directives` |
| 4. 组合 | `extends`、`mixins`、`provide`/`inject` |
| 5. 接口 | `inheritAttrs`、`props`、`emits` |
| 6. 组合式 API | `setup` |
| 7. 本地状态 | `data`、`computed` |
| 8. 事件 | `watch`、生命周期钩子（按调用顺序） |
| 9. 非响应式属性 | `methods` |
| 10. 渲染 | `template`/`render` |

> **Composition API 提示**：使用 `<script setup>` 时，声明顺序为 `defineProps` → `defineEmits` → `defineExpose` → 响应式状态 → 计算属性 → 侦听器 → 生命周期钩子 → 普通函数。

---

### C-2 元素 attribute 的顺序

元素（包括组件）的 attribute 应保持一致的顺序。推荐顺序：

| 类别 | Attribute |
|------|-----------|
| 1. 定义 | `is` |
| 2. 列表渲染 | `v-for` |
| 3. 条件 | `v-if` / `v-else-if` / `v-else` / `v-show` / `v-cloak` |
| 4. 渲染修饰 | `v-pre` / `v-once` |
| 5. 全局感知 | `id` |
| 6. 唯一性 | `ref` / `key` |
| 7. 双向绑定 | `v-model` |
| 8. 其它 attribute | 所有未指定的绑定和非绑定 attribute |
| 9. 事件 | `v-on` |
| 10. 内容 | `v-html` / `v-text` |

---

### C-3 组件/实例选项中的空行

可以在多行属性之间添加一个空行，特别是当选项无法在一屏内显示时。空行有助于更轻松地浏览代码。

```js
// ❌ 错误：挤在一起难以阅读
defineProps({
  value: { type: String, required: true },
  focused: { type: Boolean, default: false },
  label: String,
  icon: String
})
const formattedValue = computed(() => { /* ... */ })
const inputClasses = computed(() => { /* ... */ })
```

```js
// ✅ 正确：适当空行
defineProps({
  value: { type: String, required: true },
  focused: { type: Boolean, default: false },
  label: String,
  icon: String
})

const formattedValue = computed(() => { /* ... */ })

const inputClasses = computed(() => { /* ... */ })
```

---

### C-4 单文件组件的顶级元素顺序

`<script>`、`<template>` 和 `<style>` 标签应保持一致顺序，`<style>` 始终放最后（因为至少需要其它两者之一）。`<script>` 和 `<template>` 谁在前均可，关键是项目统一。

```vue
<!-- ❌ 错误：顺序不一致 -->
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue
<!-- ✅ 正确：项目统一为 script → template → style -->
<script setup>/* ... */</script>
<template>...</template>
<style scoped>/* ... */</style>
```

---

## 四、优先级 D：谨慎使用（有潜在风险的模式）

### D-1 scoped 中的元素选择器

在 `scoped` 样式中应避免使用元素选择器，优先使用 class 选择器。因为 Vue 为 scoped 添加唯一 attribute（如 `data-v-f3f3eg9`），大量 `button[data-v-f3f3eg9]` 类型的选择器会比 `.btn-close[data-v-f3f3eg9]` 慢很多。

```vue
<!-- ❌ 错误 -->
<template>
  <button>×</button>
</template>
<style scoped>
button {
  background-color: red;
}
</style>
```

```vue
<!-- ✅ 正确 -->
<template>
  <button class="btn btn-close">×</button>
</template>
<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

---

### D-2 隐性的父子组件通信

父子组件通信应该优先使用 **props 和 events**，而不是 `getCurrentInstance().parent` 或直接修改 props。理想的 Vue 应用是 **props 向下，events 向上**。

```vue
<!-- ❌ 错误：直接修改 prop -->
<script setup>
const props = defineProps({ todo: { type: Object, required: true } })
</script>
<template>
  <input v-model="todo.text" />
</template>
```

```vue
<!-- ❌ 错误：通过 parent 访问父组件状态 -->
<script setup>
import { getCurrentInstance } from 'vue'
const props = defineProps({ todo: { type: Object, required: true } })
const instance = getCurrentInstance()
function removeTodo() {
  const parent = instance.parent
  parent.props.todos = parent.props.todos.filter(t => t.id !== props.todo.id)
}
</script>
```

```vue
<!-- ✅ 正确：通过 emit 通信 -->
<script setup>
defineProps({ todo: { type: Object, required: true } })
const emit = defineEmits(['update', 'delete'])
</script>
<template>
  <input
    :value="todo.text"
    @input="emit('update', $event.target.value)"
  />
  <button @click="emit('delete')">×</button>
</template>
```

---

## 五、Vue 3 Composition API 专项规范

> 以下规则来自 Vue 3 官方文档中组合式函数（Composables）、Props、Events、v-model 等章节的最佳实践。

### E-1 组合式函数命名

组合式函数约定使用 **camelCase** 命名，并以 `use` 作为前缀。

```js
// ❌ 错误
function mouseTracker() { /* ... */ }
function getMousePosition() { /* ... */ }
```

```js
// ✅ 正确
export function useMouse() { /* ... */ }
export function useFetch(url) { /* ... */ }
export function useEventListener(target, event, callback) { /* ... */ }
```

---

### E-2 组合式函数输入参数

组合式函数应能接受 ref 或 getter 作为参数，即使不依赖其响应性。使用 `toValue()` 来规范化输入，并在需要追踪响应式时在 `watchEffect()` 内部调用 `toValue()`。

```js
// ❌ 错误：不接受 ref/getter
export function useFetch(url) {
  fetch(url).then(/* ... */) // url 只能是字符串
}
```

```js
// ✅ 正确：使用 toValue 规范化
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    data.value = null
    error.value = null
    fetch(toValue(url))
      .then(res => res.json())
      .then(json => (data.value = json))
      .catch(err => (error.value = err))
  }

  watchEffect(() => { fetchData() })
  return { data, error }
}
```

---

### E-3 组合式函数返回值

组合式函数应始终返回一个**包含多个 ref 的普通非响应式对象**，这样在组件中解构后仍可保持响应性。不要返回 `reactive()` 包装的对象，因为解构会丢失响应性连接。

```js
// ❌ 错误：返回 reactive 对象
import { reactive } from 'vue'
export function useMouse() {
  const state = reactive({ x: 0, y: 0 })
  // ...
  return state // 解构后丢失响应性
}
```

```js
// ✅ 正确：返回含 ref 的普通对象
import { ref } from 'vue'
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  // ...
  return { x, y } // 解构后仍保持响应性
}
```

```js
// ✅ 如需以对象属性形式使用，可在组件中 reactive 包装
const mouse = reactive(useMouse())
// mouse.x 自动解包，链接到原来的 x ref
```

---

### E-4 组合式函数副作用清理

在组合式函数中执行副作用时，必须确保在 `onUnmounted()` 中清理副作用（如移除事件监听器）。推荐封装通用的副作用管理函数。

```js
// ❌ 错误：没有清理副作用
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  // 忘记在卸载时移除监听器 → 内存泄漏
  window.addEventListener('mousemove', (e) => {
    x.value = e.pageX
    y.value = e.pageY
  })
  return { x, y }
}
```

```js
// ✅ 正确：封装清理逻辑
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  useEventListener(window, 'mousemove', (e) => {
    x.value = e.pageX
    y.value = e.pageY
  })
  return { x, y }
}
```

---

### E-5 组合式函数使用限制

组合式函数只能在 `<script setup>` 或 `setup()` 钩子中被调用，且必须**同步**调用。在某些情况下也可以在 `onMounted()` 等生命周期钩子中调用。这些限制是因为 Vue 需要确定当前活跃的组件实例，以便注册生命周期钩子和侦听器、防止内存泄漏。

```js
// ❌ 错误：在异步回调中调用
setTimeout(() => {
  const { x, y } = useMouse() // 丢失组件实例上下文
}, 1000)
```

```vue
<!-- ✅ 正确：在 <script setup> 中同步调用 -->
<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>
```

> `<script setup>` 是唯一在 `await` 之后仍可调用组合式函数的地方，编译器会自动恢复活跃实例上下文。

---

### E-6 显式声明 emits

组件应使用 `defineEmits()` 显式声明它将要触发的所有事件。这不仅文档化组件行为，还让 Vue 能将已知监听器从透传 attribute 中排除。

```vue
<!-- ❌ 错误：未声明 emits -->
<script setup>
// 直接在模板中使用 $emit 但未声明
</script>
<template>
  <button @click="$emit('submit')">Submit</button>
</template>
```

```vue
<!-- ✅ 正确 -->
<script setup>
const emit = defineEmits(['submit'])

function handleSubmit() {
  emit('submit', { email, password })
}
</script>
<template>
  <button @click="handleSubmit">Submit</button>
</template>
```

---

### E-7 单向数据流 — 不要修改 Props

Props 遵循**单向向下绑定**：父组件更新时子组件的 props 会刷新，但子组件不应修改 props。如果需要基于 prop 做修改，应使用计算属性或 ref。

```js
// ❌ 错误：直接修改 prop
const props = defineProps(['foo'])
props.foo = 'bar' // 控制台会警告
```

```js
// ✅ 正确方案一：用 prop 做初始值
const props = defineProps(['initialCounter'])
const counter = ref(props.initialCounter) // 后续独立于 prop

// ✅ 正确方案二：用计算属性转换
const props = defineProps(['size'])
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```

---

### E-8 使用 `defineModel()` 实现双向绑定（Vue 3.4+）

Vue 3.4 起推荐使用 `defineModel()` 宏来实现组件 `v-model` 双向绑定，比手动声明 `modelValue` prop + `update:modelValue` 事件更简洁。

```vue
<!-- ❌ 错误 / 繁琐：3.4 之前的方式 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

```vue
<!-- ✅ 正确：使用 defineModel (3.4+) -->
<script setup>
const model = defineModel()
</script>
<template>
  <input v-model="model" />
</template>
```

```vue
<!-- ✅ 带参数的 v-model -->
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>
```

```html
<!-- 父组件 -->
<UserName v-model:first-name="first" v-model:last-name="last" />
```

---

### E-9 不要在 Vue 3 中使用 Mixin

在 Vue 3 中，应使用组合式函数替代 Mixin。Mixin 有三个主要缺陷：① 数据来源不清晰；② 命名空间冲突；③ 隐式的跨 mixin 交流。组合式函数通过 ref + 解构模式解决了所有这些问题。

```js
// ❌ 错误：使用 Mixin
export default {
  mixins: [mouseMixin, fetchMixin],
  // 数据来源不清晰，可能命名冲突
}
```

```vue
<!-- ✅ 正确：使用组合式函数 -->
<script setup>
import { useMouse } from './mouse'
import { useFetch } from './fetch'

const { x, y } = useMouse()         // 来源清晰
const { data, error } = useFetch()   // 来源清晰
</script>
```

---

### E-10 Props 解构的注意事项（Vue 3.5+）

Vue 3.5+ 支持响应式 Props 解构，编译器会自动在解构变量前添加 `props.`。但将解构的 prop 传入 `watch()` 或外部函数时，需要用 getter 包装以保持响应性。

```js
// ❌ 错误：直接传入解构值给 watch
const { foo } = defineProps(['foo'])
watch(foo, /* ... */) // 等价于 watch(props.foo, ...)，传的是值不是响应源
```

```js
// ✅ 正确：用 getter 包装
const { foo } = defineProps(['foo'])
watch(() => foo, /* ... */) // 等价于 watch(() => props.foo, ...)

// ✅ 传递给外部函数时也用 getter
useComposable(() => foo)
```

---

### E-11 模板引用（Template Ref）的命名

使用 `ref()` 创建模板引用时，变量名应与模板中 `ref` attribute 的值一致。

```vue
<!-- ❌ 错误：不一致 -->
<script setup>
const inputEl = ref(null)
</script>
<template>
  <input ref="inputElement" />
</template>
```

```vue
<!-- ✅ 正确 -->
<script setup>
const inputEl = ref(null)
</script>
<template>
  <input ref="inputEl" />
</template>
```

---

### E-12 优先使用组合式函数而非无渲染组件

在纯逻辑复用时，优先使用组合式函数而非无渲染组件（基于作用域插槽）。组合式函数不会产生额外的组件实例开销。仅在需要同时复用逻辑和视图布局时使用无渲染组件。

```vue
<!-- ❌ 不推荐：纯逻辑复用使用无渲染组件 -->
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

```vue
<!-- ✅ 推荐：纯逻辑复用使用组合式函数 -->
<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>
<template>
  Mouse is at: {{ x }}, {{ y }}
</template>
```

---

### E-13 SSR 场景下副作用的位置

如果应用使用服务端渲染（SSR），确保 DOM 相关的副作用在 `onMounted()` 等挂载后的生命周期钩子中执行，这些钩子只在浏览器中调用。

```js
// ❌ 错误：在 setup 顶层直接操作 DOM
const el = document.getElementById('app') // SSR 中会报错

// ✅ 正确：在 onMounted 中操作
onMounted(() => {
  const el = document.getElementById('app') // 仅浏览器执行
})
```

---

## 六、参考资源

| 资源 | 说明 |
|------|------|
| [Vue.js 官方风格指南](https://vuejs.org/style-guide/) | Vue 官方编码规范（英文） |
| [Vue 2 中文风格指南](https://v2.cn.vuejs.org/v2/style-guide/) | Vue 2 风格指南中文版 |
| [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html) | Vue 3 组合式函数最佳实践 |
| [Props](https://cn.vuejs.org/guide/components/props.html) | Props 定义与校验 |
| [组件事件](https://cn.vuejs.org/guide/components/events.html) | 组件事件声明与校验 |
| [组件 v-model](https://cn.vuejs.org/guide/components/v-model.html) | 双向绑定与 defineModel |
| [VueUse](https://vueuse.org/) | Vue 组合式函数工具集，源码也是很好的学习资料 |
| [ESLint Plugin for Vue](https://eslint.vuejs.org/) | Vue 官方 ESLint 插件，可自动检查大部分规则 |
