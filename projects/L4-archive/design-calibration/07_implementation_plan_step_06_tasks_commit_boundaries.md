# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6；回填位置：正式 `07-实施计划.md` §6。\
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。\
> 本产物只规划未来实现，不表示目标实现仓、代码、测试、提交或证据已经存在。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 6：拆分阶段任务、编写顺序与提交边界 |
| 输入 | Step 5 八个 Phase；正式 `03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md`；Step 3/4；实施计划、台账和闭环标准 |
| 输出 | 16 个 candidate commit boundary 的任务、批次、scope、required checks、Gate、经验复核、停审和跨 boundary 审计 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-archive`；当前不存在 |
| 当前状态 | `completed / boundary_plan_closed_with_blockers / continue_authorized` |
| implementation / test / acceptance execution | `false`；本 Step 不执行实现、测试、验收或提交 |
| formal 07 | Step 13 前仍不存在；本 Step 不创建 |
| 下一动作 | `create_and_complete_step_07_test_acceptance_gates` |

`completed` 仅指 Step 6 计划材料完成；16 个 boundary 的未来 Gate 仍为 `pending` 或 `blocked`。任何 Gate 未获得真实证据前，不得写 `pass`、commit hash、run_id、artifact、report、EV、verdict、signoff 或 readiness。

## 2. 本步输入与读取确认

| 输入 | 用途 | 当前核验 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 继承八个纵切 Phase、依赖图和证明上限 | 已读；PH-01～PH-08 不按对象/文件裸拆 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 按 Phase/boundary 固定 required reads、前置 blocker 和目录规则 | 已读；Step 3 的 PH-05 分母已在本 Step 修正为两个 boundary |
| `07_implementation_plan_step_04_objects_deliverables.md` | 继承六 role、26 对象、交付/非交付范围 | 已读；Archive 只拥有归档专属 truth |
| `03-详细设计.md` §4～§16 | 文件布局、对象、port、协议、flow、状态、UoW、错误、观测、测试切口 | 已读；30 logical entries / 32 method surfaces 不扩充 |
| `05-测试方案.md` §3/§6/§9/§13 | 18 CUT、102 TC、13 suites、5 gates、14 scripts、19 EV | 已读；只绑定未来门禁，不制造实例 |
| `06-验收标准.md` §5～§14 | 9 FUNC、12 RL、protocol/state/consistency、8 NFR、10 EVID、10 VETO | 已读；blocked P0 不能被风险接受替代 |
| `实施计划讨论流程_SOP.md`、`实施计划书写规范.md` | Step 6 问题、批次/提交/经验复核结构 | 已读；每 boundary 独立停审 |
| `代码实施台账与门禁规范.md` | boundary ledger 字段和 Design/Scope/Build/Test/Evidence/Commit/Handoff Gate | 已读；未来 skeleton 仅在 Step 13 创建 |
| `设计真相源闭环与可落码性标准.md` §九 | 开工前闭环与设计者经验复核 | 已读；适用项缺证据即 blocker |
| `L1-governance`、`L1-workspace` Step 6/7 样本 | 借用粒度、台账、批次和门禁结构 | 已读；未复制其领域对象、数量或 outbound 设计 |

专项上游仍只是 owner truth、formal seam、依赖分类和粒度参考。`L1-workspace` 始终 `Auxiliary`，不能成为任何 L1 canonical truth；`L0-sdk` 不进入 Archive 服务端 compile graph；outbound event/outbox/publisher 仍没有 boundary。

## 3. SOP 问题回答

| 问题 | 回答与取舍 | 依据 |
|---|---|---|
| 阶段内有哪些实施动作？ | 每个 Phase 依次锁定 typed contract/ref、domain/state、application/UoW、controlled infra、entry/worker、测试切口和未来 evidence；只实现该 Phase 的纵切。 | Step 5；`03` §4～§16 |
| 先写什么？ | 先 public contract 与测试切口，再 domain/state，再 port/UoW/idempotency，再 service/adapter，再 API/worker/job；高风险状态、事务、并发、幂等、安全、审计、恢复单独批次。 | 书写规范 §4.7/§4.7.1/§4.7.3 |
| 哪些内容同一提交？ | 只有共同组成一句话可验证增量的批次同提交；跨 Phase、无关协议族、最终 evidence 与业务功能必须分开。 | SOP Step 6 |
| 何时允许 commit？ | 仅当前 boundary 的 design/scope/worktree/build/test/evidence checks 均有真实合格证据、用户另行允许提交且 staged diff 只含该 boundary 时。当前一律不提交。 | 台账规范 §七 |
| 单批是否会过大？ | query、source capture、assessment、effect、restore、report 均拆为 100～300 行宜、高风险独立批次；预计超过 300 行继续拆，超过 500 行禁止单批。 | 书写规范 §4.7.1 |
| 如何处理文档冲突？ | 立即暂停当前 boundary；回写 `03/05/06/07` 或所属上游真相源并固定新 baseline；实现者不得在代码中自行补字段、状态、port、scope 或证据。 | 闭环标准 §9 |
| fake 能否解除 blocker？ | 不能。fake 只证明 local/negative/controlled 行为；不能证明 owner authority、durability、external commit、receiver finality、formal conformance 或 readiness。 | Step 5；`06` §3/§14 |
| 是否有 outbound boundary？ | 没有。`AR-HLD-Q-001` 未闭合前，禁止 outbox/publisher/topic/delivery state/evidence；若未来解锁，必须回退设计步骤。 | `03` §7.6；`06` RL/VETO |
| 16 个 boundary 是否可独立 review/回退？ | 设计上可以；每个有一句话目标、allowed/forbidden scope、required checks、Gate 和停审。未来若实现规模超界，只能在 boundary 内分批，不可私自新建边界。 | 实施计划规范 §5.6 |

## 4. 当前材料问题诊断

| 问题 | 风险 | Step 6 处理 |
|---|---|---|
| Step 5 只有 Phase，没有可提交切口 | 实现者会按文件或对象随意切提交 | 固定 16 个功能 boundary，并把每批映射到唯一 boundary |
| PH-05 原先只有一个未细分的 assessment boundary | contracts 与执行/持久化/重放规模和风险不同 | 拆为 `commit-05-a-assessment-contracts` 与 `commit-05-b-assessment-execution`；Step 3 已同步 |
| 旧材料预设 provider、S3、期限和性能数字 | 会把 historical choice 冒充当前设计 | allowed scope 只写 provider-neutral port/typed outcome；数值未闭合即 blocker |
| Query、capture、effect 共享“状态成功”措辞 | 可能把读、采集、外部 commit 混成一个 truth | 每 boundary 明确 no-write、intent-before-effect、unknown/reconcile 和 owner boundary |
| report/evidence 容易先写静态表 | 静态结果会污染验收 | 早期只允许 script capability/minimal shell；最终 EV 只能由 fixed-run raw 推导 |
| local pending 被“实现时再确认”掩盖 | 设计缺口转移给实现者 | 对 `AR-03-LOCAL-001～006` 逐 boundary 标 blocker，要求回写真相源 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| boundary 数量 | Step 3 矩阵文字与 PH-05 分母不一致 | 8 Phase / 16 candidate boundary，分母统一 |
| 拆分主轴 | 技术 role / 对象可能被横向拆开 | 可验证归档/恢复纵切，跨 role 但不跨 Phase |
| 提交前检查 | 仅阶段级泛化描述 | 每 boundary 有 required checks、Gate、失败动作和证据路径 |
| 设计责任 | 可能留给实现者现场补闭环 | 设计者先做 §九经验复核；blocker 回写并重核；实现者只二次校验 |
| 证据成熟度 | “报告/证据”未分层 | script capability → minimal index shell → final EV → acceptance handoff 分层 |
| 跨仓关系 | 容易误写成 package dependency | compile/runtime/event/ref/adapter/fake 按实际关系分类；SDK、owner、provider 不进 compile |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个对象一笔提交 | 计数简单 | 破坏 DTO→state→UoW→result 闭环 | 不采用 |
| 每个 Phase 一笔提交 | 文件少 | PH-04～PH-07 过粗，无法独立回退 | 不采用 |
| 16 个可验证 boundary | review、测试、回退和证据归属清楚 | 计划较长，需要维护映射 | 采用 |
| 将 provider/owner seam 前置到 PH-01 | 早看到集成问题 | 未闭合的 authority 会冻结本地闭环并诱发 fake 成功 | 不采用；只前置 contract/slot 检查 |
| 将 outbound 当 PH-08 必交付 | 表面完整 | 当前没有已核验 payload/topic/outbox source | 禁止；持续验证其不存在 |
| 以静态 evidence 先通过 | 可快速生成文件 | 违反 raw-first、same-run、no-static 规则 | 禁止 |

## 7. 结构化中间产物：统一实施规则

### 7.1 统一编写顺序

每个 boundary 内部严格按下列顺序；不适用的层必须在 boundary 台账中注明原因，不得因此跳过契约或门禁：

```text
1. 读取 project ledger、current boundary ledger 与 required design reads
2. 固定 design baseline、allowed/forbidden scope 和当前 blocker
3. 锁定 public/local contract、typed refs、DTO、状态和最小测试切口
4. 建立测试骨架或 fault/spy 入口（先于业务实现）
5. 实现 domain factory / invariant / state transition
6. 实现 application port、UoW、CAS、idempotency、result/receipt/report surface
7. 接入 controlled fake 或 validated adapter；禁止越权 provider/owner 写
8. 接入本 boundary 允许的 API/worker/job entry
9. 补齐错误、恢复、并发、审计、redaction 和边界负例
10. 执行 required checks，生成同一 run 的 raw/report（若本 boundary 适用）
11. 逐项完成 Design/Scope/Build/Test/Evidence/Commit/Handoff Gate
12. boundary 停审并更新 project ledger；用户明确允许后才可能提交
```

### 7.2 统一开工前设计闭环复核

每个 boundary 都必须由设计者填下表；结论使用 `通过 / 不适用 / blocker`，不是“遵循标准”一句话。当前所有 `blocker` 都保持开放，不由本 Step 关闭。

| 复核项 | 必须检查 | 缺失时动作 |
|---|---|---|
| 字段闭环 | domain 必填字段、条件字段、reason、actor、time、version、source/material/ref 均有正式来源 | 暂停并回写 `03` |
| DTO 构造闭环 | request/event/job/query input 能构造目标对象或 service input；optional/empty 语义明确 | 暂停并回写 `03`/`05` |
| Support carrier/schema | `*Kind`、`*IdentityKey`、`*Summary`、`*RefSet`、`*Classification`、`*Status` 的 owner、字段、variant、集合排序去重和 fake parity 已闭合 | 暂停；不得让实现者选 enum/字段 |
| typed-ref kind owner scope | 新 ref kind/tag 在 owning crate/file 有明确最小改动范围 | 暂停；不得私造 local kind |
| 状态闭环 | 正式 18 状态、条件字段、非法边、错误映射、测试/AC 名称一致 | 暂停并回写状态矩阵 |
| ref / scope / validation truth | lookup ref、scope、authority、visibility、compatibility、hold 等都有 resolver/repository/port 来源 | 暂停并回写来源 |
| metadata / idempotency / UoW | context、channel、operation、key、canonical input digest、reservation、result_ref、transaction 顺序闭合 | 暂停；禁止默认/字符串拼接 |
| query/read boundary | view/page/marker、visibility resolution、empty/degraded、private/public cursor 来源明确 | 暂停；Query 不得写 |
| source/material boundary | source class、owner authority、version/fence/coverage/provenance、material/ref 及 Auxiliary 标记明确 | 暂停；不得 workspace 补 canonical |
| accepted side effect | trace/audit/history/stale/result/effect/outbox（若有）逐 flow 列明；无 payload 时 outbox 明确为空 | 暂停；不得私造 effect/outbox |
| artifact/report/evidence | writer/reader、path、run_id、schema/digest/redaction、same-run pairing 明确 | 暂停；不得静态 pass |
| phase boundary | 不引用后续 phase 对象、结果或证据；reserved 面不被当前调用 | 调整 boundary/回写设计 |

### 7.3 统一提交前检查清单

| 检查 | 未来命令/证据 | 当前姿态 |
|---|---|---|
| worktree | `git status --short`；确认用户无关改动未纳入 | 未执行；目标实现仓不存在 |
| formatting/build | `cargo fmt --check`、`cargo check -p <crate>` | 未执行；不得写 pass |
| targeted tests | 对应 `TC-AR-*` / suite 的命令及 raw 结果 | 未执行；实例为 0 |
| negative/high-risk tests | state、UoW、CAS、idempotency、effect、redaction、no-write、receiver isolation | 未执行；缺 formal seam 保持 blocked |
| diff | `git diff --check`、staged name-only | 设计仓静态检查可做；不代表实现通过 |
| artifact/report | `artifacts/test/<run_id>` → `reports/runs/<run_id>`；禁止 `latest` | 未生成任何实例 |
| Commit Gate | type(scope)、body 分组、唯一 boundary、无越界文件 | 当前 `commit_required=false` |
| Handoff Gate | baseline、checks、remaining blockers、next boundary、用户改动保护 | 当前 waiting |

## 8. 16 个 candidate boundary 总表

| # | Phase | boundary_id | 一句话可验证增量 | 主要状态 | 最迟开工 blocker |
|---:|---|---|---|---|---|
| 1 | PH-01 | `commit-01-a-foundation` | 建立六 role workspace、命名和唯一 compile candidate 检查 | blocked | target repo/baseline、Core export、`AR-ARCH-001` |
| 2 | PH-01 | `commit-01-b-runtime-shell` | 建立 strict config、required slots、脚本/输出根能力壳 | blocked | target repo、55-key/slot/schema、`AR-03-LOCAL-004` |
| 3 | PH-02 | `commit-02-a-admission-contracts` | 闭合 C01/C02 admission DTO、request/job 初始状态和 result surface | planned (local-only) | operation codec/contract authority；formal source blocker |
| 4 | PH-02 | `commit-02-b-local-consistency` | 闭合 reservation、UoW、CAS/read-set、result replay 和 worker fence | blocked | `AR-03-LOCAL-001/003/006` |
| 5 | PH-03 | `commit-03-a-query-surfaces` | 闭合五 Query safe view、visibility resolution 和 no-write facade | planned (local-only) | `AR-03-LOCAL-002/005`；visibility owner contract |
| 6 | PH-03 | `commit-03-b-cursor-visibility` | 闭合 public/private cursor mapping、continuation、redaction 和 restart posture | blocked | `AR-03-LOCAL-002`、算法/key/visibility authority |
| 7 | PH-04 | `commit-04-a-source-capture` | 闭合八 source binding/capture/coverage/finding 的 per-owner 增量 | blocked | `AR-UP-001/008` |
| 8 | PH-04 | `commit-04-b-bundle-closure` | 从 frozen inventory 形成 immutable manifest 与 exact closure/seal basis | blocked | `AR-UP-001/006/008`、durable range/read-set |
| 9 | PH-05 | `commit-05-a-assessment-contracts` | 闭合 verification/compatibility DTO、target selector、finding/posture schema | planned (controlled-only) | `AR-UP-004` |
| 10 | PH-05 | `commit-05-b-assessment-execution` | 执行 J07/J08、保存 immutable assessment、提供 Q03 只读重放 | blocked | `AR-UP-004`、`AR-03-LOCAL-003/004` |
| 11 | PH-06 | `commit-06-a-placement-retrieval` | 以 intent-before-effect 闭合 placement/retrieval 与 exact reconcile | blocked | `AR-UP-005`、`AR-03-LOCAL-003` |
| 12 | PH-06 | `commit-06-b-lifecycle-governance` | 在 current decision/hold 下闭合 lifecycle execution，保持治理权外置 | blocked | `AR-UP-002/003/005` |
| 13 | PH-07 | `commit-07-a-restore-plan` | 冻结 owner set、Bundle revision、eligibility 并生成 immutable restore plan | blocked | `AR-UP-006/009` |
| 14 | PH-07 | `commit-07-b-restore-handoff` | 逐 owner 生成材料、intent、handoff outcome 和 compensation 记录 | blocked | `AR-UP-006/009` |
| 15 | PH-08 | `commit-08-a-local-evidence` | 建立 gate/check/report capability 与 minimal evidence index shell | planned (capability-only) | target repo、machine artifact schema |
| 16 | PH-08 | `commit-08-b-formal-handoff` | 在真实 fixed run 后形成 formal seam/evidence/acceptance handoff 输入 | blocked | 全部 upstream/local blockers、实现与 run 不存在 |

编号修正记录：Step 3 的单一未细分 assessment boundary 已拆成 #9/#10；其余编号不变。最终分母为 `16`，不再使用未加后缀的旧名称。

## 9. Phase / boundary 逐项实施计划

以下小节是未来 implementation handoff 的最小可执行粒度。每个 boundary 的 `design_baseline`、`implementation_repo`、实际 Gate evidence 和 commit record 只有在目标仓存在且另获实施授权后才能填写；当前统一为 `pending` 或 `blocked`。

### 9.1 PH-01 Foundation / runtime / evidence shell

#### `commit-01-a-foundation`

| 项 | 计划 |
|---|---|
| 一句话目标 | 建立六 role workspace、package/crate/binary 命名和唯一 Core compile-candidate 检查 |
| 编写顺序 | workspace manifest → six crate skeleton → direct dependency allow-list → naming/dependency check |
| 代码批次 | `BATCH-01-01` manifest/crate skeleton（100～200 行）；`BATCH-01-02` dependency/naming check（100～200 行） |
| required reads | `03` §3～§4；Step 3 coding/runtime、units/layout；目录规范；Rust 规范；Core candidate notes |
| allowed scope | target repo `Cargo.toml`、六 crate `Cargo.toml/lib.rs`、workspace metadata、dependency check shell/fixture |
| forbidden scope | 业务 DTO/domain/state、runtime config values、真实 provider、SDK crate、jobs/outbox/publisher、scripts evidence |
| required checks | `cargo metadata`、package/name graph、Core symbol/path/lock inspection、`git diff --check`；目标仓缺失时保持 blocked |
| Gate posture | Design/Scope/Build/Test/Evidence/Commit/Handoff 均 `pending`；target repo/Core/`AR-ARCH-001` 未闭合则 `blocked` |

| 经验复核项 | 结论与处理 |
|---|---|
| path baseline / typed-ref owner scope | blocker：目标仓和 Core export 尚未核验；不能从规划树伪造 baseline |
| config/idempotency/query/state/history | 不适用：本 boundary 不定义业务 truth 或运行配置；若新增 carrier 必须回写设计 |
| phase boundary / dependency taxonomy | 通过设计检查：只允许六 role 与 Core candidate，L1/Bus/SDK/provider 均保持 runtime/event/ref/adapter/fake |

| 停审问题 | 设计层结论 |
|---|---|
| 是否可独立 review/回退？ | 是；只影响 workspace/path/dependency 壳 |
| 是否越界？ | 否；不包含业务对象和 provider |
| 是否可提交？ | 当前否；目标仓、baseline、Build/Test evidence 不存在 |

#### `commit-01-b-runtime-shell`

| 项 | 计划 |
|---|---|
| 一句话目标 | 建立 strict config、required slot、raw/report root 与脚本 capability 壳，不生成证据实例 |
| 编写顺序 | config schema/reader shell → runtime builder slot shell → gate/report/check CLI shape → path/redaction guard shell |
| 代码批次 | `BATCH-01-03` config/slot shell（100～300 行）；`BATCH-01-04` scripts/root capability（100～300 行；超过 300 行拆 gate/report/check） |
| required reads | `03` §13～§15；`04` §3～§11；`05` §8～§13；`06` §10；配置/观测 calibration |
| allowed scope | `infra/config.rs`、`runtime_builder.rs` 壳、实现仓 `scripts/gates|reports|checks` 接口声明、`artifacts/test/<run_id>`/`reports` path contract |
| forbidden scope | 真实 config values/secrets、provider selection、Bundle/EV/report 实例、owner material、outbound |
| required checks | strict parser unknown/duplicate key negative；required slot totality；CLI `--run-id --artifact-root --config-profile` shape；redaction/path static checks |
| Gate posture | `AR-03-LOCAL-004/005`、machine artifact schema 和 target repo 缺失时 blocked；不得以 sample config 宣称 assembled |

| 经验复核项 | 结论与处理 |
|---|---|
| config binding / disabled-degraded-unavailable | blocker：55-key schema、refs、numbers 未闭合；回写 `04` 后重核 |
| artifact materialization / machine JSON schema | blocker：writer/reader/schema/digest owner 尚无实现仓；只保留 capability shell |
| idempotency/outbox/query state | 不适用：本 boundary 不处理业务操作、Query 或 outbound |
| phase boundary | 通过：只建立壳，不生成 run/raw/report/EV |

| 停审 | 设计层保留；脚本能力与最终 evidence 明确分离，当前不得提交或生成输出实例 |

### 9.2 PH-02 Request admission / local consistency

#### `commit-02-a-admission-contracts`

| 项 | 计划 |
|---|---|
| 一句话目标 | 闭合 C01/C02 request/scope/job/stage public DTO、domain 初始状态和 admission result surface |
| 编写顺序 | typed refs/context → C01/C02 payload/result → `ArchiveRequest`/`RestoreRequest`/`ArchiveJob` factory → contract/domain tests |
| 代码批次 | `BATCH-02-01` refs/envelopes/commands/results（100～300 行）；`BATCH-02-02` request/job state/factory（150～300 行）；state/error negative 独立批次 |
| required reads | `03` §5～§9；Step 05/06/08/10；`05` COMMAND/OBJECT/STATE；`06` FUNC-001/007 |
| allowed scope | `contracts` command/request/result types；CP1/CP6 admission domain factory/invariant；contract/domain test fixtures |
| forbidden scope | durable repository fake、UoW commit、Query views、source capture、receiver resolution、archived/restored inference |
| required checks | DTO construction; wrong-kind/missing basis; initial-state legality; C01/C02 Accepted only local admission; no owner write/effect |
| Gate posture | local controlled slice may be `planned`; operation codec/formal authority/durable store remain `blocked` |

| 经验复核项 | 结论与处理 |
|---|---|
| field/DTO/state/ref identity | 开工前确认；缺 actor/scope/authority/version/source field 即回写 `03` |
| public target exhaustive / factory initial state | blocker if any variant lacks source or executable transition；不得由实现者补 enum |
| idempotency/UoW/history | `blocker` for mutation result persistence；本 boundary 只闭合 DTO/domain surface，不假定 storage |
| query/projection/outbox | 不适用；后续 boundary 或 blocked candidate 负责 |

| 停审 | DTO/domain 可独立 review；不把 local `Accepted` 升格为 owner approval、archived 或 restored |

#### `commit-02-b-local-consistency`

| 项 | 计划 |
|---|---|
| 一句话目标 | 闭合 reservation、UoW、CAS/read-set、完整 result replay、claim/fence 的本地一致性切片 |
| 编写顺序 | store/UoW traits → reservation/result typed save/get → request service flow → controlled store/fake → fault/race tests |
| 代码批次 | `BATCH-02-03` UoW/CAS/read-set（高风险独立批次）；`BATCH-02-04` idempotency/result replay（高风险独立批次）；`BATCH-02-05` C01/C02 service + claim/fence |
| required reads | `03` §10～§13；Step 09/11/13；`05` UOW/IDEMP/COMMAND；`06` state/TX/IDEM |
| allowed scope | `application` local ports/UoW/idempotency/result; controlled store fake; C01/C02 service and local handler; fault injection |
| forbidden scope | provider durability claim、owner DB、source/export、external effect、Query write, outbound |
| required checks | atomic request/job/stage/result; same/same replay; same/different Conflict; commit Unknown probe; CAS/range/negative/fence; fake parity markers |
| Gate posture | `AR-03-LOCAL-001/003/006` open => blocked; fake may prove controlled behavior only |

| 经验复核项 | 结论与处理 |
|---|---|
| metadata/idempotency/result typed save-get | 开工前确认；任何缺 key/channel/digest/result_ref 对称面均 blocker |
| optimistic version / sidecar / transaction probe | blocker until exact repository read and probe semantics closed |
| history/trace/audit accepted side effects | blocker if flow requires record without schema; no outbox because `AR-HLD-Q-001` open |
| query/source/material/restore | 不适用；未进入相应 Phase |

| 停审 | 只允许 local/controlled consistency；不得以 fake/durable parity宣称生产 atomicity 或 restart proof |

### 9.3 PH-03 Safe query / visibility / continuation

#### `commit-03-a-query-surfaces`

| 项 | 计划 |
|---|---|
| 一句话目标 | 闭合 Q01～Q05 safe view、visibility resolution、API query-only facade 和 strict no-write |
| 编写顺序 | query request/view/page schema → visibility resolver/read port → query assembler → API query handler → write/effect spies |
| 代码批次 | `BATCH-03-01` five request/view/marker DTO（100～300 行，按 query family 分批）；`BATCH-03-02` visibility/read assembler；`BATCH-03-03` API handler/no-write tests |
| required reads | `03` §5.3/§7.2/§8.3/§14；Step 08/09/15；`05` QUERY/SECURITY/OBSERVE；`06` FUNC-006/NFR-002 |
| allowed scope | `ArchiveQueryService`、read-only port wrapper、safe view DTO mapping、query handlers、zero-write/effect spy |
| forbidden scope | `ArchiveStorePort::begin`、reserve/result save、capture/verify/retrieve/probe/repair/cache/audit write、private cursor exposure |
| required checks | one committed snapshot; current visibility first; visible/not-available/partial/stale/blocked/unknown; telemetry on/off write count zero |
| Gate posture | local planned; `AR-03-LOCAL-002/005` and visibility formal contract remain blocked for positive continuation |

| 经验复核项 | 结论与处理 |
|---|---|
| Query response/status marker/visibility resolution | blocker if any view field, empty-page seed or degraded mapper lacks source |
| projection-backed lookup / generic vs typed ref | blocker when query needs stable view ref but no formal lookup exists |
| idempotency/UoW/outbox | 不适用 by design：Query must not reserve or write |
| phase boundary | 通过；后续 capture/restore material cannot be invoked from Query |

| 停审 | Query no-write is a hard boundary; any write/effect means boundary failed and cannot advance |

#### `commit-03-b-cursor-visibility`

| 项 | 计划 |
|---|---|
| 一句话目标 | 闭合 public/private cursor mapping、continuation、redaction 和 snapshot/restart fail-closed 姿态 |
| 编写顺序 | cursor carrier/mapping → authenticated/durable strategy (pending) → page validation → tamper/restart tests |
| 代码批次 | `BATCH-03-04` mapping schema；`BATCH-03-05` continuation validation/failure mapping；`BATCH-03-06` security/restart tests |
| required reads | `03` §7.2/§10～§12；Step 10/12/13；`05` CURSOR/SECURITY/REPORT；`06` QUERY/RL/EVID |
| allowed scope | cursor mapping carrier, query page validation, visibility/redaction negative tests, blocked continuation result |
| forbidden scope | ad-hoc base64/JSON codec, private cursor in API, cross-snapshot merge, durable key choice without authority |
| required checks | selector/principal/visibility/snapshot/order/read-model binding; mismatch/expired/tamper -> typed issue; restart cannot resurrect visibility |
| Gate posture | `AR-03-LOCAL-002` open => blocked; no positive continuation claim |

| 经验复核项 | 结论与处理 |
|---|---|
| public/private cursor and page Empty visibility seed | blocker until codec/mapping/resolver source is formalized |
| Query no-write / redaction | applicable and must be rechecked; any telemetry or cursor path write is failure |
| idempotency/history/outbox | 不适用；Query 不持久化 result/history/outbox |

| 停审 | 仅 fail-closed mapping可规划；不得把 marker existence 当 continuation proof |

### 9.4 PH-04 Source capture / Bundle exact closure

#### `commit-04-a-source-capture`

| 项 | 计划 |
|---|---|
| 一句话目标 | 为八类 source 建立 per-owner binding/capture/coverage/finding 与受控反馈闭环 |
| 编写顺序 | source-authority typed matrix → binding/attempt domain → E02/J02～J04 service/receipt → controlled source doubles → negative tests |
| 代码批次 | `BATCH-04-01` source class/authority carriers；`BATCH-04-02` binding/attempt/coverage state；`BATCH-04-03` capture/reconcile flow；authority/redaction tests 独立 |
| required reads | `00` §7/§11；`01` §5/§8；`03` §7.5/§8.4；owner `00～06`；`05` AUTHORITY/CONSUMER/JOB；`06` RL-001～006 |
| allowed scope | source binding/capture objects, source export port contract, E02, J02/J03/J04, controlled owner doubles, material/ref provenance records |
| forbidden scope | unified owner schema, workspace canonical fallback, owner DB write, source success without version/fence/coverage, blind recapture |
| required checks | each source class authority/requiredness; stale/missing/conflicting/unknown; wrong fence/attempt; Auxiliary preserved; exact material/ref boundary |
| Gate posture | `AR-UP-001/008` and source formal contracts open => blocked; negative/local only |

| 经验复核项 | 结论与处理 |
|---|---|
| source/material authority and typed ref identity | blocker until every owner contract and coverage vector is formal |
| history/trace/sidecar/UoW | applicable; capture attempt, coverage, finding, receipt and result must save/get symmetrically |
| Query/projection/rebuild | 不适用 except no-write regression; capture cannot call Query repair |

| 停审 | per-source isolation passes only at design level; workspace cannot complete another source |

#### `commit-04-b-bundle-closure`

| 项 | 计划 |
|---|---|
| 一句话目标 | 从 frozen inventory 形成 immutable manifest、declared/actual exact closure、seal basis 与 findings |
| 编写顺序 | manifest/entry schema → closure evaluator → J05 assemble → J06 seal guard → range/negative fault tests |
| 代码批次 | `BATCH-04-04` manifest/entry; `BATCH-04-05` closure/findings; `BATCH-04-06` seal guard/range tests |
| required reads | `03` §7.4/§9/§10；Step 06/10/11/16；`05` OBJECT/STATE/UOW/JOB；`06` FUNC-003/TX |
| allowed scope | Bundle/manifest/entry/closure domain and local service; frozen inventory sidecar; J05/J06 local jobs |
| forbidden scope | digest/signature success, storage placement, verification result, project archived/approved, phantom/missing suppression |
| required checks | declared vs actual exact difference; immutable revision; missing/extra/race; range/negative read-set; seal only with exact basis; no half revision |
| Gate posture | owner material/durable range and `AR-UP-001/006/008` open => blocked |

| 经验复核项 | 结论与处理 |
|---|---|
| immutable revision/sidecar/read-set | applicable; absent basis or missing typed read is blocker |
| artifact materialization / digest | blocker; no algorithm/key/provider selected |
| projection rebuild / Query | not applicable to closure truth; Q02 may only read committed closure later |

| 停审 | ClosureReady/Sealed remain Archive-local postures; never infer archived/approved or storage commitment |

### 9.5 PH-05 Integrity / compatibility assessment

#### `commit-05-a-assessment-contracts`

| 项 | 计划 |
|---|---|
| 一句话目标 | 闭合 verification/compatibility assessment DTO、target selector、finding、posture 与 Q03 safe surface schema |
| 编写顺序 | fixed input/target carriers → assessment/finding domain schema → J07/J08 report DTO → Q03 view mapping contracts → negative fixtures |
| 代码批次 | `BATCH-05-01` verification types; `BATCH-05-02` compatibility target/schema types; `BATCH-05-03` finding/report/view mapping |
| required reads | `03` §5.1/§5.2/§7.2/§8.3/§9；Step 06/07/08/10；`05` OBJECT/QUERY/JOB；`06` FUNC-004/NFR |
| allowed scope | contracts/domain assessment/finding/target selectors; typed error/posture; Q03 response schema without executing assessment |
| forbidden scope | digest/signature/KMS/encryption/compression algorithm; provider response parser; Verified claim; automatic migration |
| required checks | target-specific input identity; Unknown/Unsupported/IntegrityFailed/Blocked variants; new assessment for new input; no cross-target reuse |
| Gate posture | `AR-UP-004` open => controlled-only; formal positive blocked |

| 经验复核项 | 结论与处理 |
|---|---|
| support carrier/schema and public target exhaustive | blocker if any target/finding/posture variant lacks field/source/test mapping |
| DTO/replay/read surface | applicable; reports and Q03 view must have typed save/get or explicit read-only source |
| effect/UoW/receiver | not applicable to contract-only boundary |

| 停审 | contracts can be reviewed without claiming assessment result; no static `Verified` fixture may be evidence |

#### `commit-05-b-assessment-execution`

| 项 | 计划 |
|---|---|
| 一句话目标 | 执行 J07/J08 的 fixed input assessment、保存 immutable assessment/finding，并让 Q03 只读重放 |
| 编写顺序 | assessment UoW/read/write → capability port mapping → J07/J08 service/report → Q03 read binding → fault/replay tests |
| 代码批次 | `BATCH-05-04` assessment repository/UoW; `BATCH-05-05` capability controlled adapter and service; `BATCH-05-06` Q03/replay/fault |
| required reads | `03` §7.2/§8.3/§9/§11；Step 09/11/12/13；`05` QUERY/JOB/EFFECT；`06` FUNC-004/STATE-007 |
| allowed scope | Bundle revision/target assessment flow, typed capability port, immutable result/report, Q03 matching committed assessment |
| forbidden scope | Query-triggered re-assessment, overwrite old assessment, auto-migrate, algorithm/key invention, storage/lifecycle/restore dispatch |
| required checks | fixed input saved before capability call; typed outcome; duplicate report replay; assessment identity/target match; Q03 zero effect |
| Gate posture | `AR-UP-004`, `AR-03-LOCAL-003/004` open => blocked; controlled negative only |

| 经验复核项 | 结论与处理 |
|---|---|
| intent/result/report/UoW | applicable; missing typed save/get or unknown mapping blocks |
| adapter failure outcome classification | blocker until port enum maps invalid/unavailable/unknown without string parsing |
| Query material degraded mapper | applicable to Q03; dedicated source required, not service-synthesized |
| source-authority/restore | not applicable beyond exact Bundle/target refs |

| 停审 | assessment outcome is target-specific and immutable; local controlled result never unlocks formal Verified/Supported |

### 9.6 PH-06 Placement / retrieval / lifecycle execution

#### `commit-06-a-placement-retrieval`

| 项 | 计划 |
|---|---|
| 一句话目标 | 以 intent-before-effect 闭合 placement/retrieval、dispatch knowledge、probe/reconcile 和 effect history |
| 编写顺序 | placement/effect schema → intent UoW → storage port mapping → J09/J10/J12 → fault/unknown tests |
| 代码批次 | `BATCH-06-01` placement/effect carriers; `BATCH-06-02` intent/result UoW; `BATCH-06-03` storage/reconcile controlled flow; effect/race tests |
| required reads | `03` §7.3/§8.5/§9～§12；Step 09/11/13；`05` EFFECT/JOB/UOW；`06` FUNC-005/TX |
| allowed scope | ArchivePlacement, ExternalActionRecord, storage port, C03 placement subset only if decision basis present, J09/J10/J12 |
| forbidden scope | provider choice, ACK=commit, blind retry, delete/retention decision, owner DB, Bundle Sealed=archived |
| required checks | immutable intent before external call; `NotDispatched/MayHaveDispatched`; exact external key; probe/reconcile; placement vs retrieval axes separate |
| Gate posture | `AR-UP-005` and durable store open => blocked; controlled fault only |

| 经验复核项 | 结论与处理 |
|---|---|
| external effect key/input/dispatch outcome | blocker if port lacks typed outcome or persisted intent sidecar |
| transaction/unknown/idempotency | applicable; no retry without exact probe and original key |
| governance policy/retention | not applicable in this boundary; lifecycle decision remains next boundary |

| 停审 | no external finality claim; commit/retrievable/compensated remain separate postures |

#### `commit-06-b-lifecycle-governance`

| 项 | 计划 |
|---|---|
| 一句话目标 | 在 current governance decision/hold 下闭合 lifecycle execution，同时保持 retention/delete/risk authority 外置 |
| 编写顺序 | GovernanceDecisionRef/applicability read → lifecycle state/effect → C03 admission/J11 → J12 route → governance conflict tests |
| 代码批次 | `BATCH-06-04` decision binding/current recheck; `BATCH-06-05` lifecycle UoW/effect; `BATCH-06-06` reconcile/hold/conflict tests |
| required reads | `00` §10/§11；`03` §7.3/§8.5/§9/§11；`04` §7/§11/§13；`06` RL-003/009/13；L1-governance owner docs |
| allowed scope | GovernanceDecisionRef, LifecycleExecution, lifecycle decision-bound service, E03/E04 lifecycle route, J11/J12 |
| forbidden scope | define RetentionPolicy/legal hold/delete/risk, infer project status, dispatch without current decision, outbound |
| required checks | decision applicability/version/hold recheck at dispatch; stale/conflicting/missing -> Blocked; external unknown exact reconcile; no policy fallback |
| Gate posture | `AR-UP-002/003/005` open => blocked; governance owner proof required |

| 经验复核项 | 结论与处理 |
|---|---|
| validation truth / policy executable summary | blocker until owner decision port returns typed current applicability/hold/delete authority |
| accepted side effect/history | applicable; lifecycle execution/action/history/result fields must be symmetric |
| outbox/projection | not applicable and explicitly absent under `AR-HLD-Q-001` |

| 停审 | Archive records execution knowledge only; it never becomes policy authority or project lifecycle owner |

### 9.7 PH-07 Restore plan / material / owner handoff

#### `commit-07-a-restore-plan`

| 项 | 计划 |
|---|---|
| 一句话目标 | 冻结 Bundle revision、non-empty unique owner set、eligibility 与 per-owner immutable restore plan/items |
| 编写顺序 | restore request/owner set → plan/item schema → compatibility/eligibility read → J13 → plan revision/race tests |
| 代码批次 | `BATCH-07-01` restore request/plan/item contracts; `BATCH-07-02` eligibility/receiver mapping carrier; `BATCH-07-03` J13 and immutable revision tests |
| required reads | `00` §7/§10～§12；`03` §7/§8/§9/§11/§12；Step 08/09/10/12；`05` RESTORE/JOB；`06` FUNC-007/RL |
| allowed scope | RestoreRequest/Plan/Item, owner set/receiver mapping refs, J13 BuildRestorePlan, eligibility findings |
| forbidden scope | material body generation, receiver dispatch, owner DB/import, cross-owner transaction, restore success/project state |
| required checks | exact Bundle revision; unique complete owner set; mapping drift => new plan revision; stale/missing/integrity/unsupported fail closed |
| Gate posture | `AR-UP-006/009` open => blocked; no plan Ready without formal prerequisites |

| 经验复核项 | 结论与处理 |
|---|---|
| public target/owner set exhaustive / ref-scope | blocker if owner set expansion/read source or empty semantics absent |
| state/UoW/idempotency | applicable; plan/item version and duplicate report surface required |
| artifact materialization | not applicable until material boundary; only refs/eligibility findings |

| 停审 | plan is Archive-owned coordination truth; it grants no cross-domain write permission |

#### `commit-07-b-restore-handoff`

| 项 | 计划 |
|---|---|
| 一句话目标 | 逐 owner 形成 approved material binding、handoff intent、typed outcome、compensation 与完整 replay |
| 编写顺序 | material eligibility/sidecar → J14 prepare → receiver resolve/dispatch J15 → E05/J16 feedback → J17 compensation → isolation tests |
| 代码批次 | `BATCH-07-04` material/ref sidecar; `BATCH-07-05` handoff intent/effect; `BATCH-07-06` outcome/compensation/replay/redaction |
| required reads | `03` §7.5/§8.5/§9～§12；Step 11/12/15；`05` RESTORE/EFFECT/AUTHORITY/REPORT；`06` FUNC-008/009/EVID；receiver owner docs |
| allowed scope | approved material/ref binding, RestoreHandoff/HandoffOutcome/CompensationRecord, J14～J17, E05, per-owner reports |
| forbidden scope | body/lineage invention, direct owner DB, receiver fallback, ACK=commit, item success=restored, cross-owner transaction |
| required checks | dispatch-time exact receiver match; intent before effect; per-owner CAS/history; partial/stale/missing/conflicting/unsupported/integrity/unknown; compensation authority and original outcome preservation |
| Gate posture | `AR-UP-006/009`、`AR-UP-007` formal material/evidence open => blocked |

| 经验复核项 | 结论与处理 |
|---|---|
| artifact materialization / receiver outcome classification | blocker until owner material schema, receiver port outcome enum and typed save/get are formal |
| handoff/export marker subject / evidence | blocker if trace subject, raw/report path or redaction source absent |
| Query/projection/rebuild | not applicable; Q04/Q05 only read committed handoff history |

| 停审 | no receiver commit or restored claim; compensation never overwrites original failure/unknown |

### 9.8 PH-08 Fixed-run evidence / formal handoff

#### `commit-08-a-local-evidence`

| 项 | 计划 |
|---|---|
| 一句话目标 | 建立 gate/check/report capability 和 minimal evidence index shell，只读真实 raw，不生成静态 pass |
| 编写顺序 | gate orchestration → artifact schema/writer checks → report generator shell → minimal evidence index/link/redaction checks |
| 代码批次 | `BATCH-08-01` gate script capability（100～300 行）；`BATCH-08-02` artifact/report schema checks（100～300 行）；`BATCH-08-03` minimal index shell |
| required reads | `05` §9/§13/§14；`06` §10/§12；Step 09/13；machine artifact/evidence standards |
| allowed scope | scripts/gates/reports/checks capability、raw/report path/schema validation、minimal index links and failure summaries |
| forbidden scope | run/artifact/report/EV instance、VETO clean/pass、acceptance verdict/signoff/risk acceptance、business feature |
| required checks | CLI precedence; raw-first; same-run pairing; schema/digest/redaction/link/no-static/no-latest/blocked-lane checks |
| Gate posture | capability-only planned; target repo and machine artifact JSON schema absent => no evidence gate pass |

| 经验复核项 | 结论与处理 |
|---|---|
| artifact materialization / machine JSON schema | blocker until exact schema, digest/canonicalization and writer/reader owners exist |
| report evidence maturity | applicable; only script capability/minimal index shell, not final EV pages |
| domain/query/outbox | not applicable; no business truth or outbound |

| 停审 | shell may fail closed and explain missing raw; it cannot produce an EV or verdict instance |

#### `commit-08-b-formal-handoff`

| 项 | 计划 |
|---|---|
| 一句话目标 | 在所有 required seam、实现和 fixed run 成立后形成 formal evidence/acceptance handoff 输入 |
| 编写顺序 | verify closure manifest → run all required suites/gates → raw finalize → reports/EV → acceptance drafts → named review |
| 代码批次 | `BATCH-08-04` fixed-run orchestration；`BATCH-08-05` final EV/report mapping；`BATCH-08-06` acceptance handoff/review package |
| required reads | 全部正式 `00～07`；`05` §9/§13/§14；`06` §3/§4/§10/§11/§13/§14；Step 12/13 |
| allowed scope | 只读汇总真实 fixed-run raw/report、blocked-lane and owner closure references、acceptance draft generation |
| forbidden scope | 新业务功能、生产 adapter、静态 passed、跨 run 拼接、替 owner 关闭 blocker、risk/signoff/readiness 自批 |
| required checks | 13 suites/5 gates/102 TC/19 EV/10 VETO exact denominator; same-run/digest/redaction/dependency/report audit; named review |
| Gate posture | 永久 blocked until all upstream/local blockers, target repo, baseline, run and reviewers exist |

| 经验复核项 | 结论与处理 |
|---|---|
| evidence source/EV/acceptance materialization | blocker while raw/run/schema/owner closure absent |
| VETO/risk/signoff | blocker; generated draft cannot be verdict or acceptance |
| phase boundary | through design: no new business capability; only evidence/handoff of prior phases |

| 停审 | formal handoff is a future evidence boundary, not current completion; all instances remain zero |

## 10. Boundary 台账字段与未来 skeleton 规则

Step 13 创建 boundary skeleton 时，每个 `implementation-boundaries/<boundary_id>.md` 必须至少复制下列字段；当前 Step 不提前创建 skeleton：

```text
project = L4-archive
boundary_id = <one of 16 ids>
design_baseline = pending
implementation_repo = /home/aris/Projects/quantalithos-archive
status = planned | blocked | waiting
next_allowed_action = wait_until_current
required_reads = Step 3 matrix + boundary-specific reads
allowed_scope = exact planned files/rules
forbidden_scope = phase/owner/provider/outbound exclusions
required_checks = boundary-specific commands/cases/reports
design_gate = pending
scope_gate = pending
worktree_gate = pending
build_gate = pending
test_gate = pending
evidence_gate = pending | not_applicable (with reason)
commit_gate = pending
handoff_gate = pending
planned_commit_message = pending
committed_hash = pending
blockers = open IDs; no closure claim
```

唯一 current boundary 规则：未来项目级台账只能激活一个 boundary；其余 skeleton 为 `planned / wait_until_current` 或 `blocked / wait_until_current`。没有 baseline、真实目标仓或用户实施授权时，不得把任何 skeleton 改为 `implement`、`pass`、`committed` 或 `handoff`。

## 11. Phase / boundary 停审总表

| Phase / boundary | 一句话是否成立 | 可独立 review/验证/回退 | 经验复核 | 当前停审结论 |
|---|---|---|---|---|
| PH-01 / 01-a | 是 | 是 | path/dependency applicable；业务面不适用 | `blocked` by repo/Core |
| PH-01 / 01-b | 是 | 是 | config/artifact applicable | `blocked` by schema/repo |
| PH-02 / 02-a | 是 | 是 | DTO/state applicable | `planned local-only` |
| PH-02 / 02-b | 是 | 是 | UoW/idempotency applicable | `blocked` by local pending |
| PH-03 / 03-a | 是 | 是 | Query/no-write applicable | `planned local-only` |
| PH-03 / 03-b | 是 | 是 | cursor/visibility applicable | `blocked` by cursor authority |
| PH-04 / 04-a | 是 | 是 | source/material applicable | `blocked` by owner contracts |
| PH-04 / 04-b | 是 | 是 | closure/read-set applicable | `blocked` by material/durable |
| PH-05 / 05-a | 是 | 是 | assessment contract applicable | `planned controlled-only` |
| PH-05 / 05-b | 是 | 是 | execution/UoW/adapter applicable | `blocked` by integrity/local |
| PH-06 / 06-a | 是 | 是 | effect/unknown applicable | `blocked` by storage |
| PH-06 / 06-b | 是 | 是 | governance/effect applicable | `blocked` by governance/storage |
| PH-07 / 07-a | 是 | 是 | owner-set/state/UoW applicable | `blocked` by artifact/receiver |
| PH-07 / 07-b | 是 | 是 | material/receiver/evidence applicable | `blocked` by artifact/receiver |
| PH-08 / 08-a | 是 | 是 | artifact/report applicable | `planned capability-only` |
| PH-08 / 08-b | 是 | 是 | formal/evidence/VETO applicable | `blocked` until fixed run |

以上是设计层停审，不是实现停审；未来实现必须在 boundary ledger 中以真实命令和 evidence 重新执行。

## 12. 跨 boundary 粒度、依赖与门禁审计

| 审计项 | 结论 | 处理/限制 |
|---|---|---|
| boundary 是否按可验证功能而非文件/函数 | 通过 | 16 个 boundary 均用归档/恢复能力命名 |
| PH-05 分母是否一致 | 通过 | Step 3、Step 5、Step 6 均为 `05-a contracts` + `05-b execution` |
| 是否存在 phase 越界 | 通过设计审计 | Query 不触发 capture/effect；restore 不提前进入 source/owner DB；PH-08 不新增业务 |
| 高风险逻辑是否独立批次 | 通过 | UoW/CAS/idempotency/effect/cursor/redaction/evidence 单独批次或明确 blocker |
| 每 boundary 是否有 allowed/forbidden scope | 通过 | §9 每项列明；未来 skeleton 再复制精确路径 |
| 每 boundary 是否有 required checks 和 Gate | 通过计划层 | 当前均 pending/blocked，无任何 pass |
| source-authority 是否完整 | 通过边界审计 | 八 source 全部指向 owner；workspace 明确 Auxiliary |
| dependency taxonomy 是否污染 | 通过 | 只有 Core candidate compile；owner/Bus/SDK/provider/storage/receiver 维持 runtime/event/ref/adapter/fake |
| outbound 是否误建 | 通过 | `AR-HLD-Q-001` 下没有 boundary；后续若解锁必须回退设计 |
| evidence 是否可能静态伪造 | 已阻断设计 | PH-08 从真实 raw 派生；当前实例为 0 |
| blocker 是否有 owning project/回写 owner | 通过 | 18 项持续 blocker 绑定至 boundary；不得本仓自批 |
| 当前是否可移交实现 | 否 | 目标仓、baseline、formal seam、local pending 未闭合；Step 6 完成不等于 handoff |

## 13. 回填草稿、待确认与进入 Step 7 条件

正式 `07` §6 应保留：统一编码顺序、16 个 boundary 总表、每个 boundary 的任务/批次/scope/门禁/经验复核、停审总表和跨 boundary 审计。可压缩文字，但不得删除 PH-05 分拆、Query no-write、owner boundary、fake 上限、planned skeleton 规则和 blocker 回写责任。

| 事项 | 当前姿态 | 下一处理 |
|---|---|---|
| target implementation repo / baseline | blocked | Step 8/13 继续登记，不创建 |
| Core contract export/lock | blocker | PH-01 activation 前由 owner 核验 |
| source/integrity/storage/governance/artifact/receiver seams | blocker | 对应 boundary 激活前由 owning project 闭合 |
| operation codec/cursor/durable UoW/config schema/telemetry | local pending | `AR-03-LOCAL-001～006` 保持 blocked |
| exact TC/EV/AC/VETO per boundary | pending by design | Step 7 展开，不能在本 Step 伪造执行 |

进入 Step 7 的条件已满足：16 个 boundary 均有任务、编写顺序、批次、allowed/forbidden scope、required checks、经验复核和停审；跨 boundary 审计无未解释的设计冲突。`next_allowed_action = create_and_complete_step_07_test_acceptance_gates`。
