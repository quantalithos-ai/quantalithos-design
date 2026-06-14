# 04 配置设计 Step 2 · 明确配置设计目标、范围和非范围

> 子项目: `L1-identity`
> 目标文档: `projects/L1-identity/04-配置设计.md`
> SOP Step: Step 2 明确配置设计目标、范围和非范围
> 当前状态: 已写入;等待用户审核后进入 Step 3 control plane

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 2 明确配置设计目标、范围和非范围 |
| 当前结论 | `L1-identity` 不是无配置项目;新版 `04` 必须覆盖 runtime assembly、store、entry context、role/capability source、bus/outbox、projection/reference/report、operations、external refs、audit/redline、fixture 等配置范围 |
| 本 Step 输出 | 配置设计目标、P0/P1/P2 口径、覆盖范围、非范围、无配置路径判定、对 `03` 影响判定 |
| 本 Step 边界 | 不定义具体配置项、默认值、env key、JSON schema、secret provider、部署命令、测试编号、evidence 或 implementation boundary |
| 下一步 | Step 3 control plane |

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已审核通过 | 提供上游边界、旧 `04` 降级口径和初始配置输入候选 |
| `03-详细设计.md` §13 | Step 19.5 已完成 | 提供配置引用表、external binding、runtime builder、forbidden configuration boundary |
| `03-详细设计.md` §14~§15 | Step 19.5 已完成 | 提供 observability/redaction 和 config/runtime/adapter test cut |
| `03-详细设计.md` §17~§18 | Step 19.5 已完成 | 提供下游 `04/05/06/07` 复核风险和未确认事项 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 新版文档 | 提供 no-auth、ref-only、外部正文排除、依赖裁剪和配置影响轮廓 |
| 旧 `04_config_step_02_scope.md` | 历史输入 | 诊断旧 P0 主链、旧 profile 和旧 P1/P2 口径 |
| `projects/L1-governance/design-calibration/04_config_step_02_scope.md` | 参考材料 | 只参考粒度和表结构,不复制 governance 对象或配置域 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮配置设计目标是什么? | 把新版 `03` 中已经出现的 profile、store、actor context、role_catalog、bus、outbox、projection、operations、external_refs、audit、redline、fixture 和 runtime builder binding 转成可审查、可测试、可验收、可运维的配置控制面。 |
| P0 必须定义哪些配置控制面才能运行主链? | P0 必须覆盖 runtime assembly / profile、in-memory 或 fake/durable-neutral store binding、trusted actor context input、role/capability source fake/controlled/disabled binding、bus/outbox fake publisher and topic-neutral binding、projection read model maintenance、idempotency/result/report store、operations job knobs、audit/redline safe output、clock/id fixture 和 fake/controlled/disabled adapter parity。 |
| P0 主链如何命名? | 不继承旧 `SyncRoleCatalog -> HireGlobalMember -> PublishOutboxEvents -> RebuildMemberSummaryProjection -> GetMemberSummary`。新版 P0 以 `EstablishGlobalMember`、`MaintainRoleCapabilitySummary`、`PublishIdentityOutbox`、`RebuildIdentityProjection`、`ReadMemberSummary` 等新版 `03` protocol / job 名作为配置承接入口。 |
| 哪些配置属于 P1 / P2 或后续扩展? | P1 覆盖 durable store 产品化、real-like bus、endpoint resolver、governance/work/artifact/memory/archive integration-like adapter、handoff target、metric/DLQ/diagnostic sink 和 production-like secret provider 控制面。P2 覆盖 multi-region、tenant-specific profile、advanced capacity/rate limit、vendor-specific observability、external identity provider 和复杂 production tuning。 |
| 哪些配置细节留给部署与运维手册? | 容器挂载、secret provider 操作、证书安装、真实 endpoint 填写、发布命令、备份恢复、值班流程、告警面板和 runbook 不进入配置设计;配置设计只定义语义、来源、优先级、校验、生效、失效和审计边界。 |
| 哪些配置细节留给实施计划? | 配置 loader / runtime builder / adapter constructor 的落码顺序、phase / commit boundary、fixture 文件落点、CI gate、从 fake 切 durable 的实现批次和提交回滚纪律留给 `07-实施计划.md`。 |
| 本仓是否可走无配置说明文档路径? | 不可。新版 `03` 已明确 runtime builder、store、external resolver、publisher、handoff、audit、clock/id、fake/controlled/disabled adapter、entry-local / job-run-start 参数均需要配置设计承接。 |

---

## 4. 当前文档问题诊断

| 诊断项 | 旧口径 | 新版问题 | 本 Step 处理 |
|---|---|---|---|
| P0 主链旧名 | `SyncRoleCatalog -> HireGlobalMember -> PublishOutboxEvents -> RebuildMemberSummaryProjection -> GetMemberSummary` | 与新版 `03` command/job/query 名不一致 | 改为新版 protocol/job/read surface 承接 |
| profile 直接采用旧四类 | `local-dev/ci-test/integration-like/operations-replay` 已在旧 Step 2 固定 | Step 1 要求不得直接继承旧 profile | 本 Step 只作为候选口径;Step 6 正式裁决 |
| Artifact / governance / memory P1 旧划分 | 旧 Step 2 按旧 tombstone/Gate/ArtifactPort 口径划分 | 新版 `03` 使用 `GovernanceBasisSummary`、formal resolver / reference / handoff surface | 本 Step 只保留 external_refs P1 候选,细节留 Step 3/7/11 |
| 下游旧 `05/06/07` 作为输入过重 | 旧 Step 2 直接用旧测试和实施材料 | 新版 `03` 规定下游需按新版 `04` 复核 | 本 Step 只把旧下游材料列为后续回写风险 |
| `03` 回写风险不够前置 | 旧 Step 2 在 P0/P1 结论中已有潜在代码契约暗示 | 可能静默新增 runtime config / adapter constructor | 本 Step 明确发现代码契约缺口即 blocker |

---

## 5. 改动前后对比

| 项 | 旧 Step 2 | 新 Step 2 |
|---|---|---|
| 配置直接上游 | 旧 `00/01/02/03/05/06/07` 混合输入 | 新版正式 `03` §13/17/18 为直接上游 |
| P0 主链 | 旧 command / job 名 | 新版 `03` protocol / job / read surface |
| profile 口径 | 直接采用旧四 profile | 仅作为候选,Step 6 再正式裁决 |
| P1/P2 | 包含旧 Gate/tombstone/ArtifactPort 口径 | 只按 external refs / endpoint / durable / production-like 控制面分层 |
| 无配置判定 | 基于旧配置闭环判定 | 基于新版 `03` runtime builder 和 binding 判定 |
| 对 `03` 影响判定 | 局部列出 | 作为进入后续 Step 的持续门禁 |

---

## 6. 配置设计取舍

| 议题 | 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|---|
| 是否局部沿用旧 P0 主链 | 沿用旧最小闭环 | 改动小 | 与新版 `03` 命名和 flow 不一致 | 不采用 |
| P0 主链表达方式 | 按新版 protocol / job / query surface 表达 | 与 `03` 可追溯 | 需要 Step 3/7 继续展开 | 采用 |
| 是否在 Step 2 固定 profile 名 | 立即固定旧四 profile | 后续简单 | 违反 Step 1 不直接继承旧口径 | 不采用 |
| profile 处理方式 | Step 2 只定义候选和范围,Step 6 正式裁决 | 符合 SOP 分步 | 多一步停审 | 采用 |
| 是否提前写配置项默认值 | 直接列默认值 | 快 | 会绕过控制面和来源优先级 | 不采用 |
| 是否走无配置路径 | 是 | 文档短 | 与新版 `03` runtime / adapter / store binding 冲突 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳 runtime assembly 配置范围 | 明确 raw config 只由 infra config loader、runtime builder 和 entry composition root 读取,application/domain/contracts 不读 raw config | Step 3 / 9 |
| 收稳 external dependency binding | 把 store、projection/reference/report、bus publisher、role/governance/work/artifact/memory resolver、handoff、audit、clock/id 和 fake/controlled/disabled adapter 纳入配置控制面 | Step 3 / 7 / 8 / 11 |
| 收稳 profile / adapter mode 边界 | 区分 profile、adapter mode、entry-local 参数和 job-run-start 参数,避免旧 mock/stub/profile 混用 | Step 5 / 6 |
| 收稳禁止配置化边界 | 确认配置不得改变 identity truth ownership、state matrices、transaction order、stored replay、query no-write、job no-truth-repair、terminal retry guard 或 body-free/secret-free boundary | Step 4 / 11 |
| 收稳 observability / redaction 配置范围 | 定义 safe log/metric/audit/report/handoff cut、redaction、forbidden material guard 和 fake private material 禁止输出 | Step 8 / 12 |
| 收稳下游复核输入 | 为 `05/06/07/09` 提供环境、配置、验收、实施和运维承接,但不写测试编号、evidence 或 phase boundary | Step 12 / 14 |

### 7.2 本轮覆盖范围表

| 范围 | 必须覆盖的配置内容 | 后续 Step |
|---|---|---|
| profile / runtime assembly | profile selector、runtime config shell、assembly validation、adapter availability registry、entry composition root | Step 3 / 5 / 6 / 9 |
| store and transaction carrier | truth repositories、append-only records、projection/reference/report、outbox、idempotency/result、UnitOfWork manager 的 store binding | Step 3 / 7 / 9 / 11 |
| actor_context and entry-local | trusted actor / visibility / trace / idempotency metadata 的 entry-local 来源和缺失处理 | Step 3 / 4 / 5 / 7 / 11 |
| role_catalog and capability source | role/capability source resolver、safe summary、evidence/ref-only material、source unavailable / stale handling | Step 3 / 7 / 11 |
| bus and outbox | topic-neutral key binding、publisher adapter、pending scan knobs、publish retry / terminal failure marker | Step 3 / 5 / 7 / 11 |
| projection / reference / report | projection rebuild、reference refresh、reconciliation report、state/report store 和 stale/degraded surface | Step 3 / 7 / 11 |
| operations jobs | `RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation`、`PublishIdentityOutbox`、`DeliverTraceHandoff`、`RetryIdentityPropagationFailures` 的 run-start knobs | Step 6 / 7 / 11 / 12 |
| external_refs | governance、work、artifact、memory/archive、method-library、observability 等 runtime adapter mode / endpoint refs / disabled behavior | Step 3 / 7 / 8 / 11 / 14 |
| audit / redline / fixture | safe diagnostics、redaction、forbidden body guard、deterministic clock/id、fake fixture refs 和 no default success | Step 4 / 7 / 8 / 12 |

### 7.3 P0 / P1 / P2 配置口径

| 等级 | 配置口径 | 示例 | 是否本轮展开 |
|---|---|---|---|
| P0 | 支撑本地 / CI / fake / in-memory 或 product-neutral 主链运行、contract/service/integration-like test、forbidden body guard、outbox/job基础闭环 | runtime profile候选、in-memory/fake store、fake/controlled role source、fake publisher、projection rebuild、stored replay store、redline guard、deterministic clock/id、disabled external adapters | 是,完整展开 |
| P1 | 支撑 durable / endpoint / real-like adapter、selected external resolver、handoff target、metric / DLQ / diagnostic sink 和 operations replay | durable store ref、bus endpoint ref、governance/work/artifact/memory endpoint refs、handoff target ref、metric sink ref、DLQ target ref | 本轮定义控制面和待确认项,具体产品可挂起 |
| P2 | 支撑生产高级形态和跨部署优化 | multi-region、tenant profile、advanced capacity/rate limit、external identity provider、vendor-specific observability、production secret provider policy | 只记录非范围 / 演进触发 |

### 7.4 P0 主链配置承接入口

P0 不是一条旧 command 串,而是下列新版 protocol / job / read surface 的最小可运行组合:

| P0 入口 | 配置关注点 | 说明 |
|---|---|---|
| `EstablishGlobalMember` | actor context、store/UoW、id/idempotency/result、audit/outbox/redline | 建档 accepted path 的最小写入链 |
| `MaintainRoleCapabilitySummary` | role/capability source adapter、safe summary/evidence refs、reference state、stale/degraded handling | 身份侧角色能力摘要来源配置 |
| `ReadMemberSummary` | projection/read store、visibility input、stale-visible/degraded surface | 下游读取身份摘要的最小 read path |
| `PublishIdentityOutbox` | outbox store、topic binding、publisher adapter、batch/retry/failure marker | accepted identity facts 的传播配置 |
| `RebuildIdentityProjection` | projection target expansion、batch/run-start knobs、report refs、no truth repair | 派生视图维护配置 |
| `RefreshExternalReferenceState` | external reference adapter mode、reference bundle、unavailable/invalid handling | 外部引用状态维护配置 |

### 7.5 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则、验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` |
| domain object、DTO、trait、port、state machine、error schema 新增 | `03-详细设计.md` |
| runtime config struct、builder 函数签名、adapter constructor 参数新增 | `03-详细设计.md` |
| RoleDefinition / CapabilityDefinition 正文、ProjectMember truth、memory body、artifact body、governance policy truth | 相邻仓或外部能力 |
| 完整测试用例、测试数据脚本、evidence 生成脚本 | `05-测试方案.md` |
| phase / commit boundary、落码批次、提交计划 | `07-实施计划.md` |
| 部署命令、容器编排、secret provider 操作、证书安装、runbook | 部署与运维手册 |

### 7.6 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 runtime / adapter 配置绑定点 | 是 | `03` §13 runtime builder、adapter availability、fake/controlled/disabled adapter |
| 是否存在 store binding | 是 | `03` §13 store、idempotency/result、projection/reference/report、outbox |
| 是否存在 external resolver / publisher / handoff binding | 是 | `03` §13 role/governance/work/artifact/memory resolver、bus publisher、handoff |
| 是否存在 entry-local / job-run-start 参数 | 是 | `03` §13 API、worker、jobs entry 和 operations job |
| 是否存在 sensitive / redaction / forbidden material boundary | 是 | `03` §13~§15 |
| 是否可写成“无配置说明文档” | 否 | 至少 P0 runtime、store、adapter、topic、audit、redline、fixture 需要配置设计 |

结论:`L1-identity` 不是无配置项目。后续 Step 3~13 适用。

### 7.7 非范围残余风险表

| 非范围风险 | 影响 | 当前处理 |
|---|---|---|
| profile 候选未正式裁决 | 影响配置文件命名、测试矩阵和验收 evidence | Step 6 正式闭口 |
| durable DB / bus / metric / DLQ / external endpoint 产品未锁定 | 影响 secret ref、endpoint ref、默认值和失效策略 | Step 7~14 使用 product-neutral ref / disabled / fake / 待确认处理 |
| 旧 `05/06/07` 仍可能保留旧 profile / mock / phase 口径 | 影响下游承接 | Step 12~14 记录回写输入和风险 |
| 配置项可能暴露 `03` 未定义的 runtime config / adapter constructor 缺口 | 影响可落码性 | 后续 Step 发现即记录 blocker 并回写 `03` |
| P2 生产优化被提前塞进 P0 | 扩大实现范围 | Step 13 作为演进触发处理 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓不是无配置项目 | 否 | 根据 `03` §13 已有配置绑定点判断范围 | 不适用 | 无回写 |
| P0 覆盖 runtime / store / actor_context / role_catalog / bus / outbox / projection / operations / audit / redline / fixture 控制面 | 否 | 承接 `03` §13 配置引用表 | 不适用 | 无回写 |
| P1 / P2 产品化和高级配置不在当前 P0 中锁定 | 否 | 范围分层 | 不适用 | 无回写 |
| profile 候选暂不在 Step 2 固定 | 否 | 后续配置语义 | 不适用 | 无回写 |
| 后续具体配置项若要求新增 runtime config 字段、builder 签名、adapter constructor、port、error、DTO 或 flow | 是 | 代码契约变更 | `03` 对应章节 / Step 14 来源 | 阻塞待确认 |

---

## 9. 回填草稿

正式 `04-配置设计.md` 第 2 章后续可按下列结构装配:

```md
## 2. 本次配置设计目标与范围

本轮配置设计的目标是把新版 `03-详细设计.md` 中已经出现的 profile、store、actor_context、role_catalog、bus、outbox、projection、operations、external_refs、audit、redline、fixture 和 runtime builder binding 转成可审查、可测试、可验收、可运维的配置控制面。

`L1-identity` 不是无配置项目。P0 配置必须支撑建档、角色能力摘要维护、成员摘要读取、outbox 发布、projection rebuild 和 external reference refresh 等新版 protocol / job / read surface 的最小可运行组合,并保持 query no-write、job no-truth-repair、stored replay、body-free/secret-free 和 fake/durable parity。

本章不定义具体配置项默认值、环境变量名、secret provider、部署命令、测试编号、evidence 或 implementation phase。凡是后续配置结论需要新增 runtime config 字段、adapter constructor 参数、trait / port、DTO、error 或 flow,必须回写 `03-详细设计.md` 后才能进入正式配置设计。
```

本草稿只作为 Step 15 装配输入,当前不写入正式 `04-配置设计.md`。

---

## 10. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| ID-CFG-S02-OPEN-001 | 本仓是否为无配置项目 | Step 2 | 已判定为否 |
| ID-CFG-S02-OPEN-002 | P0/P1/P2 配置口径是否按新版 `03` 而非旧 `04` 划分 | Step 2 | 已按新版 `03` 重划 |
| ID-CFG-S02-OPEN-003 | profile 名称是否在 Step 2 固定 | Step 2 | 不固定;Step 6 正式裁决 |
| ID-CFG-S02-OPEN-004 | Step 2 是否发现必须回写 `03` 的代码契约缺口 | Step 2 | 未发现;后续 Step 持续复核 |

---

## 11. 进入下一步条件

进入 Step 3 前必须满足:

- 用户审核通过 Step 2。
- Step 3 只建立配置控制面总览,不得直接列完整配置项清单。
- Step 3 必须从新版 `03` modules / ports / entry / flow 绑定点推导控制面,不得继承旧 `04` 控制面命名。
- 若 Step 3 发现配置控制面需要 `03` 未定义的 runtime config、builder、adapter constructor、port、error、DTO 或 flow,必须暂停并记录 `03` 回写 blocker。
