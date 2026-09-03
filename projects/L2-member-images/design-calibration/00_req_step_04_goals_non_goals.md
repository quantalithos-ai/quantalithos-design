# Step 4. 目标与非目标

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `scope_outcome_boundary` | pass | 7 项可判断目标、15 项带 owner 非目标和 current / conditional / future 范围已收敛 | 进入 Step 5 用户与角色 | `00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;ADR-0005 |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 4 与书写规范 §4.4。
- [x] 将 `P-MI-001~009` 转换为可判断结果,不直接写功能动作。
- [x] 将相邻 owner 和实现后移项拆成明确非目标。
- [x] 区分 current、conditional 和 future,避免 pending 合同被伪装为完成前置。
- [x] 后置审计旧 G-1~G-7 / NG-1~NG-5 的数字与范围污染。
- [x] 完成目标到问题映射和空洞目标自检。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | 静态镜像资产与构建供给边界 |
| Step 3 | 9 项业务 / 治理 / 技术一致性问题 |
| ADR-0005 | nightly、一 Role 一镜像、pin、禁生产 `latest` 等结果约束 |
| 上游 owner | mapping、Artifact、runtime、tools、sandbox 真相不可被目标吞并 |
| pending register | exact schema / adapter / evidence kinds 不得变成完成目标 |

## 3. SOP 问题回答

1. 本次需求结束后应成立哪些状态、边界或能力?

   回答:本仓镜像域 truth 唯一;Role mapping 受控消费;静态装配输入全部 pinned 且与 live state 分离;nightly / 受控触发构建可形成完整输入输出记录;digest / provenance 与适用门禁可解释;供给 availability / rollback / retire 显式;下游只获得可验证的 pinned 入口。

2. 目标如何验证?

   回答:通过后续 Step 14 检查每个正式 variant、构建候选和可用入口是否具备对应来源、状态、失败语义和 owner 边界。未闭口合同只能验证 fail-closed,不能验证 positive integration readiness。

3. 哪些事项相关但不纳入当前范围?

   回答:Role 定义、tool contract / execution、runtime live state、容器 lifecycle、sandbox、Artifact 通用生命周期、governance / observability / marketplace / product truth,以及具体基础设施产品和协议字段。

4. 哪些事情交给相邻仓或后续阶段?

   回答:相邻 owner 继续定义各自 truth;01~04 决定架构、对象、配置和 adapter 绑定;05~06 设计测试 / 验收但不执行;07 只规划实施。多架构、特殊收缩 variant、加固基础镜像和分析能力作为 future / conditional。

## 4. 当前文档问题诊断

| 旧目标 | 问题 | 当前处置 |
|---|---|---|
| 9/9 Role、100% 覆盖 / 成功 | 固定目录和无 evidence 数字 | 改为“对当前正式 mapping 集合的覆盖可解释;缺失显式 blocked” |
| 固定构建耗时 / 镜像大小 | 无 current measurement authority | 移除;NFR 只定义可判断语义 |
| scan / sign / BOM 必须全部通过 | 具体 evidence kind policy 未闭合 | 改为“正式适用门禁不可绕过”,种类 conditional |
| 通知 member-service | 假设出站事件 / exact contract | 改为提供 pinned 可实例化入口,positive seam pending |
| 不做通用制品仓 | 方向正确但边界不够精确 | 明确 Artifact fact / version / lineage / baseline 全归 artifact |

## 5. 改动前后对比

| 范围 | 旧口径 | 当前口径 |
|---|---|---|
| 当前主线 | CI build / scan / push 步骤 | 镜像域 truth -> pinned input -> build binding -> eligibility -> supply |
| 条件主线 | 默认所有供应链工具已存在 | 只有经 authority 确认的 evidence gate 才适用 |
| 未来增强 | 多架构等混在核心功能 | 单列 future / conditional,不阻塞核心语义 |
| 验证上限 | 目标文本暗示实现完成 | 当前只形成 design requirements;实施 / 测试事实均不存在 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 目标按 CI 步骤组织 | 易读 | 把实现流程当业务结果 | 不采用 |
| 目标按对象 CRUD 组织 | 对象明确 | 需求过早进入设计 | 不采用 |
| 目标按可成立的镜像资产 / 供给结果组织 | 可验收且不锁实现 | 后续需再拆能力 / 功能 | 采用 |

## 7. 结构化中间产物

### 7.1 目标表

| ID | 目标 | 可判断口径 | 承接问题 |
|---|---|---|---|
| `G-MI-001` | 建立唯一的成员镜像资产与供给 truth 边界 | 镜像域事实有唯一 owner;相邻 truth 仅以 ref / snapshot / safe conclusion 进入 | P-MI-001 / 006 |
| `G-MI-002` | 让 Role 映射和 persona / variant 装配关系受控成立 | 每个有效 variant 可回指方法库正式 mapping 来源;缺失 / stale / conflict 显式 | P-MI-002 |
| `G-MI-003` | 让全部静态装配输入 pinned、可归责且与 live state 分离 | 组件 / extras / seed 均有稳定来源与版本;不存在以 runtime state 补齐输入 | P-MI-003 / 004 |
| `G-MI-004` | 让 nightly 和获准输入变化形成可追溯构建意图与结果 | 每次构建有唯一意图、完整输入快照、候选输出或明确失败 / unknown | P-MI-008 / 009 |
| `G-MI-005` | 让候选输出具备 digest / provenance 与正式适用门禁解释 | 候选 digest 可回指输入;适用 evidence 缺失 / 失败时 eligibility fail closed | P-MI-005 |
| `G-MI-006` | 让镜像供给的 publish / rollback / retire 和可实例化入口可解释 | availability 变化显式;只提供 pinned、可验证入口;下游消费决定不反写本仓 | P-MI-006 / 007 |
| `G-MI-007` | 让所有未闭口 seam 保持可见且不伪造 readiness | exact contract 缺失时返回 pending / blocked / unavailable / gap,不得默认成功 | P-MI-007 / 008 / 009 |

### 7.2 非目标表

| ID | 非目标 | Owner / 后续位置 | 理由 |
|---|---|---|---|
| `NG-MI-001` | RoleDefinition、Role 业务定义和 Role -> variant 映射定义 truth | `L3-method-library` / identity 方向 | 本仓是映射消费者 |
| `NG-MI-002` | member 主体、persona live behavior、入出站成员门面 truth | `L2-member` | 镜像内静态 persona 装配不等于运行成员主体 |
| `NG-MI-003` | run / loop / turn / plan / working memory / checkpoint / recovery truth | `L2-runtime` | 属于运行期 live state |
| `NG-MI-004` | tool identity / contract / invocation / execution 与 capability registry | `L2-tools` / `L3-capability-hub` | 本仓只装配受控产物 |
| `NG-MI-005` | 外部 MCP / A2A / API adapter、provider route / secret / quota truth | capability / adapter / security owner | 不属于镜像资产 truth |
| `NG-MI-006` | 容器创建、启动、停止、注册、心跳、健康、升级决定 | `L2-member-service` | 下游实例化和生命周期 owner |
| `NG-MI-007` | sandbox policy、isolation backend、execution / capture / cleanup truth | `L4-sandbox` | 本仓不拥有隔离执行 |
| `NG-MI-008` | Artifact 正文、`ArtifactVersion`、`ArtifactLineageLink`、baseline 和 consumption backref truth | `L1-artifact` | 防止通用制品双写源 |
| `NG-MI-009` | governance approval / policy effective truth | `L1-governance` 等正式 owner | 本仓只承接适用结论 / template ref |
| `NG-MI-010` | observability backend、observed truth、日志 / 指标 retention | `L4-observability` | 本仓只提供 body-free trace material 候选 |
| `NG-MI-011` | marketplace listing、产品 UI / CLI 和最终用户入口 | `L6-marketplace` / L5 products | 分发 / 产品边界 |
| `NG-MI-012` | CI、builder、registry、scanner、signer、secret store 产品本体 | infra / adapter | 需求保持产品中立 |
| `NG-MI-013` | 当前阶段锁定协议、schema 字段、数据库、语言、进程和目录 | 01~04 / 07 | 需求层不决定实现组织 |
| `NG-MI-014` | 当前设计产生真实构建、digest、report、evidence、测试或发布结果 | 实施 / 测试 / 验收流程 | 事实尚未发生 |
| `NG-MI-015` | 未获 authority 的构建 / 发布出站事件 | `L0-bus` / Core 后续合同 | 当前矩阵只授权入站消费方向 |

### 7.3 范围层级

| 层级 | 范围 | 当前结论 |
|---|---|---|
| current core | G-MI-001~007 的镜像域语义、nightly 意图、pin、digest / provenance、fail-closed 供给边界 | 进入 00 主线 |
| conditional positive | exact mapping / component / seed / Artifact / member-service / event / evidence adapter 合同 | 需求可定义失败边界;positive readiness 由 blocker 控制 |
| future / enhancement | 多架构、特殊收缩 variant、快速安全补丁、加固基础镜像、使用分析 | 不进入核心完成分母;后续重开或升级 |
| excluded | NG-MI-001~015 | 不进入本仓 truth 或当前需求层 |

## 8. 回填草稿

正式 00 §4 使用目标表与非目标表。范围结论必须同时说明:current core 是设计语义范围,不是 implementation readiness;conditional seam 未闭口时只验 fail-closed;future 项不进入当前核心验收分母。

## 9. 待确认事项

| ID | 当前放置 |
|---|---|
| `Q-MI-001` 特殊 variant | future / enhancement |
| `Q-MI-002` 多架构 | future / enhancement |
| `Q-MI-003` 产品选型 | NG-MI-012,后移 04 |
| `Q-MI-004` evidence kinds | conditional positive;适用门禁总则进入 current core |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每个目标是否可判断 | pass |
| 每个目标是否回指问题 | pass |
| 非目标是否具体并有 owner / 后续位置 | pass |
| 是否把功能 / 技术方案当目标 | no |
| 是否把 pending positive seam 当已完成 | no |

`gate_status = pass`;允许创建 Step 5,不得跳到 Step 6 或修改正式 00。
