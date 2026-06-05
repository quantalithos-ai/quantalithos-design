# L1-work 07 实施计划 Step 8: 配置、环境与外部依赖准备

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §8 配置、环境与外部依赖准备
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义配置、环境与外部依赖准备 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_08_config_env_dependencies.md` |

本步把架构依赖、详细设计 adapter / port、配置 profile、测试环境和 Step 5~Step 7 的阶段门禁转成实施前和阶段前可检查的准备项。本步不新增配置项、不新增外部 adapter 字段、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` §4 / §7 / §12 / §14 | 已完成 | 提取唯一编译期依赖、运行期依赖、事件协作依赖和不可接受依赖债务 |
| `03-详细设计.md` §3~§5 / §13 / §15~§17 | 已完成 | 提取 Rust workspace、`core-contracts` path dependency、runtime builder、adapter binding、fake / in-memory 默认路径 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 P0 profile、28 个配置项、ref-only sensitive、加载校验、fail-fast / fail-closed 和 failure marker |
| `05-测试方案.md` §8 / §9 / §13 | 已完成 | 提取测试环境矩阵、gate 参数、artifact / report root 和 fake / configured / replay 证据区分 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、git、工具、目录、脚本、证据路径和本地多仓依赖前置检查 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承跨仓 / 外部依赖清单、fake / in-memory 交付物和非交付物 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-09 依赖顺序 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 suite、artifact、report、redaction、fake marker 和 release evidence gate |
| `standards/document/实施计划讨论流程_SOP.md` Step 8 | 已读取 | 约束外部依赖准备表、配置环境检查表和 fake / mock 使用边界 |

校准来源:

- `design-calibration/04_config_step_03_control_plane_overview.md`
- `design-calibration/04_config_step_05_sources_priority_conflicts.md`
- `design-calibration/04_config_step_06_profiles_matrix.md`
- `design-calibration/04_config_step_07_config_items.md`
- `design-calibration/04_config_step_08_sensitive_secrets.md`
- `design-calibration/04_config_step_09_load_validate_apply.md`
- `design-calibration/04_config_step_11_failure_modes.md`
- `design-calibration/04_config_step_12_downstream_handoff.md`
- `design-calibration/05_test_plan_step_08_environment_config.md`
- `design-calibration/05_test_plan_step_09_automation_gates.md`
- `design-calibration/06_acceptance_step_06_data_architecture_redline.md`
- `design-calibration/06_acceptance_step_09_non_functional_gate.md`
- `design-calibration/06_acceptance_step_11_veto.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖 | P0 唯一必须存在的编译期外部仓是 `/home/aris/Projects/quantalithos-core/crates/contracts`;目标实现仓 `/home/aris/Projects/quantalithos-work` 当前不存在,由 PH-01 创建。真实 DB / MQ / search / trace / archive / secret provider 不是 P0 开工前置。 |
| 2. 哪些依赖只在特定阶段需要 | Project / Backlog 只需要 core;member 从 PH-03 需要 identity resolver seam;formal / promote 从 PH-04 需要 conversation / runtime / governance / method ref seam;dependency 从 PH-05 需要 artifact evidence seam;iteration 从 PH-06 需要 process seam;query 从 PH-07 面向 downstream surface;operations 从 PH-08 需要 bus、observability、archive handoff seam。 |
| 3. 哪些配置项必须在本地或 CI 环境准备 | 必须准备 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile fixture,覆盖 `store.*`、`boundary.*`、`idempotency.*`、`projection.*`、`jobs.*`、`external.*`、`outbox.*`、`handoff.*` 和 `features.*`。 |
| 4. 是否允许 fake / mock,允许到什么阶段为止 | P0 默认允许并要求 fake / in-memory / deterministic adapters,贯穿 PH-01~PH-09 的 local / CI / replay 证据;但必须有 fake marker,不得伪装 configured / production success。P1/P2 production adapter 不进入 P0。 |
| 5. 外部依赖不可用时是暂停、降级还是替代 | `core-contracts` 缺失时暂停;目标仓缺失时 PH-01 创建;运行期和事件协作 sibling 缺失时使用 fake / fixture / marker,不阻塞 P0;configured adapter ref 缺失或 provider 不可用时 fail-fast / fail-closed,不得 fallback fake success。 |
| 6. 哪些依赖需要由其他团队或仓提供 | P0 只需要 core contracts baseline。bus、identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability、archive 的真实实现只作为后续 P1/P2 或 selected seam 输入。 |
| 7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在 | 当前本机可见 `quantalithos-core`、`quantalithos-bus`、`quantalithos-identity`、`quantalithos-conversation`、`quantalithos-method-library`、`quantalithos-sdk`;未见 `quantalithos-work`、`quantalithos-process`、`quantalithos-governance`、`quantalithos-artifact`、`quantalithos-runtime`、`quantalithos-workspace`、`quantalithos-observability`、`quantalithos-archive`。除 work / core 外均不阻塞 P0。 |
| 8. 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致 | 唯一编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;任何其他 sibling repo 进入 `Cargo.toml` 都是阻断问题。 |
| 9. 哪些依赖是运行期依赖或事件协作依赖 | bus、identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability、archive 都必须通过 port、adapter、event、snapshot、handoff、query、projection 或 fake seam 协作,不得写成 Cargo path dependency。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 外部依赖清单已有但未分准备级别 | Step 4 已列跨仓依赖,但没有说明哪些阻塞 P0 | 实施者可能等待所有 sibling repo 或真实服务 | 本步分成 compile blocker、PH-01 初始化项、P0 fake seam 和 P1/P2 风险 |
| 配置项清单已有但未落到阶段准备 | `04` 有 28 个配置项和 profile | PH-01 可能只建代码不建 profile / validator | 本步按 PH-01 / PH-08 / PH-09 定义配置准备门禁 |
| fake / configured 容易混用 | P0 允许 fake,但验收禁止 fake production success | configured adapter 缺失时可能静默 fallback | 本步明确 fake marker、configured ref validation 和 fail-closed |
| 本地仓存在状态不完整 | 有些 sibling repo 在本机存在,有些不存在 | 实现者可能把存在的仓临时 path dependency 进来 | 本步强调存在不等于允许编译期依赖 |
| artifact / report root 不属于 runtime config | `04` 明确由测试 / 实施承接 | gate 或 job 可能生成错误路径 | 本步把路径作为环境准备和脚本参数检查 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 外部依赖 | 只知道有哪些 sibling / service | 每项有类型、使用阶段、检查方式和不可用处理 | 开工前可执行 |
| 配置准备 | 只知道配置项和 profile | 每个 profile 有适用阶段、默认 adapter 和检查门禁 | 防止 profile 漂移 |
| fake 边界 | 散落在 `03/04/05/06` | 形成 fake / configured / production-like 边界表 | 防止 fake 成功污染验收 |
| 环境检查 | Step 3 有通用前置 | 本步补 phase 级环境与配置检查 | 支撑 PH-01~PH-09 |
| P1/P2 依赖 | 在风险中出现 | 明确不阻塞 P0,也不得伪装完成 | 防止范围膨胀 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 等所有 sibling repo 和真实服务就绪再开工 | 更接近完整系统 | 阻塞 Work P0,违反唯一编译期依赖和 fake seam 口径 | 不采用 |
| P0 只要求 core contracts + fake / in-memory 可验证路径 | 可独立落地和验收 | 生产 adapter 风险后置 | 采用 |
| 本机存在的 sibling repo 直接 path dependency | 编码方便 | 破坏依赖裁剪,形成循环和第二 truth | 不采用 |
| 通过 port / adapter / event / fake 表达 sibling 协作 | 保持边界清晰 | 需要 fixture 和 failure marker | 采用 |
| 将 artifact / report root 写入 runtime config | 运行时统一 | `04` 当前未定义该 runtime section | 不采用;由 gate / report args 承接 |
| 每个阶段都检查完整 release config | 严格 | PH-02~PH-08 成本过高 | 不采用;按阶段 selected check,PH-09 全量收口 |

## 7. 结构化中间产物

### 7.1 依赖分级规则

| 级别 | 定义 | 当前对象 | 不可用时处理 |
|---|---|---|---|
| P0 compile blocker | 缺失会导致 workspace 不能合法编译 | `quantalithos-core/crates/contracts` | 暂停,不得绕过或复制 core contracts |
| PH-01 initialization | 目标实现落点,缺失时由本轮创建 | `/home/aris/Projects/quantalithos-work` | PH-01 创建;不得在其他路径实现 |
| P0 runtime seam | P0 通过 port / fake / fixture / marker 验证的运行期或事件协作 | bus、identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability、archive | 不阻塞 P0;使用 fake / fixture / configured selected seam |
| selected integration seam | `integration-like` 或 release selected 时才检查的 configured ref | configured resolver、publisher、handoff、store profile | ref 缺失 fail-fast;provider 不可用 fail-closed / marker |
| P1/P2 production dependency | 真实生产 DB / MQ / KMS / archive / config center / hot reload 等 | durable store、real bus、secret provider、remote config、deployment topology | 不进入 P0;记录风险或后续专项 |

### 7.2 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 本地当前状态 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-work` | repo | 实现仓 | PH-01 | L1-work 实施 | 当前未存在 | 检查目录和 git repo | PH-01 创建;不得在其他路径实现 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | repo / crate | 编译期依赖 | PH-01 起 | L0-core | 当前存在 | 目录检查、Cargo path dependency、commit baseline、contract compile | 缺失则暂停;不得复制 core 类型 |
| `quantalithos-bus` | repo / service | 事件协作依赖 | PH-08 / PH-09 | bus 仓 | 当前存在 repo | 确认不进 Cargo;fake publisher / event payload tests | repo 或真实 bus 不可用不阻塞 P0;configured bus 缺 ref fail-fast |
| `quantalithos-identity` | repo / service | 运行期 resolver / event seam | PH-03 / PH-08 | identity 仓 | 当前存在 repo | 确认不进 Cargo;resolver port、snapshot fixture、negative tests | 使用 fake resolver;configured ref 缺失 fail-fast;resolver failure unresolved |
| `quantalithos-conversation` | repo / service | 事件协作依赖 | PH-04 / PH-07 / PH-08 | conversation 仓 | 当前存在 repo | 确认不进 Cargo;work context fixture、source ref、forbidden body scan | 使用 event fixture / fake source;不得保存 conversation body |
| `quantalithos-method-library` | repo / service | 运行期 resolver seam | PH-04 / PH-08 | method-library 仓 | 当前存在 repo | 确认不进 Cargo;definition ref / snapshot resolver fixture | 使用 fake resolver;method body 不进入 Work |
| `quantalithos-process` | repo / service | 运行期 resolver / event seam | PH-06 / PH-08 | process 仓 | 当前未见 repo | 确认不进 Cargo;timebox ref fixture、process boundary negative | 使用 fake / fixture;缺真实 repo 不阻塞 P0 |
| `quantalithos-governance` | repo / service | 运行期 resolver seam | PH-04 / PH-08 | governance 仓 | 当前未见 repo | 确认不进 Cargo;decision ref / safe summary fixture | 使用 fake resolver;governance body 不进入 Work |
| `quantalithos-artifact` | repo / service | 运行期 resolver seam | PH-05 / PH-08 | artifact 仓 | 当前未见 repo | 确认不进 Cargo;evidence ref / completion summary fixture | 使用 fake resolver;artifact body 不进入 Work |
| `quantalithos-runtime` | repo / service | 事件协作依赖 | PH-04 / PH-08 | runtime 仓 | 当前未见 repo | 确认不进 Cargo;promote request event fixture、runtime body reject | 使用 event fixture;runtime progress / plan body 不进入 Work |
| `quantalithos-workspace` | repo / service | 下游消费依赖 | PH-07 / PH-09 | workspace 仓 | 当前未见 repo | 确认不进 Cargo;public query / projection surface tests | 不阻塞 P0;只验证 Work public surface |
| `quantalithos-sdk` | repo / service | 下游消费 / SDK seam | PH-07 / PH-09 selected | SDK 仓 | 当前存在 repo | 确认不进 Cargo;public contract compatibility selected | 不阻塞 P0;不作为 Work compile dependency |
| `quantalithos-observability` | repo / service | handoff / downstream seam | PH-08 / PH-09 | observability 仓 | 当前未见 repo | 确认不进 Cargo;trace handoff fake、redaction tests | 使用 fake handoff;configured target 不可用写 failed marker |
| `quantalithos-archive` | repo / service | handoff / downstream seam | PH-08 / PH-09 | archive 仓 | 当前未见 repo | 确认不进 Cargo;archive handoff fake、rerun tests | 使用 fake handoff;archive body 不进入 Work |
| durable DB / search backend | service | P1/P2 production dependency | 不进入 P0 | infra / ops | 未要求 | 无 P0 检查;只检查 in-memory default | 不阻塞 P0;需要前先补设计 / 运维 |
| real event bus / broker | service | P1/P2 production dependency | 不进入 P0 | bus / infra / ops | 未要求 | P0 只检查 fake publisher 和 configured ref validation | 不阻塞 P0;不得 fake production success |
| secret provider / KMS / Vault | service | P1/P2 security dependency | 不进入 P0 | security / ops | 未要求 | P0 只检查 ref-only sensitive 和 raw secret reject | 不阻塞 P0;raw material 禁止入配置 |
| config center / admin override / hot reload | service / feature | P1/P2 config dependency | 不进入 P0 | ops / config platform | 未要求 | P0 启用即 unsupported / fail-fast | 不阻塞 P0;不得作为 P0 能力声明 |

### 7.3 阶段级依赖准备矩阵

| 阶段 | 必须准备 | selected / fake 准备 | 明确不要求 | 失败处理 |
|---|---|---|---|---|
| PH-01 | 目标仓路径、Rust / Cargo、`core-contracts` path、git config、workspace naming、script / artifact / report roots | local-dev / ci-test config fixture skeleton | 真实 DB / MQ / sibling runtime | core 缺失暂停;work 仓缺失则创建 |
| PH-02 | Project / Backlog 相关 core metadata、in-memory store、idempotency config、deterministic clock / id | CORE fixtures、service-core artifact root | member / external resolver | config / store illegal fail-fast |
| PH-03 | identity resolver port、fake resolver、member snapshot fixture、ref-only sensitive validation | integration-like identity configured ref selected | identity production service | fake 可用即可;configured ref 缺失 fail-fast |
| PH-04 | conversation / runtime / governance / method source refs、promote fixture、forbidden body scan | fake event / resolver fixtures、redaction selected | conversation / runtime body、method body、governance body | body 命中阻断;真实 repo 缺失不阻塞 |
| PH-05 | artifact evidence ref fixture、dependency graph data、evidence resolver fake | configured evidence resolver selected | artifact body / artifact lifecycle | missing evidence reject;body 命中阻断 |
| PH-06 | process timebox ref fixture、process resolver fake、concurrency seed config | process timing event selected fixture | process planning truth | non-formal commit 或 process truth write 阻断 |
| PH-07 | query profile、projection store、page / search / trace fixtures、no-write checks | workspace / SDK consumer selected compatibility | workspace UI、advanced board product | query write 或 unauthorized leak 阻断 |
| PH-08 | event / job config、consumer dedup store、fake publisher、fake handoff、operations-replay fixture | configured publisher / handoff selected | real bus、real observability、real archive | fake marker required;configured missing fail-fast;job truth repair 阻断 |
| PH-09 | fixed `run_id`、release config profile、release gates、evidence index、redaction scan、veto checklist | selected integration-like / operations-replay | production deployment / final acceptance裁决 | release redline / VETO / missing EV 阻断 |

### 7.4 配置与环境检查表

| 检查项 | 要求 | 适用阶段 | 检查方式 | 失败处理 |
|---|---|---|---|---|
| `local-dev` profile | defaults + optional JSON / env 可构造 fake / in-memory runtime | PH-01 起 | config smoke | fail-fast,修正 defaults / fixture |
| `ci-test` profile | run-scoped temp dir、deterministic fake adapters、captured logs / reports | PH-01 起 | config-fast / integration-p0 | fail-fast,不得写入固定本地路径 |
| `integration-like` profile | configured ref 可选,缺 ref 时 fail-fast,不可 fallback fake success | PH-03 起 selected | integration-like selected / fake marker check | fail-fast 或 fail-closed |
| `operations-replay` profile | replay bundle、baseline digest、job args、artifact / report root 固定 | PH-08 起 | operations-replay gate | mismatch fail-fast |
| ordinary source priority | `code defaults < JSON config file < environment variables` | PH-01 起 | config tests | 高优先级非法不得回退 |
| entry local args | 只选择 config source 或提供 run-local args | PH-01 / PH-08 / PH-09 | script help / job args validation | 当前入口 / job fail-fast |
| `store.*` | in-memory default,timeout / adapter enum 合法 | PH-01 / PH-02 | config-fast | unsupported fail-fast |
| `boundary.*` | body、page、query timeout 边界合法 | PH-01 / PH-07 | config-fast / api-contract-fast | 非法 fail-fast |
| `idempotency.*` | command / event retention 与 retry window 交叉校验 | PH-02 / PH-08 | service-core / config-fast | 非法 fail-fast |
| `projection.*` | adapter、stale threshold、replace scope 合法且 no-write | PH-07 / PH-08 | query / operations selected | stale / failed marker,不得反写 |
| `jobs.*` | batch、parallelism、retry、timeout 合法 | PH-08 | worker-job-contract | 当前 job fail-fast |
| `external.*` | fake default;configured ref 条件必填;raw secret 禁止 | PH-03 起 | config-fast / resolver tests | configured 缺失 fail-fast;调用失败 unresolved / failed |
| `outbox.*` | fake publisher default;retry / batch 合法;failed marker 可见 | PH-08 | consumer-outbox | publish failure 不回滚 truth |
| `handoff.*` | fake handoff default;configured target ref 条件必填 | PH-08 | worker-job-contract / redaction | handoff failure 写 marker |
| `features.*` | derived views default enabled;advanced search default disabled | PH-01 / PH-07 | config-fast / query tests | unsupported enabled fail-fast |
| ref-only sensitive | JSON / env / args 只允许 ref,不允许 raw secret / token | PH-01 起 | config-redaction / release-config-redline | 任一 raw material 阻断 |
| artifact root | `artifacts/test/<run_id>` | PH-01 起 | path check | 错误路径阻断 |
| report root | `reports/runs/<run_id>` 和 `reports/acceptance` | PH-01 / PH-09 | report path check | 错误路径阻断 |
| no `latest` | 正式证据不引用 `latest` | PH-01 起 | check script / release gate | release evidence 阻断 |

### 7.5 Fake / Mock 使用边界

| fake / mock 对象 | 允许阶段 | 必须表达 | 禁止表达 | 退出 / 升级条件 |
|---|---|---|---|---|
| in-memory repository | PH-01~PH-09 P0 | repository contract、UoW、version、idempotency、rollback | durable DB 产品能力或生产性能 | P1 durable store 专项补设计 / 运维 |
| deterministic clock / id generator | PH-01~PH-09 P0 | 可复现 id / timestamp / digest evidence | 真实时间顺序保证或全局分布式 ID SLA | 需要显式配置时先回写 `03` / `04` |
| fake identity resolver | PH-03 起 | resolved / unresolved / unavailable、safe snapshot ref | identity body、GlobalMember lifecycle | configured identity selected seam |
| fake source / method / governance resolver | PH-04 起 | source ref、safe summary、unresolved / failed | source body、method body、governance truth | configured resolver selected seam |
| fake evidence resolver | PH-05 起 | evidence ref、completion summary、missing / rejected | artifact body、evidence lifecycle | configured artifact selected seam |
| fake process resolver | PH-06 起 | timebox / timing ref、unresolved | process planning truth | configured process selected seam |
| fake publisher | PH-08 起 | outbound event payload、retry、failed marker、fake marker | real broker success、production delivery guarantee | configured publisher selected seam |
| fake handoff adapter | PH-08 起 | trace / archive handoff receipt / failed marker、redaction | global observability store、archive package body | configured handoff selected seam |
| fake replay bundle | PH-08 / PH-09 | rerun idempotency、baseline digest、partial failure | production incident reconstruction | operations-replay selected with sanitized bundle |

fake / mock 总规则:

- fake 必须在 config、report 或 marker 中可识别。
- configured profile 不得在缺 endpoint / credential ref 时自动 fallback fake success。
- fake 可以证明本仓 contract、policy、state、UoW、redaction 和 evidence,不能证明真实外部服务可用。
- fake 产生的证据可作为 P0 本仓验收输入,但不得写成 production integration 通过。

### 7.6 Profile 使用矩阵

| profile | 主要阶段 | 默认 adapter | 必须准备的文件 / 参数 | 证据边界 |
|---|---|---|---|---|
| `local-dev` | PH-01 起 | in-memory + fake + deterministic | optional JSON、entry args、local run id | 只证明本地默认路径,不代表 release |
| `ci-test` | PH-01~PH-09 | in-memory + deterministic fake | test JSON、CI env、temp artifact root | P0 阻断 suite 主 profile |
| `integration-like` | PH-03 / PH-08 / PH-09 selected | configured ref 或 explicit fake marker | JSON / env ref、credential ref、selected run id | 证明接缝配置,不证明真实 production |
| `operations-replay` | PH-08 / PH-09 selected | replay bundle + fake / configured selected | replay JSON、`--replay-bundle-ref`、baseline digest | 证明 rerun / failure marker / no repair |
| `staging-like` | P1 | real-like adapters | 运维部署材料 | 不进入 P0 |
| `production-like` | P1/P2 | production adapters | 09 部署运维材料 | 不进入 P0 |

### 7.7 不可用处理矩阵

| 不可用对象 | 处理策略 | 是否阻断 P0 | 必须记录 |
|---|---|---|---|
| `core-contracts` path | 暂停,补齐 core baseline | 是 | blocker 和 core path / commit |
| 目标实现仓路径 | PH-01 创建 | 否,但必须在 PH-01 完成 | 初始化记录 |
| Rust / Cargo / fmt 工具 | 暂停,补环境 | 是 | toolchain 缺失 |
| sibling repo 缺失 | 使用 fake / fixture / marker | 否 | risk 或 selected seam not_applicable |
| configured adapter ref 缺失 | fail-fast | selected 阻断 | sanitized config error |
| credential provider 不可用 | fail-closed,不得 fake success | selected 阻断 | sanitized failed marker |
| resolver 调用失败 | command reject 或 unresolved / failed marker | 视用例阻断 | resolver outcome |
| publisher / handoff 调用失败 | failed / pending marker,truth 不回滚 | OPS 用例按预期处理;silent success 阻断 | job / outbox report |
| projection rebuild 失败 | stale / rebuilding / failed marker,不反写 | OPS / QUERY selected 阻断 | projection report |
| replay baseline mismatch | current replay job fail-fast | selected 阻断 | baseline digest mismatch |
| config center / hot reload 请求 | unsupported / fail-fast | 不影响 P0,启用即阻断 | unsupported reason |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §8。

````markdown
## 8. 配置、环境与外部依赖准备

> 校准来源:
> - `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“依赖分级规则”“外部依赖准备表”“阶段级依赖准备矩阵”“配置与环境检查表”“Fake / Mock 使用边界”和“不可用处理矩阵”小节,了解实施前和阶段前需要准备哪些环境、配置和外部接缝。

P0 开工前置只要求目标实现仓路径、Rust / Cargo 工具链、`core-contracts` 本地 path dependency、P0 config profile、fake / in-memory adapters、gate / report / check 脚本和固定证据路径。真实 DB / MQ / search / trace / archive、secret provider、config center、admin override、hot reload 和 full production runbook 不进入 P0 开工前置。

唯一允许的编译期 sibling dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

其他 sibling repo 只能通过 port、adapter、event、snapshot、handoff、query、projection 或 fake seam 协作。即使本机存在某个 sibling repo,也不得把它写成 Cargo path dependency。

| 依赖项 | 类型 | 使用阶段 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-work` | 目标实现仓 | PH-01 | 目录和 git repo 检查 | 不存在则 PH-01 创建;不得在其他路径实现 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | 唯一编译期依赖 | PH-01 起 | Cargo path dependency、compile、baseline commit | 缺失则暂停 |
| bus / identity / conversation / method / process / governance / artifact / runtime / workspace / observability / archive | 运行期或事件协作依赖 | PH-03~PH-09 | port / adapter / fixture / fake / selected configured seam | 缺真实仓或真实服务不阻塞 P0;configured 缺 ref 时 fail-fast |
| durable DB / real bus / secret provider / config center / hot reload | P1/P2 production dependency | 不进入 P0 | 无 P0 检查 | 后续专项;P0 不声明完成 |

P0 必须准备并验证以下 profile:

| profile | 用途 | 默认 adapter | 失败处理 |
|---|---|---|---|
| `local-dev` | 本地默认可运行路径 | in-memory + fake + deterministic | 配置非法 fail-fast |
| `ci-test` | 自动化 P0 门禁 | temp dir + deterministic fake | 路径或 redaction 失败阻断 |
| `integration-like` | controlled configured seam | configured ref 或 fake marker | configured 缺 ref fail-fast,不得 fallback fake success |
| `operations-replay` | replay / rerun / recovery evidence | replay bundle + selected adapters | baseline mismatch fail-fast |

fake / mock 使用规则:

- fake 必须有 fake marker。
- fake 可以证明本仓 contract、state、UoW、redaction、evidence 和 failure marker,不能证明真实外部服务可用。
- configured profile 缺 endpoint / credential ref、provider 不可用或 profile 不匹配时必须 fail-fast / fail-closed,不得退回 fake success。
- raw secret、raw token、raw payload、source body、runtime body、archive body 和外部正文不得进入配置、日志、artifact 或 report。

配置和证据路径:

- 原始 artifact: `artifacts/test/<run_id>`
- run report: `reports/runs/<run_id>`
- acceptance handoff: `reports/acceptance`
- 正式证据不得引用 `latest`

任一 boundary 涉及配置、环境或外部接缝时,提交前必须完成对应 profile、adapter、fake marker、redaction、dependency boundary 和 path check。
````

## 9. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续必须继续收口:

- Step 9 将 production-like durable store、secret provider、config center、hot reload、real bus、真实 handoff endpoint 等保留为 P1/P2 风险或 Spike,不得提前进入 P0。
- Step 10 将本步的不可用处理矩阵转成暂停、回退、变更控制和恢复规则。
- Step 11 必须把“非 core sibling repo 不进 Cargo dependency”“configured 不得 fallback fake success”“只提交当前 boundary 文件”写入提交评审纪律。
- Step 12 完成判定必须引用本步的 profile、dependency boundary、redaction 和 evidence path 规则。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 关键依赖均有检查方式和失败处理 | 已满足 |
| 阶段级依赖关系与 Step 5 不冲突 | 已满足 |
| fake / mock 使用边界已明确 | 已满足 |
| repo 类依赖已写本地路径和引用方式 | 已满足 |
| 编译期依赖与运行期 / 事件协作依赖已区分 | 已满足 |
| private git tag / rev 未替代当前本地开发检查 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

用户审核确认后,可以进入 Step 9: 定义 Spike、风险与待确认事项。
