# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态与开工确认

- 状态：`completed / pass_with_upstream_blockers`；`current_part = closed`。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2；未来回填正式 03 §2。
- 开工依据：[Step 1](03_ddd_step_01_upstream_boundary.md) 已通过，项目 ledger 与 03 flow 允许进入 Step 2。
- 写入边界：只收稳整份 03 的实现契约范围和本轮 Step 1～4 的交付截面，不写布局、对象字段或实现。

### 1.1 本 Step 串行计划

1. 读取 Step 1 与正式 00 核心闭环、正式 01 演进边界、正式 02 §2/§4~13。
2. 逐项回答模块、对象、入口、状态、后续能力、下游文档和实现者交付问题。
3. 形成设计目标、范围覆盖、非范围和当前授权截面。
4. 后置审计旧 03/draft 的额外能力，形成回填草稿与门禁结论。

## 2. 本步输入

- [Step 1 上游输入边界](03_ddd_step_01_upstream_boundary.md)中的承接表、输入缺口与完成上限。
- [正式 00](../00-需求文档.md) §7~§12 的 A1~A9、FR、业务规则和 source-authority matrix。
- [正式 01](../01-架构设计.md) §7/§8/§10/§14 的运行角色、依赖裁剪、交互与事实驱动演进。
- [正式 02](../02-概要设计.md) §2、§4~§13 的六 CP、26 对象、30 入口、流程、状态、异常、配置和承接清单。
- 详细设计书写规范 §5.2；`L1-workspace` Step 2 仅作范围表达粒度样本。

## 3. SOP 问题回答

1. **必须覆盖哪些模块？** 整份 03 必须覆盖 CP1 请求/作业、CP2 来源绑定/采集、CP3 manifest/closure、CP4 integrity/compatibility、CP5 placement/lifecycle、CP6 restore/handoff，以及它们在 contracts/domain/application/infra/inbound/operations 中的落点。这里是语义覆盖，不预定 crate 数量。
2. **必须定义哪些对象、接口、事件、job 和状态？** 26 个正式对象、3 Command、5 no-write Query、5 Consumer、17 Operations Job、7 required/local ports 全部进入整份 03。3 个 outbound event 仍是候选，只有 `AR-HLD-Q-001` 关闭后才进入正式发送契约。所有局部状态轴都须穷举，不能合并为全局 success。
3. **哪些能力属于后续阶段？** 扩展更多 owner/source、长期兼容转换、分片/流式/独立扩缩、跨区域灾备、跨包搜索/趋势/RCA 和产品体验只在正式合同或 workload 证据触发后重开；不能借“后续”移走当前的 source authority、closure、多轴状态、no-write、幂等、unknown、reconcile 和 owner-specific handoff。
4. **哪些内容归其他文档？** 04 负责配置项和值/来源/生效；05 负责完整测试策略和执行方案；06 负责验收门禁/证据/verdict；07 负责任务、phase/commit boundary、实施台账与 planned skeleton；部署运维另行设计。03 只给它们可引用的实现契约和测试切点。
5. **实现者最终应能完成什么？** 完整 03 收口后，应能按 module/file/object/trait/protocol/flow/state/UoW/error/config binding/test seam 落码本仓安全骨架；外部 exact contract 未关闭的 adapter 只能实现为显式 disabled/blocked wiring。本轮只到 Step 4，不能作为完整编码授权。

## 4. 当前文档与旧材料问题诊断

| 位置 | 问题 / 风险 | 修正方向 |
|---|---|---|
| 正式 02 §2/§12 | “03 必须展开完整契约”可能被误读成本轮已授权全部 03 | 分开整份 03 目标与本轮仅 Step 1～4 的交付截面 |
| 正式 02 §7 | 3 outbound candidates 与 30 个正式入口并列，容易被误计为 ready API | 30 个正式入口只含 3+5+5+17；candidate 独立保持 blocked |
| 26 对象与大量 typed refs/DTO | typed carrier 可能被升格成额外 truth object | 26 个对象为业务主语集合；carrier/DTO/port 不自动新增业务生命周期 |
| 旧 03 | `ArchiveIndex`、`RetentionClass`、`LegalHold` 等超出正式对象集合 | 不进入范围；需要的查询索引、decision ref、hold guard 以后作为技术/接缝合同表达 |
| 旧 README/draft | provider、期限、合规声明、性能目标和 UI/检索增强混入核心 | 指定到 owning project、04~07 或未来需求重开，不生成本轮实现单元 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 整份 03 范围 | 分散于 02 各章 | 六 CP、26 对象、30 入口、7 ports、多轴状态统一列入 | 可逐项做后续闭环审计 |
| 本轮授权 | 用户授权到 Step 4 | 明确只交付输入、范围、约束与计划布局 | 防止提前写 Step 5 或正式正文 |
| 外部能力 | required seam 与产品选择容易混读 | exact external contract/provider 仍 blocked | 设计文件不能制造可用性 |
| 非范围 | 上游和旧材料分别描述 | 每项明确 owning project 或下游文档 | 防止实施者自行补权威或产品选择 |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| 保留完整核心闭环，外部正向接入逐项 blocked | 本地安全/失败路径完整，不丢恢复与生命周期接缝 | 部分 adapter 无法宣称 ready | 采用 |
| 只设计 archive request + Bundle，把 restore/lifecycle 移到以后 | 初始文件较少 | 破坏正式 00 的 A5/A7~A9 核心闭环 | 不采用 |
| 把外部 provider 与 exact schema 纳入本轮 | 看似更可运行 | 无 authority，产生虚假技术承诺 | 禁止 |
| 把检索、RCA、UI、跨区灾备一并纳入 | 能力面丰富 | 超出已停审 00/01/02 | 不采用，须需求重开 |

## 7. 结构化中间产物

### 7.1 整份 03 的设计目标

| 目标 | 说明 | 最终交付给实现者的结果 |
|---|---|---|
| 实现布局闭合 | 六 CP、四类实现层、三运行角色落到技术 role | crate/package/binary/module/file 和依赖方向 |
| 请求与作业闭合 | 归档/恢复/生命周期请求、幂等受理、阶段协调与历史 | CP1 对象、services、协议、UoW、状态、错误和测试切口 |
| 逐源采集闭合 | source-authority、binding、attempt、fence/version/coverage/finding | per-owner required ports、typed inputs、并发/替代与 blocked adapter |
| Bundle/manifest 闭合 | immutable revision、declared/actual entries、closure/findings、seal guard | 对象/算法合同、事务、版本、错误和大集合测试 seam |
| 验证与兼容闭合 | fixed input 的 integrity/signature/schema compatibility 多轴评估 | capability ports、assessment history、unknown/failed/unsupported 映射 |
| 存储与生命周期闭合 | placement/retrieval、governance decision ref、intent/result/reconcile | storage/governance ports、commit-unknown、幂等、补偿与安全配置接点 |
| 恢复与交接闭合 | per-owner plan/item/material/handoff/outcome/compensation | receiver ports、最小材料、逐项 flow/UoW/state/error 和 no direct write |
| 读取与证据边界闭合 | 五个 no-write Query、安全披露、可观测/审计/test seam | safe view/page/marker、current redaction、无隐式副作用和证据上限 |

### 7.2 对象与状态范围

| CP | 正式对象（共 26） | 后续必须穷举的状态 / 不变量族 |
|---|---|---|
| CP1 | `ArchiveRequest`、`DeclaredArchiveScope`、`ArchiveJob`、`ArchiveJobStageRecord` | admission、job stage/posture、合法迁移、幂等与历史追加 |
| CP2 | `ArchiveSourceBinding`、`CaptureAttempt`、`CaptureCoverage`、`SourceCaptureFinding` | authority class、attempt、coverage、partial/stale/missing/conflicting、supersede/fence |
| CP3 | `ArchiveBundle`、`BundleManifest`、`ManifestEntry`、`ManifestClosure`、`ClosureFinding` | bundle、immutable revision、Complete/Incomplete/Overfull/Invalid/Unknown、seal guard |
| CP4 | `VerificationAssessment`、`CompatibilityAssessment`、`VerificationFinding` | Pending/InProgress/Verified/IntegrityFailed/Unknown/Blocked 与 Supported/Unsupported/Unknown/Conflicting |
| CP5 | `ArchivePlacement`、`GovernanceDecisionRef`、`LifecycleExecution`、`ExternalActionRecord` | placement/retrieval 双轴、decision validity、intent/dispatch/ack/commit/unknown/failure/compensation |
| CP6 | `RestoreRequest`、`RestorePlan`、`RestoreItem`、`RestoreHandoff`、`HandoffOutcome`、`CompensationRecord` | admission、plan/item/material、handoff/outcome、per-owner partial/commit-unknown、authorized compensation |

Typed refs/value/enums、DTO、view、page、receipt、error、service、port 和 adapter 会进入详细设计，但除非回退正式 02 重新批准，不因此新增第 27 个业务 truth object。

### 7.3 正式入口与 required seam 范围

| 类别 | 数量 | 全量入口 | 范围上限 |
|---|---:|---|---|
| Command | 3 | `RequestArchive`、`RequestRestore`、`RequestLifecycleExecution` | 只写 Archive-owned admission/intent；不声称后台完成或 owner 决定 |
| Query | 5 | `GetArchiveJobStatus`、`GetArchiveBundle`、`VerifyArchiveBundle`、`GetRestorePlan`、`GetRestoreHandoffStatus` | strict no-write；当前访问/披露；不触发 capture/verify/retrieve/handoff |
| Consumer | 5 | `ConsumeArchiveTrigger`、`ConsumeSourceExportFeedback`、`ConsumeGovernanceDecisionChange`、`ConsumeStorageActionFeedback`、`ConsumeRestoreReceiverFeedback` | trusted envelope + dedupe + local binding；event 不等 authority/commit/ack truth |
| Operations Job | 17 | `AdvanceArchiveJob`、`PlanArchiveSources`、`CaptureArchiveSource`、`ReconcileSourceCapture`、`AssembleBundleManifest`、`SealArchiveBundle`、`AssessBundleIntegrity`、`AssessBundleCompatibility`、`PlaceArchiveBundle`、`RetrieveArchiveBundle`、`ExecuteArchiveLifecycle`、`ReconcileExternalAction`、`BuildRestorePlan`、`PrepareRestoreMaterial`、`DispatchRestoreHandoff`、`ReconcileRestoreHandoff`、`ExecuteRestoreCompensation` | 每次有界推进；持久 intent/attempt/revision/fence；未知先 probe，不盲重放 |
| Required/local ports | 7 | `ArchiveStorePort`、`SourceExportPort` family、`IntegrityCapabilityPort`、`CompatibilityCapabilityPort`、`GovernanceDecisionPort`、`ArchiveStoragePort`、`RestoreReceiverPort` family | 只表达本地需要；external exact method/schema 关闭前 adapter blocked |
| Outbound candidate | 3 | `ArchiveJobPostureChanged`、`ArchiveBundleSealed`、`RestoreHandoffPostureChanged` | 非正式入口、非 ready contract；`AR-HLD-Q-001` 关闭前不建 outbox/publisher |

### 7.4 非范围与归属

| 非范围 | Owner / 承接文档 | 当前限制 |
|---|---|---|
| identity/conversation/work/process/governance/artifact/workspace/observability 业务 truth、正文、生命周期和写命令 | 各 owning project | 只消费正式 snapshot/material/ref/decision/handoff；不共享库或反写 |
| 项目 archived/dissolved/restored 与 receiver 业务提交 | `L1-work` / 各 receiver owner | Archive 状态不得推导这些结论 |
| RetentionPolicy、legal hold、delete authority、risk acceptance | `L1-governance` 或明确 owner | 只保存/核验 versioned decision ref，不在本仓裁决 |
| 通用 Artifact 正文/血缘与观测后端/完整审计链 | `L1-artifact` / `L4-observability` | 只持获准材料/ref；摘要/引用不补正文或全链 |
| runtime/member/tools execution、capability registry、sandbox、marketplace | 对应平台 owning project | 不建立执行 host、registry 或隔离实现单元 |
| 产品 UI、SDK client/cache、同步引擎 | 产品、`L0-sdk`、`L5-sync` | 仅消费 Archive 正式边界，不反向进入 server core |
| 对象存储/KMS/secret/schema registry/压缩/算法具体产品与凭据 | 基础设施/安全/schema authority；04/07 | 03 定义 port 与注入，不选择产品或 secret truth |
| 配置项具体值、默认值、来源优先级、生效与敏感性 | `04-配置设计.md` | 03 只定义 typed config ownership/validation/binding seam |
| 完整测试策略、case 矩阵、执行结果与报告 | `05-测试方案.md` | 03 只定义 module/interface test cuts，不执行测试 |
| 验收阈值、证据 alias、verdict、risk acceptance、signoff/readiness | `06-验收标准.md` | 设计静态检查不等验收证据 |
| phase/task/commit boundary、implementation ledger、planned skeleton | `07-实施计划.md` | 当前不创建实施台账或实现仓文件 |
| 自动合规声明、一键恢复 Active、跨包搜索/趋势/RCA、跨区域灾备、任意历史版本转换 | 需求/架构重开与 owning project | 不列为当前文件、对象、接口或测试分母 |

### 7.5 本轮 Step 1～4 交付截面

| 本轮会完成 | 本轮不会完成 |
|---|---|
| 上游边界、整份 03 范围、Rust/runtime/仓库约束、planned 实现单元与文件布局 | 模块 capability/export、完整对象字段/方法、trait/adapter exact methods、协议 schema、逐入口 flow、状态矩阵、UoW/error/concurrency/config/test contracts |
| 目标实现仓不存在与 Core 真实路径的事实登记 | 创建目标实现仓、Cargo manifests、源码、tests、scripts 或 evidence |
| blocker 对 planned unit/file 的影响与 fail-closed 上限 | 关闭外部 blocker、声明 adapter/provider/integration/readiness 成功 |

## 8. 后置历史材料审计

| 材料 | 历史候选 | 当前处理 |
|---|---|---|
| 旧 `03-详细设计.md` | ArchiveIndex、RetentionClass、LegalHold、固定 provider/DB | 不进入对象或实现单元范围；索引是后续持久化需要，治理只保留 decision seam |
| `draft/03` | 早期模块、service、event 或文件候选 | 只作遗漏提示；必须能回指正式 02，否则剔除 |
| README/旧 05/06 | 固定 SLA、期限、算法、成功率、检查项 | 归 04~06 或 blocker；不构成 03 输入事实 |

## 9. 回填草稿

### 9.1 本次详细设计目标与范围

本详细设计覆盖六个 Archive 业务组成部分在技术实现层的完整落码契约：请求/作业、逐源采集、Bundle manifest/closure、完整性/兼容评估、存储/生命周期执行和 owner-specific 恢复交接。正式对象分母为 26，正式入口分母为 30，required/local port 分母为 7；三个 outbound event 仍是待核验候选。

本文不实现或拥有任何上游业务 truth、治理裁决、Artifact 正文/血缘、observability backend、SDK/UI/runtime/tools 能力或外部基础设施产品。配置值、完整测试、验收 verdict 和实施/提交计划分别留 04~07。当前校准只授权到 Step 4，正式 03 和后续实现契约尚未完成。

## 10. 待确认、门禁与进入下一步条件

没有新增需用户立即裁决的范围问题。`AR-HLD-Q-001` 决定未来是否增加 outbound 实现契约，但关闭前“无发送路径”本身是可落码范围；其他 blocker 不改变本地核心分母。

| 检查项 | 结论 |
|---|---|
| 六 CP / 26 对象 | 全量列入，无新增 truth object |
| 30 正式入口 | `3 + 5 + 5 + 17 = 30`，无遗漏；3 outbound candidates 独立 |
| required ports | 7 类齐全，未包装成现有 external API |
| 核心安全边界 | authority/closure/multi-axis/no-write/intent-first/unknown/per-owner 均未后置 |
| 非范围归属 | 每项均指向 owning project、04~07 或需求重开 |
| 当前授权 | 只到 Step 4；正式 03 与 Step 5 均不可写 |

`gate_status = pass_with_upstream_blockers`。实现契约目标、非范围与本轮交付截面已经明确，满足进入 Step 3 的条件。
