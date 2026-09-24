# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 书写规范：`standards/document/实施计划书写规范.md` §5.5
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §5 实施阶段与依赖顺序
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 5` |
| `current_module` | `implementation_phases_and_dependencies` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_06` |
| `gate_reason` | 已将 Step 4 交付面组织为六个按依赖推进的可验证阶段；每个阶段均有输入、输出、不包含、验证方式、验收映射和停审结论。目标实现仓、技术 authority、外部正向 seam、真实环境与执行实例仍保持 blocked/waiting。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_06_tasks_commit_boundaries.md`；完成后停审 |

本文件只定义阶段顺序和阶段级边界，不定义任务、commit boundary、代码批次、真实命令或执行结果。`PH-01`～`PH-06` 是计划编号，不表示任何 phase 已开工或已通过。

## 2. 本步输入、输出与非目标

### 2.1 本步输入

| 输入 | 本步承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 七逻辑模块、协议/adapter、配置、测试/证据和 handoff 交付面 | 不把交付物清单直接当阶段或源码文件清单 |
| `03-详细设计.md` §4～§16 | 模块依赖、对象/port、11 Command、12 Query、4 Consumer、0 event、5 Job、flow、state、UoW、错误、配置、观测 | 不补 exact SDK、物理 layout、store backend 或 owner schema |
| `04-配置设计.md` §3～§13 | 七配置域、41 项、四 profile、strict source、builder/readiness、failure/change/rollback | 不把 profile 或 marker 当环境/readiness 事实 |
| `05-测试方案.md` §3～§14 | 18 CUT、108 planned TC、12 suite、18 slot、gate、固定 artifact/report 路径 | planned 不等 executed/pass/evidence |
| `06-验收标准.md` §3～§14 | 11 AC、AR/TX/NFA/VETO、entry/exit、fixed-run 和 handoff 语义 | 不生成实际 verdict、signoff 或 readiness |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 阶段阅读矩阵、实现前置 gate、依赖分类和失败处理 | 本步细化读取时机，不解除 blocker |
| 实施计划 SOP/书写规范/可落码标准/台账规范 | phase 可验证增量、停审、依赖、证据和移交规则 | 不把规范要求写成当前执行事实 |

### 2.2 本步输出

- Runner 六阶段依赖图和阶段总表；
- 每个阶段的功能增量、输入、输出、不包含和验证方式；
- 阶段级测试/验收映射、外部依赖和开工阻断条件；
- 每个 phase 的停审记录，以及跨 phase 依赖闭环审计；
- 可回填未来正式 `07` §5 的草稿；
- Step 6 的任务、代码批次和 commit boundary 拆分入口。

### 2.3 非目标

- 不按对象、函数、文件或个人待办拆 phase；
- 不在本步定义 commit message、代码批次、implementation ledger boundary 或具体编码命令；
- 不并行推进 phase；单 agent 串行约束下，辅助脚本/fixture 只能作为后续 phase 的 planned 输入，不能绕过前一 phase gate；
- 不将 semantic fake、controlled fixture、header receipt、local report 或 profile 名称写成真实 owner integration、artifact、evidence 或 release 结果；
- 不提前创建实现仓、代码、测试文件、脚本实例、artifact/report/evidence、正式 `07` 或 implementation ledger。

## 3. SOP 问题回答

| SOP 问题 | Runner 当前回答 | 依据与影响 |
|---|---|---|
| 1. 最小可运行或可测试的纵切是什么？ | 在目标仓和工具 authority 到达后，最小安全纵切是 `PH-01` 的配置/入口/测试证据骨架加 `PH-02` 的 exact context→selection→material negative/semantic flow；它能验证显式选择、authority fail-closed、完整性轴分离和 Query/Command 入口约束，但不声称可下载或可启动真实产物。 | `03` §4～§9、`05` CUT-01/02/10/16、`06` AC-RUN-001～004；目标仓缺失时仅为 planned。 |
| 2. 哪些阶段必须先于其他阶段？ | `PH-01` 必须先于全部阶段；`PH-02` 必须先于运行请求和只读运行视图；`PH-03` 必须先于诊断/交接组合和 Job reconciliation；`PH-04` 必须先于 Consumer/Job 报告和 release handoff；`PH-05` 必须先于 selected integration/release gate。 | 依赖方向来自 `contracts → domain → application → infra`，以及 selection→qualification→request/control→presentation→operations→handoff 的状态/证据顺序。 |
| 3. 哪些风险或跨仓依赖需要前置？ | `RUN-DDD-001~003`、目标仓/语言 authority、local store/cache guarantees、config builder、script/artifact/report roots 和 git/命名检查前置到 `PH-01`；Artifact/Governance seam 前置到 `PH-02` 的 positive slot；Sandbox/Runtime/platform seam 前置到 `PH-03`；Observability seam 前置到 `PH-04`；transport/job runner 与真实 fixed-run/GRC 前置到 `PH-05/06`。 | 依赖缺失时只开启 negative/blocked lane，不把后续 phase 改写为已完成。 |
| 4. 每个阶段完成后能验证什么？ | `PH-01` 验证结构、配置和证据路径红线；`PH-02` 验证 explicit selection、authority、acquisition/integrity/cache 分轴；`PH-03` 验证 request/control、resource/cleanup guard、Unknown freeze/no-replay；`PH-04` 验证 bounded preview/diagnosis/handoff、12 Query no-write；`PH-05` 验证 Consumer header-first、5 Job local-only、event=0 和报告生成能力；`PH-06` 验证条件性 adapter、fixed-run pairing、handoff 与 release gate 入口。 | 每项验证均引用 05/06 现有分母；当前没有真实结果。 |
| 5. 是否存在按对象拆分而不可验证的阶段？ | 不存在。对象、协议和模块只作为 phase 内交付面；phase 以可观察的安全能力和状态/证据边界命名。 | 防止把 17 个对象或 14 个 port 机械拆成不可独立验收的阶段。 |
| 6. 哪些阶段可以并行，哪些不能并行？ | 实施 phase 不并行，严格 `PH-01 → PH-02 → … → PH-06`。同一 phase 内可提前编写“计划性”测试矩阵或文档索引，但不得创建实现、运行 gate 或生成证据；任何辅助工作都必须回到当前 phase gate。 | 遵守本仓 `single-agent-serial` 和 full-restart；避免并行写入导致 phase boundary 漂移。 |
| 7. 每个 phase 是否有明确的功能增量、输入、输出、测试门禁和验收门禁？ | 是。第 7 节逐 phase 给出五项；Step 7 再把 suite、TC、slot、AC、AR/TX/NFA/VETO 展开到更细的门禁。 | Step 5 不替代 Step 7 的测试/验收详细矩阵。 |
| 8. 是否把后续 phase 才能提供的对象、协议、flow、状态或证据提前塞入前一 phase？ | 不允许。前一 phase 只能产生 typed ref、blocked/unknown posture 或 reserved shape；不得要求后续 owner positive、payload、ACK、report、EV detail 或 verdict 才能通过。 | `Consumer positive`、真实 owner readback、release evidence 和 final decision 均保持后置/blocked。 |
| 9. 每个 phase 完成后是否停审？ | 是。第 8 节为六个 phase 分别记录可验证增量、越界、门禁可执行性和设计回写缺口；设计层结论不是执行期 pass。 | 实施期必须在目标仓、design baseline 和 fixed run 存在后重新复核。 |
| 10. 全部 phase 完成后是否通过跨 phase 审计？ | 设计层通过，未发现顺序冲突；但实现移交仍被 `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*` 和缺少 baseline 阻断。 | 第 9 节记录未解除 blocker 和重开条件。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 4 交付面跨越模块、协议、配置、证据和跨仓 seam | 若按交付物逐项排期，会退化为对象/文件清单 | 以安全能力纵切聚合为六个 phase |
| 真实实现仓、语言、store/cache 和 exact SDK 未授权 | 无法写物理开工阶段或具体命令 | `PH-01` 只设核验/阻断门，不伪造实现 |
| `Complete/Verified/Qualified`、`Accepted/Running`、`Confirmed/Cleaned` 分轴 | 早期阶段若混合运行与材料会产生 shortcut | 将 material qualification 放在 PH-02，将 run/control/cleanup 放在 PH-03 |
| Query、Consumer、Job 的 side-effect 红线不同 | 统一放到“集成阶段”会漏掉 no-write/no-ACK/no-owner-repair | PH-04、PH-05 分别形成可验证独立边界 |
| 05/06 的 evidence 计划容易被当作执行结果 | 会产生静态 EV、跨 run 或假 handoff | PH-05 只做脚本能力/最小 index 形状，PH-06 才允许条件性 handoff 草稿 |
| 外部正向 seam 未闭合 | 把跨仓 integration 放在早期会迫使实现者猜 DTO/API | 早期只验证 typed adapter slot 和 fail-closed negative，正向保留 conditional lane |

## 5. 改动前后对比

| 项 | 改动前 | Step 5 收口后 | 原因 |
|---|---|---|---|
| 阶段组织 | 仅有 Step 3 的六阶段骨架 | 六阶段均有依赖、输入、输出、不包含、验证和停审记录 | 让 Step 6/7 可继续下沉 |
| 最小纵切 | 可能被理解为真实可启动链路 | 明确为 semantic/negative context→selection→material 安全纵切 | 不把缺少 owner seam 写成产品 ready |
| 风险前置 | blocker 只在总表中出现 | 每个 phase 标注开工 blocker 和重开条件 | 失败可定位到 phase，不靠实现者现场判断 |
| Query/Consumer/Job | 容易与业务主链混排 | Query no-write 在 PH-04，Consumer/Job/event-zero 在 PH-05 独立收口 | 保留不同 side-effect 红线 |
| evidence/handoff | 可能被放在代码完成后一次性补 | PH-01 建路径合同，PH-05 建生成能力，PH-06 条件性交接 | 区分 script capability、index shell 和真实 handoff |

## 6. 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 按七逻辑模块横向拆 phase | 容易映射模块 | 每 phase 不能独立验证用户能力，且会跨越多个状态轴 | 不采用 |
| 按每个 Command/Query/Job 单独拆 phase | 追踪细 | phase 数量膨胀，UoW、状态和证据门禁被切碎 | 不采用 |
| 按 Runner 用户能力和安全边界聚合六阶段 | 可形成最小纵切，保留 owner/side-effect 红线 | 每阶段内部仍需 Step 6 再拆 boundary | 采用 |
| 先做真实 owner integration 再做本地安全语义 | 可能较早看到端到端效果 | exact seam 未闭合时会猜造、无法 fail-closed | 不采用 |
| 先做 semantic/negative shell，合同到达后启用 conditional positive | 可验证拒绝、状态、边界和无副作用 | 正向运行和发布后置 | 采用 |
| 把 Consumer、Job、报告和 handoff 合成一个尾期大阶段 | 阶段数量少 | no-ACK/no-owner-repair、报告成熟度和 release gate 难独立审查 | 不采用；拆 PH-05 与 PH-06 |
| 允许阶段并行准备 | 可能缩短日历时间 | 违反 single-agent serial，容易修改同一设计边界 | 不采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图：L5-runner 实施阶段顺序

```text
[PH-01 仓/配置/测试/证据前置]
        | enables
        v
[PH-02 context/selection/material qualification]
        | depends_on
        v
[PH-03 request/control/resource/recovery]
        | depends_on
        v
[PH-04 preview/diagnosis/handoff/query]
        | depends_on
        v
[PH-05 consumer/jobs/automation/report]
        | depends_on
        v
[PH-06 selected integration/release handoff]

[RUN-DDD-001..003 + authority]
        | gate
        v
     [PH-01]

[RUN-UP-001..008]
        | conditional_adapter
        v
 [PH-02 .. PH-06]
```

关键说明：
- 图表达阶段依赖、前置 gate 和条件性外部 seam，不表达函数调用链、部署拓扑或已执行结果。
- `PH-02` 只在本地/semantic 语义上形成最小安全纵切；Artifact/Governance 正向读取未闭合时保持 blocked。
- `PH-03` 的运行请求、控制和清理依赖材料资格与保护 guard；`Accepted`、`Confirmed` 仍不升级 owner 生命周期。
- `PH-05` 先形成 negative Consumer、local-only Job 和报告脚本能力；`PH-06` 才能在真实 fixed-run 条件下做 selected handoff。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 可验证实施目标 | 依赖阶段 | 核心交付面（planned） | 计划门禁（planned） | 当前状态 |
|---|---|---|---|---|---|---|
| `PH-01` | 仓、配置、测试与证据前置 | 形成可被后续 gate 定位的目标仓/authority/配置/脚本/路径安全骨架 | 无；受 `RUN-DDD-001~003` gate | target repo/manifest 核验、strict config/builder/readiness 壳、fixture/corpus/manifest、`scripts/gates|checks|reports` 计划根、固定 run/artifact/report 合同 | `S-RUN-CONTRACT`、`S-RUN-CONFIG`、`S-RUN-SECURITY` 的结构入口；`AR-RUN-004/009/010` | `planned / physical_blocked` |
| `PH-02` | Context、显式选择与材料资格 | 建立 trusted context、exact immutable selection、authority posture、acquisition/integrity/cache 分轴 | `PH-01`；Artifact/Governance seam 条件性 | `contracts/domain/application` 相关 context/selection/material、C01～C06、Q01～Q05 的安全 section、generation/qualification/blocked posture | `CUT-01/02/10/13/16`；`S-RUN-CONTRACT/DOMAIN/SERVICE/CONFIG/CONTROLLED`；`AC-RUN-001~004`、`VETO-RUN-001/002/009` | `planned / upstream_blocked` |
| `PH-03` | 请求、控制、资源与恢复 | 建立 qualified binding 后的 run/control/cleanup intent、resource observation、guard、Unknown freeze 和 manual review | `PH-02`；Sandbox/Runtime/platform/store seam 条件性 | C07～C10、Q06～Q08、安全 UoW/idempotency/result、ProtectionGuard、RecoveryCase、J01/J03 所需 basis | `CUT-03~07/11/12/15/18`；`S-RUN-SERVICE/UOW/CONTROLLED/REPLAY/JOB`；`AC-RUN-005~009`、`TX-RUN-001~009`、`VETO-RUN-003/006/007/010` | `planned / external_blocked` |
| `PH-04` | 预览、诊断、交接与 Query/read model | 形成 bounded/redacted safe presentation、12 Query no-write 和 handoff posture | `PH-02`、`PH-03`；Observability seam 条件性 | C11、Q09～Q12、OutputPreview/FailureDiagnosis/HandoffPosture、RunnerReadModel、visibility/freshness/redaction 组合 | `CUT-08~10/17`；`S-RUN-CONTRACT/SERVICE/ENTRY/SECURITY`；`AC-RUN-010/011`、`AR-RUN-002/005/010/015`、`NFA-RUN-005/006` | `planned / observability_blocked` |
| `PH-05` | Consumer、Jobs、自动化与报告能力 | 形成 header-first negative Consumer、5 个 local-only Job、event-zero 检查和同 run 报告生成能力 | `PH-03`、`PH-04`；transport/job runner 条件性 | E01～E04、J01～J05、claim/checkpoint/report、`scripts/checks|reports` capability、最小 evidence-index shell、event/outbox/topic=0 扫描 | `CUT-14/15/18`；`S-RUN-CONSUMER/JOB/REPLAY/SECURITY`、`G-RUN-PR/MAIN/NIGHTLY` 的计划入口；`AR-RUN-006~008`、`TX-RUN-007/008/010`、`VETO-RUN-005/007/011` | `planned / transport_blocked` |
| `PH-06` | Selected integration、release 与 handoff | 在真实 authority、baseline、environment、fixed run 和 review 到达后，启用窄 adapter slot 并生成交接草稿 | `PH-01~PH-05`；`RUN-UP-*`、`RUN-OPS-*`、baseline 条件性 | approved public seam adapter、selected controlled/staging/release run、final report/evidence pairing/handoff draft、open issues/VETO checklist 输入 | `S-RUN-CONTROLLED/E2E`、`G-RUN-CONTROLLED/STAGING/RELEASE`；`06` entry/exit、AC conditional、`VETO-RUN-001~012` | `planned / baseline_blocked` |

六个 phase 的“计划门禁”是未来执行入口，不是当前 pass。任何门禁缺少目标仓、required read、真实 run、artifact/report/check pairing 或外部 authority 时，结果只能是 `blocked / not_run / incomplete`。

### 7.3 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| `PH-01` | 从“无实现仓”到可被后续 gate 定位的配置、脚本、测试和证据路径骨架 | Step 3 前置清单；`03` §3～§4；`04` §3～§12；`05` §8～§9；`06` §3～§4；目标仓/authority（当前缺失） | planned target-repo/manifest 核验、strict config/builder/readiness 入口、fixture/corpus/manifest 约定、固定 path 参数合同和结构扫描入口 | 业务对象、owner adapter、真实下载/启动、数据库/cache backend、artifact/report/evidence 实例 | 未来执行 `S-RUN-CONTRACT/CONFIG/SECURITY` 结构切口及目录/依赖/路径检查；当前 `blocked/not_run` |
| `PH-02` | 建立 trusted context、exact immutable selection，并将取得、完整性、资格、cache posture 分轴 | PH-01 结构；`03` §5～§9/§13；`05` CUT-01/02/10/13/16；`06` AC-RUN-001～004 | context/selection/material semantic contracts、C01～C06、Q01～Q05 safe sections、generation/authority/qualification negative posture | Sandbox request/control、owner running、cleanup、Consumer payload、Job repair、真实 Release bytes 或签名算法选择 | `S-RUN-CONTRACT/DOMAIN/SERVICE/CONFIG/CONTROLLED` 的 negative/semantic cases；同一阶段的 AC/VETO 只生成 planned mapping |
| `PH-03` | 在 qualified binding 之后建立 run/control/cleanup intent、resource observation、ProtectionGuard、Unknown freeze 和 manual review | PH-02 qualified/blocked posture；`03` §8～§12；`05` CUT-03～07/11/12/15/18；`06` AC-RUN-005～009、TX-RUN-001～009 | C07～C10、Q06～Q08、安全 UoW/idempotency/stored-result、RecoveryCase、J01/J03 basis 和 no-replay posture | 把 ACK/PID/port 当 Running、把 control confirmed 当 Cleaned、owner repair、自动 replay/resend/reclaim/resume | `S-RUN-SERVICE/UOW/CONTROLLED/REPLAY/JOB` 的 controlled negative cases；Sandbox/Runtime/platform positive 未闭合则 blocked |
| `PH-04` | 形成 bounded/redacted preview、diagnosis、handoff posture 和 12 Query zero-write read model | PH-02/PH-03 safe sections；`03` §5～§8/§14；`04` §7～§11；`05` CUT-08～10/17；`06` AC-RUN-010/011、AR-RUN-002/005/010/015 | C11、Q09～Q12、OutputPreview/FailureDiagnosis/HandoffPosture、RunnerReadModel、visibility/freshness/source/redaction mapping | raw body/secret/path、formal evidence/report/verdict、Query refresh/reconcile/probe/cleanup/Job dispatch、Observability private implementation | `S-RUN-CONTRACT/SERVICE/ENTRY/SECURITY`；Query write audit、forbidden-field scan、bounded/blocked/restricted views |
| `PH-05` | 形成 header-first negative Consumer、五个 local-only Job、event-zero 扫描和同 run 报告生成能力 | PH-03/PH-04 contracts；`03` §7～§9/§12/§14；`05` §9/§13/§14；`06` §7/§10/§12；transport/job runner（当前缺失） | E01～E04 negative receipts、J01～J05 claim/checkpoint/report、script/check/report capability、最小 evidence-index shell、event/outbox/topic=0 检查 | Consumer payload parse/hash/store/ACK/owner cursor、Job owner repair/replay/reclaim、最终 EV detail、真实 acceptance verdict | `S-RUN-CONSUMER/JOB/REPLAY/SECURITY` 和 `G-RUN-PR/MAIN/NIGHTLY` 的 planned entry；当前不得执行或宣称 pass |
| `PH-06` | 在真实 authority、baseline、环境、fixed run 和 review 到达后启用窄 adapter slot，生成 selected integration/release handoff 草稿 | PH-01～PH-05 planned outputs；`03` §13～§16；`04` §9～§13；`05` §8～§14；`06` §3～§14；`RUN-UP-*`/`RUN-OPS-*` | typed public SDK/API adapter、selected controlled/staging/release run、same-run report/evidence pairing、handoff/open-issues/VETO 输入 | 猜造 endpoint/DTO、private implementation、跨仓 truth 写入、静态 EV/verdict/signoff/readiness、P1/P2 feature | `S-RUN-CONTROLLED/E2E`、`G-RUN-CONTROLLED/STAGING/RELEASE` 及 06 entry/exit；当前 `baseline_blocked/not_run` |

### 7.4 阶段阅读与开工门禁摘要

| Phase | 必须补读的正式章节 | 必须补读的 calibration | 开工前必须满足 | 缺失处理 |
|---|---|---|---|---|
| `PH-01` | `03` §3～§4；`04` §3～§12；`05` §8～§9；`06` §3～§4 | `07` Step 3/4；03 Step 3/4/17/18；04 Step 3/9/10/12；05 Step 8/9；06 Step 3/4 | 目标仓/authority、目录与依赖分类、配置来源、脚本根和 fixed-path 合同可定位 | `RUN-DDD-001~003` 或 path/authority 缺失则 phase `blocked` |
| `PH-02` | `03` §5～§9；`05` §3～§6；`06` §5～§8 | 03 Step 5～10/16；05 Step 3/6；06 Step 5/6/8 | Design Gate 通过；exact selector/metadata/state/test cut 名称一致；Artifact/Governance positive seam 若缺失则明确 negative lane | 不猜 owner DTO/API；positive slot `waiting` |
| `PH-03` | `03` §8～§12；`05` §3/§6/§10/§14；`06` §5～§9/§11 | 03 Step 9～13/16；05 Step 6/10/14；06 Step 5/8/9/11 | qualified binding、UoW/idempotency/recovery basis、Sandbox/Runtime/platform/store seam 或受控 negative contract | seam/store 缺失即 `external_blocked`，不得模拟 Running/Cleaned |
| `PH-04` | `03` §5～§8/§14；`04` §7～§11；`05` §3/§9/§13；`06` §10 | 03 Step 8/9/15/16；04 Step 7/9/11；05 Step 9/13；06 Step 10 | safe field/source/freshness/visibility/redaction contract 和 Query no-write ledger | Observability seam 缺失则 `observability_blocked`，只留 controlled negative |
| `PH-05` | `03` §5/§7/§8/§12/§14；`05` §3/§9/§13/§14；`06` §7/§10/§12 | 03 Step 8/9/12/15/16；05 Step 9/13/14；06 Step 7/10/12 | transport header contract、Job claim/checkpoint/report contract、same-run script path | transport/job runner 缺失则 `transport_blocked`；不解析 payload、不生成 EV detail |
| `PH-06` | `03` §13～§16；`04` §9～§13；`05` §8～§14；`06` §3～§14 | 03 Step 17/18；04 Step 12/13；05 Step 8/13/14/15；06 Step 3/10/12/14 | real public seam、immutable design baseline、fixed run、required check/report pair、review authority | 任一缺失则 `baseline_blocked/not_run`；不移交或签署 |

## 8. Phase 停审记录

每个 phase 的结论仅表示设计层结构通过；执行期必须在目标仓、不可变设计基线、实际 gate 和同一 run 证据存在后重做。任何字段、DTO、状态、ref identity、version、adapter、report 或 evidence 缺口都必须回写真相源并暂停当前 phase。

| Phase | 可验证增量审查 | 依赖/越界审查 | 当前门禁可执行性 | 设计回写缺口 | 结论 |
|---|---|---|---|---|---|
| `PH-01` | 配置/路径/脚本/证据入口是可定位的结构增量，不冒充业务实现 | 未引入 owner/body、private adapter、真实运行或结果 | 计划 suite 可在目标仓出现后执行；当前无 runner/result | target repo、language/runtime、store/cache、baseline 待确认 | 设计层通过；实施 blocked |
| `PH-02` | context→selection→material 的 exact binding 和负向资格姿态可独立断言 | 不依赖后续 Sandbox/Runtime/Consumer/Job；不把 cache/HTTP/历史成功当 authority | contract/domain/service/config negative lane 可规划；positive seam 未闭合 | Artifact/Governance exact public seam、integrity contract 待确认 | 设计层通过；positive blocked |
| `PH-03` | request/control/resource/recovery 形成独立安全增量，Unknown/no-replay 可断言 | 只消费 PH-02 qualification；不把 ACK/PID/port 升级 owner state，不做 owner repair | UOW/replay/controlled negative 可规划；真实 Sandbox/Runtime/platform blocked | durable store、lease/cleanup/readback contract 待确认 | 设计层通过；external blocked |
| `PH-04` | bounded presentation、redaction、12 Query zero-write 可独立检查 | 不依赖 Consumer payload、Job repair 或 release evidence；Query 不触发写路径 | pure/entry/security/read-only audit 可规划 | Observability safe DTO/handoff、safe field set 待确认 | 设计层通过；observability blocked |
| `PH-05` | header-first Consumer、local-only Job、event-zero 和报告能力可独立检查 | 不解析 payload、不 ACK、不写 owner cursor、不修 owner、不生成 verdict | consumer/job/replay/static/report checks 可规划；transport/job runner 缺失 | exact header/version/dedup、job runner、report schema 待确认 | 设计层通过；transport blocked |
| `PH-06` | selected adapter/release handoff 是独立收口增量，不新增业务功能 | 只读取前序真实产物；不猜 DTO/endpoint，不生成静态 EV/verdict/readiness | controlled/staging/release 入口可规划；当前无 baseline/run/GRC | owner seam、environment、SLO/capacity、review authority 待确认 | 设计层通过；baseline blocked |

### 8.1 Phase 停审结论

- 六个 phase 均按可验证安全能力和纵切链路组织，不按对象、函数或文件裸拆。
- `PH-01` 前置仓/配置/路径，`PH-02` 先闭合 selection/material 资格，`PH-03` 再处理运行控制与恢复，避免状态轴 shortcut。
- Query no-write、Consumer no-payload/no-ACK、Job no-owner-repair、outbound event=0 分别在相应 phase 形成独立检查面。
- `PH-05` 只允许 script capability 和最小 evidence-index shell；`PH-06` 只有真实 fixed run/authority/baseline 到达后才可生成 selected handoff 草稿。
- 所有 phase 当前均为 `planned`，外部 positive lane 和执行结果均为 `blocked/not_run/incomplete`，没有 phase pass 或 readiness 事实。

## 9. 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 阶段顺序是否由依赖驱动 | 通过 | `PH-01` 的仓/配置/路径 → `PH-02` 的 selection/material → `PH-03` 的 request/control/recovery → `PH-04` 的 safe read/presentation → `PH-05` 的 Consumer/Job/report → `PH-06` 的 selected integration/handoff。 |
| 是否存在按对象裸拆 phase | 通过 | 对象、port、协议和 suite 仅作为 phase 内交付面；每 phase 有功能增量与 side-effect 红线。 |
| 最小安全纵切是否早于大规模功能 | 通过 | 先做 context/selection/material 的 negative/semantic slice，再启用 Sandbox/Runtime、diagnosis、Consumer/Job 和 release lane。 |
| 后续 phase 是否反向成为前置必需输入 | 通过 | 前序只依赖 typed ref、blocked/unknown posture 或 reserved shape；不要求后续 positive body、ACK、EV、verdict。 |
| 风险与跨仓依赖是否前置 | 通过（条件性） | `RUN-DDD-*` 前置到 PH-01；Artifact/Governance 到 PH-02；Sandbox/Runtime/platform 到 PH-03；Observability 到 PH-04；transport/GRC/baseline 到 PH-05/06；缺失时按 phase blocker 处理。 |
| Query/Command/Consumer/Job 读写边界是否清楚 | 通过 | Command/Job 的本地 UoW 与外部 effect 顺序在 PH-03；Query no-write 在 PH-04；Consumer no-payload/no-ACK、Job no-owner-repair、event=0 在 PH-05。 |
| 测试与验收是否覆盖每个 phase | 通过（计划层） | 每阶段绑定 CUT/suite/AC/AR/TX/NFA/VETO；实际 suite、artifact、report、EV 均未创建。 |
| evidence/report 成熟度是否按阶段推进 | 通过 | PH-01 path contract；PH-05 script capability/index shell；PH-06 fixed-run pairing/handoff；不跨阶段生成最终 EV/verdict。 |
| 是否存在 phase boundary 越界 | 通过 | 不把 P1/P2、owner truth、private implementation、真实生产 SLO 或 final decision 混入 P0 phase。 |
| 单 agent 串行与恢复顺序是否保持 | 通过 | 只允许 `PH-01→…→PH-06`；每次继续先读项目台账、flow、当前 Step；不并行、不跳 phase。 |
| 当前是否可移交实现 | 不通过（预期 blocker） | `RUN-DDD-001~003`、`RUN-UP-001~008`、`RUN-OPS-001~002`、`RUN-DOC-003` 和 immutable baseline 缺失；保持 `implementation_write_allowed=false`。 |

## 10. 回填草稿（未来正式 `07-实施计划.md` §5）

> 校准来源：
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读：建议继续阅读本文件的“阶段依赖图”“阶段总表”“Phase 可验证增量说明”“Phase 停审记录”和“跨 phase 依赖闭环审计表”。

正式 §5 应按以下顺序组织 Runner 实施阶段：

```text
[PH-01 仓/配置/测试/证据前置]
  -> [PH-02 context/selection/material qualification]
  -> [PH-03 request/control/resource/recovery]
  -> [PH-04 preview/diagnosis/handoff/query]
  -> [PH-05 consumer/jobs/automation/report]
  -> [PH-06 selected integration/release handoff]
```

阶段主轴是可验证的端侧安全能力，不是源码文件或对象数量。`PH-01` 先锁定实现仓、authority、配置和固定证据路径；`PH-02` 形成显式 immutable selection 与材料资格分轴；`PH-03` 处理 Sandbox request/control、资源保护、清理和 Unknown recovery；`PH-04` 形成 bounded/redacted preview、diagnosis、handoff 与 12 Query no-write；`PH-05` 形成 header-first Consumer、local-only Job、event-zero 和报告脚本能力；`PH-06` 只在正式 public seam、baseline、fixed run、环境和 review 到达后启用 selected integration/release handoff。

每个 phase 必须在实现前读取其阶段矩阵所列正式章节与 calibration，并通过 Design/Scope/Dependency Gate；phase 完成后停审依赖、越界、门禁可执行性和设计闭环。任何正向 seam、物理技术、真实 artifact/report/evidence、verdict、signoff 或 readiness 缺失时，阶段结果保持 `planned / blocked / waiting / not_run`，不得由实现者现场补 schema 或升级状态。

## 11. 待确认事项与重开触发

| 事项 | 影响的 phase | 当前状态 | 处理时点/重开动作 |
|---|---|---|---|
| 目标实现仓、manifest、语言/runtime/shell/process/packaging | `PH-01` 及全部后续 phase | `RUN-DDD-001~002 / blocked` | Step 8/9 前置核验；关闭或变化后重开 PH-01 与受影响物理落点 |
| local state store/cache、locking/migration/atomicity/corruption | `PH-01`、`PH-03`、`PH-05` | `RUN-DDD-003 / blocked` | Step 8/9；只保留 guarantee contract，技术决定后重开 persistence/boundary |
| Artifact/Governance exact public selection/authority seam | `PH-02`、`PH-06` | `RUN-UP-001~002 / blocked` | owner 合同到达后重开 PH-02 positive slot 和相关 adapter/test mapping |
| Sandbox/Runtime/platform request、lease、cleanup、readback seam | `PH-03`、`PH-06` | `RUN-UP-003~004/007 / blocked` | owner/platform 合同到达后重开 PH-03 controlled/positive lane |
| Observability safe diagnosis/handoff/redaction seam | `PH-04`、`PH-06` | `RUN-UP-005 / blocked` | safe DTO/visibility/freshness 合同到达后重开 PH-04/selected handoff |
| Consumer transport header/version/dedup 与 Job runner | `PH-05` | transport/job runner 未定 | Step 8；保持 header-first negative，不猜 payload/ACK/cursor |
| fixed-run、GRC、baseline、review role 与生产 NFR authority | `PH-05`、`PH-06` | `RUN-OPS-001~002`、`RUN-DOC-003 / blocked` | Step 7/8/11/12/13；无真实条件不生成 EV/verdict/readiness |
| PH 内 commit boundary 粒度 | 全部 | 未定义 | Step 6 独立拆分；本 Step 不提前定义 commit |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已输出 | `pass` | 六阶段顺序和前置 gate 明确 |
| 阶段总表已输出 | `pass` | 每 phase 有目标、依赖、交付面、计划门禁和当前状态 |
| 每个 phase 有功能增量、输入、输出、不包含和验证方式 | `pass` | §7.3 逐阶段收口 |
| 阶段阅读与开工门禁已绑定 | `pass` | §7.4 与 Step 3 矩阵一致，未解除 blocker |
| 每个 phase 已完成停审 | `pass` | §8；结论是设计层通过，不是执行期 pass |
| 跨 phase 依赖闭环审计无顺序冲突 | `pass` | §9；实现移交条件仍不满足并明确保留 |
| 未伪造实现/测试/证据事实 | `pass` | 无代码、测试、run、artifact、report、EV、verdict、signoff 或 readiness 实例 |
| 可进入 Step 6 | `pass_for_step_06` | 下一步只能创建并完成 `07_implementation_plan_step_06_tasks_commit_boundaries.md` |

## 13. Step 自审记录

- [x] 已读取项目执行台账、07 flow、Step 1～4、正式 03/04/05/06 相关章节、实施计划 SOP/书写规范以及 `L1-governance`/`L5-console` Step 5 参考框架。
- [x] 已按可验证功能增量而非对象/文件拆分六个 phase，并显式记录依赖顺序和串行约束。
- [x] 每个 phase 均有功能增量、输入、输出、不包含、验证方式、阶段阅读和开工 blocker。
- [x] 已保留 explicit selection、authority fail-closed、Complete/Verified/Qualified、Accepted/Running、Confirmed/Cleaned、Unknown/no-replay 等状态红线。
- [x] 已将 Query no-write、Consumer no-payload/no-ACK、Job no-owner-repair、outbound event=0 和 evidence 不反写 truth 分配到独立 phase 门禁。
- [x] 已区分 script capability、最小 evidence-index shell、真实 fixed-run handoff 和 final verdict，未生成任何实例。
- [x] 已完成六个 phase 停审与跨 phase 依赖闭环审计；持续 blocker 未被错误关闭。
- [x] 未创建目标实现仓、代码、测试、脚本实例、artifact/report/evidence、正式 07、implementation ledger 或 boundary skeleton。

## 14. Step 结论与门禁

```text
step = 05
status = completed / pass / self_reviewed
gate_status = pass_for_step_06
gate_reason = 六个 phase 已按可验证端侧安全能力组织；依赖图、阶段表、阶段增量、阅读/开工门禁、停审记录和跨 phase 审计均已收口。目标仓、技术 authority、外部 positive seam、真实环境、baseline、run 和证据实例仍保持 blocked/waiting/not_created。
next_allowed_action = create_and_complete_07_step_06_tasks_commit_boundaries
formal_07_write_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false_until_step_13_assembly
commit_required = false
```
