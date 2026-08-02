# L4-sandbox 实施计划 Step 11 定义提交、评审与交付纪律

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/实施计划书写规范.md` §5.11
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 编码规范: `standards/coding/rust.md`
> 项目提交规范: `projects/README.md` §8.2
> 回填位置: `07-实施计划.md` §11
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_12
> 当前成熟度: design_only;本文只定义未来纪律,不表示实现仓、commit、review、artifact、report或交付已经形成

---

## 1. Step状态与三层开工门禁

| 项 | 状态 | 说明 |
|---|---|---|
| 当前Step | Step 11 | 定义提交、评审与交付纪律 |
| 当前状态 | completed_reviewed_passed_to_step_12 | 主件与2分件已完成机械审计并经用户确认,由Step 12承接完成判定 |
| 流程门禁 | passed_for_step_11 | 用户已确认Step 10,本Step获得一次性放行 |
| 输入门禁 | passed_for_design | Step 3 /6 /7 /10、项目提交规范、台账规范和Rust规范均可定位 |
| 现实门禁 | constrained | 目标实现仓不存在,因此不能核验其hooks、分支策略或历史提交;该检查绑定`CB-SBX-01A` Activation Gate |
| 输出主件 | 本文件 | 固定通用提交、message、review、delivery和正式§11草稿 |
| 输出分件一 | `07_implementation_plan_step_11_boundary_commit_message_matrix.md` | 32 boundary逐项type / scope / title / summary / body group / evidence / commit时机 |
| 输出分件二 | `07_implementation_plan_step_11_review_delivery_audit.md` | 评审、交付、artifact / report、32 /32停审和跨boundary纪律审计 |
| 本Step禁区 | 正式`07`、implementation ledger、planned skeleton、实现仓、commit、run、EV、review结果、验收结论、签署 | 均不得在Step 11创建或伪造 |
| 下游门禁 | passed_to_step_12 | Step 12已获得一次性放行;本Step纪律保持为其直接输入 |

三层结论:

1. **流程可开始。** Step 10已经审查传递,提交纪律可消费其暂停、失效与恢复规则。
2. **设计输入闭合。** 32个boundary已有唯一目标、子功能组、allowed / forbidden scope、required checks和review owner。
3. **执行事实仍不存在。** 本Step中的title、message、路径与检查均为future template;不得填入hash、真实`run_id`、Passed、Reviewed或Delivered。

---

## 2. 本步目标、输入与硬约束

### 2.1 本步目标

1. 固定设计仓与目标实现仓不同的提交语言和格式边界。
2. 让每笔目标实现仓commit严格对应一个`CB-SBX-*`,不按crate、文件、repository、service、route或测试类型拆散。
3. 将Step 6的32组子功能机械映射为英文title、summary和body group,并保留同提交因果。
4. 将Step 7的门禁、canonical artifact / report路径和Step 10的暂停路由嵌入Commit / Handoff Gate。
5. 固定评审角色、交付包、证据引用和用户已有改动保护规则。

### 2.2 输入与权威顺序

| 输入 | 本Step消费内容 | 不复制 /不推断 |
|---|---|---|
| `projects/README.md` §8.2 | design仓英文type、中文subject / body、固定footer及按设计boundary提交 | 不把design仓中文口径带入实现仓 |
| 实施计划SOP Step 11 /书写规范§5.11 | 33项问题、message结构、type / scope、body、正反例、review与delivery检查 | 不缩减为一句“遵循Git规范” |
| 台账规范 | staged scope、Commit Record、Commit / Handoff Gate、用户改动保护和合法状态机 | 不预填gate pass或hash |
| Rust规范 | Rust命名、格式、lint与人工review原则 | 不把`rustfmt` / `clippy`当完整语义review |
| Step 3 | git identity、目标仓现实、阅读 / memory /脚本前置 | 不把design仓identity核验当目标仓已配置 |
| Step 6 §7.3~§7.7 | 32 boundary、scope、checks、commit时机和子功能分组 | 不重新拆boundary |
| Step 7 §6~§8 | suite / AC / VETO、artifact / report、review owner和失败处理 | 不伪造run或evidence |
| Step 10 | 暂停、回退、变更、失效传播和合法台账动作 | 不允许pending / blocked直接commit |
| 最近设计仓提交 | 仅作historical sample | 英文短标题、无body / footer的历史样例不得放宽现行规范 |

权威冲突顺序固定为: 项目正式`07`未来装配内容 > 当前Step 11三件已审查产物 > 项目级提交规范与台账规范 > 目标仓未来核验出的更严格规则 > 历史提交样例。目标仓规则只能叠加,不能放宽英文message、必填scope、一boundary一commit或固定footer。

### 2.3 硬约束

| 约束 | 当前裁决 |
|---|---|
| 一boundary一commit | 32个`CB-SBX-*`各自最多形成一笔计划实现commit;不同boundary禁止合并 |
| 同boundary不横拆 | contract / domain / service / adapter / entry / tests是协作子功能,按body分组而不是另开commit |
| batch不是commit | Step 6的108 batch用于控制编写和验证规模,全部完成后才形成所属boundary的一笔commit |
| scope必填 | 实现仓title固定`type(scope): subject`;scope必须来自分件一的boundary映射 |
| 实现仓全英文 | title、body、footer以外的源码标识符、rustdoc、普通注释和测试名均使用英文 |
| 文件条目只写basename | body bullet不得写完整路径;用group和描述消除同名文件歧义 |
| 近似改动量 | 每条使用`(+3)`、`(-35)`、`(~38)`或`(~+330/-60)`等标记,不得伪装精确统计 |
| 真实换行 | 禁止字面量反斜杠n;标题后、summary后、group间和footer前使用真实换行 |
| footer固定 | 只使用`Co-Authored-By: Codex <noreply@openai.com>`;本项目不展开多模型注脚 |
| 证据只引用 | commit / PR / handoff引用canonical path和ledger,不粘贴完整日志或正文敏感材料 |
| 无事实预填 | 计划message不是committed message;placeholder不是run;planned review不是Reviewed |

---

## 3. SOP 33项问题逐项回答

| # | 问题 | L4-sandbox回答 /落点 |
|---:|---|---|
| 1 | 提交前检查哪些git配置 | 在目标仓回读local `user.name=quantalithos-labs`,`user.email=quantalithos.ai@gmail.com`,并核验repo root、HEAD、branch / hooks策略和初始worktree;当前只核准design仓local identity。 |
| 2 | message参考什么 | 以项目§8.2、§5.11、台账规范和本Step为规范;历史提交只用于差异审计。 |
| 3 | 当前仓类型 | 当前是`quantalithos-design`设计文档仓;未来代码commit发生在`/home/aris/Projects/quantalithos-sandbox`。 |
| 4 | design仓语言 / footer | 英文type、`l4-sandbox` scope、中文subject / body、固定Codex footer;未经要求不提交。 |
| 5 | 实现仓语言 | title、body均使用英文。 |
| 6 | 实现仓title | 固定`type(scope): subject`,scope不可省略。 |
| 7 | 允许type / scope | §7.3定义type语义;分件一逐boundary固定planned type与scope。 |
| 8 | boundary与commit | 32 /32一一映射;跨boundary混提交直接使Commit Gate失败。 |
| 9 | boundary内协作子功能 | 按Step 6 §7.7同提交,在body按语义group展示,不得按文件 / crate横拆。 |
| 10 | body第一句 | 使用英文完整句概括boundary唯一可验证增量并显式写boundary ID。 |
| 11 | body分组 | 分件一沿用Step 6子功能因果命名;group说明共同闭合的contract / truth / UoW / side effect / evidence。 |
| 12 | 文件条目 | 只写basename,禁止完整路径。 |
| 13 | 改动量 | 每条写近似增删 /总变更量标记;以staged diff估算,不得预填。 |
| 14 | 字面量换行 | 禁止字面量反斜杠n;使用完整message文件和真实换行。 |
| 15 | bullet空行 | 同一group内bullet连续,bullet之间不插空行。 |
| 16 | 固定footer | `Co-Authored-By: Codex <noreply@openai.com>`。 |
| 17 | footer前空行 | 必须有一个真实空行。 |
| 18 | 多模型footer | 本项目不展开;只保留固定Codex footer。 |
| 19 | 精确格式控制 | 把完整message写入临时message文件,人工检查后用`git commit -F`;amend只用`git commit --amend -F`且不得顺带改tree。 |
| 20 | 实现仓源码语言 | 标识符、rustdoc、普通注释和测试名必须英文;外部协议固定字面量除外。 |
| 21 | 允许 /禁止commit时机 | §7.6固定;所有适用Gate有证据且staged scope唯一才允许,pending / blocked /越界 /失效材料均禁止。 |
| 22 | fmt / lint / test | 按boundary运行Rust fmt / check / clippy、targeted tests和适用script lint / evidence checks;确切命令由ledger记录。 |
| 23 | 设计偏离同步 | 立即停止,按Step 10写`blocked / wait_design`,回写拥有真相的`00~07` / calibration并固定新baseline后重审。 |
| 24 | 证据如何附加 | 只在message / PR / handoff引用boundary ledger、`artifacts/test/<run_id>`和canonical report路径;不复制完整日志。 |
| 25 | 拆分 /合并 | 不同boundary必拆;同boundary强相关子功能必合;若实证显示粒度错误先回写Step 6,不能临场自拆。 |
| 26 | 正反例 | §7.7~§7.9提供design仓、实现仓和错误拆分示例。 |
| 27 | report引用 | 只引用`reports/runs/<run_id>`、`reports/acceptance`、`reports/review`及ledger,禁止`latest`与同义入口。 |
| 28 | raw / report配对 | G1~G4有raw就必须有同run paired report;G0只写`no_runtime_artifact`理由,不得造空run。 |
| 29 | acceptance review | `handoff.md` / `veto-checklist.md`及其余draft必须由规定reviewer审查;当前文件均不存在,不得写已审查。 |
| 30 | 32 body分组映射 | 分件一完成32 /32映射。 |
| 31 | group是否表达同提交原因 | 是;group围绕共同可验证闭环命名,不使用`Files:` / `Tests:`平铺。 |
| 32 | 每boundary停审 | 分件二逐项记录32 /32设计层停审;执行期仍需在Commit Gate重复核。 |
| 33 | 跨boundary审计 | 分件二覆盖type / scope、语言、body、footer、evidence、diff、review、delivery与用户改动保护。 |

---

## 4. 当前材料问题诊断

| 材料 | 问题 /风险 | 处理 |
|---|---|---|
| Step 6 | 已有boundary与子功能组,但尚无可机械使用的message模板 | 分件一固定32个planned title、summary和body groups |
| Step 7 | 已有artifact / report与review owner,但交付说明可能写成“all tests passed” | 分件二固定canonical引用、pairing和status fidelity |
| Step 10 | 已有暂停 /失效路由,但尚未明确pending / invalidated材料不得commit | §7.6把控制状态嵌入Commit Gate |
| 最近设计仓提交 | 最近8条多为英文短标题且无body / footer | 记录为historical_material,不得反向放宽§8.2现行规则 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox`不存在 | 无法读取hooks / branch protection /历史提交;绑定`CB-SBX-01A` Activation Gate重新核验 |
| L1参考 | L1-artifact含旧`gate-summary.md`和领域证据名 | 只参考文档密度;L4固定`gate-results.md`和`EV-SBX-*`契约 |

未发现要求回写正式`00~06`才能完成Step 11的产品契约冲突。目标仓缺失、design baseline未提交、Shell规则、canonical JSON和P0-Q现实输入仍只阻塞各自future boundary。

---

## 5. 改动前后对比与设计取舍

### 5.1 改动前后

| 维度 | Step 10后 | Step 11后 |
|---|---|---|
| 提交单位 | 32 boundary有Commit Gate | 32 boundary各有唯一planned message与body group |
| 语言 | Step 3仅指出实现仓英文 | design / implementation仓语言和源码边界完全分离 |
| type / scope | 未逐boundary固定 | planned default逐项固定,actual override受review约束 |
| evidence | 有门禁和路径 | commit / PR / handoff引用规则和pairing检查闭合 |
| review | Step 7有owner方向 | review输入、失败动作、独立性和不得代签明确 |
| delivery | Handoff Gate字段存在 | 交付包、用户改动、下一boundary和acceptance draft检查完整 |

### 5.2 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 按crate /文件拆commit | 不采用 | 会打散Step 6已证明的功能闭环并产生不可独立验证的中间状态 |
| 一phase一commit | 不采用 | PH-02 /07 /11 /14包含不同风险和回退半径,粒度过粗 |
| 一boundary一commit | 采用 | 与review、rollback、ledger和Handoff Gate一一对应 |
| 固定每boundary绝对type | 不采用 | 未来实际diff可能是修复而非首实现;保留受控`feat -> fix`等语义override |
| 固定每boundaryscope | 采用 | scope表达稳定设计surface,不能随文件位置漂移 |
| 命令行多段`-m`拼message | 不作为精确路径 | 容易产生字面量换行和空行漂移;复杂message统一`git commit -F` |
| 把完整日志粘入body | 不采用 | 降低可读性并扩大敏感材料泄漏;只引用canonical evidence |

---

## 6. 仓类型与语言边界

| 仓类型 | title / body | scope | 源码语言 | footer | 当前事实 |
|---|---|---|---|---|---|
| 当前design仓 | `<type>(l4-sandbox): <中文subject>`;body中文并按设计闭环分组 | `l4-sandbox`为本项目默认 | 设计正文可中文,代码标识例保持契约原文 | 固定Codex footer | local identity已回读;本任务不提交 |
| 目标实现仓 | `<type>(<scope>): <English subject>`;body全英文 | 分件一固定的semantic scope,必填 | identifier / rustdoc /普通注释 /测试名英文 | 固定Codex footer;目标仓更严格trailers可叠加 | repo不存在,不得声称已配置 |

目标实现仓创建后,`CB-SBX-01A` Activation Gate必须执行并记录:

```text
git rev-parse --show-toplevel
git config user.name
git config user.email
git status --short
git log -n 8 --pretty=fuller
```

还必须检查仓内`CONTRIBUTING*`、commit hook、commitlint、branch policy和签名要求。任何更严格规则进入boundary ledger;若与当前设计冲突则`blocked / wait_design`,不得静默放宽本章。

---

## 7. 结构化中间产物

### 7.1 提交纪律表

| 项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| git identity | target local config精确为`quantalithos-labs <quantalithos.ai@gmail.com>` | 两条`git config`回读 | 不commit;`dependency_wait`原因 + `blocked / handoff` |
| current boundary | 项目ledger只有一个current且与boundary ledger一致 | 两级ledger对照 | 不stage /不commit |
| design baseline | 是用户确认后可复现commit且未被失效 | baseline / status回读 | `blocked / wait_design` |
| 提交粒度 | 一笔commit只对应一个`CB-SBX-*` | staged diff +分件一 | 拆除越界staging或回写Step 6 |
| staged scope | 仅含当前allowed path和behavior | `git diff --cached --name-only`;cached diff | `blocked / fix_gate_failure` |
| required checks | 适用Build / Test / Evidence Gate有真实证据 | boundary ledger + canonical reports | 修复并新run;不得改写旧失败 |
| message | title / summary / groups / basename /近似量 / footer合规 | message file review | 修message后重审Commit Gate |
| user changes | 无关用户文件保持unstaged且不被改写 | initial / precommit status diff | 暂停解决ownership |
| commit record | commit后才写真实hash / exact message / post-status | `git show --stat --oneline HEAD`等回读 | 不得先标completed |

### 7.2 Message语法与footer顺序

```text
<type>(<scope>): <English imperative subject>

<One English sentence describing the complete CB-SBX boundary.>

<Semantic sub-feature group A>:
- <basename> (<approximate delta>): <file role in this boundary>.
- <basename> (<approximate delta>): <file role in this boundary>.

<Semantic sub-feature group B>:
- <basename> (<approximate delta>): <file role in this boundary>.

<optional truthful issue or BREAKING CHANGE trailer, only when authorized>
Co-Authored-By: Codex <noreply@openai.com>
```

规则:

- subject使用英文祈使式,说明可验证结果,不写`update`,`stuff`,`wip`或仅写boundary ID。
- summary必须含exact `CB-SBX-*`;group标题不重复目录名。
- 固定Codex footer位于最后。`BREAKING CHANGE:`只有设计已正式重开并授权时才允许,否则发现breaking change立即`wait_design`。
- issue / breaking trailer不得伪造编号。footer block前有真实空行;同一block内trailer连续。
- message不得依赖shell转义。复杂message先形成临时文件,检查后执行`git commit -F <message-file>`。

### 7.3 Type / Scope约束

| type | 允许语义 | 禁止误用 |
|---|---|---|
| `feat` | 新增当前boundary计划的可验证行为 / contract / producer | 只改测试或格式仍写feat |
| `fix` | 修复已存在且有失败证据的行为,不改变boundary范围 | 借fix引入新协议 /状态 /scope |
| `test` | 测试、harness、fixture或conformance能力为主要交付且生产语义不变 | 把生产实现混入test隐藏 |
| `ci` | gate / CI / report orchestration与自动化入口 | 把业务行为写入脚本 |
| `chore` | workspace、manifest、repo maintenance且无业务行为 | 用chore淡化功能变化 |
| `refactor` | 行为与证据契约不变的内部重组 | 状态 /错误 /输出变化 |
| `docs` | 实现仓allowed scope内纯文档 | 设计真相变更只留实现仓docs |
| `perf` | 已有量化基线与等价行为证明的性能改进 | 无基线宣称优化 |
| `style` | 纯格式且无语义变化 | 与功能boundary混用 |

本项目可用scope闭集: `workspace`,`contracts`,`persistence`,`evidence`,`automation`,`config`,`composition`,`intake`,`boundary`,`policy`,`run`,`capture`,`handoff`,`control`,`safety`,`query`,`consumer`,`relay`,`jobs`,`operations`,`protocol`,`consistency`,`qualification`,`gates`,`acceptance`。

分件一为每个boundary固定default type和唯一scope。若实际diff要求改变type,reviewer可在同一scope内批准并记录理由;改变scope意味着boundary归属可能漂移,必须先回写Step 6 /本Step并重复Design Gate。

### 7.4 Commit body文件条目规则

| 项 | 正确 | 错误 | 裁决 |
|---|---|---|---|
| 文件名 | `services.rs` | `crates/application/src/services.rs` | 只写basename |
| 近似量 | `(~+180/-12)` | `(exactly 192 lines)` | 提交前按staged diff近似 |
| group | `Boundary establishment transaction:` | `Application files:` | 以协作闭环命名 |
| 描述 | `persist the grouped boundary outcome and replay result.` | `update code.` | 说明文件在同一boundary中的职责 |
| 同名basename | 在不同semantic group中注明crate / role | 改写为完整路径 | 仍只写basename,靠描述消歧 |
| 空行 | group间一个空行 | bullet之间空行 | bullet连续 |

### 7.5 Commit message生成与检查流程

```text
recover ledgers and current boundary
  -> inspect staged diff and approximate deltas
  -> select mapped type / scope
  -> write full message file with real newlines
  -> inspect title, summary, groups, basenames, deltas and footer
  -> run Commit Gate including cached diff checks
  -> git commit -F <message-file>
  -> read back exact hash and message
  -> update boundary and project ledgers
  -> run Handoff Gate
```

不得把message file加入实现commit,除非目标仓正式规范将其定义为受控交付物。`--amend`只用于当前boundary尚未handoff且用户允许的message修正;已handoff或共享提交不得擅自重写。

### 7.6 允许与禁止的commit时机

| 场景 | commit | 原因 /动作 |
|---|---|---|
| 当前boundary所有batch完成,适用Gate真实通过,staging唯一,message已审查 | allowed | `next_allowed_action=commit`后才执行 |
| G0明确`no_runtime_artifact`且direct checks通过 | allowed | Evidence Gate写`not_applicable`及producer缺失理由,不造run |
| Gate为`pending` /未执行 | forbidden | `run_gates`或保持pending |
| design gap /契约冲突 | forbidden | `blocked / wait_design` |
| 当前scope可修复的fmt / lint / test / evidence失败 | forbidden | `blocked / fix_gate_failure`,修复后新执行记录 |
| 外部repo / tool / ENV /candidate缺失 | forbidden | `dependency_wait`原因 + `blocked / handoff` |
| artifact存在但paired report缺失 | forbidden | Evidence Gate失败,保留raw并补合法report |
| source / RELEASE / evidence /acceptance材料已失效 | forbidden | 按Step 10新generation / run / batch重建 |
| staged diff含其他boundary或用户无关改动 | forbidden | 重新staging;不得破坏用户改动 |
| body /测试名 /注释含未授权中文 | forbidden | 修正并重跑适用检查 |
| acceptance draft出现预填verdict / risk acceptance / review / signature | forbidden | 阻断并按no-static规则处理 |

### 7.7 合格实现仓commit示例

```text
feat(boundary): establish coherent execution boundaries

Establish the complete boundary contract and transaction slice for CB-SBX-05B.

Backend capability and isolation seam:
- ports.rs (+46): expose bounded capability and establishment outcomes without a product-specific backend.
- isolation_backend_adapters.rs (~+210/-18): enforce generation-bound capability checks and reject weak fallback.

Boundary establishment transaction:
- services.rs (~+240/-20): persist requirement, decision, boundary, handle, and lease as one grouped outcome.
- truth_repositories.rs (~+130/-12): provide exact identity reads and rollback-safe grouped writes.

API entry and deterministic verification:
- command_handlers.rs (+74): route the typed command through the application service.
- boundary_establishment.rs (~+260/-15): cover unsupported outcomes, rollback, replay, and call budgets.

Co-Authored-By: Codex <noreply@openai.com>
```

说明: 示例中的文件名和改动量是格式示意,不是未来真实diff、commit或实现事实。真实提交必须从staged diff重建条目。

### 7.8 合格design仓commit示例

```text
docs(l4-sandbox): 闭合实施提交与交付纪律

收口 L4-sandbox 实施计划的提交边界、评审责任和证据交付规则。

提交与消息结构:
- 07_implementation_plan_step_11_commit_review_delivery.md (~+320): 固定设计仓与实现仓语言、footer和提交门禁。
- 07_implementation_plan_step_11_boundary_commit_message_matrix.md (~+120): 映射32个boundary的message分组。

评审与交付审计:
- 07_implementation_plan_step_11_review_delivery_audit.md (~+180): 固定canonical报告、停审与handoff检查。

Co-Authored-By: Codex <noreply@openai.com>
```

该示例只说明未来用户明确要求design仓提交时的格式;当前不构成提交请求或commit事实。

### 7.9 反例与错误拆分

```text
feat: sandbox work
Boundary work:\n\n- crates/domain/src/boundary.rs (+200): update code.

- services.rs (+180): add service.
Co-Authored-By: GPT <noreply@example.com>
```

错误: scope缺失、subject过泛、出现字面量反斜杠n、完整路径、bullet空行、无semantic group、footer错误且footer前无真实空行。

```text
commit 1: feat(boundary): add boundary contracts
commit 2: feat(boundary): add boundary service
commit 3: test(boundary): add boundary tests
```

若三部分共同属于`CB-SBX-05B`,该拆分不合格。应保留一笔commit,在body中按backend seam、transaction、entry / verification分组。若任一部分确实可独立交付,必须先由设计侧重开Step 6调整boundary,不能由实现者临场拆分。

### 7.10 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| 仓与identity | 当前是目标实现仓;local name / email精确匹配;repo / branch / HEAD已记录 |
| current boundary | 两级ledger指向同一唯一boundary,前序Handoff Gate已通过 |
| design baseline | 是可复现commit,required reads与适用经验复核已记录 |
| diff范围 | unstaged / staged均审查;staged只覆盖一个boundary的allowed scope |
| 用户改动 | 初始用户改动清单仍受保护,无关文件未stage |
| Build Gate | Rust fmt / check / clippy或script syntax / lint按boundary完成 |
| Test Gate | exact targeted TC / suite执行并保留原status |
| Evidence Gate | G0理由成立或G1~G4 raw / report / digest / pairing完整 |
| 失效检查 | 引用的generation、run、source、RELEASE和batch均未Invalidated / Superseded |
| title | 英文`type(scope): subject`,type语义与actual diff一致,scope匹配分件一 |
| summary | 英文完整句并含exact boundary ID |
| body groups | 与分件一semantic groups一致,解释同提交协作关系 |
| 文件条目 | 只写basename、近似改动量和具体职责;bullet连续 |
| 换行 / footer | 无字面量反斜杠n;标题后和footer前有真实空行;固定Codex footer最后 |
| canonical引用 | 只引用合法ledger / artifact / report入口,无`latest` /同义report /完整日志 |
| cached检查 | `git diff --cached --check`通过,message file已人工回读 |

### 7.11 评审纪律

| 评审面 | 必查输入 | 通过条件 | 失败动作 |
|---|---|---|---|
| boundary identity | 两级ledger、Step 6 /分件一 | commit只对应当前boundary | 清理staging或回写设计 |
| design closure | required reads、baseline、经验复核 | 无字段 /状态 /UoW /evidence缺口 | `blocked / wait_design` |
| behavior / security | diff、negative tests、VETO关联 | fail-closed、body-free、四维隔离 /cleanup等适用红线保持 | 阻断commit并分类缺陷 |
| test / evidence | raw、paired report、status / digest | fixed run、配对、redaction和status fidelity成立 | 新run复验,不覆盖旧材料 |
| message | message file与staged diff | title / groups / basename /量 / footer准确 | 修message并重审 |
| independence | Step 7 reviewer roles | generator / implementer不能代替独立acceptance review或签署 | 保持pending / Blocked |
| user ownership | initial / precommit worktree | 未授权用户改动未触碰 /未stage | 暂停并解决ownership |

review结论必须写具体finding和evidence ref。`looks good`、聊天中的“同意”或generator自检不能替代boundary ledger中的review record。

### 7.12 交付纪律与Handoff Gate

| 交付项 | 必填内容 | 禁止 |
|---|---|---|
| commit identity | future真实hash、exact title、boundary ID、design baseline | planned title冒充committed message |
| scope摘要 | actual changed basenames、semantic groups、未触碰用户文件 | 只写“implemented” |
| gates | 实际命令、status和canonical evidence refs | 把未运行写pass |
| tests not run | exact未运行项、原因、影响和下一动作 | 省略或写N/A |
| blockers | open / resolved blocker、owner source、合法next action | 在handoff中静默接受风险 |
| artifact / report | fixed raw / report / digest / pairing引用 | 完整日志、`latest`、`gate-summary.md` |
| acceptance / review | draft与review入口的真实存在 /状态;未形成则明确missing | generator输出等于review / verdict |
| next boundary | 只有当前Handoff Gate通过后由项目ledger唯一激活 | handoff文本私自启动后序 |

Handoff Gate通过后才能把当前boundary标completed并把`next_allowed_action`设为`start_next_boundary`。若commit已经形成但handoff材料不完整,当前boundary仍未完成,不得激活下一项。

### 7.13 Artifact / report canonical入口摘要

| 类别 | 合法入口 | 交付检查 |
|---|---|---|
| raw | `artifacts/test/<run_id>/...` | immutable run identity、schema、status、digest、redaction和resource disposition |
| run / suite | `reports/runs/<run_id>/summary.md`;`suites/<suite_id>.md` | 从同run raw生成,原样保留Failed / Blocked等状态 |
| gate / coverage | `reports/runs/<run_id>/gate-results.md`;`tc-coverage.md`;`protocol-inventory.md`;`per-coverage.md` | 禁止另建`gate-summary.md`;分母 /source identity固定 |
| integrity | `redaction-check.md`;`dependency-boundary.md`;`report-audit.md` | 回指raw check path / digest / status,不能只写总结 |
| evidence | `evidence-index.md`;`evidence/<evidence_id>.md` | 只有合法raw / report pair才分配真实alias |
| acceptance | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | 绑定fixed RELEASE;初稿不预填裁决 /接受 /签署 |
| review | `reports/review/{reviewer-notes,agent-review}.md` | 独立记录identity / version / time / findings;当前均不存在 |

完整逐项检查与32 /32停审见review / delivery分件。

---

## 8. 复杂度与分件判断

Step 11同时包含通用提交语法、32 boundary逐项映射、评审责任、canonical artifact / report检查和跨boundary审计。为避免主件超过500行且保持逐项可审查,拆成:

1. 本主件: 通用纪律、33项回答、正反例与正式§11草稿。
2. message矩阵: 32个boundary逐项planned title / groups / evidence / commit条件。
3. review / delivery审计: 32 /32停审、artifact / report和跨boundary检查。

三件必须共同通过才算Step 11设计完成。分件不是新的commit boundary,也不创建implementation ledger实例。

---

## 9. 正式`07` §11回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`
> - `design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md`
> - `design-calibration/07_implementation_plan_step_11_review_delivery_audit.md`

正式§11应收口为:

L4-sandbox目标实现仓的一笔commit必须且只能对应一个`CB-SBX-*`。同一boundary内的contract、domain、application、adapter、entry、test和evidence协作面按body semantic group组织,不得按文件、crate或batch拆成多笔;不同boundary不得合并。若实际diff证明boundary粒度错误,先暂停并回写Step 6 / §6,不能由实现者临场改变。

目标实现仓title固定为`type(scope): subject`,title和body全英文,scope必填并按32项矩阵固定。body第一句说明exact boundary,随后按子功能组列basename、近似改动量与文件职责;禁止完整路径、字面量反斜杠n和bullet间空行。固定footer为`Co-Authored-By: Codex <noreply@openai.com>`,footer前必须有真实空行。复杂message使用完整message文件配合`git commit -F`。

当前design仓若未来经用户明确要求提交,使用英文type、`l4-sandbox` scope、中文subject / body和同一固定footer。design仓历史短标题不构成放宽依据。实现仓源码标识符、rustdoc、普通注释和测试名必须英文。

Commit Gate必须核验目标仓local git identity、唯一current boundary、design baseline、staged scope、用户已有改动、fmt / lint / test、raw / report pairing、失效状态、message与cached whitespace。交付只引用两级ledger、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`和`reports/review`;唯一gate报告为`gate-results.md`,禁止`latest`、`gate-summary.md`或完整日志粘贴。

commit后必须回读真实hash与message并更新两级ledger。Handoff Gate记录实际命令、未跑测试、remaining blocker、canonical evidence、用户改动保护和唯一next boundary。acceptance draft generator没有review / adjudication authority;未形成独立review或正式裁决时必须保持pending / Blocked。

---

## 10. Blocker、待确认、自检与停审

### 10.1 Blocker与现实前置

| ID | 状态 | 影响 | 处理 |
|---|---|---|---|
| SBX-IMP-COMMIT-001 | completed_pending_user_review | Step 11三件产物原未统一形成 | 已完成33项回答、32 boundary映射、review / delivery和跨boundary机械审计,等待用户审查 |
| SBX-IMP-COMMIT-REPO-001 | open_before_cb_sbx_01a_activation | 目标仓不存在,无法读取hooks / branch / history / local identity | `CB-SBX-01A` Activation Gate创建 /确认仓后核验;更严格规则只叠加 |
| SBX-IMP-DESIGN-BASELINE-001 | open_before_handoff | 当前新版设计链未形成可复现commit baseline | 用户决定提交后固定;本Step不commit |
| SBX-IMP-SCRIPT-STANDARD-001 | open_before_script_boundary | Shell rule / lint未固定 | 02D /14A前关闭,不阻Step 11设计 |
| SBX-IMP-CANONICAL-JSON-001 | open_before_schema_writer_boundary | RFC 8785实现未选 | 02C /14B前关闭 |
| SBX-IMP-CANDIDATE-001 | open_before_p0q_boundary | candidate / ENV-05 / provider / material /lab identity缺失 | 13A /13B保持0 launch |

没有阻塞Step 11设计收口的上游产品契约blocker。上述均为future reality gate,不能在本Step标ready。

### 10.2 当前自检

| 自检项 | 当前结果 | 依据 |
|---|---|---|
| SOP 33项问题 | passed_design:33 /33 | §3 |
| design / implementation语言边界 | passed_design | §6 |
| type / scope / message / footer | passed_design | §7.2~§7.5 |
| 正反例与提交前检查 | passed_design | §7.7~§7.10 |
| 32 boundary映射 | passed_design:32 /32 | message矩阵 |
| review / delivery / artifact检查 | passed_design:12 review /10 delivery /32 stop-review | review / delivery分件 |
| 跨boundary纪律审计 | passed_design:24 /24 | review / delivery分件§7 |
| 正式`07` / ledger / skeleton | not_created | 必须等Step 13 |
| commit / run / evidence / review事实 | not_created | design_only |

```text
step_11_result = completed_reviewed_passed_to_step_12
sop_questions = 33 / 33
boundary_message_mapping = 32 / 32
boundary_stop_review = 32 / 32
review_disciplines = 12 / 12
delivery_disciplines = 10 / 10
cross_boundary_audits = 24 / 24
gate_status = passed_to_step_12
next_allowed_action = 由`07_implementation_plan_step_12_completion_criteria.md`承接
allow_step_12 = yes
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```

用户已确认Step 11。Step 12已按一次性放行读取对应SOP和书写规范并开始形成中间产物;不得由此越级进入Step 13。
