# L2-member 00 需求 Step 14: 验收标准

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 14 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 验收标准 |
| 输出文件 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.14:五类验收 + 一票否决;不写测试步骤;不写伪结果) |
| 已读取前序输入 | yes(Step 7 节点、Step 9 FR、Step 10 BR、Step 11 数据、Step 13 NFR) |
| 当前模式 | full-restart |
| 进入条件 | Step 13 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | gate_status |
|---|---|---|
| 核心能力闭环验收(C1~C5) | done | pass |
| 功能能力验收(逐 FR) | done | pass |
| 规则 / 边界与数据归属验收 | done | pass |
| 非功能验收 | done | pass |
| 一票否决项 | done | pass |
| 跨能力验收审计 | done | pass |

## 2. 本步输入

- Step 7 节点退出条件;Step 9 FR-001~012 / E01~E03;Step 10 BR-001~030;Step 11 归属表;Step 13 NFR-001~016。
- 声明: 本文只定义验收合同,不填写执行结果、run、artifact、report、evidence、verdict 或 signoff。

## 3. 结构化中间产物(验收标准)

### 3.1 核心能力闭环验收

| ID | 验收项 | 验收条件 |
|---|---|---|
| `AC-L2M-001` | C1 在场成立 | 项目型实例能以 `ProjectMemberRef` 执行主语、关联 `GlobalMemberRef` 身份锚与可验证启动语境进入本地在场;不可验证、关联冲突或非项目型主语未闭口即拒绝;状态可区分;member 只形成注册请求 / 存活信号 / 状态报告,未吸收宿主接受 / session / health truth。 |
| `AC-L2M-002` | C2 入站成立 | 订阅范围回指身份 / 角色来源;正式授权下可做必要瞬时检查;筛选结论四态可区分且回链规则来源;投递使用 typed ref、safe snapshot 或受控安全语境,不持久化或透明转发 raw body;Runtime 拒绝 / 不可用时 waiting / degraded 不代答。 |
| `AC-L2M-003` | C3 出站成立 | 出站决定锚定运行侧 committed safe material;材料满足 body-free 门禁;outcome / 决定 / attempt / delivery / accepted 五层可区分;外部失败不回滚本地决定。 |
| `AC-L2M-004` | C4 追溯成立 | 交互事实可按同一关联语境追溯;追溯与观测材料 body-free;观测交接 attempt / gap 可判断且不声明 observed。 |
| `AC-L2M-005` | C5 摘要成立 | 摘要 / 能力出口只从已提交事实与上游 ref 派生,可重建、不反写;来源失效显式 stale / gap。 |

### 3.2 功能能力验收

| ID | 验收条件 | 功能 |
|---|---|---|
| `AC-L2M-006` | 项目型在场建立具备可验证 `ProjectMemberRef`、关联 `GlobalMemberRef` 与启动语境;匿名、错项目、关联冲突、GlobalMember 代主语或未定义非项目型主语均不进入在场 | FR-001 |
| `AC-L2M-007` | 在场状态显式变化且不互相压平;unknown 不自动升级 | FR-002 |
| `AC-L2M-008` | 宿主可持续获得注册请求 / 存活信号 / 状态报告;member 只记录本地尝试并关联 acceptance / session ref,宿主不可达时不声明接受、session 或健康成功 | FR-003 |
| `AC-L2M-009` | 订阅范围可解释且来源可验证;不可验证的变化被拒绝 | FR-004 |
| `AC-L2M-010` | 授权瞬时检查可与持久化分开;筛选结论四态可区分并回链规则来源;unknown / stale / conflict 保守处置;无本地 allowlist或正文副本 | FR-005 |
| `AC-L2M-011` | 投递采用 typed ref、safe snapshot 或受控安全语境且不透明转发 raw body;决定与受理结果可关联;拒绝 / 不可用 / 超时 / unknown 可区分;duplicate 不重复投递 | FR-006 |
| `AC-L2M-012` | 出站决定锚定正式引用;不合格材料被拒绝出站 | FR-007 |
| `AC-L2M-013` | 发布尝试 / gap 显式;delivery 失败不逆写;迟到反馈形成新事实 | FR-008 |
| `AC-L2M-014` | 交互事实按关联语境可追溯且 body-free | FR-009 |
| `AC-L2M-015` | 观测材料满足最小必要 / body-free / 脱敏 / 可关联四门禁;route 未闭口只 attempt / gap | FR-010 |
| `AC-L2M-016` | 摘要投影可派生、可重建、不反写;freshness 显式 | FR-011 |
| `AC-L2M-017` | 能力出口视图不复制定义正文;ref 失效显式 stale / gap(若该子项被裁剪,本条转为不适用并显式记录) | FR-012 |
| `AC-L2M-018` | 外围增强(统计 / 历史 / 配置视图)缺失不影响核心通过;提供时只读不反写 | FR-E01~E03 |

### 3.3 规则 / 边界与数据归属验收

| ID | 验收条件 |
|---|---|
| `AC-L2M-019` | Step 10 不变量全部成立:在场锚定、订阅来源、筛选结论显式、投递语境带来源、出站锚定、派生只读、开放 seam fail-closed。 |
| `AC-L2M-020` | Step 10 禁止行为未发生:错主语 / 降级入场、自建 allowlist、代答、盲重放、正文持久化或 raw 转发、正文出站、外部反馈逆写、通用外部监听 / 任意外呼、派生反写。 |
| `AC-L2M-021` | 影响性变化显式:在场变化、订阅变化、筛选结论、投递关联、发布 attempt、视图失效均显式且不静默覆盖。 |
| `AC-L2M-022` | owner 边界成立:运行决策、工具、registry、编排 / 健康裁决、镜像、隔离、裁决、对话、观测后端、身份生命周期均保持外部。 |
| `AC-L2M-023` | 真相数据归属正确:本地在场、注册请求 / 存活信号 / 状态报告尝试、订阅决定、筛选结论、投递关联、出站决定、attempt / gap、追溯记录、观测尝试归 member;宿主 acceptance / registry / session / health 不归 member。 |
| `AC-L2M-024` | 快照 / 引用不成为第二 truth:规则快照、delivery / 观测状态摘要、safe view 快照按消费时点锚定;引用由 owner 解析,失败显式。 |
| `AC-L2M-025` | forbidden body 边界成立:入站正文只在授权范围瞬时检查,不进入 member 持久化或 raw 交接;运行结果正文、隐藏推理、secret、定义正文、完整日志不进入记录或出站 / 观测材料。 |
| `AC-L2M-026` | 依赖裁剪成立:仅 Core 为编译期候选;运行期 / 事件关系未写成 package 依赖;sibling pending 未升格。 |

### 3.4 非功能验收

| ID | 验收条件 |
|---|---|
| `AC-L2M-027` | 性能口径成立:本地处理与外部等待可分解;派生路径不阻塞核心;无无来源数字(NFR-001~003)。 |
| `AC-L2M-028` | 可用性口径成立:依赖失效可判别且历史保留;派生失效不拖垮核心(NFR-004~005)。 |
| `AC-L2M-029` | 安全口径成立:执行主语 / 入场 / 筛选 fail closed,瞬时检查与 forbidden persistence / raw forwarding 分开,无通用外部监听或任意外呼且正式 seam 不被误禁(NFR-006~008)。 |
| `AC-L2M-030` | 追溯口径成立:关联追溯与分层追溯成立;外部状态不改写本地历史(NFR-009~010)。 |
| `AC-L2M-031` | 幂等 / 一致性口径成立:duplicate / late / out-of-order 不分叉不逆写;presence 单一语义(NFR-011~013)。 |
| `AC-L2M-032` | 可观测性口径成立:低敏低基数材料可判断;不依赖后端 ready;不泄漏正文(NFR-014~015)。 |
| `AC-L2M-033` | readiness 区分成立:planned / blocked / not_run 未被写成 pass(NFR-016)。 |

### 3.5 一票否决项

| ID | 否决条件 |
|---|---|
| `VF-L2M-001` | 任一核心节点(C1~C4)不成立,或 member 退化为透明转发管道 / 第二运行决策 owner。 |
| `VF-L2M-002` | 不可验证 / 冲突的项目执行主语或启动语境被放行,以 GlobalMember / Workspace view 替代执行主语,未定义非项目型主语被放行,或筛选在规则来源 unknown 时默认放行。 |
| `VF-L2M-003` | member 自建 allowlist / 裁决真相,或反写 Runtime / governance / conversation / identity / bus / observability truth。 |
| `VF-L2M-004` | 入站正文被持久化或以 raw body 透明投递,或运行结果正文、隐藏推理、secret、定义正文进入 member 记录、出站材料或观测材料;正式授权的瞬时检查本身不构成否决。 |
| `VF-L2M-005` | delivery / observed / accepted、宿主注册接受 / session / health 被写成本地决定或在场 truth,或外部失败回滚本地已提交事实。 |
| `VF-L2M-006` | member 暴露通用外部网络监听面或任意直连外部 provider / MCP / A2A / API;正式 Bus、宿主、Runtime seam 不属于该否决条件。 |
| `VF-L2M-007` | 非 Core sibling 进入 package 依赖,或 pending seam(宿主合同 / entry mapping / member-specific schema / route / 规则来源 / 非项目型执行主语)被伪装成已闭口。 |
| `VF-L2M-008` | fake / planned / blocked / not_run 被伪装成 positive integration、evidence、readiness 或验收通过。 |
| `VF-L2M-009` | 交互事实的来源、结论或变化不可回链正式需求 / owner(追溯断链)。 |

## 4. 跨能力验收审计

| 检查项 | 结果 |
|---|---|
| 无验收承接的核心功能 / 硬规则 | 无(FR-001~012 ↔ AC-006~017;BR 六组 ↔ AC-019~026) |
| 无来源的验收项 | 无 |
| 一票否决过宽 / 承载普通缺陷 | 无(9 项均为边界打穿或伪造类) |
| 测试步骤 / 工具泄漏 | 无 |
| AC-017 裁剪条件显式 | 是 |

## 5. 回填草稿

按 §3.1~3.5 回填第 14 章;开头声明"只定义验收合同,不填执行结果"。

## 6. 待确认事项

- AC-017 随 FR-012 裁剪决定挂起。

## 7. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 五类验收覆盖前文关键约束 | pass |
| 每条可判断 | pass |
| 一票否决明确 | pass |
| Step 15 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_15_risks_open_questions
formal_document_write_allowed = false
```
