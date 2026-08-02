# Step 6. 逐模块定义对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 回填章节: `03-详细设计.md` §5 模块实现契约中的对象实现契约;§6 全局对象 / Trait / API 索引
> 初始生成日期: 2026-07-09
> 回归重审启动日期: 2026-07-18
> 状态: `design_reopen_step6_review_confirmed_consumed_by_7r_m0`
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 5 固定 `contracts/domain/application/infra/api/worker/jobs` 七个实现模块后,按模块 capability 推导对象、字段、函数、状态和不变量。本步只写设计仓中间产物,不修改正式 `03-详细设计.md`,不创建目标实现仓或代码。
> 当前效力: 原 §1~§28保留为已审查历史材料和回归输入，不再拥有current schema authority；当前Step 6效力与恢复点只以物理末尾§29、shared types的69-row registry、五份canonical source及`03_ddd_step_06_object_contracts_handoff_assembly.md`为准。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 6 | 是。用户在 Step 5 审查点后回复“同意”,允许进入 Step 6。 |
| 项目级台账是否允许进入 Step 6 | 是。`project_execution_ledger.md` 原恢复点为 Step 5 `pass_wait_review`;用户确认后可进入 Step 6。 |
| 文档级 flow 是否允许进入 Step 6 | 是。`03_ddd_calibration_flow.md` 原记录 Step 6 `blocked_by_step_5_review`;用户确认后门禁满足。 |
| 是否已读取 Step 5 中间产物 | 是。Step 5 已固定 7 个实现模块、依赖方向、归属门禁和 Step 6 承接表。 |
| 是否已读取详细设计 SOP Step 6 | 是。本步必须输出批次状态、模块顺序、非 core 闭口决策、逐模块 capability 到对象映射、对象字段 / 函数 / 状态契约、字段 / 状态审计和 Step 7 承接清单。 |
| 是否已读取详细设计书写规范 §5.5 | 是。正式 §5 后续必须按模块展开对象契约,不得把对象堆成全局清单。 |
| 是否已读取上游对象轮廓 | 是。已读取 `02_hld_step_06_key_objects.md` 及 intake / boundary、policy / capture、failure / safety、projection / audit 附录。 |
| 是否发现阻塞 Step 6 的上游 blocker | 否。目标实现仓未发现、`04/07` 缺失、产品选型和 exact config key 均为后续门禁,不阻塞本步对象契约。 |

---

## 2. 本步目标

本步把概要层关键对象翻译为 Rust-facing 实现契约,并让后续 Step 7~10 可以直接回指对象能力、字段来源和状态 owner。

本步要收稳:

- `contracts` 中跨 public protocol 共享的 typed ref、reason、marker、status、view、report 和 public error carrier。
- `domain` 中 sandbox truth、decision、guard、record、state、read identity、relay 和 audit trace。
- `application` 中 service call context、idempotency、stored result、application error 和 no-write / no-rollback disposition carrier。
- `infra` 中 adapter availability、runtime config summary、backend / handoff / publisher outcome 等实现边界对象。
- `api/worker/jobs` 中 entry shell、receipt、run context、report accumulator 和 exit disposition。
- 每个对象的字段、成员函数、factory / 静态函数、状态 enum、invariant 和禁止事项。
- 字段来源审计、状态闭环审计和 Step 7 port / repository / adapter 承接清单。

本步不处理:

- repository / resolver / backend / handoff / publisher trait 的完整函数签名,留给 Step 7。
- Command / Query / Event / Job DTO 完整 schema,留给 Step 8。
- 函数级事务顺序、save order、outbox / handoff / stale marker 顺序,留给 Step 9 / Step 11。
- 状态迁移矩阵全集,留给 Step 10。
- 配置 key、默认值、env var、产品 profile 和部署参数,留给 Step 14 / `04-配置设计.md`。
- 测试用例全集、验收 evidence、implementation boundary 和 commit plan。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、源码英文、`core-contracts` 唯一编译期 sibling 依赖和运行期 / 事件协作依赖隔离口径。 |
| `03_ddd_step_04_file_layout.md` | 已完成 | 提供 workspace 多 crate planned layout、module / file group 和 binary / job 名称。 |
| `03_ddd_step_05_module_contracts.md` | 已完成且用户已确认继续 | 提供 7 个实现模块主轴、依赖方向、归属门禁、Step 6 承接表。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、数据归属、接口依赖、NFR、验收红线和一票否决项。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供 execution isolation truth center、依赖裁剪、数据所有权、fail-closed、cleanup 和 redline 边界。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前直接上游 | 提供代码主体、6 个主要组成部分、关键对象、接口骨架、处理流、状态机、异常和配置影响。 |
| `02_hld_step_06_key_objects*.md` | 已读取 | 提供概要对象骨架、状态候选、字段骨架、成员函数骨架和禁止事项。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 必须继续展开且不能重发明的对象、接口、flow、状态、配置和测试方向。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` | 已读取 | 参考 Step 6 批次计划、模块顺序、非 core 决策、字段 / 状态审计和 Step 7 承接粒度。 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 已读取 | 参考对象卡片、enum 变体表和 application / infra / entry object 闭口写法。 |
| 旧 `projects/L4-sandbox/03-详细设计.md` | historical_material | 只用于识别旧五段对象、旧目录、command / provider bridge、artifact / observability 混层风险;不得作为契约来源。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`03` flow、Step 5、正式 `00/01/02`、SOP Step 6、书写规范 §5.5 和 L1 样例。 | done | 确认当前可进入 Step 6。 |
| 2 | 从概要对象附录整理模块对象候选池,并按 Step 5 模块 owner 重归属。 | done | 形成 `contracts/domain/application/infra/api/worker/jobs` 的对象批次。 |
| 3 | 先收敛 shared vocabulary / typed ref / public marker。 | done | public carrier 不漂移到 `domain/application/api`。 |
| 4 | 按模块逐个输出 capability、功能到对象映射、对象能力到字段 / 函数 / 状态映射和对象卡片。 | done | 每个对象都能回指模块功能。 |
| 5 | 显式记录非 core 模块对象闭口 / defer 决策。 | done | application / infra / entry object 不由后续 Step 私补。 |
| 6 | 做对象组字段来源审计、状态闭环审计和 Step 7 承接清单。 | done | 后续 port / protocol / flow / state 有对象级真相源。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | pending | 当前恢复点停在 Step 6 审查点,不跨到 Step 7。 |

---

## 5. SOP 问题回答

| 问题 | 本步回答 |
|---|---|
| 是否已经建立 Step 6 文件骨架、批次状态表和模块执行顺序表 | 是。本文件 §9.1 和 §9.3 已建立。 |
| 是否需要先收敛 shared vocabulary、typed ref、public marker 或基础 state enum | 需要。Sandbox public protocol、domain truth、application stored result、infra adapter outcome 和 entry receipt 都会共享 refs、reason、marker 和 status;先在 `contracts` 收敛。 |
| 当前模块需要完成哪些 capability | 见每个模块的 capability / 功能清单。核心 capability 覆盖受理与 identity、boundary、policy、run、capture / handoff、failure / cleanup / redline、projection / derived / relay / audit。 |
| 每个功能需要哪些输入、输出、状态、副作用、外部协作或后续 Step 承接 | 输入来自 command / event / resolver / backend / handoff / repository / generated id;输出为 domain fact、decision、view、receipt、report、adapter outcome;后续 Step 7~11 分别承接 port、protocol、flow、state、persistence。 |
| 每个功能由哪些对象承接 | 见功能到对象映射表;truth object、policy / guard、view / report、application helper、adapter state、entry object 分层归属。 |
| 是否存在功能无人承接、对象无功能来源、职责过大或跨模块 | 未发现。旧 `SandboxExecution/Session/Command/Policy/Output` 不纳入;概要对象被拆入模块内 owner。 |
| 非 core 模块哪些对象必须闭口,哪些 defer | `application` 的 idempotency、stored result、service context 和 application error 必须闭口;`infra/api/worker/jobs` 的 entry / adapter stable carrier 必须闭口;exact trait、DTO、flow、config、concurrency 留给 Step 7+。 |
| 每个模块最终需要定义哪些 struct / enum / value object / service | 见 §10~§14。service facade 作为 application helper 记录 owner,完整 trait / service 方法进入 Step 7 / Step 9。 |
| 字段、factory、函数、状态 enum 是否闭合 | 本文件为当前 boundary 的字段来源、构造入口、成员函数和状态 enum 提供 Rust-facing contract。 |
| enum variant 是否有 Rustdoc、允许来源和允许去向 | 见各模块状态 enum 表。Rust code block 中 Rustdoc 使用英文,正文解释使用中文。 |
| 模块内停审记录是否写明功能承接、对象来源、字段来源、状态迁移和边界约束 | 见 §15。 |
| 字段来源审计表是否覆盖高复用字段、truth object、view/report、application helper、adapter state 和 entry object | 见 §16。 |
| 状态闭环审计表是否覆盖 domain truth、read/projection、maintenance/publication、entry disposition 等状态族 | 见 §17。 |
| Step 7 承接清单是否逐项命名 port、repository、resolver、protocol 或 flow 闭口点 | 见 §19。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` | 旧文档以 session / isolation / command / output / control 五段展开,混入 provider bridge、artifact evidence、observability store 和 replay 线索。 | 本步不继承旧对象,只将其记录为 historical material / pollution risk。 |
| 概要 Step 6 | 概要对象骨架只到字段 / 函数轮廓,没有 Rust-facing 类型、factory、状态 variant、字段来源和模块 owner。 | 本步按模块翻译为对象实现契约。 |
| Step 5 | 已固定模块主轴,但对象还没有逐模块 capability 来源。 | 本步让每个对象回指 capability,防止对象总表化。 |
| `contracts` / `domain` 边界 | public view、status、reason 与 domain state 容易重复定义。 | 本步统一 public carrier owner 在 `contracts`,domain truth 复用或引用 public carrier,不得反向依赖。 |
| `application` / `infra` / entry object | 若 Step 6 不闭口 stable carrier,后续 Step 7~9 会私补 idempotency、stored result、adapter outcome、entry disposition。 | 本步显式闭口非 core 模块对象或标明 defer 理由。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象组织 | 只有概要对象分布和 Step 5 模块承接表。 | 按 7 个模块展开 capability -> object -> fields/functions/states。 | 后续 trait、DTO、flow、state 可以回指对象契约。 |
| shared carrier | refs、reason、status、view 分散在概要对象字段中。 | 统一收敛到 `contracts` shared vocabulary。 | 防止 public protocol 与 domain 私有类型漂移。 |
| domain truth | 概要层有对象骨架但缺 Rust-facing contract。 | 对 context、boundary、policy、run、capture、failure、cleanup、redline、projection、relay、audit 等对象给出字段、函数、factory 和状态。 | 使实现者可直接落 struct / enum / impl。 |
| non-core 对象 | Step 5 只说明 owner。 | `application/infra/api/worker/jobs` 对 stable carrier 做闭口,exact trait / DTO / flow 标注后续 Step。 | 防止后续实现自行发明 helper。 |
| 审计 | 无字段来源 / 状态闭环审计表。 | 增加字段来源审计、状态闭环审计和 Step 7 承接清单。 | 满足真相源闭环与可落码性标准。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 完全按概要 40+ 对象逐个平铺 | 对象完整。 | 容易退化为全局对象清单,无法看出模块功能来源。 | 不采用。 |
| B. 先按模块 capability 分组,每组再写对象卡片 | 能保持 Step 5 模块主轴,也能覆盖概要对象。 | 文档较长,需要跨模块审计。 | 采用。 |
| C. 只闭口 `contracts/domain`,把 application / infra / entry helper 全部后推 | 初稿短。 | idempotency、stored result、adapter outcome、entry receipt 会在 Step 7+ 私补,破坏 Step 6 真相源。 | 不采用。 |
| D. 把 backend / policy / observability / artifact 产品类型写进对象字段 | 看似具体。 | 违反依赖裁剪和数据所有权;会把外部 truth 混进 sandbox。 | 不采用。 |
| E. 把 read projection / derived state 看成纯查询附属 | 减少对象数量。 | query / trend / reconciliation 会缺少状态主语,容易反写核心 truth。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.0` | Step 状态、输入、问题回答、诊断、取舍、批次和模块执行顺序 | 已写入 | 是 | 待用户审查 | `6.1` |
| `6.1` | shared vocabulary / typed ref / public marker 与 `contracts` 对象 | 已写入 | 是 | 待用户审查 | `6.2` |
| `6.2` | `domain` intake / boundary / policy / run / capture / handoff 对象 | 已写入 | 是 | 待用户审查 | `6.3` |
| `6.3` | `domain` failure / cleanup / redline / reference / projection / relay / audit 对象 | 已写入 | 是 | 待用户审查 | `6.4` |
| `6.4` | `application` helper object、idempotency、stored result、error 和 disposition | 已写入 | 是 | 待用户审查 | `6.5` |
| `6.5` | `infra` adapter state / runtime summary object | 已写入 | 是 | 待用户审查 | `6.6` |
| `6.6` | `api/worker/jobs` entry object | 已写入 | 是 | 待用户审查 | `6.7` |
| `6.7` | 模块停审、字段来源审计、状态闭环审计、Step 7 承接、回填草稿、待确认事项 | 已写入 | 是 | 待用户审查 | 无 |

### 9.2 shared vocabulary / typed ref / public marker 收敛表

| 类型 | 所属层 | 需要先全局收敛的原因 | 后续使用模块 | 正式归属 |
|---|---|---|---|---|
| `SandboxOpaqueId`;`SandboxOpaqueRef`;`SandboxReason`;`SandboxDigest` | contracts | 多个 ref、reason、digest 的底层 carrier 需要统一非空 / opaque 规则。 | 全部模块 | `crates/contracts/src/refs.rs` |
| `ControlledExecutionContextRef` 等 sandbox typed refs | contracts | Command / Query / Event / Job / View / domain record 都需要引用同一对象。 | 全部模块 | `crates/contracts/src/refs.rs` |
| `ExternalBodyMarker`;`ForbiddenExternalBodyMarkerSet`;`SafeSummaryRefSet` | contracts | 多个对象都要表达“只保存 body-free summary,不保存外部正文”。 | `contracts`;`domain`;`application`;`infra` | `crates/contracts/src/refs.rs` |
| `SandboxTraceContext`;`SandboxAuditTraceRef` | contracts | audit、event、handoff、error、view 都需要统一 trace anchor。 | 全部模块 | `crates/contracts/src/metadata.rs`;`refs.rs` |
| `BoundaryLimitKind`;`SandboxFailureKind`;`SandboxControlKind`;`MaterialKind`;`HandoffTargetKind` | contracts | domain 和 protocol 都要引用分类,不能让 Step 8 私补 enum。 | `contracts`;`domain`;`application` | `crates/contracts/src/refs.rs` |
| `*Status` canonical shared enum | contracts | query view、receipt、event payload 和 domain state 需要统一名字。 | `contracts`;`domain`;`application`;entry modules | `crates/contracts/src/refs.rs` |
| `SandboxPublicErrorKind`;`EntryDisposition` | contracts | API / worker / job response surface 需要稳定错误和 disposition。 | `contracts`;`api`;`worker`;`jobs`;`application` | `crates/contracts/src/errors.rs`;`receipts.rs` |

### 9.3 模块执行顺序表

| 顺序 | 模块 | 模块职责 | 输入来源 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `contracts` | 先闭口 public carrier、status、kind、view、report、receipt。 | Step 5 owner、概要对象、接口骨架。 | public protocol 不引用 domain-only type。 |
| 2 | `domain` | 闭口 sandbox truth、decision、guard、record、state、projection identity、relay 和 audit。 | 概要关键对象、状态机、异常边界。 | 每个对象都有字段来源、factory、状态和禁止事项。 |
| 3 | `application` | 闭口 service context、idempotency、stored result、application error、no-write / no-rollback disposition。 | Step 5 application owner、概要 flow / interface。 | Step 7 不私补 idempotency / result / error carrier。 |
| 4 | `infra` | 闭口 adapter availability、runtime config summary、backend / handoff / publisher outcome state。 | Step 5 infra owner、配置影响轮廓。 | Adapter state 不定义业务 truth,只承接 port implementation boundary。 |
| 5 | `api` | 闭口 sync entry envelope 和 API disposition。 | Step 5 entry owner、Command / Query skeleton。 | API 不直接访问 repository 或 domain transition。 |
| 6 | `worker` | 闭口 consumer receipt、worker run context、fulfillment / relay loop result。 | Step 5 worker owner、Consumer / Event skeleton。 | Worker 不修核心 truth,不与 jobs 互相依赖。 |
| 7 | `jobs` | 闭口 one-shot job run context、report accumulator 和 exit disposition。 | Step 5 jobs owner、Operations Job skeleton。 | Job 不作为业务 command,不绕过 guard。 |
| 8 | cross-module audit | 汇总字段来源、状态 owner、Step 7 接缝。 | 当前 Step 全文。 | 后续 Step 7 可以按 port / adapter 契约继续。 |

### 9.4 非 `contracts` / `domain` 模块对象闭口决策表

| 模块 | 当前 Step 6 是否闭口 | 需要闭口的对象组 | 若 defer 的理由 | 后续承接 Step |
|---|---|---|---|---|
| `application` | 是 | `SandboxServiceCallContext`;`SandboxIdempotencyRecord`;`SandboxStoredOperationResult`;`SandboxApplicationError`;`SandboxQueryAccessDecision`;`SandboxServiceOutcome` | exact repository / port method、service flow 和 transaction order 仍未到本步。 | Step 7 / 8 / 9 / 11 / 13 |
| `infra` | 是,但只闭口 stable adapter state | `SandboxRuntimeConfigSummary`;`AdapterAvailabilityState`;`IsolationBackendAdapterOutcome`;`MaterialHandoffAdapterOutcome`;`EventPublisherAdapterOutcome` | durable schema、config key、adapter trait signature 和产品参数后续闭口。 | Step 7 / 11 / 14 |
| `api` | 是,但只闭口 entry shell | `SandboxApiCommandEnvelope`;`SandboxApiQueryEnvelope`;`SandboxApiDisposition` | exact route / RPC schema 和 DTO 字段由 Step 8 闭口。 | Step 8 / 9 |
| `worker` | 是,但只闭口 worker entry shell | `SandboxConsumerReceipt`;`SandboxWorkerRunContext`;`SandboxFulfillmentLoopResult`;`SandboxRelayLoopResult` | event envelope schema、consumer flow 和重入规则后续闭口。 | Step 8 / 9 / 13 |
| `jobs` | 是,但只闭口 job runner shell | `SandboxJobRunContext`;`SandboxJobReportAccumulator`;`SandboxJobExitDisposition` | exact job input / report schema、cursor / batch / retry flow 后续闭口。 | Step 8 / 9 / 13 / 16 |

---

## 10. `contracts` 模块对象契约

### 10.1 `contracts` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 定义 typed refs 与 body-free marker | 概要关键对象、Command / Query / Event / Job skeleton | `*Ref`;`*RefSet`;`ExternalBodyMarker`;`SafeSummaryRefSet` | 无写副作用 | 只承载 public carrier,不保存正文 | Step 8 DTO;Step 16 contract tests |
| 定义 status / kind / reason | 概要状态机、异常边界 | `*Status`;`*Kind`;`*Reason` | 作为 domain state 与 protocol status 名称来源 | 不定义 state matrix 全量迁移 | Step 10 状态矩阵;Step 12 error model |
| 定义 public view / report / receipt shell | Query / Job / Consumer skeleton | status view、summary view、job report、receipt | 只读 / receipt surface | 不作为 truth source | Step 8 protocol;Step 9 flow |
| 定义 public error / disposition carrier | API / worker / job response surface | `SandboxPublicErrorKind`;`EntryDisposition` | 错误和入口处理结果表面 | 不替代 domain / application error | Step 8 / 12 |

### 10.2 `contracts` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `SandboxTypedRefFamily` | typed refs 与 body-free marker | public carrier family | 统一 opaque id/ref/ref set/reason/digest 规则 | 不承载外部正文;不表达可见性 |
| `SandboxStatusFamily` | status / kind / reason | public enum family | 提供 domain / protocol 共享状态名和分类名 | 不替代 Step 10 状态矩阵 |
| `SandboxStatusViews` | public view / report / receipt shell | view / report family | 提供 query、event、job、receipt 的稳定输出对象 | 不成为 truth source;不可反写核心 truth |
| `SandboxPublicErrorSurface` | public error / disposition carrier | error / receipt family | 统一 API / worker / job error kind 与入口 disposition | 不替代 application error 细节 |

### 10.3 `contracts` 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `SandboxTypedRefFamily` | 形成 body-free typed identity | `id/ref: String`;`kind`;`digest` | `new_non_empty(...)`;`from_generated_id(...)`;`from_external_ref(...)` | `as_str`;`same_ref`;`is_empty_set` | 不适用 | id generator、repository load、resolver summary、event envelope |
| `SandboxStatusFamily` | 提供有限状态 / 分类 | enum variant | enum literal | `is_terminal`;`is_blocking`;`is_degraded` | `Accepted`;`Rejected`;`Pending`;`Failed`;`Degraded` 等 | 概要 Step 9 状态机、Step 10 异常边界 |
| `SandboxStatusViews` | 暴露只读 view / report | `view_ref`;`context_ref`;`status`;`trace_ref`;`degraded_markers` | `from_truth_snapshot(...)`;`degraded(...)` | `is_degraded`;`is_terminal`;`redacted` | public status enum | domain truth snapshot、projection rebuild、application query assembly |
| `SandboxPublicErrorSurface` | 暴露 public error / disposition | `error_kind`;`reason`;`trace_ref`;`retry_hint` | `from_application_error(...)`;`blocked(...)` | `is_retryable`;`is_blocking` | `Accepted`;`Rejected`;`Delayed`;`Failed`;`Skipped` | application error mapping、entry mapping |

### 10.4 `SandboxTypedRefFamily`

#### 类型定义

```rust
/// Defines opaque and body-free references shared by sandbox protocol and domain objects.
pub struct SandboxOpaqueRef(pub String);

/// Carries a stable sandbox-local identity.
pub struct SandboxOpaqueId(pub String);

/// Carries a non-empty human-readable reason without owning external bodies.
pub struct SandboxReason(pub String);

/// Carries an integrity or summary digest without defining the digest algorithm.
pub struct SandboxDigest(pub String);

/// References a controlled execution context.
pub struct ControlledExecutionContextRef {
    /// Stable sandbox context id.
    pub context_id: SandboxOpaqueId,
}

/// References an execution environment identity.
pub struct ExecutionEnvironmentIdentityRef {
    /// Stable sandbox environment identity id.
    pub environment_identity_id: SandboxOpaqueId,
}

/// References a body-free external object summary.
pub struct ExternalSourceRef {
    /// Kind of external source.
    pub source_kind: ExternalSourceKind,
    /// Opaque external reference value.
    pub external_ref: SandboxOpaqueRef,
    /// Optional source-side version reference.
    pub source_version_ref: Option<SandboxOpaqueRef>,
    /// Optional safe-summary digest.
    pub source_digest: Option<SandboxDigest>,
}

/// Carries an ordered and de-duplicated set of external source refs.
pub struct ExternalSourceRefSet(pub Vec<ExternalSourceRef>);

/// Carries markers for external body categories that must not enter sandbox truth.
pub struct ForbiddenExternalBodyMarkerSet(pub Vec<ExternalBodyMarker>);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `SandboxOpaqueId.0` | `String` | sandbox-local id | 由 application id generator 或 repository load 提供;非空;业务逻辑不得解析结构。 |
| `SandboxOpaqueRef.0` | `String` | body-free ref | 来自 command DTO、event envelope、resolver summary 或 persisted ref;非空。 |
| `SandboxReason.0` | `String` | 解释原因 | 来自 command intent、guard、adapter outcome 或 error mapping;非空;不得保存外部正文。 |
| `SandboxDigest.0` | `String` | 摘要校验 | 来自 resolver / source event / material adapter;不在本步定义算法。 |
| `ExternalSourceRef.source_kind` | `ExternalSourceKind` | 外部来源类别 | 来源于 request、event、resolver summary;不得由实现侧猜测。 |
| `ExternalSourceRef.external_ref` | `SandboxOpaqueRef` | 外部稳定引用 | 不保存 identity/work/tool/runtime/policy/artifact/observability/investigation 正文。 |
| `ExternalSourceRefSet.0` | `Vec<ExternalSourceRef>` | 来源引用集合 | ordered unique;去重依据为 source kind + external ref。 |
| `ForbiddenExternalBodyMarkerSet.0` | `Vec<ExternalBodyMarker>` | 禁止入仓正文类别 | 来源于 resolver / guard / config-independent redline;不能为空时表示存在必须拒绝或降级的 body risk。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new_non_empty(value: String) -> Result<SandboxOpaqueRef, ContractError>` | 创建非空 ref | `value` 为来源 ref 字符串 | `Result<SandboxOpaqueRef, ContractError>` | 不解析内部结构。 |
| `pub fn same_external_source(&self, other: &ExternalSourceRef) -> bool` | 判断外部来源是否同一 | `other` 为比较对象 | `bool` | 只比较 `source_kind + external_ref`,不比较 version / digest。 |
| `pub fn contains_forbidden_body(&self) -> bool` | 判断是否存在正文入仓风险 | 无 | `bool` | 纯判断,不访问外部系统。 |
| `pub fn from_resolution(resolution: &ExecutionContextResolution) -> SandboxReason` | 从解析结果形成safe reason | resolution status / missing / conflict markers | `SandboxReason` | 不复制external body。 |
| `pub fn from_policy_applicability(status: PolicyApplicabilityStatus) -> SandboxReason` | 从policy适用状态形成fail-closed reason | finite applicability status | `SandboxReason` | 不读取policy body或error string。 |
| `pub fn from_policy_authorization(disposition: PolicyAuthorizationDisposition) -> SandboxReason` | 从authorization disposition形成safe reason | finite authorization disposition | `SandboxReason` | 用于Denied / fail-closed,不解析summary ref。 |
| `pub fn from_high_risk_status(status: HighRiskActionDecisionStatus) -> SandboxReason` | 从高风险裁定形成safe reason | finite high-risk status | `SandboxReason` | 用于Blocked / Unsupported,不复制action body。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn context_ref(context_id: SandboxOpaqueId) -> ControlledExecutionContextRef` | 从 id 构造 context ref | generated 或 persisted id | `ControlledExecutionContextRef` | command result、event、domain object link。 |
| `pub fn from_resolver(source_kind: ExternalSourceKind, external_ref: SandboxOpaqueRef, digest: Option<SandboxDigest>) -> ExternalSourceRef` | 从 resolver 输出构造外部 ref | source kind、opaque ref、digest | `ExternalSourceRef` | intake reference resolution、reference refresh。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 不拥有对象 | ref 只携带稳定 identity,不携带 truth body、projection body 或 external body。 |
| ref 不表达可见性 | 可见性由 application query access decision 和 public view disposition 表达。 |
| `*RefSet` 保持 ordered unique | fake / durable 实现必须一致,不得降级为无序 set 或重复 Vec。 |
| 不引入 sibling compile dependency | 除 `core-contracts` 外,外部来源只用 opaque ref / safe summary 表达。 |

### 10.5 `SandboxStatusFamily`

#### 类型定义

```rust
/// Classifies the external source family referenced by sandbox.
pub enum ExternalSourceKind {
    /// Identity or actor source.
    Identity,
    /// Work or project source.
    Work,
    /// Tool execution source.
    Tool,
    /// Runtime orchestration source.
    Runtime,
    /// Policy or authorization source.
    Policy,
    /// Artifact or material handoff source.
    Artifact,
    /// Observability source.
    Observability,
    /// Investigation or security response source.
    Investigation,
}

/// Marks an external body category that sandbox must not persist.
pub enum ExternalBodyMarker {
    /// Identity body is forbidden.
    IdentityBody,
    /// Work body is forbidden.
    WorkBody,
    /// Tool semantic body is forbidden.
    ToolSemanticBody,
    /// Runtime agent-loop body is forbidden.
    RuntimeLoopBody,
    /// Policy definition body is forbidden.
    PolicyDefinitionBody,
    /// Artifact body is forbidden.
    ArtifactBody,
    /// Observability store body is forbidden.
    ObservabilityBody,
    /// Investigation body is forbidden.
    InvestigationBody,
}

/// Status of a controlled execution intake.
pub enum ControlledExecutionIntakeStatus {
    /// Intake is waiting for reference resolution.
    PendingResolution,
    /// Intake has formed a formal sandbox context.
    Accepted,
    /// Intake is rejected and must not launch execution.
    Rejected,
    /// Intake cannot resolve required references.
    Unresolved,
    /// Intake is closed and read-only.
    Closed,
}

/// Status of a sandbox boundary decision.
pub enum BoundaryDecisionStatus {
    /// Boundary requirements are ready but not yet established.
    Required,
    /// Boundary is coherently established.
    Established,
    /// Boundary is rejected.
    Rejected,
    /// Boundary waits for capability or backend input.
    PendingCapability,
    /// Boundary establishment failed.
    Failed,
}

/// Status of a policy execution decision.
pub enum PolicyExecutionDecisionStatus {
    /// Policy allows execution to continue.
    Accepted,
    /// Policy rejects execution.
    Rejected,
    /// High-risk or redline condition blocks execution.
    Blocked,
    /// Decision waits for policy or authorization input.
    Pending,
    /// Missing or unsafe input forces fail-closed behavior.
    FailClosed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ControlledExecutionIntakeStatus::PendingResolution` | `Intake is waiting for reference resolution.` | 等待 refs / safe summary | `ControlledExecutionContext::open_pending` | `Accepted`;`Rejected`;`Unresolved` |
| `ControlledExecutionIntakeStatus::Accepted` | `Intake has formed a formal sandbox context.` | 允许进入 boundary / policy | `ControlledExecutionContext::accept` | `Closed`;failure / control flow |
| `ControlledExecutionIntakeStatus::Rejected` | `Intake is rejected and must not launch execution.` | 最小语境不成立 | `ControlledExecutionContext::reject` | 终态;只读 view |
| `ControlledExecutionIntakeStatus::Unresolved` | `Intake cannot resolve required references.` | 必需 refs 缺失或冲突 | `ControlledExecutionContext::mark_unresolved` | `PendingResolution`;`Rejected` |
| `ControlledExecutionIntakeStatus::Closed` | `Intake is closed and read-only.` | 语境已收束 | cleanup / control flow | 终态 |
| `BoundaryDecisionStatus::Required` | `Boundary requirements are ready but not yet established.` | 已形成要求但未建环境 | `BoundaryRequirementSet::from_context` | `Established`;`Rejected`;`PendingCapability`;`Failed` |
| `BoundaryDecisionStatus::Established` | `Boundary is coherently established.` | resource / filesystem / network / process 等整体成立 | `BoundaryEstablishmentDecision::established` | run start;release / cleanup |
| `BoundaryDecisionStatus::Rejected` | `Boundary is rejected.` | 要求不合法或不可满足 | `BoundaryEstablishmentDecision::reject` | failure classification |
| `BoundaryDecisionStatus::PendingCapability` | `Boundary waits for capability or backend input.` | capability stale / unknown | `BackendCapabilityGuard::evaluate` | `Established`;`Rejected`;`Failed` |
| `BoundaryDecisionStatus::Failed` | `Boundary establishment failed.` | adapter / backend 建立失败 | `BoundaryEstablishmentDecision::failed` | failure / cleanup |
| `PolicyExecutionDecisionStatus::Accepted` | `Policy allows execution to continue.` | 可进入 launch | `PolicyExecutionDecision::accept` | run start |
| `PolicyExecutionDecisionStatus::Rejected` | `Policy rejects execution.` | policy / authorization 拒绝 | `PolicyExecutionDecision::reject` | failure classification |
| `PolicyExecutionDecisionStatus::Blocked` | `High-risk or redline condition blocks execution.` | 高风险动作阻断 | `HighRiskActionDecision::block` | redline / failure |
| `PolicyExecutionDecisionStatus::Pending` | `Decision waits for policy or authorization input.` | 等待摘要 | `PolicyApplicabilityGuard::evaluate` | `Accepted`;`Rejected`;`FailClosed` |
| `PolicyExecutionDecisionStatus::FailClosed` | `Missing or unsafe input forces fail-closed behavior.` | 保守失败 | `FailClosedPolicyGuard::enforce` | failure classification |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| enum 名称是状态真相源 | Step 10 状态矩阵不得发明同义状态名。 |
| `Pending` / `FailClosed` 不得映射为 allow | 任何缺失、冲突、不支持或 stale 都不得走 permissive fallback。 |
| public status 不保存正文 | 状态原因使用 `SandboxReason` 或 typed reason,不携带外部 body。 |

### 10.6 `SandboxStatusViews`

#### 类型定义

```rust
/// Read-only status view for a sandbox execution context.
pub struct SandboxExecutionStatusView {
    /// View identity.
    pub view_ref: SandboxOpaqueRef,
    /// Controlled execution context.
    pub context_ref: ControlledExecutionContextRef,
    /// Intake status.
    pub intake_status: ControlledExecutionIntakeStatus,
    /// Boundary status if boundary evaluation has started.
    pub boundary_status: Option<BoundaryDecisionStatus>,
    /// Policy status if policy evaluation has started.
    pub policy_status: Option<PolicyExecutionDecisionStatus>,
    /// Degraded markers for partial read surfaces.
    pub degraded_markers: Vec<SandboxReason>,
    /// Trace reference for audit.
    pub audit_trace_ref: Option<SandboxOpaqueRef>,
}

/// Read-only report emitted by sandbox maintenance jobs.
pub struct SandboxReconciliationReport {
    /// Report identity.
    pub report_ref: SandboxOpaqueRef,
    /// Report scope reference.
    pub scope_ref: SandboxOpaqueRef,
    /// Report status.
    pub report_status: ReconciliationReportStatus,
    /// Finding references without external bodies.
    pub finding_refs: Vec<SandboxOpaqueRef>,
}

/// Status of a sandbox reconciliation report.
pub enum ReconciliationReportStatus {
    /// Report has no unresolved finding.
    Clean,
    /// Report found issues that require operator or downstream attention.
    IssuesFound,
    /// Report is incomplete but safely readable.
    Degraded,
    /// Report generation failed.
    Failed,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `SandboxOpaqueRef` | 只读视图 identity | projection store 或 query assembly 生成;不得作为 truth id。 |
| `context_ref` | `ControlledExecutionContextRef` | 回指执行语境 | 来自 domain truth 或 projection rebuild input。 |
| `intake_status` | `ControlledExecutionIntakeStatus` | 展示受理状态 | 从 `ControlledExecutionContext` 复制;不得由 query 猜测。 |
| `boundary_status` | `Option<BoundaryDecisionStatus>` | 展示 boundary 结果 | 从 `BoundaryEstablishmentDecision` / projection 复制;缺失为 `None`。 |
| `policy_status` | `Option<PolicyExecutionDecisionStatus>` | 展示 policy 结果 | 从 `PolicyExecutionDecision` / projection 复制。 |
| `degraded_markers` | `Vec<SandboxReason>` | 读取降级原因 | 来源于 projection / reference / adapter degraded decision。 |
| `report_status` | `ReconciliationReportStatus` | 对账报告状态 | 由 reconciliation job assembly 形成,不反写核心 truth。 |
| `finding_refs` | `Vec<SandboxOpaqueRef>` | finding 引用 | 只保存 finding ref,不保存外部正文。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_degraded(&self) -> bool` | 判断 view 是否降级 | 无 | `bool` | 只检查 degraded markers 和 optional status。 |
| `pub fn can_show_success(&self) -> bool` | 判断能否展示成功面 | 无 | `bool` | 只有核心状态明确且无 blocked / failed 才返回 true。 |
| `pub fn has_findings(&self) -> bool` | 判断 report 是否有 finding | 无 | `bool` | 不读取 finding body。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_projection(context_ref: ControlledExecutionContextRef, intake_status: ControlledExecutionIntakeStatus) -> Self` | 从 projection 构造状态视图 | context ref、intake status | `SandboxExecutionStatusView` | query response assembly。 |
| `pub fn degraded(context_ref: ControlledExecutionContextRef, reason: SandboxReason) -> Self` | 构造降级视图 | context ref、reason | `SandboxExecutionStatusView` | projection stale / reference missing。 |
| `pub fn report_clean(scope_ref: SandboxOpaqueRef) -> SandboxReconciliationReport` | 构造 clean report | scope ref | `SandboxReconciliationReport` | reconciliation job。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ReconciliationReportStatus::Clean` | `Report has no unresolved finding.` | 对账无问题 | reconciliation job report assembly | 终态 report |
| `ReconciliationReportStatus::IssuesFound` | `Report found issues that require operator or downstream attention.` | 发现问题 | reconciliation finding builder | 终态 report;不得反写 truth |
| `ReconciliationReportStatus::Degraded` | `Report is incomplete but safely readable.` | 不完整但可读 | adapter degraded outcome | 后续 job 可重新生成 |
| `ReconciliationReportStatus::Failed` | `Report generation failed.` | job 失败 | job error mapping | retry / report failure surface |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| view / report 只读 | 不作为 truth source,不得由 query / job 反写核心 truth。 |
| degraded 不伪造 success | 降级 view 不能把缺失状态显示为 accepted / completed。 |
| finding 不保存正文 | finding 只以 ref / safe summary 暴露。 |

### 10.7 `SandboxPublicErrorSurface`

#### 类型定义

```rust
/// Public error family exposed by sandbox entry surfaces.
pub enum SandboxPublicErrorKind {
    /// Request is invalid.
    InvalidRequest,
    /// Caller is not authorized by upstream context or policy.
    NotAuthorized,
    /// Required reference cannot be resolved.
    ReferenceUnresolved,
    /// Boundary cannot be established.
    BoundaryRejected,
    /// Policy fails closed.
    PolicyFailClosed,
    /// High-risk or redline condition blocks the operation.
    Blocked,
    /// Backend or adapter is unavailable.
    Unavailable,
    /// Operation has already been accepted or processed.
    Duplicate,
    /// Operation failed after acceptance.
    Failed,
}

/// Disposition returned by API, worker, or job entries.
pub enum EntryDisposition {
    /// Entry accepted the input and invoked application service.
    Accepted,
    /// Entry rejected the input before any application write.
    Rejected,
    /// Entry delayed processing safely.
    Delayed,
    /// Entry skipped an item without mutating truth.
    Skipped,
    /// Entry failed and returned an error surface.
    Failed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `SandboxPublicErrorKind::InvalidRequest` | `Request is invalid.` | request / event / job input 校验失败 | entry mapper、application validation | response / receipt error |
| `SandboxPublicErrorKind::NotAuthorized` | `Caller is not authorized by upstream context or policy.` | upstream auth / policy 不允许 | application error mapping | response / receipt error |
| `SandboxPublicErrorKind::ReferenceUnresolved` | `Required reference cannot be resolved.` | 必需 ref 缺失 | resolver / reference state | rejected / delayed / degraded |
| `SandboxPublicErrorKind::BoundaryRejected` | `Boundary cannot be established.` | boundary 不成立 | domain boundary decision | response / event |
| `SandboxPublicErrorKind::PolicyFailClosed` | `Policy fails closed.` | policy 缺失或不安全 | fail-closed guard | response / failure |
| `SandboxPublicErrorKind::Blocked` | `High-risk or redline condition blocks the operation.` | 高风险 / 红线阻断 | policy / redline guard | response / failure / containment |
| `SandboxPublicErrorKind::Unavailable` | `Backend or adapter is unavailable.` | adapter / backend 不可用 | infra outcome mapping | delayed / failed |
| `SandboxPublicErrorKind::Duplicate` | `Operation has already been accepted or processed.` | 幂等重复 | idempotency record | stored result replay |
| `SandboxPublicErrorKind::Failed` | `Operation failed after acceptance.` | 已受理后失败 | application / adapter error | failure surface |
| `EntryDisposition::Accepted` | `Entry accepted the input and invoked application service.` | 入口接受 | entry mapper | application result |
| `EntryDisposition::Rejected` | `Entry rejected the input before any application write.` | 入口拒绝 | entry validation | no-write |
| `EntryDisposition::Delayed` | `Entry delayed processing safely.` | 延迟处理 | config / dependency unavailable | retry |
| `EntryDisposition::Skipped` | `Entry skipped an item without mutating truth.` | 跳过不适用项 | job / consumer guard | report only |
| `EntryDisposition::Failed` | `Entry failed and returned an error surface.` | 入口失败 | entry / application error | error surface |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| public error 不替代 application error | 详细原因和内部分类归 `SandboxApplicationError`。 |
| disposition 不写 truth | entry disposition 只能描述入口行为,不能直接推进 domain state。 |
| duplicate 必须有 stored result 读取面 | Step 7 / 13 必须闭合 idempotency repository 和 stored result replay。 |

---

## 11. `domain` 模块对象契约

### 11.1 `domain` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立受控执行语境和执行环境身份 | command / consumer input、reference resolution、id generator | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution` | intake status、identity status、audit trace ref | resolver / id generator 由 application port 提供 | Step 7 repository / resolver;Step 9 intake flow;Step 10 state |
| 建立 coherent boundary | context、environment identity、backend capability summary、boundary requirements | `BoundaryRequirementSet`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle` | boundary decision、backend capability status、lease seed | backend capability / isolation backend port 后续定义 | Step 7 backend port;Step 9 boundary flow |
| 执行 policy / high-risk 裁定 | context、boundary requirements、policy summary、authorization summary | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | accepted / rejected / blocked / pending / fail-closed | policy truth 外部拥有 | Step 7 policy summary port;Step 8 command schema;Step 10 state |
| 承接 controlled run、capture 和 material handoff | established boundary、policy decision、backend lifecycle signal、capture adapter output | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact` | run lifecycle、capture completeness、handoff status、relay record seed | runtime truth、artifact truth、observability store 外部拥有 | Step 7 isolation/handoff/observability port;Step 9 run/capture flow |
| 分类 failure、control、lease / orphan、cleanup 和 redline | policy deny、backend failure、control request、lease expiry、capture/handoff state、redline signal | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | terminal / pending / blocked / contained / released | runtime recover、artifact retention、investigation lifecycle 外部拥有 | Step 9 failure/cleanup/redline flow;Step 10 state |
| 维护 reference、projection、derived、relay 和 audit | committed truth、reference refresh result、projection rebuild input、publisher result | `ReferenceResolutionState`;`SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`SandboxEventRelayRecord`;`SandboxAuditTrace` | read freshness、relay status、audit record | 只读 / append-only,不反写核心 truth | Step 7 projection / relay repository;Step 9 query/job flow |

### 11.2 `domain` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ControlledExecutionContext` | 建立受控执行语境 | truth object / aggregate | open、accept、reject、close、关联 boundary / policy / run | 不保存 identity/work/tool/runtime 正文;不代表 runtime execution instance |
| `ExecutionEnvironmentIdentity` | 建立执行环境身份 | value object / entity | bind responsibility anchor、close、invalidate | 不拥有 actor / member lifecycle;不作为权限源 |
| `ExecutionContextResolution` | refs / summary 解析 | state object | 判断 required refs、conflict、支持 identity | 不替代外部可见性判断 |
| `BoundaryRequirementSet` | 合成 boundary 要求 | value object | resource / filesystem / network / process / workspace / mount requirement 集合 | 不保存 backend 产品配置 |
| `CoherentBoundary` | coherent boundary truth | truth object | 判断整体成立、禁止 silent degrade、绑定 handle | 不允许部分限制失败但继续执行 |
| `BoundaryEstablishmentDecision` | boundary 裁定 | decision object | established / rejected / pending / failed | 不启动 runtime,只记录裁定 |
| `BackendCapabilitySummary` | backend capability 输入 | reference snapshot | stale / unsupported / usable 判断 | 不拥有 backend truth |
| `IsolationEnvironmentHandle` | isolation environment handle | lifecycle handle | active、release pending、released、orphan suspected | 不保存 SDK 原始响应 |
| `PolicyApplicabilitySnapshot` | policy 输入摘要 | snapshot | missing / conflicted / stale / applicable 判断 | 不拥有 policy definition / approval / allowlist truth |
| `PolicyExecutionDecision`;`HighRiskActionDecision` | policy / high-risk 裁定 | decision object | accepted / rejected / blocked / fail-closed | 不解释 tools semantic execution |
| `ControlledExecutionRun` | run lifecycle | truth object | preparing、running、completed、failed、terminated | 不等于 runtime agent loop 或 runtime truth |
| `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact` | capture / handoff | fact / value object | capture completeness、material reference、handoff pending/delivered/failed/retryable | 不宣布 artifact truth 或 observability store truth |
| `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | failure / cleanup / redline | truth / guard / record | failure classify、control conflict、lease expiry、cleanup block / allow、redline contain | 不推进 runtime recover;不执行业务 replay;不绕过 cleanup guard |
| `ReferenceResolutionState`;`SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`SandboxEventRelayRecord`;`SandboxAuditTrace` | reference / projection / relay / audit | read state / projection / append-only record | mark stale、rebuild、publish result、append audit | 不反写核心 truth;publish failure 不回滚 source truth |

### 11.3 `domain` 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ControlledExecutionContext` | 受理、拒绝、收束、回指后续 truth | `context_ref`;`source_refs`;`responsibility_context`;`intake_status`;`resolution_ref`;`audit_trace_ref` | `open_pending(...)`;`accept(...)`;`reject(...)` | `is_executable_context`;`attach_boundary`;`attach_policy_decision`;`close` | `ControlledExecutionIntakeStatus` | request / consumer input、resolver result、id generator、audit trace |
| `ExecutionEnvironmentIdentity` | 建立身份锚点 | `environment_identity_ref`;`context_ref`;`responsibility_anchor`;`trace_context`;`identity_status` | `bind(...)` | `close`;`invalidate`;`can_anchor_boundary` | `ExecutionEnvironmentIdentityStatus` | accepted context、responsibility safe summary、trace metadata |
| `CoherentBoundary` | 证明边界整体成立 | `boundary_ref`;`context_ref`;`requirements_ref`;`decision_ref`;`handle_ref`;`boundary_status` | `establish(...)`;`reject(...)` | `is_established`;`requires_cleanup_on_failure`;`contains_weak_fallback` | `BoundaryCoherenceStatus` | boundary requirements、backend decision、isolation handle |
| `PolicyExecutionDecision` | 裁定 launch 是否允许 | `decision_ref`;`context_ref`;`snapshot_ref`;`boundary_requirement_ref`;`decision_status`;`decision_reason`;`audit_trace_ref` | `accept`;`reject`;`fail_closed`;`block` | `permits_execution`;`must_block_launch`;`to_failure_seed` | `PolicyExecutionDecisionStatus` | policy snapshot、boundary requirements、guard output |
| `ControlledExecutionRun` | 承接 run lifecycle | `run_ref`;`context_ref`;`boundary_ref`;`policy_decision_ref`;`run_status`;`backend_handle_ref`;`started_at`;`finished_at` | `prepare`;`start`;`fail_before_start` | `mark_running`;`mark_completed`;`mark_failed`;`mark_terminated` | `ControlledExecutionRunStatus` | boundary decision、policy decision、backend outcome、clock |
| `CaptureFact` | 捕获输出 / 材料事实 | `capture_ref`;`run_ref`;`material_refs`;`observability_refs`;`capture_status`;`audit_trace_ref` | `complete`;`partial`;`failed` | `is_complete`;`requires_handoff`;`material_ref_set` | `CaptureStatus` | backend capture output、observability material adapter、audit trace |
| `HandoffFact` | 交接事实 | `handoff_ref`;`source_capture_ref`;`target_kind`;`handoff_status`;`receipt_ref`;`failure_reason` | `open_pending`;`mark_delivered`;`mark_retryable`;`mark_failed` | `is_terminal`;`can_retry`;`blocks_cleanup` | `HandoffStatus` | capture fact、handoff adapter outcome、receipt |
| `FailureClassification` | 稳定失败分类 | `failure_ref`;`context_ref`;`run_ref`;`failure_kind`;`failure_status`;`source_markers`;`audit_trace_ref` | `classify`;`from_policy_deny`;`from_capture_failure`;`from_redline` | `is_terminal_failure`;`requires_cleanup_guard`;`requires_redline_containment` | `FailureClassificationStatus` | policy decision、backend failure、capture/handoff/control/redline markers |
| `CleanupGuard` | cleanup / release 前安全门禁 | `cleanup_guard_ref`;`context_ref`;`capture_ref`;`handoff_ref`;`investigation_summary`;`guard_status`;`blocking_reasons` | `evaluate`;`blocked`;`allowed` | `allows_cleanup`;`blocks_release`;`mark_completed` | `CleanupGuardStatus` | capture / handoff truth、investigation summary、redline containment |
| `RedlineContainment` | security redline 收束 | `redline_ref`;`context_ref`;`redline_kind`;`containment_status`;`handoff_summary`;`release_guard_ref` | `detect`;`contain`;`handoff_pending`;`release` | `blocks_cleanup`;`requires_investigation_handoff`;`is_terminal` | `RedlineContainmentStatus` | redline signal、failure/control/capture state、investigation handoff |
| `SandboxReadProjection` | 只读 projection | `projection_ref`;`context_ref`;`status_view_refs`;`projection_status`;`degraded_markers` | `create`;`mark_stale`;`rebuild_from_truth` | `is_degraded`;`requires_rebuild`;`does_not_write_truth` | `SandboxProjectionStatus` | committed truth snapshot、projection rebuild plan |
| `SandboxEventRelayRecord` | event relay 传播记录 | `relay_ref`;`source_truth_ref`;`event_kind`;`relay_status`;`publish_attempts`;`last_error` | `pending`;`mark_delivered`;`mark_failed`;`dead_letter` | `can_retry`;`must_not_rollback_source` | `EventRelayStatus` | truth change、publisher outcome、retry policy summary |
| `SandboxAuditTrace` | append-only audit trace | `trace_ref`;`subject_ref`;`trace_kind`;`source_ref`;`occurred_at`;`reason` | `append`;`from_domain_change` | `same_subject`;`is_append_only` | 不适用 | domain event seed、audit mapper、clock |

### 11.4 `ControlledExecutionContext`

#### 类型定义

```rust
/// Owns the sandbox-side context for one controlled execution request.
pub struct ControlledExecutionContext {
    /// Context identity.
    pub context_ref: ControlledExecutionContextRef,
    /// Body-free refs that identify the execution sources.
    pub source_refs: ExternalSourceRefSet,
    /// Safe responsibility summary for actor, work, trace, and reason.
    pub responsibility_context: ExecutionResponsibilityContext,
    /// Intake lifecycle status.
    pub intake_status: ControlledExecutionIntakeStatus,
    /// Optional reference-resolution result.
    pub resolution_ref: Option<ExecutionContextResolutionRef>,
    /// Optional audit trace for intake decisions.
    pub audit_trace_ref: Option<SandboxOpaqueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | sandbox 内部 context identity | application id generator 生成;repository load 重建。 |
| `source_refs` | `ExternalSourceRefSet` | 来源 refs 集合 | 来自 command / consumer input 或 resolver;不得保存外部正文。 |
| `responsibility_context` | `ExecutionResponsibilityContext` | actor/work/trace/reason safe summary | 由 resolver / entry metadata 形成;缺失时不得 accepted。 |
| `intake_status` | `ControlledExecutionIntakeStatus` | 受理状态 | 由 factory / transition method 修改。 |
| `resolution_ref` | `Option<ExecutionContextResolutionRef>` | refs 解析结果 | 来自 `ExecutionContextResolution`;可在 pending 时为空。 |
| `audit_trace_ref` | `Option<SandboxOpaqueRef>` | 审计 trace | `SandboxAuditTrace::append` 返回;不得伪造。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn accept(&mut self, resolution: &ExecutionContextResolution, identity: &ExecutionEnvironmentIdentity) -> Result<(), DomainError>` | 受理 context | resolution 必须支持 identity;identity 回指当前 context | `Result<(), DomainError>` | 状态进入 `Accepted`;不启动 boundary。 |
| `pub fn reject(&mut self, reason: SandboxReason, trace_ref: SandboxOpaqueRef) -> Result<(), DomainError>` | 拒绝 context | reason、trace ref | `Result<(), DomainError>` | 状态进入 `Rejected`;后续不得 launch。 |
| `pub fn close(&mut self, reason: SandboxReason) -> Result<(), DomainError>` | 收束 context | close reason | `Result<(), DomainError>` | 仅 accepted / unresolved 可进入 closed。 |
| `pub fn is_executable_context(&self) -> bool` | 判断是否可继续 | 无 | `bool` | 只有 `Accepted` 返回 true。 |
| `pub fn require_accepted(&self) -> Result<(), DomainError>` | 强制accepted前置 | 无 | `Result<(), DomainError>` | 非Accepted返回`InvalidStateTransition`;boundary / policy / run调用。 |
| `pub fn attach_boundary(&self, decision: &BoundaryEstablishmentDecision) -> Result<(), DomainError>` | 校验 boundary 回指 | decision 必须回指当前 context | `Result<(), DomainError>` | 不修改 boundary truth。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open_pending(context_ref: ControlledExecutionContextRef, source_refs: ExternalSourceRefSet, responsibility_context: ExecutionResponsibilityContext) -> Result<Self, DomainError>` | 创建待解析 context | id、source refs、responsibility | `Result<ControlledExecutionContext, DomainError>` | `OpenControlledExecutionContext` flow。 |
| `pub fn reject_unresolved(context_ref: ControlledExecutionContextRef, source_refs: ExternalSourceRefSet, reason: SandboxReason) -> Result<Self, DomainError>` | 创建无法解析的拒绝 context | id、source refs、reason | `Result<ControlledExecutionContext, DomainError>` | refs 缺失 / 冲突。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| accepted 前不得 launch | `intake_status != Accepted` 时 `StartControlledExecutionRun` 必须拒绝。 |
| 不保存外部正文 | 只保存 refs、safe summary、trace ref。 |
| 不等于 runtime execution | runtime agent loop 和 runtime lifecycle 只通过 handle / outcome 回链。 |

### 11.5 `ExecutionEnvironmentIdentity`

#### 类型定义

```rust
/// Binds a controlled execution context to a sandbox execution-environment identity.
pub struct ExecutionEnvironmentIdentity {
    /// Environment identity ref.
    pub environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Safe responsibility anchor.
    pub responsibility_anchor: ExecutionResponsibilityAnchor,
    /// Trace context shared across audit and material.
    pub trace_context: SandboxTraceContext,
    /// Identity lifecycle status.
    pub identity_status: ExecutionEnvironmentIdentityStatus,
}

/// Lifecycle of the sandbox execution-environment identity.
pub enum ExecutionEnvironmentIdentityStatus {
    /// Identity is active and may anchor boundary, policy, capture, and cleanup.
    Active,
    /// Identity is closed and read-only.
    Closed,
    /// Identity has been invalidated and must block new execution.
    Invalidated,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `environment_identity_ref` | `ExecutionEnvironmentIdentityRef` | 执行环境 identity | id generator 或 repository load。 |
| `context_ref` | `ControlledExecutionContextRef` | 回指 context | 必须指向 accepted context。 |
| `responsibility_anchor` | `ExecutionResponsibilityAnchor` | 责任锚点 | 来源于 responsibility context;不拥有 member truth。 |
| `trace_context` | `SandboxTraceContext` | trace 语境 | 来源于 core metadata 或 entry metadata。 |
| `identity_status` | `ExecutionEnvironmentIdentityStatus` | identity lifecycle | domain transition 修改。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn close(&mut self, trace_ref: SandboxOpaqueRef) -> Result<(), DomainError>` | 标记身份收束 | trace ref | `Result<(), DomainError>` | `Active -> Closed`。 |
| `pub fn invalidate(&mut self, reason: SandboxReason) -> Result<(), DomainError>` | 阻断后续执行 | invalid reason | `Result<(), DomainError>` | `Active -> Invalidated`;后续 boundary / run 不得继续。 |
| `pub fn can_anchor_boundary(&self) -> bool` | 判断能否作为 boundary anchor | 无 | `bool` | 只有 `Active` 返回 true。 |
| `pub fn require_active_for(&self, context: &ControlledExecutionContext) -> Result<(), DomainError>` | 强制identity / context绑定 | accepted context | `Result<(), DomainError>` | identity必须Active且`context_ref`匹配。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn bind(environment_identity_ref: ExecutionEnvironmentIdentityRef, context: &ControlledExecutionContext, responsibility_anchor: ExecutionResponsibilityAnchor, trace_context: SandboxTraceContext) -> Result<Self, DomainError>` | 为 accepted context 建立 execution identity | id、context、responsibility、trace | `Result<ExecutionEnvironmentIdentity, DomainError>` | intake accepted 后。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `Identity is active and may anchor boundary, policy, capture, and cleanup.` | 可被 boundary / policy / capture 引用 | `ExecutionEnvironmentIdentity::bind` | `Closed`;`Invalidated` |
| `Closed` | `Identity is closed and read-only.` | 只读收束 | `close` | 终态 |
| `Invalidated` | `Identity has been invalidated and must block new execution.` | 责任语境失效 | `invalidate` | failure / rejected surface |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不等于 actor truth | actor / member lifecycle 外部拥有。 |
| 不作为权限源 | policy / authorization 由外部摘要和 policy guard 处理。 |
| 匿名身份不能 accepted | 缺少 responsibility anchor 必须 rejected / unresolved。 |

### 11.6 `ExecutionContextResolution`

#### 类型定义

```rust
/// Records body-free reference resolution for a controlled execution context.
pub struct ExecutionContextResolution {
    /// Resolution identity.
    pub resolution_ref: ExecutionContextResolutionRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Resolved body-free refs.
    pub resolved_refs: ExternalSourceRefSet,
    /// Safe summaries used by guards.
    pub safe_summaries: SafeSummaryRefSet,
    /// Required items that remain unresolved.
    pub unresolved_items: Vec<SandboxReason>,
    /// Conflicts found during reference resolution.
    pub conflict_markers: Vec<SandboxReason>,
    /// Resolution status.
    pub resolution_status: ReferenceResolutionStatus,
}

/// Status of body-free reference resolution.
pub enum ReferenceResolutionStatus {
    /// Required references are resolved.
    Resolved,
    /// Non-core summaries are missing but safe degraded behavior is possible.
    Partial,
    /// Required references are not resolved.
    Unresolved,
    /// References or summaries conflict.
    Conflicted,
    /// Reference source is unavailable.
    Unavailable,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `resolution_ref` | `ExecutionContextResolutionRef` | 解析结果 id | id generator / repository。 |
| `context_ref` | `ControlledExecutionContextRef` | 回指 context | 来自待解析 context。 |
| `resolved_refs` | `ExternalSourceRefSet` | 已解析 refs | resolver outcome;body-free。 |
| `safe_summaries` | `SafeSummaryRefSet` | 安全摘要 refs | resolver outcome;不保存正文。 |
| `unresolved_items` | `Vec<SandboxReason>` | 缺失项 | resolver / guard 输出;不得保存 raw body。 |
| `conflict_markers` | `Vec<SandboxReason>` | 冲突项 | resolver / guard 输出。 |
| `resolution_status` | `ReferenceResolutionStatus` | 解析状态 | factory 按 outcome 决定。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_rejection(&self) -> bool` | 判断是否必须拒绝 | 无 | `bool` | `Conflicted` 或 required unresolved 返回 true。 |
| `pub fn supports_execution_identity(&self) -> bool` | 判断是否可建立 identity | 无 | `bool` | 只有 required refs + responsibility 可用。 |
| `pub fn missing_required_refs(&self) -> &[SandboxReason]` | 返回缺失项 | 无 | `&[SandboxReason]` | 不加载外部正文。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_resolver_result(resolution_ref: ExecutionContextResolutionRef, context_ref: ControlledExecutionContextRef, outcome: ContextResolverOutcome) -> Result<Self, DomainError>` | 从 resolver 输出构造解析结果 | id、context ref、resolver outcome | `Result<ExecutionContextResolution, DomainError>` | intake flow。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Resolved` | `Required references are resolved.` | 可继续受理 | resolver outcome | context accepted |
| `Partial` | `Non-core summaries are missing but safe degraded behavior is possible.` | 非核心摘要缺失 | resolver outcome | pending / degraded query |
| `Unresolved` | `Required references are not resolved.` | 必需 ref 缺失 | resolver outcome | context unresolved / rejected |
| `Conflicted` | `References or summaries conflict.` | refs 冲突 | resolver outcome | rejected / blocked |
| `Unavailable` | `Reference source is unavailable.` | 来源不可用 | resolver unavailable | delayed / pending |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 visibility policy | visibility / authorization 后续由 policy / query access decision 处理。 |
| 不保存外部正文 | 只保存 refs、summary refs、reason marker。 |
| conflicted 不得 accepted | conflict 必须阻断正式执行。 |

### 11.7 `BoundaryRequirementSet`

#### 类型定义

```rust
/// Describes resource, filesystem, network, process, and workspace boundaries that must hold together.
pub struct BoundaryRequirementSet {
    /// Boundary requirement identity.
    pub requirement_ref: BoundaryRequirementSetRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Execution identity bound to the context.
    pub environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// Validated coherent-boundary profile reference.
    pub boundary_profile_ref: SandboxOpaqueRef,
    /// Validated coherent limit template reference.
    pub limit_template_ref: SandboxOpaqueRef,
    /// Atomically published runtime generation reference.
    pub runtime_generation_ref: SandboxOpaqueRef,
    /// Required resource limits.
    pub resource_limits: ResourceLimitSet,
    /// Filesystem boundary requirements.
    pub filesystem_boundary: FilesystemBoundaryRequirement,
    /// Network boundary requirements.
    pub network_boundary: NetworkBoundaryRequirement,
    /// Process boundary requirements.
    pub process_boundary: ProcessBoundaryRequirement,
    /// Workspace and mount requirements.
    pub workspace_boundary: WorkspaceBoundaryRequirement,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `requirement_ref` | `BoundaryRequirementSetRef` | requirement id | id generator / repository。 |
| `context_ref` | `ControlledExecutionContextRef` | 回指 context | accepted context。 |
| `environment_identity_ref` | `ExecutionEnvironmentIdentityRef` | 绑定执行环境身份 | active identity;必须与context一一匹配。 |
| `boundary_profile_ref` | `SandboxOpaqueRef` | 已验证四维profile | `SandboxBoundaryProfileConfig`;由runtime builder作为typed parameter注入service。 |
| `limit_template_ref` | `SandboxOpaqueRef` | 同代完整限制模板 | `SandboxBoundaryProfileConfig`;必须覆盖resource / filesystem / network / process。 |
| `runtime_generation_ref` | `SandboxOpaqueRef` | 已发布runtime代次 | LD-24 generation-scoped service set -> `BoundaryEstablishmentService` constructor;禁止跨代拼装。 |
| `resource_limits` | `ResourceLimitSet` | CPU / memory / time / IO 等限制摘要 | command显式requirements + validated boundary profile;不由policy或capability反向生成。 |
| `filesystem_boundary` | `FilesystemBoundaryRequirement` | 文件系统隔离要求 | boundary profile summary;不得包含外部 body。 |
| `network_boundary` | `NetworkBoundaryRequirement` | 网络隔离要求 | command显式requirements + boundary profile;unknown 不得 allow。 |
| `process_boundary` | `ProcessBoundaryRequirement` | 进程隔离要求 | command显式requirements + boundary profile;capability只验证能否满足。 |
| `workspace_boundary` | `WorkspaceBoundaryRequirement` | workspace / mount 要求 | safe summary refs;不保存 workspace body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_no_network(&self) -> bool` | 判断是否要求 no-egress | 无 | `bool` | 纯判断。 |
| `pub fn all_limit_kinds(&self) -> Vec<BoundaryLimitKind>` | 返回限制类别 | 无 | `Vec<BoundaryLimitKind>` | 不读取 adapter。 |
| `pub fn is_satisfied_by(&self, capability: &BackendCapabilitySummary) -> bool` | 判断 backend 能力是否覆盖要求 | capability summary | `bool` | 只比较 summary,不调用 backend。 |
| `pub fn require_context(&self, context: &ControlledExecutionContext) -> Result<(), DomainError>` | 校验requirement归属 | accepted context | `Result<(), DomainError>` | `context_ref`必须匹配且context仍可执行;policy flow读取后调用。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_context_and_requirements(requirement_ref: BoundaryRequirementSetRef, context: &ControlledExecutionContext, identity: &ExecutionEnvironmentIdentity, resource_limits: ResourceLimitSet, filesystem_boundary: FilesystemBoundaryRequirement, network_boundary: NetworkBoundaryRequirement, process_boundary: ProcessBoundaryRequirement, workspace_boundary: WorkspaceBoundaryRequirement, boundary_profile_ref: SandboxOpaqueRef, limit_template_ref: SandboxOpaqueRef, runtime_generation_ref: SandboxOpaqueRef) -> Result<Self, DomainError>` | 合成 boundary 要求 | id、accepted context、matching active identity、显式四维要求和builder注入service的profile / template / generation | `Result<BoundaryRequirementSet, DomainError>` | establish boundary flow;不得读取policy snapshot或raw config。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| coherent boundary 必须整体成立 | 任一 resource / filesystem / network / process 限制不可落实,不得 established。 |
| 不硬编码 backend 产品 | Docker/gVisor/k8s/local_process 等不是字段。 |
| 配置不得弱化红线 | 配置只提供 profile / adapter binding,不得改变 fail-closed / no-egress 等不变量。 |
| Boundary 不依赖 Policy | `PolicyApplicabilitySnapshot` / `PolicyExecutionDecision` 均由后序 policy flow 产生;本对象只向 policy 提供 requirement ref。 |

### 11.8 `CoherentBoundary` 与 `BoundaryEstablishmentDecision`

#### 类型定义

```rust
/// Represents an established sandbox boundary that must not silently degrade.
pub struct CoherentBoundary {
    /// Boundary identity.
    pub boundary_ref: CoherentBoundaryRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Requirement set used to establish the boundary.
    pub requirement_ref: BoundaryRequirementSetRef,
    /// Establishment decision.
    pub decision_ref: BoundaryEstablishmentDecisionRef,
    /// Isolation handle if established.
    pub isolation_handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// Boundary coherence status.
    pub boundary_status: BoundaryCoherenceStatus,
}

/// Records the decision produced while establishing a boundary.
pub struct BoundaryEstablishmentDecision {
    /// Decision identity.
    pub decision_ref: BoundaryEstablishmentDecisionRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Requirement set being decided.
    pub requirement_ref: BoundaryRequirementSetRef,
    /// Decision status.
    pub decision_status: BoundaryDecisionStatus,
    /// Decision reason.
    pub decision_reason: SandboxReason,
    /// Backend capability summary used by the decision.
    pub backend_capability_ref: Option<BackendCapabilitySummaryRef>,
}

/// Coherence status of an established or rejected boundary.
pub enum BoundaryCoherenceStatus {
    /// Boundary is not established yet.
    Pending,
    /// Boundary is coherent and active.
    Coherent,
    /// Boundary is rejected before launch.
    Rejected,
    /// Boundary is failed and requires cleanup or failure classification.
    Failed,
    /// Boundary was released after cleanup.
    Released,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `boundary_ref` | `CoherentBoundaryRef` | boundary truth id | id generator / repository。 |
| `context_ref` | `ControlledExecutionContextRef` | 回指 context | accepted context。 |
| `requirement_ref` | `BoundaryRequirementSetRef` | 回指要求 | same-tx constructed 或 repository loaded。 |
| `decision_ref` | `BoundaryEstablishmentDecisionRef` | 回指裁定 | boundary service decision。 |
| `isolation_handle_ref` | `Option<IsolationEnvironmentHandleRef>` | 隔离环境 handle | 只有 established path 存在。 |
| `decision_status` | `BoundaryDecisionStatus` | 裁定状态 | guard / backend outcome。 |
| `decision_reason` | `SandboxReason` | 裁定原因 | backend capability / guard / adapter outcome。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_established(&self) -> bool` | 判断边界是否成立 | 无 | `bool` | 只有 `Coherent` 且有 handle 返回 true。 |
| `pub fn contains_weak_fallback(&self) -> bool` | 判断是否弱化 fallback | 无 | `bool` | 当前设计应始终 false;若 true 必须 DomainError。 |
| `pub fn requires_cleanup_on_failure(&self) -> bool` | 判断失败是否需 cleanup | 无 | `bool` | failed + handle 存在时 true。 |
| `pub fn permits_launch(&self) -> bool` | 判断是否允许 launch | 无 | `bool` | 只有 established decision + coherent boundary。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn established(decision_ref: BoundaryEstablishmentDecisionRef, requirement: &BoundaryRequirementSet, capability: &BackendCapabilitySummary) -> Result<Self, DomainError>` | 创建已成立boundary裁定 | decision id、完整requirement、fresh capability | `Result<BoundaryEstablishmentDecision, DomainError>` | adapter established且capability覆盖全部要求。 |
| `pub fn reject(decision_ref: BoundaryEstablishmentDecisionRef, requirement: &BoundaryRequirementSet, capability: Option<&BackendCapabilitySummary>, reason: SandboxReason) -> Result<Self, DomainError>` | 创建拒绝裁定 | decision id、requirement、可选capability、safe reason | `Result<BoundaryEstablishmentDecision, DomainError>` | requirement非法、capability不支持或adapter明确拒绝。 |
| `pub fn failed(decision_ref: BoundaryEstablishmentDecisionRef, requirement: &BoundaryRequirementSet, capability: Option<&BackendCapabilitySummary>, reason: SandboxReason) -> Result<Self, DomainError>` | 创建失败裁定 | decision id、requirement、可选capability、safe reason | `Result<BoundaryEstablishmentDecision, DomainError>` | adapter unavailable / failed且不得伪造established。 |
| `pub fn established(boundary_ref: CoherentBoundaryRef, decision: BoundaryEstablishmentDecision, handle: IsolationEnvironmentHandle) -> Result<Self, DomainError>` | 创建成立的 coherent boundary | boundary id、decision、handle | `Result<CoherentBoundary, DomainError>` | boundary establish success。 |
| `pub fn rejected(boundary_ref: CoherentBoundaryRef, decision: BoundaryEstablishmentDecision) -> Result<Self, DomainError>` | 创建拒绝 boundary | boundary id、decision | `Result<CoherentBoundary, DomainError>` | requirement invalid / capability unsupported / adapter rejection。 |
| `pub fn failed(boundary_ref: CoherentBoundaryRef, decision: BoundaryEstablishmentDecision, handle_ref: Option<IsolationEnvironmentHandleRef>) -> Result<Self, DomainError>` | 创建失败boundary | boundary id、failed decision、可选partial handle ref | `Result<CoherentBoundary, DomainError>` | adapter failed / unavailable;partial handle只触发cleanup义务,不得permits launch。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `Boundary is not established yet.` | 等待裁定 | requirement creation | `Coherent`;`Rejected`;`Failed` |
| `Coherent` | `Boundary is coherent and active.` | 可 launch | established decision + handle | `Released`;`Failed` |
| `Rejected` | `Boundary is rejected before launch.` | launch 阻断 | rejection decision | failure classification |
| `Failed` | `Boundary is failed and requires cleanup or failure classification.` | 建立 / 运行失败 | backend / lifecycle outcome | cleanup / failure |
| `Released` | `Boundary was released after cleanup.` | 已释放 | cleanup / lease release | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不允许 silent degrade | 任何必需限制不能落实都不得 `Coherent`。 |
| boundary 不拥有 backend truth | backend 真实生命周期由 adapter / backend 外部拥有。 |
| host-run / weak fallback 禁止 | 测试承载或 fallback 不得伪装 established boundary。 |

### 11.9 `BackendCapabilitySummary` 与 `IsolationEnvironmentHandle`

#### 类型定义

```rust
/// Summarizes backend capability without owning backend truth.
pub struct BackendCapabilitySummary {
    /// Capability summary identity.
    pub capability_ref: BackendCapabilitySummaryRef,
    /// Backend profile reference.
    pub backend_profile_ref: SandboxOpaqueRef,
    /// Supported boundary limit kinds.
    pub supported_limit_kinds: Vec<BoundaryLimitKind>,
    /// Capability freshness status.
    pub capability_status: BackendCapabilityStatus,
    /// Unsupported reason if capability cannot satisfy requirements.
    pub unsupported_reason: Option<SandboxReason>,
}

/// References a sandbox isolation environment created by a backend adapter.
pub struct IsolationEnvironmentHandle {
    /// Handle identity.
    pub isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Backend profile reference.
    pub backend_profile_ref: SandboxOpaqueRef,
    /// Handle lifecycle status.
    pub handle_status: IsolationHandleStatus,
    /// Lease reference if lease is active.
    pub lease_ref: Option<LeaseRecordRef>,
}

/// Freshness and usability of backend capability.
pub enum BackendCapabilityStatus {
    /// Capability summary is fresh and usable.
    Fresh,
    /// Capability summary is stale.
    Stale,
    /// Backend cannot support the requested boundary.
    Unsupported,
    /// Capability is unknown.
    Unknown,
    /// Backend is unavailable.
    Unavailable,
}

/// Lifecycle status of an isolation environment handle.
pub enum IsolationHandleStatus {
    /// Handle is active.
    Active,
    /// Handle is being released.
    ReleasePending,
    /// Handle was released.
    Released,
    /// Handle is suspected orphaned.
    OrphanSuspected,
    /// Handle failed.
    Failed,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `capability_ref` | `BackendCapabilitySummaryRef` | capability summary id | backend capability adapter / repository。 |
| `backend_profile_ref` | `SandboxOpaqueRef` | backend profile | config / adapter binding summary;不指向 SDK body。 |
| `supported_limit_kinds` | `Vec<BoundaryLimitKind>` | 支持的限制类型 | adapter summary;ordered unique。 |
| `capability_status` | `BackendCapabilityStatus` | 新鲜度 / 可用状态 | adapter / refresh job outcome。 |
| `unsupported_reason` | `Option<SandboxReason>` | 不支持原因 | adapter outcome;不保存 raw error。 |
| `isolation_handle_ref` | `IsolationEnvironmentHandleRef` | handle id | isolation backend adapter outcome。 |
| `handle_status` | `IsolationHandleStatus` | handle lifecycle | adapter signal / lease / cleanup flow。 |
| `lease_ref` | `Option<LeaseRecordRef>` | lease 回指 | lease creation。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn supports(&self, requirements: &BoundaryRequirementSet) -> bool` | 判断 capability 是否覆盖要求 | boundary requirements | `bool` | `Fresh` 且 limit kinds 覆盖才 true。 |
| `pub fn requires_refresh(&self) -> bool` | 判断是否需刷新 | 无 | `bool` | `Stale` / `Unknown` / `Unavailable` 返回 true。 |
| `pub fn mark_release_pending(&mut self) -> Result<(), DomainError>` | 标记释放中 | 无 | `Result<(), DomainError>` | active -> release pending。 |
| `pub fn mark_orphan_suspected(&mut self, reason: SandboxReason) -> Result<(), DomainError>` | 标记疑似孤儿 | reason | `Result<(), DomainError>` | 触发 orphan / cleanup。 |
| `pub fn with_lease(self, lease_ref: LeaseRecordRef) -> Result<Self, DomainError>` | 绑定同事务lease | lease ref | `Result<IsolationEnvironmentHandle, DomainError>` | 仅Active且原lease为空;返回带lease ref的新handle。 |
| `pub fn require_active_for_boundary(&self, boundary: &CoherentBoundary) -> Result<LeaseRecordRef, DomainError>` | 校验run可消费的handle并返回typed lease ref | established boundary | `Result<LeaseRecordRef, DomainError>` | handle必须Active、context / handle ref与boundary一致且lease ref存在;不得扫描latest lease。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_adapter_summary(capability_ref: BackendCapabilitySummaryRef, backend_profile_ref: SandboxOpaqueRef, supported_limit_kinds: Vec<BoundaryLimitKind>, capability_status: BackendCapabilityStatus) -> Result<Self, DomainError>` | 从 adapter summary 构造能力摘要 | id、profile、limits、status | `Result<BackendCapabilitySummary, DomainError>` | capability refresh / boundary establish。 |
| `pub fn active(isolation_handle_ref: IsolationEnvironmentHandleRef, context_ref: ControlledExecutionContextRef, backend_profile_ref: SandboxOpaqueRef) -> Result<Self, DomainError>` | 创建 active handle | handle id、context、backend profile | `Result<IsolationEnvironmentHandle, DomainError>` | isolation backend launch success。 |
| `pub fn failed(isolation_handle_ref: IsolationEnvironmentHandleRef, context_ref: ControlledExecutionContextRef, backend_profile_ref: SandboxOpaqueRef) -> Result<Self, DomainError>` | 保存partial / failed handle marker | handle id、context、backend profile | `Result<IsolationEnvironmentHandle, DomainError>` | adapter失败但已产生需cleanup handle;不得用于launch。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| capability unknown 不得 allow | unknown / stale / unavailable 必须 pending / rejected / failed。 |
| handle 不保存 SDK 原始响应 | 只保存 stable handle ref、profile ref、status、lease ref。 |
| orphan suspected 必须进入 cleanup / reaper | 不得继续假装环境可用。 |

### 11.10 `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision` 与 `HighRiskActionDecision`

#### 类型定义

```rust
/// Carries body-free policy and authorization inputs for sandbox policy execution.
pub struct PolicyApplicabilitySnapshot {
    /// Policy snapshot identity.
    pub snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Policy source refs.
    pub policy_refs: ExternalSourceRefSet,
    /// Body-free authorization summary references.
    pub authorization_summary_refs: SafeSummaryRefSet,
    /// Explicit authorization disposition derived by the policy adapter.
    pub authorization_disposition: PolicyAuthorizationDisposition,
    /// Applicability status.
    pub applicability_status: PolicyApplicabilityStatus,
    /// High-risk action markers.
    pub high_risk_markers: Vec<HighRiskActionMarker>,
}

/// Decides whether sandbox may launch under the supplied policy snapshot.
pub struct PolicyExecutionDecision {
    /// Decision identity.
    pub decision_ref: PolicyExecutionDecisionRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Boundary requirement being evaluated.
    pub boundary_requirement_ref: BoundaryRequirementSetRef,
    /// Policy snapshot used for the decision.
    pub snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// Decision status.
    pub decision_status: PolicyExecutionDecisionStatus,
    /// Decision reason.
    pub decision_reason: SandboxReason,
    /// Audit trace reference.
    pub audit_trace_ref: Option<SandboxOpaqueRef>,
}

/// Decides whether a high-risk action may proceed.
pub struct HighRiskActionDecision {
    /// Action decision identity.
    pub action_decision_ref: HighRiskActionDecisionRef,
    /// Owning policy decision.
    pub policy_decision_ref: PolicyExecutionDecisionRef,
    /// High-risk action markers.
    pub action_markers: Vec<HighRiskActionMarker>,
    /// Action decision status.
    pub action_status: HighRiskActionDecisionStatus,
    /// Blocking reason if blocked.
    pub block_reason: Option<SandboxReason>,
}

/// One body-free high-risk action marker with an explicit source disposition.
pub struct HighRiskActionMarker {
    /// Stable marker identity.
    pub marker_ref: SandboxOpaqueRef,
    /// High-risk action category.
    pub action_kind: HighRiskActionKind,
    /// Explicit source-side authorization disposition.
    pub source_disposition: HighRiskActionSourceDisposition,
    /// Optional body-free reason.
    pub reason: Option<SandboxReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `policy_refs` | `ExternalSourceRefSet` | policy / approval / capability refs | policy summary port;不保存 policy DSL / allowlist / approval body。 |
| `authorization_summary_refs` | `SafeSummaryRefSet` | 授权摘要refs | request + policy adapter;缺失时不能allow。 |
| `authorization_disposition` | `PolicyAuthorizationDisposition` | 显式允许 /拒绝 /不确定结论 | policy adapter从body-free summary判定;service不得解析ref或reason猜结论。 |
| `applicability_status` | `PolicyApplicabilityStatus` | policy 输入可用性 | guard output。 |
| `high_risk_markers` | `Vec<HighRiskActionMarker>` | 高风险动作 | boundary / policy summary / requested action marker。 |
| `decision_status` | `PolicyExecutionDecisionStatus` | launch 裁定 | factory / guard output。 |
| `decision_reason` | `SandboxReason` | 裁定原因 | guard / policy / backend capability。 |
| `action_status` | `HighRiskActionDecisionStatus` | 高风险动作裁定 | `decide` output。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_evaluate(&self) -> bool` | 判断 policy snapshot 是否可裁定 | 无 | `bool` | 只有 applicable 且非 stale / conflicted。 |
| `pub fn requires_fail_closed(&self) -> bool` | 判断是否 fail-closed | 无 | `bool` | applicability非Applicable或authorization为Missing / Conflicted / Unsupported返回true。 |
| `pub fn explicitly_denies_execution(&self) -> bool` | 判断是否显式拒绝 | 无 | `bool` | 仅authorization disposition为Denied返回true。 |
| `pub fn permits_execution(&self) -> bool` | 判断 launch 是否允许 | 无 | `bool` | 只有 `Accepted` 返回 true。 |
| `pub fn must_block_launch(&self) -> bool` | 判断是否阻断 launch | 无 | `bool` | `Rejected` / `Blocked` / `FailClosed` true。 |
| `pub fn requires_redline_containment(&self) -> bool` | 判断是否需 redline | 无 | `bool` | blocked high-risk 可触发。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_policy_summary(snapshot_ref: PolicyApplicabilitySnapshotRef, context_ref: ControlledExecutionContextRef, policy_refs: ExternalSourceRefSet, authorization_summary_refs: SafeSummaryRefSet, authorization_disposition: PolicyAuthorizationDisposition, high_risk_markers: Vec<HighRiskActionMarker>, applicability_status: PolicyApplicabilityStatus) -> Result<Self, DomainError>` | 构造policy snapshot | id、context、policy refs、authorization refs / disposition、markers、applicability | `Result<PolicyApplicabilitySnapshot, DomainError>` | policy adapter output mapping。 |
| `pub fn accept(decision_ref: PolicyExecutionDecisionRef, snapshot: &PolicyApplicabilitySnapshot, requirements: &BoundaryRequirementSet, trace_ref: Option<SandboxOpaqueRef>) -> Result<Self, DomainError>` | 创建 allow 裁定 | decision id、snapshot、requirements、trace | `Result<PolicyExecutionDecision, DomainError>` | policy accepted。 |
| `pub fn reject(decision_ref: PolicyExecutionDecisionRef, snapshot: &PolicyApplicabilitySnapshot, requirements: &BoundaryRequirementSet, reason: SandboxReason, trace_ref: Option<SandboxOpaqueRef>) -> Result<Self, DomainError>` | 创建拒绝裁定 | decision id、snapshot、requirements、safe reason、trace | `Result<PolicyExecutionDecision, DomainError>` | policy summary明确拒绝。 |
| `pub fn fail_closed(decision_ref: PolicyExecutionDecisionRef, snapshot: &PolicyApplicabilitySnapshot, requirements: &BoundaryRequirementSet, reason: SandboxReason, trace_ref: Option<SandboxOpaqueRef>) -> Result<Self, DomainError>` | 创建 fail-closed 裁定 | id、snapshot、requirements、reason、trace | `Result<PolicyExecutionDecision, DomainError>` | missing / stale / conflicted。 |
| `pub fn block(decision_ref: PolicyExecutionDecisionRef, snapshot: &PolicyApplicabilitySnapshot, requirements: &BoundaryRequirementSet, reason: SandboxReason, trace_ref: Option<SandboxOpaqueRef>) -> Result<Self, DomainError>` | 创建高风险阻断裁定 | decision id、snapshot、requirements、safe reason、trace | `Result<PolicyExecutionDecision, DomainError>` | high-risk marker blocked / unsupported。 |
| `pub fn decide(action_decision_ref: HighRiskActionDecisionRef, decision_ref: PolicyExecutionDecisionRef, markers: Vec<HighRiskActionMarker>) -> Result<HighRiskActionDecision, DomainError>` | 创建 high-risk 裁定 | id、policy decision ref、markers | `Result<HighRiskActionDecision, DomainError>` | high-risk action check。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| policy source truth 外部拥有 | sandbox 只消费 refs / summaries / authorization。 |
| unknown 不得 allow | missing / stale / conflicted / unsupported 必须 pending / fail-closed / rejected。 |
| 不解释 tools semantic policy | tools semantic execution 和 action taxonomy owner 在上游。 |

### 11.11 `ControlledExecutionRun`、`CaptureFact` 与 `HandoffFact`

#### 类型定义

```rust
/// Represents the sandbox-owned lifecycle of a controlled execution run.
pub struct ControlledExecutionRun {
    /// Run identity.
    pub run_ref: ControlledExecutionRunRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Boundary used by the run.
    pub boundary_ref: CoherentBoundaryRef,
    /// Policy decision used by the run.
    pub policy_decision_ref: PolicyExecutionDecisionRef,
    /// Run lifecycle status.
    pub run_status: ControlledExecutionRunStatus,
    /// Isolation handle used by backend adapter.
    pub isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// Logical start time.
    pub started_at: Option<SandboxInstant>,
    /// Logical finish time.
    pub finished_at: Option<SandboxInstant>,
}

/// Records captured material and output facts produced by a controlled run.
pub struct CaptureFact {
    /// Capture identity.
    pub capture_ref: CaptureFactRef,
    /// Source run.
    pub run_ref: ControlledExecutionRunRef,
    /// Captured material refs.
    pub material_refs: Vec<CapturedMaterialRef>,
    /// Observability material refs.
    pub observability_refs: Vec<ObservabilityMaterialRef>,
    /// Capture status.
    pub capture_status: CaptureStatus,
    /// Audit trace reference.
    pub audit_trace_ref: Option<SandboxOpaqueRef>,
}

/// Body-free reference to captured material.
pub struct CapturedMaterialRef {
    /// Material reference identity.
    pub material_ref: SandboxOpaqueRef,
    /// Material kind.
    pub material_kind: MaterialKind,
    /// Optional material digest.
    pub material_digest: Option<SandboxDigest>,
}

/// Records a sandbox-side handoff fact without claiming downstream ownership.
pub struct HandoffFact {
    /// Handoff identity.
    pub handoff_ref: HandoffFactRef,
    /// Source capture.
    pub source_capture_ref: CaptureFactRef,
    /// Target kind.
    pub target_kind: HandoffTargetKind,
    /// Handoff status.
    pub handoff_status: HandoffStatus,
    /// Downstream receipt reference if delivered.
    pub receipt_ref: Option<SandboxOpaqueRef>,
    /// Failure reason if failed.
    pub failure_reason: Option<SandboxReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `run_ref` | `ControlledExecutionRunRef` | run identity | id generator / repository。 |
| `boundary_ref` | `CoherentBoundaryRef` | run 使用的 coherent boundary | 必须 established。 |
| `policy_decision_ref` | `PolicyExecutionDecisionRef` | launch policy 裁定 | 必须 accepted。 |
| `isolation_handle_ref` | `IsolationEnvironmentHandleRef` | backend handle | isolation backend adapter outcome。 |
| `material_refs` | `Vec<CapturedMaterialRef>` | captured material | capture adapter output;不保存 artifact body。 |
| `observability_refs` | `Vec<ObservabilityMaterialRef>` | observability material | observability handoff adapter;不保存 store body。 |
| `handoff_status` | `HandoffStatus` | handoff lifecycle | handoff adapter / feedback consumer。 |
| `receipt_ref` | `Option<SandboxOpaqueRef>` | downstream receipt | handoff ack;不得伪造。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_running(&mut self, started_at: SandboxInstant) -> Result<(), DomainError>` | 标记运行中 | logical start time | `Result<(), DomainError>` | `Preparing -> Running`。 |
| `pub fn mark_completed(&mut self, finished_at: SandboxInstant) -> Result<(), DomainError>` | 标记完成 | finish time | `Result<(), DomainError>` | `Running -> Completed`。 |
| `pub fn mark_failed(&mut self, reason: SandboxReason, finished_at: SandboxInstant) -> Result<(), DomainError>` | 标记失败 | reason、finish time | `Result<(), DomainError>` | `Preparing/Running -> Failed`。 |
| `pub fn is_complete(&self) -> bool` | capture 是否完整 | 无 | `bool` | `CaptureStatus::Complete` 才 true。 |
| `pub fn requires_handoff(&self) -> bool` | capture 是否需要 handoff | 无 | `bool` | 有 material 或 observability refs。 |
| `pub fn can_retry(&self) -> bool` | handoff 是否可重试 | 无 | `bool` | 只有 retryable status。 |
| `pub fn blocks_cleanup(&self) -> bool` | handoff 是否阻断 cleanup | 无 | `bool` | pending / retryable / failed 按 guard 判断。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(run_ref: ControlledExecutionRunRef, context: &ControlledExecutionContext, boundary: &CoherentBoundary, policy: &PolicyExecutionDecision, handle: &IsolationEnvironmentHandle) -> Result<Self, DomainError>` | 创建待运行 run | run id、context、boundary、policy、handle | `Result<ControlledExecutionRun, DomainError>` | launch 前。 |
| `pub fn complete(capture_ref: CaptureFactRef, run_ref: ControlledExecutionRunRef, material_refs: Vec<CapturedMaterialRef>, observability_refs: Vec<ObservabilityMaterialRef>) -> Result<CaptureFact, DomainError>` | 创建完整 capture fact | capture id、run ref、materials、observability | `Result<CaptureFact, DomainError>` | capture success。 |
| `pub fn open_pending(handoff_ref: HandoffFactRef, capture_ref: CaptureFactRef, target_kind: HandoffTargetKind) -> Result<HandoffFact, DomainError>` | 创建待交接 handoff | handoff id、capture ref、target kind | `Result<HandoffFact, DomainError>` | handoff start。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| run 不等于 runtime loop | 不保存 agent loop、tool semantic、runtime internal state。 |
| capture 不等于 artifact truth | `CapturedMaterialRef` 只是 sandbox 候选材料 / output ref。 |
| handoff failure 不回滚 capture truth | handoff / relay failure 只影响 handoff state、cleanup guard、retry / report。 |

### 11.12 `FailureClassification`、`CleanupGuard` 与 `RedlineContainment`

> Current canonical redirect: 本节属于原轮次 historical reviewed material。`FailureClassification`、`CleanupGuard`、`RedlineContainment` 的当前唯一可落码契约分别位于 `03_ddd_step_06_object_contracts_failure_cleanup_read.md` §12.1、§14.2、§14.4；batch 4 closure audit 位于同分件 §14A，当前等待用户审查。下列旧 public fields、`SandboxOpaqueRef`、caller-selected kind 和泛化 `DomainError` 不得实现或建立 alias。

#### 类型定义

```rust
/// Classifies non-happy-path outcomes in sandbox-owned terms.
pub struct FailureClassification {
    /// Failure identity.
    pub failure_ref: FailureClassificationRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Optional source run.
    pub run_ref: Option<ControlledExecutionRunRef>,
    /// Failure kind.
    pub failure_kind: SandboxFailureKind,
    /// Failure status.
    pub failure_status: FailureClassificationStatus,
    /// Source markers.
    pub source_markers: Vec<SandboxReason>,
    /// Audit trace reference.
    pub audit_trace_ref: Option<SandboxOpaqueRef>,
}

/// Guards cleanup and release against loss of capture, handoff, audit, or investigation material.
pub struct CleanupGuard {
    /// Cleanup guard identity.
    pub cleanup_guard_ref: CleanupGuardRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Capture fact required before cleanup.
    pub capture_ref: Option<CaptureFactRef>,
    /// Handoff fact required before cleanup.
    pub handoff_ref: Option<HandoffFactRef>,
    /// Investigation handoff summary.
    pub investigation_summary: Option<InvestigationHandoffSummary>,
    /// Cleanup guard status.
    pub guard_status: CleanupGuardStatus,
    /// Reasons blocking cleanup.
    pub blocking_reasons: Vec<SandboxReason>,
}

/// Contains a security redline and its investigation handoff lifecycle.
pub struct RedlineContainment {
    /// Redline identity.
    pub redline_ref: RedlineContainmentRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Redline kind.
    pub redline_kind: RedlineKind,
    /// Containment status.
    pub containment_status: RedlineContainmentStatus,
    /// Investigation handoff summary.
    pub handoff_summary: Option<InvestigationHandoffSummary>,
    /// Release guard reference.
    pub release_guard_ref: Option<CleanupGuardRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `failure_kind` | `SandboxFailureKind` | 失败分类 | policy deny、timeout、backend failure、capture failure、handoff failure、resource exceeded、orphan、redline。 |
| `failure_status` | `FailureClassificationStatus` | 失败状态 | classify / supersede / terminal transition。 |
| `source_markers` | `Vec<SandboxReason>` | 失败来源 | adapter outcome、guard、control signal;不保存 raw logs。 |
| `capture_ref` | `Option<CaptureFactRef>` | cleanup 所需 capture | capture fact;缺失时 pending / blocked。 |
| `handoff_ref` | `Option<HandoffFactRef>` | cleanup 所需 handoff | handoff fact;失败 / retryable 可阻断。 |
| `investigation_summary` | `Option<InvestigationHandoffSummary>` | investigation 状态 | external investigation handoff summary ref,不保存正文。 |
| `redline_kind` | `RedlineKind` | 红线类别 | policy / runtime / filesystem / network / process / secret marker。 |
| `handoff_summary` | `Option<InvestigationHandoffSummary>` | 安全调查交接 | investigation adapter outcome。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_terminal_failure(&self) -> bool` | 判断失败是否终态 | 无 | `bool` | terminal true。 |
| `pub fn requires_cleanup_guard(&self) -> bool` | 判断是否需要 cleanup guard | 无 | `bool` | backend/capture/handoff/resource/redline 常为 true。 |
| `pub fn requires_redline_containment(&self) -> bool` | 判断是否升级 redline | 无 | `bool` | redline kind true。 |
| `pub fn allows_cleanup(&self) -> bool` | 判断 cleanup 是否允许 | 无 | `bool` | guard status allowed 且无 blocker。 |
| `pub fn blocks_release(&self) -> bool` | 判断是否阻断 release | 无 | `bool` | pending evidence / investigation / redline true。 |
| `pub fn requires_investigation_handoff(&self) -> bool` | 判断 redline 是否需调查交接 | 无 | `bool` | detected / contained / handoff pending true。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn classify(failure_ref: FailureClassificationRef, context_ref: ControlledExecutionContextRef, failure_kind: SandboxFailureKind, source_markers: Vec<SandboxReason>) -> Result<FailureClassification, DomainError>` | 创建失败分类 | id、context、kind、markers | `Result<FailureClassification, DomainError>` | failure flow。 |
| `pub fn evaluate(cleanup_guard_ref: CleanupGuardRef, context_ref: ControlledExecutionContextRef, capture_ref: Option<CaptureFactRef>, handoff_ref: Option<HandoffFactRef>, investigation_summary: Option<InvestigationHandoffSummary>) -> Result<CleanupGuard, DomainError>` | 创建 cleanup guard | id、context、capture、handoff、investigation | `Result<CleanupGuard, DomainError>` | cleanup readiness。 |
| `pub fn detect(redline_ref: RedlineContainmentRef, context_ref: ControlledExecutionContextRef, redline_kind: RedlineKind) -> Result<RedlineContainment, DomainError>` | 创建 redline containment | id、context、kind | `Result<RedlineContainment, DomainError>` | redline signal。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| failure 不伪装 success | 所有 deny / timeout / backend / capture / handoff / resource / redline 必须显式分类或 pending。 |
| cleanup 不得先删证据 | capture / handoff / audit / investigation 未安全交接前只能 blocked / pending。 |
| redline 不 advisory-only | 检测到红线必须 containment / handoff / release guard,不得只打日志。 |

### 11.13 `LeaseRecord`、`OrphanRecoveryRecord` 与 `ControlFact`

> Current canonical redirect: 本节属于原轮次 historical reviewed material。`ControlFact` 与 `ControlConflictGuard` 的当前唯一可落码契约位于 `03_ddd_step_06_object_contracts_failure_cleanup_read.md` §12.2~§12.3；`LeaseRecord` / `OrphanRecoveryRecord` 的当前唯一契约已由同分件 batch 3 §13.2~§13.3及§13A闭合。下列旧 status、裸 ref、`conflicts_with` bool 与泛化 `DomainError` 不得实现或建立 compatibility path。

#### 类型定义

```rust
/// Records lease information for an isolation environment.
pub struct LeaseRecord {
    /// Lease identity.
    pub lease_ref: LeaseRecordRef,
    /// Isolation handle.
    pub isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Lease status.
    pub lease_status: LeaseStatus,
    /// Lease time window.
    pub lease_window: LeaseWindow,
    /// Reaper eligibility marker.
    pub reaper_marker: Option<ReaperEligibilityMarker>,
}

/// Records conservative recovery of an orphaned isolation environment.
pub struct OrphanRecoveryRecord {
    /// Orphan recovery record identity.
    pub orphan_record_ref: OrphanRecoveryRecordRef,
    /// Source lease.
    pub lease_ref: LeaseRecordRef,
    /// Isolation handle.
    pub isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// Orphan recovery status.
    pub orphan_status: OrphanRecoveryStatus,
    /// Backend lifecycle summary.
    pub backend_lifecycle_summary: BackendLifecycleSummary,
    /// Cleanup guard reference.
    pub cleanup_guard_ref: Option<CleanupGuardRef>,
}

/// Records an accepted or rejected control action.
pub struct ControlFact {
    /// Control fact identity.
    pub control_ref: ControlFactRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Control kind.
    pub control_kind: SandboxControlKind,
    /// Body-free control source.
    pub control_source: ControlSourceContext,
    /// Control status.
    pub control_status: ControlFactStatus,
    /// Optional failure classification.
    pub failure_ref: Option<FailureClassificationRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `lease_window` | `LeaseWindow` | lease 有效区间 | backend adapter / config summary / clock;具体数值配置后续闭口。 |
| `reaper_marker` | `Option<ReaperEligibilityMarker>` | reaper 检查 marker | lease expiry / job selection。 |
| `backend_lifecycle_summary` | `BackendLifecycleSummary` | backend lifecycle 摘要 | lifecycle adapter,不保存 backend body。 |
| `control_source` | `ControlSourceContext` | 控制来源 | command / consumer / operations input;不保存 caller body。 |
| `control_status` | `ControlFactStatus` | 控制状态 | accept / duplicate / conflict / completed / failed。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_expired(&self, now: SandboxInstant) -> bool` | 判断 lease 是否过期 | logical now | `bool` | 只比较 lease window。 |
| `pub fn require_active_for_handle(&self, handle: &IsolationEnvironmentHandle, now: SandboxInstant) -> Result<(), DomainError>` | 校验run可消费的持久化lease | active handle、logical now | `Result<(), DomainError>` | lease必须Active、handle / context / lease ref关系一致且未过期;不得从current config重算window。 |
| `pub fn requires_orphan_detection(&self) -> bool` | 判断是否需要 orphan 检测 | 无 | `bool` | expired / orphan suspected true。 |
| `pub fn mark_released(&mut self) -> Result<(), DomainError>` | 标记 lease released | 无 | `Result<(), DomainError>` | active/expired -> released。 |
| `pub fn confirm(&mut self, lifecycle: BackendLifecycleSummary) -> Result<(), DomainError>` | 确认 orphan | backend lifecycle summary | `Result<(), DomainError>` | suspected -> confirmed。 |
| `pub fn conflicts_with(&self, existing: &ControlFact) -> bool` | 判断控制冲突 | existing control | `bool` | 同 context / incompatible kind。 |
| `pub fn requires_termination(&self) -> bool` | 判断控制是否终止 run | 无 | `bool` | kill / timeout / deny。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(lease_ref: LeaseRecordRef, handle: &IsolationEnvironmentHandle, lease_window: LeaseWindow) -> Result<LeaseRecord, DomainError>` | 创建 lease | id、handle、window | `Result<LeaseRecord, DomainError>` | boundary established。 |
| `pub fn suspect(orphan_record_ref: OrphanRecoveryRecordRef, lease: &LeaseRecord, lifecycle: BackendLifecycleSummary) -> Result<OrphanRecoveryRecord, DomainError>` | 创建疑似 orphan | id、lease、lifecycle | `Result<OrphanRecoveryRecord, DomainError>` | reaper job。 |
| `pub fn accept(control_ref: ControlFactRef, context_ref: ControlledExecutionContextRef, control_kind: SandboxControlKind, source: ControlSourceContext) -> Result<ControlFact, DomainError>` | 接受 control | id、context、kind、source | `Result<ControlFact, DomainError>` | submit control flow。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| lease 不代表 backend truth | 只表达 sandbox 约束和 reaper 输入。 |
| orphan recovery 不重写 runtime truth | 只记录 sandbox 侧发现和收束。 |
| control 不执行业务 replay | replay-like request 只作为调查 / 控制事实。 |

### 11.14 `ReferenceResolutionState`、`SandboxReadProjection`、`SandboxEventRelayRecord` 与 `SandboxAuditTrace`

#### 类型定义

```rust
/// Tracks long-lived body-free external reference resolution state.
pub struct ReferenceResolutionState {
    /// Reference state identity.
    pub reference_state_ref: ReferenceResolutionStateRef,
    /// Tracked external refs.
    pub tracked_refs: ExternalSourceRefSet,
    /// Safe summary refs.
    pub safe_summary_refs: SafeSummaryRefSet,
    /// Resolution status.
    pub resolution_status: ReferenceResolutionStatus,
    /// Refresh marker.
    pub refresh_marker: Option<ReferenceRefreshMarker>,
    /// Forbidden external body markers.
    pub forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
}

/// Maintains freshness for derived inspect, preview, trend, comparison, or reconciliation views.
pub struct DerivedInspectPreviewTrendState {
    /// Derived state identity.
    pub derived_state_ref: DerivedInspectPreviewTrendStateRef,
    /// Source refs used by derived material.
    pub source_refs: DerivedSourceRefSet,
    /// Derived material kind.
    pub derived_kind: DerivedMaterialKind,
    /// Freshness status.
    pub freshness_status: DerivedFreshnessStatus,
    /// Rebuild marker.
    pub rebuild_marker: Option<DerivedRebuildMarker>,
    /// Failure summary if derivation failed.
    pub failure_summary: Option<DerivedFailureSummary>,
}

/// Read projection of committed sandbox truth.
pub struct SandboxReadProjection {
    /// Projection identity.
    pub projection_ref: SandboxReadProjectionRef,
    /// Owning context.
    pub context_ref: ControlledExecutionContextRef,
    /// Status view refs.
    pub status_view_refs: Vec<SandboxOpaqueRef>,
    /// Projection status.
    pub projection_status: SandboxProjectionStatus,
    /// Degraded markers.
    pub degraded_markers: Vec<SandboxReason>,
}

/// Tracks publication of sandbox truth changes.
pub struct SandboxEventRelayRecord {
    /// Relay identity.
    pub relay_ref: SandboxEventRelayRecordRef,
    /// Source truth reference.
    pub source_truth_ref: SandboxOpaqueRef,
    /// Event kind.
    pub event_kind: SandboxEventKind,
    /// Relay status.
    pub relay_status: EventRelayStatus,
    /// Number of publish attempts.
    pub publish_attempts: u32,
    /// Last publish failure.
    pub last_error: Option<SandboxReason>,
}

/// Append-only audit trace for sandbox-owned decisions and facts.
pub struct SandboxAuditTrace {
    /// Trace identity.
    pub trace_ref: SandboxOpaqueRef,
    /// Trace subject.
    pub subject_ref: SandboxOpaqueRef,
    /// Trace kind.
    pub trace_kind: SandboxTraceKind,
    /// Source reference.
    pub source_ref: Option<ExternalSourceRef>,
    /// Logical occurrence time.
    pub occurred_at: SandboxInstant,
    /// Trace reason.
    pub reason: Option<SandboxReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `tracked_refs` | `ExternalSourceRefSet` | 长期跟踪 refs | reference refresh selection;body-free。 |
| `safe_summary_refs` | `SafeSummaryRefSet` | 安全摘要 refs | resolver output;不保存正文。 |
| `refresh_marker` | `Option<ReferenceRefreshMarker>` | 刷新 marker | reference refresh job / consumer。 |
| `source_refs` | `DerivedSourceRefSet` | 派生来源 refs | capture / handoff / failure / usage refs。 |
| `freshness_status` | `DerivedFreshnessStatus` | 派生新鲜度 | mark stale / rebuild / failed。 |
| `projection_status` | `SandboxProjectionStatus` | projection 状态 | projection writer / query degraded decision。 |
| `relay_status` | `EventRelayStatus` | event relay 状态 | publisher outcome / feedback。 |
| `publish_attempts` | `u32` | 发布次数 | relay repository / publisher flow。 |
| `trace_kind` | `SandboxTraceKind` | trace 分类 | domain change / audit mapper。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_stale(&mut self, marker: ReferenceRefreshMarker) -> Result<(), DomainError>` | 标记 reference stale | marker | `Result<(), DomainError>` | 只影响 reference state。 |
| `pub fn rejects_external_body(&self) -> bool` | 判断正文入仓风险 | 无 | `bool` | 有 forbidden marker true。 |
| `pub fn mark_derived_failed(&mut self, failure: DerivedFailureSummary) -> Result<(), DomainError>` | 标记派生失败 | failure summary | `Result<(), DomainError>` | 不影响核心 truth。 |
| `pub fn requires_rebuild(&self) -> bool` | 判断 projection 是否需重建 | 无 | `bool` | stale / rebuilding / degraded。 |
| `pub fn can_retry(&self) -> bool` | relay 是否可重试 | 无 | `bool` | failed 且 attempts 未超策略。 |
| `pub fn must_not_rollback_source(&self) -> bool` | 声明 publish failure 不回滚 source truth | 无 | `bool` | 恒 true。 |
| `pub fn same_subject(&self, subject_ref: &SandboxOpaqueRef) -> bool` | audit subject 比对 | subject ref | `bool` | 不解析 subject body。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn track(reference_state_ref: ReferenceResolutionStateRef, tracked_refs: ExternalSourceRefSet, forbidden_body_markers: ForbiddenExternalBodyMarkerSet) -> Result<Self, DomainError>` | 创建 reference state | id、refs、forbidden markers | `Result<ReferenceResolutionState, DomainError>` | reference refresh。 |
| `pub fn from_sources(derived_state_ref: DerivedInspectPreviewTrendStateRef, source_refs: DerivedSourceRefSet, derived_kind: DerivedMaterialKind) -> Result<Self, DomainError>` | 创建派生状态 | id、source refs、kind | `Result<DerivedInspectPreviewTrendState, DomainError>` | derived maintenance。 |
| `pub fn create(projection_ref: SandboxReadProjectionRef, context_ref: ControlledExecutionContextRef, status_view_refs: Vec<SandboxOpaqueRef>) -> Result<SandboxReadProjection, DomainError>` | 创建 projection | id、context、views | `Result<SandboxReadProjection, DomainError>` | projection rebuild。 |
| `pub fn pending(relay_ref: SandboxEventRelayRecordRef, source_truth_ref: SandboxOpaqueRef, event_kind: SandboxEventKind) -> Result<SandboxEventRelayRecord, DomainError>` | 创建 relay record | id、source truth、event kind | `Result<SandboxEventRelayRecord, DomainError>` | outbox / relay enqueue。 |
| `pub fn append(trace_ref: SandboxOpaqueRef, subject_ref: SandboxOpaqueRef, trace_kind: SandboxTraceKind, occurred_at: SandboxInstant) -> Result<SandboxAuditTrace, DomainError>` | 创建 append-only audit trace | id、subject、kind、time | `Result<SandboxAuditTrace, DomainError>` | domain change / decision / failure。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reference / derived / projection 只读或可重建 | 不反写 context、boundary、policy、run、capture、cleanup、redline truth。 |
| relay failure 不回滚 source truth | publish / handoff / feedback 失败只更新 relay / report surface。 |
| audit append-only | 不修改历史 trace,只追加新 trace。 |
| external body exclusion 一直生效 | debug、replay、preview、reconciliation 都不能保存外部正文。 |

---

## 12. `application` 模块对象契约

### 12.1 `application` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 规范化 service 调用语境 | API / worker / job entry metadata、command/query/event/job DTO、core metadata | `SandboxServiceCallContext` | 不写 truth | entry modules 只映射,不拼业务字段 | Step 8 protocol;Step 9 flow |
| 幂等和 duplicate replay | command / consumer / job idempotency key、request digest、stored result ref | `SandboxIdempotencyRecord`;`SandboxStoredOperationResult` | reserve、complete、duplicate | repository trait 后续定义 | Step 7 idempotency repository;Step 13 |
| 编排 service outcome | domain object transition、port outcome、stored result | `SandboxServiceOutcome`;`SandboxApplicationError` | accepted / rejected / delayed / failed / degraded | 不直接依赖 infra;port owner 在 application | Step 7 ports;Step 9 flow |
| query access / no-write | query request、visibility / reference / projection decision | `SandboxQueryAccessDecision` | no-write disposition、degraded surface | query 不写 core truth | Step 8 query schema;Step 9 query flow |
| consumer / job no-repair disposition | inbound event、job input、application service result | `SandboxConsumerApplicationReceipt`;`SandboxJobApplicationReport` | duplicate / delayed / skipped / failed / partial report | consumer / job 不修核心 truth | Step 8 job / consumer protocol;Step 16 tests |

### 12.2 `application` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `SandboxServiceCallContext` | 规范化 service 调用语境 | application helper | 归一化 actor、trace、operation、channel、request digest | 不保存 request body;不替代 command DTO |
| `SandboxIdempotencyRecord` | 幂等 reserve / complete / duplicate | application state object | reserve、mark completed、load stored result ref | 不保存完整业务结果 body |
| `SandboxStoredOperationResult` | duplicate replay surface | application result carrier | 保存 public result ref、result kind、status、trace | 不让 duplicate 重新计算结果 |
| `SandboxApplicationError` | application error taxonomy | error object | 映射 domain / port / idempotency / no-write error | 不直接暴露 raw adapter error |
| `SandboxServiceOutcome` | service outcome | result object | accepted/rejected/degraded/no-write/no-rollback 统一返回 | 不写 repository;只表达结果 |
| `SandboxQueryAccessDecision` | query access / no-write | decision helper | visible、not visible、degraded、unavailable | 不反写 projection 或 truth |
| `SandboxConsumerApplicationReceipt`;`SandboxJobApplicationReport` | consumer / job disposition | receipt / report helper | duplicate / delayed / skipped / partial failure report | 不修核心 truth,不绕过 guard |

### 12.3 `application` 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `SandboxServiceCallContext` | entry metadata 归一化 | `operation_name`;`channel`;`actor_ref`;`trace_context`;`request_digest`;`idempotency_key` | `from_command`;`from_query`;`from_consumer`;`from_job` | `requires_idempotency`;`same_operation` | `SandboxOperationChannel` | DTO metadata、entry metadata、core metadata |
| `SandboxIdempotencyRecord` | reserve / complete / duplicate | `idempotency_ref`;`operation_name`;`request_digest`;`record_status`;`stored_result_ref` | `reserve`;`duplicate`;`complete` | `matches_request`;`can_replay`;`mark_failed` | `IdempotencyRecordStatus` | service context、repository existing record、stored result |
| `SandboxStoredOperationResult` | duplicate replay | `stored_result_ref`;`operation_name`;`result_kind`;`public_result_ref`;`result_status` | `from_service_outcome`;`failed` | `is_replayable`;`matches_operation` | `StoredResultStatus` | application outcome、public DTO result ref |
| `SandboxApplicationError` | error taxonomy | `error_kind`;`reason`;`retryable`;`trace_ref` | `from_domain`;`from_port`;`duplicate_mismatch` | `to_public_error_kind`;`is_retryable` | `ApplicationErrorKind` | domain error、port outcome、idempotency repository |
| `SandboxServiceOutcome` | service facade result | `outcome_ref`;`outcome_status`;`domain_refs`;`stored_result_ref`;`side_effect_refs` | `accepted`;`rejected`;`degraded`;`failed` | `requires_commit`;`should_store_result` | `ServiceOutcomeStatus` | domain transition、port results、UoW |
| `SandboxQueryAccessDecision` | no-write query result disposition | `decision_ref`;`query_kind`;`visibility_status`;`degraded_markers` | `visible`;`not_visible`;`degraded`;`unavailable` | `permits_read`;`requires_no_write` | `QueryAccessStatus` | visibility resolver、projection state、reference state |

### 12.4 `SandboxServiceCallContext`

#### 类型定义

```rust
/// Normalizes entry metadata into an application service call context.
pub struct SandboxServiceCallContext {
    /// Operation name.
    pub operation_name: SandboxOperationName,
    /// Operation channel.
    pub channel: SandboxOperationChannel,
    /// Optional actor reference.
    pub actor_ref: Option<ActorRef>,
    /// Trace context.
    pub trace_context: SandboxTraceContext,
    /// Request digest.
    pub request_digest: SandboxDigest,
    /// Optional idempotency key.
    pub idempotency_key: Option<SandboxOpaqueRef>,
}

/// Channel through which an operation reaches application services.
pub enum SandboxOperationChannel {
    /// Synchronous API command.
    ApiCommand,
    /// Synchronous API query.
    ApiQuery,
    /// Inbound event consumer.
    Consumer,
    /// Controlled execution worker.
    Worker,
    /// One-shot operations job.
    Job,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `operation_name` | `SandboxOperationName` | service operation 标识 | entry mapper / DTO selector;不得从 route string 猜测。 |
| `channel` | `SandboxOperationChannel` | 调用来源 | entry module 固定。 |
| `actor_ref` | `Option<ActorRef>` | actor safe ref | 来自 core metadata / upstream summary;匿名 path 只能 rejected / system job。 |
| `trace_context` | `SandboxTraceContext` | trace 语境 | core metadata / entry generated trace。 |
| `request_digest` | `SandboxDigest` | 请求摘要 | entry canonicalization;规则 Step 8 / 13 闭口。 |
| `idempotency_key` | `Option<SandboxOpaqueRef>` | 幂等 key | command / consumer / job metadata;query 通常为空。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断是否必须幂等 | 无 | `bool` | Command / Consumer / Job true, Query false。 |
| `pub fn same_operation(&self, other: &SandboxServiceCallContext) -> bool` | 判断是否同一操作 | other context | `bool` | operation + channel + digest + key。 |
| `pub fn trace_ref(&self) -> SandboxTraceContext` | 取 trace | 无 | `SandboxTraceContext` | 不生成新 trace。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_command(operation_name: SandboxOperationName, actor_ref: Option<ActorRef>, trace_context: SandboxTraceContext, request_digest: SandboxDigest, idempotency_key: SandboxOpaqueRef) -> Result<Self, ApplicationError>` | 构造 command context | operation、actor、trace、digest、key | `Result<SandboxServiceCallContext, ApplicationError>` | command service。 |
| `pub fn from_query(operation_name: SandboxOperationName, actor_ref: Option<ActorRef>, trace_context: SandboxTraceContext, request_digest: SandboxDigest) -> Result<Self, ApplicationError>` | 构造 query context | operation、actor、trace、digest | `Result<SandboxServiceCallContext, ApplicationError>` | query service。 |
| `pub fn from_job(operation_name: SandboxOperationName, trace_context: SandboxTraceContext, request_digest: SandboxDigest, idempotency_key: SandboxOpaqueRef) -> Result<Self, ApplicationError>` | 构造 job context | operation、trace、digest、key | `Result<SandboxServiceCallContext, ApplicationError>` | operations job。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ApiCommand` | `Synchronous API command.` | 同步 command | `api` command handler | application command service |
| `ApiQuery` | `Synchronous API query.` | 同步 query | `api` query handler | application query service |
| `Consumer` | `Inbound event consumer.` | inbound event | `worker` consumer | application consumer service |
| `Worker` | `Controlled execution worker.` | fulfillment / relay worker | `worker` loop | application worker service |
| `Job` | `One-shot operations job.` | operations job | `jobs` runner | application job service |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| context 不保存 DTO body | 只保存 metadata、digest、trace、key。 |
| entry 不得自拼 context 字段 | 必须通过 factory,字段来源进入 Step 8 映射表。 |
| query no-write | `ApiQuery` channel 不得 reserve command idempotency 或写 truth。 |

### 12.5 `SandboxIdempotencyRecord` 与 `SandboxStoredOperationResult`

#### 类型定义

```rust
/// Tracks idempotency reservation and duplicate replay for sandbox operations.
pub struct SandboxIdempotencyRecord {
    /// Idempotency record identity.
    pub idempotency_ref: SandboxOpaqueRef,
    /// Operation name.
    pub operation_name: SandboxOperationName,
    /// Request digest.
    pub request_digest: SandboxDigest,
    /// Record status.
    pub record_status: IdempotencyRecordStatus,
    /// Stored result reference.
    pub stored_result_ref: Option<SandboxOpaqueRef>,
}

/// Stores a public result reference for duplicate replay.
pub struct SandboxStoredOperationResult {
    /// Stored result identity.
    pub stored_result_ref: SandboxOpaqueRef,
    /// Operation name.
    pub operation_name: SandboxOperationName,
    /// Public result kind.
    pub result_kind: SandboxResultKind,
    /// Public result reference.
    pub public_result_ref: SandboxOpaqueRef,
    /// Stored result status.
    pub result_status: StoredResultStatus,
}

/// Lifecycle of an idempotency record.
pub enum IdempotencyRecordStatus {
    /// Record is reserved and operation may execute.
    Reserved,
    /// Record completed and can replay stored result.
    Completed,
    /// Duplicate request matches an existing record.
    Duplicate,
    /// Duplicate request has conflicting digest or operation.
    Conflict,
    /// Operation failed before a replayable result was stored.
    Failed,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `idempotency_ref` | `SandboxOpaqueRef` | 幂等记录 id | idempotency key + channel / repository reserve;exact key schema Step 13。 |
| `operation_name` | `SandboxOperationName` | 操作名 | service call context。 |
| `request_digest` | `SandboxDigest` | 请求摘要 | entry canonicalization;duplicate 必须匹配。 |
| `record_status` | `IdempotencyRecordStatus` | 幂等状态 | reserve / complete / duplicate / conflict。 |
| `stored_result_ref` | `Option<SandboxOpaqueRef>` | stored result ref | accepted path 完成后保存。 |
| `public_result_ref` | `SandboxOpaqueRef` | public result ref | command result / receipt / job report ref。 |
| `result_status` | `StoredResultStatus` | stored result 状态 | outcome mapping。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_request(&self, context: &SandboxServiceCallContext) -> bool` | duplicate digest 匹配 | service context | `bool` | 比较 operation + digest + idempotency key。 |
| `pub fn can_replay(&self) -> bool` | 是否可重放 | 无 | `bool` | completed + stored result ref 存在。 |
| `pub fn mark_completed(&mut self, stored_result_ref: SandboxOpaqueRef) -> Result<(), ApplicationError>` | 标记完成 | stored result ref | `Result<(), ApplicationError>` | reserved -> completed。 |
| `pub fn is_replayable(&self) -> bool` | stored result 是否可 replay | 无 | `bool` | result status completed / rejected。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(idempotency_ref: SandboxOpaqueRef, context: &SandboxServiceCallContext) -> Result<Self, ApplicationError>` | 创建 reserve record | id、context | `Result<SandboxIdempotencyRecord, ApplicationError>` | command / consumer / job start。 |
| `pub fn from_service_outcome(stored_result_ref: SandboxOpaqueRef, context: &SandboxServiceCallContext, outcome: &SandboxServiceOutcome) -> Result<SandboxStoredOperationResult, ApplicationError>` | 从 outcome 构造 stored result | id、context、outcome | `Result<SandboxStoredOperationResult, ApplicationError>` | duplicate replay 保存。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Reserved` | `Record is reserved and operation may execute.` | 首次请求占位 | idempotency repository reserve | `Completed`;`Failed`;`Conflict` |
| `Completed` | `Record completed and can replay stored result.` | 可 replay | save stored result | duplicate replay |
| `Duplicate` | `Duplicate request matches an existing record.` | 重复请求 | repository duplicate check | return stored result |
| `Conflict` | `Duplicate request has conflicting digest or operation.` | 幂等冲突 | duplicate mismatch | public error |
| `Failed` | `Operation failed before a replayable result was stored.` | 不可 replay 失败 | service failure | retry/error |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| duplicate 不重新计算结果 | 必须读取 stored result,缺失即 blocker。 |
| request digest 不能由 service 临时拼 | canonicalization 映射在 Step 8 / 13 闭口。 |
| stored result 只保存 public result ref | 不保存 domain object body 或外部正文。 |

### 12.6 `SandboxApplicationError`、`SandboxServiceOutcome` 与 `SandboxQueryAccessDecision`

#### 类型定义

```rust
/// Application-layer error used before mapping to public protocol errors.
pub struct SandboxApplicationError {
    /// Application error kind.
    pub error_kind: ApplicationErrorKind,
    /// Human-readable body-free reason.
    pub reason: SandboxReason,
    /// Whether retry may be attempted by the caller or runner.
    pub retryable: bool,
    /// Optional trace reference.
    pub trace_ref: Option<SandboxOpaqueRef>,
}

/// Application service outcome before protocol mapping.
pub struct SandboxServiceOutcome {
    /// Outcome identity.
    pub outcome_ref: SandboxOpaqueRef,
    /// Outcome status.
    pub outcome_status: ServiceOutcomeStatus,
    /// Domain refs changed or observed.
    pub domain_refs: Vec<SandboxOpaqueRef>,
    /// Stored result reference.
    pub stored_result_ref: Option<SandboxOpaqueRef>,
    /// Side-effect refs such as relay, handoff, projection stale, or audit.
    pub side_effect_refs: Vec<SandboxOpaqueRef>,
}

/// Read access decision that enforces query no-write semantics.
pub struct SandboxQueryAccessDecision {
    /// Decision identity.
    pub decision_ref: SandboxOpaqueRef,
    /// Query kind.
    pub query_kind: SandboxQueryKind,
    /// Query access status.
    pub visibility_status: QueryAccessStatus,
    /// Degraded markers.
    pub degraded_markers: Vec<SandboxReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `error_kind` | `ApplicationErrorKind` | application error 分类 | domain error / port outcome / idempotency / query guard。 |
| `retryable` | `bool` | 是否可重试 | error kind / port outcome;不得由 entry 猜测。 |
| `outcome_status` | `ServiceOutcomeStatus` | service 结果 | application service assembly。 |
| `domain_refs` | `Vec<SandboxOpaqueRef>` | 变更或观察的 domain refs | domain transition / repository load。 |
| `side_effect_refs` | `Vec<SandboxOpaqueRef>` | side effect refs | outbox / relay / handoff / audit / projection stale。 |
| `visibility_status` | `QueryAccessStatus` | query 访问状态 | visibility resolver / projection / reference state。 |
| `degraded_markers` | `Vec<SandboxReason>` | 降级原因 | projection / reference / material integrity。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind` | 映射 public error | 无 | `SandboxPublicErrorKind` | 不泄露 raw adapter error。 |
| `pub fn requires_commit(&self) -> bool` | 判断是否需要 UoW commit | 无 | `bool` | accepted / rejected stored result path true。 |
| `pub fn should_store_result(&self) -> bool` | 判断是否保存 stored result | 无 | `bool` | command / job / consumer accepted 或 rejected path。 |
| `pub fn permits_read(&self) -> bool` | query 是否可读 | 无 | `bool` | visible / degraded true。 |
| `pub fn requires_no_write(&self) -> bool` | query no-write 断言 | 无 | `bool` | 恒 true。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_domain(error: DomainError, trace_ref: Option<SandboxOpaqueRef>) -> SandboxApplicationError` | domain error 映射 | domain error、trace | `SandboxApplicationError` | command / flow error。 |
| `pub fn accepted(outcome_ref: SandboxOpaqueRef, domain_refs: Vec<SandboxOpaqueRef>, side_effect_refs: Vec<SandboxOpaqueRef>) -> SandboxServiceOutcome` | accepted outcome | id、domain refs、side effects | `SandboxServiceOutcome` | service success。 |
| `pub fn visible(decision_ref: SandboxOpaqueRef, query_kind: SandboxQueryKind) -> SandboxQueryAccessDecision` | visible query decision | id、query kind | `SandboxQueryAccessDecision` | query flow。 |
| `pub fn degraded(decision_ref: SandboxOpaqueRef, query_kind: SandboxQueryKind, markers: Vec<SandboxReason>) -> SandboxQueryAccessDecision` | degraded query decision | id、query kind、markers | `SandboxQueryAccessDecision` | stale / partial projection。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| application error 不暴露 raw adapter body | public 映射只输出 kind、reason、trace。 |
| query no-write | `SandboxQueryAccessDecision` 不允许产生 repository save / outbox / handoff side effect。 |
| side effect refs 必须正式来源 | relay / handoff / audit / stale marker 必须由 Step 7 / 9 / 11 承接。 |

---

## 13. `infra` 模块对象契约

### 13.1 `infra` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 提供已验证 runtime config summary | config loader / validator output | `SandboxRuntimeConfigSummary` | startup pass / blocked / degraded | 不改变 domain 不变量 | Step 14 config binding |
| 追踪 adapter availability | backend / DB / object store / bus / handoff / publisher health | `AdapterAvailabilityState` | available / degraded / unavailable / disabled | 只供 application / entry 判断 | Step 7 adapter trait;Step 14 |
| 转换 isolation backend outcome | backend SDK / process result | `IsolationBackendAdapterOutcome` | established / failed / unsupported / unavailable | 不保存 SDK 原始响应 | Step 7 isolation backend port |
| 转换 handoff / publisher outcome | handoff adapter、publisher result | `MaterialHandoffAdapterOutcome`;`EventPublisherAdapterOutcome` | delivered / retryable / failed / dead-letter | 不回滚 source truth | Step 7 handoff / publisher port;Step 9 flow |

### 13.2 `infra` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `SandboxRuntimeConfigSummary` | runtime config summary | adapter config helper | 表达 validated profile、disabled adapters、job / worker / publisher profile refs | 不定义完整 config key / default / env |
| `AdapterAvailabilityState` | adapter availability | adapter state | available / degraded / unavailable / disabled 判断 | 不决定 business allow |
| `IsolationBackendAdapterOutcome` | backend outcome | adapter outcome | established / unsupported / failed / unavailable 映射 | 不保存 SDK response body |
| `MaterialHandoffAdapterOutcome`;`EventPublisherAdapterOutcome` | handoff / publisher outcome | adapter outcome | delivered / retryable / failed / dead-letter | 不修改 capture truth 或 source truth |

### 13.3 `infra` 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `SandboxRuntimeConfigSummary` | 已验证配置摘要 | `config_profile_ref`;`backend_profile_ref`;`adapter_profile_refs`;`disabled_adapter_kinds`;`validated_at` | `from_validated_config` | `is_adapter_disabled`;`requires_startup_block` | `RuntimeConfigStatus` | config loader / validator |
| `AdapterAvailabilityState` | adapter 可用性 | `adapter_kind`;`availability_status`;`last_checked_at`;`reason` | `available`;`degraded`;`unavailable`;`disabled` | `can_call`;`to_application_error` | `AdapterAvailabilityStatus` | health check / startup validation |
| `IsolationBackendAdapterOutcome` | backend outcome 映射 | `outcome_status`;`handle_ref`;`capability_ref`;`reason` | `established`;`unsupported`;`failed`;`unavailable` | `to_boundary_decision_status`;`requires_retry` | `IsolationBackendOutcomeStatus` | isolation backend adapter |
| `MaterialHandoffAdapterOutcome` | handoff outcome 映射 | `outcome_status`;`receipt_ref`;`retry_after`;`reason` | `delivered`;`retryable`;`failed` | `to_handoff_status`;`blocks_cleanup` | `HandoffAdapterOutcomeStatus` | handoff adapter / feedback |
| `EventPublisherAdapterOutcome` | publisher outcome 映射 | `outcome_status`;`publisher_receipt_ref`;`reason` | `delivered`;`retryable`;`dead_letter` | `to_relay_status`;`must_not_rollback_source` | `PublisherOutcomeStatus` | event publisher / feedback |

### 13.4 `SandboxRuntimeConfigSummary` 与 `AdapterAvailabilityState`

#### 类型定义

```rust
/// Carries validated runtime configuration references without business semantics.
pub struct SandboxRuntimeConfigSummary {
    /// Config profile reference.
    pub config_profile_ref: SandboxOpaqueRef,
    /// Backend profile reference.
    pub backend_profile_ref: Option<SandboxOpaqueRef>,
    /// Adapter profile references.
    pub adapter_profile_refs: Vec<SandboxOpaqueRef>,
    /// Disabled adapter kinds.
    pub disabled_adapter_kinds: Vec<SandboxAdapterKind>,
    /// Validation status.
    pub config_status: RuntimeConfigStatus,
    /// Logical validation time.
    pub validated_at: SandboxInstant,
}

/// Tracks availability of one infrastructure adapter.
pub struct AdapterAvailabilityState {
    /// Adapter kind.
    pub adapter_kind: SandboxAdapterKind,
    /// Availability status.
    pub availability_status: AdapterAvailabilityStatus,
    /// Last checked time.
    pub last_checked_at: SandboxInstant,
    /// Body-free availability reason.
    pub reason: Option<SandboxReason>,
}

/// Status of validated runtime configuration.
pub enum RuntimeConfigStatus {
    /// Runtime configuration is valid.
    Valid,
    /// Runtime configuration blocks startup.
    StartupBlocked,
    /// Runtime configuration allows startup with degraded read or maintenance surfaces.
    Degraded,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `config_profile_ref` | `SandboxOpaqueRef` | config profile | config loader / validator;不保存完整配置正文。 |
| `backend_profile_ref` | `Option<SandboxOpaqueRef>` | backend profile | config summary;缺失可 startup blocked。 |
| `adapter_profile_refs` | `Vec<SandboxOpaqueRef>` | adapter profile refs | config validator;不写产品参数。 |
| `disabled_adapter_kinds` | `Vec<SandboxAdapterKind>` | disabled adapters | config validator;不得关闭 fail-closed guard。 |
| `availability_status` | `AdapterAvailabilityStatus` | adapter availability | startup check / health check / adapter feedback。 |
| `reason` | `Option<SandboxReason>` | 可用性原因 | 不保存 raw config / SDK error。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_adapter_disabled(&self, adapter_kind: SandboxAdapterKind) -> bool` | 判断 adapter 是否禁用 | adapter kind | `bool` | 只读判断。 |
| `pub fn requires_startup_block(&self) -> bool` | 判断是否阻断启动 | 无 | `bool` | StartupBlocked true。 |
| `pub fn can_call(&self) -> bool` | 判断 adapter 是否可调用 | 无 | `bool` | available / degraded 按调用类型判断。 |
| `pub fn to_application_error(&self) -> SandboxApplicationError` | 映射 application error | 无 | `SandboxApplicationError` | 不泄露 raw adapter body。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_validated_config(config_profile_ref: SandboxOpaqueRef, backend_profile_ref: Option<SandboxOpaqueRef>, adapter_profile_refs: Vec<SandboxOpaqueRef>, disabled_adapter_kinds: Vec<SandboxAdapterKind>, config_status: RuntimeConfigStatus, validated_at: SandboxInstant) -> Result<Self, InfraError>` | 从验证结果构造 config summary | profile refs、disabled list、status、time | `Result<SandboxRuntimeConfigSummary, InfraError>` | LD-17 summary / builder bootstrap;generation尚未发布。 |
| `pub fn unavailable(adapter_kind: SandboxAdapterKind, reason: SandboxReason, checked_at: SandboxInstant) -> AdapterAvailabilityState` | 构造 unavailable state | adapter kind、reason、time | `AdapterAvailabilityState` | adapter health / startup check。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Valid` | `Runtime configuration is valid.` | 可启动 | config validator | runtime builder |
| `StartupBlocked` | `Runtime configuration blocks startup.` | 启动阻断 | config validator | entry startup error |
| `Degraded` | `Runtime configuration allows startup with degraded read or maintenance surfaces.` | 降级启动 | config validator | read degraded / job skipped |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 配置不改变业务不变量 | fail-closed、cleanup guard、redline containment 不能被 disabled。 |
| 不保存 secret / raw endpoint | 只保存 profile ref 和 disabled kind。 |
| exact config key 后续闭口 | 本步不写 env var、default、secret、产品参数。 |

### 13.5 Adapter Outcome Objects

#### 类型定义

```rust
/// Outcome returned by an isolation backend adapter.
pub struct IsolationBackendAdapterOutcome {
    /// Outcome status.
    pub outcome_status: IsolationBackendOutcomeStatus,
    /// Isolation handle reference if established.
    pub handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// Capability summary reference.
    pub capability_ref: Option<BackendCapabilitySummaryRef>,
    /// Validated lease window for an established handle.
    pub lease_window: Option<LeaseWindow>,
    /// Body-free reason.
    pub reason: Option<SandboxReason>,
}

/// Outcome returned by a material handoff adapter.
pub struct MaterialHandoffAdapterOutcome {
    /// Handoff adapter outcome status.
    pub outcome_status: HandoffAdapterOutcomeStatus,
    /// Downstream receipt reference.
    pub receipt_ref: Option<SandboxOpaqueRef>,
    /// Optional retry-after marker.
    pub retry_after: Option<SandboxInstant>,
    /// Body-free reason.
    pub reason: Option<SandboxReason>,
}

/// Outcome returned by an event publisher adapter.
pub struct EventPublisherAdapterOutcome {
    /// Publisher outcome status.
    pub outcome_status: PublisherOutcomeStatus,
    /// Publisher receipt reference.
    pub publisher_receipt_ref: Option<SandboxOpaqueRef>,
    /// Body-free reason.
    pub reason: Option<SandboxReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `outcome_status` | `*OutcomeStatus` | adapter outcome 分类 | adapter mapping;不得解析 raw error 字符串。 |
| `handle_ref` | `Option<IsolationEnvironmentHandleRef>` | 建立成功 handle | backend adapter;只保存 stable ref。 |
| `capability_ref` | `Option<BackendCapabilitySummaryRef>` | capability summary | backend capability adapter。 |
| `lease_window` | `Option<LeaseWindow>` | established handle的有界lease | generation-scoped adapter由I065 lease profile、clock和backend response生成;非Established必须为空。 |
| `receipt_ref` | `Option<SandboxOpaqueRef>` | downstream receipt | handoff adapter ack。 |
| `retry_after` | `Option<SandboxInstant>` | 重试时间 | adapter / policy summary;具体 retry config 后续。 |
| `publisher_receipt_ref` | `Option<SandboxOpaqueRef>` | publisher receipt | event publisher。 |
| `reason` | `Option<SandboxReason>` | 失败原因 | sanitized adapter outcome。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_boundary_decision_status(&self) -> BoundaryDecisionStatus` | 映射 boundary status | 无 | `BoundaryDecisionStatus` | 不读 raw SDK response。 |
| `pub fn to_handoff_status(&self) -> HandoffStatus` | 映射 handoff status | 无 | `HandoffStatus` | retryable / delivered / failed 明确。 |
| `pub fn to_relay_status(&self) -> EventRelayStatus` | 映射 relay status | 无 | `EventRelayStatus` | publish failure 不回滚 source。 |
| `pub fn must_not_rollback_source(&self) -> bool` | 声明 no rollback | 无 | `bool` | 恒 true for publisher / handoff failure。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn established(handle_ref: IsolationEnvironmentHandleRef, capability_ref: BackendCapabilitySummaryRef, lease_window: LeaseWindow) -> IsolationBackendAdapterOutcome` | backend 建立成功 | handle、capability、有界lease window | `IsolationBackendAdapterOutcome` | establish boundary。 |
| `pub fn unsupported(reason: SandboxReason) -> IsolationBackendAdapterOutcome` | backend 不支持 | reason | `IsolationBackendAdapterOutcome` | boundary fail-closed。 |
| `pub fn delivered(receipt_ref: SandboxOpaqueRef) -> MaterialHandoffAdapterOutcome` | handoff 成功 | receipt | `MaterialHandoffAdapterOutcome` | material handoff。 |
| `pub fn retryable(reason: SandboxReason, retry_after: Option<SandboxInstant>) -> MaterialHandoffAdapterOutcome` | handoff 可重试 | reason、retry time | `MaterialHandoffAdapterOutcome` | retry job。 |
| `pub fn dead_letter(reason: SandboxReason) -> EventPublisherAdapterOutcome` | publisher dead-letter | reason | `EventPublisherAdapterOutcome` | relay maintenance。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| outcome enum 必须由 adapter 明确返回 | service / fake 不得靠错误字符串分类。 |
| raw SDK response 不进对象 | 只保存 stable ref、status、reason。 |
| failure 不回滚 source truth | publisher / handoff failure 只更新 relay / handoff / report。 |

---

## 14. Entry 模块对象契约

### 14.1 `api` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 映射同步 Command | HTTP/RPC/CLI request、metadata | `SandboxApiCommandEnvelope`;application service call | API disposition | 不直接写 repository | Step 8 Command DTO;Step 9 handler flow |
| 映射同步 Query | query request、metadata | `SandboxApiQueryEnvelope`;query service call | no-write disposition | 不写 truth | Step 8 Query DTO;Step 9 query flow |
| 映射 API error | application outcome / error | `SandboxApiDisposition` | response surface | 不泄露 internal / raw adapter error | Step 12 error mapping |

### 14.2 `worker` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 消费 inbound event | event envelope、dedupe metadata | `SandboxConsumerReceipt` | accepted / delayed / duplicate / failed | 调用 application service | Step 8 Consumer protocol;Step 9 consumer flow |
| 执行 fulfillment loop | pending run / boundary / backend signal | `SandboxFulfillmentLoopResult` | started / completed / failed / skipped | 不直接修 truth | Step 9 worker flow;Step 13 reentry |
| 执行 relay loop | pending relay records | `SandboxRelayLoopResult` | delivered / retryable / dead-letter | publish failure 不回滚 | Step 9 relay flow |

### 14.3 `jobs` capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 执行 one-shot maintenance job | job input、cursor、batch config summary | `SandboxJobRunContext`;`SandboxJobReportAccumulator`;`SandboxJobExitDisposition` | succeeded / partial / failed / skipped | 不作为业务 command | Step 8 Job I/O;Step 9 job flow |
| 维护 reference / backend / handoff / lease / cleanup / redline / projection / derived / reconciliation | job input、application service result | job report | partial failure report | 不修核心 truth,只调用 application service | Step 16 job tests |

### 14.4 Entry 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `SandboxApiCommandEnvelope`;`SandboxApiQueryEnvelope` | API request mapping | entry object | 提取 metadata、operation selector、request digest | 不拥有 DTO schema truth;不直接访问 repository |
| `SandboxApiDisposition` | API error / response disposition | entry result | accepted / rejected / failed mapping | 不推进 domain state |
| `SandboxConsumerReceipt` | inbound consumer receipt | receipt object | accepted / duplicate / delayed / failed / quarantined | 不修核心 truth |
| `SandboxWorkerRunContext`;`SandboxFulfillmentLoopResult`;`SandboxRelayLoopResult` | worker loop | entry / loop result | batch / item result / retry summary | 不与 jobs 互调 |
| `SandboxJobRunContext`;`SandboxJobReportAccumulator`;`SandboxJobExitDisposition` | operations job | job entry / report helper | cursor、item refs、success/failed/skipped、exit code | 不绕过 cleanup guard / redline |

### 14.5 Entry 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `SandboxApiCommandEnvelope` | command entry shell | `operation_name`;`metadata`;`request_digest`;`idempotency_key` | `from_request` | `to_call_context` | `EntryDisposition` | API request + metadata |
| `SandboxApiQueryEnvelope` | query entry shell | `query_name`;`metadata`;`request_digest` | `from_request` | `to_call_context` | `EntryDisposition` | API query request |
| `SandboxConsumerReceipt` | consumer receipt | `source_event_ref`;`receipt_status`;`stored_result_ref`;`reason` | `accepted`;`duplicate`;`delayed`;`failed` | `should_ack`;`should_retry` | `ConsumerReceiptStatus` | event envelope、application result |
| `SandboxWorkerRunContext` | worker loop context | `worker_kind`;`batch_ref`;`trace_context`;`started_at` | `start` | `for_item`;`finish` | `WorkerRunStatus` | worker runtime |
| `SandboxJobRunContext` | job context | `job_kind`;`run_ref`;`cursor_ref`;`trace_context`;`started_at` | `start` | `next_batch`;`finish` | `JobRunStatus` | job input / runtime |
| `SandboxJobReportAccumulator` | job report assembly | `job_kind`;`succeeded_refs`;`failed_refs`;`skipped_refs`;`degraded_markers` | `new` | `record_success`;`record_failure`;`finish_report` | `JobReportStatus` | application service results |

### 14.6 `api` Entry Objects

#### 类型定义

```rust
/// Command envelope normalized by the API entry before application invocation.
pub struct SandboxApiCommandEnvelope {
    /// Operation name selected by API routing.
    pub operation_name: SandboxOperationName,
    /// API metadata.
    pub metadata: SandboxApiMetadata,
    /// Request digest.
    pub request_digest: SandboxDigest,
    /// Idempotency key.
    pub idempotency_key: SandboxOpaqueRef,
}

/// Query envelope normalized by the API entry before application invocation.
pub struct SandboxApiQueryEnvelope {
    /// Query name selected by API routing.
    pub query_name: SandboxOperationName,
    /// API metadata.
    pub metadata: SandboxApiMetadata,
    /// Request digest.
    pub request_digest: SandboxDigest,
}

/// API entry disposition before protocol-specific response rendering.
pub struct SandboxApiDisposition {
    /// Entry disposition.
    pub disposition: EntryDisposition,
    /// Optional public error kind.
    pub error_kind: Option<SandboxPublicErrorKind>,
    /// Optional trace reference.
    pub trace_ref: Option<SandboxOpaqueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `operation_name` / `query_name` | `SandboxOperationName` | operation selector | route / RPC method mapping;Step 8 闭口 exact selector。 |
| `metadata` | `SandboxApiMetadata` | API metadata | request metadata;不保存 body。 |
| `request_digest` | `SandboxDigest` | 请求摘要 | API canonicalization。 |
| `idempotency_key` | `SandboxOpaqueRef` | command 幂等 key | command request metadata;query 不需要。 |
| `disposition` | `EntryDisposition` | API entry result | application outcome / error。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_call_context(&self) -> Result<SandboxServiceCallContext, ApiError>` | 构造 application call context | envelope self | `Result<SandboxServiceCallContext, ApiError>` | 不拼 domain 字段。 |
| `pub fn to_query_context(&self) -> Result<SandboxServiceCallContext, ApiError>` | 构造 query call context | query envelope | `Result<SandboxServiceCallContext, ApiError>` | no-write channel。 |
| `pub fn from_application_error(error: SandboxApplicationError) -> SandboxApiDisposition` | error 映射 | application error | `SandboxApiDisposition` | 不泄露 raw error。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_request(operation_name: SandboxOperationName, metadata: SandboxApiMetadata, request_digest: SandboxDigest, idempotency_key: SandboxOpaqueRef) -> Result<Self, ApiError>` | 构造 command envelope | selector、metadata、digest、key | `Result<SandboxApiCommandEnvelope, ApiError>` | command handler。 |
| `pub fn from_query_request(query_name: SandboxOperationName, metadata: SandboxApiMetadata, request_digest: SandboxDigest) -> Result<Self, ApiError>` | 构造 query envelope | selector、metadata、digest | `Result<SandboxApiQueryEnvelope, ApiError>` | query handler。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| API 不直接访问 repository | 只构造 context 并调用 application service。 |
| API 不拥有 DTO schema truth | DTO exact 字段进入 Step 8。 |
| API 不推进 domain state | state transition 只在 application + domain flow 中发生。 |

### 14.7 `worker` Entry Objects

#### 类型定义

```rust
/// Receipt returned by worker consumers after application processing.
pub struct SandboxConsumerReceipt {
    /// Source event reference.
    pub source_event_ref: SandboxOpaqueRef,
    /// Receipt status.
    pub receipt_status: ConsumerReceiptStatus,
    /// Stored result reference.
    pub stored_result_ref: Option<SandboxOpaqueRef>,
    /// Body-free reason.
    pub reason: Option<SandboxReason>,
}

/// Runtime context for a sandbox worker loop.
pub struct SandboxWorkerRunContext {
    /// Worker kind.
    pub worker_kind: SandboxWorkerKind,
    /// Batch reference.
    pub batch_ref: SandboxOpaqueRef,
    /// Trace context.
    pub trace_context: SandboxTraceContext,
    /// Logical start time.
    pub started_at: SandboxInstant,
}

/// Result summary of a fulfillment worker loop.
pub struct SandboxFulfillmentLoopResult {
    /// Worker run reference.
    pub worker_run_ref: SandboxOpaqueRef,
    /// Loop status.
    pub loop_status: WorkerRunStatus,
    /// Processed item refs.
    pub processed_refs: Vec<SandboxOpaqueRef>,
    /// Failed item refs.
    pub failed_refs: Vec<SandboxOpaqueRef>,
}

/// Result summary of an event relay worker loop.
pub struct SandboxRelayLoopResult {
    /// Worker run reference.
    pub worker_run_ref: SandboxOpaqueRef,
    /// Delivered relay refs.
    pub delivered_refs: Vec<SandboxOpaqueRef>,
    /// Retryable relay refs.
    pub retryable_refs: Vec<SandboxOpaqueRef>,
    /// Dead-letter relay refs.
    pub dead_letter_refs: Vec<SandboxOpaqueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_event_ref` | `SandboxOpaqueRef` | inbound event id | event envelope;不得用 topic + timestamp 拼。 |
| `receipt_status` | `ConsumerReceiptStatus` | consumer 处理状态 | application result / duplicate / validation。 |
| `stored_result_ref` | `Option<SandboxOpaqueRef>` | stored result | duplicate replay / accepted receipt。 |
| `worker_kind` | `SandboxWorkerKind` | worker 类别 | worker binary / runtime config summary。 |
| `processed_refs`;`failed_refs` | `Vec<SandboxOpaqueRef>` | item 结果 refs | application facade returned refs;entry 不读 repository 反推。 |
| `delivered_refs`;`retryable_refs`;`dead_letter_refs` | `Vec<SandboxOpaqueRef>` | relay item refs | relay service result;不得读 publisher internals。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn should_ack(&self) -> bool` | 是否 ack inbound event | 无 | `bool` | accepted / duplicate / rejected 可 ack;delayed 不 ack。 |
| `pub fn should_retry(&self) -> bool` | 是否 retry inbound event | 无 | `bool` | delayed / retryable failure true。 |
| `pub fn for_item(&self, item_ref: SandboxOpaqueRef) -> SandboxServiceCallContext` | 构造 item call context | item ref | `SandboxServiceCallContext` | 不访问 repository。 |
| `pub fn has_failures(&self) -> bool` | loop 是否有失败 | 无 | `bool` | failed_refs 非空。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn accepted(source_event_ref: SandboxOpaqueRef, stored_result_ref: Option<SandboxOpaqueRef>) -> SandboxConsumerReceipt` | accepted receipt | event ref、stored result | `SandboxConsumerReceipt` | consumer accepted。 |
| `pub fn duplicate(source_event_ref: SandboxOpaqueRef, stored_result_ref: SandboxOpaqueRef) -> SandboxConsumerReceipt` | duplicate receipt | event ref、stored result | `SandboxConsumerReceipt` | duplicate replay。 |
| `pub fn start(worker_kind: SandboxWorkerKind, batch_ref: SandboxOpaqueRef, trace_context: SandboxTraceContext, started_at: SandboxInstant) -> SandboxWorkerRunContext` | 开始 worker run | kind、batch、trace、time | `SandboxWorkerRunContext` | worker loop start。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| worker 不修核心 truth | 只能调用 application service,不得直接 repository save。 |
| worker 不与 jobs 互调 | 常驻 worker loop 与 one-shot job 分离。 |
| receipt trace 不能伪造 | 无正式 trace subject 时只能 `None` 或 source event ref。 |

### 14.8 `jobs` Entry Objects

#### 类型定义

```rust
/// Runtime context for one operations job invocation.
pub struct SandboxJobRunContext {
    /// Job kind.
    pub job_kind: SandboxJobKind,
    /// Job run reference.
    pub run_ref: SandboxOpaqueRef,
    /// Optional cursor reference.
    pub cursor_ref: Option<SandboxOpaqueRef>,
    /// Trace context.
    pub trace_context: SandboxTraceContext,
    /// Logical start time.
    pub started_at: SandboxInstant,
}

/// Accumulates job report item refs.
pub struct SandboxJobReportAccumulator {
    /// Job kind.
    pub job_kind: SandboxJobKind,
    /// Successful item refs.
    pub succeeded_refs: Vec<SandboxOpaqueRef>,
    /// Failed item refs.
    pub failed_refs: Vec<SandboxOpaqueRef>,
    /// Skipped item refs.
    pub skipped_refs: Vec<SandboxOpaqueRef>,
    /// Degraded markers.
    pub degraded_markers: Vec<SandboxReason>,
}

/// Exit disposition for a sandbox operations job.
pub struct SandboxJobExitDisposition {
    /// Job report status.
    pub report_status: JobReportStatus,
    /// Public report reference.
    pub report_ref: SandboxOpaqueRef,
    /// Process exit code.
    pub exit_code: i32,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `job_kind` | `SandboxJobKind` | job 类别 | job binary selector;Step 8 job input 闭口。 |
| `run_ref` | `SandboxOpaqueRef` | job run id | job runner id generator。 |
| `cursor_ref` | `Option<SandboxOpaqueRef>` | pagination / resume cursor | application job plan / repository;不得从 item ref 拼。 |
| `succeeded_refs`;`failed_refs`;`skipped_refs` | `Vec<SandboxOpaqueRef>` | 逐项结果 refs | application job facade 返回,entry 不扫描 repository 反推。 |
| `report_status` | `JobReportStatus` | job report 状态 | accumulator finish。 |
| `exit_code` | `i32` | process exit code | derived from report status;不等于业务状态。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn next_batch(&self) -> Option<SandboxOpaqueRef>` | 获取 cursor | 无 | `Option<SandboxOpaqueRef>` | 不展开 scope。 |
| `pub fn record_success(&mut self, item_ref: SandboxOpaqueRef)` | 记录成功项 | item ref | `()` | 只更新 accumulator。 |
| `pub fn record_failure(&mut self, item_ref: SandboxOpaqueRef, reason: SandboxReason)` | 记录失败项 | item ref、reason | `()` | 不修 truth。 |
| `pub fn finish_report(&self, report_ref: SandboxOpaqueRef) -> SandboxJobExitDisposition` | 完成 report | report ref | `SandboxJobExitDisposition` | status 由累积结果决定。 |

| 工厂 / 静态函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(job_kind: SandboxJobKind, run_ref: SandboxOpaqueRef, cursor_ref: Option<SandboxOpaqueRef>, trace_context: SandboxTraceContext, started_at: SandboxInstant) -> SandboxJobRunContext` | 开始 job | kind、run ref、cursor、trace、time | `SandboxJobRunContext` | job runner。 |
| `pub fn new(job_kind: SandboxJobKind) -> SandboxJobReportAccumulator` | 创建 report accumulator | job kind | `SandboxJobReportAccumulator` | job loop。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| job 不作为业务 command | maintenance job 只能调用 application job service。 |
| job 不修核心 truth | 对账 / rebuild / retry / cleanup 都通过正式 service 和 guard。 |
| report 字段必须对称保存 / replay | Step 8 / 13 / 16 必须闭口 stored job report 和 duplicate replay。 |

---

## 15. 模块内停审记录

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | public secondary type 是否统一归属 | 通过 | Step 8 不得新增 domain-only 二级类型进入 DTO。 |
| `contracts` | status / kind / error 是否可供 Step 8~10 回指 | 通过 | Step 10 仍需给状态矩阵,但不得改 enum 名称。 |
| `domain` | intake / identity 功能是否全部有对象承接 | 通过 | `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution` 已闭口。 |
| `domain` | boundary / backend capability 是否闭合重点边界 | 通过 | exact backend port signature 留给 Step 7;不阻塞对象契约。 |
| `domain` | policy / high-risk 是否 fail-closed | 通过 | policy source truth 仍外部拥有;Step 7 需闭口 summary port。 |
| `domain` | run / capture / handoff 是否分层 | 通过 | capture 不等于 artifact truth;handoff failure 不回滚 capture truth。 |
| `domain` | failure / cleanup / redline 是否显式对象化 | 通过 | failure taxonomy 细项留 Step 10 / 12,当前 carrier 已闭口。 |
| `domain` | projection / derived / relay / audit 是否只读或 append-only | 通过 | Step 7 / 11 需闭口 repository / relay port 和 persistence shape。 |
| `application` | idempotency / stored result / service context 是否有唯一 owner | 通过 | Step 7 必须补 repository callable surface;Step 13 补并发 / digest。 |
| `application` | query no-write 是否有对象承接 | 通过 | `SandboxQueryAccessDecision` 已闭口。 |
| `infra` | adapter outcome 是否明确,避免 service 解析错误字符串 | 通过 | Step 7 port 必须返回正式 outcome enum。 |
| `api` | entry object 是否只做 mapping | 通过 | exact DTO schema 留 Step 8;禁止 API 访问 repository。 |
| `worker` | consumer / loop receipt 是否不修核心 truth | 通过 | Step 9 / 13 继续闭口 duplicate / reentry。 |
| `jobs` | job report accumulator 是否不绕过 guard | 通过 | Step 8 / 16 必须闭口 job report schema 和 tests。 |

---

## 16. 对象组字段来源审计表

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| shared refs / markers | `ExternalSourceRef`;`ForbiddenExternalBodyMarkerSet` | request/event/resolver summary、id generator、safe summary digest | DTO 字段映射、serialization、canonicalization | 需要保存外部正文、URL/raw body 或 sibling typed body 时暂停。 |
| intake / identity truth | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity` | command/consumer input、resolver result、responsibility summary、trace metadata | repository save/load、service flow、state matrix | accepted context 缺 actor / responsibility / trace / idempotency 来源时暂停。 |
| boundary / backend | `BoundaryRequirementSet`;`CoherentBoundary`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle`;`LeaseRecord` | accepted context、active identity、explicit requirements、builder-injected profile / template / generation、backend capability / outcome、I065-bound adapter window | backend port signature、config binding、grouped save、run typed read order | 任一 resource/filesystem/network/process/workspace limit不可落实却想established,或run无法读取matching active lease时暂停。 |
| policy / high-risk | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | policy summary refs、authorization summary、boundary requirements、guard output | policy summary port、protocol inputs、failure mapping | policy missing/stale/conflicted/unsupported 被映射为 allow 时暂停。 |
| run / capture / handoff | `ControlledExecutionRun`;`CaptureFact`;`HandoffFact` | established boundary、accepted policy、backend lifecycle outcome、capture adapter output、handoff receipt | isolation backend / capture / handoff port、handoff protocol、save order | capture 直接升级为 artifact truth 或 handoff failure 回滚 capture truth 时暂停。 |
| failure / control / cleanup / redline | `FailureClassification`;`ControlFact`;`CleanupGuard`;`RedlineContainment` | failure markers、control source、capture/handoff/investigation summary、redline signal | state matrix、error taxonomy、cleanup / investigation ports | cleanup 绕过 evidence / handoff / redline guard 或 redline 只打日志时暂停。 |
| read / projection / derived | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`ReferenceResolutionState` | committed truth snapshot、reference refresh result、projection rebuild input | projection repository、query DTO、rebuild flow | query / derived / reconciliation 反写核心 truth 时暂停。 |
| relay / audit | `SandboxEventRelayRecord`;`SandboxAuditTrace` | domain truth change、publisher outcome、audit mapper、clock | event payload、publisher port、outbox / relay store | publish failure 试图回滚 source truth 或 audit 被修改时暂停。 |
| application helper | `SandboxServiceCallContext`;`SandboxIdempotencyRecord`;`SandboxStoredOperationResult`;`SandboxServiceOutcome` | entry metadata、request digest、idempotency key、service outcome、stored result ref | idempotency repository、stored result store、digest canonicalization | duplicate path 没有 typed stored result 读取面时暂停。 |
| infra adapter state | `AdapterAvailabilityState`;`IsolationBackendAdapterOutcome`;`MaterialHandoffAdapterOutcome`;`EventPublisherAdapterOutcome` | config validator、adapter health、adapter outcome enum、sanitized reason | port trait signatures、fake / durable parity | service / fake 解析 raw error string 自行分类时暂停。 |
| entry object | `SandboxApiCommandEnvelope`;`SandboxConsumerReceipt`;`SandboxJobReportAccumulator` | request/event/job envelope、entry metadata、application facade result | DTO / event / job schema、handler flow、report storage | entry 直接读 repository 或反推出 success/failed refs 时暂停。 |

---

## 17. 状态闭环审计表

| 状态族 | 状态主语 | 初始状态 | 关键迁移 | 终态 / 特殊状态 | 后续 Step 闭合位置 |
|---|---|---|---|---|---|
| Intake / Identity | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution` | `PendingResolution`;`Active` | `PendingResolution -> Accepted / Rejected / Unresolved`;`Active -> Closed / Invalidated` | `Rejected`;`Closed`;`Invalidated` | Step 9 intake flow;Step 10 state matrix |
| Boundary / Capability / Handle | `BoundaryRequirementSet`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle` | `Required`;`Pending`;`Fresh/Unknown`;`Active` | `Required -> Established / Rejected / PendingCapability / Failed`;`Active -> ReleasePending / Released / OrphanSuspected` | `Rejected`;`Failed`;`Released`;`Unsupported`;`Unavailable` | Step 7 backend port;Step 9 boundary flow;Step 10 matrix |
| Policy / High-Risk | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | `Applicable/Missing/Stale`;`Pending` | `Pending -> Accepted / Rejected / Blocked / FailClosed`;`Allowed -> Blocked / Unsupported` | `Rejected`;`Blocked`;`FailClosed` | Step 7 policy port;Step 9 policy flow;Step 10 matrix |
| Run / Capture / Handoff | `ControlledExecutionRun`;`CaptureFact`;`HandoffFact` | `Preparing`;`Pending`;`Pending` | `Preparing -> Running -> Completed / Failed / Terminated`;`Pending -> Complete / Partial / Failed`;`Pending -> Delivered / Retryable / Failed` | `Completed`;`Failed`;`Delivered`;`DeadLetter` | Step 7 backend / handoff ports;Step 9 run/capture/handoff flow |
| Failure / Control / Cleanup / Redline | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | `PendingInput`;`Accepted`;`Active`;`Suspected`;`PendingEvidence`;`Detected` | classify, conflict, expire, confirm, evaluate, contain, release | `Terminal`;`Completed`;`Released`;`Recovered`;`CleanupCompleted`;`Contained/Terminal` | Step 9 failure/control/cleanup/redline flow;Step 10 matrix;Step 12 errors |
| Reference / Projection / Derived | `ReferenceResolutionState`;`SandboxReadProjection`;`DerivedInspectPreviewTrendState` | `Resolved/Stale`;`Fresh`;`Fresh` | `mark_stale`;`start_rebuild`;`finish_rebuild`;`mark_failed` | `Unavailable`;`Degraded`;`Failed` | Step 7 projection repositories;Step 9 query/job flow;Step 11 persistence |
| Relay / Audit | `SandboxEventRelayRecord`;`SandboxAuditTrace` | `Pending`;append-only | `Pending -> Delivered / Failed / DeadLetter`;audit append only | `Delivered`;`DeadLetter`;audit immutable | Step 7 publisher / relay store;Step 9 relay flow;Step 15 audit |
| Application Idempotency / Stored Result | `SandboxIdempotencyRecord`;`SandboxStoredOperationResult` | `Reserved` | `Reserved -> Completed / Failed / Conflict`;duplicate replay | `Completed`;`Conflict`;`Failed` | Step 7 idempotency store;Step 13 concurrency / idempotency |
| Entry Disposition | `EntryDisposition`;`SandboxConsumerReceipt`;`SandboxJobExitDisposition` | `Accepted` or `Rejected` by entry mapper | accepted / delayed / skipped / failed mapping | response / ack / report terminal | Step 8 protocol;Step 9 handler / consumer / job flow |

---

## 18. 跨模块闭环审计表

| 审计项 | 检查内容 | 结论 | 修正位置 |
|---|---|---|---|
| shared ref 一致性 | `context_ref`、`run_ref`、`capture_ref`、`handoff_ref`、`trace_ref` 等是否统一使用 `contracts` typed carrier | 通过 | §10 |
| 重复对象 | 是否有 `api/worker/jobs` 重复定义 domain truth | 通过 | §11~§14 |
| 字段来源 | 关键字段是否能回到 request、resolver、id generator、repository load、adapter outcome 或 domain transition | 通过 | §16 |
| 状态语义 | public status、domain state、entry disposition 是否同义漂移 | 通过 | §17 |
| 依赖方向 | `contracts -> domain -> application -> infra -> entry` 是否保持单向 | 通过 | Step 5 + 本文件 §9~§14 |
| 重点边界 | execution environment identity、resource limits、filesystem/network/process boundary、launch policy、capture、observability material、failure、cleanup/lease/reaper、redline 是否均有对象承接 | 通过 | §11 |
| 禁止混入 | tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy truth 是否被排除 | 通过 | §10~§14 禁止事项 |

---

## 19. Step 7 承接清单

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| Context / Reference Resolver Port | `ControlledExecutionContext`;`ExecutionContextResolution`;`ReferenceResolutionState`;`ExternalSourceRefSet`;`SafeSummaryRefSet` | `ContextReferenceResolverPort` exact methods、resolver outcome enum、missing/conflict mapping | intake accepted 字段来源不闭合;外部正文可能入仓。 |
| Sandbox Truth Repository | domain truth objects: context、identity、boundary、policy decision、run、capture、handoff、failure、control、lease、cleanup、redline | repository save/load/list by ref、expected version、UoW participation | Step 9 无法定义事务和状态迁移。 |
| Backend Capability / Isolation Backend Port | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`IsolationBackendAdapterOutcome`;`IsolationEnvironmentHandle` | capability refresh、establish、release、inspect lifecycle methods and outcome enum | boundary 只能靠 fake / string error 分类。 |
| Policy Summary Port | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | load policy / authorization / high-risk summary、stale/conflict/missing outcome | fail-closed 无正式输入来源。 |
| Capture / Material / Observability / Handoff Ports | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact`;adapter outcome objects | capture result, material handoff, observability material handoff, receipt/failed/retryable outcome | capture / handoff 分层无法落码。 |
| Cleanup / Investigation / Redline Ports | `CleanupGuard`;`RedlineContainment`;`InvestigationHandoffSummary`;`OrphanRecoveryRecord` | investigation handoff, lifecycle inspect, cleanup release guard ports | cleanup / redline 容易变成脚本或日志。 |
| Projection / Derived Repositories | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`SandboxReconciliationReport` | read projection save/load/rebuild, derived state save/load, report store | query / derived / reconciliation 会反写 truth 或临时拼 view。 |
| Event Relay / Publisher Port | `SandboxEventRelayRecord`;`EventPublisherAdapterOutcome`;`SandboxAuditTrace` | relay store, publisher trait, publish outcome, feedback mapping | publish failure 无 no-rollback surface。 |
| Idempotency / Stored Result Repository | `SandboxIdempotencyRecord`;`SandboxStoredOperationResult`;`SandboxServiceCallContext` | reserve/get/complete/conflict methods、stored result save/get typed surface | duplicate replay 无正式读取面。 |
| Runtime Builder / Config Adapter | `SandboxRuntimeConfigSummary`;`AdapterAvailabilityState` | builder input, validated config summary loader, adapter availability checker | entry 启动 / degraded surface 不闭合。 |
| API / Worker / Job Entry Adapter | `SandboxApiCommandEnvelope`;`SandboxConsumerReceipt`;`SandboxJobRunContext`;`SandboxJobReportAccumulator` | entry facade methods、receipt/report mapping、runtime assembly | entry 直接补 schema 或读 repository。 |

---

## 20. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
> - `design-calibration/03_ddd_step_06_object_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“对象组字段来源审计表”“状态闭环审计表”“Step 7 承接清单”和“待确认事项”小节,了解模块对象契约如何从概要对象轮廓收敛为可落码实现契约。

### 5. 模块实现契约

`L4-sandbox` 的对象实现契约按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块展开。`contracts` 负责所有 public carrier、typed refs、status、kind、view、report、receipt 和 public error;`domain` 负责 sandbox truth、decision、guard、record、read identity、relay 和 audit;`application` 负责 service call context、idempotency、stored result、service outcome、query no-write decision 和 application error;`infra` 负责 runtime config summary、adapter availability 和 adapter outcome;`api/worker/jobs` 只负责入口 envelope、receipt、loop result、job context、report accumulator 和 entry disposition。

对象闭口摘要:

| 收口主题 | 结论 | 后续承接 |
|---|---|---|
| shared vocabulary / typed ref / public marker | `SandboxOpaqueId/Ref/Reason/Digest`、`ExternalSourceRef`、`ForbiddenExternalBodyMarkerSet`、public status / error / disposition 归 `contracts`。 | Step 8 DTO;Step 10 状态矩阵 |
| domain truth / guard / record | context、identity、resolution、boundary、backend capability、policy decision、run、capture、handoff、failure、control、lease、orphan、cleanup、redline、reference、projection、derived、relay、audit 均已闭口对象契约。 | Step 7 ports;Step 9 flows;Step 10 states;Step 11 persistence |
| 非 core 模块对象决策 | `application` 的 call context、idempotency、stored result、service outcome、query access、error 已闭口;`infra/api/worker/jobs` stable entry / adapter carrier 已闭口。 | Step 7 exact traits;Step 8 protocol;Step 9 flow;Step 13 concurrency |
| 字段来源闭环摘要 | 关键字段来源限定为 request/event metadata、resolver summary、id generator、repository load、adapter outcome、domain transition、clock 和 config validator。 | Step 7 / 8 / 9 / 11 |
| 状态闭环摘要 | 状态族覆盖 intake/identity、boundary/capability/handle、policy/high-risk、run/capture/handoff、failure/control/cleanup/redline、reference/projection/derived、relay/audit、idempotency/entry disposition。 | Step 10 |
| Step 7 承接摘要 | resolver、truth repository、backend / isolation、policy summary、capture / handoff、cleanup / investigation、projection / derived、relay / publisher、idempotency / stored result、runtime builder、entry adapter。 | Step 7 |

正式 `03` 装配时,每个模块小节应先写 capability / 功能到对象映射,再摘录本文件对应对象卡片中的字段、函数、factory、enum 和不变量;不得把本文件的过程性批次表、停审记录和旧材料诊断直接搬进正式正文。

---

## 21. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 7 |
|---|---|---|
| `core-contracts` 中 `ActorRef`、trace metadata、timestamp / instant 等 exact type 是否已存在 | 本文件按 `core-contracts` 可承载引用处理;Step 7 / 8 若发现不可检索,需回报上游 contracts 缺口或改用本仓 wrapper。 | 不阻塞进入 Step 7,但阻塞正式装配 exact schema。 |
| 目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | 作为 Step 17 / `07` 实施前置检查;当前只写 planned design。 | 否 |
| backend product、DB / object store / bus / observability / investigation 系统 | 本步只定义 adapter outcome 和 profile refs;产品选择留 Step 14 / `04` / `07`。 | 否 |
| retry/backoff/timeout/retention/lease 数值 | 本步只定义 carrier 和状态;具体数值留配置设计。 | 否 |
| failure taxonomy / high-risk action taxonomy 全集 | 本步定义 kind/status carrier;完整错误与状态矩阵留 Step 10 / 12。 | 否 |
| exact DTO / event / job schema | 本步只定义 carrier owner;Step 8 闭口。 | 否 |

---

## 22. 自检

| 检查项 | 结果 |
|---|---|
| 是否修改正式 `03-详细设计.md` | 否。本步只创建 Step 6 中间产物并准备更新台账。 |
| 是否创建目标实现仓或 Rust 源码 | 否。 |
| 是否按模块 capability 推导对象 | 是。§10~§14 均先列 capability / 对象映射 / 对象能力映射。 |
| 是否给出 Rust 类型定义代码块 | 是。每个对象组均有 Rust-facing contract code block。 |
| 是否写字段表、成员函数表、factory / 静态函数表、enum 变体表 | 是。对象组按表格收口;具体状态 enum 变体表覆盖关键状态族。 |
| 是否闭合重点边界 | 是。execution environment identity、resource limits、filesystem/network/process boundary、tool/runtime launch policy execution、artifact capture、observability hooks/material、failure classification、cleanup/lease/reaper、security redlines 均有对象 owner。 |
| 是否混入禁止范围 | 否。tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 均被排除。 |
| 是否新增上游 blocker | 否。只保留 existing downstream / implementation 前置检查。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 23. 阶段性进入下一步条件草稿

```text
Step 6 已完成:
- 批次状态表和模块执行顺序表已建立。
- 每个模块的 capability 已映射到对象。
- 每个对象均能回指模块功能。
- 对象字段、函数、factory、状态和不变量已达到 Rust-facing contract 粒度。
- 非 core 模块对象闭口 / defer 决策已显式记录。
- 字段来源审计、状态闭环审计和 Step 7 承接清单已完成。
```

本节为主对象组写作完成时形成的阶段性门禁草稿。补充 §24 单对象卡片和 §25 支撑载体闭口表后,最终进入下一步条件以 §26 为准。

---

## 24. 对象独立小节补充卡片

本节补充单对象审查锚点。前文 §10~§14 已按模块和对象组给出 Rust 类型定义、字段表、函数表、factory 表、状态变体表和禁止事项;本节逐对象建立独立小节,用于后续 Step 7 / Step 8 / Step 9 按对象反查。若本节摘要与前文对象组正文冲突,以前文 §10~§14 的完整对象契约为准,并在进入 Step 7 前修正本节摘要。

### 24.1 `contracts` 对象独立卡片

#### `SandboxOpaqueRef`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4;`pub struct SandboxOpaqueRef(pub String);` |
| 字段 / 来源 | `0: String`;来自 command / event / resolver / repository 的 body-free ref;必须非空。 |
| 函数 / factory | `new_non_empty(value: String) -> Result<SandboxOpaqueRef, ContractError>`。 |
| 不变量 | 不保存正文;不得作为外部 raw URL / body locator。 |

#### `SandboxOpaqueId`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4;`pub struct SandboxOpaqueId(pub String);` |
| 字段 / 来源 | `0: String`;来自 application id generator 或 repository load;必须非空。 |
| 函数 / factory | 由具体 typed ref factory 包装,不得在业务层裸传。 |
| 不变量 | opaque、稳定、不可解析内部结构。 |

#### `SandboxReason`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4;`pub struct SandboxReason(pub String);` |
| 字段 / 来源 | `0: String`;来自 guard、adapter outcome、entry validation 或 error mapping;必须非空。 |
| 函数 / factory | 由具体 transition / error factory 接收。 |
| 不变量 | 只承载解释语义,不替代状态 enum、policy result 或 external body。 |

#### `SandboxDigest`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4;`pub struct SandboxDigest(pub String);` |
| 字段 / 来源 | `0: String`;来自 resolver、source event、material adapter 或 request canonicalization。 |
| 函数 / factory | 由 Step 8 / Step 13 闭口 canonicalization 后构造。 |
| 不变量 | 不定义算法;不保存摘要正文;不得用本地时间或 id 伪造。 |

#### `ControlledExecutionContextRef`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4。 |
| 字段 / 来源 | `context_id: SandboxOpaqueId`;来自 generated / persisted context id。 |
| 函数 / factory | `SandboxTypedRefFamily::context_ref(...)`。 |
| 不变量 | 只引用 context truth,不表达 visibility 或 success。 |

#### `ExecutionEnvironmentIdentityRef`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4。 |
| 字段 / 来源 | `environment_identity_id: SandboxOpaqueId`;来自 execution identity id generator / repository。 |
| 函数 / factory | 由 `ExecutionEnvironmentIdentity::bind(...)` 所需 id 构造。 |
| 不变量 | 不等于 actor / member / runtime identity truth。 |

#### `ExternalSourceRef`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4。 |
| 字段 / 来源 | `source_kind`;`external_ref`;`source_version_ref`;`source_digest`;来自 request、event、resolver summary。 |
| 函数 / factory | `from_resolver(...)`;`same_external_source(...)`。 |
| 不变量 | 只保存 body-free ref、version 和 digest;不保存 identity / work / tool / runtime / policy / artifact / observability / investigation 正文。 |

#### `ExternalSourceRefSet`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4。 |
| 字段 / 来源 | `0: Vec<ExternalSourceRef>`;来自 request、event、resolver output。 |
| 函数 / factory | 由 resolver / entry mapper 生成 ordered unique set。 |
| 不变量 | ordered unique;去重依据为 source kind + external ref。 |

#### `ForbiddenExternalBodyMarkerSet`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.4。 |
| 字段 / 来源 | `0: Vec<ExternalBodyMarker>`;来自 resolver、guard、redline 或 exclusion policy。 |
| 函数 / factory | `contains_forbidden_body()`。 |
| 不变量 | 出现 marker 时必须拒绝、降级或阻断外部正文入仓。 |

#### `ExternalSourceKind`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.5。 |
| 变体 / 来源 | `Identity`;`Work`;`Tool`;`Runtime`;`Policy`;`Artifact`;`Observability`;`Investigation`;来自 request / event / resolver。 |
| 函数 / factory | 作为 `ExternalSourceRef` 字段使用。 |
| 不变量 | source kind 不引入 sibling compile dependency。 |

#### `ExternalBodyMarker`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.5。 |
| 变体 / 来源 | identity、work、tool semantic、runtime loop、policy definition、artifact、observability、investigation body marker。 |
| 函数 / factory | 由 exclusion guard / resolver outcome 生成。 |
| 不变量 | marker 表示禁止入仓正文类别,不得被配置关闭。 |

#### `ControlledExecutionIntakeStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.5。 |
| 变体 / 来源 | `PendingResolution`;`Accepted`;`Rejected`;`Unresolved`;`Closed`;来源于 `ControlledExecutionContext` transition。 |
| 函数 / factory | `is_executable_context()` 依赖该 enum。 |
| 不变量 | 只有 `Accepted` 允许进入 boundary / policy 主线。 |

#### `BoundaryDecisionStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.5。 |
| 变体 / 来源 | `Required`;`Established`;`Rejected`;`PendingCapability`;`Failed`;来源于 boundary guard / adapter outcome。 |
| 函数 / factory | `to_boundary_decision_status()` 从 infra outcome 映射。 |
| 不变量 | `PendingCapability` / `Failed` 不得映射为 allow。 |

#### `PolicyExecutionDecisionStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.5。 |
| 变体 / 来源 | `Accepted`;`Rejected`;`Blocked`;`Pending`;`FailClosed`;来源于 policy guard / snapshot。 |
| 函数 / factory | `PolicyExecutionDecision::accept/reject/block/fail_closed`;`HighRiskActionDecision::decide`。 |
| 不变量 | non-accepted 状态必须阻断 launch。 |

#### `SandboxExecutionStatusView`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.6。 |
| 字段 / 来源 | `view_ref`;`context_ref`;`intake_status`;`boundary_status`;`policy_status`;`degraded_markers`;`audit_trace_ref`;来自 projection / query assembly。 |
| 函数 / factory | `from_projection(...)`;`degraded(...)`;`is_degraded()`;`can_show_success()`。 |
| 不变量 | view 只读,不得反写核心 truth 或伪造 success。 |

#### `SandboxReconciliationReport`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.6。 |
| 字段 / 来源 | `report_ref`;`scope_ref`;`report_status`;`finding_refs`;来自 reconciliation job assembly。 |
| 函数 / factory | `report_clean(...)`;`has_findings()`。 |
| 不变量 | finding 只保存 refs,不保存外部正文;report 不修核心 truth。 |

#### `ReconciliationReportStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.6。 |
| 变体 / 来源 | `Clean`;`IssuesFound`;`Degraded`;`Failed`;来自 reconciliation job。 |
| 函数 / factory | `finish_report(...)` 后续映射。 |
| 不变量 | `IssuesFound` 只报告问题,不得直接改 core truth。 |

#### `SandboxPublicErrorKind`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.7。 |
| 变体 / 来源 | request、auth、reference、boundary、policy、blocked、unavailable、duplicate、failed 等 public error kind。 |
| 函数 / factory | `SandboxApplicationError::to_public_error_kind()`。 |
| 不变量 | public error 不暴露 raw adapter / external body。 |

#### `EntryDisposition`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §10.7。 |
| 变体 / 来源 | `Accepted`;`Rejected`;`Delayed`;`Skipped`;`Failed`;来自 api / worker / job entry mapping。 |
| 函数 / factory | entry disposition factory / mapper 使用。 |
| 不变量 | disposition 只描述入口行为,不推进 domain state。 |

### 24.2 `domain` 对象独立卡片

#### `ControlledExecutionContext`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.4。 |
| 字段 / 来源 | `context_ref`;`source_refs`;`responsibility_context`;`intake_status`;`resolution_ref`;`audit_trace_ref`;来自 request / resolver / id generator / audit trace。 |
| 函数 / factory | `open_pending`;`reject_unresolved`;`accept`;`reject`;`close`;`is_executable_context`;`attach_boundary`。 |
| 状态 / 不变量 | `ControlledExecutionIntakeStatus`;accepted 前不得 launch;不保存外部正文。 |

#### `ExecutionEnvironmentIdentity`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.5。 |
| 字段 / 来源 | `environment_identity_ref`;`context_ref`;`responsibility_anchor`;`trace_context`;`identity_status`;来自 accepted context 与 responsibility summary。 |
| 函数 / factory | `bind`;`close`;`invalidate`;`can_anchor_boundary`。 |
| 状态 / 不变量 | `ExecutionEnvironmentIdentityStatus`;不拥有 actor / member lifecycle,不作为权限源。 |

#### `ExecutionContextResolution`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.6。 |
| 字段 / 来源 | `resolution_ref`;`context_ref`;`resolved_refs`;`safe_summaries`;`unresolved_items`;`conflict_markers`;`resolution_status`;来自 resolver outcome。 |
| 函数 / factory | `from_resolver_result`;`requires_rejection`;`supports_execution_identity`;`missing_required_refs`。 |
| 状态 / 不变量 | `ReferenceResolutionStatus`;conflicted / required unresolved 不得 accepted。 |

#### `BoundaryRequirementSet`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.7。 |
| 字段 / 来源 | `requirement_ref`;`context_ref`;`environment_identity_ref`;`boundary_profile_ref`;`limit_template_ref`;`runtime_generation_ref`;`resource_limits`;`filesystem_boundary`;`network_boundary`;`process_boundary`;`workspace_boundary`;来自accepted context、active identity、显式requirements和builder注入的generation-scoped boundary service参数。 |
| 函数 / factory | `from_context_and_requirements`;`requires_no_network`;`all_limit_kinds`;`is_satisfied_by`。 |
| 不变量 | resource / filesystem / network / process / workspace boundary 必须整体成立,不硬编码 backend 产品。 |

#### `CoherentBoundary`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.8。 |
| 字段 / 来源 | `boundary_ref`;`context_ref`;`requirement_ref`;`decision_ref`;`isolation_handle_ref`;`boundary_status`;来自 boundary decision 与 isolation handle。 |
| 函数 / factory | `established`;`rejected`;`is_established`;`contains_weak_fallback`;`requires_cleanup_on_failure`;`permits_launch`。 |
| 状态 / 不变量 | `BoundaryCoherenceStatus`;禁止 silent degrade、host-run / weak fallback。 |

#### `BoundaryEstablishmentDecision`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.8。 |
| 字段 / 来源 | `decision_ref`;`context_ref`;`requirement_ref`;`decision_status`;`decision_reason`;`backend_capability_ref`;来自 guard 和 backend outcome。 |
| 函数 / factory | 被 `CoherentBoundary::established/rejected` 消费;状态由 infra outcome mapper 生成。 |
| 状态 / 不变量 | `BoundaryDecisionStatus`;只记录裁定,不直接启动 runtime。 |

#### `BackendCapabilitySummary`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.9。 |
| 字段 / 来源 | `capability_ref`;`backend_profile_ref`;`supported_limit_kinds`;`capability_status`;`unsupported_reason`;来自 backend capability adapter。 |
| 函数 / factory | `from_adapter_summary`;`supports`;`requires_refresh`。 |
| 状态 / 不变量 | `BackendCapabilityStatus`;unknown / stale / unsupported 不得 allow。 |

#### `IsolationEnvironmentHandle`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.9。 |
| 字段 / 来源 | `isolation_handle_ref`;`context_ref`;`backend_profile_ref`;`handle_status`;`lease_ref`;来自 isolation backend adapter / lease creation。 |
| 函数 / factory | `active`;`mark_release_pending`;`mark_orphan_suspected`。 |
| 状态 / 不变量 | `IsolationHandleStatus`;不保存 SDK 原始响应;orphan suspected 必须进入 reaper / cleanup。 |

#### `PolicyApplicabilitySnapshot`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.10。 |
| 字段 / 来源 | `snapshot_ref`;`context_ref`;`policy_refs`;`authorization_summary_refs`;`authorization_disposition`;`applicability_status`;`high_risk_markers`;来自policy summary port对request body-free输入的显式分类。 |
| 函数 / factory | `from_policy_summary`;`can_evaluate`;`requires_fail_closed`。 |
| 不变量 | 不拥有 policy / approval / allowlist truth;missing / stale / conflicted 必须 fail-closed 或 pending。 |

#### `PolicyExecutionDecision`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.10。 |
| 字段 / 来源 | `decision_ref`;`context_ref`;`boundary_requirement_ref`;`snapshot_ref`;`decision_status`;`decision_reason`;`audit_trace_ref`;来自 policy snapshot 与 guard output。 |
| 函数 / factory | `accept`;`fail_closed`;`permits_execution`;`must_block_launch`。 |
| 状态 / 不变量 | `PolicyExecutionDecisionStatus`;non-accepted 状态必须阻断 run。 |

#### `HighRiskActionDecision`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.10。 |
| 字段 / 来源 | `action_decision_ref`;`policy_decision_ref`;`action_markers`;`action_status`;`block_reason`;来自 high-risk markers 和 authorization summary。 |
| 函数 / factory | `decide`;`requires_redline_containment`。 |
| 不变量 | unknown / unauthorized high-risk action 不得继续执行。 |

#### `ControlledExecutionRun`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.11。 |
| 字段 / 来源 | `run_ref`;`context_ref`;`boundary_ref`;`policy_decision_ref`;`run_status`;`isolation_handle_ref`;`started_at`;`finished_at`;来自 established boundary、accepted policy、backend outcome、clock。 |
| 函数 / factory | `prepare`;`mark_running`;`mark_completed`;`mark_failed`。 |
| 状态 / 不变量 | `ControlledExecutionRunStatus`;不等于 runtime agent loop 或 runtime truth。 |

#### `CaptureFact`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.11。 |
| 字段 / 来源 | `capture_ref`;`run_ref`;`material_refs`;`observability_refs`;`capture_status`;`audit_trace_ref`;来自 backend capture / observability adapter。 |
| 函数 / factory | `complete`;`is_complete`;`requires_handoff`;`material_ref_set`。 |
| 状态 / 不变量 | `CaptureStatus`;capture 不等于 artifact truth。 |

#### `CapturedMaterialRef`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.11。 |
| 字段 / 来源 | `material_ref`;`material_kind`;`material_digest`;来自 capture adapter output。 |
| 函数 / factory | 由 `CaptureFact::complete(...)` 接收。 |
| 不变量 | 只引用候选材料,不保存 artifact body 或宣布 formal artifact。 |

#### `HandoffFact`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.11。 |
| 字段 / 来源 | `handoff_ref`;`source_capture_ref`;`target_kind`;`handoff_status`;`receipt_ref`;`failure_reason`;来自 capture fact、handoff adapter、feedback consumer。 |
| 函数 / factory | `open_pending`;`can_retry`;`blocks_cleanup`;`to_handoff_status` through adapter outcome。 |
| 状态 / 不变量 | `HandoffStatus`;handoff failure 不回滚 capture truth。 |

#### `FailureClassification`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.12。 |
| 字段 / 来源 | `failure_ref`;`context_ref`;`run_ref`;`failure_kind`;`failure_status`;`source_markers`;`audit_trace_ref`;来自 policy deny、backend/capture/handoff/control/redline markers。 |
| 函数 / factory | `classify`;`is_terminal_failure`;`requires_cleanup_guard`;`requires_redline_containment`。 |
| 状态 / 不变量 | `FailureClassificationStatus`;失败不得伪装 success。 |

#### `CleanupGuard`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.12。 |
| 字段 / 来源 | `cleanup_guard_ref`;`context_ref`;`capture_ref`;`handoff_ref`;`investigation_summary`;`guard_status`;`blocking_reasons`;来自 capture/handoff/investigation/redline truth。 |
| 函数 / factory | `evaluate`;`allows_cleanup`;`blocks_release`。 |
| 状态 / 不变量 | `CleanupGuardStatus`;证据 / handoff / investigation 未安全交接前不得 cleanup。 |

#### `RedlineContainment`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.12。 |
| 字段 / 来源 | `redline_ref`;`context_ref`;`redline_kind`;`containment_status`;`handoff_summary`;`release_guard_ref`;来自 redline signal 和 investigation handoff。 |
| 函数 / factory | `detect`;`requires_investigation_handoff`;`blocks_cleanup`。 |
| 状态 / 不变量 | `RedlineContainmentStatus`;redline 不 advisory-only。 |

#### `LeaseRecord`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.13。 |
| 字段 / 来源 | `lease_ref`;`isolation_handle_ref`;`context_ref`;`lease_status`;`lease_window`;`reaper_marker`;来自 handle、adapter、config summary、clock。 |
| 函数 / factory | `open`;`is_expired`;`requires_orphan_detection`;`mark_released`。 |
| 状态 / 不变量 | `LeaseStatus`;不代表 backend lifecycle truth。 |

#### `OrphanRecoveryRecord`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.13。 |
| 字段 / 来源 | `orphan_record_ref`;`lease_ref`;`isolation_handle_ref`;`orphan_status`;`backend_lifecycle_summary`;`cleanup_guard_ref`;来自 lease / backend lifecycle adapter / cleanup guard。 |
| 函数 / factory | `suspect`;`confirm`。 |
| 状态 / 不变量 | `OrphanRecoveryStatus`;不重写 runtime / backend truth,不绕过 cleanup guard。 |

#### `ControlFact`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.13。 |
| 字段 / 来源 | `control_ref`;`context_ref`;`control_kind`;`control_source`;`control_status`;`failure_ref`;来自 command / consumer / operations input。 |
| 函数 / factory | `accept`;`conflicts_with`;`requires_termination`。 |
| 状态 / 不变量 | `ControlFactStatus`;不执行业务 replay、不推进 runtime recover。 |

#### `ReferenceResolutionState`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.14。 |
| 字段 / 来源 | `reference_state_ref`;`tracked_refs`;`safe_summary_refs`;`resolution_status`;`refresh_marker`;`forbidden_body_markers`;来自 reference refresh / resolver。 |
| 函数 / factory | `track`;`mark_stale`;`rejects_external_body`。 |
| 状态 / 不变量 | `ReferenceResolutionStatus`;只维护 body-free reference state。 |

#### `DerivedInspectPreviewTrendState`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.14。 |
| 字段 / 来源 | `derived_state_ref`;`source_refs`;`derived_kind`;`freshness_status`;`rebuild_marker`;`failure_summary`;来自 derived maintenance。 |
| 函数 / factory | `from_sources`;`mark_derived_failed`。 |
| 状态 / 不变量 | `DerivedFreshnessStatus`;派生失败不得伪造核心失败。 |

#### `SandboxReadProjection`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.14。 |
| 字段 / 来源 | `projection_ref`;`context_ref`;`status_view_refs`;`projection_status`;`degraded_markers`;来自 committed truth snapshot / projection rebuild。 |
| 函数 / factory | `create`;`requires_rebuild`;`is_degraded`。 |
| 状态 / 不变量 | `SandboxProjectionStatus`;projection 可重建,不得反写 truth。 |

#### `SandboxEventRelayRecord`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.14。 |
| 字段 / 来源 | `relay_ref`;`source_truth_ref`;`event_kind`;`relay_status`;`publish_attempts`;`last_error`;来自 truth change / publisher outcome。 |
| 函数 / factory | `pending`;`can_retry`;`must_not_rollback_source`。 |
| 状态 / 不变量 | `EventRelayStatus`;publish failure 不回滚 source truth。 |

#### `SandboxAuditTrace`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §11.14。 |
| 字段 / 来源 | `trace_ref`;`subject_ref`;`trace_kind`;`source_ref`;`occurred_at`;`reason`;来自 domain change / audit mapper / clock。 |
| 函数 / factory | `append`;`same_subject`;`is_append_only`。 |
| 不变量 | append-only;不得修改历史 trace 或保存外部正文。 |

### 24.3 `application` 对象独立卡片

#### `SandboxServiceCallContext`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.4。 |
| 字段 / 来源 | `operation_name`;`channel`;`actor_ref`;`trace_context`;`request_digest`;`idempotency_key`;来自 entry metadata / core metadata。 |
| 函数 / factory | `from_command`;`from_query`;`from_job`;`requires_idempotency`;`same_operation`;`trace_ref`。 |
| 状态 / 不变量 | `SandboxOperationChannel`;不保存 DTO body;query no-write。 |

#### `SandboxOperationChannel`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.4。 |
| 变体 / 来源 | `ApiCommand`;`ApiQuery`;`Consumer`;`Worker`;`Job`;来自 entry module。 |
| 函数 / factory | 被 `SandboxServiceCallContext` 使用。 |
| 不变量 | channel 只决定 application 调用语境,不决定业务 state。 |

#### `SandboxIdempotencyRecord`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.5。 |
| 字段 / 来源 | `idempotency_ref`;`operation_name`;`request_digest`;`record_status`;`stored_result_ref`;来自 service context / idempotency repository。 |
| 函数 / factory | `reserve`;`matches_request`;`can_replay`;`mark_completed`。 |
| 状态 / 不变量 | `IdempotencyRecordStatus`;duplicate 不重新计算结果。 |

#### `SandboxStoredOperationResult`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.5。 |
| 字段 / 来源 | `stored_result_ref`;`operation_name`;`result_kind`;`public_result_ref`;`result_status`;来自 service outcome。 |
| 函数 / factory | `from_service_outcome`;`is_replayable`;`matches_operation`。 |
| 状态 / 不变量 | `StoredResultStatus`;只保存 public result ref,不保存 domain body。 |

#### `IdempotencyRecordStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.5。 |
| 变体 / 来源 | `Reserved`;`Completed`;`Duplicate`;`Conflict`;`Failed`;来自 idempotency repository flow。 |
| 函数 / factory | `can_replay()` 和 `mark_completed()` 使用。 |
| 不变量 | `Conflict` 不得 replay;`Completed` 必须有 stored result ref。 |

#### `SandboxApplicationError`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.6。 |
| 字段 / 来源 | `error_kind`;`reason`;`retryable`;`trace_ref`;来自 domain error、port outcome、idempotency conflict。 |
| 函数 / factory | `from_domain`;`from_port`;`duplicate_mismatch`;`to_public_error_kind`;`is_retryable`。 |
| 不变量 | 不暴露 raw adapter error 或外部正文。 |

#### `SandboxServiceOutcome`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.6。 |
| 字段 / 来源 | `outcome_ref`;`outcome_status`;`domain_refs`;`stored_result_ref`;`side_effect_refs`;来自 domain transition、ports、UoW。 |
| 函数 / factory | `accepted`;`rejected`;`degraded`;`failed`;`requires_commit`;`should_store_result`。 |
| 状态 / 不变量 | `ServiceOutcomeStatus`;side effect refs 必须有正式来源。 |

#### `SandboxQueryAccessDecision`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §12.6。 |
| 字段 / 来源 | `decision_ref`;`query_kind`;`visibility_status`;`degraded_markers`;来自 visibility resolver、projection、reference state。 |
| 函数 / factory | `visible`;`degraded`;`permits_read`;`requires_no_write`。 |
| 状态 / 不变量 | `QueryAccessStatus`;query 不得写 core truth。 |

### 24.4 `infra` 对象独立卡片

#### `SandboxRuntimeConfigSummary`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.4。 |
| 字段 / 来源 | `config_profile_ref`;`backend_profile_ref`;`adapter_profile_refs`;`disabled_adapter_kinds`;`config_status`;`validated_at`;来自 config validator。 |
| 函数 / factory | `from_validated_config`;`is_adapter_disabled`;`requires_startup_block`。 |
| 状态 / 不变量 | `RuntimeConfigStatus`;配置不得改变 domain 不变量。 |

#### `AdapterAvailabilityState`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.4。 |
| 字段 / 来源 | `adapter_kind`;`availability_status`;`last_checked_at`;`reason`;来自 startup / health check。 |
| 函数 / factory | `unavailable`;`can_call`;`to_application_error`。 |
| 状态 / 不变量 | `AdapterAvailabilityStatus`;adapter availability 不决定 business allow。 |

#### `RuntimeConfigStatus`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.4。 |
| 变体 / 来源 | `Valid`;`StartupBlocked`;`Degraded`;来自 config validator。 |
| 函数 / factory | `requires_startup_block()` 使用。 |
| 不变量 | `Degraded` 只能影响 read / maintenance surface,不得放宽 redline / fail-closed。 |

#### `IsolationBackendAdapterOutcome`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.5。 |
| 字段 / 来源 | `outcome_status`;`handle_ref`;`capability_ref`;`reason`;来自 isolation backend adapter。 |
| 函数 / factory | `established`;`unsupported`;`to_boundary_decision_status`;`requires_retry`。 |
| 状态 / 不变量 | `IsolationBackendOutcomeStatus`;不保存 SDK response body。 |

#### `MaterialHandoffAdapterOutcome`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.5。 |
| 字段 / 来源 | `outcome_status`;`receipt_ref`;`retry_after`;`reason`;来自 handoff adapter / feedback。 |
| 函数 / factory | `delivered`;`retryable`;`to_handoff_status`;`blocks_cleanup`。 |
| 状态 / 不变量 | `HandoffAdapterOutcomeStatus`;failure 不回滚 capture truth。 |

#### `EventPublisherAdapterOutcome`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §13.5。 |
| 字段 / 来源 | `outcome_status`;`publisher_receipt_ref`;`reason`;来自 event publisher。 |
| 函数 / factory | `dead_letter`;`to_relay_status`;`must_not_rollback_source`。 |
| 状态 / 不变量 | `PublisherOutcomeStatus`;publish failure 不回滚 source truth。 |

### 24.5 Entry 对象独立卡片

#### `SandboxApiCommandEnvelope`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.6。 |
| 字段 / 来源 | `operation_name`;`metadata`;`request_digest`;`idempotency_key`;来自 API request / metadata。 |
| 函数 / factory | `from_request`;`to_call_context`。 |
| 不变量 | API 只做 mapping,不直接访问 repository。 |

#### `SandboxApiQueryEnvelope`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.6。 |
| 字段 / 来源 | `query_name`;`metadata`;`request_digest`;来自 API query request。 |
| 函数 / factory | `from_query_request`;`to_query_context`。 |
| 不变量 | query entry no-write。 |

#### `SandboxApiDisposition`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.6。 |
| 字段 / 来源 | `disposition`;`error_kind`;`trace_ref`;来自 application outcome / error。 |
| 函数 / factory | `from_application_error`。 |
| 不变量 | 不推进 domain state,不泄露 raw adapter error。 |

#### `SandboxConsumerReceipt`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.7。 |
| 字段 / 来源 | `source_event_ref`;`receipt_status`;`stored_result_ref`;`reason`;来自 event envelope、application result、idempotency。 |
| 函数 / factory | `accepted`;`duplicate`;`should_ack`;`should_retry`。 |
| 状态 / 不变量 | `ConsumerReceiptStatus`;consumer 不修核心 truth。 |

#### `SandboxWorkerRunContext`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.7。 |
| 字段 / 来源 | `worker_kind`;`batch_ref`;`trace_context`;`started_at`;来自 worker runtime。 |
| 函数 / factory | `start`;`for_item`;`finish`。 |
| 状态 / 不变量 | worker context 不读 repository 反推业务状态。 |

#### `SandboxFulfillmentLoopResult`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.7。 |
| 字段 / 来源 | `worker_run_ref`;`loop_status`;`processed_refs`;`failed_refs`;来自 application fulfillment facade result。 |
| 函数 / factory | `has_failures()`。 |
| 状态 / 不变量 | `WorkerRunStatus`;fulfillment loop 不绕过 application service。 |

#### `SandboxRelayLoopResult`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.7。 |
| 字段 / 来源 | `worker_run_ref`;`delivered_refs`;`retryable_refs`;`dead_letter_refs`;来自 relay service result。 |
| 函数 / factory | loop result assembly。 |
| 不变量 | relay failure 不回滚 source truth。 |

#### `SandboxJobRunContext`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.8。 |
| 字段 / 来源 | `job_kind`;`run_ref`;`cursor_ref`;`trace_context`;`started_at`;来自 job input / runtime。 |
| 函数 / factory | `start`;`next_batch`。 |
| 状态 / 不变量 | job 不作为业务 command。 |

#### `SandboxJobReportAccumulator`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.8。 |
| 字段 / 来源 | `job_kind`;`succeeded_refs`;`failed_refs`;`skipped_refs`;`degraded_markers`;来自 application job facade result。 |
| 函数 / factory | `new`;`record_success`;`record_failure`;`finish_report`。 |
| 不变量 | report 字段必须保存 / replay 对称;entry 不扫描 repository 反推。 |

#### `SandboxJobExitDisposition`

| 项 | 闭口 |
|---|---|
| 类型定义 | 见 §14.8。 |
| 字段 / 来源 | `report_status`;`report_ref`;`exit_code`;来自 job report accumulator finish。 |
| 函数 / factory | `finish_report` 返回。 |
| 不变量 | exit code 不等于业务 truth state。 |

---

## 25. 支撑载体闭口表

本节闭口 §10~§14 字段中引用但未作为独立 truth object 展开的 `*Kind`、`*Status`、`*Summary`、`*Marker`、`*RefSet`、`*OutcomeStatus`、时间和错误载体。它们属于当前 Step 6 Rust-facing schema,不是让实现者后续自由发明的占位。Step 7+ 可以继续定义 port 方法、DTO schema、状态矩阵和错误映射,但不得改写本节的 owner、字段来源和禁止替代规则。

### 25.1 基础支撑载体

```rust
/// Logical instant used by sandbox domain and adapter summaries.
pub struct SandboxInstant(pub String);

/// Trace context shared across entry, application, domain, and audit records.
pub struct SandboxTraceContext {
    /// Trace reference.
    pub trace_ref: SandboxOpaqueRef,
    /// Optional parent trace reference.
    pub parent_trace_ref: Option<SandboxOpaqueRef>,
}

/// Body-free safe summary reference set.
pub struct SafeSummaryRefSet(pub Vec<SandboxOpaqueRef>);

/// Application-selected operation name.
pub struct SandboxOperationName(pub String);
```

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `SandboxInstant` | non-empty opaque string wrapper | core clock / adapter source time / job runtime | 不得用 page cursor、id、digest 或 local guessed timestamp 代替业务时序。 |
| `SandboxTraceContext` | `{ trace_ref, parent_trace_ref }` | core metadata、entry metadata、audit mapper | 不得由 entry 随机拼 subject;无来源时必须由正式 trace factory 生成。 |
| `SafeSummaryRefSet` | ordered unique `Vec<SandboxOpaqueRef>` | resolver / source event / reference store | 不得保存 summary body 或 mixed-owner refs。 |
| `SandboxOperationName` | non-empty string wrapper | API route selector、consumer selector、job selector | 不得从 raw route / topic / binary name 在 service 内临时解析。 |

### 25.2 typed ref family 闭口

以下 `*Ref` 均采用相同 Rust-facing 形态,并按 ref 名称拥有唯一对象归属:

```rust
/// Stable typed reference wrapper used for sandbox-owned objects.
pub struct SandboxTypedRef {
    /// Stable sandbox-local identity.
    pub id: SandboxOpaqueId,
}
```

| ref family | exact names | 字段来源 | 禁止替代 |
|---|---|---|---|
| context / identity / resolution | `ExecutionContextResolutionRef`;`ExecutionEnvironmentIdentityRef`;`ControlledExecutionContextRef` | id generator、repository load | 不得从 actor/work/source refs 拼接。 |
| boundary / backend / handle | `BoundaryRequirementSetRef`;`CoherentBoundaryRef`;`BoundaryEstablishmentDecisionRef`;`BackendCapabilitySummaryRef`;`IsolationEnvironmentHandleRef` | boundary service、backend capability adapter、repository load | 不得用 backend profile ref 或 SDK handle body 代替。 |
| policy / action | `PolicyApplicabilitySnapshotRef`;`PolicyExecutionDecisionRef`;`HighRiskActionDecisionRef` | policy service id generator、repository load | 不得用 policy source ref 或 approval ref 代替。 |
| run / capture / handoff | `ControlledExecutionRunRef`;`CaptureFactRef`;`ObservabilityMaterialRef`;`HandoffFactRef` | launch / capture / handoff service id generator | 不得用 material body path、artifact ref 或 runtime id 代替。 |
| failure / control / lifecycle | `FailureClassificationRef`;`ControlFactRef`;`LeaseRecordRef`;`OrphanRecoveryRecordRef`;`CleanupGuardRef`;`RedlineContainmentRef` | failure/control/cleanup/redline service id generator | 不得用 runtime lifecycle id 或 investigation id 代替。 |
| read / relay / derived | `ReferenceResolutionStateRef`;`DerivedInspectPreviewTrendStateRef`;`SandboxReadProjectionRef`;`SandboxEventRelayRecordRef` | repository / projection / relay store id generator | 不得从 query parameters、topic、cursor 或 source truth ref 反推。 |

### 25.3 responsibility / actor / source carrier

```rust
/// Body-free responsibility context used before intake acceptance.
pub struct ExecutionResponsibilityContext {
    /// Optional actor reference from core contracts.
    pub actor_ref: Option<ActorRef>,
    /// Work or project source refs.
    pub work_refs: ExternalSourceRefSet,
    /// Reason supplied by the caller or resolver.
    pub reason: Option<SandboxReason>,
}

/// Body-free responsibility anchor persisted with an execution identity.
pub struct ExecutionResponsibilityAnchor {
    /// Actor reference from core contracts.
    pub actor_ref: ActorRef,
    /// Work source refs used for accountability.
    pub work_refs: ExternalSourceRefSet,
    /// Trace context bound to the identity.
    pub trace_context: SandboxTraceContext,
}
```

| 工厂 | 输入 | 返回 | 不变量 |
|---|---|---|---|
| `ExecutionResponsibilityAnchor::from_context(context: &ExecutionResponsibilityContext, trace_context: SandboxTraceContext) -> Result<Self, DomainError>` | responsibility context + trace | `ExecutionResponsibilityAnchor` | actor必须存在;work refs保持body-free;不得作为authorization source。 |

| 载体 | 字段来源 | 禁止替代 |
|---|---|---|
| `ActorRef` | `core-contracts` typed actor/member surface | 不得由 sandbox 定义 actor lifecycle 或 member truth。 |
| `ExecutionResponsibilityContext` | entry metadata、resolver safe summary、core metadata | 不得保存 identity / work body;缺 actor 且非 system job 时不得 accepted。 |
| `ExecutionResponsibilityAnchor` | accepted context + responsibility context | 不得作为 authorization source;只提供 accountability anchor。 |

### 25.4 boundary support carrier

```rust
/// Resource limits required by sandbox boundary.
pub struct ResourceLimitSet {
    /// Limit entries.
    pub limits: Vec<ResourceLimitRequirement>,
}

/// One resource limit requirement.
pub struct ResourceLimitRequirement {
    /// Limit kind.
    pub limit_kind: BoundaryLimitKind,
    /// Opaque limit value reference or summary.
    pub value_ref: SandboxOpaqueRef,
}

/// Filesystem isolation requirement.
pub struct FilesystemBoundaryRequirement {
    /// Allowed mount or workspace refs.
    pub allowed_ref_set: ExternalSourceRefSet,
    /// Whether writable host paths are forbidden.
    pub forbid_host_write: bool,
}

/// Network isolation requirement.
pub struct NetworkBoundaryRequirement {
    /// Whether egress is denied by default.
    pub default_no_egress: bool,
    /// Optional allowed network summary refs.
    pub allowed_network_refs: ExternalSourceRefSet,
}

/// Process isolation requirement.
pub struct ProcessBoundaryRequirement {
    /// Whether process namespace isolation is required.
    pub require_process_isolation: bool,
    /// Whether host process inspection is forbidden.
    pub forbid_host_process_access: bool,
}

/// Workspace and mount isolation requirement.
pub struct WorkspaceBoundaryRequirement {
    /// Workspace refs used by the execution.
    pub workspace_refs: ExternalSourceRefSet,
    /// Mount boundary marker.
    pub mount_marker: SandboxOpaqueRef,
}
```

| 载体 | 字段来源 | 禁止替代 |
|---|---|---|
| `BoundaryLimitKind` | finite enum: `Cpu`;`Memory`;`WallClock`;`Io`;`Filesystem`;`Network`;`Process` | 不得用 free-form string 或 backend-specific flag 代替。 |
| `ResourceLimitSet` | command boundary intent + validated boundary profile;backend capability只验证覆盖 | 不得把具体 product config / env var写入domain object;不得由后序policy反向生成。 |
| `FilesystemBoundaryRequirement` | boundary profile summary、work safe refs | 不得保存 workspace body 或 host path secret。 |
| `NetworkBoundaryRequirement` | command boundary intent + validated boundary profile | unknown / missing boundary input不得默认为allow;后序policy只裁定launch。 |
| `ProcessBoundaryRequirement` | boundary profile / backend capability summary | 不得因 local test fallback 放宽 process isolation。 |
| `WorkspaceBoundaryRequirement` | work safe refs、mount summary refs | 不得保存 work body 或 raw host path body。 |
| `BoundaryDefaultSummary` | validated boundary profile summary | 只作为factory input;不得覆盖显式requirements、hard boundary、后序policy fail-closed或redline。 |

### 25.5 policy / high-risk support carrier

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `PolicyApplicabilityStatus` | enum: `Applicable`;`Missing`;`Conflicted`;`Unsupported`;`Stale` | policy summary port | `Missing/Conflicted/Unsupported/Stale` 不得转成 allow。 |
| `PolicyAuthorizationDisposition` | enum: `Allowed`;`Denied`;`Missing`;`Conflicted`;`Unsupported` | policy adapter对body-free authorization summary的显式分类 | service不得从opaque ref、reason或adapter error text猜allow / deny。 |
| `HighRiskActionMarker` | struct `{ marker_ref: SandboxOpaqueRef, action_kind: HighRiskActionKind, source_disposition: HighRiskActionSourceDisposition, reason: Option<SandboxReason> }` | request marker经policy adapter验证后的body-free snapshot | 不得保存tool semantic body / raw command body;service不得从marker ref或reason猜Allowed。 |
| `HighRiskActionKind` | enum: `FilesystemExpansion`;`NetworkEgress`;`ProcessEscape`;`ResourceExpansion`;`SecretExposure`;`Unknown` | policy / boundary classifier | `Unknown` 必须 pending / blocked / fail-closed。 |
| `HighRiskActionSourceDisposition` | enum: `Allowed`;`Blocked`;`PendingAuthorization`;`Unsupported` | policy / authorization adapter的显式summary classification | unknown / missing不得转Allowed;与最终decision status逐marker映射。 |
| `HighRiskActionDecisionStatus` | enum: `Allowed`;`Blocked`;`PendingAuthorization`;`Unsupported` | high-risk decision guard | 非 `Allowed` 不得 launch。 |

### 25.6 run / capture / handoff support carrier

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `ControlledExecutionRunStatus` | enum: `Preparing`;`Running`;`Completed`;`Failed`;`Terminated` | run lifecycle transition | 不得表达 runtime agent loop internal state。 |
| `CaptureStatus` | enum: `Pending`;`Complete`;`Partial`;`Failed`;`Unavailable` | capture adapter output | `Partial/Failed/Unavailable` 不得伪装 complete。 |
| `MaterialKind` | enum: `Stdout`;`Stderr`;`ExitStatus`;`FileDigest`;`Diagnostic`;`Other` | capture adapter | 不得保存 artifact body。 |
| `HandoffTargetKind` | enum: `Artifact`;`Observability`;`Investigation`;`Relay`;`Other` | handoff command / adapter binding | target kind 不代表 downstream acceptance。 |
| `HandoffStatus` | enum: `Pending`;`Delivered`;`Retryable`;`Failed`;`DeadLetter` | handoff adapter / feedback | failure 不回滚 capture truth。 |

### 25.7 failure / cleanup / redline support carrier

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `SandboxFailureKind` | enum: `PolicyDeny`;`Timeout`;`BackendFailure`;`ResourceExceeded`;`CaptureFailure`;`HandoffFailure`;`Orphan`;`Redline`;`Unknown` | guard / adapter / control / redline marker | `Unknown` 只能 pending / classified later,不得 success。 |
| `FailureClassificationStatus` | enum: `PendingInput`;`Classified`;`Superseded`;`Terminal` | failure classifier | terminal failure 必须阻断后续 execution. |
| `SandboxControlKind` | enum: `Kill`;`Cancel`;`Cleanup`;`Deny`;`Timeout`;`Investigation`;`Other` | control request / consumer | 不得表达 business replay。 |
| `ControlSourceContext` | struct `{ source_ref: Option<ExternalSourceRef>, reason: Option<SandboxReason>, trace_context: SandboxTraceContext }` | command / event / operation metadata | 不保存 caller body。 |
| `ControlFactStatus` | enum: `Accepted`;`IgnoredDuplicate`;`Conflicted`;`Completed`;`Failed` | control flow | conflict 不得被 entry 忽略。 |
| `LeaseStatus` | enum: `Active`;`Expiring`;`Expired`;`Released`;`OrphanSuspected` | lease / reaper flow | expired 不得继续托管外运行。 |
| `LeaseWindow` | struct `{ starts_at: SandboxInstant, expires_at: SandboxInstant }` | backend adapter / config summary / clock | 不得用 local guessed duration 替代。 |
| `ReaperEligibilityMarker` | struct `{ marker_ref: SandboxOpaqueRef, reason: SandboxReason }` | lease expiry / job selection | 不得扫描 backend body 自行生成业务理由。 |
| `BackendLifecycleSummary` | struct `{ backend_profile_ref: SandboxOpaqueRef, lifecycle_status_ref: SandboxOpaqueRef, observed_at: SandboxInstant }` | backend lifecycle adapter | 不保存 backend lifecycle body。 |
| `OrphanRecoveryStatus` | enum: `Suspected`;`Confirmed`;`Recovering`;`Recovered`;`Failed` | reaper / lifecycle inspect | recovery 不得绕过 cleanup guard。 |
| `CleanupGuardStatus` | enum: `PendingEvidence`;`PendingInvestigation`;`Blocked`;`Allowed`;`Completed` | cleanup guard evaluator | non-Allowed 不得 release / cleanup。 |
| `InvestigationHandoffSummary` | struct `{ handoff_ref: SandboxOpaqueRef, status_ref: SandboxOpaqueRef, reason: Option<SandboxReason> }` | investigation handoff adapter | 不保存 investigation body。 |
| `RedlineKind` | enum: `FilesystemBoundaryBreach`;`NetworkBoundaryBreach`;`ProcessBoundaryBreach`;`SecretExposure`;`UnauthorizedHighRiskAction`;`Other` | redline detector / policy guard | redline 不得 advisory-only。 |
| `RedlineContainmentStatus` | enum: `Detected`;`Contained`;`HandoffPending`;`Released`;`Terminal` | redline flow | release 必须经过 cleanup / investigation guard。 |

### 25.8 projection / relay / audit support carrier

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `ReferenceRefreshMarker` | struct `{ marker_ref: SandboxOpaqueRef, reason: SandboxReason }` | reference consumer / refresh job | 不得用 timestamp / page cursor 代替 source marker。 |
| `DerivedSourceRefSet` | ordered unique `Vec<SandboxOpaqueRef>` | capture / handoff / failure / usage refs | 不得保存 derived body。 |
| `DerivedMaterialKind` | enum: `Inspect`;`Preview`;`Trend`;`BackendComparison`;`Reconciliation` | derived job / query | 不得驱动 core truth transition。 |
| `DerivedFreshnessStatus` | enum: `Fresh`;`Stale`;`Rebuilding`;`Failed`;`Unavailable` | derived maintenance | failed 不得伪造 core failure。 |
| `DerivedRebuildMarker` | struct `{ marker_ref: SandboxOpaqueRef, source_refs: DerivedSourceRefSet }` | projection stale / job plan | 不得从 config 或 fake map 反推 source refs。 |
| `DerivedFailureSummary` | struct `{ failure_ref: SandboxOpaqueRef, reason: SandboxReason }` | derived builder / adapter | 不保存 preview / dashboard body。 |
| `SandboxProjectionStatus` | enum: `Fresh`;`Stale`;`Rebuilding`;`Degraded`;`Unavailable` | projection writer / query access | projection 不得成为 truth source。 |
| `SandboxEventKind` | enum family matching outbound event skeleton | truth change mapper | Step 8 必须给 event payload;kind 不替代 payload source。 |
| `EventRelayStatus` | enum: `Pending`;`Delivered`;`Failed`;`Retryable`;`DeadLetter` | publisher outcome | publish failure 不回滚 source truth。 |
| `SandboxTraceKind` | enum: `Intake`;`Boundary`;`Policy`;`Run`;`Capture`;`Handoff`;`Failure`;`Cleanup`;`Redline`;`Projection`;`Relay`;`Job` | audit mapper | trace kind 不替代 subject mapper。 |

### 25.9 application / infra / entry status carrier

| 载体 | 形态 | 字段来源 | 禁止替代 |
|---|---|---|---|
| `SandboxResultKind` | enum: `CommandResult`;`ConsumerReceipt`;`JobReport`;`QueryView`;`Error` | application outcome mapping | 不得让 duplicate replay 猜 result kind。 |
| `StoredResultStatus` | enum: `Completed`;`Rejected`;`Failed`;`Unavailable` | stored result store | unavailable duplicate 必须 blocker / error,不得 recompute。 |
| `ApplicationErrorKind` | enum: `Domain`;`PortUnavailable`;`IdempotencyConflict`;`DuplicateMissingResult`;`NoWriteViolation`;`Validation`;`Internal` | application error factory | 不暴露 raw adapter error。 |
| `ServiceOutcomeStatus` | enum: `Accepted`;`Rejected`;`Degraded`;`NoWrite`;`Failed` | service facade | no-write 不得 commit truth。 |
| `SandboxQueryKind` | enum matching query skeleton | query DTO selector | 不得从 raw path / string 临时分派。 |
| `QueryAccessStatus` | enum: `Visible`;`NotVisible`;`Restricted`;`Degraded`;`Unavailable` | query visibility / projection decision | empty / degraded 必须有正式 decision source。 |
| `SandboxAdapterKind` | enum: `TruthStore`;`ProjectionStore`;`ReferenceResolver`;`PolicySummary`;`BackendCapability`;`IsolationBackend`;`MaterialHandoff`;`ObservabilityHandoff`;`EventPublisher`;`InvestigationHandoff` | runtime config validator | adapter kind 不决定 domain allow。 |
| `AdapterAvailabilityStatus` | enum: `Available`;`Degraded`;`Unavailable`;`Disabled` | health / config validation | disabled 不得关闭 hard guard。 |
| `IsolationBackendOutcomeStatus` | enum: `Established`;`Unsupported`;`Failed`;`Unavailable` | isolation backend adapter | service / fake 不得解析 error string。 |
| `HandoffAdapterOutcomeStatus` | enum: `Delivered`;`Retryable`;`Failed` | handoff adapter | failure 不回滚 source truth。 |
| `PublisherOutcomeStatus` | enum: `Delivered`;`Retryable`;`DeadLetter`;`Failed` | publisher adapter | dead-letter 只进入 relay/report surface。 |
| `SandboxApiMetadata` | struct `{ actor_ref: Option<ActorRef>, trace_context: SandboxTraceContext }` | API request metadata | 不保存 request body。 |
| `ConsumerReceiptStatus` | enum: `Accepted`;`Duplicate`;`Delayed`;`Rejected`;`Failed`;`Quarantined` | worker consumer | delayed/rejected ack rules Step 9 闭口。 |
| `SandboxWorkerKind` | enum: `ControlConsumer`;`Fulfillment`;`Relay`;`HandoffFeedback`;`BackendLifecycle` | worker binary / runtime config | worker kind 不决定 business state。 |
| `WorkerRunStatus` | enum: `Started`;`Completed`;`PartialFailed`;`Failed`;`Skipped` | worker loop | result refs must come from application facade。 |
| `SandboxJobKind` | enum matching planned job binaries | job binary selector | job kind 不等于 business command。 |
| `JobReportStatus` | enum: `Succeeded`;`PartialFailed`;`Failed`;`Skipped`;`Degraded` | job report accumulator | failed/skipped refs must be persisted for replay。 |

### 25.10 模块错误载体

| 错误载体 | owner | 当前 Step 6 形态 | 后续承接 |
|---|---|---|---|
| `ContractError` | `contracts` | invalid empty value、invalid enum payload、invalid ref set 等 public carrier 构造错误。 | Step 8 protocol validation;Step 12 public error mapping |
| `DomainError` | `domain` | invariant violation、illegal transition、boundary coherence violation、policy fail-closed、cleanup/redline guard violation。 | Step 10 state matrix;Step 12 error model |
| `ApplicationError` | `application` | `SandboxApplicationError` 的 concrete result alias;包裹 domain / port / idempotency / no-write error。 | Step 7 callable surface;Step 12 recovery |
| `InfraError` | `infra` | config validation、adapter availability、adapter outcome mapping 和 runtime builder assembly error。 | Step 7 adapter;Step 14 config |
| `ApiError` | `api` | request mapping、metadata missing、digest/idempotency invalid 和 application error mapping。 | Step 8 protocol;Step 12 error mapping |

---

## 26. 原轮次最终自检与进入下一步条件（已由 DesignReopen 失效）

> 本节记录 2026-07-09 原轮次的自检结果。2026-07-18 粒度审查已证明其中“每个对象独立”“支撑载体闭口”“状态闭环”等通过结论不足以支撑 1:1 落码，因此本节不得继续作为当前 pass gate；当前 gate 见 §28。

| 检查项 | 结果 |
|---|---|
| Step 6 文件是否有批次状态表和模块执行顺序表 | 通过。见 §9.1 和 §9.3。 |
| 是否按模块 capability 推导对象 | 通过。见 §10~§14。 |
| 每个对象是否有独立小节入口 | 通过。见 §24 单对象卡片。 |
| 支撑载体是否闭口 | 通过。见 §25 `*Kind` / `*Status` / `*Summary` / `*Marker` / `*RefSet` / `*OutcomeStatus` / error carrier。 |
| 字段来源和状态闭环是否完成 | 通过。见 §16 和 §17。 |
| Step 7 承接是否完成 | 通过。见 §19。 |
| 是否修改正式 `03-详细设计.md` | 否。正式文档仍只在 Step 19 装配。 |
| 是否创建 Step 7 文件或提前进入 Step 7 | 否。当前停在 Step 6 审查点。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

```text
Step 6 已完成并等待用户审查。
用户确认后,下一步读取:
- `standards/document/详细设计讨论流程_SOP.md` Step 7
- `standards/document/详细设计书写规范.md` §5.5 Trait / Port / Adapter 契约格式
- `standards/document/设计真相源闭环与可落码性标准.md` callable surface / port / repository / fake parity 相关规则
- `projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md` §19 Step 7 承接清单

然后才能创建 `03_ddd_step_07_trait_port_adapter_contracts.md`。
```

---

## 27. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 可落码复核 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 `CB-SBX-05A/05B/06A/06B/07A` | `BoundaryRequirementSet::from_context_and_policy(...)` 使PH-05依赖PH-06输出,且对象缺少测试要求的identity / generation绑定。 | factory改为消费accepted context、active identity、显式四维requirements和`BoundaryEstablishmentService`构造时注入的profile / template / runtime generation;generation保持LD-24 service-set来源,不塞入LD-17 summary或public DTO。 | Boundary对象可在Policy前独立构造;Policy消费requirement;Run同时消费coherent boundary和Accepted policy。 |

---

## 28. 粒度回归重审控制

| 项 | 当前结论 |
|---|---|
| DesignReopen | 用户已确认启动 Step 6~10 粒度回归重审。 |
| 当前批次 | `6R-M0~03`与`6R-04` batch 1~3已获用户确认；batch 4 cleanup / redline已完成并等待用户审查。 |
| 详细控制产物 | `design-calibration/03_ddd_step_06_object_contracts_regression_control.md` |
| 当前 canonical 产物 | shared types 唯一在 `03_ddd_step_06_object_contracts_shared_types.md`；`S6T-02-*` 唯一在 context-boundary 分件；`S6T-03-*` 唯一在 policy-run-capture 分件；`S6T-04-*` 28项inventory和后续object body唯一在 failure-cleanup-read分件。 |
| 总 blocker | `SBX-DDD-GRANULARITY-REOPEN-001` open |
| Step 6 blocker | `SBX-DDD-GRANULARITY-STEP6-001` `open_progress_6r_04_batch_4_cleanup_redline_completed_wait_user_review` |
| 原 §1~§27 效力 | historical reviewed material；不得作为当前可落码 pass。 |
| shared registry audit | object kind / named wrapper `52/52`、protocol selector `55/55`、current shared type unresolved `0`；这些是设计差集，不是测试结果。 |
| `6R-02` object audit | canonical inventory `24/24`、`S6T-02-*` `17/17`、boundary dimensions `10/10`、五项 Rustdoc missing `0`、4 个 `6R-04` forward method registered；仅表示静态设计闭环。 |
| `6R-03` closure audit | #1~#24全部闭合；24/24 inventory、12/12 registry、24/24 view declarations、10/10 support declarations、39 status、55 selector、10 forward dependency及path/Rustdoc/语法差集均为0；不表示实现、编译或测试结果。 |
| `6R-04` batch 1 historical snapshot | 15/15 registry、41/41 review-unit inventory（28 named + 13 support family）、41个唯一后续章节、10/10 forward owner和planned新增路径0；该清单已由batch 2消费。 |
| `6R-04` batch 2 historical closure | `FailureClassification`、`ControlConflictGuard`、`ControlFact`与support family #29~30已在failure-cleanup-read分件§12.1~§12.3闭合；该行保留为batch 2历史快照。 |
| `6R-04` batch 3 historical closure | `ReaperEligibilityMarker`、`LeaseRecord`、`OrphanRecoveryRecord`与support family #31已在failure-cleanup-read分件§13.1~§13.3及§13A闭合并获用户确认；batch 4定向扩展其release / failure basis。 |
| `6R-04` batch 4 current closure | `CleanupSafetyGuard`、`CleanupGuard`、`RedlineContainmentGuard`、`RedlineContainment`与support family #32~33已在failure-cleanup-read分件§14.1~§14.4及§14A闭合；5项remaining forward method、`from_redline`及orphan release/failure反向重验通过；partial-handle fresh inspection `Unavailable`固定形成`ReleaseRecoveryInspectionPending / PendingEvidence`，不得授权新release；累计10/28 named type、5/13 support family、10/10 forward method，planned新增路径仍为0。 |
| downstream state inventory | batch 5新增`HandoffTargetProgressStatus`唯一owner；historical 29状态机 /30 enum清单待Step 10定向重验为30状态机 /31 enum，并传播到Step 16、正式`05~07`与`CB-SBX-12A`。 |
| 正式回填 | blocked；正式 `03` 只在回归后的 Step 19 重装配。 |
| 下一动作 | 当前停审；用户确认后只可进入`6R-04` batch 5 reference / projection / derived正文。 |
| `6R-02` | `review_confirmed_consumed_by_6r_03`。 |
| `6R-03` | `review_confirmed_consumed_by_6r_04`；24项inventory与12/12 mapping均闭合，内部path blocker已关闭。 |
| `6R-04` | `batch_4_cleanup_redline_completed_wait_user_review`；其余18个named type、8个support family仍待batch 5~6，10项forward method已全部闭合。 |
| Step 7 | blocked by Step 6 regression review。 |
| implementation | `CB-SBX-01A blocked / wait_design`；不得进入目标实现仓。 |
| commit | 当前不需要，且未经用户明确要求不得提交。 |

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-04
batch = batch_4_cleanup_redline
gate_status = batch_4_cleanup_redline_completed_wait_user_review
next_allowed_action = wait_user_review_before_batch_5_reference_projection_derived
step_7 = blocked_by_step_6_regression
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## 29. `6R-07` current authority、索引与Step 7 handoff override

本节位于物理文件末尾，是本主控唯一current authority入口。原§1~§28保留为historical reviewed
material，用于追踪旧设计、差异诊断和回归过程；其中任何同名字段、状态、factory、guard、helper、ref、
error或module owner均不得覆盖本节指向的current canonical source。

### 29.1 唯一索引与schema来源

| authority | current source | 拥有范围 | 消费规则 |
|---|---|---|---|
| registry master | `03_ddd_step_06_object_contracts_shared_types.md` §8 | `S6T-CORE-001~004`、`S6T-SH-001~010`、`S6T-02-001~017`、`S6T-03-001~012`、`S6T-04-001~015`、`S6T-05-001~011`，共69 row | 先按ID定位row，再读取row指向的唯一canonical section；本主控不复制schema。 |
| shared / core | shared types §7、§9~§13 | core exact export、shared carrier、52 typed ref、39 status owner及error layering | shared声明只能由该文件修改；分件不得复制或改名。 |
| context / boundary | `03_ddd_step_06_object_contracts_context_boundary.md` current章节 | context、environment identity、四维boundary、workspace requirement、capability、handle、lease及相关guard/view | 以registry row指向章节为唯一对象正文。 |
| policy / run / capture | `03_ddd_step_06_object_contracts_policy_run_capture.md` current章节 | launch policy execution、high-risk、run、capture、handoff及相关guard/view | policy definition、approval、allowlist truth仍属上游，不得在Sandbox重定义。 |
| failure / cleanup / read | `03_ddd_step_06_object_contracts_failure_cleanup_read.md` §12~§17 | failure、control、cleanup、lease/reaper、redline、reference、projection、derived、relay和audit trace | 分件旧draft不具效力，只读current closure章节。 |
| application / infra / entry | `03_ddd_step_06_object_contracts_application_infra_entry.md` §9~§11 | application stable carrier、infra outcome/availability以及api/worker/jobs entry shell | §6~§8为historical draft，不得回流。 |

冲突时固定采用以下优先级：`core-contracts exact export -> shared registry/shared declaration -> registry row指定的
canonical分件 -> 6R-06 closure audit -> 6R-07 authority/handoff -> historical Step 6/7~10`。后序层只能
索引或验证前序层，不能反向改写schema。

### 29.2 闭合结果与Step 7输入

| gate | current result | Step 7消费要求 |
|---|---|---|
| registry / source | 69/69 row、5/5 canonical source、unresolved 0 | 每个callable必须引用exact registry object，不得临时造local carrier。 |
| module owner | `contracts/domain/application/infra/api/worker/jobs` 7/7唯一 | 依赖方向继续遵守Step 5；跨模块协作必须经Step 7 port。 |
| callable handoff | 15/15 `S7H-01~15` | 逐组闭合input/output/error/async/transaction/parity，不能把handoff摘要当签名。 |
| entry inventory | Command 10 + Query 13 + Consumer 9 + Job 10 = 42 | Step 7必须42/42穷尽entry dispatch；13 outbound event归relay/publisher，不算entry facade。 |
| Step 7内部blocker | input、dispatch、ref、outcome、read、entry共6项 | 由Step 7 regression逐项关闭；任一未闭合都阻塞Step 8。 |

Step 7的精确输入、禁止猜测项、暂停条件和六个预登记blocker只在
`03_ddd_step_06_object_contracts_handoff_assembly.md` §10维护。若Step 7发现current object缺失，不得在
trait或adapter内增加私有替代类型，必须重开Step 6并更新69-row registry owner。

### 29.3 当前恢复点

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
current_batch = 6R-07 master assembly and Step 7 handoff
step_status = reopened_completed_wait_user_review
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = step_6_current_canonical_baseline_closed_wait_review
next_allowed_action = wait_user_review_before_step_7_regression
upstream_6R_06 = review_confirmed_consumed
registry_rows = 69/69
canonical_sources = 5/5
module_owners = 7/7
step_7_handoff_groups = 15/15
step_7_entry_callable_inventory = 42/42
step_7_preregistered_blockers = 6/6
static_audit_unresolved = 0
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

`6R-07`完成只使Step 6进入`completed_wait_user_review`，不等于用户已确认Step 6。确认前不得修改
historical Step 7正文，不得进入Step 8~10、正式`03~07`、implementation boundary skeleton或实现仓。

上述§29.3是Step 6完成待审时的historical recovery snapshot；§29.1~§29.2的authority和handoff继续
有效，当前恢复点由物理末尾§30覆盖。

## 30. Step 6 review confirmation and Step 7 consumption override

用户已确认Step 6，`7R-M0`已消费其69-row registry、五份canonical source、七模块owner、15个handoff
和六个预登记Step 7 blocker。Step 6现在是review-confirmed current upstream，不再是当前执行Step。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
step_6_status = review_confirmed_consumed_by_7R_M0
step_6_object_authority = current_upstream_unchanged
registry_rows = 69/69
canonical_sources = 5/5
module_owners = 7/7
step_7_handoff_groups = 15/15
next_allowed_action = wait_user_review_before_7R_01_service_facades
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本状态不关闭总DesignReopen；Step 7~10及下游重验仍未完成。
