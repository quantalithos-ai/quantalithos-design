# Step 12 · 接口与依赖

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 · 接口与依赖 |
| 输出文件 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 12、书写规范 §4.12 与全局依赖规则 |
| 已读取前序输入 | yes，Step 6 依赖裁剪、Step 9 功能、Step 11 数据归属 |
| 模块骨架 | done：逐能力接口面 / 外部依赖边界 / 全局类型 / 同异步 / 映射与停审 |
| 进入条件 | `pass`，Step 11 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按 C1~C6 收敛对外产品能力接口面 | done | 见 §7.1 |
| 按 owner 能力而非仓依赖原表收敛输入边界 | done | 见 §7.2 |
| 标明接口类型、能力依赖类型与全局依赖类型 | done | 见 §7.1~§7.3 |
| 区分同步主路径、可选异步提示与正式异步结果 | done | 见 §7.4 |
| 逐能力映射功能并停审 | done | 见 §7.5 |
| 审计 Step 6 冲突、孤儿与依赖缺口 | done | 见 §7.6 |
| 排除 path/DTO/protocol/port/事件 schema | done | 见 §5、§11 |
| 形成回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 6 | 保持 `L0-core/L0-sdk` 编译/访问基础、L1~L4 运行期 owner、SDK-only 事件提示和禁止直连边界。 |
| Step 9 | 每个接口/依赖面必须回指 `FR-CON-*`，不把功能表原样复制。 |
| Step 11 | query 输入只能形成 owner-safe snapshot/ref；command 输出只能形成客户端请求状态与 owner refs；forbidden body 不得通过接口旁路进入。 |
| 全局依赖规则 | 只有正式共享契约/SDK 可形成编译期依赖；运行期与事件协作不能转成源码 path dependency。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓对外提供哪些能力级接口？ | 主要向人类交互环境提供安全管理产品面：语境/资格呈现、owner-safe 查询视图、受控意图提交、结果回查、管理主题审阅、降级恢复/a11y；不向 L1~L4 输出业务 truth。 |
| 本仓消费哪些能力级输入？ | 共享安全语义与官方 SDK、正式 actor/scope/visibility、各 owner 的安全 query/command receipt/result/ref、可选 SDK 状态提示，以及条件化 export/report/diagnostic 能力。 |
| 哪些同步，哪些异步？ | 当前核心读取、资格解析、提交与回查以能力级同步请求/响应为必需；owner 可返回 pending 并以后续正式回查完成。SDK 状态通知仅可选失效提示，不是本地 projection；无当前 Console 事件输出。 |
| 哪些是输入型、哪些结果是输出型？ | owner query/decision/result/ref 是 Console 的输入；用户受控意图是发往 owner 的输出；对人类呈现的视图/反馈是产品输出，但不是平台业务接口 truth。 |
| 核心与外围边界如何区分？ | C1~C6 对应核心产品接口；个性化、趋势/评审、批量/导出、跨产品链接和诊断上送均为条件化外围。 |
| 与 Step 6 全局类型如何映射？ | `L0-core/L0-sdk` 可有编译期；所有 owner 正向消费为运行期；状态提示仅 SDK 正式封装时为事件协作；人类/浏览器环境不适用仓际全局类型。 |
| 是否存在孤儿接口或依赖缺口？ | 无孤儿接口。所有核心功能有 query/command/ref/产品面承接；exact surface 未闭口形成 pending，不被伪造为 ready。 |

## 5. 当前材料与旧文档问题诊断

| 材料 | 问题 | 当前处理 |
|---|---|---|
| 旧 API/SLA/proto 清单 | 提前锁 path、方法、协议和无 authority 的 SLA | 全部降为能力级输入/输出边界；exact contract 记 pending |
| 旧多 Server 直连 | 绕过 SDK，易复制认证/重试/错误语义 | 默认经 `L0-sdk` 或正式服务边界；不得私有直连 |
| 旧 Provider Contract | 把 capability 聚合定义为 Console 对外正式合同 | 删除；仅消费 Capability Hub 正式 query/command/ref |
| 旧 event/subscription | 可能让 UI 直接维护投影、cursor、replay | 只接受 SDK 正式失效/状态提示并重新查询，不建立事件 truth |
| 旧导出/报告 | 把 Console 视为报告或 artifact 生成 owner | 仅在 owner 正式开放时发起请求并消费结果引用 |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前口径 |
|---|---|---|
| 接口名称 | API/Command/Service 名 | 用户可见的能力主题 |
| 依赖表达 | 仓清单或 endpoint 清单 | owner 提供的能力级输入面及全局依赖类型 |
| 实时状态 | 直接订阅事件并本地聚合 | SDK 提示可选，正式 query/result 仍是确认来源 |
| 对外输出 | Console 可能提供聚合业务合同 | 只提供产品交互面和条件化安全链接/诊断，不输出 owner truth |
| command | 一概假定存在 | 只有正式 owner surface 开放时才启用，否则 read-only/blocked |

采用“SDK 统一访问 + owner 分域能力 + 产品交互输出”的结构。Console 自建 BFF/聚合服务并非当前获授权仓边界；本需求不以便利性推导该新 owner。

## 7. 结构化中间产物

### 7.1 对外能力接口表

这里的“对外”首先指 Console 向授权人类和受支持运行环境提供的产品能力面，不表示它成为 L1~L4 的业务服务端。

| ID | 接口类型 | 名称 | 说明 | 所属能力层级 | 功能映射 |
|---|---|---|---|---|---|
| `IF-CON-001` | 查询接口 | 可信访问语境呈现 | 对外体现为确认当前正式访问语境、显示允许的范围变化以及失效保护的产品入口。 | 核心闭环能力 `C-CON-1` | `FR-CON-001~002` |
| `IF-CON-002` | 查询接口 | 安全导航与资格姿态 | 对外体现为依据正式 visibility/资格展示入口、动作上限和安全解释。 | 核心闭环能力 `C-CON-2` | `FR-CON-003~004` |
| `IF-CON-003` | 查询接口 | Owner-safe 管理查询与引用 | 对外体现为带来源和多轴状态的读取、筛选、分页、下钻与安全回链。 | 核心闭环能力 `C-CON-3` | `FR-CON-005~006` |
| `IF-CON-004` | 变更接口 | 客户端草稿与受控意图提交 | 对外体现为本地意图草稿、提交前复核，以及在 owner 正式开放时提交管理意图；不直接变更业务 truth。 | 核心闭环能力 `C-CON-4` | `FR-CON-007~008` |
| `IF-CON-005` | 查询接口 | 正式请求结果确认与回查 | 对外体现为区分 receipt/pending/confirmed/rejected/unknown，并在正式支持时安全回查。 | 核心闭环能力 `C-CON-4` | `FR-CON-008~009` |
| `IF-CON-006` | 查询接口 | 组织人员管理视图 | 对外体现为 identity/member-service owner-safe 状态、引用和条件化管理入口。 | 核心闭环能力 `C-CON-5` | `FR-CON-010` |
| `IF-CON-007` | 查询接口 | 项目、过程与 Workspace 监督视图 | 对外体现为分 owner、带 coverage 的联合监督视图和正式回链。 | 核心闭环能力 `C-CON-5` | `FR-CON-011` |
| `IF-CON-008` | 查询接口 | 方法资产管理视图 | 对外体现为正式方法资产浏览、本地草稿入口和条件化管理请求。 | 核心闭环能力 `C-CON-5` | `FR-CON-012` |
| `IF-CON-009` | 查询接口 | 治理决定与 evidence 引用审阅 | 对外体现为正式 Governance/SoA/AIIA/Control/Gate 状态、决定与 artifact/evidence 回链。 | 核心闭环能力 `C-CON-5` | `FR-CON-013` |
| `IF-CON-010` | 查询接口 | 审计与指标只读审阅 | 对外体现为正式审计、指标、coverage/freshness 和获准下钻/请求入口。 | 核心闭环能力 `C-CON-5` | `FR-CON-014` |
| `IF-CON-011` | 查询接口 | Capability、Archive 与 Sandbox 管理视图 | 对外体现为三个 owner 分离的状态轴、引用和各自条件化管理入口。 | 核心闭环能力 `C-CON-5` | `FR-CON-015` |
| `IF-CON-012` | 查询接口 | 保守降级与安全恢复 | 对外体现为非理想状态解释、重试/重验/回查/退出与草稿连续性。 | 核心闭环能力 `C-CON-6` | `FR-CON-016~017` |
| `IF-CON-013` | 查询接口 | 可访问等价交互 | 对外体现为键盘、辅助技术和非颜色语义可完成相同管理目标。 | 核心闭环能力 `C-CON-6` | `FR-CON-018` |
| `IF-CON-E01` | 查询接口 | 个性化管理工作区 | 在正式可见性与配置边界具备时，提供个人布局和安全快捷入口。 | 外围增强能力 | `FR-CON-E01` |
| `IF-CON-E02` | 查询接口 | 趋势与结构化评审 | 在来源声明可比较且正式评审输入具备时，提供带上限的趋势/评审组织面。 | 外围增强能力 | `FR-CON-E02` |
| `IF-CON-E03` | 变更接口 | 批量意图与正式导出请求 | 在 owner 支持逐项结果、部分失败和相应正式合同后，提供条件化请求面。 | 外围增强能力 | `FR-CON-E03` |

当前没有 Console 业务 `事件输出`：客户端状态、导航、缓存和草稿不得成为下游业务 truth。当前也没有 Console 自有 `后台任务接口`；owner 的异步任务只通过 receipt/result/ref 被呈现。SDK 正式状态通知属于外部 `事件输入` 候选，见 §7.2，而非 Console 对外接口。

### 7.2 外部依赖边界表

| ID | 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 / 功能 |
|---|---|---|---|---|---|---|
| `DEP-CON-001` | 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | 提供正式暴露的共享安全引用、错误与关联语境定义；不引入领域服务源码。 | 核心；C1~C6 共用 |
| `DEP-CON-002` | 输入/输出 | 外部能力依赖 | `L0-sdk` | 编译期依赖 + 运行期依赖 | 提供官方客户端访问边界，承接 owner query、条件化 command、result/ref 与正式错误语义。 | 核心；`FR-CON-001~017` |
| `DEP-CON-003` | 输入 | 定义来源依赖 | `L1-identity` | 运行期依赖 | 提供 actor/member 安全语境、身份/生命周期摘要与正式引用；其不可验证会阻断受保护能力。 | 核心；C1/C5，`FR-CON-001~002`, `FR-CON-010` |
| `DEP-CON-004` | 输入 | 治理结论依赖 | 正式 visibility / Policy / Gate owner（以 `L1-governance` 等正式边界为准） | 运行期依赖 | 提供入口/动作资格和治理前置结果；Console 不复制规则或生成许可。 | 核心；C2/C4/C5，`FR-CON-003~004`, `FR-CON-008`, `FR-CON-010~015` |
| `DEP-CON-005` | 输入/输出 | 外部能力依赖 | `L1-identity` / `L2-member-service` | 运行期依赖 | 提供人员/宿主 owner-safe query/ref/result，并接收正式开放的管理意图。 | 核心；`FR-CON-010` |
| `DEP-CON-006` | 输入/输出 | 外部能力依赖 | `L1-work` / `L1-process` / `L1-workspace` | 运行期依赖 | 提供分域项目、工作、过程、Workspace 安全读取/引用；Workspace safe read/export 与所有写入口按正式合同裁剪。 | 核心；`FR-CON-011` |
| `DEP-CON-007` | 输入/输出 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | 提供方法资产目录/版本安全读取，并在正式开放时接收方法管理意图、返回结果引用。 | 核心；`FR-CON-012` |
| `DEP-CON-008` | 输入 | 治理结论依赖 | `L1-governance` / `L1-artifact` | 运行期依赖 | 提供 Governance/SoA/AIIA/Control/Gate 决定、状态及安全 evidence/artifact refs。 | 核心；`FR-CON-013` |
| `DEP-CON-009` | 输入/输出 | 外部能力依赖 | `L4-observability` | 运行期依赖 | 提供审计/指标/lineage/验证/报告安全 query/result/ref，并在正式开放时接收相应请求；不接收伪 evidence。 | 核心；`FR-CON-014` |
| `DEP-CON-010` | 输入/输出 | 外部能力依赖 | `L3-capability-hub` | 运行期依赖 | 提供注册/暴露/适配/access-review 安全状态和引用，并在正式开放时接收管理意图。 | 核心；`FR-CON-015` |
| `DEP-CON-011` | 输入/输出 | 外部能力依赖 | `L4-archive` | 运行期依赖 | 提供请求、材料、完整性、兼容性、恢复/handoff 状态与引用；正向管理能力在 activation/contract 闭口前 blocked。 | 核心范围、正向 pending；`FR-CON-015` |
| `DEP-CON-012` | 输入/输出 | 外部能力依赖 | `L4-sandbox` | 运行期依赖 | 提供隔离/运行/清理安全状态和正式开放入口；不把状态组合为 readiness。 | 核心范围、条件进入；`FR-CON-015` |
| `DEP-CON-013` | 输入 | 外部能力依赖 | `L0-sdk` 封装的正式 owner 状态通知 | 事件协作依赖 | 可提示相关快照失效或 owner 状态变化；必须重新查询/回查确认，不维护 cursor/replay/projection truth。 | 核心增强路径；`FR-CON-002~017` |
| `DEP-CON-014` | 输出 | 外部能力依赖 | 浏览器/辅助技术运行环境 | 不适用 | Console 提供可感知、可操作的等价产品体验；环境差异不能降级业务目标。 | 核心；`FR-CON-018` |
| `DEP-CON-E01` | 输入/输出 | 外部能力依赖 | 各正式 owner 的比较/批量/export/report 能力 | 运行期依赖 | 只有 owner 提供可比较、逐项结果和正式 artifact/ref 合同时才启用趋势、评审、批量与导出。 | 外围；`FR-CON-E02~E03` |
| `DEP-CON-E02` | 输出 | 下游消费依赖 | `L4-observability`（若正式接收） | 运行期依赖 | 可上送经过安全裁剪的客户端交互诊断；不得包含 forbidden body，也不构成 audit/evidence。 | 外围诊断；`FR-CON-016~018` |
| `DEP-CON-E03` | 输出 | 下游消费依赖 | 其他 L5/L6 产品（仅未来正式链接/引用合同） | 运行期依赖 / 不适用 | 可提供安全 deep-link 或返回入口；未停审产品不成为当前 truth、主链前置或私有状态依赖。 | 外围；`FR-CON-E01` |

说明：`输入/输出` 表示能力信息方向，不是函数调用方向。`L0-sdk` 同时是可编译的官方客户端边界和运行期承接者，因此同时标注两类全局依赖；L1~L4 owner 仍不得成为源码 path dependency。

### 7.3 能力边界与接口/依赖类型映射

| 能力节点 | Console 产品接口 | 主要外部输入/输出 | 接口类型 | 能力依赖类型 | 全局依赖类型 |
|---|---|---|---|---|---|
| `C-CON-1` | `IF-CON-001` | `DEP-CON-002~003` | 查询接口 | 定义来源 / 外部能力 | 编译 + 运行期 |
| `C-CON-2` | `IF-CON-002` | `DEP-CON-002`, `DEP-CON-004` | 查询接口 | 治理结论 / 外部能力 | 编译 + 运行期 |
| `C-CON-3` | `IF-CON-003` | `DEP-CON-002`, `DEP-CON-005~012`（按主题） | 查询接口 | 定义来源 / 外部能力 | 编译 + 运行期 |
| `C-CON-4` | `IF-CON-004~005` | `DEP-CON-002`, `DEP-CON-004~012`（仅正式开放动作） | 变更接口 + 查询接口 | 治理结论 / 外部能力 | 编译 + 运行期 |
| `C-CON-5` | `IF-CON-006~011` | `DEP-CON-005~012` | 查询接口，内含条件化受控意图出口 | 定义来源 / 治理结论 / 外部能力 | 运行期 |
| `C-CON-6` | `IF-CON-012~013` | 所有适用 owner、`DEP-CON-013~014` | 查询接口；可选事件输入 | 外部能力 | 运行期 + 条件事件协作 / 不适用 |
| 外围增强 | `IF-CON-E01~E03` | `DEP-CON-E01~E03` | 查询/变更 | 外部能力 / 下游消费 | 条件运行期 |

### 7.4 同步、异步与输出语义

| 边界 | 当前需求口径 | 明确不代表 |
|---|---|---|
| 正式 query / visibility / qualification | 用户触发或页面需要时取得可判别结果；失败按 owner 局部降级或身份 fail-closed | 不承诺具体传输协议或延迟阈值 |
| command submission | 用户显式确认后向正式 owner 提交意图；返回可为 rejected/accepted/pending/unknown | accepted/transport success 不等于 committed |
| result reconciliation | owner 正式支持时按 receipt/ref 回查；不支持则保持 unknown/blocked | 不允许无依据自动重放或本地推导 |
| SDK state notification | 可选异步失效/刷新提示，收到后重新校验或查询 | 不是业务事件真相、projection、cursor 或完成证明 |
| owner asynchronous work | Console 只呈现正式 task/result/ref 的当前状态 | 不由 Console 执行后台任务或决定终态 |
| Console event output | 当前无业务事件输出；只可能有条件化安全诊断或产品链接 | UI 状态、草稿、缓存不得供下游作为业务 truth |

### 7.5 能力级接口停审

| 节点 | 接口与依赖范围 | 功能承接 | 协议/实现泄漏 | 结论 |
|---|---|---|---|---|
| C1 | 语境产品面；SDK + identity 正式语境 | `FR-CON-001~002` complete | none | `pass` |
| C2 | 导航/资格产品面；正式 visibility/Policy/Gate | `FR-CON-003~004` complete | none | `pass` |
| C3 | owner-safe query/ref；按 C5 owner 裁剪 | `FR-CON-005~006` complete | none | `pass` |
| C4 | 草稿/意图出口 + result query/ref；owner 正式开放 | `FR-CON-007~009` complete | none | `pass` |
| C5 | 六个管理产品面；十二个正式 owner 边界 | `FR-CON-010~015` complete | none | `pass_with_positive_surfaces_pending` |
| C6 | 降级/恢复/a11y；可选 SDK 提示与运行环境 | `FR-CON-016~018` complete | none | `pass` |
| 外围 | 比较/评审/批量/export/诊断/link | `FR-CON-E01~E03` complete | none | `pass_conditional` |

### 7.6 跨能力接口与依赖审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 与 Step 6 依赖类型是否冲突 | pass | compile/runtime/event/ref 边界一致；未把 owner runtime 写成源码依赖。 |
| 是否重抄 Step 6 仓关系 | pass | 本步按能力级 query/decision/command/result/ref/diagnostic 表达。 |
| 每个接口/依赖是否有功能来源 | pass | 核心与外围全部映射；无孤儿接口。 |
| 功能是否有外部协作缺口 | pass_with_pending | 结构无缺口；exact surface、safe field、activation 仍限制正向范围。 |
| 是否重复定义同一外部能力 | pass | SDK 是统一访问边界，owner 分别保有语义；C3/C4 横向能力不重定义 C5 owner。 |
| 是否错误宣称事件必需或 ready | pass | 事件输入为可选 SDK 提示；核心可用显式 query/revalidation 成立。 |
| 是否存在 Console 业务事件输出/服务端 truth | pass | none。 |
| 是否包含 API path、方法/命令名、DTO/schema/字段、port/handler | pass | none。 |

引用图：依赖拓扑沿用 `00_req_step_06_consumers_dependencies.md` §7.5，不在本 Step 绘制调用链或事件链。

## 8. 复杂度判断

13 项核心产品接口、3 项外围接口与 17 条依赖边界覆盖多 owner，但表达仍停留在能力级。C5 exact query/command、safe-field、activation 和 reason/result 合同未闭口，因此后续只能写质量判断口径和 blocked 条件，不能进入 DTO/API 粒度或宣称集成 ready。

## 9. 回填草稿

正式 §12 回填 §7.1 对外能力接口表、§7.2 外部依赖边界表、§7.4 同异步语义，并引用 Step 6 依赖裁剪图。§7.3/§7.5~§7.6 主要保留在 calibration 作追溯审查。正式正文必须保留“当前无业务事件输出”和“事件提示不能形成投影 truth”。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-001` | 各 owner exact SDK query/command surface | 仅声明能力级依赖；对应正向集成保持 `pending/blocked` | `open / blocks_exact_integration` |
| `CON-Q-002` | tenant/organization 等正式 scope owner 与合同 | 语境不可验证则 fail-closed；不由 Console 建模 | `open / blocks_exact_context_contract` |
| `CON-Q-008` | SDK 是否正式提供状态通知 | 可选增强；无通知仍以显式 query/revalidation 成立 | `open / non_blocking` |
| `CON-Q-009` | Workspace safe read/export 可用边界 | 非唯一来源；未闭口时从 owner 分域读取或标 blocked | `open / non_blocking_for_core_shell` |
| `CON-Q-025` | Method/Capability access-review/Observability report/Archive/Sandbox 正向合同与 activation | 各页面逐 owner 保持 partial/read-only/blocked，不宣称 ready | `open / blocks_positive_surfaces` |
| `CON-Q-026` | 浏览器诊断上送和跨产品 deep-link 的正式合同 | 两者均为外围；无合同时不启用 | `open / non_blocking` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否按六节点逐项形成接口/依赖并停审 | pass |
| 是否使用正式接口类型和依赖类型枚举 | pass |
| 是否保留全局 compile/runtime/event 类型且与 Step 6 一致 | pass |
| 是否区分 query、受控意图、result/ref 与可选状态提示 | pass |
| 是否明确 Console 无业务事件输出和后台任务 owner | pass |
| 每项接口/依赖是否回指功能且无遗漏/重复 | pass |
| 是否仅经 SDK/正式服务边界，未引入 DB/源码/bus 私有依赖 | pass |
| 是否未写 path、method/command 名、DTO、schema、字段或实现 port | pass |
| 是否发现阻塞 Step 13 的 blocker | no；exact contract pending 只限制量化与正向可用声明 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 产品接口、owner 输入、同步/异步语义、类型映射与跨能力审计完成 | 更新 flow，激活 Step 13 | 本文件；Step 6/9/11；书写规范 §4.12 |
| 文档级 | `pass_to_step_13` | 所有功能具有能力级接口/依赖承接，未泄漏协议或实现细节 | 创建并完成 `00_req_step_13_non_functional_requirements.md` | 本文件；Step 7/10/11 |
| 项目级 | `pass_with_open_upstream_pending` | exact surface、activation、诊断/link 合同 pending，不阻塞需求级 NFR | 进入 Step 13；正式 00 仍不可写 | 项目台账；需求 flow |
