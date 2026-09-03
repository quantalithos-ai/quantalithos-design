# Step 12. 接口与依赖

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 12
- 回填章节：`00-需求文档.md` §12（书写规范 4.12）
- 范围基线：只表达能力边界；当前版只支持以 `ProjectMemberRef` 为执行主语的项目型宿主

### 1.1 Step 内计划

- [x] 读取 Step 12 SOP、书写规范 4.12、Step 06 / 09 / 11
- [x] 复核全局依赖裁剪规则和 `L2-runtime` / `L1-governance` 的已停审粒度
- [x] 按 `C-MS-1 -> C-MS-2 -> C-MS-3 -> C-MS-4 -> C-MS-5` 收敛能力接口并逐节点停审
- [x] 使用正式接口类型和依赖类型枚举
- [x] 映射接口、依赖、功能、能力节点和全局依赖类型
- [x] 审计外围增强、pending、禁止依赖与旧材料污染
- [x] 检查 API、命令、DTO、schema、字段和实现 port 泄漏

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 12 / 书写规范 4.12 | current_standard | 固定接口 / 依赖类型、两张正式表及逐节点停审门禁 |
| `00_req_step_06_consumers_dependencies.md` | pass | 固定 compile / runtime / event / adapter / ref / fake seam 及禁止依赖 |
| `00_req_step_09_functional_requirements.md` | pass | 接口和依赖必须回指 FR-MS-001~012 或 FR-MS-E01~E04 |
| `00_req_step_11_data_ownership.md` | pass | 保护 truth / snapshot / ref / forbidden-body 归属，不以接口搬运正文 |
| `L2-runtime` 当前正式 00~07 | current_formal | Runtime 拥有 run / checkpoint / entry truth；宿主入口 surface 仍为双侧 pending |
| `L2-member` 当前正式 00 | current_formal_stopped | 正式消费需求级 owner 分工；字段、IPC、凭据与联调合同仍 pending |
| `L2-member-images` 正式 00 与当前台账 | requirement_boundary_formally_stopped；detailed_contract_pending | 正式消费 pinned entry 供给方向；exact contract 仍 pending，不把需求级方向当 positive integration |
| `L4-sandbox` / `L2-tools` 当前正式边界 | current_formal | 本仓只消费宿主级 binding / release；逐动作工具执行不进入本仓接口 |
| 旧正式 00 / README / 01~03 / 05~06 | historical_material | 新结论形成后仅做污染审计，不继承旧 API、SLA 或技术产品 |
| `draft/` | discussion_input | 仅检查职责和分层覆盖，不作为接口 truth |

## 3. 类型结论与 SOP 问题回答

### 3.1 正式类型结论

| 类别 | 当前采用的正式枚举 | 使用约束 |
|---|---|---|
| 接口类型 | 查询接口、变更接口、事件输出、事件输入、后台任务接口（按需） | 类型表达能力面，不预设同步协议、消息中间件或调度实现 |
| 依赖类型 | 定义来源依赖、治理结论依赖、下游消费依赖、外部能力依赖（按需） | 不使用“上游 / 下游仓”代替能力边界含义 |
| 全局依赖类型 | 编译期依赖、运行期依赖、事件协作依赖、不适用 | `ref` 不改变依赖类型；基础设施通过 adapter；fake 只用于受控验证 |

### 3.2 SOP 问题回答

1. 本仓对外提供哪些能力级接口？

   回答：提供宿主意图受理、决定控制、装配协调、注册与 host session 维护、健康和处置、清理对账、宿主事实查询与 body-free 交接等 17 个核心能力接口；容量建议、预热、forensic 关联材料和聚合视图 4 个外围接口单列。

2. 本仓消费哪些能力级输入？

   回答：消费 Identity / Work 的正式主体与项目边界、Member 的请求 / 信号 / 报告、Member Images 的正式 pinned 供给引用、Sandbox 的宿主级 binding / release 能力、Runtime 的允许关联、容器承载和镜像资产能力，以及事件协作反馈。未闭口的正向合同只能产生 waiting / blocked / degraded / unknown / gap。

3. 同步与异步能力边界如何区分？

   回答：查询和显式变更属于请求式能力面；持续信号、已提交事实交接和外部反馈属于事件输入 / 输出；残留对账和预热属于后台任务面。这里只确定能力类型，不决定 HTTP、RPC、消息或调度机制。

4. 哪些依赖是输入型，哪些结果是输出型？

   回答：正式定义、外部宿主能力和反馈为输入；已提交宿主事实、安全视图和本地 handoff material 为输出。本地 attempt 不等于外部 delivered、observed、accepted 或 cleanup completed。

5. 哪些属于核心闭环，哪些只是外围增强？

   回答：IB-MS-001~017 承接 FR-MS-001~012，属于核心闭环；IB-MS-E01~E04 只承接同编号外围功能，任何外围不可成为核心 ready 的前置条件。

## 4. 能力节点执行与停审

| 顺序 | 能力节点 | 接口范围 | 主要依赖面 | gate_status | 停审结论 |
|---:|---|---|---|---|---|
| 1 | C-MS-1 意图与决定 | IB-MS-001~003 | Identity / Work 正式边界 | pass | 受理、决定和安全查询分开；无 API / DTO，非项目型入口 fail closed |
| 2 | C-MS-2 装配与就绪 | IB-MS-004~006 | Member Images、Sandbox、承载 / registry adapter | pass | 正式条件、分项装配和 ready 分层；pending 不冒充正向资格 |
| 3 | C-MS-3 注册与会话 | IB-MS-007~009 | Member、Runtime 双侧 pending seam | pass | 注册、endpoint 和 host session 归本仓；Member / Runtime 内部 truth 未迁入 |
| 4 | C-MS-4 健康与处置 | IB-MS-010~012 | Member 信号、承载 / binding 反馈 | pass | 信号输入、健康判断和宿主处置分开；不推断业务或 Runtime 进度 |
| 5 | C-MS-5 清理与交接 | IB-MS-013~017 | 承载 / Sandbox、Bus、Observability 和消费方 | pass | 本地 cleanup / handoff 与外部完成 truth 分层；历史不可抹写 |
| 6 | 外围 / 跨节点审计 | IB-MS-E01~E04 | 核心 safe material 与 adapter 能力 | pass | 外围无反写能力且不成为核心前置；无无来源接口 |

## 5. 对外能力接口表

### 5.1 核心闭环能力

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | `IB-MS-001` 宿主意图受理与范围判定 | 接受正式宿主意图，判定来源、项目型执行主语与身份锚是否可验证，并形成受理、拒绝或等待。 | 核心闭环能力 |
| 变更接口 | `IB-MS-002` 宿主编排决定控制 | 对首次、重复、并发或补偿性意图形成稳定的宿主编排决定、冲突或 no-action 结论。 | 核心闭环能力 |
| 查询接口 | `IB-MS-003` 当前宿主与决定安全查询 | 提供当前宿主关联、决定和未知缺口的安全读取，不输出 L1 正文或外部运行内容。 | 核心闭环能力 |
| 变更接口 | `IB-MS-004` 正式装配条件形成 | 从正式引用、允许摘要与环境需求形成来源清晰的宿主装配条件或显式条件缺口。 | 核心闭环能力 |
| 变更接口 | `IB-MS-005` 宿主装配协调与就绪判定 | 协调宿主承载、镜像、挂载、凭据和适用 binding，并基于分项结果形成 ready 或非 ready 结论。 | 核心闭环能力 |
| 查询接口 | `IB-MS-006` 装配与就绪安全查询 | 提供分项装配结果、来源状态、就绪结论与缺口的安全读取。 | 核心闭环能力 |
| 变更接口 | `IB-MS-007` 注册受理、替换与拒绝 | 验证注册来源与宿主实例关联，形成注册建立、替换或拒绝结论。 | 核心闭环能力 |
| 变更接口 | `IB-MS-008` 接入与 host session 关联维护 | 建立、替换或失效 endpoint 和 host session 关联，不创建或推进 Runtime run。 | 核心闭环能力 |
| 查询接口 | `IB-MS-009` endpoint / session 可用性查询 | 提供当前接入位置、host session 关联和可用、陈旧、失效或未知语义。 | 核心闭环能力 |
| 事件输入 | `IB-MS-010` 健康信号与宿主反馈输入 | 承接允许的 Member、host session、承载和 binding 信号或反馈，保留来源与新鲜度语义。 | 核心闭环能力 |
| 查询接口 | `IB-MS-011` 宿主健康与失败分类查询 | 提供 host、session、backend 和 unknown 分层健康结论，不等同业务成功或 Runtime 进度。 | 核心闭环能力 |
| 变更接口 | `IB-MS-012` 恢复、重启、停止与终止控制 | 基于正式意图和已提交宿主事实形成宿主侧 recover、restart、stop、terminate 或 hold 决定。 | 核心闭环能力 |
| 变更接口 | `IB-MS-013` 下线与清理控制 | 收束本地注册、会话和 binding 关联并记录 cleanup / release 的本地决定、尝试、结果或 gap。 | 核心闭环能力 |
| 后台任务接口（按需） | `IB-MS-014` 残留 / 孤儿宿主对账 | 识别控制面与承载 / binding 反馈之间的残留、孤儿和漂移并形成处置结论。 | 核心闭环能力 |
| 查询接口 | `IB-MS-015` 宿主事实安全查询 | 提供已提交决定、实例、注册、会话、健康、处置和清理事实的 body-free 安全读取。 | 核心闭环能力 |
| 事件输出 | `IB-MS-016` body-free 宿主事实交接输出 | 输出可关联的已提交宿主事实安全材料和本地 handoff attempt / gap，不声明外部消费完成。 | 核心闭环能力 |
| 事件输入 | `IB-MS-017` 外部 cleanup / delivery 反馈输入 | 承接外部 owner 的 cleanup、delivery、observed 或 accepted 安全反馈并与本地尝试关联，不反写源 truth。 | 核心闭环能力 |

### 5.2 外围增强能力

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 查询接口 | `IB-MS-E01` 容量与放置建议查询 | 基于安全摘要提供容量与放置建议，不直接改变宿主或基础设施 truth。 | 外围增强能力 |
| 后台任务接口（按需） | `IB-MS-E02` 宿主资产预热任务 | 在不改变正式 pinned 引用与 readiness 的前提下预先准备宿主资产。 | 外围增强能力 |
| 查询接口 | `IB-MS-E03` forensic 安全关联材料 | 提供 body-free 的宿主关联材料，不拥有证据、报告、verdict 或 signoff 正文。 | 外围增强能力 |
| 查询接口 | `IB-MS-E04` 聚合宿主安全视图 | 提供跨实例聚合的只读宿主安全视图，不形成独立写源。 | 外围增强能力 |

## 6. 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | 消费平台共享契约类别；member-service-specific schema 未闭口时不得本地 shadow。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L0-sdk` | 编译期依赖 | 遵守正式客户端合同 / Server 自测试基线；准确 dependency target pending，且不得进入运行期宿主 truth。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-identity` | 运行期依赖 | 消费 GlobalMember 身份锚、生命周期与可运行性安全来源；不可验证时新受理 / 装配 fail closed。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-identity` | 事件协作依赖 | 承接身份生命周期和可运行性变化，迟到、陈旧或冲突不得覆盖已提交历史。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-work` | 运行期依赖 | 消费 ProjectMember 项目执行主语及分配 / 回收事实；无可验证主语不得启动。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-work` | 事件协作依赖 | 承接项目成员边界和宿主意图相关变化，不反写 Work truth。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L2-member-images` | 运行期依赖 | 消费已正式停审的 pinned entry 供给方向；exact manifest / variant / ref / confirmation contract 未闭口或引用不可验证时 launch blocked。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L4-sandbox` | 运行期依赖 | 消费宿主级 binding / release、失败和 cleanup 反馈；要求隔离的宿主不得使用 host fallback。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L2-member` | 运行期依赖 | 消费 Member 拥有的 launch / register 请求、存活信号和状态报告；详细合同 pending。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-member` | 运行期依赖 | 提供本仓拥有的接受、registry、host session 和健康结论；不得取得 Member 主体 truth。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L2-runtime` | 运行期依赖 | 只消费允许的 runtime session / execution 关联和反馈引用；run / checkpoint 正文不得进入本仓。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-runtime` | 运行期依赖 | 提供可关联的宿主与 host session 承载能力；逻辑入口 surface 未闭口前只保留 pending seam。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | 容器运行时 / 编排平台 | 不适用 | 通过 adapter 消费宿主物理承载与生命周期动作能力；后端不可用或结果未知必须显式。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | 镜像 registry | 不适用 | 通过 adapter 消费 pinned 资产拉取能力；失败不得写成装配或启动成功。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | 交接已提交的 body-free 宿主事实；发布失败形成 gap，不回滚本地 truth。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L0-bus` | 事件协作依赖 | 承接可验证的交付反馈和上游事件协作输入；未闭口 receipt 不得推断 delivered。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L4-observability` | 事件协作依赖 | 提供 body-free 宿主材料和本地 handoff attempt / gap，不声明 observed。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | 容器运行时 / 编排平台 | 不适用 | 为容量建议与预热提供 adapter 级安全能力；外围失败不影响核心 truth。 | 外围增强能力 |
| 输入 | 外部能力依赖（按需） | 镜像 registry | 不适用 | 为正式资产预热提供 adapter 能力；预热结果不得改写 pinned 引用或 readiness。 | 外围增强能力 |
| 输出 | 下游消费依赖 | 授权的运维 / 调查 / 只读消费方 | 不适用 | 消费 forensic 关联材料与聚合视图；消费方不得反向定义宿主 truth。 | 外围增强能力 |

## 7. 接口、功能与依赖映射

| 接口范围 | 能力节点 | 功能来源 | 主要外部能力面 |
|---|---|---|---|
| IB-MS-001~003 | C-MS-1 | FR-MS-001~002 | L1-identity、L1-work、L0-core |
| IB-MS-004~006 | C-MS-2 | FR-MS-003~005 | L2-member-images、L4-sandbox、容器运行时 / 编排平台、镜像 registry |
| IB-MS-007~009 | C-MS-3 | FR-MS-006~007 | L2-member、L2-runtime |
| IB-MS-010~012 | C-MS-4 | FR-MS-008~009 | L2-member、L4-sandbox、容器运行时 / 编排平台；Runtime 仅允许 ref |
| IB-MS-013~017 | C-MS-5 | FR-MS-010~012 | L4-sandbox、容器运行时 / 编排平台、L0-bus、L4-observability |
| IB-MS-E01~E04 | 外围增强 | FR-MS-E01~E04 | 核心 safe material、adapter 能力、授权消费方 |

### 7.1 逐功能覆盖

| 功能 | 接口承接 | 外部协作承接 |
|---|---|---|
| FR-MS-001 | IB-MS-001 / 003 | Identity / Work runtime + event 输入 |
| FR-MS-002 | IB-MS-002 / 003 | Core 定义类别；既有本地 truth |
| FR-MS-003 | IB-MS-004 / 006 | Identity / Work 正式 ref、Member Images placeholder |
| FR-MS-004 | IB-MS-005 / 006 | Member Images、Sandbox、承载 / registry adapter |
| FR-MS-005 | IB-MS-005 / 006 | 各分项来源资格与反馈；缺口 fail closed |
| FR-MS-006 | IB-MS-007 | Member 需求级正式分工；详细合同 pending |
| FR-MS-007 | IB-MS-008 / 009 | Member / Runtime 双侧 pending seam |
| FR-MS-008 | IB-MS-010 / 011 | Member、承载与 binding 的允许信号 / 反馈 |
| FR-MS-009 | IB-MS-012 | 正式意图、承载 / binding 能力；不依赖 Runtime checkpoint 内容 |
| FR-MS-010 | IB-MS-013 / 017 | 承载、Sandbox cleanup / release 与外部反馈 |
| FR-MS-011 | IB-MS-014 / 017 | 承载 / binding 安全反馈；不可用时 unknown |
| FR-MS-012 | IB-MS-015~017 | Bus / Observability / 授权下游消费；attempt 与完成 truth 分层 |
| FR-MS-E01~E04 | IB-MS-E01~E04 | 核心 safe material 和对应外围 adapter / 消费面 |

覆盖审计：16 项功能均至少有一个接口承接；所有接口均有功能来源；需要外部协作的核心功能均在 Step 6 与本 Step 有同类型依赖承接。

## 8. Seam 类型与禁止转换

| seam | 当前语义 | 禁止转换 |
|---|---|---|
| compile | 仅 `L0-core` / `L0-sdk` 的正式契约与自测试基线 | 不把未闭口 schema 或 runtime client 当作已存在源码依赖 |
| runtime | Identity、Work、Member、Member Images、Runtime、Sandbox 的运行期能力协作 | 不写成 sibling path / package 依赖 |
| event | Bus 主干及 Identity、Work、Observability 的事件协作 | 不以 event 输出声明 delivered / observed / accepted |
| ref | 对外部对象的 body-free 关联表达，不改变其 compile / runtime / event 分类 | 不复制外部正文或建立第二 truth |
| adapter | 容器运行时 / 编排平台和镜像 registry 的可替换基础设施接缝 | 不让 Docker / Kubernetes 等产品概念定义宿主领域语义 |
| fake | runtime / event / adapter seam 的受控验证替身 | fake 通过不证明真实 backend、route 或对端 readiness |

禁止直接依赖：`L3-method-library`、`L2-tools`、`L3-capability-hub`、`L1-artifact` 不形成当前直接依赖边；本仓不得解析 Role -> image、提交 ToolInvocation、推进 Runtime run、拥有 artifact 正文或通过外部仓的源码路径取得运行期能力。

## 9. Pending 与 fail-closed 处置

| Pending | 影响接口 / 依赖 | 当前处置 |
|---|---|---|
| MSVC-UP-001 Runtime entry / session surface | IB-MS-008~012 / 015~017；L2-runtime 双向运行期边 | 只保留宿主 / host session 与允许 ref 的能力级 seam；不得声明 execution entry ready |
| MSVC-UP-002 Member launch / register / heartbeat / status | IB-MS-001 / 007~012；L2-member 双向运行期边 | 需求级 owner 分工已正式闭口；字段、IPC、凭据和联调仍 pending，正向不可用时 blocked / unknown |
| MSVC-UP-003 Member Images handoff | IB-MS-004~006 / E02；Member Images 运行期输入 | 需求级 supply availability / pinned entry 方向已正式闭口；exact manifest / variant / ref / confirmation contract 仍 pending，引用不可验证时 launch blocked |
| MSVC-UP-004 SandboxBinding / release | IB-MS-005~006 / 010~014 / 017；Sandbox 运行期输入 | 只确定宿主级 bind / release / feedback；逐动作 execute 不归本仓，字段和维护 caller pending |
| MSVC-UP-005 policy 到宿主传递 owner | 无当前接口或正式依赖表行 | 没有 FR 来源，不预建事件输入或治理结论依赖；owner 闭口后必须重开受影响 Step |
| MSVC-UP-006 launch credential owner | IB-MS-004~006 | 只表达装配所需安全引用；签发、撤销和依赖关联方未闭口，不伪造外部能力行 |
| MSVC-UP-007 Core schema / event family | 全部跨仓接口与事件边 | 只确定能力类别，不声明 ID、ref、payload、receipt 或 schema ready |
| MSVC-UP-008 SDK compile target / Server 自测试 | L0-sdk 编译期输入 | 编译基线成立，准确 target 与测试方式后移 01 / 03 / 05，不进入运行期主链 |
| MSVC-UP-009 非项目型执行主语 | IB-MS-001~003 | 当前项目型-only 已闭合；非项目型入口 fail closed，未来纳入须重开需求范围 |

## 10. 旧材料后置污染审计

| 旧材料内容 | 问题 | 当前处理 |
|---|---|---|
| 旧 00 的 REST / gRPC / WebSocket / event topic 与请求响应对象 | 协议、schema 和技术选型提前进入需求 | 全部不继承；只保留 §5 的能力接口面 |
| 旧 00 的依赖 SLA、超时、重试与降级方案 | 无当前 authority，且混入 NFR / 实现 | 全部删除；这里只表达失败后果和 pending |
| README 的 SDK / Bus / Sandbox 等平铺依赖 | 未区分 compile / runtime / event / adapter | 由 §6 / §8 按正式类型重建 |
| 旧 01~03 的 port、handler、repository、callback、outbox 与事务 | 实现结构反向定义需求接口 | 不继承，后续文档也只能由已停审需求推导 |
| `PolicySnapshot` / policy proxy 接口 | owner 未闭口且无当前 FR | 不进入正式接口或依赖表，保留 MSVC-UP-005 |
| 直接 method-library、tools、artifact 或 Sandbox execute 接口 | 吞并 Role 映射、工具执行、制品或隔离 truth | 明确禁止直接依赖；只保留正式 owner 的 ref / adapter 边界 |
| “注册成功 = ready”“发布成功 = observed” | 把局部结果冒充跨系统完成 | 注册、装配、host session、delivery / observed 分层表达 |

## 11. 回填草稿与门禁

### 11.1 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`

正式装配时采用 §5 的两张能力接口表和 §6 的外部依赖边界表，并保留 §8 的 seam 总则及 §9 中影响当前正向能力的 pending。过程计划、节点停审和历史污染审计留在校准材料；不得补 API、命令、DTO、事件 schema、字段、port、存储、事务或重试方案。

### 11.2 门禁自检

- [x] 17 个核心接口与 4 个外围接口全部使用正式接口类型
- [x] 外部依赖边界全部使用正式依赖类型和全局依赖类型
- [x] 16 项功能均有接口承接，所有接口均能回指功能和能力节点
- [x] Step 6 的 compile / runtime / event / adapter / ref / fake seam 无类型冲突
- [x] Policy / credential 等无功能或无 owner 边界未被伪造成正向接口
- [x] 每个能力节点均已停审，未泄漏 API、RPC、Command、DTO、proto、事件 schema、字段或实现 port
- [x] 未修改正式 `00-需求文档.md`，未进入 Step 13 正文写入

结论：`gate_status = pass`，`current_state = stop_review`。用户已授权完成整份 00，下一动作是先更新 flow / ledger，再读取 Step 13 SOP、书写规范 4.13 和本 Step 结论。
