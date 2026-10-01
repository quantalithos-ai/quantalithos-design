## Step 1. 与上游文档的关系声明

### 1. Step 状态

- 状态：`[x] 已确认`
- gate_status：`pass`
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 1
- 回填章节：正式 `projects/L5-chat/00-需求文档.md` §1
- 当前模块：`upstream-source-map`
- 模式：`full-restart + single-agent-serial`

### 1.1 Step 内计划

- [x] 读取项目台账、需求 flow、Step 1 文件和需求 SOP / 书写规范。
- [x] 读取启动规范和当前上游正式输入的来源定位。
- [x] 吸收已冻结原型带来的新增主题：项目详情、项目流程、群聊绑定、公司成员目录、BPMN 并行结构。
- [x] 回答上游来源、承接主题、非重定义关系和本仓细化作用。
- [x] 诊断旧 Step 1 与已冻结原型之间的缺口。
- [x] 形成来源映射、owner 主题映射、Chat 边界图和 capability gap 登记。
- [x] 形成正式 §1 回填草稿并完成自检。
- [x] 更新需求 flow 和项目恢复点；不进入 Step 2。

### 2. 本步输入

#### 2.1 规范来源

- `standards/document/设计文档编写通则.md`
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `standards/document/需求文档讨论流程_SOP.md`
- `standards/document/需求文档书写规范.md`

#### 2.2 当前正式上游

按项目台账的 current formal input 读取：

- `projects/L0-sdk/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-conversation/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-identity/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-work/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-governance/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-artifact/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L1-workspace/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L2-member/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L2-runtime/00-需求文档.md` ～ `07-实施计划.md`
- `projects/L4-observability/00-需求文档.md` ～ `07-实施计划.md`

这些文档仅提供 owner truth、正式客户端能力和边界输入。未闭合的 SDK / owner contract 仍保持 blocker，不因原型可见而变为已可用能力。

#### 2.3 当前项目材料

- `projects/L5-chat/draft/prototype/原型停审记录.md`
- `projects/L5-chat/draft/prototype/原型评审记录.md`
- `projects/L5-chat/draft/prototype/原型信息架构记录.md`
- `projects/L5-chat/draft/prototype/原型主路径记录.md`
- `projects/L5-chat/draft/prototype/原型受控交互记录.md`
- `projects/L5-chat/draft/prototype/原型恢复与可访问性记录.md`
- `projects/L5-chat/README.md`、旧正式 `00~06`：仅作 `historical_material`

### 3. SOP 问题回答

#### 3.1 本文承接哪些上游文档？

本文承接四类语义来源：

1. 全局规范确定的 Layer 5 产品窗口、依赖裁剪、真相源闭环和文档门禁。
2. `L0-sdk` 确定的官方客户端 query、command、event、auth、transport、错误、重试、trace 和 redaction 能力。
3. 业务 owner 正式文档确定的 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability truth 及安全投影。
4. 已冻结的 L5-chat 原型决定，用于把正式 owner 能力收束为用户可走通的跨平台展示与交互需求；原型不提升为 truth source。

#### 3.2 承接哪些上游主题？

| 来源文档 / owner | 承接主题 | Chat 不承接 |
|---|---|---|
| `L0-sdk` | 客户端 query / command / event 接入、认证、错误、重试、trace、redaction 和兼容性能力 | SDK 内部 domain truth、服务端编排、Chat 专属 UI 和产品状态 |
| `L1-conversation` | group / channel / dm / thread 入口、Conversation / Turn / Participant 读取、变化、分页、cursor、visibility | Conversation、Turn、Participant、scope 和成员关系真相 |
| `L1-identity` | 公司人员的身份安全摘要和身份入口 | GlobalMember、Actor、Role 生命周期与授权裁决 |
| `L1-work` | Project、ProjectMember、阶段、WorkItem、项目进度和项目到群聊的安全关联视图 | Project、ProjectMember、WorkItem、流程完成判断和项目关系真相 |
| `L1-governance` | Governance Gate / Decision 的安全显化、受控命令入口和结果变化 | Gate、Approval、Decision、Policy truth；并行汇聚不等于治理批准 |
| `L1-artifact` | 提交、构建、测试报告和 Artifact / Evidence 的 body-free ref、摘要、预览入口 | Artifact 正文、版本、血缘、Evidence / Baseline truth |
| `L1-workspace` | 工作区范围、项目 / 对话导航和正式 safe view（合同可用时） | Workspace projection truth、未闭合 view / cursor / attention 合同 |
| `L2-member` | 公司成员、项目成员和群聊成员的安全交互摘要 | 容器在场、筛选、投递、出站尝试和成员内部 truth |
| `L2-runtime` | Agent / Run / ToolCall 的安全执行摘要、等待、阻塞、失败和未知状态 | Runtime run、decision、checkpoint、outcome 和执行真相 |
| `L4-observability` | 低敏诊断、可观测性可用性、gap 和 handoff 摘要 | Observability backend、原始日志、审计正文和最终验收结论 |

#### 3.3 为什么本文不是重新定义这些主题？

Chat 只细化“如何把正式 owner 能力组合成可导航、可理解、可恢复的跨平台协作体验”。项目详情、流程图、并行网关、群聊绑定和公司成员目录是展示与导航语境，不是 Chat 对项目、流程、成员或治理真相的重新定义。任何缺少正式公共能力的体验均登记为 SDK / owner capability gap，不在 Chat 中私造替代接口。

#### 3.4 本文在当前仓承担什么细化作用？

本文把上述来源收束为客户端需求主题：对话与 thread、项目详情和项目进度、整体 BPMN 与阶段子流程、并行分叉与汇聚的只读呈现、项目与群聊双向入口、公司级成员目录、GateCard、Artifact 预览、执行摘要、草稿与发送反馈、实时变化、离线恢复、可访问性和安全边界。后续需求 Step 只在这些来源边界内继续细化。

### 4. 历史材料与差异诊断

| 历史材料 | 诊断 | 当前处理 |
|---|---|---|
| 旧 README / 旧正式文档 | 将技术候选、AG-UI / transport、体验对象和目录结构混成需求来源 | 降级为 historical material，不直接继承 |
| 旧 Step 1 | 已有 owner 映射，但没有覆盖项目详情、项目流程层级、群聊绑定、公司目录和 BPMN 并行网关 | 本文件重建并补入这些承接主题 |
| `/tmp/chat` 外部原型 | 提供流程图和节点详情的历史交互参考，但含有 Agent、工具、工单和测试的后端真相倾向 | 仅作为原型参考，不作为正式上游 |
| 当前 HTML 原型 | 验证页面层级、交互状态和安全表达 | 作为 draft 产品材料，不升级为接口或 owner truth |

### 5. 结构化中间产物

#### 5.1 来源层级

```text
全局规范 / 依赖规则
        ↓
L0-sdk 客户端接入能力
        ↓
Conversation / Identity / Work / Governance / Artifact
Workspace / Member / Runtime / Observability owner truth
        ↓
L5-chat 展示、导航、客户端状态和恢复需求
        ↑
原型只提供体验验证，不改变上述权威顺序
```

#### 5.2 原型新增主题到 owner 来源映射

| 原型主题 | 正式来源候选 | Chat 细化内容 |
|---|---|---|
| 项目与项目进度合并 | `L1-work`、`L1-workspace`、`L0-sdk` | 项目详情 tabs、流程导航和返回位置 |
| 一个项目多个群聊 | `L1-work`、`L1-conversation`、`L0-sdk` | 绑定项目入口、关联群聊列表和双向跳转 |
| 群聊成员不同 | `L1-conversation`、`L1-identity`、`L2-member` | 当前群聊成员与项目成员分开显示 |
| 公司级成员目录 | `L1-identity`、`L2-member`、`L1-workspace` | 公司人员搜索、摘要和直接对话入口 |
| 项目整体 BPMN | `L1-work`、`L1-governance`、`L0-sdk` | 只读流程投影、节点选择、状态与新鲜度 |
| 阶段子流程 | `L1-work`、`L1-conversation`、`L1-artifact`、`L2-runtime` | 层级下钻、节点详情和关联入口 |
| 并行分叉 / 汇聚 | `L1-work`、`L1-governance` | 分支展示、汇聚等待、Governance Gate 分离 |
| Agent / 工具 / 测试摘要 | `L2-runtime`、`L1-artifact`、`L4-observability` | 折叠安全摘要，不展示 raw payload |

#### 5.3 Chat 不拥有的事实

| 事实 | 权威 owner | Chat 允许持有 |
|---|---|---|
| Project、阶段、WorkItem、流程完成判断 | `L1-work` | safe summary、引用、选择状态 |
| Conversation、Turn、Participant、群聊绑定事实 | `L1-conversation` / 正式关联投影 | safe view、cursor、local focus |
| 公司身份与成员生命周期 | `L1-identity` / `L2-member` | 安全身份摘要、展示缓存 |
| Governance Gate / Decision | `L1-governance` | GateCard、local intent、command result 状态 |
| Artifact 正文与测试证据 | `L1-artifact` | body-free ref、preview 状态、正式入口 |
| Runtime 执行结果与工具调用 | `L2-runtime` / `L4-observability` | safe status、freshness、gap、diagnostic hint |

#### 5.4 Capability gap register（仅登记，不改 SDK）

| Capability | Chat 需要 | 来源 / owner | 当前状态 |
|---|---|---|---|
| 项目与群聊绑定查询 | 项目详情和群聊双向导航 | `L1-work` + `L1-conversation` + `L0-sdk` | required / contract pending |
| 项目流程与阶段子流程查询 | BPMN 节点、边、层级和版本 | `L1-work` + `L0-sdk` | required / contract pending |
| 并行网关与 Gate 安全摘要 | 分叉、汇聚、治理状态分离 | `L1-work` + `L1-governance` | required / contract pending |
| 公司成员安全目录 | 搜索、摘要、直接对话入口 | `L1-identity` + `L2-member` + `L0-sdk` | required / visibility pending |
| 节点跨域关联查询 | Work / Conversation / Artifact / Runtime 入口 | 多 owner + `L0-sdk` | required / contract pending |
| snapshot / cursor / gap / revoke | 流程和成员视图恢复 | `L0-sdk` + owner | required / blocker |

### 6. 正式 §1 回填草稿

> `L5-chat` 的需求基线承接全局依赖规则、`L0-sdk` 官方客户端接入层，以及 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 的当前正式文档。这些来源分别确定 Chat 的接入方式、业务真相 owner、可消费的安全视图、正式命令入口、变化协作和失败语义。
>
> 本文不重新定义上述 owner 的业务对象、流程、状态、授权、事件或持久化语义，而是把正式能力收束为跨平台协作客户端的页面、导航、项目详情、项目流程、群聊关联、成员目录、展示状态、草稿、选择、本地展示缓存、恢复、可访问性和安全边界需求。Chat 通过 `L0-sdk` 消费正式能力，不直接订阅内部 bus，不直接调用服务私有 API，也不在客户端创建 Conversation、Project、Member、Gate、Artifact、Workspace 或 Runtime 真相。

### 7. 进入 Step 2 的条件

- 来源层级和承接主题已更新并可回指具体 owner。
- 项目详情、流程下钻、群聊绑定、公司成员目录和 BPMN 并行结构已纳入来源映射。
- 原型仍被定位为体验验证材料，未升格为正式 schema 或接口。
- 旧 README、旧正式文档和 `/tmp/chat` 均保持 historical / reference 定位。
- SDK / owner gap 已登记，未被本 Step 私自补齐。
- 本文件、需求 flow 和项目台账均已更新。

Step 1 已通过，允许进入 Step 2；本轮不创建或修改 Step 2 文件。
