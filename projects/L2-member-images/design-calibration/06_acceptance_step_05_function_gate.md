# L2-member-images 06 验收标准 Step 5：定义功能验收门禁

> 创建日期：2026-09-03  
> 当前状态：`completed_stop_review`  
> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5  
> 回填位置：正式 `06-验收标准.md` 第 5 章“功能验收门禁”  
> 执行模式：`full-restart`；本文件建立 future acceptance gate，不记录任何已执行功能、EV instance、candidate、digest、Artifact、consumer result、verdict 或 readiness。

## 1. Step 开工确认与模块级台账

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 5：定义功能验收门禁。 |
| 当前模块 | `p0_function_acceptance_gates`。 |
| 本步目标 | 将五个 capability 与跨能力链的核心功能要求转成稳定、可裁决的 P0 验收项，并为每项固定设计契约、planned TC/EV、report path、失败条件与裁决影响。 |
| 本步输入 | Step 1~4；正式 `00` §9/§14~§16、`03` §5/§7~§9/§15、`05` §5/§6/§13；验收 SOP/书写规范。 |
| 本步输出 | 功能验收项范围分配、功能门禁/闭环矩阵、逐项停审、跨功能审计及正式 §5 回填草稿。 |
| 写入前检查 | 项目级与 flow 均允许 06 Step 5；Step 4 已完成进入/退出门；本 Step 只使用正式名称和 planned TC/EV，不写入正式 06。 |
| 当前事实 | 所有 TC/EV 均仍是 planned；没有 `<run_id>`、artifact/report、实现或真实功能结果。 |
| gate_status | `pass_with_explicit_blockers`：功能裁决规则已收稳；受 B01/B02、B03、PF、MI-UP、Q-MI 影响的正向 lane 不可写成通过。 |

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| `definition_function_gate` | done | done | done | done | done | done | pass | 进入 assembly gate。 |
| `assembly_function_gate` | done | done | done | done | done | done | pass | 进入 build gate。 |
| `build_function_gate` | done | done | done | done | done | done | pass | 进入 qualification gate。 |
| `qualification_function_gate` | done | done | done | done | done | done | pass | 进入 supply gate。 |
| `supply_function_gate` | done | done | done | done | done | done | pass | 进入 cross-capability gate。 |
| `cross_capability_function_gate` | done | done | done | done | done | done | pass | 执行跨功能审计。 |
| `cross_function_audit` | done | done | done | done | done | done | pass | 可进入 Step 6。 |

## 2. 本步范围分配

功能验收不吞并数据/架构、接口、状态/事务、非功能、证据和 VETO 的独立裁决责任。以下分配防止把“功能看似可用”替代后续红线。

| 本 Step 功能门禁 | 承接的需求验收方向 | 留给后续 Step 的方向 |
|---|---|---|
| `AC-FUNC-001` 受控定义 | `AC-MI-001~003`；`F-MI-001~003`。 | `AC-MI-004` 数据归属至 Step 6；`AC-MI-005` 能力质量至 Step 9。 |
| `AC-FUNC-002` 静态装配与派生 | `AC-MI-006~008`；`F-MI-004~006`。 | `AC-MI-009` 数据归属至 Step 6；`AC-MI-010` 至 Step 9。 |
| `AC-FUNC-003` 构建候选 | `AC-MI-011~013`；`F-MI-007~009`。 | `AC-MI-014` 数据归属至 Step 6；`AC-MI-015` 至 Step 9。 |
| `AC-FUNC-004` provenance 与 eligibility | `AC-MI-016~018`；`F-MI-010~012`。 | `AC-MI-019` 数据归属至 Step 6；`AC-MI-020` 至 Step 9。 |
| `AC-FUNC-005` supply 与 pinned entry | `AC-MI-021~023`；`F-MI-013~015`。 | `AC-MI-024` 数据归属至 Step 6；`AC-MI-025` 至 Step 9。 |
| `AC-FUNC-006` 五节点功能链 | `AC-MI-026`。 | `AC-MI-027` 依赖/同步至 Step 7；状态/一致性至 Step 8；`AC-MI-028` 至 Step 6；`AC-MI-029` 至 Step 9；`AC-MI-030` 至 Step 9/13；`VETO-MI-001~007` 至 Step 11。 |

所有六项均为 P0 functional gates。这里的 `pass` 是未来真实交付的验收值；当前可以测试的 fail-closed/no-write/marker/gap 断言，只能证明边界没有被绕过，不能替代相应 capability 的 positive delivery pass。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 每个 P0 功能的通过条件是什么？ | 每项必须同时具备正式需求/设计契约、同一 `<run_id>` 的 planned TC 所产生的真实 EV/artifact/report、明确的 capability 语义和无越界副作用。若该 capability 的正向 lane 是 P0 必需但仍被 blocker 阻断，则不能写为通过。 |
| 每个 P0 功能的失败条件是什么？ | capability 所需的 local truth/guard/safe disposition 不成立、出现 hardcode/fallback/`latest`/forbidden body、把 local staged state升格为外部成功、缺失可追溯证据或违反当前 zero-effect/no-write 上限，均为失败或不可裁决。 |
| 证据来自哪些测试用例或报告？ | 只使用 `05` 的 `TC-*` 与 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC-*` 规划 family；实际实例必须位于 `artifacts/test/<run_id>/...` 和 `reports/runs/<run_id>/...`。本 Step 固定方向，不宣称这些文件已存在。 |
| 哪些 P1 功能只做后置边界验收？ | owner-closed real-like adapter、真实 builder/registry/evidence provider、Artifact handoff、member-service confirmation、生产容量/扫描/签名和 P2 enhancement 只可作为 P1/P2 或 future；不得补入 P0 functional pass。 |
| 哪些功能失败导致总体不通过？ | `AC-FUNC-001~006` 任一真正 P0 failure 使总体不能“通过”；若同时触发 VETO，则不得“有条件通过”。未闭合 owner/设计正向 lane 不能被标为 pass、skip 或 readiness。 |
| 每项能否回指设计、TC、EV 与报告路径？ | 可以。见 §7.2；报告路径固定为 future `<run_id>` 路径，真实 instance 尚不存在。 |
| 每项是否完成停审？ | 已完成本 Step 的来源、条件、失败影响、证据方向与 blocker 审核。执行阶段仍需以真实 instance 重做验收项裁决，不能把本停审记录当执行结果。 |
| 是否存在冲突或 P1 污染 P0？ | 未发现未解决的设计冲突；所有 P1/P2 和 owner pending 明确留在 scope/blocker，不作为 P0 通过证据。 |

## 4. 当前材料问题诊断与取舍

| 问题 | 风险 | 本 Step 处置 |
|---|---|---|
| historical 06 按旧 image/persona/toolset/seed/publish/instantiate 叙事列“功能可用”。 | 与当前 definition → assembly → candidate → qualification → supply 主链、28 logical surface 和 staged isolation 冲突。 | 不继承旧对象或泛化 API/DB/trace 证据；以六个可回指 gate 重建。 |
| `05` 的证据表只给出 future 06 direction。 | 可能被误写成已完成 AC 映射。 | 本 Step 只固定 AC→TC→EV→path 要求，所有 evidence 保持 planned。 |
| C-MI-3~5 的正向操作仍有 B01/B02/B03 等设计 blocker。 | 把合法 zero-effect stop 写成 candidate、eligibility、entry 或 consumer成功。 | 每项拆出 current safe-boundary assertion 与 future positive delivery condition；二者不可互换。 |
| mapping、component、seed、Artifact、consumer、event/policy owner 未闭合。 | fake、cache、ACK 或 sibling 草稿会被当成 external success。 | 只验 ref/gap/blocked/unknown/marker 语义；positive oracle 缺失时 fail closed。 |
| 一条 smoke 或共享 EV 可能被误当作全功能证明。 | 产生 orphan AC 或重复/冲突裁决。 | 允许同一 actual EV 支撑多个 gate，但 evidence index 必须逐条列 AC、TC、suite、case 与 artifact/report，且不能替代每条 TC。 |

| 取舍议题 | 备选 | 结论 | 原因 |
|---|---|---|---|
| 功能门禁粒度 | A. 30 个需求 AC 均在本 Step 重复；B. 以五 capability + 跨链六项收敛，并将专业红线留给后续 Step。 | 采用 B。 | 保留稳定功能裁决，同时避免数据、协议、状态、NFR、证据和 VETO 重复定义。 |
| 当前 B01/B02 stop 是否可当作 C-MI-3~5 通过 | A. 可；B. 仅为安全边界断言。 | 采用 B。 | zero-effect 不等 mutation/candidate/eligibility/supply 成功。 |
| owner gap 是否可设为 P0 `not_applicable` | A. 可；B. 不可。 | 采用 B。 | 若该 positive relation 是 selected P0 capability 的必要条件，gap 只能 blocked/failed-to-close，不可用 N/A 消除分母。 |
| EV 共享 | A. 一 AC 一 EV；B. 允许 suite/EV 复用但强制 index 回指。 | 采用 B。 | `05` 的 suite 结构就是复用设计；逐 case 映射可避免泛化证明。 |

## 5. 结构化中间产物：功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 未来通过条件 | 失败条件 | 当前安全边界与 blocker | 裁决影响 |
|---|---|---:|---|---|---|---|
| `AC-FUNC-001` | C-MI-1：受控 variant/persona 定义、mapping validity 与来源追溯。 | P0 | 每个被接受的 local definition 只回指正式 body-free mapping source；missing/stale/conflict/unavailable 以正式 safe disposition 表达；definition、revision 与 source trace 可区分。若 selected delivery要求 resolved definition，则所需 mapping owner contract 与合法写链必须实际闭合。 | 本地枚举/复制 Role 或 mapping body、hardcode/fallback/`latest`、将 gap 标为 resolved，或在 B01 前写 definition/revision。 | 当前只可验证 typed ref、safe gap、Query no-write 与 Command zero-effect；`MI-UP-003`、B01/B02 阻断 positive definition write。 | P0 failure；hardcode/fallback/伪 resolved 同时进入 `VETO-MI-002/007` 检查。 |
| `AC-FUNC-002` | C-MI-2：pinned static assembly baseline、static/live 分离与派生修订。 | P0 | 完整 baseline 仅由 verified、immutable、static-safe component/extras/base/seed refs 与 placement 构成；派生建立新 revision/derivation context，不覆盖旧事实。若交付要求 Complete/Buildable，则每个必要 owner ref 与写链均可验证。 | mutable/guess/default input、secret/live memory/checkpoint/workspace/external body 入域、缺 input 却声称 Complete/Buildable，或原地覆盖 revision。 | 当前可验证 missing/forbidden input 被 `Blocked`/reject、状态 guard 和零写；`MI-UP-002/003/006/008`、B01/B02 阻断 positive completeness。 | P0 failure；mutable/fallback/forbidden body 进入 `VETO-MI-002/003`。 |
| `AC-FUNC-003` | C-MI-3：受控 build intent、immutable snapshot、attempt/outcome 与 candidate/uncertainty 分层。 | P0 | 合法 intent 关联完整 revision，snapshot 不可变；attempt/outcome 与 candidate 分层；只有 authority、完整输入、safe outcome 与 immutable identity 均真实满足时才形成 candidate，其他结果为 rejected/blocked/failed/unknown。 | 无 authority 或 incomplete input 形成 intent/candidate；provider ACK/tag/body/裸 digest 代替 safe outcome；failed/blocked/unknown 声称 candidate；retry 覆盖旧事实。 | 当前只可证明 `RequestBuildIntent`/`RecordBuildOutcome` 与相关 Job 在 B01/B02 前 zero-effect，以及 unknown 不升级；`MI-UP-005`、`Q-MI-003`、B01/B02、OPEN-01/02 阻断 positive lane。 | P0 failure；违规 candidate/digest/ref 触发 `VETO-MI-004`。 |
| `AC-FUNC-004` | C-MI-4：digest/provenance、applicable gate、eligibility 与 Artifact handoff 分层。 | P0 | provenance 只连接同一 candidate 的完整本仓来源；gate 仅消费正式 authority 的 safe conclusion；只有完整 provenance 和全部 applicable gate 的真实可判断结果才可形成 local eligibility；Artifact handoff 与 eligibility 分开表达。 | incomplete/conflict provenance、missing/unknown gate 默认 Passed/Eligible、将 Artifact ref/ACK/fake 视为 accepted handoff，或把 evidence/Artifact body写入本仓。 | 当前只可证明 `Unknown`/`Blocked`/gap 和 Query no-fetch/no-write；`Q-MI-004`、`MI-UP-007`、B01/B02 阻断 positive eligibility/Artifact lane。 | P0 failure；绕过 gate/Artifact 分层触发 `VETO-MI-005`。 |
| `AC-FUNC-005` | C-MI-5：availability、pinned instantiable entry、rollback/retire 与 consumer handoff gap 分层。 | P0 | local availability 仅由 eligible immutable pin 和合法 append-only transition 形成；entry、replace/rollback/retire 均可追；`ResolveInstantiableEntry` 只能返回 local entry 与 consumer gap 的正式组合，不能把 local supply当 consumer/container success。 | non-eligible/unverifiable/mutable version 进入 Available、history overwrite、retired entry复活、consumer gap 被当 confirmation/launch/health，或 Query/Job 修复 truth。 | 当前可验证 blocked entry、consumer gap、Query no-write、非法 edge和零写；`DDD-S11-B03`、`MI-UP-001`、B01/B02 阻断 positive transition/consumer lane。 | P0 failure；supply/consumer 混写触发 `VETO-MI-006`。 |
| `AC-FUNC-006` | C-MI-1~5 功能链：definition → revision → intent → attempt → provenance → eligibility → availability/entry，断点保持 safe gap。 | P0 | 每个 selected local entry 或 failure context可回查五节点的正式 relation；每个断点有精确 blocked/gap/unknown/failed disposition；没有节点被局部 `Available`/`Fresh`/`Assembled` 或 adapter/fake 伪替代。 | 任一必要节点缺失仍宣称闭环，跨节点状态越级，或把 pending/adapter/fake/consumer资料写成 closed/readiness。 | 当前只能验“链未绕过”和断点安全呈现；完整 positive chain 仍取决于上述所有 blocker 与 owner contracts。 | P0 failure；无可判断节点却声明闭环触发 `VETO-MI-001`，依赖/假事实问题进入 `VETO-MI-007`。 |

## 6. 结构化中间产物：功能闭环矩阵

所有列中的 EV 都是 stable planned family；实际验收必须填写同一 `<run_id>` 下的实例及其 raw artifact/report pair。

| 验收项 | 正式需求 / 设计契约 | 规划测试用例 | 规划 EV | fixed report path | 未来执行时的证据判定 |
|---|---|---|---|---|---|
| `AC-FUNC-001` | `00` §9.1 `F-MI-001~003`、§14.1 `AC-MI-001~003`；`03` §5 DefinitionAssembly/ReferenceDerived、§7.1 `DefineImageVariant`、§7.2 definition/gap Query、§8 current zero-effect。 | `TC-CMD-001/003`、`TC-QUERY-001/009`、`TC-STATE-001~003`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-ENTRY-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-boundary-no-write.md`；`.../ci-entry-contracts.md`。 | evidence index 必须分别证明 typed/source boundary、read-only gap 和 no-write；无 owner resolution 不能伪造 resolved definition。 |
| `AC-FUNC-002` | `00` §9.1 `F-MI-004~006`、§14.2 `AC-MI-006~008`；`03` §5 Assembly、§7.1 baseline/revision Commands、§9 DefinitionAssembly matrices。 | `TC-CMD-002/003/005`、`TC-SEC-001~002`、`TC-STATE-001~003`。 | `EV-UNIT-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-config-security.md`；`.../gate-results.md`。 | 必须区分 missing/rejected 与 Complete/Buildable；scan必须回指 case/artifact，不能用配置表代替。 |
| `AC-FUNC-003` | `00` §9.1 `F-MI-007~009`、§14.3 `AC-MI-011~013`；`03` §5 BuildCandidate、§7.1 build Commands、§7.4 build Jobs、§8 stop rule、§9 build matrices。 | `TC-CMD-004~005`、`TC-JOB-001~002`、`TC-STATE-004~007`、`TC-CON-001~005`。 | `EV-SVC-001`、`EV-INT-001`、`EV-REC-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-integration-seams.md`；`.../nightly-risk.md`。 | current evidence可证明 no-write/unknown；positive candidate只有 owner+blocker闭合后才可形成真实 pass evidence。 |
| `AC-FUNC-004` | `00` §9.1 `F-MI-010~012`、§14.4 `AC-MI-016~018`；`03` §5 Qualification、§7.1 eligibility/handoff Commands、§7.2 provenance Query、§9 qualification matrices。 | `TC-CMD-006~007`、`TC-QUERY-004`、`TC-JOB-003`、`TC-STATE-008~011`、`TC-SEC-001`。 | `EV-SVC-001`、`EV-INT-001`、`EV-SEC-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-integration-seams.md`；`.../pr-config-security.md`。 | current gap/blocked may be evidenced; `Passed`/`Eligible`/Artifact acceptance必须有 future owner-approved oracle，不能以 fake填补。 |
| `AC-FUNC-005` | `00` §9.1 `F-MI-013~015`、§14.5 `AC-MI-021~023`；`03` §5 SupplyEntry、§7.1 supply Commands、§7.2 supply Queries、§9 supply matrices。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-012~018`、`TC-CON-003~005`。 | `EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-entry-contracts.md`；`.../ci-integration-seams.md`；`.../gate-results.md`。 | evidence必须证明 local entry/history与 consumer gap 分离；无 member-service contract时不能产生 consumer pass。 |
| `AC-FUNC-006` | `00` §4.1 `G-MI-001~007`、§9.1 `F-MI-001~015`、§14.6 `AC-MI-026`；`03` §5、§7~§9、§15。 | `TC-STATE-013~019`、`TC-SEC-002`、`TC-QUERY-001~010`、`TC-DEP-001`、`TC-EVENT-001`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/evidence-index.md`；`.../gate-results.md`；`.../redaction-check.md`；relevant suite reports。 | evidence index按节点/AC/TC/case反查；链中 blocked 只能呈现为 blocked，不能被汇总成 ready。 |

## 7. 功能验收项停审与跨功能审计

### 7.1 逐项停审记录

| 验收项 | 正式设计来源 | TC/EV/path 已固定 | 通过/失败可判定 | 当前 phase / blocker 未误用 | 结论 |
|---|---|---|---|---|---|
| `AC-FUNC-001` | 是 | 是，planned | 是 | `MI-UP-003`、B01/B02 保持显式 | 本 Step 停审通过。 |
| `AC-FUNC-002` | 是 | 是，planned | 是 | `MI-UP-002/003/006/008`、B01/B02 保持显式 | 本 Step 停审通过。 |
| `AC-FUNC-003` | 是 | 是，planned | 是 | B01/B02、OPEN、`MI-UP-005`、`Q-MI-003` 保持显式 | 本 Step 停审通过。 |
| `AC-FUNC-004` | 是 | 是，planned | 是 | B01/B02、`MI-UP-007`、`Q-MI-004` 保持显式 | 本 Step 停审通过。 |
| `AC-FUNC-005` | 是 | 是，planned | 是 | B01/B02、B03、`MI-UP-001` 保持显式 | 本 Step 停审通过。 |
| `AC-FUNC-006` | 是 | 是，planned | 是 | 不将 staged status/fake/adapter写成 global readiness | 本 Step 停审通过。 |

### 7.2 跨功能门禁裁决审计

| 审计项 | 结论 | 缺口 / 处理 |
|---|---|---|
| P0 五 capability 与 cross-chain 是否均有功能 gate | 通过 | §5 覆盖六项；专业红线已分配至 Step 6~11。 |
| 是否存在只写“功能可用”的主观门禁 | 通过 | 每项有 pass/fail/current boundary/impact。 |
| 每项是否能回指正式契约、TC、EV 与固定 report | 通过 | §6 固定 future `<run_id>` 路径；尚无实例。 |
| 同一 EV 是否被不透明地重复使用 | 通过 | 允许 suite reuse，但 evidence index必须列 AC→TC→case→artifact/report。 |
| P1/P2/owner pending 是否污染 P0 | 通过 | 仅可作为 blocked/residual；不形成 P0 pass。 |
| current negative test 是否误写为 positive feature pass | 通过 | 每项明确拆分；blocker关闭前不得转义。 |
| 是否存在真实功能结果、run、digest、Artifact/consumer事实 | 否，符合本 Step 边界 | 未生成，未来实际验收才可填写。 |

## 8. 回填草稿（正式 §5）

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“功能验收门禁表”“功能闭环矩阵”“逐项停审记录”和“跨功能门禁裁决审计”小节，了解五 capability 和跨能力功能门禁如何闭环到设计、TC、EV、报告路径与 blocker。

正式 §5 应以 `AC-FUNC-001~006` 定义受控定义、静态装配与派生、构建候选、provenance/eligibility、supply/pinned entry 和五节点功能链。每项必须同时写明 future pass、failure、正式设计契约、planned TC/EV 和 `reports/runs/<run_id>/...` 路径。当前 Command/Job 的 zero-effect、Query no-write、inbound marker 和 local gap 只可证明安全边界；它们不等 positive candidate、eligibility、Artifact handoff、consumer confirmation 或 readiness。任何 selected P0 positive lane仍被 B01/B02、B03、PF、MI-UP 或 Q-MI 阻断时，不得写为通过或有条件通过。

## 9. 待确认事项、自检与进入下一步条件

| 事项 | 影响 | 当前处理 / 重开点 |
|---|---|---|
| owner-controlled positive mapping/component/seed/builder/gate/Artifact/consumer contracts | `AC-FUNC-001~005` positive evidence | 保持 blocker；owner正式闭合后重开本 Step及受影响的 Step 6~11。 |
| canonical input/result、availability persistence、recovery | build/supply positive behavior | B01/B02/B03/PF 不可风险接受为已完成；先重开 03、05 和本 Step。 |
| final actual AC→TC→EV case mapping | evidence index | 已有 stable direction；future run前完成实例化，不可手写。 |
| P1/P2 selected-run 是否升级为 P0 | functional scope | 若升级，重开 Step 2~5 与相关 NFR/risk Step。 |

| 自检项 | 结论 |
|---|---|
| 每个 P0 功能有可判定通过、失败和裁决影响 | 通过。 |
| 每项有正式设计、TC、EV 与固定 report path | 通过；均为 planned/future。 |
| 未将 owner/fake/adapter 或 staged local status写成正向成功 | 通过。 |
| P1/P2 与专业门禁未污染 P0 functional gate | 通过。 |
| 可进入 Step 6 | 通过；下一步单独裁决数据边界与架构红线。 |

```text
step_05 = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_06
next_allowed_action = create_and_complete_step_06_boundary_gate
formal_06_write_allowed = false_until_step_15
actual_function_evidence_generated = false
```
