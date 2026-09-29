# Step 12. 详细设计承接清单

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 12。

- [x] 读取项目 ledger、02 flow 与 Step 4~11。
- [x] 回答稳定主语、详细设计深度、配置承接、外部 blocker 与回退规则。
- [x] 完成承接清单和前序一致性审计；未新增对象、接口、流程或状态。

## 2. 本步输入与问题回答

稳定输入为六 CP、四类实现层、26 个正式对象、30 个正式入口及其处理流、多轴状态/迁移、38 个异常场景和配置影响/禁止边界。03 继续展开文件/模块、完整字段来源、函数与 port 契约、本地事务/fence/并发、状态矩阵、错误恢复、配置实现和测试切口。

外部 owner/provider/receiver/outbound exact contract 不是已闭合交付；它们进入 Step 13 风险/待确认。若详细设计发现需要改 CP、对象、接口、主流程或状态主语，必须回退 02；若需改变 truth owner、系统责任或依赖方向，必须回退 01/00 与相关 owning project，不得在 03 暗改。

## 3. 稳定输入与详细设计展开

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| CP1~CP6 业务划分；Inbound/Operations、Application、Domain、Ports/Persistence/Adapters 正交分层 | 模块/目录/文件、可见性、依赖方向、runtime builder 与每模块 exports；不得按 source owner 复制业务 truth |
| CP1：ArchiveRequest、DeclaredArchiveScope、ArchiveJob、ArchiveJobStageRecord | 完整字段来源、ID/幂等命名空间、admission guard、stage transition matrix、request/job/history 局部 UoW 和 unknown 读回 |
| CP2：ArchiveSourceBinding、CaptureAttempt、CaptureCoverage、SourceCaptureFinding | per-owner typed capture contract、source-authority 映射、fence/version/coverage 比较、attempt 并发/替代、材料最小化与安全 finding |
| CP3：ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding | manifest revision/entry identity、声明集生成来源、closure 算法合同、大集合处理、revision/UoW 与 seal guard |
| CP4：VerificationAssessment、CompatibilityAssessment、VerificationFinding | fixed input binding、capability feedback mapping、digest/signature/key/schema ref 合法来源、target-specific compatibility 与重验版本化 |
| CP5：ArchivePlacement、GovernanceDecisionRef、LifecycleExecution、ExternalActionRecord | placement/retrieval 双轴、decision validity/hold guard、intent/action key、provider adapter、probe/reconcile/compensation 与本地提交核对 |
| CP6：RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord | per-owner plan/item/material schema boundary、receiver port、handoff idempotency、outcome mapping、commit-unknown probe、compensation authority 与 plan 聚合 |
| typed refs/value/enums 是字段/协议槽位，不是外部事实 | 确定每个本地类型的编码、校验、等价/比较与 redaction；无正式 owner 来源的构造路径保持 blocked |
| 3 Command：RequestArchive、RequestRestore、RequestLifecycleExecution | 完整 request/result DTO、actor/metadata/key、service 函数、权限/authority seam、事务和精确错误类别 |
| 5 Query：GetArchiveJobStatus、GetArchiveBundle、VerifyArchiveBundle、GetRestorePlan、GetRestoreHandoffStatus | 完整 safe view/selector、current access/redaction、partial/stale/hidden/not-available、分页/容量（若适用）与严格 no-write 测试切口 |
| 5 Inbound Consumer：archive trigger、source feedback、governance change、storage feedback、receiver feedback | trusted envelope、source/event identity、schema/version、dedupe、unmatched/quarantine、adapter mapping、局部提交与消费反馈边界 |
| 17 Operations Job：job/capture/assembly/verify/storage/lifecycle/restore/reconcile/compensation | worker lease/fence、输入 selection、checkpoint、expected version、I/O 前后事务、幂等、崩溃恢复、probe/retry/compensation 决策与可测试接口 |
| 3 Outbound Event 仅为 candidate，不是 ready contract | 只有合同闭合后再定义 committed fact/outbox/publisher/schema；否则保持无发送路径，不伪造 delivery evidence |
| 30 条入口处理口径与 intent-before-effect/fixed revision/per-owner/no-write 原则 | 细化完整函数数据流、port/repository 方法、UoW、并发冲突、local commit unknown、outbox（若解锁）与测试切点 |
| admission/job/binding/capture/coverage/bundle/closure/verification/compatibility/placement/retrieval/lifecycle/restore/handoff/compensation 多轴状态 | 穷举允许/禁止迁移、guard、terminal/retry/revision 规则、传播和并发状态矩阵；不得合并成全局成功 enum |
| 38 个关键异常的处理归属与保守姿态 | 精确 error taxonomy、safe disclosure、持久化结果、可恢复条件、probe 与人工/compensation 边界；参数留 04 |
| 配置影响、14 条禁止配置化红线和 03/04 分工 | RuntimeConfig/Loader/Validator/ConfigError、Adapter/Job/Consumer/Store/Query Config 分组、启动 fail-closed 和 builder 注入；04 再定义项和值 |
| source-authority matrix 与 compile/runtime/event/ref/adapter/fake 分类 | 逐依赖核验 exact shared Core symbol 或本地 boundary type；禁止 sibling/SDK/provider 实现依赖和共享数据库 |
| 安全、因果历史、多轴可观测、幂等、fence、commit-unknown 和 current redaction | 为 05/06 留可测 seam 与证据来源；fake 只证明本地分支，不生成真实 digest/commit/handoff/readiness |

## 4. 详细设计继续展开的统一深度

| 维度 | 03 必须回答 | 不得越权填充 |
|---|---|---|
| 模块 / 文件 | 每个 CP 的 domain/application/inbound/port/persistence/adapter 位置与依赖 | 不虚构目标实现仓、现有目录或 baseline |
| 对象 / 字段 | 字段全集、来源、optional 条件、构造/变更入口、序列化边界 | 不复制 owner 私有 schema、secret 或 provider 原始 payload |
| 接口 / 协议 | 本地签名、DTO、error、port 方法、版本与兼容边界 | 不声称对端 exact contract 已存在 |
| 事务 / 一致性 | request/job、manifest revision、assessment、action、handoff 的 UoW/fence/idempotency/unknown recovery | 不设计跨 owner 全局事务或共享库 |
| 状态 / 恢复 | 完整 guard、attempt/revision、retry/reconcile/compensation、stale worker 拒绝 | 不用配置/fake 把 unknown 变成功 |
| 配置 / 装配 | config ownership/validation/injection、capability fail-closed | 不提前替 04 选择具体值/provider/key |
| 测试 / 证据 | unit/contract/integration 切口、negative paths、evidence producer/consumer | 不伪造 run、artifact、report、verdict 或 signoff |

## 5. 回退规则与承接上限

如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计对应 Step 修正，而不是在详细设计中暗改。对象/接口/状态调整至少回退 02 Step 5~9；owner/责任/依赖方向变化回退正式 01/00，并指向 owning project 解决外部合同。

`AR-UP-001~009`、`AR-ARCH-001` 未关闭前，03 只能定义 required seam、保守错误和 blocked wiring，不能交付正向集成为 ready。承接清单不是实现授权、测试结果或验收结论。

## 6. 一致性审计与进入下一步条件

| 审计项 | 结论 |
|---|---|
| 前序一致 | 六 CP、26 对象、30 入口、状态轴、异常和配置边界均来自 Step 4~11。 |
| 无新主语 | 未新增对象、API、流程、状态或外部能力。 |
| 深度充分 | 文件/字段/协议/事务/状态/配置/测试与证据均有 03 展开方向。 |
| blocker 上限 | 外部合同与依赖方向冲突未包装成可实施正向路径。 |
| 回退明确 | 02 主语变化与 01/00 owner/边界变化的回退层级明确。 |

正式 §12 可摘录 §3~5。详细设计承接已收稳，`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 13。
