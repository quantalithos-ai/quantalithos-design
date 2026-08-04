# L4-observability 07-实施计划 Step 02：明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.2
> 文档性质：设计讨论中间产物；不授权代码实现，不产生 commit、run、artifact、report、evidence、verdict 或 signoff。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 02 / 明确实施目标、范围和非范围` |
| mode | `full-restart` |
| status | `completed_current_step_02` |
| current module | `p0_scope_and_non_scope_boundary` |
| upstream input | current Step 01、current `00`、`03`、`04`、`05`、`06` |
| formal `07` | 未修改；等待 Step 13 装配 |
| new upstream blocker | `none` |
| inherited affected | 12 项继续 `open/controlled/conditional`，不由本 Step 关闭 |
| design gate | `pass_with_affected_open` |
| implementation handoff | `blocked_until_current_07_completion_and_boundary_audit` |
| next allowed action | `continue_to_step_03` |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 Step 01、需求、详细设计、配置、测试、验收输入 | 输入登记 | done | 所有输入为 current formal 或 current calibration |
| 回答实施目标、覆盖编号、交付级别和 P0/P1/P2 问题 | SOP 问题回答 | done | 不新增需求，不把外围增强混入核心 |
| 诊断旧 `07` 的范围漂移 | historical/conflict register | done | 旧编号、旧 VETO、旧产品和旧阶段不继承 |
| 形成 P0 范围、非范围和防膨胀规则 | 结构化 scope matrix | done | 每个核心能力可回指 `00/03/04/05/06` |
| 形成正式章节回填草稿 | §2 草稿 | done | 只写实施转译，不复制上游 schema |
| 自检 | Step gate | done | `pass_with_affected_open` |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮最小可交付结果是什么 | 一个可编译、可测试、可审查的 Rust workspace 设计路径，能承接安全观测准入、脱敏、关联、审计投影、body-free evidence linkage、只读查询、报告交接、留存保护和观察面重建；真实代码和真实证据仍由后续实现产生 | current `00` §2~§4；`03` §2、§4~§16；`05`/`06` planned semantics |
| 哪些需求必须覆盖 | 核心 `FR-OBS-001~013`、`BR-OBS-001~026`、`NFR-OBS-001~024`、`AC-OBS-001~031` 和 `VF-OBS-001~010` 的实现映射与阶段门禁 | current `00` traceability；`06` §5~§14 |
| 哪些设计章节必须落地 | `03` 的七 crate/file owner、60 exact protocol、27+1 state、flow/UoW/idempotency/no-write/evidence/telemetry 契约；`04` 的 strict config、profile/capability/failure binding；`05` 的 exact TC/DS/suite/lane/script/evidence path | current `03` §4~§16；`04` §2~§13；`05` §7~§14 |
| 哪些验收项必须可判定 | 五个核心闭环 `AC-OBS-001~005`、功能/边界/数据归属 `AC-OBS-006~031` 和十项 `VF-OBS-*`；设计期只定义判定入口，不填写结果 | current `06` §5~§14 |
| 哪些能力不进入 P0 | 高级 dashboard/alert/analytics、外部产品绑定、GRC 产品行为、生产容量/SLO、部署运维、真实验收签署和任何业务 truth 写入 | current `00` `FR-OBS-E01~E06`、`BR-OBS-025/026`、`06` residual contract |
| 是否存在 P1/P2 误入 P0 的风险 | 存在，主要来自旧 README 的 Grafana/Prometheus/TimescaleDB/P95/SLA/冷存期限、外部 adapter 和历史 phase；全部标为 `historical_material` 或 `future/residual` | Step 01 history register；current `00` §0/§1 |

## 4. 当前文档问题诊断

| 历史/当前材料 | 问题 | 处理 |
|---|---|---|
| 旧正式 `07-实施计划.md` | 使用过时的 `FR-OBS-001~016`、`BR-OBS-001~012`、旧 `VETO` 名称和八阶段摘要，未承接 current 31 AC/24 NFR/10 VF | 不增量修补；Step 13 从 current Step 01~12 装配 |
| 旧 Step 02 | 只列少量 ingestion/audit/signal 能力，未逐项绑定核心 FR、AC、VF、非范围和 affected | 分类为 historical；本文件重建完整编号映射 |
| README/旧实现资产 | 将产品、存储、性能和实现目录当作范围事实 | 只保留方向性线索；不进入 P0 scope |
| `FR-OBS-E01~E06` | 需求存在但属于外围增强，若直接放进 P0 会造成实现和验收范围膨胀 | 保留追踪、定义消费边界，排除核心实现完成判定 |
| inherited affected | 可能被误写为“全部功能不完整”或被实现 agent 私自补齐 | 绑定到对应 boundary，采用 fail-closed/controlled，不宣布关闭 |

## 5. 改动前后对比

| 项 | 旧材料口径 | current Step 02 口径 | 理由 |
|---|---|---|---|
| 核心 FR | 旧稿曾写 16 个 | 核心 13 个；外围 6 个单独列出 | 使用 current `00` 正式编号，避免 `NFR` 子串误计 |
| 验收范围 | 旧稿只写少量 AC/VETO | 31 AC、24 NFR、10 VF 全部进入实现映射；结果仍未执行 | `06` 已固定 exact acceptance contract |
| 业务 truth | 旧稿可能将 report/telemetry/evidence 当完成结果 | 只实现 observation-side fact/projection/marker/handoff/history/outbox/stored-result/derived maintenance | 保持 `00/01/03` truth ownership 和 no-write 红线 |
| 外部产品 | 旧稿把 DB/bus/APM/dashboard 作为可选实现对象 | 只作为 runtime/event/handoff seam；P0 使用 fake/controlled/disabled | 依赖裁剪规则和 `04` profile/capability contract |
| 真实证据 | 旧稿混用 candidate 与验收 evidence | 只规划 `EV-CAND-OBS-*` 与 run-scoped 生成关系，不静态生成真实 alias | `05/06` provenance 真实性要求 |
| implementation assets | 旧 ledger/boundary 似乎已激活 | 全部历史；Step 13 才重建 current ledger 和 planned skeleton | 防止历史 commit 状态泄漏 |

## 6. 设计取舍

| 方案 | 优点 | 风险/缺点 | 结论 |
|---|---|---|---|
| 以五个核心能力闭环组织 P0 | 能把需求、对象、协议、状态、测试和验收按功能增量连接，避免按文件横向堆任务 | 一个能力会跨多个 crate，需要后续 phase boundary 明确 owner | 采用 |
| 按七个 crate 分别完成后再集成 | 文件边界直观 | 会形成不可验证的横向半成品，跨 crate flow 和 no-write 风险延后 | 不采用 |
| 将外围增强一并实现 | 表面上范围完整 | 会引入未冻结的产品/分析/通知 schema，污染 P0 truth 与验收 | 不采用；保留后续入口 |
| 用静态报告或 fake external result 证明 P0 完成 | 早期易运行 | 违反 evidence provenance、affected 和真实 lane 规则 | 不采用 |

## 7. 结构化中间产物

### 7.1 P0 实施目标表

| 目标编号 | 实施目标 | 设计来源 | 可验证结果 | 不得宣称 |
|---|---|---|---|---|
| `OBJ-OBS-01` | 建立七 role crate workspace 与 only-core compile boundary | `03` §4；`01` | workspace/package/crate/name/dependency checks 可执行 | 目标仓已存在或已编译通过 |
| `OBJ-OBS-02` | 建立 body-free typed contract 与安全准入 | `FR-OBS-001~003`; `03` §5、§7、§11、§14 | invalid/raw/secret 输入 fail closed；safe receipt/disposition 可测试 | raw material 被成功保存 |
| `OBJ-OBS-03` | 建立 correlation、safe log/metric/trace 和 degraded surface | `FR-OBS-002/006/007`; `03` §5、§9、§14 | typed correlation、低基数 safe signal、gap/freshness/degraded 可判定 | telemetry 等于 execution truth |
| `OBJ-OBS-04` | 建立 audit projection、body-free evidence linkage 和 authenticity hint | `FR-OBS-004/005/011`; `03` §5、§7、§14 | owner/digest/purpose/visibility/gap provenance 可回指 | 生成真实 evidence alias/verdict |
| `OBJ-OBS-05` | 建立 strict read-only query/diagnostic/report handoff | `FR-OBS-008~011`; `BR-OBS-015/023`; `06` AC-004/013~016 | 14 Query zero-write；handoff input immutable；缺口显式 | Query 修复 source truth 或 handoff 产生验收结论 |
| `OBJ-OBS-06` | 建立 retention/protection/replay/rebuild/no-write guard | `FR-OBS-012/013`; `03` §9~§12 | active/hold/reference protection、bounded derived rebuild、violation record 可测试 | 删除/修复外部 truth 或伪造 J06 完成 |
| `OBJ-OBS-07` | 建立配置、运行绑定、测试门禁和交付台账路径 | `04`、`05`、代码实施台账规范 | profiles、scripts、run/report path、ledger/skeleton 设计齐全 | 真实 CI/run/report 已存在 |

### 7.2 P0 范围追踪表

| 范围组 | 编号 | 本轮状态 | 主要实现/验证承接 |
|---|---|---|---|
| 核心能力 | `C-OBS-1~5` | P0 | `03` capability/module contracts；`05` suites；`06` AC/VF |
| 核心功能 | `FR-OBS-001~013` | P0 required | phase/boundary 逐项映射；不可用时按 gate 阻塞 |
| 业务规则 | `BR-OBS-001~026` | P0 redline | domain/policy/entry/config/query/job checks |
| 数据归属 | `DO-OBS-001~034` | P0 boundary | owner/forbidden-body/no-write/redaction checks |
| 接口边界 | `IB-OBS-001~013` | P0 interface scope | 60 exact protocol 与 entry/worker/job mapping |
| 依赖边界 | `DB-OBS-001~014` | P0 dependency scope | only-core compile；runtime/event/handoff seams |
| 非功能 | `NFR-OBS-001~024` | P0 gate contract | structural/capability checks；无来源 numeric 不硬化 |
| 验收 | `AC-OBS-001~031` | P0 acceptance mapping | exact TC/DS/suite/lane/report provenance |
| 一票否决 | `VF-OBS-001~010` | P0 hard stop | redaction/no-write/truth/dependency/evidence/retention redlines |
| 外围增强 | `FR-OBS-E01~E06` | future/residual | 仅消费安全 view/summary/ref；不进入 P0 completion |

### 7.3 五个核心闭环到实施面的映射

| 核心闭环 | 覆盖功能 | 主要设计面 | P0 最小纵切 | 主要停止条件 |
|---|---|---|---|---|
| `C-OBS-1` 安全观测准入 | `FR-OBS-001~003` | Command C01~C04、I01~I03、receipt/disposition/correlation/safe signal | safe input -> validation/redaction -> owned receipt/disposition -> history/result | raw/secret、来源不明、I05 affected 或 UoW 顺序未闭合 |
| `C-OBS-2` 审计与证据投影 | `FR-OBS-004~005` | C05/C06、Q05/Q06、E04/E05、audit/evidence state | body-free ref/digest -> append projection/linkage -> query surface | body入仓、owner/digest缺失、evidence positive affected |
| `C-OBS-3` 运行观察与降级 | `FR-OBS-006~007` | C04、Q03/Q04/Q09~Q14、E03/E09~E12、gap/freshness | safe log/metric/trace summary -> correlation/rollup -> degraded read view | 高基数/raw、false Fresh、telemetry write truth |
| `C-OBS-4` 只读诊断与报告交接 | `FR-OBS-008~011` | Q01~Q14、C07/C08/C14、J07/J08、handoff/authenticity | read-only composite -> immutable evidence index input -> controlled handoff | Query write、ref-only handoff、真实 verdict/alias fabrication |
| `C-OBS-5` 留存与观察面维护 | `FR-OBS-012~013` | C09~C13、J01~J06/J09、retention/replay/no-write | protection/marker -> bounded plan/claim/fence -> derived rebuild/report | source write/delete、J06 H13 positive、active reference cleanup |

### 7.4 非范围与延期矩阵

| 项 | 分类 | 本轮处理 | 触发重新纳入的条件 |
|---|---|---|---|
| `FR-OBS-E01` dashboard/visual orchestration | future | 只允许消费已提交 read/diagnostic/report summary；不创建 core truth | 新需求与正式 schema/owner/AC 被 current 文档冻结 |
| `FR-OBS-E02` alert/notification | future | 只记录设计入口，不实现通知 truth | alert owner、delivery contract、AC 和依赖类型冻结 |
| `FR-OBS-E03` management reports | future | 不生成最终治理/验收结论 | report schema、owner、NFR 和 evidence contract 冻结 |
| `FR-OBS-E04` external observation product | future | adapter candidate only；不可成为 truth/store owner | exact product-neutral adapter/capability and environment lane available |
| `FR-OBS-E05` external audit/GRC export | controlled seam | local preparation + body-free export surface only；external call 受 intent/binding/probe gate | external phase link/retry affected closed and target capability verified |
| `FR-OBS-E06` anomaly/root-cause suggestion | future | 不改变 diagnostic/query/state | formal model/input/output/owner/acceptance contract 冻结 |
| production DB/bus/APM/Grafana/Prometheus/TimescaleDB | out of scope | fake/controlled/disabled seam；不作 compile dependency | separate ADR + runtime lane + acceptance scope |
| P95/P99/SLA/capacity/retention days | not frozen | 只做 qualitative/candidate/not_evaluated | 正式 source、workload、owner 和 threshold contract |
| real run/evidence/signoff | execution only | 由实现/测试/验收真实产生；设计阶段不填写 | target repo、CI/lane、run/artifact/report 建立 |

### 7.5 P0 防膨胀规则

1. 新增实现对象必须能回指 `FR/BR/DO/IB/DB/NFR/AC/VF` 和 current `03` owner；否则停在设计审计。
2. 外部产品、业务 truth、raw body、secret、execution result、final verdict 和 signoff 不得通过“辅助字段”进入 P0。
3. `FR-OBS-E01~E06` 的消费只允许依赖已提交 body-free view、summary、marker 或 ref，不得反向增加本仓核心 state 或 writer。
4. inherited affected 只能以 `open/controlled/conditional` 进入对应 boundary gate；不能改名为“已实现”或用 fake/static report 关闭。
5. 设计期 `planned`、`not_run`、`blocked`、`not_evaluated` 不得计入实现完成、验收通过或 release ready。

## 8. 回填草稿

未来正式 `07` §2 只回填以下收口结论：

> 本轮实施以 current `00~06` 为基线，P0 覆盖 `C-OBS-1~5`、核心 `FR-OBS-001~013`、相关 `BR/DO/IB/DB/NFR`、`AC-OBS-001~031` 和 `VF-OBS-001~010` 的可实现路径。目标是建立七个 role crate、body-free typed contract、安全准入、correlation、audit/evidence projection、safe log/metric/trace、strict read-only query、diagnostic、report handoff、retention/protection、bounded replay/rebuild、no-write guard、配置 profile、测试门禁和交付台账。`FR-OBS-E01~E06`、外部产品绑定、生产容量/SLO、部署运维和真实验收结论不属于 P0 实现完成判定。实施计划只转译上游设计为 phase、boundary、门禁和交付纪律，不重定义 truth、schema、state 或验收结果。

## 9. 待确认事项与进入下一步条件

| 事项 | 当前状态 | 影响 | 处理 |
|---|---|---|---|
| P0/P1 边界 | resolved for design | 防止外围增强进入核心 phase | 按本文件执行；新需求需回到 `00` |
| 12 项 inherited affected | open/controlled | 阻塞对应 positive boundary，不阻塞范围规划 | 后续 phase/boundary 逐项绑定 |
| target repo absent | open reality | 阻塞代码实施，不阻塞计划设计 | Step 03 固化检查与 PH-01 处理 |
| numeric threshold/product choice | not frozen | 阻塞硬化性能/产品声明 | 保持 qualitative/candidate/not_evaluated |

Step 03 进入条件：本文件 current、Step 01 为 `pass_with_affected_open`、范围编号可追溯、非范围和防膨胀规则明确。进入 Step 03 不代表实现授权。

## 10. Step 自检门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| `S02-SCOPE-TRACE` | pass | 核心范围可回指 current 需求/设计/验收编号 |
| `S02-NON-SCOPE` | pass | 外围增强、产品、性能和真实执行资产明确排除 |
| `S02-TRUTH-BOUNDARY` | pass | 不拥有业务 truth，不把 telemetry/handoff/evidence 写成业务结论 |
| `S02-AFFECTED` | pass_with_affected_open | 12 项 inherited affected 保持原状态 |
| `S02-NO-FABRICATION` | pass | 无 commit/run/evidence/verdict/signoff 声明 |
| `S02-USER-GATE` | pass_continuous_authorization | 用户已明确要求完成全部 `07` 后停下 |
