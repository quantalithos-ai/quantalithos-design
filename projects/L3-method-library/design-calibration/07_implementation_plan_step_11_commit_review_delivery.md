# Step 11. 定义提交、评审与交付纪律

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填章节: `07-实施计划.md` §11 提交、评审与交付纪律
> 当前模块: `R11.2 commit review delivery:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义提交、评审与交付纪律 |
| 当前模块 | `R11.2 commit review delivery:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 6 commit boundary;Step 7 gate;Step 10 pause/change rules;实施计划书写规范;代码实施台账规范 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| 停审方式 | 用户已确认,允许进入 Step 12 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 commit boundary | completed_confirmed | 建立一笔提交对应一个 candidate boundary 的纪律 |
| Step 7 测试与验收门禁 | completed_confirmed | 建立提交前 gate、artifact/report 和 evidence 引用纪律 |
| Step 10 回退、暂停与变更控制 | completed_confirmed | 建立不允许提交、必须暂停和必须回写设计的场景 |
| `standards/document/实施计划书写规范.md` §4.8~§4.9 / §5.11 | 已读取 | 提供 commit 时机、message、语言边界、footer 和检查清单 |
| `standards/document/代码实施台账与门禁规范.md` §7.7~§7.8 | 已读取 | 提供 Commit Gate、Handoff Gate、commit hash 和 next action 回写规则 |
| L1-governance Step 11 | framework_reference | 只参考结构、表格和审计粒度,不得复制旧项目 scope 或旧项目事实 |

## 3. SOP 问题回答

1. 提交前必须检查哪些 git 配置。

   回答: 必须检查 `git config user.name` 为 `quantalithos-labs`,`git config user.email` 为 `quantalithos.ai@gmail.com`。目标实现仓 `/home/aris/Projects/quantalithos-method-library` 首次实现提交前必须确认。

2. 提交 message 应参考哪些规范和历史提交。

   回答: 参考 `standards/document/实施计划书写规范.md`、本 Step、目标实现仓近期合格提交和当前 boundary ledger 的 planned commit message。目标仓更严格规则只能叠加,不能放宽英文 commit、固定标题和一 boundary 一 commit。

3. 当前仓是 design 文档仓还是实现代码仓。

   回答: 当前编写的是 `quantalithos-design` 设计仓中间产物;正式实施发生在 `/home/aris/Projects/quantalithos-method-library` 实现仓。两者 commit language boundary 必须区分。

4. design 仓提交如何处理语言。

   回答: design 仓使用英文 type + 中文 subject/body,footer 固定 `Co-Authored-By: Codex <noreply@openai.com>`。设计仓提交不得强行改成实现仓英文 body。

5. 实现仓提交如何处理语言。

   回答: 实现仓 commit title、subject、body、source identifiers、rustdoc、普通注释和测试名默认必须英文。标题固定 `type(scope): subject`。

6. 当前项目允许哪些 type 和 scope。

   回答: type 允许 `feat`,`fix`,`refactor`,`docs`,`test`,`chore`,`perf`,`ci`,`style`。scope 使用 L3 method-library 领域或工程边界:`workspace`,`config`,`contracts`,`domain`,`application`,`infra`,`api`,`worker`,`jobs`,`definition`,`catalog`,`formalization`,`version`,`consumption`,`distribution`,`handoff`,`trace`,`audit`,`impact`,`external`,`peripheral`,`query`,`projection`,`inbound`,`event`,`publisher`,`replay`,`report`,`release`。

7. 每笔提交应对应哪个 Step 6 boundary。

   回答: 一笔提交只对应一个 `commit-xx-y` candidate boundary。不得把 PH-08 query DTO 与 query service 混成一笔,也不得把 PH-11 report generator 和 final handoff 混成一笔。

8. 同一 boundary 内多个协作子功能如何处理。

   回答: 保留为一笔提交,body 按子功能分组说明这些文件为什么共同形成一个可验证增量。不得按文件、repository、service、route 或 crate 拆成多笔。

9. commit body 第一段如何写。

   回答: body 第一段用一句英文 boundary summary,说明本提交形成的可验证增量,例如 `Method definition catalog contracts and truth state for commit-03-a:`。

10. 文件条目如何写。

    回答: 文件条目只写文件名,不写完整路径;用 `(+3)`,`(-35)`,`(~38)`,`(~+330/-60)` 这类近似改动量;bullet 之间不插空行。

11. evidence 如何引用。

    回答: commit body、交付说明和 handoff 只引用 `reports/runs/<run_id>`、`reports/runs/<run_id>/suites/<suite>.md` 或 `reports/acceptance/*`,不得粘贴完整日志,不得引用 `latest`,不得引用静态 pass。

12. 何时允许提交。

    回答: 当前 boundary 的设计闭环复核、scope gate、format/check/test/evidence gate、diff review、commit message review 和 Commit Gate 均通过后才允许提交。

13. 何时禁止提交。

    回答: compile/test/report/redaction/dependency/VETO failed、设计 blocker 未修、phase boundary 越界、无关用户改动 staged、raw artifact 与 report 不配对、message 不合规、静态 evidence 或默认 passed VETO 时不得提交。

14. 提交后必须回写什么。

    回答: 必须在 implementation ledger / boundary ledger 中记录 committed_hash、committed_message、post_commit_status、remaining blockers、未跑 checks、next boundary 和 next_allowed_action。真实台账实例仍需 Step 12/13 之后、实现移交前创建。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | boundary 已定义,但提交 message 分组未绑定 | 实现者可能按文件拆提交 | 本 Step 固定一 boundary 一 commit 和 body 分组 |
| Step 7 | artifact/report 路径已定义 | 提交说明可能粘贴日志或漏 report | 本 Step 固定证据引用方式 |
| Step 10 | pause / rollback 已定义 | 缺“不允许提交”的 commit gate 条款 | 本 Step 绑定 Commit Gate 和 Handoff Gate |
| 目标实现仓 | 现状为旧 layout | 首批提交可能夹带旧主线污染 | commit-01-a / commit-01-b message 和 review 明确隔离 |
| design / implementation 仓 | 语言规范不同 | 中文提交可能污染实现仓 | 本 Step 明确语言边界 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 提交粒度 | Step 6 有 boundary,缺提交纪律 | 一笔提交对应一个 boundary | 便于 review、rollback 和 evidence 审计 |
| body 分组 | 未映射 L3 boundary | 按 Step 6 子功能分组 | 防止文件平铺 |
| 证据引用 | Step 7 定义路径 | Step 11 固定提交和交付引用方式 | 防止粘贴日志或静态证据 |
| 语言边界 | 分散在标准 | design 仓中文 subject/body;实现仓英文 | 防止仓库风格混用 |
| Handoff | Step 6/7 只有 hook | 提交后必须回写 hash、message 和 next action | 支撑代码实施台账 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate / 文件拆提交 | diff 小 | 打散同一可验证增量 | 不采用 |
| 每个 boundary 一笔提交 | review / rollback / evidence 清晰 | 个别 boundary 较大 | 采用 |
| 实现仓允许中文 body | 与设计仓一致 | 不符合实现仓和源码语言规范 | 不采用 |
| 提交 body 粘贴测试日志 | 信息充分 | 噪音大且不可审计 | 不采用 |
| 只引用 run-scoped report | 简洁且可追溯 | 需要 report generator 配合 | 采用 |
| 用 message file 执行提交 | 格式稳定 | 多一步操作 | 采用 |

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交粒度 | 一笔提交对应一个 Step 6 boundary | 对照 Step 6 boundary 表 |
| 实现仓标题 | `<type>(<scope>): <subject>` | message file / `git log -1 --format=%s` |
| 实现仓语言 | commit、源码标识符、rustdoc、注释、测试名默认英文 | code review / grep |
| design 仓语言 | type 英文;subject/body 中文;footer 固定 | design repo commit review |
| footer | AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | message file review |
| 格式控制 | 使用完整 message file 和 `git commit -F` | shell history / review |

### 7.2 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat`;`fix`;`refactor`;`docs`;`test`;`chore`;`perf`;`ci`;`style` | design 仓和实现仓均使用英文 type |
| scope | `workspace`;`config`;`contracts`;`domain`;`application`;`infra`;`api`;`worker`;`jobs`;`definition`;`catalog`;`formalization`;`version`;`consumption`;`distribution`;`handoff`;`trace`;`audit`;`impact`;`external`;`peripheral`;`query`;`projection`;`inbound`;`event`;`publisher`;`replay`;`report`;`release` | 实现仓 title 必填;scope 必须能回指 Step 6 boundary |

### 7.3 Commit message 结构

| 部分 | 规则 | 正例 |
|---|---|---|
| title | 实现仓固定 `<type>(<scope>): <subject>` | `feat(definition): add method asset catalog contracts` |
| summary | body 第一段一句话说明 boundary 增量 | `Method definition catalog contracts and truth state for commit-03-a:` |
| body groups | 按 Step 6 子功能分组 | `Definition and catalog contracts:` |
| file bullets | 文件名 + 大致改动量 + 文件级说明 | `views.rs (~+180/-20): add body-free method asset catalog views.` |
| evidence | 只引用 report path | `Evidence: reports/runs/<run_id>/suites/contract-domain-fast.md` |
| footer | footer 前有真实空行 | `Co-Authored-By: Codex <noreply@openai.com>` |

### 7.4 Commit body 文件条目规则

| 项 | 正例 | 反例 |
|---|---|---|
| 文件名 | `services.rs` | `crates/application/src/services.rs` |
| 改动量 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | `Stored report replay:` | `Files:` |
| 换行 | message file with real blank lines | `subject\n\nbody` |
| 证据 | `reports/runs/<run_id>/summary.md` | pasted `cargo test` full log |

### 7.5 Commit boundary 到 body 分组映射

| Boundary | Commit body 分组名称 | 证据引用 |
|---|---|---|
| commit-01-a | `Workspace and package layout:`;`Core dependency boundary:` | dependency/package check report |
| commit-01-b | `Config profile skeleton:`;`Artifact and report roots:` | config smoke / script dry-run |
| commit-02-a | `Public contract foundation:`;`Shared shell fixtures:` | contract-domain-fast foundation |
| commit-02-b | `Domain foundation:`;`State and policy tests:` | domain tests |
| commit-02-c | `Application transaction surface:`;`Idempotency and UoW shell:` | application unit tests |
| commit-03-a | `Definition and catalog contracts:`;`Method asset truth state:` | contract-domain-fast definition |
| commit-03-b | `Definition service flow:`;`Repository fake and minimal entry:` | service-flow-fast / infra-runtime-fake |
| commit-04-a | `Formalization contracts:`;`Version state guards:` | contract-domain-fast formalization |
| commit-04-b | `Formalization services:`;`Stored replay and conflict handling:` | service-flow-fast formalization |
| commit-05-a | `Consumption material contracts:`;`Definition versus use guards:` | consumption contract/domain |
| commit-05-b | `Distribution and handoff services:`;`Availability seam fakes:` | distribution service/fake |
| commit-06-a | `Trace and audit contracts:`;`Evidence lineage state:` | trace/audit contract |
| commit-06-b | `Trace service flows:`;`Redaction targeted checks:` | trace service / redaction report |
| commit-07-a | `External summary contracts:`;`Body-free source adapters:` | external body-free / redaction |
| commit-07-b | `Peripheral package and set shell:`;`Residual risk markers:` | peripheral residual report |
| commit-08-a | `Query and view contracts:`;`Read material ports:` | query DTO/contract report |
| commit-08-b | `Core query services:`;`Query no-write guards:` | core query service report |
| commit-08-c | `Extended read surfaces:`;`Material freshness and degraded markers:` | extended query/material report |
| commit-09-a | `Inbound consumer contracts:`;`Receipt and dedup services:` | inbound entry-worker-job report |
| commit-09-b | `Outbound event candidates:`;`Publisher worker outcomes:` | outbound/publisher report |
| commit-10-a | `Job protocol surface:`;`Checkpoint and report contracts:` | job protocol report |
| commit-10-b | `Refresh job family:`;`Checkpoint progress reports:` | operations refresh report |
| commit-10-c | `Recovery and handoff jobs:`;`Stored report replay:` | operations recovery/handoff report |
| commit-11-a | `Report generator and evidence index:`;`Redaction dependency observability audits:` | report audit / boundary reports |
| commit-11-b | `Release smoke scenario:`;`VETO and acceptance handoff:` | release run / acceptance reports |

### 7.6 合格 commit 示例

```text
feat(definition): add method asset catalog contracts

Method definition catalog contracts and truth state for commit-03-a:

Definition and catalog contracts:
- contracts.rs (~+220/-15): add method definition request and result DTOs.
- refs.rs (~+90): add typed refs for method asset catalog surfaces.
Method asset truth state:
- definition.rs (~+260/-20): add method asset truth objects and state guards.
- definition_tests.rs (~+180): cover catalog uniqueness and formal source guards.
Evidence:
- reports/runs/<run_id>/suites/contract-domain-fast.md

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.7 不合格 commit 反例

| 反例 | 问题 |
|---|---|
| `feat: update files` | 缺 scope,无法回指 boundary |
| `feat(query): add dto and services and jobs` | 跨 commit-08-a / commit-08-b / commit-10 |
| `docs: 完成实现` in implementation repo | 实现仓 message 语言不合规 |
| body 按 `crates/contracts`, `crates/domain` 分组 | 目录平铺,没有说明协作子功能 |
| body 粘贴完整 test log | 噪音且不可追溯,应引用 report |
| `Evidence: latest` | 非 run-scoped evidence |
| footer 前无空行 | footer 格式不合规 |

### 7.8 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git config | user.name / user.email 符合项目要求 |
| boundary | 当前 diff 只覆盖一个 Step 6 boundary |
| staged scope | staged files 不含用户无关改动 |
| design closure | 当前 boundary required_reads / closure review 通过 |
| gates | fmt/check/targeted tests/artifact/report/audit 按 Step 7 通过或明确 not_applicable |
| message | title、body、footer、空行、语言边界和 evidence 引用符合本 Step |
| diff | `git diff --check` 和 staged diff review 通过 |
| blocker | 无 unresolved design blocker、VETO、redaction、dependency 或 report audit failure |

### 7.9 评审纪律表

| 评审项 | 要求 |
|---|---|
| boundary review | 一句话目标、allowed scope、forbidden scope、required checks 均与 Step 6/7 一致 |
| design closure review | 字段、DTO、state、port、mapper、config、evidence、phase scope 无私补 |
| test evidence review | raw artifact 与 report 配对,无 `latest`,无静态 pass |
| redaction review | raw body、secret、unsafe detail 不进入 public artifact/report/log |
| dependency review | compile dependency 只允许正式 `core-contracts` 类边界 |
| language review | 实现仓 commit/source/test 英文;design 仓中文 subject/body |
| unrelated changes review | 不 stage 用户未授权变更,不改写已验证历史 |

### 7.10 交付纪律表

| 时机 | 必须记录 | 位置 |
|---|---|---|
| commit 前 | planned_commit_message、staged scope、required checks、message checked | boundary ledger Commit Gate |
| commit 后 | committed_hash、committed_message、post_commit_status | boundary ledger Commit Gate |
| boundary handoff | remaining blockers、未跑 checks、next boundary、next_allowed_action | boundary ledger Handoff Gate |
| release handoff | `summary.md`,`gate-summary.md`,`evidence-index.md`,`handoff.md`,`veto-checklist.md`,`risk-acceptance.md`,`open-issues.md` 审查结论 | reports / acceptance |

### 7.11 artifact / report 交付检查表

| 输出 | 提交说明中允许引用 | 不允许 |
|---|---|---|
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | pasted stdout |
| run summary | `reports/runs/<run_id>/summary.md` | `reports/latest` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | static EV pass table |
| redaction/dependency/report audit | `reports/runs/<run_id>/<audit>.md` | 未配 raw artifact 的报告 |
| acceptance handoff | `reports/acceptance/handoff.md` | 未审查的生成草稿当最终结论 |

### 7.12 跨提交边界纪律审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 25 个 candidate boundary 是否都有 body 分组 | 通过 | 见 §7.5 |
| scope 是否使用 L3 method-library 语义 | 通过 | 未使用旧项目 scope |
| evidence 引用是否 run-scoped | 通过 | 只允许 `reports/runs/<run_id>` 和 `reports/acceptance` |
| 是否区分 design 仓和实现仓语言 | 通过 | 见 §3 / §7.1 |
| 是否创建真实 implementation ledger | 未创建 | 本 Step 只定义规则,真实实例在 Step 12/13 后移交前创建 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“提交纪律表”“Commit boundary 到 body 分组映射”“提交前检查清单”“评审纪律表”和“交付纪律表”小节。

正式 `07-实施计划.md` §11 后续应回填:

实施提交以 Step 6 的 commit boundary 为最小单位。一笔提交只对应一个 `commit-xx-y` boundary;同一 boundary 内多个协作子功能必须保留为一笔提交,并在 commit body 中按子功能分组说明。不同 phase、不同 protocol family、query / event / job / release evidence 不得混成一笔提交。

目标实现仓 `/home/aris/Projects/quantalithos-method-library` 的 commit message、源码标识符、rustdoc、普通注释和测试名默认使用英文,标题固定为 `type(scope): subject`。design 仓提交使用英文 type + 中文 subject/body。AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>`,footer 前必须有真实空行。

提交前必须检查 git config、staged scope、design closure、required checks、artifact/report 配对、redaction/dependency/report audit、commit message 和 `git diff --check`。提交说明只引用 `reports/runs/<run_id>` 与 `reports/acceptance/*`,不得粘贴完整日志,不得引用 `latest`,不得使用静态 evidence 或默认 passed VETO。

提交后必须回写 implementation ledger / boundary ledger 的 commit hash、message、post status、remaining blocker、未跑 checks、next boundary 和 next_allowed_action。真实 project implementation ledger 与 boundary ledger 实例必须在 Step 12/13 闭合后、实现移交前创建。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 是否需要进一步拆分 25 个 boundary | 暂不拆分;Step 12 完成判定再复核 | Step 12 |
| 真实 implementation ledger 何时创建 | Step 12/13 闭合后、实现移交前 | Step 12 / Step 13 |
| 目标实现仓是否已有更严格 commit 规范 | 实施前按目标仓历史提交复核,只能叠加不能放宽 | implementation Design Gate |
| report generator 早期 boundary 是否必须生成完整 EV | 不必须;但引用 evidence 时必须有 raw/report 配对 | Step 7 / Step 12 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 10 已确认 | 通过 | 用户已确认 |
| 提交纪律已定义 | 通过 | §7.1~§7.4 |
| boundary body 分组已定义 | 通过 | §7.5 覆盖 25 个 candidate boundary |
| 正反例已定义 | 通过 | §7.6 / §7.7 |
| 提交前检查清单已定义 | 通过 | §7.8 |
| 评审与交付纪律已定义 | 通过 | §7.9~§7.11 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R11.2 / Step 12 | 通过 | 用户已确认,允许进入 Step 12 |

## 11. R11.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 11 提交、评审与交付纪律中间产物 |
| 后续动作 | 进入 Step 12 `R12.1 completion criteria:先思考` |
| 限制 | Step 13 前仍不得修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
