# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8  
> 书写规范：`standards/document/实施计划书写规范.md` §5.8  
> 上游输入：`projects/L5-runner/03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 及其对应 calibration  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §8  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 8` |
| `current_module` | `config_environment_external_dependencies` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_09` |
| `gate_reason` | 已按 SOP 明确配置来源、五类计划环境、编译期/运行期/事件协作依赖、fake/controlled/disabled 使用边界、六个 phase 与 18 个 boundary 的准备条件以及不可用处理；未把 profile、仓库目录、候选 manifest 或 controlled fake 写成 readiness。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_09_spikes_risks.md`；完成后停审 |

本 Step 只定义未来实施前或 phase/boundary 开始前如何检查配置、环境与依赖。以下路径、环境 ID、profile、adapter、fixture、脚本和目录均是计划合同或检查对象，不表示真实环境、实现仓、CI job、服务、artifact、report、run、evidence、verdict、signoff 或 readiness 已存在。

## 2. 本步输入、输出与非目标

### 2.1 输入基线

| 输入 | 本 Step 承接内容 | 使用限制 |
|---|---|---|
| `07` Step 3 | 实现仓、工具、依赖裁剪、脚本根和 evidence 路径的前置核验规则 | 不关闭任何未核验 blocker |
| `07` Step 5 | `PH-01`～`PH-06` 的依赖顺序和 phase boundary | 不新增 phase，不反向改变依赖方向 |
| `07` Step 6 | 18 个 `commit-ph-*` 的任务、门禁和允许/禁止范围 | 只为 boundary 增加准备条件，不改变其功能范围 |
| `07` Step 7 | 12 suite、18 CUT/slot、失败分类、same-run artifact/report/evidence 合同 | planned 仍不等 executed/pass |
| `03-详细设计.md` §3/§5/§7/§10/§13/§15 | 七个逻辑模块、semantic port、UoW/幂等、依赖类型、配置读取点和测试切口 | 不补物理 backend、SDK method 或 owner DTO |
| `04-配置设计.md` §3～§13 | 七域配置、四 profile、strict source、builder/readiness、变更/失效/回滚 | 不把 profile 或 configured/enabled/ready 变成环境健康结论 |
| `05_test_plan_step_08_environment_config.md` | 环境 ID、数据分配、profile 语义、P0 fake/controlled 边界 | 不把测试方案的环境合同写成已创建环境 |
| 全局依赖与目录规范 | compile/runtime/event 分类、实现仓命名和 path dependency 规则 | 不从规范推断 Runner 技术栈 |

### 2.2 输出

- 外部依赖准备表，逐项给出类型、提供方、阶段、检查方式和不可用处理。
- 配置与环境检查表，覆盖 strict document、四 profile、七配置域、stores、bindings、limits、redaction、determinism 和 features。
- 编译期、运行期、事件协作、内部运行期、证据工具依赖分类及其 readiness 状态。
- fake / mock / controlled / disabled adapter 的允许范围、语义要求和禁止升级路径。
- 六个 phase、18 个 boundary 的依赖准备映射。
- fail-fast、blocked、not_run、negative lane、waiting 和重开条件。

### 2.3 非目标

- 不创建 `/home/aris/Projects/quantalithos-runner`，不修改任何 sibling 实现仓，不创建 manifest、源码、脚本、fixture、CI 配置或运行目录。
- 不选择 Rust/其他语言、GUI/CLI shell、process model、packaging、数据库/cache/backend、锁、迁移、容器或虚拟化产品。
- 不写具体 SDK client、package、method、endpoint、topic、transport、协议版本、算法、OS 命令或生产数值。
- 不把 `integration-pending`、`product-pending`、`ENV-RUN-*` 或 `configured/enabled/ready` 标签解释为外部服务或产品 readiness。
- 不允许 fake、历史 README、旧技术选择或本地日志替代 Artifact/Governance/Sandbox/Runtime/Observability truth。

## 3. SOP 问题回答

| SOP 问题 | 收口回答 |
|---|---|
| 哪些外部服务或仓是实施前置依赖？ | 目标 Runner 实现仓、获 authority 的共享契约/SDK surface、strict config/fixture harness、artifact/report 根和未来测试工具是 PH-01 前置检查对象；Artifact、Governance、Work/Workspace、Runtime、Sandbox、Observability、Archive、平台和事件面是按 phase 启用的运行期/引用/事件依赖，不得隐含在任务中。 |
| 哪些依赖只在特定阶段需要？ | PH-01 需要仓/authority/config/path/tool 检查；PH-02 需要 context、selection、material、authority/integrity 的 semantic slots；PH-03 需要 Sandbox/Runtime/platform 的 request/control/readback/cleanup slots；PH-04 需要 safe diagnosis/redaction/handoff/read sections；PH-05 需要 header-only Consumer、local-only Job、report/check capability；PH-06 才能在 authority、baseline、fixed run 和环境到达后尝试 selected integration/release handoff。 |
| 哪些配置必须在本地或 CI 准备？ | 一份完整、显式、不可变的 strict JSON document，以及 `runtime`、`stores`、`bindings`、`limits`、`observability`、`determinism`、`features` 七域的必需 ref/策略；`test-deterministic` 还需显式 fixture、clock、id、digest 和 fake registry。不存在隐式 profile、leaf override、`latest`、环境变量覆盖或 last-known-good fallback。 |
| 是否允许 fake/mock？ | 允许 semantic fake、controlled failure、disabled slot 和脱敏 fixture 作为 P0 负向/语义验证；只允许 `test-deterministic` 使用正向 fake outcome。fake 必须保留版本、UoW、幂等、状态轴、redaction、no-write、header-first/no-ACK、Job no-repair 和 Unknown/no-replay 语义；不得冒充真实 owner、产品、跨仓或 release 证据。 |
| 外部依赖不可用时暂停、降级还是替代？ | 核心装配、strict config、必需 local guarantee、工具链或 required scanner 缺失时 fail-fast/blocked；预期 controlled unavailable 只进入明确负向 lane，并断言 typed `Blocked/Unsupported/Unavailable/Unknown` 和零危险副作用；意外环境故障标 `not_run/blocked`，不改写为通过；真实正向 seam 未闭合保持 `waiting/blocked`，不以 fake fallback 替代。 |
| 哪些依赖需要其他团队或仓提供？ | L0-core/L0-sdk 的正式 surface、Artifact Release consumption、Governance approval/baseline、Work/Workspace context、Runtime safe read、Sandbox request/control/cleanup、Observability safe diagnosis/handoff、Archive reference、平台资源和正式事件/Consumer seam 由各自 owner 提供；Runner 只消费 public SDK/API/semantic adapter/ref，不复制或修改 owner truth。 |
| 已实现仓库是否存在？ | 只做了只读目录核对：`/home/aris/Projects/quantalithos-core`、`quantalithos-sdk`、`quantalithos-governance`、`quantalithos-work` 当前可见；目标 `/home/aris/Projects/quantalithos-runner` 不存在。可见 sibling 目录或其 manifest 不等于 Runner-facing seam、authority、版本或 readiness 已核验。 |
| 哪些依赖可成为编译期 path dependency？ | 只有正式 authority 确认的共享契约/官方 SDK package 才可进入未来实现仓的 compile candidate；当前 exact Runner-facing package、version、export、error/redaction/trace surface 尚未核验（`RUN-UP-008`），因此本 Step 不写具体 `Cargo.toml` 或 package 行。所有 owner/service/event 协作保持 runtime、ref、adapter 或 event 类型。 |
| 如何检查运行期/事件协作依赖？ | 通过 public API/SDK、typed semantic adapter、safe ref/view、header-first fixture 和受控 availability marker 检查；不直连 sibling DB、内部 topic/group、私有实现、PID/端口/日志或 owner cursor。Runner outbound event/outbox/publisher/topic 仍为 0。 |

## 4. 当前文档问题诊断、改动前后与设计取舍

### 4.1 问题诊断

| 诊断项 | 风险 | Step 8 处理 |
|---|---|---|
| 依赖散落在 01/03/04/05 | 实施者可能把运行期依赖误写成 sibling path dependency | 用依赖类型表和逐阶段检查表集中显式列出 |
| profile 与环境容易混淆 | `integration-pending` 或 `product-pending` 被当作 ready | 分离 profile、environment、slot readiness 和 owner authority |
| fake 的语义边界不够可执行 | fake 可能跳过 UoW、幂等、状态或安全门禁 | 规定 fake 必须保留语义，且区分 negative lane 与 positive evidence |
| 目标实现仓不存在、技术栈未定 | 计划可能提前写真实命令/路径 | PH-01 保持 blocked，不写 package、文件或命令实现 |
| 外部不可用处理不统一 | blocked/not_run 被汇总为 pass，或错误 fallback | 固定 fail-fast、negative、blocked、not_run 和 waiting 分类 |
| 证据根与环境清理责任分散 | 跨 run 拼接、静态 evidence 或残留状态 | 承接 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 run-scoped cleanup 合同 |

### 4.2 改动前后对比

| 项 | 之前 | Step 8 后 |
|---|---|---|
| 外部依赖 | 在架构/详细/测试中分别描述 | 单表按 compile/runtime/event/internal/tool/ref 分类并绑定 provider、phase、检查和失败动作 |
| 配置准备 | 04 有完整配置真相，但实施者需自行抽取 | 只抽取实施前/阶段前必查项，保持 strict whole-document 和七域边界 |
| 环境准备 | 05 有 profile/环境合同，07 尚未绑定 phase/boundary | 五个环境 ID、四 profile、六 phase、18 boundary 逐级绑定，实例仍 not_created |
| fake/mock | 允许范围分散 | 规定 semantic preservation、profile isolation、negative/controlled 使用边界和禁止升级 |
| 不可用处理 | 可能被临场判断 | 固定 fail-fast、blocked、not_run、negative lane、waiting、reopen owner |

### 4.3 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 所有 sibling 仓都做 path dependency | 类型可直接引用 | 违反全局依赖分类，耦合私有实现 | 不采用 |
| 仅把已存在目录视为可用依赖 | 表面检查简单 | 目录存在不代表 public seam、版本、权限或 readiness | 不采用 |
| P0 全部接真实服务 | 贴近产品 | 当前 owner seam、环境和 GRC 未闭合，阻塞语义验证 | 不采用 |
| P0 使用显式 semantic fake/controlled negative | 可复现并覆盖 fail-closed 语义 | 不能证明真实 integration/release | 采用；真实正向 lane 保持 blocked |
| profile 同时承担环境健康 | 文档较短 | 把配置身份误当 runtime readiness | 不采用；profile/environment/slot readiness 分离 |
| 让脚本自动把 unavailable 当 N/A | 易于绿色汇总 | 隐藏依赖缺失 | 不采用；只允许设计明确的 planned N/A，其余 blocked/not_run |

## 5. 结构化中间产物

### 5.1 依赖分类总则

| 类别 | 含义 | Runner 允许方式 | 当前结论 |
|---|---|---|---|
| 编译期 | 代码直接消费正式共享 package/type/trait/DTO/error | 仅经 authority 认可的 package/path/workspace 或后置 private revision；未核验不得写实现依赖 | `L0-core`、`L0-sdk` 为 candidate；`RUN-UP-008` 保持 pending |
| 运行期 | 运行时消费 owner/service/platform 能力 | SDK/API、semantic port/adapter、safe ref/view、controlled fake | Artifact/Governance/Sandbox/Runtime/Obs/Archive/Work/Workspace/平台均属此类或 ref 子类 |
| 事件协作 | 通过正式 bus/Consumer 面收取协作输入 | header-first、公开 event contract、safe receipt；不得直连 topic/group | Runner outbound event=0；Consumer positive path reserved/blocked |
| 内部运行期 | Runner 自有 store/cache/UoW/clock/id/digest/operations 能力 | logical port + future selected backend；test fake 需保留语义 | physical backend/locking/migration 未定，`RUN-DDD-003` blocked |
| 工具/证据 | 构建、扫描、报告和证据目录能力 | authority-approved tool、显式 run/root/profile、same-run pairing | 实现仓/工具链/实例未创建 |

### 5.2 外部依赖准备表

“当前状态”只描述设计/只读核对，不等于依赖已可用于正向运行。

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式（未来） | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-runner` | implementation repo | 不适用/实施前置 | PH-01～PH-06 | Runner 项目 authority | 目录、git worktree、manifest、目标仓 baseline 和用户改动核验 | `RUN-DDD-001`；停止实现移交，保持所有 boundary blocked |
| `L0-core` shared contracts | compile candidate | 编译期 | PH-01 起 | L0-core owner | authority、package/export/version、目标仓依赖图和 public type 逐项核验；不可先写 path | 缺失或不匹配则 compile-dependent lane blocked；不复制 shadow type |
| `L0-sdk` official access surface | compile/runtime candidate | 编译期 + 运行期 | PH-01、02-c、03-b、04-b、06-a | L0-sdk owner | Runner-facing client、版本、error/redaction/trace/export、兼容矩阵和 SDK boundary scan | `RUN-UP-008`；相关 lane `blocked/not_run`，不得猜 method 或绕过 SDK |
| `L1-artifact` Release consumption | runtime/ref | 运行期 | PH-02、PH-06 | Artifact owner | approved/baselined Release ref、locator/transport、integrity manifest/digest/signature、revoke/expire public contract | `RUN-UP-001`；selection/acquisition/positive integration blocked；不读内部表或本地批准 |
| `L1-governance` approval/baseline | runtime/ref | 运行期 | PH-02、PH-06 | Governance owner | version/baseline、approval scope/expiry/revoke/conflict、safe read/error contract | `RUN-UP-002`；资格为 Pending/Blocked/Unknown；不得用历史 approval 放行 |
| `L1-work` context/project/work ref | runtime/ref | 运行期 | PH-02～PH-04 | Work owner | trusted context/scope/visibility public read surface | seam 未闭合则 Restricted/Blocked；不复制 Project/Work truth |
| `L1-workspace` safe workspace view | runtime/ref | 运行期 | PH-02、PH-04、PH-06 | Workspace owner | current visibility/source/generation safe view contract | unavailable 则 query safe view Restricted/Unknown；不把本地 selection 当 workspace truth |
| `L2-runtime` status/result read | runtime | 运行期 | PH-03、PH-04、PH-06 | Runtime owner | safe status/result ref、freshness、stale/unknown/recovery contract | `RUN-UP-004`；保持 Unknown/RecoveryCase；不以 PID/port/log 推导 outcome |
| `L4-sandbox` request/control/cleanup | runtime | 运行期 | PH-03、PH-06 | Sandbox owner | request idempotency、active lease、control/cleanup/readback/orphan/reaper public seam | `RUN-UP-003`；Accepted/Confirmed 不升级；正向 lane blocked；不编译/复用私有 backend |
| host/platform resources | runtime | 运行期 | PH-03、PH-06 | platform/host authority | port/resource conflict/unknown taxonomy、allocation/cleanup responsibility and cross-platform contract | `RUN-UP-007`；Unknown/Conflict/Blocked；不固定 OS 命令、PID、port 或抢占事实 |
| `L4-observability` safe diagnosis/handoff | runtime/ref | 运行期 | PH-04、PH-06 | Observability owner | bounded diagnostic DTO、visibility/freshness/redaction/handoff receipt contract | `RUN-UP-005`；diagnosis/handoff Blocked/Degraded；local log 不升为 audit/evidence |
| `L4-archive` reference | runtime/ref | 运行期外围 | PH-04、PH-06 | Archive owner | safe reference/visibility/restore boundary、peripheral failure semantics | `RUN-UP-006`；Archive path Blocked，不影响 core run/cleanup success |
| `L0-bus` / planned Consumer seam | event collaboration | 事件协作 | PH-05、PH-06 | Bus/owner event authority | header/schema/version/dedup/receipt contract，经 SDK/formal Consumer surface 验证 | unavailable 或未授权时仅 header-first Blocked/Unsupported；不 parse/hash/store/ACK |
| local state store / cache / UoW | internal runtime | 内部运行期 | PH-01～PH-05 | Runner infra authority（未定） | capability guarantees、version/atomicity/locking/migration/corruption and restart semantics | `RUN-DDD-003`；builder Blocked；不得用 in-memory fallback冒充 product durable |
| deterministic clock/id/digest/fixture registry | test dependency | 内部测试运行期 | PH-01～PH-05 | test harness authority | explicit refs、repeatability、profile isolation、canonicalization contract | test assembly fail-fast；mutation blocked；不从 wall clock/PID/random fallback |
| redaction/scanner policy | tool/security dependency | 工具/安全 | PH-01、PH-04～PH-06 | security/Obs authority | forbidden-field corpus、scanner availability、safe output and report check | scanner/policy 缺失为 blocked/VETO 候选；不得 raw fallback |
| `artifacts/test/<run_id>` and `reports/...` roots | evidence/tool dependency | 证据工具 | PH-01、PH-05、PH-06 | implementation/test authority | explicit run/root/profile validation、write permission、same-run pairing、cleanup journal | gate/report blocked；不得换 `latest` 或跨 run 拼接 |
| approved build/test/report toolchain | tool | 不适用/编译测试 | PH-01～PH-06 | future technical authority | authority-approved tool identity/version and command contract | `RUN-DDD-002`；不执行，不用 README 历史命令替代 |
| product/GRC/release environment | runtime/handoff | 运行期/外部交接 | PH-06 | product/operations/GRC authority | approved artifact/provider/environment、baseline、fixed run、review role and retention | `RUN-OPS-001~002`；selected lane blocked/not_run；不生成 release evidence/verdict |

### 5.3 配置与环境检查表

| 检查项 | 适用阶段/环境 | 通过条件 | 失败处理 |
|---|---|---|---|
| strict source document | PH-01 起；所有 profile | 单一完整 document、closed schema、显式 schema/profile/config identity；无 comments/trailing/duplicate/unknown field | whole-document reject/fail-fast；不采用部分解析或旧文档 |
| profile selector | PH-01 起 | 只允许 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending`；一次只选择完整 document | unknown/missing/mismatch fail-fast；禁止 `latest`、默认值、leaf override、hot reload、LKG |
| `runtime` domain | PH-01 起 | profile、schema、document identity 与 source family 一致 | assembly fail-fast；profile 不等外部健康 |
| `stores` domain | PH-01～PH-05 | local truth/projection/result/operations/cache logical refs 和 required guarantees 可定位 | core guarantee 不足 builder Blocked；不降级到 product in-memory |
| `bindings` domain | PH-01～PH-06 | closed slot set、唯一 opaque `bindingRef`、profile/family compatible；configured/enabled/ready 分开 | duplicate/unknown/invalid reject；unready slot per-capability Blocked |
| `limits` domain | PH-01～PH-05 | finite、正数、static hard cap 内并有 authority；run-local 只能收紧 | zero/overflow/unknown/越界 reject 或当前 entry/Job Blocked；不抄 demo 数值 |
| `observability` domain | PH-01、PH-04～PH-06 | mandatory redaction、safe diagnostic/handoff ref 与输出策略可验证 | redaction failure/no policy → no visible content、handoff Blocked/VETO |
| `determinism` domain | PH-01～PH-05 | test profile 显式 fixed clock/id/digest/fixture；非 test 不注入 test fake | fixture/provider 缺失 fail-fast；mutation Blocked；不使用时间/PID/path fallback |
| `features` domain | PH-01～PH-06 | feature 只表达外围请求，默认安全关闭；required contract/ref/readiness 独立 | invalid pair reject 或 peripheral Blocked；不得启用 reserved Consumer/outbound event |
| source/resolver material | PH-02、PH-06 | opaque ref 解析在授权 provider/adapter 内完成，material 不进入 config/log/report | provider unavailable → Blocked/Unknown；不记录 URL/path/token/body |
| artifact/report roots | PH-01、PH-05、PH-06 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 及 review roots 由显式参数定位 | 权限/配对/cleanup 失败 → gate blocked/incomplete；不产生静态证据 |
| environment identity | 所有环境 | environment ID、profile、run identity、source/config digest 和 cleanup scope 相互一致 | mismatch fail-fast；不把另一个 profile/run 的结果复用 |

### 5.4 正式 profile 与环境角色

| 环境 ID | profile | 允许证明的范围 | 允许替身 | 必须保持 blocked/pending |
|---|---|---|---|---|
| `ENV-RUN-LOCAL-SAFE` | `local-safe` | schema、entry、safe view、blocked UX、单用例语义 | local logical store、semantic fake、controlled negative | Artifact/Governance/Sandbox/Runtime/Obs/Archive 正向、durable/release readiness |
| `ENV-RUN-CI-DETERMINISTIC` | `test-deterministic` | Contract/Domain/Service/UoW/幂等/安全扫描和 P0 fake 集 | explicit fixture registry、fixed clock/id/digest、fake stores/ports、write spies | 真实 owner outcome、Consumer positive apply、durable crash parity、生产 SLO |
| `ENV-RUN-INTEGRATION-CONTROLLED` | `integration-pending` | 获授权 slot 的 controlled adapter、entry/worker/Job unavailable/degraded 映射 | 逐 slot controlled adapter、受控故障向量 | 未闭合 `RUN-UP-001~008` 的正向 path、真实 transport/lease/platform allocation |
| `ENV-RUN-OPERATIONS-REPLAY` | `integration-pending` | 脱敏 receipt/report/projection/recovery 的只读重放和报告生成边界 | safe snapshot、receipt/report fixture、read-only replay adapter | owner repair、自动 replay/resend/reclaim、raw payload、正式 evidence |
| `ENV-RUN-PRODUCT-REHEARSAL` | `product-pending` | 未来 selected product/cross-platform/release rehearsal | 仅 approved public SDK/API 和正式平台 seam | 当前无 approved provider/environment/baseline；不得用 P0 fake 代替 |

共同规则：profile 是配置身份，不是环境；environment 是运行承载，不是 owner truth；slot readiness 不是整体 readiness；`configured ≠ enabled ≠ ready`；`Complete ≠ Verified ≠ Qualified`；`Accepted ≠ Running`；`Confirmed ≠ Cleaned`；local record/log/report/handoff receipt 不是 formal evidence/audit/verdict。

### 5.5 Fake / mock / controlled / disabled 使用边界

| seam | `local-safe` | `test-deterministic` | `integration-pending` | `product-pending` | 共同禁止 |
|---|---|---|---|---|---|
| local repository/UoW/result/idempotency | logical/blocked 或诊断 fake | 可用 semantic fake，需保留 version/UoW/duplicate/commit-unknown | 仅获 authority 的 controlled/durable-like slot | formal durable only | 不能把 in-memory 变成 product durable，不能跳过 transaction/atomicity |
| Artifact/Governance/source/verifier | disabled/blocked 或 negative fake | controlled vectors、无 body 的 semantic outcome | 仅正式 public slot | formal only | 不返回真实 Release/approval 正文，不本地批准/验证 |
| Sandbox/Runtime/platform | blocked/Unknown | typed fake outcomes、conflict/unknown/timeout vectors | formal controlled slot | formal public seam | 不使用 Docker/gVisor/Firecracker/private backend，不用 ACK/PID/port 推导状态 |
| Observability/redaction/handoff | mandatory redaction fake 或 blocked | forbidden-field corpus + safe sink fake | controlled safe sink | formal provider | 不 raw fallback、不把 handoff receipt 当 evidence |
| Consumer | registration/header-only negative | unsupported/rejected/quarantined/strict duplicate vectors | authorized envelope only | formal transport only | 不 parse payload/hash/store/ACK/cursor；Runner outbound event=0 |
| Job | explicit local claim/checkpoint fake | five Job semantic/fault/replay cases | controlled read seam | formal operations authority | 不 owner repair、reclaim、自动 replay/resume，不把 report 当业务 truth |
| Archive | disabled/peripheral blocked | safe reference fixture | controlled reference | formal reference | 不参与 run/cleanup success，不保存 Archive truth |

Fake 可计入的唯一结论是它所覆盖的 semantic/negative assertion；不得计入真实跨仓 integration、产品运行、release evidence、owner approval、Sandbox isolation 或 readiness。

### 5.6 六个 phase 的依赖准备矩阵

| Phase | 开工前必须检查 | 可后置 | 缺失时处理 |
|---|---|---|---|
| `PH-01` 仓、配置、测试与证据前置 | target repo、技术 authority、compile candidate 核验、strict config、fixture/scan policy、script/artifact/report roots、git/worktree 规则 | owner positive adapter、durable backend、真实 transport | 任一核心前置缺失 → phase blocked；不写业务代码/实例 |
| `PH-02` Context、选择与材料资格 | context/workspace safe read、explicit immutable selector、Artifact/Governance semantic slots、integrity/source/cache logical refs、deterministic test profile | Sandbox/Runtime control、Consumer/Job positive | owner seam 缺失 → negative/blocked lane；不得进入 qualified/positive run |
| `PH-03` 请求、控制、资源与恢复 | Sandbox request/control/cleanup contract、Runtime readback、platform conflict taxonomy、ProtectionGuard、local UoW/idempotency/RecoveryCase guarantees | Observability handoff、Consumer payload、final report | positive seam 或 store guarantee 缺失 → controlled negative only，正向 blocked |
| `PH-04` 预览、诊断、交接与 Query | safe view/source/freshness/visibility、redaction policy、Observability handoff contract、committed read sections、no-write scanner | Consumer/Job automation、release evidence | safe DTO/redaction/store 缺失 → restricted/blocked；Query 不得写入 |
| `PH-05` Consumer、Job、自动化与报告 | header/schema allowlist、receipt store、local Job claim/checkpoint/report、replay root、same-run script/check/report capability、event-zero scanner | real transport/scheduler、formal evidence/release | transport/job/tool authority 缺失 → header-negative/local semantic lane；不可宣称 positive |
| `PH-06` selected integration/release/handoff | owner public seams、approved config/provider、immutable baseline、fixed run、environment/GRC/review authority、all required checks | 后续 product hardening | 任一缺失 → `baseline_blocked/not_run`；不生成 handoff/verdict/readiness |

### 5.7 18 个 commit boundary 的依赖准备矩阵

| Boundary | 必查依赖/配置 | 主要检查 | 不可用处理 |
|---|---|---|---|
| `commit-ph-01-a` | target repo、技术 authority、L0-core/L0-sdk candidate 分类 | path/dependency/manifest scope review（不写具体 path） | `RUN-DDD-001/002` 或 exact surface 缺失 → blocked |
| `commit-ph-01-b` | strict config、四 profile、fixture、artifact/report roots、redaction/event-zero contract | schema/profile/pairing/redaction static review | fail-fast；不进入 PH-02 |
| `commit-ph-02-a` | context/workspace read、selection refs、generation/id rules | explicit selector、generation、scope negative | owner read unavailable → Restricted/Blocked；不 qualified |
| `commit-ph-02-b` | source/integrity/cache logical slots、local UoW/result/idempotency | Complete/Verified/Qualified separation、duplicate/version | verifier/cache/store unavailable → blocked；不下载/放行 |
| `commit-ph-02-c` | L0-sdk/public semantic adapter、authority/source/verifier availability | SDK boundary、Query no-write、cache-as-authority veto | `RUN-UP-001/002/008` → blocked/not_run；禁 private fallback |
| `commit-ph-03-a` | run/control/resource/guard config、platform observation | state/guard/resource conflict | platform/Sandbox/Runtime read unavailable → Unknown/Conflict/Blocked |
| `commit-ph-03-b` | Sandbox/Runtime/platform adapter outcome、UoW、idempotency/result store | intent→effect→readback/unknown→commit | positive seam/store unavailable → controlled negative only |
| `commit-ph-03-c` | RecoveryCase/manual review、readback basis、replay/cleanup policy | freeze/no-replay/manual review | readback/lease/orphan unavailable → RecoveryCase/blocked；不自动重试 |
| `commit-ph-03-d` | C07～C10 service、Q06～Q08 safe read、local store | service/query no-write and result mapping | store/entry authority missing → blocked；不生成 running/cleaned |
| `commit-ph-04-a` | safe view schema、visibility/freshness/source、redaction policy | forbidden-field construction and bounded view | safe field/redaction missing → no visible content/blocked |
| `commit-ph-04-b` | Observability diagnosis/handoff semantic slot、redaction sink、C11/Q09～Q11 | source/freshness/unknown/no-resend | `RUN-UP-005` → diagnosis/handoff blocked；local log not evidence |
| `commit-ph-04-c` | committed read section/projection identity、Q12 composer、no-write scanner | generation/identity/read-only call graph | physical read store/scanner unavailable → blocked/not_run |
| `commit-ph-05-a` | Consumer header/schema/dedup/receipt store、event-zero policy | header-first, no-payload/no-ACK/no-cursor | transport contract missing → negative blocked/unsupported; no positive |
| `commit-ph-05-b` | Job DTO、claim/checkpoint/report/idempotency store | local report/replay and terminal mapping | job store/runner authority missing → blocked；不 repair owner |
| `commit-ph-05-c` | five Job local runner inputs、generation/claim guards、replay root | claim/checkpoint/no-repair/no-replay | durable/scheduler unavailable → planned/blocked；不抢占/重放 |
| `commit-ph-05-d` | gate/check/report generators、same-run paths、event-zero/redaction/link/pairing checks | script capability and path contract | tool/scanner unavailable → gate blocked；不写静态 EV |
| `commit-ph-06-a` | approved public adapter、config/provider、baseline、fixed run、selected environment | preflight, authority, scope, dependency readiness | any missing → `baseline_blocked/not_run`; no selected run |
| `commit-ph-06-b` | same-run raw/report/check, evidence pairing, VETO/link/cleanup, review role | evidence/handoff package completeness | missing pair/review/check → incomplete/blocked；不 verdict/signoff |

### 5.8 配置/环境不可用处理矩阵

| 情况 | 分类 | 必须动作 | 是否可计入通过 |
|---|---|---|---|
| target Runner repo、manifest 或 authority 不存在 | implementation prerequisite | 停止 PH-01；记录 blocker，等待外部仓/authority | 否 |
| compile candidate package/export/version 未核验 | compile prerequisite | 不写依赖、不复制 shadow；相关 suite blocked/not_run | 否 |
| strict document 缺失、解析失败、unknown/duplicate/profile mismatch | config assembly failure | whole-document fail-fast；不 fallback/default/LKG | 否 |
| required local store/UoW/version/atomicity guarantee 不足 | core readiness failure | builder Blocked，不暴露半 facade；保留 issue | 否；仅专门负向断言可在真实执行后计入 |
| `test-deterministic` fixture/clock/id/digest 缺失 | deterministic test failure | test assembly fail-fast；不改成 local-safe | 否 |
| 预期 controlled adapter 返回 unavailable/unsupported/unknown | planned negative input | 断言 typed disposition、零危险副作用和正确 local posture | 仅该负向用例可计入 |
| 非预期 service、fixture、scanner、harness 崩溃 | environment failure | suite/TC `not_run/blocked`；保留原始原因 | 否 |
| Consumer schema/transport 未授权 | upstream contract blocker | 只做 header-first Blocked/Unsupported/Rejected/Quarantined；不 parse/hash/ACK | 仅明确 negative lane |
| Sandbox/Runtime/platform positive seam 不可用 | selected integration unavailable | Accepted/Confirmed 不升级，进入 Unknown/RecoveryCase 或 blocked | 否 |
| Observability/redaction policy/sink 不可用 | security failure | 不输出 raw 内容；diagnosis/handoff blocked；VETO 候选 | 否 |
| Archive ref 不可用 | peripheral dependency failure | Archive path Blocked；core run/cleanup 不变 | 仅 Archive disabled/negative 边界 |
| artifact/report root、same-run pair 或 cleanup journal 缺失 | evidence/tool failure | gate blocked/incomplete；不生成 EV/handoff | 否 |
| product/GRC/baseline/fixed run/review authority 缺失 | release prerequisite | PH-06 `baseline_blocked/not_run`；不生成 verdict/signoff/readiness | 否 |

### 5.9 Phase/boundary 结果状态纪律

```text
assembly prerequisite missing  -> fail-fast / blocked
expected controlled fault     -> negative assertion only
unexpected environment fault  -> not_run / blocked
positive owner seam pending   -> waiting / blocked
required evidence pair missing-> incomplete / VETO candidate
design contract conflict      -> wait_design; 回写 truth source 后重审
```

任何聚合脚本或人工 review 都不得把 `blocked`、`not_run`、`timeout`、`flaky`、`incomplete`、scanner unavailable 或 cleanup failure 压成 `pass`。新的 run 必须保留 predecessor 与 blocker，不覆盖旧状态，不跨 run 拼 evidence。

## 6. 跨配置、环境与依赖审计

| 审计项 | 结论 | 依据/修正 |
|---|---|---|
| 外部依赖是否逐项列出 provider、类型、phase、检查和失败动作 | `pass`（设计层） | §5.2 逐项列出；没有把依赖隐含在任务里 |
| compile/runtime/event/internal/tool 类型是否分离 | `pass` | §5.1～§5.2；运行期/事件协作不写成 path dependency |
| 是否从目录存在推断 readiness | `pass` | 只记录只读可见性；目标 Runner 仍 absent，owner seam 仍 blocked/pending |
| 是否写死语言、命令、package、endpoint、topic、OS 技术 | `pass` | 仅保留 authority 检查；未关闭 `RUN-DDD-002`/`RUN-UP-008` |
| 四 profile 是否与 04 完全一致 | `pass` | 仅 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending` |
| 七配置域是否完整且没有新增 truth | `pass` | `runtime/stores/bindings/limits/observability/determinism/features` |
| fake 是否会冒充真实 positive evidence | `pass` | §5.5 限定 semantic/negative；真实 positive lane 仍 blocked |
| 六 phase 与 18 boundary 的准备条件是否与 Step 5～7 冲突 | `pass` | §5.6～§5.7 只增加前置检查和失败动作，不改变范围/顺序 |
| `latest`、leaf override、hot reload、LKG fallback 是否被禁止 | `pass` | §5.3、§5.4；整份 document/new assembly |
| Consumer/Query/Job/event-zero 红线是否保留 | `pass` | §5.5、§5.7；no payload/no ACK、no-write、no owner repair、outbound=0 |
| evidence/report 是否 same-run 且与 environment/profile 绑定 | `pass`（计划） | explicit run/root/profile、pairing/link/cleanup；实例未创建 |
| 当前是否产生实现、测试或 readiness 事实 | `pass` | 无实现仓目标、代码、fixture 实例、run、artifact/report/evidence/verdict/signoff/readiness |

## 7. 回填草稿（未来正式 `07-实施计划.md` §8）

正式 §8 应保留以下最小结构，不复制 `04` 全量配置项：

1. **实施前置依赖**：目标仓、共享契约/SDK candidate、工具 authority、strict config、fixture/scanner、artifact/report roots；明确当前 `RUN-DDD-001~003`、`RUN-UP-008` 和 `RUN-DOC-003` 状态。
2. **外部依赖准备表**：承接 §5.2，保留依赖类型、提供方、使用 phase、检查和不可用动作；禁止用目录存在替代 public seam。
3. **配置与环境检查表**：承接 §5.3～§5.4，明确四 profile、五环境 ID、七域和 `configured/enabled/ready` 分离。
4. **fake/controlled/disabled 边界**：承接 §5.5，说明 P0 semantic negative 允许范围、语义保持要求和不得升级为产品/release 证据的限制。
5. **phase/boundary 准备矩阵**：承接 §5.6～§5.7，绑定六 phase、18 boundary 的依赖检查和失败动作。
6. **不可用处理与事实边界**：承接 §5.8～§5.9；明确 fail-fast、blocked、not_run、negative lane、waiting、incomplete、VETO candidate 和不伪造执行事实。

正式 §8 仍不得创建环境、目录、脚本、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 8. 待确认事项、持续 blocker 与重开触发

| blocker/待确认 | 影响 | 当前状态 | 重开动作 |
|---|---|---|---|
| `RUN-DDD-001` 目标 Runner 仓不存在 | 无法核验 manifest、工具、物理 layout、测试 runner | blocked | 仓到达后重开 PH-01/`commit-ph-01-a`，先做 authority/path/dependency gate |
| `RUN-DDD-002` 语言/runtime/shell/process/packaging 未定 | 无法写真实命令、package、目录和 toolchain | blocked | authority 到达后重开 Step 3/8/11，刷新 boundary checks |
| `RUN-DDD-003` local store/cache/locking/migration/atomicity 未定 | PH-01～PH-05 durable/readiness 无法证明 | blocked | persistence authority 到达后重开 `01-b`、`02-b`、`03-b/d`、`05-b/c` |
| `RUN-UP-001~002` Artifact/Governance positive seam 未闭合 | selection/material qualification、PH-06 positive lane 阻塞 | blocked | owner public contract 到达后重开 `02-c`、`06-a/b` |
| `RUN-UP-003~004/007` Sandbox/Runtime/platform seam 未闭合 | run/control/resource/cleanup positive lane 阻塞 | blocked | request/lease/readback/cleanup 合同到达后重开 PH-03/06 |
| `RUN-UP-005~006` Observability/Archive seam 未闭合 | diagnosis/handoff/archive reference 正向 lane 阻塞 | blocked | safe DTO/ref/handoff contract 到达后重开 PH-04/06 |
| `RUN-UP-008` L0-sdk exact surface 未核验 | compile/runtime adapter mapping 不能落定 | pending | exact package/client/error/redaction/trace 到达后重开所有相关 adapter boundary |
| `RUN-OPS-001~002` SLO/capacity/真实 integration/GRC 未闭合 | PH-06/release/NFA hard gate 不可执行 | blocked | authority、environment、baseline、review role 到达后重开 PH-06 |
| `RUN-DOC-003` 正式 07/implementation ledger/boundaries 尚未创建 | 不能移交实现 | open/blocking | Step 13 full-restart 后才关闭文件缺口；不在本 Step 提前创建 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 外部依赖准备表完整 | `pass` | §5.2 含 provider、类型、phase、检查和不可用处理 |
| 配置与环境检查表完整 | `pass` | §5.3～§5.4 覆盖 strict source、四 profile、五环境、七域和 readiness 分层 |
| fake/mock/controlled/disabled 边界明确 | `pass` | §5.5 规定语义保持、profile isolation 和禁止升级 |
| 六 phase 准备矩阵与 Step 5 一致 | `pass` | §5.6 只增加准备条件和失败动作 |
| 18 boundary 准备矩阵与 Step 6/7 一致 | `pass` | §5.7 逐 boundary 映射依赖、检查和 blocked 处理 |
| 不可用、negative、not_run、waiting 和 evidence 失败处理明确 | `pass` | §5.8～§5.9；禁止把缺失依赖计为通过 |
| 持续 blocker 未被错误关闭 | `pass` | `RUN-UP-*`、`RUN-DDD-*`、`RUN-OPS-*`、`RUN-DOC-003` 均保持开放 |
| 可进入 Step 9 | `pass_for_step_09` | 下一步创建并完成 `07_implementation_plan_step_09_spikes_risks.md`；正式 07、implementation ledger、boundary skeleton 仍禁止提前创建 |

## 10. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否只承接正式 03/04/05/06 与 Step 5～7，不新增业务需求 | `pass` | 本 Step 只增加实施准备、检查和失败处理 |
| 是否遵守全局依赖类型和本仓裁剪规则 | `pass` | compile/runtime/event/internal/tool 分离，未写 sibling 私有 path |
| 是否把已存在 sibling 目录误当成 ready | `pass` | 只记录只读可见性；Runner-facing exact seam 仍需 authority |
| 是否保留 SDK-first、no-private、no-direct-DB/bus/topic | `pass` | §5.1～§5.5 明确禁止 |
| 是否保留 Query/Consumer/Job/event-zero 红线 | `pass` | no-write、no-payload/no-ACK、no-repair、outbound=0 |
| 是否伪造代码、环境、测试、artifact、report、evidence 或 readiness | `pass` | 未创建任何实例，所有执行状态仍 planned/blocked/not_run |
| 是否满足 Step 文件独立结构要求 | `pass` | 状态、输入、SOP、诊断、对比、取舍、结构化产物、回填、待确认、门禁均已包含 |

## 11. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 8
current_module = config_environment_external_dependencies
gate_status = completed / pass / self_reviewed
gate_reason = 外部依赖、配置/环境、fake/controlled/disabled、phase/boundary 准备和不可用处理已闭环；所有正向 owner seam、目标仓、技术 authority、真实环境、baseline、run 与证据实例仍保持 blocked/waiting/not_created。
next_allowed_action = create_and_complete_07_step_09_spikes_risks
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
