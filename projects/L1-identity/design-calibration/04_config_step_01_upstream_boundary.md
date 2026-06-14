# 04 配置设计 Step 1 · 确认配置输入边界

> 子项目: `L1-identity`
> 目标文档: `projects/L1-identity/04-配置设计.md`
> SOP Step: Step 1 确认配置输入边界
> 当前状态: 已写入;等待用户审核后进入 Step 2 scope

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 1 确认配置输入边界 |
| 当前结论 | 新版 `04` 必须按 Step 19.5 后的正式 `03` 重写;旧 `04` 和旧 `04_config_step_*` 降级为历史诊断输入 |
| 本 Step 输出 | 上游关系、旧 `04` 诊断、必须回答 / 不再回答、初始配置输入候选和 Step 2 进入条件 |
| 本 Step 边界 | 不定义配置项清单、profile 矩阵、secret schema、runtime builder 签名、test id、evidence 或 implementation boundary |
| 下一步 | Step 2 scope |

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 新版草稿 | 提供 identity 仓定位、边界、数据归属和验收红线 |
| `projects/L1-identity/01-架构设计.md` | 已完成 | 提供系统上下文、依赖裁剪和 forbidden body 边界 |
| `projects/L1-identity/02-概要设计.md` | 新版草稿 | 提供配置影响轮廓和主要组成部分 |
| `projects/L1-identity/03-详细设计.md` | Step 19.5 closure 已完成 | 新版 `04` 的直接上游;提供配置绑定、runtime builder、adapter、port、flow、state 和下游复核要求 |
| `projects/L1-identity/design-calibration/03_ddd_step_14_config_external_binding.md` | 已完成并已审核 | `03` §13 的细节来源 |
| `projects/L1-identity/04-配置设计.md` | 旧未跟踪草稿 | 历史诊断输入,不得直接继承 |
| `projects/L1-identity/design-calibration/04_config_step_*.md` | 旧未跟踪中间产物 | 历史诊断输入,到对应 Step 时按新版 `03` 重写 |
| `standards/document/配置设计讨论流程_SOP.md` | 已读取 | Step 1~15 执行依据 |
| `standards/document/配置设计书写规范.md` | 已读取 | 正式 `04` 章节主链依据 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置设计是否需要从 `00/01/02/03` 抽取配置输入? | 是。新版 `03` 已完成 Step 19.5 closure,其 §13 是本轮配置设计直接输入。 |
| 现有 `04` 是否可以直接定稿或局部修补? | 不可以。现有 `04` 早于新版正式 `03`,且包含旧 command / job 名和旧配置闭环,必须降级为历史诊断输入。 |
| 本仓是否可能是无配置项目? | 否。新版 `03` 明确 runtime builder、store、adapter、external resolver、publisher、handoff、audit、fake/controlled/disabled adapter 和 entry-local / job-run-start 参数均需要配置设计承接。 |
| 本 Step 是否允许定义 env key / JSON schema / profile? | 不允许。本 Step 只确认输入边界和历史诊断;配置域、profile、配置项和 schema 留 Step 2~7。 |
| 若配置结论影响 `03` 代码契约怎么办? | 必须记录为 `03` 回写项。未回写或未明确阻塞处理前,不得进入正式 `04` 定稿。 |
| 旧 `05/06/07` 是否可作为新版配置上游? | 不可。它们早于新版 `03/04`,只能作为历史输入和下游回写对象。 |

---

## 4. 当前文档问题诊断

| 诊断项 | 证据 | 影响 | 本轮处理 |
|---|---|---|---|
| 旧 `04` 与新版 `03` 命令名不一致 | 旧 `04` 使用 `HireGlobalMember`;新版 `03` 使用 `EstablishGlobalMember` | 若直接继承会让配置项关联到不存在的 command | Step 2~7 按新版 `03` 重建 |
| 旧 `04` 与新版 `03` job 名不一致 | 旧 `04` 使用 `PublishOutboxEvents`、`RebuildMemberSummaryProjection`;新版 `03` 使用 `PublishIdentityOutbox`、`RebuildIdentityProjection` | operations job 配置会错绑 runner / report surface | Step 3 / 7 重建 job 控制面和配置项 |
| 旧 `04` 主链闭环早于新版 `03` | 旧工作台写“此前已有首轮正式文档 00/01/02/03/05/06/07” | 旧 `04` 不是 Step 19.5 后的下游复核结果 | 旧中间产物只保留为历史诊断 |
| 旧 `04` 仍混入旧 downstream 口径 | 旧 `04` 反复引用 dev/test/staging、mock/stub、Phase/PRE | 与新版 `03` 要求下游 `04/05/06/07` 重新复核的口径冲突 | Step 6 / 12 / 13 重新裁决 |
| 旧 `04` 中可能有实现签名暗示 | 旧配置项关联 `MethodLibraryPort`、`OutboxStore`、`MemberSummaryProjectionRepository` 等旧 surface | 可能绕过新版 Step 7 port owner | Step 3 / 7 按新版 port family 复核 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 正式 `04` 状态 | 已生成但未跟踪,早于新版 `03` | 降级为历史草稿,待 Step 15 重新装配 |
| 配置直接上游 | 旧 `00/01/02/03/05/06/07` 混合输入 | 新版 `00/01/02/03`;其中正式 `03` 是直接上游 |
| 命令 / job 名称 | `HireGlobalMember`、`PublishOutboxEvents`、`RebuildMemberSummaryProjection` | 以新版 `03` 的 `EstablishGlobalMember`、`PublishIdentityOutbox`、`RebuildIdentityProjection` 等为准 |
| 下游文档关系 | 旧 `05/06/07` 作为输入 | 旧 `05/06/07` 只作历史诊断和后续回写对象 |
| `03` 回写纪律 | 旧 Step 15 判定无阻塞回写 | 本轮每 Step 重新判定;影响代码契约必须回写 `03` |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 局部修补旧 `04` | 改动小 | 容易保留旧 command/job/profile/port 口径,与新版 `03` 不一致 | 不采用 |
| 直接重写正式 `04` | 快 | 违反配置 SOP 的中间产物先行和逐 Step 停审纪律 | 不采用 |
| 从 Step 1 重新跑配置设计 | 可追溯,能逐项对齐新版 `03` | 文档工作量较大 | 采用 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射

| 来源文档 | 新版 `04` 承接内容 | 本 Step 判断 |
|---|---|---|
| `00-需求文档.md` | identity 仓定位、数据归属、认证 / ProjectMember / RoleDefinition / memory body 非范围、验收红线 | 稳定输入 |
| `01-架构设计.md` | 系统上下文、依赖裁剪、runtime/event/handoff 协作、forbidden body boundary | 稳定输入 |
| `02-概要设计.md` | 主要组成部分、配置影响轮廓、接口/flow/state 概要 | 稳定输入,若与正式 `03` 冲突以 `03` 为准 |
| `03-详细设计.md` | runtime config boundary、external dependency binding、ports/adapters、protocol、flow、state、idempotency、observability/test cut 和下游复核要求 | 直接上游 |
| 旧 `04-配置设计.md` | 旧配置项、旧 profile、旧下游承接和历史问题线索 | 历史诊断,不作为真相源 |
| 旧 `05/06/07` | 旧测试环境、验收和实施口径 | 后续回写对象,不作为新版 `04` 上游 |

### 7.2 新版 `03` 配置输入候选

| 来源位置 | 配置输入候选 | 后续 Step |
|---|---|---|
| `03` §13.1 | Raw config ownership、infra loader、runtime builder、entry composition root、application injected ports / typed params | Step 3 / 9 |
| `03` §13.2 | `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` | Step 3 / 7 |
| `03` §13.3 | Store、idempotency/result、projection/reference/report、bus publisher、role/governance/work/artifact/memory resolver、handoff、audit、clock/id、fake/controlled/disabled adapter | Step 3 / 7 / 8 / 11 |
| `03` §13.4 | raw config parse、type/range/cross-field validation、sensitive refs、`IdentityRuntimeConfigShell`、runtime assembly state | Step 8 / 9 |
| `03` §13.5 | `core-contracts` 唯一编译期 sibling dependency、fake success 禁止、invariant 禁配红线 | Step 4 / 11 / 14 |
| `03` §14 | observability / redaction boundary、safe fields、low-cardinality labels、forbidden material | Step 8 / 12 |
| `03` §15 | config/runtime/adapter/observability/redaction test cuts | Step 12 |
| `03` §17/18 | `04/05/06/07` 必须复核、真实产品绑定未裁决、性能 / 可用性阈值未裁决 | Step 12 / 14 |

### 7.3 本轮不再回答的问题

- 不重新定义 `GlobalMember`、`GlobalLifecycleState`、`RoleCapabilitySummary`、`CareerRecord`、`MemoryReference` 等对象字段或状态。
- 不重新定义 Command、Query、Inbound / Callback、Outbound Event、Operations Job DTO schema。
- 不新增 repository、resolver、publisher、handoff、UnitOfWork、Clock、IdGenerator、projection、reference、report、idempotency 或 stored result port。
- 不选择具体 DB、message bus、secret provider、metric backend、DLQ、archive、external GRC 或 deployment 产品。
- 不定义测试编号、fixture、CI、evidence、acceptance gate、phase 或 commit boundary。

### 7.4 本轮必须回答的问题

- `L1-identity` 有哪些配置控制面,分别绑定新版 `03` 的哪些 module / port / entry / flow。
- 哪些行为允许配置化,哪些是设计不变量,必须禁止由 profile、env、feature flag、fixture 或 fake adapter 覆盖。
- 配置来源、优先级、冲突处理、entry-local 参数、job-run-start 参数和 test fixture override 如何生效。
- 环境 / profile / adapter mode 如何命名和冻结,是否继续沿用旧四 profile。
- 每个配置项的类型、默认值、必填性、来源、作用域、生效时机、敏感级别、失败策略和关联模块。
- sensitive ref、secret ref、raw secret 禁止输出、redaction 和 observability handoff 如何闭合。
- 配置加载、校验、变更、回滚和失效策略如何承接 runtime builder 与 adapter availability。
- `05/06/07/09` 如何按新版 `04` 承接,以及哪些事项仍待确认。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 旧 `04` 降级为历史诊断输入 | 否 | 下游文档复核 | 不适用 | 无回写 |
| 新版 `04` 必须按正式 `03` §13/17/18 重写 | 否 | 配置设计执行顺序 | 不适用 | 无回写 |
| 旧 command/job/profile 名不得直接继承 | 否 | 命名一致性复核 | 不适用 | 无回写 |
| 若后续 Step 发现缺 runtime config / builder / adapter / port / error / DTO / flow 契约 | 是 | 可能影响代码契约 | 待后续 Step 定位 | 阻塞待确认 |

---

## 9. 回填草稿

正式 `04-配置设计.md` 第 1 章后续可按下列结构装配:

```md
## 1. 与上游文档的关系声明

本配置设计承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和已完成 Step 19.5 closure 的 `03-详细设计.md`。其中 `03-详细设计.md` 是配置控制面、runtime builder、adapter binding、external dependency、observability/redaction 和下游复核要求的直接上游。

旧 `04-配置设计.md` 和旧 `04_config_step_*.md` 只作为历史诊断输入。凡是旧文档中的旧 command、job、profile、mock/stub、port、adapter 或 implementation phase 口径,必须在本轮对应 Step 重新复核后才能进入新版正式 `04`。
```

本草稿只作为 Step 15 装配输入,当前不写入正式 `04-配置设计.md`。

---

## 10. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| ID-CFG-S01-OPEN-001 | 新版 `04` 是否从 Step 1 重新跑而非局部修补旧 `04` | Step 1 | 已采用重新跑 |
| ID-CFG-S01-OPEN-002 | 旧 `04` 中旧 command / job / profile 口径如何处理 | Step 1 | 降级为历史诊断 |
| ID-CFG-S01-OPEN-003 | 初始配置输入候选是否足以进入 Step 2 scope | Step 1 | 待用户审核 |

---

## 11. 进入下一步条件

进入 Step 2 前必须满足:

- 用户审核通过 Step 1。
- Step 2 只定义配置设计目标、范围、非范围和 P0/P1/P2 口径,不得直接列完整配置项清单。
- Step 2 必须以新版 `03` §13 的配置分类和 §17/18 的下游复核风险为输入。
- 若 Step 2 发现必须新增 runtime config、builder、adapter constructor、port、error、DTO 或 flow 契约,必须记录 `03` 回写 blocker,不得在 `04` 中自行补口。
