# Step 2. 明确验收目标与范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-core/06-验收标准.md` §2

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 1 输入边界 | 已确认新版 `00/01/02/03/04/05` 是验收标准主输入 | 约束本步范围不沿用旧 06 |
| `00-需求文档.md` §4 / §7 / §9 / §13 / §14 | 目标与非目标、核心能力闭环、功能需求、非功能需求、验收方向和一票否决项 | 定义验收裁决目标和红线 |
| `01-架构设计.md` §2 / §3 / §9 / §13 / §14 | 架构目标、非目标、数据所有权、一致性、横切关注点、风险 | 定义架构验收范围和非范围 |
| `04-配置设计.md` §2 / §6~§12 | P0 配置控制面、profile、配置项、敏感边界、失效模式和下游承接 | 定义配置验收范围 |
| `05-测试方案.md` §2 / §14 | 测试目标、范围 / 非范围、残余风险和转入验收标准清单 | 转成验收范围和条件通过风险 |
| 旧 `06-验收标准.md` | 旧 shared primitive / admission 范围 | 作为问题诊断,不作为新版验收范围来源 |

依赖的前序 Step：Step 1 已确认。

## 3. SOP 问题回答

1. 本轮验收的核心裁决目标是什么?

   回答：本轮验收的核心裁决目标是判断 L0-core 是否可以作为跨仓共享契约来源仓进入下一阶段。裁决重点不是“是否存在若干公共类型文件”,而是四段核心闭环是否成立:跨仓契约范围统一收束、契约语义稳定表达、契约演进兼容且可追溯、下游仓基于同一契约基线稳定消费和派生。

2. P0/P1/P2 验收范围如何划分?

   回答：P0 是缺失后无法通过验收的核心闭环和实现契约,包括契约定义真相、范围边界、Command / Query / Event / Job、发布基线、快照派生、事务一致性、幂等并发、配置加载失效、观测审计和证据归档。P1 是增强型接缝或后续联调,如 staging-integration、多语言 binding、真实 secret provider 接入。P2 是平台体验或真实外部系统能力,如 config center、hot reload、完整 SDK developer experience、真实 L0-bus runtime。

3. 哪些下游能力只验接缝?

   回答：L0-bus 只验 outbox / CloudEvent / relay boundary,不验真实 publish / subscribe / ack / retry / dead-letter runtime。L0-sdk 只验可消费契约来源和 DTO / schema 稳定性,不验 SDK 高层包装体验。L1+ 仓只验禁止业务正文进入 L0-core 和下游能够基于同一基线消费 / 派生,不验业务聚合和业务状态机。

4. 哪些非范围会影响最终结论?

   回答：真实 L0-bus、真实下游仓库、真实 secret provider、完整性能容量压测、CI artifact 物理存储和当前旧 `06-验收标准.md` 都会影响最终放行信心。它们不进入 L0-core P0 完整裁决范围,但必须进入 Step 13 风险接受与遗留项。若这些风险未被接受,只能给出“不通过”或不能形成最终裁决。

5. 哪些范围项可能成为一票否决?

   回答：核心闭环任一节点缺失、边界外职责进入 L0-core、业务 / 事件 / 观测 / 归档 / 运行 / 凭据正文入仓、raw secret 泄露、truth + audit + outbox 不一致、失败伪成功、引用失败默认放行、发布基线不可追溯、P0 证据缺失都可能成为一票否决。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §1.1 | 验收目标仍是共享 primitive 准入、注册、拒绝、回放和 bus/sdk 承接 | 无法裁决当前共享契约来源仓四段核心闭环 |
| `06-验收标准.md` §1.2 | 范围仍是 CoreId / Ref / DTO / enum / error / metadata skeleton | 覆盖不到 Command / Query / Event / Job、release、snapshot、outbox、job、config |
| `06-验收标准.md` §5~§7 | 非功能和红线仍围绕 primitive replay / consume drift | 不覆盖新版安全边界、配置、事务、一致性和证据门禁 |
| `06-验收标准.md` 全文 | 未明确 P0/P1/P2 验收范围和只验接缝的下游能力 | 容易把相邻仓完整能力误作为 L0-core 验收失败 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心裁决目标 | shared primitive admission 是否成立 | L0-core 共享契约来源仓四段核心闭环是否成立 | 对齐新版需求与测试方案 |
| P0 范围 | CoreId / Ref / DTO / enum / metadata | 契约真相、范围、协议、状态、事务、outbox、job、配置、审计证据 | 对齐 03 / 04 / 05 |
| 下游能力 | bus/sdk consume base | L0-bus、L0-sdk、L1+ 只验接缝,不验完整实现 | 守住仓际边界 |
| 非范围 | 只写 bus / sdk / rich model | 明确真实 runtime、SDK 高层、L1 业务、config center、hot reload、secret provider、完整压测 | 支撑风险接受 |
| 一票否决来源 | rich model admitted / rejected primitive consumed | 核心闭环、边界职责、禁止正文、raw secret、一致性、证据缺失等 | 对齐新版红线 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只验 05 中 P0 用例是否全部通过 | 简单 | 无法表达架构红线、非范围和风险接受 | 不采用 |
| B. 将 L0-bus / L0-sdk / L1 完整联调纳入本轮验收 | 平台级信心更强 | 越界,会让 L0-core 无法独立验收 | 不采用 |
| C. 以 L0-core P0 闭环为强门禁,下游真实能力只验接缝并进入残余风险 | 可裁决、边界清楚、可进入下一阶段 | 需要后续仓继续验收 | 采用 |

## 7. 结构化中间产物

### 7.1 验收目标表

| 验收目标 | 来源 | 裁决重点 | 主要证据 |
|---|---|---|---|
| 判断 L0-core 是否能作为跨仓共享契约正式来源 | 00 §4 / §7 / F-001 | 契约范围能统一收束,边界外对象被拒绝 | TC-SCOPE-*、EV-SCOPE-001、EV-UNIT-001 |
| 判断契约语义是否能稳定表达 | F-002 / 03 §7 | Command / Query / Event / Job schema 与共同语义稳定 | TC-DTO-001、TC-EVENT-001、EV-CONTRACT-001 |
| 判断契约演进是否兼容且可追溯 | F-003 / BR-013 / BR-014 | lifecycle、release gate、compatibility、audit trace 成立 | TC-CMD-003~006、TC-AUDIT-001、EV-AUDIT-001 |
| 判断下游是否能基于同一基线消费和派生 | F-004 / 05 §6 | snapshot、package、outbox boundary 成立 | TC-JOB-002、TC-OUTBOX-*、EV-WORKER-001、EV-CONTRACT-002 |
| 判断配置和 runtime wiring 是否可验收 | 04 §7~§12 / 05 §8 | source priority、root validate、resolver fail closed、raw secret 禁止 | TC-CONFIG-*、EV-CONFIG-001、EV-SEC-002 |
| 判断非功能和证据门禁是否成立 | 00 §13 / 05 §10 / §13 | 安全、审计、trace、一致性、性能 baseline 和证据归档 | EV-SEC-*、EV-TRACE-001、EV-NFR-*、EV-E2E-001 |

### 7.2 范围 / 非范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| 契约定义真相与生命周期 | 功能 / 状态 | P0 | 状态规则、终态保护、发布基线和演进记录可裁决 | 不裁决 L1 业务对象生命周期 |
| 契约范围和边界守卫 | 架构红线 / 负向 | P0 | 单仓私有实现、边界外职责、禁止正文不能进入 L0-core | 不裁决完整治理审批 UI |
| Command / Query / Event / Job | 接口 / 协议 | P0 | 写路径、读路径、CloudEvent、job input/output 满足设计和测试证据 | 不裁决 HTTP / RPC server |
| Outbox / CloudEvent 接缝 | 跨仓接缝 | P0 | outbox 事件和 relay boundary 可恢复、可追溯 | 不裁决 L0-bus runtime |
| 发布基线、兼容性和快照派生 | 发布 / 派生 | P0 | gate、fingerprint、compatibility、snapshot ready 和失败保留成立 | 不裁决外部包发布中心 |
| 事务、一致性、幂等和并发 | 一致性 | P0 | truth + audit + outbox 原子边界、version conflict、idempotency replay 成立 | 不裁决分布式事务平台 |
| 配置加载、校验和失效 | 配置 / runtime | P0 | 7 个 P0 配置项、来源优先级、fail fast / fail closed 成立 | 不裁决 config center、hot reload、admin override |
| 观测、审计与证据归档 | 非功能 / 证据 | P0 | trace、audit、evidence artifact 足以支撑裁决 | 不裁决 L4-observability 存储和面板 |
| L0-bus / L0-sdk / L1+ 真实联调 | 下游接缝 | P1 | 只判断本仓输出是否可供后续联调 | 不作为 P0 完整验收 |
| 多语言 binding、样例、可视化 | 外围增强 | P1/P2 | 只记录后续增强风险 | 不进入本轮裁决 |
| 真实 secret provider / KMS / Vault | 敏感配置 | P1/P2 | P0 只裁决 raw secret 禁止和敏感边界 | 真实接入后续裁决 |

### 7.3 结论影响规则

| 情况 | 验收结论影响 |
|---|---|
| 任一 P0 范围项缺少证据或失败 | 不通过 |
| 任一一票否决项触发 | 不通过 |
| P0 通过,但 P1/P2 风险未接受 | 有条件通过或不通过,取决于风险影响 |
| P0 通过,残余风险均有接受人和后续动作 | 可有条件通过 |
| P0 通过,无阻断缺陷,证据完整,残余风险可接受 | 通过 |

## 8. 回填草稿

```md
## 2. 验收目标与范围

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收目标表”“范围 / 非范围表”和“结论影响规则”小节,了解本章验收目标和范围如何从需求、配置设计与测试方案收敛。

本轮验收的核心裁决目标是判断 L0-core 是否可以作为跨仓共享契约来源仓进入下一阶段。裁决重点是四段核心闭环是否成立:跨仓契约范围统一收束、契约语义稳定表达、契约演进兼容且可追溯、下游仓基于同一契约基线稳定消费和派生。

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| 契约定义真相与生命周期 | 功能 / 状态 | P0 | 状态规则、终态保护、发布基线和演进记录可裁决 | 不裁决 L1 业务对象生命周期 |
| 契约范围和边界守卫 | 架构红线 / 负向 | P0 | 单仓私有实现、边界外职责、禁止正文不能进入 L0-core | 不裁决完整治理审批 UI |
| Command / Query / Event / Job | 接口 / 协议 | P0 | 写路径、读路径、CloudEvent、job input/output 满足设计和测试证据 | 不裁决 HTTP / RPC server |
| Outbox / CloudEvent 接缝 | 跨仓接缝 | P0 | outbox 事件和 relay boundary 可恢复、可追溯 | 不裁决 L0-bus runtime |
| 配置加载、校验和失效 | 配置 / runtime | P0 | 7 个 P0 配置项、来源优先级、fail fast / fail closed 成立 | 不裁决 config center、hot reload、admin override |
| 观测、审计与证据归档 | 非功能 / 证据 | P0 | trace、audit、evidence artifact 足以支撑裁决 | 不裁决 L4-observability 存储和面板 |
```

## 9. 待确认事项

- 是否接受 L0-bus、L0-sdk、L1+ 在本轮 06 中只验接缝,不验完整运行时或业务实现。
- 是否接受 P0 通过但 P1/P2 风险未接受时不能直接判定为“通过”。
- 是否接受真实 secret provider / KMS / Vault 不进入本轮 P0 验收范围,但 raw secret 禁止作为 P0 红线。

## 10. 进入下一步条件

- [x] 验收范围可裁决。
- [x] P0/P1/P2 和非范围已明确。
- [x] 下游只验接缝的边界已明确。
- [x] 可以进入 Step 3 固定验收基线。
