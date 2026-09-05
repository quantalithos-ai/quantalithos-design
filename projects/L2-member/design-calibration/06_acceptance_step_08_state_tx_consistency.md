# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 8
> 回填章节：06-验收标准.md §8
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_08_state_tx_consistency.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义状态机、事务与一致性验收 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 5~7；03 §8~§12；05 §6、§9、§10、§13 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_08_state_tx_consistency.md |

## 2. 本步目标

把正式状态主语、合法 / 非法 / reserved transition、UoW 原子性、Query no-write、Consumer / Job no-source-repair、duplicate replay、CAS、rollback 和 commit-unknown 转成可裁决门禁。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 03 §9 | 28 个正式状态主语、全局迁移纪律和 reserved gap |
| 03 §10~§12 | logical Store、UoW、错误恢复、幂等、并发和 unknown fence |
| 05 §6、§9、§10、§13 | 状态 / 一致性 TC、suite、故障注入和 EV 规划 |
| Step 5~7 | 功能、红线、协议和跨仓影响 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些合法迁移必须通过？ | 03 §9 列出的 28 个状态主语的 factory / legal successor、local accepted / non-positive、projection / gap / report successor 均须由 domain / service / fake evidence 证明。 |
| 哪些非法迁移必须拒绝？ | 错主语、terminal 原地修改、unknown 自动升级、scope supersede 直写、Query 写入、Job 修 source、external success 伪装、旧状态名和未定义 variant 均必须拒绝。 |
| 哪些事务必须原子？ | Command 的 local truth / successor、必要 trace / projection marker、完整 typed result 与 reservation completion；Consumer 的 local fact / relation、receipt；Job 的 continuation、item result 和 report 必须在各自同一 UoW 中闭合。 |
| 哪些幂等和并发行为必须成立？ | exact digest duplicate replay、same-key conflict、in-flight fence、expected MemberStoreVersion、append-only identity、partial item isolation 和 commit-unknown inspect-first。 |
| 失败如何判定？ | 缺状态 / transaction evidence、状态漂移、carrier-before-complete 违反、第二写者、盲重试或 Query / Job 反写，均使相应门禁失败；命中 VF-L2M-003/005/008 时不得风险接受。 |
| 是否存在后续 phase 状态污染？ | 只使用 03 §9 正式状态名；external accepted / delivered / observed / ready 不是 member-local 状态，不能写入本轮正向条件。 |
| 每项能否回指 flow / TC / EV / report？ | 能；状态族用 EV-L2M-DOMAIN-* / SERVICE-* / REPLAY-* / INFRA-*，TC 使用 CMD/QRY/CON/JOB/COMMON，路径固定为 reports/runs/<run_id>。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 没有 28 状态主语 | 按状态族和一致性主题收口，细节仍以 03 Step 10 为唯一来源 |
| 事务只看“接口成功” | 增加 carrier-before-complete、同 UoW、rollback、no-write 和 external fence |
| duplicate 口径泛化 | 固定 channel / operation / key / digest / result-kind / result-ref 精确回放 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 状态 | 口语状态 / enabled | 28 个正式状态主语 + helper / trigger / forbidden edge |
| 事务 | 成功即通过 | 同 UoW、完整 carrier、rollback 和副作用断言 |
| 重放 | 重复请求不报错 | exact replay、conflict、in-flight、missing carrier、unknown fence |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 每个 state 单独 AC | 28 条 / 按状态族聚合 | 按状态族聚合，保留全量分母和反查表 |
| Query 是否可 lazy repair | 允许 / 禁止 | 禁止，返回 stale / not-ready / not-available |
| commit unknown 是否换 key 重试 | 允许 / inspect same relation | 只允许 inspect same relation，不换 key、不补偿写 truth |

## 8. 结构化中间产物

### 8.1 正式状态主语分母（28）

| 状态族 | 正式状态主语 |
|---|---|
| CP01 | StartupAdmissionDisposition；MemberPresenceStatus；HostCollaborationAttemptStatus |
| CP02 | SubscriptionScopeStatus；InboundIntakeDisposition；ScreeningDisposition |
| CP03 | RuntimeDeliveryDisposition；RuntimeSubmissionAttemptStatus；RuntimeMaterialReceptionDisposition |
| CP04 | OutboundDisposition；PublicationAttemptStatus；PublicationGapStatus |
| CP05 | InteractionGapStatus；ObservationAttemptStatus |
| CP06 | ExternalContextResolutionStatus；ExternalContextGapStatus |
| CP07 | MemberProjectionStatus |
| application / infra | MemberIdempotencyState；MemberAdapterAvailabilityState；MemberRuntimeBuildState；BlockedSeamDisposition |
| api / worker / jobs | MemberApiHandlerDisposition；MemberConsumerEntryState；MemberWorkerRegistrationState；MemberConsumerItemDisposition；MemberJobEntryState；MemberJobRunDisposition；MemberJobRegistrationState |

### 8.2 状态 / 事务验收表

| 验收项 | 主题 | 通过条件 | 失败条件 | planned TC / EV | 裁决影响 |
|---|---|---|---|---|---|
| AC-L2M-STATE-001 | 正式状态名与合法迁移 | 28 状态主语、factory / successor、allowed edge 与 03 一致 | 口语 / 旧名 / 未定义 variant 被接受 | TC-L2M-CMD-002/003；EV-L2M-DOMAIN-* | 失败则不通过 |
| AC-L2M-STATE-002 | terminal / append-only | immutable fact、decision、material、link、view、report 以新 record / revision 表达变化 | 原地改写、删除历史或缺 trace | TC-L2M-COMMON-006；EV-L2M-DOMAIN-* | 可能触发 VF-003/009 |
| AC-L2M-TX-001 | Command UoW 原子性 | truth / successor、trace / marker、完整 result 与 reservation 同 UoW 提交或同回滚 | 半提交、carrier 缺失仍 complete、失败后返回 Accepted | TC-L2M-COMMON-001/004/005；EV-L2M-SERVICE-*、INFRA-* | 失败则不通过 |
| AC-L2M-TX-002 | Consumer / Job 事务边界 | receipt / local relation / report 与允许的 source-independent effect 同 UoW；不修 source | consumer/job 修改 CP01~CP06 source 或无 report | TC-L2M-CON-*、JOB-*；EV-L2M-ENTRY-*、JOB-* | 失败则不通过 |
| AC-L2M-TX-003 | Query no-write | 16 Query 不 digest、不 reserve、不写 Store / audit / projection / result、不调用 resolver/handoff | 任一隐式修复或写入 | TC-L2M-QRY-*；EV-L2M-SERVICE-* | 可能触发 VF-003 |
| AC-L2M-IDEMP-001 | exact duplicate replay | 同 channel / operation / key / digest / kind / ref 返回完整 typed carrier，不重进 service body | duplicate 第二次 mutation、从 current truth 重算 | TC-L2M-COMMON-002；EV-L2M-REPLAY-* | 可能触发 VF-005/008 |
| AC-L2M-IDEMP-002 | conflict / in-flight / missing carrier | digest 冲突为 Conflict；未完成为 InFlight；carrier 缺失为 StoredResultUnavailable / consistency defect | 覆盖 reservation、空成功或第二写者 | TC-L2M-COMMON-003~005；EV-L2M-REPLAY-* | 失败则不通过 |
| AC-L2M-IDEMP-003 | CAS / append | mutable record 使用同 Store MemberStoreVersion；immutable collision 不当 duplicate replay | cursor / watermark / domain revision 当 version，旧写覆盖新写 | TC-L2M-COMMON-006；EV-L2M-INFRA-* | 失败则不通过 |
| AC-L2M-IDEMP-004 | commit unknown / rollback | inspect same relation、保留 unknown marker、rollback failure safe diagnostic；不换 key / 盲重跑 | false success、补偿写 truth、删除 marker | TC-L2M-COMMON-005；EV-L2M-REPLAY-* | 可能触发 VF-005/008 |
| AC-L2M-PROJ-001 | projection / Job isolation | CP07 只读 committed fact / neutral resolution；cursor / watermark 不覆盖新值；partial item 隔离 | rebuild / report 修复 source truth | TC-L2M-JOB-004/005、QRY-014；EV-L2M-PROJECTION-* | 失败则不通过 |
| AC-L2M-SEAM-001 | external state fence | Submitted / Resolved / Ready / Unknown 仅 local posture，不等外部 accepted / delivered / observed / healthy / authorized | 外部状态被写成本地成功 | TC-L2M-CMD-004/007/009、CON-004/005；EV-L2M-ENTRY-* | 可能触发 VF-005 |

### 8.3 reserved / blocked transition

| ID | 边 | 验收处理 |
|---|---|---|
| scope_supersede_gap | SubscriptionScopeStatus Active -> Superseded | 只允许 blocked / wait_design；不以 repository update 替代 helper |
| L2M-DDD-003 | Consumer receipt reconstruction | unsupported / missing carrier 保守拒绝；不补 schema |
| L2M-DDD-004~007 | CP04~CP07 attempt / gap / resolution / projection helper | 保持 reserved / blocked；不以 cursor、watermark 或 object store_version 伪造 |

### 8.4 跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 状态名无漂移 | 通过（设计级） | 以 03 §9 为唯一正式名称 |
| phase / external truth 未越界 | 通过 | accepted / delivered / observed / ready 不作 member truth |
| 副作用断言完整 | 通过（规划） | 真实执行需 trace / carrier / rollback artifact |
| Query / Job no-repair | 通过 | 由 QRY / JOB suite 证明 |
| duplicate / conflict / unknown fence | 通过（规划） | EV 需真实 relation pair |

## 9. 回填草稿

正式 §8 应写入 28 状态主语分母、状态 / 事务 / 幂等验收表、reserved 处理和跨状态审计；不得填实际测试结果。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| L2M-DDD-004~007 helper | CP04~CP07 正向 | blocked / reserved |
| physical Store / crash semantics | durable proof | L2M-DDD-002，待实现产品 |
| external feedback source | unknown / late mapping | L2M-UP-004，attempt / gap |

## 11. 进入下一步条件

- [x] 28 个正式状态主语和状态 / 事务门禁可追溯。
- [x] 合法、非法、reserved、duplicate、CAS、rollback、unknown 规则可判定。
- [x] Query / Job no-repair 和 external fence 已闭合。
