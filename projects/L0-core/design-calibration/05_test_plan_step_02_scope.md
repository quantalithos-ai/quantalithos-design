# Step 2. 明确测试目标、范围和非范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-core/05-测试方案.md` §2

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 1 输入边界 | 已确认新版 `00/01/02/03/04` 是测试方案主输入 | 约束本步范围不再沿用旧 05 |
| `00-需求文档.md` §7~§14 | 核心能力闭环、US-001~US-007、F-001~F-007、BR-001~BR-014、NFR、需求验收和一票否决项 | 定义测试目标、P0/P1/P2 和非范围 |
| `03-详细设计.md` §2 | P0 只做契约来源仓和本地运行入口;排除 HTTP/RPC、auth、bus runtime、SDK 高层、L1 业务 | 定义实现级测试范围和非范围 |
| `04-配置设计.md` §2 | P0 runtime 配置、配置来源、校验、失效和下游承接;排除 config center、hot reload、真实 secret provider | 定义配置测试范围和非范围 |
| 旧 `05-测试方案.md` | 旧 shared primitive admission 测试范围 | 作为问题诊断,不作为新版范围来源 |

依赖的前序 Step：Step 1 已确认。

## 3. SOP 问题回答

1. P0 必须通过哪些测试才能证明主链成立?

   回答：P0 必须证明四条核心能力闭环成立:契约范围能统一收束;契约语义能稳定表达;契约演进兼容且可追溯;下游能够基于同一契约基线消费和派生。实现层必须覆盖 Command、Query、Event、Job、状态机、事务一致性、幂等、错误恢复、配置加载校验、审计观测和 runtime wiring。只要其中任一主链没有可执行测试和证据,本轮测试方案就不完整。

2. P1/P2 是否只做边界验证或延后?

   回答：P1/P2 不进入当前 P0 完整测试主线。P1 只保留边界验证或 future candidate 风险记录,例如真实 secret provider / KMS / Vault 接入、多语言 binding、样例和可视化增强。P2 后续能力如 config center、admin override、hot reload、高级发布体验、完整 SDK developer experience 只记录为非范围或残余风险,不设计正式用例。

3. 哪些下游能力只测接缝,不测对方完整实现?

   回答：`L0-bus` 只测 outbox event 和 `EventPublisherPort` 边界,不测 publish / subscribe / ack / retry / dead-letter runtime。`L0-sdk` 只测契约来源、DTO / schema 和派生输入稳定性,不测 SDK 高层重试、认证、配置和开发者体验。L1+ 仓只测能基于 L0-core 契约消费 / 引用 / 派生,不测 L1 业务聚合和业务状态机。

4. 哪些非范围有残余风险?

   回答：旧 06 验收标准仍是最大下游风险,会在 Step 14 记录并要求后续校准。真实外部工具链、registry、CI 平台、KMS / Vault、config center、L0-bus runtime 和 L0-sdk 高层能力不进入本轮 P0 测试,可能导致“实现仓能通过 P0 测试,但完整平台集成体验仍需后续仓验证”的残余风险。

5. 哪些范围项是一票否决相关?

   回答：以下范围项是一票否决相关:无法作为跨仓共享契约正式来源;契约范围、语义、演进、下游消费任一核心闭环节点缺失;相邻仓职责进入 L0-core;契约真相与快照 / 引用 / 外部正文混淆;契约变化不可追溯;同一共享契约在不同下游仓形成冲突真相;配置或测试绕过审计、outbox、idempotency、gate、fingerprint 等设计红线。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §1.1 | 测试目标仍是 shared primitive registry / admission | 与当前契约定义、发布、快照、追溯、事实输出主线不一致 |
| `05-测试方案.md` §1.2 | 范围项是 CoreId / Ref / DTO / enum / metadata skeleton | 覆盖不到新版 03 的 Command / Query / Event / Job / runtime config |
| `05-测试方案.md` §2 | 测试分层围绕 registry / consume base | 无法证明当前事务、outbox、snapshot、projection、job、配置失效等风险 |
| `05-测试方案.md` §4 | 环境与配置未体现 `04-配置设计.md` 的 P0 配置矩阵 | 配置测试范围缺失 |
| `05-测试方案.md` 全文 | 非范围没有对 HTTP/RPC、auth、bus runtime、SDK 高层、L1 业务、config center 等新版边界做明确排除 | 后续测试容易扩大到相邻仓职责 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试目标 | 验证 shared primitive admission 和 registry consume | 验证跨仓共享契约来源仓能力闭环和 P0 实现契约 | 当前需求和设计主线已经变化 |
| P0 范围 | CoreId / Ref / DTO / enum / metadata skeleton | Command / Query / Event / Job、domain aggregate、application service、ports / adapters、状态机、事务、幂等、配置、观测审计 | 必须覆盖 03 §15 最小测试切口 |
| 下游测试 | bus/sdk consume base 完整验证 | 只测 L0-bus / L0-sdk / L1+ 的契约接缝,不测对方完整实现 | 守住仓际职责边界 |
| 配置范围 | 笼统环境配置 | 承接 04 的 runtime config、source priority、profile、failure mode | 配置设计已经正式落地 |
| 非范围 | 旧文档弱表达 | 明确排除 HTTP/RPC server、auth、bus runtime、SDK 高层、L1 业务、config center、hot reload、真实 secret provider | 防止测试方案扩张成相邻仓测试 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只围绕核心能力闭环写高层测试目标 | 简洁,贴近需求 | 无法指导实现者写具体测试 | 不采用 |
| B. 以 03 §15 最小切口为 P0,再向上追溯到 F-001~F-007 | 可执行、可追溯、能覆盖实现风险 | 文档更长 | 采用 |
| C. 把 L0-bus / L0-sdk / L1 完整联调纳入 P0 | 平台级信心更强 | 越界,会阻塞 L0-core 独立完成 | 不采用 |
| D. 将配置测试延后到实施计划 | 减少 05 内容 | 配置错误会直接影响 CLI / job runtime,无法验收 P0 可运行性 | 不采用 |

## 7. 结构化中间产物

### 7.1 测试目标表

| 测试目标 | 来源 | 验证重点 | 证据方向 |
|---|---|---|---|
| 证明 L0-core 能作为跨仓共享契约正式来源 | F-001、BR-001、BR-002、需求验收 | 契约范围、定义真相、禁止边界外内容进入 | 范围判断测试、负向边界测试、truth record |
| 证明契约语义可被稳定表达 | F-002、BR-003、BR-008 | Command / Query / Event / Job schema、错误、追踪、审计上下文 | 协议测试、schema snapshot、event payload 检查 |
| 证明契约演进兼容且可追溯 | F-003、BR-004、BR-007、BR-013、BR-014 | lifecycle、release baseline、compatibility、evolution record、audit | 状态机测试、发布门禁测试、审计证据 |
| 证明下游能基于同一基线消费和派生 | F-004、BR-005、BR-009~BR-012 | release snapshot、package view、guide sample、outbox boundary | snapshot / package 查询测试、event boundary test |
| 证明外围检查与派生辅助不会破坏核心真相 | F-005、F-006、F-007 | job、rebuild、fingerprint、trace、sample | job 测试、projection rebuild、trace view 证据 |
| 证明 CLI / job runtime 配置可正确装配和失败 | `04-配置设计.md` §2~§12 | config source priority、parse、validate、fail fast / closed | 配置矩阵测试、负向配置测试、启动失败证据 |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| 契约定义真相与生命周期 | domain / state | P0 | 验证 draft、review、published、deprecated、retired、superseded 等状态规则 | 不验证 L1 业务对象生命周期 |
| 契约范围和边界守卫 | policy / negative | P0 | 验证单仓私有实现、业务正文、运行时正文、凭据正文不能进入 L0-core | 不设计完整治理审批 UI |
| Command API | protocol / service | P0 | 验证 5 个写路径命令、幂等、事务、审计、outbox 副作用 | 不提供 HTTP / RPC server |
| Query API | protocol / projection | P0 | 验证 8 个查询、current / stale、not found、projection unavailable | 不实现观测查询平台 |
| Outbound Event / outbox boundary | event / integration | P0 | 验证 7 类事实事件进入 outbox 并满足 CloudEvent 约束 | 不测试 L0-bus ack / retry / dead-letter runtime |
| Operations Job / Worker | job / worker | P0 | 验证 5 个 job 和 outbox relay 的输入、幂等、状态、副作用 | 不设计调度平台 |
| 发布基线、兼容性和快照派生 | release / snapshot | P0 | 验证 gate、fingerprint、compatibility、snapshot ready 和失败保留 | 不验证外部包发布中心 |
| 事务、一致性、幂等和并发 | consistency | P0 | 验证 truth + audit + outbox 原子性、version conflict、idempotency replay | 不做分布式事务平台测试 |
| 配置加载、校验和失效 | config / runtime | P0 | 验证 defaults / file / env / CLI 合并、cross-field validate、fail fast / closed | 不测试 config center、hot reload、admin override |
| 观测与审计证据 | observability / audit | P0 | 验证 trace propagation、structured log、metric、audit event 存在 | 不测试 L4-observability 存储和面板 |
| 多语言 binding、样例、可视化 | enhancement | P1/P2 | 仅保留接口或快照接缝风险 | 不进入本轮 P0 |
| 真实 KMS / Vault / secret provider | sensitive config | P1/P2 | 仅验证 P0 不允许 raw secret | 真实接入后续设计 |

### 7.3 优先级口径

| 优先级 | 定义 | 本轮处理 |
|---|---|---|
| P0 | 缺失后无法证明 L0-core 作为共享契约来源仓成立,或影响一票否决项 | 必须设计用例、断言和证据 |
| P1 | 增强自动化、接入、运维或安全能力,但不阻断本仓核心闭环 | 记录边界测试或后续风险 |
| P2 | 平台级体验、在线化、完整外部系统集成或未来能力 | 不设计正式用例,只记录非范围和残余风险 |

## 8. 回填草稿

```md
## 2. 本次测试目标与范围

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本章测试目标、范围和非范围如何从需求、详细设计与配置设计收敛。

本轮测试的目标是证明 L0-core 作为跨仓共享契约来源仓的 P0 能力闭环成立:契约范围能够统一收束,契约语义能够稳定表达,契约演进能够兼容且可追溯,下游仓能够基于同一契约基线消费和派生。

本轮测试范围以 `03-详细设计.md` 的 P0 实现契约和 §15 最小测试切口为准,并承接 `04-配置设计.md` 中的 CLI / job runtime 配置、配置来源、profile、配置项、加载校验和失效模式。测试方案不验证 HTTP / RPC server、认证授权、L0-bus runtime、L0-sdk 高层封装、L1 业务聚合、config center、hot reload 或真实 secret provider。

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| 契约定义真相与生命周期 | domain / state | P0 | 验证契约定义状态规则和真相边界 | 不验证 L1 业务对象生命周期 |
| Command / Query / Event / Job | protocol / flow | P0 | 验证协议 schema、处理流、错误、幂等和副作用 | 不提供 HTTP / RPC server |
| 发布基线、兼容性和快照派生 | release / snapshot | P0 | 验证 gate、fingerprint、compatibility 和 snapshot ready | 不验证外部包发布中心 |
| 事务、一致性、幂等和并发 | consistency | P0 | 验证 truth + audit + outbox 原子性和冲突处理 | 不做分布式事务平台测试 |
| 配置加载、校验和失效 | config / runtime | P0 | 验证 defaults / file / env / CLI、cross-field validate、fail fast / closed | 不测试 config center 或 hot reload |
| 观测与审计证据 | observability / audit | P0 | 验证 trace、log、metric、audit event 能形成证据 | 不测试 L4-observability 存储和面板 |
```

## 9. 待确认事项

- 是否接受本轮测试方案以 `03-详细设计.md` §15 最小测试切口作为 P0 实现测试范围。
- 是否接受 L0-bus、L0-sdk、L1+ 只测契约接缝,不测对方完整实现。
- 是否接受 config center、hot reload、真实 secret provider 只作为 P1/P2 非范围记录。

## 10. 进入下一步条件

- [x] P0/P1/P2 和非范围已收稳。
- [x] P0 范围可以推导出 Step 3 测试对象与测试切口。
- [x] 下游和配置边界已明确。
- [x] 可以进入 Step 3 抽取测试对象与测试切口。
