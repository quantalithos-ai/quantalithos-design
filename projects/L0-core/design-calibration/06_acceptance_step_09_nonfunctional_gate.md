# Step 9. 定义非功能验收门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-core/06-验收标准.md` §9

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §13 | 性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性需求 | 定义非功能验收维度 |
| `01-架构设计.md` §11 / §13 | 关键技术机制、横切关注点 | 定义非功能约束来源 |
| `03-详细设计.md` §10~§14 | 一致性、错误恢复、配置引用、观测审计 | 提供非功能实现级门禁依据 |
| `05-测试方案.md` §10 / §13 / §14 | 专项测试、EV-NFR、EV-SEC、EV-SCOPE、EV-CONFIG、EV-WORKER、残余风险 | 绑定非功能证据和风险 |
| Step 6~8 | 红线、接口、状态与一致性验收 | 避免重复,本步只抽取非功能裁决口径 |

依赖的前序 Step：Step 1~8 已确认。

## 3. SOP 问题回答

1. 哪些非功能指标是 P0?

   回答：P0 非功能包括同步入口不得承接耗时派生和下游确认、禁止正文不入仓、raw secret 不泄露、相邻仓职责不进入本仓、resolver fail closed、truth + audit + outbox 一致性、outbox / projection 可恢复、核心真相不依赖外围增强能力。查询 / 追溯性能基线在首次实现时必须形成;若被标记为 release gate,则转为 P0 阻断。

2. 阈值来自需求、设计还是运行基线?

   回答：本轮不得编造数值阈值。同步入口边界来自架构和详细设计;安全、职责、fail closed 来自需求 / 配置 / 测试方案;查询、job、relay 的耗时阈值来自首次实现后的 benchmark baseline 或 release-like gate。没有 baseline 时,只能要求生成 baseline 和风险记录,不能写死毫秒数。

3. 哪些专项未覆盖,是否影响验收?

   回答：真实 L0-bus 投递、真实下游仓联调、真实 secret provider / KMS、完整性能容量压测未在 L0-core P0 中覆盖。它们不直接导致本步 P0 不通过,但必须进入 Step 13 风险接受。若其中任一被本轮 release gate 明确标记为必需,则缺失会阻断最终结论。

4. 哪些非功能失败会阻断发布?

   回答：禁止正文入仓、raw secret 泄露、相邻仓职责进入本仓、resolver fail open、truth + outbox 半提交、audit 静默失败、失败伪成功、release gate 性能 baseline 退化、P0 evidence 缺失都会阻断发布准备。

5. 证据来自哪里?

   回答：证据来自 `05-测试方案.md` 的 EV-NFR-001、EV-NFR-002、EV-SEC-001、EV-SEC-002、EV-SCOPE-001、EV-CONFIG-001、EV-INT-001、EV-AUDIT-001、EV-WORKER-001、EV-CONTRACT-002、EV-E2E-001 和 EV-NIGHTLY-001。EV-NFR-* 与 EV-NIGHTLY-001 默认作为 baseline / 风险证据,只有被 release gate 标记为必需时才成为 P0 阻断。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §5 | 非功能仍围绕 primitive 可追溯、可审计、consume drift | 不覆盖新版性能、安全、可用性、恢复和配置失效模式 |
| `06-验收标准.md` §5 | 写了 100%、0 等旧阈值,但来源不清 | 不符合“阈值不得无来源” |
| `06-验收标准.md` §5 | 未区分 EV-NFR / nightly 是 P0 阻断还是风险证据 | 可能把未形成运行基线的性能指标误判为通过或失败 |
| `06-验收标准.md` §5 / §7 | 安全与职责边界散落在旧治理门禁 | 不能形成统一非功能裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 非功能维度 | 可追溯、可审计、一致性、安全、可恢复、可裁剪旧口径 | 性能、可用性、安全、职责边界、配置安全、恢复、兼容、容量 baseline | 对齐新版 00 / 05 |
| 阈值口径 | 100% / 0 等泛化阈值 | 有来源才写阈值;无来源先生成 baseline | 避免编造数字 |
| 性能验收 | 未与实现 baseline 绑定 | 同步入口边界 P0;查询 / job / relay baseline 按 release gate 决定是否阻断 | 更符合当前尚未实现状态 |
| 安全验收 | rich model reject | 禁止正文、raw secret、职责边界、fail closed | 对齐数据归属和配置设计 |
| 风险处理 | 未区分 | 未覆盖专项进入 Step 13 风险接受 | 支撑有条件通过 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 写死固定性能数字 | 看似明确 | 当前无实现基线,数字无来源 | 不采用 |
| B. 完全不验性能,全部后移 | 简单 | 同步入口边界是架构 P0,不能后移 | 不采用 |
| C. 同步入口边界作为 P0,查询 / job / relay 先生成 baseline,release gate 标记后成为阻断 | 有来源,可实施,不虚构阈值 | 需要实施期补 baseline | 采用 |
| D. 将真实 L0-bus / 下游 / KMS 未覆盖全部判不通过 | 保守 | 越过本仓边界 | 不采用 |

## 7. 结构化中间产物

### 7.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-NFR-001 | 性能 / 同步入口边界 | Command 同步入口不得压入耗时派生、全量校验、下游确认或真实投递 | 发布命令只完成入口判断和提交;派生 / 校验 / 下游确认通过 job / outbox 承接 | EV-NFR-001、EV-SVC-001、EV-WORKER-001 | 失败则不通过 |
| AC-NFR-002 | 性能 / 查询与追溯 baseline | 查询 / 追溯不得阻塞常规协作;首次实现必须形成 benchmark baseline | 无固定数字;以首次 accepted baseline 和 release gate 标记为准 | EV-NFR-002、EV-TRACE-001 | release gate 未标记时作为风险;标记后失败则不通过 |
| AC-NFR-003 | 安全 / 禁止正文 | 业务正文、事件 payload 正文、观测 trace 正文、归档正文、运行记录正文不得入仓 | 进入 truth、snapshot、audit、outbox、report 的禁止正文数量为 0 | EV-SEC-001、EV-SCOPE-001 | 失败则一票否决 |
| AC-NFR-004 | 安全 / raw secret | raw secret、token、credential 不得进入配置、日志、审计和报告 | raw secret 暴露数量为 0;只允许 redacted ref / secret ref | EV-SEC-002、EV-CONFIG-001 | 失败则一票否决 |
| AC-NFR-005 | 职责边界 / 可用性 | 认证授权、事件投递 runtime、SDK 高层封装、L1 业务语义不进入本仓;核心真相不依赖外围增强 | API surface、对象、配置、流程均无相邻仓职责;外围增强失败不破坏 truth | EV-SCOPE-001、EV-E2E-001 | 职责入侵则不通过;外围增强缺失进入风险 |
| AC-NFR-006 | 配置安全 / fail closed | reference resolver、root path、敏感配置失败时 fail fast / fail closed | 引用失败不得默认放行;非法配置不得启动 runtime | `TC-CONFIG-001`~`TC-CONFIG-003`;EV-CONFIG-001 | fail open 则一票否决候选 |
| AC-NFR-007 | 恢复 / projection | projection stale 显式暴露,rebuild 后 watermark 前进 | stale 不得伪装 current;watermark 不倒退 | `TC-QUERY-002`、`TC-JOB-003`;EV-WORKER-001、EV-INT-001 | 失败则不通过 |
| AC-NFR-008 | 恢复 / outbox relay | relay publish fail 后 pending / failed 可恢复,event id 稳定 | 单条失败不丢事件,重放不产生新 truth | `TC-OUTBOX-002`;EV-CONTRACT-002 | 失败伪成功则一票否决候选 |
| AC-NFR-009 | 兼容 / schema | DTO / CloudEvent schema version、required fields、event type/source 稳定 | breaking 变更必须更新基线并触发回归 | `TC-DTO-001`、`TC-EVENT-001`;EV-CONTRACT-001、EV-CONTRACT-002 | 漂移且无基线变更则不通过 |
| AC-NFR-010 | 夜间 / 故障恢复专项 | nightly 并发、故障注入、projection rebuild、outbox replay 形成风险证据 | 默认不作为发布阻断;若 release gate 标记必需则必须通过 | EV-NIGHTLY-001 | 未标记时进入风险;标记后失败则不通过 |

### 7.2 阈值来源表

| 阈值类型 | 来源 | 当前处理 |
|---|---|---|
| 同步入口不得压入耗时派生 | 01 架构设计 / 03 详细设计处理流 | P0 固定门禁 |
| 查询 / 追溯耗时 | 首次实现 benchmark baseline | 当前不写死数字,实施期补 baseline |
| job / relay 性能 | 首次实现 benchmark baseline 或 release-like gate | 当前不写死数字,按 release gate 标记决定是否阻断 |
| 禁止正文 / raw secret | 00 数据归属 / 05 专项测试 | 固定为 0 |
| schema 兼容 | 03 协议契约 / 05 contract suite | 以 schema version、required fields 和基线变更记录裁决 |

### 7.3 专项未覆盖与结论影响

| 未覆盖专项 | 当前处理 | 结论影响 |
|---|---|---|
| 真实 L0-bus 投递 | 本仓只验 outbox / CloudEvent / relay boundary | 进入 Step 13 风险接受 |
| 真实下游仓联调 | 本仓只验快照、schema、package / sample view 接缝 | 进入 Step 13 风险接受 |
| 真实 secret provider / KMS | 本仓只验 raw secret 禁止和 secret ref 边界 | 进入 Step 13 风险接受 |
| 完整性能容量压测 | 当前无生产负载模型 | 进入 Step 13 风险接受;release gate 标记后必须补 |
| CI artifact 物理存储 | 05 只定义逻辑路径 | 进入 Step 13 或实施计划固定 |

## 8. 回填草稿

```md
## 9. 非功能验收门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_09_nonfunctional_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“非功能验收表”“阈值来源表”和“专项未覆盖与结论影响”小节,了解非功能门禁如何从 NFR、详细设计和 05 专项证据收敛。

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-NFR-001 | 性能 / 同步入口边界 | Command 同步入口不得压入耗时派生、全量校验、下游确认或真实投递 | 派生 / 校验 / 下游确认通过 job / outbox 承接 | EV-NFR-001、EV-SVC-001、EV-WORKER-001 | 失败则不通过 |
| AC-NFR-002 | 性能 / 查询与追溯 baseline | 查询 / 追溯不得阻塞常规协作;首次实现必须形成 benchmark baseline | 以首次 accepted baseline 和 release gate 标记为准 | EV-NFR-002、EV-TRACE-001 | release gate 标记后失败则不通过 |
| AC-NFR-003 | 安全 / 禁止正文 | 禁止正文不得入仓 | 禁止正文数量为 0 | EV-SEC-001、EV-SCOPE-001 | 失败则一票否决 |
| AC-NFR-004 | 安全 / raw secret | raw secret、token、credential 不得进入配置、日志、审计和报告 | raw secret 暴露数量为 0 | EV-SEC-002、EV-CONFIG-001 | 失败则一票否决 |
| AC-NFR-005 | 职责边界 / 可用性 | 相邻仓职责不进入本仓;核心真相不依赖外围增强 | API surface、对象、配置、流程均无相邻仓职责 | EV-SCOPE-001、EV-E2E-001 | 职责入侵则不通过 |
| AC-NFR-006 | 配置安全 / fail closed | resolver、root path、敏感配置失败时 fail fast / fail closed | 引用失败不得默认放行;非法配置不得启动 runtime | `TC-CONFIG-*`;EV-CONFIG-001 | fail open 则一票否决候选 |
| AC-NFR-007 | 恢复 / projection | projection stale 显式暴露,rebuild 后 watermark 前进 | stale 不得伪装 current;watermark 不倒退 | `TC-QUERY-002`、`TC-JOB-003`;EV-WORKER-001、EV-INT-001 | 失败则不通过 |
| AC-NFR-008 | 恢复 / outbox relay | relay publish fail 后 pending / failed 可恢复,event id 稳定 | 单条失败不丢事件,重放不产生新 truth | `TC-OUTBOX-002`;EV-CONTRACT-002 | 失败伪成功则一票否决候选 |
| AC-NFR-009 | 兼容 / schema | DTO / CloudEvent schema version、required fields、event type/source 稳定 | breaking 变更必须更新基线并触发回归 | `TC-DTO-001`、`TC-EVENT-001`;EV-CONTRACT-001、EV-CONTRACT-002 | 漂移且无基线变更则不通过 |
| AC-NFR-010 | 夜间 / 故障恢复专项 | nightly 形成故障恢复风险证据 | 默认不阻断;release gate 标记后必须通过 | EV-NIGHTLY-001 | 未标记时进入风险;标记后失败则不通过 |
```

## 9. 待确认事项

- 是否接受查询 / job / relay 性能不写死数字,而是实施期形成 baseline。
- 是否接受 EV-NFR-* 和 EV-NIGHTLY-001 默认是风险证据,只有 release gate 标记后才阻断。
- 是否接受禁止正文和 raw secret 仍在 Step 9 出现,但最终一票否决在 Step 11 统一收口。

## 10. 进入下一步条件

- [x] 非功能裁决口径明确。
- [x] 阈值来源已说明,没有编造无来源数字。
- [x] 未覆盖专项已进入风险接受路径。
- [x] 可以进入 Step 10 定义可观测性、审计与证据门禁。
