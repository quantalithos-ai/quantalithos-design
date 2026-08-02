# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/配置设计书写规范.md` §5.5
> 回填章节: `04-配置设计.md` §5 配置来源、优先级与冲突处理
> 生成日期: 2026-07-10
> 状态: reviewed_passed_to_step_6
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接 Step 3 来源链和 Step 4 分类闭集,定义来源通道、普通来源覆盖顺序、entry / run-local边界、secure material解析边界、test fixture隔离、冲突与不可用策略、D01~D44逐域来源覆盖和跨来源审计。不得定义raw key / env名、默认数值、环境矩阵、secret provider产品、加载函数实现、hot reload、部署命令、代码、测试结果、run_id、evidence alias、验收签署或commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 5 | 是。Step 4 审查点后用户回复“同意”。 |
| 项目级台账是否允许进入 Step 5 | 是。原恢复点为 `04` Step 4 `pass_wait_review`;用户确认后门禁满足。 |
| 文档级 flow 是否允许进入 Step 5 | 是。`04_config_calibration_flow.md` 原记录 Step 5 `blocked_by_step_4`;用户确认后可进入。 |
| 是否已读取 Step 3 / Step 4 | 是。已承接来源种类预览、44个配置域、CAT-00~10、NCFG-01~24、P0无hot update和D37 / D44 watch。 |
| 是否已读取 Step 5 SOP / 书写规范 | 是。必须输出来源优先级、冲突处理、逐域覆盖、停审和跨来源审计。 |
| 是否已读取直接上游 | 是。重点复读正式 `03` §13和`03_ddd_step_14_config_external_binding.md`的raw owner、config refs、entry / worker / job与builder边界。 |
| 当前状态 | 已完成并经用户确认;已传递至 Step 6 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_05_sources_priority_conflicts.md` |
| 停审方式 | 用户已完成本 Step 审查并确认进入 Step 6;Step 6 已独立完成并进入新的停审点 |
| 是否发现阻塞本 Step 的上游 blocker | 否。secret provider exact binding、D37 exact carrier和D44 overlay / reload仍是后续watch;当前来源语义不要求新增`03`契约。 |

---

## 2. 本步目标

建立唯一可判定的配置来源解析模型,使每个配置域都能回答“允许从哪里来、谁覆盖谁、什么不是覆盖、来源不可用怎么办、什么情况下必须拒绝”。

本 Step 只回答:

- code defaults、project JSON、environment variables、secure material resolver、entry-local typed selector / input、deterministic fixture的作用和优先级。
- config center、admin / emergency override当前是否受支持。
- source / profile selector、global config merge、run-local input、secret material和test fixture为何必须分通道解析。
- 同名项、重复项、alias、unknown key、非法高优先级值、必填缺失、source不可读、provider不可用如何处理。
- 普通来源是否可携带raw secret / endpoint credential / external body,以及opaque ref如何选择。
- 44个配置域分别允许 / 禁止哪些来源,使用哪条优先级链,来源不可用时阻断startup、entry、loop、job还是暴露degraded surface。
- 是否存在环境漂移、fixture污染、entry覆盖全局、secret被普通值覆盖或unsupported source被静默忽略。

本 Step 不定义:

- local / CI / integration / staging / production-like分别启用哪些source;留给Step 6。
- raw JSON key、env var名、CLI flag、schema version字面值和默认数值;留给Step 7。
- secret provider API、credential读取、缓存、轮换和审计实现;留给Step 8。
- parser / loader / validator函数、配置identity字段、启动顺序和freeze实现;留给Step 9。
- config change、drift处置、rollback和last-known-good;留给Step 10。
- remote config center、admin override、dynamic reload或tenant / region overlay的当前实现。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成并经用户确认 | 提供source type预览、唯一raw owner、entry / worker / job读取边界及D01~D44。 |
| `04_config_step_04_categories_boundaries.md` | 已完成并经用户确认 | 提供CAT-00~10、更新时机、NCFG-01~24、逐域闭集和P0无hot update。 |
| `projects/L4-sandbox/03-详细设计.md` §13 | 正式直接上游 | 提供`infra/config.rs` raw owner、runtime builder、config refs、external binding和禁止配置化边界。 |
| `03_ddd_step_14_config_external_binding.md` §8~§16 | 已完成详细设计中间产物 | 提供config section、entry / worker / job输入、adapter / store / route / target binding与builder装配顺序。 |
| `projects/L4-sandbox/03-详细设计.md` §14 | 正式安全输入 | 提供config validation safe log / diagnostic与raw secret / endpoint / topic禁止输出边界。 |
| `L1-governance` / `L1-artifact` Step 5 | 粒度参考 | 参考ordinary source、entry-local、secret和fixture分层,不复制其配置域或环境结论。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、配置flow和Step 4。 | done | 确认用户已允许进入Step 5。 |
| 2 | 读取Step 5 SOP、书写规范§5.5、Step 3来源链和正式`03`配置读取边界。 | done | 固定来源表、冲突表、逐域覆盖、停审和跨来源审计为必出。 |
| 3 | 将来源拆成global、entry / run-local、secure material、test fixture四条通道。 | done | 防止entry、secret或fixture被误写成普通覆盖层。 |
| 4 | 固定普通来源覆盖顺序和非法值处理。 | done | `S01 < S02 < S03`;高优先级非法值fail-fast,不得fallback。 |
| 5 | 定义source selection、duplicate / alias / unknown、required / optional和unsupported source规则。 | done | 冲突与不可用策略可判定。 |
| 6 | 对D01~D44逐域映射允许来源、禁止来源、优先级和不可用策略。 | done | 44个配置域无遗漏并逐域停审。 |
| 7 | 审计secret、entry、fixture、P0 / P1、profile、跨实例漂移和`03`影响。 | done | 无unresolved来源冲突或具体`03`回写项。 |
| 8 | 输出回填草稿和Step 6 handoff,更新三层状态。 | done | Step 5完成后停审,不创建Step 6文件。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| code default、file、env、secret、config center、admin override的优先级是什么 | 普通global配置固定为`SBX-SRC-01 code defaults < SBX-SRC-02 selected project JSON < SBX-SRC-03 allowlisted environment variables`。secret raw material不进入该链;选中的opaque secret ref交给`SBX-SRC-04 secure material resolver`。`SBX-SRC-05`只负责entry / run-local typed输入,`SBX-SRC-06`只负责test fixture slot。`SBX-SRC-07/08` remote config / admin override当前P0 / P1均unsupported。 |
| 同名配置多处出现时如何冲突处理 | 跨普通层由高优先级覆盖并保留redacted winner语境;高层值存在但类型、格式、范围、引用族或cross-field校验失败时立即拒绝,不得回退。单一JSON内重复key、canonical / alias并存、多个profile overlay、同一slot多个provider ref均视为歧义并拒绝。 |
| 必填项缺失时是否阻断启动 | startup snapshot必填项缺失阻断startup或相关entry装配。worker-loop必填项缺失不启动该loop并暴露明确不可用。job-run必填typed input缺失拒绝当前job。可选外围feature disabled时其target可缺失;feature enabled时依赖缺失必须阻断对应装配 / run。 |
| 配置中心或密钥系统不可用时如何处理 | remote config center当前unsupported,一旦声明即拒绝启动。secure resolver对当前profile必需时不可用,不得回退file / env raw material、fake或host-run;按域阻断startup / entry / job。可选feature disabled时不解析其secret ref。 |
| 哪些来源不能覆盖敏感配置 | code default不得提供真实secret;JSON / env / entry只允许提供明确域允许的opaque ref,不得提供password、private key、raw token、credential body、raw endpoint credential或external body。fixture只能提供test fake ref / marker。remote / admin当前没有覆盖权。 |
| 每个配置域适用哪些来源,哪些来源禁止覆盖 | §9.5对D01~D44逐域定义。适用来源为闭集,未列来源默认禁止。所有域都受NCFG-01~24约束,static boundary不接受任何source。 |
| 每个配置域来源优先级完成后是否通过停审 | 是。每域有唯一source lane、覆盖顺序和不可用策略;§9.6按11个控制面汇总停审。 |
| 是否存在secret覆盖、同名冲突或不可用策略不一致 | §9.7审计无unresolved冲突。raw secret不入ordinary chain;高层非法值不fallback;entry和fixture不覆盖global;unsupported source不忽略。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3来源链图 | 箭头明确只是source type预览,尚非优先级 | 本步建立四条解析通道和正式global覆盖顺序。 |
| Step 4 CAT-03 | entry-local已分类,但容易被当成最高全局override | 只允许选择source / profile或覆盖显式run-local field,不得改global snapshot。 |
| Step 4 CAT-06 | opaque ref与raw material尚未形成两阶段来源模型 | ordinary layer选择ref,S04安全解析material;raw value不回流ordinary config。 |
| Step 4 CAT-08 | fixture只限制环境,尚未说明是否覆盖env / file | fixture仅覆盖fixture-owned test slot,不参与global merge。 |
| profile selection | source selector、profile声明和global key可能形成循环或overlay | 先选唯一source / profile,将其规范化为单一S02层;多profile overlay当前unsupported。 |
| high-priority invalid value | 尚未裁决是否回退低层 | 一律fail-fast / reject current entry or run,不得fallback。 |
| unknown / alias key | 尚未定义 | reserved config namespace内unknown、duplicate、canonical + alias并存均拒绝。 |
| remote source | SOP要求审计config center / admin override,但上游未定义 | 当前S07 / S08 unsupported,不得silent ignore。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源模型 | 6类source按装配流向串列 | 4条解析通道 + 2类unsupported future source | 避免把secret、entry、fixture当普通override。 |
| 普通优先级 | 未锁定 | S01 defaults < S02 JSON < S03 allowlisted env | 提供唯一deterministic merge。 |
| source / profile selector | 与配置值混在来源图中 | selector lane独立;S05 / S03 / S02 declaration / S01按限定顺序选唯一profile | 避免循环和多profile overlay。 |
| 高层非法值 | 未定义fallback | fail-fast,不回退低层 | 防止操作者错误被静默吞掉。 |
| secret来源 | 只有ref / provider概念 | ordinary source选ref,S04解析raw material,两者不互相覆盖 | 支撑Step 8且防止泄露。 |
| run-local输入 | 尚未定义与global defaults关系 | 仅显式allowlisted run field可覆盖frozen default,且不得越过global ceiling / registry | 防止job input绕过startup validation。 |
| remote / admin | 未进入当前设计 | 当前P0 / P1 unsupported;声明即拒绝 | 保持无reload / override契约。 |

---

## 8. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| env非法值是否回退JSON / default | A. 回退;B. 拒绝 | 采用B。高优先级存在代表显式意图,非法时不能猜测。 |
| JSON未指定时是否总能用default | A. 总能;B. 仅该项有安全default且profile允许 | 采用B。real-like / required binding不得退回fake / disabled。 |
| env是否可覆盖任意结构 | A. 可以;B. 仅Step 7明确allowlisted scalar / ref / selector | 采用B。结构化boundary / route / target集合不能被ad hoc env body替换。 |
| entry-local是否最高优先级 | A. 全局最高;B. 仅selector / run-local lane | 采用B。它不参与global key merge。 |
| secret raw material是否可放env | A. 可以;B. 只允许opaque ref | 采用B。raw material只能由S04安全设施解析。 |
| fixture是否高于env | A. 全局高于env;B. 仅test-owned slot | 采用B。fixture不能改变global safety config或进入real-like。 |
| selected config file不可读是否回退default | A. 回退;B. 拒绝 | 采用B。显式选择的source失败必须可见。 |
| remote config / admin override是否作为P1 | A. 当前支持;B. 当前P0 / P1均unsupported | 采用B。Step 2已将dynamic config center / controlled reload列为P2,且`03`无相应契约。 |

---

## 9. 结构化中间产物

### 9.1 配置来源优先级表

| Source ID | 来源 | 优先级 / 通道 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|---|
| SBX-SRC-00 | static design boundary | 非source | CAT-00 / NCFG-01~24 | 任何来源尝试覆盖均为design violation | reject config并回设计,不得忽略。 |
| SBX-SRC-01 | code defaults | global layer 10,最低 | 明确有安全default的P0 scalar、strict profile ref、disabled optional feature、fake / in-memory test-safe binding | 被S02 / S03合法值覆盖 | default自身非法视为design / startup failure;real-like不得fallback到fake default。 |
| SBX-SRC-02 | selected project JSON | global layer 20 | startup config、structured profile、store / adapter / route / target refs、technical knobs | 覆盖S01;duplicate / unknown / alias / parse / schema错误拒绝 | 未选择且profile允许default可缺失;显式选择后不可读 / 不可解析则fail-fast。 |
| SBX-SRC-03 | allowlisted environment variables | global layer 30,最高普通层 | Step 7明确允许的scalar、opaque ref、source / profile selector和safe diagnostics selector | 覆盖S02 / S01;empty / malformed / unsafe / non-allowlisted mapping拒绝 | absent时使用低层;present但非法时拒绝,不得fallback。 |
| SBX-SRC-04 | secure material resolver | secure material lane,不参与ordinary priority | 由已选opaque secret / credential / certificate ref解析的raw material | provider只解析一个validated ref;ref family / material type不匹配拒绝 | required material不可用则阻断对应startup / entry / run;不得回退file / env raw值或fake。 |
| SBX-SRC-05 | entry-local typed selector / run input | scoped lane | config path、profile selector、diagnostics mode、worker selector、typed job field、registered target / scope selector | 只覆盖明确run-local default或选择source / profile;不得覆盖global key | required local input缺失 / 越界则拒绝当前entry / loop / job。 |
| SBX-SRC-06 | deterministic test fixture | isolated test lane | fake adapter outcome、in-memory seed、fixed clock / id、fixture refs和failure injection | 仅覆盖fixture-owned slot;不得与real-like composition合并 | fixture缺失使测试启动 / run失败;不得fallback到host-run或真实依赖。 |
| SBX-SRC-07 | remote config center | current unsupported,P2 trigger | 当前无适用域 | 任何声明、endpoint ref或overlay均拒绝 | fail-fast unsupported source;先触发NCFG-24与`03`回写。 |
| SBX-SRC-08 | admin / emergency override | current unsupported,P2 trigger | 当前无适用域 | 任何override / break-glass配置均无覆盖权 | fail-fast unsupported source;安全事件处置走正式control / investigation流程。 |

### 9.2 正式来源解析链

#### 配置来源链图: L4-sandbox 分通道解析与冻结

```text
[source / profile selector]
  code default < JSON declaration < allowlisted env < entry-local selector
                         |
                         v
              [one selected JSON/profile]
                         |
[S01 code defaults] < [S02 normalized JSON] < [S03 allowlisted env]
                         |
                         v
             [global merged candidate]
                         |
           [duplicate / unknown / type /
            cross-field / NCFG validation]
                         |
              +----------+-----------+
              |                      |
       [opaque secure refs]     [non-secret values]
              |                      |
      [S04 secure resolver]           |
              +----------+-----------+
                         v
            [validated frozen snapshot]
                         |
             +-----------+-----------+
             |                       |
 [S05 typed entry / run input]  [S06 test fixture slots]
   within frozen ceilings         test profile only
             |                       |
             +-----------+-----------+
                         v
               [runtime handle / run snapshot]
```

关键说明:

- `<`只在同一通道内表示覆盖优先级;S04 / S05 / S06不是S03之上的普通全局层。
- source / profile selector只选唯一source和profile;它不直接修改store、boundary、policy、cleanup或redline值。
- selected JSON / profile必须先规范化为单一S02层;当前不支持多个profile overlay或继承链。
- S03只映射Step 7明确allowlist的字段;unknown或结构化raw body不能通过env注入。
- S04只接收validated opaque ref,raw material不进入config summary、identity、log、audit、report或entry args。
- S05 run-local值必须落在frozen global ceiling / registered refs内;越界时拒绝,不clamp、不改global snapshot。
- S06只在test profile提供fixture-owned adapter / store / clock / id slot,不改变NCFG边界。
- 当前没有reload / last-known-good通道;每次有效变更通过新startup / loop / run快照生效。

### 9.3 Selector与分通道优先级规则

| 解析对象 | 允许来源与顺序 | 结果 | 禁止事项 |
|---|---|---|---|
| config source / path selector | S01 default < S03 allowlisted selector < S05 entry selector | 选定零或一个S02 source | 多source合并、不可读时fallback、application / domain自行读file。 |
| runtime profile selector | S01 default < S02单一声明 < S03 allowlisted selector < S05 entry selector | 选定一个profile并形成S02 normalized layer | 多profile overlay、tenant / region overlay、selector改变hard guard。 |
| global config value | S01 < S02 < S03 | 每个semantic slot恰有一个winning value / absence | S05 / S06全局覆盖、高层非法回退、unknown key silent ignore。 |
| opaque sensitive ref | 该域允许的S02 / S03选择ref;S01只可给fake / disabled安全default | 形成validated ref后交S04 | ordinary source提供raw material、多个ref同时生效、日志输出ref原文。 |
| secure material | S04对一个validated ref解析 | adapter-local受控material | 回写ordinary snapshot、fallback到raw env / file、跨ref family猜测。 |
| entry-local selector | S05显式值 > frozen entry default,仅允许字段 | 当前entry selector | 修改global config、NCFG、actor / policy / idempotency或复杂业务scope。 |
| worker-loop parameter | S05 typed loop input > frozen CAT-04 default,受global ceiling约束 | 新loop snapshot | loop中途变化、修改schema / dedup / authority。 |
| job-run parameter | S05 typed job field > frozen CAT-04 default,受global ceiling / registry约束 | 新job run snapshot | raw flag替代typed spec / idempotency、target注入、越界clamp。 |
| fixture-owned slot | test profile内S06显式fixture > test-safe S01 / S02 / S03 binding | deterministic test adapter / state | production-like启用、覆盖real secret / backend、跳过state / transaction / redaction。 |

### 9.4 冲突与不可用处理表

| Conflict ID | 冲突 / 不可用场景 | 处理规则 | 阻断边界 |
|---|---|---|---|
| SBX-SRC-C01 | 同一semantic key出现在S01 / S02 / S03且值均合法 | 按S01 < S02 < S03选winner;安全记录redacted source class | 不阻断 |
| SBX-SRC-C02 | 高优先级值empty、类型 / 格式 / range非法 | reject winning value,不得回退低层 | startup / current entry or run |
| SBX-SRC-C03 | selected JSON不可读、parse失败或schema不支持 | fail-fast;不得回退S01或另一文件 | startup |
| SBX-SRC-C04 | 单一JSON对象出现duplicate key | parser / validator拒绝,即使值相同 | startup |
| SBX-SRC-C05 | canonical key与alias / deprecated key同时出现 | 视为semantic duplicate;当前无alias兼容例外 | startup |
| SBX-SRC-C06 | reserved config namespace出现unknown key / section / env mapping | strict reject,防止拼写错误被忽略 | startup / current entry |
| SBX-SRC-C07 | source / profile selector多值或指向多个profile overlay | reject ambiguity;只允许一个selected source / profile | startup / current entry |
| SBX-SRC-C08 | explicit selector指向不存在 / 不可读source | reject explicit intent;不得使用default path | startup / current entry |
| SBX-SRC-C09 | required startup slot在merge后缺失 | fail-fast或不装配依赖该slot的entry;不得造fake / weak default | startup / entry assembly |
| SBX-SRC-C10 | required worker-loop slot缺失 | loop保持未启动并产生safe unavailable diagnostic | current loop |
| SBX-SRC-C11 | required typed job field缺失 | reject current job input并形成既有invalid / rejected report surface | current job |
| SBX-SRC-C12 | optional feature disabled且其target / credential缺失 | 不解析、不装配该外围能力;核心guard不受影响 | 不阻断core startup |
| SBX-SRC-C13 | feature enabled但adapter / route / target / credential缺失 | reject profile / assembly或current run,不得silent disable | startup / current loop or job |
| SBX-SRC-C14 | S01 / S02 / S03 / S05提供raw secret / token / private key / credential body | reject并redact diagnostic;不得echo offending value | startup / current entry or run |
| SBX-SRC-C15 | S02 / S03选择多个secret ref或ref family与slot不匹配 | reject ambiguity / type mismatch | startup |
| SBX-SRC-C16 | S04 required resolver / material不可用 | fail-fast / fail-closed per owning domain;无raw / fake fallback | startup / entry / run |
| SBX-SRC-C17 | S04 provider返回wrong material class或unverifiable response | reject provider outcome,只暴露safe diagnostic ref | startup / entry / run |
| SBX-SRC-C18 | S05值超过global ceiling、引用未注册target或试图改NCFG | reject current input;不clamp、不扩大registry | current entry / loop / job |
| SBX-SRC-C19 | S06 fixture出现在real-like / production-like composition | reject profile;不得忽略fixture继续运行 | startup |
| SBX-SRC-C20 | S06 fixture缺失或失败 | test fail-fast;不得fallback host-run / real dependency | test startup / run |
| SBX-SRC-C21 | S07 remote config或S08 admin override被声明 | unsupported source;触发NCFG-24设计门禁 | startup |
| SBX-SRC-C22 | 任一来源试图覆盖CAT-00 / NCFG-01~24 | config validation reject + design correction | startup / current input |
| SBX-SRC-C23 | real-like显式binding缺失但S01存在fake / disabled default | reject real-like profile;不得default-fallback | startup |
| SBX-SRC-C24 | enabled event缺formal kind到route的全量binding | reject assembly;不得ad hoc拼topic或只启用部分未知schema | startup / loop |
| SBX-SRC-C25 | retention / freshness / retry / cadence cross-field不满足guard | reject merged snapshot;高层值不得独立绕过相关域约束 | startup / run |
| SBX-SRC-C26 | 同一profile在多个实例解析出不同redacted config identity | 记录drift候选,不得自动互相覆盖;Step 10定义处置 | 不在本步伪造通过;production-like进入前必须可审查 |
| SBX-SRC-C27 | reload / last-known-good被当作source fallback | current unsupported;保持现有process snapshot并拒绝新机制声明 | startup / design gate |

### 9.5 按配置域组织的来源覆盖表

允许来源是闭集:只有“允许来源”列出的source可在Step 7生成该域配置项。表内`Sxx`是`SBX-SRC-xx`简写;`global`表示`S01 < S02 < S03`,`local`表示S05只作用于明确的selector / loop / run字段,`secure`表示选定opaque ref后由S04解析。未列来源默认禁止。

#### 9.5.1 SBX-CP-01 启动装配与配置身份

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D01 config source intake | S01 / S02 / S03 / S05;S06仅test source | S04 raw material;S07 / S08 | source selector:S01 < S03 < S05;selected S02唯一 | explicit source不可读 / 多source歧义则startup / entry reject | 通过 |
| SBX-CFG-D02 runtime profile / config identity | S01 / S02 / S03 / S05;S06 test profile | S04 raw value;S07 / S08 | profile selector:S01 < S02 < S03 < S05;identity在merge后生成 | invalid / unknown profile或identity生成失败则startup reject | 通过 |
| SBX-CFG-D03 startup validation | S01~S06已允许通道的resolved candidate | S07 / S08;任何NCFG override | 各通道先解析,最终一次cross-domain validation | 任一hard guard / required section失败则拒绝builder | 通过 |
| SBX-CFG-D04 runtime builder / adapter registry | S01 / S02 / S03 / S04;S06仅test adapter slot | S05 global override;S07 / S08 | global选ref -> secure resolve -> validated snapshot | required adapter / store不可用则不装配相关runtime;无fake fallback | 通过 |

#### 9.5.2 SBX-CP-02 入口与负载包络

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D05 sync API envelope | S01 / S02 / S03;S05仅diagnostics / typed entry selector | S04 / S06 / S07 / S08;S05 guard override | global;S05不覆盖body / page / timeout global ceiling | invalid envelope config阻断API装配;invalid local selector拒绝当前entry | 通过 |
| SBX-CFG-D06 worker runtime envelope | S01 / S02 / S03;S05仅typed loop selector / parameter | S04 / S06 / S07 / S08;raw worker flag | global default + S05 new-loop field,受global ceiling约束 | required loop binding缺失则loop不启动并暴露unavailable | 通过 |
| SBX-CFG-D07 job runner envelope | S01 / S02 / S03 / S05 typed job field | S04 / S06 / S07 / S08;raw flag替代spec | global default + S05 explicit run-local value,受global ceiling约束 | missing / invalid typed field拒绝当前job,不改global | 通过 |
| SBX-CFG-D08 feature assembly gate | S01 / S02 / S03 | S04 / S05 / S06 / S07 / S08;任何core guard override | global only;dependency completeness cross-check | enabled但binding不完整则reject assembly;disabled只影响外围能力 | 通过 |

#### 9.5.3 SBX-CP-03 存储、事务与重复回放

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D09 truth / audit / UoW store | S01 / S02 / S03 / S04;S06 test store | S05 / S07 / S08;real-like fake fallback | global选store / ref -> secure;S06仅test slot | required store / UoW / audit不可用则startup fail-fast | 通过 |
| SBX-CFG-D10 projection / derived store | S01 / S02 / S03 / S04;S06 test store | S05 query override;S07 / S08 | global -> secure;S06仅test slot | selected store不可用阻断装配;既有read flow可按正式degraded surface返回 | 通过 |
| SBX-CFG-D11 reference store | S01 / S02 / S03 / S04;S06 test store | S05 / S07 / S08;external body source | global -> secure;S06仅test slot | selected store不可用则startup / resolver entry unavailable | 通过 |
| SBX-CFG-D12 relay store | S01 / S02 / S03 / S04;S06 test store | S05 / S07 / S08;publisher current-truth override | global -> secure;S06仅test slot | relay enabled而store不可用则reject assembly;source truth不回滚 | 通过 |
| SBX-CFG-D13 idempotency / stored surface store | S01 / S02 / S03 / S04;S06 test store | S05 disable replay;S07 / S08 | global -> secure;retention cross-field validate | required store不可用则no mutation / startup reject;不得重跑duplicate | 通过 |

#### 9.5.4 SBX-CP-04 外部语境、策略与能力摘要

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D14 context reference source | S01 / S02 / S03 / S04;S06 test resolver | S05 truth override;S07 / S08;raw external body | global选adapter / ref -> secure;S06仅test | required resolver unavailable则command rejected / delayed,不得造summary | 通过 |
| SBX-CFG-D15 policy / authorization summary source | S01 / S02 / S03 / S04;S06 test policy summary | S05 local policy;S07 / S08;raw policy body | global选source / ref -> secure;S06 strict fixture only | source / material missing或stale仍fail-closed | 通过 |
| SBX-CFG-D16 backend capability source | S01 / S02 / S03 / S04;S06 test capability | S05 capability claim;S07 / S08 | global选probe / ref -> secure;S06 test only | unavailable / unsupported / stale则boundary reject / degraded,无weak fallback | 通过 |

#### 9.5.5 SBX-CP-05 隔离边界与执行后端

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D17 coherent boundary profile | S01 / S02 / S03;S06 strict test fixture | S04 raw profile body;S05 relax;S07 / S08 | global选opaque profile / template;S06仅test | missing / incoherent / unsupported任一维度即startup / command reject | 通过 |
| SBX-CFG-D18 isolation backend lifecycle | S01 / S02 / S03 / S04;S06 deterministic fake | S05 dynamic backend;S07 / S08;host-run fallback | global选backend ref -> secure;S06 non-real execution test only | real execution binding不可用则拒绝,不得fallback S01 fake / host | 通过 |
| SBX-CFG-D19 execution capture | S01 / S02 / S03 / S04;S06 deterministic capture | S05 raw output target;S07 / S08 | global选adapter / class -> secure;S06 test only | required capture unavailable形成formal failed / unavailable surface,不伪success | 通过 |
| SBX-CFG-D20 backend handle / lease consumption | S01 / S02 / S03 | S04 / S05 force-release / S06 / S07 / S08 | global lease profile;boundary establishment只消费frozen value并保存window;run只读持久化lease | profile缺失阻断boundary establishment;handle / release失败按formal safety flow | 通过 |

#### 9.5.6 SBX-CP-06 事件接入、发布与 relay

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D21 inbound subscription / schema | S01 / S02 / S03 / S04;S05 new-loop knobs;S06 fixture feed | S05 payload / schema override;S07 / S08 | global binding -> secure;S05 loop snapshot;S06 test source | missing credential / unsupported schema则loop unavailable / event reject or quarantine | 通过 |
| SBX-CFG-D22 event publisher adapter | S01 / S02 / S03 / S04;S06 fake publisher | S05 / S07 / S08;event schema source | global -> secure;S06 test only | publisher unavailable保留relay retry / failed fact,不回滚source truth | 通过 |
| SBX-CFG-D23 topic-neutral route binding | S01 / S02 / S03;S04仅route credential;S06 fake route | S05 ad hoc topic;S07 / S08 | global route map;credential经secure lane | enabled event缺route / credential则reject assembly | 通过 |
| SBX-CFG-D24 relay delivery / retry / dead-letter | S01 / S02 / S03 / S04;S05 typed loop / job knob | S06 / S07 / S08;S05 payload rebuild | global default + S05,受global ceiling约束;DLQ credential经S04 | required target不可用则retryable / dead-letter / failed,不删relay fact | 通过 |

#### 9.5.7 SBX-CP-07 材料、观测与调查交接

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D25 material handoff | S01 / S02 / S03 / S04;S05仅registered target / run knob;S06 fake target | S05 arbitrary target;S07 / S08;raw package | global registry -> secure;S05只能选已注册ref | target unavailable形成pending / failed marker,不回滚capture | 通过 |
| SBX-CFG-D26 observability material handoff | S01 / S02 / S03 / S04;S05 registered target;S06 fake target | S05 raw sink;S07 / S08;ledger body | global registry -> secure;S05只能选safe target | unavailable形成handoff failed / backpressure surface,不影响formal audit | 通过 |
| SBX-CFG-D27 investigation handoff | S01 / S02 / S03 / S04;S05 registered target;S06 fake target | S05 release authority;S07 / S08;investigation body | global registry -> secure;S05仅选择已注册target | unavailable保持contained / pending,不得自动release | 通过 |
| SBX-CFG-D28 handoff receipt / retry coordination | S01 / S02 / S03;S05 typed retry run field | S04第二target owner;S06 / S07 / S08 | global default + S05 run-local,受global ceiling约束 | invalid run rejected;target failure保留failed fact / report | 通过 |

#### 9.5.8 SBX-CP-08 租约、清理、reaper 与 redline

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D29 lease / orphan detection | S01 / S02 / S03;S04 inspection credential;S05 typed scan knob;S06 test fixture | S05 expiry-delete;S07 / S08 | global profile -> secure;S05 run-local受global ceiling约束 | source unavailable时scan item failed / blocked,不得直接release | 通过 |
| SBX-CFG-D30 cleanup guard evaluation | S01 / S02 / S03;S05 typed evaluation knob | S04 raw evidence;S06 / S07 / S08;force-clean | global guard profile + S05 run-local,受global ceiling约束 | missing guard / evidence source保持blocked,不得default allow | 通过 |
| SBX-CFG-D31 backend release | S01 / S02 / S03 / S04;S05 typed retry knob;S06 fake release | S05 weak target;S07 / S08 | global adapter -> secure;S05 retry受global ceiling约束;S06 test | release unavailable记录failed / pending,不得伪Released | 通过 |
| SBX-CFG-D32 redline containment / escalation | S01 / S02 / S03 / S04;S05 registered target / run knob | S05 disable / release;S06 / S07 / S08 | global containment / registry -> secure;S05只选registered ref | target unavailable保持contained并升级safe diagnostic | 通过 |

#### 9.5.9 SBX-CP-09 引用刷新、投影、派生与对账

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D33 reference refresh | S01 / S02 / S03;S05 typed scope / batch;S06 test resolver state | S04第二resolver owner;S07 / S08;external body | global default + S05,受global ceiling约束;resolver binding来自D14 | unresolved / unavailable形成failed / partial report,不写core truth | 通过 |
| SBX-CFG-D34 projection rebuild | S01 / S02 / S03;S05 typed scope / batch;S06 test store state | S04 / S07 / S08;truth repair selector | global default + S05 registered scope,受global ceiling约束 | invalid scope拒绝run;store unavailable形成failed report | 通过 |
| SBX-CFG-D35 derived inspect / preview / trend | S01 / S02 / S03;S05 typed comparison scope / batch;S06 fixture | S04 / S07 / S08;formal decision override | global default + S05 registered scope,受global ceiling约束 | invalid / unavailable形成degraded / failed report,不造truth | 通过 |
| SBX-CFG-D36 reconciliation report | S01 / S02 / S03;S05 typed scope / batch;S06 fixture | S04 / S07 / S08;auto-fix switch | global default + S05 registered scope,受global ceiling约束 | invalid run rejected;finding只进report,不修truth | 通过 |

#### 9.5.10 SBX-CP-10 可观测性、诊断与脱敏

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D37 runtime log / metric | S01 / S02 / S03 / S04 | S05 raw-debug;S06 / S07 / S08 | global sink / class -> secure;exact carrier待Step 7 | optional sink不可用可暴露degraded;不得关闭safe local diagnostics / formal audit | 通过;carrier watch |
| SBX-CFG-D38 audit / trace hook | S01 / S02 / S03 / S04 | S05 / S06 / S07 / S08;disable audit | global audit binding -> secure | required audit persistence / hook不可用则accepted mutation不得继续 | 通过 |
| SBX-CFG-D39 diagnostic issue | S01 / S02 / S03 / S04 | S05 raw detail;S06 / S07 / S08 | global safe store / handoff / retention -> secure | optional external sink不可用可degraded;safe diagnostic仍不得泄露 | 通过 |
| SBX-CFG-D40 redaction / safe output gate | S01 / S02 / S03 | S04 raw allowlist;S05 / S06 / S07 / S08 relax | global only;higher layer只能选择已验证safe profile | missing / invalid redaction配置阻断startup / output surface | 通过 |

#### 9.5.11 SBX-CP-11 环境与 deterministic test profile

| Domain ID / 配置域 | 允许来源 | 禁止来源 | 优先级 / 解析通道 | 不可用策略 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D41 profile composition | S01 / S02 / S03 / S05 selector | S04 / S06 overlay / S07 / S08 | selector:S01 < S02 < S03 < S05;只选一个profile | unknown / multi-overlay / incomplete profile拒绝startup | 通过 |
| SBX-CFG-D42 deterministic fixture / fake | S01 / S02 / S03仅test profile;S06 fixture-owned slot | S04 production material;S05 production override;S07 / S08 | test global后由S06只覆盖fixture slot | missing fixture test fail-fast;不得fallback host / real dependency | 通过 |
| SBX-CFG-D43 real-like / production-like composition | S01仅strict disabled baseline;S02 / S03 explicit refs;S04 material | S05 global override;S06 / S07 / S08 | explicit global ref -> secure;S01 fake / disabled无fallback资格 | 任一required real binding缺失 / 不可用则reject profile | 通过 |
| SBX-CFG-D44 future overlay / reload trigger | 当前无允许runtime source;design-time记录 | S01~S08作为当前config source | 无current priority | 任一声明触发NCFG-24并阻断,先回写`03` / 重开`04` | 通过;current non-config |

### 9.6 来源优先级停审记录

| 控制面 / 配置域范围 | 优先级唯一 | 冲突可判定 | 不可用策略明确 | `03`影响 | 结论 / 缺口 |
|---|---:|---:|---:|---|---|
| SBX-CP-01 / D01~D04 | 是 | 是 | 是 | 无回写 | 通过;selector、global merge、secure resolve和builder顺序分离。 |
| SBX-CP-02 / D05~D08 | 是 | 是 | 是 | 无回写 | 通过;S05只作用entry / loop / run允许字段。 |
| SBX-CP-03 / D09~D13 | 是 | 是 | 是 | 无回写 | 通过;store explicit binding不可回退fake。 |
| SBX-CP-04 / D14~D16 | 是 | 是 | 是 | 无回写 | 通过;source unavailable不造external truth / allow。 |
| SBX-CP-05 / D17~D20 | 是 | 是 | 是 | 无回写 | 通过;boundary / backend无weak source fallback。 |
| SBX-CP-06 / D21~D24 | 是 | 是 | 是 | 无回写 | 通过;route / credential / run knob分通道。 |
| SBX-CP-07 / D25~D28 | 是 | 是 | 是 | 无回写 | 通过;S05只能选registered target,不能注入target。 |
| SBX-CP-08 / D29~D32 | 是 | 是 | 是 | 无回写 | 通过;source缺失保持blocked / contained,不default release。 |
| SBX-CP-09 / D33~D36 | 是 | 是 | 是 | 无回写 | 通过;S05 scope / batch不变成truth repair。 |
| SBX-CP-10 / D37~D40 | 是 | 是 | 是 | watch_no_writeback | 通过;D37 exact carrier继续Step 7 watch。 |
| SBX-CP-11 / D41~D44 | 是 | 是 | 是 | watch_no_writeback | 通过;S06与real-like隔离,S07 / S08 unsupported。 |

### 9.7 跨来源冲突审计表

| 审计项 | 结论 | 修正 / owner口径 | unresolved缺口 |
|---|---|---|---|
| ordinary global覆盖顺序是否唯一 | 是 | S01 < S02 < S03 | 无 |
| selector是否与global merge混层 | 否 | source / profile selector先选唯一S02 / profile,不直接覆盖domain key | 无 |
| 高优先级非法值是否fallback | 否 | C02 / C03 / C08统一reject | 无 |
| duplicate / alias / unknown是否可判定 | 是 | C04~C06 strict reject | exact raw schema留Step 7 |
| raw secret是否进入file / env / entry | 否 | ordinary source只选opaque ref,S04解析material | provider exact binding留Step 8 |
| sensitive ref是否可被未授权来源覆盖 | 否 | 每域允许来源闭集;S05不可注入arbitrary ref | 无 |
| secure resolver不可用是否fallback fake / raw值 | 否 | C16 / C17 fail-fast或fail-closed | 无 |
| entry / loop / run值是否越过global ceiling | 否 | C18 reject且不clamp | exact ceiling item留Step 7 |
| fixture是否成为global最高层 | 否 | S06只覆盖fixture-owned test slot | 无 |
| fixture是否进入real-like | 否 | C19与D43 profile reject | 无 |
| remote config / admin override是否混入P0 / P1 | 否 | S07 / S08 current unsupported | P2演进留Step 13 |
| real-like是否回退S01 fake / disabled | 否 | C23与D43显式reject | 无 |
| feature disabled / enabled依赖缺失策略是否一致 | 是 | disabled外围不解析;enabled缺失reject | Step 6环境矩阵继续展开 |
| route / schema来源是否混层 | 否 | route由global config,protocol schema为NCFG-13 | 无 |
| cleanup / redline来源缺失是否default allow | 否 | D29~D32保持blocked / contained | 无 |
| observability sink缺失是否关闭formal audit | 否 | D37可degraded,D38 required audit独立 | D37 carrier watch |
| 同profile跨实例来源漂移是否被静默覆盖 | 否 | config identity用于识别drift候选,处置留Step 10 | 当前不阻塞 |
| 44个配置域是否全部覆盖 | 是 | D01~D44各出现一次 | 无 |
| 是否需要回写`03` | 未发现 | 当前只定义source语义和validation disposition,不新增carrier | D37 / D44保持watch |

### 9.8 用户重点边界到来源规则追溯

| 重点边界 | 允许来源 | 冲突 / 不可用规则 | 固定结论 |
|---|---|---|---|
| execution environment identity | S01 / S02 / S03 / S05 selector;S04仅credential | selector只选ref;missing / conflict reject | source不能生成identity / responsibility truth。 |
| resource limits | S01 / S02 / allowlisted S03;S06 strict fixture | high layer invalid不fallback;run-local不得提高ceiling | 四维coherent validation后冻结。 |
| filesystem boundary | S01 / S02 / allowlisted S03;S06 strict fixture | raw path / content / unsafe override reject | local / debug / fixture不放宽。 |
| network boundary | S01 / S02 / allowlisted ref S03;S04 credential | allowlist / policy body不入config;resolver不可用fail-closed | source只绑定enforcement / summary ref。 |
| process boundary | S01 / S02 / allowlisted S03;S06 strict fixture | unsupported profile / backend reject | 无host-run或weak fallback。 |
| tool / runtime launch policy | S01 / S02 / S03 opaque refs;S04;S06 strict fixture | missing / stale / provider unavailable fail-closed | ordinary source不携带tool semantic / policy body。 |
| artifact capture | S01 / S02 / S03 refs;S04;S06 fixture | raw output / arbitrary target injection reject | capture / target / credential分通道。 |
| observability hooks | S01 / S02 / S03 refs;S04 | sink unavailable可degraded,formal audit不可关闭 | raw endpoint / topic / secret不入ordinary values。 |
| failure classification | validated source / adapter outcome only | source conflict映射config failure,不改domain taxonomy | raw parser / provider error不造domain state。 |
| cleanup / lease / reaper | S01 / S02 / S03;S04 credential;S05 bounded run knob | source缺失保持blocked / item failed | 任何来源无force-clean / release override权。 |
| security redlines | S01 / S02 / S03 refs;S04;S05 registered target | target unavailable保持contained;S08 break-glass unsupported | 无advisory-only或普通receipt release。 |

### 9.9 对下游文档的影响总表

| 下游文档 | 从本 Step 接收什么 | 本 Step 不提供什么 |
|---|---|---|
| `04` Step 6 | S01~S08 source模型、profile selector规则、test / real隔离 | 各环境具体source组合和外部依赖矩阵尚未定义。 |
| `04` Step 7 | D01~D44允许来源闭集、global / local / secure / test lane、C01~C27 | raw key、env mapping、default值、required和exact ceiling尚未定义。 |
| `04` Step 8 | opaque ref选择与S04 secure material lane、ordinary raw value禁令 | provider产品、读取、缓存、轮换和审计尚未定义。 |
| `04` Step 9~11 | strict duplicate / unknown / high-invalid规则、freeze和source unavailable disposition | loader函数、validation message、change / drift和完整failure matrix尚未定义。 |
| `05-测试方案.md` | source precedence、invalid high layer、secret raw、fixture pollution、unsupported source负向切口 | 不提供测试用例、run_id、evidence或通过结论。 |
| `06-验收标准.md` | no fallback、no raw secret、real-like no fake、redline no default allow等veto方向 | 不提供验收阈值、evidence alias、risk acceptance或签署。 |
| `07-实施计划.md` | source lane、strict parser / validator、secure resolver和entry / run snapshot落码边界 | 不提供phase / commit boundary、implementation ledger或planned skeleton。 |
| 部署与运维手册 | selected source失败不可fallback、raw secret禁令、real-like显式binding要求 | 不提供文件路径、环境变量、secret挂载、发布命令或runbook。 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03`回写位置 | 处理状态 |
|---|---:|---|---|---|
| ordinary global优先级S01 < S02 < S03 | 否 | 配置来源语义 | 不适用 | 无回写 |
| S05只作用selector / loop / run-local字段,不覆盖global snapshot | 否 | 承接entry / worker / job typed input边界 | 不适用 | 无回写 |
| ordinary source只选opaque ref,S04解析raw material | 否 | 安全来源语义;exact provider留Step 8 | 不适用 | 无回写 |
| high layer非法、selected source不可读、duplicate / unknown均拒绝 | 否 | 承接`infra/config.rs` load / parse / validate职责 | 不适用 | 无回写 |
| S06只覆盖test fixture slot且real-like禁止 | 否 | 承接fake / durable parity与profile边界 | 不适用 | 无回写 |
| S07 remote config / S08 admin override当前unsupported | 否 | 承接P0无reload、D44 current non-config | 不适用 | 无回写 |
| D37 exact sink / sampling carrier | 否 | Step 7 watch | 不适用 | watch_no_writeback |
| 未来启用S07 / S08、overlay、reload或last-known-good | 是 | loader、snapshot、builder、audit、rollback、in-flight consistency变化 | `03` §4 / §5 / §9 / §11 / §13 / §14及Step 14 / 15 | 触发时阻塞并先回写 |

本 Step 当前没有`待回写`或`阻塞待确认`项。Step 7 / 8若发现source provenance、secure resolver或D37现有carrier不足以承载P0项,必须先回写`03`。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源优先级表”“正式来源解析链”“Selector与分通道优先级规则”“冲突与不可用处理表”“按配置域组织的来源覆盖表”和“跨来源冲突审计表”小节,了解配置来源如何确定唯一winner并保持secret / entry / fixture隔离。

正式`04-配置设计.md` §5应回填:

- S00~S08来源定义和普通global优先级。
- 分通道来源解析与冻结图。
- selector、global、secure、entry / run-local和fixture优先级规则。
- C01~C27冲突与不可用处理表。
- D01~D44逐域来源覆盖表。
- 来源优先级停审、跨来源审计和重点边界追溯。

回填要求:

- 不得把S04 / S05 / S06写成S03之上的普通global layer。
- 不得允许高优先级非法值、explicit source失败或real-like binding缺失回退低层 / fake。
- 不得允许JSON / env / entry提供raw secret、credential body或external body。
- 不得把config center、admin override、reload或last-known-good写成当前能力。
- 不得为方便省略D01~D44逐域允许 / 禁止来源和不可用策略。

---

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| project JSON exact schema、版本和raw key / env allowlist | 影响strict duplicate / unknown和mapping实现 | Step 7定义配置项,Step 9定义loader / validation。 |
| 各profile是否必须显式S02文件及哪些S01 defaults允许 | 影响source absence与real-like要求 | Step 6环境矩阵逐profile裁决。 |
| S04 secure material resolver exact port / provider / cache carrier | 可能影响`03` infra contract | Step 8前复核;需要新port / summary field则先回写`03`。 |
| D37 sink / sampling exact carrier | 可能影响runtime summary / builder | Step 7复核,保持watch。 |
| run-local field、global ceiling和registered target exact item | 影响S05 validation | Step 7逐项定义,不得先假设raw flag。 |
| config identity drift的detect / block / alert策略 | 影响多实例一致性和变更审计 | Step 10定义,本步只禁止自动互相覆盖。 |
| remote config / admin override是否进入未来P2 | 影响reload、approval、audit、rollback和NCFG-24 | Step 13记录重新打开条件。 |

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源和分通道模型已明确 | 通过 | 见§9.1~§9.3。 |
| 普通来源优先级唯一 | 通过 | S01 < S02 < S03。 |
| 冲突与不可用策略可判定 | 通过 | 见§9.4,C01~C27。 |
| 每个配置域允许 / 禁止来源已明确 | 通过 | 见§9.5,D01~D44全覆盖。 |
| secret / entry / fixture覆盖边界已明确 | 通过 | S04 / S05 / S06独立通道。 |
| 来源优先级已停审 | 通过 | 见§9.6。 |
| 跨来源冲突审计无unresolved冲突 | 通过 | 见§9.7。 |
| 对`03`影响判定已记录 | 通过 | 当前无具体回写;secure carrier / D37 / D44为watch。 |
| 可进入 Step 6 | 已通过 | 用户已确认本 Step;Step 6 `定义环境、部署profile与配置矩阵` 已独立完成并等待审查。 |
