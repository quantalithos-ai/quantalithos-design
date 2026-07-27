# L3-capability-hub 06 验收标准 Step 5: 定义功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/验收标准书写规范.md` §5.5
> 回填章节: `06-验收标准.md` §5
> Step 状态: `completed-designed / not-evaluated / continuous execution`
> 日期: 2026-07-26

本文把五个核心能力闭环、十六个 P0 功能需求和外围增强隔离条件转成可裁决门禁。所有 `TC-CH-*`、`DS-CH-*`、`EV-CH-*` 均为正式测试、数据和证据合同，不表示实现、运行或证据实例已经存在；正式 `06-验收标准.md` 仍只在 Step 15 整体重建。

---

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 功能主轴 | `AC-CH-001..005` 五个闭环；`AC-CH-006..021` 一对一承接 `FR-CH-001..016`；`AC-CH-022` 隔离 `FR-CH-E01..E07` |
| 直接设计输入 | formal `03` §§5~8 的对象、协议与 83 条 exact flow；DDD Step 9 函数级流 |
| 测试输入 | 189 个 `TC/DS/EV` 合同中的功能相关子集；固定 raw/report roots |
| 本步输出 | 22 个功能验收项、逐项闭环、逐项停审、跨功能裁决审计、P1/P2 后置边界 |
| 不在本步 | AC023 以后规则、数据、接口同步、状态/TX、NFR、证据完整性、VF、缺陷、风险、签署的 primary adjudication |
| 当前事实 | implementation/run/artifact/report/evidence/verdict/signoff 均不存在或未建立；所有功能项为 `not_evaluated` |

功能验收只验证 Capability Hub 自身拥有的 identity、registry、descriptor、governance result seam、access-review separation、method body-free relation、formal exposure、trace/impact、controlled consumer view 和 SDK server exposure boundary。runtime/tools execution、governance approval、method body、marketplace listing、provider route/cost/quota/secret body、SDK client/cache 和 observability backend 只能作为负向边界，不得成为正向成功终点。

## 2. 本步输入

| 输入 | 本步承接 | 不得推断 |
|---|---|---|
| `00-需求文档.md` §§9/14 | 5 个闭环、16 个 FR、22 个本步 AC 的原始语义 | 需求已实现 |
| `03-详细设计.md` §§7~8 | C01~26、Q01~33、I01~06、O01~10、J01~08 正式名称与处理边界 | 协议或仓库已存在 |
| `03_ddd_step_09_function_flows.md` | exact callable、UoW、zero-effect、错误与恢复分支 | 执行通过 |
| `05_test_plan_step_05_traceability_coverage.md` | FR/AC 到 exact cut 的正反向映射 | 验收结论 |
| `05_test_plan_step_06_cases.md` | 189 canonical TC、oracle、zero-effect 与 failure localization | 测试已执行 |
| `05_test_plan_step_07_test_data.md` | 189 DS，flow DS 与 TC ordinal 对称 | fixture 已生成 |
| `05_test_plan_step_13_evidence.md` | 189 EV、same-run instance predicate、固定路径和 consumer contract | alias、digest 或 report 存在 |
| Step 4 | entry/exit、blocked/invalid/not-evaluated、P0/P1/R4 分层 | 当前已进入验收 |

## 3. SOP 八问回答

| # | 问题 | 收口答案 |
|---:|---|---|
| 1 | 每个 P0 功能的通过条件是什么？ | 对应 AC 的 exact positive、negative、boundary 和 zero-effect oracle 均由同一显式 run 的 canonical TC/DS/EV instance 满足；设计主语、状态、effect/ref 和 forbidden call 均与 formal 03 一致。 |
| 2 | 每个 P0 功能的失败条件是什么？ | 任一 required case non-pass、DS/EV 缺失或无效、正式对象/flow 不对称、禁止 truth/write/body/call 出现、P1 结果替代 P0，均使该项失败或不可裁决。 |
| 3 | 证据来自哪里？ | `artifacts/test/<run_id>/suites/<suite>/cases/<tc-id>.json`、同 suite raw/result、`reports/runs/<run_id>/suites/<suite>.md` 与 `reports/runs/<run_id>/evidence-index.md`；每行固定 TC/DS/EV selector。 |
| 4 | 哪些 P1 只做后置边界？ | 管理入口、搜索/浏览优化、候选自动发现、安全摘要深化、SDK 说明、只读生态发现、审计导出以及任何 real product/staging/production/capacity/SLO claim。 |
| 5 | 哪些功能失败导致总体不通过？ | 22 个 P0 功能门禁任一真实失败均阻断“通过”；缺证据、blocked 或 invalid 使验收不可裁决。是否命中一票否决由 Step 11 按 `VF-CH-*` 再裁决。 |
| 6 | 是否回指完整闭环？ | 是。每项固定 requirement/AC、formal design、TC、DS、EV、raw/report path、pass/fail 和 verdict impact。 |
| 7 | 每项是否停审？ | 是。§8 对 22/22 项逐一检查正式来源、固定证据、可判定条件、后续 phase 污染和正式名称。 |
| 8 | 是否有缺门禁、证据重复或冲突？ | 设计静态审计为 missing=0、primary owner conflict=0、P1 contamination=0；共享 EV 只作为多 AC 的合法 consumer，不产生第二 evidence instance 或重复执行分母。 |

## 4. 当前材料问题与裁决取舍

### 4.1 问题诊断

| 问题 | 风险 | 本步处理 |
|---|---|---|
| 旧 formal 06 以 ProviderContract、CapabilityDecision、CostRecord 等旧对象验功能 | 重新引入错误 truth owner | 完全隔离；只采用 active formal 00/03/05 的 `CH` 主线 |
| “主链可用”缺 exact evidence selector | 无法判定单项通过 | 22 项分别绑定 TC/DS/EV 与 suite/report path |
| release smoke 容易代替明细 case | 代表链掩盖 83 flow 缺口 | smoke 只作 R4 辅助；不能补偿 canonical Command/Query/Inbound/Outbound/Job evidence |
| 外围功能存在与否混入 P0 | P1/P2 反向定义核心通过 | AC022 只验 absent-does-not-block 与 present-does-not-write-core 两类条件 |
| shared test 被误判为重复 evidence | 重跑或统计膨胀 | 一个 canonical EV instance 可有多个 AC consumer；primary suite 和 run-scoped identity仍唯一 |

### 4.2 裁决取舍

| 议题 | 取舍 | 原因 |
|---|---|---|
| 核心闭环是否只引用 5 个 smoke scenario | 否；闭环必须消费组成 FR 的完整 canonical selector，smoke 只作阅读入口 | 闭环通过不能掩盖成员失败 |
| AC006~021 是否按 UI 操作重命名 | 否；保留正式 FR/对象/协议语义 | 当前没有 selected UI，且 UI 不是 truth owner |
| P1 已实现能否补偿 P0 failed | 否 | peripheral/real-like 证据不能改变 P0 oracle |
| expected typed unavailable 是否等于功能失败 | 仅当测试 oracle 期望该 typed unavailable 时可形成 case pass；P0 prerequisite unavailable 仍为 blocked | 区分业务语义与环境缺失 |
| 是否在本步裁决 VF | 否；记录可能影响，Step 11 作唯一 VETO primary adjudication | 保持 SOP Step 独立 |

## 5. 证据选择与裁决公共合同

### 5.1 Canonical selector 记法

以下表中的 `TC/DS/EV selector` 是闭区间或显式集合。每个选中 `TC-CH-<F>-NNN` 必须与同 ordinal `EV-CH-<F>-NNN` 一对一；flow 数据按以下规则转换：

```text
CMD NNN      -> DS-CH-FLOW-C-NNN
QUERY NNN    -> DS-CH-FLOW-Q-NNN
INBOUND NNN  -> DS-CH-FLOW-I-NNN
OUTBOUND NNN -> DS-CH-FLOW-O-NNN
JOB NNN      -> DS-CH-FLOW-J-NNN
other family -> DS-CH-<FAMILY>-NNN
```

每个 selector 的固定证据入口：

```text
raw case    = artifacts/test/<run_id>/suites/<primary-suite>/cases/<tc-id>.json
suite raw   = artifacts/test/<run_id>/suites/<primary-suite>/suite-result.json
suite report= reports/runs/<run_id>/suites/<primary-suite>.md
index       = reports/runs/<run_id>/evidence-index.md
```

`<primary-suite>` 只能取 formal 05 已固定的十个 suite；路径模板不是证据存在声明。

### 5.2 公共 pass/fail 规则

| 规则 | 可裁决条件 |
|---|---|
| pass | selector 内每个 required TC 均有同 run DS/EV instance，case raw、suite raw/report、digest、pairing、redaction和consumer refs完整；case/suite/gate status为真实 raw-derived `passed`；所有 positive、negative、zero-effect oracle满足。 |
| fail | 任一 required oracle真实违反，出现错误 truth owner、forbidden body/write/call、正式字段/状态/flow不对称，或 suite/case真实状态为 `failed|timed_out|flaky_detected|cancelled`。 |
| not decidable | missing/duplicate/cross-run/static/manual evidence、`invalid_artifact`、P0 `blocked_dependency`、selector cell缺失、review未完成或 baseline drift。 |
| verdict impact | fail 阻断总体“通过”；not decidable 阻断最终裁决；只有 Step 13 合法残余和 Step 14 授权流程才能形成“有条件通过”，本步不得自行降级。 |

## 6. 五个核心闭环功能门禁

| AC | 闭环 / 正式设计契约 | TC / DS / EV selector | 通过条件 | 失败条件 | Primary reports / 裁决影响 |
|---|---|---|---|---|---|
| `AC-CH-001` | C-CH-1；formal 03 identity/access-review objects；C01~04、Q01~03、I04、O01；S01~02 | CMD `001..004`;QUERY `001..003`;INBOUND `004`;OUTBOUND `001`;STATE `001..002`;TX `{002,008..010,015,022}`；对应 exact DS/EV | MCP/A2A/API source 只形成 body-free source ref；同一 stable `CapabilityIdentity` 可被后续 registry/descriptor/seam/relation/exposure引用；correction/retire/review显式且 duplicate replay/zero-effect成立。 | URL/provider/tool/runtime/SDK/listing替代 identity；read/consumer/derived 隐式合并拆分；review形成 approval；任一成员 selector非通过。 | `service-command-query`,`entry-inbound`,`outbound-collaboration`,`domain-state`,`repository-transaction` + evidence index；失败阻断。 |
| `AC-CH-002` | C-CH-2；registry/lifecycle/visibility/reconciliation；C05~08/C19、Q04~06/Q15~17/Q24~28、J01/J03/J06、O02 | CMD `{005..008,019}`;QUERY `{004..006,015..017,024..028}`;OUTBOUND `002`;JOB `{001,003,006}`;STATE `{003,009,010,014..017,024}`;TX `001..007,013,014,020,021` | registry锚定 stable identity；lifecycle/visibility语义可区分；维护/派生/对账只产 body-free material/report，不创建或修复 core truth。 | registry退化为 allowlist/cache/listing/runtime state；maintenance、projection或report反写 registry；current/history/source不对称；selector缺失或失败。 | `service-command-query`,`outbound-collaboration`,`jobs-lifecycle`,`domain-state`,`repository-transaction` + index；失败阻断。 |
| `AC-CH-003` | C-CH-3；descriptor/safe summary/ref；C09~12、Q07~10、I06、O03；S04~06 | CMD `009..012`;QUERY `007..010`;INBOUND `006`;OUTBOUND `003`;STATE `004..006`;OBS `{006..008,012}` | 已注册能力形成 body-free MCP/A2A/API `AdapterDescriptor`；risk/constraint、secret ref与safe summary可解释且 owner/source/ref 对称；replace显式。 | ProviderContract/runtime/quota/route/cost/failover/retry或secret/document body进入对象、协议、store、event/report；selector非通过。 | `service-command-query`,`entry-inbound`,`outbound-collaboration`,`domain-state`,`observability-redaction` + index；失败阻断。 |
| `AC-CH-004` | C-CH-4；access review、governance seam、method relation、trace/impact；C04/C13~17/C22~23、Q11~14/Q20~23、I01~02、O04~05/O08；S02/S07~08/S11~13 | CMD `{004,013..017,022..023}`;QUERY `011..014,020..023`;INBOUND `001..002`;OUTBOUND `{004,005,008}`;STATE `{002,007,008,011..013}`;OBS `012` | review、governance result ref/seam、method asset ref/body-free relation和trace/impact分层；attach/replace/expire/remove显式；外部 ref/state变化不自动执行本地 Command。 | Hub生成 approval/Policy/shared_rules；review替代approval；保存method body/source/version；trace由log/evidence反向构造；任一 selector非通过。 | `service-command-query`,`entry-inbound`,`outbound-collaboration`,`domain-state`,`observability-redaction` + index；失败阻断。 |
| `AC-CH-005` | C-CH-5；formal exposure/visibility/view/trace/change collaboration；C18~26、Q15~33、I03~06、O01~10、J02~08 | CMD `018..026`;QUERY `015..033`;INBOUND `003..006`;OUTBOUND `001..010`;JOB `002..008`;STATE `{009..019,023,024}`;TX `017..021`;OBS `004..012` | formal exposure只由完整正式接入事实建立；visibility/applicability与controlled view分层；runtime/tools/SDK只消费server boundary/ref；变化 capture/collaboration、impact和派生维护保持source symmetry、body-free、no reverse write。 | draft/unresolved prerequisite被暴露；consumer/event/export/job反写truth；SDK client/cache、runtime execution、listing或audit backend成为 owner；A/B/C、Job journal或selector非通过。 | `service-command-query`,`entry-inbound`,`outbound-collaboration`,`jobs-lifecycle`,`domain-state`,`repository-transaction`,`observability-redaction` + index；失败阻断。 |

## 7. `FR-CH-001..016` 功能验收门禁

本表是 `AC-CH-006..021` 的 primary acceptance registry。每一行保持 `AC -> FR -> formal 03 contract -> exact TC/DS/EV -> fixed report path -> pass/fail -> verdict impact` 闭环。`DS` 和 `EV` 使用与 `TC` 相同的 family/ordinal；`STATE`、`TX`、`OBS`、`BIND` 等辅助 selector 仍必须按 canonical inventory 逐项执行，不能用流程 smoke 计数替代。

| AC / FR | 正式设计契约与功能主语 | Exact TC / DS / EV selector | 通过条件 | 失败条件 | 固定 raw/report 入口与 verdict impact |
|---|---|---|---|---|---|
| `AC-CH-006` / `FR-CH-001` | C01 `EstablishCapabilityAccessContext`；C01/Q01~03；I04；S01~02；外部 source ref 只作输入引用 | `TC/DS/EV-CH-CMD-001`; `...QUERY-001..003`; `...INBOUND-004`; `...STATE-001..002` | MCP/A2A/API candidate 经 typed source/ref 形成可讨论的 `CapabilityIdentity` 与 access context；缺 identity key、不同 resolution state 和 body-free review 分支均得到 formal typed outcome；成功结果可被后续 registry/descriptor selector引用。 | 以 URL、provider 名、tool config、runtime config 或 marketplace listing 代替 identity；source/body 不对称；非法输入被静默接受；任一 required selector缺失、invalid或non-pass。 | `artifacts/test/<run_id>/suites/service-command-query/cases/<tc-id>.json`; `reports/runs/<run_id>/suites/service-command-query.md`; `reports/runs/<run_id>/evidence-index.md`；失败阻断 `AC-CH-006` 与 C-CH-1。 |
| `AC-CH-007` / `FR-CH-002` | C01~03 `Establish/Correct/RetireCapabilityIdentity`；S01；TX02/08~10/15/22；identity version/digest/history | `TC/DS/EV-CH-CMD-001..003`; `...STATE-001`; `...TX-002,008..010,015,022` | 同一 stable identity ref 可贯穿 registry、descriptor、seam、method relation、exposure；correct 只在合法 expected version 上形成显式 revision；retire 不隐式级联；duplicate 返回 stored result 且 zero-write。 | read/consumer/derived 操作合并、拆分、更正 identity；stale winner覆盖；terminal state非法恢复；digest/version/history不对称或 duplicate 产生第二 effect。 | `service-command-query`, `domain-state`, `repository-transaction` suites 的同 run raw/report；任一 selector失败即 P0 不通过。 |
| `AC-CH-008` / `FR-CH-003` | C04 `RecordCapabilityAccessReviewFact`；Q03；S02；OBS06/08/12；review 与治理 approval 分离 | `TC/DS/EV-CH-CMD-004`; `...QUERY-003`; `...STATE-002`; `...OBS-006,008,012` | access review fact、风险解释和 body-free source context 可记录、查询和追溯；review 可有无 prior review 的合法变体；所有 approval/policy/vote body 均被拒绝或仅保留允许 ref/summary。 | review 被解释为 approval/Policy/effective allow；敏感正文进入 object/event/report；review 写入 governance truth；query 反向修改；缺少 redaction/zero-effect evidence。 | `service-command-query`, `domain-state`, `observability-redaction`; `reports/runs/<run_id>/evidence-index.md`；失败阻断并转 Step 11 VETO 评估。 |
| `AC-CH-009` / `FR-CH-004` | C05~08 registry commands；Q04~06；S03；registry current/history/CAS/unique | `TC/DS/EV-CH-CMD-005..008`; `...QUERY-004..006`; `...STATE-003`; `...TX-001..007` | active identity 能原子注册、更新、退出 registry；registry entry 始终锚定 identity；current/index/history/version/unique 结果对称；Retired history 可按正式 query读取。 | 无 identity 先注册；registry 退化为 allowlist、runtime cache、availability bit 或 marketplace listing；unique/CAS失败覆盖 winner；退休造成未声明 cascade。 | `service-command-query`, `domain-state`, `repository-transaction`; exact case path + suite report + evidence index；失败阻断 C-CH-2。 |
| `AC-CH-010` / `FR-CH-005` | C06~08/C19；Q04~06/Q15~17；S03/S09/S10/S14；visibility/applicability source symmetry | `TC/DS/EV-CH-CMD-006..008,019`; `...QUERY-004..006,015..017`; `...STATE-003,009,010,014` | Draft/Undescribed/Ungoverned/FormalVisible及 lifecycle/visibility/applicability 的正式状态可区分；only declared Command 改变状态；formal visibility 依赖 complete prerequisite 与 source/version symmetry。 | 单一 allowlist/availability bit 替代状态；draft/unresolved/not-governed 误报 FormalVisible；query/maintenance改状态；source/version不对称或 wrong scope 被接受。 | `service-command-query`, `domain-state`, `repository-transaction`; report path按 primary suite固定；失败阻断并可能触发 `VF-CH-008`。 |
| `AC-CH-011` / `FR-CH-006` | J01~06 reconciliation/derived jobs；Q24~28；O02/O09；S15~17/S24；TX13/14/20/21 | `TC/DS/EV-CH-JOB-001..006`; `...QUERY-024..028`; `...OUTBOUND-002,009`; `...STATE-015..017,024`; `...TX-013,014,020,021` | maintenance、search/browse、export、discovery、reconciliation 只读取冻结正式事实并产生 body-free projection/report/material；target/journal/report refs对称；失败可形成 typed partial/unavailable，不修复 core truth。 | Job/derived/query 创建或改写 identity/registry/descriptor/exposure；report被当作 source；nested Command/Job、rescan、ranking/listing或 marketplace mutation出现；journal/replay不对称。 | `jobs-lifecycle`, `service-command-query`, `outbound-collaboration`, `repository-transaction`; same-run raw/report/index；失败阻断。 |
| `AC-CH-012` / `FR-CH-007` | C09~10 descriptor lifecycle；Q07/Q10；O03；S04；body-free MCP/A2A/API descriptor | `TC/DS/EV-CH-CMD-009..010`; `...QUERY-007,010`; `...OUTBOUND-003`; `...STATE-004` | eligible registry entry 可建立/替换 `AdapterDescriptor`，明确 adapter type、protocol、boundary/ref；predecessor、version、source和change record对称。 | `ProviderContract`、provider runtime、route/quota/cost/failover/retry或 secret body 进入 descriptor；无 registry precondition；replacement 绕过 predecessor/CAS；O03 source不匹配。 | `service-command-query`, `domain-state`, `outbound-collaboration`; raw case/suite report/evidence index；失败阻断 C-CH-3。 |
| `AC-CH-013` / `FR-CH-008` | C11~12 risk/secret safe summary；Q08~09；S05~06；OBS06/08/12；04 config sensitive boundary | `TC/DS/EV-CH-CMD-011..012`; `...QUERY-008..009`; `...STATE-005..006`; `...OBS-006,008,012`; relevant `BIND/CONFIG` selectors | descriptor risk/constraint summary、`SecretRef`、`SecretHandlingSafeSummary` 可解释且只保存 body-free ref/marker/summary；resolver result 与 subject/kind/digest 对称；forbidden corpus 在 persistence/emission 前拒绝。 | API key、credential、certificate、KMS/Vault body、provider policy/cost/route或 raw assessment 进入任何 store/event/report；Port asymmetry被降级成成功；redaction或config fail-closed缺失。 | `service-command-query`, `domain-state`, `observability-redaction`, `runtime-binding`, `configuration-strict`; exact raw/report roots；失败阻断并保留 VETO candidate。 |
| `AC-CH-014` / `FR-CH-009` | Q07~10/Q17~19；C09~12 relation inputs；formal exposure boundary；protocol body-free contract | `TC/DS/EV-CH-QUERY-007..010,017..019`; `...CMD-009..012`; `...STATE-004..006,014`; `...OBS-008,012` | downstream 可从同一 descriptor 与 server exposure/ref 读取正式边界；visible/degraded/unavailable/empty 是 typed distinct surface；consumer 不需要或不能补造 provider protocol/runtime/secret truth。 | Query 加载或输出 provider request/response、runtime status、secret、quota/route/cost、SDK client/cache；consumer 反写 descriptor/exposure；visibility resolver 被跳过。 | `service-command-query`, `domain-state`, `observability-redaction`; 每个 query case path及 no-write report；失败阻断。 |
| `AC-CH-015` / `FR-CH-010` | C13~15 governance seam；Q11~12；I01；S07；governance result ref/state | `TC/DS/EV-CH-CMD-013..015`; `...QUERY-011..012`; `...INBOUND-001`; `...STATE-007` | formal exposure/use semantics 可引用 external governance result ref/allowed summary；seam attach/replace/expire 有合法 current state、source和version；inbound 只更新 ref/state 与 receipt。 | Hub 生成 approval、Policy、shared_rules 或 allow/deny；registry/local review单独决定正式可用；I01 marker 自动触发 Command；governance body进入本仓。 | `service-command-query`, `entry-inbound`, `domain-state`; raw/report/index；失败阻断并由 Step 11 检查 `VF-CH-005`。 |
| `AC-CH-016` / `FR-CH-011` | C04/C13~15；Q12；S02/S07；OBS12；access-review/governance separation | `TC/DS/EV-CH-CMD-004,013..015`; `...QUERY-012`; `...STATE-002,007`; `...OBS-012` | access review fact、capability seam relation 和 upstream governance approval/Policy ref 各有独立 owner、字段和变化路径；四种 presence/absence 组合可正确表达。 | review 与 approval 混为一个 state/object；本仓生成或覆盖 upstream result；query/consumer将 review 当 effective policy；owner/current-index mismatch未报 consistency defect。 | `service-command-query`, `domain-state`, `observability-redaction`; exact pair evidence；失败阻断。 |
| `AC-CH-017` / `FR-CH-012` | C16~17 method relation；Q13~14；I02；O05；S08；method-library body-free relation | `TC/DS/EV-CH-CMD-016..017`; `...QUERY-013..014`; `...INBOUND-002`; `...OUTBOUND-005`; `...STATE-008` | capability 与 `MethodAssetRef` 形成 typed body-free relation；Active/Unresolved/Removed 状态和 source/ref/digest可查询；I02只更新 ref/state/receipt。 | Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、definition source/version/body或 runtime execution进入本仓；关系命令改变 method-library truth；O05 source/body不对称。 | `service-command-query`, `entry-inbound`, `outbound-collaboration`, `domain-state`; failure blocks C-CH-4 and possible VETO. |
| `AC-CH-018` / `FR-CH-013` | C22~23 trace/impact；Q20~23；O08；S11~13；OBS12 | `TC/DS/EV-CH-CMD-022..023`; `...QUERY-020..023`; `...OUTBOUND-008`; `...STATE-011..013`; `...OBS-012` | identity/registry/descriptor/seam/method/exposure changes carry exact source, scope, trace, impact and optional body-free handoff refs; trace revisions append with gap/supersession invariants; impact is committed fact, not observer reconstruction. | missing/wrong source or trace accepted; log/metric/audit/evidence body becomes truth; handoff/impact changes current core object without declared Command; revision gap or source mismatch. | `service-command-query`, `outbound-collaboration`, `domain-state`, `observability-redaction`; same-run trace/evidence reports; failure blocks. |
| `AC-CH-019` / `FR-CH-014` | C18~21/C26; Q15~19/Q31~32; O06~07; S09/S10/S14；SDK server boundary | `TC/DS/EV-CH-CMD-018..021,026`; `...QUERY-015..019,031..032`; `...OUTBOUND-006..007`; `...STATE-009,010,014` | runtime/tools/SDK/product consumers receive formal exposure/server boundary, controlled view or typed consumer ref; applicability and visibility are source-symmetric; consumer side has zero Hub truth writes. | runtime/tools execution, allow/deny enforcement, tool result, SDK package/client/cache or product state enters Hub; consumer ref establishes exposure; NotVisible/draft accepted as consumable. | `service-command-query`, `outbound-collaboration`, `domain-state`, `observability-redaction`; fixed query/command case and no-write report; failure blocks. |
| `AC-CH-020` / `FR-CH-015` | C18~21 exposure/visibility；Q15~18；S09/S10/S14；formal visibility applicability | `TC/DS/EV-CH-CMD-018..021`; `...QUERY-015..018`; `...STATE-009,010,014` | only complete identity/registry/descriptor/governance/method/ref prerequisites produce formal visibility/consumability; Suspended/Unavailable/Partial/Stale remain explicit; policy-only applicability changes have exact source/version. | Draft, Undescribed, Ungoverned, Unresolved or incomplete candidate is FormalVisible; visibility target supplied by caller rather than policy; suspend/retire source asymmetry; derived view replaces formal visibility. | `service-command-query`, `domain-state`, `repository-transaction`; exact state/case raw and report; failure blocks and may hit `VF-CH-008`. |
| `AC-CH-021` / `FR-CH-016` | O01~10 change collaboration；C22~23；I03~06；S19/S23；TX17~20 | `TC/DS/EV-CH-OUTBOUND-001..010`; `...CMD-022..023`; `...INBOUND-003..006`; `...STATE-019,023`; `...TX-017..020` | committed changes produce exact body-free snapshot/capture/collaboration or typed inbound receipt; source/schema/trace/scope/intent symmetry, Durable-before-collaboration and Job reentry rules hold; downstream impact is feedback, not source. | event emitted from report/log/derived output instead of committed change; capture incomplete; local truth rollback tied to external outcome; inbound feedback writes exposure/core truth; duplicate/race creates split event or intent. | `outbound-collaboration`, `entry-inbound`, `repository-transaction`, `domain-state`; `reports/runs/<run_id>/suites/outbound-collaboration.md` and related raw/index; failure blocks. |

## 8. `AC-CH-022` 外围增强隔离门禁

`AC-CH-022` 是 Step 5 的唯一外围功能项。它不要求 `FR-CH-E01..E07` 在 P0 交付中存在；它要求外围能力若缺失不阻断核心，若存在不得成为新的 truth owner。

| AC | 外围集合 | 正向/负向设计契约 | TC / DS / EV selector | 通过条件 | 失败条件 | 固定入口与裁决影响 |
|---|---|---|---|---|---|---|
| `AC-CH-022` | `FR-CH-E01..E07`：管理入口、目录搜索/浏览、候选发现、安全摘要深化、SDK 说明、只读生态发现、审计友好导出 | 03 §§8~10 的 derived/view/job/query cards；BR-CH-E001；Q24~28、J02~06、Q19/Q26~27、O09；formal identity/registry/descriptor/seam/relation/exposure remain sole source | `TC/DS/EV-CH-QUERY-024..028`; `...QUERY-019,026..027`; `...JOB-002..006`; `...OUTBOUND-009`; `...STATE-015..017,024`; `...TX-013,014,020,021`; corresponding BIND/OBS | scope manifest 可明确 absent/not-selected；核心 AC001~021 的 selectors 不因外围缺失而减少；若外围存在，其 read/projection/report/view/job 只消费正式 truth，zero core writes，body-free and typed partial/unavailable。 | 将外围缺失静默算作核心 pass；外围 UI/search/discovery/export/job 创建或修复 identity/registry/exposure；listing/ranking/transaction、audit body、SDK client/cache或 runtime execution进入 Hub；P1/real product/staging/production结果替代 P0 selector。 | `service-command-query`,`jobs-lifecycle`,`outbound-collaboration`,`domain-state`,`repository-transaction`,`observability-redaction`; fixed suite reports + index；外围自身失败只阻断其 declared selected claim，不得反向改变已完整 P0 主链，越界写入则阻断整体并交 Step 6/11。 |

## 9. 功能验收项停审记录

停审不是执行通过，而是检查该验收项是否已经具备未来可裁决所需的设计闭环。

| 验收项 | 正式需求/设计来源 | TC/DS/EV 与 raw/report 是否固定 | 通过/失败是否可判定 | 是否误用 P1/后续 Step | 设计停审结论 |
|---|---|---|---|---|---|
| `AC-CH-001` | yes；C-CH-1、03 identity flows | yes；same-run selector和suite root | yes；member/all-node条件 | no | `pass-designed / not-evaluated` |
| `AC-CH-002` | yes；C-CH-2、03 registry/jobs | yes | yes；current/history/no-repair | no | `pass-designed / not-evaluated` |
| `AC-CH-003` | yes；C-CH-3、03 descriptor/ref | yes | yes；body-free/redaction | no | `pass-designed / not-evaluated` |
| `AC-CH-004` | yes；C-CH-4、03 seam/method/trace | yes | yes；owner separation | no | `pass-designed / not-evaluated` |
| `AC-CH-005` | yes；C-CH-5、03 exposure/collaboration | yes | yes；source symmetry/no reverse write | no | `pass-designed / not-evaluated` |
| `AC-CH-006` | yes；FR001/C01/Q/I04 | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-007` | yes；FR002/C01~03/TX | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-008` | yes；FR003/C04/review | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-009` | yes；FR004/C05~08 | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-010` | yes；FR005/visibility | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-011` | yes；FR006/J/derived | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-012` | yes；FR007/descriptor | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-013` | yes；FR008/safe summaries | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-014` | yes；FR009/consumer reads | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-015` | yes；FR010/governance seam | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-016` | yes；FR011/separation | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-017` | yes；FR012/method relation | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-018` | yes；FR013/trace-impact | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-019` | yes；FR014/exposure consumer | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-020` | yes；FR015/formal visibility | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-021` | yes；FR016/change collaboration | yes | yes | no | `pass-designed / not-evaluated` |
| `AC-CH-022` | yes；FR-E boundary/derived | yes | yes；absence and isolation separated | no | `pass-designed / not-evaluated` |

## 10. 跨功能门禁裁决审计

| 审计项 | 设计结论 | 处理/后续 owner |
|---|---|---|
| P0 functional coverage | 5 core + 16 FR = 21 P0 functional rows；外围 isolation独立 1 row；缺失=0 | Step 5 closed |
| AC primary ownership | `AC-CH-001..005` and `AC-CH-006..022` each have one primary functional row；AC023+不在本步 primary | Step 15 cross-document audit |
| exact flow coverage | C26/Q33/I06/O10/J08 selectors appear in relevant core/FR/AC rows；任何未列 flow由 shared closure selector或后续 interface Step消费 | Step 7/15 reverse audit |
| evidence duplication | shared EV may have multiple consumer refs, but one primary suite/run-scoped instance；no new EV identity | Step 10/15 |
| release smoke substitution | forbidden；`release-main-smoke` cannot replace detailed flow evidence | Step 12/15 |
| P1 contamination | selected product、staging/production、capacity/SLO和P2 operations不进入 P0 pass predicate | Step 9/12 |
| VETO overlap | functional failure may be VETO candidate, but only Step 11 declares non-waivable veto | Step 11 |
| numeric threshold re-entry | none；performance/SLO remains `not_evaluated` unless later controlled reopen | Step 9 |
| historical leakage | old objects, old TC IDs, old thresholds, old topology and old signer fields active rows=0 | Step 15/VF-CH-013 |
| upstream blocker | no missing formal source or selector contract found | `0`; controlled reopen only if later audit finds drift |

## 11. 回填草稿：formal `06-验收标准.md` §5

正式章节只保留以下收口内容，不复制本文件的问题诊断、取舍和停审叙事：

1. `AC-CH-001..005` 五个核心闭环门禁及其 exact design/test/evidence consumer。
2. `AC-CH-006..021` 对应 `FR-CH-001..016` 的一对一功能门禁。
3. `AC-CH-022` 的外围增强隔离规则。
4. 每个功能项的 required TC/DS/EV、固定 raw/report/index path、pass/fail/not-decidable语义和 verdict impact。
5. P0 功能失败阻断总体通过；缺失、blocked、invalid、cross-run、manual/static evidence不能形成通过。
6. `release-main-smoke`、P1 selected、真实产品、staging/production、capacity/SLO不替代 canonical P0 evidence。
7. 本章只定义功能裁决，数据红线、接口同步、状态/TX、NFR、证据、VETO、缺陷、风险和签署分别引用后续章节。

## 12. 待确认事项与受控重开

| 事项 | 当前状态 | 受控处理 |
|---|---|---|
| 某个 release 是否选择 P1 product/adapter | 未选择；不影响设计闭合 | 由 immutable scope manifest选择；不能回填为 P0 evidence |
| future suite 的实际命名或分区变化 | formal 05 已锁定十个 primary suite | 若改变必须新 baseline/new run并回开 Step 3/05 evidence，不在 acceptance prose偷偷修正 |
| numeric performance/SLO阈值 | `not_evaluated` | 只能由正式 NFR/controlled reopen提供来源；本步不引入 P95/30s/100% |
| 真实 EV alias、run、review、verdict | 均不存在 | future execution生成；本 artifact 不填写实例值 |
| AC 与后续 Step 的交叉消费 | planned | 保持本步 primary owner，后续只能 secondary cross-check，不复制裁决主语 |

## 13. Step 5 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| 5 个核心闭环均有逐节点功能门禁 | `pass-designed` |
| `FR-CH-001..016` 一对一由 `AC-CH-006..021` 承接 | `16/16; pass-designed` |
| 外围增强隔离 | `AC-CH-022; pass-designed` |
| 每项绑定 formal design、TC、DS、EV、raw/report path、pass/fail/verdict impact | `22/22; pass-designed` |
| detailed flow 不能被 release smoke 替代 | `closed` |
| P1/real product/staging/production/capacity 不污染 P0 | `closed` |
| implementation/test/evidence/verdict/signoff facts | none claimed |
| unresolved upstream blocker | `0` |
| formal `06-验收标准.md` modified in this Step | `no; Step 15 only` |
| 下一步 | `enter_06_step_06_data_arch_redlines` |

Step 5 的 `pass-designed` 只表示功能门禁设计静态闭合，不表示任何真实功能、测试或验收已通过。
