# Step 1. 确认配置输入边界

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 1 中间产物。
> 本步只确认配置设计承接哪些上游输入、哪些内容不再由配置设计回答、哪些缺口进入后续 Step。
> 本步不创建正式 `04-配置设计.md`,不定义完整 JSON schema,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
- 回填章节: `projects/L1-process/04-配置设计.md` §1 与上游文档的关系声明

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | L1-process 的 Process truth 边界、数据归属、安全 / 审计 / 恢复 / 可观测 / 配置红线 | 确认配置只能服务 Process runtime、adapter、projection、outbox、handoff、job 和 reference 控制面 |
| `01-架构设计.md` | Process 与 core / bus / method-library / work / identity / governance / artifact / runtime / conversation / observability / archive 的边界和依赖方向 | 确认配置不得绕过系统边界、数据归属、恢复连续性、外部正文排除和唯一编译期依赖规则 |
| `02-概要设计.md` | 配置影响轮廓、受配置影响的主要部分、禁止配置化边界和详细设计承接清单 | 确认配置设计必须展开 runtime builder、adapter config、store config、job config、projection config 和配置错误边界 |
| `03-详细设计.md` | Rust workspace、模块、`infra/config.rs`、`runtime_builder.rs`、`ProcessRuntimeConfig`、配置引用表、外部依赖绑定、测试切口和风险收口 | 固定配置设计的主要事实源,尤其是 §13 的配置引用、外部依赖绑定和配置后续工作 |
| `05-测试方案.md` | 当前仍需按新版 03 / 04 同步 | 只作为 Step 12 的下游承接方向参考,不作为配置事实源 |
| `06-验收标准.md` | 当前仍需按新版 03 / 04 同步 | 只作为 Step 12 的下游承接方向参考,不作为配置事实源 |

已确认结论:

```text
L1-process 需要独立配置设计。
它不是无配置支撑库;详细设计已经要求 infra / api / worker / jobs 读取或承接 ProcessRuntimeConfig,并列出了 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、runtime 等配置绑定点。
配置设计必须承接 03 中的配置引用与外部依赖绑定,继续说明配置来源、优先级、profile、JSON 示例、密钥边界、加载校验和失败策略。
配置设计不得重新定义 Rust struct、enum、trait、function、DTO、状态机、协议 schema、事务语义或实施 phase。
```

## 3. SOP 问题回答

### 3.1 当前配置设计要承接哪些需求、非功能、安全和环境差异?

需要承接的需求输入包括:

- L1-process 是独立 Process truth 仓,配置不能让 method-library、work、runtime、workspace、observability、archive 或其他相邻仓接管本仓 truth。
- P0 闭环围绕 runtime shape、profile adoption、process instance、activity、gateway、waiting gate、checkpoint、recovery、timing、projection、reference snapshot、outbox、trace 和 handoff。
- 本仓只保存外部 ref、snapshot、marker、summary、trace ref 和 handoff ref,不得保存 method definition body、Work truth 正文、decision 正文、artifact body、runtime log、conversation body、observability body 或 archive package body。
- profile adoption、instance start / advance / pause / resume、waiting gate、checkpoint 和 recovery 必须显式发生,配置不能让 event、query、projection rebuild 或 job 自动改写主 truth。

需要承接的非功能和安全输入包括:

- 外部正文、runtime 执行正文、artifact body、conversation body、secret、credential 和 raw diagnostic body 不得通过配置进入 Process truth、snapshot、audit、outbox、handoff payload、log 或 report。
- 配置不得关闭 Process truth ownership、external body exclusion、metadata / idempotency、audit / outbox、query no-write、projection no-write、state matrix 和唯一编译期依赖纪律。
- outbox publish、projection rebuild、reference refresh、trace handoff、archive handoff 和 recovery maintenance failure 不得回滚已提交 truth。
- fake / in-memory adapter 可以用于 P0,但必须保留 failure、unresolved、retry、failed marker、stale marker 和 fake marker 语义。

需要承接的环境差异包括:

- local / CI 可以使用 in-memory store、fake publisher、fake resolver、fake handoff、fixed clock、sequence id 和小 batch。
- integration-like 可以配置受控 resolver、publisher、handoff、projection store 和 store profile。
- production-like 细节后移,但配置设计必须保留 endpoint ref、credential ref、timeout、retry、retention、batch、stale threshold、redaction 和 report ref 的控制面。

### 3.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计?

| 详细设计输入 | 配置设计承接方式 |
|---|---|
| `infra/config.rs` | 展开 `ProcessRuntimeConfig`、配置项、默认值、校验和失败策略 |
| `infra/runtime_builder.rs` | 说明配置如何装配 repository、projection、idempotency、resolver、publisher、handoff、clock、id generator |
| `ProcessRuntimeConfig.store` | 定义 store adapter、transaction timeout、optimistic conflict assertion 和 durable adapter 后续接入规则 |
| `ProcessRuntimeConfig.boundary` | 定义 command body、page limit、query timeout 等入口边界配置 |
| `ProcessRuntimeConfig.idempotency` | 定义 command retention、event dedup retention、job retention、reserved record max age 和清理策略 |
| `ProcessRuntimeConfig.projection` | 定义 projection adapter、stale threshold、rebuild batch 和 projection failure marker |
| `ProcessRuntimeConfig.jobs` | 定义 batch size、parallelism、timeout、retry backoff 和 job runner 规则 |
| `ProcessRuntimeConfig.external` | 定义 method-library、work、identity、governance、artifact、runtime、conversation resolver adapter 配置 |
| `ProcessRuntimeConfig.outbox` | 定义 publisher adapter、publish batch、retry、topic map 和 bus binding |
| `ProcessRuntimeConfig.handoff` | 定义 trace / archive handoff target、timeout、retry 和 payload redaction |
| `ProcessRuntimeConfig.features` | 定义 derived views、search 等外围能力开关,并约束不得改变核心 truth |
| `ProcessRuntimeConfig.runtime` | 定义 clock / id generator adapter 选择 |
| `core-contracts` path dependency | 说明唯一编译期依赖不属于运行配置,不可用时暂停实现 |
| 运行期相邻仓依赖 | 通过 adapter / fake / fixture / event / handoff 配置绑定,不得 Cargo path dependency |

### 3.3 哪些测试和验收场景依赖配置矩阵?

| 场景 | 依赖的配置维度 |
|---|---|
| runtime bootstrap 默认路径 | store、projection、idempotency、resolver、publisher、handoff、clock、id generator、profile |
| command / query handler mapping | boundary、metadata、page limit、query timeout、error mapping |
| inbound source consumer | event source profile、source resolver、event dedup、retry、fake marker |
| outbox publish | publisher profile、topic map、publish batch、retry policy、timeout、transport failure marker |
| projection rebuild / read model maintenance | projection adapter、rebuild batch、stale threshold、failure marker |
| external context snapshot refresh | resolver profile、digest / freshness policy、unresolved / stale marker |
| trace / archive handoff | handoff adapter、payload ref、redaction、retry / failed state |
| idempotency conflict / duplicate replay | retention windows、reserved max age、job retention、repository unavailable failure |
| forbidden field / redaction | sensitive config、diagnostic redaction、report / artifact scan |
| local / CI / integration-like profile | fake / in-memory / real-like adapter matrix |

当前 `05-测试方案.md` 和 `06-验收标准.md` 需要在 `04` 完成后按新版配置控制面重校准。

### 3.4 哪些内容不应在配置设计中重新定义?

配置设计不应重新定义:

- 需求目标、用户故事、功能需求和验收标准。
- 系统上下文、限界上下文、职责边界、依赖方向和架构取舍。
- Rust workspace、crate、module、file layout、package directory layout。
- struct / enum / value object / trait / port / adapter / DTO / error 的正式代码契约。
- Command / Query / Event / Operations Job 的协议字段、topic 命名和函数流。
- RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway、WaitingGate、Checkpoint、Recovery、Timing、Projection、Outbox、Handoff 的状态机。
- 事务、一致性、并发、幂等和重入保护语义。
- 具体测试用例、fixture、coverage、CI gate 细节和完整报告格式。
- 实施阶段、commit boundary、git 配置、开发目录和提交规范。
- 部署命令、生产拓扑、告警阈值和值班流程。

如果配置设计发现必须改变上述代码契约,必须进入详细设计影响判定并先回写 `03-详细设计.md`。

### 3.5 当前上游是否存在会阻塞配置设计的缺口?

不存在阻塞 Step 1~Step 2 的缺口。`00~03` 已足够支撑配置设计启动。

仍需后续 Step 收口的事项:

- 创建正式 `04-配置设计.md`。
- 补完整 JSON 配置示例、模块级 demo、逐项说明表和完整 JSONC 文档示例。
- 补配置来源优先级、冲突处理、环境 / profile 矩阵。
- 补敏感配置、secret ref、credential ref、endpoint ref 和 forbidden output boundary 的正式配置说明。
- 补配置加载、校验、生效、变更、审计、回滚和失效策略。
- `05-测试方案.md` 和 `06-验收标准.md` 按新版配置控制面重校准。
- `/home/aris/Projects/quantalithos-process` 目标实现仓尚未发现,需要在 `07` 或实现阶段处理。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L1-process/04-配置设计.md` | 文件尚未创建 | 配置实现、测试、验收和实施缺少正式配置事实源 |
| `projects/L1-process/03-详细设计.md` §13 | 已定义配置引用和外部依赖绑定,但没有定义 JSON 示例、来源优先级、profile、密钥策略和失效策略 | 实现者知道“有哪些配置绑定点”,但不知道“配置如何填写、覆盖、校验和失败” |
| `projects/L1-process/02-概要设计.md` §11 | 已识别配置影响轮廓和禁止配置化边界,但没有给出模块级配置 demo 和完整配置示例 | 可以指导 03 建立配置入口,不足以指导 04 的配置项落地 |
| `projects/L1-process/05-测试方案.md` | 仍需按新版 03 / 04 同步 | 不得作为本轮配置事实源 |
| `projects/L1-process/06-验收标准.md` | 仍需按新版 03 / 04 同步 | 不得作为本轮配置事实源 |
| `projects/L1-process/design-calibration/03_ddd_step_18_risks_open_questions.md` | 记录 `04` 缺失会阻塞配置实现和 production adapter | 需要本轮配置设计关闭 |

## 5. 结构化中间产物

### 5.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | Process truth center、核心能力闭环、数据归属、非目标、外部依赖、安全边界、非功能和验收红线 | §1 / §2 / §4 / §6 / §8 / §11 |
| `01-架构设计.md` | 系统边界、依赖方向、数据所有权、配置不可绕过核心边界、运行期接缝和后续演进 | §1 / §3 / §4 / §5 / §6 |
| `02-概要设计.md` | 配置影响轮廓、主要部分受配置影响情况、禁止配置化边界、adapter / job / runtime builder 输入 | §3 / §4 / §7 / §9 |
| `03-详细设计.md` | `ProcessRuntimeConfig`、配置引用表、外部依赖绑定、跨仓 Rust dependency、测试切口和风险与未进入实施项 | §3 / §5 / §7 / §8 / §9 / §11 / §12 |
| `05-测试方案.md` | 配置相关测试方向,需要等待新版 `04` 输出配置矩阵后重校准 | §12,仅作下游承接参考 |
| `06-验收标准.md` | 配置相关验收方向,需要等待新版 `04` 输出配置门禁后重校准 | §12,仅作下游承接参考 |

### 5.2 配置输入边界图

#### 配置来源链图: L1-process 配置输入边界

```text
00 Requirements
  |  truth center / data ownership / safety boundaries
  v
01 Architecture
  |  dependency direction / runtime collaboration / no boundary bypass
  v
02 High-level design
  |  components / flows / states / configuration impact
  v
03 Detailed design
  |  config bindings / runtime builder / adapters / jobs / tests
  v
04 Configuration design
  |  source priority / profiles / config items / secrets / validation / failure modes
```

关键说明:

- 图表达配置设计的上游输入顺序,不表达部署拓扑或代码依赖。
- `04` 只展开配置控制面,不覆盖 `03` 的代码契约。
- 如果配置结论需要改变 `03`,必须先回写详细设计。

## 6. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `04` 以新版 `00/01/02/03` 为主输入,`05/06` 只作下游承接参考 | 否 | 无代码契约变化 | 无 | 无回写 |
| L1-process 需要完整配置设计,不是无配置说明文档 | 否 | 无代码契约变化 | 无 | 无回写 |
| `ProcessRuntimeConfig` 已由 `03` 固定,本步不新增字段 | 否 | 无代码契约变化 | 无 | 无回写 |

## 7. 回填草稿

`04-配置设计.md` §1 应声明本文直接承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`,并把 `03` §13 的 `ProcessRuntimeConfig`、runtime builder、adapter、外部依赖、topic map 和 validation rules 作为配置设计的字段级输入。本文不重新定义 Rust 类型、DTO、状态机、事务、幂等、错误或实施 phase。`05/06` 当前只作为下游承接方向,不得反向成为配置事实源。

## 8. 待确认事项

- 无阻塞 Step 2 的待确认事项。
- 后续 Step 7 必须逐项展开 `ProcessRuntimeConfig` 的 P0 配置项和 JSON demo。
- 后续 Step 12 必须明确 `05/06/07/09` 如何承接配置矩阵。

## 9. 进入下一步条件

- 上游输入映射明确。
- 不再回答的问题明确。
- 详细设计影响判定为无回写。
