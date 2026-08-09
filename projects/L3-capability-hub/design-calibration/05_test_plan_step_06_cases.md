# L3-capability-hub 05 测试方案 Step 6：设计测试场景与可执行用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 书写规范：`standards/document/测试方案书写规范.md` §5.6
> 上游覆盖基线：`design-calibration/05_test_plan_step_05_traceability_coverage.md`
> 回填目标：`05-测试方案.md` §6；正式文档只允许在 Step 15 装配
> 当前状态：`05_step_06_completed_continuous_execution`
> 执行事实：本文只定义 future test cases；未执行测试，未创建 run、artifact、report、真实 evidence 或验收结论
> Safe-text scanner controlled repair: 2026-08-09; adds targeted parameter oracles without adding a canonical TC/DS/EV identity or execution fact
> Fixed access-review reason controlled repair: 2026-08-09; adds exact-byte, digest-exclusion, propagation, fresh/replay and compatibility parameters to the existing CMD-004 identity only

---

## 1. Step 目标、输入、输出与边界

本 Step 把 Step 5 的 `171` 个 exact DDD cuts 和 `18` 个 `CFG-F-*` 配置失败义务转译为稳定、可执行、可断言、可定位失败且可由后续 evidence contract 消费的 `TC-CH-*`。用例以 exact cut 为主键，不以旧 `TC-001..TC-012`、接口数量猜测、通用 CRUD 或产品 E2E 为主键。

| 项 | 本 Step 处理 | 本 Step 不处理 |
|---|---|---|
| 用例身份 | 分配稳定、领域化 `TC-CH-*`；每个 exact cut 一条 canonical case record | 不复用旧 TC，不分配真实执行实例 |
| 可执行性 | 固定前置、输入 / 操作、typed oracle、zero-effect oracle、断言点、逻辑数据需求、层级和自动化候选 | 不写 fixture 文件、seed、schema、数据库记录或产品连接参数 |
| evidence | 分配唯一 `EVC-CH-*` evidence candidate，供 Step 13 收敛 | 不分配正式 `EV-*`、alias、path、retention、digest 或 run_id |
| 环境 / 自动化 | 标明 `L0..L4` primary layer 和 future automation intent | 不定义 Step 8 环境矩阵、Step 9 suite / command / CI gate |
| phase | 只断言 formal 03 已声明的当前 phase、carrier 和 terminal | 不提前写后续 phase 的状态、delivery lifecycle 或验收结果 |
| 设计边界 | 保持 capability identity、registry、descriptor、governance/method/exposure/reference seam | 不合并 runtime/tools execution、approval、method body、provider routing/cost、marketplace、SDK client/cache |

本 Step 直接读取并使用：

1. 正式 `00-需求文档.md` 至 `04-配置设计.md`。
2. `03-详细设计.md` §§3~15 的 module/object/Port/protocol/flow/state/error/transaction/binding/observation 契约。
3. `03_ddd_step_10_state_matrix.md` 的 24 family、111 active variants 和 638-pair exact matrices。
4. `03_ddd_step_12_error_recovery.md` 的 `DomainError`、17 个 `ApplicationError`、51 个 `CapabilityIssueCode` 和 83-flow mapping。
5. `03_ddd_step_16_test_cuts.md` 的 exact cut 与 oracle precedence。
6. `04_config_step_11_failure_degradation.md` 和 `04_config_step_12_downstream_handoff.md` 的 `CFG-F-01..18`。
7. Step 3~5 中间产物和 Step 4 layer ownership。
8. `L1-governance`、`L3-method-library` Step 6 仅作为结构与粒度参考。

## 2. Batch `6.0`：先思考

### 2.1 SOP 十一问回答

| SOP 问题 | 本项目回答 |
|---|---|
| 每个 P0 正向主线怎么执行？ | module/object 以 inventory 参数集执行；26 Command 各自执行 accepted/no-op branch；33 Query 各自执行 visible/missing/degraded branch；6 Inbound 各自执行 header-first accepted receipt；10 Outbound 各自执行 Phase A Durable 后 B/C；8 Job 各自执行 frozen plan、ordinal target、final report。 |
| 每个关键反向和边界如何触发？ | 使用 formal constructor rejection、wrong owner/kind/source/version、forbidden body、terminal/illegal pair、same/different digest、CAS loser、staged write fault、typed Port failure、Missing/Disabled、redaction/sink fault等确定性 seam。 |
| 每个状态非法迁移如何断言？ | 以 `03_ddd_step_10_state_matrix.md` exact row为参数源；每行保留 `family[/kind]/from/to/classification` 定位键。illegal 断言 exact typed rejection；reserved 断言 current callable/flow invocation=0；两者都断言 field/version/time/history/capture/material/external call=0。 |
| 每个事务回滚和副作用如何验证？ | 通过 staged UoW、22 repository/110 method spy、commit三态、rollback fault、idempotency winner、capture/journal carrier进行断言；observer output、error text或private fake map不得替代 carrier oracle。 |
| 每个恢复场景如何复现？ | 通过 same-digest replay、corrupt/missing stored surface、orphan Reserved、Job journal symmetry、commit Unknown resolution、Outbound A/B/C crash、per-target Job crash、cursor/index asymmetry复现；禁止 current-truth reconstruction。 |
| 预期结果引用哪些正式字段、状态、错误或事件？ | 每行引用 exact protocol/flow/state、`DomainError::InvalidStateTransition` 或 closed `ApplicationError`、typed receipt/outcome/report、repository carrier、capture/journal和 formal configuration stage。 |
| 是否提前写后续 phase 状态或证据？ | 否。Outbound 本地只到 `Captured / IntentBound`；外部 status 保持 Port-owned；Job 只到已声明 journal/report；`EVC-*` 不是 evidence instance。 |
| 每个 cut 有哪些场景类？ | 每条 case record 的“分支”至少含 positive 和关键 negative/boundary；按风险补 concurrency/recovery/consistency。共享 harness 可以复用，但不能替代 exact cut 行。 |
| 是否有断言、数据、自动化和 evidence ID？ | 是。每行具备 typed/zero-effect/细化断言、`DR-CH-*` 逻辑数据需求、layer/automation intent和唯一 `EVC-CH-*` candidate。 |
| 单 cut 是否可停审？ | 每批末尾按 identity、positive/negative、typed/zero-effect、data/layer/evidence、phase 六项停审；完成状态表示设计记录闭合，不是测试通过。 |
| 跨用例是否有重复、缺失、phase/证据冲突或 happy-path-only？ | 最终按 189/189 cut、83/83 flow、24/24 state、638 pair、TC/EVC uniqueness、phase owner和 responsibility leakage机械审计。 |

### 2.2 当前材料诊断

| 材料 / 缺口 | 诊断 | 本 Step 处理 |
|---|---|---|
| 旧正式 `05-测试方案.md` | 旧对象、旧 `TC-001..012`、产品拓扑和无 provenance 结果与当前 00~04 冲突 | 只记 `historical_material`；不映射、不别名、不沿用 |
| Step 5 `TCF/EVF` | 只有 family candidate，尚不可执行 | 分配 exact `TC-CH-*` 与唯一 `EVC-CH-*`，保留 future/not-executed 语义 |
| 171 exact DDD cuts | exact identity 已闭合，但成员型 cut 需要 parameter registry | foundation cases 固定 inventory cardinality和逐成员失败定位要求 |
| 83 exact flows | family helper 容易掩盖漏行 | 26/33/6/10/8 每条 flow 独立 TC 行 |
| 24 state / 638 pairs | family sample 无法定位漏对 | 24 条 stable state TC + `family[/kind]/from/to/classification` 参数身份；7组算术闭合 |
| Step 10 历史叙述中的 `304 illegal` | 与 active formal 03、Step 5 和 Step 10 §66 的 `301` 冲突 | 登记为 `historical_discrepancy_superseded`；唯一当前口径为 `638=239+98+301` |
| 18 `CFG-F-*` | 与 binding 有语义交叉但 source/failure identity独立 | 每条单独 `TC-CH-CONFIG-*`；不得以 binding TC 取消其身份 |
| evidence / data / environment | Step 7/8/9/13 尚未执行 | 只写逻辑需求和 candidate；缺少真实产物不得计 pass |

### 2.3 改动前后与设计取舍

| 议题 | 改动前 | 本 Step 决定 | 理由 |
|---|---|---|---|
| exact cut 到 TC | 只有 family candidate | `189 exact obligations -> 189 canonical TC records` | 最直接的 orphan/duplicate/失败定位闭环 |
| 一个 TC 的分支 | 可能按 happy/negative 拆成大量散列 ID | 一个 canonical TC 以参数分支覆盖 positive + key negative/boundary/recovery | 保持 cut identity稳定，同时不牺牲可执行性 |
| member inventory | 只写 43/250/110 数量 | case record要求每个 member有独立参数身份和失败定位 | 数量断言不能替代成员覆盖 |
| 状态数据 | 只写 24 family sample | 24 TC 共同消费 638-row exact registry，禁止 sampling | active DDD 明确要求全 pair覆盖 |
| typed oracle | 可能依赖 status/log/error text | 使用 closed terminal/error/carrier；observer只验证 observer contract | 保持业务真相源单一 |
| evidence | 直接写 `EV-*` 风险高 | 使用 `EVC-*` candidate；Step 13再分配 stable evidence contract | 避免伪造真实 alias / artifact |
| real product | 旧文档假定 PG/bus/KMS/Vault | P1 selected seam，不能证明或扩大 P0 semantics | 当前产品和目标仓事实未选择 |

## 3. Stable case identity 与字段契约

### 3.1 编号空间

| Case family | Stable range | Exact source |
|---|---|---|
| foundation | `TC-CH-FOUNDATION-001..018` | 18 module/object/Port/repository cuts |
| Command | `TC-CH-CMD-001..026` | `CUT-FLOW-C-01..26` |
| Query | `TC-CH-QUERY-001..033` | `CUT-FLOW-Q-01..33` |
| Inbound | `TC-CH-INBOUND-001..006` | `CUT-FLOW-I-01..06` |
| Outbound | `TC-CH-OUTBOUND-001..010` | `CUT-FLOW-O-01..10` |
| Job | `TC-CH-JOB-001..008` | `CUT-FLOW-J-01..08` |
| state | `TC-CH-STATE-001..024` | `CUT-STATE-01..24` |
| transaction | `TC-CH-TX-001..022` | `CUT-TX-01..22` |
| binding | `TC-CH-BIND-001..012` | `CUT-BIND-01..12` |
| observability | `TC-CH-OBS-001..012` | `CUT-OBS-01..12` |
| configuration failure | `TC-CH-CONFIG-001..018` | `CFG-F-01..18` |

`TC-*` 是稳定设计身份，不证明实现中已有同名测试。每个 TC 只能有一个 canonical row；同一 harness、parameter source或 assertion helper可被多行引用，但不得生成第二语义 owner。

### 3.2 Case record 字段

| 字段 | 必填语义 |
|---|---|
| exact cut / TC | 一对一 canonical identity |
| 场景 / 优先级 | exact owner和风险；本轮189条均为P0设计义务 |
| 分支 | 至少 positive + key negative/boundary；按风险补 concurrency/recovery |
| 前置 | 正式 state/carrier/config/profile/dependency状态，不写具体seed |
| 输入 / 操作 | exact callable/flow/stage/parameter class及注入点 |
| expected / typed oracle | closed typed outcome/error/state/carrier；不得使用自由文本 success |
| zero-effect oracle | 禁止写、调用、重试、重建、fallback或责任泄漏的精确零表面 |
| 断言点 | 字段/版本/引用/UoW/sidecar/capture/journal/顺序/数量/byte-equivalence |
| data requirement | 唯一 `DR-CH-*` 逻辑需求；Step 7定义构造与隔离 |
| layer / automation | Step 4 `L0..L4` owner和 future automated intent；不声称 suite 已存在 |
| evidence candidate | 唯一 `EVC-CH-*`；Step 13定义 producer/schema/path/retention |

### 3.3 Oracle precedence 与共享执行纪律

```text
typed public/application terminal
  -> exact repository/stored carrier state when persistence is expected
  -> exact sidecar/capture/journal symmetry
  -> exact zero-write / zero-call spy for prohibited effects
  -> observer projection only for observer-contract assertions
```

所有 case 共同遵守：

- `DomainError::InvalidStateTransition` 是 exact domain state错误；其余 public/application failure使用 closed `ApplicationError` 或 channel typed surface，不从 prose 拼接新 enum。
- `ApplicationError::ConsistencyDefect` 用于已加载/返回 typed relation不可能成立；正常 missing/empty/not-visible/degraded 不是错误。
- `ApplicationError::CommitOutcomeUnknown` 只能由 exact transaction resolution继续判定，不能根据 timeout、一次缺失或日志猜测。
- Command duplicate只读 immutable stored command surface；Inbound duplicate只读 stored receipt；Job duplicate只读 matching typed report。
- Query 的 UoW/reserve/save/capture/handoff/collaboration/refresh/rebuild调用全为0。
- Outbound Phase A、B、C各自独立；本地 capture不拥有 physical delivery lifecycle。
- Job 使用 frozen plan、ordinal target terminal cell、final report对称；不得 rescan scope或修复 core truth。
- log、error text、`Debug`、elapsed time、private fake map、external product state和手工观察不是 business oracle。

## 4. 用例批次与场景总表

### 4.1 用例批次表

| Batch | Exact cut range | TC 数 | 主要场景 | Primary layers | 批次设计状态 |
|---|---|---:|---|---|---|
| `6.1` foundation | 18 foundation cuts | 18 | inventory、codec、domain、dependency、Rustdoc、Port/repository parity | L0/L1/L2/L3/L4 | completed-designed |
| `6.2` Command | `C01..26` | 26 | accepted/rejected/no-op/duplicate/CAS/rollback/post-commit | L2 + L4 | completed-designed |
| `6.3` Query | `Q01..33` | 33 | visible/missing/not-visible/degraded/page/strict no-write | L2 + L4 | completed-designed |
| `6.4` I/O/J | `I01..06/O01..10/J01..08` | 24 | header-first receipt、A/B/C、frozen plan/target/final | L2/L3/L4 | completed-designed |
| `6.5` state | `STATE-01..24` | 24 | 111 variants、638 pairs、formation/same-state/terminal | L1 + L2 | completed-designed |
| `6.6` TX/bind/obs | `TX-01..22/BIND-01..12/OBS-01..12` | 46 | UoW/idempotency/race/recovery/assembly/redaction | L1/L2/L3/L4 | completed-designed |
| `6.7` config | `CFG-F-01..18` | 18 | parser/source/profile/secret/assembly/failure/frozen controls | L1/L3/L4 | completed-designed |
| **total** | `171 DDD + 18 CFG-F` | **189** | exact source preserving | L0~L4 | completed-designed / not executed |

### 4.2 场景总表

| 场景族 | Positive 主线 | 关键负向 / 边界 | Typed / effect重点 |
|---|---|---|---|
| identity / registry | establish、correct、register、lifecycle、visibility | missing owner、wrong version、terminal、duplicate | exact state/revision/change/trace/result atomic |
| descriptor / secret | body-free descriptor、safe risk/secret summary | raw body/credential、wrong predecessor、resolver asymmetry | no provider/secret truth；typed ref/state |
| governance / method seams | attach/replace/expire/remove body-free relation | approval/method body mutation attempt、wrong subject | local seam only；sibling writes zero |
| exposure / SDK boundary | exposure/applicability/view/reference | runtime authorization、SDK client/cache inference | server boundary only；source-version symmetry |
| trace / collaboration | impact/ref/trace、capture/collaborate/bind | source mismatch、B failure、C race/Unknown | A/B/C independence；no delivery state |
| derived / Job | directory/view/export/discovery/reconciliation | partial target、crash、duplicate、scope rescan | frozen plan、terminal cells、immutable report |
| state / consistency | exact current/reserved/illegal pairs | terminal rewrite、impossible relation、no-op | exact typed rejection and zero mutation |
| configuration / binding | strict root、complete graph、legal profile | invalid source、Missing、provider/TLS fault、partial stage | fail-fast/closed；no fallback/exposure |
| observability / security | exact profile projection | forbidden material、Off、redactor/sink failure | business bytes unchanged；non-recursive fallback |

## 5. Logical data 与 candidate evidence boundary

`DR-CH-*` 是 Step 7 的逻辑输入需求，不是 fixture ID、文件、schema或已存在数据。每个需求必须在 Step 7 收敛到 deterministic constructor/builder/parameter source、isolation和cleanup规则。`EVC-CH-*` 是 Step 13 的 candidate，不是 `EV-*`、alias、artifact或测试结果。

| Logical family | Step 7 minimum handoff | 禁止提前解释 |
|---|---|---|
| `DR-CH-FOUNDATION-*` | exact inventory/member、valid/malformed member、dependency graph、Port/repository outcome classes | source file/test name或真实 durable product |
| `DR-CH-FLOW-*` | exact request metadata、owner refs、accepted/negative/duplicate/conflict carrier states | endpoint、topic、credential、real sibling response |
| `DR-CH-STATE-*` | exact state family/kind/from/to/classification和formal expected row | sampling、随机省略或实现私有 status |
| `DR-CH-TX-*` | UoW stage、transaction resolution、winner、stored surface、fault point | database-specific SQL或真实 crash run |
| `DR-CH-BIND-*` | typed root/profile/binding state/slot/source/route/job family | product constructor、secret body或deployment value |
| `DR-CH-OBS-*` | exact profile/plane/mode/material class/sink result | backend schema/path或真实 telemetry |
| `DR-CH-CONFIG-*` | raw candidate class、validation stage、graph fault、change target class | concrete environment injection或release record |

## 6. Batch `6.1`：foundation executable cases

本批每条 TC 的分支集合均为同一 stable case 的 parameter variants。`positive` 与 `negative/boundary` 均须执行；表中的“自动化”是 future intent。

| TC / exact cut | 场景 / P | 分支与前置 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-FOUNDATION-001` / `CUT-MOD-01` | contracts 250 public types闭合 / P0 | positive: exact inventory member；negative: missing/extra/duplicate、unsupported schema/forbidden field | 对每个 public type执行compile/construct；serialized member执行strict roundtrip与malformed decode | inventory exact 250；valid value roundtrip byte/field stable；invalid输入为typed contract/codec rejection | 不产生domain/application/UoW/Port调用；raw body/unknown field不进入surface | member ID可定位；required/ref/schema/canonical bytes不漂移 | `DR-CH-FOUNDATION-001` | L0+L1 / required automated parameter scan | `EVC-CH-FOUNDATION-001` |
| `TC-CH-FOUNDATION-002` / `CUT-MOD-02` | domain 43 objects与24 state family invariant / P0 | positive factory/member；negative malformed owner/ref/state/terminal/no-op | 对43 object逐成员调用正式 factory/member，并用24 family合法/非法代表入口验证guard | exact object/state或`DomainError` closed variant；accepted delta遵守version/time/history规则 | rejection/no-op时field/version/time/history/capture/material/external call全0 | 43/43、24/24 member identity可定位；无generic active/status | `DR-CH-FOUNDATION-002` | L1 / required table-driven automation | `EVC-CH-FOUNDATION-002` |
| `TC-CH-FOUNDATION-003` / `CUT-MOD-03` | 83 application service编排 / P0 | positive declared flow；negative Port/domain/conflict/duplicate/fault | 对83 service使用deterministic Ports/UoW，逐flow检查调用序列和terminal | exact `Capability*Outcome`/receipt/collaboration/report或closed `ApplicationError`；same-UoW member完整 | 未声明Port、第二UoW、duplicate body、Query write、Job core repair调用=0 | 83/83 service、调用顺序、transaction ref、stored carrier可定位 | `DR-CH-FOUNDATION-003` | L2 / required service automation | `EVC-CH-FOUNDATION-003` |
| `TC-CH-FOUNDATION-004` / `CUT-MOD-04` | infra single authority与assembly / P0 | positive fake/durable parity candidate；negative second authority、partial graph、repository asymmetry | 绑定22/110 repository和Stage 0~7 deterministic harness；注入每类失败 | exact repository/assembly typed result；完整graph或whole candidate reject | private finder、adapter-opened transaction、partial exposure、silent fallback=0 | authority owner、exact method/key/order、owned-prefix disposal | `DR-CH-FOUNDATION-004` | L3 / required adapter/runtime contract automation | `EVC-CH-FOUNDATION-004` |
| `TC-CH-FOUNDATION-005` / `CUT-MOD-05` | API mapping/barrier/non-cancelling / P0 | positive each protocol family mapping；negative route/body/schema/metadata/mapping fault | 通过handler contract输入exact request/envelope；在barrier前后及caller timeout注入 | exact protocol surface或entry-owned safe technical mapping；owned invocation继续到terminal | pre-dispatch reject时service/UoW=0；caller timeout不取消owned invocation；handler不持repository | route->DTO->service->surface对称，raw source不公开 | `DR-CH-FOUNDATION-005` | L4 / required entry automation | `EVC-CH-FOUNDATION-005` |
| `TC-CH-FOUNDATION-006` / `CUT-MOD-06` | Worker六源header-first/lifecycle / P0 | positive 6/6 sources；negative header/schema/source/body/barrier、shutdown中输入 | 对每source执行header gate、decode、spawn/await；执行stop/drain/join | exact `CapabilityInboundEventReceipt`或entry/application typed failure；accepted task达到terminal | gate失败不decode/dispatch；Disabled/Missing不启动；drain不丢owned invocation；queue/DLQ truth=0 | 6 source identity、opaque completion、original failure precedence | `DR-CH-FOUNDATION-006` | L4+L3 / required worker runtime automation | `EVC-CH-FOUNDATION-006` |
| `TC-CH-FOUNDATION-007` / `CUT-MOD-07` | Jobs八dispatch生命周期 / P0 | positive 8/8 typed dispatch；negative name/schema/input mismatch、deadline、partial target、shutdown | 对每Job运行entry->plan->targets->final；注入deadline和target failure | exact variant-bound `CapabilityJobResponse<T>`、journal/report symmetry或closed error | pre-entry reject无reserve/scan；deadline不取消owned run；不得scheduler infer/replan/core repair | 8 dispatch exact，plan/target/final terminal cell及result ref一致 | `DR-CH-FOUNDATION-007` | L4+L2 / required runner/service automation | `EVC-CH-FOUNDATION-007` |
| `TC-CH-FOUNDATION-008` / `CUT-MOD-DEP-01` | 七workspace member/15 local edge图 / P0 | positive declared graph；negative reverse/skip-layer/third-party type leak | 静态读取manifest/import/public signature，比较exact allowlist | 7 member、15 edge exact；非法edge形成deterministic static finding | 不通过runtime反射或test-only feature放行非法依赖 | edge source/target/type位置可定位 | `DR-CH-FOUNDATION-008` | L0 / required static automation | `EVC-CH-FOUNDATION-008` |
| `TC-CH-FOUNDATION-009` / `CUT-MOD-DEP-02` | 唯一 sibling `core-contracts` edge / P0 | positive compatible exact edge；negative其他sibling import/copy replacement | 扫描Cargo和source依赖；对compatibility prerequisite执行compile gate | 只允许formal声明的`core-contracts` sibling edge；不兼容为blocked prerequisite | governance/method/runtime/tools/marketplace/SDK sibling compile edge=0；copied replacement=0 | dependency path与public type来源可定位 | `DR-CH-FOUNDATION-009` | L0 / required static+compile automation | `EVC-CH-FOUNDATION-009` |
| `TC-CH-FOUNDATION-010` / `CUT-MOD-DEP-03` | entry composition不接repository/adapter / P0 | positive entry只接application facade；negative direct repository/adapter/capture publisher injection | 扫描API/Worker/Jobs constructor和field/call graph | constructor/signature仅含正式entry dependency；非法依赖形成static finding | entry直接查询store、开启UoW、持有capture repository/publisher=0 | exact file/declaration/field/callsite可定位 | `DR-CH-FOUNDATION-010` | L0 / required static automation | `EVC-CH-FOUNDATION-010` |
| `TC-CH-FOUNDATION-011` / `CUT-MOD-DOC-01` | Rust public declaration完整英文注释 / P0 | positive every declaration；negative缺失/非英文空壳/enum payload `pub` | 对未来Rust source扫描public declaration、struct、field、enum variant/payload、trait/method/callable | 每个目标紧邻有效英文 `///`；enum struct variant fields无field-level `pub` | 不以模块注释、derive或父级注释替代字段/variant/method注释 | finding包含file/declaration/field或variant路径；遗漏数必须可判定 | `DR-CH-FOUNDATION-011` | L0 / required source scan | `EVC-CH-FOUNDATION-011` |
| `TC-CH-FOUNDATION-012` / `CUT-OBJ-CORE` | 43 core object factory/member矩阵 / P0 | positive valid member set；negative missing/wrong owner/kind/bound/invariant/terminal | 参数化每个object factory及可变member的valid/min/max/wrong relation输入 | exact object或`ContractValueError`/`DomainError`；accepted object字段与formal invariant一致 | rejected object不分配ID/time、不持久化、不调用resolver/collaboration | object/member/input-class/error定位，不允许只抽样 | `DR-CH-FOUNDATION-012` | L1 / required table/property automation | `EVC-CH-FOUNDATION-012` |
| `TC-CH-FOUNDATION-013` / `CUT-OBJ-HELPER` | 七canonical helper跨channel/domain对称 / P0 | positive exact typed input；negative wrong channel/domain/body-bearing/asymmetric carrier | 对7 helper执行canonical mapping/encoding，并做channel/domain permutation | exact body-free helper result或typed rejection；相同正式输入产生stable bytes/ref | 不读取current truth、raw body、Debug/map order；不产生业务写或外部调用 | helper identity、domain separator、input field集合可定位 | `DR-CH-FOUNDATION-013` | L1 / required unit/property automation | `EVC-CH-FOUNDATION-013` |
| `TC-CH-FOUNDATION-014` / `CUT-OBJ-PROTOCOL` | 250 protocol type construct/roundtrip/forbidden field / P0 | positive exact DTO；negative missing/unknown/null/coercion/body/variant mismatch | 每type构造canonical instance；serialized type strict encode/decode；inject malformed fields | exact type/variant/field稳定或typed contract/codec rejection | invalid input不dispatch、不reserve、不写；secret/body/raw response不进入public shell | 250/250 parameter key与failure field path可定位 | `DR-CH-FOUNDATION-014` | L0+L1 / required compile+codec automation | `EVC-CH-FOUNDATION-014` |
| `TC-CH-FOUNDATION-015` / `CUT-OBJ-DIGEST` | 四digest domain canonical frame / P0 | positive stable vectors；negative field permutation/domain crossover/retry metadata/raw body | 对四domain生成相同/不同semantic inputs，改变map order和excluded metadata | same semantic input digest相同；business field/domain变化digest不同；codec failure typed | 不用`Debug`/pretty/raw body；excluded retry/trace metadata不改变digest；无fallback hash | frame version、domain separator、field bytes和digest可定位 | `DR-CH-FOUNDATION-015` | L1 / required vector/property automation | `EVC-CH-FOUNDATION-015` |
| `TC-CH-FOUNDATION-016` / `CUT-PORT-LOCAL` | 27 local/base Port exact callable/authority / P0 | positive all callables；negative hidden/private finder、wrong UoW、non-Send、second authority | 编译trait/callable inventory；对typed fake执行formal outcomes与concurrency contract | 27/27 Port/callable set exact；future满足Send；formal typed return/error retained | private lookup、string/generic result、adapter-opened nested UoW、fallback authority=0 | Port/callable/signature/UoW identity与调用owner可定位 | `DR-CH-FOUNDATION-016` | L0+L3 / required compile+contract automation | `EVC-CH-FOUNDATION-016` |
| `TC-CH-FOUNDATION-017` / `CUT-PORT-EXTERNAL` | 9 external Ports/14 callables binding parity / P0 | positive Configured/Fake/Disabled legal rows；negative Missing/wrong family/typed response asymmetry/failure | 对9/14 exact callable逐binding state调用，注入temporary/permanent/invalid response | Configured/Fake产生formal typed result；Disabled产生exact existing `NotConfigured`；Missing blocks activation；asymmetry=`ConsistencyDefect` | configured failure不fallback Fake/Disabled；raw response/body/secret不公开；unmodeled retry=0 | Port/callable/binding/failure class/call count可定位 | `DR-CH-FOUNDATION-017` | L3 / required external contract automation | `EVC-CH-FOUNDATION-017` |
| `TC-CH-FOUNDATION-018` / `CUT-REPO-ALL` | 22 repository traits/110 methods parity / P0 | positive success/missing/page/order；negative CAS/unique/wrong key/index/cursor/owner/version/asymmetry | 每exact method在deterministic fake执行；future selected durable复用同一contract；注入每类failure | exact typed return；CAS=`OptimisticConflict`、unique=`UniquenessConflict`、impossible row=`ConsistencyDefect` | 不全表fallback、不首项猜测、不私有finder、不覆盖winner、不在adapter开新UoW | 22/110 method key、expected version、order/cursor、staged set与fake parity可定位 | `DR-CH-FOUNDATION-018` | L3 / required parameterized contract automation | `EVC-CH-FOUNDATION-018` |

#### Safe-text scanner targeted parameter set

The following parameters are attached to the existing `CUT-MOD-01` / forbidden-material assertions as `targeted_regression`. They are not additional canonical cases, datasets, evidence identities, public declarations, or denominator entries.

| parameter set | exact inputs | expected / prohibited effect |
|---|---|---|
| `safe-text-marker-v1-empty-trim` | empty, ASCII whitespace-only, Unicode whitespace-only, and each exact marker surrounded by whitespace | empty returns `EmptySafeText` before scanning; non-empty input is scanned after one Rust Unicode `trim()`; retained bytes equal the trimmed input |
| `safe-text-marker-v1-positive` | each of the eight exact registry markers at beginning, middle, end, and adjacent to ordinary text | returns only the corresponding `ForbiddenExternalBody` variant; no marker or source text is retained or echoed |
| `safe-text-marker-v1-near-miss` | case, punctuation, version, slug, Unicode-confusable, split-marker, percent/base64/JSON-escaped/PEM-encoded variants without the exact literal, plus wrappers retaining the literal as controls | encoded/escaped or near-miss values do not match; wrappers retaining exact bytes do match; no semantic keyword, decoder or wrapper parser |
| `safe-text-marker-v1-collision` | repeated same marker and all 28 unordered marker pairs in both text orders | repeated marker keeps its category; pair result follows fixed registry declaration order, never textual position |
| `safe-text-marker-v1-preservation` | marker-free UTF-8 with interior Unicode, leading/trailing whitespace, and finite long values | exact once-trimmed byte preservation; no normalization, case-fold, truncation, hash, length or lossy replacement |
| `safe-text-marker-v1-raw-owner` | dummy raw external body supplied to a typed source/Port/decoder with and without a marker | owner rejects/classifies fail-closed before `CapabilitySafeText`; no-marker primitive success cannot downgrade raw body; all persistence/emission/observer/error echo effects are zero |

#### Fixed access-review reason targeted parameter set

The following parameters are attached to existing `TC-CH-CMD-004` / `CUT-FLOW-C-04` and contracts fixtures as `targeted_regression`. They add no canonical case, dataset, evidence identity, declaration or denominator entry.

| parameter set | exact inputs | expected / prohibited effect |
|---|---|---|
| `access-review-reason-v1-factory` | fresh valid attachment and direct factory observation | exact ASCII/UTF-8 `capability-hub.change-reason/access-review-fact-recorded.v1`, length `59`; factory call count one |
| `access-review-reason-v1-digest-exclusion` | canonical field writer for a fixed command body | writes only `identity_ref`, `review_context`, `risk_summary`; reason is neither request input nor digest field |
| `access-review-reason-v1-propagation` | accepted change, trace and affected-material typed reasons | every carrier has identical 59 bytes; prefix/suffix/normalization/format/hash/re-encoding count zero |
| `access-review-reason-v1-replay` | completed same-key/same-digest replay with fresh-effect spies | exact stored terminal; factory/Clock/ID/mutation/material scan/capture calls all zero; no constant-based reconstruction |
| `access-review-reason-v1-corruption` | missing/truncated/different stored reason | `ConsistencyDefect`; fallback, normalization, silent migration, truth rebuild and partial success zero |
| `access-review-reason-v1-compatibility` | static literal/namespace/version/byte mutation | compatibility check fails and requires controlled Step 6/8/9/12/13/16 plus formal 03/05/07 reopen |

### 6.1 Batch stop-review

| 审查项 | 设计结论 | 未后移到本批的内容 |
|---|---|---|
| exact identity | `18/18` foundation cuts各有一个稳定TC和唯一EVC candidate | 无 |
| positive + negative/boundary | 每行均含valid主线及malformed/authority/parity/failure分支 | 具体参数构造留Step 7 |
| typed + zero-effect oracle | 每行均使用formal type/error/carrier并声明禁止表面 | 无 |
| inventory可定位 | 43、250、27、9/14、22/110、83、6、8等均要求member key，不接受count-only pass | source/test路径留formal 07 |
| Rustdoc / 结构体注释 | public declaration、struct及每field、enum variant/payload、trait/method/callable英文`///`完整；payload field无`pub` | 实际scan command留Step 9 |
| phase / evidence | 未引入后续phase；只写`DR-*`和`EVC-*` candidate | fixture/env/suite/schema/path留Steps 7/8/9/13 |

Batch `6.1` 的“通过”只表示用例设计记录完整，测试执行状态仍为 `not_executed`。

## 7. Batch `6.2`：26 Command exact-flow cases

### 7.1 每条 Command 必跑的共享分支

下表不是一个可替代 26 条 TC 的“公共用例”，而是每条 `TC-CH-CMD-*` 都必须参数化执行的 branch contract。owner-specific 前置、状态和 atomic members 由 §7.2 对应行补齐。

| Branch key | 前置 / 操作 | Typed / carrier oracle | Mandatory zero-effect oracle |
|---|---|---|---|
| `fresh-accepted` | exact command metadata/schema/actor/scope/idempotency key；key absent；owner前置和expected version有效 | exact `CapabilityCommandOutcome<T>` accepted surface；truth/change/trace/actual material/capture/stored result/`Completed`按该flow同一UoW；commit `Durable`后才允许post-commit协作 | 未声明owner、runtime/tools execution、approval、method body、provider request、marketplace、SDK client/cache写/调用=0 |
| `stable-rejected` | 缺required field、wrong owner/kind/scope、body forbidden、policy/state guard失败 | exact contract/domain/application typed rejection；若在reserve前可判定则无reservation；若formal flow允许stored safe rejection则只按exact flow carrier | truth/history/trace/material/capture/result success和external calls=0；offending body不保存 |
| `same-digest-replay` | 同normalized key、channel、operation、digest且existing=`Completed` | 只读取matching immutable stored command surface，返回原refs/issues/order；fresh response可标识stored replay | UoW、Clock、ID、resolver、domain member、repository writes、capture、collaboration全0 |
| `different-digest` | 同normalized key但operation/digest/channel不对称 | `ApplicationError::IdempotencyConflict`；winner record/result不变 | body、winner写、result覆盖、外部调用全0 |
| `concurrent-loser` | 两个fresh request竞争相同owner/version/unique key | 一个exact Durable winner；loser为`OptimisticConflict`/`UniquenessConflict`或formal duplicate classification，必须exact reload后判定 | loser staged effects不可见；不得last-write-wins或盲重试 |
| `staged-fault` | 在该flow每个required save/capture/result/complete位置依次注入失败 | original closed error；rollback成功时本UoW成员均不可见；rollback失败保留`TransactionRollbackFailed` precedence contract | partial truth/sidecar/material/capture/stored result/Completed=0 |
| `commit-resolution` | commit返回`NotDurable`或`Unknown` | `NotDurable`走exact no-durable恢复；`Unknown`使用same transaction ref + barrier + linearizable `resolve_commit`，未闭合仍为`CommitOutcomeUnknown` | 不根据timeout/log/一次missing猜成功或失败；不blind rerun |
| `post-commit-failure` | local UoW已Durable，optional handoff/collaboration失败 | 保留committed command outcome；只返回/记录formal typed post-commit outcome或独立failure surface | 不rollback/改写local truth、stored result、capture；不创建local delivery lifecycle |

### 7.2 Command 用例矩阵

| TC / exact cut | 场景 / P | Owner-specific 前置与分支 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-CMD-001` / `CUT-FLOW-C-01` | 建立 capability access context / P0 | valid intake与source reference；分支含invalid candidate/source、duplicate identity key、resolver non-resolved和§7.1全分支 | 执行 `command_establish_capability_access_context_flow` | exact `EstablishCapabilityAccessContext` result；`CapabilityIdentityState`按formal intake形成`Active/Candidate/Unresolved`，review/source-state、identity change/trace、stored result/captures同UoW | external identity truth、governance approval、runtime execution写=0；transaction-local中间态不单独可见 | identity/source/review owner与version；Created/ReviewFactAttached records顺序；actual material union；one immutable replay | `DR-CH-FLOW-C-001` | L2 + selected L4 mapping / required automated | `EVC-CH-CMD-001` |
| `TC-CH-CMD-002` / `CUT-FLOW-C-02` | 修正 capability identity / P0 | current exact identity + `Loaded.expected_version`；wrong target/stale/terminal/correction no-op及§7.1 | 执行 `command_correct_capability_identity_flow` | exact result；request/complete correction只保存formal final identity，change/trace/result/capture同UoW；stale为`OptimisticConflict` | 中间 correction object不单独save/capture；loser不改winner；无外部身份级联 | final state/version+1、两条有序identity records、terminal capture一次、actual material exact | `DR-CH-FLOW-C-002` | L2 + L4 / required automated | `EVC-CH-CMD-002` |
| `TC-CH-CMD-003` / `CUT-FLOW-C-03` | 退役 capability identity / P0 | current nonterminal identity；wrong version、already terminal、current registry guard及§7.1 | 执行 `command_retire_capability_identity_flow` | exact result；identity进入formal `Retired`，Retired change/trace/result/capture同UoW | 不级联删除/退役registry、descriptor、exposure或SDK boundary；terminal rewrite=0 | expected version、one identity record/trace/capture、current index移除和history保留 | `DR-CH-FLOW-C-003` | L2 + L4 / required automated | `EVC-CH-CMD-003` |
| `TC-CH-CMD-004` / `CUT-FLOW-C-04` | 记录 access review fact / P0 | exact identity；body-free review；optional prior current review；raw approval/vote/body、wrong identity、terminal、reason corruption及§7.1 | 执行 `command_record_capability_access_review_fact_flow`；fresh/replay分别注入factory与effect spies | exact result；new review为`CapabilityAccessReviewFactState::Recorded`，必要时old为`Superseded`；fixed reason为exact 59-byte v1并在identity revision/change/trace/material/result/capture中原子、无损传播；reason不进入digest | 不形成approval allow/deny、policy enforcement或governance workflow状态；raw review body不保存；duplicate不调用factory/Clock/ID/mutation/material/capture且不重建reason | prior/current index唯一；review与identity owner对称；history顺序；fresh factory count=1；replay factory count=0；persisted mismatch=`ConsistencyDefect` | `DR-CH-FLOW-C-004` | L2 + L4 / required automated | `EVC-CH-CMD-004` |
| `TC-CH-CMD-005` / `CUT-FLOW-C-05` | 注册 registry entry / P0 | active exact identity且无current registry；missing/terminal identity、unique winner、body leakage及§7.1 | 执行 `command_register_capability_in_registry_flow` | exact result；`RegistryLifecycleState::Registered` entry、change/trace/result/capture同UoW | 不创建descriptor/exposure/listing/runtime route；loser不覆盖current registry | identity link、registry key/current index、Registered record、one trace/capture、actual material | `DR-CH-FLOW-C-005` | L2 + L4 / required automated | `EVC-CH-CMD-005` |
| `TC-CH-CMD-006` / `CUT-FLOW-C-06` | 更新 registry lifecycle / P0 | exact current registry/version；target在public allowlist；reserved/illegal/terminal/stale及§7.1 | 执行 `command_update_registry_lifecycle_state_flow` | exact allowed `RegistryLifecycleState`与`LifecycleChanged` result；illegal为`DomainError::InvalidStateTransition`映射，stale为`OptimisticConflict` | reserved callable route、undeclared exposure/descriptor/material变化=0；winner不变 | exact from/to、guard、version+1、change/trace/capture与actual stale set | `DR-CH-FLOW-C-006` | L2 + L4 / required automated | `EVC-CH-CMD-006` |
| `TC-CH-CMD-007` / `CUT-FLOW-C-07` | 更新 registry visibility basis / P0 | current registry；actual basis delta vs exact no-op；wrong source/applicability/terminal及§7.1 | 执行 `command_update_registry_visibility_basis_flow` | delta时basis revision及formal `VisibilityPending`/`VisibilityBasisChanged` effect；exact same input返回formal no-op surface | no-op时member/save/version/time/history/trace/capture/material全0；不形成runtime authorization | prior/new basis、source revision、state change、version+1、affected material dedup | `DR-CH-FLOW-C-007` | L2 + L4 / required automated | `EVC-CH-CMD-007` |
| `TC-CH-CMD-008` / `CUT-FLOW-C-08` | 退役 registry entry / P0 | current nonterminal registry/version；already retired、wrong owner、active exposure redline及§7.1 | 执行 `command_retire_capability_registry_entry_flow` | exact result；registry进入`Retired`并持久化Retired change/trace/result/capture | 不级联退役identity/descriptor/exposure，不删除history，不产生marketplace delisting | current index、version、one change/trace/capture、actual material；terminal rewrite=0 | `DR-CH-FLOW-C-008` | L2 + L4 / required automated | `EVC-CH-CMD-008` |
| `TC-CH-CMD-009` / `CUT-FLOW-C-09` | 建立 body-free adapter descriptor / P0 | eligible current registry且无current descriptor；valid typed descriptor refs；missing registry/body-bearing/provider payload/unique conflict及§7.1 | 执行 `command_establish_adapter_descriptor_flow` | exact result；transaction-local Draft只在UoW内，first persisted `AdapterDescriptorState::Accepted/Unresolved`及registry effect/change/trace/result/capture原子提交 | raw MCP/A2A/API/provider body、credential、connection/runtime state写=0 | descriptor->registry owner、state、canonical refs、current index、change/capture symmetry | `DR-CH-FLOW-C-009` | L2 + L4 / required automated | `EVC-CH-CMD-009` |
| `TC-CH-CMD-010` / `CUT-FLOW-C-10` | 替换 adapter descriptor / P0 | current `Accepted/Unresolved` predecessor + valid new descriptor；wrong predecessor/terminal/version/unique race及§7.1 | 执行 `command_replace_adapter_descriptor_flow` | old进入formal `Replaced`，new first persisted `Accepted`，two-object/change/trace/result/capture同UoW | 不原地覆盖old、不复用old ID、不调用provider或迁移credential body | predecessor/successor refs、current index唯一、ordered histories、source/capture对称 | `DR-CH-FLOW-C-010` | L2 + L4 / required automated | `EVC-CH-CMD-010` |
| `TC-CH-CMD-011` / `CUT-FLOW-C-11` | 记录 descriptor risk constraint safe summary / P0 | current `Accepted/Unresolved` descriptor；known/unknown risk；forbidden raw material、wrong descriptor、superseded summary及§7.1 | 执行 `command_record_descriptor_risk_constraint_summary_flow` | exact result；new summary按formal mapping为`DescriptorRiskConstraintSummaryState::Available/Partial`，old current `Superseded`，descriptor attachment/change/trace/result/capture同UoW | 不保存policy body、provider response、assessment document或governance decision；raw hit不进入issue | summary owner/state/safe fields、old/new current index、descriptor version和capture | `DR-CH-FLOW-C-011` | L2 + L4 / required automated | `EVC-CH-CMD-011` |
| `TC-CH-CMD-012` / `CUT-FLOW-C-12` | 关联 secret reference与safe summary / P0 | current descriptor + typed secret ref/resolver outcome；unavailable/ref mismatch/raw credential/provider asymmetry及§7.1 | 执行 `command_attach_descriptor_secret_reference_flow` | exact result；secret ref/state与`SecretHandlingSafeSummaryState` body-free summary、descriptor attachment、two histories/result/capture同UoW；impossible return=`ConsistencyDefect` | token/password/key/cert body、resolver raw response、plaintext fallback、provider routing truth写=0 | requested/returned subject/kind/digest、summary state、descriptor version、history/capture symmetry | `DR-CH-FLOW-C-012` | L2 + L3/L4 / required automated | `EVC-CH-CMD-012` |
| `TC-CH-CMD-013` / `CUT-FLOW-C-13` | 关联 governance seam relation / P0 | exact identity/review + typed governance ref/state；missing/invalid review、unresolved wrong branch、approval body、owner mismatch及§7.1 | 执行 `command_attach_governance_seam_relation_flow` | exact result；transaction-local Pending形成first persisted formal `GovernanceSeamState::Active/Unresolved`，change/trace/result/capture原子提交 | governance approval/vote/policy/workflow/enforcement写和调用=0；不把review当approval | identity/review/ref/state/seam owner、state、current index、body-free fields | `DR-CH-FLOW-C-013` | L2 + L4 / required automated | `EVC-CH-CMD-013` |
| `TC-CH-CMD-014` / `CUT-FLOW-C-14` | 替换 governance seam relation / P0 | current allowed seam + prior ref/state + new typed ref；wrong prior/terminal/version/approval mutation及§7.1 | 执行 `command_replace_governance_seam_relation_flow` | old进入`GovernanceSeamState::Replaced`，new relation按formal state形成；change/trace/result/capture同UoW | 不修改governance workflow/approval，不原地覆盖old，不保存policy body | predecessor/successor、source version/current index、history与capture exact | `DR-CH-FLOW-C-014` | L2 + L4 / required automated | `EVC-CH-CMD-014` |
| `TC-CH-CMD-015` / `CUT-FLOW-C-15` | 过期 governance seam relation / P0 | current formal allowed source；safe reason/source version；terminal/wrong owner/version及§7.1 | 执行 `command_expire_governance_seam_relation_flow` | seam进入`GovernanceSeamState::Expired`；change/trace/result/capture同UoW | 不撤销或改变governance approval/policy，不级联identity/registry/exposure | exact source state、reason/source-version、version+1、terminal guard | `DR-CH-FLOW-C-015` | L2 + L4 / required automated | `EVC-CH-CMD-015` |
| `TC-CH-CMD-016` / `CUT-FLOW-C-16` | 关联 method-library asset relation / P0 | exact identity + typed method asset ref/state；body-free locator；wrong subject/kind/body/unresolved branch及§7.1 | 执行 `command_attach_capability_method_relation_flow` | first persisted formal `CapabilityMethodRelationState::Active/Unresolved` relation、change/trace/result/capture同UoW | method definition/version body/source lifecycle/publish状态写=0；不调用method mutation | identity/asset/ref/state/relation对称、current index、body-free fields | `DR-CH-FLOW-C-016` | L2 + L4 / required automated | `EVC-CH-CMD-016` |
| `TC-CH-CMD-017` / `CUT-FLOW-C-17` | 移除 method relation / P0 | current `Active/Unresolved` relation/version；wrong subject/terminal/already removed及§7.1 | 执行 `command_remove_capability_method_relation_flow` | relation进入`CapabilityMethodRelationState::Removed`；change/trace/result/capture同UoW | 不删除/退役/修改method asset，不写method body/source，不级联runtime/marketplace | exact relation owner/version、Removed terminal、history/current index | `DR-CH-FLOW-C-017` | L2 + L4 / required automated | `EVC-CH-CMD-017` |
| `TC-CH-CMD-018` / `CUT-FLOW-C-18` | 建立 formal exposure boundary / P0 | active identity、eligible registry/descriptor/seam/method/ref states齐全；missing/partial/terminal/source mismatch及§7.1 | 执行 `command_establish_formal_exposure_boundary_flow` | exact result；formal `FormalExposureState`和source-symmetric `FormalVisibilityState` first persisted；registry/actual view effects、change/trace/result/capture同UoW | 不执行runtime allow/deny、tool call、SDK publish/client/cache、marketplace listing | complete prerequisite set、exposure/visibility source revision、atomic registry/view symmetry | `DR-CH-FLOW-C-018` | L2 + L4 / required automated | `EVC-CH-CMD-018` |
| `TC-CH-CMD-019` / `CUT-FLOW-C-19` | 更新 formal visibility applicability / P0 | exact exposure/visibility loaded versions；policy-only target；delta/no-op、wrong source revision、illegal pair及§7.1 | 执行 `command_update_formal_visibility_applicability_flow` | exact formal exposure/visibility transition或same-state revision；change/trace/result/capture与actual material同UoW | no-op全effect=0；不调用runtime/SDK client、不把applicability变成authorization | exposure-version/visibility source pair、reason、version/time/history与material union | `DR-CH-FLOW-C-019` | L2 + L4 / required automated | `EVC-CH-CMD-019` |
| `TC-CH-CMD-020` / `CUT-FLOW-C-20` | suspend formal exposure / P0 | current suspendable exposure + matching visibility；illegal/terminal/source mismatch/stale及§7.1 | 执行 `command_suspend_formal_exposure_boundary_flow` | exposure进入`FormalExposureState::Suspended`，visibility按declared propagation保持source symmetry；change/trace/result/capture同UoW | 不取消runtime invocation、不写consumer cache/SDK state、不推断marketplace delist | exact from/to、paired visibility、versions、actual affected material和capture | `DR-CH-FLOW-C-020` | L2 + L4 / required automated | `EVC-CH-CMD-020` |
| `TC-CH-CMD-021` / `CUT-FLOW-C-21` | retire formal exposure / P0 | current retireable exposure + visibility loaded versions；terminal/wrong source/stale及§7.1 | 执行 `command_retire_formal_exposure_boundary_flow` | exposure进入`FormalExposureState::Retired`且visibility按formal retirement source-version对称；change/trace/result/capture原子提交 | 不修改SDK package/client/cache、runtime/tools execution、registry owner或marketplace transaction | dual expected versions、terminal states、history/current index和material propagation | `DR-CH-FLOW-C-021` | L2 + L4 / required automated | `EVC-CH-CMD-021` |
| `TC-CH-CMD-022` / `CUT-FLOW-C-22` | 记录 capability change impact fact / P0 | exact committed change/trace/subject；valid body-free impact；missing/wrong trace/source/synthetic impact及§7.1 | 执行 `command_record_capability_change_impact_fact_flow` | exact impact result；`CapabilityImpactState::Identified` fact、trace revision、change/trace refs、result/capture同UoW | 不调用downstream执行、不伪造consumer feedback/evidence，不从observer推断impact | exact change/trace/subject refs、append revision、impact identity和capture | `DR-CH-FLOW-C-022` | L2 + L4 / required automated | `EVC-CH-CMD-022` |
| `TC-CH-CMD-023` / `CUT-FLOW-C-23` | 记录 traceability handoff summary / P0 | exact trace + optional resolved audit ref；local-only/accepted/failed/unavailable handoff；gap/superseded/wrong ref及§7.1 | 执行 `command_record_traceability_handoff_summary_flow` | local trace revision/stored result先Durable；optional `ObservabilityAuditHandoff` typed outcome独立；C23为唯一current handoff caller | handoff failure不rollback local truth；不写audit body/evidence/signoff；`handoff_audit_export`调用=0 | trace predecessor/gap、audit ref/state、Durable-before-call、request/return symmetry | `DR-CH-FLOW-C-023` | L2 + L3/L4 / required automated | `EVC-CH-CMD-023` |
| `TC-CH-CMD-024` / `CUT-FLOW-C-24` | 记录 canonical reference resolution state / P0 | exact registered subject/kind/current state；different-state、same-value reason delta/no-op、terminal/wrong-kind及§7.1 | 执行 `command_record_reference_resolution_state_flow` | allowed transition或nonterminal same-value reason revision持久化；value+reason完全相同为no-op；state change/result/capture同UoW | 不生成synthetic change refs；no-op全部effects=0；不修复relation/exposure/core truth | 8 kind policy中的exact subset、state-id/source version/reason、capture/material symmetry | `DR-CH-FLOW-C-024` | L2 + L4 / required automated | `EVC-CH-CMD-024` |
| `TC-CH-CMD-025` / `CUT-FLOW-C-25` | 注册 external document reference / P0 | typed body-free document candidate/resolver；optional descriptor ref；body/schema body、wrong kind/digest/owner、Forbidden及§7.1 | 执行 `command_register_external_document_reference_flow` | exact document ref + canonical state + reference change/result/capture同UoW；resolver asymmetry=`ConsistencyDefect` | document/artifact/evidence body、archive lifecycle、raw response写=0；不改descriptor truth | candidate/ref/state subject-kind-digest、optional support ref、stored result/capture | `DR-CH-FLOW-C-025` | L2 + L3/L4 / required automated | `EVC-CH-CMD-025` |
| `TC-CH-CMD-026` / `CUT-FLOW-C-26` | 注册 runtime/tools或SDK consumer reference / P0 | exact closed consumer variant + resolver；wrong union/kind/scope、execution/client/cache material、Forbidden及§7.1 | 执行 `command_register_capability_consumer_reference_flow` | exact consumer ref + canonical state + reference change/result/capture同UoW；variant/result symmetry严格 | runtime/tool execution、invocation result、SDK package/client/cache/token、marketplace truth写=0 | consumer union、subject/kind/digest/state、server-boundary refs、capture/result symmetry | `DR-CH-FLOW-C-026` | L2 + L3/L4 / required automated | `EVC-CH-CMD-026` |

### 7.3 Batch stop-review

| 审查项 | 设计结论 | 缺口 / 后移 |
|---|---|---|
| exact Command identity | `C01..C26 = 26/26`；每个 cut、TC、DR、EVC 一一对应 | 无 |
| owner-specific positive/negative | identity/review 4、registry 4、descriptor 4、relation 5、exposure 4、trace/reference 5全部有正式owner分支 | field-level builders留Step 7 |
| shared abnormal coverage | 每条TC继承8类共享分支：fresh、reject、replay、conflict、race、staged fault、commit resolution、post-commit | fault harness细节留Step 7/8 |
| typed terminal | 只使用exact Command outcome、formal state和closed Domain/Application error；未发明generic success/error | API映射命令留Step 9 |
| zero-effect / responsibility | duplicate、loser、reject、no-op以及approval/method/runtime/marketplace/SDK/provider越权均有零断言 | 无 |
| phase | local UoW Durable先于optional collaboration；post-commit failure不回滚；无delivery lifecycle | 无 |
| evidence truthfulness | `EVC-CH-CMD-*`仅candidate，所有case仍`not_executed` | schema/path/retention留Step 13 |

## 8. Batch `6.3`：33 Query exact-flow cases

### 8.1 每条 Query 必跑的 shared read / no-write branches

每条 `TC-CH-QUERY-*` 都必须执行下表的 resolver-first 和 zero-write contract。row-specific read subject、page shape、freshness和body-free surface由§8.2指定；不得用一条“Query通用测试”代替33条 exact flow。

| Branch key | 前置 / 操作 | Typed oracle | Mandatory zero-effect oracle |
|---|---|---|---|
| `visible-hit` | actor/scope通过`CapabilityReadVisibilityResolverPort`；target owner/version/index合法 | exact single/page `CapabilityQueryResponse<T>` or `CapabilityPageResponse<T>` with formal body, cursor and source revision | no UoW/reserve/save/append/capture/handoff/collaboration/refresh/rebuild/job start |
| `visible-missing-empty` | resolver返回Visible；单对象缺失或集合为空且无内部 contradiction | declared `body=None` / empty typed page; no issue unless exact flow declares one | no fallback scan, first-item guess, material repair, synthetic placeholder or visibility rewrite |
| `not-visible` | resolver返回`NotVisible` before target-body read | exact NotVisible response surface; no body read | body repository/read, resolver mutation, audit/history, external call all zero |
| `degraded` | resolver or persisted material returns closed degraded kind/freshness marker with symmetric subject/source | exact formal degraded/partial/stale/unavailable surface; no raw adapter message | no retry inside Query, rebuild, refresh, UoW, capture or handoff |
| `consistency-defect` | loaded row/sidecar/owner/version/union/index is impossible | `ApplicationError::ConsistencyDefect` and no partial success body | no downgrade to degraded/missing; no repair/reconstruction/retry |
| `page-boundary` | stable scope/order/cursor; empty, first, next, invalid or mismatched cursor variants | exact page order, opaque cursor and scope-bound continuation | no hidden full scan, cursor rewrite, ranking/listing owner or write |

### 8.2 Query 用例矩阵

| TC / exact cut | 场景 / P | Read-specific 前置与分支 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-QUERY-001` / `CUT-FLOW-Q-01` | 读取 capability identity / P0 | visible hit、visible missing、NotVisible、degraded；identity owner/version合法或loaded contradiction | 执行 `query_get_capability_identity_flow` | exact identity single surface；missing为declared empty；degraded使用closed marker；loaded mismatch=`ConsistencyDefect` | resolver-first；不写identity/review/registry，不reserve、不修复current identity | actor/scope decision、identity id/version/state、body presence、no partial row | `DR-CH-FLOW-Q-001` | L2 + selected L4 / required automated | `EVC-CH-QUERY-001` |
| `TC-CH-QUERY-002` / `CUT-FLOW-Q-02` | 搜索 capability identities / P0 | stable scope/order/cursor，empty/next/invalid cursor和NotVisible/degraded | 执行 `query_search_capability_identities_flow` | exact typed identity page、stable order、opaque scope-bound cursor；invalid cursor typed input error | 不全表隐式扫描、不改cursor、不写 projection/history、无identity repair | first/last key、cursor binding、count/item order、visibility per page | `DR-CH-FLOW-Q-002` | L2 + L4 / required automated | `EVC-CH-QUERY-002` |
| `TC-CH-QUERY-003` / `CUT-FLOW-Q-03` | 读取 access review fact / P0 | identity visible；review present/absent；optional exposure semantics；approval-like input forbidden | 执行 `query_get_capability_access_review_fact_flow` | body-free review fact or explicit missing; optional exposure semantics typed; never approval decision | no review append、identity mutation、governance resolver write、approval call | review state/revision/identity link、optional field nullability、no approval field | `DR-CH-FLOW-Q-003` | L2 + L4 / required automated | `EVC-CH-QUERY-003` |
| `TC-CH-QUERY-004` / `CUT-FLOW-Q-04` | 读取 registry entry / P0 | identity-linked current registry visible/missing; retired excluded; owner mismatch fault | 执行 `query_get_capability_registry_entry_flow` | exact current registry single surface or visible missing; retired is not current; contradiction=`ConsistencyDefect` | no registry rebuild/lifecycle update/descriptor creation/exposure decision | identity link, lifecycle state, current index and source revision | `DR-CH-FLOW-Q-004` | L2 + L4 / required automated | `EVC-CH-QUERY-004` |
| `TC-CH-QUERY-005` / `CUT-FLOW-Q-05` | 分页列出 registry entries / P0 | scope-bound page, empty/next/invalid cursor, NotVisible/degraded | 执行 `query_list_capability_registry_entries_flow` | exact registry page/cursor/empty/degraded surface; current-only filter stable | no lifecycle mutation, index rebuild, current-owner repair or hidden scan | collection kind/filter/order/cursor/item owner/version; no retired leakage | `DR-CH-FLOW-Q-005` | L2 + L4 / required automated | `EVC-CH-QUERY-005` |
| `TC-CH-QUERY-006` / `CUT-FLOW-Q-06` | 读取 registry visibility semantics / P0 | registry visible; source-version matching/mismatch; optional exposure/visibility; NotVisible/degraded | 执行 `query_get_registry_visibility_semantics_flow` | exact registry + optional formal visibility surface; source mismatch is explicit typed degraded/consistency per formal branch | no applicability update、exposure activation、runtime authorization或cache write | registry/exposure/visibility source revisions and owner symmetry | `DR-CH-FLOW-Q-006` | L2 + L4 / required automated | `EVC-CH-QUERY-006` |
| `TC-CH-QUERY-007` / `CUT-FLOW-Q-07` | 读取 adapter descriptor / P0 | current descriptor `Accepted/Unresolved` or absent; provider request must not occur; body-free only | 执行 `query_get_adapter_descriptor_flow` | exact body-free descriptor surface; visible missing/degraded; loaded relation fault=`ConsistencyDefect` | no resolver/provider call, descriptor replacement, secret read, registry mutation | descriptor state/current id/ref/version and forbidden body scan | `DR-CH-FLOW-Q-007` | L2 + L3/L4 / required automated | `EVC-CH-QUERY-007` |
| `TC-CH-QUERY-008` / `CUT-FLOW-Q-08` | 读取 descriptor risk summary / P0 | descriptor current; summary Available/Partial/Unavailable/Superseded or absent | 执行 `query_get_descriptor_risk_constraint_summary_flow` | exact safe risk summary state; Superseded excluded from current; partial/unavailable typed | no policy evaluation, summary regeneration, provider/body load or descriptor write | summary state/revision/descriptor link, safe fields only, no raw assessment | `DR-CH-FLOW-Q-008` | L2 + L3/L4 / required automated | `EVC-CH-QUERY-008` |
| `TC-CH-QUERY-009` / `CUT-FLOW-Q-09` | 读取 descriptor secret safe summary / P0 | registered descriptor/secret ref; summary available/unavailable; NotVisible/Forbidden/redacted | 执行 `query_get_descriptor_secret_safe_summary_flow` | ref/state/safe summary only; secret value never returned; redacted boundary typed | no credential provider call, secret rotation, descriptor mutation or raw response read | subject/kind/digest/state, safe handling marker, zero sensitive material scan | `DR-CH-FLOW-Q-009` | L2 + L3/L4 / required automated | `EVC-CH-QUERY-009` |
| `TC-CH-QUERY-010` / `CUT-FLOW-Q-10` | 按 capability 列出 descriptors / P0 | capability-bound page; current Accepted/Unresolved; empty/cursor/degraded | 执行 `query_list_descriptors_by_capability_flow` | exact descriptor page with stable order/cursor and body-free fields | no provider scan, descriptor creation/replacement, registry repair or hidden full scan | capability filter, descriptor owner, state, cursor, current-only rule | `DR-CH-FLOW-Q-010` | L2 + L4 / required automated | `EVC-CH-QUERY-010` |
| `TC-CH-QUERY-011` / `CUT-FLOW-Q-11` | 读取 governance seam relation / P0 | seam current/nonterminal or absent; governance ref/state; approval body forbidden | 执行 `query_get_governance_seam_relation_flow` | exact body-free seam/ref/state surface; no approval decision | no governance resolver write, approval/workflow call, seam replacement or policy mutation | seam state/ref/revision/identity link; no approval/vote/body | `DR-CH-FLOW-Q-011` | L2 + L4 / required automated | `EVC-CH-QUERY-011` |
| `TC-CH-QUERY-012` / `CUT-FLOW-Q-12` | 读取 access/governance separation / P0 | identity/review and seam may be present/absent; conflicting approval-like data | 执行 `query_get_access_governance_separation_flow` | exact separated review/seam surface; never returns allow/deny/approval authority | no policy decision, governance mutation, exposure activation or approval call | review fact and seam refs independently mapped; no merged decision field | `DR-CH-FLOW-Q-012` | L2 + L4 / required automated | `EVC-CH-QUERY-012` |
| `TC-CH-QUERY-013` / `CUT-FLOW-Q-13` | 读取 capability method relation / P0 | relation Active/Unresolved/Removed or absent; method ref body-free; wrong subject | 执行 `query_get_capability_method_relation_flow` | exact relation/ref/state surface; method body not loaded; missing distinct from contradiction | no method-library mutation/execution/body load/publish state write | identity/asset ref/kind/state/version and body scan | `DR-CH-FLOW-Q-013` | L2 + L4 / required automated | `EVC-CH-QUERY-013` |
| `TC-CH-QUERY-014` / `CUT-FLOW-Q-14` | 分页列出 capability relations / P0 | kind-bound collection, empty/cursor, wrong-kind and degraded | 执行 `query_list_capability_relations_flow` | exact relation-kind page; no cross-kind union or hidden source scan | no relation repair, method/governance resolver write, exposure mutation | relation kind filter, owner, order/cursor, no body and no cross-kind leakage | `DR-CH-FLOW-Q-014` | L2 + L4 / required automated | `EVC-CH-QUERY-014` |
| `TC-CH-QUERY-015` / `CUT-FLOW-Q-15` | 读取 formal exposure boundary / P0 | exposure current plus optional visibility; pending/suspended/retired/unavailable exact states | 执行 `query_get_formal_exposure_boundary_flow` | exact exposure + formal visibility surface; no runtime authorization implication | no exposure transition, registry mutation, runtime/tool call, SDK cache write | exposure state/version, visibility source-version symmetry and typed optionality | `DR-CH-FLOW-Q-015` | L2 + L4 / required automated | `EVC-CH-QUERY-015` |
| `TC-CH-QUERY-016` / `CUT-FLOW-Q-16` | 读取 formal visibility applicability / P0 | exposure source version and typed applicability scope; mismatch/partial/not-visible/degraded | 执行 `query_get_formal_visibility_applicability_flow` | exact applicability state/source pair; not a runtime decision | no policy reevaluation, exposure mutation, authorization or cache write | scope member set, source revision, state, no allow/deny mapping | `DR-CH-FLOW-Q-016` | L2 + L4 / required automated | `EVC-CH-QUERY-016` |
| `TC-CH-QUERY-017` / `CUT-FLOW-Q-17` | 读取 controlled consumer view / P0 | final Ready/Partial or stale/unavailable typed material; rebuild marker is not silently repaired | 执行 `query_get_controlled_consumer_view_flow` | exact `DescriptorConsumerSummary`-based body-free view and `ConsumerViewFreshnessState`; persisted source contradiction=`ConsistencyDefect` | no refresh/rebuild/UoW/capture/job start; no runtime consumer call | consumer set, exposure/ref source revision, freshness, partial reasons and owner | `DR-CH-FLOW-Q-017` | L2 + L4 / required automated | `EVC-CH-QUERY-017` |
| `TC-CH-QUERY-018` / `CUT-FLOW-Q-18` | 列出 runtime/tools consumable capabilities / P0 | consumer-bound view; unregistered consumer and NotVisible/degraded branches | 执行 `query_list_consumable_capabilities_for_runtime_tools_flow` | exact controlled-view page/empty/unavailable marker; no execution authorization | runtime/tools invocation, tool call, execution result, cache write, exposure mutation=0 | consumer ref membership, view freshness, no execution fields, cursor | `DR-CH-FLOW-Q-018` | L2 + L4 / required automated | `EVC-CH-QUERY-018` |
| `TC-CH-QUERY-019` / `CUT-FLOW-Q-19` | 读取 SDK exposure boundary / P0 | exact SDK consumer subject; dual subject resolver decision; NotVisible/degraded/wrong relation | 执行 `query_get_sdk_exposure_boundary_flow` | server-side exposure boundary only; missing relation remains typed empty/degraded per formal card | SDK package/client/cache/binding/release call=0; no exposure mutation or provider call | SDK subject vs exposure subject, source-version union, evaluation time and typed surface | `DR-CH-FLOW-Q-019` | L2 + L4 / required automated | `EVC-CH-QUERY-019` |
| `TC-CH-QUERY-020` / `CUT-FLOW-Q-20` | 读取 capability access trace / P0 | append-only trace page; historical/current refs; empty/cursor/degraded | 执行 `query_get_capability_access_trace_flow` | exact trace revisions/page and body-free refs; gaps/duplicate highest are `ConsistencyDefect` | no trace append, handoff, audit export, material rebuild or observer write | revision continuity, subject, change refs, cursor/order, no body | `DR-CH-FLOW-Q-020` | L2 + L4 / required automated | `EVC-CH-QUERY-020` |
| `TC-CH-QUERY-021` / `CUT-FLOW-Q-21` | 读取 capability change impact / P0 | exact or trace-linked impact; missing/partial/delayed/resolved; synthetic relation | 执行 `query_get_capability_change_impact_flow` | exact impact surface/state; no synthetic impact from current truth or logs | no impact append, downstream call, trace repair or evidence generation | change/trace/impact refs, state, version and source linkage | `DR-CH-FLOW-Q-021` | L2 + L4 / required automated | `EVC-CH-QUERY-021` |
| `TC-CH-QUERY-022` / `CUT-FLOW-Q-22` | 读取 downstream consumption impact summary / P0 | body-free feedback summary; partial/unavailable; consumer/ref mismatch | 执行 `query_get_downstream_consumption_impact_summary_flow` | exact typed feedback summary page/surface; degraded marker source-symmetric | no downstream mutation, command/job start, source truth rewrite or handoff | consumer ref, impact revision, disposition/state, no execution payload | `DR-CH-FLOW-Q-022` | L2 + L4 / required automated | `EVC-CH-QUERY-022` |
| `TC-CH-QUERY-023` / `CUT-FLOW-Q-23` | 读取 audit handoff trace summary / P0 | trace/audit refs and states; optional handoff; audit body forbidden | 执行 `query_get_audit_handoff_trace_summary_flow` | body-free trace/audit-ref surface; missing optional ref distinct from contradiction | no handoff call, audit export, archive/evidence body load or write | trace/audit ref/state, handoff outcome, no raw body/alias/signoff | `DR-CH-FLOW-Q-023` | L2 + L4 / required automated | `EVC-CH-QUERY-023` |
| `TC-CH-QUERY-024` / `CUT-FLOW-Q-24` | 搜索 capability directory / P0 | freshness-aware projection; stable scope/filter/cursor; stale/unavailable/empty | 执行 `query_search_capability_directory_flow` | exact directory page + `DirectoryProjectionState`; stale/unavailable stays typed | no projection rebuild, ranking/listing write, registry mutation or hidden scan | projection source revision, order/filter/cursor, freshness, current owner | `DR-CH-FLOW-Q-024` | L2 + L4 / required automated | `EVC-CH-QUERY-024` |
| `TC-CH-QUERY-025` / `CUT-FLOW-Q-25` | 浏览 capability directory / P0 | browse page differs from search filter; stale/empty/cursor | 执行 `query_browse_capability_directory_flow` | exact browse projection surface; no marketplace/listing semantics | no ranking/listing owner, marketplace transaction, projection repair or write | browse scope/order/cursor, projection state, source revision and no listing fields | `DR-CH-FLOW-Q-025` | L2 + L4 / required automated | `EVC-CH-QUERY-025` |
| `TC-CH-QUERY-026` / `CUT-FLOW-Q-26` | 读取 audit-friendly export summary / P0 | body-free saved summary; ready/partial/stale/unavailable; no archive body | 执行 `query_get_audit_friendly_export_summary_flow` | exact `AuditExportState` and safe summary/ref surface; incomplete source typed | no export rebuild, audit body/evidence read, handoff or signoff mutation | scope/trace/ref set, state/reason, count and body-free rule | `DR-CH-FLOW-Q-026` | L2 + L4 / required automated | `EVC-CH-QUERY-026` |
| `TC-CH-QUERY-027` / `CUT-FLOW-Q-27` | 读取 read-only ecosystem discovery summary / P0 | discovery Ready/Partial/Stale/Unavailable; no marketplace listing | 执行 `query_get_read_only_ecosystem_discovery_summary_flow` | exact read-only discovery summary/material; no transaction or listing authority | marketplace listing/order/price/purchase/settlement/fulfillment calls and writes=0 | source refs, discovery state/reason, no listing/transaction fields | `DR-CH-FLOW-Q-027` | L2 + L4 / required automated | `EVC-CH-QUERY-027` |
| `TC-CH-QUERY-028` / `CUT-FLOW-Q-28` | 读取 capability reconciliation report / P0 | immutable report outcome and scope; duplicate/missing/corrupt report | 执行 `query_get_capability_reconciliation_report_flow` | exact immutable report/page and `ReconciliationReportState` outcome; missing allowed only declared no-report path; asymmetry=`ConsistencyDefect` | no rerun/rebuild/registry repair/current-truth reconstruction | report id/version/scope/item count/outcome/result refs immutable | `DR-CH-FLOW-Q-028` | L2 + L4 / required automated | `EVC-CH-QUERY-028` |
| `TC-CH-QUERY-029` / `CUT-FLOW-Q-29` | 读取 canonical reference resolution state / P0 | eight kind-specific policy matrices; all seven values; wrong kind/body/terminal | 执行 `query_get_reference_resolution_state_flow` | exact `ReferenceResolutionValue` and kind-specific typed surface; no generic string state | no resolver refresh, state transition, relation/exposure mutation or external body load | kind, subject, state, reason/source revision, variant applicability | `DR-CH-FLOW-Q-029` | L2 + L4 / required automated | `EVC-CH-QUERY-029` |
| `TC-CH-QUERY-030` / `CUT-FLOW-Q-30` | 读取 external document reference / P0 | registered body-free doc ref; Invalid/Forbidden/Unavailable/Resolved; body prohibited | 执行 `query_get_external_document_reference_flow` | exact ref/state safe view; Invalid/Forbidden retains registered body-free ref marker per formal card | no document/archive/evidence body load, resolver refresh, descriptor mutation or audit body access | subject/kind/digest/state/redaction marker, no locator body | `DR-CH-FLOW-Q-030` | L2 + L3/L4 / required automated | `EVC-CH-QUERY-030` |
| `TC-CH-QUERY-031` / `CUT-FLOW-Q-31` | 读取 runtime/tools consumer reference / P0 | exact consumer union; Resolved/non-resolved/unavailable; wrong variant | 执行 `query_get_runtime_tools_consumer_reference_flow` | ref/state only; no execution result or authorization | tool invocation, runtime execution, provider request, cache write or exposure mutation=0 | consumer kind, subject/digest/state, server boundary only | `DR-CH-FLOW-Q-031` | L2 + L4 / required automated | `EVC-CH-QUERY-031` |
| `TC-CH-QUERY-032` / `CUT-FLOW-Q-32` | 读取 SDK exposure consumer reference / P0 | exact SDK union; unresolved/forbidden/unavailable; client material prohibited | 执行 `query_get_sdk_exposure_consumer_reference_flow` | ref/state/server-boundary safe surface; no SDK package/client/cache | SDK client/package/binding/release call, cache write, external body and exposure mutation=0 | SDK subject/kind/digest/state, boundary ref and redaction | `DR-CH-FLOW-Q-032` | L2 + L4 / required automated | `EVC-CH-QUERY-032` |
| `TC-CH-QUERY-033` / `CUT-FLOW-Q-33` | 读取 observability/audit reference / P0 | exact audit ref/state; body-free historical/available/unavailable; forbidden telemetry body | 执行 `query_get_observability_audit_reference_flow` | exact ref/state safe surface; no telemetry/audit body or evidence alias | no observer emission, sink call, audit export, handoff or business mutation | ref kind/subject/digest/state, redaction marker, no raw telemetry/body | `DR-CH-FLOW-Q-033` | L2 + L3/L4 / required automated | `EVC-CH-QUERY-033` |

### 8.3 Batch stop-review

| 审查项 | 设计结论 | 缺口 / 后移 |
|---|---|---|
| exact Query identity | `Q01..Q33 = 33/33`；每条有独立 TC/DR/EVC | 无 |
| resolver-first | 33/33 rows明确先做 visibility decision，再读取target body | resolver fake / data builder留Step 7 |
| normal vs technical | missing/empty/NotVisible/degraded与loaded contradiction、raw Port failure分离 | exact failure injection留Step 7/9 |
| strict no-write | 每条继承UoW/reserve/save/append/capture/handoff/collaboration/refresh/rebuild=0 | source spy命令留Step 9 |
| page/cursor | Q02/Q05/Q10/Q14/Q18/Q24/Q25及相关collection query均有scope/order/cursor断言 | cursor data matrix留Step 7 |
| responsibility boundary | approval/runtime/tools/method body/provider/marketplace/SDK client/audit body均只作为negative oracle | 无 |
| phase / evidence | 未把Query触发Job/rebuild或后续EV写入；只使用`EVC-CH-QUERY-*` | schema/path/retention留Step 13 |

Batch `6.3` 的完成状态表示 33 条 Query 设计记录完整，测试执行仍为 `not_executed`。

## 9. Batch `6.4`：6 Inbound + 10 Outbound + 8 Job exact-flow cases

### 9.1 三族共享 branch contract

#### Inbound shared branches

| Branch | Action / typed oracle | Mandatory zero-effect / phase oracle |
|---|---|---|
| header/schema/source gate | 在payload decode前验证source family/actor/event/schema；unsupported返回`CapabilityInboundReceiptDisposition::UnsupportedSchema` + `NoLocalEffect`，`result_ref=None` | decode、reserve、UoW、resolver、all writes=0 |
| fresh accepted | exact body-free payload + resolver/ref/feedback前置；返回`Accepted`、`result_ref=Some`和actual effect refs；receipt/result/`Completed`同UoW | 只写该consumer声明的ref/state或summary，不自动执行follow-up Command |
| unchanged / delayed | exact no-change为stored `Ignored + NoLocalEffect`；temporary prerequisite无completed receipt时为`Delayed + RetryRequired + NoLocalEffect` | no canonical revision/capture/material unless exact accepted write；Delayed不伪造result ref |
| rejected / quarantined | stable invalid typed field为`Rejected`；forbidden body/owner contradiction/new Forbidden为`Quarantined + BoundaryQuarantined + NoLocalEffect` | offending body不保存；unrelated core truth writes=0 |
| duplicate / conflict | same digest只`get_consumer_receipt`并返回`DuplicateReplayed + StoredReplay`；different digest保持winner并typed conflict/quarantine | resolver、Clock、ID、UoW、writes、follow-up execution=0 |
| technical contradiction | matching resolver成功返回的subject/kind/digest/summary不对称或loaded pair损坏 | exact `ApplicationError::ConsistencyDefect`；不得降格Rejected/Delayed或修复 |

#### Outbound shared phases

| Phase / branch | Action / typed oracle | Mandatory zero-effect / phase oracle |
|---|---|---|
| A success | 从exact committed-source candidate在source UoW内形成完整 envelope bytes、snapshot、`CapabilityEventCaptureState::Captured`；source/snapshot/capture同commit | B collaboration在Durable前调用=0；mapper不读external status |
| A failure | 对source/snapshot/capture各写点、codec/digest注入failure | whole source UoW rollback；无accepted source/snapshot/capture；B/C=0 |
| B typed outcome | commit后只从`get_with_snapshot`/AwaitingIntent读取official bytes调用collaboration；接受formal `EventCollaborationStatus` | 不回查current truth、不重跑mapper、不rollback source、不创建本地delivery state |
| B raw failure | collaboration Port未形成typed return | `ApplicationError::PortFailure`或formal repair handoff；local capture仍`Captured` | source/result/capture bytes不变；不猜Delivered/Failed |
| C bind/reentry | typed outcome给出stable intent时，以独立short UoW CAS `Captured -> IntentBound`；race/Unknown走exact resolution | 只绑定同source/snapshot/schema/digest/captured-time intent；不覆盖winner，不建attempt/DLQ |

#### Job shared branches

| Branch | Action / typed oracle | Mandatory zero-effect / phase oracle |
|---|---|---|
| pre-entry reject | wrong job name/schema/metadata/input/scope | `CapabilityJobProtocolDisposition::Rejected`，`report=None` | Clock/scan/reserve/journal/application dispatch=0 |
| fresh plan | reserve winner后稳定scan/collect形成deterministic frozen plan并保存`CapabilityJobExecutionState::Planned` | 不在target阶段rescan scope；plan identity/order不可变 |
| per-target | 只执行first `Planned` ordinal；每target一个UoW并单写`CapabilityJobExecutionTargetOutcome` terminal | prior/next target、core truth和其他Job effects=0；terminal cell不可覆盖 |
| safe terminalization | normal missing/inapplicable或closed eligible dependency failure必须具备exact target、closed issue、typed impact与zero-effect/confirmed rollback | loaded contradiction、codec、rollback failure、commit Unknown不可terminalize，target保持`Planned` |
| final | all targets terminal后，typed report + `Finalized` journal + `Completed` reservation同一final UoW | 不把partial等同失败，不以public disposition替代journal state |
| duplicate/reentry | completed same digest只读matching typed report；Reserved + Planned按frozen plan重入；race loser rollback并一次exact winner read | 不递归调用Job入口、不重建plan、不重跑terminal target、不从current truth重构report |

### 9.2 Inbound 用例矩阵：6/6

| TC / exact cut | 场景 / P | Owner-specific 前置与分支 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-INBOUND-001` / `CUT-FLOW-I-01` | 消费 governance result reference change / P0 | valid governance source/ref/safe summary；unavailable/no-change/wrong actor/body/summary mismatch/new Forbidden/duplicate及§9.1 | 执行 `inbound_consume_governance_result_reference_changed_flow` | accepted时只写governance ref/canonical state并返回exact receipt；可给`GovernanceSeamReview` marker；matching resolver asymmetry=`ConsistencyDefect` | seam/approval/vote/Policy/workflow/exposure写=0；marker不自动Command | source actor/event/schema/key；subject/kind/digest/state；effect refs与receipt/result对称 | `DR-CH-FLOW-I-001` | L2+L4 / required automated | `EVC-CH-INBOUND-001` |
| `TC-CH-INBOUND-002` / `CUT-FLOW-I-02` | 消费 method asset reference change / P0 | body-free asset kind/locator；unavailable/no-change/body/source code/target contradiction/duplicate及§9.1 | 执行 `inbound_consume_method_asset_reference_changed_flow` | accepted只写method ref/state；可给`MethodRelationReview` marker；exact receipt/replay | method relation、method definition/version/source/publish/runtime cache写=0 | candidate digest、existing/new target、state transition、changed refs、no method body | `DR-CH-FLOW-I-002` | L2+L4 / required automated | `EVC-CH-INBOUND-002` |
| `TC-CH-INBOUND-003` / `CUT-FLOW-I-03` | 消费 downstream impact report / P0 | exact impact revision + registered runtime/tools/SDK consumer + body-free feedback；temporary missing/wrong actor/execution payload/no-change/duplicate | 执行 `inbound_consume_downstream_consumption_impact_reported_flow` | accepted append exact `DownstreamConsumptionImpactSummary` state/ref and receipt；valid reported Delayed state仍可accepted；processing unavailable为receipt `Delayed` | source impact/core truth、runtime execution、tool result、authorization、consumer cache和exposure写=0 | impact/consumer refs、feedback union、summary state、receipt refs/markers distinction | `DR-CH-FLOW-I-003` | L2+L4 / required automated | `EVC-CH-INBOUND-003` |
| `TC-CH-INBOUND-004` / `CUT-FLOW-I-04` | 消费 external capability source reference change / P0 | exact source candidate/locator；resolver states；wrong subject/actor/body/provider material/digest collision/duplicate | 执行 `inbound_consume_external_capability_source_reference_changed_flow` | accepted只写external source ref/state；可给`CapabilityIdentityIntakeReview` marker；typed receipt | identity/descriptor/registry、MCP tool call、A2A processing、API invocation、provider health/route/cost/failover写=0 | source family、subject/kind/digest/state、no-body、effect/follow-up refs | `DR-CH-FLOW-I-004` | L2+L4 / required automated | `EVC-CH-INBOUND-004` |
| `TC-CH-INBOUND-005` / `CUT-FLOW-I-05` | 消费 audit material reference change / P0 | typed audit locator/ref；unavailable/no-change/raw log/span/metric/alert/audit/evidence body、wrong actor、duplicate | 执行 `inbound_consume_audit_material_reference_changed_flow` | accepted只写observability/audit ref/state；可给`AuditHandoffReview` marker；exact typed receipt | trace handoff/audit export/evidence alias/signoff/observer emission和raw material写=0 | subject/kind/digest/state、redaction、receipt changed refs和marker | `DR-CH-FLOW-I-005` | L2+L4 / required automated | `EVC-CH-INBOUND-005` |
| `TC-CH-INBOUND-006` / `CUT-FLOW-I-06` | 消费 external document reference change / P0 | typed document kind/locator；unavailable/no-change/document/schema/guide body、wrong target/digest/actor、duplicate | 执行 `inbound_consume_external_document_reference_changed_flow` | accepted只写document ref/state；可给`DescriptorSupportReview` marker；exact receipt | descriptor mutation、document/artifact/archive body、schema import、provider call和evidence写=0 | target variant、kind/digest/state、receipt effect refs、body-free scan | `DR-CH-FLOW-I-006` | L2+L4 / required automated | `EVC-CH-INBOUND-006` |

### 9.3 Outbound 用例矩阵：10/10

| TC / exact cut | 场景 / P | Exact source与分支 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-OUTBOUND-001` / `CUT-FLOW-O-01` | `CapabilityIdentityChanged` capture/collaborate / P0 | exact identity change record；wrong variant/version/body、A fault、B typed/raw failure、C race/Unknown | 执行 `outbound_capability_identity_changed_capture_and_collaborate_flow` 的A/B/C | identity source envelope + immutable snapshot/`Captured` Durable；typed collaboration；optional exact intent bind | external identity/runtime body、current identity remap、source rollback、local delivery state=0 | source/change/trace、snapshot five-tuple+bytes、routing family、intent symmetry | `DR-CH-FLOW-O-001` | L2+L3 / required automated | `EVC-CH-OUTBOUND-001` |
| `TC-CH-OUTBOUND-002` / `CUT-FLOW-O-02` | `CapabilityRegistryChanged` capture/collaborate / P0 | exact registry change record only；reconciliation report/source mismatch及§9.1 A/B/C | 执行 `outbound_capability_registry_changed_capture_and_collaborate_flow` | exact registry event snapshot/capture/collaboration/bind | report不伪造registry event；no listing/runtime truth/current rebuild | source variant、registry revision、snapshot digest/schema/trace、intent | `DR-CH-FLOW-O-002` | L2+L3 / required automated | `EVC-CH-OUTBOUND-002` |
| `TC-CH-OUTBOUND-003` / `CUT-FLOW-O-03` | `AdapterDescriptorChanged` capture/collaborate / P0 | exact descriptor change record；provider/secret/body-bearing payload及§9.1 A/B/C | 执行 `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` | body-free descriptor event envelope/snapshot/capture；typed external outcome | provider request/credential/secret body/connection state和source rollback=0 | descriptor/change refs、safe payload、five-tuple、no sensitive bytes | `DR-CH-FLOW-O-003` | L2+L3 / required automated | `EVC-CH-OUTBOUND-003` |
| `TC-CH-OUTBOUND-004` / `CUT-FLOW-O-04` | `GovernanceSeamRelationChanged` capture/collaborate / P0 | exact seam change record；approval/Policy/vote/workflow material及§9.1 | 执行 `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` | exact body-free seam event snapshot/capture/outcome/bind | governance approval/policy copy、workflow mutation和source rollback=0 | relation/ref/state/change refs、payload allowlist、intent symmetry | `DR-CH-FLOW-O-004` | L2+L3 / required automated | `EVC-CH-OUTBOUND-004` |
| `TC-CH-OUTBOUND-005` / `CUT-FLOW-O-05` | `CapabilityMethodRelationChanged` capture/collaborate / P0 | exact method relation change record；method body/version/source及§9.1 | 执行 `outbound_capability_method_relation_changed_capture_and_collaborate_flow` | exact body-free relation event snapshot/capture/outcome/bind | method-library body/lifecycle mutation、runtime execution和source rollback=0 | identity/asset/relation refs、state/version、payload no-body、five-tuple | `DR-CH-FLOW-O-005` | L2+L3 / required automated | `EVC-CH-OUTBOUND-005` |
| `TC-CH-OUTBOUND-006` / `CUT-FLOW-O-06` | `FormalExposureBoundaryChanged` capture/collaborate / P0 | exact exposure change record；runtime allow/deny/SDK client/cache material及§9.1 | 执行 `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` | exact exposure/visibility body-free event/capture/outcome/bind | runtime authorization/execution、SDK package/client/cache、marketplace listing写=0 | exposure/visibility source revision、consumer refs、no allow/deny field | `DR-CH-FLOW-O-006` | L2+L3 / required automated | `EVC-CH-OUTBOUND-006` |
| `TC-CH-OUTBOUND-007` / `CUT-FLOW-O-07` | controlled view availability changed / P0 | exact controlled-view revision only；wrong source/current read/cache owner merge及§9.1 | 执行 `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` | exact material source/version snapshot/capture/outcome/bind | no consumer cache ownership、view refresh、exposure mutation或runtime call | view ref/version/freshness/source refs、snapshot trace/digest | `DR-CH-FLOW-O-007` | L2+L3 / required automated | `EVC-CH-OUTBOUND-007` |
| `TC-CH-OUTBOUND-008` / `CUT-FLOW-O-08` | change impact identified outbound / P0 | exact identified impact revision；synthetic/log-derived/current-truth impact及§9.1 | 执行 `outbound_capability_change_impact_identified_capture_and_collaborate_flow` | exact impact source snapshot/capture/outcome/bind | no synthetic impact/evidence/downstream execution、no source mutation/rollback | impact/change/trace/consumer refs、state/version、five-tuple | `DR-CH-FLOW-O-008` | L2+L3 / required automated | `EVC-CH-OUTBOUND-008` |
| `TC-CH-OUTBOUND-009` / `CUT-FLOW-O-09` | derived material refreshed outbound / P0 | only directory/audit-export/ecosystem/reconciliation four variants；controlled-view/wrong/listing source及§9.1 | 执行 `outbound_derived_material_refreshed_capture_and_collaborate_flow` | exact allowed material ref/version snapshot/capture/outcome/bind | no ranking/listing/marketplace transaction、no current rebuild或report-as-truth | variant allowlist、material version/state/ref、payload body-free | `DR-CH-FLOW-O-009` | L2+L3 / required automated | `EVC-CH-OUTBOUND-009` |
| `TC-CH-OUTBOUND-010` / `CUT-FLOW-O-10` | canonical reference resolution changed / P0 | exact state revision/kind/source；raw external body/wrong kind/digest及§9.1 | 执行 `outbound_reference_resolution_changed_capture_and_collaborate_flow` | exact body-free reference state event snapshot/capture/outcome/bind | no resolver refresh、relation/exposure/core repair、raw body或source rollback | subject/kind/state ref/revision/reason marker、five-tuple/intent | `DR-CH-FLOW-O-010` | L2+L3 / required automated | `EVC-CH-OUTBOUND-010` |

### 9.4 Operations Job 用例矩阵：8/8

| TC / exact cut | 场景 / P | Exact plan/target分支 | 输入 / 操作 | Expected / typed oracle | Zero-effect oracle | 细化断言点 | Data requirement | Layer / 自动化 | Evidence candidate |
|---|---|---|---|---|---|---|---|---|---|
| `TC-CH-JOB-001` / `CUT-FLOW-J-01` | registry reconciliation / P0 | frozen registry/snapshot scope；consistent/partial/inconsistent/rebuild-required/failure target；crash/replay | 执行 `job_run_capability_registry_reconciliation_flow` | immutable body-free report + per-target terminal + final typed response/journal; exact `ReconciliationReportState` outcome | registry/identity/descriptor/exposure repair、Command和current truth rewrite=0 | plan order、snapshot refs、report id/state/issues、journal/report/result same ref | `DR-CH-FLOW-J-001` | L2+L4 / required automated | `EVC-CH-JOB-001` |
| `TC-CH-JOB-002` / `CUT-FLOW-J-02` | refresh controlled consumer view / P0 | frozen exposure/consumer target；Ready/Partial/no-op/missing/failure；crash/reentry | 执行 `job_refresh_controlled_consumer_view_flow` | each target saves final Ready/Partial view or safe terminal issue；typed final report | no intermediate Rebuilding/Unavailable save；no exposure/core/runtime cache mutation | frozen summaries/source versions、target outcome、view/capture/journal symmetry | `DR-CH-FLOW-J-002` | L2+L4 / required automated | `EVC-CH-JOB-002` |
| `TC-CH-JOB-003` / `CUT-FLOW-J-03` | rebuild directory search/browse projection / P0 | frozen truth snapshot；Ready/no-op/missing/fault；crash/reentry | 执行 `job_rebuild_directory_search_browse_projection_flow` | final `DirectoryProjectionState::Ready` revision/capture or safe target outcome；typed report | no registry/source/ranking/listing/marketplace mutation；no intermediate state save | stable target/order/source marker、projection version、capture/target/report | `DR-CH-FLOW-J-003` | L2+L4 / required automated | `EVC-CH-JOB-003` |
| `TC-CH-JOB-004` / `CUT-FLOW-J-04` | prepare audit-friendly export summary / P0 | frozen trace/scope/ref targets；Ready/Partial/Unavailable/no-op/fault；crash | 执行 `job_prepare_audit_friendly_export_summary_flow` | body-free `AuditExportState` summary/ref set、terminal targets、typed report | raw audit/log/evidence body、alias、archive、acceptance signoff写=0 | exact scope/trace/ref set、state/reason/count、capture/journal/report | `DR-CH-FLOW-J-004` | L2+L4 / required automated | `EVC-CH-JOB-004` |
| `TC-CH-JOB-005` / `CUT-FLOW-J-05` | rebuild read-only ecosystem discovery / P0 | frozen formal applicability/source targets；Ready/Partial/Unavailable/no-op/failure | 执行 `job_rebuild_read_only_ecosystem_discovery_summary_flow` | exact read-only discovery state/summary/capture + terminal target/report | no marketplace listing/ranking/price/order/transaction/fulfillment、no exposure mutation | applicability refs、frozen plan/state/reason、target/capture/report symmetry | `DR-CH-FLOW-J-005` | L2+L4 / required automated | `EVC-CH-JOB-005` |
| `TC-CH-JOB-006` / `CUT-FLOW-J-06` | derived material reconciliation / P0 | frozen material scope；Unchanged/mismatch/report outcomes；target fault/crash/replay | 执行 `job_run_derived_material_reconciliation_flow` | immutable reconciliation report/capture + terminal target + typed final response | no nested rebuild Job/Command、no automatic material/core truth repair | target identities、comparison inputs、report outcome/refs、journal/result | `DR-CH-FLOW-J-006` | L2+L4 / required automated | `EVC-CH-JOB-006` |
| `TC-CH-JOB-007` / `CUT-FLOW-J-07` | refresh external reference resolution / P0 | frozen 8-kind targets；Updated/Unchanged/terminal skipped/preclassified failed；resolver fault | 执行 `job_refresh_external_reference_resolution_flow` | exact canonical state revision/capture or typed target terminal；final report | no terminal candidate recovery、relation/exposure/identity/descriptor/core repair、raw body保存 | kind/subject/digest/current state、observation symmetry、target outcome/journal | `DR-CH-FLOW-J-007` | L2+L3+L4 / required automated | `EVC-CH-JOB-007` |
| `TC-CH-JOB-008` / `CUT-FLOW-J-08` | repair event collaboration / P0 | frozen awaiting-intent capture/intent targets；same intent/bind、external status、fault/race/crash/reentry | 执行 `job_repair_capability_access_event_collaboration_flow` | official snapshot/capture validated；local exact bind + terminal journal or typed external intent repair outcome；final report | no new event/snapshot/candidate、no mapper rerun/current truth read/local delivery lifecycle；no split-UoW facade | capture five-tuple/bytes、intent/source symmetry、bind CAS、target/journal/report | `DR-CH-FLOW-J-008` | L2+L3+L4 / required automated | `EVC-CH-JOB-008` |

### 9.5 Batch stop-review

| 审查项 | 设计结论 | 缺口 / 后移 |
|---|---|---|
| exact identities | `I01..I06=6/6`、`O01..O10=10/10`、`J01..J08=8/8`；24条均有TC/DR/EVC | 无 |
| Inbound header/receipt | schema/source先于decode/reserve；7 disposition、marker/result-ref规则及duplicate replay闭合 | envelope builders留Step 7 |
| Inbound responsibility | follow-up仅marker；seam/method/identity/descriptor/audit handoff不自动写 | 无 |
| Outbound A/B/C | 10/10保持source UoW capture、post-Durable collaboration、short-UoW bind独立 | crash harness留Step 7/8 |
| Outbound owner | physical topic/broker/group/relay/attempt/DLQ/delivery state均未进入case正向oracle | route product留P1/Step 8 |
| Job plan/target/final | 8/8保持frozen plan、per-target UoW、terminal cell和final report/journal/result对称 | plan dataset留Step 7 |
| Job failure fidelity | safe terminalization与consistency/codec/rollback/Unknown保持Planned分离 | fault automation留Step 9 |
| evidence truthfulness | 所有`EVC-CH-INBOUND/OUTBOUND/JOB-*`仅candidate，测试仍未执行 | Step 13收敛 |

## 10. Batch `6.5`：24 state-family executable cases 与 638-pair registry

### 10.1 Shared state branch contract

下表由每条 `TC-CH-STATE-*` 共同消费，但不能替代 §10.3 的24条canonical case record。每个mutable / external-boundary family必须消费全部ordered `from != to` pair；`ReconciliationReportState`只消费formation outcomes，不伪造mutable pair。

| Branch key | 前置 / 操作 | Typed / carrier oracle | Mandatory zero-effect oracle |
|---|---|---|---|
| `formation-accepted` | exact factory input、owner/ref/kind/policy和initial source value合法 | exact initial variant、required/optional field truth table、version/time/ref symmetry及首次持久化规则 | transaction-local Draft/Pending不得单独save/expose/capture；未声明owner调用=0 |
| `formation-rejected` | invalid/forbidden/wrong owner/kind/ref/body或不在initial subset | exact contract/domain/policy/application rejection | ID/Clock、object、repository、history、trace、capture、material、external call均为0 |
| `current-pair` | `SP-CH-*` classification=`current`，exact owner member/policy/Port operation与current flow可达 | exact target variant、field delta、version/time/history/capture/UoW或external observation contract | 不得经generic status mapper、repository trigger、DB cascade或未声明flow推进 |
| `reserved-pair` | `SP-CH-*` classification=`reserved` | 若有domain member只做owner-level guard test；integration/flow oracle固定为route/call count 0 | truth save、history、trace、capture、material、result、external effect均为0；启用必须受控回开03/05 |
| `illegal-pair` | `SP-CH-*` classification=`illegal` | `DomainError::InvalidStateTransition`或该owner已声明的closed policy/boundary/invariant mapping | field/version/time/history/trace/capture/material/result/UoW commit和外部调用均为0 |
| `same-state-delta` | formal member允许且至少一个declared field实际变化 | owner-specific version +1、field/reason/source/history/capture规则；不计入638分母 | 未变化字段与其他owner保持不变；不得生成第二lifecycle owner |
| `same-state-no-op` | state与全部正式比较字段完全相同，或completed duplicate | exact no-op / stored replay surface | member/save/Clock/ID/history/trace/capture/material/scan/resolver/collaboration均为0 |
| `terminal/payload` | terminal source或terminal same-variant payload replacement | exact terminal rejection；后续有效事实使用new object/run/relation | reopen、payload overwrite、delete/upsert、current-index回流均为0 |

### 10.2 `SP-CH-*` exact parameter registry contract

638-pair义务采用可机械展开的稳定参数注册表，不采用family抽样。每个参数记录必须具备：

```text
pair_id
family
kind                         # only ReferenceResolutionValue; otherwise absent
from_variant
to_variant
classification               # current | reserved | illegal
owner_callable_or_external_edge
current_flow_refs
typed_error_or_terminal
zero_effect_profile
formal_source_anchor
```

ID规则为 `SP-CH-<FAMILY>-<FROM>-<TO>`；reference专用规则为 `SP-CH-REFERENCE-<KIND>-<FROM>-<TO>`。token使用formal Rust type / variant的ASCII upper-snake转写；payload variant只用variant名，payload另存参数字段。每个family按下表有序variant集合生成全部 `from != to` 笛卡尔积，再逐行复制 `03_ddd_step_10_state_matrix.md` 的裁决。不得根据callable存在、实现分支或错误文本重新推断classification。

| TC | Family / exact ordered variants | Pair source | current | reserved | illegal | total |
|---|---|---|---:|---:|---:|---:|
| `TC-CH-STATE-001` | `CapabilityIdentityState`: Candidate, Active, CorrectionPending, Unresolved, Retired | Step 10 §§15/18 | 6 | 4 | 10 | 20 |
| `TC-CH-STATE-002` | `CapabilityAccessReviewFactState`: Draft, Recorded, Superseded, Invalidated | §§16/18 | 2 | 2 | 8 | 12 |
| `TC-CH-STATE-003` | `RegistryLifecycleState`: Draft, Registered, Undescribed, Ungoverned, VisibilityPending, FormalVisible, Retired | §§17/18 | 17 | 2 | 23 | 42 |
| `TC-CH-STATE-004` | `AdapterDescriptorState`: Draft, Accepted, Unresolved, Replaced, Retired | §§20/25 | 4 | 5 | 11 | 20 |
| `TC-CH-STATE-005` | `DescriptorRiskConstraintSummaryState`: Available, Partial, Unavailable, Superseded | §§21/25 | 3 | 6 | 3 | 12 |
| `TC-CH-STATE-006` | `SecretHandlingSafeSummaryState`: Available, Stale, Unavailable, Forbidden | §§22/25 | 0 | 9 | 3 | 12 |
| `TC-CH-STATE-007` | `GovernanceSeamState`: Pending, Active, Unresolved, Expired, Replaced, Forbidden | §§23/25 | 6 | 11 | 13 | 30 |
| `TC-CH-STATE-008` | `CapabilityMethodRelationState`: Pending, Active, Stale, Removed, Unresolved, Forbidden | §§24/25 | 4 | 13 | 13 | 30 |
| `TC-CH-STATE-009` | `FormalExposureState`: Draft, Pending, Accepted, Active, Suspended, Unavailable, Retired | §§28/33 | 16 | 0 | 26 | 42 |
| `TC-CH-STATE-010` | `FormalVisibilityState`: NotVisible, Pending, Visible, Unavailable, Retired | §§29/33 | 9 | 4 | 7 | 20 |
| `TC-CH-STATE-011` | `TraceabilityState`: Recorded, Partial, HandoffPending, Superseded | §§30/33 | 2 | 7 | 3 | 12 |
| `TC-CH-STATE-012` | `CapabilityImpactState`: Identified, Partial, Delayed, Ignored, Resolved | §§31/33 | 0 | 10 | 10 | 20 |
| `TC-CH-STATE-013` | `DownstreamImpactSummaryState`: Received, Partial, Delayed, Unavailable, Ignored | §§32/33 | 0 | 13 | 7 | 20 |
| `TC-CH-STATE-014` | `ConsumerViewFreshnessState`: Ready, Partial, Stale, Rebuilding, Unavailable | §§36/41 | 12 | 7 | 1 | 20 |
| `TC-CH-STATE-015` | `DirectoryProjectionState`: Ready, Stale, Rebuilding, Unavailable | §§37/41 | 6 | 5 | 1 | 12 |
| `TC-CH-STATE-016` | `AuditExportState`: Ready, Partial, Unavailable, Stale | §§38/41 | 12 | 0 | 0 | 12 |
| `TC-CH-STATE-017` | `EcosystemDiscoveryState`: Ready, Partial, Unavailable, Stale | §§39/41 | 12 | 0 | 0 | 12 |
| `TC-CH-STATE-018` | `ReferenceResolutionValue`: Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden；GovernanceResult另含Expired；8 kind矩阵 | §§43~52 | 116 | 0 | 136 | 252 |
| `TC-CH-STATE-019` | `CapabilityEventCaptureState`: Captured, IntentBound | §§55/57 | 1 | 0 | 1 | 2 |
| `TC-CH-STATE-020` | `CapabilityIdempotencyState`: Reserved, Completed | §§60/63 | 1 | 0 | 1 | 2 |
| `TC-CH-STATE-021` | `CapabilityJobExecutionState`: Planned, Finalized | §§61/63 | 1 | 0 | 1 | 2 |
| `TC-CH-STATE-022` | `CapabilityJobExecutionTargetOutcome`: Planned, Succeeded(_), Failed(_), Skipped(_) | §§62/63 | 3 | 0 | 9 | 12 |
| `TC-CH-STATE-023` | external `EventCollaborationStatus`: Candidate, PendingDelivery, Delivered, Failed, HandoffUnavailable | §§56/57 | 6 | 0 | 14 | 20 |
| `TC-CH-STATE-024` | immutable `ReconciliationReportState`: Completed, Partial, Inconsistent, RebuildRequired, Failed | §§40/41 | n/a | n/a | n/a | 0 mutable；5 formation |

Reference kind分解必须保持：

| Kind | Applicable variants | current | reserved | illegal | total |
|---|---:|---:|---:|---:|---:|
| ExternalCapabilitySource | 6 | 14 | 0 | 16 | 30 |
| GovernanceResult | 7 | 18 | 0 | 24 | 42 |
| MethodAsset | 6 | 14 | 0 | 16 | 30 |
| Secret | 6 | 14 | 0 | 16 | 30 |
| ExternalDocument | 6 | 14 | 0 | 16 | 30 |
| RuntimeToolsConsumer | 6 | 14 | 0 | 16 | 30 |
| SdkConsumer | 6 | 14 | 0 | 16 | 30 |
| ObservabilityAudit | 6 | 14 | 0 | 16 | 30 |
| **total** | **49 kind-applicable mentions / 7 enum variants** | **116** | **0** | **136** | **252** |

### 10.3 State canonical case records：24/24

每行都执行 §10.1 适用分支并消费 §10.2 对应完整参数集。`DR-CH-STATE-*` 在 Step 7 落为deterministic registry/builder；`EVC-*` 仍只是candidate。

| TC / exact cut | 场景 / P | Owner-specific 前置与操作 | Expected / typed oracle | Zero-effect与细化断言 | Data / layer / automation | Evidence candidate |
|---|---|---|---|---|---|---|
| `TC-CH-STATE-001` / `CUT-STATE-01` | identity formation/correction/retirement / P0 | 3 accepted + 3 rejected initial values；20 pairs；review-link delta/no-op；correction两步同UoW | exact identity state；correction只保存final Active；Retired terminal；illegal为closed domain/policy error | CorrectionPending独立save/capture=0；reserved activation flow=0；retire不级联registry/descriptor/exposure | `DR-CH-STATE-001`;L1+L2 / required generated matrix | `EVC-CH-STATE-001` |
| `TC-CH-STATE-002` / `CUT-STATE-02` | body-free review fact / P0 | Draft->Recorded transaction-local、replacement、12 pairs、same duplicate | Recorded current / old Superseded；marker/owner/link exact；terminal immutable | Draft独立save=0；invalidate integration=0；approval/vote/policy advancement=0 | `DR-CH-STATE-002`;L1+L2 / required generated matrix | `EVC-CH-STATE-002` |
| `TC-CH-STATE-003` / `CUT-STATE-03` | registry lifecycle/basis/descriptor/exposure / P0 | direct Registered factory、42 pairs、descriptor/basis same-state、exposure-derived target | exact lifecycle/change/version；FormalVisible只由final Active+Visible exposure owner形成 | Draft persistence=0；public FormalVisible/Retired target=0；same target registry effects=0；no listing/runtime truth | `DR-CH-STATE-003`;L1+L2 / required generated matrix | `EVC-CH-STATE-003` |
| `TC-CH-STATE-004` / `CUT-STATE-04` | descriptor formation/replacement / P0 | Draft in-memory->Accepted/Unresolved；20 pairs；risk/secret attachment delta | final descriptor only；old current Replaced；wrong owner/body/state typed reject | Draft save=0；retire/degrade reserved flow=0；provider route/quota/cost/failover=0 | `DR-CH-STATE-004`;L1+L2 / required generated matrix | `EVC-CH-STATE-004` |
| `TC-CH-STATE-005` / `CUT-STATE-05` | risk safe-summary / P0 | Available/Partial factory、replacement、12 pairs | exact safe coarse summary；old Superseded；Forbidden body rejected pre-save | six reserved flow calls=0；approval/runtime inference/raw risk body=0 | `DR-CH-STATE-005`;L1+L2 / required generated matrix | `EVC-CH-STATE-005` |
| `TC-CH-STATE-006` / `CUT-STATE-06` | secret-handling safe-summary / P0 | Available/Unavailable formation、12 pairs、terminal Forbidden guard | exact body-free summary/ref state relation；existing pair current count 0 | all 9 reserved integration calls=0；secret/KMS/Vault/body read/write/log=0 | `DR-CH-STATE-006`;L1+L2 / required generated matrix | `EVC-CH-STATE-006` |
| `TC-CH-STATE-007` / `CUT-STATE-07` | governance seam relation / P0 | Pending in-memory->Active/Unresolved；expiry/replacement；30 pairs | exact local relation state/ref/history；Replaced/Forbidden terminal | Pending save=0；11 reserved calls=0；governance approval/workflow/policy write=0 | `DR-CH-STATE-007`;L1+L2 / required generated matrix | `EVC-CH-STATE-007` |
| `TC-CH-STATE-008` / `CUT-STATE-08` | method-library asset relation / P0 | Pending in-memory->Active/Unresolved；remove；30 pairs | exact body-free relation/ref/history；Removed/Forbidden terminal | Pending save=0；13 reserved calls=0；method body/source/publication/execution mutation=0 | `DR-CH-STATE-008`;L1+L2 / required generated matrix | `EVC-CH-STATE-008` |
| `TC-CH-STATE-009` / `CUT-STATE-09` | formal exposure lifecycle / P0 | Draft in-memory；42 pairs；prerequisite recovery/degradation/suspend/retire | exact exposure target and lifecycle record；Retired terminal | Draft save=0；26 illegal pair effects=0；runtime authorization/SDK/listing=0 | `DR-CH-STATE-009`;L1+L2 / required generated matrix | `EVC-CH-STATE-009` |
| `TC-CH-STATE-010` / `CUT-STATE-10` | visibility/applicability/source-version / P0 | 20 pairs；policy-only target；Pending/Visible/Unavailable same-state reevaluation | exact state/scope/basis/final exposure version symmetry；typed membership | 4 reserved route calls=0；illegal/no-op writes=0；consumer/runtime authorization inference=0 | `DR-CH-STATE-010`;L1+L2 / required generated matrix | `EVC-CH-STATE-010` |
| `TC-CH-STATE-011` / `CUT-STATE-11` | append-only trace revision / P0 | Recorded/Partial factory；12 pairs；HandoffPending same-state revision | exact gap/superseded/ref truth table；one appended version；post-commit handoff independent | 7 reserved flow calls=0；Superseded rewrite=0；Port outcome does not close local trace | `DR-CH-STATE-011`;L1+L2 / required generated matrix | `EVC-CH-STATE-011` |
| `TC-CH-STATE-012` / `CUT-STATE-12` | impact fact formation/reserved lifecycle / P0 | Identified factory；20 pairs；consumer-set/trace symmetry | exact Identified fact；reserved member guard unit surface；Ignored/Resolved terminal | all existing-state integration mutation=0；feedback/timeout/material不得反写impact | `DR-CH-STATE-012`;L1+L2 / required generated matrix | `EVC-CH-STATE-012` |
| `TC-CH-STATE-013` / `CUT-STATE-13` | downstream feedback summary formation / P0 | five state-specific factories；20 pairs；new event new summary | exact observation/gap/reason field truth table、version1 | 13 reserved integration calls=0；source impact/trace/core truth writes=0；Ignored reopen=0 | `DR-CH-STATE-013`;L1+L2 / required generated matrix | `EVC-CH-STATE-013` |
| `TC-CH-STATE-014` / `CUT-STATE-14` | controlled view freshness / P0 | Ready/Partial formation；20 pairs；changed same-state vs exact match | exact summary/partial kinds/source versions；changed revision atomic；Unavailable terminal rule per matrix | 7 reserved flow calls=0；Query/client write=0；no synthetic repair | `DR-CH-STATE-014`;L1+L2 / required generated matrix | `EVC-CH-STATE-014` |
| `TC-CH-STATE-015` / `CUT-STATE-15` | directory projection freshness / P0 | Ready formation；12 pairs；refresh/stale/no-op | exact source chain/facets/order/version；changed save+capture+journal atomic | 5 reserved calls=0；ranking/source truth/listing write=0；Stale no-op effects=0 | `DR-CH-STATE-015`;L1+L2 / required generated matrix | `EVC-CH-STATE-015` |
| `TC-CH-STATE-016` / `CUT-STATE-16` | audit export material / P0 | Ready/Partial/Unavailable formation；12 current pairs；same-state/no-op | exact reason/resolved-ref subset/source versions；final-only save | raw log/span/metric/audit/GRC/evidence/signoff body=0；exact match all effects=0 | `DR-CH-STATE-016`;L1+L2 / required generated matrix | `EVC-CH-STATE-016` |
| `TC-CH-STATE-017` / `CUT-STATE-17` | read-only ecosystem discovery / P0 | Ready/Partial/Unavailable formation；12 current pairs；same-state/no-op | exact exposure/context/source-version shell；`is_listing_truth=false` | marketplace listing/transaction/ranking/runtime write=0；exact match all effects=0 | `DR-CH-STATE-017`;L1+L2 / required generated matrix | `EVC-CH-STATE-017` |
| `TC-CH-STATE-018` / `CUT-STATE-18` | canonical reference 8-kind policy / P0 | kind-specific initial subset、252 pairs、same-value reason revision/no-op | exact subject/kind/value/reason/version；terminal Invalid/Forbidden and Governance Expired rules | wrong-kind/body rejects；terminal resolver=0；no dependent truth auto-repair；no generic resolver | `DR-CH-STATE-018`;L1+L2+L3 / required generated matrix | `EVC-CH-STATE-018` |
| `TC-CH-STATE-019` / `CUT-STATE-19` | local capture bind / P0 | capture formation、2 pairs、five external status outcomes、same/different intent reentry | Captured+None v1；one IntentBound+stable intent revision；source/snapshot fields immutable | no local delivery status/attempt/queue；bind rollback leavesCaptured；IntentBound collaborate/bind=0 | `DR-CH-STATE-019`;L1+L2+L3 / required generated matrix | `EVC-CH-STATE-019` |
| `TC-CH-STATE-020` / `CUT-STATE-20` | idempotency winner lifecycle / P0 | reserve formation、2 pairs、same/different digest/race/corrupt result | Reserved->Completed only withsame immutable result；winner fields immutable | no persisted Conflict；duplicate effects=0；Completed reopen/result replacement=0 | `DR-CH-STATE-020`;L1+L2+L3 / required generated matrix | `EVC-CH-STATE-020` |
| `TC-CH-STATE-021` / `CUT-STATE-21` | Job execution journal / P0 | complete Planned formation、2 pairs、target progression、zero-target/final rollback | Finalized only all terminal and same result ref withstored report+Completed | no Running/attempt/lease；all-terminal pre-final remainsPlanned；reentry scan/target effect=0 | `DR-CH-STATE-021`;L1+L2+L3 / required generated matrix | `EVC-CH-STATE-021` |
| `TC-CH-STATE-022` / `CUT-STATE-22` | ordinal target outcome / P0 | Planned formation、12 pairs、success/failure/skip payload symmetry、race | one terminal cell;Succeeded/Failed/Skipped payload matches plan；terminal immutable | unsafe/rollback failure remainsPlanned；Unchanged isSucceeded；terminal overwrite/effect mismatch=0 | `DR-CH-STATE-022`;L1+L2+L3 / required generated matrix | `EVC-CH-STATE-022` |
| `TC-CH-STATE-023` / `CUT-STATE-23` | external collaboration owner boundary / P0 | 20 external pairs；collaborate/get/list/repair guard与five statuses | exact Port-owned current item/source/intent/reason；6 current edges and repair viaPending | local status repository/save=0；get/list authority=0；Candidate/Delivered repair=0；source rollback=0 | `DR-CH-STATE-023`;L2+L3 / required Port contract matrix | `EVC-CH-STATE-023` |
| `TC-CH-STATE-024` / `CUT-STATE-24` | immutable reconciliation outcome / P0 | five factory outcomes、empty/incomplete no-report、new run/replay | version1 immutable report；Failed iff reason Some；other reason None；new run new ID | update/supersede/nested rebuild/core/material write=0；duplicate append/rescan=0 | `DR-CH-STATE-024`;L1+L2 / required formation matrix | `EVC-CH-STATE-024` |

### 10.4 Seven-group arithmetic 与 Batch stop-review

| Group | Families / boundary | Variants | current | reserved | illegal | pairs |
|---|---:|---:|---:|---:|---:|---:|
| `10.1` | identity/review/registry | 16 | 25 | 8 | 41 | 74 |
| `10.2` | descriptor/summaries/seams | 25 | 17 | 44 | 43 | 104 |
| `10.3` | exposure/visibility/trace/impact | 26 | 27 | 34 | 53 | 114 |
| `10.4` | 4 mutable materials + immutable report | 17 mutable + 5 immutable | 42 | 12 | 2 | 56 mutable |
| `10.5` | canonical reference / 8 kind matrices | 7 enum / 49 kind mentions | 116 | 0 | 136 | 252 |
| `10.6` | local capture + external boundary | 2 + 5 | 7 | 0 | 15 | 22 |
| `10.7` | idempotency + Job execution/target | 2 + 2 + 4 | 5 | 0 | 11 | 16 |
| **total** | **24 families；23 mutable/boundary + 1 immutable** | **111 active** | **239** | **98** | **301** | **638** |

```text
638 = 74 + 104 + 114 + 56 + 252 + 22 + 16
638 = 239 current + 98 reserved + 301 illegal
unclassified = 0
```

审计结论：24/24 canonical state cases、111/111 active variants和638/638 pair parameter identities均有owner与source；formation/same-state/no-op/terminal不偷计pair。旧Step 10 §68.3残留的`304 illegal`为`historical_discrepancy_superseded`，不得进入fixture、suite、报告或验收分母；当前唯一口径为§66和正式03 §9的`301`。本批没有测试执行、run、artifact、evidence alias或pass结论。

## 11. Batch `6.6`：transaction / binding / observability executable cases

### 11.1 Shared transaction、assembly 与 observer discipline

| Discipline | Required execution / oracle | Prohibited shortcut |
|---|---|---|
| transaction outcome | every commit injection returns exact `Durable / NotDurable / Unknown`; Unknown uses same transaction ref, barrier and linearizable `resolve_commit` | timeout/log/replica/missing-once inference, blind retry or accepted surface before resolution |
| rollback precedence | original pre-commit closed error remains primary; rollback failure is independently retained through the formal aggregate/surface | replacing original failure, persisting a failed business fact or compensating write |
| winner preservation | CAS/uniqueness/idempotency race has one Durable winner; loser exact-reloads only where formal algorithm says so | last-write-wins, merge, overwrite, generated-plan reuse or generic retry |
| assembly completeness | typed root and Stage 0~7 candidate become externally usable only after complete graph and entry barrier | partial root/facade/listener/task exposure, fallback branch or second authority |
| profile/binding | only formal Local/Integration/Deployment rows and exact Configured/Fake/Disabled/Missing semantics | profile widening, Missing-as-Disabled, Deployment fake or product-specific inference |
| observation authority | logs/metrics/spans/events/durable projections observe existing typed carriers and never source a business decision | observer result as truth, retry/state mutation, error classification from text or recursive fallback |
| business byte equivalence | Off/Redacted/sink-failure permutations preserve exact public/application response and persisted carrier bytes | diagnostic field insertion into protocol/result, observer-driven rollback or cancellation |

### 11.2 Transaction / consistency / idempotency cases：22/22

| TC / exact cut | 场景 / P | 前置与输入 / fault | Expected / typed oracle | Zero-effect与细化断言 | Data / layer / automation | Evidence candidate |
|---|---|---|---|---|---|---|
| `TC-CH-TX-001` / `CUT-TX-01` | 22 traits / 110 methods contract parity / P0 | per-method success/missing/page/order/CAS/unique/wrong key/index fixture；fake与selected durable复用参数 | exact typed return/error、key/index/order/version；same logical contract | hidden finder/full scan/first-row guess/adapter UoW=0；method identity可定位 | `DR-CH-TX-001`;L3 / required parameter contract | `EVC-CH-TX-001` |
| `TC-CH-TX-002` / `CUT-TX-02` | write timing and winner / P0 | create/update/append/insert-only valid and stale/duplicate inputs | create absent、update only `Loaded.expected_version`、append/insert uniqueness；winner bytes unchanged | timestamp/object version/cursor不得充当token；loser overwrite/history/capture=0 | `DR-CH-TX-002`;L1+L3 / required contract+races | `EVC-CH-TX-002` |
| `TC-CH-TX-003` / `CUT-TX-03` | same-UoW atomic member visibility / P0 | each declared Command/Inbound/Job target atomic set；observe before/after commit | before commit none externally visible；after `Durable` source/change/trace/material/capture/result all visible and symmetric | partial member visibility、second UoW、pre-Durable collaboration=0 | `DR-CH-TX-003`;L2+L3 / required staged visibility | `EVC-CH-TX-003` |
| `TC-CH-TX-004` / `CUT-TX-04` | staged failure rollback / P0 | inject failure at every save/append/capture/result/complete position；rollback succeeds | original closed write error；all staged members absent; winner/current unchanged | failed business fact、partial index/history/capture/result/Completed=0 | `DR-CH-TX-004`;L2+L3 / required fault matrix | `EVC-CH-TX-004` |
| `TC-CH-TX-005` / `CUT-TX-05` | rollback failure precedence / P0 | known pre-commit failure followed by one/multiple ordered rollback causes | formal primary original error plus typed ordered cleanup/rollback diagnostic | no replacement/flatten/raw error/compensating write/failed truth record | `DR-CH-TX-005`;L2+L3 / required fault matrix | `EVC-CH-TX-005` |
| `TC-CH-TX-006` / `CUT-TX-06` | commit `NotDurable` / P0 | complete staged UoW; commit returns stable NotDurable | exact no-durable recovery/application surface；no accepted carrier/projection | response success、stored result/completion、post-commit collaboration=0；staged effects absent | `DR-CH-TX-006`;L2+L3 / required commit tri-state | `EVC-CH-TX-006` |
| `TC-CH-TX-007` / `CUT-TX-07` | commit `Unknown` resolution / P0 | same tx ref resolves Durable, NotDurable or remains Unknown after barrier | Durable returns existing exact carrier；NotDurable follows no-durable branch；unclosed=`CommitOutcomeUnknown` | blind rerun/second reserve/new IDs/log inference/replica guess=0 | `DR-CH-TX-007`;L2+L3 / required resolution matrix | `EVC-CH-TX-007` |
| `TC-CH-TX-008` / `CUT-TX-08` | absent reservation winner / P0 | valid canonical key/digest; atomic reserve absent | exactly one `Reserved` with immutable channel/operation/digest/trace/time；fresh effect allowed once | second reservation/effect before winner/digest normalization drift=0 | `DR-CH-TX-008`;L2+L3 / required concurrency | `EVC-CH-TX-008` |
| `TC-CH-TX-009` / `CUT-TX-09` | same-digest loser replay / P0 | local candidate/Job plan staged; reserve returns matching Existing Completed or formal Job Reserved | rollback/discard local candidate；one exact winner read；stored shell/receipt/report replay or frozen-plan resume | ID/Clock/scan/resolver/factory/write/capture/collaboration=0 on completed replay；no replan | `DR-CH-TX-009`;L2+L3 / required race/replay | `EVC-CH-TX-009` |
| `TC-CH-TX-010` / `CUT-TX-10` | different-digest collision / P0 | same normalized key but channel/operation/digest mismatch against Reserved/Completed | `ApplicationError::IdempotencyConflict`; existing winner and result unchanged | winner read beyond safe classification、effect、overwrite、persisted Conflict=0 | `DR-CH-TX-010`;L2+L3 / required race | `EVC-CH-TX-010` |
| `TC-CH-TX-011` / `CUT-TX-11` | corrupt/missing stored surface / P0 | Completed points to missing, wrong-operation, wrong-schema/ref or malformed immutable result/receipt/report | `ApplicationError::ConsistencyDefect` with safe typed context | current truth reconstruction、business rerun、result repair、winner mutation=0 | `DR-CH-TX-011`;L2+L3 / required corruption | `EVC-CH-TX-011` |
| `TC-CH-TX-012` / `CUT-TX-12` | orphan Reserved Command/Inbound / P0 | committed Reserved has no safe matching terminal surface | formal in-progress only where transaction visibility proves it; otherwise consistency defect | second reserve/blind retry/effect/reconstruction/auto-expiry state=0 | `DR-CH-TX-012`;L2+L3 / required orphan matrix | `EVC-CH-TX-012` |
| `TC-CH-TX-013` / `CUT-TX-13` | matching Job Reserved+Planned reentry / P0 | exact key/digest/job/schema/run and symmetric complete frozen journal | resume smallest Planned ordinal or pure finalization；terminal targets retained | scope rescan/replan/target append/reorder/reexecute terminal target=0 | `DR-CH-TX-013`;L2+L3 / required reentry | `EVC-CH-TX-013` |
| `TC-CH-TX-014` / `CUT-TX-14` | asymmetric Job journal / P0 | Reserved without journal or wrong key/digest/job/schema/run/plan/result linkage | `ConsistencyDefect`; existing carrier unchanged | plan regeneration/current source substitution/second journal/reserve=0 | `DR-CH-TX-014`;L2+L3 / required corruption | `EVC-CH-TX-014` |
| `TC-CH-TX-015` / `CUT-TX-15` | two writers same expected version / P0 | simultaneous owner mutation/material refresh/bind/target terminal writes | one Durable exact winner；loser exact typed conflict and policy-bounded reload only | last-write-wins/merge/automatic retry/second terminal/history/capture=0 | `DR-CH-TX-015`;L1+L2+L3 / required deterministic race | `EVC-CH-TX-015` |
| `TC-CH-TX-016` / `CUT-TX-16` | collect-before-mutate material race / P0 | stable typed affected-ref lists overlap and contain stale/current/missing/asymmetric rows | deterministic deduplicated union/order；each eligible exact material revised at most once；conflict typed | full scan/private finder/double revision/synthetic ref/partial stale set=0 | `DR-CH-TX-016`;L2+L3 / required race | `EVC-CH-TX-016` |
| `TC-CH-TX-017` / `CUT-TX-17` | Outbound Phase A crash / P0 | inject at source, snapshot, capture saves and commit tri-state | source+immutable snapshot+Captured all visible only after Durable；exact recovery by source/capture refs | collaboration/get/bind before Durable=0；no transient-only candidate | `DR-CH-TX-017`;L2+L3 / required crash matrix | `EVC-CH-TX-017` |
| `TC-CH-TX-018` / `CUT-TX-18` | Outbound Phase B failure / P0 | local A Durable; collaborate/get timeout, typed failure or invalid response | local source/snapshot/capture unchanged；exact Port/application failure/outcome | rollback/delete/rebuild/current truth read/local delivery status/second capture=0 | `DR-CH-TX-018`;L2+L3 / required Port fault | `EVC-CH-TX-018` |
| `TC-CH-TX-019` / `CUT-TX-19` | Outbound Phase C race/Unknown / P0 | same stable intent bind by concurrent writers；commit Durable/NotDurable/Unknown | at most one IntentBound revision；same-intent exact recovery/get；different intent typed conflict | observer-triggered collaborate、second intent/version+2/source rewrite=0 | `DR-CH-TX-019`;L2+L3 / required CAS+resolution | `EVC-CH-TX-019` |
| `TC-CH-TX-020` / `CUT-TX-20` | Job crash-point symmetry / P0 | inject initial, every target effect/journal, collaboration, final result/finalize/complete boundary | each UoW independently recoverable；effect iff matching target terminal；final three-owner same ref | rollback earlier terminal targets、unsafe failure terminalization、rescan/reexecute=0 | `DR-CH-TX-020`;L2+L3+L4 / required phase matrix | `EVC-CH-TX-020` |
| `TC-CH-TX-021` / `CUT-TX-21` | cursor/index asymmetry / P0 | corrupt cursor/order/index owner/current relation or page continuation | exact typed invalid-cursor/consistency error；stable prior winner/data unchanged | generic full scan/fallback/sort repair/first-row guess/synthetic ref=0 | `DR-CH-TX-021`;L2+L3 / required corruption | `EVC-CH-TX-021` |
| `TC-CH-TX-022` / `CUT-TX-22` | canonical digest boundary / P0 | four domains; same semantic fields, permutations, channel/domain changes, excluded retry metadata | stable canonical bytes/digest for same semantics；business/domain/channel changes separate；codec failure typed | `Debug`/Display/pretty/map order/raw body/algorithm selector/fallback hash=0 | `DR-CH-TX-022`;L1+L2 / required vectors+property | `EVC-CH-TX-022` |

### 11.3 Configuration / external binding cases：12/12

| TC / exact cut | 场景 / P | 前置与输入 / fault | Expected / typed oracle | Zero-effect与细化断言 | Data / layer / automation | Evidence candidate |
|---|---|---|---|---|---|---|
| `TC-CH-BIND-001` / `CUT-BIND-01` | typed root / Stage 0~7 completeness / P0 | valid root/profile/entry；missing/invalid/unknown/conflicting source and each stage fault | one complete immutable root/graph only after all validation; exact `RuntimeAssembly` failure otherwise | partial graph/root/constructor/entry/facade exposure=0；owned prefix disposed | `DR-CH-BIND-001`;L1+L3+L4 / required assembly matrix | `EVC-CH-BIND-001` |
| `TC-CH-BIND-002` / `CUT-BIND-02` | Local/Deployment profile authority / P0 | Local durable and parity fake；Deployment durable candidate；inject fake/Disabled local authority | Local exact parity accepted；Deployment fake or required local Disabled rejected before graph | second authority/in-memory Deployment/fallback/reduced local graph=0 | `DR-CH-BIND-002`;L3 / required profile matrix | `EVC-CH-BIND-002` |
| `TC-CH-BIND-003` / `CUT-BIND-03` | Integration external slot state / P0 | each slot Configured/Fake/explicit legal Disabled；Missing/wrong family/dangling ref/profile mismatch | exact typed branch constructed；Missing or illegal row blocks activation；Disabled returns formal `NotConfigured` | Missing->Disabled coercion、cross-family fake/configured fallback、partial activation=0 | `DR-CH-BIND-003`;L3 / required 9-slot matrix | `EVC-CH-BIND-003` |
| `TC-CH-BIND-004` / `CUT-BIND-04` | 27 local/base Ports single authority / P0 | complete authority A graph；second store, private finder, wrong UoW, incomplete method set | 27/27 bind to same logical authority and 22/110 repository contract; otherwise assembly reject | adapter-opened/nested transaction、partial prefix、hidden read authority=0 | `DR-CH-BIND-004`;L3 / required graph+contract | `EVC-CH-BIND-004` |
| `TC-CH-BIND-005` / `CUT-BIND-05` | 9 external Ports / 14 callables parity / P0 | each exact callable with Configured/Fake/Disabled legal outcome and typed failures/asymmetry | body-free formal result/error; Configured/Fake semantics symmetric where declared; Disabled exact | generic adapter/result、raw response/secret/body、cross-family fallback、unmodeled retry=0 | `DR-CH-BIND-005`;L3 / required Port matrix | `EVC-CH-BIND-005` |
| `TC-CH-BIND-006` / `CUT-BIND-06` | six Worker sources / barrier / P0 | six enabled tasks parked; Disabled/Missing; header/schema/source/body faults; stop/drain | enabled source exposes only after barrier；Disabled starts none；Missing blocks；exact receipt/failure | gate failure decode/dispatch/reserve=0；local queue/DLQ/lease/attempt truth=0 | `DR-CH-BIND-006`;L3+L4 / required source lifecycle | `EVC-CH-BIND-006` |
| `TC-CH-BIND-007` / `CUT-BIND-07` | ten Outbound routes / P0 | each official snapshot/schema/logical key/source route；missing/wildcard/default/body rebuild/dynamic route | exact route and immutable snapshot mapping or activation/flow typed failure | current truth remap、wildcard/default、marketplace/runtime/provider route、payload rebuild=0 | `DR-CH-BIND-007`;L2+L3 / required route matrix | `EVC-CH-BIND-007` |
| `TC-CH-BIND-008` / `CUT-BIND-08` | eight Job closed dispatch / P0 | each job name/schema/input/result variant；unknown/cross-variant/generic execute/deadline | exact variant-bound runner/service/response and owned non-cancelling invocation | generic execute/fallback/scheduler business retry/input coercion/result union mismatch=0 | `DR-CH-BIND-008`;L2+L4 / required dispatch matrix | `EVC-CH-BIND-008` |
| `TC-CH-BIND-009` / `CUT-BIND-09` | phase-aware timeout/retry / P0 | each temporary/timeout/permanent/codec/consistency/commit Unknown phase with effect proof true/false | retry only exact temporary/timeout + formal no-effect/idempotent proof within bound; all others typed terminal | attempts value alone, observer output, generic retry and mutation retry on Unknown=0 | `DR-CH-BIND-009`;L2+L3+L4 / required policy matrix | `EVC-CH-BIND-009` |
| `TC-CH-BIND-010` / `CUT-BIND-10` | shutdown and startup cleanup / P0 | partial start, spawn reject, panic/drop/caller cancel, stop/drain/join failures | original failure preserved with ordered typed cleanup causes；owned invocation reaches one terminal | detached task、lost InFlight、recursive stop、queue/DLQ lifecycle、failure flatten=0 | `DR-CH-BIND-010`;L3+L4 / required lifecycle faults | `EVC-CH-BIND-010` |
| `TC-CH-BIND-011` / `CUT-BIND-11` | codec/header/digest exact binding / P0 | strict serde/raw bounded header/SHA valid vectors；unknown/duplicate/oversize/malformed/map-order inputs | exact canonical bytes/header gate/digest or typed codec/contract rejection | generic `Value`, pretty/Display/Debug, raw-body pre-header decode, algorithm/config selector=0 | `DR-CH-BIND-011`;L0+L1+L3 / required vectors | `EVC-CH-BIND-011` |
| `TC-CH-BIND-012` / `CUT-BIND-12` | sibling `core-contracts` prerequisite / P0 | exact path/version/API compatible, absent, incompatible, copied local replacement/import from other sibling | compatible edge compiles; absence/incompatibility is explicit implementation prerequisite blocker | copied replacement/compat shim/undeclared sibling dependency/public third-party type leak=0 | `DR-CH-BIND-012`;L0 / required static+compile gate | `EVC-CH-BIND-012` |

### 11.4 Observability / audit / redaction cases：12/12

| TC / exact cut | 场景 / P | 前置与输入 / fault | Expected / typed oracle | Zero-effect与细化断言 | Data / layer / automation | Evidence candidate |
|---|---|---|---|---|---|---|
| `TC-CH-OBS-001` / `CUT-OBS-01` | 60 structured-log profiles / P0 | each exact profile/owner/event/terminal；allowed, missing, forbidden and folded inputs | exact event key/level/terminal and closed safe field projection; selector unique | raw cause/body/secret/full ref/private field and undeclared profile count=0 | `DR-CH-OBS-001`;L1+L3+L4 / required 60-profile matrix | `EVC-CH-OBS-001` |
| `TC-CH-OBS-002` / `CUT-OBS-02` | 48 metric profiles / P0 | 34 Counter/12 Histogram/2 Gauge; each success/error selector and label permutation | exact metric kind/selector/value/unit/closed low-cardinality labels; 17/51 mapping uniqueness | trace/full ref/free text/actor/body/digest/secret and dynamic labels=0 | `DR-CH-OBS-002`;L1+L3+L4 / required 48-profile matrix | `EVC-CH-OBS-002` |
| `TC-CH-OBS-003` / `CUT-OBS-03` | 27 spans + 3 fixed events / P0 | exact lifecycle/parent-current-historical links; timeout/caller cancellation/sink fault | one exact span terminal and fixed event where declared; owned invocation continues independently | observer timeout/caller drop does not cancel/reclassify business invocation; synthetic links=0 | `DR-CH-OBS-003`;L3+L4 / required lifecycle matrix | `EVC-CH-OBS-003` |
| `TC-CH-OBS-004` / `CUT-OBS-04` | 20 Durable profiles / P0 | request-local, NotDurable, Unknown, resolved Durable and symmetry mismatch carriers | emission only from existing exact carrier after exact Durable and owner/ref symmetry | request-local/NotDurable/Unknown emission=0；no evidence/acceptance inference | `DR-CH-OBS-004`;L2+L3 / required 20-profile matrix | `EVC-CH-OBS-004` |
| `TC-CH-OBS-005` / `CUT-OBS-05` | Off mode / P0 | same business case with observer Off vs controlled Redacted baseline | protocol/result/persisted carrier bytes and business call sequence equal | field construction/redactor/sink/violation/fallback/observer allocation calls=0 | `DR-CH-OBS-005`;L1+L3 / required differential | `EVC-CH-OBS-005` |
| `TC-CH-OBS-006` / `CUT-OBS-06` | required Redacted source / P0 | required field allowed, missing, forbidden or unprojectable | allowed exact safe field emitted；otherwise entire emission rejected/omitted by formal observer surface | partial required emission、raw source echo、business error/rollback/retry/state change=0 | `DR-CH-OBS-006`;L1+L3 / required redaction corpus | `EVC-CH-OBS-006` |
| `TC-CH-OBS-007` / `CUT-OBS-07` | optional and atomic correlation / P0 | optional missing; complete/incomplete historical correlation group | optional missing omits field；atomic group all present or entire group absent | null/placeholder/synthetic ref/partial correlation group=0；business bytes unchanged | `DR-CH-OBS-007`;L1+L3 / required projection matrix | `EVC-CH-OBS-007` |
| `TC-CH-OBS-008` / `CUT-OBS-08` | forbidden material classes / P0 | whole actor, secret/document/audit inner IDs, serialized/private/external body candidates | deterministic observer-contract rejection without reproducing material | sink/raw artifact/error text/log fallback containing material=0；business flow unchanged | `DR-CH-OBS-008`;L0+L1+L3 / required forbidden corpus | `EVC-CH-OBS-008` |
| `TC-CH-OBS-009` / `CUT-OBS-09` | eleven count readers / P0 | 4 Inbound + 6 Job count fields plus conditional audit-ref count; zero/min/max fixtures | exact reader-owned non-negative count including zero and conditional absence rule | private wrapper inspection/list length reconstruction/full ref export=0 | `DR-CH-OBS-009`;L1+L3 / required 11-reader matrix | `EVC-CH-OBS-009` |
| `TC-CH-OBS-010` / `CUT-OBS-10` | redaction/sink failure / P0 | redactor rejection and sink failure before/during each observer plane | at most one independently available non-sensitive non-recursive fallback; caller outcome unchanged | recursive observation/retry/business rollback/UoW change/cancellation/raw backend body=0 | `DR-CH-OBS-010`;L3+L4 / required failure injection | `EVC-CH-OBS-010` |
| `TC-CH-OBS-011` / `CUT-OBS-11` | four-plane co-observation / P0 | one occurrence eligible for log/metric/span/durable projection; remove each plane in turn | each plane derives only from same formal carrier and own profile; coexistence/order does not change business | plane-to-plane sourcing, missing-plane synthesis, observer-derived decision/state/retry=0 | `DR-CH-OBS-011`;L1+L3 / required differential matrix | `EVC-CH-OBS-011` |
| `TC-CH-OBS-012` / `CUT-OBS-12` | forbidden historical owners / P0 | static/profile inventory and synthetic attempts for provider cost/secret/runtime/tools/listing/approval/method body | exact profile count remains 60/48/27+3/20; forbidden owner findings deterministic | forbidden profile/event/metric/span/durable projection count=0；no hidden generic profile | `DR-CH-OBS-012`;L0+L1 / required static inventory | `EVC-CH-OBS-012` |

### 11.5 Batch stop-review

| 审查项 | 设计结论 | 后移内容 |
|---|---|---|
| exact identity | `TX=22/22`、`BIND=12/12`、`OBS=12/12`；46条均有唯一TC/DR/EVC | fixture/suite/path留Steps 7~9 |
| transaction truth | commit三态、rollback precedence、winner preservation、A/B/C、Job phase均有typed carrier与zero-effect oracle | product transaction adapter留P1 |
| assembly truth | typed root、profile、27/9/14/6/10/8 cardinality和Stage 0~7完整性闭合 | concrete product endpoint/credential不进入P0 |
| observer truth | 60/48/27+3/20 profiles、Off/Redacted、failure和four-plane authority闭合 | backend choice/alert route留受控后续 |
| responsibility | 无runtime/tools execution、approval、method body、marketplace、SDK client/cache、provider route/cost owner合并 | 无 |
| evidence | `EVC-*`仍为candidate，未分配真实alias/path/digest/run或结果 | Step 13收敛contract |

## 12. Batch `6.7`：configuration-failure executable cases

### 12.1 Configuration failure shared discipline

每条 `CFG-F-*` 保持自己的source identity；`TC-CH-BIND-*` 可以复用builder/fake，但不能替代配置失败行。所有case共同遵守：invalid higher-priority source不得回退lower-priority值；Missing不得解释为Disabled；Configured失败不得切换Fake/InMemory/Disabled；candidate失败不得影响active frozen root；敏感材料和raw token不得进入诊断或evidence candidate。

### 12.2 Configuration failure cases：18/18

| TC / exact cut | 场景 / P | 前置与输入 / fault | Expected / typed oracle | Zero-effect与细化断言 | Data / layer / automation | Evidence candidate |
|---|---|---|---|---|---|---|
| `TC-CH-CONFIG-001` / `CFG-F-01` | required artifact/module/leaf/ref / P0 | each valid minimal profile/entry candidate；remove artifact/module/leaf/ref one at a time | valid candidate reaches complete validation; each omission yields exact `RuntimeAssembly`/config rejection | root/constructor/provider/entry/listener/task/facade exposure=0 on omission | `DR-CH-CONFIG-001`;L1+L3+L4 / required catalog matrix | `EVC-CH-CONFIG-001` |
| `TC-CH-CONFIG-002` / `CFG-F-02` | strict UTF-8 JSON V0~V1 / P0 | valid bytes plus BOM/comment/trailing comma/duplicate/unknown/null/coercion/oversize/malformed UTF-8 | deterministic parser/schema-stage typed rejection with safe location/class only | raw token/value/body echo、later validators/provider/constructor calls=0 | `DR-CH-CONFIG-002`;L1 / required parser corpus | `EVC-CH-CONFIG-002` |
| `TC-CH-CONFIG-003` / `CFG-F-03` | bounded env precedence / P0 | valid JSON and each allowed env leaf；higher-priority invalid/malformed/out-of-range override | candidate rejected at exact source/leaf; lower-priority JSON not selected | silent fallback/trim/coercion/unknown env acceptance/raw env output=0 | `DR-CH-CONFIG-003`;L1+L3 / required precedence matrix | `EVC-CH-CONFIG-003` |
| `TC-CH-CONFIG-004` / `CFG-F-04` | V1~V6 type/bounds/names/profile/entry / P0 | per catalog min, max, min-1, max+1, wrong type/case/name/profile/entry/cross-field | exact validation-stage issue and whole candidate rejection | clamp/alias/case-fold/default/fallback and Stage constructor calls before validation closure=0 | `DR-CH-CONFIG-004`;L1+L3 / required boundary matrix | `EVC-CH-CONFIG-004` |
| `TC-CH-CONFIG-005` / `CFG-F-05` | reference graph/family/reachability / P0 | valid graph then orphan/cycle/wrong family/case collision/unreachable sensitive section | exact graph-stage rejection before provider/constructor | arbitrary section choice/private scan/partial graph/provider access=0 | `DR-CH-CONFIG-005`;L1+L3 / required graph matrix | `EVC-CH-CONFIG-005` |
| `TC-CH-CONFIG-006` / `CFG-F-06` | Missing versus explicit Disabled / P0 | omit each external slot and separately select legal Disabled row | omission rejects; explicit legal Disabled constructs exact existing `NotConfigured` Port behavior | Missing->Disabled/default Fake/partial activation=0；disabled task/fetch/external call=0 | `DR-CH-CONFIG-006`;L1+L3 / required slot matrix | `EVC-CH-CONFIG-006` |
| `TC-CH-CONFIG-007` / `CFG-F-07` | configured provider/constructor failure / P0 | valid Configured branch with fake/in-memory/Disabled alternatives registered; fail provider/constructor | exact assembly failure and complete candidate rejection; original failure retained | all alternative constructor/fallback/root/entry exposure calls=0 | `DR-CH-CONFIG-007`;L3 / required constructor faults | `EVC-CH-CONFIG-007` |
| `TC-CH-CONFIG-008` / `CFG-F-08` | credential/TLS material fail-closed / P0 | valid opaque refs; unavailable/denied/malformed/expired/revoked/mismatched material | exact sensitive-material/config assembly rejection; no adapter/root | secret/cert/key/body/provider response/output and real-provider evidence=0 | `DR-CH-CONFIG-008`;L1+L3 / required safe provider fakes | `EVC-CH-CONFIG-008` |
| `TC-CH-CONFIG-009` / `CFG-F-09` | Stage 0~7 prefix disposal / P0 | fail each stage and every reverse cleanup cause combination | no root/neutral handoff; complete owned prefix disposed; original failure plus ordered typed cleanup causes | partial graph introspection/survivor exposure/failure overwrite/flatten=0 | `DR-CH-CONFIG-009`;L3+L4 / required stage fault matrix | `EVC-CH-CONFIG-009` |
| `TC-CH-CONFIG-010` / `CFG-F-10` | API/Worker/Jobs entry barrier / P0 | complete graph; fail each selected entry prerequisite before and at barrier | exact entry-owned assembly/startup failure; candidate remains unexposed | listener/task/facade/accepted request/spawned unguarded invocation=0 | `DR-CH-CONFIG-010`;L3+L4 / required barrier matrix | `EVC-CH-CONFIG-010` |
| `TC-CH-CONFIG-011` / `CFG-F-11` | 9 slots / 6 sources / 10 routes completeness / P0 | invalidate each exact member one at a time, including wrong family/schema/ref | exact complete predicate false and whole candidate rejected with member identity | reduced graph/wildcard/default member/partial Worker/Outbound exposure=0 | `DR-CH-CONFIG-011`;L1+L3+L4 / required cardinality matrix | `EVC-CH-CONFIG-011` |
| `TC-CH-CONFIG-012` / `CFG-F-12` | activated Port failure policy / P0 | each 9-Port/14-callable failure kind and phase; effect proof true/false | exact existing typed failure; only proven temporary/timeout branch performs bounded declared retry | attempts-only proof、fallback branch、raw provider code/body、retry on permanent/codec/Unknown=0 | `DR-CH-CONFIG-012`;L2+L3 / required Port failure matrix | `EVC-CH-CONFIG-012` |
| `TC-CH-CONFIG-013` / `CFG-F-13` | Query/reference degraded vs corruption / P0 | normal Partial/Unavailable/Missing and malformed persisted owner/ref/state/version relation | normal case returns typed degraded/missing no-write; malformed relation=`ConsistencyDefect` | common degraded fallback/current-truth reconstruction/refresh/rebuild/write=0 | `DR-CH-CONFIG-013`;L2+L3 / required differential matrix | `EVC-CH-CONFIG-013` |
| `TC-CH-CONFIG-014` / `CFG-F-14` | Worker/Jobs/Outbound runtime failures / P0 | retryable/permanent/invalid response/commit Unknown/rollback failure at each declared phase | exact receipt/journal/outcome/application error and phase-specific recovery state | duplicate effect/fabricated marker/report/receipt/unsafe target terminal/local delivery lifecycle=0 | `DR-CH-CONFIG-014`;L2+L3+L4 / required phase faults | `EVC-CH-CONFIG-014` |
| `TC-CH-CONFIG-015` / `CFG-F-15` | frozen active root and drift / P0 | active root plus changed artifact/ref/material metadata; separately fail active external dependency | drift is evaluated only by fresh candidate and rejects if invalid; active Port failure remains typed; current root unchanged | raw source reread/hot reload/LKG branch switch/online fallback/root mutation=0 | `DR-CH-CONFIG-015`;L1+L3+L4 / required immutability matrix | `EVC-CH-CONFIG-015` |
| `TC-CH-CONFIG-016` / `CFG-F-16` | observer/redaction failure / P0 | forbidden candidate field, redactor reject and sink fail across Off/Redacted | safe omission or at most one non-recursive safe fallback; business result/carrier byte-equivalent | raw field/backend body/recursive observer/business rollback/retry/state change/claimed alert=0 | `DR-CH-CONFIG-016`;L1+L3 / required observer differential | `EVC-CH-CONFIG-016` |
| `TC-CH-CONFIG-017` / `CFG-F-17` | unsupported dynamic controls / P0 | scan config catalog/source/dependency/Port/worker surfaces; send dynamic admin/watch/hot-reload input | exact static inventory has zero such P0 surfaces; unsupported entry/input rejected | config-center/admin/watch worker/dependency/key, mutable root and outage simulation claims=0 | `DR-CH-CONFIG-017`;L0+L1 / required static boundary | `EVC-CH-CONFIG-017` |
| `TC-CH-CONFIG-018` / `CFG-F-18` | rollback target eligibility / P0 | previous artifact candidates with credential/TLS revoked/expired or digest/profile incompatible; valid safe target control | unsafe target rejected by exact eligibility issue; fix-forward required; no active cutover | rollback/cutover execution claim、unsafe material use、current root mutation、fabricated recovery evidence=0 | `DR-CH-CONFIG-018`;L1+L3 / required eligibility matrix | `EVC-CH-CONFIG-018` |

### 12.3 Batch stop-review

| 审查项 | 设计结论 | 后移内容 |
|---|---|---|
| exact identity | `CFG-F-01..18 = 18/18`，每条有独立TC/DR/EVC且未被BIND case吞并 | fixture/schema/path留Steps 7~9 |
| failure stage | parser/V0~V6/graph/provider/Stage0~7/barrier/active-runtime/frozen-root/rollback eligibility均可定位 | concrete implementation callable留07 |
| no fallback | invalid precedence、Missing、Configured failure、active drift均明确禁止silent fallback | 无 |
| sensitive material | raw token/env/credential/TLS/provider/backend body不进入typed oracle或candidate evidence | Step 13收敛redaction schema |
| truthfulness | 未声称parser/provider/runtime/rollback测试已执行，未创建artifact/run/evidence alias | 无 |

## 13. Step 6 cross-case closure audit

### 13.1 Exact obligation arithmetic

| Family | Exact source obligations | Canonical TC | Unique DR | Unique EVC | Result |
|---|---:|---:|---:|---:|---|
| foundation | 18 | 18 | 18 | 18 | closed-designed |
| Command | 26 | 26 | 26 | 26 | closed-designed |
| Query | 33 | 33 | 33 | 33 | closed-designed |
| Inbound | 6 | 6 | 6 | 6 | closed-designed |
| Outbound | 10 | 10 | 10 | 10 | closed-designed |
| Job | 8 | 8 | 8 | 8 | closed-designed |
| state | 24 | 24 | 24 | 24 | closed-designed |
| transaction | 22 | 22 | 22 | 22 | closed-designed |
| binding | 12 | 12 | 12 | 12 | closed-designed |
| observability | 12 | 12 | 12 | 12 | closed-designed |
| configuration failure | 18 | 18 | 18 | 18 | closed-designed |
| **total** | **171 DDD + 18 CFG-F = 189** | **189** | **189** | **189** | **exact source-preserving** |

`closed-designed`只表示Step 6记录已形成，不表示future test code、suite、fixture、environment、artifact、report或pass结果存在。

### 13.2 Cross-case semantic audit

| Audit | Required result | Step 6 conclusion |
|---|---|---|
| 83 exact flows | `26 C + 33 Q + 6 I + 10 O + 8 J` each exactly one canonical TC | `83/83`; no family helper replaces exact row |
| 24 state families | exact formal owner/type spelling；immutable/external boundary separated | `24/24`; no generic `status/active/ready/failed` alias |
| 638 pair identity | `239 current + 98 reserved + 301 illegal`, unclassified=0 | `SP-CH-*` registry contract; sampling forbidden |
| typed errors/states | only formal Domain/Application/channel surfaces and exact state variants | no prose-created enum/status; old `304` superseded |
| zero-effect | every rejection/no-op/reserved/Query/boundary branch names prohibited writes/calls | present in canonical row or inherited shared contract |
| transaction phase | source UoW, post-Durable collaboration, short bind UoW; Job initial/target/final separated | A/B/C and journal symmetry preserved |
| configuration phase | parse/validate/graph/provider/build/barrier/active failure identities separated | `CFG-F-01..18` independent from binding cuts |
| responsibility leakage | runtime/tools execution, governance approval, method body/source, provider route/cost, marketplace, SDK client/cache | positive ownership count=0; negative assertion only |
| Rust documentation | every public declaration, struct and field, enum variant/payload, trait/method/callable has complete English `///`; enum struct-variant fields no `pub` | `TC-CH-FOUNDATION-011` mandatory static gate; no structure/field omission allowed |
| evidence truthfulness | candidate only; no alias/path/digest/run/result/signoff | all `EVC-*` explicitly future; execution status `not_executed` |

### 13.3 Mechanical identity rules for downstream Steps

Step 7~13 and formal 05 must preserve one-to-one identity. A parameter branch may add suffix metadata but may not allocate a second canonical TC. A future implementation test may map many functions to one TC or one parameterized function to many TC rows, but generated artifacts must retain exact `tc_id`, parameter identity and source cut. `DR-*` and `EVC-*` must not be reused across canonical rows.

Required mechanical checks at Step 15 assembly:

```text
canonical TC rows = 189
exact source cuts represented = 189
unique DR refs = 189
unique EVC refs = 189
flow rows = 83
state family rows = 24
state pair parameter denominator = 638
unclassified pair = 0
real execution/evidence claims = 0
```

## 14. 对上游设计的影响判定

| 发现 | 是否回开00~04 | 处理 |
|---|---|---|
| 189个exact obligations均可构造typed/zero-effect oracle | 否 | 作为测试方案细化承接 |
| state历史叙述残留`304 illegal`与active §66/正式03的`301`冲突 | 否，当前权威已明确 | 记录`historical_discrepancy_superseded`;所有下游只用301 |
| product-neutral durable/backend/environment尚未选择 | 否 | P1/implementation prerequisite；不阻塞fake/contract P0 |
| L0-core两项正式设计同步债务 | 否，existing accessor/serde shape已有明确假设 | 保持non-blocking debt；变化时受控回开对应digest/codec cases |
| 未发现不可观测或不可构造的formal oracle | 否 | unresolved upstream blocker=`0` |

## 15. 正式 `05-测试方案.md` §6 回填草稿

正式§6应从本文件装配以下内容，不复制旧`TC-001..012`：

1. stable identity规则与case record必填字段；189个canonical TC按11个family组织。
2. 83 exact flow用例及Command/Query/Inbound/Outbound/Job共享分支合同。
3. 24 state-family TC与`SP-CH-*` 638-pair参数注册规则，唯一分母`239/98/301`。
4. 22 transaction、12 binding、12 observability、18 configuration-failure exact cases。
5. typed oracle precedence、zero-effect、phase/UoW、responsibility和Rustdoc静态门禁。
6. `DR-*`仅是Step 7逻辑数据需求；`EVC-*`仅是Step 13候选，不是执行证据。

正式§6可将逐行大表放入校准产物并在正文保留完整索引，但不得只写总数或摘要；每个TC必须能通过source cut和本文件定位其exact前置、操作、oracle、数据与候选证据。

## 16. Step 7 entry gate 与 Step 6 stop-review

| Gate | Result |
|---|---|
| Step 5 171/171 DDD + 18/18 CFG-F均有canonical TC | pass-designed；189/189 |
| 每条P0有positive与关键negative/boundary/recovery | pass-designed；shared branch + owner row共同闭合 |
| 每条TC有precondition/action/typed oracle/zero-effect/assertion/data/layer/EVC | pass-designed |
| 83 flow、24 state、638 pair、22 TX、12 BIND、12 OBS、18 CFG-F可定位 | pass-designed |
| TC/DR/EVC无计划内重复身份 | pass-designed；Step 15再机械复核 |
| 未伪造suite/path/environment/run/evidence/result/signoff | pass |
| unresolved upstream blocker | none |
| 可进入Step 7 | yes；定义deterministic test data，不修改formal 05 |

```text
document = 05-测试方案.md
step = 6
status = 05_step_06_completed_continuous_execution
next_allowed_action = enter_05_step_07_test_data
canonical_tc = 189
state_pair_baseline = 638:239/98/301
test_execution_claimed = false
real_evidence_created = false
unresolved_upstream_blocker = none
commit_required = no
```
