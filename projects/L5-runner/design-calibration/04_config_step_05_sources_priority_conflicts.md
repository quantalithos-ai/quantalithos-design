# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节：`04-配置设计.md` §5
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md`
> 输入：Step 3～4、正式 03 §13、03 Step 14
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与内计划

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 5 |
| current_module | `sources:priority_and_conflicts` |
| gate_status | `pass_for_step_06` |
| gate_reason | 单一外部文档、safe defaults、selector/ref/fixture 隔离、逐域覆盖、冲突和不可用策略均已闭合；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_06_environment_profiles_matrix.md` |

| Step 内项目 | 状态 | 产物/门禁 |
|---|---|---|
| 来源角色与覆盖顺序 | done | declarations/defaults < one document |
| selector、secret、fixture 隔离 | done | 均不成为叶子覆盖层 |
| 冲突/缺失/非法值 | done | strict reject / fail-closed |
| 七域来源覆盖 | done | 逐域唯一来源规则 |
| 跨来源审计 | done | 无 raw secret、silent fallback 或 P0 remote override |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| code default、file、env、secret、config center、admin override 的优先级？ | P0 普通值链固定为 `static declarations / safe optional defaults < one selected external strict JSON document`。host/deployment selector 只选择整份文档，不覆盖叶子。env/CLI 叶子覆盖、多个 overlay、config center、admin override 和 hot patch 均不支持。 |
| 同名配置多处出现怎么办？ | 外部文档的合法值覆盖 safe default；同一文档 duplicate key、alias/旧 key、unknown key、重复 slot 或同一语义多写均 whole-document reject。高优先级值非法时不得回退 default。 |
| 必填项缺失是否阻断？ | startup 必填项缺失阻断 builder；Job-start 必填 policy unresolved 拒绝当前 Job；entry-local selector 缺失/非法只阻断当前入口。外围 feature 为 disabled 时其 optional target 可缺失。 |
| 配置中心或密钥系统不可用怎么办？ | P0 不使用配置中心。普通文档只保存 opaque sensitive ref；所选 profile 要求 resolver 而 resolver 不可用时 fail-closed，绝不回退 raw value、fake 或旧 secret。 |
| 哪些来源不能覆盖敏感配置？ | 所有普通来源、selector、entry 参数和测试 fixture 都不能携带 raw secret/token/password/private key/cert body/credential-bearing URL/DSN。它们最多提供 opaque ref；material 解析属于受控 provider seam。 |
| 每域允许哪些来源？ | 七域均只消费 validated document + static declarations；deterministic fixture 仅满足 test-only binding，不改文档叶子；Job/entry 输入只提供本次 request 的正式字段或 selector，不改全局 snapshot。 |

## 3. 诊断、改动前后与取舍

| 议题 | 风险/候选 | 收口后 | 理由 |
|---|---|---|---|
| 多级覆盖 | 通用 `default < file < env < CLI` 容易形成不可复核 drift | 一个 strict JSON document；selector 只选整份文档 | Runner 是端侧安全入口，必须可证明本次装配 basis |
| env 叶子值 | 容易泄露 secret 或绕过 schema | P0 unsupported；未来若引入需重开 03/04 | 当前无 exact host/process authority |
| invalid fallback | 非法 external 值回退 default 会掩盖操作者意图 | reject whole document | fail-closed，禁止隐式放行 |
| test override | 作为最高优先级会污染产品运行 | fixture registry 仅 test profile，不能覆盖 config | fake 只验证语义，不是 production fallback |
| last-known-good | 自动复用旧 snapshot 可能跨 generation/profile | P0 不自动使用 LKG | 避免陈旧配置静默恢复能力 |
| sensitive value | 把 raw credential 放进 JSON/env | 只允许 opaque ref；解析在受控 seam | 保持 redaction、审计和最小暴露 |

## 4. 结构化中间产物

### 4.1 来源角色与优先级

| 来源角色 | 优先级/位置 | 允许内容 | 冲突处理 | 不可用策略 |
|---|---:|---|---|---|
| static declarations | 0，不是可覆盖值源 | schema、requiredness、closed enum、硬安全上限、forbidden fields | 任何外部放宽尝试均 reject | 声明不完整属于设计/实现 blocker |
| safe optional defaults | 1 | 仅 `false`、空 optional 集合/`null`、disabled/pending 等不会开启正向能力的值 | 被一份合法 external document 覆盖 | default 自身必须过同一 validator；不能单独伪造可运行 runtime |
| one selected external strict JSON document | 2，唯一普通外部值源 | profile、logical store/binding refs、finite policy、safe feature request | 合法字段覆盖 safe default；非法/歧义则整份 reject | 缺失、不可读取、parse/type/cross-field 失败均 fail-fast |
| host/deployment document selector | source-of-source | 只选一份完整文档及入口 profile | 多 selector 冲突或选择结果不唯一即 reject | 阻断当前 bootstrap/entry；不猜路径或默认 profile |
| sensitive resolver | validation 后的独立 seam | 用 opaque ref 解析 runtime material | 不进入普通覆盖链；ref 与 resolved family 不匹配即 reject | required resolver/material 不可用时 affected assembly/operation blocked |
| deterministic fixture registry | test-only seam | fake ref 对应的确定性行为、clock/id fixture | 不能覆盖 document；只解析 test profile 中显式 fake ref | fixture 缺失使测试装配 fail-fast |
| job/request input | protocol 输入，不是 config source | 本次 Job 已有 typed scope/page/target/basis | 仅在 03 已允许的 run-local policy 范围内与 startup cap 取更严格值 | 非法/超过 cap 拒绝当前 Job，不修改 snapshot |
| env/CLI leaf override | P0 unsupported | 无 | 检测到叶子映射设计即拒绝 | 不适用 |
| config center/admin/hot patch | P1/P2 unsupported | 无 | 不能注入 P0 | 要求先回写 loader/lifecycle/audit/rollback 契约 |

`config_ref` 由 source snapshot + canonical validation 结果生成，是 body-free correlation ref；它不是用户可填写字段、Release digest、artifact digest、commit 或 evidence。

### 4.2 冲突处理表

| 冲突/错误场景 | 处理规则 | 阻断范围 |
|---|---|---|
| external 合法字段与 safe default 同名 | external 覆盖 default | 不阻断 |
| external 值类型/enum/ref/范围非法 | 不回退 default；whole-document reject | bootstrap/new assembly |
| JSON duplicate key | strict parser reject | bootstrap/new assembly |
| alias/旧 key 与正式 key 并存 | unknown/removed-field reject | bootstrap/new assembly |
| unknown section/field | closed schema reject | bootstrap/new assembly |
| 同一 logical slot 重复或一个 ref 绑定多种不兼容 family | ambiguity reject | bootstrap/new assembly |
| profile 与 binding/store/feature/test fixture 不兼容 | cross-field reject | bootstrap/new assembly |
| startup required ref/value 缺失 | fail-fast；builder 不进入 Ready | whole runtime |
| authority-pending numeric policy 未解析 | 对应 write/run/job blocked；不得取零、无限或历史数值 | 对应能力；若为核心 cap 则 assembly blocked |
| feature disabled 且 optional target 缺失 | 允许，保持 disabled | 不阻断 |
| feature requested 但 contract/target/binding 不可用 | explicit blocked/unsupported；不得 true-but-ready | affected capability |
| ordinary document 含 raw secret/body/path/credential URL | security violation；reject before snapshot | whole document |
| test fake 出现在 non-test profile | profile violation；reject | bootstrap/new assembly |
| selector 同时选择多文档/多 profile | source ambiguity；reject | 当前 entry/bootstrap |
| 自动 LKG/旧缓存回退 | P0 禁止 | 不执行回退 |
| 尝试配置 static/VETO 项 | design-boundary violation；reject | whole document |

### 4.3 按配置域组织的来源覆盖

| 配置域 | 允许来源 | 禁止来源/覆盖 | 优先级与组合 | 不可用策略 |
|---|---|---|---|---|
| `runtime` | declarations、safe defaults、one document、whole-document selector | URL/query/DOM/storage、env/CLI 叶子、implicit profile | document > safe default；profile 必须显式 | profile/source 缺失或不唯一 fail-fast |
| `stores` | one document 中 logical `RunnerStoreConfigRef`；test profile 可引用 fake registry | raw DSN/path/backend、production fake、query-time override | document ref 经 capability resolver；无逐叶 overlay | core guarantee 不可证明则 builder blocked |
| `bindings` | one document 中 slot→opaque ref；resolver/registry 产生 marker | endpoint、SDK method、private backend、owner payload、direct sibling DB/bus | document ref + formal registry/readiness；configured 不等 enabled/ready | missing required/contract unknown → blocked/unsupported |
| `limits` | declarations 的硬安全上限、one document 的 finite policy、03 已允许的 request-local 更严格值 | unlimited/zero bypass、放宽 hard cap、retry/no-replay override | `effective = min(startup cap, allowed request value)`；无 authority 时 unresolved | reject entry/Job 或 block capability；不猜数字 |
| `observability` | one document 中 mandatory redaction/telemetry/handoff refs | raw log/body/secret、disable redaction、evidence/report producer switch | document ref + formal safety validation | redaction unresolved fail-closed；telemetry failure不改业务 truth |
| `determinism` | one document binding refs；test-only fixture registry | ad hoc time/id/hash、non-test fake、raw input hash | document selects family；fixture只解析显式 test ref | required provider missing blocks mutation/test |
| `features` | safe default disabled/absent + one document 的外围 request/ref | owner mutation、reserved Consumer positive path、outbound event、safety bypass | document 可请求；availability/contract 再裁决 | disabled 安全；requested but unavailable 显式 blocked |

### 4.4 来源停审与跨来源审计

| 配置域/来源 | 优先级唯一 | 冲突可判定 | 不可用明确 | 结论 |
|---|---|---|---|---|
| declarations/defaults/document | yes | strict document/whole reject | yes | pass |
| selector | yes，非叶子层 | 多选即 reject | yes | pass，delivery mechanism pending 07/09 |
| sensitive resolver | 独立 seam | family/ref mismatch reject | fail-closed | pass with provider blocker |
| fixture | test-only | profile mismatch reject | test fail-fast | pass |
| runtime/stores/bindings | yes | closed schema + capability marker | blocked/fail-fast | pass with upstream/physical blockers |
| limits/observability | yes | hard cap/ref/safety check | reject/blocked | pass pending authority |
| determinism/features | yes | profile/prerequisite check | blocked/disabled | pass |

| 跨来源审计项 | 结论 | 修正/说明 |
|---|---|---|
| raw secret 是否进入 ordinary source | no | 普通 JSON 只含 opaque ref；Step 8 再审计 |
| 高优先级非法值是否 silent fallback | no | whole-document reject |
| 多 overlay/env/CLI 是否造成漂移 | no | P0 单一文档；selector 只选整体 |
| fixture 是否污染 non-test | no | profile mismatch reject |
| config center/admin/hot 是否混入 P0 | no | unsupported |
| entry/Job 是否能改全局 snapshot | no | 只选整体或取更严格的正式 run-local 输入 |
| 来源规则是否改变 03 代码契约 | no | 对既有 source snapshot/config ref/builder 语义做配置展开 |

## 5. 详细设计影响、回填草稿与门禁

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| safe defaults + one strict document | 否 | 来源/序列化语义 | N/A | 无回写 |
| selector 不做 leaf override | 否 | source boundary | N/A | 无回写 |
| sensitive resolver/test fixture 独立于普通链 | 否 | 安全/测试边界 | N/A | 无回写 |
| future remote config/admin/hot/LKG | 是 | loader、lifecycle、audit、recovery | 03 Step 7/9/12/14 | 当前排除，非本轮 blocker |

未来正式 §5 应回填来源角色表、冲突表和逐域来源覆盖表；必须明确 selector 是抽象 source-of-source，不代表已经存在 env key、CLI flag、路径或部署机制。

| 待确认事项 | 当前处理 |
|---|---|
| host 如何交付/选择完整 JSON 文档 | 07/09 承接；本步不命名 env/flag/path |
| sensitive resolver 产品与 material 生命周期 | Step 8 只定行为；产品保持 blocked |
| numeric authority | Step 7 使用 required/unresolved，禁止默认数字 |

| 进入 Step 6 条件 | 结论 |
|---|---|
| 覆盖顺序唯一且可判定 | pass |
| 七域允许/禁止来源和不可用策略齐全 | pass |
| 跨来源无 secret/silent fallback/drift 冲突 | pass |
| 无 `待回写`/`阻塞待确认` 的当前 03 影响 | pass |

Step 5 完成，允许进入 Step 6；正式 04 仍不可写。
