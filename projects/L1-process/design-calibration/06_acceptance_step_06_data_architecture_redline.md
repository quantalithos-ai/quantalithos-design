# Step 6. 定义数据边界与架构红线验收

> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §11 / §14 | 数据归属和 `AC-PROC-020`~`023` |
| `01` 数据所有权 / 依赖方向 | 架构红线 |
| `03` §10~§14 | no-write、forbidden body、依赖和配置引用 |
| `04` §8 / §11 | raw secret 和 fail-fast |
| `05` §6 / §10 | security、redaction 和 dependency scan 证据 |

## 2. SOP 问题回答

1. 哪些红线是 P0?
   回答:Process truth ownership、外部正文排除、query / projection / reconciliation no-write、唯一编译期依赖、配置不得关闭核心边界。
2. 红线失败是否可风险接受?
   回答:不可。红线失败进入 §11 一票否决或不通过。

## 3. 当前文档问题诊断

旧文档只有“三红线”泛化描述,没有把 Process truth、外部正文、相邻仓依赖、查询 / 维护 no-write 和配置红线拆成可判定门禁。

## 4. 结构化中间产物

| 红线 ID | 红线 | 失败后果 | 证据 |
|---|---|---|---|
| `RL-PROC-DATA-001` | Process truth ownership | `VF-PROC-001` / 不通过 | `EV-SERVICE-001`;`EV-DOMAIN-001` |
| `RL-PROC-DATA-002` | method / work / governance / artifact / runtime / identity / conversation / observability / archive 正文禁止入仓 | `VF-PROC-002` / `VF-PROC-005` | `EV-SCRIPT-001`;`EV-INTEGRATION-002` |
| `RL-PROC-ARCH-001` | Activity / Token / Gateway 不等同 WorkItem / Iteration / runtime step | `VF-PROC-003` | `EV-DOMAIN-001`;`EV-E2E-001` |
| `RL-PROC-ARCH-002` | waiting gate / pause context 不等同 governance truth | `VF-PROC-004` | `EV-INTEGRATION-001`;`EV-WORKER-001` |
| `RL-PROC-ARCH-003` | Query / projection / report / reconciliation / maintenance no-write | `VF-PROC-006` | `EV-SERVICE-002`;`EV-JOB-001` |
| `RL-PROC-ARCH-004` | 恢复不得产生第二份过程真相 | `VF-PROC-007` | `EV-INTEGRATION-001`;`EV-SERVICE-004` |
| `RL-PROC-ARCH-005` | 唯一编译期上游限定为 `L0-core` / core contracts | `VF-PROC-008` | dependency scan;`EV-SCRIPT-002` |
| `RL-PROC-CONFIG-001` | 配置不得关闭 metadata、idempotency、outbox、query no-write、redaction 或 boundary guard | 不通过 | `EV-INTEGRATION-002`;`EV-SCRIPT-001` |

## 5. 回填草稿

§6 使用红线表表达通过条件、失败条件、证据来源和是否一票否决。

## 6. 待确认事项

无阻塞项。
