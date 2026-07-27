# L3-capability-hub 07 实施计划 Step 2：明确实施目标、范围和非范围

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/实施计划书写规范.md` §2
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §2
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确实施目标、范围和非范围 |
| 当前状态 | completed_continuous_execution |
| 输入 | Step 1；active formal `00~06`；DDD implementation handoff |
| 正式 `07` | 尚未创建；Step 13 前保持 absent |
| unresolved upstream blocker | `0` |
| 当前 implementation prerequisite | target repository still not established |
| 下一动作 | 进入 Step 3，收稳前置条件、必读文档、仓命名和永久记忆种子 |

## 2. SOP 问题回答

### 2.1 最小可交付结果

最小可交付结果不是单个注册接口或只读目录，而是一个可按正式 `03` 逐项落码、按正式 `05` 逐项验证、按正式 `06` 逐项裁决的 capability access truth center。它必须能够以稳定 identity 锚定外部 MCP/A2A/API 能力，维护 registry、adapter descriptor、治理结果接缝、method-library body-free relation、formal exposure/visibility、traceability/impact 及受控消费边界，并对重复、冲突、不可见、依赖不可用、派生过期和外部协作失败给出设计规定的 typed outcome。

### 2.2 必须覆盖的需求和验收范围

| 范围层 | 必须覆盖 | 依据 | 实施含义 |
|---|---|---|---|
| 核心闭环 | `C-CH-1..C-CH-5` | `00` §7；`06` §5 | identity、registry、descriptor、治理/方法接缝、受控 exposure 必须形成一条可验证主线 |
| 功能需求 | `FR-CH-001..FR-CH-016` | `00` §9；`06` §5 | 16 个正式功能能力逐项映射到 command/query/inbound/outbound/job 或 foundation cut |
| 业务规则 | `BR-CH-001..BR-CH-037` | `00` §10；`06` §6~§8 | 规则进入 domain guard、ownership、redaction、consistency 和 dependency gate |
| 非功能需求 | `NFR-CH-001..NFR-CH-020` | `00` §13；`06` §9 | 结构性性能、可用性、安全、追溯、幂等/一致性和观测门禁必须可执行；无 active numeric threshold 时不伪造数值通过 |
| 验收项 | `AC-CH-001..AC-CH-037` | `00` §14；`06` §5~§10 | 37 个 AC 必须有 exact TC/DS/EV consumer；实施计划不填写真实 verdict |
| 一票否决 | `VF-CH-001..VF-CH-013` 及过程 VETO | `00` §14；`06` §11 | 每个 boundary 前置规避，任何 VETO 不得用风险接受覆盖 |

### 2.3 详细设计必须落地的实现面

| 实现面 | 正式设计基线 | 本轮处理 |
|---|---|---|
| workspace/module | `03` §4~§5；7 member / 7 module | 按既定 contracts、domain、application、infra、api、worker、jobs 组织；不按 capability 主题随意增 crate |
| domain/object | `03` §6；43 objects + 7 helpers | 每个 boundary 只实现已命名对象、字段、variant、factory 和 invariant；缺字段来源即停审 |
| public protocol | `03` §8；250 public types | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job 保持 exact inventory，不使用 generic execute/query/event/job DTO |
| application | `03` §7、§9、§11~§13 | 36 Port、22 repository trait / 110 methods、83 flow、22 TX、UoW/idempotency/replay/concurrency 按 owning phase 落地 |
| infrastructure/binding | `03` §13~§14；`04` 全文 | single persistence authority、27 local/base + 9 external binding、Stage 0~7、strict config source 和 fake parity；具体产品须受控回开 |
| entry/collaboration | `03` §13~§15 | API/Worker/Jobs 只拥有 entry lifecycle；事件协作、source ref、capture、handoff 不反写 core truth |
| tests/evidence | `05` 全文；`06` §10~§14 | 189 contract、10 suites、5 gates、9 checks、4 builders、固定 run roots；执行期实例留给实现/验收流程 |

## 3. 实施目标表

| 目标 ID | 实施目标 | 完成方向 | 主要来源 |
|---|---|---|---|
| GOAL-CH-01 | 建立可编译的七 member workspace 和依赖裁剪 | workspace、package/crate 命名、唯一 `L0-core` sibling path candidate、15 条允许本仓 edge 通过静态检查 | `03` §4、§13.11；`00/01` dependency boundary |
| GOAL-CH-02 | 建立 public contracts 与 canonical codec | refs、metadata、commands、queries、events、jobs、views、errors、canonical bytes 和 Rustdoc 完整 | `03` §6、§8、§13.10 |
| GOAL-CH-03 | 建立 capability identity / registry / descriptor truth | identity、registry、descriptor、风险/约束摘要、生命周期和 visibility guard 的 domain truth 与 accepted command 主链 | `00` C-CH-1~3；`03` §6、§9 |
| GOAL-CH-04 | 建立治理接缝与 method relation | governance result ref/seam、access review separation、method asset body-free relation、typed inbound handling | `00` C-CH-4；`03` §6、§9；相邻 `L1-governance`/`L3-method-library` |
| GOAL-CH-05 | 建立 formal exposure 与受控消费表达 | exposure、visibility/applicability、consumer view、runtime/tools/SDK server boundary 和不可见/降级语义 | `00` C-CH-5；`03` Q/C flows；`06` AC-CH-019/020 |
| GOAL-CH-06 | 建立 traceability、impact 与变化协作 | change/trace/impact truth、body-free capture、Outbound A/B/C、consumer feedback 和 no-reverse-write | `03` C22~C26、O01~O10；`06` §7/§8 |
| GOAL-CH-07 | 建立 query、derived material 和 maintenance jobs | 33 Query no-write、派生快照、reconciliation/export/discovery summaries、8 Job plan/target/final lifecycle | `03` Q24~Q33、J01~J08 |
| GOAL-CH-08 | 建立运行绑定、配置、测试和移交门禁 | strict config、Stage 0~7、fake parity、TC/DS/EV、report/evidence handoff、VETO prevention | `04`；`05`；`06`；代码实施台账规范 |

## 4. P0 / P1 / P2 范围分层

| 层级 | 本轮定位 | 包含 | 不得误读为 |
|---|---|---|---|
| P0 semantic | 必须实施并可判定 | identity、registry、descriptor、governance/method relation、exposure/visibility、trace/impact、exact protocols/states/TX、strict config and ownership redlines | 真实外部产品已接通或最终验收已通过 |
| P0 controlled seam | 为 P0 语义提供受控边界 | fake/controlled/disabled external sources、body-free refs、event candidate/capture、entry-neutral handoff、deterministic fake parity | fake 结果等同生产服务可用性 |
| P1 selected | 由 immutable manifest 选择才实施 | concrete external adapter、selected transport/TLS/source/route、跨仓 integration | P0 缺失可被 P1 补偿 |
| R4 release | 真实交付后再执行 | release smoke、完整 evidence/report/handoff/review | 设计期可填写 release result |
| P2 operations/future | 本轮不阻塞 | dashboard、retention、capacity、runbook、vendor-specific optimization、numeric SLO | 当前需求必须交付 |

## 5. 非范围与防误入

| 非范围 | 所属真相源/后续阶段 | 防误入规则 |
|---|---|---|
| runtime execution、tools execution、外部调用结果、运行生命周期 | `L2-runtime` / `L2-tools` | Hub 只提供 formal exposure/ref/view；不得实现调用编排、allow/deny enforcement 或结果正文 |
| governance approval、Policy effective fact、shared_rules | `L1-governance` | 只实现 seam/ref/允许摘要和职责分离；不得生成 approval 或 policy truth |
| method body、source、定义版本、发布语义 | `L3-method-library` | 只实现 body-free relation/ref/state；不得复制正文或生命周期 |
| provider route、quota、cost、billing、failover、retry、secret/KMS/Vault | provider/finance/security infrastructure | descriptor 只能保存允许摘要/ref；不做 provider runtime 或密钥平台 |
| SDK client、language package、client cache | `L0-sdk` | 只实现 server exposure boundary 和 consumer ref/view |
| marketplace listing、transaction、pricing、purchase、fulfillment | `L6-marketplace` | 只允许只读 ecosystem ref/summary；不得拥有 listing truth |
| observability backend、log/metric/trace store、alert platform | `L4-observability` | 只保留 private redacted observation cut 或 safe ref；不建 observer Port/ledger/business state |
| production deployment、容量、硬 SLO、真实 vendor | P1/P2/后续 ADR | 未由 formal 04 选择前不写入 P0 phase 或 boundary |
| 真实 implementation commit、run、artifact、report、evidence、verdict、signoff | 实施/验收执行阶段 | 07 只定义命令合同、路径和字段，不生成事实 |

## 6. P1/P2 防误入审计

| 容易误入项 | 允许的设计表达 | 触发处理 |
|---|---|---|
| MCP/A2A/API 真实 transport | external Port、typed unavailable、controlled fake、future binding | 具体 transport/product/type leakage 时回开 `04`/DDD owning Step |
| durable DB/broker/secret/observability product | product-neutral Port/binding slot | 未选产品不得进入 Cargo、public DTO 或正式 config key |
| search/browse/reconciliation | derived material/query/job，zero core write | 任何反写或自动修复命中 VETO-CH-007/010 |
| SDK exposure enhancement | server boundary/ref/view | client/cache/package 进入 Hub 命中 VF-CH-007/012 |
| marketplace/ecosystem discovery | read-only ref/summary | listing/transaction truth 进入 Hub 命中 VF-CH-011 |
| numeric performance/SLO | sample/report contract without active threshold | 不写 pass/fail；受控 reopen 后才可增加 threshold |

## 7. 回填草稿

正式 `07-实施计划.md` §2 应收口为：本轮实施交付 capability access truth center，覆盖 `C-CH-1..C-CH-5`、`FR-CH-001..016`、`BR-CH-001..037`、`NFR-CH-001..020`、`AC-CH-001..037` 和 `VF-CH-001..013`，并按 formal `03/04/05/06` 落地七 member、250 public type、83 flow、24/111/638 state、22 TX、strict config、fake parity、测试证据和验收 handoff 合同。所有外围、真实产品、运行执行、治理审批、方法正文、provider/secret/cost、SDK client、marketplace、observability backend 和最终执行事实均明确排除或后置。

## 8. 待确认事项

| 事项 | 当前状态 | 处理 |
|---|---|---|
| target repository creation/ownership | 未确认 | Step 3 preflight；不影响当前范围设计 |
| concrete product binding | 未选择 | Step 8 + formal 04 controlled reopen |
| P1 selected manifest | 未选择 | Step 8/9/12 定义字段，不生成实例 |
| numeric thresholds | 无 active source | 保持 not_evaluated；不得回流旧数字 |

## 9. 进入下一步条件

| 条件 | 结果 |
|---|---|
| P0 core scope is traceable to active requirements | pass |
| P1/P2 and non-scope explicitly separated | pass |
| all 13 VF retained as non-waivable implementation redlines | pass |
| no README/old-object scope leakage | pass |
| no implementation/test/evidence fact fabricated | pass |
| next | `enter_07_step_03_prerequisites_reading` |
