# L0-sdk 05 测试方案 Step 1:确认测试输入边界

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §1 与上游文档的关系声明
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认测试输入边界 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_01_input_boundary.md` |

本步只确认新版测试方案从哪些文档取得输入、哪些旧口径不再继承、哪些问题必须由测试方案回答。正式 `05-测试方案.md` 仍保持旧文件不动，等 Step 15 删除旧文件后按新文件标准重建。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `projects/L0-sdk/00-需求文档.md` | 提供 CL-001~CL-005、US-001~US-009、F-001~F-010、BR-001~BR-014、数据归属和验收方向 | 作为测试目标和追溯输入 |
| `projects/L0-sdk/01-架构设计.md` | 提供 SDK 系统位置、职责边界、上下游依赖、运行承载、数据所有权、关键交互和横切关注点 | 作为测试边界和非功能输入 |
| `projects/L0-sdk/02-概要设计.md` | 提供主要组成部分、关键对象、API / 接口骨架、处理流、状态机、异常边界和配置影响轮廓 | 作为测试对象抽取输入 |
| `projects/L0-sdk/03-详细设计.md` | 提供 module / crate、对象契约、trait / port、DTO、函数流、状态矩阵、事务、错误、幂等、配置绑定、观测和最小测试切口 | 作为测试用例和断言真相源 |
| `projects/L0-sdk/04-配置设计.md` | 提供 profile、配置项、加载校验、敏感配置、失效模式、artifacts / reports 和下游测试承接口径 | 作为环境、配置矩阵和负向测试输入 |
| `projects/L0-sdk/06-验收标准.md` | 当前仍是旧版验收方向 | 仅作为旧风险参考,不作为新版测试真相源 |
| `projects/L0-core/00~07` | 提供共享契约、错误、trace、metadata、CloudEvents、配置和测试证据口径 | 作为 SDK 上游 truth 的外部基线 |
| `projects/L0-bus/00~07` | 提供事件语义、publish / subscribe / ack / retry / DLQ / replay / tap / reports 口径 | 作为 SDK event client view 的外部基线 |

## 3. SOP 问题回答

### 3.1 当前测试方案要承接哪些需求、规则和非功能目标?

| 类型 | 必须承接的输入 | 对测试方案的影响 |
|---|---|---|
| 核心闭环 | CL-001 三语言稳定承接、CL-002 官方客户端一致、CL-003 最小可验证接入、CL-004 横切默认一致、CL-005 文档与兼容演进 | 测试目标必须围绕三语言、官方 client、最小接入、横切默认和兼容演进组织 |
| 用户故事 | US-001~US-009 | 测试追溯必须覆盖 maintainer、三语言消费者、文档维护者、release maintainer、安全审查和架构审查视角 |
| 功能需求 | F-001~F-010 | 用例矩阵必须覆盖契约承接、事件封装、错误 / trace、redaction、candidate、quickstart、smoke、compatibility 和 deprecated |
| 业务规则 | BR-001~BR-014 | 负向测试必须覆盖不重定义 core / bus truth、不拥有服务端 truth、不做 auth / governance、不泄露敏感材料、不绕过 evidence / compatibility gate |
| 数据归属 | SDK truth、上游快照、引用数据、禁止正文 | 测试断言必须区分 truth、view、ref、body forbidden，不得用正文证据替代引用证据 |
| 非功能 | 可追溯、安全、可用性、可维护、演进兼容 | 测试方案必须形成 reports / artifacts、redaction 一票否决、public registry 非 P0、外围增强不阻塞的证据口径 |

### 3.2 哪些概要 / 详细设计章节直接影响测试对象?

| 来源章节 | 影响的测试对象 |
|---|---|
| `02` §5 主要组成部分、职责与边界 | 测试切口必须覆盖上游契约消费、官方客户端语义、平台能力访问、事件客户端视图、横切默认、candidate 与证据、兼容演进 |
| `02` §6 关键对象轮廓 | 测试对象必须包含 semantic baseline、derived view、service / event view、policy、candidate、evidence、compatibility、deprecated 相关对象 |
| `02` §7 API / 接口骨架 | 测试方案必须覆盖 Command、Query、Inbound Consumer、Outbound Event、Operations Job |
| `02` §8 关键处理流 | 用例必须按主要 flow 设计,不能只按对象或文件名列测试 |
| `02` §9 状态定义与状态流转 | 状态机测试必须使用正式状态名,并覆盖禁止迁移 |
| `02` §10 异常与边界场景 | 负向测试必须覆盖 stale、fake-only、unsupported、unredacted、breaking、query 写入等场景 |
| `02` §11 配置影响轮廓 | 配置测试必须验证配置不能绕过 truth、redaction、credential、candidate 和 compatibility gate |
| `03` §4~§7 实现单元、模块、对象、协议 | 单元、service、contract 和 adapter 测试的对象与接口必须从这里抽取 |
| `03` §8~§12 函数流、状态、事务、错误、幂等 | 用例断言必须覆盖状态副作用、事务边界、错误类型和幂等行为 |
| `03` §13~§15 配置、观测、测试切口 | 测试方案必须承接脚本、artifacts、reports、redaction check 和最小验证清单 |
| `04` §6~§12 profile、配置项、敏感配置、加载校验、失效模式、下游承接 | 环境配置矩阵、配置负向测试、fail-fast / fail-closed 和证据路径必须从这里展开 |

### 3.3 哪些验收项需要测试方案提供证据?

| 验收方向 | 测试方案需要提供的证据 |
|---|---|
| 三语言稳定承接成立 | Rust / Python / TypeScript 对同一上游 snapshot 的生成、包装和 smoke 证据 |
| 官方客户端概念一致成立 | 跨语言 semantic baseline、错误形状、trace 注入、redaction 行为和事件视图一致性断言 |
| 最小可验证接入成立 | stable formal API 或 fake / fixture endpoint 下的 client 调用、docs example 和 smoke 结果 |
| 横切默认一致成立 | error mapping、trace propagation、redaction、credential protection 和 fake marker guard 的自动化证据 |
| 文档与兼容演进成立 | quickstart、docstring、docs runner、compatibility decision、deprecated record 和 migration ref 证据 |
| core / bus truth 不被重定义 | contract compare、event semantic compare、禁止替代 schema / delivery truth 的负向测试 |
| 禁止正文不入仓 | artifacts / reports / errors / logs / evidence 中 raw body、raw secret、production request / response body 为 0 |
| candidate 可追溯 | package candidate 关联上游版本、runner result、evidence result、redaction status、compatibility decision 和 report ref |

### 3.4 哪些内容不应在测试方案中重新定义?

| 不再回答的问题 | 正确归属 |
|---|---|
| SDK 的需求目标、功能编号、业务规则和验收方向 | `00-需求文档.md` |
| SDK 是否是 official client access layer、是否不做 server gateway / auth / UI / runtime | `01-架构设计.md` |
| 主要组成部分、关键对象、接口名称、处理流名称和状态主语 | `02-概要设计.md` |
| Rust struct / enum / trait / DTO / function signature / error type / state variant | `03-详细设计.md` |
| JSON 配置 demo、配置项、默认值、profile、加载优先级和敏感配置处理 | `04-配置设计.md` |
| core proto / DTO、ErrorCode、TraceContext、metadata、CloudEvents truth | `L0-core` |
| bus publish / subscribe / delivery / retry / DLQ / replay / tap truth | `L0-bus` |
| 公共 registry 正式发布、生产 endpoint 全集、KMS / Vault 产品配置 | 后续发布、运维或安全专项 |
| 开发排期、commit boundary、编码顺序和交付节奏 | `07-实施计划.md` |

### 3.5 当前上游是否存在会阻塞测试设计的缺口?

| 缺口 / 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 当前 `05-测试方案.md` 是旧版草案 | 否 | Step 15 删除旧文件并重建,Step 1~14 不继承旧编号和旧对象 |
| 当前 `06-验收标准.md` 是旧版草案 | 否 | 新版测试方案先从 `00` §14 和 `03/04` 反推证据;新版 `06` 后续必须引用新版 `05` 证据 |
| P0 最小验证目标可使用 stable formal API 或 fake / fixture endpoint | 否 | Step 8 环境配置矩阵中明确 profile;fake / fixture 只能证明最小接入,不得宣称 production supported |
| reports / artifacts 具体字段还需在测试方案展开 | 否 | Step 13 专门定义测试报告与证据归档 |
| 公共 registry 发布不进入 P0 | 否 | 测试只验证本地 package candidate 和候选证据,不把 public publish 作为退出条件 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 仍围绕 `GenerateBindings`、wrapper、subscription helper、release manifest 等旧对象展开,没有承接新版 semantic baseline、derived view、runtime boundary、candidate evidence、compatibility、configuration 和 reports / artifacts 主线 |
| 当前旧 `06-验收标准.md` | 仍用 binding / wrapper / subscription / release manifest 的验收口径,不能直接作为新版测试证据目标 |
| 新版 `00~04` | 已足够支撑测试方案进入 Step 2;测试设计必须从这些文档抽取对象、场景、状态和配置 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试输入源 | 旧 `05/06` 与历史 SDK 草案混用 | 以新版 `00~04` 为真相源,旧 `05/06` 仅作风险参考 |
| 测试主线 | binding -> wrapper -> subscription -> release manifest | official client access layer -> semantic baseline -> derived view -> runtime boundary -> candidate evidence -> compatibility -> configuration -> reports / artifacts |
| 验收证据 | artifact、descriptor、release manifest 等旧证据 | candidate、evidence result、redaction status、compatibility decision、docs / smoke runner、artifacts/test、reports/runs |
| 配置输入 | 旧 test / staging 环境粗粒度描述 | 承接 `04` 的 local-dev、ci-test、integration-test、candidate-validation profile 和 11 个 `SdkRuntimeConfig` 配置组 |
| 重建方式 | 在旧 `05` 上修补 | Step 15 删除旧 `05` 后按新版书写规范重建 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否继承旧测试编号 | 不继承 | 旧编号绑定旧对象,继续使用会让测试矩阵混入旧语义 |
| 是否把旧 `06` 作为硬输入 | 不作为硬输入 | 旧验收未承接新版 `03/04`,只保留“验收需要证据”的方向 |
| 是否把 `04-配置设计.md` 加入 Step 1 输入 | 加入 | SDK 测试环境、runner、artifact root、report root、redaction、secret ref 和 fail-fast 均直接受配置影响 |
| 是否在 Step 1 画图 | 不画 | 本步目标是输入边界,表格足以表达来源和归属;图示留给测试对象、分层、环境和证据流相关 Step |
| 是否提前定义用例 | 不定义 | Step 1 只定义输入边界;用例由 Step 6 在追溯和切口收稳后生成 |

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | CL、US、F、BR、数据归属、非功能和验收方向 | §1、§2、§5 |
| `01-架构设计.md` | 系统边界、依赖方向、数据所有权、通信方式、横切关注点、演进路线 | §1、§2、§3、§4、§10、§14 |
| `02-概要设计.md` | 主要组成部分、对象、接口、处理流、状态、异常边界、配置影响 | §3、§4、§6、§10 |
| `03-详细设计.md` | 模块、对象契约、port / adapter、DTO、函数流、状态矩阵、事务、错误、幂等、观测、脚本契约 | §3、§4、§6、§9、§10、§11、§13 |
| `04-配置设计.md` | profile、配置项、加载校验、敏感配置、失效模式、下游承接 | §7、§8、§9、§10、§12、§13 |
| `06-验收标准.md` 旧稿 | 旧验收风险和证据方向 | 不直接回填;新版 `06` 后续重建 |

### 7.2 不再回答的问题清单

| 问题 | 不在 `05` 回答的原因 |
|---|---|
| 为什么 `L0-sdk` 是官方客户端接入层 | 已由 `00/01` 定义 |
| SDK 是否可以重新定义 core / bus truth | 已由 `00/01/02/03` 禁止 |
| `PackageCandidateStatus`、`EvidenceResult`、`CompatibilityDecisionState` 有哪些正式状态值 | 已由 `03` §9 定义 |
| `SdkRuntimeConfig` 有哪些配置组和 JSON 示例 | 已由 `04` 定义 |
| 如何实现 repository、runner、adapter、outbox 和 projection | 已由 `03` 与后续 `07` 承接 |
| 公共 registry 发布是否属于 P0 | 已由 `00/01/03/04` 判定为非 P0 |

### 7.3 测试方案必须回答的问题清单

| 必须回答的问题 | 后续 Step |
|---|---|
| 本轮测试要证明哪些 P0 目标成立,哪些明确不测 | Step 2 |
| 哪些对象、接口、状态机、事务、错误、幂等、配置和观测必须成为测试切口 | Step 3 |
| 每类风险应在哪个测试层发现 | Step 4 |
| F-001~F-010、BR-001~BR-014 如何映射到场景、用例和证据 | Step 5 |
| P0 正向、反向、边界、非法迁移和恢复用例如何执行与断言 | Step 6 |
| fixture、snapshot、candidate、evidence、config、secret ref 和 fake boundary 数据如何构造 | Step 7 |
| local-dev、ci-test、integration-test、candidate-validation 如何配置和隔离 | Step 8 |
| CI gate、scripts、redaction check、artifacts/test 和 reports/runs 如何形成 | Step 9、Step 13 |
| 安全、兼容、可追溯、性能 / 容量、漂移和外围增强缺失如何专项验证 | Step 10 |
| 缺陷、复验、进入退出准则、回归和残余风险如何定义 | Step 11、Step 12、Step 14 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §1 时摘录。

```markdown
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/05_test_plan_step_01_input_boundary.md`

本文承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 与 `04-配置设计.md`。其中 `00` 提供 CL / US / F / BR / 数据归属 / 验收方向，`01` 提供系统边界和横切关注点，`02` 提供测试对象轮廓，`03` 提供可断言的实现契约、函数流和状态矩阵，`04` 提供测试环境、配置矩阵、敏感配置和证据路径输入。

当前旧版 `05-测试方案.md` 与 `06-验收标准.md` 仍围绕 binding / wrapper / subscription / release manifest 旧主线展开，不作为新版测试真相源。本文不重新定义需求、架构、概要、详细设计、配置项、core truth 或 bus truth，只负责把已确认设计转化为测试目标、测试切口、用例、数据、环境、自动化门禁和可供验收引用的证据。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 新版 `06-验收标准.md` 是否应在新版 `05` 完成后重建 | 是 | 验收标准需要引用新版测试证据,旧 `06` 与新版主线不一致 |
| P0 最小验证目标是否先使用 fake / fixture explicit profile | 是,直到 stable formal API 被正式指定 | 可支撑最小接入和文档示例验证,同时不宣称 production supported |
| Step 15 是否删除旧 `05-测试方案.md` 后重建 | 是 | 避免旧测试编号和旧对象残留 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 输入文档清单明确 | 已满足 |
| `04-配置设计.md` 是否进入测试输入已确认 | 已满足 |
| 旧 `05/06` 的处理口径明确 | 已满足 |
| 测试方案不再回答的问题已明确 | 已满足 |
| 测试方案必须回答的问题已明确 | 已满足 |

Step 2 可以在本文件被确认后开始,主题是明确测试目标、范围和非范围。
