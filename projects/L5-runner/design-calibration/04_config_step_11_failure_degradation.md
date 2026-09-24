# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节：`04-配置设计.md` §11
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md`
> 输入：Step 5、Step 7～10、03 Step 12/14/15/16
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与策略术语

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 11 |
| current_module | `failure:fail_fast_closed_and_degraded` |
| gate_status | `pass_for_step_12` |
| gate_reason | missing/invalid/unavailable/expired/drift/failure 模式、策略、safe observation 和测试切口均已闭合；无 silent fallback 或 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_12_downstream_handoff.md` |

| 策略 | Runner 配置语义 |
|---|---|
| `fail-fast` | 在 bootstrap/entry/Job/test start 发现不可构造输入时立即失败，不暴露新 facade、不进入 mutation/owner call。 |
| `fail-closed` | authority、安全、redaction、capability 或 effect 不确定时保持 Blocked/Unknown/Restricted/ManualReview，不用宽松默认补齐。 |
| `disabled` | optional feature 未请求或显式 false；不建立对应 positive capability，不影响无关安全主链。 |
| `degraded` | 合法配置下运行期 safe read/外围能力部分不可用；通过 03 typed surface 暴露，不修 truth。非法配置不得降级成可运行。 |
| `reject-new-value` | 新文档/Job/entry input非法则拒绝，不热改当前 snapshot。 |
| `restart rollback` | 外部 owner显式选择前一份仍获批准且重新验证通过的完整文档，建立新 assembly。 |
| `last-known-good` | P0 不提供自动/online LKG；不能搜索“latest good”或信任旧缓存。 |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 必填缺失？ | startup required缺失→new assembly fail-fast；Job policy/target缺失→当前 Job rejected；entry selector缺失/冲突→当前 entry rejected；fixture缺失→test fail-fast。 |
| 类型/范围/cross-field错误？ | 按生效边界 reject/fail-fast；高优先级/新文档非法不回退 safe default或旧文档。 |
| secret/provider不可用？ | raw secret出现直接security reject；required ref resolver/provider不可用则core/slot blocked，绝不fake/private/LKG fallback。 |
| config center不可达？ | P0 无 config center/admin override，因此不存在该 runtime dependency；出现此 source/control request 即 unsupported。 |
| 漂移/过期？ | 对 external artifact/source/config refs与redacted digest做外部/启动校验；不一致阻止新 assembly。运行中 snapshot冻结，authority/lease/source过期由业务 recovery gate处理，不用config override。 |

## 3. 失效模式表

| 失效模式 | 影响 | 系统行为 | 安全记录/告警语义 | 未来测试切口 |
|---|---|---|---|---|
| source未选择、缺失、不可读、多选 | 无唯一完整document | entry/bootstrap fail-fast | source class/ref + issue；无path/body | missing/unreadable/ambiguous source |
| malformed JSON/comment/trailing/duplicate | shape不可信 | whole document reject | parse class/section only | strict parser negative matrix |
| unknown/alias/removed key | schema漂移/历史污染 | reject | key class + schema version | unknown/legacy key |
| schema/profile缺失/未知 | assembly posture未知 | fail-fast；不default test/local/product | safe enum class | required/closed enum |
| store/cache ref缺失/非法 | local guarantees不成立 | core builder blocked/failed；no facade/mutation | slot/capability/issue | each core ref negative |
| store capability无法证明 | UoW/version/durability/quarantine不足 | builder/affected capability Blocked；no fallback | safe capability class | marker/facade exposure |
| adapter slot重复/unknown/ref非法 | registry不可信 | reject document | slot/rule ID | slot matrix |
| external contract未闭合 | positive call不安全 | per-slot Blocked/Unsupported；相关 command/job fail-closed，safe query可degraded | blocker/slot/issue | configured≠ready |
| product/integration使用fake/fixture | profile隔离破坏 | security/profile reject | profile/provider class | fake contamination |
| numeric missing/zero/overflow/超cap | boundedness不成立 | startup fail-fast；run-local reject | policy/range class | all limits boundaries |
| numeric authority未定 | 无合法product值 | affected capability `ConfigAuthorityPending`/Blocked | policy family/blocker | no guessed default |
| idempotency horizon不足/未知 | duplicate/commit unknown不安全 | mutation/Consumer/Job blocked；startup可fail-fast | horizon class/issue | cross-horizon cases |
| retry policy允许possible-effect replay | 重复副作用 | reject policy；Unknown保留RecoveryCase/manual review | policy/rule ID | timeout/commit-unknown no replay |
| redaction ref缺失/不可用/失败 | 输出可能泄露 | no visible content/handoff；affected output Blocked | policy/slot/issue，无raw | fail-closed redaction |
| raw secret/body/path/URL/credential出现 | 泄露/越界 | security reject；不回显 | forbidden class only | no-output assertions |
| optional feature=false/target null | 外围能力未启用 | DisabledByConfig；core无关路径继续 | optional info marker | disabled isolation |
| feature=true但ref/contract不全 | 虚假启用 | reject或explicit Blocked；不true-but-ready | feature/prerequisite class | prerequisite matrix |
| archive requested但blocked | peripheral unavailable | Archive path Blocked；不影响run/cleanup core success | slot/issue | peripheral isolation |
| clock/id/digest provider缺失 | mutation identity/time/digest无来源 | mutation/Job blocked before reserve/write；safe read可受限 | provider class | zero mutation calls |
| Job input扩大startup cap/改global | 越权 | current Job rejected；global snapshot不变 | Job kind/rule issue | stricter-only |
| entry selector尝试leaf override | 越权来源 | current entry rejected | selector/rule issue | no global mutation |
| new assembly parse/build失败 | 变更不能激活 | reject new value；旧runtime不被原地改 | change/config refs/result | rollback target revalidation |
| runtime adapter暂时Unavailable | 合法配置但依赖失效 | typed Unavailable/Degraded/Unknown；no private fallback | slot/outcome/diagnostic ref | per-port runtime failure |
| timeout/断线且effect可能发生 | owner outcome不可判定 | Unknown + RecoveryCase/query-first；no replay | correlation/recovery ref | ambiguous effect |
| config artifact digest drift | source不可复核 | 阻断新 assembly/release gate；重新取approved artifact | expected/actual redacted digest | drift mismatch |
| previous rollback artifact撤销/不兼容 | 不能安全回滚 | rollback rejected；新修复document | target/status issue | no implicit LKG |
| config center/admin/hot key/source | 未设计控制面 | Unsupported/reject | control/source class | unsupported controls |
| test fixture缺失/非法 | 不可重复 | test assembly fail-fast | fixture digest/class | deterministic fixture |

## 4. 按域与生效方式的失败策略

| 域 | invalid config | runtime dependency failure | safe continuation | 禁止 fallback |
|---|---|---|---|---|
| runtime | whole assembly fail-fast | N/A；profile不等health | none for new assembly | implicit profile/LKG |
| stores | fail-fast/Blocked | storage unknown按03 recovery，no write replay | safe reads only if formally supported | in-memory/test/product switch |
| bindings | reject | per-slot typed blocked/degraded/unavailable | unrelated paths only | private SDK/backend/direct DB/bus |
| limits | fail-fast/entry/Job reject | N/A；policy frozen | existing Job keeps basis | zero/unlimited/old numeric default |
| observability | redaction fail-fast/closed；optional ref reject | diagnostic/telemetry外围可failed/degraded | business truth unchanged；no raw output | local raw log as evidence/content |
| determinism | fail-fast/mutation blocked | provider runtime error maps typed Unknown/Blocked | no new mutation identity | timestamp/PID/path-based fallback |
| features | invalid prerequisite reject/Blocked | peripheral path failed/degraded | core unrelated path | flag creates authority/readiness |

| 生效边界 | 检测点 | 策略 | 恢复 |
|---|---|---|---|
| startup/new assembly | source→parse→validate→builder | fail-fast/fail-closed | fix or explicit approved whole-document rollback + new assembly |
| job-run-start | effective policy/target/basis before reserve/claim | reject current run | new run with valid input;old report immutable |
| entry-start | exactly-one whole-document/profile selector | reject current entry | rerun with valid selector |
| test-startup | document/fixture/fake family | test fail-fast | fix fixture/document, rerun |
| runtime port call | readiness + formal basis + typed result | degraded/unavailable/unknown/recovery per 03 | re-read/probe/reconcile only where formal;no replay |

## 5. 安全记录与告警要求

| 场景 | 是否需下游告警/记录 | 允许字段 | 禁止字段 |
|---|---|---|---|
| startup validation/builder failure | yes | config/source ref、profile、section/slot/rule class、safe issue | raw doc/value/path/secret |
| forbidden material/VETO attempt | security-level | forbidden class、source/issue ref | detected material/body |
| numeric authority pending | visible blocker/operations record | policy family、authority blocker | guessed number |
| per-slot unavailable/blocked | aggregate by slot/outcome | slot、readiness、safe diagnostic/ref | endpoint/SDK error/body |
| redaction failure | security/availability | policy/slot/issue | raw material that failed redaction |
| Job/entry invalid | warn/info by environment | entry/Job kind、rule、issue/run ref | request body/target/full ref |
| drift/rollback rejected | yes | expected/actual digest refs、artifact/status class | full config |
| optional disabled | normally info, not business failure | feature/slot/posture | secret/ref value |

本表只定义 observability input，不声明已有 alert backend、dashboard、report或evidence。

## 6. 测试切口

| 切口 | 最小断言 |
|---|---|
| source/strict JSON | missing/ambiguous/comment/trailing/duplicate/unknown均不构造snapshot |
| required/type/range | 每个required缺失、类型错、零/overflow/超cap被拒绝 |
| ref/secret/body | URL/path/credential/body拒绝，issue/log不回显 |
| profile isolation | test fake不能进入 local/integration/product；无implicit profile |
| configured/readiness | valid ref只形成configured input，contract blocker仍Blocked |
| core builder | 任一required local guarantee不足不暴露facade |
| cross-field | slot uniqueness、feature/ref、archive pair、horizon、retry/no-replay |
| entry/Job scope | selector不leaf override；Job只可收窄cap，拒绝时零mutation/owner call |
| runtime unavailable | per-port typed outcome，无private/fake fallback，无truth writeback |
| redaction | failure无visible content/handoff/raw log fallback |
| timeout/unknown | RecoveryCase/query-first/no replay |
| change/rollback | invalid new config不改旧snapshot；rollback artifact需重新验证 |
| drift | digest mismatch阻止new assembly，不搜索latest/LKG |
| test fixture | missing/invalid fail-fast；non-test污染reject |

## 7. 停审与跨失效审计

| 审计项 | 结论 |
|---|---|
| 每个P0配置族的missing/invalid/runtime failure有策略 | pass |
| fail-fast/fail-closed/degraded是否区分 | pass；非法配置永不degraded成可运行 |
| high-risk/high-priority invalid是否silent fallback | no |
| required dependency是否fake/private fallback | no |
| Unknown/commit-unknown是否replay | no |
| redaction failure是否raw fallback | no |
| optional disabled是否改变core truth | no |
| drift/rollback是否隐式LKG/latest | no |
| config failure是否被写成owner业务失败/success | no |
| safe record是否冒充alert/evidence已存在 | no |

## 8. 03 影响、回填与门禁

| 结论 | 是否影响 03 | 类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| invalid config fail-fast；runtime dependency typed degraded/unknown | 否 | existing error/recovery mapping | N/A | 无回写 |
| no silent/fake/private/LKG fallback | 否 | existing safety boundary | N/A | 无回写 |
| timeout/effect unknown保持RecoveryCase/no replay | 否 | existing concurrency/recovery | N/A | 无回写 |
| future remote config/provider health/online LKG/alert contract | 是 | loader/builder/port/error/observability | 03 Step 7/9/12/13/14/15 | 当前排除，未来重开 |

未来正式 §11 应回填策略定义、失效模式表、域/生效矩阵、安全记录和测试切口，并标注测试切口不是测试结果。

| 待确认事项 | 当前处理 |
|---|---|
| alert平台/级别/聚合阈值/SLO | 09运维文档/authority；04不写数字或已告警事实 |
| exact required product slot set与provider health | upstream/implementation blockers；按per-slot/core语义 fail-closed |

| 进入 Step 12 条件 | 结论 |
|---|---|
| P0失效模式、策略、安全记录和测试切口完整 | pass |
| 无silent fallback、truth/evidence升级或未处理内部冲突 | pass |
| 无当前 `待回写`/`阻塞待确认` 03 影响 | pass |

Step 11 完成，允许进入 Step 12；正式 04 仍不可写，未产生告警或测试结果。
