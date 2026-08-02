# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/配置设计书写规范.md`
> 回填章节: `04-配置设计.md` §2 本次配置设计目标与范围
> 生成日期: 2026-07-10
> 状态: reviewed_passed_to_step_3
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步只定义配置设计目标、范围、非范围、P0 / P1 / P2 口径和无配置路径判定。不创建正式 `04-配置设计.md`,不定义具体 raw key、默认数值、来源优先级、环境矩阵、secret 轮换、加载函数、热更新、部署命令、产品选型、实现代码、真实测试结果、run_id、evidence alias、验收签署或 commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 2 | 是。Step 1 审查点后用户回复“同意”。 |
| 项目级台账是否允许进入 Step 2 | 是。原恢复点为 `04` Step 1 `pass_wait_review`;用户确认后门禁满足。 |
| 文档级 flow 是否允许进入 Step 2 | 是。`04_config_calibration_flow.md` 原记录 Step 2 `blocked_by_step_1`;用户确认后可进入。 |
| 是否已读取当前 Step 文件 | 是。已读取 `04_config_step_01_upstream_boundary.md` 的输入映射、候选配置域、historical material 和 `03` 回写门禁。 |
| 是否已读取 Step 2 SOP / 书写规范 | 是。必须输出配置设计目标、范围 / 非范围表、P0 / P1 / P2 口径并裁决无配置路径。 |
| 是否已读取直接上游 | 是。重点复读正式 `03` §13 / §17、`03_ddd_step_14_config_external_binding.md` 和正式 `02` §11。 |
| 当前状态 | 已完成并经用户确认;已传递至 Step 3 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_02_scope.md` |
| 停审方式 | 用户已完成本 Step 审查并确认进入 Step 3;Step 3 已独立完成并进入新的停审点 |
| 是否发现阻塞本 Step 的上游 blocker | 否。产品、profile 和数字未锁定不阻塞范围分层;若后续改变 `03` 代码契约才触发回写门禁。 |

---

## 2. 本步目标

定义本轮配置设计要覆盖哪些配置控制面、不覆盖哪些配置细节,并正式判断 `L4-sandbox` 是否可以走“无配置说明文档”路径。

本 Step 只回答:

- 本轮配置设计要交付什么结果。
- P0 必须覆盖哪些配置控制面,才能安全装配并验证 sandbox 主链。
- 哪些配置属于 P1 产品化 / real-like 集成,哪些属于 P2 高级扩展。
- 哪些细节属于 `03`、`05`、`06`、`07`、ADR 或部署与运维手册。
- 哪些非范围仍存在残余风险。
- Step 3 建立配置控制面总览时允许进入哪些配置域。

本 Step 不定义:

- 配置来源覆盖顺序、JSON schema、env var、CLI flag 或 secret source。
- local / ci-test / integration-like / staging-like / production-like profile 的逐项矩阵。
- 配置项的具体 key、默认值、单位、必填性和 validation message。
- backend / store / bus / OTel / scheduler / secret provider 产品或供应商。
- mount、network allowlist、seccomp / AppArmor / cap-drop 的具体运行清单。
- 测试用例、验收证据、实施 phase、部署命令和运维 runbook。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成并经用户确认 | 提供正式上游、配置必须回答 / 不再回答清单、初始配置输入候选和 historical material 隔离。 |
| `projects/L4-sandbox/00-需求文档.md` §2 / §4 / §10 / §13 / §14 | 正式需求基线 | 固定 execution isolation truth、能力主轴、业务红线、NFR 和验收否决项,用于判断 P0 不可缺失的安全控制面。 |
| `projects/L4-sandbox/01-架构设计.md` §3 / §7~§10 / §13 / §15 | 正式架构基线 | 固定产品中立、运行承载、外部依赖、数据所有权、fail-closed、no weak fallback、cleanup / redline 和风险边界。 |
| `projects/L4-sandbox/02-概要设计.md` §11 | 正式概要基线 | 提供配置只影响承载 / 节奏 / 接缝 / degraded surface 和禁止配置化边界。 |
| `projects/L4-sandbox/03-详细设计.md` §13 / §14 / §15 / §17 | 正式详细基线 | 提供 config owner / binding、observability / redaction、测试切口和产品 / profile / retention 风险。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 提供 runtime / store / adapter / boundary / policy / capture / handoff / relay / job / feature 配置字段池和绑定位置。 |
| `03_ddd_step_15_observability_audit.md` | 已完成详细设计中间产物 | 提供 safe log / metric / audit / diagnostic / redaction 配置边界。 |
| 旧 `README.md` / `05-测试方案.md` / `06-验收标准.md` | historical material / direction input | 只用于审计旧后端、旧安全 profile 和旧环境矩阵污染,不得定义本 Step 范围。 |
| `L1-governance` / `L1-artifact` Step 2 | 粒度参考 | 参考 P0 / P1 / P2、无配置判定和非范围风险的组织方法,不复制业务配置。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、配置 flow 和 Step 1。 | done | 确认用户已允许进入 Step 2。 |
| 2 | 读取 Step 2 SOP、书写规范 §5.2 和正式 `03` 配置 / 风险章节。 | done | 固定目标、范围、P0 / P1 / P2 和无配置判定为必出。 |
| 3 | 按 sandbox 重点边界筛选 P0 配置控制面。 | done | execution identity、resource / fs / network / process、launch policy、capture、observability、failure、lease / cleanup / reaper、redline 全覆盖。 |
| 4 | 区分 P1 产品化和 P2 高级扩展,并明确非范围去向。 | done | 产品选型、部署、测试、验收、实施、运维不混入 Step 2。 |
| 5 | 完成无配置路径判定、残余风险和 `03` 影响判定。 | done | 本仓进入完整 Step 3~13 路径,当前无具体 `03` 回写项。 |
| 6 | 输出回填草稿和 Step 3 handoff,更新三层状态。 | done | Step 2 完成后停审,不创建 Step 3 文件。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链 | P0 必须覆盖 runtime profile / config identity、raw config owner 与 startup validation、truth / projection / derived / reference / relay / idempotency / stored-result store binding、context / policy / backend capability resolver、isolation backend / capture / release adapter、resource / filesystem / network / process boundary profile、policy freshness 与 high-risk summary、command / query limits、idempotency / dedup / stored result retention、inbound subscription / schema allowlist、outbound route / publisher、material / observability / investigation handoff、worker / job enablement / batch / timeout、lease / cleanup / reaper / redline cadence 与 guard profile、projection / derived / reconciliation / reference refresh threshold、safe observability / diagnostic / redaction。P0 可用 deterministic fake / in-memory adapter 验证契约,但不得以 host-run 或弱隔离代替正式 isolation backend;真实执行 backend 未配置时必须 fail-closed / disabled / rejected。 |
| 哪些配置属于 P1 / P2 或后续扩展 | P1 覆盖 durable store、real-like bus、真实 isolation backend、backend capability probe、stronger isolation profile、真实 context / policy summary source、material / observability / investigation handoff、secret provider、OTel / metric sink、scheduler / dead-letter 和 staging-like profile。P2 覆盖多区域 / 多集群、多租户或 workload-class overlay、动态配置中心 /受控热更新、多个合规 backend 的 capability-based routing、vendor-specific security profile translation、高级容量 / autoscaling / cost knobs 和生产级演进治理。P2 不得引入弱后端 fallback 或本地 policy truth。 |
| 哪些配置细节应留给部署与运维手册 | 具体容器 / VM / k8s 编排、namespace / node pool、volume / mount 落地、seccomp / AppArmor 文件安装、capability drop 平台操作、secret provider 挂载、证书安装与轮换操作、真实 endpoint / topic / DSN 填充、发布命令、告警面板、值班处置、容量扩缩和灾备操作留给部署与运维手册。`04` 只定义这些值的语义、来源、校验、敏感性和失败策略。 |
| 哪些配置细节应留给实施计划 | 配置 schema / loader / validator / runtime builder 的落码顺序、adapter 从 fake 到 durable / real-like 的 commit boundary、配置样例与检查脚本的交付批次、迁移与回滚提交、测试 / 验收门禁嵌入、目标实现仓 precheck 和依赖可用性检查留给 `07-实施计划.md`。当前不得创建 implementation ledger 或 planned skeleton。 |
| 哪些非范围仍有残余风险 | backend 产品组合、capability matrix、stronger profile、network / fs / process profile 细节、policy source matrix、retention / retry / cadence 数字、durable store / bus / OTel / scheduler / secret provider 产品未定会影响 Step 6~11 和后续验收。旧 `05/06` 未重建会影响环境矩阵和 veto。P0 fake / in-memory 与 P1 durable / real-like 的 parity 若未在 `05/07` 约束,可能掩盖 no-write、rollback、redaction 或 weak fallback。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 初始配置候选池 | 已列出 12 类候选配置域,但尚未区分 P0 / P1 / P2 | 本 Step 按“安全可验证主链 / 产品化集成 / 高级扩展”分层。 |
| `03` §13 配置引用表 | 同时包含 P0 fake / in-memory 默认口径和未来真实 adapter / product 接缝,缺少配置文档范围分层 | 本 Step 把既有绑定点映射为 P0 / P1,不新增字段。 |
| `03` §17 风险 | backend、profile、retention、scheduler 等风险散落,可能被误当作必须在 Step 2 立即锁定 | 本 Step 只确定归属和优先级;产品 / 数值留给后续配置域、ADR、`07`。 |
| “运行主链”表述 | 容易把 deterministic fake 或 local profile 误写为可 host-run 的正式执行路径 | 明确 P0 fake 只验证 contract / orchestration;真实执行 backend 缺失时必须拒绝,无 host-run fallback。 |
| 旧 README / `05/06` | 旧材料把 Docker+gVisor、cleanup disabled、replay enabled、host runtime、allowlist 写成默认配置 | 不进入 P0 / P1 / P2 事实;仅保留后续需要验证对应配置域的方向。 |
| 正式 `04` | 尚未存在 | 继续中间产物链;Step 15 前不得创建。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 无配置判断 | Step 1 只判断可能性低 | 明确本仓不是无配置项目,完整执行 Step 3~13 | `03` 已有多类 runtime / adapter / store / profile / job 绑定点。 |
| P0 范围 | 候选配置域未分优先级 | 固定安全可验证主链所需控制面,包括 fail-closed、boundary、cleanup / redline 和 redaction | 避免 P0 只剩 happy path / generic runtime config。 |
| fake / local 口径 | 可能被误解为 host-run 或弱隔离默认 | deterministic fake 只用于契约验证;真实 execution backend 未配置时拒绝 | 保持 no weak fallback。 |
| P1 / P2 | 产品化和高级扩展散落在风险表 | P1 承接 real-like / durable / stronger profile,P2 承接多区域 / 动态配置 / 高级容量 | 控制当前范围并保留演进入口。 |
| 非范围去向 | 产品、部署、测试、验收、实施可能混入配置正文 | 每类明确交给 ADR、`05/06/07` 或部署运维手册 | 配置设计保持控制面职责。 |

---

## 8. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否判断为“无配置”项目 | A. 是;B. 否 | 采用 B。正式 `03` 已固定 store、adapter、boundary、policy、handoff、publisher、job、retention、feature 等配置绑定点。 |
| P0 是否要求真实 isolation backend | A. 立即锁定产品;B. 定义 abstract binding + deterministic fake 验证 + 真实执行 fail-closed | 采用 B。P0 闭合安全语义和装配面,不把产品选型伪装成已定事实。 |
| 是否允许 local profile 走 host process | A. 允许;B. 禁止 | 采用 B。local / test 也不得把 host-run 升格为正式路径;未配置受控 backend 时只能拒绝或使用不执行真实代码的 deterministic fake。 |
| P0 是否包含 cleanup / reaper / redline | A. 后移;B. 纳入 | 采用 B。这些是 sandbox 安全闭环,不是可延后的运维增强。 |
| P1 是否锁定 Docker / gVisor / Firecracker / k8s | A. 当前锁定;B. 保持 product-neutral capability / profile seam | 采用 B。产品由后续 Step、ADR / `07` 在不改变 `03` contract 的前提下确认。 |
| 是否把部署和运维命令写入范围 | A. 写入;B. 后移 | 采用 B。`04` 只定义配置语义、来源、校验、生效、失效和审计。 |
| 是否把 implementation phase 写入范围 | A. 写入;B. 后移 | 采用 B。phase / commit boundary 属于 `07`。 |

---

## 9. 结构化中间产物

### 9.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳配置控制面 | 将 `03` 的 config owner、runtime builder、store、adapter、entry、worker、job 和 external binding 转译为唯一配置控制面 | Step 3 控制面 / 配置域总览。 |
| 收稳安全边界 | 明确配置只能选择承载和参数,不得改写 coherent boundary、fail-closed、cleanup guard、redline、no-write / no-repair、no-rollback 和 redaction | Step 4 分类与禁止配置化边界;`06` veto 输入。 |
| 收稳来源与环境 | 定义 source priority、冲突处理、profile、adapter mode 和环境矩阵 | Step 5 / 6;`05` 环境矩阵输入。 |
| 收稳配置项 | 为每项提供类型、默认、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块 | Step 7 配置项清单和模块级 JSON demo。 |
| 收稳敏感配置 | 定义 secret / DSN / endpoint / topic credential / cert ref 的读取、轮换、审计和禁止输出 | Step 8;安全测试 / 验收输入。 |
| 收稳加载与生效 | 定义 parse、validation、cross-field guard、freeze timing、runtime builder handoff 和 entry-local 参数边界 | Step 9;实施 loader / validator 输入。 |
| 收稳变更与失效 | 定义配置变更审计、回滚、漂移、startup reject、command reject、consumer delay / quarantine、job skipped / degraded 和 no weak fallback | Step 10 / 11;`05/06/09` 门禁输入。 |
| 收稳下游承接 | 将配置矩阵、veto、实施准备和运维参数边界交给 `05/06/07/09` | Step 12 下游承接。 |
| 收稳演进与风险 | 管理 product-neutral -> real-like / durable 迁移、配置废弃、P2 触发和 `03` 回写 | Step 13 / 14。 |

### 9.2 本轮覆盖范围表

| 范围 | 必须覆盖的配置内容 | 后续 Step |
|---|---|---|
| runtime / config identity | config source、profile ref、config ref、startup validation、adapter availability、entry-local args | Step 3 / 5 / 6 / 7 / 9 / 11 |
| store binding | truth、projection、derived、reference、relay、idempotency、stored result / report 的 in-memory / fake / durable binding | Step 3 / 5 / 6 / 7 / 9 / 11 |
| context / policy / capability source | resolver source、freshness、availability、summary profile、missing / stale / conflicted / unsupported handling | Step 3~9 / 11 |
| isolation / boundary / capture | backend profile、capability matrix、resource / filesystem / network / process limit profile、launch / inspect / capture / release binding | Step 3~9 / 11 |
| intake / query / idempotency | body / page / timeout 边界、command / event / job / stored-result retention 和 reserved record age | Step 4~7 / 9~11 |
| consumer / publisher / relay | source subscription、schema allowlist、consumer enablement、topic-neutral route、publisher、batch / retry / dead-letter | Step 3 / 5~11 |
| material / observability / investigation handoff | target refs、availability、delivery / retry class、receipt / failure、secret / endpoint ref、no-rollback | Step 3~11 |
| worker / job / maintenance | worker profile、job enablement、batch、parallelism、timeout、retry、report / idempotency、scheduler binding | Step 3 / 6~11 |
| lease / cleanup / reaper / redline | lease profile、orphan scan、cleanup evaluation、retention guard、release target、escalation / containment handoff | Step 3 / 4 / 6~11 |
| projection / derived / reconciliation / reference refresh | stale threshold、batch、comparison scope、enablement、degraded exposure、no-write / no-repair guard | Step 3~11 |
| observability / diagnostic / redaction | safe log / metric fields、sampling / sink binding、diagnostic ref、forbidden body / secret / raw endpoint / raw topic exclusion | Step 4 / 7~12 |
| downstream handoff | 测试配置矩阵、验收 veto、实施配置准备、运维参数与操作边界 | Step 12~14 |

### 9.3 P0 / P1 / P2 配置口径

| 等级 | 配置口径 | Sandbox 示例 | 本轮处理 |
|---|---|---|---|
| P0 | 支撑安全可验证主链、deterministic fake / in-memory contract 与 integration 验证、startup validation、fail-closed、negative boundary 和 redaction | local / ci-test profile、in-memory stores、deterministic fake resolver / capability / backend / capture / handoff / publisher、strict boundary / limit fixture refs、consumer schema allowlist、topic-neutral fake route、retention / cadence deterministic values、cleanup / redline guard、safe diagnostic | 完整展开到 Step 7~11;真实执行 backend 未配置时不得 host-run。 |
| P1 | 支撑 staging-like / real-like / durable 集成和 stronger isolation 证明 | durable stores、real bus / subscription、真实 isolation backend、capability probe、真实 policy/context sources、secret provider、material / observability / investigation targets、OTel / metric sink、scheduler / DLQ、stronger profile | 本轮定义控制面、profile、配置项和待确认;产品选择可挂起到 ADR / `07`。 |
| P2 | 支撑生产高级扩展和长期演进 | multi-region / multi-cluster、tenant / workload-class overlay、动态配置中心与受控 reload、多个合规 backend capability routing、vendor-specific profile translation、高级 capacity / autoscaling / cost knobs | 只记录非范围、演进触发和 `03` 回写条件;不挤入 P0 默认。 |

### 9.4 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| sandbox 需求目标、truth ownership、业务规则和验收目标重写 | `00-需求文档.md` / `06-验收标准.md` |
| 架构方案、backend / store / bus 产品选型和 ADR 裁决 | `01-架构设计.md` / ADR / `07-实施计划.md` |
| `SandboxRuntimeConfigSummary`、builder、adapter constructor、trait / port、DTO、error、flow、state 或 audit schema 新增 / 修改 | `03-详细设计.md` 对应章节和 calibration Step |
| policy / authorization / allowlist / high-risk taxonomy 的定义、审批和 lifecycle truth | governance / capability / identity / member 上游设计;`04` 只绑定 body-free summary source |
| tools semantic command、runtime agent loop、member lifecycle、artifact formalization、observability storage | 对应 sibling 项目正式文档 |
| 完整测试矩阵、测试数据、自动化脚本、真实 evidence 和通过结论 | `05-测试方案.md` |
| 验收阈值裁决、veto、risk acceptance、evidence alias 和签署 | `06-验收标准.md` |
| phase / commit boundary、实现顺序、目标仓创建、implementation ledger / planned skeleton 和提交门禁 | `07-实施计划.md` |
| 容器 / k8s 编排、namespace / node pool、mount 操作、security profile 文件安装、secret 挂载、发布命令、runbook、值班处置 | 部署与运维手册 |
| 真实 allowlist 内容、外部正文、policy body、artifact body、observability ledger body | 上游 / 下游 truth owner;不得进入 sandbox config / log / audit |
| 供应商合同、容量 sizing、成本预算和 SLA 商务裁决 | ADR / 实施 / 运维治理 |

### 9.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 raw config owner / runtime builder | 是 | `03` §13.1 `infra/config.rs` / `runtime_builder.rs`。 |
| 是否存在 store / adapter binding | 是 | `03` §13.2 / §13.3 truth、projection、reference、relay、idempotency、resolver、backend、handoff、publisher。 |
| 是否存在 isolation / boundary / policy profile | 是 | Step 14 backend profile、limit template、lease profile、policy freshness / high-risk profile。 |
| 是否存在 consumer / publisher / job 配置 | 是 | Step 14 source subscription、schema allowlist、topic binding、batch / retry、job / worker cadence。 |
| 是否存在 cleanup / reaper / redline 配置接缝 | 是 | Step 14 lease / cleanup / reaper / containment / escalation binding。 |
| 是否存在 observability / redaction 配置边界 | 是 | `03` §14 和 Step 15 safe field / forbidden field / config validation observability。 |
| 是否可走“无配置说明文档”路径 | 否 | 至少 P0 runtime、store、adapter、boundary、idempotency、consumer / relay、maintenance 和 redaction 配置必须完整说明。 |

结论:`L4-sandbox` 不是无配置项目。Step 3~13 全部适用,不得跳过配置控制面、配置项、敏感配置、加载校验、失效策略或下游承接。

### 9.6 重点边界覆盖审计

| 用户重点边界 | 是否进入本轮范围 | 配置设计承接点 | 不得越界 |
|---|---:|---|---|
| execution environment identity | 是 | runtime profile / config identity、context refs、backend handle profile | config 不生成外部 identity truth。 |
| resource limits | 是 | limit template、size / time / quota class、backend capability validation | 不支持时不得 silent ignore。 |
| filesystem boundary | 是 | boundary profile / mount class / capability summary / adapter translation | 不得用 debug / local profile 放宽 coherent boundary。 |
| network boundary | 是 | deny-by-default boundary profile、后序policy summary source、launch enforcement binding | boundary requirement不消费policy;sandbox不定义allowlist truth,policy missing / stale时launch fail-closed。 |
| process boundary | 是 | process / syscall / privilege profile、backend capability check | 不得 host-run / weak fallback。 |
| tool / runtime launch policy | 是 | policy / authorization summary source、freshness、high-risk profile | 不拥有 tool semantics 或 runtime loop;不能配置绕过 block。 |
| artifact capture | 是 | capture size / material class、capture adapter、handoff targets | capture / handoff 不等于 artifact truth。 |
| observability hooks | 是 | safe log / metric / audit / diagnostic / handoff sink | 不保存 observability ledger truth或 raw body。 |
| failure classification | 是 | adapter availability、outcome、retry / dead-letter / degraded surface | 配置不得把 error string 变成 domain state。 |
| cleanup / lease / reaper | 是 | lease profile、cadence、batch、retention guard、release target | 不得绕过 handoff / investigation / redline guard。 |
| security redlines | 是 | containment / escalation binding、strict validation、redaction | 不得 advisory-only 或 feature flag 关闭。 |

### 9.7 非范围残余风险表

| 非范围风险 | 影响 | 当前处理 |
|---|---|---|
| backend 产品和 stronger profile 未定 | 影响 capability matrix、真实 profile schema、secret、测试承载和验收证明 | P1 product-neutral 定义;Step 6 / 7 / 14 记录待确认,必要时 ADR / `07` 裁决。 |
| network / fs / process 具体清单未定 | 影响 coherent boundary 实际可验证性 | `04` 后续定义 profile 语义和 validation;真实清单与安装交给部署运维,不得继承旧 README。 |
| policy source matrix / high-risk taxonomy 未定 | 影响 launch policy freshness 和 fail-closed 触发 | 只配置 summary source / freshness;truth 由上游 owner 闭合。 |
| retention / retry / cadence 数字未定 | 影响 duplicate replay、dead-letter、cleanup、capacity 和 job report | Step 6 / 7 / 11 收敛;无依据时保守 fail-fast / disabled,不伪造 SLO。 |
| P0 fake / in-memory 与 P1 durable / real-like parity | 可能掩盖 transaction、idempotency、no-write、redaction 或 weak fallback 差异 | `05/07` 必须验证 contract parity;配置设计定义同一失效语义。 |
| 旧 `05/06` 尚未重建 | 环境矩阵、negative gate、veto 和 evidence 仍不可靠 | Step 12 给出承接输入;正式 `04` 后按 full-restart 重建。 |
| P2 overlay / reload 被提前引入 | 可能需要新增 config snapshot、builder branch、scope / tenant carrier | 当前列为非范围;重新打开配置设计并先回写 `03`。 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 本仓不是“无配置”项目 | 否 | 根据 `03` 已有 binding 判断配置路径 | 不适用 | 无回写 |
| P0 覆盖 runtime / store / adapter / boundary / policy / capture / handoff / relay / job / cleanup / redline / redaction 控制面 | 否 | 承接 `03` §13 / §14 和 Step 14 / 15 既有绑定点 | 不适用 | 无回写 |
| deterministic fake 只用于契约验证,真实 backend 未配置时拒绝且无 host-run fallback | 否 | 承接 no weak fallback 和 existing adapter availability 语义 | 不适用 | 无回写 |
| P1 保持 product-neutral,不在 Step 2 锁定 backend / store / bus / OTel / scheduler 产品 | 否 | 范围分层 | 不适用 | 无回写 |
| P2 overlay / dynamic reload / advanced routing 当前不进入 P0 | 否 | 非范围 / 演进口径 | 不适用 | 无回写 |
| 当前 Step 未新增 runtime config 字段、adapter constructor、trait / port、error、DTO、flow、state 或 audit schema | 否 | 范围确认 | 不适用 | 无回写 |

本 Step 当前没有 `待回写` 或 `阻塞待确认` 项。后续若 P1 / P2 需要新增 config carrier、builder branch、adapter surface、状态、错误或审计字段,必须先回写 `03`。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对详细设计的影响判定”和“待确认事项”小节,了解配置目标、P0 / P1 / P2 范围、无配置路径和非范围风险如何收敛。

正式 `04-配置设计.md` §2 应回填:

- 配置设计目标表。
- 本轮覆盖范围表。
- P0 / P1 / P2 配置口径。
- 非范围表及去向。
- 无配置路径判定:`L4-sandbox` 不是无配置项目。
- 用户重点边界覆盖审计。
- 非范围残余风险表。

回填要求:

- 不得写具体 raw key、默认数值、环境变量、secret 路径、部署命令或产品已选结论。
- 不得把 deterministic fake 描述为真实 host execution 或弱隔离 fallback。
- 不得把 P1 / P2 产品化和高级扩展挤入 P0 默认。
- 不得继承旧 README / `05/06` 的旧 backend、旧对象、旧环境配置或旧 SLO。
- 不得在 `04` 中静默新增影响 `03` 的代码契约。

---

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 isolation backend 产品组合、capability matrix 和 stronger profile 触发条件 | 影响 profile schema、adapter binding、secret、测试承载和验收证明 | Step 6 / 7 / 14 product-neutral 收敛;必要时 ADR / `07` 裁决。 |
| P1 durable store / bus / OTel / metric / DLQ / scheduler / secret provider 产品 | 影响 config item、默认、credential ref 和失效策略 | Step 7~14 用 typed ref / disabled / unavailable / 待确认表达,不伪造产品。 |
| network / fs / process profile 具体清单与安装方式 | 影响实际 boundary 证明 | `04` 定义语义和校验;部署运维手册定义落地操作;旧 README 不继承。 |
| retention / retry / cadence / batch / parallelism 数字 | 影响 idempotency、relay、cleanup、job 和 capacity | Step 6 / 7 / 11 收敛;缺依据时不伪造性能目标。 |
| 旧 `05/06` 何时重建 | 影响环境矩阵、negative gate、veto 和 evidence | Step 12 交接;正式 `04` 完成后按顺序进入 `05/06`。 |
| P2 multi-region / overlay / dynamic reload 是否进入近期路线 | 可能需要 `03` 新 carrier / builder / flow | Step 13 作为演进触发;进入前重新打开配置设计并回写 `03`。 |

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置设计目标已明确 | 通过 | 见 §9.1。 |
| 配置范围与非范围已收稳 | 通过 | 见 §9.2 / §9.4。 |
| P0 / P1 / P2 配置口径已明确 | 通过 | 见 §9.3。 |
| 无配置路径已判定 | 通过 | 本仓不是无配置项目,Step 3~13 全部适用。 |
| 用户重点边界已覆盖 | 通过 | 见 §9.6。 |
| 非范围残余风险已登记 | 通过 | 见 §9.7。 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无具体 `待回写` / `阻塞待确认` 项。 |
| 可进入 Step 3 | 已通过 | 用户已确认本 Step;Step 3 `建立配置控制面总览` 已独立完成并等待审查。 |
