# L0-sdk 07 实施计划 Step 2: 实施目标、范围和非范围

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 2 中间产物。
> 本步明确 L0-sdk 本轮实施要交付什么、不交付什么,以及哪些需求、设计和验收项属于本轮覆盖范围。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确实施目标、范围和非范围 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §2 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承实施输入基线和非阻塞风险 |
| `00-需求文档.md` §6 / §9 / §14 | 已完成 | 提取核心闭环、F-001~F-010、验收方向和 P1/P2 非范围 |
| `01-架构设计.md` §3 / §4 / §10 / §14 | 已完成 | 提取 official client access layer、架构非目标和演进边界 |
| `02-概要设计.md` §4~§12 | 已完成 | 提取代码主体框架、主要组成部分、对象、接口、流程和状态轮廓 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取实现单元、模块、对象、API / Event / Job、状态、事务、配置和测试切口 |
| `05-测试方案.md` §2 / §5 / §9 / §13 / §14 | 已完成 | 提取测试目标、用例、gate、证据和残余风险 |
| `06-验收标准.md` §2 / §5~§14 | 已完成 | 提取验收范围、AC、VETO、缺陷分级和风险接受规则 |

---

## 3. SOP 问题回答

### 3.1 本轮实施的最小可交付结果是什么?

本轮最小可交付结果是一个可创建、可构建、可测试、可验收的 `/home/aris/Projects/quantalithos-sdk` 多语言 SDK 仓,用于证明 L0-sdk P0 official client access layer 闭环成立。

最小结果包括:

- Rust workspace 和 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/client`、`crates/cli`、`crates/jobs`。
- `packages/python` 和 `packages/typescript` 的官方 SDK package surface 骨架、示例和 smoke 可验证入口。
- 通过本地 path dependency 消费 `core-contracts` 和 `bus-contracts`,不复制 core / bus truth。
- 最小 formal API / fake / fixture boundary 和 bus event boundary,证明 service capability 和 event client 可运行。
- package candidate、language artifact metadata、verification evidence、docs example、compatibility / deprecated 记录和 reports / artifacts 证据路径。
- JSON config、profile、loader / validator / runtime builder、forbidden toggle 和 redaction / credential fail-fast 门禁。

### 3.2 哪些需求编号必须覆盖?

必须覆盖 `F-001`~`F-010`。这些功能共同构成 L0-sdk 的 P0 official SDK 闭环。

| 需求编号 | 功能能力 | 本轮实施口径 |
|---|---|---|
| F-001 | 共享契约承接与语言产物一致 | 落地 core / bus contract consumption、derived view 和 freshness |
| F-002 | 三语言官方客户端概念一致 | 落地 semantic baseline、concept map 和三语言 package surface |
| F-003 | 平台能力最小接入 | 落地 formal / fake / fixture boundary 和 service client view |
| F-004 | 事件语义客户端封装 | 落地 bus event client view、publish boundary 和 event semantic mapping |
| F-005 | 错误映射与 trace 传播一致 | 落地 error envelope、trace context、diagnostic ref 和 cross-language error surface |
| F-006 | redaction 与凭据材料保护 | 落地 boundary guard、redaction policy、credential ref-only 和 forbidden body scan |
| F-007 | 本地 package candidate 与安装验证 | 落地 candidate 状态机、artifact metadata 和 local install / build gate |
| F-008 | quickstart、docstring 与示例可运行 | 落地 docs example、quickstart runner 和 docs evidence |
| F-009 | 跨语言 smoke 与一致性验证 | 落地 smoke runner、semantic comparison 和 verification evidence |
| F-010 | 版本兼容、deprecated 与迁移治理 | 落地 compatibility decision、deprecated lifecycle 和 migration guide ref |

### 3.3 哪些详细设计章节必须落地?

`03-详细设计.md` 的 P0 实现主链必须落地。实施计划不得重新设计这些章节,只能把它们转为阶段、任务、提交边界和门禁。

| 详细设计章节 | 必须落地的内容 |
|---|---|
| §4 实现单元、文件布局与命名 | 目标仓、workspace、crate、Python / TypeScript package、scripts、artifacts、reports 目录 |
| §5 模块契约 | `contracts`、`domain_*`、`application_*`、`infra_adapters`、client、cli、jobs、language package surface |
| §6 对象实现契约 | semantic、upstream view、service client、event client、boundary policy、candidate、evidence、compatibility 对象 |
| §7 Trait / Port / Adapter | repository、source、boundary、runner、artifact、outbox、projection、config 和 package builder port |
| §8 协议契约 | Command、Query、Event、Job、Receipt、Error DTO |
| §9 函数级处理流 | refresh、baseline、service call、event publish、candidate、docs、smoke、compatibility 等主线流 |
| §10 状态机 | freshness、support、candidate、evidence、redaction、compatibility、deprecated 状态 |
| §11~§13 事务、错误、幂等和并发 | UoW、outbox、projection、idempotency、expected version 和 recovery |
| §14 配置引用 | `SdkRuntimeConfig`、profile、dependency binding、forbidden config |
| §15 观测与审计 | audit、trace、diagnostic、evidence、report 和 redaction |
| §16 测试切口 | P0 单元、service、integration、contract、smoke 和 candidate 验证切口 |

### 3.4 哪些验收项必须在本轮可判定?

本轮必须让 `06-验收标准.md` 的 P0 门禁可判定。实施计划不要求实际验收已经通过,但必须让实现者知道每个阶段如何产生对应证据。

| 验收门禁族 | 本轮可判定内容 |
|---|---|
| `AC-FUNC-001`~`AC-FUNC-010` | F-001~F-010 功能闭环 |
| `AC-BOUND-*` | SDK truth、snapshot / ref、forbidden body、query / projection / report 边界 |
| `AC-RED-*` | core / bus truth、服务端 truth、auth / governance、raw secret、fake stable、candidate gate 红线 |
| `AC-IF-*` | Command、Query、Rust client、Inbound Event、Outbound Event、Job、core / bus contracts、package consumers |
| `AC-STATE-*` / `AC-TX-*` / `AC-IDEM-*` / `AC-CONC-*` | 状态机、事务、幂等、并发和 artifact metadata 一致性 |
| `AC-NFR-*` | 性能测量点、安全、配置保护、可用性、恢复、兼容、跨语言一致和观测 |
| `AC-EV-*` | evidence index、gate results、redaction check、raw artifact、handoff、veto 和 risk acceptance |
| `VETO-SDK-*` | 一票否决项必须可检查且不可风险接受 |

### 3.5 哪些能力明确不在本轮实施?

以下能力不进入本轮 P0 实施主线。实施计划只能保留接缝、风险记录或后续专项入口,不能把它们自然膨胀成 P0 任务。

| 非范围能力 | 当前口径 | 后续归属 |
|---|---|---|
| public registry publish | 当前只交付 local package candidate | release / operations 专项 |
| production endpoint 全量覆盖 | 当前只证明最小 formal / fake / fixture boundary | service capability owner 后续裁剪 |
| real credential provider | 当前只证明 credential ref-only 和 raw secret forbidden | security / operations 专项 |
| remote config / hot reload / admin override | 当前启用必须 fail-fast / unsupported | configuration P1/P2 设计 |
| MCP / REST / GraphQL / REPL / offline cache | 当前只确认缺失不影响核心闭环 | ecosystem enhancement |
| full L1/L2/L3/L4 client coverage | 当前只证明最小接入 | 各服务 API stable 后逐步纳入 |
| production deployment / operations runbook | 不由实施计划替代部署运维手册 | 后续部署与运维文档 |

### 3.6 是否存在 P1 / P2 能力容易被误做进 P0?

存在,需要在实施计划中反复防止范围膨胀。

| 易膨胀能力 | 容易误做的方式 | 本轮限制 |
|---|---|---|
| public registry | 把 local candidate 完成等同于 crates.io / PyPI / npm 发布 | 只做 local candidate、artifact metadata 和 install / smoke |
| production endpoint | 为了 smoke 直接实现真实服务 client 全覆盖 | 只做 minimal formal / fake / fixture boundary |
| real credential provider | 为了方便调试接入 raw token / secret | 只允许 credential ref,raw secret 必须拒绝 |
| bus runtime | SDK 自己实现 delivery / retry / DLQ / replay truth | 只做 event semantic client 和 boundary ref |
| service server facade | SDK 保存业务状态或聚合服务端规则 | 只返回 ref-only result / diagnostic ref |
| MCP / REST / GraphQL / REPL | 把生态入口当作官方 SDK P0 体验 | 作为后续增强,不影响 P0 判定 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| `07` 还没有范围定义 | 实施者只能从 `00~06` 自行推断 | 容易把 P1/P2 能力做进 P0 | 本步明确 P0 实施范围和非范围 |
| P0 和发布阶段容易混淆 | package candidate 可能被误读为 public registry 发布 | 实施任务膨胀 | 本步固定 local candidate 口径 |
| 三语言范围容易过大 | Python / TypeScript 可能被要求完整生态成熟度 | 工具链和包发布提前压入 P0 | 本步要求 P0 package surface + smoke,不要求 public registry |
| 服务能力接入容易滑向全量 client coverage | fake / fixture 被误读为不足 | 实施依赖真实服务 API 稳定度 | 本步只要求最小 formal / fake / fixture boundary |
| 证据和报告可能被后置 | 实施者可能最后再补 reports | 验收不可追溯 | 本步把 evidence / reports 纳入最小交付 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 最小交付 | 只有 `00~06` 分散描述 | 明确为可构建、可测试、可验收的 `quantalithos-sdk` 多语言 SDK 仓 | 可执行 |
| 需求覆盖 | F-001~F-010 分散在需求和验收 | 明确全部为本轮 P0 覆盖 | 可追溯 |
| 详细设计承接 | 容易只看 crate / object | 明确 §4~§16 都是实施计划输入 | 防止漏掉配置、观测和测试 |
| 非范围 | 散落在需求、架构、测试和验收 | 集中列出 public registry、全量 endpoint、real credential、生态入口等 | 防止范围膨胀 |
| 验收门禁 | 可能在最后统一看 | 明确 AC / VETO 必须在阶段计划中可判定 | 嵌入门禁 |

---

## 6. 实施设计取舍

### 6.1 是否把 public registry 发布纳入 P0

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入 P0 | 发布体验完整 | 依赖外部 registry、凭据和 release ops,会掩盖 SDK 基础闭环 | 不采用 |
| B. P0 只做 local package candidate,public registry 后续专项 | 可快速证明 SDK 可安装可验证 | 需要后续 release 专项 | 采用 |
| C. 完全不做 package candidate | 最简单 | F-007 / F-009 / AC-FUNC-007 不可判定 | 不采用 |

### 6.2 是否要求全量服务 client coverage

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 覆盖所有 L1/L2/L3/L4 client | 能力面完整 | 依赖服务 API 全部稳定,范围过大 | 不采用 |
| B. P0 只做最小 formal / fake / fixture boundary | 支撑最小接入闭环 | 后续需逐服务扩展 | 采用 |
| C. 完全不做服务能力接入 | 降低依赖 | F-003 不可验证 | 不采用 |

### 6.3 是否把 Python / TypeScript 降为 P1

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 降为 P1 | Rust 实施更快 | 破坏三语言官方 SDK 闭环和 VETO-SDK-003 | 不采用 |
| B. P0 必须覆盖 Rust / Python / TypeScript package surface 和 smoke | 符合需求 | 需要工具链前置和候选验证 | 采用 |
| C. 只写文档不做 smoke | 低成本 | `EV-SDK-SMOKE-001` 不可成立 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 实施目标表

| 目标 ID | 实施目标 | 来源 | 完成判定 |
|---|---|---|---|
| IMPL-SDK-GOAL-001 | 建立可构建的 `quantalithos-sdk` 多语言仓 | `03` §4 / `04` §2 | workspace、crate、package、scripts、reports 目录就绪 |
| IMPL-SDK-GOAL-002 | 稳定消费 core / bus contracts,不复制 truth | F-001 / F-004 / AC-IF-007 / AC-IF-008 | path dependency 可编译,dependency snapshot 可审计 |
| IMPL-SDK-GOAL-003 | 落地三语言 official SDK semantic surface | F-002 / F-009 / VETO-SDK-003 | Rust / Python / TypeScript surface 和 smoke 可验证 |
| IMPL-SDK-GOAL-004 | 建立最小 service / event boundary 接入 | F-003 / F-004 / AC-FUNC-003 / AC-FUNC-004 | formal / fake / fixture boundary 和 event client 可运行 |
| IMPL-SDK-GOAL-005 | 建立 candidate、docs、evidence、compatibility 主闭环 | F-007~F-010 | local candidate、docs runner、smoke、compatibility evidence 可生成 |
| IMPL-SDK-GOAL-006 | 建立安全、配置、证据和验收报告门禁 | F-005 / F-006 / AC-NFR / AC-EV | redaction、config validation、reports / artifacts 和 acceptance handoff 可生成 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 功能能力 | core / bus 契约承接 | F-001 / AC-FUNC-001 / AC-IF-007 / AC-IF-008 | 是 | 通过 contracts path dependency 和 derived view 落地 |
| 功能能力 | 三语言 official SDK surface | F-002 / F-009 / AC-FUNC-002 / AC-FUNC-009 | 是 | Rust / Python / TypeScript 均为 P0 |
| 功能能力 | 最小 service capability 接入 | F-003 / AC-FUNC-003 | 是 | formal / fake / fixture boundary,不做全量服务覆盖 |
| 功能能力 | bus event client semantic | F-004 / AC-FUNC-004 | 是 | 不实现 bus runtime truth |
| 功能能力 | error / trace / redaction / credential guard | F-005 / F-006 / AC-FUNC-005 / AC-FUNC-006 | 是 | forbidden body 泄露为 VETO |
| 功能能力 | local package candidate | F-007 / AC-FUNC-007 | 是 | 不等同 public registry |
| 功能能力 | docs / quickstart / examples | F-008 / AC-FUNC-008 | 是 | 必须可运行且不泄露 forbidden body |
| 功能能力 | compatibility / deprecated / migration | F-010 / AC-FUNC-010 | 是 | breaking / migration / deprecated 可追溯 |
| 实现结构 | Rust workspace 和 crates | `03` §4 / §5 | 是 | `contracts`、`domain`、`application`、`infra`、`client`、`cli`、`jobs` |
| 实现结构 | Python / TypeScript packages | `03` §4 / §5 | 是 | package surface、docs / smoke 可引用 |
| 配置 | JSON config、profile、runtime builder | `04` / AC-NFR-004 | 是 | forbidden toggle fail-fast / fail-closed |
| 证据 | scripts、artifacts、reports、acceptance handoff | `05` §13 / `06` §10 | 是 | 不使用 `latest`,路径不带 `<project>` |

### 7.3 非范围表

| 能力 | 当前状态 | 当前实施结论 | 后续承接 |
|---|---|---|---|
| public registry publish | P1/P2 | 不实施,只保证 local candidate | release / operations 专项 |
| production endpoint 全量覆盖 | P1/P2 | 不实施,只保证最小 formal / fake / fixture boundary | service capability owner |
| real credential provider | P1/P2 | 不实施,只保证 credential ref-only 和 raw secret forbidden | security / operations 专项 |
| remote config / hot reload / admin override | P2 | 不实施,启用必须 fail-fast / unsupported | configuration P1/P2 |
| MCP / REST / GraphQL / REPL / offline cache | P2 | 不实施,缺失不得阻塞 P0 | ecosystem enhancement |
| full L1/L2/L3/L4 client coverage | P1/P2 | 不实施,不作为 P0 完成判定 | 各服务 API stable 后裁剪 |
| production deployment / operations runbook | 非 07 范围 | 不实施,不替代部署运维文档 | 后续部署与运维 |

### 7.4 范围边界图

图类型: 实施范围边界图

图标题: L0-sdk P0 实施范围与后置能力边界

```text
P0 implementation
  |
  +-- core / bus contracts consumption
  +-- Rust / Python / TypeScript official surface
  +-- minimal formal / fake / fixture boundary
  +-- bus event client semantic
  +-- local package candidate + docs + smoke
  +-- error / trace / redaction / credential guard
  +-- compatibility / deprecated / evidence / reports
  |
  X public registry publish
  X production endpoint full coverage
  X real credential provider
  X remote config / hot reload
  X MCP / REST / GraphQL / REPL / offline cache
  X full L1/L2/L3/L4 client coverage
```

关键说明:

- 图中的 `X` 表示本轮不实施,但可以作为后续专项或风险接受项记录。
- public registry 不等于 local package candidate。
- fake / fixture 只证明最小接入,不得支撑 production coverage。
- 三语言 surface 是 P0,不能把 Python / TypeScript 后移为 P1。

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §2。

```markdown
## 2. 实施目标与范围

> 校准来源：
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”“非范围表”和“范围边界图”小节，了解本轮实施为什么聚焦官方三语言 SDK 接入闭环，而不是公共发布、全量服务覆盖或生态入口。

本轮最小可交付结果是一个可创建、可构建、可测试、可验收的 `/home/aris/Projects/quantalithos-sdk` 多语言 SDK 仓,用于证明 L0-sdk P0 official client access layer 闭环成立。

本轮必须覆盖 F-001~F-010,并使 `AC-FUNC-*`、`AC-BOUND-*`、`AC-RED-*`、`AC-IF-*`、`AC-STATE-*`、`AC-NFR-*`、`AC-EV-*` 和 `VETO-SDK-*` 具备可判定证据。

本轮明确不实施 public registry publish、production endpoint 全量覆盖、real credential provider、remote config / hot reload / admin override、MCP / REST / GraphQL / REPL / offline cache、full L1/L2/L3/L4 client coverage 和 production deployment / operations runbook。这些能力不得自然膨胀为 P0 实施任务。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| public registry 是否进入 P0 | A. 进入;B. 不进入,只做 local candidate;C. 完全不做 candidate | 采用 B |
| 全量服务 client coverage 是否进入 P0 | A. 进入;B. 不进入,只做最小 boundary;C. 完全不做服务接入 | 采用 B |
| Python / TypeScript 是否降级到 P1 | A. 降级;B. 不降级,三语言均 P0;C. 只写文档 | 采用 B |
| 三语言工具链未固定是否阻塞范围确认 | A. 阻塞;B. 不阻塞,进入 Step 3 / Step 8 / Step 9 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮目标已明确 | 已满足 |
| 实施范围已追溯到上游编号 | 已满足 |
| 非范围已显式写出 | 已满足 |
| P1/P2 容易膨胀的能力已标记 | 已满足 |
| 已确认不会在实施阶段自然膨胀 | 已满足 |

结论: 可以进入 Step 3,收稳前置条件与阅读清单。
