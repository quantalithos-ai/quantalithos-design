# 03 · 需要具备的功能(核心能力闭环候选)

> 性质: draft 讨论稿。按"先核心能力闭环、后外围增强"组织;不写 API、DTO、对象字段或实现流程。
> 输入: `01_project_role_and_boundary.md`、`02_interactions_and_dependencies.md`、`L2-runtime` C1~C5 与 `L4-sandbox` C-SBX-1~5 的粒度参照。

---

## 1. 核心能力闭环（审计后候选，5 节点）

```text
宿主意图与执行主语可被安全受理
  -> 宿主装配与隔离就绪可被可靠判定
  -> 注册与运行会话能够稳定可用
  -> 健康、恢复与终止能够受控
  -> 生命周期事实、清理与对账能够闭合
  -> 新的正式意图可以基于已闭合历史再次受理
```

箭头表示能力成立的逻辑依赖,不是调用顺序或实施顺序。

### C-MS-1 宿主意图与执行主语可受理

- **能力成立描述**：正式来源的宿主意图能够被验证、去重并形成显式编排决定。项目型宿主以 `ProjectMemberRef` 为执行主语、以 `GlobalMemberRef` 为身份锚。
- **失败语义**：来源或执行主语不可验证时拒绝 / 等待，不隐式启动；当前版非项目型宿主 fail closed，未来纳入须先重开 MSVC-UP-009。
- **不承担**：分配意图、成员身份与治理裁决 truth。

### C-MS-2 宿主装配与隔离就绪可判定

- **能力成立描述**：宿主实例具有唯一身份；正式 pinned image ref、运行环境需求、可撤销且不复用的凭据以及适用的宿主级 `SandboxBinding` 装配结果共同成立后，host readiness 才可成立。
- **失败语义**：后端不可用、镜像拉取失败、binding 缺失与部分成功必须显式区分，不能写成 ready / active。
- **不承担**：role/image 定义解析、镜像内容、隔离 truth、逐动作 Sandbox execute 与编排后端产品语义。

### C-MS-3 注册与运行会话可用

- **能力成立描述**：宿主内进程以正式凭据注册，形成 endpoint 与 host session 的唯一、可查询、可失效关联；runtime run 只以 ref 关联。
- **失败语义**：凭据无效、重复注册、超时与合同 pending 分别显式处理。
- **不承担**：runtime run truth、member 门面内部和凭据体系 truth。

### C-MS-4 健康、恢复与终止受控

- **能力成立描述**：宿主与会话健康可判定；host / session / backend / unknown 失败分层；恢复、重启、停止或 hold 都由显式决定触发，新实例不改写旧实例历史。
- **失败语义**：心跳抖动不直接等于 crashed；健康状态不得与业务 / runtime 状态混写。
- **不承担**：runtime checkpoint 与内部失败、业务影响判定和观测存储。

### C-MS-5 生命周期事实、清理与对账闭合

- **能力成立描述**：注册失效、宿主停止、宿主级 binding release、资源残留 / 孤儿对账与已提交事实交接都可追溯；attempt / gap 与 delivered / observed 分层。
- **失败语义**：清理失败保留显式残留；交接失败不回滚本地 truth。
- **不承担**：sandbox cleanup truth、bus delivery、observability observed 与下游接受判定。

## 2. 能力节点讨论顺序

C-MS-1 → C-MS-2 → C-MS-3 → C-MS-4 → C-MS-5。该顺序表达能力成立依赖，不是运行调用顺序或实施顺序；正式 Step 07 的结论以 `design-calibration/00_req_step_07_core_capability_loop.md` 为准。

## 3. 外围增强能力(候选,不进核心闭环)

| 能力 | 边界 |
|---|---|
| 宿主与会话状态 safe view(供 console / chat / workspace 消费) | 只读投影,可延迟可重建,不反写 truth |
| 生效策略到宿主的传递路径(待确认 MSVC-UP-005) | 若承担,只拥有传递事实与送达 attempt / gap |
| 宿主容量 / 放置优化、批量启停、多宿主调度 | 优化层,不是闭环前置 |
| forensic 保留窗口与诊断材料交接 | 保留决定归本仓,材料正文归 observability / archive |
| 镜像预热 / warm pool | 性能优化,不改变启动语义 |

## 4. 边界外能力(不进入本仓故事库存)

runtime run / plan / checkpoint；tool execution / ToolInvocation；逐动作 Sandbox execute；capability registry；member 门面内部；镜像构建 / 签名 / BOM；sandbox 隔离边界与 policy enforcement；governance 裁决；identity / work 生命周期；observability backend；产品 UI；容器平台运维本体。

## 5. 全局失败语义要求(候选)

与 runtime / sandbox 口径对齐:invalid、missing、conflict、stale、unavailable、waiting、blocked、rejected、timeout、unknown、duplicate、partial、orphaned、delivery gap 必须可区分,不互相压平;任一上游 seam 未闭口时,受影响能力只能 pending / blocked / fail-closed,不得伪造 ready。
