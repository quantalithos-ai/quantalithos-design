# 01 架构校准 Step 1：确认需求基线

> 状态：completed / pass
> 日期：2026-08-22
> 前序门禁：正式 `00-需求文档.md` 已停审并获用户批准
> 本步目的：只提炼可约束架构的稳定需求、硬约束和开放风险，不重写需求全文

## 1. Step 内计划

- [x] 读取项目执行台账、01 flow 与正式 00。
- [x] 刷新架构 SOP、书写规范和全局依赖裁剪规则。
- [x] 刷新 Runtime、Tools、Identity、Work、Sandbox、Core、Bus、SDK 的架构直接输入。
- [x] 核对 Member / Member Images 正式 00 与进行中 01 的效力边界。
- [x] 逐项回答需求稳定性、边界、数据、依赖和一致性问题。
- [x] 诊断旧正式 01 与 draft 中不可继承结论。
- [x] 形成结构化基线、硬约束、开放风险与 positive ceiling。
- [x] 完成回填草稿和门禁自检。

## 2. 输入与效力确认

| 输入 | 效力 | 本步采用方式 |
|---|---|---|
| 当前正式 `00-需求文档.md` | direct baseline | 承接 C-MS-1~5、FR、BR、数据边界、依赖、NFR、AC / VF 和开放项。 |
| `L2-runtime/00~07` | stable upstream | 采用 Runtime 不拥有 host lifecycle、run truth 与 host truth 分层；entry surface 保持 pending。 |
| `L2-tools/00~07` | stable upstream | 采用逐动作 Tool execution 不归本仓；本仓不提交 ToolInvocation。 |
| `L1-identity` / `L1-work` 当前正式链 | truth owner input | 采用 GlobalMember / ProjectMember 分层与项目型双锚；不复制正文。 |
| `L4-sandbox` 当前正式链 | adjacent owner input | 采用 isolation truth 与 SandboxBinding 装配 truth 分层；正向 host contract 保持 pending。 |
| `L0-core` / `L0-bus` / `L0-sdk` | foundation input | Core 是契约 authority，Bus 是事件 carrier，SDK 精确 compile target 尚未闭口。 |
| `L2-member` 正式 00、进行中 01 | sibling mixed | 只采用请求 / 信号 / 报告与 acceptance / registry / session / health 的需求级分工。 |
| `L2-member-images` 正式 00、进行中 01 | sibling mixed | 只采用 pinned instantiable supply 方向；exact contract 仍 pending。 |
| `draft/` | discussion input | 仅核验候选定位、交互、能力与分层，不直接继承名称。 |
| 旧 README / 旧正式 01 | historical_material | 只做污染审计。 |

## 3. SOP 问题回答

### 3.1 当前架构依赖哪些需求结论

1. 本仓是 AI 成员执行宿主与编排控制面 truth owner，拥有宿主侧决定和生命周期事实。
2. 当前只支持 `ProjectMemberRef` 执行主语，并以一致的 `GlobalMemberRef` 为身份锚。
3. 核心能力必须覆盖意图与决定、装配与就绪、注册与 host session、健康与恢复、清理对账与事实交接五个节点。
4. control plane、host truth、runtime session、execution handoff 必须始终分层。
5. 外部 owner truth 只能以 typed ref、safe snapshot、body-free material 或正式反馈参与。
6. 本地事实与外部 delivered / observed / accepted 必须分层，外部失败不得回滚本地 truth。
7. 正向合同未闭口时必须 fail closed，fake / placeholder 不得升级为 readiness。

### 3.2 哪些结论已经稳定

| 稳定主题 | 架构可直接采用的结论 |
|---|---|
| 仓定位 | 独立 host control plane 与 host truth center，不是 Runtime、Member、Images 或 Sandbox 的附属模块。 |
| 当前主语 | 项目型-only；`ProjectMemberRef` 是执行主语，`GlobalMemberRef` 是身份锚。 |
| owner 分层 | Work 拥有 ProjectMember，Identity 拥有 GlobalMember，Runtime 拥有 run truth，Sandbox 拥有 isolation truth。 |
| 宿主 owner | 本仓拥有宿主意图受理、编排决定、实例与世代、装配结果、readiness、注册接受、endpoint、host session 壳、健康和宿主侧恢复 / 终止决定。 |
| Member 分工 | Member 拥有注册请求、存活信号、状态报告与本地尝试；本仓拥有接受、registry、host session 与健康判定。 |
| Images 分工 | Member Images 提供静态 supply availability 与 pinned instantiable entry；本仓只消费正式供给。 |
| 逐动作执行 | Runtime / Tools 推进工具行动；本仓只处理宿主级 binding / release 关联。 |
| 数据边界 | truth / snapshot / ref / forbidden body 四类已稳定；外部正文和 secret 禁止进入本仓 truth。 |
| 失败语义 | missing、conflict、stale、partial、unknown、blocked、gap 等不得压平为 ready / completed。 |
| 依赖纪律 | compile / runtime / event / ref / adapter / fake 必须分类；运行期协作不等于源码依赖。 |

### 3.3 哪些结论仍待确认

| 开放项 | 缺失确认 | 对架构的限制 |
|---|---|---|
| Runtime entry / session | 双侧能力 surface 与正向 mapping | 只能保留宿主侧 port，不得宣称 Runtime 可触发或恢复。 |
| Member 详细合同 | 字段、IPC、凭据、正向联调 | 只能设计 acceptance / registry 语义，不锁协议。 |
| Images handoff | exact manifest / variant / ref / confirmation | 装配资格口径成立，正向 image qualification 仍 blocked。 |
| Sandbox host contract | binding / release / failure / cleanup 字段、caller、receipt | no-fallback 成立，正向 bind / release 仍 blocked。 |
| policy 传递 | owner 与是否属于当前功能 | 当前无 FR，不进入架构单元或主交互。 |
| launch credential | 签发、撤销、资格验证 owner | 只保存实例绑定安全 ref，不拥有 credential truth。 |
| Core / Bus contract | member-service-specific schema、event family、route / receipt | 只引用契约类别和 event seam，不建 shadow schema。 |
| SDK target | 准确 compile dependency 与 Server 自测试方式 | 只承接全局 compile 基线，不进入 host runtime 主链。 |
| backend qualification | 容器承载与 registry adapter 的正式能力资格 | 只固定 adapter 和 unknown 语义，不锁产品与状态机。 |
| workload / threshold | 并发、健康窗口、性能预算 authority | 只给结构性判断口径，不写旧数字。 |

### 3.4 哪些结论影响系统边界

- 本仓必须位于 Identity / Work / Images / Sandbox / 宿主承载输入与 Member / Runtime / Bus / Observability 消费之间。
- `L3-method-library` 只能作为 Images 的间接上游，不能进入本仓直接上下文主链。
- Tools、Capability Hub、Artifact 不构成本仓核心运行依赖；只作为明确排除的 owner 背景。
- 容器运行时、编排平台和 registry 只作为 infrastructure adapter 能力，不成为 domain truth owner。

### 3.5 哪些结论影响数据所有权

- 本仓拥有决定、实例、装配、readiness、注册、endpoint、host session、健康、恢复 / 终止、cleanup attempt / gap、reconciliation 与 handoff attempt / gap。
- 本仓只持有 Identity / Work / Images / Member / Runtime / Sandbox / backend / downstream 的安全快照与引用。
- runtime body、member body、image / build body、Sandbox capture / policy body、credential / secret、L1 正文和观测 / 证据正文必须明确排除。
- 外部 completion、delivery、observation 和 acceptance 只能以外部摘要关联，不能覆盖本地结论。

### 3.6 哪些结论影响依赖与一致性

- 本地决定与其追溯、宿主实例与世代、活动注册 / endpoint / host session 唯一性必须具备本仓内强一致边界。
- 外部 snapshot / ref freshness、后端实际状态对账、事件传播与观测交接允许最终一致，但必须暴露 stale / gap / unknown。
- 重复、并发、迟到和结果未知要求幂等锚与实例世代 fence；不得盲重放不可逆外部动作。
- 只有 `L0-core` 与受限的 `L0-sdk` 基线可进入 compile 讨论；所有 sibling 通过 runtime / event / ref / adapter 协作。

## 4. 当前材料诊断

### 4.1 稳定部分

正式 00 已把项目型主语、五能力闭环、owner 边界、数据分类、依赖类型、失败语义和验收否决收稳，足以支撑架构推导。上游正式文档从 Runtime、Sandbox、Identity 和 Work 四侧确认本仓的独立必要性，未出现要求回退需求的冲突。

### 4.2 不能直接继承的旧结论

| 历史结论 | 诊断 | 本轮处理 |
|---|---|---|
| “编排大脑”、旧 C4 / 模块结构 | 与 Runtime 语义和新规范冲突 | 删除，不作为上下文或模块输入。 |
| Rust、PostgreSQL、Redis、Docker、Kubernetes | 无当前技术 authority | 不进入架构选型；只保留中立承载 / 存储 / adapter 角色。 |
| REST / gRPC / WebSocket、固定事件和 DTO | 过早协议化 | 后移到合同闭口后的概要 / 详细设计。 |
| outbox、repository、handler、目录树 | 实现层污染 | 不作为架构责任层、容器或一致性机制。 |
| P95、QPS、并发、SLA、心跳和保留窗口数字 | 无 workload / measurement authority | 全部删除；只保留可判定的性能与健康口径。 |
| 固定部署拓扑、灰度、上线、回滚和监控方案 | 实施 / 运维越级 | 不继承；架构只定义运行承载角色和边界。 |
| Policy Proxy / 本地 allowlist | 无当前 FR 且可能吞并 Governance truth | 不进入架构主线。 |
| 本地 Identity Store / 镜像映射解析 | 形成第二 truth 或第二解析路径 | 改为带 owner / freshness 的 snapshot / ref。 |

## 5. 取舍结论

1. 采用“稳定边界先行”：开放合同不阻塞 01 描述 host-side ports，但阻塞正向路径被写成 ready。
2. 采用“机制级而非产品级”：架构可固定 truth center、ports / adapters、幂等、fence、投影和一致性层次，不固定语言、数据库、中间件或平台产品。
3. 采用“需求级 sibling 分工 + 架构级 pending”：只消费兄弟正式 00；其进行中 01 不作为本仓架构来源。
4. 不采用旧 01 局部修补：Step 16 必须删除并从校准结论重建 18 章正式正文。

## 6. 结构化中间产物

### 6.1 架构需求基线

| 基线 ID | 需求结论 | 架构必须回答的问题 |
|---|---|---|
| `RB-MS-001` | C-MS-1：项目型意图、主语与决定唯一 | 意图、决定、重复冲突和双锚属于哪个核心语义边界。 |
| `RB-MS-002` | C-MS-2：装配分项与 readiness fail closed | 外部资格、host instance、世代、adapter 与 binding 如何分层。 |
| `RB-MS-003` | C-MS-3：注册、endpoint 与 host session 唯一 | Member 请求与本仓 acceptance 如何隔离，Runtime ref 如何不取得 run truth。 |
| `RB-MS-004` | C-MS-4：健康分层与宿主侧恢复决定 | host / session / backend / unknown 如何进入同一宿主历史且不混 Runtime。 |
| `RB-MS-005` | C-MS-5：清理、对账与事实交接闭合 | local cleanup / gap、external completion 与 delivery / observed 如何分层。 |
| `RB-MS-006` | 外部 owner truth 不转移 | 内部语义单元、本地影子和依赖倒置如何防止第二 truth。 |
| `RB-MS-007` | 本地强一致、外围最终一致 | 哪些关系必须同步收口，哪些传播可延后且保留 gap。 |
| `RB-MS-008` | pending 与 fake 不证明 ready | 风险、演进、测试交接和实施上限如何持续显式。 |

### 6.2 架构硬约束

| 约束 ID | 硬约束 | 违反后果 |
|---|---|---|
| `HC-MS-001` | control plane、host truth、runtime session、execution handoff 四层不得合并。 | owner 串线，恢复和审计不可归责。 |
| `HC-MS-002` | 当前只接受 ProjectMemberRef 执行主语和一致 GlobalMemberRef 身份锚。 | 项目边界被身份锚或未定义主语绕过。 |
| `HC-MS-003` | 本仓不得拥有 Runtime、Member、Images、Tools、Sandbox、Governance、Observability 或 L1 truth。 | 形成多真相或反向依赖。 |
| `HC-MS-004` | required qualification 缺失 / stale / conflict / unknown 时不得 host fallback 或声明 ready。 | 安全边界 fail open。 |
| `HC-MS-005` | 外部正文、secret、credential body 和运行 / 隔离 / 证据正文不得进入本仓 truth。 | 数据边界与安全边界被打穿。 |
| `HC-MS-006` | 重复、并发、迟到和 unknown 不得制造第二活动宿主、注册或 host session。 | 当前事实分叉和不可逆副作用重复。 |
| `HC-MS-007` | local truth、attempt / gap、delivered、observed、accepted 必须分层。 | 外围状态反写本地真相。 |
| `HC-MS-008` | compile / runtime / event / ref / adapter / fake 必须保持分类。 | 运行协作伪装源码依赖，fake 伪装真实集成。 |
| `HC-MS-009` | 技术产品、协议、schema、阈值和部署参数在无 authority 时不得被锁定。 | historical material 反向统治架构。 |

### 6.3 Positive ceiling

| 受影响路径 | 当前可形成的架构结论 | 当前不得形成的结论 |
|---|---|---|
| Member / Images / Runtime / Sandbox | host-side port、owner、失败语义和 contract placeholder | 字段、协议、真实联调、ready / compatible / accepted。 |
| Credential / Core / SDK | 安全 ref、契约类别、compile 分类 | owner closure、准确 target、schema 与验证通过。 |
| Container backend / registry | 中立 adapter 与 qualification / unknown 边界 | 产品选型、能力已满足、部署已就绪。 |
| Bus / Observability | body-free material、local attempt / gap | delivered、observed、accepted 或 evidence 完整。 |

## 7. 回填草稿

- 正式 §1 承接当前 00、稳定上游、兄弟效力边界和 historical_material 口径。
- 正式 §3 固定 HC-MS-001~009 及开放合同的 fail-closed 上限。
- 正式 §15 保留 MSVC-UP-001~008、Q-MS-001~011 和旧材料回流风险。
- 正式 §16 以 RB-MS-001~008 为需求到架构的追溯入口。
- 正式 §18 只保留当前正式需求、标准和稳定上游；draft 与旧正式 01 不进入正式参考。

## 8. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 稳定需求是否足以推导架构目标与约束 | pass | 五能力、四语义层、owner、数据和依赖边界均稳定。 |
| 待确认项是否显式且未脑补 | pass | 10 类开放输入均保留 positive ceiling。 |
| 是否把兄弟进行中 01 升格为 truth | pass | 只使用正式 00；架构内容继续 pending。 |
| 是否继承旧技术、指标或部署结论 | pass | 全部留在污染审计并明确排除。 |
| 是否存在必须回退需求的冲突 | pass | 当前无冲突；开放合同阻塞正向闭口而非架构边界成文。 |
| 是否允许创建 Step 2 | pass | Step 1 输出满足 SOP 门禁；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_02
formal_01_write_allowed = false
```
