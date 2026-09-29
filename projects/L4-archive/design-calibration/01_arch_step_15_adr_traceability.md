# 01 架构 Step 15：ADR 与需求追溯

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 15。

### Step 内计划

- [x] 读取 Step 1~14、正式 00 的 A/F/BR/NFR/AC 与 blocker。
- [x] 回答哪些决定值得长期保留、是否有来源与孤儿结论。
- [x] 诊断旧 ADR 索引和旧需求编号污染。
- [x] 按 ADR-AR-001~008 逐决定完成问题、诊断、取舍、结构化与停审。
- [x] 输出需求追溯矩阵、漏项表与跨 ADR 审计。

## 2. SOP 问题回答与历史诊断

值得长期记录的是会持续限定 source authority、Bundle 核心语义、依赖方向、一致性、治理执行和恢复写权的决定；普通语言、数据库、供应商、算法和部署选择不进入 ADR。每项决定必须回指正式 00 的 F/BR/NFR 或 blocker，并回指已停审 U1~U6/Step。

旧 01 的 ADR 索引指向 unrelated draft/legacy 条目，且追溯使用 `US-001/F-001` 等旧编号、填写 `[待]`，无法连接当前 `F-AR-001~009`。本步建立项目内架构决定索引，不新建或伪造全局已批准 ADR 文件，也不赋予 historical ADR 正式地位。

## 3. 逐 ADR 决定校准与停审

### ADR-AR-001 Archive 只拥有归档材料与执行 truth

问题：是否长期影响边界？是，约束 U1~U6 不成为跨域业务 truth 仓。诊断：历史“六域事实 Bundle”会把材料副本变成业务真相。取舍：Archive 拥有 request/bundle/execution/restore-handoff 记录，source business truth 永留 owner。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| Archive local truth 与外部 business truth 严格分离 | F-AR-002~009；BR-AR-004/012 | U1~U6；Step 3/5/8 | snapshot/ref 本地存在不转移 authority |

停审：值得长期保留、有正式来源、无新增对象。`ADR-AR-001 gate = pass`。

### ADR-AR-002 逐 source authority/fence/coverage，不承诺全局快照

问题：为何是架构决定？决定跨域 capture 与一致性主线。诊断：固定六域和全局时间戳无法证明不同 owner 版本可比。取舍：每个 source 独立 binding/status，Bundle 汇总但不压平。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| authority-bound per-source archival material | F-AR-002；BR-AR-001/004/008；AR-UP-001/006~008 | U2；Step 5/8/9 | workspace/audit/artifact ref 不补 canonical 缺口 |

停审：逐 source 失败与 owner 明确；未固化 schema。`ADR-AR-002 gate = pass_with_blockers`。

### ADR-AR-003 Manifest-first closure 与多轴状态

问题：解决什么？防止“有文件/有 hash/上传成功”变成完整归档。诊断：旧 sealed 混合 closure、signature、storage 和业务状态。取舍：manifest/closure 是 U3 核心；integrity、compatibility、storage、handoff 独立判断。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| 请求声明集与实际 material/ref 集合闭包；成功状态分轴 | F-AR-003~006；BR-AR-002/003/005/008 | U3/U4/U5；Step 8/10 | sealed 不推导 verified/durable/archived/restored |

停审：核心语义和来源明确；未把算法写入决定。`ADR-AR-003 gate = pass`。

### ADR-AR-004 外部能力经接缝进入，依赖类型不可混淆

问题：为何长期保留？保护核心不依赖 sibling/provider/client 实现。诊断：旧文档把 SDK、L1、PG、S3、worker 当同层依赖。取舍：只有核验 Core contract 是 compile candidate；其他保持 runtime/event/ref/adapter/fake。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| port-adapter isolation + explicit dependency kinds | BR-AR-012；00 §6/12；AR-ARCH-001 | U1~U6；Step 7/10 | Archive 不源码依赖 L1/L4 sibling 或 SDK client |

停审：依赖裁剪有全局来源；SDK 冲突保持 blocker。`ADR-AR-004 gate = pass_with_blocker`。

### ADR-AR-005 治理 decision truth 与 Archive execution truth 分离

问题：为何独立 ADR？retention/hold/delete/risk 决定直接影响长期存储与销毁安全。诊断：旧 Retention 子域本地定义期限和 purge。取舍：U5 只消费 versioned decision/ref 并拥有执行反馈；缺失/冲突即 blocked。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| governance/明确 owner 决定，Archive 受控执行与留痕 | F-AR-005；BR-AR-006/007/011；AR-UP-003 | U5；Step 3/8/9/12 | 配置不得创造 policy、hold release 或 delete authority |

停审：decision/execution owner 不重叠。`ADR-AR-005 gate = pass_with_blocker`。

### ADR-AR-006 恢复采用 owner-specific material/handoff，无跨域写权

问题：为何长期保留？决定 Restore 的系统边界和安全模型。诊断：旧 pipeline 直接 archived→active 并发布 project.restored。取舍：U6 形成 per-owner plan/material/handoff；receiver 自己校验、接受与提交。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| restore through owner-specific formal receiver | F-AR-007/008；BR-AR-003/007/009/010/012；AR-UP-002/009 | U6；Step 3/5/8/9 | Bundle 不是 import 权限，Archive 不推断 owner committed/restored |

停审：恢复材料与业务提交分离。`ADR-AR-006 gate = pass_with_blockers`。

### ADR-AR-007 后台逐项收敛与 unknown-first reconciliation

问题：解决什么？慢 source、多 owner、storage/handoff 外部副作用与反馈丢失。诊断：旧“失败重试”无 intent/outcome 边界，可能重复副作用。取舍：同步入口仅收口 admission/read，长时工作后台化；commit-unknown 先核对再 retry/compensation。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| per-source/item background convergence and reconciliation | F-AR-002/005/008/009；BR-AR-005/008/010/011；NFR 幂等/可用性 | U2/U4/U5/U6；Step 6/8/9/12 | 局部失败可见，不盲重放可能已提交的外部动作 |

停审：通信、一致性和韧性来源一致；未规定 retry 算法。`ADR-AR-007 gate = pass`。

### ADR-AR-008 版本兼容与未知默认 fail-closed

问题：为何长期保留？历史材料会跨版本和实现阶段存在，unsupported/unknown 不能自动迁移成可信。诊断：旧“versioned schema”是愿望，没有 authority 或失败状态。取舍：所有验证/恢复绑定确定版本语境；unsupported/integrity-failed/unknown 阻断正向推进。

| 决定 | 需求/风险来源 | 已停审单元/Step | 长期边界 |
|---|---|---|---|
| version-aware compatibility gate and fail-closed unknown | F-AR-004/007/009；BR-AR-005/008；AR-UP-004/009 | U4/U6；Step 8/10/12/13 | 不猜兼容、不自动迁移未知 schema、不伪造验证/恢复成功 |

停审：决定是架构守卫，不预设 schema registry 或算法。`ADR-AR-008 gate = pass_with_blockers`。

## 4. 结构化中间产物

### 4.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| F-AR-001 / US-AR-001 | 请求、范围、依据、幂等 admission | U1；同步 admission 与本地 job truth | §4/6/7/10 | accepted 不等于业务批准 |
| F-AR-002 / US-AR-002 | 逐源 owner-approved material/ref、version/fence/coverage | U2；source-authority matrix；per-source consistency | §5/6/9/10 | AR-UP-001/006~008 保持 partial/blocked |
| F-AR-003 / US-AR-003 | manifest 与包内容闭包 | U3；manifest-first closure | §6/9/11 | incomplete/overfull/invalid 不 sealed |
| F-AR-004 / US-AR-004 | digest/signature/schema/version 评估 | U4；多轴 verification/compatibility | §6/9/11/13 | AR-UP-004 未闭合不 verified |
| F-AR-005 / US-AR-005 | location/tier/lifecycle execution | U5；decision/execution 分离与 external commit | §6/9/10/13 | AR-UP-003/005；request 不等 commit |
| F-AR-006 / US-AR-006 | 带 provenance/status 的只读验证 | U3/U4/U5 read composition；同步只读 | §5/9/10/13 | 查询不回源写入或冒充业务查询 |
| F-AR-007 / US-AR-007 | 恢复申请校验和 per-owner plan | U6；version/authority/target gate | §6/9/10/11 | blocked/unsupported/conflicting 保留 |
| F-AR-008 / US-AR-008/009 | owner-specific material 与正式 handoff | U6；receiver-owned commit | §4/5/9/10/11 | AR-UP-002/009；无上游直写 |
| F-AR-009 / US-AR-010 | 逐项结果、重试、核对与补偿 | U6/U5；unknown-first reconciliation | §9/10/11/13 | commit-unknown 先核对 |
| BR-AR-001~004 | binding/closure/sealed/source authority 红线 | ADR-AR-001~003；U2/U3 | §3/4/8/9 | 防止 Bundle/projection 升格 |
| BR-AR-005~008 | 多轴变化、治理、禁止业务决定、未知 fail-closed | ADR-AR-003/005/008；U4/U5 | §3/8/9/13/15 | 不用局部成功推全局成功 |
| BR-AR-009~010 | receiver handoff 与逐 item outcome | ADR-AR-006/007；U6 | §4/9/10/13 | 不压平多 owner 结果 |
| BR-AR-011~012 | 全链路追溯与外部 truth 不拥有 | ADR-AR-001/004/005~007 | §4/8/9/13 | 依赖与证据边界长期受限 |
| 00 §13 NFR | 进度、局部结果、安全、审计、幂等、可观测 | 六类横切约束与 U1~U6 适用矩阵 | §13 | 数值等待 workload/test authority |
| 00 §14/15 | 一票否决与 AR-UP-001~009 | 风险/待确认、fail-closed、完成上限 | §15/16 | 设计通过不等于集成/readiness |

### 4.2 ADR 索引

本表是 L4-archive 项目内架构决定索引；不声明另有已批准 ADR 文件。

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-AR-001 | Archive local truth 与外部 business truth 分离 | 防止 Bundle 成为跨域业务真相 | 职责/子域/数据 | 约束 U1~U6 和所有 snapshot/ref。 |
| ADR-AR-002 | authority-bound per-source material | 防止固定域/全局时间戳制造假快照 | source/data/consistency | 每 source 保留独立 fence/coverage/status。 |
| ADR-AR-003 | manifest-first closure 与多轴状态 | 防止文件存在、签名或上传替代包完整与全局成功 | Bundle/integrity/storage | sealed、verified、durable、business state 分离。 |
| ADR-AR-004 | external seam 隔离与依赖类型分离 | 防止 sibling/provider/client 实现侵入核心 | dependency/technology | 只有核验共享契约可 compile。 |
| ADR-AR-005 | governance decision 与 Archive execution 分离 | 防止本地 retention/purge 侵入治理权 | lifecycle/security/config | 缺 decision 或冲突即 blocked。 |
| ADR-AR-006 | owner-specific restore handoff，无跨域写权 | 防止 Bundle 变成通用恢复写权限 | restore/ownership/interaction | receiver 自己决定 commit/restored。 |
| ADR-AR-007 | 后台逐项收敛与 unknown-first reconciliation | 防止长任务和未知副作用被盲重试/压平 | runtime/consistency/resilience | per-source/item 结果长期可见。 |
| ADR-AR-008 | version-aware gate 与 unknown fail-closed | 防止未知版本被猜测兼容 | compatibility/security/evolution | 不预设产品或算法。 |

### 4.3 漏项与跨决定审计

| 追溯缺口类型 | 对象 | 状态 | 结论 |
|---|---|---|---|
| 功能未承接 | F-AR-001~009 / A1~A9 | 未发现 | U1~U6 与 read composition 全覆盖。 |
| 规则未承接 | BR-AR-001~012 | 未发现 | ADR、红线、数据/交互/横切均有落点。 |
| 架构决定缺来源 | ADR-AR-001~008 | 未发现 | 每项回指 F/BR/NFR/blocker 和已停审单元。 |
| 普通实现选择误入 ADR | language/db/provider/algorithm/deployment | 未进入 | 保持 pending 或下游设计事项。 |
| 外部合同缺口 | AR-UP-001~009、AR-ARCH-001 | open | 不影响保守 01 成文，阻塞相应正向/精确结论。 |
| 运行证据缺口 | implementation/test/bundle/digest/report/signoff | 未产生 | 不属于本轮事实，未填值。 |

八项 ADR 之间无冲突：AR-001/002 定 owner，AR-003 定 Bundle 与状态，AR-004 定依赖进入方式，AR-005/006 分离外部决定/提交，AR-007/008 定失败与演进姿态。没有在矩阵中新增 Step 1~14 未确认的结论。

## 5. 回填、待确认与门禁

正式 §16 承接需求矩阵与漏项边界，§17 承接 ADR 索引。八项决定已逐项停审，跨 ADR/需求审计无内部 unresolved 冲突。`gate_status = pass_with_upstream_blockers`；`formal_01_write_allowed = true_for_step_16_only`；`next_allowed_action = 删除旧 01 后创建 Step 16 并按 18 章重建正式文档`。
