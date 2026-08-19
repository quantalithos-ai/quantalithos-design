# L2-runtime 02 概要 Step 11: 配置影响轮廓

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 11 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 主体框架、Step 5 组成部分 / 接缝、Step 7 接口、Step 8 流程、Step 9 状态、Step 10 异常、`HLC-L2R-021` |
| 目标 | 识别会影响概要结构行为的配置面，明确只能间接受配置影响的部分、禁止配置化红线以及交给 03 / 04 的实现契约方向 |
| 禁止 | 配置项清单、默认值、JSON / YAML、环境变量名、密钥名、完整 `RuntimeConfig` 字段、`ConfigError` 枚举、adapter constructor、部署挂载或热更新实现 |

## 1. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Runtime Entry & Control / admission | 是 | admission profile、read scope、control availability、idempotency policy | 03 定义配置装配 / 校验 / 生效边界；04 定义填写、校验与环境分层 |
| Run & Goal-Plan | 间接受影响 | progress policy、continuation availability、history retention view | 03 定义 policy injection 与版本记录；不允许配置覆盖 local truth owner |
| Context & Memory Mediation | 是 | source precedence、context budget profile、working-window policy、candidate availability | 03 定义 composition policy contract；04 定义 profile、验证和变更追踪 |
| Model Decision / adapter seam | 是（正向 seam pending） | model capability profile、adapter availability profile、logical selection policy | 03 定义 provider-neutral policy 与 adapter boundary；04 只承载外部配置引用，不进入 route / secret truth |
| Action & Delegation / precondition | 是 | action policy profile、scope / budget profile、delegation limits、guard availability | 03 定义 guard 输入与配置生效条件；04 定义可配置 profile，不能打开 fail-open |
| Checkpoint / Recovery / Handoff | 是 | checkpoint policy profile、recovery posture、handoff eligibility policy、continuation availability | 03 定义 policy / transaction seam；04 定义可填参数，commit-unknown 和 unknown fence 不可关闭 |
| External Truth Views | 是 | freshness profile、source precedence、snapshot completeness policy、availability refresh profile | 03 定义 source view / validator contract；04 定义 profile 与更新治理 |
| Safe Runtime Views | 间接受影响 | projection freshness、redaction profile、read degradation policy、rebuild cadence | 03 定义 projection builder / policy seam；04 定义 profile，不允许隐藏 stale / gap |
| Tools / Capability / Governance / Sandbox / Observability external seams | 仅间接 | adapter availability、event enablement、safe material eligibility | 03 只定义 boundary contract；04 不在 Runtime 生成外部 owner 配置或 readiness |
| Operations Jobs | 是 | job enablement、continuation profile、rebuild / reconciliation cadence、concurrency policy | 03 定义 JobConfig / validation / lease contract；04 定义填写方式，不写调度产品细节 |
| Core / Bus / SDK / member / product entry | 间接或 pending | compile / event / downstream integration profile | 03 只回指正式 owner 合同；04 不把下游生命周期写成 Runtime 配置 |

## 2. 仅间接受配置影响的结构

| 结构 | 配置影响方式 | 直接读取限制 |
|---|---|---|
| Domain objects 与 immutable history | 只接受已校验 policy / guard / budget 结果 | 对象不得直接读取原始配置或自行解释 secret / route |
| Safe Runtime Views | 只接受 projection / redaction policy 结果 | view 不获得 domain mutation 或配置写权限 |
| Outbound Events | 只受 event enablement / material eligibility 间接影响 | 事件内容仍由已提交 local truth 决定 |
| External owner truth | 仅以 availability / adapter / ref seam 影响 Runtime | Runtime 不读取或覆盖外部配置源 |
| Child delegation | 由 parent scope / budget policy 间接约束 | child 不能使用配置突破父边界 |

## 3. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Runtime local truth 单一 owner | 配置不能制造第二个 run / outcome / checkpoint owner | 回到 00 / 01 owner boundary 与 02 Step 3 |
| `ActionPreconditionDecision.unknown` / missing -> allowed | 破坏 fail-closed 安全门禁 | 回到上游 Governance / Capability / Tools / Sandbox 合同及 02 Step 3 |
| `ModelDecision` 直接携带 route / secret / quota / cost | 混淆 logical decision 与 provider control | 回到 Model adapter owner 与 01 architecture boundary |
| forbidden body 进入对象、DTO、checkpoint、event、view、handoff | 破坏最小暴露与 owner separation | 回到 00 / 01 data boundary 与 02 Step 3 |
| unknown side effect -> blind retry / success | 可能产生重复副作用或伪造终局 | 回到 02 Step 9 state red lines 与 Tools / Sandbox contract |
| late / duplicate / out-of-order feedback 原地覆盖历史 | 破坏 immutable history 与因果链 | 回到 02 Step 3、Step 8 event flow、03 history contract |
| checkpoint commit-unknown -> stable | 未证明持久化和原子性 | 回到 checkpoint persistence contract、03 transaction design |
| handoff acknowledged / delivered -> RuntimeOutcome success | delivery / observed / acceptance 不是 local truth | 回到 Artifact / Observability / downstream owner boundary |
| projection stale / degraded / gap 隐藏为 current | 破坏只读投影的可解释性 | 回到 Safe Runtime Views state machine 与 03 projection contract |
| 配置引入非 Core sibling compile / package dependency | 违反全局依赖裁剪 | 回到全局依赖关系与裁剪规则、01 Step 7 |
| fake、设计文件、静态目录 -> readiness / evidence / tested | 配置不能伪造实现和资格证据 | 回到 00 / 01 evidence boundary 与后续测试 / 验收文档 |
| 配置直接拥有 member-service / image / marketplace / product lifecycle | 越过 Runtime 与下游产品入口边界 | 回到全局项目依赖与 L0/L1/L2 owner 文档 |

## 4. 配置影响轮廓关系图

```text
Validated configuration profile
  │
  ├─► Entry / Control admission behavior
  ├─► Context composition / working budget
  ├─► Model logical policy / adapter availability seam
  ├─► Action guard / delegation scope
  ├─► Checkpoint / recovery / handoff posture
  ├─► Source freshness / projection degradation
  └─► Operations Job continuation / rebuild / reconciliation

Never configurable through this profile
  ├─► owner identity / local truth ownership
  ├─► fail-closed and unknown-side-effect fences
  ├─► forbidden-body / secret / hidden-reasoning boundary
  ├─► immutable history / transaction consistency
  └─► external delivery / observed / acceptance truth
```

关键说明：
- 图只表达已收稳结构受到配置影响的方向，不表达加载、部署挂载、密钥系统或热更新。
- 配置必须先经 validation / change control，再以 policy / profile 结果影响 domain / application；原始配置不直接进入对象。
- 外部 route、secret、quota、cost 和 readiness 仍归 provider / owner，Runtime 仅消费 availability / adapter seam。

## 5. 交给详细设计与 04 的配置实现契约方向

| 承接方向 | 03 详细设计需明确 | 04 配置设计需明确 |
|---|---|---|
| Runtime profile 装配 | profile value object、validator、版本 / source、注入边界 | 配置来源层级、填写方式和校验反馈 |
| Context / budget policy | composition / omission / freshness policy contract | profile 结构和变更控制 |
| Model adapter availability | provider-neutral policy 与 adapter capability seam | 外部 adapter ref / secret ref 的引用方式，不保存 secret truth |
| Action / delegation guard | precondition input contract、scope / budget validator | guard profile 的可配置部分与 fail-closed default 语义 |
| Checkpoint / recovery / handoff | stable / commit-unknown / manual review policy seam | 可填写的 recovery / handoff posture，不允许关闭 fence |
| Source / projection freshness | freshness、redaction、degradation validator contract | freshness profile、projection profile 与变更审计 |
| Operations Job | JobConfig 概念、enablement / lease / continuation boundary | job profile 的填写与校验，不指定 scheduler 产品 |

本 Step 不选择具体 key、默认值、配置文件格式、环境变量、secret backend、部署目录或动态刷新机制。

## 6. 配置影响停审与审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 配置影响仅回指已收稳的部分 / seam / job | pass | 未新增配置主语或实现模块 |
| domain / state / history / transaction 红线明确禁止配置化 | pass | 配置不能改 owner、迁移红线、immutable history 或 commit semantics |
| external provider / secret / route / quota / cost 边界保持外置 | pass_with_pending_upstream | 仅配置引用 / availability / adapter seam |
| pending 合同与配置激活关系 | pass | 未闭合 seam 只能 candidate / blocked，配置不能伪造 readiness |
| 03 / 04 承接方向 | pass | 已分别列出实现契约与配置说明的后续工作 |

## 7. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 配置影响 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | action / governance / sandbox / tools seam 未闭合 | guard / adapter availability profile | pending / fail-closed |
| `L2R-UP-005` | durable memory owner 未闭合 | source / budget / freshness profile | ref-only / unavailable |
| `L2R-UP-006` | model adapter owner 未闭合 | logical model policy / adapter availability | blocked / no route truth |
| `L2R-UP-007~008` | Core / Bus / Observability schema / readiness 未闭合 | event / projection / safe material profiles | pending / no readiness claim |
| `L2R-CP-001` | checkpoint transaction / commit-unknown 未闭合 | checkpoint / recovery posture | blocked / explicit unknown |

## 8. Step 11 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已输出配置影响轮廓表 | pass |
| 已输出禁止配置化边界表，覆盖 owner、domain invariant、状态机、审计、事务、安全与依赖红线 | pass |
| 已明确 03 详细设计与 04 配置设计承接方向 | pass |
| 未写配置项清单、默认值、JSON / YAML、环境变量、secret 名称或完整配置类型 | pass |
| 配置不能改变 pending / blocked / fail-closed 语义 | pass |

**Step 11 结论：** `done`。允许进入 Step 12 详细设计承接清单；必须先更新文档 flow、项目执行台账并创建 Step 12 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 13。
