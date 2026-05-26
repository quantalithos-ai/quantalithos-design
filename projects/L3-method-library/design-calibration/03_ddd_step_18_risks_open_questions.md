# Step 18. 风险与待确认事项

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18
- 回填章节：`03-详细设计.md` §17 风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 输入边界 | 已挂起 P1、work、ViewProfile、snapshot schema 等待确认项 |
| Step 2 范围 | 已确认 P0 完整展开,P1 只保留边界和后续承接提示 |
| Step 8 协议 | 已确认 P1 endpoint 只做后置索引,governance inbound projection 可选 |
| Step 10 状态机 | 已确认 P1 lifecycle 只保留后置索引,不进入 P0 完整矩阵 |
| Step 12 错误模型 | 已确认 projection stale、失败 audit、snapshot error 仍有内部细化问题 |
| Step 13 并发幂等 | 已确认 outbox lease、IdempotencyStatus::Processing / Failed、seed child key 仍有实现细节 |
| Step 14 配置绑定 | 已确认 governance validation mode、cache 是否进入正式 P0 文档仍需收口 |
| Step 15 可观测性 | 已确认失败 Command audit、FingerprintMismatchReported、指标命名仍待确认 |
| Step 16 测试切口 | 已确认 ResolveViewProfile no match、Retire 重入、FingerprintMismatch audit 会影响测试断言 |
| Step 17 实施承接 | 已确认未进入 P0 实施项需要统一进入风险 / 待确认清单 |

已确认结论：

```text
P0 方法定义发布同步闭环可以继续进入正式文档整理。
当前未关闭事项大多不阻塞 P0 主结构,但必须明确默认处理方式。
不确定项不得被写成正式契约。
P1 / work / marketplace / cache / 完整配置和测试环境不得成为 P0 实施前置。
```

依赖的前序 Step：

```text
Step 1~17 已确认本轮详细设计的实现契约、测试切口和实施承接边界。
```

---

## 3. SOP 问题回答

1. 哪些问题仍可能影响代码实现？

   回答：会影响实现的主要问题包括 Definition / Use 边界污染、P1 Plugin / Configuration 范围膨胀、work 是否直接消费 `TaskDefinition`、governance gate 校验模式、ResolveViewProfile 无匹配语义、Retire 重复请求语义、outbox lease 字段形态、Idempotency failed 重试语义、Query audit、失败 Command audit、snapshot / projection stale 响应、指标命名和配置细节。

2. 哪些问题会阻塞实现，哪些只影响后续优化？

   回答：P0 主结构不被上述问题阻塞。会影响 P0 代码断言的是 ResolveViewProfile 无匹配语义、Retire 重复请求语义、Idempotency failed 处理、outbox lease 等价实现、governance validation mode。P1 Plugin / Configuration、work 直接消费、cache、marketplace、完整配置手册、CI 覆盖率、告警阈值属于后续阶段或后续文档,不阻塞 P0。

3. 每个待确认事项需要谁确认？

   回答：P0 语义类由项目 Owner / TL / 架构负责人确认；work 消费关系由 L1-work 校准确认；governance mode 由 governance 仓架构确认；配置和运维参数由配置设计 / SRE 确认；P1 能力由 Phase 2 / P1 设计确认；测试细节由 `05-测试方案.md` 确认。

4. 未确认前实现者应该如何处理？

   回答：采用最保守默认:不扩大 P0 范围、不写 P1 主链、不让 Query 写 audit、不让失败请求写成业务事实、不绕过 outbox、不绕过 gate、不保存 Use truth。语义未完全确认的点在正式文档中保留明确默认行为或标为待确认,测试断言只覆盖已确认默认。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 1~17 中间产物 | 待确认项分散在各 Step 的第 9 节 | 正式 §17 需要统一收口,否则实施者难以判断是否阻塞 |
| 架构设计 §13 | 已有风险,但偏架构层 | 详细设计还需要落到代码实现影响和未确认前处理方式 |
| Step 17 未进入实施项 | 已列不能进入 P0 实施的事项 | 需要转为正式风险 / 待确认表 |
| 当前 `03-详细设计.md` | 尚未按新版 Step 1~18 回填 | 部分旧风险和待确认项可能与新版口径不一致 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险来源 | 分散在需求、架构、概要和每个 Step | 统一为详细设计风险表 | 便于正式 §17 回填 |
| 待确认项 | 多数只写“待确认” | 明确当前影响、确认方、未确认前处理方式 | 防止实现者脑补 |
| 阻塞判断 | 不够集中 | 区分 P0 阻塞、P0 语义待确认、P1 后置和运维/配置后置 | 防止 P0 停滞或范围膨胀 |
| P1 风险 | 容易在不同章节反复出现 | 统一写成 P1 后置风险和处理规则 | 保持 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有待确认项都作为 P0 阻塞 | 最保守 | 会让 P0 发布同步闭环无法启动 | 不采用 |
| 把所有待确认项都忽略 | 推进最快 | 会让实现者脑补,造成行为分叉 | 不采用 |
| 按阻塞范围分级,并给未确认前默认处理方式 | 能继续推进 P0,同时保留风险 | 需要后续 Step 19 正式回填时保持一致 | 采用 |
| 在本步重新决定所有待确认项 | 看起来收口彻底 | 会越过对应仓 / 配置 / 测试方案的确认边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 风险分级图

```text
[P0 implementation blocker]
  - no current blocker after Step 17

[P0 semantic decision before final code assertions]
  - ResolveViewProfile no match behavior
  - Retire repeated request behavior
  - Idempotency failed retry behavior
  - outbox lease concrete fields
  - governance validation mode

[P1 / downstream / operations follow-up]
  - MethodPlugin / MethodConfiguration
  - work direct TaskDefinition consumption
  - cache / marketplace / drift detect
  - config manual / test fixtures / runbook
```

关键说明：

- `P0 semantic decision` 不阻止正式文档整理,但会影响测试断言和接口细节。
- `P1 / downstream / operations follow-up` 不进入 P0 实施计划。

### 7.2 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| Definition / Use 边界污染 | method-library 可能保存 WorkItem、ProcessInstance、QualificationProfile、QualificationBinding 等 Use truth | 在 domain / DTO / repository / 测试中保留边界红线;禁止 Use truth 入库 | 架构负责人 / 各下游仓负责人 |
| P1 Plugin / Configuration 污染 P0 主链 | P0 实现范围膨胀,拖慢 MethodContent 发布同步闭环 | P1 只保留后置索引和 feature flag;P1 disabled 不影响 P0 | Owner / TL / Phase 2 负责人 |
| work 直接消费 `TaskDefinition` 边界不清 | 可能把 TaskDefinition 提前做成 WorkItem 模板真相 | P0 只确认 process 为必需下游;work 直接消费保持 P1 / 待确认 | L1-work 负责人 |
| governance gate 校验模式分叉 | publish / supersede gate 行为可能因远程 / 投影 / ref-only 模式不同而分叉 | P0 要求必须校验 approved gate;具体 validation mode 放配置设计和 governance 对接 | governance 负责人 / 配置设计负责人 |
| ResolveViewProfile 无匹配语义不一致 | API 返回空视图还是错误会影响 UI 和测试断言 | 正式回填前选择默认行为;未确认前按“受控空结果或错误”标待确认 | UI / console / Owner |
| Retire 重复请求语义不一致 | 已 retired 再 retire 是幂等成功还是冲突会影响状态机和测试 | 正式回填前选择一种;未确认前不写双语义为已收稳契约 | Owner / TL |
| outbox lease 字段实现不一致 | 多 worker relay 可能重复发布或卡死 publishing | 必须保留 claim + lease 或等价 CAS 语义;字段名可实现阶段确定 | 实施 TL / infra 负责人 |
| Idempotency failed 重试语义不一致 | 同 key 同 hash 失败后是否允许重试会影响 API 行为和测试 | 当前默认 failed 为终态,修正后使用新 key | Owner / TL |
| 失败 Command audit 污染业务事实 | validation/gate/lifecycle 失败可能被写成业务成功审计 | P0 不强制失败 audit;必须写 structured log / metric;失败 audit 如启用需 `result=failed` | Owner / audit 负责人 |
| Query audit 写副作用 | Query 可能破坏只读边界 | 第一版 Query 不写 audit / outbox / idempotency;只写日志和指标 | Owner / TL |
| snapshot / event schema 演进不一致 | 下游同步和 replay 可能无法兼容 | schema_version、fingerprint、snapshot_ref 必须稳定;完整版本治理留 L0-bus / schema 设计 | L0-bus / method-library 负责人 |
| projection stale 响应不统一 | Query 是否返回 503 还是 200 + stale marker 会影响客户端 | 按 Query 强一致要求区分;未确认接口必须标 consistency | Owner / query 负责人 |
| observability 指标命名不统一 | 后续 dashboard / alert 难以聚合 | Step 15 名称作为建议;最终遵守全局 observability 命名规范 | observability / SRE |
| 配置细节过早固化 | 环境变量、secret、retry 曲线写死会影响部署 | 详细设计只写绑定点;具体值留 `04-配置设计.md` | 配置设计 / SRE |
| 测试数据和 CI 细节缺失 | 实现后测试不可重复或覆盖不足 | Step 16 只给切口;具体 fixture、CI、覆盖率留 `05-测试方案.md` | QA / 测试方案负责人 |

### 7.3 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| P1 `MethodPlugin / MethodConfiguration` 何时进入完整详细设计 | 不阻塞 P0;影响 Phase 2 | Owner / TL / Phase 2 负责人 | P0 只保留边界、对象位置和 feature flag |
| P1 endpoint 是否创建 route stub | 不阻塞 P0;影响 API 文件布局 | Owner / API 负责人 | 当前建议只保留索引,不创建 P0 必建 route |
| work 是否直接消费 `TaskDefinition` | 不阻塞 P0;影响 L1-work 与 method-library 关系 | L1-work 负责人 | P0 只保证 process 必需消费;work 保持 P1 / 待确认 |
| `ResolveViewProfile` 无匹配时返回空视图还是错误码 | 影响 Query API 和测试断言 | UI / console / Owner | 正式文档先标待确认;实现前必须选择默认行为 |
| `RetireMethodContent` 对已 retired 重复请求返回幂等结果还是冲突 | 影响状态机、错误码、测试断言 | Owner / TL | 未确认前不把双语义写成正式契约 |
| `IdempotencyStatus::Processing` 重复请求返回 409 还是 202 | 影响 API 行为 | Owner / API 负责人 | 当前默认 `IDEMPOTENCY_STATUS_CONFLICT`;异步 202 后续扩展 |
| `IdempotencyStatus::Failed` 是否允许同 key 同 hash 重试 | 影响幂等记录状态机 | Owner / TL | 当前默认 failed 为终态,修正后使用新 key |
| outbox claim 是否显式落 `worker_id / lease_until` | 影响 repository schema 和 worker 恢复 | 实施 TL / infra 负责人 | 保留 lease 语义;实现可用等价字段表达 |
| governance `validation_mode` 是否允许 ref-only / projection 校验 | 影响 publish gate adapter | governance 负责人 / 配置设计负责人 | P0 publish 必须校验 approved gate;模式由配置确定 |
| `PROJECTION_NOT_READY` 返回 503 还是 200 + stale marker | 影响 Query 响应和客户端处理 | Owner / query 负责人 | 按接口强一致要求逐项确认;不得 Query 写库修复 |
| `SNAPSHOT_BUILD_FAILED` 内部是否拆成本地构造和 object storage 写失败 | 影响 error enum 和测试断言 | 实施 TL | 内部可拆,对外可归一映射 |
| `OutboxEvent.mark_retryable_failure(...)` 命名与 persisted value 是否统一 | 影响代码命名和 DB 值 | 实施 TL | 统一 enum variant 和 persisted value,正式回填时校正 |
| `FingerprintMismatchReported` 是否持久为 audit record | 影响 operations audit 和测试 | Owner / audit 负责人 | 至少进入 job result;是否写 audit 待确认 |
| `ReadModelRebuildCompleted` 是否进入 audit | 影响 operations 审计 | Owner / operations 负责人 | 当前作为 operations job result,不混入 MethodContent lifecycle audit |
| 指标命名是否采用全局 L0 observability 规范 | 影响埋点最终名称 | observability / SRE | Step 15 名称为建议名,实现前按全局规范校正 |
| `cache.enabled` 是否完全移出 P0 正式文档 | 影响配置引用表 | Owner / query 负责人 | 保留 P1/optimization 引用,不进入 P0 必实现 |
| 完整环境变量 / secret / TLS / retry 曲线 | 影响部署配置 | 配置设计 / SRE | 留 `04-配置设计.md`,P0 代码只保留 settings 字段和绑定点 |
| 完整测试 fixture / CI / 覆盖率目标 | 影响测试执行 | QA / 测试方案负责人 | 留 `05-测试方案.md`,P0 代码按 Step 16 最小切口补测试 |
| 告警阈值 / dashboard / runbook | 影响运维上线 | SRE / 运维手册负责人 | 留运维手册,详细设计只写埋点切口 |

### 7.4 未确认前默认原则

| 原则 | 默认处理 |
|---|---|
| 不扩大 P0 | 未确认事项不得进入 P0 必实现 |
| 不保存 Use truth | WorkItem、ProcessInstance、QualificationProfile、QualificationBinding 等对象不得入 method-library |
| 不绕过发布治理 | publish / supersede 必须校验 gate、version、fingerprint、snapshot、audit、outbox |
| 不绕过 outbox | Command 不直接发布 L0-bus |
| 不让 Query 写库 | Query 不写 audit、outbox、idempotency 或修复数据 |
| 不把失败写成业务事实 | 失败请求写 log / metric,失败 audit 如启用必须标 `result=failed` |
| 不硬编码运维参数 | timeout、retry、topic、secret、threshold 留配置 / 运维文档 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 17. 风险与待确认事项

### 17.1 风险分级

```text
[P0 implementation blocker]
[P0 semantic decision before final code assertions]
[P1 / downstream / operations follow-up]
```

### 17.2 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|

### 17.3 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|

### 17.4 未确认前默认原则

| 原则 | 默认处理 |
|---|---|
````

---

## 9. 待确认事项

- 本步表格中的待确认项需要在正式 `03-详细设计.md` 回填时保持原样或逐项关闭,不能无记录删除。
- `ResolveViewProfile` 和 `RetireMethodContent` 的行为如果在正式回填前仍未确认,正式文档必须保留待确认标记。
- Step 19 整理正式文档时需要检查旧 `03-详细设计.md` 中是否仍存在与本表冲突的旧口径。

---

## 10. 进入下一步条件

- 所有未关闭事项都有记录。
- 每个待确认事项都有当前影响、确认方和未确认前处理方式。
- 会影响 P0 实现断言的事项已经标出。
- P1 / downstream / operations 后续项没有被写成 P0 实施前置。
- 可以进入 Step 19 整理正式详细设计文档。
