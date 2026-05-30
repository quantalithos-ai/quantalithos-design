# L0-bus 07 实施计划 Step 2: 实施目标、范围和非范围

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 2 中间产物。
> 本步把 `00~06` 中已经确认的需求、详细设计、测试和验收门禁转换为本轮实施目标、实施范围和非范围。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确实施目标、范围和非范围 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §2 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承 `00~06` 齐全、目标实现仓待创建、core contracts 已存在的结论 |
| `00-需求文档.md` §9 / §10 / §14 | 已完成 | 提取 F-001~F-008、P0 / P0-min、业务规则和一票否决方向 |
| `03-详细设计.md` §2 / §3 / §4 / §16 | 已完成 | 提取详细设计目标、P0 展开范围、非范围、目标仓、workspace、crate 和实施承接清单 |
| `04-配置设计.md` | 已完成 | 提取 JSON 配置、profile、secret ref、runtime graph、fail-fast / fail-closed / reload rejected 的实施范围 |
| `05-测试方案.md` §6 / §9 / §11~§14 | 已完成 | 提取本轮必须可验证的测试用例族、gate、reports、artifacts 和缺陷复验范围 |
| `06-验收标准.md` §2 / §5~§14 | 已完成 | 提取 AC-FUNC、AC-RED、AC-IF、AC-STATE、AC-NFR、AC-EVID、VETO、缺陷和风险接受门禁 |

---

## 3. SOP 问题回答

### 3.1 本轮实施的最小可交付结果是什么?

本轮最小可交付结果是一个可编译、可测试、可验收的 `/home/aris/Projects/quantalithos-bus` Rust workspace,能够通过 in-memory / fake 默认路径证明 L0-bus P0 事件传递主闭环成立。

最小闭环包括:

- 契约绑定发布材料接入。
- 统一传递语义形成。
- delivery 推进。
- feedback / idempotency 记录。
- retry / DLQ / replay preparation。
- 总线级审计、tap 和只读输出。
- Outbox relay P0-min 支撑边界。
- 后端 / store / fixture 默认可验证路径。
- JSON 配置控制面和 runtime graph。
- scripts、artifacts、reports 和 acceptance handoff 所需证据生成能力。

### 3.2 哪些需求编号必须覆盖?

必须覆盖 `F-001`~`F-008`。

| 需求编号 | 实施覆盖口径 |
|---|---|
| F-001 | 接收 core contract ref + payload ref / outbox fact,形成 publication acceptance fact |
| F-002 | 从合法发布材料和 backend capability ref 派生平台级 transport semantic |
| F-003 | 推进 delivery lifecycle,保留 delivery history |
| F-004 | 记录 ack / fail / timeout / duplicate feedback 和 idempotency anchor |
| F-005 | 形成 retry plan、dead-letter material 和 replay preparation |
| F-006 | 输出 bus audit material、tap output、transport view 和 failure material |
| F-007 | 承接 committed outbox fact,作为 P0-min 支撑 |
| F-008 | 提供 backend adapter port 与 in-memory / fake 默认可验证路径,作为 P0-min 支撑 |

### 3.3 哪些详细设计章节必须落地?

本轮必须落地 `03-详细设计.md` 中与 P0 可实现闭环直接相关的章节。

| 详细设计章节 | 本轮落地方式 |
|---|---|
| §3 实现约束与编码规范承接 | Rust、目标仓、path dependency、英文源码和提交规则必须执行 |
| §4 实现单元与文件布局 | 创建 workspace 和 `contracts / domain / application / infra / api / worker / jobs` crate |
| §5 模块实现契约 | 按模块职责实现 crate 边界和依赖方向 |
| §6 全局对象 / Trait / API 索引 | 实现 P0 对象、trait、port 和 API 索引中涉及的契约 |
| §7 API / Command / Query / Event / Job 协议契约 | 实现 Command、Query、Inbound Event、Outbound Event 和 Operations Job 协议 |
| §8 逐接口函数级处理流 | 实现 P0 handler、consumer、publisher 和 job runner 流程 |
| §9 状态机与转换矩阵 | 实现 publication、delivery、feedback、recovery、projection 状态守卫 |
| §10 数据持久化、事务与一致性契约 | 实现 repository、UoW、history / audit / idempotency 一致关系 |
| §11 错误模型、异常分支与恢复口径 | 实现 validation、conflict、retryable、manual action 等错误映射 |
| §12 并发、幂等与重入保护 | 实现 idempotency、version conflict、job / publisher 重入保护 |
| §13 配置引用与外部依赖绑定 | 实现 config binding、port / adapter / fake / in-memory 绑定 |
| §14 可观测性与审计埋点契约 | 实现 trace ref、audit、structured log、metrics material |
| §15 测试切口与最小验证清单 | 实现对应测试、gate、report 和 artifact 输出 |

### 3.4 哪些验收项必须在本轮可判定?

本轮必须让以下验收项可判定:

- `AC-FUNC-001`~`AC-FUNC-010`。
- `AC-RED-001`~`AC-RED-010`。
- `AC-IF-001`~`AC-IF-009`。
- `AC-STATE-001`~`AC-STATE-005`。
- `AC-TX-001`~`AC-TX-004`。
- `AC-IDEM-001`~`AC-IDEM-003`。
- `AC-CONC-001`~`AC-CONC-002`。
- `AC-NFR-001`~`AC-NFR-010`。
- `AC-EVID-001`~`AC-EVID-010`。
- `VETO-BUS-001`~`VETO-BUS-012`。

实施计划后续每个阶段都必须能映射到其中一组验收项,不能只写“完成模块开发”。

### 3.5 哪些能力明确不在本轮实施?

以下能力不在本轮 P0 实施范围:

- gateway、登录认证、token 校验、TLS 入口安全。
- 生产级 Kafka / NATS / Redis / RabbitMQ / durable DB adapter 全量实现。
- 业务 payload 正文真相和正文语义校验。
- governance decision truth 和治理审批流程。
- 长期 observability 存储、dashboard、告警阈值、完整 runbook。
- SDK high-level client、开发者体验封装、凭据注入和 retry convenience wrapper。
- config center、hot reload、admin override。
- multi-backend / multi-tenant 全量矩阵。
- exactly-once / effectively-once 承诺。

这些能力只能作为 port、adapter seam、fake、risk acceptance、后续专项或外部仓同步项出现。

### 3.6 是否存在 P1 / P2 能力容易被误做进 P0?

存在。最容易误膨胀的是 production adapter、dashboard / alerting、governance workflow、SDK convenience API、config center / hot reload、exactly-once。实施计划必须在非范围表和风险表中持续约束这些能力,并在 Step 5 / Step 6 拆阶段时避免把它们纳入 P0 commit boundary。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| P0 主闭环跨越多个文档 | `00` 写 F-001~F-008,`03` 写实现契约,`06` 写 AC | 实施范围可能漏掉配置或证据支撑 | 本步统一抽成实施目标和范围表 |
| 目标仓尚未存在 | Step 1 已确认 `/home/aris/Projects/quantalithos-bus` 当前未发现 | 实施者可能不清楚建仓是否属于本轮范围 | 本步把目标仓初始化列为支撑实施范围 |
| P0 与 P0-min 容易混淆 | Outbox relay、backend default path 是支撑边界 | 可能被误认为可后置 | 本步明确 P0-min 必须实施,否则 P0 主闭环不可验 |
| 配置和证据容易被当成后补 | `04`、`05`、`06` 已把 config / reports 作为门禁 | 最后无法验收 | 本步把配置控制面和证据生成列入 P0 支撑范围 |
| P1/P2 容易自然膨胀 | production MQ、dashboard、SDK、hot reload 等诱人但非 P0 | 拖慢第一批实现并破坏验收边界 | 本步明确非范围和后续归属 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 实施目标 | 散落在 `00/03/06` | 收敛为“默认可验证事件传递主闭环” | 实施者知道第一目标 |
| 实施范围 | F、AC、详细设计章节分散 | 形成实施范围表和 AC 映射 | 可追溯 |
| 非范围 | 分散在 `03` 和 `06` | 集中列出并说明后续归属 | 防膨胀 |
| P0-min | 容易被误后置 | 明确 Outbox relay 和默认后端路径必须实现 | 保证闭环可验 |
| 配置 / 证据 | 可能被当作测试或运维事情 | 纳入本轮支撑交付 | 支撑验收 |

---

## 6. 实施设计取舍

### 6.1 是否把本轮目标写成“实现全部 L0-bus”

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 实现全部 L0-bus | 听起来完整 | 会把 P1/P2、生产 adapter、dashboard、SDK 等纳入 P0 | 不采用 |
| B. 实现默认可验证事件传递主闭环 | 边界清楚,可测试可验收 | 需要显式声明 P1/P2 后置 | 采用 |
| C. 只实现最小 API | 很快 | 无法覆盖 delivery、feedback、recovery、evidence | 不采用 |

### 6.2 是否把目标仓初始化纳入实施范围

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入 | 目标仓当前不存在时实施者仍可开始 | 会占一个初始阶段 | 采用 |
| B. 不纳入,要求外部先创建 | 实施计划更短 | 责任不清 |
| C. Step 3 再决定 | 保守 | Step 2 范围不完整 |

采用 A。目标仓初始化是实现前置交付,但不是业务功能;后续 Step 5 应把它放在早期基础阶段。

### 6.3 是否把 production adapter 纳入 P0

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入 | 更接近真实生产 | 与 `03` / `06` P0 范围冲突,也会拖慢第一批实现 |
| B. 不纳入,只实现 port、fake / in-memory 和默认可验证路径 | 符合设计和验收 | 生产化后置 | 采用 |
| C. 做一个半成品 adapter | 看似折中 | 容易制造不可验收代码 |

采用 B。

---

## 7. 结构化中间产物

### 7.1 实施目标表

| 目标 ID | 实施目标 | 来源 | 完成判定 |
|---|---|---|---|
| IMPL-GOAL-001 | 建立 `/home/aris/Projects/quantalithos-bus` Rust workspace 和多 crate 边界 | `03` §3 / §4 | workspace 可编译,crate 命名和依赖方向符合详细设计 |
| IMPL-GOAL-002 | 打通 publication acceptance 到 transport semantic 的接入闭环 | F-001 / F-002,AC-FUNC-001 / 002 | 合法材料 accepted,非法材料 rejected,payload body 不落库 |
| IMPL-GOAL-003 | 打通 delivery progression 默认可验证路径 | F-003 / F-008,AC-FUNC-003 / 008 | in-memory / fake backend 下 delivery 状态和 history 可验证 |
| IMPL-GOAL-004 | 打通 feedback、timeout、idempotency 和冲突处理 | F-004,AC-FUNC-004,AC-IDEM-* | duplicate / conflict / late feedback 有稳定结果 |
| IMPL-GOAL-005 | 打通 retry、DLQ 和 replay preparation | F-005,AC-FUNC-005,VETO-BUS-005 | 缺 audit / DLQ / approval ref 时 replay rejected |
| IMPL-GOAL-006 | 打通 read-only output、audit、tap 和 failure material | F-006,AC-FUNC-006,AC-RED-005 / 006 | Query 不写 truth,输出材料不含 governance decision body |
| IMPL-GOAL-007 | 打通 Outbox relay P0-min 支撑边界 | F-007,AC-FUNC-007,AC-RED-008 | 只消费 committed fact,duplicate 不重复 acceptance |
| IMPL-GOAL-008 | 实现配置控制面和 runtime graph | `04`,AC-FUNC-009,AC-NFR-007 | valid profile 可启动,非法配置 fail-fast / fail-closed |
| IMPL-GOAL-009 | 建立测试、gate、artifact、report 和 acceptance handoff 支撑 | `05`,AC-FUNC-010,AC-EVID-* | 固定 `<run_id>` 下生成 artifacts / reports / acceptance 入口 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 仓库初始化 | `/home/aris/Projects/quantalithos-bus` workspace、`crates/*`、scripts、tests、reports、artifacts | `03` §3 / §4 | 是 | 目标仓当前未发现存在,需纳入初始范围 |
| 编译期依赖 | `core-contracts` path dependency | `03` §3 / §4,`06` AC-IF-006 | 是 | 只依赖 `/home/aris/Projects/quantalithos-core/crates/contracts` |
| contracts crate | Command、Query、Event、Job、View、Receipt、Error DTO | `03` §4 / §7 | 是 | 不复制 L0-core shared contracts |
| domain crate | Publication、Delivery、Feedback、Recovery、ReadOutput、Backend、Audit、Policy、状态 enum | `03` §5 / §6 / §9 | 是 | 不依赖 application / infra |
| application crate | services、ports、UoW、idempotency、错误组合 | `03` §5 / §8 / §10~§12 | 是 | P0 use case 主体 |
| infra crate | in-memory store、repository、transport、publisher、source、projection、config、runtime builder | `03` §4 / §13 | 是 | 默认 fake / in-memory path 必须成立 |
| api crate | HTTP JSON Command / Query / Recovery API | `03` §7 / §8,`06` AC-IF-001 / 002 | 是 | 不实现身份校验 |
| worker crate | outbox relay、backend signal、timeout、read output worker loop | `03` §7 / §8,`06` AC-IF-003 / 005 | 是 | 只承接 P0 consumer / worker |
| jobs crate | operations job binary | `03` §7 / §8,`06` AC-IF-005 | 是 | 支撑 delivery、retry、projection、backend capability check |
| 配置 | JSON config、profile、secret ref、runtime graph、reload rejected | `04`,`06` AC-FUNC-009 | 是 | 不做 config center / hot reload |
| 测试与证据 | tests、scripts/gates、scripts/reports、scripts/checks、artifacts、reports | `05`,`06` AC-FUNC-010 / AC-EVID-* | 是 | 实施完成前必须可生成验收输入 |

### 7.3 非范围表

| 非范围 | 后续归属 | 本轮只保留什么 | 误纳入风险 |
|---|---|---|---|
| gateway、认证、token、TLS | gateway / identity / security | actor / metadata / authorization ref 接缝 | 把入口安全写进 bus |
| 生产 MQ / durable DB adapter 全量实现 | P1 adapter 专项 | port、fake / in-memory、capability / unavailable 语义 | 拖慢 P0,形成半成品 adapter |
| 业务 payload 正文真相 | publisher / artifact / 业务仓 | payload ref / digest / metadata | 保存或解释 payload body |
| governance decision truth | governance 仓 | failure material、approval ref、audit chain ref | bus 生成 decision body |
| 长期观测存储、dashboard、alerting | observability / ops | tap / trace / audit / metrics material | 把 dashboard 当作 P0 |
| SDK high-level client | L0-sdk | transport view / error contract | 把 developer experience 做进 bus |
| config center / hot reload / admin override | P2 config / ops | reload request rejected,冷启动配置 | 运行期隐式改 runtime graph |
| multi-backend / multi-tenant matrix | P2 platform | 单一默认可验证 path 和 port seam | 把多环境矩阵写成 P0 |
| exactly-once / effectively-once | 后续专项 / 文档风险 | at-least-once + idempotency anchor | 错误承诺 delivery 语义 |
| 部署运维 runbook | 部署与运维手册 | scripts 和 reports 的实施交付 | 把运维流程塞进实施阶段 |

### 7.4 范围到验收项映射表

| 实施范围 | 关键验收项 |
|---|---|
| publication + semantic | `AC-FUNC-001`、`AC-FUNC-002`、`AC-RED-001`~`004` |
| delivery progression | `AC-FUNC-003`、`AC-STATE-002`、`AC-TX-001`、`AC-NFR-004` |
| feedback / idempotency | `AC-FUNC-004`、`AC-IDEM-001`、`AC-CONC-002` |
| retry / DLQ / replay preparation | `AC-FUNC-005`、`AC-STATE-004`、`VETO-BUS-005` |
| read-only output / audit | `AC-FUNC-006`、`AC-RED-005`、`AC-EVID-001` / `002` |
| outbox relay | `AC-FUNC-007`、`AC-RED-008`、`AC-TX-002` |
| backend / store / fake path | `AC-FUNC-008`、`AC-IF-007`、`AC-NFR-004` |
| config control plane | `AC-FUNC-009`、`AC-RED-009`、`AC-NFR-007` |
| reports / artifacts | `AC-FUNC-010`、`AC-EVID-003`~`010`、`VETO-BUS-010` |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §2。

```markdown
## 2. 实施目标与范围

> 校准来源：
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”“非范围表”和“范围到验收项映射表”小节，了解本轮实现为什么限定为默认可验证事件传递主闭环。

本轮实施目标是在 `/home/aris/Projects/quantalithos-bus` 中交付一个可编译、可测试、可验收的 Rust workspace,通过 in-memory / fake 默认路径证明 L0-bus P0 事件传递主闭环成立。主闭环覆盖 publication acceptance、transport semantic、delivery progression、feedback / idempotency、retry / DLQ / replay preparation、read-only output、audit、Outbox relay、配置控制面和证据生成。

本轮必须覆盖 F-001~F-008,并让 `06-验收标准.md` 中的 AC-FUNC、AC-RED、AC-IF、AC-STATE、AC-TX、AC-IDEM、AC-CONC、AC-NFR、AC-EVID 和 VETO-BUS 门禁可判定。

本轮不实现 gateway / auth / TLS、生产 MQ / durable DB adapter 全量能力、业务 payload 正文真相、governance decision truth、observability dashboard、SDK high-level client、config center / hot reload、multi-backend / multi-tenant 矩阵和 exactly-once 承诺。这些能力只能作为 port、adapter seam、fake、risk acceptance、后续专项或外部仓同步项出现。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 本轮目标是否写成“完整 L0-bus” | A. 是;B. 否,写成默认可验证事件传递主闭环;C. 只写最小 API | 采用 B |
| 目标仓初始化是否纳入范围 | A. 纳入;B. 不纳入;C. Step 3 再决定 | 采用 A |
| production adapter 是否纳入 P0 | A. 纳入;B. 不纳入,只实现 port + fake / in-memory;C. 做半成品 adapter | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮目标已明确 | 已满足 |
| 实施范围已能追溯到上游编号 | 已满足 |
| 非范围已显式写出 | 已满足 |
| P1 / P2 防膨胀边界已明确 | 已满足 |
| 用户确认不会在实施阶段自然膨胀 | 待确认 |

结论: 可以进入 Step 3,收稳前置条件与阅读清单。
