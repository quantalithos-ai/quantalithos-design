# Step 16. 需求追溯矩阵

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 16
> 回填章节: `00-需求文档.md` §16 需求追溯矩阵
> 生成日期: 2026-05-29

---

## 1. 本步目标

以 Step 9 已确认的功能需求 F-001 ~ F-008 为主轴，把核心能力闭环、用户故事、业务规则、数据归属和验收标准显式连接起来。本步只做映射和漏项检查，不新增需求、不补写规则、不调整前文编号。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 7 核心能力闭环 | 提供 CL-001 ~ CL-006 映射对象 |
| Step 8 用户故事 | 提供 US-001 ~ US-007 映射对象 |
| Step 9 功能需求 | 提供 F-001 ~ F-008 主轴 |
| Step 10 业务规则与边界约束 | 提供 BR-001 ~ BR-012 映射对象 |
| Step 11 数据需求与数据归属 | 提供 truth / snapshot / reference / forbidden body 映射对象 |
| Step 14 验收标准 | 提供功能、规则、数据和非功能验收映射对象 |

---

## 3. 应问的问题与回答

### 3.1 每个核心能力闭环节点对应哪些用户故事？

| 核心能力闭环 | 对应用户故事 |
|---|---|
| CL-001 契约化输入承接 | US-001 |
| CL-002 传递语义标准化 | US-001 / US-007 |
| CL-003 订阅推进 | US-002 |
| CL-004 结果留痕 | US-002 / US-003 / US-007 |
| CL-005 失败恢复 | US-003 / US-005 |
| CL-006 只读输出 | US-004 / US-005 / US-006 |

### 3.2 每个用户故事对应哪些功能需求？

| 用户故事 | 对应功能需求 |
|---|---|
| US-001 | F-001 / F-002 / F-007 |
| US-002 | F-003 / F-004 / F-008 |
| US-003 | F-004 / F-005 |
| US-004 | F-006 |
| US-005 | F-005 / F-006 |
| US-006 | F-006 |
| US-007 | F-002 / F-004 / F-008 |

### 3.3 每个功能需求对应哪些业务规则？

每个功能需求至少受到一条业务规则保护；其中 F-001 / F-002 重点受 core 契约和 payload 边界保护，F-003 / F-004 重点受 delivery semantic、幂等和留痕保护，F-005 / F-006 重点受 replay、授权、只读输出和治理边界保护，F-007 / F-008 重点受 outbox boundary 和 backend adapter semantic 保护。

### 3.4 每个功能需求对应哪些数据归属要求？

每个功能需求均映射到 Step 11 的数据分类：F-001 / F-007 使用 contract、payload、outbox reference；F-003 / F-004 产生 delivery、ack / fail、idempotency anchor 和 audit truth；F-005 产生 retry / dead-letter / replay material；F-006 产生 transport view、tap / trace / metrics material、failure summary 等只读输出；F-008 使用 backend capability reference。

### 3.5 每个功能需求对应哪些验收标准？

每个功能需求在 Step 14 中都有同名或同范围的功能能力验收项，并被核心能力、规则边界、数据归属或非功能验收交叉覆盖。

### 3.6 是否存在没有来源的功能、没有承接的规则、没有验收的能力？

当前检查结论为：没有。所有 F-001 ~ F-008 都有用户故事来源、闭环映射、规则保护、数据归属和验收标准；本步未新增前文未定义的新项。

---

## 4. 结构化中间产物

### 4.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| F-001 契约绑定的发布材料接入 | CL-001 | US-001 | BR-001 / BR-002 | Publication acceptance fact；Core contract reference；Payload reference；Business payload body 禁止保存 | F-001 功能能力验收；`L0-core` 契约边界验收；payload 边界验收；禁止正文边界验收 |
| F-002 统一传递语义形成 | CL-002 | US-001 / US-007 | BR-001 / BR-003 / BR-012 | Publication acceptance fact；Core contract reference；Backend capability reference | F-002 功能能力验收；`L0-core` 契约边界验收；后端适配边界与默认可验证路径验收 |
| F-003 订阅与 delivery 推进 | CL-003 | US-002 | BR-003 / BR-006 / BR-012 | Delivery record；Backend capability reference | F-003 功能能力验收；F-008 后端适配边界与默认可验证路径验收；transport semantic 一致性验收 |
| F-004 delivery 结果与幂等锚点记录 | CL-004 | US-002 / US-003 / US-007 | BR-004 / BR-006 / BR-011 | Delivery record；Ack / fail result；Idempotency anchor record；Bus audit trail | F-004 功能能力验收；bus truth 数据归属验收；审计与可追溯验收；幂等 / 一致性验收 |
| F-005 失败恢复与死信 / replay 准备 | CL-005 | US-003 / US-005 | BR-004 / BR-005 / BR-008 / BR-011 | Retry / dead-letter / replay material；Bus audit trail；Failure summary material | F-005 功能能力验收；replay 边界验收；安全与授权验收；审计与可追溯验收 |
| F-006 总线级审计、tap 和只读消费输出 | CL-006 | US-004 / US-005 / US-006 | BR-002 / BR-007 / BR-008 / BR-009 / BR-011 | Bus audit trail；Transport view；Tap / trace / metrics material；Failure summary material；Forbidden body 不得进入输出 | F-006 功能能力验收；只读输出边界验收；governance 边界验收；可观测性验收 |
| F-007 Outbox relay 边界承接 | CL-001 / CL-002 | US-001 | BR-001 / BR-010 | Outbox fact reference；Publication acceptance fact；Core contract reference | F-007 功能能力验收；P0-min 支撑边界验收；Outbox relay 边界承接验收 |
| F-008 后端适配边界与默认可验证路径 | CL-002 / CL-003 | US-002 / US-007 | BR-003 / BR-012 | Backend capability reference；Delivery record | F-008 功能能力验收；P0-min 支撑边界验收；backend adapter 差异不得泄漏验收 |

### 4.2 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否 |
| 是否存在没有闭环映射的功能需求 | 否 |
| 是否存在没有规则保护的核心功能 | 否 |
| 是否存在没有验收标准的功能需求 | 否 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否 |

### 4.3 规则覆盖检查

| 规则 | 覆盖功能 | 检查结论 |
|---|---|---|
| BR-001 | F-001 / F-002 / F-007 | 已覆盖 core 契约边界 |
| BR-002 | F-001 / F-006 | 已覆盖 payload 正文禁止边界 |
| BR-003 | F-002 / F-003 / F-008 | 已覆盖 transport semantic 与后端独立性 |
| BR-004 | F-004 / F-005 | 已覆盖 delivery 结果与失败恢复留痕 |
| BR-005 | F-005 | 已覆盖 replay 前置条件 |
| BR-006 | F-003 / F-004 | 已覆盖 bus 幂等边界 |
| BR-007 | F-006 | 已覆盖只读输出边界 |
| BR-008 | F-005 / F-006 | 已覆盖 tap / DLQ / replay / failure material 授权边界 |
| BR-009 | F-006 | 已覆盖 governance 决策边界 |
| BR-010 | F-007 | 已覆盖 outbox 已提交事实边界 |
| BR-011 | F-004 / F-005 / F-006 | 已覆盖 audit / delivery history 可追溯 |
| BR-012 | F-002 / F-003 / F-008 | 已覆盖 backend adapter 能力变化边界 |

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 追溯主轴 | 旧文档缺少需求级追溯矩阵，容易按后端或对象查找 | 以 F-001 ~ F-008 为主轴统一追溯闭环、故事、规则、数据和验收 |
| 漏项检查 | 旧文档很难判断候选能力是否有故事和验收 | 用漏项检查表显式确认没有孤儿功能和孤儿验收 |
| 规则覆盖 | 旧口径中规则散落在红线和测试描述中 | 用规则覆盖检查确认 BR-001 ~ BR-012 均有功能落点 |
| 新增需求风险 | 追溯阶段容易顺手补新功能 | 本步明确不新增前文未定义对象，只做映射 |

---

## 6. 回填草稿

```md
## 16. 需求追溯矩阵

> 校准来源：
> - `design-calibration/00_req_step_16_traceability_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“主追溯矩阵”“漏项检查表”和“规则覆盖检查”小节，了解本仓如何确认功能、闭环、故事、规则、数据和验收之间没有孤儿项。

### 16.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| F-001 契约绑定的发布材料接入 | CL-001 | US-001 | BR-001 / BR-002 | Publication acceptance fact；Core contract reference；Payload reference；Business payload body 禁止保存 | F-001 功能能力验收；`L0-core` 契约边界验收；payload 边界验收；禁止正文边界验收 |
| F-002 统一传递语义形成 | CL-002 | US-001 / US-007 | BR-001 / BR-003 / BR-012 | Publication acceptance fact；Core contract reference；Backend capability reference | F-002 功能能力验收；`L0-core` 契约边界验收；后端适配边界与默认可验证路径验收 |
| F-003 订阅与 delivery 推进 | CL-003 | US-002 | BR-003 / BR-006 / BR-012 | Delivery record；Backend capability reference | F-003 功能能力验收；F-008 后端适配边界与默认可验证路径验收；transport semantic 一致性验收 |
| F-004 delivery 结果与幂等锚点记录 | CL-004 | US-002 / US-003 / US-007 | BR-004 / BR-006 / BR-011 | Delivery record；Ack / fail result；Idempotency anchor record；Bus audit trail | F-004 功能能力验收；bus truth 数据归属验收；审计与可追溯验收；幂等 / 一致性验收 |
| F-005 失败恢复与死信 / replay 准备 | CL-005 | US-003 / US-005 | BR-004 / BR-005 / BR-008 / BR-011 | Retry / dead-letter / replay material；Bus audit trail；Failure summary material | F-005 功能能力验收；replay 边界验收；安全与授权验收；审计与可追溯验收 |
| F-006 总线级审计、tap 和只读消费输出 | CL-006 | US-004 / US-005 / US-006 | BR-002 / BR-007 / BR-008 / BR-009 / BR-011 | Bus audit trail；Transport view；Tap / trace / metrics material；Failure summary material；Forbidden body 不得进入输出 | F-006 功能能力验收；只读输出边界验收；governance 边界验收；可观测性验收 |
| F-007 Outbox relay 边界承接 | CL-001 / CL-002 | US-001 | BR-001 / BR-010 | Outbox fact reference；Publication acceptance fact；Core contract reference | F-007 功能能力验收；P0-min 支撑边界验收；Outbox relay 边界承接验收 |
| F-008 后端适配边界与默认可验证路径 | CL-002 / CL-003 | US-002 / US-007 | BR-003 / BR-012 | Backend capability reference；Delivery record | F-008 功能能力验收；P0-min 支撑边界验收；backend adapter 差异不得泄漏验收 |

### 16.2 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否 |
| 是否存在没有闭环映射的功能需求 | 否 |
| 是否存在没有规则保护的核心功能 | 否 |
| 是否存在没有验收标准的功能需求 | 否 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否 |
```

---

## 7. 进入下一步条件

- 已形成以 F-001 ~ F-008 为主轴的主追溯矩阵。
- 已完成漏项检查表。
- 已检查 BR-001 ~ BR-012 均有功能落点。
- 矩阵中没有新增前文未确认的新需求、新规则、新验收或新数据项。
