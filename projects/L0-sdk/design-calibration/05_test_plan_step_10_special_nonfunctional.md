# L0-sdk 05 测试方案 Step 10:设计专项测试与非功能验证

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §10 专项测试与非功能验证
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 设计专项测试与非功能验证 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_10_special_nonfunctional.md` |

本步把 P0 非功能要求和红线落成专项测试矩阵。缺陷分级留给 Step 11,进入 / 退出准则留给 Step 12,报告归档格式留给 Step 13。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `00-需求文档.md` §13 | 提取性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性要求和目标值来源 |
| `03-详细设计.md` §10 | 提取 truth、projection、outbox、artifact、idempotency 的事务与一致性契约 |
| `03-详细设计.md` §11 | 提取 validation、conflict、boundary violation、dependency unavailable 和恢复口径 |
| `03-详细设计.md` §12 | 提取幂等、重入、并发和 expected version 控制 |
| `03-详细设计.md` §14 | 提取 logs、metrics、audit、diagnostic 和禁止字段 |
| `03-详细设计.md` §15 | 提取最小测试切口和脚本 / 产物契约 |
| `04-配置设计.md` §8 / §11 / §12 | 提取敏感配置、失效模式和配置对测试 / 验收的承接 |
| `05_test_plan_step_09_automation_ci_gates.md` | 继承 PR / main / nightly / candidate gate 和 artifact / report 路径 |

## 3. SOP 问题回答

### 3.1 哪些性能指标必须验证?

| 性能指标 | 来源 | 验证方式 |
|---|---|---|
| quickstart / docs example 耗时 | `00` §13 性能要求 | docs gate 记录 duration 和 runner result |
| candidate smoke 耗时 | `00` §13 性能要求 | candidate gate 记录 Rust / Python / TypeScript smoke duration |
| SDK 初始化耗时 | `00` §13 性能要求 | runtime builder / config load integration test 记录 duration |
| 错误映射耗时 | `00` §13 性能要求 | error mapping unit / contract test 记录 measurement sample |
| trace 注入耗时 | `00` §13 性能要求 | trace propagation smoke / integration 记录 duration |
| redaction 扫描耗时 | `00` §13 性能要求;`03` §14 | redaction check 输出 scan duration 和 inspected file count |

需求阶段未固定具体微基准阈值,因此本步不得发明 ms 级硬阈值。P0 通过条件是测量点存在、可追溯到 `run_id`,且 SDK 自身不得成为 quickstart、docs、smoke 或 candidate gate 失败的主要耗时来源。

### 3.2 哪些安全和边界红线必须负向测试?

| 红线 | 来源 | 负向测试 |
|---|---|---|
| raw secret / credential value 不得进入配置、错误、日志、evidence、report | `00` §13;`03` §14;`04` §8 | 注入 synthetic secret marker,期望 config fail-fast 或 redaction gate failed |
| request / response / payload body 不得进入 DTO、event、diagnostic、audit | `03` §7 / §11 / §14 | raw body 字段输入触发 `BoundaryViolation` |
| SDK 不执行 auth / governance truth | `00` §13;`02` / `03` 范围约束 | 搜索接口 / 文档 / DTO,不得出现 SDK 拥有 auth decision 的字段 |
| fake success 不得成为 production supported | `00` §10 / §13;`03` §9 / §11 | fake marker 缺失或 fake-only stable gate 必须失败 |
| public registry 不得作为 P0 成功条件 | `00` §13;Step 2 / Step 9 | candidate gate 检查无 public publish side effect |
| unsupported config 不得绕过 redaction / compatibility / evidence gate | `04` §11 / §12 | 禁用 redaction、绕过 compatibility 或启用 remote config 时 fail-fast |

### 3.3 哪些一致性和恢复场景必须故障注入?

| 场景 | 来源 | 故障注入方式 |
|---|---|---|
| truth + projection + outbox + idempotency 同事务 | `03` §10 | projection / outbox append failure 后断言 truth 回滚 |
| same idempotency key same digest replay | `03` §12 | 重放同一 command,返回既有 receipt / result ref |
| same idempotency key different digest conflict | `03` §12 | 使用同 key 不同 DTO digest,返回 `Conflict` 且不覆盖旧记录 |
| duplicate inbound event skip | `03` §12 | 重放同一 `event_id + source_ref + idempotency_key` |
| outbox publish retry same event id | `03` §10 / §12 | publisher failure 后重试,不生成新 truth 或新 event id |
| artifact body success but truth commit failure | `03` §10 | metadata save failure 后断言 orphan artifact 不可见 |
| dependency unavailable recovery | `03` §11 | source / runner / boundary unavailable 后恢复并重跑 |
| projection rebuild does not rewrite truth | `03` §10 / §12 | 删除 projection 后 rebuild,truth version 不变 |

### 3.4 哪些日志、指标和审计证据必须存在?

| 证据类型 | 来源 | 必须存在 |
|---|---|---|
| command / query / boundary / event / job metrics | `03` §14.2 | total、latency、result、kind 标签 |
| evidence metrics | `03` §14.2 | evidence kind、result、redaction status |
| idempotency / repository metrics | `03` §14.2 | operation、result、store kind、error category |
| audit event | `03` §14.3 | baseline update、view refresh、boundary call、compatibility、deprecated、validation evidence、candidate、boundary violation |
| diagnostic refs | `03` §14.1 / §14.4 | safe summary、error code、supporting refs |
| forbidden field scan | `03` §14.4;Step 9 | artifacts、reports、logs、evidence 中 forbidden body / secret count = 0 |

可观测性不能只写“已记录日志”。每条 P0 观测要求都必须能在 `artifacts/test/<run_id>` 或 `reports/runs/<run_id>` 中找到证据。

### 3.5 阈值来自哪里?

| 阈值 / 通过条件 | 来源 |
|---|---|
| 敏感值泄露次数必须为 0 | `00-需求文档.md` §13 安全要求 |
| 公共注册表不可用不阻断 P0 | `00-需求文档.md` §13 可用性要求;Step 2 非范围 |
| 最小验证目标必须有 fake / fixture endpoint | `00-需求文档.md` §13 可用性要求 |
| 三语言核心概念不得漂移 | `00-需求文档.md` §13 幂等 / 一致性要求 |
| query / projection / runtime boundary 不写 truth | `03-详细设计.md` §8 / §10 / §15 |
| redaction、fake marker、compatibility gate 不得被配置关闭 | `04-配置设计.md` §11 / §12 |
| 性能微基准不固定具体数值 | `00-需求文档.md` §13 明确要求测试方案定义测量点,需求阶段不固定阈值 |
| 观测材料禁止字段 | `03-详细设计.md` §14.4 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 安全、恢复和观测专项没有按新版 `00/03/04` 的红线和证据路径组织 |
| `00-需求文档.md` §13 | 已给出非功能目标和部分目标值,但仍需落成专项测试方法 |
| `03-详细设计.md` §10~§15 | 已给出事务、恢复、并发、观测和最小测试切口,本步需要把它们合并为测试专项 |
| `04-配置设计.md` | 已给出配置失效模式,本步需要把 forbidden toggle 和 secret 边界纳入安全专项 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 性能验证 | 容易写成泛化性能测试 | 明确测量点,不发明未来源阈值 |
| 安全验证 | 只看 redaction | 覆盖 raw secret、raw body、fake marker、auth / governance 边界和 config forbidden toggle |
| 一致性验证 | 分散在用例里 | 单列事务、幂等、并发、outbox、artifact、projection 专项 |
| 恢复验证 | 缺少故障注入 | 明确 dependency unavailable、outbox retry、orphan artifact、projection rebuild |
| 观测验证 | 可能只人工看日志 | 要求 metrics、audit、diagnostic、report 可追溯并通过 forbidden field scan |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否固定 ms 级性能阈值 | 不固定 | 需求阶段只要求可测量和不成为明显瓶颈 |
| 是否把安全测试只放 candidate gate | 不允许 | 安全红线必须进入 unit / integration / PR redaction / candidate gate |
| 是否用真实 secret 做测试 | 不允许 | 只能使用 synthetic marker,避免测试本身泄露 |
| 是否把 P1 staging smoke 算作 P0 可用性证据 | 不算 | P0 依赖 fake / fixture / local runner 闭环 |
| 是否允许观测证据只靠人工确认 | 不允许 | 观测证据必须落到 artifact / report 并可扫描 |

## 7. 结构化中间产物

### 7.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| `SPECIAL-SDK-PERF-001` | 初始化、错误映射、trace、redaction、docs / smoke 耗时不可见 | 在 PR / candidate gate 记录 duration 和 operation kind | `ci-test` / `candidate-validation` | 测量点存在;SDK 不成为 gate 失败的主要耗时来源 | `EV-SDK-PERF-001` |
| `SPECIAL-SDK-SEC-001` | raw secret / credential / body 泄露 | synthetic marker 注入 + redaction scan | `ci-test` / `candidate-validation` | 泄露次数 = 0 | `EV-SDK-SECURITY-001` |
| `SPECIAL-SDK-SEC-002` | SDK 越界执行 auth / governance | DTO / API / doc / config 边界扫描 | `ci-test` | 不出现 SDK 拥有 auth / governance truth 的接口 | `EV-SDK-SECURITY-002` |
| `SPECIAL-SDK-CONFIG-001` | 配置关闭安全或状态门禁 | invalid JSON / forbidden toggle / unsupported profile 负向测试 | `ci-test` | fail-fast / fail-closed;runtime 不构造 | `EV-SDK-CONFIG-001` |
| `SPECIAL-SDK-CONSISTENCY-001` | truth、projection、outbox、idempotency 不一致 | repository / UoW failure injection | `integration-test` | 失败回滚或保留正确 pending / retry state | `EV-SDK-CONSISTENCY-001` |
| `SPECIAL-SDK-IDEMPOTENCY-001` | replay / conflict 语义错误 | same key same digest / different digest / duplicate event | `integration-test` / nightly | replay 返回既有结果;conflict 不覆盖旧记录 | `EV-SDK-IDEMPOTENCY-001` |
| `SPECIAL-SDK-RECOVERY-001` | 依赖不可用、outbox retry、projection rebuild 恢复失败 | source / runner / publisher / projection 故障注入 | `integration-test` / nightly | 恢复后可重跑;不得复制上游 truth 或反写真相 | `EV-SDK-RECOVERY-001` |
| `SPECIAL-SDK-OBS-001` | logs / metrics / audit / diagnostic 不可验证 | 运行 command、query、boundary、job、evidence 场景后检查观测输出 | `ci-test` / `integration-test` | 必需 metrics、audit、diagnostic refs 存在且不含禁止字段 | `EV-SDK-OBS-001` |
| `SPECIAL-SDK-AVAIL-001` | public registry 或完整 gateway 缺失阻断 P0 | registry unavailable / MCP REST GraphQL absent 场景 | `candidate-validation` | local candidate install / smoke / docs 仍可完成 | `EV-SDK-AVAIL-001` |
| `SPECIAL-SDK-LANG-001` | 三语言概念、错误、trace、redaction 漂移 | cross-language smoke + semantic compare | `candidate-validation` / nightly | Rust / Python / TypeScript 核心语义一致 | `EV-SDK-SMOKE-001` |

### 7.2 专项证据流

```text
[special test input]
        |
        v
[gate / integration / nightly suite]
        |
        +--> [raw artifacts: artifacts/test/<run_id>]
        |
        +--> [metrics / audit / diagnostic refs]
        |
        v
[scripts/checks/check_redaction.sh]
        |
        v
[reports/runs/<run_id>]
```

说明:

- 专项测试输入可以包含 synthetic marker,但输出不得包含 raw secret、credential value 或 body。
- 所有专项证据必须绑定 `run_id`。
- `reports/runs/<run_id>` 是后续验收和缺陷复验的读取入口。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §10 时摘录。

```markdown
## 10. 专项测试与非功能验证

> 校准来源：
> - `design-calibration/05_test_plan_step_10_special_nonfunctional.md`

本章按性能、安全、配置、一致性、幂等、恢复、观测、可用性和跨语言一致性组织专项测试。非功能指标必须有来源：性能测量点来自 `00-需求文档.md` §13,事务 / 恢复 / 幂等来自 `03-详细设计.md` §10~§12,观测和禁止字段来自 `03-详细设计.md` §14,配置红线来自 `04-配置设计.md` §8 / §11 / §12。

需求阶段未固定具体微基准阈值,因此本轮不发明 ms 级阈值。P0 性能通过条件是 quickstart、docs、candidate smoke、初始化、错误映射、trace 注入和 redaction 扫描均有可追溯测量点,且 SDK 自身不得成为最小接入路径失败的主要耗时来源。安全通过条件中,raw secret、credential value、request / response / payload body 泄露次数必须为 0。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否在 Step 10 固定具体性能 ms 阈值 | 不固定 | `00` 已明确需求阶段不固定具体微基准阈值 |
| 是否允许用真实 secret 验证 redaction | 不允许 | 使用 synthetic marker 即可验证扫描和阻断,避免测试泄露 |
| 是否把 staging-like smoke 纳入 P0 可用性证据 | 不纳入 | P0 可用性由 fake / fixture / local candidate 证明 |
| 是否把观测证据留给人工确认 | 不允许 | SOP 要求可观测性必须可通过证据验证 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 性能测量点已定义 | 已满足 |
| 安全和边界红线负向测试已定义 | 已满足 |
| 一致性和恢复故障注入已定义 | 已满足 |
| 日志、指标和审计证据已定义 | 已满足 |
| 阈值来源已定义 | 已满足 |
| P0 非功能和红线均有验证方式 | 已满足 |

Step 11 可以在本文件被确认后开始,主题是定义缺陷管理与复验规则。
