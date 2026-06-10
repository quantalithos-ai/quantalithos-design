# Step 3. 固定验收基线

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节: `06-验收标准.md` §3 验收基线

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;Step 2 验收范围;`05-测试方案.md` §8 / §12 / §13 / §14 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_03_baseline.md` |
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
| `05-测试方案.md` §8 | 已完成 | 提供 P0 环境、profile、依赖协作方式和数据集 |
| `05-测试方案.md` §12 | 已完成 | 提供测试进入 / 退出准则和 root path 约束 |
| `05-测试方案.md` §13 | 已完成 | 提供 `EV-GOV-*`、artifact/report/acceptance/review 目录结构和 evidence index 字段 |
| `05-测试方案.md` §14 | 已完成 | 提供回归触发、residual 和不可风险接受项 |
| `04-配置设计.md` §6~§7 | 已完成 | 提供 P0 profile、配置项、config digest 和 fail-fast 语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪一版需求和设计验收? | 按当前正式 `projects/L1-governance/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。正式送验时必须记录这些文档所在 design commit 或等价 source ref。 |
| 按哪一版测试方案和测试结果裁决? | 测试方案按当前 `05-测试方案.md`。测试结果必须绑定一个固定 `run_id`,并由 `reports/runs/<run_id>/evidence-index.md`、suite reports、gate summary、redaction/dependency/report audit 和 `reports/acceptance/*` 支撑。 |
| 送验 build / commit / image 是什么? | 当前设计阶段没有送验 build。正式验收前必须固定 implementation commit / build id / image digest 和 core-contracts commit 或等价 source refs。 |
| 环境、配置、数据和依赖是什么? | P0 只接受 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 及 fake / controlled / disabled adapters。正式验收必须记录 profile、config digest、test data set refs、run namespace 和 dependency boundary evidence。 |
| 基线变更如何处理? | 基线固定后,若 `00`~`05`、implementation commit、core-contracts commit、profile、config digest、suite set、artifact/report schema 或 evidence index 发生影响 P0 的变化,必须按 `05` §14 触发最小或全量 P0 regression,并生成新的 `run_id`。 |
| 本轮验收固定的 `run_id` 是什么? | 当前不填真实值。正式裁决前必须固定为非 `latest` 的唯一值,并同时出现在 raw artifact、run report、evidence index、acceptance handoff 和审查记录中。 |
| 原始机器证据是否位于 `artifacts/test/<run_id>`? | 必须是。任何 `artifacts/test/<project>/<run_id>`、临时目录、`latest` 或缺 digest artifact 都不能作为正式验收基线。 |
| 人类可读报告是否位于 `reports/runs/<run_id>`? | 必须是。suite report、gate summary、evidence index、redaction-check、dependency-boundary 和 report-audit 都必须绑定同一 `<run_id>`。 |
| 验收交接文件是否位于 `reports/acceptance/`? | 必须是。至少包括 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`。它们不能静态宣告通过,必须引用真实 evidence。 |
| 是否存在不可作为正式基线的引用? | 是,所有 `latest`、泛化 “test / staging 环境”、无 digest artifact、无 report pair、静态 JSON EV/VETO 和未绑定 source refs 的报告都不可作为正式基线。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §2 | 使用 `当前文档批次对应 L1-governance 02/03/05`、`test / staging` 等泛化基线 | 改为后续正式 `06` 必须固定 source refs、profile、config digest、run_id、artifact/report/acceptance paths |
| 旧 `06-验收标准.md` §4~§7 | 证据用 API / DB / audit entry 等不可定位项 | 本 Step 固定只接受 `EV-GOV-*`、`reports/runs/<run_id>` 和 `artifacts/test/<run_id>` |
| `05-测试方案.md` §13 | 已定义证据结构,但无真实 run | 记录为正式裁决前置缺口,不得伪造 |
| `04-配置设计.md` | 已定义 P0 profile 和 config items,但无 config digest | 记录为正式验收基线字段 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档基线 | 泛化 02/03/05 | 固定 `00`~`05` + design commit / source refs | 新版验收必须承接完整需求到测试链 |
| 交付基线 | 未固定 | implementation commit / build id / image digest / core-contracts commit 必填 | 验收必须可复验 |
| 证据基线 | API / DB / audit entry | `EV-GOV-*` + report path + artifact digest | 防止不可追溯证据 |
| 环境基线 | test / staging | P0 profile + config digest + fake/controlled/disabled adapters | 避免真实产品成为 P0 前置 |
| 基线变更 | 未定义 | 变更触发 §14 回归和新 `run_id` | 防止旧证据支撑新基线 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否在设计阶段填真实 commit / run_id | A. 填占位真实值;B. 明确必须后续固定 | 采用 B。没有执行证据时不得伪造基线 |
| 是否允许 `latest` | A. 允许;B. 禁止 | 采用 B。验收基线必须可复查 |
| 是否允许 `reports/acceptance/*` 默认 passed | A. 允许脚本默认;B. 必须由 evidence 推导 | 采用 B。VETO / 风险接受必须可审计 |
| 是否允许 P1 staging-like 代替 P0 fake evidence | A. 允许;B. 禁止 | 采用 B。P1 不能替代 P0 验收 |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L1-governance/00-需求文档.md` | design commit / source ref 待固定 | 提供 C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV |
| 架构基线 | `projects/L1-governance/01-架构设计.md` | design commit / source ref 待固定 | 提供 truth boundary、依赖方向和架构红线 |
| 概要基线 | `projects/L1-governance/02-概要设计.md` | design commit / source ref 待固定 | 提供主要组成部分、关键对象、接口骨架和状态集合 |
| 详细设计基线 | `projects/L1-governance/03-详细设计.md` | design commit / source ref 待固定 | 提供字段级契约、flow、state matrix、事务和幂等 |
| 配置基线 | `projects/L1-governance/04-配置设计.md` | design commit / source ref + config digest 待固定 | 提供 P0 profile、strict validation、adapter binding 和 no-output |
| 测试方案基线 | `projects/L1-governance/05-测试方案.md` | design commit / source ref 待固定 | 提供 TC / EV / suite / artifact / report / regression |
| 标准基线 | `standards/document/验收标准书写规范.md`;`验收标准讨论流程_SOP.md`;`设计真相源闭环与可落码性标准.md` | standards commit / source ref 待固定 | 控制 `06` 生成和裁决闭环 |
| 交付基线 | implementation commit / build id / image digest | 待固定 | 无固定交付物不得裁决通过 |
| core-contracts 基线 | `L0-core` / core-contracts commit or package version | 待固定 | P0 唯一允许 compile-time upstream |
| 环境基线 | `local-dev`;`ci-test`;`integration-like`;`operations-replay` | profile + config digest 待固定 | P0 only;`staging-like` / `production-like` 不作 P0 前置 |
| 数据基线 | `DS-GOV-*` fixture / seed / replay root | run namespace / fixture set ref 待固定 | 必须脱敏、可清理、可复现 |

### 8.2 证据入口基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` 待固定 | 复核机器原始证据、suite result、stdout/stderr、case JSON、artifact digest | 送验前置 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` 待固定 | 阅读 summary、suite reports、gate summary、evidence index、redaction/dependency/report audit | 送验前置 |
| Evidence index | `reports/runs/<run_id>/evidence-index.md` and `artifacts/test/<run_id>/evidence-index.json` | `<run_id>` + artifact digest 待固定 | 将 `EV-GOV-*` 绑定 TC、AC、VETO、artifact、report | 送验前置 |
| 验收交接 | `reports/acceptance/handoff.md` | review version 待固定 | 记录送验范围、source refs、P0/P1/P2 边界和未覆盖说明 | 送验前置 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | review version 待固定 | 判断 VETO 是否触发,不得默认全部 passed | 送验前置 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | review version 待固定 | 支撑有条件通过和 residual 接受 | 条件前置 |
| 开放问题 | `reports/acceptance/open-issues.md` | review version 待固定 | 支撑不通过 / 有条件通过 / 待修复结论 | 送验前置 |
| 人工 / Agent 审查 | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | review version 待固定 | 补充证据追溯、边界和争议点 | 送验前置 |

### 8.3 P0 环境 / 配置基线

| Profile | 验收用途 | 依赖方式 | 必须固定 |
|---|---|---|---|
| `local-dev` | 手动 sanity 和开发调试,不作为正式 release evidence | in-memory / fake / disabled | profile ref、config digest if used |
| `ci-test` | deterministic contract / domain / service / fake integration 自动化 | in-memory stores、deterministic fake adapters、fixed clock/id | profile ref、config digest、fixture set ref |
| `integration-like` | 跨入口、adapter unavailable/degraded、topic completeness、handoff/export failure mapping | controlled / fake failure injection;no sibling compile dependency | profile ref、config digest、adapter refs |
| `operations-replay` | outbox、projection、reference、reconciliation、handoff/export、idempotency replay | replay fixtures + fake / controlled adapters | profile ref、config digest、replay root ref |
| `staging-like` | P1 selected-run only | real-like / dry-run | 不作为 P0 前置;若执行则单独标记 P1 |
| `production-like` | P1/P2 future operations | approved real products | 当前不作为验收通过基线 |

### 8.4 基线变更处理规则

| 变更 | 处理 |
|---|---|
| `00`~`05` 任一 P0 需求 / 设计 / 测试范围变化 | 重新执行受影响验收 Step,并按 `05` §14 触发回归 |
| implementation commit / build / image 变化 | 必须生成新 run 或证明变更不影响 P0;默认不复用旧证据 |
| core-contracts commit / package version 变化 | 至少重跑 contract-domain-fast、dependency-boundary 和 affected suites |
| config digest / profile 变化 | 重跑 config-redline、runtime builder、affected suite 和 release config check |
| suite set / gate script / report script 变化 | 重跑 report-generation-audit 和受影响 suite;禁止复用旧 evidence index |
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
| 可进入 Step 4 | 通过 | 下一步定义进入条件与退出条件;进入前等待用户审查 |
