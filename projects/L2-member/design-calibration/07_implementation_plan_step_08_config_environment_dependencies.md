# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8。
>
> 回填章节：未来 `07-实施计划.md` §8 配置、环境与外部依赖准备。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`。只参考配置、环境、依赖、fake 边界及停审的收敛粒度；不继承其领域、事件、环境、实现或验收结论。
>
> 事实边界：本文定义 future implementation 的准备和失败处理。它不表示目标实现仓、Cargo workspace、配置、脚本、环境、测试 run、artifact、report、evidence、verdict、signoff、readiness 或 commit 已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8：定义配置、环境与外部依赖准备 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | Step 3 前置阅读、Step 5 phase、Step 6 boundary、Step 7 gate；正式 `03`、`04`、`05`、`06` |
| 本步输出 | 依赖准备、配置环境检查、fake / controlled / disabled 边界、phase / boundary 准备矩阵和不可用处理 |
| 当前执行事实 | `not_started`；目标实现仓不存在，所有检查和输出均未执行 / 未生成 |
| 停审方式 | 依赖分类、检查方式、不可用处理和阶段顺序已收稳；用户已授权连续推进，下一动作只能进入 Step 9 |

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| Step 3 前置条件与阅读清单 | 承接目标实现仓、Core path、Rust、目录、profile、artifact/report 根和永久规则 | 不把 planning baseline 升格为实现 baseline |
| Step 5 PH-01～PH-08 | 将配置和依赖准备绑定到能力纵切 | 不改变 phase DAG |
| Step 6 18 个 commit boundary | 将检查绑定到 boundary 开工或提交前 | 不创建 boundary 台账骨架 |
| Step 7 gate / evidence matrix | 保留 P0 gate、artifact/report 和真实 evidence 的边界 | 不执行检查或生成输出实例 |
| `03-详细设计.md` §3、§13 | 承接 planned Rust、Core-only compile、Port / blocked seam 和配置绑定 | 不新设 crate、Port、transport 或物理产品 |
| `04-配置设计.md` §5～§12 | 承接 raw→validated→builder、P0 profile、slot、secret 和 fail-closed 规则 | 不复制完整 key 表或创建配置文件 |
| `05-测试方案.md` §8～§9 | 承接 logical profile、suite、planned scripts 和 output root | 不把 planned script/path 写成已存在 |
| `06-验收标准.md` §10～§14 | 承接 VETO、evidence、handoff 和风险接受边界 | 不填写验收结果 |
| `全局项目依赖关系与裁剪规则.md` | 校验 compile / runtime / event 分类 | 不把全局关系整表复制为本仓依赖 |

## 3. SOP 问题回答

1. **哪些外部服务或仓是实施前置依赖？**

   PH-01 的硬前置是目标实现仓 `/home/aris/Projects/quantalithos-member`、本地 `L0-core` 的 `core-contracts` crate 和适配 planned Rust 2024 / Core MSRV 的 toolchain。目标仓当前不存在，故 `L2M-DDD-001` 阻塞任何实际开工。member-service、member-images、Runtime、Bus、Identity、Governance、Tools、Conversation、Artifact、Observability 和 SDK 都不是 Cargo 前置；它们是 runtime、event、ref、adapter 或 fake seam，exact contract 未闭合时只允许 conservative local posture。

2. **哪些依赖只在特定阶段需要？**

   composition/profile、Core path 和 output root 从 PH-01 起；CP01 local Store、technical slot、idempotency / result seam 用于 PH-02；scope / screening 来源用于 PH-03；Runtime safe-material / blocked seam 用于 PH-04；publication / observation local handoff 和 continuation Store 用于 PH-05；owner-specific resolver、support / projection Store 与 visibility basis 用于 PH-06；Consumer pre-gate、receipt、Job / replay / report slot 用于 PH-07；固定 run input、artifact/report pairing、acceptance draft source 只在 PH-08 使用。

3. **哪些配置项必须在本地或 CI 环境准备？**

   只准备 `04` 已定义的 profile 和 validated logical reference：`composition.*`、`stores.*`、`technical.*`、command/query boundary、consumer、projection、jobs、resolver/handoff、registry 和 diagnostics。local-dev / ci-test 可使用 deterministic local Store、Clock、ID、digest 与 test-only fake；所有 raw secret、endpoint、topic、manifest、IPC、credential body、policy body 和 production topology 均不得写入本仓配置或 fixture。

4. **是否允许 fake / mock，允许到什么阶段为止？**

   P0 的 local-dev、ci-test 和 operations-replay 允许 deterministic fake、logical Store、controlled safe snapshot 和 explicitly disabled seam。它们必须保留正式 Port 的 version、CAS、UoW、idempotency、typed replay、receipt / report、redaction、failure / Unknown 语义，且不构造 foreign truth 或 external success。integration-like 只在具体 owner 合同闭合、profile 被审计且另获执行授权后作为 P1 selected run；staging-like / production-like 不属于本轮 P0。

5. **外部依赖不可用时是暂停、降级还是替代？**

   目标仓、Core crate、Rust toolchain、required local Store / UoW / technical / typed-result slot、P0 fake 或 output-pair checker 不可用时暂停受影响 boundary 或令其 gate failed；不得 silent fallback。可选 projection、resolver、handoff 或尚未闭合的 owner seam 只能返回 `Blocked`、`Waiting`、`Unknown`、`Stale`、`Gap` 或 `NotAvailable`。P1 real-like unavailable 只记录 residual / not_run，不能转写 P0 pass。

6. **哪些依赖需要由其他团队或仓提供？**

   `L0-core` 提供唯一 compile primitive；member-service 负责 host acceptance / registry / session / health，member-images 负责 image supply / pinned release，Runtime 负责 loop / context / plan / outcome 及 entry mapping，owner domains 提供 identity / scope / policy / safe truth，L0-bus 负责事件主干。当前本仓只消费 typed ref、safe result、committed fact、local attempt / gap 或 future adapter contract；不代替其 owner 交付。

7. **已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在？**

   当前检查确认 `/home/aris/Projects/quantalithos-core/crates/contracts` 存在，包名为 `core-contracts`；`/home/aris/Projects/quantalithos-member` 不存在。前者只确认 candidate 路径存在，不代表 Member 的类型兼容或 workspace 已形成；后者是 PH-01 的 hard blocker。

8. **哪些依赖是编译期依赖，Cargo path 写法是否一致？**

   唯一 planned sibling compile dependency 为：

   ```toml
   core-contracts = { path = "../quantalithos-core/crates/contracts" }
   ```

   该写法与 `03 §3.2` 一致。它不批准 member-specific Event schema、route、topic、publisher、outbox、retry 或 DLQ，也不允许把 Core 当前路径复制为 shadow contract。

9. **哪些依赖是运行期或事件协作依赖？**

   Runtime、member-service、identity / work / governance / tools、member-images、Conversation / Artifact / Observability、SDK、Bus 以及 physical Store 都只能按 runtime、event、ref、adapter、persistence seam 或 test fake 表达，不得增加 sibling Cargo path dependency。`L2M-UP-005` 关闭前，24 个 semantic candidate 均是 blocked / non-materialized inventory，不存在可准备的 publisher、route 或 topic 配置。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 风险 | 本步处理 |
|---|---|---|---|
| Step 3 | 目标实现仓和 immutable baseline 均未就绪 | 实施者可能在错误目录或 dirty design state 开工 | 列为 PH-01 hard blocker，不能用目录模板替代 |
| `03 §3 / §13` | 只给出依赖分类和 builder 绑定 | 实施时可能把 runtime seam 混入 Cargo | 给出 compile / runtime / event / ref / adapter / fake / persistence 准备表 |
| `04` | 配置项和 profile 很完整 | 07 若复制 key 表会形成第二配置真相源 | 只保留 phase 前必须检查的配置组和不可配置化红线 |
| `05` | planned suite / script / path 已定义 | 路径模板容易被误写成已生成 evidence | 明确 root、run_id 和 report 是 future runtime input / output |
| 上游 / DDD gap | exact host、Runtime、receipt、helper、version 与 physical Store 未闭合 | fake 或 default 可能被用来伪闭口 | 逐类规定 blocked / wait_design / residual 的处理 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 依赖 | 分散在 03、04、05 和 blocker 台账 | 按实施时机、提供方、检查和失败处理收束 | 防止临场判断 |
| Cargo 关系 | 只有 Core-only 原则 | 加入路径、核验点和 sibling 禁止规则 | 防止 compile 边界漂移 |
| profile / fake | 已有配置与测试语义 | 明确 P0 / P1 使用条件和 parity 要求 | 防止 fake success |
| 外部不可用 | 分散在各 CP | 区分 hard pause、safe degraded、P1 residual | 防止 default-pass |
| 24 candidate | 有 non-materialization 红线 | 明确不需、不准准备任何 event 设施 | 防止以配置名义物化 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 将同层 sibling 全部纳入 Cargo workspace | 不采用 | 违反全局依赖裁剪和 owner 边界 |
| 仅引用 `core-contracts`，其余通过 Port / ref / adapter / fake 协作 | 采用 | 保持唯一编译期边界和可替换 seam |
| P0 要求真实 host、Runtime、Bus、image、DB 或 provider | 不采用 | 当前合同 / 产品均未闭合，会将外部 blocker 误作本仓完成条件 |
| P0 使用 semantic-parity fake / blocked seam | 采用 | 可验证本仓 local truth 与保守失败，不伪造 external qualification |
| 使用 config 激活 candidate 或改变 truth / state 规则 | 不采用 | 配置不得改变 owner、双锚、body-free、Query no-write、CAS、replay 或 Unknown fence |

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 / 全局分类 | 使用阶段 | 提供方 | 当前协作方式 / 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-member` | target repo | PH-01～08 | 本项目 / 后续实现授权 | 目录、项目级 git、workspace / baseline 核验 | 不存在即 `L2M-DDD-001`；PH-01 `wait_design` / wait authorization |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | compile | PH-01 起 | `L0-core` | path、`Cargo.toml` package / lib、dependency graph；future only `core-contracts` path | 路径或 package 不符则暂停；不得 vendoring / shadow copy |
| Rust 2024 / Core compatible toolchain | tool | PH-01 起 | local toolchain | future `rustc --version`、`cargo --version`、fmt / check | 不可用则暂停受影响 build boundary |
| logical truth / support / projection / continuation / idempotency / result Store | persistence seam | PH-02～07 | member `infra` future implementation | validated `stores.*` + semantic-parity fake / controlled slot | required mutation / replay slot 缺失则 no-write / gate failed；physical product 未选不以 fake 伪装生产 |
| Clock / ID / digest | technical runtime seam | PH-01～08 | member `infra` future implementation | validated `technical.*` + deterministic test double | 缺失不构造 partial object；暂停 affected boundary |
| member-service host collaboration | runtime + ref + adapter | PH-02、PH-07 / P1 | `L2-member-service` | CP01 request / signal / report Port，P0 blocked fake | `L2M-UP-001`；不声明 acceptance/session/health，P1 only residual |
| member-images pinned component release | ref / supply seam | PH-01、PH-02 / P1 | `L2-member-images` | availability / opaque pinned ref only | `L2M-UP-002`；waiting / not-available，不解析 manifest |
| Runtime entry / handoff | runtime + ref + adapter | PH-04、PH-05 / P1 | `L2-runtime` | typed local decision / attempt / safe material / blocked seam | `L2M-UP-003/004`；不创建 Runtime run/outcome，positive lane blocked |
| Work / Identity / credential / subject | ref + owner-specific resolver | PH-02、PH-03、PH-06 / P1 | L1 owner + member-service | double anchor / safe ref / blocked resolver | `L2M-UP-006/008`；fail closed，no third subject |
| Governance screening | runtime + safe result / resolver | PH-03、PH-06 / P1 | `L1-governance` | four-state safe result / unavailable surface | `L2M-UP-007`；no local allowlist or default pass |
| Tools / Method capability view | runtime + ref / adapter | PH-06 / P1 | `L2-tools` / Method owner | safe view / not-available resolver | no registry, invocation or capability truth |
| Conversation / Artifact / Observability handoff | runtime + ref + adapter | PH-05、PH-07 / P1 | corresponding owner | body-free material, local attempt / gap, controlled fake | no body / evidence / observed truth; unavailable remains gap |
| `L0-bus` / member semantic candidates | event collaboration | all PH, especially PH-07 / P1 | `L0-bus` + Core authority | only dependency-boundary / non-materialization check | `L2M-UP-005`; no event facility, route, topic, retry or DLQ |
| artifact / report roots and planned report generators | filesystem / test support | PH-01～08 | future implementation repo | root / parameter / raw-to-report dry-run in future | missing root or pairing checker blocks relevant gate; no static evidence |

### 7.2 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | future 检查方式 | 失败处理 / 红线 |
|---|---|---|---|
| `composition.profile`、strict validation、redacted provenance | PH-01 起 | parse / invalid-profile negative test | unknown / malformed fail-fast；不得 silent default |
| P0 profiles：`local-dev`、`ci-test`、`integration-like`、`operations-replay` | PH-01 起 | profile isolation / fixture contamination check | integration-like positive requires owner closure; replay is no-side-effect |
| `stores.*`、`technical.*` | PH-01～07 | builder slot / fake parity / mutation and replay negative test | required slot missing → no-write; optional read slot → explicit stale / unavailable |
| command / query / consumer boundary groups | PH-02～07 | bounded input, body-free, no-write / pre-gate tests | no raw body, no owner truth, no generic listener |
| `projection.*`、visibility / freshness posture | PH-06～07 | committed source, stale / visibility and rebuild no-write checks | no source repair or pseudo-version |
| `jobs.*`、replay and report groups | PH-07 | finite selector, exact report replay, partial isolation checks | no unknown retry, no scheduler assumption |
| `resolvers.*`、`handoff.*` | PH-02～07 | slot category, explicit blocked / fake / controlled selection | no raw secret / endpoint / provider body; no implicit fake fallback |
| `registry.*`、`diagnostics.*` | PH-01～08 | logical registry / redaction / low-cardinality checks | no transport/process topology or readiness claim |
| `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*` | PH-01 preparation; PH-08 execution | future argument/path/pairing validation | run_id is runtime-only; missing source / path blocks gate, never handwrite pass |

### 7.3 Fake / controlled / disabled 使用边界

| Seam | P0 allowed mode | 必须保留 | 明确禁止 | 使用阶段 |
|---|---|---|---|---|
| Store / UoW / idempotency / typed result | deterministic semantic-parity fake | version、CAS、rollback、commit-unknown、exact stored replay | direct map shortcut、duplicate rerun、constant version | PH-02 起 |
| technical slots | fixed Clock / ID / digest | deterministic relation / digest and failure mapping | secondary ID、partial object、secret injection | PH-01 起 |
| host / Runtime / resolver / handoff | blocked fake or controlled safe result | owner-specific ref、unavailable reason、attempt / gap boundary | positive owner success、foreign body / truth、generic adapter | PH-02～07 |
| Consumer input | finite descriptor / body-free fixture | source/schema/dedup/pre-gate/refusal semantics | arbitrary listener, broker ack, payload body retention | PH-03、PH-07 |
| projection / Query | local committed-fact fake | source provenance、stale / visibility marker、no-write | refresh / repair / reconcile source | PH-06～07 |
| Job / replay | finite read-only descriptor and item-isolated fake | typed report、partial result、exact replay | scheduler, unknown side-effect retry, source scan | PH-07 |
| report generator | future local generator fed by raw artifacts | disposition, digest, raw-report pairing, review split | static JSON / hand-written EV / automatic verdict | PH-08 |
| selected owner integration | P1 controlled / real-like only | actual owner contract and real disposition | use in P0 or infer readiness | after blocker closure + explicit authorization |

### 7.4 Phase 级准备矩阵

| Phase | 开工前必须确认 | 可后置 / conditional | 不可用处理 |
|---|---|---|---|
| PH-01 | target repo, immutable baseline, Core path, Rust toolchain, project git identity, profile / output-root contract | owner adapters, physical Store, selected run | hard pause; no workspace / code action |
| PH-02 | truth/idempotency/result Store, technical slots, CP01 profile, double-anchor / host blocked seam | host acceptance / credential positive | required local slot failure blocks; owner positive remains blocked |
| PH-03 | scope / screening safe-result seam, consumer boundary config, redaction posture | authoritative policy mapping | unknown / missing source rejects or blocks; scope successor gap `wait_design` |
| PH-04 | Runtime local boundary config, safe material source, attempt/result storage, replay posture | Runtime trigger / positive handoff | mapping missing remains blocked; no Runtime object synthesis |
| PH-05 | continuation Store, publication / observation blocked handoff, trace redaction | destination compatibility / feedback | gap / blocked local posture; candidate remains non-materialized |
| PH-06 | support/projection Store, owner-specific resolver seam, visibility / freshness basis | real owner resolver and outlet qualification | helper/version/source gap `wait_design`; Query stays no-write |
| PH-07 | finite Consumer descriptors, receipt / report Store, Job profile / replay root | external source / scheduler / positive delivery | receipt/helper gap blocks affected boundary; no source repair |
| PH-08 | fixed baseline and run input, artifact/report roots, gate/report generators, review responsibility | P1 selected run, performance threshold authority | missing real input/generator blocks release gate; no verdict |

### 7.5 Commit-boundary 配置 / 依赖复核

| Boundary | 必查配置 / 依赖 | 失败时唯一处理 |
|---|---|---|
| `commit-01-a` | target repo, baseline, Core path, Rust, seven-library naming | pause / `wait_design` |
| `commit-01-b` | P0 profile, strict validation, builder slot, script / output root contract | correct config/design; no static output |
| `commit-02-a` / `02-b` | truth/idempotency/result / technical slots, double-anchor, host blocked seam | local required slot failure blocks; owner positive stays blocked |
| `commit-03-a` / `03-b` | scope/screening source class, consumer limit/dedup, body-free/redaction | fail closed; `scope_supersede_gap` or receipt gap → `wait_design` |
| `commit-04-a` / `04-b` | Runtime ref/handoff class, attempt/result Store, replay posture | Runtime mapping gap → blocked; do not synthesize outcome |
| `commit-05-a` | publication handoff class, continuation/result Store, candidate zero-configuration | DDD-004 / UP-005 → `wait_design`; no event facility |
| `commit-05-b` | trace / observation config, append-only Store, redaction | DDD-005 or leak blocks boundary |
| `commit-06-a` | owner resolver / support Store / stale-gap posture | DDD-006 or source uncertainty → `wait_design` |
| `commit-06-b` | projection / visibility / freshness source, no-write guard | DDD-007 or pseudo-version risk → `wait_design` |
| `commit-07-a` / `07-b` | finite source descriptor, receipt / continuation Store, redaction | DDD-003 / source closure gap blocks accepted lane |
| `commit-07-c` / `07-d` | Job input/result/report/replay slots, partial item posture | report/helper/version gap → `wait_design` |
| `commit-08-a` / `08-b` | fixed run input, artifact/report roots, generator parameters, review handoff source | gate blocked until real raw/report sources exist; never static pass |

### 7.6 环境不可用处理表

| 不可用对象 | P0 / P1 处理 | 是否可记为通过 |
|---|---|---|
| target repo / immutable baseline | pause current boundary; await authorized baseline | 否 |
| Core path / toolchain | pause; repair path/environment or reopen design | 否 |
| required local Store / UoW / technical / typed-result slot | no-write / gate failed | 否 |
| deterministic fake whose semantic parity fails | test / gate failed; repair fake or design | 否 |
| optional projection / resolver / handoff | explicit stale / blocked / waiting / gap / not-available | only an explicitly expected negative case |
| host / Runtime / image / policy / credential / Bus positive seam | blocked / not_run / residual until owner closure | 否，且不计 P0 |
| Consumer descriptor / receipt / helper / version source gap | `wait_design`; no direct Store workaround | 否 |
| 24 candidate event requirement | reject as `L2M-UP-005` design violation | 否 |
| artifact/report path, pairing, redaction or dependency check failure | gate failed; preserve failure output when execution is authorized | 否 |
| P1 real-like / production-like unavailable | residual / unavailable | 不计 P0；不构成 P1 pass |

### 7.7 配置 / 依赖停审与跨审计

| 审计项 | 结论 | 执行期缺口 |
|---|---|---|
| Core 是否为唯一 planned Cargo sibling dependency | `pass_for_design` | PH-01 future dependency graph check |
| runtime / event / ref / adapter / fake / persistence 是否没有伪装为 package dependency | `pass_for_design` | actual manifest absent |
| PH-01～08 是否都有配置、环境或依赖准备 | `pass_for_design` | all future checks `not_run` |
| 18 boundaries 是否均有最小复核入口 | `pass_for_design` | implementation ledgers only created in Step 13 |
| fake 是否保留正式语义且不宣称 external success | `pass_for_design` | fake implementations absent |
| 24 candidate 是否保持 zero configuration / non-materialization | `pass_for_design` | Core / Bus shared contract remains `L2M-UP-005` blocked |
| 不可用处理是否不会生成伪 pass | `pass_for_design_with_blockers` | target repo, owner contracts, DDD gaps and real execution absent |

## 8. 回填草稿

未来正式 `07-实施计划.md` §8 应只列实施前和阶段前的必要准备：PH-01 先核验目标仓、immutable baseline、Rust、`core-contracts` path、profile 和 output-root contract；后续 phase 分别按 CP local Store、technical slot、owner-specific blocked seam、continuation / projection / receipt / report slot 开工。唯一 planned Cargo sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；所有其他仓都按 runtime、event、ref、adapter、fake 或 persistence seam 协作。P0 可使用 semantic-parity fake、controlled safe snapshot 和 disabled seam，但不得绕过 version、UoW、replay、redaction、owner 或 external-success fence。目标仓、Core、required local slot、config parse、report pairing、redaction / dependency check 不可用时阻断对应 boundary；P1 selected run 不可用只能记录 residual。24 个 candidate 仍为 zero-configuration / non-materialized，不得准备 event 设施。

## 9. 待确认事项

| 事项 | 影响 | 截止点 / 当前处理 |
|---|---|---|
| 目标实现仓的创建授权、模板与 immutable baseline manifest | PH-01 及后续全部 boundary | `commit-01-a` 开工前；当前 `L2M-DDD-001` |
| Core API / MSRV 与 planned workspace 的实际兼容 | PH-01 | `commit-01-a` 前实际核验；不可建立 shadow type |
| exact host / image / Runtime / credential / screening / subject contracts | affected P1 lane | owner closure和 selected run 前；P0 only blocked posture |
| DDD helper / receipt / version / scope successor gap | CP02、CP04～CP07、Consumer / Job | affected boundary 开工前回写 owning design |
| physical Store、provider、transport、scheduler、deployment product | P1/P2 qualification | 不作为 P0 产品选型；另行 authority |
| fixed run_id、actual generator CLI 和 acceptance reviewer | PH-08 | real execution authorization 后固定；当前不得填写 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 外部依赖准备表 | `pass_for_design` | compile / runtime / event / ref / adapter / fake / persistence 已分类 |
| 配置与环境检查表 | `pass_for_design` | 与 04 / 05 profile 和 output contract 一致 |
| fake / controlled / disabled 边界 | `pass_for_design` | P0 / P1 不混淆 |
| phase / boundary 准备矩阵 | `pass_for_design` | 不改变 PH-01～08 或 18 boundary |
| 不可用处理 | `pass_for_design_with_blockers` | hard pause、safe posture和 residual 已区分 |
| 可进入 Step 9 | `authorized` | 下一步仅定义 Spike、风险与待确认事项 |
