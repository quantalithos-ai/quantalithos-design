# L2-member-images 06 验收标准 Step 11：一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11  
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.11  
> 回填位置：正式 `06-验收标准.md` 第 11 章“一票否决项”  
> 方法粒度：参照 `L1-governance` 的“红线来源 → VETO → EV / report → 触发裁决 → 停审 → 跨项审计”闭环；不继承其治理对象、编号、外部结果或签署事实。  
> 文档模式：`full-restart`。本文定义验收裁决规则，不生成实际 VETO 结果、缺陷、报告、签署或 readiness。

## 1. Step 状态、输入与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 11：定义一票否决项。 |
| 输出文件 | `projects/L2-member-images/design-calibration/06_acceptance_step_11_veto.md`。 |
| 本步状态 | `completed_stop_review`；设计层的一票否决闭环已收稳，实际验收状态仍为 `absent / not_evaluable`。 |
| 进入依据 | Step 10 已完成同一 `<run_id>` 的 future artifact/report pair、EV index、redaction、dependency、report-audit 与 handoff 门禁设计。 |
| 主要输入 | 正式 `00-需求文档.md` §10~§14；`00_req_step_14_acceptance_criteria.md`；Step 6、8、9、10 中间产物；正式 `03` §9~§15；正式 `04` §8~§11；正式 `05` §9~§14。 |
| 格式参考 | `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md` 与 `projects/L1-governance/06-验收标准.md` §11，仅用于粒度、停审和矩阵格式。 |
| 正式文档 | 当前不修改正式 `06-验收标准.md`；正式文档只能在 Step 15 重建。 |
| 当前事实 | 没有实现仓、selected delivery、`run_id`、raw artifact、report、EV instance、digest、VETO checklist、defect、verdict、signoff 或 readiness。 |

### 1.1 本步目标与不做事项

本步把需求层已经确定的 `VETO-MI-001~007` 转成可审查、可回指、不可被风险接受覆盖的验收规则，并把 Step 10 的证据真实性、脱敏、依赖和配置硬门禁放到正确的过程边界。

本步不新增需求层 VETO 编号，不把普通缺陷、owner pending、未启用外围增强、无量化 baseline 或实际 run 缺失直接命名为 VETO；这些情况按 `blocked`、`absent`、`not_evaluable` 或后续缺陷/风险规则处理。若它们被伪报为 ready、passed 或 closed，则按实际越界行为触发相应 `VETO-MI-*`。

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 | 正式依据 |
|---|---|---|
| 哪些失败会直接导致不通过？ | 核心五节点无法形成可判断闭环；本地 fallback、`latest`、mutable 或猜测版本补齐；禁止 body / live state / secret 进入 truth 或 build input；未满足 authority / snapshot / builder / gate 条件却生成 digest、ref、eligibility、availability 或 handoff；历史被原地改写；相邻 owner truth、compile dependency、event output 或 readiness 被私造。 | `00` §10、§11、§12、§14；`AC-RED-MI-001~010`；`AC-STATE/ TX/ IDEM`。 |
| 否决项来自哪个需求或设计红线？ | `VETO-MI-001~007` 直接来自 `00` §14.7；其检查依据再回指 `G/ C/ BR/ D/ NG/ DEP/ NFR`、Step 6 红线、Step 8 状态/事务不变量、Step 9 非功能门禁和 Step 10 证据规则。 | `00_req_step_14_acceptance_criteria.md` §7.8；正式 `03`、`04`、`05`。 |
| 否决项如何检查？ | 未来实际验收必须使用同一 `<run_id>` 的 raw artifact/report pair、EV index、suite report、redaction/dependency/report-audit 和 `reports/acceptance/veto-checklist.md`；不能由静态表、口头确认、fake、日志或单独 local trace 代替。 | Step 10 `AC-EV-MI-001~010`；`05` §13。 |
| 否决项是否允许风险接受？ | 不允许。任一 VETO 实际命中时，最终结论不得为“通过”或“有条件通过”；不得由 `risk-acceptance.md`、残余风险、P1/P2、人工 pass 或 owner 口头确认覆盖。 | 验收标准书写规范 §4.2、§5.11、§5.13；`05` §11。 |
| 是否覆盖全部 P0 红线？ | 覆盖 `VETO-MI-001~007` 对应的核心闭环、static/live、owner、阶段、状态、历史、依赖、事件、配置和证据真实性红线；Step 10 的过程硬门禁另列，不新增需求 VETO。 | 本文 §8、§9。 |
| 每个 VETO 能否回指正式来源、EV 和 report path？ | 可以。每项都有需求/设计来源、规划 TC、规划 EV family、固定 future report path 和触发后的裁决；EV family 不是当前 evidence instance。 | 本文 §6、§7。 |
| 每个 VETO 完成后是否停审？ | 是。逐项确认来源正式、检查方式可执行、证据路径固定、风险接受禁用和当前实际状态未被伪造；见 §10。 | 验收 SOP Step 11；中间产物规范 §3.4。 |
| 是否存在 VETO 覆盖冲突或不可执行项？ | 未发现设计级冲突。允许一项事实同时命中多个 VETO；应保留全部命中关系，不得通过去重消除更严格裁决。实际检查仍受无 run、owner pending 和未闭合 blocker 限制。 | 本文 §11；`MI-UP-*`、`Q-MI-*` 与 `DDD/PF-*` 台账。 |

## 3. 当前材料诊断、改动前后与取舍

### 3.1 当前材料诊断

| 材料位置 | 发现的问题 | 本步修正 |
|---|---|---|
| historical 正式 `06` | 旧文档围绕旧对象、旧状态或泛化报告，不能作为当前 VETO authority。 | 只把它作为污染审计输入；所有当前 VETO 从正式 `00` 和 `03~05` 重新回指。 |
| 正式 `00` §14.7 | 已有七项 VETO，但还没有 future EV、report path、触发后裁决和停审记录。 | 固定 `VETO-MI-001~007` 的闭环矩阵和实际状态边界。 |
| Step 6 红线 | `AC-RED-MI-*` 只标记候选，部分红线可能被错误降为普通缺陷。 | 将核心越界行为映射到七项 VETO；保持未执行状态不变。 |
| Step 8/9 | 状态、UoW、配置和非功能失败已有 P0 影响，但未明确何时升级为 VETO。 | 按行为结果升级：伪闭环、越权 promotion、历史覆盖、fallback、owner/dependency 伪造进入对应 VETO。 |
| Step 10 证据 | 证据完整性、脱敏、依赖和 report audit 可能被误当作普通报告格式问题。 | 作为验收过程硬门禁；失败时不得作出通过/有条件通过，行为越界同时映射到正式 VETO。 |

### 3.2 关键取舍

| 议题 | 备选 | 本步结论 | 原因 |
|---|---|---|---|
| 是否新增第八项及以后编号覆盖证据完整性 | 新增需求编号 / 作为过程硬门禁 | 采用后者 | 不改写已停审的 `00` 编号；证据失败本身阻断裁决，若伴随伪造/越界则回指 `VETO-MI-001/007` 或其他适用项。 |
| owner pending 是否直接算 VETO | 是 / 保持 blocked | 保持 blocked | 未闭合的正向 seam 不是 observed violation；只有把 pending 写成 ready/confirmed 才触发 VETO。 |
| 缺 run、缺 artifact/report pair 是否直接算 VETO | 是 / `absent` 或 `not_evaluable` | 采用后者 | 当前没有授权执行；不能把设计阶段的缺失伪造成系统行为，但实际验收不得因此通过。 |
| P1/P2 或性能 sample 未完成是否 VETO | 是 / 保持 residual | 保持 residual | 需求明确排除“未启用/无 baseline”本身；将其写成 P0 pass 才是越界。 |
| 多个 VETO 同时命中如何处理 | 只保留一个主项 / 全部保留 | 全部保留 | 同一事件可能同时破坏数据归属、阶段隔离和依赖边界；跨项审计需要完整因果链。 |

## 4. 一票否决的总裁决规则

1. `VETO-MI-001~007` 是正式需求层一票否决项；任一项在实际验收中命中，最终结论只能是“不通过”或在证据不可裁决时“暂停/不通过”，不得是“通过”或“有条件通过”。
2. VETO 必须由正式需求/架构/详细设计红线支持，并在未来 `reports/acceptance/veto-checklist.md` 中逐项引用真实 EV、report 和 defect disposition；不得默认全部 passed。
3. VETO 不得被风险接受、P1/P2 residual、selected-run unavailable、fake/adapter 成功、local `Assembled` / `Available`、external ACK、口头确认或重跑后的新报告覆盖。原始 failed/blocked/unknown/absent 状态必须保留。
4. `blocked` 是设计或 owner 条件未闭合；`absent` 是没有实际 run / artifact / report；`not_evaluable` 是 selected actual acceptance 缺少裁决所需输入；三者都不能写成 VETO passed，也不能伪装成 observed failure。
5. 若检查本身因缺少 baseline、raw artifact、report pair、owner oracle 或 scope 而无法执行，相关 P0 gate 为 `not_evaluable` / `failed`，总体不得通过；这不等于当前已经观察到 VETO 行为。
6. 一项 VETO 触发可同时生成 S 级缺陷方向；后续缺陷 Step 负责分级和复验，但不得把 VETO 降成可接受的 A/B/R 风险。

## 5. 结构化中间产物：一票否决项表

| 否决项 ID | 否决项 | 直接原因 | 主要检查切口 |
|---|---|---|---|
| `VETO-MI-001` | `C-MI-1~5` 任一核心节点没有可判断结果，却把镜像资产供给链或正式需求判定为完成。 | 破坏五节点逻辑前置和本仓唯一 truth 闭环。 | `TC-CMD-001~010`、`TC-JOB-001~006`、`TC-STATE-001~019`、`TC-SEC-002`、`TC-DEP-001`；EV-UNIT/SVC/ENTRY/INT/GATE。 |
| `VETO-MI-002` | 以本地 Role 枚举、hardcode / fallback、`latest` / mutable ref 或猜测版本补齐 mapping、assembly 或 production entry。 | 形成第二 mapping truth，破坏 pin 和可复现装配。 | `TC-CMD-001~003/008`、`TC-QUERY-001/003/005`、`TC-CONFIG-001~003`、`TC-SEC-002`；EV-UNIT/CONFIG/SEC/SVC。 |
| `VETO-MI-003` | Secret、live memory、checkpoint、workspace live content 或外部 semantic / evidence / Artifact / container / observed body 进入领域 truth 或构建输入。 | 破坏四类数据归属和 static/live、body-free 安全红线。 | `TC-CMD-002/005~007`、`TC-QUERY-008`、`TC-CONFIG-001/004`、`TC-SEC-001`、`TC-OBS-001`；EV-CONFIG/SEC/OBS/GATE。 |
| `VETO-MI-004` | Intent 无 authority、输入不完整、builder / registry 结果未确认或结果为 failed / blocked / unknown 时，生成或宣称 candidate digest / ref。 | 把交接、缓存、ACK 或不确定结果伪装成构建候选。 | `TC-CMD-004~005`、`TC-JOB-001~002/004`、`TC-STATE-004~006`、`TC-CON-004~005`；EV-UNIT/SVC/INT/REC。 |
| `VETO-MI-005` | Provenance 不完整、正式适用 gate 缺失 / 失败 / unknown 或 Artifact handoff 未成立时，绕过分层并宣称 positive eligibility / formal ref。 | 把 evidence、policy、Artifact owner 的缺口伪装成资格或正式引用。 | `TC-CMD-006~007`、`TC-JOB-003/006`、`TC-STATE-006~007`、`TC-SEC-001~002`；EV-UNIT/INT/SEC/GATE。 |
| `VETO-MI-006` | 将不合格 / 不可验证版本进入 availability，原地改写 publish / rollback / retire 历史，或把 local supply 等同通知、下游确认、容器启动 / 健康。 | 破坏 supply、history、Artifact、consumer 和 container 的阶段隔离。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-008~010`、`TC-CON-005`；EV-UNIT/SVC/ENTRY/INT/GATE。 |
| `VETO-MI-007` | 复制或改写相邻 owner truth，私造 compile dependency / event output / exact schema，或把 pending、adapter / fake 结果写成 integration readiness、测试 / 验收通过事实。 | 破坏 owner、依赖裁剪、事件库存和 evidence/readiness 边界。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-CONFIG-003~005`、`TC-SEC-001~002`、`TC-STATE-013~019`；EV-GATE/ENTRY/CONFIG/SEC/OBS。 |

以下情形本身不是 VETO：外围增强未启用；`Q-MI-001/002` 尚未裁定；`Q-MI-003` 产品未选；性能或容量 baseline 尚不存在；`MI-UP-*` 正向合同尚未闭合而只能返回 gap；或当前没有获得执行授权。它们必须保持 `pending / future / blocked / absent`，但不能支撑 positive readiness。

## 6. VETO 闭环矩阵：正式来源、证据与裁决

下表中的 EV、TC 和路径都是 future planned contract。只有同一 `<run_id>` 的 raw artifact、report、EV instance 和审查关系同时存在时，才可在实际验收中填写结果；当前全部为规划方向。

| 否决项 ID | 正式红线来源 | 规划 TC | 规划 EV family | 固定 future report path | 触发后的总体裁决 |
|---|---|---|---|---|---|
| `VETO-MI-001` | `00` `G-MI-001~007`、`C-MI-1~5`、`AC-MI-026`；`03` §9~§12 的阶段/状态/UoW；Step 5 `AC-FUNC-001~006`。 | `TC-CMD-001~010`、`TC-JOB-001~006`、`TC-STATE-001~019`、`TC-CON-003~005`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-boundary-no-write.md`；`.../ci-entry-contracts.md`；`.../ci-integration-seams.md`；`.../gate-results.md`。 | 命中即不通过；若仅缺 evidence/baseline，则为不可裁决，不得写通过。 |
| `VETO-MI-002` | `00` `BR-MI-001/002/006/008/021`、`NFR-MI-019`；Step 6 `AC-RED-MI-002/008`；`03` §9、§13；`04` strict pin/profile 规则。 | `TC-CMD-001~003/008`、`TC-QUERY-001/003/005`、`TC-CONFIG-001~003`、`TC-SEC-002`。 | `EV-UNIT-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-SVC-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-config-security.md`；`.../pr-boundary-no-write.md`；`.../redaction-check.md`。 | fallback、mutable/`latest` 或猜测补齐一旦被实际观察，立即不通过且不得风险接受。 |
| `VETO-MI-003` | `00` `BR-MI-004/007/010/020/023`、`D-MI-005/011/012/018/025/030`；Step 6 `AC-RED-MI-003`；`03` §13~§14；`04` §8、§11。 | `TC-CMD-002/005~007`、`TC-QUERY-008`、`TC-CONFIG-001/004`、`TC-SEC-001`、`TC-OBS-001`。 | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/redaction-check.md`；`reports/runs/<run_id>/suites/pr-config-security.md`；`.../ci-dependency-redaction.md`；`.../report-audit.md`。 | 任一 forbidden body/secret/live state 进入 truth、input、artifact 或 report，立即不通过；不可用 hash、加密或说明免责。 |
| `VETO-MI-004` | `00` `BR-MI-011~015`、`NFR-MI-007~009`；Step 6 `AC-RED-MI-004`；Step 8 `AC-STATE-MI-002`、`AC-TX-MI-007`；`03` §7~§12。 | `TC-CMD-004~005`、`TC-JOB-001~002/004`、`TC-STATE-004~006`、`TC-CON-004~005`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-INT-001`、`EV-REC-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-boundary-no-write.md`；`.../ci-integration-seams.md`；`.../nightly-risk.md`。 | failed/blocked/unknown 或无 authority 时仍产生 candidate/digest/ref，立即不通过；未闭合 lane 本身只保持 blocked。 |
| `VETO-MI-005` | `00` `BR-MI-016~020`、`NFR-MI-010~012`；Step 6 `AC-RED-MI-004/008`；Step 8 `AC-STATE-MI-003`、`AC-TX-MI-007`；`03` §9~§14。 | `TC-CMD-006~007`、`TC-JOB-003/006`、`TC-STATE-006~007`、`TC-SEC-001~002`。 | `EV-UNIT-001`、`EV-INT-001`、`EV-SEC-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../ci-integration-seams.md`；`.../redaction-check.md`；`.../gate-results.md`。 | provenance/gate/Artifact 层级被绕过或伪造 positive eligibility/ref，立即不通过；不能由 Artifact/治理 owner 缺口风险接受。 |
| `VETO-MI-006` | `00` `BR-MI-021~025`、`NFR-MI-014~016`；Step 6 `AC-RED-MI-005/007/008`；Step 8 `AC-STATE-MI-004`、`AC-TX-MI-004/007`；`03` §9~§12。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-008~010`、`TC-CON-005`。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`.../pr-boundary-no-write.md`；`.../ci-entry-contracts.md`；`.../ci-integration-seams.md`；`.../gate-results.md`。 | 不合格版本进入 availability、历史被覆盖或 local supply 被写成外部成功，立即不通过；不可降为普通可用性缺陷。 |
| `VETO-MI-007` | `00` `NG-MI-001~015`、`DEP-MI-001~016`、`MI-UP-001~009`；Step 6 `AC-RED-MI-001/002/009/010`；Step 7 `AC-SYNC-MI-030`；Step 9 `AC-NFR-MI-007`。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-CONFIG-003~005`、`TC-SEC-001~002`、`TC-STATE-013~019`。 | `EV-GATE-001`、`EV-ENTRY-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`。 | `reports/runs/<run_id>/dependency-boundary.md`；`reports/runs/<run_id>/gate-results.md`；`reports/runs/<run_id>/redaction-check.md`；`reports/runs/<run_id>/report-audit.md`；`reports/runs/<run_id>/suites/ci-entry-contracts.md`。 | sibling compile/path dependency、私造 event/output/schema、owner truth 复制或 pending/fake readiness 一旦被观察，立即不通过。 |

## 7. 证据完整性、脱敏、依赖与配置 fail-closed 的过程边界

这些是验收过程硬门禁，不是新增第八项及以后的一组需求 VETO。过程门禁失败时总体不能通过；如果实际行为同时违反需求/设计红线，则在 `veto-checklist.md` 中回指适用的 `VETO-MI-001~007`。

| 过程硬门禁 | 正式来源 / planned EV | 通过条件 | 失败或缺失的裁决 | 与 VETO 的关系 |
|---|---|---|---|---|
| evidence integrity / anti-static | Step 10 `AC-EV-MI-003/004/005/008/010`；EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE；`reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`report-audit.md`。 | 每个 selected P0 EV 都能回指同 run 的 case、raw artifact、suite report、AC/VETO direction 和 generated/review relation；failed/blocked/absent 保留。 | 缺 pair、跨 run、orphan、手写/default pass、overwrite 或 report/raw 不一致时，P0 不可裁决/不通过；不可由风险接受覆盖。 | 伪造闭环或伪报通过时通常进入 `VETO-MI-001/007`；单纯尚未执行保持 `absent`。 |
| redaction / static-live | Step 10 `AC-EV-MI-006`；Step 6 `AC-RED-MI-003`；EV-SEC/CONFIG/OBS；`redaction-check.md`。 | artifact、report、EV index、acceptance draft 均无 secret、credential、endpoint、外部正文、live state、provider body 和 forbidden sentinel。 | leak、scan 漏范围或缺 scan 时相关 P0 gate failed；不能用 hash、加密、手工说明或新报告遮蔽。 | 实际泄露或 body promotion 触发 `VETO-MI-003`；借脱敏缺口伪造 ready 可并触发 `VETO-MI-007`。 |
| dependency / zero outbound | Step 10 `AC-EV-MI-007`；Step 6 `AC-RED-MI-009`；Step 9 `AC-NFR-MI-007`；EV-GATE/ENTRY；`dependency-boundary.md`、`gate-results.md`。 | active sibling compile dependency 为零；六类 seam 不漂移；inbound marker-only；`ImageOutboundEventInventory::NoneAuthorized` 保持零。 | unauthorized compile/path edge、shadow schema、outbox/publisher/topic/delivery 或 inbound receipt/acceptance 使 P0 failed；无 raw graph 时不可声称通过。 | 实际依赖/事件/owner 越界触发 `VETO-MI-007`。 |
| config fail-closed | 正式 `04` §8~§11；Step 9 `AC-NFR-MI-006`；EV-CONFIG/SEC/OBS；`pr-config-security.md`、`redaction-check.md`。 | strict JSON、source priority、ref/sensitive/cross-field/profile 校验完整；required slot 失败为 `Blocked`；TestOnly fake 仅 `ci-test`；startup-only，无 silent fallback、partial facade、LKG/reload。 | silent fallback、partial apply/facade、Production fake、raw output、`Assembled` 升格业务 readiness 或 invalid P0 profile 标为 passed，相关 P0 failed；不许人工覆盖。 | fallback/mutable/promotion 可触发 `VETO-MI-002`；伪 candidate/eligibility/ref 可触发 `VETO-MI-004/005`；fake/readiness/owner 伪造可触发 `VETO-MI-007`。 |
| baseline / actual run presence | Step 3~4、Step 10 `AC-EV-MI-002/009`。 | future selected actual run 有固定 delivery/profile/config/fixture、`run_id`、raw/report pair 和 reviewed handoff。 | 当前没有 run 是 `absent`；future selected acceptance 缺基线或 handoff 为 `not_evaluable` / 不通过，不是 VETO 已命中。 | 将 absent 写为 pass 或伪造 run/ref 才可能触发 `VETO-MI-001/007`。 |
| owner / sibling positive lane | `MI-UP-001~009`、`Q-MI-001~004`；Step 10 `AC-EV-MI-005/010`。 | 未闭合 lane 保持 `blocked / gap / unknown / unavailable`；不进入 P0 pass 分母。 | positive oracle 缺失时不可裁决；不得把 blocked 当 failed，也不得把 fake/adapter marker 当确认。 | 只有把 pending 写成 ready、confirmed、digest、test pass 或 acceptance fact，才触发 `VETO-MI-007` 或适用 VETO。 |

## 8. VETO 与 P0 红线覆盖矩阵

| VETO | 覆盖的 P0 红线 / gate | 关联状态、事务与接口门禁 | 未覆盖且明确排除的事项 |
|---|---|---|---|
| `VETO-MI-001` | `AC-RED-MI-001/006/007/008/010`；`AC-FUNC-001~006`。 | `AC-STATE-MI-001~007`、`AC-TX-MI-001~006`、`AC-IDEM-MI-001~006`；10 Command、10 Query、6 Job 全链分母。 | 单纯性能 sample 缺失、外围未启用和 owner pending 本身。 |
| `VETO-MI-002` | `AC-RED-MI-002/003/008`；`AC-NFR-MI-004/006`。 | Definition/Baseline/Revision、entry resolve、strict config/profile、pin/no-`latest`。 | 合法 ref 当前不可验证但仍明确返回 blocked/gap 的情况。 |
| `VETO-MI-003` | `AC-RED-MI-002/003`；`AC-NFR-MI-003/008`；`AC-EV-MI-006`。 | static/live、forbidden body、config output、trace/log/metric/report/artifact redaction。 | 不含敏感材料的普通可读性或低风险文案问题。 |
| `VETO-MI-004` | `AC-RED-MI-004/008`；`AC-NFR-MI-002/005`。 | BuildIntent/Snapshot/Attempt/Candidate、unknown/manual recovery、Command/Job zero-effect。 | builder/registry 尚未提供 positive oracle而本仓明确保持 blocked。 |
| `VETO-MI-005` | `AC-RED-MI-004/008`；`AC-NFR-MI-003/004/007`。 | Provenance/Gate/Eligibility/Artifact 分层、applicable gate、evidence ref、handoff gap。 | `Q-MI-004` 未裁定且未被写为 gate pass 的状态。 |
| `VETO-MI-006` | `AC-RED-MI-005/007/008`；`AC-NFR-MI-004/005`。 | AvailabilityTransition、Entry、ConsumerHandoffGap、history append-only、Query/Job no-write。 | local availability 正确保持独立但 consumer contract 尚未闭合。 |
| `VETO-MI-007` | `AC-RED-MI-001/002/004/005/006/008/009/010`；`AC-SYNC-MI-030`；`AC-NFR-MI-007~009`；`AC-EV-MI-003/005/007/008/010`。 | owner/data boundary、compile/runtime/event/ref/adapter/fake、marker-only inbound、zero outbound、evidence/readiness separation。 | 正常的 future adapter/fake seam，只要没有被宣称为 external success 或 readiness。 |

覆盖审计结论：`AC-RED-MI-001~010` 全部至少由一个 VETO 覆盖；核心 `AC-FUNC`、`AC-SYNC`、`AC-STATE`、`AC-TX`、`AC-IDEM`、`AC-NFR` 与 `AC-EV` 均有至少一个 VETO 或过程硬门禁回指。P1/P2、性能 residual、owner pending 未被错误提升为 VETO。

## 9. 一票否决项逐项停审记录

本表的“通过”只表示 Step 11 的设计闭环通过，不是 future actual VETO result。当前实际证据全部为 `absent`，未填写任何 VETO passed/failed 实例。

| VETO | 正式来源已确认 | 检查方式可执行 | EV / report path 已固定 | 风险接受已禁止 | 当前实际状态 | Step 设计结论 |
|---|---|---|---|---|---|---|
| `VETO-MI-001` | 是：`G/C/AC-FUNC/AC-STATE`。 | 是：核心链、state、UoW、no-write、跨阶段 negative。 | 是：EV-UNIT/SVC/ENTRY/INT/GATE 与同 run suite reports。 | 是 | `absent`；无 run/instance。 | `pass_with_explicit_blockers` |
| `VETO-MI-002` | 是：`BR-MI-001/002/006/008/021`、`NFR-MI-019`。 | 是：mapping/pin/latest/fallback/config/entry negative。 | 是：EV-UNIT/CONFIG/SEC/SVC、`redaction-check.md`。 | 是 | `absent`；无 static scan result。 | `pass_with_explicit_blockers` |
| `VETO-MI-003` | 是：`BR/D/AC-RED-MI-003/NFR-MI-003`。 | 是：forbidden sentinel、static/live、output scan。 | 是：EV-CONFIG/SEC/OBS/GATE、`redaction-check.md`。 | 是 | `absent`；未执行脱敏扫描。 | `pass_with_explicit_blockers` |
| `VETO-MI-004` | 是：`BR-MI-011~015`、`AC-RED-MI-004`、`AC-STATE-MI-002`。 | 是：authority/input/outcome/unknown/candidate negative。 | 是：EV-UNIT/SVC/INT/REC、build/attempt suite reports。 | 是 | `absent`；B01/B02 和 owner blocker 未解除。 | `pass_with_explicit_blockers` |
| `VETO-MI-005` | 是：`BR-MI-016~020`、`AC-RED-MI-004/008`、`AC-STATE-MI-003`。 | 是：provenance/gate/eligibility/Artifact 分层 negative。 | 是：EV-UNIT/INT/SEC/GATE、`gate-results.md`。 | 是 | `absent`；policy/Artifact oracle 未闭合。 | `pass_with_explicit_blockers` |
| `VETO-MI-006` | 是：`BR-MI-021~025`、`AC-RED-MI-005/007/008`、`AC-STATE-MI-004`。 | 是：availability/history/entry/consumer separation negative。 | 是：EV-UNIT/SVC/ENTRY/INT/GATE、supply suite reports。 | 是 | `absent`；B03 与 consumer seam 未解除。 | `pass_with_explicit_blockers` |
| `VETO-MI-007` | 是：`NG/DEP/MI-UP`、`AC-RED-MI-009/010`、`AC-SYNC-MI-030`。 | 是：dependency graph、event inventory、fake/readiness/report audit。 | 是：EV-GATE/ENTRY/CONFIG/SEC/OBS、dependency/redaction/report audit。 | 是 | `absent`；无实际 graph/audit，owner seam pending。 | `pass_with_explicit_blockers` |

## 10. 跨 VETO 覆盖审计

| 审计项 | 结论 | 说明 / 保持边界 |
|---|---|---|
| P0 红线是否有遗漏？ | `pass` | `AC-RED-MI-001~010`、核心功能/接口/状态/事务/幂等/非功能 gate 均已回指；证据真实性由过程硬门禁补齐。 |
| 是否存在 VETO 重复？ | `可接受` | `VETO-MI-003/007` 都可能涉及 body 或 owner 边界，`VETO-MI-004/005` 都可能涉及 adapter outcome；重叠反映同一越界事实的多个后果，不删除任一命中。 |
| 是否把普通缺陷设为 VETO？ | `未发现` | 文案、报告可读性、P1 unavailable、无量化 baseline 和外围未启用不单独成为 VETO。 |
| 是否把 pending 当作 VETO？ | `未发现` | `MI-UP-*`、`Q-MI-*`、`DDD-*`、`PF-*` 保持 pending/blocked；只有伪报 closed/ready 才触发。 |
| VETO 与风险接受是否冲突？ | `未发现` | 七项均明确禁止 risk acceptance、人工 pass 和 P1/P2 覆盖；Step 13 只能处理合资格 residual。 |
| 证据缺失是否被误写成 passed？ | `未发现` | Step 10 的 `absent`、`blocked`、`not_evaluable` 语义继续保留；当前无实际 EV instance。 |
| 检查方式是否可复核？ | `pass_with_explicit_blockers` | 规划 TC/EV/path 已固定；真实可执行性仍依赖 future implementation、run、owner oracle 和 Step 3/4 baseline。 |
| 是否把 fake/adapter/local composition 当外部成功？ | `未发现` | `Assembled`、slot `Available`、ACK、marker、fake、local trace 均不能替代 builder/gate/Artifact/consumer truth。 |
| 是否把过程硬门禁误命名为新 VETO？ | `未发现` | evidence/redaction/dependency/config 作为 P0 process hard gate；行为越界回指七项正式 VETO。 |

跨 VETO 审计结论：七项 VETO 可共同覆盖核心 truth、阶段、owner、依赖和证据边界；不存在将 P1/P2 residual 提升为否决项或允许风险接受绕过硬门禁的路径。当前仍没有实际 VETO 结论。

## 11. 正式 `06-验收标准.md` §11 回填草稿（禁止当前装配）

只有 Step 1~14 完成且 Step 15 获准时，才可将以下口径写入正式文档：

```md
## 11. 一票否决项

> 校准来源：
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读：
> - 建议继续阅读该中间产物的“一票否决项表”“VETO 闭环矩阵”“过程硬门禁边界”“逐项停审记录”和“跨 VETO 覆盖审计”小节。

一票否决项固定为 `VETO-MI-001~007`，分别对应正式需求 `00` §14.7 的七条红线。每项必须在未来 `reports/acceptance/veto-checklist.md` 中引用同一 `<run_id>` 的真实 EV、report 和 defect disposition；不得默认全部 passed。

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| `VETO-MI-001` | 五节点核心闭环任一节点不可判断却宣称完成。 | 破坏镜像资产供给 truth 链。 | EV-UNIT/SVC/ENTRY/INT/GATE；`reports/runs/<run_id>/...`。 |
| `VETO-MI-002` | 本地枚举、hardcode/fallback、`latest`/mutable/猜测版本补齐 mapping、装配或入口。 | 破坏唯一 source、pin 和可复现性。 | EV-UNIT/CONFIG/SEC/SVC；`reports/runs/<run_id>/redaction-check.md`。 |
| `VETO-MI-003` | Secret、live state 或外部正文进入 truth 或 build input。 | 破坏数据归属和 static/live 安全边界。 | EV-CONFIG/SEC/OBS/GATE；`reports/runs/<run_id>/redaction-check.md`。 |
| `VETO-MI-004` | 无 authority、输入不完整或 builder 结果失败/阻塞/未知时生成 candidate digest/ref。 | 伪造构建候选。 | EV-UNIT/SVC/INT/REC；对应 suite report。 |
| `VETO-MI-005` | provenance、适用 gate 或 Artifact handoff 不完整时宣称 eligibility/formal ref。 | 绕过资格和 Artifact owner 分层。 | EV-UNIT/INT/SEC/GATE；`gate-results.md`。 |
| `VETO-MI-006` | 不合格版本进入 availability、历史原地改写或 local supply 冒充外部成功。 | 破坏 supply/history/consumer 阶段隔离。 | EV-UNIT/SVC/ENTRY/INT/GATE；对应 suite report。 |
| `VETO-MI-007` | 复制 owner truth、私造 compile/event/schema，或把 pending/fake/adapter 写成 readiness/通过事实。 | 破坏 owner、依赖和证据边界。 | EV-GATE/ENTRY/CONFIG/SEC/OBS；dependency/redaction/report audit。 |

任一 VETO 命中时总体结论必须为“不通过”；VETO 不得被风险接受、残余风险、P1/P2 unavailable、人工确认或新 run 覆盖。evidence integrity、redaction、dependency、report-audit 和 P0 config fail-closed 是验收过程硬门禁，失败时不得作出通过或有条件通过结论；若同时存在需求/设计越界，按适用 `VETO-MI-*` 记录。
```

## 12. Blocker、待确认与当前实际状态

| blocker / 待确认项 | 影响的 VETO | 当前处理与重开条件 |
|---|---|---|
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 主要影响 `VETO-MI-001/004/005/006` 的 positive/replay/recovery lane。 | 当前只保留 zero-effect、no-write、blocked、unknown 和历史不可覆盖规则；正式关闭后重开对应 03/05/06 Step。 |
| `MI-UP-001~009` | 主要影响 `VETO-MI-001/004/005/006/007` 的 consumer、Artifact、event、component、mapping 和 owner positive lane。 | 不生成 manifest、confirmation、Artifact accepted、event output、digest 或 readiness；owner 合同正式闭合后重开受影响 lane。 |
| `Q-MI-001~004` | 影响增强范围、多架构、产品 adapter 和证据种类。 | 保持 P1/P2/future；不得进入 P0 VETO pass 分母；若被写成已闭合则按越界行为处理。 |
| actual selected delivery/profile/config/fixture/`run_id` | 影响全部 future actual VETO 检查。 | 当前 `absent`；Step 3/4 基线和 future 执行授权完成前不生成 checklist/result。 |
| actual raw artifact/report/EV instance | 影响全部 VETO 的可裁决性。 | 当前 `absent`；不得使用 planned table、historical report、stdout、fake、log、metric 或 local trace 冒充。 |
| VETO checklist / risk acceptance / signoff owner | 影响后续报告与最终结论。 | 本 Step 只固定语义；`veto-checklist.md` 的实际填写留 future run，risk/signoff 分别留 Step 13/14。 |

当前事实声明：本 Step 没有观察到任何 VETO 命中，也没有任何 VETO 通过；因为尚未执行实际验收，七项 VETO 的 actual status 均为 `absent / not_evaluable`。这不是系统通过、失败或 readiness。

## 13. 自检与进入 Step 12 的条件

### 13.1 自检清单

- [x] `VETO-MI-001~007` 均直接回指正式 `00` §14.7，并补充了架构、详细设计、配置和测试依据。
- [x] 每个 VETO 均有 planned TC、EV family、固定 future report path、触发后的总体裁决和风险接受禁用规则。
- [x] evidence integrity、redaction、dependency/zero-outbound、config fail-closed 已明确为过程硬门禁，不新增需求 VETO 编号。
- [x] `AC-RED-MI-001~010`、核心功能/接口/状态/事务/幂等/非功能 gate 均在 VETO 或过程门禁覆盖矩阵中有落点。
- [x] 允许多项 VETO 同时命中；未把普通 defect、P1/P2、外围未启用、性能 baseline 缺失或 owner pending 本身设为 VETO。
- [x] 保留 `planned`、`blocked`、`absent`、`not_evaluable` 与 future `failed` 的状态区别；未生成实际 VETO、EV、report、run、digest、verdict、signoff 或 readiness。
- [x] Step 11 停审时未修改正式 `06-验收标准.md`，也未创建 Step 12、实现材料或测试产物；随后用户确认后才创建并完成 Step 12。

### 13.2 Step 门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| 七项 VETO 清楚且来源正式 | `pass` | 见 §5、§6。 |
| 每项 VETO 可检查、可回指 EV/report | `pass_with_explicit_blockers` | 规划路径已固定；实际执行依赖 future run 和 owner oracle。 |
| VETO 不可被风险接受覆盖 | `pass` | 见 §4、§7。 |
| P0 红线覆盖无 unresolved 设计冲突 | `pass` | 见 §8、§10；允许合法重叠，不存在漏项。 |
| 当前 actual VETO 是否存在 | `absent` | 无 run、artifact、report、EV instance；不得推导通过或失败。 |
| 可进入 Step 12 | `passed_for_step_12` | Step 11 完成时曾等待用户确认；本次用户“继续”已解除门禁，Step 12 已单独创建并完成停审。 |

```text
step_11_status = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = passed_for_step_12
veto_ids = VETO-MI-001..007
process_hard_gates = evidence_integrity, redaction, dependency_zero_outbound, config_fail_closed
actual_veto_result = absent
actual_evidence_generated = false
formal_06_write_allowed = false_until_step_15
step_12_creation_allowed = completed_after_user_confirmation
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
