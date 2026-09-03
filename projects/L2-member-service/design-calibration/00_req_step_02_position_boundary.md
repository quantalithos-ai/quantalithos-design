# Step 02. 本仓定位与边界

## 1. Step 状态

- 状态：[x] 已完成(2026-08-21 状态审计同步)
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 2
- 回填章节：`00-需求文档.md` §2(书写规范 4.2)

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 01 来源映射;draft/01;L4-sandbox §2 / L2-runtime §2 边界结论
- [x] SOP 问题回答：见 §3
- [x] 当前材料 / 旧文档诊断：见 §4
- [x] 设计取舍：见 §6
- [x] 结构化中间产物：见 §7
- [x] 复杂度判断：单 Step 完成;边界判定口径作为附加小节(参照 L1-identity 00 §2.1 先例)
- [x] 回填草稿：见 §8
- [x] 自检与进入下一步条件：见 §9 / §10

## 2. 本步输入

- 上游文档：Step 01 已收敛的来源映射;`L2-runtime/00` §2/§4.2;`L4-sandbox/00` §2;`L1-identity/00` §2;`L1-work/00` §2
- 讨论输入：draft/01 的四语义层(control plane / host truth / runtime session / execution handoff)、不拥有清单、判定口径和单独成仓原因;其结论仍由本 Step 独立收敛
- 依赖的前序 Step：Step 01(pass)

## 3. SOP 问题回答

1. 本仓一句话定义是什么？

   回答：`L2-member-service` 是 AI 成员执行宿主与编排控制面真相仓——拥有成员宿主实例的生命周期、装配结果、注册接入、运行会话、心跳健康、恢复清理事实以及产生这些事实的编排决定。

2. 为什么它需要单独成仓？

   回答：宿主生命周期与编排语义必须在多个上游(identity / work / governance)与多个下游(runtime / member / sandbox / observability / 产品)之间保持唯一。并入任何相邻仓都会破坏已停审边界：runtime 已显式拒绝拥有 member host lifecycle;sandbox 已显式把宿主装配 truth 划出自己;并入 work 会让业务域直接依赖容器基础设施;并入 member 会形成"容器内进程管理容器自身生命周期"的自举悖论。

3. 本仓不是什么？

   回答：它不是运行循环仓(runtime run / turn / decision / checkpoint 归 `L2-runtime`),不是成员门面进程仓(容器内身份卡 / 入站过滤 / IPC 归 `L2-member`),不是镜像内容仓(构建 / 签名 / BOM 归 `L2-member-images`),不是隔离执行仓(隔离边界 / policy enforcement 归 `L4-sandbox`),不是身份真相仓(归 `L1-identity`),不是项目工作事实仓(归 `L1-work`),不是治理裁决仓(归 `L1-governance`),也不是容器编排平台产品本体。

4. 最容易与哪些相邻仓或概念混淆？

   回答：与 `L2-runtime` 混淆在"宿主会话壳 vs 运行内容"边界;与 `L4-sandbox` 混淆在"宿主装配与交接 vs 隔离 truth"边界;与 `L2-member` 混淆在"宿主外控制面 vs 宿主内门面"边界;与 `L1-work` 混淆在"分配意图 vs 宿主实例"边界;与 `L1-identity` 混淆在"身份快照 vs 身份真相"边界;与容器平台混淆在"编排语义 vs 载体产品"边界。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 00 §1 / 旧 README | "编排大脑"定位与 runtime("大脑进程")措辞冲突,且未分层 control plane / host truth / session / handoff | 四类语义压平,后续状态机与失败分类必然混层 |
| 旧 00 §3.2 非目标 | 只有 5 条,缺 sandbox 隔离 truth、observability backend、member 门面内部、governance 裁决、凭据体系等排除项 | 边界不完整,与后停审的 sandbox / runtime 结论脱节 |
| 旧 README "核心组件" | Identity Cache / Policy Proxy / ResolveMemberForContainer 等实现组件直接出现在定位层 | 定位被实现组件反向定义 |
| 旧 01 §5.3 上下文映射 | "member-service 拥有外部健康真相"表述含糊 | 未区分 host failure / session failure / runtime failure 分层 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定义 | "编排大脑,负责启停 / 注册 / 心跳 / 恢复 / policy 下发" | "成员执行宿主与编排控制面真相仓" | 从功能罗列改为真相范围声明;"大脑"措辞让位于 runtime |
| 边界对象 | 隐含在非目标 5 条中 | 显式边界对象列表(8 仓 + 3 概念 + 1 后端) | 书写规范 4.2 固定结构 |
| 语义分层 | 无 | control plane / host truth / runtime session / execution handoff 四层 | 任务边界要求显式区分;防止状态压平 |
| policy 下发 | 写入定位 | 移出定位,挂 MSVC-UP-005 待确认 | owner 未定,不得写成本仓职责 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 定位写成"编排服务"(旧口径) | 直观 | 只表达 control plane,丢 host truth / session / handoff 三层;与 runtime 措辞冲突 | 不采用 |
| 定位写成"执行宿主真相仓"(纯 truth 视角) | truth 边界清晰 | 丢编排决定语义,control plane 决定历史无处安放 | 不采用 |
| "执行宿主 + 编排控制面"双语义定位,附四层区分 | 覆盖 truth 与决定两面;与 sandbox("MemberExecutionHost 归 member-service")和 runtime(拒绝 host lifecycle)双侧结论对齐 | 定义稍长 | 采用 |
| 把 policy 传递写进定位 | 与旧文档连续 | owner 未确认(MSVC-UP-005) | 不采用;留待确认 |

## 7. 结构化中间产物

### 边界声明表(正式 §2 候选)

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L2-member-service` 是 AI 成员执行宿主与编排控制面真相仓,拥有成员宿主实例从编排决定、装配、启动、注册、会话、心跳健康到恢复清理的宿主侧事实。 |
| 本仓不是什么 | 它不是运行循环仓、成员门面进程仓、镜像内容仓、隔离执行仓、身份真相仓、项目工作事实仓、治理裁决仓,也不是容器编排平台产品本体。 |
| 边界对象列表 | 仓：`L2-runtime`;仓：`L2-member`;仓：`L2-member-images`;仓：`L4-sandbox`;仓：`L1-identity`;仓：`L1-work`;仓：`L1-governance`;仓：`L3-method-library`;概念：runtime session(会话壳 vs 运行内容);概念：SandboxBinding 装配结果 vs 隔离 truth;概念：launch credential;后端：容器运行时 / 编排平台 |
| 单独成仓原因 | 宿主生命周期、注册、健康、装配与恢复语义必须在多上游多下游之间唯一;runtime 与 sandbox 的停审文档已从两侧把该真相划归本仓,并入任何相邻仓都会造成 owner 反转或自举悖论。 |

### 边界说明短文字(候选)

`L2-member-service` 需要单独存在,因为"成员拥有一个受控执行宿主"是独立于"成员是谁"(identity)、"成员被分配了什么"(work)、"成员如何思考行动"(runtime)和"执行如何被隔离"(sandbox)的第四类事实。它最容易与 `L2-runtime` 混淆在会话壳与运行内容边界,与 `L4-sandbox` 混淆在宿主装配与隔离真相边界,与 `L2-member` 混淆在宿主外控制面与宿主内门面边界;这些边界不分开,宿主失败、运行失败与隔离失败会被压成一个状态,恢复与审计都无法归责。

### 边界判定口径(正式 §2.1 候选,参照 L1-identity 先例)

| 判定问题 | 落入本仓 | 不落入本仓 |
|---|---|---|
| 是否回答"该成员现在有没有可用执行宿主" | 宿主实例状态、endpoint、健康、会话事实 | 成员是谁(identity);成员在项目里承担什么(work) |
| 是否决定"要不要 / 怎样把成员变成运行实例" | launch / stop / restart / relocate 编排决定与装配输入组织 | 分配意图本身(work);run 内部推进(runtime) |
| 是否描述"宿主里跑的东西怎么想怎么做" | 否 | runtime run / turn / decision / checkpoint |
| 是否定义"宿主里装的是什么" | 否;只消费镜像引用与装配输入 | 镜像内容(member-images);角色映射定义(method-library) |
| 是否执行“受限动作的隔离” | 否；只保存宿主级 binding / release 关联、装配结果与允许的反馈 refs | 逐动作 ToolInvocation / execute（tools / runtime caller）；隔离边界与 enforcement（sandbox） |
| 是否裁决"允许不允许" | 否;fail-closed 消费正式结论 | governance / capability 决策 truth |

### 四语义层区分(正式 §2.2 候选)

| 层 | 含义 | 归属 |
|---|---|---|
| control plane | 编排决定:是否 / 如何启停、装配、恢复 | 本仓 |
| host truth | 宿主实例事实:身份、装配结果(含 SandboxBinding 装配结果)、endpoint、健康、失败分类、清理 | 本仓 |
| runtime session | 宿主与其内 Runtime 运行的会话关联;会话壳归本仓,会话内运行语义归 `L2-runtime` | 分层共存 |
| execution handoff | 宿主级 SandboxBinding 装配、bind / release 关联与允许的反馈归本仓；逐动作 execute caller 归 tools / runtime 正式边界；隔离 truth 归 `L4-sandbox` | 分层共存 |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`

(装配时复制 §7 边界声明表、短文字、判定口径与四层区分;§2 主体为表 + 短文字,判定口径与四层作 §2.1 / §2.2。)

## 9. 待确认事项

- 宿主实例的执行主语不在定位层收敛。Step 07 已确认当前版仅支持项目型宿主：以 `ProjectMemberRef` 为执行主语、以 `GlobalMemberRef` 为身份锚；MSVC-UP-009 已按当前范围闭合。非项目型宿主属于未来扩展，必须先由正式 ADR / 上游合同定义第三种主语并重开 C-MS-1。

## 10. 进入下一步条件

- [x] 3~5 句能说清定位;非职责与边界对象 ≥ 2 个且显式标类型
- [x] 未滑入依赖、闭环、功能、规则、数据归属或接口内容(判定口径与四层区分属边界声明的裁剪依据,不是功能展开)
- [x] 与 runtime / sandbox 停审结论无冲突
- [x] policy 传递未写入定位,保持待确认

结论：gate_status = pass,允许进入 Step 03。
