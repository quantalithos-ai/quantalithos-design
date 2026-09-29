# Step 13. 设计风险与待确认事项

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 13。

- [x] 读取项目 ledger、02 flow、Step 4~12、正式 00/01 风险与待确认事项。
- [x] 区分概要设计风险、外部待确认与稳定承接项。
- [x] 对每项记录影响对象/接口/处理流/状态及当前保守门禁。
- [x] 完成 owning project、关闭上限和历史污染审计。

## 2. 本步输入、问题回答与取舍

风险是已经确定会威胁概要设计成立性的结构问题，必须有当前处置；待确认是需要正式 owner/provider/环境给出定论的问题，必须有关闭前门禁。Step 12 已收稳的六 CP、26 对象、30 入口、多轴状态和禁止配置化规则不重新悬空。

调优、排期、实现仓准备和测试执行不作为本步风险；外部风险只在它直接阻塞本仓对象/接口/处理流/状态的正向路径时纳入。本仓无权修改 owning project，本步只记录 blocker 与 owner。

## 3. 设计风险

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `HR-AR-001`：typed source/material 槽位被误当已可用 owner schema | CP2 binding/capture、CP3 manifest、CP6 material | 所有名称仅为本地 required seam；AR-UP-001/006~008 未关闭时正向 adapter blocked，不用 opaque JSON/fake 替代。 |
| `HR-AR-002`：跨 source fence/coverage 被压成单 timestamp 或“最大版本” | CaptureCoverage、ManifestClosure、archive job aggregate | 每 source 独立 authority/version/fence/coverage；global job 保留 partial/stale/missing/conflicting，不承诺全局强一致。 |
| `HR-AR-003`：closure、integrity、compatibility、placement 被串成布尔成功 | ArchiveBundle、assessment、placement、read surface | 多轴独立保存与查询；任何 Unknown/Blocked/Failed 均不可由其他轴成功掩盖。 |
| `HR-AR-004`：governance ref 被实现为 Archive 本地 policy engine | GovernanceDecisionRef、LifecycleExecution、配置 | 只校验正式决定适用性；期限/hold/delete/risk 不能本地推理或配置默认。 |
| `HR-AR-005`：外部 ACK/timeout 与本地提交不明导致重复副作用 | ExternalActionRecord、ArchivePlacement、LifecycleExecution、RestoreHandoff、CompensationRecord | intent-before-effect；key/digest/input revision 固定；CommitUnknown 先读本地结果与正式 probe，不盲重放。 |
| `HR-AR-006`：Bundle 或 RestoreRequest 被实现成跨域写权限 | RestorePlan/Item/Handoff、receiver ports | per-owner 最小材料与 receiver-specific outcome；无共享数据库/全局事务；handoff success 不推导业务 restored。 |
| `HR-AR-007`：workspace projection、Artifact ref 或 audit 摘要填补 canonical/body/审计缺口 | source-authority matrix、ManifestEntry、CaptureCoverage | material class 永久保留；auxiliary/ref/summary 不升格；缺口仍 partial/blocked。 |
| `HR-AR-008`：查询为“提高可用性”触发 capture/reverify/retrieval/retry | 5 Query 与读视图 | 所有 Query no-write 且 current redaction；not-available/partial/unknown 显式返回。 |
| `HR-AR-009`：状态名称同名引发跨轴错误迁移或全局成功 | Job、capture、bundle、verification、placement、restore 多轴 | 状态必须带对象/轴解释；sealed/verified/committed/retrievable/handoff-complete 不互推。 |
| `HR-AR-010`：未闭合 provider/worker/outbound 配置被当 readiness | adapter/job/consumer/store config 与事件候选 | 启动 capability validation + fail-closed；配置/fake 不产生 digest、commit、delivery、evidence 或 readiness。 |
| `HR-AR-011`：`L0-sdk` 全局依赖方向冲突污染 package graph | compile/runtime/adapter 分类、03 模块依赖 | 保持 `AR-ARCH-001`；Archive 服务端不引入 SDK compile，等待全局标准 owner 与 L0-sdk 对齐。 |

## 4. 待确认事项

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `AR-UP-001`：各 L1 owner 的最小 snapshot/export/query、source version/watermark、fence、coverage 合同 | CP2 CaptureAttempt/Coverage、CP3 closure、CP6 plan/material | owner-by-owner required port；无正式合同即 Binding/Attempt Blocked，不能声明完整 capture。Owner：各 L1 truth project。 |
| `AR-UP-002`：项目 lifecycle 与 archive trigger/restore handoff | CP1 admission、CP5/CP6、业务状态解释 | 只引用正式 decision/ref；Archive 不设置 archived/dissolved/restored。Owner：`L1-work`/正式项目状态域。 |
| `AR-UP-003`：RetentionPolicy、legal hold、delete authority、risk acceptance 模型与有效性 | CP5 GovernanceDecisionRef/LifecycleExecution、配置 | 无决定或冲突即 Blocked；不默认期限/解除 hold/删除/风险接受。Owner：`L1-governance`/明确 owner。 |
| `AR-UP-004`：digest/signature/key/KMS/encryption/compression/schema evolution authority 与能力合同 | CP4 assessment、CP3 seal、CP6 restore compatibility、配置 | provider-neutral typed refs；Unknown/Unsupported/Blocked，不生成算法/key/digest/signature。Owner：待正式指定的安全/schema/设施 authority。 |
| `AR-UP-005`：storage location/tier/commit/retrieval/probe 语义 | CP5 placement/retrieval/lifecycle 与恢复前置 | adapter seam；无 commit/probe 不声称 durable/retrievable，RTO/SLA 不承诺。Owner：对象存储/设施 owning project。 |
| `AR-UP-006`：Artifact archive handoff 的正文/ref/lineage/content closure 与兼容边界 | CP2/CP3/CP6 | 仅 owner-approved material/ref；ref 集合不等正文/血缘闭包。Owner：`L1-artifact`。 |
| `AR-UP-007`：audit/evidence export、redaction、coverage 与验证接缝 | CP2/CP3 查询与证据材料 | 只消费获准脱敏 material/ref；摘要不等完整审计链。Owner：`L4-observability`。 |
| `AR-UP-008`：workspace archive read/export 合同与 projection coverage | CP2 binding、CP3 manifest、读面 | 只作 Auxiliary projection，绝不补 canonical；无合同时相关 item Blocked。Owner：`L1-workspace`。 |
| `AR-UP-009`：各 owner restore receiver 的 import/restore/command/handoff、outcome、probe 与 compensation | CP4 target compatibility、CP6 全部恢复入口/状态 | per-owner unsupported/blocked/pending/commit-unknown；无合同不构造成功。Owner：各 truth owner。 |
| `AR-ARCH-001`：`L0-sdk` 与 Archive compile/runtime 方向 | 03 package/module dependency、下游适配 | Archive 不依赖 SDK；等待全局依赖规则 owner 与 `L0-sdk` 正式设计统一。 |
| `AR-HLD-Q-001`：Archive 本地 committed-fact/outbox 是否需要及 event family | Step 7 outbound candidates、Step 8 publisher、状态传播 | 合同闭合前不发送、不创建 delivery evidence；需要时 03 回补对象/事务并回退 Step 6~9 审核。Owner：Archive + Bus/consumer contract owners。 |
| `AR-HLD-Q-002`：真实 workload、Bundle 规模、时延/容量/恢复目标 | batching、worker/query budgets、storage/restore 能力 | 不固定吞吐、分钟级 RTO、容量或 page/batch 默认；等待 workload/环境/测试 authority。 |

## 5. 当前完成上限与关闭门禁

| 路径 | 当前可完成 | 当前不可声称 |
|---|---|---|
| 本地 domain/application 骨架 | 六 CP、26 对象、30 入口、状态/异常/配置边界 | 已实现、可编译、目标仓存在 |
| 外部 source/governance/capability/storage/receiver | required port 与保守失败 | exact schema/provider、真实联调、成功结果 |
| Bundle/restore 语义 | manifest/closure、assessment、placement、plan/handoff 多轴骨架 | 真实 Bundle/digest/material/commit/restored |
| 测试/证据/验收 | 为 03/05/06 预留可测试 seam | run_id、report、artifact、evidence alias、verdict、risk acceptance/signoff/readiness |

风险关闭必须由对应正式文档/合同、实现与证据分别证明；另一个项目“已停审”不自动关闭本仓 blocker。本轮未回写或通知 owning project。

## 6. 审计与进入下一步条件

| 审计项 | 结论 |
|---|---|
| 风险 / 问题分离 | 11 项风险有当前处置，12 项待确认有影响与挂起门禁。 |
| 对象/接口影响 | 每项均回指已收稳 CP/object/interface/flow/state/config，不是泛化上游风险。 |
| 稳定结论 | Step 12 稳定骨架未重新改为待确认。 |
| owner 边界 | 所有外部问题指向 owner；本仓未越权修改上游。 |
| 非任务化 | 无 backlog、排期、实现动作或测试结果。 |

正式 §13 可摘录 §3~5。概要风险与待确认已收稳，`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 14 正式装配。
