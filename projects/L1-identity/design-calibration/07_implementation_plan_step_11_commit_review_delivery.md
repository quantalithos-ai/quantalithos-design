# Step 11. 定义提交、评审与交付纪律

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 回填章节: `07-实施计划.md` §11 提交、评审与交付纪律

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义提交、评审与交付纪律 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 3 阅读清单、Step 6 commit boundary、Step 7 gate、Step 10 pause / rollback / change control |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块先思考、再写入、再局部停审;全部模块完成后做提交纪律、评审纪律、交付纪律和跨 boundary 审计 |

## 2. 本步目标

本 Step 定义 L1-identity 实施过程中提交、评审、证据交付和设计修复后经验沉淀的纪律。

本 Step 只回答:

- 提交前必须检查哪些 git 配置和工作区状态。
- design 文档仓和实现代码仓分别使用什么 commit message 语言和格式。
- 一笔提交如何严格对应 Step 6 的一个 commit boundary。
- 同一 commit boundary 内多个协作子功能如何保留为一笔提交,并在 body 中分组。
- 每个 commit boundary 的 body 分组如何回指 Step 6 的子功能分组。
- 提交前应如何检查 diff、门禁、证据、文档同步、footer 和源码语言。
- 评审时优先审查哪些 bug、越界、证据缺失和可回退性风险。
- artifact / report 如何进入交付说明,不得粘贴完整日志或引用 `latest`。
- 设计 blocker 修复后如何检查是否需要总结新经验,以及如何更新标准或项目记忆种子。

本 Step 不新增 phase、commit boundary、BATCH、GATE、TC、EV、AC、VETO、schema、port、状态、config key、artifact JSON 字段或正式实现文件。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 11 | 当前标准 | 提供提交、评审、交付纪律的问题清单和输出表 |
| `实施计划书写规范.md` §4.8、§4.9、§5.11 | 当前标准 | 提供 commit 时机、message、footer、语言边界和自检清单 |
| `设计文档讨论中间产物规范.md` §3 | 当前标准 | 提供分步中间产物、永久记忆和停审要求 |
| `设计真相源闭环与可落码性标准.md` §九 | 当前标准 | 提供设计修复后经验回写和实现侧不得补口规则 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已完成 | 提供 git 配置、编码规范、永久记忆种子和阅读清单 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 commit-01-a 到 commit-08-c 的提交边界和子功能分组 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | 提供每个 boundary 的 GATE、artifact/report、AC/VETO 映射 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已完成 | 提供 pause、rollback、change、resume 和实现侧禁止补口规则 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 11 规则与边界 | 固定本 Step 只写提交 / 评审 / 交付纪律 | SOP Step 11、书写规范 §5.11 | 规则边界 | 不新增设计或测试真相 |
| M2 git config / worktree safety | 固定项目级 git 配置、暂存范围和用户改动保护 | Step 3、Step 10 | git / worktree 表 | 不使用 `--global`;不暂存无关改动 |
| M3 commit timing and boundary discipline | 固定一笔提交对应一个 Step 6 boundary | Step 6、Step 10 | 提交时机和粒度规则 | 不按文件、函数、当天工作量提交 |
| M4 commit message format and language boundary | 固定 design 仓 / 实现仓 message 格式、footer、换行规则 | 书写规范 §4.9 | message 结构表、正反例 | footer、空行、语言边界完整 |
| M5 commit body group mapping | 把 Step 6 子功能分组映射到 commit body 分组 | Step 6 全局 boundary | boundary-body 映射表 | 每个 boundary 均有分组 |
| M6 review checklist and implementation stance | 固定评审优先级和实现侧不得补口 | Step 10、标准 §九 | review 清单 | findings 优先;设计缺口暂停 |
| M7 artifact/report delivery checklist | 固定证据路径、交付说明和 review report 路径 | Step 7 | 交付检查表 | 只引用 run-scoped report |
| M8 design fix experience summary rule | 固定设计修复后经验总结和标准回写规则 | Step 3、Step 10、标准 §九 | 经验沉淀规则 | 无新增经验也要说明 |
| M9 cross-boundary commit discipline audit | 审计所有 boundary 的 scope、语言、footer、证据和 diff 范围 | M1~M8 | 停审表、回填草稿 | 无 unresolved 冲突 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | Step 11 只约束提交和交付,不改变实现范围 | §9.1 | 通过 |
| M2 | git 配置必须是项目级;暂存前先识别用户已有改动 | §9.2、§9.14 | 通过 |
| M3 | commit boundary 是 review / rollback 单元,不是文件或目录单元 | §9.3 | 通过 |
| M4 | design 仓可中文 subject/body;实现仓必须英文并带 scope | §9.4~§9.8 | 通过 |
| M5 | body 分组来自 Step 6 子功能分组,允许改名但必须保留映射 | §9.9 | 通过 |
| M6 | review 先列 bug、越界、证据缺失、测试缺口,摘要次之 | §9.10 | 通过 |
| M7 | 交付说明只引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review` | §9.11 | 通过 |
| M8 | 设计 blocker 修复后必须检查标准是否已有覆盖;没有则更新标准 / SOP / 记忆种子并加示例 | §9.12 | 通过 |
| M9 | 每个 boundary 的提交纪律均完成设计阶段停审 | §9.13~§9.15 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 提交前必须检查哪些 git 配置? | 必须检查项目级 `user.name = quantalithos-labs` 和 `user.email = quantalithos.ai@gmail.com`;不得用 `--global` 污染全局配置。 |
| 提交 message 应参考哪些规范和历史提交? | 必须先读本 Step、实施计划书写规范 §4.9 / §5.11 和目标仓近期合格提交。历史提交只能补充风格,不能放宽本 Step 规则。 |
| 当前仓是 design 文档仓还是实现代码仓? | `quantalithos-design` 是 design 文档仓;目标实现仓属于其他实现代码仓。两类仓的 message 语言边界不同。 |
| design 文档仓如何提交? | `type` 使用英文,subject / body 使用中文,固定 footer 为 `Co-Authored-By: Codex <noreply@openai.com>`。 |
| 实现代码仓如何提交? | commit message 必须英文,标题固定为 `type(scope): subject`,scope 必填;源码标识符、rustdoc、普通注释和测试名默认英文。 |
| 当前项目允许哪些 type 和 scope? | type 采用 `feat / fix / refactor / docs / test / chore / ci`。实现仓 scope 必须从当前 boundary 所属面选择,如 `workspace`、`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`、`config`、`scripts`、`reports`、`evidence`、`release`。 |
| 每笔提交对应哪个 Step 6 boundary? | 一笔提交只对应一个 `commit-xx-y`;不得把多个 boundary 混成一笔,也不得把同一 boundary 按文件、repository、service、route 或子模块拆成多笔。 |
| 同一 boundary 内多个协作子功能如何处理? | 保留为一笔提交,body 按 Step 6 子功能分组展开,每组说明这些文件为什么共同构成一个可验证增量。 |
| commit body 第一句如何写? | body 第一段用一句话概括当前 commit boundary 的可验证增量,不得只写“更新文件”或“修复若干问题”。 |
| body 文件条目如何写? | 只写文件名,不写完整路径;每条必须带大致改动量,如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。 |
| body 是否允许字面量换行符? | 禁止出现字面量 `\n`;必须使用真实换行。 |
| bullet 之间是否允许空行? | 同一分组 bullet 之间禁止插空行;分组之间可空一行。 |
| footer 策略是什么? | 默认只保留固定 footer `Co-Authored-By: Codex <noreply@openai.com>`;footer 前必须有真实空行。 |
| 需要精确控制格式时怎么办? | 把完整 message 写入文件,使用 `git commit -F <message-file>` 或 `git commit --amend -F <message-file>`。 |
| 哪些 commit 时机被允许? | 当前 boundary included 内容完成、excluded 内容未混入、对应 gate 通过、artifact/report 落盘、设计闭环复核无 blocker、工作区无无关暂存时允许提交。 |
| 哪些 commit 时机被禁止? | 半成品 WIP、门禁失败、设计缺口未回写、证据缺失、混入用户改动、多个 boundary 混合、为保存进度而提交均禁止。 |
| 证据如何附到提交或交付说明中? | 提交 body 或交付说明只引用 `reports/runs/<run_id>`、`reports/acceptance/*`、`reports/review/*` 和必要 raw artifact 根路径,不粘贴完整日志。 |
| 哪些情况下必须拆分提交? | 两个不相关功能、跨 boundary、跨 phase、不同 gate/risk 无法共同验证、或回退语义不同则必须拆分。 |
| 哪些情况下允许合并提交? | 同一 Step 6 boundary 内多个协作子功能共同构成一个可验证增量时必须合并为一笔,并在 body 中分组。 |
| 设计修复后是否需要经验总结? | 必须显式检查。标准已有覆盖则记录“无新增经验”;标准未覆盖则更新标准 / SOP / 项目记忆种子并加入具体示例,再继续后序任务。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 已有 commit boundary 和子功能分组,但还没有 commit body 分组映射 | 本 Step 写 §9.9 映射表 |
| Step 7 | 已有 gate、artifact/report 和验收映射,但交付说明引用规则未统一 | 本 Step 写 §9.11 交付检查 |
| Step 10 | 已有 pause/rollback/change/resume,但提交前如何保护用户改动和暂存范围未成表 | 本 Step 写 §9.2 和 §9.14 |
| Step 3 | 已有永久记忆种子,但设计修复后经验检查需要进入提交纪律 | 本 Step 写 §9.12 |
| 实现仓 | 后续可能因实现仓历史风格不同而放宽英文 commit 或 scope | 本 Step 明确目标仓更严格规则只能叠加,不能放宽 |
| 评审 | 容易把 review 写成总结而非风险优先 | 本 Step 固定 findings-first review stance |

## 7. 改动前后对比

| 议题 | Step 11 前 | Step 11 后 | 作用 |
|---|---|---|---|
| git 配置 | Step 3 已写前置要求 | 提交前检查项固定为项目级配置 | 防止错误 author 和全局污染 |
| 提交粒度 | Step 6 定义 boundary | 本 Step 固定一笔提交对应一个 boundary | 便于 review / revert |
| message 格式 | 标准已有通用规则 | 本 Step 裁剪为 L1-identity design / implementation 双口径 | 防止中文规则误入实现仓 |
| body 分组 | Step 6 有子功能分组 | 本 Step 映射到 commit body group | 提升 reviewer 可读性 |
| 证据交付 | Step 7 有 gate path | 本 Step 定义提交 / 交付说明引用方式 | 避免粘贴日志或使用 `latest` |
| 经验总结 | Step 3 / Step 10 已提及 | 本 Step 纳入设计修复后提交纪律 | 防止 blocker 修完不沉淀 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| design 仓和实现仓是否使用同一语言规则 | A. 全部中文;B. design 仓中文 subject/body,实现仓英文 | 采用 B。design 讨论保留中文,实现仓保持代码生态可读。 |
| commit 是否按文件 / crate 拆 | A. 按文件拆;B. 按 Step 6 boundary 拆 | 采用 B。boundary 是可验证、可回退单元。 |
| 同一 boundary 内多个子功能是否拆多笔 | A. 拆多笔;B. 保留一笔,body 分组 | 采用 B。避免同一可验证增量被拆散。 |
| 证据是否粘贴到 commit body | A. 粘贴完整日志;B. 只引用 report/artifact 路径 | 采用 B。commit 可读,证据可追溯。 |
| 新 blocker 是否只修项目文档 | A. 只修项目;B. 检查标准是否已有经验覆盖 | 采用 B。重复设计缺口要沉淀为可复用标准。 |

## 9. 结构化中间产物

### 9.1 提交纪律表

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| git config 范围 | 使用项目级配置,不得用 `--global` | `git config --show-origin user.name`;必要时查仓内配置 |
| 提交规范 | 提交前阅读本 Step、书写规范 §4.9 / §5.11、目标仓近期合格提交 | 人工核对 |
| 提交粒度 | 一笔提交对应一个 Step 6 commit boundary | 对照 §9.9 映射表 |
| 提交时机 | boundary 内容完成、门禁通过、证据落盘、无设计 blocker 后提交 | 对照 §9.3 和 §9.14 |
| 提交信息 | 标题、body、footer、空行、语言边界符合本章规则 | 对照 §9.4~§9.8 |
| 暂存范围 | 只暂存当前 boundary 相关文件 | `git status --short`;`git diff --cached --name-only` |
| 用户改动保护 | 不回滚、不暂存、不改写用户已有未提交改动 | 开工前 / 提交前 status 对比 |
| 证据记录 | 对应 gate report 或说明不可执行原因 | `reports/runs/<run_id>` / `reports/review` |

### 9.2 项目级 git 配置

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

约束:

- 上述配置只在当前仓执行,不得使用 `--global`。
- 提交前必须重新读取 `git config user.name` 和 `git config user.email`。
- 如果目标实现仓不是 `quantalithos-design`,必须在目标仓单独配置和检查,不得假设继承设计仓配置。

### 9.3 提交时机与粒度规则

| 判断项 | 允许 commit | 禁止 commit |
|---|---|---|
| boundary 对齐 | 当前 diff 只覆盖一个 Step 6 `commit-xx-y` | 多个 boundary 混在一笔 |
| 完整性 | included 内容完成,excluded 内容未混入 | 为保存进度提交不可审查 WIP |
| 验证 | 对应 GATE / targeted test / format / check 已通过或有正式不可执行说明 | 门禁失败或未跑且无说明 |
| 证据 | artifact/report 已进入正式路径或 review note 说明 | 缺 report、引用 `latest`、粘贴完整日志代替证据 |
| 设计闭环 | 开工前复核和实现二次校验无 blocker | 缺 schema/port/state/evidence 时实现侧私补 |
| 可回退 | 回退该提交不破坏上一已验证 boundary | 混入无关格式化、重构或用户改动 |

提交粒度:

| 粒度 | 判定 | 处理 |
|---|---|---|
| 过细 | 单函数、单 struct、单文件、单 route 或单 repository 方法 | 合并回所属 boundary |
| 适中 | 一个可独立 review、验证和回退的 Step 6 commit boundary | 保留 |
| 过粗 | 多个不相关 boundary、跨 phase、跨 gate 风险不同 | 拆分 |

### 9.4 提交 message 结构

| 部分 | design 文档仓 | 实现代码仓 |
|---|---|---|
| title | `type: 中文 subject` 或目标仓已有 design 风格;`type` 英文 | `type(scope): subject`;全英文;scope 必填 |
| body summary | 中文一句话说明本 design boundary 或文档更新 | 英文一句话说明本 commit boundary |
| body groups | 中文分组;文件名 + 改动量 + 文件级说明 | 英文分组;文件名 + 改动量 + 文件级说明 |
| footer | 固定 `Co-Authored-By: Codex <noreply@openai.com>` | 默认同左;目标仓更严格规则只能叠加 |
| 语言边界 | 文档正文和伪代码说明可中文 | 源码标识符、rustdoc、普通注释、测试名默认英文 |

### 9.5 Type / Scope 约束

| 项 | 允许值 | 说明 |
|---|---|---|
| type | `feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `ci` | 目标仓更严格 type 集合只能收紧,不能放宽本规则 |
| implementation scope | `workspace` / `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` / `config` / `scripts` / `reports` / `evidence` / `release` | 必须与当前 Step 6 boundary 的主要面一致 |
| design scope | 可省略 scope,或使用目标 design 仓已有约定 | 仍必须让 subject 指向当前文档或 Step |

### 9.6 Commit body 格式

```text
One-sentence summary for this commit boundary:

Sub-feature group A:
- file_a.rs (+12): concise functional summary.
- file_b.rs (~+80/-10): concise functional summary.

Sub-feature group B:
- file_c.rs (+34): concise functional summary.
- file_d.rs (+9): concise functional summary.

Co-Authored-By: Codex <noreply@openai.com>
```

### 9.7 Commit body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名,不写完整路径 | `query_service.rs` | `crates/application/src/query_service.rs` |
| 改动量 | 使用大致变化标记 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | 按子功能分组,不按文件类型平铺 | `Query visibility foundation:` | `Files:` |
| 换行 | 使用真实换行,不得写字面量 `\n` | title、body、footer 分段 | `subject\n\nbody` |
| 空行 | title 后空一行;footer 前空一行;bullet 之间不插空行 | 分组之间可空行 | 每条 bullet 后空一行 |
| 证据 | 只引用 report/artifact 路径 | `reports/runs/<run_id>/suites/service-flow-fast.md` | 粘贴完整 stdout |

### 9.8 Commit 示例与反例

design 文档仓正例:

```text
docs: 收稳 identity 实施计划提交纪律

补齐 Step 11 提交、评审与交付纪律:

提交规则:
- 07_implementation_plan_step_11_commit_review_delivery.md (+420): 固定 git 配置、message 格式、footer 和工作区安全规则

边界映射:
- 07_implementation_plan_step_11_commit_review_delivery.md (~+120): 将 Step 6 commit boundary 映射到 commit body 分组

Co-Authored-By: Codex <noreply@openai.com>
```

实现代码仓正例:

```text
feat(query): add read visibility foundation

Read visibility and stable lookup foundation for commit-05-a:

Visibility and lookup:
- query_support.rs (+96): add read visibility outcome assembly and stable lookup helpers.
- ports.rs (~+45/-3): extend formal read lookup ports used by query services.

No-write fake checks:
- memory_runtime.rs (~+180/-20): add read-only fake lookup state without mutating truth stores.
- query_flow_tests.rs (+124): cover missing lookup and query no-write behavior.

Co-Authored-By: Codex <noreply@openai.com>
```

反例:

```text
feat(query): add reads
Read changes:\n\n- crates/application/src/query_service.rs (+800): add query service.

- memory_runtime.rs (+300): add fake.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因:

- title 后没有真实空行。
- body 出现字面量 `\n`。
- 文件条目写了完整路径。
- bullet 之间插入空行。
- 没有按 Step 6 子功能分组。
- footer 前没有真实空行。
- subject 过泛,无法定位 commit boundary。

### 9.9 Commit boundary 到 body 分组映射表

| Commit boundary | Step 6 子功能分组 | Commit body 分组名称 | 推荐 scope | 证据引用 |
|---|---|---|---|---|
| commit-01-a | workspace + dependency + empty entry | `Workspace, dependency, and empty entries:` | `workspace` | `reports/runs/<run_id>/dependency-boundary.md` |
| commit-02-a | public contracts shared vocabulary + protocol shell | `Public contracts vocabulary and protocol shell:` | `contracts` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| commit-02-b | core business truth state + policy | `Core identity truth state and policy:` | `domain` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| commit-02-c | support state families | `Support state families:` | `domain` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| commit-03-a | operation context + generated ids/cursors + mappers | `Operation context, generated ids, and mappers:` | `application` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| commit-03-b | ports + fake runtime skeleton | `Formal ports and fake runtime skeleton:` | `infra` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| commit-03-c | idempotency + stored replay + fake parity | `Idempotency, stored replay, and fake parity:` | `application` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| commit-04-a | command skeleton + member/lifecycle | `Command skeleton and member lifecycle:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-04-b | role + career + memory commands | `Role, career, and memory commands:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-04-c | trace handoff command + command effect audit | `Trace handoff command and effect audit:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-05-a | visibility + stable lookup + no-write spy | `Read visibility, stable lookup, and no-write checks:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-05-b | core/member/trace/audit reads | `Core identity, member, trace, and audit reads:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-05-c | operations read queries | `Operations read queries and no-write audit:` | `application` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| commit-06-a | consumer context + receipt replay | `Consumer context and receipt replay:` | `application` | `reports/runs/<run_id>/suites/entry-worker-job.md` |
| commit-06-b | inbound/callback mutation flows | `Inbound and callback mutation flows:` | `application` | `reports/runs/<run_id>/suites/entry-worker-job.md` |
| commit-06-c | outbound accepted material | `Accepted outbound material:` | `application` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| commit-07-a | job report + stored replay foundation | `Job report and stored replay foundation:` | `jobs` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| commit-07-b | maintenance job family | `Maintenance job family:` | `jobs` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| commit-07-c | propagation job family | `Propagation job family:` | `jobs` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| commit-08-a | entry + runtime config | `Entry wiring and runtime config:` | `config` | `reports/runs/<run_id>/suites/config-redline.md` |
| commit-08-b | scripts + artifact/report writer | `Gate scripts and artifact report writer:` | `reports` | `reports/runs/<run_id>/report-audit.md` |
| commit-08-c | release + evidence + acceptance handoff | `Release, evidence, and acceptance handoff:` | `release` | `reports/runs/<run_id>/gate-summary.md` |

### 9.10 评审纪律表

| 评审项 | 评审重点 | 不通过处理 |
|---|---|---|
| 设计闭环 | 字段、DTO、state、port、flow、persistence、evidence 来源是否来自正式 `03/04/05/06/07` | 暂停,回写真相源 |
| boundary 范围 | diff 是否只覆盖一个 commit boundary,excluded 内容是否混入 | 拆分或回退当前 WIP |
| 行为正确性 | accepted/rejected/duplicate/conflict、no-write、no-repair、terminal guard 是否符合设计 | 修复并复跑对应 gate |
| fake / durable parity | fake 是否只实现正式 port,无 private map、默认成功或错误字符串分类 | 暂停或补正式设计 |
| 证据完整性 | raw artifact、run report、evidence index 和 acceptance handoff 是否对应 | 修复 writer/check 并重跑 |
| 源码语言 | 实现仓源码标识符、rustdoc、普通注释和测试名是否英文 | 修正后再提交 |
| 脱敏 | body/log/report/artifact 是否包含 forbidden material | 触发 redaction gate,不得提交 |
| 可回退性 | 回退该提交是否不破坏上一已验证 boundary | 拆分无关改动 |

评审输出格式:

- 若发现问题,先列 findings,按严重度排序,每条给出文件 / 行号 / 风险 / 修正建议。
- 若未发现问题,明确说明“未发现阻塞问题”,并列出仍未覆盖的测试或残余风险。
- 评审摘要放在 findings 之后,不得用概括替代问题清单。

### 9.11 artifact / report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| artifact root | `artifacts/test/<run_id>` 存在,并包含当前 gate 对应 suite raw artifact |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` 由 raw artifact 推导 |
| dependency report | 触及依赖边界时存在 `reports/runs/<run_id>/dependency-boundary.md` |
| redaction report | 触及 body/log/report 输出时存在 `reports/runs/<run_id>/redaction-check.md` |
| evidence index | 需要证据索引时存在 `reports/runs/<run_id>/evidence-index.md` 和 raw index |
| report audit | PH-08-b/c 存在 `reports/runs/<run_id>/report-audit.md` |
| gate summary | PH-08-c 存在 `reports/runs/<run_id>/gate-summary.md` |
| acceptance handoff | PH-08-c 存在并已审查 `reports/acceptance/handoff.md` |
| veto checklist | PH-08-c 存在并已审查 `reports/acceptance/veto-checklist.md` |
| review notes | 需要人工 / Agent 审查时写入 `reports/review/<run_id>-*.md` |
| no latest | 任何提交、报告、交付说明都不得引用 `latest` 作为证据来源 |

交付说明只写路径、结论和缺口摘要,不得粘贴完整日志。失败证据必须保留 failed/partial artifact、safe failure reason 和对应 report。

### 9.12 设计修复后经验总结规则

| 场景 | 必须动作 | 提交 / 回复要求 |
|---|---|---|
| blocker 已被标准覆盖 | 在修复说明中写明覆盖的标准项,无需新增经验 | 最终回复说明“本次无新增可复用经验” |
| blocker 未被标准覆盖且可复用 | 更新 `设计真相源闭环与可落码性标准.md`、相关 SOP 或项目永久记忆种子,并加入具体示例 | 与同项目设计修复合并提交或同批提交 |
| blocker 只属于本项目一次性字段 / 行文错误 | 不更新标准,但保留项目修复说明 | 最终回复明确无新增经验 |
| 多项目重复出现同类 blocker | 必须沉淀为标准经验,不得只修项目文档 | 标准更新后重审受影响 boundary |
| 修复设计后继续实现 | 先完成经验检查,再继续后序任务 | 给出可交给实现 agent 的交接说明 |

经验检查顺序:

```text
修复设计 blocker
  -> 判断是否与上一笔提交属于同一项目
  -> 检查标准 / SOP / 项目记忆种子是否已有覆盖
  -> 若无覆盖且可复用,更新标准并添加具体示例
  -> 重审受影响 commit boundary
  -> 提交或 amend
  -> 给出交接说明
```

### 9.13 Commit discipline 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-01-a | 是否有 scope、body 分组、GATE-01 证据引用和 dependency diff 规则 | 通过 | 无 |
| commit-02-a | contracts shell 是否一笔提交,不夹带 domain/application | 通过 | 无 |
| commit-02-b | domain truth 是否不夹带 repository / UoW | 通过 | 无 |
| commit-02-c | support state 是否不夹带 service flow | 通过 | 无 |
| commit-03-a | helper / context / mapper 是否同一分组,不落 repository | 通过 | 无 |
| commit-03-b | ports 与 fake skeleton 是否同提交并接受 fake parity review | 通过 | 无 |
| commit-03-c | idempotency / stored replay 是否一笔闭合 | 通过 | 无 |
| commit-04-a | member/lifecycle command 是否有 command subset 和 replay evidence | 通过 | 无 |
| commit-04-b | role/career/memory 是否按 external body-free command pattern 分组 | 通过 | 无 |
| commit-04-c | handoff command 是否不夹带 delivery job/callback | 通过 | 无 |
| commit-05-a | query foundation 是否不提前写 14 个 query body | 通过 | 无 |
| commit-05-b | core read 是否不夹带 operations read mutation | 通过 | 无 |
| commit-05-c | operations read 是否不触发 job mutation | 通过 | 无 |
| commit-06-a | receipt replay scaffold 是否不夹带 payload mutation | 通过 | 无 |
| commit-06-b | inbound/callback mutation 是否不夹带 outbound factories | 通过 | 无 |
| commit-06-c | outbound material 是否不夹带 publisher execution | 通过 | 无 |
| commit-07-a | job report replay foundation 是否不夹带 job bodies | 通过 | 无 |
| commit-07-b | maintenance job family 是否不夹带 propagation jobs | 通过 | 无 |
| commit-07-c | propagation job family 是否不夹带 CLI schema / report scripts | 通过 | 无 |
| commit-08-a | entry/config 是否不夹带 evidence scripts | 通过 | 无 |
| commit-08-b | scripts/writer 是否不输出 final acceptance conclusion | 通过 | 无 |
| commit-08-c | release/evidence/acceptance 是否来自实际 reports,不静态 pass | 通过 | 无 |

### 9.14 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name` 和 `user.email` 符合项目要求 |
| 工作区状态 | 已识别用户已有未提交改动,且不暂存不相关文件 |
| diff 范围 | 当前 diff 只覆盖一个 Step 6 commit boundary |
| 门禁结果 | 对应 fmt / lint / test / acceptance 已执行并记录结果 |
| 文档同步 | 设计偏离、接口变化、验收口径变化已回写真相源 |
| 源码语言 | 实现仓源码标识符、rustdoc、普通注释和测试名未混入中文 |
| title 格式 | 实现仓固定为 `type(scope): subject`;design 仓 `type` 英文 |
| body summary | body 第一段一句话说明本 commit boundary |
| body 分组 | body 分组回指 Step 6 子功能分组 |
| 文件条目 | 只写文件名,不写完整路径,并标注大致改动量 |
| 空行格式 | title 后空一行,footer 前空一行,bullet 之间不插空行 |
| 换行格式 | body 中没有字面量 `\n` |
| footer | 固定 footer 存在且前方有真实空行 |
| 证据记录 | report/artifact 路径存在,不引用 `latest` |
| 格式控制 | 需要精确控制时使用 `git commit -F` 或 `git commit --amend -F` |

### 9.15 跨提交边界纪律审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否所有 boundary 均有推荐 scope | 通过 | 见 §9.9 |
| 是否所有 boundary 均有 commit body 分组映射 | 通过 | 见 §9.9 |
| 是否所有 boundary 均只引用 run-scoped report / artifact | 通过 | 见 §9.9 和 §9.11 |
| 是否区分 design 仓中文 message 与实现仓英文 message | 通过 | 见 §9.4 |
| 是否固定 footer 且要求真实空行 | 通过 | 见 §9.4、§9.7、§9.14 |
| 是否禁止多个 boundary 混提 | 通过 | 见 §9.3 |
| 是否禁止同一 boundary 按文件 / route / service 拆多笔 | 通过 | 见 §9.3 |
| 是否保护用户未提交改动 | 通过 | 见 §9.1、§9.14 |
| 是否覆盖设计修复后经验总结 | 通过 | 见 §9.12 |
| 是否覆盖 review findings-first 纪律 | 通过 | 见 §9.10 |
| 是否覆盖 raw artifact/report 配对 | 通过 | 见 §9.11 |

## 10. 对上游 / 下游文档的影响判定

| 文档 | 是否需要回写 | 理由 | 处理 |
|---|---|---|---|
| `03-详细设计.md` | 否 | 本 Step 不改变 schema、port、flow 或状态 | 无需回写 |
| `04-配置设计.md` | 否 | 本 Step 不新增 config key 或 profile | 无需回写 |
| `05-测试方案.md` | 否 | 本 Step 不新增 TC、EV、artifact JSON 字段或 suite | 无需回写 |
| `06-验收标准.md` | 否 | 本 Step 不改变 AC/VETO 或验收结论 | 无需回写 |
| `07-实施计划.md` | 是 | Step 13 需把本 Step 结果装配到正式 §11 | 等 Step 13 装配 |
| `设计真相源闭环与可落码性标准.md` | 否 | 本 Step 只引用现有经验沉淀规则,未发现新增标准经验 | 无需回写 |

## 11. 回填草稿

> 回填目标: `07-实施计划.md` §11 提交、评审与交付纪律。

草稿:

````markdown
## 11. 提交、评审与交付纪律

实施提交必须以 §6 的 commit boundary 为唯一粒度。一笔提交对应一个 `commit-xx-y`;同一 boundary 内多个协作子功能保留为一笔提交,并在 body 中按 §6 子功能分组展开。不得按文件、函数、route、service、当天工作量或 repository 方法拆提交,也不得把多个 boundary 混成一笔。

提交前必须检查项目级 git 配置:

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |

当前 `quantalithos-design` 文档仓提交使用英文 type、中文 subject/body 和固定 footer。目标实现代码仓 commit message 必须使用英文,标题固定为 `type(scope): subject`,scope 必填。实现仓源码标识符、rustdoc、普通注释和测试名默认英文。

固定 footer:

```text
Co-Authored-By: Codex <noreply@openai.com>
```

footer 前必须有真实空行。需要精确控制格式时,使用完整 message 文件执行 `git commit -F` 或 `git commit --amend -F`。

Commit body 必须先用一句话概括当前 boundary,再按子功能分组。文件条目只写文件名,不写完整路径,并标注 `(+3)`、`(-35)`、`(~38)` 或 `(~+330/-60)`。body 中不得出现字面量 `\n`;同一分组 bullet 之间不得插空行。

提交前检查清单:

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `user.name`、`user.email` 符合项目要求 |
| diff 范围 | 只覆盖一个 §6 commit boundary,不混入用户未提交改动 |
| 门禁结果 | 对应 GATE / fmt / lint / test / acceptance 已执行并记录 |
| 文档同步 | 设计偏离已回写 `03/04/05/06/07` 或标准 |
| 提交信息 | title、body、footer、空行、语言边界符合本章规则 |
| 证据记录 | 只引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 或 `reports/review` |

设计 blocker 修复后必须执行经验沉淀检查:若标准已有覆盖,最终说明无新增经验;若标准未覆盖且可复用,必须更新标准 / SOP / 项目永久记忆种子并加入具体示例,再继续后序任务。
````

## 12. 待确认事项

| 事项 | 影响 | 后续处理 |
|---|---|---|
| 目标实现仓近期历史提交是否存在更严格 type / scope 集合 | 影响实现仓 commit message 细节 | 实现开工前在目标仓读取历史提交;只能叠加,不能放宽本规则 |
| 每个 boundary 的真实改动量标记 | 影响 commit body 文件条目 | 提交前按真实 diff 估算 |
| 实际 `run_id` 命名 | 影响 report/artifact 路径 | Step 8/PH-08 工具落码时按正式脚本输出,不得使用 `latest` |
| 设计修复是否产生新经验 | 影响标准 / SOP / 记忆种子更新 | 每次修复 blocker 后按 §9.12 执行 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 提交 message、footer、语言边界和 body 分组规则完整 | 通过 |
| 每个 Step 6 commit boundary 均有 body 分组映射和推荐 scope | 通过 |
| 工作区安全、用户改动保护和暂存范围规则完整 | 通过 |
| artifact/report 交付检查完整且只引用 run-scoped 路径 | 通过 |
| 设计修复后经验总结规则完整 | 通过 |
| 可以进入 Step 12 定义实施完成判定 | 是 |
