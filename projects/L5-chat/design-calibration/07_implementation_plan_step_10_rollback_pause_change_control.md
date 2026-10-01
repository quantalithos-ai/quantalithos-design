# L5-chat 07 · Step 10 回退、暂停与变更控制

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step11已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step9已done、07flow/项目台账与对应来源；07 SOP Step10、书写规范5.10；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

设计/基线/范围/源码门禁/SDK/unknowneffect/权限/报告/支持矩阵/签署变化逐类指定pause/fixgate/waitdesign；回退只当前exactscope，ownertruth不能客户端逆写。

## 4. 当前文档问题诊断

缺明确暂停、保留失败材料与设计回写顺序易导致scope外补口或以rollback掩盖actualeffect/失败。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 缺明确暂停、保留失败材料与设计回写顺序易导致scope外补口或以rollback掩盖actualeffect/失败。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

安全收紧优先、代码/配置/展示/报告各自回退；新baseline重复相同boundary审计，新run/review/signature，不自动清用户dirty/已发生effect。

## 7. 结构化中间产物

### 10.1 暂停与恢复规则

| 触发 | 必须动作 | 责任 | 保留材料 | 恢复条件 |
|---|---|---|---|---|
| 字段/二级carrier/enum/selector/ref/key/collection/empty/source缺失或03/05/06/07冲突 | 当前boundary blocked、next_allowed_action=wait_design，停止实现与下序推进 | 实施记录缺口、设计维护者原位修正式来源/校准 | safe blocker定位到文件/章/字段/当前boundary与实际条件，不含payload | 正式设计获批准不可变新baseline、相同boundary重复55经验与跨文档审计、Design/Scope实际pass |
| required_reads未完成或baseline不是获批准含07的commit | blocked/wait_design，不读旧历史代基线 | 实施/用户/设计 | 观察HEAD与dirty范围仅观察值，未批准项 | 最新批准baseline与source freshness核验、scope授权 |
| touched/staged含用户既有改动或不在exactscope | blocked/fix_gate_failure，停止扩写/提交 | 当前实施者 | 用户filelist与本boundarydiff区别 | 用户改动保留、staged只当前scope、Worktree/Scope重核；需越scope先修设计 |
| fmt/type/build/currenttargeted断言失败 | blocked/fix_gate_failure，仅当前scope定位修复 | 当前实施者 | actual命令/退出、安全log/category，未跑项及理由 | 修复后新检查结果通过、受影响回归/分母/证据有效 |
| currenttargeted通过但完整PR/suite/EV缺后序参数 | 当前范围记录actual结果，完整gate仍blocked，不合并交付分支/送验 | 实施/test | expected/missinginstances与scope | 后序到位补全并新run，完整PR/required层真实通过 |
| 正式SDK/owner能力未提供或runtime暂不可用 | 缺合同wait_design；已绑定只读暂失效unavailable/blocked，禁止私有fallback | SDK/owner/Chat | operation/contract/source/有限category | contract正式闭合并当前资格/actual测试；不能fixture顶替 |
| 业务dispatch可能已发生但无正式结果 | attemptunknown、只probe/query/wait；不自动重发或宣称取消 | Chat/owner/SDK | safe association/resultref/failurecategory仅合格持有边界 | 正式correlatedresult/noeffect/拒绝材料支持当前迁移；not_found仍unknown |
| 权限/visibility/session/parentversion撤销失效 | 先遮蔽/invalidate refs和slot、停consumer再清memory；stop/delete失败restricted | Chat安全/SDKsource | finite清理结果/currentgeneration与可审阅安全记录 | 新epoch独立获准读，不复活旧view/refs或清稿成功假称 |
| redaction/path/digest/schema/source/manifest失败或rawsecret/body候选 | 阻止发布/送验，安全清除敏感候选，不echo正文；保留finitecategory/path失败摘要 | report/security/test | sanitized失败材料，不保存命中片段/rawcandidate | writer/source修复、同新run全DAG/references/redaction重新通过 |
| 支持矩阵/qualitybudget/source/ACL/retention未批 | 受影响actualbuild/质量/归档/release blocked | 平台/test/产品/security/release | 当前缺口和适用scope | 正式policy/roles/环境批准与实际检查 |
| requiredP0或VETO触发/缺证据 | 对应gate失败/blocked，不以riskaccept绕过 | test/安全/验收 | 实际case/ref与审阅输入 | 修复+同层newrun+实际retest/review；VETO需actualclear |
| review/input/manifest/源码变化使签署不匹配 | 撤销旧final可用性，reviewing/not_allowed，重算digest并重新签 | 验收writer/reviewer/六角色 | previous_review/failure refs依06合法归档 | 当前输入/证据真实完整、所有六签署同新inputdigest且发布授权 |

### 10.2 代码、配置与展示回退

| 回退对象 | 合法回退边界 | 不能逆转/不能丢弃 | 恢复核验 |
|---|---|---|---|
| 当前未交付功能代码 | 获授权后按当前boundary准确diff或已批准revert；先核用户dirty，禁止reset/checkout清工作树 | 用户改动、已实际commit历史/失败证据 | 旧可验证增量真实build/test、scope与requiredsource仍适用；共享文件不撤销别boundary |
| SDK adapter/能力 | 禁用当前正向入口、显式blocked/unavailable，不切私有API或oldcontract | owner已提交effect、当前resultauthority与unknown | approved兼容publicexport、source/session重新资格，actualintegrationretest |
| config/profile/nativepolicy | 04批准兼容的旧version/bundle经正常validate新composition/epoch；nativepolicy需重新build审批 | revoke/oldpermission、旧attempt不得重发，内存稿可能丢失要按已确认产品限制处理 | 04六profile/14字段/source/资格重核、newrun/hostpolicy/支持矩阵 |
| Project/BPMN/目录view | 清child/selection或回safeparent/list/unavailable，只有qualifiedsame-source材料可重取 | 隐藏对象、旧query/parentlineage、错误拓扑/关系不能显示ready | independenttargetaccess/sourceversion，graph/list/ARIA同安全集合 |
| 内存cache/清理 | 先收紧，回到明确memory-only无持久化；失败restricted | 不能伪cleared、也不让cachetruth恢复权限 | repo真实delete/entryversion/currentpartition，恢复source重新资格 |
| report/evidence/review | 失败run和合法审阅历史保留；新run/review revision修复，敏感候选安全移除 | 不覆盖旧run、改case/result、删除失败修成pass或拼跨run | source/manifest/DAG/bytes+JSONdigest、redaction、同层证据、current签署 |

Chat没有owner业务回滚权限；Governance Decision、Conversation Turn或Work/Process状态的修复必须owner正式操作，不由客户端反写。代码回退不取消已发生SDKeffect，版本降低不能让unknown变failed/confirmed。报告失败不是commitrollback即可消除的事实。

### 10.3 受控变更和经验回写

| 变更 | 必须回写/复核 | 可继续范围 |
|---|---|---|
| 产品scope/入口/成员覆盖/项目群关系/流程owner | 获授权原位00→01→02，再03/04/05/06/07受影响链、flow/project/implementation台账 | 受影响boundary停止，不自行新增owner/图或SDK方法 |
| local schema/端口/flow/状态/幂等/恢复 | 正式03及对应Step同步，再04/05TCvariant/06gate/07boundary与55经验 | currentDesignGate批准新baseline之前wait_design |
| config/source/version/host权限 | 正式04/03 binding、05支持矩阵与06baseline、07scope/maturity | 不热变旧composition；需要新build/source批准 |
| 测试/EV/schema/报告/验收DTO | 正式05或06当前truthsource及校准→07checks/paths/分母/reader/writer | 不伪新增TC/AC/EV或私有fields；newmanifest/newrun/newreview |
| phase/boundary拆分/合并/新增 | 07§3/5/6/7阅读/依赖/七gate、所有planned skeleton和实施项目台账同步 | 无新增skeleton或source闭口不得移交 |
| 可复用新设计阻塞经验 | 先核§9.2已有规则；若未覆盖登记proposal、具体正反例/同类扫描与所需标准/SOP/种子更新 | 当前限制只Chat；未获跨范围授权不得写标准，移交保持blocked |
| 用户工作区或授权变化 | 恢复台账、exactscope/source/userdiff与相应临时记忆种子 | 没有实现/run/commit权限不提前执行 |

恢复顺序：实施项目台账→currentboundary→正式07→required章节/校准→实际worktree/scratch（若有）→新approvedbaseline确认→55经验/Design/Scope/Worktree→current增量重新检查→review→授权commit→actualHandoff。新baseline导致哪些旧测试/签署失效由05回归矩阵/06digest规则明示；不能用“只小改”省略核对。

## 8. 回填草稿

正式07 §10仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

pause/rollback/change每触发均有责任/安全材料/恢复条件，并符合04新composition、05回归与06审阅digest，无未授权操作或伪pass。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step11读取对应规范和来源。
