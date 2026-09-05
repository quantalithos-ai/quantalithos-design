# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节：`04-配置设计.md` §12 测试、验收、实施与运维承接
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 12：定义测试、验收、实施与运维承接 |
| 输入 | Step 6 profile、Step 7 配置项、Step 8 secret、Step 9 生效、Step 11 失效策略 |
| 输出 | 05 / 06 / 07 / 09 承接表、边界图、planned gate 输入、文档去重审计 |
| 当前状态 | 已完成；允许进入 Step 13 |
| 承接性质 | 只提供 planned inputs / gates；不生成测试结果、验收 verdict、实现 commit、run_id、artifact、report、evidence 或 readiness |
| 持续 blocker | 上游 exact contract、physical product 和 24 candidate blocker 继续开放 |

## 2. 本步目标与执行边界

本 Step 明确新版 `04-配置设计.md` 如何被后续测试方案、验收标准、实施计划和部署与运维手册使用，防止下游重复定义配置契约或把历史材料重新当作事实。

本 Step 不创建 `05/06/07/09` 正式文档，不写测试用例或命令，不生成 implementation ledger，不填写真实环境 / endpoint / secret，也不作验收或发布判断。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 哪些配置场景进入测试方案？ | profile 组合、缺失 / 非法 / 冲突配置、cross-field validation、redaction、fixture isolation、fake parity、Store / UoW / replay unavailable、projection stale、Consumer duplicate、Job unknown / conflict no-retry、blocked seam 和 publication zero-config。 |
| 哪些门禁进入验收标准？ | required mutation lane 不得 partial Ready；双锚 / owner / body-free / no-write / replay / CAS / Unknown fence 不得被配置绕过；敏感配置不得泄露；24 candidate 必须 zero configuration；external readiness 不得由 local config 声明。 |
| 哪些准备进入实施计划？ | loader / validator / builder、logical slot、deterministic fake、profile binding、secret ref adapter、redaction、变更审计、migration / rollback 的 planned phase 和 commit gate。实施计划不得伪造实现完成。 |
| 哪些细节留给运维手册？ | JSON 文件挂载、env 注入、secret provider 操作、证书 / 凭据轮换、真实 endpoint / route、重启 / 发布 / 回滚命令、告警阈值、dashboard、值班和故障处置。 |
| 下游不能重复定义什么？ | 不得重新命名 key、改变来源优先级、修改默认 / 敏感级别 / 生效方式、引入 publisher / route、改变 owner / state / truth 或把 fake / local Ready 解释为 external readiness。 |
| blocker 如何交给下游？ | 通过稳定 blocker ID、影响范围和保守处理：`L2M-UP-*` / `L2M-DDD-*` 继续 pending / blocked / waiting；下游只能把它作为 planned negative case 或 gate，不得用测试通过替代 owner contract。 |

## 4. 下游承接关系图

#### 证据流图：L2-member 配置设计到下游文档的承接

```text
[04 configuration contract]
        |
        +--> [05 test plan]
        |       +--> profile / negative cases / redaction / fake parity
        |       +--> blocked seam / no-write / replay cuts
        |
        +--> [06 acceptance standard]
        |       +--> required config gates / forbidden bypass
        |       +--> evidence requirements (future, not generated here)
        |
        +--> [07 implementation plan]
        |       +--> planned loader / builder / binding phases
        |       +--> implementation ledger / boundary skeleton (future)
        |
        +--> [09 deployment & operations]
                +--> mounts / provider / rotation / commands / alerts
                +--> rollback / drift / on-call procedures
```

关键说明：

- `04` 是配置语义真相源；下游只承接，不反向改写。
- 图中的 evidence / ledger / commands 只是未来文档的 planned output，不代表已经存在。
- `05/06/07/09` 必须继续保留 external blocker 和 non-positive semantics。

## 5. 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 | 下游不得做什么 |
|---|---|---|---|
| `05-测试方案.md` | profile matrix、配置负例、required / optional slot、redaction、fake / blocked parity、load / validation、drift、no-write / no-retry | Step 6～11 的 profile、item、failure、safe output 和 blocker ID | 不把测试通过写成 integration / readiness；不新增配置契约 |
| `06-验收标准.md` | P0 configuration gates、forbidden bypass、一票否决、sensitive leakage、zero publication config、local Ready 语义 | Step 4、7、8、9、11 的红线和门禁输入 | 不写验收结果、signoff 或 evidence；不提高未授权数值目标 |
| `07-实施计划.md` | loader / builder / slot / fake / profile / secret / audit / rollback 的 planned phase、commit gate、implementation ledger skeleton | Step 3～11 的绑定与生效 / failure 顺序 | 不伪造实现、commit、run_id、test report、artifact、evidence 或 readiness |
| `09-部署与运维手册.md` | 实际文件 / env 挂载、secret provider、rotation、发布 / restart / rollback、drift、告警 / 值班 | Step 5、6、8、10、11 的来源、profile、敏感和失效语义 | 不改变 key / priority / invariant；不把部署命令写回 04 |
| `L2-member-service` / sibling | 仅 owner contract 输入、credential / release / handoff pending | blocker 和 opaque ref posture | 不修改 sibling，不在本仓定义其 schema |

## 6. 05 测试承接矩阵（planned）

| 配置切口 | 预期验证对象 | 负例 / 安全断言 | 当前状态 |
|---|---|---|---|
| profile source merge | default < JSON < env | 高优先级非法不回退 | planned |
| schema / cross-field | validator / builder | unknown key、duplicate key、owner mismatch、fixture contamination 拒绝 | planned |
| mutation prerequisites | Store / UoW / replay / technical slots | missing carrier 不 reserve / no mutation | planned |
| Query boundary | page / freshness / surface | stale / not-ready 仍 no-write | planned |
| Consumer | source / dedup / receipt | duplicate exact replay、forbidden body、unknown blocked | planned |
| Jobs | invocation snapshot / retry | Unknown / conflict 不盲重试 | planned |
| sensitive / redaction | logs / errors / audit / report | raw secret、full ref、endpoint、body 不出现 | planned |
| external seam | blocked / waiting / unknown / gap | fake / local Ready 不升级外部成功 | planned |
| publication blocker | empty `publication_blocked` | 非空配置直接 reject；无 publisher / outbox / route | planned |

## 7. 06 验收承接矩阵（planned gates）

| 门禁类别 | 通过条件（未来由 06 裁决） | 一票否决方向 |
|---|---|---|
| configuration isolation | raw config 只在 infra；模块只接 validated refs / Port | domain / contracts / api / worker / jobs 读取 raw config |
| local mutation safety | required Store / UoW / idempotency / result / technical slots 缺失即 no-write | partial Ready、fake success、回退非法高优先级值 |
| invariant protection | 双锚、owner、body-free、state、CAS、typed replay、Query no-write、Unknown fence 保持 | 任何配置绕过或 profile 分支放宽 |
| sensitive handling | raw secret 不入普通配置、日志、错误、审计、trace、metric、report | secret 泄露或 redaction 可被关闭 |
| external semantics | blocked / waiting / unknown / stale / gap 语义保留 | local attempt / Enabled / Ready 被写成 accepted / delivered / observed / healthy |
| outbound candidate | 24 candidate zero configuration until `L2M-UP-005` closes | event / publisher / outbox / topic / route / retry / DLQ / receipt 被预建 |

## 8. 07 实施承接矩阵（planned only）

| Planned phase 主题 | 04 输入 | 前置 gate | 禁止伪造的内容 |
|---|---|---|---|
| config loader / validator skeleton | §3、§5、§9 | profile / source authority | 实现完成、测试结果 |
| local Store / technical binding | §6、§7、§9、§11 | logical contract、03 code cut | durable product / persistence evidence |
| safe external slots | §7、§8、§11 | owner contract / credential ref | host / Runtime / Bus / image readiness |
| profile / fixture assembly | §6、§7 | test-only boundary | production fake parity |
| change / audit / rollback | §10、§11 | approved snapshot / rollback ref | actual rollout / rollback record |
| planned boundary skeleton | all applicable sections | formal 07 gate | fabricated implementation ledger / commit / run_id |

## 9. 09 运维承接矩阵

| 运维主题 | 04 提供 | 09 继续定义 |
|---|---|---|
| 配置文件与环境变量 | key、来源优先级、profile、redaction 语义 | 实际挂载、权限、注入命令和文件生命周期 |
| secret provider | opaque ref、criticality、rotation boundary | provider 选型、权限申请、轮换步骤、应急撤销 |
| profile 发布 | local / CI / integration-like / future profiles | 实例拓扑、版本 / 制品、发布顺序和健康检查 |
| 变更 / 回滚 | review、audit、prior verified snapshot | 变更窗口、执行命令、回滚操作、沟通与复盘 |
| failure / drift | fail-fast、blocked、stale、gap、redacted issue | 告警阈值、dashboard、值班升级和止血步骤 |

## 10. 文档去重与真相源审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 05 是否会重写配置项 | 不允许 | 只引用 04 key / class / failure；新增需求先回开 04 / 03 |
| 06 是否会把 planned gate 写成结果 | 不允许 | 只定义裁决条件；结果须来自真实证据 |
| 07 是否会伪造 implementation ledger | 不允许 | 未来按实施规范创建 planned skeleton，状态只能 planned / blocked / waiting |
| 09 是否把部署命令塞回 04 | 不允许 | 命令、挂载、provider 操作留 09 |
| 旧 05/06 是否反向定义当前 profile | 不允许 | 历史材料只做污染审计 |
| sibling / upstream 是否被本仓 shadow | 不允许 | 只记录 blocker / ref / owner direction |
| 是否产生 03 回写缺口 | 未发现 | 当前仅做下游映射，无新 carrier / Port / error / flow |

## 11. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 05 / 06 / 07 / 09 只承接 04，不反向定义配置契约 | 否 | 文档边界 | 不适用 | 无回写 |
| planned test / acceptance / implementation / operations inputs 不构成执行事实 | 否 | 事实等级边界 | `03 §16/§17` 已有 | 无回写 |
| downstream 继续保留 blocker / non-positive semantics | 否 | external boundary 复核 | `03 §13/§17` 已有 | 无回写 |
| 未来下游要求新的 config carrier、registry API、evidence / report flow | 是 | 代码 / 证据契约变化 | `03 §4～§17` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前没有实际“待回写”或“阻塞待确认”项。

## 12. 回填草稿：正式 `04-配置设计.md` §12

> 校准来源：
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“下游承接表”“05 测试承接矩阵”“06 验收承接矩阵”“07 实施承接矩阵”“09 运维承接矩阵”和“文档去重与真相源审计”。

正式 §12 应收口为：

1. `05-测试方案.md` 承接 profile、配置负例、redaction、fake / blocked parity、no-write、replay、drift 和 publication zero-config 场景；它不产出配置事实或 readiness。
2. `06-验收标准.md` 承接 required configuration gates、forbidden bypass、sensitive leakage、local Ready 语义和 24 candidate zero-config 门禁；验收结果只能来自真实证据。
3. `07-实施计划.md` 承接 loader、builder、logical slot、fake、profile、secret、audit、rollback 的 planned phase 与 implementation ledger skeleton；不得伪造实现、commit、run_id、report、artifact、evidence 或 signoff。
4. `09-部署与运维手册.md` 承接实际挂载、env / provider 操作、凭据轮换、发布 / restart / rollback、告警、值班和故障处置；不改写 04 的 key、优先级或不变量。
5. 所有下游继续保留 `L2M-UP-*`、`L2M-DDD-*`、`scope_supersede_gap` 和 `L2M-UP-005` 的 blocked / waiting / fail-closed 语义。

## 13. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 新版 05 / 06 / 07 / 09 尚未重建 | 具体测试、验收、实施和运维字段 | 只提供 planned handoff，不创建下游事实 |
| `07` implementation ledger / boundary skeleton 规则 | 未来实施台账结构 | 等正式 07，状态只能 planned / blocked / waiting |
| owner exact contracts | integration-like / acceptance gates | negative / blocked cases only |
| evidence / report backend | 测试与验收归档 | 由 05 / 06 / 09 定义，不在 04 伪造 |

## 14. 进入 Step 13 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 05 / 06 / 07 / 09 承接内容明确 | 通过 | §5、§6、§7、§9 |
| 下游不得反向定义配置契约 | 通过 | §10 |
| planned 与事实等级分离 | 通过 | §2、§8、§10 |
| blocker 可传递且不被测试 / fake 伪关闭 | 通过 | §5、§10 |
| 运维命令、挂载和 provider 操作留在 09 | 通过 | §9 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §11 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 12 完成。下一步允许创建 `04_config_step_13_migration_deprecation_evolution.md`，收口首版配置迁移、废弃、兼容窗口和未来演进规则。

```text
step_12 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_13_migration_deprecation_evolution
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
