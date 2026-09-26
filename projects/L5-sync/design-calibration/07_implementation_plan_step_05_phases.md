# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填目标：正式 `07-实施计划.md` §5

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 5 / phases_and_dependency_order |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 6；逐 boundary 定义任务、批次、门禁和提交边界 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 对象族与交付物 | `07_implementation_plan_step_04_deliverables.md` | completed / stop_review |
| 模块依赖与文件布局 | `03-详细设计.md` §4～§6 | formal / stop_review |
| flow/state/UoW/幂等 | `03-详细设计.md` §8～§12 | formal / stop_review |
| 测试/验收层级 | `05-测试方案.md`、`06-验收标准.md` | formal / stop_review |
| blocker map | 00～06、project ledger | active |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小可验证纵切是什么？ | 先建立 shared contract/config/composition，再完成 explicit selection→local operation→binding/metadata→status/materialization→recovery→handoff→CLI/ops 的行为链。 | 03 §2/§4/§16 |
| 为什么不是按 feature 目录一次写完？ | 每个功能需要跨 domain/application/port/test/evidence；纵切才能在阶段末验证状态、UoW 和红线。 | 07 规范 §3.1/§5.5 |
| 哪些阶段必须先行？ | runtime/toolchain and shared contract 先于 feature；selection/access 和 metadata 先于 materialization；recovery 先于 handoff；query/CLI/ops 依赖核心 local facts。 | 03 依赖矩阵、04 builder 顺序 |
| 哪些阶段可并行？ | 当前仓内部不并行；即使未来团队并行，也必须由 boundary gate 和同一 baseline 协调。 | 用户单 agent/serial 约束 |
| 每阶段完成能验证什么？ | 各阶段均绑定 local contract、negative test、TC/AC/VETO 映射和固定证据根；外部 positive unavailable 只可 blocked/waiting。 | 05 §9、06 §7/§10 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 外部能力很多且未闭合 | 若把外部 integration 放在末尾，会形成不可审查大阶段 | 各阶段提前定义 adapter seam 和 blocked gate |
| Query/CLI/Jobs 横跨多个 CP | 单独按入口实现会重复或绕过状态 | Query/CLI/operations 作为后置消费层，依赖已提交 local facts |
| evidence/report 需贯穿全程 | 若只在最后补报告，无法追溯 boundary | PH-01 建脚本契约，PH-08 完成最终 report/handoff |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阶段数量 | 未定义 | 8 个 PH，16 个 boundary | 覆盖从 bootstrap 到 handoff 的完整链路 |
| 主轴 | 文件/对象树 | 可验证功能增量和依赖 | 符合 SOP |
| 阶段状态 | 无 | 未来均 planned，当前移交 blocked/waiting | 不伪造实现结果 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 5 阶段粗粒度（基础/域/接口/测试/交付） | 文档短 | boundary 太粗，状态/恢复/证据风险混在一起 | 拒绝 |
| 逐对象 29 阶段 | 细 | 不可形成纵切，提交噪声大 | 拒绝 |
| 8 个行为阶段、16 个可独立验证 boundary | 依赖和回退点清楚，能映射 05/06 | 计划较长 | 采用 |

## 结构化中间产物

#### 阶段依赖图: L5-sync 实施阶段顺序

```text
[PH-01 foundation and composition]
  | enables
  v
[PH-02 selection/access and metadata]
  | depends_on
  v
[PH-03 inspection and materialization]
  | depends_on
  v
[PH-04 conflict/recovery and consistency]
  | depends_on
  v
[PH-05 review handoff and provenance]
  | depends_on
  v
[PH-06 query and CLI surfaces]
  | depends_on
  v
[PH-07 consumers, jobs and operations]
  | depends_on
  v
[PH-08 gates, reports and acceptance handoff]
```

关键说明：
- 图表达阶段依赖顺序，不表达函数调用链或外部系统内部流程。
- 每个阶段的 boundary 必须先满足前一阶段的 design/scope gate；当前不授权并行实现。
- PH-08 只能汇总真实固定 run 的证据，不能把计划标识写成执行结果。

### 阶段总表

| 阶段编号 | 阶段名称 | 可验证实施目标 | 依赖阶段 | 核心 boundary | 阶段门禁 |
|---|---|---|---|---|---|
| `PH-01` | Foundation and composition | 建立 TypeScript package、shared carrier/error、config/capability/UoW/idempotency seams 和脚本契约 | none | `commit-01-a/b` | `GATE-01`、`GATE-02` |
| `PH-02` | Selection/access and metadata | explicit selection/access 与 logical binding/manifest/cursor/mapping 生命周期 | PH-01 | `commit-02-a/b` | `GATE-03`、`GATE-04` |
| `PH-03` | Inspection and materialization | read-only status/inspection 与 clone/pull safe plan/apply/finalize | PH-02 | `commit-03-a/b` | `GATE-05`、`GATE-06` |
| `PH-04` | Conflict/recovery and consistency | conflict fact、checkpoint、manual resolution、probe、unknown/idempotency/recovery | PH-03 | `commit-04-a/b` | `GATE-07`、`GATE-08` |
| `PH-05` | Review handoff and provenance | candidate freeze、attempt-before-call、transport/probe/Decision layers、append/protect provenance | PH-04 | `commit-05-a/b` | `GATE-09`、`GATE-10` |
| `PH-06` | Query and CLI surfaces | 13 Query zero-write、diagnostic read graph、clone/pull/status/push-review safe presentation | PH-05 | `commit-06-a/b` | `GATE-11`、`GATE-12` |
| `PH-07` | Consumers, jobs and operations | 3 Consumer、3 Job bounded local operation、receipt/replay、redaction/observability seam | PH-06 | `commit-07-a/b` | `GATE-13`、`GATE-14` |
| `PH-08` | Gates, reports and acceptance handoff | 全量 gate/report/evidence index、VETO/risk handoff 和 03/05/06/07 闭环审计 | PH-07 | `commit-08-a/b` | `GATE-15`、`GATE-16` |

### 阶段可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| PH-01 | 可装配的 shared runtime graph 和测试/报告脚本 contract | 03 §3/§4/§7、04 §7/§9 | package tree、typed seams、config negative、script interface plan | 真实 owner/Git/fs、真实 run | unit/contract/static gate |
| PH-02 | explicit selection 到 logical binding/metadata 的 local facts | 03 CP1/CP2、04 metadata | operation/binding/generation/cursor/mapping/provenance relations | physical `.qs-sync` driver、owner positive | domain/UoW/negative cuts |
| PH-03 | status/inspection 和 safe materialization local flow | PH-02 facts、source/Git/fs ports | plan/path/run/checkpoint candidates | auto merge/rebase/push/stash、unknown apply | flow/fault/path/dirty cuts |
| PH-04 | conflict/recovery 可解释闭环 | PH-03 run outcomes | conflict/resolution/probe/state/idempotency carriers | blind replay、fake-to-known promotion | state/consistency/idempotency cuts |
| PH-05 | Review handoff layering 和 provenance protection | PH-04 stable candidate basis | candidate/attempt/layered status/provenance | Gate/Decision creation or acceptance truth | protocol/handoff/redaction cuts |
| PH-06 | public read/entry surface | PH-02～05 committed facts | 13 Query、CLI presentation and safe dispositions | package/bin choice if local blocker unresolved | query-zero-write/entry negative cuts |
| PH-07 | bounded operations | prior local facts and event/job contracts | receipts, item results, conservative invalidation, diagnostics | private topic/scheduler assumptions、truth repair | consumer/job/replay/redaction cuts |
| PH-08 | repeatable delivery evidence path | all prior boundary outputs | fixed-run artifacts/reports/handoff templates and audit results | actual verdict/readiness without real review | G0～G7/AC/VETO audit |

### Phase 停审记录

| Phase | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否是可验证增量、是否前置工具链与 shared contract | pass (plan) | package/toolchain blocker remains |
| PH-02 | 是否依赖 PH-01、是否保持 local truth | pass (plan) | physical metadata/owner access blocked |
| PH-03 | 是否避免危险 Git/source action | pass (plan) | comparator/Git/fs contract blocked |
| PH-04 | 是否单独隔离高风险 recovery/idempotency | pass (plan) | formal probe and persistence blocker |
| PH-05 | 是否保持 transport/Decision/provenance 分层 | pass (plan) | Governance contract blocked |
| PH-06 | 是否 Query zero-write、CLI 不拥有 truth | pass (plan) | parser/bin/runtime choices pending |
| PH-07 | 是否 Consumer/Job bounded、无 repair | pass (plan) | source/topic/scheduler pending |
| PH-08 | 是否只消费真实 fixed run、保留 evidence ceiling | pass (plan) | no real run/evidence now |

### 跨 phase 依赖闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 依赖顺序 | pass (plan) | serial only; no boundary may skip predecessor |
| 状态/UoW 依赖 | pass (design) | PH-03 onward requires PH-02 logical facts; physical persistence remains blocked |
| external adapter timing | pass (plan) | adapters introduced as typed seams before positive integration |
| test/evidence coverage | pass (plan) | each phase has GATE and future artifact/report root |
| phase boundary 越界 | pass (plan) | future objects/results must remain forbidden in earlier boundary |
| blocker propagation | pass (plan) | `SYNC-UP-*`/`SYNC-LOCAL-*` carried to affected phases |

## 回填草稿

正式 §5 将回填阶段依赖图、阶段总表、每个 phase 的可验证增量说明和跨 phase 审计；阶段编号固定为 PH-01～PH-08，boundary 编号固定为 commit-01-a～commit-08-b。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| PH-01 package/toolchain choice | 全部后续 boundary | `commit-01-a` 开工前 |
| PH-02 physical metadata owner | metadata positive boundary | `commit-02-b` 开工前 |
| PH-03 source comparator/Git/fs support | materialization positive boundary | `commit-03-b` 开工前 |
| PH-05 Governance handoff contract | review positive boundary | `commit-05-b` 开工前 |
| PH-08 evidence/report schema | final handoff | `commit-08-a` 开工前 |

## 进入下一步条件

- [x] 阶段依赖图和阶段总表完成。
- [x] 每个 phase 有功能增量、输入、输出、不包含和验证方式。
- [x] 每个 phase 已停审，跨 phase 依赖无未解释冲突。
