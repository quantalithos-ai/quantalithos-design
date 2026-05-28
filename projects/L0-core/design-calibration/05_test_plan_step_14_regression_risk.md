# Step 14. 定义回归策略与残余风险

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
- 回填章节：`projects/L0-core/05-测试方案.md` §14

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 6 用例矩阵 | 用例 ID、场景、断言点 | 定义最小回归集 |
| Step 9 自动化门禁 | PR、main、nightly、release gate suite | 定义回归执行位置 |
| Step 11 缺陷规则 | 缺陷分级和复验规则 | 定义缺陷驱动回归 |
| Step 13 证据归档 | evidence id 和报告结构 | 定义残余风险证据 |

依赖的前序 Step：Step 1~13 已确认。

## 3. SOP 问题回答

1. 哪些变更触发最小回归?

   回答：字段、状态、配置、单个 service、单个 job、单个 adapter 或单类 DTO 变更触发对应最小回归集。最小回归必须覆盖直接用例、相邻主线用例和相关专项断言。

2. 哪些变更触发全量回归?

   回答：发布基线模型、状态机、事务边界、幂等模型、outbox / CloudEvent、配置加载链、审计 / trace 字段、禁止正文 / raw secret 边界、P0 API surface、crate 边界和任何 S/A 级缺陷修复触发全量 P0 回归或 release gate。

3. 哪些风险暂不覆盖?

   回答：真实 L0-bus 投递、真实下游仓库联调、真实 secret provider / KMS、production ops、完整性能容量压测、组织级证据保留周期不在本测试方案 P0 中完全覆盖。

4. 谁接受残余风险?

   回答：测试方案中只写角色 owner：项目测试负责人接受测试覆盖风险；架构评审者接受跨仓边界和标准对齐风险；配置 / 运维负责人接受配置路径、证据保留和 release-like 环境风险；安全负责人接受后续 secret provider 相关风险。

5. 哪些风险必须转入验收标准?

   回答：P0 用例通过、S/A 缺陷为 0、一票否决专项未触发、release gate 证据存在、配置 fail fast 成立、证据归档可追溯、性能阈值待标定风险必须转入 `06-验收标准.md`。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §12 | 回归策略仍围绕旧 shared primitive 变更 | 无法覆盖当前状态机、事务、配置、outbox、job 等变更 |
| `05-测试方案.md` §12 | 最小回归和全量回归触发条件不清楚 | 变更后容易漏测 |
| `05-测试方案.md` §12 | 残余风险没有 owner 和下游承接 | 风险无法被验收或实施计划消费 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 回归触发 | 旧 admission / primitive 变更 | 按 DTO、状态机、事务、配置、outbox、job、审计、边界变更触发 | 对齐新版设计 |
| 最小 / 全量 | 未明确 | 明确变更类型对应最小回归集和全量触发条件 | 支撑实施 |
| 残余风险 | 泛化待确认 | 明确未覆盖原因、影响、缓解方式和接受角色 | 支撑验收 |
| 下游承接 | 未明确 | 明确转入 `06-验收标准.md` 的风险 | 保证文档链路 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每次变更都全量回归 | 风险最低 | 成本过高,反馈慢 | 不采用 |
| B. 只回归失败用例 | 快 | 容易漏掉相邻状态和一致性风险 | 不采用 |
| C. 按变更类型定义最小回归集,高风险变更触发全量 P0 / release gate | 成本可控,风险明确 | 需要维护变更到用例映射 | 采用 |

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| Command / Query DTO 字段变更 | TC-DTO-001、相关 TC-CMD / TC-QUERY、EV-CONTRACT-001 | breaking 字段、required 字段、schema version 变化 | 开发负责人 + 测试负责人 |
| 状态机变更 | TC-CMD-003~006、状态非法迁移专项、EV-UNIT-001 | 发布、退役、supersede、终态保护变更 | 开发负责人 + 架构评审者 |
| 事务边界变更 | TC-OUTBOX-001、TC-TXN-001、EV-INT-001 | truth / audit / outbox 原子边界变化 | 开发负责人 + 测试负责人 |
| 幂等模型变更 | TC-IDEM-001、TC-IDEM-002、TC-CONC-001 | idempotency key、payload fingerprint、receipt replay 变化 | 开发负责人 |
| Outbox / CloudEvent 变更 | TC-EVENT-001、TC-OUTBOX-*、EV-CONTRACT-002 | event type/source/subject/traceparent 变化 | 开发负责人 + 架构评审者 |
| Job / worker 变更 | TC-JOB-*、EV-WORKER-001 | snapshot、rebuild、publish fact、fingerprint 逻辑变化 | 开发负责人 + 测试负责人 |
| 配置加载 / 校验变更 | TC-CONFIG-*、EV-CONFIG-001 | 来源优先级、root 校验、resolver fail closed 变化 | 配置负责人 + 测试负责人 |
| 审计 / trace 字段变更 | TC-AUDIT-001、EV-AUDIT-001、EV-TRACE-001 | actor_ref、trace_id、resource、state/fingerprint 字段变化 | 开发负责人 + 审计负责人 |
| 禁止正文 / raw secret 边界变更 | EV-SEC-001、EV-SEC-002、TC-SCOPE-002 | 数据归属、安全边界、配置敏感级别变化 | 安全负责人 + 架构评审者 |
| S / A 级缺陷修复 | 直接失败用例 + 相邻主线 + 专项 + release gate | S 级缺陷或 release gate 失败 | 测试负责人 |

### 7.2 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| 真实 L0-bus 投递未覆盖 | L0-core P0 只验证 outbox / CloudEvent / relay boundary | 真实投递问题需在 L0-bus 或系统级 E2E 暴露 | 转入 L0-bus / 系统级测试 | 架构评审者 |
| 真实下游仓库联调未覆盖 | L0-core 不拥有下游业务实现 | 下游消费适配问题不会在本仓暴露 | 下游仓 contract consume test | 架构评审者 |
| 真实 secret provider / KMS 未覆盖 | P0 不实现 secret provider | secret ref 轮换和权限问题后移 | 安全设计 / 运维手册承接 | 安全负责人 |
| 完整性能容量压测未覆盖 | 当前无实现基线和生产负载模型 | 只能证明不阻塞主链和生成 baseline | 实施后补 benchmark 阈值 | 测试负责人 |
| CI artifact 物理存储未固定 | 测试方案只定义逻辑归档结构 | 实施时可能路径漂移 | `07-实施计划.md` 固定 CI artifact 实现 | 测试负责人 |
| `06-验收标准.md` 仍是旧口径 | 下游文档尚未校准 | 验收无法直接消费新版测试证据 | 下一轮重写验收标准 | 项目负责人 |

### 7.3 转入验收标准清单

| 项 | 验收承接方式 |
|---|---|
| P0 用例全部通过 | 验收标准引用 TC 与 EV 矩阵 |
| S/A 缺陷为 0 | 验收退出门禁 |
| 一票否决专项未触发 | 验收失败条件 |
| release gate 证据存在 | 发布候选验收 |
| 配置 fail fast 与 fail closed 成立 | 配置验收门禁 |
| 证据归档可追溯 | 审计 / 可追溯验收 |
| 性能阈值待标定 | 验收风险或条件通过项 |

## 8. 回填草稿

```md
## 14. 回归策略与残余风险

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risk.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“回归触发表”“残余风险表”和“转入验收标准清单”小节,了解变更如何触发回归以及哪些风险需要下游承接。

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| Command / Query DTO 字段变更 | TC-DTO-001、相关 TC-CMD / TC-QUERY、EV-CONTRACT-001 | breaking 字段、required 字段、schema version 变化 | 开发负责人 + 测试负责人 |
| 事务边界变更 | TC-OUTBOX-001、TC-TXN-001、EV-INT-001 | truth / audit / outbox 原子边界变化 | 开发负责人 + 测试负责人 |
| 配置加载 / 校验变更 | TC-CONFIG-*、EV-CONFIG-001 | 来源优先级、root 校验、resolver fail closed 变化 | 配置负责人 + 测试负责人 |
| S / A 级缺陷修复 | 直接失败用例 + 相邻主线 + 专项 + release gate | S 级缺陷或 release gate 失败 | 测试负责人 |

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| 真实 L0-bus 投递未覆盖 | L0-core P0 只验证 outbox / CloudEvent / relay boundary | 真实投递问题需在 L0-bus 或系统级 E2E 暴露 | 转入 L0-bus / 系统级测试 | 架构评审者 |
| 完整性能容量压测未覆盖 | 当前无实现基线和生产负载模型 | 只能证明不阻塞主链和生成 baseline | 实施后补 benchmark 阈值 | 测试负责人 |
| `06-验收标准.md` 仍是旧口径 | 下游文档尚未校准 | 验收无法直接消费新版测试证据 | 下一轮重写验收标准 | 项目负责人 |
```

## 9. 待确认事项

- 是否接受真实 L0-bus、真实下游仓库和真实 secret provider 不进入 L0-core P0 回归范围。
- 是否接受 `06-验收标准.md` 当前旧口径作为必须后续重写的残余风险。

## 10. 进入下一步条件

- [x] 回归策略和残余风险可被实施计划 / 验收标准引用。
- [x] 未覆盖风险均有原因、影响、缓解方式和接受角色。
- [x] 必须转入验收标准的项目已列出。
- [x] 可以进入 Step 15 整理正式测试方案文档。
