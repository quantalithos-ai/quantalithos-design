# L2-member 00 需求 Step 9: 功能需求

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 9 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 9 功能需求 |
| 输出文件 | `design-calibration/00_req_step_09_functional_requirements.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.9 五列功能表,按能力拆不按对象 / CRUD 拆;SOP §2.4.1 正反例) |
| 已读取前序输入 | yes(Step 7 节点、Step 8 故事;draft 02 §2 FR 候选) |
| 当前模式 | full-restart |
| 进入条件 | Step 8 gate_status=pass |

## 1. Step 内计划

| 模块(能力节点) | 功能回答 | 诊断 | 输入输出失败语境 | 停审 | gate_status |
|---|---|---|---|---|---|
| C-L2M-1 | done | done | done | pass | pass |
| C-L2M-2 | done | done | done | pass | pass |
| C-L2M-3 | done | done | done | pass | pass |
| C-L2M-4 | done | done | done | pass | pass |
| C-L2M-5 | done | done | done | pass | pass |
| 外围增强 | done | done | done | pass | pass |
| 跨能力功能审计 | done | — | — | pass | pass |

## 2. 本步输入

- Step 7 节点表与进入 / 退出条件;Step 8 故事(US-L2M-001~016、E01~E03)。
- draft 02 §2 FR 候选 15 项(用户确认的讨论输入,须按节点复核)。
- 旧 00 §6 F-001~F-008(historical 审计)。

## 3. 当前材料诊断

| 来源 | 旧口径 / 候选 | 复核结论 |
|---|---|---|
| 旧 00 §6 | F-001~F-006 按 B1-B6 模块列功能 | 按模块拆分,违反"按能力拆";重derive。F-007(supervisord 集成)是载体,废弃;F-008(审计事件)升级为 C4 节点功能。 |
| draft 02 §2 | FR-001~015 候选 | 方向保留,按 Step 7 节点调整归属:原 FR-006(受控投递)与 FR-008/009(IPC)合并为 C2 投递面 + C3 承接面;FR-007(入站记录)与 FR-012(出站审计)/FR-015(观测材料)归入 C4;编号按最终节点顺序重排。 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 Step 7 五节点重排 FR,IPC 类功能并入 C2/C3(采用) | 功能与节点一一对应;IPC 是载体不是能力 | 与 draft 编号不连续 | 采用 |
| 沿用 draft 15 条编号 | 省事 | IPC 独立成组与节点调整冲突 | 不采用 |

## 5. 按能力节点的核心功能需求

### 5.1 C-L2M-1 运行态在场与宿主协作

| 功能需求 | 能力类型 | 说明 | 支撑节点 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-001` 启动语境受理与在场建立 | 核心闭环能力 | 系统必须以可验证的项目型 `ProjectMemberRef` 执行主语、关联 `GlobalMemberRef` 身份锚与启动语境建立成员本地在场;来源不完整、关联冲突或不可验证时拒绝进入在场,非项目型执行主语未闭口时 fail closed。 | C-L2M-1 | US-L2M-001、004 |
| `FR-L2M-002` 在场状态与退出语义 | 核心闭环能力 | 系统必须区分 starting / ready / degraded / draining / terminated / unknown 等在场状态;宿主或运行侧状态不得覆盖本地在场记录,退出与异常变化显式可追溯。 | C-L2M-1 | US-L2M-002 |
| `FR-L2M-003` 宿主注册与存活协作面 | 核心闭环能力 | 系统必须向宿主编排协作方形成注册请求、存活信号、状态报告及本地尝试记录,并关联宿主返回的接受 / session ref;宿主不可达时进入 degraded,不得声明注册已接受、session 已建立或健康已判定。 | C-L2M-1 | US-L2M-003 |

能力级输入 / 输出 / 触发 / 失败语境:

| FR | 输入 | 输出 | 触发 | 必须显式的失败语境 |
|---|---|---|---|---|
| 001 | `ProjectMemberRef`、关联 `GlobalMemberRef`、启动语境 / 凭据 ref | 本地在场建立或拒绝结论 | 项目型容器内成员实例启动 | subject invalid / unsupported、identity unresolved、association conflict、credential unverifiable |
| 002 | 在场变化来源(本地 / 宿主 / 运行侧信号) | 显式在场状态与变化记录 | 状态变化 | unknown 不压平为 ready / terminated;非法迁移拒绝 |
| 003 | 本地在场状态、宿主语境 | 注册请求 / 存活信号 / 状态报告、本地尝试与 acceptance / session 关联 ref | 在场建立、周期或状态变化 | host unreachable → degraded;acceptance / session / health unknown 不压平为成功 |

节点停审: 三项功能均回指故事;凭据形态 / 健康裁决 / 编排未越界;pass。

### 5.2 C-L2M-2 入站筛选与受控投递

| 功能需求 | 能力类型 | 说明 | 支撑节点 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-004` 订阅范围管理 | 核心闭环能力 | 系统必须依据成员身份 / 角色语境形成可解释的订阅范围决定;来源不可验证的订阅变化拒绝。 | C-L2M-2 | US-L2M-006 |
| `FR-L2M-005` 入站筛选 | 核心闭环能力 | 系统必须在正式授权范围内对入站事实及必要正文进行瞬时、受控检查,形成通过 / 降级 / 阻断 / 待定结论(含注入类风险预筛);规则来源回链正式 owner,unknown / stale / conflict 时保守处置,不自建 allowlist,不把正文保存为 member truth。 | C-L2M-2 | US-L2M-005、007 |
| `FR-L2M-006` 受控投递 | 核心闭环能力 | 系统必须把通过筛选的入站语境以 typed ref、safe snapshot 或受控安全语境提交运行决策协作方,并携带来源、scope 与筛选结论;不得透明转发 raw body。对方拒绝或不可用时 waiting / degraded,不代答、不伪造受理、不盲目重放。 | C-L2M-2 | US-L2M-005、008 |

能力级输入 / 输出 / 触发 / 失败语境:

| FR | 输入 | 输出 | 触发 | 必须显式的失败语境 |
|---|---|---|---|---|
| 004 | 身份 / 角色语境 ref、订阅变化请求 | 订阅范围决定与记录 | 在场建立、角色语境变化 | source unverifiable、scope conflict |
| 005 | 入站事实 ref、授权的瞬时检查材料、规则来源 safe snapshot | 筛选结论 + body-free 处置记录 | 入站事实到达 | rule source unknown / stale / conflict → 保守处置;inspection unauthorized / unsafe;正文不得留存 |
| 006 | typed ref、safe snapshot 或受控安全语境 | 投递决定 + Runtime 受理结果 ref | 筛选通过 | raw body transparent forwarding 拒绝;runtime rejected / unavailable / timeout / unknown;duplicate 不重复投递 |

节点停审: 受权瞬时检查与禁止持久化 / 透明 raw 转发已分开;bus delivery / policy 裁决 / Runtime 受理未被吸收;无孤儿;pass。

### 5.3 C-L2M-3 出站承接与安全发布

| 功能需求 | 能力类型 | 说明 | 支撑节点 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-007` 出站承接与交互决定 | 核心闭环能力 | 系统必须承接运行决策协作方的 committed safe material,形成"发布什么、向哪个正式边界、以何种安全形态"的出站决定;材料含正文 / secret / 隐藏推理时拒绝出站。 | C-L2M-3 | US-L2M-009、010 |
| `FR-L2M-008` 发布尝试与分层状态 | 核心闭环能力 | 系统必须向事件主干提交发布尝试并记录 attempt / gap;delivery 失败不回滚出站决定,不声明 delivered / observed / accepted;迟到 / 重复反馈形成新关联事实。 | C-L2M-3 | US-L2M-011 |

能力级输入 / 输出 / 触发 / 失败语境:

| FR | 输入 | 输出 | 触发 | 必须显式的失败语境 |
|---|---|---|---|---|
| 007 | Runtime committed safe material ref | 出站决定 + body-free 发布材料 | 运行结果交接 | material unsafe(正文 / secret / hidden reasoning)→ 拒绝;source mismatch |
| 008 | 出站决定与材料 | 发布尝试记录、attempt / gap、反馈 ref | 出站决定成立 | route pending、delivery failure、duplicate、late feedback 不逆写 |

节点停审: 四层分层(outcome→决定→delivery→accepted)未压平;pass。

### 5.4 C-L2M-4 交互追溯与安全材料

| 功能需求 | 能力类型 | 说明 | 支撑节点 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-009` 交互事实追溯 | 核心闭环能力 | 系统必须让在场变化、订阅决定、筛选结论、投递决定、出站决定与发布尝试按同一关联语境可追溯;追溯材料 body-free。 | C-L2M-4 | US-L2M-012、013 |
| `FR-L2M-010` 安全观测材料形成与交接 | 核心闭环能力 | 系统必须从已提交本地事实形成最小必要、body-free、已脱敏、可关联的观测 / 审计材料并尝试交接;观测通道未就绪时只保留本地尝试 / 缺口,不声明 observed。 | C-L2M-4 | US-L2M-013、014 |

能力级输入 / 输出 / 触发 / 失败语境:

| FR | 输入 | 输出 | 触发 | 必须显式的失败语境 |
|---|---|---|---|---|
| 009 | 本地已提交交互事实 | 关联追溯语境 | 交互事实形成 | correlation 不完整 → 显式缺口,不猜测补齐 |
| 010 | 已提交事实、安全材料约束 | body-free 材料 + attempt / gap | 事实提交、周期交接 | route / producer pending;交接失败不回滚本地事实 |

节点停审: 不扩张为 observation store;安全四门禁成立;pass。

### 5.5 C-L2M-5 成员摘要与能力出口

| 功能需求 | 能力类型 | 说明 | 支撑节点 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-011` 成员状态摘要投影 | 核心闭环能力 | 系统必须从本地已提交事实与运行侧 safe view 派生 body-free 成员状态 / 交互摘要;可延迟、可重建,不成为写源。 | C-L2M-5 | US-L2M-015 |
| `FR-L2M-012` 能力出口安全视图 | 核心闭环能力(可裁剪子项) | 系统必须能从工具契约 / 定义 ref 派生成员可承接能力的安全出口视图;ref 失效显式 stale / gap,不复制定义正文,不形成第二 registry。 | C-L2M-5 | US-L2M-016 |

能力级输入 / 输出 / 触发 / 失败语境:

| FR | 输入 | 输出 | 触发 | 必须显式的失败语境 |
|---|---|---|---|---|
| 011 | 本地事实、Runtime safe view | 摘要投影 | 事实变化、重建请求 | source stale → 显式 freshness;投影失败独立,不写源 |
| 012 | tools / method 定义 ref / safe view | 能力出口视图 | ref 变化、消费请求 | ref unresolved / stale → stale / gap 显式 |

裁剪决定: `FR-L2M-012` 保留在核心表但标注"可裁剪子项"——若 01/02 阶段判定上游 ref 语义不稳,可整体后置为外围增强而不破坏 C5 成立(摘要仍在)。该决定在 Step 15 记待确认。

节点停审: 派生 / 可重建 / 不反写成立;pass。

## 6. 外围增强功能需求

| 功能需求 | 能力类型 | 说明 | 支撑 | 对应故事 |
|---|---|---|---|---|
| `FR-L2M-E01` 筛选统计与误拦截诊断摘要 | 外围增强能力 | 只读派生统计与诊断摘要,不改筛选 truth,不自动调规则。 | 外围:筛选统计 / 诊断 | US-L2M-E01 |
| `FR-L2M-E02` 交互历史只读浏览 | 外围增强能力 | body-free 历史摘要浏览,不替代 conversation / observability truth。 | 外围:历史浏览 | US-L2M-E02 |
| `FR-L2M-E03` 生效配置可解释视图 | 外围增强能力 | 展示订阅 / 出站边界当前生效配置及来源,不成为配置 truth。 | 外围:配置可解释 | US-L2M-E03 |

## 7. 跨能力功能审计

| 检查项 | 结果 |
|---|---|
| 孤儿功能(无故事来源) | 无 |
| 已确认故事无功能承接 | 无(16 条核心故事全部被 FR-001~012 覆盖) |
| 按对象 / CRUD / 接口拆分 | 无 |
| 内部实现项(repository / handler / IPC 载体)混入 | 无 |
| 失败语境统一口径 | 是——invalid / unverifiable / conflict / stale / unavailable / waiting / degraded / blocked / duplicate / late / unknown / gap 不互相压平 |

## 8. 回填草稿

按 §5 五节点核心功能(12 项)+ §6 外围(3 项)回填第 9 章,附能力级输入输出失败表与"失败语义不压平"总则。

## 9. 待确认事项

- `FR-L2M-012` 可裁剪决定传入 Step 15。

## 10. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每项功能有编号、类型、说明、双映射 | pass |
| 核心先于外围且外围不压核心 | pass |
| 每节点已停审 | pass |
| Step 10 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_10_business_rules_boundaries
formal_document_write_allowed = false
```
