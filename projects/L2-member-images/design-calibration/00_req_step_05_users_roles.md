# Step 5. 用户与角色

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `human_system_role_separation` | pass | 人类角色、系统角色、接触场景和授权边界已分离;仓名未被误当人类角色 | 进入 Step 6 使用方与依赖 | `00_req_step_02_position_boundary.md`;`00_req_step_04_goals_non_goals.md` |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 5 与书写规范 §4.5。
- [x] 识别真实人类职责角色,避免复制旧权限矩阵。
- [x] 识别系统角色,但不在本步展开依赖类型或接口动作。
- [x] 为每个角色说明目标级接触场景。
- [x] 明确 role label 不等于授权,正式 authorization / approval 仍归 owner。
- [x] 后置审计旧 Admin / Developer / Auditor 权限勾选表。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | 本仓是静态镜像资产与供给层 |
| Step 4 | 目标聚焦定义、装配、构建、provenance、availability 和 fail-closed |
| governance / security 边界 | role 不能自我授予权限或批准 |
| member-service pending 输入 | 下游系统消费者存在,exact contract 后移 |

## 3. SOP 问题回答

1. 本仓有哪些主要角色?

   回答:人类角色包括镜像资产维护者、构建 / 发布运维者、供应链 / 安全审查者和审计 / 追溯审阅者。系统角色包括定义来源方、装配输入提供方、构建意图来源、构建 / 存储 / 证据后端、Artifact 协作方和实例化入口消费者。

2. 哪些是人类角色,哪些是系统角色?

   回答:人类角色以维护、运维、审查和复盘为目标;系统角色只代表外部能力与本仓发生的消费 / 供给语境,不代表人类权限。

3. 各角色在什么场景接触本仓?

   回答:维护者管理镜像资产定义;运维者观察构建和供给状态并发起受控处置;安全审查者判断适用证据门禁;审计者回溯输入到 digest / availability 的链路;系统角色分别提供或消费受控引用和结果。

4. 是否存在管理、审计或维护类角色?

   回答:三类均存在,但职责不同:维护者改变镜像域定义,运维者处理构建 / 供给,安全审查者处理门禁语境,审计者只读复盘。

5. 是否需要权限矩阵?

   回答:需求阶段不建立 allow / deny 权限矩阵。当前只记录职责接触面;正式 actor、scope、authorization 和 approval source 必须由后续设计引用 owner 合同,不可由角色名称推导。

## 4. 当前文档问题诊断

| 旧口径 | 问题 | 当前处理 |
|---|---|---|
| Admin / Developer / Auditor 权限勾选表 | 本仓无 authorization owner authority | 替换为职责角色与接触场景 |
| 把 member-service / CI 写成用户 | 系统依赖与人类角色混写 | 单列系统角色,依赖关系后移 Step 6 |
| Role maintainer 等同镜像维护者 | 方法库 Role 业务定义与镜像资产定义混淆 | 方法资产维护者是外部定义来源方,本仓维护者不改 Role truth |
| Auditor 特殊镜像与审计员混写 | 运行环境 variant 与人类审计职责不同 | 特殊 variant 留 Q-MI-001,审计角色只负责读 / 复盘目标 |

## 5. 改动前后对比

| 维度 | 旧材料 | 当前结论 |
|---|---|---|
| 人类角色 | 权限矩阵驱动 | 职责 / 目标 / 接触场景驱动 |
| 系统角色 | 与用户混在依赖表 | 单列系统交互语境,Step 6 再定依赖 |
| 授权 | 从角色名推导可操作项 | 只能消费正式 authorization / approval truth |
| 特殊 Role | 固定镜像枚举 | 不在用户角色章节固化 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 复用旧 RBAC 矩阵 | 直观 | 私造权限 truth,且实现未定 | 不采用 |
| 只列仓 / 系统调用方 | 简单 | 缺少人类责任和审计语境 | 不采用 |
| 人类职责角色 + 系统角色双表,授权 owner 尾注 | 满足需求角色完整性且不越权 | 具体权限后移 | 采用 |

## 7. 结构化中间产物

### 7.1 人类角色

| 角色 ID | 角色 | 主要目标 | 接触场景 | 不代表什么 |
|---|---|---|---|---|
| `HR-MI-001` | 镜像资产维护者 | 让 variant / persona 装配定义与当前正式来源保持一致 | 新建、修订、supersede 或 retire 镜像资产定义的受控讨论 / 操作语境 | 不拥有 RoleDefinition、组件发布或 Artifact truth |
| `HR-MI-002` | 构建与发布运维者 | 让构建意图、失败、eligibility、availability 和回滚状态可操作 | nightly / 变化触发后的运行观察、失败处置、发布与回滚协调 | 不拥有 builder / registry 产品 truth或下游升级决定 |
| `HR-MI-003` | 供应链与安全审查者 | 确认正式适用门禁没有被绕过 | 查看 digest / provenance 和适用 evidence 的引用 / 结论,处理 blocked 语境 | 不拥有 scanner / signer / vulnerability / policy truth |
| `HR-MI-004` | 审计与追溯审阅者 | 证明某供给入口由哪些受控输入派生并为何可用 / 不可用 | 只读追溯 variant、输入快照、digest、门禁和 availability 历史 | 不批准发布,不修改 truth,不拥有 observability / archive backend |
| `HR-MI-005` | 事故与恢复协调者 | 在候选异常或已供给版本出现风险时获得明确回滚 / retire 语境 | 识别受影响入口、选择已知安全供给方向并跟踪 handoff gap | 不直接控制成员容器或修复外部 owner truth |

### 7.2 系统角色

| 角色 ID | 系统角色 | 与本仓的目标级关系 | 当前成熟度 |
|---|---|---|---|
| `SR-MI-001` | 方法资产定义来源方 | 提供 RoleDefinition 与 Role -> variant 正式来源 | owner 已定;exact consumption surface pending |
| `SR-MI-002` | 组件产物提供方 | 提供 member / runtime / tools 的正式发布引用和版本事实 | ref 形态 / member 产物 pending |
| `SR-MI-003` | seed 模板来源方 | 提供 policy / memory / workspace seed 模板身份与版本 | owner / contract pending |
| `SR-MI-004` | 构建意图来源 | 表达 nightly 或获准变化 / 事件所产生的构建需要 | nightly accepted;event schema pending |
| `SR-MI-005` | 构建 / registry / evidence 后端 | 承接构建、候选输出存储和正式适用证据检查 | adapter role;产品与 positive readiness 未定 |
| `SR-MI-006` | Artifact 真相协作方 | 为正式化构建输出签发 / 维护 Artifact truth 与消费引用 | owner 已定;image handoff pending |
| `SR-MI-007` | 成员宿主编排消费者 | 消费本仓提供的 pinned 可实例化入口 | sibling 正式 00 未闭合,contract pending |
| `SR-MI-008` | 事件传递主干 | 承载获准的入站构建事件 | 只固定入站方向;schema pending |

### 7.3 角色边界规则

- 人类角色描述职责和目标,不构成 authorization / approval。
- 系统角色描述交互语境,不等于源码依赖、服务或 adapter 已存在。
- 同一自然人可承担多个职责,但安全 / governance owner 的职责分离规则不能由本仓覆盖。
- 审计角色默认只读目标;任何修订必须通过正式写入职责和 owner 校验。
- Role / persona 业务身份不是本节“用户角色”;RoleDefinition 仍由方法库拥有。

## 8. 回填草稿

正式 00 §5 使用人类角色表和系统角色表的精简版,随后保留“角色不等于授权”的尾注。正式章节不列接口动作、仓际依赖类型或 RBAC 勾选项。

## 9. 待确认事项

| ID | 事项 | 当前处理 |
|---|---|---|
| `MI-UP-006` | seed 来源系统角色的具体 owner | 保留抽象系统角色,不命名唯一仓 |
| `Q-MI-001` | 特殊只读 variant | 不与 HR-MI-004 审计角色混同 |
| authorization owner | 正式 actor / scope / permission source | 后续设计只消费 owner 结果;当前不补矩阵 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 人类角色与系统角色是否分开 | pass |
| 角色是否只写职责 / 场景 | pass |
| 是否把仓际依赖或接口动作混入角色 | no |
| 是否私造权限矩阵 | no |
| 审计 / 维护 / 运维角色是否覆盖 | pass |

`gate_status = pass`;允许创建 Step 6,不得跳到 Step 7 或修改正式 00。
