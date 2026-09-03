# L2-member-images 04 配置设计 Step 8：敏感配置与密钥管理

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`；待用户审查  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8  
> 回填位置：正式 `04-配置设计.md` 第 8 章“敏感配置与密钥管理”  
> 前置输入：`04_config_step_07_config_items.md` 已完成；本 Step 不创建正式 04。

## 1. Step 状态、目标与执行纪律

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 8：定义敏感配置与密钥管理 |
| 当前状态 | `completed`；敏感配置识别、存储/读取/轮换/审计、禁止输出和跨项泄露审计已完成，待用户审查 |
| 本步目标 | 将 Step 7 的 21 个 P0 配置项归一为 `internal`、`sensitive`、`secret` 三类处理语义，明确 opaque selector 与真实秘密材料的边界。 |
| 本步边界 | 只定义配置控制面的安全语义；不指定 secret provider、KMS、Vault、云产品、endpoint、DSN、credential、证书正文或部署挂载。 |
| 执行顺序 | 敏感级别归一 → 配置项识别 → 读取图 → 逐项存储/轮换/审计 → profile 处理 → 禁止输出 → 泄露审计 → 03 影响判定 |
| 停审方式 | 完成本 Step 后暂停；未经用户再次确认不得创建 Step 9 文件。 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| 敏感级别与字段识别 | done | done | done | done | done | pass | pass | 进入读取与存储边界 |
| 读取、轮换与审计 | done | done | done | done | done | pass | pass | 进入 profile 处理 |
| 禁止输出与失败策略 | done | done | done | done | done | pass | pass | 进行泄露审计 |
| 跨敏感配置审计 | done | done | done | done | done | pass | pass | 进行 03 影响判定 |
| 03 影响与回填门禁 | done | done | done | done | done | pass | pass_with_explicit_blockers | 停审并等待 Step 9 确认 |

## 2. 本步输入与 SOP 问题回答

### 2.1 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | completed | 承接 `safe absence < project JSON < allowlisted environment selector`、非法高优先级拒绝和 raw secret 不进入普通来源链。 |
| `04_config_step_06_profiles_matrix.md` | completed | 承接五个 profile 的 fake、controlled、future production selector 和不可用策略。 |
| `04_config_step_07_config_items.md` | completed | 提供 21 个 P0 key、类型、默认、来源、作用域、敏感级别和失败策略；Step 7 非正式标签已在本 Step 归一。 |
| `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | current formal | 提供 static/live、owner、数据和安全边界；不在本 Step 重答需求或架构。 |
| `03-详细设计.md` §13~§16 | current formal | 提供唯一 config reader、runtime builder、slot、fake、observability 和 forbidden body 边界。 |
| `03_ddd_step_14_config_dependencies.md`、`03_ddd_step_15_observability_audit.md` | completed calibration | 提供配置接缝、依赖分类、marker-only、redaction 和 no-outbound 约束。 |
| `L1-governance` `04_config_step_08_sensitive_secrets.md` | 粒度参考 | 借鉴逐项表、profile 表、读取图、禁止输出和泄露审计结构；不继承其 outbox、publisher、GRC、产品或成功合同。 |

### 2.2 SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 哪些配置是 `sensitive` 或 `secret`？ | Step 7 中除 `composition.profile`、`composition.mode` 外的 19 个 opaque ref / ref 集合均为 `sensitive`；profile 与 mode 是 `internal`。真实 password、private key、raw token、certificate body、raw DSN、endpoint credential、provider body 等是 `secret`，但不属于 P0 配置项，禁止进入普通配置。 |
| 敏感配置如何存储，是否允许明文？ | 普通 JSON 和 allowlisted environment 只能保存 opaque selector；不能保存 secret、endpoint、DSN、credential 或 provider response body。`null` 只表示 safe absence。当前不定义 raw-secret reader 或具体 secret provider。 |
| 敏感配置如何轮换？ | 所有 P0 配置是 startup-only；更换 selector 通过新 ref、重新校验和 restart 生效。没有 hot reload、在线替换、LKG 或 fake fallback。未来 provider-side 原地轮换若要暴露给本仓，必须重开 03/04。 |
| 读取和变更是否需要审计？ | 需要记录安全的 slot、profile、配置域、校验结论、issue ref 和旧/新 redacted digest；不得记录 full selector 或 raw material。具体 actor、change request 和运维流程由治理/运维 owner 提供，本仓不私造 admin API。 |
| 日志、错误返回、审计中如何避免泄露？ | 只输出低基数 profile、slot、safe error code、redacted digest 或 issue ref；禁止 full sensitive ref、secret、endpoint、route、credential、组件/seed/mapping body、Artifact/consumer body 和外部响应正文。 |
| 每个敏感配置是否回指 Step 7、来源规则、加载与变更机制？ | 是。§8.4 逐项回指 Step 7 key；普通来源承接 Step 5；加载由 Step 9 承接，变更审计由 Step 10 承接。本 Step 不提前定义 Step 9 loader 或 Step 10 approval contract。 |
| 每个敏感配置完成后是否通过停审？ | 通过。composition、local_persistence、static_references、external_boundaries、diagnostics 五个域均完成存储、明文、轮换、审计和输出检查；未闭合 owner contract 仍按 blocked/gap 保留。 |
| 是否存在 raw secret 入文档、普通配置误归类、日志泄露或轮换审计缺口？ | 当前未发现。文档只使用类别名和符号化 opaque ref；真实 provider、权限、轮换 runbook、hot reload 和 public credential schema 作为 future trigger/pending，不被写成当前能力。 |

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 材料 / 风险 | 诊断 | 本 Step 处置 |
|---|---|---|
| Step 4 的 `sensitive-reference` 标签 | 这是配置分类标签，不是规范最终敏感级别；若直接回填会与书写规范不一致。 | 统一映射为 `sensitive`；真实秘密材料另列 `secret`，不加入 P0 schema。 |
| Step 7 的 opaque refs | 已阻止 endpoint/body，但尚未逐项说明存储、轮换、审计和输出。 | 对 19 个 sensitive item 建立逐项表，并保留 owner/kind/mutable 校验。 |
| Step 5 的普通来源 | 只规定 selector 优先级，容易被实现误解为 env 可以携带 raw credential。 | 明确 JSON/env 只能选择 opaque identity；raw material 直接拒绝且不回退。 |
| Step 6 的 profile | local/CI fake、integration controlled seam、future production selector 尚未统一安全输出规则。 | 增加 profile 敏感处理和不可用策略；不新增 operations-replay 或 live-state profile。 |
| `03` 可观测性与 forbidden body | 已有安全红线，但没有逐项映射到 config ref。 | 增加 log/error/audit/trace/metric/worker-marker/generated-artifact 禁止输出矩阵。 |
| secret provider / rotation | 上游和 sibling 尚未闭合具体产品或 API。 | 只保留 adapter-local future boundary；不虚构 provider、权限、成功读取或 readiness。 |

### 3.2 改动前后对比

| 项 | 改动前 / 风险 | 改动后 | 原因 |
|---|---|---|---|
| 敏感级别 | `sensitive-reference` 等工程标签可能直接进入正式文档。 | 统一使用 `internal` / `sensitive` / `secret`；Step 7 的 opaque ref 全部可追溯。 | 对齐配置设计书写规范，避免把 selector 当 raw secret。 |
| 存储形态 | 只写“禁止 raw secret”，未区分普通来源与未来 provider。 | JSON/env 只允许 opaque selector；secret material 不入普通配置、文档、日志或结果。 | 防止把 credential 当普通字符串配置。 |
| 轮换 | 未明确是否热更新，可能引入在线替换。 | P0 统一新 ref + restart；job/entry 不承载敏感覆盖；hot reload 留 future trigger。 | 与 Step 4/7 的 cold/startup 不变量一致。 |
| 审计字段 | 可能记录完整 selector 便于排障。 | 只记录 slot、类别、issue ref、old/new redacted digest 和安全上下文。 | 减少拓扑、目标和 credential identity 泄露。 |
| profile 处理 | fake、controlled 和 production-like 方向边界分散。 | 五个 profile 都明确允许表示、禁止项和不可用策略。 | 让 Step 9/10 和后续 05/06 可直接承接。 |
| 03 影响 | 可能误把 secret provider 变成新 port/constructor。 | 当前无回写；未来 provider、hot reload、admin override 或 public credential schema 才触发 03 重开。 | 配置设计不静默新增代码契约。 |

### 3.3 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否在 P0 选定 secret provider | 直接选定产品/API；或只保留 opaque provider/adapter boundary | 采用后者。当前 `03` 没有 secret-provider port，产品选择留 owner/运维设计。 |
| env 是否可保存 token/password | 允许 raw value 方便部署；或只允许 opaque selector | 采用只允许 selector；非法 raw value 不转译、不回退。 |
| 是否把完整 ref 写入诊断 | 完整 ref 便于定位；或 redacted digest/issue ref | 采用 redacted digest/issue ref；完整 selector 可能暴露拓扑、目标或权限身份。 |
| sensitive 与 secret 是否混为一类 | 所有 ref/材料都称 secret；或区分 selector 与真实材料 | 区分：opaque ref 是 `sensitive`，真实秘密材料是 `secret`，后者不在 P0 schema。 |
| 轮换是否 hot 生效 | 运行中重载；或 restart | 采用 restart；没有 reload contract、LKG、在线 admin override。 |
| redaction policy 是否可被配置放宽 | 提供 debug/raw 开关；或固定 floor 只可加强 | 采用固定 floor；`diagnostics.redaction_policy_ref` 只能更严格，不能减少禁止字段。 |

## 4. 结构化中间产物

### 4.1 敏感级别归一规则

| 规范级别 | 本项目含义 | Step 7 / Step 4 映射 | 处理要求 |
|---|---|---|---|
| `public` | 可公开且无安全含义的配置值 | 当前 P0 没有需要作为 public 的 ref；不因缺少 public 项而扩展 schema | 若未来出现，仍需经过 Step 7 清单和输出审计。 |
| `internal` | 内部运行语境或安全控制语义，不是秘密材料 | `composition.profile`、`composition.mode`；redaction policy 的语义部分另具 safety-critical 属性 | 可进入内部配置；日志只允许低基数名称；不得借此开启 debug/raw 输出。 |
| `sensitive` | 暴露会产生安全、运营、拓扑、权限或审计风险的 opaque identity | `composition.config_ref`、全部 `local_persistence.*`、`static_references.*`、`external_boundaries.*`、`diagnostics.redaction_policy_ref` | 普通来源只能保存 opaque selector；禁止进入日志/错误/trace/metric 明文；变更必须审计。 |
| `secret` | 真实秘密材料或可直接取得秘密的正文 | raw password、raw token、private key、certificate body、raw DSN、endpoint credential、provider response body | 不得写入普通 JSON/env、文档、日志、错误、审计、trace、worker marker 或生成物；只可由未来 approved secret boundary 在 adapter 内部承载。 |

> `sensitive` 是本项目 P0 的可配置表示，`secret` 是明确禁止进入 P0 配置的材料类别。任何示例中的
> `opaque-ref:...` 都只是符号化 selector，不代表真实资源、endpoint、credential 或已存在的发布结果。

### 4.2 敏感配置读取图

#### 敏感配置读取图：L2-member-images opaque selector 到 local slot

```text
[safe absence / project JSON / allowlisted env selector]
                         |
                         v
             [infra::config.rs strict parse]
                         |
          [owner/kind/mutable/body-free validation]
                         |
       [validated selector + safe issue/digest only]
                         |
                         v
              [infra::runtime_builder.rs]
                         |
       +-----------------+------------------+
       |                                    |
       v                                    v
[local store slots]             [static/external adapter slots]
       |                                    |
       +-----------------+------------------+
                         v
                [application-owned ports]

[future approved secret provider]
          -> [adapter-local resolution only]
          -> [never enters domain/contracts/local truth/diagnostics]
```

关键说明：

1. `infra::config.rs` 是唯一 raw configuration reader；`runtime_builder.rs` 只消费已验证 binding，不能自行读取文件、环境或 secret provider。
2. 当前 P0 只接受 opaque selector；不存在 raw-secret resolution、provider health、缓存、LKG 或生产 fake fallback。
3. `application`、`domain`、`contracts` 和 local truth 不持有 raw secret、endpoint、credential 或外部响应 body。
4. 若未来 provider 需要由 adapter 解析真实材料，必须先补齐 owner、权限、rotation、error 和 audit 合同，并重开受影响的 03/04 Step；当前不形成 positive readiness。

### 4.3 敏感配置索引

| 配置项族 | Step 7 key | 敏感级别 | 是否属于 P0 sensitive 表 | 不可进入配置的材料 |
|---|---|---|---|---|
| composition binding | `composition.config_ref` | `sensitive` | 是 | config body、endpoint、credential |
| local truth | `local_persistence.truth_store_ref` | `sensitive` | 是 | DSN、schema body、credential |
| local projection | `local_persistence.projection_store_ref` | `sensitive` | 是 | DSN、schema body、query payload |
| local idempotency | `local_persistence.idempotency_store_ref` | `sensitive` | 是 | DSN、lease/TTL policy、credential |
| Role mapping | `static_references.mapping_ref` | `sensitive` | 是 | RoleDefinition、mapping body、snapshot body |
| Runtime/Tools component pins | `static_references.runtime_component_ref`、`static_references.tools_component_ref` | `sensitive` | 是 | component manifest/body、`latest` alias、credential |
| Member/Supervisor/role-extra component pins | `static_references.member_component_ref`、`static_references.supervisor_component_ref`、`static_references.role_extra_component_refs` | `sensitive` | 是 | release body、member truth、role body、runtime args |
| policy/memory/workspace/role-extra seeds | `static_references.policy_seed_ref`、`static_references.memory_seed_ref`、`static_references.workspace_seed_ref`、`static_references.role_extra_seed_refs` | `sensitive` | 是 | template body、live memory/checkpoint/workspace、mount/path |
| Base image binding | `static_references.base_ref` | `sensitive` | 是 | base image body、sandbox policy/backend、credential |
| Build/registry seam | `external_boundaries.build_registry_ref` | `sensitive` | 是 | endpoint、registry credential、candidate/digest/release body |
| Qualification/Artifact seam | `external_boundaries.qualification_artifact_ref` | `sensitive` | 是 | gate/evidence/BOM body、Artifact payload/acceptance |
| Member Service supply seam | `external_boundaries.member_service_supply_ref` | `sensitive` | 是 | manifest、consumer credential、confirmation/launch/health body |
| Diagnostics redaction selector | `diagnostics.redaction_policy_ref` | `sensitive`（并具 internal safety-critical 语义） | 是 | raw config dump、debug/raw bypass、matched secret value |

`composition.profile` 和 `composition.mode` 仍是 `internal`，不把它们伪装成 secret；但它们的组合校验
（尤其 Production 与 `FakeOnly` 冲突）属于不可放宽的安全门禁。

### 4.4 敏感配置逐项表

下表逐项回指 Step 7 的 19 个 `sensitive` 配置项。`null` 仍是 safe absence，不代表 selector 成功，
也不触发 provider、builder、Artifact 或 consumer 结果。

| 配置项 | 存储方式 | 是否可明文 | 轮换方式 | 读取/变更审计要求 |
|---|---|---|---|---|
| `composition.config_ref` | project JSON 或 allowlisted env 中保存 body-free composition selector | 不可保存 config body、endpoint 或 credential | 新 selector + 完整校验 + restart；不得在线替换 | 记录 composition slot、profile、old/new redacted digest、validation issue ref；不记录完整 ref |
| `local_persistence.truth_store_ref` | 仅 opaque local truth/history binding ref | 不可保存 DSN、schema、credential | 新 store ref + restart；失败即 required slot `Blocked` | 记录 truth slot、redacted digest、校验结论；不记录连接正文 |
| `local_persistence.projection_store_ref` | 仅 opaque projection binding ref | 不可保存 DSN、query/body 或 credential | 新 store ref + restart；不得 query-time repair | 记录 projection slot、redacted digest、校验结论；不记录 projection body |
| `local_persistence.idempotency_store_ref` | 仅 opaque idempotency binding ref | 不可保存 DSN、lease、TTL 或 credential | 新 store ref + restart；不得由轮换引入新幂等策略 | 记录 idempotency slot、redacted digest、校验结论；不记录 raw key/store body |
| `static_references.mapping_ref` | 仅 opaque MethodLibrary mapping selector | 不可保存 RoleDefinition、mapping 或 snapshot body | 新 mapping selector + restart；owner/kind 不符则 blocked/unknown | 记录 mapping slot、owner/kind validation、redacted digest；不记录 mapping 内容 |
| `static_references.runtime_component_ref` | 仅 opaque Runtime component release selector | 不可保存 manifest、credential 或 `latest` alias | 新 immutable pin selector + restart；不形成 release readiness | 记录 Runtime slot、redacted digest、校验结论；不记录 release body |
| `static_references.tools_component_ref` | 仅 opaque Tools component release selector | 不可保存 tool manifest、endpoint 或 credential | 新 immutable pin selector + restart；不打开 tool execution | 记录 Tools slot、redacted digest、校验结论；不记录 provider body |
| `static_references.member_component_ref` | 仅 opaque Member component selector | 不可保存 member body、release credential 或 compatibility body | 新 selector + restart；`MI-UP-002` 未闭合仍 blocked/gap | 记录 Member slot、pending issue ref、redacted digest；不记录 member truth |
| `static_references.supervisor_component_ref` | 仅 opaque Supervisor component selector | 不可保存 supervisor schema、credential 或 body | 新 selector + restart；owner contract 未闭合仍 blocked/gap | 记录 Supervisor slot、owner/kind 结论、redacted digest；不记录 schema |
| `static_references.role_extra_component_refs` | 有序 opaque selector 集合，按 canonical identity 去重 | 不可保存 role 名称、component body 或运行时参数 | 集合整体替换 + restart；重复/数量不符即 blocked/gap | 记录 RoleExtra slot、集合 redacted digest、数量校验；不记录元素全文 |
| `static_references.policy_seed_ref` | 仅 opaque policy template selector | 不可保存 policy body、治理决策或 credential | 新 seed selector + restart；缺失/unknown 为 seed gap | 记录 Policy layer、redacted digest、校验结论；不记录 policy body |
| `static_references.memory_seed_ref` | 仅 opaque memory template selector | 不可保存 live memory、checkpoint、replay body | 新 seed selector + restart；不改变 live state | 记录 Memory layer、redacted digest、校验结论；不记录 memory body |
| `static_references.workspace_seed_ref` | 仅 opaque workspace template selector | 不可保存 path、mount、volume 或 workspace body | 新 seed selector + restart；不挂载 live workspace | 记录 Workspace layer、redacted digest、校验结论；不记录 path/body |
| `static_references.role_extra_seed_refs` | 有序 opaque seed selector 集合，按 canonical identity 去重 | 不可保存 role-extra template/body 或注入参数 | 集合整体替换 + restart；owner/kind/数量不符为 blocked/gap | 记录 RoleExtra seed layer、集合 redacted digest、校验结论；不记录模板全文 |
| `static_references.base_ref` | 仅 opaque immutable BaseImage selector | 不可保存 image body、sandbox policy/backend 或 credential | 新 base selector + restart；`MI-UP-008` 未闭合保持 blocked/gap | 记录 BaseImage slot、pending issue ref、redacted digest；不记录 base body |
| `external_boundaries.build_registry_ref` | 仅 opaque Builder/Registry seam selector | 不可保存 endpoint、registry credential、candidate 或 digest body | 新 boundary selector + restart；unresolved 为 blocked/unknown | 记录 seam slot、owner/kind、redacted digest、safe availability marker；不记录 provider response |
| `external_boundaries.qualification_artifact_ref` | 仅 opaque Qualification/Artifact boundary selector | 不可保存 gate/evidence/BOM/signature body 或 Artifact payload | 新 boundary selector + restart；`Q-MI-004`/`MI-UP-007` 未闭合为 blocked/gap | 记录 qualification slot、issue ref、redacted digest；不记录 gate/Artifact body |
| `external_boundaries.member_service_supply_ref` | 仅 opaque Member Service consumer-contract selector | 不可保存 manifest、consumer credential、confirmation 或 launch/health body | 新 boundary selector + restart；`MI-UP-001` 未闭合为 consumer gap/unavailable/reopen | 记录 supply slot、issue ref、redacted digest；不记录 consumer contract 正文 |
| `diagnostics.redaction_policy_ref` | 仅 opaque restrictive policy selector；缺省使用固定 floor | 不可保存 raw config、matched value 或 debug bypass | 新的更严格 selector + restart；weaker/unknown 直接 reject | 记录 policy category、floor validation、redacted digest；不得记录被脱敏的原值 |

### 4.5 Profile 敏感配置处理表

| Profile | 允许的敏感表示 | 禁止项 | 不可用策略 |
|---|---|---|---|
| `local-dev` | safe absence、in-memory/local implementation 的 opaque ref；可用符号化 local selector；TestOnly fake 不属于此 profile | raw secret、真实 endpoint/credential、组件/seed/mapping/body、隐式 fake | required selector 缺失或格式非法即 local composition `Blocked`；不得用 cache、LKG 或 fake 伪造 production lane。 |
| `ci-test` | deterministic fixture ref、isolated store/adapter ref，并且由 harness 显式选择 `test_only` | production secret、真实 credential、raw fixture body、隐式 fake | fixture/ref 缺失或不符合 TestOnly 约束即 fail-fast；测试通过不代表真实 builder、Artifact 或 consumer 成功。 |
| `integration-like` | controlled/real-like adapter、store、target 的 opaque selector | raw credential、endpoint/body、sibling response、selected controlled seam 后的 fake fallback | selector 不可用进入 `Blocked`/`Unknown`/`Gap` 或安全失败 marker；不生成 candidate、digest、gate、Artifact 或 confirmation。 |
| `staging-like` | owner 批准后才可使用 future secret-provider、durable store 和 boundary selector 的 opaque ref | JSON/env 中的 raw secret、TestOnly fixture、debug override、provider response body | provider/owner contract 不可用则 fail-fast 或受影响操作 rejected；当前仅 pending 方向。 |
| `production-like` | 仅 future approved secret/reference selector；必须显式 `production` mode | fake、fixture、replay、raw secret、raw endpoint/body、隐式降级 | 任一 required selector/provider 不可用即 `Blocked`/fail-fast；不得 fallback 到 TestOnly 或宣称 ready。 |

本项目没有 `operations-replay` 或 live-state profile。重放、checkpoint、workspace、memory 和 container
生命周期不属于镜像配置控制面；任何未来引入都必须先通过上游 owner 与 03/04 重开。

### 4.6 读取、轮换与审计承接表

| 敏感配置族 | Step 7 回指 | Step 5 来源规则 | 读取边界 | 轮换与失效 | Step 10 审计承接 |
|---|---|---|---|---|---|
| `composition.config_ref` | `composition.config_ref` | `safe absence < JSON < allowlisted env`；仅 selector | `infra/config.rs` 校验 body-free identity；builder 只消费 validated ref | 新 ref + restart；非法或不可用直接 `Blocked`，不回退 | 记录 section、profile、old/new redacted digest、validation issue ref |
| local store refs | `local_persistence.truth_store_ref`、`projection_store_ref`、`idempotency_store_ref` | JSON/env selector；TestOnly fixture 仅 CI harness | 只注入既有 LocalStore slots；不读取 DSN/body | 新 binding + restart；不引入 lease、TTL、retry 或 LKG | 记录 slot、redacted digest、校验结论；不记录连接正文 |
| static mapping/component refs | `static_references.mapping_ref`、`*_component_ref` | JSON/env opaque ref；fixture 仅 TestOnly | owner/kind/mutable/pin 检查后注入 resolver/slot | 新 selector + restart；不允许 `latest`、body 或 release readiness | 记录 slot/kind、pending issue、redacted digest |
| static seed/base refs | `*_seed_ref`、`base_ref` | JSON/env opaque ref；scope required 时缺失 blocked | 只绑定 static template/base identity；不进入 live state 或 sandbox backend | 新 selector + restart；owner 未闭合保持 gap | 记录 layer/base slot、redacted digest、validation result |
| external boundary refs | `build_registry_ref`、`qualification_artifact_ref`、`member_service_supply_ref` | JSON/env typed selector；无 online override | 只装配 conservative adapter slot；不调用未定义 provider body | 新 selector + restart；unknown/unavailable 为 blocked/unknown/gap | 记录 seam slot、safe marker、issue ref、redacted digest |
| redaction selector | `diagnostics.redaction_policy_ref` | fixed floor；JSON 仅可加强，不接受 env 降级 | 校验 restrictive policy identity；不得输出被匹配的原值 | 新的更严格 selector + restart；weaker/unknown reject | 记录 floor validation、policy category、redacted digest |
| future raw secret material | Step 7 无对应 P0 key | 不进入 ordinary source priority chain | 若未来存在，只能由 approved adapter-local boundary 读取 | provider-side rotation 后需按 owner 重新校验/restart；无本仓 LKG | 只记录 provider/ref digest 与安全 issue ref，不记录 material |

### 4.7 禁止输出规则

| 输出面 | 允许输出 | 禁止输出 |
|---|---|---|
| structured log | operation、profile、adapter/store slot、safe error code、validation issue ref、redacted digest | full sensitive ref、secret、endpoint、route、credential、组件/seed/mapping body、外部响应正文 |
| error / marker | public/internal code、`Blocked`/`Unknown`/`Gap`/`Unavailable`/`ReopenRequired` marker、safe issue ref | raw secret、完整 selector、DSN、provider body、manifest、Artifact/consumer body |
| audit record | 配置域、slot、actor/change ref（若 owner 提供）、old/new redacted digest、reason ref、校验结果、生效方式 | raw config、full ref、credential、secret、外部正文、live state |
| trace / span | operation ref、slot、profile、low-cardinality outcome、safe diagnostic ref | secret、endpoint、route、package/manifest/payload body、高基数原文 |
| metric labels | profile、slot、error class、blocked/gap outcome 等低基数值 | full ref、endpoint、route、actor free text、secret 或外部 body digest |
| worker / job marker | action identity、safe disposition、issue ref、counts | event payload、receipt body、config secret、provider response、consumer confirmation |
| calibration/test/generated artifact | schema/key 名称、redacted digest、safe evidence alias（若未来 owner 定义） | raw config file、raw secret、fixture body、external response、credential、live state |
| outbound surface | 当前 `ImageOutboundEventInventory::NoneAuthorized`，无配置 ref 输出 | 不得因 sensitive 配置生成 outbound event、outbox、发布 receipt 或 topic body |

### 4.8 错误模式与处理表

| 场景 | 正式处理 | 不允许的处理 |
|---|---|---|
| project JSON 或 env 出现 raw password/token/private key/cert/DSN | strict validation reject；记录 redacted issue ref；不形成 effective config | 当普通字符串保存、转换为 selector、写入诊断或继续启动 |
| 高优先级 env selector malformed/empty/unknown | 拒绝整份 effective config；不得回退 JSON 或 safe absence | 静默忽略 env、使用旧值或 LKG |
| selector owner/kind/mutable 校验失败 | 受影响 slot `Blocked`/`Unknown`/`Gap`；不调用 provider/body | 猜测 owner、接受 `latest`、复制外部 body |
| required local store selector 缺失 | local composition `Blocked`；不改变 UoW/recovery | `enabled=false`、缓存、fake 或 query-time repair 绕过 |
| Production profile 选择 `FakeOnly` 或 TestOnly fixture | profile validation reject；assembly `Blocked` | 自动切到 production、报告 fake success 或生成 readiness |
| future secret provider 不可用 | 按 profile fail-fast、受影响操作 rejected 或安全失败 marker | 在 production-like fallback 到 fake、LKG 或 raw file |
| redaction selector weaker/unknown 或试图清空禁止字段 | reject，继续使用固定 floor 的安全诊断 | 放宽到 debug/raw、输出匹配原值 |
| selector 轮换时新值与 profile/scope 冲突 | reject new composition；旧运行态不被在线改写 | 半应用、静默回滚到低优先级值或覆盖 domain truth |
| adapter 返回 raw external error body | 转成 safe error code/issue ref；不持久化正文 | 将 provider 错误正文写入日志、结果、trace 或 audit |

### 4.9 敏感配置停审记录

| 配置域 / 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `composition.config_ref` | opaque 存储、profile/mode 组合、轮换、输出 | 通过 | 不新增 config body 或 provider API；缺失保持 `Blocked`。 |
| `local_persistence.*` | DSN/credential 排除、slot 注入、rotation、UoW 不变量 | 通过 | 物理 store 产品和 schema deferred；不配置 lease/TTL/retry。 |
| `static_references.mapping_ref` | mapping body、RoleDefinition、owner/kind 和 mutable 检查 | 通过 | `MI-UP-003` 仍 pending；unknown 为 blocked/unknown。 |
| `static_references.*_component_ref` | release/manifest、`latest`、member/supervisor owner 和日志泄露 | 通过 | `MI-UP-002` 及 supervisor contract 未闭合；不产生 release readiness。 |
| `static_references.*_seed_ref` | template 与 live memory/checkpoint/workspace 分离 | 通过 | `MI-UP-006` 仍 pending；只保留 body-free seed ref/gap。 |
| `static_references.base_ref` | base body、sandbox policy/backend、`MI-UP-008` 处理 | 通过 | hardened base 未闭合；保持 blocked/gap。 |
| `external_boundaries.build_registry_ref` | endpoint/credential/provider body、digest/candidate 禁止 | 通过 | `Q-MI-003` 未闭合；仅 conservative slot。 |
| `external_boundaries.qualification_artifact_ref` | gate/evidence/BOM/Artifact body、接受结果禁止 | 通过 | `Q-MI-004`、`MI-UP-007` 未闭合；不返回 Passed/Accepted。 |
| `external_boundaries.member_service_supply_ref` | manifest、confirmation、launch/health 和 consumer credential 禁止 | 通过 | `MI-UP-001` 未闭合；仅 `ConsumerHandoffGap`/unavailable/reopen。 |
| `diagnostics.redaction_policy_ref` | fixed floor、weaker selector、raw output 旁路 | 通过 | 只允许加强 floor；不配置 observability backend。 |
| 所有 sensitive ref | 读取、轮换、变更审计和输出是否闭合 | 通过 | P0 统一 restart；具体 provider/运维 runbook 留后续 owner。 |
| `secret` 材料类别 | 是否误入普通配置、文档、测试或产物 | 通过 | 当前无 raw material；future provider 只作边界，不是已实现能力。 |

### 4.10 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 19 个 Step 7 sensitive key 是否全部映射到存储/轮换/审计表 | 通过 | §4.3~§4.4 逐项覆盖；profile/mode 另按 internal 处理。 |
| 文档和 JSON 示例是否包含实际 secret | 未发现 | 仅使用 `opaque-ref:...` 符号化示例；不写真实值。 |
| 普通 JSON 是否可能保存 raw secret/endpoint/body | 不允许 | strict validation reject；不转译、不回退。 |
| allowlisted env 是否可能覆盖为 raw credential | 不允许 | env 仅允许 selector；高优先级非法值拒绝整份 effective config。 |
| `null` 是否被误解为 provider 成功或 LKG | 不允许 | 只表示 safe absence；required slot 变为 blocked/gap。 |
| TestOnly fixture 是否可能进入 production-like | 不允许 | profile/mode 组合校验拒绝，Production + FakeOnly 为 `Blocked`。 |
| full sensitive ref 是否进入 log/error/audit/trace/metric | 不应 | 仅输出 slot、类别、redacted digest 或 issue ref。 |
| selector 是否能携带 mapping/component/seed/manifest/Artifact/consumer body | 不允许 | body-free、owner/kind/mutable 检查；body 直接 reject。 |
| static seed 是否越界为 live memory/checkpoint/workspace | 不允许 | seed placement 固定；live state 不属于配置。 |
| local binding 是否改变 UoW/version/recovery/lease/TTL/retry | 不允许 | ref 只选实现 slot；03 不变量保持。 |
| rotation 是否偷偷引入 hot reload/LKG | 不允许 | P0 仅 new ref + restart；在线替换须重开 03/04。 |
| external selector 是否生成 candidate/digest/gate/Artifact/consumer 结果 | 不允许 | owner blocker 保持 blocked/unknown/gap；不写 positive readiness。 |
| outbound 是否泄露配置或 secret | 不允许 | 当前 `NoneAuthorized`；无 publisher/outbox/payload。 |
| future secret provider 是否被误写为当前实现 | 未发现 | 只记录 adapter-local future boundary 和重开条件。 |
| 是否存在当前泄露审计 unresolved 冲突 | 无 | 未闭合 owner/provider 是功能 blocker，不是本 Step 的泄露审计缺口。 |

## 5. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 将 Step 4/7 的 `sensitive-reference` 等标签归一为规范 `sensitive`，真实材料归为 `secret` | 否 | 配置文档术语收敛 | 不适用 | 无回写 |
| 19 个 P0 opaque ref 只保存 selector，不携带 endpoint、credential、body 或 live state | 否 | 承接既有 `ImageRuntimeConfigRef`、slot 和 forbidden-body 边界 | 不适用 | 无回写 |
| 普通来源仍固定为 `safe absence < project JSON < allowlisted env selector`；非法高优先级拒绝 | 否 | 来源与失败语义细化 | 不适用 | 无回写 |
| 所有 P0 sensitive selector 通过新 ref + restart 轮换，不支持 hot reload/LKG | 否 | 承接 `startup` 生效边界 | 不适用 | 无回写 |
| log/error/audit/trace/metric/worker marker 只输出 safe marker、issue ref、redacted digest | 否 | 承接 `03` §14 redaction 与 no-body 规则 | 不适用 | 无回写 |
| 若未来要求本仓解析真实 secret provider、暴露 credential schema、admin override、hot reload 或 provider health | 是（future trigger） | 可能改变 config carrier、builder、adapter constructor、error、audit 和 flow | `03` §13~§14 及对应 Step 7/8/9/10 | 当前未触发；不作为本 Step 正向结论 |

本 Step 没有当前“待回写”或“阻塞待确认”的 03 项。`MI-UP-001/002/003/006/007/008`、
`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 和
`PF-UNAVAILABLE-RECOVERY` 继续保持原状态，不因敏感配置处理而解除。

## 6. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“敏感级别归一规则”“敏感配置读取图”“敏感配置逐项表”“Profile 敏感配置处理表”“读取、轮换与审计承接表”“禁止输出规则”“错误模式与处理表”“敏感配置停审记录”和“跨敏感配置泄露风险审计表”，了解每个 P0 selector 如何与 raw secret 分离。

正式 `04-配置设计.md` §8 应回填以下收口结论：

1. `composition.profile`、`composition.mode` 是 `internal`；Step 7 其余 19 个 opaque ref / ref 集合统一为 `sensitive`，真实 password、token、private key、certificate、DSN、credential 和 provider body 统一归为 `secret`，但不进入 P0 配置。
2. 普通 JSON 与 allowlisted environment 只能携带 opaque selector；`null` 只表示 safe absence。当前不定义具体 secret provider、KMS、Vault、credential schema 或 raw-secret reader。
3. 所有 P0 sensitive selector 为 startup-only；轮换采用新 selector、重新校验和 restart。没有 hot reload、online override、LKG 或 production fake fallback。
4. `infra/config.rs` 负责唯一 raw configuration read、严格解析和敏感字段拒绝；`infra/runtime_builder.rs` 只消费 validated binding 并装配既有 slot。未来 adapter-local secret resolution 必须先重开 03/04。
5. 五个 profile 分别拒绝 raw secret；`ci-test` 只允许显式 TestOnly fixture，`integration-like` 只验证 controlled seam，`staging-like`/`production-like` 仍受 owner/policy blocker 约束，不产生 readiness。
6. 日志、错误、审计、trace、metric、worker marker 和生成物只能输出 safe code、slot、issue ref、低基数上下文和 redacted digest；不得输出 full ref、secret、endpoint、credential、provider 或外部正文。当前 outbound 为 `NoneAuthorized`。

正式章节不得增加本 Step 未出现的 secret key、provider 产品、credential 值、轮换命令、权限流程、hot reload 或 positive external contract；若后续需要，必须先回写 03 并重开对应 Step。

## 7. 待确认事项与持续 blocker

| 事项 | 状态 | 影响 | 未确认前处理 |
|---|---|---|---|
| `MI-UP-001` Member Service consumer manifest/ref/confirmation | pending | `member_service_supply_ref` 的 provider/consumer 语义 | 只保留 opaque selector、`ConsumerHandoffGap`/unavailable/reopen；不写 secret 或 confirmation。 |
| `MI-UP-002` member component release/compatibility | pending | `member_component_ref` 的 owner/kind 与轮换 | blocked/gap；不声明 release 或 member readiness。 |
| `MI-UP-003` Role-to-variant mapping authority | pending | `mapping_ref` 的 owner/kind 校验 | unknown/blocked；不复制 mapping body。 |
| `MI-UP-006` policy/memory/workspace/role-extra seed owner | pending | seed selector 与 placement | body-free ref/gap；不承接 live state。 |
| `MI-UP-007` Artifact consumable handoff/lineage | pending | qualification/Artifact selector | blocked/gap；不 mint Artifact ref 或 acceptance。 |
| `MI-UP-008` hardened base/Sandbox boundary | pending | `base_ref` 的 scope 与 provider | blocked/gap；不装配 sandbox backend。 |
| `Q-MI-003` builder/registry policy | pending | `build_registry_ref` 的 future provider | conservative slot；不形成 candidate/digest/release。 |
| `Q-MI-004` evidence/BOM/scanner/signature policy | pending | `qualification_artifact_ref` 的 evidence surface | blocked/gap；不返回 gate pass/eligibility。 |
| future secret provider、访问控制、rotation runbook | deferred | raw material 的 adapter-local 解析 | 本 Step 不定义产品或 API；需要时重开 03/04/10。 |
| hot reload、admin override、public credential schema | deferred / forbidden for P0 | 可能改变 carrier/builder/port/error | 继续禁止；不得以 config key 旁路实现。 |

这些 pending/deferred 项不是本 Step 的敏感泄露审计缺口；它们是 owner 合同或未来能力的输入 blocker，
不得被写成当前可读取、可发布、可回滚或 ready 的事实。

## 8. 自检与 Step 8 停审门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否识别 Step 7 全部 sensitive 配置 | 通过 | §4.3~§4.4 覆盖 19 个 sensitive key；profile/mode 另列 internal。 |
| 是否区分 `internal`、`sensitive`、`secret` | 通过 | §4.1；真实 secret 不进入 P0 schema。 |
| 是否明确存储、明文禁止、轮换和读取/变更审计 | 通过 | §4.4、§4.6。 |
| 是否覆盖 local、CI、integration、staging、production profile | 通过 | §4.5；没有额外 live/replay profile。 |
| 是否明确日志、错误、审计、trace、metric、worker marker 和生成物禁止输出 | 通过 | §4.7。 |
| raw secret、endpoint、provider body、组件/seed/mapping/Artifact/consumer body 是否被禁止 | 通过 | §4.1、§4.4、§4.8。 |
| 是否保持 static/live、pin/no-`latest`、UoW/recovery、owner 和 outbound 边界 | 通过 | §4.3、§4.5、§4.9、§4.10。 |
| 是否引入具体 secret provider、代码契约或实现事实 | 否 | 仅记录 future trigger；无 provider、commit、run、digest、测试结果或 readiness。 |
| 03 影响是否存在当前待回写或阻塞待确认项 | 通过 | §5 当前均为“无回写”；future trigger 未触发。 |
| 正式 04、Step 9、05/06/07、implementation ledger、planned skeleton 是否提前创建 | 否 | 本 Step 仅生成 calibration 文件；正式 04 仍待 Step 15。 |

```text
step_08 = completed
gate_status = pass_with_explicit_blockers
current_module = cross-sensitive-leak audit (closed)
next_allowed_action = wait_for_user_confirmation_before_creating_step_09
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

**停审结论：** Step 8 已完成。当前仅允许用户审查并明确确认后，按顺序创建
`04_config_step_09_loading_validation_activation.md`；不得提前创建 Step 9、装配正式 `04-配置设计.md`、
实现、测试执行、证据或 commit。
