# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节: `04-配置设计.md` §2 本次配置设计目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确配置设计目标、范围和非范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入映射;新版 `00/01/02/03`;旧 `05/06` 方向输入 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义本轮配置设计要覆盖哪些配置控制面,不覆盖哪些配置细节,并判断 `L1-governance` 是否存在“无配置”路径。

本 Step 只回答:

- 本轮配置设计的目标是什么。
- P0 必须定义哪些配置控制面才能运行主链。
- 哪些配置属于 P1 / P2 或后续扩展。
- 哪些配置细节应留给部署与运维手册、实施计划、ADR 或下游文档。
- 哪些非范围仍有残余风险。

本 Step 不定义具体配置项、默认值、来源优先级、环境矩阵、secret 轮换、加载校验函数、热更新策略、部署命令、产品选型或正式 `04` 正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供上游输入映射、配置必须回答 / 不再回答清单和初始候选配置域 |
| `03-详细设计.md` §13 | 已完成 | 提供 runtime / adapter / store / consumer / publisher / handoff / redaction 绑定点 |
| `03-详细设计.md` §15 / §17 | 已完成 | 提供 config / adapter 测试切口、风险与待确认事项 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供配置引用、external binding、runtime builder 和禁止配置化边界的详细来源 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 新版正式文档 | 提供需求红线、架构不变量、配置影响轮廓和禁止配置化边界 |
| `05-测试方案.md` / `06-验收标准.md` | 旧 / 待复核草案 | 提供 test / staging 环境方向,不作为配置真相源 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链? | P0 必须覆盖 runtime mode / adapter availability、repository / projection / reference / outbox store binding、inbound consumer binding、outbox publisher / topic binding、handoff / archive / external GRC target 的 disabled / fake / configured 口径、observability / redaction 基础开关和安全输出边界、测试 / fake profile 的最小环境差异。没有这些配置,目标仓无法装配 runtime、运行 fake / in-memory P0、触发 consumer / publisher / job 或验证 forbidden body。 |
| 哪些配置属于 P1 / P2 或后续扩展? | P1 覆盖 durable store 产品化、real-like bus、真实 source resolver、metric / DLQ / diagnostic store、archive / observability handoff、external GRC fake-to-real 切换、staging profile。P2 覆盖 multi-region、tenant-specific profile、advanced rate limit、复杂 SLO / capacity knobs、Policy DSL / rule engine / simulation、external GRC 深度集成和生产运维细粒度调优。 |
| 哪些配置细节应留给部署与运维手册? | 容器挂载、secret provider 操作、证书安装、实例拓扑、告警面板、值班流程、真实 endpoint 填写、发布命令、环境文件分发和故障处置步骤留给部署与运维手册。配置设计只定义语义、来源、优先级、校验、失效和审计。 |
| 哪些配置细节应留给实施计划? | 配置文件落地顺序、phase / commit boundary、测试门禁嵌入、adapter 从 fake 切 durable 的实现批次、配置迁移执行批次、回滚提交策略和实现仓交付纪律留给 `07-实施计划.md`。 |
| 哪些非范围仍有残余风险? | 具体 DB / bus / search / metric / DLQ / external GRC 产品未锁定会影响默认值、secret、endpoint、失效策略和验收 evidence。旧 `05/06` 环境矩阵未复核会影响测试 / 验收承接。若后续配置项需要新增 runtime config 字段或 adapter constructor 参数,必须回写 `03`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 初始候选配置域 | 只列候选,未区分 P0 / P1 / P2 | 本 Step 分层为 P0 主链、P1 产品化、P2 增强 |
| `03` §13 | 只列绑定点,未说明配置设计范围 | 本 Step 把绑定点转成配置控制面范围 |
| `03` §17 | 记录产品未锁定风险,但未归属配置 / 实施 / ADR | 本 Step 明确产品选型不在配置 Step 2 锁定,后续作为风险或 ADR / 实施输入 |
| `05` / `06` | 环境矩阵仍含旧对象名和旧主线 | 本 Step 只保留 test / staging 方向,不继承旧对象 |
| 正式 `04` | 尚未存在 | 本 Step 继续中间产物链,正式文档等 Step 15 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置范围 | 只有初始候选配置域 | 明确 P0 / P1 / P2 配置口径 | 支撑后续 Step 3 控制面和 Step 7 配置项 |
| 无配置判断 | Step 1 仅保留可能性 | 明确本仓不是“无配置”项目 | `03` 已存在多项 runtime / adapter / store / publisher / handoff / redaction 绑定点 |
| 产品选型 | DB / bus / external GRC 等作为风险散落 | 不在 Step 2 锁定,进入后续配置域风险 / ADR / 实施 | 配置设计不替代架构选型 |
| 下游承接 | 旧 `05/06` 环境矩阵可能被继承 | 只作为方向输入,正式矩阵后续 Step 6 重建 | 避免旧对象和旧主线回流 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否判断为“无配置”项目 | A. 是;B. 否 | 采用 B。P0 至少需要 runtime、adapter、store、consumer、publisher、handoff/export、observability/redaction 配置 |
| P0 是否锁定真实 durable 产品 | A. 锁定;B. 只定义 product-neutral seam 和 fake / in-memory baseline | 采用 B。真实产品未由架构 / 详细设计固定 |
| 是否把 old `05/06` 环境矩阵纳入 P0 | A. 直接纳入;B. 仅保留方向,后续重建 | 采用 B。旧 `05/06` 需按新版 `03/04` 复核 |
| 是否把部署命令写进配置范围 | A. 写入;B. 留给部署运维 | 采用 B。配置设计只定义配置语义和控制面 |
| 是否把 implementation phase 写进配置范围 | A. 写入;B. 留给实施计划 | 采用 B。phase / commit boundary 属于 `07` |

## 8. 结构化中间产物

### 8.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳配置控制面 | 把 runtime、adapter、store、consumer、publisher、handoff/export、observability/redaction 从详细设计绑定点转成配置控制面 | Step 3 配置控制面总览 |
| 收稳配置边界 | 明确哪些行为允许配置化,哪些 truth / state / transaction / visibility / outbox / projection / idempotency 边界禁止配置化 | Step 4 配置分类与禁止配置化边界 |
| 收稳来源优先级 | 定义 code defaults、config file、env、secret refs、test fixtures 等来源和冲突处理 | Step 5 来源优先级与冲突处理 |
| 收稳环境矩阵 | 重建 dev / test / staging / production-like profile 的配置差异,不继承旧对象主线 | Step 6 环境 / profile 矩阵 |
| 收稳配置项清单 | 给每个配置项类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块 | Step 7 配置项清单 |
| 收稳敏感配置 | 定义 secret / DSN / token / cert / endpoint 的存储、读取、轮换、审计和禁止输出 | Step 8 敏感配置与密钥管理 |
| 收稳加载校验 | 定义 config loader / validator / runtime builder 绑定、启动校验、cross-field 校验和生效策略 | Step 9 加载、校验与生效机制 |
| 收稳变更与失效 | 定义配置变更审计、回滚、fail-fast、disabled、degraded、unavailable 和 retry / DLQ 方向 | Step 10 / 11 变更审计与失效策略 |
| 收稳下游承接 | 给 `05/06/07/09` 提供配置矩阵、门禁、实施准备和运维输入 | Step 12 下游承接 |
| 收稳演进和风险 | 明确产品未锁定、external GRC、metric / DLQ、durable store 和旧环境矩阵复核风险 | Step 13 / 14 演进与风险 |

### 8.2 本轮覆盖范围表

| 范围 | 必须覆盖的配置内容 | 后续 Step |
|---|---|---|
| runtime assembly | runtime mode、profile、adapter availability、disabled / degraded / unavailable surface | Step 3 / 4 / 7 / 9 / 11 |
| store binding | repository、projection、reference、outbox、idempotency、result / report store 的 fake / in-memory / durable binding | Step 3 / 5 / 7 / 9 / 11 |
| inbound consumer binding | consumer enablement、source binding、schema allowlist、dedup / unsupported version failure mapping | Step 3 / 5 / 7 / 11 |
| outbox publisher binding | topic map、publisher adapter、batch / retry class、publication failure marker | Step 3 / 5 / 7 / 11 |
| operations job binding | publish、rebuild、refresh、reconcile、handoff、archive、external GRC export runner scope / batch / target availability | Step 3 / 6 / 7 / 11 |
| external resolver / handoff / export | identity、method、process、work、artifact、runtime、conversation、observability、archive、external GRC adapters | Step 3 / 7 / 8 / 11 / 14 |
| observability / redaction | safe log / metric / trace fields、redaction deny list、forbidden body guard、diagnostic refs | Step 4 / 7 / 8 / 9 / 12 |
| environment / profile | dev、test、staging、production-like profile 的配置差异和 fake / real-like adapter 切换 | Step 6 / 12 |
| sensitive config | token、password、cert、private key、DSN、secret ref、external endpoint secret material | Step 8 |
| downstream handoff | 测试、验收、实施、部署运维如何引用配置设计 | Step 12 |

### 8.3 P0 / P1 / P2 配置口径

| 等级 | 配置口径 | 示例 | 是否本轮展开 |
|---|---|---|---|
| P0 | 支撑本地 / fake / in-memory 主链运行、contract / service / integration test、forbidden body guard 和 outbox / consumer / job 基础闭环 | runtime mode、fake / in-memory store、consumer schema allowlist、fake publisher topic map、disabled external GRC、redaction deny list、deterministic fixture profile | 是 |
| P1 | 支撑 staging / real-like adapter、durable store、real-like bus、metric / DLQ / diagnostic store、archive / observability handoff 和 external GRC fake-to-real 迁移 | durable store DSN ref、bus endpoint ref、metric sink ref、DLQ target ref、archive target、external GRC target ref | 本轮定义控制面和待确认项,具体产品可挂起 |
| P2 | 支撑生产优化、多区域、多租户、复杂容量、advanced rate limit、Policy DSL / rule engine / simulation、external GRC 深度集成 | tenant profile、regional endpoint、capacity knobs、rule engine toggles、vendor-specific GRC schema | 只记录非范围 / 演进触发,不定义 P0 配置项 |

### 8.4 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则、验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` |
| 详细设计对象、trait、DTO、flow、state、error 和 runtime builder 签名新增 | `03-详细设计.md` |
| 完整测试矩阵、测试数据、自动化脚本和 evidence 路径 | `05-测试方案.md` |
| phase / commit boundary、实现顺序、提交门禁和回退提交策略 | `07-实施计划.md` |
| 容器编排、挂载、secret provider 操作、证书安装、发布命令和 runbook | 部署与运维手册 |
| 真实 DB / bus / search / metric / DLQ / external GRC 产品的供应商合同、容量 sizing 和成本评估 | ADR / 实施计划 / 运维 |
| external GRC 双向同步、Policy DSL、rule simulation、多租户生产 profile 和高级容量调优 | 后续版本 / ADR |

### 8.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 runtime / adapter 配置绑定点 | 是 | `03` §13 runtime mode / adapter availability |
| 是否存在 store binding | 是 | `03` §13 repository / projection / reference / outbox store |
| 是否存在 consumer / publisher / topic binding | 是 | `03` §13 inbound consumer binding、publisher / topic binding |
| 是否存在 handoff / export target | 是 | `03` §13 handoff / archive / external GRC target |
| 是否存在 observability / redaction 配置边界 | 是 | `03` §13~§15 |
| 是否可走“无配置说明文档”路径 | 否 | 至少 P0 fake / in-memory / disabled / redaction / topic / profile 需要配置说明 |

结论:`L1-governance` 不是无配置项目。后续 Step 3~13 适用,不得跳到“无配置说明文档”路径。

### 8.6 非范围残余风险表

| 非范围风险 | 影响 | 当前处理 |
|---|---|---|
| 产品选型未定导致配置项默认值和 secret 形态不稳定 | 影响 Step 7 / Step 8 / Step 11 / 验收 evidence | 先定义 product-neutral ref / disabled / fake / unavailable 语义,产品项进入待确认 |
| 旧 `05/06` 环境矩阵未复核 | 影响 Step 6 / Step 12 / 后续测试验收 | 只作为方向输入,正式矩阵后续重建 |
| P2 多租户 / 多区域 / advanced capacity 被提前塞入 P0 | 扩大范围并冲击实现计划 | Step 2 标记为非范围 / 演进触发 |
| 配置项需要新增代码契约 | 影响 `03` 可落码性 | 必须回写 `03` 或阻塞待确认 |
| 部署命令被误写成配置设计 | 混淆配置与运维 | 部署细节留给部署与运维手册 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓不是“无配置”项目 | 否 | 根据 `03` 已有配置绑定点判断范围 | 不适用 | 无回写 |
| P0 覆盖 runtime / adapter / store / consumer / publisher / handoff / redaction 控制面 | 否 | 承接 `03` §13 绑定点 | 不适用 | 无回写 |
| P1 / P2 产品化和高级配置不在当前 P0 中锁定 | 否 | 范围分层 | 不适用 | 无回写 |
| 后续具体配置项若要求新增 runtime config 字段或 adapter constructor 参数 | 是 | 代码契约变更 | `03` §4 / §5 / §13 或 Step 14 来源 | 阻塞待确认 |
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
| P1 durable DB / bus / metric / DLQ / diagnostic store / external GRC 产品是否锁定 | 影响配置项字段、默认值、secret 类型和 failure strategy | 后续 Step 7~14 按 product-neutral / disabled / fake / 待确认处理 |
| `05-测试方案.md` 和 `06-验收标准.md` 何时按新版 `03/04` 复核 | 影响环境矩阵、测试门禁和验收 evidence | Step 12 只给承接输入,不在 Step 2 修旧文档 |
| P2 multi-region / tenant profile / advanced capacity 是否进入近期路线 | 影响演进章节和实施计划 | Step 13 作为演进触发处理 |
| 具体配置项是否需要新增 `03` runtime config 字段 | 影响详细设计代码契约 | 后续发现即阻塞,先回写 `03` |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置设计目标已明确 | 通过 | 见 §8.1 |
| 配置范围和非范围已收稳 | 通过 | 见 §8.2 / §8.4 |
| P0 / P1 / P2 配置口径已明确 | 通过 | 见 §8.3 |
| 无配置路径已判定 | 通过 | 本仓不是无配置项目 |
| 对 `03` 的影响判定已记录 | 通过 | 见 §9 |
| 可进入 Step 3 | 通过 | 下一步建立配置控制面总览 |
