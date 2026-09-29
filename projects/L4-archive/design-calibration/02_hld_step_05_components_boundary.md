# Step 5. 主要组成部分、职责与边界

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 5。

### Step 内计划

- [x] 读取项目 ledger、02 flow、Step 4、正式 01 U1~U6 和数据/交互结论。
- [x] 先回答 capability、对象发现维度、非职责和接缝问题。
- [x] 诊断旧五部分中技术动作、消费表面与治理 truth 混层。
- [x] 按 CP1→CP6 逐项完成 capability、代码主体、候选对象与停审。
- [x] 输出组成部分总表、对象发现维度、交互总图和跨部分审计。

## 2. 本步输入

Step 4 六 CP/双轴框架；正式 00 A1~A9/F-AR-001~009；正式 01 U1~U6、source-authority、一致性和通信方式。Step 3 的 HC-AR-01~16 是所有 CP 的共同红线。

## 3. SOP 问题回答

1. 六 CP 已由架构单元稳定给出；本步不再按 source domain 或技术 provider 拆分。
2. 每个 CP 必须有本地 truth/state 或核心 invariant 的独立责任，否则不应成为主要组成部分。
3. read/verify、reconcile、audit trail 是跨 CP 或部分内 capability，不另立 owner。
4. 候选对象按 truth/state、policy/invariant、projection/read、reference/boundary、audit/history 发现；service/port/API/DTO 不默认成为 Step 6 对象。
5. 每个 CP 的外部接缝只能声明本地需要什么，不能声明对端 exact contract ready。

## 4. 当前文档问题诊断

旧 02 五部分把“索引检索”“历史观察”作为本仓业务部分，把 retention/legal hold 当本仓 policy，并把 restore/export/replay 聚合成单一出口。这会产生影子业务查询、治理双真相和恢复写权。当前六 CP 从已停审架构单元直接下沉，查询保持组合面，外部 authority 保持 reference/port。

## 5. 改动前后对比

| 旧候选 | 当前处置 |
|---|---|
| 快照固化部分 | 拆为 CP1 请求/作业、CP2 source capture、CP3 manifest/closure，避免“一次固化即完成” |
| ArchiveIndex/历史检索部分 | 不作为 truth CP；查询只组合本仓已承载状态和材料/ref |
| RetentionClass/LegalHold 部分 | 改为 CP5 消费 `GovernanceDecisionRef` 并记录 execution |
| Restore/Export/Replay 部分 | 改为 CP6 plan/material/handoff；不承诺 replay 或 owner commit |
| 历史观察出口 | 下游消费面，不是本仓拥有的业务组成部分 |

## 6. 设计取舍与复杂度判断

六 CP 足以覆盖正式 U1~U6；进一步按 source owner 拆分会复制同一 capture/handoff 语义，按 provider 拆分会让技术载体主导业务结构。对象候选数量预计 22 个左右，Step 6 保留一个主文件但按 CP 分批写对象卡；若单批超过 300 行则按补丁批次拆分，不创建未计划的正式文档。

## 7. 结构化中间产物

### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| CP1 请求与作业协调 | 受理归档/恢复请求、冻结范围/依据/幂等语境、协调阶段 | `ArchiveRequestService`、`ArchiveRequest`、`ArchiveJob` | 不批准业务状态或治理决定，不把 job complete 当全局成功 |
| CP2 来源绑定与采集 | 逐 source 获取 approved material/ref，记录 authority/fence/coverage 与 attempt | `SourceCaptureService`、`ArchiveSourceBinding`、`CaptureAttempt` | 不拥有 source truth，不用 projection/ref 补 canonical 缺口 |
| CP3 Bundle 清单与闭包 | 形成 Bundle/manifest/inventory revision，判断声明集与实际集闭包 | `BundleAssemblyService`、`ArchiveBundle`、`BundleManifest`、`ManifestEntry` | 不定义 source 业务 schema，不以 storage/verification 结果反向改 closure |
| CP4 完整性与兼容评估 | 对固定输入记录 integrity、signature、schema/version compatibility 结论 | `BundleVerificationService`、`VerificationAssessment`、`CompatibilityAssessment` | 不拥有 key/algorithm/schema authority，不把 verified 当业务真实性 |
| CP5 存储与生命周期执行 | 记录 placement/retrieval 和正式治理 decision 下的执行意图/反馈 | `PlacementService`、`LifecycleExecutionService`、`ArchivePlacement`、`LifecycleExecution` | 不拥有 storage backend truth、policy、hold/delete/risk 裁决 |
| CP6 恢复计划与交接 | 形成 per-owner plan/item/material/handoff，记录 receiver outcome 与 reconcile | `RestoreService`、`RestorePlan`、`RestoreItem`、`RestoreHandoff` | 不写 owner 数据库，不决定 committed/restored，不统一各 owner import 事务 |

### 7.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| CP1 | ArchiveRequest、ArchiveJob | RequestAdmissionGuard、DeclaredArchiveScope | JobStatusView | Actor/Authority/Decision refs | ArchiveJobStageRecord | ArchiveRequest、DeclaredArchiveScope、ArchiveJob、ArchiveJobStageRecord |
| CP2 | ArchiveSourceBinding、CaptureAttempt | SourceBindingGuard、CaptureCoverage | SourceCaptureView | SourceAuthorityRef、ArchivedMaterialRef | SourceCaptureFinding | ArchiveSourceBinding、CaptureAttempt、CaptureCoverage、SourceCaptureFinding |
| CP3 | ArchiveBundle、BundleManifest | ManifestClosure | ArchiveBundleView | ManifestEntry、MaterialLocatorRef | ManifestRevision、ClosureFinding | ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding |
| CP4 | VerificationAssessment、CompatibilityAssessment | VerificationInputBinding | BundleVerificationView | Digest/Signature/Key/Schema refs | VerificationFinding | VerificationAssessment、CompatibilityAssessment、VerificationFinding |
| CP5 | ArchivePlacement、LifecycleExecution | LifecycleDecisionGuard | PlacementLifecycleView | StorageLocationRef、GovernanceDecisionRef | ExternalActionRecord | ArchivePlacement、GovernanceDecisionRef、LifecycleExecution、ExternalActionRecord |
| CP6 | RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff | RestoreEligibilityGuard | RestorePlanView | RestoreReceiverRef、RestoreMaterialRef | HandoffOutcome、CompensationRecord | RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord |

### 7.3 各部分交互总图

```text
archive / restore command
          │
          ▼
CP1 Request & Job
          │ declared scope + job context
          ├──────────────────────────────────────┐
          ▼                                      ▼
CP2 Source Capture                         CP6 Restore Planning
          │ bound material/ref                   ▲
          ▼                                      │ verified/retrievable input
CP3 Manifest & Closure ────────┐                 │
          │                    ▼                 │
          │             CP4 Verification ────────┤
          │                    │                 │
          └────────────────────┴──> CP5 Storage / Lifecycle
                                      │
                                      └── external intent / feedback

read / verify query -> CP3 + CP4 + CP5 read composition (no write)
```

关键说明：

- 主归档路径从 CP1 到 CP2/CP3，再由 CP4/CP5 分轴评估和承载；箭头不表示单事务或必然成功。
- 恢复从 CP1 的正式请求语境进入 CP6，并只消费已绑定、可验证、可取回的输入。
- CP6 对外只做 receiver handoff；图不包含 owner 数据写入或 business commit。
- 只读组合不触发 repair/capture/retrieval/handoff，也不构成第七个 CP。

### 7.4 CP1 请求与作业协调

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| archive request admission | actor、scope、authority/decision ref、idempotency context | accepted/rejected/blocked request result | 创建或复用 ArchiveRequest/ArchiveJob | Step 6/7/8/9 |
| restore request admission | actor、bundle ref、target owners、authority ref、idempotency context | accepted/rejected/blocked restore request | 创建 request/job 语境，不开始 owner 写入 | Step 6/7/8/9 |
| job stage coordination | 已持久化 request/job 与逐项结果 | current stage/aggregate posture | 只聚合本仓阶段，不覆盖 CP2~CP6 局部结果 | Step 8/9 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ArchiveRequestService | application service | admission、幂等查重和 job 建立编排 | §7/§8 |
| ArchiveRequest / ArchiveJob | aggregate/entity | 请求声明与作业阶段的本地 truth | §6/§9 |
| ArchiveStorePort | persistence port | 本仓局部原子读写 | §7；完整契约留 03 |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | ArchiveRequest、ArchiveJob | 独立成节 |
| invariant/value | DeclaredArchiveScope | 独立成节，不能包含业务授权判断 |
| audit/history | ArchiveJobStageRecord | 独立成节，历史不可被 current stage 覆盖 |
| service/port | ArchiveRequestService、ArchiveStorePort | 不作领域对象；Step 7/8 承接 |

非职责与接缝：不拥有 actor/project/governance truth；向 CP2~CP6 只传已冻结 request/job context。停审：capability、候选对象和 no-authority 边界完整，`pass`。

### 7.5 CP2 来源绑定与采集

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| source plan expansion | DeclaredArchiveScope、source-authority matrix | per-source binding candidates | 只生成所需 source 项，不固定六域必选 | Step 6/8 |
| owner material capture | binding、正式 export/query port | approved material/ref + source version/fence/coverage | per-source attempt/finding，局部失败可见 | Step 6~10 |
| source reconcile | 已持久化 attempt 与外部可核对结果 | settled/partial/stale/missing/conflicting | 不以事件/cache 替代 owner | Step 8~10 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| SourceCaptureService | application service | 按 source 计划、调用 port、保存结果 | §7/§8 |
| ArchiveSourceBinding / CaptureAttempt | entity/history | 固定 authority 和每次采集语境 | §6/§9 |
| SourceExportPort | runtime port family | 声明逐 owner 所需结果，不代表已实现 | §7；exact schema 留 03/blocker |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | ArchiveSourceBinding、CaptureAttempt、CaptureCoverage | 独立成节 |
| history | SourceCaptureFinding | 独立成节 |
| boundary/ref | SourceAuthorityRef、ArchivedMaterialRef | 作为字段类型；exact owner schema 阻塞 |

非职责与接缝：不保存未获准正文，不比较不同 owner 的版本轴；向 CP3 交付有来源的 material/ref inventory。停审：projection/ref/canonical 已分层，`pass_with AR-UP-001/006~008`。

### 7.6 CP3 Bundle 清单与闭包

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| manifest assembly | request declaration、CP2 bound inventory | immutable manifest revision | 创建 Bundle/manifest revision，不改变 source material | Step 6/8/9 |
| closure evaluation | declared entries、actual entries | complete/incomplete/overfull/invalid + findings | closure 绑定确定 revision | Step 6/8/9 |
| read composition input | manifest、bindings、findings | ArchiveBundleView 输入 | 只读，不触发重组 | Step 7/8 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| BundleAssemblyService | application service | 形成固定 revision 并执行 closure 判断 | §7/§8 |
| ArchiveBundle / BundleManifest | aggregate/entity | 包身份、声明集合和 revision truth | §6/§9 |
| ManifestEntry / ManifestClosure / ClosureFinding | value/policy/history | 条目、闭包结果和差异历史 | §6/§9 |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | ArchiveBundle、BundleManifest | 独立成节 |
| value/invariant | ManifestEntry、ManifestClosure | 独立成节 |
| audit/history | ClosureFinding | 独立成节 |

非职责与接缝：不选择 storage provider/algorithm，不生成业务 claim；向 CP4/CP5/CP6 交付固定 revision。停审：closure 不被外部成功反向定义，`pass`。

### 7.7 CP4 完整性与兼容评估

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| integrity assessment | fixed manifest/material revision、capability feedback | verification result/findings | 每次 attempt 绑定输入，不覆盖历史 | Step 6~10 |
| compatibility assessment | schema/version refs、reader/receiver context | supported/unsupported/unknown/conflicting | 不自动迁移或猜兼容 | Step 6~10 |
| verification read | assessment history | BundleVerificationView | 只读，不调用 provider 修复 | Step 7/8 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| BundleVerificationService | application service | 编排输入绑定和外部能力反馈 | §7/§8 |
| VerificationAssessment / CompatibilityAssessment | entity/value | 分别承载完整性与兼容结论 | §6/§9 |
| IntegrityCapabilityPort | runtime adapter port | 声明处理/验证能力需求 | §7；provider/算法留 blocker |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | VerificationAssessment、CompatibilityAssessment | 独立成节，两个轴不可合并 |
| audit/history | VerificationFinding | 独立成节 |
| reference | DigestRef、SignatureRef、KeyRef、SchemaVersionRef | 字段类型，不包含值/secret 或算法选择 |

非职责与接缝：不拥有 key、secret、算法或 source schema truth；向 CP5/CP6 只交确定输入上的 assessment。停审：unknown/unsupported/integrity-failed 不乐观推进，`pass_with AR-UP-004`。

### 7.8 CP5 存储与生命周期执行

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| placement/retrieval | Bundle revision、storage intent | location/tier/commit/retrieval feedback | intent/result 分离，unknown 可核对 | Step 6~10 |
| lifecycle eligibility | GovernanceDecisionRef、bundle/placement state | eligible/held/blocked/conflicting | 不解释 policy，仅检查适用性 | Step 6/9/10 |
| lifecycle execution | eligible decision + external action port | execution outcome/history | request/ack/commit 分离 | Step 6~10 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| PlacementService / LifecycleExecutionService | application service | 编排外部意图、反馈与核对 | §7/§8 |
| ArchivePlacement / LifecycleExecution | entity/history | 本地位置绑定与动作执行 truth | §6/§9 |
| ArchiveStoragePort / GovernanceDecisionPort | runtime/ref ports | storage 与正式 decision 输入需求 | §7；exact contract 留 03/blocker |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | ArchivePlacement、LifecycleExecution | 独立成节 |
| boundary/ref | GovernanceDecisionRef | 独立成节，强调不是 policy |
| audit/history | ExternalActionRecord | 独立成节，可被 CP6 复用 |
| external values | StorageLocationRef、StorageTierRef | 字段类型，不拥有 backend truth |

非职责与接缝：不决定 retention/hold/delete/risk，不持有 secret/backend truth；向 CP6 提供可取回姿态而非保证。停审：decision/execution/commit 三者分开，`pass_with AR-UP-003/005`。

### 7.9 CP6 恢复计划与交接

#### 本部分职责与 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| restore plan formation | RestoreRequest、Bundle/assessment/placement、target owner refs | immutable per-owner plan/items | 不改变 owner truth | Step 6~9 |
| owner materialization | plan item + approved material/ref | minimal RestoreMaterialRef | 不越出 target owner scope | Step 6/8/10 |
| receiver handoff | item/material + receiver port | per-item outcome | intent/result 分离；commit unknown 先核对 | Step 6~10 |
| reconcile/compensation | prior handoff + probe/result | retry/compensation/manual posture | 不盲重放 | Step 6~10 |

#### 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| RestoreService | application service | 校验、计划、材料、handoff 与 reconcile 编排 | §7/§8 |
| RestoreRequest / RestorePlan / RestoreItem | aggregate/entity | 恢复声明、固定计划和逐项 truth | §6/§9 |
| RestoreHandoff / HandoffOutcome / CompensationRecord | entity/history | 外部意图、反馈和后续姿态 | §6/§9 |
| RestoreReceiverPort | runtime adapter port family | 各 owner receiver 所需边界 | §7；exact contract 留 03/blocker |

#### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff | 独立成节 |
| history | HandoffOutcome、CompensationRecord | 独立成节 |
| reference | RestoreReceiverRef、RestoreMaterialRef | 字段类型；不等于写权限或正文 |

非职责与接缝：不统一各 owner schema/事务，不设置业务 restored，不发布代表 owner 的事件。停审：per-item outcome 与 business commit 分离，`pass_with AR-UP-002/009`。

### 7.10 跨组成部分闭环审计

| 审计项 | 结果 |
|---|---|
| capability 覆盖 | A1~A9 均有 CP 承接；read/verify 为 CP3~CP5 组合；reconcile 在 CP2/5/6。 |
| 重复对象 | request/job、binding/attempt、bundle/manifest、assessment、placement/execution、restore/item/handoff owner 唯一。 |
| 接缝冲突 | CP 间传固定 context/ref/result，不共享外部数据库或跨 CP 万能状态。 |
| 候选池完整 | 每个 truth/state/value/history 候选均指向 Step 6；service/port/API/DTO 未误作领域对象。 |
| 边界越权 | governance policy、L1 truth、Artifact body/lineage truth、workspace truth、audit backend、secret/provider truth 和 receiver commit 均在外。 |
| 后续展开 | Step 6 对象、Step 7 接口、Step 8 流、Step 9 状态均可沿同一 CP 反查。 |

## 8. 回填草稿

正式 §5 摘录总表、对象发现维度、交互图和每 CP 的代码主体/候选/非职责摘要；逐 CP 诊断与停审留在本文件。

## 9. 待确认事项

各 CP 的 exact port/schema/provider 继续挂起；Step 6 只定义本地对象需要的类型槽位，不将其变成外部成功构造器。

## 10. 进入下一步条件

六 CP 已逐项停审，capability→候选对象→后续章节链完整，跨部分无 unresolved 职责/owner 冲突。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 6。
