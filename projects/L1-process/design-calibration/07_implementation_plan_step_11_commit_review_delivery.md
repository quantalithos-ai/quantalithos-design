# L1-process 07 实施计划 Step 11: 提交、评审与交付纪律

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §11 提交、评审与交付纪律
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 提交、评审与交付纪律 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |

本步定义 L1-process 交给实现 agent 后,在 `/home/aris/Projects/quantalithos-process` 中如何提交、评审和交付证据。本步不替代 Step 6 的提交边界。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| git 配置 | 实现仓提交前检查 `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com`。 |
| 实现仓 commit language | 全英文 commit message,标题固定为 `type(scope): subject`。 |
| design 仓例外 | 当前 design 仓可使用英文 type + 中文 subject/body + Codex footer。该例外不得迁移到实现仓。 |
| 提交粒度 | 一笔实现仓提交对应 Step 6 一个 `commit-xx-*` boundary。 |
| body 如何组织 | 第一段一句 boundary summary;随后按 `Contracts:`、`Domain:`、`Application:`、`Infra and entries:`、`Tests and evidence:` 分组。 |
| footer | 固定 `Co-Authored-By: Codex <noreply@openai.com>`,footer 前必须有真实空行。 |
| 何时提交 | 当前 boundary diff 清晰、设计闭环通过、fmt/check/test/gate 通过、evidence 落点明确后提交。 |
| 何时禁止提交 | WIP、门禁未过、设计冲突未修、多个 boundary 混杂、无关用户改动被暂存、footer / message 不合规。 |

## 3. 结构化中间产物

### 3.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交粒度 | 一笔提交对应一个 Step 6 boundary | 对照 `07_implementation_plan_step_06_tasks_commits.md` |
| diff 范围 | 只覆盖当前 boundary,不混入用户已有修改 | `git status --short`;`git diff --stat` |
| 设计闭环 | 当前 boundary 字段、DTO、状态、phase、测试和验收已闭合 | 开工前复核矩阵 |
| 门禁 | fmt/check/test/gate/report 按 Step 7 执行 | command output / artifact |
| evidence | 使用 fixed run path | `artifacts/test/<run_id>`、`reports/runs/<run_id>` |
| source language | 标识符、rustdoc、普通注释、测试名默认英文 | review / grep |
| footer | 固定 Codex footer | commit message review |

### 3.2 Type / Scope 裁剪

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `perf` / `ci` / `style` | 实现仓和 design 仓都使用英文 type |
| process scope | `scaffold` / `config` / `shape` / `profile` / `instance` / `activity` / `waiting` / `recovery` / `rhythm` / `query` / `consumer` / `outbox` / `jobs` / `reports` / `release` | 适用于 `/home/aris/Projects/quantalithos-process`;scope 必填 |
| design scope | 可省略或使用 `L1-process` / `standards` 等文档范围 | 仅适用于 `quantalithos-design` |

### 3.3 实现仓 commit 模板

```text
feat(shape): add runtime shape and profile domain contracts

Add the runtime shape and profile foundation for commit-02-a.

Contracts:
- commands.rs (+84): add shape synchronization and profile adoption DTOs.
- fixtures.rs (+52): add valid and invalid shape/profile fixtures.

Domain:
- shape.rs (+118): add runtime shape state and adoption guards.
- profile.rs (+96): add profile tailoring and activation invariants.

Tests and evidence:
- contracts.rs (+72): cover command roundtrip and required fields.
- domain.rs (+128): cover legal transitions and retired shape rejection.

Co-Authored-By: Codex <noreply@openai.com>
```

### 3.4 Commit 反例

```text
feat: update process
Add code\n\n- crates/domain/src/shape.rs (+118): add stuff.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- 缺少 scope。
- subject 和 body 无法对应 Step 6 boundary。
- 出现字面量 `\n`。
- 文件条目写完整路径。
- 没有子功能分组。
- footer 前没有真实空行。

### 3.5 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `quantalithos-labs` / `quantalithos.ai@gmail.com` |
| boundary | 当前 diff 只覆盖一个 `commit-xx-*` |
| design baseline | 已读取当前 boundary 正式章节和 calibration |
| design closure | 字段、DTO、状态、phase、测试、验收闭合 |
| fmt / check | 当前 boundary 要求的格式和编译门禁已执行 |
| tests / gates | Step 7 对应 TC、suite 或 gate 已执行 |
| evidence | run-scoped artifact / report 有落点 |
| redaction | 无 raw secret、raw payload、forbidden body |
| message | 英文 `type(scope): subject`,body 分组,footer 合规 |

### 3.6 评审与交付纪律表

| 评审项 | 评审重点 | 不通过处理 |
|---|---|---|
| boundary review | 是否只覆盖一个 Step 6 boundary | 拆分或移出无关 diff |
| design trace review | 是否能回指 `03/05/06/07` 和 calibration | 暂停并回写 design |
| code review | 是否符合目录、命名、模块依赖和源码语言 | 修复并重跑门禁 |
| test review | 是否覆盖 direct TC、同组 TC 和 gate | 补测试或重跑 suite |
| evidence review | artifact/report/EV 是否 run-scoped 且无 `latest` | 修正路径并重生成 |
| redaction review | 是否泄漏 forbidden body、raw secret 或 raw payload | 阻断并按 Step 10 恢复 |
| delivery | 是否提供 implementation commit、design baseline、run id 和 report | 补齐后再交付 |

## 4. 回填草稿

```markdown
## 11. 提交、评审与交付纪律

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“提交纪律表”“Type / Scope 裁剪”“实现仓 commit 模板”“提交前检查清单”和“评审与交付纪律表”小节。

`quantalithos-process` 是实现代码仓,commit message 必须全英文,标题固定为 `type(scope): subject`。一笔提交必须对应 Step 6 的一个 commit boundary。
```

## 5. 进入下一步条件

- 提交、评审和交付纪律已固定。
- 实现仓与 design 仓提交语言边界已明确。
- 后续 Step 12 可以定义实施完成判定。
