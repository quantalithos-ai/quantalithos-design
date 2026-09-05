# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节：`projects/L2-member/05-测试方案.md` §14「回归策略与残余风险」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md`
> 状态口径：本文定义 planned 回归触发和风险登记，不执行回归、不填写真实缺陷、EV、verdict 或 readiness。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14：定义回归策略与残余风险 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 6 用例；Step 9 门禁；Step 10 专项；Step 11 复验；Step 12 进出；Step 13 证据 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_14_regression_risks.md` |
| 回填位置 | 正式 `05-测试方案.md` §14（Step 15） |
| 停审方式 | 回归触发表、全量条件、残余风险、接受 / 待确认和 06 交接完成后停审 |

## 2. 本步目标

定义设计、实现、配置、依赖、测试、证据或文档发生变化时的最小回归和全量回归，集中记录暂不覆盖的 P1/P2、external blocker、DDD gap 和性能 / 产品风险。所有 residual 必须有 owner 角色、接受人或待确认项；不可接受的 P0 红线不能以 risk acceptance 关闭。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases.md` | TC-L2M 用例族和切口 |
| `05_test_plan_step_09_automation_gates.md` | suite / gate 和触发位置 |
| `05_test_plan_step_10_nonfunctional.md` | 专项、性能 sample、安全 / 一致性风险 |
| `05_test_plan_step_11_defects_retest.md` | 缺陷复验和全量触发条件 |
| `05_test_plan_step_12_entry_exit.md` | P0 退出门禁和 residual 处理 |
| `05_test_plan_step_13_evidence.md` | EV、artifact/report 和回归证据归档 |
| `00-需求文档.md`、`03-详细设计.md`、`04-配置设计.md` | 需求、设计和配置变更来源 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些变更触发最小回归？ | 对应模块、协议、状态、flow、Store、adapter、config、observability、script 或 report 的局部变更至少触发该切口的 unit / service / boundary suite、相邻 CP suite 和相关 redline check。 |
| 哪些变更触发全量回归？ | 修改双锚 / subject、public protocol、state matrix、UoW / CAS / idempotency / typed replay、Query no-write、Job no-truth-repair、redaction / dependency gate、P0 profile、evidence schema，或修复任何 S 级缺陷时，触发全部 P0 suite + release redline + report audit。 |
| 哪些风险暂不覆盖？ | 真实 host / Runtime / Bus / image / resolver / durable Store positive compatibility、生产容量和硬性能阈值、复杂策略 / UI / SDK、长周期保留和外部产品深度语义；保留 P1/P2 / residual。 |
| 谁接受 residual？ | P0 不可接受；P1/P2 由验收负责人、架构负责人或测试负责人在 `06` / `reports/acceptance/risk-acceptance.md` 明确接受。当前未指定姓名的项目记为待确认。 |
| 哪些风险转入 06？ | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、24 candidate schema / route、P1 selected-run 条件、性能阈值、证据保留期、真实 adapter compatibility 和 owner acceptance。 |
| 回归证据如何衔接？ | 每次回归使用新的固定 `run_id`，按 Step 13 生成 raw artifact / report / EV index；不得覆盖原始失败 run，不得引用 `latest`，也不得把重复 run 静态合并成通过。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 没有变更到 suite 的映射 | 建立模块 / 语义变更到最小回归和全量回归表 |
| residual 分散在各 Step | 汇总 blocker、P1/P2、性能、产品和证据风险 |
| 只重跑失败 case 可能漏跨层回归 | 失败 case + family + suite + check；红线变更强制全量 |
| 外部 blocked lane 容易被清掉 | 作为持续 blocker / residual 保留到 06 / 07 |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| 回归触发 | 按经验重跑 | 变更类型 → 最小 / 全量 suite | 可执行 |
| residual | 分散、无接受路径 | 统一 owner / 接受人 / 待确认 | 便于 06 消费 |
| 回归证据 | 可能覆盖旧结果 | 每次新 run_id，按 Step 13 归档 | 保留审计链 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否所有变更全量回归 | 风险分层；红线变更全量，其余最小回归 | 平衡效率与覆盖 |
| 是否只重跑失败用例 | 不；至少 family + suite + check | 跨 CP 语义相互影响 |
| P1 unavailable 是否记 P0 fail | 记 residual / blocked，不伪造 P0 fail 或 pass | P1 非核心前置 |
| 性能 candidate 是否硬化 | 只保留 sample / trend | 无正式 workload authority |
| evidence schema 变更是否跑业务回归 | 至少 report audit + 受影响 P0 sample；若改变 EV / gate 语义则全量 | 证据真实性是 P0 红线 |

## 8. 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任角色 |
|---|---|---|---|
| contracts / DTO / enum / error | `contract-domain-fast` + `api-worker-entry` 受影响族 | public protocol / result-kind / error redaction 变更 | member contract owner |
| domain object / policy / state helper | `contract-domain-fast` + 对应 CP service | 双锚、state matrix、owner fence、reserved gap 规则变更 | domain owner |
| application service / flow | `service-flow-fast` + 对应 entry / Job family | UoW、CAS、replay、Query no-write、source repair boundary 变更 | application owner |
| Store / UoW / version / idempotency | `infra-fake-parity` + `replay-recovery` | transaction / commit-unknown / CAS 语义变更 | infra / consistency owner |
| worker Consumer / source gate | `api-worker-entry` + affected service | source family、receipt、dedup、body gate 变更 | worker owner |
| Job / projection / continuation | `job-continuation` + `projection-readmodel` | Job report / partial isolation / source truth boundary 变更 | jobs / read-model owner |
| resolver / handoff / availability | `infra-fake-parity` + blocked seam tests | owner contract / external success mapping / unknown fence 变更 | adapter owner |
| config / profile / builder | `config-redline` + `dependency-boundary` | P0 profile、required slot、redaction 或 invariant 可配置性变更 | config owner |
| logs / metrics / trace / audit | `redaction-boundary` + report audit | deny list、label schema、audit relation或 evidence mapping 变更 | observability / QA |
| scripts / gate / report schema | affected suite + `report-generation-audit` | artifact/report root、EV index、gate semantics 变更 | QA / release owner |
| sibling / upstream contract | local blocked / refusal suite + selected seam | blocker 关闭或 schema / route / credential / subject contract 改变 | owner coordination |

### 8.1 全量 P0 回归集

```text
contract-domain-fast
service-flow-fast
api-worker-entry
config-redline
dependency-boundary
infra-fake-parity
job-continuation
replay-recovery
redaction-boundary
projection-readmodel
local-smoke
release-redline
report-generation-audit
```

全量集合仍是 planned suite 名称；没有脚本执行或结果时不得写成已通过。

## 9. 残余风险表

| 风险 | 未覆盖 / 未关闭原因 | 影响 | 缓解方式 | 接受人 / 状态 |
|---|---|---|---|---|
| `L2M-UP-001` host / IPC / credential | exact contract pending | host positive qualification | local request / signal / report + blocked seam | member-service / identity owner待确认 |
| `L2M-UP-002` image release | manifest / compatibility pending | image / assembly selected run | opaque ref / availability / waiting | member-images owner待确认 |
| `L2M-UP-003` Runtime entry mapping | trigger / EntryAuthority pending | positive Runtime admission | missing mapping refusal / blocked | Runtime owner待确认 |
| `L2M-UP-004` Runtime handoff / feedback | source family pending | result link / publication qualification | attempt / gap / unknown fence | Runtime / Bus owner待确认 |
| `L2M-UP-005` 24 candidate schema / route | Core / Bus member-specific contract pending | event publication qualification | zero configuration / non-materialization | Core / Bus owner待确认 |
| `L2M-UP-006` credential / identity anchor | owner shape pending | admission positive | opaque ref / fail-closed | identity / host owner待确认 |
| `L2M-UP-007` screening taxonomy | policy source pending | screening positive allow lane | unknown / stale / conflict conservative | governance / security owner待确认 |
| `L2M-UP-008` non-project subject | scope unresolved | future subject support | reject / blocked | architecture owner待确认 |
| `L2M-DDD-001/002` repo / physical Store | implementation / product not selected | compile / durable proof | planned fake / logical contract | implementation owner待确认 |
| `L2M-DDD-003~007` receipt / CP04~07 helpers | source / helper / version gaps | affected positive tests | refusal / reserved edge | design owner待确认 |
| `scope_supersede_gap` | successor helper missing | Replace positive | refusal / wait_design | domain owner待确认 |
| 性能 / capacity | no workload or SLO authority | throughput / latency uncertainty | stage sample / later benchmark | product / QA待确认 |
| real-like compatibility | no approved product / provider | deployment behavior | P1 selected run | release owner待确认 |
| evidence retention | archive policy not fixed | long-term audit | retain through acceptance + defect closure | archive owner待确认 |

## 10. 残余风险与 06 交接审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 每个 residual 有 owner / 待确认 | `covered` | 表中角色和 blocker ID 明确 |
| P0 红线被 risk acceptance 隐藏 | `forbidden` | S / VF 不可接受 |
| P1/P2 与 P0 退出分离 | `defined` | selected-run / performance 不阻断 P0，仍须记录 |
| 回归结果可追溯 | `defined` | 新 run_id + Step 13 artifact/report |
| 06 可消费 | `ready_as_planned_input` | 不表示 06 已创建或验收已通过 |

## 11. 回填草稿（供正式 §14）

回归按变更风险分层：局部 contracts / domain / service / worker / Job / config / observability 变更至少运行对应 suite、相邻 family 和 redline check；双锚、public protocol、state matrix、UoW / CAS / replay、Query no-write、Job no-truth-repair、redaction / dependency、P0 profile、evidence schema 或 S 级修复触发全量 P0 回归。每次回归使用新的固定 `run_id`，按 Step 13 保留 raw artifact、report、index 和审查记录。

真实 host、Runtime、Bus、image、resolver、durable Store、性能硬阈值、复杂策略和长期归档是 P1/P2 或 residual。`L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 及 24 candidate blocker 必须继续进入 `06` / `07`；无接受人不得关闭 residual，任何 P0/VF 红线不得风险接受。

## 12. 进入下一步条件

- [x] 变更类型到最小 / 全量回归触发已明确。
- [x] 残余风险、影响、缓解和接受 / 待确认角色已登记。
- [x] 回归与 Step 13 artifact/report/evidence 归档衔接已定义。
- [x] 未执行回归、未填写缺陷、EV、verdict 或 readiness。

**Step 14 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 15 正式文档装配。
