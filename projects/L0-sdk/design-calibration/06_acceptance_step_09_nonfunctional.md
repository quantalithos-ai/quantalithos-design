# L0-sdk 06 验收标准 Step 9: 非功能验收门禁

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 9 中间产物。
> 本步定义性能、安全、可用性、兼容性、恢复、配置、跨语言一致性和可观测性非功能验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义非功能验收门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §9 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | 已完成 | 提取性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性和一票否决方向 |
| `01-架构设计.md` §13 | 已完成 | 提取安全边界、审计与可追溯、可观测性、恢复、可用性、性能和配置横切约束 |
| `03-详细设计.md` §10~§15 | 已完成 | 提取事务、恢复、幂等、错误、观测和最小测试切口 |
| `04-配置设计.md` §8 / §11 / §12 | 已完成 | 提取 raw secret、forbidden toggle、fail-fast / fail-closed 和配置不得绕开门禁 |
| `05-测试方案.md` §10 / §13 | 已完成 | 提取 `SPECIAL-SDK-*` 专项、`EV-SDK-*` 证据和 reports / artifacts 路径 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承数据边界和架构红线失败口径 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已确认 | 继承状态、事务、幂等和并发验收口径 |

---

## 3. SOP 问题回答

### 3.1 哪些非功能指标是 P0?

L0-sdk 的 P0 非功能验收不是传统线上服务 SLA，而是官方客户端接入层能否被三语言安全、一致、可追溯、可恢复地消费。

| 非功能维度 | P0 指标 / 要求 | 是否 P0 | 说明 |
|---|---|---|---|
| 性能 | quickstart、docs example、candidate smoke、初始化、错误映射、trace 注入和 redaction 扫描必须有测量点 | 是 | 不固定 ms 级阈值，但必须可测量 |
| 安全 | raw secret、credential value、request / response / payload body 泄露次数为 0 | 是 | 失败进入 S0 候选 |
| 安全边界 | SDK 不执行 auth / governance truth，不保存服务端 / runtime / UI truth | 是 | 承接 Step 6 红线 |
| 配置保护 | 配置不得关闭 redaction、credential protection、fake marker、evidence 或 compatibility gate | 是 | invalid / forbidden config 必须 fail-fast / fail-closed |
| 可用性 | public registry、完整 MCP、REST / GraphQL、REPL 缺失不阻断 P0 | 是 | P0 以 local candidate、fake / fixture 和 docs / smoke 裁决 |
| 最小接入 | 必须有稳定服务边界或 fake / fixture endpoint 支撑最小可验证接入 | 是 | 没有验证目标时不通过 |
| 恢复能力 | source / runner / boundary / publisher / projection 故障可显式失败并重跑 | 是 | 不得伪装成功或补造 truth |
| 兼容演进 | breaking / deprecated 必须有 compatibility decision、migration ref 或 deprecated record | 是 | 防止三语言兼容状态漂移 |
| 跨语言一致性 | Rust / Python / TypeScript 核心概念、错误、trace、redaction 语义一致 | 是 | 语言习惯可不同，平台含义不能漂移 |
| 可观测性 | trace、error、diagnostic、metrics、audit 可定位且不含 forbidden body | 是 | 详细证据门禁在 Step 10 展开 |

### 3.2 阈值来自需求、设计还是运行基线?

| 阈值 / 通过条件 | 来源 | 当前是否有数值阈值 |
|---|---|---|
| 敏感值泄露次数 = 0 | `00` §13、`04` §8、`05` §10 | 有，固定为 0 |
| SDK 不成为最小接入路径主要性能瓶颈 | `00` §13、`01` §13 | 无具体 ms，要求测量点和失败归因 |
| public registry 不可用不阻断 P0 | `00` §13、`05` §10 | 有，registry unavailable 场景必须通过 local path |
| 最小验证目标必须存在 | `00` §13、`05` §6 / §10 | 有，缺目标不得通过 |
| 三语言核心概念不得漂移 | `00` §13、`05` §10 | 有，semantic compare / smoke 不允许 drift |
| forbidden config 必须 fail-fast / fail-closed | `04` §11 / §12、`05` §10 | 有，runtime 不得构造 |
| 恢复后不得复制上游 truth 或反写真相 | `03` §10~§12、`05` §10 | 有，truth version / boundary evidence 断言 |
| trace / error 可定位且不泄露正文 | `00` §13、`03` §14 | 有，必须定位并通过 forbidden field scan |
| 固定性能微基准 | `00` §15 待确认 | 无，不能在验收中发明 |

### 3.3 哪些专项未覆盖,是否影响验收?

| 未覆盖 / 非 P0 专项 | 当前口径 | 是否影响 P0 |
|---|---|---|
| public registry publish | 当前只验 local candidate、local install、docs / smoke | 不影响 P0；进入风险接受或后续 release 专项 |
| real credential provider / KMS / Vault | 当前只验 ref-only、raw secret rejected 和 synthetic marker | 不影响 P0；真实 provider 归安全 / 运维专项 |
| production endpoint 全量覆盖 | 当前只验 formal / fake / fixture 最小接入 | 不影响 P0；全量覆盖依赖服务能力稳定 |
| remote config / hot reload / admin override | 当前只验被拒绝或 unsupported | 不影响 P0；若进入主线需回上游重新设计 |
| 完整 MCP / REST / GraphQL / REPL / offline cache | 当前作为外围增强 | 不影响 P0 |
| 固定性能阈值 / 包体积阈值 | 当前只要求测量点和瓶颈归因 | 不影响 P0；不得宣称已达到具体阈值 |

### 3.4 哪些非功能失败会阻断发布?

这里的“发布”指 P0 验收通过、candidate 进入可承接状态或后续发布准备，不等于 public registry 发布。

| 失败类型 | 结论口径 |
|---|---|
| raw secret、credential value、request / response / payload body 泄露 | 不通过；Step 11 默认进入 S0 一票否决 |
| SDK 执行 auth / governance truth | 不通过；Step 11 默认进入 S0 一票否决 |
| 三语言核心概念、错误、trace、redaction 语义漂移 | 不通过；严重时进入 S0 |
| fake-only 成果支撑 production supported 或 candidate `Stable` | 不通过；Step 11 默认进入 S0 |
| public registry 缺失导致 local candidate / smoke 无法裁决 | 不通过；说明 P0 路径错误依赖 P1 |
| 缺少稳定服务边界或 fake / fixture endpoint | 不通过；最小接入无法验证 |
| forbidden config 能绕过 redaction / evidence / compatibility gate | 不通过；Step 11 默认进入 S0 |
| 恢复场景伪装成功或补造 truth | 不通过；同时触发 Step 6 / Step 8 |
| compatibility / deprecated 缺 migration ref 或三语言状态不可追溯 | 不通过 |
| 性能测量点缺失 | 不通过或有条件通过需进入风险接受；不得宣称性能达标 |
| 固定微基准未定义 | 不阻断 P0，但必须列为风险，不得作为已达标结论 |

### 3.5 证据来自哪里?

| 非功能维度 | 证据来源 |
|---|---|
| 性能 | `SPECIAL-SDK-PERF-001`、`EV-SDK-PERF-001`、duration report |
| 安全 / redaction | `SPECIAL-SDK-SEC-001`、`TC-SDK-SECURITY-*`、`EV-SDK-SECURITY-001`、redaction check |
| auth / governance 边界 | `SPECIAL-SDK-SEC-002`、`EV-SDK-SECURITY-002`、DTO / doc / config scan |
| 配置保护 | `SPECIAL-SDK-CONFIG-001`、`EV-SDK-CONFIG-001` |
| 一致性 / 幂等 / 恢复 | `SPECIAL-SDK-CONSISTENCY-001`、`SPECIAL-SDK-IDEMPOTENCY-001`、`SPECIAL-SDK-RECOVERY-001` |
| 可观测性 | `SPECIAL-SDK-OBS-001`、`EV-SDK-OBS-001`，具体 evidence gate 由 Step 10 展开 |
| 可用性 | `SPECIAL-SDK-AVAIL-001`、`TC-SDK-SMOKE-004`、`EV-SDK-AVAIL-001` |
| 跨语言一致性 | `SPECIAL-SDK-LANG-001`、`TC-SDK-SMOKE-*`、`EV-SDK-SMOKE-001` |
| 兼容演进 | `TC-SDK-COMPAT-*`、`EV-SDK-COMPAT-001` |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 非功能容易被写成测试专项清单 | `05` 已有专项测试矩阵，但不等于验收结论 | 验收人员不知道失败如何裁决 | 本步把专项转换成通过 / 失败 / 结论口径 |
| 性能阈值没有固定数值 | 需求只要求测量点，不给 ms | 若验收发明阈值，会制造无来源门禁 | 本步明确不编造微基准 |
| 安全和边界红线与 Step 6 / Step 11 有交叉 | redaction、auth、fake marker 既是非功能也是红线 | 重复或漏判 | 本步定义非功能失败，Step 11 汇总一票否决 |
| 可观测性与 Step 10 有交叉 | Step 9 需要非功能口径，Step 10 需要证据门禁 | 可能重复写 evidence 细节 | 本步只定义 NFR 通过条件，Step 10 展开证据完整性 |
| P1/P2 专项容易污染 P0 | public registry、real credential、production endpoint 常被误当 P0 | 当前验收范围膨胀 | 本步明确未覆盖专项不阻断 P0，但进入风险接受 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 性能 | 泛称性能达标 | 测量点存在且不成为主要瓶颈，不发明 ms 阈值 | 有来源 |
| 安全 | 只看 redaction | 覆盖 secret、credential、body、auth / governance、fake marker、config forbidden toggle | 更完整 |
| 可用性 | 可能依赖 public registry | local candidate、fake / fixture、docs / smoke 即可裁决 P0 | 不越界 |
| 恢复 | 分散在事务 / 错误章节 | 以故障注入和重跑结果作为门禁 | 可验证 |
| 兼容 | 只看 candidate smoke | compatibility decision、migration ref、deprecated lifecycle 均进入门禁 | 可演进 |
| 证据 | 专项测试结果 | 非功能验收项绑定 `SPECIAL-SDK-*` 和 `EV-SDK-*` | 可追溯 |

---

## 6. 验收设计取舍

### 6.1 是否为性能发明固定数值阈值

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接写 ms / package size 阈值 | 裁决简单 | 没有上游来源，会制造伪门禁 | 不采用 |
| B. 使用已确认测量点 + 不成为主要瓶颈 + 风险记录 | 符合需求来源 | 无法给出硬性能承诺 | 采用 |
| C. 不验性能 | 文档短 | 需求 §13 已要求可测量 | 不采用 |

### 6.2 是否把 P1/P2 专项失败计入 P0 不通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部计入 P0 | 更严格 | public registry / real credential / production endpoint 会阻断当前闭环 | 不采用 |
| B. P0 只裁决当前默认路径，P1/P2 进入风险接受 | 范围清晰 | 后续需专项跟进 | 采用 |
| C. 完全不记录 P1/P2 | 简短 | 后续误以为已覆盖 | 不采用 |

### 6.3 是否把可观测性全部放到 Step 10

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. Step 9 不提可观测性 | 避免重复 | 非功能需求 §13 会缺门禁 |
| B. Step 9 定义可观测性非功能通过条件，Step 10 定义证据完整性 | 分工清楚 | 需要交叉引用 | 采用 |
| C. Step 9 展开全部证据清单 | 一章完整 | 与 Step 10 重复 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-NFR-001 | 性能 | quickstart、docs、candidate smoke、初始化、错误映射、trace 注入、redaction 扫描有测量点 | 不固定 ms；必须记录 duration，且 SDK 不成为失败主要耗时来源 | `SPECIAL-SDK-PERF-001`、`EV-SDK-PERF-001` | 缺测量点不得宣称性能通过；明显瓶颈不通过 |
| AC-NFR-002 | 安全 | raw secret、credential value、request / response / payload body 不进入配置、错误、日志、evidence、report | 泄露次数 = 0 | `SPECIAL-SDK-SEC-001`、`TC-SDK-SECURITY-*`、`EV-SDK-SECURITY-001` | 任一泄露不通过，Step 11 默认 S0 |
| AC-NFR-003 | 安全边界 | SDK 不执行 auth / governance truth | 相关 DTO / API / doc / config 表达数量 = 0 | `SPECIAL-SDK-SEC-002`、`EV-SDK-SECURITY-002` | 任一越界不通过，Step 11 默认 S0 |
| AC-NFR-004 | 配置保护 | forbidden toggle、raw secret、unsupported remote config / hot reload 必须 fail-fast / fail-closed | runtime 不得构造；门禁不得被关闭 | `SPECIAL-SDK-CONFIG-001`、`EV-SDK-CONFIG-001` | 配置绕过门禁不通过 |
| AC-NFR-005 | 可用性 | public registry、完整 gateway / MCP / REST / GraphQL / REPL 缺失不阻断 P0 | local candidate install / docs / smoke 仍可完成 | `SPECIAL-SDK-AVAIL-001`、`TC-SDK-SMOKE-004` | 缺 public registry 导致 P0 失败则验收不通过 |
| AC-NFR-006 | 最小接入 | 必须有稳定服务边界或 fake / fixture endpoint 支撑最小接入 | 至少一个 P0 可运行验证目标存在 | `TC-SDK-BOUNDARY-*`、`EV-SDK-BOUNDARY-001` | 无验证目标不通过 |
| AC-NFR-007 | 恢复能力 | dependency unavailable、outbox retry、projection rebuild 可恢复 | 恢复后可重跑；不得复制上游 truth 或反写真相 | `SPECIAL-SDK-RECOVERY-001`、`EV-SDK-RECOVERY-001` | 伪装成功或补造 truth 不通过 |
| AC-NFR-008 | 一致性 / 幂等 | replay、conflict、duplicate event、expected version 语义成立 | replay 返回既有结果；conflict 不覆盖旧记录 | `SPECIAL-SDK-IDEMPOTENCY-001`、`EV-SDK-IDEMPOTENCY-001` | 重复副作用或覆盖旧 truth 不通过 |
| AC-NFR-009 | 兼容演进 | compatibility decision、migration ref、deprecated lifecycle 可追溯 | breaking / requires migration 必须有正式结论和迁移引用 | `TC-SDK-COMPAT-*`、`EV-SDK-COMPAT-001` | missing migration ref 或静默移除不通过 |
| AC-NFR-010 | 跨语言一致性 | Rust / Python / TypeScript 核心概念、错误、trace、redaction 语义一致 | semantic compare / smoke 无 drift | `SPECIAL-SDK-LANG-001`、`EV-SDK-SMOKE-001` | 三语言语义漂移不通过，严重时 Step 11 S0 |
| AC-NFR-011 | 可观测性 | trace、error、diagnostic、metrics、audit 可定位且不泄露正文 | 必需材料存在；forbidden field scan 为 0 | `SPECIAL-SDK-OBS-001`、`EV-SDK-OBS-001` | 缺关键观测材料不通过或进入 Step 10 证据门禁 |

### 7.2 非功能裁决关系图

图类型: 非功能验收裁决图

图标题: L0-sdk P0 非功能门禁与风险承接

```text
P0 nonfunctional evidence
  |
  +-- performance measurements -----> AC-NFR-001
  +-- security / redaction ----------> AC-NFR-002 / AC-NFR-003
  +-- config negative cases ---------> AC-NFR-004
  +-- local availability path -------> AC-NFR-005 / AC-NFR-006
  +-- recovery / idempotency --------> AC-NFR-007 / AC-NFR-008
  +-- compatibility / language ------> AC-NFR-009 / AC-NFR-010
  +-- observability materials -------> AC-NFR-011
  |
  v
P0 acceptance decision
  |
  +-- S0 / P0 failure -> not accepted
  +-- P1 / P2 uncovered -> risk acceptance in Step 13
```

关键说明:

- Step 9 裁决非功能要求是否通过。
- Step 10 继续裁决证据、审计和报告材料是否完整。
- Step 11 汇总哪些失败是一票否决。
- Step 13 承接未覆盖 P1/P2 专项和固定性能阈值风险。

### 7.3 未覆盖专项承接表

| 专项 | 当前状态 | 当前验收结论 | 后续承接 |
|---|---|---|---|
| public registry publish | P1/P2 非范围 | 不阻断 P0；不得宣称已公共发布 | release / operations 专项 |
| real credential provider | P1/P2 非范围 | 不阻断 P0；P0 只验 ref-only 和 synthetic marker | security / operations 专项 |
| production endpoint 全量覆盖 | P1/P2 非范围 | 不阻断 P0；P0 只验最小 formal / fake / fixture | service capability owner |
| remote config / hot reload | P2 或 rejected for P0 | 当前启用必须 rejected / unsupported | configuration P1/P2 设计 |
| fixed performance threshold | 待确认 | 不阻断 P0；不得宣称具体数值达标 | Step 13 风险接受，后续性能专项 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“非功能验收表”“非功能裁决关系图”和“未覆盖专项承接表”小节,了解本章如何把需求非功能要求和测试专项转换为验收门禁。

L0-sdk 的非功能验收以 `AC-NFR-001`~`AC-NFR-011` 为裁决入口，覆盖性能、安全、安全边界、配置保护、可用性、最小接入、恢复能力、一致性 / 幂等、兼容演进、跨语言一致性和可观测性。

性能验收不发明固定 ms 阈值。当前 P0 通过条件是 quickstart、docs、candidate smoke、初始化、错误映射、trace 注入和 redaction 扫描均有可追溯测量点，且 SDK 自身不得成为最小接入路径失败的主要耗时来源。固定微基准、包体积或公共发布性能阈值未在需求阶段收稳，必须进入风险接受或后续专项。

安全验收中，raw secret、credential value、request / response / payload body 泄露次数必须为 0。SDK 不得执行 auth / governance truth。配置不得关闭 redaction、credential protection、fake marker、evidence 或 compatibility gate。

P0 可用性不依赖 public registry、完整 MCP、REST / GraphQL、REPL、offline cache、production endpoint 全量覆盖或 real credential provider。当前验收只要求 local candidate、stable boundary 或 fake / fixture endpoint、docs runner 和 smoke 能证明核心闭环成立。

---

## 9. 待确认事项

当前没有阻塞进入 Step 10 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否为性能固定具体数值阈值 | A. 固定；B. 不固定，只验测量点和瓶颈归因；C. 不验性能 | 采用 B | 需求阶段未给出 ms 阈值，不能凭空添加 |
| P1/P2 专项失败是否阻断 P0 | A. 阻断；B. 不阻断但进入风险接受；C. 不记录 | 采用 B | public registry、real credential、production endpoint 不属于当前 P0 |
| 可观测性是否全部放到 Step 10 | A. Step 9 不提；B. Step 9 定义非功能门禁，Step 10 定义证据门禁；C. Step 9 全部展开 | 采用 B | 避免证据章节重复，同时不遗漏非功能要求 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 非功能指标已定义 | 已满足 |
| 阈值来源已说明 | 已满足 |
| 未覆盖专项及其 P0 影响已说明 | 已满足 |
| 阻断验收的非功能失败已说明 | 已满足 |
| 每个非功能门禁已有证据来源 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 10,定义可观测性、审计与证据门禁。
