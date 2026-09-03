# Step 4. 系统边界与上下文

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `system_context` | pass | 中心仓、6 组正式上下文对象、输入 / 输出面和依赖失效上限已明确;图未混入角色、协议或内部模块 | 进入 Step 5 限界上下文与子域划分 | `01_arch_step_03_responsibility_boundary.md`;`../00-需求文档.md` §6/12;全局依赖规则 |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 1~3、架构 SOP Step 4 与书写规范 §4.5 / ASCII 图规范。
- [x] 从正式 00 的仓际能力关系筛选正式上下文对象。
- [x] 将相同性质对象适度聚合,控制主图对象数量。
- [x] 只使用输入 / 输出 / 依赖三类图关系。
- [x] 分别说明输入面、输出面和 dependency unavailable 上限。
- [x] 排除用户角色、文档来源、接口 / event 名、内部上下文和实现组件。
- [x] 核对 sibling / upstream pending 只形成关系上限。
- [x] 完成图格式、owner 和方向自检。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 1~2 | 架构位置、目标、约束和开放条件 |
| Step 3 | 正式职责、非职责、易混淆边界与红线 |
| 正式 00 §6.1~6.6 | 仓际对象、依赖裁剪和失效上限 |
| 正式 00 §12 | 能力级输入 / 输出方向;不继承接口名或协议形态 |
| 全局项目依赖关系与裁剪规则 | 全局层级和对象关系基线 |
| 当前 owner 台账 | 区分 closed boundary、pending exact seam 与 future relation |

## 3. SOP 问题回答

1. 这个仓在全局系统中的位置是什么?

   回答:`L2-member-images` 位于 Layer 3 并行窗口中的镜像资产与构建产物供给边界。它上承 Role mapping、component / seed refs、平台合同和受控构建能力,与 Artifact owner 协作,向 Member Service 提供 pinned 镜像入口;它不进入成员运行或容器生命周期。

2. 有哪些正式上游?

   回答:正式来源包括 `L3-method-library`、`L2-runtime`、`L2-tools`、`L2-member`、正式 seed owner 与正式 Core contract;`L0-bus` 只是条件型入站意图载体;builder / registry / applicable evidence 是外部能力而非 truth owner。

3. 有哪些正式下游?

   回答:当前唯一核心下游方向是 `L2-member-service` 对 pinned instantiable entry 的消费。`L1-artifact` 是双向协作边界而非普通下游;出站 build / publish event 没有 authority。

4. 从外部接收哪些输入面?

   回答:接收 Role mapping 来源、pinned component / extras / base / seed refs、正式 shared contracts、受控构建意图、builder / registry outcome、适用 gate safe conclusions 与正式 Artifact reference / handoff status。

5. 向外部提供哪些输出面?

   回答:向 Member Service 提供 pinned manifest / variant / ref 的能力语义或 conservative gap;向 Artifact owner 交接 image candidate 的语义方向。当前不提供 event output、container state 或产品入口。

6. 哪些对象构成正式上下文边界?

   回答:平台合同 / 事件基础、Method Library、component / seed owners、external build / supply capabilities、Artifact 和 Member Service 六组对象构成核心上下文。Sandbox hardened base、Observability usage summary 和产品层仅为 future / cropped,不进入主图。

7. 依赖失效时如何降级?

   回答:来源或 ref 不可验证时阻断受影响定义 / 装配;builder / registry / evidence / Artifact 不可用时保持 failed / blocked / unknown / gap;consumer seam 不可用不改写 local availability;Bus event lane 不可用时仍保留 nightly 语义。

## 4. 当前材料问题诊断

| 候选上下文对象 / 关系 | 问题 | 当前处理 |
|---|---|---|
| CI、Dockerfile、registry、scanner 各自画成核心系统 | 实现设施压过仓际业务边界 | 聚合为 external build / supply capabilities |
| Runtime / Tools / Member 被画成本仓内部模块 | 物理装配被误解为 owner 转移 | 保持外部 component owners |
| Member Service 被画成本仓部署容器 | 混淆供给方与容器 lifecycle owner | 保持正式下游边界 |
| Artifact 被画成镜像仓内部数据库 | 形成通用制品第二 truth | 保持双向协作对象 |
| Sandbox / Observability / Marketplace 全进主图 | 将 future / cropped 关系误当核心 | 不进入本轮核心上下文图 |
| 画出通知 member-service 的出站 event | MI-UP-009 无 authority | 图中只表达输出面,不声明 event |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前上下文结论 |
|---|---|---|
| 中心对象 | 构建流水线 / registry | 独立镜像资产与供给 truth 仓 |
| 上游 | 工具产品列表 | 正式定义 / component / platform 来源和外部能力 |
| 下游 | 容器、市场、用户入口混排 | 当前只固定 Member Service 消费方向 |
| Artifact | 内部步骤或发布结果 | 独立 owner 的双向 handoff / ref 协作 |
| 事件 | 默认收发 build / publish events | 仅入站条件方向;无出站 authority |
| 失效 | 重试后默认继续 | 按定义 / 装配 / candidate / eligibility / supply 分段 fail closed |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 图中逐个画出所有 repo 与基础设施 | 信息最全 | 超过 7 个关键对象且主线不清 | 不采用 |
| 只画 Method Library -> Images -> Member Service | 极简 | 丢失 component、Artifact 和 build capability 边界 | 不采用 |
| 图中按正式责任组聚合,表中逐对象展开 | 图可读且 owner 完整 | 需要配套表解释 | 采用 |
| 将 Sandbox / Observability 作为当前核心依赖 | 便于预留增强 | 与 current scope / owner 基线冲突 | 不采用 |

## 7. 结构化中间产物

### 7.1 系统上下文图

图类型:系统上下文图

图标题:L2-member-images 正式上下文与输入 / 输出边界

```text
                      +--------------------------------+
                      | Platform contract / event base |
                      | L0-core / L0-bus                |
                      +---------------+----------------+
                                      | input / dependency
                                      v

+----------------------------+  input  +----------------------------+  input  +----------------------------+
| L3-method-library          | ------> | L2-member-images           | <------ | Component / seed owners    |
| Role mapping source        |         | image asset / supply truth |         | runtime/tools/member/seed  |
+----------------------------+         +-------------+--------------+         +----------------------------+
                                                   ^ |
                                      input/dependency| | input / output
                                                   | v
+----------------------------+         +-------------+--------------+
| External build / supply    | ------> | L1-artifact                |
| builder/registry/evidence  |  input  | artifact handoff / ref     |
+----------------------------+         +----------------------------+
                                                   |
                                                   | output
                                                   v
                                      +------------+---------------+
                                      | L2-member-service          |
                                      | pinned entry consumer      |
                                      +----------------------------+
```

说明:

- `L2-member-images` 位于图中央,只拥有镜像域资产、构建候选与供给事实。
- Platform、Method Library、component / seed owners 与 external capabilities 都是输入或依赖对象,但其正文和运行 truth 不转移。
- `L1-artifact` 同时接收 candidate handoff 并提供 formal ref / gap,两域状态分别成立。
- `L2-member-service` 只消费 pinned entry;图不表示 container 已启动、消费已确认或出站事件已发送。
- 该图仅表达本仓与正式上下文对象之间的边界关系与输入 / 输出方向,不表达接口、事件、实现组件或运行时顺序。

### 7.2 上下游与输入 / 输出面

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 / 依赖 | 正式 shared contract | 只有被 Core 正式认定的合同可作为平台级共同语义;MI-UP-004 仍开放。 |
| `L0-bus` | 输入 | 入口 | 获准构建意图载体 | 只固定条件型入站方向;MI-UP-005 未闭口时无 positive event lane。 |
| `L3-method-library` | 输入 | 来源 | RoleDefinition / Role -> variant 来源语义 | Mapping truth 归其所有;本仓只做 body-free 消费绑定与验证。 |
| `L2-runtime` | 输入 | 来源 | Pinned runtime component release | 不接收 loop、checkpoint 或 live memory。 |
| `L2-tools` | 输入 | 来源 | Pinned tools / extras component release | 不接收 tool contract、execution 或 capability registry truth。 |
| `L2-member` | 输入 | 来源 | Pinned member component release | MI-UP-002 未闭口时受影响装配保持 blocked。 |
| 正式 seed owner | 输入 | 来源 | Policy / memory / workspace template ref 与 placement source | MI-UP-006 未闭口时不复制正文或补造 owner。 |
| Builder / scheduler | 输入 | 依赖 | 受控调度与构建执行 outcome | Adapter acceptance 不等于 candidate formation。 |
| Image registry | 输入 | 依赖 | Candidate storage / immutable resolve outcome | Registry presence 不等于 eligibility / availability。 |
| Policy / security authority 与 applicable evidence backend | 输入 | 治理依赖 | Applicable gate set、evidence ref / safe conclusion | Q-MI-004 期间只保留 generic fail-closed。 |
| `L1-artifact` | 输入 / 输出 | 来源 / 消费 | Candidate handoff、formal ref 或 gap | MI-UP-007 未闭口时不得声明 Artifact ref 已签发。 |
| `L2-member-service` | 输出 | 消费 | Pinned manifest / variant / ref 入口或 gap | MI-UP-001 未闭口时不声明 launch / confirmation 成功。 |

### 7.3 依赖失效降级口径

| 对象 / 对象组 | 失效或未闭口 | 架构上限 |
|---|---|---|
| Core contract | image-specific schema 未获认定 | 不建立本地 shadow;使用仓内语义并保留 compile candidate pending |
| Method Library | missing / stale / conflict / unavailable | 受影响 definition / revision blocked;不得 fallback mapping |
| Component / seed owners | missing / mutable / incompatible / unverifiable | Assembly incomplete / blocked;不得猜版本或复制正文 |
| Bus | schema unsupported / unavailable | Event lane rejected / unavailable;nightly intent 语义不受影响 |
| Builder / scheduler | unavailable / failed / unknown | Attempt 保留明确结果;无 candidate / digest |
| Registry | unavailable / ref inconsistent | Candidate storage / publish / resolve blocked;不改写既有本地 history |
| Gate / evidence source | missing / failed / unverifiable | Eligibility blocked / pending;不默认为 not-applicable 或 pass |
| Artifact | handoff pending / rejected / unavailable | Image eligibility 可独立解释;无 formal Artifact ref 声明 |
| Member Service | contract pending / consumer unavailable | Local availability 与 entry 可追;无 launch / confirmation / readiness 声明 |

### 7.4 边界说明

这些对象进入正式上下文,是因为它们分别提供镜像定义来源、静态装配来源、平台合同、外部执行能力、Artifact 协作或唯一核心消费入口。图中聚合对象不会改变各仓 owner,表中已逐一展开其边界。Sandbox hardened base、Observability usage summary 与产品 / marketplace 当前是 future 或 cropped 关系,不进入核心图。用户角色、旧文档、内部语义单元、接口名、event family 和技术产品实现均不属于本章对象。

## 8. 回填草稿

正式 01 §5 回填 §7.1 图、§7.2 表、§7.3 失效上限和 §7.4 边界说明。正式章保留 MI-UP 影响,但不在系统上下文层展开 compile/runtime/event/ref/adapter/fake;该分类由 Step 7 正式收敛。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- MI-UP-001 / 002 / 003 / 005 / 006 / 007 使对应对象关系保持 pending exact seam,但关系方向和 owner 上限可成立。
- MI-UP-008 hardened base、F-MI-E05 usage summary 与 Q-MI-003 backend 产品绑定均不进入 current core 图。
- MI-UP-009 明确排除任何出站 event relation。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 中心仓与关键对象是否清晰、对象数量是否收缩 | pass |
| 图是否只使用正式对象和输入 / 输出 / 依赖关系 | pass |
| 图后是否有 2~5 条说明和限定句 | pass |
| 输入 / 输出面和失效上限是否完整 | pass |
| 是否未写角色、接口 / event 名、内部模块或部署 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 5,不得跳到 Step 6 或修改正式 01。
