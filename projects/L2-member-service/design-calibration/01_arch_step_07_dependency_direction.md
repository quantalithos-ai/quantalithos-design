# 01 架构校准 Step 7：依赖方向与层间约束

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 6 completed / pass
> 本步目的：固定内部依赖角色、跨仓依赖类型、倒置边界和禁止依赖，并逐架构单元停审

## 1. Step 内计划

- [x] 读取 flow、台账、Step 5~6 和全局项目依赖裁剪规则。
- [x] 从 A1~A5、S1~S3、P1~P3 推导内部依赖角色与允许方向。
- [x] 逐项裁剪 `L0-core` / `L0-sdk`、L1 / L2 / L4 sibling、Bus 和基础设施关系。
- [x] 区分 compile / runtime / event / ref / adapter / fake seam。
- [x] 为每个架构单元定义允许依赖、禁止依赖和倒置边界。
- [x] 输出内部依赖图、跨仓裁剪图、裁剪表、类型表和禁止依赖表。
- [x] 完成单元停审、跨依赖审计、正式 §8 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 本仓内部层次如何划分

| 架构责任层 / 依赖角色 | 责任 | 依赖方向 |
|---|---|---|
| 外部边界承接角色 | 承接同步输入、异步材料、后台触发与安全输出 | 只能向编排 / 用例承接角色依赖。 |
| 编排 / 用例承接角色 | 协调 A1~A5 的正式用例、提交边界和长时推进 | 只能向核心语义角色及其声明的能力端口依赖。 |
| 核心语义角色 | 承载 A1~A5 不变量、决定、状态边界和 owner 规则 | 只依赖 `L0-core` 正式共享契约类别和本仓内部稳定语义。 |
| 支撑语义角色 | 承载 S1~S3 的资格、能力交接与只读消费语义 | 依赖核心公开语义或正式端口，不反向定义核心。 |
| 本地影子 / 派生角色 | 承载 P1~P3 snapshot / ref / projection | 只读依赖核心 / 支撑输出，不可成为业务写源。 |
| 技术承载角色 | 实现正式状态、事件、外部能力和基础设施端口 | 依赖本仓声明的端口与共享契约；核心不得反向依赖具体产品。 |

`L0-sdk` 的全局 compile 基线只允许进入正式边界 / Server 自测试相关承载，不得进入 A1~A5 核心语义。准确 target 未闭口，因此本步不声明具体 package、crate 或调用面。

### 2.2 允许与禁止的总体方向

- 允许：外部边界 -> 编排 / 用例 -> 核心语义。
- 允许：技术承载实现核心 / 支撑声明的端口，并向内依赖端口契约。
- 允许：本地影子 / 派生只读消费正式 truth 或 safe material。
- 禁止：核心语义直接依赖 sibling 源码、SDK runtime client、消息后端、数据库、容器平台、Sandbox backend 或 registry 产品模型。
- 禁止：投影、adapter、fake、receipt、backend state 或外部 snapshot 反向定义 A1~A5。

### 2.3 哪些外部依赖进入主链

| 判断 | 进入主链的关系 |
|---|---|
| 共享契约 | `L0-core` compile；`L0-sdk` 受限 compile / 自测试基线。 |
| 正式运行来源 | Identity、Work、Member Images、Member、Runtime、Sandbox。 |
| 事件协作 | Bus、Identity / Work 变化材料、本仓生命周期材料、Observability 交接。 |
| 基础设施 | 宿主承载 / 编排能力、镜像 registry。 |
| 只保留间接背景 | Method Library 经 Member Images，不建立直接 Role / image seam。 |
| 明确裁剪 | Tools、Capability Hub、Artifact / Archive、Workspace、产品入口不进入宿主核心运行依赖。 |

Governance policy 事件虽存在于全局矩阵，但当前没有本仓 FR 和 owner 结论，因此只保留为 `MSVC-UP-005` 的未激活全局关系，不进入 A1~A5 主链。

## 3. 当前材料诊断与取舍

| 既有表达 | 问题 | 本步取舍 |
|---|---|---|
| 旧 01 将 Identity / Work / Runtime 等列为源码依赖 | 把运行协作误写为 package dependency | 全部改为 runtime / event / ref seam。 |
| draft 将 `L0-core` 与 `L0-sdk` 都称“唯一 compile 候选” | “唯一”与两项基线矛盾，且 SDK 使用范围未限定 | Core 是核心契约 compile authority；SDK 是受限边界 / 自测试 compile 基线。 |
| 直接依赖容器 SDK / Sandbox SDK | 产品或 sibling 实现会侵入核心 | 经本仓声明的能力端口倒置，技术承载向内依赖。 |
| Method Library 直接解析 | 绕过 Images owner，形成第二映射路径 | 无直接依赖边，只消费 Images 正式 supply。 |
| outbox / repository / handler 作为架构层 | 实现名词冒充依赖角色 | 使用边界、编排、核心、支撑、影子和技术承载角色。 |
| fake 作为默认运行后端 | fake 结果会被误读为集成 ready | fake 只用于受控验证，不能进入生产 truth 或 readiness。 |

## 4. 结构化中间产物

### 4.1 依赖方向图（内部）

```text
      +======================================================+
      |              L2-member-service dependency           |
      |                                                      |
      |   +----------------------------------------------+   |
      |   | 外部边界承接角色                             |   |
      |   +----------------------+-----------------------+   |
      |                          | 允许依赖                   |
      |                          v                           |
      |   +----------------------------------------------+   |
      |   | 编排 / 用例承接角色                          |   |
      |   +----------------------+-----------------------+   |
      |                          | 允许依赖                   |
      |                          v                           |
      |   +----------------------------------------------+   |
      |   | A1~A5 核心语义角色                          |   |
      |   +----------------------+-----------------------+   |
      |                                                      |
      |   S1~S3 / P1~P3 / 技术承载角色经正式端口向内依赖    |
      +==========================+===========================+
                                 | 允许依赖
                                 v
                      +----------+-----------+
                      | L0-core contracts   |
                      +----------------------+
```

图后说明：
- 箭头表示允许的内向依赖，不表示运行调用顺序、数据流或部署拓扑。
- S1~S3、P1~P3 和技术承载角色只能经正式语义 / 端口向内依赖，不能绕过编排边界改写核心。
- `L0-sdk` 不进入核心图，因为其准确 compile target 仅限边界 / 自测试且仍 pending。
- 图不表达代码目录、trait、接口、数据库、消息或 adapter 产品。

### 4.2 层间约束

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 外部边界承接角色 | 编排 / 用例承接；Core / 受限 SDK 边界契约 | 直接写核心状态；直接使用 sibling / backend 私有模型 | 输入必须先形成正式边界语义。 |
| 编排 / 用例承接角色 | A1~A5 核心语义；本仓声明的端口 | 具体数据库、消息、容器、registry、Sandbox 或 sibling 实现 | 只协调用例和提交边界，不让设施定义决定。 |
| A1~A5 核心语义角色 | `L0-core` 共享契约类别；本仓稳定语义 | `L0-sdk` runtime client；所有 sibling 源码；外部产品模型 | host truth owner 必须保持技术中立。 |
| S1~S3 支撑语义角色 | A1~A5 公开语义；正式外部能力端口 | 外部正文；直接覆盖核心；生成 policy / image / isolation truth | 支撑角色只承接、映射或派生。 |
| P1~P3 本地影子 / 派生角色 | 已提交核心 truth；允许 snapshot / ref；派生规则 | 成为命令源；反写核心；补造外部正文或完成状态 | stale / gap / rebuild 必须显式。 |
| 技术承载角色 | 本仓端口、Core 契约、受限 SDK compile target | 决定领域状态；泄漏产品状态机；把 fake 当真实资格 | 产品差异被吸收在端口外。 |

### 4.3 按架构单元组织的依赖规则

| 单元 | 允许依赖 | 禁止依赖 | 倒置 / 外部接入边界 |
|---|---|---|---|
| A1 | Core ref；S1 已收束资格 | Work / Identity 源码或正文；authorization 自裁决 | 主语 / 身份 / 授权经 S1 端口进入。 |
| A2 | A1 决定；S1 资格；S2 能力反馈 | Images / credential / Sandbox / backend 私有模型 | supply、credential、carrier、binding 均经端口。 |
| A3 | A2 实例 / readiness；Member / Runtime 安全 refs | Member 主体、IPC 实现、Runtime run / entry 模型 | register / host-session 正向合同以 placeholder 端口存在。 |
| A4 | A2 / A3 已提交事实；S2 安全反馈 | Runtime recovery、backend / observed truth | 健康信号与处置能力经来源明确的端口。 |
| A5 | A1~A4 已提交事实；S2 / S3 | external cleanup / delivery 模型直接写入 | release / cleanup / handoff 只形成 local result / gap。 |
| S1 | Core refs；外部正式 source boundaries | Role -> image 解析、credential 签发、外部正文 | Identity / Work / Images / credential owner 经独立 seam。 |
| S2 | 本仓能力端口；外部 capability summary | backend 产品状态定义核心；逐动作 Tool execution | carrier / registry / Sandbox 由技术承载实现端口。 |
| S3 | A1~A5 已提交 truth；safe derivation rules | Bus / Observability / downstream 私有模型 | event / material / read view 经输出端口。 |
| P1 | S1 收束后的 snapshot / ref | 外部正文、主语或 supply 第二 truth | resolver / source freshness 通过 S1 控制。 |
| P2 | S2 与 A3~A5 允许 refs / summaries | signal body、run body、capture、resource state truth | 只保存关联和时点摘要。 |
| P3 | S3 的只读派生规则 | 命令、决定或核心状态反写 | 可重建 projection，经消费边界输出。 |

### 4.4 本仓跨项目依赖裁剪表

| 关联项目 / 能力 | 本仓角色 | 依赖类型 | 进入当前主链 | 裁剪理由 / 当前上限 |
|---|---|---|---|---|
| `L0-core` | 依赖方 | compile | 是 | 核心共享契约 authority；专项 schema pending，不本地 shadow。 |
| `L0-sdk` | 受限依赖方 | compile / fake validation support | 是，非核心运行路径 | 遵守全局基线；准确 target / Server 自测试 pending，不进入 A1~A5。 |
| `L1-identity` | 依赖方 | runtime + event + ref | 是 | 提供身份锚 / safe source；不形成源码依赖。 |
| `L1-work` | 依赖方 | runtime + event + ref | 是 | 提供 ProjectMember 主语 / 来源；Work truth 不转移。 |
| `L1-governance` | 未激活协作方 | event + ref | 否，保留 pending | 当前无 policy 传递 FR / owner，不预建路径。 |
| `L2-member-images` | 依赖方 | runtime + ref | 是，positive blocked | 需求级 supply 方向成立；exact handoff pending。 |
| `L2-member` | 协作方 | runtime + event / signal | 是，positive waiting | 需求级 owner 分工成立；字段 / IPC / credential pending。 |
| `L2-runtime` | 协作 / 消费方 | runtime + ref | 是，positive blocked | host session / entry surface pending；不拥有 run truth。 |
| `L4-sandbox` | 依赖 / 协作方 | runtime + ref | 条件性是，positive blocked | required host binding no-fallback；字段 / caller / receipt pending。 |
| `L0-bus` | 协作方 | event | 是 | carrier only；delivery 失败形成 gap，不回滚 truth。 |
| `L4-observability` | 消费方 | event + ref / material | 是，输出边界 | 只消费 body-free material；observed truth 外置。 |
| 宿主承载 / 编排能力 | 依赖方 | adapter | 是 | 物理动作经端口；产品资源状态不定义 host truth。 |
| 镜像 registry | 依赖方 | adapter | 是 | 获取正式 pinned 资产；不可用时 blocked。 |
| `L3-method-library` | 间接来源 | no direct edge | 否 | 只经 Member Images 供给，不建立第二解析路径。 |
| `L2-tools` / Capability Hub | 边界排除 | no direct edge | 否 | 逐动作执行 / registry 不归本仓。 |
| Artifact / Archive / Workspace / 产品入口 | 下游候选 | event / read candidate | 否 | 未校准且不决定核心闭环，不反向定义本仓。 |

### 4.5 依赖类型分类

| 依赖类型 | 允许对象 | 架构口径 | 后续落点 |
|---|---|---|---|
| compile | `L0-core`；受限 `L0-sdk` target | 只有这两类可进入 package dependency 讨论；SDK 精确范围 pending | 概要 / 详细 / 实施 |
| runtime | Identity、Work、Images、Member、Runtime、Sandbox | 通过正式服务 / capability boundary，不源码依赖 | 交互 / 概要 / 详细 |
| event | Bus、上游变化、宿主事实、Observability material | 只传播已提交事实 / safe material，不转移 owner | 交互 / 测试 |
| ref | 所有外部 truth owner | typed ref + resolver / freshness；引用不等于正文归属 | 数据 / 详细 |
| adapter | 宿主承载、registry、Sandbox technical boundary | 吸收产品差异，不取得 authority | 技术选型 / 配置 / 详细 |
| fake | 所有 runtime / event / adapter seam 的受控替身 | 只验证本仓边界和失败语义，不证明真实集成 | 测试 / 实施 |

### 4.6 禁止依赖表

| 禁止依赖 | 原因 | 正确协作方式 |
|---|---|---|
| A1~A5 -> 任一 sibling 源码 / 私有模型 | 会迁移外部 truth 并破坏 Layer 3 并行边界 | runtime / event / ref port |
| A1~A5 -> `L0-sdk` runtime client / server facade | SDK 是客户端封装，不是 host core authority | Core contract + 正式边界；SDK 仅受限 compile / 自测试 |
| A1~A5 -> 数据库 / 消息 / 容器 / registry / Sandbox backend 产品 | 产品状态机会反向定义宿主语义 | 内向端口 + 技术承载角色 |
| 本仓 -> Method Library role / image 直接解析 | 绕过 Images 正式 supply owner | 只消费 Images pinned supply |
| 本仓 -> Tools execute / ToolInvocation / Capability registry | 吞并逐动作执行和能力 truth | Runtime / Tools / Hub 正式边界，本仓无直接主链 |
| P1~P3 -> A1~A5 反写 | snapshot / projection 会成为第二写源 | 只读派生、显式 stale / gap / rebuild |
| fake -> production truth / readiness | 替身不能证明真实 owner、协议和后端资格 | 标记 fake-qualified，等待真实 integration evidence |
| event delivery / observed receipt -> local host truth | 外围状态会覆盖已提交本地事实 | local truth 与 attempt / gap / external status 分层 |

### 4.7 依赖方向图（跨仓裁剪）

```text
                  +--------------------------+
                  | L0-core / limited SDK   |
                  | compile boundaries      |
                  +------------+-------------+
                               |
                               v
                  +------------+-------------+
                  | L2-member-service       |
                  | host control / truth    |
                  +-----------+-------------+
                              |
                  +-----------+-----------+
                  |           |           |
                  v           v           v
        +---------+------+ +--+---------+ +--------------------+
        | sibling/sandbox| | Bus/observe| | host infrastructure|
        | runtime/ref    | | event/mat. | | adapter            |
        +----------------+ +------------+ +--------------------+
```

图后说明：
- 只有 Core 与受限 SDK 基线位于 compile 边界；其余关系均不得转成源码依赖。
- sibling / Sandbox 节点表示多个正式 runtime / ref seam，不表示共享模型或同一合同已经 ready。
- Bus / Observability 只承接 event / material；宿主基础设施只经 adapter 参与。
- Method Library、Tools、Capability 和下游候选被裁剪出主图，其 owner 边界仍由表格保留。

## 5. 依赖方向逐单元停审

| 单元 | 层级清楚 | 允许 / 禁止依赖清楚 | seam 类型正确 | 结果 |
|---|---|---|---|---|
| A1 | 是 | 是 | Core + S1 port | pass |
| A2 | 是 | 是 | internal + S1 / S2 ports | pass |
| A3 | 是 | 是 | Member / Runtime placeholder ports | pass |
| A4 | 是 | 是 | signal / capability ports | pass |
| A5 | 是 | 是 | release / handoff ports | pass |
| S1 | 是 | 是 | runtime / event / ref | pass |
| S2 | 是 | 是 | adapter / runtime / ref | pass |
| S3 | 是 | 是 | event / ref / read | pass |
| P1 | 是 | 是 | snapshot / ref | pass |
| P2 | 是 | 是 | snapshot / ref | pass |
| P3 | 是 | 是 | projection / read | pass |

## 6. 跨依赖边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在反向依赖 | pass | 核心不依赖外部实现，技术承载向内实现端口。 |
| runtime / event 是否误写 package dependency | pass | 所有 sibling 均按 runtime / event / ref 分类。 |
| Core / SDK 是否混层 | pass | Core 可进入核心；SDK 仅受限边界 / 自测试且 exact target pending。 |
| Method / Images 是否形成双路径 | pass | Method 无直接边，只消费 Images supply。 |
| fake / adapter 是否取得 authority | pass | 均明确不证明 truth、integration 或 readiness。 |
| 全局矩阵与本仓裁剪是否冲突 | pass | Governance 全局事件关系保留 pending，但因无 FR 不激活。 |
| 后续概要承接风险 | pass | 端口、技术承载和 package dependency 的落点已分层。 |

## 7. 回填草稿

- 正式 §8 采用内部依赖图、层间约束、跨仓裁剪表、类型表、禁止依赖表和跨仓裁剪图。
- 逐单元停审与跨依赖审计留在 calibration，不挤入正式正文。
- 正式正文必须保留 SDK 受限 compile 与 exact target pending，不能简化成“SDK 是运行主链依赖”。

## 8. Gate 自检

| 检查项 | 结果 |
|---|---|
| 内部层次、允许 / 禁止方向是否明确 | pass |
| 11 个架构单元是否逐项停审 | pass |
| 跨仓依赖是否完整裁剪 | pass |
| compile / runtime / event / ref / adapter / fake 是否分层 | pass |
| 是否存在 unresolved 依赖冲突 | pass |
| 是否允许创建 Step 8 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_08
formal_01_write_allowed = false
```
