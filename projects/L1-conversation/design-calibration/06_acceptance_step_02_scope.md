# L1-conversation 06 验收标准 Step 2: 明确验收目标与范围

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §2 验收目标与范围
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确验收目标与范围 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_02_scope.md` |

本步定义本轮验收裁决什么、不裁决什么、哪些范围只验接缝、哪些范围可能触发一票否决。验收基线、送验版本、固定 `<run_id>` 和 report 路径由 Step 3 固定。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 验收输入映射和旧稿处理口径 | 作为本步直接前置 |
| `00-需求文档.md` §2 / §7 / §9 / §10 / §13 / §14 | 仓定位、核心能力闭环、FR / BR / NFR 和一票否决方向 | 作为验收目标和 P0 红线来源 |
| `01-架构设计.md` §2 / §3 / §7 / §8 / §12 | 架构目标、职责边界、依赖方向、数据所有权和横切关注点 | 作为架构红线和下游接缝裁决来源 |
| `02-概要设计.md` §2 ~ §10 | 主要组成部分、关键对象、接口骨架、处理流、状态和异常边界 | 作为验收范围分组来源 |
| `03-详细设计.md` §2 / §6 ~ §15 | 对象、协议、状态、处理流、事务、错误、幂等和观测 | 作为正式字段、状态和接口名来源 |
| `04-配置设计.md` §2 / §6 / §7 / §11 / §12 | profile、配置项、失效模式、reports / artifacts 和 redaction | 作为配置与证据验收范围来源 |
| `05-测试方案.md` §2 / §5 / §6 / §13 / §14 | 测试范围、TC、EV、证据归档和残余风险 | 作为验收范围和非范围裁决来源 |

## 3. SOP 问题回答

### 3.1 本轮验收的核心裁决目标是什么?

本轮验收的核心裁决目标是判断 `L1-conversation` 是否作为 Conversation truth center 成立。具体裁决为: space / scope 能否显式建立和维护,conversation fact 能否 append-only 沉淀,authorized consumption 是否受 visibility 约束,cross-domain manifestation 是否只保存 ref / safe snapshot / marker,trace / handoff 是否可追溯且不泄露正文,outbox / operations jobs 是否可重跑且不反写真相,configuration / reports / redaction 是否形成可验收证据。

### 3.2 P0/P1/P2 验收范围如何划分?

P0 是本轮必须给出通过 / 不通过裁决的范围,包括 truth、authorization、data ownership、transaction、idempotency、outbox、handoff、operations diagnostics、configuration、reports / artifacts 和 redaction。P1 是 release readiness 或 integration readiness 风险,可以形成有条件通过或遗留项,但不得被宣称为 production-like 通过。P2 是远期能力,本轮只裁决“未启用或启用即 unsupported / fail-fast”。

### 3.3 哪些下游能力只验接缝?

`L0-bus`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L6-bridges`、`L4-observability`、`L4-archive`、`L5-chat` 和 `L1-workspace` 都只验本仓接缝或消费边界。验收标准不得裁决这些仓的内部真相、产品体验、生产部署或业务生命周期。

### 3.4 哪些非范围会影响最终结论?

真实 DB / broker / resolver / handoff、真实跨仓端到端、production-like 运维、生产级容量数字、Chat UI / Workspace / Bridges 体验、Runtime 推理质量和来源仓 truth lifecycle 不影响 P0 “通过”结论,但会影响“是否可宣称 release readiness / production readiness”。这些必须进入 Step 13 风险接受或遗留项。

### 3.5 哪些范围项可能成为一票否决?

核心能力闭环缺失、授权视野失效、forbidden body / raw secret / 相邻仓正文进入 truth / log / event / report、append-only 被破坏、source truth 被本仓补造、projection / query / report 反写真相、配置绕过 redaction / audit / idempotency / state machine、证据路径无法固定、fake-as-production 都可能成为一票否决。

### 3.6 哪些验收范围必须使用详细设计正式字段、状态或接口名?

所有 P0 AC 都必须使用 `03-详细设计.md` 和 `design-calibration/03_ddd_*` 中的正式对象、协议、状态、错误、event 和 job 名称。尤其是 Conversation truth state、space lifecycle、visibility scope state、conversation fact state、manifestation state、reference resolution state、projection freshness state、outbox publication state、trace / archive handoff state、Command / Query / Consumer / Job 协议和 error 名称,不得使用旧 Turn / StreamEvents 口语名。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 范围仍围绕 Turn、StreamEvents、projection,还把固定性能数字写成验收阈值 | 不继承旧范围和旧阈值 |
| `05-测试方案.md` §2 | 已明确 P0 / P1 / P2、非范围和一票否决范围 | 本步转成验收裁决范围 |
| `05-测试方案.md` §14 | 已列 P1/P2 残余风险和 S0 / S1 不可接受规则 | 本步明确哪些非范围影响最终结论 |
| `03-详细设计.md` | 已固定正式对象、状态、协议和错误 | 本步要求 P0 AC 使用正式名称 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 验收目标 | 判断旧 conversation / turn / stream 是否可用 | 判断 Conversation truth center P0 主链是否成立 |
| 范围层级 | 旧稿未区分 P0 / P1 / P2 | P0 必裁决,P1 风险接受,P2 unsupported / 后续 |
| 下游能力 | 旧稿容易裁决 Chat / Bridges / 上游仓效果 | 只裁决本仓接缝和消费边界 |
| 非范围 | 旧稿未说明是否影响结论 | 非范围不阻塞 P0,但影响 release / production readiness 表述 |
| 一票否决 | 旧稿三红线过于抽象 | 明确授权、数据归属、append-only、source truth、redaction、path 和 fake-as-production |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 验收范围是否覆盖真实生产集成 | P0 同时验真实 DB / broker / resolver / handoff | P0 验本仓 truth 和 controlled seam,真实生产集成列为 P1/P2 风险 | B | 当前设计和测试方案不以真实外部服务作为 P0 通过条件 |
| 外围增强是否阻断 P0 | search / projection / cursor 全量体验不通过即 P0 不通过 | 外围增强必须证明 derived read-only 和 failure marker,但完整体验可为 P0-supporting | B | 需求和测试方案把核心 truth 与外围增强区分 |
| 旧性能数字是否继承 | 继承旧 p95 数字 | 不继承,只裁决已有行为阈值和证据 | B | 新版需求未锁定量化性能阈值 |
| 非范围是否影响最终结论 | 完全不记录 | 不阻塞 P0,但影响 release / production readiness 和风险接受 | B | 避免把 P0 通过误读为生产完备 |
| P0 AC 是否可使用口语名 | 可以简写 | 必须用详细设计正式名称 | B | 防止旧 Turn / StreamEvents 口径回流 |

## 7. 结构化中间产物

### 7.1 验收目标

| 验收目标 | 裁决口径 | 主要证据入口 |
|---|---|---|
| Conversation truth center 成立 | space / scope、fact、manifestation、trace、outbox 和 operations jobs 都不退化为 UI 消息、runtime 临时上下文或外部平台副本 | `EV-CONV-TRUTH-001`; `EV-CONV-FACT-001`; `EV-CONV-MAN-001`; `EV-CONV-GATE-001` |
| 授权消费成立 | Query、projection、search、cursor、trace read 和 downstream consumption 均受 visibility scope 约束 | `EV-CONV-AUTH-001` |
| 数据归属成立 | 相邻仓正文、runtime reasoning body、bridge platform body、artifact body、raw secret 不进入 truth / log / event / report | `EV-CONV-REDACTION-001`; `reports/runs/<run_id>/redaction-check.md` |
| 变化传播和恢复成立 | outbox、consumer、handoff、projection、cursor 和 consistency job 可重跑、可留证、不修写真相 | `EV-CONV-OUTBOX-001`; `EV-CONV-HANDOFF-001`; `EV-CONV-DERIVED-001` |
| 证据可验收 | gate、report、redaction、acceptance handoff 都使用固定 run-scoped 路径 | `EV-CONV-CONFIG-001`; `EV-CONV-ACCEPT-001` |

### 7.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| Conversation space / scope | 功能 / 状态 / 授权 | P0 | space、participant scope、visibility scope 可显式建立、更新、关闭,非法迁移被拒绝 | 不裁决 Identity 生命周期 |
| Conversation fact append | 功能 / 事务 / 幂等 | P0 | fact append-only、receipt、trace、outbox 同事务成立,重复 / 冲突可裁决 | 不裁决 Runtime 推理质量 |
| Authorized query / projection | 功能 / 数据边界 | P0 | authorized read、query no-write、stale / failed marker 和 refs-only search 成立 | 不裁决 Chat UI / Workspace 展示体验 |
| Cross-domain manifestation | 功能 / 数据所有权 | P0 | external fact 只以 ref、safe snapshot、manifestation 或 unresolved / mismatch marker 进入 | 不裁决 Work / Governance / Artifact / Identity 来源 truth |
| Trace / review / handoff | 功能 / 可追溯 / 恢复 | P0 | review anchor、trace handoff、archive handoff 可追溯,失败不回滚 fact truth | 不裁决全局 trace store 或 archive package body |
| Outbox / event collaboration | 事件协作 | P0 | outbound event、publish retry / failed、duplicate prevention 和 replay evidence 成立 | 不裁决真实 broker 产品行为 |
| Operations jobs | 维护 / 一致性 / 诊断 | P0 / P0-supporting | projection、search、cursor、snapshot refresh、consistency validation 可重跑且不自动修写真相 | 不裁决 auto repair |
| Configuration / reports / redaction | 配置 / 证据 / 安全 | P0 | profile、path shape、redaction lower bound、fake-as-production reject 和 reports / artifacts 成立 | 不裁决 production runbook |
| Controlled integration seam | 外部接缝 | P1 / readiness | controlled resolver / publisher / handoff 保留 unresolved、retry、failed、quarantine 语义 | 不等于 production-like |
| Real production integration | 外部产品 | P2 | 当前不裁决,后续专项 | 本轮不得宣称 production readiness |

### 7.3 下游能力接缝裁决表

| 下游 / 相邻能力 | 本轮裁决内容 | 不裁决内容 |
|---|---|---|
| `L0-core` | shared ID、ActorRef、TraceContext、metadata、error、evidence 引用可用 | core 内部实现 |
| `L0-bus` | outbox event schema、fake / controlled publish、retry / failed、event id 幂等 | 真实 broker、dead-letter 产品、bus 内部 replay |
| `L1-identity` | actor / member / AI member ref、safe snapshot、unresolved actor 行为 | 成员生命周期、认证授权裁决 |
| `L1-work` / `L1-governance` / `L1-artifact` | external fact ref、safe snapshot、manifestation、digest mismatch / unresolved | project、governance decision、artifact 正文和来源真相 |
| `L2-runtime` | result committed ref-only event,reasoning body forbidden | 推理质量、agent loop、tool call、memory |
| `L6-bridges` | mapped fact ref-only input,platform body forbidden | 外部平台协议生命周期和正文 |
| `L4-observability` / `L4-archive` | trace / archive handoff ref、retry / failed、redaction | 全局 trace store、长期归档正文和恢复主体 |
| `L5-chat` / `L1-workspace` | authorized query、event / cursor / projection consumption boundary | UI 展示、workspace 聚合逻辑 |

### 7.4 非范围及最终结论影响表

| 非范围 | 是否阻塞 P0 通过 | 对最终结论的影响 | 后续处理 |
|---|---|---|---|
| 真实 DB / broker / resolver / handoff 产品行为 | 否 | 不得宣称 production-like 通过 | Step 13 风险接受 / 后续 P1 专项 |
| 真实跨仓端到端联调 | 否 | 不得宣称全局端到端 ready | Step 13 风险接受 |
| Chat UI / Workspace / Bridges 体验 | 否 | 不得宣称产品体验完整 | 对应下游仓验收 |
| Runtime 推理质量和工具调用正确性 | 否 | 不裁决 AI 输出质量 | `L2-runtime` / tools 验收 |
| 来源仓 truth lifecycle | 否 | 不裁决来源仓内部正确性 | 来源仓验收 |
| 生产级吞吐、延迟、容量数字 | 否 | 不得宣称满足未确认性能指标 | Step 9 / Step 13 风险接受 |
| config center / hot reload / auto repair | 否 | P0 中启用应视为 unsupported / fail-fast | P2 后续设计 |

### 7.5 一票否决候选范围

| 候选范围 | 触发不通过的条件 | 后续落点 |
|---|---|---|
| 核心闭环 | space / scope、fact append、authorized consumption、manifestation、trace 任一必要节点缺失 | Step 5 / Step 11 |
| 授权视野 | 未授权 actor、consumer、query、cursor、search 或 trace read 取得不可见事实 | Step 6 / Step 11 |
| 数据归属 | 相邻仓正文、runtime reasoning body、bridge platform body、artifact body、raw secret 进入 truth、log、event、report | Step 6 / Step 10 / Step 11 |
| Append-only truth | 已成立 fact、scope change、manifestation、trace 被覆盖、抹除或被 query / projection 隐式改写 | Step 8 / Step 11 |
| Source truth isolation | Conversation 自行推断 governance、artifact、work、identity、runtime 或 bridge 来源真相 | Step 6 / Step 7 / Step 11 |
| Derived read-only | projection、search、cursor、report、consistency job 生成新业务 fact 或修写真相 | Step 8 / Step 11 |
| 配置红线 | 配置关闭 visibility、redaction、idempotency、state machine、audit chain 或启用 P0 unsupported 能力 | Step 9 / Step 11 |
| 证据路径 | 无法生成固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 或 EV index | Step 10 / Step 11 |
| fake-as-production | fake / fixture / controlled adapter 被标记为真实生产集成通过 | Step 9 / Step 11 |

### 7.6 正式名称约束表

| 范围 | 必须使用的正式名称来源 | 禁止写法 |
|---|---|---|
| P0 对象和字段 | `03-详细设计.md`; `03_ddd_step_06_object_contracts.md` | Turn / message / stream 旧主语 |
| Command / Query / Consumer / Job | `03_ddd_step_08_protocol_contracts.md` | “接口基本正常” |
| 处理流和副作用 | `03_ddd_step_09_function_flows.md` | “流程跑通” |
| 状态和非法迁移 | `03_ddd_step_10_state_matrix.md` | 旧口语状态或后续 phase 状态 |
| 事务、一致性和幂等 | `03_ddd_step_11_persistence_transaction_consistency.md`; `03_ddd_step_13_concurrency_idempotency.md` | 只写“无重复” |
| 错误和恢复 | `03_ddd_step_12_error_recovery.md` | 裸字符串错误或未定义错误 |
| 证据和报告 | `05-测试方案.md` §13 | “见测试报告” |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §2 时摘录。

```markdown
## 2. 验收目标与范围

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_02_scope.md` 的“验收目标”“验收范围表”“下游能力接缝裁决表”“非范围及最终结论影响表”和“一票否决候选范围”小节，了解本章验收范围如何从新版 `00~05` 收敛而来。

本轮验收的核心裁决目标是判断 `L1-conversation` 是否作为 Conversation truth center 成立。P0 必须裁决 space / scope、fact append、authorized consumption、cross-domain manifestation、trace / handoff、outbox / events、operations jobs、configuration / reports / redaction。P1 只裁决 readiness 或 controlled seam 风险；P2 不在本轮裁决范围内。

真实生产外部服务、真实跨仓端到端、Chat UI / Workspace / Bridges 体验、Runtime 推理质量、来源仓 truth lifecycle、生产级容量数字、config center / hot reload / auto repair 不阻塞 P0 通过,但必须进入风险接受或后续专项。正式 AC 必须使用详细设计和测试方案中的正式对象、协议、状态、错误、TC、EV 和 report 路径。
```

## 9. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续 Step 必须继续收口:

- Step 3 固定送验版本、环境、数据、`run_id`、artifact、report 和 acceptance handoff 基线。
- Step 5~Step 11 将本步 P0 范围和一票否决候选项转成可裁决 AC。
- Step 13 记录本步非范围对应的风险接受和遗留项。
- Step 15 重建正式 `06-验收标准.md` 时不得把 P1/P2 非范围写成 P0 通过条件。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收目标清楚 | 通过 | 核心目标是裁决 Conversation truth center 是否成立 |
| P0 / P1 / P2 范围清楚 | 通过 | P0 必裁决,P1 readiness 风险,P2 后续 |
| 下游接缝边界清楚 | 通过 | 相邻仓只验本仓接缝和消费边界 |
| 非范围影响清楚 | 通过 | 不阻塞 P0,但影响 release / production readiness 表述 |
| 可以进入 Step 3 | 通过 | 下一步固定验收基线 |
