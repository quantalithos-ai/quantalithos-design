# 01 · 项目作用与边界

> 性质: draft 讨论稿;full-restart 预讨论产物,不是正式结论。
> 输入: `L2-runtime/00~07`、`L4-sandbox/00~07`、`L1-identity`、`L1-work`、`architecture/仓库拆分方案.md` §5.5、旧本仓文档(仅审计)。

---

## 1. 为什么平台需要这个仓

平台上游已经分别收束了以下事实,但没有任何 owner 负责"让一个 AI 成员真的以受控宿主实例的形态跑起来":

| 已成立的上游事实 | owner | 缺口 |
|---|---|---|
| 成员是谁、全局生命周期(hired / active / paused / retired) | `L1-identity` | 身份变化不会自动变成宿主实例的启动 / 下线 |
| 成员在哪个项目、承担什么(ProjectMember 分配 / 回收) | `L1-work` | 项目分配只是业务事实,不是可连接的运行实体 |
| 成员运行时如何思考与行动(controlled run) | `L2-runtime` | Runtime 明确不拥有 member host lifecycle(其 `NG-L2R-008`);运行循环需要一个宿主承载 |
| 成员容器镜像内容与构建 | `L2-member-images` | 镜像是静态资产,不会自己变成实例 |
| 受控隔离执行 | `L4-sandbox` | sandbox 明确把 `MemberExecutionHost`、`SandboxBinding` 装配 truth、session / worker / health、host failure、callback material 划归 `L2-member-service` |
| 治理策略生效事实 | `L1-governance` | 生效策略需要一条到达运行中宿主的传递路径(传递不是决策) |

如果没有 `L2-member-service`,这些缺口会被下游各自补齐:work 直接调容器 API、runtime 自管宿主、sandbox 被各调用方绕过、镜像映射被 hardcode——正是旧架构反模式"边界塌陷"。因此需要一个独立仓,统一拥有 **成员执行宿主 truth 与编排控制面**。

## 2. 一句话定义(候选)

`L2-member-service` 是 AI 成员执行宿主与编排控制面真相仓:它消费 identity / work 的成员与项目正式事实,拥有成员宿主实例从 launch 意图、装配、启动、注册、会话、心跳健康、运行环境挂载、Sandbox 绑定交接,到重启恢复、下线清理的完整宿主生命周期真相,并把宿主侧执行反馈与观测材料按 body-free 语义交接给下游。

## 3. 四个必须分开的语义层

旧文档把这些压在一起("编排大脑"),full-restart 必须显式分层:

| 层 | 含义 | owner |
|---|---|---|
| **control plane** | 编排决定:该不该为某成员启动 / 停止 / 重启宿主、用什么装配输入、按什么恢复策略处理失败 | 本仓 |
| **host truth** | 宿主实例事实:宿主身份、装配结果(含 `SandboxBinding` 装配结果)、endpoint 注册、心跳 / 健康状态、宿主失败分类、清理事实 | 本仓 |
| **runtime session** | 宿主与其内部 Runtime 运行的会话关联:launch → register → session 建立 → 会话内心跳 / 反馈 → 会话终止;会话事实归本仓,会话内运行语义(run / turn / decision)归 `L2-runtime` | 本仓拥有会话壳,不拥有运行内容 |
| **execution handoff** | 宿主级隔离能力交接：承接 `SandboxBinding` 装配结果、bind / release 关联与允许的 failure / source refs；逐动作 execute caller 不归本仓 | 本仓拥有宿主侧交接记录，不拥有执行动作 |

关键区分:**host failure ≠ business failure ≠ runtime failure**。宿主崩溃是本仓事实;它不改写 run 的 runtime truth(Runtime 用 checkpoint 自行恢复),也不改写 ProjectMember 的 work truth。

## 4. 本仓不是什么(禁止合并的真相)

按任务边界与上游正式文档逐条钉住:

| 不拥有 | owner | 说明 |
|---|---|---|
| LLM loop、goal / plan、memory / checkpoint、run / turn / decision truth | `L2-runtime` | 本仓只提供宿主与会话;重启后 Runtime 从自己的 checkpoint 恢复,本仓不读写 checkpoint 内容 |
| tool execution、ToolDefinition、normalized outcome | `L2-tools` | 宿主不解释工具语义 |
| capability registry、外部 MCP / A2A / API truth | `L3-capability-hub` | |
| member 主体 truth(容器内门面进程的身份卡、入站过滤、IPC) | `L2-member`(并行,pending) | 本仓在宿主外,member 在宿主内;两者以 launch / register / heartbeat 合同交接 |
| 镜像内容、构建、签名、BOM truth | `L2-member-images`(并行,pending) | 本仓只按正式引用选择与拉取镜像,不定义镜像内容 |
| sandbox backend / 隔离边界 / policy enforcement truth | `L4-sandbox` | 本仓只保存宿主级 binding / release 装配结果与允许的交接 refs；不提交 ToolInvocation、不推进逐动作 execute |
| governance approval / policy 决策 truth | `L1-governance` | 本仓最多承担"生效策略到宿主的传递路径",传递事实归本仓,策略内容与生效判定归 governance;是否承担传递路径是待确认项(见 §6) |
| GlobalMember / Role 身份 truth | `L1-identity` | 本仓只消费 ref / safe summary / 事件,可以持有带 freshness 的本地快照,不得成为第二身份真相 |
| ProjectMember / Project / WorkItem truth | `L1-work` | 分配 / 回收是输入意图来源,不是本仓状态机 |
| Role → image variant 定义 truth | `L3-method-library` | 定义正式输出到 member-images；本仓只消费 member-images 提供的 pinned image ref / manifest，不直接重解析映射 |
| observability backend / observed truth | `L4-observability` | 本仓只形成 body-free 材料与 attempt / gap |
| 容器运行时 / 编排平台产品本体(Docker / k8s / …) | 基础设施 adapter | 只能经 adapter seam 进入,不得进入 truth 语义 |

## 5. 与最易混淆边界的判定口径

| 判定问题 | 落入本仓 | 不落入本仓 |
|---|---|---|
| 它是否回答"这个成员现在有没有一个可用的执行宿主" | 宿主实例状态、endpoint、健康、会话 | 成员是谁(identity)、成员在项目里干什么(work) |
| 它是否决定"要不要 / 怎样把成员变成运行实例" | launch / stop / restart / relocate 编排决定与装配输入组织 | 分配意图本身(work)、run 内部推进(runtime) |
| 它是否描述"宿主里跑的东西怎么想、怎么做" | 否 | runtime run / turn / decision / checkpoint |
| 它是否定义"宿主里装的是什么" | 否,只引用镜像与装配输入 | 镜像内容(member-images)、角色映射定义(method-library) |
| 它是否执行"受限动作的隔离" | 否,只交接 | sandbox 隔离 truth |
| 它是否裁决"允许不允许" | 否,只 fail-closed 消费正式结论 | governance / capability 决策 truth |

## 6. 旧材料污染审计(要点)

| 旧口径(位置) | 判断 | 理由 |
|---|---|---|
| "编排大脑"定位(旧 README / 00 / 01) | 废弃措辞,保留问题域 | "大脑"语义与 runtime 冲突;宿主 / 控制面定位更准确 |
| Identity Store 本地副本、Identity Cache(旧 README / 01) | 降级重述 | 可作为带 freshness 的本地快照 / 投影讨论,但"副本 / cache 5min 延迟"这类实现口径与指标无 authority,不继承 |
| Policy Proxy、"30s 内下发"(旧 README / 00) | 阻塞待确认 | 是否由本仓承担 policy 传递路径需与 governance 边界共同确认;数字指标无来源,不继承 |
| Heartbeat 30s × 3 判 crashed、容器保留 10 分钟 forensic(旧 README) | 降级为语义 | "心跳缺失 → 显式健康状态分层"保留为需求语义;具体阈值属配置设计,无当前 authority |
| StartMember P95 < 5s、QPS ≥ 500、并发 ≥ 500、SLA 99.9%(旧 00 / 01) | 废弃 | 无 workload / 测量 authority;full-restart 不继承任何性能数字 |
| launch_token 签发 / 重启重签(旧 README / 00) | 保留问题,owner 待确认 | "宿主启动凭据必须可撤销、不复用"是真实需求;凭据签发 truth 归 identity / governance 还是本仓待确认 |
| Endpoint Registry(member_id → endpoint)(旧 README) | 保留 | 属 host truth 核心;具体存储形态(PG + cache)不继承 |
| Rust + PostgreSQL、目录结构、k8s StatefulSet(旧 README / 01) | 废弃 | 技术栈 / 部署无当前 authority,后续文档按证据决定 |
| "被 work 调用 / 被 chat、console 调用"(旧 README) | 重述为消费边界 | 下游产品未校准,只能记 downstream consumer,不反向定义本仓 |
| ADR-0004("管理 ProjectMember 的容器")(旧 README) | 项目型切片可承接；当前版范围已闭合 | 项目型宿主以 ProjectMemberRef 为执行主语、GlobalMemberRef 为身份锚；Step 07 已选择当前版项目型-only，不直接继承为永恒全局规则，未来非项目扩展须重开 MSVC-UP-009 |

## 7. 单独成仓原因(候选)

宿主生命周期、注册接入、健康判定、装配与恢复语义必须在多个上游(identity / work / governance)与多个下游(runtime / member / sandbox / observability / console)之间保持唯一。它并到任何相邻仓都会破坏边界:并入 runtime 会让运行 truth 与宿主 truth 互相污染(Runtime 已显式拒绝);并入 work 会让业务域直接依赖容器基础设施;并入 sandbox 会让隔离层拥有业务宿主状态(sandbox 已显式拒绝);并入 member 会让容器内进程管理容器自身的生命周期(自举悖论)。
