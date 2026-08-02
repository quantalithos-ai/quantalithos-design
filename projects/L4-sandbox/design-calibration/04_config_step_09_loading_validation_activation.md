# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/配置设计书写规范.md` §5.9
> 回填章节: `04-配置设计.md` §9 配置加载、校验与生效机制
> 生成日期: 2026-07-11
> 状态: reviewed_passed_to_step_10
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接 Step 5 的分通道来源、Step 6 的 PROFILE-01~07、Step 7 的 I001~I101 / D01~D44 / FC-01~06、Step 8 的 S04 与 SEC-01~18,定义唯一加载管线、逐层校验、activation plan、runtime builder handoff、冻结点和失败表面。不得写实现代码、产品 SDK、部署命令、真实测试结果、run_id、evidence alias、验收签署、implementation ledger、planned boundary skeleton 或 commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 9 | 是。用户审查 Step 8 后回复“同意”,本次只放行 Step 9。 |
| 项目级台账是否允许进入 Step 9 | 是。恢复点为 Step 8 `pass_wait_review`,且用户已明确确认。 |
| 文档级 flow 是否允许进入 Step 9 | 是。Step 8 的40项敏感配置、23个material-capable slot、SEC-01~18和泄露审计已闭合。 |
| 是否读取 Step 9 SOP / 书写规范 | 是。必须输出加载流程图、加载校验表、逐域表、停审表和跨加载审计。 |
| 是否读取 Step 7 / Step 8 | 是。已复核I001~I101类型、来源、作用域、生效、失败策略及S04 material生命周期。 |
| 是否读取详细设计builder边界 | 是。已复核正式`03` §13和`03_ddd_step_14_config_external_binding.md` §16。 |
| 是否参考L1项目粒度 | 是。参考L1-governance / L1-artifact Step 9的结构,但按本项目101项、44域、4通道和S04独立lane扩展。 |
| 当前状态 | 已完成并通过机械门禁;用户已审查并放行Step 10 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_09_loading_validation_activation.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md`仍不存在;只允许Step 15装配 |
| 停审方式 | 本Step已按门禁停审,用户确认后已进入Step 10 |
| 是否发现阻塞本Step的上游blocker | 否。Provider产品、P05+资格和平台anti-leak能力仍是激活 / 下游缺口,不阻塞产品中立加载契约。 |

---

## 2. 本步目标与非范围

本Step把“配置项已经列出”推进到“实现者可以按固定阶段构造一个完整runtime generation”。核心目标不是描述一个抽象的`load -> validate`,而是闭合以下问题:

- source / profile selector何时冻结,如何保证只选择一个S02 JSON和一个PROFILE。
- S01、S02、S03如何分别解析,何时按semantic slot合并,高层非法值为何不能回退低层。
- strict JSON、required、type、enum、range、ref family、registry、profile、NCFG和cross-field校验的先后关系。
- FC-01~06、三类handoff、9类inbound binding、13类route和23个S04 material-capable item如何形成activation plan。
- S04为什么只能解析已验证且已激活的slot,以及material如何只进入concrete adapter构造边界。
- `SandboxRuntimeConfigSummary`、stores、UoW、repositories、adapters、application services和entry handles如何按`03`顺序装配。
- startup、new loop、new job、current entry和test harness分别冻结什么,失败时影响哪个边界。
- runtime generation如何原子发布,为什么禁止partially ready、mixed generation、reload、hot swap和last-known-good fallback。

本Step不定义:

- Rust loader函数签名、serde结构、error enum源码、provider SDK调用或adapter constructor代码。
- Vault / KMS / secret manager、DB、bus、backend、sink、scheduler或route产品schema。
- 配置变更申请、评审、审计、apply、rollback和drift处置;这些属于Step 10。
- 完整失效模式、告警和恢复矩阵;这些属于Step 11。
- remote config、admin override、tenant / region overlay、dynamic reload、hot adapter swap或LKG切换。
- tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth或observability store业务配置。
- 实现仓代码、实现边界、部署脚本、真实测试 / evidence /验收或commit。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供S00~S08、S01 < S02 < S03、S04/S05/S06独立lane、C01~C27和no-fallback规则 |
| `04_config_step_06_environment_profiles_matrix.md` | reviewed | 提供PROFILE-01~07来源资格、adapter mode、真实workload资格和D01~D44 profile差异 |
| `04_config_step_07_config_items.md` | reviewed_passed_to_step_8 | 提供I001~I101、40个配置组、精确类型、required / conditional、来源、作用域、生效和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | reviewed_passed_to_step_9 | 提供40项敏感分类、23个slot、S04生命周期、SEC-01~18和safe carrier边界 |
| `projects/L4-sandbox/03-详细设计.md` §13 | current formal baseline | 提供唯一raw owner、validated ref、builder、adapter、application和entry读取边界 |
| `03_ddd_step_14_config_external_binding.md` §16 | direct builder input | 提供loader -> validator -> summary -> builder -> stores -> adapters -> availability -> services -> entries顺序 |
| `03_ddd_step_06_object_contracts.md` | carrier input | 提供`SandboxRuntimeConfigSummary`、`RuntimeConfigStatus`和`AdapterAvailabilityState`既有载体 |
| `03_ddd_step_12_error_recovery.md` | error boundary input | 提供现有infra / application / entry错误映射和no raw error string规则 |
| `03_ddd_step_15_observability_audit.md` | safe output input | 提供config validation / adapter availability的log、metric、audit和diagnostic边界 |
| L1-governance / L1-artifact Step 9 | granularity reference | 参考流程、逐域、cross-field、builder、issue、停审和跨项审计结构;不复制其配置项 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 配置在什么时机加载 | Global配置在process startup、任何service / facade暴露前加载并冻结。S05只在current entry、new worker loop或new job开始时从frozen generation生成受限snapshot。S06只在test harness / simulation组装前加载fixture-owned slot。运行中无reload / hot path。 |
| 配置如何parse和type validate | S02只接受strict JSON object,duplicate key、unknown key、comment、trailing comma和alias均拒绝。S03按item allowlist独立parse scalar / single ref。merge后按Step 7类型词汇表执行required、JSON type、enum、range、list/map cardinality、unique、ref shape和forbidden body校验。 |
| 哪些配置需要cross-field validate | PROFILE / source资格、FC-01~06、handoff enablement、inbound / route closed map、retention关系、backend / boundary / capture / release组合、lease / cleanup / redline guard、cadence、telemetry / audit / redaction、deterministic fixture和S04 slot activation均需要。 |
| 哪些配置startup / reload / hot / build-time / static | I001~I101的global部分均进入startup generation;其中E字段只形成new-loop / new-job / current-entry snapshot,T字段只在test harness生效。reload/hot均unsupported。CAT-00 / NCFG-01~24和Cargo依赖纪律为static design boundary,不是runtime配置。 |
| 校验失败后如何处理 | Source / parse / schema / global cross-field / required adapter失败时不发布runtime generation。Entry selector失败只拒绝current entry;loop/job scoped值失败只拒绝current loop/job;fixture失败只阻断test/simulation。高层非法值、S04失败和real-like binding缺失均不得fallback。 |
| 是否与Step 7一致 | 是。§9.4按40个配置组回指I001~I101,§9.5按D01~D44定义parse、type、cross-field、assemble target和失败面。 |
| 每个配置域是否停审 | 完成§9.12逐域停审并通过集合校验后才可标记通过。 |
| 是否存在未校验必填、cross-field、hot rollback或`03`回写缺口 | 必须由§9.13审计。当前设计拒绝reload/hot,因此不存在“接受新值但无回滚”的路径;future reload / mixed-generation / public secret port会触发`03`回写。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 9前问题 | 本Step处理 |
|---|---|---|
| Step 5 source图 | 已有分通道原则,但ordinary parse、merge和validator阶段仍较粗 | 固定LD-01~LD-24 startup pipeline和LD-25~LD-30 scoped pipeline |
| Step 7 item表 | 每项有类型 / 生效 / 失败,但实现者仍可能自行决定校验顺序 | 按40配置组和44配置域闭合parse / type / cross / assemble / expose |
| Step 7 JSONC demo | 文档有完整JSONC,容易被误实现为runtime JSONC能力 | runtime只接受strict JSON;comment / trailing comma明确reject |
| FC / handoff规则 | 分散在item和cross-item审计中 | 统一进入activation plan,在任何S04解析或adapter构造前完成 |
| Step 8 S04 | 已定义slot和lease,但加载顺序需防止解析disabled slot | ordinary / registry / profile / cross-field全部通过后才解析active slot |
| `03` builder顺序 | 已有模块顺序,但缺少partial publication和generation一致性规则 | builder失败时不发布任何entry handle;单generation完整构造后原子发布 |
| `RuntimeConfigStatus::Degraded` | 容易被误用为安全guard降级 | 只允许valid配置下的read / maintenance / optional external telemetry surface降级;不得放宽hard guard |
| reload / LKG | Step 5已说unsupported,但失败时可能被实现成保留旧配置自动成功 | current process保持原frozen generation;新startup声明失败就是失败,不得称为reload rollback |

---

## 6. 改动前后对比

| 维度 | Step 9前 | Step 9后 |
|---|---|---|
| source处理 | 分通道和冲突规则 | 唯一selector、分源parse、semantic merge、winner校验阶段固定 |
| validation | item级失败描述 | 形成syntax、schema、type、range、ref、registry、profile、NCFG、cross、activation、material、availability层级 |
| builder | 详细设计模块顺序 | 每阶段输入 / 输出 / side effect / failure和原子发布门禁明确 |
| S04 | material生命周期独立 | 明确只消费active descriptor,disabled slot不得resolve,material不进snapshot / summary |
| scoped input | S05 / S06边界 | current-entry / loop / job / test snapshot的ceiling、registry和失败面闭合 |
| hot update | unsupported方向 | 明确无apply、rollback、LKG、mixed generation或partial hot swap路径 |
| error surface | Step 5 C / Step 8 SEC分散 | 形成stable validation issue class与safe carrier映射 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| merge前还是merge后校验 | A. 每层完整validate再merge;B. 分源syntax/type后merge,再做winner / cross-field校验 | 采用B。非法高层值必须在自身parse/type阶段失败,但required和cross-field只能针对最终semantic candidate判定。 |
| unknown key是否warning | A. warning并忽略;B. strict reject | 采用B。避免拼写错误静默落回default。 |
| availability是否属于schema validator | A. validator直接调用外部依赖;B. validator闭合ref / registry / activation,builder检查availability | 采用B。保持pure validation与adapter construction分离,并承接`03`。 |
| S04何时解析 | A. merge时;B. activation完成后、adapter构造前 | 采用B。disabled binding不得触碰provider,raw material不得进入ordinary snapshot。 |
| builder失败是否发布部分entry | A. 可发布可用entry;B. generation级原子发布 | 采用B。required capability任一失败不允许半装配;只有设计明确optional / degraded surface可在完整generation内标记。 |
| run-local值是否覆盖global | A. 形成新global config;B. 从frozen ceiling派生scoped snapshot | 采用B。S05不得扩大ceiling / registry或改hard guard。 |
| reload失败是否继续旧generation | A. 作为LKG成功;B. 当前无reload语义 | 采用B。旧process继续其既有generation不等于新配置apply成功;新启动失败应明确失败。 |
| validation issue是否进入public DTO | A. 新public schema;B. infra-private issue + existing safe error / diagnostic | 采用B。避免跳过`03`发明public config error。 |

---

## 8. Step内执行记录

| 序号 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 8 | done | 确认用户只放行Step 9 |
| 2 | 读取Step 9 SOP、书写规范§5.9和L1参考 | done | 固定必出表和粒度 |
| 3 | 读取Step 5~8、正式`03`与builder / error / observability上游 | done | 固定source、schema、S04、builder和safe output边界 |
| 4 | 提取I001~I101、40配置组、D01~D44和23 slot | done | 建立机械覆盖基线 |
| 5 | 定义加载阶段、校验taxonomy和冻结点 | done | §9.1~§9.3已闭合 |
| 6 | 完成40组与44域矩阵 | done | I001~I101、D01~D44集合校验通过 |
| 7 | 完成cross-field、profile、builder、issue和exposure矩阵 | done | §9.6~§9.11编号与表结构通过 |
| 8 | 逐域停审、跨加载审计和`03`影响判定 | done | 无unresolved conflict或当前回写项 |
| 9 | 机械校验、状态同步并停审 | done | 全部门禁通过;未创建Step 10或正式`04` |

---

## 9. 结构化中间产物

### 9.1 逻辑载体、验证层级与冻结定义

以下术语只描述`infra/config.rs`和`runtime_builder.rs`内部阶段,不是新增public DTO、domain object或要求照名实现的Rust类型:

| 逻辑术语 | 含义 | 禁止误用 |
|---|---|---|
| `SourceSelection` | 唯一config source与profile selector intent;最终PROFILE在S02/S03解析后确定 | 当作global override或multi-profile overlay |
| `ParsedSourceLayer` | 已完成来源自身syntax / shape检查的S01、S02或S03层 | 含raw material、unknown key或未解析字符串 |
| `MergedOrdinaryCandidate` | 按semantic slot执行S01 < S02 < S03后的普通候选 | 对非法winner回退低层,或把S04/S05/S06并入 |
| `ValidatedOrdinarySnapshot` | required、type、range、ref、registry、profile、NCFG和cross-field全部通过的ordinary配置 | 携带decrypted material或直接暴露给application/domain |
| `ActivationPlan` | 按PROFILE、FC-01~06、handoff、inbound、route和feature规则计算的enabled / disabled slot闭集 | 由adapter availability反向猜enablement |
| `RuntimeGeneration` | 同一validated snapshot、material lease集合、adapter registry和service set的完整装配代次 | 混用不同config_ref、partial publish或hot补adapter |
| `ScopedExecutionSnapshot` | 从已发布generation派生的current entry / loop / job参数 | 扩大global ceiling、target registry、scope registry或NCFG |

验证层级固定为下列顺序;后层不能替代前层:

| 层级 | 检查对象 | 典型检查 | 是否可调用外部依赖 |
|---|---|---|---:|
| V01 source syntax | 每个source自身 | readable、strict JSON、env parse、selector single value | 否 |
| V02 schema | source layer / merged candidate | duplicate、unknown、required、conditional presence、closed map | 否 |
| V03 scalar / collection | merged candidate | type、enum、range、unit、cardinality、unique | 否 |
| V04 ref / registry | opaque refs | family、ASCII shape、registry membership、class compatibility | 否 |
| V05 profile / static guard | complete candidate | PROFILE资格、S04/S06允许性、NCFG-01~24、S07/S08拒绝 | 否 |
| V06 cross-field | complete candidate | FC、handoff、retention、boundary、guard、redaction、fixture组合 | 否 |
| V07 activation | validated ordinary snapshot | enabled group、required adapter、active material slot闭集 | 否 |
| V08 secure material | active S04 slot | descriptor、provider qualification、class、lease、audit | 是,仅S04 |
| V09 construction / availability | concrete adapters | constructor、capability、availability、required / optional disposition | 是,仅builder / adapter |
| V10 publication | complete generation | summary、services、entry handles同代且无required failure | 否 |

冻结点:

| Freeze ID | 冻结内容 | 发生时机 | 后续允许变化 |
|---|---|---|---|
| FZ-01 | config source selection与profile selector intent | 读取S02前;最终PROFILE待LD-06确定 | 当前startup内source不变;selector intent不可追加 |
| FZ-02 | 最终PROFILE、`ValidatedOrdinarySnapshot`与redacted config identity | LD-06确定PROFILE且V01~V07通过后 | 当前generation内不变 |
| FZ-03 | material lease、adapter registry、service set和entry handles | V08~V10通过并原子发布后 | 只按Step 8 lease规则变化;不得改变config语义 |
| FZ-04 | worker loop selector、batch、parallelism、binding | new loop start | loop中不变;新loop可重新从同generation派生 |
| FZ-05 | job batch、target、scope、timeout相关run-local选择 | new job start | 当前job中不变;不得写回global |
| FZ-06 | fixture set、clock instant、id seed、failure scenario | test / simulation case start | 当前case中不变;不得进入P05~P07 |

### 9.2 配置加载流程图

#### 配置加载流程图: L4-sandbox配置加载、校验、装配与原子发布

```text
[S03/S05 source selector + profile selector intent]
              |
              v
[select zero-or-one S02 JSON]
              |
       [strict parse S02 + parse allowlisted S03]
              v
 [S01 profile baseline < S02 < S03 < S05 profile selector]
              |
        [select one PROFILE]
              |
 [materialize profile-safe S01 + S02 + S03]
              |
 [semantic merge; invalid winner never falls back]
              |
 [required -> type/range -> ref/registry -> profile/NCFG]
              |
 [cross-field -> ActivationPlan -> ValidatedOrdinarySnapshot]
              |
 [sanitized SandboxRuntimeConfigSummary + builder state]
              |
 [resolve active S04 slots only; no material in snapshot/summary]
              |
 [stores/UoW/repositories -> adapters -> clock/id -> availability]
              |
 [application services -> API/worker/job handles]
              |
 [atomic RuntimeGeneration publish: ready / blocked / degraded]
              |
      +-------+--------+
      |                |
 [S05 scoped input] [S06 test fixture]
 ceiling/registry     fixture-owned only
      |                |
 [entry/loop/job]   [test case snapshot]
```

流程不包含reload箭头。新配置只能产生新的startup generation;旧process继续使用自己的FZ-03并不表示新配置已apply或rollback成功。

### 9.3 Startup与Scoped加载阶段契约

#### 9.3.1 Startup pipeline

| Stage | Owner | 输入 | 动作 / 校验 | 输出 | 失败与side effect |
|---|---|---|---|---|---|
| LD-01 | entry + `infra/config.rs` | S03/S05 config source selector与profile selector intent | 要求single source intent / single explicit profile intent;只冻结source选择 | FZ-01 source + selector intent | current entry reject;不读第二source;此时不假定S02内PROFILE |
| LD-02 | `infra/config.rs` | selected source ref | 读取零或一个S02;显式source不可读即失败 | raw bytes in infra-private memory | startup / entry fail-fast;不得fallback default path |
| LD-03 | strict parser | S02 bytes | JSON object parse;拒绝comment、trailing comma、duplicate key | parsed S02 object | `ParseFailed` / `DuplicateKey`;不回显body |
| LD-04 | schema decoder | parsed S02 | 顶层40模块、lowerCamelCase、known field、无alias | typed S02 layer | unknown / alias / shape reject |
| LD-05 | env decoder | process env allowlist | 仅解析Step 7含G123/G23的scalar / single ref及正式source/profile selector;empty非法 | typed S03 layer | unknown mapping / raw body / malformed reject |
| LD-06 | profile resolver + defaults provider | S01 profile baseline、S02/S03 profile值、S05 profile selector | 按S01 < S02 < S03 < S05选唯一PROFILE,再materialize该PROFILE允许的S01 safe baseline | final PROFILE + typed S01 layer | conflict / unknown profile reject;default非法视为design / startup defect |
| LD-07 | merge engine | S01/S02/S03 layers | 按semantic slot选winner并记录safe source class | merged ordinary candidate | 高层winner非法不得回退;source class不含值 |
| LD-08 | schema validator | merged candidate | required / conditional presence、closed map key count、unknown absence | schema-complete candidate | missing / cardinality fail-fast |
| LD-09 | scalar validator | schema-complete candidate | type、enum、range、unit、unique、RFC3339 | typed candidate | invalid type / range / enum fail-fast |
| LD-10 | ref validator | typed candidate | opaque ref shape、family、URI / endpoint / body deny | ref-shaped candidate | wrong family / forbidden material fail-fast |
| LD-11 | registry validator | ref-shaped candidate | membership、entry kind、class、profile compatibility | registry-qualified candidate | unknown / mismatch / ambiguity fail-fast |
| LD-12 | static guard validator | qualified candidate | NCFG-01~24、S07/S08、reload/hot、raw secret和truth override拒绝 | guard-safe candidate | design violation / unsupported activation |
| LD-13 | profile validator | guard-safe candidate | PROFILE-01~07组合、S04/S06资格、P07 inactive、real-like no-fake | profile-qualified candidate | profile reject;不得降级到P01 |
| LD-14 | cross-field validator | complete candidate | 执行XVAL闭集:FC、handoff、retention、boundary、guard、redaction等 | cross-field-safe candidate | conflict fail-fast;不构造adapter |
| LD-15 | activation planner | cross-field-safe candidate | 计算feature、consumer、route、handoff、job和23个M slot enabled闭集 | `ActivationPlan` | active依赖缺失fail-fast;disabled slot不resolve |
| LD-16 | config validator | candidate + plan | 生成FZ-02、redacted config identity、safe issue set | validated ordinary snapshot | 失败时无summary / builder / provider调用 |
| LD-17 | summary / builder bootstrap | FZ-02 | 构造sanitized `SandboxRuntimeConfigSummary`和`SandboxRuntimeBuilderState::for_config` | builder-local state | summary不含full ref、material、endpoint、topic |
| LD-18 | S04 + registry | active material slots | 校验descriptor/provider并解析每个active slot的bounded lease | adapter-local material inputs | SEC-05~13;required slot失败阻断generation |
| LD-19 | runtime builder | validated refs + required leases | 构建store registry、UoW、replay / truth / projection / derived / reference / relay repositories | repository set | 任一required store失败不开始accepted mutation |
| LD-20 | runtime builder | repositories + validated refs / leases | 构建resolver、policy、capability、backend、capture、handoff、publisher、telemetry和clock/id adapters | adapter registry | material只到对应consumer;禁止跨slot共享 |
| LD-21 | availability checker | enabled adapters | 检查required capability和availability,disabled显式标记 | `AdapterAvailabilityState` set | required unavailable blocked;允许的optional surface才可degraded |
| LD-22 | runtime disposition | summary + availability | 计算valid / startup blocked / permitted degraded与safe reason refs | complete builder disposition | degraded不得放宽policy、boundary、audit、cleanup、redline |
| LD-23 | runtime builder | complete ports / typed params | 构建application services、API handlers、worker runtimes、job runners | unpublished service / entry set | application/domain不接raw config或material |
| LD-24 | generation publisher | same-generation complete set | 校验config identity、adapter set、service set同代后原子发布 | FZ-03 runtime handles | blocked时发布0个handle;禁止partial / mixed generation |

#### 9.3.2 Scoped pipeline

| Stage | Scope | 输入 | 校验 | 输出 / 生效 | 失败策略 |
|---|---|---|---|---|---|
| LD-25 | current entry | diagnostics mode、worker kind、binding key、job request source | selector allowlist、single value、registered kind;不得携带业务body | entry-local selector | current entry reject |
| LD-26 | new worker loop | I007/I008 ceiling + typed loop input + I049 registry | batch / parallelism不超过ceiling,binding enabled且registered | FZ-04 loop snapshot | loop不启动;不clamp |
| LD-27 | new relay loop / job | I052 ceiling + route / publisher availability | batch收窄、required route group active、publisher callable | FZ-04/FZ-05 relay snapshot | current loop/job reject;relay truth不删除 |
| LD-28 | new operations job | I010/I011及各group batch ceiling + typed job DTO | target / scope / binding属于startup registry,值只收窄 | FZ-05 job snapshot | current job rejected / skipped performal surface |
| LD-29 | test / simulation startup | I096~I101 + S06 fixture | profile允许fixture、required fixed clock/id、scenario formal | FZ-06 test snapshot | test / simulation fail-fast;无host / real fallback |
| LD-30 | operation call | FZ-03/FZ-04/FZ-05 handle | 只读取typed service / params;不重新读env/file/provider | current operation | adapter运行失败按`03` flow;不得触发配置reparse |

### 9.4 按40个配置组组织的加载校验表

| 配置组 / Item | 来源与加载时机 | Parse / type / range / ref | Cross-field / activation | Assemble / expose target | 失败策略 |
|---|---|---|---|---|---|
| `configIdentity` I001 | G123 + E;selector intent在FZ-01,final profile进入FZ-02 | `ProfileName`;single selector;known exact name | S01 < S02 < S03 < S05选winner;PROFILE-01~06资格;P07 reject | sanitized summary、builder profile、entry composition | global invalid startup fail-fast;E conflict current entry reject |
| `entryEnvelope` I002~I006 | G123;I006允许E;startup + current entry | bytes/page/duration范围;diagnostics仅safe/quiet | selector不得放宽I094/I095;request只能小于ceiling | API / entry typed guard params | global invalid阻断API assembly;E invalid拒绝current entry |
| `workerEnvelope` I007~I009 | G123 + bounded E;startup + new loop | page/parallelism/duration范围 | E batch / parallelism只能收窄;loop timeout不改receipt语义 | worker runtime FZ-04 params | global invalid startup fail-fast;scoped invalid loop不启动 |
| `jobEnvelope` I010~I013 | G123 + bounded E;startup + new job | page/parallelism/duration;retry ref family / registry | typed job只能收窄;retry不得改变job key / report replay | job runner FZ-05 defaults | global invalid fail-fast;job-local invalid current job reject |
| `featureAssembly` I014~I016 | G123;startup registration | bool only | FC-01~06;route/store/publisher/query/job/report依赖完整 | service / job / relay registration plan | 冲突阻断generation;不得silent disable enabled feature |
| `truthStore` I017 | G123 + active M;T仅P0 | store ref family / registry / profile | truth / UoW / audit capability mandatory;real-like no-memory fallback | truth repo、UoW、audit repo ports | required store / material / capability失败阻断startup |
| `projectionStore` I018 | G123 + active M;T仅P0 | store ref family / registry | 与query / rebuild profile兼容;不得复用truth store | projection repository port | 构造失败阻断profile;运行不可用映射degraded query |
| `derivedStore` I019 | G123 + active M;T仅P0 | store ref family / registry | I015/I016需要时必须可用;不得成为truth store | derived / reconciliation repository | startup fail-fast;无truth-store fallback |
| `referenceStore` I020 | G123 + active M;T仅P0 | store ref family / body-free capability | resolver / refresh binding兼容;禁external body | reference repository / resolver support | startup blocked或profile unqualified |
| `relayStore` I021 | G123 + active M;T仅P0 | store ref family / registry | I014=true时required;source truth no-rollback | relay repository | enabled且失败阻断startup;disabled不删已有truth |
| `replayStore` I022 | G123 + active M;T仅P0 | store ref family / idempotency/result capability | 必须支持record + stored surface parity | idempotency、stored result、receipt/report repos | 失败阻断mutation entry;不得duplicate重算 |
| `replayLifecycle` I023~I027 | G123;startup | duration seconds范围 | I026 >= I023/I024/I025;I027小于各retention;覆盖声明窗口 | replay / cleanup typed params | 任一关系冲突startup fail-fast |
| `contextSource` I028~I030 | G123 + active M;T outcome | adapter ref、freshness、timeout范围 | profile / resolver mode兼容;body-free result only | `ContextReferenceResolverPort` adapter | invalid阻断profile;runtime loss unresolved / unavailable |
| `policySource` I031~I034 | G123 + active M;T outcome | adapter / policy refs、freshness、timeout | high-risk profile存在;missing / stale仍fail-closed | `PolicySummaryPort` adapter + typed params | startup / profile blocked;无allow fallback |
| `backendCapability` I035~I038 | G123/G12 + active M;T outcome/set | adapter ref、1~16 unique backend refs、range | refs与adapter/profile/boundary/backend组合兼容 | `BackendCapabilityPort` / capability registry | mismatch阻断profile;runtime unavailable boundary reject |
| `boundaryEnforcement` I039~I040 | G123;T strict fixture | boundary / coherent template ref registry | 必须声明resource/fs/network/process整体能力;与I035/I041兼容 | boundary service typed parameters | partial / unknown / unsafe组合startup fail-fast |
| `isolationBackend` I041~I043 | G123 + active M;T fake仅P0 | adapter ref、launch/inspect timeout | P01~04 non-executing;P05/P06 candidate/qualified;no host fallback | backend / lifecycle adapters | real slot / capability缺失阻断profile;无weak fallback |
| `executionCapture` I044~I048 | G123 + active M;T outcome | adapter/capture/material refs、timeout、bool | capture class兼容backend;I048联动I057/I058和redaction | capture adapter / observability activation | active binding不完整startup fail-fast;运行失败不伪success |
| `inboundEvents` I049 | G12 + per-active M;T feed;E选binding | closed 9-key map;enabled/source/schema/quarantine shape | enabled binding需source、schema allowlist、quarantine和对应adapter slot | consumer registry / worker FZ-04 | global map错误阻断startup;E unknown loop不启动 |
| `eventPublisher` I050 | G123 + active M;T outcome | publisher adapter ref / registry | I014=true时required;availability不改变event schema | publisher port | enabled且失败阻断startup;runtime failure no-rollback |
| `eventRoutes` I051 | G12 + per-active M | exact 13-key closed map;route family | FC-01~06计算active routes;real route slot逐项满足 | topic-neutral route map | missing / unknown / wrong class阻断startup |
| `eventRelay` I052~I054 | G123 + bounded E | batch、retry ref、timeout范围 | E只收窄;publisher/route/relay store必须active | relay loop / job FZ-04/FZ-05 | global invalid fail-fast;scoped invalid current run reject |
| `materialHandoff` I055~I056 | G123/G12 + active M;T outcome;E选target | adapter ref、0~16 unique target refs | `targetRefs != []`唯一enablement;class兼容;E为registry子集 | material handoff adapter / target registry | active依赖失败startup fail-fast;E unknown job reject |
| `observabilityHandoff` I057~I058 | G123/G12 + active M;T outcome | adapter ref、0~16 unique safe targets | I048=false要求[];true要求1~16、adapter、redaction完整 | observability handoff registry | conflict startup fail-fast;运行失败不影响formal audit |
| `investigationHandoff` I059~I060 | G123/G12 + active M;T outcome;E选target | adapter ref、0~16 approved targets | I074=false要求[];true要求adapter + 1~16 targets | investigation handoff registry | conflict阻断startup;runtime失败保持contained / pending |
| `handoffDelivery` I061~I064 | G123 + bounded E | retry ref、retention、timeout、batch | retention覆盖retry window;E只收窄;no truth rollback | retry wrapper / handoff job params | global invalid fail-fast;scoped invalid job reject |
| `leaseSafety` I065~I067 | G123 + bounded E;S06只给state | lease/cadence refs、batch范围 | profile与backend handle兼容;expiry只触发guarded inspect | boundary establishment lease params / orphan reaper | global invalid阻断boundary establishment;E invalid current scan reject |
| `cleanupSafety` I068~I070 | G123 + bounded E | cadence / strict guard refs、batch | guard不得force-clean;missing evidence / handoff / investigation / redline保持blocked | cleanup service / job params | unsafe profile startup fail-fast;job override越界reject |
| `backendRelease` I071~I073 | G23 + active M / G123 | optional adapter ref、retry ref、timeout | null必须复用I041且capability含release;guard先于调用 | release adapter / retry wrapper | unsupported / material失败startup blocked;runtime orphan保持blocked |
| `redlineSafety` I074~I075 | G123 | bool、cadence ref | handoff bool只控制外部handoff;containment与cleanup block不可关闭 | redline service / maintenance job | conflict startup fail-fast;不得advisory-only |
| `referenceRefresh` I076~I078 | G123 + bounded E | freshness、batch、cadence | E只收窄;只更新body-free reference state | guards / refresh job params | global invalid fail-fast;scoped invalid job reject |
| `projectionMaintenance` I079~I081 | G123 + bounded E | freshness、batch、cadence | query no-write;rebuild不得repair truth | query params / rebuild job | global invalid fail-fast;scoped invalid job reject |
| `derivedMaintenance` I082~I084 | G123 + bounded E | batch、comparison scope、cadence | scope必须registered;I015/I016组合;derived不成truth | derived / reconciliation job params | invalid startup / current job reject |
| `reconciliationMaintenance` I085 | G123;startup schedule | cadence ref / registry | I016决定registration;finding不auto-fix | reconciliation job registry | invalid fail-fast;disabled时不注册 |
| `runtimeTelemetry` I086~I090 | G123 + active M for external sinks | sink refs、log enum、sampling/label refs | label low-cardinality;sampling不移除security / startup diagnostics | infra-private log/metric hooks | invalid config fail-fast;qualified optional external sink runtime loss可degraded |
| `auditTrace` I091 | G123;startup | audit route ref / registry | 必须与I017同UoW且不可disable / async-loss | truth UoW audit route | 任一不满足阻断accepted mutation / startup |
| `diagnostics` I092~I093 | G123;startup | safe surface / retention refs | 只允许body-free diagnostic;external surface需先回写`03` | infra / entry diagnostic mapper | invalid startup fail-fast;不得输出raw排障 |
| `safeOutput` I094~I095 | G123/G12;startup | redaction ref、unique forbidden enum list | I095含17类immutable floor;所有profile相同或更严 | all carrier output gates | 缺类 / unsafe profile阻断startup |
| `deterministicAdapters` I096~I097 | G123 + T controls value;startup/test | clock/id adapter ref registry | P01~04与fixture组合;P05~P07禁止fixture override | clock/id ports | profile mismatch startup / test fail-fast |
| `testFixtures` I098~I101 | G12 + T;test/simulation only | fixture ref、UTC instant、u64、unique scenario refs | P02/P04和fixture-owned scenario按条件required;P05~P07出现即reject | FZ-06 fake registries / scenario injection | test / simulation fail-fast;不得切host / real dependency |

### 9.5 按D01~D44组织的加载 / 校验 / 生效表

| Domain | Item / carrier | Parse / type validate | Cross-field / activation | Assemble target / exposure | 失败策略 |
|---|---|---|---|---|---|
| D01 config source intake | S03/S05 source selector,无JSON key | path / selector single value,explicit readable | 只选零或一个S02;无overlay / fallback | `infra/config.rs` source handle | current entry / startup reject |
| D02 runtime profile / identity | I001 + S05 selector + derived config_ref | known `ProfileName`;canonical digest input body-free | LD-06选final profile;PROFILE资格、selector一致;identity不含raw value | summary profile / redacted identity | startup / entry reject |
| D03 startup validation | derived validator result | V01~V10 issue set | required / NCFG / cross-field全闭合 | `RuntimeConfigStatus` / safe issues | blocked时不发布handle |
| D04 runtime builder / registry | derived plan / refs | same-generation refs only | active adapter / store / material / availability完整 | builder state、registries、service set | required failure generation blocked |
| D05 sync API envelope | I002~I006 | bytes/page/duration/diagnostic enum | entry selector不放宽redaction / metadata | API typed guards | startup / current entry reject |
| D06 worker envelope | I007~I009 | page/parallelism/duration | loop input只收窄,绑定已注册 | worker FZ-04 | loop不启动 |
| D07 job envelope | I010~I013,I025 | page/parallelism/duration/retry ref | job input只收窄,retention覆盖rerun | job FZ-05 | current job reject |
| D08 feature assembly | I014~I016 | bool | FC-01~06 | service / route / job registration plan | startup fail-fast |
| D09 truth / audit / UoW store | I017,I091 | store/audit refs | UoW + audit atomicity mandatory | truth repo / UoW / audit repo | startup blocked |
| D10 projection / derived store | I018,I019 | store refs | I015/I016依赖;no truth fallback | projection / derived repos | startup blocked / query degraded only at runtime |
| D11 reference store | I020 | store ref / body-free capability | resolver / refresh compatible | reference repo | startup / profile blocked |
| D12 relay store | I021 | store ref | I014=true时active | relay repo | startup blocked when active |
| D13 replay / stored surface | I022~I027 | store ref + duration ranges | retention关系和stored result parity | replay / result repos | startup blocked |
| D14 context source | I028~I030 | adapter ref + ranges | profile mode / body-free | context resolver port | startup / profile blocked |
| D15 policy source | I031~I034 | adapter/policy refs + ranges | high-risk + fail-closed | policy port | startup blocked;runtime fail-closed |
| D16 backend capability | I035~I038 | adapter + backend ref list + ranges | profile/boundary/backend compatibility | capability port / registry | profile blocked |
| D17 coherent boundary | I039,I040 | boundary/template refs | four dimensions atomic;I035/I041 compatible | boundary typed params | startup fail-fast |
| D18 backend lifecycle | I036,I041~I043 | backend refs/adapter/timeouts | P01~04 fake;P05+ candidate/qualified | backend / lifecycle adapters | profile blocked;no host fallback |
| D19 execution capture | I044~I048 | adapter/classes/timeout/bool | backend/class/handoff/redaction | capture adapter | startup blocked when active |
| D20 backend handle / lease | I065 + I041 | lease/backend refs | establish时形成handle + persisted lease;run只校验guarded lifecycle | boundary establish typed params | establishment/profile blocked |
| D21 inbound subscription | I049,I024 | exact9-key map + retention | enabled source/schema/quarantine/material | consumer registry | startup or loop blocked |
| D22 publisher | I014,I050 | bool + adapter ref | enabled时relay/route/store完整 | publisher port | startup blocked when active |
| D23 route binding | I051 | exact13-key map | active event groups / material slots | topic-neutral map | startup fail-fast |
| D24 relay delivery | I052~I054 | batch/retry/timeout | E ceiling,publisher/store/route active | relay worker/job | startup / current run reject |
| D25 material handoff | I046,I055,I056 | class/adapter/target refs | nonempty enablement,class compatibility | adapter + target registry | startup / current job reject |
| D26 observability handoff | I048,I057,I058 | bool/adapter/target refs | bool/list/adapter/redaction relation | observability handoff registry | startup blocked when enabled |
| D27 investigation handoff | I059,I060 | adapter/approved targets | I074 relation | investigation registry | startup blocked when enabled |
| D28 handoff retry | I061~I064 | retry/retention/timeout/batch | retry window,scoped ceiling,no rollback | retry job / wrapper | startup / current job reject |
| D29 lease / orphan | I043,I065~I067 | timeout/lease/cadence/batch | expiry -> inspect only;backend compatible | orphan reaper params | startup / current scan reject |
| D30 cleanup guard | I068~I070 | cadence/guard/batch | no force-clean;all blockers retained | cleanup service/job | startup / current job reject |
| D31 backend release | I071~I073 | optional adapter/retry/timeout | null reuse capability;guard first | release adapter | startup blocked / orphan remains |
| D32 redline | I060,I074,I075 | target/bool/cadence | handoff relation;containment always active | redline service/job | startup fail-fast |
| D33 reference refresh | I076~I078 | threshold/batch/cadence | body-free only,E ceiling | guards / job | startup / current job reject |
| D34 projection rebuild | I079~I081 | threshold/batch/cadence | query no-write,E ceiling | query / rebuild job | startup / current job reject |
| D35 derived view | I015,I082~I084 | bool/batch/scope/cadence | derived route / registered scope | derived query/job | startup / job reject |
| D36 reconciliation | I016,I019,I082,I085 | bool/store/batch/cadence | query/job/report required;optional route;no auto-fix | reconciliation services | startup fail-fast |
| D37 runtime log / metric | I086~I090 | refs/log enum | low-cardinality,sampling security floor | infra-private hooks | invalid startup;optional sink runtime degraded |
| D38 audit / trace | I091 | route ref | same-UoW mandatory;never disabled | existing audit repo / trace | startup blocked |
| D39 diagnostic issue | I006,I092,I093 | mode/surface/retention | safe/quiet均redacted;no external body | safe diagnostic mapper | startup / entry reject |
| D40 redaction gate | I094,I095 | ref + forbidden enum list | 17-class floor;all carriers / profiles | output gates | startup fail-fast |
| D41 profile composition | I001 + derived profile matrix | known exact profile | source/S04/S06/adapter eligibility | activation plan | profile reject |
| D42 deterministic fixture | I096~I101 | refs/instant/u64/list | P01~04 only;required pairings | fake clock/id/store/adapter states | test / startup fail-fast |
| D43 real-like composition | derived P05/P06/P07 gate | complete binding markers | no fake/host fallback;P07 inactive | qualification disposition | profile blocked / inactive |
| D44 overlay / reload trigger | no item | any S07/S08/reload/overlay declaration | NCFG-24 static reject | none | validation reject + design reopen |

### 9.6 Cross-field Validation Matrix

| Rule ID | 输入 | 必须满足 | 检测阶段 | 失败面 / 不变量 |
|---|---|---|---|---|
| XVAL-01 source / profile唯一性 | S05 source selector,I001,S02 profile,S03 profile selector | 最终恰有一个profile、至多一个S02;多个声明必须同值且无ambiguity | LD-01 / LD-07 | current entry / startup reject;无overlay |
| XVAL-02 strict source | selected S02 | readable、single strict JSON object、无duplicate / comment / trailing comma / alias | LD-02~04 | startup fail-fast;不回退另一文件或S01 |
| XVAL-03 env allowlist | S03 mappings,Step 7来源列 | 只有G123/G23的scalar / single ref可映射;G12 map/list和raw body禁止 | LD-06 | startup reject;不得忽略unknown env |
| XVAL-04 profile source资格 | I001,S01~S08 | 符合Step 6来源矩阵;S07/S08所有profile均拒绝 | LD-12~13 | profile reject;触发D44 reopen |
| XVAL-05 P0 material prohibition | PROFILE-01~04,23个M item | 无真实provider marker / material slot;只允许fake / controlled ref或T slot | LD-13 / LD-15 | profile reject;不得调用S04 |
| XVAL-06 P05+ composition | PROFILE-05~07,real bindings | P05/P06完整且无S06替代;P07当前inactive;缺binding不得回退P0 | LD-13 | profile blocked / inactive |
| XVAL-07 fixture资格 | I096~I101,PROFILE | T只在P01~P04明确场景;P02/P04按条件required;P05~P07禁止 | LD-13 / LD-29 | test/profile reject |
| XVAL-08 FC-01 | I014=false,I015 | I015必须false;普通outbound append / publisher runtime不注册 | LD-14 / LD-15 | startup fail-fast;已有relay truth不删 |
| XVAL-09 FC-02 | I014=true,I021,I050,I051,I052~I054 | relay store、publisher、relay params、10 core + 1 projection route完整 | LD-14 | startup fail-fast;publish no-rollback |
| XVAL-10 FC-03 | I015=true,I014,I019,I051 | I014=true、derived store与derived route完整 | LD-14 | startup fail-fast;只控制event append |
| XVAL-11 FC-04 | I016=true,I014=false,I019 | reconciliation query/job/report surface和derived store完整;不要求route | LD-14 | startup fail-fast;不得创建relay record |
| XVAL-12 FC-05 | I016=true,I014=true,I019,I051 | FC-02依赖与reconciliation route完整;仅有finding时append | LD-14 / runtime guard | startup fail-fast;无finding无event |
| XVAL-13 FC-06 | I016=false | reconciliation query/job不注册,route存在也不激活 | LD-15 | 禁止隐式启用或auto-fix |
| XVAL-14 inbound closed map | I049 | 恰好9个formal key;enabled项source/schema/quarantine完整且profile允许 | LD-08 / LD-14 | startup fail-fast;unsupported runtime event quarantine / reject |
| XVAL-15 route closed map | I051,FC-01~06 | 恰好13个formal key;active group均有qualified route和required slot | LD-08 / LD-15 | startup fail-fast;不得拼raw topic |
| XVAL-16 replay retention | I023~I027 | I026 >= I023/I024/I025;I027小于每个retention且窗口覆盖声明重试 | LD-14 | startup fail-fast;不得completed-without-result |
| XVAL-17 backend registry | I035,I036,I041 | capability adapter覆盖1~16 backend refs;selected backend属于集合且profile兼容 | LD-11 / LD-14 | profile blocked;不得substring猜backend |
| XVAL-18 coherent boundary | I039,I040,I035,I041 | template与backend capability共同声明resource/fs/network/process完整enforcement | LD-14 | startup/profile blocked;无partial/best-effort |
| XVAL-19 backend execution资格 | I001,I041,P01~P07 | P01~04只能non-executing fake;P05 bounded candidate;P06 qualified;P07 inactive | LD-13 | profile reject;无host-run fallback |
| XVAL-20 capture composition | I041,I044~I047 | capture adapter / size / material class与backend和profile兼容 | LD-14 / LD-15 | active failure阻断generation;不伪capture success |
| XVAL-21 material handoff enablement | I046,I055,I056 | I056非空才启用;target unique、registered、material-class兼容;adapter可用 | LD-14 / LD-15 | startup fail-fast;job selector只取子集 |
| XVAL-22 observability handoff | I048,I057,I058,I094/I095 | false -> I058=[];true -> 1~16 safe targets、adapter和redaction完整 | LD-14 | startup fail-fast;formal audit不受替代 |
| XVAL-23 investigation handoff | I059,I060,I074 | false -> I060=[];true -> 1~16 approved targets和adapter完整 | LD-14 | startup fail-fast;receipt不解除guard |
| XVAL-24 handoff lifecycle | I061~I064,target registries | pending retention覆盖声明retry window;batch只收窄;retry不改source truth | LD-14 / LD-28 | startup / job reject |
| XVAL-25 release adapter | I041,I071~I073 | I071 null时I041 capability含release;nonnull时独立qualified slot;cleanup/redline guard先行 | LD-14 / LD-18 | startup blocked;runtime orphan保持blocked |
| XVAL-26 lease / cleanup guard | I065~I070 | lease/profile/cadence兼容;expiry只触发inspect;guard不得force-clean / ignore evidence | LD-14 | startup fail-fast;job不得绕guard |
| XVAL-27 redline invariant | I060,I074,I075 | handoff可disabled,但detection / containment / cleanup block始终active | LD-12 / LD-14 | startup reject;不得advisory-only |
| XVAL-28 scoped ceiling | I007/8/10/11/52/64/67/70/77/80/82 + S05 | scoped batch / parallelism不超过global,ref / target / scope属于FZ-03 registry | LD-26~28 | current loop/job reject;不clamp |
| XVAL-29 cadence semantics | I066/68/75/78/81/84/85 | ref必须registered;manual-only表示不自动调度,不表示已执行或绕guard | LD-11 / LD-14 | startup fail-fast |
| XVAL-30 telemetry safety | I086~I090,I094/I095 | sink/profile compatible;log无trace;labels low-cardinality;sampling保留security/startup诊断 | LD-14 / LD-21 | invalid startup;optional sink runtime可degraded |
| XVAL-31 audit atomicity | I017,I091 | route属于truth UoW,accepted mutation不可disable / async-loss;store前无伪durable audit | LD-14 / LD-19 | startup blocked / mutation unavailable |
| XVAL-32 diagnostic / redaction | I006,I092~I095 | safe/quiet均执行redaction;I095包含17类floor;external surface不可私造 | LD-14 | startup / entry reject;无raw error body |
| XVAL-33 deterministic adapters | I096~I100,PROFILE | deterministic clock需I099;deterministic id需non-null I100;real-like禁T override | LD-13 / LD-29 | startup / test fail-fast |
| XVAL-34 S04 activation | ActivationPlan,23个M item,descriptor | 只解析active slot;reference-only/test-only无slot;class / consumer / cardinality匹配 | LD-15 / LD-18 | SEC-03~13;无other-provider/fake fallback |
| XVAL-35 generation一致性 | config_ref,leases,adapter registry,service/entry set | 所有对象来自同一FZ-02;required failure发布0个handle | LD-24 | generation blocked;禁止mixed partial publish |
| XVAL-36 reload / overlay prohibition | D44,S07/S08,reload/hot/LKG声明 | 当前全部unsupported;旧generation不接受新semantic state | LD-12 | validation reject + future `03/04` reopen |

### 9.7 PROFILE-01~07加载与激活矩阵

| Profile | Global来源与fixture | Ordinary validation重点 | S04 / adapter construction | 允许发布的generation | 失败策略 |
|---|---|---|---|---|---|
| PROFILE-01 local-contract | required S01;optional S02/S03;bounded S05;optional S06 | strict schema、P0 refs、NCFG、no real slot | S04禁止;in-memory / deterministic non-executing fake | contract API/worker/job shell,无真实launch | real slot / host launch意图profile reject |
| PROFILE-02 ci-contract | S01 + suite S02 / CI S03 + S05 + required fixture cases | deterministic pairings、negative guard、fixture isolation | S04禁止;T控制fake outcomes | deterministic test generation | fixture缺失test fail-fast;无real fallback |
| PROFILE-03 integration-seam | required controlled S02 / S03;bounded S05/S06 | binding/schema/route/target completeness;execution仍fake | 无生产material;controlled seam adapters only | seam-specific complete generation | candidate backend / raw body composition reject |
| PROFILE-04 operations-simulation | required simulation S02/S03/S06 + typed S05 | simulated handle、lease、cleanup、redline、replay guard | S04禁止;simulation adapters / state only | operations simulation generation | 真实release/target/material声明reject |
| PROFILE-05 backend-conformance | strict S01 + required S02/S03/S04;typed S05;无S06 adapter override | candidate backend、four-dimension boundary、capture/release、non-production material | active slots由qualified provider解析;candidate adapters完整构造 | 仅bounded conformance generation,且资格未被本文声称通过 | 缺binding / provider / capability/profile blocked |
| PROFILE-06 staging-like | required S02/S03/S04 + restricted S05;禁止S06 | P05未来资格 + durable/bus/resolver/handoff/sink全组合 | qualified non-production material和real-like adapters | conditional generation;当前not qualified | 任一fake / incomplete / unqualified binding阻断 |
| PROFILE-07 production-like | future required S02/S03/S04;S01仅safe disabled;禁S06~S08 | 完整security/capacity/evidence/runbook门禁 | 当前不调用provider或构建adapter | 不允许发布;inactive target | always activation reject until redesign / qualification |

### 9.8 生效方式、冻结与unsupported activation矩阵

| 生效方式 | 适用项 | Freeze | 发布 / 可见性 | 失败 / rollback口径 |
|---|---|---|---|---|
| static design boundary | S00 / CAT-00 / NCFG-01~24 / Cargo discipline | design-time | 无runtime value | 尝试配置即reject并回设计 |
| source / profile selection | config path、I001、safe diagnostics selector | FZ-01 | 只对当前startup可见 | 失败拒绝startup / entry;不选第二source |
| startup ordinary snapshot | I001~I101中global G123/G12/G23项 | FZ-02 | 只在infra validator / builder内 | 任一required/global conflict不构建generation |
| startup runtime generation | active stores/adapters/material/services | FZ-03 | 原子暴露API/worker/job handles | required失败发布0个handle;无partial rollback |
| new loop snapshot | I007~I009,I049,I052~I054及typed selector | FZ-04 | 当前loop | invalid loop不启动;不改变FZ-03 |
| new job snapshot | I010~I013及batch/target/scope/cadence相关E | FZ-05 | 当前job / report | current job reject / skipped;不写global |
| test / simulation snapshot | I096~I101和S06 owned slot | FZ-06 | 当前case / simulation run | fail-fast;不切host或real dependency |
| runtime material lease | active S04 slot | FZ-03 adapter boundary | 仅对应concrete adapter | 按Step 8 expiry/revocation;不改变ordinary config |
| reload | 无 | unsupported | 无新snapshot | 请求reject;旧process仍使用原generation,不称rollback成功 |
| hot update / hot adapter swap | 无 | unsupported | 无 | 请求reject;不得mixed generation |
| build-time | workspace / dependency discipline only | build graph | 非runtime config | 违规由implementation gate处理 |

### 9.9 Runtime Builder Assemble Target Table

| Validated input | Assemble target | 必须先满足 | Exposed to | 禁止暴露 / 构造 |
|---|---|---|---|---|
| I001 + derived config identity | `SandboxRuntimeConfigSummary`;builder bootstrap | V01~V07全通过 | infra builder / safe startup surface | raw config、full sensitive ref、material、endpoint、topic |
| I017,I091 | truth repo、audit repo、`SandboxUnitOfWorkManager` | store capability + same-UoW audit | application via ports | raw store config / DSN / audit body |
| I022~I027 | idempotency / stored result / receipt / report repositories | retention + replay parity | application/jobs via ports | duplicate recompute / repository direct entry access |
| I018,I019 | projection / derived repositories | no-truth-write capability | query / jobs via ports | fallback truth store / mutation path |
| I020 | reference repository | body-free capability | resolvers / jobs via port | external body / sibling truth |
| I021 | relay repository | I014 activation | relay helper / worker/job | source truth rollback capability |
| I028~I030 | context resolver adapter | profile + optional S04 + availability | `ContextReferenceResolverPort` | raw endpoint / response body |
| I031~I034 | policy adapter | fail-closed + optional S04 | `PolicySummaryPort` | policy truth / credential / allow fallback |
| I035~I043 | capability / backend / lifecycle adapter registry | profile / boundary / material / release compatibility | boundary/run/reaper via ports | host fallback / SDK body / raw handle |
| I044~I048 | capture adapter | backend + class + redaction | capture service via port | process output / material body in truth |
| I049 | inbound consumer registry | exact map + source/schema/quarantine + active slots | worker entry | payload schema rewrite / direct core success |
| I050~I054 | publisher adapter、route map、relay defaults | FC-01~06 + relay store + active slots | relay worker/job via port | raw topic、event schema mutation、truth rollback |
| I055~I064 | three handoff adapters、target registries、retry params | enablement + class + redaction + active slots | handoff services/jobs via ports | target string synthesis / receipt truth promotion |
| I065~I075 | lease/cleanup/release/redline params and adapters | guard / capability / target relations | run/reaper/cleanup/redline services | force clean / force release / advisory containment |
| I076~I085 | refresh/projection/derived/reconciliation typed params | feature + scope + cadence + no-repair | query / jobs | direct repository mutation outside ports |
| I086~I095 | telemetry、audit、diagnostic、redaction hooks | label/sampling/audit/redaction invariants | infra/api/worker/jobs output hooks | raw matched value / high-cardinality labels / audit disable |
| I096~I101 | clock/id adapters and fixture states | PROFILE + deterministic pairings | tests/simulation;clock/id ports | fixture进入P05+或application读取fixture config |
| complete same-generation port set | application services | all required availability dispositions | API / worker / jobs typed handles | raw config object、provider、concrete adapter construction |

### 9.10 Config Validation Issue Surface

下列是infra-private logical issue class,不是新增public error enum。实现只能映射到`03`既有safe infra / entry / application error与diagnostic surface;若需要新增public variant必须先回写`03`。

| Issue ID / class | 检测阶段 | Safe carrier允许字段 | Disposition | 回指 |
|---|---|---|---|---|
| CFG-VAL-01 `SourceSelectionConflict` | LD-01 | selector class、source count class、issue ref | current entry / startup reject | C07 |
| CFG-VAL-02 `SourceUnavailable` | LD-02 | redacted source marker、reason class | fail-fast | C03/C08 |
| CFG-VAL-03 `ParseFailed` | LD-03 | source marker、redacted location、issue ref | fail-fast | C03 |
| CFG-VAL-04 `DuplicateKey` | LD-03 | module / field path class、issue ref | fail-fast | C04 |
| CFG-VAL-05 `UnknownOrAliasField` | LD-04/06 | module / field name、source class | fail-fast | C05/C06 |
| CFG-VAL-06 `UnsupportedSource` | LD-06/12 | source kind、profile、issue ref | reject + design gate | C21/C27 |
| CFG-VAL-07 `EnvironmentMappingDenied` | LD-06 | env mapping name、expected source class | fail-fast | Step7 allowlist |
| CFG-VAL-08 `WinningValueInvalid` | LD-07/09 | item ID、source class、expected type/range | fail-fast;no fallback | C02 |
| CFG-VAL-09 `MissingRequired` | LD-08 | item ID / group、activation rule ref | fail-fast | C09~13 |
| CFG-VAL-10 `InvalidType` | LD-09 | item ID、expected type class | fail-fast | Step7 type |
| CFG-VAL-11 `InvalidEnumOrRange` | LD-09 | item ID、allowed / range class | fail-fast | Step7 type |
| CFG-VAL-12 `InvalidCollectionShape` | LD-08/09 | item ID、expected cardinality / closed-key set | fail-fast | I036/I049/I051/I056/58/60/I095/I101 |
| CFG-VAL-13 `InvalidRefFamily` | LD-10 | item ID、expected family、redacted issue ref | fail-fast | SEC-02 |
| CFG-VAL-14 `RegistryEntryMissingOrMismatched` | LD-11 | item ID、registry family、redacted marker | fail-fast | C15/SEC-04/06 |
| CFG-VAL-15 `ProfileCompositionRejected` | LD-13 | profile、rule ID、binding class | profile reject | XVAL-04~07/19 |
| CFG-VAL-16 `ForbiddenInvariantOverride` | LD-12 | NCFG ID / forbidden class、issue ref | reject + design correction | C22 |
| CFG-VAL-17 `CrossFieldConflict` | LD-14 | XVAL ID、involved item IDs、safe reason ref | fail-fast | C25 |
| CFG-VAL-18 `ActivationDependencyMissing` | LD-15 | owner item、feature / slot family、safe marker | generation blocked | C13/C24/SEC-05 |
| CFG-VAL-19 `ForbiddenSecretMaterial` | LD-03~12 | item path class、forbidden material class | reject + security diagnostic | C14/SEC-01/14/15 |
| CFG-VAL-20 `SecureMaterialResolutionFailed` | LD-18 | owner item、material class、redacted marker、SEC class | generation blocked | SEC-05~13/16~18 |
| CFG-VAL-21 `AdapterConstructionFailed` | LD-19/20 | adapter kind / slot、safe reason ref | generation blocked | `03` builder |
| CFG-VAL-22 `AdapterAvailabilityRejected` | LD-21/22 | adapter kind、availability state、safe failure ref | blocked或permitted degraded | `AdapterAvailabilityState` |
| CFG-VAL-23 `ScopedInputRejected` | LD-25~28 | scope kind、ceiling / registry rule、issue ref | current entry/loop/job reject | C10/C11/C18 |
| CFG-VAL-24 `FixtureCompositionRejected` | LD-29 | profile、fixture slot class、scenario ref marker | test/profile reject | C19/C20 |
| CFG-VAL-25 `GenerationConsistencyRejected` | LD-24 | generation marker、failed stage / slot set marker | publish 0 handles | SEC-18/XVAL-35 |

#### 9.10.1 Step 8 SEC-01~18检测与承接

| SEC | 首次检测 / 承接阶段 | 对应issue / state | 本Step disposition | 不得发生 |
|---|---|---|---|---|
| SEC-01 raw material in ordinary source | LD-03~12 | CFG-VAL-19 | startup / entry reject | 读取、迁移到S04或回退低层 |
| SEC-02 sensitive ref family mismatch | LD-10/11 | CFG-VAL-13/14 | startup fail-fast | substring猜family或换fake ref |
| SEC-03 P01~P04 real slot | LD-13/15 | CFG-VAL-15 | profile reject,S04不调用 | 忽略slot继续启动 |
| SEC-04 reference-only slot | LD-11/15 | CFG-VAL-14 | registry reject | 把普通profile ref当credential |
| SEC-05 active slot missing descriptor | LD-15/18 | CFG-VAL-18/20 | generation blocked | silent disable enabled capability |
| SEC-06 ambiguous provider marker | LD-11/18 | CFG-VAL-14/20 | generation blocked | 任意选择provider |
| SEC-07 provider unavailable | LD-18/21 | CFG-VAL-20/22 | required adapter blocked | stale / fake / other-provider fallback |
| SEC-08 provider denied | LD-18 | CFG-VAL-20 | fail-closed / profile unqualified | 提升principal后静默retry |
| SEC-09 material / consumer mismatch | LD-18/20 | CFG-VAL-20/21 | generation blocked | coercion或跨consumer共享 |
| SEC-10 material expired | post-LD-24 adapter lease hook | `AdapterAvailabilityState` | stop new use;runtime rebuild / termination边界 | 延期或继续新调用 |
| SEC-11 material revoked | provider / adapter runtime hook | availability + safe incident ref | stop new use;adapter stop / runtime termination / restart | silent continue或切host/fake |
| SEC-12 provider audit unavailable | LD-18 qualification | CFG-VAL-20 | binding unqualified | 无审计继续resolve |
| SEC-13 renew failed,old lease valid | post-LD-24 adapter lease hook | degraded marker + expiry class | 仅用到明确expiry,不触发config reload | 无限延长或改ordinary snapshot |
| SEC-14 unsafe output | every issue/output hook | CFG-VAL-19 + I095 gate | field reject / redacted diagnostic | truncation/plain hash后输出full ref |
| SEC-15 material to controlled workload | LD-20 + launch boundary | CFG-VAL-19/21 | generation / launch reject | guest env/argv/fs/network/process注入 |
| SEC-16 shutdown lease release failed | generation shutdown hook | safe provider release failure | 禁止lease复用于new generation | 忽略并复用handle |
| SEC-17 telemetry material loss | post-LD-24 telemetry adapter | CFG-VAL-22 / degraded state | external sink degraded;local safe diagnostic与formal audit保持 | 关闭redaction/audit排障 |
| SEC-18 partial ref rotation | LD-24 generation check | CFG-VAL-25 | reject new generation,publish 0 handles | mixed-generation partial hot swap |

所有issue禁止携带raw config value、full sensitive ref、provider marker原文、material version、endpoint、topic、SDK / HTTP body、SQL、stack、process output、artifact package、observability ledger或investigation body。Early validation在store可用前只允许sanitized local log / metric / diagnostic output;`SandboxConfigValidationAudit`只有在formal store可用且已有diagnostic marker时才可写,不得为startup error伪造accepted audit。

### 9.11 模块读取、Exposure与Side-effect边界

| 模块 / 阶段 | 可读取 | 输出 / expose | 允许side effect | 禁止事项 |
|---|---|---|---|---|
| entry binary before LD-01 | S05 source/profile/diagnostic selector | selector input | 读取selector | 读取业务config字段、secret、复杂scope |
| `infra/config.rs` LD-01~17 | raw source、env allowlist、registry metadata | FZ-02、safe summary、issues | 读file/env;sanitized diagnostic | 调业务adapter、写domain truth、输出raw value |
| S04 LD-18 | active descriptor + provider | adapter-local lease | provider resolve / native audit | disabled slot resolve、共享decrypted cache、snapshot回写 |
| `runtime_builder.rs` LD-19~24 | FZ-02、leases、validated refs | repositories、ports、services、entry handles | adapter construct / availability check | 默认allow、partial publish、application传raw config |
| concrete infra adapters | one validated binding + own lease | port implementation / availability outcome | external connect / probe按qualification | material给其他adapter或controlled workload |
| application | Step7 ports + typed params | services / formal results | 正式UoW / port调用 | 读env/file/provider/config object |
| domain / contracts | method / protocol typed inputs | truth / DTO / errors | domain operation only | runtime config schema、adapter ref、secret |
| API / worker / jobs | validated handles + FZ-04/FZ-05 params | request/receipt/report surfaces | 当前entry/loop/job | concrete adapter构造、repo直读、config reload |
| output hooks | safe issue / marker / status | log/metric/audit/diagnostic | redaction后emit | 输出deny floor字段或high-cardinality ref |
| test harness | FZ-06 + fake registry | deterministic runtime/case | fixture-owned state / failure injection | host-run / real material fallback、放宽parity |

### 9.12 加载校验逐域停审记录

| Domain | Required / type / range | Cross-field / activation | 生效 / 失败面 | 结论 |
|---|---|---|---|---|
| D01 | source selector single/readable | zero-or-one S02,no overlay | FZ-01;entry/startup reject | 通过 |
| D02 | exact profile + derived identity | selector/profile一致,body-free | summary;startup reject | 通过 |
| D03 | V01~V10完整 | all required / NCFG / XVAL | no handle on blocked | 通过 |
| D04 | same-generation validated refs | active store/adapter/material完整 | FZ-03 atomic publish | 通过 |
| D05 | I002~I006精确范围 | diagnostic不可放宽redaction | startup / entry | 通过 |
| D06 | I007~I009范围 | E只收窄 | new loop / loop reject | 通过 |
| D07 | I010~I013范围/ref | E收窄,retention覆盖 | new job / job reject | 通过 |
| D08 | I014~I016 bool | FC-01~06 | startup registration / fail-fast | 通过 |
| D09 | store/audit refs | UoW + audit atomic | startup blocked | 通过 |
| D10 | two store refs | feature依赖,no truth fallback | startup / runtime query degrade | 通过 |
| D11 | body-free store ref | resolver/refresh兼容 | startup blocked | 通过 |
| D12 | relay store ref | I014 active relation | startup blocked when active | 通过 |
| D13 | store + durations | retention / result parity | startup blocked | 通过 |
| D14 | adapter + freshness/timeout | profile/body-free | startup/profile blocked | 通过 |
| D15 | adapter/policy + ranges | high-risk/fail-closed | startup/runtime fail-closed | 通过 |
| D16 | adapter + 1~16 refs + ranges | backend/boundary/profile | profile blocked | 通过 |
| D17 | boundary/template refs | four-dimension coherent | startup fail-fast | 通过 |
| D18 | backend refs/adapter/timeouts | P01~04/P05/P06资格 | profile blocked,no host fallback | 通过 |
| D19 | capture refs/ranges/bool | backend/class/handoff | active failure blocked | 通过 |
| D20 | lease/backend refs | guarded handle lifecycle | boundary establishment/profile blocked;run不重算window | 通过 |
| D21 | exact9-key map + retention | enabled source/schema/quarantine | startup/loop blocked | 通过 |
| D22 | bool + publisher ref | active dependencies | startup blocked when active | 通过 |
| D23 | exact13-key route map | FC active routes | startup fail-fast | 通过 |
| D24 | batch/retry/timeout | E ceiling + relay dependencies | startup/current run | 通过 |
| D25 | class/adapter/targets | nonempty enablement/class | startup/job reject | 通过 |
| D26 | bool/adapter/targets | bool/list/redaction | startup blocked when active | 通过 |
| D27 | adapter/targets | I074 relation | startup blocked when active | 通过 |
| D28 | retry/retention/timeout/batch | window/ceiling/no rollback | startup/job reject | 通过 |
| D29 | timeout/lease/cadence/batch | inspect-only expiry | startup/current scan | 通过 |
| D30 | cadence/guard/batch | no force-clean/all blockers | startup/job reject | 通过 |
| D31 | optional adapter/retry/timeout | null reuse + guard first | startup blocked/orphan retained | 通过 |
| D32 | target/bool/cadence | containment always active | startup fail-fast | 通过 |
| D33 | threshold/batch/cadence | body-free + E ceiling | startup/job reject | 通过 |
| D34 | threshold/batch/cadence | query no-write + E ceiling | startup/job reject | 通过 |
| D35 | bool/batch/scope/cadence | derived feature/route/scope | startup/job reject | 通过 |
| D36 | feature/store/batch/cadence | query/job/report,no auto-fix | startup fail-fast | 通过 |
| D37 | sink/log/sampling/label | low-cardinality/security floor | startup;optional sink degraded | 通过 |
| D38 | audit route | same-UoW mandatory | startup blocked | 通过 |
| D39 | mode/surface/retention | safe/quiet both redacted | startup/entry reject | 通过 |
| D40 | redaction ref/deny list | 17-class floor/all profiles | startup fail-fast | 通过 |
| D41 | exact profile | source/material/fixture资格 | profile reject | 通过 |
| D42 | refs/instant/u64/scenarios | deterministic pairing/P01~04 | test/startup fail-fast | 通过 |
| D43 | complete real-like composition | no fake/host,P07 inactive | profile blocked/inactive | 通过 |
| D44 | no loadable item | S07/S08/reload/overlay rejected | design reopen | 通过 |

### 9.13 跨加载校验审计表

| 审计项 | 结论 | 证据 / 修正 | unresolved缺口 |
|---|---|---|---|
| I001~I101是否全覆盖 | 是 | §9.4的40组并集覆盖I001~I101且无重叠遗漏 | 无 |
| 40个配置组是否全覆盖 | 是 | §9.4从`configIdentity`到`testFixtures`各一行 | 无 |
| D01~D44是否全覆盖 | 是 | §9.5与§9.12各44行 | 无 |
| required / conditional item是否校验 | 是 | LD-08 + §9.4;conditional由XVAL闭合 | 无 |
| JSONC是否误作runtime输入 | 否 | LD-03只接受strict JSON,comment / trailing comma reject | 无 |
| duplicate / unknown / alias是否silent ignore | 否 | LD-03/04与CFG-VAL-04/05 fail-fast | 无 |
| 高优先级非法值是否fallback | 否 | LD-07 / CFG-VAL-08;winner非法直接失败 | 无 |
| S03是否可注入map/list/body | 否 | XVAL-03只允许Step7 G123/G23 scalar / single ref | 无 |
| S04是否作为ordinary优先层 | 否 | LD-18只消费ActivationPlan后的active slot | 无 |
| disabled slot是否调用provider | 否 | LD-15先闭合enabled set;XVAL-34明确禁止 | 无 |
| reference-only / test-only是否声明slot | 否 | registry validator + SEC-04;仅23个M item可active | 无 |
| P01~P04是否解析真实material | 否 | XVAL-05 / §9.7固定S04 forbidden | 无 |
| P05/P06缺binding是否回退fake | 否 | XVAL-06 / §9.7 profile blocked | 激活资格仍待后续验证,非本Step blocker |
| P07是否被误声明可启动 | 否 | PROFILE-07 always inactive reject | 无 |
| FC-01~06是否全部进入activation | 是 | XVAL-08~13逐条承接 | 无 |
| 9 inbound / 13 route闭集是否校验 | 是 | XVAL-14/15 + LD-08/15 | 无 |
| 三类handoff启用源是否唯一 | 是 | XVAL-21~23;不从adapter ref推断 | 无 |
| retention / replay完整性是否闭合 | 是 | XVAL-16与D13 | 具体外部窗口事实由后续资格确认 |
| boundary是否允许partial degrade | 否 | XVAL-18;四维必须整体成立 | 无 |
| cleanup / redline是否可配置绕过 | 否 | XVAL-26/27 + D30/D32 | 无 |
| audit / redaction是否可disable | 否 | XVAL-31/32 + D38/D40 | 无 |
| scoped input是否扩大global | 否 | LD-25~28、XVAL-28;只收窄且registry-bound | 无 |
| test fixture是否进入real-like | 否 | XVAL-07/33;P05~P07 reject | 无 |
| builder是否可能partial publish | 否 | LD-24 / XVAL-35发布0或完整generation | 无 |
| mixed-generation是否可能成立 | 否 | FZ-02/FZ-03 identity绑定;hot swap unsupported | 无 |
| reload是否存在无rollback路径 | 否 | 当前无reload / apply path;声明即CFG-VAL-06/16 reject | Step10只定义restart变更审计,不伪造hot rollback |
| `Degraded`是否放宽hard guard | 否 | LD-22只允许read/maintenance/optional telemetry;policy/boundary/audit/cleanup/redline不得degraded allow | 无 |
| validation issue是否泄露value | 否 | §9.10 safe carrier和I095 deny floor | exact issue ref生成格式留实现私有 |
| store前是否伪造durable audit | 否 | 只允许local sanitized log/metric/diagnostic;store可用后才可formal config audit | 无 |
| application/domain/contracts是否读取config | 否 | §9.9 / §9.11承接正式`03` | 无 |
| 是否发明public config/secret port | 否 | 所有新增术语均infra-private logical stage | 无 |
| 是否需要立即回写`03` | 否 | 现有summary、availability、builder和entry边界足够承接 | future trigger已登记 |

### 9.14 Historical Material / Blocker记录

| ID | 类型 | 状态 | 冲突 / 缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-CFG-LOAD-001 | design gap | resolved_for_cfg_step_9 | Step 7/8尚无完整load / validate / activate / assemble / publish顺序 | 本文件已闭合LD-01~30、40组、44域、XVAL和issue surface |
| SBX-CFG-LOAD-CARRIER-001 | carrier watch | resolved_no_writeback | `03`只有summary / availability / builder顺序,没有本Step私有阶段名 | 阶段均为infra-private语义;不新增public object / port / DTO |
| SBX-CFG-LOAD-DEGRADED-001 | safety watch | contained_by_existing_carrier | `RuntimeConfigStatus::Degraded`可能被误用为hard guard放宽 | 仅允许read / maintenance / optional telemetry surface,不得影响policy/boundary/audit/cleanup/redline |
| SBX-CFG-LOAD-PROVIDER-001 | activation blocker | open_for_p05_p06_p07_activation | provider产品、principal、endpoint和真实binding未选择 | 不阻塞Step 9/P0;激活前须闭合Step 8资格与LD-18实现 |
| SBX-CFG-LOAD-PLATFORM-001 | downstream qualification gap | open_for_05_06_07_09 | provider audit、memory/zeroization、adapter capability和atomic publication事实未验证 | 本Step不伪造通过;后续测试 / 验收 / 实施 / 运维验证 |
| SBX-CFG-LOAD-RELOAD-001 | future reopen trigger | contained_as_unsupported | remote config、admin override、reload、LKG、mixed generation和hot adapter swap无`03` contract | LD-12 / XVAL-36统一reject;未来要求时先回写`03`并重开`04` |
| SBX-CFG-LOAD-HIST-001 | historical_material | contained | 旧README/05/06的host runtime、旧env / backend / hot行为可能回流 | 未继承旧产品或host fallback;只按当前Step 5~8 /正式`03`重建 |
| SBX-DOC-GAP-TEST-001 | downstream document gap | open | 正式`05`仍是旧材料 | 不阻塞Step 9;后续覆盖LD、XVAL、issue、generation和scoped negative tests |
| SBX-DOC-GAP-ACCEPT-001 | downstream document gap | open | 正式`06`仍是旧材料 | 不阻塞Step 9;partial publish / fallback / hard-guard degrade进入veto候选 |

当前未发现阻塞Step 9完成的上游blocker。P05+ provider / platform / capability事实缺失只阻止相应profile激活,不允许用设计结论替代资格证明。

### 9.15 对下游文档的影响总表

| 下游 | 从本Step接收 | 本Step不提供 |
|---|---|---|
| `04` Step 10 | FZ-01~06、runtime generation identity、restart-only生效、safe validation issue和sensitive marker | 变更申请、审批、apply / rollback / drift算法 |
| `04` Step 11 | CFG-VAL-01~25、LD阶段失败面、blocked / permitted degraded和scoped reject | 完整失效 / 告警 / 恢复矩阵 |
| `04` Step 12 | 40组 / 44域覆盖、XVAL、builder / exposure、测试与资格缺口 | 真实测试结果、run_id、evidence alias |
| `05-测试方案.md` | strict parse、no-fallback、XVAL、S04 activation、atomic publish、scoped ceiling、safe issue测试输入 | 测试执行结果或产品qualification |
| `06-验收标准.md` | partial / mixed generation、hard-guard degraded、raw leak、fake fallback、reload bypass否决候选 | 验收签署或风险接受 |
| `07-实施计划.md` | `infra/config.rs`阶段、registry、validator、builder、S04、availability和entry publication职责 | phase / commit、ledger、planned skeleton或实现已存在事实 |
| `09-部署与运维手册.md` | source provisioning、startup generation、provider qualification、restart生效、safe startup diagnostic | 产品命令、endpoint、secret path、runbook或值班安排 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| LD-01~17 strict ordinary validation | 否 | 细化`SandboxConfigLoader` / validator私有语义,不改变public object / port | 不适用 | no_writeback |
| ActivationPlan为infra-private闭集 | 否 | 只决定已定义adapter / service registration和S04 slot,不新增业务状态 | 不适用 | no_writeback |
| S04在activation后、adapter构造前解析 | 否 | 承接Step 8与`03` builder / concrete adapter边界;material不越过infra | 不适用 | resolved_watch_no_writeback |
| same-generation atomic publication | 否 | 细化`mark runtime ready or blocked/degraded`和entry handle暴露门禁 | 不适用 | no_writeback |
| CFG-VAL-01~25为logical issue class | 否 | 不新增public error enum / DTO / audit kind | 不适用 | no_writeback |
| permitted degraded只限read / maintenance / optional telemetry | 否 | 承接既有`RuntimeConfigStatus::Degraded`不变量 | 不适用 | no_writeback |
| 若实现要求新增public config issue / secret port / summary field | 是 | 改变object / port / DTO / safe output surface | `03` Step 6 / 7 / 8 / 12 / 14 / 15 | blocker_if_requested |
| runtime reload、LKG、partial generation、hot adapter swap | 是 | 改变builder state、concurrency、一致性、rollback、audit和entry flow | `03` Step 6 / 9 / 10 / 12 / 13 / 14 / 15 | future_reopen_trigger |
| immediate material revocation callback | 是,若要求 | 需要adapter hot-stop / runtime termination callback flow | `03` Step 7 / 9 / 12 / 14 / 15 | future_reopen_trigger |

本Step没有`待回写`或`阻塞待确认`项。No-writeback成立的前提是所有新增阶段 / issue / activation术语保持infra-private,entry只收到typed handles,且runtime generation不支持reload / partial publish。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“加载阶段契约”“40个配置组加载校验表”“D01~D44加载 / 校验 / 生效表”“Cross-field Validation Matrix”“Profile矩阵”“生效与冻结矩阵”“Runtime Builder Assemble Target”“Config Validation Issue Surface”“逐域停审”和“跨加载校验审计”。

正式`04-配置设计.md` §9应回填:

1. S01/S02/S03 ordinary lane、S04 secure lane、S05 scoped lane和S06 fixture lane的完整加载图。
2. V01~V10验证层级和FZ-01~06冻结点。
3. LD-01~24 startup pipeline与LD-25~30 scoped pipeline,不得压缩成泛化五步。
4. 40个配置组加载校验表,保持I001~I101覆盖。
5. D01~D44 parse / type / cross / assemble / failure矩阵。
6. XVAL-01~36,包含FC-01~06、handoff、retention、boundary、guard、redaction、fixture和generation规则。
7. PROFILE-01~07加载与激活资格,明确P07 inactive。
8. startup / loop / job / test / S04生效方式及reload/hot unsupported。
9. builder assemble / expose边界和same-generation atomic publication。
10. CFG-VAL-01~25 safe issue surface、store前观测规则和deny floor。
11. 逐域停审、跨加载审计、historical / blocker和`03`影响判定。

正式装配不得:

- 把JSONC写成runtime格式。
- 把S04/S05/S06写成S03之上的普通优先层。
- 把material放入config snapshot / summary / application service。
- 把availability probe提前到pure schema validation或让adapter反向决定feature enablement。
- 把`Degraded`用于放宽policy、coherent boundary、audit、cleanup、redline或redaction。
- 声称reload、hot rollback、LKG、provider产品、测试evidence或profile资格已经存在。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 9 | 后续处理 |
|---|---|---:|---|
| infra-private stage是否按本文名称实现 | implementation choice | 否 | `07`可合并内部函数,但阶段顺序和门禁不可丢失 |
| config identity canonicalization / redacted marker exact算法 | implementation detail | 否 | Step 10 / `07`定义稳定输入与安全输出,禁止plain hash / raw dump |
| registry物理表示与加载方式 | product-neutral | 否 | `07`实现边界 / ADR决定;不得新增第二raw config source |
| P05/P06 provider产品和material principal | open activation gap | 否 | 激活前闭合Step 8 qualification与实施 / 运维 |
| adapter availability是否需要并行probe | implementation detail | 否 | 可并行但结果必须按同generation聚合后一次发布 |
| optional external telemetry sink的degraded判定 | defined boundary,product facts open | 否 | 只允许valid config + safe local diagnostic + formal audit不受影响时成立 |
| external retry / redelivery / scheduler窗口的真实数值 | qualification input | 否 | 当前只校验Step 7关系;P05+激活前以正式事实复核 |
| `SandboxConfigValidationAudit`何时持久化 | existing conditional rule | 否 | store可用且formal diagnostic marker存在后才可写;否则local safe surface |
| reload / LKG / remote config未来是否需要 | future reopen | 否 | Step 13/14登记;要求时先回写`03`并重开Step 4~11 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 8 | 通过 | 本次确认只放行Step 9 |
| I001~I101由40配置组完整覆盖 | 通过 | §9.4共40行,与Step 7 group和item集合一致 |
| D01~D44逐域parse / type / cross / assemble / failure闭合 | 通过 | §9.5 / §9.12各44行且集合一致 |
| LD-01~30阶段连续且owner / failure明确 | 通过 | §9.3编号与表结构校验通过 |
| XVAL-01~36连续且FC-01~06 / handoff / S04完整 | 通过 | §9.6编号连续;23个M item均映射M-capable group |
| PROFILE-01~07加载与激活资格闭合 | 通过 | §9.7 |
| startup / scoped / test / S04冻结和生效明确 | 通过 | §9.8 |
| builder assemble / exposure / atomic publish闭合 | 通过 | §9.9 / §9.11 |
| CFG-VAL-01~25 safe issue surface闭合 | 通过 | §9.10编号连续;SEC-01~18承接完整 |
| 逐域停审和跨加载审计无unresolved conflict | 通过 | §9.12 / §9.13覆盖与表结构校验通过 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future trigger已登记 |
| 未创建正式`04`、Step 10或实现类文件 | 通过 | 完成前文件检查无提前产物 |

```text
current_document = `04-配置设计.md`
current_step = Step 9 `定义配置加载、校验与生效机制`
gate_status = passed_to_step_10
next_allowed_action = Step 10已按门禁创建并完成;当前等待用户审查`04_config_step_10_change_audit_rollback.md`
formal_document_write = not_started
commit_required = no
```
