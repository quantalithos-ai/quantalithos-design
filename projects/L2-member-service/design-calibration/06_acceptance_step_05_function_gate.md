# Step 5. 定义功能验收门禁 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节：`06-验收标准.md` §5 功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 4；`00` AC-MS-001~021、FR-MS-001~012；`03` §5~§8；`05` §5~§6、§13 |
| 输出文件 | `design-calibration/06_acceptance_step_05_function_gate.md` |
| 当前模块 | `core_loop_gates`、`functional_gates`、`peripheral_boundary` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | P0 功能逐项具备通过 / 失败条件、设计契约、TC、EV 和 report path；P1/P2 功能未污染 P0；逐项停审和跨功能审计无 unresolved 冲突 |
| next_allowed_action | 进入 Step 6，定义数据边界与架构红线验收 |

### 1.1 Step 内计划

- [x] 读取 Step 4、`00` AC/FR、`03` protocol / flow 和 `05` TC/EV。
- [x] 逐项回答功能门禁问题。
- [x] 诊断旧功能门禁的泛化名称、证据缺口和外部 truth 混层。
- [x] 选择“核心闭环 + 功能逐项 + 外围后置”组织方式。
- [x] 产出功能门禁表、闭环矩阵、P1/P2 后置表、逐项停审和跨功能审计。
- [x] 形成 §5 回填草稿并自检。

## 2. 本步目标

把 `C-MS-1~5` 和 `FR-MS-001~012` 转成可以裁决的功能验收项；同时为 `FR-MS-E01~E04` 定义后置边界。每个 P0 功能项必须闭环到正式设计契约、具体测试用例族、未来证据 ID、固定 report path 和失败后的总体影响。

本 Step 不裁决数据归属、接口依赖分类、状态 / 事务、非功能、证据真实性或 VETO；这些由 Step 6~11 独立收口。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 核心闭环与功能需求 | `00` §7、§9、§14.1~§14.2 | 验收项主语和语义 |
| 规则 / 数据边界 | `00` §10~§11 | 功能失败影响和红线关联 |
| 对象 / protocol / flow | `03` §6~§8 | 正式名称、处理顺序和允许副作用 |
| 状态 / UoW / 幂等 | `03` §9~§12 | 功能项的稳定结果和负向条件 |
| 测试覆盖 / 证据族 | `05` §5~§6、§13 | TC、EV 和 report 入口 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 P0 功能的通过条件是什么？ | 核心闭环和 FR-MS-001~012 必须按正式对象 / flow 形成可观察的 accepted、rejected、conflict、blocked、unknown 或 safe view 结果；允许副作用在同一 UoW 内成立，且能回链 source / generation / revision。 | `00` §9、§14；`03` §8、§10 |
| 每个 P0 功能的失败条件是什么？ | 关键 truth 缺失、必需输入被默认补齐、非法 / 非项目输入被放行、required seam 缺失仍 ready、Query / Job 越权、duplicate / unknown 产生第二副作用，或证据无法回指 raw artifact，均失败。 | `00` VF-MS-001~009；`03` §9.3、§12；`05` §13 |
| 证据来自哪些测试用例或报告？ | 核心用 `TC-INTENT-*`、`TC-DECISION-*`、`TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-REG-*`、`TC-SESSION-*`、`TC-HEALTH-*`、`TC-RECOVERY-*`、`TC-CLOSE-*`、`TC-MATERIAL-*`、`TC-QUERY-*`、`TC-CONSUMER-*`、`TC-JOB-*` 和 `TC-IDEMP-*`；证据族为 `EV-MS-CORE-*`、`EV-MS-CMD-*`、`EV-MS-QUERY-*`、`EV-MS-CONSUMER-*`、`EV-MS-MATERIAL-*`、`EV-MS-JOB-*`、`EV-MS-IDEMP-*`。 | `05` §6、§13.1~§13.2 |
| 哪些 P1 功能只做后置边界验收？ | `FR-MS-E01~E04` 的容量 / 放置建议、资产预热、forensic 增强和聚合安全视图只在 P1/P2 selected-run 或 residual 中处理；它们不得改变 P0 Host Truth 或成为 P0 退出前置。 | `00` §9.2；`05` §2.3、§5.4 |
| 哪些功能失败会导致总体不通过？ | `AC-MS-001~017` 任一 P0 功能失败即不能“通过”；若同时命中 VF-MS-001~009，则不得风险接受。P1/P2 未运行只进入 residual，前提是 P0 seam 和红线证据完整。 | `00` §14.6；Step 4 |
| 每个功能项能否回指设计 / TC / EV / report？ | 可以。§8.2 为每个 P0 项提供设计契约、TC、EV、固定 report path 和裁决影响；不存在具体 run 时只保留占位路径，不填状态。 | 06 书写规范 §4.6 |
| 每个功能项完成后是否停审？ | 是。逐项检查正式名称、通过 / 失败可判定性、证据入口、P1 污染和 VETO 影响；结果见 §8.4。 | 06 SOP Step 5 |
| 所有功能项完成后是否有冲突？ | 未发现 unresolved 冲突。`release-main-smoke` 只能证明代表性主链，不能替代各功能族；外围项与 P0 项已分开。 | `05` §4.5；§8.5 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` 功能表 | 使用 `AllocateExecutionHost`、`BindExecutionContext`、`ExecuteRuntimeAction` 等未在新版 `03` protocol inventory 中存在的名称 | 全部改用正式 Command / Query / Consumer / Job 和 AC-MS 编号 |
| 旧 `06` 功能表 | 通过条件只写“形成宿主 / 执行成功”，没有区分 host truth、Runtime truth、Sandbox truth 和 handoff layer | 每项增加本地语义上限和禁止推导 |
| 旧 `06` 证据列 | API / DB / trace 泛化描述，不能定位 TC、EV、report 或 raw artifact | 统一为 `EV-MS-*` + `reports/runs/<run_id>/...` |
| `05` §5 / §6 | P1/P2、placeholder 和外部 positive blocked 已存在，但验收结论尚未分层 | 明确 P0 功能项、P1/P2 后置和 blocker 影响 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能主轴 | 单一“宿主可执行” | 五个核心闭环 + 12 个 P0 FR | 与需求 / 详细设计一致 |
| 正向条件 | “成功 / 可用” | 正式状态、双锚、generation、revision、safe material 和允许写集 | 让门禁可判定 |
| 外部能力 | 把 Runtime / Sandbox / Member 内部行为纳入 | 只验 safe seam、failure mapping 和 fail-closed | 遵守 owner 边界 |
| 证据 | 泛化 trace / DB | TC → EV → artifact/report → AC/VF | 可审计 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否为每个 AC-MS-001~021 单独设门禁 | A. 合并成 5 项；B. 保留稳定 AC 并按组展示 | 采用 B；便于缺陷、证据和后续回归定位 |
| 是否让 smoke 单独证明所有功能 | A. 允许；B. 仅作代表性证据 | 采用 B；详细功能必须消费对应 TC / EV |
| 是否把外部正向联调列为 P0 | A. 列为必须；B. 列为 seam / residual | 采用 B；未闭合合同不得成为 P0 ready 前置 |
| 是否把 P1/P2 功能失败当核心失败 | A. 是；B. 仅当改变 P0 truth 才升级 | 采用 B；外围不得反写或阻断核心 |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| `AC-MS-001` | 意图与决定闭环 | P0 | `ProjectMemberRef` 为执行主语、`GlobalMemberRef` 为身份锚；受理 / 拒绝 / 等待和显式决定可追溯 | 缺双锚、非项目输入放行、隐式创建 host 或决定不可回链 | `EV-MS-CORE-001`; `EV-MS-CMD-001` |
| `AC-MS-002` | 装配与就绪闭环 | P0 | qualification、assembly、唯一 generation、分项结果和 readiness 可分别判定；所有 required 前置同代且 fresh | partial / stale / unknown / pending 或 required binding 缺失仍 `Ready` | `EV-MS-CORE-001`; `EV-MS-CMD-001`; `EV-MS-DOMAIN-001` |
| `AC-MS-003` | 注册与会话闭环 | P0 | registration、endpoint、active registration 和 `HostSession` 与当前 host/generation 唯一关联、可失效 | Member / Runtime 正文入仓、旧实例继续 active、session 冒充 Runtime run | `EV-MS-CORE-001`; `EV-MS-CONSUMER-001`; `EV-MS-QUERY-001` |
| `AC-MS-004` | 健康与处置闭环 | P0 | host / session / backend / unknown 四层可区分；恢复 / 重启 / 停止 / 终止 / hold 由显式决定触发，新世代关联旧历史 | heartbeat / process 存活直接推导业务成功、Runtime 进度或恢复完成 | `EV-MS-CORE-001`; `EV-MS-CONSUMER-001`; `EV-MS-IDEMP-001` |
| `AC-MS-005` | 清理、对账与事实交接闭环 | P0 | local close、cleanup attempt、residual / case、immutable material 和四层 handoff 可分别追踪 | local close 冒充 external cleanup；handoff 层级越级或历史被删除 | `EV-MS-CORE-001`; `EV-MS-MATERIAL-001`; `EV-MS-JOB-001` |
| `AC-MS-006` | 宿主意图受理与范围判定 | P0 | 正式 source、双锚、project scope、actor / correlation 和 action 可验证；无效输入得到 reject / blocked | 非项目、无 source、scope 冲突或陈旧输入隐式建 host | `EV-MS-CMD-001`; `EV-MS-CONTRACT-001` |
| `AC-MS-007` | 编排决定与重复冲突控制 | P0 | 首次、same-key replay、different-digest conflict、并发和 no-action 形成稳定决定 | 重复产生第二决定 / host，或 conflict 被覆盖 | `EV-MS-CMD-001`; `EV-MS-IDEMP-001` |
| `AC-MS-008` | 正式装配条件形成 | P0 | owner、opaque ref、scope、freshness、required item 和 gap 可判定；不解析 Role→image | 本地重解析 Role→image、补造 policy / credential owner 或旧缓存变 ready | `EV-MS-CMD-001`; `EV-MS-DOMAIN-001`; `EV-MS-CONFIG-001` |
| `AC-MS-009` | 承载与隔离装配协调 | P0 | host/generation 下的承载、pinned supply、mount、credential ref、适用 binding 各有独立结果 | 任一结果被压平、binding 缺失仍 host fallback、外部正文进入本地 | `EV-MS-CMD-001`; `EV-MS-ARCH-001` |
| `AC-MS-010` | readiness 与安全降级 | P0 | 只有全部必要前置 positive / fresh / same-generation 才 `Ready`；否则 `NotReady / Blocked / Unknown` | partial、fake、placeholder、timeout 或 adapter availability 被升级为 ready | `EV-MS-DOMAIN-001`; `EV-MS-CONFIG-001` |
| `AC-MS-011` | 可信注册与实例关联 | P0 | registration source、fingerprint、credential context、project/member 双锚和 generation 匹配；重放 / 跨实例被拒 | 冒用、重放、跨实例、迟到注册覆盖 current | `EV-MS-CONSUMER-001`; `EV-MS-DOMAIN-001` |
| `AC-MS-012` | 接入与 session 可用性维护 | P0 | endpoint / registration / `HostSession` 当前 / 历史关系可查询、失效和降级；不创建 Runtime run | stale endpoint 仍 current、查询触发写入、session 壳存储 Runtime run/turn/checkpoint | `EV-MS-QUERY-001`; `EV-MS-CONSUMER-001` |
| `AC-MS-013` | 健康与失败分层 | P0 | signal source / sequence / freshness、assessment、failure class 和 unknown 可回链 | 缺 signal 即 healthy，或 host failure 被写成 business failure / Runtime progress | `EV-MS-CONSUMER-001`; `EV-MS-JOB-001`; `EV-MS-DOMAIN-001` |
| `AC-MS-014` | 恢复、重启与终止控制 | P0 | formal control source + current host + failure basis 形成 host-side decision；unknown 保持 hold / blocked | 无正式 basis 仍重启、unknown 盲重试、把 host recovery 写成 Runtime recovery | `EV-MS-CMD-001`; `EV-MS-IDEMP-001`; `EV-MS-JOB-001` |
| `AC-MS-015` | 下线清理与关联失效 | P0 | close、registration / endpoint / session / association invalidation 和 cleanup attempt 同一允许写集提交 | 只删当前记录、换 key 重试、声明外部清理 complete | `EV-MS-CMD-001`; `EV-MS-JOB-001` |
| `AC-MS-016` | 残留与孤儿对账 | P0 | safe local / external summary 差异形成 finding / case，支持 hold / repair / escalate，历史保留 | 为消除差异删除历史、改 sibling truth 或把 unavailable 当 resolved | `EV-MS-JOB-001`; `EV-MS-MATERIAL-001` |
| `AC-MS-017` | 事实安全表达与交接分层 | P0 | `HostFactMaterial` immutable、body-free；local / submitted / delivered / observed / accepted 各层有 target-specific feedback | current truth 现查现组包、receipt / submitted 推导 accepted、raw body 泄漏 | `EV-MS-MATERIAL-001`; `EV-MS-CONSUMER-001`; `EV-MS-REDACTION-001` |
| `AC-MS-018` | 容量与放置建议 | P1 | 仅由安全摘要派生建议 / 无建议 / 数据不足，不改 Host Truth 或基础设施 truth | 建议直接调度、使用 raw capacity / member id 或阻断核心闭环 | `EV-MS-JOB-001`（future selected-run） |
| `AC-MS-019` | 正式宿主资产预热 | P1 | 预热 attempt / result 独立，保持 pinned ref、assembly 和 readiness 语义 | 预热成功直接写 ready，失败改写正式装配结果 | `EV-MS-JOB-001`（future selected-run） |
| `AC-MS-020` | forensic 安全关联材料 | P1 | 只形成 body-free safe refs / relation，不保存 evidence / report / artifact 正文或完整性声明 | 外部日志、capture、报告正文或 secret 进入本仓，或冒充 forensic verdict | `EV-MS-REDACTION-001`（future selected-run） |
| `AC-MS-021` | 聚合宿主安全视图 | P1 | view 只读、可重建、可失效，不成为写源；不可用只影响 view | query / projection 修复 source，视图不可用反写核心 truth | `EV-MS-QUERY-001`; `EV-MS-JOB-001` |

### 8.2 功能验收闭环矩阵

| 验收项 | 设计契约 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| `AC-MS-001~005` | `03` §6.1 control / qualification / host / health / closure / material；§8 core flows | `TC-INTENT-*`、`TC-DECISION-*`、`TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-HEALTH-*`、`TC-CLOSE-*` | `EV-MS-CORE-001`、`EV-MS-CMD-001`、`EV-MS-MATERIAL-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`service-flow-fast.md`;`operations-replay-core.md` | 任一核心闭环失败，不得通过 |
| `AC-MS-006~007` | `03` §7.1 Command metadata；§8.2 Accept / Decide；§12 reservation | `TC-CONTRACT-*`、`TC-INTENT-*`、`TC-DECISION-*`、`TC-IDEMP-001~006` | `EV-MS-CONTRACT-001`、`EV-MS-CMD-001`、`EV-MS-IDEMP-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`service-flow-fast.md` | 形成第二决定或隐式 host 时不通过 |
| `AC-MS-008~010` | `03` §6.1 qualification / assembly / readiness；§8.2 flows；`04` §7.3 | `TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-DOMAIN-003`、`TC-CONFIG-*` | `EV-MS-CMD-001`、`EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`contract-domain-fast.md`;`config-redline.md` | required seam 缺失仍 ready 时失败并可能触发 VF-MS-004 |
| `AC-MS-011~012` | `03` §6.1 registration / endpoint / session；§7.2~§7.4；§8.3~§8.4 | `TC-REG-*`、`TC-SESSION-*`、`TC-CONSUMER-002`、`TC-QUERY-003` | `EV-MS-CONSUMER-001`、`EV-MS-QUERY-001`、`EV-MS-DOMAIN-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`service-flow-fast.md` | 旧实例覆盖 current 或 Runtime truth 入仓时失败 |
| `AC-MS-013~014` | `03` §6.1 health / recovery；§9 state；§11 errors；§12 unknown | `TC-HEALTH-*`、`TC-RECOVERY-*`、`TC-IDEMP-005~008` | `EV-MS-DOMAIN-001`、`EV-MS-IDEMP-001`、`EV-MS-CMD-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`operations-replay-core.md` | unknown 盲重试或失败层混写时失败 |
| `AC-MS-015~016` | `03` §6.1 closure / reconciliation；§8.5 jobs；§10.5 | `TC-CLOSE-*`、`TC-JOB-003/004/007` | `EV-MS-JOB-001`、`EV-MS-MATERIAL-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`entry-worker-job.md` | 外部 completion 被冒充或历史被删时失败 |
| `AC-MS-017` | `03` §6.1 material / handoff / outbox / projection / history；§7.6；`04` §7.3 | `TC-MATERIAL-001`、`TC-CONSUMER-005`、`TC-JOB-005~007`、`TC-REDACTION-*` | `EV-MS-MATERIAL-001`、`EV-MS-REDACTION-001`、`EV-MS-JOB-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`operations-replay-core.md`;`redaction-check.md` | layer inference 或 forbidden body 时失败 |
| `AC-MS-018~021` | `00` FR-MS-E01~E04；`03` §8.5、§14；`04` feature-peripheral | `TC-BOUNDARY-*`、`TC-QUERY-*`、future selected-run | `EV-MS-JOB-001`、`EV-MS-QUERY-001`、`EV-MS-REDACTION-001`（future selected-run） | future `reports/runs/<run_id>/suites/selected-integration.md` | 不阻断 P0；若反写核心则升级为红线失败 |

### 8.3 P1 / P2 功能后置边界

| 功能 | 当前裁决 | 后续承接 |
|---|---|---|
| `FR-MS-E01` 容量 / 放置建议 | P1/P2；只验安全摘要派生和 no-write | workload / capacity authority 形成后补 selected-run |
| `FR-MS-E02` 资产预热 | P1；只验独立 attempt / result | Images / registry 合同闭合后补 controlled integration |
| `FR-MS-E03` forensic 关联 | P1；只验 body-free relation | Observability / archive owner 闭合后补 handoff |
| `FR-MS-E04` 聚合安全视图 | P1；只验 read-only / rebuild no source write | projection product / retention 明确后补 |
| 真实 Member / Images / Runtime / Sandbox 正向集成 | P1；当前 blocked / waiting | `MSVC-UP-001~004/006` 闭合后重开对应 AC / TC / EV |
| production-like、容量、深度 provider 行为 | P2 | Step 9 / 13 residual，不进入 P0 功能通过 |

### 8.4 功能验收项停审记录

| 验收项 | 设计来源 | 证据入口 | 通过 / 失败可判定 | P1 污染检查 | 结论 |
|---|---|---|---|---|---|
| `AC-MS-001~005` | 已使用 `03` 正式对象和 flow | `EV-MS-CORE-*`、`EV-MS-CMD-*` | 有双锚、readiness、session、health、closure 负向条件 | 未混入外部内部 truth | 通过 |
| `AC-MS-006~017` | 已逐组回指 `03` §6~§12 | `EV-MS-CONTRACT/CMD/QUERY/CONSUMER/DOMAIN/JOB/MATERIAL-*` | 每项有 accepted / reject / blocked / unknown 条件 | P1 正向只作限制 | 通过 |
| `AC-MS-018~021` | 已标 P1，并有 no-write / body-free 边界 | `EV-MS-JOB/QUERY/REDACTION-*`（future） | 后置条件可判定 | 不阻断 P0 | 通过 |

### 8.5 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能是否存在孤儿项 | 未发现 | `AC-MS-001~017` 全部有设计、TC、EV 和 report 入口 |
| 是否有功能门禁重复或冲突 | 未发现 | smoke 仅代表性，详细 suite 负责分族证据 |
| 是否有 P1/P2 污染 P0 | 未发现 | 外围和真实正向集成均标后置 / blocked / waiting |
| 是否误用旧接口 / 状态名 | 未发现 | 采用 `03` 正式 Command、Query、Consumer、Job、state family |
| 证据路径是否固定 | 设计层完整 | 真实 `<run_id>`、artifact、report 和 EV 实例待未来运行生成 |
| 上游 blocker 是否被伪造成 positive | 未发现 | `MSVC-UP-001~008` 仅进入 fail-closed / residual 口径 |

## 9. 回填草稿

正式 §5 应列出 `AC-MS-001~005` 五个核心闭环、`AC-MS-006~017` 十二个 P0 功能能力和 `AC-MS-018~021` 的 P1/P2 后置边界。每个 P0 项必须有可判定的通过 / 失败条件，并通过 `EV-MS-*`、`TC-*` 和 `reports/runs/<run_id>/...` 回指 `03` 正式对象 / flow。`release-main-smoke` 只能作代表性主链证据；Member、Images、Runtime、Sandbox 等真实正向合同未闭合时，验收只裁决 safe seam、negative、blocked、waiting 和 fail-closed。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 各 AC 在真实 run 中的具体 EV 实例 | Step 10 / 14 | 当前只定义证据族和路径，不生成实例 |
| Runtime / Member / Images / Sandbox 正向 mapper | AC-MS-003、008~014、017 | 继续 pending / blocked / waiting |
| P1 外围功能是否进入某次 release | Step 13 residual | 未有 authority 前不升级 P0 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 功能均有通过 / 失败条件 | 通过 | 见 §8.1 |
| 每项可回指设计、TC、EV、report | 通过 | 见 §8.2 |
| P1/P2 后置边界清楚 | 通过 | 见 §8.3 |
| 逐项停审完成 | 通过 | 见 §8.4 |
| 跨功能审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 6 | 通过 | 定义数据边界与架构红线 |
