# 01 架构 Step 14：风险与待确认事项

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 14。

### Step 内计划

- [x] 读取 Step 1~13、项目 ledger 和所有 pending/blocker。
- [x] 区分已识别风险与尚缺外部裁决的待确认事项。
- [x] 诊断旧风险页中的 TODO、概率等级、无 owner 与预支方案。
- [x] 输出风险表、待确认表、架构完成上限和门禁。

## 2. 问题回答、历史诊断与取舍

当前主要风险不是“大包慢”这类未量化猜测，而是 source/decision/integrity/storage/receiver 合同未闭合时，错误地宣称完整、可信、已提交或可恢复。`AR-UP-001~009` 已知会影响主线，属于正式风险；具体 schema、provider、algorithm、tier、阈值和 SDK 依赖方向缺少外部裁决，作为待确认事项挂起。

旧风险页用中/高概率、P1、优化 pipeline、删除坏包等方案式表达，却没有 authority、影响和保守口径。当前不写最终解决方案、负责人或排期；只说明阻塞哪类正向结论。

取舍：这些 blocker 不阻塞 01 的保守边界设计，却有条件阻塞 02/03 中相应精确协议、04 默认配置、实现集成以及所有 readiness/成功声明。

## 3. 结构化中间产物

### 3.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `AR-UP-001` owner snapshot/export/version/fence/coverage 异构或缺失 | U2/U3/U6、跨源闭包 | per-source binding；partial/stale/missing/conflicting | 有条件阻塞 | 不阻塞架构边界，阻塞宣称完整 capture 和精确协议。 |
| `AR-UP-002` 项目 lifecycle 与 archive/restore handoff 未闭合 | U1/U5/U6、项目状态边界 | 只消费正式 owner decision/ref；缺失 blocked | 有条件阻塞 | Archive 不发布或修改 archived/restored。 |
| `AR-UP-003` retention/hold/delete/risk authority 未闭合 | U5、安全与配置 | 不默认期限或许可；冲突/缺失 fail-closed | 有条件阻塞 | 阻塞对应生命周期/处置正向动作。 |
| `AR-UP-004` digest/signature/KMS/encryption/compression/schema authority 未闭合 | U4、长期验证/兼容 | 保持 unknown/unsupported；不私造算法/key/digest | 有条件阻塞 | 阻塞 verified、长期可读和精确配置。 |
| `AR-UP-005` storage location/tier/commit/retrieval 未闭合 | U5、可用性/容量 | provider-neutral seam；pending/unavailable/commit-unknown | 有条件阻塞 | 阻塞 durable/available 与 RTO 声明。 |
| `AR-UP-006` Artifact 内容闭包/正文-ref/兼容边界未闭合 | U2/U3/U6 | owner-approved material/ref only；缺口显式 | 有条件阻塞 | ref 集合不得当正文闭包。 |
| `AR-UP-007` Observability export/redaction/coverage 未闭合 | U2/U3、审计 | 只消费获准脱敏 material/ref；coverage 不足即 partial | 有条件阻塞 | 不把摘要当完整审计链。 |
| `AR-UP-008` Workspace archive read/export 未闭合 | U2/U3 | projection-only auxiliary；不填 canonical 缺口 | 不阻塞核心 | 缺失辅助 projection 不破坏 owner-source 主线。 |
| `AR-UP-009` restore receivers/outcome/probe/compensation 未闭合 | U6、恢复与幂等 | per-owner/item pending/partial/commit-unknown；先核对 | 有条件阻塞 | 阻塞恢复成功与自动安全重试。 |
| `AR-ARCH-001` `L0-sdk` 全局矩阵与专项正式边界方向冲突 | Step 7、后续 package graph | Archive 不引入 SDK compile；SDK 仅下游 runtime adapter | 有条件阻塞 | 阻塞把 SDK 写入实现依赖，owner 为全局依赖标准 + L0-sdk。 |

### 3.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| 各 source 的最小 snapshot/export/ref 合同 | U2/U3/U6 | owner 对 schema、version comparator、fence、coverage、error 的正式承诺 | 只固定概念和失败上限 | 不由 Archive 统一发明。 |
| 项目状态何时允许发起 archive/restore | U1/U5/U6 | `L1-work`/项目 owner 的状态与 command/handoff 合同 | Archive admission 仅引用 decision；无决定 blocked | 不能从事件名或旧 README 推断。 |
| retention/hold/delete/risk 决定模型 | U5/配置/安全 | governance/明确 owner 的 authority、适用范围、撤销/冲突语义 | 不执行正向动作 | 不使用默认 7 年或默认无 hold。 |
| digest/signature/encryption/compression/schema evolution 机制 | U3/U4 | 算法/格式/key-ref/schema authority 和版本策略 | provider-neutral + unknown/unsupported | 01 不做产品或算法选择。 |
| storage provider、tier、commit/probe/retrieval 语义 | U5/容器/配置 | 外部设施合同和真实部署约束 | adapter seam；不承诺 tier/RTO | hot/warm/cold 只是角色语义，非产品事实。 |
| Artifact 与 audit 材料的可归档闭包 | U2/U3 | `L1-artifact`/`L4-observability` 的 approved material、redaction、coverage | 只接收明确材料/ref | 不能由 Archive 推断“全量”。 |
| Workspace projection 是否进入某请求 | U2/U3 | 请求范围/owner 对辅助 projection 的正式授权与 export 合同 | 默认不作为 canonical 必选项 | 其存在与否不改变 L1 slice。 |
| receiver 的 import/restore/command/handoff 与 probe | U6 | 各 owner 的 acceptance、commit、idempotency、conflict、unknown 合同 | 材料可停在 blocked/pending | 不建立统一跨域写协议。 |
| `L0-sdk` 与 Archive 的依赖方向 | Step 7、02/03/07 | 全局规则 owner 与 SDK owner 的一致裁决 | 服务端不反向依赖 client | 只记录 blocker，不跨仓修改。 |
| workload、容量、时延和恢复目标 | 运行承载、横切、配置/测试 | 真实 workload authority、环境和测量 baseline | 不承诺分钟/吞吐/99.9% | 进度/局部状态可见仍为硬要求。 |

### 3.3 当前处理口径

风险表记录“已知合同缺口可能造成伪成功或越界”的正式风险；待确认表记录“外部 owner 仍需给出什么具体定论”。同一 blocker 可同时在风险表说明影响，在待确认表说明缺失确认，但不在本步预支其答案。当前 01 只能证明架构在缺口存在时如何安全失败，不能证明任一依赖、算法、存储、receiver、测试或运行环境已经可用。

### 3.4 架构完成上限

```text
architecture_boundary = reviewable_and_fail_closed
external_contracts = unresolved_where_listed
implementation = not_started
integration = not_proven
tests = not_run
bundle_digest_evidence = not_created
acceptance_signoff_readiness = not_claimed
```

## 4. 回填与门禁

正式 §15 承接风险表、待确认表和完成上限。没有把 TODO、方案、概率评分或无来源优先级写成风险。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 15 ADR 与需求追溯`。
