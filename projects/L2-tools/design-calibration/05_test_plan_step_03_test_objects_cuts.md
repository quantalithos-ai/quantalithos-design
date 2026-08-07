# L2-tools 05 测试方案 · Step 3 测试对象与测试切口

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 3「抽取测试对象与测试切口」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §3
>
> 直接输入：`projects/L2-tools/03-详细设计.md` §4~§15，尤其 §15「测试切口与最小验证清单」

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 3 / 抽取测试对象与测试切口 |
| 状态 | `accepted_for_step_03 / proceed_to_step_04` |
| 当前模块 | `test_objects_and_cuts` |
| P0切口状态 | 逐项来源、风险、层级、用例要求已停审；未发现孤儿P0设计契约 |
| 正式文档写入 | 未允许；只形成§3回填草稿 |
| 下一步 | Step 4：制定测试策略与分层 |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 七模块最小切口 | `03` §15.2 | 模块/对象/entry/worker/job测试对象全集 |
| Commands / Queries / Consumers / Outbound / Jobs最小切口 | `03` §15.3~§15.6 | 协议和函数级切口全集 |
| 六状态族、事务、并发、错误切口 | `03` §15.7 | 状态和横切风险切口 |
| 配置与观测切口 | `03` §15.8、`04` §12 | 配置/安全/观测切口 |
| 需求和veto关联 | `00` §9~§15 | 后续Step 5双向追溯 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些 domain object/value object/policy必须单测？ | contracts typed refs/metadata/protocol/errors/views；domain 41对象、contract/binding/invocation/precondition/outcome/safe-handoff/integrity policy 与六状态迁移；所有四项安全门禁和终态唯一性。 | `03` §5.2~§5.3、§9、§15.1~§15.2 |
| 哪些 application service需要service test？ | contract/binding/invocation/precondition/handoff/outcome/safe-handoff/integrity/consumer/job services；重点是CF/QF/IF/OF/JF的调用顺序、UoW、idempotency、错误映射和no-write。 | `03` §5.4、§7~§8、§15.2~§15.6 |
| 哪些 repository/adapter/worker需要集成测试？ | 七logical Stores、UoW、Idempotency/Clock/ID、七external Ports、fake/durable parity、api handlers、worker consumers/continuations/projection lifecycle、四Job runners。 | `03` §5.5~§5.8、§10~§13、§15.2 |
| 哪些协议必须单列？ | 13 Commands、11 Queries、5 inbound、4 outbound continuations、4 jobs；所有version/metadata/body/unknown variant、source/target symmetry和phase boundary。 | `03` §7~§8、§15.3~§15.6 |
| 哪些状态/事务/幂等/并发/恢复必须单列？ | 六状态族、atomic outcome/audit pair、Prepared/phase-2、CAS、semantic uniqueness、same/different digest、commit/call/submission unknown、late material、projection watermark、consumer replay、bounded job report。 | `03` §9~§12、§15.7 |
| 哪些字段缺失/DTO构造失败/引用混同必须是负向切口？ | metadata/TraceContext、typed ref kind/scope、required protocol field/version、body/secret、source/authority/revision/freshness、CAS token/cursor/scope digest、target/phase mismatch、config unknown/duplicate/coercion。 | `03` §7、§11~§15；`04` CFG-F/X |
| 状态名采用什么？ | 只采用03六状态族正式label：合同演进、Binding/source、invocation/admission、precondition/handoff、outcome/safe handoff、integrity/derived；禁止旧 `success/failed/completed` 泛化替代。 | `03` §9.1~§9.8 |
| 每个切口的设计真相源是什么？ | 下表为 canonical source mapping；每个TC在Step 6再次回指具体对象/flow/state/error/config条目。 | `03` §15 |

## 4. 测试对象与切口总表

### 4.1 模块级切口

| 测试对象 | 来源 | Canonical切口 | 风险 | 推荐层级 |
|---|---|---|---|---|
| `contracts` refs/metadata/protocol/views/errors | `03` §5.2、§7、§15.2 | `L2T-MOD-CON-001~005` | DTO/typed-ref/版本/body混同会产生第二合同 | contract unit + API/worker contract |
| `domain` contract/binding/invocation/precondition/outcome/integrity | `03` §5.3、§9、§15.2 | `L2T-MOD-DOM-001~005` | owner/invariant/状态迁移/终态/安全门禁错误 | domain unit |
| `application` command/query/consumer/continuation/job/error | `03` §5.4、§8、§11~§13 | `L2T-MOD-APP-001~006` | 编排顺序、UoW、重放、错误/恢复越界 | service + fake-port |
| `infra` stores/UoW/idempotency/external/config/fake | `03` §5.5、§10、§13 | `L2T-MOD-INF-001~006` | CAS/atomicity/adapter availability/readiness泄漏 | adapter contract + integration-like |
| `api` command/query handlers | `03` §5.6、§15.2 | `L2T-MOD-API-001~002` | handler绕过facade、body/metadata泄漏、query写入 | API contract |
| `worker` consumers/continuations/projection | `03` §5.7、§15.2 | `L2T-MOD-WRK-001~003` | envelope/dedup/phase/route/no-repair错误 | worker contract + integration-like |
| `jobs` entry/runners/no-repair | `03` §5.8、§15.2 | `L2T-MOD-JOB-001~003` | unbounded scan、subject repair、report重算 | job contract + service |

### 4.2 协议/流程切口全集

| 协议族 | 设计范围 | Canonical切口 | P0后续要求 |
|---|---|---|---|
| Commands | `CF-01~CF-13` | `CUT-FLOW-CF-01~13` | 每项正向/blocked-aware + invalid + duplicate/digest conflict + version/unique conflict；CF-10/12遵守side-effect fence |
| Queries | `QF-01~QF-11` | `CUT-FLOW-QF-01~11` | 每项可见/缺失/陈旧/冲突/降级 + no-write/no-refresh/no-Port |
| Inbound Consumers | `IF-01~IF-05` | `CUT-FLOW-IF-01~05` | envelope/source/version/dedup/receipt；IF-03唯一允许CF-11 derived re-entry |
| Outbound continuations | `OF-01~OF-04` | `CUT-FLOW-OF-01~04` | committed material->pure mapping->Prepared->最多一次Port->phase-2 local disposition；unknown不重调 |
| Operations Jobs | `JF-01~JF-04` | `CUT-FLOW-JF-01~04` | bounded target/scope/cursor/watermark、partial report/replay、no subject repair |

### 4.3 状态/一致性/安全切口

| 切口族 | 来源 | Canonical切口 | 关键断言 |
|---|---|---|---|
| 六状态族 | `03` §9 | `CUT-STATE-01~06` | 正式enum、合法迁移、terminal guard、late material不可改写、projection/derived状态不冒充truth |
| 事务/UoW/CAS | `03` §10、§15.7 | `CUT-TX-01~10` | accepted truth/result原子、outcome/audit pair原子、Prepared先于Port、phase-2 CAS、rollback/commit unknown分离、Query/Job边界 |
| 幂等/并发/replay | `03` §12、§15.7 | `CUT-CONC-01~23` | same key/digest replay、different digest conflict、scope isolation、stale CAS、consumer at-most-once、unknown fence、watermark monotonicity |
| 错误/恢复 | `03` §11、§15.7 | `CUT-ERR-01~12` | invalid/transition/conflict/unavailable/unknown/blocked/forbidden/unsupported/partial/late error与owner映射稳定 |
| 配置 | `03` §13、`04` §9~§12 | `CUT-CFG-001~007` + `CFG-T/A/F/X` | strict/source/profile/capability/ref-only/redline/fail-fast/builder/no-output |
| 观测/审计 | `03` §14~§15.8 | `CUT-OBS-001~009` | low-cardinality fields、TraceContext、accepted/rejected/duplicate、pair、status separation、redaction |
| 负向红线 | `00` §10、`04` §4 | `CUT-NC-001~025` | 对应`NC-L2T-001~025`，任何profile/fake/debug不能放宽 |

### 4.4 外部接缝切口

| 接缝 | 设计来源 | P0/P1 | 允许断言 | 禁止断言 |
|---|---|---:|---|---|
| Capability Hub | `03` CF-05~07/IF-01/JF-01 | P0 local + P1 seam | controlled ref/summary、bound/unbound、blocked/stale/conflict、no local registry | Hub registry/exposure/applicability positive truth |
| Authorization | `03` CF-09/IF-02；`L2T-UP-001~002` | P0 negative + P1 conditional | missing/stale/conflict/unverifiable/deny -> fail-closed/no-execution | L2 effective allow/deny owner或provider readiness |
| Sandbox | `03` CF-10/11/IF-03；`L2T-UP-003~004` | P0 negative + P1 conditional | no-host fallback、mapping blocked、source attribution、Prepared/unknown | run/receipt/capture/cleanup/DLQ/recovery positive |
| Bus/Observability | `03` CF-12/OF/IF-04~05/JF-04；`L2T-UP-005~006` | P0 local + P1 seam | body-free material、local attempt、route/status unknown/blocked、independent layers | delivered/observed/producer/route/readiness |
| Core | `L2T-UP-008`、`03` shared authority | P0 candidate/blocker + P1 conditional | candidate/missing/conflicting/unverifiable不复制造schema | tools-specific package/schema closure |
| SDK | `L2T-UP-009` | P2/future seam | future consumer contract不改变server truth | client实现/coverage/readiness |

## 5. P0 测试切口逐项停审

| 测试切口 | 设计来源明确 | 风险具体 | 层级合理 | 后续可执行断言 | 结论 |
|---|---|---|---|---|---|
| `L2T-MOD-CON/DOM/APP/INF/API/WRK/JOB-*` | 是，均回指03 §15.2 | 是 | 是 | 是 | 通过 |
| `CUT-FLOW-CF-01~13` | 是，逐项回指03 §15.3和§8 | 是 | 是 | 是 | 通过 |
| `CUT-FLOW-QF-01~11` | 是，逐项回指03 §15.4 | 是 | 是 | 是 | 通过 |
| `CUT-FLOW-IF-01~05` | 是，逐项回指03 §15.5 | 是 | 是 | 是 | 通过 |
| `CUT-FLOW-OF-01~04`/`JF-01~04` | 是，逐项回指03 §15.6 | 是 | 是 | 是 | 通过 |
| `CUT-STATE/TX/CONC/ERR` | 是，回指03 §9~§12/§15.7 | 是 | 是 | 是 | 通过 |
| `CUT-CFG/OBS/NC` | 是，回指03 §13~§15.8、04 CFG/NC | 是 | 是 | 是 | 通过 |

## 6. 跨切口设计来源审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 03 §15 每一项是否有测试入口 | 通过 | 七模块、5协议族、6状态族、TX/CONC/ERR/CFG/OBS均已建立canonical切口。 |
| 是否存在孤儿P0设计契约 | 未发现 | Step 5/6继续做需求/用例双向审计。 |
| 是否存在重复切口 | 未发现 | 模块切口与flow/state横切切口分层，不重复承担同一oracle。 |
| 状态/字段/协议命名是否漂移 | 通过 | 采用03正式名称；旧05状态不进入。 |
| phase boundary是否越界 | 通过 | external accepted/delivered/observed/evidence/readiness不作为当前P0 oracle。 |
| blocker是否被写为positive | 通过 | 外部接缝仅保留blocked-aware或条件P1。 |

## 7. 改动前后对比

| 项 | 旧05 | 当前Step 3 |
|---|---|---|
| 切口粒度 | 12个摘要用例，无03来源 | 7模块 + 13/11/5/4/4流程 + 6状态族 + TX/CONC/ERR/CFG/OBS/NC |
| 负向覆盖 | 泛化 invalid/error | 每个CF/QF/IF/OF/JF均有缺失、冲突、重复、版本/phase/状态边界要求 |
| 层级 | 粗略 unit/integration/E2E | 对象/服务/adapter/entry/worker/job按风险定位，Step 4再收敛 |
| 外部依赖 | 旧host/callback happy path | seam-only、blocked-aware、no authority inference |

## 8. 测试设计取舍

| 方案 | 取舍 | 结论 |
|---|---|---|
| 每个对象单独建一套重复用例 | 粒度细但会重复同一flow/state oracle | 对象切口负责局部不变量，流程切口负责编排，横切切口负责一致性；采用分工 |
| 只按协议族列case | 容易遗漏模块层factory/adapter/no-write | 保留模块级和协议级两层切口 |
| 将外部provider正向纳入P0 | 破坏当前blocker事实 | 只纳入P0 negative/P1 conditional |
| 将所有NC条目放在一张泛化安全表 | 无法追溯具体行为 | `NC-L2T-001~025`分别映射到后续case family |

## 9. 对03的影响判定

| 判定 | 说明 |
|---|---|
| 当前无需回写03 | 仅抽取已有对象、协议、状态和切口，不新增契约。 |
| 触发回写条件 | 若Step 6发现某个正式状态/字段/错误无法形成断言，必须暂停切口并回写03；不得在05创建local alias。 |

## 10. 回填草稿（正式05 §3）

> 校准来源：
> - `design-calibration/05_test_plan_step_03_test_objects_cuts.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“测试对象与切口总表”“P0测试切口逐项停审”和“跨切口设计来源审计”。

测试对象不按技术层级孤立罗列，而按详细设计的模块、协议族、状态族和横切一致性风险建立切口。模块级切口覆盖 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`；流程级切口覆盖 `CF-01~CF-13`、`QF-01~QF-11`、`IF-01~IF-05`、`OF-01~OF-04`、`JF-01~JF-04`；横切切口覆盖六状态族、事务/UoW/CAS、幂等/并发/replay、错误/恢复、配置和观测/审计，以及 `NC-L2T-001~025`。

每个P0切口必须回指03的具体模块、对象、协议、flow、状态、事务、错误、配置或观测契约，并在后续Step形成至少一个可执行、可断言、可留证的用例。Capability Hub、Authorization、Sandbox、Bus、Observability、Core和SDK只在本地/接缝边界验证ref、summary、blocked、unavailable、unknown、no-write和状态独立性；外部positive provider、delivery、observed、readiness和client closure不属于当前P0测试事实。

## 11. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 03 §15中`L2T-CONC-001~023`与正式用例的最终一对一编号 | 影响Step 5/6用例总数和EV族 | Step 5/6 |
| 外部positive seam是否在测试轮前闭口 | 影响P1 conditional suite启用 | Step 8/9/12 |
| 某些应用/infra切口是否需拆成多个实际suite | 只影响自动化布局，不改变测试对象 | Step 4/9 |

## 12. 进入下一步条件

- [x] 03 §15所有最小验证清单都有canonical测试入口。
- [x] 每个P0切口有明确设计真相源、风险、推荐层级和后续用例要求。
- [x] 外部依赖和phase边界未被越权纳入正向P0。
- [x] 跨切口审计无孤儿、重复或命名漂移；可进入Step 4分层策略设计。
