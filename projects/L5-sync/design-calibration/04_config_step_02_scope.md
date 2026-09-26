# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2。
> 回填章节：未来正式 `04-配置设计.md` §2。

## 1. Step 状态与计划

| 项目 | 状态 |
|---|---|
| 当前 Step | `2 / scope` |
| 前序依赖 | Step 1 `pass_with_upstream_blockers` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 正式 04 写入 | false |
| 下一动作 | `enter_step_03_control_plane` |

| 批次 | 产物 | 状态 |
|---|---|---|
| 2.1 | P0/P1/P2 定义与目标表 | completed |
| 2.2 | 范围/非范围与残余风险 | completed |
| 2.3 | 03 影响判定、自检与停审 | completed |

## 2. 本步输入

| 输入 | 承接结论 |
|---|---|
| Step 1 | 只细化正式 03 已有八 config family 与 top-level identity；上游 04 不关闭 blocker |
| 正式 03 §13 / Step 14 | 42 个 code-level leaf、22 capability、四态 availability、cold composition、禁止配置化边界 |
| 正式 03 §17 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`、下游和实现仓风险 |
| 配置 SOP / 规范 | 配置是控制面，不是实现/部署；P0 项必须可校验、可测试、可失效 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. P0 必须定义什么才能运行主链？ | P0 定义一个可完整解析、校验和分类 capability 的配置候选：config/profile identity、五类 boundary limit、八类 execution budget、两类 job budget、metadata/SDK/local tools/support/operations binding refs。P0 的“可运行”上限是构造安全 facade 与显式 blocked/unsupported/unknown surface，不保证正向 clone/pull/push-review。 |
| 2. 哪些属于 P1/P2？ | P1 是已预留 code shape 内的真实 binding registration、owner-specific profile、production-like numeric instance 与 Consumer positive registration；须先关闭相应上游合同。P2 是 remote/config-center source、hot reload、daemon schedule、LFS/shallow/GUI/Tauri 等新能力，当前不进入 schema。 |
| 3. 哪些留部署运维？ | config document 的物理路径/挂载/权限、secret provider 实例和注入、实际 environment instance、rotation 操作、schedule、告警阈值、备份恢复与 runbook。 |
| 4. 哪些留实施计划？ | package/bin/parser/library 选择、实际 loader/validator 实现、adapter registry/bootstrap、文件创建、phase/commit boundary、命令/checks 与目标实现仓事实。 |
| 5. 非范围残余风险如何处理？ | 每项进入 Step 14，并在未确认前维持 blocked/unsupported/unknown；不得用 demo、fake、默认值或 profile 名暗示 readiness。 |

## 4. 配置优先级层级定义

| 层级 | 本轮含义 | 当前要求 |
|---|---|---|
| P0 contract | 当前必须完整收稳的 raw schema、source、validation、activation、change、failure 和 downstream contract | 42 个既有 leaf 全覆盖；不允许 schema hole |
| P0 instance | local/CI 可使用的文档候选值与 registered ref 集合 | 只定义 profile 语义和 demo；实例/registry 未创建，不声称可执行 |
| P1 | 在现有 code shape 内接入真实 SDK/source/handoff/metadata/tool/diagnostics/Consumer binding | 受 owner contract 与 adapter implementation 阻塞；启用前逐 capability 复核 |
| P2 | 需要新增 source/lifecycle/runtime surface 的扩展 | 当前 unsupported；必须回退 00～04/03 影响判定 |
| permanently rejected | 任何绕过 truth、安全、幂等、unknown、dirty/provenance/review redline 的开关 | raw 中出现即 whole-candidate reject |

## 5. 设计目标

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| `CFG-SYNC-G01` 唯一配置候选 | 定义一个 strict JSON candidate 与显式 config/profile identity | loader/validator 和 source conflict contract |
| `CFG-SYNC-G02` raw-to-code 闭环 | 42 个 leaf 一对一映射到既有 `ValidatedSyncRuntimeConfig` | raw key registry、类型/required/null/default 表 |
| `CFG-SYNC-G03` 控制面与红线 | 分开 limits、budgets、binding intent、private resolution、capability classification | 禁止配置化清单与 hard-boundary reject |
| `CFG-SYNC-G04` profile/environment | 定义 local/CI/integration-like/production-like 语义但不伪造实例 | 05/06 可使用的环境矩阵 |
| `CFG-SYNC-G05` sensitive ref-only | 普通配置只保存 opaque ref，不保存 token/cert/private key/body/endpoint material | secret resolution/rotation/redaction 输入 |
| `CFG-SYNC-G06` complete-or-reject activation | parse/type/cross-field/redline/binding/capability 后构造新 composition/snapshot | Step 9 加载与 cold activation contract |
| `CFG-SYNC-G07` historical pinning | 新候选不改写旧 operation/plan/candidate/attempt 的 snapshot | change/rollback/migration rules |
| `CFG-SYNC-G08` failure truthfulness | 缺失/非法/不可用/unknown 显式区分，无 silent fallback | Step 11 failure register 与 05 negative cuts |
| `CFG-SYNC-G09` downstream handoff | 给 05/06/07/09 提供唯一配置基线 | case/gate/implementation/operations 输入边界 |

## 6. 当前范围

| 范围 | P0 输出 | 能力上限 |
|---|---|---|
| candidate identity | `configRef/profileRef` raw mapping、变更规则 | 只标识候选/语境，不证明配置正确或系统 ready |
| limits/budgets | positive integer/bytes/ms、relative constraints、sample values | 不把示例变 SLO；不 silent clamp |
| binding refs | metadata/SDK/Git/fs/support/operations 的 opaque refs/nullability | ref 存在不等于 constructor/capability/health/permission |
| sources | schema declaration + exactly one strict JSON candidate + private ref resolution | private resolution 不参加 ordinary precedence、不改配置语义 |
| environment/profile | local-dev、ci-test、integration-like、production-like 分类 | profile 是语义矩阵，不是已部署实例 |
| activation | startup/cold new composition；no hot/reload | old work pin old snapshot；invalid new candidate rejected |
| changes | candidate replacement、ref rotation、numeric change、rollback | 不创建 config admin API/event/ledger |
| failures | config source/parse/type/cross/redline/binding/capability/secret resolution | runtime result仍按 03 known/unknown 层级 |

## 7. 明确非范围

| 非范围 | 留给哪一层 / 文档 | 未确认前姿态 |
|---|---|---|
| 新增/修改 runtime config interface、Port、DTO、error、flow | 回流正式 03 对应 Step | 不进入正式 04 contract |
| 具体 Node/package/bin/parser/validator/test/Git library 与依赖版本 | 正式 07 / 实施前事实核验 | `SYNC-LOCAL-001~005` pending |
| `.qs-sync` 物理 store/schema/migration/encryption/retention 数值 | owner/03 targeted repair + 07 implementation | metadata positive capability blocked |
| SDK endpoint/method/provider DTO/error/version | L0-sdk 与 owner contract | SDK positive capability blocked |
| source authority/comparator/gap/full fallback | Artifact/Workspace/SDK owner | material source blocked；不配优先级 |
| permission/archive action matrix | Work/Governance/Archive owner | owner access fail-closed |
| review handoff/Decision/probe/effect equivalence | Governance/SDK owner | no submit/probe positive claim |
| arbitrary Git command/remote/refspec/merge strategy | 永久边界；需需求/架构变更才可重审 | rejected |
| LFS/shallow/GUI/Tauri/daemon | 当前 P2/historical | unsupported；无 key/开关 |
| config file 物理路径/env selector/CLI flag 名称 | 07/09 与 entry implementation | 本文只规定 one-candidate semantic input |
| 真实 secret material/provider product/rotation command | 09/安全运维 | raw config ref-only |
| test case、AC/EV、phase/commit、artifact/report/readiness | 05/06/07 | not_started；不伪造 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 contract 覆盖既有 42 leaf，positive capability 可以保持 blocked | 否 | 细化现有字段语义 | 不适用 | 无回写 |
| P0 只支持 startup/cold new composition，不承诺 reload/hot | 否 | 采用 03 已保守声明的 lifecycle | 不适用 | 无回写 |
| P1 仅允许现有 binding slots 的真实注册，不新增 slot | 否 | 实例化边界 | 不适用 | 无回写 |
| P2 新 source/hot/admin/event/ledger/LFS/GUI 等必须先回设计 | 否（当前排除） | future change-control rule | future owning 03 Step | 无回写 |

当前 `待回写=0`、`阻塞待确认=0`。

## 9. 回填草稿

未来正式 §2 应说明：本轮 P0 完整定义既有 42 个配置 leaf 的 strict JSON、来源、profile、敏感性、校验、cold activation、变更、回滚和失败语义；P0 成功只代表安全配置候选可被分类和 runtime facade 可诚实暴露能力，不代表所有 route 可用。真实 external/metadata/tool binding 属 P1 且继续受 blocker 约束；remote/hot/daemon/LFS/shallow/GUI 等 P2 不进入当前 schema。

## 10. 待确认与自检

| 检查项 | 结果 / 处置 |
|---|---|
| P0/P1/P2 和 permanently rejected 可判定 | pass |
| 所有非范围有明确归属 | pass |
| 上游 blocker 未被 demo/profile/fake 关闭 | pass_with_blockers |
| 当前结论未新增 03 code shape | pass；待回写=0 |
| 正式 04 未创建；未提前定义 Step 3 配置域结论 | pass |

结论：Step 2 `pass_with_upstream_blockers`；允许进入 Step 3。
