# Step 2. 明确测试目标、范围和非范围

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 2 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。测试目标和范围以新版 `03-详细设计.md` 的 P0 可落码契约、`04-配置设计.md` 的配置测试交接和 `03_ddd_step_16_test_cuts.md` 的最小验证清单为输入。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1 输入边界 | 限定测试方案职责 | 不重新定义设计,只定义验证方式 |
| `03-详细设计.md` §15 | 最小验证清单 | 必须覆盖 7 模块、13 Command、11 Query、7 inbound event、10 outbound event、7 job、16 状态机 |
| `04-配置设计.md` §12 | 配置测试交接 | 配置加载、profile、validation、redaction、fake / configured adapter、topic map 必须进入范围 |
| `03_ddd_step_12_error_recovery.md` / `03_ddd_step_13_concurrency_idempotency.md` | 错误、幂等和恢复 | duplicate replay、idempotency conflict、result missing、commit unknown、rollback failure 等为 P0 |
| `03_ddd_step_15_observability_audit.md` | 观测和审计 | forbidden body、low cardinality、audit refs、script redaction 为 P0 |

---

## 3. SOP 问题回答

1. P0 必须通过哪些测试才能证明主链成立?

   回答:P0 必须通过 contracts / domain / service / infra / api / worker / jobs 的最小门禁,覆盖 13 Command、11 Query、7 inbound event、10 outbound event、7 operations job、16 状态机、事务一致性、幂等 replay、config validation、redaction 和 report generation。

2. P1/P2 是否只做边界验证或延后?

   回答:P1 durable store、real event bus、real source resolver、real handoff endpoint、search backend、production-like profile 只做接口 / fake 兼容和风险记录,不要求完整真实环境通过。P2 remote config、admin override、advanced dashboard 和 production runbook 不进入本轮测试范围。

3. 哪些下游能力只测接缝,不测对方完整实现?

   回答:method-library、work、identity、governance、artifact、runtime、conversation、observability、archive 等 sibling / external 系统只测 ref、marker、resolver / publisher / handoff port 和 event payload 边界,不测对方内部 truth 或正文。

4. 哪些非范围有残余风险?

   回答:真实 production DB / MQ / KMS / endpoint、真实 sibling adapter 联调、remote config、全量性能压测、完整发布 runbook 和人工运营流程不在本轮;风险进入 Step 14 残余风险。

5. 哪些范围项是一票否决相关?

   回答:字段 / DTO / 状态闭环、P0 command success / duplicate / conflict、Query no-write、illegal transition、outbox consistency、forbidden body / raw secret、configured adapter 不 fallback fake、invalid config fail-fast、report evidence 可追溯属于一票否决候选。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 范围过窄,只覆盖旧模板 / 实例 / checkpoint 主线 | 新范围按协议、状态、事务、配置、观测和脚本展开 |
| `03` §15 | 只给最小验证入口,未定义完整测试范围优先级 | 本 Step 加入 P0/P1/P2 和非范围 |
| `04` §12 | 给出配置测试交接,未展开进入范围表 | 本 Step 把配置场景纳入 P0 / P1 范围 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| P0 范围 | Template / Profile / ProcessInstance 主线 | 模块、协议、状态机、事务、幂等、配置、观测、脚本全链路 |
| 跨仓测试 | 概念性接缝 | event / resolver / publisher / handoff port 负向和证据测试 |
| 配置测试 | 环境矩阵粗略描述 | defaults、JSON、env、profile、secret ref、topic map、fake / configured adapter、drift warning |
| 非功能 | 固定旧 P95 阈值 | 使用设计风险和通过条件,不制造未来源阈值 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| P0 范围 | 以详细设计可落码闭环为准,不只测业务 happy path |
| P1 范围 | 验证 adapter / port / config 接缝和 failure injection,真实外部系统联调后移 |
| 性能阈值 | 当前不继承旧版数值阈值;只保留 nonfunctional 测试方法和通过条件,具体阈值需来源于 `06` 或实施阶段 |
| 验收编号 | 暂不发明 AC 编号;证据 ID 保持可被后续 `06` 引用 |

---

## 7. 结构化中间产物

### 7.1 测试目标

| 目标 | 验证方式 |
|---|---|
| 证明 Process truth center 契约成立 | domain / service / repository / event / job 测试覆盖 truth、trace、outbox、projection 和 no-write 边界 |
| 证明 public protocol 可稳定实现 | contracts roundtrip、handler validation、protocol error mapping 和 fixture 测试 |
| 证明状态机和非法转换闭环 | 16 组状态机合法 / 非法转换测试 |
| 证明事务、一致性、幂等和恢复闭环 | fake UoW、operation result store、dedup、rollback、commit unknown、partial failure 测试 |
| 证明配置可启动且不可绕过红线 | config loader / validator / runtime builder / redaction / dependency scan 测试 |
| 证明证据可审计并可交给验收 | gate artifacts、reports、evidence index、redaction check 测试 |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| 7 个 workspace module | 模块 | P0 | 验证 contracts、domain、application、infra、api、worker、jobs 的职责和依赖方向 | 不测生产部署拓扑 |
| 13 个 Command | 协议 / 写流 | P0 | success、reject、duplicate replay、idempotency conflict、repository conflict | 不补未定义 command |
| 11 个 Query | 协议 / 读流 | P0 | hit、missing、not visible、degraded、no-write | 不在 query 中修复 projection 或外部 snapshot |
| 7 个 inbound event | 事件消费 | P0 | accepted、duplicate、quarantine、delayed、noop 和 no external body | 不测上游系统内部行为 |
| 10 个 outbound event | 发布协议 | P0 | outbox truth mapping、payload refs、publish failure marker、forbidden body absent | 不要求真实 broker P0 |
| 7 个 operations job | 运维任务 | P0 | validation、duplicate receipt、partial failure、no auto repair、report | 不把 job 当业务 command |
| 16 组状态机 | 状态 | P0 | legal / illegal transition、terminal guard、derived-only guard | 不发明额外状态 |
| 事务 / 一致性 | 横切 | P0 | UoW ordering、rollback、outbox consistency、operation result save-before-complete | 不验证具体数据库产品调优 |
| 幂等 / 并发 | 横切 | P0 | same key same digest replay、same key different digest conflict、namespace isolation、commit unknown | 不实现分布式锁产品专项 |
| 错误恢复 | 横切 | P0 | result missing、source unavailable、digest mismatch、permanent publisher / handoff failure | 不写自动修复 truth |
| 配置加载与校验 | 配置 | P0 | defaults、JSON、env、duplicate key、bad duration、topic missing、invalid profile fail-fast | 不写 production secret 值 |
| 安全与 redaction | 安全 / 观测 | P0 | raw secret、raw body、archive package body 不进入 logs / artifacts / reports | 不审计真实外部系统内部日志 |
| report / evidence scripts | 脚本 / 证据 | P0 | gate、report、redaction checker 输入输出和失败语义 | 不生成实际验收结论 |
| durable store / real broker | 外部依赖 | P1 | 验证 adapter contract、config binding 和 failure injection | 完整 production 联调后移 |
| real sibling adapter | 跨仓接缝 | P1 | resolver / event / handoff 的 ref-only 契约 | 不测 sibling truth 内部 |
| remote config / admin override | 配置演进 | P2 | 仅记录演进风险 | 不进入 P0 测试 |
| full production runbook | 运维 | P2 | 由部署与运维手册承接 | 不在 05 中定义值班流程 |

---

## 8. 回填草稿

`05-测试方案.md` §2 应写明本轮测试目标是验证 `L1-process` 的 Process truth、protocol、state machine、transaction、idempotency、configuration、observability 和 evidence closure,而非只验证旧版模板 / 实例主线。范围表必须把 P0 / P1 / P2 和非范围分开,并说明 P1/P2 只做接缝或后续演进。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP02-OPEN-001 | 性能专项的正式量化阈值尚无新版 `06` 来源 | Step 10 只定义方法和通过条件,不继承旧版阈值 |
| TP02-OPEN-002 | 真实 durable store / broker / sibling adapter 是否进入 release gate | 当前列为 P1,由后续 `07` 和环境能力决定 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0/P1/P2 范围已收稳 | 通过 |
| 非范围和风险归属已说明 | 通过 |
| 一票否决候选范围已识别 | 通过 |

