# L5-chat 07 · Step 11 提交、评审与交付纪律

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step12已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step10已done、07flow/项目台账与对应来源；07 SOP Step11、书写规范5.11；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

项目git身份/语言/标题/组/basename/actual量/换行/footer/七gate与actualhandoff明确；21boundary逐组映射，正反例与artifact/reportreview清单。

## 4. 当前文档问题诊断

旧历史message含其它footer/过宽scope与已替代对象名，不能直接复制；planned标题不等committed_message。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧历史message含其它footer/过宽scope与已替代对象名，不能直接复制；planned标题不等committed_message。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

current标准优先，实际diff/gates/授权前不提交；同boundary协作功能按body分组一笔，外部runtime归档独立且不默认stage；本轮无新可复用经验。

## 7. 结构化中间产物

### 11.1 提交前纪律

当前设计仓本轮没有commit授权，以下定义未来计划。只读设计仓历史commit仅供格式污染检查；目标实现仓不存在，无真实实现历史可引用。旧提交中的footer/对象名/过宽跨项目scope不能覆盖当前规范或产品模型。

| 项 | 要求 | 实际检查/失败 |
|---|---|---|
| 用户git身份 | 目标实现仓local user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com；不用--global | 实际git config读取，未配不提交；本轮未设置 |
| 阅读/编码 | §3实际语言规范、projects/README §8.2与台账规范；目标更严规则只叠加 | TS/TSX/JS/HTML/Rust各域，English标识符/注释/JSDoc/rustdoc/测试名；业务/i18nfixture可按需求字符集 |
| 一笔一boundary | §6每boundary一笔提交，协作子功能在body分组同提交 | exactpaths/content/diff校验；不按单函数/文件拆，不跨phase混合 |
| 提交时机 | 当前boundary七gate/Worktree实际成立、requiredchecks完整、有commit授权 | 只planned标题/未跑test/未有hash不满足；局部scope不宣完整PR、交付分支完整PR gate另查 |
| 用户worktree | 不改/不暂存既有无关改动，不全仓git add . | 逐file diff/staged diff与起始status核对；不得reset/checkout清工作树 |
| baseline/scope | 固定approved00～07commit与source/版本、读取当前唯一ledger | dirty观察HEAD不可充批准基线；任何schema/phase偏离wait_design |
| 证据 | 实际requiredscope结果、not_run/blocker安全摘要、报告成熟度匹配 | rawmachine须对应report；早期不补fullEV/签署 |
| 文档修复 | §10原位formal/calibration同步、受影响TC/EV/gate/07与全部台账重核 | 没有baseline刷新和经验检查不能恢复移交 |
| 交接 | commit后actualhash、message、checks/notrun、剩余blocker/nextboundary和userdiff | 计划标题不填committed_message/hash；所有futureboundary不得提前activate |

### 11.2 Message、语言与固定footer

| 部分 | 实现仓quantalithos-chat | 设计仓quantalithos-design |
|---|---|---|
| title | 英文type(scope): subject，scope必填 | type英文，subject中文；本项目规范建议docs(l5-chat): 中文主题 |
| type | feat、fix、test、docs、refactor、chore、perf、ci、style，按真实边界用途 | docs/fix/chore仅对应设计工作 |
| scope | chat、chat-reports、chat-navigation、chat-state、chat-ui、chat-intents、chat-governance-ui、chat-continuity、chat-recovery、chat-projects、chat-process-ui、chat-directory、chat-sdk、chat-desktop、chat-acceptance | l5-chat；不能混otherproject或globalstandards |
| body首段 | 一句话说明当前boundary为什么形成可验证增量 | 中文说明设计边界 |
| groups | 按§6子功能共同输入/结果与本表映射，英文GroupName: | 按设计闭环中文分组 |
| file条目 | 仅basename + 大致actual变化量(+3)/(-35)/(~38)/(~+330/-60) + 英文功能说明 | filename与actual改动量/中文目的 |
| 换行/空行 | title后与footer前真实空行；组间空行；bullet间不插空行；禁literal \n | 同样规则 |
| footer | 只固定Co-Authored-By: Codex <noreply@openai.com>，不展开多模型注脚 | 相同固定footer |
| issue/breaking | 只有真实issue/兼容变更事实才额外footer，放固定Co-Authored-By之前 | 当前无此类事实，不造编号 |

需要精确message时，在获授权后用apply_patch写临时message真实换行，按git commit -F <message_file>提交；amend仅在用户已有允许改该commit的授权内执行git commit --amend -F。本轮不写message文件或执行提交/amend。数量示例仅格式，未来用actualdiff粗略计，不从计划行数伪造变更量。

### 11.3 boundary到body分组映射

| boundary | planned title | §6子功能共同原因 | body主分组 | 文件/证据规则 |
|---|---|---|---|---|
| commit-01-a | feat(chat): add safe bootstrap and strict client configuration | 启动guard + strict loader + source AST checker + 同scope负例 | Safe startup and strict configuration: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=script_capability |
| commit-01-b | feat(chat-reports): add run schemas and safe index generation | machine schema + manifests + 两次脱敏 + index-shell检查 | Run schemas and redaction pipeline: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-02-a | feat(chat-navigation): enforce qualified entry and current context | qualified entry + 槽位失效 + CAS + route定义 + 安全失败测试 | Qualified entry and request isolation: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-02-b | feat(chat-state): add guarded memory projections and revocation cleanup | 持有guard + versioned memory读写 + revoke先遮蔽/delete失败restricted | Memory lifecycle and revocation safety: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-03-a | feat(chat-ui): render safe conversations and accessible turn lists | Turn/分页/unknown + selection + keyboard/focus/IME/公告 + safe props | Accessible Turn presentation: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-03-b | feat(chat-ui): present controlled gates and authorized references | 来源/权限/freshness显化 + Gate affordance + ref/preview资格 | Controlled Gate and reference presentation: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-04-a | feat(chat-intents): enforce single dispatch and formal result authority | 同revision草稿 + reserveDispatch CAS + 正式result gate + unknown-only probe + feedback | Single dispatch and formal outcomes: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-04-b | feat(chat-governance-ui): gate approval intents on formal outcomes | Gate/action/source关联 + capability/access + attempt/result统一语义 | Governance intent qualification: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-05-a | feat(chat-continuity): qualify changes and recover source gaps | source qualification + duplicate/gap + revoke安全收紧 + resume coverage | Source change and coverage recovery: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-05-b | feat(chat-recovery): add safe restart and explicit support handoff | offline/restart重新资格 + 原attempt unknownprobe + 显式低敏support | Offline recovery and explicit support: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-06-a | feat(chat-projects): unify project details and progress navigation | Work safe list/detail + 同project五tab + task→progress/current/返回 | Unified project navigation: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-06-b | feat(chat-process-ui): render qualified BPMN drilldown and parallel branches | Process source/parentlineage + BPMN fork/branch/join/loop + safe list/AT | Safe BPMN hierarchy and equivalent list: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-06-c | feat(chat-directory): isolate relationships and company member contexts | 关系/逐target访问 + provider覆盖/分页/search + 完整unbound app安全装配 | Relationship and provider context isolation: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-07-a | feat(chat-sdk): bind qualified reads and controlled command results | SDK资格 + owner-safe query/ref + 幂等/resultauthority actualmapping | Formal query and command binding: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-07-b | feat(chat-sdk): bind formal changes and source resume coverage | publicchange/coverage + 受控重连 + 多端权限/水位actual证明 | Formal change and cross-device recovery: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-08-a | feat(chat-desktop): enforce trusted native capability boundaries | trusted IPC + leastauthority + TS capability状态 + 有限拒绝 | Trusted native capability guards: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-08-b | test(chat-desktop): verify approved desktop and assistive workflows | realnative build/restart/offline + keyboard/IME/读屏/graphlist/focus | Actual Desktop and assistive workflows: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-09-a | test(chat): complete state error and quality regression manifests | 全状态/竞态/错误/安全参数 + 批准质量测量 + completesuite验证 | Complete parameter regression: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=index_shell |
| commit-09-b | feat(chat-reports): generate complete evidence from actual suite results | 完整manifest/suite/case到16EVdetail/index + redaction + semantic缺口审阅 | Complete evidence and safe publication: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=full_ev |
| commit-10-a | feat(chat-acceptance): validate private handoff and review inputs | actualevidence映射 + private schema/DAG + verdict待审初稿 + 签署前review资格 | Private acceptance and pre-signature review: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=acceptance_handoff |
| commit-10-b | docs(chat): record reviewed acceptance and controlled delivery | 实际六角色裁决 + openissues/risk/未跑tests + approvedrelease/handoff | Reviewed delivery and remaining constraints: | basename+actual量+目的；actualreports/runs/<run_id>或当前targeted检查记录，成熟度=acceptance_handoff |

#### 实现commit格式正例（非已发生commit）

```text
feat(chat-process-ui): render qualified BPMN drilldown and parallel branches

Keep the safe Process hierarchy and its equivalent keyboard view consistent.

Safe BPMN hierarchy and equivalent list:
- process_flow_view_model.ts (~38): validate qualified topology and parent lineage.
- read_only_process_renderer.tsx (~+80/-10): render the same visible nodes and edges as the list.
- project_process_boundary_tests.tsx (+34): cover parallel branches and stale child rejection.

Co-Authored-By: Codex <noreply@openai.com>
```

上例数量只演示格式，不是本轮diff/实现事实；真实message必须据actualdiff。反例：

```text
feat: add flow
Files:\n- src/collaboration/process_flow_view_model.ts (+100): update things.

- tests/project_process_boundary_tests.tsx (+50): pass all tests.
Co-Authored-By: Other Model <unapproved@example.invalid>
```

反例scope缺失、字面\n/路径/无功能分组、bullet空行、footer空行/固定文本错误，并擅称tests结果。把model/renderer/test分别三笔提交也不满足同一可验证boundary。

### 11.4 七gate、评审和交付检查

| gate/评审 | 审查证据 | 失败处理 |
|---|---|---|
| Design | currentapprovedbaseline/reads、当前carrier/typedrefs/状态/flow/schema/source closure、55经验复核和externalblocker | wait_design，formal修复前不实现 |
| Scope/Worktree | exactallowedfiles及内容、forbidden、起始用户diff/touched/staged对照 | fix_gate_failure，保留用户worktree |
| Build | actualfmt/type/lint/build；host变更分域Rust/Tauri/OS批准 | 当前scope修；缺工具/policy blocked，不伪安装 |
| Test | 当前targeted与已实现affected回归、完整分母/missing/real scope；交付支查完整PR/release | 阻断next或受保护合并/送验；新run复验 |
| Evidence | same-run/meta/source/config/manifest/cases/suite/gate/index+double redaction/bytes-selfdigest、maturity/ref可materialize | unsafe不发布，失败/不足保留；不补EV |
| Commit | localidentity、stage一个boundary、英文title/body/footer/真实换行、git diff --check和cached diff、所有required检查、提交授权 | 未齐不commit；不自动amend他人或历史 |
| Handoff | actualhash/message、运行checks、不运行项/理由、remainingblocker、nextboundary、user-ownedchanges未动 | 无actualhash不得完成；项目ledger不提前推进 |
| 语义/体验review | owner/runtime/member/project/flow/Gate不混truth；按钮/ACK/缓存不confirmed；graph/list/ARIA一致、核心focus/IME/AT | 必要P0/VETO不接受风险；SDK/native/operator角色补actual证明 |
| 报告/验收review | machine/ref/schema工具查后，人/Agent实际核scope/缺陷/risk/未跑项/六角色digest | actual审阅未有则draft/reviewing/not_allowed，不填签名/三值final |

提交/PR/交接只引用批准报告路径和有限安全摘要，不粘rawlogs/正文/凭据。runtime artifacts/reports不默认git暂存；按正式保留/归档政策保存，代码commit只列source/doc，machine输出作为外部actualref。大图、原型、safecommit/tool/test摘要不等EV或owner业务成功。

### 11.5 Artifact/report交付清单

| 项 | futureactual完成条件 |
|---|---|
| fixedrun/来源 | artifacts/test/<run_id>/meta/context.json、source-commits.json、config-digest.json、manifest.json真实有效；无latest/占位run |
| suite/case | 各suite/report与actualcases/log安全、TC/variant/runner_kind/proof_scope exactmatch；blocked缺文件明确 |
| gates/index | gate-results.json/redaction-check.json/evidence-index.json按批准成熟度，16EV tc/ac_refs原映射和实际status |
| 可读report | reports/runs/<run_id>/summary.md、gate-results.md、redaction-check.md、redaction-final.json、evidence-index.md、suites与fullEV detail（成熟度允许） |
| 安全 | writer先脱敏、首检machine/终检derived与maturity允许acceptance；bytes+JSONdigest和DAG、ACL/retention/sourcepolicy |
| acceptance | reports/acceptance/handoff.md、veto-checklist.md、risk-acceptance.md、open-issues.md、baseline.json仅获批准阶段；实际review与六signoff核验 |
| 缺陷/条件 | 06 defseverity/分类/P0阻断、same-layer retest refs与修复baseline；P1/P2实际接受/期限/角色有效 |
| 交付状态 | 源码hash/build/approvedconfig/SDK/native/支持matrix/actualrun/review、remainingblocker、未跑tests与下一动作，不夸scope/readiness |

上表全部当前waiting，不为当前项目生成空artifact/report/验收文件。交付说明中的“设计计划完成”“currentboundary完成”“P0产品验收通过”“获准发布”是四种不同事实，必须分别有对应正式记录。

### 本Step过程审查（不进正式正文）

#### 每boundary提交纪律停审

| boundary | type/scope、diff、body、footer、证据/提交时机 | 设计结论 |
|---|---|---|
| commit-01-a | feat(chat): add safe bootstrap and strict client configuration；group=Safe startup and strict configuration；exactscope见Step6；maturity=script_capability；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-01-b | feat(chat-reports): add run schemas and safe index generation；group=Run schemas and redaction pipeline；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-02-a | feat(chat-navigation): enforce qualified entry and current context；group=Qualified entry and request isolation；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-02-b | feat(chat-state): add guarded memory projections and revocation cleanup；group=Memory lifecycle and revocation safety；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-03-a | feat(chat-ui): render safe conversations and accessible turn lists；group=Accessible Turn presentation；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-03-b | feat(chat-ui): present controlled gates and authorized references；group=Controlled Gate and reference presentation；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-04-a | feat(chat-intents): enforce single dispatch and formal result authority；group=Single dispatch and formal outcomes；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-04-b | feat(chat-governance-ui): gate approval intents on formal outcomes；group=Governance intent qualification；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-05-a | feat(chat-continuity): qualify changes and recover source gaps；group=Source change and coverage recovery；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-05-b | feat(chat-recovery): add safe restart and explicit support handoff；group=Offline recovery and explicit support；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-06-a | feat(chat-projects): unify project details and progress navigation；group=Unified project navigation；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-06-b | feat(chat-process-ui): render qualified BPMN drilldown and parallel branches；group=Safe BPMN hierarchy and equivalent list；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-06-c | feat(chat-directory): isolate relationships and company member contexts；group=Relationship and provider context isolation；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-07-a | feat(chat-sdk): bind qualified reads and controlled command results；group=Formal query and command binding；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-07-b | feat(chat-sdk): bind formal changes and source resume coverage；group=Formal change and cross-device recovery；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-08-a | feat(chat-desktop): enforce trusted native capability boundaries；group=Trusted native capability guards；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-08-b | test(chat-desktop): verify approved desktop and assistive workflows；group=Actual Desktop and assistive workflows；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-09-a | test(chat): complete state error and quality regression manifests；group=Complete parameter regression；exactscope见Step6；maturity=index_shell；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-09-b | feat(chat-reports): generate complete evidence from actual suite results；group=Complete evidence and safe publication；exactscope见Step6；maturity=full_ev；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-10-a | feat(chat-acceptance): validate private handoff and review inputs；group=Private acceptance and pre-signature review；exactscope见Step6；maturity=acceptance_handoff；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |
| commit-10-b | docs(chat): record reviewed acceptance and controlled delivery；group=Reviewed delivery and remaining constraints；exactscope见Step6；maturity=acceptance_handoff；必须实际gate/授权 | reviewed_design_only；无commit/hash/staged/tests结果 |

#### 跨提交纪律审计

| 项 | 结论 | 保留 |
|---|---|---|
| type/scope/一笔 | 21个英文标题一一对§6，无scope缺失，无跨phase合笔 | actualmessage/hash未有 |
| body/footer/语言 | 21组回指增量原因；basename/actual量/换行/固定footer明确；设计中文/实现英文 | 示范counts不作实现事实 |
| 授权/工作树 | baseline/七gate/用户diff后才可提交，amend另需相应授权 | 本轮不commit，不设置git |
| 报告材料 | machine/report配对、fixedroot、maturity/real/proof/失败不足与review | runtime输出不默认暂存 |
| 经验沉淀 | 本轮规则已在标准55项覆盖，未新增通用经验 | 不跨范围更新标准；未来新类proposal及具体示例 |


## 8. 回填草稿

正式07 §11仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

21标题英文type(scope)/body分组与scope对应、固定footer完整、正反例无真实counts声明；七gate/Worktree/实际审阅/交付清单可执行，actual状态waiting。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step12读取对应规范和来源。
