# Step 3. 建立配置控制面总览

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §3 配置控制面总览
> 生成日期: 2026-07-10
> 状态: reviewed_passed_to_step_4
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步建立配置来源链、唯一装配入口、模块读取边界、配置控制面和配置域骨架,并逐控制面停审。不定义最终来源优先级、具体配置项、默认数值、环境矩阵、secret 轮换、JSON 字段、热更新、部署命令、产品选型、实现代码、真实测试结果、run_id、evidence alias、验收签署或 commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 3 | 是。Step 2 审查点后用户回复“同意”。 |
| 项目级台账是否允许进入 Step 3 | 是。原恢复点为 `04` Step 2 `pass_wait_review`;用户确认后门禁满足。 |
| 文档级 flow 是否允许进入 Step 3 | 是。`04_config_calibration_flow.md` 原记录 Step 3 `blocked_by_step_2`;用户确认后可进入。 |
| 是否已读取 Step 1~2 | 是。已承接正式上游、historical material 隔离、P0 / P1 / P2、无配置路径和重点边界覆盖。 |
| 是否已读取 Step 3 SOP / 书写规范 | 是。必须输出来源链图、控制面总表、配置域总表、逐域停审和跨控制面审计。 |
| 是否已读取直接上游 | 是。重点复读正式 `03` §4 / §5 / §13 / §17 和 `03_ddd_step_14_config_external_binding.md`。 |
| 当前状态 | 已完成并经用户确认;已传递至 Step 4 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_03_control_plane.md` |
| 停审方式 | 用户已完成本 Step 审查并确认进入 Step 4;Step 4 已独立完成并进入新的停审点 |
| 是否发现阻塞本 Step 的上游 blocker | 否。observability sink、真实 backend 和 P2 overlay 的 exact carrier 仍需后续复核,但本 Step 只登记控制域,未新增 `03` 契约。 |

---

## 2. 本步目标

建立 `L4-sandbox` 的配置来源链、唯一 raw config owner、validated config 装配入口、模块读取边界、配置控制面和配置域全景。

本 Step 只回答:

- 配置可能从哪些来源进入系统,以及在哪一处完成加载 / 校验 / 装配。
- 哪些模块读取 raw / validated config,哪些模块只能接收 port、typed 参数或 runtime handle。
- Step 2 的 P0 / P1 / P2 范围应拆成哪些配置控制面和配置域。
- 每个配置域允许控制哪些承载能力,禁止控制哪些领域 / 安全不变量。
- 每个配置域回指哪个 detailed design config section、builder、adapter、store、entry 或 external dependency。
- 每个控制面是否通过停审,跨控制面是否存在 owner 重叠、配置域遗漏或 `03` 影响漏判。

本 Step 不定义:

- 最终来源优先级与冲突规则;这些属于 Step 5。
- 环境 / profile 逐项差异;这些属于 Step 6。
- raw key、类型、默认值、必填性、单位、secret 级别和失败策略全集;这些属于 Step 7~11。
- 具体 backend / store / bus / OTel / scheduler / secret provider 产品。
- policy / allowlist / high-risk taxonomy truth、artifact truth、observability ledger truth 或 runtime execution truth。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成并经用户确认 | 提供上游边界、候选配置域、historical material 和 `03` 回写门禁。 |
| `04_config_step_02_scope.md` | 已完成并经用户确认 | 提供 P0 / P1 / P2、完整配置路径、重点边界、范围 / 非范围和残余风险。 |
| `projects/L4-sandbox/03-详细设计.md` §4 / §5 | 正式直接上游 | 提供七模块布局、`infra` config / runtime builder owner、API / worker / jobs entry 和依赖方向。 |
| `projects/L4-sandbox/03-详细设计.md` §13 | 正式直接上游 | 提供 raw config 读取边界、config refs、external binding、唯一编译期依赖和禁止配置化边界。 |
| `projects/L4-sandbox/03-详细设计.md` §14 / §17 | 正式直接上游 | 提供 observability / redaction、配置风险、backend / profile / retention / scheduler 待确认项。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 提供 config section 字段池、runtime builder 顺序、store / adapter / event / handoff / job / feature binding。 |
| `03_ddd_step_15_observability_audit.md` | 已完成详细设计中间产物 | 提供 runtime log / metric / audit / diagnostic / redaction 作用面。 |
| `02_hld_step_11_configuration_impact.md` | 已完成概要中间产物 | 提供配置只影响承载、节奏、接缝和 degraded surface 的上游约束。 |
| `L1-governance` / `L1-artifact` Step 3 | 粒度参考 | 参考来源链、控制面、配置域停审和跨域审计结构,不复制业务配置。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、配置 flow 和 Step 2。 | done | 确认用户已允许进入 Step 3。 |
| 2 | 读取 Step 3 SOP、书写规范 §5.3 和 `03` config / module / risk 输入。 | done | 固定来源链、控制面、配置域、停审和跨域审计为必出。 |
| 3 | 建立来源链和唯一装配入口。 | done | raw config 只由 `infra/config.rs` 读取,validated refs 交给 `runtime_builder.rs`。 |
| 4 | 按 11 个 owner 控制面拆出配置域。 | done | 每域回指 `03` 既有 binding,不提前列 raw key。 |
| 5 | 对每个控制面完成允许 / 禁止能力和 `03` 影响停审。 | done | 不把 hard guard、truth 或状态机配置化。 |
| 6 | 完成跨控制面 owner、secret、profile、transport、handoff、safety 和 read-side 审计。 | done | 无 unresolved 重叠或具体 `03` 回写项。 |
| 7 | 输出回填草稿和 Step 4 handoff,更新三层状态。 | done | Step 3 完成后停审,不创建 Step 4 文件。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 当前系统配置从哪些来源读取 | 来源类型预览为 code defaults、项目 JSON config、environment variables、secret refs / provider resolution、entry-local typed selectors 和 deterministic test fixtures。Step 3 只确认来源种类和流向,最终优先级 / 冲突由 Step 5 裁决。 |
| 配置进入系统的唯一或主要装配入口是什么 | `crates/infra/src/config.rs` 是唯一 raw config owner,负责 load / parse / validate、生成 redacted config identity、validated refs 和 `SandboxRuntimeConfigSummary`;`crates/infra/src/runtime_builder.rs` 只读取 validated refs,装配 repositories、ports、application services 和 entry runtime handles。 |
| 哪些模块读取配置,哪些模块不得直接读取配置 | `infra/config.rs` 可读 raw config;`infra/runtime_builder.rs` 和 concrete adapters 只读 validated refs。`api` / `worker` / `jobs` 只读 entry-local typed selectors、typed job input 和 validated runtime handle。`application` 只接收 ports / typed parameters;`domain` / `contracts` 不读任何 runtime config。 |
| 配置控制哪些行为,不控制哪些领域不变量 | 配置控制 profile、adapter / store / route / target 绑定、availability、limits、freshness、retention、cadence、batch、parallelism、enablement 和 degraded surface。配置不控制 sandbox truth ownership、accepted / coherent / fail-closed / high-risk block、capture / handoff 分层、cleanup / redline guard、query no-write、consumer / job no core truth repair、relay / handoff no-rollback、duplicate replay 和 body-free redaction。 |
| 配置变化会影响哪些下游文档 | `05` 承接环境 / 组合 / invalid config / parity 测试,`06` 承接 startup / operation veto 和 redline,`07` 承接 loader / validator / adapter / profile 落码边界,部署运维手册承接真实值与平台操作。若改变代码契约,必须先回写 `03`。 |
| 每个配置控制面应拆成哪些配置域 / 功能模块 | 本 Step 拆为启动装配、入口负载、存储回放、外部摘要、隔离执行、事件传输、材料交接、安全收束、读侧维护、观测脱敏、环境与测试 profile 共 11 个 owner 控制面,再在 §9.4 按域展开。 |
| 每个配置域对应哪些详细设计 binding | 每域均回指 `SandboxRuntimeConfigSummary`、Step 14 config section、runtime builder、repository / adapter port、entry / worker / job 或 Step 15 observability contract;没有“仅因方便而新建”的配置域。 |
| 每个配置域是否通过停审 | 是。§9.5 按控制面确认来源入口、允许控制能力、禁止控制能力、owner 和 `03` 影响;当前均通过。 |
| 跨控制面是否存在重叠、领域不变量误配置化或 `03` 影响漏判 | 已完成 §9.6 审计。lease、reference refresh、observability handoff、relay store、secret 和 profile 的交叉 owner 已明确;当前无 unresolved 冲突或具体 `03` 回写项。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 2 范围表 | 已覆盖 12 类范围,但未建立唯一 owner 和装配链 | 本 Step 归并为 11 个控制面,防止后续配置项重复归属。 |
| `03` §13.2 配置引用表 | 以字段 / config section 为主,不便按配置控制面审查 | 本 Step 将既有 binding 映射到功能域,不修改字段。 |
| Step 14 config section | boundary、lease、capture、handoff、relay、job、projection 等存在交叉使用 | 本 Step固定 owning control plane和 consuming control plane,避免多处定义。 |
| `infra` / entry 边界 | 旧材料可能让 API / worker / jobs 直接读 env / endpoint / secret | 本 Step固定 raw config只在 `infra/config.rs`,entry 只读 typed selector / runtime handle。 |
| observability / handoff | observability material handoff 与 runtime log / metric / audit 容易混成一个配置域 | 本 Step分为“材料交接”和“观测脱敏”两个 owner,通过 target ref 关联。 |
| formal `04` | 当前不存在 | 继续中间产物链;Step 15 前不得创建。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源链 | 只知道配置由 `infra` 读取 | 建立来源类型 -> validate -> runtime builder -> adapter / service -> entry 的全链 | 支撑 Step 5 / 9。 |
| 装配入口 | config / builder / entry 关系分散 | 固定 raw owner 和 validated assembly 单向链 | 防止 raw config 泄漏到 application / domain。 |
| 控制面 owner | Step 2 只有范围类别 | 建立 11 个互斥主 owner 和跨域消费关系 | 支撑 Step 4 / 7 小循环。 |
| 安全边界 | 以全局禁止项存在 | 每个配置域都必须写允许 / 禁止能力 | 防止局部 profile 绕过 hard guard。 |
| `03` 影响 | 只做 Step 级总判定 | 每个控制面停审和跨域审计均检查 `03` binding | 防止后续配置项临时增加 carrier。 |

---

## 8. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 来源链是否写成最终优先级 | A. 当前锁定;B. 只画来源和装配流向 | 采用 B。最终覆盖优先级与冲突处理留 Step 5。 |
| 控制面按 crate 还是功能 owner 拆分 | A. 按 crate;B. 按功能 owner并回指 crate | 采用 B。配置审查关注谁拥有语义,不把文件树当配置分类。 |
| 是否将 profile 作为每域第二 owner | A. 每域各自定义 profile;B. profile只组合既有域 | 采用 B。环境 / test profile是横切组合器,不重定义域内语义。 |
| lease 归隔离执行还是安全收束 | A. 隔离执行;B. 安全收束 owner,隔离 adapter 只在 boundary establishment 消费冻结 lease profile | 采用 B。lease / orphan / cleanup / release 属于同一保守回收链;后序 run 只校验已保存 lease。 |
| observability handoff 归观测还是交接 | A. 观测 owner;B. handoff target归材料交接,local log / metric / audit / redaction归观测 | 采用 B。避免下游 observability truth 与 sandbox runtime observability 混层。 |
| reference refresh 归外部摘要还是读侧维护 | A. 外部摘要;B. resolver binding归外部摘要,refresh cadence / job归读侧维护 | 采用 B。source adapter 与 maintenance orchestration 分开。 |

---

## 9. 结构化中间产物

### 9.1 配置来源链图

#### 配置来源链图: L4-sandbox 配置装配链

```text
[code defaults]
      |
[project JSON config]
      |
[environment variables]
      |
[secret refs / provider resolution]
      |
[entry-local typed selectors / deterministic test fixtures]
      |
      v
[infra/config.rs: load -> parse -> validate -> redact]
      |
[validated config refs + SandboxRuntimeConfigSummary]
      |
[infra/runtime_builder.rs]
      |
      +--> [store / UoW / idempotency / result adapters]
      +--> [context / policy / capability resolvers]
      +--> [isolation / capture / handoff / publisher adapters]
      +--> [application services + validated runtime handles]
      |
      v
[api / worker / jobs entrypoints]
```

关键说明:

- 箭头只表达来源种类和装配流向预览,不表示 Step 5 尚未确认的最终优先级。
- `secret refs / provider resolution` 只向 validated adapter refs 提供敏感引用;raw secret 不进入 summary、日志、audit、report 或 entry args。
- entry-local 输入只允许选择 config path、profile、diagnostics mode、typed job input 等局部 selector,不得覆盖业务 guard、policy decision 或 idempotency identity。
- deterministic fixture 只服务 fake / contract test,不得成为 real-like / production-like 的隐式配置来源。
- `application`、`domain`、`contracts` 不读取 raw config;所有使用方只接收 typed参数、port或 validated runtime handle。

### 9.2 模块配置读取边界

| 模块 / 文件 | raw config | validated config / selector | 输出 | 禁止事项 |
|---|---:|---|---|---|
| `infra/config.rs` | 是 | config source、profile、adapter / store / binding refs | validated refs、redacted identity、summary、validation result | 输出 raw secret / endpoint / topic / external body。 |
| `infra/runtime_builder.rs` | 否 | validated refs、availability、store / target refs | repositories、ports、services、runtime handles | 默认 allow、放宽 guard、解析 raw config。 |
| `infra/*_adapters.rs` / repositories | 否 | adapter-specific validated ref | concrete adapter / repository | 用 raw error string 决定 domain state。 |
| `api` entry | 否 | config path / profile / diagnostics typed selector + runtime handle | handlers / service set | 用 CLI / route 绕过 metadata、policy或idempotency。 |
| `worker` entry | 否 | worker profile、consumer / fulfillment / relay enablement + runtime handle | worker loops | 直接访问 repository或解析未验证 config。 |
| `jobs` entry | 否 | typed job input、profile selector + runtime handle | job service / report | raw flag替代 job spec、dedup或idempotency key。 |
| `application` | 否 | ports、typed limits / freshness / timeout parameters | orchestration outcome | 读取 env、JSON、secret、endpoint、topic。 |
| `domain` / `contracts` | 否 | domain / public inputs only | truth / DTO / guard | 按 config改变 invariant、state、schema或truth owner。 |

### 9.3 配置控制面总表

| Control Plane ID | 控制面 | 作用 | 主 owner 模块 | P0 / P1 / P2 | 详细设计锚点 |
|---|---|---|---|---|---|
| SBX-CP-01 | 启动装配与配置身份 | source / profile选择、validation、adapter registry、runtime assembly | `infra/config.rs`;`runtime_builder.rs` | P0;P1扩展真实 source | `SandboxRuntimeConfigSummary`;Step 14 runtime config |
| SBX-CP-02 | 入口与负载包络 | API / worker / job selectors、body / page / timeout / batch / parallelism | `api`;`worker`;`jobs`;infra validated parameters | P0 | Step 14 boundary / job config;entry contracts |
| SBX-CP-03 | 存储、事务与重复回放 | truth / projection / derived / reference / relay / idempotency / result stores | `infra` repositories / UoW | P0 in-memory;P1 durable | `SandboxStoreConfigRef`;Step 11 / 13 / 14 |
| SBX-CP-04 | 外部语境、策略与能力摘要 | context resolver、policy summary、backend capability source与 freshness | `infra` resolver / policy / capability adapters | P0 fake;P1 real-like | Step 7 ports;Step 14 adapter refs |
| SBX-CP-05 | 隔离边界与执行后端 | boundary / limit profile、backend生命周期、launch / inspect / capture / release | `infra` isolation / capability adapters;application services | P0 deterministic fake;P1 real backend | Step 14 boundary / backend / capture config |
| SBX-CP-06 | 事件接入、发布与 relay | inbound subscription、schema allowlist、publisher、topic-neutral route、retry / dead-letter | `worker`;`infra/publishers.rs`;relay repository | P0 fake;P1 bus | Step 8 protocols;Step 14 event binding |
| SBX-CP-07 | 材料、观测与调查交接 | capture material class、handoff targets、delivery / receipt / retry | `infra/handoff_adapters.rs`;application/jobs | P0 fake / disabled;P1 real target | Step 7 handoff ports;Step 14 handoff config |
| SBX-CP-08 | 租约、清理、reaper 与 redline | lease、orphan scan、cleanup guard、release、containment / escalation | application/jobs;isolation release / investigation adapters | P0 safety;P1 scheduler / target | Step 9 / 10;Step 14 lease / cleanup / redline |
| SBX-CP-09 | 引用刷新、投影、派生与对账 | reference refresh、projection rebuild、derived compare、reconciliation | application/jobs;projection/reference repositories | P0 deterministic;P1 durable | Step 9 jobs;Step 14 projection / derived config |
| SBX-CP-10 | 可观测性、诊断与脱敏 | runtime log / metric、audit hook、diagnostic refs、redaction、sink seam | infra / entry hooks;handoff consumer | P0 safe local;P1 OTel / sink | `03` §14;Step 15;Step 14 observability binding |
| SBX-CP-11 | 环境与 deterministic test profile | 组合既有配置域为 local / test / integration / staging / production-like profile | config profile selector / test harness | P0 / P1;P2 overlay future | `SandboxRuntimeProfileRef`;Step 6 handoff |

### 9.4 配置控制面 / 配置域小循环

#### 9.4.1 SBX-CP-01 启动装配与配置身份

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D01 | config source intake | `infra/config.rs`;config source / path selector | 选择允许的 source 类型、读取位置与 parse 输入 | 在 entry / application / domain 直接读 raw config;在本步锁定优先级 | Step 5 / 7 / 9 |
| SBX-CFG-D02 | runtime profile / config identity | `SandboxRuntimeProfileRef`;`SandboxInfraConfigRef`;summary | 选择 profile、生成 redacted config identity / validation refs | 保存 raw JSON、secret、endpoint、topic或external body | Step 5~10 |
| SBX-CFG-D03 | startup validation | startup validation result;`ConfigUnavailable` / builder error surface | 决定 invalid / missing / cross-domain mismatch 的 startup surface | 将 invalid hard guard 降级为 warning或默认 allow | Step 4 / 7 / 9 / 11 |
| SBX-CFG-D04 | runtime builder / adapter registry | `runtime_builder.rs`;adapter availability marker | 按 validated refs 装配 stores、ports、services和runtime handles | 新增 application / domain 分支、绕过port或从availability创造truth | Step 4 / 7 / 9 / 11 |

控制面停审: 通过。raw owner、validated assembly和entry boundary已有 `03` 锚点;未新增 builder 签名。

#### 9.4.2 SBX-CP-02 入口与负载包络

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D05 | sync API envelope | `max_command_body_bytes`;`max_query_page_limit`;sync / query timeout | body、page、timeout、diagnostic mode等entry envelope | 绕过metadata、actor、policy、visibility、idempotency或redaction | Step 4~7 / 9 / 11 |
| SBX-CFG-D06 | worker runtime envelope | worker profile、consumer / fulfillment / relay enablement、runtime handle | 选择已绑定worker loop、并发 / batch包络 | worker直接读repository、解析raw config或创造核心success | Step 4~7 / 9 / 11 |
| SBX-CFG-D07 | job runner envelope | `SandboxJobConfig`;typed job input / report | batch、parallelism、timeout、retry class和runner availability | raw flag替代job spec / idempotency key;job修复core truth | Step 4~7 / 9~11 |
| SBX-CFG-D08 | feature assembly gate | outbound / derived / reconciliation enablement | 仅在依赖binding完整时装配外围worker / job | 关闭fail-closed、cleanup、redline、idempotency、capture或formal audit | Step 4 / 7 / 9 / 11 |

控制面停审: 通过。entry / worker / job只选择已校验runtime surface;feature gate不能关闭安全闭环。

#### 9.4.3 SBX-CP-03 存储、事务与重复回放

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D09 | truth / audit / UoW store | truth repository、audit trace repository、UoW manager | 选择实现同一logical schema / transaction contract的store adapter | 改变truth ownership、schema、expected version、cursor或commit ordering | Step 4~7 / 9 / 11 |
| SBX-CFG-D10 | projection / derived store | projection / derived repositories | 选择read / derived materialization store | query写core truth、rebuild修业务truth、derived成为第二真相 | Step 4~7 / 9 / 11 |
| SBX-CFG-D11 | reference store | reference state / typed snapshot repositories | 选择body-free ref / summary / freshness marker store | 保存external body、从opaque ref反推scope或自动接受resolution | Step 4~7 / 9 / 11 |
| SBX-CFG-D12 | relay store | relay repository、stored outbound payload snapshot | 选择relay record和payload snapshot store | publisher现查current truth拼payload;publish failure回滚source truth | Step 4~7 / 9 / 11 |
| SBX-CFG-D13 | idempotency / stored surface store | idempotency、command result、consumer receipt、job report repositories | 选择duplicate replay store和retention carrier | 关闭replay、允许missing stored result重跑、混用command / event / job key | Step 4~7 / 9 / 11 |

控制面停审: 通过。store只替换承载,不改变Step 11 transaction / Step 13 replay语义;fake / durable必须同契约。

#### 9.4.4 SBX-CP-04 外部语境、策略与能力摘要

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D14 | context reference source | `ContextReferenceResolverPort`;context resolver ref | 选择source family、adapter availability、freshness / delayed surface | 保存external body、生成identity / work / runtime truth或fallback到自造summary | Step 4~9 / 11 |
| SBX-CFG-D15 | policy / authorization summary source | `PolicySummaryPort`;summary source / freshness / high-risk profile | 选择body-free summary source、freshness阈值和adapter availability | 定义policy / allowlist / approval truth;missing / stale时放行 | Step 4~9 / 11 |
| SBX-CFG-D16 | backend capability source | `BackendCapabilityPort`;backend profile refs / stale threshold | 选择capability probe / fixture source和freshness surface | 把capability summary当backend product truth;unsupported时弱fallback | Step 4~9 / 11 |

控制面停审: 通过。三类source都只提供body-free summary / decision input,不接管上游truth;fail-closed保持不变。

#### 9.4.5 SBX-CP-05 隔离边界与执行后端

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D17 | coherent boundary profile | boundary profile / limit template refs;boundary service | 选择resource / filesystem / network / process requirement profile | 省略必需维度、silent ignore、debug / local放宽coherence | Step 4 / 6 / 7 / 9 / 11 |
| SBX-CFG-D18 | isolation backend lifecycle | `IsolationBackendPort`;lifecycle inspection / release helpers | 选择符合capability要求的adapter、launch / inspect / release包络 | host-run、弱后端fallback、backend SDK response成为domain state | Step 4 / 6~9 / 11 |
| SBX-CFG-D19 | execution capture | capture adapter、capture size / material class refs | 选择bounded capture class、capture adapter和partial / unavailable surface | 将process output写入truth / log;capture失败伪装success | Step 4 / 6~9 / 11 |
| SBX-CFG-D20 | backend handle / lease consumption | backend handle、lease profile consumer | 在boundary establishment时由generation-scoped backend adapter消费安全收束控制面拥有的lease profile并返回有界window;run只校验已保存lease | 在本域定义第二份lease配置、run时重算window、force release或绕过cleanup / redline guard | Step 4 / 6 / 7 / 9 / 11 |

控制面停审: 通过。coherent boundary四维整体成立,真实backend缺失时拒绝;lease owner归SBX-CP-08。

#### 9.4.6 SBX-CP-06 事件接入、发布与 relay

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D21 | inbound subscription / schema | 9 inbound consumers、source binding、schema allowlist | 选择subscription refs、consumer enablement、supported schema和quarantine seam | 改payload DTO、用raw body写truth、unsupported version silent accept | Step 4~9 / 11 |
| SBX-CFG-D22 | event publisher adapter | `EventPublisherPort`;publisher ref | 选择fake / real-like publisher和availability | publisher错误字符串驱动domain state;failure回滚source truth | Step 4~9 / 11 |
| SBX-CFG-D23 | topic-neutral route binding | 13 outbound event kinds、topic binding map | 将正式event kind / neutral key绑定transport route | 改event kind / schema / payload / source cursor;ad hoc拼topic | Step 4~9 / 11 |
| SBX-CFG-D24 | relay delivery / retry / dead-letter | relay worker / publish job、retry policy ref、batch | 配置batch、retry class、dead-letter target和delivery availability | duplicate publish重建payload;dead-letter删除source relay fact | Step 4~11 |

控制面停审: 通过。transport只承载正式协议,不重新定义event / receipt / cursor;relay failure保持no-rollback。

#### 9.4.7 SBX-CP-07 材料、观测与调查交接

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D25 | material handoff / relay delivery | `HandoffTargetDeliveryPort`;`SandboxEventPublisherPort`;fixed target refs / retry class / frozen relay binding | 选择 per-target delivery / same-attempt inspection binding、publisher binding、retry eligibility和receipt surface | opening内调delivery;target切换;receipt当artifact truth;publisher从latest truth重建payload;handoff / publish失败回滚run / capture / source truth | Step 4~11 |
| SBX-CFG-D26 | observability material handoff | observability handoff port / target refs / enablement | 选择safe observability material target和backpressure surface | 保存observability ledger body;把delivery当accepted前提 | Step 4~11 |
| SBX-CFG-D27 | investigation handoff | investigation port、target refs、redline escalation consumer | 选择investigation / security target和pending / failed surface | 普通receipt自动释放cleanup / redline guard;接管调查lifecycle truth | Step 4~11 |
| SBX-CFG-D28 | handoff receipt / retry coordination | handoff facts、retry job、job report | 配置retry class、pending retention和target availability | 修改source truth、伪造downstream acceptance或丢失failed fact | Step 4~11 |

控制面停审: 通过。三类handoff target分离;observability local hook归SBX-CP-10,redline release语义归SBX-CP-08。

#### 9.4.8 SBX-CP-08 租约、清理、reaper 与 redline

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D29 | lease / orphan detection | lease profile、orphan scan cadence、capability inspection | 配置lease class、scan cadence、batch和orphan inspection adapter | 到期即删除、跳过evidence / investigation / redline检查 | Step 4 / 6~11 |
| SBX-CFG-D30 | cleanup guard evaluation | cleanup cadence、retention guard profile、cleanup service | 配置evaluation cadence、batch和guard profile ref | force-clean绕过handoff / audit / investigation / redline guard | Step 4 / 6~11 |
| SBX-CFG-D31 | backend release | release adapter target、lifecycle inspection | 选择release adapter和retry / unavailable surface | release失败伪造Released;弱backend兜底释放 | Step 4 / 6~11 |
| SBX-CFG-D32 | redline containment / escalation | containment handoff、escalation target refs | 配置escalation target、delivery和maintenance cadence | 关闭containment、advisory-only、未调查放行或普通receipt解除 | Step 4 / 6~11 |

控制面停审: 通过。lease / cleanup / release / redline owner统一,任何cadence / retention都不能越过guard。

#### 9.4.9 SBX-CP-09 引用刷新、投影、派生与对账

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D33 | reference refresh | refresh job、resolver dispatch、stale threshold / batch | 配置scope、batch、freshness和resolver availability | 保存external body、从string猜resolver、refresh改core truth | Step 4 / 6~11 |
| SBX-CFG-D34 | projection rebuild | rebuild job、projection store、stale threshold / batch | 配置target scope、batch、store和degraded exposure | query触发写、rebuild修业务truth、拼projection ref | Step 4 / 6~11 |
| SBX-CFG-D35 | derived inspect / preview / trend | derived job、comparison scope、derived batch / enablement | 配置comparison scope、batch、availability和safe view | derived成为正式truth、读取external body或改变policy decision | Step 4 / 6~11 |
| SBX-CFG-D36 | reconciliation report | reconciliation job / report store / enablement | 配置scope、batch、report store和diagnostic surface | 自动修复core truth、把finding当accepted fact | Step 4 / 6~11 |

控制面停审: 通过。resolver adapter owner归SBX-CP-04;本控制面只拥有maintenance cadence / scope和read-side report。

#### 9.4.10 SBX-CP-10 可观测性、诊断与脱敏

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D37 | runtime log / metric | `03` §14 log / metric tables | 配置safe sink seam、level / sampling class和低基数label policy | 输出raw ids / secret / endpoint / topic / body / stack;日志替代audit truth | Step 4 / 6~12 |
| SBX-CFG-D38 | audit / trace hook | `SandboxAuditTrace`;accepted / rejected flow contract | 配置audit adapter availability和safe routing seam | 关闭正式audit、改变audit字段、以metric替代accepted truth trace | Step 4 / 6~12 |
| SBX-CFG-D39 | diagnostic issue | diagnostic ref / safe summary / validation log | 配置diagnostic store / handoff seam和retention class | 保存raw config / SDK body / SQL / HTTP body / stack trace | Step 4 / 6~12 |
| SBX-CFG-D40 | redaction / safe output gate | Step 15 forbidden fields / safe surfaces | 配置redaction profile ref、deny list和failure handling | debug / local关闭redaction;将raw secret写report / artifact | Step 4 / 6~12 |

控制面停审: 通过。当前只登记sink / sampling / redaction配置语义;若Step 7需要新增runtime config exact carrier,必须回写 `03`。

#### 9.4.11 SBX-CP-11 环境与 deterministic test profile

| Domain ID | 配置域 | `03` 锚点 | 允许配置的能力 | 禁止控制的能力 | 后续承接 |
|---|---|---|---|---|---|
| SBX-CFG-D41 | profile composition | `SandboxRuntimeProfileRef`;runtime builder | 组合已定义配置域为local / test / integration / staging / production-like候选 | 在profile内重定义域语义、hard guard或source priority | Step 5 / 6 / 7 / 9 |
| SBX-CFG-D42 | deterministic fixture / fake | fake adapters、in-memory stores、deterministic clock / id | 选择contract test fixture和failure injection | 把test override带入real-like、跳过状态 / transaction / redaction parity | Step 5~7 / 9 / 11 / 12 |
| SBX-CFG-D43 | real-like / production-like composition | P1 adapter refs / durable stores / secret refs | 组合已验证真实adapter、store、scheduler和sink | 未绑定依赖时silent fallback到fake / host-run | Step 5~12 |
| SBX-CFG-D44 | future overlay / reload trigger | P2 scope / Step 13 evolution | 记录重新打开设计和 `03` 回写触发 | 当前P0直接引入tenant / region overlay或hot reload | Step 13 / 14 |

控制面停审: 通过。profile只组合既有域;Step 6再定义环境矩阵,Step 5再定义来源覆盖。

### 9.5 配置控制面停审记录

| 控制面 | 来源 / 入口清楚 | 允许控制能力清楚 | 禁止控制能力清楚 | `03` 影响 | 结论 / 缺口 |
|---|---:|---:|---:|---|---|
| SBX-CP-01 启动装配 | 是 | 是 | 是 | 无回写 | 通过;raw owner和builder单向链固定。 |
| SBX-CP-02 入口负载 | 是 | 是 | 是 | 无回写 | 通过;entry只读typed selector / runtime handle。 |
| SBX-CP-03 存储回放 | 是 | 是 | 是 | 无回写 | 通过;store不改变logical schema / UoW / replay。 |
| SBX-CP-04 外部摘要 | 是 | 是 | 是 | 无回写 | 通过;只消费body-free summary,不拥有上游truth。 |
| SBX-CP-05 隔离执行 | 是 | 是 | 是 | 无回写 | 通过;无host-run / weak fallback。 |
| SBX-CP-06 事件传输 | 是 | 是 | 是 | 无回写 | 通过;route不改变协议,relay保持no-rollback。 |
| SBX-CP-07 材料交接 | 是 | 是 | 是 | 无回写 | 通过;target / receipt不升格为downstream truth。 |
| SBX-CP-08 安全收束 | 是 | 是 | 是 | 无回写 | 通过;cadence / retention不绕过guard。 |
| SBX-CP-09 读侧维护 | 是 | 是 | 是 | 无回写 | 通过;no-write / no-repair保持。 |
| SBX-CP-10 观测脱敏 | 是 | 是 | 是 | watch_no_writeback | 通过;exact sink carrier留Step 7复核,当前不新增契约。 |
| SBX-CP-11 环境 / test profile | 是 | 是 | 是 | watch_no_writeback | 通过;P2 overlay / reload当前不进入P0。 |

### 9.6 跨控制面审计表

| 审计项 | 结论 | owner / 修正口径 | unresolved 缺口 |
|---|---|---|---|
| raw config ownership | 唯一 | SBX-CP-01 / `infra/config.rs`;其他模块只接收validated surface | 无 |
| runtime profile与域内配置重叠 | 已分离 | SBX-CP-11只组合SBX-CP-01~10,不重定义域语义 / key / guard | 无 |
| entry limits与boundary limits重叠 | 已分离 | API / page / job envelope归SBX-CP-02;resource / fs / network / process归SBX-CP-05 | 无 |
| lease在backend与cleanup间重叠 | 已分离 | lease / orphan / cleanup / release owner归SBX-CP-08;SBX-CP-05只在boundary establishment消费冻结profile,run / reaper不得从current config重算window | 无 |
| backend capability与backend selection重叠 | 已分离 | capability source / freshness归SBX-CP-04;backend lifecycle / profile归SBX-CP-05 | 无 |
| capture与material handoff重叠 | 已分离 | capture fact / adapter归SBX-CP-05;target / delivery / receipt归SBX-CP-07 | 无 |
| observability handoff与runtime observability重叠 | 已分离 | observability material target归SBX-CP-07;local log / metric / audit / diagnostic / redaction归SBX-CP-10 | 无 |
| relay store与publisher route重叠 | 已分离 | relay record / payload store归SBX-CP-03;publisher / topic / delivery归SBX-CP-06 | 无 |
| reference resolver与refresh job重叠 | 已分离 | resolver family / source归SBX-CP-04;refresh scope / cadence / report归SBX-CP-09 | 无 |
| idempotency retention与job retry重叠 | 已分离 | dedup / stored surface lifecycle归SBX-CP-03;runner retry / batch归SBX-CP-02或对应operations plane | 无 |
| secret跨域归属 | 横切但不重复 | Step 8统一定义secret ref / provider / rotation / audit;各域只声明需要哪类secret ref | 无,待Step 8展开 |
| source priority跨域归属 | 横切但不提前锁定 | Step 5统一裁决code / JSON / env / secret / entry / fixture覆盖与冲突 | 无,待Step 5展开 |
| hard guard误配置化 | 未发现 | coherent boundary、fail-closed、cleanup / redline、no-write / no-repair、no-rollback、replay、redaction均列入禁止能力 | 无 |
| `03` binding遗漏 | 未发现当前遗漏 | 11控制面覆盖Step 14 runtime / store / adapter / boundary / policy / capture / handoff / relay / job / feature / observability输入 | CP-10 exact sink carrier和CP-11 P2 overlay仅watch |
| 编译期依赖越界 | 未发现 | 所有runtime / event / handoff / product依赖走adapter / event / fake;仅`core-contracts`可path dependency | 无 |

### 9.7 用户重点边界到控制面追溯

| 重点边界 | 主控制面 | 协同控制面 | 配置控制结论 |
|---|---|---|---|
| execution environment identity | SBX-CP-01 / SBX-CP-05 | SBX-CP-04 | profile / context / backend handle只绑定identity输入,不生成外部truth。 |
| resource limits | SBX-CP-05 | SBX-CP-02 / SBX-CP-04 | limit profile必须与backend capability一致,不支持即拒绝。 |
| filesystem boundary | SBX-CP-05 | SBX-CP-04 / SBX-CP-11 | profile可组合,不得debug / local放宽coherence。 |
| network boundary | SBX-CP-05 | SBX-CP-04 | boundary profile先独立建立no-egress要求;后序launch enforcement才消费policy summary;allowlist truth不在sandbox。 |
| process boundary | SBX-CP-05 | SBX-CP-04 | process / privilege profile必须被capability验证,无host-run fallback。 |
| tool / runtime launch policy | SBX-CP-04 | SBX-CP-05 | 只绑定summary source / freshness / high-risk profile,不拥有tools/runtime语义。 |
| artifact capture | SBX-CP-05 | SBX-CP-07 / SBX-CP-10 | capture、handoff、redaction分层,candidate material不升格artifact truth。 |
| observability hooks | SBX-CP-10 | SBX-CP-07 | local hook与material handoff分owner,不保存observability ledger body。 |
| failure classification | SBX-CP-04 / SBX-CP-05 | SBX-CP-06~10 | adapter返回formal outcome;config只绑定surface,不解析错误字符串造state。 |
| cleanup / lease / reaper | SBX-CP-08 | SBX-CP-05 / SBX-CP-07 | cadence / target可配置,guard不可绕过。 |
| security redlines | SBX-CP-08 / SBX-CP-10 | SBX-CP-07 | containment / escalation / redaction不可disabled或advisory-only。 |

### 9.8 对下游文档的影响总表

| 下游文档 | 从本 Step 接收什么 | 本 Step 不提供什么 |
|---|---|---|
| `04` Step 4 | 11控制面、44配置域、逐域允许 / 禁止能力 | 配置类别、热更新裁决和正式禁止项流程尚未展开。 |
| `04` Step 5 | 来源链中的source types与唯一装配入口 | 最终优先级、冲突和不可用策略尚未裁决。 |
| `04` Step 6 | profile composition owner和P0 / P1 / P2域集合 | 环境矩阵、具体profile差异和secret处理尚未定义。 |
| `04` Step 7~11 | domain inventory、详细设计锚点和owner | raw key、类型、默认值、secret、validation、change / failure策略尚未定义。 |
| `05-测试方案.md` | 控制面组合、fake / durable parity、invalid binding和hard guard测试入口 | 不提供测试用例、run_id、evidence或通过结论。 |
| `06-验收标准.md` | startup / operation veto、no weak fallback、cleanup / redline / redaction配置门禁方向 | 不提供验收阈值、evidence alias、风险接受或签署。 |
| `07-实施计划.md` | config owner、builder链、control plane / domain owner和潜在 `03` watch | 不提供phase / commit boundary、implementation ledger或planned skeleton。 |
| 部署与运维手册 | 哪些域需要真实value / secret / platform binding | 不提供部署命令、挂载、证书安装、发布或值班操作。 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---:|---|---|---|
| raw config唯一owner为`infra/config.rs`,runtime builder只读validated refs | 否 | 承接 `03` §13.1 | 不适用 | 无回写 |
| 11个控制面由Step 14既有config section / adapter / store / entry / job binding归并而成 | 否 | 配置设计组织视图 | 不适用 | 无回写 |
| 44个配置域只拆分既有控制能力,不新增raw key或code carrier | 否 | 配置域骨架 | 不适用 | 无回写 |
| lease / cleanup / redline owner统一为SBX-CP-08 | 否 | 既有配置binding owner澄清 | 不适用 | 无回写 |
| observability handoff与local observability / redaction分owner | 否 | 既有handoff / observability边界澄清 | 不适用 | 无回写 |
| CP-10 exact sink / sampling carrier尚未在本 Step定义 | 否 | Step 7复核watch | 不适用 | 无回写 |
| CP-11 P2 overlay / dynamic reload当前不进入P0 | 否 | 非范围 / Step 13演进触发 | 不适用 | 无回写 |

本 Step 当前没有 `待回写` 或 `阻塞待确认` 项。Step 7 若发现现有 `SandboxRuntimeConfigSummary` / builder / adapter surface无法承载P0配置项,必须回写 `03` 后再继续。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源链图”“配置控制面 / 配置域小循环”“配置控制面停审记录”“跨控制面审计表”和“对详细设计的影响判定”小节,了解配置如何进入系统及每个配置域的owner和边界。

正式 `04-配置设计.md` §3 应回填:

- L4-sandbox 配置装配链图及关键说明。
- 模块配置读取边界表。
- 11个配置控制面总表。
- 按控制面组织的44个配置域 / 功能模块表。
- 控制面停审记录和跨控制面审计结论。
- 用户重点边界到控制面的追溯表。

回填要求:

- 图中箭头不得被解释为Step 5尚未确认的最终优先级。
- 不得把raw config、secret、endpoint、topic或external body暴露给application / domain / contracts。
- 不得在正式§3新增Step 3未出现的配置域、owner、adapter或hard guard例外。
- 不得把profile当第二配置真相源;profile只组合已有域。
- 不得把test fixture、fake adapter或local profile升级为host-run / weak fallback。

---

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| source types的最终优先级与冲突处理 | 影响JSON / env / secret / entry / fixture覆盖 | Step 5统一裁决;本 Step箭头只表达装配流向。 |
| 11控制面是否需要在正式JSON中一一对应section | 影响Step 7文件schema和模块demo | Step 4分类、Step 7配置项时裁决;不得为对齐表格新增无代码owner。 |
| CP-10 log / metric / audit / diagnostic sink和sampling exact carrier | 可能影响runtime config / builder | Step 7前复核现有Step 14 / 15;需要新carrier则回写 `03`。 |
| CP-11 P2 tenant / region overlay和dynamic reload | 可能影响config snapshot、builder branch和scope carrier | 当前非范围;Step 13记录重新打开设计条件。 |
| P1 backend / store / bus / OTel / scheduler / secret provider产品 | 影响adapter ref、secret和profile composition | Step 6~8 / 14保持product-neutral或待确认。 |
| fake / durable / real-like parity如何进入测试 | 影响store / adapter / transaction / redaction可信度 | Step 12交给`05`;Step 3只固定同控制面语义。 |

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源链和唯一装配入口明确 | 通过 | 见§9.1 / §9.2。 |
| 配置控制面和配置域已拆分 | 通过 | 11控制面、44配置域,见§9.3 / §9.4。 |
| 每个控制面完成停审 | 通过 | 见§9.5。 |
| 跨控制面无 unresolved 冲突 | 通过 | 见§9.6。 |
| 用户重点边界全部有控制面owner | 通过 | 见§9.7。 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无具体 `待回写` / `阻塞待确认` 项。 |
| 可进入 Step 4 | 已通过 | 用户已确认本 Step;Step 4 `定义配置分类与禁止配置化边界` 已独立完成并等待审查。 |

---

## 14. DesignReopen current binding override (`v7.8`)

本节覆盖本 Step 中任何旧 `MaterialHandoffPort` 解读，且不新增 config key、profile、status 或 product 选型。

| 配置面 | current binding | 不可配置化的硬边界 |
|---|---|---|
| capture | `CaptureCollectionPort::{collect_capture, inspect_capture}` 的 runtime binding / availability | `CaptureFactStatus`、body-free relation、immutable `record(...)` 不可配置改写 |
| handoff | `HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}` 的 target binding / retry eligibility | opening delivery calls = 0；fixed target plan 不可在 retry 时切换；`Attempting` 必须先 commit |
| publisher | `SandboxEventPublisherPort::publish` 的 route / sink binding | 只消费 frozen committed relay bundle + exact attempt；success=`Published`；不从 latest truth 重建 |
| ordinary hook | body-free / low-cardinality sink binding | post-return / post-inspection；hook failure 不改 truth、UoW、identity、retry、public result 或 stored replay |

```text
current_binding_propagation = completed_design_static_only
new_config_item = 0
new_profile = 0
product_selected = no
provider_conformance = not_started
commit_required = no
```
