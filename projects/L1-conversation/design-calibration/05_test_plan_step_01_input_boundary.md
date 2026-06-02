# L1-conversation 05 测试方案 Step 1: 确认测试输入边界

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §1 与上游文档的关系声明
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认测试输入边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_01_input_boundary.md` |

本步只确认新版测试方案从哪些文档取得输入、哪些旧口径不再继承、哪些问题必须由测试方案回答。正式 `05-测试方案.md` 仍保持旧文件不动，等 Step 15 删除旧文件后按新文件标准重建。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `projects/L1-conversation/00-需求文档.md` | 提供 US-CONV-001~010、FR-CONV-001~008、BR-CONV-001~021、NFR-CONV-001~012、数据归属和验收方向 | 作为测试目标和追溯输入 |
| `projects/L1-conversation/01-架构设计.md` | 提供职责边界、系统上下文、上下游依赖、数据所有权、一致性策略、通信方式、横切关注点和演进边界 | 作为测试边界、集成风险和非功能输入 |
| `projects/L1-conversation/02-概要设计.md` | 提供主要组成部分、关键对象、API / 接口骨架、处理流、状态机、异常边界和配置影响轮廓 | 作为测试对象抽取输入 |
| `projects/L1-conversation/03-详细设计.md` | 提供 module / crate、对象契约、trait / port、DTO、函数流、状态矩阵、事务、错误、幂等、配置绑定、观测和最小测试切口 | 作为测试用例和断言真相源 |
| `projects/L1-conversation/04-配置设计.md` | 提供 profile、配置项、加载校验、敏感配置、失效模式、artifacts / reports 和下游测试承接口径 | 作为测试环境、配置矩阵、配置负向测试和证据路径输入 |
| `projects/L1-conversation/06-验收标准.md` | 当前仍是旧版验收方向 | 仅作为旧风险参考，不作为新版测试真相源 |
| 稳定上游 `L0-core` / `L0-bus` / `L0-sdk` / `L1-identity` | 提供 shared contracts、事件协作、SDK surface、actor / identity 引用边界 | 作为 Conversation 消费上游边界的外部基线 |

## 3. SOP 问题回答

### 3.1 当前测试方案要承接哪些需求、规则和非功能目标?

| 类型 | 必须承接的输入 | 对测试方案的影响 |
|---|---|---|
| 核心能力 | 对话空间与参与范围、协作事实追加沉淀、授权视野消费、跨域事实引用显化、历史追溯与复盘 | 测试目标必须围绕 conversation truth center 的 P0 闭环组织 |
| 用户故事 | US-CONV-001~010 | 测试追溯必须覆盖项目负责人、参与者、AI member、下游应用、系统事件 actor、审计者和运维 / 后台任务视角 |
| 功能需求 | FR-CONV-001~008 | 用例矩阵必须覆盖 space / scope、fact append、visibility、manifestation、history、projection、search 和 change awareness |
| 业务规则 | BR-CONV-001~021 | 负向测试必须覆盖 append-only、authorization、source truth isolation、forbidden body、query 不生成事实、projection 不反写真相和维护动作不改变业务事实 |
| 数据归属 | Conversation truth、外部引用 / 快照、禁止正文、派生投影 | 测试断言必须区分 truth、ref、snapshot、projection 和 forbidden body，不得用相邻仓正文替代引用证据 |
| 非功能 | 性能、可用性、安全、审计、幂等、一致性、可观测性 | 测试方案必须形成 authorization、redaction、idempotency、outbox、handoff、projection stale / rebuild、reports / artifacts 的证据口径 |

### 3.2 哪些概要 / 详细设计章节直接影响测试对象?

| 来源章节 | 影响的测试对象 |
|---|---|
| `02` §5 主要组成部分、职责与边界 | 测试切口必须覆盖 conversation truth、authorization scope、external manifestation、projection、outbox、handoff 和 operations job |
| `02` §6 关键对象轮廓 | 测试对象必须包含 space、participant scope、visibility scope、conversation fact、external manifestation、trace / audit、projection、outbox、handoff 相关对象 |
| `02` §7 API / 接口骨架 | 测试方案必须覆盖 Command、Query、Inbound Consumer、Outbound Event、Operations Job |
| `02` §8 关键处理流 | 用例必须按 command 写路径、授权 query 读路径、inbound consumer 和 operations job 设计，不能只按模块列测试 |
| `02` §9 状态定义与状态流转 | 状态机测试必须使用正式状态名，并覆盖禁止迁移 |
| `02` §10 异常与边界场景 | 负向测试必须覆盖 forbidden body、越权、重复输入、source unavailable、outbox publish failure、projection stale / failed、handoff unavailable |
| `02` §11 配置影响轮廓 | 配置测试必须验证配置不能绕过 truth ownership、visibility、state machine、idempotency、redaction 和 audit chain |
| `03` §4~§7 实现单元、模块、对象、协议 | 单元、service、contract、adapter 和 protocol 测试的对象与接口必须从这里抽取 |
| `03` §8~§12 函数流、状态、事务、错误、幂等 | 用例断言必须覆盖状态副作用、事务边界、错误类型、幂等行为和重入保护 |
| `03` §13~§15 配置、观测、测试切口 | 测试方案必须承接脚本、artifacts、reports、redaction check 和最小验证清单 |
| `04` §6~§12 profile、配置项、敏感配置、加载校验、失效模式、下游承接 | 环境配置矩阵、配置负向测试、fail-fast / fail-closed 和证据路径必须从这里展开 |

### 3.3 哪些验收项需要测试方案提供证据?

| 验收方向 | 测试方案需要提供的证据 |
|---|---|
| 对话空间与参与范围能够被独立确立 | create / close space、participant scope、visibility scope 的 contract、state 和 audit 证据 |
| 多来源协作事实能够以追加方式沉淀 | append fact、retract / visibility restrict、重复 command、forbidden body reject 和 append-only history 证据 |
| 对话事实能够按授权视野被稳定消费 | authorized / unauthorized query、read model、change cursor、search、trace context 的访问控制证据 |
| 关键跨域事实能够以引用方式显化到对话 | work / governance / artifact / runtime / bridge / identity inbound event 到 manifestation / fact 的 ref-only 证据 |
| 对话历史能够被追溯并持续支撑协作复盘 | history、trace context、review anchor、audit event、archive / trace handoff 的证据 |
| 外围增强不改变 truth | projection rebuild、search、cursor、reports、operations job 的 read-only / diagnostic-only 证据 |
| 配置与安全红线成立 | raw secret / raw token / forbidden body 不进入配置、日志、报告、artifact、outbox 和 audit 的扫描证据 |
| reports / artifacts 可被验收消费 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 的固定 run 证据 |

### 3.4 哪些内容不应在测试方案中重新定义?

| 不再回答的问题 | 正确归属 |
|---|---|
| L1-conversation 为什么是 Conversation truth center | `00-需求文档.md` / `01-架构设计.md` |
| Conversation 是否拥有治理、产物、项目、成员或外部平台原始真相 | `00` / `01` / `02` / `03` |
| 主要组成部分、关键对象、接口名称、处理流名称和状态主语 | `02-概要设计.md` |
| Rust struct / enum / trait / DTO / function signature / error type / state variant | `03-详细设计.md` |
| JSON 配置 demo、配置项、默认值、profile、加载优先级和敏感配置处理 | `04-配置设计.md` |
| core shared contracts、bus event collaboration、SDK surface、identity actor truth | 对应稳定上游仓 |
| 生产 DB / MQ / KMS / endpoint 字段全集 | 后续 P1/P2 adapter、部署或运维专项 |
| 开发排期、commit boundary、编码顺序和交付节奏 | `07-实施计划.md` |

### 3.5 当前上游是否存在会阻塞测试设计的缺口?

| 缺口 / 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 当前 `05-测试方案.md` 是旧版草案 | 否 | Step 15 删除旧文件并重建，Step 1~14 不继承旧编号和旧对象 |
| 当前 `06-验收标准.md` 是旧版草案 | 否 | 新版测试方案先从 `00` §14 和 `03/04` 反推证据；新版 `06` 后续必须引用新版 `05` 证据 |
| P1/P2 真实 DB / MQ / resolver / handoff / secret provider 未定义 | 否 | P0 测试使用 local-dev、ci-test、integration-like、operations-replay 和 fake / configured ref 接缝 |
| reports / artifacts 具体证据索引还需在测试方案展开 | 否 | Step 13 专门定义测试报告与证据归档 |
| 完整实施计划尚未生成 | 否 | 测试方案先定义门禁和证据，实施计划后续承接 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 仍围绕 Conversation / Turn / StreamEvents / projection 的旧结构展开，未承接新版 `00~04` 的完整对象契约、协议、状态机、配置、reports / artifacts 和 forbidden body / redaction 规则 |
| 当前旧 `06-验收标准.md` | 仍是旧口径，不能直接作为新版测试证据目标 |
| 新版 `00~04` | 已足够支撑测试方案进入 Step 2；测试设计必须从这些文档抽取对象、场景、状态和配置 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试输入源 | 旧 `05/06` 与早期 conversation 草案混用 | 以新版 `00~04` 为真相源，旧 `05/06` 仅作风险参考 |
| 测试主线 | Conversation / Turn / StreamEvents / projection 粗粒度主线 | conversation truth center -> space / scope -> fact append -> authorization -> external manifestation -> projection / outbox / handoff -> configuration -> reports / artifacts |
| 验收证据 | DB / API / event log / stream lag 等旧证据 | fixed run artifacts、reports、config summary、redaction check、state / transaction / idempotency / handoff evidence |
| 配置输入 | dev / test / staging 粗粒度环境 | 承接 `04` 的 local-dev、ci-test、integration-like、operations-replay profile 和 12 个配置模块 |
| 重建方式 | 在旧 `05` 上修补 | Step 15 删除旧 `05` 后按新版书写规范重建 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否继承旧测试编号 | 不继承 | 旧编号绑定旧对象和旧证据，不足以覆盖新版 `03/04` |
| 是否把旧 `06` 作为硬输入 | 不作为硬输入 | 旧验收未承接新版 `03/04`，只保留“验收需要证据”的方向 |
| 是否把 `04-配置设计.md` 加入 Step 1 输入 | 加入 | Conversation 测试环境、adapter、reports、redaction、secret ref 和 fail-fast 均直接受配置影响 |
| 是否在 Step 1 画图 | 不画 | 本步目标是输入边界，表格足以表达来源和归属；图示留给分层、环境和证据流相关 Step |
| 是否提前定义用例 | 不定义 | Step 1 只定义输入边界；用例由 Step 6 在追溯和切口收稳后生成 |

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | US、FR、BR、NFR、数据归属、验收方向和一票否决项 | §1、§2、§5、§10、§14 |
| `01-架构设计.md` | 职责边界、系统上下文、依赖方向、数据所有权、一致性、通信方式、横切关注点 | §1、§2、§3、§4、§10、§14 |
| `02-概要设计.md` | 主要组成部分、对象、接口、处理流、状态、异常边界、配置影响 | §3、§4、§6、§10 |
| `03-详细设计.md` | 模块、对象契约、port / adapter、DTO、函数流、状态矩阵、事务、错误、幂等、观测、脚本契约 | §3、§4、§6、§9、§10、§11、§13 |
| `04-配置设计.md` | profile、配置项、加载校验、敏感配置、失效模式、下游承接 | §7、§8、§9、§10、§12、§13 |
| `06-验收标准.md` 旧稿 | 旧验收风险和证据方向 | 不直接回填；新版 `06` 后续重建 |
| 稳定上游 / 相邻仓 | shared contracts、event collaboration、SDK surface、identity actor ref | §3、§6、§8、§10 |

### 7.2 不再回答的问题清单

| 问题 | 不在 `05` 回答的原因 |
|---|---|
| 为什么 `L1-conversation` 是 Conversation truth center | 已由 `00/01` 定义 |
| Conversation 是否可以保存相邻仓正文、治理结论、artifact 正文或 identity truth | 已由 `00/01/02/03` 禁止 |
| 14 组状态机有哪些正式状态值和合法迁移 | 已由 `03` §9 定义 |
| ConversationRuntimeConfig 有哪些配置组和 JSON 示例 | 已由 `04` 定义 |
| 如何实现 repository、consumer、publisher、handoff、projection 和 job | 已由 `03` 与后续 `07` 承接 |
| 生产级 DB / MQ / KMS / endpoint 是否属于 P0 | 已由 `00/01/03/04` 判定为非 P0 |

### 7.3 测试方案必须回答的问题清单

| 必须回答的问题 | 后续 Step |
|---|---|
| 本轮测试要证明哪些 P0 目标成立，哪些明确不测 | Step 2 |
| 哪些对象、接口、状态机、事务、错误、幂等、配置和观测必须成为测试切口 | Step 3 |
| 每类风险应在哪个测试层发现 | Step 4 |
| FR-CONV-001~008、BR-CONV-001~021、NFR-CONV-001~012 如何映射到场景、用例和证据 | Step 5 |
| P0 正向、反向、边界、非法迁移和恢复用例如何执行与断言 | Step 6 |
| fixture、external reference、actor snapshot、manifestation、config、secret ref 和 fake adapter 数据如何构造 | Step 7 |
| local-dev、ci-test、integration-like、operations-replay 如何配置和隔离 | Step 8 |
| CI gate、scripts、redaction check、artifacts/test 和 reports/runs 如何形成 | Step 9、Step 13 |
| 安全、授权、幂等、一致性、可追溯、性能 / 容量、配置漂移和依赖降级如何专项验证 | Step 10 |
| 缺陷、复验、进入退出准则、回归和残余风险如何定义 | Step 11、Step 12、Step 14 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §1 时摘录。

```markdown
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节，了解本章测试输入边界如何从需求、架构、概要、详细和配置设计收敛而来。

本文承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 与 `04-配置设计.md`。其中 `00` 提供 US / FR / BR / NFR / 数据归属 / 验收方向，`01` 提供系统边界和横切关注点，`02` 提供测试对象轮廓，`03` 提供可断言的实现契约、函数流和状态矩阵，`04` 提供测试环境、配置矩阵、敏感配置和证据路径输入。

当前旧版 `05-测试方案.md` 与 `06-验收标准.md` 不作为新版测试真相源。本文不重新定义需求、架构、概要、详细设计、配置项、core truth、bus truth、SDK surface 或 identity truth，只负责把已确认设计转化为测试目标、测试切口、用例、数据、环境、自动化门禁和可供验收引用的证据。
```

## 9. 待确认事项

无阻塞进入 Step 2 的待确认事项。

后续 Step 必须继续收口:

- Step 2 明确 P0 / P1 / P2 测试范围和非范围。
- Step 3 从 `03` §15 最小验证清单和 Step 16 中间产物抽取测试对象。
- Step 8 必须承接 `04` 的 profile 和配置项。
- Step 13 必须承接 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance` 路径规则。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | 通过 | 新版 `00~04` 为主输入，旧 `05/06` 仅作风险参考 |
| 测试方案边界明确 | 通过 | 不重新定义需求、设计、配置和上游 truth |
| 上游阻塞项已判断 | 通过 | 当前无阻塞 Step 2 的缺口 |
| 可以进入 Step 2 | 通过 | 下一步明确测试目标、范围和非范围 |
