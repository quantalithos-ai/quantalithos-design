# Step 2：明确配置设计目标、范围和非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节：未来正式 `04-配置设计.md` §2“本次配置设计目标与范围”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_02_scope.md`
> 执行模式：full-restart；旧材料只作 historical_material / 污染审计输入
> 完成日期：2026-09-02

## 1. Step 状态与停审门禁

| 项目 | 结论 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 2 明确配置设计目标、范围和非范围 |
| 当前模块 | `scope` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1 输入映射；新版正式 `00/01/02/03`；`03_ddd_step_14_config_dependencies.md`；旧 `05/06`、README、draft 仅为方向 / 历史输入 |
| 停审方式 | 本 Step 完成后立即停审，等待用户明确确认 Step 3 |
| 正式 `04` 写入 | `false`；正式文档仍不得创建 |
| 实现 / 测试 / 证据 | `false`；本 Step 不产生实现、测试结果、artifact、report、evidence、verdict、signoff 或 readiness |
| commit | `false`；未经用户明确要求不提交 |
| 下一允许动作 | `stopped_waiting_for_user_explicit_confirmation_for_step_03` |

本 Step 只收敛配置设计目标、P0/P1/P2 范围、非范围和无配置路径判定；不定义具体配置项、默认值、来源优先级、环境变量、密钥存储、加载函数、热更新或失效数值。

## 2. 本步目标与问题边界

本 Step 要确定：

1. 哪些配置控制面必须进入本轮 `04`，才能支撑宿主控制面在本地 / fake / blocked 条件下可装配、可测试和可审计；
2. 哪些配置只属于真实产品化、生产运维或后续演进，不应挤入当前核心范围；
3. 哪些配置细节应交给部署与运维手册、ADR、`05/06/07` 或相邻 owner；
4. 配置设计是否可以走“无配置说明文档”路径；
5. 配置范围如何保持 `ProjectMemberRef`、`GlobalMemberRef`、Host Truth、四层 handoff 和 fail-closed 不变量；
6. unresolved sibling contract 如何作为 pending / blocked / waiting / placeholder 保留，而不是被配置或 fake 伪造成 ready。

本 Step 不回答：

- 配置 key、JSON 具体字段、默认值、环境变量名、secret provider 或 endpoint；
- 数据库、消息总线、容器 / 编排、RPC、观测、DLQ、scheduler 或外部 GRC 产品选型；
- `RuntimeConfig`、adapter constructor、Port、DTO、错误类型或函数流的新增；
- 部署命令、挂载方式、证书安装、告警阈值、排期、commit boundary 或测试执行结果。

## 3. 本步输入

| 输入 | 状态 / 效力 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供配置输入权威级别、候选配置域、禁止配置化不变量和 blocker 处理口径 |
| `00-需求文档.md` | 新版正式上游 | 提供项目型双锚、C-MS-1~5、目标 / 非目标、依赖裁剪、安全和 fail-closed 要求 |
| `01-架构设计.md` | 新版正式上游 | 提供 Host Truth Center、A1~A5 / S1~S3 / P1~P3、依赖方向、local-first、产品中立和架构红线 |
| `02-概要设计.md` | 新版正式上游 | 提供七个 CMP、代码主体、配置影响轮廓、主要入口和下游承接边界 |
| `03-详细设计.md` §13~§17 | 直接实现设计输入 | 提供 `infra/config.rs`、`runtime_builder`、store / resolver / adapter / publisher / handoff / entry / job / redaction 绑定点及测试 / 风险方向 |
| `03_ddd_step_14_config_dependencies.md` | 字段级配置来源 | 提供 section、读取层、P0 fake / blocked 口径、builder 顺序和不可配置化边界 |
| 旧 `README.md`、旧 `05/06`、`draft/` | historical_material / 方向输入 | 识别旧产品、旧对象、旧环境矩阵和概念污染；不得覆盖新版 `00~03` |
| `L1-governance` `04` Step 2 | 粒度 / 格式参考 | 参考 P0/P1/P2、非范围去向、无配置判定和停审写法；不提供本仓 truth |

## 4. SOP 问题回答

### 4.1 P0 必须定义哪些配置才能支撑主链

本仓的 P0 配置不是“真实端到端 ready”的承诺，而是使 Host Truth 语义能够在本地、fake、placeholder 或明确 blocked 条件下完成装配和验证。P0 至少要定义以下控制面：

| P0 控制面 | 必须覆盖的语义 | 当前正向上限 |
|---|---|---|
| runtime assembly / profile | 配置身份、运行 profile、必需依赖可用性、builder 是否允许暴露 entry | 只能暴露已校验的 host-side assembly；外部合同未闭口时保持 blocked / unavailable |
| local truth stores | 各 logical truth、history、material、outbox、projection、idempotency、stored-result 与 UoW 的 fake / in-memory 绑定类别 | fake 只证明本地 revision、rollback、replay 和 redaction 语义，不证明 durable 产品 |
| qualification / host seams | Identity、Work、Member、Images、Runtime、Sandbox 的 source / ref / adapter，以及 carrier availability marker 的 disabled、placeholder 和 fail-closed 口径 | 不解析外部正文、manifest、policy 或 credential body；carrier 不定义 ref / release schema；不可验证输入不得形成 `Ready` |
| host lifecycle / session entry | host action、registration、Host Session、health、recovery、closure、reconciliation entry 的启用和受限边界 | 配置只能选择既有 entry / adapter；不能创建隐式 lifecycle decision、Runtime run 或第二执行主语 |
| inbound Consumer | source 类别、受支持版本类别、dedup / quarantine / unsupported 的配置语义 | Core / Bus exact envelope、route、receipt 未闭合时只能使用 candidate / fake / blocked seam |
| publication / handoff | outbox publisher、host fact material、handoff target 的 disabled / fake / configured 类别和失败可见性 | `submitted` 不推导 `delivered`、`observed` 或 `accepted`；目标合同未闭口时不声明交付 |
| operations Job | action dispatch、health evaluation、cleanup、reconciliation、publish、projection、handoff job 的可运行 profile、selector 和受限批次语义 | Job 只能推进已提交 work，不创建授权、decision、generation 或新 effect key |
| safe read / boundary | safe view、history page、visibility、分页 / 结果边界和 stale / unavailable 表面 | Query 仍严格 no-write；具体限制数值留后续 Step |
| clock / id / redaction / diagnostics | deterministic clock / id fixture、body-free diagnostics、forbidden-body 检查和最小安全观测开关 | 不保存 secret、外部正文、endpoint、manifest 或 raw payload；观测 backend 未锁定 |

因此，P0 的定义是“最小可装配且语义可判定”，不是“所有上游运行期依赖均已联调”。`MSVC-UP-001~008` 任一未闭合时，对应正向路径必须继续 blocked / waiting / unknown / fail-closed。

### 4.2 哪些配置属于 P1 或后续扩展

| 层级 | 配置范围 | 当前处理 |
|---|---|---|
| P1 产品化 / 集成 | durable store、lease / lock、真实或 real-like Bus、Member / Images / Runtime / Sandbox adapter、credential / secret 引用、真实 handoff target、metric / DLQ / diagnostic / observability sink、staging-like profile | 本轮只确定控制面和承接条件；具体产品、endpoint、schema、receipt 和数值待 owner / ADR / 后续 Step 闭口 |
| P1 运维增强 | 周期性 Job 的 schedule、批次、并发类别、重试类别、reconcile / projection cadence、受控回滚和漂移诊断 | 只作为配置设计候选，不在本 Step 填数值或部署操作 |
| P2 生产演进 | 多区域 / 多租户 profile、复杂容量与放置策略、warm pool / 预热、供应商专属调优、复杂 SLO / rate-limit knobs、外部 GRC 深度集成或策略仿真 | 记录为非范围和未来触发，不作为当前 P0 配置项 |

这里的 P0/P1/P2 是配置设计分层，不是当前 release authority。需求文档尚未为该项目发布独立的优先级或真实产品准入裁决，不能把 P0 标签解释为 readiness 或 signoff。

### 4.3 哪些细节留给部署与运维手册

以下内容不属于 `04` 的设计范围：容器 / 编排实例拓扑、卷和 secret 挂载、证书安装、真实 endpoint 填写、环境文件分发、发布命令、滚动操作、告警面板、值班流程、故障处置步骤和供应商控制台操作。`04` 只定义这些操作所需的配置语义、来源、优先级、校验、审计和失效结果。

### 4.4 哪些细节留给其他文档或 owner

| 细节 | 留给哪一层 / 哪份文档 |
|---|---|
| 代码契约、runtime config 类型、builder / adapter / Port / DTO / error 变化 | `03-详细设计.md` 及其回写 Step；发现即暂停配置链 |
| 配置来源、优先级、环境矩阵、配置项、secret、加载、生效、变更和失效 | 后续 `04` Step 3~14 |
| 测试组合、fixture、fake / controlled seam、测试证据 | `05-测试方案.md` |
| 配置验收门禁、VETO、风险接受和 evidence 裁决 | `06-验收标准.md` |
| 配置准备顺序、实施 phase、迁移和 commit boundary | `07-实施计划.md` |
| 产品、容量、供应商合同、部署架构或外部 GRC 选择 | ADR、实施计划、部署与运维 owner |
| Identity / Work / Member / Images / Runtime / Sandbox / Bus / policy / credential 的 truth 或 exact contract | 各正式 owner；本仓只消费 typed ref / safe summary / adapter seam |

### 4.5 哪些非范围仍有残余风险

主要残余风险包括：

- `MSVC-UP-001~008` 未闭口，P0 只能表达 placeholder / disabled / fail-closed，不能承诺正向宿主启动、注册、会话、隔离、事件或交付；
- durable store、lease / lock、observability backend、DLQ / diagnostic store 和 measurement authority 未锁，影响 P1 配置项、失效策略和后续 evidence；
- `HostChangeCursor` 与 `CommittedChangeCursor` exact type 未定，不能在配置里用第三种 cursor 或隐式转换补齐；
- policy 传递 owner、launch credential 签发 / 撤销 owner 未定，不能由本仓配置生成治理裁决或保存 secret；
- 旧 `05/06` 环境矩阵仍需按新版 `00~03` 和未来 `04` 重建，旧对象、旧产品和旧数字不得回流；
- 若后续配置项要求新增 `RuntimeConfig` 字段、adapter constructor、Port、DTO、error 或函数流，必须先回写并审计 `03`。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 正式 `04-配置设计.md` | 尚未创建，配置语义散落在 `02/03` 和历史 `05/06` | 继续中间产物链，正式文档等 Step 15 |
| Step 1 候选域 | 已识别 profile、store、resolver、host seam、publisher / handoff、entry、redaction，但尚未分层 | 本 Step 收敛为 P0 主链、P1 产品化、P2 演进 |
| `03` §13 / Step 14 | 有读取层和 builder binding，却没有配置设计范围与去向 | 本 Step 将绑定点转为范围表，不新增代码契约 |
| 旧 `05/06` / README | 可能包含旧容器、数据库、心跳、性能数字或旧执行对象 | 仅作污染审计；不继承产品、数字、旧 DTO 或旧环境矩阵 |
| 并行兄弟文档 | Member、Images、Runtime、Sandbox、Bus 的 exact contract 未全部闭合 | 配置只保留 adapter / ref / availability placeholder；不替兄弟定义 truth |

## 6. 改动前后对比

| 维度 | 改动前 | Step 2 完成后 | 原因 |
|---|---|---|---|
| 是否有配置 | 只有若干配置 binding 线索，可能被误判为无配置 | 明确本仓不是无配置项目 | `03` 已有 config loader、builder、logical stores、adapter、entry、publisher / handoff 和 redaction 绑定 |
| P0 口径 | 候选域未分层，容易把真实集成当成主链 | P0 只保证本地 / fake / blocked 语义可装配和可判定 | 上游 exact contract 未闭合，不能把 fake / placeholder 当 readiness |
| P1 / P2 口径 | 产品化、生产运维和高级能力混在一起 | P1 为 real-like / durable / observability / handoff 等承接；P2 为多区域、多租户、容量与深度集成演进 | 控制范围膨胀并保留后续路线 |
| 部署边界 | 旧材料可能把挂载、命令、拓扑写入配置设计 | 明确交给部署与运维手册 | 保持配置语义与运维操作分离 |
| 详细设计回写 | 配置可能静默新增字段或构造参数 | 代码契约变化统一阻塞并回写 `03` | 防止 `04` 反向改写实现边界 |
| sibling 合同 | 可能用 endpoint、receipt 或 fake 通过补齐 | 统一 pending / blocked / waiting / placeholder / fail-closed | 不把并行 WIP 升格为 truth |

## 7. 配置设计取舍

| 议题 | 候选 | 本 Step 取舍 | 理由 |
|---|---|---|---|
| 是否走“无配置”路径 | A. 是；B. 否 | 采用 B | runtime、store、resolver、host seam、consumer、publisher、job、handoff、redaction 均存在配置绑定点 |
| P0 是否锁定真实基础设施产品 | A. 锁定；B. 只定义 product-neutral、fake、disabled 和 blocked seam | 采用 B | 需求 / 架构 / 详细设计未授予产品选型 authority |
| P0 是否承诺外部正向 ready | A. 承诺；B. 只承诺本地语义和缺口可判定 | 采用 B | `MSVC-UP-001~008`、route、receipt 和 credential owner 仍 pending |
| 是否直接继承旧 `05/06` 环境矩阵 | A. 继承；B. 仅保留方向后重建 | 采用 B | 旧文档含旧对象、产品和未审计数值 |
| 是否把部署操作写入配置范围 | A. 写入；B. 留给运维 | 采用 B | `04` 定义语义，不替代部署 / runbook |
| 是否在本 Step 锁定 key / 默认值 / env / secret | A. 锁定；B. 留给后续 Step | 采用 B | SOP 要求先收范围，再逐域 / 逐项收敛 |
| 是否把 P2 高级能力列为当前交付 | A. 列入；B. 记录非范围 / 演进触发 | 采用 B | 当前项目型宿主核心闭环优先，未有相应 FR / owner / measurement authority |

## 8. 结构化中间产物

### 8.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳运行装配控制面 | 将 profile、runtime builder、store、resolver、host seam、entry、consumer、publisher、job 和 handoff 的绑定点纳入配置设计 | Step 3 配置控制面总览 |
| 收稳本地 P0 基线 | 明确 fake / in-memory / deterministic / disabled / placeholder 的最小可装配语义 | Step 3、Step 6、Step 9、Step 11 |
| 收稳配置化边界 | 固定配置不得改变双锚、Host Truth owner、状态、事务、幂等、generation、no-write、no-authorization 和四层 handoff | Step 4 配置分类与禁止配置化边界 |
| 收稳外部接缝 | 把 Identity、Work、Member、Images、Runtime、Sandbox、Bus、Observability 和 handoff 作为 ref / runtime / event / adapter seam | Step 3、Step 5、Step 7、Step 11 |
| 收稳来源与 profile | 为后续 strict JSON、来源优先级、环境差异和 secret ref 提供范围，而不提前填值 | Step 5、Step 6、Step 8 |
| 收稳安全配置 | 为 credential、secret、endpoint、redaction、forbidden-body 和 safe diagnostics 留独立配置域 | Step 7、Step 8、Step 9 |
| 收稳失败与变更承接 | 使缺失、冲突、过期、不可达、漂移、disabled、unknown、degraded 和 blocked 有配置层去向 | Step 9~11 |
| 收稳下游输入 | 给测试、验收、实施和运维提供范围、profile、门禁和待确认项，不伪造证据 | Step 12、后续 `05/06/07` |

### 8.2 本轮覆盖范围表

| 范围 | 本轮必须覆盖的配置语义 | 后续 Step |
|---|---|---|
| runtime / builder | profile、配置身份、必需依赖可用性、启动 / entry 暴露和 unavailable surface | Step 3、4、9、11 |
| local truth 与维护存储 | truth、history、material、outbox、projection、idempotency、stored result、UoW 的逻辑绑定类别 | Step 3、5、7、9、11 |
| qualification 与 host seam | Identity / Work / Member / Images / Runtime / Sandbox 的 ref、adapter、availability、placeholder 和 fail-closed；carrier 仅 availability marker | Step 3、4、7、9、11 |
| registration / session / health | 注册、Host Session、健康评估、恢复、关闭和对账入口的启用 / 受限运行语义 | Step 3、6、7、9、11 |
| Consumer / publisher / handoff | inbound version 类别、dedup、outbox publisher、target binding、disabled / fake / blocked 和反馈可见性 | Step 3、5、7、8、11 |
| Operations Job | action、health、cleanup、reconcile、publish、projection、handoff job 的 selector、profile、批次 / 重试类别候选 | Step 3、6、7、11 |
| safe read / API boundary | visibility、page / result limit、stale / unavailable 和 body-free error surface | Step 3、6、7、9、12 |
| clock / id / redaction / diagnostics | deterministic fixture、safe telemetry、forbidden-body guard 和最小诊断引用 | Step 4、7、8、9、12 |
| 环境 / 测试 profile | local / fixture、CI、integration-like、staging-like、production-like 的差异方向及 fake / real-like 切换边界 | Step 6、12 |

### 8.3 P0 / P1 / P2 配置口径

| 等级 | 配置设计口径 | 示例方向 | 当前是否定义具体项 |
|---|---|---|---|
| P0 | 支撑本地 / fake / in-memory 的宿主控制面语义、contract / service / integration-like 测试切口、redaction guard、Consumer / publisher / Job 的受限闭环 | local profile、logical fake stores、deterministic clock / id、placeholder adapters、disabled unresolved target、body-free diagnostics | 否；本 Step 只定义范围 |
| P1 | 支撑真实产品化和 real-like 联调的 adapter / store / bus / handoff / observability 绑定 | durable store ref、Bus target ref、Member / Images / Runtime / Sandbox adapter ref、secret ref、DLQ / metric / archive target | 否；exact contract / 产品 / 数值待确认 |
| P2 | 支撑生产增强与跨边界演进 | multi-region / tenant profile、capacity / placement、warm pool、advanced rate limit / SLO、深度外部 GRC 或策略仿真 | 否；仅记录非范围和触发 |

### 8.4 非范围表与去向

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则、执行主语和验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、系统拓扑、产品选型和供应商合同 | `01-架构设计.md`、ADR、实施计划、运维 |
| 29 个对象、协议、Port、DTO、状态、事务、错误和函数流新增 | `03-详细设计.md`；必须先回写再继续 `04` |
| 容器 / 编排部署、卷挂载、secret provider 操作、证书、发布命令和值班 runbook | 部署与运维手册 |
| 完整测试用例、数据、脚本、环境执行和 evidence | `05-测试方案.md` |
| 验收 verdict、VETO、风险接受、signoff 和 readiness | `06-验收标准.md` |
| phase、实现顺序、迁移执行、commit boundary 和提交门禁 | `07-实施计划.md` |
| Runtime loop、Member 主体、Images 内容 / 构建、Sandbox policy / backend、工具执行、治理裁决、L1 truth、Observability backend | 各正式 owner；本仓只消费允许的 ref / summary / feedback seam |
| 多租户、多区域、warm pool、复杂容量和供应商专属调优 | 后续版本 / ADR / 运维演进 |

### 8.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 raw config / validated binding 入口 | 是 | `03` 与 Step 14 已固定 `infra/config.rs`、`infra/runtime_builder.rs` |
| 是否存在 store / UoW / idempotency / result 绑定 | 是 | logical truth、history、material、outbox、projection、stored-result 均有绑定点 |
| 是否存在 resolver、host、Member、Images、Runtime、Sandbox adapter 绑定 | 是 | qualification 与 host-side seam 需要 availability / placeholder / fail-closed 配置语义 |
| 是否存在 Consumer、publisher、handoff、Job、read、redaction 绑定 | 是 | `03` §7、§8、§13~§15 与 Step 14 已列入口和 adapter |
| 是否可以走“无配置说明文档”路径 | 否 | 至少 P0 profile、logical stores、adapter availability、entry / job、publication / handoff、redaction 和测试 fixture 需要配置设计 |

结论：`L2-member-service` 不是无配置项目。Step 3~13 均适用；不得跳过配置控制面、配置域、配置项、敏感配置、加载校验、变更和失效讨论。

### 8.6 非范围残余风险表

| 非范围风险 | 影响 | 当前处理 |
|---|---|---|
| `MSVC-UP-001~008` exact contract 未闭合 | 影响 adapter target、route、receipt、credential、positive readiness | 保持 placeholder / blocked / waiting / fail-closed；不写 sibling schema |
| durable store / lease / lock / observability / DLQ 产品未定 | 影响 P1 默认、secret、保留、重试、证据和运维输入 | product-neutral；后续 ADR / 配置 Step / 实施门禁决定 |
| cursor exact type 未定 | 影响 projection、material、outbox、reconcile 的配置和测试矩阵 | 保持 `HostChangeCursor` / `CommittedChangeCursor` 语义分离，不造别名 |
| policy / launch credential owner 未定 | 影响 handoff / qualification 和敏感配置 | 只允许 opaque ref / blocked；不由本仓签发、撤销或裁决 |
| 旧 `05/06` 环境矩阵污染 | 影响测试 / 验收 profile | 后续按新版 `00~04` 重建，不直接继承 |
| 配置语义反向改变 `03` 代码契约 | 影响可落码与审计 | 发现新增字段 / Port / constructor / DTO / error 即停并回写 `03` |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓不是无配置项目，需继续配置设计 Step 3~13 | 否 | 承接 `03` 已有 config / builder / adapter binding | 不适用 | 无回写 |
| P0 覆盖 runtime assembly、logical stores、qualification、host seam、entry、Consumer、publisher、Job、handoff、read、redaction | 否 | 将既有 binding 点分层为配置范围 | 不适用 | 无回写 |
| P1 / P2 的真实产品、生产增强和高级能力不在当前范围锁定 | 否 | 配置设计阶段分层 | 不适用 | 无回写 |
| 后续配置项若需要新增 `RuntimeConfig` 字段、builder 顺序、adapter constructor、Port、DTO、error 或函数流 | 是 | 代码契约变化 | `03` §4~§14 及对应 calibration Step | 阻塞待确认；必须先回写并审计 |
| 后续把 sibling exact schema、endpoint、route、credential owner、receipt 或产品写成配置事实 | 是 | 外部合同越界 / 伪造 ready | `03` §1、§7、§13、§17 | 阻塞待确认；保持 pending / blocked |
| 后续用 flag 关闭 metadata、幂等、history / material / outbox、generation、Query no-write、Job no-authorization、redaction 或四层 handoff | 是 | 破坏不变量 | `03` §3、§10~§14 | 设计拒绝；不得进入 `04` |

当前结论：Step 2 不需要回写 `03-详细设计.md`。后续配置 Step 若只改变来源、优先级、默认值、profile、敏感级别或失效策略，可留在 `04`；一旦改变代码契约或 owner，必须暂停并回写。

## 10. 回填草稿：正式 `04-配置设计.md` §2

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对详细设计的影响判定”和“待确认事项”小节，了解配置范围和非范围如何收敛。

正式 `04` §2 只允许在 Step 15 装配时回填以下收口结论：

1. 本仓配置设计目标是收稳 host-side runtime assembly、logical stores、qualification / adapter、entry / Consumer / publisher / Job、handoff / read、redaction / diagnostics 和环境承接；
2. P0 只承诺 local / fake / in-memory / placeholder / disabled / blocked 条件下的语义可装配、可判定和可测试，不承诺真实 sibling 或基础设施 readiness；
3. P1 负责 durable、real-like、observability、handoff、secret / credential 和 staging-like 产品化承接，P2 负责多区域、多租户、容量和深度集成演进；
4. 部署操作、产品选型、代码契约、测试执行、验收裁决和实施提交分别留给对应文档 / owner；
5. `ProjectMemberRef`、`GlobalMemberRef`、Host Truth owner、状态、事务、幂等、generation、Query no-write、Job no-authorization、redaction 和四层 handoff 不可配置化；
6. 本仓不是无配置项目，`MSVC-UP-001~008` 和产品 / cursor / measurement 缺口继续以 pending / blocked / waiting / placeholder / fail-closed 表达。

正式正文不得在本节新增具体 key、默认值、env、secret path、endpoint、部署命令或产品名称；这些内容须待后续对应 Step 独立收敛。

## 11. 待确认事项与 blocker

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `MSVC-UP-001~008` 的 exact schema、route、receipt、credential、availability | 影响 P1 adapter、Consumer、publisher、handoff 和正向 readiness | 继续 pending / blocked / waiting；不由配置补齐 |
| durable store、lease / lock、Bus、observability、DLQ / diagnostic 产品 | 影响真实配置项、secret、保留、重试和验收 evidence | 后续 ADR / Step 7~14；保持 product-neutral |
| `HostChangeCursor` / `CommittedChangeCursor` exact type | 影响 material / projection / outbox / reconciliation 配置和测试 | 保持两种语义分离，不造第三种 cursor |
| profile 命名、默认值、环境变量、secret provider、endpoint 形态 | 影响 Step 5~9 | 本 Step 不锁定，按后续 Step 收敛 |
| policy 传递 owner、launch credential 签发 / 撤销 owner | 影响 qualification / handoff / 敏感配置 | opaque ref / blocked；等待正式 owner |
| 旧 `05/06` 何时按新版 `03/04` 重建 | 影响测试、验收和实施承接 | 当前不修改，后续文档链独立重建 |
| P0 是否有额外 API / Job boundary 数值要求 | 影响配置项与 measurement authority | 记录为 candidate；无 authority 不填数值 |

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 配置设计目标已明确 | pass | 见 §8.1 |
| P0 / P1 / P2 配置口径已明确 | pass_with_upstream_blockers | 见 §4.1、§4.2、§8.3；P1 正向仍受 exact contract 限制 |
| 配置范围和非范围已收稳 | pass | 见 §8.2、§8.4 |
| 无配置路径已判定 | pass | 本仓存在多项读取和 builder binding，不适用无配置路径 |
| 部署、实施、测试、验收和 sibling owner 去向已明确 | pass | 见 §4.3、§4.4、§8.4 |
| 配置不可改变的 owner / invariant 已记录 | pass | 双锚、Host Truth、状态、事务、幂等、generation、no-write、no-authorization、redaction、handoff 均锁定 |
| 历史污染未升格 | pass | 旧 README / `05/06` / draft 仅方向 / 审计输入 |
| 对 `03` 的影响判定已记录 | pass | 当前无回写；代码契约变化必须阻塞并回写 |
| blocker 与待确认事项已记录 | pass_with_upstream_blockers | `MSVC-UP-001~008`、产品、cursor、measurement 和 owner 缺口继续开放 |
| 正式 `04` 是否提前写入 | pass | 未创建正式文档；仍等 Step 15 |
| 可进入 Step 3 | 通过 | 但本轮已停审，须用户明确确认后再进入 |

## 13. Step 2 停审结论

```text
step_02_status = completed / pass_with_upstream_blockers
step_02_gate = pass_with_upstream_blockers
configuration_required = true
formal_04_write_allowed = false
formal_04_created = false
next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_step_03
implementation_allowed = false
commit_allowed = false
```

Step 2 已完成目标、范围、P0/P1/P2 和非范围收敛并停审。下一轮恢复时必须先读取项目级台账、本配置 flow 和本文件；只有用户明确确认 Step 3 后，才可以创建 `04_config_step_03_control_plane.md`，不得跳到后续 Step 或正式 `04-配置设计.md`。
