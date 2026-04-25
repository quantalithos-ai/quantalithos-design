# Claude Code 主导的软件全生命周期设计工作流调研报告

## 核心架构

以 Claude Code 为唯一交互入口，通过 MCP (Model Context Protocol) 调度外部设计工具和 AI 模型，覆盖软件从需求到发布的全部视觉/设计产出环节。用户无需切换工具，所有操作在 Claude Code 终端内完成。

## 需要配置的 MCP Server 清单

| MCP Server | 用途 | 来源 | 仓库/文档 |
|---|---|---|---|
| Figma MCP | 读写 Figma 画布，双向同步设计稿与代码 | Figma 官方 | https://www.figma.com/blog/introducing-claude-code-to-figma/ |
| openai-gpt-image-mcp | 调用 GPT Image (gpt-image-1/gpt-image-2) 生成设计图 | 社区 | https://github.com/SureScaleAI/openai-gpt-image-mcp |
| 21st.dev Magic MCP | 自然语言生成 UI 组件代码 + 实时预览 (类似 v0) | 21st.dev | https://mcpservers.org/en/servers/21st-dev/magic-mcp |
| Playwright MCP | 浏览器自动化、截图、UI 视觉验证 | Microsoft | https://playwright.dev/python/docs/next/getting-started-mcp |
| Vercel MCP | 部署、预览、项目管理 | Vercel 官方 | https://vercel.com/docs/ai-resources/vercel-mcp |
| zen-mcp-server | 调度多模型 (Gemini/GPT/Grok/Ollama) | 社区 | https://github.com/BeehiveInnovations/gemini-mcp-server |
| mcp-image (Gemini) | 调用 Gemini Imagen 生成图片 | 社区 | https://github.com/shinpr/mcp-image |
| Bannerbear API | 批量生成运营素材 (多尺寸/多语言) | Bannerbear | https://www.bannerbear.com/ |

## 各阶段工作流

### 阶段 1: 需求与概念

**输入:** 自然语言需求描述
**Claude Code 调度:**
- GPT Image MCP → 生成情绪板 (Moodboard)、用户画像卡片
- Figma MCP → 写入 FigJam 生成信息架构图、业务流程图
- 本地 → 输出结构化需求文档 (markdown)

**产出:** 情绪板图片、信息架构图 (Figma)、需求文档

### 阶段 2: 原型设计

**输入:** 页面/功能描述
**Claude Code 调度:**
- GPT Image MCP → 生成高保真 UI mockup 图片
- Figma MCP → 将设计写入 Figma 画布 (可编辑图层)
- 21st.dev Magic MCP → 同步生成对应前端组件代码
- Playwright MCP → 启动浏览器预览并截图确认

**产出:** UI mockup 图片、Figma 可编辑设计稿、前端组件代码、预览截图

**关键闭环:** 出图 → 入 Figma → 生成代码 → 预览验证，一条命令完成。

### 阶段 3: 品牌与视觉识别

**输入:** 品牌风格描述 (色调、气质、行业)
**Claude Code 调度:**
- GPT Image MCP → 生成多个 Logo 方案
- zen-mcp-server → Gemini Imagen → 生成备选风格方案 (多模型对比)
- Figma MCP → 将选定方案写入 Figma，建立品牌规范页
- 本地 → 生成 design-tokens.json (颜色/字体/间距)

**产出:** Logo 方案图片、品牌规范 (Figma)、Design Token 文件

**技巧:** 通过 zen-mcp-server 同时调用多个图像模型，一次对话中对比不同风格。

### 阶段 4: UI 组件与设计系统

**输入:** 品牌规范 + 组件需求
**Claude Code 调度:**
- Figma MCP → 读取品牌规范和 Design Token
- 21st.dev Magic MCP → 逐个生成 Button/Card/Nav/Form 等组件
- 本地 → 写入项目 components/ 目录
- Playwright MCP → 启动 Storybook 逐个截图验证

**产出:** 完整组件库代码、Storybook 截图、组件文档

### 阶段 5: 开发阶段

**输入:** Figma 设计稿
**Claude Code 调度:**
- Figma MCP (正向) → 读取设计稿的布局、Token、组件规格
- 本地 → 生成页面代码 (React/Vue/etc.)
- GPT Image MCP → 生成页面需要的占位图/插图
- Playwright MCP → 打开浏览器验证实现效果
- Figma MCP (反向) → 将实现截图回写 Figma 供设计师 review

**产出:** 页面代码、占位图资源、实现截图 (回写 Figma)

**核心价值:** Figma 双向流 — 设计 → 代码 → 设计，全程不离开 Claude Code。

### 阶段 6: 内容与运营素材

**输入:** 素材需求描述
**Claude Code 调度:**
- Playwright MCP → 截取应用各页面截图
- GPT Image MCP → 生成宣传配图、场景图
- Bannerbear API → 批量套用模板生成多尺寸/多语言变体
- 本地 → 输出到 assets/marketing/ 目录

**产出:** 应用商店截图、社交媒体宣传图、邮件模板、多语言变体

### 阶段 7: 测试与优化

**输入:** A/B 测试需求 / 用户反馈
**Claude Code 调度:**
- 本地 → 生成多个 UI 变体代码
- Playwright MCP → 分别截图对比
- GPT Image MCP → 根据数据反馈生成改版设计图
- Figma MCP → 将改版方案写入 Figma

**产出:** UI 变体代码、对比截图、改版设计稿

### 阶段 8: 发布与推广

**输入:** 发布计划
**Claude Code 调度:**
- GPT Image MCP → 生成发布公告配图、文档插图
- Playwright MCP → 录制产品 Demo 截图序列
- Vercel MCP → 一键部署到生产环境
- 本地 → 生成 changelog、发布文档

**产出:** 发布配图、Demo 截图、线上部署、发布文档

### 阶段 9: 持续迭代

**输入:** 用户反馈 / 新功能需求
**Claude Code 调度:**
- Figma MCP → 读取当前设计稿
- GPT Image MCP → 生成新方案 mockup
- 21st.dev Magic MCP → 生成新组件代码
- Playwright MCP → 对比新旧版本截图
- Figma MCP → 回写新方案

**产出:** 新方案 mockup、新组件代码、新旧对比截图

## 架构图

```
                        用户 (唯一入口)
                            │
                       Claude Code
                       (指挥中枢)
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
     出图层              设计层              代码层
       │                    │                    │
  GPT Image MCP        Figma MCP         21st.dev Magic MCP
  Gemini Image MCP     (双向读写)         (UI 组件生成)
  (via zen-mcp)
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                 ┌──────────┼──────────┐
                 │          │          │
             Playwright   Vercel    Bannerbear
             MCP          MCP       API
             (验证/截图)  (部署)    (批量素材)
```

## MCP 配置优先级

按重要性排序，建议依次配置:

1. **openai-gpt-image-mcp** — 解决"出图"问题，覆盖 80% 设计需求
2. **Figma MCP** — 打通设计协作，实现双向同步
3. **21st.dev Magic MCP** — 设计到代码的桥梁，终端内的 v0
4. **Playwright MCP** — 视觉验证闭环，截图对比
5. **Vercel MCP** — 部署与预览
6. **zen-mcp-server** — 多模型调度，风格对比
7. **mcp-image (Gemini)** — 备选图像生成
8. **Bannerbear API** — 批量运营素材

## 关键模型能力对比

| 模型 | 擅长 | 不擅长 | 接入方式 |
|---|---|---|---|
| GPT-4o / GPT Image 2 | 快速出 UI mockup、文字渲染准确、迭代编辑 | 视觉艺术感不如 Midjourney | openai-gpt-image-mcp |
| Gemini + Imagen 4 | UI 布局生成、完整界面元素 | 生态不如 GPT 成熟 | mcp-image / zen-mcp-server |
| Midjourney V8 | 视觉质量最高、概念探索、品牌风格 | 精确 UI 控制弱、无直接 MCP | 需手动或通过 API wrapper |
| Claude (本体) | 代码生成、逻辑编排、需求分析 | 不能原生生成图片 | 直接使用 |

---

## 开源社区成功经验与项目

### 一、Figma 双向同步（最活跃的方向）

| 项目 | 说明 | 仓库 |
|---|---|---|
| cc-fig-mcp | Claude Code ↔ Figma 双向通信 MCP Server，通过 WebSocket relay 实时同步，最接近"CC 主导设计"理念 | https://github.com/agenisea/cc-fig-mcp |
| grab/cursor-talk-to-figma-mcp | Grab（东南亚超级应用）开源，支持 Claude Code 和 Cursor 读取设计稿并编程修改，大厂生产级实践 | https://github.com/grab/cursor-talk-to-figma-mcp |
| claude-talk-to-figma-mcp | 让 Claude Desktop、GitHub Copilot、Cursor 等直接与 Figma 交互，社区活跃度高 | https://github.com/arinspunk/claude-talk-to-figma-mcp |
| Figma-Context-MCP | 专注向 AI coding agent 提供 Figma 布局信息，适合 design-to-code 场景 | https://github.com/GLips/Figma-Context-MCP |
| figma-console-mcp | "Your design system as an API" — 连接 AI 到 Figma 做提取、创建和调试 | https://github.com/southleft/figma-console-mcp |
| Figma 官方 MCP Server Guide | Figma 官方出的 MCP 接入指南，权威参考 | https://github.com/figma/mcp-server-guide |

### 二、图像生成 MCP（Claude Code 调用外部模型出图）

| 项目 | 说明 | 仓库 |
|---|---|---|
| openai-gpt-image-mcp | 最成熟的 GPT Image MCP Server，支持 gpt-image-1/gpt-image-2 文生图和图片编辑 | https://github.com/SureScaleAI/openai-gpt-image-mcp |
| openai-image-gen-mcp | 另一个 OpenAI 图像生成 MCP，支持 inpainting、outpainting、compositing | https://github.com/jerryzhao173985/openai-image-gen-mcp |
| mcp-image (Gemini) | 通过 Gemini API 生成图片，支持 Nano Banana 2 等模型，最高 4K 分辨率 | https://github.com/shinpr/mcp-image |
| claude-image-gen | 用 Google Gemini 做图像生成，同时支持 Claude Code Skill 和 MCP 两种接入方式 | https://github.com/guinacio/claude-image-gen |
| image-generation-mcp (PyPI) | Python 包，支持 OpenAI / Stable Diffusion (SD WebUI) / 零成本占位图三种 provider，pip install 即用 | https://pypi.org/project/image-generation-mcp/ |
| claude-code-generate-images-mcp | 在 Claude Code 写 UI 代码时自动生成并插入图片资源，支持 Azure OpenAI gpt-image-1 和 Flux-1.1 Pro | https://github.com/TamerinTECH/claude-code-generate-images-mcp |

### 三、UI 组件生成

| 项目 | 说明 | 仓库 |
|---|---|---|
| 21st-dev/magic-mcp | "v0 in your IDE" — 自然语言生成现代 UI 组件，实时预览，TypeScript 支持，Claude Code 生态中最受欢迎的 UI 生成 MCP | https://github.com/21st-dev/magic-mcp |

### 四、Design Token 提取与设计系统

| 项目 | 说明 | 仓库/来源 |
|---|---|---|
| Pix Skill | 开源 Claude Code Skill，连接 Figma MCP 自动提取 design token、字体、间距，生成生产级前端组件代码 | https://www.linkedin.com/pulse/from-figma-code-automating-frontend-development-pix-chakravorty-5myqe |
| claude-code-figma | AI-first CLI，帮助 Claude Code 提取和实现 Figma 设计 | https://github.com/fakenickels/claude-code-figma |
| figmagic | 从 Figma 文档生成 design token、导出图形、提取 React 组件，"the missing piece between DevOps and design" | https://github.com/mikaelvesavuori/figmagic |

### 五、多模型调度（让 Claude Code 调用其他 AI）

| 项目 | 说明 | 仓库 |
|---|---|---|
| zen-mcp-server | 统一调度 Gemini / OpenAI / Grok / OpenRouter / Ollama，让 Claude Code 成为多模型指挥中心 | https://github.com/BeehiveInnovations/gemini-mcp-server |
| pal-mcp-server | zen-mcp 升级版，额外支持 Azure，更完善的多模型编排 | https://github.com/BeehiveInnovations/pal-mcp-server |

### 六、完整工作流框架（全流程编排）

| 项目 | 说明 | 仓库 |
|---|---|---|
| claude-code-studio | 把 Claude Code 变成完整开发工作室 — 40+ 专用 AI agent + MCP 集成 + 企业级工作流，包含设计/开发/测试全流程 agent | https://github.com/arnaldo-delisio/claude-code-studio |
| Claude-Code-Game-Studios | 48 个 AI agent + 36 个 workflow skill，模拟真实游戏工作室层级结构，架构思路可复用到设计工作流 | https://github.com/Donchitos/Claude-Code-Game-Studios |
| claude-flow | Claude 的 agent 编排平台，支持多 agent swarm、分布式协作、RAG 集成，GitHub 排名靠前的 agent 框架 | https://github.com/ruvnet/claude-code-flow |
| claude_code_agent_farm | 20+ Claude Code agent 并行运行的编排框架，tmux 实时监控 | https://github.com/Dicklesworthstone/claude_code_agent_farm |

### 七、真实企业案例

#### Grindr — Figma MCP + Claude 自动化 Android UI
- 来源: https://www.grindr.com/blog/why-i-stopped-writing-simple-view-components
- 内容: Grindr 工程师用 Figma MCP + Claude 自动生成 Android Compose UI，不再手写简单视图组件。从 Figma 读取精确的 padding/spacing 直接生成代码。
- 价值: 证明了 Figma MCP → Claude Code → 生产代码这条路在移动端也跑得通。

#### Figma 官方 — Code to Figma 双向流
- 来源: https://www.figma.com/blog/introducing-claude-code-to-figma/
- 内容: 开发者用 Claude Code 写代码 → 截取运行中的界面 → 自动转为可编辑 Figma 帧。
- 价值: 官方背书的双向流，打破了设计→开发的单向瀑布。

#### 2 小时不用 Figma 构建完整应用
- 来源: https://www.mejba.me/blog/claude-code-designers-figma-sync
- 内容: 一位开发者用 Claude Code + Figma MCP 在 2 小时内完成设计系统翻译、快速原型、组件同步三个场景。
- 价值: 验证了 Claude Code 主导设计工作流的效率提升。

#### ByteByteGo — Design to Code, Code to Design
- 来源: https://blog.bytebytego.com/p/figma-design-to-code-code-to-design
- 内容: 技术博客详细拆解了 Figma MCP 双向流的技术架构和实际效果。
- 价值: 提供了完整的技术架构参考。

### 八、成熟度评估

| 方向 | 成熟度 | 说明 |
|---|---|---|
| Figma 双向同步 | ★★★★★ | 官方支持 + 多个社区实现 + 企业案例验证 |
| GPT Image 生成 MCP | ★★★★☆ | 多个可用实现，API 稳定，但图片质量依赖 prompt 技巧 |
| UI 组件生成 (21st.dev) | ★★★★☆ | 社区认可度高，但仅限 React/Tailwind 生态 |
| Design Token 提取 | ★★★☆☆ | 有可用工具但需要手动串联 |
| 多模型调度 | ★★★☆☆ | zen-mcp 可用但配置复杂 |
| 全流程编排 | ★★☆☆☆ | 有框架参考但无针对设计流程的完整模板 |

### 九、建议搭建路径

开源社区已经把这条路跑通了大约 70%。最成熟的部分是 Figma 双向同步和图像生成 MCP，最缺的是一个把所有 MCP 串起来的"全流程编排模板"。

推荐分三步搭建:

1. **第一步 (核心闭环):** 配置 openai-gpt-image-mcp + cc-fig-mcp — 解决出图和 Figma 同步
2. **第二步 (代码桥梁):** 加上 21st-dev/magic-mcp + Playwright MCP — 解决 UI 组件生成和视觉验证
3. **第三步 (全流程):** 参考 claude-code-studio 的架构做全流程编排，按需加入 zen-mcp-server / Vercel MCP / Bannerbear

---

## 调研时间

2026-04-25 (初稿 2026-04-24，补充开源社区调研 2026-04-25)

## 参考来源

### 工具与方案
- Figma 官方博客: https://www.figma.com/blog/introducing-claude-code-to-figma/
- Figma 双向流: https://www.lennysnewsletter.com/p/from-figma-to-claude-code-and-back
- Figma MCP 官方指南: https://github.com/figma/mcp-server-guide
- GPT Image 2: https://www.buildfastwithai.com/blogs/chatgpt-images-2-0-gpt-image-2-2026
- 21st.dev Magic MCP: https://mcpservers.org/en/servers/21st-dev/magic-mcp
- zen-mcp-server: https://www.mcplane.com/mcp_servers/zenserver
- Playwright MCP: https://getdecipher.com/blog/how-to-use-claude-code-to-write-playwright-tests-(with-playwright-mcp)
- Vercel MCP: https://vercel.com/docs/ai-resources/vercel-mcp
- openai-gpt-image-mcp: https://github.com/SureScaleAI/openai-gpt-image-mcp
- Imagen 4 UI 设计: https://blog.tuttosemplice.com/en/ui-prototypes-with-imagen-4-from-text-to-mockup-in-seconds/
- v0 + Claude Code 工作流: https://www.nimblestudio.com/story/claude-code-vs-v0-and-lovable-how-to-prototype-in-code-without-breaking-your-design-system
- Claude Design: https://linas.substack.com/p/chatgpt-images-2-claude-design-guide
- Figma AI 2026: https://humbldesign.io/blog-posts/figma-ai-design
- img2figma: https://imageeditorfigma.com/

### 开源项目
- cc-fig-mcp: https://github.com/agenisea/cc-fig-mcp
- grab/cursor-talk-to-figma-mcp: https://github.com/grab/cursor-talk-to-figma-mcp
- claude-talk-to-figma-mcp: https://github.com/arinspunk/claude-talk-to-figma-mcp
- Figma-Context-MCP: https://github.com/GLips/Figma-Context-MCP
- figma-console-mcp: https://github.com/southleft/figma-console-mcp
- openai-image-gen-mcp: https://github.com/jerryzhao173985/openai-image-gen-mcp
- mcp-image (Gemini): https://github.com/shinpr/mcp-image
- claude-image-gen: https://github.com/guinacio/claude-image-gen
- image-generation-mcp: https://pypi.org/project/image-generation-mcp/
- claude-code-generate-images-mcp: https://github.com/TamerinTECH/claude-code-generate-images-mcp
- 21st-dev/magic-mcp: https://github.com/21st-dev/magic-mcp
- claude-code-figma: https://github.com/fakenickels/claude-code-figma
- figmagic: https://github.com/mikaelvesavuori/figmagic
- pal-mcp-server: https://github.com/BeehiveInnovations/pal-mcp-server
- claude-code-studio: https://github.com/arnaldo-delisio/claude-code-studio
- Claude-Code-Game-Studios: https://github.com/Donchitos/Claude-Code-Game-Studios
- claude-flow: https://github.com/ruvnet/claude-code-flow
- claude_code_agent_farm: https://github.com/Dicklesworthstone/claude_code_agent_farm

### 企业案例
- Grindr Figma MCP 实践: https://www.grindr.com/blog/why-i-stopped-writing-simple-view-components
- ByteByteGo 架构分析: https://blog.bytebytego.com/p/figma-design-to-code-code-to-design
- Figma CTO 指南: https://alexbobes.com/tech/figma-mcp-the-cto-guide-to-design-to-code-in-2026/
