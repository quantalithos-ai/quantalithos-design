# Step 2. 明确配置设计目标、范围和非范围

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 2 中间产物。
> 本步只定义本轮配置设计要覆盖哪些配置控制面、P0 / P1 / P2 配置口径和非范围。
> 本步不列完整配置项清单,不写 JSON 示例,不创建正式 `04-配置设计.md`,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
- 回填章节: `projects/L1-conversation/04-配置设计.md` §2 本次配置设计目标与范围

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已确认 `04` 以新版 `00/01/02/03` 为主输入,`05/06` 仅作下游承接参考 | 作为本步范围裁剪直接前提 |
| `00-需求文档.md` | 对话真相仓定位、P0 闭环、数据归属、非目标和上游依赖 | 确认配置服务本仓 truth runtime 和外部接缝,不扩大为 Chat / Workspace / Runtime / Bridges 功能配置 |
| `01-架构设计.md` | 架构边界、依赖方向、配置不得绕过边界、运行期协作和演进取舍 | 确认配置不能改变系统边界、数据所有权、派生不反写和正文排除规则 |
| `02-概要设计.md` §11 | 配置影响轮廓、受配置影响的主要部分、禁止配置化边界 | 确定本轮配置设计覆盖 runtime builder、adapter config、store config、job config 和配置错误边界 |
| `03-详细设计.md` §13 / §16 / §17 | 配置引用表、外部依赖绑定、跨仓 Rust 依赖绑定、实施承接和风险收口 | 固定 P0 必须覆盖的配置入口、默认值口径、外部依赖绑定和下游回写门禁 |

已确认结论:

```text
本轮配置设计必须覆盖 L1-conversation P0 默认可验证路径的配置控制面:
runtime bootstrap -> local/in-memory store -> fake or configured resolver -> fake or configured outbox publisher -> fake or configured handoff -> jobs / reports / redaction checks。

本轮配置设计必须为 runtime、storage、api、worker、outbox、resolver、handoff、jobs、retention、projection、reports 和 security redaction 提供配置说明。

本轮不设计生产拓扑、部署命令、真实告警阈值、完整运维 runbook、测试用例全集、验收 AC-ID、实施 commit boundary 或真实相邻仓 adapter 实施顺序。
```

依赖的前序 Step:

```text
Step 1 已确认 04 以 00/01/02/03 为事实输入,05/06 只作为后续承接参考。
```

## 3. SOP 问题回答

### 3.1 P0 必须定义哪些配置才能运行主链?

P0 必须定义能让 Conversation truth center 默认可验证路径跑通的配置控制面。这里的“运行主链”不是生产部署全集,而是实现者和测试方案可以用同一套配置语义启动 api / worker / jobs,构造 repository、resolver、publisher、handoff 和 job runner,验证 truth 写入、query、outbox、projection、snapshot refresh、handoff 和 report 行为。

| P0 配置控制面 | 必须回答的问题 | 支撑的主链 |
|---|---|---|
| runtime bootstrap | 配置从哪里读取,以什么 profile 构造 conversation runtime | api / worker / jobs 启动 |
| storage | truth、projection、snapshot、outbox、idempotency 使用什么 store profile | command、query、projection、outbox、idempotency |
| api intake | command / query 入口如何装配 metadata、auth adapter 和 error mapping | synchronous command / query |
| worker event sources | inbound event source 如何启用、禁用、fake 或配置 | source event consumer |
| outbox publisher | event collaboration 如何发布、重试、失败和 fake 标记 | outbound event / change available |
| actor / external fact resolver | actor display、source fact safe snapshot 如何解析或降级 | participant、manifestation、snapshot refresh |
| trace / archive handoff | handoff adapter 如何装配、重试和失败 | trace handoff / archive handoff |
| jobs | batch、retry、timeout、job run id、report output 如何配置 | outbox publish、projection rebuild、snapshot refresh、handoff、validation、cleanup |
| retention | idempotency window、trace retention policy 如何配置 | 幂等、trace / archive |
| projection features | read model、search、cursor、projection rebuild 如何启用或降级 | authorized query / poll changes |
| reports output | artifacts / reports 根目录和 run output 如何配置 | test evidence、consistency report、redaction check |
| security redaction | forbidden body、secret、raw payload 防护如何保持不可关闭 | log、audit、event、handoff、report 安全边界 |

### 3.2 哪些配置属于 P1 / P2 或后续扩展?

| 能力 | 阶段 | 本轮处理口径 |
|---|---|---|
| durable database 产品字段全集 | P1 | P0 定义 store config 接缝和 in-memory 默认;真实 DB 字段后续由 adapter / 运维专项补齐 |
| production event bus endpoint matrix | P1 | P0 定义 publisher / event source ref、timeout、retry 和 fake marker;不写真实 topic endpoint 全集 |
| real identity / work / governance / artifact / runtime / bridge adapter 参数全集 | P1 | P0 定义 resolver / event source 接缝;真实 adapter 字段后续接入 |
| observability / archive production handoff 参数全集 | P1 | P0 定义 handoff config 和 fake adapter;生产 endpoint / credential 后续补齐 |
| secret provider / KMS 产品接入 | P1 | P0 只允许 secret / credential ref,不写 raw secret |
| remote config / config center | P2 | P0 以 code defaults + JSON file + env override 为主 |
| live reload / hot config | P2 | P0 默认启动加载 / 冷更新;热更新后续专项 |
| auto repair consistency job | P2 或重新设计 | 当前 consistency validation 只允许 diagnostic / report,不允许配置开启自动修复 truth |
| production dashboard / alert thresholds | 运维 | `04` 只给配置错误和 degraded state 输入,不写告警阈值 |

### 3.3 哪些配置细节应留给部署与运维手册?

| 留给部署与运维手册的内容 | 本轮配置设计只做到 |
|---|---|
| 真实生产 endpoint、域名、网络策略、证书挂载 | 定义 endpoint ref、transport profile、credential ref 和 timeout / retry 语义 |
| 容器启动命令、systemd、docker compose、Kubernetes manifest | 定义启动 profile、配置文件语义和运行入口所需参数 |
| DB / MQ / object store 产品选型参数全集 | 定义 store / publisher / event source / report root 接缝 |
| secret provider 真实接入参数和轮换操作 | 定义只允许 secret / credential ref,不允许 raw secret |
| 生产告警阈值、dashboard 布局和值班 playbook | 定义配置错误、unresolved、stale、failed、retry pending 等可观察失败模式 |
| 各环境真实配置文件填写值 | 定义配置项表、demo 和 profile 矩阵,不写真实生产值 |

### 3.4 哪些配置细节应留给实施计划?

| 留给 `07-实施计划.md` 的内容 | 本轮配置设计只做到 |
|---|---|
| 先实现哪个 config struct / loader / validator / builder | 定义配置项、来源、校验和生效机制 |
| 哪个 commit boundary 实现 store / resolver / publisher / handoff / jobs 配置 | 定义配置控制面和关联模块 |
| 目标仓目录、package、path dependency、git config 检查 | 定义配置语义,不写开发步骤 |
| 测试脚本、报告目录和 CI gate 执行顺序 | 定义配置矩阵和配置失败模式,交给测试 / 实施承接 |
| 真实相邻仓 adapter 接入顺序 | 定义 fake / configured adapter 口径,不安排编码顺序 |

### 3.5 哪些非范围仍有残余风险?

| 非范围 | 残余风险 | 当前处理方式 |
|---|---|---|
| production DB / MQ / endpoint matrix | P1 接入时可能补充 store / endpoint / credential / timeout 字段 | 在 §14 风险记录;P0 只保留接缝和 profile |
| real source adapter 参数全集 | 后续真实 identity / work / governance / artifact / runtime / bridge adapter 可能需要字段扩展 | P0 以 fake / fixture 和 unresolved-capable adapter 推进 |
| secret provider / KMS 产品接入 | 后续如果需要真实 secret provider,字段可能扩展 | P0 只允许 `CredentialRef` / `SecretRef`,禁止 raw token |
| remote config / hot reload | 后续若引入会影响 loader / validator 生命周期 | P0 先按启动加载 / 冷更新处理 |
| consistency auto repair | 若未来需要自动修复 truth,会突破当前只诊断口径 | 当前禁止通过配置开启,必须回退设计 |
| 当前旧 `05/06` | 测试验收可能继续沿用旧对象或旧配置矩阵 | 配置完成后必须重校准 `05/06` |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L1-conversation/04-配置设计.md` | 文件不存在,也没有范围声明 | 后续实现者可能把 JSON schema、部署命令、测试脚本和配置项全集混在一起 |
| `03-详细设计.md` §13 | 已列配置绑定点,但没有说明哪些属于 P0、哪些只是后续接缝 | 容易误以为 production DB / MQ / endpoint / KMS 字段必须一次完成 |
| `02-概要设计.md` §11 | 已识别配置影响,但不定义配置范围 | 需要本步承接为 `04` 的目标、范围和非范围 |
| `01-架构设计.md` | 已说明配置不得绕过核心边界 | 需要转译成配置设计非范围和禁止配置化输入 |
| 当前 `05/06` | 尚未按新版配置控制面重校准 | 本轮不能让旧测试验收口径反向污染配置范围 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计目标 | 只有详细设计中的配置绑定点 | 明确 `04` 要形成 runtime、store、api、worker、resolver、publisher、handoff、job、report 和 redaction 的配置控制面 | 配置不是代码字段列表,而是跨下游文档的控制面 |
| P0 配置范围 | 未区分默认可验证路径与生产配置 | P0 聚焦 local / CI / fake / in-memory 默认路径和稳定配置接缝 | 避免把生产 DB、MQ、endpoint 和 KMS 提前写死 |
| P1/P2 配置 | 散落在架构取舍和详细设计风险中 | 明确 production endpoint、durable adapter、secret provider、remote config、hot reload 后移 | 防止范围膨胀 |
| 文档边界 | 配置、部署、测试、实施可能混写 | 部署命令、真实环境值、测试用例、commit boundary 均不在 `04` 本步展开 | 保持 `04` 只做配置语义和控制面 |
| 下游承接 | `05/06` 尚未按新版配置控制面重校准 | `05/06` 只作方向参考,后续承接 `04` 重新校准 | 防止旧对象口径回流 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把生产 DB、MQ、endpoint、KMS 和运维参数一次设计完整 | 看似完整,后续生产化可直接填写 | 会虚构未定字段,并把 P0 扩大成部署运维项目 | 不采用 |
| 方案 B: P0 只定义默认可验证路径和稳定配置接缝,P1/P2 只记录扩展口径 | 能支撑近期实现,又不会阻塞后续生产接入和运维演进 | 后续生产化还需要补充具体字段 | 采用 |
| 方案 C: 只写“由实现决定配置” | 文档短,实现自由度高 | 会让不同 agent 自行发明 JSON、env、secret、profile 和 adapter 配置语义 | 不采用 |

推荐方案 B。

原因:

- `L1-conversation` 当前最需要的是可实现、可测试的 truth center default path,不是生产拓扑全集。
- 配置接缝必须稳定,否则后续真实 resolver、publisher、handoff、store 和 report 接入没有承接点。
- 具体生产值和运维操作在产品、部署和相邻仓真实 adapter 未收稳前不应进入正式配置契约。

## 7. 结构化中间产物

### 7.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 定义 P0 默认可验证路径配置 | 让 api、worker、jobs 和 runtime builder 能在 local / CI / test 下启动 | `05` 可据此设计配置测试矩阵;`07` 可据此安排 config loader 和 runtime builder 实现 |
| 定义配置控制面边界 | 明确哪些运行行为由配置控制,哪些 truth 和安全下限禁止配置化 | `06` 可据此设置配置红线验收 |
| 定义配置来源和 profile 口径 | 明确 code default、JSON file、env override、secret / credential ref 等来源如何生效 | 实现者不会临时发明配置覆盖顺序 |
| 定义敏感配置和 credential ref 边界 | 防止 raw secret、raw token、外部正文和业务正文进入配置、状态、日志或证据 | 安全测试、验收和实施门禁可引用 |
| 定义配置加载、校验和失效策略 | 明确 loader、validator、builder 如何处理缺失、冲突、非法和不可达 | 实现者可以实现一致的 fail-fast / fail-closed / degraded 行为 |
| 定义下游承接关系 | 说明测试、验收、实施和运维如何使用配置设计 | 避免 `05/06/07/运维` 重复定义配置事实 |

### 7.2 范围 / 非范围表

| 类型 | 内容 | 本轮处理口径 |
|---|---|---|
| 范围 | runtime profile、config loader、config validator、runtime builder 配置语义 | 承接 `03`,说明来源、优先级、profile、校验和失败策略 |
| 范围 | storage、api、worker、outbox、resolver、handoff、jobs、retention、projection、reports、redaction | 定义 P0 local / fake / in-memory 默认路径和后续 production 接缝 |
| 范围 | local / CI / integration-like / production-like 配置矩阵 | 定义环境差异,不写真实生产值 |
| 范围 | security boundary / secret ref / credential ref / forbidden body 拒绝策略 | 定义敏感配置和禁止配置化边界 |
| 非范围 | 完整 production DB / MQ / endpoint / KMS 产品字段全集 | 后续生产 adapter、部署与运维专项 |
| 非范围 | 部署命令、容器挂载、Kubernetes manifest、值班 playbook | 部署与运维手册 |
| 非范围 | 完整测试用例、脚本、报告证据格式 | `05-测试方案.md` |
| 非范围 | 验收通过 / 不通过标准和一票否决清单 | `06-验收标准.md` |
| 非范围 | 实施批次、commit boundary、编码顺序和 git 规范 | `07-实施计划.md` |

### 7.3 P0 / P1 / P2 配置口径

| 阶段 | 配置口径 | 当前是否进入正式配置设计 |
|---|---|---|
| P0 | runtime、storage、api、worker、outbox、resolver、handoff、jobs、retention、projection、reports、security redaction 的默认可验证配置 | 是,必须完整说明 |
| P0-min | in-memory store、fake publisher、fake resolver、fake handoff、local reports、small batch、strict redaction | 是,必须说明默认配置和限制 |
| P1 | durable store、real event bus、real source resolver、real handoff endpoint、secret provider、production-like profile | 只保留接缝和风险,不写字段全集 |
| P2 | remote config、hot reload、full production runbook、auto repair consistency job、advanced observability dashboard | 不进入当前配置项清单,只在风险与演进中说明 |

### 7.4 配置设计范围图

#### 配置来源链图: L1-conversation 配置设计范围

```text
04 Configuration design scope
|
+-- In scope
|   +-- P0 runtime config semantics
|   +-- source priority and profile matrix
|   +-- module-level JSON demos and config item table
|   +-- secret / credential ref and forbidden boundary rules
|   +-- load / validate / apply / fail behavior
|   +-- downstream handoff to 05 / 06 / 07 / operations
|
+-- Explicitly out of scope
    +-- production DB / MQ / endpoint / KMS full product fields
    +-- deployment commands and operations runbook
    +-- test cases and acceptance gates
    +-- commit boundaries and implementation schedule
```

关键说明:

- 本图表达 `04` 的职责边界,不表达代码调用流。
- P0 需要可运行配置语义,但不需要生产产品字段全集。
- P1/P2 只保留配置接缝和风险,不能写成当前必须实现项。
- 下游文档承接 `04` 的配置事实,不重复定义配置契约。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 P0 配置聚焦默认可验证路径,production DB / MQ / endpoint / KMS 字段全集后移 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 配置聚焦默认可验证路径,production DB / MQ / endpoint / KMS 字段全集后移 | 否 | 与 `03` §13 / §17 的配置后续工作和风险口径一致 | 无 | 无回写 |
| 本步不新增 ConversationRuntimeConfig 字段、不改变 adapter trait、不新增 ConfigError 枚举值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

```text
如果 Step 7 配置项清单发现 `03` §13 的配置绑定点不足以表达必要字段,必须在 Step 14 进入详细设计回写清单。
当前 Step 2 只裁剪范围,不改变代码契约。
```

## 9. 回填草稿

正式 `04-配置设计.md` §2 建议采用以下结构:

```text
2. 本次配置设计目标与范围
  2.1 配置设计目标
  2.2 范围 / 非范围
  2.3 P0 / P1 / P2 配置口径
  2.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §2.1 | `design-calibration/04_config_step_02_scope.md` §7.1 |
| §2.2 | `design-calibration/04_config_step_02_scope.md` §7.2 |
| §2.3 | `design-calibration/04_config_step_02_scope.md` §7.3 |
| §2.4 | `design-calibration/04_config_step_02_scope.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续 Step 必须继续收口:

- P0-min 默认是否固定为 in-memory store、fake publisher、fake resolver、fake handoff。
- local / CI / integration-like / production-like profile 是否足以覆盖配置矩阵。
- production-like 是否只保留接缝,不写真实生产字段全集。
- Step 7 是否需要回写 `03` 的配置绑定点。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置范围已收稳 | 通过 | §7.2 明确范围 / 非范围 |
| P0 / P1 / P2 口径已收稳 | 通过 | §7.3 |
| 非范围已有去向 | 通过 | §3.3 / §3.4 / §7.2 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 3 | 通过 | 下一步建立配置控制面总览 |
