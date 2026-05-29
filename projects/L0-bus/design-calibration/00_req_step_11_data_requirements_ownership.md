# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-05-29

---

## 1. 本步目标

说明 `L0-bus` 在需求层拥有哪些数据真相、哪些只是快照或引用、哪些正文绝不能保存，防止 bus 吸收 core、业务、observability 或 governance 的数据归属。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 确认 bus 不拥有 core 契约和业务 payload 真相 |
| Step 9 功能需求 | 提取 publish、delivery、failure、tap、outbox、backend 相关数据需求 |
| Step 10 规则约束 | 提取禁止保存和只读输出边界 |

---

## 3. 应问的问题与回答

### 3.1 哪些数据由本仓拥有真相？

`L0-bus` 拥有的是总线传递事实真相：

- 发布材料进入 bus 的传递事实。
- delivery attempt 与 ack / fail 结果。
- retry、dead-letter、replay preparation 的恢复事实。
- bus audit 与 delivery history。
- 后端适配后的平台语义映射结果。

### 3.2 哪些数据只是快照？

以下数据只作为快照或只读视图：

- consumer lag / backend health / retry backlog / DLQ backlog。
- SDK consume transport view。
- bus trace material / metrics snapshot。
- failure summary / escalated failure material。

这些快照不能反写 bus truth。

### 3.3 哪些数据只是引用？

以下数据只保存引用：

- `L0-core` contract / event / error / metadata / trace / actor reference。
- 发布方业务 payload reference。
- outbox fact reference。
- governance decision reference。
- observability trace / audit external reference。
- archive package reference。

### 3.4 哪些内容绝不能保存正文？

`L0-bus` 不得保存以下正文真相：

- 业务 payload 正文真相。
- 业务状态、业务规则、业务补偿内容。
- 原始凭据、token、secret、private key。
- observability 长期日志正文和报表正文。
- governance 审批决策正文。
- SDK 高层配置和调用者私有上下文正文。

---

## 4. 结构化中间产物

### 4.1 数据归属结论

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 相关功能 |
|---|---|---|---|---|
| Publication acceptance fact | 真相数据 | bus 拥有发布材料进入传递链的事实 | 随传递链保留，进入审计 / 追溯 | F-001 / F-002 |
| Delivery record | 真相数据 | bus 拥有 delivery attempt、目标订阅范围和结果事实 | 按保留策略保存，支持审计和恢复 | F-003 / F-004 |
| Ack / fail result | 真相数据 | bus 拥有订阅方反馈的总线级结果 | append-only 或可追溯演进 | F-004 |
| Idempotency anchor record | 真相数据 | bus 拥有用于识别重复 delivery 的传递幂等锚点 | 随保留策略过期，不等同业务幂等 | F-004 |
| Retry / dead-letter / replay material | 真相数据 | bus 拥有失败恢复链所需材料 | 按恢复和审计策略保留 | F-005 |
| Bus audit trail | 真相数据 | bus 拥有总线级传递和恢复留痕 | append-only 或保留完整演进链 | F-004 / F-006 |
| Transport view | 快照数据 | 面向 SDK 或消费方的只读视图 | 可重建，不得反写真相 | F-006 |
| Tap / trace / metrics material | 快照数据 | 面向 observability 的只读材料 | 可重建或按观测策略刷新 | F-006 |
| Failure summary material | 快照数据 | 面向 governance / operator 的只读失败材料 | 可重建，不代表治理决策 | F-006 |
| Core contract reference | 引用数据 | 指向 `L0-core` 契约和 metadata | 随对应传递事实保留 | F-001 / F-002 |
| Payload reference | 引用数据 | 指向发布方业务 payload，不拥有正文真相 | 随传递事实保留引用 | F-001 |
| Outbox fact reference | 引用数据 | 指向已提交 outbox fact | 随 relay 事实保留引用 | F-007 |
| Backend capability reference | 引用数据 | 指向后端能力或环境 profile | 随 adapter / delivery 语义保留 | F-008 |
| Business payload body | 禁止保存正文 | 业务正文归发布方或业务仓 | bus 不作为正文真相保存 | F-001 / F-006 |
| Raw secret / credential | 禁止保存正文 | 凭据归安全入口或 secret provider | bus 不得保存 | F-006 / F-008 |
| Governance decision body | 禁止保存正文 | 决策归 `L1-governance` | bus 只输出 failure material | F-006 |
| Observability long-term log body | 禁止保存正文 | 归 `L4-observability` | bus 只输出 tap / audit material | F-006 |

### 4.2 分类结论

| 分类 | 数据项 |
|---|---|
| 真相数据 | publication acceptance fact、delivery record、ack / fail result、idempotency anchor、retry / dead-letter / replay material、bus audit trail |
| 快照数据 | transport view、tap / trace / metrics material、failure summary material |
| 引用数据 | core contract reference、payload reference、outbox fact reference、backend capability reference |
| 禁止保存正文 | business payload body、raw secret / credential、governance decision body、observability long-term log body |

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 数据主语 | 旧 02 / 03 已有 envelope、routing、delivery、audit 等对象倾向 | 需求层改为传递事实、结果事实、恢复事实、只读输出和引用边界 |
| Payload | 容易把 payload 包装后看成 bus 数据 | bus 只保存引用和传递事实，不拥有业务正文真相 |
| Observability | bus trace / metrics 容易扩展成观测仓数据 | 只作为快照 / 只读材料 |
| Governance | failure material 容易被看成决策输入与决策本体混合 | bus 只保存失败材料，不保存 governance decision 正文 |

---

## 6. 回填草稿

```md
## 11. 数据需求与数据归属

> 校准来源：
> - `design-calibration/00_req_step_11_data_requirements_ownership.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“数据归属结论”“分类结论”和“回填草稿”小节，了解 bus truth、只读快照、外部引用和禁止正文如何区分。

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 相关功能 |
|---|---|---|---|---|
| Publication acceptance fact | 真相数据 | bus 拥有发布材料进入传递链的事实 | 随传递链保留，进入审计 / 追溯 | F-001 / F-002 |
| Delivery record | 真相数据 | bus 拥有 delivery attempt、目标订阅范围和结果事实 | 按保留策略保存，支持审计和恢复 | F-003 / F-004 |
| Ack / fail result | 真相数据 | bus 拥有订阅方反馈的总线级结果 | append-only 或可追溯演进 | F-004 |
| Idempotency anchor record | 真相数据 | bus 拥有用于识别重复 delivery 的传递幂等锚点 | 随保留策略过期，不等同业务幂等 | F-004 |
| Retry / dead-letter / replay material | 真相数据 | bus 拥有失败恢复链所需材料 | 按恢复和审计策略保留 | F-005 |
| Bus audit trail | 真相数据 | bus 拥有总线级传递和恢复留痕 | append-only 或保留完整演进链 | F-004 / F-006 |
| Transport view | 快照数据 | 面向 SDK 或消费方的只读视图 | 可重建，不得反写真相 | F-006 |
| Tap / trace / metrics material | 快照数据 | 面向 observability 的只读材料 | 可重建或按观测策略刷新 | F-006 |
| Failure summary material | 快照数据 | 面向 governance / operator 的只读失败材料 | 可重建，不代表治理决策 | F-006 |
| Core contract reference | 引用数据 | 指向 `L0-core` 契约和 metadata | 随对应传递事实保留 | F-001 / F-002 |
| Payload reference | 引用数据 | 指向发布方业务 payload，不拥有正文真相 | 随传递事实保留引用 | F-001 |
| Outbox fact reference | 引用数据 | 指向已提交 outbox fact | 随 relay 事实保留引用 | F-007 |
| Backend capability reference | 引用数据 | 指向后端能力或环境 profile | 随 adapter / delivery 语义保留 | F-008 |
| Business payload body | 禁止保存正文 | 业务正文归发布方或业务仓 | bus 不作为正文真相保存 | F-001 / F-006 |
| Raw secret / credential | 禁止保存正文 | 凭据归安全入口或 secret provider | bus 不得保存 | F-006 / F-008 |
| Governance decision body | 禁止保存正文 | 决策归 `L1-governance` | bus 只输出 failure material | F-006 |
| Observability long-term log body | 禁止保存正文 | 归 `L4-observability` | bus 只输出 tap / audit material | F-006 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | bus 是否可保存 payload body | 保存完整正文 | 只保存引用和必要传递材料 | 推荐 B。原因是业务正文真相不归 bus |
| Q-002 | bus audit 是否等同 observability audit | 等同 | bus audit 是总线级传递事实，observability 是跨系统观测视图 | 推荐 B。原因是二者归属和生命周期不同 |

当前建议：接受上述推荐后进入 Step 12。

---

## 8. 进入下一步条件

- 已明确真相数据、快照数据、引用数据和禁止保存正文。
- 已说明业务 payload、secret、governance decision、observability long-term log 不归 bus。
- 没有滑入字段表、数据库表、索引或持久化实现设计。
