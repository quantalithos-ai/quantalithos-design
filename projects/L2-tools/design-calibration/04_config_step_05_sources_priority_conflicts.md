# L2-tools 04 配置设计 Step 5: 来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.5
> 回填目标: `projects/L2-tools/04-配置设计.md` §5
> 状态: `completed / pass; stop review`
> 模式: `full-restart / single-agent-serial`

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 5 定义配置来源、优先级与冲突处理 |
| 前序门禁 | Step 4 `completed / pass; stop review`；分类、activation、sensitivity 和 `NC-L2T-001~025` 禁止配置化边界已闭合。 |
| 本步状态 | `completed / pass; stop review` |
| 输入基线 | Step 3 控制面/21 个配置域、Step 4 分类边界、`03-详细设计.md` §13.1~§13.3、配置 SOP/书写规范。 |
| 正式文档写入 | 关闭；只形成 §5 回填草稿，不创建正式 `04-配置设计.md`。 |
| 下一动作 | 等待用户 review；确认后创建并执行 Step 6 环境/profile 矩阵。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

### 1.1 Step 内计划

- [x] 读取输入和前序结论：台账、配置 flow、Step 3/4、配置 SOP/书写规范、`03` §13。
- [x] SOP 问题回答：普通覆盖链、重复/alias、secret、fixture、entry-local、unsupported source。
- [x] 当前材料 / 旧文档诊断：识别来源优先级和不可用策略缺口，旧材料保持 `historical_material`。
- [x] 设计取舍：确定普通 lane、secret lane、fixture lane 和 entry-local scope 的分离。
- [x] 结构化中间产物：来源链图、冲突矩阵、21 域来源矩阵、审计表。
- [x] 复杂度判断 / 是否拆模块或附录：21 域逐项列出；不拆为隐含组，避免来源规则遗漏。
- [x] 回填草稿：形成正式 `04-配置设计.md` §5 的可摘录内容。
- [x] 自检与进入下一步条件：无 unresolved source conflict；无当前 03 回写。

## 2. 本步目标与边界

本 Step 将 Step 3 的来源种类收敛为可执行的覆盖链，并为每个配置域固定：允许来源、禁止来源、优先级、同名冲突规则以及来源不可用时的安全策略。

本 Step 只定义配置语义，不定义部署命令、容器挂载、secret 产品、具体环境值、exact key 名称、数值默认值或运行时热更新 API。普通值的覆盖规则在本 Step 固定；profile 的环境组合由 Step 6、配置项字段由 Step 7、敏感材料读取和轮换由 Step 8 继续展开。

## 3. 本步输入

| 输入 | 关键结论 | 本步用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 唯一 raw reader 为 `infra/config.rs`，唯一 runtime graph assembly 为 `infra/runtime_builder.rs`，控制面下有 21 个配置域。 | 逐域列 source binding，避免第二套配置入口。 |
| `04_config_step_04_classification_boundaries.md` | P0 只允许 `startup`、`entry-local`、`job-startup`、`static`；fixture 必须显式 profile；hot/reload/admin/remote/LKG 不支持。 | 决定来源能影响的生命周期范围。 |
| `03-详细设计.md` §13.1~§13.3 | `ToolsConfigCandidate`、`ToolsRuntimeConfig`、loader/validator/builder 顺序和 body-free error surface。 | 不新增 root、Port、error 或 constructor。 |
| `03-详细设计.md` §13.4~§13.9 | seven Store、UoW、Idempotency、external Port、feature、timeout/retry 和 blocked/unknown 语义。 | 固定缺失、能力不足、外部 blocker 的区别。 |
| 配置 SOP/书写规范 §5.5 | 来源优先级、secret 隔离、重复 key/同名冲突、不可用策略和停审要求。 | 形成本 Step 的审查矩阵。 |

## 4. SOP 问题回答

### 4.1 code default、file、env、secret、config center、admin override 的优先级是什么？

普通配置项的唯一覆盖链固定为：

```text
[code defaults: safe/defaultable values only]
              |
              v
[strict JSON configuration file]
              |
              v
[allowlisted environment variables]
              |
              v
[typed candidate -> parse/validate -> runtime builder]
```

规则如下：

1. `code defaults` 是最低优先级，只能提供在 Step 7 标为可默认化的非敏感、有界、不会创造业务事实的值；不能默认出 actor、authority、identity、readiness、accepted、delivered、outcome、secret 或 required adapter/store capability。
2. `strict JSON configuration file` 提供普通 candidate；文件必须是严格 JSON。未知字段、重复 key、重复 alias、类型强制转换、null 替代必填值和 raw secret 均拒绝。
3. `allowlisted environment variables` 是普通值的最高优先级，只能覆盖已登记的 canonical item。环境变量不是任意 map，也不能引入未登记 section、alias、feature 或安全豁免。
4. 高优先级来源一旦出现但非法，直接 `fail-fast`；不得回退到文件值或 code default。这样可以避免“坏的 env 被低优先级值掩盖”。
5. opaque secret/connection/certificate ref 走独立敏感来源通道，不与普通值做 raw merge。ref 只能是已登记的 typed locator；真实材料不进入 `ToolsConfigCandidate`、普通文件、环境变量、日志、错误或审计正文。
6. P0 不支持 config center、online last-known-good、在线 admin override、动态 watcher 或通用 CLI value override。出现相应 source/key 时返回 `UnsupportedCapability` 或 `UnsafeOverrideAttempt`，不能静默忽略。
7. entry-local selector 不是全局覆盖层。它只能为当前 API/worker/job entry 选择一个已验证的完整 profile/source 或 bounded job snapshot；不能逐字段覆盖全局 runtime、metadata、identity、actor、cursor、idempotency key 或 external target。

### 4.2 同名配置多处出现时如何冲突处理？

先把输入 key 归一到已登记的 canonical item，再执行以下规则：

| 场景 | 处理规则 | 结果 |
|---|---|---|
| 同一 JSON object 内出现相同 key | parser 直接拒绝；即使两个值相同也不接受“后者覆盖前者”。 | startup fail-fast。 |
| canonical key 与未登记 alias 同时出现 | alias 不属于当前 schema；拒绝未知字段/alias collision，不猜测迁移关系。 | startup fail-fast。 |
| 同一来源通过两个 env 名称映射到同一 canonical item | source registry 判为 ambiguous source；不得按字典序或声明顺序选值。 | startup fail-fast。 |
| file 与 env 都提供 canonical item，env 合法 | env 覆盖 file，并记录 redacted source attribution。 | 继续校验。 |
| file 与 env 都提供 canonical item，env 非法 | 不回退 file；返回 typed validation failure。 | startup fail-fast。 |
| file/env 缺失，存在允许的 code default | 使用 default，并记录 default source class。 | 继续校验。 |
| 必填 item 没有有效 file/env/ref | 不使用空值、旧配置、缓存或隐式默认。 | startup fail-fast。 |
| 组合字段互相矛盾（如 feature enabled 但 adapter slot 缺失） | 作为 cross-section conflict 整体拒绝，不按来源优先级掩盖。 | startup fail-fast。 |
| entry-local selector 与全局 profile identity 不一致 | selector 不能拼接/覆盖全局 candidate；当前 entry/job 拒绝。 | 只拒绝当前 entry；不改变 runtime。 |
| 同一 secret locator 在普通字段和 secret lane 同时出现 | raw/plain field 不是 secret lane 的替代；拒绝敏感归类冲突。 | startup fail-fast。 |

优先级只裁决同一个 canonical item 的合法来源，不裁决两个不同 item、两个 alias 或两个声称不同 schema 的字段。alias/rename/migration 必须在未来正式 schema 变更中单独设计，不能由 Step 5 的 precedence 隐式完成。

### 4.3 必填项缺失时是否阻断启动？

是，但按配置类别区分：

- required local Store、共享 UoW、Idempotency replay surface、Clock/ID 和已启用 entry/job 的 boundary 缺失或能力不足，阻断完整 runtime assembly；不暴露任何 entry bundle。
- 外部 owner/schema/mapping/route 尚未闭合时，合法的 adapter ref 可以装配为显式 `Blocked` adapter；不能以 endpoint、health marker、fake 或默认值升级为 `Available`。对应 positive flow 保持 blocked，不关闭 `L2T-UP-001~009`。
- 可选 peripheral feature 被显式关闭时，其 adapter/target 可不提供；关闭只取消外围 runner，不改变 core command、audit、outcome、idempotency 或 no-write 语义。
- entry-local selector、job scope 或 diagnostic selector 非法时，只拒绝当前 entry/job；已完成的 global runtime 不被部分修改。

### 4.4 配置中心或密钥系统不可用时如何处理？

- config center/admin source 在 P0 是 unsupported，不进入“不可达后 fallback”分支；请求本身即被拒绝。
- required opaque secret/connection ref 的解析或读取不可用时，当前 assembly fail-fast；不得回退到 raw file/env、旧 secret、缓存、空字符串或 fixture。
- explicit Local/CI deterministic fixture 不要求真实 secret provider；fixture profile 必须声明不使用该 secret slot，或使用仅存在于 fixture 内的 deterministic handle。fixture 不得在 staging-like/production-like profile 中被自动选中。
- 合法 external adapter ref 但上游 contract blocker 未闭合时，维持 `Blocked`/`Unverifiable`/`Unknown` 语义，按 03 已有 Port resolution 映射处理；这不是配置优先级冲突，也不是正向 readiness 证据。

### 4.5 哪些来源不能覆盖敏感配置？

普通 file/env 可以承载 opaque locator 的编码形式，前提是字段类型明确为 ref 且通过敏感校验；它们不能承载或覆盖 raw material。任何普通 string、JSON object、环境变量值或默认值，只要语义上是 password/token/private key/credential/DSN material，均拒绝。secret lane 的来源只能产生 opaque ref 或受控 provider handle，不能把材料合并回普通 candidate。

### 4.6 每个配置域适用哪些来源？

见 §8 的 21 域来源矩阵。矩阵把“允许普通值”“允许 opaque ref”“允许 explicit fixture”“禁止来源”和不可用策略分开记录；不把 `Blocked` external seam 与普通 source failure 混为一类。

### 4.7 来源规则是否存在 secret 覆盖、同名冲突或不可用策略不一致？

完成跨来源审计后：

- ordinary precedence 只有一条，且高优先级非法不回退；
- secret lane 与 ordinary lane 分离，没有 raw secret 覆盖路径；
- alias/duplicate/多 env 映射全部拒绝，不依赖来源顺序；
- entry-local、fixture、external blocked 各自有独立作用域和失败策略；
- config center/admin/CLI value override 没有 P0 成功路径；
- 21 个配置域均有允许/禁止来源和不可用策略；无 unresolved source conflict。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `03` §13.1~§13.3 | 说明了 candidate/loader/builder，但未给出 ordinary source precedence 和高优先级非法行为。 | 固定 defaults < JSON file < allowlisted env，invalid high source fail-fast。 |
| Step 3 §4.1 | 来源种类已列，但 secret ref、fixture、entry-local selector 尚未与普通覆盖链分离。 | 建立 ordinary lane、secret lane、fixture lane、entry-local scope 四类语义。 |
| Step 4 §4.2 | 禁止 hot/reload/admin/remote/LKG，但尚未规定出现这些 source 时是拒绝还是回退。 | 统一映射为 unsupported/unsafe override；不静默忽略、不回退。 |
| 旧 README/旧 05/06 | 可能暗示 CLI、运行时 debug、旧 provider/registry 配置可直接覆盖。 | 标记 `historical_material`；不产生 alias、迁移或兼容优先级。 |
| 外部 blocker | endpoint/ref 可能被误认为 positive provider readiness。 | 对 valid ref 保留 blocked-aware adapter；配置存在不关闭 `L2T-UP-001~009`。 |

## 6. 改动前后对比

| 项 | Step 4 前 | Step 5 后 | 原因 |
|---|---|---|---|
| 普通来源顺序 | 只列来源种类，未定覆盖 | `code defaults < JSON file < allowlisted env` | 让同一 canonical item 的覆盖可判定。 |
| 高优先级非法值 | 未定 | fail-fast，不回退低优先级 | 防止坏的 env/file 被安全默认掩盖。 |
| secret | 仅规定 opaque/sensitive 分类 | 独立 secret lane，raw material 永不进入普通链 | 防止敏感值 merge、日志和错误泄露。 |
| duplicate/alias | 未定 | JSON duplicate、alias collision、多 env 映射全部拒绝 | 避免隐式 schema/迁移。 |
| entry-local | 只规定局部生效 | 只选择完整 profile/snapshot，不覆盖全局字段 | 保持 runtime graph 和 metadata owner 唯一。 |
| fixture | 只规定显式 Local/CI | fixture source 仅在显式 Local/CI profile 有效，缺失即失败 | 禁止 production-like 静默 fake。 |
| remote/admin/CLI | 只规定不支持 | source/key 出现即 reject，不走 fallback | unsupported 必须可观测、可测试。 |

## 7. 配置设计取舍

| 议题 | 选择 | 取舍 |
|---|---|---|
| 普通 source precedence | defaults < file < allowlisted env | 环境可做受控部署覆盖，但不能任意 map 或绕过 schema。 |
| invalid high-priority source | fail-fast | 牺牲“尽量启动”，换取不隐藏错误和可复现配置身份。 |
| secret ref 是否参与 ordinary precedence | 不参与；独立 lane | 需要额外的 sensitive 校验，但避免 raw material 与普通值合并。 |
| alias/rename 兼容 | 当前不提供 | 避免把历史材料或未批准 schema 当作当前 truth；未来必须走迁移/演进 Step。 |
| external blocker | valid ref -> explicit blocked-aware adapter | 保留 local/negative/blocked-aware 设计，同时不伪造 provider readiness。 |
| fixture fallback | 不允许隐式 fallback | 测试可确定，production-like 不会悄然降级为 fake。 |
| entry-local override | 只允许 selector/snapshot scope | 防止一次请求修改 global graph、actor、identity 或 idempotency semantics。 |
| config center/admin/CLI | P0 全部 unsupported | 若未来需要，先重开 01/03/04 的 source、actor、audit、lifecycle contract。 |

## 8. 结构化中间产物

### 8.1 来源通道与覆盖顺序

来源通道必须先分 lane，再在 ordinary lane 内执行优先级。不能把 secret、fixture 或 entry-local selector 作为普通值的第四、第五层覆盖。

| lane | 来源 | 能否提供普通 candidate value | 能否提供 opaque ref | 作用域 | 失败策略 |
|---|---|---:|---:|---|---|
| ordinary | code defaults | 是，仅限可安全默认的非敏感 bounded value | 否，不能生成 secret material/ref | 全局 profile assembly | 缺失不一定失败；若 item required 则由 validator fail-fast。 |
| ordinary | strict JSON file | 是 | 仅能编码已登记的 typed opaque ref，不能放材料 | 全局 profile assembly | 文件不可读、重复 key、未知字段、类型错误或 raw secret 直接 fail-fast。 |
| ordinary | allowlisted environment | 是，仅限 canonical item allowlist | 仅能编码已登记 opaque ref，不得放材料 | local/CI/integration-like 的受控覆盖 | 变量存在但非法直接 fail-fast；不回退 file/default。 |
| secret | secret/connection provider handle | 否；不回写普通 candidate | 是，且只返回 opaque ref/受控 handle | startup/new assembly | provider/ref 不可用时 required slot fail-fast；不回退普通 lane。 |
| fixture | explicit Local/CI deterministic fixture | 只在 fixture profile 内 | 可提供 deterministic handle | isolated test assembly | fixture 未显式选择、profile 不匹配或进入 real-like 直接 reject。 |
| entry-local | complete profile/source selector、job snapshot selector | 不逐字段覆盖 | 不直接读取/覆盖 secret | 当前 API/worker/job entry | selector 非法只拒绝当前 entry/job；不修改 global runtime。 |
| unsupported | config center、admin override、generic CLI value、watch/reload/LKG | 否 | 否 | P0 无成功作用域 | `UnsupportedCapability` 或 `UnsafeOverrideAttempt`；不静默忽略。 |

普通值的来源图如下：

```text
                 +---------------------------+
                 |  explicit profile/entry  |
                 |  selector (scope only)   |
                 +-------------+-------------+
                               |
                               v
[code default] --> [strict JSON file] --> [allowlisted env]
                                            |
                                            v
                                  [canonical candidate item]
                                            |
                                            v
                              [typed parse + cross-section validate]
                                            |
                                            v
                                  [ToolsRuntimeConfig / error]

[opaque secret/connection ref] --------------------^ (separate lane)
[Local/CI deterministic fixture] -------------------^ (explicit profile only)
[config center/admin/CLI/watch] ----> reject (no fallback)
```

关键说明：

- 箭头只表示同一 canonical ordinary item 的覆盖，不表示 secret material 进入 candidate。
- env 是普通 lane 最高优先级，但不能覆盖 static safety floor、required capability 或任何 `NC-L2T-*` 红线。
- fixture 与 durable/real-like 不是同一 profile 的可替代来源；fake 成功不能关闭上游 blocker。
- source attribution 只保留 source class、canonical section/item 和 redacted config identity，不记录 raw value。

### 8.2 来源优先级与冲突处理总表

| 来源/冲突 | 优先级或裁决 | 校验阶段 | 失败结果 | 是否允许低优先级回退 |
|---|---|---|---|---:|
| code default vs file | file 覆盖 default，前提是 file 值合法 | parse + section validation | 非法 file 值 fail-fast | 否（file 已出现但非法） |
| file vs allowlisted env | 合法 env 覆盖 file | parse + section validation | 非法 env 值 fail-fast | 否 |
| default/file/env 与 static floor | floor 优先于所有 ordinary source | cross-section/redline validation | `UnsafeOverrideAttempt` | 否 |
| file duplicate key | 不做 last-write-wins | strict parser | `InvalidTypedValue`/duplicate issue | 不适用 |
| file alias/unknown key | 不自动映射 alias | schema validation | unknown/alias collision | 不适用 |
| two env names -> one canonical item | 不按顺序选择 | source registry merge | `CrossSectionConflict` | 不适用 |
| ordinary field vs secret lane | secret lane 独立；raw ordinary field 非法 | sensitivity validation | `UnsafeOverrideAttempt` | 否 |
| fixture vs non-fixture profile | fixture 只在 explicit Local/CI | profile validation | `UnsupportedCapability` | 否 |
| entry-local selector vs global profile | selector 只能选完整已验证 snapshot | entry validation | 当前 entry rejected | 不改变 global runtime |
| config center/admin/CLI/watch | P0 没有优先级 | source admission | unsupported/unsafe override | 不适用 |

### 8.3 21 个配置域来源矩阵

约定：`D/F/E` 分别表示 code default、strict JSON file、allowlisted environment；`R` 表示 opaque secret/connection ref lane；`X` 表示 explicit Local/CI fixture；`L` 表示 entry-local selector 或 job-startup snapshot 仅能选择完整已验证值，不可逐字段覆盖；`-` 表示不允许该来源。 required 项无安全默认时，`D` 不成立。

| 配置域 | 允许来源 | 禁止来源 | 优先级 | 不可用/非法策略 |
|---|---|---|---|---|
| `profile.selection` | F/E；L 仅选完整 profile；X 仅显式 Local/CI | config center/admin/CLI value；未登记 profile | F < E；L 不参与逐项覆盖 | profile 缺失、未知或 env 非法时 fail-fast；不猜 production。 |
| `config.identity` | loader-generated source attribution；L 仅携带 selector ref | 用户直接设置 identity；raw config/secret/commit claim | loader attribution 唯一 | forged/missing attribution fail-fast；不以旧 identity 补齐。 |
| `boundary.command` | D/F/E；X；L 仅当前 entry 的已验证 bounded snapshot | raw body、metadata/identity override、hot/watch | D < F < E；X 仅 fixture profile | 类型/范围/有界性或 cross-section 错误 fail-fast；不回退。 |
| `boundary.query` | D/F/E；X；L 仅当前 query snapshot | visibility bypass、refresh/write flag、raw body/debug dump | D < F < E | invalid page/filter/freshness category 拒绝当前 entry；Query 不写。 |
| `boundary.consumer` | D/F/E；X；L 仅完整 envelope validator profile | source authority/body/receipt override、generic CLI | D < F < E | schema/body/dedup bound 非法 fail-fast；不接受未登记 envelope。 |
| `boundary.job` | D/F/E；X；L 选 job snapshot/scope | run/evidence/signoff/cursor truth override、mid-run reload | D < F < E；L 在 job-startup 冻结 | job boundary/scope 无效拒绝该 job；不扩展全扫。 |
| `stores.logical` | F/E typed adapter ref；R 仅 connection ref；X | default fake（非 fixture）、entry-local swap、product/DDL selector | F < E；R 独立校验；X 需显式 profile | required store/ref/capability 缺失阻断 assembly；不降级到 memory/cache。 |
| `stores.uow` | F/E typed UoW binding；R；X | split authority、entry-local transaction、hidden fallback | F < E；capability invariant 不可覆盖 | 无共享 UoW/CAS/pair capability fail-fast；不补偿写。 |
| `idempotency.command_consumer` | D 仅安全 retention category；F/E typed sidecar ref；R；X | namespace/key/digest/duplicate semantics override；hot shrink | D < F < E；semantic floor固定 | replay surface 缺失或 retention 危险 fail-fast；不重算旧结果。 |
| `idempotency.continuation_job` | D/F/E typed sidecar/ref；R；X | unknown/manual fence、attempt key、report truth override | D < F < E | result/receipt/report 存储不可用阻断相应 runner；不自动重试 unknown。 |
| `projection.read_rebuild` | D/F/E bounded freshness/page；F/E adapter ref；X；L 选 job snapshot | Query refresh/write、core fallback、subject repair | D < F < E；L job-startup冻结 | projection adapter/limit 不可用返回 stale/rebuilding/unavailable；不写 core。 |
| `jobs.bounded_runner` | D/F/E batch/parallelism/category；X；L scope/job snapshot | generic scheduler/run/evidence/signoff truth、mid-run mutation | D < F < E；L 冻结 | invalid limit/category fail-fast；依赖 blocked 时 job blocked/partial，不盲扫。 |
| `adapters.compile_runtime` | F/E typed adapter ref；R；X；L 仅选择完整 profile | sibling dependency、Core schema copy、local registry、health-as-authority | F < E；availability 由 Port response 决定 | `CandidateOnly`/`Blocked` 保留；不因 endpoint 健康升级 Available。 |
| `adapters.authorization_sandbox` | F/E typed ref；R；X；L 选 blocked-aware slot | self-auth/default allow、host execution、run/receipt/capture | F < E；X 仅 Local/CI | owner/schema/mapping blocker -> blocked/fail-closed；不使用默认 allow/host fallback。 |
| `adapters.collaboration_visibility` | F/E typed ref；R；X；L 选 route/visibility slot | route/delivery/observed truth、default visible、Obs store | F < E；availability 由 formal Port response | route/source blocker -> route-blocked/unknown；不声明 delivered/observed。 |
| `handoff.target_set` | F/E typed target refs；X；L 选当前 job target set | target->route/delivery/accepted inference、动态 reroute | F < E；空集是无目标 | target 缺失/不匹配使 material ineligible 或 route-blocked；不算成功。 |
| `handoff.phase_policy` | D/F/E typed timeout/retry category；X；L job-startup | raw retry count 放宽 one-call fence、Prepared/unknown override | D < F < E；unknown/manual floor固定 | category 非法 fail-fast；Prepared/unknown 进入 manual/unknown，不二次调用。 |
| `clock_id.binding` | F/E typed adapter ref；R；X；D 仅安全 deterministic category | entry-local semantic ID、DB implicit time/ID、digest override | F < E；X 仅 fixture | required Clock/ID slot 缺失阻断 assembly；不由 config 生成业务 identity。 |
| `features.peripheral` | D 可安全关闭；F/E；X；L job-startup | 关闭 core gate/audit/outcome/idempotency/no-write；admin toggle | D < F < E；core floor固定 | enabled feature 缺 adapter/target -> fail-fast 或显式 blocked；disabled 不改 core。 |
| `safety.redaction` | D 安全最低 floor；F/E 只能收紧；R 仅 opaque policy ref；X | raw body/secret/debug bypass、任何放宽 floor | ordinary precedence 受 monotonic floor约束 | 放宽尝试 `UnsafeOverrideAttempt`；redaction policy 不可用 fail-closed。 |
| `safety.telemetry` | D/F/E safe low-cardinality selectors；X；R 仅安全 sink/ref | raw body/secret/high-cardinality/Obs truth/route override | D < F < E 但不得越过 safe floor | invalid selector fail-fast；telemetry 不可用不阻断 core truth，但不得输出不安全诊断。 |

### 8.4 来源优先级停审记录

| 配置域/来源组 | 优先级是否唯一 | 冲突是否可判定 | 不可用策略是否明确 | 结论 |
|---|---:|---:|---:|---|
| `profile.selection` / `config.identity` | 是 | 是 | 是 | 通过 |
| boundary domains (`command/query/consumer/job`) | 是 | 是 | 是 | 通过 |
| stores/UoW/idempotency | 是；capability floor 不可覆盖 | 是 | 是 | 通过 |
| projection/jobs | 是 | 是 | 是 | 通过 |
| external adapters/handoff | 是；formal Port availability 不由来源决定 | 是 | 是 | 通过（`L2T-UP-001~009` 保留） |
| clock/ID/features | 是 | 是 | 是 | 通过 |
| safety/redaction/telemetry | 是；安全 floor 单调优先 | 是 | 是 | 通过 |

### 8.5 跨来源冲突审计表

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| ordinary precedence 是否只有一条 | 通过 | 统一为 `D < F < E`；不引入 CLI、remote 或 admin 第四层。 |
| 高优先级非法是否会低优先级回退 | 通过 | parser/validator fail-fast；不得 fallback。 |
| JSON duplicate/alias/unknown 是否拒绝 | 通过 | strict parser + canonical registry；不做 last-write-wins 或隐式 alias。 |
| secret raw 是否可被 file/env/default 覆盖 | 通过 | raw material 永远不进入普通 lane；只允许 opaque ref/handle。 |
| fixture 是否可能静默进入 real-like | 通过 | explicit Local/CI profile gate；profile mismatch reject。 |
| entry-local 是否能改变 global runtime 或 metadata | 通过 | 只选择完整 snapshot；当前 entry 非法只局部拒绝。 |
| config center/admin/CLI/watch/LKG 是否有 P0 成功路径 | 通过 | source admission 直接 unsupported/unsafe。 |
| external endpoint/ref 是否被误当 positive readiness | 通过 | adapter availability 只能由 formal typed Port resolution 产生。 |
| 21 域是否都有允许/禁止来源和失败策略 | 通过 | §8.3 逐域覆盖，无遗漏。 |
| 不可用策略是否混淆 fail-fast/blocked/degraded/unknown | 通过 | local required -> fail-fast；external blocker -> blocked；外围 telemetry -> safe omission；Prepared/unknown 保持 manual fence。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| ordinary source precedence 固定为 defaults < JSON file < allowlisted env | 否 | 来源/优先级语义 | `03` §13.1~§13.3 已将具体来源留给 04 | 无回写 |
| 高优先级非法值不回退低优先级 | 否 | validation/failure policy | `03` §13.2 typed error surface 可承接 | 无回写 |
| strict JSON duplicate/alias/unknown 拒绝 | 否 | parser/schema policy | `03` §13.2/§13.3 | 无回写 |
| secret/connection ref 独立 lane，raw material 不入 candidate | 否 | sensitivity/source policy | `03` §13.1~§13.2 已禁止 raw secret | 无回写 |
| fixture 仅显式 Local/CI，entry-local 只选完整 snapshot | 否 | profile/scope policy | `03` §13.3/§13.9 已有 fixture/entry binding | 无回写 |
| config center/admin/CLI/watch/LKG 在 P0 unsupported | 否 | source lifecycle policy | `03` §13.3/§13.9 已保留 unsupported surface | 无回写 |
| valid external ref 不升级 `PortResolution::Available` | 否 | blocked external binding | `03` §13.1、§13.5~§13.7 | 无回写 |
| future 若新增 source lane、dynamic override、reload API、source actor/audit 或新的 root/Port/error | 是 | code/lifecycle contract change | 对应 `03` §4~§15 和 calibration Step | 无回写（future design-change trigger；当前未触发） |

当前不存在 `待回写` 或 `阻塞待确认`。future trigger 只是重新打开条件，不是当前 blocker。

## 10. 回填草稿

正式 `04-配置设计.md` §5 应按以下顺序装配：

1. 配置来源链图：普通值 `code defaults -> strict JSON file -> allowlisted environment`，secret/fixture/entry-local 为独立 lane，P0 unsupported source 直接 reject。
2. 来源优先级表：明确 file 覆盖 default、env 覆盖 file；来源存在但非法时 fail-fast，不回退。
3. 冲突处理表：JSON duplicate、unknown/alias、双 env 映射、cross-section conflict、secret lane collision、entry-local/global conflict 的裁决。
4. 敏感来源规则：普通 file/env 只能编码 typed opaque ref，不能承载 raw secret；required ref/provider 不可用时 fail-fast。
5. 21 个配置域来源矩阵：逐域列允许来源、禁止来源、优先级和不可用策略；`D/F/E/R/X/L` 词表须在表前解释。
6. P0 unsupported source：config center、admin override、generic CLI value、watch/reload、online LKG 均映射为 `UnsupportedCapability` 或 `UnsafeOverrideAttempt`，不静默忽略。
7. external blocker 说明：配置存在、endpoint/ref/health marker 或 fake 成功均不等于 authority、schema、mapping、route、delivery 或 readiness closure。

正式章节不得加入本 Step 未确认的 exact env 名、secret 产品、部署命令、数值默认值、alias 迁移或 remote source。

## 11. 待确认事项

| 事项 | 影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| Step 6 的 profile 是否需要为某些 non-sensitive item 明确 default 还是全部显式 | Step 6/7 | 架构/测试/实施负责人 | 保持 `D` 仅适用于安全可默认类别；required item 无 default。 |
| opaque connection ref 的具体 provider/文件注入方式 | Step 8/09 | 安全/运维 | 只允许 typed ref/handle；不写产品名或 raw material。 |
| environment allowlist 的最终 canonical 名称 | Step 7/09 | 实施/运维 | 只保留 allowlisted canonical item 规则，不生成 env 名。 |
| future 是否批准 config center/admin/hot reload | 01/03/04 重开 | 架构/安全/运维 | 当前 source/key 直接 reject，不生成成功路径。 |

这些是后续 profile、配置项和运维绑定的输入，不是当前 Step blocker；当前未发现新增上游 blocker。

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| ordinary source precedence 唯一且可执行 | 通过 | `D < F < E`，高优先级非法不回退。 |
| duplicate/alias/canonical conflict 可判定 | 通过 | strict JSON、source registry 和 cross-section validator 规则已列。 |
| secret source 与 ordinary source 隔离 | 通过 | raw material 不进入普通 candidate；required ref 失败 fail-fast。 |
| entry-local 与 fixture 作用域闭合 | 通过 | entry-local 只选完整 snapshot；fixture 仅显式 Local/CI。 |
| config center/admin/CLI/watch/LKG P0 处理明确 | 通过 | unsupported/unsafe reject，无 fallback。 |
| 21 个配置域逐项有来源/禁止/失败策略 | 通过 | §8.3 全覆盖。 |
| 跨来源审计无 unresolved 冲突 | 通过 | §8.5。 |
| 当前 `03` 无待回写或 blocker | 通过 | §9；future trigger 未触发。 |
| 正式 04 是否提前写入 | 否 | 仍处于中间产物阶段。 |
| 下一动作 | 停审 | 等用户确认后创建 Step 6。 |
