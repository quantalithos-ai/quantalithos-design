# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节：`04-配置设计.md` §11 失效模式与降级 / fail-fast 策略
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 11：定义失效模式与降级 / fail-fast 策略 |
| 输入 | Step 5 来源 / 冲突、Step 7 配置项、Step 8 secret、Step 9 加载 / 生效、Step 10 变更 / 回滚 |
| 输出 | 失效模式表、影响范围、系统行为、告警方向、测试切口、跨失败审计和 §11 回填草稿 |
| 当前状态 | 已完成；允许进入 Step 12 |
| 总体原则 | 关键 local mutation 配置缺失或非法时 fail-fast / no-write；external / optional seam 不可用时 fail-closed 或 degraded，并显式保留 `Blocked`、`Waiting`、`Unknown`、`Stale`、`Gap` |
| 禁止事项 | 高风险失败不得 silent fallback；不得以 fake、旧值、字符串、当前 truth 或配置默认伪造 external success / readiness |
| 持续 blocker | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-005` 继续开放 |

## 2. 本步目标与执行边界

本 Step 让每个配置失败都能映射到明确的本地行为，尤其保护双锚、truth owner、UoW/CAS、typed replay、Query no-write 和 unknown-side-effect fence。告警列只表示应提供的诊断方向，不表示已经接入监控后端或产生告警证据。

本 Step 不定义具体阈值、pager、dashboard、SLO、部署命令或测试执行结果；这些分别由 09 运维材料、05 测试方案和 06 验收标准承接。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 必填配置缺失时怎么办？ | profile、local truth / UoW、idempotency / result、Clock / ID / digest 缺失时 fail-fast；不暴露可写 facade，不创建 reservation、fact 或 partial object。 |
| 类型 / 范围 / 交叉字段错误时怎么办？ | 在 `infra/config.rs` 拒绝 snapshot；高优先级非法值不回退低优先级值；entry / job 局部值拒绝当前 entry / invocation。 |
| secret / provider 不可用时怎么办？ | 需要该 slot 的 critical operation fail-fast；可选 owner / handoff slot 返回 blocked / waiting / not-available；不使用 raw file / env / fake fallback。 |
| 外部 config center 不可达怎么办？ | P0 不支持 config center；相关输入直接 reject，不保留隐式 online LKG。普通文件 / env 不可读也不得被旧值静默替代。 |
| 配置漂移 / 过期如何处理？ | 通过 source / ref fingerprint、expiry / permission 校验和 safe diagnostic 发现；关键 slot fail-fast，外围 slot degraded / blocked；不自动改变 business truth。 |
| 如何处理 external Unknown？ | 保留 local attempt / gap / Unknown，禁止盲重试和假回滚；由 Operations Job / reconciliation 的 planned seam 继续处理。 |
| Query / projection 失效怎么办？ | Query 只返回 safe stale / not-ready / unavailable；不触发 refresh、rebuild、reconcile 或写 truth。 |
| 是否影响 03？ | 当前不影响；这里只定义失效映射。若引入新 error variant、recovery Port 或 flow，必须先回写 03。 |

## 4. 失效模式总表

| 失效模式 | 影响 | 系统行为 | 是否告警（方向） | 测试切口 |
|---|---|---|---|---|
| profile 缺失 / 未知 | 无法确定 composition | 启动 fail-fast，输出 redacted issue；不加载默认 production profile | 是，config validation | profile missing / unknown |
| JSON 文件不可读 / 非法 JSON | 全部配置 snapshot 不可信 | 启动 fail-fast；不回退旧文件或 env | 是，source failure | unreadable / malformed file |
| duplicate key / alias 冲突 | 同一语义多值 | parse reject；不选最后值 | 是，schema conflict | duplicate / alias negative |
| allowlisted env 非法 | 高优先级值不可信 | fail-fast；不回退 file / default | 是，env validation | high-priority invalid |
| unknown key / 未 allowlist env | 可能是拼写或越权配置 | strict mode reject；无关命名空间不消费 | 是，unknown source | unknown key / env |
| required truth Store 缺失 | mutation lane 无 truth | 不暴露写 facade；Query 可安全 unavailable | 是，mandatory slot | no-write on missing store |
| UoW / CAS carrier 不可用 | 一致性无法证明 | fail-closed；拒绝 mutation | 是，consistency dependency | missing UoW / version conflict |
| idempotency / typed result Store 缺失 | duplicate / replay 不闭合 | 不 reserve、不 mutation；返回 safe blocked / dependency unavailable | 是，replay carrier | missing carrier / duplicate |
| Clock / ID / digest slot 缺失 | 无法构造合法对象 / digest | fail-fast；不生成 partial object 或第二 ID | 是，technical slot | missing technical adapter |
| support / resolver ref 缺失 | external context 不可解析 | `Blocked` / `Waiting` / `NotAvailable`；不保存 foreign body | 是，owner seam | owner missing / blocked |
| host / Runtime handoff unavailable | 外部交接无法证明 | 保存允许的 local attempt / gap，返回 blocked / unknown | 是，handoff unavailable | handoff unavailable / unknown |
| publication / observation slot unavailable | 外围交互未交付 | local attempt / gap；不声称 delivered / observed | 是，handoff marker | side-effect fence |
| projection ref 缺失 / watermark 不足 | read surface 不新鲜 | `Stale` / `NotReady` / `NotAvailable`；Query no-write | 是，projection stale | stale / no-write |
| Job runner unavailable | continuation 无法开始 | 拒绝 invocation；已有 report 不重写 | 是，job unavailable | job start failure |
| retry class 与 Unknown / conflict 冲突 | 可能重复副作用 | 不重试；写 safe report / gap | 是，retry fence | unknown / conflict no retry |
| secret ref 过期 / provider 无权限 | adapter 不能安全使用 | critical fail-fast；外围 slot blocked | 是，credential failure | expiry / permission |
| redaction mode 非 strict | 可能泄露材料 | reject snapshot；保留上一 strict snapshot或停止启动 | 是，security critical | redaction bypass |
| metric label 变成高基数 | telemetry 泄露 / cardinality 风险 | reject config；继续 low-cardinality posture | 是，telemetry safety | label negative |
| test fixture 出现在 production-like | fake 被误当真实 | builder reject；不启动 | 是，profile mismatch | fixture contamination |
| config provenance fingerprint 漂移 | 运行配置与预期不一致 | 关键 slot 重新校验；必要时 fail-fast / degraded | 是，drift | drift detection |
| secret provider / future config center 不可达 | 无法读取受控材料 | provider slot fail-fast / blocked；P0 不使用 center | 是，source unavailable | provider unavailable |
| `publication_blocked` 非空 | 试图激活未闭合事件 | config reject；24 candidate 保持 blocked | 是，design violation | non-empty publication config |
| external owner contract pending | 正向激活无依据 | 保持 blocked / waiting / unknown | 是，upstream blocker | blocked seam parity |

## 5. 失效策略分类

| 策略 | 本项目适用 | 允许的结果 | 禁止的结果 |
|---|---|---|---|
| `fail-fast` | profile、required Store / UoW / replay / technical、非法高优先级值、unsafe redaction | 阻止启动或阻止 mutation / invocation | 回退低优先级非法值、partial Ready |
| `fail-closed` | owner / policy / subject / body-free / unknown / authorization 相关前置 | 保守拒绝、Blocked / Unknown | default-pass、关闭 guard |
| `degraded` | optional projection、handoff、observation、external export、非核心 read surface | 有限安全 view、marker、report、NotAvailable | 改写 local truth、声称 external success |
| `stale` | projection / mirror 未达 committed watermark | 明确 Stale / NotReady | 以旧值标 current |
| `gap` | continuation / handoff / observation 未闭合 | 保存 local gap / reason | 盲重试或删除 gap |
| `reject-new-value` | reload 请求、entry-local / job-local 非法值、unsafe redaction | 保留当前已验证 snapshot | 运行中替换策略 |
| `default-fallback` | 仅非关键、结构性 safe default，如 strict redaction / deterministic single | 有限安全默认 | 用 default 补 external owner / credential / truth |

## 6. 按配置域的失败行为

| 配置域 | 关键失败 | 启动行为 | 运行 / 操作行为 | 安全输出 |
|---|---|---|---|---|
| `composition` | profile / source / provenance 错误 | fail-fast | 不产生 runtime | redacted issue |
| `stores.truth` | truth Store / UoW 不可用 | fail-fast 或不暴露写 lane | mutation blocked / no-write | store kind + issue ref |
| `stores.support` / `projection` | support / projection 不可用 | 允许 local composition | blocked / stale / not-ready | safe state only |
| `stores.continuation` | attempt / gap Store 不可用 | 允许核心 local lane（若不依赖） | handoff continuation blocked | gap / dependency marker |
| `stores.idempotency` / `result` | replay carrier 不可用 | fail-fast for mutation | no reserve / no mutation | safe replay issue |
| `technical` | Clock / ID / digest unavailable | fail-fast | 不构造对象 / reservation | technical slot only |
| command / query boundary | bound / metadata policy 错误 | fail-fast | reject entry；Query safe error | no raw body |
| `consumer` | source / dedup / envelope invalid | local runtime 可启动 | reject envelope / blocked receipt | safe disposition |
| `projection` | watermark / target invalid | disabled / stale | Query no-write；Job blocked | stale / report ref |
| `jobs` | runner / retry / timeout invalid | logical registry may be unavailable | reject invocation / report | job kind + safe issue |
| `resolvers` | owner / scope / provider invalid | slot blocked | blocked / waiting / unknown | owner kind + blocker id |
| `handoff` | target / credential / route ref invalid | slot unavailable | local attempt / gap | no endpoint / body |
| `registry` | logical posture invalid | registry entry unavailable | entry rejects call | logical kind |
| `diagnostics` | redaction / label unsafe | fail-fast / strict fallback | safe fields only | redacted issue |
| `fixtures` | fixture in wrong profile | builder reject | test setup fail | test-only marker |
| `publication_blocked` | any non-empty input | fail-fast | no event path | design violation ref |

## 7. 配置漂移、过期与恢复

1. 对 startup snapshot 记录 source class、module 和 one-way fingerprint；fingerprint 变化不自动等同业务故障，但必须触发重新校验。
2. sensitive ref 过期、权限变化或 owner / scope 不匹配时，停止使用该 slot；不得继续使用未验证的旧材料来制造成功。
3. required local lane 的漂移导致 CAS、replay 或 technical proof 不可用时，进入 fail-fast / no-write；已提交 local history 保持不变。
4. optional external lane 漂移只影响对应 operation / Job，使用 blocked / waiting / stale / gap；不得修改 CP01～CP07 的 truth owner。
5. 发现 config 版本或 profile 与审查记录不一致时，拒绝新 snapshot；回滚只能选 Step 10 定义的 prior verified snapshot。

## 8. 告警与测试承接边界

| 失败类别 | 05 测试输入 | 06 验收门禁输入 | 09 运维输入 |
|---|---|---|---|
| fail-fast | missing / malformed / invalid high-priority / cross-field | required config must block unsafe start | startup error、safe diagnostic、rollback |
| fail-closed | subject / owner / body / unknown / replay | forbidden action must not be accepted | blocked reason、人工处置方向 |
| degraded / stale / gap | unavailable optional slot、projection stale、handoff unknown | safe surface must expose non-positive state | runbook / alert threshold由 09 定义 |
| secret failure | provider unavailable、expiry、permission | no raw secret leakage | provider rotation / access procedure |
| drift | fingerprint / profile mismatch | approved snapshot consistency | drift detection / remediation |
| publication blocker | non-empty candidate config | zero configuration gate | 不创建 publisher / topic / route |

## 9. 失效策略停审记录

| 域 | 关键失败覆盖 | 是否 silent fallback | 状态 / no-write 语义 | 结论 |
|---|---|---:|---|---|
| composition / local stores | 是 | 否 | fail-fast / no-write | 通过 |
| technical / replay | 是 | 否 | fail-fast / blocked | 通过 |
| boundary / Consumer | 是 | 否 | reject / fail-closed | 通过 |
| projection / jobs | 是 | 否 | stale / report / blocked | 通过 |
| resolver / handoff | 是 | 否 | blocked / waiting / unknown / gap | 通过 |
| sensitive / diagnostics | 是 | 否 | provider fail-fast、strict redaction | 通过 |
| fixtures / publication | 是 | 否 | production reject、zero config | 通过 |

## 10. 跨失败模式审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 高风险失败是否 silent fallback | 通过 | required / secret / security / replay 失败均 fail-fast / fail-closed |
| external unavailable 是否误报成功 | 通过 | 只返回 blocked / waiting / unknown / stale / gap |
| Query 是否在 degraded 下写入 | 通过 | no-write；不 refresh / rebuild / reconcile |
| duplicate / Unknown 是否盲重试 | 通过 | exact replay 或 no retry；不重复 mutation |
| config center / online LKG 是否隐式进入 | 通过 | P0 不支持；输入 reject |
| drift / expiry 是否有处理 | 通过 | fingerprint / expiry / permission 校验，关键 slot 停用 |
| fake 是否关闭 blocker | 通过 | test-only fake 不变成 production / integration evidence |
| 24 candidate 是否有失效 fallback | 通过 | non-empty publication config 直接 reject |
| error / alert 是否泄露 secret | 通过 | safe issue / redacted marker only |
| 是否影响 03 代码契约 | 未发现 | 当前仅定义状态映射和安全策略，无回写 |

## 11. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| required local lane fail-fast / no-write | 否 | 承接既有 UoW / replay / technical boundary | `03 §10～§13` 已有 | 无回写 |
| external slot blocked / waiting / unknown / stale / gap | 否 | 承接既有 blocked seam / state | `03 §10～§14` 已有 | 无回写 |
| Query degraded 仍 no-write | 否 | 承接 Query invariant | `03 §5、§9、§13` 已有 | 无回写 |
| drift / expiry 通过 safe diagnostic 和 slot stop 处理 | 否 | 配置失效语义 | `03 §13/§14` 已有 | 无回写 |
| 未来新增 recovery Port、error、state 或 automatic reload flow | 是 | 代码契约变化 | `03 §4～§14` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项；未来触发器不写入正式失效契约。

## 12. 回填草稿：正式 `04-配置设计.md` §11

> 校准来源：
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“失效模式总表”“失效策略分类”“按配置域的失败行为”“配置漂移、过期与恢复”和“跨失败模式审计表”。

正式 §11 应收口为：

1. profile、required local Store / UoW / idempotency / result、Clock / ID / digest、非法高优先级值和 unsafe redaction 采用 fail-fast；不暴露 partial runtime，不回退低优先级非法值。
2. subject、owner、body-free、policy、replay、Unknown 和 external side-effect 前置采用 fail-closed；保持双锚、owner、typed replay 和 unknown fence。
3. optional resolver / handoff / projection / observation / export 依赖不可用时，使用 `Blocked`、`Waiting`、`Unknown`、`Stale`、`Gap`、`NotAvailable` 或 safe report；不声称 host / Runtime / Bus / downstream 成功。
4. Query 在任何 degraded / stale 情况仍 no-write；Job 对 unknown / conflict 不盲重试；external Unknown 不自动假回滚。
5. 配置漂移、过期或 provider 不可达时，关键 slot 停用并输出 redacted issue；P0 不支持 config center / online LKG；`publication_blocked` 非空直接拒绝，24 candidate 保持 zero configuration。

## 13. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| secret provider expiry / permission contract | criticality 与 provider failure | critical fail-fast、外围 blocked |
| external owner health / feedback contract（`L2M-UP-001~006`） | degraded / Unknown 转换 | 只保留 local marker / gap / blocked |
| policy taxonomy（`L2M-UP-007`） | screening fail-closed 细分 | safe result only；unknown 阻断 |
| subject scope（`L2M-UP-008`） | profile / entry failure | project dual anchor only |
| physical Store / scheduler / observability backend | 失效检测与告警落地 | product-neutral；留 07 / 09 |
| workload numeric thresholds | alert / timeout / batch | 本文不设数字，交给 authority |

## 14. 进入 Step 12 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 缺失、错误、不可达、过期、漂移均有处理 | 通过 | §4、§7 |
| fail-fast / fail-closed / degraded / stale / gap 可区分 | 通过 | §5、§6 |
| 高风险失败无 silent fallback | 通过 | §4、§10 |
| Query no-write、Unknown fence、replay 与 truth owner 受保护 | 通过 | §5、§6、§10 |
| 告警 / 测试 / 验收 / 运维承接边界明确 | 通过 | §8 |
| 失效策略停审与跨失败审计完成 | 通过 | §9、§10 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §11 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 11 完成。下一步允许创建 `04_config_step_12_downstream_handoff.md`，明确 05 测试、06 验收、07 实施和 09 运维如何承接配置设计，不生成下游执行事实。

```text
step_11 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_12_downstream_handoff
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
