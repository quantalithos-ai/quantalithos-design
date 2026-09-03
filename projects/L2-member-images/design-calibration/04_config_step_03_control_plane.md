# L2-member-images 04 配置设计 Step 3：建立配置控制面总览

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3  
> 回填位置：正式 `04-配置设计.md` 第 3 章“配置控制面总览”  
> 约束：本 Step 先建立控制面与配置域，后续 Step 才能列配置项；不由来源图推出真实 adapter、部署、运行或外部成功。

## 1. Step 状态、目标与输入

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 3：建立配置控制面总览 |
| 当前状态 | `completed` |
| 本步目标 | 确定配置来源链、唯一读取/装配边界、配置域、模块可见性与跨控制面审计。 |
| 直接输入 | Step 1/2、正式 `03` §13、`03_ddd_step_14_config_dependencies.md`、配置书写规范。 |
| 不做事项 | 不写 key/default/product、deployment command、real provider、event topic、scheduler 或 external success。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 当前系统配置从哪些来源读取？ | P0 候选来源只包括 code-level absence/default discipline、项目 JSON 配置文件、受控 environment selector 与 opaque secret/reference selector；具体优先级留 Step 5。remote config center、admin override、CLI public flags 和 raw secret material 不进入 P0。 |
| 配置进入系统的唯一或主要装配入口是什么？ | raw configuration 仅在 planned `infra/config.rs` 读取、parse、validate、redact；已验证的 body-free config ref、mode 与 slot declaration 仅由 planned `infra/runtime_builder.rs` 组合并注入已有 port implementation / facade。 |
| 哪些模块读取配置，哪些模块不得直接读取配置？ | 仅上述两个 infra 模块可读取/校验 raw configuration。其余 infra adapter 只收 builder 的私有 binding；contracts/domain/application/api/worker/jobs 不得读 raw config、secret、endpoint、provider body 或 product selection。 |
| 配置控制哪些行为，不控制哪些领域不变量？ | 只控制 local composition / profile / slot availability / TestOnly fake / private binding / redaction。不得控制 Role mapping、pins、static/live、staged truth、UoW、state、recovery、event activation、outbound 或 dependency category。 |
| 配置变化会影响哪些下游文档？ | 05 需要配置负向矩阵；06 需要安全和 no-readiness 门禁；07 需要 planned wiring / change boundary；09 需要部署与 secret 操作细节。当前下游均未生成相应新版正文。 |
| 每个配置控制面应拆成哪些配置域？ | 拆为 composition identity、mode/fake isolation、local store composition、static source/ref composition、conservative external boundary composition、redaction/diagnostics 六域；不使用泛化 `runtime` 或 `storage` 域。 |
| 每个配置域对应哪些详细设计 binding？ | 分别回指 `ImageRuntimeConfigRef`、`ImageFakeMode`、`LocalStore` slot、Mapping/Component/Seed slots、Build/Qualification/MemberService slots、local assembly/redaction signals。 |
| 停审与跨域审计是否可通过？ | 当前可通过控制面级审计：无重复 raw-reader、无隐式 compile、无 fake production fallback、无 outbound 域。具体来源优先级、item 与校验仍留后续 Step。 |

## 3. 配置来源链图

#### 配置来源链图：L2-member-images P0 配置装配链

```text
[code-level absence / no implicit success]
                 |
                 v
[project JSON configuration]
                 |
                 v
[environment profile / reference selectors]
                 |
                 v
[opaque secret or external-reference selectors]
                 |
                 v
[infra/config.rs]
  parse -> type validate -> redaction -> body-free config ref
                 |
                 v
[infra/runtime_builder.rs]
  mode -> slot declaration -> local availability -> port composition
                 |
                 v
[ImageRuntimeAssemblyState]
  Assembled | Blocked
                 |
                 v
[assembled facade / safe boundary disposition]
```

关键说明：

- 图表达 P0 配置来源与 local composition 的覆盖/装配顺序，不是部署命令、容器启动、worker 激活或 external call。
- `Assembled` 仅表示 local composition validation；它不表示 build、gate、Artifact、consumer、container、runtime 或 readiness。
- secret 仅允许以 opaque reference selector 进入；raw secret、endpoint、provider body 不得越过 `infra/config.rs`。
- remote config center、admin override、hot reload/LKG 是 P2 future trigger，不在此链中隐式存在。

## 4. 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 | 不控制的对象 |
|---|---|---|---|---|
| configuration intake | 读取、parse、redact，并形成 `ImageRuntimeConfigRef` / safe blocked reason | `infra/config.rs` | 是 | domain truth、raw config public carrier、外部 authority body |
| composition builder | 选择 explicit mode、校验 slot、装配已有 port implementation | `infra/runtime_builder.rs` | 是 | process/container/worker/job scheduler 启动、business mutation |
| local technical composition | 接入 local truth/history/projection/idempotency 的 private implementation | builder -> repositories / projection/idempotency adapters | 是 | store 产品、schema、UoW/recovery semantics |
| static reference composition | 将 mapping/component/seed/base body-free resolver 注入 port | builder -> `source_adapters.rs` | 是 | Role/mapping body、component compatibility、live state |
| conservative external boundary composition | 将 builder/registry、qualification/Artifact、Member Service 的 conservative port implementation 注入 | builder -> build/qualification/supply adapters | 是（non-positive only） | product、endpoint、digest/gate/Artifact/consumer success |
| fake isolation | 让 deterministic fake 只在 explicit TestOnly 中出现 | builder -> `fakes.rs` | 是 | Production fallback、evidence、readiness |
| diagnostics/redaction | 约束 config validation 的 safe reason / allowed signal | config/builder + observability boundary | 是 | observability backend、raw logs、alert/retention product |
| remote / online control | config center、admin override、hot reload/LKG | none currently | 否，P2 | 任何当前 P0 activation |

## 5. 配置域 / 功能模块总表

| 配置域 / 功能模块 | 来源控制面 | 对应详细设计模块 | 允许配置的能力 | 禁止控制的能力 |
|---|---|---|---|---|
| `composition_identity` | configuration intake | `infra/config.rs`; `ImageRuntimeConfigRef` | config authority/ref identity、blocked reason category | raw body、Role mapping、domain identity、owner truth |
| `composition_mode` | composition builder | `infra/runtime_builder.rs`; `ImageFakeMode`; assembly state | explicit Production/TestOnly、local assembly eligibility | automatic TestOnly、process/service lifecycle、write gate |
| `local_persistence` | composition builder | LocalStore slot; repositories/projection/idempotency adapters | private local implementation binding / availability | DB product/schema、history overwrite、UoW/version/recovery |
| `static_references` | composition builder | MappingSource/ComponentReference/SeedReference slot; resolver port | body-free ref resolver selection / safe availability | mapping/component/seed body、live memory/checkpoint/workspace |
| `external_boundaries` | composition builder | BuildAndRegistry / QualificationAndArtifact / MemberServiceSupply slot; conservative ports | blocked/unknown/non-positive adapter wiring | endpoint/credential/provider result/digest/gate/Artifact/manifest/confirmation |
| `diagnostic_redaction` | configuration intake | config/slot/local assembly signal boundary | safe diagnostic level/category and redaction floor | raw config/secret/endpoint/error body、observability backend |

## 6. 模块读取与注入责任矩阵

| 位置 | 可做 | 接收物 | 禁止事项 |
|---|---|---|---|
| `infra/config.rs` | 读取来源、parse、validate、redact、形成 body-free ref/blocked reason | raw configuration 仅私有存在 | 向其他模块传 raw config/secret/endpoint；写 domain truth |
| `infra/runtime_builder.rs` | 声明/校验 slot、显式 fake mode、构造 real/blocked/test fake port implementation、形成 assembly state | 已验证 ref、private binding、slot marker | 启动 process/container、绕过 blocker、把 Assembled 写成 readiness |
| 其他 infra adapter | 接收 builder 完成的私有 binding | port input、typed ref、safe marker | 重读 config、直传 provider body、升级 external result |
| contracts/domain/application | 使用 typed carrier、port、safe conclusion | 已装配 facade / port | env/config access、secret、endpoint、provider/product selection |
| api/worker/jobs | 接收 application facade 或 marker disposition | validated input / safe output | raw config、broker/scheduler activation、direct domain/repository access |

## 7. 配置域停审记录

| 配置域 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `composition_identity` | 唯一 raw-reader、body-free output、无隐式 Bound | 通过 | source priority/item 尚留 Step 5/7。 |
| `composition_mode` | Production/TestOnly 显式、Assembled 非 readiness | 通过 | profile matrix 尚留 Step 6。 |
| `local_persistence` | local-only、slot unavailable blocked、不可配置 UoW/recovery | 通过 | physical product/value 不在当前范围。 |
| `static_references` | ref-only、static/live 分离、owner pending 可见 | 通过 | `MI-UP-002/003/006/008` 保持 blocker。 |
| `external_boundaries` | non-positive only、无 Cargo 升格、无 external success | 通过 | `MI-UP-001/007`、`Q-MI-003/004` 保持 blocker。 |
| `diagnostic_redaction` | raw fields 禁止、safe reason only | 通过 | backend/retention/alert 留 owner/09。 |

## 8. 跨控制面审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| raw config reader 是否唯一 | 通过 | 仅 `infra/config.rs` / runtime builder private composition。 |
| configuration 是否误入 contracts/domain/application/entry | 未发现 | §6 保持禁止。 |
| generic domain 是否混写 | 未发现 | 六个功能域清晰拆分。 |
| slot/adapter 是否暗示 Cargo dependency | 未发现 | active sibling Cargo dependency 仍为零。 |
| fake 是否可进入 Production | 不允许 | Step 4/6/9 将继续验证。 |
| external bound 是否被视为 external success | 不允许 | local availability 与 business result 分层。 |
| outbound 或 inbound activation 域是否被加入 | 未加入 | `NoneAuthorized` / marker-only 保持。 |
| 03 contract 影响是否遗漏 | 未发现当前影响 | P1/P2 trigger 继续在 Step 14 汇总。 |

## 9. 当前材料诊断与取舍

| 议题 | 风险 | 取舍 |
|---|---|---|
| 使用一个 `runtime` 配置域 | 容易混合 fake、store、external adapter 和 lifecycle。 | 拒绝；按功能域拆分。 |
| 让 application 持有 profile | 使 composition 控制面进入业务/协议。 | 拒绝；profile 仅在 infra 私有处理。 |
| 将 remote config 列为 P0 来源 | 会产生未定义 reload/rollback/authority。 | 拒绝；P2 future trigger。 |
| 把 old README CI 或 product 作为控制面 | 形成 historical pollution。 | 拒绝；只用 current 03 binding。 |
| 把 disabled/blocked adapter 拆出控制面 | 会使 blocked composition 无法表达。 | 不拆出；保留 conservative slot/marker，但不赋予 external success。 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 唯一 raw-read / builder 责任与六配置域承接现有 03 §13 | 否 | 既有 binding 的控制面组织 | 不适用 | 无回写 |
| P0 来源链不含 remote/config center/hot reload | 否 | 当前 unsupported 边界 | 不适用 | 无回写 |
| 仅既有 slot/port 注入、blocked/fake semantics | 否 | 契约保持 | 不适用 | 无回写 |
| future 引入 online config、new adapter constructor、provider health 或 public profile DTO | 是（future trigger） | runtime builder/port/error/flow change | 触发时回写 03 §5/§13 与 calibration Step | 无回写（当前未触发） |

## 11. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读：
> - 建议继续阅读“配置来源链图”“配置控制面总表”“配置域 / 功能模块总表”“配置域停审记录”和“跨控制面审计表”。

正式 `04-配置设计.md` §3 应说明：P0 配置沿 JSON / environment selector / opaque ref 进入 `infra/config.rs`，经 private validation 与 redaction 后由 `infra/runtime_builder.rs` 装配已有 slot/port；六个功能域分别处理 composition identity、mode、local persistence、static references、external boundaries、diagnostic redaction。任何 composition 结论只说明 local state，绝不启动 runtime/container 或提升 external staged truth。

## 12. 待确认事项与进入下一步条件

| 事项 | 当前处理 |
|---|---|
| 每个域的可配置类别、热/冷边界与禁止项 | 留 Step 4。 |
| 来源优先级、真实 config file / env 形态与 conflict | 留 Step 5。 |
| 环境/profile 及 JSON item | 留 Step 6/7。 |
| real adapter / product / secret / external contract | 保持 P1/P2 blocker；不因本 Step 关闭。 |

| 自检项 | 结论 |
|---|---|
| 已先有控制面，再有配置项 | 通过。 |
| 有来源链图且不表达部署/运行事实 | 通过。 |
| 每个域均回指 03 binding 或明确不适用 | 通过。 |
| 跨控制面无 unresolved 冲突 | 通过，owner/product pending 保持显式。 |
| 可进入 Step 4 | 通过；配置控制面与六个功能域已停审。 |

```text
step_03 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_04_categories_boundaries
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
