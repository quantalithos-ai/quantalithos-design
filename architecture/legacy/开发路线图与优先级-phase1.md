# 开发路线图与优先级

> ⚠️ **状态:2026-05-08 已被 A 方案重写覆盖**
>
> 本文按 Phase 1/2/3/4 + 8 子项目组织,与 A 方案的 L0-L5 × 26 仓拆分不一致。A 方案下的路线图见:
>
> - 本文件(同名)的 A 方案重写版 —— 本轮会话正在重写
> - 决策源头:`discussions/2026-05-07-标准与建模.md` 第 7 轮
>
> 本文保留仅作 Phase 1 历史对照,不再更新,新设计请勿引用。

---

## 一、开发原则(Phase 1 遗留,已过时)

1. **先跑通再迭代**：每个阶段都要有可运行的产物
2. **核心路径优先**：先打通用户 → SDK → gate → platform → flow → runtime → Agent 的主链路
3. **逐步增加复杂度**：从单角色到多角色，从线性流程到 BPMN 完整流程
4. **技术债务可控**：每个阶段结束后进行必要重构

---

## 二、三阶段开发路线图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           开发路线图总览                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: 全链路最小闭环                                                     │
│  ────────────────────                                                       │
│  目标：用户能通过 chat 与 Agent 对话，Agent 能按流程执行任务                  │
│  产物：8 个子项目全部最小版                                                  │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Phase 2: 完善与扩展                                                         │
│  ────────────────────                                                       │
│  目标：BPMN 完整流程、WebSocket 实时推送、Tauri 桌面端、监控                  │
│  产物：完整的六阶段流程 + 多 Agent 并行 + 实时通信                            │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Phase 2B: 部署拓扑改造（单独立项，跳过 Phase 2 gRPC）                         │
│  ──────────────────────────                                                 │
│  目标：Member 容器化架构（1 Docker 容器 = 1 AI Member）                       │
│  产物：member / runtime 新版 / tools / member-images / member-service         │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Phase 3: 企业级能力                                                         │
│  ────────────────────                                                       │
│  目标：知识库、移动端、多租户、动态流程编排                                    │
│  产物：企业级 AI 研发协作平台                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 三、Phase 1：全链路最小闭环

**目标：** 用户能通过 chat 与 Assistant 对话，发起项目，Agent 按流程执行任务，用户能审批门禁

**周期：** 6-8 周

### 启动顺序

```
第一批：基础设施 + 数据层（其他所有服务的地基）

  ① infra
     Docker Compose（PostgreSQL + Redis + MinIO）
     数据库迁移脚本（5 张核心表）
     初始数据（系统角色、共享规则、流程模板）
     setup-dev.sh、.env 配置

  ② platform
     依赖：infra（数据库就绪）
     6 模块 CRUD API
     多视图（/views/ai、/views/card）
     事件总线（进程内 broadcast）

  ③ sdk-models + sdk-api
     依赖：platform（API 可调用）
     全部数据模型（Rust struct）
     全部 API 客户端方法

第二批：核心共享库 + 引擎层（业务核心）

  ③.5 core
     依赖：无（纯库，不依赖任何服务）
     schemas/（JSON Schema：FlowMessage、NodeResult、ProcessDefinition、RoleDefinition、SharedRule）
     python/bpmn/（BPMN 引擎：FlowNode、BPMNEngine、NodeVisitor 接口）
     python/protocol/（FlowMessage、NodeResult）
     python/models/（RoleDefinition、SharedRule、WorkItem）

  ④ runtime
     依赖：core + platform API 可用
     Agent 基类 + 生命周期
     LLM 调用封装
     工具系统（file_read/write、code_execute、task_read/create）
     submit_step_result / ask_teammate 动态工具
     AgentNodeVisitor（实现 core 的 NodeVisitor 接口）
     角色加载（Assistant、Tech Lead）
     共享规则加载（schema + content）

  ⑤ flow
     依赖：core + runtime + platform
     FlowNodeVisitor（实现 core 的 NodeVisitor 接口）
     ProcessDefinition 加载（YAML → nodes + edges）
     节点调度器（ActivityNode → FlowMessage、GatewayNode → 条件路由）
     门禁控制（GateRequest → GateCard → 等待用户操作）
     NodeResult 处理（推进/回退/重试）
     监听 platform 事件，构造 FlowMessage 发给 runtime
     daemon 事件循环

第三批：接入层（用户可见）

  ⑥ gate
     依赖：platform + flow + runtime 都在运行
     JWT 认证（登录、校验、刷新）
     静态路由（YAML 配置 → upstream 转发）
     HTTP 反向代理、CORS、请求日志

  ⑦ sdk-wasm
     依赖：gate（API 入口就绪）
     WASM 编译（sdk-models + sdk-api → wasm-bindgen）
     基础绑定（API 调用桥接）

  ⑧ chat
     依赖：sdk-wasm + gate
     三栏布局（NavBar + ConvList + MainContent）
     Assistant 私聊、项目群聊（Phase 1 轮询）
     门禁审批卡片、工单看板、项目进度

第四批：同步 + 联调

  ⑨ sync
     依赖：platform API 可用
     init（创建本地项目目录 + manifest.yaml）
     restore（从 platform 拉取到本地）

  ⑩ 全链路联调
     用户打开 chat → 与 Assistant 对话 → 发起项目
     → Assistant 执行启动流程 → 创建群聊 → TL 加入
     → TL 目标校准 → 阶段推进 → 门禁审批
     → 用户确认 → 进入下一阶段
     修复联调中发现的问题
```

### 各子项目 Phase 1 范围

| 子项目 | Phase 1 范围 |
|--------|-------------|
| infra | Docker Compose（PostgreSQL + Redis + MinIO）、DB 迁移、初始数据、setup-dev.sh |
| platform | 6 模块 CRUD API + 多视图（/views/ai、/views/card）+ 事件总线（进程内） |
| sdk | sdk-models（全部数据模型）+ sdk-api（全部 API 客户端）+ sdk-wasm（基础绑定） |
| core | schemas/（6 种 JSON Schema）+ python/bpmn/（BPMN 引擎 + NodeVisitor 接口）+ python/protocol/（FlowMessage + NodeResult）+ python/models/（共享数据模型） |
| runtime | Agent 基类、LLM 调用、工具系统、submit_step_result、ask_teammate、Assistant + TL 角色、AgentNodeVisitor（依赖 core） |
| flow | FlowNodeVisitor、ProcessDefinition 加载、节点调度（ActivityNode + GatewayNode）、门禁控制、监听 platform 事件（依赖 core） |
| gate | JWT 认证、静态路由、HTTP 反向代理、CORS、请求日志 |
| chat | 三栏布局、Assistant 私聊、项目群聊、消息收发（轮询）、门禁审批卡片、工单看板、项目进度 |
| sync | init + restore 基础功能、manifest 解析 |

### Phase 1 验收标准

- [ ] 用户可以在 chat 中与 Assistant 对话
- [ ] Assistant 能按工作流执行启动流程（识别意图 → 收集信息 → 创建项目）
- [ ] 项目群聊创建，Tech Lead 加入
- [ ] TL 能执行目标校准，产出 goal_alignment_brief
- [ ] 阶段能按 ProcessDefinition 推进（alignment → requirement）
- [ ] 门禁卡片能在 chat 中展示，用户能确认/驳回
- [ ] 工单能创建、分配、状态流转
- [ ] 看板能展示工单状态
- [ ] 进度页能展示 Pipeline 进度
- [ ] `quantalithos-sync init` 能创建本地项目目录

### Phase 1 技术栈

```
chat:      Vue 3 + Vite + Naive UI + Pinia + @quantalithos/sdk-wasm
sdk:       Rust (sdk-models + sdk-api + sdk-wasm)
gate:      Rust (axum + jsonwebtoken)
platform:  Rust (axum + sqlx + tokio)
core:      Python (Pydantic) + JSON Schema
flow:      Python (asyncio, 依赖 core)
runtime:   Python (asyncio + Pydantic + structlog, 依赖 core)
infra:     Docker Compose + PostgreSQL + Redis + MinIO
```

---

## 四、Phase 2：完善与扩展

**目标：** BPMN 完整流程、WebSocket 实时推送、多 Agent 并行、Tauri 桌面端

### 开发顺序

```
第一批：实时通信基础

  ① sdk-ws + sdk-store
     WebSocket 连接管理（自动重连、心跳、订阅）
     状态管理（聊天、工单、门禁、通知）

  ② gate WebSocket
     依赖：sdk-ws
     WebSocket 两层管理（外层客户端 + 内层后端事件通道）
     后端事件源接入（platform SSE → Redis Pub/Sub）

  ③ platform 事件总线升级
     依赖：gate WebSocket
     进程内 broadcast → Redis Pub/Sub
     事件推送到 gate

第二批：引擎层扩展

  ④ runtime 角色扩展
     依赖：Phase 1 runtime 稳定
     新增角色：Backend Dev、Frontend Dev、Tester、DevOps
     记忆持久化（内存 → PostgreSQL）
     Agent 快照/恢复（suspend / resume）

  ⑤ flow BPMN Level 2
     依赖：runtime 多角色可用
     Parallel Gateway（多任务并行 fork/join）
     Boundary Event（节点超时、节点失败）
     Service Task（CI 触发、自动部署）
     并行任务调度（platform 驱动依赖图 + 自动调度）
     动态流程编译（TL 提议 → flow 编译）

第三批：前端升级

  ⑥ sdk-wasm 完整绑定
     依赖：sdk-ws + sdk-store
     WebSocket 桥接 + 状态管理桥接

  ⑦ chat 实时化 + Tauri
     依赖：sdk-wasm 完整绑定
     轮询 → WebSocket 实时推送
     Tauri 桌面端（系统通知、托盘）
     虚拟滚动（消息列表性能优化）

  ⑧ console 管理后台（Phase 2 首版）
     依赖：sdk-wasm 完整绑定 + platform API 稳定
     项目管理（列表、详情、仪表盘）
     工单管理（列表、看板、依赖图）
     Agent 配置中心（角色编辑、规则管理、三级覆盖可视化）
     产物管理（列表、预览、版本历史）
     基础监控（服务健康、LLM 统计）

第四批：运维 + 同步

  ⑧ infra 升级
     K8s 配置（Deployment / Service / Ingress）
     Prometheus + Grafana + Loki
     CI/CD 完整流水线（构建 → 测试 → 镜像 → 部署）

  ⑨ sync 完善
     pull / push 增量同步
     daemon 集成（项目启动时 restore，变更时 push）
     client/ 模块迁移到 sdk-api

  ⑩ platform 扩展
     知识库模块（Phase 2 基础版，文档索引）
     产物搜索（全文搜索）
     产物版本历史（diff、回滚）
     OAuth 集成（gate 侧 + platform 用户管理）

第五批：外部系统集成

  ⑪ Git 集成
     Agent 的 file_write/git_commit 工具对接真实 Git 仓库
     platform 存储 repo_url + branch 信息
     代码审查产物关联到 Git commit/PR
     Phase 1 替代方案：Agent 在沙箱目录写文件，不对接真实 Git

  ⑫ CI/CD 集成
     flow 的 ServiceTask 对接 CI pipeline（GitHub Actions / GitLab CI）
     阶段 5 发布执行：触发部署 → 等待结果 → 观察期 → 确认/回滚
     platform 存储 CI 运行状态和日志链接
     Phase 1 替代方案：Agent 手动运行测试命令，不对接 CI

  ⑬ runtime 工具扩展
     原型生成工具：Agent 生成 HTML 原型 → 存为 Artifact(type=prototype)
     代码执行沙箱：安全运行 Agent 生成的代码（Docker 隔离）
     文档生成工具：Agent 生成 Markdown → 存为 Artifact(type=document)

  ⑮ 多模型调用工具（Phase 2）
     ModelProvider trait + HttpModelProvider 实现
     generate_image 工具：调用图像生成模型（DALL-E / Stable Diffusion）
     analyze_image 工具：调用视觉模型分析截图/设计稿
     translate 工具：调用翻译模型（DeepL / Claude）
     model_registry 扩展：支持注册图像/翻译/视觉模型
     角色 tools 列表更新（frontend_dev + tester 新增 image 工具）

  ⑭ platform hub-design 模块
     Design Tokens CRUD（颜色/字体/间距/圆角，三级覆盖 system/company/project）
     组件库 CRUD（组件定义/变体/props/模板/样式，system 内置 + project 自定义）
     原型 CRUD（组件树/版本管理/关联 Design Tokens）
     组件预览 API + 原型预览 API
```

### Phase 2 验收标准

- [ ] 完整六阶段流程可运行（alignment → release）
- [ ] 多 Agent 并行开发（阶段 3 多任务并行）
- [ ] WebSocket 实时推送（消息、状态变更、门禁通知）
- [ ] Tauri 桌面端可用（系统通知、托盘）
- [ ] Agent 快照/恢复可用（用户隔天回来继续项目）
- [ ] 监控面板可用（Grafana）
- [ ] console 管理后台可用（项目/工单/Agent配置/产物/监控）
- [ ] 设计系统基础可用（Design Tokens + 组件库 CRUD）
- [ ] Git 集成：Agent 代码变更可追溯到 Git commit
- [ ] CI/CD 集成：阶段 5 可触发自动部署
- [ ] Agent 可生成 HTML 原型并存为 Artifact
- [ ] 多模型工具可用（Agent 能调用图像生成/视觉分析/翻译模型）
- [ ] `quantalithos-sync pull/push` 增量同步可用

---

## 四·五、Phase 2B：Member 容器化架构改造

**目标：** 将 `1 flow : 1 runtime : N agents (进程内协程)` 演进到 **"1 Container = 1 AI Member"** 的容器化架构。每个 AI Member 是一个 Docker 容器，容器内由 Member 进程（门面/嘴耳）+ Runtime 进程（大脑）+ Tool 组件（技能）组成。

**前置：** 无（Phase 2 gRPC 改造已跳过，见决策 Q1）。

**范围：** core / flow / platform 改造 + **5 个新项目**（member / runtime 新版 / tools / member-images / member-service）。

**定稿设计：** [Member 容器化架构设计](./member-container-architecture.md)

### 关键决策（已定）

- D1 部署拓扑：**Member 容器化**（1 Docker 容器 = 1 AI Member，内含 Member + Runtime 双进程）
- D2 生命周期：容器持久常驻，destroy 触发退出
- D3 supervisor：**独立的 member-service** 承担（非 flow）
- D4 容器编排：ContainerOrchestrator 抽象，Phase 2B 仅实现 DockerOrchestrator，k8s 留 Phase 3+
- D5 内部 IPC：容器内 Member ↔ Runtime 通过 UDS gRPC 通信
- D6 镜像策略：**per-role image**（quantalithos/ai-member-{role}:tag）
- D7 网络：所有 Member 容器接入 quantalithos-internal Docker 网络
- D8 Q1 节奏：跳过 Phase 2 gRPC，直接做 Phase 2B 容器化
- D9 Q2 旧实现：**直接切换**，旧 runtime 归档（git tag v1.0-phase1 保留历史）
- D10 Q3 验收范围：**中范围** — 3 个 Member（TL/Dev/QA）协作完成一个迭代

### 里程碑划分（M1 ~ M7，6-8 周）

- **M1** 契约与基础设施（Week 1）
  - core 扩展 member proto（lifecycle / delivery / register / ipc）
  - base image Dockerfile 雏形（含 supervisord）
  - IPC 协议验证（UDS gRPC 可行性）
- **M2** Member/Runtime 最小 MVP（Week 2-3）
  - quantalithos-member 骨架（Register + Shutdown + Inbox）
  - quantalithos-runtime 骨架（LLM Loop + 回消息）
  - backend-dev image 可构建可启动
- **M3** member-service + 容器编排（Week 3-4）
  - DockerOrchestrator / Endpoint Registry / Heartbeat Monitor
  - 3 个 role image 可 build
  - 崩溃恢复 + 优雅关闭
- **M4** Tools 集成（Week 4-5）
  - tools/core 抽象
  - tools/code + tools/git_local 实现
  - ToolCallSite 审计打到 platform
- **M5** Flow 改造（Week 5-6）
  - flow 去掉旧 runtime 管理代码
  - flow 对接 member-service
  - 消息投递改为 Member inbox 模式
- **M6** 端到端联调（Week 6-7）
  - 3 Member 协作场景验证
  - Phase 1 自测 checklist 覆盖
  - 性能 baseline
- **M7** 收尾（Week 7-8）
  - 旧 runtime 归档
  - 文档更新 + 部署手册
  - Phase 2C 规划

### 验收标准

- [ ] member-service 能通过 Docker API 成功 spawn 3 个不同 role 的容器
- [ ] 容器启动到 Register 成功时间 < 10s
- [ ] 崩溃恢复跑通（kill -9 后按 restart_policy 自动重拉）
- [ ] 优雅关闭跑通（SIGTERM 后 30s grace）
- [ ] 容器内 Member + Runtime + Tool 三层协作成功完成一个 node_execute
- [ ] 3 个 Member（TL/Dev/QA）协作完成一个迭代（需求 → 设计 → 实现 → 审查）
- [ ] ToolCallSite 审计日志完整落 platform
- [ ] launch_token 握手防冒充有效
- [ ] 连续运行 4 小时无 crash

### 显式不做

- ✗ 用户接管 AI Member（assume_control）→ Phase 3
- ✗ Conversation 独立服务 → Phase 2C
- ✗ tool-gateway 独立服务 → Phase 3
- ✗ Browser/Test/LSP Skill → Phase 2C+
- ✗ k8s 部署 → Phase 3+
- ✗ 状态持久化 checkpoint → Phase 3

---

## 五、Phase 3：企业级能力

**目标：** 知识库、移动端、多租户、动态流程编排

### 开发顺序

```
第一批：核心能力下沉

  ① runtime Rust 框架骨架
     进程管理、消息总线、权限引擎、沙箱 → Rust (PyO3)
     Python 保留业务模块（LLM 调用、prompt 组装、记忆、工具）
     代码执行沙箱（Rust 进程级隔离）

  ② flow BPMN Level 3
     Inclusive Gateway (OR)
     Event-based Gateway
     Compensation Event（发布回滚）
     Transaction Sub-Process
     规范约束层（硬规则列表：TL 不能裁剪哪些节点）
     TailoringPolicy 完整实现

第二批：平台能力

  ③ platform 企业级
     多租户隔离
     审计日志（敏感操作记录）
     API 开放平台（外部系统集成）
     知识库完整版（RAG、向量存储、语义检索）

  ③.5 设计工具集成
     Figma API 集成：Agent 生成设计 token → Figma 渲染设计稿
     设计系统管理：色彩/字体/间距/组件库存储在 platform
     设计稿版本管理：Artifact(type=design) + 版本 diff
     chat 设计预览：内嵌 Figma 预览组件（iframe / Figma Embed）
     Phase 1/2 替代方案：Agent 生成 HTML 原型，不对接 Figma

  ③.6 跨平台真机测试（quantalithos-testbed）
     设备注册和管理（Android 真机/模拟器 + macOS + Windows）
     应用部署（ADB install / SSH）
     Appium UI 自动化（声明式 YAML 测试脚本）
     测试结果收集（截图/日志/crash report/性能数据）
     Tester Agent device_* 工具集成
     上报结果到 platform（device_test_report Artifact）

  ④ gate 企业级
     服务发现（Consul / etcd）
     负载均衡（多实例后端）
     熔断器（后端故障快速失败）
     API 版本管理（/api/v1/ /api/v2/）

第三批：多端

  ⑤ sdk UniFFI 绑定
     Swift 绑定（iOS）
     Kotlin 绑定（Android）
     flutter_rust_bridge（Flutter）
     TS 类型自动生成（tsify）
     离线支持（断网缓存操作，恢复后同步）

  ⑥ chat 多端
     移动端适配（响应式布局）
     流程图交互（Vue Flow，点击节点查看详情、缩放拖拽）
     Agent 配置可视化编辑器
     深色/浅色主题切换

第四批：收尾

  ⑦ runtime 高级能力
     技能自进化（Agent 完成任务后自动沉淀技能模板）
     长期记忆（向量库，跨项目经验检索）

  ⑧ sync 高级能力
     冲突解决策略（本地和云端同时修改时）
     离线操作队列

  ⑨ infra 生产级
     Helm Chart（K8s 包管理）
     蓝绿部署（零停机发布）
     安全扫描（镜像漏洞、依赖审计）

  ⑩ 全面测试 + 文档
     端到端测试（完整项目生命周期）
     性能测试（多项目并发、多 Agent 并行）
     用户文档 + API 文档
```

### Phase 3 验收标准

- [ ] Agent 能查询公司内部知识库（RAG）
- [ ] 生成的代码能在沙箱中安全运行
- [ ] 移动端（iOS/Android）可用
- [ ] 多租户隔离
- [ ] 流程可动态编排（TL 提议 → flow 编译）
- [ ] Rust 框架骨架运行（性能热点下沉）
- [ ] Figma 集成：Agent 可生成设计稿并在 chat 中预览
- [ ] 设计系统管理：项目级设计规范可配置
- [ ] 端到端测试通过
- [ ] 产品可交付

---

## 六、总体优先级矩阵

```
                    重要性
           低                    高
        ┌─────────────────────────────┐
   低   │  Phase 3                   │
   紧   │  · 移动端                  │
   急   │  · 多租户                  │
   性   │  · Helm Chart              │
        ├─────────────────────────────┤
   高   │  Phase 2                   │  Phase 1（核心）
        │  · WebSocket               │  · platform CRUD
        │  · Tauri 桌面端            │  · runtime Agent 基类
        │  · 并行任务调度            │  · flow 节点调度
        │  · 监控告警                │  · gate JWT + 路由
        │  · Agent 快照              │  · sdk 数据模型 + API
        │                            │  · chat 三栏布局
        │                            │  · infra Docker Compose
        └─────────────────────────────┘
```

---

## 七、里程碑时间线

```
Week 1-2:   基础设施 + 数据层
                ↓
            Milestone 1: platform API 可调用，Docker Compose 可启动
                ↓
Week 3-4:   引擎层
                ↓
            Milestone 2: Agent 能执行任务，flow 能推进流程
                ↓
Week 5-6:   接入层
                ↓
            Milestone 3: 用户能通过 chat 与 Agent 对话
                ↓
Week 7-8:   联调 + 修复
                ↓
            Milestone 4: Phase 1 全链路闭环 ✅
                ↓
Week 9-16:  Phase 2 完善
                ↓
            Milestone 5: 完整六阶段流程 + 实时通信 + Tauri
                ↓
Week 17-28: Phase 3 企业级
                ↓
            Milestone 6: 企业级 AI 研发协作平台 ✅
```
