# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节：`04-配置设计.md` §6 环境、部署 profile 与配置矩阵
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_06_environment_profiles_matrix.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 6：定义环境、部署 profile 与配置矩阵 |
| 输入 | Step 3 控制面、Step 4 分类边界、Step 5 来源优先级、`03 §13` / Step 14 的 logical slots |
| 输出 | profile 定义、环境配置矩阵、依赖与敏感性差异、测试 / 验收承接、停审与跨 profile 审计 |
| 当前状态 | 已完成；允许进入 Step 7 |
| P0 profile | `local-dev`、`ci-test`、`integration-like`、`operations-replay` |
| P1/P2 profile | `staging-like`（P1 方向）、`production-like`（P1/P2 方向）；当前不声明已部署或 ready |
| 关键限制 | fake、in-memory、blocked seam 只能表示测试 / 保守装配姿态，不能作为真实集成、外部健康、交付或 readiness 证据 |

## 2. 本步目标与执行边界

本 Step 将配置来源和控制面映射到环境 / profile，使未来 `05-测试方案.md` 可以选择测试组合，`06-验收标准.md` 可以定义配置门禁，`07-实施计划.md` 可以安排绑定与迁移顺序。

本 Step 只定义 profile 的语义、允许的 adapter posture、敏感配置处理和环境差异；不定义容器拓扑、真实 endpoint、数据库 / broker / scheduler 产品、部署命令、容量或 SLO 数值。任何“production-like”名称均表示设计目标形态，不表示当前环境存在。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| local / CI / staging / prod 是否适用？ | P0 先定义 `local-dev`、`ci-test`、`integration-like`、`operations-replay`；`staging-like` 和 `production-like` 仅作为待 owner contract / product authority 后的 P1/P2 profile。 |
| 每个环境配置来源是什么？ | 依照 Step 5：普通配置为 code defaults → strict JSON file → allowlisted env；secret 只通过 opaque ref + 受控 provider；fixture 仅 test-only。 |
| 每个环境依赖哪些外部服务？ | P0 不要求真实外部服务：external slots 可为 deterministic fake、blocked 或 unavailable。integration-like 只允许在正式合同可引用时接入 real-like adapter；当前仍以 blocked seam 记录。 |
| 敏感配置如何处理？ | P0 不放 raw secret；local / CI 使用 test-only fixture 或受控 ref stub，且不进入日志；integration / staging / production-like 必须由 owner 指定 secret provider，未指定则 fail-fast / blocked。 |
| 哪些差异影响测试和验收？ | profile 决定 fake / blocked / real-like posture、determinism、外部依赖可用性声明和允许的 test cut；不能改变领域不变量、协议、状态或成功语义。 |
| profile 能否切换执行主语或启用 24 candidate？ | 不能。所有 profile 只支持 project-scoped `ProjectMemberRef + GlobalMemberRef`；24 candidate 在 `L2M-UP-005` 前仍 zero configuration。 |

## 4. profile 分层规则

1. profile 是装配姿态，不是第二套业务规则；所有 profile 共享同一份 contracts、state、UoW/CAS、typed replay、Query no-write 和 redaction 不变量。
2. `local-dev` 与 `ci-test` 可以使用 deterministic fake / in-memory local slot，但必须在 profile metadata 中显式标注 `test_or_local_only`。
3. `integration-like` 只表达“允许接入已核验的 real-like seam”；本仓当前不因该 profile 存在而宣称任何 Runtime、host、Bus、image 或 downstream 成功。
4. `operations-replay` 面向已提交 local carrier、attempt / gap、receipt / report 的重放和诊断，不得重新执行未知副作用，也不得把 replay 变成 mutation。
5. `staging-like`、`production-like` 需等 owner contract、产品选择、secret provider、部署 / 运维材料和 05/06/07 门禁闭合后才可激活；profile 名称本身不是 readiness。

## 5. 环境 / profile 配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 / adapter posture | 敏感配置处理 | 差异说明与当前状态 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发、契约探索、局部 UI / API 手工调用 | code defaults + 项目 JSON；可使用显式 local env selector | local Store / UoW / technical deterministic fake；未闭合 owner seam 为 blocked / unavailable | 不允许 raw secret；仅 test ref / local stub，禁止提交仓库 | P0；可验证 local flow，不证明 integration 或 production |
| `ci-test` | 自动化 contract / domain / application / seam 测试 | code defaults + checked-in test JSON + CI allowlisted env | deterministic in-memory Store、fixed Clock / ID、fake resolver / handoff；Core contract 缺失时相应 cut blocked | fixture / ephemeral ref；日志、artifact、report 不含 secret | P0；必须可重复；不把 fake parity 写成外部证据 |
| `integration-like` | 在 owner 合同存在时进行边界联调 | code defaults + environment JSON + allowlisted env + controlled secret ref | 可逐项启用 real-like owner adapter；未闭合的 `L2M-UP-*` slot 保持 blocked | secret provider required；ref 与 provider audit planned | P0 语义 / P1 激活；当前不声明任何正向联调完成 |
| `operations-replay` | 诊断、replay、gap / report / receipt 对账准备 | code defaults + operations JSON；job-run-start metadata | 只读已提交 carrier / marker；外部 handoff 默认 blocked，禁止未知副作用重放 | 只读受控 ref；不得把 replay 输入保存为 raw secret | P0；不执行 Query write，不修复 core truth |
| `staging-like` | 未来发布前的接近真实组合验证 | 继承 Step 5 普通来源 + owner-approved secret provider | 需 image / host / Runtime / Bus / Store / observation 合同全部可引用；未满足则 blocked | 真实 secret provider，禁止明文 / 日志输出 | P1 方向；当前未激活、无 readiness 结论 |
| `production-like` | 未来正式运行形态的配置审查与变更演练 | 受控 JSON / env + secret provider；需变更审计 | 需要所有必需 physical adapter 与 owner handoff 合同；配置只能影响 composition / posture | 强制 secret provider、轮换、审计和最小权限 | P1/P2 方向；当前未激活、无容量 / SLO / 健康结论 |

## 6. profile 与控制面的映射

| 控制面 / 配置域 | `local-dev` | `ci-test` | `integration-like` | `operations-replay` | `staging-like` / `production-like` |
|---|---|---|---|---|---|
| composition / provenance | local profile、redacted provenance | fixed test profile、可重复 fingerprint | owner-approved profile | replay profile、禁止 mutation override | 受审计的发布 profile |
| local consistency stores | in-memory / deterministic | in-memory / deterministic | real-like 或明确 unavailable | committed local stores / read-only replay | durable product 待 authority |
| technical identity | deterministic Clock / ID / digest | fixed Clock / ID / digest | owner-approved runtime adapter | fixed values用于 replay correlation | production-grade adapter 待 authority |
| command / query boundary | 小规模安全默认 | 边界组合覆盖 | 与 owner 合同一致的 bounded values | read / replay limits | 变更需审计，数值不在本 Step 锁定 |
| Consumer / projection | fake / blocked；可观察 stale | fake / blocked 组合测试 | 逐 source 合同激活 | 只读 receipt / projection / gap | real source 与 watermark 待 authority |
| jobs | deterministic single-run posture | deterministic runner / fake scheduler | owner-approved runner | replay / reconcile dry-run posture | scheduler / capacity 待 07 / 运维 |
| resolvers / handoff | fake 或 blocked | fake + negative cases | contract-gated real-like | 默认 blocked、只读 marker | owner provider / endpoint 待确认 |
| registry | logical registry only | logical registry assertions | logical registry + external handoff gate | replay registry | host / process assembly 留运维材料 |
| diagnostics / redaction | 强制 redaction | 强制 redaction + negative tests | 强制 redaction + provider audit | 安全诊断字段 | backend / dashboard 留 09 |
| publication candidate | zero configuration | blocked boundary test | 仍 blocked，除非 `L2M-UP-005` 关闭并重审 | 只读 blocked marker | 不得由 profile 预开 |

## 7. profile 继承与覆盖规则

#### 配置来源链图：L2-member profile 继承与隔离

```text
[profile selector]
        |
        v
[profile-local code defaults]
        -> [profile JSON]
        -> [allowlisted env selector / bounded scalar / opaque ref]
        -> [controlled secret provider lookup]
        |
        v
[validated profile snapshot]
        |
        +--> [startup composition]
        +--> [job-run-start snapshot]
        +--> [entry-local typed boundary]

[test fixture source] --(test builder only)--> [ci-test / local-dev test assembly]
```

关键说明：

- profile 之间不共享 raw config；只可共享经过校验的结构性默认和不变量。
- `production-like` 不继承 `ci-test` fixture；`integration-like` 不因 profile 名称而绕过 blocked seam。
- job-run-start / entry-local 是局部快照，不覆盖 startup composition，也不覆盖其他 invocation。
- profile 差异不能改变 `ProjectMemberRef + GlobalMemberRef`、owner、状态、Query no-write 或 event candidate blocked 状态。

## 8. profile 使用与测试 / 验收承接

| profile | 05 测试输入 | 06 验收门禁输入 | 07 实施 / 09 运维承接 |
|---|---|---|---|
| `local-dev` | local composition、配置负例、fake parity、safe diagnostics | 只验 local contract，不验 external readiness | local JSON 示例和本地挂载说明留 09 |
| `ci-test` | deterministic replay、missing / conflict / redaction、blocked seam | 可重复配置校验门禁；不产出 external evidence | test fixture 绑定顺序留 07 |
| `integration-like` | 每个已闭合 owner seam 的正 / 负边界测试 | 需要 owner-specific evidence；当前均为 planned / blocked | endpoint / credential / runner 操作留 09 |
| `operations-replay` | no-side-effect replay、gap / report / receipt 对账 | 只验 replay safety，不验 scheduler readiness | replay 运行命令和权限留 09 |
| `staging-like` | future cross-component matrix | future release gate | 发布、secret、回滚由 07 / 09 定义 |
| `production-like` | future change / failover / drift matrix | future critical configuration gates | 变更审批、挂载、轮换、告警由 07 / 09 定义 |

## 9. 当前文档问题诊断

| 材料 | 问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05/06` | 以固定端口、DB / broker、CI result 和 P95 数字描述环境 | 全部降为 historical pollution；不形成当前 profile 事实 |
| README | 把本地启动方式、transport 和 supervisord 当成 profile | 只保留“需要环境差异矩阵”的方向，不继承产品 / 命令 |
| Step 5 | 来源优先级已定，但缺少 profile 级来源隔离 | 明确 profile-local JSON、allowlisted env、secret provider、test-only fixture 边界 |
| external blocker | integration-like 容易被误读为联调完成 | 加入 owner contract gate 和 blocked / waiting / not-ready 语义 |
| 正式 `04` | 尚不存在 | 只生成 §6 回填草稿 |

## 10. profile 停审记录

| profile | 来源是否可判定 | 依赖姿态是否可判定 | 敏感配置边界 | 是否能产生 readiness | 结论 |
|---|---|---|---|---|---|
| `local-dev` | 是 | local / fake / blocked | raw secret 禁止 | 否 | 通过 |
| `ci-test` | 是 | deterministic fake / blocked | fixture only | 否 | 通过 |
| `integration-like` | 是 | 逐 owner contract gate | provider required | 否 | 通过（当前 blocked-aware） |
| `operations-replay` | 是 | committed carrier / read-only | controlled ref | 否 | 通过 |
| `staging-like` | 条件成立 | 需全部 owner / product authority | provider required | 否（future） | 通过（未激活） |
| `production-like` | 条件成立 | 需 durable / deployment authority | provider + rotation | 否（future） | 通过（未激活） |

## 11. 跨 profile 审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| profile 是否改变领域不变量 | 通过 | 所有 profile 共用双锚、owner、state、UoW/CAS、replay、no-write 和 redaction 红线 |
| test fake 是否被生产继承 | 通过 | test fixture 仅 test builder；production-like 明确禁止继承 |
| integration-like 是否伪造真实联调 | 通过 | 只有 owner contract 与 real-like adapter 可引用时才可讨论激活；当前保持 blocked |
| operations-replay 是否产生副作用 | 通过 | 只读已提交 carrier / marker；unknown 不重放、Query 不写 |
| 敏感配置是否按 profile 隔离 | 通过 | P0 不放 raw secret；future profiles 必须 provider + audit |
| profile 是否预开 24 candidate | 通过 | 所有 profile 的 publication candidate 维持 zero configuration |
| 是否锁定部署产品 / 容量 / SLO | 通过 | 本 Step 不锁定；留 07 / 09 / 技术 authority |
| 是否影响 03 代码契约 | 未发现 | 只定义 profile 语义与矩阵，无新 carrier / constructor / Port |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| P0 profile 采用 local-dev、ci-test、integration-like、operations-replay | 否 | 环境 / 装配语义细化 | `03 §13` 已有 profile ref | 无回写 |
| staging-like / production-like 仅作为 future profile，不宣称已激活 | 否 | P1/P2 范围约束 | `03 §13` / Step 14 已有 unavailable posture | 无回写 |
| test fixture 与生产 profile 隔离 | 否 | 承接 fake / blocked seam 边界 | `03` §13、Step 14 已有 | 无回写 |
| profile 不改变双锚、状态、Query no-write、24 candidate blocked | 否 | 既有不变量复核 | `03 §3、§8～§13` 已有 | 无回写 |
| 未来引入 profile-specific builder 参数、real adapter constructor 或 external success flag | 是 | 代码契约 / owner 语义变化 | `03 §4～§13` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项；未来触发器不构成 profile 激活事实。

## 13. 回填草稿：正式 `04-配置设计.md` §6

> 校准来源：
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“环境 / profile 配置矩阵”“profile 与控制面的映射”“profile 继承与覆盖规则”“profile 停审记录”和“跨 profile 审计表”。

正式 §6 应收口为：

1. P0 采用 `local-dev`、`ci-test`、`integration-like`、`operations-replay`；`staging-like` 和 `production-like` 仅为待授权的 future profile。
2. 每个 profile 均遵循 Step 5 的来源优先级；test fixture 只在 test builder 使用，不能继承到 production-like。
3. P0 可使用 deterministic fake、in-memory Store 或 blocked seam，但这些姿态不代表真实集成、外部健康、delivery、observation 或 readiness。
4. 敏感材料不进入普通配置或日志；future profiles 必须使用受控 secret provider，未闭合 owner contract 时保持 fail-fast / blocked。
5. profile 不改变双锚、truth owner、状态、事务 / CAS、typed replay、Query no-write、Unknown fence 或 `L2M-UP-005` 下 24 candidate 的 zero-configuration 状态。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| host / Runtime / image / Bus / source owner 合同（`L2M-UP-001~005`） | integration-like、staging-like、production-like 的 adapter posture | 对应 slot 保持 blocked / waiting；不声明联调或 readiness |
| secret provider 与 credential owner（`L2M-UP-006`） | future profile 的 sensitive handling | 只使用 opaque ref；provider 不可用 fail-fast / blocked |
| policy taxonomy（`L2M-UP-007`） | consumer / resolver profile 激活 | 只消费 safe result；unknown 保守阻断 |
| execution subject scope（`L2M-UP-008`） | profile subject selector | 仅 project-scoped 双锚，其他 scope fail closed |
| durable Store / scheduler / observability product | future profile 具体来源和差异 | 保持 product-neutral，留 07 / 09 / authority |
| workload / capacity / SLO 数值 | 生产 profile 的参数边界 | 无 workload authority 不设数字目标 |

## 15. 进入 Step 7 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| local / CI / integration-like / operations-replay profile 已定义 | 通过 | §5 |
| future staging / production profile 明确为未激活方向 | 通过 | §5、§10 |
| 配置来源、外部依赖、敏感处理和差异可交给 05 / 06 / 07 / 09 | 通过 | §8 |
| fake / blocked / local Ready 未被当真实 readiness | 通过 | §4、§5、§11 |
| profile 不改变不变量或 24 candidate 状态 | 通过 | §4、§11 |
| profile 停审和跨 profile 审计完成 | 通过 | §10、§11 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 6 完成。下一步允许创建 `04_config_step_07_config_items.md`，按功能模块逐项收敛名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别和失败策略，并提供严格 JSON demo。

```text
step_06 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_07_config_items
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
