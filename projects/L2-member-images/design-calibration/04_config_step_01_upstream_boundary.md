# L2-member-images 04 配置设计 Step 1：确认配置输入边界

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1  
> 回填位置：正式 `04-配置设计.md` 第 1 章“与上游文档的关系声明”  
> 本步边界：只收稳配置输入、权威层级与不回答事项；不定义实际后端、secret、endpoint、数值策略或实现。

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 1：确认配置输入边界 |
| 输入基线 | 重建版正式 `00~03`；`03_ddd_step_14_config_dependencies.md`、Step 17/18；适用规范、已停审 owner 文档及台账 |
| 历史材料 | README、旧正式 `05/06` 与旧 draft 只作 historical / direction audit，不能定义配置真相 |
| 下游材料 | 新版 `05/06/07` 尚未生成；旧 `05/06` 不反向定义配置项、环境、测试事实或验收事实 |
| 本步结果 | 配置设计不是无配置路径；其当前可收敛范围是 body-free、product-neutral、fail-closed 的 infra composition 控制面 |
| 进入条件 | 全部 SOP 问题、输入映射、03 影响判定与 blocker 已收稳；允许创建 Step 2 |

## 2. 本步目标、输入与输出

### 2.1 本步目标

确认哪些已有事实可以进入配置设计，哪些只能保留为 pending / blocker，避免由配置反向创造 Role mapping、构建产物、Artifact、consumer 或运行态事实。

### 2.2 本步输入

| 输入 | 当前状态 | 本步限定用途 |
|---|---|---|
| `00-需求文档.md` | 当前正式基线 | 承接镜像资产供给职责、static/live 红线、pin/no-`latest`、五段 staged truth 与 fail-closed 要求。 |
| `01-架构设计.md` | 当前正式基线 | 承接依赖裁剪、产品中立、authority-bounded change 与 local / external state 分层。 |
| `02-概要设计.md` | 当前正式基线 | 承接配置影响轮廓、禁止配置化边界以及 03/04 分工。 |
| `03-详细设计.md` | 当前正式基线 | 直接承接 `infra/config.rs`、`infra/runtime_builder.rs`、carrier、slot、fake、外部 seam、错误与测试切口。 |
| `03_ddd_step_14_config_dependencies.md` | 已完成字段级来源 | 承接 raw-config 读取边界、slot 分类、local assembly、依赖分类和 fail-closed 规则。 |
| `03_ddd_step_17_implementation_handoff.md`、`03_ddd_step_18_risks_open_questions.md` | 已完成交接/风险输入 | 承接不应提前生成的配置事实、实现前阅读项、local blocker 与 owner reopen 条件。 |
| 配置 SOP/书写规范、通用规范、真相源标准、依赖裁剪规则 | normative | 约束 Step 顺序、JSON 规则、03 回写纪律、真相源与 seam 分类。 |
| `L2-runtime`、`L2-tools`、`L3-method-library`、`L1-artifact`、`L4-sandbox`、`L0-core` 的当前正式文档/台账 | owner input | 只消费已闭合 owner boundary；不复制正文、产品、schema、readiness 或实现事实。 |
| `L2-member`、`L2-member-service` 当前材料/台账 | 并行 sibling pending | 只保留 component supply / pinned entry consumer 方向及 `MI-UP-001/002`；不形成双方合同。 |

### 2.3 本步输出

- 上游输入映射表与配置设计必须/不得回答清单。
- 配置域候选和下游承接方向。
- blocker、准入与详细设计影响初判。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异？ | 承接静态镜像输入与 live state 分离、必要 pin、无 `latest`、本地组合不等 readiness、配置不得越过 owner / stage / dependency 边界，以及 local / CI / staging / production 的安全 profile 差异。没有获 authority 的性能、容量、timeout、retry、retention 或产品参数。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计？ | 进入的是现有 `ImageRuntimeConfigRef`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode`，以及由 `infra/config.rs` / `infra/runtime_builder.rs` 进行私有读取与装配的 slot/port 边界。 |
| 哪些测试和验收场景依赖配置矩阵？ | 后续 `05` 应验证 raw config 只在 infra、缺失/未知 slot blocked、Production 拒绝 FakeOnly、TestOnly 显式和 Assembled 非 readiness；`06` 应裁决这些配置门禁。它们尚未形成测试、验收、evidence 或 verdict。 |
| 哪些内容不应在配置设计中重新定义？ | 不重定义 RoleDefinition/Role mapping、image identity/history、domain state/UoW/version/recovery、port/DTO/flow、runtime loop、tool execution、Artifact、consumer confirmation、容器生命周期、Sandbox/gate/approval/observability truth，也不重写部署命令或实施 phase。 |
| 当前上游是否存在会阻塞配置设计的缺口？ | 不阻塞收敛 P0 的 local composition 控制面；阻塞任何 real adapter、product binding、positive build/gate/Artifact/consumer lane。`MI-UP-001~009`、`Q-MI-001~004` 与本仓 `DDD-*`/`PF-*` 继续显式开放。 |

## 4. 当前材料与历史材料诊断

| 位置 | 诊断 | 本步处置 |
|---|---|---|
| 正式 `04-配置设计.md` | 当前不存在，不能由旧 `05/06` 反推。 | 从 Step 1~15 重建；正式正文只在 Step 15 装配。 |
| 正式 `03` §13 | 已定义 carrier、读取者、slot 与禁止项，但未定义来源、JSON、profile、敏感性、变更或失效细节。 | 作为 04 的唯一代码 binding 输入，不重复定义 Rust 类型。 |
| builder / registry / gate / Artifact / Member Service seam | 只有保守 port / slot 与 gap 方向，缺产品或 exact consumer/handoff contract。 | 只配置 non-positive composition 与显式 TestOnly fake；不得给出 endpoint、credential、manifest、digest、gate 或 confirmation。 |
| `L2-member`、`L2-member-service` | 仍在同一并行窗口。 | 按 ref/runtime/adapter direction 记录 pending，不产生源码依赖或正向 readiness。 |
| README、旧 `05/06`、旧 draft | 含旧技术、旧指标、旧状态或历史方向的潜在污染。 | 不用于 key、默认值、产品、环境结果或验收结论；仅在 Step 14 后置检查。 |

## 5. 改动前后对比与设计取舍

| 议题 | 改动前 / 风险 | 本步结论 | 取舍理由 |
|---|---|---|---|
| 配置是否存在 | 容易因尚无 real adapter 误判为“无配置项目”。 | 存在窄 P0 配置面：安全 composition / profile / TestOnly fake 隔离。 | 03 已有 config ref、slot、assembly 和 fake carrier。 |
| raw config 可见性 | application 或 entry 可能读取环境、secret 或 endpoint。 | 只有 planned `infra/config.rs` 与 `infra/runtime_builder.rs` 可读/校验 raw configuration。 | 保持 `contracts -> domain -> application` 方向和 body-free 边界。 |
| external pending | 容易把 slot、available 或 fake 当作 external success。 | local composition 与 external positive lane 严格分层。 | `Assembled` / `Available` 不等 runtime、build、gate、Artifact、consumer 或 readiness。 |
| 配置来源 | 旧材料可能诱导 env、产品或部署细节。 | 只从当前正式基线重建；具体来源优先级留 Step 5。 | full-restart 与历史污染隔离。 |
| 详细设计影响 | 04 可能静默新增 carrier/constructor。 | 当前只展开已定义 binding；任何代码契约变化必须回写 03。 | 配置设计不能替代详细设计。 |

## 6. 结构化中间产物

### 6.1 上游输入映射表

| 来源文档 / 输入 | 可进入 04 的配置输入 | 回填章节 |
|---|---|---|
| `00` | static/live、pin、supply 与 external owner 边界；无产品/数值基线 | §1、§2、§4、§11、§14 |
| `01` | 产品中立、依赖分类、authority-bounded change、无 global ready | §1、§3、§4、§10、§14 |
| `02` | source / adapter / projection / job / composition 影响轮廓和禁止配置化项 | §1~§4、§12 |
| `03` §13 | raw-read owner、runtime builder、carrier、slot、fake、external seam 与不可用语义 | §1、§3~§11 |
| `03` §14/15 | redaction、local assembly signal、config/fake test seam | §8、§9、§11、§12 |
| `03` Step 17/18 | 实施前不得猜 key/product、blocker/reopen 条件 | §12、§14 |
| owner formal documents | Role/method、runtime/tools、Artifact、Sandbox、Core 的外置责任与 ref/adapter 边界 | §1、§4、§14 |
| sibling pending | member component / member-service consumer 方向 | §1、§3、§14 |

### 6.2 配置设计不再回答的问题

- RoleDefinition 与 Role-to-image-variant mapping 的内容、owner 或 consumer query schema。
- member/runtime/tools/supervisor/extras 的正文、release 兼容性、live memory、checkpoint、workspace live state。
- builder、registry、secret store、scanner、signer、evidence、store、broker 或 container 产品及其 endpoint / credential / body。
- candidate、digest、provenance、gate pass、Artifact acceptance、availability、consumer confirmation、launch、health、readiness。
- `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` 的算法或恢复策略。
- route、topic、event envelope、receipt、dedup、scheduler、cron、lease、retry、timeout、retention、run/report/evidence，以及任何 outbound publisher。

### 6.3 配置设计必须回答的问题

- 哪些 private infra composition 行为可配置、哪些不变量禁止配置化。
- JSON 来源、优先级、冲突、profile、敏感性、加载、交叉校验、冷生效、变更与失效规则。
- `ImageRuntimeConfigRef`、slot、fake mode 和 assembly 如何保持 body-free / fail-closed。
- local / CI / staging / production 之间如何禁止 fake 污染与 readiness 误报。
- 05/06/07/09 将如何承接配置安全门禁，而不把 planned 设计写成执行事实。

### 6.4 初始配置域与下游方向表

| 配置域 | 当前可收敛内容 | 不可收敛内容 | 下游方向 |
|---|---|---|---|
| composition identity / mode | P0 profile、body-free config ref、Production/TestOnly 隔离 | config authority body、runtime lifecycle | 05 negative config seams；06 safety gate；07 planned wiring |
| test fake selection | 显式 TestOnly 与 `FakeOnly` slot 的配对 | fake production fallback、external success | 05 fixture isolation；06 fake leakage veto |
| slot / adapter composition | slot 分类、local marker、blocked/unknown 行为 | provider/product/endpoint/credential/positive result | 05 slot matrix；07 owner-gated private binding |
| source / artifact / consumer seams | ref/adapter/pending 分类与 gap | mapping body、Artifact ref、manifest/confirmation | 05 fail-closed cases；06 no-positive claim |
| redaction / diagnostics | raw config/secret/body 禁止输出 | observability backend、retention、alert product | 05 redaction test；09 operational detail |

### 6.5 blocker 与准入表

| blocker / pending | 对 04 的影响 | 未确认前处理 |
|---|---|---|
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 配置不得成为写、history terminal、replay 或 recovery 的旁路。 | 维持 zero-effect / no-write / no-repair 语义。 |
| `MI-UP-001/002/003/006/007/008` | 阻塞 consumer、component、mapping、seed、Artifact、base 的正向 binding。 | only ref/gap/blocked/unknown；不写 body 或 private product schema。 |
| `MI-UP-004/005/009` | 阻塞 Core compile、inbound event activation 与 outbound event。 | active Cargo dependency 为零；marker-only inbound；outbound config 严格为零。 |
| `Q-MI-001~004` | 阻塞 special scope、architecture、product和gate/evidence inventory。 | product-neutral；不列 product/secret/gate/default pass。 |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 04 承接现有 raw-read / builder / carrier / slot 绑定 | 否 | 既有详细设计输入 | 不适用 | 无回写 |
| P0 将只定义来源、profile、JSON、敏感性、校验、冷生效和 fail-closed 语义 | 否 | 配置控制面细化 | 不适用 | 无回写 |
| 当前不新增 runtime config carrier、builder 参数、port、error、DTO 或 flow | 否 | 契约保持 | 不适用 | 无回写 |
| 后续若引入 real provider、remote config、reload、secret resolution 或产品级 constructor schema | 否（当前未进入范围） | future design-change trigger | 触发时回到 `03` §5/§13 及对应 calibration Step | 无回写 |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“上游输入映射表”“配置设计不再回答的问题”“配置设计必须回答的问题”“blocker 与准入表”和“对详细设计的影响判定”。

正式 `04-配置设计.md` §1 应声明：本文以重建版 `00~03` 和 `03` §13 为直接输入，只扩展 private infra composition 的控制面；仅 `infra/config.rs` 和 `infra/runtime_builder.rs` 可处理 raw configuration；现有 carrier 和 local assembly 不代表任何 external / runtime readiness。并行 sibling 与未闭合 owner 合同维持 pending，旧 05/06/README/draft 不成为配置真相源。

## 9. 待确认事项

| 事项 | 当前影响 | 处理方式 |
|---|---|---|
| owner-safe real adapter / product binding | 阻塞 production positive composition。 | 在 Step 14 保持 pending；未来 owner 关闭后重开受影响 03/04 Step。 |
| exact consumer / Artifact / mapping / component / seed contract | 阻塞相应 positive ref/handoff。 | 只保留 typed gap / blocked，不能配置化补齐。 |
| 真实 secret provider、remote config、reload/LKG | 不属于 P0。 | 仅作 P2 future trigger；若启用先审计 03 影响。 |

## 10. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 输入文档清单明确 | 通过 | §2.2、§6.1。 |
| 配置设计边界明确 | 通过 | §3、§6.2、§6.3。 |
| historical / sibling / owner 层级未混同 | 通过 | §2.2、§4、§6.5。 |
| 未写入 key、产品、endpoint、secret、数值或部署动作 | 通过 | 本 Step 仅定义输入与边界。 |
| 03 影响已判定且无待回写/阻塞待确认 | 通过 | §7。 |
| 可创建 Step 2 | 通过 | 下一步收敛 P0/P1/P2 范围和非范围。 |

```text
step_01 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_02_scope
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
