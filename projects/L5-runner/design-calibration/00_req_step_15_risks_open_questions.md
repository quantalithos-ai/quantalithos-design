# 00 需求 Step 15 · 风险与待确认事项

> 状态：`completed`
> 前置：`00_req_step_01_upstream_relationship.md`～`00_req_step_14_acceptance.md`
> 回填章节：正式 `00` §15 风险与待确认事项

## 1. 风险清单

| 风险 ID | 风险与触发 | 影响 | 当前处置 | 状态 |
|---|---|---|---|---|
| `RUN-UP-001` | Artifact 的 Release locator、transport、manifest、digest/signature、revoke/expire consumption contract 未闭合。 | 无法锁定取得与完整性接口。 | 只保留能力级要求；未验证材料 fail-closed。 | `blocked` |
| `RUN-UP-002` | Governance 的 version/baseline 与 approval/decision authority chain、scope、expiry、revoke、conflict 未闭合。 | Runner 不能本地判定 approved/baselined。 | authority 不可验证即 pending/blocked。 | `blocked` |
| `RUN-UP-003` | Sandbox Runner-facing request、幂等、lease、orphan、cleanup、恢复合同未闭合。 | 运行、停止、清理和恢复无法形成正向集成。 | 保留 `accepted ≠ running` 和 cleanup guard。 | `blocked` |
| `RUN-UP-004` | Runtime 端侧安全状态、结果和恢复 read surface 未闭合。 | 不能确认 running/terminal/outcome。 | 仅消费正式安全 view；未知不升级。 | `blocked` |
| `RUN-UP-005` | Observability diagnostic、handoff、receipt、visibility/freshness/retention seam 未闭合。 | 不能声称诊断进入正式证据链。 | 只定义 redacted summary 与 handoff 状态。 | `blocked` |
| `RUN-UP-006` | Archive 正向消费和恢复合同未闭合。 | 历史上下文不能进入核心运行判定。 | Archive 仅作外围引用。 | `blocked` |
| `RUN-UP-007` | 跨平台 host resource/port probe、Sandbox allocation、cleanup 责任未统一。 | 不能固定资源指标和平台实现。 | 需求只要求冲突可见、责任分离、fail-closed。 | `blocked` |
| `RUN-UP-008` | L0-sdk 精确 client/version/error/redaction/trace surface 未完全核验。 | 不能写具体 SDK 方法或 ready 结论。 | 坚持 SDK-first，exact surface 后置。 | `pending` |

## 2. 待确认事项

| 问题 ID | 待确认内容 | 负责来源 | 影响章节 | 未确认前口径 |
|---|---|---|---|---|
| `OPEN-RUN-001` | Release consumption object 的 locator、manifest、digest/signature、撤销和过期字段及可见性。 | `L1-artifact` | §6、§12、§14 | 不写具体协议；保持 blocked。 |
| `OPEN-RUN-002` | approved/baselined authority chain 的适用性、scope、expiry、revoke、冲突判定。 | `L1-governance` | §4、§6、§10、§14 | Runner 不本地推断。 |
| `OPEN-RUN-003` | Sandbox request/lease/cleanup/orphan/recovery 的公开 Runner-facing contract。 | `L4-sandbox` | §7、§10、§12、§14 | `accepted` 不等于 running。 |
| `OPEN-RUN-004` | Runtime status/result/recovery 的安全只读面。 | `L2-runtime` | §7、§11、§12 | 无 owner ref 即 unknown。 |
| `OPEN-RUN-005` | Observability 诊断摘要、handoff receipt 和 retention/visibility。 | `L4-observability` | §7、§11、§12 | 本地诊断不升级为 evidence。 |
| `OPEN-RUN-006` | Archive 正向引用和恢复消费的范围。 | `L4-archive` | §6、§12 | 不影响核心运行。 |
| `OPEN-RUN-007` | 跨平台资源、端口分配、清理责任和目标 workload。 | 上游联合确认 | §3、§13、§14 | 不写历史性能数字。 |
| `OPEN-RUN-008` | SDK 版本、错误/redaction/trace 和公开 adapter surface。 | `L0-sdk` | §6、§12 | 不写具体 API。 |

## 3. 历史污染处置

旧 README/正式文档中的 Docker、Tauri、gVisor、Firecracker、`latest`、冷/热启动数字、并发数字和本地日志成功语义均只作 historical material 或 pending candidate；不得进入当前目标、验收或实现承诺。

## 4. 门禁

风险和问题没有被本地需求“关闭”。Step 16 只能建立追溯和孤儿审计；涉及上游合同的项目保持原状态。

`Step 15 gate_status = pass`；下一步允许进入 `Step 16 追溯矩阵与孤儿项审计`。
