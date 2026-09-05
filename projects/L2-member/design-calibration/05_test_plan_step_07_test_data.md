# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节：`projects/L2-member/05-测试方案.md` §7「测试数据设计」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_07_test_data.md`
> 数据口径：以下仅定义 planned 数据集、构造规则和隔离原则，不创建实现 fixture、seed 脚本或真实数据。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7：设计测试数据 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 6 `TC-L2M-*` 用例矩阵；`03` DTO / state / persistence；`04` profile / redaction |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_07_test_data.md` |
| 回填位置 | 正式 `05-测试方案.md` §7（Step 15） |
| 停审方式 | 数据集、fixture / builder / seed 规则、隔离 / 清理和替身边界完成后停审 |

## 2. 本步目标

为 Step 6 的 P0 用例定义可重复、可隔离、可清理的数据前置。数据必须符合正式字段、状态、双锚、body-free、版本和 owner 约束；负向、并发、恢复和 blocker 数据不得复用 happy-path 数据掩盖断言。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases.md` | 用例前置、断言和故障场景 |
| `03-详细设计.md` §6~§12 | 对象字段、协议、状态、Store、UoW、错误、幂等和恢复 |
| `04-配置设计.md` §6~§12 | profile、strict config、secret、availability、fail-fast 和 redaction |
| `03_ddd_step_16_test_cuts.md` | minimum cut、fake / controlled / blocked posture |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在？ | 合法 `ProjectMemberRef + GlobalMemberRef` 双锚、startup / presence、scope / policy safe ref、inbound fact descriptor、screening disposition、Runtime boundary ref、safe material、attempt / gap、trace / projection marker、typed result / receipt / report 和四个 P0 profile。 |
| 哪些边界和异常数据必须单独构造？ | 缺锚、错项目、owner mismatch、unknown / stale / conflict policy、forbidden body、unsupported schema、wrong digest / result kind、missing carrier、terminal / reserved state、CAS race、commit unknown、rollback failure、required slot unavailable、secret / redaction leak。 |
| 如何隔离不同测试运行？ | 每个数据集使用 `run-scope`、测试命名空间、双锚、operation namespace、local relation identity 和 deterministic clock / ID；不使用真实租户或跨 run 共享 mutable truth。 |
| 如何清理？ | 优先使用 per-run logical Store / fake UoW 生命周期清理；append-only / evidence-like planned 数据只在测试命名空间销毁或隔离，不对用户数据执行广泛删除；清理失败必须报告为测试环境问题，不伪造通过。 |
| 外部依赖用什么替身？ | `L2M-UP-*` seam 使用 deterministic fake、controlled response、disabled slot 或 event replay descriptor；不接真实 sibling 代码，不将 fake response 当外部成功。 |
| 每个 P0 用例是否可回指数据集？ | 是。所有 `TC-L2M-CMD-*`、`QRY-*`、`CON-*`、`JOB-*` 和共用 cut 映射到 `DS-L2M-*`，无数据前置的 pre-gate 用例显式标记 `DS-L2M-INVALID`。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 使用 persona / UI 造数 | 改为当前 typed ref、双锚和 local fact 造数 |
| 旧环境可能共享数据库 | 规定 per-run namespace、fake Store 和清理门禁 |
| 负向场景与 happy path 混用 | 为 invalid / blocked / conflict / race / redaction 建独立数据集 |
| 事件候选可能被当输入 | 24 candidate 不是 source data；只用 `DS-L2M-EVENT-BLOCK` 检查不物化 |
| 外部正文可能进入 fixture | 所有外部输入只保留 descriptor / safe category / fingerprint；raw body 只能在受控瞬时检查内，不进入持久化 fixture |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| 数据主语 | persona / endpoint | ProjectMember + GlobalMember 双锚 | 对齐需求和 owner 边界 |
| 数据形态 | 可能保存完整正文 | typed ref、safe snapshot、marker、fingerprint | body-free / redaction 红线 |
| 隔离 | 表级或人工清理不明确 | run-scope + operation namespace + fake UoW | 可重复且避免污染 |
| 外部依赖 | real-like 默认假设 | fake / controlled / disabled / blocked | 上游合同未闭合 |

## 7. 测试设计取舍

| 议题 | 结论 | 取舍 |
|---|---|---|
| 是否共享所有 happy-path fixture | 只共享 immutable baseline；mutable / fault 数据独立复制 | 避免状态泄漏 |
| 是否在 fixture 中保存 raw body | 不保存 | 仅用 body-present marker / redaction corpus |
| 是否用固定时间和 ID | 测试 profile 使用 deterministic Clock / ID；生产 profile 不假设 | 保证 digest / replay 可重复 |
| 是否模拟真实 DB / Bus | 不在 P0 | P1 durable-like / real-like 由合同关闭后另行设计 |

## 8. 结构化中间产物

### 8.1 数据集总表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-L2M-BASE` | 合法双锚与基础 local context | typed builder + deterministic IDs | run-scope + subject anchor | per-run Store teardown | 全部 local positive |
| `DS-L2M-PRESENCE` | admission / presence 状态 | factory + state successor | presence ID + version | logical Store reset | CMD-001~003、QRY-001 |
| `DS-L2M-HOST` | host material / attempt | safe category + opaque host ref | host relation + operation ns | relation cleanup | CMD-004、CON-001、QRY-002 |
| `DS-L2M-INBOUND` | scope、inbound fact、screening | body-free descriptor + rule ref | fact ID + source fingerprint | local fact namespace | CMD-005~007、CON-002、QRY-003~004 |
| `DS-L2M-RUNTIME` | delivery / submission / reception | Runtime boundary / material ref | attempt ID + correlation | attempt namespace | CMD-007~008、CON-003/011、QRY-005~006 |
| `DS-L2M-OUTBOUND` | outbound material / attempt / gap | committed safe material + local refs | material / attempt ID | local relation teardown | QRY-007~008、JOB-001、CON-004 |
| `DS-L2M-TRACE` | trace / observation | committed refs + safe marker | correlation + trace relation | trace namespace | CON-005/012、QRY-009~011、JOB-002 |
| `DS-L2M-MIRROR` | external snapshot / resolution / gap | owner-specific opaque ref + freshness | source ref + purpose/scope | mirror namespace | CMD-009~010、CON-006~010、QRY-012~013、JOB-003 |
| `DS-L2M-PROJECTION` | summary / outlet / projection | committed source refs + cursor | projection key + watermark | projection namespace | QRY-014~016、CON-013/014、JOB-004~005 |
| `DS-L2M-INVALID` | pre-gate rejection | field omission / wrong type / wrong name | run-scope + case ID | discard after case | COMMON-001、CMD / QRY / CON / JOB invalid |
| `DS-L2M-CONFLICT` | CAS / digest / owner conflict | two versions / altered digest / mismatch refs | operation ns + key | fake UoW rollback | COMMON-003/006、state cases |
| `DS-L2M-REPLAY` | duplicate / missing carrier / in-flight | completed / reserved relation variants | channel + operation + idempotency key | idempotency namespace reset | COMMON-002/004/005 |
| `DS-L2M-FAULT` | commit unknown / rollback failure / adapter unavailable | fault-injection controls | run-scope + fault ID | fake adapter reset | recovery / Job partial |
| `DS-L2M-REDACTION` | body / secret / high-cardinality corpus | markers and safe fingerprints only | corpus ID + run-scope | destroy corpus after scan | COMMON-007、NFR-SEC |
| `DS-L2M-CONFIG` | four P0 profiles and invalid configs | strict JSON / bounded env selectors | profile + run-scope | config fixture reset | COMMON-008、builder |
| `DS-L2M-EVENT-BLOCK` | 24 candidate non-materialization | candidate name + blocked marker | candidate + run-scope | no event store created | EVT-001~002 |

### 8.2 Fixture / builder / seed 规则

| 规则 | 约束 |
|---|---|
| baseline builder | 只能生成正式 `contracts` carrier 和 domain factory 所需字段；不得生成 foreign body、外部成功或未定义状态 |
| state builder | 只能通过正式 factory / successor helper 生成合法状态；非法 / reserved 数据通过受控错误构造，不直接改 status 字段 |
| protocol builder | name、typed body、双锚、metadata、trace、idempotency 和 result-kind 必须显式配对；Query 不生成 idempotency key |
| stored-result seed | 仅为 duplicate / missing / wrong-kind 场景创建 typed stored carrier；不能从 current projection 反推 carrier |
| adapter seed | 返回 `Blocked`、`Waiting`、`Unknown`、unavailable 或安全 ref；不得返回伪造 host / Runtime / Bus / observed success |
| fault injector | 只注入 UoW、CAS、adapter、schema、digest 和 slot fault；不改变 domain owner 或补齐 DDD gap |

### 8.3 用例到数据前置映射

| 用例族 | 数据集 | 必须隔离的 mutable relation | 清理 / 重置 |
|---|---|---|---|
| `TC-L2M-CMD-*` | BASE + 对应 CP 数据集 | command relation、successor、attempt、resolution | 每用例新 operation namespace |
| `TC-L2M-QRY-*` | 对应 committed snapshot / projection | 仅 reader cursor；禁止写 relation | reader scope reset |
| `TC-L2M-CON-*` | source descriptor + receipt seed | receipt、fact / feedback / projection successor | source / receipt namespace reset |
| `TC-L2M-JOB-*` | continuation selector + item set | per-item relation、report | job invocation namespace reset |
| `TC-L2M-COMMON-*` | INVALID / REPLAY / CONFLICT / FAULT | idempotency / UoW / version | fake UoW rollback + reset |
| `TC-L2M-EVT-*` | EVENT-BLOCK | 不允许任何 event relation | 断言不存在物化对象 |

### 8.4 数据安全与隔离规则

- 数据集只允许 `ProjectMemberRef + GlobalMemberRef` 双锚；匿名、GlobalMember 代主语、personal / non-project subject 只作为拒绝输入。
- 外部正文、Runtime context / plan / outcome、tool input / output、conversation / artifact body、credential value、private key 和完整 stack trace 不进入 fixture、snapshot、report 或 diagnostic。
- digest / idempotency / dedup key 使用 deterministic 但不可逆的测试值；原始 key 不进入日志、指标或 view 断言。
- 并发数据必须拥有不同加载版本但相同 relation identity，才能验证单赢家；不同 operation namespace 不得互相 replay。

## 9. 测试数据停审记录

| 数据组 | 可重复构造 | 隔离键 | 清理方式 | 替身边界 | 结论 |
|---|---|---|---|---|---|
| BASE / CP 数据 | 是 | run + subject + relation | per-run logical reset | local only | `pass` |
| INVALID / CONFLICT / REPLAY | 是 | case + operation ns | rollback / reset | no external success | `pass` |
| FAULT / CONFIG | 是 | fault / profile + run | adapter / config reset | blocked-aware | `pass_with_blockers` |
| REDACTION / EVENT-BLOCK | 是 | corpus / candidate | destroy / no materialization | static boundary | `pass` |

## 10. 跨数据隔离 / 清理审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| happy-path 数据污染 negative case | `prevented` | 独立数据集和 operation namespace |
| Query 与 writer 共享可变对象 | `guarded` | Query 使用只读 snapshot / spy |
| duplicate case 重用旧 carrier | `controlled` | 每 case 显式 seed matching / wrong carrier |
| external raw body 泄漏 | `prevented` | 只用 marker / fingerprint |
| 清理失败如何处理 | `blocked` | 环境问题阻断 run，不伪造 pass |
| 24 candidate 误建 source event | `prevented` | EVENT-BLOCK 无 event store / topic |

## 11. 回填草稿（供正式 §7）

测试数据按 `DS-L2M-*` 数据集组织：合法基础双锚和各 CP local relation 使用 typed builder、domain factory 与 deterministic Clock / ID；invalid、conflict、replay、fault、redaction、config 和 event-block 场景使用独立数据集。每个用例绑定 run-scope、subject anchor、operation namespace 和 relation identity，mutable relation 不跨用例复用。

外部协作只使用 deterministic fake、controlled response、disabled slot 或事件回放 descriptor；fixture 不保存 raw body、secret、Runtime / tool / conversation / artifact 正文或外部成功。清理以 per-run logical Store / fake UoW 为界，清理失败阻断测试环境，不生成伪通过。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 目标实现仓与 fixture API | 实际 builder / seed 名称 | `L2M-DDD-001` 保持 pending；Step 7 不发明函数名 |
| durable Store 清理机制 | P1 集成运行 | `L2M-DDD-002` 关闭后补充，不影响 fake P0 |
| 外部 source body / credential provider | positive seam | 只保留 marker / opaque ref，待 `L2M-UP-001~008` |

- [x] 所有 P0 用例均有可重复数据集或明确无数据前置。
- [x] invalid、boundary、concurrency、recovery 和 redaction 数据独立。
- [x] 隔离、清理、替身和 raw body 红线已审计。

**Step 7 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 8。
