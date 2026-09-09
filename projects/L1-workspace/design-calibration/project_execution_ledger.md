# L1-workspace 项目设计讨论执行台账

> 创建日期：2026-09-07  
> 当前模式：`full-restart + single-agent-serial`  
> 当前任务：完成 `07-实施计划.md` 正式装配并停审；00~06 已完成并停审，本轮不进入实现。
> 实施状态：`not_started`；本任务不实现代码、不执行测试、不提交 commit。  
> 讨论输入：`projects/L1-workspace/draft/` 三篇已确认预推演，仍须按每个 Step 独立复核。

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step13 | formal_assembly | formal_stop_review | 正式07已装配并完成静态审计；用户范围止于07，等待后续明确授权 | wait_for_user_authorization_after_07 | `design-calibration/07_implementation_plan_calibration_flow.md` |

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | `formal_stop_review` | Step 17 complete | `completed` | `WS-UP-001~008` |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | `formal_stop_review` | Step 16 complete | 用户已授权02 | `WS-UP-001~008/006-S` |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | `formal_stop_review` | Step 14 complete | 用户已明确同意继续03 Step1~4 | WS-UP-001~008/006-S |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | `formal_stop_review` | Step19 complete | 正式03与静态审计完成；等待用户确认04 | WS-UP-001~008/006-S；WS-LOCAL-001~003 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | `formal_stop_review` | Step15 complete | 正式04与静态审计完成；等待用户确认05 | WS-UP-001~008/006-S；WS-LOCAL-001~003 |
| `05-测试方案.md` | `design-calibration/05_test_calibration_flow.md` | `formal_stop_review` | Step15 complete | 已装配并停审；用户已授权继续06 | WS-UP-001~008/006-S；WS-LOCAL-001~003 |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | `formal_stop_review` | Step15 complete | 已装配并停审；用户已授权继续07 | WS-UP-001~008/006-S；WS-LOCAL-001~003 |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | `formal_stop_review` | Step 13 complete | 正式07、实施台账与8个boundary skeleton已静态审计；等待用户决定是否进入实现 | WS-UP-001~008/006-S；WS-LOCAL-001~003 |

## 3. 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 只修改设计仓 | active | 只修改 `projects/L1-workspace/` 下设计文档、校准材料和本项目台账。 |
| 单 agent 串行 | active | 本轮由唯一 agent 完成阅读、分析、写入和审计；不创建或调用 sub-agent。 |
| full-restart | active | README、ADR 草稿和旧材料只作 historical_material / 污染审计输入。 |
| 正式文档顺序 | active | 严格 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`。 |
| Step 顺序 | active | 05 Step1~9已完成；Step10~14首稿完成结论已撤销，按Step10→15逐步补审并同步台账。 |
| 不伪造事实 | active | 不写实现、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 不提交 | active | 用户未要求 commit，本轮不提交。 |

## 4. 当前上游 blocker / pending

| ID | 内容 | 影响 | 当前处置 |
|---|---|---|---|
| `WS-UP-001` | 各 L1 owner 的 workspace-safe query、摘要、版本/水位合同未统一闭口。 | 具体字段和 fresh barrier 不能固化。 | 需求层只写 no-write query 能力；逐域接入保持 pending。 |
| `WS-UP-002` | 各来源 event family、cursor、replay、rebuild 合同未逐项闭口。 | 不能声称实时投影或任意 offset 重放。 | 保留幂等、缺口、重建和保守降级要求。 |
| `WS-UP-003` | visibility / authorization decision 的 owning chain、撤销和时效未统一。 | 受影响内容不能默认展示。 | 缺失或冲突时 fail-closed。 |
| `WS-UP-004` | Inbox attention input、去重和生命周期未由各 owner 对齐。 | workspace 不得自行推断 attention。 | 首版只消费 owner 明示输入。 |
| `WS-UP-005` | Personal/Project scope 的正式 GlobalMember、Project、ProjectMember safe ref/query surface 未闭口。 | scope key、字段和错误语义 pending。 | 保留 scope 语义，不固化协议。 |
| `WS-UP-006` | SDK、产品、sync、archive 的稳定 read/export contract 未闭口。 | 不定义下游 API、snapshot 或归档协议。 | 只记录消费边界。 |
| `WS-UP-007` | workspace 专用 Core shared type/error/event 是否进入 L0-core 未确认。 | 不在本地复制 schema。 | `L0-core` 仅作为 compile candidate。 |
| `WS-UP-008` | 非项目型 personal execution subject 未定义。 | workspace 不得代替执行主语。 | 作为下游边界 blocker 传递。 |
| `WS-UP-006-S` | member-images 的静态 workspace seed/template owner 仍属 MI-UP-006 待确认。 | 不可把 live workspace 设为默认 seed 来源。 | 关联 WS-UP-006；保持 owner-neutral，不改变 00 的 read-model 范围。 |

### 4.1 架构阶段补充

- WS-UP-002：L0-bus 正式 07 PH-06 / 06 AC-FUNC-005 的 replay preparation 不证明 replay executor 已闭合；重建只能使用正式 owner baseline 与获准接续。
- WS-UP-003/005：逐来源、scope、主体和决定有效性/撤销必须共同成立；不把 governance 自动视为六域统一授权中心。
- WS-UP-006-S：来自 member-images 正式 02 §3 / MI-UP-006；静态模板与当前 read model 分离。
- 待回流目标与缺失证明记录于 `01_arch_step_14_risks_open_questions.md` §7.4。本轮写权限仅限本项目，未回写其他项目 flow/ledger，未通知或更改 owner；实际回流需另行授权。

### 4.2 文档切换批准记录

| 日期 | 用户指令 | 授权范围 | 不授权 |
|---|---|---|---|
| 2026-09-07 | 完成全部 01 | 正式 00 停审后，单 agent 按架构 SOP 完成 Step 1~16 和正式 01 | 进入 02、实现、执行测试、跨项目写入、commit |
| 2026-09-07 | 完成全部 02 | 完成02全14Step和正式文档 | 不自动解锁后续文档 |
| 2026-09-07 | 现在继续完成到 03 的 step4 完成 | 02完成停审后，继续03 Step1~4 | 未授权正式03装配或实现 |
| 2026-09-07 | 接下来 step5-step10 需要细致设计，参考L1-governance | 补强授权03 Step5~10，前序仍必须真实完成 | 03 Step11~19、正式03、实现、测试、跨项目写入、commit |
| 2026-09-07 | 我认可，继续推进到03的step4完成，step前停止 | 最新停点按“完成Step4、Step5开始前停止”执行；替代本轮旧Step10上限 | Step5~19、正式03装配、实现、测试、跨项目写入、commit |
| 2026-09-07 | 接下来完成step5-step10，需要参考L1-governance粒度和架构 | 最新授权单agent串行完成03 Step5~10 | Step11~19、正式03、实现、项目测试、跨项目写入、commit |

### 4.3 正式02停审记录

2026-09-07：完成Step6恢复补审，串行完成Step7~14并装配正式02。正式文档14章、七CP、16对象卡、14独立处理流；仅执行只读文档静态检查，无项目测试。WS-UP-001~008/006-S仍开放，未跨项目回写。

本轮变更：正式02；02 Step5/6回源修正；新增Step7~14；02 flow与本台账同步。正式00/01未修改，03尚未创建。按文档停审纪律停在02；下一轮明确继续后先读03 SOP/书写规范、编码/目录规范、已完成02与governance对应详细设计材料，再从03 Step1开始。原03范围授权到Step10有效，不进入Step11或装配正式03。不需要提交，未提交。

### 4.4 本轮03启动记录

2026-09-07：已核对正式02、02 flow/Step12/Step14及当前项目台账；读取详细设计SOP Step1~4和对应书写章节、目录/编码规范、指定上游专题及governance/artifact参考粒度。进入03校准，尚未形成正式03。本轮最新授权覆盖历史停点，§4.3和02材料中的Step10仅是此前停审时的记录，不再控制当前动作。

### 4.5 本轮03 Step4停点记录

2026-09-07：单agent串行完成03 Step1~4。输入/范围承接七CP、16对象和14入口；Step3确定planned Rust2024/MSRV1.93与Tokio异步边界、英文源码文档；Step4按小循环形成七role、77计划文件和测试发现路径，并完成来源/责任/依赖/历史污染/静态文档审计。计划文件不是已存在源码。

本轮修改：新增03 flow、03 Step1/2/3/4；更新本台账。正式00/01/02、draft/README及其他项目未由本轮修改。未创建Step5、正式03或目标实现仓，未执行项目测试、生成真实证据或commit。

上游：WS-UP-001~008/006-S仍开放，未新增owning blocker、未跨项目回写。目标实现仓缺失、具体driver/transport/第三方pin未闭合属于本地实施前置或后续设计决策，不能当作来源就绪。

下一步：先等用户明确确认；随后读本台账、03 flow/Step4、02 §5/12、详细设计SOP Step5与模块契约书写规范，参考governance/artifact对应粒度，回读受影响owner正式接缝。当前不需要提交，未提交。

### 4.6 03对象阶段局部回源修订

03 Step6审计发现LocalAttentionState的单ReadCursor骨架不能表达不可跨流比较的attention意图。仅重开02 §6此字段及02 Step6/flow作targeted repair：read_cursors集合、按正式stream唯一，不新增业务能力/状态/owner。其余00/01/02保持停审；修订后立即关闭02写入，继续03。外部stream identity/cardinality/comparator仍WS-UP-004，禁止凭集合发明owner schema。


### 4.7 03 Step5~10完成与停审记录

2026-09-07：按最新授权，唯一agent串行完成Step5模块、Step6对象（3附录）、Step7端口/完整callable、Step8十四入口协议、Step9十四函数流、Step10状态/分类矩阵。参考L1-governance的七模块分层、逐对象/协议/flow/状态审查粒度，不复制其Outbox/业务truth/归档写入。

| 本轮文件（均在本项目） | 变更 |
|---|---|
| `design-calibration/03_ddd_step_05_module_contracts.md` | 新增模块/依赖合同 |
| `design-calibration/03_ddd_step_06_object_contracts.md` | 新增对象阶段主控与审计 |
| `design-calibration/03_ddd_step_06a_shared_contracts.md` | 新增Core核验、局部词汇/外部slot |
| `design-calibration/03_ddd_step_06b_domain_objects.md` | 新增16对象/纯projector、字段/成员/状态 |
| `design-calibration/03_ddd_step_06c_support_services_entries.md` | 新增support/七service/六entry/infra availability |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 新增完整port/read-write pair/commit/carrier/callable |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | 新增14独立协议与公共DTO/receipt/页/metadata |
| `design-calibration/03_ddd_step_09_function_flows.md` | 新增14独立flow与原子/unknown/测试切口 |
| `design-calibration/03_ddd_step_10_state_matrix.md` | 新增状态筛选/矩阵/最终静态审计 |
| `design-calibration/03_ddd_calibration_flow.md` | 同步逐步进度与本轮停点 |
| `design-calibration/project_execution_ledger.md` | 本台账同步授权/恢复点/审计 |
| `02-概要设计.md`、`design-calibration/02_hld_step_06_key_objects.md`、`design-calibration/02_hld_calibration_flow.md` | 仅read_cursors局部回源修订，02重新停审 |

静态审查：六主Step十段、三附录、Markdown围栏/链接、14协议对14 flow、计划路径、类型/字段/方法/版本/状态与owner边界交叉检查；不是编译或测试结果。只有本项目14个文件纳入本轮写入；正式00/01、draft/README、其他项目及根目录既有dirty不修改/不stage。

上游blocker：WS-UP-001~008/006-S仍open，无新增owning blocker、无关闭、无跨项目回写；目标仓/driver/依赖pin/配置值为未执行后续设计或实施前置。unsafe/unknown/未闭合source不得fake通过。正式03仍未创建，Step11~19未创建；本轮无代码实现、项目测试、真实证据或commit。

下一步先等待用户明确授权；获准后读本台账、03 flow、Step6B/C、Step7的snapshot/commit/baseline mapping、Step8结果、Step9写事务与Step10矩阵，再读详细设计SOP Step11和书写规范§5.10，参考governance Step11，复核owning source/visibility/baseline接缝。**本轮不进入Step11，不推进L4-archive；当前不需要提交，未提交。**

### 4.8 完成03授权与补审

2026-09-08恢复依据：用户“同意，继续完成03”及后续“继续”，允许完成Step11~19、装配正式03并停审；不授权04、实现、项目测试、跨项目写入或commit。首批Step12~18合写、Step19过早完成的偏差已登记03 flow §7；撤销初稿结论后按Step12→18补审并逐步更新台账，当前Step19真实装配。

本地待确认补充：WS-LOCAL-001 durable driver终局/隔离；002配置和绑定全schema；003密码学/UUID/CSPRNG与依赖pin验证。均未关闭；详情见03 Step18 §7.3。

## 5. 当前门禁

```text
current_document = 07-实施计划.md
current_step = 13
current_module = formal_assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_user_authorization_after_07
user_scope_stop = after_07
formal_00_write_allowed = closed_after_assembly
formal_01_write_allowed = closed_after_assembly
formal_02_write_allowed = closed_after_assembly
formal_03_write_allowed = false
formal_04_write_allowed = false
formal_05_write_allowed = false
formal_06_write_allowed = false
formal_07_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

2026-09-09：用户明确“同意装配”。已按 Step13 将正式 `07-实施计划.md` 装配并完成静态审计；13章、8阶段、8 boundary、阶段/批次/门禁/依赖/风险/回退/提交纪律/完成判定均有对应 calibration 来源。implementation ledger 与8个 boundary skeleton 均保持 planned/blocked/waiting，未创建实现仓、未执行测试、未生成真实 run/artifact/report/evidence/verdict/signoff/readiness，未提交 commit。07 flow 与本台账现转 `formal_stop_review`，本轮停在07，等待用户后续明确授权。

2026-09-09 05补审进度：Step2已完成真正的范围收口，明确P0/P1/P2、优先级与执行状态双轴、非范围风险归属及一票否决映射；当前Step3（objects_cuts）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step3已覆盖7模块、16对象、7 service、14入口与15个P0 CUT，并完成逐切口及跨切口审计；当前Step4（strategy_layers）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step4已完成测试金字塔、15 CUT首要发现层、九个计划suite职责及real-seam blocked边界；当前Step5（traceability）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step5已完成10 FR、12 BR、NFR/否决与15 CUT双向design coverage，注册59个TC/EV候选且未声称证据存在；当前Step6（scenarios_cases）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step6已完整定义59个planned/blocked用例，14入口主例齐全，TC与EV各59个且唯一；当前Step7（test_data）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step7已完成19个逻辑数据集、17 TC族映射与test-double authority边界；当前Step8（environment_matrix）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step8已完成6个测试语境到4个正式profile映射、依赖拓扑/类型与环境不可用审计；当前Step9（automation_ci）。无新增上游blocker、无跨项目写入、无测试执行或commit。

2026-09-09 05补审进度：Step9已定义13个planned suite、9个planned脚本、固定artifact/report路径与59 TC自动化映射；当前Step10（nonfunctional）。无脚本/CI/run/evidence事实，无新增上游blocker、无跨项目写入或commit。

2026-09-09 05补审进度：Step10已完成安全/现时裁剪、事务/幂等/unknown、recovery/gap/rebuild、资源有界、观测/redaction和测量准备专项；量化baseline继续pending，telemetry不作业务证据。当前Step11（defects_retest）。无测试执行或真实证据，无新增上游blocker、无跨项目写入或commit。

2026-09-09 05补审进度：Step11已完成S/A/B分级、一票否决、blocker/harness分流、复验扩大、关闭材料和自动化补洞规则；当前Step12（entry_exit）。未创建真实defect/run/evidence/signoff，无新增上游blocker、无跨项目写入或commit。

2026-09-09 05补审进度：Step12已完成分层进入、完整退出和暂停准则；当前只满足测试设计继续条件，local/formal/完整退出均未满足或blocked。当前Step13（reports_evidence）。无运行/证据/readiness事实，无新增上游blocker、无跨项目写入或commit。

2026-09-09 05补审进度：Step13已完成59个EV槽位的run实例、raw/report、保守聚合、失败留存、redaction/integrity与审查规则；真实EV实例仍为0，AC引用pending_06。当前Step14（regression_risks）。无运行/报告/证据事实，无新增上游blocker、无跨项目写入或commit。

2026-09-09 05补审进度：Step14已完成变更触发、最小/全量回归、逐项blocker风险、不可接受项、06承接和新run归档规则；当前Step15（formal_assembly），formal_05_write_allowed=true。全部接受角色未签署，无新增上游blocker、无跨项目写入或commit。

2026-09-08补审进度：Step12已补足输入、十段结构和自检，当前Step13（concurrency_idempotency）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step13已补足输入、十段结构和自检，当前Step14（config_external_binding）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step14已补足输入、十段结构和自检，当前Step15（observability_audit）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step15已补足输入、十段结构和自检，当前Step16（test_cuts）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step16已补足输入、十段结构和自检，当前Step17（implementation_handoff）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step17已补足输入、十段结构和自检，当前Step18（risks_open_questions）；无实现/测试执行/commit事实。

2026-09-08补审进度：Step18已补足输入、十段结构和自检，当前Step19（formal_document_assembly）；无实现/测试执行/commit事实。

### 4.9 正式03停审记录

2026-09-08：正式 `03-详细设计.md` 已创建并按18章装配，完成静态审计。七模块、16对象、7 service、14协议/flow/测试入口及跨章一致性已核对；WS-UP-001~008/006-S、WS-LOCAL-001~003仍为pending/blocker。未创建实现仓、未执行cargo/项目测试、未生成真实证据或commit。下一步等待用户确认04；当前不需要提交。

### 4.10 正式04停审记录

2026-09-08：用户授权完成全部04。已按配置SOP Step1~15串行创建校准flow与15个Step产物，并装配 `04-配置设计.md`。完成控制面、分类、来源优先级、profile矩阵、配置项、敏感配置、加载/变更/失效/演进与静态链接审计。WS-UP-001~008/006-S、WS-LOCAL-001~003仍pending/blocker；未修改03、未创建05、未实现代码、未执行测试、未提交。下一步等待用户确认05。

### 4.11 正式05/06停审与07启动记录

2026-09-09：完成05 Step15正式装配与全文静态审计。`05-测试方案.md` 已有15章、59个唯一TC、59个一对一EV槽位、14入口、15 CUT、19逻辑数据集、13 suite、4 gate和9 planned脚本；no-write、current visibility、Gap非terminal、Unknown Pending、依赖分类、禁止反写与事实边界均已核对。未产生实现、脚本、环境、真实run/artifact/report/EV/verdict/signoff/readiness。05 flow转 `formal_stop_review`，05写权限关闭。

2026-09-09：完成06 Step1~15与正式 `06-验收标准.md` 装配。15章主链、40个 AC、10个 VETO、59 EV 证据入口、三值结论、S/A/B 放行和风险接受边界已静态核对；当前无真实 run/artifact/report/EV/verdict/signoff/readiness，所有 formal seam 与本地 durable/crypto/binding blocker 保持开放。06 flow转 `formal_stop_review`，06写权限关闭。按用户“同意 完成全部”进入07 Step1；未跨项目回写、未实现代码、未执行测试、未提交。
