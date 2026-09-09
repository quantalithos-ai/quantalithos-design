# L1-workspace 05 测试方案校准流程

> 模式：full-restart / single-agent-serial；05已完成并停审；当前按“完成全部”授权进入06。
> 当前状态：Step15 completed / formal_stop_review；Step1~14 已完成；正式05已装配。
> 过程修正：Step2~14 首稿曾模板化合批，Step15 又在正式文件不存在时被提前标记完成；这些完成结论已撤销，现按 Step2→15 顺序补审。

| Step | 主题 | 状态 |
|---|---|---|
| 1 | 测试输入边界 | completed / pass_with_external_slots |
| 2 | 测试目标、范围、非范围 | completed / pass_with_external_slots |
| 3 | 测试对象与切口 | completed / pass_with_external_slots |
| 4 | 测试策略与分层 | completed / pass_with_external_slots |
| 5 | 需求追溯与覆盖矩阵 | completed / design_coverage_only |
| 6 | 场景与用例矩阵 | completed / cases_planned_with_external_blockers |
| 7 | 测试数据设计 | completed / data_planned_with_authority_boundary |
| 8 | 环境与配置矩阵 | completed / environments_planned_with_real_seams_blocked |
| 9 | 自动化与CI/CD门禁 | completed / automation_planned_not_implemented |
| 10 | 专项测试与非功能验证 | completed / nonfunctional_planned_with_baseline_pending |
| 11 | 缺陷管理与复验 | completed / defect_rules_planned |
| 12 | 进入/退出准则 | completed / criteria_defined_not_satisfied |
| 13 | 报告与证据归档 | completed / evidence_structure_planned_not_instantiated |
| 14 | 回归策略与残余风险 | completed / regression_defined_with_open_blockers |
| 15 | 正式文档装配 | completed / formal_stop_review |

## 纪律与事实边界

严格逐Step创建中间产物；每步包含输入、SOP问答、诊断、取舍、结构化结果、对03/04影响判定、回填、待确认和门禁。测试只规划，不执行；不产生case_id、run_id、report、evidence、verdict、signoff或readiness。WS-UP-001~008/006-S与WS-LOCAL-001~003继续pending，外部正向测试只能blocked，禁止fake proof/success。

current_document=05-测试方案.md；current_step=15；gate_status=formal_stop_review；next_allowed_action=read_acceptance_sop_and_start_06_step_01；formal_05_write_allowed=false；user_scope=complete_all_serially。

## 6. 首稿偏差与恢复记录

2026-09-09：Step2~14 曾以重复通用矩阵合批生成，未满足“按测试切口小循环”和逐 Step 停审要求；Step15 在正式 `05-测试方案.md` 不存在时被过早标为完成。现撤销上述完成结论，保留 Step1 已完成事实，从 Step2 开始逐步补审。未执行代码或测试，未生成 run/report/evidence/verdict/signoff/readiness。

2026-09-09：Step2 已按正式 00~04 与 03 Step16 完整补审，建立“优先级 × 执行状态”双轴、P0/P1/P2、接缝非范围、风险归属及一票否决映射。外部正向集成仍为 P0 风险且 `blocked`，未以 fake 降格或伪通过；进入 Step3。

2026-09-09：Step3 已逐项覆盖7模块、16局部对象、7 service、14入口和15个P0 CUT，完成逐切口停审及孤儿契约/重复/命名/phase边界审计。无新增设计缺口；外部正向和durable验证继续blocked；进入Step4。

2026-09-09：Step4 已把15个CUT映射到Contract/Domain、Service、Controlled integration、API/Worker/Jobs、Real-seam E2E与evidence review，明确九个计划suite职责。Real-seam层保持blocked；进入Step5。

2026-09-09：Step5 已逐项映射FR-WS-001~010、BR-WS-001~012、NFR/否决方向与15个CUT，注册59个互斥TC候选及一对一EV候选。覆盖仅为design-covered，真实执行/证据不存在；进入Step6。

2026-09-09：Step6 已将59个候选逐项展开为含前置、操作、正式预期、精确断言、自动化与EV槽位的用例；14入口主例齐全，TC/EV均59个唯一值，跨用例phase审计通过。全部仍为planned/blocked；进入Step7。

2026-09-09：Step7 已建立19个逻辑数据集、17个TC族前置映射、test double权限边界及可重复构造/隔离/清理规则。owner authority/event/replay/durable正向数据仅接受正式vector并保持blocked；进入Step8。

2026-09-09：Step8 已定义6个测试执行语境并严格映射04的local/test/staging/production四profile，完成依赖拓扑、配置域、数据与不可用审计。controlled integration不冒充real seam，后者继续blocked；进入Step9。

2026-09-09：Step9 已定义13个planned suite、PR/Main/Nightly/Release四门禁、9个planned gate/check/report脚本及固定artifact/report路径；59 TC均有自动化面。formal-seam suite保持P0 required/current blocked，未创建脚本或输出；进入Step10。

2026-09-09：Step10 已按现时visibility/no-write、安全与redaction、事务/幂等/commit unknown、gap/rebuild/cutover、资源有界、观测与可演进性逐项补审。只以正式语义和profile值 `L/L+1` 判定；未发明P95、吞吐、容量、SLA、RTO/RPO或保留期，telemetry不作业务证据；进入Step11。

2026-09-09：Step11 已建立优先级/执行状态/缺陷级别三轴，固定S/A/B、一票否决、blocker与harness failure分流、扩大复验、真实关闭材料和自动化补洞规则。当前没有真实defect或关闭事实；进入Step12。

2026-09-09：Step12 已分别定义测试设计、local/controlled、formal-seam、完整退出和暂停准则；当前仅设计准则满足，所有实现/环境/运行/证据准则均not_satisfied或blocked。P0 formal正向不得删项或fake替代；进入Step13。

2026-09-09：Step13 已固定59个EV槽位到同序TC的一对一run实例规则、raw/report目录与最小字段、多suite保守聚合、失败/blocked保留、redaction/integrity和人工审查边界。当前真实EV实例为0，AC均pending_06；进入Step14。

2026-09-09：Step14 已定义13类变更的最小回归、全量P0集合及触发，逐项保留WS-UP-001~008/006-S、WS-LOCAL-001~003和baseline/06风险。所有接受角色均未签署，formal seam使完整P0继续blocked；进入Step15真实装配。

2026-09-09：Step15 已完成正式 `05-测试方案.md` 装配和全文静态审计：15章齐全，59个唯一TC与59个一对一EV槽位，14入口、15 CUT、19逻辑数据集、13 suite、4 gate、9 planned脚本均可追溯；未创建实现、脚本、环境、run、artifact、report、EV实例、verdict、signoff或readiness。WS-UP-001~008/006-S、WS-LOCAL-001~003及baseline/06继续开放。05在此停审；按当前用户“完成全部”授权，下一步读取06 flow/SOP并进入06 Step1。
