# Step 15. 整理正式验收标准文档 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填章节：完整 `06-验收标准.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 正式验收标准文档装配 |
| 当前状态 | `completed / pass_with_upstream_blockers; stop_review` |
| 输入基线 | Step 1~14；`验收标准书写规范.md`；`设计文档讨论中间产物规范.md` §5.9~§5.10；L1-governance 06 粒度参考 |
| 输出文件 | `design-calibration/06_acceptance_step_15_formal_document_assembly.md`；正式 `06-验收标准.md` |
| 真实执行状态 | 未执行；不生成实现 commit、run_id、artifact、report、evidence、defect、verdict、signoff 或 readiness |
| gate_status | `pass_with_upstream_blockers; stop_review` |
| gate_reason | 15 章主链、校准来源、P0 分母、证据 / VETO / 风险边界和跨门禁总审计已收口；MSVC-UP-001~008 等正向合同仍保持 pending / blocked / waiting |
| next_allowed_action | 正式 `06-验收标准.md` 已完成；停审并等待用户对下一正式文档（07）另行授权 |

### 1.1 Step 内计划

- [x] 复核 Step 1~14 状态、回填草稿和待确认事项。
- [x] 按书写规范固定正式 15 章主链和章节来源块。
- [x] 完成需求 / 设计 / 测试 / 验收 / 实施承接的一致性审计。
- [x] 完成 AC、VF、TC、EV、report path、VETO、缺陷和风险的跨门禁审计。
- [x] 装配正式文档并保留所有未闭合 blocker，不伪造执行事实。
- [x] 更新 flow / project ledger 为完成并停审。

## 2. 本步目标

把前 14 个 Step 的收口结论整理成可被实施计划、测试执行和发布准备消费的正式 `06-验收标准.md`。正式文档只保留裁决标准、来源、通过 / 失败条件、VETO、风险和签署口径；问题回答、历史污染、方案取舍、逐 Step 停审和详细矩阵继续留在本目录。

正式装配必须保持以下边界：

- `00` 的需求、AC-MS-001~039 和 VF-MS-001~009 是需求级分母；不新增未来源的正式验收项。
- 证据只引用 `05 §13.2` 固定的 14 个未来 EV 实例和固定 `<run_id>` 路径；没有真实 run 时不填写状态。
- `MSVC-UP-001~008` 只能写 pending / blocked / waiting / placeholder / fail-closed；不把兄弟项目未停审的内容当作 truth。
- `Query` 必须 no-write，`Job` 必须 no-truth-repair；`submitted / delivered / observed / accepted` 四层独立。
- 正式文档不是测试报告、实施计划或风险签署，不代表当前已经验收通过。

## 3. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | §1 来源声明和历史污染边界 | completed |
| `06_acceptance_step_02_scope.md` | §2 P0/P1/P2 范围和非范围 | completed |
| `06_acceptance_step_03_baseline.md` | §3 版本、环境、数据、证据入口 | completed |
| `06_acceptance_step_04_entry_exit.md` | §4 进入 / 退出 / 暂停条件 | completed |
| `06_acceptance_step_05_function_gate.md` | §5 功能验收门禁 | completed（已清理未固定 EV 实例） |
| `06_acceptance_step_06_data_arch_redlines.md` | §6 数据归属和架构红线 | completed（已清理未固定 EV 实例） |
| `06_acceptance_step_07_interfaces_events_sync.md` | §7 接口、事件、跨仓同步 | completed（已清理未固定 EV 实例） |
| `06_acceptance_step_08_state_tx_consistency.md` | §8 状态、事务、一致性 | completed（已清理未固定 EV 实例） |
| `06_acceptance_step_09_nonfunctional.md` | §9 非功能验收 | completed（AC-MS-034~039 已对齐） |
| `06_acceptance_step_10_observability_evidence.md` | §10 证据和审计门禁 | completed |
| `06_acceptance_step_11_veto.md` | §11 一票否决 | completed |
| `06_acceptance_step_12_defects_retest_release.md` | §12 缺陷、复验、放行 | completed |
| `06_acceptance_step_13_risk_acceptance.md` | §13 风险接受和遗留项 | completed |
| `06_acceptance_step_14_final_decision_signoff.md` | §14 三值结论和签署 | completed |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 正式文档是否按 15 章主链组织？ | 是，严格使用书写规范规定的 §1~§15 章节名，不把校准过程混入正文。 | 验收标准书写规范 §3、§5 |
| 是否删除 SOP 问题原文？ | 是。正式正文只承载收口后的验收标准；问题回答和诊断保留在 Step 文件。 | 中间产物规范 §5.8 |
| 每条 P0 门禁是否有通过、失败和证据？ | 是。§5~§10 的每条 P0 项均绑定正式设计来源、TC 族、固定 EV / report 入口和失败影响；细粒度矩阵留在 Step 文件。 | Step 5~10 |
| 一票否决是否真实生效？ | 是。VETO-MS-001~009 一对一映射 VF-MS-001~009，命中或无法核验时不得通过 / 有条件通过。 | Step 11、§11 |
| 每个 P0 AC 是否能回指设计、TC、EV 和 report？ | 设计层已完成映射；真实执行必须由 evidence-index 从 raw/report pair 证明，当前不填写实际 status。 | Step 5~10 |
| 状态、字段、接口和事件名是否与 `03/05` 一致？ | 已复核：仅使用正式对象 / 状态族、10 Command、6 Query、5 Consumer、1 Material helper、7 Job；Core/Bus event family 仍 placeholder，不猜 topic / receipt。 | Step 7~8；`03` §6~§14 |
| 风险接受是否有 acceptor 和后续动作？ | 正式 §13 要求 risk_id、scope、impact、reason、evidence、owner、acceptor、deadline/trigger、follow-up_ref；当前候选均为 pending。 | Step 13 |
| 是否存在未闭合跨项目 blocker？ | 存在 MSVC-UP-001~008、cursor exact type、Core/Bus receipt、真实 provider、observability backend、性能 authority 等；正式正文只写其限制，不写 ready。 | ledger；Step 1、9、13 |
| 是否存在当前真实验收结论？ | 不存在。正式文件只提供未来裁决合同；没有 run、artifact、report、defect、verdict、signoff 或 readiness。 | Step 3、10、14 |
| 正式文档完成后下一步是什么？ | 已停审并等待用户另行确认，不自动进入 07，也不生成实施计划。 | 用户任务约束；ledger |

## 5. 当前文档问题诊断

| 审计对象 | 问题 | 装配处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧主语、泛化证据和模糊结论会污染新文档。 | 已删除旧文件，按 15 章 full-restart 重建。 |
| 证据编号 | Step 5~8 曾引用未由 `05 §13.2` 固定的具体主题实例。 | 改用 14 个固定 EV；未固定主题仅保留为语义说明，不作为 instance。 |
| 非功能编号 | Step 9 曾使用一组未纳入需求分母的非功能专用编号，与 `00` 的 AC-MS-034~039 不一致。 | 收敛为 `AC-MS-034~039` 六项，并在来源列覆盖 NFR-MS-001~020。 |
| 外部正向合同 | Member、Runtime、Images、Sandbox、Core/Bus 等 exact contract 未闭合。 | 所有正向能力标 blocked / waiting / placeholder；只验安全 seam 和 negative。 |
| 结果层级 | receipt / adapter Ok / submitted 容易被升格为 delivered / observed / accepted。 | §5~§9、§11 固定四层独立和 VETO。 |
| 当前状态 | 设计文档容易被误读为实际验收结果。 | 元信息和正文明确“验收执行未开始”；所有真实值保留占位。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 章节结构 | 旧文件或未完整 | 规范固定 15 章，逐章校准来源 |
| 功能分母 | 主题叙述和编号混杂 | C-MS-1~5、AC-MS-001~039、VF-MS-001~009 固定 |
| 证据 | 泛化 API/DB/trace | 14 个固定 EV + `<run_id>` artifact/report pair |
| VETO | 红线候选 | 9 项一对一正式 VETO alias，命中转 S / 不通过 |
| 缺陷 / 风险 | “后续修复” | S/A/B/R、复验、risk acceptance、三值矩阵 |
| 跨项目边界 | 可能把 sibling 正向当 ready | pending / blocked / waiting / fail-closed 明示 |
| 当前结论 | 容易被误读为通过 | 只记录规则；不填写真实 verdict / signoff / readiness |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 正式章节是否展开全部中间矩阵？ | A. 全量展开；B. 正文保留可裁决摘要，细节回指 Step | 采用 B，保证可读性和完整追溯。 |
| 是否扩充验收编号以容纳主题别名？ | A. 扩充；B. 保持 `00` / `05` 固定分母 | 采用 B，逻辑主题不创建新正式 instance。 |
| 是否填写 planned / blocked 的实际状态？ | A. 填写为结果；B. 只写规则和占位 | 采用 B，避免伪造执行事实。 |
| 是否将 sibling positive blocked 作为整体失败？ | A. 一律失败；B. 只在 P0 必需或被伪装时阻断 | 采用 B，符合项目范围和 fail-closed 约束。 |
| 是否允许风险接受 VETO/S/evidence gap？ | A. 允许；B. 禁止 | 采用 B。 |
| 完成 06 后是否自动进入 07？ | A. 自动；B. 停审等待用户确认 | 采用 B，遵守文档切换门禁。 |

## 8. 结构化中间产物

### 8.1 正式章节来源映射

| 正式章节 | 唯一校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `design-calibration/06_acceptance_step_01_input_boundary.md` |
| §2 验收目标与范围 | `design-calibration/06_acceptance_step_02_scope.md` |
| §3 验收基线 | `design-calibration/06_acceptance_step_03_baseline.md` |
| §4 进入条件与退出条件 | `design-calibration/06_acceptance_step_04_entry_exit.md` |
| §5 功能验收门禁 | `design-calibration/06_acceptance_step_05_function_gate.md` |
| §6 数据边界与架构红线验收 | `design-calibration/06_acceptance_step_06_data_arch_redlines.md` |
| §7 接口、事件与跨仓同步验收 | `design-calibration/06_acceptance_step_07_interfaces_events_sync.md` |
| §8 状态机、事务与一致性验收 | `design-calibration/06_acceptance_step_08_state_tx_consistency.md` |
| §9 非功能验收门禁 | `design-calibration/06_acceptance_step_09_nonfunctional.md` |
| §10 可观测性、审计与证据门禁 | `design-calibration/06_acceptance_step_10_observability_evidence.md` |
| §11 一票否决项 | `design-calibration/06_acceptance_step_11_veto.md` |
| §12 缺陷分级、复验与放行规则 | `design-calibration/06_acceptance_step_12_defects_retest_release.md` |
| §13 风险接受与遗留项 | `design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| §14 最终结论与签署 | `design-calibration/06_acceptance_step_14_final_decision_signoff.md` |
| §15 参考 | `design-calibration/06_acceptance_step_15_formal_document_assembly.md` |

### 8.2 分母与编号审计

| 分母 | 正式基线 | 覆盖状态 |
|---|---|---|
| 核心闭环 | C-MS-1~5；AC-MS-001~005 | 已覆盖 |
| P0 功能 | AC-MS-006~017 | 已覆盖 |
| P1 外围功能 | AC-MS-018~021 | 已标后置，不阻断 P0 |
| 规则 / 架构红线 | AC-MS-022~027；VF-MS-002~008 | 已覆盖 |
| 数据归属 | AC-MS-028~033；VF-MS-003/005/007 | 已覆盖 |
| 非功能 | AC-MS-034~039；NFR-MS-001~020 | 已对齐，未引入额外非功能 AC 编号 |
| 需求否决 | VF-MS-001~009 | 已覆盖，一对一 VETO alias |
| Command | 10 | Step 7 协议族主题（不新增正式 AC） |
| Query | 6 | Step 7 协议族主题（不新增正式 AC；no-write） |
| Inbound Consumer | 5 | Step 7 协议族主题（不新增正式 AC） |
| Material helper | 1 | `HostFactMaterialEventCandidate`；不新增正式 AC |
| Operations Job | 7 | Step 7 协议族主题（不新增正式 AC） |

### 8.3 设计—测试—验收闭环表

| 主题 | 设计真相源 | 测试切口 | 固定 EV | 正式验收 |
|---|---|---|---|---|
| intent / decision | `03` §8.2、§9.1；HostIntent / HostDecision | `TC-INTENT-*`、`TC-DECISION-*` | `EV-MS-CORE-001`、`EV-MS-CMD-001` | AC-MS-001、006、007 |
| qualification / assembly / readiness | `03` §8.2、§9.1；`04` §7 | `TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-CONFIG-*` | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001` | AC-MS-002、008~010、023、029 |
| registration / session | `03` §8.3、§9.2 | `TC-REG-*`、`TC-SESSION-*`、`TC-CONSUMER-*` | `EV-MS-CONSUMER-001`、`EV-MS-DOMAIN-001` | AC-MS-003、011、012、024、030 |
| health / recovery | `03` §8.4、§9.3、§11~§12 | `TC-HEALTH-*`、`TC-RECOVERY-*`、`TC-IDEMP-*` | `EV-MS-DOMAIN-001`、`EV-MS-IDEMP-001` | AC-MS-004、013、014、025、035、038 |
| closure / reconciliation | `03` §8.5、§9.4、§10.5 | `TC-CLOSE-*`、`TC-JOB-*` | `EV-MS-JOB-001`、`EV-MS-MATERIAL-001` | AC-MS-005、015、016、026、032 |
| material / handoff layers | `03` §6.1、§10.4、§14 | `TC-MATERIAL-*`、`TC-CONSUMER-005`、`TC-REDACTION-*` | `EV-MS-MATERIAL-001`、`EV-MS-REDACTION-001` | AC-MS-017、032、039 |
| Query / projection | `03` §8.4、§10.3 | `TC-QUERY-*`、no-write negative | `EV-MS-QUERY-001`、`EV-MS-JOB-001` | AC-MS-012、017、021、033 |
| config / dependency | `04` §5、§9~§12；`03` §13 | `TC-CONFIG-*`、`TC-ARCH-001` | `EV-MS-CONFIG-001`、`EV-MS-ARCH-001` | AC-MS-023、027、036 |
| evidence integrity | `05` §13；Step 10 | report-audit / redaction checks | `EV-MS-REPORT-001`、`EV-MS-REDACTION-001` | AC-MS-037、039；VF-MS-009 |

### 8.4 状态、阶段和结果层级审计

| 审计项 | 正式口径 | 结果 |
|---|---|---|
| Host Truth 状态 | 只使用 `03` 正式状态族和合法迁移 | 通过（设计层） |
| generation / revision / cursor | expected revision、single-current、old-generation late/gap；cursor exact type pending 时不造 alias | 通过（pending 明示） |
| Query | visible / degraded / unavailable / empty 只读，不 reserve / repair / publish | 通过（规则层） |
| Job | 只选择已提交 work，输出 per-item report，不创建授权 / decision / generation | 通过（规则层） |
| handoff layers | `submitted`、`delivered`、`observed`、`accepted` 独立，由 owner feedback 推进 | 通过（规则层） |
| unknown / late / duplicate | 保留原 key / generation / history，进入 hold / gap / reconcile，不盲重放 | 通过（规则层） |

### 8.5 EV / report 路径审计

| 审计项 | 通过标准 | 当前结论 |
|---|---|---|
| 固定 EV 实例 | 仅 05 §13.2 的 14 个 `EV-MS-*-001` | 通过 |
| artifact root | `artifacts/test/<run_id>/...`，无项目子目录、无 `latest` | 通过（规则层） |
| report root | `reports/runs/<run_id>/...` | 通过（规则层） |
| acceptance root | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | 通过（规则层） |
| raw/report pairing | 每个 suite report 有 raw artifact、case、digest、safe failure reason | 通过（规则层） |
| evidence index | 从真实 raw/report 关系推导，不从静态映射生成 | 通过（规则层） |
| redaction / dependency / report audit | 任一失败阻断；不能被 risk acceptance 覆盖 | 通过（规则层） |
| 当前实例 | 尚无真实 run / artifact / report / evidence | 未执行，保持空 |

### 8.6 跨门禁裁决总审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 15 章结构 | 通过 | 与验收标准书写规范一致 |
| 每章校准来源 | 通过 | 每章正文开头列具体 Step 文件和延伸阅读 |
| P0 AC 设计闭环 | 通过（设计层） | AC-MS-001~039 均有来源和测试切口 |
| P0 EV 固定 | 通过（计划层） | 14 个固定实例；未生成真实实例 |
| VETO 覆盖 | 通过（规则层） | VF-MS-001~009 全部覆盖 |
| 缺陷 / 复验 | 通过（规则层） | S/A/B/R、原 run 保留、新 run 复验 |
| 风险接受 | 通过（规则层） | VETO/S/evidence gap 不可接受；候选 residual pending |
| owner / truth 边界 | 通过（规则层） | 不纳入 L1 和 sibling truth |
| Query / Job 边界 | 通过（规则层） | no-write / no-truth-repair |
| 依赖分类 | 通过（规则层） | compile/runtime/event/ref/adapter/fake 分离 |
| 上游 blocker 透明 | 通过 | MSVC-UP-001~008 未伪关闭 |
| 真实执行事实 | 未执行 | 不填写 run、artifact、report、verdict、signoff、readiness |
| unresolved 设计冲突 | 未发现 | 具体 exact contract 仍是外部 pending，不在本仓猜测 |

### 8.7 正式文档装配检查清单

- [x] 使用 15 章固定主链，章节名称未随意改写。
- [x] 每个正式章节开头含具体 `design-calibration/06_acceptance_step_*.md` 校准来源和延伸阅读。
- [x] 正文不包含 SOP 问题原文、讨论语气、真实测试结果或 signoff。
- [x] §5~§10 每条 P0 门禁有通过、失败、正式设计和证据入口。
- [x] §11 VETO 仅来自 VF-MS-001~009，且不可风险接受。
- [x] §12 与 Step 12 的 S/A/B/R、复验和三值放行一致。
- [x] §13 风险表要求 owner、acceptor、deadline/trigger、follow-up_ref。
- [x] §14 只允许三值结论，当前不填写真实结论。
- [x] `latest`、项目子目录 artifact、静态 passed、伪造 ready 均被禁止。
- [x] 兄弟项目仅以 pending / blocked / waiting / placeholder 引用，未修改其文件。

## 9. 回填草稿

正式 `06-验收标准.md` 已按本 Step 的来源映射和总审计装配。正文将明确：这是未来验收合同，不是当前验收报告；P0 证据和 VETO 必须由真实固定 run、raw artifact、report、digest 和审查材料支撑；所有 `MSVC-UP-001~008` 正向合同在闭合前只能保持 blocked / waiting / fail-closed；完成本文件后立即停审。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 source ref / implementation commit / build / image digest | 影响未来验收基线 | 正文保留 `<...>` 占位 |
| 真实 `run_id`、artifact、report、EV status | 影响验收执行 | 只保留固定路径和规则，不生成实例 |
| VETO checklist、risk acceptance、signoff 实际审查人 | 影响最终结论 | 正式验收时填写，不在设计阶段伪造 |
| MSVC-UP-001~008 exact contract | 影响 selected integration | 继续 pending / blocked / waiting；闭合后重开受影响 Step |
| 07 实施计划 | 影响实施阶段和 planned boundary skeleton | 本轮不创建，等待用户另行授权 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 15 章正式结构可装配 | 通过 | 见 §8.1、§8.7 |
| P0 AC / EV / VETO / risk 闭环无断裂 | 通过（设计 / 规则层） | 真实执行仍待未来 run |
| 跨文档字段、状态、阶段和依赖审计无 unresolved 冲突 | 通过 | pending 合同已显式隔离 |
| 未伪造实现、证据、结果和签署 | 通过 | 见 §8.6 |
| 正式 06 完成后停审 | 已完成 | 不自动进入 07，等待用户明确确认 |
