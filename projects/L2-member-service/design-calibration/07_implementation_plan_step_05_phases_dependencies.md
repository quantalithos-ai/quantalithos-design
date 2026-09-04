# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 本步状态：`completed / pass_with_upstream_blockers`
> 回填目标：正式 `07-实施计划.md` §5

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | phases_dependencies |
| next_allowed_action | Step 6 tasks/commit boundaries |
| implementation_allowed | false |

## 本步输入

Step 4 交付物、03 模块依赖图和函数流、05 suite 分层、06 AC/VF 门禁、上游 blocker 与 fake / adapter 限制。

## SOP 问题回答

最小可验证增量不是单个对象，而是从 typed contract 经过 domain、application、Port/fake 到 entry/test 的纵切。基础骨架必须先于业务 truth；control/qualification 先于 host/session；health/recovery 依赖 host/session；closure/reconciliation 依赖前述 lifecycle；material/projection/query 依赖已提交 truth；consumer/publisher/jobs 依赖 material/outbox；evidence/release 依赖所有 P0 suite。八个 phase 线性推进，PH-11 风格的跨域维护不提前并行；实现期只能激活一个 boundary。

## 当前文档问题诊断

旧材料按组件或技术栈拆阶段，容易让 query、job、event 提前触碰尚未提交的 truth。新方案以功能增量为轴，显式禁止后续 phase 的对象、结果和证据向前泄漏。

## 改动前后对比

| 方面 | 旧风险 | 本步收口 |
|---|---|---|
| 顺序 | 基础设施与业务混写 | Foundation → control → host → health → closure → material/query → consumer/jobs → evidence |
| 依赖 | 运行期 sibling 被假定 ready | seam 先占位，正向 blocker 不解除 |
| 验证 | 最后统一验证 | 每 phase 有 gate、每 boundary 有 gate |

## 设计取舍

- 采用八阶段而非按 7 模块横向实施，以保持可验证纵切。
- PH-06 将 material、projection、query 放在 consumer/jobs 前，避免消费未固定的 outbox。
- PH-08 只做证据和 handoff 壳，不把报告生成提前伪装成通过。

## 结构化中间产物

### 阶段依赖图：L2-member-service 实施阶段顺序

```text
[PH-01 Foundation]
  | enables
  v
[PH-02 Control / Qualification]
  | depends_on
  v
[PH-03 Host / Registration / Session]
  | depends_on
  v
[PH-04 Health / Recovery]
  | depends_on
  v
[PH-05 Closure / Reconciliation]
  | depends_on
  v
[PH-06 Material / Projection / Query]
  | depends_on
  v
[PH-07 Consumer / Publisher / Jobs]
  | depends_on
  v
[PH-08 Evidence / Release Handoff]
```

关键说明：
- 图表达 phase 的依赖与 gate 顺序，不表达具体调用栈或部署拓扑。
- sibling、容器、消息和观测产品仍是外部 seam，不由图推导 ready。
- 每个 phase 完成后必须停审，才能激活下一个 phase。

### 阶段总表

| Phase | 名称 | 可验证功能增量 | 依赖 | 核心门禁 |
|---|---|---|---|---|
| PH-01 | Foundation | workspace、contracts、config/builder、Port/fake、脚本与证据路径壳 | none；目标仓是 blocker | `GATE-MS-01~03` |
| PH-02 | Control / Qualification | intent、decision、qualification、assembly、readiness 与 local UoW | PH-01 | `GATE-MS-04~06` |
| PH-03 | Host / Registration / Session | host/generation/action、registration、endpoint、session shell | PH-02 | `GATE-MS-07~09` |
| PH-04 | Health / Recovery | signal、assessment、failure、recovery decision 与编排 | PH-03 | `GATE-MS-10~12` |
| PH-05 | Closure / Reconciliation | closure、cleanup、residual/case、bounded maintenance | PH-04 | `GATE-MS-13~15` |
| PH-06 | Material / Projection / Query | immutable material/history/outbox/handoff、projection、6 Query | PH-05 | `GATE-MS-16~18` |
| PH-07 | Consumer / Publisher / Jobs | 5 Consumer、publisher feedback、7 Job entry | PH-06 | `GATE-MS-19~21` |
| PH-08 | Evidence / Release Handoff | fixture、gate/check、report/evidence、release smoke/handoff | PH-07 | `GATE-MS-22~24` |

### Phase 可验证增量说明

| Phase | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|
| PH-01 | 03 §3~§4、04 §3~§9、05 §9/§13 | 可检查的 workspace/config/script 壳 | 业务 transition、真实产品 | naming/dependency/config dry-run |
| PH-02 | typed refs、local store/fake | intent→decision→readiness local slice | registration、health、query | contract/domain/service flow |
| PH-03 | accepted control + generation | host/registration/session shell | Runtime run truth、health evaluation | generation/session tests |
| PH-04 | current host/session + signal | health/failure/recovery local decisions | Runtime checkpoint recovery | state/error/recovery tests |
| PH-05 | committed lifecycle records | closure/cleanup/residual/case | external cleanup completion | cleanup/reconcile replay |
| PH-06 | committed local change | material/outbox/projection/query read surface | Core/Bus delivery confirmation | material/query/no-write |
| PH-07 | immutable outbox/markers | consumer receipt、publisher、7 jobs | 新授权、new effect key | consumer/job/replay |
| PH-08 | all prior suite artifacts | generated report/evidence/handoff shell | actual verdict/signoff | release/report audit |

### Phase 停审记录

| Phase | 可验证增量 | 后续依赖泄漏 | 门禁可执行性 | 结论 |
|---|---|---|---|---|
| PH-01~PH-08 | 各自有独立输出 | 未发现；外部正向均 placeholder/blocked | 每阶段 3 个 boundary gate 已定义 | completed / pass_with_upstream_blockers |

### 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 修正 |
|---|---|---|
| 依赖顺序 | pass-designed | 线性 01→08 |
| 后续对象前移 | pass-designed | query/job/evidence 不前移 |
| 外部依赖 | blocked by sibling exact contracts | typed seam / fake / fail-closed |
| 证据归属 | pass-designed | raw/report 只在对应 suite/run 产生 |
| phase 可回退 | pass-designed | boundary 独立 review / rollback |

## 回填草稿

正式 §5 应使用上述 phase DAG、阶段表、可验证增量说明和停审规则；不应把阶段写成对象或文件清单，也不应把并行兄弟项目的未停审内容当成 phase 前置完成。

## 待确认事项

- 目标仓创建时间和 PH-01 实际 activation。
- Core/Bus exact route 与 receipt 是否在 PH-07 前闭合。
- 真实报告工具与 acceptance reviewer 是否在 PH-08 指定。

## 进入下一步条件

八个 phase 的功能增量、依赖、排除项和停审规则均已固定，允许进入 Step 6 任务、批次与提交边界。
