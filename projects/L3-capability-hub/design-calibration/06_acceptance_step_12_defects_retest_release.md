# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.12
> 回填章节：`06-验收标准.md` §12 缺陷分级、复验与放行规则
> 粒度参考：`projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_12_defects_retest_release.md`
> 当前模式：full-restart / continuous execution / design-only

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `06-验收标准.md` |
| 当前 Step | Step 12 定义缺陷分级、复验与放行规则 |
| 当前状态 | `completed; pass-designed; no execution fact` |
| 上一步 | `06_acceptance_step_11_veto.md` |
| 本步输出 | 观察分类、S/A/B/R 分级、VETO 承接、复验矩阵、放行规则、关闭证据合同和回填草稿 |
| 正式文档状态 | 未修改；正式 `06` 仅允许在 Step 15 整体装配 |
| 真实缺陷/复验事实 | 无 defect ID、owner、fix、run、artifact、report、digest、review、risk decision 或 signoff |
| unresolved upstream blocker | `0` |
| 下一入口 | `enter_06_step_13_risk_acceptance` |
| commit | 不需要；未经用户明确要求不提交 |

本步定义验收层的裁决规则，不创建缺陷实例或测试结果。`R0`~`R4` 是测试方案定义的回归层级；`S/A/B` 是确认后的产品/实现或测试系统影响级别；`R` 是范围外、前置条件、政策或未来演进 residual 分类，不是可以绕过 P0 门禁的“低等级缺陷”。

## 2. 本步目标与边界

本步将“观察到的 non-pass”先归因，再映射到缺陷严重度、复验范围和放行结论，确保以下关系可判定：

```text
raw observation
  -> observation class
  -> formal source / TC / DS / EV impact
  -> S/A/B or residual classification
  -> immutable retest pair
  -> required suite/check/report regression
  -> closure or eligible residual review
  -> acceptance verdict impact
```

本步必须回答：

1. S/A/B/R 如何定义，如何与 `VETO-CH-*`、P0/P1/P2 和 evidence status 对齐。
2. 每一类结果对“通过 / 有条件通过 / 不通过 / 不可裁决”的影响是什么。
3. 修复后如何选择原 case、同 family、primary suite、cross-suite、R2 full main 和 R4 release 范围。
4. 失败 run、复验 run、raw、report、digest、EV 和 defect closure 如何保持不可覆盖、可回链。
5. 哪些问题永远不能风险接受，哪些真实 B/non-P0 residual 才有资格进入 Step 13。
6. 测试系统、设计 blocker、环境前置条件和无 numeric threshold 的 sample 如何避免被伪装成产品缺陷或通过结果。

本步不做：

- 不创建 `DEF-CH-*`、`BUG-CH-*`、run ID、evidence alias、reviewer、acceptor、签名或关闭结果。
- 不把失败后重试的 passed 行当作原失败的替代，不删除失败 raw，不将不同 run 的 raw 拼成一个 EV instance。
- 不允许 `VETO-CH-*`、confirmed S、当前 P0 A、evidence integrity、redaction、dependency/responsibility 或 strict-config hard failure 进入风险接受。
- 不把 P1 selected unavailable、无 active numeric threshold 的 sample、P2/future capability、生产运维政策缺失或 out-of-scope responsibility 写成 P0 通过。
- 不修改 formal `05-测试方案.md`、formal `06-验收标准.md` 或任何实现代码；本文件是 Step 中间产物。

## 3. 输入与权威顺序

| 输入 | 权威用途 | 本步消费结论 | 不得推断 |
|---|---|---|---|
| `05-测试方案.md` §11 | 观察分类、S/A/B、13 VF 映射、关闭与自动化规则 | 以测试层分类和不可接受集合为基础 | 任何 defect 已发现或关闭 |
| `05-测试方案.md` §12 | P0/selected/release 进入、退出和暂停条件 | 以完整分母和 non-pass 语义裁决放行 | 目标仓、CI、环境已经存在 |
| `05-测试方案.md` §14 | R0~R4、13 变更面、12 个 full trigger、16 风险和 residual eligibility | 以 impact manifest 选择复验范围 | risk 已被接受 |
| `05_test_plan_step_11_defects_retest.md` | 详细缺陷生命周期 | 失败前后 distinct run、family/suite/check 扩散、自动化闭合 | 真实 closure bundle 已建立 |
| `05_test_plan_step_14_regression_risks.md` | 回归和风险边界 | R2 denominator、never-acceptable、`eligible_execution_residual` | 实际 regression 已运行 |
| `06_acceptance_step_04_entry_exit.md` | 验收层状态词汇和阻断条件 | `passed|failed|blocked_dependency|invalid_artifact|not_evaluated|not_decided` 分离 | 缺失项可默认通过 |
| `06_acceptance_step_08_state_tx_consistency.md` | 状态、事务、Query/Job no-write、commit-unknown | consistency defect、duplicate truth、unsafe repair 均阻断 | 通过最终状态掩盖中间越权 |
| `06_acceptance_step_09_nonfunctional.md` | NFR、redaction、dependency、configuration 和 observation hard gates | 结构性门禁与 numeric `not_evaluated` 分离 | 旧 P95/30s/99.9% 已恢复 |
| `06_acceptance_step_10_observability_evidence.md` | 189 EV instance、raw/report pairing、review/handoff | evidence integrity 缺口的严重度和关闭证据 | `EV-CH-*` 合同等于实例 |
| `06_acceptance_step_11_veto.md` | VETO-CH-001..013、P-001..010 | VETO 命中不可通过、不可风险接受 | checklist 已有真实结果 |
| L1 reference Step 12 | 结构和审计粒度 | 分级表、复验表、停审表、回填草稿格式 | 参考项目的 domain ID、阈值或放行权责可迁移 |

权威顺序固定为：raw-derived observation -> active formal `00~05` source -> Step 11 VETO -> 本步 defect/retest decision。旧 formal `06`、README 和其他项目的 `VETO-GOV-*`/`VETO-ART-*` 仅作 historical/粒度参考，不得成为缺陷主语。

## 4. SOP 问题回答

| SOP 问题 | 本项目裁决 |
|---|---|
| S/A/B 缺陷如何定义？ | S 是 VETO 或 truth/security/ownership/evidence hard redline；A 是当前 P0 canonical contract、typed oracle、state/TX/config/observation/Rustdoc 或 blocking proof 失败但未命中 S；B 只能是已确认的 non-P0、selected/P1 或不影响当前 P0 证据的维护性问题；R 是 prerequisite/policy/future/out-of-scope residual，不是 P0 pass。 |
| 每级对结论有什么影响？ | S/VETO 只能不通过或暂停；当前 P0 A 在修复并完成要求复验前阻断 P0 exit/handoff，不能风险接受；合格 B 才可能支持有条件通过；R 只能进入后续风险/问题跟踪，不能被写成已验证。 |
| 修复后如何复验？ | 先保留失败 run，创建新的显式 retest run；至少重跑原 TC/parameter、同 family 边界、primary suite 和受影响 check/report；共享 authority、public schema、state generator、UoW/idempotency、config graph、redaction、dependency 或 evidence pipeline 变化默认扩展到 R2，release scope 另需 R4。 |
| 哪些可以风险接受？ | 只有真实、证据完整、边界明确、无 VF/S/P0-A/P0 evidence impact 的 `eligible_execution_residual` 才可由 Step 13 审查；设计 debt、实现缺失、P0 prerequisite、blocked/invalid evidence 和 selected required unavailable 不能借 residual 变成 pass。 |
| 哪些必须阻断下一阶段？ | 任一 VETO/S、当前 P0 A、evidence integrity/redaction/dependency/responsibility/config hard failure、P0 required cell 缺失、baseline drift、cross-run/digest mismatch、fake/static evidence、设计 blocker 或 P0 prerequisite 未满足均阻断对应范围；不能由 release smoke、口头说明或 retry pass 覆盖。 |

## 5. 历史材料与现有文档诊断

| 材料 | 冲突 | 本步处置 |
|---|---|---|
| 旧 `06-验收标准.md` 的泛化 S/A/B 或 waiver | 未绑定新版 VF、189 evidence、638 pair 和 current P0 A 规则 | 不沿用；按本项目 `S/A/B/R` 与 VETO/证据合同重建 |
| 旧缺陷编号、API/DB/log evidence 名称 | 不能回指当前 `TC-CH/DS-CH/EV-CH` 和 fixed roots | 不建 alias；未来真实 defect 可独立引用 exact run-scoped refs |
| 旧单 case 复验或“最新通过覆盖失败” | 破坏失败留证、flaky 归因和审计 | 固定 distinct run、immutable raw/report 和 impact manifest |
| 旧 P95、30s、99.9%、100% 或 SLA 口径 | 没有 active threshold source | numeric sample 保持 `not_evaluated`，不升格为 S/A/B |
| 旧 selected/provider/runtime topology | 责任和产品未选定 | 归为 prerequisite/selected residual；不补偿 P0，也不伪造产品通过 |
| 参考项目允许 A 临时接受的表达 | 与本项目 `05` 的 current P0 A / never-acceptable 规则不一致 | 只参考表格粒度；本项目当前 P0 A 不可接受 |

## 6. 观察分类先于缺陷分级

只有归因为 `OBS-CLASS-IMPLEMENTATION` 的观察才进入产品/实现 S/A/B 分级。其他 non-pass 可能阻断 gate，但不能被伪装成产品 defect 或测试 pass。

| Observation class | 判定条件 | 处理动作 | 验收状态关系 |
|---|---|---|---|
| `OBS-CLASS-IMPLEMENTATION` | valid baseline、case、data、environment、harness 下违反 formal `00~04` oracle | 记录 formal source、TC/DS/EV、影响和严重度；修复并复验 | 通常 `failed`，再按 S/A/B 裁决 |
| `OBS-CLASS-TEST-SYSTEM` | manifest、fixture、fake、runner、check、report builder 或 evidence generator 自身错误/不稳定 | 保留原 raw 为 non-pass；修复测试系统并重跑 affected scope | `failed|timed_out|flaky_detected|invalid_artifact`；不产生产品 pass |
| `OBS-CLASS-DESIGN-BLOCKER` | active source 矛盾、缺 canonical oracle、无法将义务一一落到 case | 暂停 affected scope，回开准确的 formal owner 和下游 registry | `not_decided`/blocked；不得以实现 patch 关闭 |
| `OBS-CLASS-PREREQUISITE` | 实现仓、`core-contracts`、selected product、环境、配置材料或授权尚不可用 | 记录 prerequisite、适用范围和阻断层级 | `blocked_dependency`；不可转成 pass 或普通 B |
| `OBS-CLASS-NUMERIC-SAMPLE` | 有 duration/throughput/availability sample，但没有 active numeric threshold | 保留 sample 和 provenance；结构性 oracle 独立裁决 | numeric `not_evaluated`；不是 defect |
| `OBS-CLASS-EXPECTED-ORACLE` | 预先声明的 unavailable/timeout/error 与 typed oracle、zero-effect、适用性和清理条件完全一致 | 只对该 negative case 记 raw-derived pass | 该 case 可 `passed`；不扩大为环境总体通过 |
| `OBS-CLASS-INCOMPLETE-RUN` | cancel、unexpected timeout、缺 required cell、raw/report 生成失败或根因未定 | 保留 partial raw，先完成归因；不得升级状态 | non-pass；通常 `not_decided` 或 `invalid_artifact` |

分类必须能回指 immutable run context、profile、entry、TC/DS/parameter、harness source 和 safe finding。`无法复现`不改变已有 valid failure 的事实，也不能把旧失败改成 pass/closed。

## 7. 结构化中间产物：缺陷严重度与结论影响

### 7.1 S/A/B/R 分级表

| 级别 | 定义 | Capability Hub 典型触发 | 对验收结论的影响 | 复验/关闭要求 |
|---|---|---|---|---|
| `S` | 命中任一 VETO，或破坏 truth ownership、security/redaction、dependency/responsibility、evidence integrity、one-truth、strict config 等不可接受红线 | `VETO-CH-001..013` 或 `VETO-CH-P-001..010`；forbidden body/secret；Query/Job/consumer reverse-write；duplicate winner/second truth；static/raw-less evidence；P0 config silent fallback | 未关闭时只能为 `不通过` 或 `暂停/不可裁决`；绝不允许风险接受或有条件通过 | 修复后新显式 run；原 case、同 family、受影响 suite/check/audit；按 full trigger 执行 R2/R4 |
| `A` | 当前 P0 canonical TC/DS/EV、typed/zero-effect oracle、state/TX/config/observation/Rustdoc 或 blocking proof 失败，但没有命中 S | wrong typed outcome；required state/pair 缺失；P0 profile missing without false pass；Rustdoc field/variant/method omission；cleanup/order/entry barrier defect；P0 report cell无法证明但尚未伪造 | 当前 P0 exit/handoff 前必须修复并复验；不得作为当前风险接受依据；没有正式可裁决证据时为 `不可裁决`，不是通过 | 原失败 case/parameter、primary suite、受影响 check/report；共享面或不确定影响默认 R2；关闭 bundle完整 |
| `B` | 已确认 non-P0、P1 selected、报告可读性或维护性问题，且无 P0/VF/evidence/provenance 影响 | selected product parity issue when not release-required；safe wording/ergonomics；未改变 raw/schema/status 的非阻断报告问题 | 不阻断独立 P0 semantic exit；若本次范围包含该项，可形成有条件通过的 residual；不得写成 P0 已验证 | 依据 impact manifest 做 R1/R3 或补充 review；真实接受需在 Step 13 记录 |
| `R` | 当前范围外、future capability、生产运维政策、容量/SLO、vendor 深层行为或未选产品的残余 | production-like capacity；未来 schema evolution；retention/alert/runbook policy；out-of-scope runtime/marketplace/provider behavior | 不改变当前 P0 结果；只能列为 pending/not-applicable/residual，不能支撑通过或有条件通过，除非 Step 13 按正式规则接受合格 residual | 触发条件升级为 P0/P1 时重新 baseline、选择 scope 并建立新 run |

`B` 与 `R` 不等于“问题可以忽略”。两者必须带明确 scope、影响、责任、后续动作和重开触发；未完成真实授权前状态只能为 `pending_not_accepted` 或 `not_eligible`。

### 7.2 不可降级的 S 级触发

| 触发条件 | 对应来源 | 必须处理 | 最低复验方向 |
|---|---|---|---|
| `VETO-CH-001..013` 任一命中 | Step 11 §7 | 修复；不得 risk acceptance | 原 VF consumer、相关 family/suite/check；按 `FULL-CH-03` 做 R2，release claim 做 R4 |
| `VETO-CH-P-001/002`：EV pairing、digest、orphan、static/raw-less 或 status upgrade | Step 11 §8；Step 10 `EVG-CH-001..003/008` | 使 evidence bundle invalid，修复生成链，不得手写补行 | affected raw-to-report chain、pairing/no-static、完整引用 suite；通常 R2/R4 |
| `VETO-CH-P-003`：raw/report/review forbidden body 或 secret leak | Step 11；`VF-CH-004/006/011` | 清理泄漏面并重建干净 raw/report；不得只删一份 report | synthetic leak fixture、全部 affected producer、artifact/report redaction scan |
| `VETO-CH-P-004`：dependency/responsibility 越界 | Step 11；`VF-CH-005/006/011/012` | 删除越界 ownership/edge；public surface变化需回开设计 | dependency/responsibility/static/Rustdoc + direct consumers |
| `VETO-CH-P-005`：silent fallback、partial activation、P0 unavailable marked passed | `04`、Step 9/10 | fail-fast/profile isolation/activation barrier 修复 | all affected CONFIG/BIND/entry cases + config/dependency/report checks |
| `VETO-CH-P-006/007`：required observation 缺失、Query write、Job repair、reconciliation 自动补洞 | `03`、Step 8/10 | 保留 exact consistency defect；禁止 row-drop、repair、observer substitution | affected Query/Job/TX/OBS plus responsibility/pairing checks |
| `VETO-CH-P-008`：commit-unknown 或 retry 造成第二次 truth write | `03`、Step 8、`VF-CH-010` | 保留 unknown 和旧 attempt；通过唯一 authority resolution 修复 | TX/STATE/CMD/Outbound/Job race/replay；共享 authority 则 all638/R2 |
| confirmed current P0 A、但尚未到 S | `05` §11/§14 | 修复后才可退出 P0；不得由口头说明或 B residual 覆盖 | exact case、same family、primary suite/check；不确定影响默认 R2 |

### 7.3 Suite/check 初始归因与升级

| Primary suite / check | 默认确认级别 | 升级为 S 的条件 | 最小复验 |
|---|---|---|---|
| `static-contract-docs` / case manifest | A 或 test-system | 省略 identity 以伪造 pass、历史/依赖/forbidden owner 进入 active surface | 原 declaration/case + suite + manifest/Rustdoc/dependency checks |
| `domain-state` / state-pair registry | A | illegal/reserved pair 被接受、terminal resurrection、second truth、exposure bypass | affected family；shared generator/guard 改动时全 `638` |
| `service-command-query` | A | truth corruption、Query write、治理/方法/runtime ownership、trace loss | affected C/Q family + repository/observation/责任 checks |
| `entry-inbound` | A | body leak、source input 重写 truth、partial graph barrier 放行 | affected source/entry + redaction/config/dependency |
| `outbound-collaboration` | A | external fault rollback local truth、local delivery truth、duplicate bind | `OUTBOUND-001..010` + TX/Job/observation consumers |
| `jobs-lifecycle` | A | Job repair/rescan/reexecute committed truth、fabricated terminal/report | `JOB-001..008` + TX20 + pairing/no-repair |
| `repository-transaction` | A | second authority、winner overwrite、duplicate effect、unsafe commit-unknown retry | affected TX and direct consumers；shared authority通常 R2 |
| `runtime-binding` / `configuration-strict` | A | forbidden dependency、partial graph、unsafe fallback、sensitive output、safety disable | affected BIND/CONFIG/entry + static/config/dependency checks |
| `observability-redaction` | A | forbidden material leak或observer改变业务 truth | 直接升级 S；全部 OBS、affected producer、redaction/responsibility |
| `check_artifact_report_pairing.sh` / `check_no_static_evidence.sh` | test-system or evidence A | invalid/static evidence 已被接受为 passed | 修复 builder/check fixture、全部引用 suite、R2/R4 |
| `check_dependency_boundary.sh` / `check_responsibility_boundary.sh` | implementation A | forbidden compile/ownership edge | 直接 S；full graph、affected source and release proof |
| `check_rustdoc_coverage.sh` | A | 同时改变 public schema/dependency/ownership | full declaration scan；按 public change 扩大 R2 |

测试系统故障在归因完成前保持 non-pass；不能因为“不是产品 bug”而放行，也不能在没有真实证据时把它升级成产品 S。

## 8. 结构化中间产物：复验层级与变更面

### 8.1 R0~R4 复验层级

| 层级 | 目的 | 必须包含 | 可以证明 | 明确不能证明 |
|---|---|---|---|---|
| `R0-targeted-diagnostic` | 重现一个精确失败、确认归因或开发反馈 | exact `TC-CH`/`DS-CH`/`EV-CH`、parameter、safe raw attempt | 该参数的诊断输入 | family、P0 完整性或放行 |
| `R1-minimum-change` | 证明变更面和直接消费者已覆盖 | immutable impact manifest、changed cases、same family、primary/consumer suites、适用 checks/reports | 有界变更未破坏直接相邻面 | 完整 P0 denominator，除非 manifest 恰好等于 R2 |
| `R2-full-main` | 重建当前 product-neutral P0 baseline | 10 primary suites、189 TC/DS/EV、638 pairs、9 main checks、raw/report/provenance gates | P0 semantic exit 的必要测试条件 | selected product parity、release 或最终 acceptance |
| `R3-selected-integration` | 验证 immutable manifest 选定的外部产品/adapter/config/TLS/observer parity | selected manifest、精确 subset、typed unavailable/failure、safe cleanup、独立 raw/report | selected claim（仅在适用时） | P0 substitute；unavailable 不能变 pass |
| `R4-release-requalification` | 形成 release/acceptance handoff 所需的下游重资格 | compatible lower-run refs、release checks/smoke、report/evidence/review-ready drafts | release evidence readiness | 自行产生 acceptance verdict、risk acceptance 或签署 |

R0/R1 只能服务诊断和缺陷复验，不能缩小 R2 分母。任何 source/config 在执行开始后变化都使旧 run 失去当前 formal evidence eligibility；旧 run 仍必须保留为历史诊断，修复后使用新显式 run。

### 8.2 Immutable impact manifest

每个 future change/fix 或 defect closure 在执行前必须形成一份不可变 impact manifest，沿以下链路展开：

```text
source/change identity
  -> formal section / DDD cut / config row / declaration / script contract
  -> exact TC / DS / EV / parameter set
  -> primary suite and direct consumer suites
  -> mandatory checks and report builders
  -> R0/R1/R2/R3/R4 trigger decision
  -> selected/release applicability
  -> explicit baseline/run/evidence references
```

| 字段 | 必填内容 | 缺失或不确定时 |
|---|---|---|
| `change_ref` | 实际变更/缺陷引用和 source baseline | 阻断复验选择；本设计阶段为空 |
| `authority_ref` | exact formal section、DDD cut、config key/row、public declaration或脚本合同 | 不能用“模块改动”代替 |
| `impacted_tc_ds_ev` | 有限 exact identity set 或 reviewed closed range | 空集合必须有 no-behavior 证明 |
| `primary_suites` / `consumer_suites` | Step 9 的正式 suite ID | owner 不全则扩展或阻断 |
| `checks` / `builders` | applicable mandatory checks/report builders | redline/evidence check 不得 waiver |
| `full_trigger` | `FULL-CH-*` rule ID 或明确 no-trigger reasoning | 未填写时默认 R2 |
| `selected_applicability` | required / not-applicable-by-manifest / blocked_dependency 及理由 | unavailable 不得写 not-applicable |
| `baseline_ref` / `run_ref` | 实际执行时的显式值 | 设计阶段保持 empty，不伪造 |

### 8.3 十三类变更面复验矩阵

| ID | 变更面 | 最小复验 | 必须扩展的相邻面 | R2/R4 触发 |
|---|---|---|---|---|
| `REG-CH-01` | protocol/ref/metadata/codec/digest/public schema | changed FOUNDATION/flow + codec/digest negative cases | static、直接 service/entry、Rustdoc、redaction | public wire/digest/identity/provenance 语义变化 |
| `REG-CH-02` | domain object/factory/policy/state guard | changed member/pair + affected family branches | service/repository/state registry | shared guard/generator/terminal/exposure -> all638 + R2 |
| `REG-CH-03` | Command/application/UoW orchestration | changed Command all accepted/rejected/duplicate/conflict/unknown/rollback branches | repository/outbound/observation | write-set/atomic/idempotency/trace/capture/commit 变化 -> R2 |
| `REG-CH-04` | Query/visibility/degraded/read model | changed Query + no-write/unavailable/invalid/stale branches；shared helper -> all33 | domain/repository/config/observation | Query write/body/visibility source/shared projection -> R2 |
| `REG-CH-05` | API/Inbound/Worker header/source/receipt/lifecycle | changed Inbound + FOUNDATION05/06 + affected source branches | service/runtime/config/redaction | barrier/body/source/replay/cancel 变化 -> R2/R4 |
| `REG-CH-06` | Outbound snapshot/A-B-C collaboration | changed Outbound + TX17..19 | repository/service/jobs/observation | local truth/stable intent/external status/route/retry -> R2/R4 |
| `REG-CH-07` | Job plan/ordinal/journal/report/reentry | changed Job + TX20 + immutable formations | repository/outbound/config/pairing | plan/order/reentry/terminal/report -> R2/R4 |
| `REG-CH-08` | repository/UoW/idempotency/commit/race | changed repository methods + exact TX | all direct service/entry/outbound/job consumers | authority/110 methods/commit tri-state/winner/CAS/order -> R2/R4 |
| `REG-CH-09` | runtime binding/config/profile/entry/provider/retry | affected BIND/CONFIG rows/stages and entries | static/dependency/Rustdoc/observation | graph/profile/source/fallback/barrier/safety -> R2/R4 |
| `REG-CH-10` | observability/redaction/audit profiles | changed OBS + CONFIG16 + all changed producers | redaction/responsibility and producer suites | selector/schema/neutrality/forbidden corpus -> R2/R4 |
| `REG-CH-11` | gate/check/report/evidence/index/review pipeline | failing and passing fixtures + real suite-to-report projection | pairing/no-static/case/redaction + referenced suites | status/denominator/digest/path/EV/AC/VF semantics -> R2/R4 |
| `REG-CH-12` | Rust declaration/documentation shape | failed declaration + full Rustdoc scan | compile/dependency and consumers if signature changes | declaration/field/variant/payload/trait/method/callable semantic change -> R2 |
| `REG-CH-13` | dependency graph/product binding/public type source | full graph/import/signature + affected Port/BIND/CONFIG | static/runtime/config/responsibility | sibling/public foreign type/copied replacement/ownership direction -> R2/R4 |

`REG-CH-12` 永久保留结构体/枚举注释门禁：future public Rust 的每个 declaration、struct field、enum variant、variant payload field、trait、method 和 callable 必须有完整英文 `///`；enum struct-variant field 不得写 field-level `pub`。遗漏至少为 A，若同时改变 public schema/dependency/ownership，按更高等级升级。

### 8.4 Unconditional R2 triggers

以下触发器不能被 R0/R1、selected run、release smoke 或风险说明替代：

| Trigger | 条件 | 必须动作 |
|---|---|---|
| `FULL-CH-01` | formal `00` requirement/BR/NFR/AC/VF 语义变化 | 回开 owner，建立新 baseline，执行 R2 |
| `FULL-CH-02` | formal `01~04` ownership/public/flow/state/TX/config/observation 语义变化 | design sync + R2 |
| `FULL-CH-03` | 任一 S 修复或 VF 相关变化 | R2；release handoff 前另做 R4 |
| `FULL-CH-04` | P0 A 暴露 shared contract 或 impact unknown | focused proof 后 R2 |
| `FULL-CH-05` | 新发现 P0 branch/assertion/check 或 denominator drift | controlled reopen Step 6/9 + R2 |
| `FULL-CH-06` | shared protocol/digest/state generator/UoW/idempotency/repository authority 变化 | R2；state 相关全 638 |
| `FULL-CH-07` | config graph/profile/entry/source/fail-fast/fallback/barrier 变化 | R2 |
| `FULL-CH-08` | dependency/responsibility/redaction/Rustdoc scanner 或 governing redline 变化 | R2；evidence 受影响时 R4 |
| `FULL-CH-09` | gate aggregate/status/required-cell/retry semantics 变化 | non-pass fixtures + R2 |
| `FULL-CH-10` | raw/report/EV schema、digest/pairing/no-static 或 AC/VF mapping 变化 | 从 raw 重建 + R2 + R4 |
| `FULL-CH-11` | evidence run 开始后 source/config baseline 漂移 | 保留并标 invalid old run；新 R2 run |
| `FULL-CH-12` | impact 无法用 exact TC/suite/check 集合界定 | 默认 R2；禁止猜测最小范围 |

## 9. 复验与放行证据闭环

### 9.1 失败与复验 run 配对规则

```text
observed non-pass
  -> preserve artifacts/test/<failed_run_id>
  -> classify and create immutable impact manifest
  -> fix implementation/test system or reopen design owner
  -> execute artifacts/test/<retest_run_id>
  -> generate reports/runs/<retest_run_id>
  -> compare old/new without merging evidence rows
  -> execute required R0/R1/R2/R3/R4 scope
  -> review closure bundle
```

| 规则 | 固定要求 | 禁止行为 |
|---|---|---|
| run identity | 失败与复验必须是不同、显式、不可变的 run ID | 同 run 覆盖、隐式 current、`latest` |
| raw retention | 失败、timeout、flaky、blocked、invalid 原始 safe material 均保留 | 删除失败或只保留最后一次 pass |
| report provenance | report 只能从同 run raw 生成，带 digest/pairing | 手写 status、跨 run 拼接、report 补造 case |
| EV instance | 一个 `(run_id, EV-CH-*)` row 只消费该 run 的 exact TC/DS/raw/report | 把旧 run 的 passed row 与新 run 的其它 row 合并 |
| retry semantics | retry 产生新 attempt/run，保留 worst status 和关联关系 | retry pass 自动升级旧 failed |
| source drift | execution 后 source/config 改变使旧 run失去 current eligibility | 继续使用旧 run 作为新 baseline |

### 9.2 Future defect closure record

真实执行时的 defect closure bundle 至少需要以下字段；当前全部为空：

| 字段组 | 必填内容 | 约束 |
|---|---|---|
| observation | source suite/check、TC/DS/parameter、expected/observed safe class、first run ref | 不写 raw secret/body |
| classification | observation class、severity、formal source、VETO/AC/NFR impact | 归因前不得先定严重度 |
| impact | object/state/flow/config/profile/entry/owner、persisted/external effect | 区分 confirmed 与 possible |
| root cause | implementation/test-system/design/prerequisite category、已知 declaration/file | 不伪造 commit 或 fix |
| remediation | intended/actual scope、reopen decision | 新证据前不得写 fixed/closed |
| retest | distinct retest run、exact TC/suite/check、raw/report/digest refs | 不能复用失败 run root |
| closure | unresolved cells、automation action、eligible residual ref（如有） | 不得缺失 P0/VF impact set |

### 9.3 按严重度的关闭证据

| 证据项 | S | A | B | R / prerequisite | test-system blocker |
|---|---|---|---|---|---|
| first failing raw/report 或 provenance explanation | 必须 | 必须 | 若由 run 观察 | 必须记录适用性/阻断依据 | 必须 |
| formal source、TC/DS/parameter | 必须 | 必须 | 适用时必须 | 需要对应 contract/ref | 必须 |
| fix scope/root cause | 必须 | 必须 | 若宣称修复 | 不得用未执行计划替代 | 必须 |
| distinct retest run | 必须 | 必须 | 宣称关闭时必须 | prerequisite satisfied 后新 run | 必须 |
| family/suite/check regression | 按 impact manifest | 按 impact manifest | scoped R1/R3 | 不可用则保持 blocked | affected proof cells |
| R2/R4 | 触发时必须 | shared/release surface 触发时必须 | 不自动要求 | 不能替代 prerequisite | aggregation/provenance 受影响时必须 |
| risk acceptance | 禁止 | current P0 A 禁止 | 仅 eligible B | R 需 Step 13 处理 | 不是 proof substitute |

### 9.4 放行规则

| 当前状态 | P0 semantic exit | selected/release claim | 总体验收影响 |
|---|---|---|---|
| 任一未关闭 S/VETO | 阻断 | 阻断 | 只能 `不通过` 或 `暂停/不可裁决` |
| 当前 P0 A 未关闭 | 阻断 | 阻断或不可裁决 | 不得通过；不能进入 risk acceptance |
| evidence invalid/missing/cross-run/static | 阻断 | 阻断 | `不可裁决` 或 `不通过`，不得默认未触发 |
| P0 prerequisite unavailable | 阻断 affected scope | selected/release `blocked_dependency` | 不得写成 pass；独立 P0 不被补偿或否定 |
| 仅有合格 B/non-P0 且 P0 证据完整 | 不阻断 | 依 manifest | 可进入 Step 13/14 的有条件通过候选，但尚未形成结论 |
| 仅有 R/future/out-of-scope | 不改变 P0 | 不形成当前 claim | 记录为 pending/not-applicable；不能成为通过依据 |
| 所有 P0 gates、189 EV、638 pairs、checks和review inputs完整 | 满足必要条件 | 另行判断 selected/R4 | 仅允许进入 Step 13~14，不自动生成 verdict |

“放行”在本步只表示允许进入下一层审查，不等于最终验收通过。任何 acceptance handoff、release report、review note 或口头确认都不能改变 raw-derived defect/status。

## 10. 自动化闭合与 canonical authority 保护

| 发现 | 必须补强的自动化 | canonical identity 规则 |
|---|---|---|
| 既有 TC 已隐含但未覆盖某个 branch/parameter/assertion | 在同一 TC/DS、同一 primary suite 增加 deterministic parameter/assertion | canonical 总数保持 `189` |
| common helper、state registry、check 或 builder 漏检 | 增加 deterministic fixture/negative assertion 到既有 check/suite | 不为工具缺陷随意新增 canonical TC |
| release smoke 发现下层应拥有的缺陷 | 在最低层 primary suite 补 reproducer，release 只保留 secondary regression | primary owner 唯一不变 |
| 手工发现 P0 且已有对应 cut owner | 关闭前必须纳入对应 canonical TC/DS/EV 生成链 | P0 manual-only gap 必须为 `0` |
| 真正新增 formal obligation 且没有现有 owner | 受控回开 formal `00~05` 对应 Step，重建 cut/TC/DS/EV 和下游 consumer | 只有 owner 确认后才可增加 identity |
| redaction corpus 缺少安全样本 | 使用 synthetic safe marker 扩充 fixture 和 scanner | 不保存真实 secret/body |
| flaky/race 需要重现 | 使用 deterministic barrier/schedule，保留每个 attempt | 不用自动重试把 failed 改成 pass |
| historical material 回流 | 扩充 static/responsibility/case/config denylist | 不从旧 ID 建 alias |

自动化补强本身如果改变 gate、case manifest、EV schema、report status、digest/pairing 或 AC/VF mapping，立即按 `REG-CH-11` 和 `FULL-CH-09/10` 评估并执行 R2/R4；不得把修复工具的静态结果当作产品证据。

## 11. 缺陷/复验停审记录

停审检查的是规则可执行性和交接完整性，不是实际缺陷为零或测试通过。

| 审查项 | 设计结论 | 当前事实 / 缺口 |
|---|---|---|
| observation classification 是否先于 severity | `pass-designed` | 7 类观察已分离；无实际 raw/run |
| S/A/B/R 是否可判定 | `pass-designed` | S/VETO、P0 A、B/non-P0、R/future 规则明确 |
| 13 VF 和过程 VETO 是否均为不可接受 S | `pass-designed` | `VETO-CH-001..013` 与 `VETO-CH-P-001..010` 已承接 |
| P0 A 是否有 waiver 路径 | `closed: 0` | 当前 P0 A 必须修复/复验；无接受记录 |
| suite/check/report 失败是否能归因 | `pass-designed` | 10 suite、9 check、report builder 初始归因和升级方向已列 |
| R0/R1 是否可能冒充 R2 | `closed: 0` | §8.1 明确不能建立 P0 exit |
| R3 unavailable 是否可能伪造 pass | `closed: 0` | `blocked_dependency` 与 `not_applicable_by_manifest` 分离 |
| 失败 run 是否会被覆盖 | `closed: 0` | distinct run、immutable raw/report、no overwrite 固定 |
| shared change 是否只跑单 case | `closed: 0` | impact manifest、13 surfaces 和 full triggers 强制扩展 |
| static/raw-less/cross-run evidence 是否能进入放行 | `closed: 0` | Step 11 P hard redlines 阻断 |
| Rustdoc 注释约束是否纳入复验 | `pass-designed` | declaration/field/variant/payload/trait/method/callable 全量扫描规则已固定 |
| 关闭证据是否可回指 defect/old run/new run/EV/AC/VF | `pass-designed` | §9.2/§9.3 schema 已固定；实例为空 |
| 是否伪造 defect、fix、retest、review、risk 或 signoff | `closed: 0` | 本文件无真实 ID、run、digest、person、timestamp 或签署 |

## 12. 跨规则审计

| 审计项 | 结果 | 处理规则 |
|---|---|---|
| `VF-CH-001..013` severity mapping | `13/13`，missing/duplicate=0 | 全部 S，按 Step 11 VETO 处理 |
| process VETO 与 defect level 冲突 | 未发现 | P-001..010 直接阻断 evidence/交接；不降级为 B |
| P0 A waiver 路径 | `0` | 修复、distinct retest、满足 R2/R4 触发后再审 |
| product defect 与 test-system/prerequisite 混淆 | `0`（设计路径） | 先按 §6 分类；non-product non-pass 仍可阻断，不得伪装 pass |
| blocked dependency 变成 pass/B | `0` | 保持 `blocked_dependency`，按 selected/release applicability 处理 |
| numeric sample 变成缺陷/通过 | `0` | 保持 `not_evaluated`；结构性 gate 独立 |
| R0/R1 代替 R2 | `0` | R2 denominator fixed `10/189/638/9` |
| R3 代替 P0 | `0` | selected result不能补偿或否定P0 |
| old failure overwrite/cross-run stitching | `0` | pairing/report audit 和 defect bundle 必须保留双 run |
| evidence integrity failure 被 risk acceptance 覆盖 | `0` | VETO-CH-P-001/002/009 不可接受 |
| shared source change 未扩散 | `0` | `REG-CH-*` 和 `FULL-CH-*` default broader scope |
| canonical denominator drift | `0` | existing case expansion优先；新义务受控 reopen |
| 结构体/枚举字段注释遗漏路径 | `0`（设计门禁） | `REG-CH-12`/Rustdoc check；未来遗漏至少 A |
| 历史对象/阈值/责任回流 | `0` active mapping | denylist、static、config、responsibility 和 report audit |
| fake reviewer/acceptor/signature | `0` | 缺 provenance 是不可裁决，不是通过 |
| unresolved upstream blocker | `0` | 没有当前上游写回需求 |

## 13. 回填草稿：formal `06-验收标准.md` §12

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_retest_release.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“观察分类先于缺陷分级”“缺陷严重度与结论影响”“复验层级与变更面”“复验与放行证据闭环”“自动化闭合与 canonical authority 保护”和“跨规则审计”小节，了解 §12 如何从 `05` 的缺陷/回归合同和 Step 11 VETO 收敛。

正式 §12 只承载以下收口结论：

1. 先按 `OBS-CLASS-IMPLEMENTATION`、`TEST-SYSTEM`、`DESIGN-BLOCKER`、`PREREQUISITE`、`NUMERIC-SAMPLE`、`EXPECTED-ORACLE`、`INCOMPLETE-RUN` 分类，再判断 S/A/B/R；无法归因的 non-pass 不得被写成通过。
2. `S` 覆盖任一 `VETO-CH-*`、truth/security/ownership/evidence/config hard redline；`S` 不可风险接受，未关闭时只能不通过或暂停/不可裁决。
3. 当前 P0 `A` 必须修复并完成原 case、family、suite/check 和受影响 evidence/report 的复验；在 P0 exit/handoff 前不得风险接受。只有无 P0/VF/evidence 影响的真实 B/non-P0 residual 才可进入 Step 13 审查。
4. 失败和复验必须使用不同的显式 run ID，保留 immutable raw/report/digest；不得覆盖失败、跨 run 拼接 EV、使用 `latest` 或用 report/handoff/status 手写补 pass。
5. R0/R1 是诊断/最小变更复验，不能替代 R2 full main；R2 固定为 10 suites、189 TC/DS/EV、638 state pairs 和 9 applicable checks；selected R3 不补偿 P0，release R4 不自行生成 acceptance verdict。
6. shared protocol/state/UoW/idempotency/config/observation/dependency/evidence 变化、任何 S/VF 修复和无法界定影响的变更按对应 full trigger 执行 R2/R4；结构体、枚举 variant/payload、trait、method、callable 的英文 `///` 缺失至少为 A。
7. 放行只表示满足本步所需的下一层审查条件，不等于最终通过；最终“通过 / 有条件通过 / 不通过”由 Step 13~14 在真实 evidence/review 基础上裁决。

## 14. 待确认事项与受控重开

| 事项 | 当前状态 | 影响 | 受控处理 |
|---|---|---|---|
| 具体 defect tracker、字段和状态机 | 未选择 | 影响实现记录，不改变严重度语义 | formal 07 建立 boundary；本步只要求可回指字段 |
| selected/release manifest 是否将某产品设为 required | 未选择 | 影响 R3/R4 applicability 和 blocked scope | 由 Step 3/4 baseline、formal 07/09 受控选择；不可在 report 中临时改写 |
| formal numeric threshold | 未建立 | 不产生 numeric defect 或 VETO | 正式来源 + controlled reopen 后才可改变 NFR/acceptance |
| evidence retention/access/deletion policy | 未建立 | 影响长期归档 | 保持 event-based minimum；交 Step 13/operations owner |
| reviewer/acceptor 权限 | 未指定 | 影响 B residual 和最终签署 | Step 13/14 只定义资格/字段；当前不填人名或签名 |
| 目标实现仓、CI、脚本和产品环境 | 未建立 | 影响所有真实复验 | formal 07 preflight；不在本步伪造 prerequisite completion |

如 active `00~05`、VETO 规则、189 denominator、638 registry、suite/check、evidence schema 或责任边界发生变化，必须回开准确 owner Step 和本步；不能通过添加一个泛化 defect 行或修改放行表消解冲突。

## 15. Step 12 完成门禁与 Step 13 入口

| 进入下一步条件 | 结果 |
|---|---|
| 缺陷观察分类先于严重度且不可混淆 | `通过；7/7 class closed` |
| S/A/B/R 定义及 verdict impact 可判定 | `通过；设计层闭合` |
| VETO、S、当前 P0 A、evidence hard failure 的阻断/不可接受规则一致 | `通过；无 waiver path` |
| 失败/复验 run、raw/report/digest 和 closure schema 固定 | `通过；future contract closed` |
| R0/R1/R2/R3/R4 层级和 13 change surfaces 可执行 | `通过；R2 denominator locked` |
| automation gap 不会改变 canonical 189 authority | `通过；controlled reopen closed` |
| 跨规则审计 unresolved 冲突 | `无` |
| 真实 defect、fix、retest、review、risk acceptance、verdict、signoff | `均不存在；未伪造` |
| unresolved upstream blocker | `0` |
| 可进入下一步 | `是：enter_06_step_13_risk_acceptance` |

Step 12 的 `pass-designed` 只表示缺陷、复验和放行规则已经可裁决，不表示任何缺陷已关闭、测试已执行或交付物已放行。
