# 高级开发者 UI 设计开发方案

> ⚠️ **状态:2026-05-08 归入方法论参考,不是架构决策**  
>
> 本文是"资深后端开发者如何用 AI 产出专业 UI"的方法论讨论,属于产品团队自身的生产力问题,不涉及 Quantalithos 架构。在 A 方案下,UI 交付流程由 `product/产品矩阵.md` 的 Chat / Console / Website 三产品各自处理,本文对这些产品的 UI 生产流程有参考价值但不构成架构决策。
>
> 建议将来把本文迁移到 `research/ux-methodology/` 或 `implementation/ui-production/` 目录。当前位置保留,但不作架构权威引用。

---

## 一、核心结论(方法论讨论,非架构决策)

### 1.1 一句话方案

**Figma 不该是起点，而该是目标格式之一。** 你的最佳路径是用模型把"产品意图"编译成"结构化中间层"，再由中间层编译成可运行的 UI 原型——浏览器就是你的设计运行时。

### 1.2 三个关键认知

| 旧认知 | 新认知 |
|--------|--------|
| 做UI要先学 Figma | Figma 只是输出终端之一，浏览器才是更快的设计运行时 |
| 让模型直接画界面 | 让模型先输出结构化设计规格，再编译为 UI |
| 设计是感性的活 | 设计是可约束的工程问题：Design Token + 组件库 + DSL |

### 1.3 社区共识提炼

基于国内外论坛（Hacker News、Reddit、掘金）与 GitHub 开源项目的调研，社区已形成以下稳定共识：

1. **只靠一句"做个漂亮 UI"得不到稳定结果**——必须先给 agent 设计系统、视觉方向、组件边界和参考物
2. **Design Drift 是核心问题**——AI 在多轮迭代中容易风格偏离，需通过 Design Tokens 固化
3. **一致性比"惊艳一次"更重要**——第 1 个组件和第 50 个组件必须属于同一设计语言
4. **Claude 擅长审美与方向推导**，**Codex 擅长工程执行与技能扩展**
5. **真正成功的是"有约束的 AI 前端开发"**，不是 Vibe Coding

---

## 二、工作流总览

### 2.1 推荐：中间层驱动工作流

```
产品意图（自然语言/PRD）
       │
       ▼
 ┌─────────────┐
 │  结构化中间层  │  ← YAML/JSON 格式的 UI DSL
 │  (UI Spec)   │
 └─────┬───────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
  React/Tailwind      Figma Spec         截图/视觉
  可运行原型          设计稿描述          审查反馈
  (主输出)            (协作输出)          (校验回路)
```

### 2.2 三个工作流路线

#### 路线 A：Code-first 原型流（最推荐 ⭐）

**适用**：尽快做产品原型、个人项目、早期验证

```
自然语言描述产品
    → 模型输出页面列表 / 用户流 / 组件树 / Design Token
    → 模型直接生成 React + Tailwind + shadcn/ui 原型
    → 浏览器查看效果、截图、迭代
    → (可选) 需要协作时反向进入 Figma
```

**为什么适合你**：
- 你擅长看结构、看约束、看模块、看系统一致性
- 浏览器是更强的"设计运行时"——所见即所得，改了就刷新
- 不需要在 Figma 里手拖 Auto Layout

#### 路线 B：Spec-first → Figma（第二推荐）

**适用**：需要对外展示、汇报、给设计师/产品协作

```
产品需求
    → 模型输出 Figma-ready 设计规格（Frame 清单、区块层级、组件列表、Token）
    → 用 Figma AI / 插件 / MCP 生成初稿
    → 轻量编辑即可
```

**本质**：你不是在"学设计"，而是在写 UI DSL、页面 AST、设计约束清单。

#### 路线 C：Image-first 视觉探索（辅助用）

**适用**：产品早期探索气质、不知道页面该长什么样

```
让模型生成几版页面视觉稿/截图风格
    → 选一版喜欢的方向
    → 再转成网页原型或 Figma 结构
```

---

## 三、中间层（UI Spec）设计

### 3.1 产品意图输入模板

```yaml
product:
  name: [产品名称]
  type: [web app / mobile app / dashboard / landing page]
  audience: [目标用户]
  goal: [核心目标]

style:
  tone: [温暖 / 克制 / 锋利 / 简洁 / 可信]
  references:
    - [参考产品1的什么感觉]
    - [参考产品2的什么感觉]
  avoid:
    - [不要出现什么风格]

screens:
  - [页面1名称]
  - [页面2名称]
  - ...

constraints:
  platform: [desktop-first / mobile-first / responsive]
  stack: React + Tailwind
  design_system: shadcn-like
  density: [compact / medium / airy]
  accessibility: [无障碍要求]

deliverables:
  - sitemap
  - wireframe
  - design_tokens
  - prototype
```

### 3.2 页面 DSL 模板

```yaml
page: [页面名称]
layout:
  header: true/false
  sidebar: true/false
  footer: true/false
sections:
  - type: [stats / table / form / list / card_grid / chart / action_panel / ...]
    props:
      # 按 type 不同填写
visual:
  theme: [enterprise / consumer / minimal]
  radius: [none / small / medium / large]
  shadow: [none / subtle / medium / prominent]
  density: [compact / comfortable / spacious]
```

### 3.3 模型产出物清单

每个页面/模块，模型应依次产出：

| 序号 | 产出物 | 说明 |
|------|--------|------|
| 1 | IA（信息架构） | 页面层级、导航结构、用户流 |
| 2 | Wireframe（线框图描述） | 每个区块的内容和布局 |
| 3 | Component Tree | 组件拆解和嵌套关系 |
| 4 | Token Spec | 颜色、间距、圆角、阴影、字号 |
| 5 | React/Tailwind 原型 | 可运行的页面代码 |
| 6 | Figma-ready Spec | 可导入 Figma 的结构描述（可选） |

---

## 四、Design Token 体系

### 4.1 为什么 Token 是关键

Design Token 是对抗 Design Drift 的核心武器。没有它，模型每次生成都会重新发明 spacing、阴影和交互风格。

### 4.2 最小 Token 集

```yaml
tokens:
  colors:
    primary: "#2563EB"
    secondary: "#7C3AED"
    background: "#FFFFFF"
    surface: "#F8FAFC"
    text_primary: "#0F172A"
    text_secondary: "#64748B"
    border: "#E2E8F0"
    success: "#16A34A"
    warning: "#D97706"
    error: "#DC2626"

  spacing:
    unit: 4px
    xs: 4px
    sm: 8px
    md: 16px
    lg: 24px
    xl: 32px
    xxl: 48px

  radius:
    none: 0
    sm: 4px
    md: 8px
    lg: 12px
    full: 9999px

  shadow:
    none: none
    sm: "0 1px 2px rgba(0,0,0,0.05)"
    md: "0 4px 6px rgba(0,0,0,0.07)"
    lg: "0 10px 15px rgba(0,0,0,0.1)"

  typography:
    font_family: "Inter, system-ui, sans-serif"
    heading_lg: { size: "30px", weight: 700, line_height: 1.2 }
    heading_md: { size: "24px", weight: 600, line_height: 1.3 }
    heading_sm: { size: "20px", weight: 600, line_height: 1.4 }
    body: { size: "14px", weight: 400, line_height: 1.5 }
    caption: { size: "12px", weight: 400, line_height: 1.4 }
```

### 4.3 Token 治理规则

- **Token 文件是只读的**——模型不可修改基础 Token
- **项目级覆盖**——可在 `tokens.local.yaml` 中覆盖特定值
- **组件边界**——`components/ui/*` 下的基础组件不可修改视觉规范
- **Drift 检查**——每次迭代后，检查生成代码是否偏离 Token 定义

---

## 五、技术栈推荐

### 5.1 核心技术栈

| 层 | 选择 | 理由 |
|----|------|------|
| 框架 | Next.js / React | 生态最成熟，模型生成质量最高 |
| 样式 | Tailwind CSS | 原子化、约束性强、模型擅长生成 |
| 组件库 | shadcn/ui | 可拷贝、可定制、不是黑盒 |
| 基础原语 | Radix UI | 无样式原语，shadcn/ui 的底层 |
| 图标 | Lucide React | 与 shadcn/ui 默认搭配 |

### 5.2 为什么是这个组合

- **UI 开发适合有限自由**——agent 可以组合组件，但不应该自由发明底层规范
- **Tailwind 把视觉决策变成约束**——spacing、color、radius 都是 token 化的
- **shadcn/ui 让组件可审查**——代码在你项目里，模型看得见、改得着、审得了
- **模型对这套组合的生成质量最稳定**——社区训练数据最充分

---

## 六、模型分工策略

### 6.1 Claude 的角色

- **设计编译器的前端**：从产品意图推导视觉方向、页面结构、信息架构
- 擅长"从 0 到 1 定 UI 风格方向"
- 擅长输出有"设计思考感"的首版页面
- 擅长在已有设计原则下稳定扩展新页面
- 适合做视觉审查与一致性检查

### 6.2 Codex 的角色

- **设计编译器的后端**：把 Spec 高效编译为工程实现
- 擅长在真实项目上下文中批量实现页面
- 擅长接入 skill、图片、设计稿、已有组件体系
- 擅长拆组件、补状态、补响应式等执行型工作
- 适合结合素材把"设计输入"更快转化为工程结果

### 6.3 协作模式

```
Claude（定方向） → 中间层 Spec → Codex（做实现） → 浏览器审查 → Claude（审一致性）
```

**判断原则**：
- 没有设计体系，想先定方向 → 优先 Claude
- 已有设计稿、现成组件 → 优先 Codex
- 兼顾设计感和落地效率 → Claude 定方向 + Codex 做实现

---

## 七、Prompt 模板

### 7.1 设计决策 Prompt（先不写代码）

```text
你现在扮演"产品设计编译器"。

我的身份：资深后端开发者，熟悉模型协作，不熟悉 Figma 操作。
目标：把产品想法转成结构化设计规格，不要先写代码。

产品需求：
[在这里写你的产品需求]

风格方向：
[在这里写你的风格偏好]

反例：
[在这里写你不想要的风格]

请先输出：
1. 用户目标与主流程
2. 页面列表与导航结构
3. 每个页面的模块树
4. 关键组件清单
5. 设计 Token 建议（颜色/间距/圆角/阴影/字号层级）
6. 桌面端和移动端布局策略

确认后再进入代码实现。
```

### 7.2 页面实现 Prompt（约束驱动）

```text
基于以下设计约束实现页面，不要自由发挥：
- 使用现有 Design Tokens（见 tokens.yaml）
- 优先复用 components/ui 下已有组件
- UI 和业务逻辑分离
- 不修改基础 Button/Input/Card 的视觉规范
- 先完成静态布局，再补交互态
- 完成后自查：对齐、间距、hover、active、empty state、responsive

参考：
- 当前页面截图：[如有]
- 目标风格截图：[如有]
- 反例截图：[如有]

页面结构：
[在这里粘贴页面 DSL 或模块树]
```

### 7.3 视觉审查 Prompt

```text
请不要继续开发，先从设计审查角度检查当前页面：
- 视觉层级是否清晰
- 间距是否统一（对照 Token）
- 卡片和表单是否具有一致密度
- 是否存在 AI 常见审美问题（紫色渐变、过度阴影、不一致圆角）
- 是否和现有 Design System 冲突

请按"问题 → 原因 → 修改建议"输出。
```

### 7.4 Figma 输出 Prompt（需要协作时）

```text
请把下面的产品需求转换成一份适合 Figma AI / Figma 插件生成初版原型的设计描述。

输出格式必须包含：
1. 页面名称
2. 页面尺寸建议
3. 结构层级（Frame 嵌套）
4. 模块说明
5. 文案示例
6. 视觉风格关键词
7. 组件列表
8. 页面间跳转关系

产品需求：
[你的需求]
```

---

## 八、Design Drift 防治

### 8.1 什么是 Design Drift

AI 在多轮迭代、多页面扩展后，风格逐渐偏离初始设定的现象。具体表现为：
- 第 1 个组件和第 50 个组件风格不一致
- 同一项目不同页面审美风格变化过快
- 模型每次生成都重新发明 spacing、阴影和交互风格

### 8.2 防治策略

| 策略 | 具体做法 |
|------|----------|
| Token 固化 | `tokens.yaml` 只读，模型不可修改基础 Token |
| 设计记忆 | 每次新页面开发前，模型先读取 `design-system.md` |
| 组件边界 | `components/ui/*` 基础组件不可改视觉规范 |
| 视觉快照 | 关键页面截图存档，新页面与快照对比 |
| Prompt 约束 | 每次实现 Prompt 都携带"不要自由发挥"指令 |
| 审查回路 | 每完成一个页面，跑一次视觉审查 Prompt |

### 8.3 项目文件结构建议

```
project/
├── design/
│   ├── tokens.yaml            # Design Tokens（只读）
│   ├── tokens.local.yaml      # 项目级覆盖（可选）
│   ├── design-system.md       # 设计系统文档（模型记忆源）
│   ├── pages/                 # 页面 DSL / Spec
│   │   ├── dashboard.yaml
│   │   ├── settings.yaml
│   │   └── ...
│   └── screenshots/           # 视觉快照
│       ├── dashboard-v1.png
│       └── ...
├── src/
│   ├── components/
│   │   └── ui/                # 基础组件（不可修改视觉规范）
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   └── app/
│       └── ...
└── ...
```

---

## 九、关于 Figma

### 9.1 要不要学

**要，但只学 20% 就够了。** 你只要会以下 5 个操作：

1. `Frame` — 画布容器
2. `Auto Layout` — 自动布局（类似 Flexbox）
3. `Component` — 组件定义
4. `Variant` — 组件变体
5. `Styles / Variables` — 样式和变量（对应 Token）

### 9.2 Figma 的定位

| 场景 | Figma 的角色 |
|------|-------------|
| 快速做原型 | 不需要，浏览器更快 |
| 给别人评审 | 输出终端之一，模型帮你生成 Spec |
| 与设计师协作 | 接收设计师的 Token/组件，反向同步到代码 |
| 长期沉淀 | 双 target 输出——同一份 DSL 编译到 Code 和 Figma |

### 9.3 三种 Figma 协作成熟度

| Level | 方式 | 稳定性 | 适合阶段 |
|-------|------|--------|----------|
| L1 | 模型输出 Figma 文本描述稿，你用 Figma AI/插件生成 | 最稳 | 早期 |
| L2 | 模型先生成网页原型，确认后照搬到 Figma | 最实用 | 中期 |
| L3 | 模型直接调用 Figma API 生成节点 | 最自动化，依赖工具链 | 后期 |

---

## 十、场景速查

| 你的场景 | 推荐路线 | 关键动作 |
|----------|----------|----------|
| 尽快做产品原型 | 路线 A：Code-first | Claude 出 Spec → Codex 出原型 → 浏览器迭代 |
| 需要对外展示/评审 | 路线 B：Spec-first → Figma | Claude 出 Spec → Figma AI 生成 → 轻量编辑 |
| 探索产品气质 | 路线 C：Image-first | Claude 出几版视觉稿 → 选方向 → 再编译 |
| 长期沉淀团队能力 | DSL + 双 target | 定义页面 DSL → 编译到 Code 和 Figma |
| 单页面快速迭代 | Code-first + 审查回路 | 改 Prompt → 刷新浏览器 → 审查 Drift |

---

## 十一、参考资源

### GitHub 项目

| 项目 | 价值 |
|------|------|
| `anthropics/claude-code` + `frontend-design` 插件 | Claude 官方设计方向插件 |
| `Dammyjay93/interface-design` | 设计决策持久化方案（`.interface-design/system.md`） |
| `wilwaldon/Claude-Code-Frontend-Design-Toolkit` | 工具与方法汇总 |
| `openai/skills` | Codex 的技能模块化方案 |

### 关键跟踪方向

- Claude Code 如何做一致性 UI
- Skill / Design System 约束 AI 产出的前端
- Design Drift 防治（`drift-guard` 类项目）
- 浏览器可视反馈接入 AI UI 开发流程
- Codex / Claude 的 skill 使用经验
- Tailwind + shadcn/ui + Radix 与 agent 的配合方式

---

## 附：一句话总结

> **对资深后端开发者而言，Figma 不该是起点，而该是目标格式之一。你真正要做的是搭建一条"产品意图 → 结构化中间层 → UI 原型"的编译流水线，让模型在设计系统中工作，而不是自由发挥。**
