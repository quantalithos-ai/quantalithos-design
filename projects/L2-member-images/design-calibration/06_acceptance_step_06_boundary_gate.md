# L2-member-images 06 验收标准 Step 6：数据边界与架构红线验收

> 创建日期：2026-09-03  
> 当前状态：`completed_stop_review`  
> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6  
> 回填位置：正式 `06-验收标准.md` 第 6 章“数据边界与架构红线验收”  
> 执行模式：`full-restart`；本文件定义 future P0 红线裁决合同，不生成实现、送验基线、run、artifact、report、EV instance、digest、verdict、signoff 或 readiness。

## 1. Step 状态、开工确认与本步边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 6：定义数据边界与架构红线验收。 |
| 当前模块 | `data_ownership_and_architecture_redlines`。 |
| 本步目标 | 将本仓四类数据、owner / write direction、static/live、projection、依赖裁剪、历史连续性和 P1/P2 隔离转为可检查的 P0 红线。 |
| 本步输入 | `project_execution_ledger.md`；`06_acceptance_calibration_flow.md`；Step 1~5；正式 `00~05`；`01` §4/§8/§9；`03` §3/§5/§7~§15；`04` §4/§7~§12；`05` §3/§5~§6/§9~§10/§13~§14；验收 SOP / 书写规范、真相源闭环标准和全局依赖裁剪规则。 |
| 格式参考 | `projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md` 仅用于验收项小循环、红线表、闭环矩阵和停审粒度；不继承治理对象、EV、阈值、VETO 或结论。 |
| 本步输出 | 红线验收表、数据边界闭环矩阵、不得保存清单、no-write / no-truth-source 清单、依赖裁剪检查、P1/P2 防污染规则、停审与跨红线审计、正式 §6 回填草稿。 |
| 写入前检查 | 项目台账显示 06 Step 5 已完成且用户已授权串行完成 06；flow 允许创建 Step 6；正式 06 仍只允许 Step 15 重建。 |
| 当前真实验收状态 | `not_entered`。没有 implementation source、build/image identity、config digest、fixture、`run_id`、artifact/report pair、redline disposition、VETO checklist、风险接受、签署或总体结论。 |
| gate_status | `pass_with_explicit_blockers`：红线裁决规则和规划证据方向已收稳；所有实际检查结果仍缺失，受影响正向 lane 仍被本仓与 owner blocker 限制。 |
| next_allowed_action | 严格进入 Step 7 `interface_sync_gate`；不得修改正式 06、进入 07、创建 implementation ledger / planned boundary skeleton、实施或执行测试。 |

本 Step 只裁决“什么行为会打穿数据/架构红线”。它不替代 Step 7 的协议与跨仓同步、Step 8 的状态/UoW/幂等、Step 9 的非功能、Step 10 的证据真实性、Step 11 的正式 VETO、Step 12 的缺陷分级或 Step 13 的风险接受。

### 1.1 Step 内计划与模块停审

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| `truth_snapshot_ref_forbidden_body` | done | done | done | done | done | done | pass | 进入 write-direction redline。 |
| `write_direction_projection_history` | done | done | done | done | done | done | pass | 进入 dependency / phase redline。 |
| `dependency_phase_and_p1_p2_isolation` | done | done | done | done | done | done | pass | 执行跨红线审计。 |
| `cross_redline_audit` | done | done | done | done | done | done | pass | 可进入 Step 7。 |

## 2. 本步输入与可裁决性边界

| 输入 | 当前状态 | 本 Step 如何使用 | 不得推导 |
|---|---|---|---|
| 正式 `00` §10~§14 | 当前本仓需求 authority | `BR-MI-001~025`、`D-MI-001~030`、`AC-MI-004/009/014/019/024/027/028`、`VETO-MI-001~007` 的来源与边界。 | 实现结果、真实候选、Artifact / consumer 成功或 readiness。 |
| 正式 `01` §4、§8、§9 | 当前本仓架构 authority | 五 capability owner、六类 seam、data ownership、一致性和禁止依赖。 | 外部 owner body、共享事务、源码依赖或产品选择。 |
| 正式 `02` §3、§5~§11 | 当前概要 authority | 主体分层、局部状态轴、异常隔离、配置不可改变的边界。 | global ready、容器/consumer 生命周期或后续协议事实。 |
| 正式 `03` §3、§5、§7~§15 | 当前详细设计 authority | local truth、typed ref、safe conclusion、gap、no-write surface、state / history、port / fake / composition redline。 | 未闭合 B01/B02/B03/OPEN/PF 的写入、replay、recovery、外部正向结果。 |
| 正式 `04` §4、§7~§12 | 当前配置 authority | five-domain 21 key、strict parse、TestOnly fake、startup-only 和 no-output / no-configure boundary。 | 通过配置解除业务 blocker，或将 `Assembled` 升格为业务 / 外部 readiness。 |
| 正式 `05` §3、§5~§6、§9~§10、§13~§14 | planned verification authority | `TC-*`、`EV-*` family、suite、固定 artifact/report 路径、redaction/dependency/no-write test cut。 | 已执行 case、实际 EV、scan result、report、VETO passed 或测试结论。 |
| `L1-governance` Step 6 | 格式参考 | 单个红线的 pass/fail/evidence/impact、数据清单与跨红线审计粒度。 | Governance truth、policy、approval、EV 或 VETO 语义。 |
| 上游 / sibling material | owner / parallel pending | 以 `compile` / `runtime` / `event` / `ref` / `adapter` / `fake` 和 gap 记录本仓边界。 | exact mapping、component、seed、Artifact、manifest、consumer confirmation、event schema、release / digest 或 readiness。 |

### 2.1 本步的红线判定公式

未来固定送验基线中的单条红线，只有在其设计、测试和证据三侧都可回查时才可裁决为通过：

```text
redline_pass(AC-RED-MI-n) :=
  fixed source / delivery / profile / fixture / run baseline
  AND each mapped TC has a same-run raw artifact/report pair
  AND the asserted local truth is owned by L2-member-images
  AND every external value remains a typed ref, safe snapshot/conclusion, or explicit gap
  AND forbidden body / forbidden write / forbidden dependency is absent
  AND staged local state is not promoted across owner or phase boundaries
  AND no applicable VETO condition is triggered
```

缺少真实证据时的状态是 `not_evaluable` / `not_decidable`，不是红线“未触发”。`blocked`、`pending`、`unknown`、`gap`、`unavailable` 和 current zero-effect 可以证明 fail-closed 边界，但不能替代被阻断 positive lane 的通过证据。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 | 当前边界 |
|---|---|---|
| 哪些数据不得由本仓保存？ | Role / mapping body，member / runtime / tools / capability / adapter truth，secret、live memory、checkpoint、workspace live content，scheduler / builder / registry job/log/backend body，policy / evidence / key / vulnerability / Artifact body/lifecycle，以及 container / health / observed consumption 均不得进入本仓 truth、snapshot、ref、trace、log、metric、report 或构建输入。 | 本仓可持有 body-free typed ref、safe snapshot/conclusion、gap、local decision/history；物理 materialization 不转移外部语义 owner。 |
| 哪些下游不得反向改写真相？ | `L2-member-service`、runtime、member、tools、Artifact、registry、builder、governance/evidence、sandbox、Bus、observability、consumer、container、API/worker/jobs、query、projection、report 和 fake 均不得创建、覆盖、批准、关闭或修复本仓 core truth。 | 下游 / owner 结果只能成为正式 ref、safe conclusion、gap 或独立 external snapshot；当前 sibling 仍不能形成正向合同。 |
| 哪些 projection / cache 不得反写真相？ | mapping / component / gate / consumer shadow，derived trace、read view、maintenance summary、freshness marker、cache、report、reconciliation、config composition 和 TestOnly fake 只能读取、解释或明确标记自身状态。 | `Get*` Query 不写；current Command/Job 在 B01/B02 前 zero-effect；`RebuildImageDerivedViews` 在 PF 前不做 recovery write。 |
| 哪些 P1/P2 能力不得污染 P0？ | owner-closed real-like adapter、真实 builder/registry/gate/evidence/Artifact/consumer、staging/production-like、量化性能/扫描/签名/容量、multi-architecture、restricted variant、hardened base、usage summary 和产品入口均不得成为当前 P0 truth、schema、config、evidence 或 pass 的替代物。 | P1/P2 未运行不使 P0 自动失败；但一旦其结果被用于绕过 P0 redline，则为 P0 failure，必要时进入 `VETO-MI-007` 候选。 |
| 红线失败是否一票否决？ | 任一 `AC-RED-MI-*` 实际 failure 阻断总体“通过”。涉及伪闭环、fallback/mutable input、forbidden body、fake candidate、gate/Artifact bypass、supply/consumer 混写或 owner/dependency/readiness 伪造的 failure 分别登记为 `VETO-MI-001~007` 候选。 | Step 6 不提前声明某 VETO 已触发或已经通过；Step 11 才定义正式检查表和不可风险接受的最终 VETO 口径。 |

## 4. 当前材料问题诊断与改动对比

| 材料 / 位置 | 问题或风险 | 本 Step 处理 |
|---|---|---|
| historical `06-验收标准.md` | 旧稿以 image/persona/toolset/seed/publish/instantiate 主线笼统描述，不区分本仓 truth、外部正文、live state、Artifact/consumer 与 projection。 | 只作污染样本；以四类数据、十项红线和独立 closure matrix 重建 future §6。 |
| Step 5 功能门禁 | 已有 capability pass/fail，但 data owner、read/write direction、dependency category 和 P1/P2 隔离仍可能被“功能可用”覆盖。 | 将这些前提独立升级为 `AC-RED-MI-001~010`，功能 pass 不替代红线 pass。 |
| `03` 的 local staged states | `Resolved`、`Complete`、`Buildable`、`Succeeded`、`Passed`、`Eligible`、`Available`、`Fresh`、`Assembled` 可能被误读为 external/global readiness。 | 仅按对应 subject 的局部语义检查；跨 subject / owner / phase promotion 是红线 failure。 |
| `04` TestOnly fake / composition | fake、opaque ref 或 `ImageRuntimeAssemblyState::Assembled` 可能被误报为 builder/gate/Artifact/consumer 成功。 | 只可验证 fail-closed / parity / slot boundary；不得形成正向外部事实或 P0 completion evidence。 |
| pending owner / sibling contracts | 真实 mapping、component、seed、builder、Artifact、consumer、event/gate 合同未闭合。 | 保持 `MI-UP-*` / `Q-MI-*`、blocked / gap / marker；不写 manifest、variant、ref、digest、handoff、confirmation 或 readiness。 |

| 维度 | historical / 未校准口径 | 本 Step 后口径 | 原因 |
|---|---|---|---|
| 数据分类 | “image metadata / registry record / seed”一类泛化对象。 | formal truth、snapshot/projection、reference、forbidden body 四类且有 owner / lifecycle。 | 可定位双真相、正文入仓和 phase 混写。 |
| 外部输入 | adapter ACK、tag、cache、registry 或 sibling 材料可暗示成功。 | 仅 owner-approved ref / safe conclusion / explicit gap 可参与本地判断；ACK/fake 不等 domain success。 | 防止正向事实伪造。 |
| 消费关系 | availability / entry 可被写成 launch、health 或 consumer confirmation。 | local supply 与 external container/consumer truth 分域；`ConsumerHandoffGap` 不反写 availability。 | 保护 Layer 3 并行边界。 |
| read / maintenance 面 | Query、cache、report、reconcile 可被当成修复通道。 | 只读 / derived / marker 语义；不得创建或覆盖 core truth。 | 维护面不是第二写源。 |
| P1/P2 | 真实产品、外围增强或性能样本可补齐 P0。 | 仅 residual/future；只有正式选入并重开范围后才能单列裁决。 | 不稀释当前 P0 分母。 |

## 5. 验收裁决取舍

| 议题 | 备选 | 结论 | 原因 |
|---|---|---|---|
| 红线粒度 | A. 一条“边界安全”；B. 按 truth、body、write direction、history、dependency、phase 分条。 | 采用 B。 | 单条 failure 才能回指 owner、TC/EV、VETO 候选和修复方向。 |
| 数据归属检查 | A. 只看 storage；B. 覆盖 domain、snapshot/ref、protocol、trace/log/report、build input 和 configuration output。 | 采用 B。 | forbidden body 或反写可发生在任何载体，不只在 repository。 |
| 外部成功输入 | A. ACK/tag/cache/fake 可作正向 oracle；B. 只接受正式 owner safe result，缺失时 fail closed。 | 采用 B。 | adapter / fake 不拥有 candidate、eligibility、Artifact 或 consumer truth。 |
| 依赖验收 | A. 消费即源码依赖；B. 按 compile/runtime/event/ref/adapter/fake 分类。 | 采用 B。 | 只有获正式认定的 `L0-core` shared carrier 才可能成为 compile dependency。 |
| P1/P2 可用性 | A. 未可用即 P0 fail；B. 不入 P0 分母，但污染 P0 时失败。 | 采用 B。 | 区分“未选入 / owner pending”与“绕过核心红线”。 |
| VETO 处理 | A. 本 Step 直接裁决；B. 记录候选并由 Step 11 收口。 | 采用 B。 | 保持验收 SOP 的 Step 边界与风险接受纪律。 |

## 6. 结构化中间产物：架构红线验收表

所有 TC / EV / path 均为 future planned contract。实际送验时，必须以同一 `<run_id>` 的 `artifacts/test/<run_id>/...` 与 `reports/runs/<run_id>/...` 实例、`reports/acceptance/veto-checklist.md` 和 `handoff.md` 复核；本表不是实际结果。

| 验收项 ID / 红线 ID | 红线 | 未来通过条件 | 失败条件 | 规划证据来源 | 裁决影响 / VETO 候选 |
|---|---|---|---|---|---|
| `AC-RED-MI-001` / `RL-MI-001` | 本仓 image-domain truth 唯一 | 只有 definition/source-validity conclusion、baseline/revision/derivation、intent/attempt/outcome/candidate relation、digest/provenance/evaluation/eligibility、availability/history/entry/local handoff-gap 是本仓正式 truth；每个写入仅从 owning local flow 形成。 | Role、component、seed、builder、policy/evidence、Artifact、container/consumer 或 report/cache 被存为本仓 truth，或本仓 local truth 被旁路状态替代。 | `TC-CMD-001~010`、`TC-STATE-001~019`、`TC-CON-003~005`；`EV-UNIT-001`、`EV-INT-001`、`EV-GATE-001`；`pr-contract-domain`、`ci-integration-seams`、`gate-results.md`。 | P0 failure；owner/ready 伪造进入 `VETO-MI-001/007` 候选。 |
| `AC-RED-MI-002` / `RL-MI-002` | mapping、component、seed 与 external ref 不接管正文 | 外部 Role/mapping、component/extras/base、policy/memory/workspace seed、trigger、builder/registry、evidence/Artifact 与 consumer 仅以 typed identity/pin/placement/ref、safe snapshot/conclusion 或 explicit gap 进入；读取面 body-free。 | 本地复制/枚举/编辑 mapping 或 component/seed semantic body，ref 失效时用 cache/default/body 补齐，或以本地 shadow 冒充 owner truth。 | `TC-CMD-001~002/005`、`TC-QUERY-001/008/009`、`TC-SEC-001`、`TC-DEP-001`；`EV-UNIT-001`、`EV-SEC-001`、`EV-GATE-001`；`pr-contract-domain`、`pr-config-security`、`ci-dependency-redaction`。 | P0 failure；fallback、正文或 fake owner 进入 `VETO-MI-002/003/007` 候选。 |
| `AC-RED-MI-003` / `RL-MI-003` | static / live / sensitive body 严格分离 | template/seed/static ref/placement 与 build input 均不含 secret、credential、live memory、checkpoint、workspace live content、container/runtime/observed body；同一禁止面也不进入 config output、trace/log/metric/report/artifact。 | 任一 forbidden sentinel/body 进入 definition、baseline、snapshot、candidate、entry、view、audit/trace、log/metric、artifact 或 report；仅 hash/encrypt 后保存也不能免责。 | `TC-CMD-002/005`、`TC-SEC-001~002`、`TC-CONFIG-001/004`、`TC-QUERY-008`；`EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`；`pr-config-security`、`ci-dependency-redaction`、`redaction-check.md`。 | P0 hard failure；进入 `VETO-MI-003` 候选，不能风险接受。 |
| `AC-RED-MI-004` / `RL-MI-004` | adapter / external outcome 不直写 candidate、eligibility 或 Artifact truth | builder/registry/event/evidence/Artifact input 先保持 ref、safe conclusion、unknown、blocked 或 gap；只有本仓 guard 在完整 local context 中成立时才形成相应 local staged fact，Artifact formal ref 仍只由 Artifact owner 签发。 | ACK、tag、裸 digest、provider/backend body、event arrival、fake 或 local cache 直接成为 candidate、`Passed`、`Eligible`、Artifact `Accepted` 或 formal reference。 | `TC-CMD-004~007`、`TC-QUERY-003~004`、`TC-JOB-002~003/006`、`TC-STATE-004~011`；`EV-SVC-001`、`EV-INT-001`、`EV-SEC-001`、`EV-ENTRY-001`；`pr-boundary-no-write`、`ci-integration-seams`、`ci-entry-contracts`。 | P0 failure；分别进入 `VETO-MI-004/005/007` 候选。 |
| `AC-RED-MI-005` / `RL-MI-005` | local supply / entry 与 Artifact、consumer、container 分域 | local availability 与 entry 只绑定 eligible immutable pin、local transition/history 和 local handoff/gap；consumer/container/refusal/health/observed result不反写 availability，`ResolveInstantiableEntry` 不声称 launch/readiness。 | mutable/non-eligible/unverifiable input 可用、entry/availability直接等同 Artifact acceptance、consumer confirmation、container created/healthy或产品 readiness。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-012~018`、`TC-SEC-002`；`EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-GATE-001`；`pr-boundary-no-write`、`ci-entry-contracts`、`ci-integration-seams`。 | P0 failure；进入 `VETO-MI-006/007` 候选。 |
| `AC-RED-MI-006` / `RL-MI-006` | query / projection / maintenance / fake 不得反写真相 | Query 只读已有 local truth/view；projection/trace/report/reconcile/cache/fake 只读、派生、标记或受正式 future flow 限制的 rebuild，不创建、修复、批准、关闭或覆盖 core truth；fake 仅 `ci-test + TestOnly`。 | Query/UoW、job、report、cache、refresh/rebuild、fake 或 diagnostic 隐式写 definition、gap、trace、freshness、history、result、candidate、eligibility 或 availability。 | `TC-QUERY-001~010`、`TC-JOB-004~005`、`TC-OBS-001~002`、`TC-REC-001`、`TC-CONFIG-003~005`；`EV-SVC-001`、`EV-ENTRY-001`、`EV-REC-001`、`EV-OBS-001`、`EV-CONFIG-001`。 | P0 failure；core writeback / fake promotion进入 `VETO-MI-001/007` 候选。 |
| `AC-RED-MI-007` / `RL-MI-007` | revision、attempt、evaluation、transition 与 trace/history 只追加或显式 supersede | revision、attempt、gate evaluation、availability transition、handoff/gap 与 trace 均按正式 subject 新建 context、append 或 supersede；旧事实可追、不被原地重算/覆盖，rollback/retire 仍保留历史。 | 原地修改/删除旧 revision、attempt、evaluation、transition、candidate/digest/history；`Blocked`/terminal 复活为 positive，或 retry 用新 outcome 覆盖旧语境。 | `TC-CMD-003/009/010`、`TC-STATE-001~019`、`TC-CON-001~005`、`TC-QUERY-007`；`EV-UNIT-001`、`EV-INT-001`、`EV-SVC-001`；`pr-contract-domain`、`ci-integration-seams`。 | P0 failure；supply/history 混写进入 `VETO-MI-006` 候选，其他伪闭环进入 `VETO-MI-001/007` 候选。 |
| `AC-RED-MI-008` / `RL-MI-008` | staged state / phase 不得跨 owner 升格 | `Resolved`、`Complete`、`Buildable`、`Succeeded`、`Passed`、`Eligible`、`Available`、`Fresh`、`Assembled` 均保持对应 object/local composition 的已定义语义；状态/视图中保留 owner、source/gap、phase 和 freshness。 | 任一局部状态、adapter status、registry presence、planned EV、cache、report 或 sibling draft 被汇总为 candidate/Artifact/consumer/runtime/container/global readiness。 | `TC-SEC-002`、`TC-STATE-004~019`、`TC-QUERY-002/004/005/010`、`TC-CONFIG-003~005`；`EV-UNIT-001`、`EV-SVC-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-GATE-001`。 | P0 hard failure；进入 `VETO-MI-001/005/006/007` 候选。 |
| `AC-RED-MI-009` / `RL-MI-009` | 依赖类别、事件库存和 write direction 均受裁剪 | 仅正式 `L0-core` shared carrier 在 `MI-UP-004` 闭合并经 future activation 核验后才可作为 conditional compile candidate；Method/Runtime/Tools/Member/Member Service/Artifact/seed/registry/gate 仍是 runtime/ref/adapter，Bus 仅 conditional inbound event，outbound inventory 为 `ImageOutboundEventInventory::NoneAuthorized`。 | sibling / owner source/path/package dependency、本地 shadow Core schema、未授权 event DTO/topic/outbox/publisher，或 consumer/adapter 从边界直写 core。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-CONFIG-001~005`；`EV-GATE-001`、`EV-ENTRY-001`、`EV-CONFIG-001`；`ci-dependency-redaction`、`ci-entry-contracts`、`gate-results.md`。 | P0 failure；进入 `VETO-MI-007` 候选。 |
| `AC-RED-MI-010` / `RL-MI-010` | P1/P2、pending 与 planned evidence 不污染 P0 | P1/P2 real-like/product/production/quantitative/enhancement results只作为独立 selected-run/residual/future；current P0 仅由正式范围与同 run 实证裁决。B01/B02/B03/OPEN/PF、`MI-UP-*`、`Q-MI-*` 不被 fake、configuration、manual statement或风险接受伪关闭。 | P1/P2/adapters/fake/placeholder/old material/handwritten EV 被当 P0 pass，或 owner pending 被改写为 N/A、ready、accepted、digest、consumer confirmation或最终结论。 | `TC-CONFIG-001~005`、`TC-SEC-002`、`TC-DEP-001`、`TC-EVENT-001`、`TC-PERF-001`；`EV-CONFIG-001`、`EV-SEC-001`、`EV-GATE-001`、`EV-PERF-001`；`pr-config-security`、`ci-dependency-redaction`、`nightly-risk`。 | P0 failure if P0 is polluted; fabricated readiness enters `VETO-MI-001/007` candidate. P1/P2 merely unavailable remains residual, not a P0 pass/fail substitute. |

## 7. 结构化中间产物：数据边界闭环矩阵

| 验收项 | 需求 / 架构 / 详细设计契约 | 规划 TC | 规划 EV | fixed report path | future 裁决口径 |
|---|---|---|---|---|---|
| `AC-RED-MI-001` | `00` §11 `D-MI-001/002/006~008/013/014/019/020/026~028`、§14 `AC-MI-004/009/014/019/024/028`；`01` §4/§9；`03` §5/§10。 | `TC-CMD-001~010`、`TC-STATE-001~019`、`TC-CON-003~005`。 | `EV-UNIT-001`、`EV-INT-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../ci-integration-seams.md`；`.../gate-results.md`。 | local truth allow-list、write graph和history必须一致；无 same-run evidence 为不可裁决。 |
| `AC-RED-MI-002` | `00` §10 `BR-MI-001~010`、§11 `D-MI-003~005/009/010/012`、§12；`01` §4/§8/§9；`03` §5/§13。 | `TC-CMD-001~002/005`、`TC-QUERY-001/008/009`、`TC-SEC-001`、`TC-DEP-001`。 | `EV-UNIT-001`、`EV-SEC-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-config-security.md`；`.../gate-results.md`。 | typed ref/safe gap 必须与 body-free scan共同成立；source unavailable 不能被 local fallback 解释为 pass。 |
| `AC-RED-MI-003` | `00` §10 `BR-MI-007/010/020/023`、§11 `D-MI-011/018/025/030`；`01` §3/§4/§9；`03` §3/§14；`04` §8。 | `TC-CMD-002/005`、`TC-SEC-001~002`、`TC-CONFIG-001/004`、`TC-QUERY-008`。 | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-config-security.md`；`.../redaction-check.md`；`.../gate-results.md`。 | forbidden-body scan覆盖 input、state、output和report；任一泄露不能由脱敏说明、hash或风险接受放行。 |
| `AC-RED-MI-004` | `00` §10 `BR-MI-011~020`、§11 `D-MI-015~025`、§14 `AC-MI-014/019`；`01` §4/§8/§9；`03` §5/§7~§9/§13。 | `TC-CMD-004~007`、`TC-QUERY-003~004`、`TC-JOB-002~003/006`、`TC-STATE-004~011`。 | `EV-SVC-001`、`EV-INT-001`、`EV-SEC-001`、`EV-ENTRY-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-integration-seams.md`；`.../ci-entry-contracts.md`。 | external outcome 和 local staged fact必须可分；blocked/unknown/gap 可被证明，positive candidate/eligibility/Artifact则仍需 owner-approved oracle。 |
| `AC-RED-MI-005` | `00` §10 `BR-MI-021~025`、§11 `D-MI-026~030`、§14 `AC-MI-024`；`01` §4/§9；`03` §5/§7~§9。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-012~018`、`TC-SEC-002`。 | `EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-entry-contracts.md`；`.../ci-integration-seams.md`。 | entry/history / consumer gap分离必须可复核；无 `MI-UP-001` 合同不能填 consumer pass。 |
| `AC-RED-MI-006` | `00` §10 `BR-MI-005/015/025`、§11 snapshot/projection 数据；`01` §8/§9；`03` §5/§7~§10/§14；`04` §9~§11。 | `TC-QUERY-001~010`、`TC-JOB-004~005`、`TC-OBS-001~002`、`TC-REC-001`、`TC-CONFIG-003~005`。 | `EV-SVC-001`、`EV-ENTRY-001`、`EV-REC-001`、`EV-OBS-001`、`EV-CONFIG-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`.../ci-entry-contracts.md`；`.../nightly-risk.md`。 | no-write/no-repair证明只覆盖当前边界；PF 关闭前不得以 Query/Job/marker 补造 recovery。 |
| `AC-RED-MI-007` | `00` §10 `BR-MI-003/009/014/019/022/025`；`01` §4/§9；`03` §9~§12。 | `TC-CMD-003/009/010`、`TC-STATE-001~019`、`TC-CON-001~005`、`TC-QUERY-007`。 | `EV-UNIT-001`、`EV-INT-001`、`EV-SVC-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../ci-integration-seams.md`。 | append/supersede/terminal behavior必须可回查；B01/B02/B03未闭合时不得把未发生的 write/history当成功。 |
| `AC-RED-MI-008` | `00` §4/§10/§13/§14；`01` §3/§4/§9；`02` §9；`03` §9/§13~§15；`04` §9。 | `TC-SEC-002`、`TC-STATE-004~019`、`TC-QUERY-002/004/005/010`、`TC-CONFIG-003~005`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-boundary-no-write.md`；`.../pr-config-security.md`；`.../gate-results.md`。 | 每个 state/view必须保留其 subject和phase；无 global readiness enum、mapper或报告汇总可替代该检查。 |
| `AC-RED-MI-009` | `00` §6/§12；`01` §8；`03` §3/§7/§13；`04` §6/§9；`05` §9~§10。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-CONFIG-001~005`。 | `EV-GATE-001`、`EV-ENTRY-001`、`EV-CONFIG-001`。 | `reports/runs/<run_id>/gate-results.md`；`.../suites/ci-dependency-redaction.md`；`.../suites/ci-entry-contracts.md`。 | runtime/ref/adapter/fake不等package dependency；outbound zero必须由实际 inventory audit 证明。 |
| `AC-RED-MI-010` | `00` §4.3/§9.2/§14.6~§14.7；`01` §3.2/§14~§15；`04` §6/§11~§14；`05` §2/§10/§13~§14。 | `TC-CONFIG-001~005`、`TC-SEC-002`、`TC-DEP-001`、`TC-EVENT-001`、`TC-PERF-001`。 | `EV-CONFIG-001`、`EV-SEC-001`、`EV-GATE-001`、`EV-PERF-001`。 | `reports/runs/<run_id>/suites/pr-config-security.md`；`.../gate-results.md`；`.../suites/nightly-risk.md`。 | only actual same-run P0 evidence can prove P0; P1/P2/pending absence is classified as residual/blocked and cannot reduce the denominator. |

## 8. 不得由本仓保存或反写的数据清单

| 外部数据类别 | 禁止保存 / 反写的内容 | 允许的最小形态 | 主要 owner / 未闭口处理 |
|---|---|---|---|
| Role / method | `RoleDefinition`、Role-to-variant mapping body、角色正文或本地枚举。 | body-free mapping source ref、safe consumption snapshot、validity conclusion、gap。 | `L3-method-library`；`MI-UP-003` 前只可 blocked/unavailable/gap。 |
| Member / Runtime / Tools / extras | member 主体、runtime loop/turn/plan、tool contract/execution/capability registry、release/compatibility body。 | immutable component/extras ref、pin、placement、safe reason。 | respective owner；`MI-UP-002` 及 component contract 未闭口时不得猜测。 |
| Policy / memory / workspace seed | policy effective truth、live memory、checkpoint、workspace live content、seed semantic body。 | static template ref、version/pin、placement、gap。 | seed/governance/runtime/security owner；`MI-UP-006` 前只保存 body-free relation。 |
| Builder / registry / event | scheduler run、job/log/backend body、provider result、event payload/envelope/receipt/topic、registry truth。 | trigger / execution / immutable image ref、safe outcome, `Unknown` / `Blocked` / marker。 | external owner；`MI-UP-005` marker-only，`Q-MI-003` fail closed。 |
| Evidence / Artifact | policy/evidence/key/vulnerability body、ArtifactVersion/lineage/baseline/formal ref truth。 | applicable safe conclusion snapshot、evidence ref、Artifact handoff relation/gap。 | governance/evidence / `L1-artifact`；`Q-MI-004` / `MI-UP-007` 前无 positive ref/Accepted。 |
| Consumer / container / observed | manifest body、container lifecycle、launch/health/upgrade/notification、runtime live / observed consumption。 | local entry binding、local handoff record、`ConsumerHandoffGap`、conditional safe snapshot。 | `L2-member-service` / Runtime / Observability；`MI-UP-001` 前无 confirmation or readiness。 |
| Derived / diagnostic surfaces | cache、projection/read model、report/evidence instance、audit backend/log/metric/span raw body、TestOnly fake state。 | body-free view, freshness/gap/marker, redacted safe diagnostic ref。 | local derived boundary; no writeback, no actual evidence fabricated. |

## 9. no-truth-source、依赖裁剪与 P1/P2 防污染

### 9.1 不得成为 core truth source 的面

| 面 | 允许行为 | 禁止行为 | 规划验证 |
|---|---|---|---|
| 10 Query | 严格读取 existing local truth / view，返回 `Missing`、`Stale`、`Unavailable`、gap 或 page。 | start UoW、reserve/save、写 gap/trace/freshness、refresh/rebuild、call adapter 或补齐 source。 | `TC-QUERY-001~010`；`EV-SVC-001`、`EV-ENTRY-001`。 |
| 2 marker-only inbound | 返回 `InboundContractMarker::{Unavailable, Rejected, ReopenRequired}`，`accepted_input=false`。 | parse payload/envelope、receipt/dedup、mutation、candidate、event output。 | `TC-IN-001~002`；`EV-ENTRY-001`。 |
| 6 bounded Jobs | 只做 explicit bounded scope 与 B01/B02 safe disposition；future reopen 后亦不得越 owner boundary。 | scheduler/run/report/evidence truth、blind retry、owner truth repair、current write。 | `TC-JOB-001~006`；`EV-ENTRY-001`、`EV-REC-001`。 |
| projection / cache / report / trace | 从 committed local truth 和 controlled ref 派生；明确 stale/rebuilding/unavailable。 | 反写 core、以 cache/default补 missing、将 report/trace变 candidate/evidence/ready truth。 | `TC-QUERY-002/008/010`、`TC-JOB-004~005`、`TC-OBS-001~002`、`TC-REC-001`。 |
| configuration / composition / fake | strict parse、explicit profile / slot、TestOnly parity、`Assembled` local composition state。 | config改变 owner/state/UoW/availability semantics、fake production fallback、slot/Assembled 升格为 external success。 | `TC-CONFIG-001~005`、`TC-SEC-002`；`EV-CONFIG-001`、`EV-SEC-001`。 |

### 9.2 依赖裁剪验收检查

规则来源：`standards/document/全局项目依赖关系与裁剪规则.md`；本表只裁剪 `L2-member-images` 相关边，不复制全局矩阵。

| 关联方 / seam | 全局类型 | 本仓验收时允许检查 | 禁止误写为 | 失败处理 |
|---|---|---|---|---|
| `L0-core` | conditional `compile` | future approved shared carrier identity / package boundary；当前 active dependency 仍为零。 | local shadow schema、未获核验的 Cargo/path dependency。 | `MI-UP-004` 前 blocked；发现 shadow/unauthorized compile edge为 `AC-RED-MI-009` failure。 |
| `L3-method-library` | `runtime + ref` | body-free mapping ref/snapshot/gap 接缝。 | source/path/package dependency，Role/mapping body ownership。 | `MI-UP-003` 前 fail closed。 |
| `L2-runtime` / `L2-tools` / `L2-member` | `ref`（适用时 runtime） | component/extras release ref、pin and static/live boundary。 | sibling source/package dependency、loop/tool/member truth。 | missing/compatibility gap不作 local fallback。 |
| `L2-member-service` | `runtime + ref + adapter` | local pinned entry / consumer-gap semantics。 | exact manifest/endpoint/confirmation、container lifecycle或双向 sibling compile dependency。 | `MI-UP-001` 前 only gap/unavailable/reopen. |
| `L1-artifact` | `ref + adapter` | local handoff record / formal ref gap。 | ArtifactVersion/lineage/baseline ownership、fake Accepted。 | `MI-UP-007` 前 only Pending/Gap. |
| `L0-bus` / inbound owner | conditional `event + adapter` | marker inventory and `accepted_input=false` boundary。 | active event schema/topic/envelope/outbox/publisher or outbound inventory。 | `MI-UP-005/009` 前 no positive inbound/outbound. |
| builder / registry / gate/evidence / seed / sandbox | `ref + adapter` / future ref | body-free slot/ref/safe conclusion/gap。 | vendor product truth、credential/body、positive result/default pass、Sandbox policy/backend。 | owner/policy unknown remains blocked. |
| fake | local test seam | TestOnly deterministic negative/parity behavior only。 | production composition、external success, evidence instance or blocker closure。 | fake promotion is redline failure. |

### 9.3 P1/P2 防污染规则

| P1/P2 或 pending 类别 | P0 中允许的检查 | 明确禁止 | 当前处理 |
|---|---|---|---|
| owner-closed real-like builder / registry / evidence / Artifact / consumer integration | 判断其是否仍被独立于本仓 truth 的 ref/adapter/gap 边界包住。 | 用 real-like ACK 或 adapter success替代 P0 fail-closed / no-write / body-free evidence。 | P1 selected-run / future；未选入不计 P0 pass。 |
| staging-like / production-like / quantitative scan/sign/size/performance/capacity | 保留 future profile、baseline或 residual requirement。 | 无来源数值、样本或环境名成为 P0 threshold / pass。 | `TC-PERF-001` 仅 baseline design，`EV-PERF-001` 无当前 verdict。 |
| multi-architecture、restricted variant、hardened base、usage summary | 验证尚未启用时不改变 current core state/owner boundary。 | 写入 P0 config/schema/entry或绕过 core gate。 | `Q-MI-001/002`、`MI-UP-008` future only。 |
| B01/B02/B03/OPEN/PF and `MI-UP-*` / `Q-MI-*` | 验证 current blocked/no-write/marker/gap disposition真实保留。 | 用 configuration、manual review、fake、cache、planned report或风险接受标记为 closed/ready。 | 保持 blocked/pending；owner closure触发重开受影响 03/04/05/06 Step。 |

## 10. 红线停审与跨红线裁决审计

### 10.1 逐项停审记录

| 验收项 | 正式来源完整 | TC / EV / path 固定（planned） | pass/fail 可判定 | 未提前裁决 VETO | blocker / phase 未误用 | 结论 |
|---|---|---|---|---|---|---|
| `AC-RED-MI-001` | 是 | 是 | 是 | 是 | B01/B02/B03下不伪造 local write | 本 Step 停审通过。 |
| `AC-RED-MI-002` | 是 | 是 | 是 | 是 | `MI-UP-002/003/006` 保持 ref/gap | 本 Step 停审通过。 |
| `AC-RED-MI-003` | 是 | 是 | 是 | 是 | no actual scan / evidence result | 本 Step 停审通过。 |
| `AC-RED-MI-004` | 是 | 是 | 是 | 是 | `MI-UP-005/007`、`Q-MI-003/004`、B01/B02保持显式 | 本 Step 停审通过。 |
| `AC-RED-MI-005` | 是 | 是 | 是 | 是 | `MI-UP-001`、B03、B01/B02不转 consumer/local supply pass | 本 Step 停审通过。 |
| `AC-RED-MI-006` | 是 | 是 | 是 | 是 | PF / B01/B02不被 Query/Job/fake 绕过 | 本 Step 停审通过。 |
| `AC-RED-MI-007` | 是 | 是 | 是 | 是 | history persistence/replay仍 blocked，不填实施事实 | 本 Step 停审通过。 |
| `AC-RED-MI-008` | 是 | 是 | 是 | 是 | staged states不提升 global readiness | 本 Step 停审通过。 |
| `AC-RED-MI-009` | 是 | 是 | 是 | 是 | sibling pending不变成 compile/event contract | 本 Step 停审通过。 |
| `AC-RED-MI-010` | 是 | 是 | 是 | 是 | P1/P2、planned EV和pending不降低 P0 分母 | 本 Step 停审通过。 |

### 10.2 跨红线审计表

| 审计项 | 结论 | 缺口 / 处理 |
|---|---|---|
| 四类数据是否覆盖定义、装配、构建、资格、供给与派生读取 | 通过 | `AC-RED-MI-001~005` 覆盖所有五 capability；`AC-RED-MI-006~008`覆盖读面、历史和 phase。 |
| 是否存在本仓 / 外部双真相或正文入仓口径 | 未发现 | owner truth、body-free ref/snapshot、forbidden body清单均明确。 |
| projection/cache/report/query/job/fake 是否可能成为第二写源 | 未发现 | `AC-RED-MI-006` 独立裁决；接口和状态细节留 Step 7/8。 |
| 依赖类型是否误将 runtime/event/ref/adapter/fake 写为 compile | 未发现 | `AC-RED-MI-009` 保持 only-Core conditional compile and zero active dependency。 |
| local staged status 是否被写成 global or consumer readiness | 未发现 | `AC-RED-MI-005/008/010` 分别覆盖 supply、phase与P1/P2污染。 |
| P1/P2 / owner pending 是否污染 P0 | 未发现 | unavailable不是 P0 pass/fail替代；污染 P0 才为 failure。 |
| 是否提前把 redline failure 写成实际 VETO 或使用风险接受放行 | 未提前 | 仅登记 `VETO-MI-*` candidate；Step 11/13 再分别收口。 |
| 是否存在真实 redline result、EV instance、digest、Artifact/consumer事实或 verdict | 否，符合本 Step 边界 | 未来必须从 fixed-run evidence再裁决。 |

## 11. 回填草稿（正式 §6）

> 校准来源：
> - `design-calibration/06_acceptance_step_06_boundary_gate.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“架构红线验收表”“数据边界闭环矩阵”“不得由本仓保存或反写的数据清单”“no-truth-source、依赖裁剪与 P1/P2 防污染”“红线停审与跨红线裁决审计”小节，了解本章如何从正式需求、架构、详细设计和测试计划收敛。

正式 §6 应以 `AC-RED-MI-001~010` 规定：本仓只拥有 image-domain local truth；外部值只可作为 body-free typed ref、safe snapshot/conclusion 或 explicit gap；secret、live state、external semantic/backend/Artifact/container/observed body不得进入任何构建输入、truth、view、trace、log、report或证据面；Query、marker inbound、Job、projection/cache/report/config/fake不得成为 core truth 的第二写源；revision/attempt/evaluation/transition/history只能 append、supersede或形成新 context；local supply/entry不能被写成 Artifact、consumer/container或 global readiness；仅获正式认定的 Core carrier才可能成为 conditional compile dependency；P1/P2、pending、fake和planned evidence不得污染P0。

每项 future pass 必须有同一 `<run_id>` 的 planned TC/EV/artifact/report pair支持。红线 failure 阻断总体通过；涉及 `VETO-MI-001~007` 的情形仅在 Step 11 按固定 checklist正式判定，且不得由风险接受覆盖。当前无实际 redline、VETO、evidence或交付结论。

## 12. 待确认事项、自检与进入下一步条件

| 事项 | 影响 | 当前处理 / 重开点 |
|---|---|---|
| owner-controlled mapping/component/seed/builder/gate/Artifact/consumer contracts | `AC-RED-MI-002/004/005` 的 positive evidence | `MI-UP-001~008`、`Q-MI-003/004` 保持 pending；owner正式关闭后重开 Step 5~11 的受影响项。 |
| canonical input/result、terminal transition persistence、recovery | no-write/history/replay/recovery evidence | B01/B02、B03、OPEN-01/02、PF 继续 blocked；先重开 03/05 与本 Step相关 redline。 |
| Core shared carrier / actual package graph | `AC-RED-MI-009` compile audit | `MI-UP-004` 前 active dependency为零；不得预写 package path。 |
| P1/P2 是否被某 release 明确选入 | `AC-RED-MI-010` P0 denominator | 当前不选入；若升级，重开 Step 2、5、6、9、11、13。 |
| final actual AC→TC→EV→case mapping | fixed-run redline verdict | current mapping只是 planned direction；未来 run前/中由 evidence index实例化，不得手写。 |

| 自检项 | 结论 | 依据 |
|---|---|---|
| 哪些数据不得保存、允许何种最小形态已明确 | 通过 | §8。 |
| 下游 / projection / cache / report / fake 不反写已明确 | 通过 | §6、§9.1。 |
| 每条红线有正式来源、TC、EV、report path、pass/fail和裁决影响 | 通过 | §6、§7；均为 planned/future。 |
| compile/runtime/event/ref/adapter/fake 分类未混写 | 通过 | §9.2。 |
| P1/P2 和 pending 未污染 P0 红线 | 通过 | §9.3、§10.2。 |
| VETO / risk / actual evidence未提前伪造 | 通过 | §3、§10.2、§11。 |
| 可进入 Step 7 | 通过 | 下一步只定义接口、事件与跨仓同步验收。 |

```text
step_06 = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_07
next_allowed_action = create_and_complete_step_07_interface_sync_gate
formal_06_write_allowed = false_until_step_15
actual_redline_evidence_generated = false
actual_veto_disposition_generated = false
```
