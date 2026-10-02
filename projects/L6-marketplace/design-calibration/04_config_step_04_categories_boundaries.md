# 04 Step 4：定义配置分类与禁止配置化边界

## 1. Step状态

2026-10-02；completed / selfcheck_done / stop_review。Step3六配置域已停审；本Step先分类再列项，固定热/冷生效边界。

### Step内计划

| 字段 | 收口结论 |
|---|---|
| 本步目标 | 固定startup/build-time/display/sensitive/budget分类和禁止配置化边界 |
| 本步输入 | Step3控制面、01/02红线、03状态/事务/审计/并发边界 |
| 本步输出 | 分类表、禁止项表、逐域适用性和跨分类审计 |
| 应问的问题 | 哪些能配置/热更新；哪些是不变量；改变禁止项应走什么流程 |
| 期望产出 | 分类、禁止项、冷/热边界、停审记录 |
| 回填位置 | 正式04§4 |
| 执行约束 | 不用开关绕过安全、审计、事务、状态或财务边界 |
| 进入下一步条件 | 分类一致、禁止项完整、无03代码契约待回写 |

## 2. 本步输入

[Step3控制面](04_config_step_03_control_plane.md)、01/02配置红线、03§9～14状态/事务/错误/并发/配置/审计边界。

## 3. SOP问题回答

当前类别为启动、运行预算、技术绑定、敏感引用、展示/build-time和诊断/审计语义；首期只有startup/build-time，未批准hot/reload。安全门禁、append-only、事务帧锁、状态迁移、current disclosure、owner引用和外部Unknown不可配置化。任何改变需重开03及上位文档，而不是增加布尔开关。

## 4. 当前文档问题诊断

draft中的retry/outbox/事件、支付、扫描、安装等不能变成配置项；03明确0active event、无Billing/Archive lane。`disable_idempotency`、`force_installed`、`auto_approve`等未知键必须拒绝，不能作为“高级运维开关”。

## 5. 改动前后对比

| 类别 | 之前 | 本Step结论 |
|---|---|---|
| 生效 | 未区分 | server startup；Web build-time；用户locale仅display preference |
| 安全 | ref/value混淆 | sensitive/secret独立，raw secret永不进入普通JSON |
| 禁止项 | 口头红线 | 逐项回指03不变量和变更路径 |

## 6. 配置设计取舍

不提供任何动态业务策略开关；采用严格fail-fast/fail-closed。资源预算可以配置，但不得为了预算截断完整结果、改变scope计数或把Unknown改成成功。未来要引入hot配置，必须新增profile、原子快照、回滚与审计设计并重开04/03。

## 7. 结构化中间产物

| 配置类别 | 说明 | 示例 | 热更新 | 主要风险 |
|---|---|---|---|---|
| startup | listener、PG/SDK/owner引用、Worker预算 | `api.bind` | 否 | 错配导致启动或能力阻断 |
| build-time | Web API base | `VITE_MARKETPLACE_API_BASE` | 否 | 构建连错服务；不进入server RuntimeConfig |
| display | 默认locale | `web.default_locale` | 否；用户本地偏好可变 | 不得改变key/ref/state |
| sensitive reference | PG/SDK/owner configuration_ref | `secret-ref://...` | 否；按受控轮换 | 泄露、不可达、错误profile |
| budget | Worker batch/lease正值 | `worker.batch_limit` | 否 | 超预算/吞吐未知Q-MP-01 |
| diagnostic | 仅有限安全标签 | 由03 telemetry固定 | 否 | 不能配置高基数或raw body |

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| Governance approval、publisher/org认证、source/material eligibility | authority不属于Marketplace | 上游owner合同与00/01受控变更 |
| visibility/scope/current disclosure、query no-write | 防隐藏信息和越权读取 | 03/上位BR与协议重开 |
| state transition、withdrawal、exact version、idempotency/fingerprint | 领域不变量 | 回03 Step6/10/13并重新审查 |
| frame lock/CAS/as-of/fullresult/audit-work原子 | 一致性和恢复边界 | 回03 Step11～13，不能调配置绕过 |
| retry-all、blind retry、force success/installed/paid | 外部Unknown与财务边界 | owner/00/01受控范围变更 |
| owner正文/digest重算、scan/signature/ACK当approval | 第二套资产/审核真相 | 相应owner正式合同 |
| active event/outbox/Billing/Archive writer | 当前没有正式schema/lane | 先00/01，再重开02～04 |

| 配置域 | 适用类别 | 不适用类别 | 分类停审 |
|---|---|---|---|
| api | startup | hot、业务策略、secret raw | 通过 |
| storage | startup、sensitive reference | display、hot、fake fallback | 通过 |
| sdk/owner | startup、sensitive reference | approval策略、retry-all、hot | 通过 |
| worker | startup、budget | state/fence/retry语义、hot | 通过 |
| web | build-time、display | DB/SDK/secret/approval | 通过 |

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 同一行为多域分类冲突 | 无 | API base与server bind分开；locale只web |
| 禁止项遗漏 | 无 | 03§2/§10～14与02 HC-MP-16逐项覆盖 |
| P1污染P0 | 无 | P1不会提供fallback或绕过启动校验 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| server startup / Web build-time分类 | 否 | 生效语义 | 03§13已有边界 | 无回写 |
| 禁止配置化清单 | 否 | 约束复述 | 03§2/§10～14 | 无回写 |

## 9. 回填草稿与待确认事项

正式§4写分类表、禁止项表和六域边界；不写任何部署值。外部profile的预算和secret provider未确定，属于Step14风险，不是允许hot更新的理由。

## 10. 进入下一步条件

类别、热/冷边界和禁止配置化项均明确并通过域内/跨域审计。Step4停审通过，进入Step5。
