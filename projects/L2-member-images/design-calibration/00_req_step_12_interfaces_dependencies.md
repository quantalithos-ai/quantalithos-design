# Step 12. 接口与依赖

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_interface_audit` | pass | IF-MI-001~014、IF-MI-E01~E03 与 DEP-MI-001~016 已完成逐节点停审;正式类型、seam、功能 / 数据映射、historical 污染和 pending 审计均通过 | 进入 Step 13 非功能需求 | `00_req_step_06_consumers_dependencies.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_11_data_ownership.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 12 和书写规范 §4.12。
- [x] 复核 Step 6 裁剪表、类型表、禁止表和依赖失效上限。
- [x] 固定接口类型和需求层依赖类型枚举,不自造协议分类。
- [x] 按 C-MI-1 -> C-MI-5 区分对外能力面、输入面、同步 / 异步语义和 pending 上限。
- [x] 为每条接口 / 依赖标出功能和数据来源并执行能力级停审。
- [x] 单列外围增强接口与依赖,不恢复已裁剪主链。
- [x] 对 compile / runtime / event / ref / adapter / fake seam 做一致性审计。
- [x] 后置审计旧 SLA / 包类型 / 工具产品 / 通知接口污染。
- [x] 完成重复边、孤儿接口、缺失协作、类型冲突和协议泄漏审计。
- [x] 形成正式 00 §12 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 6 | 仓际能力关系、依赖裁剪、compile/runtime/event/ref/adapter/fake 分类和失效后果 |
| Step 9 | F-MI-001~015、F-MI-E01~E05 的外部可见能力 |
| Step 10 | owner、no-fallback、no-outbound-event 和 fail-closed 规则 |
| Step 11 | D-MI-001~030、D-MI-E01~E04 的 truth / snapshot / ref / forbidden 边界 |
| pending register | exact route / schema / DTO / event family / adapter contract 均不得在需求层补口 |

## 3. SOP 问题回答

1. 当前讨论哪个核心能力节点?

   回答:按 C-MI-1 到 C-MI-5 串行讨论。每个节点先列本仓对外查询 / 变更 / event input / background task 能力面,再列支撑这些功能的外部依赖边界并立即停审。

2. 本仓对外提供哪些能力级接口?

   回答:提供 variant / 来源、assembly / derivation、build result、provenance / eligibility、availability / handoff 的查询面;提供镜像定义校准、装配 revision、availability publish / rollback / retire 的变更面;提供 nightly / candidate / qualification / Artifact handoff 的后台任务面;仅在 MI-UP-005 闭口后提供入站构建 event 面。

3. 本仓消费哪些能力级输入?

   回答:消费方法库 mapping、L2 component releases、seed template source、nightly / 已授权 build event、builder / registry、正式 policy / evidence safe conclusion、Artifact handoff / consumer ref;向 member-service 供给 pinned entry。Core 只在 image-specific shared contract 正式认定后成为 compile 输入候选。

4. 哪些是同步 / 异步能力边界?

   回答:查询 / 变更只表示 request-result 型能力语义,不锁定 transport;nightly、构建 / qualification / handoff 为 background semantics;Bus 是 conditional asynchronous event input。当前没有获授权 event output。

5. 哪些依赖是输入型,哪些结果是输出型?

   回答:method、component、seed、Core、Bus、builder / registry、policy / evidence 为输入型;Artifact 同时存在 formal ref 输入和 handoff 输出边界;member-service 为输出型 downstream consumption seam。本仓 local truth 不通过依赖方向转移 owner。

6. 如何承接全局依赖类型?

   回答:`L0-core` 仅 compile candidate;method 与 member-service 保留 runtime;Bus 保留 event;component、seed、Artifact 走 ref;builder / registry / evidence 走 adapter;fake 只在后续隔离验证中替代 seam,不成为 production dependency。

7. 是否存在无功能来源的接口或功能缺失外部协作?

   回答:不存在。IF-MI-001~014 覆盖核心功能,IF-MI-E01~E03 覆盖外围功能;DEP-MI-001~016 覆盖 Step 6 保留 / 条件边且均可回指功能。出站 event 因无 authority 被明确排除而非漏项。

## 4. 当前文档问题诊断

| historical / draft 口径 | 问题 | 当前处理 |
|---|---|---|
| member / runtime / tools 分别作为二进制 / Python 包依赖 | 把 artifact consumption 与源码 / package dependency 混为一体 | 统一为正式 component release ref;不锁定介质和语言 |
| method-library / identity 99.9% + 使用锁定版本 | 无 SLA evidence 且 exact surface pending | 保留 runtime + ref 定义来源边界和 fail-closed,移除 SLA |
| registry / CI / Trivy / Grype / cosign 作为直接系统依赖 | 锁定产品并让 adapter 进入 domain truth | 改为 builder / registry / applicable evidence 外部能力依赖 |
| member-service 按 Role 解析并启动 | 形成第二 mapping 路径且吞并容器 lifecycle | 只提供 pinned instantiable entry;exact consumer contract pending |
| 构建后发布通知 | 无 outbound event authority | 不建立 event output;只保留 entry / handoff / gap 能力面 |
| observability / audit 作为当前直接下游 | Step 6 已裁剪 observability backend | 审计查询由本仓提供;observed backend 只作外围 future source |
| 直接写 API、manifest 字段、event schema 或 retry / backlog | 超出需求层 | 只写能力主题、方向、类型和失效上限 |

## 5. 改动前后对比

| 维度 | 旧接口 / 依赖 | 当前 Step 12 结论 |
|---|---|---|
| 对外面 | 上下游名称清单 | 查询 / 变更 / event input / background task 能力面 |
| component | 二进制 / Python 包 | ref seam,介质后移 |
| mapping | 下游直接解析 + 本仓读取 | method 是唯一来源;本仓对下游提供入口 |
| 构建工具 | 产品直连 | adapter seam,domain 语义产品中立 |
| Artifact | registry / 通用制品混用 | formal ref input + handoff output,exact contract pending |
| event | 默认通知 | 只有 conditional input;output 无 authority |
| fake | 未区分 | validation-only seam,不证明 production readiness |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 REST / command / event 名列接口 | 易进入实现 | 提前锁 protocol / DTO 并私造合同 | 不采用 |
| 原样复制 Step 6 仓依赖表 | 快 | 不能回答能力级接口面 | 不采用 |
| 按能力节点列 interface,全仓统一列 dependency boundary | 能避免重复外部边并保持功能追溯 | 需维护 interface / dependency 双映射 | 采用 |
| 将 ref / adapter / fake 塞入规范“全局依赖类型”列 | 表面统一 | 破坏正式枚举 | 不采用;固定列用 compile/runtime/event/不适用,另表记录 seam 分类 |

## 7. 结构化中间产物

### 7.1 类型口径

| 维度 | 正式枚举 / 本项目口径 |
|---|---|
| 接口类型 | 查询接口 / 变更接口 / 事件输入 / 后台任务接口;事件输出当前不成立 |
| 需求层依赖类型 | 定义来源依赖 / 治理结论依赖 / 下游消费依赖 / 外部能力依赖 |
| 全局依赖类型 | 编译期依赖 / 运行期依赖 / 事件协作依赖 / 不适用 |
| seam 分类 | compile / runtime / event / ref / adapter / fake;seam 不是 package dependency 的同义词 |
| request-result 语义 | 只表示有请求与可判断结果,不锁定同步协议或 transport |
| background / event 语义 | 表示异步或任务型能力边界,不锁定 scheduler、queue、event family 或 delivery |

### 7.2 C-MI-1 受控定义接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 交互语义 | 支撑功能 | 当前上限 |
|---|---|---|---|---|---|---|
| `IF-MI-001` | 查询接口 | Variant / persona 定义与来源追溯 | 对外提供镜像域定义、mapping 来源和一致 / gap 结论的安全读取能力。 | request-result | F-MI-001~003 | 不返回 Role / mapping 正文或 exact schema |
| `IF-MI-002` | 变更接口 | 镜像定义与来源校准 | 对外体现基于正式 mapping 建立 / 修订镜像定义并重新判定来源的能力。 | request-result / controlled background | F-MI-001/002 | 不编辑上游 mapping;MI-UP-003 限制 positive adapter |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-001` | 输入 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | runtime + ref | 消费正式 Role -> image variant mapping / source,异常时 fail closed。 | F-MI-001~003 |
| `DEP-MI-002` | 输入 | 外部能力依赖 | `L0-core` | 编译期依赖 | compile | 只有正式认定的 shared contract 才可进入;当前是条件型边界,image-specific schema 未认定时不得本地 shadow。 | F-MI-001~003 的跨仓类型边界 |

节点停审:C-MI-1 的定义查询 / 校准能力与 method runtime/ref 边完整;Core 仅为 conditional compile candidate,未泄漏 API、DTO、snapshot 字段或 path dependency。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 交互语义 | 支撑功能 | 当前上限 |
|---|---|---|---|---|---|---|
| `IF-MI-003` | 变更接口 | Pinned 装配基线与 variant revision 管理 | 对外体现建立完整装配基线、派生 variant 和显式修订的能力。 | request-result / controlled background | F-MI-004~006 | 不定义 component / seed 正文或 version field |
| `IF-MI-004` | 查询接口 | 装配基线与派生历史追溯 | 对外提供 pin、placement、revision、derivation 和 incomplete / gap 语义的安全读取能力。 | request-result | F-MI-004~006 | 不返回外部正文或实现目录 |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-003` | 输入 | 定义来源依赖 | `L2-runtime` | 不适用 | ref | 消费正式 runtime component release ref,不消费 loop / live state 或 sibling source。 | F-MI-004~006 |
| `DEP-MI-004` | 输入 | 定义来源依赖 | `L2-tools` | 不适用 | ref | 消费正式 tools / extras release ref,不拥有 tool contract / execution。 | F-MI-004~006 |
| `DEP-MI-005` | 输入 | 定义来源依赖 | `L2-member` | 不适用 | ref | 消费正式 member component release ref;MI-UP-002 未闭口时受影响装配 blocked。 | F-MI-004~006 |
| `DEP-MI-006` | 输入 | 定义来源依赖 | 正式 seed template owner | 不适用 | ref | 消费 policy / memory / workspace seed template ref 和适用 placement 语境,不复制语义正文。 | F-MI-004/005 |

节点停审:C-MI-2 的装配变更 / 查询能力和四类 ref 输入完整;runtime/tools/member 消费边没有被写成 compile / package dependency,seed owner 仍显式 pending。`gate_status = pass`。

### 7.4 C-MI-3 构建候选接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 交互语义 | 支撑功能 | 当前上限 |
|---|---|---|---|---|---|---|
| `IF-MI-005` | 后台任务接口 | Nightly 构建意图收束 | 对外体现按 ADR-0005 形成、判定并追踪 nightly 构建意图的任务型能力。 | background | F-MI-007 | 不锁定 scheduler / CI 产品或时间配置字段 |
| `IF-MI-006` | 事件输入 | 获准镜像构建事件承接 | 在正式 family / schema 闭口后,承接已验证构建事件并形成接受 / 拒绝 / pending 语义。 | asynchronous event input | F-MI-007 | MI-UP-005;当前 event positive lane unavailable |
| `IF-MI-007` | 后台任务接口 | 构建输入快照与候选交接 | 对外体现固定 attempt 输入、交接 builder 并承接 candidate / failed / unknown 的任务型能力。 | background | F-MI-008/009 | 不拥有 builder / registry truth,不预设 retry / timeout |
| `IF-MI-008` | 查询接口 | Build attempt 与候选结果追溯 | 对外提供 intent、snapshot、attempt 和结果分层的安全读取能力。 | request-result | F-MI-007~009 | 不返回 backend log / job body |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-007` | 输入 | 外部能力依赖 | `L0-bus` | 事件协作依赖 | event | 按需消费已验证镜像构建事件;carrier 不承载 truth,未知输入 fail closed。 | F-MI-007 |
| `DEP-MI-008` | 输入 | 外部能力依赖 | scheduler / builder | 不适用 | adapter | 承载 nightly 调度和构建执行能力;请求 / 交接成功不等于候选成立。 | F-MI-007~009 |
| `DEP-MI-009` | 输入 | 外部能力依赖 | image registry | 不适用 | adapter + ref | 承载候选存储 / 解析能力并返回可验证 ref;backend truth 不反写本仓 outcome。 | F-MI-009 |

节点停审:C-MI-3 的 nightly、conditional event input、candidate background 和结果查询能力完整;Bus / builder / registry 类型与 Step 6 一致,未写 event 名、workflow、job、API、重试或 SLA。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 交互语义 | 支撑功能 | 当前上限 |
|---|---|---|---|---|---|---|
| `IF-MI-009` | 后台任务接口 | Candidate provenance 与 eligibility 评估 | 对外体现绑定 digest / provenance、承接正式适用 gate 并形成 image eligibility 的任务型能力。 | background | F-MI-010~012 | 不锁定 evidence kind / product / threshold |
| `IF-MI-010` | 查询接口 | Provenance、适用门禁与资格追溯 | 对外提供候选来源链、适用 safe conclusions、eligibility 和 Artifact gap 的安全读取能力。 | request-result | F-MI-010~012 | 不返回 evidence / Artifact 正文 |
| `IF-MI-011` | 后台任务接口 | Artifact 正式化 handoff | 对外体现将合格镜像候选交给 Artifact owner 并承接 formal ref / gap 的协作能力。 | background / handoff | F-MI-012 | MI-UP-007;不得假设 handoff 成功或自造 ref |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-010` | 输入 | 治理结论依赖 | 正式 policy / security / governance authority | 不适用 | ref | 提供适用 gate 集合或 safe conclusion;owner / evidence kind 未闭口时保持 pending。 | F-MI-011/012 |
| `DEP-MI-011` | 输入 | 外部能力依赖 | applicable evidence backends | 不适用 | adapter + ref | 仅对正式适用 gate 提供 evidence ref / safe conclusion;backend / key / database truth 外置。 | F-MI-011/012 |
| `DEP-MI-012` | 输入 | 外部能力依赖 | `L1-artifact` | 不适用 | ref | 承接正式 `ConsumableArtifactReference` 与 handoff safe status,不复制 Artifact truth。 | F-MI-012 |
| `DEP-MI-013` | 输出 | 外部能力依赖 | `L1-artifact` | 不适用 | adapter(pending) | 将构建输出作为正式化候选交接给 Artifact owner;exact image handoff contract pending。 | F-MI-012 |

节点停审:C-MI-4 的 qualification / trace / Artifact handoff 能力和 policy / evidence / Artifact 双向边完整;未固定 BOM / scan / sign、Artifact schema、approval route 或 backend API。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 交互语义 | 支撑功能 | 当前上限 |
|---|---|---|---|---|---|---|
| `IF-MI-012` | 变更接口 | 镜像 availability 发布 / 回滚 / 退役 | 对外体现显式改变合格镜像供给可用性并保留历史的能力。 | request-result / controlled background | F-MI-013 | 不定义治理 approval truth、命令名或状态机字段 |
| `IF-MI-013` | 查询接口 | Pinned 可实例化入口解析 | 对外提供与 availability 一致的 manifest / variant / ref 入口语义和 unavailable / gap 结果。 | request-result | F-MI-014 | MI-UP-001;不定义 exact manifest schema 或声明 launch success |
| `IF-MI-014` | 查询接口 | Supply handoff 与 consumer gap 追溯 | 对外提供 local supply、handoff attempt 和 consumer confirmation gap 的分层读取能力。 | request-result | F-MI-015 | 不查询 / 拥有 container live state 或 observed body |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-014` | 输出 | 下游消费依赖 | `L2-member-service` | 运行期依赖 | runtime + ref | 提供 pinned instantiable entry;下游是否解析、升级或实例化不反写本仓 truth。 | F-MI-014/015 |

本节点复用 DEP-MI-009 的 registry adapter/ref 和 DEP-MI-012 的 formal Artifact ref,不重复定义第二条外部能力边。当前不存在 event output;MI-UP-009 只保留开放项,不形成接口或依赖。

节点停审:C-MI-5 的 availability change、pinned entry 和 handoff/gap query 能力完整;member-service 只保留 runtime + ref output seam,未泄漏 container lifecycle、outbound event、route 或 DTO。`gate_status = pass`。

### 7.7 外围增强接口 / 依赖

| 接口 ID | 接口类型 | 名称 | 能力级说明 | 所属能力层级 | 当前上限 |
|---|---|---|---|---|---|
| `IF-MI-E01` | 变更接口 | 多架构 / 收缩 / 加固 variant 增强 | 在正式启用后体现架构适配、收缩装配或加固 base 的显式 variant revision 能力。 | 外围增强能力 | Q-MI-001/002、MI-UP-008 |
| `IF-MI-E02` | 后台任务接口 | 安全变化快速重建 | 在正式授权后让高风险安全变化进入受控重建,不绕过核心 gate。 | 外围增强能力 | 不定义 emergency bypass 或 approval truth |
| `IF-MI-E03` | 查询接口 | Supply usage 安全摘要 | 在增强启用后提供不反写 truth 的只读使用摘要。 | 外围增强能力 | 不形成 observed backend 或 live body |

| 依赖 ID | 方向 | 需求层依赖类型 | 关联方 | 全局依赖类型 | seam | 能力级说明 | 支撑功能 |
|---|---|---|---|---|---|---|---|
| `DEP-MI-015` | 输入 | 定义来源依赖 | `L4-sandbox` / hardened-base authority | 不适用 | ref | 未来只承接获准加固基础镜像 ref,不消费 Sandbox policy / execution truth。 | F-MI-E04 |
| `DEP-MI-016` | 输入 | 外部能力依赖 | authorized usage-summary source | 不适用 | ref / snapshot | 未来只消费不反写的安全 usage summary,不建立 observability backend。 | F-MI-E05 |

外围停审:三个接口和两条条件依赖覆盖五项外围功能;未将 Sandbox / observability 加回当前核心主链。`gate_status = pass`。

### 7.8 正式对外能力接口表

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 查询接口 | `IF-MI-001` Variant / persona 定义与来源追溯 | 安全读取镜像域定义、mapping 来源和一致 / gap 结论。 | 核心闭环能力 |
| 变更接口 | `IF-MI-002` 镜像定义与来源校准 | 基于正式 mapping 建立 / 修订镜像定义并重新判定来源。 | 核心闭环能力 |
| 变更接口 | `IF-MI-003` Pinned 装配基线与 variant revision 管理 | 建立完整装配基线、派生 variant 并显式修订。 | 核心闭环能力 |
| 查询接口 | `IF-MI-004` 装配基线与派生历史追溯 | 读取 pin、placement、revision、derivation 和 gap。 | 核心闭环能力 |
| 后台任务接口 | `IF-MI-005` Nightly 构建意图收束 | 按 ADR-0005 形成和判定 nightly 构建意图。 | 核心闭环能力 |
| 事件输入 | `IF-MI-006` 获准镜像构建事件承接 | 合同闭口后承接已验证构建事件;当前 positive lane pending。 | 核心闭环能力 |
| 后台任务接口 | `IF-MI-007` 构建输入快照与候选交接 | 固定 attempt 输入并承接构建候选或保守结果。 | 核心闭环能力 |
| 查询接口 | `IF-MI-008` Build attempt 与候选结果追溯 | 读取 intent、snapshot、attempt 与结果分层。 | 核心闭环能力 |
| 后台任务接口 | `IF-MI-009` Candidate provenance 与 eligibility 评估 | 形成 provenance、适用 gate 评估和 image eligibility。 | 核心闭环能力 |
| 查询接口 | `IF-MI-010` Provenance、适用门禁与资格追溯 | 读取来源链、适用结论、eligibility 和 Artifact gap。 | 核心闭环能力 |
| 后台任务接口 | `IF-MI-011` Artifact 正式化 handoff | 向 Artifact owner 交接候选并承接 formal ref / gap。 | 核心闭环能力 |
| 变更接口 | `IF-MI-012` 镜像 availability 发布 / 回滚 / 退役 | 显式改变供给可用性并保留变化历史。 | 核心闭环能力 |
| 查询接口 | `IF-MI-013` Pinned 可实例化入口解析 | 提供 manifest / variant / ref 入口语义或 conservative gap。 | 核心闭环能力 |
| 查询接口 | `IF-MI-014` Supply handoff 与 consumer gap 追溯 | 分层读取 local supply、handoff 与 consumer gap。 | 核心闭环能力 |
| 变更接口 | `IF-MI-E01` 外围 variant 增强 | 正式启用后管理多架构 / 收缩 / 加固派生。 | 外围增强能力 |
| 后台任务接口 | `IF-MI-E02` 安全变化快速重建 | 正式授权后进入受控快速重建且不绕 gate。 | 外围增强能力 |
| 查询接口 | `IF-MI-E03` Supply usage 安全摘要 | 增强启用后读取不反写 truth 的安全摘要。 | 外围增强能力 |

事件输出结论:当前无已授权事件输出接口。不得将 availability 变化、Artifact handoff 或 member-service 供给自动写成 event output。

### 7.9 正式外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | 消费正式 Role -> image variant mapping / source。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L0-core` | 编译期依赖 | 仅正式认定 shared contract 可进入;当前 image schema pending。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L2-runtime` | 不适用 | 消费 runtime component release ref。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L2-tools` | 不适用 | 消费 tools / extras release ref。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L2-member` | 不适用 | 消费 member component release ref;shape pending。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | 正式 seed template owner | 不适用 | 消费 seed template ref / placement 语境。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L0-bus` | 事件协作依赖 | 合同闭口后按需消费已验证构建事件。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | scheduler / builder | 不适用 | 承载 nightly 调度与候选构建执行。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | image registry | 不适用 | 承载候选存储和 pinned ref 解析。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | 正式 policy / security / governance authority | 不适用 | 提供正式适用 gate / safe conclusion。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | applicable evidence backends | 不适用 | 提供正式适用 evidence ref / safe conclusion。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-artifact` | 不适用 | 提供 formal consumer ref / handoff status。 | 核心闭环能力 |
| 输出 | 外部能力依赖 | `L1-artifact` | 不适用 | 接收镜像构建输出正式化候选;exact handoff pending。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-member-service` | 运行期依赖 | 消费 pinned instantiable entry;exact contract pending。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L4-sandbox` / hardened-base authority | 不适用 | future hardened-base ref only。 | 外围增强能力 |
| 输入 | 外部能力依赖 | authorized usage-summary source | 不适用 | future safe usage summary only。 | 外围增强能力 |

### 7.10 Seam 分类与功能映射

| seam | 依赖边 | 含义 / 禁止推导 |
|---|---|---|
| compile | DEP-MI-002 | 仅正式 Core shared contract;不得把 pending image schema 本地 shadow |
| runtime | DEP-MI-001、014 | mapping 消费 / downstream supply 语境;不等于 sibling source / package dependency |
| event | DEP-MI-007 | conditional inbound only;无 outbound event authority |
| ref | DEP-MI-001、003~006、009~012、014~016 | 只绑定外部对象 / safe snapshot;不拥有正文或外部生命周期 |
| adapter | DEP-MI-008/009/011/013 | 外部能力产品中立;adapter success 不等于 domain outcome |
| fake | DEP-MI-001~016 的后续验证替身 | 只验证 isolated negative / parity semantics;不得进入 production composition 或证明 readiness |

| 能力节点 | 功能 | 主要数据 | 接口 | 主要依赖 | 结果 |
|---|---|---|---|---|---|
| C-MI-1 | F-MI-001~003 | D-MI-001~005 | IF-MI-001~002 | DEP-MI-001~002 | 全覆盖 |
| C-MI-2 | F-MI-004~006 | D-MI-006~012 | IF-MI-003~004 | DEP-MI-003~006 | 全覆盖 |
| C-MI-3 | F-MI-007~009 | D-MI-013~018 | IF-MI-005~008 | DEP-MI-007~009 | 全覆盖 |
| C-MI-4 | F-MI-010~012 | D-MI-019~025 | IF-MI-009~011 | DEP-MI-010~013 | 全覆盖 |
| C-MI-5 | F-MI-013~015 | D-MI-016/024/026~030 | IF-MI-012~014 | DEP-MI-009/012/014 | 全覆盖且复用边不重复 |
| 外围 | F-MI-E01~E05 | D-MI-E01~E04 | IF-MI-E01~E03 | DEP-MI-015~016 | 条件覆盖 |

### 7.11 跨节点与 historical 审计

| 检查项 | 结果 |
|---|---|
| 是否存在没有功能来源的接口 / 依赖 | 否 |
| 是否存在功能需要外部协作但没有依赖承接 | 否 |
| 同一外部能力是否被多个节点重复定义 | 否;registry / Artifact 在 C-MI-5 明确复用 |
| 依赖类型是否与 Step 6 冲突 | 否;formal global type 与 seam 分类分栏解释 |
| runtime / event / ref / adapter 是否被写成 compile / package dependency | 否 |
| fake 是否被写成 production dependency / readiness | 否 |
| 是否私造 event output、schema、route、DTO、command 或 port | 否 |
| 是否保留旧 SLA、语言 / 包类型、工具产品或 retry / backlog | 否 |

| historical item | 当前处置 |
|---|---|
| member binary、runtime/tools Python package | 改为 DEP-MI-003~005 component release refs,介质不在需求层确定 |
| method / registry 99.9% 与 100% build dependency | 删除无 authority SLA;只保留 fail-closed 边 |
| Trivy / Grype / cosign | 删除产品直连;只有 DEP-MI-011 applicable evidence adapter |
| member-service 按 Role 解析 / 启动 | 改为 IF-MI-013 + DEP-MI-014 pinned entry,容器 lifecycle 外置 |
| 发布通知 / Bus or registry pull 开放题 | 不建立 event output;MI-UP-009 保持 pending |
| observability / audit direct downstream | audit query 留在本仓;observability backend 裁剪,usage summary 仅外围 DEP-MI-016 |

## 8. 回填草稿

正式 00 §12 使用 §7.8 和 §7.9 两张固定结构表,再附 §7.10 的 seam 分类短表。能力接口按 C-MI-1~5 分组,外围单列;正式正文引用 Step 6 的依赖裁剪图,不重新绘制调用链 / 事件链。

正式章节必须明确:

1. request-result / background / event 只表达能力语义,不锁定 transport。
2. formal global type 与 compile/runtime/event/ref/adapter/fake seam 分开记录。
3. 当前无 event output;MI-UP-009 不得被解释为接口候选已就绪。
4. pending external seam 只能支撑 fail-closed 需求,不能证明 integration readiness。

## 9. 待确认事项

| ID | 影响接口 / 依赖 | 当前上限 |
|---|---|---|
| `MI-UP-001` | IF-MI-013/014;DEP-MI-014 | exact member-service contract pending;不声明 launch / consume success |
| `MI-UP-002` | IF-MI-003/004;DEP-MI-005 | member component shape / compatibility surface pending |
| `MI-UP-003` | IF-MI-001/002;DEP-MI-001 | method exact query / snapshot contract pending |
| `MI-UP-004` | DEP-MI-002 | Core image schema pending;compile candidate not active contract |
| `MI-UP-005` | IF-MI-006;DEP-MI-007 | event family / schema pending;positive lane unavailable |
| `MI-UP-006` | DEP-MI-006/010 | seed / policy owner and exact seam pending |
| `MI-UP-007` | IF-MI-011;DEP-MI-012/013 | Artifact handoff condition / schema pending |
| `MI-UP-008` | IF-MI-E01;DEP-MI-015 | future only |
| `MI-UP-009` | event output exclusion | no authority;not an interface |
| `Q-MI-001~002` | IF-MI-E01 | enhancement scope pending |
| `Q-MI-003` | DEP-MI-008/009/011 | product binding delayed to 04 |
| `Q-MI-004` | IF-MI-009/010;DEP-MI-010/011 | evidence kind / authority pending |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 对外能力接口和外部依赖边界是否齐全 | pass |
| 每条接口 / 依赖是否回指能力节点和功能 | pass |
| 正式接口类型 / 依赖类型 / 全局类型是否正确 | pass |
| compile/runtime/event/ref/adapter/fake 是否明确分层 | pass |
| C-MI-1~5 是否逐节点完成接口停审 | pass |
| 是否存在重复边、孤儿接口、缺失协作或类型冲突 | no |
| 是否泄漏 API、DTO、event schema、command、port 或实现流程 | no |
| 是否私造 event output 或 positive integration readiness | no |

`gate_status = pass`;允许创建 Step 13,不得跳到 Step 14 或修改正式 00。
