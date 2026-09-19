# Step 3. 固定验收基线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3  
> 回填章节：`06-验收标准.md` §3 验收基线

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 1～2；正式 04 §5～§9；正式 05 §7～§13 |
| 输出文件 | `design-calibration/06_acceptance_step_03_baseline.md` |
| 实际送验状态 | `not_entered / blocked_by_missing_baseline` |
| 下一动作 | 只允许进入 Step 4 |

## 2. 本步计划与目标

本步将“未来必须固定的完整基线”与“当前确实存在的文档基线”分开登记，定义 baseline manifest、证据入口、profile/config/facet 规则、变更失效规则和禁止引用。任何 `<...>` 仅是字段合同，不是占位即事实。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| Step 2 范围 | 决定 P0 与 enabled conditional facets |
| 正式 00～05 | design baseline 候选与 future test/evidence contract |
| `04` §5～§9 | 单一严格 JSON、三 profile、四配置和 startup lifecycle |
| `05` §7～§9 | fixture、环境、suite/gate/check planned baseline |
| `05` §13 | fixed-run artifact/report/evidence schema 与路径 |
| 当前文件系统事实 | 目标实现仓、run、artifact/report/evidence 均不存在 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪版需求/设计验收？ | 未来必须以送验时固定的 design commit/source ref 绑定正式 `00`～`06`；当前只能确认工作树内正式 00～05 是 06 设计输入，不能虚构 commit。 |
| 按哪版测试方案/结果裁决？ | 设计依据正式 05；实际裁决必须绑定实现后同一 `<run_id>` 的真实结果。当前无结果。 |
| build/commit/image 是什么？ | 不存在/未固定；这是实际验收准入 blocker。 |
| 环境、配置、数据和依赖是什么？ | 未来记录执行环境、三个 profile 中一个、四项 strict config 及 digest、fixture/data ref、SDK/owner/host refs、enabled facet manifest；当前均未固定。 |
| 基线变更如何处理？ | 任何影响需求、设计、实现、配置、依赖、TC/suite、artifact/report/evidence schema 的变化都使旧裁决范围失效，必须新 run_id、影响分析和相应回归；不得覆盖旧 run。 |
| 固定 run_id 是什么？ | 当前不存在；正式送验不得使用 `latest`。 |
| artifact/report/acceptance 路径？ | 未来严格使用 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`；当前路径/文件未创建。 |
| 是否存在不合法引用？ | 旧 06 的 API/DB/[] 证据不合格；未来禁止 `latest`、项目重复层级、无 digest 或跨 run pairing。 |

## 5. 当前文档问题诊断

| 旧问题 | 新处理 |
|---|---|
| test/staging 泛化为环境基线 | 必须精确记录环境身份、profile、config digest 和依赖 refs |
| 未固定交付物仍准备签署 | lifecycle 保持 `not_entered` |
| evidence 用空 checklist 表示 | 必须由 fixed run 的真实 artifact/report pair 生成 |
| 无 enabled facet manifest | 加入 baseline manifest，决定 conditional positive 是否升级 required |
| 允许“最新报告”语义 | 显式禁止 `latest` 与移动别名 |

## 6. 改动前后对比

| 项 | 旧 | 新 | 理由 |
|---|---|---|---|
| design 基线 | 泛化当前文档 | fixed design source ref + 文档清单 | 可复验 |
| delivery 基线 | 未定义 | implementation commit/build/image digest 必填 | 固定送验物 |
| environment | test/staging | environment ref + profile + strict config digest | profile 不等环境/readiness |
| evidence | API/DB/空格 | run-scoped raw/report/EV/digest | 真实性 |
| optional facet | 隐式启用 | explicit enabled/disabled/blocked manifest | 决定 positive 门禁 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否把当前工作树 hash 当送验 design baseline | 否；用户未要求 commit，且交付尚不存在 |
| 是否创建示例 run_id / digest | 否；会伪造成执行事实 |
| 是否允许文档基线完成后进入实际验收 | 否；必须同时固定交付、环境、数据、依赖和证据 run |
| 是否允许多 run 拼接 P0 evidence | 默认否；同一裁决范围使用固定 run，正式复验另起 run 并显式关联 |
| 是否允许 blocked/unavailable 生成 positive EV | 否；状态可归档但不贡献 positive pass |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 必须固定的内容 | 当前状态 | 未固定影响 |
|---|---|---|---|
| 需求/设计 | 正式 00～06 的 design source ref/commit 与 digest/清单 | 00～05 文档存在；06 尚在设计；无 fixed ref | 阻断实际进入 |
| 测试方案 | 正式 05 source ref、TC/suite/check manifest | 文档存在；实现不存在 | 阻断执行/进入 |
| 交付 | implementation commit、build id、image/artifact digest（按适用） | `not_created/not_fixed` | 阻断进入 |
| 环境 | environment ref、host/browser/runner identity、dependency refs | `not_fixed` | 阻断进入 |
| 配置 | profile、完整 strict document、config digest、source ref | `not_fixed` | 阻断进入 |
| facet | 每个 owner/host/invalidation/diagnostic/browser/AT/quantitative facet 的 enabled posture 与 authority | `not_fixed` | positive 范围不可确定 |
| 数据 | fixture set/source ref、synthetic corpus、scheduler seed/manifest | `not_created/not_fixed` | 阻断相关 suite |
| 执行 | immutable `run_id`、suite manifest、timestamps/tool versions | `not_created` | 无 evidence 资格 |
| 缺陷/风险 | defect snapshot、open issues、risk acceptance version | `not_created` | 无最终裁决 |

### 8.2 Baseline manifest 最小字段

| 字段 | 要求 |
|---|---|
| `design_source_ref` | 绑定正式 00～06 的不可变 source ref |
| `implementation_source_ref` | 绑定目标实现 commit |
| `delivery_ref` | build/image/package 等实际送验标识；不适用须说明 |
| `run_id` | 显式、不可变、禁止 `latest` |
| `environment_ref` | 可定位执行环境，不以 profile 代替 |
| `runtime_profile` | 仅 `local-fake/integration-pending/production-pending` 之一 |
| `config_path/config_digest` | 同一已校验 strict whole document |
| `facet_manifest` | 各 facet 的 enabled/disabled/blocked 与 authority refs |
| `dependency_refs` | SDK/owner/host/runner 等版本或 binding authority |
| `data_refs` | fixture/corpus/schedule manifest |
| `suite_manifest` | P0、release、selected suites 和 blocking classification |
| `acceptance_review_version` | handoff/veto/risk/open-issues 同一审查版本 |

### 8.3 证据入口基线

| 证据入口 | 固定路径 | 必需标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/...` | run + suite + artifact digest | 机器原始复核 | 不存在 |
| run summary | `reports/runs/<run_id>/summary.md` | run + report digest | 执行总览 | 不存在 |
| gate results | `reports/runs/<run_id>/gate-results.md` | run + gate manifest | P0/release 门禁 | 不存在 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | EV→TC/suite/artifact/report/digest | P0 追溯 | 不存在 |
| redaction | `reports/runs/<run_id>/redaction-check.md` | 同一 run | forbidden material 检查 | 不存在 |
| pairing | `reports/runs/<run_id>/report-pairing.md` | 同一 run | orphan/run mismatch 检查 | 不存在 |
| handoff | `reports/acceptance/handoff.md` | review version | 送验范围和 baseline | 不存在 |
| VETO | `reports/acceptance/veto-checklist.md` | review version | 七项否决裁决 | 不存在 |
| risk | `reports/acceptance/risk-acceptance.md` | review version | 有条件通过依据 | 不存在 |
| open issues | `reports/acceptance/open-issues.md` | review version | blocker/residual | 不存在 |

### 8.4 Profile / 配置 / facet 基线

| 主题 | 固定规则 |
|---|---|
| profile | 名称只表示 posture；不得表示 integrated、staging-ready、production-ready |
| config | 恰好四项；profile required/no default，bindings default `[]`，两个 switch default `false`；startup-only |
| invalidation | 当前默认 disabled；若 baseline enabled，exact envelope/order/dedup/scope 与 positive evidence 必需 |
| diagnostics | disabled 合法；enabled 后 approved body-free sink/envelope 与 isolation evidence 必需 |
| owner facet | 未启用可 blocked/read-only/partial；enabled 后 exact contract/adapter/ref/safe-field evidence 必需 |
| browser/AT/quantitative | 只有 authority 与 baseline selection 同时存在才成为 release gate |

### 8.5 基线变更/失效规则

| 变更 | 处理 |
|---|---|
| P0 requirement/design/config/protocol/state/evidence schema | 旧 verdict 失效；重开相关设计/测试 Step，全量 P0，新 run |
| implementation/dependency/facet enabled set | 影响分析 + 受影响/全量 gate，新 run |
| 仅 review 解释且不改原始结果 | 新 review version；不得改 raw/report outcome |
| rerun/retest | 新 run_id，关联失败 run 与修复 ref；不得覆盖 |
| artifact/report digest 或 pairing 改变 | evidence 资格失效，重新生成/审查；禁止手改 pass |

### 8.6 不可接受的基线引用

- `latest`、移动 symlink/alias、仅“当前 main”或“最近成功”。
- `artifacts/test/<project>/<run_id>`、`reports/<project>/...` 或无 run 的正式执行报告。
- 跨 run 拼接却不声明关联，或 artifact/report/digest 不同 run。
- 静态 Markdown/JSON 声称 EV/VETO passed，而无 suite source。
- profile 名、配置 flag、toast、diagnostic receipt、测试计数或手工截图替代交付/owner/readiness 证据。

## 9. 回填草稿

正式 §3 应列出未来送验必须固定的 design/test/delivery/environment/config/facet/data/dependency/run/review 基线和固定路径，并明确当前所有执行基线缺失，因此生命周期是 `not_entered / blocked_by_missing_baseline`。缺基线不是“不通过” verdict，也绝不是通过；补齐后才可进入。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 实际 source refs、delivery ref、environment ref、run_id | 未创建，不填写 |
| facet enabled set | 送验 manifest 必填 |
| digest 算法、tool/runner version schema | 实现前固定，当前不猜 |
| retention 数字 | 运维/验收 authority 待定 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 完整未来基线字段可定位 | pass |
| 当前缺失项及影响明确 | pass |
| evidence 路径无 `latest`/重复项目层级 | pass |
| 未伪造 commit/run/digest | pass |
| 允许进入 Step 4 | yes |
| 实际进入验收 | no，`blocked_by_missing_baseline` |
| 允许修改正式 06 | no |
