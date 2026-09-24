# Step 14. 正式概要设计文档装配

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 14 / 正式文档装配 |
| 状态 | `completed / formal_stop_review` |
| 当前模块 | `formal_assembly:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 旧正式 02 已删除并按新版 14 章 full-restart 重建；Step 1～13 结论全部落位，术语、章节、接口/对象/流程/状态、blocker 与历史污染审计通过。 |
| next_allowed_action | `enter_03_step_01_under_existing_user_authorization` |
| 正式正文写入 | `completed` |

## 2. 装配纪律

- 旧 `02-概要设计.md` 只作为 `historical_material`；本 Step 不逐段改写或继承其章节、对象、技术、数字和成功语义。
- 正式正文只吸收 Step 1～13 已通过门禁的结论；若装配发现主语、ownership、状态轴或边界冲突，必须回退对应 Step，而不是在正文中临场定论。
- 每章以对应 calibration 产物为校准来源；正式正文只保留稳定结论、必要表格、概要级图和未闭环项。
- 不新增完整 schema、DDL、源码路径、配置 key、测试结果、实现仓、baseline、run_id、artifact、report、evidence、verdict、signoff 或 readiness。

## 3. 章节回填映射

| 正式章节 | 主要校准来源 | 装配结论 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 只写需求/架构稳定前提、本文继续展开层次和 `RUN-UP-001~008` 上限。 |
| §2 本次设计目标与范围 | Step 2 | 写可实现结构骨架、范围/非范围、设计深度与下游交付。 |
| §3 约束条件 | Step 3 | 写 ownership、显式版本、多轴、no-write、保护、证据、SDK-first 与 blocker。 |
| §4 代码主体框架总览 | Step 4 | 保留业务轴/实现轴双图及映射表，不锁目录/语言/部署。 |
| §5 主要组成部分、职责与边界 | Step 5 | 装配六部分总表、对象发现、接缝与非职责。 |
| §6 关键对象轮廓 | Step 6 | 装配 17 个对象的责任/字段/状态/函数/禁止事项；删除资格归 `ProtectionGuard`。 |
| §7 API / 接口骨架 | Step 7 | 装配 Command/Query/Consumer/Job/required port；当前无 outbound event。 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 保留通用骨架与 P0/复杂 Query/Job/Consumer 代表流，强调事务外副作用与 unknown。 |
| §9 状态定义与状态流转 | Step 9 | 保留多轴状态总表、核心迁移/传播和 owner projection 非本地状态机。 |
| §10 异常与边界场景轮廓 | Step 10 | 保留主线改变型异常、crash window、保护、断线和安全降级。 |
| §11 配置影响轮廓 | Step 11 | 保留 direct/indirect 配置影响、禁止配置化边界和 03/04 分工。 |
| §12 详细设计承接清单 | Step 12 | 交付模块/命令/页面/对象/adapter/流程/状态/事务/配置/测试/证据切口及回退规则。 |
| §13 设计风险与待确认事项 | Step 13 | 分开风险与待确认；保留 owner/SDK/仓库/技术/数值/event blocker。 |
| §14 参考 | 本 Step 实际使用材料 | 只列正式需求/架构、指定 owner 正式文档、规范和本仓校准材料。 |

## 4. 术语与编号统一

| 统一术语 | 统一口径 |
|---|---|
| `Runner-owned` | 只指本地选择、世代、取得/验证姿态、意图、观察、保护/恢复和展示组合等本仓真相。 |
| `owner projection` / `safe ref` | 来自 Artifact/Governance/Runtime/Sandbox/Observability/Archive 的带 source/freshness/visibility 的安全投影/引用，不转移 ownership。 |
| `qualified` | 同一 selection/source/digest binding 的材料资格；不等 approved、accepted、running 或 cleanup。 |
| `accepted` | owner 接收请求/意图的姿态；不等 boundary、running、terminal、cleaned 或 released。 |
| `unknown` | 结果不能证明，必须冻结并 query/reconcile；不是失败，也不是成功。 |
| `blocked` / `stale` / `conflict` | blocked=无法继续；stale=依据过时；conflict=expected basis 不一致；均不 fail-open。 |
| `ProtectionGuard` | 汇总 lease/capture/handoff/retention/orphan 的保守释放资格；材料状态不再混入 protected/evictable。 |
| `planned/blocked` | 只描述所需 seam 或未来 Consumer，不表示真实 adapter、event 或集成可用。 |
| `formal evidence/report/verdict/signoff` | 不属于 Runner；本地日志、诊断、receipt、job success 均不升级为正式证据。 |

## 5. 历史冲突扫描结果

| 历史材料候选 | 正式文档处置 |
|---|---|
| 旧五部分、`RunnerRun`、queue/card/retry/replay/kill | 不继承；用六部分与多轴对象/状态重新表达。 |
| Tauri/Electron、Rust、Docker/gVisor/Firecracker | 不锁定；技术选择留 03 重新核验，Sandbox backend 不进入 Runner。 |
| `latest`、默认分支、目录最新文件 | 明确禁止。 |
| `99.9%`、`<200ms`、`<1s`、并发/容量/timeout 等旧数字 | 排除；没有 workload/authority 不写量化结论。 |
| HTTP 200、PID、端口、toast、本地日志、handoff receipt 成功语义 | 正式文档明确为非 owner truth/非 evidence。 |
| draft 十模块、旧 port/API 名 | 仅作遗漏扫描；不改变六部分和已收稳对象/接口。 |

## 6. 装配后门禁

- [x] 旧正式 02 已被移除并重新建立，不存在旧章节残留。
- [x] 正式正文包含 14 章且章节顺序与概要规范一致。
- [x] 每章均有校准来源块，且与 Step 1～13 产物一致。
- [x] 六部分、17 对象、Command/Query/Consumer/Job/required port、关键流、多轴状态和异常/配置/承接/风险均覆盖。
- [x] `RUN-UP-001~008`、技术未决、event readiness 和数值未被装配为已解决事实。
- [x] 只执行文档装配，不实现、不测试、不创建 implementation ledger/boundary skeleton、不提交 commit。

## 7. 装配后状态

```text
current_document = 02-概要设计.md
current_step = 14
current_module = formal_assembly:self_reviewed
gate_status = pass
formal_status = formal_stop_review
next_allowed_action = enter_03_step_01_under_existing_user_authorization
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 8. 装配结果

- 正式正文已按 §1～§14 顺序重建，14 个章节均有 calibration source block。
- 六个主要组成部分、17 个关键对象、11 个 Command、12 个 Query、4 个 planned Consumer、5 个 Job、14 个 required ports 均已覆盖。
- 处理流中的函数调用参数使用 typed skeleton；不存在裸参数或完整实现签名。
- 正式状态模型明确无统一 `RunnerRun.status`，材料 qualification 与 protection/releasability 分轴。
- 旧 queue/card/retry/replay、技术产品、无来源数字和本地日志成功语义未被继承。
- 上游 blocker、真实 repo/技术选择、event readiness、数值与测试/证据状态仍保持未闭环。

结论：`gate_status=pass`。正式 02 进入停审；由于用户已明确授权本会话继续到 03 Step 4，可转入 03 Step 1，不代表跨越 03 内部门禁或实现许可。
