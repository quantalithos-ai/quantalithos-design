# Step 11. 配置影响轮廓

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 4~10 的主体、接口、流、状态和异常已通过。
- `gate_status=pass_with_upstream_blockers`；本步只识别配置影响类别、注入点与禁止配置化边界。
- 禁止写配置 key、默认值、优先级、环境变量、JSON/YAML、secret 名称或完整配置类型。

### Step 内计划

1. 回读 Step 4~10 与正式 01 横切关注点。
2. 按主要部分、入口、ports/adapters、jobs 和 diagnostics 识别配置影响。
3. 明确 Domain/Application 只能接收已验证 typed policy/input，不能直接读取环境配置。
4. 列出安全、状态、审计、local consistency、owner truth 等禁止配置化边界。
5. 形成 03/04 承接方向与静态自检，更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 4 §7 | 实现分层与各 adapters/persistence 主体 |
| Step 5~7 | 五部分、入口、ports、consumer/jobs |
| Step 8~10 | effect boundary、状态/异常路径与 unsupported/blocked semantics |
| 正式 01 §13 | endpoint/scope/adapter/redaction 可影响，但配置不放宽 gate |
| 概要 SOP/规范 Step/§11 | 影响轮廓、禁止配置化表与 03/04 分工 |

## 3. SOP 问题回答

1. **哪些结构受配置影响？** CLI/SDK access profile、owner adapter selection/capability declaration、local metadata/path/lock backend、Git/fs adapter/tool discovery、operation/job resource budgets、diagnostic/redaction output 和 feature availability presentation。
2. **哪些只能间接受影响？** Application/Domain 不读 raw config；runtime composition 把经过验证的 typed capabilities/budgets/policies 注入 ports/services，domain hard rules保持固定。
3. **哪些禁止配置化？** explicit context、owner truth/fail-closed、query no-write、dirty/path protection、source continuity、cursor finalize、no auto Git、no blind replay、ACK/Decision layering、provenance/forbidden body、local atomic/generation 和 blocker honesty。
4. **03 展开什么？** `RuntimeConfig`/loader/validator/builder 类契约方向、typed adapter/job/diagnostic config injection、validation failures 与 immutable runtime snapshot；不在 02 定义字段。
5. **04 展开什么？** 实际 keys、sources、precedence、defaults、validation rules、examples、secret references 和 operational change behavior，前提是 03 类型/注入合同已定。

## 4. 当前文档问题诊断

README/draft 将 endpoint、credential、LFS、浅克隆、GUI、metadata 路径、Git 行为和 retry 混成候选配置，容易让历史技术偏好通过开关变成支持承诺，或让安全门禁可被关闭。旧 02 也含固定数字/SLA，却没有权威 workload。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 配置候选混入未核验产品能力和安全行为 | 只定义影响类别；unsupported 能力不能靠 config 变 supported |
| core 可能直接读 endpoint/Git/metadata 配置 | raw config 只在 composition/adapter 层；core 接受 typed contracts |
| retry/merge/push 等可能成为便利开关 | no-blind-replay/no-auto-Git 等列为不可配置化 |
| 固定阈值/SLA 先验进入设计 | budget/limit 仅作为类别，数字等待 04/05 的权威输入 |

## 6. 设计取舍

- 配置可以选择“用哪个已支持 adapter/profile”和“资源预算多大”，不能创造上游合同、source authority、Git capability 或业务 truth。
- 对能力缺失使用 typed `Unsupported/Blocked`，不允许配置启用历史 LFS/shallow/GUI/Tauri 实现。
- Credential 由外部安全机制提供给 SDK adapter 的运行语境，不能进入 `.qs-sync`、普通 config snapshot、status 或 diagnostics。
- 运行期配置变化的热加载与在途 operation 语义后置；任何变化都不能修改已冻结 plan/candidate/attempt 的历史语境。

## 7. 结构化中间产物

### 7.1 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 影响方式 / 上限 | 交给详细设计展开 |
|---|---|---|---|---|
| CLI / Inbound | 是 | profile selection、output/redaction format、resource hint | 只能解析显式选择；不提供 implicit project/version/source/default allow | typed CLI/runtime input 与 validated config injection |
| CP1 Selection & Access | 间接 | owner adapter profile、freshness source/capability availability | policy hard blockers 固定；adapter config 不决定 permission/posture | access adapter config contract、config validation failure mapping |
| CP2 Working Copy & Metadata | 是（adapter 层） | metadata backend/layout strategy、target root policy、lock capability | 不锁本轮物理 schema；不能允许 secret/body、silent rebind/repair | metadata/filesystem config types、runtime builder、migration compatibility |
| CP3 Source Materialization | 是（port/adapter 层） | supported source adapter、transfer/staging resource budgets、tool capability | 不能配置 source priority/comparator；budget exhaustion 返回 blocked/partial | source/Git/fs adapter config、bounded resource contracts |
| CP4 Conflict & Recovery | 是（operations 层） | probe scheduling/resource budgets、job lease/batch size、manual UX hint | 不能配置自动 resolve/blind retry；不定义本轮数值 | job/probe config types、immutable per-attempt config snapshot |
| CP5 Review Handoff & Provenance | 是（adapter/output 层） | Governance adapter profile、redaction/diagnostic sink、retention capability declaration | 不能配置 ACK-as-accepted、provenance deletion、evidence fabrication | handoff/diagnostic config contracts、safe config snapshot refs |
| `MetadataStore` / `LocalStateUnitOfWork` | 是 | physical persistence/locking/durability capability | 必须满足 generation/protected history/local visibility contract，否则 unsupported | store adapter constructor inputs、capability validation |
| SDK owner adapters | 是 | endpoint/profile/transport/TLS/credential reference source | config 只连接正式 capability；不允许 private endpoint/schema workaround | shared SDK config mapping、credential provider seam、compat check |
| Git adapter | 是 | executable/library selection、supported capability detection、bounded invocation | no arbitrary command；LFS/shallow remain unsupported without contract | tool config/capability probe/command whitelist contract |
| Filesystem adapter | 是 | allowed target roots、staging/lock facility capability、resource budget | no path escape/symlink unsafe/overwrite；root selection 不等于 project selection | path policy config type、validated canonical roots |
| Diagnostics adapter | 是 | sink selection、sampling/budget、redaction profile | sampling不得删 protected provenance或改变业务结果；正文/secret永禁 | diagnostic config/redaction injection/failure isolation |
| Conditional consumers | 是 | enable only when formal capability/schema contract exists、resource budget | enable flag 不创造合同；无 contract 时必须 refuse startup/unsupported | consumer binding/config validation/dedup store config |
| Operations jobs | 是 | scheduling/batch/lease/budget | job eligibility/hard gates 固定；不能 auto pull/handoff/repair | JobConfig family、builder injection、per-target result |
| clock/ID/digest providers | 是（composition） | provider implementation/capability | 不允许非稳定 IDs/digests 破坏 identity/integrity；算法选择需 03 安全审查 | provider traits/config validation |

### 7.2 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| explicit principal/project/version/source/target/operation | 防止 implicit latest/default/cache context | 正式 00 需求与 01/02 边界重审 |
| owner single truth + mutation revalidation/fail-closed | config 不能成为授权/姿态/source truth | owner 正式合同 + 00/01/02 |
| status/query no-write | 隐式 refresh/repair/probe 会破坏读写语义 | 00 `BR-SYNC-009` + 02 Step 7/8 |
| dirty/untracked/path/symlink/lock unknown non-overwrite | 用户本地修改是硬安全边界 | 00 veto + 02 Step 3/6/10 |
| no automatic merge/rebase/push/stash/force overwrite | 明确禁止行为，不是 feature toggle | 必须重开需求；当前不得改变 |
| source authority/comparator/cursor/gap semantics | 配置不能补造 owner/version contract | `SYNC-UP-002/007/008` owner 回流 |
| only proven apply advances cursor/mapping | 防止 local state 超前掩盖 partial/unknown | 02 Step 8/9；改变需回退设计 |
| generation/provenance/local transition integrity | 防止静默重绑、迁移和 history 删除 | `SYNC-UP-006` + 02 Step 6/9 |
| prepare→call→probe/finalize + no blind replay | 外部 unknown outcome 不可用 retry config 消除 | `SYNC-UP-004/005` + 02 Step 8/9 |
| candidate/transport/probe/Decision 分层 | 防止 ACK/HTTP/Git 升格为 Governance verdict | Governance owner + 00/01/02 |
| provenance non-fabrication/non-silent-delete | 追溯链不可由 retention/cleanup 开关破坏 | 00 veto + 02 Step 3/6/10 |
| forbidden body/credential/raw output/evidence report content | 安全与 ownership 红线 | 正式安全/需求设计；不得由 04 放宽 |
| external owner states cannot be mutated locally | 配置不能转移 Project/Artifact/Workspace/Governance/Archive ownership | 全局依赖规则 + owner 正式文档 |
| blocker/unsupported honesty | feature flag/fake/history 不得冒充合同或 readiness | 相应 `SYNC-UP-*` 正式关闭并回流 Step |
| fake/test-double evidence ceiling | config 指向 fake 不证明真实 integration | 05/06 evidence 设计；不得改语义 |

### 7.3 配置影响轮廓图

```text
Validated runtime configuration
        │
        ├─► Inbound / output presentation
        ├─► Adapter selection and capability declaration
        ├─► Local persistence / path / lock facilities
        ├─► Job / probe / transfer resource budgets
        └─► Diagnostics / redaction sinks
                    │
                    ▼
             Runtime composition
                    │ inject typed contracts
                    ▼
Application Services / Ports
                    │
                    ▼
Domain policies and hard gates
        (not configurable, never read raw config)
```

关键说明：

- raw config 停在 loader/validator/composition/adapter 侧；Domain 只接收已验证 typed capability/policy dependencies。
- 图不表达 key、default、precedence、environment variable、JSON、secret system 或 deployment mount。
- 配置可以导致 adapter unsupported/startup blocked，不能将缺失合同或安全失败转为成功。
- 在途 operation/plan/candidate 使用固定的 config/capability context ref；热更新不能改写历史语境。

### 7.4 03 / 04 承接方向

| 下游 | 必须展开 | 本步明确不提供 |
|---|---|---|
| `03-详细设计.md` | config loader/validator/runtime builder 角色；typed config families；adapter/service injection；immutable config snapshot/ref；validation error mapping；job/consumer capability startup checks | 实际 keys/defaults/env/JSON；未核验 provider library |
| `04-配置设计.md` | keys、sources、precedence、defaults、required/optional、validation constraints、examples、secret references、change/restart behavior | domain invariant override、owner truth/source priority、automatic unsafe actions |
| `05-测试方案.md` | invalid/missing/conflicting config、unsupported adapter、secret/redaction、budget exhaustion、config-change isolation | 任何真实测试运行/结果（当前未执行） |

### 7.5 配置影响审计

| 审计项 | 结论 |
|---|---|
| 已有主语回指 | 所有影响项均回指 Step 4~10 的 entry/part/port/adapter/job，无新增业务主体 |
| raw config 隔离 | Domain/Application 不直接读环境；composition 注入 typed contracts |
| 安全门禁 | 15 项不可配置化边界覆盖 ownership/no-write/non-overwrite/recovery/handoff/provenance/evidence |
| historical options | LFS/shallow/GUI/Tauri 不能因配置存在而变 current support |
| secret | credential 只以安全 provider ref 注入 SDK adapter，不入 metadata/status/diagnostics |
| 数值 | 未写 timeout/retry/batch/size/SLA 默认值或具体 key |

## 8. 回填草稿

正式 §11 摘录配置影响轮廓表、禁止配置化边界表、影响图和 03/04 承接方向。正文明确配置名称与值不在 02，且 capability flag 不构成支持证据。

延伸阅读入口指向本文件的“配置影响轮廓表”“禁止配置化边界表”“03 / 04 承接方向”和“配置影响审计”。

## 9. 待确认事项

- `SYNC-UP-001/002/004/006~010` 阻止相应 adapter/config family 的精确字段与 validation 规则定稿；未闭合时 runtime validation 必须返回 unsupported/blocked。
- Runtime language/framework、config library、Git tool/library、metadata backend 和 GUI/Tauri 均未选择。

## 10. 进入下一步条件

- [x] 五部分、入口、ports/adapters、consumers/jobs 的配置影响类别均有落点。
- [x] 15 项禁止配置化边界覆盖 domain invariant、状态红线、审计/一致性/安全门禁。
- [x] 03 与 04 的配置职责清晰，无 key/default/env/JSON/secret 名称或完整类型。
- [x] 配置不能关闭 blocker、开启历史未核验能力或伪造 support/readiness。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 12。此结论仅为文档静态自检。
