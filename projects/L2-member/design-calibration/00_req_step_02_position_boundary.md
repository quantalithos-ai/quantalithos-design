# L2-member 00 需求 Step 2: 本仓定位与边界

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 2 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.2 边界声明表 + 短文字格式) |
| 已读取前序输入 | yes(Step 1 来源分层与污染审计;draft 01 §1~2) |
| 当前模式 | full-restart |
| 进入条件 | Step 1 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| SOP 问题回答 | done | 四项回答 | pass |
| 边界判定口径 | done | 判定表 | pass |
| 诊断(旧定位) | done | 差异表 | pass |
| 设计取舍 | done | 取舍表 | pass |
| 结构化产物 | done | 边界声明表 + 短文字 | pass |
| 回填草稿 | done | 第 2 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- `00_req_step_01_upstream_relation.md` 来源分层与污染审计。
- `draft/01_项目作用与交互对象.md` §1(定位候选)、§2(拥有 / 消费 / 禁止表)。
- L2-runtime 00 §2(其"只消费 / 交接"列已把 member host lifecycle 排除)、01 §4.2(边界红线)。

## 3. SOP 问题回答

1. 本仓一句话定义是什么?

   回答: `L2-member` 是 AI Member 容器内的成员门面真相仓,拥有一个运行态成员实例的对外交互边界——运行态在场语义、入站筛选与受控投递、出站交互决定与发布、成员侧容器内交互语境、成员可见摘要与能力出口。

2. 为什么它需要单独成仓?

   回答: Runtime 正式链已把自己收束为 controlled run truth,并明确不拥有 member host lifecycle、产品入口和事件接入面;若无独立 member 门面,Runtime 将被迫直接承担 Bus / 宿主 / 入站协议适配与风险处理,重新变厚并打穿其边界红线。同时入站筛选结论、出站发布决定这类"交互边界事实"需要唯一 owner,否则会散落在 Runtime、bus 适配层或宿主里形成多真相。

3. 本仓不是什么?

   回答: 它不是推理 / 计划 / 记忆 / checkpoint 的 owner(Runtime),不是工具执行或工具契约仓(Tools),不是 capability registry 或外部 MCP/A2A/API adapter(Capability Hub),不是容器编排 / 注册表 / 健康裁决仓(member-service),不是镜像构建仓(member-images),不是隔离执行仓(Sandbox),不是 approval / policy truth 仓(Governance),不是对话真相仓(Conversation),不是 observability backend(Observability),也不是身份生命周期仓(Identity)。

4. 最容易与哪些相邻仓或概念混淆?

   回答: 与 `L2-runtime` 混淆在"交互边界 truth vs 运行决策 truth";与 `L2-member-service` 混淆在"容器内在场语义 vs 容器外编排与健康裁决";与 `L0-bus` 混淆在"成员侧订阅 / 发布决定 vs 传递 truth";与 `L1-governance` 混淆在"入站筛选结论 vs policy 裁决";与 `L1-conversation` 混淆在"出站发布材料 vs 对话事实"。

## 4. 边界判定口径

| 判定问题 | 落入 member 的情况 | 不落入 member 的情况 |
|---|---|---|
| 它是否决定"什么进入 Runtime 视野" | 订阅范围决定、入站筛选结论、投递决定与记录 | Runtime 对输入的受理 / 处置、bus delivery、policy 裁决 |
| 它是否决定"成员输出以何种形态离开容器" | 出站交互决定、body-free 材料准备、发布尝试 / gap | Runtime outcome truth、delivery / observed、对话 / 制品真相 |
| 它是否表达"这个成员实例当前在场吗" | 本地 presence 状态、启动语境受理、注册请求 / 存活信号 / 状态报告及本地尝试记录 | 容器启停、注册接受、endpoint registry、host session、健康裁决、凭据签发 |
| 它是否说明"谁在执行" | 项目型实例消费 `ProjectMemberRef` 执行主语并关联 `GlobalMemberRef` 身份锚 | ProjectMember / GlobalMember 真相生命周期;以 GlobalMember 或 Workspace view 代替执行主语 |
| 它是否解释"这个成员能承接什么" | 从上游 ref 派生的能力出口安全视图 | ToolDefinition / capability registry / method body truth |
| 它是否属于容器内两进程的交互语境 | member 侧受理 / 拒绝 / 关联 / 背压语义与安全边界 | Runtime run / decision truth;IPC 物理载体选择 |

## 5. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §定位 | "嘴耳门面进程,6 子模块,不做推理决策" | 方向保留(不做推理);但"进程 + 6 子模块"是实现表达,且缺 truth 归属语言,重写为交互边界 truth owner。 |
| 旧 00 §3.2 NG 表 | 非目标只排除 runtime/tools/member-service/images 四项 | 不足;须补 governance / conversation / identity / sandbox / observability / capability-hub 六类 owner 排除。 |
| 旧 01 §4.2 | "外网只 member 可见" | 收紧为:member 不暴露通用外部监听面,也不任意直连 provider / MCP / A2A;Bus、宿主、Runtime 的正式 runtime / event seam 仍允许,外部能力经 Runtime→Tools 链。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| member 定位为"交互边界 truth 仓"(采用) | 与 Runtime 的 truth 分界清晰;筛选 / 投递 / 发布决定有唯一 owner;可审计 | 需要额外表达 truth / snapshot / ref 分层 | 采用 |
| member 定位为"纯转发管道 / 薄代理" | 实现简单 | 筛选结论与发布决定无 owner,审计断链;旧文档已证明此路缺 truth 层 | 不采用 |
| member 合并进 Runtime | 少一个进程 / 仓 | 打穿 Runtime 边界红线(其正式链明确排除协议接入与 host lifecycle);安全预筛与推理混层 | 不采用 |
| member 合并进 member-service | 宿主统一管理 | 容器内交互语境与容器外编排混层;宿主须进入每个容器的数据路径 | 不采用 |

## 7. 结构化中间产物

### 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L2-member` 是 AI Member 容器内的成员门面真相仓,拥有可归属运行态成员实例的本地在场与对外交互边界语义。 |
| 本仓不是什么 | 它不是推理 / 计划 / 记忆仓,不是工具契约或工具执行仓,不是 capability registry 或外部 adapter,不是容器编排仓,不是镜像构建仓,不是隔离执行仓,不是治理裁决仓,不是对话真相仓,不是观测后端,也不是身份生命周期仓。 |
| 边界对象列表 | 仓:`L2-runtime`;仓:`L2-member-service`;仓:`L2-member-images`;仓:`L0-bus`;仓:`L1-governance`;仓:`L1-conversation`;仓:`L1-identity`;仓:`L2-tools`;概念:交互边界事实 vs 运行决策事实;概念:筛选结论 vs 裁决真相 |
| 单独成仓原因 | 平台需要一个独立于运行决策、宿主编排和传递主干的成员交互边界真相,让入站筛选、受控投递、出站发布和在场语义可解释、可追溯且不打穿相邻 owner。 |

### 边界说明短文字(候选)

`L2-member` 需要单独存在,因为 AI Member 容器内"什么进入运行视野、什么以何种形态离开容器、成员是否在场"必须有唯一且可审计的 owner,而 Runtime 正式链已把这些排除在自身边界之外。它最容易与 `L2-runtime` 混淆在"交互边界事实"与"运行决策事实"的分界上,与 `L2-member-service` 混淆在"容器内在场语义"与"容器外编排裁决"的分界上,与 `L0-bus` / `L1-governance` / `L1-conversation` 分别混淆在传递、裁决与对话真相上;这些边界不先分开,后续需求、设计和验收都会串线。

## 8. 回填草稿

见第 7 节边界声明表与短文字;另将第 4 节边界判定口径作为 2.1 小节回填(参照 L1-identity 00 §2.1 的判定口径体例)。

## 9. 待确认事项

- member-service 当前 Step 9 已进一步明确可信注册、endpoint / host session、可用性与健康判定归宿主;字段合同与正式 00 仍受 `L2M-UP-001` 约束。
- 项目型实例的双锚边界成立;非项目型 / personal 执行主语受 `L2M-UP-008` 约束并保持 fail closed。

## 10. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 一句话定义不含实现路径 | pass |
| 未展开依赖 / 闭环 / 功能 / 规则 / 数据 / 接口 | pass |
| 边界对象均标类型且 ≥2 个易混淆边界 | pass |
| 不与 Runtime / 兄弟 / L1 owner 重定义冲突 | pass |
| Step 3 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_03_problem_context
formal_document_write_allowed = false
```
