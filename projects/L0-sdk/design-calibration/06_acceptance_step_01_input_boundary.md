# L0-sdk 06 验收标准 Step 1: 验收输入边界

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 1 中间产物。
> 本步确认验收标准承接哪些需求、设计、测试和交付输入,以及哪些内容不应写进验收标准。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认验收输入边界 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §1 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | v0.2.0 已完成 | 提取定位、目标、非目标、US-001~US-009、F-001~F-010、BR-001~BR-014、数据归属、非功能和一票否决方向 |
| `01-架构设计.md` | v0.2.0 已完成 | 提取系统位置、职责边界、限界上下文、依赖方向、数据所有权、关键交互、横切关注点和架构风险 |
| `02-概要设计.md` | v0.2.0 已完成 | 提取代码主体框架、主要组成部分、关键对象、API / Event / Job 骨架、处理流、状态机、异常边界和配置影响 |
| `03-详细设计.md` | v0.2.0 已完成 | 提取模块契约、对象 / trait / API、协议、函数流、状态机、事务、错误、幂等、配置、观测和最小测试切口 |
| `04-配置设计.md` | v0.1.0 已完成 | 提取 JSON profile、配置项、来源优先级、敏感边界、load / validate / apply、fail-fast / fail-closed 和 evidence 路径 |
| `05-测试方案.md` | v0.2.0 已完成 | 提取 `TS-SDK-*`、`TC-SDK-*`、`EV-SDK-*`、gate、reports、artifacts、缺陷分级、进入 / 退出准则和残余风险 |
| 交付版本 / 送验说明 | 当前尚未实现 | 本文只定义基线固定规则;具体 commit、tag、build id、run_id、reports 由实施后送验材料提供 |

---

## 3. SOP 问题回答

### 3.1 本轮验收依据哪些需求和设计?

本轮验收依据新版 `00~05`。旧版 `06-验收标准.md` 自身不作为事实源,只作为需要替换的旧草案。

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | L0-sdk 定位、P0 核心能力闭环、F-001~F-010、BR-001~BR-014、非目标、数据归属、NFR 和需求验收方向 | 转成验收目标、范围、功能门禁、边界红线、非功能门禁和一票否决 |
| `01-架构设计.md` | 官方三语言客户端接入层定位、core / bus / formal API / fake boundary / downstream package 边界、依赖方向和数据所有权 | 转成架构红线、跨仓同步验收、依赖类型验收和不可越界项 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响 | 转成功能验收门禁、接口验收门禁、状态机门禁和异常边界验收 |
| `03-详细设计.md` | Rust workspace、模块契约、对象 / trait / API、协议、函数流、状态机、事务、错误、幂等、配置、观测和测试切口 | 转成实现契约验收、协议字段验收、事务一致性验收、缺陷复验和证据要求 |
| `04-配置设计.md` | strict JSON 配置、profile、配置项、secret ref、redaction guard、fake marker guard、reports / artifacts 承接 | 转成配置进入条件、敏感信息红线、fail-fast / fail-closed 门禁和证据门禁 |
| `05-测试方案.md` | `TS-SDK-*`、`TC-SDK-*`、`EV-SDK-*`、自动化 gate、reports、artifacts、entry / exit、defect、risk | 转成验收基线、证据引用、通过条件、失败条件、一票否决和风险接受规则 |

### 3.2 哪些测试证据会支撑验收裁决?

验收标准只引用证据,不复制完整测试日志。正式验收优先引用 `reports/runs/<run_id>` 和 `reports/acceptance`,必要时再回链 `artifacts/test/<run_id>`。

| 证据类别 | 来源 | 验收用途 |
|---|---|---|
| `TC-SDK-*` 用例结果 | `05` §6、gate suite results | 裁决功能、接口、状态、配置、安全、candidate、docs、compatibility 门禁 |
| `EV-SDK-CONTRACT-001` | contract / snapshot evidence | 裁决 core / bus truth consumption、derived view 和上游版本引用 |
| `EV-SDK-SEMANTIC-001` | semantic baseline evidence | 裁决三语言 semantic baseline 和 package surface 一致性 |
| `EV-SDK-BOUNDARY-001` | boundary receipt evidence | 裁决 formal API / fake boundary 最小 service capability 接入 |
| `EV-SDK-EVENT-001` | event mapping evidence | 裁决 bus event client view 是否只消费 bus 语义,不生成 bus truth |
| `EV-SDK-TRACE-001` | error / trace evidence | 裁决错误映射、trace propagation 和正文不泄露 |
| `EV-SDK-SECURITY-001` | redaction / credential evidence | 裁决 raw secret、disable redaction、unredacted evidence、artifact / report scan |
| `EV-SDK-CANDIDATE-001` | candidate / artifact evidence | 裁决 local package candidate、语言 package build 和 stable gate |
| `EV-SDK-DOCS-001` | docs runner evidence | 裁决 quickstart、docstring、docs example 是否可运行且已脱敏 |
| `EV-SDK-SMOKE-001` | cross-language smoke evidence | 裁决三语言 smoke、evidence ref-only 和公共注册表非前置 |
| `EV-SDK-COMPAT-001` | compatibility / deprecated evidence | 裁决 compatibility decision、migration ref 和 deprecated lifecycle |
| report gate evidence | `reports/runs/<run_id>/summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` | 裁决证据索引、门禁结果和泄漏扫描是否完整 |
| acceptance handoff | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` | 裁决送验范围、一票否决和有条件通过风险是否可接受 |

### 3.3 哪些交付版本、环境和数据会成为基线?

当前还没有实现交付,因此 Step 1 不固定实际 commit 或 run_id。本轮只固定验收标准应如何绑定基线。

| 基线类型 | 当前口径 |
|---|---|
| 文档基线 | `00~05` 当前版本作为验收标准生成依据 |
| 代码版本基线 | 实施完成后由送验说明提供 commit / tag / build id |
| 测试运行基线 | 正式验收必须绑定固定 `<run_id>`,不得使用 `latest` |
| 证据路径基线 | `reports/runs/<run_id>`、`reports/acceptance` 优先;必要时回链 `artifacts/test/<run_id>` |
| 环境基线 | local / ci / candidate / docs / compatibility / redaction 等 test profile;具体名称由 `04` 和 `05` 承接 |
| 数据基线 | `run_id` 隔离的 test fixture、snapshot ref、artifact ref、report ref 和 redacted evidence |
| 上游依赖基线 | `L0-core`、`L0-bus` 的本地 path dependency、snapshot ref 或正式契约引用 |

### 3.4 哪些内容属于测试方案或实施计划,不应写进验收标准?

| 不应写进验收标准的内容 | 原因 | 正确位置 |
|---|---|---|
| 测试用例的完整执行步骤 | 验收只裁决,不替代测试方案 | `05-测试方案.md` |
| fixture builder、snapshot builder 和数据生成顺序 | 属于测试数据设计 | `05-测试方案.md` §7 |
| gate script 内部命令和 CI 任务排布 | 属于自动化和实施 | `05-测试方案.md` §9、`07-实施计划.md` |
| Rust struct / enum / trait / function 定义 | 属于详细设计 | `03-详细设计.md` |
| JSON 配置项全集、默认值和 profile demo | 属于配置设计 | `04-配置设计.md` |
| commit boundary、开发阶段、提交规范 | 属于实施计划 | `07-实施计划.md` |
| 实际测试通过 / 失败结果 | 属于验收报告或送验材料 | `reports/acceptance/*` |
| 公共注册表、生产 endpoint、real credential provider 运维细节 | 当前为非范围或后续专项 | 后续实施 / 运维 / release 文档 |

### 3.5 是否存在阻塞验收标准生成的上游缺口?

不存在阻塞 Step 1~Step 2 的上游缺口。新版 `00~05` 已足够启动验收标准校准。

非阻塞事项如下:

| 事项 | 是否阻塞 | 当前处理 |
|---|---|---|
| 当前 `06` 是旧版草案 | 否 | Step 15 删除旧文件并重建 |
| 目标实现仓尚未送验 | 否 | Step 3 固定基线规则,实际 commit / run_id 后续由送验说明提供 |
| `07-实施计划.md` 尚未校准或创建 | 否 | `06` 先定义裁决门禁,供 `07` 承接 |
| 公共注册表正式发布不在 P0 | 否 | 作为非范围或 Step 13 风险承接 |
| real credential provider、remote config、full service client coverage 未覆盖 | 否 | 当前为残余风险或后续专项,不得阻塞 P0 核心闭环验收标准生成 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 章节主链过时 | 只有 10 章,没有新版 15 章验收主链 | 后续无法按 Step 追溯验收门禁 | Step 15 删除并重建 |
| 旧 `06` 未承接新版 `04` | 无 JSON profile、secret ref、fail-fast、fail-closed、forbidden toggle 验收口径 | 配置可绕过设计红线 | 本步把 `04` 纳入验收输入 |
| 旧 `06` 未承接新版 `05` 证据链 | 无 `EV-SDK-*`、`reports/runs/<run_id>`、`artifacts/test/<run_id>`、`reports/acceptance/*` | 验收无法复查 | 本步把 `05` 证据链作为输入 |
| 旧 `06` 混入执行结果占位 | 功能表和门禁表使用 `[]` 作为结论 | 验收标准会变成验收报告 | 本步明确 `06` 不写实际执行结论 |
| 旧 `06` 不区分本地 candidate 和 public registry | 把同步发版和 registry dry-run 写得过重 | 可能把 P1/P2 误升为 P0 | 后续 Step 2/13 明确范围和风险 |
| 旧 `06` 缺少 design-calibration 来源入口 | 每章没有具体中间产物引用 | 后续 agent 难以复核结论来源 | 正式文档每章保留校准来源 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 输入边界 | 主要承接旧 `02/03/05` 和旧 SDK 发版口径 | 明确承接新版 `00~05` | 防止旧主线污染 |
| 证据口径 | 依赖人工填 `[]` 结论和泛化 log / smoke | 引用固定 `run_id` 的 `EV-SDK-*`、reports、artifacts 和 acceptance handoff | 可审计 |
| 交付基线 | 未说明 commit / run_id 如何绑定 | 区分文档基线和后续送验基线 | 可落地 |
| 文档边界 | 混合测试步骤、验收结论、发版过程和风险 | 明确 `06` 只做裁决门禁 | 边界清晰 |
| 配置承接 | 基本缺失 | 纳入 `04-配置设计.md` 的 profile、secret、redaction、fail-fast / fail-closed | 防止配置绕过红线 |
| 下游承接 | 未说明 `07` 如何使用 | `06` 先定义门禁,`07` 承接实施和交付 | 顺序清楚 |

---

## 6. 验收裁决取舍

### 6.1 是否在旧 `06` 上修补

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 删除旧 `06` 后重建 | 能彻底切换到新版主链和证据口径 | Step 15 才正式修改文件 | 采用 |
| B. 在旧 `06` 上追加新版章节 | 改动看似较小 | 新旧口径混杂,验收项无法裁决 | 不采用 |
| C. 保留旧 `06`,只新增中间产物 | 不影响旧文档 | 正式文档仍错误 | 不采用 |

### 6.2 是否在验收标准中固定实际 run_id

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 当前直接写固定 run_id | 看起来具体 | 目标仓尚未送验,会虚构证据 | 不采用 |
| B. 先固定 run_id 绑定规则,实际 run_id 由送验说明提供 | 不虚构证据,又能约束验收 | 需要 Step 3 继续细化 | 采用 |
| C. 不提 run_id | 文档更短 | 验收引用会漂移到 `latest` | 不采用 |

### 6.3 是否把测试执行步骤写进验收标准

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 写完整测试执行步骤 | 使用者不用跳转 | 与 `05` 重复,且容易变成测试方案 |
| B. 只写验收门禁和证据要求,引用 `05` 的测试方案 | 边界清楚 | 读者需跳转 `05` | 采用 |
| C. 不引用测试方案 | 简洁 | 验收门禁无证据来源 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | P0 核心能力闭环、US-001~US-009、F-001~F-010、BR-001~BR-014、非目标、非功能、验收方向 | 转成目标范围、功能门禁、边界红线、非功能门禁和一票否决 |
| `01-架构设计.md` | 职责边界、系统上下文、依赖方向、数据所有权、关键交互、技术选型、横切关注点 | 转成架构红线、跨仓依赖类型、接口同步门禁和残余风险 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常和配置影响 | 转成功能、接口、状态机、异常和配置验收项 |
| `03-详细设计.md` | 模块契约、对象 / trait / API、协议、状态机、事务、错误、幂等、观测和测试切口 | 转成实现契约、状态一致性、缺陷复验和证据门禁 |
| `04-配置设计.md` | profile、配置项、来源优先级、secret ref、runtime graph、redaction、failure modes | 转成配置验收、敏感信息红线和可观测证据门禁 |
| `05-测试方案.md` | `TS-SDK-*`、`TC-SDK-*`、`EV-SDK-*`、gate、reports、entry / exit、defect、risk | 转成验收基线、通过 / 失败条件、一票否决和风险接受 |
| 送验说明 | commit / tag / build id、固定 `<run_id>`、报告路径 | 转成 Step 3 的实际验收基线 |

### 7.2 验收标准不再回答的问题清单

| 不再回答的问题 | 原因 | 正确位置 |
|---|---|---|
| 为什么需要 L0-sdk | 需求和架构已回答 | `00` / `01` |
| 代码如何实现 | 详细设计已回答 | `03` |
| 配置项如何定义 | 配置设计已回答 | `04` |
| 用例如何执行 | 测试方案已回答 | `05` |
| 任务如何拆分和提交 | 实施计划回答 | `07` |
| 实际送验是否通过 | 验收报告或 acceptance handoff 记录 | `reports/acceptance/*` |

### 7.3 验收标准必须回答的问题清单

| 必须回答的问题 | 目标章节 |
|---|---|
| 本轮验收依据哪些上游文档和证据 | §1 |
| 验收目标、范围和非范围是什么 | §2 |
| 具体 commit / run_id / report 如何固定为验收基线 | §3 |
| 进入验收和退出验收的条件是什么 | §4 |
| F-001~F-010 如何裁决通过 / 失败 | §5 |
| 数据边界和架构红线如何裁决 | §6 |
| 接口、事件与跨仓同步如何裁决 | §7 |
| 状态机、事务、一致性和幂等如何裁决 | §8 |
| 性能、安全、兼容、配置等非功能如何裁决 | §9 |
| 可观测性、审计和证据完整性如何裁决 | §10 |
| 哪些问题一票否决 | §11 |
| 缺陷如何分级、复验和放行 | §12 |
| 哪些风险可以接受、由谁接受 | §13 |
| 最终结论如何使用三值口径签署 | §14 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收输入映射表”“验收标准不再回答的问题清单”和“验收标准必须回答的问题清单”小节,了解本章验收输入边界如何从新版 `00~05` 收敛。

本验收标准只承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。旧版 `06-验收标准.md` 不作为事实源,只作为需要替换的旧草案。

本文不重新定义需求、架构、对象、接口、状态机、配置项、测试用例或实施任务。本文只把上游已经确认的 P0 范围、测试门禁、证据编号、report / artifact 路径、缺陷分级和残余风险转成可裁决的验收门禁。

当前尚未绑定实际实现 commit、tag、build id 或测试 `run_id`。正式送验时必须由送验说明和 `reports/acceptance` 提供固定基线;验收标准只定义基线绑定规则,不得虚构测试执行结果。

---

## 9. 待确认事项

- 是否接受旧版 `06-验收标准.md` 不做局部修补,而是按新版 SOP 在 Step 15 删除并全量重建。
- 是否接受当前无送验 commit / run_id / artifact 时,先在 06 中定义基线字段和进入条件,实施期再补真实值。
- 是否接受 06 直接消费 `05-测试方案.md` 的 `TC-SDK-*` / `EV-SDK-*` 编号,不重新造测试编号体系。

---

## 10. 进入下一步条件

- [x] 验收输入和边界清楚。
- [x] 当前旧文档的主要问题已识别。
- [x] 06 与 05 的关系已明确:05 提供证据,06 做裁决。
- [x] 可以进入 Step 2 明确验收目标与范围。
