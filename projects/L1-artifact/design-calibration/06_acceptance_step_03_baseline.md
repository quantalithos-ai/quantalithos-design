# Step 3. 固定验收基线

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节: `06-验收标准.md` §3 验收基线
> 粒度参考: `projects/L1-governance/design-calibration/06_acceptance_step_03_baseline.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;Step 2 验收目标与范围;`05-测试方案.md` §13 / §14;`04-配置设计.md` §6 / §7 / §9 / §12 / §14;`03-详细设计.md` §11~§15 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_03_baseline.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 4 |

## 2. 本步目标

定义正式验收裁决时必须固定哪些需求、设计、测试、交付、环境、配置、数据、artifact、report 和 acceptance handoff 基线。

本 Step 只回答:

- 按哪些正式文档和 source refs 验收。
- 送验 build / implementation commit / core-contracts commit / config digest / `run_id` 应如何固定。
- raw artifact、run report、acceptance handoff、VETO checklist 和 risk acceptance 的固定路径是什么。
- 基线变更如何处理。
- 当前哪些真实执行值尚未存在,必须作为送验前置缺口保留。

本 Step 不生成真实 `run_id`,不填写实际 commit,不读取实现仓执行结果,不裁决通过 / 有条件通过 / 不通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已完成 | 提供验收输入文档边界 |
| `06_acceptance_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 验收范围 |
| `00-需求文档.md` | 已完成 | 提供 P0 / P1 / P2、`FR-ART-*`、`BR-ART-*`、`NFR-ART-*` 和 `VF-ART-*` |
| `03-详细设计.md` | 已完成 | 提供 truth boundary、state matrix、UoW、idempotency、job、observability 和 handoff seam |
| `04-配置设计.md` | 已完成 | 提供四个 P0 profile、strict validation、source priority、redaction、degraded/no-write 和 replay 语义 |
| `05-测试方案.md` | 已完成 | 提供 `EV-CAND-ART-*`、`TC-ART-*`、artifact / report / acceptance / review 路径和 residual risk |
| `05_test_plan_step_13_evidence.md` | 已完成 | 提供 candidate evidence family、evidence index、固定 report 结构和 `EV-CAND-ART-*` 归档口径 |
| `05_test_plan_step_14_regression_risks.md` | 已完成 | 提供基线变更触发的最小回归 / 全量回归规则 |
| `projects/L1-governance/design-calibration/06_acceptance_step_03_baseline.md` | 粒度参考 | 仅参考其“基线固定粒度 / 路径固定 / 变更处理”结构,不借治理主语或证据族口径 |
| `standards/document/验收标准讨论流程_SOP.md` | 最新流程标准 | Step 1~15 执行依据 |
| `standards/document/验收标准书写规范.md` | 最新正式结构标准 | 正式 `06` 装配依据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪些正式文档和 source refs 验收? | 按当前正式 `projects/L1-artifact/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 以及本轮 `design-calibration/06_acceptance_step_01_input_boundary.md`、`06_acceptance_step_02_scope.md`。正式送验时还必须补充 design / implementation / core-contracts 的 source refs。 |
| 送验 build / implementation commit / core-contracts commit / config digest / `run_id` 如何固定? | 这些值当前都不存在,不得在设计阶段伪造。Step 3 只把它们定义为正式验收基线字段,并要求在真正送验时以单一固定值写入 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*`。 |
| raw artifact、run report、acceptance handoff、VETO checklist 和 risk acceptance 的固定路径是什么? | raw artifact 固定为 `artifacts/test/<run_id>`;run report 固定为 `reports/runs/<run_id>`;candidate evidence index 固定为 `reports/runs/<run_id>/evidence-index.md` 和 `artifacts/test/<run_id>/evidence-index.json`;acceptance handoff 固定为 `reports/acceptance/handoff.md`;VETO checklist 固定为 `reports/acceptance/veto-checklist.md`;risk acceptance 固定为 `reports/acceptance/risk-acceptance.md`;open issues 固定为 `reports/acceptance/open-issues.md`;审查补充固定为 `reports/review/reviewer-notes.md` 与 `reports/review/agent-review.md`。 |
| 基线变更如何处理? | 任一影响 P0 的变化,包括需求、设计、测试、config profile、config digest、fixture/replay root、suite 组合、artifact/report schema、evidence index 或 acceptance handoff 变化,都必须重新跑受影响的 Step 或重新生成新的 `run_id`;不得复用 `latest`。 |
| 当前哪些真实执行值尚未存在? | 当前没有真实 `run_id`、implementation commit、core-contracts commit、build id、image digest 或 config digest。它们都属于送验前置缺口,不能在设计阶段补写。 |
| 是否允许 `EV-ART-*` 或静态 `passed`? | 不允许。当前仍只保留 `EV-CAND-ART-*` 作为 candidate evidence archive id,正式 EV / AC alias 仍需后续明确;任何静态 `passed`、`VETO passed` 或手写 evidence 都不成立。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §3 | 基线写成泛化 test / staging / release 口径,没有把 artifact / report / acceptance / review 路径固定到 `run_id` | 本 Step 改为固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*` |
| 旧 `06-验收标准.md` §3 | 证据只写测试报告,没有 candidate evidence index | 本 Step 固定 `EV-CAND-ART-*` 与 `evidence-index` 互相回指 |
| `05-测试方案.md` §13 | 已有 candidate evidence 族,但没有正式验收基线字段收口 | 本 Step 把 candidate evidence、report path 和 handoff path 收口为验收基线 |
| `04-配置设计.md` | 已有四个 P0 profile,但没有把 profile 与 config digest 绑定到验收基线 | 本 Step 把 profile、config digest、fixture / replay root 作为基线固定项 |
| `07-实施计划.md` | 当前未建立 | 记录为后续文档链缺口,不影响本 Step 固定验收基线口径 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档基线 | 泛化 `test / staging` | 固定 `00`~`05` + design / implementation / core-contracts / config / run / artifact / report / acceptance handoff | 验收必须可复验 |
| 交付基线 | 未固定 | implementation commit / build id / image digest / config digest / `run_id` 必填 | 防止无法回指 |
| 证据基线 | 仅有测试报告概念 | `EV-CAND-ART-*` + evidence-index + artifact / report pair | 防止静态造证据 |
| 环境基线 | profile 名称泛化 | 四个 P0 profile + fixture / replay root + strict validation | 防止环境漂移 |
| 变更规则 | 未定义 | 任一影响 P0 的变化都触发回归和新 `run_id` | 防止旧证据支撑新基线 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否在设计阶段填写真实 commit / run_id | A. 先占位;B. 保持待固定 | 采用 B。当前没有执行证据,不得伪造 |
| 是否允许 `latest` 作为基线 | A. 允许;B. 禁止 | 采用 B。验收基线必须可复查 |
| 是否允许 acceptance handoff 默认 passed | A. 允许;B. 必须由 evidence 推导 | 采用 B。不得静态造结论 |
| 是否允许 P1 selected-run 代替 P0 | A. 允许;B. 禁止 | 采用 B。P1 只能作为 residual / later-run |
| 是否允许治理仓 evidence alias 风格进入本仓 | A. 允许;B. 禁止 | 采用 B。本仓必须保持 `EV-CAND-ART-*` 口径 |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 | 当前状态 |
|---|---|---|---|---|
| 需求基线 | `projects/L1-artifact/00-需求文档.md` | design baseline | 提供 `FR-ART-*` / `BR-ART-*` / `NFR-ART-*` / `VF-ART-*` | 已固定 |
| 架构基线 | `projects/L1-artifact/01-架构设计.md` | design baseline | 提供 truth boundary、依赖边界、消费边界和架构红线 | 已固定 |
| 概要基线 | `projects/L1-artifact/02-概要设计.md` | design baseline | 提供五个核心能力、组成部分、处理流和配置影响 | 已固定 |
| 详细设计基线 | `projects/L1-artifact/03-详细设计.md` | design baseline | 提供 protocol、state matrix、UoW、idempotency、job、handoff seam | 已固定 |
| 配置基线 | `projects/L1-artifact/04-配置设计.md` | design baseline + config digest 待固定 | 提供四个 P0 profile、strict validation、redaction、replay 和 target binding | 内容已固定, digest 待送验 |
| 测试方案基线 | `projects/L1-artifact/05-测试方案.md` | design baseline | 提供 `TC-ART-*`、`EV-CAND-ART-*`、suite / gate、artifact / report 根目录 | 已固定 |
| 讨论产物基线 | `design-calibration/06_acceptance_step_01_input_boundary.md`;`design-calibration/06_acceptance_step_02_scope.md` | discussion baseline | 提供输入边界、目标范围和 P0/P1/P2 收口 | 已固定 |
| 交付基线 | implementation commit / build id / image digest | 待固定 | 送验时必须单值固定 | 待固定 |
| core-contracts 基线 | `L0-core/core-contracts` 或等价 source ref | 待固定 | P0 编译期唯一上游 | 待固定 |
| 环境基线 | `local-dev`;`ci-test`;`integration-like`;`operations-replay` | profile + config digest 待固定 | 只允许四个 P0 profile | 待固定 |
| 数据基线 | `DS-ART-*` fixture / replay root | fixture / replay ref 待固定 | 必须可清理、可复现、去标识化 | 待固定 |

### 8.2 证据入口基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` 待固定 | 复核机器原始证据、suite result、stdout/stderr、case JSON、artifact digest | 送验前置 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` 待固定 | 阅读 summary、suite reports、gate summary、evidence index、redaction/dependency/report audit | 送验前置 |
| Evidence index | `reports/runs/<run_id>/evidence-index.md`;`artifacts/test/<run_id>/evidence-index.json` | `<run_id>` + artifact digest 待固定 | 将 `EV-CAND-ART-*` 绑定 TC、AC、VETO、artifact、report | 送验前置 |
| 验收交接 | `reports/acceptance/handoff.md` | review version 待固定 | 记录送验范围、source refs、P0/P1/P2 边界和未覆盖说明 | 送验前置 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | review version 待固定 | 判断 VETO 是否触发,不得默认全部 passed | 送验前置 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | review version 待固定 | 支撑有条件通过和 residual 接受 | 条件前置 |
| 开放问题 | `reports/acceptance/open-issues.md` | review version 待固定 | 支撑不通过 / 有条件通过 / 待修复结论 | 送验前置 |
| 人 / Agent 审查 | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | review version 待固定 | 补充证据追溯、边界和争议点 | 送验前置 |

### 8.3 P0 环境 / 配置基线

| Profile | 验收用途 | 依赖方式 | 必须固定 |
|---|---|---|---|
| `local-dev` | 本地 sanity 和开发联调,不作为正式证据主源 | fake / disabled / in-memory | profile ref、config digest if used |
| `ci-test` | deterministic P0 contract / domain / service / fake integration 自动化 | deterministic fake / in-memory | profile ref、config digest、fixture set ref |
| `integration-like` | controlled seam、adapter unavailable / degraded、topic completeness、handoff failure 映射 | controlled / real-like seam | profile ref、config digest、adapter refs |
| `operations-replay` | outbox、projection、reference refresh、reconciliation、handoff 与 replay 验证 | replay-backed / controlled / fake | profile ref、config digest、replay root ref |
| `staging-like` | future selected-run only | real-like / dry-run | 不作为 P0 前置 |
| `production-like` | future hardening only | approved real products | 不作为当前验收通过基线 |

### 8.4 基线变更处理规则

| 变更 | 处理 |
|---|---|
| `00`~`05` 任一 P0 需求 / 设计 / 测试范围变化 | 重新执行受影响验收 Step,并按 `05` §14 触发回归 |
| implementation commit / build / image 变化 | 必须生成新 `run_id` 或证明不影响 P0;默认不复用旧证据 |
| core-contracts commit / package version 变化 | 至少重跑 contract-domain-fast、dependency-boundary 和受影响 suites |
| config digest / profile 变化 | 重跑 config-redline、runtime builder、受影响 suites 和 release config check |
| suite set / gate script / report script 变化 | 重跑 report-generation-audit 和受影响 suites;禁止复用旧 evidence index |
| artifact/report schema 变化 | 生成新 `run_id`;重建 evidence index 和 acceptance draft |
| P1 selected-run 变化 | 不影响 P0 通过前置,但必须更新 residual / risk acceptance |

### 8.5 不可接受基线引用

| 引用 | 原因 | 处理 |
|---|---|---|
| `latest` | 不可复验 | 拒绝作为验收基线 |
| `artifacts/test/<project>/<run_id>` | 路径不符合 `05` §13 | 迁移到 `artifacts/test/<run_id>` 或重跑 |
| `reports/<project>/...` | 路径不符合 `05` §13 | 迁移到 `reports/runs/<run_id>` 或重跑 |
| 无 artifact digest 的 report | 无法证明 raw evidence | 阻断验收 |
| 静态 JSON 直接生成 EV / VETO passed | 证据真实性不足 | 阻断验收 |
| 泛化 test / staging 环境 | 无 profile / config digest / run_id | 不可作为正式基线 |
| P1 unavailable 被计入 P0 passed | 污染 P0 裁决 | 阻断或改为 residual |
| 私自改名为 `EV-ART-*` / `AC-ART-*` | 破坏当前 candidate evidence 口径 | 保持 `EV-CAND-ART-*` 直到后续正式收口 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收基线表”“证据入口基线表”“P0 环境 / 配置基线”“基线变更处理规则”和“不可接受基线引用”小节,了解验收基线如何固定。

正式 `06-验收标准.md` §3 应回填:

- 验收基线必须固定需求、架构、概要、详细、配置、测试方案、标准、交付、core-contracts、环境和数据。
- 正式裁决前必须有 implementation commit / build id / image digest、design commit、core-contracts commit、profile、config digest、fixture / replay root、`run_id`。
- raw artifact 固定为 `artifacts/test/<run_id>`;run report 固定为 `reports/runs/<run_id>`;acceptance handoff 固定为 `reports/acceptance/*`;review 固定为 `reports/review/*`。
- 当前设计阶段不填写真实 `run_id` 或真实 commit。若这些基线缺失,正式验收只能停在未进入 / 不可裁决状态。
- 基线固定后任何影响 P0 的需求、设计、实现、配置、suite、report 或 evidence 变化,都必须触发回归并生成新的 evidence。
- `latest`、无 digest artifact、无 report pair、静态 VETO passed、泛化 test / staging 环境和 P1 unavailable 计入 P0 passed 均不可接受。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式送验 implementation commit / build id / image digest | 影响是否可进入验收裁决 | 当前未提供,记录为送验前置缺口 |
| 正式 `run_id` | 影响所有 evidence / report / acceptance path | 当前未提供,不得伪造 |
| config digest 和 profile | 影响 config-redline / runtime builder / P0 profile 证据 | 当前未提供,后续执行阶段固定 |
| `reports/acceptance/*` 是否生成 | 影响 Step 10 / Step 11 / Step 13 / Step 14 | 当前未提供,正式裁决前必须生成或记录为阻断 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 基线类型已完整列出 | 通过 | 见 §8.1 |
| artifact / report / acceptance handoff 路径已固定 | 通过 | 见 §8.2 |
| P0 环境和配置基线已明确 | 通过 | 见 §8.3 |
| 基线变更规则已定义 | 通过 | 见 §8.4 |
| 当前缺失真实执行值未被伪造 | 通过 | 均列为送验前置缺口 |
| 可进入 Step 4 | 待用户审查 | 下一步定义进入条件与退出条件;进入前等待用户审查 |
