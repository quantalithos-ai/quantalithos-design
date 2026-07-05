# Step 13. 定义风险接受与遗留项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填章节: `06-验收标准.md` §13 风险接受与遗留项
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义风险接受与遗留项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 9 非功能残余;Step 10 证据门禁;Step 11 VETO;Step 12 缺陷放行;`05-测试方案.md` §14 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

定义有条件通过时允许保留哪些风险、哪些风险不能接受、风险接受必须具备哪些字段,以及遗留项如何进入后续计划。

本 Step 只回答:

- 哪些 P1/P2 / future / selected-run / sample / retention 风险可以作为 residual。
- 哪些 `VETO-ART-*`、S 级、P0 truth / boundary / security / evidence 红线不能风险接受。
- `reports/acceptance/risk-acceptance.md` 必须包含哪些字段和证据。
- 风险接受如何影响通过 / 有条件通过 / 不通过。
- 风险接受如何同步到后续 `07-实施计划.md`、`09-部署与运维手册.md`、issue 或 ADR。

本 Step 不填写真实接受人姓名,不宣告任何当前风险已被接受,不替代 Step 14 最终签署。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供性能 sample、P1/P2 非功能 residual、production-like / capacity / retention 风险 |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 `reports/acceptance/risk-acceptance.md`、evidence refs 和 no static evidence 约束 |
| `06_acceptance_step_11_veto.md` | 已完成 | 提供 `VETO-ART-001~009` 不可风险接受规则 |
| `06_acceptance_step_12_defects_retest_release.md` | 已完成 | 提供 S/A/B/R 缺陷与放行规则 |
| `05-测试方案.md` §14 | 已完成 | 提供 residual risk 表、不可风险接受项和全量 P0 regression 触发条件 |
| `04-配置设计.md` §12 / §14 | 已完成 | 提供 downstream handoff、profile、operations / future 配置风险 |
| `projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md` | 已读取 | 仅作为结构和粒度参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可以支持有条件通过? | P1 real-like selected-run unavailable、真实 upstream / downstream 产品未锁定、staging-like / production-like 未执行、capacity / hard SLO 未覆盖、跨仓完整 E2E 未覆盖、长期 evidence retention 天数未固定、高级 dashboard / analytics 未覆盖,均可在不影响 P0 truth 和证据完整时进入 residual。 |
| 哪些风险不能接受? | `VETO-ART-001~009`、S 级缺陷、`VF-ART-001~004` 命中、query no-write 失败、public job / relay truth repair、redaction leak、dependency boundary failed、evidence integrity failure、P0 config silent fallback、P0 profile unavailable but marked passed 均不能接受。 |
| A 级缺陷能否风险接受? | 只能逐项接受,且必须证明不影响 P0 truth、不命中 VETO/S、证据完整、有接受人、截止时间和补验计划;不得批量接受。 |
| B/R 缺陷如何进入风险接受? | 必须写入 risk_id、impact、acceptance_reason、evidence_refs、owner、acceptor、deadline_or_trigger 和 follow_up_ref;缺字段时不能支撑有条件通过。 |
| P1/P2 unavailable 能否计入 P0 passed? | 不能。它只能作为 residual,不能补足 `EV-CAND-ART-*`、P0 suite 或 VETO checklist。 |
| 风险是否需要同步到后续文档或问题记录? | 需要。影响实现、测试、运维、产品绑定或后续 release 的 residual 必须进入实施计划、运维手册、issue 或 ADR,不能只留在 `06`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 风险接受只有泛化遗留项,缺 P0/P1/P2 边界、接受字段和不可接受清单 | 重建 risk acceptance 结构和不可接受边界 |
| Step 9 | P1/P2 residual 已识别,但缺接受人、截止和后续动作结构 | 本 Step 固定 residual 表与文件字段 |
| Step 10 | `risk-acceptance.md` 已作为证据材料,但未定义字段完整性 | 本 Step 固定 risk acceptance 文件要求 |
| Step 11 | VETO 已定义不可接受,但风险接受清单尚未承接 | 本 Step 明确 VETO/S 不得被 risk acceptance 覆盖 |
| Step 12 | B/R 可进入风险接受,A 级可严格接受 | 本 Step 补接受人、证据、后续动作和截止条件 |
| `05-测试方案.md` §14 | residual 风险已列出,但验收层尚未转成最终裁决口径 | 本 Step 把测试 residual 升级为验收风险接受前置 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 风险表 | 只列风险和缓解方式 | 增加 risk_id、scope、impact、acceptance_reason、evidence_refs、owner、acceptor、deadline_or_trigger、follow_up_ref | 支撑有条件通过 |
| 不可接受项 | 分散在缺陷 / VETO / 非功能门禁 | 独立列为不可风险接受项 | 防止越权放行 |
| P1/P2 unavailable | 容易被误当 P0 通过 | 只能 residual,不得计入 P0 passed | 防止污染 P0 evidence |
| A 级接受 | 容易批量接受 | 逐项严格接受,且不得触碰 P0 truth / VETO / evidence | 防止风险接受覆盖阻断缺陷 |
| 后续同步 | 未固定 | 必须同步实施计划、运维、issue 或 ADR | 确保遗留项闭环 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 无接受人风险能否支持有条件通过 | A. 可以;B. 不可以 | 采用 B。缺接受人时不能证明风险被正式承接。 |
| P1 selected-run unavailable 是否阻断 P0 | A. 阻断;B. 不阻断但 residual | 采用 B。除非 Step 3 / Step 4 把它升级为本轮进入条件。 |
| hard performance threshold 未定义是否阻断 | A. 阻断;B. 记录 residual | 采用 B。当前只要求 sample/trend,不发明无来源阈值。 |
| A 级缺陷是否可风险接受 | A. 一律可;B. 严格限制 | 采用 B。必须逐项证明不影响 P0 truth、VETO 和 evidence integrity。 |
| formal EV / AC alias 是否在 Step 13 固定 | A. 固定;B. 不固定 | 采用 B。当前只约束 `EV-CAND-ART-*` 追溯,正式装配留到 Step 15。 |

## 8. 结构化中间产物

### 8.1 可接受 Residual 风险表

| Risk ID | 风险 / 遗留项 | 范围 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止 / 触发条件 |
|---|---|---|---|---|---|---|---|---|
| RISK-ART-001 | `p1-real-like-selected-run` 不进入当前 P0 主链 | P1 | 不能证明真实 adapter 端到端行为 | P0 已由 fake / controlled / replay seam 证明;真实 provider 未锁定 | 产品 / 环境可用后执行 selected-run,结果进入下一轮验收 | 测试负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ART-002 | 真实 upstream seam 行为未覆盖 | P1 / product binding | 不能证明 work/process/governance/method/runtime/external-content 真实产品消息演化 | 当前 P0 只验证 formal seam contract 和 Artifact side ownership | 产品绑定后补 upstream selected-run / E2E seam tests | 架构负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ART-003 | 真实 archive / observability / sync target 未覆盖 | P1 / operations | 不能证明真实 handoff target 集成表现 | 当前 P0 验证 handoff marker / report / no ownership transfer | downstream target 确认后补 handoff integration tests | 运维负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ART-004 | `staging-like` / `production-like` 未执行 | P1 / P2 | 不能证明真实部署拓扑行为 | 当前 P0 profiles 仅为 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 建立 staging / production-like profile 后补验收 | 运维负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ART-005 | production-like capacity / hard P95 / SLA 未覆盖 | P2 / performance | 不能按 numeric threshold 裁决 pass/fail | 当前无正式容量模型和阈值来源,只要求 duration/count sample | 基于 sample 建立负载模型和阈值后重审 `05/06` | 测试负责人待填 | 产品负责人待填 | `<date-or-trigger>` |
| RISK-ART-006 | 跨仓完整 E2E 协同未覆盖 | P1 / product E2E | 不能证明多仓联调体验 | 当前 P0 只验证 Artifact side seam contract 和消费边界 | 独立建立跨仓 E2E 方案并回写验收范围 | 产品负责人待填 | 架构负责人待填 | `<date-or-trigger>` |
| RISK-ART-007 | 长期 evidence retention 天数未固定 | operations / compliance | 不能证明长期审计保留策略 | 当前只要求验收和复验关闭周期内可追溯 | 在运维标准中定义保留期、介质、清理和恢复规则 | 运维负责人待填 | 合规负责人待填 | `<date-or-trigger>` |
| RISK-ART-008 | 高级 dashboard / analytics / derived UX 未覆盖 | P2 / UX | 不能证明复杂浏览和分析体验 | 当前 P0 只验 formal read surface、report 和基础 query | 产品需求明确后补 UI / analytics 验收 | 产品负责人待填 | 验收负责人待填 | `<date-or-trigger>` |

### 8.2 严格受限的 A 级接受条件

| 条件 | 必须满足 | 不满足时裁决 |
|---|---|---|
| 不命中 `VETO-ART-*` | 每个 VETO 均有 evidence / defect 证明未触发 | 不得接受 |
| 不影响 P0 truth | 不改变 fact / version / lineage / baseline / consumable truth 和 ownership | 不得接受 |
| 不影响 evidence integrity | raw artifact、suite report、evidence index、report audit 完整 | 不得接受 |
| 已有替代证明 | 相关 `EV-CAND-ART-*` 或 report 足以证明 P0 门禁可裁决 | 不得接受 |
| 接受字段完整 | owner、acceptor、deadline_or_trigger、follow_up_ref 均存在 | 不得作为有条件通过依据 |
| 后续动作可验证 | 有明确补验 suite/check 或设计/实施文档动作 | 不得接受 |

### 8.3 不可风险接受项

| 项 | 来源 | 原因 |
|---|---|---|
| `VETO-ART-001~009` 任一命中 | Step 11 | 一票否决不得被接受覆盖 |
| S 级缺陷 | Step 12 | 破坏 P0 truth、安全、证据或架构红线 |
| `VF-ART-001~004` 命中 | `00` §14.6;Step 11 | 核心验收方向不成立 |
| query no-write 失败 | Step 8 / Step 12 | 破坏只读消费与 truth ownership |
| public job / `PublishPendingArtifactRelays` truth repair | Step 7 / Step 8 / Step 12 | 维护面 / relay facade 不能修复核心真相 |
| redaction leak | Step 9 / Step 10 | 外部正文、secret、full sensitive ref 泄露不可接受 |
| dependency boundary failed | Step 6 / Step 9 | non-core sibling compile dependency 破坏架构裁剪 |
| evidence index 静态造证据 / orphan EV / missing raw artifact | Step 10 / Step 12 | 验收裁决不成立 |
| P0 config silent fallback、partial facade、forbidden override | Step 9 / Step 12 | 运行基线不可信 |
| P0 profile unavailable but marked passed | Step 10 / Step 12 | P0 evidence 被伪造 |
| accepted truth 缺 trace / audit / outbox / stored result | Step 8 / Step 9 | 核心追溯、发布和幂等链断裂 |

### 8.4 风险接受文件要求

| 字段 | 必填 | 说明 |
|---|---|---|
| `risk_id` | 是 | 稳定 ID,不得只写自由文本 |
| `scope` | 是 | `B-defect` / `R-residual` / `P1` / `P2` / `future` / `operations` |
| `impact` | 是 | 对本轮验收、下一阶段、运维或生产的影响 |
| `acceptance_reason` | 是 | 为什么不阻断 P0,且为什么不属于 VETO/S |
| `evidence_refs` | 是 | 支撑其为 residual 而非 VETO 的 `EV-CAND-ART-*`、report path 或 defect ref |
| `owner` | 是 | 后续动作责任人 |
| `acceptor` | 是 | 风险接受人;缺失则不得有条件通过 |
| `deadline_or_trigger` | 是 | 截止日期或触发条件 |
| `follow_up_ref` | 是 | issue / `07-实施计划.md` / `09-部署与运维手册.md` / ADR ref |
| `p0_contamination_check` | 是 | 明确说明不得计入 P0 passed evidence |

### 8.5 风险到后续文档同步矩阵

| 风险类型 | 后续承接位置 | 同步要求 |
|---|---|---|
| implementation / tests follow-up | `07-实施计划.md` 或 issue | 明确 boundary、负责人、补验 suite |
| operations / profile / retention | `09-部署与运维手册.md` | 明确 profile、runbook、retention、rollback / restore |
| product binding / real provider | 产品验收补充或 ADR | 明确真实产品、adapter、selected-run 条件 |
| performance / capacity | 性能基线方案 | 明确负载模型、阈值来源、执行环境 |
| cross-repo E2E | 独立 E2E 测试方案 | 明确多仓边界、truth owner 和 no-write 验证 |
| formal acceptance alias | Step 15 正式 `06` 装配 | 不作为 release residual;必须在正式装配中闭口 |

### 8.6 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 可接受 residual 是否与 P1/P2/future/operations 匹配 | 通过 | 不影响 P0 truth 和证据完整性 |
| 不可接受项是否覆盖 VETO/S/P0 红线 | 通过 | 全部禁止风险接受 |
| 是否要求接受人 | 通过 | 缺接受人不得有条件通过 |
| 是否要求后续动作和截止 | 通过 | owner、deadline_or_trigger、follow_up_ref 必填 |
| P1/P2 是否污染 P0 | 未污染 | `p0_contamination_check` 必填 |
| 风险接受是否覆盖 VETO | 未发现 | Step 14 继续约束最终结论 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“可接受 Residual 风险表”“严格受限的 A 级接受条件”“不可风险接受项”“风险接受文件要求”“风险到后续文档同步矩阵”和“风险接受停审记录”小节,了解有条件通过所需的 residual 结构和不可接受边界。

正式 `06-验收标准.md` §13 应回填:

- 风险接受只适用于 B/R residual、P1/P2 selected-run unavailable、future capability、operations retention、无硬阈值 sample/trend 或严格受限且不触碰 P0 truth 的 A 级缺陷。
- `VETO-ART-001~009`、S 级缺陷、`VF-ART-001~004`、redaction leak、dependency boundary failed、evidence integrity failure、query / job / relay truth repair、P0 config silent fallback、P0 profile unavailable but passed 不得风险接受。
- `reports/acceptance/risk-acceptance.md` 必须包含 `risk_id`、`scope`、`impact`、`acceptance_reason`、`evidence_refs`、`owner`、`acceptor`、`deadline_or_trigger`、`follow_up_ref` 和 `p0_contamination_check`。
- 缺接受人、缺后续动作、缺截止 / 触发条件、缺 evidence refs 或无法证明不属于 VETO/S 的风险,不能作为有条件通过依据。
- P1/P2 unavailable 和 residual 不得计入 P0 passed evidence,不得补足 `EV-CAND-ART-*` 或 VETO checklist。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实接受人名单 | 影响有条件通过 | 正式验收时填写;本文只固定角色和必填字段 |
| evidence retention 具体天数 | 影响合规 / 运维 | 当前作为 operations residual;后续进入运维标准 |
| 哪些 A 级缺陷可接受 | 影响放行 | 必须逐项审查,不得批量接受 |
| `p1-real-like-selected-run` 是否在某 release 升级为进入条件 | 影响风险分类 | 当前不升级;若升级需重审 Step 3/4/9/13 |
| formal EV / AC alias 是否引入 | 影响正式 `06` 装配 | Step 15 决定;不得破坏 `EV-CAND-ART-*` 可逆追溯 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有 residual 风险都有处理口径 | 通过 | 见 §8.1 |
| 不可风险接受项已明确 | 通过 | 见 §8.3 |
| 风险接受结构完整 | 通过 | 见 §8.4 |
| 后续同步口径明确 | 通过 | 见 §8.5 |
| 可进入 Step 14 | 通过 | 下一步定义最终结论与签署口径;进入前等待用户审查 |
