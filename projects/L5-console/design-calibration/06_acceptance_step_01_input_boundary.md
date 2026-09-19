# Step 1. 确认验收输入边界

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1  
> 回填章节：`06-验收标准.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认验收输入边界 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 `00`～`05`；验收 SOP / 书写规范；05 Step 13～15；旧正式 06 污染输入 |
| 输出文件 | `design-calibration/06_acceptance_step_01_input_boundary.md` |
| 正式正文权限 | 关闭；Step 15 前不得修改正式 06 |
| 下一动作 | 只允许进入 Step 2 |

## 2. 本步计划与目标

本步按“正式输入识别 → 验收/测试/实施职责切分 → 缺口分级 → 历史污染隔离 → 门禁自审”顺序，固定新版 06 可以承接什么、不得重新回答什么，以及缺少真实送验材料时应保持何种事实状态。

本步不定义具体门禁、不固定假 baseline、不执行测试、不创建 evidence，也不对当前交付给出三值 verdict。

## 3. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `00-需求文档.md` | `formal_stop_review` | 提供六核心能力、18 个核心 FR、外围 FR、BR/DR/NFR、45 个 AC 与七项 VETO |
| `01-架构设计.md` | `formal_stop_review` | 提供 SDK-only、owner truth、依赖类型、数据所有权与通信红线 |
| `02-概要设计.md` | `formal_stop_review` | 提供五组成部分、对象、接口、流程、状态、异常和配置轮廓 |
| `03-详细设计.md` | `formal_stop_review` | 提供十模块、5 Command、16 Query、1 conditional consumer、状态/一致性/错误/并发契约 |
| `04-配置设计.md` | `formal_stop_review` | 提供四项配置、三个 profile、strict whole-document、startup-only 与失效姿态 |
| `05-测试方案.md` | `formal_stop_review` | 提供 96 TC、suite/gate、八个 future EV family、固定路径和 residual |
| 05 Step 13～15 | `done` | 提供 evidence 资格、回归移交、事实诚实和 06 必须收口项 |
| 旧 `06-验收标准.md` / README / draft | `historical_material` | 仅检查 workspace/panel、Provider、固定数字、框架和旧证据污染 |
| 验收 SOP / 书写规范 | authority | 固定 15-Step、15 章、三值 verdict、逐项闭环和 fixed-run 证据规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计？ | 只依据当前正式 `00`～`05`。需求 AC/VETO 是裁决入口；`01`～`04` 提供边界、协议、状态、一致性和配置契约；`05` 提供验证与 future 证据合同。 |
| 哪些测试证据支撑裁决？ | 未来由精确的 `EV-UNIT-001`、`EV-FLOW-001`、`EV-CONTRACT-001`、`EV-INTEGRATION-001`、`EV-ACCESSIBILITY-001`、`EV-SECURITY-001`、`EV-ARCH-001`、`EV-RELEASE-001` 合格 instance，以及同一固定 run 下的 TC、suite artifact、run report 和 digest 支撑。当前这些都不存在。 |
| 哪些交付、环境和数据成为基线？ | 未来必须固定 design source ref、implementation commit/build/image、三个 profile 中实际使用的 profile、四项配置及 digest、fixture/data ref、依赖版本、`run_id` 和交接版本；当前不得填值。 |
| 哪些内容不应进入 06？ | 测试用例设计、fixture/suite/script 实现归 05/实现；源码、commit 计划归 07；部署/runbook 归 09；owner 内部 truth 与业务规则归各 owner。 |
| 是否有阻塞 06 生成的上游缺口？ | 无阻塞“裁决合同设计”的缺口；`CON-Q-034～047` 限制 positive/selected 范围。缺实现仓、交付基线、环境、run 和证据会阻断实际送验，只允许 `not_entered / blocked_by_missing_baseline`。 |

## 5. 当前文档问题诊断

| 旧正文问题 | 风险 | 本步处理 |
|---|---|---|
| 以 `ConsoleWorkspace`、Panel、quick/bulk action 和 unified summary 组织验收 | 把已废弃对象当当前设计 truth | Step 15 全量删除，不做增量迁移 |
| 引用 API 响应、DB 记录、[] 占位作为泛证据 | 违反 SDK-only 与 fixed-run 证据资格 | 改为 TC→EV→artifact/report/digest→AC/VETO 闭环 |
| 固定旧技术/性能表达 | 无当前 authority，可能制造阈值 verdict | 数字与兼容只在 authority 到达后成为 selected gate |
| 旧章节为 10 章 | 缺接口、状态、证据、VETO 等独立裁决 | Step 15 重建为规范要求的 15 章 |
| 结论/签署空表与文档设计混在一起 | 容易把占位误作已进入验收 | 显式拆分文档状态、验收生命周期和实际 verdict |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 | 原因 |
|---|---|---|---|
| 输入主线 | workspace/panel 产品壳 | 六能力、十模块、5+16+1、四配置、96 TC | 对齐正式 00～05 |
| 证据 | 泛化 API/DB/checklist | fixed run 的 artifact/report pair + digest + EV instance | 可复验、防静态造证据 |
| 上游未就绪 | 容易写成未通过或默认通过 | conditional/blocked/residual，按 baseline enabled 状态裁决 | 不伪造正向能力 |
| 当前状态 | 待评审/空签署 | 文档可完成；实际验收 `not_entered` | 区分设计完成与交付 verdict |
| 正式装配 | 修补旧 06 | Step 15 删除后 full-restart | 隔绝历史污染 |

## 7. 验收裁决取舍

| 议题 | 取舍 | 裁决 |
|---|---|---|
| 是否直接继承旧门禁 | 不继承 | 旧 06 仅用于污染审计 |
| 是否把 05 的 candidate 当 evidence | 不允许 | `EV-CAND-*` 与 `EV-*-001` family 都不是 instance |
| 是否因当前缺 baseline 写“不通过” | 不允许 | 当前未进入验收，不产生三值 verdict |
| 是否因 formal surface 未启用阻断全部 P0 | 仅阻断对应 positive | 安全 disabled/read-only/partial/blocked 可满足当前边界；启用后 positive 必须具备 |
| 是否将其他 Layer 5 文档作为 truth | 不允许 | 未停审内容只记 pending |

## 8. 结构化中间产物

### 8.1 验收输入映射

| 来源 | 验收输入 | 新版 06 如何使用 |
|---|---|---|
| `00` | `AC-CON-001～007`、`AC-FR-001～013`、`AC-BR-001～007`、`AC-DR-001～005`、`AC-NFR-001～007`、`VETO-CON-001～007` | 转为范围、门禁、VETO、风险和最终裁决 |
| `01` | owner truth、SDK-only、数据/通信/依赖红线 | 转为 §6/§7 架构与跨仓门禁 |
| `02` | 五部分、对象/flow/state/exception | 转为功能和状态验收主题 |
| `03` | 十模块、正式协议、状态、phase、副作用、不变量 | 作为门禁的直接设计契约来源 |
| `04` | 四配置、三 profile、strict/startup-only/failure | 作为环境、配置和 release 红线 |
| `05` | 96 TC、suite/check、八 EV family、路径、缺陷与回归 | 作为 future evidence 与裁决充分性来源 |

### 8.2 新版 06 必须回答

| 问题 | 收口 Step |
|---|---|
| 裁决范围、优先级和非范围 | Step 2 |
| 未来送验基线与当前缺口 | Step 3 |
| 验收何时可进入、暂停、退出 | Step 4 |
| 功能、红线、接口、状态、NFR、证据如何判定 | Step 5～10 |
| 哪些问题一票否决 | Step 11 |
| 缺陷、复验、风险接受和签署如何影响 verdict | Step 12～14 |

### 8.3 新版 06 不再回答

| 不回答的问题 | 归属 |
|---|---|
| 新需求、业务规则、owner truth 或 Policy/Gate 决策 | `00` / 正式 owner |
| 新模块、对象、字段、协议、状态或错误 | `01`～`03` |
| 新配置项/profile/阈值 | `04` |
| 新 TC、fixture、suite、script 或执行结果 | `05` / 实现仓 |
| 实施任务、commit、代码和验证排期 | `07` |
| 部署、运行、告警、生产 readiness | `09` / 正式运行 authority |

### 8.4 当前缺失事实与影响

| 缺失事实 | 当前姿态 | 对 06 设计 | 对实际验收 |
|---|---|---|---|
| 实现仓与交付 commit/build/image | `not_created` | 不阻塞 | 阻断进入 |
| 固定环境/config/data/dependency refs | `not_fixed` | 不阻塞 | 阻断进入 |
| 固定 `run_id` | `not_created` | 不阻塞 | 阻断进入 |
| artifact/report/evidence instance | `not_created` | 不阻塞 | 阻断裁决 |
| defect/risk acceptance/signoff | `not_created` | 不阻塞规则设计 | 不得推断 verdict |

## 9. 回填草稿

正式 §1 应声明：新版 06 强承接正式 00～05，只定义未来交付如何裁决；旧 06/README/draft 仅为历史污染输入。当前无实现、baseline、run 或 evidence，文档完成不等实际验收进入。每项 P0 裁决必须回指正式设计、TC、future EV、同一固定 run 的 report/artifact 和裁决影响。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实交付/source refs、环境、配置和 `run_id` | 影响实际准入 | 留待实施与送验，不伪造 |
| `CON-Q-034～047` authority | 影响 positive/selected gate | 保持 blocked/conditional/residual |
| evidence retention 数字 | 影响运维/复验 | Step 13 记录为待确认，不发明天数 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 正式 00～05 已映射 | pass |
| 测试、验收、实施职责已分开 | pass |
| 当前缺口未伪装成 verdict | pass |
| 旧正式 06 继承关闭 | pass |
| 允许进入 Step 2 | yes |
| 允许修改正式 06 | no |
