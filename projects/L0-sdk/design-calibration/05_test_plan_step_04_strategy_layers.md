# L0-sdk 05 测试方案 Step 4:制定测试策略与分层

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §4 测试策略与分层
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 制定测试策略与分层 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_04_strategy_layers.md` |

本步决定 Step 3 抽出的每类风险应该在哪个测试层被发现。正式 `05-测试方案.md` 仍不修改，Step 15 统一删除旧文件后重建。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_03_test_objects_slices.md` | 继承 P0 测试对象、测试切口和正式状态名口径 |
| `03-详细设计.md` §5 / §8 / §10 / §12 / §15 | 继承模块边界、处理流、事务、幂等、并发和最小测试切口 |
| `04-配置设计.md` §12 | 继承配置测试对象、profile、fail-fast / fail-closed 和证据路径 |
| `05_test_plan_step_02_scope.md` | 继承 P0 必须阻断、P1/P2 接缝验证和一票否决范围 |

## 3. SOP 问题回答

### 3.1 哪些问题必须在 unit 层发现?

| 问题类型 | 代表对象 | Unit 层断言 |
|---|---|---|
| domain 不变量 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | language set、capability support、concept drift、upstream ref 必须本地可判定 |
| 状态转换 | `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus` | allowed / forbidden transition 不依赖 repository 或 runner |
| evidence 与 redaction 分离 | `VerificationEvidence`、`EvidenceResult`、`EvidenceRedactionStatus` | `Redacted` 不等于 `Passed`，`Skipped` 不支撑 `Stable` |
| policy guard | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | raw body、plain secret、fake success、unredacted evidence 在本层拒绝 |
| compatibility / deprecated 规则 | `CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` | breaking、requires migration、pending removal、removed 的本地规则稳定 |

Unit 层必须快速、确定性、无外部依赖。任何一票否决级别的 domain / policy 规则不能只靠 smoke 或 release gate 才发现。

### 3.2 哪些问题必须在 service 层验证编排?

| 问题类型 | 代表服务 | Service 层断言 |
|---|---|---|
| 写路径编排 | `SdkSemanticBaselineService`、`ContractConsumptionService` | 幂等检查早于状态修改，truth / projection / outbox 写入顺序正确 |
| runtime boundary 不写 truth | `ServiceClientAssemblyService`、`EventClientAssemblyService` | formal / fake / bus boundary 返回 result ref，但不改写 SDK truth |
| candidate 门禁 | `PackageCandidateService`、`CandidateValidationService` | freshness、evidence、redaction、compatibility 未满足时不得推进 candidate |
| compatibility / deprecated 编排 | `CompatibilityGovernanceService` | missing evidence、missing migration ref、breaking / rejected 能阻断 |
| query 只读 | `QueryService` | query 不开启写事务，不触发 refresh / rebuild / candidate / compatibility 状态变化 |

Service 层使用 fake repository、fake port、fake runner 和可控 UoW，目标是验证 application service 对 domain、repository、projection、outbox、idempotency 的编排顺序。

### 3.3 哪些问题必须依赖 DB / adapter / worker 集成测试?

| 问题类型 | 集成对象 | Integration 层断言 |
|---|---|---|
| repository / UoW | repositories、`UnitOfWork`、idempotency store | expected version、unique key、rollback、same key replay、same key conflict |
| projection / outbox | projection ports、`SdkOutboxPort`、publisher | required projection 同事务，publish retry 同 event id，rebuild 不反写真相 |
| source / boundary adapter | core / bus / formal source、formal / fake / bus boundary | source unavailable、digest mismatch、fake marker、boundary error mapping |
| runner / artifact / report | generator、builder、smoke、docs、compatibility、boundary verifier、artifact store、report generator | runner failed / skipped 不伪装 passed，artifact / report root 符合路径规则 |
| config runtime assembly | `ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder` | strict JSON、unknown / repeated key、cross-field、raw secret、disable redaction、unsupported profile |

Integration 层可以使用 in-memory 或 local filesystem adapter，但必须验证真实 adapter 行为和路径语义。它不是完整 E2E，不依赖公共 registry 或生产 endpoint。

### 3.4 哪些问题需要 API / contract test?

| 问题类型 | Contract 对象 | Contract 层断言 |
|---|---|---|
| DTO schema | Command / Query / Event / Job DTO | required fields、serde roundtrip、字段缺失、类型错误和错误 envelope |
| protocol field closure | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`RunCrossLanguageSmoke` 等 | DTO 字段足以构造目标 domain 对象，不需要实现者脑补 |
| event contract | inbound / outbound event | topic、CloudEvent metadata、event id、source ref、idempotency key、forbidden body |
| job input / output | operations job JSON input / receipt | `job_run_id`、target id、profile、artifact root、report root、failure summary |
| language surface shape | Rust facade、Python / TypeScript package surface | public surface 与 semantic baseline 对齐，不定义第二套 truth |

Contract 层主要防止“文档里对象完整，但协议字段不闭合”的实现阻塞。该层不验证完整业务流程，完整流程由 service / integration / smoke 承接。

### 3.5 哪些场景才需要 E2E 或 release gate?

| 场景 | Gate 层用途 | 进入条件 |
|---|---|---|
| cross-language smoke | 证明 Rust / Python / TypeScript 对同一 candidate 的核心概念、错误、trace、redaction 和 event view 一致 | unit、service、contract 先通过 |
| docs example validation | 证明 quickstart、docstring 和 examples 可运行且与真实 client 行为一致 | package candidate 已生成并可安装 |
| candidate validation gate | 汇总 package build、smoke、docs、boundary、compatibility、redaction 和 report evidence | 所需 evidence 均可追溯 |
| CI redaction gate | 扫描 artifacts / reports / logs / evidence 是否含 raw body 或 secret | 每次 CI / candidate validation |
| release-like local gate | 验证本地 `Stable` 只代表本地稳定基线，不触发 public registry publish | candidate 已 verified 且 compatibility 允许 |

P0 不要求公共 registry E2E。release gate 在当前只验证 local package candidate 和证据链，不测试 crates.io / PyPI / npm 发布。

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 旧分层把“事件链测试 / 恢复专项 / 端到端”混在一起，没有明确哪些风险应在 unit / service / contract / integration 层提前发现 |
| `03-详细设计.md` §15 | 已提供模块测试切口、接口切口、一致性 / 幂等 / 安全切口和脚本最小契约，可作为 Step 4 分层依据 |
| `04-配置设计.md` §12 | 已明确配置测试方向，应进入 integration 和 CI gate，而不是只作为手工检查 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 分层依据 | 旧功能链和测试类型混排 | 以 Step 3 风险切口决定测试层 |
| 高风险发现位置 | 容易后移到 smoke / E2E | domain / policy / service / contract 尽早发现，高层 gate 只做闭环证明 |
| Contract test | 未清晰独立 | 单独验证 DTO、event、job input / receipt、language surface shape |
| Integration test | 粗略等同“跑起来” | 明确覆盖 repository、adapter、config、artifact、report、outbox、projection |
| Release gate | 容易误解为 public registry 发布 | 当前只验证 local candidate 与证据链，不触发公共发布 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否把所有 P0 风险推到 E2E | 不允许 | E2E 定位闭环证明，不适合定位字段、状态、policy 和事务缺陷 |
| 是否需要完整真实 DB | 当前不强制 | P0 可用 in-memory / local filesystem adapter，但 repository 语义必须与接口契约一致 |
| 是否需要真实 production endpoint | 当前不需要 | formal / fake boundary 可证明最小接入，production endpoint 属 P1/P2 |
| 是否把 redaction 只放在专项安全测试 | 不只放专项 | redaction 同时进入 unit、integration 和 CI gate |
| 是否把 Python / TypeScript 作为 domain 测试对象 | 不作为 domain truth | 语言包进入 contract / smoke / surface consistency |

## 7. 结构化中间产物

### 7.1 测试分层图:L0-sdk 测试金字塔

```text
                 [Local candidate gate]
                          ^
                          |
             [Smoke / docs / redaction gate]
                          ^
                          |
      [Contract / API / event / job schema tests]
                          ^
                          |
 [Integration: repository / adapter / config / artifact]
                          ^
                          |
       [Service: application flow and UoW orchestration]
                          ^
                          |
       [Unit: domain object / enum / policy invariant]
```

关键说明：

- 越靠下越早执行、越确定、越适合定位缺陷。
- 越靠上越接近用户闭环和验收证据，但不承担基础不变量发现职责。
- `Local candidate gate` 不等于 public registry release gate。
- `Contract` 层独立存在，用于阻止 DTO / event / job input 字段不闭合。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 快速发现对象不变量、状态迁移和 policy guard 破坏 | domain object、enum transition、redaction / credential / fake guard、compatibility rule | 本地开发、PR、CI 最早阶段 | P0 失败阻断 |
| Service | 验证 application service 编排、UoW、idempotency、projection、outbox 和只读规则 | command flow、query flow、candidate gate、compatibility flow、runtime no-write flow | PR、CI 主测试阶段 | P0 失败阻断 |
| Integration | 验证 repository、adapter、runner、artifact、report、config 和 outbox 的真实接缝行为 | in-memory / local adapter、filesystem artifact、config loader、source / boundary failure injection | CI、candidate validation 前 | P0 失败阻断 |
| Contract | 验证 DTO、event、job input / receipt、error envelope 和 language surface shape 稳定 | serde roundtrip、required fields、topic、CloudEvent metadata、schema diff | PR、CI、上游 contract 变化后 | P0 失败阻断 |
| Smoke / docs gate | 验证三语言 package candidate、quickstart、docs example 和最小接入路径可运行 | Rust / Python / TypeScript smoke、docs runner、fake / formal target | candidate validation | P0 失败阻断 candidate verified |
| CI redaction / evidence gate | 验证 artifacts、reports、logs、evidence 不含 forbidden body，并形成证据目录 | `scripts/checks/check_redaction.sh`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` | 每次 CI / candidate validation | P0 失败阻断 |
| Local candidate gate | 汇总 package build、smoke、docs、boundary、compatibility、redaction 和 report evidence | `scripts/gates/run_ci_gate.sh`、candidate status、compatibility decision | candidate stable 前 | 失败阻断 `Stable` |

### 7.3 Step 3 切口到测试层映射

| Step 3 切口 | 主测试层 | 辅助层 |
|---|---|---|
| Domain objects and policies | Unit | Service |
| Application services | Service | Integration |
| Repositories and projections | Integration | Service |
| Source / boundary / runner adapters | Integration | Smoke / gate |
| Protocols and DTOs | Contract | Service |
| State machines | Unit | Service |
| Config loader / validator / builder | Integration | CI gate |
| Observability and evidence output | Integration | CI redaction / evidence gate |
| Client / CLI / job entries | Integration | Smoke / gate |

### 7.4 阻断策略表

| 失败类型 | 阻断位置 | 说明 |
|---|---|---|
| domain / policy 一票否决失败 | Unit | 不进入 service 和 smoke |
| DTO 字段缺失或 schema 不闭合 | Contract | 不进入实现流测试 |
| service 编排或事务错误 | Service | 不进入 integration gate |
| adapter / config / artifact / outbox 失败 | Integration | 不进入 candidate validation |
| smoke / docs / redaction failed | Smoke / CI gate | candidate 不得 `Verified` |
| compatibility breaking / rejected | Local candidate gate | candidate 不得 `Stable` |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §4 时摘录。

```markdown
## 4. 测试策略与分层

> 校准来源：
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`

本轮采用风险前移的测试分层策略。domain object、enum transition 和 policy guard 在 Unit 层发现；application service 的 UoW、idempotency、projection、outbox 和只读规则在 Service 层验证；repository、adapter、runner、artifact、report、config 和 outbox 接缝在 Integration 层验证；Command / Query / Event / Job DTO、event schema、job input / receipt 和 language surface shape 在 Contract 层验证；三语言 package candidate、quickstart、docs example、redaction 和 compatibility 证据进入 Smoke / CI / Local candidate gate。

高风险项不得只依赖 E2E 或 release gate 才发现。当前 local candidate gate 只证明本地 package candidate 和证据链成立，不等于 public registry 发布。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| P0 是否需要真实持久化 DB 集成测试 | 当前不强制,先用 in-memory / local filesystem adapter 验证契约 | L0-sdk P0 不是常驻服务,后续 durable adapter 可追加专项 |
| Contract 层是否要覆盖 Python / TypeScript package surface | 是,覆盖 surface shape 和 smoke,但不当作 domain truth | 防止三语言 public API 漂移 |
| Local candidate gate 是否允许触发 public registry publish | 不允许 | public registry 不是当前 P0 前置 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 测试分层图已明确 | 已满足 |
| 测试分层表已明确 | 已满足 |
| Step 3 全部 P0 切口均有目标层级 | 已满足 |
| 高风险前移策略已明确 | 已满足 |
| 每层失败是否阻断已明确 | 已满足 |

Step 5 可以在本文件被确认后开始,主题是建立需求追溯与覆盖矩阵。
