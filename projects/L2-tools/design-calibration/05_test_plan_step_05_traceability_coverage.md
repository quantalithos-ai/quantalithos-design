# L2-tools 05 测试方案 · Step 5 需求追溯与覆盖矩阵

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 5「建立需求追溯与覆盖矩阵」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §5

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 5 / 建立需求追溯与覆盖矩阵 |
| 状态 | `accepted_for_step_05 / proceed_to_step_06` |
| 当前模块 | `traceability_and_coverage` |
| 追溯方向 | 需求→设计→切口→TC→planned EV；切口→需求/规则/设计；两向均可查询 |
| 本步结论 | 17项核心FR、5个C节点、核心BR/DR/NFR、AC/VF和NC红线均有覆盖入口；开放provider正向项显式标为blocked/conditional，不静默算覆盖；经 Step 14/15 回校，`CORE/RULE/DATA/NFR/BOUNDARY/REDACTION` 仅为 derived theme，concrete TC 唯一来源为 Step 6。 |
| 下一步 | Step 6：测试场景与用例矩阵 |

## 2. 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 需求主追溯矩阵 | `00` §16.1 | current formal |
| 核心能力、FR/BR/DR/NFR/AC/VF | `00` §7、§9~§15 | current formal |
| 对象/切口和层级映射 | `05` Step 3/4 | accepted intermediate |
| 03最小测试切口和配置族 | `03` §15、`04` §12 | current formal |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个P0需求对应哪些设计章节？ | 核心FR按五个C节点映射至03的contract/binding/invocation/precondition/outcome/integrity模块、CF/QF/IF/OF/JF、状态/事务/错误/配置/观测；详表见§5.2~§5.6。 | `00` §16；`03` §15 |
| 每个P0需求至少有哪些测试场景？ | 每个核心FR至少一个主线或保守负向场景；涉及外部owner的FR另有blocked/unavailable/conflict场景；具体TC在Step 6冻结。 | Step 2/3；`L2T-UP-*` |
| 哪些场景必须自动化？ | P0核心FR、NC红线、状态/事务/幂等/配置/红线均必须自动化候选；人工审查只补架构/报告真实性，不替代P0自动化。 | 测试SOP §5、§9 |
| 每个场景证据如何编号？ | Step 5预留稳定planned EV family，Step 13定义artifact/report schema；不在当前Step生成run或真实证据。 | 规范 §4.4~§4.6 |
| 哪些需求暂未覆盖？ | P1 positive provider/readiness、P2量化NFR/真实部署/SDK client等不属于当前P0覆盖；均列出owner、trigger和风险，不静默消失。 | `00` §15；Step 2 |
| 每个Step 3切口是否映射到需求或设计？ | 是。核心切口映射C/FR/BR/DR/NFR/AC/VF；纯横切切口（TX/CONC/ERR/CFG/OBS/NC）同时回指03契约或04配置；无法自然映射需求的设计风险明确标注“design-only”。 | 本文件§5.7 |
| 每个P0需求是否有测试候选和EV族？ | 是；本 Step 固定 concrete family candidate 或 derived coverage theme，Step 6 冻结唯一 `TC-L2T-<FAMILY>-NNN` 身份；EV按 `EV-CAND-L2T-<FAMILY>-NNN` 的 planned family 预留。正式EV实例和run绑定留Step 13/真实执行。 | 规范 §4.3~§4.4；Step 14回校 |

## 4. 双向覆盖规则

| 规则 | 口径 |
|---|---|
| 正向需求覆盖 | 每个P0 `C/FR/BR/DR/NFR/AC/VF`至少出现一个切口、concrete family candidate或derived theme、planned EV family；最终必须展开到Step 6 concrete TC。 |
| 反向设计覆盖 | 每个03 §15切口必须能回指至少一个需求/规则/NFR/AC/VF，若为纯实现风险则标`design-only`并由Step 14风险承接。 |
| 用例完整性 | Step 5只定义concrete family candidate和coverage theme；具体TC身份、前置、输入、断言、数据和脚本在Step 6~9完成。`CORE/RULE/DATA/NFR/BOUNDARY/REDACTION`不得生成第二套TC。 |
| 证据完整性 | Step 5只预留EV族；Step 13必须补suite、artifact root、report path、tc_refs和future AC/VF consumer。 |
| 未覆盖项 | 只能是明确P1/P2/future或blocked，必须有原因、owner/trigger、风险和下一步。 |

## 5. 核心闭环覆盖矩阵

| 能力节点 | 设计依据 | 测试切口/场景主题 | TC候选族 | planned EV族 | 覆盖状态 |
|---|---|---|---|---|---|
| `C-L2T-1` 稳定身份/定义/演进 | `03` contract、CF-01~04、状态/审计 | 首次建立、定义读取、Candidate/Current/Superseded、RetirementPending/Retired、duplicate/invalid | `TC-L2T-CONTRACT-*` | `EV-CAND-L2T-CONTRACT-*` | P0已纳入 |
| `C-L2T-2` 受控Capability Binding | `03` binding、CF-05~07、IF-01/JF-01 | bound/unbound、snapshot/assessment/gap、stale/conflict/invalidated、无本地registry | `TC-L2T-BIND-*` | `EV-CAND-L2T-BIND-*` | P0已纳入 |
| `C-L2T-3` Canonical invocation/admission | `03` invocation、CF-08、QF-04、IF-03 | context/metadata、Admitted/AwaitingPrecondition/Rejected/Unavailable、carrier parity、no-execution pair | `TC-L2T-INV-*` | `EV-CAND-L2T-INV-*` | P0已纳入 |
| `C-L2T-4` 执行前置/隔离交接 | `03` precondition/handoff、CF-09~10、IF-02 | requirement分类、auth fail-closed、Sandbox no-host、Prepared/phase-2/unknown | `TC-L2T-PRE-*` | `EV-CAND-L2T-PRE-*` | P0本地/负向；P1正向条件 |
| `C-L2T-5` Outcome/Audit/Safe Handoff | `03` outcome/safe_handoff、CF-11~12、OF/IF/JF | source assessment、六类terminal、pair atomic、四门material、local attempt/status independence | `TC-L2T-OUTCOME-*`、`TC-L2T-HANDOFF-*` | `EV-CAND-L2T-OUTCOME-*`、`EV-CAND-L2T-HANDOFF-*` | P0已纳入 |

## 6. 核心功能需求追溯矩阵

| 需求ID | 设计依据 | 测试切口/场景 | TC候选 | 自动化候选 | EV族 | 状态 |
|---|---|---|---|---|---|---|
| `FR-L2T-001~003` | contract对象、CF-01~04、合同状态族 | identity/definition/evolution/retirement与duplicate/compatibility | `TC-L2T-CONTRACT-001~006` | 是 | `EV-CAND-L2T-CONTRACT-001` | 已覆盖 |
| `FR-L2T-004~006` | binding对象、CF-05~07、IF-01/JF-01 | bound/unbound、binding CAS、Hub blocker/stale/conflict | `TC-L2T-BIND-001~006` | 是 | `EV-CAND-L2T-BIND-001` | 已覆盖；positive Hub条件化 |
| `FR-L2T-007~009` | invocation对象、CF-08、QF-04、IF-03 | canonical context、admission、caller/carrier parity、no-execution | `TC-L2T-INV-001~006` | 是 | `EV-CAND-L2T-INV-001` | 已覆盖 |
| `FR-L2T-010~013` | precondition/handoff、CF-09~10、IF-02/03 | requirement、auth missing/stale/conflict、Sandbox blocked/no-host、source mapping | `TC-L2T-PRE-001~008` | 是 | `EV-CAND-L2T-PRE-001` | P0负向；P1正向blocked |
| `FR-L2T-014~017` | outcome/safe_handoff、CF-11~12、OF/IF/JF | normalized result/error、audit pair、四门material、external degradation | `TC-L2T-OUTCOME-001~008`、`TC-L2T-HANDOFF-001~006` | 是 | `EV-CAND-L2T-OUTCOME-001`、`EV-CAND-L2T-HANDOFF-001` | 已覆盖 |

## 7. 规则、数据与NFR覆盖矩阵

本表经 Step 14/15 反向校准：theme 名只用于覆盖查询和 candidate evidence 分组，不能进入 case manifest。concrete 来源必须展开为 Step 6 已冻结的 TC。

| 范围 | 设计依据 | Derived theme | Step 6 concrete TC 来源 | EV族 | 覆盖状态 |
|---|---|---|---|---|---|
| `BR-L2T-001~042` 核心不变量/禁止/显式变化/owner边界 | `00` §10、`03` §9~§15 | `RULE`、`BOUNDARY` | `FOUNDATION`、`CONTRACT`、`BIND`、`INV`、`PRE`、`STATE`、`CFG-*`、`VETO` | `EV-CAND-L2T-RULE-001` | P0全覆盖候选 |
| `DR-L2T-001~034` truth/snapshot/ref/forbidden body | `00` §11、`03`对象字段/来源、`04`敏感边界 | `DATA`、`REDACTION` | `FOUNDATION`、`CONTRACT`、`PRE`、`OUTCOME`、`HANDOFF`、`QUERY`、`CFG-*`、`OBS`、`VETO` | `EV-CAND-L2T-DATA-001` | P0全覆盖候选 |
| `NFR-L2T-001~006` performance/availability结构性口径 | `00` §13 | `NFR-AVAIL` | `PRE`、`OUTCOME`、`HANDOFF`、`CONSUMER`、`CONT`、`JOB`、`ERR`、`OBS` | `EV-CAND-L2T-NFR-AVAIL-001` | P0结构性；无数字 |
| `NFR-L2T-007~010` security | `00` §13、NC/CFG redlines | `NFR-SEC` | `FOUNDATION`、`PRE`、`HANDOFF`、`CFG-*`、`OBS`、`VETO` | `EV-CAND-L2T-NFR-SEC-001` | P0 |
| `NFR-L2T-011~013` audit/trace | `00` §13、`03` §14 | `NFR-AUDIT` | `OUTCOME`、`HANDOFF`、`CONSUMER`、`CONT`、`OBS` | `EV-CAND-L2T-NFR-AUDIT-001` | P0 |
| `NFR-L2T-014~016` idempotency/consistency | `00` §13、`03` §10~§12 | `NFR-CONS` | `CONTRACT`、`BIND`、`INV`、`OUTCOME`、`HANDOFF`、`STATE`、`TX`、`CONC`、`ERR` | `EV-CAND-L2T-NFR-CONS-001` | P0 |
| `NFR-L2T-017~019` observability | `00` §13、`03` §14~§15.8 | `NFR-OBS` | `FOUNDATION`、`OUTCOME`、`HANDOFF`、`QUERY`、`CONSUMER`、`JOB`、`OBS`、`VETO` | `EV-CAND-L2T-NFR-OBS-001` | P0；route readiness条件化 |

## 8. AC/VF与配置覆盖矩阵

| 验收/配置范围 | 设计/需求依据 | 测试切口/TC候选 | planned EV族 | 当前覆盖 |
|---|---|---|---|---|
| `AC-L2T-001~005`核心闭环 | `00` §14、Step 2/3 | 五能力 concrete families 聚合为 derived `CORE`；不创建独立TC | `EV-CAND-L2T-CORE-001` | 已纳入P0 |
| `AC-L2T-006~023`功能能力 | `00` §14、FR | Step 6 `CONTRACT`、`BIND`、`INV`、`PRE`、`OUTCOME`、`HANDOFF`、`QUERY`、`CONSUMER`、`CONT`、`JOB` | 对应完整 concrete EV family | 已纳入P0 |
| `AC-L2T-024~029`规则/边界 | `00` §14、NC | concrete `FOUNDATION`、`STATE`、`CFG-*`、`VETO` 派生 `RULE`/`BOUNDARY` | `EV-CAND-L2T-RULE-001` | 已纳入P0 |
| `AC-L2T-030~033`数据归属 | `00` §14、DR | concrete field/ref/redaction cases 派生 `DATA`/`REDACTION` | `EV-CAND-L2T-DATA-001` | 已纳入P0 |
| `AC-L2T-034~039`NFR方向 | `00` §14、NFR | Step 6 concrete专项case派生 `NFR-*` theme | `EV-CAND-L2T-NFR-AVAIL-001`、`EV-CAND-L2T-NFR-SEC-001`、`EV-CAND-L2T-NFR-AUDIT-001`、`EV-CAND-L2T-NFR-CONS-001`、`EV-CAND-L2T-NFR-OBS-001` | 结构性候选；量化待authority |
| `VF-L2T-001~013` veto | `00` §14.3、Step 2 veto | `TC-L2T-VETO-001~013` | `EV-CAND-L2T-VETO-001` | P0负向覆盖 |
| `CFG-T-01~12` | `04` §12.2 | `TC-L2T-CFG-T-001~012` | `EV-CAND-L2T-CFG-T-001` | planned P0 |
| `CFG-A-01~10` | `04` §12.3 | `TC-L2T-CFG-A-001~010` | `EV-CAND-L2T-CFG-A-001` | planned P0 |
| `CFG-F-01~20` | `04` §11/§12 | `TC-L2T-CFG-F-001~020` | `EV-CAND-L2T-CFG-F-001` | planned P0 |
| `CFG-X-01~12` | `04` §9.5 | `TC-L2T-CFG-X-001~012` | `EV-CAND-L2T-CFG-X-001` | planned P0 |

## 9. 设计切口反向覆盖表

| 切口族 | 需求/规则/验收回指 | 纯设计风险 | 覆盖状态 |
|---|---|---|---|
| 七模块 `L2T-MOD-*` | `FR/BR/AC`对应能力族、`03` §15.2 | adapter/fake parity、entry越层 | 已覆盖 |
| `CF-01~13` | `FR-001~017`、`BR`、`AC-006~022` | call order、phase fence、stored result | 已覆盖 |
| `QF-01~11` | `FR/AC`读取与外围、`BR` no-write | zero external refresh、projection mapper purity | 已覆盖 |
| `IF/OF/JF` | `FR-009~017`、`AC-014~023`、NFR-006/013 | receipt/attempt/report replay | 已覆盖 |
| 六状态族 | `BR`、`AC-024~026`、`VF` | terminal/late/derived state mapping | 已覆盖 |
| TX/CONC/ERR | `NFR-014~016`、`AC-024~039` | commit unknown/side-effect unknown | 已覆盖 |
| CFG/OBS/NC | `NFR-007~019`、`AC-024~039`、`VF` | safe output/low-cardinality/strict source | 已覆盖 |

## 10. 未覆盖项与风险登记入口

| 项 | 当前覆盖状态 | 原因 | 处理 |
|---|---|---|---|
| Authorization positive provider/schema | `blocked_dependency` | `L2T-UP-001~002`未闭 | P1 conditional；Step 12/14阻断/风险 |
| Sandbox positive mapping/receipt/cleanup/DLQ | `blocked_dependency` | `L2T-UP-003~004`未闭 | P1 conditional；不进入P0 pass分母 |
| Bus/Observability producer/route/status positive | `blocked_dependency` | `L2T-UP-005~007`未闭 | P1 conditional；状态独立负向保留 |
| Core tools-specific schema/package | `candidate_only` | `L2T-UP-008` | P1/P2 reopen trigger |
| SDK client | `future` | `L2T-UP-009` | P2/future，不进入当前范围 |
| 数字性能/可用性阈值、真实run/evidence/signoff | `unverifiable` | measurement/evidence authority未定 | 只保留结构性NFR与planned EV |

## 11. 覆盖矩阵停审记录

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 每个P0需求有设计依据 | 通过 | 核心FR、BR、DR、NFR、AC/VF均回指00/03/04。 |
| 每个P0需求有测试切口/concrete来源 | 通过 | 五能力族和配置使用Step 6 concrete family；规则/数据/NFR theme均可展开到Step 6 concrete TC，不产生第二命名空间。 |
| 每个P0需求有planned EV族 | 通过 | EV只表示计划类别，不表示真实证据。 |
| 未覆盖项是否显式进入风险 | 通过 | 6类上游/measurement缺口已列出owner/trigger。 |
| 双向映射无孤儿/重复 | 通过 | Step 3切口均可反查需求或design-only风险。 |

## 12. 对03/04的影响判定

| 文档 | 判定 |
|---|---|
| `03-详细设计.md` | 无回写；仅建立测试追溯，不修改对象/状态/协议。若Step 6无法形成oracle再回流。 |
| `04-配置设计.md` | 无回写；四类配置族作为测试输入，未增加配置项或改变profile语义。 |

## 13. 回填草稿（正式05 §5）

> 校准来源：
> - `design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“核心闭环覆盖矩阵”“核心功能需求追溯矩阵”“规则、数据与NFR覆盖矩阵”和“AC/VF与配置覆盖矩阵”。

需求追溯采用双向矩阵：从 `C-L2T-*`、`FR-L2T-*`、`BR-L2T-*`、`DR-L2T-*`、`NFR-L2T-*`、`AC-L2T-*`、`VF-L2T-*` 可查到详细设计依据、测试切口、Step 6 concrete TC来源、自动化候选和planned EV族；从每个03 §15切口也可反查需求/规则/验收，或明确标注为design-only风险。`CORE/RULE/DATA/NFR/BOUNDARY/REDACTION`只作为derived coverage/evidence theme，不创建第二套TC身份。P0核心需求、规则、数据边界、NFR结构性口径、veto和04配置测试族均有覆盖入口。开放外部positive provider、readiness、量化阈值、真实run/evidence和SDK client不静默算覆盖，而以blocked_dependency/candidate_only/future进入风险与重开条件。

## 14. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| planned TC/EV的最终数量与是否拆分suite | 影响Step 6/9/13编号装配 | Step 6/9/13 |
| 未来06正式EV/AC消费编号 | 影响下游引用，不影响当前覆盖候选 | Step 13/15或06重建 |
| measurement authority | 影响NFR量化覆盖状态 | Step 10/14 |

## 15. 跨覆盖项审计

| 审计项 | 结论 |
|---|---|
| 孤儿需求 | 未发现；核心FR/规则/NFR/AC/VF均有切口族。 |
| 孤儿设计契约 | 未发现；03 §15清单全部有回指。 |
| 孤儿测试切口 | 未发现；每个Step 3切口可反查需求或design-only。 |
| 重复证据族 | 未发现；EV族按能力/横切/配置分工。 |
| P0自动化缺口 | 未发现；所有P0候选标记自动化，具体suite在Step 9。 |
| blocker误算覆盖 | 未发现；positive provider/readiness显式blocked/conditional。 |
| derived theme误作TC | Step 14/15回校后未发现；所有theme均展开到Step 6 concrete family。 |

## 16. 进入下一步条件

- [x] 双向需求/设计/切口/TC/EV覆盖矩阵完成。
- [x] P0覆盖空洞无静默项，未覆盖项进入风险/重开条件。
- [x] planned证据与未来06边界明确。
- [x] 跨覆盖审计无unresolved冲突，可进入Step 6设计用例。
