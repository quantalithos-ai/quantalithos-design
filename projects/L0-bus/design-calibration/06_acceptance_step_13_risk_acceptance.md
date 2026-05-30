# L0-bus 06 验收标准 Step 13: 风险接受与遗留项

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 13 中间产物。
> 本步定义哪些风险可以支撑有条件通过、哪些风险必须阻断验收,以及风险接受记录必须包含哪些字段。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义风险接受与遗留项 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §13 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §11 | 已完成 | 继承 S0 / S1 不可风险接受,S2 / S3 可条件接受,P1-risk 不阻断当前 P0 的规则 |
| `05-测试方案.md` §14 | 已完成 | 继承 production adapter、KMS、Gateway、Governance、Observability、SDK、exactly-once 等残余风险 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承有条件通过必须有 owner、期限、复验计划和风险接受记录 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 `risk-acceptance.md`、`open-issues.md` 和 fixed `<run_id>` 证据要求 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承 VETO / S0 不允许风险接受的红线 |
| `06_acceptance_step_12_defects_release.md` | 已确认 | 继承 S2 / S3 / P1-risk 才能作为风险接受对象的缺陷放行规则 |

---

## 3. SOP 问题回答

### 3.1 哪些风险可以支持有条件通过?

只有满足以下条件的风险可以支持“有条件通过”:

| 可接受对象 | 条件 |
|---|---|
| S2 | P0 / P0-min 全部通过,无 S0 / S1,且该 S2 不影响 P0 主闭环、不破坏数据边界、不破坏证据链 |
| S3 | 不影响验收判断、不误导实施者、不影响证据可读性,且已记录后续修正方式 |
| P1-risk | 明确属于当前 P0 非范围,没有被声明为当前已交付能力,且不污染 P0 语义或红线 |
| 外部仓责任风险 | 当前 L0-bus 已保留接缝或输出材料,实际能力归其他仓或后续阶段,且责任仓和接受人明确 |
| 生产化后置风险 | 当前 P0 只验证 fake / in-memory / 默认可验证路径,生产 adapter、KMS、dashboard、SDK 等后置能力已有专项入口 |

这些风险必须进入 `reports/acceptance/risk-acceptance.md`,并在 `reports/acceptance/open-issues.md` 中能被追踪。

### 3.2 哪些风险不能接受?

以下风险不得作为有条件通过依据:

| 不可接受风险 | 原因 |
|---|---|
| S0 | 命中一票否决、安全红线、证据不可用或数据边界破坏 |
| `VETO-BUS-*` | Step 11 已定义为不可风险接受 |
| 未关闭 S1 | P0 主链或 P0-min 支撑边界不可用 |
| P0 evidence 缺失或不可审计 | 验收结论无法复查 |
| forbidden body / raw secret 泄漏 | 破坏安全和数据边界 |
| Query / projection / SDK / observability 反写 truth | 破坏 read-only 边界和 truth 所有权 |
| replay 绕过 audit chain | 破坏恢复可信链 |
| core / bus 双真相 | 破坏 L0-core 共享契约边界 |
| 未分级缺陷 | 无法判断影响范围 |
| 无接受人、无期限、无复验计划的风险 | 无法追责,不满足 SOP 硬约束 |

### 3.3 每个风险的接受人是谁?

风险接受人必须是能够承担后续处置责任的 owner,不能写成“团队”或“待定”。当前 L0-bus 的残余风险接受人按能力边界分配。

| 风险类型 | 默认责任人 | 默认接受人 |
|---|---|---|
| Production MQ / durable store 全量行为 | Bus maintainer + adapter owner | Bus maintainer + adapter owner |
| Secret provider / KMS / Vault 产品集成 | Security owner + ops owner | Security owner + ops owner |
| Gateway / auth / TLS | Gateway / identity owner | Gateway / identity owner |
| 业务 payload 正文语义 | Publisher / subscriber owner | Publisher / subscriber owner |
| Governance decision truth | Governance owner | Governance owner |
| Observability dashboard / alerting | Observability owner | Observability owner |
| SDK developer experience | SDK owner | SDK owner |
| Exactly-once / effectively-once 误解风险 | Bus maintainer + subscriber owner | Bus maintainer + subscriber owner |
| Config center / hot reload / admin override | Platform / ops owner | Platform / ops owner |
| Multi-backend / multi-tenant matrix | Platform / ops owner | Platform / ops owner |
| S2 报告字段或脚本提示问题 | Bus maintainer + release owner | Release owner |

实际验收时,`risk-acceptance.md` 必须写入具体可追责人或角色,并绑定记录时间。只写“相关团队处理”不合格。

### 3.4 后续动作和截止时间是什么?

每项风险都必须有后续动作和截止时间。截止时间可以是具体日期,也可以是明确的后续版本或专项里程碑,但不能留空、不能写“以后处理”。

| 风险类别 | 后续动作 | 截止时间规则 |
|---|---|---|
| S2 未关闭缺陷 | 修复缺陷或补充证据;按 Step 12 最小回归范围复验 | 必须给出具体日期或当前 release 后的第一个修复里程碑 |
| S3 遗留问题 | 文档、提示、脚本可读性修正 | 可绑定下一个文档修订或低风险维护窗口 |
| P1 production adapter 风险 | 建立 P1 adapter smoke / production adapter 专项 | 绑定 P1 专项立项或目标版本 |
| 外部仓能力风险 | 向责任仓同步 issue / implementation plan | 绑定责任仓计划节点 |
| 非范围声明风险 | 修正 handoff、acceptance、README 或后续实现说明 | 必须在本次验收签署前完成 |
| 证据格式 S2 | 修正 report 字段、链接、摘要或脚本输出 | 必须在最终签署前或有条件通过期限内完成 |

### 3.5 风险是否需要同步到实施计划或问题记录?

需要。同步规则如下:

| 风险类型 | 同步位置 | 原因 |
|---|---|---|
| 当前仓仍需修复的 S2 / S3 | `reports/acceptance/open-issues.md` + 当前仓 issue / implementation follow-up | 确保当前仓有后续动作 |
| 影响后续开发阶段的 P1-risk | `reports/acceptance/risk-acceptance.md` + 后续阶段实施计划 | 避免 P1 风险在 P0 通过后丢失 |
| 外部仓归属风险 | `reports/acceptance/risk-acceptance.md` + 责任仓 issue / design follow-up | 明确跨仓责任边界 |
| 文档或范围声明风险 | handoff / acceptance / implementation plan 对应章节 | 防止验收结论被误读 |
| 一票否决或 S1 | 不进入风险接受;进入整改和复验记录 | 不允许通过风险接受放行 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 残余风险在测试方案中已有表格,但未形成验收接受结构 | `05` §14 说明风险和接受人,但没有固定 acceptance 字段 | 有条件通过时材料可能不完整 | 本步定义风险接受最小字段 |
| P1-risk 与当前缺陷容易混用 | production adapter、KMS、dashboard 等是非 P0 能力 | 可能错误阻断当前 P0 或错误宣称已交付 | 本步把 P1-risk 定义为可接受但必须记录的非范围风险 |
| “风险接受”可能被滥用覆盖红线 | S0 / VETO / S1 都可能被写入风险表 | 验收红线失效 | 本步列出不可接受风险 |
| 接受人可能写得过虚 | “平台团队”“后续处理”不可追责 | 有条件通过不可落地 | 本步要求具体 owner / role、deadline、retest |
| 风险可能只写在验收标准里 | 后续实施或问题跟踪看不到 | 风险在签署后丢失 | 本步要求同步到 open issues、risk acceptance 和责任仓 follow-up |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 风险范围 | 测试方案列残余风险 | 验收标准区分可接受、不可接受、需同步风险 | 可裁决 |
| 有条件通过 | 只知道 S2 / P1-risk 可接受 | 明确 risk acceptance 最小字段和证据路径 | 可签署 |
| 接受人 | 残余风险表有角色 | 要求实际验收记录中写具体 owner / role | 可追责 |
| 截止时间 | 未统一规则 | 必须具体日期、版本或专项里程碑 | 可跟踪 |
| 跨仓同步 | 分散在风险说明中 | 按当前仓、外部仓、后续阶段分类同步 | 防丢失 |
| 红线保护 | Step 11 已定义 VETO | 本步再次声明 VETO / S0 / S1 不进入风险接受 | 防误放行 |

---

## 6. 验收设计取舍

### 6.1 是否允许没有接受人的风险支持有条件通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行更快 | 与 SOP 约束冲突,后续无人负责 |
| B. 不允许,必须有责任人和接受人 | 可追责 | 需要补齐记录 | 采用 |
| C. 允许临时接受,签署后补 | 灵活 | 容易遗失 | 不采用 |

### 6.2 是否把所有 P1-risk 都写入风险接受表

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部写入 | 风险透明 | 表格较长 |
| B. 只写影响当前判断的 P1-risk,其余放参考 | 简洁 | 可能漏掉生产化风险 |
| C. 不写 P1-risk | 文档短 | 后续阶段失去入口 |

采用 A。L0-bus 是基础通信仓,生产化后置风险会影响后续仓理解,必须显式列入。

### 6.3 是否把外部仓能力缺口算作 L0-bus 不通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部算 L0-bus 不通过 | 严格 | 违反边界,会让 bus 为 gateway / governance / observability 背锅 |
| B. 如果 L0-bus 接缝完整且未宣称外部能力已交付,作为外部仓风险接受 | 边界清楚 | 需要同步责任仓 |
| C. 完全不记录 | 文档轻 | 后续协作风险不可见 |

采用 B。

---

## 7. 结构化中间产物

### 7.1 风险接受最小字段表

| 字段 | 是否必填 | 作用 |
|---|---|---|
| risk_id | 是 | 稳定引用风险或遗留项 |
| risk_type | 是 | 区分 S2、S3、P1-risk、external-owner-risk |
| description | 是 | 描述风险事实,不得只写结论 |
| impact_scope | 是 | 说明影响 P0、P1、外部仓、文档、证据或生产化 |
| acceptance_reason | 是 | 说明为什么不阻断当前 P0 |
| owner | 是 | 负责后续处理的人或角色 |
| acceptor | 是 | 代表验收接受该风险的人或角色 |
| deadline | 是 | 具体日期、版本或专项里程碑 |
| follow_up_action | 是 | 后续动作 |
| retest_plan | 是 | 复验或复核方式 |
| evidence_ref | 是 | fixed `<run_id>` 下的报告、artifact、open issue 或 acceptance 记录 |
| sync_target | 是 | 需要同步的问题记录、实施计划或责任仓 |

### 7.2 可接受风险表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| S2 非关键报告字段缺失 | 不影响 P0 证据链,但影响报告可读性 | P0 / P0-min 已通过,证据可回链 | 修正报告字段并复跑 report link check | Bus maintainer + release owner | Release owner | 本次验收签署前或有条件通过记录中的明确日期 |
| S3 文档或脚本提示不清 | 影响执行体验,不影响验收事实 | 不破坏功能、红线和证据 | 修正文案或提示,必要时补充文档审查 | Bus maintainer | Bus maintainer | 下一个文档修订或维护窗口 |
| Production MQ / durable store 全量行为 | 真实 adapter 可能暴露后端差异 | 当前 P0 明确使用 fake / in-memory 默认可验证路径 | 建立 P1 adapter smoke 和 production adapter 专项 | Bus maintainer + adapter owner | Bus maintainer + adapter owner | P1 adapter 专项里程碑 |
| Secret provider / KMS / Vault 产品集成 | 真实 provider 可用性和权限风险后置 | 当前 P0 只验 secret ref / fake provider | 建立 P1 security / ops 专项 | Security owner + ops owner | Security owner + ops owner | P1 security / ops 专项里程碑 |
| Gateway / auth / TLS | 入口安全由外部仓覆盖 | bus 不实现身份校验入口,只保留 actor / access audit 接缝 | 同步 gateway / identity 仓安全验收 | Gateway / identity owner | Gateway / identity owner | 对应仓验收里程碑 |
| 业务 payload 正文语义 | 业务内容错误不由 bus 发现 | bus 不拥有正文真相,只处理 ref / digest / metadata | 由 publisher / subscriber 仓自测 payload 语义 | Publisher / subscriber owner | Publisher / subscriber owner | 业务仓交付里程碑 |
| Governance decision truth | 治理策略和审批正确性后置 | bus 只输出 failure material,不生成治理决策 | 同步 governance 仓验证 decision truth | Governance owner | Governance owner | governance 仓验收里程碑 |
| Observability dashboard / alerting | 告警阈值和看板风险后置 | bus 只输出 tap / trace / audit material | 建立 observability dashboard / alerting 专项 | Observability owner | Observability owner | observability 专项里程碑 |
| SDK developer experience | client retry、认证封装和易用性后置 | bus 只稳定 transport view / error contract | 同步 SDK 仓设计和测试 | SDK owner | SDK owner | SDK 仓计划节点 |
| Exactly-once / effectively-once 误解风险 | 使用方可能误解 delivery 语义 | 当前明确为 at-least-once + bus idempotency anchor + subscriber idempotency | 在 handoff、acceptance 和开发文档中声明非目标 | Bus maintainer + subscriber owner | Bus maintainer + subscriber owner | 本次验收签署前完成声明 |
| Config center / hot reload / admin override | 运行期配置变更风险后置 | P2 非范围,当前 reload request 必须 rejected | 后续 platform / ops 专项设计 | Platform / ops owner | Platform / ops owner | P2 配置中心专项里程碑 |
| Multi-backend / multi-tenant matrix | 复杂部署差异未覆盖 | P2 非范围,不影响当前单一默认可验证 path | 后续专项测试矩阵 | Platform / ops owner | Platform / ops owner | P2 多后端 / 多租户专项里程碑 |

### 7.3 不可接受风险表

| 风险 / 缺陷 | 是否可接受 | 处理口径 |
|---|---|---|
| S0 | 否 | 不通过;修复或回退后按 Step 12 复验 |
| `VETO-BUS-*` | 否 | 不通过;更新 veto checklist 和对应证据 |
| 未关闭 S1 | 否 | 不通过;修复后跑最小回归和对应 gate |
| P0 主闭环失败 | 否 | 不通过;不得写成 P1-risk |
| P0 evidence 缺失或不可审计 | 否 | 不通过或不进入签署 |
| forbidden body / raw secret 泄漏 | 否 | 不通过;执行 redaction 修复和复验 |
| Query 写 truth | 否 | 不通过;修复 read-only 边界 |
| replay 缺 audit chain 仍 ready | 否 | 不通过;修复 replay material chain |
| core / bus 双真相 | 否 | 不通过;恢复 L0-core 共享契约边界 |
| 未分级缺陷 | 否 | 先分级,再决定是否可接受 |
| 无 owner / acceptor / deadline / retest 的风险 | 否 | 补齐记录前不得有条件通过 |

### 7.4 风险同步规则表

| 风险类型 | 必须同步到 | 同步要求 |
|---|---|---|
| S2 / S3 当前仓遗留 | `reports/acceptance/open-issues.md` | 写明风险 ID、owner、deadline、retest plan |
| 支撑有条件通过的风险 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和证据链接 |
| 外部仓归属风险 | 责任仓 issue / design follow-up | 写明 L0-bus 已交付边界和责任仓后续动作 |
| 后续阶段 P1 / P2 风险 | 后续阶段 implementation plan 或 roadmap | 不得在当前 P0 中宣称已完成 |
| 非范围声明风险 | `handoff.md`、正式验收结论、实施计划说明 | 签署前必须修正描述 |

### 7.5 风险接受裁决流

```text
发现遗留项或残余风险
  -> 绑定 fixed <run_id> 证据
  -> 判断风险类型
        |
        +-- S0 / VETO / 未关闭 S1
        |     -> 不允许风险接受
        |     -> 不通过或整改复验
        |
        +-- S2 / S3
        |     -> 检查是否影响 P0 主闭环和证据链
        |     -> 补齐 owner / acceptor / deadline / retest
        |     -> 写入 risk-acceptance.md 和 open-issues.md
        |
        +-- P1-risk / external-owner-risk
              -> 检查是否非当前 P0 范围
              -> 确认未误声明为已交付
              -> 同步责任仓或后续阶段计划
```

图后说明:

- 风险接受必须先确认风险类型,再决定是否能支撑有条件通过。
- 没有 owner、acceptor、deadline、retest 和 evidence 的风险不能被接受。
- P1-risk 的核心检查不是“是否已解决”,而是“是否正确声明为非当前 P0 范围并完成后续承接”。

---

## 8. 回填草稿

以下内容用于 Step 15 回填 `06-验收标准.md` §13。

```markdown
## 13. 风险接受与遗留项

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“风险接受最小字段表”“可接受风险表”“不可接受风险表”和“风险同步规则表”小节，了解有条件通过如何保持可追责。

风险接受只能支撑“有条件通过”,不能覆盖 S0、`VETO-BUS-*`、未关闭 S1、P0 主闭环失败、P0 evidence 不可审计、forbidden body / raw secret 泄漏、Query 写 truth、replay 绕过 audit chain 或 core / bus 双真相。

每个被接受的风险必须写入 `reports/acceptance/risk-acceptance.md`,并包含 risk_id、risk_type、description、impact_scope、acceptance_reason、owner、acceptor、deadline、follow_up_action、retest_plan、evidence_ref 和 sync_target。存在未关闭问题时,还必须写入 `reports/acceptance/open-issues.md`。

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| S2 非关键报告字段缺失 | 不影响 P0 证据链,但影响报告可读性 | P0 / P0-min 已通过,证据可回链 | 修正报告字段并复跑 report link check | Bus maintainer + release owner | Release owner | 本次验收签署前或有条件通过记录中的明确日期 |
| Production MQ / durable store 全量行为 | 真实 adapter 可能暴露后端差异 | 当前 P0 明确使用 fake / in-memory 默认可验证路径 | 建立 P1 adapter smoke 和 production adapter 专项 | Bus maintainer + adapter owner | Bus maintainer + adapter owner | P1 adapter 专项里程碑 |
| Secret provider / KMS / Vault 产品集成 | 真实 provider 可用性和权限风险后置 | 当前 P0 只验 secret ref / fake provider | 建立 P1 security / ops 专项 | Security owner + ops owner | Security owner + ops owner | P1 security / ops 专项里程碑 |
| Gateway / auth / TLS | 入口安全由外部仓覆盖 | bus 不实现身份校验入口,只保留 actor / access audit 接缝 | 同步 gateway / identity 仓安全验收 | Gateway / identity owner | Gateway / identity owner | 对应仓验收里程碑 |
| Governance decision truth | 治理策略和审批正确性后置 | bus 只输出 failure material,不生成治理决策 | 同步 governance 仓验证 decision truth | Governance owner | Governance owner | governance 仓验收里程碑 |
| Observability dashboard / alerting | 告警阈值和看板风险后置 | bus 只输出 tap / trace / audit material | 建立 observability dashboard / alerting 专项 | Observability owner | Observability owner | observability 专项里程碑 |
| SDK developer experience | client retry、认证封装和易用性后置 | bus 只稳定 transport view / error contract | 同步 SDK 仓设计和测试 | SDK owner | SDK owner | SDK 仓计划节点 |
| Exactly-once / effectively-once 误解风险 | 使用方可能误解 delivery 语义 | 当前明确为 at-least-once + bus idempotency anchor + subscriber idempotency | 在 handoff、acceptance 和开发文档中声明非目标 | Bus maintainer + subscriber owner | Bus maintainer + subscriber owner | 本次验收签署前完成声明 |
| Config center / hot reload / admin override | 运行期配置变更风险后置 | P2 非范围,当前 reload request 必须 rejected | 后续 platform / ops 专项设计 | Platform / ops owner | Platform / ops owner | P2 配置中心专项里程碑 |
| Multi-backend / multi-tenant matrix | 复杂部署差异未覆盖 | P2 非范围,不影响当前单一默认可验证 path | 后续专项测试矩阵 | Platform / ops owner | Platform / ops owner | P2 多后端 / 多租户专项里程碑 |

没有接受人、截止时间、后续动作、复验计划或证据引用的风险,不得作为有条件通过依据。外部仓归属风险必须同步到责任仓 issue、design follow-up 或后续阶段 implementation plan。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 是否允许没有接受人的风险支撑有条件通过 | A. 允许;B. 不允许;C. 允许签署后补 | 采用 B |
| 是否把所有 P1-risk 写入风险接受表 | A. 全部写入;B. 只写影响当前判断的项;C. 不写 | 采用 A |
| 外部仓能力缺口是否算 L0-bus 不通过 | A. 算;B. 接缝完整且未宣称已交付时作为外部仓风险;C. 不记录 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 已回答 SOP Step 13 的 5 个问题 | 已满足 |
| 已形成风险接受表 | 已满足 |
| 已形成不可接受风险表 | 已满足 |
| 已形成风险接受最小字段表 | 已满足 |
| 已形成风险同步规则 | 已满足 |
| 所有残余风险都有处理口径 | 已满足 |
| 没有接受人的风险不能作为有条件通过依据 | 已满足 |

结论: 可以进入 Step 14,定义最终结论与签署口径。
