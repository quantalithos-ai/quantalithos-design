# L2-member-images 06 验收标准 Step 2：明确验收目标与范围

> 创建日期：2026-09-03  
> 当前状态：`completed_stop_review`  
> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2  
> 回填位置：正式 `06-验收标准.md` 第 2 章“验收目标与范围”  
> 执行模式：`full-restart`；本 Step 只冻结裁决范围，不填写真实送验结果。

## 1. Step 状态与执行纪律

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2：明确验收目标与范围 |
| 当前模块 | `scope_and_priority_boundary` |
| 本步目标 | 把正式 `00~05` 的五个能力节点、P0/P1/P2 层级和跨仓接缝转为可裁决的验收范围。 |
| 本步输入 | Step 1 输入边界；正式 `00-需求文档.md` §4、§6、§7、§9、§10、§11、§12、§13、§14；`01-架构设计.md` §4~§12；`02-概要设计.md` §2~§12；`03-详细设计.md` §5~§16；`04-配置设计.md` §2~§14；`05-测试方案.md` §2~§5、§10、§14；验收标准 SOP/书写规范；L1-governance Step 2 仅作粒度参考。 |
| 本步输出 | 验收目标、In Scope/Out of Scope 表、P0/P1/P2 口径、只验接缝表、VETO 候选映射、正式 §2 回填草稿。 |
| gate_status | `pass_with_explicit_blockers`：范围可裁决，但受 `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 影响的正向 lane 只能保持 blocked/pending。 |
| next_allowed_action | 已授权进入 Step 3；固定需求/设计/测试/交付/环境/数据基线。 |
| 禁止事项 | 不固定 delivery ref、`run_id`、digest、artifact/report 实例、verdict、signoff；不把 sibling 或 upstream pending 写成已闭合合同。 |

## 2. 本步目标

本轮验收的对象是“成员镜像静态资产与构建产物供给层是否遵守已闭合的本地契约，并能在外部合同未闭合时给出保守、可追溯的边界结果”。验收不把镜像域局部状态拼成成员运行时或全局 readiness。

本轮必须裁决：

1. 五个 capability 节点（`C-MI-1`~`C-MI-5`）的进入前置、阶段隔离和失败上限。
2. `10 Command + 10 Query + 2 conditional inbound + 6 Operations Job + 0 outbound` 的逻辑协议边界。
3. static/template/seed/build-input 与 live memory、checkpoint、workspace、container/observed state 的隔离。
4. typed ref、owner、pin、provenance、eligibility、availability、handoff gap、状态和 no-write 约束。
5. 配置、redaction、依赖分类、证据真实性、缺陷与风险接受对最终结论的影响。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 | 依据 |
|---|---|---|
| 本轮验收的核心裁决目标是什么？ | 裁决本仓是否只形成自身拥有的镜像定义、静态装配、构建阶段、资格分层和本地供给入口事实；所有外部 owner 结果在未闭合时均保持 ref/gap/blocked/unavailable。 | `00` §2、§7；`01` §4~§6；`02` §2~§5。 |
| P0/P1/P2 如何划分？ | P0 是可由当前正式契约与 planned test seam 判断的本地边界、状态、协议、配置和证据真实性；P1 是 owner-closed 或 real-like adapter 的选定接缝；P2 是未有 scope/product/baseline 的外围和生产运维能力。 | `05` §2、§4、§10、§14；`00` §4.3、§15。 |
| 哪些下游能力只验接缝？ | `L2-member`、`L2-member-service`、`L2-runtime`、`L2-tools`、`L3-method-library`、`L1-artifact`、`L4-sandbox`、Bus/Core、builder/registry/evidence provider 均只验 typed ref、safe conclusion、marker、gap、adapter failure mapping 或 zero inventory；不验其内部 truth。 | `01` §5、§8~§12；`03` §13、§17。 |
| 哪些非范围会影响最终结论？ | 非范围本身不进入 P0 分母；但若被写成已完成、被 fake/ACK 伪造为 positive，或未在 residual/risk acceptance 中记录，就会触发证据/边界失败。 | `00` §14.7；`05` §10、§14。 |
| 哪些范围项可能成为一票否决？ | 核心节点缺结果却宣称完成、fallback/latest/猜测版本、外部 body/live state 入仓、无 authority 生成 candidate/eligibility/Artifact/consumer result、不合格版本供给、复制 owner truth/私造依赖或 outbound。 | `00` §14.7 `VETO-MI-001~007`；`01` §4.3。 |
| 哪些范围必须使用详细设计正式名？ | 所有 Command/Query/Inbound/Job 名称、`ImageOutboundEventInventory::NoneAuthorized`、19 个状态矩阵及正式 enum、`Unavailable`/`Blocked`/`Unknown`/`Gap`/`ConsumerHandoffGap`、`accepted_input=false`、`Assembled`/`Fresh`/`Available` 的 local 语义。 | `03` §7~§9、§13~§15；`05` §3、§6。 |

## 4. 当前材料问题诊断

| 材料 | 问题 | 本 Step 处置 |
|---|---|---|
| 历史 `06-验收标准.md` | 以 `MemberImage`、persona/toolset/seed bundle、publish/instantiate 成功为主线，混入容器启动、泛化 API/DB 证据和无来源数值阈值。 | 不继承；Step 15 先删除再按当前五节点与 15 章主链重建。 |
| 正式 `00` | AC-MI-001~030 是需求方向，不是执行结果；外围增强与核心节点分开。 | 用作范围和来源映射，不写成已通过。 |
| 正式 `03` | 28 条 logical surface 存在，但 10 Command/6 Job 受 B01/B02，inbound 受 MI-UP-005，outbound 为零。 | P0 仍验边界和负向 oracle；positive lane 标记 blocked。 |
| 正式 `05` | TC/EV、suite、路径是 planned evidence contract，没有 run。 | 只纳入将来可裁决的证据入口，不纳入当前事实。 |
| sibling / upstream | `L2-member`、`L2-member-service` 与 Artifact/event/policy 合同仍在 pending。 | 只列 seam/gap 与重开触发，不扩张范围。 |

## 5. 改动前后对比

| 项 | 历史口径 | 本 Step 后口径 | 理由 |
|---|---|---|---|
| 核心对象 | persona/toolset/seed/instantiate bundle | definition → static baseline/revision → build stages → qualification → local supply/entry | 与正式 00~03 的 capability 和 owner 对齐。 |
| P0 分母 | “全部功能可用”及真实容器/registry | 可验证的本地契约、负向边界、状态隔离、配置和证据完整性 | 防止把外部未闭合能力算为 pass。 |
| 跨仓验收 | 隐含为 E2E 成功 | 按 `compile/runtime/event/ref/adapter/fake` 分别验 seam | 依赖裁剪规则要求消费关系不自动变源码依赖。 |
| 外围增强 | 多架构、hardened base、快速重建混入主线 | P2/future，必须重开范围后才进入分母 | `Q-MI-001/002`、`MI-UP-008` 未闭合。 |
| 结果语义 | `published`/`ready` 等泛化词 | 正式 local enum 与保守 disposition；无 global ready | 防止 staged local state 升格。 |

## 6. 验收裁决取舍

| 议题 | 备选方案 | 结论 | 原因 |
|---|---|---|---|
| 是否按五 capability 节点组织范围 | A. 沿用旧资产类型分组；B. 按 `C-MI-1~5` 与横切契约组织 | 采用 B | 能表达前置、阶段隔离和 owner 关系。 |
| P1 real-like 是否作为 P0 前置 | A. 是；B. 否 | 采用 B | 当前无产品/环境 authority，P1 不得替代 P0 contract seam。 |
| 未闭合 positive lane 如何处理 | A. fake 通过；B. gap/blocked/unavailable + 重开 | 采用 B | fake/ACK/cache 不构成外部 truth 或 readiness。 |
| 性能阈值是否继承历史 `<100ms`、100% 等数字 | A. 继承；B. 仅保留无阈值 sample/trend | 采用 B | `NFR-MI-*` 明确当前无 workload/measurement baseline。 |
| 是否验下游内部 lifecycle | A. 是；B. 只验接缝 | 采用 B | owner truth 不属于本仓，避免越权和重复验收。 |

## 7. 结构化中间产物

### 7.1 验收目标

| 目标 ID | 验收目标 | 裁决对象 | 目标上限 |
|---|---|---|---|
| `AT-MI-001` | 五节点链可分阶段解释 | `C-MI-1`~`C-MI-5`、正式 local state | 不把链自动化为 global ready；断点必须有保守 disposition。 |
| `AT-MI-002` | static asset 与 live state 分离 | `D-MI-001~030`、`BR-MI-007/010/020/023` | 禁止 secret、live、外部 body 入 truth/build input/view。 |
| `AT-MI-003` | logical protocol 可判定 | 10 Command、10 Query、2 inbound、6 Job、0 outbound | 只验 in-process logical surface；不新增 transport/topic/scheduler。 |
| `AT-MI-004` | owner/dependency seam 不越界 | `DEP-MI-001~016`、`MI-UP-*`、`Q-MI-*` | 仅 ref/runtime/event/adapter/fake/marker/gap；不验外部内部真相。 |
| `AT-MI-005` | 证据与结论可追溯 | TC/EV、固定路径、VETO/risk acceptance | planned 标识不等 actual evidence；无 run 不得出结论。 |

### 7.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 设计/测试来源 | 非范围 / 说明 |
|---|---|---:|---|---|---|
| 镜像 family/variant/persona assembly identity 与 mapping source binding | 核心 local truth | P0 | 唯一 source、body-free ref/snapshot、异常不 fallback，能进入或阻断 C-MI-1 | `00` C-MI-1/F-MI-001~003；`03` §5、§7.1；`05` `TC-CMD-001/003`、`TC-QUERY-001/009` | 不验证 RoleDefinition 或 mapping body。 |
| component/runtime/tools/extras/base/seed 的 pinned static baseline、placement、revision/derivation | 核心 local truth | P0 | 完整 pin、static-safe、append/supersede、历史可追 | `00` C-MI-2/F-MI-004~006；`03` §5、§9；`05` `TC-CMD-002/003`、`TC-SEC-001/002` | 不保存 component/seed semantic body 或 live state。 |
| intent、immutable snapshot、attempt、outcome、candidate 阶段隔离 | 核心 staged truth | P0（当前负向） | 受 authority 的输入才可进入下一阶段；未知/失败/阻断不产生 candidate digest/ref | `00` C-MI-3/F-MI-007~009；`03` §7.1/§7.4/§9；`05` `TC-CMD-004/005`、`TC-JOB-001/002` | B01/B02、MI-UP-005、Q-MI-003 阻断正向构建。 |
| digest/provenance、applicable gate、eligibility、Artifact handoff 分层 | 资格与来源 | P0（当前保守） | 同一 candidate 的来源链可追；gate/Artifact gap 不被升格为 positive | `00` C-MI-4/F-MI-010~012；`03` §9/§13；`05` `TC-CMD-006/007`、`TC-QUERY-004` | Q-MI-004、MI-UP-007 未闭合；不声明 Artifact acceptance。 |
| availability transition、pinned entry、handoff/consumer gap | 核心供给 truth | P0（当前 local/negative） | 合格 pinned ref 才能进入 local availability；history append-only；consumer gap 独立 | `00` C-MI-5/F-MI-013~015；`03` §7.1/§9/§13；`05` `TC-CMD-008~010`、`TC-QUERY-005~007` | 不验证 container、launch、health、consumer confirmation。 |
| 28 条 non-outbound logical surface | 协议边界 | P0 | DTO、正式错误、no-write/marker/bounded/zero-inventory 语义可检查 | `03` §7~§8；`05` §3、§6 | 不绑定 HTTP/RPC/broker/scheduler。 |
| 19 state matrices / 20 local subjects | 状态与阶段隔离 | P0 | 合法/非法边、terminal、replacement、freshness 和 local subject 清晰 | `03` §9；`05` `TC-STATE-001~019` | 不生成 GlobalState/Ready。 |
| UoW、version、idempotency、concurrency、commit-unknown 与 recovery 上限 | 一致性 | P0（当前负向/blocked） | Query 无写；Command/Job 在 B01/B02 前 zero-effect；未知不盲重试 | `03` §10~§12；`05` `TC-CON-001~005`、`TC-REC-001` | `DDD-S9-*`、`DDD-S13-*`、PF 阻断正向恢复。 |
| strict config、五域 21 key、profile、sensitive/redaction、startup-only | 配置/安全 | P0 | strict JSON、source/priority、TestOnly 隔离和 fail-fast/closed 可裁决 | `04` §3~§11；`05` `TC-CONFIG-001~005`、`TC-SEC-001` | 不选择 secret provider、endpoint、产品或线上 reload。 |
| local trace、safe log/metric/span、evidence/report integrity | 追溯/证据 | P0 | 无 raw body/secret，EV→TC→artifact/report 可追，静态造证据失败 | `03` §14~§15；`05` §13；`EV-*` planned families | 当前无实际 artifact/report。 |
| controlled adapter、durable-like store、owner-closed positive seam | 集成接缝 | P1 | 验证 port failure mapping、fake parity、版本兼容，不替代 P0 truth | `03` §13、§17；`05` §4、§10 | owner 合同关闭前只保留 negative/gap。 |
| real-like registry/Artifact/consumer、跨仓 accepted event | 外部集成 | P1 | 在正式 owner 合同和环境出现后单独选定 run 验证 | `MI-UP-001/005/007`、`Q-MI-003/004` | 不作为当前 P0 通过前置。 |
| multi-architecture、restricted variant、hardened base、fast rebuild、usage summary | 外围增强 | P2 / future | 仅验证未来启用不破坏核心边界 | `F-MI-E01~E05`、`Q-MI-001/002`、`MI-UP-008` | 未启用不进入核心分母。 |
| production-like capacity/SLO、长期 retention、产品入口 | 运维/产品 | P2 | 待 workload、产品和运维 authority 后再定义 | `NFR-MI-*`、`R-MI-009/010` | 本仓不定义产品入口或运维后端。 |

### 7.3 只验接缝的下游与外部能力

| 依赖方 | 依赖类型 | 本轮可验 | 本轮不验 | 未闭合时裁决 |
|---|---|---|---|---|
| `L3-method-library` | `runtime + ref` | mapping source/ref、safe snapshot、validity/gap、no-copy | RoleDefinition/mapping body、方法库内部 lifecycle | `MI-UP-003` 下 `Unknown/Gap/Blocked`；不 fallback。 |
| `L2-runtime` | `ref`（适用时 runtime） | immutable runtime release ref、safe availability marker | runtime loop、live memory/checkpoint、execution result | `MI-UP-002` 或 owner gap 时 baseline blocked。 |
| `L2-tools` | `ref`（适用时 runtime） | pinned tool/extras ref、typed capability boundary | tool execution、capability registry、provider body | 只保留 ref/gap；不声明 tool success。 |
| `L2-member` | `ref` | member component release ref/compatibility seam（若有正式合同） | member 主体、persona behavior、member readiness | `MI-UP-002` 下 incomplete/blocked。 |
| `L2-member-service` | `runtime + ref + adapter` | local pinned entry、typed consumer slot、`ConsumerHandoffGap` | manifest exact schema、host/container/launch/health/confirmation | `MI-UP-001` 下 gap/unavailable/reopen。 |
| `L1-artifact` | `ref + adapter` | candidate handoff intent、formal ref slot、gap mapping | Artifact truth、lineage、acceptance、storage/delivery | `MI-UP-007` 下 Pending/Gap，不 mint ref。 |
| Bus/Core/event owner | `event + adapter` | inbound marker-only、outbound zero inventory | topic/envelope/receipt/dedup/publisher/delivery | `MI-UP-005/009` 下 marker/`NoneAuthorized`。 |
| builder/registry/evidence/policy providers | `adapter + ref` | controlled failure mapping、safe conclusion shape | provider product、credential、backend body、gate inventory | `Q-MI-003/004` 下 blocked/unknown；不 default-pass。 |
| `L4-sandbox` | future `ref + adapter` | hardened-base selector slot only if formally enabled | sandbox policy/backend/execution | `MI-UP-008` 下不装配 current base。 |

### 7.4 P0/P1/P2 裁决口径

| 优先级 | 纳入条件 | 结果对总体结论的影响 | 证据要求 |
|---|---|---|---|
| P0 | 当前正式设计有稳定字段/状态/错误/边界，且 `05` 有 TC/EV planned seam | P0 失败、VETO 命中或证据不可裁决时总体不得通过；受 blocker 影响的正向项只能以明确 blocked/negative 结论出现 | future 固定 `<run_id>` 下必须闭环到 TC、EV、report 和必要 raw artifact。 |
| P1 | owner 合同、真实产品或 real-like 环境尚未作为核心输入 | 不作为当前 P0 通过前置；若本轮明确选入则按独立条件裁决，不能伪造 unavailable 为 pass | 独立 run/EV 标记 P1，缺失进入 residual。 |
| P2 | future scope、生产容量、产品/运维能力或未裁定问题 | 不参与当前结论；记录为 future risk/重开触发 | 进入风险/后续文档，不得产生 P0 evidence alias。 |

### 7.5 范围项与 VETO 候选映射

| VETO 方向 | 触发范围 | 本轮裁决上限 |
|---|---|---|
| `VETO-MI-001` | 五节点链、跨能力追溯 | 任一核心节点无可判断结果却宣称闭环完成，整体不通过。 |
| `VETO-MI-002` | mapping、pin、entry、版本 | hardcode/fallback/`latest`/mutable/猜测版本导致可用结果，整体不通过。 |
| `VETO-MI-003` | static baseline、snapshot、view、trace、report | secret/live/external/backend/container body 入域，整体不通过。 |
| `VETO-MI-004` | intent/attempt/candidate | 无 authority、输入不完整、builder 未确认或 failed/blocked/unknown 却产生 candidate digest/ref，整体不通过。 |
| `VETO-MI-005` | provenance/gate/eligibility/Artifact | provenance/gate/Artifact 条件不全却声称 positive eligibility/formal ref，整体不通过。 |
| `VETO-MI-006` | availability/entry/history/consumer seam | 不合格版本供给、历史覆盖或把 local supply 等同 consumer/container/notification，整体不通过。 |
| `VETO-MI-007` | owner/dependency/event/evidence boundary | 复制 owner truth、私造 compile/event/schema，或把 pending/fake/adapter 写成 readiness/test/acceptance，整体不通过。 |

## 8. 回填草稿（正式 §2）

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读本文件“结构化中间产物”“回填草稿”和“待确认事项”小节，了解本轮范围、优先级和接缝上限如何从正式 `00~05` 收敛。

正式 §2 应写明：本轮 P0 验收覆盖五个 capability 节点、28 条 non-outbound logical surface、19 个状态矩阵、static/live 与 owner/dependency 红线、UoW/幂等/一致性、五域配置、redaction、可追溯证据和 VETO。P1 仅覆盖 owner-closed/real-like 接缝，P2 覆盖外围增强与生产运维 future。`L2-member`、`L2-member-service`、Runtime、Tools、Method Library、Artifact、Sandbox、Bus/Core、builder/registry/evidence provider 的内部 truth 不在本仓验收范围，未闭合时只产生 ref/gap/blocked/unavailable/marker。命中 `VETO-MI-001~007` 的行为不得通过或有条件通过。

## 9. 待确认事项与持续 blocker

| 事项 | 影响 | 当前处理 / 重开点 |
|---|---|---|
| P1 selected-run 是否由某个 release 强制 | 影响 Step 3/4/13 | 当前不升为 P0；若强制，重开 Step 2~4、9、13。 |
| Q-MI-001/002 是否进入核心范围 | 影响 variant identity 和 P2 分母 | 保持 future；正式决策后重开 Step 2、5、6、9、11。 |
| Q-MI-003/004、MI-UP-001/005/007 positive contract | 影响外部正向验收 oracle | 只验接缝；owner 闭合后重开 Step 5、7、9~11、13。 |
| B01/B02、B03、OPEN-01/02、PF | 影响 write/replay/recovery 正向 lane | 保持 zero-effect/no-write/blocked；不在本 Step 解除。 |
| 实际 delivery/evidence 是否存在 | 影响后续基线与实际裁决 | 留 Step 3/10；当前不生成任何事实。 |

## 10. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 验收目标可判定且不重定义需求 | 通过 | §2、§3；只转译正式 `00~05`。 |
| In Scope/Out of Scope 明确 | 通过 | §7.2、§7.3。 |
| P0/P1/P2 分母不混淆 | 通过 | §7.4；P1/P2 不自动进入 P0。 |
| 跨仓依赖按类型表达 | 通过 | §7.3；无源码依赖推导。 |
| VETO 候选有正式来源且不可被 residual 覆盖 | 通过 | §7.5；对应 `VETO-MI-*`。 |
| 未写入真实 evidence/result/readiness | 通过 | 全文仅 planned/future/blocked 语义。 |
| 可进入 Step 3 | 通过 | 范围可定位，下一步固定基线。 |

```text
step_02 = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_03
next_allowed_action = create_and_complete_step_03_baseline
formal_06_write_allowed = false_until_step_15
actual_evidence_generated = false
```
