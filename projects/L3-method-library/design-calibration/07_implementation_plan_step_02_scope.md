# Step 2. 明确实施目标、范围和非范围

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节: `07-实施计划.md` §2 实施目标与范围
> 当前模块: `R2.2 scope:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确实施目标、范围和非范围 |
| 当前模块 | `R2.2 scope:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 1 输入边界结论;`00-需求文档.md`;`02-概要设计.md`;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_02_scope.md` |
| 停审方式 | 用户已确认 Step 2,允许进入 Step 3 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | completed_confirmed | 固定 current `00`~`06` 为权威输入,旧 `07` 只作 old direction input |
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 / §16 | 已存在 | 提供核心能力闭环、FR-ML、BR-ML、NFR-ML、验收方向和追溯矩阵 |
| `02-概要设计.md` §4~§12 | 已存在 | 提供八组件代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态和详细设计承接 |
| `03-详细设计.md` §2~§16 | 已存在 | 提供八组件详细契约、非范围、protocol counts、flow/state/tx/error/config/observability/test cut |
| `05-测试方案.md` §2~§14 | 已存在 | 提供 P0/P1/P2 测试范围、suite、artifact/report、EV-ML 和 residual 口径 |
| `06-验收标准.md` §2~§14 | 已存在 | 提供 ML-FG、ML-RL、ML-SYNC、ML-STATE/TX/READ/JOB/IDEMP、VETO 和最终裁决口径 |
| `standards/document/实施计划书写规范.md` | 标准输入 | 固定正式 §2 只能收口目标、范围和非范围,不能拆 phase / commit |

## 3. SOP 问题回答

1. 本轮实施的最小可交付结果是什么。

   回答: 最小可交付结果是 `/home/aris/Projects/quantalithos-method-library` 中可编译、可测试、可验收的 L3 方法资产定义 truth center。它必须覆盖方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织的有界能力,并能按 `TC-ML-*` / `EV-ML-*` / ML-FG / ML-RL / ML-SYNC 门禁生成执行期证据。

2. 哪些需求编号必须覆盖。

   回答: 当前 P0 必须覆盖 FR-ML-001~FR-ML-009、BR-ML-001~BR-ML-022、NFR-ML-001~NFR-ML-016 以及 `06` 的 ML-FG-001~011、ML-RL-001~012、ML-SYNC-001~008、ML-STATE/TX/READ/JOB/IDEMP/CHKPT/NFR 相关验收项。FR-ML-E-001~004 是外围增强,只能在不阻塞 core 的前提下作为 peripheral / residual / future 处理。

3. 哪些详细设计章节必须落地。

   回答: 必须落地 `03-详细设计.md` §4~§16 的实现约束、模块布局、模块契约、对象/port/protocol、58 Command、57 Query、4 Inbound Consumer、34 Outbound Event / sender、8 Operations Job、函数级 flow、状态矩阵、持久化事务、错误恢复、并发幂等、配置绑定、观测审计、测试切口和实施承接。具体 phase / commit boundary 由 Step 5 / Step 6 拆分。

4. 哪些验收项必须在本轮可判定。

   回答: 本轮完成后必须能让 `06-验收标准.md` 的 P0 core 验收项可判定,包括方法资产统一定义与识别、稳定版本进入正式使用语境、下游按边界消费、变化追溯与一致性保护、证据线索承接、外围增强不阻塞核心闭环、data/architecture redline、接口同步、状态事务、一致性、非功能、观测证据和 VETO。真实 pass/fail verdict 不在设计阶段填写,但实施计划必须确保 raw artifact / generated report / evidence index / acceptance handoff 路径可执行。

5. 哪些能力明确不在本轮核心实施范围。

   回答: FR-ML-E-001~004 对应的方法资产包与方法集组织、生态发现、高级策略变体、标准映射材料承接不进入 P0 core 前置。marketplace 交易、安装、履约、UI 体验、artifact/archive 正文、治理执行、外部 provider、production-like capacity、vendor-specific adapter、真实部署运维 runbook 和最终验收签署不在本轮 core 实施范围。

6. 是否存在 P1 / P2 能力容易被误做进 P0。

   回答: 存在。高风险误入项包括旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线、PostgreSQL / object storage / concrete bus 产品锁定、MethodPlugin / MethodConfiguration 完整 product 能力、marketplace 生态分发、AIPolicy override、高级 ViewProfile、Qualification / CapabilityDefinition 独立核心、真实下游完整实现和 production-like SLO。新版 `07` 必须把这些写成 peripheral、residual、watch 或 future,不得让它们阻塞 P0 方法资产 truth center。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 旧 `07-实施计划.md` §2 | 仍写 P0 方法定义发布同步闭环、7 类 MethodContent、snapshot/outbox/fingerprint | 会把废弃旧主线当成实施目标 | 完全不继承,以 current `00`~`06` 重写目标与范围 |
| `00` FR-ML-E | 外围增强和核心能力同在需求文档 | 实施者可能把外围增强当成 P0 blocker | 明确 FR-ML-E-001~004 不进入 P0 core 前置 |
| `03` 八组件 | 范围大且协议数量多 | 若只写“实现详细设计”会缺审查粒度 | 先在 Step 2 锁范围,Step 5/6 再拆阶段与 boundary |
| `05/06` evidence | 证据路径已定义,真实 run 尚未产生 | 设计阶段可能误填真实结果 | 本 Step 只要求可执行路径,不伪造结果 |
| implementation ledger | 尚未定义 | 无法移交实现 | 本 Step 只声明必须覆盖,具体路径和门禁后续 Step 收敛 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施目标 | 旧 P0 publish/snapshot/outbox 主线 | L3 方法资产定义 truth center 与八组件实现闭环 | 对齐 current `00`~`06` |
| 实施范围 | 旧 7 类 MethodContent、GATE-T、AC-P0 | FR-ML-001~009、BR-ML、NFR-ML、TC-ML、EV-ML、ML-FG/RL/SYNC | 使用新版编号体系 |
| 非范围 | 旧 P1/P2 和产品能力混杂 | FR-ML-E-001~004、真实产品、生产容量、交易、UI、artifact 正文等后置 | 防止范围膨胀 |
| 验收定位 | 旧文档直接列 EV/AC 通过方向 | 只要求可判定路径,不填写真实 verdict | 防止静态造 evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 继续旧 P0 方法定义发布同步闭环 | 改动少 | 与 current `03/05/06` 冲突,会恢复废弃对象和旧 evidence | 不采用 |
| 只实现方法资产定义与正式化最小 core | 快速 | 不能证明受控消费、追溯、一致性、证据和 operations 成立 | 不采用 |
| 覆盖 current 八组件和 P0 验收门禁 | 能支持完整 truth center 和验收裁决 | 需要后续严密拆 phase / commit | 采用 |
| 把外围包、生态发现、高级策略和标准映射全部纳入 P0 | 功能更完整 | 会让 P0 被 peripheral 阻塞 | 不采用;作为 peripheral / residual |

## 7. 结构化中间产物

### 7.1 实施目标表

| 实施目标 | 来源 | 完成判定方向 |
|---|---|---|
| 建立方法资产定义 truth center | FR-ML-001~002;ML-FG-001/005;ML-RL-001 | 方法资产定义、identity、catalog、适用语境和 body-free source boundary 可编译、可测、可留证 |
| 建立正式化与版本稳定闭环 | FR-ML-003~004;ML-FG-002/006;ML-RL-003/007 | 正式化、正式版本、版本语义变化、状态守卫和 duplicate/replay 规则可执行 |
| 建立正式方法资产受控消费闭环 | FR-ML-005~006;ML-FG-003/007/008;ML-SYNC-002/004/007 | consumption material、availability、distribution/handoff、query no-write 和 downstream-not-ready seam 可测 |
| 建立追溯、一致性保护和证据线索闭环 | FR-ML-007~009;ML-FG-004/009/010/011;ML-RL-009/010 | trace、audit、lineage、impact、evidence/report pairing、stored replay 和 no truth repair 可判定 |
| 建立协议、事件、consumer、job 和 operation shell | `03` §7~§13;ML-SYNC-001~008 | 58 Command、57 Query、4 Consumer、34 Outbound Event/sender、8 Job 至少按 P0 boundary 分批落地 |
| 建立配置、依赖、redaction、observability 和 evidence 门禁 | `04`;`05`;`06` ML-NFR / VETO | config redline、dependency boundary、redaction boundary、observability/report audit 和 fixed run path 可执行 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 核心需求 | FR-ML-001~FR-ML-009 | `00` §9 / §16 | 是 | P0 core 主线 |
| 外围增强 | FR-ML-E-001~FR-ML-E-004 | `00` §9 / §15 | 有界支持 / residual | 不作为 P0 core 前置 |
| 业务规则 | BR-ML-001~BR-ML-022 | `00` §10 / §16 | 是 | 转成 domain / service / dependency / redline 门禁 |
| 非功能 | NFR-ML-001~NFR-ML-016 | `00` §13;`06` §9 | 是 | 以 sample / boundary / redaction / consistency / observability 方式判定 |
| 详细设计契约 | 八组件、对象、port、protocol、flow、state、tx、error、config、observability | `03` §2~§16 | 是 | 后续 Step 5/6 按可验证增量拆分 |
| 测试证据 | `TC-ML-*`;`EV-ML-*`;suite/report/artifact | `05` §3~§14 | 是 | Step 7 绑定到 phase / commit boundary |
| 验收门禁 | ML-FG、ML-RL、ML-SYNC、ML-STATE/TX/READ/JOB/IDEMP/NFR、VETO | `06` §5~§14 | 是 | Step 12 固定完成判定 |
| 实施台账 | project implementation ledger、boundary ledger、Commit Gate、Handoff Gate | 标准规范 | 是 | 后续 Step 3/6/7/11/12 收敛 |

### 7.3 非范围表

| 非范围项 | 来源 | 当前处理 |
|---|---|---|
| 流程执行、ProcessInstance、runtime orchestration | `03` §2.3 | 留给 `L1-process` / `L2-runtime` |
| 成员身份、成员生命周期、成员实际角色状态 | `03` §2.3 | 留给 `L1-identity` / 成员相关仓 |
| 治理裁决、Gate 执行、policy enforce | `03` §2.3 | 只保存治理结论摘要 / basis ref / safe marker |
| marketplace 定价、订单、购买、结算、安装、履约 | `03` §2.3 | 留给 `L6-marketplace` |
| UI 页面渲染、会话、组件状态、交互执行 | `03` §2.3 | 留给体验层 |
| artifact、archive、证据文件或外部文档正文生命周期 | `03` §2.3 | 只保存 summary/ref/marker/digest hint |
| 完整部署拓扑、worker runtime、scheduler、queue、retry 产品机制 | `03` §2.3 | 留给 `07` 后续实施准备或运维文档,不得在 Step 2 锁产品 |
| 真实验收结论、真实 run_id、implementation commit、config digest | `06` §3 / §14 | 执行期填写,设计阶段只定义路径 |

### 7.4 P1 / P2 防误入表

| 易误入项 | 正确边界 | 防误入规则 |
|---|---|---|
| MethodPlugin / MethodConfiguration 完整 product 能力 | peripheral / future | 不阻塞 FR-ML-001~009 和 ML-FG-001~011 |
| marketplace 生态发现和交易履约 | peripheral / marketplace | 只保留分发语义或 context ref,不做交易 truth |
| 高级 ViewProfile / AIPolicy override | peripheral / future | P0 只做定义主题和安全引用,不做复杂匹配 / override engine |
| Qualification / CapabilityDefinition 独立核心 | unresolved / watch | 未回写 `00/01/02/03` 前不得进入 P0 |
| PostgreSQL / object storage / concrete bus / real external service | P1/P2 adapter or ADR | P0 使用 product-neutral fake/controlled/disabled/unavailable seam |
| production-like capacity / hard SLO | future / selected-run | P0 只产出 sample/trend,无正式 hard SLO 时不得阻断 |
| 旧 MethodContent / publish / snapshot / outbox / fingerprint | historical material | 不作为命名、phase、commit、test 或 evidence source |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“实施目标表”“实施范围表”“非范围表”和“P1 / P2 防误入表”小节,了解实施目标与范围如何收敛。

正式 `07-实施计划.md` §2 后续应回填:

本轮实施目标是把 `L3-method-library` 落地为可编译、可测试、可验收的方法资产定义 truth center。实施范围覆盖方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织的有界能力,并以 FR-ML-001~009、BR-ML-001~022、NFR-ML-001~016、`TC-ML-*`、`EV-ML-*`、ML-FG、ML-RL、ML-SYNC 和 VETO-ML 为验证和验收边界。

本轮必须让 `03-详细设计.md` 中的对象、port、protocol、flow、state、transaction、error、config、observability 和 test cut 能够按 phase / commit boundary 分批落地。58 Command、57 Query、4 Inbound Consumer、34 Outbound Event / sender 和 8 Operations Job 不在本章拆分;它们由后续 Step 5 / Step 6 按可验证增量和提交边界收敛。

FR-ML-E-001~004、MethodPlugin / MethodConfiguration 完整产品能力、marketplace 交易履约、高级 ViewProfile / AIPolicy override、Qualification / CapabilityDefinition 独立核心、真实产品绑定、production-like capacity、部署运维 runbook、真实验收 verdict 和旧 MethodContent / publish / snapshot / outbox / fingerprint 主线不进入 P0 core 前置。若后续需要纳入,必须先回写对应设计真相源并重新通过 boundary 复核。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| FR-ML-E-001~004 是否在本轮只保留接口 shell / disabled seam | 影响 Step 4 / Step 6 | 先按 peripheral / residual,后续 Step 再细化 |
| 58 Command / 57 Query 是否全部进入同一 release line,还是分 P0 core subset 与 later subset | 影响 Step 5 / Step 6 | Step 6 按 boundary 复核,不得在 Step 2 强拆 |
| Qualification / CapabilityDefinition 是否需要独立核心闭口 | 影响 `00/01/02/03` 回写 | 当前不得进入 P0 |
| 目标实现仓已有代码是否与 current `00`~`06` 主线冲突 | 影响 Step 3 / Step 4 | Step 3 检查实现仓状态,不在 Step 2 裁决 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施目标已从 current `00`~`06` 推导 | 通过 | 不继承旧 `07` 主线 |
| P0 core / peripheral / future 边界已分层 | 通过 | FR-ML-001~009 为 core,FR-ML-E-001~004 有界后置 |
| 非范围已明确 | 通过 | 相邻仓运行 truth、产品绑定、真实 verdict 和旧机制均排除 |
| 未拆 phase / commit boundary | 通过 | 留给 Step 5 / Step 6 |
| 可进入 R2.2 / Step 3 | 通过 | 用户已确认,允许进入 Step 3 |

## 11. R2.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 2 实施目标、范围、非范围、P0 core / peripheral / future 分层和旧 `07` 范围隔离口径 |
| 后续动作 | 进入 Step 3 `R3.1 prerequisites and reading:先思考` |
