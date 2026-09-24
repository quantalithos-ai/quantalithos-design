# 01 架构 Step 8 · 数据所有权与一致性策略

> 状态：`completed`
> 前置：`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_05_bounded_contexts_subdomains.md`、`01_arch_step_07_dependency_direction.md`、正式 `00` §11
> 回填章节：正式 `01` §9 数据所有权与一致性策略

## 1. 本步问题回答与诊断

Runner 只拥有端侧选择、意图、取得/验证过程、资源观察、保护和恢复姿态的正式本地真相。Release、Governance、Project、Runtime、Sandbox、Observability 和 Archive 的状态在本地只能是 snapshot/projection 或 safe ref。旧文档将 LocalRunSession 写成完整执行真相、将日志摘要写成审计材料的做法会形成双真相，当前明确排除。

## 2. 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 显式选择、selection generation、失效姿态 | 正式真相数据 | Runner 拥有用户在本地选了什么及其生命周期。 | 不拥有所选 Release/version 本身。 |
| 运行/控制/清理意图、请求关联、reconcile posture | 正式真相数据 | Runner 拥有用户意图和本地处理姿态。 | accepted/running/terminal/cleanup result 仍来自 owner。 |
| 取得进度、cache/quarantine/protection、完整性验证姿态 | 正式真相数据 | Runner 拥有本地材料和验证过程的状态。 | locator、manifest、签名 authority 和 Release 正文不归 Runner。 |
| 端侧资源观察、连接、cursor、generation、恢复标记 | 正式真相数据 | Runner 拥有带 freshness 的本地观察和恢复进度。 | 不拥有全局 allocation、lease、scheduler 或 owner cursor。 |
| 安全展示组合、预览裁剪和本地失败分类 | 正式真相数据 | Runner 拥有展示组合与解释姿态。 | 不拥有 raw output、diagnostic source、evidence 或 verdict。 |
| Release/baseline/approval applicability、revoke/expiry/visibility | 快照 / 投影数据 | 来自 Artifact/Governance，只为当前选择与资格消费。 | snapshot 存在不等于当前 authority；不得反写。 |
| Sandbox request/boundary/lease/execution/cleanup、Runtime result | 快照 / 投影数据 | 来自 Sandbox/Runtime 的 owner-safe view。 | ACK、PID、端口和本地日志不得升级快照。 |
| Observability diagnostic/handoff、Archive restore/archive posture | 快照 / 投影数据 | 条件性消费安全摘要与状态。 | receipt 不等 evidence；archive 不等运行或清理成功。 |
| Release、ArtifactVersion、Baseline、Decision、Request、Boundary、Lease、Run、Output、Diagnostic、Handoff、Archive refs | 引用关系数据 | Runner 只保存安全关联和 source/correlation。 | ref 存在不代表正文可见、状态有效或结果成功。 |
| actor/session/project、platform capability、source version/digest/cursor refs | 引用关系数据 | 用于绑定语境、平台和来源版本。 | scope/version 变化时必须失效或重新验证。 |
| Release/Artifact/manifest/policy/approval 正文、签名私钥、locator secret | 明确不拥有的正文 / 真相 | 属于 Artifact/Governance/安全 owner。 | 不进入 metadata、日志、preview、telemetry 或 handoff 正文。 |
| Runtime context/memory、Sandbox raw stdout/stderr/capture、Observability audit/evidence/report、Archive bundle、Project/Work 正文 | 明确不拥有的正文 / 真相 | 属于对应 owner。 | Runner 只消费允许的 summary/ref。 |
| token、secret、credential、private key | 明确不拥有的正文 / 真相 | Runner 不拥有其生命周期。 | 仅在正式安全边界短暂使用，不得进入普通持久化。 |

## 3. 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 选择与 selection generation 变化 | 本地真相 ↔ 本地真相 | 本地强一致 | 不生成部分选择；旧 generation 显式 invalidated | 防止已发请求被静默改写。 |
| 意图、请求关联与本地保护状态变化 | 本地真相 ↔ 本地真相 | 本地强一致 | 保持 pending/unknown，不回填为成功 | 本地安全门禁必须原子地表达当前姿态。 |
| source authority 到本地资格 | 外部快照/ref ↔ 本地真相 | 来源版本一致 + 启动前重新验证 | stale/conflict/revoked 时资格失效并 blocked | 本地资格不能超越 owner freshness。 |
| 下载材料与 manifest/digest/source binding | 本地真相 ↔ 外部 ref | 内容绑定一致 | quarantine/invalid，不修改材料或 source | 传输完成不能替代完整性成立。 |
| Sandbox/Runtime owner status 到本地展示 | 外部快照/ref ↔ 本地展示真相 | 最终一致 + source attribution | 显示 stale/unknown/unavailable，不用 PID 补齐 | 允许展示延迟，不允许语义升级。 |
| control/cleanup unknown 与恢复 | 本地意图 ↔ 外部快照/ref | 对账一致 | 冻结自动重放，进入 reconcile/manual-review | 防止重复副作用和误删。 |
| 平台 probe 与 owner allocation/lease | 本地观察 ↔ 外部快照/ref | 冲突显式一致 | 显示 conflict，以 owner 资格为准 | 本地观察只说明端侧现状。 |
| preview/diagnostic/handoff | 本地展示真相 ↔ 外部 ref/明确不拥有正文 | 来源/可见性/redaction 一致 | partial/restricted/blocked，禁止拉取或保存正文补齐 | 保护敏感内容与审计边界。 |
| 本地状态重建 | 本地真相 ↔ 持久承载 | generation/cursor 一致 | 无法确认则 unknown/manual-review | 重建恢复姿态，不推进 owner cursor。 |

## 4. 按架构单元组织的数据所有权

| 架构单元 | Runner truth | snapshot/projection/reference | forbidden body/write | 停审 |
|---|---|---|---|---|
| 选择与资格承接 | selection/generation/qualification posture | Release/Governance/context refs 与 snapshot | Release/approval 正文与反写 | 通过 |
| 取得与材料资格承接 | transfer/cache/quarantine/integrity posture | locator/manifest/digest/policy refs | 修改 Release、签名密钥、secret | 通过 |
| 本地运行意图与生命周期 | request/control intent、correlation、display posture | Sandbox/Runtime status/result refs | execution truth、ACK 升级 | 通过 |
| 资源、清理与恢复保护 | probe/recovery/protection posture、cursor/generation | lease/allocation/cleanup refs | owner cleanup 反写、未知重放 | 通过 |
| 输出预览与失败诊断 | clipped view、local classification、handoff posture | output/diagnostic/handoff refs | raw body、evidence/report/verdict | 通过 |
| 端侧入口与展示 | 用户临时展示选择与 view state | 上述安全 view/ref | 外部正文、私有存储直读 | 通过 |

## 5. 简化关系示意图

#### 简化关系示意图

```text
 +-----------------------+
 | 外部 owner truth      |
 +-----------+-----------+
             |
             | safe snapshot / ref
             v
 +-----------------------+
 | Runner 本地资格/展示  |
 | local truth           |
 +-----------+-----------+
             |
             | intent / protected posture
             v
 +-----------------------+
 | 正式 owner seam       |
 | no upstream overwrite |
 +-----------------------+

 External body / secret / evidence
             X  not owned or persisted
```

图后说明：

- 外部 truth 只通过安全快照/引用影响 Runner 本地资格和展示；Runner 不反写 owner。
- 本地意图通过正式 seam 提交，返回状态继续保持来源归属。
- 图不表达数据库、缓存实现、同步流程、事件或事务机制。

## 6. 跨数据边界审计

| 审计项 | 结果 |
|---|---|
| 双真相 | 无；本地意图/姿态与 owner truth 分离。 |
| 投影反写 | 禁止；snapshot/ref 只读，查询 no-write。 |
| 引用正文入仓 | 禁止；raw body、secret、evidence/archive bundle 明确排除。 |
| 强一致误用 | 本地强一致只限 Runner-owned 状态变化；跨 owner 不声明分布式强一致。 |
| 最终一致误用 | 最终一致展示仍需 source/freshness，不能乐观升级。 |
| 失败补偿冲突 | 统一进入 stale/blocked/unknown/reconcile/manual-review，不自动重放。 |

## 7. 回填草稿与门禁

正式 §9 回填数据归属表、一致性策略表、单元表、示意图和审计结论。数据库、schema、cache provider、事务和重试实现后置。

Step 8 gate_status = pass；下一步允许进入 Step 9 关键交互与通信方式。
