# L1-work 07 实施计划 Step 11: 提交、评审与交付纪律

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §11 提交、评审与交付纪律
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义提交、评审与交付纪律 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |

本步定义 L1-work 实施过程中的 git 配置、提交时机、commit message、语言边界、scope、评审纪律和交付证据规则。本步只约束实施纪律,不新增 phase、不改变 Step 6 的 commit boundary,不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/实施计划书写规范.md` §4.9 | 已读取 | 提取 commit 粒度、message 结构、语言边界、footer、body 和自检清单 |
| `standards/document/实施计划讨论流程_SOP.md` Step 11 | 已读取 | 约束提交纪律、评审纪律、交付纪律和输出格式 |
| `projects/README.md` §1.1 / §8.2 | 已读取 | 提取 design 仓与实现仓目录、提交语言和永久记忆来源边界 |
| `standards/coding/rust.md` | Step 3 已列为必读 | 作为当前 Rust 实现仓编码规范 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承阅读清单、git 配置、实现仓英文提交和永久记忆种子规则 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 22 个 commit boundary、批次、提交时机和提交前门禁 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 commit boundary 门禁、artifact / report、失败处理和审查要求 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承暂停、回退、上游回写和恢复条件 |

校准来源:

- `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
- `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
- `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
- `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 提交前必须检查哪些 git 配置 | 必须检查项目级 `git config user.name` 为 `quantalithos-labs`,项目级 `git config user.email` 为 `quantalithos.ai@gmail.com`;不得用 `--global` 代替项目级配置。 |
| 2. 提交 message 应参考哪些规范和历史提交 | design 仓参考 `standards/document/实施计划书写规范.md` §4.9、`projects/README.md` §8.2 和近期合格 design 提交;实现仓参考同一规范与目标仓近期合格提交。目标仓尚无历史时,以本步和 §4.9 为准。 |
| 3. 当前仓是 design 文档仓还是实现代码仓 | 当前仓是 `quantalithos-design` 设计文档仓;未来目标实现仓是 `/home/aris/Projects/quantalithos-work`。两者 commit 语言规则不同。 |
| 4. design 仓提交如何保证格式 | design 仓 commit title 使用英文 `type`,subject / body 使用中文,footer 固定为 `Co-Authored-By: Codex <noreply@openai.com>`;使用 message 文件和 `git commit -F` / `git commit --amend -F` 精确控制换行。 |
| 5. 实现仓如何保证 commit message 英文 | 实现仓提交前必须对照本步语言边界检查;title、summary、body group 和文件说明全部英文。中文只能作为明确业务数据、协议样例、i18n 或测试夹具。 |
| 6. 实现仓标题格式如何保证 | 实现仓 title 固定为 `<type>(<scope>): <subject>`,scope 必填;提交前按本步 scope 映射表和 Step 6 commit boundary 检查。 |
| 7. 当前项目允许哪些 type 和 scope | type 允许 `feat`、`fix`、`refactor`、`docs`、`test`、`chore`、`perf`、`ci`、`style`;实现仓 scope 以 `repo`、`config`、`project`、`member`、`workitem`、`promote`、`dependency`、`iteration`、`query`、`event`、`consumer`、`outbox`、`jobs`、`reports`、`release` 为主。 |
| 8. 每笔提交应对应哪个 §6 boundary | 一笔实现仓 commit 必须对应 Step 6 一个 `commit-*` boundary;不得把多个无关 boundary 混成一笔。`commit-09-a` 可覆盖 BATCH-09-01 / BATCH-09-02,因为 Step 6 已声明二者共同收口 release evidence。 |
| 9. boundary 内多个子功能如何处理 | 同一 boundary 内的 repository、service、handler、tests 等协作子功能保持一笔提交,body 按子功能分组说明,不得按文件、route、crate 或子模块拆成多笔。 |
| 10. body 第一句如何概括 boundary | body 第一段用一句话说明该 commit boundary 的完整交付目的,并显式写出 boundary id 或 phase 切口。 |
| 11. body 应如何分组 | 按“为什么这些文件共同完成一个能力”分组,例如 `Project command contracts and fixtures:`、`Authorized query services:`、`No-write verification:`;不得使用笼统 `Files:`。 |
| 12. body 文件条目是否只写文件名 | 是。只写文件名,不写完整路径。必要时在文件名重复时用短限定名,但不得写完整路径。 |
| 13. 文件条目是否带改动量 | 是。每个文件条目必须带大致改动量,例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。 |
| 14. body 是否禁止字面量 `\n` | 是。必须使用真实换行,不得把 `\n` 写进 message。 |
| 15. bullet 之间是否禁止插空行 | 是。bullet 之间不插空行;标题后、分组间、footer 前保留真实空行。 |
| 16. 是否要求固定 footer | 有 AI 参与时默认固定 footer 为 `Co-Authored-By: Codex <noreply@openai.com>`。 |
| 17. footer 前是否必须有真实空行 | 是。`Co-Authored-By` 前必须有一个真实空行。 |
| 18. 是否允许多模型 footer | 若项目规定固定 footer,以固定 footer 为准。本项目默认只保留 Codex footer;除非项目明确批准多模型注脚,否则不展开。 |
| 19. 是否必须使用 message 文件 | 需要精确控制格式时必须使用完整 message 文件,再执行 `git commit -F <file>` 或 `git commit --amend -F <file>`。 |
| 20. 实现仓源码语言要求 | 源码标识符、rustdoc、普通注释和测试名默认英文。中文只能出现在业务数据、协议样例、i18n 或测试夹具中。 |
| 21. 哪些 commit 时机允许或禁止 | 允许在一个 Step 6 boundary 完成且门禁通过后提交;禁止未过门禁提交、按文件提交、跨 boundary 混提、提交半成品、把用户已有未提交改动一起提交。 |
| 22. 代码规范、格式化、lint 和测试如何检查 | 按 Step 3 阅读技术栈规范,按 Step 6 / Step 7 的当前 boundary 门禁执行 `cargo fmt`、`cargo check`、selected tests、脚本和报告检查。 |
| 23. 设计偏离如何同步文档 | 字段、DTO、状态、flow、config、test、acceptance 或 boundary 变更时按 Step 10 暂停并回写上游文档;不得在代码中自行创造第二真相。 |
| 24. 证据如何附到提交、PR 或交付说明中 | 提交 / PR / 交付说明只引用 `reports/runs/<run_id>`、`reports/acceptance` 和关键 artifact / report 路径,不粘贴完整日志。 |
| 25. 哪些情况必须拆分或合并提交 | 无关功能、跨 phase、跨 boundary、门禁不同的变更必须拆分;同一 boundary 内多个协作子功能必须合并为一笔并在 body 分组。 |
| 26. 应给出哪些示例和反例 | 本步给出 design 仓合格示例、实现仓合格示例、同 boundary 多子功能示例和反例。 |
| 27. 交付说明是否只引用 reports | 是。只引用固定 `run_id` 的 `reports/runs/<run_id>` 和 `reports/acceptance`,不得引用 `latest`,不得粘贴完整日志。 |
| 28. raw artifact 是否需要对应 report | 需要。阻断 suite 或 release 证据产生 raw artifact 后,必须生成或更新对应 run report;失败 artifact 也必须保留 failure reason。 |
| 29. acceptance handoff 和 veto 是否已审查 | PH-09 前必须审查 `reports/acceptance/handoff.md` 和 `reports/acceptance/veto-checklist.md`。handoff 文件名固定为 `handoff.md`;固定 `run_id` 写入正文和审查元数据,不得作为文件名分叉。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| design 仓和实现仓提交规则容易混用 | Step 3 已声明差异,但还没有执行级 commit 模板 | 实现仓可能使用中文提交,或 design 仓误用实现仓英文 body | 本步把两类仓语言边界和 message 示例分开 |
| scope 未与 Step 6 boundary 对齐 | 只有通用 scope 示例 | 后续实现 agent 可能自造 scope 或按 crate 命名 | 本步给出 L1-work scope 和 `commit-*` 映射 |
| commit body 规则缺少项目化示例 | 标准已有通用示例 | 实施时可能写完整路径、缺改动量、按文件平铺 | 本步给出 L1-work 示例和反例 |
| 评审和交付纪律分散 | Step 7 有门禁,Step 10 有暂停/回退 | 提交通过但证据、report、VETO 未审查 | 本步补 review / delivery / artifact-report 检查表 |
| 暂存纪律需要落到操作 | Step 3 / Step 10 已有保护用户改动原则 | 可能把用户已有未提交改动一起暂存 | 本步要求提交前检查 `git status --short` 和 `git diff --cached --name-only` |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 提交语言 | 已知道 design / implementation 不同 | 固定两类仓标题、body、footer 和示例 | 防止跨仓规则污染 |
| 提交粒度 | Step 6 已列 boundary | Step 11 规定一 boundary 一 commit,同 boundary 内分组不拆 commit | git log 可 review / 可回退 |
| scope | 只有通用示例 | 形成 L1-work scope 与 commit boundary 映射 | 实现仓 title 稳定 |
| body | 标准规定格式 | 项目化文件条目、改动量、分组和反例 | 降低 commit message 返工 |
| 评审 | Step 7 已列门禁 | 补人 / Agent review、交付说明和报告引用规则 | 交付证据可复核 |
| 证据 | Step 7 已列 artifact / report root | 提交 / PR / handoff 只引用固定 run report,不贴完整日志 | 保持审查材料清晰 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有仓统一中文 commit | design 仓阅读自然 | 实现仓与编码规范、英文源码和通用工具链不一致 | 不采用 |
| 所有仓统一英文 commit | 工具链一致 | design 仓历史和用户要求不一致 | 不采用 |
| design 仓中文 subject/body,实现仓英文 message | 同时尊重文档仓历史和实现仓规范 | 需要明确边界 | 采用 |
| 每个批次都 commit | 细粒度回退 | 与 Step 6 boundary 不一致,日志噪音大 | 不采用 |
| 每个 Step 6 boundary 一 commit | 可独立验证,可 review | 大 boundary 内需分组说明 | 采用 |
| 同 boundary 按 repository/service/route 拆多笔 | diff 小 | 破坏一个能力的原子交付 | 不采用 |
| body 写完整路径 | 定位直接 | 违反项目 commit 规范,body 冗长 | 不采用 |
| body 只写文件名和改动量 | 简洁,符合标准 | 同名文件需短限定 | 采用 |

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | `standards/document/实施计划书写规范.md` §4.9、本步 §7 | 提交前阅读并对照近期合格提交 |
| 提交粒度 | 一笔提交对应 Step 6 一个 commit boundary | 对照 §7.8 boundary-scope 映射 |
| 暂存范围 | 只暂存当前 boundary 相关文件 | `git status --short`;`git diff --cached --name-only` |
| 门禁状态 | 当前 boundary 的 Step 7 commit gate 通过 | suite artifact、report 和审查结论 |
| 提交信息 | 标题、body、footer、空行和语言边界符合本步规则 | 用 message 文件执行 `git commit -F` |

### 7.2 Commit Message 结构约束

| 部分 | design 仓约束 | 实现仓约束 |
|---|---|---|
| title | `<type>: <中文 subject>` | `<type>(<scope>): <English subject>` |
| type | 英文,取允许列表 | 英文,取允许列表 |
| scope | design 仓可不写 scope,除非历史规范要求 | 必填,取 §7.5 / §7.8 映射 |
| summary | 中文一句话说明本次 design boundary | English one-sentence boundary summary |
| body groups | 中文子功能分组,文件名 + 改动量 + 说明 | English sub-feature groups, file name + change size + summary |
| footer | 固定 Codex footer | 固定 Codex footer |
| 空行 | title 后空一行,footer 前空一行 | title 后空一行,footer 前空一行 |

实现仓 message 模板:

```text
<type>(<scope>): <subject>

One-sentence summary for this commit boundary:

Sub-feature group A:
- file_a.rs (+12): concise functional summary.
- file_b.rs (~+80/-10): concise functional summary.

Sub-feature group B:
- file_c.rs (+34): concise functional summary.

Co-Authored-By: Codex <noreply@openai.com>
```

design 仓 message 模板:

```text
docs: 收稳 L1-work 实施计划提交纪律

补齐实施计划提交、评审与交付规则:
- 07_implementation_plan_step_11_commit_review_delivery.md (+260): 增加提交结构、scope、评审、证据和交付纪律
- 07_implementation_plan_calibration_flow.md (~1): 标记 Step 11 已完成

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.3 Commit Body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名,不写完整路径 | `services.rs` | `crates/application/src/services.rs` |
| 改动量 | 使用大致变化标记 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | 按子功能分组,不按文件类型平铺 | `Authorized query services:` | `Files:` |
| 换行 | 使用真实换行,不写字面量 `\n` | title、body、footer 分段 | `subject\n\nbody` |
| 空行 | title 后空一行;分组间可空行;footer 前空一行;bullet 之间不插空行 | 连续 bullet | 每个 bullet 后空一行 |

### 7.4 Type 约束

| Type | 使用场景 |
|---|---|
| `feat` | 新功能、可见能力、阶段新增交付 |
| `fix` | 修复 bug、修复门禁失败、修复设计闭环错误 |
| `refactor` | 不改变外部行为的结构调整 |
| `docs` | 文档变更 |
| `test` | 测试、fixture、gate 或报告验证变更 |
| `chore` | 构建、脚本、依赖、仓库维护 |
| `perf` | 性能优化 |
| `ci` | CI / CD 变更 |
| `style` | 代码格式,不影响逻辑 |

### 7.5 实现仓 Scope 约束

| Scope | 使用范围 |
|---|---|
| `repo` | workspace、crate skeleton、dependency boundary 和仓库基础结构 |
| `config` | runtime config、profile、scripts、artifact / report root |
| `project` | Project / Backlog contract、domain、service 和 handler |
| `member` | ProjectMember、identity boundary、resolver fake 和 service |
| `workitem` | Backlog / WorkItem / ChildWorkItem formal work 主链 |
| `promote` | promotion request / review、runtime intake boundary 和 version conflict |
| `dependency` | dependency graph、blocker、evidence resolver 和 no-body guard |
| `iteration` | Iteration、Commitment、process seam 和 concurrency guard |
| `query` | Query DTO、view、page、projection、search、trace、board 和 no-write |
| `event` | inbound / outbound event DTO、event fixtures 和 event contract tests |
| `consumer` | consumer flows、dedup、dead-letter、quarantine 和 reference marker |
| `outbox` | outbox publisher、publication retry、failed marker 和 outbound events |
| `jobs` | operations jobs、rebuild、refresh、reconciliation、handoff runners |
| `reports` | evidence index、gate report、redaction report 和 acceptance handoff 生成 |
| `release` | release gates、evidence pack、veto checklist 和 final handoff |

### 7.6 语言边界

| 仓类型 | commit message | 源码 / 注释 / 测试名 | 说明 |
|---|---|---|---|
| `quantalithos-design` | `type` 英文;subject / body 中文;footer 固定 | 设计正文、伪代码说明和示例注释可中文 | 仅当前设计文档仓适用 |
| `/home/aris/Projects/quantalithos-work` | title、summary、body group、文件说明全部英文;title 固定 `<type>(<scope>): <subject>` | 源码标识符、rustdoc、普通注释、测试名默认英文 | 不继承 design 仓中文 commit 口径 |

### 7.7 固定 Footer 策略

| 场景 | 规则 |
|---|---|
| Codex 参与提交 | 默认保留 `Co-Authored-By: Codex <noreply@openai.com>` |
| footer 前空行 | 必须有一个真实空行 |
| 多模型参与 | 除非项目明确允许多注脚,否则保留项目固定 Codex footer |
| 精确格式 | 使用完整 message 文件和 `git commit -F` / `git commit --amend -F` |

### 7.8 Boundary 与 Scope 映射

| Commit boundary | 实现仓 scope | 提交主题口径 | 提交前门禁 |
|---|---|---|---|
| `commit-01-a` | `repo` | workspace、crate skeleton 和 `core-contracts` dependency | `cargo fmt`;`cargo check`;dependency grep |
| `commit-01-b` | `config` | config、script、artifact 和 report skeleton | config smoke;script `--help`;path check |
| `commit-02-a` | `project` | Project / Backlog DTO、domain 和 lifecycle | CORE contract / domain tests |
| `commit-02-b` | `project` | Project / Backlog write path、UoW、idempotency 和 handler | `TC-WORK-CORE-001~004` selected |
| `commit-03-a` | `member` | ProjectMember contracts、domain 和 identity boundary | member contract / domain tests |
| `commit-03-b` | `member` | resolver fake、member service 和 unresolved handling | `TC-WORK-MEMBER-001~004` selected |
| `commit-04-a` | `workitem` | formal work contracts、domain 和 body guard | FORMAL contract / domain / redaction selected |
| `commit-04-b` | `workitem` | formal work write service、lifecycle 和 stale marker | `TC-WORK-FORMAL-001~005` selected |
| `commit-04-c` | `promote` | promote request / review、runtime boundary 和 version conflict | `TC-WORK-PROMOTE-001~005` selected |
| `commit-05-a` | `dependency` | dependency / blocker graph domain and terminal guard | DEP contract / domain tests |
| `commit-05-b` | `dependency` | evidence resolver、blocker resolve service and no-body guard | `TC-WORK-DEP-001~005` selected |
| `commit-06-a` | `iteration` | Iteration / Commitment contracts、domain and state | ITER contract / domain tests |
| `commit-06-b` | `iteration` | process seam、commitment service and concurrency guard | `TC-WORK-ITER-001~005` selected |
| `commit-07-a` | `query` | 8 Query DTO、view / page contracts and fixtures | query contract tests |
| `commit-07-b` | `query` | authorized read model、projection freshness and no-write | `TC-WORK-QUERY-001~005` selected |
| `commit-07-c` | `query` | search、trace、board view and query handlers | `TC-WORK-QUERY-006~008`;`api-contract-fast` selected |
| `commit-08-a` | `event` | inbound / outbound event DTO、job DTO、receipt and report schema | event / job contract tests |
| `commit-08-b` | `consumer` | 7 consumer flows、dedup、quarantine and markers | consumer selected tests;redaction selected |
| `commit-08-c` | `outbox` | outbox publisher、9 outbound events and retry / failed marker | `TC-WORK-OPS-001`;consumer-outbox selected |
| `commit-08-d` | `jobs` | projection rebuild、reference refresh and reconciliation jobs | `TC-WORK-OPS-002~004`;no-write checks |
| `commit-08-e` | `jobs` | trace / archive handoff jobs、rerun and redaction | `TC-WORK-OPS-005~006`;redaction selected |
| `commit-09-a` | `release` | release gates、evidence pack、veto checklist and acceptance handoff | release gates;evidence pack;path check |

### 7.9 合格 Commit 示例

实现仓 `commit-02-a` 示例:

```text
feat(project): implement project and backlog command contracts

Project and backlog contracts and domain validation for commit-02-a:

Command contracts and fixtures:
- commands.rs (+120): add project and backlog command request and result DTOs.
- fixtures.rs (+45): add project command fixtures for roundtrip and validation tests.

Project and backlog domain rules:
- project.rs (+150): implement explicit project lifecycle validation.
- backlog.rs (+80): add backlog availability state transitions.
- lib.rs (+25): cover core domain transition tests.

Co-Authored-By: Codex <noreply@openai.com>
```

实现仓 `commit-07-b` 示例:

```text
feat(query): add authorized query services and no-write checks

Authorized read model access and projection freshness handling for commit-07-b:

Read model and authorization services:
- services.rs (+260): add authorized query flows for project, backlog, work item, member, and iteration views.
- ports.rs (+55): add read-only projection and trace repository ports.

No-write verification:
- query_no_write.rs (+120): assert query flows do not write truth, audit, outbox, or idempotency state.

Co-Authored-By: Codex <noreply@openai.com>
```

design 仓示例:

```text
docs: 收稳 L1-work 实施计划提交纪律

补齐实施计划提交、评审与交付规则:
- 07_implementation_plan_step_11_commit_review_delivery.md (+260): 增加提交结构、scope、评审、证据和交付纪律
- 07_implementation_plan_calibration_flow.md (~1): 标记 Step 11 已完成

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.10 反例

不合格实现仓提交:

```text
feat(query): add repository reads
```

如果 repository reads、query services 和 routes 同属 `commit-07-b`,不得拆成:

```text
commit 1: feat(query): add repository reads
commit 2: feat(query): add query services
commit 3: feat(query): add routes
```

应合并为一笔 `commit-07-b`,body 按子功能分组。

不合格 message:

```text
feat(query): add authorized query services
Authorized read model access for commit-07-b:\n\n- crates/application/src/services.rs (+260): add query services.

- ports.rs (+55): add read ports.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- 标题后没有真实空行。
- body 中出现字面量 `\n`。
- 文件条目写完整路径。
- bullet 之间插入空行。
- 没有按子功能分组。
- `Co-Authored-By` 前没有空行。
- 实现仓 body 不应混入中文功能描述。

### 7.11 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| 仓类型 | 已确认当前提交发生在 design 仓还是实现仓 |
| git identity | `git config user.name` / `user.email` 符合项目级配置 |
| 工作区 | `git status --short` 已审查,用户已有未提交改动未被暂存 |
| staged files | `git diff --cached --name-only` 只包含当前 boundary 文件 |
| boundary | 提交对应 Step 6 一个明确 `commit-*` boundary |
| 门禁 | Step 7 当前 boundary gate 通过,失败 artifact 已处理 |
| design closure | 字段、DTO、状态、flow、config、test、acceptance 无未闭合缺口 |
| 语言 | design 仓中文 subject/body;实现仓英文 title/body |
| title | 实现仓 title 为 `<type>(<scope>): <subject>` |
| body | 一句话说明 boundary,再按子功能分组 |
| file entries | 只写文件名,带大致改动量和一句话说明 |
| footer | `Co-Authored-By: Codex <noreply@openai.com>` 前有真实空行 |
| message file | 复杂提交使用 `git commit -F` 或 `git commit --amend -F` |
| evidence | 提交 / PR /交付说明引用固定 `run_id` report,不引用 `latest` |

### 7.12 评审纪律表

| 评审对象 | 评审重点 | 阻断条件 |
|---|---|---|
| design closure | 字段、DTO、state、flow、port、config 和 test 是否 1:1 闭合 | 任一当前 boundary 必需真相源缺失或冲突 |
| diff scope | diff 是否只属于当前 boundary | 混入跨 phase / 跨 boundary / 用户已有未提交改动 |
| code style | 是否符合 Rust 编码规范和仓内模式 | 违反 lint / fmt / module ownership |
| test gate | selected tests、fmt、check、redaction、no-write 等是否通过 | P0 / VETO / selected blocking gate failed |
| commit message | title、body、footer、语言和 scope 是否合规 | 实现仓中文 message、scope 缺失、body 无分组、footer 格式错误 |
| evidence | artifact、report、failure reason 和 review status 是否可追溯 | raw artifact 无 report、report 引用 `latest`、P0 evidence 缺失 |

### 7.13 交付纪律表

| 交付物 | 交付要求 | 不允许 |
|---|---|---|
| commit | 一个 Step 6 boundary 一笔提交 | 半成品提交、跨 boundary 混提、按文件拆提 |
| PR / handoff summary | 说明 boundary、门禁、report refs、open risks | 粘贴完整日志、引用 `latest`、写最终验收裁决 |
| run artifact | 写入 `artifacts/test/<run_id>` | 覆盖失败证据、把 raw artifact 当 report |
| run report | 写入 `reports/runs/<run_id>` | 缺 failure reason、缺 design refs、缺 suite scope |
| acceptance handoff | PH-09 写入 `reports/acceptance/handoff.md` | PH-01~PH-08 提前写最终裁决 |
| veto checklist | PH-09 写入 `reports/acceptance/veto-checklist.md` | VETO 项缺结论、缺证据、pending 未说明 |

### 7.14 Artifact / Report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| run_id | artifact / report / acceptance handoff 使用固定 `<run_id>` |
| raw artifact | suite 原始机器证据位于 `artifacts/test/<run_id>` |
| failure evidence | 失败 suite 保留 stdout / stderr、failure reason 或 skipped reason |
| report | 阻断 suite 有对应 `reports/runs/<run_id>/...` 可读报告 |
| evidence index | P0 evidence 能回指 `EV-WORK-* -> TC-WORK-* -> AC-WORK-* -> design_contract_refs -> artifact_refs` |
| redaction | forbidden output scan 通过或有阻断缺陷记录 |
| no-write | query / projection / reconciliation / report 不反写真相 |
| acceptance | PH-09 审查 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §11。

````markdown
## 11. 提交、评审与交付纪律

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“提交纪律表”“Commit Message 结构约束”“Boundary 与 Scope 映射”“提交前检查清单”“评审纪律表”和“Artifact / Report 交付检查表”小节,了解实施过程中的提交、评审和证据交付规则。

实施者提交前必须确认项目级 git identity:

```bash
git config user.name
git config user.email
```

输出必须分别为 `quantalithos-labs` 和 `quantalithos.ai@gmail.com`。

当前 `quantalithos-design` 是设计文档仓;目标实现仓是 `/home/aris/Projects/quantalithos-work`。两类仓 commit 规则不同:

| 仓类型 | 标题 | body | footer |
|---|---|---|---|
| design 文档仓 | `<type>: <中文 subject>` | 中文,按子功能分组 | `Co-Authored-By: Codex <noreply@openai.com>` |
| 实现代码仓 | `<type>(<scope>): <English subject>` | English,按子功能分组 | `Co-Authored-By: Codex <noreply@openai.com>` |

实现仓每笔提交必须对应 §6 一个 commit boundary。实现仓 scope 与 boundary 的默认映射:

| Commit boundary | scope |
|---|---|
| `commit-01-a` | `repo` |
| `commit-01-b` | `config` |
| `commit-02-a` / `commit-02-b` | `project` |
| `commit-03-a` / `commit-03-b` | `member` |
| `commit-04-a` / `commit-04-b` | `workitem` |
| `commit-04-c` | `promote` |
| `commit-05-a` / `commit-05-b` | `dependency` |
| `commit-06-a` / `commit-06-b` | `iteration` |
| `commit-07-a` / `commit-07-b` / `commit-07-c` | `query` |
| `commit-08-a` | `event` |
| `commit-08-b` | `consumer` |
| `commit-08-c` | `outbox` |
| `commit-08-d` / `commit-08-e` | `jobs` |
| `commit-09-a` | `release` |

实现仓 commit message 模板:

```text
<type>(<scope>): <subject>

One-sentence summary for this commit boundary:

Sub-feature group A:
- file_a.rs (+12): concise functional summary.
- file_b.rs (~+80/-10): concise functional summary.

Sub-feature group B:
- file_c.rs (+34): concise functional summary.

Co-Authored-By: Codex <noreply@openai.com>
```

提交前必须检查:

- 只暂存当前 boundary 相关文件,不得暂存用户已有未提交改动。
- 当前 boundary 的 fmt / check / selected tests / report gate 已通过。
- body 第一段说明 boundary,后续按子功能分组。
- body 文件条目只写文件名,带大致改动量。
- body 不出现字面量 `\n`,bullet 之间不插空行。
- `Co-Authored-By` 前有真实空行。
- 提交或交付说明只引用 `reports/runs/<run_id>`、`reports/acceptance` 和必要 artifact refs,不得引用 `latest` 或粘贴完整日志。

评审必须覆盖 design closure、diff scope、code style、test gate、commit message 和 evidence。任一 P0 / VETO / selected blocking gate failed、当前 boundary 真相源缺失、query/report no-write 失败、redaction failed、fake fallback success 或 P0 evidence 缺失,均不得提交或送验。
````

## 9. 待确认事项

| 项 | 当前结论 |
|---|---|
| 是否需要用户确认后进入 Step 12 | 是。用户要求每个 Step 完成后暂停审核。 |
| 是否创建正式 `07-实施计划.md` | 否。正式文档只在 Step 13 创建。 |
| 是否改变 Step 6 commit boundary | 否。仅补提交、评审和交付纪律。 |
| 是否需要立即提交 design 仓变更 | 否。当前任务只完成 Step 11 中间产物,除非用户另行要求提交。 |

## 10. 本步完成判定

| 判定项 | 状态 |
|---|---|
| 回答 Step 11 SOP 问题 | 已完成 |
| 提交纪律表 | 已完成 |
| commit message 结构约束 | 已完成 |
| type / scope 约束 | 已完成 |
| commit body 分组格式 | 已完成 |
| 固定 footer 策略 | 已完成 |
| design 仓 / 实现仓语言边界 | 已完成 |
| commit 示例和反例 | 已完成 |
| 提交前检查清单 | 已完成 |
| 评审纪律表 | 已完成 |
| 交付纪律表 | 已完成 |
| artifact / report 交付检查表 | 已完成 |
| §11 回填草稿 | 已完成 |
| 正式 `07-实施计划.md` 未创建 | 已验证 |
