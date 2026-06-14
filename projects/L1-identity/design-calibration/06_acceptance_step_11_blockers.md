# Step 11. 定义一票否决项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节: `06-验收标准.md` §11 一票否决项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义一票否决项 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~10 已审核通过;新版 `00` `VETO-ID-001~006`;新版 `05` veto evidence |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_11_blockers.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

把 `00-需求文档.md` 已正式定义的 `VETO-ID-001~006` 转成验收阶段的一票否决裁决门禁。

本 Step 只定义:

- 每个 `VETO-ID-*` 的来源、触发条件、反例、证据 / 检查方式和裁决影响。
- `reports/acceptance/veto-checklist.md` 如何覆盖六个 VETO。
- VETO 与 Step 5~10 的功能、边界、接口、状态、非功能和证据门禁之间的关系。
- VETO 命中后不得风险接受、不得有条件通过、不得用后续修复替代当前裁决。

本 Step 不新增新的 `VETO-ID`。redaction check fail、dependency check fail、static evidence pass、raw artifact/report pairing 缺失等也是阻断问题,但它们分别作为 `VETO-ID-003/006` 的证据或 Step 10 evidence integrity / Step 12 S 级缺陷输入处理,不在本 Step 私自扩展编号。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §14 | 正式输入 | 提供 `VETO-ID-001~006` 一票否决定义和来源 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 forbidden material、dependency boundary、query no-write、consumer no-create、job report-only 红线 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | 提供 state illegal accepted、query write、job repair truth、duplicate rerun 的升级裁决入口 |
| `06_acceptance_step_09_nonfunctional.md` | 已审核通过 | 提供 redaction、trusted context、append-only、dependency、fake parity 阻断口径 |
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | 提供 `veto-checklist.md` 覆盖、EV / artifact / report 回指和证据完整性阻断 |
| `05-测试方案.md` §2 / §10 / §11 / §13 | 正式输入 | 提供 VETO P0 断言、红线专项、S 级缺陷、正式 EV 和 report path |
| `05_test_plan_step_13_evidence.md` | 已审核通过 | 提供 VETO 相关 EV、artifact/report、veto checklist 和 review 要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题是一票否决? | 仅 `VETO-ID-001~006`:成员身份 ref 复用、query/consumer/callback/job 隐式创建 identity truth、保存外部正文 / credential / raw secret、高风险 lifecycle 无授权 / 治理依据仍 accepted、maintenance / reconciliation 修相邻仓 truth、业务仓源码依赖 / truth mixing。 |
| 否决项来自哪里? | 全部来自 `00-需求文档.md` §14,并由 `00` 的 BR / FR、`01/03` 的边界 / 状态 / 事务不变量、`05` 的 P0 suite / evidence 支撑。 |
| 如何检查是否触发? | 通过 `reports/acceptance/veto-checklist.md` 进入,回指 `reports/runs/<run_id>/evidence-index.md`、suite report、raw artifact、redaction check、dependency boundary、operations replay 和 service / domain / query / job cases。 |
| 证据缺失时如何处理? | 缺少 VETO 对应 evidence / raw artifact / report 时,Step 11 不得裁决“未触发”;整体至少为不通过或送验不成立。证据缺失本身也进入 Step 12 S 级 / evidence integrity 缺陷。 |
| VETO 命中是否可风险接受? | 不可。任一 VETO 命中,总体结论必须是不通过;不得进入有条件通过,不得通过 `risk-acceptance.md` 覆盖。 |
| query write、job repair truth、duplicate rerun mutation 是否都作为 VETO? | query / consumer / callback / job 隐式创建 identity truth 归 `VETO-ID-002`;reconciliation / maintenance 修相邻 truth 归 `VETO-ID-005`;duplicate rerun 若导致 ref reuse、implicit create、truth repair 或 evidence integrity 破坏,按对应 VETO / S 级缺陷裁决。 |
| redaction / dependency / evidence integrity failure 如何归类? | external body / secret 泄漏归 `VETO-ID-003`;sibling compile dependency / truth mixing 归 `VETO-ID-006`;static evidence pass / raw artifact pairing 缺失是 Step 10 evidence integrity 阻断和 Step 12 S 级缺陷,不新增 VETO 编号。 |
| 每个否决项完成后是否停审? | 本 Step 为六个 VETO 建立逐项停审记录和跨否决审计表。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 一票否决可能混入旧对象或泛化安全问题 | 新版只采用正式 `VETO-ID-001~006` |
| Step 6 / Step 8 | 已多次提到 query write、job repair、dependency、forbidden body | 本 Step 绑定到对应 VETO 或 S 级缺陷,避免重复编号 |
| Step 10 | 只验 veto checklist 覆盖,不裁决触发 | 本 Step 裁决触发后总体不通过 |
| `05` §11 | S 级缺陷包括 evidence integrity | 本 Step 不扩展 VETO,但标注 evidence integrity 是进入 Step 12 的 S 级阻断 |
| `05` 早期候选表 | 出现历史候选 evidence family 写法 | 本 Step 只使用 Step 13 正式 `EV-ID-*` |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| VETO 来源 | 分散在需求、测试和各验收 Step | 固定为 `00` §14 六项 | 防止私自扩展 |
| 触发后结论 | 可能进入风险接受 | 任一命中必须不通过 | 书写规范要求 |
| 证据入口 | 分散引用 suite / EV | 统一从 `veto-checklist.md` 和 `evidence-index.md` 回指 | 可复查 |
| evidence integrity | 可能被误当成新增 VETO | 单列为 Step 10 / Step 12 阻断,不新增编号 | 保持真相源一致 |
| duplicate rerun | 可能泛化为独立 VETO | 若产生隐式创建 / ref reuse / truth repair,归对应 VETO;否则 Step 8/12 阻断 | 避免重复定义 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否新增 VETO-ID-007 evidence integrity | A. 新增;B. 不新增,作为 Step 10 / Step 12 阻断 | 采用 B。`00` 只正式定义六项。 |
| 是否把 query write 全部归 VETO | A. 全部归 VETO;B. 只有隐式创建 identity truth 或 accepted truth write 才归 `VETO-ID-002`,其他 query write 是 S 级/状态事务不通过 | 采用 B。保持 VETO 语义精确。 |
| 是否把 job 修 identity business truth 归 `VETO-ID-005` | A. 是;B. 只把修相邻仓 truth 归 VETO,修 identity truth 归 S 级 | 采用 B。`VETO-ID-005` 正式文本是相邻仓 truth;identity truth repair 仍是不通过 / S 级,但不私改 VETO。 |
| 是否允许 VETO 命中后有条件通过 | A. 允许;B. 不允许 | 采用 B。VETO 不得风险接受。 |
| 是否只看 `veto-checklist.md` 结论 | A. 是;B. 必须能回指 EV / artifact / report | 采用 B。防止静态声明。 |

## 8. 结构化中间产物

### 8.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| `VETO-ID-001` | 成员身份引用被复用给另一个成员 | 成员身份主语一旦建立必须稳定,墓碑化或退役也不得释放给新成员 | `EV-ID-STATE-001`;`EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/acceptance/veto-checklist.md` |
| `VETO-ID-002` | 查询、consumer、callback、projection 或 maintenance job 隐式创建 identity truth | 创建和读取 / 消费 / 维护必须分离;缺失目标只能 missing/not-visible/delayed/quarantined/rejected/noop | `EV-ID-QUERY-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `VETO-ID-003` | Identity 保存 RoleDefinition、ProjectMember、memory、artifact、conversation、runtime、archive body、credential、token 或 raw secret | identity 只保存自身 truth、refs、safe summaries、markers 和 issue refs;外部正文与 secret 零容忍 | `EV-ID-REDACTION-001`;`EV-ID-CONTRACT-001`;`EV-ID-CONSUMER-001`;`EV-ID-OUTBOX-001`;`reports/runs/<run_id>/redaction-check.md`;`artifacts/test/<run_id>/suites/redaction-boundary/` |
| `VETO-ID-004` | 高风险 lifecycle 缺少授权 / 治理依据仍 accepted | 高风险生命周期处置必须有可信 actor、原因和授权 / 治理依据;缺失或不可用不能 accepted | `EV-ID-CMD-001`;`EV-ID-STATE-001`;`EV-ID-CORE-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/release-main-smoke.md` |
| `VETO-ID-005` | 维护对账绕过正式能力修改相邻仓 truth | reconciliation / maintenance 只能 report-only,不得修 work、method-library、memory、archive 等相邻仓 truth | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/acceptance/veto-checklist.md` |
| `VETO-ID-006` | 将运行期 / 事件协作依赖写成业务仓源码依赖,形成 L1 循环或 truth 混层 | identity 只能编译期依赖 core contracts;业务 sibling 通过 runtime/event/adapter/replay/handoff 协作 | `EV-ID-ARCH-001`;`EV-ID-CONFIG-001`;`reports/runs/<run_id>/dependency-boundary.md`;`artifacts/test/<run_id>/suites/dependency-boundary/` |

### 8.2 否决触发裁决表

| 否决项 ID | 触发条件 | 未触发判定 | 触发后结论 |
|---|---|---|---|
| `VETO-ID-001` | 任一测试或证据显示同一 member ref 被分配给另一个成员,或 terminal ref 被释放复用 | create/update/duplicate/terminal cases 均 reject/conflict/noop,无 ref reuse artifact | 总体不通过;不得风险接受 |
| `VETO-ID-002` | query、consumer、callback、projection、maintenance/job 在 missing target 时创建 `GlobalMember` 或 identity business truth | missing/not-visible/delayed/quarantined/rejected/noop,且 write-audit 无 truth create | 总体不通过;不得风险接受 |
| `VETO-ID-003` | store、event、trace、audit、report、artifact、log 或 evidence 中出现 forbidden body / credential / raw secret | redaction check clean,negative leak fixture safe failure,artifact/report no forbidden material | 总体不通过;不得风险接受 |
| `VETO-ID-004` | 高风险 lifecycle 无可信依据、依据不可用或不匹配仍 accepted | command rejected/degraded/pending before lifecycle save,无 accepted trace/outbox/result | 总体不通过;不得风险接受 |
| `VETO-ID-005` | reconciliation / maintenance 修改相邻仓 truth,或 report-only flow 产生 remediation write | 只生成 finding/report/issue refs,无 adjacent truth write | 总体不通过;不得风险接受 |
| `VETO-ID-006` | manifest/dependency graph 出现非 core sibling business compile dependency、shared DB truth mixing 或 source-level cycle | dependency boundary clean,业务协作均通过 runtime/event/adapter/replay/handoff | 总体不通过;不得风险接受 |

### 8.3 VETO 证据闭环表

| 否决项 ID | 需求来源 | 关联验收项 | 测试 / suite | Evidence / report | 缺失影响 |
|---|---|---|---|---|---|
| `VETO-ID-001` | `BR-ID-001`;`FR-ID-003`;`AC-ID-001`;`AC-ID-014` | `AC-FUNC-*`;`AC-STATE-001`;`AC-NFR-007` | `TC-ID-DOMAIN-*`;`TC-ID-STATE-*`;`TC-ID-CMD-*`;`TC-ID-IDEMP-*`;`contract-domain-fast`;`service-flow-fast` | `EV-ID-STATE-001`;`EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`reports/acceptance/veto-checklist.md` | 无法证明 ref 未复用,不通过或送验不成立 |
| `VETO-ID-002` | `BR-ID-002`;`FR-ID-001~002`;`AC-ID-001~002` | `AC-BOUNDARY-004/005/006`;`AC-TX-004`;`AC-NFR-002` | `TC-ID-QUERY-*`;`TC-ID-CONSUMER-*`;`TC-ID-JOB-*`;`service-flow-fast`;`entry-worker-job`;`operations-replay-core` | `EV-ID-QUERY-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` | 无法证明 no implicit create,不通过 |
| `VETO-ID-003` | `BR-ID-007`;`BR-ID-011`;`BR-ID-012`;`NFR-ID-004`;`AC-ID-014` | `AC-BOUNDARY-002`;`AC-NFR-004/008`;`AC-EV-007` | `TC-ID-REDACTION-*`;`TC-ID-CONTRACT-004`;`TC-ID-CMD-010`;`redaction-boundary` | `EV-ID-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` | redaction 无法证明 clean,不通过 |
| `VETO-ID-004` | `BR-ID-005`;`FR-ID-005`;`AC-ID-007` | `AC-FUNC-*`;`AC-STATE-001`;`AC-NFR-003` | `TC-ID-CMD-*`;`TC-ID-STATE-*`;`service-flow-fast`;`release-main-smoke` | `EV-ID-CMD-001`;`EV-ID-STATE-001`;`EV-ID-CORE-001` | 无法证明 high-risk guard,不通过 |
| `VETO-ID-005` | `BR-ID-015`;`FR-ID-014`;`AC-ID-005` | `AC-BOUNDARY-006`;`AC-STATE-002`;`AC-NFR-009` | `TC-ID-JOB-*`;`TC-ID-IDEMP-*`;`operations-replay-core` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 无法证明 report-only,不通过 |
| `VETO-ID-006` | `00` Step 6 dependency rule;`AC-ID-014`;`AC-ID-015` | `AC-BOUNDARY-003`;`AC-NFR-010/011` | `TC-ID-ARCH-001`;`dependency-boundary`;`config-redline` | `EV-ID-ARCH-001`;`EV-ID-CONFIG-001`;`reports/runs/<run_id>/dependency-boundary.md` | 无法证明 dependency boundary,不通过 |

### 8.4 非 VETO 但阻断的前置项

| 阻断项 | 来源 | 裁决口径 | 后续处理 |
|---|---|---|---|
| P0 evidence index 缺 EV / TC / AC / VETO 回指 | Step 10 `AC-EV-005` | 送验不成立或不通过,不得宣告 VETO 未触发 | Step 12 S 级缺陷;补 run evidence |
| raw artifact / report pairing 缺失 | Step 10 `AC-EV-009`;`EV-ID-REPORT-001` | 不通过,不得手写补 pass | Step 12 S 级缺陷;重新生成 evidence |
| static evidence / static VETO pass | Step 10 `AC-EV-009` | 不通过 | Step 12 S 级缺陷 |
| redaction scan fail 但未定位到具体业务触发 | Step 10 `AC-EV-007` | 不通过;若属于 forbidden body / secret 则归 `VETO-ID-003` | Step 11/12 联动 |
| dependency report 缺失 | Step 10 `AC-EV-008` | 不通过;若发现 dependency loop 则归 `VETO-ID-006` | Step 11/12 联动 |
| P0 blocking suite fail | `05` §11 S 级规则 | 不通过,除非证明为测试工具缺陷且有复验 | Step 12 缺陷分级 |

### 8.5 一票否决项停审记录

| 否决项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `VETO-ID-001` | 来源、触发条件、EV/report、风险接受规则 | 通过 | 无新增编号 |
| `VETO-ID-002` | query/consumer/callback/job implicit create coverage | 通过 | query write 但未创建 truth 的场景留 Step 12 S 级 |
| `VETO-ID-003` | forbidden material / redaction evidence | 通过 | evidence integrity fail 先按 Step 10/12 阻断 |
| `VETO-ID-004` | high-risk lifecycle basis | 通过 | 具体 governance protocol 不在本 Step 定义 |
| `VETO-ID-005` | adjacent truth repair boundary | 通过 | identity business truth repair 是 S 级/状态事务不通过,不扩写 VETO 文本 |
| `VETO-ID-006` | dependency boundary / truth mixing | 通过 | 使用 `EV-ID-ARCH-001` / dependency-boundary |

### 8.6 跨否决裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 `VETO-ID-001~006` | 通过 | 六项均有表项 |
| 是否所有 VETO 都来自正式需求红线 | 通过 | 来源均为 `00` §14 / BR / FR |
| 是否私自新增 VETO | 否 | evidence integrity 另列阻断项 |
| 是否每项都有 evidence / report path | 通过 | 见 §8.1 / §8.3 |
| 是否每项都有触发后结论 | 通过 | 任一触发均不通过 |
| 是否允许风险接受覆盖 VETO | 否 | 明确禁止 |
| 是否静态声明 VETO pass | 否 | 必须回指 raw artifact / report |
| 是否提前处理缺陷分级 / 复验 | 否 | 留 Step 12 |
| 是否提前处理风险接受 | 否 | 留 Step 13 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 正式 VETO 仅 `VETO-ID-001~006` | 否 | 承接 `00` §14 | 无需回写 |
| evidence integrity 不新增 VETO | 否 | 与 Step 10 / `05` §11 对齐 | Step 12 处理 S 级 |
| identity business truth repair 不改写 `VETO-ID-005` | 否 | 保持需求文本精确 | Step 12 作为 S 级 / 状态事务失败处理 |
| 若后续要新增 VETO | 是 | 需求红线变更 | 必须回写 `00` / `05` / `06` |
| 若 veto checklist 无法生成 | 是 | 证据工具缺口 | Step 10 / Step 12 阻断 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_11_blockers.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“一票否决项表”“否决触发裁决表”“VETO 证据闭环表”“非 VETO 但阻断的前置项”和“跨否决裁决审计表”小节,了解一票否决如何从需求红线、设计不变量和测试证据收敛。

正式 `06-验收标准.md` §11 应回填:

- 一票否决项只包括 `VETO-ID-001~006`。
- 任一 VETO 命中,总体结论必须为不通过,不得有条件通过,不得风险接受。
- `reports/acceptance/veto-checklist.md` 必须覆盖六项并回指 `reports/runs/<run_id>/evidence-index.md`、suite report、raw artifact 和相关 EV。
- `VETO-ID-003` 由 forbidden material / redaction 证据裁决,`VETO-ID-006` 由 dependency-boundary 证据裁决。
- evidence integrity、static evidence pass、raw artifact/report pairing 缺失等是阻断项和 S 级缺陷输入,但不新增 VETO 编号。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 `veto-checklist.md` 是否已生成并经审查 | 影响最终裁决 | Step 14 使用真实 run 判定 |
| query write 但未创建 truth 的缺陷如何分级 | 影响 Step 12 | 本 Step 不扩写 VETO,Step 12 分级 |
| identity business truth repair by job 是否作为 S 级 | 影响 Step 12 | 作为状态 / 事务 / job no-repair 阻断 |
| 高风险 lifecycle 的具体 governance basis protocol | 影响实现细节 | 需求层只固定必须有依据;协议不在本 Step 定义 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 一票否决项表完成 | 通过 | 见 §8.1 |
| 否决触发裁决表完成 | 通过 | 见 §8.2 |
| VETO 证据闭环表完成 | 通过 | 见 §8.3 |
| 非 VETO 阻断项边界明确 | 通过 | 见 §8.4 |
| 一票否决项已停审 | 通过 | 见 §8.5 |
| 跨否决裁决审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 未提前替代 Step 12~14 | 通过 | 缺陷、风险和最终签署留后续 |
| 可进入 Step 12 | 通过 | 用户已确认,进入 Step 12: 定义缺陷分级、复验与放行规则 |
