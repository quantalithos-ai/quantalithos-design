# Step 7. 定义配置项清单

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节: `04-配置设计.md` §7 配置项清单
> 状态: reviewed_passed_to_step_8
> 完成日期: 2026-07-10

## 1. Step 开工确认与状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 `定义配置项清单` |
| 当前状态 | 已完成,等待用户审查 |
| 进入依据 | 用户已明确确认 Step 6,本次只推进一个 Step |
| 输入基线 | Step 3 控制面;Step 4 分类边界;Step 5 来源优先级;Step 6 profile 矩阵;正式 `03` §13 / §14;详细设计 Step 14 / Step 15 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_07_config_items.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md` 仍不存在;只允许 Step 15 装配 |
| 停审方式 | 本 Step 完成后暂停;用户确认前不得进入 Step 8 |

## 2. 本步目标

本 Step 把 `L4-sandbox` P0 配置项收敛为可实现、可校验、可测试的字段级清单,并给 P1 条件字段留下不伪造产品选型的 opaque-ref 承载面。

本 Step 回答:

- 每个 P0 配置项的稳定名称、精确类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和读取模块。
- D01~D44 每个配置域由哪些配置项或 design boundary 承接。
- 每个配置项如何回指 Step 3 控制面、Step 4 分类、Step 5 来源、Step 6 profile 和正式 `03` 配置载体。
- 项目本地严格 JSON 如何按功能模块拆分,以及完整 JSONC 文档示例如何表达。
- D37 runtime log / metric 与 S04 secure material 在不新增 `03` public contract 的前提下如何承载。
- 每个配置域是否通过停审,以及跨配置项是否存在重复、泛化模块、必填无失败策略、敏感级别遗漏或 `03` 回写缺口。

本 Step 不定义:

- S04 provider 产品、secret material 类型、读取、缓存、轮换、吊销和审计流程,这些属于 Step 8。
- loader / validator 函数、错误 enum、交叉校验执行顺序和 builder handoff,这些属于 Step 9。
- 配置变更审批、变更审计、回滚、漂移处置和运行期 reload,这些属于 Step 10;P0 当前没有 reload。
- 完整失效模式、告警和降级矩阵,这些属于 Step 11。
- Docker、gVisor、Firecracker、Kubernetes、DB、bus、OTel、scheduler、secret provider 或真实 endpoint / topic / credential 选型。
- 部署命令、实现代码、测试结果、run_id、evidence alias、验收签署、implementation ledger、planned boundary skeleton 或 commit。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | reviewed | 提供 11 个控制面、D01~D44、唯一 raw owner 和模块读取边界 |
| `04_config_step_04_categories_boundaries.md` | reviewed | 提供 CAT-00~10、startup / loop / run / fixture 生效边界和 NCFG-01~24 |
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供 S00~S08、`S01 < S02 < S03`、S04 / S05 / S06 独立通道和 C01~C27 |
| `04_config_step_06_environment_profiles_matrix.md` | reviewed_passed_to_step_7 | 提供 ENV-01~07、PROFILE-01~07、真实 workload 资格和逐域 profile 差异 |
| `projects/L4-sandbox/03-详细设计.md` §13 / §14 | current formal baseline | 提供配置引用、外部依赖、日志 / 指标 / audit / diagnostic / redaction 边界 |
| `03_ddd_step_14_config_external_binding.md` | direct field input | 提供 runtime / store / adapter / boundary / retry / retention / handoff / feature binding |
| `03_ddd_step_06_object_contracts.md` | carrier input | 提供 `SandboxRuntimeConfigSummary`、`SandboxAdapterKind` 和 infra carrier 边界 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | adapter input | 提供 config port、runtime builder、adapter / store / clock / id 注入接缝 |
| `03_ddd_step_15_observability_audit.md` | observability input | 提供 runtime telemetry、formal audit、diagnostic 和 redaction 分层 |
| 旧 `README.md`;旧 `05/06` | historical only | 只用于冲突审计;不得生成 host runtime、cleanup-disabled、旧 allowlist 或产品默认值 |

## 4. SOP 问题回答

| SOP 问题 | 本 Step 回答 |
|---|---|
| 每个 P0 项名称、类型、默认值是什么 | §9.2 按控制面列出 101 个字段级 item,其中 97 个属于 runtime / loop / job 配置,4 个属于 test-owned fixture;§9.1 定义精确类型;结构默认值由对应严格 JSON demo 完整给出。 |
| 哪些项必填 | 每项标记 `required`、`conditional`、`test-only` 或 `derived/non-loadable`;conditional 项同时给出触发条件和失败策略。 |
| 来源和作用域是什么 | ordinary item 只使用 S01 / S02 / allowlisted S03;S04只解析已选 opaque ref;S05只选择 entry / loop / job local 输入;S06只写 test-owned slot。 |
| 如何生效、是否敏感、失败如何处理 | P0 runtime item 在 startup 冻结;loop / job ceiling 在新 run 冻结;fixture仅 test harness。敏感级别使用 `public/internal/sensitive/secret`,普通 JSON 不出现 `secret` material。 |
| 关联哪些模块 | raw key 只由 `infra/config.rs` 读取;builder和具体 infra adapter读 validated refs;entry只读 selector / typed run input;application/domain/contracts不读 raw config。 |
| 模块 JSON demo 如何写 | §9.5 对每个顶层功能模块给独立严格 JSON demo,每个 demo 后紧跟配置项说明表。 |
| 是否避免泛化模块 | 是。不使用顶层 `runtime`、`storage`、`stores`、`common` 或 `misc`;store、handoff、安全收束和观测均按 owner 拆分。 |
| 是否避免项目名前缀 | 是。项目本地 JSON 不重复 `sandbox` 前缀;只有正式 topic-neutral protocol key 保留 `sandbox.*`。系统级聚合映射另见 §9.1.4。 |
| 完整 demo 是否误导为支持注释 | 否。§9.6 标注为 JSONC 文档示例,并明确运行文件必须删除注释后成为严格 JSON。 |
| 是否回指 Step 3~6 和 `03` | 是。每个 item 带 Domain ID;§9.3 对 D01~D44 给控制面、分类、来源、profile 和 `03` binding。 |
| 是否逐域停审 | 是。§9.7 对 D01~D44 各记录一次停审结论。 |
| 跨项缺口是否闭合 | §9.8 审计字段唯一性、required failure、敏感性、环境差异、D37 / S04 carrier 和 `03` 影响。当前无 unresolved conflict。 |

## 5. 当前文档问题诊断

| 诊断项 | Step 7 前状态 | 本 Step 处理 |
|---|---|---|
| raw key / type / default | `03` 只给 typed binding,未给 raw schema | 建立项目本地 lowerCamelCase JSON schema和精确 P0 default |
| D01~D44 到字段 | 控制面 / 分类 / source / profile 已有,字段未闭合 | 每域映射到一个或多个 item;D03 / D04 / D43 / D44 明确 derived / non-loadable |
| D37 carrier | Step 3~6 保留 watch;`SandboxAdapterKind` 无 telemetry sink variant | 定义 infra-private validated telemetry section;不伪造 availability port或新 summary 字段 |
| D38 audit carrier | formal audit 必须同 UoW,但无独立 audit adapter kind | `auditTrace.routeProfileRef` 只能选择 truth-store UoW route;不能关闭或外置为 metric |
| S04 carrier | exact provider / port 未定义 | item只保存 opaque `*ProfileRef` / target / route ref;P1 material解析留 Step 8,不进入 summary / log |
| P0 fake 与真实执行 | 旧材料存在 host runtime线索 | P01~04默认 non-executing fake;任何 real-like缺 binding 都拒绝,不 fallback fake / host |
| 泛化模块 | 参考文档存在 `runtime` / `stores` 聚合写法 | 本项目按功能 owner拆成独立顶层模块,不继承泛化组织 |
| 数值默认 | `03` 把 timeout / retry / retention / batch留给 `04` | 只给 deterministic P0 contract default和校验范围;不宣称 production sizing |

## 6. 改动前后对比

| 维度 | Step 7 前 | Step 7 后 |
|---|---|---|
| 可落码粒度 | typed config ref轮廓 | raw JSON key、type、default、source、scope、failure和module可直接转 loader schema |
| profile可执行性 | profile矩阵只描述差异 | P01 strict JSON默认组合可逐字段加载;P05~07仍需显式真实binding |
| 安全边界 | NCFG禁止项与字段分离 | 每个相关字段写明fail-fast / fail-closed且不存在放宽hard guard的bool |
| 可观测性 | sink / sampling exact carrier为watch | infra-private validated section闭口;独立availability仍是未来`03`回写触发 |
| sensitive ref | 只知道S04独立lane | ordinary config只保存opaque ref,raw material从未成为JSON item |
| 下游测试 | D01~D44只有概念矩阵 | 每个字段有默认、范围、条件和negative failure切口 |

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| strict validation是否做 bool | A. `strictValidation`;B. 固定 design boundary | 采用 B。允许 `false` 会制造绕过项,固定按 D03 / NCFG 校验。 |
| store是否放入`stores` | A. 聚合;B. 每个 logical store独立模块 | 采用 B。truth / projection / derived / reference / relay / idempotency owner和失败面不同。 |
| boundary是否展开四个raw profile | A. 四个可独立ref;B. 一个coherent limit template | 采用 B。`limitTemplateRef` 必须同时包含 resource / filesystem / network / process四维,防止partial组合。 |
| D37是否新增public carrier | A. 新 summary field / adapter kind;B. infra-private validated section | 采用 B。现有`03`允许`infra/config.rs`装配adapter-specific refs,但没有公开telemetry availability contract。 |
| D38是否可选 | A. 配置enabled;B. 必填route且不可关闭 | 采用 B。accepted audit是UoW不变量,不能由feature bool关闭。 |
| sensitive material是否进JSON | A. raw credential / endpoint;B. opaque ref only | 采用 B。P0 fake ref不调用S04;P1 ref由Step 8定义的S04解析。 |
| retry / cadence是否直接写算法 | A. numeric algorithm;B. versioned policy ref + bounded batch / timeout | 采用 B。算法不在配置文档重定义;raw数值只用于明确技术包络。 |
| P0默认是否启真实workload | A. local可host-run;B. non-executing fake | 采用 B。正式真实workload只在PROFILE-05受控conformance资格下出现。 |
| event feature如何组合 | A. 三个bool互不约束;B. 普通outbound为基础、derived依赖基础、reconciliation读面独立 | 采用 B。I014控制10个core truth event和1个projection event;I015要求I014=true后追加derived event;I016独立注册query/job,仅在I014=true时追加reconciliation event。 |
| material handoff是否新增enabled bool | A. 新增第四个feature bool;B. 非空target registry即启用 | 采用 B。I056=`[]`表示未启用,1~16个已注册target表示启用;避免bool与target registry形成双真相源。 |
| D44是否给reload key | A. 给disabled key;B. 无raw key | 采用 B。即使默认false也会伪造loader carrier;D44保持design-time trigger。 |

## 8. Step 内执行记录

| 序号 | 动作 | 状态 | 产出 |
|---:|---|---|---|
| 1 | 重读SOP Step 7、书写规范§4.4~4.9 / §5.7 | done | 确认字段最小列、strict JSON、JSONC和逐域停审要求 |
| 2 | 重读Step 3~6及正式`03` §13 / §14 | done | 建立D01~D44与现有config carrier清单 |
| 3 | 复核D37、D38、S04 exact carrier | done | 采用infra-private telemetry、truth-UoW audit、opaque ref边界 |
| 4 | 定义类型、item和来源allowlist | done | §9.1~§9.4 |
| 5 | 定义模块demo和完整demo | done | §9.5~§9.6 |
| 6 | 逐域停审和跨项审计 | done | §9.7~§9.8 |
| 7 | 复核feature / handoff交叉启用条件 | done | 固定13类outbound分组和三类handoff唯一启用源 |
| 8 | 判定`03`影响 | done | 当前无需回写;保留明确reopen trigger |

## 9. 结构化中间产物

### 9.1 命名、类型和组织规则

#### 9.1.1 顶层模块规则

| 规则 | 结论 |
|---|---|
| 文件格式 | runtime配置文件只接受严格 JSON;duplicate key、unknown key、注释、trailing comma均拒绝 |
| JSON字段风格 | lowerCamelCase;项目本地顶层不重复`sandbox` |
| 顶层粒度 | 一个顶层键只对应一个功能owner;不使用`runtime/storage/stores/common/misc` |
| opaque ref | 外部值只保存family可验证的opaque ref;不得包含endpoint、topic原名、credential或body |
| 数值单位 | key名显式带`Bytes`、`Millis`或`Seconds`;不接受无单位数字 |
| 默认口径 | 本文默认只代表PROFILE-01 `local-contract` deterministic P0;不代表production sizing或qualification |
| optional表达 | JSON使用`null`或空集合仅在表格明确允许时成立;required项不能靠empty表示disabled |
| map闭集 | inbound binding和event route map只接受本文列出的formal key;unknown key严格拒绝 |
| 生效边界 | startup snapshot、new-loop snapshot、new-job snapshot、entry-local selector、test-owned slot五类;P0无hot / reload |
| raw owner | 只有`crates/infra/src/config.rs`解析JSON/env;其他模块只接收validated typed value |

#### 9.1.2 精确类型词汇表

| 类型 | JSON表示 | 精确约束 |
|---|---|---|
| `ProfileName` | string | `local-contract`,`ci-contract`,`integration-seam`,`operations-simulation`,`backend-conformance`,`staging-like`,`production-like`;最后一项当前activation reject |
| `OpaqueRef<F>` | string | ASCII 1~256字符;必须匹配slot family前缀;禁止空白、URI、raw endpoint、topic、secret或body |
| `OptionalOpaqueRef<F>` | string or null | 非null时满足`OpaqueRef<F>`;null只允许表格标记conditional / disabled的slot |
| `UniqueRefList<F,N>` | array of string | 长度0~N或1~N由item规定;顺序稳定、元素唯一、每项满足family |
| `ByteSize` | integer | 1~16,777,216 bytes;不得使用字符串单位 |
| `PageLimit` | integer | 1~1,000 |
| `Parallelism` | integer | 1~64;PROFILE-01 / 02默认1 |
| `DurationMillis` | integer | 1~3,600,000 ms |
| `DurationSeconds` | integer | 1~31,536,000 seconds |
| `Bool` | boolean | 只接受JSON `true` / `false`,不接受字符串或数字 |
| `LogLevel` | string enum | `error`,`warn`,`info`,`debug`;不支持`trace`,且任何level都受safe-output gate约束 |
| `Rfc3339Instant` | string | UTC RFC3339,只允许deterministic fixture slot |
| `InboundBindingMap` | object | 恰好9个formal consumer key;每值为`{enabled,sourceProfileRef,schemaVersions,quarantineProfileRef}`;enabled时后3项满足约束 |
| `RouteBindingMap` | object | 恰好13个topic-neutral event key到`OpaqueRef<Route>`;enabled event必须有非nullbinding |
| `OptionalU64` | integer or null | 非null时0~9,007,199,254,740,991;只允许test-owned deterministic seed |
| `ForbiddenFieldClassList` | array of enum string | 元素唯一;必须至少包含本文immutable forbidden set;高层只能增加不能删除 |

#### 9.1.3 敏感级别应用

| 级别 | 本 Step 用法 |
|---|---|
| `public` | profile枚举、formal event key等可公开标识;当前很少直接作为item |
| `internal` | batch、timeout、retention、cadence、feature composition等内部运行参数 |
| `sensitive` | store / adapter / target / route / source / policy / backend opaque ref;不得原样进入log / audit / report |
| `secret` | raw token、password、private key、certificate material;本文配置项清单中必须为零,只允许Step 8 S04受控material |

#### 9.1.4 系统级聚合映射

项目本地文件使用`configIdentity.profile`。若未来系统级聚合文件已经由上层设计正式批准,可机械映射为`sandbox.configIdentity.profile`;该映射不是当前loader能力,不得据此引入multi-project overlay或reload。

#### 9.1.5 Feature 与 Handoff 交叉启用规则

13类formal outbound event固定分为四组,不得由配置重命名、合并或改变payload schema:

| Event组 | Formal key | 启用条件 |
|---|---|---|
| core truth,10类 | `sandbox.execution-context.changed.v1`;`sandbox.boundary.changed.v1`;`sandbox.policy-decision.changed.v1`;`sandbox.run.changed.v1`;`sandbox.capture.changed.v1`;`sandbox.material-handoff.changed.v1`;`sandbox.failure.changed.v1`;`sandbox.control.changed.v1`;`sandbox.cleanup.changed.v1`;`sandbox.redline-containment.changed.v1` | I014=true |
| projection,1类 | `sandbox.projection.changed.v1` | I014=true |
| derived,1类 | `sandbox.derived-view.changed.v1` | I014=true且I015=true |
| reconciliation,1类 | `sandbox.reconciliation-finding.available.v1` | I014=true且I016=true,并且只有finding report存在时append |

Feature cross-field规则:

| 规则ID | 条件 | 必须满足 | 失败策略 / 不变量 |
|---|---|---|---|
| FC-01 | I014=false | I015必须为false;普通outbound append和publish runtime不注册 | I015=true属于冲突配置并startup fail-fast;已有relay truth不删除、不改写 |
| FC-02 | I014=true | I021 relay store、I050 publisher、I052~I054 relay包络和10类core truth + 1类projection route完整 | 任一依赖不完整startup fail-fast;publish failure不回滚source truth |
| FC-03 | I015=true | I014=true、I019 derived store和derived route完整 | 任一依赖不完整startup fail-fast;只启用derived event append,不改变derived state / truth边界 |
| FC-04 | I016=true,I014=false | I019 derived store、reconciliation query / job / report surface完整 | query / job可独立注册;不得创建reconciliation relay record,不得auto-fix |
| FC-05 | I016=true,I014=true | FC-02依赖、I019、reconciliation query / job / report surface和reconciliation route完整 | finding report存在时才append event;无finding不得伪造event |
| FC-06 | I016=false | reconciliation query / job不注册 | 即使I014=true也不得append reconciliation event |

`eventRoutes.bindings`始终保持13-key closed map,使schema和profile diff稳定;feature bool只决定哪些formal event family会实际append / publish,不改变route key、event kind、payload或cursor。

Handoff只允许以下三个启用源,不得再从adapter ref、S05 selector或是否存在fixture推断启用:

| Handoff类型 | 唯一启用源 | disabled形态 | enabled依赖 | 冲突处理 |
|---|---|---|---|---|
| material | I056 `materialHandoff.targetRefs`非空 | I056=`[]` | I056为1~16个唯一且已注册、material-class兼容的target;I055 adapter可用 | target unknown / mismatch或adapter不可用时startup fail-fast;job local selector只能选I056子集 |
| observability material | I048 `executionCapture.observabilityMaterialEnabled` | I048=false且I058必须为`[]` | I048=true,I058为1~16个唯一且已注册的safe target,I057 adapter可用,redaction完整 | bool/list冲突、target unknown或binding不完整startup fail-fast;不得替代formal audit |
| investigation / escalation | I074 `redlineSafety.containmentHandoffEnabled` | I074=false且I060必须为`[]` | I074=true,I060为1~16个唯一且已注册的approved target,I059 adapter可用 | bool/list冲突或target unknown startup fail-fast;runtime delivery failure保持pending / contained,receipt不得解除guard |

I055/I057/I059作为required schema项始终执行类型、family和profile一致性校验;只有对应handoff启用后才装配delivery能力。P05~P07仍受D43完整binding和no-fake-fallback规则约束,disabled不构成保留fake ref的豁免。

### 9.2 配置项总表

来源简写是闭集:

| 简写 | 含义 | 约束 |
|---|---|---|
| `G123` | S01 code default < S02 selected JSON < S03 allowlisted env | S03只允许当前item的scalar / single opaque ref;非法高层值拒绝且不fallback |
| `G12` | S01 < S02,不允许S03 | 用于object map、ref list和安全集合,防止env注入结构化body |
| `G23` | S02 < S03,无可用S01真实默认 | conditional real binding;对应profile未启用时可absent,启用时缺失fail-fast |
| `M` | validated opaque ref之后进入S04 secure material lane | S04不覆盖ordinary值;P0 fake ref不调用真实material |
| `E` | S05 entry / loop / job-local typed selector | 只作用当前entry / new loop / new job,受global ceiling / registry约束 |
| `T` | S06 isolated fixture-owned slot | 只允许PROFILE-01~04中明示的test / simulation场景;PROFILE-05~07出现即拒绝 |
| `D` | derived / non-loadable carrier | 由validator / builder产生,没有JSON key、env或CLI override |

S03机械映射规则:只有来源列含`G123`或`G23`的item才进入allowlist。env名为`QUANTALITHOS_SANDBOX__<TOP_LEVEL_UPPER_SNAKE>__<FIELD_UPPER_SNAKE>`;例如`entryEnvelope.maxCommandBodyBytes`映射为`QUANTALITHOS_SANDBOX__ENTRY_ENVELOPE__MAX_COMMAND_BODY_BYTES`。未列S03的item即使能推导出同形env名也必须按unknown mapping拒绝。

#### 9.2.1 SBX-CP-01 启动装配与配置身份

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I001 `configIdentity.profile` | D02 / D41 | `ProfileName` | `local-contract` | required | G123 + E selector | runtime process | startup冻结;E只选择当前process | internal | unknown、inactive或多profile -> fail-fast;P05~07缺真实binding不得回退P01 | `infra/config.rs`;`runtime_builder.rs`;`SandboxRuntimeConfig.profile_ref`;summary `config_profile_ref` |

D01的config path / source selector不是JSON item,见§9.4 entry-local schema。D02的`config_ref`由merged canonical config生成redacted identity,来源为D且没有raw key。D03 strict validation和D04 builder result也是D,不提供`strictValidation=false`、`ignoreUnknown`、`skipAvailabilityCheck`等绕过项。

#### 9.2.2 SBX-CP-02 入口与负载包络

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I002 `entryEnvelope.maxCommandBodyBytes` | D05 | `ByteSize` | `1048576` | required | G123 | API / process entry | startup ceiling | internal | missing使用安全default;非法 / 超范围 -> API assembly fail-fast | `infra/config.rs`;`api/command_handlers.rs`;`SandboxBoundaryConfig.max_command_body_bytes` |
| SBX-CFG-I003 `entryEnvelope.maxQueryPageLimit` | D05 | `PageLimit` | `100` | required | G123 | API / process entry | startup ceiling | internal | 非法 -> API / repository list assembly fail-fast;request超限reject,不clamp | `infra/config.rs`;`api/query_handlers.rs`;repository list adapters;`max_query_page_limit` |
| SBX-CFG-I004 `entryEnvelope.syncCommandTimeoutMillis` | D05 | `DurationMillis` | `30000` | required | G123 | API / process entry | startup冻结 | internal | 非法 -> startup fail-fast;timeout映射existing unavailable / timeout surface,不取消已提交truth | `infra/config.rs`;API command wrapper;`sync_command_timeout` |
| SBX-CFG-I005 `entryEnvelope.queryReadTimeoutMillis` | D05 | `DurationMillis` | `10000` | required | G123 | API / process entry | startup冻结 | internal | 非法 -> startup fail-fast;runtime timeout按query degraded / unavailable映射且no-write | `infra/config.rs`;API query wrapper;`query_read_timeout` |
| SBX-CFG-I006 `entryEnvelope.defaultDiagnosticsMode` | D05 / D39 | enum string:`safe`,`quiet` | `safe` | required | G123 + E | API / process entry | startup default;E只影响当前entry | internal | unknown或试图请求raw / verbose body -> current entry reject;两种mode都执行redaction | `infra/config.rs`;API / worker / jobs entry diagnostic mapper;infra-private validated selector |
| SBX-CFG-I007 `workerEnvelope.defaultBatchSize` | D06 | `PageLimit` | `32` | required | G123 + E | worker loop | startup ceiling;new loop snapshot | internal | global非法 -> startup fail-fast;E越界 -> loop不启动,不clamp | `infra/config.rs`;`worker_runtime.rs`;consumer / fulfillment / relay loop typed parameter |
| SBX-CFG-I008 `workerEnvelope.maxParallelism` | D06 | `Parallelism` | `1` | required | G123 + E | worker loop | startup ceiling;new loop snapshot | internal | 非法 -> startup fail-fast;E超过ceiling -> loop reject | `infra/config.rs`;`worker_runtime.rs`;worker executor typed parameter |
| SBX-CFG-I009 `workerEnvelope.loopTimeoutMillis` | D06 | `DurationMillis` | `30000` | required | G123 | worker loop | startup default;new loop snapshot | internal | 非法 -> startup fail-fast;loop item timeout形成receipt / result failure,不造core success | `infra/config.rs`;worker loop wrapper |
| SBX-CFG-I010 `jobEnvelope.defaultBatchSize` | D07 | `PageLimit` | `50` | required | G123 + E | operations job | startup ceiling;new job snapshot | internal | global非法 -> startup fail-fast;typed job override越界 -> current job reject | `infra/config.rs`;`jobs/*`;`SandboxJobConfig.default_batch_size` |
| SBX-CFG-I011 `jobEnvelope.maxParallelism` | D07 | `Parallelism` | `1` | required | G123 + E | operations job | startup ceiling;new job snapshot | internal | 非法 -> startup fail-fast / current job reject | `infra/config.rs`;`jobs/*`;`SandboxJobConfig.max_parallelism` |
| SBX-CFG-I012 `jobEnvelope.jobTimeoutMillis` | D07 | `DurationMillis` | `300000` | required | G123 | operations job | startup default;new job snapshot | internal | 非法 -> startup fail-fast;timeout保存typed failed / partial report,不自动repair | `infra/config.rs`;job runner;`SandboxJobConfig.job_timeout` |
| SBX-CFG-I013 `jobEnvelope.retryPolicyRef` | D07 | `OpaqueRef<RetryPolicy>` | `retry-policy:job:deterministic-p0` | required | G123 | operations job | startup default;new job snapshot | sensitive | family不匹配 -> fail-fast;retry不得改变job idempotency key / typed request | `infra/config.rs`;job retry wrapper;`SandboxJobConfig.retry_policy_ref` |
| SBX-CFG-I014 `featureAssembly.outboundEventsEnabled` | D08 / D22~D24 | `Bool` | `false` | required | G123 | runtime assembly | startup registration | internal | true且publisher / relay store / relay包络 / 10类core truth + 1类projection route任一不完整 -> fail-fast;false要求I015=false且不删除已有relay truth | `infra/config.rs`;`runtime_builder.rs`;`SandboxFeatureConfig.outbound_events_enabled` |
| SBX-CFG-I015 `featureAssembly.derivedEventsEnabled` | D08 / D35 | `Bool` | `false` | required | G123 | runtime assembly | startup registration | internal | true要求I014=true且derived store / derived route完整,否则fail-fast;只控制derived event append,不控制derived state / truth语义 | `infra/config.rs`;runtime builder / derived relay helper;`derived_events_enabled` |
| SBX-CFG-I016 `featureAssembly.reconciliationEnabled` | D08 / D36 | `Bool` | `false` | required | G123 | runtime assembly | startup job / query registration | internal | true且derived store / query / job / report surface缺失 -> fail-fast;与I014无启用依赖,但仅I014=true时要求route并发布finding event;禁止auto-fix | `infra/config.rs`;job registry / query service / reconciliation relay helper;`reconciliation_enabled` |

#### 9.2.3 SBX-CP-03 存储、事务与重复回放

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I017 `truthStore.profileRef` | D09 | `OpaqueRef<StoreProfile>` | `store-profile:truth:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | missing / wrong family / unavailable UoW or audit capability -> fail-fast;P05~07无fake fallback | `infra/config.rs`;`runtime_builder.rs`;truth repositories / UoW;`truth_store_ref` |
| SBX-CFG-I018 `projectionStore.profileRef` | D10 | `OpaqueRef<StoreProfile>` | `store-profile:projection:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | selected store不可装配 -> startup fail-fast;运行不可用走existing degraded query | `infra/config.rs`;projection repositories;`projection_store_ref` |
| SBX-CFG-I019 `derivedStore.profileRef` | D10 / D36 | `OpaqueRef<StoreProfile>` | `store-profile:derived:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | invalid -> fail-fast;不得fallback到truth store或让derived成为truth | `infra/config.rs`;derived repositories;`derived_store_ref` |
| SBX-CFG-I020 `referenceStore.profileRef` | D11 | `OpaqueRef<StoreProfile>` | `store-profile:reference:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | invalid / unavailable -> startup blocked或resolver unavailable;不得保存external body | `infra/config.rs`;reference repositories / context resolver;`reference_store_ref` |
| SBX-CFG-I021 `relayStore.profileRef` | D12 | `OpaqueRef<StoreProfile>` | `store-profile:relay:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | I014=true而store不可用 -> startup fail-fast;publish failure不回滚source truth | `infra/config.rs`;relay repository / publisher;`relay_store_ref` |
| SBX-CFG-I022 `replayStore.profileRef` | D13 | `OpaqueRef<StoreProfile>` | `store-profile:replay:memory-p0` | required | G123 + M for real;T test store slot | repository registry | startup冻结 | sensitive | unavailable -> no mutation / startup fail-fast;不得对duplicate重算result | `infra/config.rs`;idempotency / stored result / receipt / report repositories;`idempotency_store_ref` |
| SBX-CFG-I023 `replayLifecycle.commandRetentionSeconds` | D13 | `DurationSeconds` | `86400` | required | G123 | repository registry | startup冻结 | internal | 非法或短于declared command retry window -> fail-fast | `infra/config.rs`;idempotency store;`command_retention` |
| SBX-CFG-I024 `replayLifecycle.eventDedupRetentionSeconds` | D13 / D21 | `DurationSeconds` | `86400` | required | G123 | repository registry | startup冻结 | internal | 非法或短于event redelivery window -> fail-fast | `infra/config.rs`;worker consumer / idempotency store;`event_dedup_retention` |
| SBX-CFG-I025 `replayLifecycle.jobRetentionSeconds` | D13 / D07 | `DurationSeconds` | `604800` | required | G123 | repository registry | startup冻结 | internal | 非法或短于scheduler rerun window -> fail-fast | `infra/config.rs`;jobs / idempotency store;`job_retention` |
| SBX-CFG-I026 `replayLifecycle.storedResultRetentionSeconds` | D13 | `DurationSeconds` | `604800` | required | G123 | repository registry | startup冻结 | internal | 小于I023 / I024 / I025任一值 -> fail-fast;不得形成completed-without-result | `infra/config.rs`;result store;`stored_result_retention` |
| SBX-CFG-I027 `replayLifecycle.reservedRecordMaxAgeSeconds` | D13 | `DurationSeconds` | `3600` | required | G123 | repository registry | startup冻结 | internal | 非法或不小于任一retention -> fail-fast;过期只触发reconciliation / diagnostic,不重跑 | `infra/config.rs`;idempotency reconciliation;`reserved_record_max_age` |

#### 9.2.4 SBX-CP-04 外部语境、策略与能力摘要

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I028 `contextSource.adapterProfileRef` | D14 | `OpaqueRef<AdapterProfile>` | `adapter-profile:context-resolver:fake-p0` | required | G123 + M for real;T outcome | resolver / policy / capability runtime | startup冻结 | sensitive | wrong family / unavailable -> startup blocked或command delayed / rejected;不得生成identity / work / runtime truth | `infra/config.rs`;`context_resolvers.rs`;`context_resolver_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I029 `contextSource.freshnessThresholdSeconds` | D14 | `DurationSeconds` | `300` | required | G123 | resolver / policy / capability runtime | startup冻结;operation读取snapshot | internal | 非法 -> fail-fast;stale按existing delayed / fail-closed / degraded surface,不自造fresh summary | `infra/config.rs`;context resolver / application typed freshness |
| SBX-CFG-I030 `contextSource.resolutionTimeoutMillis` | D14 | `DurationMillis` | `5000` | required | G123 | resolver / policy / capability runtime | startup冻结 | internal | 非法 -> fail-fast;timeout映射adapter unavailable / delayed,不fallback raw sibling body | `infra/config.rs`;context resolver wrapper |
| SBX-CFG-I031 `policySource.adapterProfileRef` | D15 | `OpaqueRef<AdapterProfile>` | `adapter-profile:policy-summary:fake-p0` | required | G123 + M for real;T outcome | resolver / policy / capability runtime | startup冻结 | sensitive | unavailable / ref mismatch -> fail-fast或operation fail-closed;不得本地定义policy / allowlist / approval truth | `infra/config.rs`;`policy_adapters.rs`;`policy_summary_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I032 `policySource.freshnessThresholdSeconds` | D15 | `DurationSeconds` | `300` | required | G123 | resolver / policy / capability runtime | startup冻结 | internal | 非法 -> fail-fast;missing / stale / conflicted仍fail-closed | `infra/config.rs`;policy service;`SandboxPolicyConfig.freshness_threshold` |
| SBX-CFG-I033 `policySource.highRiskProfileRef` | D15 | `OpaqueRef<PolicyProfile>` | `policy-profile:high-risk:strict-p0` | required | G123 | resolver / policy / capability runtime | startup冻结 | sensitive | missing / unknown / unsafe profile -> fail-fast;不得使用profile把high-risk改为allow | `infra/config.rs`;policy service;`high_risk_summary_profile_ref` |
| SBX-CFG-I034 `policySource.resolutionTimeoutMillis` | D15 | `DurationMillis` | `5000` | required | G123 | resolver / policy / capability runtime | startup冻结 | internal | 非法 -> fail-fast;timeout -> fail-closed,不default allow | `infra/config.rs`;policy adapter wrapper |
| SBX-CFG-I035 `backendCapability.adapterProfileRef` | D16 | `OpaqueRef<AdapterProfile>` | `adapter-profile:backend-capability:fake-p0` | required | G123 + M for real;T outcome | resolver / policy / capability runtime | startup冻结 | sensitive | unavailable / unsupported -> boundary rejected / degraded;不得切换弱backend | `infra/config.rs`;`backend_capability_adapters.rs`;`backend_capability_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I036 `backendCapability.backendProfileRefs` | D16 / D18 | `UniqueRefList<BackendProfile,16>` length 1~16 | `["backend-profile:non-executing-fake-p0"]` | required | G12;T test set | resolver / policy / capability runtime | startup registry | sensitive | empty / duplicate / unknown -> fail-fast;P05~07必须显式real candidate且不得保留fake fallback资格 | `infra/config.rs`;capability / isolation adapter registry;`backend_profile_refs`;summary selected `backend_profile_ref` |
| SBX-CFG-I037 `backendCapability.freshnessThresholdSeconds` | D16 | `DurationSeconds` | `300` | required | G123 | resolver / policy / capability runtime | startup冻结 | internal | 非法 -> fail-fast;stale / unsupported不得silent allow | `infra/config.rs`;boundary service;`capability_stale_threshold` |
| SBX-CFG-I038 `backendCapability.probeTimeoutMillis` | D16 | `DurationMillis` | `5000` | required | G123 | resolver / policy / capability runtime | startup冻结 | internal | 非法 -> fail-fast;probe timeout -> unavailable / boundary reject | `infra/config.rs`;backend capability adapter wrapper |

#### 9.2.5 SBX-CP-05 隔离边界与执行后端

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I039 `boundaryEnforcement.boundaryProfileRef` | D17 | `OpaqueRef<BoundaryProfile>` | `boundary-profile:strict-non-executing-p0` | required | G123;T strict fixture | boundary evaluation | startup冻结 | sensitive | missing / unknown / incoherent -> fail-fast或command reject;local / debug不能放宽 | `infra/config.rs`;boundary service;`boundary_profile_ref` |
| SBX-CFG-I040 `boundaryEnforcement.limitTemplateRef` | D17 | `OpaqueRef<CoherentLimitTemplate>` | `limit-template:resource-fs-network-process:strict-p0` | required | G123;T strict fixture | boundary evaluation | startup冻结 | sensitive | template必须同时覆盖resource / filesystem / network / process;缺任一维或backend不支持 -> reject,不得partial | `infra/config.rs`;boundary service / backend adapter;`limit_template_ref` |
| SBX-CFG-I041 `isolationBackend.adapterProfileRef` | D18 | `OpaqueRef<AdapterProfile>` | `adapter-profile:isolation-backend:non-executing-fake-p0` | required | G123 + M for real;T fake | backend lifecycle | startup冻结;launch消费snapshot | sensitive | P01~04任何real launch profile -> reject;P05~07 unavailable -> reject且无host / fake fallback | `infra/config.rs`;`isolation_backend_adapters.rs`;`isolation_backend_ref`;summary `backend_profile_ref` / `adapter_profile_refs` |
| SBX-CFG-I042 `isolationBackend.launchTimeoutMillis` | D18 | `DurationMillis` | `30000` | required | G123 | backend lifecycle | startup冻结 | internal | 非法 -> fail-fast;timeout形成formal failed / unavailable outcome,不伪造run success | `infra/config.rs`;`IsolationBackendPort` wrapper |
| SBX-CFG-I043 `isolationBackend.inspectTimeoutMillis` | D18 / D29 | `DurationMillis` | `10000` | required | G123 | backend lifecycle | startup冻结;inspection run snapshot | internal | 非法 -> fail-fast;inspection timeout保持orphan / cleanup保守状态 | `infra/config.rs`;`BackendLifecycleInspectionPort` wrapper |
| SBX-CFG-I044 `executionCapture.adapterProfileRef` | D19 | `OpaqueRef<AdapterProfile>` | `adapter-profile:execution-capture:deterministic-p0` | required | G123 + M for real;T outcome | execution run / capture | startup冻结;run消费snapshot | sensitive | missing / unavailable -> capture formal failed / unavailable;不得把process output写truth / log或伪success | `infra/config.rs`;execution capture adapter;`execution_capture_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I045 `executionCapture.captureSizeClassRef` | D19 | `OpaqueRef<CaptureSizeClass>` | `capture-size-class:bounded-small-p0` | required | G123 | execution run / capture | startup冻结 | internal | unknown / unbounded -> fail-fast;超界按formal partial / failed capture处理 | `infra/config.rs`;capture service / adapter;`capture_size_class_ref` |
| SBX-CFG-I046 `executionCapture.materialClassRef` | D19 / D25 | `OpaqueRef<MaterialClass>` | `material-class:candidate-body-free-p0` | required | G123 | execution run / capture | startup冻结 | sensitive | wrong class / raw body class -> fail-fast;candidate material不升格artifact truth | `infra/config.rs`;capture / material handoff service;`material_class_ref` |
| SBX-CFG-I047 `executionCapture.captureTimeoutMillis` | D19 | `DurationMillis` | `30000` | required | G123 | execution run / capture | startup冻结;run snapshot | internal | 非法 -> fail-fast;timeout不得伪造capture complete或run success | `infra/config.rs`;capture adapter wrapper |
| SBX-CFG-I048 `executionCapture.observabilityMaterialEnabled` | D19 / D26 | `Bool` | `false` | required | G123 | execution run / capture | startup registration | internal | true且I057 / I058 / redaction不完整 -> startup fail-fast;false要求I058=[];runtime delivery failure只降级handoff且不影响formal audit | `infra/config.rs`;capture / observability handoff service;`observability_material_enabled` |

D20不拥有第二份lease配置。Generation-scoped backend adapter只在boundary establishment消费§9.2.8的`leaseSafety.leaseProfileRef`,结合clock与正式backend outcome生成有界window;后序run只校验已保存active handle / lease。任何run时重算window、handle-local force release、lease bypass或release authority raw key均禁止。

#### 9.2.6 SBX-CP-06 事件接入、发布与 Relay

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I049 `inboundEvents.bindings` | D21 | `InboundBindingMap` | 9个formal consumer全部`enabled=false`,source / quarantine ref为`null`,`schemaVersions=["v1"]` | required closed map | G12 + M when enabled;T fixture source;E只选new-loop已注册binding | inbound worker | startup registry;new loop snapshot | sensitive | unknown / missing key、unsupported schema、enabled但ref缺失 -> startup / loop reject或quarantine;不得改DTO / dedup语义 | `infra/config.rs`;`worker_runtime.rs`;9 inbound source adapters;Step 14 inbound binding |
| SBX-CFG-I050 `eventPublisher.adapterProfileRef` | D22 | `OpaqueRef<AdapterProfile>` | `adapter-profile:event-publisher:fake-p0` | required | G123 + M for real;T outcome | outbound event runtime | startup冻结 | sensitive | I014=true而publisher unavailable -> fail-fast;publish error只映射formal outcome,不回滚truth | `infra/config.rs`;`publishers.rs`;`event_publisher_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I051 `eventRoutes.bindings` | D23 | `RouteBindingMap` | 13个formal key映射`route-profile:fake:<event-family>` | required closed map | G12 + M for real routes | outbound event runtime | startup冻结 | sensitive | unknown / missing key拒绝;FC-01~06要求启用的event group缺有效route -> fail-fast;route不改event kind / schema / payload / cursor | `infra/config.rs`;publisher topic-neutral map;`transport_topic_bindings` |
| SBX-CFG-I052 `eventRelay.publishBatchSize` | D24 | `PageLimit` | `50` | required | G123 + E | relay loop / publish job | startup ceiling;new relay loop / job snapshot | internal | 非法 -> fail-fast;E越界 -> current loop / job reject,不clamp | `infra/config.rs`;relay worker / publish job;`publish_batch_size` |
| SBX-CFG-I053 `eventRelay.publishRetryPolicyRef` | D24 | `OpaqueRef<RetryPolicy>` | `retry-policy:relay:deterministic-p0` | required | G123 | relay loop / publish job | startup冻结;new relay run snapshot | sensitive | invalid -> fail-fast;policy不得重建payload、删除source relay fact或改变idempotency | `infra/config.rs`;publisher wrapper / relay job;`publish_retry_policy_ref` |
| SBX-CFG-I054 `eventRelay.publishTimeoutMillis` | D24 | `DurationMillis` | `10000` | required | G123 | relay loop / publish job | startup冻结;new relay run snapshot | internal | 非法 -> fail-fast;timeout -> retryable / failed / dead-letter performal outcome,no rollback | `infra/config.rs`;event publisher wrapper |

#### 9.2.7 SBX-CP-07 材料、观测与调查交接

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I055 `materialHandoff.adapterProfileRef` | D25 | `OpaqueRef<AdapterProfile>` | `adapter-profile:material-handoff:fake-p0` | required | G123 + M for real;T outcome | handoff runtime | startup冻结 | sensitive | I056非空而adapter unavailable -> startup fail-fast;delivery runtime可形成retryable / failed且不得回滚run / capture | `infra/config.rs`;`handoff_adapters.rs`;`material_handoff_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I056 `materialHandoff.targetRefs` | D25 | `UniqueRefList<HandoffTarget,16>` length 0~16 | `[]` | required:`[]` disabled;1~16 enabled | G12 + M for real;E只能选已注册target | handoff runtime | startup registry;new job target snapshot | sensitive | 非空即启用;任一unregistered / material class不匹配 -> startup fail-fast;E选空外目标 -> current job reject;receipt不升格artifact truth | `infra/config.rs`;material target registry;`material_target_refs` |
| SBX-CFG-I057 `observabilityHandoff.adapterProfileRef` | D26 | `OpaqueRef<AdapterProfile>` | `adapter-profile:observability-handoff:fake-p0` | required | G123 + M for real;T outcome | handoff runtime | startup冻结 | sensitive | I048=true而adapter invalid / unavailable -> startup fail-fast;runtime delivery failure只降级handoff;不得替代formal audit | `infra/config.rs`;`handoff_adapters.rs`;`observability_handoff_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I058 `observabilityHandoff.targetRefs` | D26 | `UniqueRefList<HandoffTarget,16>` length 0~16 | `[]` | required:I048=false仅`[]`;true时1~16 | G12 + M for real;E registered target only | handoff runtime | startup registry;new run snapshot | sensitive | I048/list冲突、missing或unregistered target -> startup fail-fast;不得保存observability ledger body | `infra/config.rs`;observability target registry;`observability_target_refs` |
| SBX-CFG-I059 `investigationHandoff.adapterProfileRef` | D27 | `OpaqueRef<AdapterProfile>` | `adapter-profile:investigation-handoff:fake-p0` | required | G123 + M for real;T仅D27 fake adapter outcome | handoff runtime | startup冻结 | sensitive | I074=true而adapter不可用 -> startup reject;runtime delivery failure保持formal pending / contained;fixture outcome不得改变D32 guard | `infra/config.rs`;`handoff_adapters.rs`;`investigation_handoff_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I060 `investigationHandoff.targetRefs` | D27 / D32 | `UniqueRefList<HandoffTarget,16>` length 0~16 | `[]` | required:I074=false仅`[]`;true时1~16 | G12 + M for real;E registered target only | handoff runtime | startup registry;new maintenance run snapshot | sensitive | I074/list冲突、missing或unregistered target -> startup fail-fast;runtime failure保持pending;ordinary receipt不得解除guard | `infra/config.rs`;investigation target registry;`investigation_target_refs`;`escalation_target_refs` |
| SBX-CFG-I061 `handoffDelivery.retryPolicyRef` | D28 | `OpaqueRef<RetryPolicy>` | `retry-policy:handoff:deterministic-p0` | required | G123 | handoff retry job | startup冻结;new retry run snapshot | sensitive | invalid -> fail-fast;retry不修改source truth或伪造downstream accepted | `infra/config.rs`;handoff retry wrapper;`SandboxHandoffConfig.retry_policy_ref` |
| SBX-CFG-I062 `handoffDelivery.pendingRetentionSeconds` | D28 | `DurationSeconds` | `604800` | required | G123 | handoff retry job | startup冻结 | internal | 非法 / 短于最大handoff retry window -> fail-fast;到期只形成diagnostic / manual blocker,不删除failed fact | `infra/config.rs`;handoff facts / retry selection |
| SBX-CFG-I063 `handoffDelivery.deliveryTimeoutMillis` | D28 | `DurationMillis` | `10000` | required | G123 | handoff retry job | startup冻结;new delivery snapshot | internal | 非法 -> fail-fast;timeout -> retryable / failed formal outcome,no rollback | `infra/config.rs`;handoff adapter wrapper |
| SBX-CFG-I064 `handoffDelivery.retryBatchSize` | D28 | `PageLimit` | `50` | required | G123 + E | handoff retry job | startup ceiling;new retry job snapshot | internal | 非法 -> fail-fast;E越界 -> job reject,不clamp | `infra/config.rs`;handoff retry job |

#### 9.2.8 SBX-CP-08 租约、清理、Reaper 与 Redline

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I065 `leaseSafety.leaseProfileRef` | D20 / D29 | `OpaqueRef<LeaseProfile>` | `lease-profile:deterministic-guarded-p0` | required | G123;S06只提供D29 lease/orphan state,不得覆盖profile | boundary establishment / persisted lease lifecycle | startup冻结;generation-scoped backend establish消费snapshot,run / reaper只读已保存window / status | sensitive | missing / invalid -> boundary establishment reject;expiry只触发guarded inspection,不得delete / release | `infra/config.rs`;isolation backend adapter / boundary service / reaper;`lease_profile_ref` |
| SBX-CFG-I066 `leaseSafety.orphanScanCadenceRef` | D29 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-orphan-scan-p0` | required | G123 | reaper | startup schedule binding;new scan snapshot | internal | invalid -> fail-fast;没有scheduler时保持manual-only,不得假装已调度 | `infra/config.rs`;lease orphan reaper;`orphan_scan_cadence_ref` |
| SBX-CFG-I067 `leaseSafety.scanBatchSize` | D29 | `PageLimit` | `50` | required | G123 + E | reaper | startup ceiling;new scan snapshot | internal | 非法 -> fail-fast / current job reject;batch不改变eligibility guard | `infra/config.rs`;lease orphan reaper job |
| SBX-CFG-I068 `cleanupSafety.evaluationCadenceRef` | D30 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-cleanup-evaluation-p0` | required | G123 | cleanup job | startup schedule binding;new job snapshot | internal | invalid -> fail-fast;无scheduler保持manual-only,不漏过guard | `infra/config.rs`;cleanup evaluation job;`evaluation_cadence_ref` |
| SBX-CFG-I069 `cleanupSafety.retentionGuardProfileRef` | D30 | `OpaqueRef<CleanupGuardProfile>` | `cleanup-guard-profile:strict-evidence-investigation-redline-p0` | required | G123 | cleanup job | startup冻结 | sensitive | missing / unsafe / unknown -> fail-fast;不得出现force-clean、ignore-evidence或receipt-release profile | `infra/config.rs`;cleanup service / reaper;`retention_guard_profile_ref` |
| SBX-CFG-I070 `cleanupSafety.evaluationBatchSize` | D30 | `PageLimit` | `50` | required | G123 + E | cleanup job | startup ceiling;new job snapshot | internal | 非法 -> fail-fast / current job reject;job no core truth repair | `infra/config.rs`;cleanup guard evaluation job |
| SBX-CFG-I071 `backendRelease.adapterProfileRef` | D31 | `OptionalOpaqueRef<AdapterProfile>` | `null` | conditional override;null表示必须复用I041且其capability声明release | G23 + M for real | backend release | startup冻结;guard允许后消费 | sensitive | nonnull ref invalid -> fail-fast;null且I041不支持release -> fail-fast;无weak adapter fallback | `infra/config.rs`;isolation release wrapper;`release_adapter_target_ref` |
| SBX-CFG-I072 `backendRelease.retryPolicyRef` | D31 | `OpaqueRef<RetryPolicy>` | `retry-policy:backend-release:deterministic-p0` | required | G123 | backend release | startup冻结;new release run snapshot | sensitive | invalid -> fail-fast;retry不得跳过cleanup / redline guard或伪造Released | `infra/config.rs`;backend release wrapper |
| SBX-CFG-I073 `backendRelease.releaseTimeoutMillis` | D31 | `DurationMillis` | `30000` | required | G123 | backend release | startup冻结;new release run snapshot | internal | 非法 -> fail-fast;timeout -> release failed / orphan remains,不得切弱backend | `infra/config.rs`;backend release wrapper |
| SBX-CFG-I074 `redlineSafety.containmentHandoffEnabled` | D32 | `Bool` | `false` | required | G123 | redline service / job | startup registration | internal | true要求I059可用且I060含1~16个registered target;false要求I060=[]且只关闭外部handoff;冲突startup fail-fast,redline detection / containment / cleanup block始终启用 | `infra/config.rs`;redline service / job;`containment_handoff_enabled` |
| SBX-CFG-I075 `redlineSafety.maintenanceCadenceRef` | D32 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-redline-maintenance-p0` | required | G123 | redline service / job | startup schedule binding;new run snapshot | internal | invalid -> fail-fast;manual-only不代表advisory-only或自动release | `infra/config.rs`;redline maintenance job |

#### 9.2.9 SBX-CP-09 引用刷新、投影、派生与对账

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I076 `referenceRefresh.staleThresholdSeconds` | D33 | `DurationSeconds` | `300` | required | G123 | reference guard / refresh job | startup冻结;new refresh snapshot | internal | 非法 -> fail-fast;stale只改变formal freshness / degraded surface,不写core truth | `infra/config.rs`;reference guards / refresh job;`SandboxReferenceConfig.stale_threshold` |
| SBX-CFG-I077 `referenceRefresh.batchSize` | D33 | `PageLimit` | `50` | required | G123 + E | reference guard / refresh job | startup ceiling;new refresh job snapshot | internal | 非法 -> fail-fast / current job reject;refresh只写body-free reference state | `infra/config.rs`;reference refresh job;`refresh_batch_size` |
| SBX-CFG-I078 `referenceRefresh.cadenceRef` | D33 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-reference-refresh-p0` | required | G123 | reference guard / refresh job | startup schedule binding;new run snapshot | internal | invalid -> fail-fast;无scheduler保持manual-only,不伪造refresh执行 | `infra/config.rs`;reference refresh job registry |
| SBX-CFG-I079 `projectionMaintenance.staleThresholdSeconds` | D34 | `DurationSeconds` | `300` | required | G123 | query / projection job | startup冻结 | internal | 非法 -> fail-fast;query按stale / degraded返回且no-write | `infra/config.rs`;query service / projection repo;`SandboxProjectionConfig.stale_threshold` |
| SBX-CFG-I080 `projectionMaintenance.rebuildBatchSize` | D34 | `PageLimit` | `50` | required | G123 + E | query / projection job | startup ceiling;new rebuild job snapshot | internal | 非法 -> fail-fast / job reject;rebuild不修core truth | `infra/config.rs`;projection rebuild job;`rebuild_batch_size` |
| SBX-CFG-I081 `projectionMaintenance.cadenceRef` | D34 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-projection-rebuild-p0` | required | G123 | query / projection job | startup schedule binding;new run snapshot | internal | invalid -> fail-fast;manual-only不允许query触发repair | `infra/config.rs`;projection job registry |
| SBX-CFG-I082 `derivedMaintenance.batchSize` | D35 / D36 | `PageLimit` | `50` | required | G123 + E | derived / reconciliation job | startup ceiling;new derived / reconciliation job snapshot | internal | 非法 -> fail-fast / job reject;finding / view不升格truth | `infra/config.rs`;derived / reconciliation jobs;`derived_batch_size` |
| SBX-CFG-I083 `derivedMaintenance.comparisonScopeRef` | D35 | `OpaqueRef<ComparisonScope>` | `comparison-scope:fixture-backends-p0` | required | G123;E只能选registered scope | derived / reconciliation job | startup registry;new job snapshot | sensitive | missing / unregistered -> fail-fast / job reject;不得从string反推backend或policy scope | `infra/config.rs`;derived query / job;`comparison_scope_ref` |
| SBX-CFG-I084 `derivedMaintenance.cadenceRef` | D35 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-derived-maintenance-p0` | required | G123 | derived / reconciliation job | startup schedule binding;new run snapshot | internal | invalid -> fail-fast;derived不得自动改变policy / boundary / run truth | `infra/config.rs`;derived job registry |
| SBX-CFG-I085 `reconciliationMaintenance.cadenceRef` | D36 | `OpaqueRef<CadenceProfile>` | `cadence-profile:manual-reconciliation-p0` | required | G123 | derived / reconciliation job | startup schedule binding;new run snapshot | internal | invalid -> fail-fast;finding only,不得auto-fix | `infra/config.rs`;reconciliation job registry |

#### 9.2.10 SBX-CP-10 可观测性、诊断与脱敏

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I086 `runtimeTelemetry.logSinkProfileRef` | D37 | `OpaqueRef<TelemetrySinkProfile>` | `telemetry-sink-profile:safe-local-log-p0` | required | G123 + M for real | process telemetry | startup冻结 | sensitive | invalid -> fail-fast;optional external sink unavailable可degraded但safe local diagnostic不可关闭 | `infra/config.rs`;entry / service / adapter log wrappers;infra-private validated section,不进入`SandboxAdapterKind` |
| SBX-CFG-I087 `runtimeTelemetry.metricSinkProfileRef` | D37 | `OpaqueRef<TelemetrySinkProfile>` | `telemetry-sink-profile:in-memory-metric-p0` | required | G123 + M for real | process telemetry | startup冻结 | sensitive | invalid -> fail-fast;external sink unavailable可degraded,不得影响formal audit / truth | `infra/config.rs`;metric hooks;infra-private validated section |
| SBX-CFG-I088 `runtimeTelemetry.minimumLogLevel` | D37 | `LogLevel` | `info` | required | G123 | process telemetry | startup冻结 | internal | unknown / `trace` -> fail-fast;`debug`仍禁止raw body / secret / high-cardinality | `infra/config.rs`;structured logger filter |
| SBX-CFG-I089 `runtimeTelemetry.samplingClassRef` | D37 | `OpaqueRef<SamplingClass>` | `sampling-class:deterministic-safe-p0` | required | G123 | process telemetry | startup冻结 | internal | invalid -> fail-fast;采样不得移除security / startup failure diagnostic或accepted audit | `infra/config.rs`;telemetry hooks;infra-private validated section |
| SBX-CFG-I090 `runtimeTelemetry.labelPolicyRef` | D37 | `OpaqueRef<MetricLabelPolicy>` | `metric-label-policy:low-cardinality-strict-p0` | required | G123 | process telemetry | startup冻结 | internal | missing / high-cardinality allow profile -> fail-fast | `infra/config.rs`;metric label gate;infra-private validated section |
| SBX-CFG-I091 `auditTrace.routeProfileRef` | D38 | `OpaqueRef<AuditRouteProfile>` | `audit-route-profile:truth-uow-mandatory-p0` | required | G123 | truth UoW | startup冻结 | sensitive | route不属于I017同UoW或允许disable / async-loss -> fail-fast;accepted mutation不可继续 | `infra/config.rs`;truth UoW / audit repository;existing `SandboxAuditTrace`,不创建adapter kind |
| SBX-CFG-I092 `diagnostics.surfaceProfileRef` | D39 | `OpaqueRef<DiagnosticSurfaceProfile>` | `diagnostic-surface-profile:redacted-local-p0` | required | G123 | process diagnostics / output | startup冻结 | sensitive | invalid -> fail-fast;当前只允许local safe output与既有formal diagnostic marker组合,外部surface需先回写`03` | `infra/config.rs`;entry / infra diagnostic mapper;infra-private validated section |
| SBX-CFG-I093 `diagnostics.retentionClassRef` | D39 | `OpaqueRef<RetentionClass>` | `retention-class:diagnostic-short-p0` | required | G123 | process diagnostics / output | startup冻结 | internal | invalid -> fail-fast;不得保存raw config / SDK / SQL / HTTP / stack / process output | `infra/config.rs`;formal diagnostic marker retention parameter |
| SBX-CFG-I094 `safeOutput.redactionProfileRef` | D40 | `OpaqueRef<RedactionProfile>` | `redaction-profile:strict-body-free-p0` | required | G123 | process diagnostics / output | startup冻结 | sensitive | missing / unsafe / debug-relaxed -> fail-fast;所有profile必须启用 | `infra/config.rs`;log / metric / audit / receipt / report output gates |
| SBX-CFG-I095 `safeOutput.forbiddenFieldClasses` | D40 | `ForbiddenFieldClassList` | 17项immutable deny floor,exact enum list见§9.5.38 | required | G12 | process diagnostics / output | startup冻结 | internal | 缺任一immutable class、duplicate或unknown -> fail-fast;高层只能增加deny | `infra/config.rs`;redaction validator / output gates |

D37 / D39没有伪造新的`SandboxAdapterKind`、availability port或public DTO。若未来要求独立sink health改变entry / job disposition,必须先回写`03` Step 6 / 7 / 12 / 14 / 15,再重开本Step。

#### 9.2.11 SBX-CP-11 环境与 Deterministic Test Profile

| Item ID / 配置项 | Domain | 精确类型 | PROFILE-01默认值 | 必填性 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 / formal binding |
|---|---|---|---|---|---|---|---|---|---|---|
| SBX-CFG-I096 `deterministicAdapters.clockProfileRef` | D42 | `OpaqueRef<AdapterProfile>` | `adapter-profile:clock:deterministic-p0` | required | G123;T controls value | clock / id runtime | test / process startup冻结 | internal | invalid -> test / startup fail-fast;real-like必须使用approved runtime clock ref且禁止fixture override | `infra/config.rs`;`clock_id.rs`;`clock_adapter_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I097 `deterministicAdapters.idGeneratorProfileRef` | D42 | `OpaqueRef<AdapterProfile>` | `adapter-profile:id-generator:deterministic-p0` | required | G123;T controls seed | clock / id runtime | test / process startup冻结 | internal | invalid -> test / startup fail-fast;不得用timestamp / random string替代formal id port | `infra/config.rs`;`clock_id.rs`;`id_generator_ref`;summary `adapter_profile_refs` |
| SBX-CFG-I098 `testFixtures.fixtureSetRef` | D42 | `OpaqueRef<FixtureSet>` | `fixture-set:sandbox:local-contract-p0` | conditional test-only:P02 deterministic case、P04 simulation或任一fixture-owned scenario启用时required;P01/P03 otherwise optional | G12(test profile only) + T | test harness / test run | test harness / simulation startup | sensitive | required时missing -> test / simulation fail-fast;P05~07出现fixture slot -> profile reject | test harness;fake store / resolver / policy / backend / handoff registries |
| SBX-CFG-I099 `testFixtures.fixedClockInstant` | D42 | `Rfc3339Instant` | `2026-01-01T00:00:00Z` | conditional test-only:deterministic clock selected时required | G12(test profile only) + T | test harness / test run | test-owned slot | internal | invalid / absent with deterministic clock -> test fail-fast;P05~07出现 -> profile reject | test fixture -> `SandboxClockPort` fake |
| SBX-CFG-I100 `testFixtures.idSeed` | D42 | `OptionalU64` | `1` | conditional test-only:deterministic id selected时required | G12(test profile only) + T | test harness / test run | test-owned slot | internal | null / invalid with deterministic id -> test fail-fast;P05~07出现 -> profile reject | test fixture -> `SandboxIdGeneratorPort` fake |
| SBX-CFG-I101 `testFixtures.failureScenarioRefs` | D42 | `UniqueRefList<FailureScenario,64>` length 0~64 | `[]` | test-only optional | G12(test profile only) + T | test harness / test run | test case / simulation run snapshot | sensitive | unknown / duplicate -> test fail-fast;P05~07出现 -> profile reject;scenario不得放宽state / UoW / replay / redaction parity | test harness;fake adapter outcome injection |

D41由I001 profile选择和所有域的cross-field composition承接。D43没有独立`realLikeEnabled` raw key:选择PROFILE-05 / 06时,validator要求本表对应real binding来自G23 / M且拒绝S01 fake fallback。D44没有raw key;任何overlay、reload、remote config或admin override声明均触发NCFG-24和`03`回写门禁。

#### 9.2.12 P0 内建引用目录

I001~I101中的P0默认ref不是任意字符串。`infra/config.rs`必须按下表识别内建ref及其固定语义;未登记ref一律unknown。P1/P2外部ref必须由后续ADR / implementation boundary登记为同family的validated registry entry,不能因格式看起来正确就接受。

内建目录通用规则:

- 内建ref只服务P01~P04 contract / seam / simulation,不构成真实backend、durable store、scheduler、external target、telemetry backend或安全资格。
- `M`表示registry entry可声明一个独立secure-material slot;ordinary profile ref本身不进入S04。P01~P04内建entry没有真实material slot,不得调用S04。
- fake adapter不得spawn宿主进程、访问未登记host filesystem / network、调用sibling service或伪造外部acceptance。
- fake / in-memory实现仍必须遵守Step 11~15的UoW、version、cursor、replay、no-write、no-repair、no-rollback、audit和redaction语义。
- 本目录不定义command提供的业务resource value。`BoundaryRequirementSet`中的CPU、memory、wall-clock、IO及workspace refs来自typed request,再由I039 / I040 validated boundary profile / limit template约束;backend capability只验证能否满足,后序policy只消费已保存requirement。缺失不得由配置猜测。

##### P0 Store / Adapter Registry

| 内建ref | 固定P0语义 | 可注入测试行为 | 明确禁止 | 不可用 / 不匹配处理 |
|---|---|---|---|---|
| `store-profile:truth:memory-p0` | process-local in-memory truth/audit/UoW;staged writes commit后原子可见;expected version、unique create、truth cursor、append-only audit和rollback invisibility均启用 | transaction begin/save/commit/rollback failure;version/unique conflict | restart durable、partial commit、commit后补audit、把memory结果称为durable evidence | startup fail-fast或mutation no-write |
| `store-profile:projection:memory-p0` | process-local projection repository;只保存read view/index/freshness,支持expected version与deterministic page order | missing/stale/rebuild/conflict/unavailable | query写入、projection修core truth、伪造durable parity | startup fail-fast;runtime query degraded/unavailable |
| `store-profile:derived:memory-p0` | process-local derived/reconciliation store;保存inspect/preview/trend/comparison/finding与report refs | stale/failure/version conflict | derived成为truth/policy decision,reconciliation auto-fix | startup fail-fast;job item failed/degraded |
| `store-profile:reference:memory-p0` | process-local body-free ref/summary/freshness marker store;支持reference cursor | stale/unresolved/conflicted/unavailable | external body/source truth入仓,从opaque ref猜正文 | startup fail-fast或resolver unavailable |
| `store-profile:relay:memory-p0` | process-local relay record和immutable stored payload snapshot;source UoW append与publish UoW分离 | retryable/dead-letter/version conflict | publisher从current truth重建payload,publish failure回滚source | I014=true时不可用则startup fail-fast |
| `store-profile:replay:memory-p0` | process-local command/event/job key-family隔离的idempotency、stored result、receipt和report store | reserve conflict/in-flight/completed-missing-result/rollback | duplicate重算、key family混用、completed无result时自动修复 | startup fail-fast;duplicate missing result manual blocker |
| `adapter-profile:context-resolver:fake-p0` | available body-free fake resolver;默认返回`Unresolved`,只有fixture registry中的typed summary ref可返回Resolved/Partial/Conflicted | timeout/unavailable/partial/conflict及registered summary | 生成identity/work/runtime truth、访问sibling正文、unknown时default resolved | command reject/delay或query degraded |
| `adapter-profile:policy-summary:fake-p0` | available fake policy adapter;默认返回`Missing`;fixture可提供typed Applicable/Stale/Conflicted/Unsupported summary,只有显式upstream-style Allowed decision可继续 | timeout/unavailable/all formal status | 本地定义policy/allowlist/approval、missing/stale default allow | fail-closed |
| `adapter-profile:backend-capability:fake-p0` | 只声明`backend-profile:non-executing-fake-p0`;可供结构比较,永不具备真实workload qualification | stale/unsupported/unavailable和fixture capability subsets | 宣称真实隔离证据、产品能力或host execution | boundary pending/rejected/degraded |
| `adapter-profile:isolation-backend:non-executing-fake-p0` | 不spawn进程;默认real launch为`Unsupported`;仅fixture可返回带test marker的simulated handle和formal outcome | established/failed/unsupported/unavailable simulated outcome | host-run、访问真实fs/network/process、把simulated handle用于P05+ | real request reject;test case按formal outcome |
| `adapter-profile:execution-capture:deterministic-p0` | 只从simulated handle产生typed material refs/digest/status;不读取宿主output | complete/partial/failed/unavailable及bounded refs | raw output进truth/log/audit,对real handle伪造capture | capture formal failed/unavailable |
| `adapter-profile:event-publisher:fake-p0` | 不连接外部transport;对registered fake route校验typed envelope并返回deterministic body-free receipt ref | delivered/retryable/dead-letter/failed | raw topic、外部publish声称、从truth重建payload | outbound enabled且binding invalid则startup fail-fast |
| `adapter-profile:material-handoff:fake-p0` | 不交付外部artifact;对registered fake target返回body-free outcome/receipt | delivered/retryable/failed | receipt升格artifact truth、读取material body、失败回滚capture | I056非空时binding不完整startup fail-fast;runtime formal outcome |
| `adapter-profile:observability-handoff:fake-p0` | 不写observability store;只处理safe observability refs/markers | delivered/retryable/failed/backpressure | ledger body入仓、delivery替代audit | I048=true而binding不完整startup fail-fast;runtime degraded handoff |
| `adapter-profile:investigation-handoff:fake-p0` | 不创建外部incident truth;只处理redline/investigation refs并返回formal outcome | delivered/retryable/failed/target mismatch | ordinary receipt解除containment/cleanup guard | I074=true而binding不完整startup fail-fast;runtime保持pending/contained |
| `adapter-profile:clock:deterministic-p0` | `SandboxClockPort`只返回I099 fixture instant并按fixture显式推进 | fixed instant / controlled advance | wall clock偷读、P05+ fixture override | missing/invalid fixture test fail-fast |
| `adapter-profile:id-generator:deterministic-p0` | `SandboxIdGeneratorPort`按I100 seed为各typed ref family生成稳定、互不混用的sequence | family-specific collision/failure injection | timestamp/hash/random string替代typed factory,跨family复用 | missing/invalid seed test fail-fast |

##### P0 Policy / Safety / Operating Registry

| 内建ref | 固定P0语义 | 精确约束 | 明确禁止 | 失败策略 |
|---|---|---|---|---|
| `policy-profile:high-risk:strict-p0` | 高风险判断只消费external-style typed summary | `Missing/Conflicted/Unsupported/Stale`和`Unknown` action一律non-Allowed;仅正式`Allowed`可继续 | 本地allowlist/approval、debug bypass | fail-closed |
| `backend-profile:non-executing-fake-p0` | P01~P04唯一默认backend profile | capability只证明contract carrier存在;真实launch=false;qualification=false | P05+候选、host process、真实隔离evidence | profile mismatch fail-fast |
| `boundary-profile:strict-non-executing-p0` | boundary必须从typed context / identity、显式requirements和同代validated profile / template整体评估 | context accepted、identity active且匹配、LD-24 generation完整、capability fresh且I040全维可验证才可形成test-only coherent decision;policy在后序消费requirement | config生成business allow、要求后序policy先成立或partial allow | missing/conflict/unsupported reject |
| `limit-template:resource-fs-network-process:strict-p0` | 要求resource、filesystem、network、process及workspace/mount五组summary都存在 | resource至少覆盖CPU/Memory/WallClock/Io typed requirements;filesystem必须`forbid_host_write=true`;network missing/unknown不得allow,no-egress由显式typed requirement与profile安全floor共同约束;process要求namespace isolation且禁止host process access;workspace refs / mount marker必须validated | 旧README no-egress硬编码、host path正文、policy反向生成boundary、任一维silent ignore | validation / boundary reject |
| `capture-size-class:bounded-small-p0` | deterministic fake capture的adapter-side容量上限 | aggregate captured bytes <=1,048,576;single material <=262,144;material refs <=32;超限必须`Partial`或`Failed`并给safe reason ref | truncate后仍标Complete、输出body到truth/log | invalid class startup fail-fast;overage formal partial/failed |
| `material-class:candidate-body-free-p0` | 允许`Stdout/Stderr/ExitStatus/FileDigest/Diagnostic/Other`的typed ref、digest和status | sandbox只保存ref/digest/kind;body停留在capture adapter / downstream handoff边界 | artifact/evidence accepted状态、package body、raw stdout/stderr | class mismatch fail-fast |
| `lease-profile:deterministic-guarded-p0` | lease window必须由generation-scoped backend establish根据冻结profile、clock与正式adapter outcome产生,不提供隐式duration | window随boundary group持久化;run只校验有效性;clock到期只迁移`Expiring/Expired/OrphanSuspected`并触发inspection/guard;永不直接release/delete | run / reaper从current config重算window、default duration猜测、expiry release、绕过evidence/investigation/redline | missing / invalid window boundary establishment reject;uncertain保持blocked |
| `cleanup-guard-profile:strict-evidence-investigation-redline-p0` | cleanup/release前逐项检查capture、required handoff、audit、failure/control、investigation和redline状态 | 只有existing domain guard返回`Allowed`才可release;任一missing/unavailable保持`PendingEvidence/PendingInvestigation/Blocked` | force-clean、receipt-only release、timeout auto-allow | startup profile mismatch fail-fast;runtime blocked |
| `comparison-scope:fixture-backends-p0` | 只比较fixture registry中body-free capability summaries | source refs显式、排序稳定、finding/report only | 扫描产品、生成policy decision、改变selected backend | unregistered scope job reject |
| `retry-policy:job:deterministic-p0` | one initial attempt,zero automatic in-run retry,no jitter | retryable / partial item写入stored report;后续重跑必须使用正式job idempotency规则 | 隐式换key、重复已成功item、修core truth | invalid profile fail-fast |
| `retry-policy:relay:deterministic-p0` | one publish attempt per selected relay item,zero automatic in-loop retry,no jitter | Retryable保留relay record;DeadLetter terminal/manual;后续job遵守version/idempotency | source rollback、payload reconstruction、dead-letter reopen | invalid profile fail-fast |
| `retry-policy:handoff:deterministic-p0` | one delivery attempt per selected handoff,zero automatic in-run retry,no jitter | Retryable保留fact;Delivered/Failed terminal按`03` guard;后续job使用stored target | capture rollback、target切换、伪造receipt | invalid profile fail-fast |
| `retry-policy:backend-release:deterministic-p0` | guard Allowed后one release attempt,zero automatic in-run retry,no jitter | failure保持handle/orphan未释放;后续run重新inspect并复核guard | weak backend fallback、failure标Released | invalid profile fail-fast |

##### P0 Cadence / Observability / Fixture Registry

| 内建ref | 固定P0语义 | 精确约束 | 明确禁止 | 失败策略 |
|---|---|---|---|---|
| `cadence-profile:manual-orphan-scan-p0` | 不注册scheduler;只允许typed manual reaper job | 每次run冻结I067和typed scope/idempotency | 声称定时执行、expiry自动release | invalid ref fail-fast |
| `cadence-profile:manual-cleanup-evaluation-p0` | 不注册scheduler;只允许typed manual cleanup evaluation | 每次run重新读committed guard inputs | query触发、force clean | invalid ref fail-fast |
| `cadence-profile:manual-redline-maintenance-p0` | 不注册scheduler;只允许typed manual containment maintenance | containment保持mandatory,job只推进formal handoff/guard | advisory-only、auto release | invalid ref fail-fast |
| `cadence-profile:manual-reference-refresh-p0` | 不注册scheduler;typed manual refresh only | 只更新body-free reference state和markers | core truth repair | invalid ref fail-fast |
| `cadence-profile:manual-projection-rebuild-p0` | 不注册scheduler;typed manual rebuild only | 从committed snapshot/index rebuild view | query write、truth repair | invalid ref fail-fast |
| `cadence-profile:manual-derived-maintenance-p0` | 不注册scheduler;typed manual derived job only | result/failure只进derived/report surface | policy / core truth mutation | invalid ref fail-fast |
| `cadence-profile:manual-reconciliation-p0` | 不注册scheduler;typed manual report job only | finding/report only | auto-fix | invalid ref fail-fast |
| `telemetry-sink-profile:safe-local-log-p0` | process-local sanitized structured writer,无network exporter,不持久化business truth | 接收Step 15允许字段;writer failure只产生safe fallback diagnostic | raw body/secret/ref原文、冒充audit/evidence | invalid ref fail-fast;writer unavailable degraded |
| `telemetry-sink-profile:in-memory-metric-p0` | process-local reset-on-restart metric accumulator | 只接受Step 15低基数metric / label schema | durable/SLO evidence声明、高基数label | invalid ref fail-fast;unavailable degraded |
| `sampling-class:deterministic-safe-p0` | P0不做概率采样 | 所有允许的log/metric hook均保留;redline、startup/config failure和audit关联diagnostic绝不丢弃 | 采样关闭安全失败或formal audit | invalid / unsafe ref fail-fast |
| `metric-label-policy:low-cardinality-strict-p0` | 只允许Step 15 metric表列出的enum/kind/state/result标签 | 禁止request/actor/subject/trace/relay/marker/idempotency/dedup/payload digest/free text/ref原文 | dynamic label或unknown label | invalid / unsafe ref fail-fast |
| `audit-route-profile:truth-uow-mandatory-p0` | accepted truth/formal marker audit与source同UoW append | append失败rollback source;query/duplicate不新增business audit | best-effort/async-loss/log替代 | route/UoW mismatch startup fail-fast |
| `diagnostic-surface-profile:redacted-local-p0` | 输出stable code、safe summary、redacted issue ref和supporting refs | startup前只local safe output;store可用后可写existing formal diagnostic marker | raw config/SDK/SQL/HTTP/stack/process output,独立external port | invalid ref fail-fast |
| `retention-class:diagnostic-short-p0` | infra-local diagnostic cache最多3600秒或process lifetime取较短者 | formal diagnostic marker遵守truth store生命周期,本ref不得删除正式marker | 删除audit/truth/report或冒充observability retention | invalid ref fail-fast |
| `redaction-profile:strict-body-free-p0` | I095 immutable deny floor + body-free allow-by-schema | unknown field default deny;ref只输出approved fingerprint / kind,不输出原文 | debug/local/conformance bypass | missing / unsafe ref fail-fast |
| `fixture-set:sandbox:local-contract-p0` | test registry baseline:all fake adapters registered andavailable;context=`Unresolved`;policy=`Missing`;backend=non-executing;external targets disabled;clock/id由I099/I100驱动 | P01可选使用;P02/P04按case扩展S06 state;P03只注册被测seam | accepted external truth、real credential、host workload、production target | required scenario缺fixture test fail-fast;P05~P07 reject |

Fake route ref `route-profile:fake:<event-family>` 也属于内建目录:它只允许I051列出的13个event family,不对应raw topic或external transport。与`adapter-profile:event-publisher:fake-p0`组合时,仅校验typed envelope、记录body-free delivery observation并返回deterministic receipt;failure behavior只能由I101注册的formal scenario覆盖。

### 9.3 按配置域组织的配置项批次表

表内`P01~P07`表示`SBX-PROFILE-01~07`;`CAT-xx`、`Sxx`表示Step 4 / Step 5的正式编号。每个D01~D44恰好出现一次。`无独立raw key`仍是本Step的正式字段级结论,不是遗漏。

| 配置域 | 配置项 / 承载 | 控制面 | 分类 | 来源规则 | 环境 / profile差异 | `03`影响判定 |
|---|---|---|---|---|---|---|
| D01 config source intake | §9.4 `config source selector`;无JSON item | CP-01 | CAT-01/03/08/10 | S01 < S03 < S05选唯一S02;显式不可读拒绝 | P01可无S02;P02 suite source;P03~06显式source;P07 inactive | 无回写;承接`infra/config.rs`唯一raw owner |
| D02 runtime profile / config identity | I001 + derived redacted `config_ref` | CP-01 | CAT-01/07/10 | profile:S01 < S02 < S03 < S05;identity由canonical snapshot派生 | P01~06各选exact profile;P07选择即reject | 无回写;承接profile/config refs和summary |
| D03 startup validation | derived validation result;无`strict=false` key | CP-01 | CAT-01/02/07 | 汇总S01~S06合法通道后一次strict cross-domain validate | P01~04校验fixture / seam;P05~06校验real binding / S04;P07 reject | 无回写;承接`RuntimeConfigStatus` / builder error |
| D04 runtime builder / adapter registry | I017~I097 validated refs;derived availability;无独立key | CP-01 | CAT-01/09/10 | global ref -> conditional S04 -> validated snapshot;S06仅test slot | P01~04 fake / seam / simulation;P05~06 real / qualified;无fallback | 无回写;承接`runtime_builder.rs`,`adapter_profile_refs`,`disabled_adapter_kinds` |
| D05 sync API envelope | I002~I006 | CP-02 | CAT-01/03/05/07 | scalar G123;diagnostics selector可S05但不改ceiling | 各profile均受同一安全ceiling;P04 API可不注册 | 无回写;承接`SandboxBoundaryConfig`和entry args |
| D06 worker runtime envelope | I007~I009 | CP-02 | CAT-01/04/09/10 | G123;S05仅new-loop且受ceiling | P01 disabled/manual;P02 fixture;P03 seam;P04 simulation;P05 optional;P06 real-like | 无回写;承接worker runtime typed parameters |
| D07 job runner envelope | I010~I013 | CP-02 | CAT-03/04/05/10 | G123;S05只在typed job request内覆盖run-local值 | P01/02 manual deterministic;P04 primary simulation;P05 bounded;P06 scheduler-backed | 无回写;承接`SandboxJobConfig`和typed job input |
| D08 feature assembly gate | I014~I016 | CP-02 | CAT-01/09/10 | global G123;FC-01~06依赖完整性cross-check | P01默认off;P02~05按case显式;P06完整binding后启;P07 inactive | 无回写;I014覆盖10 core + projection,I015依赖I014,I016读面独立;无core guard bool |
| D09 truth / audit / UoW store | I017 | CP-03 | CAT-01/06/08/10 | G123;real ref进入S04;S06 test store | P01~04 in-memory / isolated;P05 conformance;P06 durable;P07 future | 无回写;同logical schema / UoW / audit contract |
| D10 projection / derived store | I018~I019 | CP-03 | CAT-01/06/08/10 | G123 + conditional S04;S06 test store | P01~04 deterministic / simulation;P05 report-only;P06 durable | 无回写;query no-write / derived no-truth-repair |
| D11 reference store | I020 | CP-03 | CAT-01/06/08/10 | G123 + conditional S04;S06 body-free test store | P01~04 body-free refs;P05 strict fixture;P06 real-like body-free | 无回写;external body禁止入仓 |
| D12 relay store | I021 | CP-03 | CAT-01/06/08/10 | G123 + conditional S04;S06 test store | P01/02 asserted fake;P03/04 controlled;P05 optional;P06 durable | 无回写;stored payload来源和no-rollback不变 |
| D13 idempotency / stored surface | I022~I027 | CP-03 | CAT-01/05/06/08/10 | store G123/M/T;retention G123;cross-field strict | 所有profile必须replay parity;P06 durable;retention不因profile降低完整性 | 无回写;承接Step 13 stored replay |
| D14 context reference source | I028~I030 | CP-04 | CAT-01/05/06/08/10 | G123 + real S04;S06只控制fake outcome | P01/02 deterministic;P03 seam;P04 simulation;P05 strict non-prod;P06 real-like | 无回写;config不生成外部truth |
| D15 policy / authorization summary | I031~I034 | CP-04 | CAT-01/02/05/06/08/10 | G123 + real S04;S06 strict fixture only | P01~04含allow/deny/stale fixture;P05/06显式source;始终fail-closed | 无回写;policy / allowlist / approval truth外部拥有 |
| D16 backend capability source | I035~I038 | CP-04 | CAT-01/02/05/06/08/10 | refs G12/G123 + conditional S04;S06 test outcome | P01~04 fake/simulated;P05 candidate probe核心;P06 qualified;P07 future | 无回写;unsupported / stale无weak fallback |
| D17 coherent boundary profile | I039~I040 | CP-05 | CAT-02/05/08/10 | global opaque refs;S06 strict fixture;S05不得relax | P01~04只验证contract;P05真实验证四维;P06只用qualified profile | 无回写;resource/fs/network/process整体成立 |
| D18 isolation backend lifecycle | I036,I041~I043 | CP-05 | CAT-01/02/06/08/10 | global refs -> conditional S04;S06 non-executing fake only | P01~04禁止real workload;P05 candidate real;P06 qualified;P07 inactive | 无回写;无host-run / fake fallback success |
| D19 execution capture | I044~I048 | CP-05 | CAT-01/02/05/06/08/10 | G123 + real S04;S06 deterministic outcome | P01~04 fake/simulated;P05 candidate bounded;P06 approved capture | 无回写;capture failure不伪success,raw output不进truth/log |
| D20 backend handle / lease consumption | I065;I041只消费 | CP-05 | CAT-02/05/10 | global lease profile;无S05/S06 force release | 所有profile在boundary establishment消费冻结profile并保存window;P01~04仅fake handle;run只校验 | 无回写;lease owner仍在CP-08 |
| D21 inbound subscription / schema | I024,I049 | CP-06 | CAT-01/04/05/06/08/09/10 | closed map G12;enabled real binding经S04;S06 fixture;S05只选registered loop | P01 disabled;P02 fixture;P03 seam;P04 simulation;P05 optional;P06 real-like | 无回写;9 consumers / DTO / dedup / quarantine语义不变 |
| D22 event publisher adapter | I014,I015,I016,I050 | CP-06 | CAT-01/06/08/10 | G123 + conditional S04;FC-01~06;S06 outcome | P01 off/fake;P02/03/04 controlled;P05 optional evidence;P06 real-like | 无回写;publisher只在对应event组启用时装配,error不造domain state |
| D23 topic-neutral route binding | I014~I016,I051 | CP-06 | CAT-01/06/08/10 | closed map G12;real route refs经S04;启用组完整性校验 | P01~04 fake / controlled routes;P05 evidence routes;P06 complete real-like | 无回写;13 formal key固定分为10 core + projection + derived + reconciliation |
| D24 relay delivery / retry / dead-letter | I014~I016,I021,I052~I054 | CP-06 | CAT-04/05/06/10 | G123;FC-01~06;S05 batch只作用new run | P01/02 deterministic;P03 controlled;P04 primary simulation;P05 bounded;P06 scheduler-backed | 无回写;duplicate不重建payload,DLQ不删source fact |
| D25 material handoff | I046,I055~I056 | CP-07 | CAT-01/04/05/06/08/10 | I056非空是唯一启用源;adapter G123/M/T;target G12/M;S05只选子集 | P01 off/fake;P03 seam;P04 simulation;P05 non-prod evidence;P06 real-like | 无回写;无额外enabled bool,receipt不升格artifact truth |
| D26 observability material handoff | I048,I057~I058 | CP-07 | CAT-01/04/05/06/07/08/09/10 | I048是唯一启用源;adapter G123/M/T;targets G12/M | P01 off;P02 fake;P03 seam;P04 backpressure simulation;P05 required safe target;P06 real-like | 无回写;I048=false要求I058空;observability store truth外部拥有 |
| D27 investigation handoff | I059~I060,I074 | CP-07 | CAT-01/02/04/05/06/08/10 | I074是唯一启用源;adapter G123/M/T;targets G12/M;S05 registered only | P01/02 off/fake;P03 seam;P04 primary simulation;P05 negative cases;P06 approved | 无回写;I074=false要求I060空;ordinary receipt不解除guard |
| D28 handoff receipt / retry | I061~I064 | CP-07 | CAT-04/05/10 | G123;S05仅batch / registered target snapshot | P01/02 deterministic;P03 controlled;P04 primary retry;P05 bounded;P06 scheduler-backed | 无回写;failed fact保留且source truth不变 |
| D29 lease / orphan detection | I043,I065~I067 | CP-08 | CAT-02/04/05/06/08/10 | profile / cadence G123;S05 batch;S06 fixture state | P01~03 deterministic;P04 primary simulation;P05 real inspection;P06 scheduler | 无回写;expiry只触发guarded inspection |
| D30 cleanup guard evaluation | I068~I070 | CP-08 | CAT-02/04/05/10 | G123;S05 batch;无force-clean source | P01/02 guard matrix;P03 seam;P04 all blockers;P05/06 real handle under same guard | 无回写;handoff/audit/investigation/redline guard不可绕 |
| D31 backend release | I071~I073 | CP-08 | CAT-01/02/04/05/06/08/10 | conditional ref G23/M;policy/timeout G123 | P01~04 fake outcome;P05 candidate guarded release;P06 qualified;P07 inactive | 无回写;failure不伪Released,无弱backend |
| D32 redline containment / escalation | I059,I060,I074~I075 | CP-08 | CAT-02/04/05/06/10 | G123 / G12 / conditional S04;无disable containment source | P01/02 state matrix;P03 seam;P04 primary containment;P05 negative conformance;P06 approved target | 无回写;false只关外部handoff,不关containment |
| D33 reference refresh | I020,I076~I078 | CP-09 | CAT-04/05/06/08/10 | G123;S05 batch / registered scope | P01/02 deterministic;P03 seam;P04 primary simulation;P05 as needed;P06 scheduled | 无回写;只写body-free reference state |
| D34 projection rebuild | I018,I079~I081 | CP-09 | CAT-04/05/08/10 | G123;S05 batch | P01/02 deterministic;P03 seam;P04 stale/rebuild;P05 report;P06 scheduled | 无回写;query不触发写,rebuild不修truth |
| D35 derived inspect / preview / trend | I015,I019,I082~I084 | CP-09 | CAT-04/05/08/09/10 | derived state/query/job由store和job配置承载;I015只控制event append;S05 batch / registered scope | P01/02 deterministic;P03 comparison seam;P04 simulation;P05 conformance report;P06 derived surface | 无回写;I015=false不关闭derived state/query/job,derived不成为truth / policy decision |
| D36 reconciliation report | I016,I019,I082,I085 | CP-09 | CAT-04/05/08/09/10 | I016控制query/job registration;I014只决定finding event;typed job scope only | P01/02 deterministic;P03 findings seam;P04 no-auto-fix;P05 report;P06 scheduled | 无回写;I014=false不关闭reconciliation query/job,finding不升格accepted fact |
| D37 runtime log / metric | I086~I090 | CP-10 | CAT-01/05/06/07/10 | G123;real sink ref可经S04;无S05 raw-debug / S06 | P01/02 safe local;P03 seam;P04 simulation;P05 conformance sink;P06 approved sink | 无回写;infra-private section,无新adapter kind / public carrier |
| D38 audit / trace hook | I017,I091 | CP-10 | CAT-01/06/07/10 | G123;route必须指向truth UoW;无disable source | 所有profilemandatory;P05/06不得外置为best-effort sink | 无回写;复用existing audit repository / `SandboxAuditTrace` |
| D39 diagnostic issue | I006,I092~I093 | CP-10 | CAT-01/05/06/07/10 | G123;S05仅safe/quiet selector;无raw detail | 所有profile只输出safe code / summary / refs;real backend body仍禁止 | 无回写;当前local/formal marker surface;独立external port需重开`03` |
| D40 redaction / safe output | I094~I095 | CP-10 | CAT-02/07/10 | profile G123;deny list G12且只能增加 | P01~P07同一strict floor;无debug / conformance例外 | 无回写;承接Step 15 forbidden fields |
| D41 profile composition | I001 + cross-field profile manifest | CP-11 | CAT-01/10 | S01 < S02 < S03 < S05只选一个;S06不是overlay | exact P01~P06;P07 inactive | 无回写;profile只组合已定义域 |
| D42 deterministic fixture / fake | I096~I101 | CP-11 | CAT-08/10 | P01~04允许test-only G12/T;P02 deterministic case和P04 simulation按条件要求fixture;P05~07禁止S06 / fixture slot | P01 optional local fixture;P02 deterministic case;P03 bounded optional fixture;P04 required simulation state;P05~07 reject fixture slots | 无回写;fake保持state/UoW/replay/redaction parity |
| D43 real-like / production-like composition | 无独立`enabled` key;I017~I097 conditional completeness | CP-11 | CAT-01/02/06/07/09/10 | S01只给strict disabled baseline;P05/06显式S02/S03/M;禁S06 fallback | P05 candidate subset;P06 real-like;P07 inactive target | 无回写;现有summary refs足够;新product/port仍需ADR/`03` |
| D44 future overlay / reload trigger | 无raw key;NCFG-24 design gate | CP-11 | CAT-00 only | S01~S08当前均无加载资格 | P01~P07全部current non-config | 无回写;任何声明先回写`03` snapshot/flow/audit并重开`04` |

### 9.4 Entry / Worker / Job Local Selector Schema

S05是独立scoped lane,不是S03之上的global merge层。下表定义process entry允许读取的selector;除此之外的actor、trace、idempotency key、scope、target、event body和job body必须来自正式protocol / typed request,不得增加同义flag或env。

| Selector / typed input | CLI / carrier | Env key | 缺失 / 冲突处理 | 作用域 | 承载边界 |
|---|---|---|---|---|---|
| config source | `--config <path>` | `QUANTALITHOS_SANDBOX_CONFIG` | CLI > env > default discovery;显式source不可读即reject,不得fallback | current process startup | 只选择一个S02 strict JSON;path不进入config identity正文/log |
| profile | `--profile <ProfileName>` | `QUANTALITHOS_SANDBOX_PROFILE` | CLI > env > JSON > S01;unknown / multi-profile reject | current process startup | 映射I001;不构成overlay |
| diagnostics mode | `--diagnostics-mode <safe|quiet>` | `QUANTALITHOS_SANDBOX_DIAGNOSTICS_MODE` | CLI > env > I006;raw / verbose值reject | current process / entry | 只选择safe diagnostic surface,不能放宽I094 / I095 |
| worker kind | `--worker-kind <control-consumer|fulfillment|relay|handoff-feedback|backend-lifecycle>` | `QUANTALITHOS_SANDBOX_WORKER_KIND` | worker binary必填;unknown reject | current worker process | 映射existing `SandboxWorkerKind`,不决定business state |
| inbound binding key | `--binding-key <formal-consumer-key>` | `QUANTALITHOS_SANDBOX_BINDING_KEY` | consumer worker必填;必须存在于I049且enabled | current new loop | 只选registered binding,不接受raw subscription / topic / credential |
| worker batch / parallelism | typed `SandboxWorkerLoopInput` fields | 不允许env body | 缺失用I007/I008;超过ceiling reject,不clamp | current new loop | 不新增public DTO;entry-local infra carrier,不得改变dedup / schema / authority |
| job request source | `--job-request <path>`或`--job-request-stdin`二选一 | `QUANTALITHOS_SANDBOX_JOB_REQUEST`只允许path;stdin无env body | 两者同时或都缺失时按binary contract reject | current job entry | 解析完整existing typed job request;env不得携带JSON job body |
| job batch / scope / target | existing typed job request fields | 不允许独立env / flag | 缺失按对应job DTO;batch受I010等ceiling,target/scope必须registered | current new job | 不增加`--scope`,`--target`,`--idempotency-key`,`--run-id`同义flag |

Local selector禁止事项:

- CLI / env不得提供raw secret、endpoint、transport topic、external body、process output或adapter response。
- `--profile backend-conformance`只选择profile,不授予真实workload资格;仍需PROFILE-05完整binding和后续测试资格。
- worker / job local input冻结后不得在loop / run中途切换;重启新loop / run才可使用新snapshot。
- `QUANTALITHOS_SANDBOX__...`是S03 global item映射;上表无双下划线的selector env只选择source / process entry,两者不得混用。

### 9.5 模块级严格 JSON Demo 与逐项说明

本节所有`json`代码块都是严格 JSON:不含注释、trailing comma、duplicate key或非JSON字面值。每个代码块只展示一个顶层功能模块;实际文件可把这些顶层对象组合为§9.6的完整对象。

#### 9.5.1 `configIdentity` 配置 demo

```json
{
  "configIdentity": {
    "profile": "local-contract"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `configIdentity.profile` | `ProfileName` | `local-contract` | 选择唯一profile composition | 不支持继承、overlay或runtime切换;`production-like`当前inactive | unknown / inactive / incomplete profile fail-fast |

#### 9.5.2 `entryEnvelope` 配置 demo

```json
{
  "entryEnvelope": {
    "maxCommandBodyBytes": 1048576,
    "maxQueryPageLimit": 100,
    "syncCommandTimeoutMillis": 30000,
    "queryReadTimeoutMillis": 10000,
    "defaultDiagnosticsMode": "safe"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `entryEnvelope.maxCommandBodyBytes` | `ByteSize` | `1048576` | 限制sync command body包络 | 1~16,777,216;不放宽metadata / idempotency / policy | invalid startup fail-fast;request超限reject |
| `entryEnvelope.maxQueryPageLimit` | `PageLimit` | `100` | 限制query page request | 1~1,000;超限不clamp | invalid startup fail-fast;request超限reject |
| `entryEnvelope.syncCommandTimeoutMillis` | `DurationMillis` | `30000` | sync command wrapper timeout | 不改变已提交truth或transaction order | invalid startup fail-fast |
| `entryEnvelope.queryReadTimeoutMillis` | `DurationMillis` | `10000` | query read wrapper timeout | query始终no-write | invalid startup fail-fast;runtime timeout degraded / unavailable |
| `entryEnvelope.defaultDiagnosticsMode` | enum | `safe` | 选择safe或quiet诊断输出 | 不存在raw / verbose模式,两者都执行redaction | unknown value fail-fast / current selector reject |

#### 9.5.3 `workerEnvelope` 配置 demo

```json
{
  "workerEnvelope": {
    "defaultBatchSize": 32,
    "maxParallelism": 1,
    "loopTimeoutMillis": 30000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `workerEnvelope.defaultBatchSize` | `PageLimit` | `32` | new worker loop默认batch ceiling | S05只能降低或在ceiling内选择;不改schema / dedup | invalid startup fail-fast;local越界loop reject |
| `workerEnvelope.maxParallelism` | `Parallelism` | `1` | worker loop并发ceiling | P01 / P02 deterministic默认1;范围1~64 | invalid startup fail-fast;local越界loop reject |
| `workerEnvelope.loopTimeoutMillis` | `DurationMillis` | `30000` | 单次loop包络 | timeout不创造core success或直接写repository | invalid startup fail-fast;item按formal receipt失败 |

#### 9.5.4 `jobEnvelope` 配置 demo

```json
{
  "jobEnvelope": {
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "jobTimeoutMillis": 300000,
    "retryPolicyRef": "retry-policy:job:deterministic-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobEnvelope.defaultBatchSize` | `PageLimit` | `50` | operations job默认batch ceiling | typed job override必须在ceiling内 | invalid startup fail-fast;job越界reject |
| `jobEnvelope.maxParallelism` | `Parallelism` | `1` | operations job并发ceiling | P0 deterministic默认1;job仍no core truth repair | invalid startup fail-fast;job越界reject |
| `jobEnvelope.jobTimeoutMillis` | `DurationMillis` | `300000` | 单个job run timeout | timeout后保留typed report,不重复执行已完成item | invalid startup fail-fast |
| `jobEnvelope.retryPolicyRef` | `OpaqueRef<RetryPolicy>` | `retry-policy:job:deterministic-p0` | 选择versioned retry class | 不改变job request / idempotency / stored report replay | invalid family fail-fast |

#### 9.5.5 `featureAssembly` 配置 demo

```json
{
  "featureAssembly": {
    "outboundEventsEnabled": false,
    "derivedEventsEnabled": false,
    "reconciliationEnabled": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `featureAssembly.outboundEventsEnabled` | `Bool` | `false` | 注册10类core truth event和projection event的append / publish能力 | true要求publisher、relay store、relay包络和对应11个route完整;false要求I015=false;不关闭formal audit | dependency incomplete / conflicting I015 fail-fast |
| `featureAssembly.derivedEventsEnabled` | `Bool` | `false` | 在普通outbound基础上追加derived event | true要求I014=true、derived store和derived route;不改变derived state / truth边界 | dependency incomplete fail-fast |
| `featureAssembly.reconciliationEnabled` | `Bool` | `false` | 独立注册reconciliation job / query surface | I014=false时不发布event;I014=true时还要求reconciliation route;不允许auto-fix或升格finding | dependency incomplete fail-fast |

#### 9.5.6 `truthStore` 配置 demo

```json
{
  "truthStore": {
    "profileRef": "store-profile:truth:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `truthStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:truth:memory-p0` | 绑定truth、audit和UoW承载 | 必须支持Step 11 logical schema、version、cursor和same-UoW audit | invalid / unavailable / capability mismatch fail-fast |

#### 9.5.7 `projectionStore` 配置 demo

```json
{
  "projectionStore": {
    "profileRef": "store-profile:projection:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projectionStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:projection:memory-p0` | 绑定read projection承载 | 不得成为truth source或允许query-triggered repair | invalid startup fail-fast;runtime unavailable按degraded query |

#### 9.5.8 `derivedStore` 配置 demo

```json
{
  "derivedStore": {
    "profileRef": "store-profile:derived:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `derivedStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:derived:memory-p0` | 绑定inspect / preview / trend / comparison / finding承载 | 与truth store分离;derived和reconciliation不修core truth | invalid / unavailable startup fail-fast |

#### 9.5.9 `referenceStore` 配置 demo

```json
{
  "referenceStore": {
    "profileRef": "store-profile:reference:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `referenceStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:reference:memory-p0` | 绑定body-free ref / summary / freshness marker承载 | 禁止external body、source truth或raw resolver response | invalid fail-fast;runtime unavailable maps resolver unavailable |

#### 9.5.10 `relayStore` 配置 demo

```json
{
  "relayStore": {
    "profileRef": "store-profile:relay:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `relayStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:relay:memory-p0` | 绑定relay record和stored payload snapshot承载 | publisher不得从current truth重建payload;publish failure no-rollback | outbound enabled且invalid / unavailable fail-fast |

#### 9.5.11 `replayStore` 配置 demo

```json
{
  "replayStore": {
    "profileRef": "store-profile:replay:memory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `replayStore.profileRef` | `OpaqueRef<StoreProfile>` | `store-profile:replay:memory-p0` | 绑定idempotency、stored result、receipt和job report承载 | command / event / job key family分离;duplicate必须返回stored surface | invalid / unavailable fail-fast;不得重算duplicate |

#### 9.5.12 `replayLifecycle` 配置 demo

```json
{
  "replayLifecycle": {
    "commandRetentionSeconds": 86400,
    "eventDedupRetentionSeconds": 86400,
    "jobRetentionSeconds": 604800,
    "storedResultRetentionSeconds": 604800,
    "reservedRecordMaxAgeSeconds": 3600
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `replayLifecycle.commandRetentionSeconds` | `DurationSeconds` | `86400` | 覆盖command retry / commit-unknown窗口 | 不得短于部署声明的command retry window | invalid / cross-field mismatch fail-fast |
| `replayLifecycle.eventDedupRetentionSeconds` | `DurationSeconds` | `86400` | 覆盖event redelivery窗口 | 不得短于source redelivery window | invalid / cross-field mismatch fail-fast |
| `replayLifecycle.jobRetentionSeconds` | `DurationSeconds` | `604800` | 覆盖scheduler rerun / report replay窗口 | 不得短于scheduler rerun window | invalid / cross-field mismatch fail-fast |
| `replayLifecycle.storedResultRetentionSeconds` | `DurationSeconds` | `604800` | 保证completed idempotency关联stored surface存在 | 必须大于等于前三类retention最大值 | mismatch fail-fast;不得留下completed-without-result |
| `replayLifecycle.reservedRecordMaxAgeSeconds` | `DurationSeconds` | `3600` | 标记长时间in-flight / reserved异常 | 必须小于全部retention;到期只触发diagnostic / reconciliation | invalid fail-fast;不得自动重跑 |

#### 9.5.13 `contextSource` 配置 demo

```json
{
  "contextSource": {
    "adapterProfileRef": "adapter-profile:context-resolver:fake-p0",
    "freshnessThresholdSeconds": 300,
    "resolutionTimeoutMillis": 5000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `contextSource.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | `adapter-profile:context-resolver:fake-p0` | 绑定body-free context resolver | 不生成identity/work/runtime truth,不导入sibling body | invalid fail-fast;unavailable reject / delay / degrade |
| `contextSource.freshnessThresholdSeconds` | `DurationSeconds` | `300` | 判断resolved summary freshness | stale不得由config改成fresh或造fallback summary | invalid fail-fast;stale走formal surface |
| `contextSource.resolutionTimeoutMillis` | `DurationMillis` | `5000` | resolver调用timeout | 不fallback到raw sibling读取 | invalid startup fail-fast;timeout maps unavailable/delayed |

#### 9.5.14 `policySource` 配置 demo

```json
{
  "policySource": {
    "adapterProfileRef": "adapter-profile:policy-summary:fake-p0",
    "freshnessThresholdSeconds": 300,
    "highRiskProfileRef": "policy-profile:high-risk:strict-p0",
    "resolutionTimeoutMillis": 5000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `policySource.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | `adapter-profile:policy-summary:fake-p0` | 绑定policy / authorization summary source | sandbox不拥有policy / allowlist / approval truth | invalid fail-fast;missing/stale/conflicted fail-closed |
| `policySource.freshnessThresholdSeconds` | `DurationSeconds` | `300` | policy summary freshness guard | threshold不允许把missing或unsupported改成allow | invalid fail-fast;stale fail-closed |
| `policySource.highRiskProfileRef` | `OpaqueRef<PolicyProfile>` | `policy-profile:high-risk:strict-p0` | 选择已定义strict high-risk summary interpretation | 不能本地定义tools语义、approval或allowlist | invalid / unsafe profile fail-fast |
| `policySource.resolutionTimeoutMillis` | `DurationMillis` | `5000` | policy adapter timeout | timeout不能default allow | invalid fail-fast;runtime timeout fail-closed |

#### 9.5.15 `backendCapability` 配置 demo

```json
{
  "backendCapability": {
    "adapterProfileRef": "adapter-profile:backend-capability:fake-p0",
    "backendProfileRefs": [
      "backend-profile:non-executing-fake-p0"
    ],
    "freshnessThresholdSeconds": 300,
    "probeTimeoutMillis": 5000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `backendCapability.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | `adapter-profile:backend-capability:fake-p0` | 绑定capability summary probe | summary不等于product truth;P01~04只用fake/simulated | invalid fail-fast;unsupported / unavailable boundary reject |
| `backendCapability.backendProfileRefs` | `UniqueRefList<BackendProfile,16>` | one non-executing fake ref | 注册可选backend profile闭集 | P05~07不得保留fake作为fallback候选 | empty / duplicate / wrong-profile fail-fast |
| `backendCapability.freshnessThresholdSeconds` | `DurationSeconds` | `300` | capability summary freshness guard | stale不能silent allow | invalid fail-fast;stale boundary reject / degrade |
| `backendCapability.probeTimeoutMillis` | `DurationMillis` | `5000` | capability probe timeout | timeout不切换weak backend | invalid fail-fast;runtime timeout unavailable |

#### 9.5.16 `boundaryEnforcement` 配置 demo

```json
{
  "boundaryEnforcement": {
    "boundaryProfileRef": "boundary-profile:strict-non-executing-p0",
    "limitTemplateRef": "limit-template:resource-fs-network-process:strict-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `boundaryEnforcement.boundaryProfileRef` | `OpaqueRef<BoundaryProfile>` | `boundary-profile:strict-non-executing-p0` | 选择coherent boundary requirement profile | 无local/debug relax,不省略任一安全维度 | invalid / incoherent fail-fast or command reject |
| `boundaryEnforcement.limitTemplateRef` | `OpaqueRef<CoherentLimitTemplate>` | four-dimension strict ref | 一次绑定resource/filesystem/network/process要求 | 四维必须整体被backend capability支持,不得best-effort | missing / partial / unsupported reject |

#### 9.5.17 `isolationBackend` 配置 demo

```json
{
  "isolationBackend": {
    "adapterProfileRef": "adapter-profile:isolation-backend:non-executing-fake-p0",
    "launchTimeoutMillis": 30000,
    "inspectTimeoutMillis": 10000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `isolationBackend.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | non-executing fake ref | 绑定lifecycle adapter | P01~04绝不launch real host workload;P05+无fake/host fallback | invalid / disallowed profile fail-fast;runtime outcome formal failed |
| `isolationBackend.launchTimeoutMillis` | `DurationMillis` | `30000` | launch operation timeout | timeout不伪造handle或run success | invalid fail-fast;runtime timeout failed/unavailable |
| `isolationBackend.inspectTimeoutMillis` | `DurationMillis` | `10000` | lifecycle inspection timeout | uncertainty保持orphan / cleanup保守状态 | invalid fail-fast;runtime timeout blocks unsafe release |

#### 9.5.18 `executionCapture` 配置 demo

```json
{
  "executionCapture": {
    "adapterProfileRef": "adapter-profile:execution-capture:deterministic-p0",
    "captureSizeClassRef": "capture-size-class:bounded-small-p0",
    "materialClassRef": "material-class:candidate-body-free-p0",
    "captureTimeoutMillis": 30000,
    "observabilityMaterialEnabled": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `executionCapture.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | deterministic P0 ref | 绑定bounded capture adapter | raw process output不进truth/log/audit | invalid fail-fast;capture unavailable formal failure |
| `executionCapture.captureSizeClassRef` | `OpaqueRef<CaptureSizeClass>` | bounded-small P0 ref | 选择已审查capture size class | 不接受unbounded class | invalid / unbounded fail-fast;runtime overage partial/failed |
| `executionCapture.materialClassRef` | `OpaqueRef<MaterialClass>` | body-free candidate ref | 分类candidate material handoff | 不升格artifact truth,不携带body | invalid class fail-fast |
| `executionCapture.captureTimeoutMillis` | `DurationMillis` | `30000` | capture timeout | timeout不伪造capture complete | invalid fail-fast;runtime timeout formal failed |
| `executionCapture.observabilityMaterialEnabled` | `Bool` | `false` | 注册safe observability material capture/handoff | true要求adapter、target和redaction完整;不替代audit | incomplete dependency fail-fast |

#### 9.5.19 `inboundEvents` 配置 demo

```json
{
  "inboundEvents": {
    "bindings": {
      "callerContextReferenceChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "policySummaryChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "backendCapabilitySummaryChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "isolationBackendLifecycleSignal": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "materialHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "observabilityHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "sandboxControlRequested": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "investigationHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "sandboxTruthRelayFeedback": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null }
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `inboundEvents.bindings` | `InboundBindingMap` | 9个disabled binding | 为9个formal consumer绑定source/schema/quarantine seam | key闭集;enabled时source和quarantine ref必填;schema只选择已实现version,不改DTO / dedup / authority | unknown/missing key fail-fast;bad event reject/quarantine;consumer不创core success |

#### 9.5.20 `eventPublisher` 配置 demo

```json
{
  "eventPublisher": {
    "adapterProfileRef": "adapter-profile:event-publisher:fake-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `eventPublisher.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | fake P0 publisher ref | 绑定formal event publisher adapter | error string不进入domain state;P05+不得fallback fake | outbound enabled且invalid / unavailable fail-fast;publish outcome formal mapping |

#### 9.5.21 `eventRoutes` 配置 demo

```json
{
  "eventRoutes": {
    "bindings": {
      "sandbox.execution-context.changed.v1": "route-profile:fake:execution-context-changed-v1",
      "sandbox.boundary.changed.v1": "route-profile:fake:boundary-changed-v1",
      "sandbox.policy-decision.changed.v1": "route-profile:fake:policy-decision-changed-v1",
      "sandbox.run.changed.v1": "route-profile:fake:run-changed-v1",
      "sandbox.capture.changed.v1": "route-profile:fake:capture-changed-v1",
      "sandbox.material-handoff.changed.v1": "route-profile:fake:material-handoff-changed-v1",
      "sandbox.failure.changed.v1": "route-profile:fake:failure-changed-v1",
      "sandbox.control.changed.v1": "route-profile:fake:control-changed-v1",
      "sandbox.cleanup.changed.v1": "route-profile:fake:cleanup-changed-v1",
      "sandbox.redline-containment.changed.v1": "route-profile:fake:redline-containment-changed-v1",
      "sandbox.projection.changed.v1": "route-profile:fake:projection-changed-v1",
      "sandbox.derived-view.changed.v1": "route-profile:fake:derived-view-changed-v1",
      "sandbox.reconciliation-finding.available.v1": "route-profile:fake:reconciliation-finding-available-v1"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `eventRoutes.bindings` | `RouteBindingMap` | 13 formal keys -> fake route refs | 把formal event family绑定transport route profile | 13 key闭集固定为10 core truth + projection + derived + reconciliation;不修改kind、schema、payload、source truth或cursor;value不是raw topic | unknown/missing key fail-fast;按FC-01~06启用的event缺route fail-fast |

#### 9.5.22 `eventRelay` 配置 demo

```json
{
  "eventRelay": {
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry-policy:relay:deterministic-p0",
    "publishTimeoutMillis": 10000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `eventRelay.publishBatchSize` | `PageLimit` | `50` | new relay loop / job batch ceiling | S05 override受ceiling;不改变stored payload | invalid fail-fast;local越界loop/job reject |
| `eventRelay.publishRetryPolicyRef` | `OpaqueRef<RetryPolicy>` | deterministic P0 ref | 选择relay retry/dead-letter class | duplicate不重建payload;dead-letter不删source relay fact | invalid fail-fast |
| `eventRelay.publishTimeoutMillis` | `DurationMillis` | `10000` | 单次publish timeout | failure no-rollback | invalid fail-fast;runtime maps retryable/failed/dead-letter |

#### 9.5.23 `materialHandoff` 配置 demo

```json
{
  "materialHandoff": {
    "adapterProfileRef": "adapter-profile:material-handoff:fake-p0",
    "targetRefs": []
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `materialHandoff.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | fake P0 ref | 绑定candidate material handoff adapter | I056非空时装配;delivery failure不回滚run/capture;P05+无fake fallback | enabled且invalid / unavailable startup fail-fast |
| `materialHandoff.targetRefs` | `UniqueRefList<HandoffTarget,16>` | `[]` | 注册material target闭集并作为唯一启用源 | `[]` disabled;非空必须1~16项且全部registered / material-class compatible;target receipt不等于artifact truth | nonempty且unregistered/mismatch startup fail-fast;job选择registry外target reject |

#### 9.5.24 `observabilityHandoff` 配置 demo

```json
{
  "observabilityHandoff": {
    "adapterProfileRef": "adapter-profile:observability-handoff:fake-p0",
    "targetRefs": []
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `observabilityHandoff.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | fake P0 ref | 绑定safe observability material handoff | 只有I048=true才装配;不保存observability ledger body,不替代audit | I048=true且invalid/unavailable startup fail-fast;runtime failure只降级handoff |
| `observabilityHandoff.targetRefs` | `UniqueRefList<HandoffTarget,16>` | `[]` | 注册observability material target闭集 | I048=false必须`[]`;I048=true时1~16项且全部registered;只交接safe refs / markers | bool/list冲突或unregistered startup fail-fast |

#### 9.5.25 `investigationHandoff` 配置 demo

```json
{
  "investigationHandoff": {
    "adapterProfileRef": "adapter-profile:investigation-handoff:fake-p0",
    "targetRefs": []
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `investigationHandoff.adapterProfileRef` | `OpaqueRef<AdapterProfile>` | fake P0 ref | 绑定investigation / security handoff | 只有I074=true才装配;ordinary receipt不解除cleanup / redline guard | I074=true且invalid/unavailable startup fail-fast;runtime failure remains pending / contained |
| `investigationHandoff.targetRefs` | `UniqueRefList<HandoffTarget,16>` | `[]` | 注册investigation / escalation target闭集 | I074=false必须`[]`;I074=true时1~16项且全部registered / approved;target不拥有sandbox cleanup truth | bool/list冲突或unregistered startup fail-fast |

#### 9.5.26 `handoffDelivery` 配置 demo

```json
{
  "handoffDelivery": {
    "retryPolicyRef": "retry-policy:handoff:deterministic-p0",
    "pendingRetentionSeconds": 604800,
    "deliveryTimeoutMillis": 10000,
    "retryBatchSize": 50
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoffDelivery.retryPolicyRef` | `OpaqueRef<RetryPolicy>` | deterministic P0 ref | 三类handoff共用delivery retry class | 不修改source truth或伪造downstream acceptance | invalid fail-fast |
| `handoffDelivery.pendingRetentionSeconds` | `DurationSeconds` | `604800` | 保留pending / failed handoff fact | 必须覆盖retry window;到期不删除evidence | invalid / too-short fail-fast;expiry manual blocker |
| `handoffDelivery.deliveryTimeoutMillis` | `DurationMillis` | `10000` | 单次delivery timeout | timeout no-rollback | invalid fail-fast;runtime retryable/failed |
| `handoffDelivery.retryBatchSize` | `PageLimit` | `50` | retry job batch ceiling | S05只作用new run且受ceiling | invalid fail-fast;local越界job reject |

#### 9.5.27 `leaseSafety` 配置 demo

```json
{
  "leaseSafety": {
    "leaseProfileRef": "lease-profile:deterministic-guarded-p0",
    "orphanScanCadenceRef": "cadence-profile:manual-orphan-scan-p0",
    "scanBatchSize": 50
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `leaseSafety.leaseProfileRef` | `OpaqueRef<LeaseProfile>` | guarded P0 ref | 绑定boundary establishment的handle / lease profile | window随boundary group保存;run / reaper不得重算;expiry只触发guarded inspection | missing / invalid使boundary establishment拒绝 |
| `leaseSafety.orphanScanCadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定orphan scan schedule class | manual不等于已调度;cadence不决定eligibility | invalid fail-fast |
| `leaseSafety.scanBatchSize` | `PageLimit` | `50` | orphan scan batch ceiling | S05受ceiling;不绕guard | invalid fail-fast;local越界job reject |

#### 9.5.28 `cleanupSafety` 配置 demo

```json
{
  "cleanupSafety": {
    "evaluationCadenceRef": "cadence-profile:manual-cleanup-evaluation-p0",
    "retentionGuardProfileRef": "cleanup-guard-profile:strict-evidence-investigation-redline-p0",
    "evaluationBatchSize": 50
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `cleanupSafety.evaluationCadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定cleanup guard evaluation schedule | 无scheduler只代表manual-only,不跳过evaluation | invalid fail-fast |
| `cleanupSafety.retentionGuardProfileRef` | `OpaqueRef<CleanupGuardProfile>` | strict evidence/investigation/redline ref | 选择保守cleanup guard | 不允许force-clean、ignore-evidence、receipt-release | invalid / unsafe fail-fast |
| `cleanupSafety.evaluationBatchSize` | `PageLimit` | `50` | cleanup evaluation batch ceiling | job不repair core truth | invalid fail-fast;local越界job reject |

#### 9.5.29 `backendRelease` 配置 demo

```json
{
  "backendRelease": {
    "adapterProfileRef": null,
    "retryPolicyRef": "retry-policy:backend-release:deterministic-p0",
    "releaseTimeoutMillis": 30000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `backendRelease.adapterProfileRef` | `OptionalOpaqueRef<AdapterProfile>` | `null` | null时复用isolation backend release capability | 非null只允许显式release adapter;均须经过cleanup/redline guard | missing capability / invalid override fail-fast |
| `backendRelease.retryPolicyRef` | `OpaqueRef<RetryPolicy>` | deterministic P0 ref | release retry class | retry不绕guard、不切弱backend、不伪造Released | invalid fail-fast |
| `backendRelease.releaseTimeoutMillis` | `DurationMillis` | `30000` | release operation timeout | uncertainty保持orphan / failed | invalid fail-fast;runtime failure blocks unsafe completion |

#### 9.5.30 `redlineSafety` 配置 demo

```json
{
  "redlineSafety": {
    "containmentHandoffEnabled": false,
    "maintenanceCadenceRef": "cadence-profile:manual-redline-maintenance-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `redlineSafety.containmentHandoffEnabled` | `Bool` | `false` | 外部investigation handoff的唯一启用源 | false要求I060=[]且不关闭redline detection、containment或cleanup block;true要求I059可用且I060含1~16个registered target | bool/list冲突或dependency incomplete startup fail-fast |
| `redlineSafety.maintenanceCadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定redline maintenance schedule class | manual-only不等于advisory-only;release仍需formal guard | invalid fail-fast |

#### 9.5.31 `referenceRefresh` 配置 demo

```json
{
  "referenceRefresh": {
    "staleThresholdSeconds": 300,
    "batchSize": 50,
    "cadenceRef": "cadence-profile:manual-reference-refresh-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `referenceRefresh.staleThresholdSeconds` | `DurationSeconds` | `300` | reference freshness判定 | stale只改变formal freshness / degraded surface | invalid fail-fast |
| `referenceRefresh.batchSize` | `PageLimit` | `50` | refresh job batch ceiling | 只更新body-free reference state,不写core truth | invalid fail-fast;local越界job reject |
| `referenceRefresh.cadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定refresh schedule class | 无scheduler不伪造job执行 | invalid fail-fast |

#### 9.5.32 `projectionMaintenance` 配置 demo

```json
{
  "projectionMaintenance": {
    "staleThresholdSeconds": 300,
    "rebuildBatchSize": 50,
    "cadenceRef": "cadence-profile:manual-projection-rebuild-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projectionMaintenance.staleThresholdSeconds` | `DurationSeconds` | `300` | projection freshness判定 | query no-write;stale不得自动repair | invalid fail-fast |
| `projectionMaintenance.rebuildBatchSize` | `PageLimit` | `50` | rebuild batch ceiling | rebuild只替换view,不修core truth | invalid fail-fast;local越界job reject |
| `projectionMaintenance.cadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定rebuild schedule class | query不得因manual-only而触发写 | invalid fail-fast |

#### 9.5.33 `derivedMaintenance` 配置 demo

```json
{
  "derivedMaintenance": {
    "batchSize": 50,
    "comparisonScopeRef": "comparison-scope:fixture-backends-p0",
    "cadenceRef": "cadence-profile:manual-derived-maintenance-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `derivedMaintenance.batchSize` | `PageLimit` | `50` | inspect/preview/trend/comparison batch ceiling | derived不成为truth或policy decision | invalid fail-fast;local越界job reject |
| `derivedMaintenance.comparisonScopeRef` | `OpaqueRef<ComparisonScope>` | fixture backend scope ref | 选择registered comparison scope | 不从string猜backend,不导入method / runtime语义 | invalid / unregistered fail-fast or job reject |
| `derivedMaintenance.cadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定derived maintenance schedule | 无scheduler不伪造执行 | invalid fail-fast |

#### 9.5.34 `reconciliationMaintenance` 配置 demo

```json
{
  "reconciliationMaintenance": {
    "cadenceRef": "cadence-profile:manual-reconciliation-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `reconciliationMaintenance.cadenceRef` | `OpaqueRef<CadenceProfile>` | manual P0 cadence | 绑定reconciliation report schedule | finding不升格accepted fact,job不得auto-fix | invalid fail-fast |

#### 9.5.35 `runtimeTelemetry` 配置 demo

```json
{
  "runtimeTelemetry": {
    "logSinkProfileRef": "telemetry-sink-profile:safe-local-log-p0",
    "metricSinkProfileRef": "telemetry-sink-profile:in-memory-metric-p0",
    "minimumLogLevel": "info",
    "samplingClassRef": "sampling-class:deterministic-safe-p0",
    "labelPolicyRef": "metric-label-policy:low-cardinality-strict-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `runtimeTelemetry.logSinkProfileRef` | `OpaqueRef<TelemetrySinkProfile>` | safe-local log ref | 绑定structured runtime log sink | infra-private validated section;不成为`SandboxAdapterKind`;safe local diagnostic不可关闭 | invalid fail-fast;optional external sink unavailable degraded |
| `runtimeTelemetry.metricSinkProfileRef` | `OpaqueRef<TelemetrySinkProfile>` | in-memory metric ref | 绑定metric sink | metric不替代audit / truth;labels受I090 | invalid fail-fast;optional external sink unavailable degraded |
| `runtimeTelemetry.minimumLogLevel` | `LogLevel` | `info` | 过滤低优先级safe log | 不支持trace;任何level都执行redaction;security/startup failure仍输出 | invalid fail-fast |
| `runtimeTelemetry.samplingClassRef` | `OpaqueRef<SamplingClass>` | deterministic-safe ref | 选择已验证sampling class | 不得采样掉formal audit、redline、startup/config failure;不允许raw debug | invalid / unsafe class fail-fast |
| `runtimeTelemetry.labelPolicyRef` | `OpaqueRef<MetricLabelPolicy>` | low-cardinality strict ref | 限制metric label集合 | 禁止request/actor/subject/trace/ref/free-text等高基数label | invalid / unsafe policy fail-fast |

#### 9.5.36 `auditTrace` 配置 demo

```json
{
  "auditTrace": {
    "routeProfileRef": "audit-route-profile:truth-uow-mandatory-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `auditTrace.routeProfileRef` | `OpaqueRef<AuditRouteProfile>` | truth-UoW mandatory ref | 把accepted audit绑定I017同一UoW | 无enabled bool;不能async-loss、best-effort或metric substitution | invalid / UoW mismatch startup fail-fast;append failure rolls back mutation |

#### 9.5.37 `diagnostics` 配置 demo

```json
{
  "diagnostics": {
    "surfaceProfileRef": "diagnostic-surface-profile:redacted-local-p0",
    "retentionClassRef": "retention-class:diagnostic-short-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `diagnostics.surfaceProfileRef` | `OpaqueRef<DiagnosticSurfaceProfile>` | redacted-local P0 ref | 选择safe local / formal marker diagnostic surface | 当前无独立external diagnostic port;只输出stable code / summary / refs | invalid fail-fast;future external port先回写`03` |
| `diagnostics.retentionClassRef` | `OpaqueRef<RetentionClass>` | diagnostic-short P0 ref | 选择formal diagnostic marker retention class | 不保存raw config/SQL/HTTP/SDK/stack/process output | invalid / unsafe class fail-fast |

#### 9.5.38 `safeOutput` 配置 demo

```json
{
  "safeOutput": {
    "redactionProfileRef": "redaction-profile:strict-body-free-p0",
    "forbiddenFieldClasses": [
      "rawConfig",
      "rawSecret",
      "credential",
      "privateKey",
      "rawEndpoint",
      "rawTopic",
      "externalBody",
      "sdkResponse",
      "processOutput",
      "stackTrace",
      "sqlText",
      "httpBody",
      "rawIdempotencyKey",
      "rawDedupKey",
      "artifactPackageBody",
      "observabilityLedgerBody",
      "investigationBody"
    ]
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `safeOutput.redactionProfileRef` | `OpaqueRef<RedactionProfile>` | strict body-free P0 ref | 选择所有log/metric/audit/receipt/report/output的安全gate | 所有profile mandatory;不存在debug relax | missing / unsafe / unknown fail-fast |
| `safeOutput.forbiddenFieldClasses` | `ForbiddenFieldClassList` | 17类immutable deny floor | 定义禁止进入可观测和输出表面的字段类别 | S02只能增加已知deny class,不得删除/重命名/allow;unknown class防拼写错误 | 缺项 / duplicate / unknown fail-fast |

#### 9.5.39 `deterministicAdapters` 配置 demo

```json
{
  "deterministicAdapters": {
    "clockProfileRef": "adapter-profile:clock:deterministic-p0",
    "idGeneratorProfileRef": "adapter-profile:id-generator:deterministic-p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `deterministicAdapters.clockProfileRef` | `OpaqueRef<AdapterProfile>` | deterministic clock ref | 绑定clock port adapter | fixture只控制fake value;P05+必须使用approved runtime clock且禁S06 | invalid / profile mismatch fail-fast |
| `deterministicAdapters.idGeneratorProfileRef` | `OpaqueRef<AdapterProfile>` | deterministic id ref | 绑定id generator port adapter | 不允许timestamp/hash/random string替代formal id port | invalid / profile mismatch fail-fast |

#### 9.5.40 `testFixtures` 配置 demo

```json
{
  "testFixtures": {
    "fixtureSetRef": "fixture-set:sandbox:local-contract-p0",
    "fixedClockInstant": "2026-01-01T00:00:00Z",
    "idSeed": 1,
    "failureScenarioRefs": []
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `testFixtures.fixtureSetRef` | `OpaqueRef<FixtureSet>` | local-contract P0 fixture | 选择S06 fake/store/adapter fixture registry | P01/P03可选;P02 deterministic case和P04 simulation按条件必需;fake保持state/UoW/replay/redaction parity | required时missing test/simulation fail-fast;P05~07 profile reject |
| `testFixtures.fixedClockInstant` | `Rfc3339Instant` | `2026-01-01T00:00:00Z` | deterministic clock value | 仅test profile;test-safe G12 default可由S06 fixture-owned slot覆盖;UTC RFC3339 | invalid / absent with deterministic clock test fail-fast;P05~07 reject |
| `testFixtures.idSeed` | `OptionalU64` | `1` | deterministic id sequence seed | 仅test profile;test-safe G12 default可由S06覆盖;不得成为production id source | invalid / absent with deterministic id test fail-fast;P05~07 reject |
| `testFixtures.failureScenarioRefs` | `UniqueRefList<FailureScenario,64>` | `[]` | 注入formal adapter / store failure outcome | test-safe G12 baseline可由S06覆盖;不得跳过state、transaction、replay、redaction或真实资格门禁 | unknown / duplicate test fail-fast;P05~07 reject |

### 9.6 完整 JSONC 文档示例

以下代码块仅是带注释的文档示例。`infra/config.rs`运行时只接受严格 JSON;实际配置必须删除所有`//`注释,并保持无duplicate key、无trailing comma、无unknown key。该示例是PROFILE-01 `local-contract`的non-executing fake组合,不表示真实backend、生产部署、测试通过或验收资格。

```jsonc
{
  // Select exactly one profile; this example never launches a real host workload.
  "configIdentity": {
    "profile": "local-contract"
  },
  "entryEnvelope": {
    "maxCommandBodyBytes": 1048576,
    "maxQueryPageLimit": 100,
    "syncCommandTimeoutMillis": 30000,
    "queryReadTimeoutMillis": 10000,
    "defaultDiagnosticsMode": "safe"
  },
  "workerEnvelope": {
    "defaultBatchSize": 32,
    "maxParallelism": 1,
    "loopTimeoutMillis": 30000
  },
  "jobEnvelope": {
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "jobTimeoutMillis": 300000,
    "retryPolicyRef": "retry-policy:job:deterministic-p0"
  },
  "featureAssembly": {
    "outboundEventsEnabled": false,
    "derivedEventsEnabled": false,
    "reconciliationEnabled": false
  },

  // Logical stores remain separate because their contracts and failure surfaces differ.
  "truthStore": {
    "profileRef": "store-profile:truth:memory-p0"
  },
  "projectionStore": {
    "profileRef": "store-profile:projection:memory-p0"
  },
  "derivedStore": {
    "profileRef": "store-profile:derived:memory-p0"
  },
  "referenceStore": {
    "profileRef": "store-profile:reference:memory-p0"
  },
  "relayStore": {
    "profileRef": "store-profile:relay:memory-p0"
  },
  "replayStore": {
    "profileRef": "store-profile:replay:memory-p0"
  },
  "replayLifecycle": {
    "commandRetentionSeconds": 86400,
    "eventDedupRetentionSeconds": 86400,
    "jobRetentionSeconds": 604800,
    "storedResultRetentionSeconds": 604800,
    "reservedRecordMaxAgeSeconds": 3600
  },

  // External sources provide body-free summaries; policy and sibling truth stay external.
  "contextSource": {
    "adapterProfileRef": "adapter-profile:context-resolver:fake-p0",
    "freshnessThresholdSeconds": 300,
    "resolutionTimeoutMillis": 5000
  },
  "policySource": {
    "adapterProfileRef": "adapter-profile:policy-summary:fake-p0",
    "freshnessThresholdSeconds": 300,
    "highRiskProfileRef": "policy-profile:high-risk:strict-p0",
    "resolutionTimeoutMillis": 5000
  },
  "backendCapability": {
    "adapterProfileRef": "adapter-profile:backend-capability:fake-p0",
    "backendProfileRefs": [
      "backend-profile:non-executing-fake-p0"
    ],
    "freshnessThresholdSeconds": 300,
    "probeTimeoutMillis": 5000
  },

  // Resource, filesystem, network, and process boundaries are one coherent template.
  "boundaryEnforcement": {
    "boundaryProfileRef": "boundary-profile:strict-non-executing-p0",
    "limitTemplateRef": "limit-template:resource-fs-network-process:strict-p0"
  },
  "isolationBackend": {
    "adapterProfileRef": "adapter-profile:isolation-backend:non-executing-fake-p0",
    "launchTimeoutMillis": 30000,
    "inspectTimeoutMillis": 10000
  },
  "executionCapture": {
    "adapterProfileRef": "adapter-profile:execution-capture:deterministic-p0",
    "captureSizeClassRef": "capture-size-class:bounded-small-p0",
    "materialClassRef": "material-class:candidate-body-free-p0",
    "captureTimeoutMillis": 30000,
    "observabilityMaterialEnabled": false
  },

  // All nine consumers are declared; local-contract keeps every source disabled.
  "inboundEvents": {
    "bindings": {
      "callerContextReferenceChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "policySummaryChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "backendCapabilitySummaryChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "isolationBackendLifecycleSignal": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "materialHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "observabilityHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "sandboxControlRequested": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "investigationHandoffStatusChanged": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null },
      "sandboxTruthRelayFeedback": { "enabled": false, "sourceProfileRef": null, "schemaVersions": ["v1"], "quarantineProfileRef": null }
    }
  },
  "eventPublisher": {
    "adapterProfileRef": "adapter-profile:event-publisher:fake-p0"
  },
  "eventRoutes": {
    "bindings": {
      "sandbox.execution-context.changed.v1": "route-profile:fake:execution-context-changed-v1",
      "sandbox.boundary.changed.v1": "route-profile:fake:boundary-changed-v1",
      "sandbox.policy-decision.changed.v1": "route-profile:fake:policy-decision-changed-v1",
      "sandbox.run.changed.v1": "route-profile:fake:run-changed-v1",
      "sandbox.capture.changed.v1": "route-profile:fake:capture-changed-v1",
      "sandbox.material-handoff.changed.v1": "route-profile:fake:material-handoff-changed-v1",
      "sandbox.failure.changed.v1": "route-profile:fake:failure-changed-v1",
      "sandbox.control.changed.v1": "route-profile:fake:control-changed-v1",
      "sandbox.cleanup.changed.v1": "route-profile:fake:cleanup-changed-v1",
      "sandbox.redline-containment.changed.v1": "route-profile:fake:redline-containment-changed-v1",
      "sandbox.projection.changed.v1": "route-profile:fake:projection-changed-v1",
      "sandbox.derived-view.changed.v1": "route-profile:fake:derived-view-changed-v1",
      "sandbox.reconciliation-finding.available.v1": "route-profile:fake:reconciliation-finding-available-v1"
    }
  },
  "eventRelay": {
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry-policy:relay:deterministic-p0",
    "publishTimeoutMillis": 10000
  },

  // Material, observability, and investigation targets are three separate registries.
  "materialHandoff": {
    "adapterProfileRef": "adapter-profile:material-handoff:fake-p0",
    "targetRefs": []
  },
  "observabilityHandoff": {
    "adapterProfileRef": "adapter-profile:observability-handoff:fake-p0",
    "targetRefs": []
  },
  "investigationHandoff": {
    "adapterProfileRef": "adapter-profile:investigation-handoff:fake-p0",
    "targetRefs": []
  },
  "handoffDelivery": {
    "retryPolicyRef": "retry-policy:handoff:deterministic-p0",
    "pendingRetentionSeconds": 604800,
    "deliveryTimeoutMillis": 10000,
    "retryBatchSize": 50
  },

  // Cadence refs are manual in P0; they do not claim that a scheduler is deployed.
  "leaseSafety": {
    "leaseProfileRef": "lease-profile:deterministic-guarded-p0",
    "orphanScanCadenceRef": "cadence-profile:manual-orphan-scan-p0",
    "scanBatchSize": 50
  },
  "cleanupSafety": {
    "evaluationCadenceRef": "cadence-profile:manual-cleanup-evaluation-p0",
    "retentionGuardProfileRef": "cleanup-guard-profile:strict-evidence-investigation-redline-p0",
    "evaluationBatchSize": 50
  },
  "backendRelease": {
    "adapterProfileRef": null,
    "retryPolicyRef": "retry-policy:backend-release:deterministic-p0",
    "releaseTimeoutMillis": 30000
  },
  "redlineSafety": {
    "containmentHandoffEnabled": false,
    "maintenanceCadenceRef": "cadence-profile:manual-redline-maintenance-p0"
  },
  "referenceRefresh": {
    "staleThresholdSeconds": 300,
    "batchSize": 50,
    "cadenceRef": "cadence-profile:manual-reference-refresh-p0"
  },
  "projectionMaintenance": {
    "staleThresholdSeconds": 300,
    "rebuildBatchSize": 50,
    "cadenceRef": "cadence-profile:manual-projection-rebuild-p0"
  },
  "derivedMaintenance": {
    "batchSize": 50,
    "comparisonScopeRef": "comparison-scope:fixture-backends-p0",
    "cadenceRef": "cadence-profile:manual-derived-maintenance-p0"
  },
  "reconciliationMaintenance": {
    "cadenceRef": "cadence-profile:manual-reconciliation-p0"
  },

  // Runtime telemetry, formal audit, diagnostics, and redaction remain separate surfaces.
  "runtimeTelemetry": {
    "logSinkProfileRef": "telemetry-sink-profile:safe-local-log-p0",
    "metricSinkProfileRef": "telemetry-sink-profile:in-memory-metric-p0",
    "minimumLogLevel": "info",
    "samplingClassRef": "sampling-class:deterministic-safe-p0",
    "labelPolicyRef": "metric-label-policy:low-cardinality-strict-p0"
  },
  "auditTrace": {
    "routeProfileRef": "audit-route-profile:truth-uow-mandatory-p0"
  },
  "diagnostics": {
    "surfaceProfileRef": "diagnostic-surface-profile:redacted-local-p0",
    "retentionClassRef": "retention-class:diagnostic-short-p0"
  },
  "safeOutput": {
    "redactionProfileRef": "redaction-profile:strict-body-free-p0",
    "forbiddenFieldClasses": [
      "rawConfig",
      "rawSecret",
      "credential",
      "privateKey",
      "rawEndpoint",
      "rawTopic",
      "externalBody",
      "sdkResponse",
      "processOutput",
      "stackTrace",
      "sqlText",
      "httpBody",
      "rawIdempotencyKey",
      "rawDedupKey",
      "artifactPackageBody",
      "observabilityLedgerBody",
      "investigationBody"
    ]
  },

  // These slots belong only to local/CI/seam/simulation profiles.
  "deterministicAdapters": {
    "clockProfileRef": "adapter-profile:clock:deterministic-p0",
    "idGeneratorProfileRef": "adapter-profile:id-generator:deterministic-p0"
  },
  "testFixtures": {
    "fixtureSetRef": "fixture-set:sandbox:local-contract-p0",
    "fixedClockInstant": "2026-01-01T00:00:00Z",
    "idSeed": 1,
    "failureScenarioRefs": []
  }
}
```

完整示例边界:

- 运行时必须删除注释;`.jsonc`文件、JSON注释和trailing comma都不受支持。
- P01默认中的`non-executing-fake`不能执行host command、tool semantic execution或runtime agent loop。
- 把`profile`改为P05 / P06不会自动升级本示例;validator必须拒绝这些fake / memory / fixture值并要求显式candidate / real-like binding。
- `targetRefs=[]`和外围feature false只关闭交接 / event外围注册,不关闭capture fact、formal audit、cleanup guard、redline containment或redaction。
- 示例中的ref是设计级opaque family示例,不是endpoint、topic、credential、secret material、真实evidence alias或已存在部署对象。

### 9.7 配置域停审记录

停审列固定检查:名称 / 类型、默认 / 必填、来源 / 作用域、生效 / 敏感、失败策略、profile差异、`03` carrier。`通过`表示本Step设计闭合,不表示代码、测试、部署或验收已完成。

| 配置域 | 名称 / 类型 | 默认 / 必填 | 来源 / 作用域 | 生效 / 敏感 / 失败 | Profile / `03` | 结论 / 修正 |
|---|---:|---:|---:|---:|---:|---|
| D01 | 是 | 不适用,selector有default discovery | 是 | 是 | 是 | 通过;无JSON key,source选择归S05 / entry |
| D02 | 是 | 是 | 是 | 是 | 是 | 通过;I001 + derived redacted identity |
| D03 | 无独立key为正式结论 | 不适用 | 是 | 是 | 是 | 通过;不提供strict bypass bool |
| D04 | derived builder / availability | 不适用 | 是 | 是 | 是 | 通过;只消费validated refs |
| D05 | 是 | 是 | 是 | 是 | 是 | 通过;entry ceiling与safe diagnostics分离 |
| D06 | 是 | 是 | 是 | 是 | 是 | 通过;new-loop snapshot且不直读repository |
| D07 | 是 | 是 | 是 | 是 | 是 | 通过;typed job input不被raw flag替代 |
| D08 | 是 | 是 | 是 | 是 | 是 | 通过;13类event分为10 core + projection + derived + reconciliation;I015依赖I014,I016读面独立;无core guard开关 |
| D09 | 是 | 是 | 是 | 是 | 是 | 通过;truth/audit/UoW同承载能力校验 |
| D10 | 是 | 是 | 是 | 是 | 是 | 通过;projection和derived仍拆成两个模块 |
| D11 | 是 | 是 | 是 | 是 | 是 | 通过;body-free store边界明确 |
| D12 | 是 | 是 | 是 | 是 | 是 | 通过;relay payload snapshot与truth分离 |
| D13 | 是 | 是 | 是 | 是 | 是 | 通过;store与5项retention cross-field闭合 |
| D14 | 是 | 是 | 是 | 是 | 是 | 通过;resolver不生成sibling truth |
| D15 | 是 | 是 | 是 | 是 | 是 | 通过;missing/stale/conflict始终fail-closed |
| D16 | 是 | 是 | 是 | 是 | 是 | 通过;candidate set与probe包络闭合 |
| D17 | 是 | 是 | 是 | 是 | 是 | 通过;四维coherent template不可partial |
| D18 | 是 | 是 | 是 | 是 | 是 | 通过;P01~04 non-executing,P05+无weak fallback |
| D19 | 是 | 是 | 是 | 是 | 是 | 通过;capture / material / observability分层 |
| D20 | lease消费项已定位 | 是 | 是 | 是 | 是 | 通过;无第二owner / force-release key |
| D21 | 是 | 是 | 是 | 是 | 是 | 通过;9个formal consumer key闭集 |
| D22 | 是 | 是 | 是 | 是 | 是 | 通过;I014=true才装配publisher,publisher只返回formal outcome |
| D23 | 是 | 是 | 是 | 是 | 是 | 通过;13个topic-neutral key闭集且启用组由FC-01~06唯一判定 |
| D24 | 是 | 是 | 是 | 是 | 是 | 通过;普通/derived/reconciliation relay条件明确,batch/retry/timeout不改变no-rollback |
| D25 | 是 | 是 | 是 | 是 | 是 | 通过;I056非空是唯一启用源,material target / artifact truth分离 |
| D26 | 是 | 是 | 是 | 是 | 是 | 通过;I048是唯一启用源且与I058双向校验;observability handoff / local telemetry分离 |
| D27 | 是 | 是 | 是 | 是 | 是 | 通过;I074是唯一启用源且与I060双向校验;investigation target不拥有release truth |
| D28 | 是 | 是 | 是 | 是 | 是 | 通过;pending retention不删除failed fact |
| D29 | 是 | 是 | 是 | 是 | 是 | 通过;expiry只触发guarded inspection |
| D30 | 是 | 是 | 是 | 是 | 是 | 通过;无force-clean / bypass key |
| D31 | 是 | 是 | 是 | 是 | 是 | 通过;null override语义和required capability闭合 |
| D32 | 是 | 是 | 是 | 是 | 是 | 通过;false只关闭外部handoff,containment mandatory |
| D33 | 是 | 是 | 是 | 是 | 是 | 通过;refresh只写body-free reference state |
| D34 | 是 | 是 | 是 | 是 | 是 | 通过;query no-write / rebuild no-repair |
| D35 | 是 | 是 | 是 | 是 | 是 | 通过;comparison scope注册且derived非truth |
| D36 | 是 | 是 | 是 | 是 | 是 | 通过;report only,no auto-fix |
| D37 | 是 | 是 | 是 | 是 | 是 | 通过;infra-private validated section,未伪造adapter kind |
| D38 | 是 | 是 | 是 | 是 | 是 | 通过;mandatory truth-UoW audit route,无disable bool |
| D39 | 是 | 是 | 是 | 是 | 是 | 通过;当前只用local/formal marker surface |
| D40 | 是 | 是 | 是 | 是 | 是 | 通过;17类immutable deny floor |
| D41 | 是 | 是 | 是 | 是 | 是 | 通过;只选择一个profile,无overlay |
| D42 | 是 | 是 | 是 | 是 | 是 | 通过;4个test-owned slot,P05~07禁止 |
| D43 | 无独立key为正式结论 | conditional completeness | 是 | 是 | 是 | 通过;无`realLikeEnabled`,选择profile即严格验全binding |
| D44 | 无raw key为正式结论 | 不适用 | 无current source | design-time reject | 是 | 通过;任何reload/overlay先回写`03` |

### 9.8 跨配置项闭环审计表

| 审计项 | 结论 | 证据 / 修正 | unresolved缺口 |
|---|---|---|---|
| Item ID是否连续唯一 | 是 | I001~I101连续;每个定义一次 | 无 |
| 101项是否均有精确类型 | 是 | §9.1.2词汇表 + §9.2 item表 | 无 |
| required / conditional / test-only是否明确 | 是 | 每项必填性列;conditional给触发条件 | 无 |
| required项是否都有失败策略 | 是 | 每项失败策略非空;高风险项fail-fast/fail-closed | 无 |
| raw secret item数量是否为零 | 是 | sensitive项全部opaque ref;`secret` material不进入普通JSON | Step 8继续定义S04读取/轮换,非本步缺口 |
| S01 < S02 < S03是否误覆盖结构化map | 否 | I049/I051、target list、deny list使用G12;S03只allowlist scalar/single ref | 无 |
| S04是否成为global override | 否 | M只解析selected opaque binding ref;不回写snapshot,无raw env/file fallback | exact resolver流程留Step 8 |
| S05是否改global snapshot | 否 | §9.4只允许source/profile/diagnostics/worker binding/typed run input;受ceiling / registry约束 | 无 |
| S06是否可进入real-like | 否 | P05~07出现I098~I101或fixture-owned override即profile reject | 无 |
| D01~D44是否各出现一次 | 是 | §9.3按顺序44行 | 无 |
| 是否存在泛化顶层模块 | 否 | 40个功能模块;无`runtime/storage/stores/common/misc` | 无 |
| 项目本地key是否重复`sandbox`前缀 | 否 | 顶层均为功能名;仅formal protocol route key保留`sandbox.*` | 无 |
| module demo是否均为严格JSON | 是,已机械校验 | §9.5共40个`json`块均由JSON parser解析通过;无注释/trailing comma;合并后与完整示例去注释对象完全一致 | 无 |
| 每个module demo后是否有说明表 | 是 | §9.5.1~§9.5.40每块后紧邻6列表 | 无 |
| 完整demo是否明确JSONC only | 是 | §9.6开头、结尾均声明runtime只接受strict JSON | 无 |
| P0是否可能执行真实host workload | 否 | P01~04 I041只允许non-executing fake;real adapter/profile cross-check reject | 无 |
| real-like是否fallback fake / memory / fixture | 否 | D43 completeness + P05~07 profile规则严格拒绝S01 fake / S06 | 无 |
| execution environment identity是否闭合 | 是 | I001 profile + D14 refs + I036 backend set + I039/I040 boundary + I065 lease;identity仍由domain flow生成 | 无 |
| resource/fs/network/process boundary是否闭合 | 是 | I040是四维coherent template,不提供独立partial override | 无 |
| tool/runtime launch policy是否越界 | 否 | I031~I034只消费external policy/high-risk summary;不定义tool semantic execution或agent loop | 无 |
| capture/handoff/observability是否混层 | 否 | I044~I048、I055~I060、I086~I095分owner | 无 |
| failure classification是否配置化 | 否 | retry/timeout只控制包络;formal error / state / outcome enum保持`03` | 无 |
| cleanup/lease/reaper/redline是否可绕过 | 否 | 无force-clean/disable containment;I069 strict guard;I074只控制external handoff | 无 |
| audit是否可被log/metric替代 | 否 | I091 mandatory truth-UoW route;D37 sink failure不改变audit | 无 |
| D37是否伪造`SandboxAdapterKind` | 否 | telemetry是infra-private validated section;没有新port / DTO / summary field | future independent health需要重开`03` |
| D39是否伪造external diagnostic port | 否 | 当前I092只允许redacted local/formal marker surface | future external port需要重开`03` |
| retention是否可能破坏stored replay | 否 | I026 >= max(I023,I024,I025);reserved expiry不重跑 | Step 9定义exact validator |
| 13类outbound是否有唯一启用判定 | 是 | §9.1.5固定10 core + projection由I014控制,derived由I014+I015控制,reconciliation读面由I016控制且event由I014+I016控制 | 无 |
| derived event能否绕过普通outbound基础 | 否 | FC-01 / FC-03要求I015=true时I014=true;冲突startup fail-fast | 无 |
| reconciliation是否被错误绑定到outbound总开关 | 否 | FC-04允许I016=true且I014=false时独立注册query/job,但禁止append event | 无 |
| 三类handoff是否存在双启用源 | 否 | material只由I056非空启用;observability只由I048启用;investigation只由I074启用;adapter ref和fixture不推断启用 | 无 |
| disabled handoff是否残留非空target | 否 | I048=false要求I058=[];I074=false要求I060=[];material以I056=[]直接表示disabled | 无 |
| feature bool是否关闭core guard | 否 | I014~I016只注册外围;无capture/audit/idempotency/cleanup/redline/redaction disable | 无 |
| P2 overlay/reload是否暗中出现 | 否 | D44无key;S07/S08 unsupported | 无 |
| 是否伪造产品、部署、测试或验收事实 | 否 | ref均为抽象P0示例;无endpoint/topic/credential、run_id、evidence、result或signature | 无 |

### 9.9 配置项到详细设计载体审计

| Item组 | `03`既有载体 | 本Step装配方式 | 是否新增contract |
|---|---|---|---:|
| I001 | `profile_ref`;summary `config_profile_ref` | validator选择profile并生成redacted summary | 否 |
| I002~I016 | `SandboxBoundaryConfig`;`SandboxJobConfig`;`SandboxFeatureConfig`;entry / worker typed params | infra config解析后注入entry / runner / builder | 否 |
| I017~I027 | six store refs;idempotency / result retention fields | builder装配repositories / UoW,typed retention注入stores | 否 |
| I028~I038 | context / policy / capability adapter refs和typed freshness | adapter refs进入summary `adapter_profile_refs`;knob直接注入wrapper | 否 |
| I039~I048 | boundary / limit / backend / capture refs和timeouts | refs进入backend / adapter profile surface;typed knob注入services | 否 |
| I049~I054 | Step 14 inbound binding、publisher ref、topic-neutral map、relay config | config owner装配worker source / publisher / route registry | 否 |
| I055~I064 | three handoff refs / target refs / retry ref | refs进入adapter profile / target registry;delivery knob注入wrapper | 否 |
| I065~I085 | lease / cleanup / release / redline / projection / derived / job bindings | I065注入generation-scoped boundary establish adapter;其余按startup registry + new-job frozen typed snapshot装配 | 否 |
| I086~I090 | Step 15 log / metric hooks;Step 14允许infra config / OTel product后移 | infra-private validated telemetry section;不进domain/public contract | 否 |
| I091 | `SandboxAuditTrace`;truth audit repository / UoW | 只选择既有same-UoW route profile | 否 |
| I092~I095 | Step 15 diagnostic / redaction hooks | infra-private safe surface + output gate | 否 |
| I096~I101 | Clock / Id ports和fake parity/test fixture boundary | adapter refs进入summary;S06值只进test harness | 否 |

### 9.10 Historical Material / Blocker 记录

| ID | 类型 | 状态 | 冲突 / 缺口 | 本 Step 处理 |
|---|---|---|---|---|
| SBX-CFG-ITEM-HIST-001 | historical_material | contained | 旧README把Docker/gVisor、默认no-egress、seccomp/AppArmor/cap-drop和旧backend列表写成配置事实 | 未生成任何产品key或产品默认;I036/I041仅为abstract profile ref |
| SBX-CFG-ITEM-HIST-002 | historical_material | contained | 旧`05/06`存在host runtime、本地allowlist、cleanup-disabled / force cleanup方向 | I031~I040保持policy外部truth/coherent boundary/no host fallback;I068~I075无force-clean/disable containment |
| SBX-CFG-ITEM-HIST-003 | historical_material | contained | 旧材料可能把artifact output / observability ledger body当sandbox-owned存储 | I046/I055~I060/I086~I095只保存body-free refs并分离capture/handoff/telemetry/audit |
| SBX-CFG-ITEM-CARRIER-001 | carrier watch | resolved_for_step_7 | D37 exact sink/sampling carrier此前未定 | 采用`infra/config.rs`私有validated telemetry section;不新增summary field / adapter kind / port;未来独立health触发`03`重开 |
| SBX-CFG-ITEM-SECRET-001 | carrier watch | deferred_by_scope | S04 exact provider / resolver / rotation尚未定义 | 本Step只定义opaque refs和M lane;Step 8必须闭合material读取边界,不得把provider产品当上游事实 |
| SBX-DDD-HANDOFF-REPO-001 | downstream implementation precheck | open_for_07 | 目标实现仓尚未确认 | 不阻塞Step 7;不创建实现仓、ledger或boundary skeleton |
| SBX-DDD-RISK-CONTRACTS-001 | upstream implementation precheck | open_for_07 | `core-contracts` exact shared type尚未在目标仓复核 | 不阻塞Step 7;`07` precheck处理 |
| SBX-DOC-GAP-TEST-001 | downstream document gap | open | 正式`05`仍是旧材料 | 不阻塞当前Step;后续必须按I001~I101和negative rules重建 |
| SBX-DOC-GAP-ACCEPT-001 | downstream document gap | open | 正式`06`仍是旧材料 | 不阻塞当前Step;不得把本Step设计审计写成验收通过 |

当前未发现阻塞Step 7完成的上游blocker。S04不是blocker,因为P0不读取真实material;Step 8必须在进入敏感配置细化时处理。D37当前carrier足以表达startup-frozen safe telemetry配置;只有新增独立health / disposition contract时才转为`03` blocker。

### 9.11 对下游文档的影响总表

| 下游 | 从本 Step 接收 | 本 Step 不提供 |
|---|---|---|
| `04` Step 8 | 所有`sensitive` item、S04 M lane、P01~04禁真实material、P05/06 required opaque refs、raw secret item=0 | provider产品、material class解析、缓存/轮换/吊销/审计流程 |
| `04` Step 9 | I001~I101 schema、type/range、source allowlist、FC-01~06、三类handoff唯一启用源、conditional required和cross-field约束 | loader函数、error enum、canonicalization / validation顺序、builder handoff算法 |
| `04` Step 10 | startup / new-loop / new-job / selector / test slot生效边界和critical item集合 | 变更申请、审批、审计、rollback / drift流程 |
| `04` Step 11 | 每项fail-fast/fail-closed/degraded/reject/test-fail语义 | 完整failure mode / alert / recovery矩阵 |
| `05-测试方案.md` | strict JSON parse、unknown/duplicate/env allowlist、D01~D44、P01~P07、NCFG negative、fake/real parity和cross-field测试输入 | 真实测试结果、run_id、evidence alias或已通过声明 |
| `06-验收标准.md` | real-like无fake fallback、coherent boundary、audit mandatory、cleanup/redline/redaction veto候选 | 验收阈值、签署、evidence alias或风险接受 |
| `07-实施计划.md` | 40个functional module、I001~I101、`infra/config.rs` raw owner、builder / entry / adapter绑定边界 | phase/commit、implementation ledger、planned skeleton或实现仓事实 |
| 运维 / 部署文档 | P05/06需要的store/adapter/target/route/sink/secret/scheduler binding slots | 产品选型、endpoint/topic/credential、部署命令、SLO/dashboard/runbook |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| I001~I085把Step 14 typed binding展开为raw JSON schema | 否 | 未改变field carrier、port、DTO、flow、state或audit schema | 不适用 | no_writeback |
| 40个顶层功能模块替代泛化`runtime/stores`组织 | 否 | 只是raw schema组织;code binding仍指向既有config sections / adapters | 不适用 | no_writeback |
| D03/D04 strict validation / builder无绕过key | 否 | 承接`RuntimeConfigStatus`与existing builder chain | 不适用 | no_writeback |
| I014~I016 event组与依赖组合 | 否 | 只细化existing `SandboxFeatureConfig`三个bool、13类existing event和relay append条件;未新增event / port / state | 不适用 | no_writeback |
| I056/I048/I074作为三类handoff唯一启用源 | 否 | 只收口existing target refs和两个existing bool的组合;未新增enabled field、handoff type或flow | 不适用 | no_writeback |
| D37 I086~I090使用infra-private validated telemetry section | 否 | `infra/config.rs`可拥有adapter-specific validated config;没有新增public summary field或availability查询 | 不适用 | resolved_watch_no_writeback |
| D38 I091绑定truth-store same-UoW audit route | 否 | 直接承接existing audit repository / `SandboxAuditTrace`,无新adapter | 不适用 | no_writeback |
| D39 I092只允许local/formal marker surface | 否 | 未新增diagnostic port/store contract | 不适用 | no_writeback |
| S04只解析selected opaque ref | 否 | 本Step不定义provider port;P0不调用真实material | Step 8继续复核 | deferred_by_scope_no_writeback |
| D43无`realLikeEnabled`key,靠profile completeness校验 | 否 | 承接现有summary refs和builder dependency completeness | 不适用 | no_writeback |
| D44无reload/overlay key | 否 | 保持NCFG-24和`03`当前无snapshot/reload contract | 不适用 | no_writeback |

当前不存在`待回写`或`阻塞待确认`项。以下任一未来变化必须先停止配置文档推进并回写`03`:

- 新增telemetry / diagnostic `SandboxAdapterKind`、availability state、port、summary field或entry disposition。
- S04 material resolver需要跨application/domain暴露,或raw material进入config summary / DTO / report。
- 引入runtime reload、last-known-good、tenant/region overlay、remote config或admin override。
- 增加新的consumer / event kind / schema、store logical owner、handoff type、feature gate或security guard。
- 把四维boundary template拆成可独立放宽的resource/fs/network/process项。

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“配置项总表”“按配置域组织的配置项批次表”“模块级严格 JSON Demo”“完整 JSONC 文档示例”“配置域停审记录”和“跨配置项闭环审计表”,确认每个raw key如何回指控制面、profile和详细设计载体。

正式`04-配置设计.md` §7应回填:

1. 命名、类型、敏感级别、env allowlist和功能模块组织规则。
2. I001~I101配置项总表,可按11个控制面分组,不得压缩掉类型、默认、必填、来源、作用域、生效、敏感、失败和模块列。
3. D01~D44批次表,包括无独立raw key的D01/D03/D04/D43/D44。
4. §9.4 entry / worker / job local selector schema及禁止同义flag规则。
5. 40个模块严格JSON demo和每个demo后的逐项说明表。
6. 完整JSONC文档示例及runtime strict JSON警告。
7. 配置域停审、跨项审计和`03`影响判定。
8. FC-01~06 event feature组合和三类handoff唯一启用源,不得压缩为泛化的“依赖完整”。

回填不得:

- 将`local-contract`示例写成生产默认、真实执行资格、测试结果或验收结论。
- 为压缩篇幅改回`runtime`、`stores`、`common`、`misc`聚合模块。
- 删除condition / failure / sensitive / profile / `03` traceability列。
- 在Step 8结论形成前写secret provider、raw credential或material读取流程。
- 在Step 9结论形成前把本Step cross-field文字伪装成已实现validator代码。

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 7 | 后续处理 |
|---|---|---:|---|
| S04 secure material resolver exact provider / port / material class | open_for_step_8 | 否 | Step 8先重读安全要求和`03` carrier;若需要新port / summary field先回写`03` |
| P05/P06真实store/backend/bus/handoff/sink/secret/scheduler产品 | intentionally_unselected | 否 | ADR / `07` / deployment后续选择;本Step只固定opaque slots和no-fallback |
| production-like PROFILE-07 activation | inactive_design_target | 否 | 必须经Step 8~14、`05/06/07`和未来资格闭环,当前选择即reject |
| telemetry / diagnostic independent availability | future_reopen_trigger | 否 | 当前不需要;一旦影响runtime disposition先回写`03` |
| P0 deterministic default数值是否适合生产 | not_applicable | 否 | 这些值只支撑contract设计;生产sizing须由P1测试/运维证据决定 |
| 正式`05/06`旧内容冲突 | open_downstream | 否 | 后续文档full-restart时按当前`03/04`重建,不得沿用host runtime等旧结论 |

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 6 | 通过 | 本次用户确认只放行Step 7 |
| 101个item字段最小列齐全 | 通过 | §9.2逐项定义 |
| D01~D44全部停审 | 通过 | §9.3 / §9.7各域一次 |
| 40个功能模块严格JSON demo齐全 | 通过 | 40个strict JSON块解析通过;每模块紧邻说明表;合并对象与完整JSONC去注释对象一致 |
| 完整JSONC说明清楚 | 通过 | §9.6明确runtime不支持JSONC |
| 必填失败策略 / 敏感级别 / profile差异齐全 | 通过 | §9.2 / §9.8 |
| feature / handoff交叉启用条件唯一 | 通过 | §9.1.5定义FC-01~06及三类handoff唯一启用源;§9.2 / §9.5 / §9.7 / §9.8一致 |
| D37 / D38 / D39 carrier不虚构 | 通过 | infra-private telemetry、truth-UoW audit、local/formal diagnostic |
| 对`03`影响已判定 | 通过 | 当前无待回写 / blocker |
| Step 8未在本Step审查前提前创建 | 通过 | 正式`04`仍缺失;Step 8在用户确认本Step后才创建 |
| 未创建实现代码、ledger、planned skeleton或commit | 通过 | 本Step只改设计校准文档 |

```text
current_document = `04-配置设计.md`
current_step = Step 7 `定义配置项清单`
gate_status = passed_to_step_8
next_allowed_action = Step 8已按门禁创建并完成;当前等待用户审查`04_config_step_08_sensitive_secrets.md`
formal_document_write = not_started
commit_required = no
```

---

## 14. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 配置边界 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 `PH-05 -> PH-06`依赖复核 | P0 boundary profile registry原要求`policy non-fail-closed`并允许policy参与boundary requirement合成。 | profile改为只校验context / identity、explicit requirements、I040、capability和LD-24 generation;policy在后序消费requirement并可拒绝launch。 | I039 / I040 ID、key、type、默认ref和JSON均不变;未增加config item。 |
