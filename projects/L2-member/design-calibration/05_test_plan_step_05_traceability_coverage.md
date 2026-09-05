# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节：`projects/L2-member/05-测试方案.md` §5「需求追溯与覆盖矩阵」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_05_traceability_coverage.md`
> 证据口径：本文只预留用例 / 证据候选族，不填写执行结果、run_id 或正式 EV 实例。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5：建立需求追溯与覆盖矩阵 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 2 范围；Step 3 对象 / 切口；Step 4 分层；`00-需求文档.md`；`03-详细设计.md`；`04-配置设计.md` |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_05_traceability_coverage.md` |
| 回填位置 | 正式 `05-测试方案.md` §5（Step 15） |
| 停审方式 | P0 核心能力、FR/BR/NFR、AC/VF 与切口双向矩阵完成后停审；按授权进入 Step 6 |

## 2. 本步目标

建立从需求、业务规则、非功能要求、验收方向和一票否决项到设计契约、测试切口、后续用例族和证据候选族的双向追溯。未覆盖项不得静默消失；受 blocker 的正向覆盖必须标注 `blocked / refusal / reserved`，不能写成已通过。

本 Step 不展开具体测试步骤、fixture、环境、CI 脚本、artifact 路径或正式证据编号。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §7、§9、§10、§13、§14 | C、FR、BR、NFR、AC、VF 与追溯矩阵 |
| `05_test_plan_step_03_test_objects_cuts.md` | 七模块、协议、状态、一致性、配置、观测切口 |
| `05_test_plan_step_04_strategy_layers.md` | 首要发现层、次级保护层与 gate 边界 |
| `03-详细设计.md` §5~§15 | 对象、协议、flow、state、transaction、error、config、observability 设计契约 |
| `03_ddd_step_16_test_cuts.md` | planned minimum cut 和 blocker 语义 |
| `04-配置设计.md` §12 | 配置 / builder / availability / redaction 测试承接 |
| Step 2 P0/P1/P2 口径 | 固定覆盖优先级和非范围 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 核心能力对应哪些设计章节？ | `C-L2M-1~5` 分别回指 `03` CP01~CP07 对象、协议和 flow，`03` §9~§12 状态 / 一致性，`03` §13~§15 配置 / 观测；配置门禁再回指 `04` §2、§6、§8~§12。 |
| 每个 P0 需求至少要有怎样的测试覆盖？ | 每个 `FR-L2M-001~012` 至少有一个对象 / 协议切口、一个正向或 local 结果候选、一个负向 / 边界候选和一个证据候选族；受 blocker 的正向 lane 明确标记 blocked。 |
| 哪些业务规则必须自动化？ | 双锚与 fail-closed、筛选四态、body-free / no raw forwarding、五层出站分层、append-only / CAS、duplicate replay、Query no-write、Job no-truth-repair、依赖分类、配置 fail-fast 和 redaction 必须自动化候选；不得只人工确认。 |
| 每个切口如何反查需求？ | 通过 `cut → C/FR/BR/NFR/AC/VF → design section → case family → evidence candidate` 反查；纯设计风险切口（如 24 candidate non-materialization）至少映射 `BR-L2M-028/029`、`NFR-L2M-016` 与 `VF-L2M-007/008`。 |
| 哪些需求暂时无法正向覆盖？ | host / image / Runtime / Core event / credential / screening / non-project subject 的 exact positive seam，以及 DDD gap 对应 helper；这些保留 negative / blocked-aware coverage，不伪造 success。 |
| 覆盖矩阵如何处理 C5 与外围增强？ | `AC-L2M-005` 的 Summary 和安全 outlet 边界纳入 P0；outlet 正向激活与 `FR-L2M-E01~E03` 作为 P1 / 可裁剪，仍保留 unavailable / stale / gap 负向覆盖。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 的 persona / endpoint 需求无法映射当前 FR/BR | 全部丢弃旧映射，按当前 `00` ID 集合重建 |
| 旧 06 可能把外部 accepted / delivered 当验收证据 | 不采用旧 evidence / veto；只预留 `AC-L2M` / `VF-L2M` 证据族 |
| `BR-L2M-029` 与多个上游 blocker 有交集 | 显式拆出 blocked-aware coverage，不能把 blocker 关闭当测试通过 |
| 24 candidate 没有正式事件协议 | 仅映射 non-materialization / dependency boundary，不创建事件用例 |
| NFR 中没有硬性能数值 | `NFR-L2M-001~003` 只覆盖阶段分解 / 样本与不阻塞原则，硬阈值留残余风险 |

## 6. 改动前后对比

| 项 | 改动前 | 当前收束 | 原因 |
|---|---|---|---|
| 追溯粒度 | 旧文档的散文场景 | C/FR/BR/NFR/AC/VF ↔ cut ↔ case/evidence candidate | 便于 06 消费和缺陷定位 |
| 外部结果 | 容易写成 integration pass | local / blocked / refusal / reserved 分类 | 保持 owner truth |
| 覆盖空洞 | 未列孤儿设计契约 | 统一记录协议、状态、一致性、配置、观测切口 | 防止只测 happy path |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否逐条列 30 条 BR 的独立用例 | 不在本 Step 生成用例，但保留区间与主题映射 | Step 6 再按切口展开，避免重复断言 |
| 是否把所有 AC 都视为 P0 | AC 全部有追溯；P0 以 AC-001~005、006~017、019~033 为主，外围 AC-018 保留可裁剪 | 与 Step 2 优先级一致 |
| 是否将 VF 当作普通覆盖 | 不；VF 命中是 release 阻断条件 | 一票否决不可降级 |
| 证据编号是否现在冻结 | 只冻结候选族，不冻结正式 EV 实例 | Step 13 绑定真实 suite artifact |

## 8. 结构化中间产物

### 8.1 核心能力到测试切口矩阵

| 能力 | 需求范围 | 设计依据 | 主切口 / 用例候选族 | 覆盖状态 |
|---|---|---|---|---|
| C1 在场与宿主边界 | `FR-001~003`、`BR-001~006`、`NFR-004/006/013` | `03` CP01、§7~§12 | `CP01_presence_host`、`command_admit/establish/transition`、`host_feedback` | covered / positive blocked by UP-001/006/008 |
| C2 入站筛选与受控投递 | `FR-004~006`、`BR-007~013`、`NFR-004/006/007/011/012` | `03` CP02/CP03、§7~§12 | `CP02_screening`、`inbound_fact`、`submit_runtime`、body-free / unknown | covered / policy and Runtime positive blocked |
| C3 出站决定与发布分层 | `FR-007~008`、`BR-014~019`、`NFR-002/004/010/011/012` | `03` CP03/CP04、§7~§12 | `CP04_outbound`、material gate、attempt/gap、unknown fence | covered / publication positive blocked |
| C4 追溯与观测 | `FR-009~010`、`BR-020~023/030`、`NFR-003/009/010/014/015` | `03` CP05、§10~§15 | `CP05_trace`、observation、audit refs、redaction | covered / backend positive out of scope |
| C5 摘要与能力出口 | `FR-011~012`、`BR-024~026`、`NFR-005` | `03` CP06/CP07、§9~§15 | `CP07_summary`、outlet safe view、rebuild no-write | covered / outlet activation and helper gaps marked P1/blocked |

### 8.2 FR 到切口 / 候选证据族

| 需求 ID | 设计契约 | 测试切口 | 用例候选族 | 证据候选族 | 覆盖 |
|---|---|---|---|---|---|
| `FR-L2M-001` | StartupAdmission / double anchor | `admit_member_startup_command` | `TC-CP01-ADMIT-*` | `EV-LOCAL-CP01-*` | P0 local + blocked |
| `FR-L2M-002` | MemberPresenceStatus / successor | `member_presence_state` | `TC-STATE-PRESENCE-*` | `EV-STATE-*` | P0 |
| `FR-L2M-003` | Host material / attempt | `prepare_host_collaboration_command`、`host_feedback_consumer` | `TC-HOST-*` | `EV-SEAM-HOST-*` | P0 blocked-aware |
| `FR-L2M-004` | SubscriptionScopeDecision / policy | `subscription_scope_command`、`scope_visibility_query` | `TC-SCOPE-*` | `EV-INBOUND-SCOPE-*` | P0 |
| `FR-L2M-005` | InboundFact / ScreeningDecision | `screening_boundary`、`inbound_fact_consumer` | `TC-SCREEN-*` | `EV-INBOUND-SCREEN-*` | P0 |
| `FR-L2M-006` | RuntimeDeliveryDecision / attempt | `submit_runtime_command`、`runtime_material_consumer` | `TC-RUNTIME-DELIVERY-*` | `EV-SEAM-RUNTIME-*` | P0 blocked-aware |
| `FR-L2M-007` | OutboundDecision / safe material | `outbound_material_gate` | `TC-OUTBOUND-MATERIAL-*` | `EV-OUTBOUND-SAFE-*` | P0 |
| `FR-L2M-008` | PublicationAttempt / Gap | `publication_attempt_gap`、`delivery_feedback_consumer` | `TC-PUBLISH-*` | `EV-PUBLISH-LOCAL-*` | P0 blocked-aware |
| `FR-L2M-009` | InteractionTraceEntry / Gap | `trace_append_and_gap`、`member_committed_fact_consumer` | `TC-TRACE-*` | `EV-TRACE-*` | P0 |
| `FR-L2M-010` | ObservationMaterial / Attempt | `observation_redaction`、`observation_feedback_consumer` | `TC-OBS-*` | `EV-OBS-LOCAL-*` | P0 blocked-aware |
| `FR-L2M-011` | MemberSummaryView / projection | `summary_projection_no_write` | `TC-SUMMARY-*` | `EV-PROJECTION-*` | P0 |
| `FR-L2M-012` | CapabilityOutletView / mirror ref | `capability_outlet_safe_view` | `TC-OUTLET-*` | `EV-OUTLET-*` | P0 boundary / P1 positive |

### 8.3 BR 主题分组覆盖

| BR 范围 | 主题 | 主要切口 | 关联 AC / VF | 覆盖 |
|---|---|---|---|---|
| `BR-001~006` | 双锚、在场状态、host owner | CP01 / state / host seam | `AC-006~008/019/029`、`VF-001/002/005` | covered / UP-001/006/008 |
| `BR-007~013` | scope、筛选四态、body-free、投递关系 | CP02 / worker / runtime boundary | `AC-009~011/019/025/029/031`、`VF-002/004/009` | covered |
| `BR-014~019` | 出站锚定、材料门禁、五层分离、无任意外联 | CP03/CP04 / handoff | `AC-012~013/020/030`、`VF-001/003/005/006` | covered / UP-004/005 |
| `BR-020~023` | correlation、观测边界、失败可见 | CP05 / observability | `AC-014/015/021/030/032`、`VF-003/004/009` | covered |
| `BR-024~026` | 派生、无反写、freshness | CP06/CP07 / projection | `AC-005/016/017/024/028`、`VF-003/005` | covered / DDD gaps |
| `BR-027~030` | 全仓 owner、依赖分类、开放 seam、记录形态 | architecture / config / redaction | `AC-022/023/025/026/033`、`VF-006~008` | covered / blocker-aware |

### 8.4 NFR / AC / VF 覆盖矩阵

| 需求族 | 覆盖切口 | 通过口径（设计级） | 候选族 | 状态 |
|---|---|---|---|---|
| `NFR-001~003` 性能阶段 | flow timing / stage sample | 可分解 local 与外部等待；无来源硬阈值 | `TC-NFR-STAGE-*` | P0 sample / threshold pending |
| `NFR-004~005` 可用性降级 | dependency unavailable / projection isolated | waiting / degraded / blocked 保留历史；外围不拖核心 | `TC-NFR-DEGRADE-*` | P0 |
| `NFR-006~008` 安全 / body | subject / body / external listener | fail closed、无 raw body / 任意外联 | `TC-NFR-SEC-*` | P0 blocking |
| `NFR-009~010` 审计分层 | trace / attempt / observed fence | source、purpose、result 分类可回链 | `TC-NFR-AUDIT-*` | P0 |
| `NFR-011~013` 一致性 | replay / late / CAS | 不分叉、不逆写、双锚唯一 | `TC-NFR-CONSIST-*` | P0 |
| `NFR-014~016` 观测 / 依赖 | telemetry / dependency scan | 低敏低基数；planned / blocked / not-run 不伪装 | `TC-NFR-OBS-*` | P0 blocking |
| `AC-L2M-001~005` | C1~C5 主切口 | member-local truth / safe boundary | `TC-AC-CORE-*` | P0 |
| `AC-L2M-006~018` | FR 细分与外围 | 见 FR 表；AC-018 可裁剪 | `TC-AC-FR-*` | P0/P1 |
| `AC-L2M-019~033` | invariant / prohibition / dependency / evidence | 任一红线命中阻断；无伪证据 | `TC-AC-REDLINE-*` | P0 blocking |
| `VF-L2M-001~009` | 一票否决 | 负向断言必须失败安全 | `TC-VF-REDLINE-*` | P0 release gate |

### 8.5 测试切口反向映射

| 测试切口 | 需求 / 规则 | 设计依据 | 候选用例 / 证据族 | 覆盖状态 |
|---|---|---|---|---|
| `contracts_finite_protocol_schema` | `BR-028`、`NFR-016`、`AC-026/033` | `03` §7 | `TC-CONTRACT-*` / `EV-CONTRACT-*` | covered |
| `domain_factory_and_invariant` | `BR-001/007/008/011/014/024/029/030` | `03` §6、§9 | `TC-DOMAIN-*` / `EV-DOMAIN-*` | covered |
| `application_non_query_orchestration` | `BR-013/018`、`NFR-011/012` | `03` §8、§10~§13 | `TC-UOW-*` / `EV-UOW-*` | covered |
| `application_query_no_write` | `BR-025`、`AC-016/017/033` | `03` §7.3、§8 | `TC-QUERY-NOWRITE-*` / `EV-QUERY-*` | covered |
| `infra_store_uow_version_parity` | `BR-018/029`、`NFR-011/012` | `03` §10~§12 | `TC-STORE-*` / `EV-STORE-*` | DDD-002 blocked for physical proof |
| `worker_consumer_entry_and_receipt` | `BR-008/011/013/030` | `03` §7.4、§8 | `TC-CONSUMER-*` / `EV-RECEIPT-*` | DDD-003 blocked for full receipt |
| `jobs_continuation_and_report` | `BR-024/025/026`、`AC-016/033` | `03` §7.6、§8 | `TC-JOB-*` / `EV-JOB-*` | DDD-004~007 reserved lanes |
| `observability_redaction_local_audit` | `BR-020~023/030`、`NFR-014/015`、`VF-004/008` | `03` §14~§15 | `TC-REDACTION-*` / `EV-REDACTION-*` | covered |
| `candidate_non_materialization` | `BR-028/029`、`NFR-016`、`VF-007/008` | `03` §7.5 | `TC-EVENT-BLOCK-*` / `EV-BLOCK-*` | blocked by UP-005 |

## 9. 覆盖矩阵停审记录

| 覆盖项 | 需求来源 | 设计来源 | 用例候选 | 证据候选 | 结论 |
|---|---|---|---|---|---|
| C1~C5 | 明确 | 明确 | 有 | 有 | `pass_with_blockers` |
| FR-001~012 | 全部列出 | 一一回指 CP / object / flow | 有 | 有 | `covered` |
| BR-001~030 | 按主题分组且无遗漏 | `03` / `04` / Step 16 | 有 | 有 | `covered_with_blockers` |
| NFR-001~016 | 全部列出 | `00` NFR + `03` §10~§15 | 有 | 有 | `threshold_pending` 仅性能 |
| AC-001~033 | 全部映射 | `00` AC / VF | 有 | 预留 | `covered` |
| VF-001~009 | 全部映射负向 | `00` VF / redline | 有 | 预留 | `blocking` |

## 10. 跨覆盖项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 孤儿 P0 需求 | `none_found` | `FR-001~012`、核心 AC/VF 均有 cut |
| 孤儿 P0 设计契约 | `none_found_with_blockers` | 34 对象、协议、28 状态、UoW、config、redaction 均有 cut |
| 孤儿测试切口 | `none_found` | Step 3 反向映射完整 |
| 重复证据候选 | `reserved_unique_by_family` | Step 13 冻结正式 EV 前再做唯一性审计 |
| P0 自动化缺口 | `none_for_redlines` | 性能硬阈值和 external positive 仅保留 candidate / blocker |
| phase / owner 越界 | `guarded` | delivery / observed / accepted / health 不作为 member oracle |

## 11. 回填草稿（供正式 §5）

追溯矩阵将 `C-L2M-1~5`、`FR-L2M-001~012`、`BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033` 和 `VF-L2M-001~009` 映射至 `03` 的七模块、协议、状态、事务、错误、配置和观测切口。每个 P0 需求至少有对象 / 协议切口、正向或 local 结果候选、负向 / 边界候选和证据候选族；Query no-write、Job no-truth-repair、redaction、dependency boundary 和 unknown fence 为全局红线。

受 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 影响的正向 lane 标记为 blocked / refusal / reserved，不把 fake、not-run 或 blocked 映射成通过。24 个 outbound semantic candidate 仅映射 `L2M-UP-005` 的 non-materialization 负向检查。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 性能硬阈值 / workload owner | NFR-001~003 | Step 10 仅留 sample；后续 06 决定是否硬化 |
| external positive contract | P1 / selected-run | 继续 blocked；Step 14 记录 residual |
| 正式 EV 编号与 AC 引用 | 证据归档 | Step 13 生成，不在本步冻结 |

- [x] 需求 / 规则 → 设计 → 切口 → 用例 / 证据候选双向可查。
- [x] 孤儿需求、孤儿切口、重复和 phase 越界已审计。
- [x] 未覆盖风险已显式进入 blocker / residual，而非静默删除。

**Step 5 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 6。
