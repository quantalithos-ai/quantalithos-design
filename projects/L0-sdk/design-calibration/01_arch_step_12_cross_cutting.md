# Step 12. 横切关注点

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-sdk/01-架构设计.md` §13 横切关注点

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.13 横切关注点
  - `standards/document/架构设计讨论流程_SOP.md` Step 12
  - `projects/L0-sdk/00-需求文档.md` §10 业务规则与边界约束 / §11 数据需求与数据归属 / §13 非功能需求 / §14 验收标准
  - `projects/L0-sdk/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_08_data_ownership_consistency.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_09_interactions_communication.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_10_technology_choices.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
- 已确认结论：
  - `L0-sdk` 是嵌入式官方客户端接入层，不是线上服务、gateway、auth provider、UI 组件库或 runtime loop。
  - SDK 不拥有业务正文、事件 payload 正文、生产请求 / 响应正文、观测正文、UI / runtime 状态正文或凭据正文。
  - SDK 拥有官方客户端语义、三语言语言映射、package candidate、横切默认、兼容演进和验证结论。
  - error mapping、trace propagation、redaction 和凭据材料保护是三语言一致的 SDK truth。
  - candidate、docs、examples、smoke、reports / artifacts 引用是验证与审计主线，不能反向定义上游 truth 或生产业务 truth。
  - 本 Step 只讨论长期横切主线约束，不写监控平台、告警配置、密钥脚本、压测脚本、具体配置项或测试用例。

### 3. SOP 问题回答

1. 安全边界如何处理？

   回答：SDK 不执行认证、授权或治理审批，不保存凭据正文，不把业务正文、事件 payload、生产请求 / 响应或观测正文写入 SDK truth、示例、日志或报告。敏感材料只能以调用方运行期输入、脱敏结果、引用或验证结论出现，且 redaction 默认必须跨语言一致。

2. 可观测性需要覆盖哪些正式对象和关键链路？

   回答：可观测性需要覆盖 SDK 调用边界、formal API / fake adapter、`L0-bus` event client view、candidate 验证、文档示例运行、上游版本引用和错误映射结果。它关注 trace、错误分类、语言、candidate、上游版本和失败口径是否可定位，不要求 SDK 拥有观测日志正文。

3. 可用性和韧性需要守住什么底线？

   回答：formal API、bus 语义、core / bus 快照、fake endpoint、validation runner 或 docs runner 不稳定时，SDK 必须显式失败、挂起、标记 stale / pending / unsupported / not verified，不能伪装成功、补造上游 truth 或让公共发布状态掩盖不可验证。

4. 性能预算是否需要给出口径？

   回答：架构阶段不固定微基准阈值，但必须给出口径：SDK 不应成为最小接入、同步能力访问、事件客户端视图、错误 / trace / redaction 处理和示例验证的主要瓶颈；candidate 验证和文档示例运行应作为独立验证负担观察，不得混入 caller 同步业务边界。

5. 配置如何管理，哪些配置不应散落？

   回答：trace、error mapping、redaction、credential handling、timeout / failure defaults、candidate 验证开关和兼容治理边界不应由三语言各自私下散落定义。允许语言表达不同，但配置和覆写不能绕开 SDK 语义基线、redaction 默认、trace 传播、兼容判断或上游 truth 边界。

6. 审计与可追溯性如何被正式保证？

   回答：每个 package candidate 必须可追溯到 `L0-core`、`L0-bus` 和相关 formal API / fake endpoint 版本引用，并保留跨语言 smoke、docs 示例、error / trace / redaction 验证结论、compatibility / deprecated 判断和 reports / artifacts 引用。

7. 哪些横切项与本仓无关，不应机械照抄模板？

   回答：数据库备份、消息队列运维、服务端限流、服务端权限审批、UI 状态恢复、runtime checkpoint、oncall 操作手册和公共注册表运营细则不属于当前 SDK 架构横切主线。它们可以在对应仓或后续发布阶段讨论，但不能混入当前 SDK 架构主线。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §11 横切关注点 | 旧文档按韧性、可观测性、安全、配置、性能罗列 | 有方向，但缺少作用范围、保护目标和与 SDK 边界的关系 |
| §11.1 韧性 | 写重试、超时、fallback hook | 偏实现策略，未说明失败时必须显式挂起 / not verified / stale |
| §11.2 可观测性 | 写 trace、日志、metrics hook | 容易滑入监控方案，未明确 SDK 不拥有观测正文 |
| §11.3 安全 | 写 token 内存短驻、redaction、provenance | 没有统一表达禁止正文、凭据正文和 redaction 一票否决边界 |
| §11.4 配置管理 | 写 auth mode、timeout、retry、log level | 会让 SDK 像 auth / runtime 配置中心，且缺少“配置不能绕过边界”的规则 |
| §11.5 性能预算 | 写固定阈值 | 阈值应后移到测试方案，架构阶段应先给出性能作用面和判断口径 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 横切表达 | 抽象类别 + 实现点 | 横切关注点、作用范围、约束要求、保护目标 | 对齐规范 4.13 |
| 安全 | token / redaction 局部策略 | 禁止正文、凭据保护、redaction 默认、auth 非职责 | 保护 SDK 数据边界 |
| 可观测 | trace / logs / metrics hook | trace 和错误可定位，但不拥有观测正文 | 避免日志正文污染 SDK truth |
| 韧性 | retry / timeout / fallback | stale / pending / unsupported / not verified 显式失败口径 | 防止伪成功和补造 truth |
| 配置 | 分散列配置项 | 配置不能绕开语义基线、redaction、trace 和兼容边界 | 防止三语言配置漂移 |
| 性能 | 固定数值阈值 | 给出关键路径不成为主瓶颈的架构口径 | 具体阈值后移到测试方案 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧版横切清单 | 简短，接近常见模板 | 容易变成实现清单，缺少架构约束力 | 不采用 |
| 方案 B：按横切约束表表达作用范围、要求和保护目标 | 能直接保护 SDK 边界、数据、交互和验证主线 | 表达比旧版更重，需要后续文档继续落测试和配置 | 采用 |
| 方案 C：把监控、密钥、压测、发布运营细节全部写入本章 | 看起来完整 | 会滑入实施层和其他仓职责 | 不采用 |
| 方案 D：横切关注点全部后移到测试和实施计划 | 避免架构层过细 | 后续实现缺少安全、可观测、韧性和配置边界 | 不采用 |

### 7. 结构化中间产物

#### 7.1 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界：禁止正文与凭据进入 SDK truth | SDK truth、示例、错误、日志、诊断、reports / artifacts 引用、formal API / event client 边界 | 业务正文、事件 payload、生产请求 / 响应、观测正文、UI / runtime 状态正文、凭据正文不得进入 SDK truth 或报告正文；必须拒绝、脱敏或只保留引用 | 保护 SDK 不越界拥有业务、事件、观测、凭据或运行时真相 | 该要求横切数据所有权、示例、验证和错误处理，不是单个日志规则。 |
| 安全边界：SDK 不执行 auth / governance 决策 | caller runtime、formal API adapter、event client、credential handling | SDK 只能承接调用方提供的凭据材料保护口径，不执行身份认证、权限裁决或治理审批 | 保护 security / identity / gateway / governance 边界不被 SDK 吸收 | 该要求长期约束 SDK 能力边界，不是某个认证实现选择。 |
| 审计与可追溯：candidate 证明链 | package candidate、上游版本引用、smoke、docs runner、reports / artifacts、compatibility / deprecated 判断 | 每个 candidate 必须能追溯上游版本、验证结论、示例运行、横切默认和兼容治理材料 | 保护 SDK stable / verified 结论可复核，防止公共发布或局部成功掩盖不可验证 | 该要求横切数据、验证、文档、发布和演进，不是普通构建日志。 |
| 可观测性：trace 与错误可定位但不吸收正文 | SDK call surface、formal API / fake adapter、event client view、error mapping、trace propagation | 错误和 trace 材料必须能定位语言、能力边界、candidate、上游版本和失败口径；不得保存观测日志正文或敏感正文 | 保护调用失败、跨语言 drift 和上游版本问题可定位，同时守住数据边界 | 该要求是架构层可见性约束，不是监控平台或日志字段实现。 |
| 韧性 / 恢复能力：显式失败与挂起 | formal API、`L0-bus` semantic boundary、core / bus snapshot、fake endpoint、validation runner、docs runner | 依赖未稳定或验证失败时必须显式失败、挂起或标记 stale / pending / unsupported / not verified，不得伪装成功或补造 truth | 保护同步、异步、后台承接的边界语义和候选验证可信度 | 该要求横切交互方式和一致性策略，不是重试脚本或 oncall 手册。 |
| 可用性：核心闭环不依赖公共注册表和全量覆盖 | 本地 package candidate、最小可验证接入、quickstart、fake / fixture target、下游消费面 | 当前 P0 必须在公共注册表、完整 MCP、REST / GraphQL、REPL、本地缓存和全量 client 缺失时仍能判断核心闭环 | 保护当前阶段可落地，防止外围增强阻塞官方 client 基础能力 | 该要求作用于阶段边界，不是发布运营细则。 |
| 性能 / 容量约束：SDK 不成为关键路径主瓶颈 | 嵌入式 SDK 调用、formal API adapter、event client view、error / trace / redaction 默认、docs / smoke 验证 | SDK 封装和横切默认不得成为最小接入和关键调用的主要瓶颈；长耗时验证应留在后台 / 验证边界 | 保护客户端接入体验和 Step 9 的同步 / 后台边界 | 该要求给出架构判断口径，具体阈值和压测方法后移。 |
| 配置与变更控制：配置不得绕开主线边界 | 三语言默认行为、trace、error mapping、redaction、credential handling、compatibility、candidate 验证 | 配置与覆写必须服从统一语义基线，不得让某语言绕开 redaction、trace、错误映射、兼容治理或上游 truth 引用 | 保护三语言一致和官方 client 语义不被配置层打穿 | 该要求不是配置清单，而是配置行为的架构边界。 |

#### 7.2 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 |
|---|---|
| 禁止正文与凭据进入 SDK truth | §9 数据所有权 / §10 关键交互 / §13 横切关注点 |
| SDK 不执行 auth / governance 决策 | §4 职责边界 / §8 依赖方向 / §13 横切关注点 |
| candidate 证明链 | §7 容器部署 / §9 数据所有权 / §11 技术选型 / §14 演进路线 |
| trace 与错误可定位 | §9 数据所有权 / §10 关键交互 / §13 横切关注点 |
| 显式失败与挂起 | §9 数据所有权 / §10 关键交互 / §12 备选方案 |
| 核心闭环不依赖公共注册表和全量覆盖 | §3 约束条件 / §7 容器部署 / §12 备选方案 / §14 演进路线 |
| 配置不得绕开主线边界 | §8 依赖方向 / §11 技术选型 / 后续配置设计 |

#### 7.3 横切影响说明短文

`L0-sdk` 的横切关注点必须进入架构层，因为它们直接决定 SDK 能否守住客户端接入层边界、三语言一致、数据禁止正文、candidate 可验证和兼容演进可追溯。本文不把监控平台、密钥轮换脚本、压测阈值、oncall 剧本或公共发布运营写入本章，因为这些属于测试、实施、运维或后续发布阶段。当前要先收稳的是横切约束如何压在边界、数据、交互、技术机制和方案取舍之上，防止后续实现通过局部配置或语言差异绕开主线。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §13 “横切关注点”直接摘录并整理本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 横切关注点是否按约束表表达 | A. 按作用范围 / 约束 / 保护目标表达;B. 沿用旧版清单;C. 后移到测试和实施 | A | A 能形成架构约束力，并承接规范 4.13 | 已确认采用 A |
| 安全边界是否以禁止正文和凭据进入 SDK truth 为主线 | A. 是;B. 只写 token 和 redaction;C. 后移到安全规范 | A | SDK 最容易串仓的风险就是正文、凭据和报告材料污染 truth | 已确认采用 A |
| 可用性是否要求核心闭环不依赖公共注册表和全量覆盖 | A. 是;B. 公共发布作为 P0;C. 全量覆盖作为 P0 | A | 当前 P0 是本地 candidate 与最小可验证接入，外围增强不能阻塞主线 | 已确认采用 A |
| 是否在本章写具体监控、压测、密钥轮换和配置项 | A. 写入;B. 不写，后移到测试 / 配置 / 实施 | B | 本章只收敛架构横切约束，不写实施细节 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 13 的待确认事项。
- 具体监控指标、日志字段、压测阈值、密钥管理细则、配置文件结构、public registry 运营细则后移到配置设计、测试方案、验收标准或实施计划。

### 10. 进入下一步条件

- 已按横切类别明确 SDK 长期主线约束。
- 已明确每个横切项的作用范围、约束要求和保护目标。
- 已确认不把监控、告警、密钥、压测、oncall 或发布运营细节写成架构横切结论。
- 可以进入 Step 13 演进路线。
