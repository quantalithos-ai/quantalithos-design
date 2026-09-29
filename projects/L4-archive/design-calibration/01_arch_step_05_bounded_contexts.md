# 01 架构 Step 5：限界上下文与子域划分

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 5。

### Step 内计划

- [x] 读取 Step 3/4 与正式 00 A1~A9、数据归属和接口边界。
- [x] 回答核心、支撑与本地引用如何划分，以及为什么不能混为一体。
- [x] 诊断旧材料的 Bundle/Retention/Restore/Compliance 混层。
- [x] 按 U1→U6 逐单元完成问题、诊断、取舍、结构化和停审。
- [x] 完成统一语言、上下文关系图与跨单元冲突审计。

## 2. 本步输入与总问题回答

1. 内部语义单元：请求与作业、来源绑定与采集、Bundle manifest 与闭包、完整性与兼容、存储与生命周期执行、恢复计划/材料/owner handoff。
2. 核心子域：U3 定义可信的归档包边界；U6 定义受控恢复材料交接边界。两者共同构成 Archive 不可替代的“封装历史材料/交回 owner”语义。
3. 支撑子域：U1、U4、U5 分别提供流程协调、可验证性判断和长期承载/治理执行记录。
4. 本地索引/投影/引用：U2 消费外部 authority，只在本地持有 source binding、获准 snapshot/ref 和 capture/coverage 状态。
5. 不能合并原因：请求接受、来源事实、包闭包、密码学/版本判断、存储提交和业务恢复提交具有不同 owner、状态轴和失败上限。

## 3. 历史材料诊断与设计取舍

| 历史划分 | 问题 | 当前取舍 |
|---|---|---|
| Bundle/Retention/Restore/Compliance 四块 | compliance 越权，source/verification/结果语义缺失 | 六单元围绕正式 00 九段能力重新划分 |
| Bundle 是“六域全局事实” | 混淆包真相与业务真相 | U3 只拥有 manifest/closure，不拥有 slice 业务语义 |
| Retention 同时定义 policy 和执行 | 双 owner | U5 只消费 decision 并记录执行 |
| Restore 是跨域状态机 | 将 Archive 变成业务写入协调者 | U6 只管理材料、handoff 与本地 outcome |
| Read/verify 单独建真相域 | 查询面会复制 U3/U4/U5 | 作为跨单元只读组合，不新增第七单元 |

## 4. 逐架构单元校准与停审

### U1 Request & Job Coordination

问题：承载什么？归档/恢复请求、范围与依据、幂等语境、作业阶段和局部终止姿态。非职责是什么？不审批业务归档、不决定项目状态、不产生 source material。

诊断：旧材料以项目 archived/dissolved 自动触发为入口，缺少 request authority 与 rejected/blocked 区分。

取舍：建立显式请求/作业协调单元；不以 owner 事件到达直接等价于获准归档。

| 项 | 结论 |
|---|---|
| 类型 | 支撑子域 |
| 正式作用 | 为 U2~U6 提供可解释范围、依据、幂等与阶段边界 |
| 拥有 | Archive request/job 及其本地状态 |
| 不拥有 | project lifecycle、approval、policy truth |
| 关键关系 | 启动 U2/U6；汇总阶段结果但不压平局部状态 |

单元停审：职责/非职责、owner 和失败上限明确；未把触发当授权。`U1 gate = pass`。

### U2 Source Authority & Capture Binding

问题：承载什么？逐 source owner、material kind/ref、版本/水位、fence、coverage 和 capture 状态。非职责是什么？不解释外部业务语义、不用替代源补齐。

诊断：旧材料固定六域并把 workspace/audit summary 当包切片，无法证明 canonical source。

取舍：每个来源独立 binding；workspace projection、Artifact material/ref 与 audit material 必须显式标类。

| 项 | 结论 |
|---|---|
| 类型 | 本地索引 / 投影 / 引用 |
| 正式作用 | 稳定承接外部 owner-approved material/ref 与覆盖语境 |
| 拥有 | binding、capture attempt、coverage/status 的 Archive 记录 |
| 不拥有 | 被引用/快照化的 owner business truth |
| 关键关系 | 依附 U1 范围；向 U3 提供逐源材料边界 |

单元停审：authority、projection/ref 和本地记录已区分；`AR-UP-001/006/007/008` 保留。`U2 gate = pass_with_blockers`。

### U3 Bundle Manifest & Content Closure

问题：承载什么？Bundle 身份、manifest 声明、slice inventory、material/ref 成员关系和 closure 结果。非职责是什么？不把 manifest 变成业务 schema 或合规声明。

诊断：旧材料把“有六域 + claim + hash”当完整；不能发现请求外、多余、缺失或无来源条目。

取舍：完整性首先是请求声明集合与实际材料集合的闭包；密码学完整性留给 U4。

| 项 | 结论 |
|---|---|
| 类型 | 核心子域 |
| 正式作用 | 定义一份 Archive Bundle 声明什么、实际包含什么、两者是否闭合 |
| 拥有 | Bundle/manifest/inventory/closure truth |
| 不拥有 | slice 的业务 truth、Artifact lineage truth、governance claim |
| 关键关系 | 消费 U2；向 U4/U5/U6 与只读验证提供包边界 |

单元停审：closure 与 digest、storage、business completion 分离。`U3 gate = pass`。

### U4 Integrity & Compatibility Assessment

问题：承载什么？对 manifest/material 的 digest、signature、schema/version 兼容结果与失败历史。非职责是什么？不拥有算法、key/KMS、source schema evolution authority。

诊断：旧材料把“必须签名+哈希”和 100% 通过率当事实，未保留 unknown/unsupported/integrity-failed。

取舍：本单元拥有评估记录，实际计算/验证经外部 seam；未闭合合同不得 verified。

| 项 | 结论 |
|---|---|
| 类型 | 支撑子域 |
| 正式作用 | 独立判断材料是否可验证、是否支持读取/恢复 |
| 拥有 | verification/compatibility result 与 finding history |
| 不拥有 | key、secret、算法目录、外部 signer 或 source schema truth |
| 关键关系 | 消费 U3 与外部验证反馈；约束 U5/U6 正向推进 |

单元停审：多轴状态和 fail-closed 明确；`AR-UP-004` 保留。`U4 gate = pass_with_blocker`。

### U5 Storage & Lifecycle Execution

问题：承载什么？storage location/tier、placement/migration/retrieval/处置 action 及外部反馈。非职责是什么？不拥有对象存储、RetentionPolicy、hold/delete/destruction authority。

诊断：旧 Retention 子域混合规则、scheduler、冷热产品与删除决定，并把上传请求当 durable commit。

取舍：把治理决定作为 ref/guard，把外部设施作为 adapter；本仓只拥有 execution truth 与 unknown。

| 项 | 结论 |
|---|---|
| 类型 | 支撑子域 |
| 正式作用 | 记录 Bundle 在何处、何种层级及正式生命周期动作执行到何状态 |
| 拥有 | location/tier binding、execution record、retrieval/commit status |
| 不拥有 | storage backend truth、policy/hold/delete/risk decision |
| 关键关系 | 消费 U3/U4 与 governance decision；向 U6 提供可取回材料姿态 |

单元停审：policy 与 execution、request 与 commit 已分离；`AR-UP-003/005` 保留。`U5 gate = pass_with_blockers`。

### U6 Restore Planning, Material & Owner Handoff

问题：承载什么？恢复申请校验、per-owner plan、最小材料/ref、handoff、outcome、核对、retry/compensation。非职责是什么？不写 owner 数据库、不决定 owner committed/restored。

诊断：旧 Restore pipeline 直接表达 archived→active，且以统一 completed 压平多 owner partial/unknown。

取舍：每个 owner/item 独立计划和结果；外部副作用未知时先核对，必要时 compensation-required。

| 项 | 结论 |
|---|---|
| 类型 | 核心子域 |
| 正式作用 | 把已验证、可取回的历史材料安全转换为 owner-specific 恢复交接 |
| 拥有 | restore request/plan/material/handoff/outcome/retry/compensation truth |
| 不拥有 | owner import semantics、business commit、project restored state |
| 关键关系 | 消费 U3~U5；通过正式 receiver 对外 handoff |

单元停审：材料交接与业务提交分离；partial/conflicting/commit-unknown 可保留；`AR-UP-009` 保留。`U6 gate = pass_with_blocker`。

## 5. 结构化总览

### 5.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| U1 Request & Job Coordination | 支撑子域 | 承载请求、范围、依据、幂等和作业阶段语义。 | 为 U2~U6 提供流程边界，不替代业务决定。 |
| U2 Source Authority & Capture Binding | 本地索引 / 投影 / 引用 | 承载逐源材料、authority、fence 和 coverage 的本地关系。 | 依附 U1，为 U3 提供有来源的输入。 |
| U3 Bundle Manifest & Content Closure | 核心子域 | 承载归档包声明、成员集合及闭包语义。 | 消费 U2，支撑验证、存储、读取与恢复。 |
| U4 Integrity & Compatibility Assessment | 支撑子域 | 承载完整性和版本可用性判断。 | 消费 U3，约束 U5/U6 的安全推进。 |
| U5 Storage & Lifecycle Execution | 支撑子域 | 承载位置、层级、取回和治理动作执行语义。 | 消费 U3/U4 和外部 decision，支持长期保存/取回。 |
| U6 Restore Planning, Material & Owner Handoff | 核心子域 | 承载按 owner 恢复材料、交接和局部结果。 | 消费 U3~U5，通过 receiver 交回各 owner。 |

### 5.2 上下文关系图

```text
+----------------------+     +----------------------+
| U1 Request / Job     |---->| U2 Source Binding    |
+----------------------+     +----------+-----------+
                                       |
                                       v
                            +----------------------+
                            | U3 Manifest / Closure|
                            +----------+-----------+
                                       |
                         +-------------+-------------+
                         v                           v
              +----------------------+    +----------------------+
              | U4 Integrity /      |--->| U5 Storage /         |
              | Compatibility       |    | Lifecycle Execution  |
              +----------+-----------+    +----------+-----------+
                         |                           |
                         +-------------+-------------+
                                       v
                            +----------------------+
                            | U6 Restore / Handoff |
                            +----------------------+
```

图后说明：

- 图表达语义支撑关系，不表达调用顺序、协议、对象字段或代码模块。
- U3 与 U6 分别守住包闭包和恢复交接两个核心边界；U1/U2/U4/U5 提供必要支撑。
- U6 消费可验证、可取回材料，但不能由 U3~U5 的本地成功推导 owner committed。

### 5.3 统一语言

| 术语 | 唯一解释 |
|---|---|
| Archive request/job | Archive 内部请求与执行协调主语，不是业务批准。 |
| source binding | 对 owner、material/ref、version/fence/coverage 的本地关系。 |
| Archive Bundle | 归档材料边界，不是跨域业务 truth 或写权限。 |
| manifest/closure | 声明集合与实际材料/ref 集合及其闭合判断。 |
| verified | 某次正式完整性验证结果，不代表业务真实性或可恢复成功。 |
| eligible | 收到可解释治理决定后的动作资格，不是 Archive 自行批准。 |
| material-ready | owner-specific 材料可交接，不代表 receiver 已提交。 |
| handoff outcome | Archive 对外部反馈的本地记录，不是 owner business truth。 |

## 6. 跨单元审计、回填与门禁

| 审计项 | 结果 |
|---|---|
| 职责重叠 | U1 管协调、U2 管来源关系、U3 管闭包、U4 管验证、U5 管承载执行、U6 管恢复交接；无重复 owner。 |
| 子域误归类 | 外部来源只在 U2 形成影子；policy/算法/设施/owner commit 未变成本仓子域。 |
| 状态推导冲突 | admission/capture/closure/integrity/storage/handoff 分轴，禁止局部成功推导全局成功。 |
| 功能覆盖 | A1→U1，A2→U2，A3→U3，A4→U4，A5→U5，A6→U3/U4/U5 只读组合，A7~A9→U6。 |
| 外部 blocker | AR-UP-001~009 各有受影响单元，未被本步关闭。 |

正式 §6 承接六单元表、关系图和统一语言；过程诊断与停审只留本文件。全部单元已停审，跨单元审计无 unresolved 内部冲突。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 6 容器/部署架构`。
