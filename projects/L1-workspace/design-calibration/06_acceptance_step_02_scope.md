# Step 2. 明确验收目标与范围

## 1. Step 状态

`completed / p0_boundary_fixed`。本步固定 P0/P1/P2 裁决范围，未产生执行事实。

## 2. 验收目标

| 目标 | P级 | 通过上限 |
|---|---|---|
| workspace 只拥有 view/projection/local/recovery 局部状态 | P0 | 需真实 boundary evidence |
| current visibility 下的 Personal/Project safe read | P0 | owner 正向 seam 未闭合则 blocked |
| projection 的版本、cursor、幂等、gap、unknown、rebuild | P0 | local/controlled 可证明机制；durable/owner blocked |
| local attention/read/pin/mute 等隔离 | P0 | local evidence；owner relation blocked |
| export/read model 稳定只读 | P0 | workspace local proof；downstream compatibility blocked |
| 量化性能、容量、长稳、RTO/RPO、retention | P2 | baseline pending，不作当前通过条件 |

## 3. 范围与非范围

| 范围 | 状态 | 非范围/风险归属 |
|---|---|---|
| 16局部对象、7 service、14入口 | planned | 不验 owner 内部实现 |
| six Query no-write/current visibility | planned/blocked | 不验授权算法 |
| two Consumer、four Operation | planned/blocked | 不验 bus delivery/owner event production |
| config/profile/redaction/dependency | planned | 不宣称真实部署 |
| SDK/product/sync/archive read compatibility | blocked | 下游 owner负责完整实现；L4串行后续 |

## 4. SOP 问题回答

- P0 缺正式 seam 仍保留且不可降级；`blocked` 不是通过。
- P1 只在 P0 之后做兼容/加固，不能替代 P0。
- P2 没有 baseline 时保持 pending，不发明数字。
- 非范围必须写出风险 owner，不在 workspace 私补真相。

## 5. 一票否决关联

越权展示、Query 写、Gap terminal、Unknown 盲重做、cursor/generation 混轴、unsafe cutover、owner/outbound/archive 写、secret 泄漏、fake/静态 EV 造通过均为 VETO 候选。

## 6. 回填草稿

正式 §2 使用本步范围表和优先级/执行状态双轴；明确当前只能形成设计裁决，不能形成验收结论。

## 7. 进入下一步条件

P0/P1/P2、非范围和风险归属已固定；允许进入 Step3 固定基线。
