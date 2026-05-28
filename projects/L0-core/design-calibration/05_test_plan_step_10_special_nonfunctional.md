# Step 10. 设计专项测试与非功能验证

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-core/05-测试方案.md` §10

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §13~§15 | 性能、安全、审计 / 可追溯、幂等 / 一致性、可观测性、一票否决项 | 定义专项测试类别和红线 |
| `01-架构设计.md` §13~§15 | 横切关注点、风险和 ADR 待补 | 明确专项风险来源 |
| `03-详细设计.md` §10~§15 | 持久化一致性、错误恢复、幂等、配置、观测、测试切口 | 定义故障注入、审计和观测断言 |
| Step 6~9 | 用例矩阵、测试数据、环境和门禁 | 关联专项测试到用例、环境和证据 |

依赖的前序 Step：Step 1~9 已确认。

## 3. SOP 问题回答

1. 哪些性能指标必须验证?

   回答：必须验证同步入口不承担耗时派生 / 下游确认、查询和追溯不阻塞常规协作、job / outbox / projection 的后台处理能在 release-like 或 nightly 中形成基线。当前不凭空写死毫秒阈值,正式数值由实施计划或首次 benchmark 基线补齐。

2. 哪些安全和边界红线必须负向测试?

   回答：必须负向测试业务正文、事件实例 payload、观测日志 / trace 正文、归档正文、运行时记录、credential / token / raw secret 不进入 L0-core；认证授权、事件投递、SDK 高层封装和 L1 业务语义不得被配置或接口绕入本仓。

3. 哪些一致性和恢复场景必须故障注入?

   回答：必须覆盖 truth + outbox 原子提交、audit append 失败、idempotency replay / conflict、expected version 并发冲突、projection stale / rebuild、outbox publish fail、snapshot rerun、reference resolver fail closed。

4. 哪些日志、指标和审计证据必须存在?

   回答：写路径、关键读路径、job、outbox relay 必须带 trace_id；审计事件必须包含 actor_ref、trace_id、resource id、状态变化或 fingerprint；日志、指标、审计不得保存 raw secret 或外部正文全文。

5. 阈值来自哪里?

   回答：质量类别来自 `00-需求文档.md` §13；可观测和审计字段来自 `03-详细设计.md` §14；配置安全红线来自 `04-配置设计.md` §8~§11；具体性能数值在实施计划或首次 benchmark 产物中确定,在确定前只能作为 release 风险,不得伪造数值。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §7 | 专项测试仍围绕旧 shared primitive registry 和 replay | 不覆盖当前契约真相、snapshot、outbox、job、配置和审计红线 |
| `05-测试方案.md` §7 | 安全边界只泛化描述 | 无法验证禁止正文和 raw secret 不入仓 |
| `05-测试方案.md` §7 | 一致性 / 恢复缺少故障注入矩阵 | 无法证明失败不会伪成功 |
| `05-测试方案.md` §7 | 非功能阈值来源不清楚 | 容易写出无依据数字或无法验收 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 专项类别 | 旧 registry / replay / smoke | 性能、安全红线、一致性恢复、观测审计、配置敏感边界 | 对齐新版非功能需求 |
| 性能阈值 | 未定义或泛化 | 先验证不阻塞主链和形成 benchmark 基线,数值由实施期补齐 | 避免无来源阈值 |
| 安全测试 | 概念性边界 | 具体禁止正文、raw secret、认证授权越界负向用例 | 支撑一票否决 |
| 恢复测试 | replay 粗略描述 | 故障注入覆盖 outbox、audit、idempotency、projection、snapshot、resolver | 覆盖 P0 恢复风险 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在测试方案中直接写固定毫秒阈值 | 看起来明确 | 当前没有实现基线,数字无来源 | 不采用 |
| B. 只写“性能良好、安全可靠” | 简单 | 不可验证 | 不采用 |
| C. 先定义专项风险、验证方法、通过条件和证据,数值阈值由实施 benchmark 补齐 | 可追溯,避免伪精确 | 首版会保留阈值待补风险 | 采用 |
| D. 把所有专项都放到 nightly | 不影响 PR | P0 红线发现太晚 | 不采用 |

## 7. 结构化中间产物

### 7.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 性能 | 同步入口不得压入耗时派生和下游确认 | 检查 command flow + integration timing + job boundary | main CI / release-like | 发布命令只完成入口判断和提交;派生 / 校验通过 job 承接 | EV-NFR-001 |
| 性能 | 查询 / 追溯不阻塞常规协作 | fixture dataset benchmark | nightly / release-like | 首次实现生成 baseline;release gate 不得低于已确认 baseline | EV-NFR-002 |
| 安全边界 | 业务正文、事件 payload、观测 trace 正文、归档正文、运行记录不入仓 | negative fixture + persistence / audit scan | PR / main | 禁止正文不得进入 truth、snapshot、audit、outbox 和 report | EV-SEC-001 |
| 密钥边界 | raw secret / token / credential 不入配置、日志、审计和报告 | config negative + log / audit scan | PR / main / release-like | 只允许 redacted ref;发现 raw secret 一票否决 | EV-SEC-002 |
| 职责边界 | 认证授权、事件投递、SDK 高层封装、L1 业务语义不进入本仓 | scope policy negative + API surface scan | PR / main | 无正式接口、配置或对象承载这些职责 | EV-SCOPE-001 |
| 一致性 | truth + outbox 原子提交 | failing outbox / repository injection | main CI | 成功必须两者同时存在;失败不得半提交 | EV-INT-001 |
| 一致性 | audit append 不得静默失败 | failing audit injection | main CI | command / job 失败或事务回滚,不得伪成功 | EV-AUDIT-001 |
| 幂等 | 重复 key replay 与 payload conflict | idempotency fixture | PR / main | 同 key 同 payload replay receipt;不同 payload conflict | EV-SVC-001 |
| 并发 | expected version 冲突 | two-writer fixture | main CI / nightly | 只有一个写入成功,后写 conflict | EV-CONC-001 |
| 恢复 | projection stale / rebuild | stale projection seed + rebuild job | main CI / nightly | stale 显式暴露,rebuild 后 watermark 前进 | EV-WORKER-001 |
| 恢复 | outbox publish fail / rerun | failing publisher + relay rerun | main CI / release-like | event_id 稳定,pending / failed 可恢复 | EV-CONTRACT-002 |
| 恢复 | snapshot rerun 幂等 | rerun derive job | main CI / release-like | fingerprint 和 snapshot id 稳定,无重复快照 | EV-WORKER-001 |
| 配置安全 | resolver fail closed | invalid resolver fixture | PR / main | 引用失败不得默认放行 | EV-CONFIG-001 |
| 可观测性 | trace_id 贯穿 command/query/job/relay | log / audit / event scan | main CI / release-like | 关键路径均可关联 trace_id | EV-TRACE-001 |
| 审计 | 高影响变化可追溯 | audit fixture + trace query | main CI / release-like | actor_ref、trace_id、resource、state/fingerprint 完整 | EV-AUDIT-001 |

### 7.2 一票否决专项清单

| 红线 | 触发条件 | 阻断范围 |
|---|---|---|
| 禁止正文入仓 | 业务正文、事件 payload、观测 trace 正文、归档正文或运行记录进入 truth / audit / outbox / report | PR / main / release gate |
| raw secret 泄露 | raw token、password、credential value 出现在配置、日志、审计、测试报告 | PR / main / release gate |
| 失败伪成功 | audit / outbox / repository / job 失败却返回成功 | main / release gate |
| 发布基线不可追溯 | baseline 缺少 gate、fingerprint、actor_ref 或 trace_id | main / release gate |
| 引用失败默认放行 | resolver missing / invalid 被当作成功 | PR / main / release gate |

### 7.3 阈值来源表

| 指标 | 当前来源 | 当前处理 |
|---|---|---|
| 查询 / 追溯耗时 | `00-需求文档.md` §13 要求不阻塞常规协作 | 首次实现生成 benchmark baseline |
| job / outbox 处理耗时 | `01-架构设计.md` §13 要求耗时处理不压入同步入口 | nightly / release-like 记录基线 |
| 日志 / 审计字段 | `03-详细设计.md` §14 | 作为 P0 断言字段 |
| 配置敏感边界 | `04-配置设计.md` §8~§11 | 作为 P0 负向门禁 |

## 8. 回填草稿

```md
## 10. 专项测试与非功能验证

> 校准来源：
> - `design-calibration/05_test_plan_step_10_special_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“专项测试矩阵”“一票否决专项清单”和“阈值来源表”小节,了解非功能验证如何从需求、架构、详细设计和配置设计收敛。

本章覆盖性能、安全边界、一致性、恢复、可观测性和审计专项。专项测试不得凭空写死无来源阈值；尚未有实现基线的性能指标必须先形成 benchmark baseline,并进入 release 风险跟踪。

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 安全边界 | 禁止正文和 raw secret 不入仓 | negative fixture + persistence / audit scan | PR / main / release-like | 发现即一票否决 | EV-SEC-001 / EV-SEC-002 |
| 一致性 | truth + outbox 原子提交 | failing port injection | main CI | 成功同时提交,失败不得半提交 | EV-INT-001 |
| 恢复 | outbox / projection / snapshot 可重跑 | relay / rebuild / derive rerun | main CI / release-like | 状态显式,pending / failed 可恢复 | EV-WORKER-001 |
| 可观测性 | trace_id 贯穿关键路径 | log / audit / event scan | main CI / release-like | command/query/job/relay 可关联 | EV-TRACE-001 |
| 审计 | 高影响变化可追溯 | audit fixture + trace query | main CI / release-like | actor_ref、trace_id、resource、state/fingerprint 完整 | EV-AUDIT-001 |
```

## 9. 待确认事项

- 性能数值阈值是否在 `07-实施计划.md` 首次 benchmark 后回填到测试方案或作为后续校准项。
- 是否接受 raw secret、禁止正文入仓、失败伪成功、引用失败默认放行作为测试阶段一票否决专项。

## 10. 进入下一步条件

- [x] P0 非功能和红线均有验证方式。
- [x] 性能、安全、一致性、恢复、观测和审计专项均有证据口径。
- [x] 无来源数值阈值已进入待确认,未被写成正式事实。
- [x] 可以进入 Step 11 定义缺陷管理与复验规则。
