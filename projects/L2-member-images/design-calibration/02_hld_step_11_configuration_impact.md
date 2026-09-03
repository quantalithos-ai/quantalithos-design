# L2-member-images 02 概要 Step 11: 配置影响轮廓

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 11 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 12 文件；不定义配置键、默认值、JSON / YAML、环境变量、secret 名称或加载实现

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 主体框架、Step 5 组成部分、Step 7 接口、Step 8 流、Step 9 状态、Step 10 异常与正式 01 横切 / dependency 边界 |
| 规范 | 已读取概要设计 SOP Step 11 与书写规范 §4.11 |
| 本步目标 | 识别配置对入口、adapter、job、projection 和受控策略参数的影响，列出禁止配置化边界，并交接 03 / 04 |
| 本步禁止 | 配置项全集、默认值、优先级实现、动态热更新、密钥系统、部署挂载、把配置变更当 owner / gate 事实 |

## 1. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `DefinitionAssembly` 的 source / reference intake | 是 | source selection、reference freshness policy、受控 profile | 03 定义 source-resolution contract、validator 与 builder 注入关系；04 定义来源、优先级和校验表达 |
| `DefinitionAssembly` 的必要输入集合 | 间接受影响 | scope / applicable-input policy（由正式 authority 约束） | 03 定义 `RequiredInputPolicy` 解析与版本语境；04 说明可配置项边界，不能降低必要 pin |
| `BuildCandidate` 的 builder / registry adapter | 是 | adapter binding、external endpoint ref、受控 timeout / retry category | 03 定义 `AdapterConfig`、outcome mapping 与 unknown 语义；04 定义实际绑定方式，不锁产品 |
| `BuildCandidate` 的 nightly / background job | 是 | job enablement、schedule profile、batch / concurrency category | 03 定义 `JobConfig` 与 runtime builder 注入；04 定义填写与校验，不把调度值写入 domain truth |
| `Qualification` 的 evidence / gate seam | 间接受影响 | authority-driven gate applicability、adapter binding、safe-conclusion source | 03 定义 `EvidenceAdapterConfig` / validation boundary；04 只承接正式 policy 允许的配置，不枚举未裁定 gate |
| `Qualification` 的 Artifact handoff | 是 | handoff endpoint / carrier binding、contract profile | 03 定义 `ArtifactHandoffConfig` 方向；04 等 MI-UP-007 / owner contract 后再具体化 |
| `SupplyEntry` 的 Member Service supply seam | 是 | consumer endpoint / ref resolver binding、contract profile | 03 定义 `SupplyAdapterConfig` 与 blocked fallback；04 不得通过配置绕过 MI-UP-001 |
| `ReferenceDerived` 的 projection / refresh | 是 | projection selection、refresh / rebuild profile、retention category（不写数字） | 03 定义 projection builder / freshness contract；04 定义 profile 和校验，不允许 projection writeback |
| `ReferenceDerived` 的 gap classification | 间接受影响 | display / query filtering profile、owner / lane filter | 03 定义 gap view contract；04 不得隐藏 blocked / unavailable 或改变 gap owner |
| 运行承载角色的 adapter / job 装配 | 是 | runtime builder composition、carrier availability、profile | 03 定义组装注入关系；04 定义承载配置；不由配置决定语义 owner 或部署拓扑事实 |

## 2. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| RoleDefinition / Role -> variant mapping owner | mapping truth 必须由 Method Library 唯一拥有 | 先回到上游 owner / 01 边界，再重开 02 受影响 Step |
| `ImageVariantDefinition`、`VariantRevision` 的 identity 与 history 语义 | 配置不能制造第二 truth 或覆盖历史 | 02 Step 5 / 6 与架构变更门禁 |
| 必要 input pin、immutable entry、禁 `latest` / mutable selector | 供应链可追溯和可复现是结构红线 | 01 ADR / 02 Step 3，不能由 04 开关放宽 |
| static / live、secret / memory / checkpoint / workspace body 禁区 | 防止镜像成为运行态或安全正文 owner | 00 / 01 owner boundary；不能配置化 |
| candidate / eligibility / availability / Artifact / consumer 分域 | 防止单一 ready 或跨 owner takeover | 01 ADR / 02 Step 3 / 9 |
| applicable gate fail-closed 与 unknown 语义 | 缺失或未知不能默认 pass | 正式 policy / 01 decision；不由 config profile 改变 |
| history append / supersede / explicit transition | 审计与 rollback 需要不可覆盖 | 01 ADR / 02 Step 9 / 03 consistency |
| projection read-only、可重建、freshness 显式 | 派生不能成为第二 truth | 02 Step 3 / 6 / 9；配置只能选择重建 profile |
| compile / runtime / event / ref / adapter / fake seam 权限 | 物理装配或配置不能创造源码依赖 | 全局依赖裁剪规则 / 01 Step 7 |
| conditional event / outbound event authority | 配置不能把未获 authority 的事件启用为 current capability | MI-UP-005 / MI-UP-009 关闭后重开范围与接口 Step |
| owner / actor / contract confirmation truth | 本仓配置不能替代相邻 owner 的审批、release、consumer confirmation | 对应 owner 正式合同与 02 pending 门禁 |

## 3. 配置影响轮廓图

```text
Configuration sources / profiles
              │ validated and authority-bounded
              v
     +--------------------------+
     | Inbound / Application     |
     | source selection, adapter |
     | binding, job composition  |
     +------------+-------------+
                  v
     +--------------------------+
     | Ports / Operations        |
     | builder, evidence,        |
     | Artifact, consumer,       |
     | projection refresh       |
     +------------+-------------+
                  v
     +--------------------------+
     | Domain decisions          |
     | unchanged owner, pin,     |
     | gate, history, state      |
     | redlines                  |
     +--------------------------+
```

关键说明：

- 配置只影响来源选择、adapter / job 装配和受控运行 profile；domain invariant、owner、pin、gate、history 与 state redline 不随配置变化。
- 配置生效若改变核心判断，必须形成新的 revision / evaluation / transition 语境，不能静默改写现有 truth。
- 图不表达配置加载实现、JSON 示例、secret 系统、部署挂载或热更新流程。

## 4. 配置影响的实现承接方向

| 实现契约方向 | 本概要已收稳什么 | 03 继续展开 | 04 继续说明 |
|---|---|---|---|
| `RuntimeConfig` / profile boundary | 配置只能进入入口、application、ports / jobs / projection 装配 | 字段分组、类型骨架、注入边界、变更语境 | key / source / default / validation / profile |
| `ConfigLoader` / `ConfigValidator` | 配置不得旁路 fail-closed 与 owner | 加载错误类别、校验顺序、不可用行为 | 来源优先级、填写规则、敏感值引用 |
| `AdapterConfig` | product-neutral adapter 可配置绑定，但不改领域语义 | builder / registry / evidence / Artifact / consumer port 注入 | 产品 / endpoint / credential ref 在 authority 后落定 |
| `JobConfig` | nightly、refresh、rebuild、reconcile 是延后承载 | job builder、触发上下文、失败与恢复接口 | schedule / batch / concurrency 的具体表达 |
| `ProjectionConfig` | projection 只读、freshness 可见 | view selection、rebuild contract、watermark | profile、重建触发与校验 |
| `ConfigError` / blocked result | 缺配置只能形成 blocked / unavailable，不默认补齐 | 错误映射与安全输出 | 用户填写错误和修复提示 |

## 5. 不在本步决定的配置问题

- 不决定语言 / framework、数据库、queue、registry、builder、scanner、signer、secret store、部署 topology 或热更新策略。
- 不决定 restricted / multi-arch / hardened-base / outbound event 等 future capability 的配置结构。
- 不把任何配置文件、环境变量、运行实例、credential、digest 或测试结果写成事实。

## 6. 完成审计与下一步门禁

| 检查项 | 结果 |
|---|---|
| 配置影响均回指前文已收稳的部分 / 接缝 | `pass` |
| 禁止配置化边界覆盖 owner、pin、gate、history、state、dependency、body-free | `pass` |
| 已区分 03 实现契约与 04 填写 / 校验契约 | `pass` |
| 未生成配置键、默认值、JSON、密钥或部署事实 | `pass` |
| 未把配置变更写成 readiness / release / approval | `pass` |
| 未读取旧正式 02、未创建 Step 12 文件 | `pass` |

正式第 11 章回填两张配置表、必要轮廓图与 03 / 04 承接说明；Step 12 只承接已收稳主语，不新增配置对象。

`gate_status = pass_stop_review`。Step 11 足以支撑 Step 12；下一动作是读取 Step 11 与 Step 12 规范并创建 `02_hld_step_12_detailed_design_handoff.md`。
