# Step 3. 固定验收基线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节：`06-验收标准.md` §3 验收基线
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 3 |
| current_module | `acceptance_baseline_manifest_and_evidence_roots` |
| gate_status | `pass_for_step_04` |
| actual_acceptance | `not_entered / blocked_by_missing_baseline` |
| baseline_instance | `none` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 4 |

## 2. 本步目标与输入

本步把“验收规则设计所依据的当前文档输入”与“未来一次实际送验必须冻结的不可变 baseline instance”分开登记。`<run_id>` 等符号是字段合同，不是当前占位事实；没有真实值时只能记录缺失和阻断影响。

| 输入 | 用途 |
|---|---|
| Step 1～2 | 输入 authority、P0/conditional/future 范围 |
| 正式 04 §5～§12 | strict source、四 profile、41 项、builder/readiness、failure/rollback |
| 正式 05 §7～§9 | data/environment/profile/suite/gate 合同 |
| 正式 05 §12～§14 | T0～T4、fixed-run evidence、report/check、residual/变更失效 |
| 当前文件系统事实 | 实现仓、delivery、run、artifact/report/evidence 均不存在 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪版需求和设计验收？ | 实际送验必须用 immutable `design_source_ref`/digest 固定正式 00～06 的一致集合；当前工作树文档只是本 06 的设计输入，不能伪造 commit/baseline。 |
| 按哪版测试方案和结果裁决？ | 固定正式 05 source ref 与同一 fixed `run_id` 的真实 execution manifest、artifact、report、checks；当前无执行结果。 |
| build/commit/image 是什么？ | 不存在/未固定，是实际准入 blocker。 |
| 环境、配置、数据、依赖是什么？ | 未来逐项固定 environment/host/platform、一个正式 profile、完整 strict config/digest、fixture/data/canary、SDK/owner/tool refs；当前未固定。 |
| 基线变更如何处理？ | P0 设计/协议/state/config/evidence schema 或 implementation/delivery 变化使相关或全部 verdict 失效，必须新 run；不得改写旧 raw/report。 |
| fixed run 是什么？ | 当前不存在。实际 run ID 必须显式 immutable，禁止 `latest`。 |
| artifact/report/handoff 在哪里？ | 路径合同固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/`；当前目录和文件均不得被声称存在。 |
| 有无非法路径/移动别名？ | 正式基线禁止 `latest`、项目重复层级、跨 run 隐式拼接、无 source pair 的静态 Markdown/JSON。 |

## 4. 问题诊断、前后对比与取舍

| 旧口径 / 风险 | 新口径 | 取舍 |
|---|---|---|
| “当前文档批次”作为版本基线 | immutable design + implementation + delivery refs/digests | 可定位、可重验 |
| “test/staging 环境”泛称 | environment/platform/dependency/config/data manifest 逐项固定 | 名称不等可复现基线 |
| API/DB/compare report 泛证据 | 同 run artifact/report/check/digest 与 runtime EV | 防静态造证据 |
| profile 名被当 readiness | profile 仅是 config posture；slot enabled/authority/ready 单独登记 | 避免 `product-pending` 假放行 |
| 修改报告或覆盖重跑 | 新 run + predecessor/supersedes；旧状态/digest 不变 | 保留首失败与审计链 |

## 5. 结构化中间产物

### 5.1 验收基线表

| 基线类型 | 未来必须固定的内容 | 当前状态 | 未固定影响 |
|---|---|---|---|
| design | 正式 00～06 文件清单、immutable source ref/digest | 文档存在；无 immutable delivery ref | 阻断实际进入 |
| test contract | 正式 05 ref、108 TC、12 suite、18 slot/check manifest | 文档存在；runner/suite 未实现 | 阻断执行/进入 |
| implementation | 目标实现 source/commit ref、manifest、语言/runtime/test runner | `not_created / not_fixed` | 阻断进入 |
| delivery | build/image/package/installer ref 与 digest（按适用） | `not_created / not_fixed` | 阻断进入 |
| environment/platform | environment、host/OS/platform、runner/tool、resource policy refs | `not_fixed` | 阻断 T2～T4 |
| dependency | L0-sdk 与启用的 owner/public adapter version/authority refs | `not_fixed`；`RUN-UP-*` open | positive required set 不可证明 |
| config | `runner-config/v1` whole document、source ref/digest、四 profile之一 | design only；artifact absent | 阻断 T1+ |
| slot/facet | 每个 upstream/platform/diagnostic/archive/consumer slot 的 enabled/disabled/blocked 与 authority | `not_fixed` | positive gate 不可判定 |
| data | dataset/fixture/canary/fault/scheduler seed refs+digests | `not_created / not_fixed` | 阻断相关 suite |
| execution | immutable `run_id`、time/tool versions、suite/gate/check manifest | `not_created` | 无 runtime evidence 资格 |
| review | defect snapshot、handoff/VETO/risk/open-issues review version | `not_created` | 无 decision_pending/decided |

### 5.2 Baseline manifest 最小字段

| 字段 | 要求 |
|---|---|
| `design_source_ref` / `implementation_source_ref` | 分别绑定设计集合与实现源码的不可变 ref；禁止以工作目录“当前”替代 |
| `delivery_ref` / `delivery_digest` | 固定 build/image/package/installer；不适用项说明理由 |
| `acceptance_target_tier` | 仅 `T1-SEMANTIC-P0`、`T2-CONTROLLED-INTEGRATION`、`T3-PRODUCT-REHEARSAL`、`T4-RELEASE/ACCEPTANCE` 之一；verdict 只对该 tier 有效 |
| `run_id` | 显式 immutable；禁止 `latest`、wall-clock/PID/端口/目录最新值作为语义 identity |
| `environment_ref` / `platform_ref` / `dependency_refs` | 可定位 host、SDK、owner public contract、runner/tool 版本与 authority |
| `runtime_profile` | 仅 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending` 之一；名称不等 readiness |
| `config_source_ref` / `config_digest` | 同一份已 strict validate 的 whole document；不得 leaf override/hot patch/LKG |
| `slot_manifest` | 每个 slot 的 posture、required level、public contract/version/authority；enabled 后 positive evidence required |
| `data_refs` | `DS-RUN-*` 实例、fixture/fault/canary/seed manifest 与 digest；不得真实敏感正文 |
| `suite_manifest` | 12 suite 与适用 gate/check 的 planned/executed/not-run 分母、blocking classification |
| `acceptance_review_version` | handoff、VETO、risk、defect/open-issues 与 signoff 使用同一 review version |

### 5.3 固定证据入口

| 证据入口 | 固定路径 | 版本/标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| raw run | `artifacts/test/<run_id>/` | `<run_id>` | context、case、suite、check 原始记录 | 不存在 |
| run summary/gates | `reports/runs/<run_id>/summary.md`、`gate-results.md` | `<run_id>` | 分母、层级、gate 结果 | 不存在 |
| evidence index/detail | `reports/runs/<run_id>/evidence-index.md`、`evidence/<evidence_id>.md` | `<run_id>` + evidence digest | AC/VETO 逐项证据 | 不存在 |
| integrity checks | `redaction-check.md`、`dependency-boundary.md`、`evidence-link-check.md`、`report-pairing.md` | 同 `<run_id>` | redaction/boundary/link/pair 资格 | 不存在 |
| acceptance handoff | `reports/acceptance/handoff.md` | review version | 送验范围、baseline、未执行项、争议 | 不存在 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | review version | 所有 VETO 逐项结论 | 不存在 |
| risk/open issues | `reports/acceptance/risk-acceptance.md`、`open-issues.md` | review version | 条件通过资格与遗留 | 不存在 |
| review notes | `reports/review/reviewer-notes.md`、`agent-review.md` | review version | 独立复核/争议，不改 raw | 不存在 |

### 5.4 Slot、EV 与基线关系

- `ESLOT-RUN-001~018` 只登记 planned 主归属；不能放进 baseline manifest 冒充实际证据。
- runtime EV instance 必须由同一 `<run_id>` 的完整 TC case、producer suite `report.json`、required checks 和 digest 生成。
- EV 唯一定位至少为 `(run_id, evidence_id, evidence_item_digest)`；EV 存在不等 status=pass。
- blocked/not-run/failed/incomplete TC 不从分母删除；对应 slot 不得生成伪 pass alias。
- acceptance/review 只能解释范围、风险和争议，不得回写 raw status、digest 或 owner truth。

### 5.5 Baseline 变化与失效

| 变化 | 处理 |
|---|---|
| P0 FR/BR/AC/NFR、truth owner、协议/状态/UoW/config/evidence schema | 先回写正式真相源和 05/06，强制全量 P0，新 `run_id` |
| implementation/delivery/dependency/platform/slot set | 做影响分析；至少受影响 family + safety checks，必要时全量，新 run |
| config/profile/data/fixture/tool version | 新 snapshot/digest；按影响重跑，不覆盖旧 run |
| artifact/report digest、pairing/link/redaction 变化 | 旧 evidence 资格失效；记录 invalidation/supersedes，不能原地修结果 |
| 仅 review 解释/争议更新 | 新 review version；不得改 raw/report outcome |

## 6. 回填草稿

正式 §3 应完整列出 design/test/implementation/delivery/environment/dependency/config/slot/data/execution/review 基线、manifest 字段、固定路径、四 profile、EV 资格和变更失效规则。所有当前执行项明确为未创建/未固定，实际验收保持 `not_entered / blocked_by_missing_baseline`；这不是“不通过” verdict。

## 7. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| implementation/delivery 载体类型 | baseline 字段适用性 | 07/实现 authority 到达后固定，不预选 |
| exact digest algorithm | artifact/evidence 校验 | 等 SDK/实现 authority，不自行发明 |
| retention 数值 | evidence 可用期 | 只用条件式 guard，不写天数 |

## 8. 进入下一步条件

- [x] 设计基线与实际送验 instance 分离。
- [x] 全部未来 baseline 字段可定位且禁止隐式值。
- [x] artifact/report/acceptance 固定路径与 evidence 资格清楚。
- [x] 当前缺失项和阻断影响诚实记录。
- [x] 允许进入 Step 4；正式 06 仍禁止写入。
