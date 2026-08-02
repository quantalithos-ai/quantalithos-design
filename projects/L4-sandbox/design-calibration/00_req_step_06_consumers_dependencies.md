# L4-sandbox 00 需求 Step 6: 使用方与依赖

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 5,允许进入 Step 6;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 6 章“使用方与依赖”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 前置确认 | pass:用户在 Step 5 停审后回复“同意 / 继续”,允许进入 Step 6 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 6;`需求文档书写规范.md` §4.6 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取全局依赖来源 | yes:`全局项目依赖关系与裁剪规则.md` §2~§6;`architecture/仓库拆分方案.md` L4-sandbox 条目;`projects/README.md` 基础设施契约型说明 |
| 已读取上游 / 下游参考 | yes:`projects/L2-tools/00~06`;`projects/L2-runtime/00~06`;`projects/L2-member-service/00~06`;`projects/L1-identity/00~07`;`projects/L1-work/00~07`;按需读取 `L1-artifact` / `L4-observability` / `L5-runner` 中与 sandbox 接缝相关正式文档 |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `01/02/03/05/06` 中依赖、接口、后端、审计和验收线索 |
| 历史材料口径 | 旧依赖、后端、SDK、事件名、接口名、性能目标和验收项只作差异审计输入,不继承为当前 Step 6 结论 |
| 禁写范围 | 不写角色说明、核心能力闭环步骤、用户故事、功能清单、业务规则、数据归属、接口签名、DTO、API path、event payload、port、repository、adapter、配置 key、后端选型、测试用例、验收门禁或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_7 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~5、SOP、书写规范、全局依赖规则和相邻仓线索摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 提供方、依赖方、全局依赖边、主链裁剪、依赖类型、闭环前置、失效影响和强弱阻塞回答 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 全局基线、相邻仓、旧 README / 旧 00、外部系统和事件 / SDK / 后端混写诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 内部依赖主轴、外部系统依赖、`L0-bus` 事件协作、SDK / product / policy 来源、禁止编译期依赖取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 内部仓依赖表、外部系统依赖表、依赖裁剪表、类型分类表、禁止依赖表和依赖裁剪 ASCII 图 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否纳入外部后端、是否拆附录、是否补 ASCII 图判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 6 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 6 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 7。 |

---

## 2. 必读摘要

| 文档 | Step 6 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 6 | 本步说明本仓为谁提供能力、依赖谁的前置能力、哪些依赖阻塞核心闭环;必须输出裁剪表、类型分类表、禁止依赖表和 ASCII 图。 | 不写角色、接口、事件名、能力闭环步骤或实现组织。 |
| `需求文档书写规范.md` §4.6 | 正式第 6 章固定包含内部仓依赖表、外部系统依赖表、依赖裁剪表、类型分类表、禁止依赖表;两个以上内部关系或易误写编译期依赖时必须画裁剪图。 | 本 Step 必须使用固定表结构,字段只写能力级关系和需求层失效影响。 |
| `全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期依赖 `L0-core`;运行期依赖容器 / k8s / isolation backend;按需发布 sandbox 事件;不拥有业务真相。只有编译期依赖可进 package dependency。 | `L0-core` 是唯一当前编译期依赖;isolation backend 是外部运行期依赖;事件协作只能经 `L0-bus` 语义表达,不能变成源码依赖。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,负责可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 | 使用方与依赖必须围绕受控执行环境能力,不得把 tools/runtime/member truth 写入 sandbox。 |
| `00_req_step_04_goals_non_goals.md` | 目标要求统一跨调用方受控执行边界,覆盖 environment identity、limits、FS/network/process、launch policy、capture、observability、failure、cleanup、redlines;非目标排除相邻仓 truth 和后端选型。 | 依赖裁剪必须能支撑后续 Step 7 能力主轴,同时保护非目标表。 |
| `00_req_step_05_users_roles.md` | 已区分受控执行请求方、AI member、Runner 操作者、安全审查者、运维、审计者和后台 reaper;相邻仓不是角色。 | Step 6 可以写 `L2-tools`、`L2-runtime`、`L2-member-service` 等使用方和协作方,但不能回写成角色。 |
| `L2-tools` 正式文档 | tools 将 sandbox 作为危险 / restricted / governed tool 的隔离承载;ToolPolicy、ToolInvocationResult、ToolAuditEntry 等归 tools。 | `L2-tools` 是 sandbox 的运行期消费方 / 协作方,不是 sandbox 的上游 truth。 |
| `L2-runtime` 正式文档 | runtime 调度 tools / member-service / sandbox 等执行能力,并回收反馈;ExecutionInstance、agent loop、recover 和结果回流归 runtime。 | `L2-runtime` 是运行期消费方 / 协作方;其执行主线不能成为 sandbox 依赖前置或内部事实。 |
| `L2-member-service` 正式文档 | member-service 装配 capability / tool scope / actor / sandbox bind,未 bind 完成不得执行;SandboxBinding 是宿主装配结果,不是 sandbox truth。 | `L2-member-service` 是运行期消费方 / 协作方,但 SandboxBinding truth 归 member-service。 |
| `L1-identity` / `L1-work` 正式文档 | identity 拥有 actor/member 身份锚点;work 拥有 Project、ProjectMember、WorkItem、ImplementationPlan 等工作事实。 | 这两者是 sandbox 执行上下文引用来源,不是编译期依赖,也不是 sandbox truth。 |
| `L1-artifact` / `L4-observability` / `L5-runner` 正式文档 | artifact 消费候选输出但拥有正式制品 truth;observability 消费 audit / trace / metrics material 但不反写真相;runner 消费 runtime/sandbox/artifact/observability source 组织产品体验。 | sandbox 可以向这些仓提供材料或状态语境,但不得决定 artifact truth、observability store truth 或 runner 产品 truth。 |
| 旧 `README.md` / 旧 `00-需求文档.md` | 旧材料写 `quantalithos-core/sdk`、Docker/containerd/gVisor/Firecracker/runc、tools/runner/capability-hub、SandboxService、SandboxInvoked/Exited 等。 | 只保留“隔离后端、危险工具、Runner 共用、policy 语境、事件材料”的线索;SDK、事件名、接口名和后端清单不作为当前 Step 6 结论。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本仓向哪些仓 / 系统提供哪些能力? | 向 `L2-tools` 提供危险 / restricted / governed 工具所需的隔离执行环境和边界反馈材料;向 `L2-runtime` 提供被调度的受控执行能力和隔离层结果材料;向 `L2-member-service` 提供成员宿主执行前后可绑定、可释放、可分类失败的隔离环境能力;向 `L5-runner` 提供运行 AI 产物或应用的隔离执行基础;向 `L1-artifact` 提供执行输出 / 候选材料 / 捕获材料引用语境;向 `L4-observability` 提供 sandbox 观测 hook、audit / trace / metrics material;按需通过事件协作向平台发布 sandbox 状态材料。 |
| 本仓依赖哪些仓 / 系统提供哪些能力? | 编译期只依赖 `L0-core` 的共享 ID、typed ref、actor/context、trace、error、metadata 和安全材料基础;运行期依赖容器 / k8s / isolation backend 承载隔离环境;按需消费 `L1-identity` 的 actor/member identity anchor、`L1-work` 的 project/work/context refs、governance / capability / tools 等策略真相源给出的 launch/isolation policy;通过 `L0-bus` 与相邻仓进行事件协作。 |
| 这些关系在全局依赖基线中分别是什么边? | 全局基线直接给出 `L4-sandbox -> L0-core` 为编译期依赖,`L4-sandbox -> 容器 / k8s / isolation backend` 为运行期依赖,`L4-sandbox -> sandbox events` 为事件协作。`L2-member-service` 运行期消费 `L4-sandbox`;`L5-runner` 经正式边界消费 `L4-sandbox`;`L4-observability` 通过 `L0-bus` 消费 audit material;`L2-tools` / `L2-runtime` 与 sandbox 的接缝来自上游正式文档和 Step 2/4 的边界对象,不得升级为编译期依赖。 |
| 哪些全局依赖边需要进入本仓需求主链,哪些应被裁剪出去? | 进入主链的是 `L0-core` 编译期依赖、isolation backend 运行期依赖、`L0-bus` 事件协作、`L2-tools` / `L2-runtime` / `L2-member-service` / `L5-runner` 的运行期消费关系、`L1-identity` / `L1-work` 的引用输入关系、`L1-artifact` / `L4-observability` 的材料消费关系、policy 来源的运行期输入关系。裁剪出去的是 `L0-sdk` 编译期依赖、具体 Docker/gVisor/Firecracker/runc 后端承诺、事件名 / API / DTO、上层 UI/console/chat/sync/bridges 直接依赖和外部 GRC / 审计 / 数据库 / 对象存储产品。 |
| 每条进入主链的关系属于哪类依赖? | `L0-core` 是编译期依赖;容器 / k8s / isolation backend、`L1-identity`、`L1-work`、policy 来源、`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact` 属于运行期依赖或运行期消费关系;`L0-bus` 与 `L4-observability` 主要是事件协作 / 观测材料协作;除 `L0-core` 外均不得写成 package dependency。 |
| 哪些依赖是闭环前置? | 基础闭环前置是 `L0-core` 和 isolation backend:没有共享契约或隔离后端,受控执行环境无法被标识、限制、启动、捕获、失败分类和清理。事件协作 `L0-bus` 是可观测 / 可审计闭环前置,但不阻塞最小本地隔离环境语义。`L1-identity`、`L1-work`、policy 来源是场景前置:缺失时只能形成降级 / 拒绝 / 缺上下文的隔离执行语境,不能补造上游 truth。 |
| 哪些依赖失效时会影响本仓当前阶段能力? | `L0-core` 失效会阻塞跨仓引用和错误 / trace / actor 口径;isolation backend 失效会阻塞真实隔离环境创建;`L0-bus` 或 `L4-observability` 失效会影响事件 / 观测材料交接;identity/work/policy 来源失效会导致执行上下文或策略语境缺失,应 fail closed 或标记缺失,不得由 sandbox 补造;tools/runtime/member-service/runner 不可用会影响消费方流程,但不改变 sandbox 自身 truth 边界。 |
| 哪些关系只是消费 / 引用,哪些关系会形成强阻塞? | 强阻塞关系是 `L0-core` 编译期契约和 isolation backend 运行期承载。`L0-bus`、observability、artifact、tools/runtime/member-service/runner 多为消费 / 协作关系;identity/work/policy 是执行上下文或策略引用,对相关场景阻塞,但不是 sandbox 基础仓成立的唯一前置。 |
| 哪些依赖虽然存在,但不属于当前阶段前置条件? | `L0-sdk`、具体 Docker/gVisor/Firecracker/containerd/runc、对象存储、数据库、OTel 后端、审计平台、外部 GRC、`L5-console` / `L5-chat` / `L6-bridges` 等都可能在后续架构、配置、产品或集成阶段出现,但不是当前 Step 6 需求主链前置。 |

---

## 4. 当前材料诊断

### 4.1 全局基线诊断

全局依赖矩阵对 `L4-sandbox` 的直接结论很窄:编译期依赖 `L0-core`,运行期依赖容器 / k8s / isolation backend,按需发布 sandbox 事件,且不拥有业务真相。这个基线必须优先于旧 README 和旧 `00` 中的 SDK、后端清单、事件名和具体接口。若把旧材料里的 `quantalithos-sdk`、Docker/gVisor/Firecracker、SandboxService 或 SandboxInvoked 直接写入 Step 6,就会把需求层依赖裁剪变成架构 / 接口 / 配置设计。

### 4.2 相邻仓依赖诊断

| 相邻对象 | 可进入 Step 6 的能力级关系 | 容易写错的方向 | 当前处理 |
|---|---|---|---|
| `L2-tools` | 危险 / restricted / governed 工具消费隔离执行能力和边界反馈材料。 | 把 ToolPolicy、ToolInvocationResult、ToolAuditEntry 写成 sandbox 输入 / 输出 truth。 | 写为运行期消费方 / 协作方,禁止编译期依赖。 |
| `L2-runtime` | 调度 sandbox 执行能力并消费结构化反馈或隔离层材料。 | 把 ExecutionInstance、agent loop、recover/checkpoint 写进 sandbox。 | 写为运行期消费方 / 协作方,不拥有 runtime truth。 |
| `L2-member-service` | 通过 sandbox bind / execute 接缝装配成员宿主受限动作。 | 把 SandboxBinding 装配结果或 host lifecycle 写成 sandbox truth。 | 写为运行期消费方;bind truth 归 member-service。 |
| `L1-identity` | 提供 actor / member identity anchor 作为执行环境身份语境。 | 让 sandbox 保存身份正文或管理成员生命周期。 | 写为运行期引用输入,不是编译期依赖。 |
| `L1-work` | 提供 project/work/context refs 作为执行上下文语境。 | 让 sandbox 保存 Project、WorkItem、ImplementationPlan 正文。 | 写为运行期引用输入,不拥有 work truth。 |
| `L1-artifact` | 消费 sandbox 捕获的输出 / 候选材料 / evidence-like refs。 | 让 sandbox 直接入库或决定 Artifact truth。 | 写为输出材料消费方;artifact truth 不归 sandbox。 |
| `L4-observability` | 消费 sandbox observability hook、audit / trace / metrics material。 | 让 sandbox 成为 observability store 或让 observability 反写 sandbox truth。 | 写为事件协作 / 观测材料消费方。 |
| governance / capability / tools policy 来源 | 提供 launch/isolation policy 或 allow/deny 语境。 | 让 sandbox 决定策略 truth 或 policy DSL。 | 写为运行期输入,且 sandbox 只执行给定策略并 fail closed。 |
| `L5-runner` | 经正式边界消费 sandbox 运行隔离能力。 | 让 sandbox 拥有 RunnerRun、run state、output preview 或产品控制语义。 | 写为运行期消费方,不拥有 runner 产品 truth。 |

### 4.3 旧材料依赖污染诊断

| 旧表达 | 可保留线索 | 当前问题 | Step 6 处理 |
|---|---|---|---|
| `quantalithos-core / quantalithos-sdk` | `L0-core` 是共享契约;SDK 可能是上层访问路径。 | 旧 README 把 SDK 写成上游,但全局基线没有 `L4-sandbox` 编译期依赖 `L0-sdk`。 | 保留 `L0-core`;`L0-sdk` 裁剪为当前不进入主链。 |
| Docker / containerd / gVisor / Firecracker / runc | sandbox 确实需要 isolation backend。 | 具体后端是架构 / 配置 / 实施选择,不是 Step 6 的产品清单。 | 统一写成“容器 / k8s / isolation backend”外部运行期依赖。 |
| `SandboxService trait` / `ExecuteSandboxed` | 需要正式执行边界。 | 接口名和 trait 属于 Step 12 / 03,不是依赖章节。 | 不继承接口名,只写能力级关系。 |
| `SandboxInvoked / SandboxExited / SandboxEscapeDetected` | sandbox 需要事件 / audit material。 | 事件名和 payload 属于接口 / 事件设计。 | 只写按需发布 sandbox 事件 / 观测材料。 |
| `capability-hub` 白名单授权 | sandbox 需要策略输入。 | 旧材料把 capability-hub 当唯一策略源,但当前边界应泛化为 governance/capability/tools policy 来源。 | 写为 policy 来源协作,不写成 sandbox truth。 |
| Runner 与 Member 共用接口 | 跨调用方统一隔离边界是有效目标。 | “共用接口”容易提前固化 API。 | 写为 `L2-member-service` 和 `L5-runner` 均消费同一 sandbox 能力边界。 |

### 4.4 外部系统依赖诊断

当前阶段唯一需要进入主链的正式外部系统依赖是“容器 / k8s / isolation backend”这一抽象运行期依赖。它是受控执行环境成立的基础承载,但 Step 6 不选择 Docker、containerd、gVisor、Firecracker、runc 或具体 k8s 发行形态。数据库、对象存储、OTel Collector、审计平台、日志平台、密钥系统和外部 GRC 系统都可能在后续架构、配置、NFR、测试或运维文档出现,但当前 Step 6 不把它们定为需求主链外部依赖。

---

## 5. 设计取舍

### 5.1 内部依赖主轴取舍

| 方案 | 内容 | 优点 | 问题 | 决策 |
|---|---|---|---|---|
| 方案 A | 沿用旧 README: core/sdk + Docker/gVisor + tools/runner/capability-hub。 | 接近旧材料。 | SDK、后端、接口、policy 来源和下游消费方混层。 | 不采用。 |
| 方案 B | 严格按全局基线只写 `L0-core`、isolation backend 和 sandbox events。 | 最干净。 | 无法解释 tools/runtime/member-service/runner 等使用方,后续 Step 7 会缺消费边界。 | 不单独采用。 |
| 方案 C | 以全局基线为底,再补入 Step 2/4 已确认边界对象的运行期消费、引用输入和事件协作关系。 | 能同时满足裁剪规则和后续能力闭环需要。 | 需要明确哪些关系不是编译期依赖。 | 采用。 |

### 5.2 `L0-bus` 与 sandbox 事件取舍

全局基线写的是“按需发布 sandbox 事件”,而不是 `L4-sandbox` 编译期依赖 `L0-bus`。因此本 Step 把事件协作关系写为经 `L0-bus` 的事件协作依赖,用于后续架构和接口设计裁剪,但不把 `L0-bus` 写成 Cargo / package dependency。事件名、payload、topic 和 delivery 语义全部后置 Step 12、01 和 03。

### 5.3 SDK / 产品入口取舍

`L0-sdk` 和 `L5-runner` 都与 sandbox 有关系,但性质不同:

- `L5-runner` 在全局基线中明确经正式边界运行期消费 `L4-sandbox`,应进入主链。
- `L0-sdk` 是上层产品和生态默认访问封装,旧 README 把 SDK 写为上游,但全局基线没有要求 sandbox 编译期依赖 SDK;当前 Step 6 只把 SDK 作为可能的上层访问路径背景,不进入 sandbox 依赖主链。
- `L5-console`、`L5-chat`、`L6-bridges` 当前不直接进入主链;它们若需要查看或触发 sandbox 语境,应经 SDK、runner、observability 或正式 service boundary。

### 5.4 Policy 来源取舍

旧材料把白名单 / 出网授权指向 capability-hub。当前按 Step 2/4 边界应更谨慎:策略决策 truth 不归 sandbox,可能来自 governance、capability、tools 或上层 policy source。Step 6 因此只写“launch/isolation policy 来源”这一运行期输入关系,不指定单一仓为唯一真相源,也不写 policy DSL、allowlist schema 或审批流程。

### 5.5 禁止依赖取舍

除 `L0-core` 外,所有相邻仓关系都不得成为 sandbox 的编译期依赖。特别是 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work`、`L1-artifact`、`L4-observability`、`L5-runner` 和具体后端 SDK,都只能通过运行期边界、事件协作、adapter 或正式 service boundary 表达。这样才能防止 L4 基础设施仓反向吞并上层 truth 或形成循环依赖。

---

## 6. 结构化中间产物

### 6.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、typed refs、actor/context、trace、error、metadata、安全材料和跨仓契约基础 | 是 | sandbox execution environment identity、错误分类、trace / actor 语境和跨仓引用无法稳定表达 |
| 输入 / 输出 | `L0-bus` | sandbox 事件协作主干,用于发布或消费受控执行状态、审计和维护材料 | 可观测 / 审计闭环是;最小本地隔离否 | 事件材料无法稳定交接给 observability、runtime 或下游消费方,但不得用本地日志替代正式事件协作 |
| 输入 | `L1-identity` | actor / member identity anchor,用于执行环境身份语境和责任链引用 | 场景前置 | 缺身份锚点时只能拒绝、降级或标记缺失,不得由 sandbox 创建身份 truth |
| 输入 | `L1-work` | project / work / context refs,用于执行上下文、工作对象和项目语境引用 | 场景前置 | 缺工作语境时无法形成完整责任链或上下文边界,不得保存 Project / WorkItem / ImplementationPlan 正文 |
| 输入 | governance / capability / tools policy 来源 | launch/isolation policy、allow/deny 语境、出网或高风险动作策略输入 | 安全策略场景是 | 策略缺失或不可解析时必须 fail closed 或标记缺失,不得由 sandbox 自行裁决 policy truth |
| 输出 | `L2-tools` | 为危险 / restricted / governed 工具提供隔离执行环境、边界反馈和失败材料 | 否,但 tools 危险执行场景是 | 工具高风险执行无法进入受控隔离路径;tools 不得补造 sandbox 结果或绕过隔离 |
| 输出 | `L2-runtime` | 提供被 runtime 调度的受控执行能力、隔离层结果和失败 / 清理语境 | 否,但 runtime 调度 sandbox 场景是 | runtime 动作调度缺少隔离执行能力或反馈材料,但 ExecutionInstance 和 recover truth 不归 sandbox |
| 输出 | `L2-member-service` | 提供 member host 执行前后需要绑定、释放和分类失败的 sandbox 能力 | 否,但成员受限动作执行场景是 | sandbox bind / execute 失败会阻断宿主受限动作;SandboxBinding 装配 truth 仍归 member-service |
| 输出 | `L5-runner` | 经正式边界提供 Runner 应用或 AI 产物运行所需隔离执行能力 | 否,但 runner 运行场景是 | Runner 无法形成受控运行体验;RunnerRun、run state、control entry 和 output preview 不归 sandbox |
| 输出 | `L1-artifact` | 提供执行输出、候选材料、捕获材料或 evidence-like refs 的来源语境 | 否 | Artifact 正式入库或版本化消费退化;artifact truth 不得由 sandbox 直接决定 |
| 输出 / 协作 | `L4-observability` | 提供 observability hook、audit / trace / metric material、失败和清理可观测材料 | 可观测 / 审计闭环是 | 观测、审计和排障材料不完整;observability store truth 不得反写 sandbox truth |

### 6.2 外部系统依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | 容器 / k8s / isolation backend | 承载隔离执行环境,提供进程、文件系统、网络、资源限制和生命周期控制的运行基础 | 是 | 无法创建真实受控执行环境,只能停留在需求 / fake / dry-run 语境 |

当前阶段不把 Docker、containerd、gVisor、Firecracker、runc、Kubernetes 发行版、对象存储、数据库、OTel 后端、日志平台、审计平台、密钥系统或外部 GRC 系统定为正式外部系统依赖。它们如需进入主链,必须在 `01-架构设计.md`、`04-配置设计.md`、`05-测试方案.md` 或 `06-验收标准.md` 中重新裁剪。

### 6.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L4-sandbox` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约是 sandbox 身份、trace、error、actor/context 和跨仓引用的基础 |
| `L0-bus` | `L4-sandbox` 按需发布 sandbox 事件;平台事件协作主干经 `L0-bus` | 协作方 | 事件协作 | 是 | sandbox 状态、审计、失败和清理材料需要进入事件协作,但不得成为源码依赖 |
| 容器 / k8s / isolation backend | `L4-sandbox` 运行期依赖容器 / k8s / isolation backend | 依赖方 | 运行期 | 是 | 受控执行环境必须有运行承载,但具体后端选择后置 |
| `L1-identity` | identity 提供成员 / actor 身份真相;L4 不拥有业务真相 | 依赖方 | 运行期 | 是 | sandbox 需要 actor/member anchor 作为执行环境身份语境,不保存身份正文 |
| `L1-work` | work 拥有 project/work facts;L4 不拥有业务真相 | 依赖方 | 运行期 | 是 | sandbox 需要 project/work/context refs 形成执行上下文和责任链引用 |
| governance / capability / tools policy 来源 | 全局基线中 governance/capability/tools 分别拥有 policy、capability 或 tool truth | 依赖方 / 协作方 | 运行期 | 是 | sandbox 执行给定 launch/isolation policy 并 fail closed,不自行做策略决策 |
| `L2-tools` | tools 通过能力边界使用 sandbox 执行危险 / restricted / governed tool | 被依赖方 / 协作方 | 运行期 | 是 | tools 是主要消费方之一,但 ToolPolicy 和 ToolResult 不归 sandbox |
| `L2-runtime` | runtime 调度 tools / member-service / sandbox 等执行能力 | 被依赖方 / 协作方 | 运行期 | 是 | runtime 消费 sandbox 执行能力和反馈材料,但 execution truth 不归 sandbox |
| `L2-member-service` | member-service 运行期依赖 L4 sandbox 和容器运行时 | 被依赖方 | 运行期 | 是 | member-service 需要 sandbox bind / execute 能力,但宿主生命周期不归 sandbox |
| `L5-runner` | runner 经正式边界运行期消费 `L4-sandbox` | 被依赖方 | 运行期 | 是 | Runner 应用运行需要隔离能力,但 Runner 产品 truth 不归 sandbox |
| `L1-artifact` | artifact 可能消费执行输出 / 候选材料引用;Artifact truth 归 artifact | 被依赖方 / 协作方 | 运行期 | 是 | sandbox capture 输出需要进入候选材料消费链,但 artifact 正文和血缘不归 sandbox |
| `L4-observability` | observability 通过 `L0-bus` 消费 tap / audit material | 被依赖方 / 协作方 | 事件协作 | 是 | sandbox 观测 hook 和 audit material 需要被观测仓消费,但 store truth 不归 sandbox |
| `L0-sdk` | SDK 封装 L1 / L2 / L3 / L4 API | 被依赖方 / 访问路径背景 | 运行期 | 否 | 当前不要求 sandbox 编译期或需求主链依赖 SDK;上层产品可经 SDK 或正式边界访问 |
| `L5-console` / `L5-chat` / `L5-sync` | L5 产品经 SDK 消费内部能力 | 被依赖方 | 运行期 | 否 | 不是 sandbox 当前核心闭环前置;若需展示或控制,应经 runner/observability/SDK 正式边界 |
| `L6-bridges` / `L6-marketplace` | 生态层经 SDK / public API 接入 | 被依赖方 | 运行期 | 否 | 外部平台接入不阻塞 sandbox 基础隔离能力 |
| 具体 Docker / gVisor / Firecracker / runc / containerd 产品 | 旧材料中的后端候选 | 后端候选 | 运行期 | 否 | 当前只保留抽象 isolation backend,具体后端由 01/04/07 裁定 |

### 6.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、typed refs、actor/context、trace、error、metadata 和安全材料契约 | 03 详细设计 / 07 实施计划 |
| 运行期依赖 | 容器 / k8s / isolation backend | 使用隔离承载能力创建、限制、捕获、停止、清理受控执行环境 | 01 架构 / 04 配置 / 07 实施计划 |
| 运行期输入 | `L1-identity`、`L1-work`、governance / capability / tools policy 来源 | 消费身份锚点、工作上下文引用和 launch/isolation policy,并在缺失时拒绝或降级 | 07 核心能力 / 10 规则 / 11 数据 / 12 接口 |
| 运行期输出 / 消费 | `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner` | 向工具、运行主线、成员宿主和 Runner 提供统一隔离执行能力、边界反馈和失败 / 清理材料 | 07 核心能力 / 08 用户故事 / 09 功能 / 12 接口 |
| 材料交接 / 运行期协作 | `L1-artifact` | 提供执行输出、候选材料和捕获材料引用语境,不决定正式制品 truth | 11 数据 / 12 接口 / 14 验收 |
| 事件协作依赖 | `L0-bus`、`L4-observability` | 发布或交接 sandbox 状态、audit / trace / metric material、失败和清理可观测材料 | 12 接口 / 13 NFR / 14 验收 / 05 测试 |

### 6.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L4-sandbox -> L2-tools` 编译期依赖 | 会把 ToolDefinition、ToolPolicy、ToolInvocationResult 和 ToolAuditEntry truth 引入 sandbox | tools 通过运行期边界消费 sandbox;策略 / 结果 truth 留在 tools |
| `L4-sandbox -> L2-runtime` 编译期依赖 | 会把 ExecutionInstance、agent loop、recover/checkpoint 和结果回流 truth 引入 sandbox | runtime 运行期调度 sandbox 并消费反馈材料 |
| `L4-sandbox -> L2-member-service` 编译期依赖 | 会把 MemberExecutionHost、SandboxBinding 装配结果和 host lifecycle 混入 sandbox | member-service 运行期绑定 / 释放 sandbox,装配 truth 自持 |
| `L4-sandbox -> L1-identity` 编译期依赖 | 会把 actor/member lifecycle 和身份正文耦合进基础设施仓 | 使用 `L0-core` shared refs 和运行期身份锚点解析 |
| `L4-sandbox -> L1-work` 编译期依赖 | 会把 Project、WorkItem、ImplementationPlan 等工作事实引入 sandbox | 使用 body-free project/work/context refs 或运行期查询边界 |
| `L4-sandbox -> L1-artifact` 编译期依赖 | 会让捕获输出直接耦合 artifact 正文、版本和血缘 truth | 通过输出 / 候选材料 refs 与 artifact 正式边界协作 |
| `L4-sandbox -> L4-observability` 编译期依赖 | 会让 sandbox 依赖观测存储和查询实现,破坏横切观测 no-write truth 边界 | 通过 `L0-bus`、observability hook 或 safe material handoff 协作 |
| `L4-sandbox -> L5-runner` 编译期依赖 | 会把 RunnerRun、run state、control entry 和产品体验 truth 引入基础设施仓 | Runner 经正式 service boundary / SDK 消费 sandbox |
| `L4-sandbox -> L0-sdk` 编译期依赖 | 全局基线未要求 L4-sandbox 依赖 SDK;SDK 是上层访问封装,不是 sandbox 内部契约来源 | sandbox 使用 `L0-core`;上层产品可经 SDK 访问正式边界 |
| `L4-sandbox -> Docker/gVisor/Firecracker/runc/containerd` 作为需求层固定依赖 | 会把后端产品选型提前固化,压过架构、配置和实施阶段裁剪 | Step 6 只写抽象 isolation backend;具体后端后续裁定 |
| `L4-sandbox` 直接依赖 UI / console / chat / bridge 源码 | 会让产品体验反向定义隔离基础 truth | 产品层经 runner、SDK、observability 或正式 API 消费 |

### 6.6 依赖裁剪图

#### 依赖裁剪图: L4-sandbox

```text
+------------------+       [compile]       +------------------+
| L0-core          +---------------------->| L4-sandbox       |
| shared contract  |                       | running isolation|
+------------------+                       +---------+--------+
                                                     ^
                                                     |
                       [runtime]                     | [event]
 container / k8s / isolation backend                 |
                       +-----------------------------+

Inputs to L4-sandbox
  L1-identity      -> [runtime refs] actor/member anchors
  L1-work          -> [runtime refs] project/work/context refs
  policy sources   -> [runtime] launch/isolation policy
  L0-bus           -> [event] sandbox event collaboration

Consumers / collaborators
  L2-tools          <- [runtime] isolated dangerous/restricted tool execution
  L2-runtime        <- [runtime] sandboxed execution capability and feedback material
  L2-member-service <- [runtime] sandbox bind/execute capability
  L5-runner         <- [runtime] isolated runner app execution
  L1-artifact       <- [runtime] captured output / candidate material refs
  L4-observability  <- [event] audit / trace / metric material
```

图示说明:

- 本图只展示 `L4-sandbox` 相关裁剪边,不复制 27 仓总矩阵。
- 只有 `[compile] L0-core` 可进入 package dependency;`[runtime]` 和 `[event]` 均不得写成源码依赖。
- 箭头表达依赖、消费或协作方向,不表达 API 调用顺序、事件传播顺序或核心能力闭环步骤。
- 具体 Docker/gVisor/Firecracker 等后端不在 Step 6 固化,统一归入 `container / k8s / isolation backend`。

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要依赖裁剪 ASCII 图 | yes | 本仓内部关系超过 3 个,且运行期 / 事件协作关系容易被误写成编译期依赖。 |
| 是否需要拆分附录 | no | 当前 Step 6 表格足以承载依赖裁剪;接口、事件和数据归属后置 Step 11/12。 |
| 是否纳入具体隔离后端 | no | 只纳入抽象 isolation backend;具体 Docker/gVisor/Firecracker/containerd/runc 后置。 |
| 是否把 `L0-sdk` 纳入主链 | no | 当前全局基线不要求 sandbox 依赖 SDK;SDK 是上层访问封装背景。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 6 的上游冲突;旧依赖冲突已作为 historical_material 处理。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 6 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

````md
## 6. 使用方与依赖

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从全局依赖基线、相邻仓边界和旧材料审计中裁剪当前依赖主链。

### 6.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、typed refs、actor/context、trace、error、metadata、安全材料和跨仓契约基础 | 是 | sandbox execution environment identity、错误分类、trace / actor 语境和跨仓引用无法稳定表达 |
| 输入 / 输出 | `L0-bus` | sandbox 事件协作主干,用于发布或消费受控执行状态、审计和维护材料 | 可观测 / 审计闭环是;最小本地隔离否 | 事件材料无法稳定交接给 observability、runtime 或下游消费方,但不得用本地日志替代正式事件协作 |
| 输入 | `L1-identity` | actor / member identity anchor,用于执行环境身份语境和责任链引用 | 场景前置 | 缺身份锚点时只能拒绝、降级或标记缺失,不得由 sandbox 创建身份 truth |
| 输入 | `L1-work` | project / work / context refs,用于执行上下文、工作对象和项目语境引用 | 场景前置 | 缺工作语境时无法形成完整责任链或上下文边界,不得保存 Project / WorkItem / ImplementationPlan 正文 |
| 输入 | governance / capability / tools policy 来源 | launch/isolation policy、allow/deny 语境、出网或高风险动作策略输入 | 安全策略场景是 | 策略缺失或不可解析时必须 fail closed 或标记缺失,不得由 sandbox 自行裁决 policy truth |
| 输出 | `L2-tools` | 为危险 / restricted / governed 工具提供隔离执行环境、边界反馈和失败材料 | 否,但 tools 危险执行场景是 | 工具高风险执行无法进入受控隔离路径;tools 不得补造 sandbox 结果或绕过隔离 |
| 输出 | `L2-runtime` | 提供被 runtime 调度的受控执行能力、隔离层结果和失败 / 清理语境 | 否,但 runtime 调度 sandbox 场景是 | runtime 动作调度缺少隔离执行能力或反馈材料,但 ExecutionInstance 和 recover truth 不归 sandbox |
| 输出 | `L2-member-service` | 提供 member host 执行前后需要绑定、释放和分类失败的 sandbox 能力 | 否,但成员受限动作执行场景是 | sandbox bind / execute 失败会阻断宿主受限动作;SandboxBinding 装配 truth 仍归 member-service |
| 输出 | `L5-runner` | 经正式边界提供 Runner 应用或 AI 产物运行所需隔离执行能力 | 否,但 runner 运行场景是 | Runner 无法形成受控运行体验;RunnerRun、run state、control entry 和 output preview 不归 sandbox |
| 输出 | `L1-artifact` | 提供执行输出、候选材料、捕获材料或 evidence-like refs 的来源语境 | 否 | Artifact 正式入库或版本化消费退化;artifact truth 不得由 sandbox 直接决定 |
| 输出 / 协作 | `L4-observability` | 提供 observability hook、audit / trace / metric material、失败和清理可观测材料 | 可观测 / 审计闭环是 | 观测、审计和排障材料不完整;observability store truth 不得反写 sandbox truth |

### 6.2 外部系统依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | 容器 / k8s / isolation backend | 承载隔离执行环境,提供进程、文件系统、网络、资源限制和生命周期控制的运行基础 | 是 | 无法创建真实受控执行环境,只能停留在需求 / fake / dry-run 语境 |

当前阶段不把 Docker、containerd、gVisor、Firecracker、runc、Kubernetes 发行版、对象存储、数据库、OTel 后端、日志平台、审计平台、密钥系统或外部 GRC 系统定为正式外部系统依赖。它们如需进入主链,必须在后续设计文档中重新裁剪。

### 6.3 依赖裁剪结论

`L4-sandbox` 当前唯一编译期依赖是 `L0-core`。`L0-bus`、`L1-identity`、`L1-work`、policy 来源、`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L4-observability` 和 isolation backend 都只能以运行期依赖、事件协作或材料交接方式表达,不得写成 package dependency。

#### 依赖裁剪图: L4-sandbox

```text
L0-core          -> [compile] L4-sandbox
isolation backend -> [runtime] L4-sandbox
L0-bus           -> [event]   L4-sandbox sandbox events

L1-identity / L1-work / policy sources
  -> [runtime] context refs and launch/isolation policy

L4-sandbox
  -> [runtime] L2-tools / L2-runtime / L2-member-service / L5-runner
  -> [runtime] L1-artifact captured output / candidate material refs
  -> [event]   L4-observability audit / trace / metric material
```

图示说明:
- 本图只展示 `L4-sandbox` 相关裁剪边,不复制全 27 仓矩阵。
- 只有 `[compile] L0-core` 可进入 package dependency;`[runtime]` 和 `[event]` 均不得写成源码依赖。
- 本图不表达 API 调用顺序、事件传播顺序或实现流程。
````

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓向谁提供能力 | pass | 已覆盖 `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L4-observability` 等消费 / 协作方。 |
| 是否明确本仓依赖谁的前置能力 | pass | 已明确 `L0-core`、isolation backend、`L0-bus`、identity/work/context refs 和 policy 来源。 |
| 是否区分内部仓依赖与外部系统依赖 | pass | 内部仓依赖表和外部系统依赖表已分开。 |
| 是否使用全局依赖裁剪固定表 | pass | 已输出依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图。 |
| 是否指出闭环前置和失效影响 | pass | `L0-core` 和 isolation backend 为强前置;`L0-bus`/observability、identity/work/policy 为场景或审计闭环前置。 |
| 是否没有把运行期 / 事件协作误写成编译期依赖 | pass | 除 `L0-core` 外均明确不得进入 package dependency。 |
| 是否没有写角色说明 | pass | Step 5 角色未重复为角色表,只作为依赖语境输入。 |
| 是否没有写接口、事件 payload、DTO 或实现组织 | pass | 未写 API path、trait、event kind、payload、repository、adapter、配置 key 或后端选择。 |
| 是否没有继承旧 SDK / 后端 / 性能 / 验收结论 | pass | 旧 `L0-sdk`、Docker/gVisor/Firecracker、SandboxService、事件名和指标均已后置或裁剪。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 7 | pass_wait_review | 技术上 Step 6 已完成;按用户要求等待审查确认后再进入 Step 7。 |

next_allowed_action: `wait_user_confirm_step_7`
