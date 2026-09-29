# Step 3. 固定验收基线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3\
> 正式回填：`06-验收标准.md` §3\
> 日期：2026-09-13\
> 状态：`completed / baseline_contract_fixed_actual_values_absent / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 3：固定验收基线 |
| 目标 | 固定未来裁决必须绑定的文档、交付、契约、环境、配置、数据、run 与验收包字段和路径 |
| gate_status | `completed / baseline_contract_fixed_actual_values_absent` |
| gate_reason | 基线类型、身份字段、固定路径、变更规则和拒绝规则已可判定；实际 delivery/env/data/run/handoff 值仍为 0，只阻止送验，不阻止设计继续 |
| next_allowed_action | 按连续授权创建并完成 Step 4 |
| source_files | Step 1～2；正式 04 §6～14；正式 05 §7～9/12～14；验收标准规范 §4.4/5.3 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 3A | 文档/标准基线 | done | 00～06 与 standards revision 可定位 |
| 3B | 交付/契约基线 | done | implementation/Core/external seam 身份必填 |
| 3C | 环境/配置/数据基线 | done | profile、55-key identity、namespace/vector/cleanup 明确 |
| 3D | raw/report/acceptance 基线 | done | 单一 fixed run、固定路径、review identity 明确 |
| 3E | 变更与拒绝规则 | done | 无 `latest`、跨 run、静态证据或模糊环境 |

## 2. 本步输入与事实边界

本 Step 定义未来基线 schema，不填写伪造的实际值。正式 00～05 的文档路径、版本和停审状态是当前设计输入；其 Git/design revision、目标实现 revision/build、运行环境、config identity、formal seam manifest、数据 vector、test run 和 acceptance review version 均待未来实际送验固定。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪版需求和设计验收？ | 按正式 00～06 的明确路径、文档版本与同一 immutable `design_revision`；06 装配后才进入集合。当前未提交，不能伪造 revision。 |
| 按哪版测试和结果裁决？ | 测试设计按正式 05；执行只接受一个 fixed `<run_id>` 的 102 TC raw、19 EV instance、13 suite/5 gate 结果及 checks，不接受 planned 表。 |
| 送验 build/commit/image 是什么？ | 当前不存在。未来必须固定目标实现 repository、immutable `source_revision`，以及适用的 build/image/artifact identity；无实现仓不能送验。 |
| 环境、配置、数据和依赖是什么？ | 必须固定 profile、environment/namespace、config identity、12 域/55 key 的 redacted resolution、26 DS/vector refs、Core contract identity、每个 formal target 的 conformance manifest 和 cleanup finality。 |
| 基线变更如何处理？ | 影响 P0 的 design/source/Core/config/data/seam/suite/schema/report 变化默认生成新 run，并按 05 §14 选择最小或全量回归；旧 raw 不改写。 |
| `run_id` 是什么？ | 当前不填。未来须符合 `ArchiveTestRunId` 且非 `latest`，并贯穿 context、case、suite、evidence index、run reports 和 acceptance handoff。 |
| 原始机器证据在哪里？ | `artifacts/test/<run_id>/...`，其 schema/digest/redaction 必须符合 05 §13。 |
| 人类报告在哪里？ | `reports/runs/<run_id>/...`；只能从同 run raw 只读生成。 |
| 验收交接在哪里？ | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`；必须有 review identity，不能默认 passed。 |
| 哪些引用不可接受？ | `latest`、跨 run 拼接、绝对本机路径、`artifacts/test/<project>/<run_id>`、`reports/<project>`、无 digest raw、手写/静态 EV、泛化 test/staging、fake 冒 formal。 |

## 4. Historical material 诊断与改动前后对比

| 项 | 旧正式 06 | 当前基线 | 理由 |
|---|---|---|---|
| 文档 | 仅 02/03/05“当前批次” | 00～06 + standards 的 immutable design revision | 完整需求—裁决链 |
| 交付 | 未定义 | repository/source revision/build/image identity | 可复验 |
| 环境 | test/staging + 假定 storage | exact profile/environment/namespace/target manifest | 不造 provider |
| 数据 | snapshot/index 样本 | exact `DS-AR-*`、formal conformance vector 与 cleanup proof | 对齐 05 |
| 证据 | API/DB/log/digest report | fixed-run raw→suite→EV→report→acceptance | 真实性闭环 |
| 变更 | 无规则 | new run + regression selection + immutable old raw | 防旧证据支撑新基线 |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 多 run 聚合 | 一个验收裁决绑定一个 primary fixed run；补验 run 显式列出并按 item 替换/复核 | 偷偷混用多个 run 最优结果 | 保持分母和失败历史 |
| 文档版本 | path+document version+immutable design revision | 只写文件名或日期 | 防内容漂移 |
| external seam | 每 target versioned manifest/vector/config identity | 写“staging 可用” | authority/finality 必须可核验 |
| risk 文件 | 无 residual 时也应存在或由 handoff 明确 empty；条件通过必须有完整实例 | 空模板当接受 | 防静态签署 |

## 6. 结构化中间产物

### 6.1 验收基线表

| 基线类型 | 基线内容 | 未来必须固定的标识 | 当前状态 / 用途 |
|---|---|---|---|
| 需求 | `00-需求文档.md` v1.0.0-calibrated | `design_revision` + document digest/ref | 内容可用；revision 待固定 |
| 架构 | `01-架构设计.md` v1.0.0-calibrated | 同一 design revision | owner/依赖/接缝 |
| 概要 | `02-概要设计.md` v1.0 full-restart | 同一 design revision | CP/对象/协议/状态轮廓 |
| 详细 | `03-详细设计.md` 0.1 full-restart | 同一 design revision | exact contract/flow/state/UoW |
| 配置 | `04-配置设计.md` v1.0.0-calibrated | design revision + config schema/version | 12 域/55 key |
| 测试 | `05-测试方案.md` v1.0.0-calibrated | design revision | 102 TC/19 EV/paths |
| 验收 | future formal `06-验收标准.md` | design revision | AC/VETO/三值规则；Step 15 前不纳入 |
| 标准 | 本轮六份适用 document standards | standards revision | 写作/证据/依赖规则 |
| 交付 | target implementation repo/build/image | repository + immutable source revision + build/image digest（若适用） | absent；必需 |
| compile contract | 经核验 `L0-core` symbol/package | package version/source revision/lock identity | absent；必需 |
| formal seams | owner/export/event/governance/integrity/storage/receiver/observability targets | target、owner、contract/schema version、capability/config identity、vector set | absent；逐 target 必需 |
| 环境 | selected profile + isolated namespace | environment ref/profile/config identity/cleanup ref | absent；必需 |
| 数据 | 26 logical DS + owner/provider vectors | exact DS refs/vector revisions/generator refs | absent；必需 |
| 测试运行 | fixed run | `run_id`、start/end、runner/gate revision | absent；必需 |
| 验收审查 | acceptance package | review version/reviewer identities/timestamps | absent；必需 |

### 6.2 Profile 与证明上限

| Profile | 用途 | 允许证明 | 不允许证明 |
|---|---|---|---|
| `local-dev` | local sanity | 局部 shape/logic | release/formal/readiness |
| `ci-test` | deterministic P0 local | contract/domain/service/fake negative | owner/provider finality |
| `integration-like` | controlled adapter/fault | mapping/order/error/local integration | 未有 formal manifest 的 authority/commit |
| `operations-replay` | replay/recovery | idempotency/partial/probe 的受控行为 | 未有 durable/receiver seam 的生产恢复 |
| `staging-like` | formal real-seam | 仅 manifest 中具名 target 的 formal proof | 未测 target/global success |
| `production-like` | future selected boundary | 只按正式 workload/runbook 范围 | 当前 readiness |

### 6.3 证据入口基线

| 入口 | 固定路径 | 必须绑定 | 缺失影响 |
|---|---|---|---|
| Run context | `artifacts/test/<run_id>/meta/context.json` | source/design/config/suite/time/digest | 不可裁决 |
| Raw evidence index | `artifacts/test/<run_id>/evidence-index.json` | 19 EV、suite/case refs、blocker/redaction/digest | 不通过证据门禁 |
| Case/suite raw | `artifacts/test/<run_id>/suites/<suite>/...` | 102 exact TC、assertions、status、DS、digest | 对应 AC 不可通过 |
| Human run summary | `reports/runs/<run_id>/summary.md` | 同 run aggregate/limitations | 交接不完整 |
| Human EV index | `reports/runs/<run_id>/evidence-index.md` | EV→TC→raw→AC/VETO | 证据门禁失败 |
| Gate results | `reports/runs/<run_id>/gate-results.md` | 5 gates + required checks | release 裁决失败 |
| Redaction | `reports/runs/<run_id>/redaction-check.md` | raw/report scan scope/result | 失败触发 VETO |
| Dependency | `reports/runs/<run_id>/dependency-boundary.md` | actual graph/classification | 失败触发 VETO |
| Report audit | `reports/runs/<run_id>/report-audit.md` | pairing/digest/no-static/orphan | 失败触发 VETO |
| Blocked lanes | `reports/runs/<run_id>/blocked-lanes.md` | required blocked/not_run denominator | 任一 P0 blocked 不得通过 |
| Acceptance package | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | primary/supplemental runs、review、结论输入 | 不得签署 |

### 6.4 基线变更规则

| 变化 | 最低动作 | 旧证据姿态 |
|---|---|---|
| F/BR/NFR、owner/authority、protocol/state/UoW/config requiredness、AC/VETO | 重开 owning Step，更新 05/06，执行受影响+全量触发规则 | 不再支撑新裁决 |
| implementation/Core/external contract revision | 新 run；contract/dependency + affected suites，必要时全量 | 只作历史 |
| config identity/profile/target/vector/data generator | 新 run；config/authority/affected suites | 不可跨 identity 拼接 |
| TC/suite/gate/check/EV schema 或 report generator | 新 run 或完整重生成并证明 raw 不变；默认新 run | 不得手写修补 |
| 仅 human explanation | 可新 review version；不得改 raw status/digest | raw 仍 immutable |

### 6.5 基线拒绝清单

- `latest`、mutable branch-only ref、dirty/unidentified source、无 immutable design/source revision。
- 绝对路径、错误目录层级、跨 run case/suite/EV 拼接或覆盖旧失败 raw。
- fake/local ACK/log/config `Ready` 冒正式 authority、durability、signature、receiver commit。
- 空/静态 JSON、Markdown checklist、手工 passed、无 raw digest 的 report。
- 未固定 owner/provider/target/contract version/namespace/cleanup 的“staging”。

## 7. 复杂度判断

基线包含 14 类输入和 11 个固定证据入口，单文件可闭合。实际 schema 已由 05 §13 定义，06 只裁决其存在性与一致性，不复制全部 DTO 字段。

## 8. 回填草稿

正式 §3 应保留基线表、profile 证明上限、证据入口、变更和拒绝规则；所有 actual 标识均写为未来必填/当前 absent，不填假 commit、run、digest 或环境。正式送验以一个 primary fixed run 为主，补验 run 必须显式列出，不得跨 run 挑选通过结果。

## 9. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 04/05 回写 | 无；profile、路径和 schema 与正式输入一致 |
| 新 blocker | 无 |
| 当前送验缺口 | delivery/Core/formal seams/env/config/data/run/acceptance review 全 absent |
| 持续 blocker | 18 项继续决定 formal target 是否可进入 |

## 10. 进入 Step 4 条件

- [x] 文档、交付、环境、配置、数据、契约、run 和验收包基线可定位。
- [x] fixed path 与 same-run 规则闭合。
- [x] 变更触发和拒绝清单明确。
- [x] 未使用 `latest` 或伪造实际值。
- [x] 当前缺口只允许 `not_entered/blocked`，不产生 verdict。

当前 `gate_status`：`completed / baseline_contract_fixed_actual_values_absent`。

`next_allowed_action`：按连续授权创建并完成 Step 4。
