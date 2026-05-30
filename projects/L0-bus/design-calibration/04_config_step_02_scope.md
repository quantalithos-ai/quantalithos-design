# Step 2. 明确配置设计目标、范围和非范围

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 2 中间产物。
> 本步只定义本轮配置设计要覆盖哪些配置控制面、P0 / P1 / P2 配置口径和非范围。
> 本步不列完整配置项清单,不写 JSON 示例,不创建正式 `04-配置设计.md`,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-bus/04-配置设计.md` §2 本次配置设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已确认配置设计以新版 `00/01/02/03` 为主输入,当前 `05/06` 只作下游承接参考 | 作为本步范围裁剪的直接前提 |
| `00-需求文档.md` §4 / §7 / §9 / §14 | P0 主闭环、P0-min 支撑边界、F-001~F-008、非目标和风险 | 确定配置设计必须覆盖事件传递、失败恢复、只读输出、outbox relay 和默认可验证路径 |
| `01-架构设计.md` §3 / §7 / §11 / §12 / §13 | in-memory default path、ports and adapters、durable bus store、后端 adapter 边界、配置集中管理和演进路线 | 确定 P0 / P1 / P2 配置范围和后续生产 adapter 的非范围 |
| `02-概要设计.md` §11 | 配置影响轮廓、禁止配置化边界、domain 不直接读取配置 | 确定配置设计目标必须覆盖入口、worker、job、adapter、projection 和 policy factory |
| `03-详细设计.md` §13 / §17 | 配置绑定点、外部依赖绑定、禁止配置化边界、`04` 缺失风险 | 确定配置设计必须承接的 `RuntimeConfig`、子 config、loader、validator 和 builder |

已确认结论:

```text
本轮配置设计必须覆盖 L0-bus P0 可运行闭环的配置控制面:
publication acceptance -> outbox relay -> delivery -> feedback -> recovery -> read-only output。

本轮配置设计必须为 API、worker、jobs、store、transport backend、publisher、projection、policy、安全边界和默认可验证路径提供配置说明。

本轮不设计生产 MQ / durable store 产品的最终配置全集,不写部署命令,不替代测试方案、验收标准、实施计划或运维手册。
```

依赖的前序 Step:

```text
Step 1 已确认 04 以 00/01/02/03 为事实输入,05/06 只作为后续承接参考。
```

---

## 3. SOP 问题回答

### 3.1 P0 必须定义哪些配置才能运行主链?

P0 必须定义能让默认可验证路径跑通的配置控制面。这里的“运行主链”不是生产部署全集,而是实现者和测试方案可以用同一套配置语义启动 API、worker、job、in-memory / fake adapter、projection 和安全边界校验。

| P0 配置控制面 | 必须回答的问题 | 支撑的主链 |
|---|---|---|
| 运行入口配置 | API、worker、operations job 是否启用,以什么 profile 启动 | command / query / worker / job 主入口 |
| store 配置 | bus truth、history、audit、DLQ、projection 使用什么 store profile | delivery、feedback、recovery、audit、query |
| outbox source 配置 | 从什么 source profile 消费 committed outbox fact,如何 batch / cursor / ack | outbox relay -> publication acceptance |
| transport backend 配置 | 使用 in-memory backend 还是后续 backend profile,如何表达 capability / timeout | delivery progression |
| publisher 配置 | outbound event 使用 in-memory sink / fake publisher / 后续 publisher profile | publication accepted、delivery changed、DLQ 等事件输出 |
| worker / job 配置 | batch size、timeout、retry category、cursor 和 checkpoint 如何表达 | delivery worker、retry job、projection job、capability job |
| projection 配置 | read-only output 使用什么 projection store、rebuild mode 和 consistency marker | query / transport view / failure summary |
| recovery policy 配置 | retry、DLQ、replay preparation 需要哪些策略引用 | failure recovery |
| security boundary 配置 | secret ref、privileged operation ref、forbidden body / raw secret 拒绝策略 | redaction、安全红线、replay / tap / DLQ 受控边界 |
| clock / id generator 配置 | local / CI / test 如何使用 deterministic fake,默认路径如何生成 ID 和时间 | 幂等、history、audit、测试可复现 |

这些配置必须能支撑 P0 默认可验证路径,但不要求一次覆盖生产 MQ、生产持久化、完整 config center 或 secret provider。

### 3.2 哪些配置属于 P1 / P2 或后续扩展?

P1 / P2 配置可以在 P0 文档中保留接缝和限制,但不能写成当前必须实现的配置全集。

| 能力 | 阶段 | 本轮处理口径 |
|---|---|---|
| 首个生产 MQ adapter 配置 | P1 | 只保留 `BackendConfig` profile / endpoint ref / secret ref / capability ref 接缝,不写产品字段全集 |
| durable store 产品配置 | P1 | 只保留 `StoreConfig` connection ref / store kind 接缝,不写数据库产品参数全集 |
| config center / remote config | P1/P2 | 只保留来源优先级讨论入口,默认 P0 以 code default + JSON file + env override + secret ref 为主 |
| secret provider / KMS / Vault 真实接入 | P1/P2 | P0 只允许 `SecretRef`,不定义具体 provider 供应商字段全集 |
| 多后端全量矩阵 | P2 | 只定义统一 transport semantic 不能被后端配置破坏 |
| 多租户隔离配置 | P2 | 本轮不定义 tenant isolation config,避免提前扩大 bus 数据边界 |
| filter DSL 配置 | P2 | 不进入当前配置范围,避免把订阅过滤语义提前写死 |
| DLQ UI / backend health UI 配置 | P2 / 产品层 | 只定义 query / projection 输入,UI 配置不归本仓 |
| effectively-once 专项配置 | P2 / 专项 | 当前默认 at-least-once + idempotency anchor,不定义 effectively-once config |
| 生产告警阈值和 dashboard 配置 | 运维 / observability | `04` 只给观测 marker 和配置门禁输入,不写 dashboard 参数 |

### 3.3 哪些配置细节应留给部署与运维手册?

部署与运维手册负责具体环境落地,配置设计只定义配置语义和控制面。

| 留给部署与运维手册的内容 | 本轮配置设计只做到 |
|---|---|
| 容器启动命令、systemd / docker compose / Kubernetes manifest | 定义启动 profile 和配置文件语义 |
| 真实 MQ / DB endpoint、credential 挂载、网络策略 | 定义 endpoint ref / connection ref / secret ref |
| backup / restore / disaster recovery 操作步骤 | 定义 store / projection / audit / DLQ 的配置边界和失败策略 |
| 生产告警阈值、dashboard 布局和值班 playbook | 定义配置错误、backend unavailable、projection stale 等可观察失败模式 |
| secret provider 真实接入参数和轮换操作 | 定义只允许 secret ref,不允许 raw secret |
| 各环境真实配置文件填写值 | 定义配置项表、demo 和 profile 矩阵,不写生产真实值 |

### 3.4 哪些配置细节应留给实施计划?

实施计划负责把配置设计转成开发批次和提交边界,不负责重新定义配置语义。

| 留给 `07-实施计划.md` 的内容 | 本轮配置设计只做到 |
|---|---|
| 先实现哪个 config struct / loader / validator / builder | 定义配置项、来源、校验和生效机制 |
| 哪个 commit boundary 实现 API config、worker config、job config | 定义各配置控制面和关联模块 |
| 实现仓目录、package、path dependency、git config 检查 | 定义配置语义,不写开发步骤 |
| 测试脚本、报告目录和 CI gate 具体执行顺序 | 定义配置矩阵和配置失败模式,交给测试 / 实施承接 |
| 是否先实现 in-memory default path 再实现生产 adapter | 明确 P0 / P1 配置范围和 default verifiable path |

### 3.5 哪些非范围仍有残余风险?

| 非范围 | 残余风险 | 当前处理方式 |
|---|---|---|
| 生产 MQ adapter 字段全集 | P1 实施时可能补充配置字段并影响 `BackendConfig` | 在 §14 风险记录;P0 只保留 adapter profile / ref 接缝 |
| durable store 产品字段全集 | 后续 store 选择可能影响 config struct 字段 | P0 先定义 store kind / connection ref;产品专项需要回查 03/04 |
| config center / remote reload | 后续如果引入热更新,可能影响 loader / validator 生命周期 | P0 默认启动加载 / 冷更新;热更新作为 P1/P2 风险 |
| 真实 secret provider | provider 选择可能影响 secret ref 解析接口 | P0 只允许 ref,禁止 raw secret;provider 接入后续设计 |
| 部署和运维真实值 | 实施者可能把 demo 当生产配置 | 正式 `04` 必须区分 strict JSON demo、JSONC 文档示例和实际运行配置 |
| 当前旧 `05/06` | 测试验收可能继续沿用旧对象 | 配置完成后必须重校准 `05/06` |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-bus/04-配置设计.md` | 文件不存在,也没有范围声明 | 后续实现者可能把完整生产 adapter、部署参数、测试脚本和配置 schema 混在一起 |
| `03-详细设计.md` §13 | 已列配置组,但没有说明哪些属于 P0、哪些只是后续接缝 | 容易误以为所有 `BackendConfig` / `StoreConfig` 都必须一次完成生产级字段 |
| `01-架构设计.md` §13 | 已说明 P0 / P1 / P2 演进,但未转译为配置范围 | 配置设计需要把生产 adapter、多后端、UI、effectively-once 等后移 |
| `02-概要设计.md` §11 | 已识别配置影响,但不定义配置范围 | 需要本步承接为 `04` 的目标、范围和非范围 |
| 当前旧 `05/06` | 仍可能暗示旧 envelope / routing 对象和测试矩阵 | 本轮不能让旧测试验收口径反向污染配置范围 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计目标 | 只有详细设计中的配置绑定点 | 明确 `04` 要形成运行配置控制面,支撑开发、测试、验收、实施和运维 | 配置不是代码字段列表,而是跨下游文档的控制面 |
| P0 配置范围 | 未区分 default path 与生产 adapter | P0 聚焦 in-memory / fake 默认可验证路径和必要 profile 接缝 | 避免把生产 MQ / durable store 全量参数提前写死 |
| P1/P2 配置 | 散落在架构风险中 | 明确 production adapter、config center、secret provider、多后端、多租户、UI、effectively-once 后移 | 防止范围膨胀 |
| 文档边界 | 配置、部署、测试、实施可能混写 | 部署命令、CI 脚本、真实环境值、commit boundary 均不在 `04` 本步展开 | 保持 `04` 只做配置语义和控制面 |
| 下游承接 | 旧 `05/06` 可能作为事实源 | `05/06` 只作方向参考,后续承接 `04` 重新校准 | 防止旧对象口径回流 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把全部生产配置一次设计完整 | 看似完整,后续运维字段可直接填写 | MQ / store / secret provider / config center 未定,会虚构大量字段并污染 P0 | 不采用 |
| 方案 B：P0 只定义默认可验证路径和稳定配置接缝,P1/P2 只记录扩展口径 | 能支撑近期实现,又不会阻塞后续生产 adapter 演进 | 后续生产化还需要专项补充具体产品字段 | 采用 |
| 方案 C：只写“由实现决定配置” | 文档短,实现自由度高 | 会让不同 agent 自行发明 JSON、env、secret 和 profile 语义 | 不采用 |

推荐方案 B。

原因:

- `L0-bus` 当前最需要的是可实现、可测试的 P0 默认路径,不是生产 MQ / store / KMS 的全量参数。
- 配置接缝必须稳定,否则后续生产 adapter 没有承接点。
- 具体产品字段在产品和部署决策未收稳前不应进入正式配置契约。

---

## 7. 结构化中间产物

### 7.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 定义 P0 默认可验证路径配置 | 让 API、worker、job、store、backend、publisher、projection 和 policy 能在 local / CI / test 下启动 | `05` 可据此设计配置测试矩阵;`07` 可据此安排 config loader 和 runtime builder 实现 |
| 定义配置控制面边界 | 明确哪些运行行为由配置控制,哪些领域不变量禁止配置化 | `06` 可据此设置配置红线验收 |
| 定义配置来源和 profile 口径 | 明确 code default、JSON file、env override、secret ref 等来源如何生效 | 实现者不会临时发明配置覆盖顺序 |
| 定义敏感配置和 secret ref 边界 | 防止 raw secret、backend private body、payload body 进入配置、状态、日志或审计 | 安全测试、验收和实施门禁可引用 |
| 定义配置加载、校验和失效策略 | 明确 config loader、validator、runtime builder 如何处理缺失、冲突、非法和不可达 | 实现者可以实现一致的 fail-fast / fail-closed 行为 |
| 定义下游承接关系 | 说明测试、验收、实施和运维如何使用配置设计 | 避免 `05/06/07/09` 重复定义配置事实 |

### 7.2 范围 / 非范围表

| 类型 | 内容 | 本轮处理口径 |
|---|---|---|
| 范围 | `RuntimeConfig` 和子 config 的配置语义 | 承接 03,说明来源、优先级、profile、校验和失败策略 |
| 范围 | API / worker / operations job 启动与运行 profile | 定义启用口径、batch、timeout、cursor、retry、projection 等配置控制面 |
| 范围 | store / backend / outbox source / publisher / projection adapter profile | 定义 P0 in-memory / fake 默认路径和后续 production adapter 接缝 |
| 范围 | security boundary / secret ref / forbidden body 拒绝策略 | 定义敏感配置和禁止配置化边界 |
| 范围 | local / CI / test / staging / production-like 配置矩阵 | 定义环境差异,不写真实生产值 |
| 非范围 | 完整生产 MQ / DB / KMS / config center 产品字段全集 | 后续生产 adapter / 运维专项 |
| 非范围 | 部署命令、容器挂载、Kubernetes manifest、值班 playbook | 部署与运维手册 |
| 非范围 | 完整测试用例、脚本、报告证据格式 | `05-测试方案.md` |
| 非范围 | 验收通过 / 不通过标准和一票否决清单 | `06-验收标准.md` |
| 非范围 | 实施批次、commit boundary、编码顺序和 git 规范 | `07-实施计划.md` |

### 7.3 P0 / P1 / P2 配置口径

| 阶段 | 配置口径 | 当前是否进入正式配置设计 |
|---|---|---|
| P0 | API / worker / jobs / store / backend / source / publisher / projection / policy / security boundary 的默认可验证配置 | 是,必须完整说明 |
| P0-min | outbox relay 边界和 in-memory transport default path | 是,必须说明默认配置和限制 |
| P1 | 首个 production MQ adapter、durable store、基础运维状态、授权承接方、secret provider 接入 | 只保留接缝和风险,不写字段全集 |
| P2 | 多后端矩阵、多租户、Filter DSL、DLQ UI、effectively-once、完整 ops runbook | 不进入当前配置项清单,只在风险与演进中说明 |

### 7.4 配置设计范围图

```text
04 Configuration design scope
|
+-- In scope
|   +-- P0 runtime config semantics
|   +-- source priority and profile matrix
|   +-- module-level JSON demos and config item table
|   +-- secret ref and forbidden boundary rules
|   +-- load / validate / apply / fail behavior
|   +-- downstream handoff to 05 / 06 / 07 / 09
|
+-- Explicitly out of scope
    +-- production MQ / DB / KMS full product fields
    +-- deployment commands and operations runbook
    +-- test cases and acceptance gates
    +-- commit boundaries and implementation schedule
```

关键说明：

- 本图表达 `04` 的职责边界,不表达代码调用流。
- P0 需要可运行配置语义,但不需要生产产品字段全集。
- P1/P2 只保留配置接缝和风险,不能写成当前必须实现项。
- 下游文档承接 `04` 的配置事实,不重复定义配置契约。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 2 只定义配置设计目标、范围、非范围和 P0 / P1 / P2 口径 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 配置聚焦默认可验证路径,生产 MQ / durable store 字段全集后移 | 否 | 与 `03` §13 默认值口径一致 | 无 | 无回写 |
| 本步不新增 `RuntimeConfig` 字段、不改变子 config 结构、不新增 `ConfigError` 枚举值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

- 本步没有改变 `03-详细设计.md` 中的配置绑定点。
- Step 7 若基于配置项清单发现 `RuntimeConfig` 字段缺失,再进入详细设计回写清单。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §2。

```md
## 2. 本次配置设计目标与范围

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置设计目标表”“范围 / 非范围表”“P0 / P1 / P2 配置口径”和“对详细设计的影响判定”小节，了解本章范围如何从 P0 主闭环和详细设计绑定点收敛而来。

本次配置设计的目标，是把 `03-详细设计.md` 中已经定义的配置绑定点整理成可填写、可校验、可测试、可验收、可实施和可运维承接的配置控制面。

本轮 P0 覆盖 `L0-bus` 默认可验证路径所需配置：API、worker、operations job、store、outbox source、transport backend、publisher、projection、recovery policy、security boundary、clock 和 id generator。配置设计必须说明这些配置的来源、优先级、profile、默认口径、校验、生效和失败策略。

本轮配置设计不写生产 MQ / durable store / KMS / config center 的完整产品字段全集。相关能力只保留 adapter profile、connection ref、secret ref 和 capability ref 等稳定接缝,具体产品参数进入 P1/P2 生产 adapter 或运维专项。

本轮配置设计不写部署命令、容器挂载、Kubernetes manifest、值班 playbook、完整测试用例、验收门禁、commit boundary 或开发排期。这些分别由部署与运维手册、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 承接。

本章未发现需要回写 `03-详细设计.md` 的配置结论。后续如果配置项清单发现必须新增 `RuntimeConfig` 字段、改变 config struct、改变 adapter constructor 参数或新增 `ConfigError` 枚举值,必须先进入详细设计回写清单。
```

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受 P0 配置只覆盖默认可验证路径和稳定接缝,不写生产 MQ / DB 字段全集 | A. 接受;B. 现在写全生产字段;C. 完全交给实施阶段 | 推荐 A | 当前生产 adapter 和 store 产品未定,写全会虚构字段;完全交给实施会导致配置漂移 |
| 是否接受 config center / remote reload 不进入 P0 | A. 接受;B. P0 设计 remote reload;C. 不讨论 | 推荐 A | P0 应优先稳定启动加载、校验和冷更新;remote reload 会改变 loader 生命周期 |
| 是否接受旧 `05/06` 不参与本步范围裁剪 | A. 接受;B. 旧 `05/06` 也作为事实源;C. 先重写 `05/06` | 推荐 A | 当前旧 `05/06` 对象口径已落后,应等 `04` 完成后再重校准 |

---

## 11. 进入下一步条件

- [x] P0 配置目标已明确。
- [x] P1 / P2 配置能力已明确后移口径。
- [x] 配置设计与部署、测试、验收、实施、运维的边界已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 2 状态从 `[~]` 更新为 `[x]`。
