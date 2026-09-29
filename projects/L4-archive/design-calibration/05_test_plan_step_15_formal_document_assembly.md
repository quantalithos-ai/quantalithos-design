# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15\
> 正式回填：完整 `05-测试方案.md`\
> 日期：2026-09-13\
> 状态：`completed / formal_document_assembled / stop_review`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 15：整理正式测试方案文档 |
| 目标 | 将 Step 1～14 已收口中间产物重新组织为符合 15 章主链的正式 `05-测试方案.md`。 |
| 输入 | Step 1～14；测试方案书写规范；讨论中间产物规范；正式 00～04。 |
| gate_status | `completed / formal_document_assembled / stop_review` |
| gate_reason | 正式 05 已按 15 章整体重建；来源、分母、命名、状态、配置、证据、blocker、污染和格式静态审计通过；未产生执行事实。 |
| next_allowed_action | 等待用户审查与新的明确 06 授权；除审查修订外不得改写正式 05。 |
| source_files | `design-calibration/05_test_plan_step_01_input_boundary.md` 至 `05_test_plan_step_14_regression_risks.md`；测试方案 SOP/书写规范。 |

### 1.1 Step 内计划

| 批次 | 正式范围 | 主要来源 | 状态 | 完成门禁 |
|---|---|---|---|---|
| 15A | 删除旧正式文档并创建元信息、§1～§3 | Step 1～3 | done | 15 章骨架、边界、固定分母和 18 CUT 明确 |
| 15B | §4～§6 | Step 4～6 | done | 分层、追溯、102 TC 完整且无 phase 越界 |
| 15C | §7～§10 | Step 7～10 | done | 26 DS、环境/profile、55 key、suite/gate/NFR 边界闭合 |
| 15D | §11～§14 | Step 11～14 | done | 缺陷、进退、machine evidence、回归/residual 收口 |
| 15E | §15 与全文静态审计 | 全部 Step/标准 | done | 来源块、15 章、分母、链接、blocker、污染、diff check 通过 |

## 2. 本步输入与正式化边界

| 输入 | 装配用途 | 不允许的变化 |
|---|---|---|
| Step 1～5 | 上游关系、范围、CUT、层级、F/BR/NFR/VETO 追溯 | 不新增需求、AC、对象、协议或测试优先级。 |
| Step 6～10 | 102 TC、26 DS、环境/config、13 suites/5 gates/14 scripts、专项 | 不把 planned/blocked 写成 implemented/passed。 |
| Step 11～14 | 缺陷、entry/exit、19 EV/schema、回归/residual | 不创建真实缺陷、run、EV、risk acceptance 或 verdict。 |
| 正式 00～04 | 唯一项目内需求/架构/对象/协议/状态/config 真相 | 不用测试文档修补上游 schema/owner。 |
| historical 05/06/README/draft | 污染审计 | 旧对象、供应商、期限、算法、阈值和成功结论不得继承。 |

正式 05 只说明“未来如何测试、留证和回归”。文档完成表示测试设计基线可供 06/07 消费，不表示 local/formal execution entry、测试通过、验收通过或 readiness。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否按 15 章主链组织？ | 是；严格采用书写规范 §3 的固定标题，不增删或改名。 |
| 是否保留全部 P0 对象、场景、数据、环境、门禁和证据？ | 是；保留 `6/26/8/7/30/32/18/8`、102 TC、26 DS、12 域/55 keys、13 suites、5 gates、14 scripts、19 EV family。 |
| 是否删除 SOP 问题原文和讨论语气？ | 是；问题回答、historical 诊断、取舍和停审记录仅留在 calibration，正式正文使用收口语气。 |
| 未确认项是否进入 residual？ | 是；外部合同、本地实现、数值阈值、产品/provider、证据保留和验收角色进入 §14/blocker，不写成结论。 |
| P0 用例是否回指正式设计？ | 是；§3/§5/§6 使用 03/04 的正式对象、协议、状态、UoW、错误和配置来源。 |
| 是否存在旧状态/字段/phase 越界？ | 装配中逐批审计；不得使用 historical `ArchivedSnapshot`/cold-index 口径，不把 Accepted/Sealed/Verified/item Succeeded 升格 owner/project 状态。 |
| 能否被正式 06 直接消费？ | 可以消费 planned TC/EV、entry/exit、VETO、report 和 residual；但 AC/VETO 正式编号、verdict、risk acceptance/signoff 仍由 06 创建。 |

## 4. Historical material 诊断与改动前后对比

| 旧正式 05 | 当前问题 | 重建处置 |
|---|---|---|
| 12 章，章节顺序不符规范 | 缺独立上游关系、切口、证据 machine schema、正式参考等章节 | 删除并按固定 15 章整体重建。 |
| `ArchivedSnapshot`、`ArchiveRecord`、index/timeline/RCA 对象 | 与正式 26 对象、30/32 surfaces 不一致 | 不继承；改用 request/source/bundle/assessment/placement/lifecycle/restore/handoff 主线。 |
| 14 个 `TC-001`、无稳定 evidence | 无法追溯当前 F/BR/CUT/协议，日志不能作为证据 | 使用 Step 6 的 102 个 `TC-AR-*` 和 Step 13 的 19 planned `EV-AR-*`。 |
| 固定 PostgreSQL/S3/MinIO/Glacier、digest、7 年、`<3s`、100% | provider/policy/algorithm/workload authority 缺失 | 删除并保留 adapter seam、typed unknown、blocked formal lane 与 residual。 |
| mock staging 即 E2E success | fake 冒 authority/durability/finality | local/controlled/formal-seam 分开；formal prerequisite 缺失为 blocked。 |
| `[待定 CI artifacts]` 和日志列表 | 路径、schema、digest、redaction、pairing 不闭合 | 使用固定 run raw/report 目录与 Step 13 machine schema。 |

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式结构 | 旧 12 章 | 规范固定 15 章 | 可被 06/07 稳定引用。 |
| 设计真相源 | historical object/operation | 正式 00～04 + Step 1～14 | 防止领域和 phase 污染。 |
| 测试分母 | 14 个松散 case | 18 CUT、102 TC、26 DS、13 suites、19 EV family | 可执行、可追溯、可审计。 |
| 外部正向 | fake/环境假设 | P0 required + blocked，negative/fail-closed 可执行 | 不伪造外部成功。 |
| 证据/退出 | 日志和 checklist | fixed-run raw→report→EV + local/formal/full exit | 文档完成与执行完成分离。 |

## 5. 正式化设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 用例呈现 | 正式文档保留 102 TC 的 family/精确 ID 范围和关键逐入口矩阵；完整断言展开链接 Step 6 | 原样复制 332 行 Step 6 | 正式正文保持可读，且不丢具体定位入口。 |
| machine schema | 正式 §13 保留 exact enum、核心 DTO 字段、digest 和路径；细粒度表链接 Step 13 | 只写“见 calibration”或全文重复 | 正文可落码，同时避免双重真相。 |
| blocker 呈现 | §1/2/8/10/12/14 按测试影响贯通 | 只在尾部列风险 | required positive lane 不会在执行时消失。 |
| 来源块 | 每章引用具体 Step 文件和对应阅读小节 | 统一写“详见 design-calibration” | 满足可追溯规范。 |
| 当前事实 | 统一声明 0 run/artifact/report/EV/verdict/readiness | 创建示例 ID 或勾选未来 checklist | 避免静态造证据。 |

## 6. 章节装配映射

| 正式章节 | 校准来源 | 必须保留的核心结论 |
|---|---|---|
| §1 | Step 1 | 正式 00～04 输入、historical 05/06 边界、blocker 转译。 |
| §2 | Step 2 | P0/P1/P2 × execution status、范围/非范围、VETO。 |
| §3 | Step 3 | 6 crates、26 objects、8 services、7 ports、30/32、18 states、18 CUT。 |
| §4 | Step 4 | 六层策略、最早发现层、fake/formal 分离。 |
| §5 | Step 5 | F/BR/NFR/VETO→CUT→TC→EV 双向追溯。 |
| §6 | Step 6 | 102 TC family、逐入口/状态/一致性/恢复/VETO 断言。 |
| §7 | Step 7 | 26 DS、builder/vector/double、隔离/清理/敏感边界。 |
| §8 | Step 8 | 7 环境、6 profiles、依赖类型、12 域/55 key、unavailable 姿态。 |
| §9 | Step 9 | 13 suites、5 gates、14 scripts、planned 路径与阻断语义。 |
| §10 | Step 10 | 安全/一致性/恢复/NFR/观测专项和数值证明上限。 |
| §11 | Step 11 | S/A/B/R、VETO 不可降级、复验和 failed/fixed evidence。 |
| §12 | Step 12 | local/formal/release entry、local/full exit、pause/VETO；当前未进入。 |
| §13 | Step 13 | machine schema、digest、19 EV、fixed path、真实性/脱敏。 |
| §14 | Step 14 | 变更触发、最小/全量回归、residual、P0 redline、06 handoff。 |
| §15 | Step 1～14 | 正式输入、标准、校准索引、historical 06 边界。 |

## 7. 分批写入与自检记录

| 批次 | 目标 | 当前状态 | 自检结果 |
|---|---|---|---|
| 15A | 元信息、§1～§3 | done | historical 正文已整体替换；边界、6/26/8/7/30/32/18/8 与 18 CUT 一致 |
| 15B | §4～§6 | done | 六层策略、F/BR/NFR/VETO 追溯及 19 families/102 TC 分母一致；Query/phase 边界无漂移 |
| 15C | §7～§10 | done | 26 DS、7 环境/6 profiles、12 域/55 keys、13 suites/5 gates/14 scripts 和专项边界一致 |
| 15D | §11～§14 | done | S/A/B/R、entry/exit、machine schema、19 EV、回归/residual 和 06 handoff 收口 |
| 15E | §15/全文 | done | 15 章/15 来源块/15 延伸阅读完整；污染与 `git diff --check` 审计通过 |

## 8. 回填草稿边界

正式文档必须：

- 每章开头列具体校准来源和延伸阅读；
- 使用正式 03/04 名称和固定分母；
- 将所有路径、suite、script、evidence 标记为 planned；
- 明确 Query strict no-write、workspace `Auxiliary`、owner restore handoff 和三 outbound candidates blocked；
- 明确 external/final/durable 正向不能由 fake 证明；
- 明确 `acceptance_refs=[]` 直到正式 06 建立映射；
- 明确当前 0 test run、0 artifact、0 report、0 evidence instance、0 verdict/signoff/readiness。

## 9. 待确认事项

| 待确认 | 当前处置 |
|---|---|
| `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002` | 保持上游 blocker，指向 owning project/标准 owner；不在 05 关闭。 |
| `AR-03-LOCAL-001～006` | 保持本地 pending；待 07/实现阶段排期和真实证据。 |
| 正式 06 的 AC/VETO/风险接受/裁决 | §13/14 只预留 handoff，不创建编号或结论。 |
| provider、算法、密钥、阈值、保留期限 | 继续 fail-closed/pending；不在装配时补造。 |

## 10. 跨文档一致性复核

### 10.1 真相源与字段闭环

| 设计事实 | 真相源 | 正式 05 承接 | 冲突处理 |
|---|---|---|---|
| A1～A9、F/BR/NFR/VETO 方向 | 正式 00 §7～§14 | §2/§5/§10/§12/§14 | 不在 05 新增需求或 AC；冲突回写 00 |
| owner/source authority 与依赖分类 | 正式 00 §11～§12、01 §8～§10 | §1/§3/§5/§8/§14 | workspace 固定 Auxiliary；runtime/event/ref/adapter/fake 不升格 compile |
| 6 CP、26 objects、30 logical entries | 正式 02 §5～§10 | §3/§5/§6 | 05 不重命名或增加对象/入口 |
| 6 crates、8 services、7 ports、32 methods、18 states | 正式 03 §4～§15 | §3/§6/§10/§14 | 字段/状态/phase/error 无来源即暂停并回写 03 |
| 12 domains/55 keys/6 profiles | 正式 04 §6～§12 | §7～§10/§12/§14 | 05 不补默认值、provider、算法或 activation |
| TC/DS/suite/script/evidence schema | 05 Step 6～14 | 正式 §6～§14 | 中间产物与正式正文冲突时先修 05，不能由实现者选边 |

| 闭环面 | 输入→断言→证据 | 审计结论 |
|---|---|---|
| public DTO/ref/envelope | 03 §7 exact carrier → CONTRACT/C/Q/E/J TC → EV CONTRACT/entry families | 闭合；private/raw 字段有负向 |
| Domain objects | 03 §5～§6 的 26 对象 → OBJECT-001～006 → EV-AR-OBJECT-001 | 26/26，按 CP parameterized，不扩对象分母 |
| Query response/view | Q01～Q05 + current visibility/cursor → QUERY-001～005 → EV-AR-QUERY-001 | telemetry on/off strict zero-write；continuation positive blocked |
| Event/Job DTO → Domain | E01～E05/J01～J17 fixed payload/target → CONSUMER/JOB TC → corresponding EV | 30 logical/32 methods 完整；E04/J12 双 route 不合并 |
| source/material/ref | 8 owner classes → AUTHORITY/RESTORE negative/formal lanes → EV authority/restore | workspace Auxiliary、artifact ref≠body、observability summary≠audit chain |
| config/runtime builder | 55 keys + exact slots → CONFIG-001～004 → EV-AR-CONFIG-001 | invalid winner/fake/required missing fail-closed |
| raw/report/EV | Step 13 five machine DTOs → REPORT-001～002/checks → 19 EV families | fixed run、digest、redaction、pairing和tc_refs闭合；实例为0 |

### 10.2 状态、phase 与命名闭环

| 闭环项 | 核对 | 结论 |
|---|---|---|
| 18 state subjects | 正式 03 §9 ↔ 正式 05 §3.1/§6 STATE-001～018 | 集合一致；无 GlobalState 或 historical 状态 |
| phase boundary | admission、capture、seal、assessment、placement、lifecycle、restore item/handoff 分轴 | Accepted/Sealed/Verified/Succeeded 均不推导 owner/project/global success |
| commit/effect | UoW/CAS/read-set/fence、intent-before-effect、dispatch knowledge、exact probe | duplicate/unknown/partial/reconcile 均有 TC 与 suite；fake 不证明 finality |
| naming | `TC-AR-*`,`DS-AR-*`,`EV-AR-*` 与 archive suite/path | 102/26/19 唯一分母；无旧 `TC-001～014` alias |
| forbidden historical names | ArchivedSnapshot、ArchiveRecord、cold index、fixed provider/tier/期限/阈值 | 仅在 historical 污染说明出现，不作为正式对象/断言 |
| future 06 boundary | `acceptance_refs=[]`、无 AC/verdict/risk/signoff/readiness | phase 正确；06 未进入 |

### 10.3 冲突、静态检查与事实审计

| 检查 | 结果 | 限制 |
|---|---|---|
| 15 章及来源块 | 15/15 标题、15/15 具体校准来源、15/15 延伸阅读 | 正式章节未保留 SOP 问答/取舍/停审记录 |
| 分母 | 6/26/8/7/30/32/18/8；18 CUT；102 TC；26 DS；55 keys；13 suites；5 gates；14 scripts；19 EV | range 写法必须在未来 registry 展开 exact ID |
| blocker | 12 upstream/architecture + 6 local pending 全部可见 | 无 fake、ACK、日志、配置或静态 closure |
| Markdown/whitespace | `git diff --check -- projects/L4-archive` 通过 | 仅静态文档检查，不是项目测试 |
| 执行事实 | run/artifact/report/EV/verdict/risk/signoff/readiness 全为 0 | 未执行实现、测试或证据生成 |
| 新冲突 | 无新增 owning-project blocker | 既有 blocker 保持开放 |

## 11. Step 15 完成门禁

- [x] 正式 `05-测试方案.md` 已按 15 章主链整体重建。
- [x] §1～§15 每章都有具体 Step 校准来源与延伸阅读。
- [x] 102 TC、26 DS、18 CUT、13 suites、5 gates、14 scripts、19 EV family 和固定架构分母一致。
- [x] 正式对象/协议/状态/config 名称无 historical 污染或 phase 越界。
- [x] blocker、formal P0 required lane、fake 证明上限和 residual 保持可见。
- [x] machine schema/path/digest/redaction/pairing 可落码，且未生成实例。
- [x] 无真实 run、artifact、report、EV、pass/fail、verdict、risk acceptance、signoff 或 readiness。
- [x] 静态链接、围栏、表格、章节、来源块和 `git diff --check` 通过。
- [x] flow/项目台账更新为 `formal / stop_review`；下一动作是等待用户明确授权 06。

```text
formal_05_status = formal / stop_review
test_plan_current_step = 15_completed_formal_stop_review
test_plan_next_allowed_action = wait_for_user_review_and_explicit_06_authorization
formal_05_write_allowed = false_except_review_fixes
test_execution_allowed = false
implementation_write_allowed = false
commit_required = false
```
