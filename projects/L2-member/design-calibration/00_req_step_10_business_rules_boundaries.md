# L2-member 00 需求 Step 10: 业务规则与边界约束

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 10 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 业务规则与边界约束 |
| 输出文件 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.10:四类核心 + 两类可选规则;规则不滑入实现) |
| 已读取前序输入 | yes(Step 2 边界、Step 7 节点、Step 9 功能) |
| 当前模式 | full-restart |
| 进入条件 | Step 9 gate_status=pass |

## 1. Step 内计划

| 模块(能力节点) | 规则回答 | 映射 | 停审 | gate_status |
|---|---|---|---|---|
| C-L2M-1 | done | done | pass | pass |
| C-L2M-2 | done | done | pass | pass |
| C-L2M-3 | done | done | pass | pass |
| C-L2M-4 | done | done | pass | pass |
| C-L2M-5 | done | done | pass | pass |
| 全局 / 依赖规则 | done | done | pass | pass |
| 跨能力规则审计 | done | — | pass | pass |

## 2. 本步输入

- Step 2 边界判定口径与红线方向;Step 7 进入 / 退出条件与禁止误写;Step 9 FR-001~012 失败语境。
- L2-runtime 00 §10(BR 写法样板)与 L2-tools 00 §10(六类规则分类)。
- 旧 00 §6.2 BR-001~005(historical 审计)。

## 3. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 BR-001 | "launch_token 无效 → 拒绝启动" | 方向保留(fail-closed 入场),凭据形态剥离 → BR-L2M-002。 |
| 旧 BR-002 | "Publisher 只能发 CloudEvents" | CloudEvents envelope / W3C Trace Context 的 authority 归 Core;旧 member-specific type / route 无 authority。重写为"承接 Core 标准 + 出站只发安全材料 + member-specific 合同 pending"。 |
| 旧 BR-003 | "IPC 只监听 UDS" | UDS 是载体假设;需求层只限制通用外部监听与任意外呼,不得误伤 Bus、宿主与 Runtime 正式 seam。 |
| 旧 BR-004 | "命中高危模式 → 阻断或降级" | 方向保留,补规则来源回链与 unknown 保守处置。 |
| 旧 BR-005 | "崩溃必被 supervisord 捕获重启" | 载体 + 宿主职责;member 侧只保留"退出变化显式可感知"。 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按节点分组 + 全局组,六类规则类型(采用) | 与上游写法一致,规则可挂载 | 条数较多 | 采用 |
| 沿用旧 5 条扩写 | 短 | 覆盖不足且含载体假设 | 不采用 |

## 5. 结构化中间产物(业务规则表)

### 5.1 C-L2M-1 在场与宿主协作

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-001` | 不变量 | 项目型成员在场必须以可验证 `ProjectMemberRef` 为执行主语,关联 `GlobalMemberRef` 身份锚和启动语境;GlobalMember、Workspace view、匿名或不可归属进程不得替代执行主语。 | 在场主体 | FR-001 |
| `BR-L2M-002` | 禁止行为 | 启动语境或凭据引用缺失、冲突或不可验证时,不得进入在场,不得降级放行。 | 入场门槛 | FR-001 |
| `BR-L2M-003` | 显式变化 | 在场状态变化(含退出与异常)必须显式发生并可追溯,不得由心跳缺失、进程信号或宿主状态隐式改写。 | 在场生命周期 | FR-002 |
| `BR-L2M-004` | 边界约束 | starting / ready / degraded / draining / terminated / unknown 不得互相压平;unknown 不得自动升级为 ready 或 terminated。 | 在场状态语义 | FR-002 |
| `BR-L2M-005` | 边界约束 | member 只拥有注册请求、存活信号、状态报告及本地尝试记录;注册接受、endpoint registry、host session、健康判定、恢复 / 重启决定、容器编排与凭据签发不归本仓。 | member / member-service 边界 | FR-003 |
| `BR-L2M-006` | 禁止行为 | 宿主不可达或反馈 unknown 时不得伪装注册已接受、session 已建立或健康已判定,也不得仅凭宿主缺失自行改写为 terminated;本地只进入可解释 degraded / unknown 并保留记录。 | 宿主协作失效 | FR-003 |

### 5.2 C-L2M-2 入站筛选与受控投递

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-007` | 不变量 | 订阅范围必须回指成员身份 / 角色语境的可验证来源;不得由字符串、显示名或私有配置猜测订阅边界。 | 订阅决定 | FR-004 |
| `BR-L2M-008` | 不变量 | 每条入站事实必须形成显式筛选结论(通过 / 降级 / 阻断 / 待定),结论必须回链规则来源。 | 筛选结论 | FR-005 |
| `BR-L2M-009` | 禁止行为 | 不得自建 allowlist / denylist 作为裁决真相;规则来源 unknown / stale / conflict 时必须保守处置(降级或阻断),不得默认放行。 | 筛选规则来源 | FR-005 |
| `BR-L2M-010` | 边界约束 | 筛选结论是预筛处置事实,不是 policy 裁决;policy truth 归 governance,bus delivery truth 归 bus。 | member / governance / bus 边界 | FR-005 |
| `BR-L2M-011` | 不变量 | 正式授权允许 member 为筛选进行必要的瞬时受控正文检查,但不得持久化正文;投递给运行决策协作方的语境必须采用 typed ref、safe snapshot 或受控安全语境并带来源、scope 与筛选结论,不得透明转发 raw body。 | 筛选与投递语境 | FR-005/006 |
| `BR-L2M-012` | 禁止行为 | 运行侧拒绝、不可用或超时时,不得代答、不得伪造受理结果、不得对 unknown 结果盲目重放。 | 投递失效 | FR-006 |
| `BR-L2M-013` | 显式变化 | 投递决定与运行侧受理结果必须显式关联;duplicate / late 输入形成新关联事实,不逆写既有记录。 | 投递记录 | FR-006 |

### 5.3 C-L2M-3 出站承接与安全发布

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-014` | 不变量 | 出站决定必须锚定运行侧 committed safe material 的正式引用;member 不得自创运行结果或修改其语义。 | 出站承接 | FR-007 |
| `BR-L2M-015` | 禁止行为 | 事件正文、secret、隐藏推理、raw provider body 不得进入出站材料;材料不满足 body-free / 脱敏 / 可关联门禁时拒绝出站。 | 出站安全门禁 | FR-007 |
| `BR-L2M-016` | 边界约束 | Runtime outcome、member 出站决定、发布尝试、bus delivery、下游 accepted 五层必须保持可区分;任何一层不得替代或压平其他层。 | 出站分层 | FR-007/008 |
| `BR-L2M-017` | 禁止行为 | delivery 失败、receipt、下游摘要或 observed 状态不得回滚、改写或重新裁决本地出站决定。 | 外部反馈边界 | FR-008 |
| `BR-L2M-018` | 显式变化 | 发布尝试、降级与缺口必须显式记录;后续尝试形成新事实,不覆盖既有 attempt / gap。 | 发布记录 | FR-008 |
| `BR-L2M-019` | 边界约束 | member 不得暴露通用外部网络监听面,不得任意直连 provider、MCP / A2A 或外部 API;Bus、宿主与 Runtime 的正式 event / runtime seam 不在禁止范围内,外部能力经 Runtime→Tools 链。 | 对外边界 | FR-007/008 |

### 5.4 C-L2M-4 交互追溯与安全材料

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-020` | 审计约束 | 在场变化、订阅决定、筛选结论、投递决定、出站决定与发布尝试必须能按同一关联语境回链来源、目的与结果分类。 | 交互追溯 | FR-009 |
| `BR-L2M-021` | 禁止行为 | 追溯与观测材料不得包含事件正文、隐藏推理、secret 或高基数用户内容;追溯不等于完整日志。 | 追溯最小暴露 | FR-009/010 |
| `BR-L2M-022` | 边界约束 | 观测材料交接的 attempt / delivery / observed 分层独立;observed truth 归 observability,不得由 member 声明。 | member / observability 边界 | FR-010 |
| `BR-L2M-023` | 显式变化 | 观测交接失败、不可用或重复必须显式可见,但不得解释为 member 本地交互失败。 | 观测交接 | FR-010 |

### 5.5 C-L2M-5 摘要与能力出口

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-024` | 不变量 | 摘要与能力出口只能从本地已提交事实和上游正式 ref / safe view 派生;可延迟、可重建。 | 派生视图 | FR-011/012 |
| `BR-L2M-025` | 禁止行为 | 摘要 / 出口视图不得反写任何 truth,不得复制工具 / 方法定义正文,不得形成第二 registry。 | 派生边界 | FR-011/012 |
| `BR-L2M-026` | 显式变化 | 视图来源失效、过期或冲突必须显式呈现为 stale / gap,不得以旧值冒充当前状态。 | 视图新鲜度 | FR-011/012 |

### 5.6 全局 / 依赖规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 保护功能 |
|---|---|---|---|---|
| `BR-L2M-027` | 边界约束 | member 不拥有运行决策、工具契约与执行、capability registry、容器编排、镜像构建、隔离执行、approval / policy truth、对话真相、observability backend 或身份生命周期。 | 全仓 owner 边界 | 全部 FR |
| `BR-L2M-028` | 依赖约束(边界约束) | 只有 `L0-core` 可成为编译期依赖候选;运行期与事件协作关系不得写成 package dependency;sibling pending 契约不得被当作已闭口。 | 依赖裁剪 | 全部 FR |
| `BR-L2M-029` | 不变量 | 任一正向 seam(宿主合同、entry mapping、member-specific Core schema / event route、凭据 owner、筛选规则来源、观测 route、非项目型执行主语)未闭口时,受影响能力只能 blocked / waiting / degraded / fail-closed,不得声明 ready。 | 开放 seam | 全部 FR |
| `BR-L2M-030` | 审计约束 | member 域关键事实的记录不得保存外部正文或隐藏推理正文;授权的瞬时检查不转化为持久化 truth,正确记录形态是 typed ref、safe snapshot、结论分类或 redacted marker。 | 记录形态 | FR-005~012 |

## 6. 跨能力规则审计

| 检查项 | 结果 |
|---|---|
| 孤儿规则(无功能 / 边界来源) | 无 |
| 规则冲突 | 无(BR-006 与 BR-003/004 兼容:宿主不可达属显式 degraded 变化) |
| 规则重复 | 无(BR-015 出站门禁与 BR-021 追溯门禁对象不同) |
| 实现校验 / 接口约束 / 字段泄漏 | 无 |
| 六类规则分布 | 不变量 8;禁止行为 8;显式变化 5;边界约束 8;治理约束 0(筛选来源以 BR-009/010 承接,正式 taxonomy 待 `L2M-UP-007`);审计约束 3 |

治理约束类为 0 的说明: member 不承接 approval 前置动作(与 tools 的 governed invocation 不同),其治理关系是"消费 Policy effective 结果用于筛选分级",已由不变量 + 禁止行为覆盖;若 `L2M-UP-007` 闭口后出现"出站需治理前置"场景,回开本 Step 补治理约束。

## 7. 回填草稿

按 §5 六组规则表 + 规则类型汇总表回填第 10 章。

## 8. 待确认事项

- 出站是否存在需正式治理前置的场景(随 `L2M-UP-007` 挂起)。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每条规则有编号 / 类型 / 内容 / 约束对象 / 保护功能 | pass |
| 核心闭环相关规则优先覆盖 | pass |
| 每节点已停审 | pass |
| Step 11 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_11_data_ownership
formal_document_write_allowed = false
```
