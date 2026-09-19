# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节：`05-测试方案.md` §5
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_05_traceability_coverage.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 建立 `需求/规则/验收 → 正式设计 → 测试 cut → TC 候选 → future EV 槽` 与 `cut → 需求/规则/设计` 的双向追溯，检查 P0 孤儿需求、孤儿设计契约、孤儿 cut 与自动化缺口。

本文件中的 TC 是 Step 6 将细化的稳定候选族；`EV-CAND-*` 是 Step 13 之前的未来候选槽，Step 13 才定义正式 `EV-*` 证据族及其固定 run 绑定规则。它们不表示测试文件、run_id、artifact、report、coverage 或 evidence 已存在，也不表示任何验收项已通过。`covered_planned` 只表示“测试合同可被设计”，不是执行覆盖率。

## 2. 输入与覆盖词汇

| 输入 | 用途 |
|---|---|
| 00 §7～§14、§16 | 六能力、18 FR、33 BR、30 DR、13 IF、14 DEP、21 NFR、AC/VETO |
| 03 §5～§15 | 十模块、5 Command、16 Query、conditional consumer、状态/错误/并发/config/diagnostic/a11y |
| 04 §5～§12 | 四项配置、三 profile、strict/startup-only/zero-secret/failure posture |
| Step 3 | 19 个测试 cut |
| Step 4 | 七层风险发现栈和 P0 阻断语义 |

| 覆盖状态 | 精确定义 |
|---|---|
| `covered_planned` | 正/负向或纯负向 P0 测试合同已有正式设计依据；尚未实现或执行 |
| `covered_blocked_positive` | fail-closed/negative 合同可设计；formal positive fixture 被明确 blocker 阻塞 |
| `conditional_future` | P1/P2 或外围能力；仅记录启用条件和安全不启用姿态 |
| `not_covered` | 无可追溯测试入口；必须进入风险，不得静默 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每个 P0 需求对应哪些设计章节？ | C1/C2→03 §5.1～§5.3、§8.1～§8.3、§9；C3→§5.4、§7.3～§8.4、§10；C4→§5.5、§7.2、§8.2、§11～§12；C5→§5.6、§7.4、§8.4；C6→§5.7、§9、§11～§15；配置→04 §5～§12。 |
| 每个 P0 需求至少有哪些场景？ | 每项至少绑定 fail-closed/negative 或 formal-safe 主线、一个 cut、一个 TC 候选族和一个 future EV 槽；blocked positive 另外标明 blocker。 |
| 哪些场景必须自动化？ | P0 guard/state/flow/no-write/single-submit/redaction/config/partition isolation/a11y semantic/static absence 均为 future 自动化必选；不得以“人工确认”代替。 |
| EV 如何编号？ | 预留 `EV-CAND-UNIT-001`、`EV-CAND-FLOW-001`、`EV-CAND-CONTRACT-001`、`EV-CAND-INTEGRATION-001`、`EV-CAND-ACCESSIBILITY-001`、`EV-CAND-SECURITY-001`、`EV-CAND-ARCH-001`、`EV-CAND-RELEASE-001` 八个 future candidate 槽；Step 13 再定义正式 `EV-*` 证据族和由真实 run 生成索引的规则。 |
| 哪些需求暂未形成 positive coverage？ | C5 若干 owner 面、delegated submit、observed invalidation、production diagnostics、具体 browser/AT、durability 与量化目标被 `CON-Q-034～047` 阻塞；negative/safety posture 已覆盖。 |
| 每个 cut 是否有需求/规则/设计映射？ | 是，19/19 见 §10。 |
| 每个 P0 是否有 cut、TC 候选和 EV 槽？ | 是；矩阵按语义组逐项覆盖，P0 无 `not_covered`。 |
| 是否通过停审？ | 通过；无孤儿 P0 或 unresolved 冲突，blocked/conditional 项未伪装为 positive coverage。 |

## 4. TC 候选族与 Future EV 槽注册表

### 4.1 TC 候选族

| 候选族 | 负责范围 | Step 6 约束 |
|---|---|---|
| `TC-CTX-*` | session shell、AccessContext、context switch/失效 | 使用正式 context 状态与 exact-scope 规则 |
| `TC-NAV-*` | visibility、qualification、route/history/cleanup | route/menu/button 永不授权 |
| `TC-VIEW-*` | owner-safe view、五轴、safe link、query no-write | 逐名覆盖 Core Query 与 Topic Query |
| `TC-INTENT-*` | draft、5 Command、receipt/result/reconcile | submit-only owner write；unknown no replay |
| `TC-TOPIC-*` | 八管理主题、activation、owner partitions | 参数化 owner set/order 与局部失败 |
| `TC-RECOVERY-*` | degradation、typed error、recovery action | subject ceiling、one action、formal-only recovery |
| `TC-ADAPTER-*` | narrow Ports、mapper、fake/formal parity | exact positive 缺 contract 时 blocked |
| `TC-STATE-*` | scoped carrier、state matrix、replacement/invalidation | session-volatile、whole-record、exact scope |
| `TC-CONSISTENCY-*` | single writer/flight、late result、race/cancel | deterministic scheduler 与 call ledger |
| `TC-DIAG-*` | diagnostic whitelist/redaction/sink isolation | 不得等同 audit/evidence |
| `TC-CONFIG-*` | 四项配置、三 profile、source/load/change/failure | strict whole document、startup-only、zero-secret |
| `TC-SEC-*` | forbidden body、minimum disclosure、Policy/Gate/owner boundary | 七项 VETO 的安全交叉断言 |
| `TC-A11Y-*` | semantic region/action、keyboard/AT、focus/announce | 与视觉路径共用 action/guard |
| `TC-ARCH-*` | SDK-only、禁止依赖、0 Event/Job | future static/repeatable gate |

### 4.2 Future EV bundle 槽

| EV 槽 | future 来源上限 | 当前状态 |
|---|---|---|
| `EV-CAND-UNIT-001` | unit/pure-contract suite artifact + run report 索引 | `planned_slot_only` |
| `EV-CAND-FLOW-001` | module/flow suite artifact + call/state assertions | `planned_slot_only` |
| `EV-CAND-CONTRACT-001` | Port/adapter contract suite artifact | `planned_slot_only` |
| `EV-CAND-INTEGRATION-001` | controlled composition/failure-injection artifact | `planned_slot_only` |
| `EV-CAND-ACCESSIBILITY-001` | semantic accessibility suite；selected compatibility 另需 authority | `planned_slot_only` |
| `EV-CAND-SECURITY-001` | disclosure/redaction/forbidden-body scan artifact | `planned_slot_only` |
| `EV-CAND-ARCH-001` | dependency/surface/static scan artifact | `planned_slot_only` |
| `EV-CAND-RELEASE-001` | fixed-run report/manifest/traceability summary | `planned_slot_only` |

多个 AC 可消费同一 future candidate bundle，不等于重复或伪造 evidence；Step 13 必须由具体 TC 结果和固定 `<run_id>` 报告生成正式 `EV-*` 条目，禁止手写“EV passed”。

## 5. 六个核心能力覆盖矩阵

| 需求 ID | 设计依据 | 场景候选 | Cut | TC 候选 | 自动化 | Future EV | 覆盖状态 |
|---|---|---|---|---|---|---|---|
| `C-CON-1` | 03 §5.1～§5.2、§8.2、§9、§12 | verified/restricted/expired/revoked/conflict/unknown；显式 scope switch 与旧结果丢弃 | ENTRY/ACCESS/STATE-MATRIX | `TC-CTX-*`;`TC-STATE-*` | required | UNIT/FLOW | `covered_blocked_positive`（exact scope owner pending） |
| `C-CON-2` | 03 §5.2～§5.3、§8.3、§9 | formal visibility/qualification 上限；route/menu/cache 不授权；撤销后 cleanup | ACCESS/NAV/SEC | `TC-NAV-*`;`TC-SEC-*` | required | UNIT/FLOW/SECURITY | `covered_blocked_positive` |
| `C-CON-3` | 03 §5.4、§7.3～§8.4、§10 | 五轴独立、safe mapper、formal empty、filter-after-map、16 Query no-write | VIEW/QUERY/ADAPTER | `TC-VIEW-*`;`TC-ADAPTER-*` | required | UNIT/FLOW/CONTRACT | `covered_blocked_positive` |
| `C-CON-4` | 03 §5.5、§7.2、§8.2、§11～§12 | draft/receipt/result 分层、single submit、cancel boundary、ambiguous→unknown、formal reconcile | INTENT/COMMAND/CONSISTENCY | `TC-INTENT-*`;`TC-CONSISTENCY-*` | required | FLOW/CONTRACT | `covered_blocked_positive` |
| `C-CON-5` | 03 §5.6、§7.4、§8.4、§9 | 八主题 owner 分区、canonical order、strict empty、partial isolation、no readiness | TOPIC/VIEW/ERROR | `TC-TOPIC-*`;`TC-VIEW-*` | required | FLOW/INTEGRATION | `covered_blocked_positive`（逐 owner formal surface pending） |
| `C-CON-6` | 03 §5.7、§9、§11～§15 | 多轴 degradation、subject-specific recovery、语义等价、诊断隔离 | RECOVERY/A11Y/DIAG | `TC-RECOVERY-*`;`TC-A11Y-*`;`TC-DIAG-*` | required | FLOW/ACCESSIBILITY/SECURITY | `covered_planned`；具体兼容为 conditional |

## 6. 功能需求覆盖矩阵

| 需求 ID | 设计依据 | 核心测试场景 | Cut | TC 候选 | Future EV | 状态 |
|---|---|---|---|---|---|---|
| `FR-CON-001` | 03 §5.1～§5.2、§8.2、§9 | formal context anchor/switch；host route 不构造 context | ENTRY/ACCESS | `TC-CTX-*` | UNIT/FLOW | `covered_blocked_positive` |
| `FR-CON-002` | 03 §9、§11～§12 | expired/revoked/conflict/unknown 收紧，旧内容/动作/结果清除 | ACCESS/STATE-MATRIX/ERROR | `TC-CTX-*`;`TC-RECOVERY-*` | UNIT/FLOW | `covered_planned` |
| `FR-CON-003` | 03 §5.3、§8.3、§9 | visibility union、direct link、history re-entry、minimum disclosure | NAV/ACCESS | `TC-NAV-*`;`TC-SEC-*` | UNIT/FLOW/SECURITY | `covered_blocked_positive` |
| `FR-CON-004` | 03 §5.2、§7.3、§8.3 | qualification + client tightening；按钮/flag/local role 不放宽 | ACCESS/NAV | `TC-NAV-*` | UNIT/FLOW | `covered_blocked_positive` |
| `FR-CON-005` | 03 §5.4、§7.3、§8.3、§10 | source/freshness/coverage/availability/consistency 独立；empty/missing 区分 | VIEW/QUERY | `TC-VIEW-*` | UNIT/FLOW | `covered_blocked_positive` |
| `FR-CON-006` | 03 §5.4、§8.3～§8.4 | filter/sort/page/downlink 仅作用于 safe material；Query zero-write | VIEW/QUERY/ADAPTER | `TC-VIEW-*`;`TC-ADAPTER-*` | FLOW/CONTRACT | `covered_blocked_positive` |
| `FR-CON-007` | 03 §5.5、§8.2、§9 | draft edit/invalid/reviewable/discarded/submitted；reviewable≠authorized | INTENT/STATE-MATRIX | `TC-INTENT-*`;`TC-STATE-*` | UNIT/FLOW | `covered_planned` |
| `FR-CON-008` | 03 §7.2、§8.2、§11～§12 | qualified single submit；receipt/pending/confirmed/rejected/unknown 分层 | COMMAND/INTENT | `TC-INTENT-*` | FLOW/CONTRACT | `covered_blocked_positive` |
| `FR-CON-009` | 03 §8.3、§11～§12 | formal reconciliation；unavailable 保持 unknown；no replay | COMMAND/CONSISTENCY/RECOVERY | `TC-INTENT-*`;`TC-CONSISTENCY-*` | FLOW | `covered_blocked_positive` |
| `FR-CON-010` | 03 §7.4、§8.4 | identity/member-service partition，safe refs，缺 surface→read-only/blocked | TOPIC/VIEW | `TC-TOPIC-*` | FLOW/INTEGRATION | `covered_blocked_positive` |
| `FR-CON-011` | 03 §7.4、§8.4 | work/process/workspace 分区，coverage 保真，不生成进度/workspace truth | TOPIC/VIEW | `TC-TOPIC-*` | FLOW/INTEGRATION | `covered_blocked_positive` |
| `FR-CON-012` | 03 §7.4、§8.4 | method catalog/version 与 local draft 分离；提交入口 conditional | TOPIC/INTENT | `TC-TOPIC-*`;`TC-INTENT-*` | FLOW | `covered_blocked_positive` |
| `FR-CON-013` | 03 §7.4、§8.4、§14 | governance/artifact status/ref；缺失/冲突不产 verdict/body | TOPIC/VIEW/SEC | `TC-TOPIC-*`;`TC-SEC-*` | FLOW/SECURITY | `covered_blocked_positive` |
| `FR-CON-014` | 03 §7.4、§8.4、§14 | observability safe result/ref；无固定数量/阈值；diagnostic≠audit | TOPIC/DIAG | `TC-TOPIC-*`;`TC-DIAG-*` | FLOW/SECURITY | `covered_blocked_positive` |
| `FR-CON-015` | 03 §7.4、§8.4 | capability/archive/sandbox 分 owner 轴与入口；不合成 readiness | TOPIC/VIEW | `TC-TOPIC-*` | FLOW/INTEGRATION | `covered_blocked_positive` |
| `FR-CON-016` | 03 §9、§11 | partial/stale/missing/unavailable/conflict/unknown 与 empty 不压平 | VIEW/STATE-MATRIX/ERROR | `TC-VIEW-*`;`TC-RECOVERY-*` | UNIT/FLOW | `covered_planned` |
| `FR-CON-017` | 03 §8.2～§8.5、§11～§12 | retry/revalidate/reconcile/exit/draft hold 各自 ceiling；stale plan reject | RECOVERY/COMMAND/CONSISTENCY | `TC-RECOVERY-*`;`TC-INTENT-*` | FLOW | `covered_blocked_positive` |
| `FR-CON-018` | 03 §5.7、§9、§14 | visual/keyboard/AT 同 action key/guard/result；focus/announce fallback | A11Y/RECOVERY | `TC-A11Y-*` | ACCESSIBILITY | `covered_planned`（compatibility conditional） |

外围 `FR-CON-E01～E03` 统一为 `conditional_future`：只验证 disabled/blocked 不改变权限/truth、比较无正式语义不启用、批量/导出无逐项正式合同不启用；候选为 `TC-STATE-*`、`TC-TOPIC-*`、`TC-SEC-*`，不计为当前 P0 positive pass。

## 7. 规则、数据、接口与依赖覆盖矩阵

### 7.1 BR 规则组

| 规则 ID | 设计依据 | Cut / TC | 必须自动化的否定断言 | Future EV | 状态 |
|---|---|---|---|---|---|
| `BR-CON-001～004` | 03 §5.1～§5.2、§9～§10 | ACCESS/ENTRY/STATE；`TC-CTX-*` | 无 formal context 不披露/提交；session/carrier 不产生授权 | UNIT/FLOW | `covered_planned` |
| `BR-CON-005～008` | 03 §5.2～§5.3、§8.3、§9 | ACCESS/NAV/SEC；`TC-NAV-*` | route/menu/button/flag/cache 不授权；reason 不泄露存在性 | UNIT/FLOW/SECURITY | `covered_planned` |
| `BR-CON-009～012` | 03 §5.4、§8.3～§8.4、§10 | VIEW/QUERY/ARCH；`TC-VIEW-*`;`TC-ARCH-*` | 五轴不默认；Query no-write；无 DB/repo/private bus/BFF | FLOW/ARCH | `covered_planned` |
| `BR-CON-013～019` | 03 §5.5、§7.2、§8.2～§8.3、§11～§12、§14 | INTENT/COMMAND/CONSISTENCY/DIAG；`TC-INTENT-*` | receipt/toast/transport 不完成；unknown no replay；client diagnostic 不冒充 audit | FLOW/SECURITY | `covered_blocked_positive` |
| `BR-CON-020～027` | 03 §5.6、§7.4、§8.4、§14 | TOPIC/VIEW/ARCH/DIAG；`TC-TOPIC-*`;`TC-ARCH-*` | 不拥有 owner truth，不以 UI/阈值推导 verdict/readiness，不迁入 owner execution | FLOW/ARCH/SECURITY | `covered_blocked_positive` |
| `BR-CON-028～031` | 03 §9、§11～§12 | STATE-MATRIX/RECOVERY/TOPIC；`TC-RECOVERY-*` | 非理想状态不压平；恢复显式；partition failure 不扩散/掩盖 | UNIT/FLOW/INTEGRATION | `covered_planned` |
| `BR-CON-032～033` | 03 §5.7、§9、§14 | A11Y/RECOVERY；`TC-A11Y-*` | 视觉可用不得抵消 keyboard/AT/focus/recovery 不等价 | ACCESSIBILITY | `covered_planned` |

### 7.2 DR 数据组

| 数据 ID | 设计依据 | Cut / TC | 核心断言 | Future EV | 状态 |
|---|---|---|---|---|---|
| `DR-CON-001～004` | 03 §5.1～§5.2、§9～§10 | ENTRY/ACCESS/STATE/SEC；`TC-CTX-*`;`TC-SEC-*` | 交互选择≠auth；safe refs only；credential/proof body whole reject | UNIT/SECURITY | `covered_planned` |
| `DR-CON-005～008` | 03 §5.2～§5.3、§9 | NAV/ACCESS/SEC；`TC-NAV-*` | 导航是本地状态；资格快照可撤除；Policy/Gate body 禁入 | UNIT/FLOW/SECURITY | `covered_planned` |
| `DR-CON-009～012` | 03 §5.4、§8.3～§8.4、§10 | VIEW/QUERY/ADAPTER；`TC-VIEW-*` | 探索意图不写 truth；safe VM/refs；raw/hidden payload 禁入 | UNIT/FLOW/CONTRACT | `covered_blocked_positive` |
| `DR-CON-013～016` | 03 §5.5、§8.2～§8.3、§9～§12 | INTENT/COMMAND/STATE；`TC-INTENT-*` | draft/request 是本地 truth；正式结果只引用；owner body/idempotency proof 禁入 | UNIT/FLOW/SECURITY | `covered_blocked_positive` |
| `DR-CON-017～024` | 03 §5.6、§7.4、§8.4、§10 | TOPIC/VIEW/SEC；`TC-TOPIC-*`;`TC-SEC-*` | owner-safe snapshots/refs 分域；所有领域正文禁入 | FLOW/INTEGRATION/SECURITY | `covered_blocked_positive` |
| `DR-CON-025～030` | 03 §5.7、§5.9～§5.10、§9～§14 | RECOVERY/STATE/DIAG/A11Y；相关 TC 族 | recovery/focus/diagnostic 仅交互 truth；偏好不授权；诊断/导出 forbidden body 禁入 | UNIT/ACCESSIBILITY/SECURITY | `covered_planned`；外围 snapshot/ref conditional |

### 7.3 IF 与 DEP 组

| ID | 设计依据 | Cut / TC | 覆盖断言 | Future EV | 状态 |
|---|---|---|---|---|---|
| `IF-CON-001～002` | 03 §7.2～§8.3 | ENTRY/ACCESS/NAV；`TC-CTX-*`;`TC-NAV-*` | context/visibility/qualification union 与 fail-closed | FLOW/CONTRACT | `covered_blocked_positive` |
| `IF-CON-003` | 03 §7.3、§8.3 | VIEW/QUERY；`TC-VIEW-*` | owner-safe query/ref、五轴、zero-write | FLOW/CONTRACT | `covered_blocked_positive` |
| `IF-CON-004～005` | 03 §7.2～§8.3 | INTENT/COMMAND；`TC-INTENT-*` | local draft 与 delegated submit 分离；formal result/reconcile | FLOW/CONTRACT | `covered_blocked_positive` |
| `IF-CON-006～011` | 03 §7.4、§8.4 | TOPIC/VIEW；`TC-TOPIC-*` | 八主题逐 owner、局部降级、conditional command | FLOW/INTEGRATION | `covered_blocked_positive` |
| `IF-CON-012～013` | 03 §5.7、§8.5、§9、§11～§14 | RECOVERY/A11Y；相关 TC | explicit safe recovery 与 semantic equivalence | FLOW/ACCESSIBILITY | `covered_planned` |
| `DEP-CON-001～004` | 01 §8～§10；03 §3、§5.8、§13 | ADAPTER/ARCH/ACCESS；`TC-ADAPTER-*`;`TC-ARCH-*` | public SDK/shared types only；Policy/Gate formal-only；无 sibling/private path | CONTRACT/ARCH | `covered_blocked_positive` |
| `DEP-CON-005～012` | 03 §5.6、§7.4、§8.4、§13 | TOPIC/ADAPTER；`TC-TOPIC-*`;`TC-ADAPTER-*` | owner partitions、safe refs、failure isolation、no owner truth | CONTRACT/INTEGRATION | `covered_blocked_positive` |
| `DEP-CON-013` | 03 §7.5、§8.5、§12 | CONSUMER/ARCH；`TC-ADAPTER-*`;`TC-ARCH-*` | 当前 disabled/pending-contract 且 zero-write；future hint 不成 truth | FLOW/ARCH | `covered_planned`；observed branch blocked |
| `DEP-CON-014` | 03 §5.1、§5.7、§14 | ENTRY/A11Y；`TC-A11Y-*` | host failure isolation 与语义等价 | ACCESSIBILITY/INTEGRATION | `covered_planned`；具体兼容 conditional |

外围 `IF-CON-E01～E03`、`DEP-CON-E01～E03` 为 `conditional_future`；仅验证不具备正式合同就不激活、诊断 body-free、未停审 L5/L6 不入主链。

## 8. NFR 与配置覆盖矩阵

| NFR / 配置范围 | 设计依据 | 测试场景 | Cut / TC | Future EV | 状态 |
|---|---|---|---|---|---|
| `NFR-CON-001～003` | 03 §8、§12；Step 4 | 本地路径不等无关 owner；fan-out 有界；single-flight；unknown no replay | CONSISTENCY/TOPIC；`TC-CONSISTENCY-*` | FLOW/INTEGRATION | `covered_planned`（数字阈值 pending） |
| `NFR-CON-004～006` | 03 §9、§11～§12 | context fail-closed、partition-local failure、未开放面稳定 blocked/read-only/partial | ACCESS/TOPIC/RECOVERY | FLOW/INTEGRATION | `covered_planned` |
| `NFR-CON-007～009` | 03 §3、§5.2、§5.8、§9、§14 | SDK-only、local-only tightening、forbidden body、revocation cleanup | ACCESS/SEC/ARCH | SECURITY/ARCH | `covered_planned` |
| `NFR-CON-010～012` | 03 §5.4～§5.5、§14 | source/ref 保真、request phase、diagnostic 与 audit/evidence 分离 | VIEW/INTENT/DIAG | FLOW/SECURITY | `covered_blocked_positive` |
| `NFR-CON-013～015` | 03 §9～§12 | owner truth 单一、phase 不压平、local interaction zero owner side effect | STATE/CONSISTENCY/QUERY | UNIT/FLOW | `covered_planned` |
| `NFR-CON-016～018` | 03 §11、§14 | safe diagnostic correlation、sink isolation、typed posture 一致 | DIAG/ERROR | UNIT/CONTRACT/SECURITY | `covered_planned`；production sink blocked |
| `NFR-CON-019～021` | 03 §5.7、§9、§14 | 核心路径 keyboard/AT 等价、非颜色语义、同 recovery ceiling | A11Y/RECOVERY | ACCESSIBILITY | `covered_planned`；compatibility matrix blocked |
| 四项配置 / 04 §5～§12 | 03 §13；04 §5～§12 | required profile、optional defaults、strict whole JSON、zero-secret、startup-only、profile isolation、failure/rollback | CONFIG/ARCH；`TC-CONFIG-*`;`TC-ARCH-*` | UNIT/INTEGRATION/SECURITY/ARCH | `covered_planned`；production positive blocked |

## 9. AC 与 VETO 覆盖矩阵

### 9.1 核心与功能 AC

| AC | Cut / TC | Future EV 消费槽 | 覆盖姿态 |
|---|---|---|---|
| `AC-CON-001`;`AC-FR-001` | ENTRY/ACCESS/STATE；`TC-CTX-*` | UNIT/FLOW/SECURITY | fail-closed covered；formal positive conditional |
| `AC-CON-002`;`AC-FR-002` | ACCESS/NAV；`TC-NAV-*`;`TC-SEC-*` | UNIT/FLOW/SECURITY | fail-closed covered；exact qualification conditional |
| `AC-CON-003`;`AC-FR-003` | VIEW/QUERY/ADAPTER；`TC-VIEW-*` | UNIT/FLOW/CONTRACT | no-write/axes covered；owner positive conditional |
| `AC-CON-004`;`AC-FR-004` | INTENT/COMMAND/CONSISTENCY；`TC-INTENT-*` | FLOW/CONTRACT | phase/no-replay covered；positive submit/reconcile conditional |
| `AC-CON-005`;`AC-FR-005～010` | TOPIC/VIEW/ERROR；`TC-TOPIC-*` | FLOW/INTEGRATION/SECURITY | safety/partition covered；per-owner positive conditional |
| `AC-CON-006`;`AC-FR-011～012` | RECOVERY/A11Y/STATE-MATRIX；相关 TC | FLOW/ACCESSIBILITY | semantic recovery covered；compatibility conditional |
| `AC-CON-007` | ENTRY→TOPIC→RECOVERY composition；all P0 TC families | INTEGRATION/RELEASE | minimal controlled closure planned；不等 production readiness |
| `AC-FR-013` | STATE/TOPIC/SEC；相关 TC | FLOW/SECURITY | disabled/blocked safety only；外围 positive conditional |

### 9.2 类别 AC

| AC 组 | Cut / TC | Future EV | 状态 |
|---|---|---|---|
| `AC-BR-001～002` | CTX/ACCESS/NAV；`TC-CTX-*`;`TC-NAV-*` | UNIT/FLOW/SECURITY | `covered_planned` |
| `AC-BR-003～005` | VIEW/INTENT/TOPIC/ARCH；相关 TC | FLOW/CONTRACT/ARCH | `covered_blocked_positive` |
| `AC-BR-006` | RECOVERY/TOPIC/A11Y | FLOW/INTEGRATION/ACCESSIBILITY | `covered_planned` |
| `AC-BR-007` | STATE/TOPIC/SEC | FLOW/SECURITY | `conditional_future` positive；safe disabled covered |
| `AC-DR-001～005` | STATE/VIEW/INTENT/TOPIC/SEC | UNIT/FLOW/SECURITY | `covered_planned`；owner positive fixtures conditional |
| `AC-NFR-001～002` | CONSISTENCY/TOPIC/RECOVERY | FLOW/INTEGRATION | structural P0 covered；numeric authority pending |
| `AC-NFR-003` | ACCESS/SEC/ARCH | SECURITY/ARCH | `covered_planned` |
| `AC-NFR-004～006` | VIEW/INTENT/DIAG/CONSISTENCY | FLOW/SECURITY | `covered_blocked_positive` for formal refs/sink |
| `AC-NFR-007` | A11Y/RECOVERY | ACCESSIBILITY | semantic P0 covered；concrete compatibility conditional |

### 9.3 七项 VETO P0 负向映射

| VETO | 强制负向场景 | Cut / TC | Future EV | 覆盖状态 |
|---|---|---|---|---|
| `VETO-CON-001` | 出现 DB/repository/private bus/BFF/worker/owner source import、第二 truth 或 Query write 即失败 | ARCH/QUERY；`TC-ARCH-*`;`TC-VIEW-*` | ARCH/FLOW | `covered_planned` |
| `VETO-CON-002` | context/visibility/qualification invalid 仍披露、选择或 submit 即失败 | ACCESS/NAV/INTENT；`TC-CTX-*`;`TC-NAV-*`;`TC-INTENT-*` | UNIT/FLOW/SECURITY | `covered_planned` |
| `VETO-CON-003` | transport/toast/receipt/cache→confirmed 或 ambiguous replay 即失败 | INTENT/COMMAND/CONSISTENCY；`TC-INTENT-*` | FLOW | `covered_planned` |
| `VETO-CON-004` | forbidden body 进入 object/state/error/diagnostic/config/artifact/report 即失败 | SEC/DIAG/CONFIG；`TC-SEC-*`;`TC-DIAG-*`;`TC-CONFIG-*` | SECURITY/RELEASE | `covered_planned` |
| `VETO-CON-005` | UI/flag/count/threshold/partial result→verdict/active/readiness 即失败 | TOPIC/VIEW/CONFIG；`TC-TOPIC-*`;`TC-CONFIG-*` | UNIT/FLOW/INTEGRATION | `covered_planned` |
| `VETO-CON-006` | keyboard/AT 无法完成视觉核心目标、不同 guard/action 或无等价恢复即失败 | A11Y/RECOVERY；`TC-A11Y-*` | ACCESSIBILITY | `covered_planned` |
| `VETO-CON-007` | 单 owner failure 扩散或被 sibling success 覆盖即失败 | TOPIC/ERROR；`TC-TOPIC-*`;`TC-RECOVERY-*` | FLOW/INTEGRATION | `covered_planned` |

## 10. 19 个 Cut 反向追溯矩阵

| Cut | 需求/规则/验收锚点 | 正式设计 | TC 候选 | Future EV | 反向状态 |
|---|---|---|---|---|---|
| ENTRY | C1；FR001～002；BR001～004；AC-CON-001 | 03 §5.1、§8.2、§9、§13 | `TC-CTX-*` | UNIT/INTEGRATION | linked |
| ACCESS | C1/C2；FR001～004；BR001～008；VETO002 | 03 §5.2、§8.2～§8.3、§9 | `TC-CTX-*`;`TC-NAV-*`;`TC-SEC-*` | UNIT/FLOW/SECURITY | linked |
| NAV | C2；FR003；BR005～008；AC-FR-002 | 03 §5.3、§8.3、§9 | `TC-NAV-*` | UNIT/FLOW/ACCESSIBILITY | linked |
| VIEW | C3/C5；FR005～006/010～016；BR009～012/020～029 | 03 §5.4、§7.3～§8.4、§10 | `TC-VIEW-*` | UNIT/FLOW/CONTRACT | linked |
| INTENT | C4；FR007～009；BR013～019；VETO003 | 03 §5.5、§7.2、§8.2、§9～§12 | `TC-INTENT-*` | UNIT/FLOW/CONTRACT | linked |
| TOPIC | C5；FR010～015；BR020～027/031；VETO005/007 | 03 §5.6、§7.4、§8.4 | `TC-TOPIC-*` | FLOW/INTEGRATION | linked |
| RECOVERY | C6；FR016～018；BR028～033 | 03 §5.7、§8.5、§9、§11～§12 | `TC-RECOVERY-*` | UNIT/FLOW/ACCESSIBILITY | linked |
| ADAPTER | DEP001～012；NFR007～010；VETO001/004 | 03 §5.8、§6.2、§7、§11、§13 | `TC-ADAPTER-*`;`TC-SEC-*` | CONTRACT/INTEGRATION/SECURITY | linked |
| STATE | DR001/005/009/013/014/025/026；NFR013～015 | 03 §5.9、§9～§12 | `TC-STATE-*` | UNIT/FLOW | linked |
| DIAG | BR019/027；DR027/030；NFR012/016～018 | 03 §5.10、§14 | `TC-DIAG-*` | UNIT/CONTRACT/SECURITY | linked |
| A11Y | FR018；BR032～033；NFR019～021；VETO006 | 03 §5.7、§9、§14 | `TC-A11Y-*` | ACCESSIBILITY | linked |
| COMMAND | C4；FR007～009/017；BR013～019 | 03 §7.2、§8.2 | `TC-INTENT-*` | FLOW/CONTRACT | linked |
| QUERY | C3/C5；FR005～006/010～016；BR009～012 | 03 §7.3～§8.4 | `TC-VIEW-*`;`TC-TOPIC-*` | FLOW/CONTRACT | linked |
| CONSUMER | DEP013；FR016～017；NFR013 | 03 §7.5、§8.5、§12 | `TC-ADAPTER-*`;`TC-ARCH-*` | FLOW/ARCH | linked; positive blocked |
| STATE-MATRIX | C1～C6；BR003/007/011/013～016/023/028～030 | 03 §9 | `TC-STATE-*` | UNIT/FLOW | linked |
| CONSISTENCY | FR008～009/017；BR014～017/030～031；NFR003/013～015 | 03 §10、§12 | `TC-CONSISTENCY-*` | FLOW/INTEGRATION | linked |
| ERROR | FR016～018；BR008/011/028～031；NFR016～018 | 03 §11 | `TC-RECOVERY-*`;`TC-SEC-*` | UNIT/FLOW/SECURITY | linked |
| CONFIG | NFR004～009/013/017；VETO002/004/005 | 03 §13；04 §5～§12 | `TC-CONFIG-*` | UNIT/INTEGRATION/SECURITY | linked |
| ARCH | BR012/021/025；DEP001～013；VETO001 | 03 §3～§5、§7.5、§15 | `TC-ARCH-*` | ARCH/RELEASE | linked |

## 11. Positive Blocker 与未覆盖项清单

| 项 | 受影响覆盖 | 当前测试姿态 | 是否 P0 空洞 |
|---|---|---|---|
| `CON-Q-034～038` exact DTO/scope/visibility/safe-field/reconcile | formal allow/query/submit/reconcile positive | negative/fail-closed/fake parity 可设计；selected positive blocked | 否；blocker 显式 |
| `CON-Q-039～043` owner 专项 seams | 八主题 formal positive/material/action | 每 owner 独立 blocked/read-only/partial fixtures；不虚构 happy path | 否；P0 safety covered |
| SDK invalidation envelope/order/dedup | consumer observed branch | current disabled/zero-write/static absence；future positive blocked | 否 |
| `CON-Q-044` medium/TTL/migration | configured durability/cross-session | session-volatile P0；durability P2 | 否 |
| `CON-Q-045` quantitative authority | numeric latency/load/availability pass | structural boundedness/no-amplification only | 否；数字验收未覆盖并进入 residual risk |
| `CON-Q-046` browser/AT + production diagnostics | concrete compatibility/sink | semantic a11y/body-free disabled/fake P0；selected matrix blocked | 否 |
| `CON-Q-047` other L5/L6 links | deep-link positive | 不入主链；安全 disabled | 否 |
| P0 `not_covered` | 无 | 无 | 无 |

## 12. 覆盖项停审记录

| 覆盖组 | 设计依据明确 | Cut/TC 可定位 | 自动化非人工兜底 | EV 仅 future 槽 | blocker 保真 | 结论 |
|---|---|---|---|---|---|---|
| C1/C2 context/access/navigation | yes | yes | yes | yes | yes | pass |
| C3 view/query | yes | yes | yes | yes | yes | pass |
| C4 intent/result | yes | yes | yes | yes | yes | pass |
| C5 eight topics | yes | yes | yes | yes | yes | pass_with_positive_blockers |
| C6 recovery/a11y | yes | yes | yes | yes | yes | pass_with_compatibility_blocker |
| BR/DR/IF/DEP | yes | yes | yes | yes | yes | pass |
| NFR/config | yes | yes | yes | yes | yes | pass_with_quantitative_blocker |
| seven VETO | yes | yes | yes | yes | n/a | pass |

## 13. 跨覆盖项审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 六个 C / 18 个 core FR 是否全覆盖 | pass | §5～§6，6/6、18/18 |
| 33 BR、30 DR、13 IF、14 DEP、21 NFR 是否无漏号 | pass | §7～§8 的连续语义组覆盖 |
| AC-CON、AC-FR、AC-BR/DR/NFR 是否可反查 | pass | §9.1～§9.2 |
| 七个 VETO 是否均为 P0 自动化负向 | pass | §9.3，7/7 |
| 19 cut 是否均有需求/设计/TC/EV | pass | §10，19/19 |
| 是否存在 P0 人工-only | pass | 无；semantic/static 均要求可重复自动化，selected compatibility 另列 |
| 是否存在孤儿设计契约 | pass | 10 模块、5+16+1、0 Event/Job、state/error/config/diag/a11y 均有 cut |
| 是否存在孤儿 TC 族 | pass | 14 个候选族均被至少一矩阵行引用 |
| EV ID 是否冲突或伪造成现有 evidence | pass | 八个 registry slot 唯一定义且均标 `planned_slot_only` |
| blocked positive 是否被标成 covered positive | pass | 使用 `covered_blocked_positive` 并列 blocker |
| 外围/P1/P2 是否污染 P0 pass | pass | 全部 `conditional_future` 或 residual risk |
| 旧 TC/阈值/路径是否回流 | pass | 未继承旧 TC、P95/SLA、`reports/console-test` |

## 14. 对上游与后续 Step 的影响

| 结论 | 处理 |
|---|---|
| 未发现 00～04 的 orphan 或冲突 | 无需回写上游正式语义 |
| TC 候选族需落成逐条用例 | Step 6 按 19 cut 串行生成稳定三位 ID、前置/操作/断言/phase |
| future EV 槽尚无 artifact 绑定 | Step 9 定 suite/gate，Step 13 定固定 run/report 派生规则 |
| quantitative/compatibility/formal positive 缺口 | Step 8/10/14 保持 blocked/residual，不可补造 authority |

## 15. 正式回填草稿与门禁

正式 §5 应回填覆盖词汇、C/FR/规则/NFR/AC/VETO 主矩阵、19 cut 反向矩阵、positive blocker 清单与跨覆盖审计；过程性的逐组停审可留在本文件。

> 校准来源：`design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读：建议继续阅读本文件的“TC 候选族与 Future EV 槽注册表”“规则、数据、接口与依赖覆盖矩阵”“AC 与 VETO 覆盖矩阵”“19 个 Cut 反向追溯矩阵”和“Positive Blocker 与未覆盖项清单”。

| 进入 Step 6 条件 | 结论 |
|---|---|
| P0 覆盖矩阵无静默空洞 | pass |
| 双向追溯成立 | pass |
| 自动化判断与 future EV 槽明确 | pass |
| blocked/conditional/residual 保真 | pass |
| 可进入 Step 6 | pass |

Step 5 `done / pass / self_reviewed`；下一步必须按每个 cut 设计具体 TC，不能一次性生成无 cut 归属的用例大表。
