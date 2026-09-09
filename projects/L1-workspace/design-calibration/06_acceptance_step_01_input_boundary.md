# Step 1. 确认验收输入边界

## 1. Step 状态

| 项 | 结论 |
|---|---|
| 状态 | completed / pass_with_external_slots |
| 输入 | 停审的 00~05、全局依赖规则、06 SOP/书写规范 |
| 输出 | 验收输入映射、禁止进入 06 的事实、待裁决问题 |
| 当前写入 | 仅中间产物；正式 06 尚未写入 |

## 2. 本步目标与输入

验收只消费已经停审的需求、架构、概要、详细、配置和测试设计。未闭合的 owner、bus、durable、下游和实现事实必须保留为 blocker，不得在 06 私造 schema 或通过结论。

| 来源 | 验收承接 | 不重新定义 |
|---|---|---|
| 00 | 10 FR、12 BR、NFR、VETO方向 | workspace 需求与 owner truth |
| 01 | read-model owner、依赖类型、边界 | 系统总体架构 |
| 02 | 7 CP、16对象、14入口、状态轮廓 | 设计对象真相 |
| 03 | 字段、协议、flow、状态、事务、恢复、观测 | 实现代码与驱动选择 |
| 04 | profile、limits、binding、secret、失效 | 配置实际值与部署事实 |
| 05 | 59 TC/EV、suite、report、缺陷、回归规则 | 测试执行结果 |

## 3. SOP 问题回答

1. P0 验收主线是 owner 边界、safe read、projection、local state、recovery、证据真实性和一票否决。
2. 每个 AC 必须回指正式章节和 `TC-WS-*`/`EV-WS-*`；EV 目前只是 planned slot。
3. owner schema、visibility decision、event order/replay、durable finality、下游消费合同均为外部输入槽位；缺失时 AC 为 blocked。
4. 06 不写测试日志、run、artifact、verdict、signoff 或 readiness。

## 4. 当前材料问题诊断与取舍

| 问题 | 风险 | 处理 |
|---|---|---|
| 上游正向合同未闭合 | 可能把 fake 当正式证据 | 固定 AC，状态 blocked |
| 05 EV 尚无实例 | 不能直接给通过 | 固定同 run 证据规则 |
| 旧草稿可能含业务 truth | 污染验收主语 | 只作 historical_material，不继承 |

## 5. 结构化中间产物：验收输入映射

| 输入类别 | 正式引用 | 06落点 |
|---|---|---|
| 功能 | FR-WS-001~010 | §5 AC-FUNC-001~010 |
| 边界 | BR-WS-001~012、01/03 owner表 | §6 AC-BOUND/VETO |
| 接口 | 14协议/flow、依赖裁剪 | §7 AC-SYNC |
| 一致性 | 状态矩阵、事务/幂等/恢复 | §8 AC-STATE |
| NFR | 00 §13、05 §10 | §9 AC-NFR |
| 证据 | 05 §13、59 EV | §10 AC-EVID |

## 6. 回填草稿

正式 §1 必须声明 06 是裁决文档，承接 00~05，不重新定义真相；当前没有可消费的真实 EV 或结论。

## 7. 待确认与进入下一步条件

WS-UP-001~008/006-S、WS-LOCAL-001~003继续开放；输入清单和事实上限已明确，允许进入 Step2。
