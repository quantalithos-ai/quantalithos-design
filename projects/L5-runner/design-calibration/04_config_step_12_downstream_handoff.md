# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节：`04-配置设计.md` §12
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md`
> 输入：Step 6～11、测试/验收/实施/运维书写规范、旧 05/06 仅作历史扫描
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 12 |
| current_module | `handoff:test_acceptance_implementation_operations` |
| gate_status | `pass_for_step_13` |
| gate_reason | 05/06/07/09 的配置输入、门禁、暂停条件、证据边界和禁止重复定义项已闭合；未生成任何结果/证据/实施事实。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_13_migration_deprecation_evolution.md` |

本 Step 只规定下游应承接什么，不写完整 TC、验收 verdict、commit boundary、部署命令、路径、阈值、artifact/report/evidence 或已执行结果。当前旧 `05/06` 仍是 historical material；新版必须在用户授权后按各自 SOP full-restart。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些进入测试？ | strict JSON/source/snapshot、七域字段、四 profile、type/range/ref/cross-field/VETO、secret zero-output、builder exposure、configured/enabled/ready、run-local冻结、failure/no fallback、rollback/drift。 |
| 哪些进入验收？ | 显式 profile/version、无 fake/private/LKG/silent fallback、核心 store/adapter/authority/完整性 fail-closed、redaction零泄露、Unknown/no-replay、config不产生owner truth、证据成熟度诚实。 |
| 哪些进入实施？ | schema/source abstraction/parser/validator/typed mapping/snapshot/config identity/builder/registry/policy injection/safe issues/config tests；exact file/command等07在authority闭合后决定。 |
| 哪些留运维？ | document artifact delivery/selector、approved version/digest、provider实接、startup/restart/rollback、drift检查、alerts/runbook、platform support；不能新增key或覆盖链。 |
| 下游不能重定义什么？ | 七域schema、required/default、single-document source、profile语义、sensitive/ref规则、生效/rollback/failure、VETO、configured/enabled/ready及03 owner/state/no-replay边界。 |

## 3. 下游承接总表

| 下游 | 承接内容 | 本文提供 | 本文不提供 |
|---|---|---|---|
| `05-测试方案.md` | 配置对象/组合/环境/错误/安全/恢复测试与证据设计 | Step 6～11矩阵、规则ID、test cuts | TC编号、脚本、fixture文件、执行结果/run_id/report |
| `06-验收标准.md` | 配置放行/否决/风险接受门禁 | VETO、fail-closed、zero-leakage、readiness truth、blocker | verdict/signoff/readiness/实际证据 |
| `07-实施计划.md` | 可验证配置基础设施与阶段门禁 | logical tasks、03回写触发器、blocked authorities | 代码、目标文件、commit/baseline、完成状态；本轮不创建implementation ledger/skeleton |
| `09-部署与运维手册.md` | artifact/selector/provider/restart/rollback/drift/alert操作 | 运行不变量、安全字段、暂停条件 | 命令、路径、env名称、产品、credential、真实阈值 |
| upstream/integration owners | Runner所需binding/profile/capability closure | per-slot blocker与opaque ref边界 | 私有实现/数据库/bus/DTO猜测 |

## 4. `05-测试方案.md` 承接

| 测试主题 | 必测范围 | 推荐切口 | 必须断言 |
|---|---|---|---|
| source/strict JSON | missing/unreadable/ambiguous/comment/trailing/duplicate/unknown/alias | parser/source contract | no snapshot/no raw echo/no fallback |
| item schema | 七模块 required/type/enum/nullable/ref | unit/property | exact closed schema；config_ref/marker不能作为输入 |
| numeric | zero/overflow/static cap/authority pending | validator | reject/Blocked，无historical/default猜值 |
| cross-field | profile/provider、stores、slots、features、archive、horizons、retry | unit/service | rule ID对应结果，零silent fallback |
| profile matrix | local-safe/test/integration/product | contract/integration | fake只test；environment/profile/readiness分离 |
| sensitive/no-output | raw secret/path/URL/body/provider error | security/unit/integration | 全输出面无material/full sensitive ref |
| builder | valid snapshot、core capability missing、per-slot blocked | integration | no half facade；configured≠enabled≠ready |
| entry/Job | selector整文档、run-local only tighter、snapshot frozen | entry/operations | invalid零mutation/owner call；old report不改 |
| state/truth boundary | config试图approval/latest/Running/Cleaned/query write/no-replay override | contract/security | VETO reject；无upstream truth writeback |
| runtime dependency | unavailable/timeout/unknown/redaction failure | service/integration | typed surface、RecoveryCase/no replay/no raw fallback |
| change/rollback/drift | invalid new doc、previous artifact revalidation、digest mismatch | release simulation | whole-document/new assembly；无online LKG/latest |
| cross-platform | unsupported/unknown/conflict provider | adapter parity | no private backend/PID/port truth upgrade |

05 必须继续设计 test data、fake/durable parity、environment topology、automation gates和evidence schema，但不得把 test fixture 数字当 production oracle，或把 planned fake结果当真实 integration evidence。

## 5. `06-验收标准.md` 配置门禁输入

| 门禁 | 通过条件（未来需证据） | 否决候选 | 当前事实 |
|---|---|---|---|
| strict source/schema | single immutable document、closed JSON、非法全拒绝 | leaf override/unknown/duplicate/invalid fallback | 仅设计完成 |
| explicit profile/isolation | profile显式；fake只test | implicit fake、product/integration fake fallback | 仅设计完成 |
| core composition | required local guarantees不足不暴露facade | partial builder对外、in-memory当production | blocked pending implementation |
| external readiness honesty | configured/enabled/ready分离，RUN-UP blocker保留 | binding ref即Ready、ACK即Running | blocked upstream |
| authority/integrity | config不能批准、选latest、绕过manifest/digest/signature/platform | local approval/bypass | blocked upstream |
| sensitive zero-output | raw secret/body/path/URL/full sensitive ref不进任何输出 | 任一泄露 | 无执行证据 |
| failure/recovery | high-risk fail-closed；Unknown/no replay；rollback重验 | silent/private/fake/LKG fallback | 无执行证据 |
| truth/evidence | config/local record不产生owner truth/formal evidence | local log/report变evidence/verdict/signoff | 设计VETO；无证据事实 |
| change governance | high risk有review/safe record/whole rollback | admin hot patch/未验证rollback | 外部owner机制pending |

正式 06 只能在正式 05 证据结构完成后定义裁决；不得把本表当成通过、条件通过或不通过结论。

## 6. `07-实施计划.md` 承接与暂停条件

| planned task family | 04 输入 | 开工/暂停条件 |
|---|---|---|
| schema/source snapshot/parser | Step 5/7/9 | 目标语言/repo/host delivery未定时planned/blocked；不能先造env/path |
| validator/rule registry | Step 7/9 `RUN-CFG-V-*` | 若需新增字段/carrier/error，暂停回03/04 |
| validated snapshot/config identity | Step 9 | canonical algorithm/identity authority未定时不伪造digest |
| store/cache builder | Step 7/9 | `RUN-DDD-003`未闭合不得宣称durable/ready |
| SDK/owner/Sandbox/Runtime/platform adapters | Step 7/9 | exact public seam未闭合保持blocked；禁止private implementation |
| redaction/diagnostic/handoff | Step 8/9/11 | zero-output与formal contract未闭合不能正向ready |
| typed limit/Job policy injection | Step 7/9 | numeric authority/horizon未定保持blocked；不抄demo `1` |
| clock/id/digest/test fixtures | Step 7/8 | fake只test；production provider authority未定 |
| config tests/gates | Step 11/本Step | 正式05/06未完成前只planned，不伪造TC/evidence |

正式 07 完成时才按用户要求创建 implementation ledger 和全部 planned boundary skeleton，状态保持 planned/blocked/waiting；当前 Step 12 明确不提前创建。

## 7. `09-部署与运维手册.md` 承接

| 运维主题 | 04 固定不变量 | 09 后续定义（获得事实后） |
|---|---|---|
| config artifact | one strict JSON、schema/profile显式、immutable/versioned、no secret | 实际文件/artifact/version/digest/权限/发布位置 |
| selector/delivery | 选择完整document，不leaf override | 正式env/CLI/host selector名称与命令 |
| provider/material | opaque refs，material不出adapter/provider | 产品、权限、挂载/注入、轮换/zeroization步骤 |
| startup/readiness | validate→new builder；per-slot readiness | 实际启动命令、health/readiness检查 |
| rollback | previous approved whole document重新验证/new assembly | 审批、命令、stop/start、验证和失败止血 |
| drift | source/config/digest refs比对，无latest/LKG | 实际校验工具、频率、告警路由 |
| alerts | safe slot/profile/rule/issue字段 | 阈值、聚合、dashboard、on-call/runbook |
| cross-platform | unsupported/unknown/conflict显式 | OS/arch support matrix、权限与实际probe说明 |

09 不得用部署便利反向引入 raw env secret、逐叶 override、hot reload、private Sandbox/backend、直接 sibling DB/bus 或未评审 numeric defaults。

## 8. 下游不得重复定义与证据边界

| 契约 | 真相源 | 下游允许 | 下游禁止 |
|---|---|---|---|
| schema/default/required/source | 04 §5/§7 | 测试/映射/操作 | 新key/alias/default/priority |
| profile | 04 §6 | 环境映射/测试 | 新profile、profile=readiness |
| sensitive/secret | 04 §8 + 03 observability | redaction test/provider ops | raw material/完整ref输出 |
| load/activate | 04 §9 | implementation/tests/ops | hot/reload/LKG/source overlay |
| change/rollback | 04 §10 | review/audit/runbook | stored truth/report改写、未重验rollback |
| failure | 04 §11 + 03 recovery | tests/alert/runbook | illegal→degraded success、Unknown replay |
| object/port/state/truth | 03 | implement/verify | 由config改签名、owner或状态 |

| 未来 evidence 类型 | 应证明 | 当前是否存在 |
|---|---|---|
| config validation report | strict/type/range/cross-field/VETO结果 | 否，不得伪造 |
| profile/fake isolation report | 四profile组合与no contamination | 否 |
| zero-output/redaction scan | forbidden fields/material未输出 | 否 |
| builder/readiness report | core/slot markers与no half facade | 否 |
| no-replay/query-no-write report | failure/recovery安全边界 | 否 |
| change/rollback/drift record | review、digest、revalidation、activation | 否 |

这些未来材料即使生成，也必须由 05/06/09 定义其 schema、来源、成熟度和裁决用途；Runner local report不能自动成为 formal evidence。

## 9. 跨下游审计、03 影响与门禁

| 审计项 | 结论 |
|---|---|
| 05输入是否可执行且不含结果 | pass |
| 06输入是否可裁决且不含verdict | pass |
| 07输入是否可规划且不含代码/commit事实 | pass |
| 09输入是否可运维且不含命令/产品假设 | pass |
| 下游是否可能形成第二config truth | 已用禁止重复定义表阻断 |
| 旧05/06是否被误当current | no；historical only/full-restart required |
| 是否创建implementation ledger/skeleton | no；只允许正式07完成时 |
| 是否生成artifact/report/evidence/readiness | no |

| 结论 | 是否影响 03 | 状态 |
|---|---|---|
| 下游只承接、不能改写04/03契约 | 否 | 无回写 |
| 若实施/测试/运维需要新config字段、port/error/lifecycle | 是 | 暂停对应下游，先回03/04；当前无待回写 |

未来正式 §12 应回填下游总表、05/06/07/09矩阵、禁止重复定义和证据边界。

| 待确认事项 | 当前处理 |
|---|---|
| 新版05/06/07何时启动 | 严格等待04停审与用户逐文档确认 |
| 09是否/何时创建 | 当前只留承接；不越过07/项目流程 |
| exact实现仓/语言/host/tooling | blockers保留，07不得伪造 |

| 进入 Step 13 条件 | 结论 |
|---|---|
| 05/06/07/09承接与禁止重定义明确 | pass |
| 证据成熟度、blocker与事实边界诚实 | pass |
| 未代写下游或产生虚假工件 | pass |
| 无当前 `待回写`/`阻塞待确认` 03 影响 | pass |

Step 12 完成，允许进入 Step 13；正式 04 仍不可写。
