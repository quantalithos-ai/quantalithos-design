# Step 06. 使用方与依赖

## 1. Step 状态

- 状态：[x] 已完成（2026-08-21 authority 复核）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 6
- 回填章节：`00-需求文档.md` §6(书写规范 4.6)

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 02 边界 / Step 05 角色;`全局项目依赖关系与裁剪规则.md` §4/§5/§6;draft/02
- [x] SOP 问题回答：见 §3
- [x] 当前材料 / 旧文档诊断：见 §4
- [x] 设计取舍(含 MSVC-UP-003 / 004 / 008 authority 处置)：见 §6
- [x] 结构化中间产物(裁剪表 / 分类表 / 禁止表 / 裁剪图)：见 §7
- [x] 复杂度判断：单 Step 完成;依赖类中间产物固定六件套齐备
- [x] 回填草稿：见 §8
- [x] 自检与进入下一步条件：见 §9 / §10

## 2. 本步输入

- 上游文档：`全局项目依赖关系与裁剪规则.md` §4(总矩阵 `L2-member-service` 行)、§5/§6(输出格式);上游各仓 §6(identity 输出行、work 事件协作行、sandbox 消费行、method-library 输出行)
- 讨论输入：draft/02;2026-08-21 用户同意审计结论与修复方向,本 Step 仍须按全局基线独立收敛
- 依赖的前序 Step：Step 05(pass)

## 3. SOP 问题回答

1. 本仓向哪些仓 / 系统提供哪些能力？

   回答：向宿主意图触发方(work 事实驱动、运维入口)提供宿主编排受理与控制;向宿主内进程(`L2-member` seam,pending)提供注册 / 心跳 / 状态承接;向 Bus / Observability 提供已提交 body-free 宿主事实;向 runtime(入口 surface pending)提供宿主与会话承载;向 console / chat / workspace 等下游提供 safe view 消费候选(不进主链)。

2. 本仓依赖哪些仓 / 系统提供哪些能力？

   回答：`L0-core`(共享契约类别)、`L0-sdk`(全局矩阵规定的编译期 / Server 自测试依赖基线,具体使用范围后置)、`L1-identity`(成员生命周期 / 可运行性信号)、`L1-work`(ProjectMember 事实与意图)、`L1-governance`(生效策略事件)、`L2-member-images`(解析后的 pinned image ref / manifest,pending)、`L4-sandbox`(宿主级 binding / release 与失败反馈)、`L0-bus`(事件主干)、容器运行时与镜像 registry(adapter)。`L3-method-library` 当前只向 `L2-member-images` 提供 role/image 定义来源,不是本仓已闭口的直接运行期依赖。

3. 这些关系在全局依赖基线中分别是什么边?哪些进入主链,哪些裁剪出去？

   回答：见 §7 裁剪表。裁剪出去的:L5 产品 / L1-workspace / L4-archive(下游消费候选,未校准)、`L2-tools` / `L3-capability-hub` / `L1-artifact`(边界排除输入,无直接依赖边)。

4. 每条进入主链的关系属于编译期、运行期还是事件协作？

   回答：见 §7 分类表。现行全局矩阵规定编译期依赖为 `L0-core / L0-sdk`;本仓不得自行覆盖该 authority。`L0-sdk` 当前只按产品矩阵中的 Server 自测试 / 正式客户端合同基线承接,不得反向进入宿主 domain truth 或运行期主链;具体 dependency target 留待 01 / 03 收敛。

5. 哪些依赖是闭环前置?哪些失效会影响当前阶段能力？

   回答：闭环前置——identity(无身份摘要不能装配)、work(无项目执行主语不能受理项目型 launch)、member-images 正式镜像引用合同(未闭口时 launch blocked)、镜像 registry / 容器运行时(无承载不能启动)、sandbox 宿主 binding(要求隔离的宿主未绑定时 blocked)。非前置——governance 事件(策略传递路径待确认)、bus / observability(交接失败只形成 gap)、member / runtime 正向合同(pending,以 fail-closed 承接)。method-library 是 member-images 的上游定义来源,其失效通过镜像引用合同体现,本仓不建立第二条直接解析路径。

6. 哪些关系只是消费 / 引用,哪些形成强阻塞？

   回答:强阻塞型:容器运行时 / registry 不可用 → 新启动 blocked;sandbox 宿主 binding 不可用 → 要求隔离的宿主 blocked;identity / work 或正式 pinned image ref 不可验证 → 新装配拒绝或等待,已运行宿主保持并显式 stale。消费 / 引用型:governance 策略快照、bus 发布、observability 材料、下游 safe view。

7. 哪些依赖虽然存在,但不属于当前阶段前置条件？

   回答：`L0-sdk` 的运行期客户端封装、L5 产品消费、archive / workspace 消费不属于宿主闭环前置。`L0-sdk` 仍按全局矩阵保留编译期 / 自测试基线,两种语义不得混写。member-images 的签名与 manifest 字段仍 pending,但"必须消费正式 pinned image ref,不可自行解析 role/image mapping"是当前 fail-closed 边界。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 00 §10.1 | 依赖表带 SLA 数字(99.9% 等)与降级策略,无 authority | 伪量化;降级策略是方案不是需求边界 |
| 旧 00 §10 | 无依赖类型区分(compile / runtime / event),无禁止依赖表、无裁剪图 | 违反全局裁剪规则 §5/§6 固定输出 |
| 旧 README | `quantalithos-sdk` 直接列为上游依赖 | 依赖类型未判定;与 SDK 下游定位冲突 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 依赖表 | SLA + 降级方案式 | 裁剪表 + 类型分类表 + 禁止表 + 裁剪图 | 全局规则 §5/§6 固定格式 |
| SDK | 上游依赖但未说明用途 | 遵守全局矩阵的编译期 / Server 自测试基线;禁止进入运行期宿主主链,具体 target 后置 | 本仓不能覆盖全局 authority,同时需要阻断客户端实现反向污染 domain |
| Role/image | 本仓直接读取 method-library | method-library 向 member-images 提供定义;本仓只消费 member-images 正式 pinned image ref / manifest | 防止双解析路径和第二映射真相 |
| Sandbox | bind / execute / release 被压成一个本仓接缝 | 本仓只拥有宿主级 binding / release 装配与反馈;逐动作 execute caller 归 tools / runtime 正式边界或保持 pending | 防止吞并 tool execution / run progression |
| 失效处理 | retry / cache 方案 | 失效后果语义(blocked / stale / gap) | 需求层写后果不写方案 |

## 6. 设计取舍

### 6.1 MSVC-UP-008 处置:`L0-sdk` 依赖类型

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 本仓覆盖总矩阵,把 `L0-sdk` 改为纯下游消费 | 局部依赖方向简单 | 单仓无权覆盖全局 authority;会让 flow 在 unresolved conflict 上伪造 pass | 不采用 |
| 遵守 `L0-core / L0-sdk` 编译期基线,把 SDK 限定为正式客户端合同 / Server 自测试语义,具体 dependency target 后置 | 与全局矩阵及产品矩阵“Server 自测试依赖”一致;不把 SDK 客户端实现带入运行期核心 | 01 / 03 仍需决定 crate / package / generated contract / test harness 的准确形态 | 采用 |

处置结论:需求层不再申请修改全局矩阵。`MSVC-UP-008` 从 `matrix_tension` 改为 `baseline_applied_scope_pending`:编译期关系按 authority 成立,但其准确用途与依赖目标未闭口,不得被实现者解释为 runtime SDK client 或业务核心源码依赖。

### 6.2 MSVC-UP-003 处置:role/image 到宿主镜像引用

当前 `L3-method-library/00` 只正式声明向 `L2-member-images` 输出 role → image variant 定义来源。因此本仓不建立 `member-service -> method-library` 直接运行期边；主链为“member-images 基于正式定义形成镜像资产 / manifest -> member-service 消费 pinned image ref”。Step 17 终审刷新后，`L2-member-images` 的 supply availability / pinned entry 需求级方向已正式停审；exact manifest / variant / ref / confirmation contract 仍 pending，缺失或不可验证即 launch blocked。

### 6.3 MSVC-UP-004 处置:Sandbox 宿主交接

`L2-tools` 已拥有 sandbox-required invocation 的条件化 execution handoff,`L2-runtime` 已拥有 action 推进与反馈消费。本仓只承接 `MemberExecutionHost` 的 SandboxBinding 装配结果、宿主级 bind / release、健康 / cleanup 关联和允许的 failure / source refs;不得创建 ToolInvocation、推进 run 或把逐动作 execute 结果写成 host truth。非工具型宿主维护动作是否由本仓直接请求 execute,在正向 caller contract 闭口前保持 pending。

### 6.4 governance 关系形态

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把"policy 传递到宿主"写成本仓依赖能力 | 与旧 Policy Proxy 连续 | 传递路径 owner 未确认(MSVC-UP-005) | 不采用 |
| 只保留"订阅 policy 生效事件"的事件协作边,传递路径挂待确认 | 不越权;矩阵行支持("订阅 policy 事件") | 传递需求暂缺 owner | 采用 |

### 6.5 member / runtime / member-images 的 pending 表达

采用"进入主链 + pending 标注"而非"裁剪出主链":这三条 seam 是本仓核心能力闭环的组成部分(注册合同 / 会话承载 / pinned image ref 消费),不能因未闭口而裁掉,只能 fail-closed 承接。

## 7. 结构化中间产物

### 全局基线引用

- 规则来源:`standards/document/全局项目依赖关系与裁剪规则.md`
- 上游矩阵来源:`architecture/仓库拆分方案.md` §十一;总矩阵 `L2-member-service` 行
- 本 Step 只裁剪 `L2-member-service` 相关依赖边,不复制 27 仓总矩阵。

### 内部仓依赖表(正式 §6.1 候选)

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID / ref / metadata / error / trace / envelope 契约类别 | 是 | 无法形成平台一致的宿主契约类别,不得本地 shadow |
| 输入 | `L0-sdk` | 全局矩阵规定的编译期正式客户端合同 / Server 自测试基线 | 否 | 不阻塞宿主运行闭环;具体 dependency target 未闭口时阻塞实现边界声明 |
| 输入 | `L1-identity` | GlobalMember 身份锚、生命周期与可运行性信号 | 是 | 新装配拒绝 / 等待;存量宿主显式 stale |
| 输入 | `L1-work` | ProjectMember 项目执行主语与分配 / 回收事实 | 是(项目型宿主) | 无可验证执行主语时不得启动项目型宿主 |
| 输入 | `L2-member-images` | 正式 pinned image ref / manifest 与允许的 provenance refs | 是 | 合同未闭口或引用不可验证时 launch blocked |
| 输入 | `L4-sandbox` | 宿主级 binding / release、failure 与 cleanup 反馈边界 | 是(要求隔离的宿主) | binding 不成立时不得 host fallback |
| 输入 / 输出 | `L2-member` | launch / register / heartbeat / status 合同 | 是,pending | 合同未闭口时只能保留 placeholder,不得声明宿主 ready |
| 输入 / 输出 | `L2-runtime` | 宿主会话承载、runtime entry / feedback ref 边界 | 是,pending | 对端 `Q-L2R-001` 未闭口时只保留 capability-level seam |
| 输入 | `L1-governance` | 生效 policy 事件 / ref | 否 | 传递 owner 未确认;不得由本仓补造裁决或默认放行 |
| 输入 / 输出 | `L0-bus` | 上游事件消费与已提交宿主事实传播主干 | 否 | delivery gap 显式,不回滚本地 truth |
| 输出 | `L4-observability` | body-free 宿主材料与 handoff attempt / gap | 否 | 交接失败形成 gap,不得声明 observed |

`L3-method-library` 当前是 `L2-member-images` 的正式定义来源,不是本仓已闭口的直接输入边。`L2-tools` 是逐动作工具执行与 Sandbox handoff owner 之一,与本仓只形成边界排除 / source-ref 相关性,不形成当前直接依赖边。

### 外部系统依赖表(正式 §6.2 候选)

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 / 输出 | 容器运行时 / 编排平台 | 宿主物理承载与生命周期动作的 adapter 能力 | 是 | 新启动 blocked;存量宿主进入可解释的 unknown / degraded |
| 输入 | 镜像 registry | pinned image ref 对应资产的拉取能力 | 是 | 拉取失败显式分类,不得写成启动成功 |

具体 Docker / Kubernetes / registry 产品、API、重试与认证机制不进入需求层。

### 本仓依赖裁剪表(正式 §6.3 候选)

| 关联项目 / seam | 全局关系 | 本仓角色 | 依赖类型 | 进入主链 | 裁剪理由 / 失效后果 |
|---|---|---|---|---|---|
| `L0-core` | 共享契约来源 | 依赖方 | 编译期 | 是 | 本仓 specific schema 未闭口时 pending,不本地 shadow |
| `L0-sdk` | 总矩阵规定的编译期依赖;产品矩阵说明 Server 自测试用途 | 依赖方(编译 / 测试边界) | 编译期 | 否(非宿主运行前置) | 按 authority 保留;具体 target 留 01 / 03,不得进入运行期宿主核心 |
| `L1-identity` | identity 向本仓输出生命周期与可运行性信号 | 依赖方 | 运行期 + 事件 | 是 | 闭环前置;不可用时新装配拒绝 / 等待,已运行宿主保持并显式 stale |
| `L1-work` | ProjectMember 事实与意图来源 | 依赖方 | 运行期 + 事件 | 是 | 闭环前置;意图缺失 / 冲突不受理 |
| `L1-governance` | 订阅 policy 生效事件 | 协作方 | 事件 | 是 | 非前置;策略快照 stale 显式;传递路径 owner 待确认(MSVC-UP-005) |
| `L3-method-library` | role → image variant 定义来源 | 间接上游 / 边界输入 | 无直接依赖边 | 否(间接) | 当前正式输出到 member-images;本仓不得建立第二解析路径 |
| `L2-member-images` | 镜像资产提供方（需求级正式停审） | 依赖方 | 运行期 + ref（详细合同 pending） | 是 | 消费正式 pinned entry 供给方向；exact manifest / variant / ref / confirmation contract pending（MSVC-UP-003） |
| `L2-member` | 宿主内注册 / 心跳合同对端（需求级正式停审） | 协作方 | 运行期（详细合同 pending） | 是 | seam 与 owner 分工正式成立，字段合同 pending（MSVC-UP-002） |
| `L2-runtime` | 宿主承载与入口 surface 协作 | 协作方 / 被依赖方 | 运行期(pending) | 是 | 对端 `Q-L2R-001` 挂起;双侧 pending(MSVC-UP-001) |
| `L4-sandbox` | 宿主隔离绑定能力 | 依赖方 | 运行期 + ref | 是(要求隔离的宿主) | 宿主 binding 失败则 blocked,不 host fallback;逐动作 execute caller 不归本仓(MSVC-UP-004) |
| `L0-bus` | 事件协作主干 | 协作方 | 事件 | 是 | 发布已提交宿主事实;delivery 失败不回滚 truth |
| `L4-observability` | 观测材料交接 | 协作方 | 事件 | 是 | 只输出 body-free 材料 / attempt / gap,不声明 observed |
| 容器运行时 / 编排平台 | 基础设施 | 依赖方 | 基础设施 adapter | 是 | 强阻塞:不可用时新启动 blocked,存量宿主状态显式 unknown / degraded |
| 镜像 registry | 基础设施 | 依赖方 | 基础设施 adapter | 是 | 拉取失败显式分类,不伪装启动成功 |
| `L5-console` / `L5-chat` / `L1-workspace` / `L4-archive` | 下游消费 | 被依赖方 | 下游消费 / 事件候选 | 否 | 未校准;不反向定义本仓 |
| `L2-tools` / `L3-capability-hub` / `L1-artifact` | 边界排除输入 | 无直接依赖边 | — | 否 | tools 的逐动作 Sandbox handoff 不转移给本仓;其余仅用于边界裁剪 |

### 本仓依赖类型分类表(正式 §6.4 候选)

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core`、`L0-sdk` | shared contract 类别;正式客户端合同 / Server 自测试基线(`L0-sdk` 具体 target pending) | 架构 / 详细设计 / 实施计划 |
| 运行期依赖 | `L1-identity`、`L1-work`、`L4-sandbox`、`L2-member`(pending)、`L2-member-images`(pending)、`L2-runtime`(pending) | 事实消费、pinned image ref、宿主 binding、宿主内合同、会话承载 | 架构 / 详细设计 |
| 事件协作依赖 | `L0-bus`、`L1-identity`、`L1-work`、`L1-governance`、`L4-observability` | 订阅身份 / 分配 / policy 事件;发布宿主生命周期事实;观测材料交接 | 需求 / 架构 / 测试 |
| 基础设施 adapter | 容器运行时、镜像 registry | 编排承载与镜像拉取的可替换后端 | 架构 / 详细设计 / 配置 |
| fake seam | 上述 runtime / adapter seam 的受控验证形态 | 只证明语义可控,不证明真实 readiness | 测试方案 |

### 本仓禁止依赖表(正式 §6.5 候选)

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| 本仓 -> 非 `L0-core` / `L0-sdk` sibling 的 Cargo / path / package 依赖 | 运行期 / 事件 seam 不得伪装编译期 | runtime / event / ref / adapter seam |
| `L0-sdk` runtime client / transport 实现进入宿主 domain truth | 全局 compile 基线不等于运行期反向依赖 | 仅在正式编译 / 自测试边界消费;准确 target 由 01 / 03 收敛 |
| 本仓反写 identity / work / governance / runtime / sandbox truth | owner 反转 | 只消费正式事实;反馈以事件 / handoff 交接 |
| `L1-work` / 产品入口 -> 容器运行时直连 | 绕过宿主控制面,边界塌陷 | 一切宿主生命周期经本仓 |
| 本仓 hardcode 或直接重解析 role → image 映射 | 吞并 method-library / member-images truth并形成双路径 | 只消费 member-images 正式 pinned image ref / manifest |
| 本仓自建 policy allowlist / 本地裁决 | 吞并 governance truth | 消费生效结论,unknown fail closed |
| 本仓提交 ToolInvocation 或推进逐动作 Sandbox execute | 吞并 tools execution / runtime progression | 只拥有宿主级 binding / release、装配结果和允许的反馈 refs |
| 容器平台产品概念进入需求 / 对象语义 | 载体反向定义 truth | adapter seam 内消化差异 |

#### 依赖裁剪图: L2-member-service

```text
Global baseline
  |
  | crop only related edges
  v
                       +----------------------+
   [compile]           | L2-member-service    |          [event]
 L0-core / L0-sdk ---->|  host truth +        |<------- L1-governance (policy 事件;
                       |  control plane       |          传递路径 pending)
                       +--+---+---+---+---+---+
                          |   |   |   |   |
        [runtime+event]   |   |   |   |   |  [event]
 L1-identity / L1-work ---+   |   |   |   +---> L0-bus / L4-observability
        [runtime/ref, pending]    |   |         (发布宿主事实 / body-free 材料)
 L2-member-images ---------------+   |
   ^ (method-library 是其定义上游,本仓无直接边) |
        [runtime, pending]            |
 L2-member / L2-runtime --------------+
        [runtime]                     |
 L4-sandbox <-------------------------+  (宿主 bind / release / feedback;
                                           逐动作 execute caller 不归本仓)
        [adapter]
 容器运行时 / 镜像 registry <----------+
        [downstream]
 L5-console / L5-chat  <-------------- 消费 safe view / 事件(不进主链)
```

图示说明:

- 本图只展示 `L2-member-service` 相关依赖,不展示全 27 仓。
- `[compile]` 按全局基线可进入正式编译 / 自测试 dependency;`[runtime]`、`[event]`、`[adapter]` 不得写成 package dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序;`pending` 标注表示合同未闭口,fail-closed 承接。
- `L0-sdk` 按全局矩阵和产品矩阵保留编译 / Server 自测试语义;不得被解释为宿主运行期客户端依赖。

### path dependency 判定结论

| 关联项目 | 依赖类型 | 允许写入 package dependency | 当前处理 |
|---|---|---|---|
| `L0-core` | 编译期 | 是(正式发布 contract) | 后续按实施计划引入 |
| `L0-sdk` | 编译期 / Server 自测试基线 | 是,但准确 dependency target pending | 01 / 03 必须防止 runtime client 反向污染 domain |
| 其余全部 | 运行期 / 事件 / adapter / 下游 | 否 | API / event / ref / adapter / fake seam |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`

(装配时复制 §7 的内部仓依赖表、外部系统依赖表、裁剪表、分类表、禁止表、裁剪图和 path dependency 判定;正文前加一段仓际能力关系短文字:本仓向意图触发方提供编排受理,向宿主内进程提供注册承接,向 Bus / Observability 提供已提交事实;依赖 identity / work / member-images 正式镜像引用 / 容器运行时 / 宿主级 sandbox binding 构成闭环前置。)

## 9. 待确认事项

- MSVC-UP-008:`L0-sdk` 编译期基线已按 authority 恢复;准确 dependency target 与 Server 自测试方式留 01 / 03,不得解释为运行期宿主主链依赖。
- MSVC-UP-003：`L2-member-images` 的 pinned entry 供给方向已正式停审；pinned image ref / manifest / digest / verification refs exact 字段与 confirmation 合同仍待双方闭口。
- MSVC-UP-004:宿主级 SandboxBinding / bind / release / feedback 正向字段与非工具型维护动作 caller 待闭口;逐动作工具 execute 已明确不归本仓。
- MSVC-UP-005:governance 策略传递路径 owner。

## 10. 进入下一步条件

- [x] 内部仓依赖表 / 外部系统依赖表 / 裁剪表 / 分类表 / 禁止表 / 裁剪图 / path dependency 判定齐备,格式合规
- [x] 每条关系有依赖类型与失效后果;闭环前置与非前置区分
- [x] 无角色、接口名、事件 schema、主链步骤混入
- [x] 运行期 / 事件依赖无一暗示可进 package dependency

结论：gate_status = pass。需求级依赖 authority 已收敛；MSVC-UP-003 / 004 / 005 / 008 不阻塞 Step 07 的能力级复核，但阻塞相应字段、caller 与实现依赖形态被声明 ready。
