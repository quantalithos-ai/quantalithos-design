# L6-bridges 01 架构设计全量重启校准流程

> 2026-10-02；full-restart / single-agent-serial；用户授权全部01。
> 正式目标：`01-架构设计.md`；项目台账：`project_execution_ledger.md`。
> 当前：Step16 / formal_stop_review；旧01已删除，新01完整装配与审计完成；正式写入已冻结，02未授权。

## 1. 文档级恢复点

| Step | 当前单元 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|---|
| 16 | formal_stop_review | done | done | done | pass | blocked | 01设计自检pass；正式写入关闭，文档切换等待用户确认02 | wait_for_user_confirmation_of_02 | Step1~15；01_arch_step_16_formal_assembly.md；正式01；project_execution_ledger.md |

Step1~16设计自检pass；当前gate=blocked只阻止继续正式写入和文档切换，不否认已完成审计。正向资格blocker=BR-UP-001~009；精确入口为00 Step15§7.3/7.4；BR-UP-010=reference_only。受影响正向合同、部署/实现/运行事实不得补造。

## 2. 总流程计划

| Step | 名称 | 必读输入 / 前序 | 输出文件 | 状态 | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | 确认需求基线 | 00、来源/风险、七专项合同、SOP Step1/规范4.1 | `01_arch_step_01_requirements_baseline.md` | done / pass | 来源资格、稳定前提、硬约束与挂起范围自检通过 |
| 2 | 架构目标与约束 | 1；SOP Step2/规范4.2~4.3 | `01_arch_step_02_goals_constraints.md` | done / pass | 四类结论及章2/3摘录自检通过 |
| 3 | 职责边界 | 1/2；SOP Step3/规范4.4 | `01_arch_step_03_responsibility_boundary.md` | done / pass | 三类型职责与红线自检通过 |
| 4 | 系统上下文 | 1~3；SOP Step4/规范4.5 | `01_arch_step_04_system_context.md` | done / pass | 系统图/十三关系及失效边界自检通过 |
| 5 | 限界上下文与子域 | 3/4；SOP Step5/规范4.6 | `01_arch_step_05_bounded_contexts.md` | done / pass | 六单元停审、关系图与跨单元审计完成 |
| 6 | 容器与部署 | 4/5；SOP Step6/规范4.7 | `01_arch_step_06_containers_deployment.md` | done / pass | 运行承载图/说明与边界完成 |
| 7 | 依赖与层间约束 | 5/6、全局规则；SOP Step7/规范4.8 | `01_arch_step_07_dependencies.md` | done / pass | U1~U6依赖边界、裁剪表/图与跨审完成 |
| 8 | 数据与一致性 | 3/5/7；SOP Step8/规范4.9 | `01_arch_step_08_data_consistency.md` | done / pass | 逐单元truth/snapshot/reference/禁止、事务/恢复审计 |
| 9 | 交互与通信 | 4/6/8；SOP Step9/规范4.10 | `01_arch_step_09_interactions.md` | done / pass | 逐单元同步/异步/job/补偿/失败及跨单元审计 |
| 10 | 技术选型 | 2/7~9、平台来源；SOP Step10/规范4.11 | `01_arch_step_10_technology_seams.md` | done / pass | 结构机制与未选产品分开，seam资格明确 |
| 11 | 备选取舍 | 2/10；SOP Step11/规范4.12 | `01_arch_step_11_alternatives.md` | done / pass | 可比较路径、收益/代价及反选依据 |
| 12 | 横切关注点 | 2/8~10；SOP Step12/规范4.13 | `01_arch_step_12_cross_cutting.md` | done / pass | 逐单元适用性、安全审计/配置/性能边界审计 |
| 13 | 演进路线 | 10~12；SOP Step13/规范4.14 | `01_arch_step_13_evolution.md` | done / pass | 触发/前置/债务/不演进界限，非排期 |
| 14 | 风险与挂起 | 1~13、最新owner台账；SOP Step14/规范4.15 | `01_arch_step_14_risks_pending.md` | done / pass | 精确影响/当前姿态/释放依据，未关闭不变ready |
| 15 | ADR与追溯 | 1~14、00矩阵；SOP Step15/规范4.16~4.17 | `01_arch_step_15_traceability_adr.md` | done / pass | 逐架构决定及单元停审、完整FR/NFR/边界追溯 |
| 16 | 正式装配 | 1~15；SOP Step16/规范4.18及模板/图规则 | `01_arch_step_16_formal_assembly.md` | complete / formal_stop_review | 三层装配前门禁、18章分批重建及全文审计完成；等待用户确认02 |

未来Step只在实际到达时创建。每Step先骨架、再问题/诊断/取舍，后结构化/回填/自检，逐次更新三层台账；Step5/7/8/9/12/15逐架构单元小循环，自检通过不冒称用户或owner签署。

## 3. 输入与粒度

正式00为本仓需求真相；上游正式语义与审查资格/实现/运行材料分开。旧README/01~03/05/06只后置冲突扫描；draft是讨论输入，不直拷对象。Chat未停审材料不输入。平台已读资料入口为00 Step5平台附录，未核验事实不承接。

从Step5起须有adapter、mapping语义结构、owner读/写边界、inbound/outbound/callback阶段guard、operation/effect/stream/epoch、rate-limit/retry、配置/secret及验证切口。架构不写DDL、DTO字段定义、函数签名或具体TC；02/03/04必须闭合正式可执行合同，未闭口不允许实施。

## 4. 当前权限

```text
current_document = 01
current_step = 16
current_module = formal_stop_review
document_status = formal_stop_review
design_self_review = pass
gate_status = blocked
gate_reason = user_confirmation_of_02_required_after_formal_01_stop_review
formal_document_write_allowed = false
formal_01_assembly_allowed = false
next_allowed_action = wait_for_user_confirmation_of_02
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 5. 执行记录

- 2026-10-02：恢复三层入口并核对最新授权；建立本flow和Step1骨架，更新项目台账/00切换记录；未修改旧01或其他项目。七专项本轮合同复核尚在进行，不报全文重读完成。
- 2026-10-02：Step1完成七专项相关正式合同/台账复核、六问题、独立基线及后置旧01§1~3扫描；自检pass，BR-UP/原affected不变；允许Step2。
- 2026-10-02：Step2分批完成思考与四类结构结论、自检及摘录；一次patch上下文顺序检查失败，未落盘该批，校正顺序后重试完成；允许Step3，未修改正式01。
- 2026-10-02：Step3先思考后结构化15项职责及红线，设计自检pass；允许Step4，不继承旧身份/审批假设。
- 2026-10-02：Step4系统图/配表/失效边界分批完成，自检pass；允许Step5逐架构单元校准。
- 2026-10-02：Step5 U1~U6按顺序完成问题/诊断/取舍、结构化语义卡、单元停审及跨单元审计；未把五能力拆成五服务，允许Step6。
- 2026-10-02：Step6完成运行承载图、八类运行单元和部署边界自检；未锁物理拓扑或技术产品，允许Step7。
- 2026-10-02：Step7完成U1~U6依赖/禁止/倒置卡、四层方向图、三张裁剪表、禁止依赖表及跨依赖审计；runtime/event未误写package，允许Step8。
- 2026-10-02：Step8完成U1~U6 truth/snapshot/reference/forbidden分类、局部强一致与跨owner/platform最终一致、unknown/gap/blocked恢复及跨数据边界审计；自检pass，允许Step9。
- 2026-10-02：Step9完成U1~U6场景识别、同步/异步/后台/补偿方式判断、阶段结果分离、失败降级及跨交互审计；自检pass，允许Step10。
- 2026-10-02：Step10完成架构层机制、adapter/config/secret/recovery/evidence seam资格和未选产品边界；自检pass，允许Step11。
- 2026-10-02：Step11完成P0主线与P1~P5路径级比较、得失、采用/不采用和边界外排除审计；自检pass，允许Step12。
- 2026-10-02：Step12完成安全、审计/追溯、可观测性、韧性/恢复、性能/容量、配置/变更六类约束，按U1~U6停审并完成跨横切审计；自检pass，允许Step13。
- 2026-10-02：Step13完成当前主线成立边界、E0~E4结构演进阶段、可接受/不可接受债务和触发条件；自检pass，允许Step14。
- 2026-10-02：Step14完成R-BR-001~009风险、BR-UP-001~010待确认事项、继承台账状态和精确阻塞/挂起口径；自检pass，允许Step15。
- 2026-10-02：Step15完成U1~U6 ADR停审、G/C/FR/BR/DR/NFR/AC/VETO追溯范围、孤儿/来源/冲突审计；自检pass，允许Step16正式装配。
- 2026-10-02：Step16删除旧01，18章分批装配，校正图示、来源链接、责任/材料表述与恢复状态；19文件静态检查、既有需求覆盖、全文语义/历史污染/范围审计及git diff --check通过。执行偏差留在Step16；不伪造过程或运行事实。
- 2026-10-02：01转formal_stop_review，三层恢复点一致；正式写入与02切换关闭，下一动作wait_for_user_confirmation_of_02。上游BR-UP及继承状态不关闭，implementation/test/commit权限仍false。

执行记录整理说明：Step7原为尾部补记，本次按已记录Step顺序归位，重复Step6补记删除；这是记录编排校正，不表示重新执行或掩盖Step16登记的过程偏差。用户确认02后才读取02 SOP/规范和正式00/01；现在不建立02产物。
