# L2-runtime 00 需求 Step 12: 接口与依赖

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 12 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 6 依赖裁剪、Step 9 功能、Step 11 数据归属 |
| 接口粒度 | 能力级输入 / 输出 / 失败 / 依赖类型 |
| 禁止 | API path、DTO schema、字段清单、event topic、port / repository 名称 |

## 1. Step 内计划

| 模块 | 状态 | 接口范围 | gate_status |
|---|---|---|---|
| C1 entry / run | done_stop_review | `IF-L2R-001~003` | pass |
| C2 context / memory | done_stop_review | `IF-L2R-004~006` | pass |
| C3 model | done_stop_review | `IF-L2R-007~008` | pass |
| C4 action / delegation | done_stop_review | `IF-L2R-009~011` | pass |
| C5 checkpoint / handoff | done_stop_review | `IF-L2R-012~015` | pass |
| cross-node audit | done | 类型与功能映射一致 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Runtime 对外提供什么能力? | run 受理 / 控制、当前状态 / safe summary 查询、resume / recovery 请求、Runtime outcome / handoff material。 |
| Runtime 消费什么输入? | goal / plan / method / governance / tool / capability / artifact / identity refs / safe snapshots、model adapter、memory adapter、Sandbox seam。 |
| 同步 / 异步怎么分? | 受理 / 决策 / query 是同步能力边界;事件 / outcome handoff / late feedback / maintenance 是异步或事件协作;具体协议后移。 |
| 是否形成 package 依赖? | 只有 Core shared contract;所有其他边界按 Step 6 分类。 |

## 3. 对外能力接口表

| ID | 能力接口 | 类型 | 输入语境 | 输出语境 | 失败 / 边界 | 功能 |
|---|---|---|---|---|---|---|
| `IF-L2R-001` | Runtime run 受理 | 同步 runtime entry | actor / scope、goal / plan refs、运行约束 | accepted run / rejected / waiting | invalid、unauthorized、source missing、conflict | FR-001 |
| `IF-L2R-002` | Run control | 同步 runtime entry | run ref、pause / cancel / resume / recovery intent | control accepted / blocked / unknown | wrong state、missing stable point、policy pending | FR-004/018 |
| `IF-L2R-003` | Run status / safe summary query | 同步 query | run ref、read scope、cursor / freshness语境 | status、goal / plan progress、safe decision summary | hidden、stale、degraded、not found 不得混为 success | FR-004/012/020 |
| `IF-L2R-004` | Context source resolution | 同步 runtime service seam | typed external ref、scope、purpose、time | safe snapshot / ref、gap、stale、forbidden | owner mismatch、body、scope unknown、unavailable | FR-005 |
| `IF-L2R-005` | Context composition | 同步 runtime service seam | goal / plan、source set、working memory、budget | composed context、precedence / omission / degradation decision | conflict、budget、missing source、unsafe material | FR-006/007 |
| `IF-L2R-006` | Memory mediation | 同步 / async adapter seam | retrieval / candidate request、run / scope、purpose | result refs / candidates / unavailable | durable owner unavailable、stale、forbidden body | FR-007/008 |
| `IF-L2R-007` | Model turn adapter | 同步 runtime adapter | provider-neutral intent、context、turn correlation | semantic result / refusal / timeout / unknown | adapter mismatch、unavailable、raw body forbidden | FR-009~011 |
| `IF-L2R-008` | Model decision summary | event / query safe material | selection / disposition / source category | body-free decision summary / gap | secret、hidden reasoning、provider raw body prohibited | FR-012 |
| `IF-L2R-009` | Tool action orchestration | 同步 runtime -> Tools runtime seam | canonical action context、Tool ref、Governance / Sandbox preconditions | invocation submitted / no-execution / normalized outcome ref | Tools contract missing、authorization unknown、Sandbox required unavailable | FR-013~015 |
| `IF-L2R-010` | Sub-agent delegation | 同步 / async runtime internal seam | parent run、child goal、scope / budget、context boundary | child accepted / progress / result / failure / unknown | scope leak、budget、child unavailable、side effect unknown | FR-016 |
| `IF-L2R-011` | Action feedback incorporation | async runtime input | Tools / model / child / Sandbox result ref、correlation | incorporated / waiting / conflict / new decision | late、duplicate、source mismatch、unknown | FR-011/014/016/019 |
| `IF-L2R-012` | Checkpoint write | synchronous local truth boundary | stable run context、decision、action markers、next position | checkpoint accepted / rejected / commit unknown | forbidden body、version conflict、atomicity unknown | FR-017 |
| `IF-L2R-013` | Resume / recovery | synchronous runtime entry | run / checkpoint ref、recovery intent、external outcome refs | resumed / waiting / blocked / failed | invalid point、unknown side effect、late feedback | FR-018/019 |
| `IF-L2R-014` | Runtime outcome handoff | event / runtime adapter | committed outcome、safe summary、purpose / target ref | local submission attempt / gap / external feedback ref | route / source / receipt pending;不声明 delivered / observed | FR-020 |
| `IF-L2R-015` | Runtime event collaboration | event collaboration | committed Runtime fact snapshot、correlation / schema authority | Bus publication / consumer input / local marker | delivery failure / duplicate / observed unavailable | FR-020 |

## 4. 外部依赖边界表

| 关联方 | 依赖类型 | Runtime 消费内容 | 正向资格条件 | 未满足处理 |
|---|---|---|---|---|
| `L0-core` | compile | shared contracts / metadata / error / trace / envelope | 上游类型可检索、导出、唯一 authority | 相关字段 / schema pending,不得本地复制。 |
| `L2-tools` | runtime + adapter | canonical invocation / normalized outcome / tool audit ref | Tools contract、mapping、failure seam 闭合 | no-execution / blocked;不直连工具执行。 |
| `L3-capability-hub` | runtime + ref | capability identity / exposure / adapter summary | formal descriptor / controlled consumer seam | candidate unavailable / blocked。 |
| `L3-method-library` | runtime + ref | method / role / process definition summary | version / source / scope 可解析 | stale / missing / waiting。 |
| `L1-governance` | runtime + event | Decision / Policy effective / approval summary | authority / validity / scope 可验证 | fail closed;不自我批准。 |
| `L4-sandbox` | runtime + adapter | isolation run / capture / failure / handoff refs | generic mapping / receipt / feedback / cleanup seam | sandbox-required action blocked;无 host fallback。 |
| `L4-observability` | event + ref | body-free observation / audit safe material | producer / source / route / readiness 闭合 | local attempt / gap;不声明 observed。 |
| `L1-artifact` | runtime + ref | goal / plan / output / evidence refs | artifact owner / lineage / safe summary 可解析 | 运行 waiting / degraded;不保存正文。 |
| model provider | runtime adapter | provider-neutral turn outcome | owner / adapter / secret boundary / route 可验证 | model unavailable;不 fallback 猜测。 |
| durable memory owner | runtime ref + adapter | retrieval / candidate / durable handoff | body-free contract / source / stale / write feedback 可验证 | retrieval degraded / candidate pending。 |

## 5. 类型与依赖映射

| 接口族 | 全局 / seam 类型 | 说明 |
|---|---|---|
| IF-001~003 | runtime entry / query | Runtime 自有能力面,不是 SDK / product implementation。 |
| IF-004~006 | runtime service / ref / adapter | context 与 memory 外部 truth 不迁移。 |
| IF-007~008 | adapter / event | model provider 只通过中立语义进入。 |
| IF-009~011 | runtime + Tools / Sandbox / child adapter | action choice、outcome、execution truth 分层。 |
| IF-012~013 | local truth / runtime entry | checkpoint / recovery 归 Runtime。 |
| IF-014~015 | event / adapter / ref | handoff / delivery / observed / acceptance 分层。 |

## 6. 接口与功能映射

| 功能 | 接口 | 依赖类型 |
|---|---|---|
| FR-001~004 | IF-001~003;IF-012~013 | local runtime + Core compile + event/ref inputs |
| FR-005~008 | IF-004~006 | runtime/ref/adapter |
| FR-009~012 | IF-007~008 | runtime/adapter/event |
| FR-013~016 | IF-009~011 | runtime/adapter/ref/event |
| FR-017~020 | IF-012~015 | local truth/event/adapter/ref |

## 7. 当前文档诊断与取舍

旧 Runtime 直接写 IPC、SDK、Tools、Sandbox、Observability、Process、Artifact 和具体 RPC / MQ schema,并把 member / SDK 当上游。当前只保留能力级接口与依赖类型;API、DTO、event schema、port、mapping、source family 和 fake parity 后移 01~03 / 05。

## 8. 回填草稿

正式第 12 章采用 `IF-L2R-001~015` 与外部依赖边界表。Runtime 对外提供 run 控制、查询、恢复和安全 handoff;对内消费正式 refs / snapshots / adapters。只有 Core 可进入编译期依赖,其余关系保持 runtime / event / ref / adapter / fake seam。

## 9. 待确认事项

- Tools-Sandbox positive mapping、Governance authorization source、Observability producer / route、Core Runtime schema、model adapter 和 durable memory contract 仍 pending。
- 接口能力仍可作为需求验收对象;未闭口 seam 不得生成正向 readiness 结论。

## 10. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每个接口有功能来源 | pass |
| 接口未泄漏 API / DTO / port | pass |
| 依赖类型与 Step 6 一致 | pass |
| positive seam 未被伪造 | pass |

```text
gate_status = pass
next_allowed_action = create_step_13_non_functional_requirements
formal_document_write_allowed = false
```
