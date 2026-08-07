# 06 验收标准校准 · Step 5 功能验收门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
- 回填章节：正式 `06-验收标准.md` §5

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 4、正式 00 FR/AC、03 protocol/flow、05 §5~§6/§13
- [x] SOP 问题回答：P0 pass/fail、TC/report/evidence、P1、总体影响和追溯
- [x] 当前材料 / 旧文档诊断：废弃旧 policy/host 功能门禁
- [x] 设计取舍：稳定使用 `AC-L2T-001~023`，不创建第二业务 AC
- [x] 结构化中间产物：23 项功能门禁、闭环矩阵、单项停审和跨功能审计
- [x] 复杂度判断：按五能力、17 FR、外围隔离三批逐项完成；无需附录
- [x] 回填草稿：形成正式 §5
- [x] 自检与进入下一步条件：23/23 可裁决，无孤儿、无 cross-run/static evidence

## 2. 本步输入

| 输入 | 本步用法 |
|---|---|
| `00` §9/§14 | `FR-L2T-001~017`、`FR-L2T-E01~E06` 与 `AC-L2T-001~023` 稳定语义 |
| `03` §7~§9/§15 | `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04` 和正式状态/副作用 |
| `05` §5~§6 | concrete TC 唯一身份、主 suite 和 candidate slot 方向 |
| `05` §13 | final eligibility 只来自 matching passed release seal；candidate/index derivation 不能裁决 |
| Step 3~4 | fixed run/report path、entry/exit、invalid/unavailable/pending 分流 |

## 3. SOP 问题回答

1. **每个 P0 功能的通过条件是什么？**

   回答：对应正式 contract/flow/state/result/error 的正向、拒绝、duplicate、blocked/unknown 和边界分支均按 05 concrete denominator 成立；同 run report/raw pairing 完整；release seal 中对应 slot 为 `eligible`；不存在用外部 readiness 或外围结果补偿本地语义。

2. **每个 P0 功能的失败条件是什么？**

   回答：正式 truth 不能形成、owner/状态/副作用漂移、应拒绝却写入/执行、duplicate 产生新事实、blocked/unknown 被升级、Query/Job/外围反写、或证据为 invalid/ineligible/unavailable/pending，均使对应功能不得 pass。命中 VF 时强制总体不通过。

3. **证据来自哪些测试用例或报告？**

   回答：见 §7.2；每项绑定 concrete TC family、primary suite report `reports/runs/<run_id>/suites/<suite>.md`、同 run raw case 和 release seal final eligibility。`EV-CAND-*` 只标识 seal item 的候选槽位。

4. **哪些 P1 功能只做后置边界验收？**

   回答：外围产品体验、真实 provider、SDK client、production-like 和量化能力后置；当前只将“不阻塞核心、不反写 truth、不扩 owner”作为 P0 isolation gate。

5. **哪些功能失败会导致总体不通过？**

   回答：`AC-L2T-001~022` 任一失败都使总体不能“通过”；若是 P0 hard failure 且不可风险接受，则只能不通过。`AC-L2T-023` 的产品能力缺失不失败，但其 isolation 边界失败是 P0 hard failure。

6. **每项能否回指需求、设计、TC、evidence 和 report？**

   回答：可以，见 §7.2；没有新增 schema、状态、TC 或正式 EV instance。

7. **每项是否完成停审？**

   回答：23/23 已逐项核对正式来源、pass/fail、evidence phase 和总体影响，见 §7.3。

8. **跨项是否存在缺门禁、重复证据或裁决冲突？**

   回答：无 unresolved 冲突。复用同一 TC/report 是同一事实支撑多个 AC，不允许一条 smoke 泛化替代明细；CORE 是聚合主题，不是新 TC。

## 4. 当前文档问题诊断

| 旧位置 | 问题 | 当前处理 |
|---|---|---|
| 旧 06 §4 | 旧 `ToolPolicy/ToolScope/host callback` 与当前 contract truth 冲突 | 整体废弃，以 23 个稳定 AC 重建 |
| 旧 06 §4 | 功能门禁没有设计 flow、TC、EV 和 report path | 每项固定完整追溯链 |
| 旧 06 | 只描述 happy path | negative/duplicate/blocked/unknown/no-execution 同属通过条件 |
| 旧 06 | 外部 provider 可用性与本地功能混同 | P0 local/negative 与 P1 positive 分离 |
| 旧 06 | “功能可用”可能由单个 smoke 证明 | 明确明细用例不可被 `local-closure` 聚合替代 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 分母 | 旧功能列表 | `AC-L2T-001~023` | 稳定承接正式需求 |
| oracle | success/exception | formal state + side-effect + negative + replay | 可裁决且可复验 |
| 证据 | 模糊报告 | final seal item + same-run report/raw | 防静态造证据 |
| 外围 | 与核心同级 | absent 不阻塞；present 不反写 | 避免 P1 污染 P0 |
| failure | 局部缺陷 | 明确总体影响及 VF upgrade | 结论一致 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 FR 新建 `AC-FUNC-*` | 表格独立 | 与正式 00 的 AC 分叉 | 不采用 |
| 只列五个核心能力 | 简洁 | 17 FR 无独立缺陷/证据定位 | 不采用 |
| 保留 `AC-L2T-001~023`，五能力与 FR 都逐项 | 稳定且完整 | 表较长 | 采用 |

## 7. 结构化中间产物

### 7.1 共同裁决合同

```text
function_gate_pass(AC) :=
  formal requirement and design contract match
  AND every mapped concrete TC has the required closed result
  AND primary suite raw/report pairing verifies in one release run
  AND matching final-seal eligibility item = eligible
  AND no mapped VF is triggered
  AND no P1/P2/fake/readiness fact is used as substitute
```

### 7.2 功能验收闭环矩阵

| AC | 功能 / 正式设计契约 | 通过条件 | 失败条件 | Concrete TC | Final-seal slot / report path | 裁决影响 |
|---|---|---|---|---|---|---|
| `AC-L2T-001` | 五能力闭环；`CF-01~12` | identity 至 safe handoff 的适用链完整，条件节点不被固定化 | 任一核心节点无 truth 或以外仓时序替代 | selected `CONTRACT/BIND/INV/PRE/OUTCOME/HANDOFF` | `EV-CAND-L2T-CORE-001`;`local-closure.md` + owning reports | 失败不得通过；命中 `VF-001` 强制不通过 |
| `AC-L2T-002` | controlled binding；`CF-05~07/QF-03/IF-01/JF-01` | bound/unbound、relation/snapshot/assessment/gap 分层 | local registry/name/visibility 推断 capability/auth | `BIND-001~008`,`CONSUMER-001`,`JOB-001` | `...BIND-001`;`application-core.md`,`entry-worker-job.md`,`controlled-seam.md` | 失败不得通过 |
| `AC-L2T-003` | canonical invocation；`CF-08/QF-04/IF-03` | caller/carrier 共用 immutable invocation/admission/outcome contract | raw request/carrier 私有合同或 orchestration 入仓 | `INV-001~008`,`QUERY-004`,`CONSUMER-003` | `...INV-001`;`application-core.md`,`query-purity.md`,`entry-worker-job.md` | 失败不得通过 |
| `AC-L2T-004` | precondition/isolation；`CF-09~10/IF-02~03` | requirement、formal auth consumption、Prepared/one-call/unknown 分层 | self-auth、fail-open、host fallback、虚构 run/receipt | `PRE-001~010`,`CONSUMER-002~003`,`ERR-007~008` | `...PRE-001`;`application-core.md`,`controlled-seam.md`,`transaction-concurrency.md` | 失败不得通过；相关 VF 不可接受 |
| `AC-L2T-005` | outcome/audit/safe handoff；`CF-11~12/QF-06/OF/IF/JF` | result/error/no-execution、atomic audit pair、safe material/status 独立 | capture/delivery/observation 冒充 terminal 或外部失败反写 | `OUTCOME-001~010`,`HANDOFF-001~008`,`CONT-001~004`,`OBS-001~009` | `...OUTCOME-001`,`...HANDOFF-001`;`application-core.md`,`entry-worker-job.md`,`observability-redaction.md` | 失败不得通过 |
| `AC-L2T-006` | `FR-001`;`CF-01` stable identity | ToolId/identity 稳定，duplicate replay 不新建 | display/provider/inventory/capability identity 替代 | `FOUNDATION-001/010~014`,`CONTRACT-001~002` | `...CONTRACT-001`;`contract-domain.md`,`application-core.md` | P0 fail |
| `AC-L2T-007` | `FR-002`;`CF-01/QF-01` definition/read | complete current definition 可受控读取，NotVisible/NotFound 分型 | 私有配置/模型补全、provider inventory 补 truth | `CONTRACT-001`,`CONTRACT-006`,`FOUNDATION-007` | `...CONTRACT-001`;`application-core.md`,`query-purity.md` | P0 fail |
| `AC-L2T-008` | `FR-003`;`CF-02~04/QF-02` evolution | Candidate/Current/Superseded/RetirementPending/Retired 与 history/impact 成立 | current 静默覆盖、terminal 复活、历史删除 | `CONTRACT-003~005`,`CONTRACT-007~008`,`STATE-001~002/009~012` | `...CONTRACT-001`,`...STATE-001`;`application-core.md`,`contract-domain.md` | P0 fail |
| `AC-L2T-009` | `FR-004`;`CF-05` binding classification | ExplicitUnbound 或 typed capability relation 显式 | null/name/default 推断 | `BIND-001~002`,`BIND-005` | `...BIND-001`;`application-core.md` | P0 fail |
| `AC-L2T-010` | `FR-005`;`CF-05~06` controlled relation | 双锚点 body-free relation、snapshot/assessment/source 成立 | 复制 descriptor/exposure/applicability/provider body | `BIND-002~003`,`FOUNDATION-018` | `...BIND-001`;`application-core.md`,`observability-redaction.md` | P0 fail |
| `AC-L2T-011` | `FR-006`;`CF-06~07/QF-03/IF-01/JF-01` | stale/conflict/invalid/unverifiable 和 gap 可识别，late clue 不改 history | detection/job/consumer 修 relation 或 two-current | `BIND-003~008`,`QUERY-003`,`CONSUMER-001`,`JOB-001` | `...BIND-001`;`application-core.md`,`entry-worker-job.md` | P0 fail；positive Hub 可 conditional |
| `AC-L2T-012` | `FR-007`;`CF-08` canonical frame | formal definition/anchor/context 形成唯一 invocation | raw caller/transport body 成为 truth | `INV-001`,`INV-003~005`,`FOUNDATION-004~006` | `...INV-001`;`application-core.md`,`contract-domain.md` | P0 fail |
| `AC-L2T-013` | `FR-008`;`CF-08` admission/no-execution | Admitted/AwaitingPrecondition/Rejected/Unavailable 可判，拒绝 zero execution | invalid/retired/conflict 输入进入执行或无执行写 run | `INV-002`,`INV-004~005`,`INV-008` | `...INV-001`;`application-core.md` | P0 fail |
| `AC-L2T-014` | `FR-009`;carrier parity | direct/adapter/sandbox 同 schema/digest/result/error | carrier 私有 DTO、状态或错误 | `INV-003`,`FOUNDATION-003~005`,`INV-006~007` | `...INV-001`,`...FOUNDATION-001`;`contract-domain.md`,`application-core.md` | P0 fail |
| `AC-L2T-015` | `FR-010`;`CF-09` requirement | formal definition/invocation/binding 形成 closed requirement classification，且不等 authorization | risk/visibility 被直接解释为 allow/deny | `PRE-001`,`PRE-003`,`PRE-010` | `...PRE-001`;`application-core.md` | P0 fail |
| `AC-L2T-016` | `FR-011`;`CF-09/IF-02` auth consumption | owner/revision/freshness/safe result 可验证；缺失/冲突 fail closed | L2 自授权、默认 allow、复用 stale decision | `PRE-002~004`,`CONSUMER-002`,`ERR-007` | `...PRE-001`;`application-core.md`,`controlled-seam.md` | P0 negative fail；positive conditional |
| `AC-L2T-017` | `FR-012`;`CF-09~10` isolation/carrier | sandbox-required 不 host fallback；Prepared 后 one call；known/unknown 分型 | isolation 降级、hidden retry、Prepared=accepted/run | `PRE-005~010`,`TX-003~004`,`CONC-010~014` | `...PRE-001`,`...TX-001`,`...CONC-001`;`controlled-seam.md`,`transaction-concurrency.md` | P0 hard fail |
| `AC-L2T-018` | `FR-013`;`CF-10/IF-03` Sandbox seam | canonical handoff/source ref、mapping blocked、re-entry 和 no fabricated fact | L2 拥有 environment/run/capture/receipt/cleanup | `PRE-005~009`,`INV-007`,`CONSUMER-003` | `...PRE-001`,`...CONSUMER-001`;`controlled-seam.md`,`entry-worker-job.md` | local/negative P0；positive blocked |
| `AC-L2T-019` | `FR-014`;`CF-11` normalized result | attributable safe success source -> unique result + audit pair | raw capture/provider response/delivery 直接为 result | `OUTCOME-001`,`OUTCOME-004~006`,`OUTCOME-010` | `...OUTCOME-001`;`application-core.md`,`transaction-concurrency.md` | P0 fail |
| `AC-L2T-020` | `FR-015`;`CF-08/09/11` normalized error/no-execution | tool/execution/capture/no-execution/handoff error 保持 typed distinct | 拒绝写 executed、错误坍缩、虚构 source | `OUTCOME-002~004`,`ERR-001~012` | `...OUTCOME-001`,`...ERR-001`;`application-core.md`,`transaction-concurrency.md` | P0 fail |
| `AC-L2T-021` | `FR-016`;`CF-11/QF-06/IF-04~05` audit | identity/definition/invocation/outcome/source 可回链，pair atomic，status 独立 | audit 被 log/delivery/observation store 替代或含 body | `OUTCOME-001~010`,`QUERY-006`,`CONSUMER-004~005`,`OBS-001~009` | `...OUTCOME-001`,`...OBS-001`;`application-core.md`,`observability-redaction.md` | P0 fail |
| `AC-L2T-022` | `FR-017`;`CF-12/OF-01~04/JF-04` safe handoff | eligible+necessary+body-free+redacted 四门、local attempt/unknown 独立 | 任一门失败仍 material/Port；SubmittedLocally=Delivered/Observed | `HANDOFF-001~008`,`CONT-001~004`,`JOB-004` | `...HANDOFF-001`,`...CONT-001`;`application-core.md`,`entry-worker-job.md`,`observability-redaction.md` | P0 hard fail |
| `AC-L2T-023` | `FR-E01~E06`;`QF-02/07~11/JF-01~03` | absent 不阻塞核心；present 时 bounded/read-only/no-repair/no-owner expansion | search/diff/index/diagnostic/SDK/UI 成核心前置或反写 | `CONTRACT-006~007`,`QUERY-001~003/007~011`,`JOB-001~003`,`FOUNDATION-017` | `...QUERY-001`,`...JOB-001`;`query-purity.md`,`entry-worker-job.md` | 产品缺失不失败；isolation 失败为 P0 |

表中 `...<slot>` 是完整 `EV-CAND-L2T-<...>` 的简写，仅限本中间产物表格可读性；正式文档必须写全名。所有 report path 的完整前缀均为 `reports/runs/<run_id>/suites/`，raw 必须回指 `artifacts/test/<run_id>/suites/`。

### 7.3 逐项停审记录

| 验收项 | 正式来源 | TC/report/final-seal 固定 | pass/fail 可判定 | P1/VF 边界 | 停审结论 |
|---|---|---|---|---|---|
| `AC-L2T-001` | pass | pass | pass | `VF-001` 不可接受 | pass |
| `AC-L2T-002` | pass | pass | pass | positive conditional | pass |
| `AC-L2T-003` | pass | pass | pass | Runtime non-owner | pass |
| `AC-L2T-004` | pass | pass | pass | auth/Sandbox positive blocked | pass |
| `AC-L2T-005` | pass | pass | pass | delivery/Observed non-owner | pass |
| `AC-L2T-006` | pass | pass | pass | `VF-002` | pass |
| `AC-L2T-007` | pass | pass | pass | no provider fallback | pass |
| `AC-L2T-008` | pass | pass | pass | terminal/history hard | pass |
| `AC-L2T-009` | pass | pass | pass | no inferred binding | pass |
| `AC-L2T-010` | pass | pass | pass | Hub body forbidden | pass |
| `AC-L2T-011` | pass | pass | pass | positive Hub conditional | pass |
| `AC-L2T-012` | pass | pass | pass | no raw caller truth | pass |
| `AC-L2T-013` | pass | pass | pass | no-execution hard | pass |
| `AC-L2T-014` | pass | pass | pass | no private carrier | pass |
| `AC-L2T-015` | pass | pass | pass | requirement != auth | pass |
| `AC-L2T-016` | pass | pass | pass | positive auth conditional | pass |
| `AC-L2T-017` | pass | pass | pass | no isolation waiver | pass |
| `AC-L2T-018` | pass | pass | pass | Sandbox positive blocked | pass |
| `AC-L2T-019` | pass | pass | pass | source truth separated | pass |
| `AC-L2T-020` | pass | pass | pass | no fabricated run | pass |
| `AC-L2T-021` | pass | pass | pass | audit != observer store | pass |
| `AC-L2T-022` | pass | pass | pass | route positive conditional | pass |
| `AC-L2T-023` | pass | pass | pass | implementation future; isolation P0 | pass |

“pass” 表示设计停审通过，不是实际验收项通过。

### 7.4 跨功能门禁裁决审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 23 个功能 AC 全覆盖 | pass | `001~023` 连续，无孤儿 |
| 五核心与 17 FR 双层不冲突 | pass | 核心聚合不替代明细；同一证据可多向追溯 |
| Concrete TC identity | pass | 只引用 05 §6 TC；无 CORE/RULE 派生 TC |
| Evidence phase | pass | candidate 只作 slot；实际裁决读 final seal |
| Report path | pass | 全部固定到同 run suite report/raw，不用 `latest` |
| P1/P2 污染 | pass | positive provider/产品体验不补 P0 |
| 裁决冲突 | pass | P0 failure 不得“通过”；VF 触发强制不通过 |
| 设计名称漂移 | pass | 使用 `CF/QF/IF/OF/JF` 与正式状态；无旧 policy/host alias |

## 8. 回填草稿

正式 §5 使用 §7.2 的 23 项完整名称矩阵，不使用省略号简写。共同声明：每项只有在正式设计 contract、mapped concrete TC、同 run raw/report、release seal final eligibility 和无 VF trigger 同时成立时才通过；`local-closure` 只聚合，不替代明细。`AC-L2T-001~022` 任一失败使总体不得通过；`AC-L2T-023` 的外围实现缺失不失败，但外围反写/扩权为 P0 hard failure。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 final eligibility item 和 run | actual gate verdict | 当前不存在，不填 pass/fail |
| positive Hub/Auth/Sandbox/Obs/SDK qualification | readiness | P1/blocked/future；不影响 local negative semantics |
| 某外围产品是否纳入送验 | P1 scope | 由 Step 3 scope manifest 决定 |

## 10. 进入下一步条件

- [x] `AC-L2T-001~023` 逐项拥有 pass/fail、设计、TC、slot/report 和影响。
- [x] 23/23 已逐项停审；停审结果不冒充实际验收结果。
- [x] 跨功能审计无孤儿、证据阶段错误、P1 污染或裁决冲突。
- [x] 允许进入 Step 6：数据边界与架构红线验收。
