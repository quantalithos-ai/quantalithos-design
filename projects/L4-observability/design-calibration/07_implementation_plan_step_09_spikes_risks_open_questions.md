# L4-observability 07-实施计划 Step 09：Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.9
> 直接输入：current Step 01~08、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`
> 文档性质：设计讨论中间产物。本文定义实施前的风险控制和设计回写触发，不声称 Spike 已执行、目标仓已建立或任何验收结论已产生。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 09 / Spike、风险与待确认事项` |
| mode | `full-restart` |
| status | `completed_current_step_09` |
| current module | `spike-risk-affected-open-question-closure` |
| input baseline | current Step 01~08；current formal `03/04/05/06` |
| target repo reality | `/home/aris/Projects/quantalithos-observability` absent when checked |
| execution reality | CI、IntegrationLike、RuntimeLike、runner、真实 run/artifact/report/evidence 均未建立 |
| design gate | `pass_with_affected_and_reality_preconditions` |
| new upstream blocker | `none` |
| inherited affected | `12` 项继续 `open` / `controlled` / `conditional`，没有被本 Step 关闭 |
| next allowed action | `continue_to_step_10` |
| current commit | 不需要；用户未要求提交 |

## 2. 本步输入与阅读记录

| 输入 | current 用法 | 结果 |
|---|---|---|
| Step 01 输入边界 | 识别目标仓、工具、依赖和正式文档的 reality 缺口 | 已消费；目标仓缺失保留为实施 blocker |
| Step 02 范围 | 固定 observation-only、body-free、no-write 和外围隔离范围 | 已消费；Spike 不扩大业务 truth ownership |
| Step 03 前置与阅读矩阵 | 绑定每个 Spike 的来源和复核入口 | 已消费；不以记忆或旧 README 代替正式来源 |
| Step 04 交付物 | 确认风险必须落到七 crate、脚本、artifact/report 或台账交付面 | 已消费；未新增交付物 |
| Step 05 phase | 绑定影响阶段和最晚截止点 | 已消费；使用 `PH-01~PH-08` |
| Step 06 boundary | 绑定开工/提交前门禁、allowed/forbidden scope 和恢复边界 | 已消费；使用 `commit-01-a~08-b` |
| Step 07 gate | 绑定 `GATE-OBS-01~12`、99 TC、82 DS、9 suite、EVG | 已消费；planned gate 不被写成执行结果 |
| Step 08 配置/环境 | 固定 profile/lane、依赖类型、不可用处置 | 已消费；Fake/Controlled 不越过 profile |
| current `03/04/05/06` | 提供字段、状态、source、evidence、VETO 和 no-write 真相源 | 已读取；历史材料不进入 current 结论 |

## 3. SOP 问题回答

1. **需要先做哪些 Spike。** 只对会改变 boundary、gate、evidence provenance、配置装配或设计闭环的高风险 seam 做 Spike；普通实现细节留给对应 boundary。
2. **哪些风险会阻塞阶段。** 目标仓/core dependency、设计字段/DTO/state/port/source 闭环、redaction、truth ownership、dependency boundary、report provenance 和 VETO redline 都会阻塞对应阶段。
3. **哪些待确认项影响提交或验收。** target workspace reality、profile/env binding、affected 的 owner/source closure、真实 runner/lane、release `run_id`、review 责任和风险接受角色会影响提交或送验门禁。
4. **Spike 必须输出什么。** 输出必须是 dry-run report、mapping review、fixture/contract checklist、negative corpus 或可执行静态检查记录；不能只写口头结论。
5. **风险如何截止。** 每项风险绑定 phase、boundary、gate 和明确的 `deadline_or_trigger`；没有截止点的“后续确认”不合格。
6. **何时回写上游。** 只要发现正式字段、DTO、state、source map、version、marker、report ref、config binding 或 phase boundary 不可 1:1 落码，就暂停并回写对应真相源；实现 agent 不得自行补设。

## 4. 当前材料问题诊断与历史处置

| 材料/问题 | 诊断 | current 处理 |
|---|---|---|
| 旧正式 `07-实施计划.md` | 只有粗粒度实施摘要，缺少 12 项 affected、现实状态和可执行截止点 | `historical_material`；由 Step 13 重建，不在本 Step 追加 |
| 旧 Step 09~13 | 旧编号/阶段描述与 current 16 boundary、3 profile、9 suite 不完全一致 | `historical_material`；全部重写 |
| 旧 implementation ledger/boundary | 把 planned design 和 implementation current 混在一起，且可能含未来事实 | Step 13 统一重建；当前不把其状态当 truth |
| README / 旧性能与产品名 | 可能含 TimescaleDB、Grafana、OTel、P95 或具体外部产品假设 | 只作历史冲突索引；不进入 Spike 结论或 P0 gate |
| 目标实现仓 | 本机不存在 | 记录为 `RISK-OBS-09-001`；只允许 PH-01/`commit-01-a` 处理，不能在设计仓实现 |

## 5. 设计取舍

| 议题 | 采用 | 不采用 | 原因 |
|---|---|---|---|
| Spike 数量 | 只保留影响 design closure、boundary、gate 或 provenance 的 10 项 | 为每个对象/函数单独建 Spike | 避免 Spike 取代实施计划 |
| affected 处置 | 以 open/controlled/conditional negative surface 进入 boundary | 用“风险已接受”换取 positive capability | affected 仍是上游/下游闭环条件，不是本项目可自授权限 |
| 外部系统不确定性 | 先固定 typed seam、availability 和 same-token 规则 | 先选具体产品或写 provider-specific DTO | 保持 product-neutral 和 truth ownership |
| 性能与容量 | 只做测量/记录入口，未冻结阈值保持 not_evaluated | 继承旧 P95、retention days、event count | 防止历史数字伪装成 current NFR |
| release 证据 | 先证明 generator 不会静态补 pass | 用设计表、latest 或跨 run 拼接 | evidence 必须从同 run raw materialize |

## 6. 结构化中间产物

### 6.1 Spike 表

| 编号 | Spike | 影响阶段 | 影响 boundary/gate | 必须输出 | 截止点 | 未完成处置 |
|---|---|---|---|---|---|---|
| `SP-OBS-09-001` | target workspace bootstrap dry-run：核验目标仓路径、workspace member、7 crate 命名和 only-core candidate | PH-01 | `commit-01-a` / `GATE-OBS-01` | repo/worktree/toolchain/dependency checklist；不填 build pass | `commit-01-a` 开工前 | `blocked`；不得进入 PH-02 |
| `SP-OBS-09-002` | strict config/profile assembly dry-run：核验 3 profile、6 lane、61 ENV、13-stage complete-or-error 的 parser 输入 | PH-01/07 | `commit-01-b`,`07-a` / `GATE-OBS-07` | valid/invalid candidate matrix 和 fail-closed report | `commit-01-b` 提交前 | 回写 `04` 或 `03`；不得 fallback |
| `SP-OBS-09-003` | redaction-before-serialization corpus：覆盖 log、metric、trace、audit、evidence、report 和 error 输出 | PH-03~08 | `03-a`,`04-a`,`05-a`,`07-b`,`08-a` / `GATE-OBS-08` | forbidden-body corpus、scanner input contract、finding format | 首个相关 boundary 提交前，PH-08 再审 | hard blocker/VF，不得风险接受 |
| `SP-OBS-09-004` | correlation identity propagation dry-run：核验 correlation id、trace parent、audit/evidence linkage 和 report handoff 的同一关系 | PH-03~06 | `03-a`,`04-b`,`06-a` / `GATE-OBS-03/09` | typed relation map、missing/ambiguous fixture list | `commit-03-a` 开工前 | 回写 `03`；禁止字符串推导或空值补齐 |
| `SP-OBS-09-005` | Query visibility/freshness dry-run：核验 14 Query 的 source、read fence、absence、stale/degraded precedence | PH-04/05 | `04-b`,`05-b` / `GATE-OBS-03/09` | per-query source/failure matrix、zero-write checklist | `commit-05-b` 开工前 | blocked；不得把 miss 变 empty 或触发 rebuild |
| `SP-OBS-09-006` | inbound affected projection stale dry-run：核验 Consumer 到受影响 read/evidence views 的有限映射 | PH-03~05 | `03-b`,`04-b`,`05-b` / `GATE-OBS-05/09` | affected-view mapping、fixture list、no-broad-scan check | `commit-05-b` 开工前 | affected 保持 controlled；禁止实现侧猜测 |
| `SP-OBS-09-007` | outbox/event snapshot source dry-run：核验 12 Event 的 committed source、digest、cursor、binding 和 publication marker | PH-04~07 | `04-a`,`04-b`,`05-a`,`06-b` / `GATE-OBS-04/09` | event source matrix、snapshot constructor checklist | `commit-06-b` 开工前 | 回写 `03`；禁止从 current truth 重建 payload |
| `SP-OBS-09-008` | UoW/recovery/commit-unknown probe dry-run：核验 stage、cursor、append、outbox、result、completion 的顺序和 recovery owner | PH-03~06 | `03-a`,`04-a`,`06-b` / `GATE-OBS-03/04/06` | exact-order checklist、rollback/unknown fixture matrix | `commit-06-b` 开工前 | blocker；禁止 Clone/reload/默认 action |
| `SP-OBS-09-009` | external phase same-token dry-run：核验 prepare/call/finalize、intent、binding、unknown probe 和 no-blind-retry | PH-06/07 | `06-b`,`07-a` / `GATE-OBS-06/07` | phase relation matrix、controlled outcome fixture | `commit-07-a` 开工前 | `blocked/conditional`；不更换 token/target |
| `SP-OBS-09-010` | report/evidence generator dry-run：核验 same-run raw -> report -> candidate handoff，且不产生 alias/verdict/signoff | PH-08 | `08-a`,`08-b` / `GATE-OBS-10~12` | negative report-audit、manifest join checklist、review input shell | `commit-08-a` 提交前 | release gate blocked；不生成 static pass |

### 6.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | owner/责任 | 处理方式 | 截止点 | 触发后状态 |
|---|---|---|---|---|---|---|---|
| `RISK-OBS-09-001` | blocker | 目标实现仓不存在，无法执行 workspace/bootstrap | PH-01 | 实施负责人；设计者复核 | 仅在目标仓中由 `commit-01-a` 确认/创建并记录 dirty baseline | `commit-01-a` 开工前 | `blocked` |
| `RISK-OBS-09-002` | blocker | `core-contracts` path、package、crate 或 public type 与 current 03 不匹配 | PH-01~02 | 实施负责人 + core owner | 停止；记录差异，回写 `03/07` 或上游；禁止 vendor/shadow type | `commit-01-a` 开工前 | `blocked` |
| `RISK-OBS-09-003` | blocker | 字段、DTO、state、port、source map、version、marker 或 result surface 无法 1:1 构造 | 受影响 boundary | 设计者 | 写出文件/章节/影响范围，回写 `03/04/05/06/07`，固定新 baseline 后重核 | 对应 boundary 开工前 | `wait_design` |
| `RISK-OBS-09-004` | blocker | redaction、body-free 或 secret boundary 出现泄漏 | PH-03~08 | 安全/架构负责人 | 保留 finding/raw；修复真相源与 scanner；命中 `VF-OBS-002/003` 不得风险接受 | 首个相关 gate 前 | `blocked` |
| `RISK-OBS-09-005` | blocker | Observability projection/query/job/handoff 取得 writer capability 或反写业务 truth | PH-04~07 | 架构负责人 | no-write spy/static scan；回写 owner/capability；命中 `VF-OBS-004/005` 停止 | 对应 boundary 提交前 | `blocked` |
| `RISK-OBS-09-006` | blocker | non-core sibling 被加入 Cargo compile dependency，或出现 shadow DTO | PH-01~07 | 架构/实现负责人 | 删除越界依赖并回写架构；仅保留 core path，其他用 event/ref/adapter | 每次 manifest 变更 | `blocked` |
| `RISK-OBS-09-007` | risk | fake/controlled implementation 绕过正式 UoW、idempotency、outbox、report 或 failure 语义 | PH-02~07 | 各 boundary owner | fake/durable parity checks；失败保留 typed status | 对应 fake boundary 提交前 | `conditional` 或 `blocked` |
| `RISK-OBS-09-008` | affected | I05 schema/producer binding、Consumer completion 或 outbox surface 未闭合 | PH-03/04/07/08 | 受影响上游 owner + observability owner | 只实现 pre-parse/controlled/disabled negative surface；不得 positive | `commit-03-b`,`07-a`,`08-a` | `open_controlled` |
| `RISK-OBS-09-009` | affected | UoW/recovery、H13、external phase/retry、job report ref/secondary owner 未闭合 | PH-02~07 | 对应上游 owner + 设计者 | 绑定 exact affected；缺口回写，不做风险接受替代 | 各 affected 主 boundary | `open/controlled/conditional` |
| `RISK-OBS-09-010` | blocker | report/evidence index 使用 `latest`、跨 run 拼接、静态 passed 或真实 alias | PH-08 | 测试/报告负责人 | report audit 返回 nonzero；失败材料保留；不进入 handoff | `commit-08-a/b` | `blocked` |
| `RISK-OBS-09-011` | reality risk | CI/INT/RuntimeLike lane、runner 或 durable store 未建立 | PH-01/06/08 | 实施/环境负责人 | ISO 可独立设计/执行；INT/RT 保持 blocked/not_run/not_evaluated | 对应 lane 开始前 | `not_run`/`not_evaluated` |
| `RISK-OBS-09-012` | risk | 历史 README、旧性能数值或具体产品假设被重新引入 current | 全阶段 | 设计者 | 标为 historical；回写发生位置；无来源阈值只记录 candidate | 每次设计/实现 review | `blocked` if P0 impact |

### 6.3 12 项 inherited affected register

| affected | current 状态 | 主边界/gate | 可做的控制面 | 关闭条件 | 禁止声明 |
|---|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | `03-b`,`08-a` / GATE-OBS-05/10 | pre-parse reject、controlled fixture、blocked report | 上游 payload/schema owner 具备 exact binding 和测试证明 | I05 positive landing/completion |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | `03-b`,`07-a`,`08-a` / GATE-OBS-05/09 | finite producer catalog、slot unavailable | producer/event binding 可定位且无 broad subscription | 任意 event 任选绑定 |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | `06-b`,`08-b` / GATE-OBS-06/12 | approved scope、J06 Blocked/manual、gap/report projection | 上游 H13 per-target contract 完成并经 affected review | H13 Completed/result |
| `R06-F-AFFECT-UOW-01` | `open_controlled_downstream` | `03-a`,`04-a`,`06-b` / GATE-OBS-03/04/06 | exact order、rollback、commit-unknown probe | 所有受影响 flow 的 implementation proof 通过 | Clone/reload/partial success |
| `S08-RECOVERY-CLASS-OWNER-01` | `open_internal_affected` | `03-a`,`06-b` / GATE-OBS-03/06 | 消费既有 recovery class；缺失则 blocked | 唯一 owner、mapper、terminal/retry semantics 完整 | 新建 default retry enum |
| `R07-EXTERNAL-PHASE-LINK-01` | `covered_conditional` | `06-b`,`07-a` / GATE-OBS-06/07 | same token/binding controlled phase | prepare/call/finalize 与 intent link 可证明 | 换 token/target |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `covered_conditional` | `06-b` / GATE-OBS-06 | unknown probe、manual、known-success finalize-only | retry accounting owner 与真实 adapter 证据完整 | blind retry/new intent |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `open_internal_affected` | `03-b`,`04-a` / GATE-OBS-03/04 | accepted snapshot、conditional completion、no-write | per-consumer outbox surface/owner/atomicity 完整 | 默认 ack/outbox |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `open_internal_affected` | `03-b`,`06-b` / GATE-OBS-05/06 | unknown 保留、redelivery exact replay | completion mapper 能表达 no-completion | default ack/retry/dead-letter |
| `S08-JOB-REPORT-REF-OWNER-01` | `open_internal_affected` | `06-a`,`06-b` / GATE-OBS-02/06 | missing/wrong ref fail closed、immutable fold | canonical owner/mint/rehydrate 完整 | alias/String fallback |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `open_internal_affected` | `02-a`,`06-a` / GATE-OBS-02/09 | declaration/use/static owner scan | 全部 secondary type 唯一 owner | duplicate alias/wrapper |
| `03-RPR-S09-PER-FLOW` | `design_record_closed_implementation_open` | all,重点 `03-a/04-a/05-b/06-b` / GATE-OBS-02~11 | 60 exact protocol per-flow implementation checklist | 每个 flow 的 code/test/evidence proof 完整 | family summary 代替逐 flow proof |

### 6.4 待确认事项表

| 编号 | 类型 | 事项 | 影响阶段/boundary | owner | 截止点 | 未关闭处理 |
|---|---|---|---|---|---|---|
| `OQ-OBS-09-001` | open-question | 目标仓创建者、初始化方式和 dirty baseline 责任 | PH-01 / `01-a` | 实施负责人 | `01-a` 开工前 | blocker |
| `OQ-OBS-09-002` | open-question | core-contracts 实际 package/crate/type 与 03 contract 的匹配 | PH-01/02 / `01-a` | core/架构负责人 | `01-a` 提交前 | blocker |
| `OQ-OBS-09-003` | open-question | 61 ENV 与 three profile/entry slice 的最终 binding 是否逐项可构造 | PH-01/07 / `01-b`,`07-a` | 配置/架构负责人 | `01-b` 提交前 | 回写 `04`，不得默认值补齐 |
| `OQ-OBS-09-004` | open-question | 12 affected 的上游 owner、关闭证据和 deadline 是否已被相关项目确认 | PH-03~07 | 受影响项目 owner | 各主 boundary 开工前 | 保持 open/controlled，不能 positive |
| `OQ-OBS-09-005` | open-question | 真实 CI/INT/RuntimeLike runner、store、bus、artifact provider 何时可用 | PH-06/08 | 环境负责人 | 对应 lane 开始前 | blocked/not_run/not_evaluated |
| `OQ-OBS-09-006` | open-question | release run_id、reviewer、acceptance owner 的真实身份和授权 | PH-08 / `08-a/b` | 验收负责人 | release handoff 前 | draft/open，不得 signoff |
| `OQ-OBS-09-007` | open-question | 是否有新的性能/容量/retention policy 来源可冻结 | PH-05/06/08 | 产品/架构负责人 | NFR review 前 | 保持 candidate/not_evaluated |
| `OQ-OBS-09-008` | open-question | 外部 report/archive/export target 是否被正式选择 | PH-06/07 | 集成负责人 | `06-b` 开工前 | product-neutral unavailable/manual |

### 6.5 需要回写真相源的触发

| 触发条件 | 回写目标 | 禁止处理 |
|---|---|---|
| Command/Consumer/Job input 无法构造正式 factory 或 result | `03-详细设计.md` | 实现侧新增字段、默认 state 或 generic JSON |
| Query marker、visibility、freshness 或 affected source 无正式 owner | `03-详细设计.md` | 从 row existence、时间、字符串或首个失败推导 |
| config profile、ENV、entry assignment 不一致 | `04-配置设计.md`，必要时 `03` | 临时 flag、silent fallback、绕过 validation |
| TC/DS/suite/artifact/report join 无法从 `05` 追溯 | `05-测试方案.md` | 设计表补 pass、wildcard、跨 run 拼接 |
| AC/VF/EVG 状态或 reviewer authority 不闭合 | `06-验收标准.md` | Agent 代签、静态 verdict、风险接受替代 VETO |
| phase/boundary、allowed scope、ledger 或 recovery 规则不一致 | `07-实施计划.md` / 本 Step | 实现者自行改 phase 或提交边界 |

### 6.6 Spike/风险停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Spike 是否均有明确输出和截止点 | pass | `SP-OBS-09-001~010` 均绑定 output/deadline |
| blocker 是否绑定 phase/boundary/gate | pass | 目标仓、core、design closure、redaction、truth、dependency、evidence 均可定位 |
| inherited affected 是否被错误关闭 | no | 12 项保留原状态或受控状态 |
| open question 是否长期悬空 | no | 每项有 owner 和截止点；未关闭即 blocker/conditional |
| P0 与 P1/P2 是否混淆 | pass | RT、具体产品和未冻结阈值不转 P0 pass |
| 是否引入新 upstream blocker | none | 现有缺口均为已知 reality/affected，不新增上游冲突 |

### 6.7 跨风险审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| workspace/core dependency 风险 | pass_with_blocker | 由 `SP/RISK-OBS-09-001/002` 管控 |
| schema/owner/state/UoW 可落码风险 | pass_with_affected_open | 由 `RISK-OBS-09-003` 和 12 项 register 管控 |
| log/metric/trace/audit/evidence redaction | pass_with_hard_block | `SP/RISK-OBS-09-003`、GATE-OBS-08 |
| no-write/truth ownership | pass_with_hard_block | `RISK-OBS-09-005`、VF-OBS-004/005 |
| external phase/recovery/consumer completion | controlled | 不以 fake positive 关闭 |
| report/evidence provenance | pass_with_hard_block | `SP-OBS-09-010`、GATE-OBS-10~12 |
| historical material/product/performance contamination | pass | `RISK-OBS-09-012` |

## 7. 回填草稿

正式 `07` §9 应保留 10 个 Spike、12 个主要实施风险、12 项 inherited affected、8 个待确认事项、回写触发和未完成状态规则。正文可压缩解释，但必须保留每项的影响 boundary、owner、截止点和禁止声明；不得将 Spike 结果、风险接受、真实 run 或 evidence 写成已发生事实。

## 8. Step 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| Spike 有明确输出 | pass |
| 风险均绑定 phase/boundary/gate/截止点 | pass |
| blocker 与 residual/future 风险已区分 | pass |
| 12 项 inherited affected 已逐项绑定且未关闭 | pass |
| 回写目标和禁止的实现侧补设行为明确 | pass |
| 无真实 commit/run/evidence/verdict/signoff 被伪造 | pass |
| new upstream blocker | none |
| gate_status | `pass_with_affected_and_reality_preconditions` |
| next_allowed_action | `continue_to_step_10` |

## 9. 参考

- `standards/document/实施计划讨论流程_SOP.md` Step 9
- `standards/document/实施计划书写规范.md` §5.9
- `standards/document/设计真相源闭环与可落码性标准.md` §九
- `standards/document/代码实施台账与门禁规范.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`
