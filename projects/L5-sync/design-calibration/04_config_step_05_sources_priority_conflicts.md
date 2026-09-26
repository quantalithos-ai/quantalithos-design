# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5。
> 回填章节：未来正式 `04-配置设计.md` §5「配置来源、优先级与冲突处理」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `5 / sources_priority_conflicts` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～4 均 `pass_with_upstream_blockers` |
| 正式 04 写入 | `false`；Step 15 前不得创建 |
| 允许的下一动作 | `enter_step_06_environment_profiles_matrix` |
| 实现 / 测试 / commit | `false / false / false` |

本 Step 收敛的是来源语义和冲突判定，不是物理文件路径、环境变量名、secret 产品或实现代码。`SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 继续保持真实状态；来源声明不能把 ref、日志、ACK、cache、fake 或默认值升级成 `bound`、授权或 readiness。

## 2. 本步目标与输入

本 Step 在 Step 3 的控制面和 Step 4 的分类边界上，固定普通配置候选的覆盖顺序、敏感 ref 的隔离、重复/非法/不可用来源的处理，以及逐域的允许/禁止来源。最终 raw key、默认数值、环境矩阵和 secret 轮换仍留给后续 Step。

| 输入 | 权威级别 | 本 Step 采用内容 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 当前 04 校准输入 | 单一 strict candidate、配置读取/装配入口、11 个配置域 |
| `04_config_step_04_categories_boundaries.md` | 当前 04 校准输入 | startup/cold、job-run-start、entry-local、ref-only、test-only 和禁止配置化边界 |
| `03-详细设计.md` §13～§15 | 当前正式直接输入 | raw `unknown`→validated config、无隐式 operational default、四态 capability、snapshot 与 redaction 规则 |
| `03_ddd_step_14_config_dependencies.md` §6～§16 | 当前详细设计中间产物 | 42 个 code-level leaf、source/precedence 留给 04、binding failure 和 hard-boundary reject |
| `00/01/02` 当前正式文档 | 当前正式上游 | 显式选择、ownership、non-overwrite、unknown、review/provenance 红线 |
| 专项上游当前正式文档 | owner/binding 语境 | 只确认 opaque ref、secret 和 blocker 的处理，不导入私有 source priority |
| `L1-governance` 04 Step 5 | 框架参考 | 参考来源表、冲突表、逐域停审和跨来源审计结构，不继承 Governance truth |
| README、旧 05/06、draft | `historical_material / direction_only` | 仅污染审计；不提供当前配置 source、default 或 override 事实 |

## 3. SOP 问题回答

### 3.1 普通配置来源的优先级是什么？

在“来源解析”阶段允许多个来源形成候选；在“解析完成”阶段必须得到**恰好一个** strict JSON candidate，再由 `src/config/load_runtime_config.ts` 返回 raw `unknown`。P0 普通 leaf 的覆盖顺序固定为：

```text
[schema / hard-boundary rules]       # 规则，不是值来源
  -> [approved code-declared default] # 仅限 Step 7 明确 default_allowed 的 leaf
  -> [selected strict JSON document]
  -> [allowlisted environment override]
  -> [one resolved strict JSON candidate]
```

`code-declared default` 是最低优先级的候选来源，不代表当前已有 operational default。03 已明确所有数值和 adapter ref 没有隐式默认；在 Step 7 未明确 `default_allowed` 前，缺失 leaf 仍是缺失，不可用 `0`、无限、空 ref 或历史数字代替。

以下来源不参与普通 leaf 覆盖链：

- `entry-local parameter` 只用于显式选择当前 candidate/profile 或已有协议允许的当前请求输入，不覆盖全局 config、权限、state、scope 或安全门禁；
- `secret/provider resolution` 只把 opaque ref 解析到调用上下文，raw material 不进入 candidate 或优先级链；
- `test fixture / deterministic override` 只存在于显式 test composition，不能覆盖 production-like candidate；
- config center、admin override、hot reload 在本轮 P0 中是 unsupported，出现即拒绝；
- `AdapterCapabilitySnapshot` 是 composition 生成的事实载体，不是可被 source 覆盖的配置。

### 3.2 同名、多处、别名和高优先级非法值如何处理？

- 不同普通来源出现同一 canonical key 时，正常使用上述覆盖顺序；覆盖只发生在允许 override 的 leaf。
- 同一 source 内重复 key、同一语义的 alias key 并存、大小写/路径规范化后碰撞，均视为歧义，whole-candidate reject。
- 高优先级值只要“存在但非法”（类型、格式、正数、单位、交叉字段或 hard-boundary），必须 fail-fast；不得退回文件或 code default。
- unknown key、禁止字段、raw secret/body、任意 command/remote/merge 开关均 reject；不得忽略或降级为 warning。
- profile selector、entry-local selector 与 candidate 内显式 `profileRef` 不一致时，若该 selector 不是 03 已有协议输入，则 reject；不能静默覆盖。

### 3.3 必填缺失时是否阻断？

缺失策略按生效边界分层：

| 层级 | 缺失行为 |
|---|---|
| candidate parse/type/hard-boundary 所需项 | startup fail-fast；不构造 `ValidatedSyncRuntimeConfig` |
| Step 7 标为 required 的 startup leaf | startup fail-fast；不回退低优先级或隐式默认 |
| 合法但 optional 的外围 `operations` slot | 可保持 `null`/未注册；不产生 positive capability |
| 语法合法但 adapter/provider/ref 无法解析 | 依 03 语义分类为 `blocked` 或 `unknown`；需要该 capability 的 route 被拒绝，不能 fake fallback；若 profile 要求其为启动必备，则 startup fail-fast |
| job-run-start 所需 job budget / explicit input | 当前 job rejected；不扩大 scope、不生成 key |
| entry-local explicit selection/target/path | 当前 entry rejected；不猜 latest/default |

### 3.4 配置文件、环境和密钥系统不可用时如何处理？

- 未声明的低优先级 source 可以不存在；不存在不等于错误，最终由 required/default 规则判定。
- 被显式选择或声明的 JSON document 若不可读、解析失败、重复 key 或不是严格 JSON，fail-fast。
- allowlisted environment source 缺失可回退低优先级；环境值存在但不可读取或非法，fail-fast，不回退。
- opaque credential/provider ref 的格式错误属于 config validation failure；resolver 不可用或合同未闭合时保持 `blocked/unknown`，不得用缓存、日志、fake、ACK 或默认值证明成功。
- P0 不启用 config center/admin override。候选声明此类 source 直接返回 unsupported-source issue；不得降级到文件或环境而宣称同一候选已生效。

### 3.5 哪些来源不能覆盖敏感配置或禁止边界？

普通 file、environment、entry-local、profile、test fixture 都不得提供 raw token、password、certificate/private key、credential body、endpoint credential、provider payload、文件正文、Git stdout/stderr、evidence/report/verdict/signoff/readiness 或任何禁止配置化字段。普通来源最多提供 opaque ref；ref 也不能覆盖 owner truth、source authority、review accepted、dirty-worktree guard、provenance protection 或 capability availability。

## 4. 来源解析链与唯一候选

```text
[schema + hard-boundary rules]
          |
          v
[approved code defaults, if explicitly allowed later]
          |
          v
[one selected strict JSON document]
          |
          v
[allowlisted environment overlay]
          |
          v
[duplicate / alias / unknown / forbidden scan]
          |
          v
[type + range + cross-field validation]
          |
          v
[ValidatedSyncRuntimeConfig]
          |
          +--> [opaque ref resolution; no raw material in config]
          |
          +--> [capability classification: bound|blocked|unsupported|unknown]
          |
          `--> [new composition + immutable snapshot]
```

链条约束：

1. environment overlay 必须是显式 allowlist 的 canonical leaf；不能通过任意 JSON path、shell fragment、remote/refspec 或 `latest/default` 选择注入隐藏行为。
2. overlay 只在候选解析阶段发生；validated config、runtime snapshot、operation/plan/candidate/attempt 不能再次读取 source 或动态覆盖。
3. source metadata 可以参与 loader 的安全诊断，但 source path、raw document、secret material 和 provider body 不进入 snapshot、`.qs-sync`、status、error 或 diagnostics。
4. candidate 的 canonical identity / `configRef` 由 validated candidate 生成或核验；用户提供的 ref 不得与 canonical content 不一致。
5. source unavailable、invalid 或 unsupported 的处理结果必须可区分；不能把“未声明”“无法读取”“内容非法”“依赖未闭合”压成一个成功状态。

## 5. 配置来源优先级总表

| 来源 | 语义优先级 | 适用范围 | 冲突处理 | 来源不可用时 |
|---|---:|---|---|---|
| schema / hard-boundary rules | 规则层，先于所有值 | 类型、unknown key、forbidden field、redline、交叉约束 | 任何违反均 reject，不可覆盖 | loader/validator fail-fast |
| approved code-declared default | 1（最低值来源） | 仅 Step 7 明确 `default_allowed` 的非敏感 leaf | 被 selected document / env 覆盖；当前多数 leaf 无默认 | 缺失 required leaf 仍 fail-fast |
| selected strict JSON document | 2 | P0 startup/cold candidate 的所有允许 leaf | 重复/alias/非法内容 reject；有效值覆盖 default | 显式选择但不可读/非法→fail-fast |
| allowlisted environment override | 3（最高普通值来源） | 仅允许的 scalar/ref/profile selector leaf | 存在即校验；非法不回退；unknown env key reject 或按 source policy拒绝 | 未声明可回退；读取错误/非法→fail-fast |
| entry-local selector / request | 不属于全局优先级 | 当前 entry 的 explicit profile/source selector 和既有 request fields | 不得覆盖 candidate leaf、禁止边界或 owner truth；不一致→reject | 当前 entry rejected |
| opaque secret/provider ref | 不参与普通优先级 | `credentialProviderRef` 等 ref-only 字段及私有解析 | raw material 一律 reject；ref 仍需独立 capability validation | resolver unavailable→blocked/unknown；必需 route rejected |
| test fixture / deterministic composition | 隔离优先级 | test-only fake/clock/id/store/ref | 不得与 production-like source合并 | fixture 缺失/错配→test composition fail-fast（不产生实现/测试事实） |
| config center | P1/P2；P0 unsupported | 当前无适用 leaf | 出现即 unsupported-source reject | fail-fast |
| admin override | P1/P2；P0 unsupported | 当前无适用 leaf | 出现即 unsupported-source reject | fail-fast |

**默认口径：** Step 5 只确定“默认来源的优先级”；是否某个 leaf 允许默认、默认具体值和是否 required，在 Step 7 逐项收敛。当前不得把任何历史 README、旧 05/06 或示例数字当默认。

## 6. 冲突、重复与不可用处理表

| 场景 | 处理规则 | 阻断范围 |
|---|---|---|
| 同一 canonical key 出现在 default/file/env | env > file > approved default；仅当高优先级值合法时覆盖 | 不阻断；低优先级值不再使用 |
| 高优先级值类型/格式/范围/交叉约束非法 | fail-fast；不得回退 | 启动或当前 entry/job |
| strict JSON 内重复 key | whole-candidate reject | 启动 |
| alias key 与 canonical key 并存 | whole-candidate reject | 启动 |
| unknown key 或未知 capability/forbidden field | reject；不忽略、不 warning | 启动 |
| 显式 profile selector 与 candidate `profileRef` 冲突 | 若非既有 entry selector 语义则 reject；不覆盖 | 当前 entry / 启动 |
| required startup leaf 在所有允许 source 中缺失 | fail-fast | 启动 |
| optional operations slot 缺失 | 保持 null/未注册 | 仅该外围 slot |
| explicit JSON source 不可读/非严格 JSON | fail-fast | 启动 |
| env source 缺失 | 回退低优先级，随后按 required/default 判定 | 不一定阻断 |
| env source declared 但读取错误/值非法 | fail-fast；不回退 | 启动/当前 entry |
| ordinary source 提供 raw secret/token/body | reject config | 启动 |
| secret ref 格式非法 | reject config | 启动 |
| secret/provider resolver unavailable | capability blocked/unknown；必需 route rejected | route 或 profile 要求时启动 |
| config center/admin override 出现 | unsupported-source reject | 启动 |
| test fixture 出现在 production-like profile | reject profile/candidate | 启动 |
| config 声明 auto merge/rebase/push/overwrite/ACK promotion | hard-boundary reject | 启动 |
| metadata/SDK/Git/fs adapter ref 合法但合同/实现未闭合 | snapshot 分类 blocked/unsupported/unknown | 受影响 route；不伪造 bound |
| source conflict 造成无法确定 canonical candidate | no composition/no snapshot | 启动 |

## 7. 按配置域组织的来源覆盖表

“默认”列仅表示优先级位置；除非 Step 7 标为 `default_allowed`，当前实际状态均为“无 operational default”。

| 配置域 | 允许来源 | 禁止来源 / 覆盖 | 唯一优先级 | 不可用策略 |
|---|---|---|---|---|
| `config_identity` | validated candidate canonicalization；显式 opaque `configRef` 仅用于核验 | raw document/path/secret/body 直接进入 identity；entry-local 改写 identity | canonical generated identity > candidate ref assertion | identity mismatch/无法生成→startup fail-fast |
| `profile_context` | strict JSON candidate、allowlisted env selector、受限 entry-local selector、test fixture（test-only） | profile 通过 env/flag 隐式选择 Project/version/source/target；P0 config center/admin | 当前 entry selector（仅选择） > env selector > candidate/file profile > approved default（若后续允许） | unsupported/mismatched profile→reject；不默默切换 |
| `boundary_limits` | strict JSON、allowlisted env scalar、approved default（待 Step 7） | arbitrary entry override、无限/零、dirty/path/lock bypass | env > JSON > approved default | invalid/missing required→startup fail-fast；不 clamp |
| `execution_budgets` | strict JSON、allowlisted env scalar、approved default（待 Step 7） | generic retry/timeout-as-not-happened、entry 改写 effect semantics | env > JSON > approved default | invalid/missing→startup fail-fast；timeout沿 03 映射 unknown/unavailable |
| `job_budgets` | strict JSON、allowlisted env scalar、approved default（待 Step 7）；新 run 只 pin已验证值 | job 输入扩大 scope、mid-run override、schedule/daemon source | env > JSON > approved default；run-start 只冻结，不再覆盖 | invalid/missing→current job rejected；不生成 scope/key |
| `metadata_bindings` | strict JSON opaque refs、allowlisted env refs、approved default（若后续允许）、test ref（test-only） | physical schema/body、cache authority、hot replacement、production fake | env ref > JSON ref > approved default | malformed→startup reject；合同未闭合→blocked/unknown，mutation 不构造 |
| `sdk_bindings` | strict JSON opaque refs、allowlisted env refs、credential ref、approved default（若后续允许）、test negative fake | raw token/provider body、private endpoint/method/DTO、local owner override | env ref > JSON ref > approved default；credential 只独立解析 | malformed→reject；SDK contract/secret resolver blocked→affected route blocked/unknown |
| `local_tool_bindings` | strict JSON typed adapter/root-policy refs、allowlisted env refs、approved default（若后续允许）、test negative fake | arbitrary argv/shell/remote/refspec/merge strategy、hot executable swap | env ref > JSON ref > approved default | malformed/unsafe root→reject；tool contract unknown→blocked/unsupported |
| `support_bindings` | strict JSON refs、allowlisted env safe selector、approved default（仅安全 provider）、test deterministic ref | raw secret/output、hot redaction relax、free-form labels | env > JSON > approved default；test 仅 test composition | unsafe redaction/provider→startup reject；sink unavailable只隔离诊断，不改业务 result |
| `operations_bindings` | strict JSON nullable refs、allowlisted env refs、test-only refs | env/entry 开启隐式 consumer action、topic/schema/schedule/daemon | env > JSON > approved default(null)；formal registration再做 capability check | absent→null/未注册；invalid→reject；合同未闭合→blocked |
| `capability_snapshot_context` | 仅由 validated composition 生成；test composition 可显式构造 test snapshot | 任意 raw source、entry override、手工 `bound`/health/readiness、snapshot rewrite | composition result only；无 source fallback | binding 分类不完整/冲突→no composition/no snapshot |

### 7.1 来源与 owner 的分层规则

1. 普通 source 只决定本地 runtime config candidate；不会决定 Project、Artifact、Baseline、Workspace projection、Archive、Review Gate/Decision 或 Git remote 的 owner truth。
2. `credentialProviderRef`、`AllowedTargetRootPolicyRef`、SDK profile 等 ref 的值可由普通 source 提供，但私有材料、权限结论和 capability outcome 不参加普通 precedence。
3. 合法 ref 仅表示“有绑定意图”；`bound` 必须由 03 规定的 constructor/static validation 和 capability classification 产生，且不能由高优先级 env 强行覆盖。
4. source unavailable 与 adapter unavailable 分层：前者阻断候选解析，后者保留 typed `blocked/unsupported/unknown`，除非该 profile/route 将其列为启动必备。

## 8. 来源优先级逐域停审记录

| 配置域 / 来源 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ordinary default/file/env chain | 覆盖顺序是否唯一、非法高优先级是否回退 | 通过（带 blocker） | `default < JSON document < allowlisted env`；实际 default 留 Step 7 |
| `config_identity` / `profile_context` | selector 是否会隐式改写业务选择 | 通过（带 blocker） | selector 仅选 candidate/profile；显式冲突 reject |
| limits / execution / jobs | 数值来源、job pin、timeout 语义是否一致 | 通过（带 blocker） | 不 clamp、不生成 retry/schedule；数值留 Step 7 |
| metadata binding | ref source 是否偷渡 physical truth 或 cache | 通过（`SYNC-UP-006`） | logical ref only；合同未闭合保持 blocked |
| SDK binding / secret ref | raw secret 是否进入普通链、owner 是否本地化 | 通过（`SYNC-UP-001~005/008`） | ref-only；provider unavailable 不 fake |
| local tools | env 是否能提供任意命令/remote/merge | 通过（`SYNC-UP-007/009/010`、`SYNC-LOCAL-*`） | typed adapter/root-policy ref only |
| support/redaction | 高优先级 source 是否能放宽 redaction | 通过（带 blocker） | unsafe rule reject；sink failure 隔离 |
| operations | nullable ref 是否被当作自动注册/调度 | 通过（consumer/job blocker） | absent/null 不报 readiness，formal contract 后才注册 |
| capability snapshot | source 是否能手工 promotion 或重写历史 | 通过（带 blocker） | composition-only exact result；无 source fallback |
| config center/admin/test fixture | P0 source boundary 是否漂移 | 通过 | remote/admin unsupported；fixture test-only |

逐域停审结论：每个域均有允许来源、禁止来源、唯一优先级和不可用策略；普通 source、secret resolution、adapter capability 和 snapshot 事实没有混层。

## 9. 跨来源冲突审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 普通 source 覆盖顺序是否唯一 | 通过 | `approved default < selected JSON < allowlisted env` |
| 高优先级非法值是否可能 silent fallback | 无 | 存在即 fail-fast |
| strict JSON 重复/alias/unknown key 是否可判定 | 可判定 | whole-candidate reject |
| secret raw value 是否可被 file/env/entry 覆盖 | 不可 | raw material 永远 reject；只允许 opaque ref |
| entry-local 是否能改变全局 config / actor / scope / state | 不可 | 仅显式当前 entry selector/request；继续走 03 guards |
| config center/admin override 是否混入 P0 | 无 | unsupported-source reject |
| test fixture 是否进入 production-like | 不可 | profile/candidate reject |
| optional operations 缺失和 required metadata 缺失是否混淆 | 无 | operations 可 null；基础 mutation capability 缺失则 blocked/no graph |
| source unavailable 与 adapter unavailable 是否混淆 | 无 | source 阶段 fail-fast；adapter 阶段 typed blocked/unknown |
| env 是否能启用历史 LFS/shallow/GUI/Tauri 或 auto Git | 不可 | hard-boundary reject；无 current key |
| source priority 是否定义 owner truth / comparator / review accepted | 不可 | 这些是 static design/upstream owner boundary |
| 是否需要回写 `03` | 未发现 | 当前只收敛来源语义；远程/admin/hot reload 若未来需要必须回流 03 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通值来源顺序固定为 approved default → selected strict JSON → allowlisted environment | 否 | 04 source semantics over existing raw loader seam | 不适用 | `无回写` |
| 高优先级非法值 fail-fast，不回退低优先级 | 否 | validation/failure detail of existing loader | 不适用 | `无回写` |
| secret/provider 只承载 opaque ref，raw material 不参加 precedence | 否 | 承接 03 ref-only/redaction invariant | 不适用 | `无回写` |
| source unavailable 与 adapter unavailable 分层；后者保留 blocked/unknown | 否 | 承接四态 capability and composition | 不适用 | `无回写` |
| P0 不启用 config center/admin override，entry-local 不覆盖全局 config | 否 | 范围和 boundary clarification | 不适用 | `无回写` |
| 若未来新增 remote/admin/hot source、generic override 或 source-driven runtime reload | 是（未来触发） | 会改变 loader/validator/composition/audit/rollback contract | `03` §4/§13/Step 14 | `当前不触发；变更前必须回流` |

当前计数：`待回写=0`；`阻塞待确认=0`。上游 blocker 仍影响 binding/capability outcome，不影响本 Step 的 source-control plane 结论。

## 11. 回填草稿（未来正式 §5）

正式 `04-配置设计.md` §5 应回填本文件的来源解析链、来源优先级总表、冲突/不可用处理表、逐域来源覆盖表、停审记录、跨来源审计和 03 影响判定。

必须保留的正式口径：

- 解析后恰好一个 strict JSON candidate；普通值按 `approved default < selected JSON < allowlisted environment` 覆盖。
- “approved default” 只是来源位置；具体 leaf 是否有默认和默认值必须由 Step 7 明确，当前不继承历史数字或隐式无限/零。
- 高优先级值非法不回退；重复 key、alias、unknown key、forbidden field 和 unsupported source whole-candidate reject。
- entry-local 只选择当前入口语境或承载既有显式请求，不覆盖全局 config、owner truth、安全门禁或 state/transaction/idempotency 规则。
- secret/provider 只使用 opaque ref；raw secret/body/provider payload 永不进入 candidate、snapshot、`.qs-sync`、status、diagnostics 或 error。
- source unavailable、adapter unavailable、unsupported 和 unknown 必须保持不同姿态；不能用 fake/cache/ACK/log/default 抹平 blocker。

本节不写具体 key/env 名、文件路径、数值、secret provider API、部署命令或测试结果。

## 12. 待确认事项

| 事项 | 影响 | 当前姿态 | 归属 |
|---|---|---|---|
| 哪些 42 leaf 允许 code default、哪些 required、具体数值 | Step 7 配置项表和 Step 9 validation | 当前全部按“无隐式 operational default”处理；未标 `default_allowed` 不回退 | 04 Step 7 |
| strict JSON candidate 的物理文件/读取 API 与 env canonical key | 实现入口和部署运维 | 本 Step 只固定语义 source/priority，不创建路径或命令 | 04 Step 7/09、07/运维 |
| local/CI/integration-like/production-like profile 的 source 组合 | profile-specific source availability | 当前不声明实例；Step 6 矩阵收敛 | 04 Step 6 |
| secret/provider resolver 的真实可用性和轮换 | SDK/target binding | 仅 ref-only；resolver unavailable→blocked/unknown | 上游/04 Step 8 |
| `.qs-sync`、SDK、Git/fs 的真实 adapter registry | positive capability | source 可合法存在，但 adapter 仍 blocked/unknown | `SYNC-UP-001~010`、07 |
| 是否未来启用 remote config/admin/hot reload | 新 loader/lifecycle/audit contract | P0 unsupported；需先回流 03 | 未来需求/03/04 Step 13/14 |

这些事项属于后续收敛或上游 blocker，不构成当前 Step 的“阻塞待确认”；本 Step 可进入 Step 6。

## 13. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 普通 source 覆盖顺序唯一且与 Step 3/4 一致 | pass |
| 解析后恰好一个 strict JSON candidate | pass |
| default 位置已定义但未伪造具体 operational default | pass |
| 高优先级非法值、重复/alias/unknown/forbidden source 可判定 | pass |
| secret/ref-only、entry-local、test-only、remote/admin source 边界清楚 | pass |
| 每个 Step 3 配置域均有允许/禁止来源、优先级和不可用策略 | pass |
| source unavailable 与 adapter unavailable 分层 | pass |
| 跨来源冲突、secret 覆盖、profile 漂移、P1/P2 污染 P0 已审计 | pass |
| 03 影响判定无待回写、无阻塞待确认 | pass |
| 未创建正式 04、未创建 Step 6 以后的文件、未实现/测试/提交 | pass |

### Step 5 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_06_environment_profiles_matrix.md`。正式 `04-配置设计.md` 仍保持不存在，直到 Step 15。
