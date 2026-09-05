# Step 3. 建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节：`04-配置设计.md` §3 配置控制面总览
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_03_control_plane.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 3：建立配置控制面总览 |
| 输入状态 | Step 1、Step 2 已完成；正式 `00~03` 和 `03` Step 14 已核对 |
| 输出 | 本文件；正式 `04` §3 回填草稿；控制面与配置域审计 |
| 当前状态 | 已完成；按“完成全部 04”授权继续下一 Step |
| 停审方式 | 本 Step 结论锁定后才允许创建 Step 4；不在本文件定义最终 key、值、来源优先级或部署动作 |
| 持续 blocker | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`；`L2M-UP-005` 继续阻断 24 个 outbound semantic candidate |

## 2. 本步目标与执行边界

本 Step 将 Step 2 的 P0/P1/P2 范围组织成可审查的配置控制面和功能配置域，回答配置从哪里进入、在哪里校验、由谁装配、哪些模块可以接收以及哪些领域不变量永远不受配置影响。

本 Step 只确定：

- 来源类型和覆盖链的结构预览；
- 唯一 raw-config 读取模块和唯一 composition root；
- validated ref、availability marker、blocked seam 的注入边界；
- 配置控制面、配置域、对应详细设计绑定点以及允许 / 禁止能力；
- 每个配置域的停审和跨控制面审计结果。

本 Step 不确定：具体 key、默认值、JSON schema、环境变量名称、最终来源优先级、secret provider、产品、endpoint、topic、route、retry 数值、部署命令或实际运行事实。

## 3. 本步输入

| 输入 | 用途 | 效力 / 限制 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 上游输入、历史污染和 blocker 边界 | 已确认的输入映射；不替代正式 `00~03` |
| `04_config_step_02_scope.md` | P0/P1/P2、范围 / 非范围和无配置路径裁决 | 本 Step 的范围基线 |
| `projects/L2-member/03-详细设计.md` §3～§13 | 模块、Store、Port、runtime config、builder、错误与依赖边界 | 当前正式代码契约；04 不静默新增契约 |
| `03_ddd_step_14_configuration_external_bindings.md` | raw-read、validated refs、builder、logical slot 和依赖分类 | 直接配置绑定输入 |
| `03` §14～§17 及对应 calibration | redaction、planned test cut、实施承接和风险 | 只提供设计级输入，不构成测试或实现事实 |
| 当前 Runtime、Tools、Core、Bus、Identity、Conversation、Governance、Artifact 和 sibling 材料 | owner / seam 方向 | exact schema、endpoint、release、route 和 readiness 仍 pending |

## 4. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 当前系统配置从哪些来源读取？ | 来源结构预览为 `code defaults -> strict JSON file -> allowlisted environment selectors / opaque refs -> controlled secret refs`；test fixture 仅属于 test-only 装配，不进入 production 覆盖链。最终优先级和冲突规则留 Step 5。 |
| 配置进入系统的唯一或主要装配入口是什么？ | `infra/config.rs` 负责读取、解析、校验和脱敏，产生 `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef`、provenance 与 redacted issue；`infra/runtime_builder.rs` 是唯一 composition root，将其绑定到 Port、logical registry、availability 或 blocked seam。 |
| 哪些模块可以读取配置？ | 只有 `infra/config.rs` 读取 raw config；`infra/runtime_builder.rs` 读取 validated refs。`api`、`worker`、`jobs` 只接收已校验的 boundary / runner posture；`application` 只接收 Port 和 typed 参数；`domain`、`contracts` 不读取配置。 |
| 配置控制哪些行为？ | 控制 member-local composition、logical Store/UoW/idempotency/result、Clock/ID/digest slot、Command/Query boundary、Consumer posture、projection/read surface、Job runner、owner-specific resolver、handoff availability、logical registry、redacted diagnostics 和 test fixture。 |
| 配置不能控制哪些行为？ | 不能改变双锚、truth owner、screening/policy owner、body-free、Runtime loop/context/plan/outcome、Tool execution、capability registry、状态迁移、CAS/UoW、typed replay、Query no-write、Unknown fence、local/external truth 分层或 `L2M-UP-005` 下 24 candidate 的 blocked 状态。 |
| 配置变化会影响哪些下游？ | 给正式 04 Step 4～14 提供边界；给未来 05 提供 profile / negative configuration cuts；给 06 提供 configuration gates；给 07 提供 planned binding 顺序；给 09 提供挂载、secret、真实 endpoint 和回滚操作输入。下游不得反定义本控制面。 |
| 应拆成哪些控制面？ | 采用十一个功能控制面：composition/provenance、local consistency stores、technical identity、command/query boundary、consumer/projection、operations jobs、owner resolvers、handoff availability、logical registry、diagnostics/redaction、test fixture/replay。outbound publication 作为明确的 blocked seam 子域单列，不生成正向事件配置。 |
| 每个配置域如何回指详细设计？ | 每域必须指向 `03 §13` 的 config ref、`infra/config.rs`、`infra/runtime_builder.rs`、Step 7 Port / Store、worker / jobs entry 或明确的 external blocker；若需要新增 carrier、Port、constructor、error、DTO 或 flow，必须回开 03。 |
| 是否完成域级停审？ | 完成。每域均检查来源、允许能力、禁止能力、装配目标、P0/P1/P2 范围和 03 影响；当前无新增 03 回写项。 |
| 是否存在控制面重叠或遗漏？ | 已完成跨控制面审计。Store 归 local consistency，runner 归 jobs，source 归 resolver，handoff 归 availability，redaction 归 diagnostics；24 candidate 明确保持 zero configuration。 |

## 5. 当前文档问题诊断

| 位置 / 材料 | 问题 | 本 Step 处理 |
|---|---|---|
| Step 2 范围表 | 有优先级但缺少控制面总览 | 建立控制面和功能域映射 |
| `03` §13 | 绑定点按代码位置列出，未按配置治理视角分组 | 保留代码边界并增加功能控制面索引 |
| 旧 README / 旧 `05/06` | 将 transport、DB、endpoint、指标和部署假设混在配置方向中 | 作为历史污染，只保留差异审计，不进入控制面 |
| 兄弟仓与 Runtime / Bus | exact owner contract 未闭合 | 以 logical slot、blocked / waiting / unavailable 表达，不写 positive activation |
| 正式 `04` | 尚不存在 | 只生成本 Step 中间产物和 §3 回填草稿 |

## 6. 配置来源链图

#### 配置来源链图：L2-member 配置覆盖链

```text
[code defaults]
        |
        v
[strict JSON file]
        |
        v
[allowlisted environment selectors / opaque refs]
        |
        v
[controlled secret refs]
        |
        v
[infra::config.rs: load -> parse -> validate -> redact]
        |
        v
[validated refs + provenance + redacted issue refs]
        |
        v
[infra::runtime_builder.rs: composition root]
        |
        +--> [local Store / UoW / idempotency / typed-result]
        +--> [Clock / ID / digest technical slots]
        +--> [Command / Query / Consumer / projection / Job posture]
        +--> [owner resolver / handoff / registry slots]
        +--> [blocked / unavailable / test-only seam]
        |
        v
[application Ports and named services]
        |
        +--> [api]
        +--> [worker]
        +--> [jobs]
```

关键说明：

- 图表达配置来源和装配方向预览，不表达最终优先级、部署命令或产品。
- 普通来源只能提供 selector、typed scalar 或 opaque ref；raw secret 由 Step 8 单独收口。
- `test fixture` 只在 test-only builder 中出现，不可借此声明 production 或 integration readiness。
- `domain`、`contracts` 和普通 `application` 代码不读取 raw config，也不保存 endpoint、topic、credential 或外部正文。
- `L2M-UP-005` 前不生成 event、publisher、outbox、topic、route、retry、DLQ 或 delivery receipt 配置。

## 7. 配置控制面总表

| 控制面 | 主要作用 | 对应模块 / 入口 | P0 | P1 / P2 方向 | 禁止越过的边界 |
|---|---|---|---:|---|---|
| composition / provenance | 选择 profile、保留来源可解释性、汇总 validation issue | `infra/config.rs`、`infra/runtime_builder.rs` | 是 | 后续 profile 演进 | 不以 provenance 改写 owner truth 或状态 |
| local consistency stores | 绑定 CP01～CP07 logical Store、UoW、CAS、idempotency/result carrier | `infra/*_store.rs`、application UoW | 是 | durable realization / backend 选择 | 不改变 schema owner、UoW 顺序、CAS 或 replay 语义 |
| technical identity | 注入 Clock、ID、digest 等技术 slot | `infra` technical adapter、application Port | 是 | 受 authority 证明的实现优化 | 不由 handler/domain 自行生成 ID、时间或 digest |
| command / query boundary | 输入大小、分页、freshness 和 safe boundary posture | `api` entry、application boundary | 是 | 资源精调 | 不关闭 metadata、visibility、authorization 或 Query no-write |
| consumer / projection posture | Consumer dedup、mirror/projection freshness 和 availability | `worker`、projection Store、read service | 是 | source-driven activation | 不把 external event 当 command，不让 Query 写 truth |
| operations jobs | rebuild、refresh、reconcile、handoff、archive、export runner 的可用性及策略类别 | `jobs`、worker maintenance | 是 | scheduler / product binding | 不由 Job 修复核心 truth或盲重放 mutation |
| owner resolvers | Work / Identity / Governance / Tools / Method 等 owner-specific source resolver | application-owned resolver Port、infra adapter | 是（保守） | contract-gated positive binding | 不建立 generic resolver、不保存 foreign body、不默认放行 |
| handoff availability | host、Runtime、publication、observation、archive / export seam 的 availability | blocked seam、handoff Port | 是（保守） | exact owner contract 后激活 | 不把 local attempt 升格 accepted/delivered/observed |
| logical registry | API、worker、Job 的 logical registration posture | builder → registry state | 是 | 未来 host assembly 方向 | 不创建 listener、process、scheduler、health 或 route |
| diagnostics / redaction | safe config issue、日志字段、低基数 telemetry posture | `infra` diagnostics、observability hooks | 是 | backend / alert product | 不输出 raw config、secret、body、endpoint 或高基数身份 |
| test fixture / replay | deterministic fake、fixture source、typed replay harness 的装配边界 | test-only builder、idempotency/result slots | 是（测试） | parity / integration-like profile | 不把 fake 当真实依赖、证据或 readiness |
| outbound semantic publication | 仅标记 24 candidate 的 blocked / zero-config 状态 | `contracts` candidate、blocked seam | 否（当前禁止正向配置） | 待 `L2M-UP-005` 后重新审计 | 不生成 publisher/outbox/topic/route/retry/DLQ |

## 8. 配置域 / 功能模块总表

| 配置域 / 功能模块 | 来源控制面 | 详细设计绑定 | 允许配置的能力 | 禁止控制的能力 | 当前优先级 |
|---|---|---|---|---|---|
| `composition` | composition / provenance | `MemberRuntimeConfigRef`、`runtime_builder.rs` | profile 选择、validated ref 组合、来源标识 | raw config 下沉、第三执行主语、外部 readiness | P0 |
| `stores.truth` | local consistency stores | CP01～CP05 local truth Store、UoW | 选择 logical truth adapter / availability | truth owner、schema、CAS、transaction ordering | P0 |
| `stores.support` | local consistency stores | CP06 mirror / support Store | 选择 support snapshot / resolution adapter | 保存 foreign body、unresolved 自动成立 | P0 |
| `stores.projection` | local consistency stores | CP07 projection Store / rebuild | 选择 read projection 承载、stale posture | Query 写 truth、projection 反写 source | P0 |
| `stores.continuation` | local consistency stores | attempt / gap / feedback continuation Store | 承载 local attempt、gap、report relation | 伪造 delivery / acceptance、unknown 盲重发 | P0 |
| `stores.idempotency` | local consistency stores | reservation、typed result / receipt / report Store | replay carrier / retention 类别 | 关闭 replay、删除未完成关系 | P0 |
| `technical` | technical identity | Clock / ID / digest Port | 注入 deterministic 或运行态技术 adapter | domain 自生成技术值、用 retry 生成第二 ID | P0 |
| `command_boundary` | command / query boundary | API command entry、typed boundary config | 输入尺寸 / cardinality / timeout 类别 | 绕过 metadata、actor、double anchor 或 idempotency | P0 |
| `query_boundary` | command / query boundary | API query entry、read services | page / freshness / safe surface posture | query write、refresh、rebuild、reconcile 或 handoff | P0 |
| `consumer` | consumer / projection posture | worker Consumer envelope、receipt Store | source namespace / dedup posture / unavailable marker | 本地 allowlist 代替 owner policy、external event 变 command | P0（保守） |
| `projection` | consumer / projection posture | read model、projection rebuild Job | freshness / activation posture、safe stale surface | 直接声明 current / available、修复 core truth | P0（保守） |
| `jobs` | operations jobs | 五类 Job runner、metadata / report | runner availability、batch / retry 类别 | scheduler truth、盲重试、mutation duplicate | P0 |
| `resolvers` | owner resolvers | source-specific resolver Ports | owner-specific adapter / blocked seam | generic provider、foreign body、本地 default-pass | P0（保守） |
| `handoff` | handoff availability | host / Runtime / publication / observation Ports | availability、attempt / gap posture | accepted/delivered/observed、external truth反写 | P0（保守） |
| `registry` | logical registry | API / worker / Job registry state | logical entry enablement | listener、route、process、health、scheduler | P0 |
| `diagnostics` | diagnostics / redaction | config issue、safe telemetry、redaction hook | safe allowlist / denylist、diagnostic ref | raw secret、foreign body、高基数标签 | P0 |
| `fixtures` | test fixture / replay | deterministic fake builder、typed replay harness | test-only fake、fixed clock / ID、fixture selector | 生产覆盖、blocker 关闭、evidence / readiness | P0（仅测试） |
| `publication_blocked` | outbound semantic publication | 24 candidate boundary | 仅记录 blocked reason / safe metric | event、publisher、outbox、topic、route、retry、DLQ、receipt | zero configuration |

## 9. 模块读取与注入责任

| 层 / 模块 | 可读取内容 | 注入方式 | 明确禁止 |
|---|---|---|---|
| `infra/config.rs` | raw JSON、allowlisted env selector、opaque ref、受控 secret ref | 输出 validated refs、provenance、redacted issue | 向外泄露 raw secret、body、endpoint 或未校验值 |
| `infra/runtime_builder.rs` | validated section refs 和 availability 输入 | 构造 Store、UoW、technical Port、resolver / handoff seam、logical registry | 生成业务事实、修改状态矩阵或把 slot Enabled 当 external success |
| `application` | typed boundary、Port、local/support truth、safe policy result | named service / facade 参数 | 读取文件/env、保存 raw config、调用 concrete adapter |
| `domain` | 显式 typed value、local/support truth | factory / transition 输入 | 读取 config、clock、transport、DB、Bus、外部正文 |
| `contracts` | public carrier 定义所需 shared primitive | DTO、ref、metadata、receipt、report | 定义 topic/route、外部 payload、secret 或 publisher |
| `api` | command/query metadata 与已校验 boundary | 调用 facade / named service | 重读 config、直连 Store、构造 ID / digest、执行 domain transition |
| `worker` | Consumer / feedback envelope 与 registry posture | 调用 facade / Consumer service | 将 external event 当 command、直接写 core truth、重读 env |
| `jobs` | logical Job metadata、runner posture | 调用 named job service | 自行构造 scheduler truth、盲重试 mutation、重读 config |

## 10. 配置控制面停审记录

| 配置域 | 来源链 | 允许能力 | 禁止能力 | 03 影响 | 结论 |
|---|---|---|---|---|---|
| composition / provenance | 已明确 | profile、validated ref、redacted issue | raw / external success | 无 | 通过 |
| truth / support / projection / continuation stores | 已明确 | logical adapter 与 availability | truth/schema/CAS/no-write 改写 | 无 | 通过 |
| idempotency / typed result | 已明确 | reservation / replay carrier 承载 | 关闭 replay、删除未完成关系 | 无 | 通过 |
| technical identity | 已明确 | Clock / ID / digest slot | domain 自生成、retry 第二 ID | 无 | 通过 |
| command / query boundary | 已明确 | 安全边界尺寸、分页、freshness posture | actor、visibility、Query no-write 绕过 | 无 | 通过 |
| Consumer / projection | 已明确 | dedup、stale / unavailable posture | external event 变 command、Query 修 truth | 无 | 通过 |
| jobs | 已明确 | runner availability、策略类别 | scheduler truth、盲重试、修 core truth | 无 | 通过 |
| resolvers | 已明确 | owner-specific adapter / blocked seam | generic resolver、foreign body、default-pass | 无 | 通过 |
| handoff / publication / observation | 已明确 | local attempt / gap、availability | accepted/delivered/observed、24 candidate 正向配置 | 无 | 通过（publication blocked） |
| registry | 已明确 | logical registration | listener/process/route/health | 无 | 通过 |
| diagnostics / redaction | 已明确 | safe fields、issue refs | raw secret/body、高基数标签 | 无 | 通过 |
| test fixture / replay | test-only | deterministic fake / replay harness | production override、evidence / readiness | 无 | 通过 |

## 11. 跨控制面审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 Step 2 的 P0 范围 | 通过 | local composition、consistency、technical、boundary、Consumer、projection、Job、resolver、handoff、registry、diagnostics 和 fixture 均有归属 |
| 是否提前进入最终配置项清单 | 通过 | 当前只定义控制面 / 域；具体 key、类型和默认值留 Step 7 |
| 来源链是否被误写为最终优先级 | 通过 | 只记录结构预览；Step 5 单独裁决优先级与冲突 |
| 是否存在同一行为多域拥有 | 通过 | Store、runner、resolver、handoff、redaction 和 registry 分别收口；跨域参数需在 Step 7 做唯一归属审计 |
| 是否误把架构 / 领域不变量配置化 | 通过 | 双锚、owner、body-free、state、CAS/UoW、replay、Query no-write、Unknown fence 和 truth 分层明确禁止 |
| 是否把 24 candidate 误开成 publication 配置 | 通过 | `publication_blocked` 为 zero configuration；`L2M-UP-005` 前不创建任何 event / publisher / outbox / route / retry / DLQ / receipt |
| 是否引入 sibling / runtime Cargo dependency | 通过 | runtime、event、ref、adapter、fake 仍是 Port / Consumer / typed ref / handoff；唯一 planned compile candidate 仍为 `core-contracts` |
| 是否把 fake / local Ready 当真实可用 | 通过 | fake 仅 test-only；builder Ready 仅表示 local composition |
| 是否覆盖 external blocker | 通过 | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 均保持 pending / blocked / waiting |
| 是否发现需要回写 03 的新契约 | 未发现 | 后续若出现 carrier、builder 参数、Port、error、DTO 或 flow 变化，必须停止并回开 03 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| raw config 仅由 `infra/config.rs` 读取，builder 仅由 `infra/runtime_builder.rs` 装配 | 否 | 承接既有 §13 / Step 14 边界 | 不适用 | 无回写 |
| 控制面按功能域组织既有 `Member*ConfigRef` 和 logical slots | 否 | 配置视角重组，不新增代码对象 | 不适用 | 无回写 |
| application / domain / contracts / api / worker / jobs 不读取 raw config | 否 | 承接模块依赖方向 | `03` §3～§5、§13 已有 | 无回写 |
| external slot 采用 blocked / waiting / unavailable posture | 否 | 承接现有 `BlockedSeamState` / availability | `03` §13 已有 | 无回写 |
| 24 outbound candidate 保持 zero configuration | 否 | 承接 `L2M-UP-005` blocker | `03` §7、§13 已有 | 无回写 |
| 后续配置若新增 / 改名 carrier、builder / constructor、Port、error、DTO 或 flow | 是 | 代码契约变化 | `03` §4～§13 与对应 calibration Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在“待回写”或“阻塞待确认”的实际配置结论；最后一行仅定义未来触发规则，不阻塞本 Step 通过。

## 13. 回填草稿：正式 `04-配置设计.md` §3

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“配置来源链图”“配置控制面总表”“配置域 / 功能模块总表”“模块读取与注入责任”“配置控制面停审记录”“跨控制面审计表”和“对详细设计的影响判定”。

正式 §3 应收口为：

1. 配置来源经过 `infra/config.rs` 统一读取、解析、校验和脱敏，形成 body-free validated refs、provenance 和 redacted issue refs；`infra/runtime_builder.rs` 是唯一 composition root。
2. 配置控制面按 composition/provenance、local consistency stores、technical identity、command/query boundary、consumer/projection、operations jobs、owner resolvers、handoff availability、logical registry、diagnostics/redaction、test fixture/replay 组织；outbound semantic publication 当前单列为 blocked zero-configuration seam。
3. `application` 只接收 Port 和 typed 参数，`domain` / `contracts` 不读取配置，`api` / `worker` / `jobs` 不重新读取 file 或 env；所有 concrete adapter、fake 或 blocked seam 由 infra 注入。
4. 配置只影响 local composition、availability、safe read / continuation posture 和 logical registration，不改变双锚、truth owner、状态、事务 / CAS、typed replay、Query no-write、Unknown fence、Core-only compile 或外部 owner truth。
5. `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 继续保持开放；`L2M-UP-005` 前不出现 event、publisher、outbox、topic、route、retry、DLQ 或 delivery receipt 配置。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| host / IPC / credential / session（`L2M-UP-001`,`L2M-UP-006`） | host slot、sensitive 配置和 activation | 只保留 opaque ref、availability 和 blocked seam |
| image release / pinned entry（`L2M-UP-002`） | image availability / handoff profile | 只保留 ref / waiting / not-available，不写 manifest 或 digest |
| Runtime entry / handoff（`L2M-UP-003`,`L2M-UP-004`） | resolver、material、handoff slot | 保留 blocked / waiting / unknown，不创建 Runtime run |
| member event schema / route（`L2M-UP-005`） | 24 candidate publication | zero configuration；待 Core / Bus 正式契约后定向重开 |
| screening taxonomy（`L2M-UP-007`） | resolver 与 inbound posture | 只消费 safe result；unknown 保守阻断 |
| execution subject scope（`L2M-UP-008`） | profile / subject selector | 仅 project-scoped 双锚；其他 scope fail closed |
| physical Store / scheduler / transport / secret / observability product | P1 字段和运维细节 | 保持 product-neutral，不能把 fake 当 production |

## 15. 进入 Step 4 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 来源链图已建立 | 通过 | §6 |
| 唯一 raw-config 读取与 composition root 已明确 | 通过 | §4、§9 |
| 控制面和配置域已拆分 | 通过 | §7、§8 |
| 每域允许 / 禁止能力已停审 | 通过 | §10 |
| 跨控制面无 unresolved 冲突 | 通过 | §11 |
| 领域不变量、blocked seam 和 dependency 分类未被配置改写 | 通过 | §7、§8、§11 |
| 对 03 的影响已判定且无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 符合 Step 15 后置装配纪律 |

Step 3 完成。下一步允许创建 `04_config_step_04_categories_boundaries.md`，定义配置类别、启动 / 运行时生效边界、热更新限制和禁止配置化项；不得提前创建 Step 5 以后文件或正式 `04`。

```text
step_03 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_04_categories_boundaries
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
