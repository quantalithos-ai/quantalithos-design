# L0-sdk 07 实施计划 Step 11: 提交、评审与交付纪律

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 11 中间产物。
> 本步定义 L0-sdk 实现过程中必须遵守的 git 配置、commit message、代码语言、提交时机、评审纪律和 artifact / report 交付纪律。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义提交、评审与交付纪律 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §11 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/实施计划书写规范.md` | 已确认 | 提取 commit message、语言边界、artifact / report 交付规则 |
| `standards/document/实施计划讨论流程_SOP.md` | 已确认 | 提取 Step 11 的输入、输出、问题和约束 |
| `standards/coding/rust.md` | 已确认 | 约束实现仓源码标识符、rustdoc、普通注释、测试名必须英文 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 13 个 commit boundary、提交时机和提交前门禁 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承每阶段测试、验收、artifact、report 和失败处理 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承暂停、回退、变更和恢复条件 |
| `/home/aris/Projects/quantalithos-sdk` | 已检查 | 当前目标仓无有效历史提交,首批提交必须直接按本 Step 执行 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 提交前必须检查哪些 git 配置 | 目标实现仓必须使用项目级 `git config user.name quantalithos-labs` 和 `git config user.email quantalithos.ai@gmail.com`。不得依赖全局配置。 |
| 2. 提交 message 应参考哪些规范和历史提交 | 参考 `standards/document/实施计划书写规范.md`、本 Step 和 Step 6 commit boundary。目标 SDK 仓当前无有效历史提交,首批提交直接按本 Step 执行。 |
| 3. 当前仓是 `quantalithos-design` 设计文档仓,还是其他实现代码仓 | 当前正在写文档的仓是 `quantalithos-design`;实际 L0-sdk 实现仓是 `/home/aris/Projects/quantalithos-sdk`,属于实现代码仓。 |
| 4. 如果提交发生在当前 design 文档仓,如何保证格式 | design 仓允许中文 subject / body,`type` 使用英文,footer 固定按 design 仓规则。这个规则不得带入 SDK 实现仓。 |
| 5. 如果提交发生在其他实现仓,如何保证 commit message 必须使用英文 | SDK 实现仓 commit title、subject、body、group title、file summary 均必须英文。源码标识符、rustdoc、普通注释和测试名默认英文。 |
| 6. 如果提交发生在其他实现仓,如何保证标题格式固定 | 标题固定为 `type(scope): subject`;scope 不得省略。目标仓若后续新增更严格规则,只能叠加,不能放宽英文 commit 和固定标题要求。 |
| 7. 当前项目允许哪些 type 和 scope | type 使用 `feat` / `fix` / `refactor` / `test` / `docs` / `chore` / `ci` / `perf` / `style`;scope 按 Step 6 boundary 功能域裁剪为 `bootstrap`、`config`、`semantic`、`boundary`、`security`、`candidate`、`packages`、`docs`、`smoke`、`compat`、`reports`、`gate`。 |
| 8. 每笔提交应对应哪个 §6 commit boundary | 一笔提交对应一个 Step 6 commit boundary。不得把 `commit-03-a` 和 `commit-03-b` 合并,也不得把一个 boundary 按 crate、package、文件或测试拆成多笔。 |
| 9. 同一 boundary 内多个协作子功能如何处理 | 仍然保持一笔提交,body 按子功能分组。分组要解释这些文件为什么属于同一条可验证纵切。 |
| 10. commit body 第一句如何概括 | 第一段用一句英文说明本 commit boundary,并尽量带上 `commit-xx-y` 或 PH 编号。 |
| 11. commit body 如何分组 | 按子功能分组,例如 `Workspace and path dependencies:`、`Boundary clients and fake adapters:`、`Tests and evidence:`。不得只写 `Files:` 平铺。 |
| 12. body 文件条目是否只写文件名 | 是。只写文件名,禁止写完整路径。 |
| 13. body 文件条目是否带改动量 | 必须带大致改动量,例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。 |
| 14. body 是否禁止字面量 `\n` | 禁止。必须使用真实换行。 |
| 15. bullet 之间是否禁止插空行 | 禁止。分组之间可空行,同一组 bullet 之间不插空行。 |
| 16. 当前项目是否要求固定 footer | 默认保留固定 footer: `Co-Authored-By: Codex <noreply@openai.com>`。 |
| 17. `Co-Authored-By` 前是否必须有真实空行 | 必须。footer 前保留一个真实空行。 |
| 18. 是否允许多模型 `Co-Authored-By` | 本计划默认只保留一个固定 footer。除非后续项目规则明确变更,不得叠加多个 AI footer。 |
| 19. 如何精确控制格式 | 把完整 message 写入文件,使用 `git commit -F <file>` 或 `git commit --amend -F <file>`。 |
| 20. 实现仓源码语言规则是什么 | 源码标识符、rustdoc、普通注释、测试名、package metadata 中的实现说明默认英文。设计讨论和 design 仓文档可中文。 |
| 21. 哪些 commit 时机允许 / 禁止 | boundary 代码、测试、证据、格式和设计同步完成后允许 commit;未编译、未测试、缺证据、混入无关改动、设计偏离未回写时禁止 commit。 |
| 22. 代码规范如何检查 | 按 boundary 执行 `cargo fmt`、lint / check、`cargo test` 和涉及 Python / TypeScript 的 package build / smoke 命令;命令未固定时先按 Step 9 Spike 处理。 |
| 23. 设计偏离如何同步 | 暂停当前 boundary,回写 `00~06` 或对应中间产物,再恢复实现。不得只改代码。 |
| 24. 证据如何附到提交、PR 或交付说明 | 只引用 `reports/runs/<run_id>`、`reports/acceptance` 和必要 artifact index,不粘贴完整原始日志。 |
| 25. 哪些情况下拆分或合并提交 | 不同 commit boundary 必须拆分;同一 boundary 内强相关的 DTO、domain、service、adapter、test、evidence 按一笔提交并在 body 分组。 |
| 26. 当前计划应给出哪些示例 | 给出 SDK 实现仓英文 commit 正例和反例。 |
| 27. 交付说明是否只引用 reports | 是。handoff 引用 report 和 artifact index,不复制完整 stdout / stderr。 |
| 28. raw artifact 是否需要对应 report | 需要。机器原始证据进入 `artifacts/test/<run_id>`,人读摘要进入 `reports/runs/<run_id>`。 |
| 29. acceptance handoff 是否需要审查 | 需要。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 必须由人或 Agent 审查补充。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| design 仓和实现仓语言规则容易混淆 | 本仓文档提交可中文,SDK 实现仓必须英文 | 实现仓出现中文 commit、中文 rustdoc 或中文测试名 | 明确语言边界 |
| 目标 SDK 仓无有效历史提交 | `git log` 显示当前分支尚无提交 | 实施者无法参考历史 | 首批提交直接按本 Step 执行 |
| commit boundary 已定义但 message 规则尚未落到 SDK | Step 6 有 13 个 boundary | 实施者可能按文件提交或格式不合规 | 输出 commit discipline |
| footer 和空行格式易错 | 历史实践中曾出现换行问题 | 提交历史不合格 | 要求 `git commit -F` 控格式 |
| 证据交付容易直接粘日志 | 原始 artifact 可能很大 | review 难读且可能泄漏敏感信息 | 只引用 reports 和索引 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| git 配置 | 只在前置条件中提到 | 提交前必须检查项目级 user.name / user.email | 避免身份错误 |
| commit 语言 | 容易继承 design 仓中文规则 | SDK 实现仓强制英文 | 保持代码仓协作一致 |
| commit 粒度 | Step 6 定义 boundary | Step 11 定义何时能提交、如何写 message | 可执行 |
| footer | 有通用规范 | 写入固定 footer 和空行要求 | 避免格式不合格 |
| 交付证据 | Step 7 定义 artifact / report | Step 11 定义如何引用和审查 | 方便 review 与验收 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| SDK 实现仓沿用 design 仓中文 commit | 本地沟通顺畅 | 与实现仓英文源码规则冲突,不利于跨仓协作 | 不采用 |
| SDK 实现仓 commit 和源码全部使用英文 | 与 Rust / Python / TypeScript 包、测试和未来公开协作一致 | 中文讨论需留在设计文档和 handoff 外层 | 采用 |
| 按文件或 crate 拆提交 | diff 小 | 无法表达可验证纵切,review 失真 | 不采用 |
| 一笔提交对应一个 §6 commit boundary | 能独立 review、验证和回退 | body 需要按子功能分组 | 采用 |
| 直接用多次 `git commit -m` 拼 body | 快 | 容易出现字面量 `\n` 或空行错误 | 不采用 |
| 使用完整 message 文件执行 `git commit -F` | 格式稳定 | 多一步准备 | 采用 |
| 在 handoff 粘贴完整日志 | 信息全 | 冗长且可能泄漏 | 不采用 |
| 只引用 report 和 artifact index | 可读、可审计 | reviewer 需要按链接 drill down | 采用 |

---

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-sdk` | `pwd` / `git rev-parse --show-toplevel` |
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | 遵循本 Step 和 `standards/document/实施计划书写规范.md` | 提交前自检 |
| 提交粒度 | 一笔提交对应一个 §6 commit boundary | 对照 Step 6 boundary |
| 提交时机 | boundary 代码、测试、证据、格式和设计同步完成后 | 对照阶段门禁 |
| 提交方式 | 需要精确控制格式时使用 `git commit -F` 或 `git commit --amend -F` | 检查 commit message |
| footer | `Co-Authored-By: Codex <noreply@openai.com>` | footer 前有真实空行 |

### 7.2 语言边界表

| 仓类型 | commit message | 源码标识符 / rustdoc / 普通注释 / 测试名 | 说明 |
|---|---|---|---|
| `quantalithos-design` | `type` 英文,subject / body 可中文 | 设计说明可中文 | 仅适用于设计文档仓 |
| `/home/aris/Projects/quantalithos-sdk` | 必须英文,标题固定 `type(scope): subject` | 必须默认英文 | L0-sdk 实现仓不得继承 design 仓中文提交口径 |
| 未来其他实现仓 | 必须英文,标题固定 `type(scope): subject` | 必须默认英文 | 目标仓更严格规则只能叠加,不能放宽 |

### 7.3 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat` / `fix` / `refactor` / `test` / `docs` / `chore` / `ci` / `perf` / `style` | 实现仓标题必须使用英文 type |
| scope | `bootstrap` / `config` / `semantic` / `boundary` / `security` / `candidate` / `packages` / `docs` / `smoke` / `compat` / `reports` / `gate` | scope 应与 commit boundary 的功能域一致 |
| subject | 英文短句 | 直接描述本 boundary 的功能边界 |
| body | 英文 | 先 summary,再按子功能分组 |
| footer | 固定 footer | `Co-Authored-By: Codex <noreply@openai.com>` |

### 7.4 Commit message 结构

```text
feat(scope): short subject

One-sentence summary for this commit boundary:

Sub-feature group A:
- file_a.rs (+12): concise functional summary.
- file_b.rs (~+80/-10): concise functional summary.

Sub-feature group B:
- file_c.rs (+34): concise functional summary.
- file_d.rs (+9): concise functional summary.

Co-Authored-By: Codex <noreply@openai.com>
```

规则:

- title 后必须有真实空行。
- body 第一段必须说明本 commit boundary。
- body 按子功能分组,不按文件类型平铺。
- 文件条目只写文件名,不写完整路径。
- 文件条目必须标注大致改动量,例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。
- body 中不得出现字面量 `\n`。
- bullet 之间不得插空行。
- footer 前必须有真实空行。
- 默认只保留一个固定 footer。

### 7.5 L0-sdk commit boundary 到 scope 建议

| commit boundary | 推荐 scope | 提交主题方向 |
|---|---|---|
| `commit-01-a` | `bootstrap` | workspace、crate skeleton、core / bus path dependency |
| `commit-01-b` | `config` | package skeleton、config fixtures、scripts、artifact / report roots |
| `commit-02-a` | `semantic` | contracts DTO、semantic baseline、concept map |
| `commit-02-b` | `semantic` | derived view、language view、freshness query、core contract changed consumer；只读 semantic baseline / concept map |
| `commit-03-a` | `boundary` | service / event boundary、client view consumers、Rust client facade、fake adapters |
| `commit-03-b` | `security` | error mapping、trace propagation、redaction、credential guard |
| `commit-04-a` | `candidate` | package candidate protocol、state machine、stable gate |
| `commit-04-b` | `packages` | local generator / builder、artifact metadata、three-language package layout |
| `commit-05-a` | `docs` | quickstart、docs examples、docs runner |
| `commit-05-b` | `smoke` | cross-language smoke、validation evidence、redaction evidence |
| `commit-06-a` | `compat` | compatibility decision、deprecated lifecycle、migration ref |
| `commit-07-a` | `reports` | projection rebuild、report generator、evidence index |
| `commit-07-b` | `gate` | acceptance handoff、VETO checklist、risk acceptance、final checks |

### 7.6 Commit 正例

```text
feat(boundary): add service and event boundary clients

Service and event boundary client flow for commit-03-a:

Boundary views and guards:
- boundary_view.rs (~+145/-8): add service and event client views with support state checks.
- boundary_guard.rs (+82): reject unsupported capabilities, missing fake markers and forbidden truth writes.

Client facade and fake adapters:
- service_client.rs (+118): add ref-only service invocation facade with diagnostic refs.
- event_client.rs (+104): add bus event publish facade with payload refs and digest checks.
- fake_boundary.rs (+96): add fake formal API and bus boundary adapters for P0 validation.

Tests and fixtures:
- boundary_tests.rs (+210): cover supported, fake-only, unsupported and missing marker cases.
- event_client_tests.rs (+132): cover event mapping, pending state and no-write guarantees.

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.7 Commit 反例

```text
feat(boundary): add clients
Boundary clients:\n\n- crates/client/src/service_client.rs (+118): add service client.

- event_client.rs (+104): add event client.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- title 后没有真实空行。
- body 中出现字面量 `\n`。
- 文件条目写完整路径。
- bullet 之间插入空行。
- 没有按子功能分组。
- footer 前没有真实空行。
- subject 过泛,没有体现 commit boundary。

### 7.8 提交时机表

| 场景 | 是否允许 commit | 原因 |
|---|---|---|
| 当前 boundary 代码完成、fmt / test / gate 通过、证据已生成 | 允许 | 满足可验证提交 |
| 当前 boundary 只完成 domain,service / adapter / tests 未完成 | 不允许 | 不是完整可验证纵切 |
| 当前 boundary 混入下一阶段功能 | 不允许 | 破坏 review 和回退 |
| design 偏离未回写 | 不允许 | 实现与文档分叉 |
| redaction / path / no-latest 检查未跑 | 不允许 | 证据红线未确认 |
| S2 / S3 已风险接受且不影响 P0 主链 | 允许 | 必须有 owner、deadline 和 retest plan |
| S0 / S1 / VETO 未关闭 | 不允许 | 不得风险接受 |

### 7.9 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name` 和 `user.email` 为项目级配置 |
| 当前目录 | 位于 `/home/aris/Projects/quantalithos-sdk` |
| diff 范围 | 只覆盖一个 §6 commit boundary |
| 代码规范 | `cargo fmt`、lint / check、相关 tests 已执行或有阻断说明 |
| 多语言检查 | 相关 boundary 涉及 Python / TypeScript 时,对应 package build / smoke 命令通过 |
| 源码语言 | 标识符、rustdoc、普通注释和测试名未混入中文 |
| 设计同步 | 设计偏离已回写 `00~06` 或暂停 |
| 证据 | artifact、report、redaction、path、no-latest 检查有结果 |
| message | 英文 `type(scope): subject`,body 分组,文件名无路径,标注改动量 |
| footer | footer 前有真实空行,只保留固定 footer |
| 格式控制 | 复杂 message 使用 `git commit -F` |

### 7.10 评审纪律表

| 评审项 | 评审问题 | 不通过处理 |
|---|---|---|
| boundary | 是否只覆盖一个 commit boundary | 要求拆分或重做 |
| 可验证性 | 是否有阶段门禁和证据 | 要求补测试 / report |
| 设计一致性 | 是否与 `03` / `04` / `05` / `06` 一致 | 暂停并回写设计 |
| 安全红线 | 是否有 forbidden body / raw secret / credential value 泄漏 | 阻断,修复并重跑 redaction |
| 三语言一致性 | Rust / Python / TypeScript 是否保持概念、错误、trace、redaction 一致 | 要求补 smoke / semantic compare |
| candidate gate | `Stable` 是否由 passed + redacted + compatible 证据支撑 | 阻断,修复 gate |
| 证据链 | report 是否可回链 artifact | 要求补 evidence index |
| commit message | 是否符合英文、格式、footer 和分组规则 | amend message 后再合入 |

### 7.11 artifact / report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| artifact root | `artifacts/test/<run_id>` 存在且无 `<project>` 层级 |
| run metadata | metadata 记录 commit、dependency、profile、run_id |
| suite report | 相关 suite 有 raw report、stdout / stderr 或 failure reason |
| report root | `reports/runs/<run_id>` 已生成 |
| evidence index | report 能回链 raw artifacts |
| gate results | gate summary 说明执行命令、结果和失败原因 |
| redaction check | artifact 和 report 均通过 forbidden body / raw secret 检查 |
| acceptance handoff | `reports/acceptance` 中 handoff、veto checklist、risk acceptance、open issues 已审查 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §11。

````markdown
## 11. 提交、评审与交付纪律

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“提交纪律表”“语言边界表”“Type / Scope 约束”“Commit message 结构”“L0-sdk commit boundary 到 scope 建议”“提交前检查清单”“评审纪律表”和“artifact / report 交付检查表”小节,了解实现仓提交和交付证据的完整约束。

L0-sdk 实现仓位于 `/home/aris/Projects/quantalithos-sdk`,属于实现代码仓。实现仓 commit message 必须英文,标题固定为 `type(scope): subject`;源码标识符、rustdoc、普通注释和测试名默认英文。一笔提交对应一个 §6 commit boundary。

正式内容从 `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` §7.1~§7.11 摘录。
````

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| L0-sdk 实现仓是否允许中文 commit | 不允许 | 影响跨仓协作和规范一致性 | 使用英文 commit |
| 是否允许省略 scope | 不允许 | 影响 boundary 追踪 | 固定 `type(scope): subject` |
| 是否允许按文件拆提交 | 不允许 | 影响 review 和回退 | 一笔提交对应一个 §6 boundary |
| 目标仓没有历史提交时如何处理 | 不阻塞 | 首批提交无历史可参考 | 直接按本 Step 执行 |
| 是否允许粘贴完整日志到 handoff | 不建议 | 冗长且可能泄漏 | 引用 report 和 artifact index |

建议方案: 接受当前提交、评审与交付纪律。原因是它与 Step 6 的 commit boundary、Step 7 的证据门禁、Rust 编码规范和实现仓英文协作规则一致。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 提交纪律、message 结构、Type / Scope 和 footer 已明确 | 已满足 |
| design 仓与实现仓语言边界已明确 | 已满足 |
| commit boundary 到 scope 的映射已明确 | 已满足 |
| 正反例已给出 | 已满足 |
| 提交前检查、评审纪律和交付检查已明确 | 已满足 |

结论: 可以进入 Step 12,继续定义实施完成判定。
