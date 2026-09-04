# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节：`05-测试方案.md` §7

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 测试数据设计 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 数据由正式契约构造、按 run 隔离、可重复生成、可清理；禁止人工临时造数 |
| 停审结论 | P0 用例均有可定位的数据集或明确无数据前置 |

## 2. 数据设计原则

| 原则 | 规则 |
|---|---|
| 最高隔离键 | 所有持久数据先按 `test_run_ref`，再按 project/member/host/generation/operation 分区 |
| 契约生成 | DTO、状态、ref、material、report、config 都由正式 builder/fixture/seed 产生 |
| 正负分离 | body leak、unsupported version、digest conflict、commit unknown、rollback failure 使用独立数据集 |
| 外部替身 | Identity / Work / Member / Images / Runtime / Sandbox / carrier / Bus 只使用 fake、placeholder、controlled 或 disabled |
| fake parity | fake 也执行 revision、unique、rollback、duplicate、unknown、redaction 规则，不伪造 positive completion |
| 清理 | 默认删除 run namespace；fault profile 每 case reset；泄漏 corpus 不进入共享 store |

## 3. 核心数据集

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理 | 关联用例 |
|---|---|---|---|---|---|
| `DS-MS-RUN-001` | 全部测试 run 壳 | `test_run_ref`、固定 clock/id range | run ref | drop namespace / reset memory | 全部 |
| `DS-MS-SUBJECT-001` | 双锚与 scope | typed `ProjectMemberRef` + `GlobalMemberRef` builder | run + project/member | run drop | intent、command、visibility |
| `DS-MS-SUBJECT-NEG-001` | 非项目/不一致/缺失主语 | mutate valid subject | case id | no persistence | invalid subject |
| `DS-MS-CONTROL-001` | intent/decision 主线 | accepted intent、current pointer、decision | project/member + operation | run drop | intent/decision |
| `DS-MS-QUAL-001` | qualification source | identity/work safe snapshot、member/images/runtime/sandbox markers | host/generation + source kind | run drop | qualification |
| `DS-MS-ASSEMBLY-001` | assembly/readiness | required item set、per-item status、freshness/gap | generation + item key | run drop | assembly/readiness |
| `DS-MS-HOST-001` | host/generation/current | established/current/closing/closed generations | project/member + generation | run drop | generation/action/late |
| `DS-MS-REG-001` | registration/endpoint/session | safe fingerprint、endpoint ref、session shell | host/generation | run drop | registration/session |
| `DS-MS-HEALTH-001` | signal/assessment/failure/recovery | ordered signals、freshness、failure classification | host/generation + sequence | run drop | health/recovery |
| `DS-MS-CLOSURE-001` | closure/cleanup | local closure、cleanup attempts、stable keys | host/generation + effect key | run drop | close/cleanup |
| `DS-MS-RECON-001` | residual/case | local vs safe external summary diff | host/generation + finding key | run drop | reconciliation |

## 4. Protocol / material / projection 数据集

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理 | 关联用例 |
|---|---|---|---|---|---|
| `DS-MS-PROTOCOL-001` | 合法 DTO | 从 `03` 协议卡 builder 生成 | family + version | 无持久清理 | contract / entries |
| `DS-MS-PROTOCOL-NEG-001` | 缺字段/unsupported | 删除 required field、改 version、改变 digest 字段 | case id | no persistence | contract negatives |
| `DS-MS-REF-001` | safe external refs | fake resolver 返回 opaque ref、summary、freshness | source ref + generation | resolver reset | qualification/consumer |
| `DS-MS-REF-NEG-001` | body/digest mismatch | isolated fake event 带 forbidden body 或错误 digest | case id | fake reset；不持久化 | redaction/consumer |
| `DS-MS-MATERIAL-001` | committed material/outbox | staged local change、immutable material、payload snapshot | host change ref | run drop | material/outbox |
| `DS-MS-PROJECTION-001` | projection/freshness | view、dependency index、source cursor、stale/degraded | view ref + cursor | run drop | query/rebuild |
| `DS-MS-HANDOFF-001` | four-layer handoff | per-target key、layer marker、gap/unknown | target + handoff key | run drop | handoff/feedback |
| `DS-MS-REPORT-001` | job reports | completed/partial/failed report、item refs | job run ref | run drop | jobs/replay |

## 5. Fault / config / redaction 数据集

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理 | 关联用例 |
|---|---|---|---|---|---|
| `DS-MS-IDEMP-001` | reservation/replay/conflict | reserved/completed/in-flight/conflict records | namespace + key | run drop | TC-IDEMP |
| `DS-MS-FAULT-001` | repository/UoW | expected-version、unique、store、commit/rollback fault profile | fault case + op | reset profile | rollback/unknown |
| `DS-MS-FAULT-002` | resolver/adapter | unavailable、retryable、permanent、timeout、body rejected | seam + case | reset fake | qualification/cleanup/publish |
| `DS-MS-CONFIG-001` | valid profiles | strict JSON fragments from `04` examples | profile + run | no persistent cleanup | TC-CONFIG-001 |
| `DS-MS-CONFIG-NEG-001` | invalid config | unknown/duplicate/alias/type/range/static-boundary variants | case id | no persistent cleanup | TC-CONFIG-002/006 |
| `DS-MS-REDACTION-001` | leak corpus | sentinel secret/body/manifest/endpoint/stack/broker body | isolated corpus id | delete after scan | TC-REDACTION |
| `DS-MS-DEPENDENCY-001` | dependency graph | planned package graph + forbidden sibling edges | graph revision | no persistent cleanup | TC-ARCH-001 |

## 6. 按测试切口的数据前置映射

| 测试切口 | 典型用例 | 数据集 | fake / controlled seam | 清理 |
|---|---|---|---|---|
| contracts/domain/state | `TC-CONTRACT-*` / `TC-DOMAIN-*` / `TC-STATE-*` | PROTOCOL、SUBJECT、HOST、HEALTH | pure builder / in-memory | run drop |
| command orchestration | `TC-INTENT-*`…`TC-CLOSE-*` | CONTROL、QUAL、ASSEMBLY、REG、CLOSURE | fake repositories + UoW faults | run drop |
| query no-write | `TC-QUERY-*` | PROJECTION、REG、HEALTH、HISTORY | read snapshot + write spy | run drop |
| consumer | `TC-CONSUMER-*` | REF、MATERIAL、HANDOFF、HEALTH | fake envelope / resolver | reset fake + run drop |
| material/jobs | `TC-MATERIAL-*` / `TC-JOB-*` | MATERIAL、REPORT、CLOSURE、RECON | fake publisher/carrier/sandbox | run drop |
| idempotency/recovery | `TC-IDEMP-*` | IDEMP、FAULT、HOST | concurrent fake UoW | reset fault + run drop |
| config/redaction/dependency | `TC-CONFIG-*` / `TC-REDACTION-*` / `TC-ARCH-*` | CONFIG、REDACTION、DEPENDENCY | parser/builder/check scripts | delete corpus |

## 7. 数据构造、隔离与清理规则

- 所有固定时间、ID、revision、cursor、generation 和 operation digest 必须由注入的 Clock / IdGenerator / builder 提供；handler 不自行拼接。
- 同一 run 内的正向与负向用例使用不同 case namespace，避免异常数据掩盖正向断言。
- 真实 sibling 正文、credential value、endpoint、manifest 和运行结果正文不得进入 fixture；只允许安全 ref、summary、availability、freshness 和 reason ref。
- `deterministic_fixture.*` 数据只能由 `ci-test` test-entry 或 `operations-replay` replay run 构造；`local-dev` 不得读该数据集，`integration-like` 不得使用该数据集。
- projection / history / outbox / report 数据只在拥有者写入路径构造；不得直接写 source truth 以“准备”测试状态。
- 清理失败必须生成 safe cleanup issue，不能静默忽略；清理操作本身不得删除历史证据或跨 run 数据。

## 8. 数据停审与回填草稿

| 审计项 | 结论 |
|---|---|
| P0 用例均有可重复数据前置 | pass |
| 边界/异常/并发/恢复数据与 happy path 隔离 | pass |
| 外部依赖替身明确 | pass；fake / placeholder / controlled / disabled |
| 原始正文和 secret 不进入共享 fixture | pass |

正式 §7 应写核心数据集表、构造方式、隔离键、清理方式和按切口映射；不写实现仓已存在的 fixture 文件或运行结果。

- [x] 数据可重复生成。
- [x] 数据可隔离清理。
- [x] 可进入 Step 8。
