# Step 5. 定义功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5  
> 回填章节：`06-验收标准.md` §5 功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 00 §7/§9/§14；正式 02 §5～§10；正式 03 §5～§12；正式 05 §5～§6/§13 |
| 输出文件 | `design-calibration/06_acceptance_step_05_function_gate.md` |
| 逐项范围 | `AC-CON-001～007`、`AC-FR-001～012`；`AC-FR-013` conditional |
| 实际 item result | 全部 `not_evaluated`；当前验收未进入 |
| 下一动作 | 只允许进入 Step 6 |

## 2. 本步计划与目标

本步按六个核心能力逐项执行“验收项 → 正式设计 → TC → future EV → fixed report → 通过/失败 → 裁决影响 → 停审”，然后单独审查外围 `AC-FR-013`，最后执行跨功能门禁审计。

本步只形成未来裁决合同。表中的 `pass/fail` 是判定规则，不是当前结果；`EV-*-001` 仍是 family，不是 evidence instance。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| `00` §7/§9/§14 | C1～C6、FR 与稳定 AC 原文 |
| `02` §5～§10 | 五组成部分、对象、流程、状态和异常轮廓 |
| `03` §5～§12 | 十模块、5 Command、16 Query、topic flow、状态/一致性/恢复正式契约 |
| `05` §5～§6 | AC 覆盖与 96 TC 的可判定断言 |
| `05` §13 | 八个 future EV、artifact/report/evidence 资格 |
| Step 2～4 | conditional positive、baseline/facet、进入/退出裁决 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能通过条件是什么？ | 见 §8.1；必须满足正式 phase/state、truth boundary、no-write/no-replay、局部降级和 a11y 语义，且有合格 fixed-run evidence。 |
| 失败条件是什么？ | 见 §8.1；任一安全越界、phase 提升、owner truth 合成、核心路径不可达或 required evidence 缺失均失败；命中 VETO 时总体不通过。 |
| 证据来自哪里？ | 96 TC 中列明的 family，经 blocking suite 形成八个 EV instance，并由 `reports/runs/<run_id>/evidence-index.md` 回指 raw artifact。 |
| P1/外围如何处理？ | `AC-FR-013` 和 exact positive facets 只有 baseline enabled 后要求 positive；未启用须诚实 disabled/read-only/partial/blocked。 |
| 哪些失败导致总体不通过？ | 任一 in-scope P0 `AC-CON-001～007` 或 `AC-FR-001～012` 失败；七项 VETO 相关失败不可风险接受。 |
| 是否完整回指 design/TC/EV/report？ | 是，见 §8.2。 |
| 是否逐项停审？ | 是，见 §8.3，20/20 项均完成设计闭环自审；不是执行结果。 |
| 是否存在孤儿、重复或冲突？ | 未发现，见 §8.4；复用 EV 是同一证据支持多个 AC，不代表重复裁决。 |

## 5. 当前文档问题诊断

| 旧正文问题 | 本步处理 |
|---|---|
| 门禁围绕 OpenWorkspace/OpenPanel/QuickAction 等旧对象 | 全部废弃，改用正式 AC、Command/Query/topic/state 名称 |
| 通过条件只写“形成对象”或“功能可用” | 改为 phase、side effect、truth boundary 和 evidence 可判定条件 |
| 证据写 API/DB/[] | 改为 TC + EV + fixed-run report/artifact/digest |
| owner positive 与 disabled safety 混为一体 | 按 baseline enabled manifest 分层 |
| 页面行为可被误作授权/成功/readiness | 明确 route/menu/toast/cache/profile 均无提升权 |

## 6. 改动前后对比

| 项 | 旧 | 新 | 原因 |
|---|---|---|---|
| 功能轴 | workspace/panel/action/dashboard | C1～C6 + 5 Command + 16 Query + 八 topic | 对齐 00～05 |
| 通过条件 | 对象出现/页面可用 | formal source、状态、phase、side-effect 与安全上限 | 可裁决 |
| 失败条件 | 泛化 negative flow | 精确错误、非法提升、write/replay/leak/isolation failure | 可复验 |
| 证据 | API/DB/空占位 | TC/EV/fixed report/raw pair | 可追溯 |
| positive | 默认或模糊 | enabled 后 contract-derived required | 保真 blocker |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否另造功能验收 ID | 否；复用需求的稳定 `AC-CON-*` / `AC-FR-*` |
| 同一 TC/EV 可否支撑多个 AC | 可，但每个 AC 必须有独立通过/失败和裁决影响；evidence index 保留多对多追溯 |
| controlled fake 能否让 topic positive 通过 | 只能证明 safety/composition；不能证明 exact owner integration |
| formal command 未开放时如何通过 | 必须 no-call + blocked/read-only；不得要求或宣称 submit positive |
| enabled formal command 如何通过 | exact contract 同源、qualification current、单次 submit、正式结果/unknown 语义与合格 positive evidence 均需成立 |
| a11y semantic 与具体兼容是否相同 | 否；semantic C1～C6 是 P0，具体 browser/AT matrix 由 authority 选择 |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | Future 证据 |
|---|---|---:|---|---|---|
| `AC-CON-001` | 可信 actor/scope 与失效保护 | P0 | protected view/intent 均绑定 `AccessContext`；`unresolved/expired/revoked/conflict/unknown` 安全收紧、清旧 scope、最小披露 | 非 current context 仍披露/submit；route/carrier 恢复 `verified`；旧结果污染新 scope | FLOW/SECURITY/INTEGRATION |
| `AC-CON-002` | 入口可见性与动作资格 | P0 | visibility/qualification formal-derived；restricted/disabled/unknown/unavailable 保真；三通道同 guard | menu/route/button/role/flag/cache 放宽；restricted 泄露对象存在性 | FLOW/SECURITY/ACCESSIBILITY |
| `AC-CON-003` | owner-safe 查询与探索 | P0 | safe map 先于 filter/window；owner/source 与五轴保真；empty/blocked/unavailable/unknown 区分；16 Query write=0 | raw/hidden body 越界、轴压平、旧 value 伪新、Query/carrier/owner write | UNIT/FLOW/CONTRACT/SECURITY/ARCH |
| `AC-CON-004` | 草稿、提交与正式结果 | P0 safety；enabled positive | draft/request/result phase 保真；唯一 owner write 只可能 `OwnerCommandPort.submit`；ambiguous→unknown；无 replay | reviewable 当 authorized、receipt/toast/2xx 当 confirmed、double submit、unknown replay、terminal revive | UNIT/FLOW/CONTRACT/INTEGRATION |
| `AC-CON-005` | 八管理主题消费面 | P0 safety；per-owner positive conditional | canonical owner partitions、严格 empty、局部 failure、read-only/partial/blocked 保真；无第二 truth/verdict/readiness | owner truth 合成、failure 扩散/掩盖、pending 强行 active、正文/执行越界 | FLOW/INTEGRATION/SECURITY |
| `AC-CON-006` | 降级、恢复与可访问性 | P0 semantic | non-normal 形成 typed immutable plan；一次获准 action；视觉/键盘/AT 同 guard/outcome/recovery ceiling；状态非仅颜色 | generic retry/loop、stale plan 执行、action completion 当 recovered、任一核心目标仅视觉可用 | UNIT/FLOW/INTEGRATION/ACCESSIBILITY/SECURITY |
| `AC-CON-007` | C1～C6 整体闭环 | P0 | owner failure 局部化；新 formal observation 才恢复；无 command 时诚实只读闭环；全部适用 P0 门禁与 VETO evidence 闭合 | 某能力被 sibling success 掩盖、靠假 positive 补闭环、release smoke/计数替代底层证据 | FLOW/INTEGRATION/SECURITY/RELEASE |
| `AC-FR-001` | 语境锚定/转换/失效 | P0 | context resolve/switch/cleanup 顺序与正式生命周期一致；late result 被丢弃 | 不可验证仍 presentable；转换复用旧 selection/ref | FLOW/SECURITY/INTEGRATION |
| `AC-FR-002` | 安全导航与资格姿态 | P0 | formal visibility/qualification 决定入口和动作上限；最小披露 | 本地角色/route/config 产生 visible/qualified | FLOW/SECURITY/ACCESSIBILITY |
| `AC-FR-003` | owner-safe 读取/筛选/下钻 | P0 | safe material→snapshot/model；local filter/window 不改 source；link 正式 revalidate；no-write | raw body/filter-before-map、URL 代 typed link、empty 与 unavailable 混同 | FLOW/CONTRACT/SECURITY/ARCH |
| `AC-FR-004` | 草稿/复核/条件提交/回查 | P0 safety；positive conditional | local draft 与 owner result 分离；enabled 时 exact same-source contract、single submit；unknown 只 formal reconcile | 本地校验当授权、合同缺失仍 call、local save failure 重发、UI 状态当完成 | UNIT/FLOW/CONTRACT/INTEGRATION |
| `AC-FR-005` | 员工管理入口 | P0 safety；positive conditional | identity/member partitions 与 safe refs 保真；未闭口保持 read-only/partial/blocked | 推导角色/成员生命周期、泄露正文、缺合同仍开放动作 | FLOW/INTEGRATION/SECURITY |
| `AC-FR-006` | 项目/工作/过程/Workspace 监控 | P0 safety；positive conditional | work/process/workspace 分区、coverage/一致性/来源保真；局部故障可见 | 建立 projection/cursor/rebuild 或项目/workspace readiness；跨 owner 假原子 | FLOW/INTEGRATION/SECURITY |
| `AC-FR-007` | 方法资产管理入口 | P0 safety；positive conditional | 正式目录/版本/ref 与本地 draft 区分；无 command 时只读/blocked | draft 冒充版本、生成/保存正文、未开放仍 publish/approve | FLOW/CONTRACT/SECURITY |
| `AC-FR-008` | Governance/SoA/AIIA/Control/Gate 面板 | P0 safety；positive conditional | 只呈现 formal status/decision/evidence refs 与冲突/缺失姿态 | Console 生成 verdict/approval/Gate decision/evidence body | FLOW/INTEGRATION/SECURITY |
| `AC-FR-009` | 审计与指标只读视图 | P0 safety；positive conditional | audit/metric/report safe refs、coverage/freshness 保真；无客户端阈值裁决 | 固定数量/阈值生成 audit/compliance/readiness；diagnostic 当 audit | FLOW/INTEGRATION/SECURITY |
| `AC-FR-010` | Capability/Archive/Sandbox 管理入口 | P0 safety；positive conditional | 三 owner 状态轴、ref、入口分开；未闭口 pending/blocked；故障局部 | registration/archive/restore/run/cleanup truth 或 readiness 被本地推导/执行 | FLOW/INTEGRATION/SECURITY |
| `AC-FR-011` | 多轴降级与安全恢复 | P0 | partial/stale/missing/unavailable/conflict/unknown 分开；subject-specific action；无安全动作即停止 | 状态归一为 empty/success；retry-all/hidden loop；恢复放宽权限 | UNIT/FLOW/INTEGRATION/SECURITY |
| `AC-FR-012` | 等价可访问管理路径 | P0 semantic | 页面结构、资格、状态、确认、错误和恢复有可感知语义；同 action key/guard/input/outcome | 视觉可用抵消 keyboard/AT 失败；focus/announce failure 形成死路或绕 guard | ACCESSIBILITY/INTEGRATION |
| `AC-FR-013` | 外围个性化/趋势/批量 | conditional P2 | 仅 baseline enabled 且合同具备时：偏好不改权限、比较有 formal 可比语义、批量逐项可判别；否则 disabled | 无合同启用；趋势伪造可比；批量摘要冒充全成功；外围污染核心 P0 | UNIT/FLOW/CONTRACT/INTEGRATION |

所有 `Future 证据` 简写均指 `EV-<TYPE>-001` 的合格 instance。实际结论还必须通过 `reports/runs/<run_id>/evidence-index.md` 检查 instance 与 TC、suite、artifact/report/digest 同 run 绑定。

### 8.2 功能验收闭环矩阵

固定 report 入口均为 `reports/runs/<run_id>/evidence-index.md`；下表再列主要 suite report 族，raw 由 index 回指 `artifacts/test/<run_id>/...`。

| 验收项 | 正式设计契约 | 主要 TC | EV | 主要 report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-CON-001` | 03 §7 `ResolveAccessContext`/`RequestAccessContextSwitch`；§8.2/8.3；§9 context/shell | `TC-CTX-001～005`,`TC-SEC-001` | FLOW/SECURITY/INTEGRATION | `suites/console-module-flow.md`,`suites/console-controlled-composition.md` | 失败→P0 不通过；可能 VETO-002 |
| `AC-CON-002` | 03 §7 `GetNavigationVisibility`；§8.3；§9 qualification/visibility/navigation | `TC-NAV-001～004`,`TC-A11Y-001～003` | FLOW/SECURITY/ACCESSIBILITY | module-flow/semantic-a11y | 失败→P0 不通过；可能 VETO-002/006 |
| `AC-CON-003` | 03 §7 16 Query；§8.3/8.4；§10 Query no-write | `TC-VIEW-001～009`,`TC-ARCH-004` | UNIT/FLOW/CONTRACT/SECURITY/ARCH | module-flow/port-adapter/architecture-static | 失败→P0 不通过；可能 VETO-001/004/005 |
| `AC-CON-004` | 03 §7 5 Command；§8.2；§9 draft/request/result；§12 | `TC-INTENT-001～011`,`TC-CONSISTENCY-004～007` | UNIT/FLOW/CONTRACT/INTEGRATION | module-flow/port-adapter/concurrency-race | safety 失败→不通过；enabled positive 缺失→对应范围失败；VETO-003 候选 |
| `AC-CON-005` | 03 §7.4 Topic Query；§8.4；§9 activation | `TC-TOPIC-001～012`,`TC-SEC-005` | FLOW/INTEGRATION/SECURITY | controlled-composition/recovery/release-safety-smoke | safety 失败→不通过；positive 按 facet；VETO-005/007 候选 |
| `AC-CON-006` | 03 §8.5；§9 degradation/a11y；§11 recovery ceiling | `TC-RECOVERY-001～005`,`TC-A11Y-001～004` | UNIT/FLOW/INTEGRATION/ACCESSIBILITY/SECURITY | recovery-matrix/semantic-a11y | semantic P0 失败→不通过；具体 matrix 按 baseline；VETO-006 |
| `AC-CON-007` | 03 §5～§15 横切；05 §9/§13 | 全 96 TC 的 in-scope P0 + release checks | 八 EV family | gate-results + release reports | 任一适用核心空洞→不通过 |
| `AC-FR-001` | 03 §7.2 context switch；§8.2；§9 | `TC-CTX-001～005` | FLOW/SECURITY/INTEGRATION | module-flow/composition | 失败→不通过 |
| `AC-FR-002` | 03 §7.3 visibility；§8.3；§9 | `TC-NAV-001～004`,`TC-SEC-001/004` | FLOW/SECURITY/ACCESSIBILITY | module-flow/redaction/a11y | 失败→不通过 |
| `AC-FR-003` | 03 §7.3 owner view/status/link；§8.3；§10 | `TC-VIEW-001～005/009`,`TC-ADAPTER-001～003` | FLOW/CONTRACT/SECURITY/ARCH | module-flow/port-adapter/architecture | 失败→不通过 |
| `AC-FR-004` | 03 §7.2 submit/recovery；§7.3 request/reconcile；§8.2/8.3；§12 | `TC-INTENT-001～011`,`TC-CONSISTENCY-004～007` | UNIT/FLOW/CONTRACT/INTEGRATION | module-flow/port-adapter/concurrency | safety 失败→不通过；positive 按 facet |
| `AC-FR-005` | 03 §7.4 member；§8.4 member flow | `TC-TOPIC-001～004`,`TC-SEC-005` | FLOW/INTEGRATION/SECURITY | controlled-composition/redaction | safety 必需；positive `CON-Q-034/037` |
| `AC-FR-006` | 03 §7.4 project/workspace；§8.4 | `TC-TOPIC-001～003/005`,`TC-CONSISTENCY-003` | FLOW/INTEGRATION/SECURITY | controlled-composition | safety 必需；positive `CON-Q-039` |
| `AC-FR-007` | 03 §7.4 method；§8.4 | `TC-TOPIC-001～003/006`,`TC-INTENT-005` | FLOW/CONTRACT/SECURITY | controlled-composition/port-adapter | safety 必需；positive `CON-Q-040` |
| `AC-FR-008` | 03 §7.4 governance；§8.4 | `TC-TOPIC-001～003/007`,`TC-SEC-002～005` | FLOW/INTEGRATION/SECURITY | composition/redaction | safety 必需；positive `CON-Q-034/037` |
| `AC-FR-009` | 03 §7.4 observability；§8.4；§14 diagnostic boundary | `TC-TOPIC-001～003/008`,`TC-DIAG-001～004` | UNIT/FLOW/INTEGRATION/SECURITY | composition/redaction | safety 必需；positive `CON-Q-042/046` |
| `AC-FR-010` | 03 §7.4 capability/archive/sandbox；§8.4 | `TC-TOPIC-001～003/009～012`,`TC-SEC-005` | FLOW/INTEGRATION/SECURITY | composition/recovery | safety 必需；positive `CON-Q-041/043` |
| `AC-FR-011` | 03 §8.5；§9 degradation/recovery；§11 | `TC-RECOVERY-001～005`,`TC-CONSISTENCY-008` | UNIT/FLOW/INTEGRATION/SECURITY | recovery-matrix/concurrency | 失败→不通过 |
| `AC-FR-012` | 03 §5 recovery；§8.5；§9 a11y | `TC-NAV-002`,`TC-INTENT-009`,`TC-RECOVERY-005`,`TC-A11Y-001～004` | ACCESSIBILITY/INTEGRATION | semantic-a11y/selected-browser-at | semantic 失败→不通过；selected matrix 按 baseline |
| `AC-FR-013` | 00 §9.2/§14.2；03 当前只保留 future trigger | 适用 CONFIG/STATE/INTENT/TOPIC future TC | UNIT/FLOW/CONTRACT/INTEGRATION | selected scope report | baseline 未启用→disabled 合格；启用无合同/证据→失败 |

### 8.3 验收项逐项停审记录

| 验收项 | 设计来源正式 | TC/EV/report 固定 | 通过/失败可判定 | Phase/positive 边界 | 设计停审结论 |
|---|---|---|---|---|---|
| `AC-CON-001` | yes | yes | yes | formal context only | pass |
| `AC-CON-002` | yes | yes | yes | local only tightens | pass |
| `AC-CON-003` | yes | yes | yes | Query no-write | pass |
| `AC-CON-004` | yes | yes | yes | enabled positive conditional；unknown no replay | pass |
| `AC-CON-005` | yes | yes | yes | per-owner positive conditional | pass |
| `AC-CON-006` | yes | yes | yes | semantic P0；compatibility selected | pass |
| `AC-CON-007` | yes | yes | yes | no smoke/count substitution | pass |
| `AC-FR-001` | yes | yes | yes | formal observation only | pass |
| `AC-FR-002` | yes | yes | yes | no local authorization | pass |
| `AC-FR-003` | yes | yes | yes | safe map/no-write | pass |
| `AC-FR-004` | yes | yes | yes | submit positive conditional | pass |
| `AC-FR-005` | yes | yes | yes | safe/read-only allowed | pass |
| `AC-FR-006` | yes | yes | yes | no projection/readiness | pass |
| `AC-FR-007` | yes | yes | yes | draft ≠ version | pass |
| `AC-FR-008` | yes | yes | yes | no verdict/evidence body | pass |
| `AC-FR-009` | yes | yes | yes | diagnostic ≠ audit | pass |
| `AC-FR-010` | yes | yes | yes | owner states separated | pass |
| `AC-FR-011` | yes | yes | yes | action completion ≠ recovery | pass |
| `AC-FR-012` | yes | yes | yes | semantic vs selected matrix separated | pass |
| `AC-FR-013` | yes | yes | yes | conditional only | pass |

“pass”只表示门禁设计完成且自审通过；当前所有验收项执行结果仍为 `not_evaluated`。

### 8.4 跨功能门禁裁决审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 七个 core AC 是否全覆盖 | pass | 7/7 |
| 十二个核心 functional AC 是否全覆盖 | pass | 12/12 |
| peripheral AC 是否污染 P0 | pass | 单列 conditional |
| 是否存在无设计来源验收项 | none | 全部回指 00/03 |
| 是否存在无 TC/EV/report 验收项 | none | 20/20 有 future closure |
| 是否把 candidate/family 写成 instance | none | 全部明确 future |
| 是否把 disabled 当 positive pass | none | 只满足安全边界 |
| 是否把 fake safety 当 formal/production | none | positive 规则独立 |
| 是否存在 phase 越界 | none | receipt/toast/action completion 等均禁止提升 |
| 是否存在 evidence 路径断裂 | none in contract | 实际文件不存在，准入仍 blocked |
| 是否遗漏 VETO 影响 | none | Step 11 将逐项正式收口 |

## 9. 回填草稿

正式 §5 应保留 §8.1 的功能门禁与简化闭环入口，明确每项的 future EV 必须由 fixed run evidence index 回指真实 raw/report pair。正文不得写当前“通过”；应声明实际 item results 尚未评估。`AC-FR-013` 和所有 exact positive facet 按 baseline manifest conditional。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 某次送验 enabled owner/command facets | 决定 positive required 集合 | Step 3 manifest 必填 |
| selected browser/AT matrix | 决定 `AC-FR-012` 兼容层上限 | authority 到达后选择 |
| 外围 E01～E03 exact contracts/TC | 决定 `AC-FR-013` 正向 | 当前 disabled/conditional |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 20 个功能验收项逐项小循环完成 | pass |
| 每项设计/TC/EV/report/裁决影响闭环 | pass |
| conditional positive 与 safety 分离 | pass |
| 跨功能审计无 unresolved 冲突 | pass |
| 允许进入 Step 6 | yes |
| 允许修改正式 06 | no |
