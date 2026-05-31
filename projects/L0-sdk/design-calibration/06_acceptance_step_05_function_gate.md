# L0-sdk 06 验收标准 Step 5: 功能验收门禁

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 5 中间产物。
> 本步把 P0 功能需求、主处理流、测试用例和证据编号转换成可裁决的功能验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 定义功能验收门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §5 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 official SDK 三语言接入闭环和 P1/P2 非范围 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 继承固定 `<run_id>`、reports / artifacts / acceptance handoff 证据基线 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承进入验收前必须具备完整证据和三值退出结论 |
| `00-需求文档.md` §9 / §10 / §14 | 已完成 | 提取 F-001~F-010、BR-001~BR-014、需求验收方向和一票否决方向 |
| `03-详细设计.md` §6 / §7 / §8 / §9 / §15 | 已完成 | 提取正式对象、Command / Query / Event / Job、状态集合和最小测试切口 |
| `05-测试方案.md` §5 / §6 / §13 | 已完成 | 提取 `TS-SDK-*`、`TC-SDK-*`、`EV-SDK-*` 和报告证据映射 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 功能的通过条件是什么?

P0 功能的通过条件不是“接口能调用”,而是对应功能在默认可验证路径上形成预期 SDK truth、状态、证据或安全输出,并且证据可追溯到固定 `<run_id>`。

| 功能 | 优先级 | 通过条件摘要 |
|---|---|---|
| F-001 共享契约承接与语言产物一致 | P0 | SDK 只消费 `L0-core` / `L0-bus` truth,derived view fresh,source failure 不写 view,upstream changed 后 stale 可追踪 |
| F-002 三语言官方客户端概念一致 | P0 | semantic baseline 覆盖 Rust / Python / TypeScript,concept map 无漂移,package surface 不定义第二 truth |
| F-003 平台能力最小接入 | P0 | `InvokeServiceCapability` 能通过 formal API 或 fake / fixture boundary 返回 ref-only 结果,unsupported 被拒绝 |
| F-004 事件语义客户端封装 | P0 | `PublishBusEvent` 只形成 bus boundary publish ref,raw payload body 和 missing mapping 被拒绝 |
| F-005 错误映射与 trace 传播一致 | P0 | `SdkProtocolError` 分类一致,trace 可传播或补齐,错误与 trace 输出不含正文 |
| F-006 redaction 与凭据材料保护 | P0 | raw secret、disable redaction、unredacted evidence、artifact / report 泄漏均被拒绝或阻断 |
| F-007 本地 package candidate 与安装验证 | P0 | candidate 可从 `Draft` 到 `Stable`,且必须满足 freshness、evidence、redaction、compatibility gate |
| F-008 quickstart、docstring 与示例可运行 | P0 | quickstart / docs example 可运行,结果写入 redacted docs evidence,docs failure 阻断 stable |
| F-009 跨语言 smoke 与一致性验证 | P0 | cross-language smoke passed,skipped 不当作 passed,evidence 只保存 ref / digest,不依赖 public registry |
| F-010 版本兼容、deprecated 与迁移治理 | P0 | compatibility decision 可记录,`RequiresMigration` 必须带 migration ref,deprecated lifecycle 合法 |

### 3.2 每个 P0 功能的失败条件是什么?

失败条件必须能导致明确裁决。功能失败按影响分三类:主链失败、边界失败、证据失败。

| 失败类型 | 示例 | 裁决影响 |
|---|---|---|
| 主链失败 | derived view 不可形成、semantic baseline 不完整、service capability 无最小调用、candidate 无法验证 | P0 不通过 |
| 边界失败 | SDK 重定义 core / bus truth、fake success 支撑 production stable、Query / projection / runtime call 写 truth | 通常触发 Step 6 / Step 11 红线 |
| 证据失败 | TC 结果缺失、EV 无法追溯、reports 使用 `latest`、artifact 路径非法、unredacted evidence 被引用 | 不得判定通过;严重时阻断进入验收 |

### 3.3 证据来自哪些测试用例或报告?

功能门禁的直接证据来自 `05-测试方案.md` 的 `TC-SDK-*` 用例族和 `EV-SDK-*` 证据。

| 验收门禁族 | 测试用例 | 证据入口 |
|---|---|---|
| Contract / snapshot | `TC-SDK-CONTRACT-001~003` | `EV-SDK-CONTRACT-001`、`reports/runs/<run_id>` |
| Semantic baseline | `TC-SDK-SEMANTIC-001~003` | `EV-SDK-SEMANTIC-001` |
| Boundary call | `TC-SDK-BOUNDARY-001~003` | `EV-SDK-BOUNDARY-001` |
| Event client | `TC-SDK-EVENT-001~003` | `EV-SDK-EVENT-001` |
| Error / trace | `TC-SDK-TRACE-001~003` | `EV-SDK-TRACE-001` |
| Security / redaction | `TC-SDK-SECURITY-001~004` | `EV-SDK-SECURITY-001`、`redaction-check.md` |
| Candidate | `TC-SDK-CANDIDATE-001~004` | `EV-SDK-CANDIDATE-001` |
| Docs | `TC-SDK-DOCS-001~003` | `EV-SDK-DOCS-001` |
| Smoke | `TC-SDK-SMOKE-001~004` | `EV-SDK-SMOKE-001` |
| Compatibility / deprecated | `TC-SDK-COMPAT-001~004` | `EV-SDK-COMPAT-001` |

### 3.4 哪些 P1 功能只做后置边界验收?

P1/P2 不进入本步的完整功能门禁。它们只在当前验收中证明“不会污染 P0”,完整能力留给后续专项或对应仓库。

| P1/P2 能力 | 当前只验什么 | 不验什么 |
|---|---|---|
| public registry publish | local candidate 不依赖 public registry,无 public publish side effect | crates.io / PyPI / npm 发布、签名、撤回、回滚 |
| production formal API endpoint 全集 | formal / fake boundary 的最小接入和 unsupported 口径 | 全量服务能力覆盖和生产 SLA |
| real credential provider | credential ref-only、raw secret forbidden、fail-closed | KMS / Vault 集成、轮换和运维 |
| remote config / hot reload / admin override | 启用后 rejected / unsupported,不得绕过 runtime graph | 在线配置变更一致性 |
| MCP / REST / GraphQL / REPL / offline cache | 缺失不影响 P0 official SDK 闭环 | 生态增强体验和缓存策略 |
| full L1/L2/L3/L4 client coverage | 最小 formal / fake boundary 和后续扩展风险 | 全量领域 API client coverage |

### 3.5 哪些功能失败会导致总体不通过?

以下失败默认导致总体“不通过”,不能降级为“有条件通过”。如果同时触发 S0,则在 Step 11 作为一票否决展开。

| 失败项 | 结论影响 |
|---|---|
| F-001~F-010 任一 P0 功能无通过证据 | 不通过 |
| SDK 重定义 `L0-core` 或 `L0-bus` truth | 进入 S0 一票否决 |
| Rust / Python / TypeScript 语义漂移 | 不通过;严重时进入一票否决 |
| 最小 formal / fake boundary 接入不可运行 | 不通过 |
| raw secret、credential value、request / response / payload body 泄漏 | 进入 S0 一票否决 |
| fake-only 能力支撑 `PackageCandidateStatus::Stable` | 不通过;可能进入 S0 |
| `EvidenceResult::Skipped` 被当作 `Passed` | 不通过 |
| `RequiresMigration` 缺少 migration ref 仍被接受 | 不通过 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 功能门禁沿用旧主线 | 仍围绕 binding、wrapper、subscription、release manifest 旧口径 | 与新版 F-001~F-010 不一致 | 本步改用 official SDK P0 功能闭环 |
| 功能门禁缺少失败条件 | 只写能力存在,没有写何时失败 | 无法裁决不通过 | 本步每个 AC-FUNC 都写失败条件 |
| 功能与红线交叉 | 双 truth、raw secret、fake marker 既是功能负例又是一票否决候选 | 后续章节重复或遗漏 | 本步只作为功能失败触发点,Step 6 / Step 11 再正式展开红线 |
| 状态名可能继续漂移 | 旧文档容易写 built / published / released 等口语状态 | 实现 agent 无法 1:1 对齐 | 本步要求使用 `03` 正式 enum variant |
| public registry 容易污染 P0 | 旧文档过度强调 release manifest / registry dry-run | 把 P1/P2 误判为 P0 | 本步把 public registry 限定为后置边界 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 功能主语 | binding / wrapper / subscription / release 旧主题 | F-001~F-010 official SDK 功能闭环 | 与新版需求和测试一致 |
| 门禁格式 | 功能可用式描述 | AC-FUNC ID、设计契约、通过条件、失败条件、证据来源 | 可裁决 |
| 状态 / API | 口语化或旧名称 | 使用 `03` 正式 Command、Query、Event、Job 和 enum | 可实现 |
| 测试证据 | 泛称 smoke / log | 精确到 TC / EV / report | 可追溯 |
| P1/P2 | 容易混入当前通过条件 | 只做后置边界验收和风险记录 | 防止验收越界 |

---

## 6. 验收设计取舍

### 6.1 是否按 F-001~F-010 一一生成功能门禁

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个功能需求一个门禁 | 与需求追溯清晰 | 部分横切功能与 Step 9~11 有交叉 |
| B. 只按 P0 闭环大门禁写一条 | 文档短 | 失败时无法定位断点 |
| C. 按 F-001~F-010 生成,横切项在 Step 9~11 再展开 | 追溯清晰,也避免遗漏 | 表格稍长 | 采用 |

### 6.2 是否把 public registry 放入功能门禁

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 放入 P0 功能门禁 | 更接近最终发布 | 与需求、测试、配置的 P0 范围不一致 |
| B. 只要求 local package candidate,public registry 放入 P1/P2 后置边界 | 范围清晰 | 公网发布风险后置 | 采用 |
| C. 完全不提 | 文档更短 | 后续容易误以为已覆盖 | 不采用 |

### 6.3 是否允许某个 P0 功能失败后有条件通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行灵活 | P0 主闭环不成立,结论失真 |
| B. 不允许 P0 功能失败有条件通过 | 结论可信 | 必须保证 P0 范围准确 | 采用 |
| C. 由签署人临时判断 | 灵活 | 不可审计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 设计契约 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| AC-FUNC-001 | F-001 共享契约承接与语言产物一致 | P0 | `RefreshDerivedBindingView`、`SnapshotFreshnessState` | derived view 可 fresh;language view 使用 current concept map;source failure 不写 view;upstream changed 后 stale 可追踪 | SDK 复制或重定义 core / bus truth;digest mismatch 仍写 view;language view 脱离 concept map;stale 被当 fresh | `TC-SDK-CONTRACT-001~003`;`EV-SDK-CONTRACT-001` |
| AC-FUNC-002 | F-002 三语言官方客户端概念一致 | P0 | `UpdateSdkSemanticBaseline`、`SdkSemanticBaseline`、`CrossLanguageConceptMap` | baseline 覆盖三语言;concept map 无漂移;surface 对齐 baseline | 语言 surface 形成第二 truth;concept drift 被接受;baseline 缺语言 | `TC-SDK-SEMANTIC-001~003`;`EV-SDK-SEMANTIC-001` |
| AC-FUNC-003 | F-003 平台能力最小接入 | P0 | `InvokeServiceCapability`、`ServiceCapabilityRefId`、`ServiceClientView`、`CapabilitySupportState` | stable capability ref ID 可 lookup 完整能力引用;formal / fake boundary 返回 ref-only result;unsupported 被拒绝;SDK domain truth 写入 0;runtime 幂等可审计 | unsupported 仍执行;fake success 被当 production;runtime call 写 SDK domain truth;capability ref 形态不稳定 | `TC-SDK-BOUNDARY-001~003`;`EV-SDK-BOUNDARY-001` |
| AC-FUNC-004 | F-004 事件语义客户端封装 | P0 | `PublishBusEvent`、`EventSemanticMappingRef`、`BusEventClientView`、bus boundary port | stable mapping ref 可 lookup 完整 event mapping;publish 返回 bus boundary ref;raw payload body 被拒绝;missing mapping 失败;runtime 幂等可审计 | SDK 生成 bus delivery truth;raw body 被接受;mapping missing 仍 publish;event mapping ref 无稳定 ID | `TC-SDK-EVENT-001~003`;`EV-SDK-EVENT-001` |
| AC-FUNC-005 | F-005 错误映射与 trace 传播一致 | P0 | `SdkProtocolError`、`TraceContextRef`、error envelope | error 分类一致;trace 可传播或补齐;错误 / trace 输出不含正文 | 错误分类漂移;trace 缺失且不补齐;敏感正文进入 error / trace | `TC-SDK-TRACE-001~003`;`EV-SDK-TRACE-001` |
| AC-FUNC-006 | F-006 redaction 与凭据材料保护 | P0 | `BoundaryGuard`、`EvidenceRedactionStatus`、policy profile | raw secret / disable redaction fail-fast;unredacted evidence 被拒绝;artifact / report scan 为 0 | raw secret 被接受;redaction 可关闭;evidence unredacted 仍可支撑 stable | `TC-SDK-SECURITY-001~004`;`EV-SDK-SECURITY-001` |
| AC-FUNC-007 | F-007 本地 package candidate 与安装验证 | P0 | `GeneratePackageCandidate`、`BuildLanguagePackages`、`PackageCandidateStatus` | candidate 经 `Draft -> NotVerified -> Verified -> Stable`;artifact metadata attached 且包含来源 `language_view_id`;public registry 非前置 | stale / unknown view 仍生成 candidate;artifact 无法追溯 language view;`Built` 被写成状态;未验证进入 stable | `TC-SDK-CANDIDATE-001~004`;`EV-SDK-CANDIDATE-001` |
| AC-FUNC-008 | F-008 quickstart、docstring 与示例可运行 | P0 | `ValidateDocsExamples`、docs evidence | quickstart 可运行;docs example 与 client 行为一致;docs failure 阻断 stable | docs example 静态不可运行;docs evidence 未脱敏;docs failure 不阻断 stable | `TC-SDK-DOCS-001~003`;`EV-SDK-DOCS-001` |
| AC-FUNC-009 | F-009 跨语言 smoke 与一致性验证 | P0 | `RunCrossLanguageSmoke`、`VerificationEvidence`、`EvidenceResult` | smoke passed;`Skipped` 不当作 `Passed`;evidence 只保存 ref / digest | skipped 支撑 verified;缺 evidence 仍 stable;public registry 缺失阻断 local smoke | `TC-SDK-SMOKE-001~004`;`EV-SDK-SMOKE-001` |
| AC-FUNC-010 | F-010 版本兼容、deprecated 与迁移治理 | P0 | `CheckCompatibility`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState` | compatible / requires migration 可记录;requires migration 携带 migration ref;deprecated lifecycle 合法 | missing migration ref 被接受;breaking 被标 compatible;deprecated 静默移除 | `TC-SDK-COMPAT-001~004`;`EV-SDK-COMPAT-001` |

### 7.2 功能门禁到需求追溯表

| 验收项 ID | 需求 | 核心闭环 | 测试场景 |
|---|---|---|---|
| AC-FUNC-001 | F-001 | CL-001 | `TS-SDK-001` |
| AC-FUNC-002 | F-002 | CL-002 | `TS-SDK-002` |
| AC-FUNC-003 | F-003 | CL-003 | `TS-SDK-003` |
| AC-FUNC-004 | F-004 | CL-001 / CL-002 / CL-003 | `TS-SDK-004` |
| AC-FUNC-005 | F-005 | CL-004 | `TS-SDK-005` |
| AC-FUNC-006 | F-006 | CL-004 | `TS-SDK-006` |
| AC-FUNC-007 | F-007 | CL-003 / CL-005 | `TS-SDK-007` |
| AC-FUNC-008 | F-008 | CL-003 / CL-005 | `TS-SDK-008` |
| AC-FUNC-009 | F-009 | CL-001 / CL-002 / CL-003 / CL-004 | `TS-SDK-009` |
| AC-FUNC-010 | F-010 | CL-005 | `TS-SDK-010` |

### 7.3 P1/P2 后置边界表

| 能力 | 当前验收口径 | 不通过触发点 | 后续归属 |
|---|---|---|---|
| public registry publish | 当前只要求 local candidate 不依赖 public registry | 对外宣称已公共发布但无专项证据;或 public registry 缺失阻断 local candidate | release / operations 专项 |
| production formal API endpoint 全集 | 当前只要求最小 formal / fake boundary | full service coverage 被误声明为已完成 | service capability owner |
| real credential provider | 当前只要求 credential ref-only 和 raw secret forbidden | raw secret 被 SDK 接受或输出 | security / operations 专项 |
| remote config / hot reload | 当前只要求 rejected / unsupported | runtime graph 被在线变更静默修改 | configuration P1/P2 |
| MCP / REST / GraphQL / REPL / offline cache | 当前只要求不依赖这些能力 | 缺失被误判为 P0 失败或实现中自然膨胀 | ecosystem enhancement |
| full L1/L2/L3/L4 client coverage | 当前只要求最小接入和扩展风险记录 | 全量覆盖被误声明为 P0 已交付 | 后续服务覆盖裁剪 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能门禁到需求追溯表”和“P1/P2 后置边界表”小节,了解本章如何把 F-001~F-010 转换为可裁决验收门禁。

本轮功能验收以 `AC-FUNC-001`~`AC-FUNC-010` 为裁决入口,分别对应 F-001~F-010。每个功能门禁都必须同时满足设计契约、通过条件、失败条件和证据来源要求。任一 P0 功能没有通过证据,不得判定为通过或有条件通过。

功能验收必须使用 `03-详细设计.md` 的正式对象、Command、Query、Event、Job 和 enum variant。不得继续沿用旧版 binding / wrapper / subscription / release manifest 口语名作为正式验收主语。

public registry publish、production formal API endpoint 全集、real credential provider、remote config / hot reload、MCP / REST / GraphQL / REPL / offline cache 和 full L1/L2/L3/L4 client coverage 不作为当前 P0 功能完整交付门禁。当前仅裁决它们的接缝和后置边界是否污染 P0 official SDK 闭环;完整能力进入对应后续专项或仓库验收。

---

## 9. 待确认事项

当前没有阻塞进入 Step 6 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 功能门禁是否按 F-001~F-010 一一生成 | A. 是;B. 只写一个 P0 闭环;C. 按测试 suite 全部展开 | 采用 A | 与需求追溯最清楚,失败时容易定位断点 |
| public registry 是否进入功能门禁 | A. 进入 P0;B. 只列后置边界;C. 完全不提 | 采用 B | 防止 P1/P2 污染 P0,同时保留风险和后续归属 |
| P0 功能失败是否允许有条件通过 | A. 允许;B. 不允许;C. 签署时临时判断 | 采用 B | P0 主闭环失败时有条件通过会破坏验收结论可信度 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 功能均有 AC-FUNC 门禁 | 已满足 |
| 每个门禁均包含设计契约、通过条件、失败条件和证据来源 | 已满足 |
| 功能门禁能追溯到 F-001~F-010 和 `TS-SDK-*` | 已满足 |
| P1/P2 后置边界已列出,未混入 P0 完整交付 | 已满足 |
| 功能失败与 Step 6 / Step 11 红线展开边界已区分 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 6,定义数据边界与架构红线验收。
