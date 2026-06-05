# Step 1. 确认配置输入边界

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 1 中间产物。
> 本步只确认配置设计需要承接哪些上游输入、哪些内容不再由配置设计回答、哪些缺口需要进入后续 Step。
> 本步不创建正式 `04-配置设计.md`,不提前定义完整 JSON schema,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
- 回填章节: `projects/L1-work/04-配置设计.md` §1 与上游文档的关系声明

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | L1-work 的项目工作事实真相仓定位、核心闭环、数据归属、非目标、接口依赖、非功能和验收红线 | 确认配置设计只能服务 Work truth runtime、adapter、projection、outbox、handoff、job 和 reference 控制面,不能重定义需求 |
| `01-架构设计.md` | Work 与 core / bus / identity / conversation / method-library / process / governance / artifact / runtime / observability / archive / workspace / SDK 的边界和依赖方向 | 确认配置不得绕过系统边界、数据归属、派生不反写、外部正文排除和唯一编译期依赖规则 |
| `02-概要设计.md` | 代码主体框架、配置影响轮廓、禁止配置化边界、受配置影响的主要部分和 detailed design handoff | 确认配置设计必须展开 runtime builder、adapter config、store config、job config、projection config 和配置错误边界 |
| `03-详细设计.md` | Rust workspace、模块、`infra/config.rs`、`runtime_builder.rs`、`WorkRuntimeConfig`、配置引用表、外部依赖绑定、跨仓 Rust dependency、测试切口和风险收口 | 固定配置设计的主要事实源,尤其是 §13 的配置引用、外部依赖绑定和配置后续工作 |
| `05-测试方案.md` | 旧版测试方案草案 | 只作为 Step 12 的下游承接方向参考;不作为配置事实源 |
| `06-验收标准.md` | 旧版验收标准草案 | 只作为 Step 12 的下游承接方向参考;不作为配置事实源 |

已确认结论:

```text
L1-work 需要独立配置设计。
它不是无配置支撑库;详细设计已经要求 infra / api / worker / jobs 读取或承接配置,并列出了 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features 等配置绑定点。
配置设计必须承接 03 中的配置引用与外部依赖绑定,继续说明配置来源、优先级、profile、JSON 示例、密钥边界、加载校验和失败策略。
配置设计不得重新定义 Rust struct、enum、trait、function、DTO、状态机、协议 schema、事务语义或实施 phase。
```

## 3. SOP 问题回答

### 3.1 当前配置设计要承接哪些需求、非功能、安全和环境差异?

需要承接的需求输入包括:

- L1-work 是项目工作事实真相仓,配置不能让 Process、Workspace、Runtime、Artifact、Conversation、Governance、Identity、Observability 或 Archive 接管本仓 truth。
- P0 闭环围绕 Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、WorkDependency、WorkBlocker、Iteration、PromoteResult、authorized query、projection、outbox、audit 和 handoff。
- 本仓只保存外部引用、安全快照、摘要、trace ref、handoff ref 和派生状态,不保存 conversation、artifact、ImplementationPlan、runtime progress 等外部正文。
- formalize / promote 必须显式发生,配置不能让 event、query、projection rebuild、process timing 或 runtime signal 直接创建正式 Work truth。

需要承接的非功能和安全输入包括:

- 外部正文、runtime 执行正文、artifact body、conversation body、secret、credential 和 raw diagnostic body 不得通过配置进入 Work truth、snapshot、audit、outbox、handoff payload、log 或 report。
- 配置不得关闭 truth ownership、external body exclusion、formalize / promote、ProjectMember / Actor visibility、metadata / idempotency、audit / outbox、query no-write、projection no-write 和 dependency discipline。
- outbox publish、projection rebuild、reference refresh、trace handoff、archive handoff 和 reconciliation failure 不能回滚已提交 truth。
- fake / in-memory adapter 可以用于 P0,但必须保留 failure、unresolved、retry、failed marker、stale marker 和 fake marker 语义。

需要承接的环境差异包括:

- local / CI 可以使用 in-memory store、fake publisher、fake resolver、fake handoff、deterministic clock / id、small batch 和 local reports。
- integration-like 可以配置真实或半真实 event source、source resolver、outbox publisher、handoff adapter 和 projection store。
- production-like 细节后移,但配置设计必须保留 endpoint ref、store ref、secret ref、timeout、retry、retention、batch、stale threshold、redaction 和 report root 的控制面。

### 3.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计?

必须进入配置设计的详细设计输入包括:

| 详细设计输入 | 配置设计承接方式 |
|---|---|
| `infra/config.rs` | 继续展开 `WorkRuntimeConfig`、配置项、默认值、校验和失败策略 |
| `infra/runtime_builder.rs` | 说明配置如何装配 repository、projection、idempotency、resolver、publisher、handoff、clock、id generator |
| `WorkRuntimeConfig.store` | 定义 store adapter、transaction timeout、owner uniqueness policy 和 durable adapter 后续接入规则 |
| `WorkRuntimeConfig.boundary` | 定义 command body、page limit、query timeout 等入口边界配置 |
| `WorkRuntimeConfig.idempotency` | 定义 command retention、event dedup retention、reserved record max age 和清理策略 |
| `WorkRuntimeConfig.projection` | 定义 projection adapter、stale threshold、replace scope、rebuild / stale / failed marker 规则 |
| `WorkRuntimeConfig.jobs` | 定义 batch size、parallelism、retry limit、job timeout 和 job runner 规则 |
| `WorkRuntimeConfig.external` | 定义 identity、method-library、source work、evidence、process timebox 等 resolver adapter 配置 |
| `WorkRuntimeConfig.outbox` | 定义 publisher adapter、publish batch、retry、failed marker 和 bus binding |
| `WorkRuntimeConfig.handoff` | 定义 trace / archive handoff target、timeout、retry 和 payload redaction |
| `WorkRuntimeConfig.features` | 定义 derived views、advanced search 等外围能力开关,并约束不得改变核心 truth |
| `core-contracts` path dependency | 说明唯一编译期依赖不属于运行配置,不可用时暂停实现 |
| 运行期相邻仓依赖 | 通过 adapter / fake / fixture / event / handoff 配置绑定,不得 Cargo path dependency |

### 3.3 哪些测试和验收场景依赖配置矩阵?

后续测试和验收至少依赖以下配置矩阵:

| 场景 | 依赖的配置维度 |
|---|---|
| runtime bootstrap 默认路径 | store、projection、idempotency、resolver、publisher、handoff、clock、id generator、profile |
| command / query handler mapping | boundary、metadata、visibility、page limit、query timeout、error mapping |
| inbound source consumer | event source profile、source resolver、event dedup、retry、fake marker |
| outbox publish | publisher profile、publish batch、retry policy、timeout、transport failure marker |
| projection rebuild / read model maintenance | projection adapter、replace scope、batch、stale threshold、failure marker |
| external reference / snapshot refresh | resolver profile、digest / freshness policy、unresolved / stale marker |
| trace / archive handoff | handoff adapter、payload ref、redaction、retry / failed state |
| idempotency conflict / duplicate replay | retention windows、reserved max age、repository unavailable failure |
| forbidden field / redaction | sensitive config、diagnostic redaction、report / artifact scan |
| local / CI / integration-like profile | fake / in-memory / real-like adapter matrix |

当前 `05-测试方案.md` 和 `06-验收标准.md` 需要在 `04` 完成后按新版配置控制面重校准。

### 3.4 哪些内容不应在配置设计中重新定义?

配置设计不应重新定义:

- 需求目标、用户故事、功能需求和验收标准。
- 系统上下文、限界上下文、职责边界、依赖方向和架构取舍。
- Rust workspace、crate、module、file layout、package directory layout。
- struct / enum / value object / trait / port / adapter / DTO / error 的正式代码契约。
- Command / Query / Event / Operations Job 的协议字段、HTTP path、topic 命名和函数流。
- Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、Dependency、Blocker、Iteration、PromoteResult、projection、outbox、handoff 的状态机。
- 事务、一致性、并发、幂等和重入保护语义。
- 具体测试用例、fixture、coverage、CI gate 细节和完整报告格式。
- 实施阶段、commit boundary、git 配置、开发目录和提交规范。
- 部署命令、生产拓扑、告警阈值和值班流程。

如果配置设计发现必须改变上述代码契约,必须进入详细设计影响判定并先回写 `03-详细设计.md`。

### 3.5 当前上游是否存在会阻塞配置设计的缺口?

不存在阻塞 Step 1~Step 2 的缺口。`00~03` 已足够支撑配置设计启动。

本 Step 撰写时曾存在以下待收口项;正式 `04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md` 生成后,这些项已转为历史诊断,不得再作为实现阻塞:

- 创建正式 `04-配置设计.md`。
- 补完整 JSON 配置示例、模块级 demo、逐项说明表和完整 JSONC 文档示例。
- 补配置来源优先级、冲突处理、环境 / profile 矩阵。
- 补敏感配置、secret ref、credential ref、endpoint ref 和 forbidden output boundary 的正式配置说明。
- 补配置加载、校验、生效、变更、审计、回滚和失效策略。
- `05-测试方案.md` 和 `06-验收标准.md` 按新版配置控制面重校准。
- `/home/aris/Projects/quantalithos-work` 目标实现仓尚未确认存在,需要在 `07` 或实现阶段处理。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L1-work/04-配置设计.md` | 本 Step 撰写时文件尚未创建;当前已生成正式文档 | 历史风险已关闭;实现时以正式 `04` 为准 |
| `projects/L1-work/03-详细设计.md` §13 | 已定义配置引用和外部依赖绑定,但没有定义 JSON 示例、来源优先级、profile、密钥策略和失效策略 | 实现者知道“有哪些配置绑定点”,但不知道“配置如何填写、覆盖、校验和失败” |
| `projects/L1-work/02-概要设计.md` §11 | 已识别配置影响轮廓和禁止配置化边界,但没有给出模块级配置 demo 和完整配置示例 | 可以指导 03 建立配置入口,不足以指导 04 的配置项落地 |
| `projects/L1-work/05-测试方案.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式文档 | 历史风险已关闭;配置测试矩阵以正式 `05` 为准 |
| `projects/L1-work/06-验收标准.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式文档 | 历史风险已关闭;配置验收门禁以正式 `06` 为准 |
| `projects/L1-work/design-calibration/03_ddd_step_18_risks_open_questions.md` | 曾记录 `04` 缺失会阻塞配置门禁;当前已关闭 | 不再作为实现阻塞;保留目标实现仓和生产化风险 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 配置内容停留在 `03-详细设计.md` §13 的代码绑定点 | 新增独立配置设计校准流程,最终产出 `04-配置设计.md` | 配置是运行、测试、验收、实施和运维共同引用的控制面 |
| 上游承接 | 可能直接从配置引用表扩写 | 明确从 `00/01/02/03` 承接边界,`05/06` 只作下游参考 | 防止把测试方向、部署猜测或旧配置说法写成配置事实 |
| 详细设计关系 | 只知道 04 承接 03 | 每个 Step 显式判断是否影响 03 | 防止在 04 中静默新增 config 字段、adapter 参数、trait 或 error |
| L1-work 配置面 | 尚未系统收敛 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features | 明确这些都是后续配置设计必须回答的输入边界 | Work 配置面横跨 truth runtime、外部引用、outbox、projection、idempotency 和 handoff |
| 下游关系 | `05/06` 已按新版配置控制面重校准 | 由正式 04 提供配置矩阵,正式 05/06 承接配置测试和验收 | 测试验收应承接配置设计,不是反向发明配置 |
| 非范围 | 容易把协议 schema、测试用例、部署命令和生产拓扑写进配置 | 明确 04 不写这些内容 | 保持配置设计层次清晰 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只在 `03-详细设计.md` §13 继续补配置 | 改动少,靠近代码绑定点 | 无法系统表达配置来源、profile、JSON demo、密钥、变更审计、失效策略和下游测试矩阵 | 不采用 |
| 方案 B: 新增正式 `04-配置设计.md`,按 SOP 逐 Step 收敛 | 配置控制面清晰,能支撑 05/06/07 和后续运维,也能防止实施脑补配置 | 需要额外维护 15 个 Step 中间产物 | 采用 |
| 方案 C: 等实施阶段再设计配置 | 当前文档推进快 | 实现者会自行定义 JSON / env / secret / profile 策略,跨仓口径容易漂移 | 不采用 |

推荐方案 B。

原因:

- `L1-work` 同时有 store、boundary、idempotency、projection、jobs、external、outbox、handoff 和 features 控制面。
- 详细设计只应定义代码绑定点,配置设计才负责填写方式、来源优先级、环境矩阵、密钥和失败策略。
- 后续测试、验收和实施都依赖配置矩阵,必须先有独立 `04`。

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | Work truth center、核心能力闭环、数据归属、非目标、外部依赖、安全边界、非功能和验收红线 | §1 / §2 / §4 / §6 / §8 / §11 |
| `01-架构设计.md` | 系统边界、依赖方向、数据所有权、配置不可绕过核心边界、运行期接缝和后续演进 | §1 / §3 / §4 / §5 / §6 |
| `02-概要设计.md` | 配置影响轮廓、主要部分受配置影响情况、禁止配置化边界、adapter / job / runtime builder 输入 | §3 / §4 / §7 / §9 |
| `03-详细设计.md` | `WorkRuntimeConfig`、配置引用表、外部依赖绑定、跨仓 Rust dependency、测试切口和风险与未进入实施项 | §3 / §5 / §7 / §8 / §9 / §11 / §12 |
| `05-测试方案.md` | 配置相关测试方向,需要等待新版 `04` 输出配置矩阵后重校准 | §12,仅作下游承接参考 |
| `06-验收标准.md` | 配置相关验收方向,需要等待新版 `04` 输出配置门禁后重校准 | §12,仅作下游承接参考 |

### 7.2 不再回答的问题清单

| 问题 | 交给哪份文档 / 哪一层 |
|---|---|
| shared ID、ActorRef、TraceContext、metadata、error refs 如何定义 | `L0-core` |
| outbox publication、delivery retry、event collaboration 语义如何定义 | `L0-bus` / 本仓 `03-详细设计.md` |
| Project / WorkItem / Iteration / PromoteResult 等 Rust 对象如何定义 | `03-详细设计.md` |
| Command / Query / Event / Job 协议字段和函数流如何定义 | `03-详细设计.md` |
| 状态机、事务、幂等和错误恢复如何实现 | `03-详细设计.md` |
| 测试用例、fixture、coverage、CI gate、report 细节如何组织 | `05-测试方案.md` |
| 什么配置结果算验收通过或失败 | `06-验收标准.md` |
| 实施批次、commit boundary、开发目录、git config 和提交规范如何安排 | `07-实施计划.md` |
| 生产拓扑、部署命令、告警阈值和值班流程如何执行 | 部署与运维手册 |

### 7.3 配置设计必须回答的问题清单

| 问题 | 目标章节 |
|---|---|
| L1-work 有哪些配置控制面,配置如何进入 runtime builder | §3 |
| 哪些配置允许改变运行装配,哪些行为禁止配置化 | §4 |
| 配置来源有哪些,按什么优先级覆盖,冲突如何处理 | §5 |
| local / CI / integration-like / production-like profile 有哪些差异 | §6 |
| 每个配置项的名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别和失败策略是什么 | §7 |
| 模块级 JSON demo、逐项说明表和完整 JSONC 文档示例如何组织 | §7 |
| secret ref、credential ref、endpoint ref 和敏感配置如何存储、读取、轮换、审计和脱敏 | §8 |
| 配置如何加载、解析、校验、装配、冷更新或热更新 | §9 |
| 配置变更如何评审、审计和回滚 | §10 |
| 配置缺失、非法、冲突、不可达、过期或漂移时如何 fail-fast / fail-closed / degraded | §11 |
| 配置设计如何交付给测试、验收、实施和运维 | §12 |
| 配置如何新增、废弃、迁移和演进 | §13 |

### 7.4 配置输入边界图

#### 配置来源链图: L1-work 配置输入边界

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

- `04` 只承接上游结论,不反向重写 `00/01/02/03`。
- `05/06` 只作为下游承接方向参考,不作为配置事实源。
- 若 `04` 发现必须改变 `03` 的代码契约,必须进入详细设计影响判定并回写。

### 7.5 对 03-详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 `04-配置设计.md` 以新版 `00/01/02/03` 为主输入,`05/06` 仅作下游承接参考 | 否 | 无代码契约变化 | 无 | 无回写 |
| 确认 L1-work 需要独立配置设计,不是无配置项目 | 否 | 已由 `03` §13 / §17 预留 | 无 | 无回写 |
| 确认配置设计必须展开 `03` §13 的配置引用、外部依赖绑定、adapter binding、job config、feature 和 handoff 控制面 | 否 | 详细配置说明,不改变 `03` 代码契约 | 无 | 无回写 |
| 确认禁止配置化边界来自 `01/02/03`,不得通过配置绕开 Work truth、external body exclusion、state machine、idempotency、audit 和 dependency discipline | 否 | 安全 / 边界配置规则,不改变 `03` 状态或函数 | 无 | 无回写 |

## 8. 回填草稿

正式 `04-配置设计.md` §1 建议采用以下结构:

```text
1. 与上游文档的关系声明
  1.1 配置设计输入来源
  1.2 配置设计不再回答的问题
  1.3 配置设计必须回答的问题
  1.4 对 03-详细设计的初始影响判定
```

必须引用:

```md
> 校准来源:
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“对详细设计的影响判定”“回填草稿”和“待确认事项”小节,了解本章输入边界如何从上游文档收敛而来。
```

回填正文应说明:

- 本文只承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`。
- 正式 `05-测试方案.md` 与 `06-验收标准.md` 已按新版生成;本 Step 中旧版草案表述仅为历史诊断,不作为当前配置事实源。
- 配置设计不重新定义需求、架构、概要和详细设计中的代码契约。
- 凡是会改变 `WorkRuntimeConfig` 字段、runtime builder 函数签名、adapter constructor、trait、error、event、job receipt 或 runtime graph 机制的配置结论,必须先回写 `03-详细设计.md`。

## 9. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| CFG01-OPEN-001 | 正式 `04-配置设计.md` 已创建 | 已由 Step 15 统一创建和装配 | 历史风险关闭 |
| CFG01-OPEN-002 | `05-测试方案.md` / `06-验收标准.md` 已按新版生成 | 已承接新版 `04` 配置控制面 | 历史风险关闭 |
| CFG01-OPEN-003 | 目标实现仓 `/home/aris/Projects/quantalithos-work` 尚未确认存在 | 交给 `07-实施计划.md` 或实施阶段确认 | 不阻塞配置设计 Step 2 |

## 10. 进入下一步条件

- [x] 输入文档清单明确。
- [x] 配置设计边界明确。
- [x] 已确认 L1-work 需要独立 `04-配置设计.md`,不是无配置项目。
- [x] 已确认 `05/06` 只作下游承接参考,不作为配置事实源。
- [x] 已完成对 `03-详细设计.md` 的初始影响判定,当前无回写项。
