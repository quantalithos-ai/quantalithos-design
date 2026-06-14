# Step 1. 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
> 回填章节: `03-详细设计.md` §1 与上游文档的关系声明,以及 §17 风险与待确认事项
> 生成日期: 2026-06-11
> 状态: Step 1 已完成,已审核通过

---

## 1. Step 状态 + Step 内计划

本 Step 只确认新版 `03-详细设计.md` 可以承接哪些已收稳输入,不展开实现范围、文件布局、对象契约、协议 schema 或状态矩阵。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取详细设计 SOP、书写规范和闭环标准 | 已完成 | §2 |
| 读取新版 `02-概要设计.md` 第 12 / 13 章承接清单与风险 | 已完成 | §2 |
| 诊断旧 `03-详细设计.md` 的输入边界问题 | 已完成 | §4 |
| 回答 Step 1 SOP 问题 | 已完成 | §3 |
| 形成上游关系映射表 | 已完成 | §7.1 |
| 形成本文不再回答 / 必须回答清单 | 已完成 | §7.2~§7.3 |
| 形成输入不足风险清单 | 已完成 | §7.4 |
| 形成正式 `03` §1 / §17 回填草稿 | 已完成 | §9 |
| 更新 `03_ddd_calibration_flow.md` 状态 | 已完成 | `03_ddd_calibration_flow.md` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供仓定位、需求编号、业务规则和 VETO 来源 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供系统边界、依赖方向、数据所有权和运行机制来源 |
| `projects/L1-identity/02-概要设计.md` | Step 14 已审核通过 | 新版 `03` 的直接输入 |
| `projects/L1-identity/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已完成 | 详细设计承接清单和回退规则 |
| `projects/L1-identity/design-calibration/02_hld_step_13_risks_open_questions.md` | 已完成 | `03` 开始前必须保留的风险和待确认项 |
| `standards/document/详细设计讨论流程_SOP.md` | 最新流程标准 | Step 1 执行依据 |
| `standards/document/详细设计书写规范.md` | 最新正式结构标准 | 正式 `03` 章节结构依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 最新中间产物标准 | Step 文件结构、追溯和未来 Step 落盘纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新闭环标准 | 判断后续实现契约是否可 1:1 落码 |
| 旧 `projects/L1-identity/03-详细设计.md` | 已降级为旧草稿 | 只作为问题诊断输入,不得直接继承 |
| 现有 `projects/L1-identity/04-配置设计.md` | 早于新版 `02/03` | 不作为新版 `03` 输入,只作为后续配置线风险 |

---

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接概要设计中的哪些结论?

新版 `03` 直接承接 `02-概要设计.md` 已收稳的以下结论:

- `L1-identity` 是平台级 AI 员工身份 truth center。
- 8 个主要组成部分:身份锚定与成员真相、全局生命周期、角色能力摘要、身份生涯记录、记忆引用关系、身份事实消费与追溯、派生维护与对账、身份事实传播与外部交接。
- 实现分层:Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Outbox。
- 关键对象轮廓:从 `GlobalMember`、`IdentityAnchorState` 到 `IdentityOutboxRecord`、`TraceHandoffIntent`、`OutboxState`、`HandoffState` 的对象索引。
- API / 接口骨架:6 个 Command、14 个 Query、5 个 Inbound Event Consumer、10 个 canonical outbound event material、6 个 Operations Job。
- 处理流方向:Command accepted、Query no-write、Consumer body-free、Job report-only / propagation-only、outbox publish / handoff 后置。
- 状态主语和状态边界:core truth state、source / projection / reference / report / outbox / handoff marker、query surface。
- 异常和边界:reject-before-accepted、not visible / stale / degraded、forbidden body、fake delivered 禁止、publish / handoff 失败不回滚 truth。
- 配置影响轮廓:配置只影响 runtime assembly、adapter、store、job、publisher 和 handoff,不得改变不变量。

### 3.2 概要设计中的代码主体框架是否已经足够稳定?

足够进入详细设计 Step 2~5。`02` 已明确业务主要组成部分、实现分层和详细设计承接方向。

但它尚未定义:

- crate / module / package / binary 布局。
- 每个模块的文件路径和依赖关系。
- 具体 Rust type、field、function signature、trait、DTO、state enum、persistence schema 和 test cuts。

这些正是新版 `03` 的任务,不阻塞 Step 1。

### 3.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够作为详细设计输入。对象、接口、处理流和状态主语均已完成概要层索引和跨章节审计。详细设计可以基于这些索引继续展开:

- Step 6 逐模块定义对象实现契约。
- Step 7 逐模块定义 Trait / Port / Adapter 契约。
- Step 8 定义 API / Command / Query / Event / Job 协议契约。
- Step 9 逐接口定义函数级处理流。
- Step 10 定义状态机与转换矩阵。

如果后续 Step 发现需要新增主要组成部分、关键对象、P0 接口、长期状态或 flow 方向,必须按 `02` 第 12 章回退规则返回概要设计对应 Step 修正。

### 3.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

这些内容不阻塞 Step 1,但会成为后续详细设计 Step 的必闭项:

- sibling repo / shared contract reality check。
- Role / capability source protocol 和 safe summary 字段。
- Governance basis schema。
- Work participation source marker。
- Memory / archive carrier、handoff target 和 receipt marker。
- Visibility / privacy 字段级矩阵。
- Projection lookup、reference refresh scope、affected views。
- Optimistic version、truth cursor、refresh cursor、id generator 来源。
- Outbox payload snapshot、event envelope、stored result、duplicate replay surface。
- fake / controlled / endpoint / disabled adapter 语义。

### 3.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

详细设计不能重新定义:

- identity truth ownership 和 `GlobalMember` / `ProjectMember` 分层。
- query no-write、report-only maintenance、eventual propagation、forbidden body、fake delivered 禁止。
- RoleDefinition / CapabilityDefinition body、Project / WorkItem / ProjectMember truth、memory body、archive package、runtime body 不入仓。
- 编译期依赖裁剪和 runtime / event / handoff 协作边界。
- 配置不得改变业务不变量、状态机红线和安全边界。

这些结论只能在详细设计中展开为可实现契约,不能改变。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `03-详细设计.md` 仍引用旧 `02` 版本和旧对象线 | 与新版 `02` 的 8 个主要组成部分、对象索引和接口骨架不一致 | 旧 `03` 整体降级为诊断输入,不得直接继承 |
| 旧 `03` 以 `RoleCatalogEntry`、`CapabilityProfile` 等旧主语组织 | 新版 `02` 已收敛为 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot` 等对象 | 后续 Step 6 按新版对象索引重新抽象 |
| 旧 `03` 直接进入目录、对象和 API | 缺少按 Step 建立输入边界和风险承接 | 本轮先建立工作台和 Step 1 |
| 旧 `03` 可能把性能阈值、配置项或测试策略前置为详细设计结论 | 新版 `02` 已要求阈值、配置 schema、测试方案后移 | Step 1 保留边界,后续 Step 2 / 14 / 16 再分别处理 |
| 现有 `04` 早于新版 `02/03` | 不能反向约束 detailed config binding | Step 1 只将其列为后续风险,不作为输入 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 正式 `03` 状态 | 旧详细设计草稿,旧对象 / API / schema 口径混杂 | 降级为重写中占位,等待 Step 19 装配 |
| 生成方式 | 旧稿直接按章节写正文 | 按详细设计 SOP Step 1~19 逐步生成中间产物 |
| 直接输入 | 旧 `00/01/02` 版本和旧实现口径 | 新版 `02` Step 14 审核通过稿 |
| 风险处理 | 分散在旧章节中,不一定阻止实现脑补 | 先承接 `02` 第 13 章风险,后续 Step 逐项闭合 |
| 未来 Step 文件 | 旧内容已存在于正式 `03` 中 | 不提前批量生成未来 Step 中间产物 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 在旧 `03` 上局部替换对象名 | 不采用 | 旧结构会继续约束新版 detailed design,容易残留旧 API / schema / 状态 |
| 直接开始 Step 4 文件布局 | 不采用 | 还未完成 Step 1 / Step 2 的输入边界和范围确认 |
| 先建立 `03_ddd_calibration_flow.md`,再完成 Step 1 | 采用 | 符合详细设计 SOP 和中间产物规范 |
| 在 Step 1 解决所有 `02` 风险 | 不采用 | Step 1 只识别输入不足风险;具体闭口归 Step 3~16 |
| 把现有 `04` 配置内容作为 `03` Step 14 输入 | 不采用 | 现有 `04` 早于新版 `02/03`,不能反向约束详细设计 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、需求编号、业务规则、数据归属、VETO、非功能与验收红线 | 转化为对象不变量、接口前置条件、错误分支、测试切口和验收可追溯输入 |
| `01-架构设计.md` | 系统边界、依赖方向、数据 ownership、一致性、通信方式、配置和观测约束 | 转化为 crate / module 依赖、port / adapter、event / handoff、persistence 和 runtime binding 契约 |
| `02-概要设计.md` | 8 个主要组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响、详细设计承接清单和风险 | 直接展开为模块、文件、对象、trait、DTO、flow、state matrix、persistence、error、idempotency、config、observability 和 test cuts |
| `design-calibration/02_hld_step_*.md` | 概要设计结论的推导过程和细节解释 | 当正式 `02` 摘要不足时提供追溯;若冲突,以正式 `02` 为准 |
| `standards/document/详细设计讨论流程_SOP.md` | 详细设计 Step 1~19 生成流程 | 规定每一步问题、输出、门禁和停审节奏 |
| `standards/document/详细设计书写规范.md` | 正式 `03` 18 章结构、代码块、Rustdoc、校准来源规则 | 规定 Step 19 装配后的正式文档形态 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、状态、metadata、idempotency、projection、handoff、query visibility 等闭环经验 | 作为 Step 6~17 可落码复核门禁 |
| 旧 `03-详细设计.md` | 历史问题和旧口径线索 | 只作诊断输入;不得直接进入新版结论 |

### 7.2 本文不再回答

- 不再回答 identity 是否是平台级 AI 员工身份 truth center。
- 不再回答 `GlobalMember` / `ProjectMember`、RoleDefinition body、memory body、runtime body、credential 等 ownership 边界。
- 不再回答概要层 8 个主要组成部分是否成立。
- 不再回答 6 个 Command、14 个 Query、5 个 Inbound Event Consumer、10 个 canonical outbound event material、6 个 Operations Job 是否是概要接口主语。
- 不再回答 query no-write、report-only maintenance、eventual propagation、forbidden body、fake delivered 禁止是否成立。
- 不再重写需求目标、用户故事、架构边界、技术方案取舍或配置设计。

### 7.3 本文必须回答

- 实现单元、crate / module / binary / file layout 如何落地。
- 每个模块的职责、对外暴露、依赖方向和禁止依赖是什么。
- 每个对象的 struct / enum / value object / service 契约、字段、函数、factory、状态和不变量是什么。
- 每个 trait / port / adapter 的读取面、保存面、fake 等价语义和错误 surface 是什么。
- 每个 Command / Query / Event / Job 的 request / response / envelope / receipt / report / marker schema 是什么。
- 每条接口级 flow 的 application service、domain method、repository / port、transaction boundary、trace / audit / outbox / projection stale / stored result 顺序是什么。
- 每个状态机的状态集合、允许迁移、禁止迁移、触发函数、guard、side effect 和 public marker 是什么。
- 持久化、事务、一致性、version、cursor、id generator、idempotency、duplicate replay 如何闭合。
- 配置引用、外部依赖绑定、观测 / 审计埋点、测试切口和实施计划承接如何落到可实现契约。

### 7.4 输入不足风险清单

| 风险 | 是否阻塞 Step 2 | 当前处理 |
|---|---|---|
| sibling repo / shared contract reality 未复核 | 否 | Step 3 / Step 7 / Step 8 必须读取实际仓库和标准,发现缺口先回写设计 |
| Role / capability source protocol 未闭口 | 否 | Step 7 / Step 8 / Step 9 闭口 resolver、DTO 和 source flow |
| Governance basis schema 未闭口 | 否 | Step 7 / Step 8 / Step 10 / Step 12 闭口 basis ref / summary / error surface |
| Work participation source marker 未闭口 | 否 | Step 8 / Step 11 / Step 13 闭口 source marker、unique key 和 duplicate replay |
| Memory / archive carrier、handoff target 和 receipt marker 未闭口 | 否 | Step 7 / Step 8 / Step 9 / Step 14 闭口 handoff port、DTO、target config 和 receipt marker |
| Visibility / privacy 字段级矩阵未闭口 | 否 | Step 8 / Step 9 / Step 12 / Step 16 闭口 query response、redaction 和 tests |
| Projection lookup / reference refresh scope / affected views 未闭口 | 否 | Step 7 / Step 8 / Step 9 / Step 11 闭口 read surface、index lookup 和 stale semantics |
| Optimistic version、truth cursor、refresh cursor、id generator 来源未闭口 | 否 | Step 6 / Step 7 / Step 11 / Step 13 闭口字段来源、repo、UoW 和 fake 等价 |
| Outbox payload snapshot、event envelope、stored result 未闭口 | 否 | Step 8 / Step 9 / Step 11 / Step 13 闭口 payload、envelope、duplicate replay |
| fake / controlled / endpoint / disabled adapter 语义未闭口 | 否 | Step 14 / Step 16 闭口 adapter config、fake 不伪成功和测试证据 |
| 现有 `04/05/06/07` 早于新版 `02/03` | 否 | 后续文档需按新版 `03` 复核,不反向约束当前 Step |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只确认上游输入边界,不需要拆模块附录。

后续复杂 Step 必须拆分:

- Step 6 按模块 capability 小循环拆分对象契约。
- Step 7 按模块拆分 port / adapter 契约。
- Step 8 按协议族或所属模块拆分 DTO / event / job schema。
- Step 9 按接口逐条拆分函数级 flow。
- Step 10 按状态机逐个拆分状态矩阵。

当前不创建 Step 2~19 的未来文件。

---

## 9. 回填草稿

正式 `03-详细设计.md` §1 后续应回填:

1. 上游关系映射表。
2. 本文不再回答清单。
3. 本文必须回答清单。
4. 旧 `03` 降级为历史诊断输入的声明。

正式 `03-详细设计.md` §17 后续应回填:

1. 输入不足风险清单。
2. 会阻塞详细设计 / 实现的条件。
3. 后续 Step 必须闭合的可落码风险。

正式正文要等 Step 19 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可新版 `02` 已足够作为新版 `03` 直接输入 | 若不认可,必须回退概要设计对应 Step | 当前按 Step 14 审核通过承接 |
| 是否认可旧 `03` 整体降级为诊断输入 | 若不认可,需明确哪些旧内容可以通过新版 Step 重新进入 | 当前不直接继承旧稿 |
| 是否认可现有 `04/05/06/07` 不作为新版 `03` 上游 | 若不认可,会造成旧下游文档反向约束详细设计 | 当前作为后续复核对象 |

---

## 11. 进入 Step 2 的条件

进入 Step 2 前必须满足:

- 用户审核通过本 Step 的上游关系映射。
- 用户确认新版 `03` 只承接新版 `00/01/02` 和对应中间产物。
- 用户确认旧 `03`、现有 `04/05/06/07` 不作为新版 `03` 的正式上游。
- 输入不足风险已进入后续 Step 闭口清单,未被写成已闭口契约。
