# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节: `06-验收标准.md` §12 缺陷分级、复验与放行规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义缺陷分级、复验与放行规则 |
| 当前状态 | 已完成;自动连续推进 |
| 输入基线 | `05-测试方案.md` §11 / §12 / §14;Step 10 证据门禁;Step 11 VETO |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md` |
| 停审方式 | 本轮按用户要求不停审连续推进;本文件保留独立停审记录 |

## 2. 本步目标

定义缺陷如何影响验收结论、修复后如何复验、哪些缺陷可以放行或风险接受。

本 Step 只回答:

- S/A/B/R 缺陷如何定义。
- 每级缺陷对通过、有条件通过、不通过的影响。
- VETO、redaction、dependency、evidence integrity 和 P0 profile 缺陷如何阻断。
- 修复后必须复跑哪些 suite/check,以及关闭证据必须包含什么。

本 Step 不绑定具体缺陷系统,不填写真实缺陷状态,不宣告当前缺陷为 0。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05-测试方案.md` §11 | 已完成 | 提供 S/A/B/R 分级、复验矩阵和关闭证据 |
| `05-测试方案.md` §12 | 已完成 | 提供测试进入 / 退出准则和暂停 / 阻断准则 |
| `05-测试方案.md` §14 | 已完成 | 提供回归触发、残余风险和不可风险接受项 |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 evidence/report 缺陷影响 |
| `06_acceptance_step_11_veto.md` | 已完成 | 提供 VETO 不可风险接受规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B 缺陷如何定义? | S 为 VETO、P0 truth 破坏、安全/证据/依赖红线;A 为 P0 用例或 blocking suite 失败但未命中 VETO;B 为非 P0、报告可读性或 P1/P2 selected-run 问题;R 为范围外/future residual。 |
| 每级缺陷对验收结论有什么影响? | S 未关闭时只能不通过;A 未关闭且未被批准接受时不得通过;B/R 可在有记录和接受人时不阻断 P0,但可能影响有条件通过。 |
| 修复后如何复验? | 按触发面复跑原 TC、同 family 代表项、相关 suite、redaction/dependency/report audit 和 release smoke。 |
| 哪些缺陷可以风险接受? | B/R 可接受;A 仅在不影响 P0 truth 且有替代 artifact 时可临时接受;S/VETO 不可接受。 |
| 哪些缺陷必须阻断下一阶段? | 任一 S、任一 VETO、redaction/dependency/report audit failed、P0 profile unavailable but marked passed、evidence index 伪造、query/job 反写真相。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 缺陷分级只有 S/A/B,未绑定 VETO、EV、复验 suite | 重建为 S/A/B/R + 复验矩阵 + 放行规则 |
| Step 11 | VETO 已固定但缺陷规则未承接 | 本 Step 明确 VETO = S,不可风险接受 |
| Step 10 | evidence 缺陷影响尚未进入缺陷分级 | 本 Step 把 orphan EV/static evidence/report 缺失定义为 S |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 缺陷等级 | 泛化严重性 | S/A/B/R 与 VETO/P0/P1/P2 绑定 | 可裁决 |
| 复验 | 手工确认 | 原 TC + same family + suite/check/report evidence | 可复查 |
| 放行 | 视情况 | S/VETO 不可放行,A 需接受,B/R 可记录 | 防止风险接受越权 |
| evidence 缺陷 | 未单列 | 静态造证据、orphan EV、缺 artifact 为 S | 保护验收真实性 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| A 级是否可有条件通过 | A. 永不允许;B. 有严格条件允许 | 采用 B。仅在不命中 VETO/P0 truth 且有替代证据和接受人时允许 |
| B/R 是否必须阻断 | A. 阻断;B. 不阻断但记录 | 采用 B。B/R 不能伪装 P0 passed,但可进入 risk acceptance |
| evidence integrity 缺陷是否 S | A. 否;B. 是 | 采用 B。证据不真实时无法验收 |
| P1 selected-run unavailable 是否 A | A. 是;B. 通常为 B/R | 采用 B。除非该 release 已正式把 selected-run 升级为进入条件 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S | VETO 命中、P0 truth 破坏、安全/redaction、dependency、evidence integrity、query/job truth repair、P0 config silent fallback | 未关闭时只能“不通过”;不可风险接受 | 修复后跑原 TC、同 family、相关 blocking suite、redaction/dependency/report audit、必要时全量 P0 regression |
| A | P0 用例或 blocking suite 失败,但未命中 VETO;或证明能力不足但有可替代 raw artifact | 未关闭且未批准接受时不得“通过”;可导致“有条件通过”或暂停 | 修复后跑原 TC、相关 suite 和 report pairing;接受时必须有接受人和截止时间 |
| B | 非 P0、P1 selected-run unavailable、报告可读性、非阻断可维护性问题 | 不阻断 P0;可进入“有条件通过”风险清单 | 视影响复跑 selected suite 或补 report review |
| R | 范围外 / future capability / production-like / capacity / vendor behavior residual | 不阻断 P0;必须进入 Step 13 风险接受或后续跟踪 | 后续升级为 P0/P1 时重新基线和测试 |

### 8.2 S 级阻断判定表

| 触发 | 级别 | 必须处理 |
|---|---|---|
| VETO-GOV-001~013 任一命中 | S | 修复并复验;不得风险接受 |
| redaction check failed | S | 修复泄露面,复跑 `redaction-boundary` 和 release redaction check |
| dependency boundary failed | S | 移除越界依赖,复跑 dependency check |
| evidence index static pass / orphan EV / missing artifact | S | 修复 report generation,复跑 report-generation-audit |
| query / projection / job / handoff / export 反写 core truth | S | 修复 flow,复跑 service / operations / idempotency suite |
| accepted truth 缺 trace/audit/outbox/result | S | 修复 UoW,复跑 service-flow and release smoke |
| P0 profile unavailable but marked passed | S | 修复 config/runtime builder,复跑 config-redline |

### 8.3 修复后复验规则

| 缺陷触发面 | 必跑用例 / suite | 必跑 check | 关闭证据 |
|---|---|---|---|
| contracts / DTO / metadata | 原 TC + `contract-domain-fast` | report pairing | suite report + case artifact |
| domain / state / policy | 原 TC + same state family + `contract-domain-fast` | redaction if output changed | domain/state suite report |
| command / UoW / outbox / result | 原 TC + related command family + `service-flow-fast` | report pairing;redaction | UoW assertion artifact + suite report |
| query no-write / visibility | 原 TC + representative query family + `service-flow-fast` | write audit;redaction | write-audit and suite report |
| consumer / worker | 原 TC + duplicate/unsupported/delayed cases + `entry-worker-job` | redaction | worker suite report |
| outbox / publisher | original outbox TC + `operations-replay-core` | report pairing | publication report |
| operations job / handoff / export | original job TC + duplicate/no truth repair + `operations-replay-core` | redaction;report pairing | job report + marker artifact |
| config / runtime builder | original config TC + `config-redline` | report pairing | config validation report |
| redaction leak | leak fixture + `redaction-boundary` | `check_redaction.sh` | redaction-check.md |
| dependency boundary | dependency case + `dependency-boundary` | `check_dependency_boundary.sh` | dependency-boundary.md |
| evidence/report integrity | `report-generation-audit` | no static evidence + artifact pairing | report-audit.md |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release checks | release suite + gate summary |

### 8.4 放行规则

| 条件 | 是否可放行 | 说明 |
|---|---|---|
| 存在未关闭 S 级缺陷 | 否 | 只能不通过或暂停验收 |
| 存在 VETO 命中 | 否 | 不允许有条件通过 |
| 存在未关闭 A 级缺陷 | 通常否 | 仅当不影响 P0 truth、证据完整且有正式接受人时可有条件通过 |
| 仅存在 B/R residual | 可有条件通过 | 必须进入 risk acceptance |
| P1 selected-run unavailable | 可有条件通过或通过,视本次范围 | 不得计入 P0 passed |
| 性能 sample 高于候选旧目标 | 可记录风险 | 当前无硬阈值 |
| evidence/report 缺失 | 否 | 证据不可裁决 |

### 8.5 缺陷 / 复验停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 分级是否可判定 | 通过 | 与 `05` §11 一致 |
| VETO 是否不可降级 | 通过 | VETO = S,不可接受 |
| 复验 suite/check 是否固定 | 通过 | 见 §8.3 |
| 关闭证据是否固定 | 通过 | 必须有 run_id/artifact/report |
| B/R residual 是否进入风险接受 | 通过 | Step 13 继续收口 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_12_defects_retest_release.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“修复后复验规则”“放行规则”和“缺陷 / 复验停审记录”小节,了解缺陷如何影响验收结论、复验和放行。

正式 `06-验收标准.md` §12 应回填:

- 缺陷分级使用 S/A/B/R。
- S 级和 VETO 不允许风险接受;未关闭时最终结论不得为通过或有条件通过。
- A 级原则上阻断通过;只有在不影响 P0 truth、证据完整且有接受人时才可进入有条件通过。
- B/R 可进入风险接受,但不得伪装成 P0 已验证。
- 修复后必须复跑原 TC、相关 suite/check 和 report audit,关闭证据必须包含 run_id、artifact、report 和复验说明。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 具体缺陷系统字段 | 影响执行记录 | 不在 `06` 固定;只要求可回指 defect ref |
| A 级临时接受审批人 | 影响有条件通过 | Step 13 / 14 设定接受与签署角色 |
| P1 selected-run 是否升级为进入条件 | 影响 B/R 分类 | 当前不升级;若升级需重跑 Step 3/4/9/13 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷对结论的影响可判定 | 通过 | 见 §8.1 / §8.4 |
| 缺陷规则与一票否决项一致 | 通过 | VETO = S,不可接受 |
| 复验和关闭证据已固定 | 通过 | 见 §8.3 |
| 可进入 Step 13 | 通过 | 下一步定义风险接受与遗留项 |
