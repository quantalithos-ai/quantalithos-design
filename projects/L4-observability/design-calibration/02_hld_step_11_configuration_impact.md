# L4-observability 02-概要设计 Step 11 · 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 12

---

## 1. 本步目标

在主要组成部分、对象、接口、处理流、状态机和异常边界已经收稳的前提下,识别 `L4-observability` 哪些概要层结构会受到配置影响,哪些边界禁止配置化,以及哪些配置实现契约应交给 `03-详细设计.md` 继续展开。

本步只识别配置影响轮廓,不定义配置项清单、默认值、JSON / YAML / TOML 示例、环境变量名、密钥名称、`RuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 参数、配置加载函数实现、部署挂载、热更新流程、产品参数、测试指标或实施方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 11 | 已读取 | 约束本步必须输出配置影响轮廓表、禁止配置化边界表和详细设计承接方向。 |
| `standards/document/概要设计书写规范.md` 4.11 | 已读取 | 约束配置影响表字段、禁止配置化边界和禁止提前写配置实现细节。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、redaction-first、body-free、query no-write、consumer non-truth、job non-repair 和依赖裁剪硬约束。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 Inbound、Operations、Application Services、Domain Model、Ports、Persistence、Projection、Outbox / Handoff 等代码主体骨架。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责、非职责和外部接缝边界。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Outbound Event、Operations Job 五类入口和外部 handoff / export 主语。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供配置会影响的 intake、read、consumer、job、outbox、handoff、reference refresh 和 derived maintenance 主路径。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止被配置绕过的状态机红线、禁止迁移和传播关系。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供配置不能吞掉的异常、降级、blocked、not-visible、dead-lettered 和 no-repair surface。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供外部产品只作为配置候选、旧指标不作为硬验收、redaction / evidence / retention / no-write 配置不可越界。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供运行承载、产品中立适配、外部配置不成为 truth source 和部署 / 运行职责分离。 |
| `projects/L1-governance/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 作为 Step 11 配置影响表、禁止配置化表和契约方向粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 作为 Step 11 外部接缝、Domain 不直读配置和 `04-配置设计` 边界粒度参考。 |
| 旧 `02_hld_step_11_configuration_impact.md` | 已读取 | 仅作 historical material,识别其 schema 摘要化、配置影响缺失和旧自动顺推门禁问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 11 标准、Step 03~10、旧 Step 11 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,限定配置影响轮廓边界 | done | 本文件 §4 |
| 诊断旧材料和配置串线风险 | done | 本文件 §5 |
| 输出配置设计取舍 | done | 本文件 §6 |
| 输出配置影响轮廓表 | done | 本文件 §7 |
| 输出禁止配置化边界表 | done | 本文件 §8 |
| 判断是否需要配置影响图并输出 | done | 本文件 §9 |
| 输出详细设计配置实现契约方向 | done | 本文件 §10 |
| 明确 `04-配置设计` 后移内容 | done | 本文件 §11 |
| 完成 Step 12 移交、回填草稿、自检和门禁 | done | 本文件 §12~§16 |

---

## 4. SOP 问题回答

### 4.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

会受到配置影响的结构集中在运行承载、外围接缝和派生维护:

- Inbound / consumer / operations 入口: `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer`、Command intake、Query intake、Inbound Event Consumer、Operations Job runner。
- 外部 adapter / reference seam: `ObservationSourceAdapterPort`、`IdentitySubjectReferencePort`、`GovernanceArtifactEvidenceReferencePort`、`RuntimeSandboxSummaryPort`、`ArchiveReportHandoffPort`、`EvidenceReferencePort`、`HandoffPreparationPort`。
- 只读与派生: `ObservationReadModelStore`、`SafeSignalProjectionStore`、`GapStatusView`、`DiagnosticView`、`DashboardAlertExportView`、`PeripheralReadStore`、`EvidenceIndexInputView`。
- 后台维护和传播: `ProjectionMaintenanceJob`、`ReferenceRefreshJob`、`GapScanJob`、`RollupRebuildJob`、`PublishObservationOutbox`、`RebuildObservationReadModels`、`RebuildPeripheralViews`、`CoordinateObservationReplay`。
- handoff / export / peripheral 接缝: report handoff、external audit / GRC export、archive feedback、report consumer feedback、dashboard / alert / management report 只读消费边界。
- 产品中立采集 / 存储 / 展示 / 导出能力候选:这些能力可以作为 adapter、store、export 或消费方配置候选,但不能成为 observation truth source。

### 4.2 哪些模块只能间接受配置影响,不能直接读取配置?

Domain Model、Domain Policy、状态机和核心 observation truth 只能通过 application service 注入的已验证输入、policy basis、adapter capability、safe summary、reference snapshot、freshness decision、visibility decision 或 job scope 间接受配置影响。以下结构不得直接读取 runtime config:

- `ObservationReceipt`、`SafetyDisposition`、`CorrelationContext`、`SafeSignal`、`AuditProjection`、`EvidenceLinkage`、`ReportHandoffRecord`、`AuthenticityHint`、`RetentionMarker`、`ActiveReferenceProtection`、`NoWriteViolation`、`GapState` 等 Domain Model。
- `SafetyDispositionPolicy`、`SafeSignalPolicy`、`BodyFreeLinkagePolicy`、`EvidenceVisibilityPolicy`、`AuthenticityHintPolicy`、`NoWriteGuardPolicy`、`ReadVisibilityPolicy`、`DegradedOutputPolicy`、`ReferenceFreshnessPolicy`、`PeripheralExportPolicy` 等 Domain Policy。
- `ObservationReceiptState`、`SafetyDispositionState`、`EvidenceLinkageState`、`HandoffReadinessState`、`RetentionMarkerState`、`ReplayScopeState`、`NoWriteViolationState`、`ReadVisibilityState`、`GapState`、`OutboxPublicationState` 等状态机。

它们不能因为运行 profile、feature policy、外部产品配置、consumer profile 或降级开关而改变 truth 归属、redaction-first、body-free、no-write、状态迁移红线或审计 / history 成立边界。

### 4.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- `L4-observability` 只拥有 observation truth、audit projection、body-free evidence linkage、report handoff record、retention marker、active reference protection、replay / rebuild scope、no-write violation、projection / outbox / handoff / gap / reference marker。
- raw body、secret、credential、payload body、source audit body、evidence body、artifact body、runtime body、provider response body 和外部完整正文不得入仓。
- redaction-first、body-free evidence linkage、not-visible vs missing、placeholder evidence 不得被配置开关绕过或合并。
- Query no-write、Consumer 不写外部 truth、Job 不修复 source truth、Replay 只作用 observation side。
- retention hold、active reference protection、release eligibility、archive handoff、source cleanup 和 archive package truth 必须分离。
- accepted observation truth、history、outbox stale marker、command result 和 audit transition 的同一成立边界不得被配置拆散。
- outbox / handoff / export / projection failure 不回滚已提交 truth,也不把 downstream rejection 变成本仓 truth。
- `L0-core` 唯一编译期依赖、`L0-bus` 事件协作、sibling repo 运行期 / handoff / ref / summary 协作的依赖裁剪纪律不得被配置改变。

### 4.4 哪些配置影响需要在 `03-详细设计.md` 继续定义实现契约?

详细设计需要继续定义:

- `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、runtime builder 和 application service 注入边界。
- `AdapterConfig`、`JobConfig`、`ReadConfig`、`ConsumerConfig`、`PublisherConfig`、`HandoffConfig`、`ExportConfig`、`RetentionPolicyConfig`、`RedactionPolicyConfig` 的分类、owner 和校验关系,但字段全集留给详细设计实际闭口。
- 配置校验失败时是启动阻断、adapter disabled、consumer delayed、job skipped、read degraded、handoff blocked 还是 export unavailable。
- 配置变更如何进入 history、operations report、diagnostic surface、handoff record 或验收证据候选,且不得伪造真实 evidence alias 或 signoff。
- store / bus / search / object store / external audit / dashboard / alert / archive / source adapter 的承载选择如何在不改变 truth 语义的前提下注入。

### 4.5 哪些配置细节属于 `04-配置设计`,不能在概要设计中提前展开?

以下内容属于后续 `04-配置设计.md`、测试方案、验收标准或实施计划:

- config key、env var、文件格式、目录结构、默认值、单位、上限、下限和 profile 名称。
- secret 名称、证书、token、endpoint、network policy、部署挂载和密钥轮换。
- DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert sink、external GRC 等产品参数。
- retry 次数、backoff、cron、batch、cursor、parallelism、dead-letter、quarantine、retention days、freshness threshold 和具体容量 / SLO / P95 / P99 数字。
- rollout、feature flag 名称、灰度策略、热更新语义和运维手册。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 11 | 内容仍是 log / metric / trace / audit schema 摘要,没有回答哪些结构受配置影响 | 全量替换为配置影响轮廓。 |
| 旧 Step 11 | gate 使用旧自动顺推门禁,违背当前“一 Step 一确认”纪律 | 改为 `wait_user_confirmation_before_step_12`。 |
| 旧正式 `02-概要设计.md` | 历史正文没有单独的配置影响边界,容易把产品候选、P95、冷存、hash chain 写成当前概要事实 | 当前保持产品中立,只记录配置影响位置和禁止配置化边界。 |
| README / 历史材料 | TimescaleDB、Grafana、Prometheus、OTel、P95、事件数量、冷存天数等历史假设容易被写成配置基线 | 全部保留 historical material;具体产品 / 数值后移 `04/05/06/07`。 |
| Step 10 异常红线 | 如果不单独写禁止配置化边界,实现期可能用开关吞掉 body-blocked、not-visible、placeholder、dead-lettered 或 no-write violation | 本步将这些红线列入禁止配置化表。 |
| Domain / Policy 风险 | 若允许 Domain 直接读配置,不变量会变成运行开关 | 本步明确 Domain / Policy / 状态机只能间接受已验证配置影响。 |

---

## 6. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层列完整配置项 | 不列 | 配置项、默认值和文件结构属于 `04-配置设计.md` 与详细设计契约。 |
| 是否允许 Domain / Policy / 状态机直接读取配置 | 不允许 | 防止运行配置改变 truth ownership、状态迁移和安全红线。 |
| 是否允许配置影响 adapter / consumer / job / handoff / export | 允许,但受控 | 这些是运行承载和外围接缝,需要部署和运维弹性。 |
| 是否允许配置改变 redaction / body-free / no-write 结论 | 不允许 | 这些是本仓存在前提和一票否决边界。 |
| 是否在本步锁定外部产品 | 不锁定 | 外部产品只能是产品中立候选,后续配置 / 实施 / ADR 再闭口。 |
| 是否把 retry / DLQ / freshness threshold 具体值写入本步 | 不写 | Step 11 只记录影响类别和详细设计承接方向。 |
| 是否补配置影响轮廓图 | 补 1 张 | L4 配置影响跨 runtime builder、entry、adapter、job、domain 和 derived / handoff surface,图示有助于避免 Domain 直读配置。 |

---

## 7. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `Observation Intake and Safety` | 是 | endpoint enablement、request size、timeout、redaction policy、source family allowlist、quarantine / rejected surface、idempotency store adapter | 定义 intake / redaction config owner、validator、builder 注入和 failure surface;不得允许 raw body 入仓或绕过 safety disposition。 |
| `Correlation and Safe Signal` | 是 | trace / correlation header mapping、source ref adapter、safe label policy、metric / trace admission policy、rollup window category、freshness policy | 定义 correlation / signal config 和 safe label validation;不得把 opaque id、runtime cache 或 high-cardinality label 升级为 business truth。 |
| `Audit Projection and Body-free Evidence Linkage` | 是 | source audit adapter、evidence reference adapter、body-free policy、visibility policy、digest / canonicalization category、projection store adapter | 定义 audit / evidence config 注入和 validation;不得允许 evidence body、source audit body 或 Governance / Artifact truth 入仓。 |
| `Report Handoff and Authenticity` | 是 | report consumer target、handoff profile、evidence index input policy、authenticity hint policy、receipt handling、delivery mode | 定义 handoff / authenticity config 和 blocked / degraded surface;不得把 handoff ready / delivered 变成 final verdict、real run id、evidence alias 或 signoff。 |
| `Retention, Replay and No-write Guard` | 是,严格受控 | retention policy category、hold / release classification、active reference protection policy、replay scope admission、no-write guard profile | 定义 retention / replay config validation 和 job scope 注入;不得越过 active hold、授权 source cleanup 或允许 replay 修复 source truth。 |
| `Read Query and Diagnostic Consumption` | 是 | page limits、read model selection、consistency hint、visibility policy、redacted / restricted / degraded / unavailable response strategy | 定义 read config、visibility config 和 degraded surface;不得允许 Query refresh、rebuild、replay、repair 或写 source truth。 |
| `Gap and Degraded Expression` | 是 | gap classification policy、degraded output policy、suppression visibility policy、scan scope category、consumer-facing surface profile | 定义 gap config 和 policy basis 注入;不得把 suppressed 配成 resolved,也不得把 blocked 输出替代 success。 |
| `Peripheral Consumption and Export` | 是 | dashboard / alert / management report target、external audit / GRC export target、export scope、delivery mode、consumer profile | 定义 peripheral / export config、receipt validation 和 failure marker;不得让 external consumer 或 product state 成为 truth source。 |
| `Product-neutral Adapter and Reference Support` | 是 | source adapter enablement、schema version allowlist、reference family allowlist、snapshot refresh cadence、stale threshold category、safe summary policy | 定义 adapter / reference / snapshot config owner 和 invalid / unavailable surface;不得复制外部正文或替代外部 lifecycle truth。 |
| `Derived Maintenance and Replay Coordination` | 是 | job schedule、batch shape、cursor category、parallelism、retry class、rebuild scope、progress visibility、operator actor profile | 定义 job config、run metadata、idempotency 和 failure surface;不得把 job 变成业务 command 或 source repair。 |
| `ObservationSyncEntry` / Command intake | 是 | endpoint enablement、request limits、timeout、idempotency store adapter、actor / metadata admission profile | 定义 command entry config 和 runtime builder 注入;不得关闭 `ActorContext`、`CommandMetadata`、idempotency key 或 trace context 门禁。 |
| Query intake | 是 | page limits、filter allowlist、consistency hint、projection fallback、not-visible response profile | 定义 query config 和 response contract;不得允许 Query 触发 refresh、repair、replay 或泄露不可见正文。 |
| Inbound Event Consumer | 是 | subscribed source family、schema version allowlist、dedup store、delayed / quarantine disposition、consumer profile | 定义 consumer config、envelope validation 和 duplicate handling;不得让 consumer 猜 schema、保存正文或创建外部 truth。 |
| Outbound Event / outbox publication seam | 是 | publisher adapter、routing target、publish retry class、delivery mode、dead-letter visibility category | 定义 publisher config、publication state 和 failure marker;不得让 publish failure 回滚已提交 observation truth。 |
| Operations Job runner | 是 | schedule、batch、cursor、parallelism、retry class、run actor、job idempotency store | 定义 job runner config、job metadata 和 `ConfigError` surface;不得绕过 no-write、retention 和 active reference guard。 |
| Report handoff / archive / external audit seam | 是 | target adapter、export / handoff scope、receipt handling、delivery mode、consumer-specific body-free policy | 定义 `HandoffConfig` / `ExportConfig` 和 failed / blocked / retryable marker;不得生成真实验收结论或 evidence body。 |
| Storage / projection / read model承载 | 是 | store root、repository adapter、projection store adapter、read index adapter、retention of derived view | 定义 persistence / projection adapter config 和 migration contract;承载选择不得改变 truth / projection / handoff / history 语义。 |
| `L0-bus` event collaboration seam | 是 | event source family、consumer subscription category、publisher adapter、routing profile、trace context mapping | 定义 bus adapter config;不得把 bus ack / retry / dead-letter / replay 主干 truth 迁移到本仓。 |
| 产品中立采集 / 存储 / 展示 / 导出候选 | 是,外围候选 | external endpoint、secret ref、product profile、dashboard / alert / APM / GRC adapter、export adapter | 定义 adapter config 和 capability boundary;不得把外部产品状态、存储或配置变成 observation truth source。 |
| Domain Model / Domain Policy / 状态机 | 间接受影响 | validated policy basis、adapter capability、safe summary、reference snapshot、job scope、visibility decision | 详细设计只允许通过 application service 注入已校验输入;Domain 不直接读 config,不让配置改写 invariant。 |
| `ObservationTruthStore` / `AuditProjectionStore` / `ViolationRecordStore` | 间接受影响 | repository adapter、store root、transaction boundary category、history / audit store承载 | 定义 persistence config 和 repository injection;不得配置拆散 truth、history、outbox、result 的成立边界。 |

---

## 8. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Observation truth 归属 | 本仓存在理由不能由运行 profile、adapter 或 feature policy 改变 | `00-需求文档.md` / `01-架构设计.md` 重新评审 |
| 外部 truth 不归属本仓 | 防止 Governance、Artifact、Identity、Runtime、Sandbox、Archive、Console 或 product truth 被 L4 接管 | 需求边界 / 架构上下文 |
| raw body、secret、payload body、source audit body、evidence body、runtime body、provider response body 不入仓 | redaction-first 和 forbidden body 是一票否决边界 | 需求规则 / 安全设计 / 数据归属 |
| redaction-first | 任何观察输出和交接输出都必须先经过安全处置 | 安全规则 / 详细设计 policy |
| body-free evidence linkage | evidence body 不得因为配置进入 `EvidenceLinkage` 或 handoff | evidence / audit 详细设计 |
| not-visible 不得映射成 missing 或 success | not-visible 是可见性语义,不能泄露也不能伪装 | read / evidence visibility 详细设计 |
| placeholder evidence 不得变成 real evidence | 防止设计阶段伪造真实 evidence alias、run id、signoff 或验收结论 | report / acceptance 真实执行与验收流程 |
| Query no-write | 防止读取路径刷新、修复、重建、重放或反写 source truth | query contract / 架构通信方式 |
| Consumer 不写外部业务 truth | 防止外部事件绕过 actor、policy 和 Command 入口 | consumer 详细设计 |
| Job 不修复 source truth | 防止 rebuild / refresh / scan / handoff 成为隐式业务写源 | operations 详细设计 |
| Replay 只作用 observation side | 防止 replay 修复 runtime、artifact、governance、identity 或 archive truth | replay / maintenance 详细设计 |
| retention hold 与 active reference protection | 防止配置允许 release、cleanup 或 destructive replay 删除仍被引用材料 | retention / archive / no-write 设计 |
| source cleanup 与 archive package truth 不归本仓 | L4 只标记 observation hold / archive eligibility / handoff | 架构数据所有权 / archive 设计 |
| Gap suppressed 不等于 resolved | suppression 是可见性策略,不是缺口解决 | gap / degraded 详细设计 |
| DegradedOutput blocked 不得生成替代成功输出 | blocked 必须阻断输出,不能被消费 profile 伪装成功 | read / handoff / export contract |
| outbox publish failure 不回滚 truth | 下游可用性不能改变已提交 observation truth | outbox / bus 详细设计 |
| dead-lettered 必须可见 | 不可恢复传播失败不能被开关静默隐藏 | operations / publication 详细设计 |
| handoff delivered 不等于 final verdict / signoff | 交付状态不是验收结论 | report / acceptance handoff 设计 |
| external audit / GRC export 不成为 external truth | export 只是消费面材料,不反向定义 L4 truth | peripheral / external audit 设计 |
| reference snapshot 不替代外部 lifecycle truth | snapshot 只是本地 safe summary / freshness / resolution | adapter / reference 详细设计 |
| Domain / Policy / 状态机不直接读配置 | 防止 runtime config 改写不变量、状态迁移和安全边界 | detailed design dependency injection |
| truth、history、outbox、stale marker、command result 同一成立边界 | 防止半成立事实、补造 history 或重复发布 | 事务 / persistence 详细设计 |
| `L0-core` 唯一编译期依赖 | 防止通过配置或产品集成引入 sibling repo 编译期耦合 | 全局依赖裁剪 / 架构设计 |
| `L0-bus` 只作为事件协作边界 | bus 主干 ack / retry / dead-letter / replay truth 不归本仓 | bus / communication 详细设计 |
| 外部产品不得成为 truth source | 防止 TimescaleDB、Grafana、Prometheus、OTel、APM、GRC 等产品配置反向定义平台语义 | 技术选型 / 配置设计 / ADR |
| 旧 P95、冷存、hash chain、事件数量不得升级为配置基线 | 旧材料缺少当前校准来源和验收支撑 | 测试方案 / 验收标准 / 实施计划 |

---

## 9. 配置影响轮廓图

```text
+====================================================================+
|               Observation Configuration Impact Boundary            |
+====================================================================+
| Runtime configuration source                                        |
|   |                                                                 |
|   +--> Runtime / adapter / entry / job / handoff builders           |
|   |       | validate config and wire allowed dependencies           |
|   |       v                                                         |
|   |   Inbound / Consumer / Query / Operations / Handoff seams       |
|   |       | pass validated limits, targets, schedules, profiles     |
|   |       v                                                         |
|   |   Application services                                          |
|   |       | receive ports, scopes, policy basis, visibility results  |
|   |       v                                                         |
|   |   Domain model / policy / state machines                        |
|   |       | no direct config read; invariants remain fixed           |
|   |       v                                                         |
|   |   Observation truth / audit / retention / gap / handoff records |
|   |                                                                 |
|   +--> Derived / publication / reference / export controls          |
|           | rebuild / refresh / publish / delivery cadence          |
|           v                                                         |
|       Projection / outbox / snapshot / peripheral failure surfaces  |
+====================================================================+
```

关键说明:

- 配置只进入 runtime builder、entry、adapter、consumer、job、outbox、handoff、export 和 derived maintenance 接缝。
- Application service 只能接收已校验配置产生的 ports、scope、targets、schedules、visibility decision、policy basis 或 degraded strategy。
- Domain Model、Domain Policy 和状态机不直接读取配置,也不允许配置改变 redaction-first、body-free、no-write、retention protection 或状态迁移红线。
- 图不表达配置加载实现、JSON 示例、环境变量、密钥系统、部署挂载、产品参数、热更新或 retry / DLQ 细节。

---

## 10. 配置实现契约交给详细设计的方向

| 契约方向 | 详细设计需要回答 | 不在概要设计展开 |
|---|---|---|
| Config ownership | 哪个 runtime owner 负责 command、query、consumer、job、handoff、export、adapter、publisher、projection 配置读取和校验 | config 文件路径、key、env var、profile 名称 |
| Config validation | 哪些配置错误导致启动阻断、adapter disabled、consumer delayed、job skipped、read degraded、handoff blocked 或 export unavailable | 完整 `ConfigError` enum、错误码、错误消息 |
| Runtime builder injection | `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer`、read services、operations jobs、handoff / export services 如何接收已验证依赖 | constructor 参数全集和 DI 框架 |
| Adapter config | source owner、identity、governance、artifact / evidence、runtime、sandbox、archive、bus、external audit、dashboard / alert adapter 如何配置 | endpoint、secret、topic、产品参数、网络参数 |
| Redaction / safety config | redaction policy、forbidden body disposition、quarantine / rejected surface、safe summary policy 如何表达和校验 | 具体策略清单、默认值、算法和 sample payload |
| Evidence / audit config | evidence ref allowlist、body-free validation、digest category、visibility policy、audit projection adapter 如何注入 | hash 算法、字段级 schema、source-specific mapping |
| Read config | page limits、consistency hint、projection fallback、restricted / redacted / not-visible / degraded response policy 如何表达 | 默认值、response 字段组合样例 |
| Consumer config | schema version、source family、dedup、quarantine / delayed / ignored / stale disposition 如何表达 | payload schema、DLQ 名称、consumer group、topic |
| Publisher / outbox config | publisher adapter、routing、retry class、dead-letter visibility、publication state mapping 如何表达 | retry 数字、backoff、topic、dead-letter payload |
| Job config | rebuild / refresh / scan / rollup / replay / handoff / export 的 schedule、batch、cursor、parallelism、retry class 如何表达 | cron、具体数字、恢复脚本、运维步骤 |
| Retention / replay config | hold category、release eligibility class、active reference protection、replay scope validation 如何表达 | retention days、legal hold 细则、cleanup 实现 |
| Handoff / export config | report consumer、archive handoff、external audit / GRC export、receipt validation 和 delivery failure surface 如何表达 | target-specific envelope、receipt schema、外部产品参数 |
| Config change audit | 高风险配置变更如何进入 operations report、diagnostic view、history 或 evidence candidate | UI、审批流程、hash 算法、证据路径 |
| Config evidence | 配置快照如何被 report handoff、验收材料或 implementation run 引用而不伪造真实 evidence | 真实 run id、真实 evidence alias、signoff、测试结果 |

---

## 11. 配置细节留给 `04-配置设计`

| 配置细节 | 留给后续文档的原因 |
|---|---|
| config key、env var、文件格式、目录结构、profile 名称 | 属于配置说明和实现约定 |
| 默认值、上限、下限、单位、freshness threshold、retention days | 需要详细设计、测试和容量 / 合规评估支撑 |
| DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC 产品参数 | 当前概要保持产品中立 |
| endpoint、secret、token、证书、network policy、密钥轮换 | 属于部署、安全和密钥管理 |
| retry、backoff、cron、batch、cursor、parallelism、dead-letter、quarantine 具体数字 | 需要运维、恢复和测试验证闭口 |
| feature flag 名称、rollout、灰度、热更新 | 属于配置设计和实施计划 |
| SLO、容量、P95 / P99、吞吐、告警阈值 | 需要测试方案、验收标准和真实 evidence 支撑 |
| 产品选型和替代方案 ADR | 属于技术选型、配置设计或实施计划,不得在 Step 11 固化 |

当前本轮 `04-配置设计.md` 尚未重建,旧配置材料只能视为 historical material。本步结论只定义未来 `04` 必须承接的配置影响轮廓,不提前代写配置项清单。

---

## 12. Step 12 详细设计承接移交门禁

Step 12 需要把本步配置影响明确纳入 `03-详细设计.md` 承接清单,但不得在 Step 12 提前写入完整配置类型、字段、默认值或配置文件。

| Step 12 预计承接主题 | 来源 | Step 12 必须守住的边界 |
|---|---|---|
| runtime builder / application service 注入边界 | 配置影响图、配置实现契约方向 | Domain / Policy / 状态机不直接读配置。 |
| adapter / consumer / publisher / handoff config 分类 | 配置影响轮廓表 | 只承接契约方向,不写 key / env / endpoint / secret。 |
| read / visibility / degraded surface 配置契约 | read config、not-visible / degraded 禁止边界 | 配置不能把 not-visible 变 missing / success。 |
| redaction / body-free / evidence config 契约 | redaction / evidence 配置影响 | 配置不能允许 forbidden body 或 evidence body 入仓。 |
| job / outbox / replay / retention config 契约 | job config、outbox、retention / replay 禁止边界 | 配置不能允许 job repair、truth rollback 或 active reference 越界。 |
| `04-配置设计` 后移清单 | §11 配置细节后移 | Step 12 只能移交,不能提前装配 `04`。 |

进入 Step 12 的条件: 仅当用户确认后,Step 12 才能读取本文件并开始详细设计承接清单;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §11 “配置影响轮廓”引用本文件 §7 的配置影响轮廓表。
- §11 摘录本文件 §8 的禁止配置化边界表,保留 Domain 不直读配置、redaction-first、body-free、not-visible、placeholder、retention protection、no-write、job non-repair、outbox non-rollback 和外部产品非 truth source 红线。
- §11 摘录本文件 §9 的配置影响轮廓图和关键说明。
- §11 引用本文件 §10 的详细设计配置实现契约方向。
- §11 明确 config key、默认值、JSON / YAML / TOML 示例、环境变量、密钥、endpoint、产品参数、容量数字、retry / DLQ 具体值进入 `04-配置设计.md`、测试方案、验收标准或实施计划。

---

## 14. 待确认事项

本步不新增阻塞 Step 12 的上游 blocker。以下事项留给后续详细设计、配置设计或实施计划闭口:

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP11-001` | `RedactionPolicyConfig`、`EvidencePolicyConfig`、`RetentionPolicyConfig` 是否在详细设计拆成独立配置对象 | Step 11 只锁定分类和禁止越界,字段和命名留给 `03`。 |
| `Q-HLD-STEP11-002` | outbox failed / dead-lettered 的 retry class 与 dead-letter visibility 具体如何配置 | Step 11 只锁定不回滚 truth 且必须可见;具体值和 payload 留给 `03/04`。 |
| `Q-HLD-STEP11-003` | freshness threshold、retention days、batch size、parallelism 是否进入配置设计 | 进入 `04-配置设计.md` 候选,但不得削弱安全和 no-write 红线。 |
| `Q-HLD-STEP11-004` | 外部产品选型是否需要 ADR 或直接进入 `04` | 当前只作为产品中立候选;选型基线留给配置设计、ADR 或实施计划。 |
| `Q-HLD-STEP11-005` | 配置变更是否需要真实 evidence 或审批记录 | 详细设计 / 验收阶段再定义;当前不得伪造真实 run id、evidence alias 或签署。 |

---

## 15. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 11 SOP、书写规范、Step 03~10、旧 Step 11 和 L1 参考粒度 | pass |
| 是否输出配置影响轮廓表 | pass |
| 是否输出禁止配置化边界表 | pass |
| 是否说明详细设计配置实现契约方向 | pass |
| 是否只使用 Step 04~10 已收稳的主要组成部分、入口、adapter、job、handoff、projection 或外部接缝主语 | pass |
| 是否明确 Domain Model / Domain Policy / 状态机只能间接受配置影响且不直接读配置 | pass |
| 是否保持 redaction-first、body-free、not-visible、no-write、retention protection、consumer non-truth 和 job non-repair | pass |
| 是否未写配置项清单、默认值、JSON 示例、环境变量名、密钥名称、产品参数、retry 数值或实现级配置类型定义 | pass |
| 是否未伪造真实 run id、真实 evidence alias、验收签署、测试结果或 implementation evidence | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 12 的上游 blocker | no |

---

## 16. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 11、概要书写规范 4.11、Step 03~10、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 11;旧 Step 11 已降级为 historical material | wait_user_confirmation_before_step_12 |
