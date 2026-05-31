# Step 2. 明确配置设计目标、范围和非范围

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 2 中间产物。
> 本步只定义本轮配置设计要覆盖哪些配置控制面、P0 / P1 / P2 配置口径和非范围。
> 本步不列完整配置项清单,不写 JSON 示例,不创建正式 `04-配置设计.md`,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-sdk/04-配置设计.md` §2 本次配置设计目标与范围

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已确认配置设计以新版 `00/01/02/03` 为主输入,当前 `05/06` 只作下游承接参考 | 作为本步范围裁剪的直接前提 |
| `00-需求文档.md` §2 / §4 / §6 / §7 | 官方三语言客户端接入层、目标 / 非目标、依赖、核心能力闭环和 P0 本地可验证路径 | 确定配置设计必须服务 SDK runtime、三语言 package candidate、fake / formal boundary 和安全默认 |
| `01-架构设计.md` §3 / §4 / §5 / §13 | 架构约束、职责边界、系统上下文和演进取舍 | 确定配置不能把 SDK 扩展为 gateway、auth、bus runtime、服务端聚合层或公共 registry 运营仓 |
| `02-概要设计.md` §3 / §11 | 配置影响轮廓、禁止配置化边界、配置不得绕开主线边界 | 确定配置设计目标必须覆盖 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs |
| `03-详细设计.md` §2 / §13 / §17 | 详细设计范围、`SdkRuntimeConfig` 绑定点、配置禁止项和 `04` 缺失风险 | 固定 P0 必须覆盖的配置入口、默认值口径、外部依赖绑定和后续回写门禁 |

已确认结论:

```text
本轮配置设计必须覆盖 L0-sdk P0 默认可验证路径的配置控制面:
runtime bootstrap -> source refresh -> boundary call -> package candidate -> validation evidence -> compatibility / stable gate。

本轮配置设计必须为 store、sources、boundaries、runners、artifacts、outbox、projections、language_packages、policies、cli 和 jobs 提供配置说明。

本轮不设计公共 registry 正式发布、生产 endpoint 矩阵、完整服务覆盖、部署命令、运维 runbook、测试用例全集或实施 commit boundary。
```

依赖的前序 Step:

```text
Step 1 已确认 04 以 00/01/02/03 为事实输入,05/06 只作为后续承接参考。
```

## 3. SOP 问题回答

### 3.1 P0 必须定义哪些配置才能运行主链?

P0 必须定义能让 SDK 默认可验证路径跑通的配置控制面。这里的“运行主链”不是生产部署全集,而是实现者和测试方案可以用同一套配置语义启动 CLI / jobs / runtime builder、读取上游 source、接入 fake / formal boundary、生成三语言 candidate、运行 smoke / docs / compatibility / boundary 验证并形成 evidence。

| P0 配置控制面 | 必须回答的问题 | 支撑的主链 |
|---|---|---|
| runtime bootstrap | 配置从哪里读取,以什么 profile 构造 `SdkRuntimeHandle` | CLI / jobs / client facade 启动 |
| store | SDK truth、idempotency、repository、projection 使用什么 store profile | derived view、candidate、evidence、compatibility |
| sources | core / bus / formal API snapshot 从哪里读取,如何判断 freshness | source refresh、derived binding view |
| boundaries | formal API、fake / fixture、bus event boundary 如何选择和标记 | service call、event client、boundary verification |
| runners | generator、package builder、smoke、docs、compatibility、boundary verifier 如何运行 | candidate build、validation evidence |
| artifacts | package artifact、evidence artifact 和 report ref 写到哪里 | candidate artifact、evidence chain |
| outbox | SDK outbound event 或 report event 如何暂存 / 发布 | candidate generated、evidence recorded、compatibility decision |
| projections | read model、query、projection rebuild 使用什么 profile | query、status view、report view |
| language packages | Rust / Python / TypeScript 是否启用,如何选择 package profile | 三语言 package candidate |
| policies | redaction、credential、trace、error mapping、fake marker 和 boundary guard 如何配置 | 安全下限、横切默认 |
| cli / jobs | config path、profile、run id、target、batch 和 artifact root 如何进入入口 | operations job、local / CI gate |

这些配置必须能支撑 P0 default verifiable path,但不要求一次覆盖公共 registry、生产 endpoint、真实认证网关、全量服务 API 或完整运维配置。

### 3.2 哪些配置属于 P1 / P2 或后续扩展?

| 能力 | 阶段 | 本轮处理口径 |
|---|---|---|
| production formal API endpoint matrix | P1 | 只保留 endpoint ref / transport profile / credential ref 接缝,不写生产地址全集 |
| public registry publish profile | P1 | 只说明 `Stable` 不等于发布;公共发包配置后移到发布专项 |
| real package manager credentials | P1 | P0 只允许 `CredentialRef`;不写 npm / PyPI / crates.io token 字段 |
| richer service client coverage | P1/P2 | 通过 formal API source 和 capability support 逐步纳入,不阻塞 P0 |
| remote config / config center | P1/P2 | 默认 P0 以 code defaults + JSON file + env override + secret ref 为主 |
| live reload / hot config | P2 | P0 默认启动加载 / 冷更新;热更新后续专项 |
| local cache / offline mode | P2 | 不进入当前配置范围,避免把 SDK 扩展成本地 runtime 状态系统 |
| MCP / REST / GraphQL / REPL gateway | P2 | 当前非 P0,不写配置项 |
| production observability dashboard | 运维 / observability | `04` 只给日志、audit、metric marker 和配置门禁输入 |

### 3.3 哪些配置细节应留给部署与运维手册?

| 留给部署与运维手册的内容 | 本轮配置设计只做到 |
|---|---|
| 真实生产 endpoint、域名、网络策略、证书挂载 | 定义 endpoint ref、transport profile、credential ref |
| 容器启动命令、systemd、docker compose、Kubernetes manifest | 定义启动 profile 和配置文件语义 |
| registry 发布命令、回滚命令、平台账号操作 | 定义候选包和发布配置边界,不写发布操作 |
| secret provider 真实接入参数和轮换操作 | 定义只允许 secret / credential ref,不允许 raw secret |
| 生产告警阈值、dashboard 布局和值班 playbook | 定义配置错误、boundary unavailable、projection stale 等可观察失败模式 |
| 各环境真实配置文件填写值 | 定义配置项表、demo 和 profile 矩阵,不写真实生产值 |

### 3.4 哪些配置细节应留给实施计划?

| 留给 `07-实施计划.md` 的内容 | 本轮配置设计只做到 |
|---|---|
| 先实现哪个 config struct / loader / validator / builder | 定义配置项、来源、校验和生效机制 |
| 哪个 commit boundary 实现 source / boundary / runner / artifact 配置 | 定义配置控制面和关联模块 |
| 目标仓目录、package、path dependency、git config 检查 | 定义配置语义,不写开发步骤 |
| 测试脚本、报告目录和 CI gate 执行顺序 | 定义配置矩阵和配置失败模式,交给测试 / 实施承接 |
| Python / TypeScript 工具链真实落地顺序 | 定义 package profile 和 runner profile,不安排编码顺序 |

### 3.5 哪些非范围仍有残余风险?

| 非范围 | 残余风险 | 当前处理方式 |
|---|---|---|
| production endpoint matrix | P1 接入时可能补充 endpoint / credential / timeout 字段 | 在 §14 风险记录;P0 只保留 endpoint ref 和 profile 接缝 |
| public registry 发布配置 | 发布专项可能影响 package profile 和 credential ref | 当前 `Stable` 只表示 SDK 本地稳定基线,不等于 public publish |
|真实 package manager token | 后续如果需要真实发布,secret provider 字段可能扩展 | P0 只允许 `CredentialRef`,禁止 raw token |
| full service client coverage | 服务 API 数量扩展会增加 source / boundary profile | P0 先覆盖最小 formal / fake boundary,能力缺失标记 pending / unsupported |
| remote config / hot reload | 后续若引入会影响 loader / validator 生命周期 | P0 先按启动加载 / 冷更新处理 |
| 当前旧 `05/06` | 测试验收可能继续沿用旧对象或旧配置矩阵 | 配置完成后必须重校准 `05/06` |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-sdk/04-配置设计.md` | 文件不存在,也没有范围声明 | 后续实现者可能把 JSON schema、发布配置、部署命令、测试脚本和配置项全集混在一起 |
| `03-详细设计.md` §13 | 已列 `SdkRuntimeConfig` 配置组,但没有说明哪些属于 P0、哪些只是后续接缝 | 容易误以为 public registry、生产 endpoint、真实 package token 和全量服务覆盖都必须一次完成 |
| `02-概要设计.md` §11 | 已识别配置影响,但不定义配置范围 | 需要本步承接为 `04` 的目标、范围和非范围 |
| `01-架构设计.md` §3 / §13 | 已说明公共 registry、完整 MCP / REST / GraphQL、REPL、本地缓存等后移 | 需要转译成配置设计非范围 |
| 当前 `05/06` | 尚未按新版配置控制面重校准 | 本轮不能让旧测试验收口径反向污染配置范围 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计目标 | 只有详细设计中的配置绑定点 | 明确 `04` 要形成 SDK runtime、三语言 candidate、验证证据、安全下限和下游承接的配置控制面 | 配置不是代码字段列表,而是跨下游文档的控制面 |
| P0 配置范围 | 未区分 default path 与生产 / 发布配置 | P0 聚焦 local / CI / fake / fixture 默认可验证路径和稳定配置接缝 | 避免把 public registry、生产 endpoint 和全量服务覆盖提前写死 |
| P1/P2 配置 | 散落在架构取舍和详细设计风险中 | 明确 production endpoint、public publish、remote config、hot reload、offline mode、gateway 类增强后移 | 防止范围膨胀 |
| 文档边界 | 配置、部署、测试、实施可能混写 | 部署命令、真实环境值、测试用例、commit boundary 均不在 `04` 本步展开 | 保持 `04` 只做配置语义和控制面 |
| 下游承接 | `05/06` 尚未按新版配置控制面重校准 | `05/06` 只作方向参考,后续承接 `04` 重新校准 | 防止旧对象口径回流 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把生产 endpoint、公共 registry 和全量服务配置一次设计完整 | 看似完整,后续发布和运维字段可直接填写 | 会虚构未定字段,并把 SDK P0 扩大成发布运营和服务覆盖项目 | 不采用 |
| 方案 B：P0 只定义默认可验证路径和稳定配置接缝,P1/P2 只记录扩展口径 | 能支撑近期实现,又不会阻塞后续生产接入和公共发布演进 | 后续生产化和发布专项还需要补充具体字段 | 采用 |
| 方案 C：只写“由实现决定配置” | 文档短,实现自由度高 | 会让不同 agent 自行发明 JSON、env、secret、profile 和 package 配置语义 | 不采用 |

推荐方案 B。

原因:

- `L0-sdk` 当前最需要的是可实现、可测试的 official client default path,不是生产 endpoint 和 public registry 全集。
- 配置接缝必须稳定,否则后续 formal API、package registry、secret provider 和 runner 接入没有承接点。
- 具体生产值和发布操作在产品、部署和发布决策未收稳前不应进入正式配置契约。

## 7. 结构化中间产物

### 7.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 定义 P0 默认可验证路径配置 | 让 runtime builder、source、boundary、runner、artifact、outbox、projection 和 policy 能在 local / CI / test 下启动 | `05` 可据此设计配置测试矩阵;`07` 可据此安排 config loader 和 runtime builder 实现 |
| 定义配置控制面边界 | 明确哪些运行行为由配置控制,哪些 SDK truth 和安全下限禁止配置化 | `06` 可据此设置配置红线验收 |
| 定义配置来源和 profile 口径 | 明确 code default、JSON file、env override、secret / credential ref 等来源如何生效 | 实现者不会临时发明配置覆盖顺序 |
| 定义敏感配置和 credential ref 边界 | 防止 raw secret、raw token、生产请求响应正文和业务正文进入配置、状态、日志或证据 | 安全测试、验收和实施门禁可引用 |
| 定义配置加载、校验和失效策略 | 明确 loader、validator、builder 如何处理缺失、冲突、非法和不可达 | 实现者可以实现一致的 fail-fast / fail-closed 行为 |
| 定义下游承接关系 | 说明测试、验收、实施和运维如何使用配置设计 | 避免 `05/06/07/09` 重复定义配置事实 |

### 7.2 范围 / 非范围表

| 类型 | 内容 | 本轮处理口径 |
|---|---|---|
| 范围 | `SdkRuntimeConfig` 和子 config 的配置语义 | 承接 03,说明来源、优先级、profile、校验和失败策略 |
| 范围 | source / boundary / runner / artifact / outbox / projection / policy adapter profile | 定义 P0 local / fake 默认路径和后续 production 接缝 |
| 范围 | Rust / Python / TypeScript language package profile | 定义 P0 三语言 candidate 配置,不写公共发布 token |
| 范围 | CLI / jobs 启动与运行 profile | 定义 config path、profile、run id、target、artifact root、report root 等控制面 |
| 范围 | security boundary / secret ref / credential ref / forbidden body 拒绝策略 | 定义敏感配置和禁止配置化边界 |
| 范围 | local / CI / test / integration / production-like 配置矩阵 | 定义环境差异,不写真实生产值 |
| 非范围 | 完整 production endpoint / registry / KMS / config center 产品字段全集 | 后续生产 adapter、发布专项或运维专项 |
| 非范围 | 部署命令、容器挂载、Kubernetes manifest、值班 playbook | 部署与运维手册 |
| 非范围 | 完整测试用例、脚本、报告证据格式 | `05-测试方案.md` |
| 非范围 | 验收通过 / 不通过标准和一票否决清单 | `06-验收标准.md` |
| 非范围 | 实施批次、commit boundary、编码顺序和 git 规范 | `07-实施计划.md` |

### 7.3 P0 / P1 / P2 配置口径

| 阶段 | 配置口径 | 当前是否进入正式配置设计 |
|---|---|---|
| P0 | runtime bootstrap、store、sources、boundaries、runners、artifacts、outbox、projections、language packages、policies、cli、jobs 的默认可验证配置 | 是,必须完整说明 |
| P0-min | local sibling repo、fixture source、fake boundary、local runner、filesystem artifact、in-memory / local store | 是,必须说明默认配置和限制 |
| P1 | production formal API endpoint、package registry 发布 profile、real credential provider、首批真实服务 client coverage | 只保留接缝和风险,不写字段全集 |
| P2 | remote config、hot reload、offline cache、MCP / REST / GraphQL / REPL gateway、完整 ops runbook | 不进入当前配置项清单,只在风险与演进中说明 |

### 7.4 配置设计范围图

#### 配置来源链图: L0-sdk 配置设计范围

```text
04 Configuration design scope
|
+-- In scope
|   +-- P0 runtime config semantics
|   +-- source priority and profile matrix
|   +-- module-level JSON demos and config item table
|   +-- secret / credential ref and forbidden boundary rules
|   +-- load / validate / apply / fail behavior
|   +-- downstream handoff to 05 / 06 / 07 / 09
|
+-- Explicitly out of scope
    +-- production endpoint / registry / KMS full product fields
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
| Step 2 只定义配置设计目标、范围、非范围和 P0 / P1 / P2 口径 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 配置聚焦默认可验证路径,production endpoint 和 public registry 字段全集后移 | 否 | 与 `03` §2 / §13 / §17 的 P0 口径一致 | 无 | 无回写 |
| 本步不新增 `SdkRuntimeConfig` 字段、不改变子 config 结构、不新增 `ConfigError` 枚举值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

- 本步没有改变 `03-详细设计.md` 中的配置绑定点。
- Step 7 若基于配置项清单发现 `SdkRuntimeConfig` 字段缺失,再进入详细设计回写清单。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §2。

```md
## 2. 本次配置设计目标与范围

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置设计目标表”“范围 / 非范围表”“P0 / P1 / P2 配置口径”和“对详细设计的影响判定”小节，了解本章范围如何从 P0 主链和详细设计绑定点收敛而来。

本次配置设计的目标，是把 `03-详细设计.md` 中已经定义的配置绑定点整理成可填写、可校验、可测试、可验收、可实施和可运维承接的配置控制面。

本轮 P0 覆盖 `L0-sdk` 默认可验证路径所需配置：runtime bootstrap、store、sources、boundaries、runners、artifacts、outbox、projections、language packages、policies、cli 和 jobs。配置设计必须说明这些配置的来源、优先级、profile、默认口径、校验、生效和失败策略。

P1 覆盖 production formal API endpoint、package registry 发布 profile、real credential provider 和首批真实服务 client coverage。P1 可以在本配置设计中作为接缝、风险或待确认事项出现,但不得成为 P0 开发前置。

P2 覆盖 remote config、hot reload、offline cache、MCP / REST / GraphQL / REPL gateway 和完整 ops runbook。这些内容不进入本轮 P0 正式范围。

本配置设计不写部署命令、运维 runbook、公共 registry 发布操作、生产 endpoint 真实值、完整测试用例、验收裁决、实施批次、commit boundary 或 Rust 代码契约变更。如果配置设计结论需要改变 `SdkRuntimeConfig`、runtime builder、adapter、trait、error 或函数流,必须先回写 `03-详细设计.md`。
```

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受 P0 只覆盖 local / CI / fake / fixture 默认可验证路径和稳定配置接缝 | A. 接受;B. 把 production endpoint 也纳入 P0;C. 等实施阶段决定 | 推荐 A | 这与需求、架构和详细设计的当前 P0 口径一致,避免虚构生产字段 |
| 是否接受 public registry 发布配置后移到 P1 / 发布专项 | A. 接受;B. 作为 P0 配置项;C. 删除相关接缝 | 推荐 A | `Stable` 不等于 public publish,但后续发布需要保留配置接缝 |
| 是否接受本步不回写 `03-详细设计.md` | A. 接受;B. 先扩写 `03` 配置章节;C. 等 Step 7 后再判断 | 推荐 A | Step 2 只定义范围,没有改变代码契约 |

## 11. 进入下一步条件

- [x] 用户确认 P0 / P1 / P2 配置范围。
- [x] 用户确认非范围去向清楚。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 2 状态从 `[~]` 更新为 `[x]`。
