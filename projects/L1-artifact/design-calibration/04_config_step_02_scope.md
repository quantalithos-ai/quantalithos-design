# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节: `04-配置设计.md` §2 本次配置设计目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确配置设计目标、范围和非范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入映射;新版 `00/01/02/03`;旧 `05/06` 方向输入 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义本轮 `L1-artifact` 配置设计要覆盖哪些配置控制面,不覆盖哪些部署、产品、测试、验收或实施细节,并判断本仓是否存在“无配置”路径。

本 Step 只回答:

- 本轮配置设计的目标是什么。
- P0 必须定义哪些配置控制面才能支撑 Artifact truth 主链和本地 fake / in-memory 闭环。
- 哪些配置属于 P1 产品化或 P2 后续增强。
- 哪些内容明确不是配置设计范围。
- 非范围残余风险如何进入后续 Step。
- 当前是否需要回写 `03-详细设计.md`。

本 Step 不定义具体配置项、默认值、环境变量、JSON 示例、secret 存储路径、来源优先级、环境矩阵、加载函数、校验规则、热更新策略、部署命令、真实产品选型或正式 `04` 正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供上游输入映射、配置必须回答 / 不再回答清单和初始候选配置域 |
| `03-详细设计.md` §13 | 已完成 | 提供 runtime config、adapter binding 和 external availability 绑定点 |
| `03-详细设计.md` §14 / §15 / §17 | 已完成 | 提供 forbidden body、redaction、配置测试切口和风险输入 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供配置引用表、config section 到代码绑定、外部依赖绑定和禁止配置化边界 |
| `03_ddd_step_18_risks_open_questions.md` | 已完成 | 提供配置、产品、目标实现仓和下游文档风险 |
| `02-概要设计.md` §11 / §13 | 已完成 | 提供配置影响轮廓、禁止配置化边界和待确认事项 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供概要层配置影响范围和禁止配置化边界细节 |
| `00-需求文档.md` / `01-架构设计.md` | 新版正式文档 | 提供 truth ownership、正文排除、依赖裁剪和产品中立红线 |
| `05-测试方案.md` / `06-验收标准.md` | 旧 / 待复核草案 | 只提供 test / staging / evidence 方向输入,不得覆盖新版 `03` |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链? | P0 必须覆盖 runtime profile、fake / in-memory store binding、adapter availability、boundary limits、idempotency / result store、inbound consumer fixture / schema allowlist、relay publisher fake topic map、operations job batch / deterministic runner、handoff target disabled / fake 口径、external resolver fake / unavailable 口径、observability / redaction 基础门禁和 deterministic clock / id generator。没有这些配置,实现仓无法装配 runtime、运行 command / query / consumer / job 测试、验证 duplicate replay、验证 forbidden body guard 或证明外围 adapter disabled 不阻断 core truth。 |
| 哪些配置属于 P1 / P2 或后续扩展? | P1 覆盖 durable DB / broker / projection / reference / relay store、real-like source resolver、real-like bus、metric sink、DLQ / diagnostic store、archive / observability / sync handoff target、external content source adapter、staging profile 和 adapter fake-to-real 迁移。P2 覆盖 multi-region、tenant profile、advanced capacity knobs、复杂 rate limit、vendor-specific export、深度 archive / observability / sync 集成、content integrity / hash / tamper 机制产品化和生产运维细粒度调优。 |
| 哪些配置细节应留给部署与运维手册? | 容器编排、挂载路径、secret provider 操作、证书安装、网络策略、实例拓扑、真实 endpoint 填写、告警面板、值班流程、发布命令和故障处置步骤留给部署与运维手册。配置设计只定义配置语义、来源、优先级、校验、生效、失效、审计和下游承接。 |
| 哪些配置细节应留给实施计划? | 配置落地顺序、phase / commit boundary、adapter 从 fake 切 durable 的实现批次、测试门禁嵌入、配置迁移提交、回滚提交策略、evidence 生成路径和实现仓交付纪律留给 `07-实施计划.md`。 |
| 哪些非范围仍有残余风险? | durable DB / broker / search / HTTP / metric / DLQ / diagnostic store / archive / observability / sync / external content source 产品未锁定会影响配置项默认值、secret 形态、失败策略和验收 evidence。旧 `05/06` 尚未按新版 `03/04` 复核会影响测试环境矩阵和验收门禁。若后续配置项要求新增 runtime config 字段、adapter constructor 参数、trait、error 或 flow,必须回写 `03` 或阻塞待确认。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 初始配置输入候选 | 只列出 runtime、store、consumer、publisher、handoff、observability 等候选域,未分层 | 本 Step 收敛为 P0 / P1 / P2 范围 |
| `03` §13 | 只固定代码绑定点和可用性语义,未定义完整配置范围 | 本 Step 将绑定点转成正式配置设计覆盖范围 |
| `03_ddd_step_14_config_external_binding.md` §8 | 已列大量 config section / binding item,但不应在 Step 2 直接变成配置项清单 | 本 Step 只把它们归类为控制面和优先级,Step 7 再逐项展开 |
| `03` §17 / Step 18 | durable 产品、目标仓、下游文档未锁定风险散落 | 本 Step 明确哪些属于配置范围,哪些属于实施 / ADR / 运维 / 下游文档 |
| `05/06` | 旧测试 / 验收可能含旧对象、旧 profile、旧 evidence 口径 | 本 Step 只保留环境方向,不继承旧配置矩阵 |
| 正式 `04` | 文件尚未装配 | 继续中间产物链,正式 `04` 等 Step 15 生成 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置范围 | 只有 Step 1 候选配置域 | 明确 P0 / P1 / P2 配置口径 | 支撑 Step 3 控制面和 Step 7 配置项清单 |
| 无配置判断 | Step 1 仅倾向于需要配置 | 明确本仓不是无配置项目 | `03` 已存在 runtime / adapter / store / consumer / publisher / handoff / redaction 绑定点 |
| 产品选型 | DB / bus / search / archive / observability 等作为风险散落 | 不在 Step 2 锁定,后续按 product-neutral / fake / disabled / 待确认处理 | 配置设计不替代 ADR 或实施计划 |
| 旧 `05/06` | 可能被误用为环境矩阵真相源 | 只作为方向输入,正式矩阵 Step 6 重建 | 避免旧对象和旧主线回流 |
| `03` 回写 | 尚未按配置范围判定 | 当前无回写;后续新增代码契约即阻塞 | 防止 `04` 静默扩展实现签名 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否判断为“无配置”项目 | A. 是;B. 否 | 采用 B。P0 至少需要 runtime、adapter、store、consumer、publisher、handoff、job、redaction 和 deterministic test profile 配置说明 |
| P0 是否锁定真实 durable 产品 | A. 锁定;B. 只定义 product-neutral seam 和 fake / in-memory baseline | 采用 B。上游未把 DB / broker / search / archive / observability 产品锁定为真相源 |
| 是否直接继承旧 `05/06` 环境矩阵 | A. 继承;B. 只保留方向,后续重建 | 采用 B。旧 `05/06` 需按新版 `03/04` 复核 |
| 是否把部署命令纳入配置设计范围 | A. 纳入;B. 留给部署运维 | 采用 B。配置设计不是部署手册 |
| 是否把实现阶段拆分写入配置设计 | A. 写入;B. 留给 `07` | 采用 B。phase / commit boundary 和 evidence 路径属于实施计划 |
| 是否允许配置扩大 truth 能力 | A. 允许;B. 禁止 | 采用 B。配置只能改变运行承载、节奏、可用性和外围接缝 |

## 8. 结构化中间产物

### 8.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳配置控制面 | 把 runtime、adapter、store、consumer、publisher、job、handoff、resolver、observability / redaction 从 `03` 绑定点转成配置控制面 | Step 3 配置控制面总览 |
| 收稳配置边界 | 明确允许配置化的运行承载与外围接缝,以及禁止配置化的 truth / body / state / query / consumer / job / handoff 红线 | Step 4 配置分类与禁止配置化边界 |
| 收稳来源优先级 | 定义 code default、config file、env override、secret ref、fixture / test override、runtime selected profile 的优先级和冲突处理 | Step 5 来源、优先级与冲突处理 |
| 收稳环境矩阵 | 重建 local / test / staging / production-like profile 的 fake、in-memory、disabled、degraded、durable 差异 | Step 6 环境、部署 profile 与配置矩阵 |
| 收稳配置项清单 | 给每个配置项类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块 | Step 7 配置项清单 |
| 收稳敏感配置 | 定义 DSN、token、cert、private key、endpoint secret、handoff credential 和 secret ref 的存储、读取、轮换、审计和禁止输出 | Step 8 敏感配置与密钥管理 |
| 收稳加载校验 | 定义 config loader / validator / runtime builder 绑定、cross-field validation、startup fail-fast 和 adapter disabled / degraded 生效时机 | Step 9 加载、校验与生效机制 |
| 收稳变更与失效 | 定义配置变更审计、回滚、fail-fast、disabled、degraded、unavailable、retry、DLQ / diagnostic 方向 | Step 10 / 11 变更审计与失效策略 |
| 收稳下游承接 | 为 `05/06/07/09` 提供配置矩阵、配置门禁、实施准备、运维输入和 evidence 方向 | Step 12 下游承接 |
| 收稳迁移与风险 | 明确旧配置名 / profile / adapter 口径迁移,以及产品未锁定和 P2 增强触发条件 | Step 13 / 14 演进与风险 |

### 8.2 本轮覆盖范围表

| 范围 | 必须覆盖的配置内容 | 后续 Step |
|---|---|---|
| runtime assembly | runtime mode、profile、validated config identity、adapter registry、availability surface | Step 3 / 4 / 7 / 9 / 11 |
| store binding | truth、projection、reference / mirror、relay、idempotency、stored result、report / handoff stores 的 fake / in-memory / durable binding | Step 3 / 5 / 7 / 9 / 11 |
| boundary limits | command body limit、page limit、query timeout、worker / job timeout、deterministic test limits | Step 4 / 7 / 9 / 11 |
| inbound consumer binding | consumer enablement、fixture / source binding、schema version allowlist、dedup retention、disabled behavior | Step 3 / 5 / 7 / 11 |
| outbound relay binding | topic-neutral key 到 transport route、publisher adapter、publish batch、retry class、disabled behavior | Step 3 / 5 / 7 / 11 |
| operations jobs | publish、rebuild、refresh、reconcile、handoff、export runner 的 schedule / trigger、batch、parallelism、retry、target availability | Step 3 / 6 / 7 / 11 |
| external resolver / mirror | work、process、governance、method-library、runtime、external content source 的 resolver / fixture / unavailable 口径 | Step 3 / 7 / 8 / 11 / 14 |
| handoff targets | archive、observability、sync handoff target set、receipt handling、disabled / fake / retryable failure | Step 3 / 7 / 8 / 11 / 12 |
| observability / redaction | safe log / metric / trace fields、forbidden body guard、diagnostic ref、redaction check 承接 | Step 4 / 7 / 8 / 9 / 12 |
| deterministic test profile | fake clock、fake id generator、fixture source、in-memory store、fake publisher、fake handoff target | Step 6 / 7 / 12 |
| sensitive config | DSN、token、cert、private key、endpoint secret、credential ref、transport credential | Step 8 |
| downstream handoff | 测试、验收、实施、部署运维如何引用配置设计 | Step 12 |

### 8.3 P0 / P1 / P2 配置口径

| 等级 | 配置口径 | 示例 | 是否本轮展开 |
|---|---|---|---|
| P0 | 支撑本地 / fake / in-memory 主链运行、contract / service / job 测试、duplicate replay、consumer / relay / handoff 基础闭环和 forbidden body guard | `local` profile、in-memory truth / projection / relay store、fake source resolver、fake publisher topic map、disabled or fake archive / observability / sync handoff、deterministic clock / id、redaction deny list | 是 |
| P1 | 支撑 staging / real-like adapter、durable store、real-like bus、metric / DLQ / diagnostic store、archive / observability / sync handoff 和 external content source fake-to-real 迁移 | durable store DSN ref、bus endpoint ref、metric sink ref、DLQ target ref、archive target ref、observability handoff credential ref、external content resolver endpoint ref | 本轮定义控制面、敏感分类和待确认;具体产品可挂起 |
| P2 | 支撑生产优化、多区域、多租户、复杂容量、advanced rate limit、vendor-specific export、content integrity / tamper 机制和深度下游集成 | tenant profile、regional endpoint、capacity knobs、vendor export schema、hash / content-addressing strategy、advanced search tuning | 只记录非范围 / 演进触发,不定义为 P0 配置项 |

### 8.4 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则、验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` |
| 详细设计对象、trait、DTO、flow、state、error 和 runtime builder 签名新增 | `03-详细设计.md` |
| 完整测试矩阵、测试数据、自动化脚本和 evidence 路径 | `05-测试方案.md` |
| phase / commit boundary、实现顺序、提交门禁和回退提交策略 | `07-实施计划.md` |
| 容器编排、挂载、secret provider 操作、证书安装、发布命令、告警面板和 runbook | 部署与运维手册 |
| 真实 DB / bus / search / metric / DLQ / archive / observability / sync / external content source 的供应商合同、容量 sizing 和成本评估 | ADR / 实施计划 / 运维 |
| multi-region、tenant profile、advanced capacity、vendor-specific export 和深度集成 | 后续版本 / ADR |

### 8.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 runtime / adapter 配置绑定点 | 是 | `03` §13 runtime config / adapter binding |
| 是否存在 store binding | 是 | Step 14 truth / projection / reference / relay / idempotency / result store binding |
| 是否存在 consumer / publisher / topic binding | 是 | Step 14 inbound event source binding、outbound topic / schema binding |
| 是否存在 job / handoff target binding | 是 | Step 14 jobs、archive / observability / sync handoff config |
| 是否存在 observability / redaction 配置边界 | 是 | `03` §14、Step 14 / Step 15 forbidden body and safe field guard |
| 是否存在 deterministic test profile 需求 | 是 | Step 14 fake / in-memory / deterministic adapter and Step 16 test cuts |
| 是否可走“无配置说明文档”路径 | 否 | 至少 P0 fake / in-memory / disabled / redaction / topic / profile 需要配置说明 |

结论:`L1-artifact` 不是无配置项目。后续 Step 3~13 适用,不得跳到“无配置说明文档”路径。

### 8.6 非范围残余风险表

| 非范围风险 | 影响 | 当前处理 |
|---|---|---|
| 产品选型未定导致配置项默认值和 secret 形态不稳定 | 影响 Step 7 / Step 8 / Step 11 / 验收 evidence | 先定义 product-neutral ref / disabled / fake / unavailable 语义,产品项进入待确认 |
| 旧 `05/06` 环境矩阵未复核 | 影响 Step 6 / Step 12 / 后续测试验收 | 只作为方向输入,正式矩阵后续重建 |
| P2 多租户 / 多区域 / advanced capacity 被提前塞入 P0 | 扩大范围并冲击实施计划 | Step 2 标记为非范围 / 演进触发 |
| 配置项需要新增代码契约 | 影响 `03` 可落码性 | 必须回写 `03` 或阻塞待确认 |
| 部署命令被误写成配置设计 | 混淆配置与运维 | 部署细节留给部署与运维手册 |
| content integrity / hash / tamper 产品化被提前当成已定配置 | 影响 data ownership、storage adapter、test evidence 和 ADR | 当前仅作为 P2 / ADR 触发,不得写成 P0 默认配置 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓不是“无配置”项目 | 否 | 根据 `03` 已有配置绑定点判断范围 | 不适用 | 无回写 |
| P0 覆盖 runtime / adapter / store / consumer / publisher / job / handoff / redaction / deterministic test profile | 否 | 承接 `03` §13 和 Step 14 绑定点 | 不适用 | 无回写 |
| P1 产品化配置本轮只定义控制面和待确认,不锁定产品 | 否 | 范围分层 | 不适用 | 无回写 |
| P2 多区域、多租户、高级容量、vendor-specific export 和 content integrity 产品化不进入 P0 | 否 | 非范围 / 演进口径 | 不适用 | 无回写 |
| 后续具体配置项若要求新增 runtime config 字段、adapter constructor 参数、trait、error 或 flow | 是 | 代码契约变更 | `03` §4 / §5 / §13 或 Step 14 来源 | 阻塞待确认 |
| 旧 `05/06` 环境矩阵不直接继承 | 否 | 下游文档复核口径 | 不适用 | 无回写 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对详细设计的影响判定”和“待确认事项”小节,了解配置范围和非范围如何收敛。

正式 `04-配置设计.md` §2 应回填:

- 本轮配置设计目标表。
- 本轮覆盖范围表。
- P0 / P1 / P2 配置口径。
- 非范围表。
- 无配置路径判定:本仓不是无配置项目。
- 非范围残余风险表。

回填要求:

- 不得写具体配置项默认值、环境变量名、secret 存储路径、部署命令或产品选型。
- 不得把 P1 / P2 生产化和高级配置挤入 P0。
- 不得继承旧 `05/06` 的旧对象名或旧环境矩阵。
- 不得在 `04` 中新增影响 `03` 的代码契约。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 durable DB / bus / metric / DLQ / diagnostic store / archive / observability / sync / external content source 产品是否锁定 | 影响配置项字段、默认值、secret 类型和 failure strategy | 后续 Step 7~14 按 product-neutral / disabled / fake / 待确认处理 |
| `05-测试方案.md` 和 `06-验收标准.md` 何时按新版 `03/04` 复核 | 影响环境矩阵、测试门禁和验收 evidence | Step 12 只给承接输入,不在 Step 2 修旧文档 |
| P2 multi-region / tenant profile / advanced capacity / vendor-specific export 是否进入近期路线 | 影响演进章节和实施计划 | Step 13 作为演进触发处理 |
| content integrity / hash / tamper 是否升级为 ADR 级机制 | 影响配置项、adapter、测试和验收 | 当前不写成 P0 配置项,后续作为 ADR / P2 触发 |
| 具体配置项是否需要新增 `03` runtime config 字段或 builder / adapter 签名 | 影响详细设计代码契约 | 后续发现即阻塞,先回写 `03` |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置设计目标已明确 | 通过 | 见 §8.1 |
| 配置范围和非范围已收稳 | 通过 | 见 §8.2 / §8.4 |
| P0 / P1 / P2 配置口径已明确 | 通过 | 见 §8.3 |
| 无配置路径已判定 | 通过 | 本仓不是无配置项目 |
| 对 `03` 的影响判定已记录 | 通过 | 见 §9 |
| 可进入 Step 3 | 通过 | 下一步建立配置控制面总览 |
