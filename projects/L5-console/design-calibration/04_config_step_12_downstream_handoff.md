# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节：`04-配置设计.md` §12
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与事实边界

本 Step 把正式 04 将提供的配置合同映射到未来 full-restart 的 `05/06/07/09`。它只定义下游输入和门禁，不写完整用例、验收 verdict、实现任务、部署命令、artifact/report/evidence 路径或已执行结果。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些进入测试？ | strict JSON、source priority、required/default、类型/enum/ref、profile/binding/flag cross-field、forbidden boundary、zero-secret/no-output、profile isolation、startup builder、partial dependency、rollback/migration。 |
| 哪些进入验收？ | no implicit fake、no silent fallback、no config-as-authority、no secret/body、no false bound/active/readiness、optional failure isolation、session-volatile honesty。 |
| 哪些进入实施？ | schema/parser/validator/source abstraction、typed mapping、builder integration、safe issue surface、tests；具体boundary由未来07。 |
| 哪些留运维？ | artifact versioning/delivery、document selector、immutable publication、external audit/digest、restart/rollback、alerts/runbook；不得新增配置key。 |
| 下游不得重复什么？ | 四项schema、defaults/required、source priority、startup-only、profile语义、sensitive/forbidden、failure/rollback和03影响判定。 |

## 3. 下游承接总表

| 下游 | 承接内容 | 本文输入 | 明确不提供 |
|---|---|---|---|
| `05-测试方案.md` | 配置对象/组合/环境/错误/安全/变更的验证策略与case | §6～§11矩阵与测试切口 | 测试结果、run_id、artifact、coverage数字 |
| `06-验收标准.md` | 配置进入/否决/放行门禁 | no-silent-fallback、no-secret、profile isolation、fail-closed规则 | verdict、signoff、readiness、阈值 |
| `07-实施计划.md` | parser/validator/mapping/builder/test的planned boundary | schema与装配链、03回写触发器、暂停条件 | 代码、commit、baseline、已完成状态 |
| `09-部署与运维手册.md` | artifact delivery/version/audit/restart/rollback/alert | source role、change/rollback、safe fields | 部署命令、平台产品、凭据值 |
| host/integration design | document delivery与dependencies injection | one-document/source role、zero-secret、narrow ports | URL/DOM/storage workaround |

## 4. `05-测试方案.md` 承接

| 测试主题 | 必测场景 | 层级建议 | 必须断言 |
|---|---|---|---|
| strict JSON | malformed/comment/trailing/duplicate/unknown/alias | unit/contract | whole-document reject，无raw echo |
| required/default | missing profile、missing optional fields | unit | profile fail-fast；bindings空、flags false |
| type/enum/ref | bad profile/boolean/array/object/slot/ref | unit/property | 无implicit coercion/string parsing |
| cross-field | binding.profile mismatch、duplicate slot、flag无前置 | unit/contract | reject，不fallback |
| profile isolation | fake进入integration/production-pending | contract/integration | reject；profile不等ready |
| forbidden config | endpoint/URL/secret/body/owner/private method/static boundary key | security/contract | reject且零输出 |
| builder | valid safe doc + dependencies；mandatory partial | integration | no partial protected runtime；availability不是health |
| invalidation | false/disabled、true缺合同、hint failure | integration/fake parity | explicit Query主链不变，无write/refresh |
| diagnostics | false、local fake true、production true reject、sink fail | integration/security | business invariant、no recursion/no body |
| state | all profiles session-volatile、carrier unavailable | integration | 无durability/positive restore/replay |
| rollback/migration | previous artifact revalidation、removed/legacy key | integration/release simulation | whole-document、no online LKG claim |

旧 `05-测试方案.md` 中 `ConsoleWorkspace/PanelState/workspace store/action history` 等不是本轮输入，必须 full-restart；不得将旧TC或固定阈值平移。

## 5. `06-验收标准.md` 配置门禁输入

| 门禁 | 通过输入 | 否决条件 | 证据类型（未来） |
|---|---|---|---|
| schema | 四域strict schema、unknown/duplicate reject | 接受旧key/extra/非法类型 | config validation report |
| explicit profile | 无隐式profile/fake | missing profile仍启动或自动fake | required-field negative evidence |
| no silent fallback | 高优先级非法即reject | 非法external退回default继续 | source priority evidence |
| profile isolation | fake/test只能local-fake | production-pending装配fake | profile matrix evidence |
| config not authority | config不授予permission/active/current/confirmed | flag/route/binding使正向状态成立 | state/guard negative evidence |
| sensitive no-output | raw secret/body/ref value不进入任何输出 | artifact/log/error/diagnostic/state泄露 | redaction scan |
| optional isolation | invalidation/diagnostic disabled/failed不改业务结果 | side-path失败阻断/重写业务 | integration evidence |
| state honesty | session-volatile，不声称durable | configured-medium/cross-session虚假声明 | carrier behavior evidence |
| change/rollback | whole-document review/revalidation | hot leaf patch/未校验rollback | change/rollback record |

上述仅是验收输入，不是当前验收标准、证据或通过结论。

## 6. `07-实施计划.md` 承接

| planned对象 | 设计输入 | 暂停条件 |
|---|---|---|
| JSON schema/parser | Step 7/9 | 需要新增field/alias/coercion时回04/03 |
| source abstraction | Step 5/9 | 实现需URL/DOM/storage/env leaf/remote source时暂停 |
| validator | Step 4/7/8/9 | owner/slot规则需新DTO/Port时回03 |
| typed mapper | 03 Step14 + Step7 | 不能1:1构造既有config时回03 |
| runtime builder integration | 03 `buildConsoleRuntime` + Step9 | 需要改signature/error/lifecycle时回03 |
| safe issue/diagnostic | Step8/9/11 | 需要raw values/error text时否决 |
| config tests | Step11/本Step | 无正式05/06时不得伪造release gate |
| artifact/deploy integration | Step10/09 | 目标仓/host/tool未确认时planned/blocked only |

正式07完成时仍必须同时遵循用户要求建立implementation ledger与planned boundary skeleton，且只能标planned/blocked/waiting；本Step没有提前创建。

## 7. `09-部署与运维手册.md` 承接

| 运维主题 | 本文给出的不变量 | 09继续定义 |
|---|---|---|
| artifact | 单一strict JSON、profile必填、immutable/versioned语义 | 具体路径/挂载/注入/校验命令 |
| selector | 选择整个document，不逐key覆盖 | env/CLI/platform selector名称（若正式批准） |
| secret | browser artifact零secret | host/SDK credential handling/runbook |
| rollout | validation→new runtime startup | 发布步骤、健康观察、人员/职责 |
| audit | safe refs/digests/classes only | 外部audit system与保留策略 |
| rollback | previous approved whole document重新validation | 命令、自动化、审批流程 |
| alerts | safe issue/facet/profile classes | alert路由/级别/on-call处置 |

## 8. 下游不得重复定义与事实诚实

- 不得新增配置key、alias、默认值或profile；如需改变先回04，影响代码契约则先回03。
- 不得把 `production-pending` 改写为 production-ready，或把配置验证成功当服务健康/数据current/capability active。
- 不得把 planned test cut 写成已通过 evidence，或把未来report/artifact path当已存在。
- 不得从旧05/06继承 workspace/panel/provider/store/fixed threshold 语义。
- 不得在09用env/CLI selector反向创造叶子覆盖优先级。
- 不得让07实现侧添加endpoint/secret/state medium/hot reload作为“便利配置”。

## 9. 跨下游审计与03影响

| 审计项 | 结论 |
|---|---|
| 05输入可测试且不含结果 | pass |
| 06输入可裁决且不含verdict | pass |
| 07输入可规划且不含任务/commit事实 | pass |
| 09输入可运维且不含部署命令/产品假设 | pass |
| 下游是否可能形成第二配置truth | 已以禁止重复定义规则阻断 |
| 旧05/06污染是否隔离 | pass；明确full-restart |
| 是否创建artifact/report/evidence/signoff/readiness | no |

| 配置结论 | 是否影响03 | 类型 | 回写位置 | 状态 |
|---|---|---|---|---|
| 下游引用当前schema/矩阵，不复制扩写 | 否 | truth source discipline | N/A | 无回写 |
| 实施若需改builder/config/port必须暂停 | 否（当前） | future trigger | 03对应Step | 当前无回写 |

## 10. 回填、待确认与门禁

正式§12应给出下游总表、测试主题、验收门禁、实施暂停条件和运维边界；必须标注未来 evidence类型不是现有事实。

| 待确认 | 当前处理 |
|---|---|
| 05/06正式重建内容与编号 | 等用户完成04停审后逐文档授权 |
| 07目标仓/host/tooling | 等07前置门禁 |
| 09平台/selector/audit/alert产品 | 等部署运维设计 |

| 进入Step13条件 | 结论 |
|---|---|
| 05/06/07/09承接明确 | pass |
| 未越界写完整用例/命令/任务 | pass |
| 不重复配置truth | pass |
| 无03待回写 | pass |

Step 12 `done / pass / self_reviewed`；允许串行进入 Step 13。
