# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填章节：未来正式 `07-实施计划.md` §2 实施目标与范围
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 2` |
| `current_module` | `scope_and_non_scope` |
| `gate_status` | `pass_for_step_03` |
| `gate_reason` | 实施目标、P0 核心范围、P1/P2 条件范围、非范围和防误入规则均可回指 00/03/04/05/06；未把 blocked positive、性能数字或外围能力写成当前实施承诺。 |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_03_prerequisites_reading.md`；不得修改正式 07，不得创建 implementation ledger 或 boundary skeleton。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |

## 2. 本步目标、输入与非目标

本步把已确认的需求能力、详细设计契约、测试分母和验收门禁收敛为可供 Step 5/6 拆分的实施目标和范围。范围描述的是未来实现计划的覆盖面，不是实现、测试或验收已经发生的事实。

### 2.1 本步输入

| 输入 | 用途 | 读取边界 |
|---|---|---|
| Step 1 `input_boundary` | 确认 00～06 的权威顺序、可规划/可移交分层和 blocker | 不重复补物理实现结论 |
| `00-需求文档.md` §4、§7、§9、§10、§13、§14、§16 | 抽取目标、五个核心能力、FR/BR/NFR/AC 和外围能力 | 不新增需求、优先级或 owner truth |
| `03-详细设计.md` §2、§5～§16 | 抽取逻辑模块、对象、协议、flow、状态、一致性、配置、观测和 test cuts | 不把逻辑模块当物理 package，不解锁 blocked seam |
| `04-配置设计.md` §2～§12 | 抽取配置控制面、41 项、四 profile、builder/readiness 和 failure/rollback 承接 | 不把 profile/配置存在当环境或 readiness |
| `05-测试方案.md` §2～§14 | 抽取 18 CUT、108 planned TC、12 suite、18 slot、T0～T4 和证据/回归合同 | planned 不等执行、结果或 evidence |
| `06-验收标准.md` §2、§5～§14 | 抽取 AC、AR、TX、NFA、VETO、entry/exit 和最终裁决前置 | 不在 07 填 verdict/signoff/readiness |

### 2.2 非目标

- 不在本步重新定义用户故事、FR/BR/NFR、对象、DTO、状态、port、错误、配置项或验收项。
- 不把实施目标写成具体语言、GUI/CLI 壳、进程模型、数据库、cache backend、容器/虚拟化或平台命令。
- 不承诺 `RUN-UP-001~008` 的正向跨仓结果，不把 `T1` 语义计划升级成 T2/T3/T4 readiness。
- 不把 `FR-RUN-014~016`、production SLO/capacity/retention、真实 GRC、部署 runbook 或最终 verdict 混入 P0 实施分母。
- 不创建代码、测试脚本、fixture、artifact/report/evidence、目标实现仓或 implementation ledger。

## 3. SOP 问题回答

| SOP 问题 | Runner 当前回答 | 依据与边界 |
|---|---|---|
| 1. 本轮最小可交付结果是什么？ | 一个按正式 03 语义契约组织、可在未来目标仓中形成可验证增量的 Runner-owned semantic safety 纵切：可信语境/显式选择、材料取得与资格、受控请求/控制意图、资源与清理保护、恢复冻结、预览/诊断/handoff、安全配置、Query/Consumer/Job 边界和测试/证据生成路径。 | `00` §7/§9；`03` §2/§5～§16；`05` §2～§14；`06` §2/§5～§14。目标是计划覆盖，不声称已实现。 |
| 2. 哪些需求编号必须覆盖？ | 核心覆盖 `CP-RUN-01~05`、`US-RUN-001~012`、`FR-RUN-001~013`、`BR-RUN-001~025`、NFR 的安全/可用性/一致性/追溯/观测/平台资源部分，以及 `AC-RUN-001~011`。 | `FR-RUN-014~016` 为外围 P1/P2，不进入当前 P0 pass 分母；需求编号不扩写。 |
| 3. 哪些详细设计章节必须落地到计划？ | `03` §4 的逻辑实现单元与物理 blocker、§5 模块契约、§6 对象/port/API 索引、§7 协议、§8 32 条 flow、§9 21 状态、§10 持久化/UoW、一致性、§11 错误/恢复、§12 并发/幂等、§13 配置/依赖、§14 观测/审计、§15 最小测试切口、§16 实施承接。 | 这些章节由后续 phase/boundary 引用；不在 07 复制 schema 或状态表。 |
| 4. 哪些验收项必须在本轮可判定？ | 实施计划必须使 `AC-RUN-001~011`、适用 `AR-RUN-001~015`、`TX-RUN-*`、`NFA-RUN-001~007` 与 `VETO-RUN-001~012` 具备未来可执行的测试/证据入口；当前只定义判定路径，不填写实际结果。`NFA-RUN-008` 仅在 authority 到达后作为 measurement/residual，`NFA-RUN-009` 保持 P1/条件。 | `06` §5～§14；`05` §10～§14。blocked/not_run 不得被标为 pass。 |
| 5. 哪些能力明确不在当前实施范围？ | 批量预取、多运行比较、归档浏览（`FR-RUN-014~016`）；Artifact/Governance/Runtime/Sandbox/Observability/Archive 内部 truth；Sandbox 私有实现；生产部署、容量/SLO/retention、真实 GRC；具体技术选型；实际验收 verdict/signoff/readiness。 | `00` §4.2、§6、§9、§14；`01`/`03` 非目标；`06` §2/§3。 |
| 6. 哪些 P1/P2 容易误入 P0？ | 真实 owner/platform positive integration、durable store/cache 产品、实际 SDK version、产品式跨平台预演、性能/容量硬阈值、外部 GRC、Archive restore、advanced comparison/prefetch、部署/运维自动化。 | 统一用 `fake/controlled/disabled/blocked` 语义承接；不可用 lane 不得伪装 P0 成功，也不得反向改 P0 分母。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| `07` 尚无正式范围章节 | 后续 phase 可能按对象或旧 UI 清单拆分，失去可验证增量 | 固定五个核心能力和 P0 分母，交给 Step 5 做 phase 纵切 |
| 需求存在外围 `FR-RUN-014~016` | 容易把预取/比较/归档浏览提前塞入主链 | 显式列为 P1/P2 future，不进入当前 P0 pass 分母 |
| 03 同时包含语义契约和物理布局 blocker | 可能把逻辑模块误写成 crate/package 或提前选技术 | 范围只承接逻辑实现单元；物理选择留给 authority gate |
| 05/06 含 T2～T4、正向 slot 和 NFR 候选 | 可能把 planned/conditional 当实施必交或 readiness | 将其分成 P0 semantic、conditional positive、blocked execution 三层 |
| 上游 owner truth 边界与 Runner local truth 容易混淆 | 可能让实现计划安排反写 Release/Governance/Sandbox/Runtime | 非范围表明确 owner truth 仅消费，不在 Runner 实施 |
| 实际验收状态未进入 | 实施计划可能写“完成即通过” | 只写可判定路径和证据产物，不写 verdict/signoff/readiness |

### 4.1 旧材料与技术污染处置

README、`draft/` 和旧正式文档中的 Rust/Tauri/Docker/gVisor/Firecracker、旧 `RunnerRun`/queue UI、固定性能或端口数字只作 historical material。它们不构成本步范围，也不能作为 P0 实施交付物、技术前置或验收分母。

## 5. 改动前后对比

| 项 | 改动前 | 本步完成后 | 原因 |
|---|---|---|---|
| 实施目标 | 仅有需求/设计/测试/验收分散描述 | 形成一个以 Runner-owned semantic safety 为核心的最小可交付目标 | 让后续阶段围绕可验证功能增量，而非文件或对象清单 |
| P0 分母 | 可能与外围、positive integration、NFR 候选混杂 | 固定 CP/FR/BR/NFR/AC/AR/TX/VETO 的当前核心分母 | 防止范围膨胀或误删安全门禁 |
| 上游 positive seam | 容易被写成“必须先实现”或“已可用” | 分为 semantic contract、conditional positive、blocked/not_run | 保持事实诚实和 fail-closed |
| 非范围 | 分散在 00/01/03/05/06 | 汇总明确的 P1/P2、技术、部署和 owner truth 非范围 | 给 Step 5/6 提供硬边界 |
| 验收关系 | 可能将计划完成误读为通过 | 只保证未来 AC/AR/TX/NFA/VETO 的可执行入口 | 保持 verdict/signoff/readiness 未产生 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以 UI 页面/对象文件为实施范围 | 直观、容易列任务 | 不形成可验证纵切，会遗漏 truth、保护、恢复和证据边界 | 不采用 |
| 只实施本地 semantic fake | 能快速验证局部规则 | 不能承接真实 seam 的条件门禁；若写成完成会误导 | 作为 P0 semantic lane，不能作为整体完成判定 |
| 把所有 T2～T4 正向集成纳入 P0 | 贴近产品使用 | 当前上游和环境 blocker 会使实施无法开始，且需要猜技术 | 不采用 |
| P0 semantic safety + conditional adapter lane + blocked execution lane | 保证核心安全先落码，保留真实接缝的后续入口 | 计划中会有 blocked/waiting 项，不能立即宣称产品 ready | 采用 |
| 把外围能力全部永久删除 | 简化 P0 | 失去未来需求追踪和演进触发 | 不采用；保留为 future/residual，不进入当前分母 |

## 7. 结构化中间产物

### 7.1 实施目标表

| 目标编号 | 实施目标 | 来源 | 未来完成判定（设计层） |
|---|---|---|---|
| `OBJ-RUN-01` | 可信 actor/session/project/platform 语境与 immutable Release/version 选择纵切 | `CP-RUN-01`;`FR-RUN-001~002`;`AC-RUN-001~002`;`03` C01/C02 | 能执行 exact ref/scope/generation 校验、authority fail-closed 和选择失效路径；不使用 `latest/default` |
| `OBJ-RUN-02` | 材料取得、quarantine、integrity 与 qualification 纵切 | `CP-RUN-02`;`FR-RUN-003~004`;`AC-RUN-003~004`;`03` C03～C06/J01 | transfer/verification/qualification/cache protection 分轴；失败材料不得进入请求主链 |
| `OBJ-RUN-03` | qualified material 到 Sandbox/Runtime 的 request/control intent 纵切 | `CP-RUN-03`;`FR-RUN-005~007`;`AC-RUN-005~006`;`03` C07～C08 | accepted/pending/rejected/unknown 与 owner projection 分离；不得把 ACK/PID/port 当 running |
| `OBJ-RUN-04` | 资源观察、lease/guard、cleanup 和恢复冻结纵切 | `CP-RUN-04`;`FR-RUN-008~010`;`AC-RUN-007~009`;`03` C09～C10/J02～J03 | conflict/protection/recovery/manual-review 可表达；Unknown 不自动 replay/resend/reclaim/resume/delete |
| `OBJ-RUN-05` | bounded preview、failure diagnosis、redaction 与 handoff 纵切 | `CP-RUN-05`;`FR-RUN-011~013`;`AC-RUN-010~011`;`03` C11/Q09~Q12/J04 | source/freshness/visibility/redaction/limit 保真；local receipt/log 不升级 evidence/verdict/signoff |
| `OBJ-RUN-06` | 横切协议、Query/Consumer/Job、配置、UoW、幂等、观测和证据生成路径 | `03` §5～§15;`04` §3～§12;`05` §3～§14;`06` §6～§12 | 11/12/4/0/5 库存、21 状态、strict config、no-write/no-payload/no-owner-repair/event-zero 和 fixed-run 生成合同均有实现/测试入口 |

### 7.2 实施范围表

| 范围类别 | 具体内容 | 上游来源 | 当前实施层 | 处理 |
|---|---|---|---|---|
| 核心能力 | `CP-RUN-01~05` 与 `FR-RUN-001~013` | `00` §7/§9 | P0 | 必须进入 phase 目标和测试/验收映射 |
| 业务规则 | `BR-RUN-001~025` | `00` §10 | P0 | 作为 domain/service/adapter guard；不新增规则 |
| 验收功能 | `AC-RUN-001~011` | `00` §14；`06` §5 | P0 | 未来必须可判定；当前不生成结果 |
| 架构红线 | `AR-RUN-001~015` | `06` §6 | P0 | 每个相关 boundary 的 Design/Test/VETO gate |
| 事务一致性 | `TX-RUN-*`、21 状态不等式、Unknown/no-replay | `03` §9～§12；`06` §8 | P0 | 不得被实现简化为单一状态或通用失败 |
| 安全与观测 NFR | `NFA-RUN-001~007`、redaction/trace/evidence integrity | `00` §13；`06` §9～§10 | P0 | 只承接有来源的结构性门禁 |
| 条件性能/体验 | `NFA-RUN-008`、`NFA-RUN-009` | `06` §9 | conditional/P1 | 无 authority 只做 measurement/residual，不设 hard pass |
| 详细设计模块 | 七个逻辑模块、17 对象、14 semantic ports、32 flow | `03` §4～§8 | P0 semantic | 逻辑边界必须承接；物理布局另设 gate |
| 协议库存 | 11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job | `03` §6～§8 | P0 semantic | Consumer positive 与 owner seam 保持 blocked/conditional |
| 配置控制面 | 41 项、四 profile、strict source、builder/readiness/failure/rollback | `04` §3～§12 | P0 semantic / instance blocked | 不将 profile 名称写成环境事实 |
| 测试/证据路径 | 18 CUT、108 planned TC、12 suite、18 slot、固定 raw/report/check 路径 | `05` §3～§14；`06` §10 | P0 design contract | 只计划生成与审查，不创建实例 |

### 7.3 非范围与后置触发

| 非范围/后置项 | 来源 | 当前处理 | 触发条件 |
|---|---|---|---|
| `FR-RUN-014` 批量预取 | `00` §9 | future/P1；不进入 P0 phase 分母 | 用户授权且批量/保护合同闭合后重开 00/03/05/06 受影响 Step |
| `FR-RUN-015` 多运行比较 | `00` §9 | future/P1；不改变 core lifecycle | comparison truth/read model 与证据合同闭合后重开 |
| `FR-RUN-016` Archive 浏览/恢复引用 | `00` §9；`RUN-UP-006` | future/conditional；不进入启动、运行或清理成功 gate | Archive Runner-facing seam 与恢复责任闭合后重开 |
| Artifact/Governance 内部 truth | `RUN-UP-001/002` | 外部 owner；Runner 只消费安全结果 | public contract/authority chain 到达后纳入 selected T2+ lane |
| Sandbox/Runtime 内部实现与 lease/reaper | `RUN-UP-003/004` | 外部 owner；不复制/编译私有实现 | 正式 Runner-facing request/status/cleanup seam 到达后纳入 |
| Observability formal audit/evidence/report/verdict | `RUN-UP-005` | 外部 owner；local record 仅作 posture | safe handoff/evidence contract 和真实 sink 到达后纳入 |
| 平台/资源/容量/SLO/retention | `RUN-UP-007`、`RUN-OPS-001` | conditional measurement/residual | workload/authority/平台矩阵到达后设置 hard gate |
| T2/T3/T4、真实 integration/GRC | `05`/`06`；`RUN-OPS-002` | blocked/not_run；不计 P0 pass | 真实环境、baseline、fixed run、review/GRC 条件齐备后选入 |
| 具体技术、仓、部署、运维 | `01`/`03` 非目标；`RUN-DDD-*` | 不在本步选择 | authority/ADR 与实现仓建立后由 Step 3/8/9 回填 |
| actual verdict/signoff/readiness | `06` §14 | 验收期事实 | 进入 `06` 生命周期并具备真实 evidence 后才可裁决 |

### 7.4 P1/P2 防误入清单

| 容易误入 P0 的内容 | 正确归类 | 防误入规则 |
|---|---|---|
| Docker/Tauri/gVisor/Firecracker、Rust 或任意 GUI/CLI shell | 技术 authority/ADR | README/draft 不得成为 phase 交付；未授权不写物理任务 |
| durable DB/cache、locking/migration 产品 | `RUN-DDD-003` 后置 | P0 只承接 required guarantees 和 fake/controlled contract；不可伪造 durable parity |
| 真实 Artifact/Governance/Sandbox/Runtime/Observability/Archive adapter | T2/T3 conditional | 未启用 slot 保持 blocked；fake 不贡献 positive |
| production SLO、吞吐、容量、保留期、RTO | `RUN-OPS-001` 后置 | 无 authority 只记录 measurement/residual，不设置数字门禁 |
| external GRC、正式 audit/evidence/report | T4/外部 owner | Runner handoff/receipt 不等正式结论 |
| 批量、多运行比较、Archive 恢复 | P1/P2 future | 不扩大当前 P0 分母，不改变 core state/cleanup 语义 |

### 7.5 实施完成的范围边界（本步只定义目标）

未来 Step 12 只能在以下范围内判断“计划设计完成”：所有 P0 目标、对应 phase/boundary、测试/验收门禁、配置/环境前置和证据生成路径均有来源；P1/P2/future 项已显式列出且不会改变 P0 分母。该判断不等于代码实现完成、测试通过、验收 verdict 或产品 readiness。

## 8. 回填草稿（未来正式 07 §2）

> 校准来源：`design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：请继续阅读本文件的“实施目标表”“实施范围表”“非范围与后置触发”“P1/P2 防误入清单”。

未来正式 §2 应声明：本轮实施以 `CP-RUN-01~05` 为纵向主轴，覆盖 `FR-RUN-001~013`、`BR-RUN-001~025`、适用 `NFA-RUN-001~007`、`AC-RUN-001~011`、`AR-RUN-001~015`、`TX-RUN-*`、`VETO-RUN-001~012` 及正式 `03` 的七逻辑模块、17 对象、14 semantic ports、11 Command、12 Query、4 planned Consumer、0 outbound event、5 Operations Job、32 flow 和 21 状态语义。实施计划同时承接 `04` 的 41 项/四 profile 配置合同、`05` 的 18 CUT/108 planned TC/12 suite/18 slot 与 `06` 的 fixed-run/证据/裁决门禁。

`FR-RUN-014~016`、真实 owner/backend/SDK positive integration、生产 SLO/capacity/retention、外部 GRC、部署运维、具体语言/GUI/进程/数据库/容器选择和实际 verdict/signoff/readiness 不属于当前 P0 实施交付；它们保持 `future / conditional / blocked / not_run`，不得降低 P0 安全分母，也不得被实现者自行补入。

## 9. 待确认事项

| 事项 | 影响 | 处理时点 | 当前状态 |
|---|---|---|---|
| P0 semantic lane 的第一个最小纵切是否先从 context/selection 还是 material 开始 | 影响 Step 5 phase 顺序 | Step 5 | 待定义，不在本步预判 |
| 哪些 `RUN-UP-*` slot 会被未来 target baseline 启用 | 影响 T2/T3 positive gate | Step 7/8/9 | 当前 blocked/conditional |
| `NFA-RUN-008` workload/SLO authority | 影响 hard NFR 与 release gate | Step 7/9/12 | 未闭合，保持 measurement/residual |
| `FR-RUN-014~016` 未来授权与依赖 | 影响 future phase | Step 9 | 不进入当前 P0 |
| 目标实现仓/技术 authority | 影响物理交付物与命令 | Step 3/4/8 | `RUN-DDD-001~003 blocked` |

## 10. 进入下一步条件

- [x] 最小可交付目标已定义为 Runner-owned semantic safety 的可验证实施计划覆盖，而非页面/文件清单。
- [x] 需求、设计、配置、测试和验收分母已逐项回指正式编号。
- [x] P0、conditional/P1、future/P2、blocked/not_run 的边界已明确。
- [x] 非范围包含 owner truth、技术选型、真实集成、生产 NFR、外围能力和实际裁决事实。
- [x] 未新增需求、对象、状态、协议、阈值或实现事实。
- [x] 允许进入 Step 3；下一步只能创建 `07_implementation_plan_step_03_prerequisites_reading.md`。

