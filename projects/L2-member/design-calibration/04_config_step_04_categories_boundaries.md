# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节：`04-配置设计.md` §4 配置分类与边界
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_04_categories_boundaries.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 4：定义配置分类与禁止配置化边界 |
| 输入 | Step 3 控制面 / 配置域；`03` 架构红线、状态、事务、一致性、审计和安全边界 |
| 输出 | 分类表、禁止配置化表、配置域分类矩阵、停审记录、跨分类审计、§4 回填草稿 |
| 当前状态 | 已完成；允许进入 Step 5 |
| 生效总原则 | P0 不支持 hot reload；所有改变 composition 或安全姿态的配置均为 startup-only。job-run-start 和 entry-local 只在新 job / 当前 entry 的边界内生效。 |
| 持续 blocker | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`；`L2M-UP-005` 下 24 candidate 继续 zero configuration |

## 2. 本步目标与执行边界

本 Step 先定义配置“是什么类别”和“何时生效”，再决定具体配置项。分类必须能够在 Step 7 的配置项表中直接引用，且不得把领域规则、owner truth 或外部成功状态包装成可调开关。

本 Step 只确定：

- `startup`、`job-run-start`、`entry-local`、`sensitive-ref`、`diagnostic-redaction`、`test-fixture-deterministic`、`feature-peripheral` 等类别的含义；
- P0 的冷更新边界和不支持 hot/reload 的结论；
- 每个配置域适用 / 不适用的类别；
- 禁止配置化项目、违反时的受控变更路径和 fail-closed 处理。

本 Step 不确定最终 key、默认值、来源优先级、环境 profile、secret provider、部署命令、具体热更新实现或产品。

## 3. 本步输入

| 输入 | 本 Step 的使用方式 |
|---|---|
| `04_config_step_03_control_plane.md` | 提供控制面、功能域、读取 / 注入责任和 zero-configuration publication seam |
| `04_config_step_02_scope.md` | 提供 P0/P1/P2 取舍和 non-project subject / 24 candidate 红线 |
| `03-详细设计.md` §3～§13 | 提供双锚、模块依赖、状态、UoW/CAS、Query no-write、配置绑定和 external seam 边界 |
| `03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_13_concurrency_idempotency.md` | 提供状态迁移、append-only、事务、幂等、并发和 unknown fence 的不可配置化依据 |
| `03_ddd_step_15_observability_audit.md` | 提供 redaction、safe telemetry、审计不变量和禁止字段依据 |
| Runtime / Tools / Core / Bus / sibling 当前材料 | 只确认 owner / blocker；不引入外部 policy、schema、route 或 readiness 开关 |

## 4. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 有哪些配置类别？ | 采用七类可配置语义：`startup`、`job-run-start`、`entry-local`、`sensitive-ref`、`diagnostic-redaction`、`test-fixture-deterministic`、`feature-peripheral`；另设 `static-invariant` 作为“明确不是配置”的审计标签。 |
| 哪些配置允许热更新？ | P0 没有 `hot` 或无审计的 `reload` 配置。startup 配置须重启；job-run-start 只影响下一次 job invocation；entry-local 只影响当前已授权 entry；diagnostic / feature 也不自动热更新。未来若需要 hot/reload，必须先完成 03 影响判定、Step 9/10/11 的校验 / 回滚 / 失效设计和正式变更批准。 |
| 哪些属于敏感配置？ | 真实 secret、password、private key、raw token 永远不是普通配置值；普通配置只允许 opaque secret / endpoint / credential ref，归 `sensitive-ref`，由 Step 8 收口。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化？ | 双锚与 subject guard、truth owner、screening / policy owner、body-free、状态迁移、UoW/CAS、typed replay、Query no-write、projection 单向边界、Unknown fence、Core-only compile、24 candidate blocked 状态和外部 accepted/delivered/observed 语义均禁止配置化。 |
| 禁止项如需改变走什么流程？ | 先暂停 04 当前域，创建针对性 03 回开项；由拥有该规则的需求 / 架构 / 详细设计或上游 owner 更新正式契约和 calibration，再重新审查 04、05、06、07。禁止用 feature flag、profile、admin override 或环境变量绕过。 |
| 每域哪些类别适用？ | composition / stores / technical / boundaries / registry 主要是 startup；jobs 主要是 job-run-start；entry boundary 可接受 entry-local 限制；credentials 只接受 sensitive-ref；diagnostics 只接受 diagnostic-redaction；fixtures 只接受 test-fixture-deterministic；optional outlet / export 只接受 feature-peripheral。 |
| 是否有配置类别遗漏或互相冲突？ | 已完成跨分类审计：任何项只能有一个主生效类别，敏感性是正交标签但不能改变生效时机；`static-invariant` 不得落入配置项清单。当前无 unresolved 分类冲突。 |

## 5. 当前文档问题诊断

| 位置 / 材料 | 问题 | 本 Step 修正 |
|---|---|---|
| Step 3 控制面 | 已知道控制面，但尚未区分何时生效、能否变更 | 为每个控制面定义主分类和更新边界 |
| 旧 README / 旧 `05/06` | 暗示 runtime flag、动态 endpoint、retry / topic / launch token 等可配置 | 逐项归入历史污染或禁止配置化，不继承 |
| `03` §13 | 逻辑 config ref 未标注类别 | 以 section / slot 的生效时机补充分类，不改变 carrier |
| external seams | 容易把 availability 当成外部成功开关 | 将 availability 归 startup / feature-peripheral，保留 blocked / unavailable 语义 |
| 正式 `04` | 尚不存在 | 只形成 §4 回填草稿，暂不写正式正文 |

## 6. 配置类别总表

| 配置类别 | 说明 | 示例（逻辑语义） | 是否允许热更新 | 主要风险 | 默认生效边界 |
|---|---|---|---:|---|---|
| `startup` | 启动时选择 profile、Store / technical slot、resolver / handoff availability、registry posture | `composition.profile`、logical Store binding、Clock / ID slot | 否 | 重启后 composition 变化或暴露错误 slot | 启动校验成功后，对新建 runtime 生效 |
| `job-run-start` | 在一次 Job invocation 开始时读取已校验的 runner 策略 | batch / scope / retry category / timeout category | 否（不影响运行中 job） | 中途改变计数、重试或 report 语义 | 仅下一次 job-run |
| `entry-local` | 受控 entry 的边界限制或 safe selector，不能改变业务规则 | command body limit、query page limit、safe surface selector | 否（不支持隐式动态覆盖） | 入口差异造成安全门禁不一致 | 当前 entry，且必须来自 validated boundary |
| `sensitive-ref` | 只表示 opaque credential / endpoint / secret reference，不承载 raw secret | host credential ref、resolver endpoint ref、handoff credential ref | 否（轮换由受控 secret provider 处理） | 泄露、错误 owner、旧 ref 继续使用 | 启动或新 job-run 按 slot 读取；具体机制留 Step 8/9 |
| `diagnostic-redaction` | 定义安全诊断字段和禁止输出类别 | safe field allowlist、redacted issue posture、low-cardinality label set | 否 | 诊断泄露 body / secret / identity | 启动后对本地诊断生效 |
| `test-fixture-deterministic` | 仅用于测试 builder 的 deterministic fake / fixed clock / fixed ID / replay fixture | in-memory Store、fake resolver、deterministic Clock / ID | 不适用于生产 | fake 被误当作真实集成或 readiness 证据 | test assembly / test case |
| `feature-peripheral` | 可裁剪的外围能力姿态，不影响核心 mutation truth | optional summary outlet、projection view、external export / handoff posture | 否 | 关闭外围能力被误报为核心失败，或反之 | 启动 / 下一次外围 job |
| `static-invariant`（非配置） | 设计不变量和安全 / 一致性规则，仅作为审计标签 | double anchor、state transition、Query no-write、body-free | 不适用 | 被 profile / env / flag 绕过 | 设计版本固定；改变需受控回开 |

## 7. 生效时机与变更边界图

#### 配置加载流程图：L2-member 配置类别生效边界

```text
[startup sources]
  -> [parse / validate / redact]
  -> [startup composition]
  -> [new runtime / new entry]

[job-run-start posture]
  -> [validate before invocation]
  -> [one job invocation only]

[entry-local typed limit]
  -> [metadata / boundary guard]
  -> [current authorized entry only]

[sensitive-ref]
  -> [controlled provider lookup]
  -> [slot use; raw secret never enters domain]

[diagnostic-redaction]
  -> [safe local diagnostics]

[test-fixture-deterministic]
  -> [test-only builder]

[feature-peripheral]
  -> [optional local surface / blocked handoff]
```

关键说明：

- P0 没有自动 hot reload；图中的“生效”不是 admin override 或在线配置中心。
- job-run-start 不得修改已开始 job 的 batch、retry 或 report 语义；entry-local 不得跳过 metadata、visibility 或 idempotency guard。
- sensitive-ref 只携带 opaque reference；Step 8 定义 provider、轮换和禁止输出，不能把 raw secret 写入 config ref。
- feature-peripheral 只能改变可选 surface / handoff availability，不能改变 CP01～CP05 核心 truth。

## 8. 禁止配置化项表

| 禁止配置化项 | 依据 / 原因 | 如需改变的受控流程 | 当前处理 |
|---|---|---|---|
| `ProjectMemberRef + GlobalMemberRef` 双锚、matching guard、非 project subject | `03` §3、`L2M-UP-008`；执行主语和身份边界 | 回开需求 / 架构 / 03 subject contract，更新 owner authority | validation reject；只保留 project-scoped 双锚 |
| truth owner、local / support / derived-read ownership | `00~03` 数据所有权；配置不能转移责任 | 先修改正式 owner / data ownership 设计 | 不提供 owner selector |
| screening / policy taxonomy、allowlist / denylist、authorization / approval truth | `L2M-UP-007`；member 只消费 safe result | 由 Governance / safety owner 发布正式结果并回开相关 Step | unknown 保守阻断；不设本地 default-pass |
| body-free、forbidden-body、raw external body、prompt / plan / tool content | `03` 安全和数据边界 | 重新评审数据归属和安全设计 | schema / validation reject；redaction 不可关闭 |
| Runtime loop / context / plan / outcome、LLM、memory、checkpoint、tool execution、capability registry | 明确非本仓职责 | 变更范围与上游 owner 合同，不在 04 加开关 | 不提供配置入口 |
| host lifecycle / registry / health、image build / release / sandbox truth | sibling / host owner truth | 由 member-service / member-images 正式契约和 ADR 变更 | 仅 availability / ref / blocked seam |
| Command / Consumer / Job metadata、idempotency key、canonical digest、typed replay | 协议和重放不变量 | 先回开 `03` protocol / flow / persistence contract | 不允许 disable / best-effort 降级 |
| UoW 顺序、expected version、CAS、append-only、状态迁移 | `03` Step 10/11/13 | 受控修改状态 / persistence 设计并重审所有 flows | 不提供 transaction bypass |
| Query no-write、projection / mirror 单向边界 | 防止读路径修复真相 | 回开 query / persistence / flow 设计 | query guard 固定；配置不能触发 refresh / rebuild |
| `Blocked` / `Waiting` / `Unknown` / `Stale` / `Gap` 语义及 unknown-side-effect fence | 未闭合依赖的保守契约 | 由对应 upstream contract 关闭后重审 | 不得 default-pass 或 silent fallback |
| 24 outbound semantic candidates 的 materialization、event / publisher / outbox / topic / route / retry / DLQ / delivery receipt | `L2M-UP-005` 未闭合 | Core / Bus 正式 schema、route、owner 合同后定向重开 03/04 | zero configuration |
| Core-only compile / Cargo dependency 分类 | 运行期关系不能由 profile 变 package dependency | 修改架构依赖裁决并更新 03 | validation / implementation gate reject |
| external accepted / delivered / observed / healthy / ready 结论 | 外部 owner truth 不在 member | 由 owner feedback / formal evidence 提供，不能在 04 生成 | 只保存 local attempt / gap / marker |
| 审计链、append-only history、redaction deny list、metric low-cardinality 规则 | 安全和审计完整性 | 先回开 observability / security design | 禁止 debug / feature flag 绕过 |

违反任一禁止项时，系统必须拒绝该配置或使相关操作保持 `Blocked` / `Unknown`；不能退回低优先级默认值，也不能以 fake、私有 map、旧 transport 或字符串值伪装通过。

## 9. 配置域分类边界矩阵

| 配置域 | 适用类别 | 不适用类别 | 固定禁止项 | 03 绑定 / 读取者 |
|---|---|---|---|---|
| `composition` | startup、sensitive-ref（仅 opaque ref） | job-run-start、entry-local、test fixture、hot | subject、owner、外部 readiness | `MemberRuntimeConfigRef`; `infra/config.rs` / builder |
| `stores.truth` / `stores.support` / `stores.projection` / `stores.continuation` | startup、sensitive-ref（如有受控 ref） | entry-local、diagnostic、feature flag、hot | truth owner、schema、UoW/CAS、Query no-write | `MemberStoreConfigRef`; builder / Store adapters |
| `stores.idempotency` | startup、job-run-start（清理策略只影响新 job） | entry-local、hot、feature disable | replay / reservation 语义、未完成 relation | `MemberStoreConfigRef`; idempotency / result Store |
| `technical` | startup、test-fixture-deterministic | job-run-start、entry-local、hot | domain 自生成 ID / time / digest | `MemberAdapterConfigRef`; technical Port |
| `command_boundary` | startup、entry-local | job-run-start、feature-peripheral、hot | metadata、actor、double anchor、idempotency | boundary config; API / application |
| `query_boundary` | startup、entry-local、feature-peripheral（只裁剪 read surface） | sensitive-ref、job-run-start、hot | Query no-write、visibility、freshness truth | boundary / projection config; API / read model |
| `consumer` | startup、sensitive-ref、feature-peripheral（disabled / unavailable） | entry-local、hot | envelope identity、owner policy、external event→command | worker consumer composition |
| `projection` | startup、job-run-start、feature-peripheral | entry-local、hot | current / available 直接声明、反写真相 | projection config / rebuild job |
| `jobs` | startup、job-run-start、sensitive-ref | entry-local、hot | scheduler truth、盲重试、duplicate mutation | Job config / jobs runner |
| `resolvers` | startup、sensitive-ref、feature-peripheral | entry-local、hot | generic resolver、foreign body、default-pass | owner-specific resolver Port |
| `handoff` | startup、sensitive-ref、feature-peripheral、job-run-start（新 handoff job） | entry-local、hot | accepted / delivered / observed、24 candidate publication | handoff Port / blocked seam |
| `registry` | startup、feature-peripheral | job-run-start、entry-local、hot | listener / process / route / health / scheduler | logical registry state |
| `diagnostics` | startup、diagnostic-redaction、test-fixture-deterministic | feature flag 关闭 redaction、hot | raw secret / body / high-cardinality label | safe diagnostics / redaction hook |
| `fixtures` | test-fixture-deterministic | 所有 production 来源和类别 | blocker 关闭、integration evidence、readiness | test-only builder |
| `publication_blocked` | static-invariant、diagnostic-redaction（blocked marker） | startup publisher、job retry、feature activation | event / publisher / outbox / route / receipt | `L2M-UP-005` blocked candidate boundary |

## 10. 分类边界停审记录

| 配置域 / 禁止项 | 类别是否唯一 | 更新边界 | 禁止项可执行性 | 03 影响 | 结论 |
|---|---:|---|---|---|---|
| composition / stores | 是 | startup-only | validator 可拒绝 owner / truth / state 改写 | 无 | 通过 |
| technical / idempotency | 是 | startup；清理策略仅新 job | missing slot / replay bypass 可 fail-fast | 无 | 通过 |
| command / query boundary | 是 | startup + entry-local typed limit | metadata / no-write guard 固定 | 无 | 通过 |
| consumer / projection | 是 | startup；新 job-run | external event、current / available 不可由配置声明 | 无 | 通过 |
| jobs | 是 | startup + job-run-start | unknown / conflict 不盲重试 | 无 | 通过 |
| resolvers / handoff | 是 | startup + sensitive-ref；新 handoff job | blocked / waiting / unknown 保留 | 无 | 通过 |
| registry / feature-peripheral | 是 | startup / 新外围 job | logical registration 不等于 process / readiness | 无 | 通过 |
| diagnostics / redaction | 是 | startup-only | deny list 不能被 debug flag 关闭 | 无 | 通过 |
| test fixtures | 是 | test-only assembly | 不进入生产来源 | 无 | 通过 |
| static-invariant 禁止项 | 不适用（非配置） | 设计版本级 | 违反即拒绝 / 回开 | 无 | 通过 |

## 11. 跨分类 / 禁止项审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 hot reload | 通过 | 明确不支持；未来需求须重新走 03/04/05/06/07 影响审计 |
| sensitive-ref 是否可能承载 raw secret | 通过 | 只允许 opaque ref；raw secret 由 Step 8 provider 读取，不进入普通 config object |
| job-run-start 是否改变运行中 job | 通过 | 只在 invocation 开始时绑定；运行中保持快照 |
| entry-local 是否能绕过安全元数据 | 通过 | 只接受 validated limit / selector；metadata、actor、visibility、idempotency 固定 |
| feature-peripheral 是否能关闭核心 mutation | 通过 | 只影响 optional surface / handoff；CP01～CP05 truth 不受影响 |
| diagnostic-redaction 是否可被 debug / profile 关闭 | 通过 | deny list 和 forbidden field rejection 是 static-invariant |
| test fixture 是否可能成为生产 fallback | 通过 | test-only builder；生产 profile 不继承 fixture source |
| 24 candidate 是否被错误分类为 feature / job publication | 通过 | 标记为 static-invariant blocked seam；zero configuration |
| forbidden item 是否有正式变更路径 | 通过 | 先回开 owning 00/01/02/03 或 upstream contract，再重审 04～07 |
| 是否产生新 runtime config / Port / error / flow | 未发现 | 仅增加分类标签和生效语义；当前无 03 回写 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| P0 不支持 hot reload；startup / job-run-start / entry-local 采用边界生效 | 否 | 配置生效语义细化，不改变既有 carrier / flow | `03` §13 已有逻辑 binding | 无回写 |
| sensitive-ref 只承载 opaque reference，raw secret 不进入应用 / domain | 否 | 承接已有 body-free / config isolation | `03` §13 / Step 14 已有 | 无回写 |
| diagnostic-redaction 与 static-invariant deny list 不可关闭 | 否 | 承接 observability / redaction boundary | `03` §14 已有 | 无回写 |
| 24 candidate 归为 blocked static-invariant，zero configuration | 否 | 承接 `L2M-UP-005` | `03` §7、§13 已有 | 无回写 |
| 未来若引入 hot/reload、admin override、动态 policy 或新分类导致 builder / Port / error / flow 变化 | 是 | 代码契约或 owner / safety 语义变化 | `03` §4～§13 与 owning calibration Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前没有实际“待回写”或“阻塞待确认”项；未来触发器不作为正式配置项。

## 13. 回填草稿：正式 `04-配置设计.md` §4

> 校准来源：
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“配置类别总表”“禁止配置化项表”“配置域分类边界矩阵”“分类边界停审记录”和“跨分类 / 禁止项审计表”。

正式 §4 应收口为：

1. 配置类别分为 `startup`、`job-run-start`、`entry-local`、`sensitive-ref`、`diagnostic-redaction`、`test-fixture-deterministic` 和 `feature-peripheral`；`static-invariant` 只表示不可配置的设计规则。
2. P0 不支持自动 hot reload；startup 配置需通过校验后重启生效，job-run-start 只影响下一次 job，entry-local 只作用于当前已授权 entry，test fixture 仅在测试装配中使用。
3. sensitive 配置只能是 opaque secret / endpoint / credential reference；raw secret、外部正文、owner truth 和 external success 不进入配置对象。
4. 双锚、truth owner、screening / authorization、body-free、状态迁移、UoW/CAS、typed replay、Query no-write、Unknown fence、Core-only compile、外部 accepted/delivered/observed 语义以及 `L2M-UP-005` 下 24 candidate 的 blocked 状态均禁止配置化。
5. 任何禁止项变更必须回开对应正式设计或上游 owner contract，并重新审查 04～07；不得使用 feature flag、profile、admin override 或环境变量绕过。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 是否未来需要 hot / reload | 影响 Step 9 校验、Step 10 回滚和 Step 11 LKG 策略 | P0 明确不支持；若提出需求则回开分类和 03 影响 |
| sensitive-ref 的 provider、轮换和 endpoint owner（`L2M-UP-001/002/006`） | 影响 Step 8 / 9 的详细安全绑定 | 只保留 opaque ref / blocked / not-available |
| `L2M-UP-007` policy taxonomy | 影响 resolver / consumer 分类 | 只消费正式 safe result；不配置本地 allowlist / denylist |
| `L2M-UP-005` member event schema / route | 影响 publication 分类 | `publication_blocked` 继续 static-invariant zero configuration |
| 物理 Store、scheduler、transport 和 observability 产品 | 影响具体 profile / values | 保持 product-neutral；不把 fake / local Ready 当生产 |

## 15. 进入 Step 5 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 配置类别定义完成 | 通过 | §6 |
| startup / job-run-start / entry-local 生效边界明确 | 通过 | §7、§9 |
| P0 hot reload 边界明确 | 通过 | §4、§6、§11 |
| 禁止配置化项完整且有变更流程 | 通过 | §8 |
| 每个配置域适用 / 不适用类别已列 | 通过 | §9 |
| 分类停审与跨分类审计完成 | 通过 | §10、§11 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 4 完成。下一步允许创建 `04_config_step_05_sources_priority_conflicts.md`，固定来源覆盖顺序、冲突处理、secret ref 覆盖限制和来源不可用策略。

```text
step_04 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_05_sources_priority_conflicts
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
