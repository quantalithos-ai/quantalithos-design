# 07 Step 4：实施对象与交付物清单

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step 2/3；03 §4～§16；04 §4～§11；05 §3/§7/§9/§13；06 §4/§10/§14 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读输入/逐问题/诊断/取舍 | done | 下方逐项及原结构化产物 |
| 定向修复/复杂度/回填 | done | 排程/数量/来源/安全及成熟度按新版Step5～8对齐；业务schema不复制 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

从详细设计、配置、测试和验收标准中抽取本轮会交付的实现对象、脚本、测试、配置、数据和文档产物；每项都必须有落点、来源和完成判定。对象索引不等于实施顺序，后续 Step 5/6 按可验证增量重新组织。

## 本步输入

| 输入 | 已抽取规模 / 约束 |
|---|---|
| 03 文件布局 | 6 Rust members + Web；完整 planned 文件树以 03 Step 4 为准 |
| 03 契约 | 43 objects、17 ports/146 methods、21 Commands/16 Queries/12 Jobs、49 flows、14 carriers |
| 04 配置 | 6 config domains、7 RuntimeConfig fields、8 adapter slots、4 profiles |
| 05 测试 | 13 CUT、13 DS、98 TC/EV、11 suites、固定 artifact/report roots |
| 06 验收 | 20 AC、5 VETO、49 entrance/状态/证据边界，三类证明范围 |

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 本轮会新增或修改哪些代码模块。 | 六Rustmember+Web按03布局215plannedpath；不是215独立提交。 |
| 2. 本轮会新增或修改哪些接口、事件、job 或 adapter。 | 21C/16Q/12J、8slot，37HTTP+12internalJob，0activeevent/outbox，不能新发payload。 |
| 3. 本轮会新增哪些测试。 | 98TC↔EV、11suite、13CUT/13DS及完整参数化库存，不把fixture当actualtruth。 |
| 4. 本轮会产生哪些配置、迁移、种子数据或文档同步。 | 严格JSON/configexamples、本地32store/migrations/indices、22scripts/registry/schema；实际路径在授权targetrepo按truth冻结。 |
| 5. 哪些上游设计对象本轮不交付。 | 所有owner正文/血缘/registry/approval/auth/Billing/Archivetruth排除；0activeevent不预造writer。 |
| 6. 哪些交付物跨仓或依赖外部模块。 | Core/SDKpath export与九owner runtime/SDKexactqualification；Obsconditional，Archivefuture不交付handoffwriter。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 03 的 215 planned 文件容易被写成 215 独立任务 | 破坏 phase 可验证增量 | 作为文件导航，交付按能力和 boundary 组织 |
| 43 对象容易导致重复实现真相 | 实施计划重写详细设计 | 只引用对象/port/flow 入口，不复制 schema |
| 13 DS/98 EV 可能被误认为已生成 | 伪造测试证据 | 只列测试计划交付物，实际 run/artifact/report 由实现仓产生 |
| adapter slot “存在”容易被读成 ready | 外部 contract 越界 | 交付 exact mapping shell；slot status 由配置 validator + consumer qualification 决定 |
| migration/seed 可能创建 owner 数据 | ownership 违规 | 仅本地 projection、operation、work、audit、reference snapshot 和索引 |

## 改动前后对比

| 维度 | 原有输入 | 本步收口 |
|---|---|---|
| 代码 | 目录树和对象索引 | 7 类模块交付 + 入口/adapter/job 约束 |
| 数据 | PG/Row 概念 | 仅本地局部 truth、typed snapshot、operation/work/audit/projection |
| 测试 | 98 TC/EV 名单 | 按 CUT/DS/suite 交付并绑定阶段门禁 |
| 运维 | 配置和脚本散落 | strict config、gate/check/report 脚本与固定路径 |
| 文档 | 设计文档完成 | implementation ledger/boundary skeleton 只在 Step 13 创建 |

## 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 按 crates/文件逐项实施 | 拒绝 | 无法表达纵切能力和门禁 |
| 只列业务代码、不列测试/脚本/台账 | 拒绝 | 交付不可验证，无法 handoff |
| 按能力交付，文件作为 allowed scope 附录 | 采用 | 可 review、可回退、可审计 |
| 为 event/outbox/Archive 预留实现文件 | 仅保留明确 reserved 口径 | 当前 0 active，不能用空壳暗示授权 |

## 结构化中间产物

### 实施对象清单（按责任模块）

| 对象组 | 预计落点 | 来源 | 交付边界 |
|---|---|---|---|
| 公共 contracts/value/state/error/result/view | crates/contracts/src | 03 §5.1、Step 6/shared types | 只定义正式 finite types；不放 owner body |
| domain entities/policies/rehydrate | crates/domain/src | 03 §5.2、Step 6/10 | 纯同步 guard/transition；无 I/O |
| application entries/ports/flows/runners | crates/application/src | 03 §5.3、Step 7/8/9 | 21C/16Q/12J、UoW、replay、scope |
| PG stores/rows/codec/UoW | crates/infra/src/postgres | 03 §5.4、§10/12 | same Tx、CAS、history/result/work/projection |
| eight owner adapters/config/runtime/fake | crates/infra/src/sdk、fake、runtime | 03 §13；04 §6/7/9 | exact contract 或 deterministic Blocked；生产无 fake fallback |
| API routes/handlers/response mapping | crates/api/src | 03 §5.5、§7/8 | 37 HTTP routes；trusted context；safe error |
| worker scheduler/job dispatch/recovery | crates/worker/src | 03 §5.6、§8/10/11 | 12 internal jobs；A/B checkpoint/lease/fence |
| Web client/views/composables/i18n | apps/web/src | 03 §5.7；05 §3/8 | typed API mirror、双语展示；无 DB/SDK 直连 |

### 非代码交付物

| 交付物 | 预计落点 | 来源 | 完成判定 |
|---|---|---|---|
| PG migration/indices/constraints | migrations/ | 03 §10、05 DS | 只承载本地表；Row/codec 与 schema 一致 |
| strict config examples/schema | config/ 或实现仓约定路径 | 04 §4～§11 | 4 profile 解析、redaction、invalid fail-fast |
| gate/check/report scripts | scripts/gates、scripts/checks、scripts/reports | 05 §9/13 | 支持 run-id/artifact-root/report-root；不写入 reports 输出目录 |
| test fixtures/fakes | tests/、infra/fake | 03 Step16、05 §7 | 同 port 语义；不伪造 owner positive |
| evidence/report schemas | artifacts/test/<run_id>、reports/runs/<run_id> | 05 §13、06 §10 | 设计 schema only；实际实例由实现/测试生成 |
| implementation ledger/boundary ledger | design-calibration/implementation_execution_ledger.md、implementation-boundaries/ | 台账规范 | Step 13 全量创建；状态 planned/blocked/waiting |
| handoff/review templates | reports/acceptance（实现时） | 05/06 | 模板不等审查结论；人/Agent 需补审 |

### 非交付物清单

| 非交付物 | 责任 owner / 状态 |
|---|---|
| Method/Role/ProcessTemplate/Capability/Image/Artifact 正文、registry、血缘 | 对应 owner；Marketplace 只存 refs |
| Identity truth、人类/组织认证、Governance approval | Identity/Governance；本地只消费正式输出 |
| 签名/扫描/SBOM verdict、ACK、receipt 生成 approval/installed/paid | 不允许；只引用材料/结果 |
| 安装执行、激活、卸载、支付、订阅、收入分成、跨境交易 | receiver/未来 Billing；future/blocker |
| Archive export/restore、canonical event/outbox、Bus 直连 | 当前 0 active；需新 owner/ADR |
| rating/review/ranking/recommendation、公开 CLI | 当前需求/架构未纳入 |

### 交付物追溯与证明上限

| 交付层 | 设计阶段能证明 | 实现阶段才可证明 |
|---|---|---|
| contracts/domain/application | 路径、职责、契约来源 | 编译、单测、contract test |
| infra/API/Worker/Web | 依赖方向、入口/port映射 | 集成/端到端执行结果 |
| scripts/config/migrations | 参数和 schema 设计 | 实际解析、迁移、gate run |
| evidence/reports/acceptance | schema、路径、成熟度规则 | raw artifact、report、人工审查和 verdict |

## 回填草稿

> 本计划实施对象按能力归属而非按文件逐项实现。代码交付覆盖 03 已确认的 contracts、domain、application、infra、api、worker 和 Web；非代码交付覆盖本地 PG migration、strict config、gate/check/report scripts、测试 fixtures、证据 schema 和实施台账。每项均回指正式 03/04/05/06，且不复制详细对象字段。
>
> 明确非交付物包括所有 owner 正文/血缘/registry、Identity/Governance truth、签名/扫描/ACK 产生的 approval 或 installed、安装/支付/财务、Archive writer、canonical event/outbox 以及未进入需求的运营能力。未满足 owner qualification 时只交付受控 adapter shell 和 blocked/degraded 分支。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 03 Step 4 完整 215 文件清单与本阶段 allowed scope 的交叉审计 | 避免漏文件或越界 | Step 6 boundary 定稿前 |
| 迁移/索引实际 owner 与 retention policy | PG boundary 与 Q-MP-01 | 02-b PG开工前 |
| 22 scripts命令及schema已由05定义；未来实际实现/CLI与source核验 | Step 7/11 gate | 01-a工具bootstrap开工前 |

## 进入下一步条件

- [x] 代码、测试、配置、迁移、脚本、证据和台账交付物均有落点与完成判定。
- [x] 非交付物已明确 owner/状态，未把外部真相纳入本仓。
- [x] 交付按能力组织，未将 43 对象或 215 文件直接当阶段。
- [x] 外部 qualification 缺口不会被交付物清单隐藏。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
