# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填章节: `07-实施计划.md` §5 实施阶段与依赖顺序
> 当前模块: `R5.2 phases and dependencies:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 设计实施阶段与依赖顺序 |
| 当前模块 | `R5.2 phases and dependencies:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 4 交付物清单;`03-详细设计.md` §4~§16;`05-测试方案.md`;`06-验收标准.md`;L1-governance Step 5 框架参考 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |
| 停审方式 | 用户已确认 Step 5,允许进入 Step 6 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 4 实施对象与交付物 | completed_confirmed | 提供七实现单元、protocol / flow 交付物池、测试证据交付物、非交付物和跨仓依赖 |
| `03-详细设计.md` §4~§16 | 已读取 | 提供 crate dependency、八业务组成、161 flow、state、tx、error、config、observability 和 handoff |
| `05-测试方案.md` §6 / §9 / §13 / §14 | 已读取 | 提供 suite family、blocking checks、artifact/report、EV-ML 和 regression 规则 |
| `06-验收标准.md` §3 / §5~§14 | 已读取 | 提供 AC/VETO、P0/P1/P2、evidence index、handoff、risk acceptance 和 final decision |
| L1-governance Step 5 | framework_reference | 只参考“阶段依赖图 / 阶段总表 / 可验证增量 / 停审 / 跨 phase 审计”框架 |

## 3. SOP 问题回答

1. 最小可运行或可测试的纵切是什么。

   回答: 最小纵切不是旧 publish/snapshot/outbox,而是正式 workspace layout + contracts/domain foundation + 方法资产定义与目录 accepted command / query-safe shell 的最小闭环。它必须能证明 typed ref、body-free source boundary、truth owner、state guard、UoW、stored result 和最小 contract/domain/service tests。

2. 哪些阶段必须先于其他阶段。

   回答: PH-01 layout/tooling/evidence 必须最先。PH-02 contracts/domain foundation 必须先于所有业务纵切。方法资产定义 / 目录 PH-03 必须先于 formalization/version PH-04。formalization/version 必须先于 consumption/distribution PH-05。trace/impact/audit PH-06 依赖正式化与消费语义。read material/query PH-08 依赖 core truth、external/peripheral 和 trace source。worker/event PH-09 与 jobs PH-10 必须在 stored surface 和 read/material source 闭合后进行。release evidence PH-11 最后收口。

3. 哪些风险或跨仓依赖需要前置。

   回答: 旧实现仓 layout、`core-contracts` path、scripts/artifacts/reports roots、config profile、redaction/dependency checks 和 implementation ledger/boundary ledger 规则必须在 PH-01 / Step 6 前置。非 core sibling repo 不能成为 Cargo dependency;只能在对应 phase 用 fake / controlled / disabled seam。

4. 每个阶段完成后能验证什么。

   回答: PH-01 验证 layout/tooling/evidence root;PH-02 验证 public shell 与 domain foundation;PH-03 验证 definition/catalog truth;PH-04 验证 formalization/version/state/idempotency;PH-05 验证 controlled consumption/distribution/handoff semantics;PH-06 验证 trace/impact/audit/lineage/evidence refs-only;PH-07 验证 external summary/ref and peripheral package/set 有界能力;PH-08 验证 query/read material no-write;PH-09 验证 inbound/outbound/publisher;PH-10 验证 operations jobs/replay/no truth repair;PH-11 验证 reports/evidence/acceptance handoff。

5. 是否存在按对象拆分而不可验证的阶段。

   回答: 不允许按 domain struct 或 crate 横切拆 phase。每个 phase 必须有可运行或可测试增量,并能绑定至少一个 suite / evidence 方向。crate 只是落点,不是阶段主轴。

6. 哪些阶段可以并行,哪些不能并行。

   回答: 主链 PH-01~PH-11 原则串行。report script skeleton、redaction checker、dependency checker 可在 PH-01 后随 phase 增量完善,但不能替代业务 phase 门禁。P1 real-like selected-run 只能在 P0 core 完成后探索。

7. 每个 phase 是否有明确的功能增量、输入、输出、测试门禁和验收门禁。

   回答: 本 Step 给出 phase 总表、可验证增量表和停审表。Step 7 将把 suite / AC / VETO 精确映射到 commit boundary。

8. 每个 phase 是否包含只能由后续 phase 提供的对象、协议、flow、状态或证据。

   回答: 阶段设计避免后续依赖前置。当前 phase 可以预留后续 ref / enum / marker shell,但不能要求后续 phase 的 service、job、publisher、report 或 evidence 才能通过。

9. 每个 phase 完成后是否通过停审。

   回答: 本 Step 只做设计层停审。执行期仍必须按 Step 6 boundary ledger、Step 7 gate 和 Step 12 completion criteria 复核。

10. 所有 phase 完成后,依赖顺序、风险前置、外部依赖和验收覆盖是否通过跨 phase 审计。

   回答: 当前设计层审计通过。仍需 Step 6 把 phase 拆为 commit boundary,并生成 implementation ledger / boundary ledger 后才能移交实现。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 旧 `07` | phase 可能沿旧 publish/snapshot/outbox 主线 | 反向污染 current `03/05/06` | 完全重拆 phase |
| Step 4 交付物 | 七 crate 与 161 flow 都在交付池 | 若按 crate 横切,阶段不可验收 | 按可验证能力纵切拆 phase |
| P0 core vs peripheral | FR-ML-E 与 package/set 能力容易抢占主链 | peripheral 阻塞 core | 将 peripheral 放在 core 后、query/job 前的有界 phase |
| Query / job / report | 容易提前修 truth 或补 evidence | 触发 VETO-ML | 明确 query/job/report phase 只读、只派生、只汇总 |
| implementation ledger | Step 5 还没有 boundary id | 不能合法生成真实台账实例 | Step 6 负责 commit boundary 后生成 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段组织 | 未定义新版 phase | PH-01~PH-11 按依赖和可验证能力推进 | 支撑 Step 6 commit boundary |
| 阶段主轴 | 可能按 crate 或对象清单拆 | 按 layout -> foundation -> core truth -> version -> consumption -> trace -> external/peripheral -> query -> events -> jobs -> release | 每阶段可测 |
| 外部依赖 | 多个 sibling repo 参与语义 | 只有 core 编译期依赖,其余为 seam | 避免 dependency VETO |
| Evidence | 可能最后手写补 | PH-01 建根,PH-11 汇总,中间逐 phase 产出 | 防止 static evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 `contracts/domain/application/infra` 横向拆 phase | 与代码层一致 | 前几个 phase 没有业务闭环,无法验收 | 不采用 |
| 按 58/57/4/34/8 protocol family 横向拆 phase | 协议清楚 | 会把 truth、read、event、job 互相割裂 | 不采用 |
| 按方法资产能力纵切拆 phase | 每阶段可测,能保护 truth owner | Step 6 需要继续细拆 commit | 采用 |
| 把 package/set peripheral 放到最后 | core 更快 | query/job/release 需要知道 peripheral residual 边界 | 不采用;放在 PH-07 有界处理 |
| 把 release evidence 独立成 phase | 能集中做 report/VETO/handoff | 最后才有完整验收 | 采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图

```text
[PH-01 layout / tooling / evidence baseline]
  -> [PH-02 contracts / domain foundation]
  -> [PH-03 method asset definition and catalog truth]
  -> [PH-04 formalization and version semantics]
  -> [PH-05 controlled consumption and distribution semantics]
  -> [PH-06 traceability, impact, audit and evidence lineage]
  -> [PH-07 external summary / reference and peripheral package/set boundary]
  -> [PH-08 query, read material and projection surfaces]
  -> [PH-09 inbound / outbound event and publisher worker]
  -> [PH-10 operations jobs, replay, recovery and reports]
  -> [PH-11 release evidence, VETO and acceptance handoff]
```

### 7.2 阶段总表

| Phase | 阶段名称 | 实施目标 | 依赖 | 核心交付物 | 阶段门禁方向 |
|---|---|---|---|---|---|
| PH-01 | layout / tooling / evidence baseline | 迁移旧实现仓 layout,建立 workspace、core dependency、config/profile skeleton、script root、artifact/report root | 无 | 七 crate skeleton、root Cargo、config fixtures、script shell、path roots | `cargo check`;dependency path check;script `--help`;no old layout |
| PH-02 | contracts / domain foundation | 建立 typed refs、metadata、safe markers、shared command/query/event/job shells、domain state/error/policy foundation | PH-01 | contracts foundation、domain base modules、test support | `contract-domain-fast` foundation slice;redaction fixture |
| PH-03 | method asset definition and catalog truth | 建立方法资产定义、identity、catalog、source boundary、definition accepted flow | PH-02 | definition/catalog DTO、domain、service、repo fake、minimal API handler | truth owner tests;UoW accepted/rollback;old material pollution tests |
| PH-04 | formalization and version semantics | 建立 formalization state、formal version、version change、supersede/retire、stored replay | PH-03 | formalization/version DTO、domain guard、service flow、idempotency store | state/transition/idempotency/commit unknown tests |
| PH-05 | controlled consumption and distribution semantics | 建立 consumption material、Definition vs Use guard、availability、distribution context、handoff shell | PH-04 | consumption/distribution DTO、service、availability mapper、handoff adapter fake | consumption/query boundary;availability/degraded;handoff no truth |
| PH-06 | traceability, impact, audit and evidence lineage | 建立 trace material、impact summary、audit trail、lineage/evidence refs、consistency protection | PH-05 | trace/audit/impact/lineage DTO、domain/service/store | refs-only;impact protection;stored replay;report/audit safe |
| PH-07 | external summary / reference and peripheral package/set boundary | 建立 external summary/source/artifact refs、body boundary,以及 package/method set 有界 peripheral 能力 | PH-06 | external summary adapter fake、package/set DTO/domain/service、residual markers | body-free external;peripheral not blocker;no marketplace transaction |
| PH-08 | query, read material and projection surfaces | 建立 57 Query、read materials、projection/material stores、freshness/degraded/unavailable surfaces | PH-07 | query/view DTO、query service、material store、API query handlers | query no-write;stale/degraded marker copy-only |
| PH-09 | inbound / outbound event and publisher worker | 建立 4 Inbound Consumer、34 Outbound Event / sender、candidate/outcome、worker runner | PH-08 | consumer envelopes、event candidate/outcome、worker publisher,source/publisher fakes | receipt replay;candidate vs outcome;publisher failure no rollback |
| PH-10 | operations jobs, replay, recovery and reports | 建立 8 Operations Job、checkpoint/progress、job report、partial failure、duplicate replay/no truth repair | PH-09 | job DTO、application job service、jobs runner、report store | `operations-replay-core`;checkpoint;partial issue;no truth repair |
| PH-11 | release evidence, VETO and acceptance handoff | 汇总 fixed run artifact/report、evidence index、gate summary、VETO、handoff、risk acceptance | PH-10 | report generator、evidence index、handoff/risk/open issue reports | `release-main-smoke`;report-generation-audit;VETO checklist |

### 7.3 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| PH-01 | 从旧实现仓形态到正式 workspace 与证据根 | Step 3/4;`03` §4;`04`;`05` path | layout、Cargo、config/script/artifact/report roots | 业务 schema / service | check/fmt skeleton、dependency/check script |
| PH-02 | 公共 shell 与 domain 基座 | `03` §5~§7 | typed refs、safe marker、shared DTO shell、domain base | 业务 accepted flow | contract/domain foundation tests |
| PH-03 | 定义和 catalog truth 最小纵切 | `03` definition/catalog flow | definition/catalog command + repository + minimal handler | formal version / consumer | contract-domain/service slice |
| PH-04 | 正式化和版本状态纵切 | PH-03;formalization/version design | formal state/version/change/supersede/retire | distribution / event / job | state/idempotency/replay tests |
| PH-05 | 受控消费与分发语义纵切 | PH-04;consumption/distribution design | consumption material、availability、distribution/handoff shell | publisher delivery / job | service-flow availability/handoff tests |
| PH-06 | 追溯、一致性和证据线索纵切 | PH-05;trace/audit/impact design | trace/audit/impact/lineage stores and services | external fetch / query projection | trace/audit/impact UoW tests |
| PH-07 | 外部摘要与外围边界纵切 | PH-06;external/peripheral design | external summary refs、artifact refs、package/set shell | marketplace transaction / advanced package UX | body-free and residual tests |
| PH-08 | 读取面与派生材料纵切 | PH-07;query/material design | 57 query/read material/projection API | write truth / refresh via query | query no-write/material marker tests |
| PH-09 | worker event 协作纵切 | PH-08;inbound/outbound design | receipt/candidate/outcome/worker runner | operations job report | entry-worker-job event subset |
| PH-10 | operations job 纵切 | PH-09;job/checkpoint/report design | 8 job runner、checkpoint、report、recovery issue | release verdict | operations-replay-core |
| PH-11 | release evidence 纵切 | PH-10;`05/06` evidence design | summary、gate summary、evidence index、handoff | 新功能 / static pass | report-generation-audit/release smoke |

### 7.4 Phase 停审记录

| Phase | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否只做 layout/tooling/evidence baseline,不提前定义业务 truth | 通过 | 旧 layout 迁移必须在本 phase 处理 |
| PH-01 | 是否建立 artifact/report path,但不伪造 evidence | 通过 | 只建路径和脚本壳,真实 run 留给执行期 |
| PH-02 | 是否能承载后续 protocol family 的 shared shell | 通过 | 不实现业务 flow |
| PH-03 | 是否形成 definition/catalog accepted mutation,且不依赖 formalization | 通过 | formal state 留给 PH-04 |
| PH-04 | 是否闭合 formal version/stored replay,且不触发 distribution | 通过 | outbound candidate 可预留 ref,不发布 |
| PH-05 | 是否只写 consumption/distribution/handoff semantics,不做 publisher | 通过 | worker publisher 留给 PH-09 |
| PH-06 | 是否 trace/audit/impact/evidence refs-only,不保存 raw body | 通过 | redaction audit 从本 phase 起增强 |
| PH-07 | 是否 peripheral 不阻塞 core | 通过 | FR-ML-E 只做有界 shell/residual marker |
| PH-08 | 是否 query no-write 且 marker copy-only | 通过 | material refresh job 留给 PH-10 |
| PH-09 | 是否 inbound/outbound 不修 core truth且 publisher failure 不回滚 | 通过 | operations job 留给 PH-10 |
| PH-10 | 是否 job 只写 derived material/progress/checkpoint/report/issue | 通过 | 不重做 formalization / 不修 core truth |
| PH-11 | 是否只汇总真实 suite artifact/report | 通过 | 不新增业务代码,不默认 VETO passed |

### 7.5 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| phase 顺序是否由依赖驱动 | 通过 | layout -> foundation -> truth -> version -> consumption -> trace -> external/peripheral -> query -> event -> job -> release |
| 是否存在按 crate 裸拆 phase | 通过 | crate 是落点,phase 是可验证能力 |
| 是否存在后续 phase 必需输入被前置 | 通过 | 后续 ref 可预留,服务 / job / publisher / report 不可作为当前 gate |
| peripheral 是否阻塞 P0 core | 通过 | PH-07 放在 core 后,以 shell/residual marker 处理 |
| query/job/report 是否反写真相 | 通过 | PH-08 no-write、PH-10 no truth repair、PH-11 no static evidence |
| non-core sibling compile dependency 是否进入 | 通过 | 仅 PH-01 固定 `core-contracts`;其他 phase 使用 seam |
| evidence 是否被最后手工补 | 通过 | PH-01 建路径,PH-11 汇总真实 artifact/report,pipeline 中逐 phase 产出 |
| Step 6 是否有足够拆分空间 | 通过 | 每个 phase 可继续拆 contracts/domain/service/infra/entry/test/evidence boundary |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“Phase 可验证增量说明”“Phase 停审记录”和“跨 phase 依赖闭环审计表”小节。

正式 `07-实施计划.md` §5 后续应回填:

本轮实施按可验证能力纵切推进,不按 crate 横切、domain struct 清单或旧 publish/snapshot/outbox 主线推进。阶段顺序为 PH-01 layout/tooling/evidence baseline,PH-02 contracts/domain foundation,PH-03 method asset definition and catalog truth,PH-04 formalization and version semantics,PH-05 controlled consumption and distribution semantics,PH-06 traceability/impact/audit/evidence lineage,PH-07 external summary/reference and peripheral package/set boundary,PH-08 query/read material/projection surfaces,PH-09 inbound/outbound event and publisher worker,PH-10 operations jobs/replay/recovery/reports,PH-11 release evidence/VETO/acceptance handoff。

每个 phase 必须形成可运行或可测试增量,并在完成时停审:是否有独立功能增量、是否依赖后续 phase、是否可执行当前门禁、是否触发设计闭口缺口。Query phase 不写 truth,worker / publisher phase 不回滚 accepted truth,job phase 不修 core truth,release phase 不新增业务功能也不静态伪造证据。

Step 6 将在本阶段顺序之上拆分 commit boundary、编写顺序、required reads、allowed scope、forbidden scope、required checks、Commit Gate 和 Handoff Gate。Step 5 不生成真实 implementation ledger / boundary ledger 实例。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| PH-01 是迁移保留旧代码还是清空重建 | 影响首批 commit boundary | Step 6 按目标仓实际代码和 forbidden old mainline 拆 |
| PH-07 peripheral shell 覆盖到什么深度 | 影响 FR-ML-E residual | Step 6/7 按 P0 core vs residual 再裁剪 |
| 57 Query 是否在 PH-08 一次完成或分批 | 影响 commit boundary 数量 | Step 6 按 query family 拆 |
| scripts/report generator 是 PH-01 建壳还是 PH-11 才完整 | 影响 evidence boundary | PH-01 建壳,PH-11 完整汇总 |
| implementation ledger 首个 boundary id | 影响实现移交 | Step 6 定义 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已输出 | 通过 | PH-01~PH-11 串行推进 |
| 阶段总表已输出 | 通过 | 每阶段含目标、依赖、交付物和门禁方向 |
| 每个 phase 有可验证增量说明 | 通过 | 输入、输出、不包含、验证方式已列 |
| 每个 phase 已完成设计层停审 | 通过 | 执行期仍需按 Step 6/7/12 复核 |
| 跨 phase 审计无 unresolved 冲突 | 通过 | peripheral、query、job、release 和 dependency 红线已处理 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R5.2 / Step 6 | 通过 | 用户已确认,允许进入 Step 6 |

## 11. R5.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 5 phase 依赖图、阶段总表、可验证增量、phase 停审、跨 phase 审计和 Step 6 承接口径 |
| 后续动作 | 进入 Step 6 `R6.1 tasks and commit boundaries:先思考` |
