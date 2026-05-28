## Step 11. 定义提交、评审与交付纪律

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 11
- 回填章节：`07-实施计划.md` §11 提交、评审与交付纪律

### 2. 本步输入

- 上游文档：
  - `standards/document/实施计划书写规范.md` §4.6 / §4.8 / §4.9 / §5.11
  - `standards/document/实施计划讨论流程_SOP.md` Step 11
  - `standards/coding` 下的 Rust 编码规范
- 已确认结论：
  - L0-core 的实现不会在当前 `quantalithos-design` 文档仓内完成，而是在其他实现代码仓完成。
  - 当前 design 文档仓允许中文 subject / body，但该例外不得传递给实现代码仓。
  - 其他实现代码仓 commit message 必须使用英文，标题固定为 `type(scope): subject`。
  - 实现仓源码标识符、rustdoc、普通注释和测试名默认使用英文。
  - 一笔提交对应 Step 6 中一个 commit boundary；同一 boundary 内多个协作子功能仍合成一笔提交，在 body 中按子功能分组。
- 依赖的前序 Step：
  - `07_implementation_plan_step_06_tasks_commits.md`
  - `07_implementation_plan_step_07_test_acceptance_gates.md`
  - `07_implementation_plan_step_10_rollback_change_control.md`

### 3. SOP 问题回答

1. 提交前必须检查哪些 git 配置。
   回答：目标实现仓必须使用项目级 git 配置，不使用 `--global`。提交前执行 `git config user.name` 和 `git config user.email`，确认分别为 `quantalithos-labs` 与 `quantalithos.ai@gmail.com`。
2. 提交 message 应参考哪些规范和历史提交。
   回答：先读 `standards/document/实施计划书写规范.md` §4.9、`standards/document/实施计划讨论流程_SOP.md` Step 11，再查看目标实现仓最近合格提交。若目标仓规则更严格，只能叠加，不能放宽英文 commit、固定标题、footer 空行和 boundary 粒度。
3. 当前仓是 `quantalithos-design` 设计文档仓，还是其他实现代码仓。
   回答：本文件位于 design 仓，但它指导的是未来 L0-core 实现代码仓。正式实施 L0-core 时必须按实现仓规则执行，而不是继承 design 仓中文 commit 例外。
4. 如果提交发生在当前 design 文档仓，如何保证 `type` 英文、subject / body 中文、footer 固定。
   回答：design 仓提交标题可使用 `docs: 中文 subject`，body 使用中文，footer 固定为 `Co-Authored-By: Codex <noreply@openai.com>`，footer 前保留真实空行。
5. 如果提交发生在其他实现仓，如何保证 commit message 必须使用英文。
   回答：实现仓标题、summary、body group、文件条目说明均必须英文。提交前 reviewer 检查 commit message；必要时用 message 文件执行 `git commit -F` 或 `git commit --amend -F`，避免多次 `-m` 拼接造成格式错误。
6. 如果提交发生在其他实现仓，如何保证标题格式固定为 `type(scope): subject`。
   回答：每个 Step 6 commit boundary 都必须映射一个 scope；实现仓标题必须包含 scope，例如 `feat(command): add draft command write path`。不得写成 `feat: ...` 或中文标题。
7. 当前项目允许哪些 `type` 和 `scope`，以及 `scope` 如何与 §6 commit boundary 对齐。
   回答：允许 type 为 `feat`、`fix`、`refactor`、`test`、`chore`、`ci`、`docs`、`perf`。scope 以功能边界为主，包括 `workspace`、`contract`、`config`、`draft`、`command`、`publish`、`lifecycle`、`query`、`trace`、`job`、`snapshot`、`relay`、`e2e`、`evidence`。
8. 每笔提交应对应哪个 §6 commit boundary，是否存在把多个 boundary 混成一笔的风险。
   回答：每笔提交必须对应 commit-01-a ~ commit-06-a 中一个边界。存在把 DTO/config 与 draft 纵切混成一笔、把 query 与 jobs 混成一笔、把 evidence 与新功能混成一笔的风险，提交前必须对照 Step 6 的“不包含内容”检查。
9. 如果一个 commit boundary 内部包含多个协作子功能，如何保证仍然是一笔提交，而不是按文件、repository、service、route 或子模块拆成多笔。
   回答：同一 boundary 的协作子功能在 body 中分组表达，例如 `Domain policy:`、`Command service:`、`Persistence and evidence:`，而不是拆成 repository 一笔、service 一笔、tests 一笔。
10. commit body 的第一句如何概括本 commit boundary。
   回答：body 第一段用一句英文 summary 说明本边界交付的可验证能力，例如 `Draft command writes, idempotency, audit, and outbox persistence for commit-02-b:`。
11. commit body 应按哪些子功能分组，分组名称如何体现“为什么这些文件属于同一笔提交”。
   回答：分组应按协作能力命名，如 `Contract DTOs and schema tests:`、`Draft command vertical slice:`、`Release evidence and redline checks:`，让 reviewer 看出这些文件共同完成同一 commit boundary。
12. body 文件条目是否只写文件名，禁止写完整路径。
   回答：是。body 文件条目只写文件名，例如 `command_services.rs`，不写 `crates/l0-core/src/application/command_services.rs`。
13. body 文件条目是否带大致改动量。
   回答：是。每个文件条目必须标记大致改动量，例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。
14. body 是否禁止字面量 `\n`，并使用真实换行。
   回答：是。message 文件中必须使用真实换行，不得出现字面量 `\n` 表示换行。
15. bullet 之间是否禁止插空行。
   回答：是。同一分组内 bullet 之间不插空行；不同分组之间可以空一行。
16. 当前项目是否要求固定 footer，固定文本是什么。
   回答：默认保留固定 footer：`Co-Authored-By: Codex <noreply@openai.com>`。
17. `Co-Authored-By` 前是否必须有真实空行。
   回答：是。footer 前必须有一个真实空行。
18. 是否允许多模型 `Co-Authored-By`，还是只能保留项目固定 footer。
   回答：本轮 L0-core 实施计划默认只保留项目固定 footer。若目标实现仓明确允许多模型 footer，必须按目标仓规则另行说明；没有明确规则时不展开多行模型注脚。
19. 当需要精确控制格式时，是否必须把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。
   回答：是。涉及多段 body、footer 空行和分组文件条目时，应优先使用 message 文件。
20. 如果提交发生在其他实现仓，源码标识符、rustdoc、普通注释和测试名是否必须英文。
   回答：是。实现仓 source code、rustdoc、普通注释、测试名、fixture key 和 error name 默认英文；设计文档和中间产物可中文。
21. 哪些 commit 时机被允许，哪些时机被禁止。
   回答：允许在一个 commit boundary 的代码、测试、证据和文档回写完成后提交。禁止在代码不可编译、门禁失败、WIP 保存、设计偏离未回写、diff 跨多个 boundary 或证据缺失时提交。
22. 代码规范、格式化、lint 和测试如何检查。
   回答：遵循 Rust 编码规范；提交前执行目标仓约定的 `cargo fmt`、`cargo clippy`、`cargo test` 或更严格脚本，并执行当前 boundary 绑定的 suite / TC / EV。
23. 设计偏离时如何同步文档。
   回答：按 Step 10 的 change 控制回写对应 `03/04/05/06`，必要时回到 `00~03` 重新评估 P0 范围。未回写前不得提交实现仓 commit。
24. 证据如何附到提交、PR 或交付说明中。
   回答：commit body 不塞入完整日志，只写证据摘要和 artifact / EV 索引位置；PR 或交付说明中列出 run_id、suite、case_id、evidence_id、config_profile 和 result。
25. 哪些情况下必须拆分提交，哪些情况下允许合并提交。
   回答：多个无关 commit boundary 必须拆分；单个 boundary 内协作子功能允许合并为一笔，并在 body 分组。若单批实现超过 300 行，应拆代码批次；若仍属于同一 boundary，最终整理为一笔合格 commit。
26. 当前实施计划中应给出的合格 commit 示例和反例是什么。
   回答：本步在 7.8 和 7.9 给出实现仓 commit 正例和反例；正式文档 §11 应保留这些示例的精简版本。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 6 | 已有 commit boundary，但没有完整 message 规则 | 实施者可能边界正确但提交格式不合格 |
| Step 7 | 已有门禁矩阵，但未说明证据如何进入提交 / PR | 交付审查时难以定位 EV |
| Step 10 | 已有暂停和回写规则，但未变成提交前纪律 | 设计偏离可能在 commit 时被忽略 |
| 当前 design 仓规则 | 允许中文 commit | 如果误传给实现仓，会违反实现仓英文 commit 规则 |
| 实现仓源码规则 | 已确定英文源码口径 | 需要在 07 中显式提醒 rustdoc、注释和测试名也用英文 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 提交语言 | 只知道 design 仓可中文 | 明确实现仓必须英文，design 中文只是例外 | 防止跨仓规则污染 |
| 提交标题 | 只有提交边界 | 实现仓固定 `type(scope): subject` | 提高 git log 可读性 |
| 提交粒度 | Step 6 定义边界 | Step 11 要求一笔提交对应一个边界 | 让 review、回退和证据审查对齐 |
| body 内容 | 未约束 | summary + 子功能分组 + 文件名 + 改动量 | reviewer 不看 diff 也能理解提交 |
| 证据交付 | 分散在测试和验收文档 | 提交 / PR / 交付说明都要引用 EV 索引 | 保证可审计 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实现仓沿用 design 仓中文 commit | 写作方便 | 与实现仓英文代码和跨团队 review 不一致 | 不采用 |
| 实现仓全部使用英文 commit 和源码注释 | 跨仓一致，利于实现审查 | 对中文设计读者不如中文直接 | 采用 |
| 按文件或 crate 拆 commit | 操作简单 | 破坏功能边界，review 和回退价值低 | 不采用 |
| 一笔提交对应一个 commit boundary | 对齐实施计划、门禁和回退 | 需要整理本地提交历史 | 采用 |
| 用多次 `git commit -m` 拼接 message | 快速 | 容易产生空行、`\n` 和 footer 错误 | 不采用 |
| 用 message 文件提交或 amend | 格式可控 | 多一步操作 | 采用 |

### 7. 结构化中间产物

#### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | 阅读实施计划书写规范 §4.9 和目标仓历史提交 | 提交前自检 |
| 提交粒度 | 一笔提交对应一个 Step 6 commit boundary | 对照 commit-01-a ~ commit-06-a |
| 提交时机 | 代码、测试、证据、文档回写均完成后提交 | 对照 Step 7 / Step 10 |
| 提交信息 | 英文 title / summary / body，footer 固定 | review commit message |

#### 7.2 提交 message 结构

| 部分 | 实现仓约束 | 说明 |
|---|---|---|
| title | `<type>(<scope>): <subject>` | 全英文，subject 简短描述边界 |
| summary | 一句英文概括 commit boundary | body 第一段，末尾可用冒号 |
| body groups | 按子功能分组 | 分组名解释文件为何属于同一边界 |
| file bullets | 文件名 + 改动量 + 英文说明 | 只写文件名，不写完整路径 |
| footer | `Co-Authored-By: Codex <noreply@openai.com>` | footer 前保留真实空行 |

#### 7.3 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat` / `fix` / `refactor` / `test` / `chore` / `ci` / `docs` / `perf` | 实现仓常用 `feat`、`fix`、`test`、`chore` |
| scope | `workspace` / `contract` / `config` / `draft` / `command` / `publish` / `lifecycle` / `query` / `trace` / `job` / `snapshot` / `relay` / `e2e` / `evidence` | scope 必须能映射 Step 6 边界 |

#### 7.4 Commit Boundary 到 scope 映射

| 提交边界 | 推荐 title | 说明 |
|---|---|---|
| commit-01-a | `chore(workspace): initialize l0 core workspace skeleton` | workspace、crate skeleton、test harness |
| commit-01-b | `feat(contract): add contract DTOs config and fake ports` | DTO、config fixture、fake ports |
| commit-02-a | `feat(draft): add draft domain policy and unit coverage` | draft aggregate、scope、boundary policy |
| commit-02-b | `feat(command): add draft command write path` | create/update、idempotency、repo/audit/outbox |
| commit-03-a | `feat(publish): add review and publish baseline flow` | submit/review/publish/gate fail |
| commit-03-b | `feat(lifecycle): add lifecycle guard and event contracts` | lifecycle terminal guard、events |
| commit-04-a | `feat(query): add read model and stale projection queries` | get/list query、stale projection |
| commit-04-b | `feat(trace): add trace and consumer package views` | trace、compatibility trace、package/sample |
| commit-05-a | `feat(job): add validation and rebuild job runner` | validate/rebuild/recalculate jobs |
| commit-05-b | `feat(relay): add snapshot fact and relay boundary` | snapshot、fact、outbox relay |
| commit-06-a | `test(e2e): add release gate evidence and redline checks` | E2E、evidence、redline、handoff |

#### 7.5 语言边界

| 仓类型 | commit message | 注释 / rustdoc / 测试名 | 说明 |
|---|---|---|---|
| 当前 design 文档仓 | `type` 英文，subject / body 中文，footer 固定 | 设计说明和伪代码注释可中文 | 仅 `quantalithos-design` |
| 其他实现代码仓 | commit message 必须英文，标题固定为 `type(scope): subject` | 源码标识符、rustdoc、普通注释、测试名默认英文 | L0-core 实施使用此规则 |

#### 7.6 Commit body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名 | `command_services.rs` | `crates/l0-core/src/command_services.rs` |
| 改动量 | 标注大致变化 | `(+34)` / `(~+120/-8)` | `(many lines)` |
| 分组 | 按子功能分组 | `Draft command vertical slice:` | `Files:` |
| 换行 | 使用真实换行 | title、body、footer 分段 | `subject\n\nbody` |
| 空行 | bullet 间不插空行 | 同组连续 bullet | 每条 bullet 后空一行 |

#### 7.7 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name` / `user.email` 正确 |
| diff 范围 | 只覆盖一个 commit boundary |
| 门禁结果 | 当前 boundary 的 fmt / lint / test / AC / EV 通过 |
| 文档同步 | 设计偏离已按 Step 10 回写 |
| 源码语言 | 实现仓源码、rustdoc、注释、测试名为英文 |
| title 格式 | `type(scope): subject`，英文，scope 不省略 |
| body 格式 | summary + 子功能分组 + 文件名 + 改动量 |
| 空行格式 | 标题后空一行，footer 前空一行，bullet 间不插空行 |
| 换行格式 | 无字面量 `\n` |
| 证据记录 | PR / 交付说明能定位 EV 或 artifact |

#### 7.8 Commit 正例

```text
feat(command): add draft command write path

Draft command writes, idempotency, audit, and outbox persistence for commit-02-b:

Command service and idempotency:
- command_services.rs (~+210/-12): add create and update draft command handlers with idempotency checks.
- idempotency_store.rs (+96): add reservation and payload mismatch handling for draft writes.

Persistence and evidence:
- file_repository.rs (~+180/-20): persist draft state with audit and outbox records in one transaction boundary.
- command_services_tests.rs (+240): cover create, update, idempotency replay, and transaction failure cases.

Co-Authored-By: Codex <noreply@openai.com>
```

#### 7.9 Commit 反例

```text
feat: 添加草稿写路径
Draft command write path:\n\n- crates/l0-core/src/command_services.rs (+210): add handlers.

- file_repository.rs (+180): add persistence.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：

- 实现仓标题不是英文 `type(scope): subject`。
- body 出现字面量 `\n`。
- 文件条目写了完整路径。
- 同组 bullet 之间插空行。
- footer 前没有真实空行。
- 没有按子功能分组说明为什么这些文件属于同一 commit boundary。

#### 7.10 评审与交付纪律表

| 类型 | 要求 | 检查方式 |
|---|---|---|
| 评审范围 | reviewer 先确认本提交对应哪个 commit boundary | 对照 Step 6 |
| 代码评审 | 检查对象、接口、状态、事务、错误和配置是否符合 03 / 04 | diff review |
| 测试评审 | 检查 Step 7 对应 suite / TC / EV 是否通过 | test report / EV |
| 变更评审 | 检查设计偏离是否按 Step 10 回写 | 上游文档 diff |
| 证据交付 | PR / handoff note 列出 run_id、suite、case_id、evidence_id、config_profile、result | evidence index |
| 提交格式 | 检查 title、body、footer、空行、文件条目和改动量 | commit message review |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §11。

````md
## 11. 提交、评审与交付纪律

> 校准来源：
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“提交纪律表”“Commit Boundary 到 scope 映射”“语言边界”“提交前检查清单”“Commit 正例 / 反例”和“评审与交付纪律表”小节，了解实现仓提交、评审和交付证据如何约束。

L0-core 正式实现发生在其他实现代码仓，不继承当前 `quantalithos-design` 文档仓的中文 commit 例外。实现仓 commit message 必须使用英文，标题固定为 `type(scope): subject`；源码标识符、rustdoc、普通注释和测试名默认使用英文。

每笔提交必须对应 §6 中一个 commit boundary。同一 boundary 内多个协作子功能仍合成一笔提交，并在 body 中按子功能分组；不得按文件、repository、service、route 或子模块拆成多笔。

提交前必须检查 `git config user.name` 和 `git config user.email`，确认分别为 `quantalithos-labs` 与 `quantalithos.ai@gmail.com`。提交前还必须确认 diff 范围、fmt / lint / test / AC / EV、设计回写、源码语言、message 格式和证据索引均符合本章规则。

固定 footer 为：

```text
Co-Authored-By: Codex <noreply@openai.com>
```

footer 前必须保留真实空行。需要精确控制格式时，应把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。
````

### 9. 待确认事项

- 目标实现仓若已有更严格 type / scope 列表，应在实施前叠加到本规则，但不能放宽英文 commit、固定标题、boundary 粒度和 footer 空行要求。
- 目标实现仓实际 CI 命令和 artifact 物理路径仍需实施者在开工前记录到 handoff note 或 PR 模板。
- 当前建议 L0-core 实现仓默认只保留 `Co-Authored-By: Codex <noreply@openai.com>` 一个固定 footer。原因是本轮实施计划要给其他 agent 一个稳定格式，避免多模型注脚造成提交规范漂移。

### 10. 进入下一步条件

- 提交纪律、message 结构、type / scope、语言边界和 footer 规则已明确。
- 一笔提交对应一个 Step 6 commit boundary 的规则已明确。
- Commit 正例和反例已给出。
- 评审与交付证据规则已明确。
- 可以进入 Step 12，继续定义实施完成判定。
