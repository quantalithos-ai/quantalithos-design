# Step 16. 定义测试切口与最小验证清单

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 16 中间产物。
> 本步只收稳详细设计层的最小测试入口，不替代 `05-测试方案.md`。
> 本步不写覆盖率目标、CI 阶段矩阵、完整 fixture 设计或端到端排期。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16
- 回填章节：`projects/L0-sdk/03-详细设计.md` §15 测试切口与最小验证清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 模块实现契约主轴 | 16 个实现职责模块 | 固定模块测试切口 |
| Step 8 协议契约 | 6 个 Command、12 个 Query、4 个 Inbound Event、6 个 Outbound Event、8 个 Job | 固定接口测试切口 |
| Step 9 函数级处理流 | 写路径、只读流、runtime boundary、outbox、job flow | 固定正向和异常验证路径 |
| Step 10 状态机矩阵 | 7 个正式状态集合 | 固定合法 / 非法状态转换测试 |
| Step 11~13 一致性、错误、幂等 | UoW、repository、projection、outbox、artifact、idempotency、并发冲突 | 固定一致性与重入测试 |
| Step 14~15 配置与观测 | runtime wiring、boundary、runner、redaction、audit、metric | 固定配置、依赖和观测测试切口 |

已确认结论：

```text
每个关键模块、协议、状态机和一致性分支都必须有最小测试入口。
测试切口只回答“必须测什么”，不回答完整测试计划如何排期、如何统计覆盖率。
P0 默认使用 in-memory / local / fake / fixture profile 验证语义，不依赖公共 registry 或完整服务集群。
```

---

## 3. SOP 问题回答

### 3.1 每个模块至少需要哪些单元测试？

| 模块 | 最小测试切口 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts` | DTO roundtrip、enum value、error envelope | 协议 schema 稳定，禁止 raw body 字段 | contract unit test |
| `domain_semantic` | baseline、capability model、concept map | 三语言语义一致、不复制上游 truth | domain unit test |
| `domain_upstream_view` | derived view、language view、freshness | source ref、digest、fresh / stale 判断 | domain unit test |
| `domain_service_client` | service view、capability support | supported / fake-only / pending / unsupported 判断 | domain unit test |
| `domain_event_client` | event view、semantic mapping | bus semantic 对齐，不生成 bus truth | domain unit test |
| `domain_boundary_policy` | error / trace / redaction / credential / guard | forbidden body、plain secret、fake success 被拒绝 | policy unit test |
| `domain_package_candidate` | candidate 和 artifact 状态 | draft、not verified、verified、stable、superseded 门禁 | domain unit test |
| `domain_evidence` | evidence result 和 redaction | passed 不等于 redacted，unredacted 不能支撑 stable | domain unit test |
| `domain_compatibility_evolution` | decision、deprecated、migration ref | breaking、migration、deprecated lifecycle | domain unit test |
| `application_services` | command / consumer / job 编排 | port 调用顺序、UoW、outbox、projection、错误映射 | application test |
| `application_ports` | trait mockability | 每个外部依赖可替换、错误可注入 | port contract test |
| `infra_adapters` | repository、source、boundary、runner、artifact、outbox | in-memory / filesystem 语义、version conflict、failure mapping | adapter test |
| `rust_client_facade` | service / event / query client | 不暴露 raw adapter，metadata / idempotency 传递正确 | facade test |
| `language_package_surface` | Python / TypeScript package surface | 与 Rust semantic baseline 一致，错误形状一致 | package smoke |
| `cli_entry` | command parse 和 exit code | CLI 参数、actor、metadata、错误码映射 | CLI test |
| `jobs` | job input、item 幂等、summary | job 重跑、partial failure、evidence 写入 | job runner test |

### 3.2 每个接口至少需要哪些正向和异常测试？

Command 必须覆盖成功、validation / boundary 异常和幂等冲突；Query 必须覆盖命中、not found / stale、且不写入；Inbound Event 必须覆盖正常消费、duplicate 和缺失来源；Outbound Event 必须覆盖 schema 和 forbidden body；Job 必须覆盖成功、失败和重跑。

### 3.3 状态机合法转换和非法转换如何测试？

状态机测试必须直接调用 domain method 或 application flow，不通过修改字段绕过状态函数。每个状态集合至少测一条主线合法转换、一条终态或门禁非法转换，以及非法转换时的错误类型。

### 3.4 事务、一致性、幂等和并发如何验证？

使用 fake / in-memory repository 和 fake UoW 注入冲突、失败和重复调用。必须覆盖 same key same digest replay、same key different digest conflict、expected version conflict、outbox publish replay、projection rebuild 不反写真相、artifact orphan 不可见、job item 重跑不重复写 evidence。

### 3.5 哪些测试细节应留给测试方案？

| 留给 `05-测试方案.md` 的内容 | 本步只定义 |
|---|---|
| 测试优先级、覆盖率、CI 阶段、执行顺序 | 最小测试入口 |
| fixture 文件组织、mock 数据、测试命名细则 | 必须覆盖的契约边界 |
| 真实 formal API / bus / package registry 集成环境 | P0 fake / local profile 的语义 |
| 报告模板、审查流程、验收证据归档 | artifact / report 根目录和失败语义 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 前序 Step 已给出测试线索但分散 | 实现者难以知道最小测试集合 | 汇总为模块、接口、状态机、一致性四类切口 |
| SDK runtime boundary 不写 truth | 容易漏测 boundary diagnostic 和 fake marker | 将 formal / fake / bus boundary 单列接口测试 |
| evidence result 与 redaction status 容易混淆 | candidate gate 可能误判 stable | 状态机和 evidence 测试强制拆分 |
| Outbound Event 使用通用发布流 | 可能只测 publisher，不测 event schema 差异 | 增加逐 event schema 测试 |
| 观测和 redaction 只在 Step 15 定义 | 可能实现了埋点但泄露正文 | 增加日志、指标、审计、diagnostic 的 redaction 测试 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 模块测试 | 只知道模块职责 | 每个模块都有最小测试切口 |
| 接口测试 | 协议、处理流分散 | Command / Query / Event / Job 统一索引 |
| 状态机测试 | 只有转换矩阵 | 合法转换、非法转换、门禁错误都有测试入口 |
| 一致性测试 | 分散在事务、错误、幂等章节 | 形成 replay、conflict、outbox、projection、artifact、job 重跑清单 |
| 测试边界 | 容易扩写成测试方案 | 明确只写最小验证清单 |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否写完整测试方案 | 在详细设计中写完整矩阵 | 只写最小测试切口 | B | 完整计划属于 `05-测试方案.md` |
| Outbound Event 是否只测通用 publisher | 只测发布流 | 发布流 + 每个 event schema | B | payload 字段差异会影响跨仓消费 |
| Query 是否进入幂等测试 | Query 也用 idempotency repo | 只测只读、not found、stale、不写入 | B | Query 不改写真相 |
| runtime boundary 是否做 truth 测试 | 测服务端业务结果 | 只测 SDK guard、diagnostic、fake marker、error mapping | B | SDK 不拥有服务端 truth |
| package surface 是否只测 Rust | 只测 Rust crate | Rust + Python + TypeScript smoke | B | SDK P0 目标包含三语言 package surface |

---

## 7. 结构化中间产物

### 7.1 测试切口总图

```text
Detailed design contracts
  |
  +-- module contracts -----------> module / domain / adapter tests
  +-- protocol contracts ---------> command / query / event / job tests
  +-- state matrices ------------> legal / illegal transition tests
  +-- consistency rules ---------> idempotency / concurrency / replay tests
  +-- boundary and evidence -----> redaction / fake marker / smoke tests
  v
artifacts/test/<run_id>
  |
  v
reports/runs/<run_id>
```

关键说明：

- 本图表达详细设计契约如何落到最小测试入口，不表达完整 CI 流程。
- `artifacts/test/<run_id>` 保存原始测试产物，`reports/runs/<run_id>` 保存审查后的报告。
- 每个测试切口必须能回指 Step 5~15 的某个实现契约。

### 7.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| DTO / event / job schema roundtrip | Step 8 `contracts` | JSON / Rust DTO / error envelope 稳定，不含 raw body 字段 | contract unit |
| semantic baseline and concept map | Step 6 `domain_semantic` | 三语言能力语义一致，capability source ref 有效 | domain unit |
| derived view freshness | Step 10 `SnapshotFreshnessState` | refresh、stale、unsupported、unknown 转换 | domain unit |
| service capability support | Step 10 `CapabilitySupportState` | supported / fake-only / pending / unsupported 门禁 | domain unit |
| bus event semantic mapping | Step 6 `domain_event_client` | SDK event mapping 对齐 bus semantic，不生成 bus runtime truth | domain unit |
| boundary policy guard | Step 6 / 12 / 15 | raw body、plain secret、fake success、unredacted evidence 被拒绝 | policy unit |
| candidate gate | Step 10 `PackageCandidateStatus` | evidence + freshness + compatibility 才能进入 verified / stable | domain unit |
| evidence result and redaction | Step 10 `EvidenceResult` / `EvidenceRedactionStatus` | passed 与 redacted 独立判断 | domain unit |
| compatibility and deprecated lifecycle | Step 10 decision / deprecated states | breaking、requires migration、pending removal、removed | domain unit |
| application flow orchestration | Step 9 / 11 / 13 | UoW、repository、projection、outbox、幂等调用顺序 | application |
| adapter failure injection | Step 7 / 14 | source、boundary、runner、artifact、outbox 失败映射 | adapter |
| client / CLI / jobs entry | Step 8 / 9 | metadata、idempotency、exit code、job summary | integration |
| language package smoke | Step 5 / 8 | Rust / Python / TypeScript 错误和 trace 表达一致 | smoke |

### 7.3 接口测试切口汇总表

| 协议 | 正向测试 | 异常 / 边界测试 | 建议测试类型 |
|---|---|---|---|
| `UpdateSdkSemanticBaseline` | baseline version committed，outbox event appended | missing language、capability source missing、idempotency conflict | application |
| `RefreshDerivedBindingView` | source snapshots 派生 fresh view | source unavailable、digest mismatch、view version conflict | application |
| `InvokeServiceCapability` | formal / fake boundary 返回 result ref | unsupported capability、fake marker missing、boundary unavailable | facade + boundary |
| `PublishBusEvent` | bus boundary 返回 publish ref | payload body rejected、mapping missing、bus boundary unavailable | facade + boundary |
| `RecordCompatibilityDecision` | decision recorded，migration ref 可追溯 | missing evidence、breaking gate、outbox append failure | application |
| `DeprecateSdkApi` | lifecycle changed，deprecated event appended | missing migration ref、invalid lifecycle transition | application |
| 12 个 Query API | 命中 view / evidence / candidate / compatibility / migration ref | not found、stale marker、pagination、Query 不写入 | query |
| 4 个 Inbound Event Consumer | core / bus / formal / validation event 正常消费 | duplicate event、missing source ref、unredacted evidence rejected | consumer |
| 6 个 Outbound Event | event schema、topic、CloudEvent metadata 正确 | schema violation、forbidden body、publisher retry | contract + publisher |
| 8 个 Operations Job | freshness / candidate / build / smoke / docs / compatibility / boundary / projection 成功路径 | runner unavailable、failed evidence、job rerun、partial failure | job runner |

### 7.4 Outbound Event schema 测试切口

| Outbound Event | 正向测试 | 异常 / 边界测试 |
|---|---|---|
| `SdkSemanticBaselineChangedEvent` | baseline id、old / new version、capability summary ref 正确 | 不包含 baseline 正文或 source snapshot 正文 |
| `SdkSnapshotFreshnessChangedEvent` | source refs、freshness state、affected views 正确 | stale 不伪装 fresh |
| `PackageCandidateGeneratedEvent` | candidate id、baseline ref、language set 正确 | 不等同 public registry publish |
| `VerificationEvidenceRecordedEvent` | evidence kind、result、redaction status、artifact ref 正确 | unredacted evidence 不可发布为可引用证据 |
| `CompatibilityDecisionRecordedEvent` | decision state、candidate id、migration ref 正确 | missing evidence 不可发布 compatible |
| `DeprecatedApiRecordedEvent` | api ref、from / to lifecycle、migration ref 正确 | removed 不可绕过 pending removal |

### 7.5 状态机测试切口表

| 状态机 | 合法转换切口 | 非法转换切口 | 建议测试类型 |
|---|---|---|---|
| `SnapshotFreshnessState` | `Unknown -> PendingRefresh -> Fresh`、`Fresh -> Stale` | Query 把 stale 自动修成 fresh | domain + query |
| `CapabilitySupportState` | `Pending -> Supported / FakeOnly / Unsupported`、`Supported -> Pending` | `FakeOnly -> Supported` 无 formal API 依据 | domain |
| `PackageCandidateStatus` | `New -> Draft -> NotVerified -> Verified -> Stable`、`Stable -> Superseded` | `Failed -> Verified` 无新 evidence、`Superseded -> *` | domain + job |
| `EvidenceResult` | `NotVerified -> Passed / Failed / Skipped` | `Skipped -> Passed` 无新 runner result | domain |
| `EvidenceRedactionStatus` | `Unredacted -> Redacted` | `Redacted -> Unredacted` 覆盖原证据 | domain |
| `CompatibilityDecisionState` | `PendingEvidence -> Compatible / RequiresMigration / Breaking / Rejected` | `Breaking -> Compatible` 无新 evidence | domain |
| `DeprecatedApiLifecycleState` | `Announced -> Deprecated -> PendingRemoval -> Removed`、`* -> Superseded` | `Announced -> Removed`、`Superseded -> *` | domain |

### 7.6 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_same_key_same_digest_replays_receipt` | Step 13 Command 幂等 | 返回既有 receipt，不重复写 truth / outbox | application |
| `command_same_key_different_digest_conflicts` | Step 13 digest conflict | 返回 `Conflict`，不得覆盖旧记录 | application |
| `inbound_event_duplicate_is_skipped` | Step 13 event 幂等 | 重复 event 不重复写 view / evidence | consumer |
| `candidate_jobs_race_on_expected_version` | Step 13 candidate 并发 | build / smoke / docs / compatibility 并发只有合法转换成功 | concurrency |
| `outbox_publish_retry_uses_same_event_id` | Step 11 / 13 outbox | publish 失败重试不生成新 truth | publisher |
| `projection_rebuild_does_not_rewrite_truth` | Step 11 projection | rebuild 只改 projection，不改 truth | projection |
| `artifact_write_success_truth_commit_failure_orphan_invisible` | Step 11 artifact 恢复 | orphan artifact 不自动挂回 candidate | job + artifact |
| `runtime_boundary_replay_stores_only_ref` | Step 13 runtime boundary | replay 只返回 ref / diagnostic，不保存正文 | facade |

### 7.7 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `protocol_error_maps_to_exit_code_and_envelope` | Step 8 / 12 | six error codes、CLI exit code、retryable 字段一致 | contract + CLI |
| `runner_unavailable_is_dependency_error` | Step 12 | runner 不可用不同于 failed evidence | job |
| `failed_evidence_does_not_verify_candidate` | Step 10 / 12 | failed / skipped / unredacted 不支撑 verified / stable | domain + job |
| `runtime_config_rejects_disabled_redaction` | Step 14 | 配置不能关闭 redaction / credential 下限 | config |
| `formal_fake_bus_dependencies_are_ports` | Step 7 / 14 | 运行期依赖不写 Cargo path，不绕过 adapter | architecture test |
| `logs_metrics_audit_do_not_include_forbidden_body` | Step 15 | log / metric / audit / diagnostic 不含 raw body、secret、payload | redaction check |
| `metrics_use_low_cardinality_labels` | Step 15 | 指标标签不含 resource id、payload digest 全量 | unit / snapshot |
| `audit_written_for_write_and_evidence_paths` | Step 15 | 写路径、validation、boundary violation 都有 audit / evidence ref | application |

### 7.8 脚本与产物最小契约

| 脚本 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | `--run-id`、`--artifact-root`、`--profile` | 源码、local / fake profile | `artifacts/test/<run_id>` | 非 0 exit code，保留 failure artifact |
| `scripts/reports/generate_reports.sh` | `--run-id`、`--artifact-root`、`--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code，说明缺失 artifact |
| `scripts/checks/check_redaction.sh` | `--artifact-root`、`--report-root` | artifacts + reports | redaction check report | 发现 raw body / secret 时失败 |

约束：

- artifact root 固定为 `artifacts/test/<run_id>`，不再额外加项目名层级。
- report root 固定为 `reports/`，单次运行输出到 `reports/runs/<run_id>`。
- 脚本内部实现、fixture 组织和 CI 排期留给实施计划和测试方案。

---

## 8. 回填草稿

正式 `03-详细设计.md` §15 建议按以下结构回填：

```text
15. 测试切口与最小验证清单
  15.1 测试切口总图
  15.2 模块测试切口汇总表
  15.3 接口测试切口汇总表
  15.4 Outbound Event schema 测试切口
  15.5 状态机测试切口表
  15.6 一致性 / 幂等 / 并发测试切口表
  15.7 错误 / 配置 / 观测测试切口表
  15.8 脚本与产物最小契约
```

如果正式文档完全引用本文件 §7 的表格和图，Step 19 直接摘录即可，本节不重复粘贴。

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把完整测试方案写入详细设计 | A. 写入；B. 只写最小测试切口 | B | 测试计划属于 `05-测试方案.md` | 已按 B 写入 |
| Outbound Event 是否逐个测试 schema | A. 只测 publisher；B. publisher + 逐 event schema | B | 事件 payload 差异影响跨仓消费者 | 已按 B 写入 |
| P0 是否依赖真实 formal API / bus runtime | A. 依赖真实服务；B. local / fake / fixture profile 先验证语义 | B | SDK P0 不应被完整服务集群阻塞 | 已按 B 写入 |
| artifact / report 是否带项目名层级 | A. 带项目名；B. 不带，直接 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` | B | 与最新目录约束一致，避免重复层级 | 已按 B 写入 |

---

## 10. 进入下一步条件

进入 Step 17 前必须满足：

- 每个主要模块至少有一个最小测试切口。
- 每类协议都有正向和异常测试入口，关键协议能回指 Step 8 / 9。
- 7 个正式状态机都有合法和非法转换测试切口。
- 事务、一致性、幂等、并发、outbox、projection、artifact、redaction 和 audit 都有最小验证入口。
- 测试方案专属内容已经明确后移到 `05-测试方案.md`。
