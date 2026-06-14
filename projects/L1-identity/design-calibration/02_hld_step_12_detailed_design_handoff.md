# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-06-11
> 状态: 已完成,等待审核后进入 Step 13

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 4~11、最新版 SOP / 书写规范和旧 Step 12 草稿 | 已完成 | §2 |
| 回答 Step 12 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 12 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出详细设计承接清单、展开方向、回退规则和不进入承接清单的内容 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §12 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成并已获用户认可 | 提供 Inbound / Application / Domain / Ports / Persistence / Projection / Outbox 安放方式 |
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供 8 个主要组成部分、职责和非职责 |
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供最终正式关键对象索引、并入 / 后移 / 排除审计 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成并已获用户认可 | 提供 Command / Query / Consumer / Event / Job 总表和外部接缝后移项 |
| `02_hld_step_08_processing_flows.md` | 已完成并已获用户认可 | 提供关键处理流、事务边界方向和跨处理流一致性审计 |
| `02_hld_step_09_state_machine.md` | 已完成并已获用户认可 | 提供状态主语、状态集合、迁移方向和禁止迁移 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成并已获用户认可 | 提供异常 / 边界场景、public surface 方向和 forbidden body 硬边界 |
| `02_hld_step_11_configuration_impact.md` | 已完成并已获用户认可 | 提供配置影响轮廓、禁止配置化边界和 `03/04` 分工 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供业务目标、VETO、数据 ownership 和验收边界 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供依赖裁剪、运行承载、数据边界和横切机制 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 12 只做详细设计承接清单和回退规则 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定第 12 章表格格式、禁止画图和禁止写实施任务 |
| 旧 `02_hld_step_12_detailed_design_handoff.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳的代码主体框架是:

- Inbound / Operations:Command intake、Query intake、Event intake、Maintenance jobs、Outbox publisher、Handoff runner。
- Application Services:Identity、Lifecycle、Role Capability、Career / Memory、Consumption Query、Maintenance / Propagation 编排服务。
- Domain Model:member identity、lifecycle、role capability、career、memory reference、trace / audit、projection marker、outbox、handoff、reconciliation 主语。
- Ports / Persistence / Projection / Outbox:repositories、unit of work、external source resolvers、governance basis resolver、projection store、reference snapshot store、publisher port、handoff port、report store。

`03-详细设计.md` 可以把这些主语转为 crate、module、trait、struct、enum、repository 和 adapter,但不能换掉主语、合并边界或把外部 truth 引入 identity。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

已经成为 `03` 输入的稳定主语包括:

- 对象:Step 6 的 `GlobalMember`、`IdentityAnchorState`、`GlobalLifecycleState`、`RoleCapabilitySummary`、`CareerRecord`、`MemoryReference`、`MemberSummaryView`、`IdentityTraceRecord`、`AuditTrail`、`ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、`IdentityOutboxRecord`、`TraceHandoffIntent` 等。
- 接口:Step 7 的 6 个 Command、14 个 Query、5 个 Inbound Event Consumer、10 个 canonical Outbound Event material 和 6 个 Operations Job。
- 处理流:Step 8 的 command accepted flow、query no-write flow、consumer source marker flow、maintenance report-only flow、publish / handoff flow 和 retry flow。
- 状态机:Step 9 的 anchor、lifecycle、role / source、career、memory、projection、reference resolution、reconciliation、outbox、handoff 状态集合。
- 边界:Step 10 的异常 surface 和 Step 11 的配置影响 / 禁止配置化边界。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

`03` 应继续展开:

- object contracts:字段、类型、工厂、成员函数、状态 enum、invariant 和 Rustdoc 级注释。
- trait / port / adapter contracts:repository、resolver、publisher、handoff、report writer、clock / id / metadata provider 的签名和 fake / durable 等价语义。
- protocol contracts:Command / Query / Consumer / Event / Job / Handoff 的 DTO、result、envelope、receipt、report、public marker 和 redaction surface。
- function flows:逐接口 accepted / rejected / duplicate / conflict / failed path、transaction boundary、trace / audit / outbox / stored result 顺序。
- persistence / concurrency:truth、append-only history、projection、reference state、outbox、trace、audit、report、handoff、idempotency、cursor、version 和 unique key。
- error / recovery:public rejection、degraded、not visible、stale、unavailable、retryable failed、failed、partial、forbidden body 等错误映射。
- config implementation:runtime config shell、validated config、adapter config、job config、redaction profile、config error 和 profile evidence。
- test cuts:domain invariant、protocol DTO、service flow、fake runtime、query no-write、forbidden body、duplicate replay、projection / outbox / handoff / report-only 等切口。

### 3.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果 `03` 发现需要新增主要组成部分、对象、接口、处理流、状态或配置影响边界,说明 `02` 尚未真正收稳。必须回到对应 Step 修正:

- 主要组成部分:回 Step 5。
- 关键对象 / state / policy / projection / trace / outbox / handoff:回 Step 6。
- Command / Query / Event / Job 分类:回 Step 7。
- 关键处理流方向或事务边界:回 Step 8。
- 状态集合 / 迁移语义:回 Step 9。
- 异常 / forbidden body / no-write / report-only 边界:回 Step 10。
- 配置影响或禁止配置化边界:回 Step 11。

不得在 `03` 中为了实现方便暗改概要主语。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约?

交给 `03` 的配置实现契约包括:

- runtime config shell 与 composition root 注入关系。
- profile / adapter mode 合法组合和禁用 / 缺失 / 越界错误。
- external source resolver、publisher、handoff、report writer、store、projection、outbox、job runner 的 config boundary。
- redaction / visibility profile 的注入方式与不可配置化红线。
- config digest / evidence 如何进入测试、验收和实施计划。

具体配置项、默认值、JSON、env、secret ref 和 profile 文件由新版 `04` 在 `03` 后承接。

### 3.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

不能写成已闭口承接项的内容包括:

- 具体 sibling repo 中是否已存在某些 ref / trace / actor / metadata 类型。
- role / capability source 的最终协议字段、fingerprint 和 unavailable 细分规则。
- work participation source、governance basis、artifact evidence、memory / archive handoff 的字段级契约。
- visibility / privacy 的字段级裁剪矩阵。
- `04-配置设计.md` 是否整体重写、局部修补或等待新版 `03` 后再处理。
- P0 性能 / 可用性阈值和验收 evidence 的具体格式。

这些内容进入 Step 13 风险与待确认事项,或在 `03/04/05/06/07` 到达对应 Step 时闭口。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 12 已标“已完成” | 缺少 Step 内计划、SOP 问题回答、诊断、对比、取舍、复杂度判断和自检 | 删除后按最新版模板重建 |
| 旧承接清单列了较多对象,但未绑定 Step 6~11 来源 | 后续无法判断某个承接项来自对象、接口、处理流还是状态 | 本轮按主要组成部分、对象、接口、flow、状态、异常、配置分组 |
| 旧稿把若干未闭口内容写进“不进入清单”但没有风险承接说明 | 容易在 Step 13 漏掉待确认项 | 本轮把这些明确列为 Step 13 输入 |
| 旧稿提到 Step 10 state matrix | 概要 Step 9 才是状态集合;详细 state matrix 在 `03` 展开 | 本轮改为 Step 9 状态集合到 `03` state matrix |
| 旧稿对 `03/04` 分工较粗 | 配置影响已在 Step 11 更新,需要同步承接 | 本轮明确 `03` 先收实现契约,新版 `04` 再写配置项和校验 |
| 旧稿未充分强调回退规则 | `03` 可能为实现方便新增对象 / port / flow | 本轮给出按 Step 回退表 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 结构 | 简要目标、输入、承接表、回退规则 | 完整包含计划、问题回答、诊断、对比、取舍、结构化产物、复杂度、回填和进入条件 |
| 来源追溯 | 泛称 Step 4~11 | 每类承接项回指 Step 4~11 具体产物类型 |
| 承接粒度 | 对象 / API / flow 混合 | 按主要组成部分、对象、接口、处理流、状态、异常、配置、测试切口分组 |
| 回退规则 | 只有概括性表 | 明确新增 / 变更主语应回退到 Step 5~11 的哪一步 |
| 未闭口项 | 列出但未明确后续位置 | 明确进入 Step 13 或对应 `03/04/05/06/07` Step |
| 配置承接 | `runtime config schema` 等旧口径 | 对齐 Step 11: `03` 实现契约,新版 `04` 配置填写 / 校验 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把 Step 6~11 的所有表完整复制到承接清单 | 不采用 | 会重复前文,且让 Step 12 过长,不利于审核 |
| 只列“对象 -> 详细设计展开” | 不采用 | `03` 不只需要对象,还需要接口、flow、状态、异常、配置和回退规则 |
| 按承接类型分组列清单 | 采用 | 能覆盖 `03` 需要的 object / port / protocol / flow / state / persistence / config 输入 |
| 在 Step 12 增加实施任务和 commit boundary | 不采用 | 这属于 `07-实施计划.md`,概要设计 Step 12 禁止写实施指令 |
| 在 Step 12 画交付路线图 | 不采用 | 书写规范明确本章禁止画图 |
| 将未闭口字段级契约写成已收稳 | 不采用 | 字段级协议、port 签名和测试用例应在 `03/05/06` 继续闭口 |

---

## 7. 结构化中间产物

### 7.1 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| `L1-identity` 是平台级 AI 员工身份 truth center | crate / module / package 组织、domain / application / contracts / infra 分层、依赖方向和 sibling dependency 边界 |
| 8 个主要组成部分:身份锚定、全局生命周期、角色能力摘要、身份生涯记录、记忆引用关系、消费追溯、派生维护对账、传播交接 | 每个组成部分的 module ownership、object contracts、ports、flows、state matrix、persistence contract 和 test cuts |
| Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Outbox 分层 | 具体 crate / module / trait / adapter / handler / runner 安放和跨层依赖约束 |
| `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` | 字段、ref 类型、建立 / 持有 / 防复用函数、repository、unique key、anchor query view 和 ref reuse negative tests |
| `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | lifecycle enum、transition matrix、basis resolver port、high-risk rejected / pending surface、terminal state tests |
| `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | source / evidence ref schema、snapshot version、summary state、resolver port、stale / unavailable / forbidden body tests |
| `CareerRecord`, `CareerAppendPolicy` | append-only schema、source marker unique key、correction append、supersede marker、career query view 和 duplicate source tests |
| `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | memory / archive ref schema、state enum、handoff marker、resolver / archive port、body-free and fake delivered tests |
| `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy` | query DTO、projection body、trace / audit repository、visibility / redaction decision、not visible / degraded / stale surface |
| `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport` | projection / reference store、refresh / rebuild cursor、report schema、finding / partial / failed semantics、report-only tests |
| `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy` | outbox payload snapshot、event envelope、publisher / handoff port、receipt marker、retry / failed state、no rollback and no receipt body tests |
| 6 个 Command:`EstablishGlobalMember`, `UpdateGlobalLifecycleState`, `MaintainRoleCapabilitySummary`, `AppendCareerRecord`, `MaintainMemoryReference`, `PrepareTraceHandoff` | request / result DTO、actor / metadata / idempotency、domain method、transaction order、stored result、accepted / rejected / duplicate flows |
| 14 个 Query | request / response DTO、page cursor、visibility decision、projection / truth read path、not found / not visible / stale / degraded surface、query no-write tests |
| 5 个 Inbound Event Consumer | envelope、source event id、dedupe key、source marker、version / cursor、body-free validation、consumer receipt and replay semantics |
| 10 个 canonical Outbound Event material | event payload snapshot、topic / consumer boundary ref、redaction marker、outbox relation、payload version and forbidden body guard |
| 6 个 Operations Job | job input / report DTO、run metadata、system actor、scope、cursor、retry / timeout category、partial / failed report and no remediation boundary |
| External source / boundary refs | typed ref schema、resolver trait、availability / stale / unavailable / unrecognized surface、fake / controlled / endpoint adapter semantics |
| Step 8 command accepted flows | application service functions、UnitOfWork boundary、trace / audit / outbox / projection stale / stored result ordering |
| Step 8 query / consumer / job / propagation flows | read-only proof, source marker update, projection / reference / reconciliation report update, publish / handoff retry transaction |
| Step 9 state collections | full state matrix、allowed transitions、forbidden transitions、triggering function、guard、side effect、public marker |
| Step 10 exception and boundary surfaces | error model、public rejection / degraded / redacted / not visible / retryable failed / failed / partial result schema |
| Step 11 configuration impact | runtime config shell、validated config、adapter config、job config、redaction profile、config error and config evidence |
| Forbidden body / no external truth ownership / report-only maintenance / eventual propagation / fake-delivered prohibition | cross-cutting guard implementation、redaction tests、negative protocol tests、acceptance evidence |

### 7.2 详细设计继续展开方向说明

| 展开方向 | `03` 应输出 | 不得改变的概要结论 |
|---|---|---|
| Object contracts | struct / enum / value object、字段类型、工厂、成员函数、Rustdoc 中文注释、不变量 | 不新增外部 truth owner;不保存 forbidden body |
| Trait / port / adapter contracts | repository、UoW、resolver、publisher、handoff、report writer、clock / id / metadata provider trait 和 fake 等价语义 | port 必须服务于 Step 7 / Step 8 已有接口和 flow |
| Protocol contracts | Command / Query / Consumer / Event / Job / Handoff DTO、result、envelope、receipt、report、marker | 不改变 Command / Query / Event / Job 分类 |
| Function flows | accepted / rejected / duplicate / conflict / failed path、transaction boundary、trace / outbox / stored result 顺序 | 不让 query / job / publish / handoff 成为业务 accepted 前置 |
| State matrix | 状态 enum、允许迁移、禁止迁移、trigger、guard、side effect、public marker | 不新增无 Step 9 来源的长期状态 |
| Persistence / concurrency | table / collection ownership、unique key、optimistic version、cursor、append-only、idempotency、duplicate replay | 不把 projection / report / outbox 当第二 truth |
| Error / recovery | public rejection、degraded、redacted、not visible、stale、unavailable、retryable / failed / partial 映射 | 不把 failure 伪装成 success 或 clean report |
| Config implementation | RuntimeConfig、ConfigLoader / Validator、AdapterConfig、JobConfig、ConfigError、evidence digest | 不允许配置覆盖 domain invariant 和安全红线 |
| Test cuts | domain, protocol, service-flow, fake runtime, query no-write, forbidden body, idempotency, projection, outbox / handoff, report-only | 测试必须能反查 Step 3~11 红线 |

### 7.3 概要设计回退规则

如果详细设计发现以下情况,应先回退到 `02-概要设计.md` 或对应 `design-calibration/02_hld_step_*` 修正,不能在 `03` 中暗改:

| 情况 | 回退位置 | 说明 |
|---|---|---|
| 需要新增、删除或合并主要组成部分 | Step 5 | 组成部分是概要业务主语,不是 `03` 可自行调整的 module |
| 需要新增 truth / state / policy / projection / trace / outbox / handoff 关键对象 | Step 6 | `03` 可细化字段和函数,不能新增长期主语 |
| 需要改变 Command / Query / Consumer / Event / Job 分类或新增 P0 接口 | Step 7 | 分类改变会影响处理流、状态和测试 |
| 需要新增关键处理流或改变 accepted / read-only / report-only / propagation 方向 | Step 8 | flow 方向是概要层行为结论 |
| 需要改变状态集合、状态名、合法迁移或 forbidden transition | Step 9 | `03` state matrix 必须承接概要状态 |
| 需要改变 exception surface、forbidden body、query no-write、eventual propagation 或 report-only 边界 | Step 3 / Step 10 | 这些是设计红线,不是实现细节 |
| 需要改变配置可以影响的业务边界或禁止配置化项 | Step 11 | 配置只能影响装配和接缝,不得改不变量 |
| 需要引入相邻仓 truth / body 为 identity-owned 内容 | Step 1 / Step 3 / Step 5 | 说明上游边界和数据 ownership 没有收稳 |

回退规则说明:

```text
如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计修正,而不是在详细设计中暗改。
```

### 7.4 不进入承接清单的内容

| 内容 | 处理 |
|---|---|
| sibling repo 中具体 core / bus / work / governance / method-library 已有哪些类型可复用 | Step 13 标为风险输入;`03` Step 1~3 读取实际仓库后闭口 |
| RoleDefinition / CapabilityDefinition source 的字段级协议、fingerprint 和 drift 分类 | `03` protocol / port contracts 或 Step 13 待确认 |
| work participation source、ProjectMemberRef 映射和 career source marker 细节 | `03` port / persistence / idempotency 设计闭口 |
| governance basis schema 和 high-risk basis availability 细分 | `03` resolver / protocol / error recovery 闭口 |
| memory / archive handoff target、receipt marker、archive result 字段级 schema | `03/04` handoff protocol / config 闭口 |
| visibility / privacy 字段级裁剪矩阵 | `03` query / view / redaction contracts 闭口 |
| 现有 `04-配置设计.md` 是重写、修补还是等待新版 `03` 后处理 | Step 13 风险 / 待确认事项 |
| P0 性能、可用性、证据文件格式和自动化门禁 | `05/06/07` 继续展开 |

### 7.5 承接自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Step 4~11 已收稳内容 | 通过 | 未新增对象、接口、流程或状态 |
| 是否避免实施任务 / 排期 / commit boundary | 通过 | 只写 `03` 继续展开方向,不写开发计划 |
| 是否保留回退规则 | 通过 | 按 Step 5~11 给出回退位置 |
| 是否区分已收稳与未闭口 | 通过 | 未闭口内容放入 §7.4,供 Step 13 使用 |
| 是否禁止画图 | 通过 | 本 Step 未画图 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 不需要拆分附录。

理由:

- Step 12 是交付清单,不是重复 Step 6~11 的完整正文。
- 承接表按类型聚合即可支撑 `03` 启动。
- 未闭口细节不在本 Step 扩写,而进入 Step 13 或后续 `03/04/05/06/07`。

---

## 9. 回填草稿

正式 `02-概要设计.md` §12 可回填以下内容:

- 详细设计承接清单表:列出主要组成部分、对象、接口、处理流、状态、异常、配置和横切红线已收稳什么,以及 `03` 继续展开什么。
- 详细设计继续展开方向说明:object contracts、trait / port / adapter、protocol、function flow、state matrix、persistence、error / recovery、config、test cuts。
- 概要设计回退规则:如果 `03` 需要改变主语、接口、flow、状态或边界,必须回到对应概要 Step 修正。
- 不进入承接清单的内容:字段级外部协议、sibling repo 类型现状、visibility 矩阵、现有 `04` 去留、性能 / evidence 格式等进入 Step 13 或后续文档。

---

## 10. 待确认事项

| 待确认项 | 为什么需要确认 | 默认处理 |
|---|---|---|
| 是否认可 Step 12 不新增任何 `03` 对象 / port / DTO 名 | 防止概要承接清单变成详细设计预写 | `03` 可细化,但新增主语须回退 `02` |
| 是否认可未闭口字段级外部协议进入 Step 13 | 防止把不确定项伪装成已闭口承接项 | Step 13 汇总为风险 / 待确认 |
| 是否认可现有 `04` 去留不在 Step 12 判定 | `04` 需要等新版 `02/03` 后再决定 | Step 13 记录风险,后续单独处理 |

---

## 11. 进入 Step 13 的条件

进入 Step 13 “设计风险与待确认事项”前,需要用户确认:

- 详细设计承接清单已经覆盖 Step 4~11 的稳定输入。
- `03` 继续展开方向足以防止详细设计重新发明主语。
- 回退规则已明确:详细设计若要改主语,必须回到对应概要 Step。
- 未闭口内容没有被写成已闭口承接项,可以进入 Step 13 统一收敛。
