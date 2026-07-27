# Step 11. 定义一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.11
> 回填章节：`06-验收标准.md` §11 一票否决项
> 粒度参考：`projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_11_veto.md`
> 当前模式：full-restart / continuous execution / design-only

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `06-验收标准.md` |
| 当前 Step | Step 11 定义一票否决项 |
| 当前状态 | `completed; pass-designed; no execution fact` |
| 上一步 | `06_acceptance_step_10_observability_evidence.md` |
| 本步输出 | 本文件的 VETO 映射、过程硬红线、闭环矩阵、停审记录和回填草稿 |
| 正式文档状态 | 未修改；正式 `06` 仅允许在 Step 15 整体装配 |
| 真实运行事实 | 无 implementation、run、artifact、report、digest、evidence instance、review、verdict 或 signoff |
| unresolved upstream blocker | `0` |
| 下一入口 | `enter_06_step_12_defects_retest_release` |
| commit | 不需要；未经用户明确要求不提交 |

本文件中的 `VETO-CH-*` 是验收裁决层标识，不改变正式需求中的 `VF-CH-001..013`，也不是实际执行生成的 evidence alias。`EV-CH-*`、`EVG-CH-*` 和固定 report path 都是前序文档定义的未来合同；尖括号中的 `<run_id>` 不得被解释为真实运行值。

## 2. 本步目标与边界

本步把需求文档的 negative redline、架构/详细设计不变量、测试方案的 S 级规则以及 Step 10 的证据真实性门禁收敛为“命中即不得通过、不得有条件通过、不得被风险接受覆盖”的裁决条件。

本步必须回答：

1. 哪些失败会直接导致验收不通过或暂停裁决。
2. 每项否决条件来自哪个正式需求、架构、设计或测试红线。
3. 每项否决如何通过 canonical TC/DS/EV、mandatory check 和固定 report path 检查。
4. 哪些项目虽然严重但属于 `blocked_dependency`、`not_evaluated` 或选定产品范围，不应被错误设为 VETO。
5. 每项 VETO 如何阻断总体结论，以及为什么不能进入风险接受。
6. 所有 `VF-CH-*` 与证据/责任硬红线是否覆盖完整、是否重复或存在冲突。

本步不做以下事情：

- 不创建真实 VETO instance、缺陷、run、report、review、acceptor 或签署。
- 不把 `reports/acceptance/veto-checklist.md` 预填为 passed。
- 不重新定义 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure 或 SDK server boundary 的所有权。
- 不把 runtime/tools execution、governance approval、method body、marketplace listing/transaction、provider route/quota/cost/secret 或 SDK client/cache 纳入 Hub 的 VETO 主体。
- 不恢复历史 P95、30s、99.9%、100% 或其他没有 active source 的数值门槛。

## 3. 输入与权威顺序

| 输入 | 权威用途 | 本步使用的结论 | 不得推断 |
|---|---|---|---|
| `00-需求文档.md` §14.3 | 正式 VF 来源 | `VF-CH-001..013` 的完整文本和负向裁决方向 | 任何 VF 已被执行验证 |
| `01-架构设计.md` | 所有权、依赖和边界 | Hub 与 runtime、governance、method-library、SDK、marketplace、observability 的责任分离 | 具体产品或部署已选定 |
| `02-概要设计.md` | 组件、对象、协议和流程骨架 | 五个 core closure 及相邻 seam 的 acceptance consumer | 代码声明已经存在 |
| `03-详细设计.md` | 状态、事务、错误、观测和恢复契约 | no-write、one-truth、body-free、commit-resolution、redaction 和安全终止不变量 | 测试已运行 |
| `04-配置设计.md` | strict source/profile/activation/failure | fail-fast、no silent fallback、no partial graph、unavailable 语义 | 配置环境可用 |
| `05-测试方案.md` §10~§14 | S/A/B、证据、复验、回归和不可接受项 | `13/13 VF`、confirmed S、current P0 A、evidence integrity 的不可 waiver 规则 | defect 或 evidence instance 已产生 |
| `06_acceptance_step_05..10` | 验收门禁消费者 | AC、EVG、raw/report、state/TX/interface/NFR/observation 的闭环方向 | acceptance verdict 已形成 |
| L1 参考 Step 11 | 结构粒度 | 逐项映射、闭环矩阵、停审和跨覆盖审计格式 | 参考项目的 domain ID 或责任可迁移 |

权威顺序固定为：formal `00` 的 VF 与责任边界 -> `01~04` 的设计不变量 -> `05` 的测试/证据/S 级规则 -> Step 5~10 的验收消费者 -> 本步 VETO 裁决。旧正式 `06`、README 或其他项目的 `VETO-GOV-*`、`VETO-ART-*`、`VETO-ML-*` 编号不进入本项目 active authority。

## 4. SOP 问题回答

| SOP 问题 | 本项目裁决 |
|---|---|
| 哪些失败直接导致不通过？ | 任一 `VF-CH-001..013` 命中；confirmed S；当前 P0 A；evidence integrity、redaction、dependency/responsibility、strict config 或 one-truth hard gate 失败；以及无法证明这些硬门禁的无效/缺失证据。 |
| 否决项来自哪里？ | `00` §14.3 的 13 个 VF、`01~04` 的 truth/ownership/state/TX/config/observation redlines、`05` §11/§13/§14 的 S 与 never-acceptable set、Step 10 的 `EVG-CH-006..010`。 |
| 如何检查？ | 先检查 canonical TC/DS/EV 的 same-run instance，再检查对应 suite report、mandatory check raw/report、digest/pairing/redaction/no-static 和责任边界；缺少合法检查证据时停在 non-pass 或 not-decidable，不得默认“未触发”。 |
| VETO 是否允许风险接受？ | 不允许。VETO、confirmed S、current P0 A、evidence-integrity 和责任红线不能进入 Step 13 residual；P1 unavailable、无 numeric threshold 的 sample 和非当前 claim 可保持 blocked/not-evaluated，但不能伪装为通过。 |
| 是否覆盖全部 P0 红线？ | `VF-CH-001..013` 一对一覆盖；另外将证据真实性、redaction/body leak、dependency/responsibility、config bypass、source-missing/query-write/job-repair/commit-unknown duplicate truth 作为验收过程硬红线。 |
| 每项能否回指正式来源、证据和 report？ | 可以。每个 `VETO-CH-*` 行都绑定 VF 或明确的 Step 8/9/10 gate、TC/DS/EV family、check/report path 和触发后的 verdict impact。 |
| 每项是否完成停审？ | 本文件 §8 对每个正式 VF 和过程红线检查来源、判定、证据、风险接受和回归方向；真实执行状态仍为空。 |
| 是否存在覆盖缺口、重复或不可执行检查？ | 设计审计未发现 unresolved 缺口。body/redaction、reverse-write/transaction、dependency/responsibility 有可接受交叉，但各自仍保留不同触发语义和证据入口。 |

## 5. 历史材料与现有文档诊断

| 材料 | 冲突 | 处置 |
|---|---|---|
| 旧 `06-验收标准.md` 的 API/DB/audit-entry 主线 | 未覆盖新版五个 core closure、13 VF、189 evidence contract 和 638 state-pair denominator | 仅作 historical material；Step 15 整体替换，不迁移旧 VETO 或 evidence ID |
| 旧 `MCPServer`、`A2ANode`、`ProviderContract`、`CapabilityDecision`、`CostRecord` | 与 identity/registry/descriptor/seam/relation/exposure owner 冲突 | 不创建同义 alias；不进入 VETO 或 active evidence consumer |
| 旧 KMS/Vault、PG、bus、runtime/tools topology | 产品、环境和责任未被当前 baseline 选定 | 作为 prerequisite/controlled reopen 输入，不能成为当前 VETO 的实现事实 |
| 旧 P95、30s、99.9%、100% | 没有 active workload、threshold source 或 run provenance | 保持 `not_evaluated`；不因旧数字设置 VETO |
| 旧 S/A/B waiver 或空签署表 | 可能把 S/VF/P0-A 误写成可接受或已签署 | 由本步和 Step 13/14 重建；当前所有真实字段为空 |
| 其他项目 `VETO-GOV-*`、`VETO-ART-*`、`VETO-ML-*` | domain owner、VF 编号和责任不同 | 只参考粒度，不复用编号、文本或证据 |

## 6. 裁决原则与分类边界

### 6.1 总体 VETO 谓词

对未来真实验收 run，`VETO_HIT` 只可由 raw-derived finding 或经授权的设计阻断结论形成：

```text
VETO_HIT
  := formal VF violation
  OR confirmed S
  OR current P0 A violation
  OR evidence / redaction / responsibility / dependency hard-gate violation
  OR strict-config truth bypass
```

当以下任一条件成立时，不得把结果写成 `VETO_NOT_TRIGGERED`：

```text
missing required EV/check
OR invalid_artifact
OR cross_run_or_digest_mismatch
OR static_or_manual_result_map
OR blocked_dependency_without_applicability_decision
OR not_evaluated
```

这些情况的结果应保持 `not_decidable`、`blocked_dependency` 或其他 raw-derived non-pass，并阻断对应 P0/交接范围。`VETO_NOT_TRIGGERED` 只能在完整、适用、可回源的 negative evidence 和 mandatory checks 均成立后由未来真实审查产生；本设计仓没有该结果。

### 6.2 不属于 VETO 的项目

| 项目 | 当前裁决 |
|---|---|
| P1 selected product/adapter/environment unavailable | `blocked_dependency`；阻断其 selected/release claim，不能补偿或否定独立 P0 semantic result |
| 没有 active numeric threshold 的性能/容量/可用性 sample | numeric `not_evaluated`；结构性 P0 oracle 仍按 Step 9 判断 |
| retention days、dashboard、alert、runbook 等外围运维政策 | 交正式 owner/controlled reopen；未形成当前 VETO |
| P2 peripheral feature absent | 依 immutable scope manifest 记 `not_applicable_by_manifest`；若已实现则检查不得越界，不将缺失本身设为 core VETO |
| 合法的 expected typed unavailable/timeout branch | 只有 exact oracle、zero-effect 和适用性均成立时可作为 case pass；harness fault 仍是 non-pass |
| 未来 schema/version/product evolution | 保持 future/controlled reopen；不能宣称已验收，也不自动生成 VETO |

### 6.3 统一 verdict impact

任一 VETO 命中时：

- 总体结论只能是 `不通过`，或在证据尚不足以判定触发时保持 `不可裁决/暂停验收`；不能是 `通过` 或 `有条件通过`。
- `reports/acceptance/risk-acceptance.md` 不得收录该 finding 作为可接受 residual。
- 需要保留原始 safe finding、显式 run、受影响 TC/DS/EV、suite/check report 和 defect/retest 关系；修复后必须创建新的显式 run。
- release smoke、人工说明、P1 结果、retry pass 或空白 checklist 不能覆盖 VETO。

## 7. 结构化中间产物：正式 VF 一对一映射

以下 `VETO-CH-001..013` 与正式需求的 `VF-CH-001..013` 保持稳定的一对一编号关系。`EV-CH-*` 是 `05` 定义的 formal evidence contract；实际 checklist 必须在未来 run 中填入显式 `(run_id, evidence_id)`，不能只引用合同名称。

| VETO ID | 正式红线来源 | 一票否决条件 | 最小检查方向 | 触发后的裁决 |
|---|---|---|---|---|
| `VETO-CH-001` | `VF-CH-001`; `AC-CH-001..005`; `BR-CH-001..009` | 五个 core closure 中任一 identity、registry、descriptor、governance/method seam 或 controlled exposure 节点缺失、断链、无 owner 或存在 orphan obligation。 | `EV-CH-FOUNDATION-*`、`EV-CH-CMD-*`、`EV-CH-QUERY-*`、`EV-CH-STATE-*`；`static-contract-docs`、`domain-state`、`service-command-query`；`reports/runs/<run_id>/suites/release-main-smoke.md`（如该报告被选用，仅可汇总底层证据）。 | `不通过`；必须修复并按受影响 family 扩展到完整 main/release 回归。 |
| `VETO-CH-002` | `VF-CH-002`; `BR-CH-001/002/010/020`; `AC-CH-006/007/023` | URL、provider 名、runtime/tool config、SDK client、marketplace listing、派生视图或其他候选值替代、合并、拆分或隐式更正 capability identity。 | identity Command/Query/state negative cases；`EV-CH-CMD-*`、`EV-CH-QUERY-*`、`EV-CH-STATE-*`；`check_responsibility_boundary.sh`、`check_redaction.sh`；对应 `identity/domain-state/service-command-query` reports。 | `不通过`；identity 及所有依赖者必须新 run 复验，不能以目录结果或消费视图补偿。 |
| `VETO-CH-003` | `VF-CH-003`; `BR-CH-002/003/009/011/021`; `AC-CH-009..011/023/025` | registry 退化为 allowlist、runtime 状态、cache、marketplace listing、provider availability bit，或维护/查询/对账生成第二份 registry truth。 | registry lifecycle/state/TX、query no-write、maintenance/job negative cases；`EV-CH-STATE-*`、`EV-CH-QUERY-*`、`EV-CH-JOB-*`、`EV-CH-TX-*`；`domain-state`、`service-command-query`、`jobs-lifecycle`、`repository-transaction` reports。 | `不通过`；禁止把派生索引、job 或 availability 结果当作修复后的 registry truth。 |
| `VETO-CH-004` | `VF-CH-004`; `BR-CH-004/005/013/022/031`; `AC-CH-012/013/024/031/032` | adapter descriptor 或其正式输出包含 secret/API key、provider runtime、quota、route、cost、billing、failover、retry 或外部调用正文/结果。 | descriptor/body-free、forbidden corpus、redaction、config binding 和 safe-summary negative cases；`EV-CH-FOUNDATION-*`、`EV-CH-BIND-*`、`EV-CH-OBS-*`、`EV-CH-CONFIG-*`；`redaction-check.md`、`responsibility-boundary.md`、`configuration-strict` report。 | `不通过`；命中 body/secret 时同时触发安全红线，不得风险接受或仅删除输出副本后放行。 |
| `VETO-CH-005` | `VF-CH-005`; `BR-CH-006/014/019/023/028/034/035`; `AC-CH-015/016/024/027` | Hub 生成/保存 governance approval、Policy effective fact、shared-rules truth，或以本地 access review、safe summary、cache、exposure 结果替代治理 authority。 | governance seam owner、reference resolution、dependency/responsibility and reverse-write cases；`EV-CH-INBOUND-*`、`EV-CH-CMD-*`、`EV-CH-QUERY-*`、`EV-CH-BIND-*`；`responsibility-boundary.md`、`dependency-boundary.md` 和相关 suite reports。 | `不通过`；治理结果只能作为正式引用/允许摘要接缝，必须移除本地第二真相并全量复验影响面。 |
| `VETO-CH-006` | `VF-CH-006`; `BR-CH-007/015/024/029`; `AC-CH-017/024/026/031/032` | capability-method relation 或 Hub 的任何正式结构保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、definition source、正文版本或方法生命周期真相。 | body-free relation、reference-only、dependency/import、redaction and store/output scan；`EV-CH-INBOUND-*`、`EV-CH-FOUNDATION-*`、`EV-CH-BIND-*`、`EV-CH-OBS-*`；`responsibility-boundary.md`、`redaction-check.md`。 | `不通过`；不能用 source ref、摘要或人工审查覆盖正文泄漏，修复后按 method/exposure/consumer 全面回归。 |
| `VETO-CH-007` | `VF-CH-007`; `BR-CH-008/009/010/011/012/025/026`; `AC-CH-019/021/024/025/030/036/037` | Query、downstream consumer、derived view/index、event collaboration、outbound handoff、reconciliation 或 Job 反写 identity/registry/descriptor/seam/relation/exposure/impact truth，或以 observer/result/report 自动修复缺陷。 | all 33 Query、6 Inbound、10 Outbound、8 Job、transaction/no-write and post-commit flows；`EV-CH-QUERY-*`、`EV-CH-INBOUND-*`、`EV-CH-OUTBOUND-*`、`EV-CH-JOB-*`、`EV-CH-TX-*`；`responsibility-boundary.md` 与对应 suite reports。 | `不通过`；写入路径、幂等和回滚/commit resolution 必须按受影响范围重跑，观察信号不得作为修复证据。 |
| `VETO-CH-008` | `VF-CH-008`; `BR-CH-003/008/025/034`; `AC-CH-010/020/027/029/034` | draft、candidate、unresolved、undescribed、ungoverned、缺 descriptor/method relation 或不满足 formal exposure 前置条件的能力被标为正式 visible、formal consumable 或 SDK server exposure ready。 | exposure applicability/state matrix、governance seam and completeness negative cases；`EV-CH-STATE-*`、`EV-CH-CMD-*`、`EV-CH-QUERY-*`、`EV-CH-BIND-*`；`domain-state`、`service-command-query`、`runtime-binding` reports。 | `不通过`；必须证明 source completeness、scope、governance prerequisite 和 visibility version 对称，不能用 UI/cache 或人工 allowlist 放行。 |
| `VETO-CH-009` | `VF-CH-009`; `BR-CH-020..026/036/037`; `AC-CH-018/021/025/030/036/037` | identity、registry、descriptor、governance seam、method relation、formal exposure、consumer impact 或 change collaboration 的 source/scope/version/trace/capture/sidecar 不完整、不对称、不可回链或静默变化。 | mutation/change flow、trace/impact/capture, event and durable projection symmetry；`EV-CH-CMD-*`、`EV-CH-OUTBOUND-*`、`EV-CH-OBS-*`、`EV-CH-TX-*`；`EVG-CH-005`、`report-audit.md`。 | `不通过`；缺任一 required carrier 或 sidecar 时不得降格为普通 note，必须新 run 验证完整 change surface。 |
| `VETO-CH-010` | `VF-CH-010`; `BR-CH-020/021/022/024/025`; `AC-CH-007/011/025/029/030/036` | duplicate proposal、candidate discovery、review input、consumer feedback、replay、race 或 retry 产生多 winner、重复 identity/registry fact、分叉 descriptor/exposure、digest 不一致或第二次 truth write。 | reserve/winner/digest/CAS/idempotency/commit-unknown and replay cases；`EV-CH-TX-*`、`EV-CH-STATE-*`、`EV-CH-CMD-*`、`EV-CH-OUTBOUND-*`、`EV-CH-JOB-*`；`repository-transaction`、`domain-state`、`service-command-query`、`jobs-lifecycle` reports。 | `不通过`；保留所有失败尝试和未知提交状态，禁止 retry overwrite、scan/repair 或人工选择 winner。 |
| `VETO-CH-011` | `VF-CH-011`; `BR-CH-013/017/018/030/031/032/033`; `AC-CH-026/031/032/035/037` | cost/billing/finance ledger、observability log/trace/metric/audit store 正文、marketplace listing/transaction、production request/response、secret/provider/method body 或 SDK client/cache material 进入 Hub truth、store、raw、report 或 formal output。 | full source/schema/store/output corpus scan；`EV-CH-OBS-*`、`EV-CH-BIND-*`、`EV-CH-CONFIG-*`；`redaction-check.md`、`responsibility-boundary.md`、`no-static-evidence` report。 | `不通过`；任何 forbidden material 或 safe finding 回显均不可接受，必须清理并重建干净证据链。 |
| `VETO-CH-012` | `VF-CH-012`; global dependency pruning rule; `BR-CH-027..033`; `AC-CH-026/032` | `L0-core`/允许的 `core-contracts` 之外的 sibling、runtime、tools、governance、method-library、SDK、marketplace、observability 或 provider 成为源码/编译期拥有关系，或用 copied replacement 绕过边界。 | workspace graph/import/public signature/module/declaration scan；`EV-CH-FOUNDATION-*`、`EV-CH-BIND-*`、`EV-CH-OBS-*`；`check_dependency_boundary.sh`、`dependency-boundary.md`、`static-contract-docs`、`runtime-binding` reports。 | `不通过`；依赖方向和公开类型必须修复，影响 public contract 时扩大至 full main/release。 |
| `VETO-CH-013` | `VF-CH-013`; historical-material denylist; `AC-CH-033..037` | 旧对象、旧 API/TC/evidence ID、旧 topology、旧 P95/30s/99.9%/100% 或已退休的 approval/cost/SLA/KMS/production 口径进入 active requirement、design、config、case、report 或验收主线。 | active source/config/case/report denylist、formal source references、no-static and responsibility audit；`EV-CH-FOUNDATION-*`、`EV-CH-CONFIG-*`、`EV-CH-OBS-*`；`check_case_manifest.sh`、`check_config_catalog.sh`、`report-audit.md`。 | `不通过` 或在 baseline 未能确定时 `不可裁决`；必须回开对应 source/test step，不能通过删掉一行历史引用来宣告清理完成。 |

### 7.1 正式 VF 覆盖计数

| 审计项 | 结果 |
|---|---|
| `VF-CH-001..013` 一对一 VETO 映射 | `13/13`，无缺失、无额外 domain 编号 |
| 每个 VETO 的正式来源 | 至少一个 `VF-CH-*`，并补充对应 BR/AC 或 global rule |
| 每个 VETO 的证据方向 | 至少一个 `EV-CH-*` family 或 mandatory check/report；实际执行必须实例化 |
| 每个 VETO 的触发后裁决 | 明确为 `不通过` 或 source/证据不足时 `不可裁决`，无 silent pass |
| 风险接受限制 | `13/13` 明确不可进入 residual/risk acceptance |

## 8. 结构化中间产物：验收过程硬红线

下列行不是新增需求 VF，而是让验收裁决自身保持有效所需的本地 `VETO-CH-P-*` 行。它们不能用来扩大 Hub 业务责任；其作用是阻止无效证据、责任泄漏或配置绕过被误写成验收通过。

| VETO ID | 硬红线 | 来源与触发条件 | 检查证据 / report path | 触发后的裁决 |
|---|---|---|---|---|
| `VETO-CH-P-001` | evidence identity、raw、report、digest 或 run pairing 不完整 | `05` §13；Step 10 `EVG-CH-001..003/008`；缺任一 canonical EV、TC/DS pair、same-run raw/report、verified digest、AC/VF ref、required check或出现 orphan/duplicate/cross-run | `EV-CH-*` run-scoped rows；`artifacts/test/<run_id>/evidence-index.json`；`reports/runs/<run_id>/evidence-index.md`、`report-audit.md`；`check_artifact_report_pairing.sh` | 当前 P0 证据 `无效/不可裁决`，总体不得通过；若由伪造/手写 pass 造成，另触发 `VETO-CH-P-002` |
| `VETO-CH-P-002` | 静态 evidence、手写 passed、默认 checklist 或 report status 升级 | `05` no-static rule；Step 10 `EVG-CH-008/010`；report/index/handoff/checklist 不是由真实同 run raw 派生，或用 retry/人工表覆盖 failed/blocked/invalid | `reports/runs/<run_id>/report-audit.md`、`evidence-index.md`；`reports/acceptance/veto-checklist.md`、`handoff.md`；`check_no_static_evidence.sh`；builder provenance | `不通过` 或 `暂停验收`；所有受影响 evidence 必须从原始 raw 重新生成，不得风险接受 |
| `VETO-CH-P-003` | raw/report/review 或 finding 泄漏 forbidden body/secret | `VF-CH-004/006/011`、`BR-CH-013/015/018/031..033`、Step 10 `EVG-CH-006`；artifact、stdout/stderr、report、acceptance/review 任一面出现 raw secret、token、credential、provider/method/production body、full sensitive ref或 finding 回显原文 | `reports/runs/<run_id>/redaction-check.md`、check raw；`reports/acceptance/*`、`reports/review/*`；`EV-CH-OBS-*`、`EV-CH-CONFIG-*`；`check_redaction.sh` | `不通过`；不得以删除 report、人工确认或 safe summary 覆盖泄漏；必须修复并重建全 affected evidence |
| `VETO-CH-P-004` | dependency 或 responsibility boundary 违规 | `VF-CH-005/006/011/012`、`BR-CH-027..033`、Step 10 `EVG-CH-007`；非允许 sibling compile edge，或 Hub 拥有 runtime/tools execution、approval、method body/source、listing、provider route/cost、SDK client/cache、observer store truth | `reports/runs/<run_id>/dependency-boundary.md`、`responsibility-boundary.md`；check raw；`EV-CH-FOUNDATION-*`、`EV-CH-BIND-*`、`EV-CH-OBS-*`；`check_dependency_boundary.sh`、`check_responsibility_boundary.sh` | `不通过`；不可按“实现便利”“未来再拆分”接受，public/dependency 变化须扩大回归 |
| `VETO-CH-P-005` | invalid P0 configuration 被 silent fallback、partial facade 或错误 profile 激活掩盖 | `04` strict config/activation/failure contract、`AC-CH-033..037`、Step 9/10；Missing/invalid/forbidden override 继续运行，P0 graph 部分激活，selected/unavailable 被标为 passed，或 secret/sensitive source 进入 output | `EV-CH-CONFIG-*`；`reports/runs/<run_id>/suites/configuration-strict.md`、`gate-summary.md`；`check_config_catalog.sh`；config raw/report | `不通过`；fail-fast、profile isolation、activation barrier 和 safe failure 必须修复后重跑，不得以 fallback 运行结果补偿 |
| `VETO-CH-P-006` | P0 required observation/audit carrier 缺失或观测反写 truth | `03` §14/§15、Step 10 `EVG-CH-004/005`；required profile、accepted carrier、source/version/scope/sidecar、trace/capture/journal/report不成对，或 log/metric/span/observer fault创建、修复、覆盖业务真相 | `EV-CH-OBS-*`；`reports/runs/<run_id>/suites/observability-redaction.md`、`redaction-check.md`；corresponding durable raw/report | `不通过` 或 `不可裁决`；不可用 observation summary 替代 owner carrier |
| `VETO-CH-P-007` | source-missing、Query write、Job truth repair 或 reconciliation 自动补洞 | `03` Query no-write、Job no-truth-repair、Step 8 consistency hard gates、`VF-CH-007/009`；mandatory loaded owner/version/sidecar/source缺失却 row-drop、partial prefix、fallback、rebuild、repair或由 observer/result 生成新 truth | `EV-CH-QUERY-*`、`EV-CH-JOB-*`、`EV-CH-TX-*`；`service-command-query`、`jobs-lifecycle`、`repository-transaction` reports；`EVG-CH-005/007` | `不通过`；原始一致性 defect 必须保持 exact error/non-pass，不能以“最终状态正确”掩盖修复越权 |
| `VETO-CH-P-008` | commit-unknown、duplicate truth 或 retry overwrite 被错误终止/补写 | `03` UoW commit resolution/idempotency contract、Step 8、`VF-CH-010`；commit unknown 后未查询唯一 authority即重写，或 rollback/repair 把未知状态伪装为失败/成功，重复保存 second truth | `EV-CH-TX-*`、`EV-CH-STATE-*`、`EV-CH-CMD-*`；`repository-transaction`、`domain-state` reports；`report-audit.md` 中 attempt/retest pairing | `不通过`；保留 unknown、唯一解析和原始失败关系，修复后必须新 run，不得删除或覆盖旧 attempt |
| `VETO-CH-P-009` | VETO、S、current P0 A 或 evidence hard failure 被风险接受/人工口头确认覆盖 | `05` never-acceptable set、Step 10 `EVG-CH-010`、本步 §6.3；risk acceptance draft 包含 VF/S/P0-A、无真实授权字段或 checklist 默认全 passed | `reports/acceptance/veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/*`；实际 defect/evidence refs | `不通过` 或 `暂停验收`；风险材料本身无权改变 evidence/defect/status/verdict |
| `VETO-CH-P-010` | historical material、旧数字、旧 ID 或伪造实现/验收事实进入 active evidence | `VF-CH-013`、Step 1/3/10 historical isolation；active report/source/config/case 使用旧对象、`latest`、虚假 run/commit/reviewer/signoff或未建立的 evidence alias | `check_case_manifest.sh`、`check_config_catalog.sh`、`report-audit.md`、source/static scan；`reports/runs/<run_id>/` 与 acceptance/review provenance | `不通过` 或 `不可裁决`；回开 owning source/test Step，不能通过删改历史记录或补写事实解决 |

### 8.1 过程硬红线与正式 VF 的关系

| 过程硬红线 | 主要正式 VF 覆盖 | 是否可独立触发总体阻断 |
|---|---|---|
| evidence identity/pairing/static integrity | `VF-CH-001/007/009/010/013` | 是；证据不成立时至少不可裁决，伪造时不通过 |
| redaction/body/secret | `VF-CH-004/006/011` | 是 |
| dependency/responsibility | `VF-CH-005/006/011/012` | 是 |
| strict config/fail-fast/profile isolation | `VF-CH-004/011/012/013` | 是 |
| source-missing/query/job repair | `VF-CH-007/009/010` | 是 |
| commit-unknown/duplicate truth | `VF-CH-009/010` | 是 |
| risk acceptance or fake review bypass | all applicable VF; `05` never-acceptable | 是 |

过程行与正式 VF 有交叉是有意的：正式 VF 裁决业务责任/边界，过程行裁决验收证据和执行机制是否可信；同一 finding 可同时引用两类 ID，但不得重复计数为两个不同业务缺陷。

## 9. VETO 闭环矩阵

| VETO ID | 来源 | required EV/TC/DS 方向 | mandatory check / report | 触发后结论 | risk acceptance |
|---|---|---|---|---|---|
| `VETO-CH-001` | `VF-CH-001` | FOUNDATION/CMD/QUERY/STATE families；AC-CH-001..005 | case manifest、state registry、`static-contract-docs`、`domain-state`、`service-command-query`、release summary | 不通过 | 禁止 |
| `VETO-CH-002` | `VF-CH-002` | identity Command/Query/state negative cases | responsibility/redaction checks；identity reports | 不通过 | 禁止 |
| `VETO-CH-003` | `VF-CH-003` | registry lifecycle/query/job/TX cases | state/manifest/config/responsibility reports | 不通过 | 禁止 |
| `VETO-CH-004` | `VF-CH-004` | descriptor, BIND, OBS, CONFIG body-free cases | redaction/responsibility/config reports | 不通过 | 禁止 |
| `VETO-CH-005` | `VF-CH-005` | governance seam inbound/command/query/binding cases | dependency/responsibility reports | 不通过 | 禁止 |
| `VETO-CH-006` | `VF-CH-006` | method relation/body-free inbound/foundation/binding cases | dependency/redaction/responsibility reports | 不通过 | 禁止 |
| `VETO-CH-007` | `VF-CH-007` | all Query/Inbound/Outbound/Job/TX no-write cases | responsibility, pairing, no-static and affected suites | 不通过 | 禁止 |
| `VETO-CH-008` | `VF-CH-008` | exposure/state/governance completeness cases | state registry, responsibility and service reports | 不通过 | 禁止 |
| `VETO-CH-009` | `VF-CH-009` | change/trace/impact/capture/sidecar cases | pairing/report audit and observation reports | 不通过 | 禁止 |
| `VETO-CH-010` | `VF-CH-010` | TX/STATE/CMD/OUTBOUND/JOB race/replay cases | state pair, transaction, pairing and retry audit | 不通过 | 禁止 |
| `VETO-CH-011` | `VF-CH-011` | OBS/BIND/CONFIG plus full source/output scan | redaction/responsibility/no-static reports | 不通过 | 禁止 |
| `VETO-CH-012` | `VF-CH-012` | FOUNDATION/BIND/OBS static dependency cases | dependency/Rustdoc/public-surface reports | 不通过 | 禁止 |
| `VETO-CH-013` | `VF-CH-013` | FOUNDATION/CONFIG/OBS historical denylist cases | manifest/config/report audit | 不通过 or not-decidable | 禁止 |
| `VETO-CH-P-001` | Step 10 `EVG-CH-001..003/008` | all applicable EV rows and exact TC/DS pair | evidence-index, pairing, report-audit | invalid/not-decidable; no pass | 禁止 |
| `VETO-CH-P-002` | Step 10 `EVG-CH-008/010` | raw-derived status fidelity | no-static/report-audit/checklist | 不通过 or pause | 禁止 |
| `VETO-CH-P-003` | redaction/`VF-CH-004/006/011` | OBS/CONFIG and all report surfaces | `redaction-check.md` | 不通过 | 禁止 |
| `VETO-CH-P-004` | dependency/responsibility/`VF-CH-005/006/012` | FOUNDATION/BIND/OBS and public graph | boundary reports | 不通过 | 禁止 |
| `VETO-CH-P-005` | strict config/`AC-CH-033..037` | CONFIG-001..018 and activation cases | config redline/gate summary | 不通过 | 禁止 |
| `VETO-CH-P-006` | observation/`EVG-CH-004/005` | OBS-001..012 and durable carrier consumers | observation/redaction reports | 不通过 or not-decidable | 禁止 |
| `VETO-CH-P-007` | state/TX/query/job hard gates | QUERY/JOB/TX cases with loaded-defect branches | service/jobs/repository reports | 不通过 | 禁止 |
| `VETO-CH-P-008` | commit resolution/`VF-CH-010` | TX/STATE/CMD retry/race/replay cases | transaction/state/report audit | 不通过 | 禁止 |
| `VETO-CH-P-009` | `05` never-acceptable + Step 10 review input | all affected EV and defect/residual refs | acceptance/review reports | 不通过 or pause | 禁止 |
| `VETO-CH-P-010` | `VF-CH-013` and historical isolation | active source/config/case/report full scan | manifest/config/report audit | 不通过 or not-decidable | 禁止 |

所有 report path 均是固定路径模板，不代表文件已存在。实际执行必须将同一行绑定到真实 run-scoped raw/report/check refs；没有这些 refs 时，行状态只能是未裁决/阻断。

## 10. 一票否决项停审记录

停审记录检查的是设计是否已具备未来可裁决条件，不是对实现或测试结果的通过宣告。

| 审查项 | 结论 | 依据 | 当前事实 / 缺口 |
|---|---|---|---|
| `VF-CH-001..013` 是否全部有稳定 VETO 映射 | `pass-designed` | §7 `VETO-CH-001..013` 一对一表 | `13/13` 仅为设计合同；无真实 negative evidence instance |
| 每项 VETO 是否回指正式需求或设计红线 | `pass-designed` | VF、BR、AC、global dependency/config/observation rule 列已固定 | future source digest 尚未建立 |
| 每项 VETO 是否有可执行检查方向 | `pass-designed` | canonical EV family、suite、mandatory check、report path 已列出 | scripts、run、raw、report 尚不存在 |
| VETO 是否明确区分命中、证据不足和不适用 | `pass-designed` | §6.1/§6.2；`不通过`、`不可裁决`、`blocked_dependency`、`not_applicable_by_manifest` 分离 | 实际 scope manifest 尚未建立 |
| VETO 是否阻断通过及有条件通过 | `pass-designed` | §6.3、§9 verdict impact | 没有实际 verdict；不得把设计状态写成结果 |
| VETO 是否禁止风险接受 | `pass-designed` | §6.3、§8、§9；13 VF 与过程硬红线均为禁止 | 尚无 risk acceptance instance |
| P1 unavailable、旧 numeric、P2 absence 是否被误设 VETO | `pass-designed` | §6.2 明确排除 | selected/release applicability 尚未选择 |
| VETO 重复是否可解释 | `pass-designed` | VF 负责业务红线，P 行负责裁决/证据机制；§8.1 分层 | 同一真实 finding 可有多个 refs，但不重复计数 |
| 结构体/枚举/Rustdoc 约束是否进入 VETO 检查 | `pass-designed` | `VF-CH-012`、`VETO-CH-P-004`；由 `05` Rustdoc check 承接 | 仅设计门禁，未扫描代码 |
| 真实证据/审查/签署是否被伪造 | `pass-designed` | 全文使用 future path/contract；真实字段保持 none | 无 run、artifact、report、review、verdict、signoff |

## 11. 跨 VETO 覆盖审计

| 审计项 | 设计结论 | 处理规则 |
|---|---|---|
| P0 业务红线未覆盖 | 未发现 | `VF-CH-001..013` 全部逐项映射；若正式 `00` 变更，回开本步与 `05` consumer registry |
| evidence integrity 未覆盖 | 未发现 | `VETO-CH-P-001/002/009/010` 覆盖缺失、静态、跨 run、伪造 review/acceptance |
| redaction/body leak 未覆盖 | 未发现 | `VETO-CH-004/006/011` 与 `P-003` 覆盖 Hub truth、raw、report、review surfaces |
| dependency/responsibility 未覆盖 | 未发现 | `VETO-CH-005/006/011/012` 与 `P-004` 覆盖 compile/import/public/schema/call ownership |
| config bypass 未覆盖 | 未发现 | `VETO-CH-004/005/011/012/013` 与 `P-005` 覆盖 source/profile/activation/fail-fast/no-output |
| state/TX/no-write/repair 未覆盖 | 未发现 | `VETO-CH-007/009/010` 与 `P-007/008` 覆盖 Query/Job/UoW/CAS/idempotency/commit resolution |
| VETO 重复导致错误双重缺陷 | 可接受 | 同一 finding 可关联多个来源，但 primary veto 由触发事实决定；report 不得复制成多条业务事实 |
| VETO 与 risk acceptance 冲突 | 未发现 | 全部 VETO、S、current P0 A 和 hard evidence/责任缺口在 Step 13 明确排除 |
| P1/P2/production/容量被错误升级 | 未发现 | P1 unavailable、未选 product、无 numeric threshold、P2 absence 保持各自状态 |
| 检查方式不可执行 | 未发现（设计层） | 未来实现必须从 raw-derived source 建 report；缺 check 时保持 blocked/not-decidable，不得手工补 pass |
| historical material 回流 | 未发现（active mapping=0） | 由 denylist/static/config/report audit 持续检查；冲突时回开 source owner |
| 未建立的实现/证据事实 | `0` | 本文件不生成 commit、run、artifact、report、digest、review、verdict、signoff |

## 12. 回填草稿：formal `06-验收标准.md` §11

> 校准来源：
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“结构化中间产物：正式 VF 一对一映射”“结构化中间产物：验收过程硬红线”“VETO 闭环矩阵”“一票否决项停审记录”和“跨 VETO 覆盖审计”，了解本章裁决如何从需求 VF、设计红线、测试 S 级规则和证据门禁收敛。

正式 §11 只承载以下收口结论：

1. 一票否决项固定为 `VETO-CH-001..013`，分别一对一对应 `VF-CH-001..013`；不得改用其他项目的 VETO 编号。
2. 证据完整性、redaction、dependency/responsibility、strict config、required observation、Query/Job no-write/no-repair、commit-unknown/duplicate truth 和验收材料真实性另以 `VETO-CH-P-001..010` 作为过程硬红线；它们不新增正式需求编号。
3. 任一 VETO 命中时，最终结论不得为“通过”或“有条件通过”；证据缺失、无效、跨 run、无法回源或适用性未确定时，至少保持“不可裁决/暂停验收”，不得宣告未触发。
4. VETO、confirmed S、current P0 A、redaction/body leak、dependency/responsibility violation、evidence-integrity failure 和 config bypass 不得进入风险接受；不得由 P1 结果、人工口头确认、retry pass、release smoke、空 checklist 或历史材料覆盖。
5. 每项 VETO checklist row 必须引用真实 run-scoped EV/check/report/defect provenance；`EV-CH-*` 合同、固定 report path 和本中间产物本身都不是实际通过证据。
6. selected product unavailable、无 active numeric threshold 的性能样本、P2 peripheral absence、retention/operations policy 和 future evolution 不自动形成 VETO，但也不得被写成 P0 通过。

## 13. 待确认事项与受控重开

| 事项 | 当前状态 | 影响 | 受控处理 |
|---|---|---|---|
| 实际 VETO checklist 的机器字段和生成器实现 | 未建立 | 影响实现期报告 schema | 由 `07` 的 evidence/report boundary 承接；不得在 `06` 临时新增 truth field |
| selected/release applicability manifest | 未选择 | 影响 P1/R4 行是否适用 | 由 Step 3/4 baseline 和 formal 07/09 选择；缺失时保持 blocked/not-applicable-by-manifest，不默认 pass |
| concrete redaction/dependency/report check implementation | 未建立 | 影响 future evidence validity | 由 `05`/`07` 实现；脚本或 schema 变化需按 `05` regression trigger 复验 |
| numeric NFR threshold | 未建立 | 不产生当前 numeric VETO | 只有正式来源和 controlled reopen 后才可加入；不能复活旧数字 |
| reviewer/acceptor/signoff authority | 未指定 | 影响 Step 14 | Step 14 只定义字段与顺序；当前不填人名、时间或签名 |
| 具体 retention/operations policy | 未建立 | 影响长期归档，不改变本步 VETO | 交 formal owner；不把缺失政策伪装成通过 |

以上均不是当前 upstream blocker。若 active `00~05` 的 VF、证据 contract、state denominator、责任边界或配置语义发生变化，必须回开对应 owner Step，重新审计本文件，而不是在正式 §11 直接补一行。

## 14. Step 11 完成门禁与 Step 12 入口

| 进入下一步条件 | 结果 |
|---|---|
| 13 个正式 VF 均有一对一 VETO | `通过；13/13` |
| 每项有正式来源、检查方向、固定 report/path 和 verdict impact | `通过；设计层闭合` |
| 过程硬红线覆盖 evidence/redaction/dependency/config/no-repair/commit-unknown | `通过；10/10` |
| VETO 命中不可通过且不可风险接受 | `通过；规则已固定` |
| P1/P2/旧数字/外围政策边界清楚 | `通过；无误升级` |
| 跨 VETO 审计有 unresolved 冲突 | `无` |
| 真实执行、证据、缺陷、review、verdict、signoff 是否存在 | `均不存在；未伪造` |
| unresolved upstream blocker | `0` |
| 可进入下一步 | `是：enter_06_step_12_defects_retest_release` |

Step 11 的 `pass-designed` 只表示 VETO 设计和追溯结构已闭合，不表示任何 VETO negative test、evidence、实现或验收结果已通过。
