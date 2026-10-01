# L5-chat 03 详细设计校准流程

> 04必要反向校准记录（2026-10-01）：用户完成全部04授权内，正式03 §5.9.1.1/§13及Step6/14补八域模块JSON→flat14字段、strict source重复键/plain-data校验、UTF-16单位和startup全量freeze。签名/14字段/状态/owner不变；source为04 Step7/9/14，已回写，正式03仍停审。外部SDK/host/生产质量门禁继续blocked，无实现或commit。

> 当前完成记录（2026-10-01）：Step11～19已依次完成，原路径正式03十八章已装配并停审。§6/§8及“前轮历史记录”仅记历史停点，当前以§1状态表和项目台账为准。静态核对43协议/43flow/43调用图、17主体/17状态图、12enum、15错误码、14配置字段，类型/表格/围栏/文件链接通过。无实现、应用测试、commit或readiness；04等待用户另行授权。

> 文档类型：`03-详细设计.md`
> 当前模式：`step11-to-step19 + single-agent-serial`；前轮修复结果作为当前输入。
> 生成流程：`standards/document/详细设计讨论流程_SOP.md` Step 1～19
> 结果结构：`standards/document/详细设计书写规范.md` §1～§18
> 当前状态：formal_stop_review；Step1～19 done，正式03已完成并停审；gate_status：pass_with_upstream_blockers。上游binding继续blocked，实施not_started；不进入04。
> 修改范围：只允许修改 `projects/L5-chat/`；不实现代码、不修改 SDK 或其他项目正式文档、不执行测试、不提交 commit。

## 1. 执行状态台账

### 当前Step5～10连续授权（2026-10-01）

直接基线为修复后00/01/02及已重审Step1～4。Step5/6复核当前契约闭包，Step7原位续写，后续文件只在前一步设计门禁通过后创建。Governance只作为结构/粒度参考，不复制其后端truth或协议。

| Step | 当前重审状态 | 当前动作/门禁 |
|---|---|---|
| 1 | done | 当前基线/主语/缺口已修复，pass_with_upstream_blockers |
| 2 | done | 当前Desktop主线/非范围修复，pass_with_blockers |
| 3 | done | 规范/技术及source命名边界修复，pass_with_upstream_blockers |
| 4 | done | planned布局/文件职责补齐，pass_with_upstream_blockers |
| 5 | done | Governance职责/依赖/对象归属/测试切口模板已核对，十一模块独立停审；pass_with_upstream_blockers |
| 6 | done | 6-A～F独立载体/Deps/前入口资格/隐藏字段/dispatch reservation闭口，pass_with_upstream_blockers；local缺口closed_design |
| 7 | done | consumer ports/读取面/版本/blocked binding按模块停审，pass_with_upstream_blockers |
| 8 | done | 43项独立local协议/schema/字段/错误/幂等停审；pass_with_upstream_blockers |
| 9 | done | 43独立flow/call图/typed伪代码/版本/状态/切口及反向字段闭口，pass_with_upstream_blockers |
| 10 | done | 17local主体、12canonical enum、逐机图/矩阵/非法/切口与43flow回指完成；pass_with_upstream_blockers；前轮停审已获本轮续行授权 |
| 11 | done | pass_with_upstream_blockers；local store、版本CAS、异步effect及rebuild来源已闭口；03_ddd_step_11_persistence_transaction_consistency.md |
| 12 | done | pass_with_upstream_blockers；15错误码、protocol映射及副作用分级恢复已闭口；03_ddd_step_12_error_recovery.md |
| 13 | done | pass_with_upstream_blockers；并发资源、43协议去重及SDK幂等门禁已闭口；03_ddd_step_13_concurrency_idempotency.md |
| 14 | done | pass_with_upstream_blockers；14配置字段、装配与SDK/host依赖绑定已闭口；03_ddd_step_14_config_external_binding.md |
| 15 | done | pass_with_upstream_blockers；低敏显式交付、metrics阻塞及owner审计边界已闭口；03_ddd_step_15_observability_audit.md |
| 16 | done | pass_with_upstream_blockers；43协议/17状态正反向及planned脚本证据边界已闭口；03_ddd_step_16_test_cuts.md |
| 17 | done | pass_with_upstream_blockers；承接阅读与十类跨文档闭环预审已完成，移交仍waiting；03_ddd_step_17_implementation_handoff.md |
| 18 | done | pass_with_upstream_blockers；上游/本地/后续风险与解除门禁已集中，允许正式装配；03_ddd_step_18_risks_open_questions.md |
| 19 | done | pass_with_upstream_blockers；18章正式03原路径装配及静态审查完成；03_ddd_step_19_formal_document_assembly.md |

### 前轮历史记录

| Step | 主题 | 输出文件 | 回填章节 | 状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|
| 1 | 确认概要设计输入边界 | `03_ddd_step_01_upstream_boundary.md` | §1、§17 | `done` | `pass` | 正式 00～02 承接关系、本文边界与缺口已辨明；02 的客户端骨架足以进入范围确认。 | 创建并执行 Step 2 | `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*` 继续开放 |
| 2 | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | §2 | `done` | `pass_with_blockers` | 已把目标限定为客户端展示/受控交互实现契约；正向接入范围受上游能力阻塞。 | 创建并执行 Step 3 | SDK/owner exact contracts |
| 3 | 收稳编码规范、语言/runtime、仓库约束 | `03_ddd_step_03_constraints.md` | §3、§16、§17 | `done` | `pass_with_upstream_blockers` | 按既有授权完成 React/TS + Tauri 2、npm/Vite、混合工程规范和真实 SDK source 分类；技术/编码假 blocker 已关闭。 | 重建 Step 4 文件布局 | SDK exact contract/host capability/durable storage资格保持开放 |
| 4 | 收稳实现单元与文件布局 | `03_ddd_step_04_file_layout.md` | §4、§16、§17 | `done` | `pass_with_upstream_blockers` | 单TS app + Tauri host映射、计划树、文件职责、命名和真实SDK路径已闭合；历史顺序错误已记录并按Step3pass后重建纠正。 | 到Step4停审，不创建Step5 | inherited SDK/owner/host/storage integration blockers |
| 5 | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | §5 | `done` | `pass_with_upstream_blockers` | 模块小循环、依赖方向、对象/port归属已审计。 | 进入Step6 | inherited integration blockers |
| 6 | 对象实现契约 | `03_ddd_step_06_object_contracts.md` | §5/§6 | `done` | `pass_with_upstream_blockers` | 逐模块对象/props/字段/函数/状态与跨模块来源审计完成。 | 进入Step7 | inherited blockers |
| 7 | Port/Adapter契约 | `03_ddd_step_07_trait_port_adapter_contracts.md` | §5/§6 | `in_progress` | `reviewing` | Step6通过，逐模块闭合typed ports与adapter。 | 逐模块接缝小循环 | inherited blockers |
| 8 | 协议契约 | `03_ddd_step_08_protocol_contracts.md` | §7 | `planned` | `not_created` | 已授权，须等待Step7通过。 | 按协议族展开 | inherited blockers |
| 9 | 函数级处理流 | `03_ddd_step_09_function_flows.md` | §8 | `planned` | `not_created` | 已授权，须等待Step8通过。 | 逐接口展开 | inherited blockers |
| 10 | 状态矩阵 | `03_ddd_step_10_state_matrix.md` | §9 | `planned` | `not_created` | 已授权，须等待Step9通过。 | 逐状态机审计后停审 | inherited blockers |
| 11～19 | 后续详细设计与装配 | 按 SOP 逐步创建 | §10～§18 | `planned` | `waiting_user_authorization` | 本轮未授权，不创建文件。 | Step10停审 | inherited blockers |

## 2. 总流程计划

```text
Step 1 上游输入边界 -> Step 2 范围 -> Step 3 编码/运行/仓库约束 -> Step 4 实现单元与文件布局
  -> Step 5 模块主轴 -> Step 6 对象契约 -> Step 7 port/adapter -> Step 8 协议契约
  -> Step 9 函数级处理流 -> Step 10 状态机 -> Step 11 持久化/一致性 -> Step 12 错误/恢复
  -> Step 13 并发/幂等 -> Step 14 配置/依赖绑定 -> Step 15 可观测性/审计
  -> Step 16 测试切口 -> Step 17 实施承接 -> Step 18 风险 -> Step 19 正式装配
```

Step 文件必须在前一步通过后再创建。若本步 blocker 导致 gate 未通过，不能继续制造下一 Step 文件。

## 3. 本次输入与裁剪

| 输入 | 定位 | 处理规则 |
|---|---|---|
| `projects/L5-chat/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | `current_formal_upstream` | 不改目标/owner边界/概要主语；01/02后置的载体与目录决策由Step3/4承接收敛。 |
| `projects/L0-sdk/00～07` 与所列正式 owner `00～07` | `current_formal_truth_owner_or_boundary` | 只引用当前正式合同；缺失 exact SDK/owner seam 保留 blocker，不推定方法、DTO、事件 schema。 |
| `projects/L6-bridges/` | `parallel_sibling_boundary_reference` | 未停审设计不得输入；只在需要时检查外部平台映射不进入 Chat。 |
| README、旧正式 `03` 和更早草案 | `historical_material` | 仅可用于污染诊断，禁止继承其目录、协议、对象或技术决定。 |

## 4. 继承 blocker

| ID | 来源 | 影响 | 处理状态 |
|---|---|---|---|
| `CHAT-UP-001～007` | SDK / owner public surface | query/command/change/ref/resume、Gate receipt、Artifact preview、Workspace view、摘要和诊断 seam | 保留 pending/blocked；不在 Chat 发明 schema |
| `CHAT-UP-008` | Process正式消费合同 | 整体/阶段拓扑、节点/分支/Gateway状态、关联、版本及SDK change/resume | Process owner已明确，具体SDK安全投影仍blocked；不从原型/Work/Runtime补图 |
| `CHAT-UP-009` | 绑定/目录正式provider合同 | 项目↔群聊关系owner、解除/撤销、逐目标access；人类/AI公司目录搜索/分页/覆盖 | provider未确认仍blocked；不合并三类成员或继承群聊权限 |
| `CHAT-BASE-001` | 00编号缺口 | 00 §16引用未定义AC-NFR008～024 | 保持open，本轮不改00；只承接实际AC-NFR001～007、NFR001～024及AC-FR011～014 |
| `CHAT-DDD-006-CARRIER-001` | Step6新粒度核对 | Input/Projection/Result/Qualification等local支撑载体及入口resolve前资格闭包 | closed_design；Step6 §15～20六批次补齐并停审，外部binding仍blocked |
| `WS-UP-001～008` | L1-workspace | workspace safe view、freshness、cursor、attention/export 等 | 只消费明确正式 surface |
| `OPEN-CHAT-*` | 本项目正式 00/01/02 | Desktop shell、跨端、缓存边界、quality 和其他开放项 | 按具体影响传播，不升级为事实 |
| `CHAT-DDD-003-TECH-001` | Step3与用户已认可方案 | React/TS + Tauri2、npm/Vite、TS与Rust规范已收敛 | resolved_for_design；不表示host兼容验证 |
| `CHAT-DDD-003-CODE-001` | 现有TS规范 | 规范已读取并与Rust分域承接 | resolved |
| `CHAT-DDD-004-LAYOUT-001` | Step4 | package/crate/bin/计划树与责任表明确 | resolved_for_design |
| `CHAT-DDD-003-DEP-001` / `CHAT-DDD-004-PLAT-001` | SDK与宿主合同 | SDK exact能力、IPC授权、durable安全存储与兼容资格仍待闭合 | open_integration；局部blocked，不阻塞已完成目录设计 |

## 5. 文档级停审约束

当前用户“现在完成全部03”授权Step11～19及正式03装配；此前Step10停点保留为历史。严格串行，每Step通过本地设计审查才进入下一Step；正式03完成立即停止，不进入04。

- 单agent串行，逐模块/协议/flow/状态机小循环；外部合同blocker不能伪造为已实现。
- 本轮创建Step11～19独立产物并原位更新正式 `03-详细设计.md`，不创建替代正式文档。
- Step 5 起应达到应用、页面、路由、组件、view model、client store、SDK adapter、事件 reducer、乐观/确认/失败状态、幂等重连、配置、测试切口和证据边界的实现级粒度；未经 gate 不得提前写入本轮产物。
- 任何将来 formal `03` 只有在 SOP Step 1～18 都有独立 pass 产物且有新的连续授权后方可装配；装配完立即停审。

## 6. 前轮停审记录

本轮修改既有Step1～7、此flow和project_execution_ledger共九文件；没有新建替代设计文档、未来Step或实现文件。静态核对：七新增关键对象及patch/page/topology helper单一定义，TS片段无snake_case成员，Rust注释英文，Markdown围栏成对且无重复标题，未创建Step8+。静态文档核对不是编译、run、测试结果或验收。

若后续授权完成Step7，先读本台账、修复后Step6、Step7已写前缀、详细设计SOP Step7与书写规范§5.5/§5.6，再核对SDK和Process/绑定/目录正式输入；按模块补waiting批次。当前停下，不提交commit。

## 7. 本轮执行计划与参考粒度

| Step | Governance参照 | Chat输出与门禁 |
|---|---|---|
| 5 | 同名Step文件§7模块职责/文件主体/对象归属/测试切口 | 十客户端模块+native host，具名ports归消费者，无后端事务对象 |
| 6 | 同名Step文件§7模板、§15应用carrier、§17字段/状态闭环 | 每对象typed字段、构造来源、factory/member/result/error、finite变体和跨模块审计；支撑载体随本边界闭口 |
| 7 | 同名Step文件§7～12版本读取/port/adapter及停审 | 本地CAS与SDK外部资格分离；无truth repository/UoW/outbox/bus；正向binding保持blocked |
| 8 | 同名Step文件协议族批次及逐协议schema | Chat-local UI/query/intent/change/recovery协议，每接口唯一输入/结果类型；无虚构SDK wire/HTTP/topic |
| 9 | 同名Step文件逐flow/重复/错误/事务与测试切口模板 | 每接口独立入口→SDK资格→factory/reducer→matched CAS→safe输出；dispatch一次、unknown只probe |
| 10 | 同名Step文件§5～8状态筛选/图/矩阵及跨状态审计 | 只客户端生命周期，排除ownertruth；触发回指Step6/9，非法迁移无副作用，测试均planned |

`pass_with_upstream_blockers`只允许已完整定义的Chat-local设计承接下一Step，不表示SDK/host/owner integration可落码或ready。若出现Chat-local类型/调用/状态缺口，必须回前序原文件修复后才通过，不以blocker标签掩盖。

## 8. Step5～10完成停审（2026-10-01）

当前恢复点以§1当前状态表为准，§2～7前轮/启动准备叙述只历史追踪。Step5职责模板复核；Step6原位六批次carrier及反向构造修复；Step7按consumer模块完整ports/blocked exact binding；Step8全43接口独立schema/全字段/actor/幂等/错误；Step9同43独立call图/伪代码/局部CAS/异常/切口；Step10 17local主语/12enum独立矩阵/非法/图/43flow审计。所有写入串行完成，无代理协作。

修改文件：Step6、Step7原位修复；新增Step8、Step9、Step10各独立中间产物（仅前步local gate通过后创建）；本flow、project_execution_ledger.md同步。Step5当前契约引用，00/01/02/旧formal03/原型/SDK/其他项目未作本轮修改。不创建implementation ledger或boundary skeleton，正式07完成前不得生成实施证据。

local缺口CHAT-DDD-006-CARRIER-001 closed_design；CHAT-UP001～009、WS-UP001～008、OPEN-CHAT、CHAT-BASE001、host/storage/config/quality仍open/blocked。SDK源码generic unknown publish/openSubscription仍throw host runtime wiring；正式owner能力不存在证据，不能fake补成bound。状态done只local校准设计门禁，不表示ready。

静态核对：43协议=43独立flow/43图；17主体=17图，12canonical enum；新增schema单一定义，围栏和表格列规范检查；正式03无写入。无实现/安装/build/run/test/commit/evidence/verdict/signoff/readiness。本轮stopped_after_step10；Step11～19 not_authorized。后续获授权才读项目台账/本flow/Step10、Step11 SOP/书写规范5.10、Governance Step11与必要上游local storage/SDK正式合同，再讨论一致性。
