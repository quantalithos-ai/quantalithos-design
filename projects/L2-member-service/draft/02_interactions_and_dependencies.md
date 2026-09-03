# 02 · 交互关系与依赖裁剪

> 性质: draft 讨论稿。依赖类型与图示格式遵循 `standards/document/全局项目依赖关系与裁剪规则.md` §5 / §6。
> 全局基线引用: `architecture/仓库拆分方案.md` §十一仓间依赖矩阵;`全局项目依赖关系与裁剪规则.md` §4(`L2-member-service` 行: compile = `L0-core` / `L0-sdk`;runtime = L1 identity / work、L4 sandbox、容器运行时;event = 订阅身份、项目成员和 policy 事件)。
> 本文只裁剪本仓相关依赖边,不复制 27 仓总矩阵。

---

## 1. 系统上下文(讨论稿)

```text
                +--------------------+   +--------------------+
                | L1-identity        |   | L1-work            |
                | member truth       |   | project/member     |
                +---------+----------+   +---------+----------+
                          |  身份事实 [event/ref]   |  分配/回收意图 [runtime/event]
                          +-----------+------------+
                                      v
+--------------------+   +==========================+   +--------------------+
| L1-governance      |   |  L2-member-service       |   | L2-member-images   |
| policy effective   |-->|  host truth +            |<--| pinned image ref   |
| [event/ref] 传递待确认 |  control plane           |   | / manifest [pending]|
+--------------------+   +==========================+   +--------------------+
      ^     装配/启动/注册/心跳/恢复    |         |    交接
      |                               |         |
+-----+--------------+   +------------+---+   +-+------------------+
| L2-member-images   |   | member 宿主实例 |   | L4-sandbox         |
| 镜像资产 [ref]      |   | (member+runtime)|   | bind/execute/      |
| (并行,pending)     |   | launch/register |   | release [runtime]  |
+--------------------+   | heartbeat 合同  |   +--------------------+
                         | (并行,pending)  |
                         +----------------+
      材料 / 事件输出:
        L0-bus [event] --> 下游订阅;  L4-observability [event] body-free 材料
      编译 / 自测试基线: L0-sdk(准确 target pending)
      下游消费(不反向定义本仓): L5-console / L5-chat / L2-runtime(入口 pending)
```

图示说明:

- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序。
- `[compile]` 可进入 package dependency;`[runtime]` / `[event]` / `[ref]` / `[adapter]` 不得写成 package dependency。
- member 宿主实例与 member-images 属并行未停审项目,相关合同只能是 pending / placeholder。

## 2. 本仓依赖裁剪表(候选)

| 关联项目 / seam | 全局关系 | 本仓角色 | 依赖类型 | 进入主链 | 裁剪理由 / 未就绪处理 |
|---|---|---|---|---|---|
| `L0-core` | 共享契约来源 | 依赖方 | 编译期 | 是 | shared ID / ref / metadata / error / trace / envelope 类别 authority;唯一 compile 候选之一 |
| `L0-sdk` | 全局矩阵规定为 compile dependency；产品矩阵说明 Server 自测试用途 | 依赖方（编译 / 测试边界） | 编译期（准确 target 待 01/03） | 否（非运行前置） | 保留 authority 基线，但不得让 runtime SDK client 进入宿主 domain truth |
| `L1-identity` | identity 向 member-service / runtime 输出生命周期与能力摘要 | 依赖方 | 运行期 + 事件 + ref | 是 | 消费成员生命周期事件、身份摘要、可运行性信号;不可用时 launch 拒绝 / 等待,已运行宿主保持并显式 stale |
| `L1-work` | 项目成员分配 / 回收意图来源 | 依赖方 | 运行期 + 事件 | 是 | 消费 ProjectMember 事实与生命周期意图;不拥有 work 状态机;意图缺失或冲突时不启动 |
| `L1-governance` | policy 事件订阅(全局矩阵) | 依赖 / 协作方 | 事件 + ref | 是(传递路径待确认) | 消费生效策略事件;若本仓承担"策略到宿主传递",只拥有传递事实;unknown fail closed |
| `L3-method-library` | role → image variant 定义来源 | 间接上游 | 无直接依赖边 | 否（间接） | 当前正式输出到 member-images；本仓不得建立第二映射解析路径 |
| `L2-member-images` | 镜像资产提供方(并行,未停审) | 依赖方 | 运行期 + ref(pending) | 是,pending | 消费正式 pinned image ref / manifest；版本 / digest / 签名 / provenance 合同 placeholder |
| `L2-member` | 宿主内门面进程(并行,未停审) | 协作方 | 运行期(pending) | 是,pending | launch / register / heartbeat / status 合同未闭口;只保留 seam 语义,不定义 member 内部 |
| `L2-runtime` | Runtime 入口 / 会话协作;`Q-L2R-001` 挂起 | 协作方 / 下游消费 | 运行期(pending) | 是,pending | 宿主为 run 提供承载与触发入口 surface;Runtime 侧已把该边界记为待确认,本仓对称记 pending,不替 runtime 定义入口 |
| `L4-sandbox` | 宿主级隔离绑定能力 | 依赖方 | 运行期 + ref | 是（要求隔离的宿主） | binding 不成立时宿主 blocked；本仓只拥有 bind / release 关联与装配结果，逐动作 execute caller 不归本仓 |
| `L0-bus` | 事件协作主干 | 协作方 | 事件 | 是 | 发布已提交宿主生命周期事实,订阅上游事件;delivery 失败不回滚本地 truth |
| `L4-observability` | 观测材料交接 | 协作方 | 事件 + ref | 是 | 只输出 body-free 材料与 attempt / gap,不声明 observed |
| 容器运行时 / 编排平台(Docker / k8s / …) | 基础设施 | 依赖方 | adapter | 是 | 经 orchestrator adapter seam 进入;后端产品差异不进入 truth 语义;不可用时显式 degraded / blocked |
| 镜像 registry | 基础设施 | 依赖方 | adapter | 是 | 拉取失败显式分类,不伪装启动成功 |
| `L5-console` / `L5-chat` / 产品入口 | 下游消费 | 被依赖方 | 下游 runtime | 否(不进主链) | 未校准;只作 safe view 消费候选,不反向定义本仓 |
| `L4-archive` / `L1-workspace` | 下游消费 | 被依赖方 | 事件候选 | 否 | 不进入当前主链 |

## 3. 依赖类型分类表(候选)

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期 | `L0-core`、`L0-sdk` | shared contract 类别；正式客户端合同 / Server 自测试基线（SDK target pending） | 架构 / 详细设计 / 实施计划 |
| 运行期 | `L1-identity`、`L1-work`、`L4-sandbox`、`L2-member`(pending)、`L2-member-images`(pending)、`L2-runtime`(pending) | 事实消费、pinned image ref、宿主 binding、宿主内合同 | 架构 / 详细设计 |
| 事件协作 | `L0-bus`、`L1-identity`、`L1-work`、`L1-governance`、`L4-observability` | 订阅身份 / 分配 / policy 事件;发布宿主生命周期事实;交接观测材料 | 需求 / 架构 / 测试 |
| adapter | 容器运行时、镜像 registry | 编排后端与镜像拉取的可替换承载 | 架构 / 详细设计 / 配置 |
| fake | 上述所有 runtime / adapter seam 的受控验证形态 | 只证明语义可控,不证明 readiness | 测试方案 |

## 4. 禁止依赖表(候选)

| 禁止依赖 | 原因 | 正确协作方式 |
|---|---|---|
| `L2-member-service -> L2-runtime / L2-member / L2-member-images / L4-sandbox` 等运行期 sibling 的 package 依赖 | 运行期 seam 不得伪装编译期；`L0-sdk` 的全局 compile 基线另行受限承接 | runtime / event / ref / adapter seam |
| `L2-member-service` 反写 identity / work / governance / runtime / sandbox truth | owner 反转 | 只消费正式事实,反馈以事件 / handoff 交接 |
| `L1-work` 或产品入口直连容器运行时 API | 边界塌陷,绕过宿主控制面 | 一切宿主生命周期经本仓 |
| 本仓 hardcode 或直接重解析 role → image 映射、或自建镜像内容 | 吞并 method-library / member-images truth并形成双路径 | 只消费 member-images 正式 pinned image ref / manifest |
| 本仓提交 ToolInvocation 或推进逐动作 Sandbox execute | 吞并 tools execution / runtime progression | 只维护宿主级 binding / release、装配结果与允许的反馈 refs |
| 本仓自建 policy allowlist / 本地裁决 | 吞并 governance truth | 消费生效结论,unknown fail closed |
| 本仓保存 runtime checkpoint / memory / 对话正文 / Artifact 正文 / secret 明文 | forbidden body | typed ref / safe summary / redacted marker |
| 容器运行时产品概念(Pod / Deployment / …)进入需求与对象语义 | 载体反向定义 truth | adapter seam 内消化差异 |

## 5. 跨项目 pending / blocker 登记(候选)

进入正式 00 时应在 Step 6 / Step 15 正式登记:

| ID(候选) | 内容 | 对端状态 | 当前口径 |
|---|---|---|---|
| MSVC-UP-001 | Runtime 逻辑入口与宿主触发 / 会话 surface(对应 runtime `Q-L2R-001`) | `L2-runtime` 已停审但把该边界挂起 | 双方 pending;本仓只定义宿主侧 launch / session 语义,不替 runtime 定义 entry |
| MSVC-UP-002 | member 宿主内进程的 launch / register / heartbeat / status 合同 | `L2-member` 未停审 | contract placeholder;不把旧 B4 External RPC 口径当正式合同 |
| MSVC-UP-003 | 镜像引用、版本、签名验证的消费合同 | `L2-member-images` 未停审 | contract placeholder;仅"按正式引用拉取"语义 |
| MSVC-UP-004 | 宿主级 `SandboxBinding` 装配输入、bind / release / failure / cleanup refs 与非工具维护动作 caller | `L4-sandbox` 已停审,正向 schema 属后续闭口项 | 字段合同 pending；逐动作工具 execute 明确不归本仓 |
| MSVC-UP-005 | policy 到宿主的传递路径 owner(是否归本仓) | `L1-governance` 已停审,未指定传递载体 | 待确认;传递事实与策略 truth 分层的前提下讨论 |
| MSVC-UP-006 | launch credential(旧 launch_token)的签发 / 撤销 owner | identity / governance 未显式承接 | 待确认;需求先锁"可撤销、不复用、可审计"语义 |
| MSVC-UP-007 | member-service-specific Core schema / event family | `L0-core` / `L0-bus` 类别 authority 已有,字段未闭口 | 只引用类别,不本地 shadow |
| MSVC-UP-008 | `L0-sdk` 的准确编译依赖 target / Server 自测试方式 | 全局 compile 基线已应用 | 01 / 03 收敛；不得解释为运行期宿主主链依赖 |
| MSVC-UP-009 | 非 ProjectMember-scoped 宿主的正式执行主语与范围 | 当前版范围已闭合 | resolved_for_current_scope；当前版项目型-only，非项目型 launch fail closed；未来纳入须由正式 ADR / 上游合同定义第三种主语并重开 |
