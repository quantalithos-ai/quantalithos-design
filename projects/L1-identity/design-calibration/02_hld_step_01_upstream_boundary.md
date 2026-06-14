# Step 1. 确认上游输入边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 1
> 回填章节: `02-概要设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-11
> 状态: 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取新版 `00/01`、概要 SOP、概要书写规范和中间产物规范 | 已完成 | §2 |
| 回答 Step 1 SOP 问题 | 已完成 | §3 |
| 诊断旧 `02` 与旧中间产物问题 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出上游关系映射、本文不再回答 / 必须回答和输入风险 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §1 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 已有新版草稿 | 提供需求定位、核心能力、业务规则、数据归属、接口依赖和验收红线 |
| `projects/L1-identity/01-架构设计.md` | 已有新版草稿 | 提供职责边界、系统上下文、限界上下文、依赖方向、数据所有权、通信方式和横切约束 |
| `projects/L1-identity/design-calibration/00_req_step_*.md` | 已有需求中间产物 | 追溯需求结论形成过程 |
| `projects/L1-identity/design-calibration/01_arch_step_*.md` | 已有架构中间产物 | 追溯架构结论形成过程 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 1 应问问题、输出和门禁 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定正式 `02` §1 输出结构 |
| `standards/document/设计文档讨论中间产物规范.md` | 最新中间产物标准 | 规定 Step 内计划、未来 Step 文件落盘纪律和分批写入约束 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新可落码性标准 | 作为后续 Step 12 / 13 / 14 的闭环复核输入 |
| 旧 `02-概要设计.md` 与旧 `02_hld_step_*` | 已废弃 | 只作为历史问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论?

- `L1-identity` 是平台级 AI 员工身份真相仓,回答“这个 AI 员工是谁”。
- Identity 的核心能力闭环为身份锚定、生命周期可用性、角色能力摘要、生涯与记忆引用、身份事实消费与追溯。
- 成员身份引用必须稳定且不可复用;查询和消费路径不得隐式创建成员。
- 全局生命周期属于 identity;项目内承担事实和 ProjectMember 属于 `L1-work`。
- 角色能力只保存身份侧来源引用、安全摘要、证据引用和状态;RoleDefinition / CapabilityDefinition 正文属于 `L3-method-library`。
- 生涯记录是身份侧 append-only 历史;项目 / work truth 不进入 identity。
- memory / archive 只以 ref、状态和 handoff marker 进入 identity;正文、embedding、index 和 package 禁止保存。
- 相邻仓只能通过正式边界消费身份事实,不得共享存储或反写 identity truth。
- 外部正文、credential、token、session、secret、runtime body 和 UI 私有展示状态不得进入 identity truth。

### 3.2 当前概要设计要承接哪些架构结论?

- 核心子域是平台级成员身份真相核心。
- 支撑上下文包括身份锚定、全局生命周期、角色能力摘要、生涯记录、记忆引用、身份事实消费与追溯、派生维护与对账。
- 同步 command / query、异步 event / consumer、后台 maintenance / handoff、publisher / outbox、truth store、derived store、reference store 必须分层表达。
- `L0-core` 是唯一编译期依赖候选;其余相邻仓通过 runtime adapter、event、ref、snapshot、handoff 或 projection 协作。
- 数据必须区分 truth、snapshot / projection、reference、report 和 forbidden body。
- 维护任务只能重建、对账、报告或标记 stale / degraded,不得修复相邻仓 truth。

### 3.3 当前概要设计直接承接哪些已经稳定的上游结论?

身份主语、职责边界、非职责、数据归属、依赖方向、通信方式、运行承载、核心子域、支撑上下文、主要不变量和正文排除红线均已足够进入概要设计。

本轮 `02` 可以继续下沉为代码主体框架、主要组成部分、对象候选与关键对象轮廓、接口骨架、处理流骨架、状态流转、异常边界、配置影响轮廓和详细设计承接清单。

### 3.4 哪些结论暂不进入本 Step 闭口?

- Role / capability source protocol 采用 query、event 还是组合。
- role / capability safe summary 最小字段。
- high-risk lifecycle action 的正式集合。
- governance basis ref 与 decision / approval / policy 的边界。
- work participation source 的正式摘要。
- memory / archive carrier、migration receipt 和 handoff target。
- query view 的 not visible / degraded / stale response envelope。
- trace subject、outbox payload snapshot、reference state version、job shell、P0 性能 / 可用性基线。

这些事项不阻塞 Step 1,但后续 Step 必须保留接缝和风险,不得在概要设计中润色成已闭口实现契约。

### 3.5 哪些边界决定当前不该展开到哪里?

本轮概要设计不得展开完整 DTO schema、完整对象字段全集、完整函数签名、DDL、配置 JSON、测试用例、实施 commit boundary、相邻仓 truth、认证协议、RoleDefinition 正文、ProjectMember truth、memory body、artifact body、conversation body 或 runtime execution body。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02_hld_calibration_flow.md` 把 Step 1~14 全部标为已完成 | 与用户当前“02 不完善,整个重写”的判断冲突,也会让后续 agent 误判已可进入 `03` | 重置 flow,当前只承认 Step 1 完成 |
| 旧 `02-概要设计.md` 已装配成正式全文 | 旧全文会继续被 `03/04/05/06/07` 或实现 agent 误用为基线 | 正式 `02` 降级为重写中占位,等 Step 14 再装配 |
| 旧 Step 5~9 疑似以总表方式一次性收敛 | 不符合最新版 SOP 要求的主要组成部分小循环和停审 | 后续 Step 5~9 必须逐组成部分推导,每组停审 |
| 旧文件中可能保留旧对象、旧 API、旧实现框架或旧性能数字 | 会反向污染新版需求 / 架构边界 | 只作为诊断输入,不直接继承 |
| 现有 `04-配置设计.md` 先于新版稳定 `02/03` | 可能把配置 profile、adapter mode 或 entry args 反向写入概要边界 | 当前不作为上游,后续 Step 11 只识别配置影响轮廓 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 总控状态 | `02` Step 1~14 全部显示已完成 | 只承认当前 Step 1 完成,Step 2~14 pending |
| 正式 `02` | 已装配全文,容易被视为基线 | 重写中占位,非实现基线 |
| 旧中间产物 | 默认可被后续引用 | 全部降级为 legacy draft,到达对应 Step 时逐个替换 |
| 执行节奏 | 可直接进入 `03` | 必须从 Step 1 开始逐 Step 审核 |
| Step 5~9 方式 | 可能是总表式输出 | 必须按主要组成部分小循环输出 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 局部修补旧 `02` | 不采用 | 用户已判定整体不完善;局部修补会保留旧真相源残留 |
| 批量删除或清空 Step 2~14 文件 | 不采用 | 最新规范禁止未到达未来 Step 时批量改写未来 Step 文件 |
| 保留旧 Step 2~14 文件但降级为 legacy draft | 采用 | 既避免未来 Step 伪进度,又避免批量清空造成上下文丢失 |
| 从 Step 1 重新开始 | 采用 | 能重新建立上游边界和当前停审点 |
| 正式 `02` 先改为占位 | 采用 | 防止旧正式正文继续被当成实现或详细设计基线 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、核心能力闭环、用户 / 系统角色、功能需求、业务规则、数据归属、接口依赖、非功能与验收红线 | 转译为代码主体框架、主要组成部分、对象候选、接口骨架、处理流、状态机和风险清单 |
| `01-架构设计.md` | 职责边界、系统上下文、限界上下文、运行承载、依赖方向、数据所有权、一致性、通信方式、技术机制、风险和演进 | 转译为可实现结构骨架,不重写架构判断 |
| `design-calibration/00_req_step_*.md` | 需求形成过程、核心能力与边界追溯 | 为概要设计每章提供需求来源 |
| `design-calibration/01_arch_step_*.md` | 架构形成过程、架构单元和横切约束追溯 | 为概要设计每章提供架构来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 编译期候选和其余仓 runtime / event / handoff 裁剪 | 约束接口骨架、port、event 和 external boundary |
| 旧 `02` / 旧 `02_hld_step_*` | 历史问题和旧术语线索 | 只作诊断输入,不得直接进入新版结论 |

### 7.2 本文不再回答

- 不再回答 `L1-identity` 是否是平台级 AI 员工身份真相仓。
- 不再回答认证、授权裁决、ProjectMember、RoleDefinition 正文、memory body、runtime 和 UI 是否属于 identity。
- 不再回答系统上下文、限界上下文、依赖方向、数据所有权、通信方式、技术机制和方案取舍。
- 不再回答需求目标、用户故事、功能需求、非功能需求和验收红线。
- 不再回答数据库、消息产品、框架、配置 JSON、测试矩阵、验收证据或实施计划。

### 7.3 本文必须回答

- 代码主体框架如何承接 identity 架构上下文。
- 主要组成部分有哪些,每个组成部分承担什么、不承担什么、有哪些候选对象入口。
- 从主要组成部分中发现哪些对象候选,哪些关键对象在概要层正式成立。
- 关键对象的类型、所属部分、主要责任、关键字段骨架、成员函数骨架、工厂函数骨架和禁止事项是什么。
- API / 接口骨架如何按 Command、Query、Event、Operations Job 和外部接缝分类。
- 关键处理流如何连接入口、application service、domain object、repository / port、event / projection / audit / report。
- 状态集合和状态流转如何表达身份、生命周期、角色能力摘要、生涯、memory refs、引用状态、投影维护和 handoff。
- 异常与边界场景如何覆盖身份复用、查询建档、外部正文、来源不可用、治理依据缺失、投影 stale、handoff failed、duplicate replay。
- 配置影响只识别哪些主要部分受配置影响、哪些边界禁止配置化、哪些内容交给详细设计继续定义。

### 7.4 输入不足风险清单

| 风险 | 是否阻塞 Step 2 | 后续处理 |
|---|---|---|
| Role / capability source protocol 未闭口 | 否 | Step 7 / Step 8 保留接口骨架和处理流接缝,Step 12 交给 `03` |
| governance basis schema 未闭口 | 否 | Step 8~10 保留 high-risk lifecycle basis 边界,不写详细 DTO |
| memory / archive carrier 未闭口 | 否 | Step 5~9 只表达 ref-only 和 handoff 轮廓 |
| visibility / privacy marker 未闭口 | 否 | Step 7 / Step 10 只表达 not visible / stale / degraded 轮廓 |
| P0 性能 / 可用性阈值未定 | 否 | Step 13 风险保留,后续 05 / 06 处理 |
| 现有 `04` 可能不一致 | 否 | Step 11 仅识别配置影响,不继承旧配置项 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只确认上游输入边界,不需要拆主要组成部分附录。

后续 Step 5~9 必须按主要组成部分拆分小循环;是否创建附录由对应 Step 的复杂度判断决定。未来 Step 文件不得在当前 Step 提前创建或清空。

---

## 9. 回填草稿

正式 `02-概要设计.md` §1 后续应回填:

- 上游关系映射表。
- 本文不再回答清单。
- 本文必须回答清单。
- 旧 `02` 降级为历史诊断输入的声明。
- 待确认事项只作为后续承接风险,不得写成已闭口结论。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 用户是否认可当前 `00/01` 作为本轮 `02` 上游 | 若不认可,必须回退需求或架构线 | 当前按已存在新版 `00/01` 承接 |
| 是否接受旧 Step 2~14 文件暂保留为 legacy draft | 若不接受,需要另行确定归档 / 删除策略 | 当前不批量删除,到达对应 Step 时逐个替换 |

---

## 11. 进入下一步条件

进入 Step 2 前必须满足:

- 用户审核通过本 Step 的上游承接口径。
- 用户认可正式 `02` 在 Step 14 前保持重写中占位,非实现基线。
- 用户认可旧 Step 2~14 文件暂视为 legacy draft,不代表当前完成状态。
- 无需回退 `00` 或 `01`。
