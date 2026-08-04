# L4-observability 06-验收标准 Step 06：定义数据边界与架构红线验收

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `06 / 定义数据边界与架构红线验收` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `truth_ownership_data_landing_dependency_redlines` |
| formal_document_write | `not_allowed_until_step_15` |
| real execution | `not_run`;本 Step 只定义红线 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §8 |
| gate_status | `pass_for_data_arch_redline_design` |
| next_allowed_action | `start_current_06_step_07` |
| commit | 不需要；用户未要求提交 |

本文件替换旧模板。旧文件列出的 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`
等名称与 current `03` 不一致，并把运行 telemetry backend 与 durable observation truth 混为一谈，全部降级为
`historical_material`。

## 1. 本步目标、输入与计划

### 1.1 目标

把 current architecture、data ownership、logical store、serialization boundary、only-core dependency 和 product-neutral
规则变成可检查红线。Step 06 关注“允许落什么、禁止落什么、谁可写、依赖往哪走”；协议行为和 UoW 细节分别留给
Step 07/08，但红线触发影响在此先固定。

### 1.2 输入

| 输入 | 使用内容 |
|---|---|
| 验收 SOP Step 06 / 书写规范 §5.6 | 数据边界、架构红线和一票否决关系 |
| Step 01~05 | P0/Forbidden 范围、baseline、31 AC 功能门禁 |
| current `00` §10~§14 | BR、DO、NFR、AC 019~031、VF 002~010 |
| current `01/02` | observation truth owner、依赖方向、跨仓 seam |
| current `03` §3~§5、§10、§13~§14 | crate boundary、logical store、port/UoW、binding、redaction/no-write |
| current `05` | OWN/TRUTH/NW/RED/EVD/DEP/HIST/EXT/RET TC 与三项 checks |

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 识别 owned / snapshot / reference / forbidden 四类数据 | §4 | done |
| 定义 logical landing 和合法 writer | §5 | done |
| 定义 dependency / product / historical redline | §6 | done |
| 完成红线停审、回填草稿和 gate | §7~§11 | done |

## 2. SOP 问题回答

| 问题 | Current 回答 |
|---|---|
| 哪些数据不得保存 | raw request/event/log/metric/trace/prompt/provider body、secret/credential、source audit/evidence/artifact/governance/identity/runtime/archive body、外部产品配置正文、真实 verdict/signoff。 |
| 哪些下游不得反写真相 | Query、diagnostic、projection/rebuild/replay、report/handoff/export、telemetry、consumer feedback、external product 均不得写 source business truth 或相邻仓 truth。 |
| 哪些 projection/cache 不得反写真相 | 六类 public projection、diagnostic composite、rollup、reference snapshot、peripheral view、progress、gap/degraded 都仅为 local derived/marker truth。 |
| P1 能力如何不污染 P0 | adapter/store/transport/product 只能通过 application-owned port 和 typed binding；Disabled/Unavailable/Degraded 不改变核心 owner、schema、状态或 pass 条件。 |
| 红线失败是否一票否决 | body/secret、external truth ownership、source write、active cleanup、non-core dependency、product/historical hard truth 对应 VF，均不可风险接受。 |

## 3. 问题诊断与裁决取舍

| 方案 / 旧写法 | 结论 | 理由 |
|---|---|---|
| 将 observability 当日志/指标/trace 正文仓 | 拒绝 | current owner 只保存 safe observation fact/summary/ref，不保存 raw telemetry body |
| 对 forbidden body 求 hash 后入仓 | 拒绝 | digest 不能洗白正文；canonical digest material 本身必须 body-free |
| 保存外部 truth snapshot 后允许本仓修正 | 拒绝 | snapshot 只能表达安全观察，不可变成第二 writer |
| 将 Bus 或 sibling 仓加入 Cargo dependency | 拒绝 | compile-time 唯一 upstream 是 `L0-core/core-contracts` |
| vendor SDK / backend 作为 truth source | 拒绝 | 只能是 runtime adapter/product seam，且 Disabled/Unavailable 可解释 |
| telemetry sink ack 当 accepted/published/delivered | 拒绝 | sink 是 out-of-band emission，不是 durable state authority |
| logical store 名当物理表强制实现 | 拒绝 | 只验 owner、key/version/append/atomicity semantic，不绑定 DB 产品 |

## 4. 数据归属验收矩阵

### 4.1 Owned observation truth

| Redline | Owned object family | 合法内容 / writer | 通过条件 | 失败条件 | Evidence |
|---|---|---|---|---|---|
| `DR-OBS-001` | receipt / safety | `ObservationReceipt`,`SafetyDisposition`; intake Command/Consumer | source ref、purpose、state、redaction/safe summary 与 native record 同 UoW；无 body | raw material、无 owner state、entry/query 直写 repository | `ING-*`,`RED-*`,`OWN-001~003`; service/repository reports |
| `DR-OBS-002` | correlation / signal / rollup | `CorrelationContext`,`SafeSignal`,`SignalRollupWindow`; formal Command/Consumer/Job | typed source/trace/summary/state/cursor；rollup 只读 stored signal | raw log/metric/trace、opaque trace 推导业务关系、raw source rollup | `COR-*`,`SIG-*`,`TRUTH-*` |
| `DR-OBS-003` | audit / evidence | `AuditProjection`,`EvidenceLinkage`; audit/evidence Command/Consumer | projection / linkage / digest / purpose / visibility body-free、append-only | source audit/evidence body、外部 verdict、同 relation 多义 | `AUD-*`,`EVD-*`,`OWN-*` |
| `DR-OBS-004` | handoff / hint | immutable input、`ReportHandoffRecord`,`AuthenticityHint`; C07/C08/J07 | complete input immutable；readiness/hint/phase可追溯且无 verdict/signoff/run alias | ref-only input、交接正文、Delivered=验收通过 | `RPT-*`,`AUT-*`,`TRUTH-002` |
| `DR-OBS-005` | retention / replay / violation / gap | marker/protection/scope/violation/gap/degraded；formal guard flows | local state、typed reason/ref、history；release不删除 source；violation save failure仍阻断 write | active cleanup、source repair、no-write marker 失败后放行 | `RET-*`,`REB-*`,`NW-*` |
| `DR-OBS-006` | reference / maintenance | body-free snapshot、maintenance/replay/rollup coordination | source version、safe summary、progress/fence/target relation显式；只写 derived state | external body、source lifecycle truth、false Fresh、Query repair | `DEG-*`,`REB-*`,`QRY-*` |
| `DR-OBS-007` | peripheral / export | local preparation/delivery marker；Command/Job/feedback Consumer | product-neutral consumer/view/ref、typed local outcome；外部调用有 intent/binding/token | external audit/consumer truth、product-specific body、Blocked still call | `EXT-*`,`RPT-*`,`UOW-007~008` |

### 4.2 Safe snapshot / projection

| Redline | Surface | 通过条件 | 失败条件 | Evidence |
|---|---|---|---|---|
| `DR-OBS-008` | six public projection families | body、lookup、dependency、freshness、marker 在一个 atomic composite；stable identity replacement | partial bundle、lookup/body分叉、old stale 被清除、projection 反写 owner | `DEG-003~005`,`QRY-003~004`,`REB-001~004` |
| `DR-OBS-009` | diagnostic composite | view/scope/summary/current pointer/dual watermark/progress relation 一致 | Query 在线补 summary/progress、missing relation 默认 Fresh | `DIA-001~002`,`DEG-004` |
| `DR-OBS-010` | immutable outbox snapshot | event/outbox/snapshot/subject/cursor/schema/binding/digest parity；publisher只读 stored bytes | current owner 回查重建 payload、换 binding/token、payload/body泄漏 | `UOW-006~007`,`AUD-004`,`RET-004` |
| `DR-OBS-011` | idempotency result / Job plan/report/intent | reservation/result compatible；plan/config/work set immutable；report lossless fold；intent先提交 | current truth 重建 result、resume relist、report可编辑、external call 无 intent | `UOW-003~008`,`REB-003~005`,`RPT-003~004` |

### 4.3 Body-free reference / linkage

| Redline | 通过条件 | 失败条件 | Evidence |
|---|---|---|---|
| `DR-OBS-012` typed owner | `BodyFreeRef` 先验证，具名 newtype 不隐式互转；same bytes 不代表 same owner | 裸 String、alias/wrapper、owner 猜测或从 route/product 推导 | `OWN-002/004`,`COR-002`,`EVD-002`; contract/static reports |
| `DR-OBS-013` digest boundary | `RequestDigest` / `DigestSummary` 只由 canonical body-free material 构造，profile/version稳定 | 对 raw/secret/body 求 hash/base64 后保存或发 telemetry | `RED-003~004`,`EVD-001~002`,`UOW-004` |
| `DR-OBS-014` source ordering | source version 只来自 trusted producer/resolver；只能在 same namespace comparator 比较 | 用 timestamp、cursor、row version、digest 猜 Older/Newer | `DEG-005`,`UOW-005`,`COR-003` |
| `DR-OBS-015` correlation | trace/causation/correlation 只关联，不生成 actor/business relation/outcome authority | 从 span parent、route、time 或 opaque id 推导 truth | `COR-*`,`TRUTH-003`; telemetry report |

### 4.4 Forbidden lifecycle material

| Redline | Forbidden material | 扫描面 | 失败影响 |
|---|---|---|---|
| `DR-OBS-016` | raw request/event/log/metric/trace/prompt/provider/package/receipt body | DTO、store、outbox、logs/spans/metrics、raw artifacts、reports | `VF-OBS-002/003`;立即不通过 |
| `DR-OBS-017` | secret、credential、endpoint/path/topic、full sensitive ref、key/token/fence/digest 作为 telemetry label | config、error、telemetry descriptor/sample、reports | `VF-OBS-002`;立即不通过 |
| `DR-OBS-018` | evidence/artifact/governance/identity/runtime/archive/source-audit body | owned stores、snapshot、handoff/export、public output | `VF-OBS-003/004`;立即不通过 |
| `DR-OBS-019` | real run/evidence alias、passed、verdict、signoff 由 design/runtime report 自动生成 | protocol、Job report、handoff、generator/template | `VF-OBS-006`;立即不通过 |

## 5. Logical landing 与 writer capability 红线

| Landing family | 合法 writer | 禁止 writer / 行为 | 检查方式 |
|---|---|---|---|
| domain owner repositories | application façade内 accepted Command/Consumer，或对应 fenced Job | api/worker/jobs entry直连 repository/UoW；Query；telemetry emitter | module/capability graph + call spy |
| native history / lifecycle record | 与被解释 owner transition 同一 accepted UoW | generic `ErrorOccurred`、runtime log 代替 audit、异步补 history | UoW failpoint + repository snapshot |
| source membership / cursor / stale | UoW / projection adapter按 typed namespace | timestamp/version混用；owner commit后另补 index；一个 UoW 双 cursor | `UOW-001~005`, durable report |
| projection store | bounded capture 的 fenced maintenance/peripheral Job | Query、diagnostic、telemetry、external callback直接 replace | write spy + read-fence/fence cases |
| outbox | accepted owner UoW append；publisher只 CAS marker | publisher重建 payload；external failure rollback owner | snapshot digest + before/after state |
| idempotency/result | application reservation/result repository | adapter/entry补 duplicate；从 current owner 重建 result | concurrency + corruption probe |
| job plan/report/intent | staged Job start/item/finalize | resume relist/current config；external call期间长 tx；terminal report edit | plan/fence/report fold evidence |
| source / sibling truth stores | 无合法 writer | 任何 application/query/job/rebuild/replay/report/export/telemetry 写入 | fail-on-call spies + static capability scan |

## 6. 架构、依赖、产品与历史红线

| Redline | 通过条件 | 失败条件 | Evidence / report | VF |
|---|---|---|---|---|
| `AR-OBS-001` compile dependency | workspace/package graph 中 sibling compile edge 仅 `L0-core/core-contracts` | 任一 L1/L2/L3/L4 sibling path/package 或 Bus package dependency | `DEP-001`; `dependency-boundary.md` | 008 |
| `AR-OBS-002` crate direction | contracts <- domain <- application <- infra <- entry；entry只有 façade capability | cycle、domain依赖infra、entry拿 repository/UoW/raw handle | `DEP-002`,`OWN-002`,`DIA-004` | 005/008 |
| `AR-OBS-003` cross-repo seam | sibling 仅 runtime API/adapter、event collaboration、body-free ref/snapshot/handoff | 为了验 seam 引入源码依赖或共享私有 type | `DEP-001~003`,`EXT-*` | 008 |
| `AR-OBS-004` event collaboration | producer/schema/route/catalog exact binding；缺失 fail closed/no fallback | broad subscription、按 payload 重路由、未知 schema parse/write | `DEP-003`,`EVD-004`,`ING-*` | 002/008 |
| `AR-OBS-005` product neutrality | adapter family / binding typed；产品 Disabled/Unavailable 显式且不改变 owner | OTel/Prometheus/Grafana/APM/GRC/store 成为 truth/硬前置 | `EXT-001~003`,`CFG-*`,`DEP-003` | 009 |
| `AR-OBS-006` historical authority | current IDs/contracts/paths only；旧 README/文档只在 discrepancy audit | 旧 P95/SLA/path/state/profile/boundary 进入 current gate/fallback | `HIST-001~002`,`NFR-002`,`CFG-006`; report-audit | 010 |
| `AR-OBS-007` P1 isolation | optional seam 缺失仅影响自身 availability，核心 five-loop redline不变 | P1 fake/controlled output 填 P0、optional product改变 core schema/state | `CFG-003~005`,`EXT-002`,`NFR-003` | 001/009 |
| `AR-OBS-008` no truth feedback | report/handoff/export/dashboard/telemetry 只消费/反馈 local marker | feedback或 sink ack 改 audit projection/source truth | `TRUTH-001~003`,`NW-004~005`,`EXT-*` | 004/005 |

## 7. 红线停审与跨边界审计

| 审计项 | 期望 | Current 设计结果 |
|---|---:|---|
| owned data families 有 owner / writer / landing | 7/7 | pass |
| projection/snapshot/idempotency families 有 atomicity boundary | 4/4 | pass |
| reference/digest/order/correlation boundary | 4/4 | pass |
| forbidden material families | 4/4 | pass |
| architecture/dependency/product/history redlines | 8/8 | pass |
| Query / telemetry source writer | 0 | pass |
| sibling compile edge beyond core-contracts | 0 | pass_design；真实 graph 未生成 |
| external truth owner in this repo | 0 | pass |
| legacy active fallback | 0 | pass_design |
| redline 实际执行 | none | `not_run`;不冒充通过 |

## 8. Inherited affected

无新增上游 blocker。12 个 inherited affected 继续开放，尤其影响 I05 schema/binding、accepted UoW、recovery
owner、external phase、Consumer outbox/completion、Job report ref、secondary type owner 和 per-flow propagation。

本 Step 的红线处置是：缺 owner/schema/binding 时 fail closed；缺 positive source 时保持 blocked；禁止创建本地 DTO、
alias、fake positive、默认 recovery 或临时 report ref。完整 ID 继承 Step 05 §9，不在此复制第二套状态。

## 9. 正式 `06` §6 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“数据归属验收矩阵”“Logical landing 与 writer capability 红线”“架构、依赖、产品与历史红线”和“红线停审与跨边界审计”小节。

正式 §6 应保留 `DR-OBS-001~019`、landing/writer 表和 `AR-OBS-001~008`。编号只服务于本验收文档红线定位，
不替代 `VF-OBS-*`；触发对应 VF 时最终结论必须为不通过。

## 10. 待确认事项

| ID | 事项 | 状态 | 影响 |
|---|---|---|---|
| `Q-06-06-01` | 真实 implementation dependency graph / lockfile snapshot | `not_established` | 未来 `AR-OBS-001~003` 不可裁决 |
| `Q-06-06-02` | selected durable backend / physical schema | `not_selected` | 不影响 logical redline；选择后须证明 semantic parity |
| `Q-06-06-03` | selected external product adapters | `not_selected` | 当前只验 product-neutral seam，不产生产品通过结论 |

## 11. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| owned/snapshot/ref/forbidden 是否分开 | pass |
| 每条红线是否有通过、失败和 evidence | pass |
| 是否误用旧 schema / 产品 / 性能事实 | no |
| 是否把 telemetry/backend 当 durable truth | no |
| 是否允许 source truth writer 或非 core compile edge | no |
| 是否伪造真实 graph/check/result | no |
| 新 upstream blocker | none |
| `gate_status` | `pass_for_data_arch_redline_design` |
| `next_allowed_action` | `start_current_06_step_07` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 12. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 06
- `standards/document/验收标准书写规范.md` §5.6
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/00-需求文档.md` through `05-测试方案.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_05_function_gate.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_06_data_arch_redlines.md`
