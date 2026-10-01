# L5-chat 07 · Step 5 实施阶段与依赖顺序

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step6已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step4已done、07flow/项目台账与对应来源；07 SOP Step5、书写规范5.5；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

采用10个可验证纵切phase、21个boundary；先安全启动与typed local契约，再正式SDK/native，最后fullEV/验收。风险Spike在各受影响阶段前；项目内不并行。

## 4. 当前文档问题诊断

此前没有phase DAG/可验证增量/报告成熟度与scope gate区分，易把完整PR未达成的局部开发当通过。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 此前没有phase DAG/可验证增量/报告成熟度与scope gate区分，易把完整PR未达成的局部开发当通过。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

local阶段仅现有typed合同和安全失败，后序正式/native能力blocked；局部commit独立review不允许绕过完整PR/release门禁。

## 7. 结构化中间产物

### 5.1 实施依赖顺序

V1的最小纵切先是“启动时无业务权限、错误配置被拒绝且可验证”，再是“安全进入/呈现/受控提交”。风险Spike在受影响phase开工前执行，具体见§9；设计计划可收口，未确认的formal能力不能借fixture开工真实集成。本文允许流程数据呈现并行分支，但实施阅读、编辑、审计和boundary推进仍单agent串行。

#### 阶段依赖图: quantalithos-chat 实施阶段顺序

```text
PH-01 safe bootstrap + script contract
  -> PH-02 qualified entry + memory lifecycle
  -> PH-03 conversation/Turn + safe material UI
  -> PH-04 explicit send/governance result
  -> PH-05 source-local continuity/recovery
  -> PH-06 project/BPMN/directory
  -> PH-07 formal SDK/owner integration
  -> PH-08 actual native/Desktop/AT
  -> PH-09 complete regression/full EV
  -> PH-10 reviewed acceptance/release handoff
```

边界按同phase字母顺序及上述phase严格推进。前一boundary的scope检查不替代05完整PR gate；完整PR未通过前，局部commit可在获授权独立分支评审，但不得合并受保护交付分支或宣布全PR/release通过。当前不创建分支或commit。

### 5.2 阶段总表

| 阶段 | 名称 | 实施目标 | 依赖 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 安全启动与检查工具纵切 | 打开无业务权限的Desktop WebView入口，错误配置安全阻止装配；工具可验证machine/report合同 | 获授权实现、approved design baseline | bootstrap/config/source check；三个脚本与machine/schema/index-shell工具 | config/boundary/report的当前TC与schema负例；对应06配置/证据红线；无fullPR/EV pass |
| PH-02 | 安全进入与memory材料生命周期 | 正确进入不同对话语境；换actor/scope或撤销后旧response与cache不能泄露 | PH-01 | qualified导航/current request隔离；root store、safe材料、memory repo与清理 | navigation/persistence/freshness当前矩阵与CAS/revoke/delete失败；06访问/持有红线 |
| PH-03 | 对话与安全协作材料可访问呈现 | 在同safe surface渲染Turn/摘要/GateCard/ref/preview，键盘/IME/焦点与失败姿态可验证 | PH-02 | 对话/thread UI、Turn分页与fallback；来源/摘要/ref/预览/GateCard callback | presentation/AT当前instance、unsafe preview与不可见目标；06功能/来源/可访问性门禁 |
| PH-04 | 发送与治理意图结果闭环 | 草稿到一次dispatch再到正式结果或unknown；治理操作受控，ACK/点击不confirm | PH-03 | draft/composer/attempt/result/probe/retry；GovernanceIntent与GateCard反馈 | intent全合法/非法状态和竞态；06协议/状态/ACK一票否决；真实层仍blocked |
| PH-05 | 实时缺口、恢复与显式低敏支持 | source-local变化去重/重连/requery；离线和重启不虚构新鲜或自动提交；support显式受限 | PH-04 | reducer/resume/gap/source watermark；offline/restart/stale/unknown编排和disabled诊断 | continuity/diagnostic全参数与late/revoke竞态；06一致性/恢复/脱敏红线 |
| PH-06 | 项目、BPMN下钻与公司人员入口 | 项目统一五tab，任务进入流程上下文；整体/阶段/节点只读BPMN及多群关联/公司目录可点击可恢复 | PH-05 | 项目pages/models；三级Process图+等价列表；群聊关系/三类成员及provider coverage | process/directory及AT/parent-version/gap全参数；06项目流程/关系/目录门禁 |
| PH-07 | 正式SDK与实际owner消费集成 | 逐operation绑定正式exports与error/result资格，实际跨端change/resume/preview/关系来源可核验 | PH-06 | typed SDK adapters与正式profile；sdk-real实际测试与safe source材料 | TC-REAL-001/004正式环境及当前local回归；06跨仓/证据门禁；未闭合operation blocked |
| PH-08 | 可信native与实际Desktop/AT体验 | trusted origin/window/kind下最小host能力、真实窗口/恢复/键盘读屏矩阵得到本层证明 | PH-07 | Tauri host/DesktopAdapter；host-unit完整TS/Rust参数与desktop-real/at-real | nativeguard正反例、TC-REAL-002/003批准OS/AT；06 native/可访问性与VETO |
| PH-09 | 全参数回归与完整EV归档 | 补全216TC参数和16suite、质量预算测量、错误/竞态/安全回归，真实machine形成fullEV | PH-08 | 剩余error/report/质量参数、full run machine/index/16EV detail/审阅输入 | 完整05 PR/nightly/staging/release各自scope gate；06全部142P0/10VETO的实际证据资格 |
| PH-10 | 验收初稿、审阅与受控交付 | 私有DTO把actual run→gate/defect/risk/review签署连接；真实审阅决定放行和交付 | PH-09 | acceptance writer/checks、review初稿；六角色实际签署与release/handoff记录（需未来批准） | 06 chat.acceptance.v1/schema/digest/E018/六签署及§4/11～14真实裁决；07完成谓词 |

### 5.3 PH-01 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 打开无业务权限的Desktop WebView入口，错误配置安全阻止装配；工具可验证machine/report合同 |
| 输入 | 03 §3/4/5.9/5.10/16；04 §3～11；05 §9/13；06 §3/10；实施授权/不可变设计baseline；§3.2对应calibration |
| 输出 | bootstrap/config/source check；三个脚本与machine/schema/index-shell工具；commit-01-a, commit-01-b；实际检查仅本层scope |
| 不包含 | 正式owner读取、完整suite/EV与native positive能力 |
| 验证/验收 | config/boundary/report的当前TC与schema负例；对应06配置/证据红线；无fullPR/EV pass；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | 精确工具/依赖版本、批准source、实现授权与design baseline |
| 允许报告成熟度 | script_capability → index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.4 PH-02 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 正确进入不同对话语境；换actor/scope或撤销后旧response与cache不能泄露 |
| 输入 | 03 §5.1/5.2/5.6/7/8/9.4/10～12；05 §6；06 §5～8；PH-01；§3.2对应calibration |
| 输出 | qualified导航/current request隔离；root store、safe材料、memory repo与清理；commit-02-a, commit-02-b；实际检查仅本层scope |
| 不包含 | durable/真实SDK权限、发送或后序change成功 |
| 验证/验收 | navigation/persistence/freshness当前矩阵与CAS/revoke/delete失败；06访问/持有红线；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | 正式Entry/visibility/safe locator合同（真实绑定仍blocked） |
| 允许报告成熟度 | index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.5 PH-03 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 在同safe surface渲染Turn/摘要/GateCard/ref/preview，键盘/IME/焦点与失败姿态可验证 |
| 输入 | 03 §5.3/7.4/8.4/9.5；05 §6/10；06 §5～7/9；PH-02；§3.2对应calibration |
| 输出 | 对话/thread UI、Turn分页与fallback；来源/摘要/ref/预览/GateCard callback；commit-03-a, commit-03-b；实际检查仅本层scope |
| 不包含 | 治理或发送正式提交、Process图、真实host/AT证明 |
| 验证/验收 | presentation/AT当前instance、unsafe preview与不可见目标；06功能/来源/可访问性门禁；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | Turn/summary/Gate/Artifact/Workspace正式safe能力 |
| 允许报告成熟度 | index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.6 PH-04 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 草稿到一次dispatch再到正式结果或unknown；治理操作受控，ACK/点击不confirm |
| 输入 | 03 §5.4/7.3/7.4.6～7/8.3/9.6/12；05 §6；06 §7/8/11；PH-03；§3.2对应calibration |
| 输出 | draft/composer/attempt/result/probe/retry；GovernanceIntent与GateCard反馈；commit-04-a, commit-04-b；实际检查仅本层scope |
| 不包含 | SDK真实receipt可用声明、离线队列自动重发 |
| 验证/验收 | intent全合法/非法状态和竞态；06协议/状态/ACK一票否决；真实层仍blocked；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | 正式command/result/idempotency/probe/Governance资格 |
| 允许报告成熟度 | index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.7 PH-05 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | source-local变化去重/重连/requery；离线和重启不虚构新鲜或自动提交；support显式受限 |
| 输入 | 03 §5.5/7.7～9/8.7～9/9.7/10～14；04 §8～11；05 §6/13；06 §8/10；PH-04；§3.2对应calibration |
| 输出 | reducer/resume/gap/source watermark；offline/restart/stale/unknown编排和disabled诊断；commit-05-a, commit-05-b；实际检查仅本层scope |
| 不包含 | 内部bus、SDK未有cursor、后台审计、durable草稿恢复 |
| 验证/验收 | continuity/diagnostic全参数与late/revoke竞态；06一致性/恢复/脱敏红线；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | 正式change qualification/coverage/resume；diagnostic正式sink |
| 允许报告成熟度 | index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.8 PH-06 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 项目统一五tab，任务进入流程上下文；整体/阶段/节点只读BPMN及多群关联/公司目录可点击可恢复 |
| 输入 | 03 §5.3/7.6/7.10/8.6/8.10/9.5；05 §6/7；06 §5/7/8；PH-05；§3.2对应calibration |
| 输出 | 项目pages/models；三级Process图+等价列表；群聊关系/三类成员及provider coverage；commit-06-a, commit-06-b, commit-06-c；实际检查仅本层scope |
| 不包含 | client建立项目群关系truth、从Runtime/Work反推分支汇聚、provider缺失称完整目录 |
| 验证/验收 | process/directory及AT/parent-version/gap全参数；06项目流程/关系/目录门禁；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | CHAT-UP-008/009与Work/Process/directory/关系正式source |
| 允许报告成熟度 | index_shell；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.9 PH-07 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 逐operation绑定正式exports与error/result资格，实际跨端change/resume/preview/关系来源可核验 |
| 输入 | 03 §5.7/7/13/17；04 §6/12；05 §8/9/13；06 §7/10/13；PH-06；§3.2对应calibration |
| 输出 | typed SDK adapters与正式profile；sdk-real实际测试与safe source材料；commit-07-a, commit-07-b；实际检查仅本层scope |
| 不包含 | local port名冒充SDKexport、owner私有HTTP/bus、fake替真实 |
| 验证/验收 | TC-REAL-001/004正式环境及当前local回归；06跨仓/证据门禁；未闭合operation blocked；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | CHAT-UP-001～009、WS-UP-001～008及正式测试数据/批准source |
| 允许报告成熟度 | index_shell；仅已测formal层；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.10 PH-08 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | trusted origin/window/kind下最小host能力、真实窗口/恢复/键盘读屏矩阵得到本层证明 |
| 输入 | 03 §5.8/5.11/7.5/9.8；04 §6～11；05 §8/10；06 §9/11；PH-07；§3.2对应calibration |
| 输出 | Tauri host/DesktopAdapter；host-unit完整TS/Rust参数与desktop-real/at-real；commit-08-a, commit-08-b；实际检查仅本层scope |
| 不包含 | 任意file/shell/URL权限、未定safe_storage/controlled_open插件、Mobile |
| 验证/验收 | nativeguard正反例、TC-REAL-002/003批准OS/AT；06 native/可访问性与VETO；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | native policy/origin/window、精确版本、批准OS/WebView/AT/签名来源 |
| 允许报告成熟度 | index_shell；仅已测native/manual层；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.11 PH-09 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 补全216TC参数和16suite、质量预算测量、错误/竞态/安全回归，真实machine形成fullEV |
| 输入 | 03 §11～15；04 §10/11；05 §9～14；06 §6/9～13；PH-08；§3.2对应calibration |
| 输出 | 剩余error/report/质量参数、full run machine/index/16EV detail/审阅输入；commit-09-a, commit-09-b；实际检查仅本层scope |
| 不包含 | 缺case补pass、跨run拼证据、生成最终acceptance verdict/signoff |
| 验证/验收 | 完整05 PR/nightly/staging/release各自scope gate；06全部142P0/10VETO的实际证据资格；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | CHAT-BASE-001、预算、精确source/release、retention/ACL与残余上游合同 |
| 允许报告成熟度 | full_ev；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.12 PH-10 可验证增量

| 项 | 收口规则 |
|---|---|
| 功能增量 | 私有DTO把actual run→gate/defect/risk/review签署连接；真实审阅决定放行和交付 |
| 输入 | 05 §13；06 §3/4/10～14；07 §7/11/12；PH-09；§3.2对应calibration |
| 输出 | acceptance writer/checks、review初稿；六角色实际签署与release/handoff记录（需未来批准）；commit-10-a, commit-10-b；实际检查仅本层scope |
| 不包含 | writer代签、prototype/safe commit摘要当Evidence、dirty/旧baseline移交 |
| 验证/验收 | 06 chat.acceptance.v1/schema/digest/E018/六签署及§4/11～14真实裁决；07完成谓词；§7追溯到既有TC/EV/gate，未满足前置如实blocked |
| 外部/执行前置 | BASE001、角色/审阅/风险批准、实际验收与发布授权、release/保留政策 |
| 允许报告成熟度 | acceptance_handoff；须§7升级资格，phase计划存在不授予writer成熟度 |

### 5.13 顺序与开工纪律

安全/配置及工具版本资格在最先，访问与局部CAS早于展示/意图；意图结果门控早于实时消费和恢复；项目流程依赖既有context/安全材料；local端已可证明安全失败后再进入formal/native；全EV必须等全部实际层，验收与release再等fullEV和实际审阅。按此顺序，各phase既可验证自己的增量，也能回退当前adapter/affordance至明确unavailable；不能把后序操作填成empty/fake成功。

字段级carrier、readonly props或port签名可在其首次调用boundary预先定义，但未实现的能力/方法/state必须明确reserved/blocked且零IO；不创建placeholder success。所有共享文件按§6的内容scope打开，不能一次性补齐后续facade/state/manifest runner。每phase的设计停审记录留Step5；实施实际gate状态留实施台账且现在waiting。

### 本Step过程审查（不进正式正文）

#### Phase设计停审（串行，非实现结果）

| Phase | 可验证性/前置/越界/门禁审查 | 本地设计结论 | 保留缺口/修正 |
|---|---|---|---|
| PH-01 | 增量=打开无业务权限的Desktop WebView入口，错误配置安全阻止装配；工具可验证machine/report合同；依赖基线/授权；排除正式owner读取、完整suite/EV与native positive能力；验证=config/boundary/report的当前TC与schema负例；对应06配置/证据红线；无fullPR/EV pass | reviewed_design_with_blockers；只允许相应planned范围 | 精确工具/依赖版本、批准source、实现授权与design baseline；未以后序证据消解 |
| PH-02 | 增量=正确进入不同对话语境；换actor/scope或撤销后旧response与cache不能泄露；依赖PH-01；排除durable/真实SDK权限、发送或后序change成功；验证=navigation/persistence/freshness当前矩阵与CAS/revoke/delete失败；06访问/持有红线 | reviewed_design_with_blockers；只允许相应planned范围 | 正式Entry/visibility/safe locator合同（真实绑定仍blocked）；未以后序证据消解 |
| PH-03 | 增量=在同safe surface渲染Turn/摘要/GateCard/ref/preview，键盘/IME/焦点与失败姿态可验证；依赖PH-02；排除治理或发送正式提交、Process图、真实host/AT证明；验证=presentation/AT当前instance、unsafe preview与不可见目标；06功能/来源/可访问性门禁 | reviewed_design_with_blockers；只允许相应planned范围 | Turn/summary/Gate/Artifact/Workspace正式safe能力；未以后序证据消解 |
| PH-04 | 增量=草稿到一次dispatch再到正式结果或unknown；治理操作受控，ACK/点击不confirm；依赖PH-03；排除SDK真实receipt可用声明、离线队列自动重发；验证=intent全合法/非法状态和竞态；06协议/状态/ACK一票否决；真实层仍blocked | reviewed_design_with_blockers；只允许相应planned范围 | 正式command/result/idempotency/probe/Governance资格；未以后序证据消解 |
| PH-05 | 增量=source-local变化去重/重连/requery；离线和重启不虚构新鲜或自动提交；support显式受限；依赖PH-04；排除内部bus、SDK未有cursor、后台审计、durable草稿恢复；验证=continuity/diagnostic全参数与late/revoke竞态；06一致性/恢复/脱敏红线 | reviewed_design_with_blockers；只允许相应planned范围 | 正式change qualification/coverage/resume；diagnostic正式sink；未以后序证据消解 |
| PH-06 | 增量=项目统一五tab，任务进入流程上下文；整体/阶段/节点只读BPMN及多群关联/公司目录可点击可恢复；依赖PH-05；排除client建立项目群关系truth、从Runtime/Work反推分支汇聚、provider缺失称完整目录；验证=process/directory及AT/parent-version/gap全参数；06项目流程/关系/目录门禁 | reviewed_design_with_blockers；只允许相应planned范围 | CHAT-UP-008/009与Work/Process/directory/关系正式source；未以后序证据消解 |
| PH-07 | 增量=逐operation绑定正式exports与error/result资格，实际跨端change/resume/preview/关系来源可核验；依赖PH-06；排除local port名冒充SDKexport、owner私有HTTP/bus、fake替真实；验证=TC-REAL-001/004正式环境及当前local回归；06跨仓/证据门禁；未闭合operation blocked | reviewed_design_with_blockers；只允许相应planned范围 | CHAT-UP-001～009、WS-UP-001～008及正式测试数据/批准source；未以后序证据消解 |
| PH-08 | 增量=trusted origin/window/kind下最小host能力、真实窗口/恢复/键盘读屏矩阵得到本层证明；依赖PH-07；排除任意file/shell/URL权限、未定safe_storage/controlled_open插件、Mobile；验证=nativeguard正反例、TC-REAL-002/003批准OS/AT；06 native/可访问性与VETO | reviewed_design_with_blockers；只允许相应planned范围 | native policy/origin/window、精确版本、批准OS/WebView/AT/签名来源；未以后序证据消解 |
| PH-09 | 增量=补全216TC参数和16suite、质量预算测量、错误/竞态/安全回归，真实machine形成fullEV；依赖PH-08；排除缺case补pass、跨run拼证据、生成最终acceptance verdict/signoff；验证=完整05 PR/nightly/staging/release各自scope gate；06全部142P0/10VETO的实际证据资格 | reviewed_design_with_blockers；只允许相应planned范围 | CHAT-BASE-001、预算、精确source/release、retention/ACL与残余上游合同；未以后序证据消解 |
| PH-10 | 增量=私有DTO把actual run→gate/defect/risk/review签署连接；真实审阅决定放行和交付；依赖PH-09；排除writer代签、prototype/safe commit摘要当Evidence、dirty/旧baseline移交；验证=06 chat.acceptance.v1/schema/digest/E018/六签署及§4/11～14真实裁决；07完成谓词 | reviewed_design_with_blockers；只允许相应planned范围 | BASE001、角色/审阅/风险批准、实际验收与发布授权、release/保留政策；未以后序证据消解 |

#### 跨phase审计

| 审计项 | 结论 | 保留限制 |
|---|---|---|
| DAG与顺序 | 10phase有序链、21boundary按字母推进、无后序实施依赖 | 操作BPMN的parallel不授权实施并行 |
| 风险前置 | SDK/Process/provider/host/质量/source Spikes均在对应phase开工前 | §9决定继续/blocked，不自动关闭 |
| 类型/文件依赖 | 首次调用所需carrier owner最小路径在§6打开 | 未来方法reserved、未定义owner DTO不私造 |
| 可验证性 | 每phase有输入/输出/排除与typed断言/验收门禁 | 完整PR未满足不合并交付分支 |
| 证据成熟度 | index_shell→full_ev→acceptance_handoff分离 | fixture/preview/native/manual scope不互升 |
| 验收覆盖 | 142P0/10VETO及216TC/16EV在§7展开，无新编号 | BASE001和实际批准继续blocked |


## 8. 回填草稿

正式07 §5仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

十phase逐项复核功能增量/输入/输出/排除/门禁并附停审；有序依赖、外部前置与成熟度无未处理规划冲突；真实blocker保持open。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step6读取对应规范和来源。
