# Step 11. 定义提交、评审与交付纪律

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填章节: `07-实施计划.md` §11 提交、评审与交付纪律

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义提交、评审与交付纪律 |
| 当前状态 | 进行中;按纪律类型分批写入 |
| 输入基线 | Step 6 commit boundary;Step 7 gate;Step 10 pause/change rules;实施计划书写规范 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 12 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 commit boundary | 已完成 | 建立一笔提交对应一个 boundary 的纪律 |
| Step 7 门禁矩阵 | 已完成 | 建立提交前测试和证据引用纪律 |
| Step 10 回退 / 暂停 / 变更控制 | 已完成 | 建立不允许提交的场景 |
| `standards/document/实施计划书写规范.md` §提交规范 | 已存在 | 提供 commit message、语言、footer、body 分组规则 |
| `03-详细设计.md` §3 | 已存在 | 提供实现仓英文源码和 commit message 约束 |

## 3. SOP 问题回答

1. 提交前必须检查哪些 git 配置。

   回答: 必须检查 `git config user.name` 为 `quantalithos-labs`,`git config user.email` 为 `quantalithos.ai@gmail.com`。目标实现仓首次提交前必须设置。

2. 提交 message 应参考哪些规范和历史提交。

   回答: 参考 `standards/document/实施计划书写规范.md` 的 commit message 规则和目标实现仓近期合格提交。若目标仓暂无历史,以本 Step 规则为准。

3. 当前仓是 `quantalithos-design` 设计文档仓,还是其他实现代码仓。

   回答: 当前正在编写的是 `quantalithos-design` 设计仓;正式实施发生在 `quantalithos-governance` 实现仓。两者 commit message 语言边界不同。

4. 如果提交发生在当前 design 文档仓,如何保证 `type` 英文、subject / body 中文、footer 固定。

   回答: design 仓提交使用 `docs: <中文 subject>` 等英文 type + 中文 subject/body,footer 固定 `Co-Authored-By: Codex <noreply@openai.com>`。

5. 如果提交发生在其他实现仓,如何保证 commit message 必须使用英文。

   回答: 目标实现仓所有 commit title、subject、body 使用英文,源码标识符、rustdoc、普通注释和测试名默认英文。

6. 如果提交发生在其他实现仓,如何保证标题格式固定为 `type(scope): subject`。

   回答: Step 11 固定 title 结构,scope 必填。提交前检查清单要求核对 title。

7. 当前项目允许哪些 `type` 和 `scope`,以及 `scope` 如何与 §6 commit boundary 对齐。

   回答: type 允许 `feat/fix/refactor/docs/test/chore/perf/ci/style`。scope 使用 governance phase 或 module surface:`workspace/config/context/input/decision/approval/policy/control/compliance/nonconformity/query/projection/consumer/event/outbox/publisher/job/handoff/export/release/report`。每个 scope 对应 Step 6 boundary。

8. 每笔提交应对应哪个 §6 commit boundary,是否存在把多个 boundary 混成一笔的风险。

   回答: 一笔提交只对应一个 Step 6 commit boundary。不得把 `commit-06-c` outbox payload 和 `commit-06-d` publisher loop 合并,也不得把 PH-08 evidence 与业务功能合并。

9. 如果一个 commit boundary 内部包含多个协作子功能,如何保证仍然是一笔提交。

   回答: 保留为一笔提交,body 按 Step 6 的子功能分组说明,例如 “Outbound event contracts:” 和 “Accepted-flow payload builders:”。不得按文件、repository、service、route 拆成多笔。

10. commit body 的第一句如何概括本 commit boundary。

    回答: body 第一段必须是一句英文 boundary summary,说明本提交形成的可验证增量。

11. commit body 应按哪些子功能分组。

    回答: 分组来自 Step 6 “Commit boundary 子功能分组”,名称可英文调整,但必须对应同一增量的协作子功能。

12. body 文件条目是否只写文件名,禁止写完整路径。

    回答: 是。文件条目只写文件名,不写 `crates/.../file.rs` 完整路径。

13. body 文件条目是否带大致改动量。

    回答: 是。使用 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)` 这类近似标记。

14. body 是否禁止字面量 `\n`,并使用真实换行。

    回答: 是。提交信息必须写入 message 文件并用 `git commit -F` 控制真实换行。

15. bullet 之间是否禁止插空行。

    回答: 是。分组之间可以空行,bullet 之间不插空行。

16. 当前项目是否要求固定 footer,固定文本是什么。

    回答: AI 参与时默认保留 `Co-Authored-By: Codex <noreply@openai.com>`。

17. `Co-Authored-By` 前是否必须有真实空行。

    回答: 是。

18. 是否允许多模型 `Co-Authored-By`,还是只能保留项目固定 footer。

    回答: 默认只保留实际参与模型。当前由 Codex 生成时使用 Codex footer;若其他模型实际参与,按标准另行添加。

19. 当需要精确控制格式时,是否必须把完整 message 写入文件,再使用 `git commit -F` 或 `git commit --amend -F`。

    回答: 是。禁止用交互式临时输入拼接复杂 message。

20. 如果提交发生在其他实现仓,源码标识符、rustdoc、普通注释和测试名是否必须英文。

    回答: 是。

21. 哪些 commit 时机被允许,哪些时机被禁止。

    回答: 只允许 boundary 所有代码、测试、证据和复核通过后提交。禁止编译失败、测试缺失、设计 blocker 未修、混入无关文件、越过 phase boundary 或静态 evidence 伪 pass 时提交。

22. 代码规范、格式化、lint 和测试如何检查。

    回答: 按 Step 6 / Step 7 boundary 门禁运行 `cargo fmt --check`、`cargo check`、targeted tests、scripts/checks 和 `git diff --check`。

23. 设计偏离时如何同步文档。

    回答: 按 Step 10 change control 回写 `03/04/05/06/07` 或 standards,固定新 baseline 后重复核。

24. 证据如何附到提交、PR 或交付说明中。

    回答: 提交 body 只引用 `reports/runs/<run_id>`、suite report 或 `reports/acceptance` 路径,不粘贴完整日志。

25. 哪些情况下必须拆分提交,哪些情况下允许合并提交。

    回答: 不同 boundary 必须拆分。同一 boundary 内多个协作子功能必须保留一笔提交并按 body 分组,除非 Step 6 调整 boundary。

26. 当前实施计划中应给出的合格 commit 示例和反例是什么。

    回答: 本 Step §7.6 和 §7.7 提供。

27. 提交或交付说明是否只引用 `reports/runs/<run_id>` 和 `reports/acceptance`,而不是粘贴完整日志。

    回答: 是。

28. 如果门禁生成了 raw artifact,是否已经生成对应 report。

    回答: 提交前检查需确认;PH-08 由 report-generation-audit 阻断缺失。

29. `reports/acceptance/handoff.md` 和 `veto-checklist.md` 是否已经由人或 Agent 审查。

    回答: PH-08 提交前必须审查并记录。

30. Step 6 中每个 commit boundary 的子功能分组是否已经映射到 commit body 分组。

    回答: §7.5 给出映射策略和代表性映射。

31. Commit body 分组是否说明“为什么这些文件属于同一笔提交”,而不是按文件类型或目录平铺。

    回答: 是。分组名称必须表达协作子功能,如 “Stored job report replay:” 而不是 “Files:”。

32. 每个 commit boundary 的提交纪律是否完成停审。

    回答: 本 Step §7.10 设置停审记录;执行期提交前重复核。

33. 所有 boundary 的 type / scope、message 语言、body 分组、footer、证据引用和 diff 范围是否通过跨提交审计。

    回答: 本 Step §7.11 审计通过。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | boundary 已有,但 commit message 规则未映射 | 实施者可能按文件拆提交 | 本 Step 固定一 boundary 一 commit |
| Step 7 | gate/report 路径已定义 | 提交说明可能粘贴日志或漏报告 | 本 Step 固定证据引用方式 |
| standards | design 仓和实现仓语言边界不同 | 容易把中文 commit 带到实现仓 | 本 Step 明确区分 |
| PH-08 | acceptance reports 需要审查 | 可能脚本生成即提交 | 本 Step 要求人/Agent审查 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| commit 粒度 | Step 6 定义但未写纪律 | 一笔提交对应一个 boundary | 保证 review / rollback |
| message 语言 | 未在 Governance 07 中固定 | design 仓中文 subject/body;实现仓全英文 | 防止混用 |
| body 分组 | 未映射 Step 6 | 按子功能分组而非文件平铺 | 让 reviewer 理解协作增量 |
| 证据引用 | 未写提交纪律 | 只引用 report path,不粘日志 | 保持提交可读 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按文件或子模块提交 | diff 小 | 打散可验证增量 | 不采用 |
| 每个 boundary 一笔提交 | review / rollback 清晰 | 某些提交较大 | 采用 |
| 实现仓允许中文 body | 与设计仓一致 | 不符合源码/实现仓规范 | 不采用 |
| message 文件 + `git commit -F` | 格式稳定 | 多一步操作 | 采用 |

## 7. 结构化中间产物

### 7.1 提交纪律

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交粒度 | 一笔提交对应一个 Step 6 commit boundary | 对照 `07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 实现仓 title | `<type>(<scope>): <subject>` | `git log -1 --format=%s` or message file review |
| 实现仓语言 | title/body/source identifiers/rustdoc/comments/test names 默认英文 | code review |
| design 仓语言 | type 英文;subject/body 中文;footer 固定 | design repo commit review |
| footer | AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | message file review |
| message 输入 | 使用 `git commit -F <message-file>` | shell history / review |

### 7.2 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat`;`fix`;`refactor`;`docs`;`test`;`chore`;`perf`;`ci`;`style` | 实现仓和 design 仓均使用英文 type |
| scope | `workspace`;`config`;`context`;`input`;`decision`;`approval`;`policy`;`control`;`compliance`;`nonconformity`;`query`;`projection`;`consumer`;`event`;`outbox`;`publisher`;`job`;`handoff`;`export`;`release`;`report`;`governance` | 实现仓 title 必填;scope 应能回指 Step 6 boundary |

### 7.3 Commit message 结构

| 部分 | 规则 | 正例 |
|---|---|---|
| title | 实现仓固定 `<type>(<scope>): <subject>`;subject 英文祈使或动宾短语 | `feat(outbox): add governance outbox payload snapshots` |
| summary | body 第一段一句话说明 boundary 增量 | `Governance outbox payload snapshots and accepted-flow builders for commit-06-c:` |
| body groups | 按 Step 6 子功能分组 | `Outbound event contracts:` |
| file bullets | 只写文件名 + 大致改动量 + 文件级说明 | `events.rs (~+280/-10): add outbound event payload DTOs and fixtures.` |
| footer | footer 前真实空行 | `Co-Authored-By: Codex <noreply@openai.com>` |

### 7.4 Commit body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名 | `services.rs` | `crates/application/src/services.rs` |
| 改动量 | 使用近似标记 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | 按协作子功能分组 | `Stored job report replay:` | `Files:` |
| 换行 | 使用真实换行 | message file with real blank lines | `subject\n\nbody` |
| 空行 | 标题后空一行;footer 前空一行;bullet 之间不插空行 | group separated by one blank line | bullet 逐条空行 |

### 7.5 Commit boundary 到 body 分组映射

| Commit boundary | Step 6 子功能分组 | Commit body 分组名称 | 证据引用 |
|---|---|---|---|
| commit-01-a | workspace skeleton + dependency/naming | `Workspace and package layout:`;`Core dependency boundary:` | package check summary |
| commit-01-b | config skeleton + script/report roots | `Runtime config skeleton:`;`Gate and report roots:` | config smoke / script dry-run |
| commit-02-a | public DTO + domain state + state tests | `Context and input contracts:`;`Domain state and invariants:` | contract-domain-fast report |
| commit-02-b | ports/UoW/idempotency + service + fake runtime | `Application transaction surface:`;`Context and input services:`;`In-memory runtime slice:` | service-flow-fast report |
| commit-03-a | gate/decision contracts + domain | `Gate and decision contracts:`;`Decision state machine:` | contract-domain-fast report |
| commit-03-b | approval responsibility contracts + domain | `Approval responsibility contracts:`;`Vote and delegation state:` | contract-domain-fast report |
| commit-03-c | repositories + command services + handlers | `Decision repositories and services:`;`Approval handlers and stored results:` | service-flow-fast report |
| commit-04-a | policy fact + shared rules + conflict | `Policy truth contracts:`;`Shared rules and conflict state:` | policy suite report |
| commit-04-b | control + compliance conclusion | `Control applicability and review:`;`Compliance conclusion state:` | control/compliance suite report |
| commit-04-c | nonconformity + corrective action + verification | `Nonconformity lifecycle:`;`Corrective action and verification:` | NC suite report |
| commit-04-d | PH-04 services + repos + handlers + redaction | `Governance fact services:`;`Persistence and redaction checks:` | service/redaction reports |
| commit-05-a | query contracts + views + projection identity | `Query response surface:`;`Projection identity and trace reads:` | query contract report |
| commit-05-b | query ports + services + no-write guards | `Read repositories and visibility decisions:`;`Query services and no-write guards:` | query no-write report |
| commit-05-c | API query handlers + error mapping | `API query handlers:`;`Response and error mapping:` | API handler report |
| commit-06-a | inbound event contracts + receipt DTO | `Inbound event contracts:`;`Consumer receipt surface:` | inbound contract report |
| commit-06-b | snapshot/receipt/stale ports + consumer services | `Reference snapshots and stale markers:`;`Consumer services and receipts:` | consumer report |
| commit-06-c | outbound DTO + outbox record + payload builders | `Outbound event contracts:`;`Outbox record snapshots:`;`Accepted-flow payload builders:` | outbound/service reports |
| commit-06-d | publisher port + loop + publication state | `Publisher adapter and topic map:`;`Publication state transitions:` | outbox publisher report |
| commit-07-a | job shared schema + stored report | `Job protocol surface:`;`Stored report replay:` | job contract report |
| commit-07-b | publish/rebuild/refresh/reconcile runners | `Operations job runners:`;`Replay and partial reports:` | operations report |
| commit-07-c | handoff/archive/export ports + jobs | `Handoff and archive jobs:`;`External export and redaction:` | handoff/export reports |
| commit-07-d | jobs entry + artifact/report output | `Job entry wiring:`;`Operations artifacts and reports:` | entry-worker-job report |
| commit-08-a | release gate shell + evidence index shell | `Release gate orchestration:`;`Evidence index guardrails:` | report audit skeleton |
| commit-08-b | smoke + final reports + handoff | `Release smoke scenario:`;`Evidence and VETO reports:`;`Acceptance handoff:` | release reports and acceptance handoff |

### 7.6 合格 commit 示例

```text
feat(outbox): add governance outbox payload snapshots

Governance outbox payload snapshots and accepted-flow builders for commit-06-c:

Outbound event contracts:
- events.rs (~+280/-10): add governance outbound event kinds, payload DTOs, and fixtures.
- fixtures.rs (+74): add deterministic outbound payload fixtures for accepted command flows.

Outbox record snapshots:
- outbox.rs (~+210/-8): add body-free outbox record state, payload snapshot ownership, and mapping tests.
- ports.rs (+42): extend the outbox repository contract with snapshot-preserving append and versioned marker calls.

Accepted-flow payload builders:
- services.rs (~+330/-60): migrate accepted governance command paths to append stored outbox snapshots.
- repositories.rs (+96): add in-memory outbox snapshot storage and publication-state guards.

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.7 不合格 commit 反例

```text
feat(outbox): add events
Governance outbox work:\n\n- crates/contracts/src/events.rs (+280): events.

- crates/application/src/services.rs (+330): services.
- crates/infra/src/repositories.rs (+96): repos.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- 标题后没有真实空行。
- body 中出现字面量 `\n`。
- 文件条目写完整路径。
- bullet 之间插入空行。
- 分组按文件平铺,没有说明子功能协作关系。
- `Co-Authored-By` 前没有真实空行。

### 7.8 不合格拆分示例

```text
commit 1: feat(outbox): add outbound event DTOs
commit 2: feat(outbox): add outbox repository
commit 3: feat(outbox): migrate accepted service calls
```

如果这三部分共同构成 Step 6 的 `commit-06-c`,必须合并为一笔提交,并在 body 中按 `Outbound event contracts`、`Outbox record snapshots`、`Accepted-flow payload builders` 分组说明。

### 7.9 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com` |
| diff 范围 | 只覆盖一个 Step 6 commit boundary |
| 工作区 | 无未授权用户改动 staged;无无关 `.gitignore` / `Cargo.lock` 噪音混入 |
| 设计复核 | 当前 boundary 的设计者经验复核无 blocker |
| 门禁结果 | Step 7 对应测试 / check / report 通过 |
| 文档同步 | 设计偏离已按 Step 10 回写 |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 |
| title | 实现仓固定 `<type>(<scope>): <subject>` |
| body | 先写 boundary summary,再按子功能分组 |
| 文件条目 | 只写文件名,标注大致改动量 |
| 空行 | 标题后空行;footer 前空行;bullet 之间不插空行 |
| 换行 | body 中没有字面量 `\n` |
| 证据引用 | 只引用 report / acceptance path,不粘贴完整日志 |
| message 文件 | 使用 `git commit -F <message-file>` |

### 7.10 评审纪律表

| 评审项 | 要求 | 失败处理 |
|---|---|---|
| boundary review | reviewer 能从 commit title/body 回指 Step 6 boundary | 修改 message 或拆分提交 |
| design closure | 字段/DTO/状态/port/version/outbox/job/evidence 复核记录存在 | 暂停并补复核 |
| test evidence | 提交说明引用的 report 存在且来自 raw artifact | 补跑门禁或修 report generator |
| phase boundary | diff 不含后续 phase 内容 | 移出后续 boundary |
| no unrelated changes | diff 不含用户改动或无关文件 | 重新 staging |
| language | 实现仓 message/source/test 英文 | 修正后提交 |

### 7.11 交付纪律表

| 交付项 | 要求 |
|---|---|
| 代码提交 | 一 boundary 一 commit,不得压缩多个 phase |
| 测试证据 | 提交或 handoff 只引用 `reports/runs/<run_id>` and suite reports |
| release handoff | PH-08 必须包含 `reports/acceptance/handoff.md` |
| VETO checklist | PH-08 必须包含审查后的 `reports/acceptance/veto-checklist.md` |
| risk acceptance | 有条件通过时必须包含审查后的 `risk-acceptance.md` |
| failed artifacts | 不删除 failed raw artifacts;fixed run must be traceable |

### 7.12 Artifact / report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| artifact root | `artifacts/test/<run_id>` 存在并包含 suite raw reports |
| report root | `reports/runs/<run_id>` 已生成 |
| suite reports | 每个 blocking suite 有人读 report |
| evidence index | `reports/runs/<run_id>/evidence-index.md` 可回指 raw artifacts |
| gate summary | `reports/runs/<run_id>/gate-summary.md` 汇总 blocking/non-blocking gate |
| redaction check | `reports/runs/<run_id>/redaction-check.md` 通过 |
| dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` 通过 |
| report audit | `reports/runs/<run_id>/report-audit.md` 通过 |
| acceptance handoff | `reports/acceptance/handoff.md` 已审查 |
| VETO checklist | `reports/acceptance/veto-checklist.md` 已审查 |
| risk acceptance | 有条件通过时 `reports/acceptance/risk-acceptance.md` 已审查 |

### 7.13 Commit discipline 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-01-a~commit-01-b | workspace/config boundary 是否使用 `chore`/`ci`/`feat(config)` 合理 scope | 设计层通过 | 提交前按目标 diff 判断 type |
| commit-02-a~commit-04-d | command/domain/service boundary 是否按功能 scope 提交 | 设计层通过 | 不按 crate 横向拆 |
| commit-05-a~commit-05-c | query/projection/API boundary 是否保留 query no-write 证据 | 设计层通过 | 提交前引用 query report |
| commit-06-a~commit-06-d | consumer/event/outbox/publisher boundary 是否拆分清楚 | 设计层通过 | 不合并 outbox payload 与 publisher |
| commit-07-a~commit-07-d | job/handoff/export boundary 是否引用 operations reports | 设计层通过 | 不提前写 release evidence |
| commit-08-a~commit-08-b | release/report boundary 是否不生成静态 pass | 设计层通过 | PH-08 必须引用 report audit |

### 7.14 跨提交边界纪律审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每笔提交是否对应一个 Step 6 boundary | 通过 | 规则已固定 |
| scope 是否能回指 boundary | 通过 | §7.2 allowed scopes |
| body 是否按子功能分组 | 通过 | §7.5 mapping |
| 是否禁止按文件拆提交 | 通过 | §7.8 反例 |
| 是否区分 design 仓和实现仓语言 | 通过 | §7.1 / §7.9 |
| footer 和空行规则是否明确 | 通过 | §7.3 / §7.4 |
| 证据引用是否避免粘贴完整日志 | 通过 | §7.9 / §7.12 |
| artifact/report 配对是否纳入交付检查 | 通过 | §7.12 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §11。正式装配时可压缩示例数量,但必须保留规则、正例、反例和检查清单。

### 11.1 Commit Discipline

目标实现仓提交规则:

- 一笔 commit 对应 Step 6 的一个 commit boundary。
- 标题固定为 `<type>(<scope>): <subject>`,scope 必填。
- title and body 使用英文。
- body 第一段说明 boundary summary,之后按 Step 6 子功能分组。
- 文件条目只写文件名,标注近似改动量。
- 禁止字面量 `\n`,使用真实换行。
- bullet 之间不插空行。
- footer 前空一行,AI 参与时默认使用 `Co-Authored-By: Codex <noreply@openai.com>`。
- 需要精确控制格式时使用 `git commit -F <message-file>`。

当前 design 仓提交规则:

- `type` 使用英文。
- subject/body 可使用中文。
- footer 使用项目固定 `Co-Authored-By: Codex <noreply@openai.com>`。

### 11.2 Allowed Type and Scope

允许 type:

```text
feat / fix / refactor / docs / test / chore / perf / ci / style
```

允许 scope:

```text
workspace / config / context / input / decision / approval / policy / control /
compliance / nonconformity / query / projection / consumer / event / outbox /
publisher / job / handoff / export / release / report / governance
```

### 11.3 Review and Delivery

提交前必须检查 git 配置、diff 范围、设计闭环复核、门禁结果、文档同步、源码语言、message 格式和证据引用。PH-08 交付必须审查 `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md`。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓是否有更严格 commit hook | 若存在只能叠加,不能放宽本规则 | PH-01 |
| 多模型 footer | 默认只写实际参与模型;当前 Codex footer | 提交前 |
| release reports 是否随 commit 提交 | 按项目最终交付策略决定,但引用路径必须存在 | PH-08 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 提交纪律表已完成 | 通过 | §7.1 |
| message 结构和 type/scope 已完成 | 通过 | §7.2~§7.4 |
| boundary 到 body 分组映射已完成 | 通过 | §7.5 |
| 正反例已给出 | 通过 | §7.6~§7.8 |
| 提交前/评审/交付检查已完成 | 通过 | §7.9~§7.12 |
| 停审和跨提交审计已完成 | 通过 | §7.13~§7.14 |
| 可进入 Step 12 | 通过 | 下一步定义实施完成判定 |
