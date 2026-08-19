# L2-runtime 03 详细设计 Step 2: 实现范围与非范围

> 状态: done
> 输入: Step 1 `03_ddd_step_01_upstream_boundary.md`、`02-概要设计.md` 第 4~13 章

## SOP 问题回答

| 问题 | 结论 |
|---|---|
| 本轮实现主线是什么 | Runtime loop 从 trigger admission 到 goal/plan progress、context composition、model decision、action/delegation choice、feedback incorporation、checkpoint/recovery、local outcome、safe handoff attempt 的完整本地契约。 |
| 本轮必须下沉到什么粒度 | 模块职责、逻辑文件、对象字段与不变量、函数签名、port/adapter、DTO/event/job schema、事务/状态/错误/并发/配置/埋点/测试切口。 |
| 哪些能力只能消费 | Tools action contract、capability identity/exposure、method/role/process definition、governance approval/policy、sandbox isolation/capture/cleanup、observability observed truth、artifact/evidence/ref、provider-neutral adapter seam、durable memory owner。 |
| 哪些只能 candidate / blocked | Tools/Sandbox receipt and feedback、model adapter positive route、durable write、Runtime-specific event schema、checkpoint physical commit、observed/accepted handoff。 |

## 实现范围表

| 范围 | 03 交付 |
|---|---|
| Entry & Control | trigger admission、control、resume intent、safe query 的应用编排和安全映射。 |
| Run & Goal-Plan | controlled run、goal-plan working state、progress decision、immutable history。 |
| Context & Memory | source resolution、composition decision、working context/memory、candidate/use record。 |
| Model Decision | provider-neutral intent/turn/decision/disposition、安全摘要和 semantic result 分类。 |
| Action & Delegation | action choice、precondition decision、child boundary、feedback record/incorporation。 |
| Checkpoint/Recovery/Handoff | stable checkpoint candidate、commit-unknown fence、recovery decision、local outcome、attempt/gap。 |
| External/Safe Views | source ref/snapshot/availability、body-free projection、safe runtime/handoff view。 |
| Cross-cutting | metadata、correlation、idempotency、version、UoW port、error surface、observability seam、minimal tests。 |

## 非范围表

| 非范围 | 真相 owner / 下游 |
|---|---|
| 工具执行、工具审计、capability registry/adapter descriptor | `L2-tools`、`L3-capability-hub` |
| method/role/process body 与 source | `L3-method-library` |
| approval、Decision、Policy effective、control truth | `L1-governance` |
| sandbox environment/run/capture/failure/cleanup/isolation | `L4-sandbox` |
| observed/audit backend、retention、observation truth | `L4-observability` |
| Artifact/Evidence/report 正文、lineage、verdict | `L1-artifact` |
| provider secret、route、quota、cost、billing、physical failover | model/provider owner |
| durable memory body/index/retention/deletion/accepted write | durable memory owner pending |
| member-service container/image lifecycle、marketplace、产品入口/UI | 下游 member/product owner |
| 具体语言、框架、数据库、序列化、transport、部署产品 | `L2R-LANG-001` 未选择 |

## 设计深度与停审

本轮详细设计允许写完整实现契约，但不把 pending seam 写成正向实现，也不写测试结果、artifact、report、evidence alias、验收 verdict、签署或 readiness。Step 2 已完成；按用户的连续授权进入 Step 3，仍不装配正式文档。

```text
gate_status = done
next_allowed_action = create_03_ddd_step_03_constraints
formal_03_write_allowed = false
```
