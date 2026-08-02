# Step 1. 确认配置输入边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-10
> 状态: completed_reviewed_for_step_2
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步只确认配置设计输入边界、历史材料处理、必须回答 / 不再回答的问题和 `03` 回写门禁。不创建正式 `04-配置设计.md`,不定义具体配置 key、默认数值、环境矩阵、secret、endpoint、topic、cron、timeout / retry / retention 数字、部署命令、实现代码、真实测试结果、run_id、evidence alias、验收签署或 commit boundary。

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认配置输入边界 |
| 当前状态 | 已完成;用户已确认进入 Step 2 |
| 输入基线 | 正式 `00/01/02/03`;旧 README / `05/06` 只作 historical material / 下游方向输入 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_01_upstream_boundary.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md` 当前不存在;Step 15 前不得创建 |
| 停审方式 | 本 Step 停审已完成;当前作为 Step 2 输入 |

---

## 2. 本步目标

确认 `L4-sandbox` 配置设计依赖的需求、架构、概要、详细设计和下游方向输入是否足够,并明确哪些配置线索可以进入正式配置设计。

本 Step 只回答:

- 当前配置设计承接哪些正式上游文档和具体 calibration 输入。
- 详细设计中哪些配置引用、runtime builder、store、adapter、external dependency、entry、worker、job 和 observability 边界需要进入 `04`。
- 旧 README、旧 `05-测试方案.md` 和旧 `06-验收标准.md` 当前是什么地位。
- 配置设计不再回答哪些问题,必须回答哪些问题。
- 当前是否存在阻塞进入 Step 2 的上游输入缺口。
- 哪类配置结论会触发 `03-详细设计.md` 回写。

本 Step 不定义:

- raw config key、JSON schema、env var、CLI flag、file path 或 source priority。
- local / test / staging / production-like profile 的正式矩阵。
- backend、store、bus、secret provider、OTel、scheduler 或 handoff 产品选型。
- secret 存储、轮换、审计实现。
- timeout、retry、backoff、retention、lease、cadence、batch、parallelism 的具体数字。
- runtime builder 新字段、adapter constructor 新参数、trait / port、DTO、error 或 flow。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 新版正式文档 | 抽取 sandbox 定位、execution isolation truth ownership、核心能力主轴、依赖裁剪、NFR、安全红线和验收否决项。 |
| `projects/L4-sandbox/01-架构设计.md` | 新版正式文档 | 抽取产品中立、部署 / adapter 边界、数据所有权、一致性、依赖降级、fail-closed、no weak fallback、cleanup / redline 和横切约束。 |
| `projects/L4-sandbox/02-概要设计.md` | 新版正式文档 | 抽取 §11 配置影响轮廓、允许 / 禁止配置化边界和 §12 详细设计承接。 |
| `projects/L4-sandbox/03-详细设计.md` | 新版正式文档,已审查通过 | 作为直接输入,抽取 §13 配置读取边界、配置引用、外部依赖、禁止配置化边界,以及 §14~§17 的观测、测试、实施承接和风险。 |
| `02_hld_step_11_configuration_impact.md` | 已完成概要中间产物 | 提供配置影响分层、运行单元 / port / job 配置接缝和禁止配置化红线的讨论细节。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 提供 config owner、config section、runtime builder、store / adapter / topic / handoff / job 绑定的字段级来源。 |
| `03_ddd_step_15_observability_audit.md` | 已完成详细设计中间产物 | 提供 runtime log、metric、audit、diagnostic、redaction 和 observability handoff 的配置承接边界。 |
| `03_ddd_step_17_implementation_handoff.md` / `03_ddd_step_18_risks_open_questions.md` | 已完成详细设计中间产物 | 提供下游阅读、实施前检查、配置缺口和 blocker 转换规则。 |
| `projects/L4-sandbox/README.md` | historical material | 识别旧 Docker / gVisor、默认无出网、seccomp / AppArmor、旧目录、旧事件和旧性能目标污染风险。 |
| `projects/L4-sandbox/05-测试方案.md` | 旧 / 待重建 | 只作为 dev / test / staging、fake / real-like backend、隔离矩阵和负向场景方向输入,不得覆盖新版 `03`。 |
| `projects/L4-sandbox/06-验收标准.md` | 旧 / 待重建 | 只作为环境准入、配置 veto 和 evidence 方向输入,不得作为验收签署或配置真相源。 |
| `projects/L4-sandbox/04-配置设计.md` | 当前不存在 | 本轮目标正式文档;不得假设已有配置项、profile、secret 或产品真相源。 |
| `L1-governance` / `L1-artifact` 配置 flow 与 Step 1 | 粒度参考 | 只参考中间产物结构和配置回写门禁,不得复制其配置项或产品语义。 |

---

## 4. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异 | 承接 execution environment identity、resource / filesystem / network / process coherent boundary、tool / runtime launch policy enforcement、capture / handoff 分层、observability hooks、failure classification、lease / cleanup / reaper、security redlines、deny-by-default、no weak fallback、body-free redaction、dependency delay visibility 和 fake / durable parity。环境差异暂不从旧 `05/06` 直接继承,只登记为 Step 6 重新收敛的方向。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计 | `03` §13 已固定 raw config owner 为 `infra/config.rs`,validated ref 装配由 `infra/runtime_builder.rs` 完成;配置输入涉及 runtime profile、store refs、context / policy / backend capability resolver、isolation backend、capture、handoff、publisher、boundary / lease profile、idempotency retention、topic binding、job / worker cadence、projection / derived / reconciliation threshold 和 feature enablement。 |
| 哪些测试和验收场景依赖配置矩阵 | backend capability / isolation profile、resource / fs / network / process boundary、policy missing / stale / conflicted fail-closed、backend unsupported、no weak fallback、capture size / handoff、publisher retry / dead-letter、duplicate replay retention、cleanup / reaper / redline guard、observability redaction、fake / durable parity、startup validation 和 adapter availability 都需要配置矩阵。旧 `05/06` 的 dev / test / staging 只作方向输入。 |
| 哪些内容不应在配置设计中重新定义 | 不重新定义 sandbox 需求目标、truth ownership、架构方案、六个业务组成部分、七模块布局、对象 / DTO / trait / port / flow / error / state、测试结果、验收签署或实施 phase。也不定义 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store 或 policy / allowlist truth。 |
| 当前上游是否存在会阻塞配置设计的缺口 | 未发现阻塞 Step 2 的上游缺口。正式 `04` 缺失是本轮目标而非 Step 1 blocker;具体 backend / store / bus / OTel / scheduler 产品、profile 和数字未锁定,可先按 product-neutral config seam 收敛。若后续配置项需要改变 `03` 代码契约,必须回写 `03` 后才能继续定稿。 |
| 当前是否可能走“无配置说明文档”路径 | 可能性很低但必须由 Step 2 正式裁决。正式 `03` 已列出 store、adapter、profile、retention、topic、job、lease / cleanup / reaper 等多类配置绑定点,因此当前倾向于需要完整配置设计。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `04-配置设计.md` | 文件当前不存在 | 建立 `04_config_*` 中间产物链;正式 `04` 等 Step 15 装配。 |
| `03-详细设计.md` §13 | 只定义代码绑定点和 typed config ref,未定义 raw key、source priority、profile matrix、secret、endpoint、topic 原名和数值默认值 | 本轮 `04` 继续展开,不得把缺口留给实现 agent。 |
| `03-详细设计.md` §17 | backend 产品、stronger profile、network / fs / process profile、retention / retry / cadence、store / bus / OTel / scheduler 产品仍未锁定 | 作为 Step 2~14 风险输入,Step 1 不提前选型。 |
| 旧 README | 把 Docker+gVisor、默认无出网、Seccomp+AppArmor、非 root、只读 `/proc` / `/sys`、cap drop 和旧性能数字写成固定事实 | 全部降级为 historical material;只能在当前配置边界独立结论形成后做差异审计。 |
| 旧 `05-测试方案.md` | 使用旧 session / command / output / control 主线,并写入 cleanup disabled、replay enabled、host runtime / allowlist 等环境配置 | 只保留“需要环境矩阵和负向覆盖”的方向,不得继承旧 key、默认值、对象或行为。 |
| 旧 `06-验收标准.md` | 以旧五条主线和旧环境基线组织验收,且未承接新版 query no-write、job no-repair、no-rollback、redline 和 redaction | 只作后续验收方向输入;不得反向定义 `04` 配置项或声明已通过。 |
| 配置与详细设计边界 | 后续容易在 `04` 中静默增加 `SandboxRuntimeConfig` 字段、adapter mode、error variant 或 builder branch | 固定逐 Step `03` 影响判定;任何代码契约变化先回写 `03`。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 正式 `04` 缺失,配置线索分散在 `02/03/README/05/06` | 建立 `04_config_calibration_flow.md` 和 Step 1 输入边界 | 满足中间产物先行和三层台账门禁。 |
| 上游权威顺序 | 旧 README / `05/06` 可能被误当作配置事实 | 正式 `00/01/02/03` 为权威上游;旧材料只作差异审计 / 方向输入 | 防止旧后端、旧对象和旧环境矩阵回流。 |
| 产品选型 | 旧材料锁定 Docker / gVisor / host runtime / allowlist | 当前保持 product-neutral store / adapter / backend capability / handoff / publisher seam | 正式 `03` 只固定抽象 port 和 no weak fallback。 |
| 配置项生成方式 | 容易直接从 env var 或旧矩阵反推配置项 | 先确定控制面和禁止配置化边界,再按配置域 / 配置项小循环展开 | 避免配置项绕过 hard guard。 |
| 对 `03` 的影响 | 配置缺口可能由实现侧自由补字段和 constructor | 每个 Step 必须给出 `03` 影响判定;代码契约变化先回写 | 保持真相源唯一和可落码性。 |

---

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接创建正式 `04` | A. 直接写正式文档;B. 先走 Step 1~14 中间产物 | 采用 B。SOP 明确正式文档只在 Step 15 装配。 |
| 是否沿用旧 README 的 backend / security profile | A. 直接继承;B. 降级为 historical material | 采用 B。旧结论早于新版 `00/01/02/03`,且混有产品和部署事实。 |
| 是否沿用旧 `05/06` 环境矩阵 | A. 直接继承;B. 只保留方向并在 Step 6 重建 | 采用 B。旧矩阵使用旧对象和旧行为主线。 |
| 是否当前锁定 backend / store / bus / OTel / scheduler 产品 | A. 当前锁定;B. 先保持 product-neutral config seam | 采用 B。若产品能力改变现有 port / builder 契约,再回写 `03` 或进入 ADR / `07`。 |
| 是否允许 `04` 新增 runtime config 字段或 adapter constructor | A. 可直接新增;B. 影响代码契约时先回写 `03` | 采用 B。配置设计不能静默替代详细设计。 |
| 是否保留无配置路径 | A. 直接排除;B. Step 2 正式判定 | 采用 B。当前虽明显存在配置绑定点,仍按 SOP 留下可审查判定。 |

---

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 配置输入 | 预计回填章节 |
|---|---|---|
| `00-需求文档.md` | sandbox truth ownership、execution environment identity、resource / fs / network / process boundary、launch policy、capture、observability hook、failure、lease / cleanup / reaper、security redline、唯一编译期依赖和外部依赖裁剪 | `04` §1 / §3 / §4 / §11 / §12 / §14 |
| `01-架构设计.md` | 产品中立、运行单元 / adapter 边界、数据所有权、一致性、依赖失效、no weak fallback、capture / handoff 分层、cleanup / redline 和横切约束 | `04` §1 / §3 / §4 / §6 / §11 / §13 / §14 |
| `02-概要设计.md` | 配置只影响承载、节奏、接缝和 degraded surface;禁止改写 accepted / coherent / fail-closed / cleanup / redline / no-write / dependency discipline | `04` §1 / §3 / §4 / §7 / §9 / §11 |
| `03-详细设计.md` | raw config owner、validated refs、runtime builder、store / adapter / topic / handoff / job / retention / profile 绑定、external dependency、observability / redaction、test cut 和风险 | `04` §1~§14 |
| `03_ddd_step_14_config_external_binding.md` | config section 字段池、读取模块、默认口径、外部依赖绑定、event route、worker enablement、runtime builder 顺序和禁止配置化边界 | `04` §3~§11 |
| `03_ddd_step_15_observability_audit.md` | safe log / metric / audit / diagnostic、redaction、adapter availability 和 config validation 观测输入 | `04` §8~§12 |
| 旧 `05-测试方案.md` | dev / test / staging、fake / real-like backend、边界和失败场景需要环境矩阵 | `04` §6 / §12;仅作方向输入 |
| 旧 `06-验收标准.md` | 环境准入、配置缺失 / 错配 veto、证据方向 | `04` §6 / §11 / §12 / §14;仅作方向输入 |

### 8.2 配置设计不再回答的问题

- `L4-sandbox` 是否拥有 execution isolation truth。
- tools semantic execution、runtime execution truth、member lifecycle、artifact truth、observability store 或 policy truth 是否属于 sandbox。
- coherent boundary、policy fail-closed、高风险阻断、capture / handoff 分层、cleanup guard、redline containment、query no-write、consumer / job no core truth repair、relay / handoff no-rollback 是否成立。
- 七模块布局、对象 / DTO / trait / port / flow / error / state 如何定义。
- 是否选择新的业务主线、状态机或 public protocol。
- 测试是否通过、验收是否签署、实现按哪些 commit boundary 执行。

### 8.3 配置设计必须回答的问题

- L4-sandbox 有哪些配置控制面、配置域和配置项。
- 哪些行为允许配置化,哪些必须 validation reject 或回设计修正。
- 配置来源、优先级、冲突、profile 和环境矩阵如何表达。
- 每个配置项的类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块是什么。
- backend capability、isolation backend、boundary / lease profile 和 stronger isolation 触发条件如何绑定,且不产生 weak fallback。
- store、resolver、policy summary、capture、handoff、publisher、worker、job、projection、derived、reconciliation 和 reference refresh 如何装配。
- secret / credential / endpoint / topic / DSN / cert ref 如何存储、读取、轮换、审计和禁止输出。
- 配置如何加载、校验、生效、变更、审计、回滚、漂移检测和失效。
- missing / stale / conflicted / unsupported / unavailable / disabled 如何映射 startup reject、command reject、consumer delay / quarantine、job skip / degraded 或 manual blocker。
- `05/06/07/09` 如何承接配置矩阵、veto、实施准备和运维细节。
- 哪些结论需要回写 `03`。

### 8.4 初始配置输入候选表

| 候选配置域 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| runtime profile / config identity | `03` §13;Step 14 | 有正式 owner / binding | Step 3 建立控制面;Step 5~7 定义 source / profile / item。 |
| truth / projection / derived / reference / relay / idempotency store | `03` §10 / §13;Step 11 / 14 | 有 repository / UoW 绑定,产品未锁定 | Step 3 / 6 / 7 product-neutral 定义。 |
| context resolver / policy summary / backend capability | `03` §6 / §13;Step 7 / 14 | 有正式 port 和 fail-closed / degraded 语义 | Step 3 / 7 / 8 / 11 展开。 |
| isolation backend / capture / release | `03` §5~§13;Step 7 / 9 / 14 | 有 formal outcome 和 no weak fallback | Step 6 / 7 / 11 定义 profile、capability 和失效。 |
| boundary / limit / lease profile | `02` §11;`03` §13 / §17 | 有 typed ref,具体 schema / 数字未定 | Step 4 / 6 / 7 收敛 resource / fs / network / process / lease 配置。 |
| material / observability / investigation handoff | `03` §8 / §13~§17 | 有 handoff port / target ref / no-rollback / redaction | Step 3 / 7 / 8 / 11 定义 target、secret、retry 和 failure。 |
| outbound publisher / inbound subscription / topic binding | `03` §7 / §13;Step 8 / 14 | 协议 kind 已固定,transport route 未定 | Step 5 / 7 定义 route / topic-neutral binding 和 schema allowlist。 |
| idempotency / stored result / relay / consumer / job retention | `03` §10~§13 / §17 | 语义已固定,数值未定 | Step 6 / 7 / 11 定义窗口和冲突门禁;missing stored result 不重跑。 |
| worker / job / cleanup / reaper / redline cadence | `02` §11;`03` §13 / §17 | job surface 已固定,节奏 / batch / parallelism 未定 | Step 6 / 7 / 11 定义,不得绕过 cleanup / investigation / redline guard。 |
| projection / derived / reconciliation / reference refresh | `03` §8~§13 | no-write / no-repair 已固定,threshold / batch 未定 | Step 6 / 7 / 11 定义。 |
| observability / diagnostic / redaction | `03` §14;Step 15 | safe field / forbidden field 已固定 | Step 7~12 承接采样、后端绑定、secret 和 validation 观测。 |
| test / acceptance environment matrix | 旧 `05/06`;`03` §15 / §17 | 旧矩阵待重建 | Step 6 / 12 重新定义,不得直接继承旧对象和旧默认。 |

### 8.5 Historical material 与下游方向输入台账

| 材料 | 降级原因 | 允许使用 | 禁止使用 |
|---|---|---|---|
| `README.md` | 早于新版文档链,固化 backend、security profile、事件、目录和性能目标 | 识别需要 backend / network / security 配置域和历史污染风险 | 直接写入 backend 组合、默认值、profile、事件名、目录或 SLO。 |
| 旧 `05-测试方案.md` | 使用旧五主线和旧对象,前置 `04` 实际缺失 | 识别环境矩阵、fake / real-like 接缝和负向场景需求 | 继承 cleanup disabled、replay enabled、host runtime、allowlist 或旧配置 key。 |
| 旧 `06-验收标准.md` | 未承接新版 `03/04/05`,无真实 evidence / 签署 | 识别环境准入、配置错配 veto 和证据方向 | 作为配置真相、测试通过结论、evidence alias 或验收签署。 |

---

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 正式 `04` 当前不存在,需要从正式 `00/01/02/03` 生成 | 否 | 配置文档生成路径 | 不适用 | 无回写 |
| 旧 README / `05/06` 只作 historical material / 下游方向输入 | 否 | 文档权威级别 | 不适用 | 无回写 |
| 配置设计必须承接 `03` §13 和 Step 14 的现有 config owner / section / builder / adapter / store / topic / handoff / job 绑定点 | 否 | 既有详细设计输入确认 | 不适用 | 无回写 |
| 当前保持 backend / store / bus / OTel / scheduler 产品中立 | 否 | 配置与 ADR / 实施分工 | 不适用 | 无回写 |
| 当前 Step 未新增或改变 runtime config 字段、builder branch、adapter constructor、trait / port、error、DTO 或 function flow | 否 | 输入边界确认 | 不适用 | 无回写 |
| 当前 Step 未改变 runtime log / metric / audit / diagnostic schema 或 redaction hard boundary | 否 | 输入边界确认 | 不适用 | 无回写 |

本 Step 当前没有 `待回写` 或 `阻塞待确认` 项。后续若出现上述代码或观测契约变化,对应 Step 必须把处理状态改为 `阻塞待确认`,回写 `03` 后再继续。

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对详细设计的影响判定”和“待确认事项”小节,了解配置设计输入边界如何从正式 `00/01/02/03` 收敛。

正式 `04-配置设计.md` §1 应回填:

- 本配置设计直接承接正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`。
- `03-详细设计.md` 是直接输入,尤其是 §13 配置引用与外部依赖绑定、§14 可观测性 / 审计、§15 测试切口和 §17 风险。
- `02_hld_step_11_configuration_impact.md`、`03_ddd_step_14_config_external_binding.md` 和 `03_ddd_step_15_observability_audit.md` 提供讨论细节,与正式文档冲突时以正式文档为准。
- 旧 README、旧 `05-测试方案.md` 和旧 `06-验收标准.md` 只作 historical material / 下游方向输入,不得直接成为配置真相源。
- 配置设计只定义配置语义、来源、优先级、profile、校验、生效、失效、变更审计和下游承接,不得改写 sandbox truth、状态机、port、DTO 或 flow。
- 若配置结论改变 runtime config、builder、adapter constructor、trait / port、error、DTO、flow 或 audit schema,必须先回写 `03`。

---

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `04-配置设计.md` 尚未存在 | raw schema、profile、secret、source priority、validation 和失效策略尚未形成正式 truth | 本轮按 Step 1~15 生成;Step 15 前不创建正式 `04`。 |
| 是否走“无配置说明文档”路径 | 决定 Step 3~13 是否适用 | Step 2 正式判定;当前已有多类配置绑定点,倾向于需要完整配置设计。 |
| backend 产品组合、capability matrix 和 stronger isolation profile | 影响 backend adapter、boundary profile、测试承载和验收证明 | Step 6 / 7 / 14 product-neutral 收敛;若改变 port / builder 契约则回写 `03`。 |
| network / filesystem / process profile、mount、seccomp / AppArmor / cap-drop 清单 | 影响 coherent boundary 和安全红线 | 后续配置域独立收敛;旧 README 清单不得直接继承。 |
| idempotency / stored result / relay / consumer / job retention 和 retry 数字 | 影响 duplicate replay、dead-letter、capacity 和 job report | Step 6 / 7 / 11 定义;missing stored result 仍禁止重跑。 |
| durable store / event bus / observability backend / scheduler / secret provider 产品 | 影响 adapter、secret、failure surface 和环境矩阵 | `04/07/ADR` owner 后续收敛;当前不锁定。 |
| 旧 `05/06` 何时重建 | 影响配置测试矩阵、veto 和 evidence 解释 | 正式 `04` 完成后按 full-restart 顺序进入 `05/06`。 |

---

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式上游输入清单明确 | 通过 | 见 §3 / §8.1。 |
| historical material / 下游方向输入已隔离 | 通过 | 见 §5 / §8.5。 |
| 配置设计不再回答 / 必须回答的问题明确 | 通过 | 见 §8.2 / §8.3。 |
| 初始配置输入候选池明确 | 通过 | 见 §8.4。 |
| 上游 blocker 已判断 | 通过 | 无阻塞 Step 2 的上游 blocker。 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无具体 `待回写`;后续代码契约变化触发阻塞回写。 |
| 可进入 Step 2 | 通过 | 用户已确认本 Step;当前已完成 Step 2 并等待 Step 2 审查。 |
