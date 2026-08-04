# L4-observability 04-配置设计 Step 05 · 定义配置来源、优先级与冲突处理

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节: `04-配置设计.md` §5
> 当前模式: `full-restart`
> 本步边界: 固定current来源词表、普通覆盖顺序、冲突与不可用规则并逐域停审；不定义raw key、env var、exact value、environment profile、secret provider、加载实现、变更审计或部署命令

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 05 `定义配置来源、优先级与冲突处理` |
| 当前模块 | `source-precedence-conflict-boundary` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_05_sources_priority_conflicts.md` |
| 用户确认 | Step04 current复核已通过；用户于2026-08-02授权连续完成全部M4 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_06` |
| gate_reason | 八个SOP问题、3层ordinary source、24类冲突、23域来源停审、跨来源/VETO审计与`03`影响均闭合，并已按最终M3传播12项affected |
| blocker | `none` |
| next_allowed_action | `continue_to_current_step_06_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step01~04 | §3输入 | done | recovery point与用户确认一致 |
| 复核Step04静态与语义完整性 | Step04检查记录 | done | 表格、围栏、标题、ID、truthfulness均通过 |
| 读取SOP Step05、书写规范§5.5及current来源契约 | §3输入 | done | formal reader、builder、error、snapshot边界完整 |
| 从current上游独立收敛来源模型 | §4 / §8.1~§8.5 | done | 不复制L1的entry-local或test override假设 |
| 后置审计旧Step05与L1参考 | §5~§7 | done | historical schema与自动门禁不进入current truth |
| 完成23域来源覆盖与逐域停审 | §8.6~§8.7 | done | 每域允许/禁止来源、唯一priority和不可用策略均闭合 |
| 完成跨来源、VETO与`03`影响审计 | §8.8~§9 | done | 无raw secret覆盖、fallback漂移或silent code扩展 |
| 形成formal §5草稿并完成门禁 | §10~§12 | done | formal正文未修改；当前停审等待Step06确认 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step05中间产物全量重建；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step04 pass，用户已确认Step05 |
| 文档级门禁 | pass_for_current_step；flow允许Step05，不允许Step06 |
| Step思考状态 | done；先读current source并独立判断，再读old Step05和L1参考作差异审计 |
| 正式正文污染 | no；old formal `04`继续是historical material |
| 越过未来Step | no；不锁定Step06 profile、Step07 key/value、Step08 provider或Step09 loader算法 |
| `03`静默扩展 | no；不新增reader、CLI、remote/admin source、entry override、hot reload、field、error或builder stage |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 将Step03识别的code declaration、external JSON与environment汇流关系收敛成唯一普通覆盖顺序。
2. 区分“可参与字段merge的来源”“只解析敏感ref的依赖”“由validated config派生的slice/snapshot”“只解释old work的historical binding”。
3. 明确一个assembly candidate可读取多少文件、env以什么粒度覆盖、unknown/duplicate/alias如何处理。
4. 明确高优先级非法值、显式选择但不可用的来源、必填项缺失都不得静默回退低优先级或fake/default。
5. 保证`ConfigBindingRef`关联最终有效candidate，而不是仅关联原始文件、路径或未合并的source fragment。
6. 对Step03全部`CFG-D01~D23`定义允许来源、禁止来源、priority、冲突处理和不可用策略。
7. 审计secret raw material、entry/Job输入、test fixture、old snapshot/binding、remote/admin/hot source是否污染普通覆盖链。

### 2.2 本步非目标

- 不命名JSON key、env var、CLI flag、文件路径、mount、topic、route、endpoint、credential key或schedule key。
- 不决定每个字段的type、exact default/range/unit、required condition或是否允许env覆盖；它们属于Step07逐字段清单。
- 不命名actual environment / deployment profile，也不决定各profile是否必须提供JSON文件；它们属于Step06。
- 不选择secret provider、store、broker、scheduler、telemetry、archive、dashboard、GRC或APM产品。
- 不定义JSON parser、duplicate detector、env snapshot、canonicalization、identity producer、atomic read或source audit的代码算法。
- 不定义secret storage、rotation、audit与no-output细节；本Step只固定raw material不参与merge和解析失败不fallback，Step08继续展开。
- 不定义activation、LKG、drain、rollback、change audit或deprecated alias migration；分别留Step09、Step10、Step13。
- 不允许entry、Job request、resume、telemetry host或test harness成为新的root config reader。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `配置设计讨论流程_SOP.md` Step05 | current process standard | 八问、三张必备表、逐域停审、跨来源审计和完成门禁 |
| `配置设计书写规范.md` §4.5 / §5.5 / §6 | current writing standard | strict JSON默认格式、来源优先级与冲突表、fail-fast评审口径 |
| 通用三项设计标准与依赖裁剪规则 | current global standard | source不得改不变量、entry args需formal schema、逐Step与only-core边界 |
| `04_config_step_01_upstream_boundary.md` | current Step01 | raw representation/source/unknown-key后移项与`03` trigger |
| `04_config_step_02_scope.md` | current Step02 | P0/P1/P2/Forbidden、required-no-default与deployment停止点 |
| `04_config_step_03_control_plane.md` | current Step03 | 三类raw来源、唯一reader/assembly链、11控制面和23配置域 |
| `04_config_step_04_categories_boundaries.md` | direct previous Step | category、new assembly、Job snapshot、24禁止项和23域分类 |
| formal `01-架构设计.md` §13.2 | current architecture baseline | 配置不得改变ownership、安全、依赖、no-write或accepted truth |
| formal `03-详细设计.md` §13.1 / §13.4 / §13.8~§13.9 | direct code baseline | infra-only reader、三层配置、source precedence后移、7类startup error |
| `03_ddd_step_14_config_external_binding.md` §8.1~§8.2 / §17.3 / §18 | detailed config baseline | file/env reader、13-stage assembly、identity、secret、entry与snapshot边界 |
| old `04_config_step_05_sources_priority_conflicts.md` | historical material | 后置诊断其81行schema-first、无来源/冲突/逐域停审和自动推进问题 |
| L1-governance / L1-artifact Step05 | granularity reference | 参考priority、冲突、逐域与审计结构；不复制其entry/job-local来源事实 |

### 3.1 来源判定原则

| 原则 | 本Step解释 |
|---|---|
| Source必须有reader owner | 只有`infra::config`可读ordinary raw source；没有formal reader的CLI/remote/admin/hot来源不能出现 |
| Priority只在同一canonical field生效 | 不同语义不能因字符串相似互相覆盖；exact key-to-field映射留Step07 |
| Required marker不是default | code可声明`required_no_default`，但不能用零值、empty、binary name或provider default补齐 |
| Explicit intent不得被吞掉 | 高优先级值存在但非法、显式选择文件但不可读、选择Endpoint但secret不可解析都必须失败 |
| Secret resolution不是override | ordinary source只携带opaque locator/ref；resolved material留adapter-private memory且不回填candidate |
| Derived material不是source | entry slice、Job snapshot、safe catalog、config identity和availability由candidate派生，不参与merge |
| Historical material不是source | old snapshot/effect binding只解释old work；不能覆盖new candidate，也不能被current route替代 |
| Test不是第二套loader | Fake/InMemory/Fixed/Deterministic/Controlled是formal binding value，仍走同一reader/validator；无harness override层 |
| 不变量没有source | `F-CFG-01~24`不存在canonical field、priority或override，不得以env/debug/emergency放开 |

## 4. SOP问题回答

### 4.1 code default、file、env、secret、config center和admin override的优先级是什么?

Current只有三个可参与ordinary field merge的层，低到高为:

```text
R0 SRC-DECL code declaration / explicit default
  < R1 SRC-JSON one selected strict JSON document
  < R2 SRC-ENV allowlisted environment leaf override
```

该顺序不表示每个field都允许三个来源。Step07必须为每个field声明allowed sources；未获`SRC-ENV`授权的env变量即unknown/unsupported input。`SRC-DECL`只有在formal field存在explicit safe default时才提供值；`required_no_default`只声明缺失必须失败。

Secret raw material没有priority。JSON/env只能提供opaque sensitive locator，builder stage 5再通过infra resolver取得adapter-private material。Config center、admin override、CLI field override、whole-config JSON env、multi-file overlay/include和runtime hot override均为current unsupported source，不能排在`SRC-ENV`之上。

### 4.2 同名配置多处出现时如何处理?

同一canonical field在多个**获授权**ordinary layer出现时，`SRC-ENV`覆盖`SRC-JSON`，`SRC-JSON`覆盖`SRC-DECL`。Merge先记录winning source，再对最终candidate做type/range/cross-field/redline validation。

高优先级值只要存在就表达显式意图。若其值为空、类型错误、越界、违反profile/cross-field或命中禁止语义，candidate失败；不得删除该值后回退file/default。单一JSON内duplicate key、同一语义的新旧alias并存、一个field由多个env alias同时提供，均是歧义而不是合法覆盖。

### 4.3 必填项缺失时是否阻断启动?

Merge完成后，startup-required或enabled-surface-required field缺失，返回`InvalidConfiguration`并阻断complete assembly。不能返回partial runtime，也不能用binary name、LocalTest default、provider default、first catalog entry或空集合补齐。

Optional surface只有在formal schema明确允许`Disabled`且禁用条件完整时才可不提供binding material。若surface已enabled，则其mapping、locator、capability和required sensitive ref全部变为conditional required；缺失按formal builder gate失败，而不是等到first operation再猜。

### 4.4 配置中心或密钥系统不可用时如何处理?

Current不读取config center，因此任何remote/config-center声明都是`InvalidConfiguration`，不存在本地file fallback。显式选择的JSON文件不可读、读不完整或无法获得coherent snapshot时返回`ConfigSourceUnavailable`，不得假装该层不存在后继续baseline/env。

Sensitive provider只解析已validated locator。任一selected binding需要resolved material而该material不可取得时，返回`SensitiveReferenceUnavailable`并停止该complete assembly。Optional resolver/handoff/export只有显式`Disabled`且不携带binding/credential时才跳过解析；成功assembly后发生的health/runtime `Unavailable`可按formal availability隔离无关surface，但那不是source fallback。任何情况都不得复用过期进程缓存、读取raw env secret、切Fake/Controlled或回退无credential target。

### 4.5 哪些来源不能覆盖敏感配置?

任何来源都不能提供或覆盖raw token、password、private key、certificate body、DSN secret、credential body、provider response或external payload。`SRC-JSON`与`SRC-ENV`最多提供Step07明确允许的opaque locator/ref；`SRC-DECL`最多提供LocalTest的body-free fixture locator或非敏感formal selector，不能编译进production credential。

高优先级locator可以在字段source allowlist允许时替换低优先级locator，但这会形成新的effective candidate与config identity。Secret provider返回值不参与priority，也不能反向改变adapter mode、target、route、capability、timeout或policy；解析结果与声明binding不一致时assembly失败。

### 4.6 每个配置域适用哪些来源，哪些来源禁止覆盖?

`CFG-D01~D23`逐域结论见§8.6。共同规则是：ordinary field只接受`SRC-DECL/SRC-JSON/SRC-ENV`中该field获授权的子集；complex catalog、canonical set与mapping默认不做env局部merge；entry DTO、Job DTO、snapshot、historical binding、secret material、health probe和telemetry均不是root source。

### 4.7 每个配置域来源优先级完成后是否通过停审?

23域均已按“允许来源、禁止来源、唯一priority、冲突可判定、不可用策略、`03`影响”停审，见§8.7。域级表允许列出一组candidate sources，但Step07必须落实到每个field；任何field不得因域表写了`SRC-ENV`就自动获得env override能力。

### 4.8 所有来源规则完成后是否仍有secret覆盖、同名冲突或不可用策略不一致?

跨来源审计见§8.8~§8.9。Raw secret没有merge入口；同一canonical field只有一个winner；重复/alias/unknown均reject；高优先级非法值不fallback；各profile沿用同一precedence；test value不建立第二loader；old work不读取current source。当前无unresolved conflict，上游blocker=`none`。

## 5. 当前文档问题诊断

| 位置 | historical问题 | 本Step处理 |
|---|---|---|
| old Step05全文 | 81行仍以log/metric/trace/audit schema为主语，没有SOP八问、priority、冲突、逐域或跨来源审计 | 整份替换为source/reader/merge/error/23域主链 |
| old Step05状态 | 开工即把全部计划写成done，并允许`next_step_or_formal_assembly` | 废弃；本轮只在真实自检后pass，并停在用户确认门禁 |
| old Step05对象 | `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`EvidenceLink` | 仅属historical diagnosis；不得进入current配置来源模型 |
| old formal `04` §5 | 旧key/source/profile来自自动全Step链且未承接current formal `03`三层配置 | historical；Step15只从current Step01~14装配 |
| L1参考 | governance/artifact允许其formal entry/job-local selector或fixture override | 只借鉴表格粒度；L4 current `03`没有对应root reader，不能复制为来源 |
| Step03来源图 | 只确认code/file/env汇流，没有固定precedence | 本Step固定`SRC-DECL < SRC-JSON < SRC-ENV`并限定字段allowlist |
| Step04分类 | 已排除hot/debug/entry-local，但尚未说明test/snapshot/historical是否参与merge | 本Step明确全部为value/derived/history，不是override layer |
| formal `03` identity | 要求explicit revision + redacted normalized material，但未说明env覆盖后identity关系 | config identity必须关联最终effective candidate；不能只代表file fragment |

### 5.1 Historical material隔离

旧Step05中的schema对象、`raw_payload_ref`、hash linkage、旧产品/数字和自动pass只在§5诊断出现。Current Step05不重新设计observation schema，也不恢复README、旧formal `04`或旧`05/06`中的key、profile、source、TC/AC/EV编号。

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Step粒度 | 81行schema摘要 | 八问、source词表、merge边界、冲突矩阵、23域停审和跨来源审计 | 对齐SOP并达到可落码输入粒度 |
| 普通来源 | 未定义 | `SRC-DECL < SRC-JSON < SRC-ENV`，按field allowlist | 避免reader自行选择precedence |
| JSON文件 | 未定义数量/格式 | zero-or-one selected strict JSON；不支持include/overlay | 防止隐式merge order和部署漂移 |
| env | 未定义 | 只允许Step07登记的leaf override；不接收whole config或partial catalog | 防止任意字符串扩展schema |
| 高优先级非法值 | 未定义 | candidate失败，不回退低层 | 保留显式operator intent并fail closed |
| sensitive material | 与配置语义混写 | locator参与ordinary merge，resolved material不参与 | 保持infra-private和redaction边界 |
| identity | 未关联source merge | 绑定最终effective candidate，不能只标file/path | 保证snapshot/change可复核 |
| test/entry/Job | 容易被当override | test是formal value；entry slice/Job snapshot是derived；DTO不是root source | 防止第二配置入口 |
| unavailable | 泛化为降级 | selected sensitive resolution失败与post-assembly runtime Unavailable分离 | 不伪成功或partial runtime |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 普通source关系 | field-level deterministic precedence | whole-source择一；reader自定顺序 | 支持部署override且保持唯一winner |
| file层 | 一份strict JSON | 多文件、profile include、目录扫描 | current无排序/原子快照/诊断契约 |
| env层 | explicit allowlisted leaf override | 任意prefix自动映射；whole JSON env；deep merge | 降低拼写、集合合并和secret泄露风险 |
| invalid winner | fail candidate | 删除winner后fallback低层 | 显式错误不能被静默掩盖 |
| default | 只有formal explicit default才有值 | Rust零值、provider默认、first enum/list item | requiredness不能由实现猜测 |
| sensitive | ordinary source存locator，provider只resolve | raw env/file secret；provider返回值覆盖mode/target | 分离配置identity与secret material |
| config identity | 关联merge后的effective semantics | 只使用文件名/path/revision字符串 | env override后仍需可追溯到实际配置 |
| test | formal binding value走shared validation | fixture作为最高priority runtime source | fake/controlled需与production语义同构 |
| failed new candidate | 本candidate失败；旧assembly行为后置Step09/10 | 自动LKG回退并把candidate判成功 | current尚无LKG/audit/activation契约 |
| environment差异 | 所有profile同一precedence，Step06只约束required/allowed组合 | profile重新排序source | 防止profile成为第二schema |

## 8. 结构化中间产物

### 8.1 配置来源优先级表

| Source ID | 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---:|---|---|---|
| `SRC-DECL` | code declaration / explicit default | R0最低 | formal field登记、required marker、少量有正式来源的safe default | 只在更高层缺席且field有explicit default时供值；required marker不供值 | binary契约存在；无default的required field继续missing |
| `SRC-JSON` | zero-or-one selected strict JSON document | R1 | Step07列入JSON schema的ordinary value、opaque locator、mapping和canonical set | 覆盖R0；duplicate/alias/unknown/parse error使candidate失败 | 未选择可缺席；显式选择但不可读/不完整=`ConfigSourceUnavailable` |
| `SRC-ENV` | captured allowlisted environment leaf override | R2最高 | Step07逐field批准的scalar、finite selector或opaque locator | 覆盖R1/R0；empty仍算present；unknown/alias/invalid不fallback | leaf缺席表示无override；env snapshot不可取得或不一致则candidate失败 |
| `SRC-SECRET` | sensitive reference resolver result | 不参与priority | validated locator对应的adapter-private credential/endpoint material | 只能满足声明ref；不得改mode/target/capability/timeout或回填root | selected binding所需material不可解析=`SensitiveReferenceUnavailable` |
| `SRC-DERIVED` | config identity、safe catalog、entry slices、Job snapshot | 不参与priority | merge/validation/assembly的派生产物 | 只能从winning candidate派生，不接受外部覆盖 | 派生失败映射existing assembly error，禁止partial runtime |
| `SRC-HISTORY` | stored Job snapshot、outbox/intent/plan/effect binding | 不参与new candidate | old execution/effect的恢复解释 | old work只读stored ref；不得fallback current source | 无法解析保持manual/unavailable并保留material，不重定向 |
| `SRC-UNSUPPORTED` | config center、admin/CLI field override、multi-file/include、whole-config env、hot override | 不适用 | current无合法配置 | 任一声明/输入命中即reject，不进入merge | `InvalidConfiguration`；需要时先回写owning design |

R0/R1/R2只描述同一canonical field的ordinary precedence。Source选择metadata、真实文件位置、mount和permission属于process/deployment handoff，不成为root field，也不因priority表获得业务语义。

### 8.2 概念来源合并链

```text
[process chooses zero or one JSON source]       [capture allowed env namespace]
                    |                                         |
                    v                                         v
          [read coherent strict JSON]                 [env occurrences]
                    |                                         |
                    +----------------+------------------------+
                                     |
[field registry: canonical field / allowed sources / explicit default / required marker]
                                     |
                                     v
                 [reject unknown / duplicate / alias / unsupported source]
                                     |
                                     v
               [atomic winner per field: DECL < JSON < ENV]
                                     |
                                     v
                [type / range / cross-field / profile / redline]
                                     |
                                     v
              [establish identity for final effective candidate]
                                     |
                                     v
          [resolve sensitive locators without changing candidate semantics]
                                     |
                                     v
                    [complete-or-error runtime assembly]
```

这是Step05的semantic chain，不是Step09 loader伪代码。Exact key registry、env decoding、coherent read、canonicalization、identity producer和activation算法仍由Step07/09闭合，但实现不得改变此处的winner与fail-closed语义。

### 8.3 Source selection与candidate边界

| 场景 | Current规则 | 结果 |
|---|---|---|
| 未选择JSON且其他层能满足全部required field | 允许形成candidate；Step06可对特定profile收紧 | 继续validation |
| 显式选择一个JSON但文件不存在/不可完整读取 | 不把R1当absent | `ConfigSourceUnavailable` |
| 同时选择多份JSON或JSON声明include/overlay | current unsupported | `InvalidConfiguration` |
| env提供未登记field、整段root JSON或complex catalog fragment | current unsupported | `InvalidConfiguration` |
| unrelated process env | 不在项目namespace/registry，不参与candidate | ignore；不得写入config diagnostics |
| test使用Fake/Controlled/Fixed/Deterministic | 作为JSON/env/default中formal typed value，仍走shared validator | 仅allowed runtime class可继续 |
| API/worker/jobs读取env或file | 越过reader边界 | implementation/design VETO；不形成candidate |
| accepted Job resume读取current source | 越过snapshot边界 | consistency failure；只读stored snapshot |
| host telemetry sink或health probe反馈配置值 | 不属于root source | 不参与merge或business decision |

### 8.4 原子merge与winning-source规则

| 数据形态 | Merge单位 | `SRC-ENV`规则 | 冲突判定 |
|---|---|---|---|
| scalar / finite enum / opaque locator | 一个canonical field | Step07显式allow后可整值覆盖 | winner值完整replace；invalid不fallback |
| optional scalar / locator | field presence + exact value | empty不等于absent；清空语义必须由schema显式定义 | 非法empty或不允许clear则reject |
| bounded object，如claim lease/retry policy | whole typed object或Step07明确列出的独立leaf | 不允许未登记的partial object；cross-field在merge后统一validate | heartbeat/lease、backoff等不成立则reject whole candidate |
| canonical set，如schema/readable profile/allowlist/enabled set | whole set | current默认禁止env逐元素增删；若Step07允许，只能整集替换 | duplicate/noncanonical/unknown member reject |
| keyed mapping/catalog，如Consumer/event/handoff/export targets | whole canonical mapping/catalog | 禁止env fragment、append、delete或index override | duplicate subject、missing total mapping、family/phase mismatch reject |
| explicit default | field declaration | env无特殊权力 | 仅在JSON/env都absent时使用；required marker不生成值 |
| sensitive resolved material | 不merge | env只能覆盖获准locator，不能提供material | material mismatch/unavailable按binding requiredness处理 |

每个winning field必须保留安全的source kind信息供candidate诊断与后续change audit输入，但不得记录raw value、env名、文件路径、secret、endpoint或provider body。Exact provenance carrier是否进入typed implementation由Step09/10决定；本Step不新增formal `03` DTO。

### 8.5 冲突处理表

| Conflict ID | 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|---|
| `SRC-C01` | 同一field在DECL/JSON/ENV均有合法值 | 按R0<R1<R2选择唯一winner | 否；继续validation |
| `SRC-C02` | winner存在但type/format/range非法 | 保留winner存在性并reject；不fallback | 是；`InvalidConfiguration` |
| `SRC-C03` | winner单字段合法但cross-field/profile/redline非法 | reject complete candidate；不逐字段回退 | 是；`InvalidConfiguration` |
| `SRC-C04` | strict JSON duplicate key | parser/loader视为歧义，不采用last-wins | 是；`InvalidConfiguration` |
| `SRC-C05` | canonical key与deprecated alias并存 | 不判断值是否相同；migration规则未允许前一律歧义 | 是；`InvalidConfiguration` |
| `SRC-C06` | 多个env alias映射同一field | 不按读取顺序择一 | 是；`InvalidConfiguration` |
| `SRC-C07` | unknown JSON key或项目namespace内unknown env | reject，不能ignore-and-continue | 是；`InvalidConfiguration` |
| `SRC-C08` | field来源不在其Step07 allowlist | 视为unsupported source，不参与merge | 是；`InvalidConfiguration` |
| `SRC-C09` | explicit JSON source不存在、权限拒绝、partial/coherence失败 | selected source不可降为absent | 是；`ConfigSourceUnavailable` |
| `SRC-C10` | 未选JSON且DECL/ENV满足全部required field | JSON层合法absent | 否；继续validation，Step06可收紧profile |
| `SRC-C11` | required或conditional-required field merge后缺失 | 不补zero/empty/provider default/first item | 是；`InvalidConfiguration`或对应required capability error |
| `SRC-C12` | optional binding显式`Disabled`且携带locator/credential/capability | Disabled必须无相冲突material | 是；`InvalidConfiguration` |
| `SRC-C13` | enabled mapping缺target/adapter/phase或出现duplicate subject | totality/capability失败 | 是；`InvalidConfiguration`/`EntryBindingIncomplete`/`RequiredCapabilityMissing` |
| `SRC-C14` | file/env提供raw secret/body/credential material | 不解析、不redact后继续；直接违反source boundary | 是；`InvalidConfiguration`，并作为VETO输入 |
| `SRC-C15` | locator已validated但selected binding所需sensitive material不可解析 | 不读取raw env、不切fake、不复用不受控cache | 是；`SensitiveReferenceUnavailable`阻断complete assembly |
| `SRC-C16` | optional exact target在成功assembly后发生health/runtime Unavailable | 不触发source fallback、不换target；按formal exact-scope availability隔离 | 阻断该target操作；无关surface按formal matrix继续 |
| `SRC-C17` | store schema/atomicity/CAS/fence descriptor不匹配声明 | source优先级不能改变capability事实 | 是；`StoreCompatibilityMismatch`/`RequiredCapabilityMissing` |
| `SRC-C18` | adapter descriptor与mode/family/phase/capability声明不一致 | 不降级为Disabled/Degraded或另选binding | 是；`AdapterConstructionFailed`/`RequiredCapabilityMissing` |
| `SRC-C19` | RuntimeLike出现Fake/InMemory/Fixed/Deterministic，或Controlled越界 | shared profile validator拒绝；无test override豁免 | 是；`InvalidConfiguration` |
| `SRC-C20` | config center/admin/CLI field/multi-file/include/whole-env/hot source出现 | current unsupported；不定义priority | 是；`InvalidConfiguration` |
| `SRC-C21` | Job/entry input试图覆盖root field | input只按formal protocol语义处理，不进入config merge | 阻断对应input/实现；不得改变assembly |
| `SRC-C22` | old Job/effect无法解析stored snapshot/binding | 不读取current source、不reroute、不重建 | 阻断old operation；保持material并转manual/unavailable |
| `SRC-C23` | env覆盖使effective semantics变化但revision仍指向file-only identity | identity与effective candidate不一致 | 是；`InvalidConfiguration`，不得暴露runtime |
| `SRC-C24` | new candidate失败而old assembly仍存在 | 本Step只判new candidate失败；不得伪称自动rollback/LKG成功 | 阻断new assembly；old lifecycle交Step09/10 |

### 8.6 按配置域组织的来源覆盖表

| Domain ID | 配置域 | 允许来源 | 禁止来源 / merge | Priority与作用范围 | 不可用 / 冲突策略 |
|---|---|---|---|---|---|
| `CFG-D01` | source acquisition | DECL registry；zero-or-one JSON；allowlisted ENV | multi-file/include、remote/admin/CLI/hot、entry/Job reader、secret result | R0<R1<R2；形成one candidate | selected source不可读=C09；unknown/duplicate=C04~C09 |
| `CFG-D02` | config identity | effective candidate + explicit stable revision语义；`SRC-DERIVED` | path/file-only revision、env名、secret、run/evidence、external override | merge/validate后stage4建立；无priority | identity与candidate不一致=C23；body-free或recoverability失败reject |
| `CFG-D03` | runtime class / technical adapters | DECL/JSON；ENV只可覆盖Step07批准的profile/mode/locator leaf | binary-name推profile、fixture source、entry override、RuntimeLike fake fallback | R0<R1<R2 per allowed leaf；whole mode/binding coherent | profile越界=C19；required clock/ID binding缺失/不可用fail assembly |
| `CFG-D04` | protocol boundary | DECL/JSON；ENV仅批准的scalar limit/timeout或whole schema set | request/env-at-entry override、env增量schema、authorization/visibility source | R0<R1<R2；set whole replace，不deep merge | invalid/cross-field=C02~C03；unknown schema仍由protocol reject |
| `CFG-D05` | entry dispatch / scheduling | DECL/JSON；ENV仅批准的cadence/limit/opaque schedule locator；complex mapping whole-source | entry-local env、Job DTO、catalog fragment、schedule生成actor/key/scope | R0<R1<R2 per leaf；enabled/mapping canonical whole set | missing/duplicate mapping=C13；optional no-schedule仍callable |
| `CFG-D06` | redaction / body-free safety | DECL/JSON；ENV只可覆盖获准opaque policy locator，不能覆盖finite safety code contract | raw policy body、debug/test bypass、provider result、telemetry input | R0<R1<R2 for locator only；no relax semantics | missing/unsafe locator=C03/C11；required resolution=C15；fail closed |
| `CFG-D07` | correlation / safe label / visibility | DECL/JSON；ENV只可覆盖获准policy locator或whole finite allowlist | request/route/provider推policy、high-cardinality fragment、diagnostic override | R0<R1<R2；allowlist whole replace | missing/invalid policy=C03/C11/C15；NotVisible不fallback default truth |
| `CFG-D08` | observation + atomic idempotency store | DECL/JSON；ENV仅store mode/opaque locator leaf获准时 | Job/entry rewrite、raw DSN/credential、RuntimeLike InMemory、product health as source | R0<R1<R2；observation/idempotency cross-field一起validate | C14/C17/C19；required atomic group不可用阻断assembly |
| `CFG-D09` | projection store | DECL/JSON；ENV仅mode/opaque locator leaf获准时 | Query-time source、inline repair selector、raw DSN、current health override | R0<R1<R2；new assembly only | C14/C17；unavailable按enabled read/Job surface fail/degraded formal规则，不false Fresh |
| `CFG-D10` | Job execution / report store | DECL/JSON；ENV仅mode/opaque locator leaf获准时 | Job DTO、process lock、raw DSN、current config on resume | R0<R1<R2；accepted Job随后派生snapshot | enabled Job缺durable claim/fence/report=C11/C17；resume仅history=C22 |
| `CFG-D11` | transaction / schema compatibility | DECL/JSON；ENV仅批准timeout/revision scalar | adapter自动migration、provider revision、Job override、timeout作rollback proof | R0<R1<R2；scalar winner后与store descriptor验证 | invalid=C02/C03；schema/capability mismatch=C17，不自动repair |
| `CFG-D12` | digest compatibility | formal DECL default；JSON whole profile set；ENV默认禁止set fragment | configurable field list/algorithm、old material重算、provider profile | R0<R1；若Step07批准ENV只能whole set replace | unknown/in-use removal=C03；old profile解析失败=C22 |
| `CFG-D13` | technical reservation / intent retention | DECL/JSON；ENV只可覆盖批准的duration leaf | business marker/cleanup authority、Job mid-run override、history shortening | R0<R1<R2；new material only，old material受guard | invalid/cross-window=C02/C03；不得删除unresolved history |
| `CFG-D14` | projection bounds / freshness | DECL/JSON；ENV仅批准limit或policy locator leaf | Job mid-run source、partial success、inline repair、provider freshness | R0<R1<R2；Job DTO只能formal收窄并在start冻结，不是root source | invalid/cross-field=C03；overflow whole boundary fail，不fallback |
| `CFG-D15` | claim / concurrency / Job budget | DECL/JSON；ENV仅批准lease/parallelism/plan/timeout leaf | Job/entry override root、fence toggle、current source on resume | R0<R1<R2；bounded object coherent；accepted start派生snapshot | heartbeat/lease等invalid=C03；store capability=C17；resume=C22 |
| `CFG-D16` | retry policies | formal DECL default；JSON whole policy；ENV仅Step07批准的whole policy/leaf组合 | adapter/provider自定retry、Job mid-run、Unknown触发override | R0<R1<R2；merge后按whole typed policyvalidate并冻结 | invalid=C03；capability mismatch=C18；不fallback blind retry |
| `CFG-D17` | safe resolver bindings | DECL/JSON；ENV仅批准mode/locator/credential-locator/timeout leaf；formal test value | raw secret/body、provider result、RuntimeLike fake、non-core product import | R0<R1<R2；binding object整体cross-validate | C14/C15/C18/C19；Disabled/Unavailable保持formal outcome |
| `CFG-D18` | event publication binding | DECL/JSON；ENV仅批准publisher locator leaf；12-target catalog默认JSON whole replace | env catalog fragment、event schema override、current route恢复old row、raw transport secret | R0<R1<R2 per leaf；catalog whole canonical；old row=`SRC-HISTORY` | missing/duplicate=C13；secret/capability=C15/C18；old binding=C22 |
| `CFG-D19` | report handoff targets | DECL/JSON；ENV仅批准adapter locator leaf；target catalog默认JSON whole replace | env target fragment、Job任意target、raw credential、verdict/evidence/signoff source | R0<R1<R2 per leaf；accepted intent pins derived binding | selected secret失败=C15；post-assembly unavailable=C16；不fallback其他target |
| `CFG-D20` | peripheral export targets | DECL/JSON；ENV仅批准adapter locator leaf；catalog默认JSON whole replace | env target fragment、external product truth、raw credential、core required fallback | R0<R1<R2 per leaf；optional target隔离 | selected secret失败=C15；post-assembly unavailable=C16；不伪Delivered |
| `CFG-D21` | sensitive reference resolution | validated locator winner + infra provider (`SRC-SECRET`) | raw file/env secret、application/entry read、provider改变binding semantics、cache作source | locator按R0<R1<R2；resolved material无priority且不回填candidate | selected=C15；Disabled不解析；runtime availability=C16；material不输出 |
| `CFG-D22` | activation / rollback / historical binding | new effective candidate (`SRC-DERIVED`)；old stored refs (`SRC-HISTORY`) | hot/admin source、current route覆盖history、failed candidate自动LKG成功 | new candidate source order固定；old/new彼此不merge | new failure=C24；old missing=C22；exact activation/rollback留Step09/10 |
| `CFG-D23` | environment / verification matrix | 引用同一DECL/JSON/ENV规则与formal test values | profile特有precedence、第二schema/loader、fixture override layer、伪造result | 所有profile同一R0<R1<R2；Step06只映射allowed/required | invalid profile=C19；matrix冲突阻断对应combination，不生成证据 |

域级补充约束:

- 表中出现`ENV`只表示该域存在可能适合leaf override的字段，不授予整域override；Step07必须逐field批准，否则`SRC-C08`。
- Catalog、mapping、canonical set默认只能由一个winning whole value提供；不得把env index、append/delete或JSON数组位置变成稳定配置接口。
- Job DTO可按formal protocol提供candidate limit/scope等operation input并受root hard cap收窄，但它不参与R0/R1/R2，也不改变`ValidatedObservabilityConfig`。
- `SRC-HISTORY`优先于current source仅限“解释已经accepted的old work”，这不是new candidate priority；old snapshot/binding缺失时fail/manual，不回退current。

### 8.7 来源优先级停审记录

| 配置域 / 来源 | Priority唯一 | 冲突可判定 | 不可用策略 | `03`影响 | 结论 / 缺口 |
|---|---|---|---|---|---|
| CFG-D01 source | yes；R0<R1<R2 | C04~C10/C20 | selected source fail closed | 无 | pass；one candidate，无第二reader |
| CFG-D02 identity | n/a；derived after merge | C23 | identity失败不assembly | 无 | pass；ref关联effective candidate |
| CFG-D03 runtime/technical | yes per allowed leaf | C03/C08/C19 | required binding fail | 无 | pass；test value非source |
| CFG-D04 boundary | yes per scalar/set | C02~C08 | invalid root fail | 无 | pass；request不覆盖root |
| CFG-D05 entry | yes per leaf/whole mapping | C08/C13/C21 | incomplete root/entry fail | 无 | pass；slice与DTO非source |
| CFG-D06 redaction | yes for locator only | C03/C08/C14/C15 | required fail closed | 无 | pass；无debug/raw bypass |
| CFG-D07 correlation/visibility | yes for locator/set | C03/C08/C14/C15 | required fail closed | 无 | pass；provider不定义truth |
| CFG-D08 atomic store | yes per mode/locator | C14/C17/C19 | required atomic group fail | 无 | pass；无RuntimeLike fallback |
| CFG-D09 projection store | yes per mode/locator | C14/C17 | formal required/degraded规则 | 无 | pass；无Query repair/source |
| CFG-D10 Job store | yes per mode/locator | C17/C21/C22 | enabled Job缺能力fail | 无 | pass；resume只读history |
| CFG-D11 transaction/schema | yes per scalar | C02/C03/C17 | mismatch fail,无auto migration | 无 | pass；timeout非outcome source |
| CFG-D12 digest | yes；default/file，env需逐field批准 | C03/C08/C22 | unknown/in-use removal fail | 无 | pass；算法/字段集不配置 |
| CFG-D13 technical retention | yes per duration | C02/C03/C08 | invalid fail；old guard保持 | 无 | pass；不授权cleanup |
| CFG-D14 projection/freshness | yes per limit/locator | C03/C08/C21 | overflow/freshness fail closed | 无 | pass；Job input只收窄 |
| CFG-D15 claim/budget | yes per bounded leaf/object | C03/C08/C17/C22 | invalid/capability fail | 无 | pass；snapshot不热读 |
| CFG-D16 retry | yes per whole policy/approved leaf | C03/C08/C18 | invalid/capability fail | 无 | pass；无provider/blind retry |
| CFG-D17 resolver | yes per binding leaf | C14~C16/C18/C19 | Disabled/Unavailable显式 | 无 | pass；fake/controlled隔离 |
| CFG-D18 publication | yes per leaf；catalog whole | C13~C16/C18/C22 | mapping/required fail；old manual | 无 | pass；old row不current fallback |
| CFG-D19 handoff | yes per leaf；catalog whole | C13~C16/C18/C22 | exact target blocked/unavailable | 无 | pass；target不产生verdict |
| CFG-D20 export | yes per leaf；catalog whole | C13~C16/C18/C22 | optional target隔离 | 无 | pass；外围不污染core |
| CFG-D21 sensitive refs | locator有priority；material无priority | C14~C16 | selected/Disabled/runtime分流 | 无 | pass；raw material不回填 |
| CFG-D22 lifecycle/history | new source与old history分离 | C22~C24 | new fail；old manual；不重写 | 无 | pass；具体LKG/rollback后置 |
| CFG-D23 environment/view | all profile同R0<R1<R2 | C08/C19/C20 | invalid combination fail | 无 | pass；无第二schema/evidence |

所有域停审结论都是Step05 source-level pass，不代表field清单、profile矩阵、loader、secret、activation或failure全链已经完成。相关细节仍受Step06~11门禁约束。

### 8.8 跨来源owner与非来源材料表

| 易混材料 | Current身份 / owner | 是否参与R0/R1/R2 | 禁止解释 |
|---|---|---|---|
| strict JSON document | `infra::config` ordinary source | 是，R1 | 多文件overlay、部署path成为identity |
| allowlisted env leaf | `infra::config` ordinary source | 是，R2 | 任意prefix、raw secret、entry临时override |
| code required marker | field registry declaration | 是，R0语义但不供值 | Rust zero/default推断required field |
| sensitive locator | ordinary typed field | 是，按获准field | raw secret或provider material |
| resolved secret/endpoint material | infra adapter-private resolver output | 否 | 覆盖mode/target/capability，进入root/snapshot/log |
| LocalTest/IntegrationLike fixture locator | formal adapter binding value | 是，作为普通field | test harness最高priority private map |
| `ConfigBindingRef` | stage4 effective candidate identity | 否，derived | file path、run/evidence/deployment identity |
| entry slices | builder stage11 derived config | 否 | entry自读env/file扩权 |
| Job request/DTO | formal protocol input | 否 | root config override或remote admin channel |
| `JobExecutionConfigSnapshot` | accepted start派生并durable持久化 | 否 | 第二source、resume读current config |
| external safe catalog | validated external binding投影 | 否 | infra target/credential反向进入application |
| availability/health/probe | runtime observation | 否 | config value、operation success或business truth |
| old snapshot/effect binding | durable historical recovery source | 不参与new merge | current route/default重定向old token |
| telemetry sink/host config | host-managed P1 handoff | 不进current root | root field、source override、acceptance authority |
| forbidden invariant | formal `F-CFG-01~24` | 无field/无source | debug/env/emergency/test开关 |

### 8.9 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Ordinary precedence是否唯一 | pass | 全局R0 DECL < R1 JSON < R2 ENV；无profile特例 |
| 每个field是否自动允许env | no | Step07必须逐field登记；域级ENV不等于授权 |
| 高优先级非法值是否fallback | no | C02/C03始终reject complete candidate |
| selected file不可用是否降为absent | no | C09=`ConfigSourceUnavailable` |
| JSON/env duplicate、alias、unknown是否可判定 | pass | C04~C08一律reject，迁移例外只能Step13正式定义 |
| Collection/catalog是否隐式deep merge | no | 默认whole replace；env fragment/index/append/delete禁止 |
| raw secret是否有普通source入口 | none | file/env只承载获准opaque locator；C14 VETO |
| secret provider是否成为高优先级配置源 | no | 只resolve winner locator；不改变candidate semantics |
| selected secret failure与runtime availability是否混淆 | no | C15阻断selected binding assembly；C16仅处理成功assembly后的runtime Unavailable |
| test fixture是否形成第二loader | no | 仅formal binding value并走shared validation；C19隔离 |
| entry/Job输入是否覆盖root | no | C21；entry slice/DTO/snapshot均非source |
| old Job/effect是否读取current source | no | C22；只读stored snapshot/binding，缺失manual/unavailable |
| config identity是否覆盖最终effective semantics | pass | C23阻断file-only/stale revision |
| failed candidate是否被写成LKG/rollback成功 | no | C24只阻断new assembly；Step09/10再定义lifecycle |
| remote/admin/CLI/hot/multi-file是否暗入current | none | 全部`SRC-UNSUPPORTED`/C20；future需回设计 |
| P1 target是否改变P0 precedence/redline | no | P1只提供获准locator/catalog实例，仍受相同merge/VETO |
| telemetry host是否反向定义root source | no | host-managed handoff不进source chain |
| 是否新增non-core compile dependency | no | source/binding不能生成Cargo edge；F-CFG-22继续生效 |
| 是否存在unresolved source conflict | none | 23域停审通过；exact field allowance留Step07 |

### 8.10 Requirement VETO到来源门禁映射

| Requirement VETO | 来源侧风险 | Source gate | Step05结论 |
|---|---|---|---|
| `VF-OBS-001` 核心闭环不成立 | required source/mapping/capability缺失被default/fallback掩盖 | C02/C03/C09/C11/C13/C15/C17/C18 | covered；complete-or-error，无partial runtime |
| `VF-OBS-002` raw/secret/runtime body进入观察面 | file/env/provider material进入root或diagnostic | C07/C08/C14~C16；D06/D21 | covered；普通source只存locator，raw material无merge入口 |
| `VF-OBS-003` evidence/artifact等正文被保存 | resolver/fixture/provider body成为source/default | C14/C18/C19；D06/D07/D17 | covered；formal body-free binding不允许source bypass |
| `VF-OBS-004` observation/product成为external truth | provider health/result/target成为配置truth | source owner表；D17~D21 | covered；probe/target/provider均非source authority |
| `VF-OBS-005` Query/maintenance反写source truth | entry/Job/diagnostic input成为admin override | C20/C21；D05/D09/D14/D22 | covered；current无entry/admin/hot config channel |
| `VF-OBS-006` 伪造run/evidence/verdict/signoff | config revision/target/receipt被当真实身份 | C23；D02/D19/D23 | covered；identity仅关联effective config，不是验收身份 |
| `VF-OBS-007` 清理仍被引用材料 | current source缩短old retention或替换old binding | C03/C22；D12/D13/D22 | covered；history不参与new merge且不可current fallback |
| `VF-OBS-008` non-core sibling依赖 | source选择动态引入product crate | C18/C20；D17~D20 | covered；binding只实例化formal adapter，不生成Cargo edge |
| `VF-OBS-009` 具名产品成为硬前置/truth | provider default/health/target覆盖formal config | C11/C15~C18；D08~D21 | covered；product-neutral locator/capability，Unavailable不伪成功 |
| `VF-OBS-010` historical材料升级current truth | old key/profile/source/README值作为default/alias | C05/C07/C20；historical gate | covered；仅current Step01~05和formal上游可定义source |

本映射只证明来源层已承接requirement VETO，不声称测试用例、验收签署、真实evidence或实施结果已经存在。

## 9. 对详细设计的影响判定

### 9.1 当前结论

| 配置结论 | 是否影响03 | 影响类型 | `03`回写位置 | 处理状态 |
|---|---|---|---|---|
| ordinary precedence为DECL < one JSON < allowlisted ENV | 否 | formal `03`明确后移给`04`的source语义 | 不适用 | 无回写 |
| env只覆盖Step07批准field，catalog/set默认whole replace | 否 | raw representation/merge约束 | 不适用 | 无回写 |
| required marker不产生default，高优先级非法值不fallback | 否 | missing/conflict语义 | 不适用 | 无回写 |
| duplicate/alias/unknown/unsupported source fail candidate | 否 | parser/validator policy，使用existing `InvalidConfiguration` | 不适用 | 无回写 |
| explicit selected file不可用=`ConfigSourceUnavailable` | 否 | 使用existing startup error | 不适用 | 无回写 |
| required sensitive resolution失败=`SensitiveReferenceUnavailable` | 否 | 使用existing startup error和requiredness | 不适用 | 无回写 |
| selected secret解析失败阻断assembly；post-assembly exact target Unavailable不fallback | 否 | 承接formal stage5与availability/capability matrix | 不适用 | 无回写 |
| config identity关联最终effective candidate | 否 | 澄清existing stage4 `ConfigBindingRef`语义 | 不适用 | 无回写 |
| entry slice/Job snapshot/history不是source | 否 | 承接existing ownership、snapshot与recovery | 不适用 | 无回写 |
| remote/admin/CLI/multi-file/hot source current unsupported | 否 | current范围裁剪 | 不适用 | 无回写 |

### 9.2 Future impact trigger

| 后续要求 | `03`影响 | 处理规则 |
|---|---|---|
| 新增remote config center、watcher或push source | 是 | 回§5/§13定义reader/port、identity、auth、audit、failure、atomic snapshot和tests |
| 新增admin/CLI/entry field override | 可能是 | 先定义public arg schema、owner、scope和error；改变slice/constructor/flow则回`03` |
| 支持multi-file/include/profile overlay | 可能是 | 先定义ordering、cycle、atomicity、identity、duplicate/provenance和migration；影响reader/error则回`03` |
| 支持in-place hot reload/adapter swap | 是 | 回runtime builder/activation/audit/drain/rollback/old binding及concurrency tests |
| 把source provenance暴露给application/public DTO | 是且current禁止 | 回ownership/type/visibility/redaction/telemetry设计；默认只留infra-safe diagnostics |
| 允许provider返回material改变mode/target/capability | 是且违反current边界 | 重开binding/adapter/identity设计，不得在Step08实现侧扩展 |
| 新增test-only private override layer | 是 | 回formal mode/reader/harness/conformance contract；不能fixture先行 |

当前actual影响表没有`待回写`或`阻塞待确认`；上游blocker=`none`。

## 10. 回填草稿

以下草稿只供Step15装配formal `04` §5；当前不修改正式正文。

````md
## 5. 配置来源、优先级与冲突处理

> 校准来源:
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源优先级表”“概念来源合并链”“原子merge与winning-source规则”“冲突处理表”“按配置域组织的来源覆盖表”“来源优先级停审记录”和“跨来源冲突审计表”,了解ordinary source与secret resolution、derived snapshot及historical binding为何必须分离。

Current root configuration只有三个ordinary source layer，低到高为`code declaration / explicit default < one selected strict JSON document < allowlisted environment leaf override`。该顺序仅对Step07逐field批准的source生效；required marker不生成default，collection/catalog默认whole replace，environment不能做隐式deep merge。

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---:|---|---|---|
| code declaration / explicit default | R0最低 | formal field、required marker与有正式来源的safe default | 仅在更高层缺席且存在explicit default时供值 | required-no-default继续missing，不补zero/empty |
| one selected strict JSON document | R1 | schema登记的ordinary value、opaque locator、set与catalog | 覆盖R0；duplicate/alias/unknown/invalid使candidate失败 | 未选择可缺席；显式选择但不可读=`ConfigSourceUnavailable` |
| allowlisted environment leaf override | R2最高 | 逐field登记的scalar、finite selector或opaque locator | 覆盖R1/R0；empty也算present；invalid不fallback | 缺席表示无override；unknown/unsupported使candidate失败 |
| sensitive reference resolver result | 不参与priority | validated locator对应adapter-private material | 不得改变mode/target/capability/timeout或回填root | selected binding解析失败=`SensitiveReferenceUnavailable`；Disabled不解析 |
| derived / historical material | 不参与new merge | config identity、entry slice、Job snapshot、old effect binding | derived只来自winner；old work只读stored ref | 缺失时fail/manual/unavailable，不读取current source重建 |

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| 高优先级值存在但type/range/cross-field/profile非法 | reject effective candidate，不删除winner后fallback | 是，阻断new assembly |
| JSON duplicate key、canonical+alias并存、多个env alias | 视为歧义，不使用last-wins | 是 |
| unknown key/env或field来源不在allowlist | reject，不能ignore-and-continue | 是 |
| required / enabled-surface-required field缺失 | 不用binary/provider/first-item/default补造 | 是 |
| raw secret/body通过file/env进入 | 不解析、不脱敏后继续；直接拒绝 | 是，且进入VETO验证输入 |
| enabled mapping缺target/phase或duplicate subject | totality/capability失败 | 是；对应assembly/root不暴露 |
| old Job/effect binding不可解析 | 保留old material并停止，不reroute current target | 阻断old operation，进入manual/unavailable |
| remote/admin/CLI field/multi-file/include/whole-env/hot source | current unsupported，不参与priority | 是；需要时先回设计 |

Entry slice、Job request、`JobExecutionConfigSnapshot`、availability probe与telemetry sink都不是root source。Accepted Job resume/finalize只读stored snapshot，old outbox/intent/preparation只读historical binding。Secret provider只解析winning locator；raw material不得进入validated config、snapshot、log、report或source diagnostics。
````

Formal装配要求:

- §5至少保留来源优先级表、冲突处理表以及ordinary/secret/derived/history分离说明。
- 可压缩23域矩阵，但不得删掉field-level allowlist、catalog whole replace、invalid winner no-fallback、identity覆盖effective candidate和old work no-current-fallback结论。
- 不得在formal草稿中新增raw key、env var、真实file path、secret provider、产品、数值、部署命令、LKG或测试通过声明。

## 11. 待确认事项

| 待确认事项 | 当前影响 | Owner / 最迟关闭 | 未确认前处理 |
|---|---|---|---|
| actual environment/profile是否允许无JSON启动 | 决定每个profile的source requiredness | Step06 | semantic上允许zero-or-one；profile可收紧，不能改precedence |
| 每个field允许DECL/JSON/ENV中的哪些来源 | 决定env surface与exact requiredness | Step07 | 默认JSON可表达current field；ENV默认deny，逐field批准 |
| exact JSON key、env mapping与module shape | 决定parser registry和unknown-key判定 | Step07 | 不从old formal/README恢复，不建立alias |
| collection/catalog是否存在必须env整值覆盖的例外 | 决定operational override ergonomics | Step07 | 默认JSON whole value；禁止env fragment/deep merge |
| config identity的explicit revision与normalized candidate一致性算法 | 决定C23如何验证 | Step07/09 | identity必须覆盖effective semantics；不能path/file-only |
| sensitive locator允许哪些ordinary source与provider | 决定C15/C16及rotation | Step07/08 | ENV默认deny；raw material无source priority |
| optional resolver/target在各profile的Disabled/enabled组合 | 决定哪些binding会进入stage5和后续availability矩阵 | Step06/07/11 | selected binding解析失败阻断；Disabled不解析；runtime Unavailable不fallback |
| failed new candidate时old assembly/LKG/rollback行为 | 决定activation安全 | Step09/10/11 | 只判new candidate失败；不声称自动LKG或rollback成功 |
| alias/deprecation过渡是否允许短期dual-name | 决定C05/C06 migration exception | Step13 | 当前canonical+alias一律reject；没有隐式兼容期 |
| source/change audit的safe provenance字段 | 决定R0/R1/R2 winner留痕 | Step09/10 | 只记录safe kind/ref；禁止raw value/path/env/secret |

上述事项均有明确owner与当前安全处理，不阻塞Step05。若后续需要新增reader、source carrier、public arg、error variant、remote port、hot swap或provenance DTO，则升级为`03`回写blocker。

## 12. Current M3 后置复核与 affected source policy

### 12.1 Final source-boundary revalidation

| Final M3 boundary | Step05 source rule | 复核结论 |
|---|---|---|
| raw source仅`infra::config`读取 | `SRC-DECL < SRC-JSON < SRC-ENV`；entry/application无reader | pass |
| sensitive result仅adapter-private memory | locator可参与ordinary merge，resolved material不参与priority | pass |
| config identity覆盖effective typed semantics | merge/validate后派生，不由path、run或evidence提供 | pass |
| entry slice / safe catalog / Job snapshot是derived | 不作为额外source或override layer | pass |
| accepted old work按stored snapshot/binding解释 | `SRC-HISTORY`不参与new candidate，不fallback current | pass |
| RuntimeLike不可fake/in-memory fallback | source conflict不能改变profile/capability事实 | pass |
| high-priority invalid不得fallback | complete candidate reject，zero partial runtime | pass |

### 12.2 Affected source policy register

| Affected ID | Source-level required behavior | Source-level forbidden fallback | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | canonical upstream schema owner必须独立存在 | JSON/env不得提供local payload schema或fallback v1 | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | exact producer mapping来自approved binding source | 不从route/topic/name/first catalog row推导 | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | J06 positive authority必须来自H13 owner decision | 不从profile、schedule或enabled flag生成H13 | open_controlled |
| `R06-F-AFFECT-UOW-01` | store capability source只能证明符合fixed UoW | 不以adapter config重排/裁剪same-UoW writes | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | retry budget在typed class确定后才读取 | 不把provider error/timeout字符串当source | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | exact binding ref来自validated catalog并被intent冻结 | 不以current/default binding修复缺link old work | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | frozen policy + same token + stored accounting | 不从new candidate重置budget/token | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | accepted snapshot/outbox来源是same-UoW post-state | 不从current store scan或config event list重建 | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | action取决于stored result/probe事实 | 不从retry config、health或default action推成功 | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | report ref来源是owner-backed durable relation | 不从path、config ref、run placeholder生成 | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | public type来源是contracts owner registry | 不从JSON shape/free-form map反向定义 | inherited_affected |
| `03-RPR-S09-PER-FLOW` | implementation source必须引用exact flow card | 不以source/profile矩阵替代逐flow审计 | inherited_affected |

本Step关闭`0/12`。Source规则只提供fail-closed和historical pinning，不能单独关闭schema、owner、flow或
capability affected。本轮新发现上游blocker=`none`。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已读取SOP Step05、书写规范§5.5及current source/builder契约 | pass | §3 |
| Step04完整性在进入本Step前已复核 | pass | §1.1；表格/围栏/ID/truthfulness无缺口 |
| 八个SOP问题逐项回答 | pass | §4.1~§4.8 |
| old Step05后置审计且废弃schema仅在historical语境 | pass | §5~§5.1 |
| ordinary source词表与唯一priority已定义 | pass | §8.1；DECL < JSON < ENV |
| JSON/env selection与atomic merge边界明确 | pass | §8.2~§8.4 |
| 24类冲突均有可判定结果 | pass | §8.5 `SRC-C01~24` |
| 23个配置域均有允许/禁止source、priority与unavailable策略 | pass | §8.6 |
| 23域均完成来源停审 | pass | §8.7 |
| secret/derived/history/test/entry/telemetry均未污染ordinary chain | pass | §8.8~§8.9；selected secret与runtime Unavailable已分离 |
| requirement VETO与source gate无遗漏 | pass | §8.10 |
| high-priority invalid no-fallback与selected-source fail-closed明确 | pass | C02/C03/C09 |
| collection/catalog没有隐式deep merge | pass | §8.4 / §8.6 |
| identity覆盖effective candidate且不是run/evidence/path | pass | C23 / D02 |
| `03`影响判定完成且无actual回写项 | pass | §9 |
| formal §5草稿未新增key/value/provider/LKG/部署命令 | pass | §10 |
| 未读取/修改Step06 current产物或formal `04` | pass | 本轮只更新Step05/flow/ledger |
| 未伪造实现、测试、验收、commit、run或evidence | pass | 全文仅记录design conclusion与下游input |
| 上游blocker | pass | `none` |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| 来源覆盖顺序明确 | pass | R0 DECL < R1 JSON < R2 ENV，其他材料不参与ordinary priority |
| 冲突与不可用处理可判定 | pass | C01~C24覆盖duplicate/unknown/missing/secret/capability/history等 |
| 23域来源优先级已停审 | pass | §8.6~§8.7 |
| 跨来源冲突审计无unresolved conflict | pass | §8.8~§8.9 |
| `03` impact无actual待回写 | pass | §9 |
| Step05 gate_status | `pass_consumed_by_step_06` | 最终M3 source/identity/history边界及12项affected source policy复核通过 |
| next_allowed_action | `continue_to_current_step_06_under_continuous_M4_authorization` | 只按SOP进入Step06环境/profile矩阵 |
