# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9；回填位置：正式 `07-实施计划.md` §9。\
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。\
> 本产物只规划未来的有界调查、风险处置和决定入口；不表示目标实现仓、owner contract、技术选型、测试 run 或任何 readiness 已存在。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 9：Spike、风险与待确认事项 |
| 输入 | Step 1 输入风险；Step 5 八个 Phase；Step 6 十六个 boundary；Step 8 依赖准备；正式 `03/04/05/06` |
| 标准 | 实施计划 SOP Step 9、书写规范 §5.9、真相源闭环标准、代码实施台账规范 |
| 输出 | 有界 Spike 表、风险表、逐 blocker 截止矩阵、待确认事项与回写规则 |
| 当前状态 | `completed / risks_bounded_with_explicit_deadlines / continue_authorized` |
| 当前事实 | 18 个持续 blocker/pending 全部开放；所有 Spike 均未执行、无输出实例 |
| implementation / test / acceptance execution | `false` |
| formal 07 | Step 13 前仍不存在；本 Step 不创建 |
| 下一动作 | `create_and_complete_step_10_rollback_pause_change_control` |

本 Step 的 `completed` 只表示风险规划完整。`pending`、`blocked` 或未执行 Spike 不得写成 resolved、validated、selected、accepted 或 ready。

## 2. 本步输入与读取确认

| 输入 | 本步用途 | 核验结论 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 继承输入冲突和 18 个 blocker/pending | 已读；不由实施计划替 owner 关闭 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 把不确定性绑定到 8 个 Phase | 已读；阻塞只作用于相关 lane，不能改写 Phase 主轴 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 绑定 16 个 boundary 与最迟开工 Gate | 已读；不得用 Spike 提交混入功能 boundary |
| `07_implementation_plan_step_08_config_environment_dependencies.md` | 继承依赖分类、6 profiles、12 配置域/55 P0 keys 与 fake 上限 | 已读；Spike 不能把 runtime/ref/adapter 变成 compile dependency |
| 正式 `03` §17～§18、`04` §14、`05` §14、`06` §13～§14 | 继承 local pending、风险、退出/VETO 与证据限制 | 已读；P0 blocker/VETO 不可风险接受 |
| 实施计划 SOP Step 9、书写规范 §5.9 | 固定输出、截止点和禁止长期悬空 | 已读；每项均给出 owner、输出和 Gate 截止点 |

## 3. SOP 问题回答

| 问题 | 回答与取舍 |
|---|---|
| 哪些技术点需要 Spike | 仅对“可以用有限实验核验、但不能由文档推测”的问题设 Spike：Core compile surface、operation/cursor codec、durable UoW、配置装配、owner conformance、integrity/storage/receiver adapter outcome、evidence materialization 和 workload 方法。 |
| 哪些风险阻塞阶段 | 目标仓/Core 阻塞 PH-01；codec/UoW 阻塞 PH-02；cursor/visibility 阻塞 PH-03；source/material 阻塞 PH-04；integrity/schema 阻塞 PH-05；storage/governance 阻塞 PH-06；artifact/receiver 阻塞 PH-07；所有正式接缝、真实 run 与 review 阻塞 PH-08。 |
| 哪些事项影响提交边界或验收 | 18 个持续 blocker/pending、目标仓与 immutable design baseline、机器证据 schema、具名 reviewer 均影响 activation/Commit/Handoff Gate；任何一项不能以 commit body 说明代替。 |
| Spike 输出是什么 | 每个 Spike 产出 versioned decision/manifest/schema/contract vector 或 reproducible report；不得只写“调研完成”，不得直接生成业务成功状态或验收 EV。 |
| 风险如何处理与何时截止 | 表 7/8 将每项绑定 owning party、禁止 workaround、最迟 Design/Build/Test/Evidence Gate；过期不自动延期，而是对应 boundary=`blocked`、`next_allowed_action=wait_design`。 |
| 哪些风险必须回写上游 | owner truth/export/governance/artifact/observability/receiver 接缝回写 owning project；本地 DTO/state/UoW/config/test/evidence 缺口回写 L4-archive 对应 `03/04/05/06/07`；全局依赖冲突回写依赖标准与 `L0-sdk` owner。 |

## 4. 当前材料问题诊断与取舍

| 问题 | 风险 | 本 Step 处理 |
|---|---|---|
| 把所有 blocker 统称“外部依赖” | 实现者无法判断何时停、谁负责、修哪里 | 拆为 owner contract、architecture、local design、implementation authorization 四类，并绑定 exact boundary/Gate |
| 用 Spike 先写临时代码 | 试验代码可能偷偷成为生产 adapter 或成功证据 | Spike 必须隔离、限时、输出 decision/report；默认不可合并进功能 commit |
| 用 fake 关闭 formal blocker | local fault 测试被误认 authority/durability/finality | 每个 Spike 明确证明上限；formal positive 仍需 owner vector 和真实 binding |
| 等到 PH-08 才确认接缝 | 前面 boundary 会基于错误假设实现 | 每项最迟在首个受影响 boundary 的 Design Gate 前关闭，否则该 boundary 不激活 |
| “后续确认”没有截止点 | 风险永久漂移并最终被默认接受 | 使用具体 `PH-xx / commit-xx-y / Gate` 截止，不使用模糊日期或“上线前” |
| outbound candidate 被当自然扩展 | 在无 payload/outbox/topic authority 时制造新系统 | 不设实现 Spike；只保留 owner 决策项，未正式解锁即持续做 absence check |

选择“有界 Spike + 正式决定 + Gate 截止”，不选择实现端自由探索。Spike 只能回答可核验问题；需要业务 authority 的事项必须由 owning project 给出正式合同，实验不能替代决定。

## 5. Planned Spike

所有 Spike 状态当前均为 `planned / not_run` 或 `blocked`。未来执行时必须使用隔离目录或独立实验分支，记录输入 baseline、命令、输出、限制和清理结果；Spike 输出未经设计回写与 review 不得进入 production boundary。

| ID | 类型 / 要回答的问题 | 明确输出 | owner | 影响 Phase / boundary | 截止 Gate | 当前状态 / 证明上限 |
|---|---|---|---|---|---|---|
| `SP-AR-001` | compile contract：Core 是否存在最小共享 contract export，实际 package/path/version/lock 是什么 | 可复核 dependency manifest、symbol list、actual graph report、允许/禁止边清单 | `L0-core` owner + implementation owner | PH-01 / `commit-01-a-foundation` | 01-a Design Gate | blocked by `AR-ARCH-001`；只证明 compile surface，不证明业务兼容 |
| `SP-AR-002` | operation identity：结构化 operation key 与 canonical input digest 如何稳定编码 | versioned codec decision、test vectors、collision/domain-separation report、restart parity contract | L4-archive protocol/config/security owner | PH-02 / 02-a、02-b | 02-a Design Gate；最迟 02-b Build Gate | blocked by `AR-03-LOCAL-001`；不得私选算法/key或从 opaque ref 反推 |
| `SP-AR-003` | cursor：public/private cursor 使用 authenticated codec 还是 durable mapping，snapshot/visibility 如何绑定 | 选型 ADR、typed mapping schema、tamper/restart/visibility vectors、迁移与 key-ref 规则 | L4-archive query/store/security owner | PH-03 / 03-a、03-b | 03-a Design Gate | blocked by `AR-03-LOCAL-002`；不证明 owner visibility authority |
| `SP-AR-004` | durability：候选 store 是否支持原子 UoW、CAS/read-set/fence、commit probe、restart 与 cleanup | driver capability matrix、fault/restart/race report、unsupported list、正式 binding decision | L4-archive infra/implementation owner | PH-02～07 / 02-b、04-b、05-b、06-a/b、07-a/b | 02-b Design Gate | blocked by `AR-03-LOCAL-003`；in-memory 结果不证明 production durability |
| `SP-AR-005` | config assembly：55 P0 keys、required slots、secret refs、cross-field constraints 能否 strict load/activate | versioned machine schema、example-without-secret、negative vectors、binding totality report | L4-archive config + environment owner | PH-01～08 / 01-b 起 | 01-b Design Gate | blocked by `AR-03-LOCAL-004`；示例值不成为默认值或部署事实 |
| `SP-AR-006` | source conformance：8 source class 的 owner/version/fence/coverage/material 能否统一映射而不损失语义 | per-source conformance manifest、golden vectors、lossless mapping/unsupported table；workspace 行固定 `Auxiliary` | 各 L1 owner、artifact/workspace/observability owner + Archive adapter owner | PH-04 / 04-a、04-b；PH-07 / 07-b | 04-a Design Gate | blocked by `AR-UP-001/006/007/008`；不证明 canonical capture complete |
| `SP-AR-007` | integrity/compatibility：算法、key ref、canonicalization、compression、schema target 与 typed outcome 如何绑定 | 具名 authority 决定、versioned capability/schema manifest、positive/negative/corruption vectors | integrity/security/schema owner（待正式指定） | PH-05 / 05-a、05-b | 05-a Design Gate | blocked by `AR-UP-004`；本地 hash/fake 不证明 Verified/Supported |
| `SP-AR-008` | storage finality：put/retrieve/tier/lifecycle 的 ACK、Committed、CommitUnknown、probe 与 cleanup 如何区分 | provider-neutral port decision、outcome enum、idempotent key/probe/cleanup vectors、binding manifest | storage/operations owner（待指定） | PH-06 / 06-a、06-b | 06-a Design Gate | blocked by `AR-UP-005`；不固定供应商、tier、SLA 或 RTO |
| `SP-AR-009` | governance/lifecycle：project trigger、current decision、hold/delete applicability 在 dispatch 时如何核验 | owner-approved decision/trigger schemas、currentness/conflict/expiry/hold vectors、no-effect rules | `L1-work` + `L1-governance` 或明确 owner | PH-06 / 06-b；PH-07 / 07-a | 06-b Design Gate | blocked by `AR-UP-002/003`；Archive 不成为状态或政策 owner |
| `SP-AR-010` | restore receiver：每 owner 的 receiver mapping、commit/probe/partial/unknown/compensation 如何表达 | owner→receiver/schema manifest、typed outcome/probe/compensation vectors、unsupported-owner table | 各 truth owner / restore receiver owner | PH-07 / 07-a、07-b | 07-a Design Gate | blocked by `AR-UP-009`；不写 owner DB、不证明 project restored |
| `SP-AR-011` | evidence materialization：raw JSON、canonical digest、report/EV writer-reader 如何同 run 配对 | machine artifact schemas、canonicalization decision、writer/reader contract、redaction/link/no-static vectors | L4-archive test/evidence owner + `L4-observability` material owner | PH-01 / 01-b；PH-08 / 08-a、08-b | 01-b Design Gate 固定壳；08-a Evidence Gate 固定正式 schema | blocked by `AR-UP-007`、`AR-03-LOCAL-005`；不产生 EV/verdict |
| `SP-AR-012` | workload 方法：Bundle/source/item 规模、并发、timeout、RTO/RPO 如何形成可审查测量方案 | approved workload model、环境 identity、指标/窗口/阈值、统计与失败规则 | workload/product/operations/acceptance owner | PH-01 budgets；PH-08 measured lane | 01-b config closure；最迟 08-b activation | blocked by `AR-HLD-Q-002`；无 authority 前只做结构性边界，不填数字 |

## 6. Spike 执行与采纳门禁

| 门禁 | 通过条件 | 失败 / 未完成动作 |
|---|---|---|
| scope | 问题、输入 baseline、时间盒、允许路径和禁止 production 路径明确 | 不启动；回写 Step 9 |
| execution | 命令/fixture/result 可复现，失败输出也保留，未读取 secret/body | 标 `infrastructure_failed` 或 `blocked`；不得凭观察下结论 |
| output | 产生表 5 指定的 decision/manifest/schema/vector/report，并写明证明上限 | 不得写“Spike 完成”或激活 boundary |
| design adoption | 输出由具名 owner/reviewer确认，并回写 owning formal source 或 L4-archive 对应 03～07 | `next_allowed_action=wait_design`；试验代码不可进入功能 commit |
| cleanup | 隔离资源/临时凭据/测试材料按 owner 规则处理且有记录 | 不能进入 Commit/Handoff Gate |

若 Spike 发现现有设计错误，先回写设计并建立新的 immutable design baseline，再重新运行受影响的闭环审计；不得让实验结论只存在于 issue、聊天、commit body 或 adapter 私有配置中。

## 7. 风险表

| ID | 风险 | 影响 Phase / boundary | 处理方式 | 截止点 | 当前姿态 |
|---|---|---|---|---|---|
| `R-AR-IMP-001` | 目标实现仓、toolchain、Git identity 或 baseline 不存在却启动实现 | PH-01 / 01-a | activation 时只读核验；缺任一项即项目台账 blocked，不由设计仓创建目标仓 | 01-a Worktree/Design Gate | open / blocked |
| `R-AR-IMP-002` | Core/SDK 方向冲突造成循环或服务端反向依赖 client | PH-01 / 01-a；PH-08 dependency gate | 执行 actual graph check；Archive 只允许经核验 Core shared contracts；SDK 保持 downstream/runtime | 01-a Design/Build Gate | `AR-ARCH-001` open |
| `R-AR-IMP-003` | operation/cursor/config 采用临时 codec、default 或字符串拼接 | PH-01～03 / 01-b、02-a/b、03-b | 先完成 SP-AR-002/003/005 与正式回写；缺失即拒绝 activation | 各首个 Design Gate | local blockers open |
| `R-AR-IMP-004` | in-memory/fake 行为被当成 durable restart、authority 或 finality | PH-02～08 | 显式 proof level；formal suite 保持 blocked；执行 fake/durable parity 但不升级结论 | 每 boundary Test/Evidence Gate | open |
| `R-AR-IMP-005` | 某 source failure 被 workspace projection 或另一 source 补齐 | PH-04 / 04-a、04-b | per-source outcome/coverage 独立；workspace 永久 Auxiliary；exact set 缺口阻断 seal | 04-a Design Gate；04-b Test Gate | owner blockers open |
| `R-AR-IMP-006` | ref 集合、日志摘要或 telemetry 被当作 Artifact 正文/血缘/审计链 | PH-04/07/08 | 只消费 owner-approved material/ref；证据标 provenance/coverage/redaction；缺口保留 Partial/Blocked | 04-b、07-b、08-b Gate | `AR-UP-006/007` open |
| `R-AR-IMP-007` | 未确定算法/schema/key 时生成 digest/signature 或写 Verified/Supported | PH-05 / 05-a、05-b | typed Unknown/Unsupported/IntegrityFailed/Blocked；只有正式 capability vector 可进入 positive lane | 05-a Design Gate | `AR-UP-004` open |
| `R-AR-IMP-008` | storage ACK/timeout 被升格为 committed，CommitUnknown 被盲重派 | PH-06 / 06-a | intent-before-effect；保存 knowledge；只用 exact key probe/reconcile；无 probe 不 retry | 06-a Test Gate | `AR-UP-005` open |
| `R-AR-IMP-009` | Archive 自定 retention/hold/delete 或 project archived/restored | PH-06/07 | dispatch 时重读 current owner decision；缺失/过期/冲突/hold 时 effect=0；handoff 不推导 owner state | 06-b/07-a Design Gate | `AR-UP-002/003` open |
| `R-AR-IMP-010` | restore 对 owner DB 直写、跨 owner 事务，或 item `Succeeded` 推导全局恢复 | PH-07 / 07-a、07-b | frozen owner set、per-owner receiver、intent/outcome/compensation 分离；只形成 handoff record | 07-a Design Gate；07-b Test Gate | `AR-UP-006/009` open |
| `R-AR-IMP-011` | Query 为补齐视图触发 capture/verify/retrieve/probe/cache/telemetry write | PH-03 及全部回归 | write/effect spies；telemetry on/off 两姿态；任一 effect 触发 VETO-006 | 03-a Test Gate；08-b release gate | open / P0 redline |
| `R-AR-IMP-012` | outbound candidate 在合同未闭合时进入 outbox/topic/publisher/config/evidence | 所有 Phase | 每 boundary dependency/config/store/report scan；出现即 VETO-009；若未来需要必须回开 02～07 | 每 Commit Gate；08-b VETO Gate | `AR-HLD-Q-001` blocked candidate |
| `R-AR-IMP-013` | raw/report/EV 跨 run 拼接、静态生成或未脱敏 | PH-01/08 | raw-first、fixed run、canonical digest、read-only report generation、redaction/link audit | 01-b schema；08-a/b Evidence Gate | local/evidence blockers open |
| `R-AR-IMP-014` | 无 workload authority 却填吞吐、容量、timeout、RTO/RPO 或 readiness | PH-01/08 | 结构性 bounds 与 measured lane 分离；SP-AR-012 未采纳时保持 `blocked/not_run` | 01-b config；08-b measured lane | `AR-HLD-Q-002` open |
| `R-AR-IMP-015` | boundary 过大、跨 Phase 或设计缺口被实现端自行补齐 | PH-01～08 / 16 boundaries | 单 boundary 单 commit；超过批次阈值在 boundary 内拆批；字段/DTO/state/port 缺口立即 wait_design | 每 Design/Scope/Commit Gate | open |

## 8. 18 个持续 blocker/pending 的截止矩阵

| blocker | owning party / 正式回写点 | 首个阻塞 boundary | 必须得到的关闭材料 | 禁止 workaround | 未关闭时动作 |
|---|---|---|---|---|---|
| `AR-UP-001` | 各 L1 truth project 正式 export/snapshot 合同 | 04-a | per-owner schema/version/fence/coverage + binding/vector | workspace 或 sibling source 补真相 | 04-a formal positive blocked |
| `AR-UP-002` | `L1-work` / 项目状态正式 owner | 06-b；07-a | lifecycle trigger/restore handoff decision + currentness vector | Archive 推断 archived/restored | zero effect；plan/handoff blocked |
| `AR-UP-003` | `L1-governance` 或明确 governance owner | 06-b | retention/hold/delete/risk authority + conflict/expiry vector | 默认期限、默认 allow、Archive 风险接受 | lifecycle execution blocked |
| `AR-UP-004` | integrity/security/schema owner（待指定） | 05-a | algorithm/key-ref/canonicalization/compression/schema target + verify vector | test hash、静态 digest、fake success | assessment positive blocked |
| `AR-UP-005` | storage/operations owner（待指定） | 06-a | provider-neutral outcome/commit/probe/retrieval/cleanup contract + binding | ACK=commit、timeout retry、供应商私有 truth | placement/retrieval blocked |
| `AR-UP-006` | `L1-artifact` | 04-b；07-a | approved body/ref/lineage closure + compatibility/material vector | ref set 冒正文或 lineage closure | closure/restore material blocked |
| `AR-UP-007` | `L4-observability` | 04-a；07-b；08-b | audit/evidence export、redaction、coverage/provenance/verification handoff | telemetry/log 摘要冒审计链 | observability material/formal EV blocked |
| `AR-UP-008` | `L1-workspace` | 04-a | 受限 read/export contract、coverage、Auxiliary 标记 | projection 冒任何 canonical truth | workspace lane unavailable/partial |
| `AR-UP-009` | 各 truth owner / restore receiver owner | 07-a | owner receiver/schema/outcome/probe/compensation/finality vectors | direct DB、fallback receiver、ACK=commit | per-owner item blocked |
| `AR-ARCH-001` | 全局依赖标准 owner + `L0-sdk` owner | 01-a | owning docs 对齐 + actual graph/contract check | Archive→SDK compile | 01-a blocked |
| `AR-HLD-Q-001` | L4-archive architecture + Bus/consumer owners | every boundary；08-b | 只有需要 outbound 时才需正式 ADR/payload/UoW/topic/consumer；当前关闭条件是 absence verified | 私建 outbox/topic/publisher/delivery/evidence | candidate remains blocked；出现即 VETO |
| `AR-HLD-Q-002` | workload/product/acceptance/operations owner | 01-b；08-b measured lane | workload/environment/method/window/threshold | 任意默认数字或 local sample 推 SLA | numeric lane blocked/not_run |
| `AR-03-LOCAL-001` | L4-archive protocol/config/security owner，回写 03/04 | 02-a/02-b | operation codec/input digest decision + parity/restart tests | JSON/string拼接、随机 key、临时 hash | mutation production lane blocked |
| `AR-03-LOCAL-002` | L4-archive query/store/security owner，回写 03/04 | 03-a/03-b | cursor mapping/codec、snapshot/visibility binding + tamper/restart tests | offset 暴露、unsigned cursor、service 私有 map | continuation positive blocked |
| `AR-03-LOCAL-003` | L4-archive infra owner，回写 03/04 | 02-b | durable UoW/CAS/read-set/probe/fence/restart binding + faults | in-memory 证明 durability | durable lanes blocked |
| `AR-03-LOCAL-004` | L4-archive config/environment owner，回写 04 | 01-b | 55-key machine schema、required values/refs/cross-field/secret resolution | sample/default/环境变量绕 strict parser | runtime assembly blocked |
| `AR-03-LOCAL-005` | L4-archive observability/operations owner，回写 03/04/05/06 | 01-b/03-a；08-a | safe sink、redaction、non-interference、material handoff binding | log 存证、sink success 推 evidence | formal evidence lane blocked |
| `AR-03-LOCAL-006` | L4-archive project/implementation owner | all；首个 01-a | 用户实施授权、目标仓、baseline、真实实现/run | 本设计轮写代码或造运行事实 | project implementation blocked |

该表给出最迟门禁，不给出虚构日期。任一 owner 关闭材料必须带版本/baseline、适用范围和验证向量；只有状态文字或聊天确认不能关闭 blocker。

## 9. 待确认事项

| ID | 待确认问题 | decision owner | 必须落点 | 截止点 | 未确认姿态 |
|---|---|---|---|---|---|
| `Q-AR-IMP-001` | 目标实现仓是否创建、路径/所有权/branch policy 与 immutable design baseline 是什么 | 用户 + implementation owner | project implementation ledger | PH-01 activation 前 | whole project blocked |
| `Q-AR-IMP-002` | Core shared contract 的 exact package/export/version/lock 与 SDK 方向如何统一 | Core/SDK/依赖标准 owners | owning formal docs + dependency manifest | 01-a Design Gate | no compile edge |
| `Q-AR-IMP-003` | operation key/input digest、cursor mapping 的正式算法/版本/key-ref/migration 分别是什么 | Archive protocol/query/security owners | 正式 03/04 + vectors | 02-a、03-a Design Gate | mutation/continuation blocked |
| `Q-AR-IMP-004` | durable store/UoW、config schema、telemetry binding 的实际实现和 profile binding 是什么 | Archive infra/config/operations owners | 正式 03/04/05/06 + binding manifest | 01-b/02-b/08-a Gate | assembly/durable/evidence blocked |
| `Q-AR-IMP-005` | 8 source 的正式 export/material/visibility/coverage 如何逐 owner 绑定 | 各 truth/material owner | owner formal contract + conformance manifest | 04-a Design Gate | per-source positive blocked |
| `Q-AR-IMP-006` | integrity/schema、storage、governance、restore receiver 的具名 owner 和正式 outcome contracts 是什么 | 对应待指定 owners | owning project formal docs + vectors | 05-a/06-a/06-b/07-a Gate | corresponding lane blocked |
| `Q-AR-IMP-007` | outbound 是否需要；若需要，payload truth、outbox UoW、topic、consumer 和 delivery owner 是谁 | Archive/Bus/consumer owners | ADR；重开 02/03/04/05/06/07 | 任何 outbound 代码前 | 当前 surface 分母为 0 |
| `Q-AR-IMP-008` | workload、容量、timeout、RTO/RPO 的 authority、方法和阈值是什么 | workload/product/operations/acceptance owner | approved workload profile + acceptance baseline | 08-b measured lane 前 | blocked/not_run；无数字 |
| `Q-AR-IMP-009` | PH-08 handoff 的具名 reviewer、审查独立性与 signoff authority 是谁 | 用户/acceptance owner | reviewer assignment + reviewed acceptance docs | 08-b activation 前 | handoff blocked；无 signoff |

## 10. 回写与禁止 workaround 规则

| 发现类型 | 必须回写 | 禁止做法 |
|---|---|---|
| owner truth/export/decision/material/receiver 缺口 | owning project 的正式文档和其 ledger；L4-archive 只登记 blocker/ref | Archive 复制 schema、保存/反写 owner truth、从 workspace/log/ref 推导 |
| L4 对象/字段/DTO/状态/port/UoW/error 缺口 | `03-详细设计.md` 对应 Step 与正式章；联动 05/06/07 | implementation private helper/map/error string 补设计 |
| config/profile/secret/codec/budget 缺口 | `04-配置设计.md` 对应 Step；联动测试/验收 | 默认值、硬编码、sample 当 production binding |
| TC/EV/VETO/report schema 缺口 | `05-测试方案.md` / `06-验收标准.md` / 07 Step 7 | 静态 pass、跨 run 拼接、手工补 EV |
| Phase/boundary 粒度或依赖方向冲突 | 07 Step 5/6/8/11 与全局依赖 owner | 在实现仓临场跨 boundary 或新增 compile edge |
| outbound 新需求 | 重开 02 Step 6～9，并级联 03～07 | 只在 adapter/配置/脚本中偷偷加入 |

回写后必须形成新的设计 baseline，重跑受影响 boundary 的 Design Gate 和闭环审计；旧 Spike/result/report 保留为历史输入，不得覆盖。

## 11. 回填草稿与跨风险审计

正式 `07` §9 应保留：12 个 planned Spike 的问题/输出/owner/截止/证明上限、15 类实施风险、18 blocker 截止矩阵、9 项待确认和回写规则。可压缩重复背景，但不能删除 workspace Auxiliary、Query no-write、owner zero-write、intent-before-effect、outbound absence、raw-first 和无数值 readiness 红线。

| 审计项 | 结论 | 当前限制 |
|---|---|---|
| Spike 是否都有明确输出与时间盒 Gate | 通过（计划层） | 12/12 未执行 |
| 风险是否绑定 Phase/boundary | 通过 | 15/15 有影响与截止点 |
| 18 blocker/pending 是否都有 owner、关闭材料、禁用 workaround | 通过 | 18/18 全部开放 |
| formal blocker 是否被 fake/Spike 降级 | 否 | positive lane 继续 blocked |
| 是否存在长期悬空“后续确认” | 否 | 9 项均绑定首个 Design/Evidence Gate |
| 是否新增 owning-project blocker | 否 | 仅将既有缺口转译为执行门禁 |
| 当前是否可实施/测试/提交 | 否 | 用户只授权设计；目标仓/baseline/run 均不存在 |

## 12. 自检与进入下一步条件

- [x] Spike、风险和待确认事项已分类，均有 owner、输出/动作和 Gate 截止点。
- [x] 18 个持续 blocker/pending 全量映射到 16 boundary，未被合并消失或伪造关闭。
- [x] owner 回写、本项目设计回写和全局依赖回写责任分开。
- [x] Spike 不产生 production truth、formal evidence、风险接受或 readiness。
- [x] Step 8 的依赖分类、profile/fake 上限与 Step 7 的 blocked-positive 门禁保持一致。

`gate_status = pass_with_all_execution_blockers_retained`；`next_allowed_action = create_and_complete_step_10_rollback_pause_change_control`。
