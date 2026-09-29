# Step 1. 确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 正式回填：`05-测试方案.md` §1
> 日期：2026-09-13
> 状态：`completed / pass_with_upstream_blockers / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 固定正式 05 的权威输入、不再回答/必须回答事项和缺口测试姿态 |
| 前置 | 正式 00～04 已停审；用户连续授权完成全部 05 |
| 输出 | 上游输入映射、historical pollution 诊断、blocker 转译、正式 §1 回填草稿 |
| gate_status | `completed / pass_with_upstream_blockers` |
| gate_reason | 输入清单、边界与缺口姿态已可判定；缺口阻塞正向证明但不阻塞测试设计 |
| next_allowed_action | 创建并完成 Step 2 |
| source_files | 正式 00～04、03 Step 16、04 Step 12/14/15、测试 SOP/规范、通用标准、三份 L1 测试样本 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 回读正式输入 | §2 输入表 | done | 00～04 与关键 calibration 可定位 |
| 回答 SOP 问题 | §3 | done | 五问全部有依据 |
| 旧材料后置诊断 | §4 | done | 旧对象/阈值/成功口径不进入新真相 |
| 输入取舍 | §5 | done | 06 historical、blocker 与 fake 上限明确 |
| 结构化映射 | §6 | done | 来源→测试输入→正式章完整 |
| 复杂度判断 | §7 | done | 本 Step 无需拆附录；按输入族分表 |
| 回填与自检 | §8～10 | done | 不私补 03/04，允许 Step 2 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 使用 |
|---|---|---|
| `00-需求文档.md` | formal | A1～A9、F-AR-001～009、BR-AR-001～012、NFR、验收方向与 VETO |
| `01-架构设计.md` | formal | U1～U6、source authority、依赖裁剪、ADR、外部 seam 和风险 |
| `02-概要设计.md` | formal | 6 CP、26 对象、30 入口、处理流、状态/异常和配置影响 |
| `03-详细设计.md` | formal | 6 crates、对象/DTO/port/flow/18 状态、UoW、错误、幂等、观测、测试入口 |
| `03_ddd_step_16_test_cuts.md` | completed | 模块/协议/状态/一致性/恢复/配置/观测的最小验证入口 |
| `04-配置设计.md` | formal | 12 域/55 P0 key、profile、strict source、builder、failure/redaction 与 05 handoff |
| 旧 `05-测试方案.md` | historical | 只识别污染，不继承编号、对象或阈值 |
| 旧 `06-验收标准.md` | historical | 只提示验收关注方向；不能反向定义 AC/EV/VETO |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 承接哪些需求、规则和非功能？ | 全部 F-AR-001～009、BR-AR-001～012、A1～A9、source-authority、严格未知/fail-closed、只读、安全、幂等/一致性、可追溯和进度可见性；无来源性能数值只验证有界/不静默 | 正式 00 §7/9/10/13/14 |
| 哪些概要/详细章节直接影响测试对象？ | 02 §5～10；03 §4～15，尤其 26 对象、8 services、30/32 协议面、18 状态、UoW/read-set、错误/恢复、幂等、config/observability 和 Step 16 | 正式 02/03 与 03 Step 16 |
| 哪些验收项需要测试证据？ | 请求/采集/闭包/验证/存储/恢复主线、多轴不传播、owner/source 权限边界、Query 零写、未知与重复副作用、配置/依赖/redaction；后续 06 再给正式 AC/VETO 编号和裁决 | 正式 00 §14；测试规范 |
| 哪些内容不得重新定义？ | 需求/对象/字段/状态/错误/port/配置 key 与优先级、owner authority、外部 schema/provider/算法/密钥/保留期、transport/部署、验收 verdict | 正式 03/04；真相源标准 |
| 哪些上游缺口阻塞测试？ | 12 上游 blocker 与 6 本地 pending 阻塞对应 positive integration/durable/continuation/readiness；不阻塞本地 contract、negative、fail-closed 和 evidence limitation 设计 | 正式 03 §17、04 §14 |

## 4. 当前文档与 historical material 诊断

| 旧内容 | 冲突 / 污染 | 本轮处置 |
|---|---|---|
| `ArchivedSnapshot`、`ArchiveRecord`、cold index/timeline/RCA 等旧对象主线 | 不在正式 26 对象与 30 入口分母，部分属于 owner/observability/product 能力 | 删除，不映射为新 TC |
| 本地 RetentionClass/LegalHold/PurgeEligibility | 侵入 governance authority | 改为正式 decision seam 的 negative/blocked 测试 |
| 固定 digest 与 custody 成功 | `AR-UP-004` 未闭合 | 只测 `Unknown/Blocked/IntegrityFailed` 和不造 digest；正向 blocked |
| hot/warm/cold 与固定 provider 假设 | `AR-UP-005` 未闭合 | 只测 typed tier/location/effect posture；不选供应商 |
| `<3s`、100%、固定 SLA | 无 workload/measurement authority | 删除；使用有界、显式 unavailable/partial 和未来 baseline gate |
| 14 个 `TC-001` 弱断言 | 名称、状态、协议均过期且证据路径未闭合 | 全部废弃；Step 5/6 重新登记稳定 TC/EV |
| `[待定: CI artifacts]` | 违反固定 artifact/report 根目录 | Step 9/13 采用规范固定路径与机器 schema |
| 旧 06 的验收语义 | 正式 06 尚未重建 | 只记 `pending_06`，不提前伪造 AC 或 verdict |

## 5. 改动前后对比与测试设计取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 测试主线 | snapshot/index/retention/review 旧领域模型 | request/source/manifest/assessment/storage/lifecycle/restore/handoff 正式主线 | 跟随正式 00～04 |
| 分母 | 无可审计分母 | 6/26/8/7/30/32/18/8/3-blocked 固定 | 防止孤儿契约 |
| 外部 positive | fake 即成功 | positive lane 保持 blocked，fake 只测 mapping/失败分类 | 不伪造 authority/readiness |
| Query | cold query 可能回源 | 五 Query strict no-write、current disclosure、cursor fail-closed | 正式 03 真相 |
| 证据 | 日志/路径占位 | fixed run raw→report→EV；当前全部 planned/not_run | 证据真实性标准 |

| 议题 | 备选 | 结论 |
|---|---|---|
| 旧 06 是否作为权威输入 | 直接反推 AC；仅方向输入 | 仅方向输入，正式 AC 留 06 |
| blocker 是否删除 P0 positive | 删除；保留 required-but-blocked | 保留 required-but-blocked，纳入退出/VETO |
| synthetic fake 是否能形成正式 EV | 可以；只能形成本地契约证据候选 | 只能证明本地语义，不关闭外部 blocker |
| 测试是否回补 03/04 | 私补；发现缺口后回流 | 不私补；新增缺口必须回流 owner/正式设计 |

## 6. 结构化中间产物

### 6.1 上游输入映射

| 来源文档 | 测试输入 | 正式回填 |
|---|---|---|
| `00-需求文档.md` | A1～A9、F/BR/NFR、source authority、验收方向、blocker | §1/2/5/10/12/14 |
| `01-架构设计.md` | U1～U6、ADR、依赖类型、所有权与一致性 | §1/3/4/8/10/14 |
| `02-概要设计.md` | CP、对象轮廓、协议、flows、状态、异常 | §1/3/5/6 |
| `03-详细设计.md` | exact 对象/协议/状态/错误/UoW/幂等/config/observability | §1/3～7/10～14 |
| `04-配置设计.md` | 12 域/55 key、source/profile/builder/failure/redaction | §1/7～10/12/14 |
| historical `06` | 验收方向线索 | §1；正式 AC 留后续 06 |

### 6.2 不再回答与必须回答

| 不再回答 | 必须回答 |
|---|---|
| Archive 拥有什么、对象/字段/状态怎么定义 | 如何验证 26 对象、18 状态和多轴不传播 |
| 各 owner/治理/存储/安全的正式权责 | 如何用 seam/negative/blocked lane 验证不越权 |
| 7 port family、30/32 protocol surface 的 callable 定义 | 如何按层测试 flow、UoW、duplicate、unknown 和 safe mapping |
| 12 配置域/55 key 的类型、来源和优先级 | 如何覆盖 missing/invalid/conflict/assembly/fake/redaction |
| provider、算法、阈值、保留期、部署选择 | 缺失时如何 fail-closed，何时阻断 entry/exit/evidence |
| 最终验收 verdict 和 risk acceptance | 未来 raw/report/EV 如何供 06 裁决 |

### 6.3 缺口转译矩阵

| 缺口族 | blocked positive | 可设计的本地验证 | 证据/退出上限 |
|---|---|---|---|
| `AR-UP-001/006~008` source/material | owner snapshot/export/closure positive | source class/authority、partial/stale/missing/conflict、Auxiliary 不补 canonical | 不能声称完整跨域 Bundle |
| `AR-UP-002/003` lifecycle/governance | archived/restored/delete/hold positive | decision 缺失/过期/冲突/hold→Blocked；无 owner 写 | 不能声称 lifecycle/处置成功 |
| `AR-UP-004/005` integrity/storage | verified/durable/retrievable positive | Unknown/Unsupported/IntegrityFailed、ACK≠commit、exact probe | 不能声称真实 digest/commit/RTO |
| `AR-UP-009` restore receivers | per-owner commit/compensation positive | owner isolation、mapping drift、partial/commit unknown、no direct DB write | 不能声称 restored |
| `AR-ARCH-001` SDK direction | SDK compile conformance | dependency static negative | 不允许 Archive server→SDK compile |
| `AR-HLD-Q-001` outbound | event publish/delivery | outbox/publisher/topic/delivery absence | 不能产生 outbound EV |
| `AR-HLD-Q-002` workload | 数值性能/容量/SLO | L/L+1、bounded work、visible partial/blocked | 不给数字阈值/readiness |
| `AR-03-LOCAL-001~005` codec/cursor/store/config/telemetry | durable/restart/positive binding | missing binding fail-closed、fake/durable parity contract、no-leak/non-interference | 对应 suite 必须 blocked 直到实现/合同证据 |
| `AR-03-LOCAL-006` implementation start | 所有真实运行 | 仅设计完整性/静态审计 | 0 run/artifact/report/EV/verdict |

## 7. 复杂度判断

本 Step 输入多但判断单一：固定 authority 与测试完成上限。无需拆附录；采用输入、污染、缺口三张矩阵避免将后续测试对象、用例、环境和证据提前合并。本 Step 不注册 TC/EV。

## 8. 回填草稿

正式 §1 应说明：正式 00～04 是唯一项目内输入；03 §15/Step16 是最小测试切口；04 §12 是配置测试直接输入；旧 05/06/README/draft 仅为历史材料；本文只定义如何验证，不重新定义设计或验收裁决。12 个上游 blocker与6个本地 pending 不妨碍本地/负向测试设计，但阻塞相应正向、durable、外部集成、正式证据和退出。

## 9. 对上游设计的影响与待确认事项

| 判断 | 结论 |
|---|---|
| 是否发现新的 03/04 schema/port/state/config 缺口 | 否；当前只转译既有边界 |
| 是否新增 owning-project blocker | 否 |
| 持续待确认 | `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`、`AR-03-LOCAL-001~006` 全部保留 |
| formal 05 是否可回填 | 否；仅 Step 15 可装配 |

## 10. 进入下一步条件

- [x] 输入文档、优先级与历史材料身份明确。
- [x] 测试方案回答/不回答边界明确。
- [x] blocker 已转译为 positive blocked、negative、evidence limitation 和退出输入。
- [x] 未新增旧状态、对象、阈值、provider 或成功事实。
- [x] 项目级、flow、Step 级状态可同步。
- [x] 按连续授权允许进入 Step 2。
