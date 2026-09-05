# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节：`04-配置设计.md` §5 配置来源、优先级与冲突处理
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 5：定义配置来源、优先级与冲突处理 |
| 输入 | Step 3 来源链、Step 4 分类边界、`03 §13` raw-read / builder 约束 |
| 输出 | 来源优先级表、冲突处理表、配置域来源矩阵、停审记录、跨来源审计、§5 回填草稿 |
| 当前状态 | 已完成；允许进入 Step 6 |
| 普通来源优先级 | `code defaults < strict JSON file < allowlisted environment variables` |
| 敏感材料规则 | secret provider 是受控材料来源，不作为普通值的低优先级 fallback；普通 file / env 只能提供 opaque ref，不能提供 raw secret |
| 未支持来源 | config center、admin override、在线 LKG、通用 CLI override 当前不支持；出现即拒绝或保持 blocked，不静默接入 |

## 2. 本步目标与执行边界

本 Step 固定“同一个配置项由谁覆盖谁”以及来源不可用时的可判定行为，使 Step 7 配置项和 Step 9 loader 能逐项引用。来源规则只作用于允许配置化的项，不能改变 Step 4 的 static-invariant 红线。

本 Step 不定义具体环境文件路径、secret provider 产品、endpoint、部署命令或工单系统。它也不把 entry-local typed input、job invocation metadata、owner feedback 或 external event 当成全局配置来源。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 普通来源优先级是什么？ | 对允许的非敏感配置，严格使用 `code defaults`（最低）→ `strict JSON file` → `allowlisted environment variables`（最高）。同一项不允许存在多个同优先级有效值。 |
| secret 的优先级是什么？ | 普通配置只携带 opaque secret / endpoint / credential ref；真实材料由受控 provider 按 ref 读取。provider 不是用来覆盖普通值的 fallback，provider 不可用时不得回退到 file / env 的 raw 值。 |
| config center / admin override 是否支持？ | 当前 P0 不支持。相关字段、前缀或管理入口不进入 allowlist；若检测到针对本仓的 override，启动 / reload 请求直接拒绝并记录 redacted issue。 |
| 同名配置冲突如何处理？ | 高优先级有效值覆盖低优先级值；但高优先级存在却 parse / type / range / cross-field 非法时必须 fail-fast，不能回退到低优先级有效值。相同优先级重复值、同一 JSON 文件重复键和 alias 冲突均 fail-fast。 |
| 必填项缺失如何处理？ | local write lane 所需 Store、UoW、idempotency / typed-result、Clock / ID / digest 等缺失时 fail-fast 或不暴露可写 facade；可选 external / peripheral slot 缺失时保留 `Blocked` / `Waiting` / `NotAvailable`，不得 default-pass。 |
| 来源不可用如何处理？ | code default 始终可用但仅承载安全结构性默认；JSON file 不可读或非法时 fail-fast；allowlisted env 读取错误时 fail-fast；secret provider 不可达时按 slot criticality fail-fast 或 blocked，不静默降级。 |
| 每个配置域允许哪些来源？ | composition / stores / technical / boundary / registry 允许 default + file + allowlisted env selector；sensitive-ref 允许 ref 来源和 provider material；diagnostic / fixtures 有受限来源；publication candidate 无普通来源。 |
| 来源规则是否改变 03？ | 没有。来源、优先级、冲突和不可用语义仍停留在 04；没有新增 carrier、builder 参数、Port、error、DTO 或 flow。 |

## 4. 当前文档问题诊断

| 材料 | 问题 | 本 Step 处理 |
|---|---|---|
| Step 3 来源链 | 只有覆盖方向预览，未定义优先级 | 固定普通来源顺序和 provenance 规则 |
| Step 4 sensitive-ref | 未区分 ref 与真实 secret 材料 | 明确 ref 走普通来源，raw material 仅由受控 provider 提供 |
| 旧 README / 旧 05/06 | 含 CLI、config center、admin、固定 endpoint 等假设 | 不继承；未支持来源一律拒绝或保持 blocked |
| `L2M-UP-*` external seam | 容易把低优先级默认值当外部成功 | external slot 缺失只形成 blocked / waiting / unavailable |
| 正式 `04` | 尚不存在 | 只产生 §5 回填草稿 |

## 5. 来源优先级总表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用 / 非法时策略 |
|---|---:|---|---|---|
| code defaults | 10（最低） | 非敏感、结构性安全默认、P0 local posture | 被合法 file / env 覆盖 | 代码缺少默认属于设计缺口；不以空值代替 |
| strict JSON file | 20 | 项目本地模块配置、typed scalar、opaque ref | 合法值覆盖 default；重复键 / alias 冲突 fail-fast | 文件缺失、不可读、非法 JSON、schema / cross-field 错误 fail-fast |
| allowlisted environment variables | 30（普通最高） | 允许的 selector、typed scalar、opaque ref；仅显式 allowlist | 合法 env 覆盖 file / default；非法高优先级值不回退 | parse / type / range / cross-field 错误 fail-fast；未允许变量拒绝 |
| controlled secret provider material | 独立受控来源，不参与普通覆盖排序 | provider 返回的 credential / secret material，仅按 opaque ref 使用 | provider 结果不能被普通 file / env 替换 | provider 不可达、ref 无效、过期或权限不足：critical slot fail-fast，外围 slot blocked |
| test-fixture-deterministic source | 仅 test-only | deterministic fake、fixed clock / ID、fixture selector | 只能在 test builder 内覆盖测试 default | 生产 builder 检测到 fixture source 即拒绝 |
| config center / admin override | 不支持 | 无 | 不进入覆盖链 | 检测到相关输入即 reject；不保留 LKG |
| 通用 CLI flag / job metadata / owner feedback | 不属于全局配置来源 | entry-local typed boundary 或业务 carrier 各自按协议处理 | 不覆盖全局配置 | 作为错误的配置来源使用时 reject；保留协议原语 |

来源 provenance 只记录来源类别、模块、版本 / fingerprint 和校验结果；不得记录 raw secret、完整文件内容、endpoint、topic、body 或高基数身份。

## 6. 冲突与缺失处理表

| 冲突 / 失效场景 | 处理规则 | 是否阻断启动 / 操作 | 说明 |
|---|---|---:|---|
| file 与 default 同名且 file 合法 | file 覆盖 default | 否 | provenance 标记 file |
| env 与 file 同名且 env 合法 | env 覆盖 file | 否 | 仅 allowlisted env |
| 高优先级 env 存在但类型 / 范围非法 | 不回退 file / default，fail-fast | 是 | 防止错误值被低优先级掩盖 |
| 同一优先级多个值 | 不选任一值，fail-fast | 是 | 不使用字典序、最后写入或平台顺序 |
| JSON 重复 key / alias 重叠 | parse / schema reject | 是 | 防止同一语义多个名字 |
| 必填 local Store / UoW / replay / technical slot 缺失 | 不暴露写 facade；safe diagnostic | 是（写操作） | Query 可在安全 read surface 上返回 unavailable / stale，不能补写 |
| optional external slot 缺失 | 注入 `BlockedSeamState` / `NotAvailable` | 否（核心 local lane）/ 是（该操作） | 不声明 host / Runtime / Bus / image ready |
| secret ref 存在但 provider 不可达 | critical slot fail-fast；外围 slot blocked | 视 slot | 不使用 raw file / env fallback |
| secret provider 返回过期 / 无权限材料 | reject slot，redacted issue | 是（需要该 slot 的操作） | 不缓存未验证材料为成功 |
| 未 allowlist 的 env 变量 | 本仓 config namespace 内拒绝；无关变量忽略 | 是（若命名空间命中） | 不能通过拼写错误静默运行 |
| config center / admin override 出现 | reject unsupported source | 是 | P0 不支持 online override / LKG |
| test fixture source 出现在 production-like builder | reject | 是 | fake 不关闭 blocker |
| 配置 provenance fingerprint 漂移 | 由 Step 11 定义告警 / fail-closed；不自动改业务 truth | 视影响 | 当前不产生 readiness 结论 |

## 7. 按配置域的来源覆盖矩阵

| 配置域 | 允许来源 | 禁止来源 / 覆盖 | 优先级 | 不可用策略 |
|---|---|---|---|---|
| `composition` | default、JSON、allowlisted env selector | admin、generic CLI、test fixture（生产） | 10 < 20 < 30 | profile 缺失 / 冲突 fail-fast |
| `stores.truth` | default、JSON、allowlisted opaque adapter ref | raw DSN、admin、runtime online override | 10 < 20 < 30 | mandatory local slot fail-fast / no-write |
| `stores.support` / `stores.projection` / `stores.continuation` | default、JSON、allowlisted ref | foreign body、default-pass provider | 10 < 20 < 30 | blocked / stale / gap，按操作拒绝 |
| `stores.idempotency` | default、JSON、allowlisted ref；新 job 可读 retention posture | 关闭 replay、低优先级 fallback 覆盖高优先级非法值 | 10 < 20 < 30 | missing carrier fail-closed |
| `technical` | default、JSON、allowlisted adapter selector；test source 仅 test | domain / handler 自行生成值、admin override | 10 < 20 < 30 | fail-fast，不构造 partial object |
| `command_boundary` / `query_boundary` | default、JSON、allowlisted bounded scalar；entry-local typed limit | policy / authorization override、generic CLI | 10 < 20 < 30 | invalid boundary fail-fast；Query no-write 固定 |
| `consumer` / `projection` | default、JSON、allowlisted posture / ref | local allowlist 代替 owner policy、event body | 10 < 20 < 30 | blocked / stale / not-ready |
| `jobs` | default、JSON、allowlisted bounded runner scalar | scheduler admin override、runtime mutation | 10 < 20 < 30 | job invocation reject；unknown / conflict 不盲重试 |
| `resolvers` / `handoff` | default、JSON、allowlisted opaque ref；secret provider material | generic provider、endpoint raw value、external success flag | 10 < 20 < 30 + provider | blocked / waiting / unknown |
| `registry` | default、JSON、allowlisted logical posture | listener / process / route / health flag | 10 < 20 < 30 | logical entry unavailable；不创建 process |
| `diagnostics` | default、JSON、allowlisted redaction posture；test fixture test-only | debug bypass、admin disable redaction | 10 < 20 < 30 | reject unsafe config；保守输出 |
| `fixtures` | test-only fixture source | file / env in production-like profile | test-only | production builder reject |
| `publication_blocked` | 无普通配置来源；仅 static blocker / redacted diagnostics | 任何 publisher / outbox / topic / route / retry / DLQ input | 不适用 | 24 candidate 保持 zero configuration |

## 8. 来源优先级与 provenance 规则

1. 每个允许配置项只能有一个规范名称；alias 不作为第二合法来源。
2. 解析顺序为 default → file → allowlisted env；每层完成 parse / type / range 后才可进入下一层覆盖。
3. 高优先级层出现非法值时立即失败，绝不回退到低优先级层。
4. 普通来源中出现 raw password、private key、token、完整 DSN 或外部正文时，即使字段名未声明 sensitive，也必须拒绝；不可通过 redaction “接纳”后继续运行。
5. provenance 可用于诊断和审计，但不得被业务层读取，也不得替代 owner / truth / authorization。
6. 受控 secret provider 只接受 opaque ref；provider 的实际读取、轮换、禁止输出在 Step 8 定义。
7. entry-local 和 job-run-start 输入不参加全局覆盖链：它们必须通过各自的 typed boundary / job metadata 校验，不能借此覆盖 startup composition。
8. config center、admin override、online LKG 和通用 CLI override 当前不支持；未来若要引入，必须重新打开 Step 4、9、10、11 并完成安全 / 审计 / 03 影响判定。

## 9. 来源优先级停审记录

| 配置域 / 来源 | 优先级唯一性 | 冲突可判定性 | 敏感覆盖边界 | 不可用策略 | 结论 |
|---|---:|---:|---:|---|---|
| default / JSON / env | 是 | 是 | raw secret 拒绝 | parse / type / range 失败 fail-fast | 通过 |
| secret provider ref | 独立 | 是 | 普通来源不可替代材料 | critical fail-fast / peripheral blocked | 通过 |
| test fixture | test-only | 是 | 不能进入生产 | production reject | 通过 |
| config center / admin | 不适用（未支持） | reject | 不允许 | reject | 通过 |
| entry-local / job metadata | 不参与全局覆盖 | typed boundary 内可判定 | 不能覆盖 composition | 当前 invocation 失败 | 通过 |

## 10. 跨来源冲突审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 普通来源覆盖顺序是否唯一 | 通过 | 固定为 default < file < allowlisted env |
| 高优先级非法值是否会错误回退 | 通过 | 明确 fail-fast，不回退 |
| secret 是否可能被普通来源覆盖 | 通过 | 普通来源仅 opaque ref；provider material 独立受控 |
| 同名 / alias / duplicate key 是否有确定处理 | 通过 | reject，不选任一隐式值 |
| external slot 是否被安全默认伪造成功 | 通过 | missing / unavailable 保留 blocked / waiting / unknown |
| test fixture 是否可能污染生产 profile | 通过 | production builder reject |
| config center / admin / CLI 是否被历史材料带入 | 通过 | 当前不支持，检测即 reject |
| entry-local / job input 是否被误作全局 override | 通过 | 不参加全局来源链 |
| provenance 是否泄露 secret / body / identity | 通过 | 仅 source class、fingerprint 和 redacted issue |
| 是否改变 `03` 代码契约 | 未发现 | 当前只定义来源 / 冲突语义，无 03 回写 |

## 11. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 普通来源固定为 default < JSON file < allowlisted env | 否 | 配置来源 / 优先级语义 | `03` §13 已有 raw-read 边界 | 无回写 |
| secret provider material 与普通来源分离 | 否 | sensitive-ref 处理细化 | `03` §13 / Step 14 已禁止 raw secret | 无回写 |
| 高优先级非法值 fail-fast，不回退低优先级值 | 否 | loader 失效语义 | 不适用 | 无回写 |
| config center / admin / online LKG 当前不支持 | 否 | P0 范围收缩 | Step 4 static boundary | 无回写 |
| 未来引入动态覆盖、通用 CLI 或新来源导致 builder / error / Port / carrier 变化 | 是 | 代码契约或安全边界变化 | `03` §4～§13、Step 14 | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项；未来触发器不写入正式配置项。

## 12. 回填草稿：正式 `04-配置设计.md` §5

> 校准来源：
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“来源优先级总表”“冲突与缺失处理表”“按配置域的来源覆盖矩阵”“来源优先级停审记录”和“跨来源冲突审计表”。

正式 §5 应收口为：

1. 非敏感普通配置采用 `code defaults < strict JSON file < allowlisted environment variables` 的唯一覆盖顺序；同优先级冲突、重复 key、alias 冲突均拒绝。
2. 高优先级来源存在但非法时 fail-fast，不回退低优先级有效值；必填 local lane 缺失时不暴露可写 facade。
3. 普通文件 / 环境只能携带 typed scalar、selector 或 opaque ref；真实 secret / credential material 由受控 provider 按 ref 获取，provider 不可用时按 slot criticality fail-fast 或 blocked，不使用 raw fallback。
4. test fixture 仅用于 test-only builder；config center、admin override、online LKG 和通用 CLI override 当前不支持，不能进入覆盖链。
5. provenance 只保留 source class、module、fingerprint 和 redacted issue；不得输出 raw config、secret、endpoint、topic、body 或高基数身份。

## 13. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| secret provider / credential owner（`L2M-UP-001/002/006`） | sensitive ref 的 provider、轮换与 slot criticality | 只记录 opaque ref；provider 未达成时 critical fail-fast / peripheral blocked |
| `L2M-UP-005` event schema / route | publication 来源是否存在 | 24 candidate 无普通来源，保持 zero configuration |
| profile 未来是否需要 config center / admin override | 影响覆盖链和热更新 | 当前 reject；若提出需求须重新走 Step 4/9/10/11 |
| 物理 Store / scheduler / transport 产品 | 影响 file / env 中 ref 的最终语法 | product-neutral；不写 DSN / endpoint / route |
| `L2M-DDD-001~007` 和 `scope_supersede_gap` | 影响 slot criticality 与实现激活 | 不用 default / fake / low-priority fallback 掩盖 |

## 14. 进入 Step 6 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 来源覆盖顺序唯一 | 通过 | §5、§8 |
| 同名 / 高优先级非法 / duplicate key 冲突可判定 | 通过 | §6 |
| secret raw value 不被普通来源覆盖 | 通过 | §5、§8 |
| 每个配置域允许 / 禁止来源已列 | 通过 | §7 |
| 不可用、缺失、fixture、未支持来源策略明确 | 通过 | §6、§7 |
| 来源优先级停审与跨来源审计完成 | 通过 | §9、§10 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §11 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 5 完成。下一步允许创建 `04_config_step_06_environment_profiles_matrix.md`，定义 local-dev、ci-test、integration-like、operations-replay 及未来 staging-like / production-like 的 profile 语义和配置矩阵。

```text
step_05 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_06_environment_profiles_matrix
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
