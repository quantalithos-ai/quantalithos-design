# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 8
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §8

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | config_environment_dependencies |
| next_allowed_action | Step 9 spikes_risks_open_questions |
| implementation_allowed | false |

## 本步输入

正式 `01` 依赖方向、`03` §3/§13、`04` §3~§13、`05` §8/§9、Step 3 阅读矩阵和 Step 5 phase DAG。

## SOP 问题回答

只有已确认的 Core shared contract 才能成为 compile candidate；`L0-sdk` 的准确 target 仍待确认。Identity、Work、Member、Images、Runtime、Sandbox、Governance、Bus、Observability、容器运行时和 registry 都按 runtime/event/ref/adapter/fake seam 处理，不能直接写成 Cargo path dependency。P0 允许 local-dev、ci-test、integration-like、operations-replay 四种 profile，允许 deterministic in-memory、controlled、disabled fake；fake 必须保持 revision、idempotency、unknown、redaction 与 no-repair 语义。真实 provider、durable store、broker、DLQ 和生产部署属于后续 selected-run 或 blocker。

## 当前文档问题诊断

旧材料将 PostgreSQL、k8s、固定 endpoint、心跳阈值和 launch token 细节当成事实；这些没有当前 authority。新方案只固定配置分类、来源、验证与不可用姿态，把具体产品和数值留给 04 / future baseline。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| compile | 可能把 sibling 写成 path dependency | 仅 Core candidate，准确 target pending |
| runtime | 产品名进入 domain | Port + adapter/fake |
| profile | 单一环境假设 | 四个 P0 profile + future selected |
| unavailable | fallback 成功 | blocked/disabled/unknown/fail-fast |

## 设计取舍

- 以 `04-配置设计.md` 的 typed validated binding 为准，07 不重复配置项全集。
- fake 用于语义测试，不作为真实 readiness 或交付证据。
- 上游 contract 未闭合时优先 fail-closed，允许局部 local slice 继续设计/实现。

## 结构化中间产物

### 外部依赖准备表

| 依赖 | 类型 | 使用阶段 | 协作形式 | 当前状态 | 不可用处理 |
|---|---|---|---|---|---|
| `L0-core` / core-contracts | compile candidate | PH-01~08 | 受确认的 shared contract/path | pending exact baseline | 暂停 compile gate |
| `L0-sdk` | compile/test boundary | PH-01、PH-08 | target/self-test seam | pending | 不宣称 ready |
| `L1-identity` | runtime + event + ref | PH-02~04 | safe ref/summary/resolver | pending mapper | reject/wait/stale |
| `L1-work` | runtime + event + ref | PH-02~03 | ProjectMember scope input | pending mapper | non-project fail-closed |
| `L1-governance` | event + ref | PH-02/04 | effective policy summary/transfer seam | owner pending | blocked/unknown |
| `L2-member` | runtime | PH-03/04 | launch/register/heartbeat placeholder | pending | waiting/blocked |
| `L2-member-images` | runtime + ref | PH-02/03 | pinned image ref/manifest | pending | readiness blocked |
| `L2-runtime` | runtime | PH-03/04/07 | session/run ref and outcome placeholder | pending | session/feedback unknown |
| `L4-sandbox` | runtime + ref | PH-02/05 | host binding/release/ref | schema pending | local attempt + gap |
| `L0-bus` | event | PH-07/08 | envelope/publisher/consumer seam | route/receipt pending | outbox pending/unknown |
| container runtime / registry | adapter | PH-03~05 | orchestrator/image adapter | product unselected | disabled/fake/blocked |
| durable store / broker / DLQ | adapter/event | PH-02~08 | Port + controlled fake | product pending | fake-only, no production claim |
| observability backend | adapter/event | all | body-free sink/ref | backend pending | safe marker only |

### P0 profile 与环境矩阵

| Profile | 用途 | 允许依赖 | 不可用处理 | 证据级别 |
|---|---|---|---|---|
| local-dev | 开发与单元纵切 | in-memory、deterministic fake、disabled sibling | 明确 blocked，不 fallback success | candidate |
| ci-test | PR/CI contract/domain/service | fixed fixtures、fake adapters | gate non-zero，保留失败 artifact | candidate |
| integration-like | 受控接缝验证 | controlled resolver/publisher | unavailable/residual | selected future |
| operations-replay | job/outbox/projection/reconcile replay | fixed replay corpus、fake stores | partial/unknown 可解释 | candidate |
| staging-like | 未来 | 需批准的真实依赖 | 未批准不得运行 | future |
| production-like | 未来 | 产品与 SLO authority | 不计 P0 | future |

### 配置与环境检查表

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| target repo | `/home/aris/Projects/quantalithos-member-service` | PH-01 blocked |
| workspace/package naming | 与 03 §4 一致，不含 L0/L1 层级泄漏 | 暂停并回写 |
| config source | defaults < JSON file < env，局部入口隔离 | config-redline fail |
| secrets | 只用 opaque ref，禁止日志/fixture 明文 | redaction blocker |
| artifact/report root | `artifacts/test/<run_id>`、`reports/runs/<run_id>` | 修正路径，不用 latest |
| Core path | 仅在 exact baseline 确认后写 path dependency | 等待 MSVC-UP-007/008 |
| scripts | gates/reports/checks 分离 | 缺失则 PH-01/08 blocked |

### Fake / controlled / disabled 使用边界

| 形态 | 可用于 | 不可用于 |
|---|---|---|
| deterministic in-memory | domain、UoW、replay、negative tests | 真实持久性、生产 readiness |
| controlled resolver/adapter | seam mapping、timeout、unknown、generation mismatch | 外部 truth 证明 |
| disabled adapter | 未闭合 sibling 的 fail-closed 路径 | 把 disabled 当 success |
| fake publisher/store | outbox、receipt、rollback 语义 | Core/Bus delivery、durable SLA |

## 回填草稿

正式 §8 应列依赖分类、P0 profile、配置/环境检查、fake 边界和不可用处理；必须说明本轮不锁具体产品、endpoint、secret、数值或真实 compile target。

## 待确认事项

- Core shared contract 与 SDK target 的准确 baseline。
- durable store、broker、DLQ、observability backend 的 provider/authority。
- Member/Images/Runtime/Sandbox exact mapper、credential owner 与 policy transfer owner。

## 进入下一步条件

配置、profile、依赖类型和 fake/disabled 姿态已明确，允许进入 Step 9 Spike、风险与待确认事项。
