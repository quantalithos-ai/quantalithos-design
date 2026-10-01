# L5-chat 07 · Step 3 实施前置条件与阅读清单

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step4已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step2已done、07flow/项目台账与对应来源；07 SOP Step3、书写规范5.3；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

阅读按phase/boundary而非一次通读全部calibration；TS/TSX、JS/HTML脚本与Rust规范分别适用。git仅项目级；SDK file依赖不扩成owner Cargo依赖。十一列种子只索引执行规则，台账七gate与全量planned skeleton必须先于实现移交。

## 4. 当前文档问题诊断

当前未有07开工规则与记忆种子；源文件存在不能证明SDK可用或实现基线已批准。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 当前未有07开工规则与记忆种子；源文件存在不能证明SDK可用或实现基线已批准。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

按当前03已定单app/host布局落实检查；正式优先且不把校准或历史commit当truth；授权和实际gate独立，早期targeted检查不豁免05完整PR门禁。

## 7. 结构化中间产物

### 3.1 开工阅读顺序与冲突处理

每次继续先读项目实施台账、当前 boundary 台账、正式07当前 phase/boundary，再读下表；设计恢复另读 project_execution_ledger 与07 flow。正式00～07优先，calibration解释来源但不增补正式契约；两者冲突或正式schema缺失立即 wait_design，不让实现者择一猜测。旧README、旧正文、draft/prototype、/tmp/chat和未停审Bridges只能用于污染/视觉边界对照。

| 文档/规范 | 路径（设计仓根相对） | 阅读目的 | 未读风险 | 开工确认 |
|---|---|---|---|---|
| 当前00～02 | projects/L5-chat/00-需求文档.md、01-架构设计.md、02-概要设计.md | 产品/owner/依赖边界、Desktop V1和项目统一入口 | 复制原型truth、另造顶层进度 | 记录章节/版本与未关闭问题 |
| 当前03 | projects/L5-chat/03-详细设计.md §3～16 | 文件、carrier、函数、状态、测试与实现承接 | 私造SDK DTO/enum/repo key | 当前boundary逐项source map |
| 当前04 | projects/L5-chat/04-配置设计.md §3～13 | source/profile/敏感/激活/回退 | 配置赋权、秘密归档 | 记录profile与binding资格 |
| 当前05 | projects/L5-chat/05-测试方案.md §6～14 | 216 TC、suite、runner、schema/maturity | 参数分母缺失、fake冒称真实 | 冻结当前scope TC/variant manifest |
| 当前06 | projects/L5-chat/06-验收标准.md §3～14 | 142 gate、10VETO、证据和签署规则 | 点击/ACK当成功、伪验收 | gate→TC→EV→来源映射 |
| 当前07与台账 | projects/L5-chat/07-实施计划.md §3～12；design-calibration/implementation_execution_ledger.md、implementation-boundaries/<boundary_id>.md | 当前唯一boundary、门禁/恢复/移交 | 越boundary开工 | 核对current/next_allowed_action |
| TS/JS/HTML规范 | standards/coding/typescript.md、javascript.md、html.md | TS/TSX/脚本/宿主document | any、snake_case漂移、不安全DOM | 按实际语言逐项记录；未出现语言可N/A |
| Rust规范 | standards/coding/rust.md | host命名、英文注释、rustdoc/variant、fmt/clippy | 本地IPC绕过安全或注释不闭合 | host boundary开工重读 |
| 目录规范 | standards/document/子项目目录与代码文件组织规范.md | repo/package/crate/scripts/artifacts/reports | L5泄漏、latest/输出目录错位 | 与03 §4核对 |
| Git/台账规范 | projects/README.md §8.2；standards/document/代码实施台账与门禁规范.md §3～9 | 英文实现commit、scope与七gate | 全仓暂存、设计HEAD冒基线 | 仅读取历史commit，不推设计truth |
| 设计流程规范 | standards/document/设计文档编写通则.md、设计文档讨论中间产物规范.md、设计真相源闭环与可落码性标准.md §7/§9、全局项目依赖关系与裁剪规则.md §4.1 | 真相源/可落码/Layer5窗口 | 把并行窗口当项目内并行授权 | 每boundary审计与冲突暂停 |
| 07 SOP/书写规范 | standards/document/实施计划讨论流程_SOP.md、实施计划书写规范.md | phase/batch/commit/maturity纪律 | 一次搭完或证据超前 | 与当前正式07互校 |
| 专项owner当前00～07及必要台账 | projects/L0-sdk、L1-conversation、L1-identity、L1-work、L1-governance、L1-artifact、L1-workspace、L2-member、L2-runtime、L4-observability | public能力、truth/visibility/change/result归属 | 从safe ref推权限、直订bus | 按当前能力记录exact正式来源；文件存在不等可用 |
| Process补充来源 | projects/L1-process/01-架构设计.md、02-概要设计.md及后续获确认正式契约 | topology/state/version/branch/join来源 | 从工单/颜色推流程 | CHAT-UP-008未关，不能正向绑定 |

已刷新十个专项owner的80份正式文件指纹。artifact/workspace/member/runtime/observability现有项目台账已复核，其07设计收口均不等于实现可用；sdk/conversation/identity/work/governance当前无同名project_execution_ledger，记录缺失而非补造。未来SDK集成开工必须重新读取当时版本和能力证明。

### 3.2 阶段实施前阅读矩阵

PH-01～10和commit编号由§5/6定案；此表规定其必读映射，两个/三个同phase boundary还必须读§6自己的差异。calibration路径均相对 projects/L5-chat/design-calibration。

| phase / boundary | 必读正式章节 | 必读calibration | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 / commit-01-a、b | 03 §3/4/5.9/5.10/7.1/16；04 §3～11；05 §9/13；06 §3/10 | 03_ddd_step_03_constraints.md、03_ddd_step_04_file_layout.md、04_config_step_07_config_items.md、05_test_plan_step_09_automation_gates.md、05_test_plan_step_13_evidence.md | bootstrap/config与machine工具当前范围 | 当前基线、版本/source、载体schema、工具检查闭合 |
| PH-02 / commit-02-a、b | 03 §5.1/5.2/5.6/7/8/9.4/10～12；05 §6.2/6.3；06 §5～8 | 03_ddd_step_06_object_contracts.md、03_ddd_step_11_persistence_transaction_consistency.md、03_ddd_step_13_concurrency_idempotency.md | access/request隔离、memory repository清理 | owner access来源不由路由生成；memory不称durable |
| PH-03 / commit-03-a、b | 03 §5.3/7.4/8.4/9.5/11；05 §6/10；06 §5～7/9 | 03_ddd_step_05_module_contracts.md、03_ddd_step_07_trait_port_adapter_contracts.md、05_test_plan_step_06_cases.md | Turn/summary/GateCard/ref/preview渲染 | view model factory来源、unknown安全fallback |
| PH-04 / commit-04-a、b | 03 §5.4/7.3/7.4.6～7/8.3/9.6/12；05 §6；06 §7/8/11 | 03_ddd_step_08_protocol_contracts.md、03_ddd_step_09_function_flows.md、03_ddd_step_10_state_matrix.md | draft/intent/formal result/probe | 幂等authority/unknown禁止盲重发 |
| PH-05 / commit-05-a、b | 03 §5.5/7.7～9/8.7～9/9.7/10～14；04 §8～11；05 §6/13；06 §8/10 | 03_ddd_step_12_error_recovery.md、03_ddd_step_15_observability_audit.md、04_config_step_08_sensitive_secrets.md | source-local change/resume/恢复与低敏支持 | cursor/coverage来自SDK，disabled零IO |
| PH-06 / commit-06-a、b、c | 03 §5.3/7.6/7.10/8.6/8.10/9.5；05 §6.2/6.3；06 §5/7/8 | 03_ddd_step_06_object_contracts.md、03_ddd_step_09_function_flows.md、05_test_plan_step_07_test_data.md | 项目五tab、三级BPMN、群聊关系/公司目录 | graph/关系/provider正式source独立于目标权限 |
| PH-07 / commit-07-a、b | 03 §5.7/7/13/17；04 §6/12；05 §8/9/13；06 §7/10/13 | 03_ddd_step_14_config_external_binding.md、04_config_step_12_downstream_handoff.md、06_acceptance_step_07_interface_event_sync.md | formal SDK/owner changes/results实际绑定 | 相关CHAT-UP/WS-UP逐项closure与真实source profile |
| PH-08 / commit-08-a、b | 03 §5.8/5.11/7.5/9.8；04 §6～11；05 §8/10；06 §9/11 | 03_ddd_step_03_constraints.md、04_config_step_06_environment_profiles_matrix.md、05_test_plan_step_10_nonfunctional.md | native least authority与OS/AT矩阵 | native origin/window/权限、工具版本与批准OS/AT |
| PH-09 / commit-09-a、b | 03 §11～15；04 §10/11；05 §9～14；06 §6/9～13 | 05_test_plan_step_11_defects_retest.md、05_test_plan_step_13_evidence.md、06_acceptance_step_10_evidence_gates.md | 全参数质量回归、fullEV与红线 | 预算/source/保留ACL、缺失真实层仍blocked |
| PH-10 / commit-10-a、b | 05 §13；06 §3/4/10～14；07 §7/11/12 | 06_acceptance_step_10_evidence_gates.md、06_acceptance_step_14_verdict_signoff.md、07_implementation_plan_step_12_completion_criteria.md | 私有验收DTO/审阅/交付 | fullEV同基线；actual审阅/签署不由writer生成 |

### 3.3 永久记忆种子与生成门禁

只在未来获授权实施时机械逐条投影下表；现在不创建agent记忆/AGENTS文件。种子只保存执行规则/索引，不复制schema/enum/状态矩阵/TC全文或临时blocker内容。

| 记忆ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-CHAT-001 | project / phase / commit-boundary | 必读规范 | 开始代码、配置、脚本或测试改动前读取当前boundary技术栈规范、提交与目录规范，路径只取正式07阅读清单。 | 07 §3.1 | 07-实施计划.md | §3.1/3.2 | 首次开工、技术栈/路径变化 | until superseded | 正式优先，暂停并刷新 | 是 |
| MEM-CHAT-002 | commit-boundary | 工作区安全 | 修改与暂存只覆盖当前boundary允许文件，保留用户既有改动并逐个核对staged diff。 | 07 §3.1 | 07-实施计划.md | §10/11 | 每次编辑/提交前 | until superseded | 暂停核对scope | 是 |
| MEM-CHAT-003 | project / phase / commit-boundary | 实现前审计 | 移交实现或进入新baseline前按真相源闭环标准逐phase/boundary审计正式03/05/06/07，未过先回写设计并固定获批准基线。 | 07 §3.1 | 07-实施计划.md | §3/12 | 移交、新baseline | until superseded | wait_design，刷新记忆 | 是 |
| MEM-CHAT-004 | project / commit-boundary | 经验检查 | 修复设计后判断改动项目归属与可复用经验，需经验时登记标准/SOP/种子及具体示例，同项目提交合并和不同项目新提交仅在已有提交授权内执行，最后给出继续交接。 | 07 §3.1 | 07-实施计划.md | §3.3/11 | 每次设计修复后 | until superseded | 超授权先停，正式优先 | 是 |
| MEM-CHAT-005 | project / commit-boundary | 设计缺口 | 正式文档不清读对应calibration，仍缺字段/来源/状态或冲突即wait_design并登记blocker，禁止靠实现选择补齐。 | 07 §3.1 | 07-实施计划.md | §3.1/9/10 | 每次恢复/缺口 | until superseded | 暂停，刷新source | 是 |
| MEM-CHAT-006 | project / commit-boundary | 台账恢复 | 每次继续先读实施项目台账和当前boundary台账，只有唯一current且Design/Scope Gate实际pass后才改代码。 | 07 §3.1 | 07-实施计划.md | §3.6/11 | 每次继续/换boundary | until superseded | 缺台账即暂停 | 是 |
| MEM-CHAT-007 | commit-boundary | 证据边界 | 按正式05/06/07批准成熟度生成实际run材料，不补造run、TC结果、EV、签署或readiness，blocked与not_run如实保留。 | 07 §3.1 | 07-实施计划.md | §7/12 | 每次门禁/report | until superseded | 降级并停交付 | 是 |
| MEM-CHAT-008 | project / phase | owner边界 | SDK public能力是业务接入唯一入口，组件与host只承担正式03规定的客户端职责，缺正式export保持blocked。 | 07 §3.1 | 03-详细设计.md | §3/5/13/16 | SDK/owner基线变化 | until superseded | wait_design | 是 |
| MEM-CHAT-009 | commit-boundary | 提交纪律 | 实现commit用英文type(scope): subject和Co-Authored-By，提交前七gate按台账查明，未经授权不得commit或amend。 | 07 §3.1 | 07-实施计划.md | §11 | 每次提交前 | until superseded | 暂停核对授权 | 是 |
| MEM-CHAT-010 | project | owner临时约束 | 当前项目阅读、分析、编辑和审计仅由当前agent串行完成，不创建、调用或委派代理。 | 不适用 | 07-实施计划.md | §3.3 | 每次恢复、owner约束变化 | owner明确撤销后 | 保留约束并暂停冲突 | 是 |
| MEM-CHAT-011 | project | owner临时约束 | 当前授权仅设计与planned台账，完成07后停审，代码实施、真实运行和commit需相应后续明确授权。 | 不适用 | 07-实施计划.md | §3.3/12 | 授权范围变化 | 后续明确授权替代相应部分后 | 未授权即等待 | 是 |

生成gate检查种子存在/稳定ID/十一字段完整、逐字投影、规范路径来自§3.1、无设计truth复制、临时规则失效条件、审计与经验规则齐全。任一失败不得生成记忆；未来源变更仅刷新命中的种子，不能自由扩写。

### 3.4 Git、目录与本地依赖前置

以下仅未来实现仓授权后的计划命令，当前未执行配置、创建仓库或依赖解析。

```sh
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

只用项目级配置，不用--global；读提交规范与目标仓历史message供格式参考，历史实现不成为设计truth。

| 检查项 | 要求 | 确认方式 | 失败处理 |
|---|---|---|---|
| 实现仓 | /home/aris/Projects/quantalithos-chat（当前不存在） | 路径/权限/用户授权 | waiting，不自行创建 |
| frontend | 根private npm chat；src功能模块；strict TS/React/Vite | package/tsconfig与03 §4对应 | wait_design |
| native | src-tauri单crate；package chat-desktop、lib chat_desktop、bin chat | Cargo与03 §4对应，无虚构crates workspace | wait_design |
| naming | snake_case文件、TS UpperCamelCase类型/lowerCamelCase函数；无L5/l5_层级 | 源码/manifest定向检查 | 当前scope修复或设计暂停 |
| SDK编译依赖 | file:../quantalithos-sdk/packages/typescript；包存在，private @quantalithos/sdk@0.1.0骨架 | manifest/barrel/exact正式exports与版本兼容 | 目录存在不等能力可用；blocked绑定 |
| owner运行/事件依赖 | SDK typed query/command/change/resume/ref；无直接Cargo/npm owner依赖 | public export/profile/source核对 | fixture仅local scope，真实层blocked |
| host依赖 | Tauri approved版本与最小capability，不引用core/bus/owner crates | Cargo/lock/capabilities | 缺批准版本/权限暂停native |
| 工具链 | Node/npm、TS/React/Vite/test runners、Rust/Tauri/WebView精确版本待批准 | --version、实际resolver lock、source provenance | 受影响boundary blocked，不手写lock |
| 服务/数据 | local阶段仅typed test doubles和memory；真实环境由SDK正式profile/credential引用 | profile capability检查，不启动私有bus/DB | formal集成前置缺失即blocked |

中期private SDK tag/rev必须经兼容和来源批准再替代本地file；不要求公共发布。凭据由SDK/session/platform正式通道取得，不注入client-config、fixture、URL或report。

### 3.5 脚本、产物与检查前置

scripts/gates/run_ci_gate.sh、scripts/reports/generate_reports.sh、scripts/checks/check_redaction.sh在§4/6成为计划交付物；scripts/dev/仅实际开发辅助需要时在同boundary登记，不能空建或放业务IO。artifacts/test/<run_id>与reports/runs/<run_id>由实际run创建，report root是reports/；禁止项目再嵌套、latest正式引用、跨run混并及symlink逃逸。05 §9.3三个CLI与初次/最终redaction顺序保持原样，完整命令见§7。

目录、脚本参数、schema/digest/maturity与writer/reader必须一起检查；早期仅targeted检查证明当前scope，05的完整PR/release gate未满足时继续blocked，不能宣布全suite/EV pass。

### 3.6 台账与七门禁入口

| 台账 | 路径（本项目相对） | 创建/读取时机 | 缺失处理 |
|---|---|---|---|
| 设计台账 | design-calibration/project_execution_ledger.md | 设计恢复/源变化 | 暂停核对source |
| 实施项目台账 | design-calibration/implementation_execution_ledger.md | 正式07收口创建；每次继续/基线变化先读 | 不开工 |
| 全量boundary台账 | design-calibration/implementation-boundaries/commit-xx-x.md | 正式07按§6全部预创建；修改/运行/提交/移交前读当前 | 缺当前不编辑；缺未来不移交 |
| 可选scratch | <implementation_repo>/.codex/implementation_ledger.md | 未来授权后需要本地恢复时创建；非正式恢复真相源 | 不要求当前创建，状态以设计仓实施台账为准 |

Boundary Gate Matrix在§6逐boundary列出Design/Scope/Build/Test/Evidence/Commit/Handoff。开工必须固定获批准且包含正式07的不可变设计commit、source freshness、逐boundary闭环审计与allowed/forbidden scope并实际pass；本轮观察HEAD只作观察值，current_design_baseline=waiting。只有一个current_boundary；第一boundary blocked/wait_design，其余planned/wait_until_current，所有实际gate waiting/blocked，不因skeleton存在变pass。提交前核对staged exact scope/message/whitespace/required checks，提交后记录真实hash、未跑tests、blocker与next；计划标题不等commit。

## 8. 回填草稿

正式07 §3仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

十phase阅读映射、十一条十一列种子、目录/npm/Cargo与SDK路径、三个脚本和台账入口已逐项核对；缺失owner台账明确记录，所有执行事实waiting。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step4读取对应规范和来源。
