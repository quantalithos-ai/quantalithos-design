# L1-conversation 07 实施计划 Step 11: 提交、评审与交付纪律

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §11 提交、评审与交付纪律
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义提交、评审与交付纪律 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |

本步定义 L1-conversation 交给实现 agent 后，在 `/home/aris/Projects/quantalithos-conversation` 中如何提交、评审和交付证据。本步不创建正式 `07-实施计划.md`，不替代 Step 6 的提交边界，也不重写 Step 7 的测试门禁。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/实施计划书写规范.md` | 已确认 | 继承提交时机、commit message、footer、语言边界、body 分组和自检清单规则 |
| `standards/document/实施计划讨论流程_SOP.md` | 已确认 | 继承 Step 11 必答问题、期望产出和执行约束 |
| 近期 `quantalithos-design` 提交历史 | 已读取 | 作为 design 仓中文 subject / body、英文 type、固定 footer 的历史样式参考 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 commit-01-a 到 commit-08-b、提交前检查清单和一笔提交对应一个 boundary 的规则 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 gate、artifact、report、EV 和 acceptance handoff 交付规则 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承设计偏离、门禁失败和证据缺失时的暂停 / 回写规则 |
| 本地 git 配置 | 已检查 | `user.name=quantalithos-labs`，`user.email=quantalithos.ai@gmail.com` |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 提交前必须检查哪些 git 配置 | 必须检查 `git config user.name` 为 `quantalithos-labs`，`git config user.email` 为 `quantalithos.ai@gmail.com`。 |
| 2. 提交 message 应参考哪些规范和历史提交 | 参考 `实施计划书写规范.md` §4.9、Step 11 SOP、目标仓历史提交；若目标实现仓无历史提交，则以本 Step 为准。 |
| 3. 当前仓是设计仓还是实现仓 | 当前 `/home/aris/Projects/quantalithos-design` 是 design 文档仓；未来实现目录 `/home/aris/Projects/quantalithos-conversation` 是实现代码仓。 |
| 4. design 文档仓如何提交 | `type` 使用英文，subject / body 使用中文，footer 固定为 `Co-Authored-By: Codex <noreply@openai.com>`。 |
| 5. 实现仓如何提交 | commit message 必须全英文，标题固定为 `type(scope): subject`，目标仓更严格规则只能叠加，不能放宽英文要求。 |
| 6. 实现仓源码语言如何约束 | 源码标识符、rustdoc、普通注释和测试名默认英文；中文只允许作为明确业务数据、协议样例、国际化资源或 fixture。 |
| 7. 当前项目允许哪些 type / scope | type 使用 `feat/fix/refactor/docs/test/chore/perf/ci/style`；实现仓 scope 使用 §7.3 的 conversation 范围裁剪，且 scope 不得省略。 |
| 8. 每笔提交对应哪个 §6 commit boundary | 每笔实现仓提交必须对应 Step 6 的一个 `commit-xx-*` boundary，不得把多个 boundary 混成一笔，也不得把一个 boundary 按文件拆成多笔。 |
| 9. 同一 boundary 内多个协作子功能如何表达 | 仍然保留为一笔提交，body 按子功能分组，例如 `Domain contracts:`、`Application flow:`、`Evidence and tests:`。 |
| 10. body 第一段如何写 | 用一句英文概括本 commit boundary 的功能边界，末尾可带 PH / commit boundary 标识。 |
| 11. body 文件条目如何写 | 每条只写文件名，不写完整路径，带大致改动量，例如 `commands.rs (+42): add append fact command DTOs.`。 |
| 12. body 换行和空行如何约束 | 使用真实换行；禁止字面量 `\n`；标题后空一行；footer 前空一行；bullet 之间不插空行。 |
| 13. 固定 footer 是什么 | 默认保留且只保留 `Co-Authored-By: Codex <noreply@openai.com>`；如项目另有多模型 footer 决策，必须先回写规范。 |
| 14. 何时使用 `git commit -F` | 需要精确控制格式时，把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。 |
| 15. 哪些时机允许 commit | 当前 boundary diff 清晰、开工前复核通过、fmt/check/test/gate 通过、artifact/report 有落点、message 合规时允许 commit。 |
| 16. 哪些时机禁止 commit | WIP、门禁未通过、设计冲突未回写、多个 boundary 混杂、只为保存进度、body 无分组、footer 格式错误时禁止 commit。 |
| 17. 设计偏离如何同步 | 按 Step 10 暂停当前 boundary，回写 design repo 并提供新 design commit；实现仓不得临时补设计继续提交。 |
| 18. 证据如何交付 | commit / handoff 只引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`，不粘贴完整原始日志。 |
| 19. raw artifact 是否需要 report | 是。raw artifact 必须有对应 human-readable report，PH-08 必须有 evidence index、gate results、redaction check 和 acceptance files。 |
| 20. handoff 和 veto 是否需要审查 | `reports/acceptance/handoff.md` 与 `veto-checklist.md` 必须由人或 Agent 审查补充后才能作为验收交接材料。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| design 仓和实现仓提交语言容易混淆 | 当前 design 仓近期提交是中文 subject / body，但实现仓必须英文 | 实现 agent 误用中文 commit 或中文 rustdoc | 本步明确中文 commit 仅适用于 `quantalithos-design` |
| 提交边界与 body 分组容易脱节 | Step 6 有 boundary，但 commit body 可能平铺文件 | reviewer 看不出为什么属于同一笔提交 | 本步规定一笔 boundary 一笔提交，body 按协作子功能分组 |
| evidence 容易只在日志中出现 | gate 输出和 raw artifact 可能未转 report | 验收无法审查 | 本步要求 artifact、report、acceptance 三类落点 |
| footer 容易格式漂移 | 多模型 footer 或缺少空行会破坏规范 | 提交历史不一致 | 本步固定 Codex footer，并要求 footer 前真实空行 |
| 门禁失败仍可能提交 WIP | 为保存进度提交半成品 | 后续回退和证据追溯困难 | 本步把 commit 时机绑定 Step 6 / Step 7 门禁 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| git 配置 | 只在规范中要求 | 本项目明确检查结果和通过条件 | 实现交接前可直接验证 |
| 语言边界 | standards 已定义 | 针对 design / conversation 实现仓明确裁剪 | 避免跨仓误用 |
| scope | standards 给通用示例 | 裁剪为 conversation 实现仓 scope | 提交标题更稳定 |
| commit body | 有通用模板 | 固定 boundary summary、子功能分组、文件名和改动量 | 提高 review 质量 |
| 交付材料 | Step 7 定义路径 | 本步定义提交 / handoff 如何引用证据 | 防止日志粘贴和路径漂移 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实现仓沿用 design 仓中文 commit | 书写方便 | 违背实现仓英文 commit 要求，也不利于代码 review | 不采用 |
| 实现仓 commit 全英文，design 仓保持中文 subject / body | 符合仓库角色差异 | 需要在交接中反复强调 | 采用 |
| 一个 boundary 内按文件拆多笔提交 | 局部 diff 小 | 破坏功能闭环，review 噪音高 | 不采用 |
| 一个 boundary 一笔提交，body 按子功能分组 | 功能边界清楚，便于 review 和回退 | 需要写好 commit body | 采用 |
| 交付说明粘贴完整测试日志 | 信息完整 | 噪声大，难审查，可能泄漏敏感内容 | 不采用 |
| 交付说明引用 report 和 EV | 可审查，可脱敏 | 需要 report generator 支撑 | 采用 |

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | 提交前阅读 `实施计划书写规范.md` §4.9、本 Step 和目标仓历史提交 | review commit message |
| 提交粒度 | 一笔提交对应一个 Step 6 `commit-xx-*` boundary | 对照 `07_implementation_plan_step_06_tasks_commits.md` |
| 提交时机 | boundary 完成、门禁通过、证据落点明确后提交 | 对照 gate output 和 reports |
| diff 范围 | 当前 diff 只覆盖一个 boundary，不混入无关修改 | `git diff --stat`、人工 review |
| 文档同步 | 设计偏离已按 Step 10 回写并获得新 design baseline | 查看 design commit hash |
| 源码语言 | 实现仓源码标识符、rustdoc、普通注释和测试名默认英文 | review / grep |
| footer | 固定 `Co-Authored-By: Codex <noreply@openai.com>`，footer 前真实空行 | 查看 commit message |

### 7.2 提交 message 结构

| 部分 | 实现仓约束 | design 仓例外 |
|---|---|---|
| title | 必须为 `type(scope): subject`，全英文 | `type` 英文，subject 可中文，例如 `docs: 补齐 L1-conversation 实施计划 Step 11` |
| summary | body 第一段一句英文，说明本 commit boundary | 可使用中文说明本批次文档边界 |
| body groups | 英文子功能分组，每组列文件名、改动量和说明 | 中文子功能分组和文件说明允许 |
| file entries | 只写文件名，不写完整路径，带 `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | 同左 |
| footer | 固定 `Co-Authored-By: Codex <noreply@openai.com>` | 同左 |
| format control | 使用真实换行；必要时 `git commit -F` / `git commit --amend -F` | 同左 |

### 7.3 Type / Scope 裁剪

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `perf` / `ci` / `style` | 实现仓和 design 仓都使用英文 type |
| scope | `scaffold` / `config` / `space` / `scope` / `fact` / `query` / `manifestation` / `consumer` / `trace` / `handoff` / `outbox` / `jobs` / `reports` / `release` | 适用于 `quantalithos-conversation` 实现仓；scope 必填 |
| design scope | 可省略或使用 `L1-conversation` / `standards` / `sdk` 等文档范围 | 仅适用于 `quantalithos-design` |

### 7.4 实现仓 commit 模板

```text
feat(space): add space and visibility domain contracts

Add the initial space and visibility domain boundary for commit-02-a:

Domain contracts:
- space.rs (+96): add conversation space state, identity, and lifecycle guards.
- visibility.rs (+74): add sealed visibility policy and negative cases.

Protocol fixtures:
- commands.rs (+58): add create space and participant scope command DTOs.
- space_fixtures.rs (+42): add valid and hidden scope fixtures for contract tests.

Tests:
- space_tests.rs (+115): cover creation, duplicate scope rejection, and sealed visibility.

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.5 当前 design 仓 commit 示例

```text
docs: 补齐 L1-conversation 实施计划 Step 11

本批次继续按实施计划 SOP 收稳 L1-conversation 的提交、评审与交付纪律，明确 design 仓中文提交例外、实现仓英文提交规则、commit boundary 粒度、footer、body 分组和证据交付检查。

实施计划校准:
- 07_implementation_plan_step_11_commit_review_delivery.md (+220): 新增 Step 11 中间产物，补齐提交纪律、message 结构、scope 裁剪、评审纪律和交付检查
- 07_implementation_plan_calibration_flow.md (+1/-1): 将 Step 11 状态更新为已确认

Co-Authored-By: Codex <noreply@openai.com>
```

### 7.6 Commit 反例

```text
feat: add code
Add space\n\n- crates/domain/src/space.rs (+96): add space.

- commands.rs (+58): add commands.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：

- 实现仓标题缺少 scope。
- subject 和 summary 太泛，不能对应 Step 6 boundary。
- body 出现字面量 `\n`。
- 文件条目写了完整路径。
- bullet 之间插入空行。
- 没有按子功能分组。
- `Co-Authored-By` 前没有真实空行。

### 7.7 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name=quantalithos-labs`，`user.email=quantalithos.ai@gmail.com` |
| boundary | 当前 diff 只覆盖一个 Step 6 `commit-xx-*` boundary |
| design baseline | 已读取当前 boundary 的正式章节和必读 `design-calibration` |
| design closure | 字段、DTO、状态、phase boundary、测试和验收已闭环 |
| format / lint | 当前 boundary 要求的 fmt / lint / check 已执行 |
| tests / gates | Step 7 对应 TC、suite、gate 已执行并记录 |
| evidence | `artifacts/test/<run_id>`、`reports/runs/<run_id>` 或 `reports/acceptance` 有落点 |
| redaction | raw secret、raw payload、forbidden body 未进入代码、artifact、report 或日志 |
| source language | 实现仓源码标识符、rustdoc、普通注释和测试名默认英文 |
| message title | 实现仓为 `type(scope): subject`，全英文 |
| message body | 一句 boundary summary，按子功能分组，文件名不带路径，带改动量 |
| message footer | footer 前有真实空行，且固定为 Codex footer |
| message file | 精确格式需求使用 `git commit -F` 或 `git commit --amend -F` |

### 7.8 评审纪律表

| 评审项 | 评审重点 | 不通过处理 |
|---|---|---|
| boundary review | 是否只覆盖一个 Step 6 boundary | 拆分或移出无关 diff |
| design trace review | 是否可回指 `03/05/06` 和 calibration | 暂停并回写 design repo |
| code review | 是否符合目录、命名、语言和模块边界 | 修复后重跑 fmt / check / tests |
| test review | 是否覆盖当前 boundary 的 direct TC、同组 TC 和 gate | 补测试或重跑 suite |
| evidence review | artifact / report / EV 是否 run-scoped 且无 `<project>` / `latest` | 修正路径并重生成 |
| redaction review | 是否泄漏 forbidden body、raw secret、source body 或 raw payload | 阻断并按 Step 10 恢复条件处理 |
| commit message review | 是否符合 title、body、footer、空行、文件条目规则 | amend message 后再交付 |

### 7.9 交付纪律表

| 交付物 | 交付规则 | 禁止事项 |
|---|---|---|
| commit hash | 每个 boundary 提供实现仓 commit hash | 引用浮动工作树 |
| design baseline | 交接时提供 design repo 完整 commit hash | 只说“最新设计” |
| gate artifact | 使用 `artifacts/test/<run_id>/<suite>` | 使用 `latest` 或 `<project>` 层级 |
| run report | 使用 `reports/runs/<run_id>` | 粘贴完整 stdout / stderr 代替 report |
| EV 页面 | `reports/runs/<run_id>/evidence/EV-CONV-*.md` 被 evidence index 引用 | EV 缺失仍宣称通过 |
| acceptance handoff | PH-08 生成并审查 `reports/acceptance/handoff.md` | 未审查脚本初稿直接送验 |
| veto checklist | PH-08 生成并审查 `reports/acceptance/veto-checklist.md` | VETO 未覆盖或被风险接受 |
| risk acceptance | 仅 S2/S3、P1/P2 非范围风险可写入 | VETO、S0/S1、redaction、P0 EV 缺失写入风险接受 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §11。正式文档生成时应从本文件摘录，不重新发明提交规范。

````markdown
## 11. 提交、评审与交付纪律

> 校准来源：
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“提交纪律表”“提交 message 结构”“Type / Scope 裁剪”“提交前检查清单”“评审纪律表”和“交付纪律表”小节，了解实现 agent 在 `/home/aris/Projects/quantalithos-conversation` 中如何提交、评审和交付证据。

正式 §11 应摘录：

1. §7.1 提交纪律表。
2. §7.2 提交 message 结构。
3. §7.3 Type / Scope 裁剪。
4. §7.4 实现仓 commit 模板。
5. §7.6 Commit 反例。
6. §7.7 提交前检查清单。
7. §7.8 评审纪律表。
8. §7.9 交付纪律表。

正式 §11 必须明确：`quantalithos-conversation` 是实现代码仓，commit message 必须全英文，标题固定为 `type(scope): subject`；源码标识符、rustdoc、普通注释和测试名默认英文。当前 design 文档仓的中文 subject / body 例外不得迁移到实现仓。
````

## 9. 本步待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 实现仓是否允许省略 scope | A: 允许；B: 不允许，固定 `type(scope): subject` | 推荐 B | scope 能把提交绑定到 `space/fact/query/consumer/jobs/release` 等边界，便于 review |
| 同一 boundary 内多个子功能是否拆多笔 | A: 拆多笔；B: 保留一笔并 body 分组 | 推荐 B | Step 6 已按可验证纵切定义 boundary，拆文件或子模块会破坏功能闭环 |
| 是否允许多模型 footer | A: 允许多模型 footer；B: 当前固定 Codex footer | 推荐 B | 本项目设计仓已固定 Codex footer，实现仓默认沿用，避免 footer 漂移 |

建议接受上述推荐。它们和 standards、Step 6、Step 7、Step 10 保持一致，能让实现 agent 在提交、评审和交付证据时不重新解释规范。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| git 用户配置检查已明确 | 已满足 |
| design 仓与实现仓语言边界已明确 | 已满足 |
| 实现仓 commit message、type / scope、body、footer 和格式控制已明确 | 已满足 |
| 一笔提交对应一个 Step 6 commit boundary 的规则已明确 | 已满足 |
| 评审纪律和交付纪律已覆盖 gate、artifact、report、EV、acceptance 和 veto | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 11 可以进入 Step 12。Step 12 应继续严格单 Step 执行，专门定义实施完成判定，不重写提交、评审与交付纪律。
