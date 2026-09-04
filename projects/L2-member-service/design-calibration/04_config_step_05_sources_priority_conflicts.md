# Step 5：定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节：未来正式 `04-配置设计.md` §5“配置来源、优先级与冲突处理”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md`
> 执行模式：full-restart；旧配置、旧 env 名称和产品假设不继承
> 完成日期：2026-09-02

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 5 来源、优先级与冲突处理 |
| 当前模块 | `sources_priority_conflicts` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1~4、`03` §13、`03_ddd_step_14_config_dependencies.md` |
| 正式 `04` 写入 | `false`；仅 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；不声称任何 backend 或 sibling ready |
| commit | `false` |

### 1.1 Step 内计划

- [x] 固定普通来源优先级和局部来源边界。
- [x] 定义配置域允许 / 禁止来源及不可用策略。
- [x] 定义重复 key、alias、非法高优先级值和敏感覆盖冲突处理。
- [x] 明确 config center、admin override、raw secret 和 test fixture 的 P0 状态。
- [x] 完成跨来源冲突审计、`03` 影响判定、回填草稿和停审。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | completed | 来源链、功能域、装配入口 |
| `04_config_step_04_categories_boundaries.md` | completed | 类别、更新时机、禁止配置化项 |
| `03-详细设计.md` §13 | 正式直接输入 | `config.rs`、builder、typed entry 边界 |
| `03_ddd_step_14_config_dependencies.md` | 字段级输入 | binding 名称和 P0 fake / blocked 上限 |
| `L1-governance` Step 5 | 只读格式参考 | 优先级表、冲突表和域级停审 |

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 配置来源有哪些？ | 普通来源为 code defaults、严格 JSON 配置文件、environment override；opaque secret reference 可由普通来源提供引用但不提供 secret body；entry-local 参数与 job-run-start 参数仅局部生效；`deterministic_fixture.*` 只允许 `ci-test` / `operations-replay`；`local-dev` 只用普通 fake / placeholder，`integration-like` 只允许 controlled adapter seam 的场景选择 / 故障注入；P0 不启用 config center 或 admin override。 |
| 来源优先级如何定义？ | 普通来源唯一顺序为 `code defaults < config file < environment variables`。高优先级存在且非法时 fail-fast，不回退低优先级。entry-local / job-run-start 不参与全局覆盖，只在各自边界中生效。 |
| 哪些来源不能覆盖敏感配置？ | 普通来源不能提供 raw password、token、private key、DSN body 或 credential body；只能提供经过校验的 opaque ref。未来 secret provider 的真实材料不进入 JSON、env、日志或错误。 |
| 不可用如何处理？ | 必填 startup 配置缺失、不可读或非法直接阻断启动；必填 job / entry 参数错误只拒绝当前操作；可选外围目标未启用时允许缺失；已启用但 target/adapter 缺失 fail-fast 或当前 job rejected；未闭合 sibling seam 保持 blocked/unknown。 |
| 不同配置域是否允许不同优先级？ | 普通来源顺序不变，域只声明允许哪些来源。敏感 ref 仍遵循同一引用覆盖顺序，但 raw material 永不进入覆盖链；`deterministic_fixture.*` 只允许 `ci-test` / `operations-replay`，不能进入 `local-dev`、`integration-like` 或 future profile。 |
| config center / admin override 是否适用 P0？ | 不适用。若未来引入，必须先完成 ADR、actor/audit、签名/版本、rollback 和 `03` builder / error 回写。 |

## 4. 当前材料诊断

| 位置 | 问题 | 本 Step 修正 |
|---|---|---|
| 旧 README / 旧 `05/06` | env、容器参数和数据库地址可能被误认为新版正式来源 | 不引用历史 key；仅保留来源类型和污染记录 |
| Step 3 来源链 | 只有候选来源，没有唯一覆盖顺序 | 固定 defaults < file < env，并隔离局部来源 |
| `03` §13 | opaque ref、fixture、future remote source 的边界未细分 | 增加域级允许 / 禁止来源和 unavailable 处置 |
| 敏感配置 | 可能把 endpoint / DSN / credential body 当普通字符串 | 只允许 opaque ref；raw body 直接拒绝 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 普通优先级 | 未固定 | `defaults < JSON file < env` | 冲突时可判定且易审计 |
| 局部来源 | 与全局来源混写 | entry-local、job-run-start、`deterministic_fixture.*` 各自隔离 | 防止覆盖 actor、scope、generation 或全局安全边界 |
| remote/admin | 可能被旧方案暗含 | P0 unsupported；未来需设计变更 | 不伪造在线配置和审计能力 |
| 敏感项 | 普通字符串风险 | ref 与 secret body 分离 | 防止泄露和静默覆盖 |

## 6. 配置设计取舍

| 议题 | 方案 | 采用结论 |
|---|---|---|
| env 与文件同名冲突 | 高优先级覆盖 / 一律拒绝 | 采用高优先级覆盖；高优先级非法则 fail-fast |
| 文件重复 key | 最后值覆盖 / 视为歧义 | 采用歧义并 fail-fast，保留 canonical JSON 规则 |
| entry-local 是否可覆盖 startup | 可以 / 只能局部选择 | 采用只能局部选择，不改变已装配 adapter、store、security boundary |
| `deterministic_fixture.*` 是否可覆盖普通来源 | 可以 / 只在允许 profile 的局部入口显式启用 | 采用后者；仅 `ci-test` / `operations-replay` 可用，其他 P0 与 future profile 直接拒绝 |
| optional target 缺失 | 静默降级 / 禁用或阻断并记录 | 采用显式 disabled/degraded；危险动作使用 fail-closed |

## 7. 结构化中间产物

### 7.1 来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---:|---|---|---|
| code defaults / safe defaults | 1（最低） | P0 profile、in-memory/fake store、safe redaction、外围 disabled | 被 file / env 覆盖；默认仍需校验 | 默认缺失只允许非关键项；关键项无默认则 fail-fast |
| strict JSON config file | 2 | startup binding、store / adapter ref、boundary、feature、job 默认 | 覆盖 defaults；重复 key / alias fail-fast | 文件不可读或 JSON 无效 fail-fast |
| environment variables | 3（最高普通来源） | profile selector、config path、有限 ref、CI selector | 覆盖 file / defaults；非法值不回退 | 缺失使用低优先级；存在但非法 fail-fast |
| opaque secret / credential reference | 引用沿普通来源解析 | credential、endpoint、DSN、handoff target ref | ref 按普通来源；raw body 一律 reject | ref 不符合格式或 provider 不可用时 fail-closed / blocked |
| entry-local parameters | 局部，不参与全局优先级 | 当前 entry 的 config source、profile、request source、dry-run、输出路径 | 只影响当前调用；与全局 source selector 冲突则拒绝当前 entry | 必填缺失拒绝当前入口 |
| job-run-start parameters | 局部，不参与全局覆盖 | batch、parallelism、timeout、retry、target snapshot | 与 job request 重复且不一致则拒绝当前 run | 当前 job rejected，不污染全局配置 |
| `deterministic_fixture.*` / replay input | 仅 `ci-test` / `operations-replay` | fixed clock/id、deterministic seed、脱敏 replay ref | 只能作用 test harness / replay run；`local-dev` 和 `integration-like` 不启用该配置域 | fixture 不完整时 test / replay fail-fast |
| config center | P1/P2，P0 unsupported | future remote source | P0 识别为 unsupported source | fail-fast，不隐式读取 |
| admin override | P1/P2，P0 unsupported | future audited operator change | P0 识别为 unsupported source | fail-fast，不隐式读取 |

### 7.2 配置域来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 / 局部性 | 不可用策略 |
|---|---|---|---|---|
| `profile` / `config_identity` | defaults、file、env、entry-local selector | raw secret、admin override(P0)、业务 scope、`deterministic_fixture.*` 覆盖 | 普通顺序；entry selector 仅选择 profile | unknown profile fail-fast |
| logical truth / maintenance stores | defaults、file、env、sensitive ref | entry-local store swap、hot update、config center(P0)、`deterministic_fixture.*` 覆盖 | startup 冻结 | required store 缺失 fail-fast |
| qualification resolvers | defaults、file、env、sensitive ref | raw external body、业务 policy override、`deterministic_fixture.*` 覆盖 | startup；integration-like 只经 controlled seam | unresolved -> blocked/unknown |
| Member / Images / Runtime / Sandbox seams | file、env 的 opaque ref；`ci-test` / `operations-replay` 可经 test/replay assembly 提供受控输入 | raw credential、伪造 endpoint、positive readiness flag；`local-dev` / `integration-like` 的 `deterministic_fixture.*` 覆盖 | startup；feature 只能 disabled/blocked | enabled seam 缺 ref -> fail-fast；未闭合 -> blocked |
| carrier availability marker | defaults、file、env 的 availability enum | carrier ref、release schema、carrier contract body、positive readiness flag | startup；只承载 availability，不装配 carrier adapter | unavailable -> handoff blocked / gap；不得推导 ready |
| registration / session / health | defaults、file、env、job-run-start assessment knobs | state override、actor override、hot | startup + new job run | signal/assessment source 不可用 -> unknown/degraded |
| publication / handoff | defaults、file、env、sensitive target ref、job-run-start retry / target snapshot | event schema override、receipt-as-success、entry-local target override | startup target + run snapshot | disabled 可缺 target；enabled 缺 target -> blocked |
| operations jobs | defaults、file、env、job-run-start | decision、authorization、generation、new effect key | runner startup + run freeze | 参数无效拒绝 job |
| safe read / boundary | defaults、file、env、entry-local read selector | visibility / actor / metadata override、raw diagnostic | startup + current entry | 非法 limit reject；safe boundary 不可放宽 |
| security / redaction | safe defaults、file、env selector | raw secret、hot relax、forbidden allowlist、`deterministic_fixture.*` 覆盖 | startup 冻结；只可收紧 | invalid deny list fail-closed |
| clock / id / `deterministic_fixture` | defaults、file、env；`ci-test` / `operations-replay` 可提供 fixture / replay input | handler/domain synthesis、`local-dev` / `integration-like` / future profile fixture | startup；fixture 仅 test-entry 或 replay job-run-start | incompatible mode fail-fast |

### 7.3 冲突处理表

| 冲突场景 | 处理规则 | 阻断范围 |
|---|---|---|
| 同一 key 出现在 defaults、file、env | env 覆盖 file，file 覆盖 defaults；保留来源摘要 | 不阻断，除非最终值非法 |
| 同一 key 在文件中重复 | 视为歧义，不采用“最后值” | 阻断启动 |
| 同语义 alias key 并存 | 视为 schema 冲突，要求迁移或删除 alias | 阻断启动 |
| 高优先级值类型 / 范围非法 | 不回退低优先级，直接 fail-fast | 阻断启动或当前 job |
| 必填 startup key 缺失 | 不用旧缓存或 sibling 状态猜测 | 阻断启动 |
| 必填 job-run-start 参数缺失 | 不使用全局默认覆盖请求缺口 | 仅阻断当前 job |
| entry-local file 与 stdin 同时提供 | 二选一；同时提供且不一致则拒绝 | 仅阻断当前 entry |
| feature disabled 且 target 缺失 | 保持 disabled，记录 safe config issue | 不阻断启动 |
| feature enabled 且 target / adapter 缺失 | 不自动降级到 fake positive | 阻断启动或当前 job |
| ordinary source 提供 raw secret / body | 直接拒绝配置 | 阻断启动 |
| `deterministic_fixture.*` 出现在 `ci-test` / `operations-replay` 之外 | 拒绝 profile | 阻断启动 |
| env 试图关闭 metadata / redaction / idempotency | 视为禁止配置项冲突 | 阻断启动 |
| idempotency retention 小于重投递 / commit-unknown 窗口 | cross-field validation fail-fast | 阻断启动 |
| Core/Bus route 与 topic-neutral key 不一致 | 保持 candidate / blocked，不猜 route | 阻断 publication |

### 7.4 来源解析图

#### 来源解析图：L2-member-service 普通配置与局部参数

```text
[defaults] --> [JSON file] --> [environment override]
      \              |                 /
       \             v                /
        +------ [canonical source set]
                       |
     [entry-local / job-run-start / deterministic fixture]
       (local boundary; never global override)
                       |
                       v
             [parse + type + source conflict]
                       |
                       v
                [validated typed config]
```

关键说明：

- 只有 ordinary source 形成全局覆盖链；局部参数不重写 startup truth。
- secret 只以 opaque ref 参与解析；raw material 不经过该链。
- source resolution 成功不等于外部 adapter、Host Ready 或 handoff Accepted。

### 7.5 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 普通优先级是否唯一 | pass | defaults < file < env |
| entry-local / job-run-start 是否误作全局覆盖 | pass | 明确局部作用域与拒绝条件 |
| secret 是否可被普通来源 raw value 覆盖 | reject | 仅允许 opaque ref；raw body fail-closed |
| alias / duplicate key 是否可静默合并 | reject | duplicate / alias 均 fail-fast |
| disabled target 缺失是否被误判为错误 | pass | 允许缺失但需保留 disabled marker |
| enabled target 缺失是否静默 fallback | reject | fail-fast / job rejected |
| `deterministic_fixture.*` 是否可进入非 `ci-test` / `operations-replay` profile | reject | profile validation fail-fast |
| remote config / admin override 是否被隐式启用 | reject | P0 unsupported source |
| 不同域不可用策略是否一致 | pass | startup fail-fast、操作级 rejected、外围 degraded、危险动作 fail-closed |

## 8. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 固定 defaults < file < env 普通来源顺序 | 否 | 配置来源语义 | 不适用 | 无回写 |
| entry-local / job-run-start / `deterministic_fixture.*` 不参与全局覆盖 | 否 | 承接既有 entry / job boundary | 不适用 | 无回写 |
| raw secret、raw body 和 forbidden value 直接拒绝 | 否 | 复用既有 redaction / forbidden-body 约束 | 不适用 | 无回写 |
| P0 不启用 config center / admin override | 否 | unsupported source boundary | 不适用 | 无回写 |
| 未来引入 remote source、在线覆盖、签名、LKG 或动态 reload | 是 | source protocol、builder、audit、rollback、error / flow | `03` §4、§13~§15 | 阻塞待确认（当前不进入 P0） |
| 通过来源覆盖状态、actor、scope、idempotency 或 handoff 层级 | 是 | 破坏详细设计不变量 | `03` §7、§9~§14 | 设计拒绝 |

## 9. 回填草稿：正式 `04-配置设计.md` §5

> 校准来源：
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读：
> - 建议阅读本文件的“来源优先级表”“配置域来源覆盖表”“冲突处理表”“来源解析图”和“跨来源冲突审计表”。

正式 §5 应写入：

1. 普通来源唯一顺序 `code defaults < strict JSON file < environment variables`。
2. entry-local、job-run-start 和 `deterministic_fixture.*` 是局部来源，不参与全局覆盖；后者仅限 `ci-test` / `operations-replay`，`local-dev` 只用普通 fake / placeholder，`integration-like` 只用 controlled seam。
3. opaque secret reference 可由普通来源提供，raw secret / body / endpoint secret 一律拒绝。
4. duplicate key、alias、非法高优先级值、enabled target 缺失和禁止项覆盖均 fail-fast 或拒绝当前操作。
5. config center / admin override 在 P0 unsupported；未闭合外部 seam 只能 blocked / unknown / disabled。

## 10. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 是否采用 remote config center | 影响 source priority、签名、audit 和 rollback | P0 unsupported，拒绝对应来源 |
| 是否允许 audited admin override | 影响 actor、权限、回滚和 `03` builder | P0 不读取，不创建 override key |
| secret provider 的确切 API / ref scheme | 影响 sensitive loading 和 health | 只定义 opaque ref；provider pending |
| Core/Bus route / envelope / receipt | 影响 publication source binding | 保持 topic-neutral candidate / fake |

## 11. 进入下一步条件与自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 普通来源优先级唯一 | pass | defaults < file < env |
| 每域允许 / 禁止来源和不可用策略明确 | pass | 见 §7.2 |
| duplicate / alias / 高优先级非法值可判定 | pass | 见 §7.3 |
| sensitive raw body 与 fixture 越界已拒绝 | pass | fail-fast / profile reject |
| remote / admin 未伪装 P0 ready | pass_with_upstream_blockers | unsupported / pending |
| `03` 影响已判定 | pass | 当前 P0 无回写 |
| 正式正文污染检查 | pass | 未创建正式 `04` |
| 下一门禁 | pass_with_upstream_blockers | 允许进入 Step 6 环境、profile 与矩阵 |

## 12. Step 5 停审结论

```text
step_05_status = completed / pass_with_upstream_blockers
step_05_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_06_environment_profiles_matrix
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
