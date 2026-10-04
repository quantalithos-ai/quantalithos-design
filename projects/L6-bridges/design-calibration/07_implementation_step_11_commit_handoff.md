# L6-bridges 07 Step11：提交、评审与交付纪律

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step11 / 书写§5.11；仅设计校准，正式回填由Step13单独门禁控制。

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 输入和前序结论 | read | §2/当前正式来源 |
| SOP问题回答 | done_design_static | §3 |
| 材料诊断/前后对比 | done_design_static | §4/5 |
| 取舍与复杂度 | done_design_static | §6 |
| 结构化产物 | done_design_static | §7 |
| 回填草稿 | done_design_static | §8 |
| 待确认 | done_design_static | §9 |
| 实际静态自检 | done_design_static | §10；无项目测试 |

| 模块 | gate_status | next_allowed_action | source_files |
|---|---|---|---|
| step_11 | pass | enter_step_12 | Step10变更/用户worktree保护；SOP Step11、书写§4.9/5.11；实施台账固定Commit/Handoff；Step6每boundary分组 |

## 2. 输入

Step10变更/用户worktree保护；SOP Step11、书写§4.9/5.11；实施台账固定Commit/Handoff；Step6每boundary分组。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

提交粒度对应22boundary，英文实现type(scope): subject/body子功能/文件名改动量与固定Codex footer；设计中文例外不传实现；不凭当天大小混commit。每boundaryreview stagedscope、真实checks、未跑与blocker；真实hash/message写回台账再推进。

## 4. 材料诊断

当前没有实现/commit授权，规范里git config/commit/amend是未来流程而非本轮动作；人审不能由工具或未授权角色签署。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 当前没有实现/commit授权，规范里git config/commit/amend是未来流程而非本轮动作；人审不能由工具或未授权角色签署。 | 完整正反例/七gate与postcommit记录，21条前后依赖串行审查；执行纪律只plan，不调用stage/commit或外部消息。 |

## 6. 取舍与复杂度

完整正反例/七gate与postcommit记录，21条前后依赖串行审查；执行纪律只plan，不调用stage/commit或外部消息。

## 7. 结构化中间产物

### 11.1 提交/评审/交接规则

一笔实现提交只能对应§6一个boundary；boundary内各子功能必须一并闭合DTO→guard→port/read-save→flow/state→result/current→tests，不按文件名或当天工作量拼提交。代码批次可以多次验证，但不能有缺required安全语义的中间提交。若实际boundary过大，先在设计07/所有ledger同步拆成可验证增量并重新审闭包；不能私改phase或把required carrier扔下一phase。

| Gate | 提交前/后必须记录 | 失败 |
|---|---|---|
| Design/Activation | 实际immutable design baseline/current唯一boundary/授权/requiredreads/经验55项/资格blockers | blocked/wait_design；不改代码/不提交 |
| Scope/Worktree | 初始status、touchedvsallowed、用户dirty不纳入/不覆盖；只stage当前文件和hunks | blocked/fix_gate_failure；不reset/checkout用户文件 |
| Build/Test/Evidence | 实际命令/时间/exit/targeted/affected/doc-test、安全fixed-run范围材料与未跑原因；early finalEV不适用原因不能豁免最终P0 | 不记pass于未跑；失败仅修currentscope；实际缺资格保blocked |
| Commit | `git diff --cached --name-only`、`git diff --cached --check`、stagedscope、messageformat与requiredchecks真实 | 未授权或缺检查不得commit；不混用户改动或另boundary |
| Post-commit | 实际完整hash/message、`git status --short`、未纳入用户文件，更新当前boundary/项目ledger | 没hash未完成boundary；不造plannedhash |
| Handoff | hash/commands/results/unrun理由/remainingblockers/designfixbaseline/nextboundary/userprotectedfiles；材料仅安全路径 | 缺任何required记录不推进；下一boundary仍planned |

reviewer/acceptor/qualificationowner是未来责任角色，assignment waiting，本轮不创建代理/worker/team或代签。所有实施台账更新只记录真实已授权动作，禁止只勾选done无来源。七固定gate另含Worktree/Activation；每次继续/提交/修复后按§3磁盘恢复。

### 11.2 Commit Message合同

实现仓英文标题及body：`type(scope): subject`；type使用feat/fix/test/docs/refactor/chore中与真实增量一致者，scope具体到本boundary功能或crate而非整个仓genericupdate，subject一句概括可验证变化。body先英文summary，按§6子功能分组，文件标记只写文件名与真实改动量（+<n>/-<n>等占位示例不能冒实际diff），不列长路径/空洞标题。真实换行；分组标题之后bullet之间不空行；footer之前固定一个空行：`Co-Authored-By: Codex <noreply@openai.com>`。多行message未来采用安全message文件+`git commit -F <message-file>`，不可用shell literal `\\n`假换行。

计划格式正例（对应commit-02-b分组，不是实际提交）：

```text
feat(bridges-binding): add authorized installation and binding flow

Add scoped configuration and explicit binding transitions with stored replay.

Configuration and binding:
- configure_bridge_installation.rs (+<n>/-<n>): validate scoped revisions
- manage_external_binding.rs (+<n>/-<n>): enforce explicit activation basis
Current state and safe replay:
- local_mutation.rs (+<n>/-<n>): preserve whole-transaction audit and results
- authorization_flow_tests.rs (+<n>/-<n>): cover revoked basis and conflicts

Co-Authored-By: Codex <noreply@openai.com>
```

反例：

```text
update bridges
- add binding, Discord, callback, database, docs and deployment
- everything passes
```

反例缺type(scope)、混多个boundary/产品与无证成功、无合法分组/真实改动量/footer。设计仓未来授权提交保持英文type但subject/body中文，同样一project/边界、实际检查与footer；示例`docs(bridges): 收稳实施计划与预建台账`，不是本轮提交指令。

### 11.3 修复与交付

设计修复先判断上一提交项目归属和新可复用经验，同项目需要经验时可在另获权限后将项目/经验/具体示例合并上一提交，不同项目另提交，无新增经验明确说明并横扫同类。用户本轮仅许Bridges设计、不许跨标准或提交，因此不amend/不修改标准；需要扩大权限时停报blocker。Handoff必须完整指出当前功能/未跑原因/实际资格/后续boundary与safe证据路径；没有actual基线/实现时只能planned交接，不宣ready。


## 8. 回填草稿

回填正式07§11仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

英文实现/中文设计语言边界、一boundary一commit、summary/subgroups/files+真实改动量/footer/安全-F及正反例齐；只读stage规则未执行提交；所有boundary同交付理由与postcommit/Handoff义务明确。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step12。
