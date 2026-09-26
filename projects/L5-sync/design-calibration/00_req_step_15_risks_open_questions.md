# 00 需求 Step 15 · 风险与待确认事项

> 状态：`completed`
> 前置：Step 1~14
> 回填章节：正式 `00` §15
> 规则：风险与待确认分表；本步不新增功能、目标或技术方案。

## 1. 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `RISK-SYNC-001` 上游 SDK 的 project/version/source/handoff 精确 surface 未闭合 | 选择、status、pull、push-review | 当前按能力级 adapter 边界表达；未闭合不锁方法名或正向实现。 |
| `RISK-SYNC-002` Artifact/Workspace source、版本 comparator、cursor/gap/replay 责任不明 | 来源绑定、增量 materialization | 当前按逐来源 binding、unknown/blocked 处理，不承诺全局快照或实时增量。 |
| `RISK-SYNC-003` Project 权限与 archived/dissolved/retired posture 读取/允许动作不统一 | 访问门禁、归档项目姿态 | 当前按 fail-closed；本地缓存不得覆盖 owner 结论。 |
| `RISK-SYNC-004` Review Gate handoff、ACK、probe、decision 协议不明 | push-review、验收语义 | 当前严格区分 prepared/submitted/ACK/pending/decision；不把 ACK 当 accepted。 |
| `RISK-SYNC-005` unknown outcome 与幂等合同不明 | 恢复、重试、副作用安全 | 当前采用 prepare→call→probe/finalize 需求纪律；无法证明等价则 manual/blocked。 |
| `RISK-SYNC-006` `.qs-sync` metadata schema、迁移、完整性和保留规则不明 | 初始化、status、恢复、provenance | 当前只要求受控 metadata 与可回链；不锁单文件、字段或永久保留。 |
| `RISK-SYNC-007` Git remote 与平台 source 关系不明 | Git adapter、pull、push-review | 当前 remote 只作本地工具观察，不成为平台 truth；禁止自动 push。 |
| `RISK-SYNC-008` 用户 dirty/untracked 检测与非覆盖语义缺少统一跨平台合同 | materialization、冲突 | 当前任何不确定均停止；后续需形成 filesystem/Git 支持矩阵。 |
| `RISK-SYNC-009` LFS、浅克隆、GUI/Tauri 的产品/工具授权不明 | 外围能力和性能 | 当前仅作 historical/pending，不影响核心安全闭环。 |
| `RISK-SYNC-010` provenance 合法迁移、失效和删除边界不明 | metadata、审计、恢复 | 当前禁止静默删除/伪造；合法迁移和保留待 owner/标准闭合。 |

## 2. 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| L0-sdk 是否已提供可查询 project/version/artifact/workspace/review handoff 的正式 client surface？ | §6、§9、§12 | `pending / SYNC-UP-001` |
| Artifact 与 Workspace 的 materialization 来源及优先级如何定义？ | §6、§7、§9、§11 | `blocked / SYNC-UP-002` |
| 归档/解散项目允许 status、pull、handoff 中哪些动作？ | §2、§4、§9、§14 | `blocked / SYNC-UP-003` |
| Review Gate 的 handoff/ACK/probe/decision ref 是否能区分接收与接受？ | §7、§9、§14 | `blocked / SYNC-UP-004` |
| unknown outcome 的幂等键和可探测终态由谁提供？ | §7、§10、§13 | `blocked / SYNC-UP-005` |
| `.qs-sync` 的目录/schema/迁移/完整性/保留合同是什么？ | §2、§9、§11 | `blocked / SYNC-UP-006` |
| Git remote、平台 source、分支和对象存在性边界如何组合？ | §6、§9、§12 | `pending / SYNC-UP-007` |
| source cursor/version comparator/gap/replay 的 exact semantics 是什么？ | §7、§9、§13 | `blocked / SYNC-UP-008` |
| LFS、浅克隆、GUI 是否得到当前产品和工具授权？ | §4、§7、§13 | `pending / SYNC-UP-009` |
| 跨平台 dirty/untracked/path protection 的最小安全保证是什么？ | §7、§9、§14 | `blocked / SYNC-UP-010` |

## 3. 风险与待确认边界

上述事项不会在本需求文档中被“默认支持”“默认关闭”或通过 fake/fixture/日志解决。能收敛的需求边界已经在前文固化；不能收敛的正向能力在后续架构/概要/详细/配置/测试/验收阶段必须保持 `pending/blocked`，并在其自身 owner 文档闭合后回流。

## 4. 历史污染处置

旧固定性能数字、Rust/Tauri、Git LFS、浅克隆、`.qs-sync/metadata.json` 单文件和旧 RPC 名称不作为风险解决方案；它们只作为后续选择核验的历史线索。

## 5. 回填草稿与自检

正式 §15 回填风险清单和待确认表；不写实施计划、技术取舍或“已解决”结论。

- [x] 风险与待确认分表。
- [x] 每项有影响范围/章节和当前处理状态。
- [x] 未补入前文遗漏功能或新目标。
- [x] `SYNC-UP-001~010` 均保持开放。

`Step 15 gate_status = pass_with_blockers`；允许进入 Step 16。
