# L2-member-images 05 测试方案 Step 7：测试数据设计

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填位置：正式 `05-测试方案.md` 第 7 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 设计可重复、可隔离、可清理的测试数据，并严格区分 template/static seed/build input、local truth、projection 与 live state。 |
| 本步输入 | Step 6 用例；03 对象/字段/状态/UoW/idempotency；04 严格 JSON/profile/redaction；上游 ref owner 边界。 |
| 本步输出 | 数据集、构造器、隔离键、清理方式、外部 fake 选择和敏感数据规则。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. 数据构造原则

- fixture 只使用 typed ref、正式 enum、safe reason 和 deterministic clock/id provider；不写真实 secret、外部正文、live memory/checkpoint/workspace 或真实 digest。
- 每组数据带测试命名空间和显式隔离键；不使用共享 `latest`、全局 raw key 或隐式 singleton。
- static seed 只能验证 placement/ref/版本边界；不能把 seed 当成 runtime live state。
- fake 仅限 `ci-test`，必须与正式错误/状态保持 parity，不能返回 `Passed`、`Accepted`、consumer confirmation 或 readiness。

## 2. 数据集矩阵

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-BASE-VALID` | definition、baseline、revision 合法样本 | typed ref builder + deterministic clock | `namespace + local_object_ref` | UoW rollback/隔离 namespace | `TC-CMD-001~003` |
| `DS-BASE-MISSING` | 缺 mapping/component/seed/base | 显式 `None`/missing field，不填默认 | `namespace + case_id` | 删除 fixture namespace | `TC-CMD-002` |
| `DS-STATIC-LIVE-MIXED` | body/live state 越界 | static seed 与 fake live marker 故意混入 | `namespace + subject_ref` | 丢弃整组；不得修复后复用 | `TC-CMD-005`,`TC-SEC-002` |
| `DS-BUILD-STAGES` | intent/snapshot/attempt/candidate 状态 | 正式 state matrix factory | `namespace + revision_ref` | append-only test store reset | `TC-CMD-004~005`,`TC-JOB-001~002` |
| `DS-QUAL-GAP` | provenance/gate/eligibility/Artifact gap | owner unavailable/unknown marker | `namespace + candidate_ref` | 隔离 namespace truncate | `TC-CMD-006~007`,`TC-JOB-003` |
| `DS-SUPPLY-HISTORY` | entry/availability/consumer gap | append transition records | `namespace + entry_ref` | 新 namespace；不删除历史断言样本 | `TC-CMD-008~010`,`TC-QUERY-005~007` |
| `DS-PROJECTION-MARKER` | Fresh/Stale/Rebuilding/Unavailable | existing marker fixture | `namespace + projection_key` | marker store reset | `TC-QUERY-002`,`TC-QUERY-010`,`TC-JOB-005` |
| `DS-REPLAY-CONFLICT` | same/different canonical input | deterministic canonical input pairs | `namespace + channel/key` | idempotency store reset | `TC-CON-001~002` |
| `DS-CONCURRENCY` | race/version/commit unknown | two isolated writers + fault injector | `namespace + subject/version` | rollback/clear reservations | `TC-CON-003~005` |
| `DS-CONFIG-STRICT` | JSON unknown/duplicate/sensitive/profile | hand-authored minimal JSON fixtures | `namespace + profile` | fixture file removal by test harness | `TC-CONFIG-001~005` |
| `DS-REDACTION` | raw body/secret leakage | sentinel strings marked forbidden | `namespace + evidence_id` | secure discard; never report raw sentinel | `TC-SEC-001`,`TC-QUERY-008` |

## 3. 外部协作数据

| 依赖 | 当前测试替身 | 允许观察 | 禁止断言 |
|---|---|---|---|
| `L3-method-library` | body-free ref/gap fake | ref shape、unavailable、conflict | Role/method body 或 authority success |
| `L2-runtime`/`L2-tools`/`L2-member` | controlled ref adapter | pin compatibility marker | loop、tool execution、member release |
| `L1-artifact` | handoff gap/opaque ref fake | local handoff disposition | Artifact version/lineage/acceptance |
| `L2-member-service` | consumer gap fake | pinned entry selector、unavailable | manifest/variant confirmation、launch/health |
| event source | marker-only fake | unavailable/rejected/reopen | envelope、event id、ACK、dedup、accepted input |

## 4. 改动前后、取舍与回填草稿

旧材料把 seed/persona/toolset 当作可直接复用的成功 fixture；本轮每类数据都有 owner、状态、隔离和禁止断言。正式 §7 回填矩阵，并要求未来测试运行对每个 fixture 记录来源和脱敏状态；不产生真实结果。

## 5. 待确认事项与进入下一步条件

真实 Artifact evidence kind、consumer manifest schema、并发故障注入能力和性能数据规模待 owner/实施阶段确认。进入 Step 8 的条件是 P0 用例均有 deterministic 数据、隔离键、清理动作和 fake/real-like 边界。
