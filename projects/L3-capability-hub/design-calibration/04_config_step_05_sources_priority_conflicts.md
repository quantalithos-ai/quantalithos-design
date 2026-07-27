# L3-capability-hub 04 配置设计 Step 5：配置来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §5
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_05_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 `定义配置来源、优先级与冲突处理` |
| 输入基线 | 04 Step 1~4；formal 03 §13；DDD Step 14 config schema；配置设计 SOP/书写规范 |
| 本步产物 | 来源链、bootstrap/content precedence、冲突规则、source availability、CP-01~CP-10 来源覆盖表、审计 |
| 当前结论 | completed；P0 只支持有限 JSON file、bounded environment overlay、symbolic reference 和显式 test fixture source |
| 03 影响 | `无回写`；没有新增 source field、typed field、Port、error、state、flow 或 callable |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 把 Step 3 的来源链变成可判定的来源合同，并把 Step 4 的分类边界落实到每个控制面。重点是区分：

- 用于选择唯一配置文档的 bootstrap selector；
- 用于覆盖允许叶子的 bounded environment overlay；
- 只携带符号名称的 credential/endpoint/feed/route reference；
- 只在 Local/CI 测试边界存在的 deterministic fixture source。

本步不定义具体 raw key、JSON path、环境变量名、数值默认、secret provider API、profile 实值、部署挂载、配置加载实现或产品。具体 key 和默认值留 Step 7；密钥解析和轮换留 Step 8；加载/校验顺序留 Step 9。

## 3. 本步输入

| 输入 | 用途 | 权威边界 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 承接 file/env/ref/fixture 来源预览、唯一 raw reader 和 CP-01~CP-10 | 不新增第二 raw reader |
| `04_config_step_04_categories_boundaries.md` | 承接 startup-only、frozen view、禁止配置化和 P0 无 hot reload | 不引入 per-run reread |
| `03_ddd_step_14_config_external_binding.md` §§13~16、50~64 | exact candidate/root、symbolic ref、binding cardinality、profile restrictions | 不改变 candidate/root 字段 |
| `03-详细设计.md` §13.1~§13.12 | formal 27-row catalog、binding/failure/assembly owner | 不重新定义 Rust 契约 |
| formal `00/01/02` | data/security/dependency/responsibility redlines | 普通 source 不能越权改变上游红线 |
| `配置设计书写规范.md` §4.5、§5.5 | JSON source/precedence 表达规则 | 不以示例替代正式清单 |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么？ | 普通内容来源为 `explicit non-semantic parser constants < JSON document < bounded environment leaf overlay`。CLI 只选择受限 bootstrap selector 或当前 entry 的合法入口，不提供任意 `key=value` overlay。secret raw material 不进入普通优先级链；只有 symbolic ref 参与普通来源解析。config center/admin override 在 P0 为 unsupported source，出现即拒绝。 |
| 同名配置多处出现如何处理？ | JSON 文件内重复 key、同一语义多个 alias、同一 env 语义多个别名、同一个 named slot 被多个 section 声明，均为 ambiguity，fail-fast。JSON 与 env 的合法同名覆盖按固定优先级处理；高优先级值存在但非法时 fail-fast，不回退低优先级。 |
| 必填项缺失是否阻断启动？ | root/profile/entry/local authority/required binding/technical parameter/diagnostic mode 等 startup-required row 缺失阻断启动。选中的 entry 参数缺失阻断该 entry；Disabled slot 不要求 adapter material，但 omitted slot 不是 Disabled。 |
| 配置文件、环境或 secret resolver 不可用如何处理？ | 未指定文件选择器时可使用唯一约定的启动文档位置；显式指定但不可读/解析失败阻断启动。环境字段不存在按 optional/required 语义处理，存在但非法阻断。Configured binding 所需 symbolic ref 无法解析时 runtime assembly fail-fast；Disabled 不解析，DeterministicFake 只解析 fixture。无 fake/default fallback。 |
| 哪些来源不能覆盖敏感配置？ | 普通文件、env、CLI、fixture 都不能承载 raw secret、token、password、private key、certificate body、raw DSN、external body 或 forbidden allowlist。普通来源最多提供受 grammar 约束的 symbolic ref；解析后的 secret 不是 `CapabilityRuntimeConfig` 字段。 |
| 每个配置域适用哪些来源？ | §8.3 给出 CP-01~CP-10 的 allowed source、forbidden source、priority lane 和 unavailable policy。static design boundary 不接受任何 source。 |
| 每个配置域来源优先级是否通过停审？ | 10/10 control planes 通过；每个域只有一个 owner、一个 content precedence、一个不可用策略，未产生 unresolved conflict。 |
| 是否存在 secret 覆盖、同名冲突或不可用策略漂移？ | 跨来源审计为 0 unresolved：raw secret 不进入 config、非法高优先级值不 fallback、P0 不启用 config center/admin override、fixture 不进入 Deployment、entry-local 不覆盖全局 root。 |

## 5. 当前问题诊断

| 位置 | Step 5 前问题 | 本步处置 |
|---|---|---|
| Step 3 来源链 | 只有来源类别，没有 selector 与 content overlay 边界 | 拆出 bootstrap lane 与 content lane |
| Step 4 frozen view | 入口局部参数可能被误解为覆盖层 | 固定 entry-local 只能选择合法入口输入，不能改 root 或禁止项 |
| 03 symbolic refs | ref 不是 URL/topic/secret，但来源优先级未写清 | ref 字符串可由普通来源选择，ref 指向的 material 不进入 root |
| code defaults | 27 rows 均为 required，若写 implicit default 会违背 03 | 只允许 parser constants 和后续显式审计过的 default；required row 无隐式语义默认 |
| CLI | SOP 要求考虑 CLI，但任意 CLI 会绕过 schema | CLI 只做 bounded selector/entry invocation input，不做任意 leaf override |
| fixture | 容易被当成高优先级 fallback | fixture 是 profile/test harness source class，不是 production fallback |
| config center/admin | 未来能力容易提前混入 | P0 unsupported；声明或残留 section 直接 fail-fast |

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 设计目的 |
|---|---|---|---|
| source chain | file/env/ref/fixture 混合描述 | bootstrap selector、JSON content、bounded env overlay、ref resolution、fixture lane 分离 | 避免同一值有多个隐含 owner |
| ordinary precedence | 未固定 | parser constants < JSON < bounded env | 使覆盖顺序可测试、可验收 |
| CLI | 未定义边界 | 不允许任意 key/value；只选择 source/entry-local合法参数 | 防止绕过 typed validation |
| secret | 可能被误看成优先级层 | ref 可覆盖，raw material 永不入普通链 | 保持 secret boundary |
| invalid high-priority value | 未定义 | fail-fast，不回退 | 防止误配置静默隐藏 |
| fixture | 可能成为 fallback | 只在 Local/CI 明确选择 | Deployment fake=0 |
| remote/admin | 尚未关闭 | P0 unsupported source | 保持 startup-only / audit boundary |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决与原因 |
|---|---|---|
| 普通内容优先级 | A. env < file；B. file < env | 采用 B：部署环境的 bounded override 可覆盖文档值，但必须通过同一 typed validator。 |
| 高优先级非法值 | A. 回退低优先级；B. fail-fast | 采用 B：已提供的值代表明确操作意图，静默回退会掩盖错误。 |
| CLI 形态 | A. 任意 key/value；B. bounded selector/input | 采用 B：避免 CLI 形成第二 schema 和未审计 alias。 |
| secret source | A. raw secret 参加 precedence；B. ref 参加、material 外置 | 采用 B：root 和日志都不保留 raw material。 |
| config center/admin | A. P0 动态层；B. unsupported | 采用 B：03 没有动态 reload、原子 graph swap、审计和回滚契约。 |
| fixture precedence | A. 全局最高；B. 独立 test lane | 采用 B：测试材料不能污染 production-like profile。 |
| file selector 缺失 | A. 任意扫描目录；B. 唯一约定位置 | 采用 B：避免多个候选文件产生不可判定 precedence；具体路径由运维文档确认。 |

## 8. 结构化中间产物

### 8.1 来源层次与优先级

| Lane / 来源 | 优先级或作用 | 可承载内容 | 冲突处理 | 不可用策略 |
|---|---|---|---|---|
| design/parser constants | 最低；不是 operator source | supported schema `V1`、fixed compatibility assertion、grammar/bounds | 不能被 source 改成另一算法/版本 | 代码/设计不一致属于实现或设计缺口，不用 runtime fallback |
| bounded bootstrap selector | 仅选择唯一 JSON document/profile/entry invocation | source selector、合法 entry selector；具体名留 Step 7 | 多个 selector 或 selector 与 document root 不一致 -> fail-fast | 显式 selector 不可读/非法 -> startup fail-fast |
| versioned JSON document | ordinary content priority 1 | 27-row typed sections、named slots、refs、numeric leaves | file 内 duplicate/alias/unknown/forbidden -> fail-fast | 未显式选择时使用唯一约定位置；指定文件不可读/解析失败 -> fail-fast |
| bounded environment overlay | ordinary content priority 2 | 经过 allowlist 的 scalar/ref/selector leaves | 合法同语义覆盖 JSON；非法/重复/结构化越权 -> fail-fast | 未设置 optional field按 schema；required field缺失按 row 规则 |
| symbolic ref resolver | 不参与 content precedence | endpoint/credential/feed/actor/route/fixture 的 symbolic resolution result | ref kind 与 slot family 不匹配 -> fail-fast；material 不改 typed root | Configured resolver unavailable -> assembly fail-fast；Disabled 不解析 |
| explicit deterministic fixture lane | 独立 test/local binding lane | fake adapter/clock/id/store/transport fixture refs | 只能在允许 profile 中替换 binding；不能叠加到 Deployment | fixture 缺失/不匹配 -> test or startup fail-fast |
| config center | P0 unsupported | 无 | 任何 section/selector 声明为 unsupported | startup fail-fast |
| admin override | P0 unsupported | 无 | 任何 override marker 声明为 unsupported | startup fail-fast |

### 8.2 Bootstrap selector 与 content overlay 分工

```text
[bounded CLI selector]   [bounded environment selector]
          \                    /
           -> [one selected JSON document]
                    |
                    v
        [duplicate/unknown/forbidden/shape checks]
                    |
       [bounded environment content overlay]
                    |
       [symbolic ref and cross-field resolution]
                    |
       [CapabilityRuntimeConfigCandidate]
                    |
       [closed validation -> immutable root]
```

关键说明：

1. selector 选择文档，不替代文档内容；selector 与文档中的 profile/entry 不一致时拒绝，不以 selector 静默覆盖 root。
2. environment overlay 只能写入 Step 7 明确列出的 allowlist leaf；不能新增 section、array element、named Port、route、Worker source 或 protocol identity。
3. CLI 不支持 `--set arbitrary.path=value`、重复 flag 合并或运行中注入。
4. source resolution 的输出只喂给 `infra/config.rs` / builder；不得穿过 application/domain/contracts。

### 8.3 冲突与不可用处理表

| 场景 | 判定规则 | 结果 |
|---|---|---|
| JSON 内同名 key 重复 | parser 必须保留重复检测，不接受后写覆盖 | startup fail-fast |
| JSON alias 与 canonical key 同时出现 | 同一语义多来源 | startup fail-fast |
| env 同语义多个别名 | alias collision | startup fail-fast |
| JSON 与合法 env leaf 同名 | env 按 bounded overlay 优先 | 继续 typed/cross-field validation |
| env leaf 类型/格式/范围非法 | 值已出现但无效 | startup fail-fast，不回退 JSON |
| env 试图新增 section/array/member | 超出 allowlist | startup fail-fast |
| CLI selector 与 JSON profile/entry 冲突 | selector 不能改 root | startup fail-fast |
| required row 未在有效来源出现 | 无 semantic default | startup fail-fast |
| explicit file path 不可读 | 显式 intent 失败 | startup fail-fast |
| default document 位置不存在 | 无有效 root | startup fail-fast |
| Configured ref 缺失 | enabled binding 不完整 | runtime assembly fail-fast |
| Disabled slot 带 adapter/feed/route material | mutually exclusive shape | startup fail-fast |
| Fake fixture 出现在 Deployment | profile violation | startup fail-fast |
| raw secret 在 file/env/CLI/fixture | forbidden material | startup fail-fast / security diagnostic |
| config center/admin section 出现 | P0 unsupported | startup fail-fast |
| ref kind 与 slot family 不符 | typed family contradiction | runtime assembly fail-fast |
| source unavailable after startup | no hot reload lane | current graph unchanged; next restart required |

### 8.4 按控制面组织的来源覆盖表

| 控制面 | 允许来源 | 禁止来源 | 优先级 lane | 不可用策略 |
|---|---|---|---|---|
| CP-01 root/profile/entry | parser constants、bootstrap selector、JSON、bounded env | arbitrary CLI、config center/admin、tenant overlay | selector selects; content env > JSON | mismatch/missing -> startup fail-fast |
| CP-02 local authority | JSON store ref、bounded env ref、explicit fixture lane | per-run/request override、silent in-memory fallback | env > JSON; fixture only allowed profile | selected authority unavailable -> startup fail-fast |
| CP-03 clock/id/compatibility | fixed constants、JSON binding、bounded env ref、test fixture | algorithm selector、handler fallback、Deployment deterministic | env > JSON for binding; fixed pair not overrideable | unavailable -> startup fail-fast |
| CP-04 API entry | JSON parameters、bounded env leaves、selected entry input | arbitrary request override、remote/admin | env > JSON; input only non-global | invalid parameter -> entry startup/dispatch rejection |
| CP-05 Worker source | JSON named slots、bounded refs、explicit fixture | topic-derived identity、delivery-local lookup、generic map | env > JSON; fixture isolated | enabled source missing -> startup fail-fast |
| CP-06 external Ports | JSON named slot/ref、bounded env refs、fixture lane | family substitution、call-time discovery、raw secret | env > JSON; fixture profile-limited | Configured unavailable -> assembly fail-fast; Disabled explicit |
| CP-07 Outbound routes | JSON ten named refs、bounded env destination refs、fixture lane | wildcard route、route from payload, admin | env > JSON; fixture test only | configured route incomplete -> assembly fail-fast |
| CP-08 Jobs entry | JSON parameters、bounded env, selected entry input | host scheduler business override、per-run reread | env > JSON; input only typed invocation | invalid input rejects run; root remains unchanged |
| CP-09 recovery policy | JSON bounded policy、bounded env | text/status classifier、runtime admin change | env > JSON | invalid/unsafe policy -> startup fail-fast |
| CP-10 diagnostics | JSON `Off/Redacted`、bounded safe selector | raw/full/verbose, editable allowlist, observer override | env > JSON | invalid mode -> startup fail-fast |

### 8.5 来源优先级停审记录

| 域/来源 | 唯一性 | secret/forbidden boundary | 不可用策略 | 结论 |
|---|---|---|---|---|
| bootstrap selector | one selected document | no raw content in CLI selector | explicit failure blocks | pass |
| JSON content | one document, duplicate-free | no raw secret/body/forbidden section | unreadable/invalid blocks | pass |
| env overlay | bounded allowlist | refs only, no structural expansion | invalid present value blocks | pass |
| symbolic resolver | one typed family per slot | material not in root/log | Configured failure blocks assembly | pass |
| fixture lane | profile/test scoped | no Deployment fake or raw secret | missing fixture blocks selected test/profile | pass |
| remote/admin source | none in P0 | unsupported | presence blocks startup | pass |
| CP-01~CP-10 | one owner each | no cross-domain override | domain-specific fail-fast | 10/10 pass |

### 8.6 跨来源冲突审计

| 审计项 | 结果 | 固定规则 |
|---|---|---|
| ordinary precedence ambiguity | 0 | parser constants < JSON < bounded env |
| selector/content ambiguity | 0 | selector selects; document declares matching root |
| high-priority invalid fallback | 0 | invalid env never falls back |
| duplicate/alias detection | required | file/env aliases fail-fast |
| raw secret ordinary override | 0 | only symbolic ref allowed |
| source family substitution | 0 | slot/ref kind cross-check |
| fixture production leakage | 0 | profile gate and Deployment fake=0 |
| per-run raw reread | 0 | immutable root only |
| config center/admin P0 leakage | 0 | unsupported marker rejects |
| unowned raw reader | 0 | only `infra/config.rs` |
| 03 contract delta | 0 | no new field/Port/error/flow/state |

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通内容优先级为 parser constants < JSON < bounded env | 否 | source/precedence only | formal 03 §13.1、DDD Step 14 §14 | 无回写 |
| CLI 仅为 bounded selector/entry input，不支持 arbitrary override | 否 | source boundary only | DDD Step 14 raw-parser handoff | 无回写 |
| raw secret 不参与普通 precedence，只有 symbolic ref | 否 | sensitive-source boundary | formal 03 §13.4、14；Step 8 handoff | 无回写 |
| P0 config center/admin override unsupported | 否 | lifecycle/source scope | formal 03 §13.1、13.9 | 无回写 |
| fixture 为独立 profile/test lane，不是 fallback | 否 | binding/profile semantics | formal 03 §13.12 | 无回写 |
| duplicate/unknown/forbidden/high-priority-invalid 均 fail-fast | 否 | parser validation semantics | DDD Step 14 §16；Step 9 handoff | 无回写 |

Impact audit: `待回写=0`；`阻塞待确认=0`。本 Step 新增 Rust declaration/field/variant/trait/method/callable=`0`，因此结构体、字段、enum variant/payload 和 public callable Rustdoc 增量=`0`。

## 10. Formal §5 回填草稿

正式 §5 应包含：

1. bootstrap selector 与 JSON content overlay 的 ASCII 来源链图；
2. 普通来源优先级表和 fixture/secret/unsupported source 的独立 lane；
3. duplicate、alias、invalid high-priority、missing required、profile mismatch、Disabled shape mismatch 和 source-unavailable 冲突表；
4. CP-01~CP-10 来源覆盖表；
5. `infra/config.rs` 唯一 raw reader、无 per-run reread、无 config center/admin override 的声明。

正式 §5 不得提前写 Step 7 的具体 key、默认数值或 Step 8 的 provider 产品/API；不应把“source unavailable”写成已部署的重试/回滚事实。

## 11. 待确认事项与下一步门禁

| 事项 | 当前状态 | 是否阻塞 Step 6 | 后续处理 |
|---|---|---|---|
| exact JSON module/key names | deliberately pending | no | Step 7 key catalog |
| exact bounded environment names | deliberately pending | no | Step 7 source column |
| concrete secret resolver/product | unselected | no | Step 8/07 controlled binding review |
| concrete file path/mount | deployment-owned | no | Step 6/07 operations handoff |
| exact numeric defaults/bounds | deliberately pending | no | Step 7 |

进入 Step 6 的门禁：

| Gate | 结果 |
|---|---|
| source lanes identified | pass；7 lanes |
| ordinary precedence unique | pass；constants < JSON < env |
| CLI boundary explicit | pass；no arbitrary override |
| secret raw-value isolation | pass；ref-only |
| duplicate/conflict/unavailable rules | pass；closed table |
| CP-01~CP-10 source ownership | pass；10/10 |
| 03 pending writeback / blocker | 0 / 0 |

```text
document = 04-配置设计.md
step = 5
status = 04_step_05_completed_continuous_execution
source_lanes = 7
ordinary_precedence = parser_constants < json_document < bounded_environment_overlay
arbitrary_cli_override = 0
config_center_or_admin_override_p0 = unsupported
raw_secret_in_root = 0
control_plane_source_reviews = 10/10
detailed_design_writeback = none
unresolved_upstream_blocker = none
next_allowed_action = complete_04_step_06_environment_profiles_matrix
commit_required = no
```
