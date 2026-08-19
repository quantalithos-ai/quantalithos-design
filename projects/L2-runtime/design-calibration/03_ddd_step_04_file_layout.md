# L2-runtime 03 详细设计 Step 4: 实现单元、crate 与文件布局

> 创建日期: 2026-08-08
> 状态: done
> 当前模式: controlled_reopen
> 回填位置: 正式 `03-详细设计.md` 第 4 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 3 Rust workspace baseline、目录组织规范、`/home/aris/Projects/quantalithos-core` 当前 manifest、`L1-governance` / `L2-tools` Step 4 粒度 |
| 目标 | 让实现 agent 可按 package/crate/module/file/test boundary 建立目标仓结构 |
| 禁止 | 创建实现仓、写 Cargo lock、声明 build/readiness、把业务能力机械拆成 crate |

## 1. Workspace 与 package 规划

目标实现仓规划为 `/home/aris/Projects/quantalithos-runtime`，当前不存在，故下表是 planned boundary，不是实现事实。

| member | Cargo package | library crate | binary | 职责 |
|---|---|---|---|---|
| `crates/contracts` | `runtime-contracts` | `runtime_contracts` | none | public refs、metadata、Command/Query/Event/Job/View/Receipt/Error |
| `crates/domain` | `runtime-domain` | `runtime_domain` | none | local truth、aggregate/entity/value/state/policy/history |
| `crates/application` | `runtime-application` | `runtime_application` | none | service facade、ports、UoW、idempotency、flow mapping |
| `crates/infra` | `runtime-infra` | `runtime_infra` | none | repository/projection/adapter/config/runtime builder/fakes |
| `crates/api` | `runtime-api` | `runtime_api` | `runtime-api` candidate | sync Command/Query handler assembly |
| `crates/worker` | `runtime-worker` | `runtime_worker` | `runtime-worker` candidate | inbound event and continuation worker |
| `crates/jobs` | `runtime-jobs` | `runtime_jobs` | `runtime-*` candidate | projection/recovery/handoff/reconciliation jobs |

`L2` 只存在设计仓路径，不进入 package/crate/type/binary；实际 package versions、dependency versions 和 binary activation 等实现前由 manifest 验证。

## 2. 依赖方向与可见性

```text
core-contracts
      ^
contracts
      ^
domain
      ^
application --defines--> ports / UoW / idempotency
      ^
infra --implements--> application ports
      ^
api / worker / jobs --call--> application facade
```

| crate | 可依赖 | 禁止 |
|---|---|---|
| contracts | `core-contracts`、基础 serialization candidate | domain/application/infra/entry、外部 sibling |
| domain | contracts、core-contracts | async runtime、repository、config、transport、外部 SDK |
| application | contracts、domain、core-contracts | infra concrete、HTTP/DB/bus SDK |
| infra | contracts/domain/application/core-contracts、基础 adapter candidate | api/worker/jobs、改变 domain invariant |
| api | contracts/application/infra/core-contracts | direct repository/domain mutation、worker/jobs |
| worker | contracts/application/infra/core-contracts | api/jobs、绕过 application |
| jobs | contracts/application/infra/core-contracts | api/worker、反写 external acceptance/observed |

## 3. 文件树与职责

实现文件树按以下 planned boundary 展开：

```text
quantalithos-runtime/
  Cargo.toml
  crates/
    contracts/src/{lib.rs,ids_refs.rs,metadata.rs,reasons.rs,commands.rs,queries.rs,events.rs,jobs.rs,views.rs,errors.rs}
    domain/src/{lib.rs,run.rs,goal_plan.rs,history.rs,context.rs,memory.rs,model.rs,action.rs,delegation.rs,checkpoint.rs,recovery.rs,outcome.rs,handoff.rs,source.rs,projection.rs,policies.rs,errors.rs}
    application/src/{lib.rs,facade.rs,operation_context.rs,idempotency.rs,errors.rs}
    application/src/ports/{mod.rs,repositories.rs,external.rs,projection.rs,technical.rs}
    application/src/services/{admission_service.rs,control_service.rs,run_progress_service.rs,context_service.rs,model_service.rs,action_service.rs,delegation_service.rs,feedback_service.rs,recovery_service.rs,outcome_service.rs,handoff_service.rs,query_service.rs,consumer_service.rs,job_service.rs}
    infra/src/{lib.rs,config.rs,runtime_builder.rs,repositories.rs,projection_store.rs,idempotency_store.rs,outbox_store.rs,adapters.rs,publisher.rs,handoff.rs,lease.rs,fakes.rs,errors.rs}
    api/src/{lib.rs,command_handlers.rs,query_handlers.rs,routes.rs,errors.rs,bin/runtime_api.rs}
    worker/src/{lib.rs,consumers.rs,continuation.rs,errors.rs,bin/runtime_worker.rs}
    jobs/src/{lib.rs,runners.rs,rebuild.rs,reconcile.rs,resume.rs,errors.rs,bin/runtime_jobs.rs}
  tests/{contracts,domain,application,integration_seams,state_matrices}
```

| 文件组 | 责任 |
|---|---|
| `contracts/*` | public identity、协议、marker、error/view；不承载 domain invariant |
| `domain/*` | Runtime local truth、状态、不变量与纯规则 |
| `application/services/*`、`ports/*` | use-case 编排、UoW、port trait、错误映射、stored result |
| `infra/*` | port 实现候选；未闭合外部绑定只能 blocked/unavailable |
| `api/*`、`worker/*`、`jobs/*` | 解析/映射/触发，不直接写 truth |

## 4. 业务能力到文件组映射

| 能力 | contracts | domain | application | infra/entry |
|---|---|---|---|---|
| Admission & Control | `commands.rs`, `metadata.rs`, `views.rs` | `run.rs`, `goal_plan.rs` | `admission_service.rs`, `control_service.rs` | api handlers, repositories |
| Run & Goal-Plan | refs/commands/views | run/goal_plan/history | run_progress_service | repositories/projection |
| Context & Memory | commands/events/views | context/memory/source | context_service | external resolver/memory adapter |
| Model Decision | commands/events/reasons | model.rs | model_service | model adapter |
| Action & Delegation | commands/events/receipts | action/delegation/checkpoint | action/delegation/feedback services | Tools/Sandbox adapters |
| Checkpoint & Recovery | commands/jobs/views | checkpoint/recovery/outcome | recovery/outcome services | UoW/checkpoint/lease |
| Handoff & Projection | events/jobs/views | handoff/projection | handoff/query/job services | publisher/projection/handoff |

## 5. Composition root 与入口边界

`infra/runtime_builder.rs` 负责校验 repositories、UoW、technical ports 和 external adapter slots，只有 required slots 通过校验才暴露 application facade；pending owner 生成 blocked adapter。`api`、`worker`、`jobs` 通过 builder 获取 facade，不自行 new domain/repository。目标仓缺失时该 root 只是 planned file，不代表 wiring 已实现。

## 6. Step 4 停审与门禁

| 检查 | 结果 |
|---|---|
| package/crate/binary、模块、文件和测试边界明确 | pass |
| 业务能力与技术模块交叉映射 | pass |
| domain sync、application/infra I/O async 边界可回指 | pass |
| Core-only compile、runtime/event/ref/adapter/fake 依赖分类保持 | pass |
| target repo 不存在未被伪造 | pass |
| 未创建实现代码或 Cargo 文件 | pass |

```text
gate_status = done
next_allowed_action = create_03_ddd_step_05_module_contracts
```
