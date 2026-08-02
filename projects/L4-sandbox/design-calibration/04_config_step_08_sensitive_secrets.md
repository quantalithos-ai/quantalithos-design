# Step 8. 定义敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/配置设计书写规范.md` §5.8
> 回填章节: `04-配置设计.md` §8 敏感配置与密钥管理
> 生成日期: 2026-07-11
> 状态: reviewed_passed_to_step_9
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接 Step 5 的 S04 独立 secure-material lane、Step 6 的 profile 资格、Step 7 的 40 个 sensitive item 与 23 个 material-capable binding,定义 ref / material 分层、infra-private 解析、存储、读取、缓存、轮换、吊销、审计和禁止输出边界。不得写 raw secret、真实 provider / endpoint / credential、部署命令、实现代码、测试结果、run_id、evidence alias、验收签署、implementation ledger、planned boundary skeleton 或 commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 8 | 是。用户已审查 Step 7 后回复“同意”,本次只放行 Step 8。 |
| 项目级台账是否允许进入 Step 8 | 是。台账恢复点为 Step 7 `pass_wait_review`,且用户已明确确认。 |
| 文档级 flow 是否允许进入 Step 8 | 是。Step 7 已完成 I001~I101、FC-01~06、handoff 启用源和机械门禁。 |
| 是否先读取 Step 7 / Step 5 / Step 6 | 是。已复核 40 个 sensitive item、23 个 `M` lane item、S04 来源规则和 PROFILE-01~07。 |
| 是否读取 Step 8 SOP / 书写规范 | 是。必须输出敏感配置表、禁止输出规则、逐项停审和跨项泄露审计。 |
| 是否读取安全上游 | 是。已复核正式 `00/01/02/03` 的 body-free、安全红线、配置读取边界和 Step 14 / 15 的 builder / observability 规则。 |
| 当前状态 | 已完成并通过机械门禁;等待用户审查 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_08_sensitive_secrets.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md` 仍不存在;只允许 Step 15 装配 |
| 停审方式 | 本 Step 完成后暂停;用户确认前不得进入 Step 9 |
| 是否发现阻塞本 Step 的上游 blocker | 否。具体 provider 产品和真实 material binding 尚未选择,阻止 P05/P06/P07 激活,但不阻塞定义产品中立安全契约。若 S04 未来需要跨 application/domain 暴露,则转为 `03` 回写 blocker。 |

---

## 2. 本步目标与非范围

本 Step 把 Step 7 的“sensitive ref 不得输出、secret item 为零”展开为可实现、可校验、可测试的安全生命周期。它必须同时避免两类错误:把所有 sensitive ref 误当 raw secret,以及把真实 credential 当普通字符串配置。

本 Step 回答:

- 40 个 Step 7 `sensitive` item 如何分为 material-capable、reference-only 和 test-only。
- 真实 token、password、private key、certificate private material、DSN credential、transport credential 等为什么不是普通配置项。
- S02 / S03 如何只选择 opaque ref,S04 如何在 infra-private 边界解析被激活 binding 的 material。
- S04 registry entry、slot descriptor、material class、resolve outcome、lease / cache 和 adapter consumer 的逻辑契约。
- P01~P07 分别能否调用 S04,真实 material 缺失、过期、吊销、类型不匹配或 provider 不可用时如何处理。
- 配置 ref 轮换、同 ref material version 轮换、过期和吊销如何区分,何时必须重启或重建 runtime。
- provider audit、config validation、adapter availability、log、metric、formal audit、report 和 public error 分别允许记录什么。
- 每个 sensitive item 如何回指 Step 5 来源、Step 7 item、Step 9 加载校验和 Step 10 变更审计。

本 Step 不定义:

- Vault、KMS、cloud secret manager、filesystem mount、orchestrator secret、HSM 或任何具体 provider 产品。
- provider endpoint、namespace、mount path、secret path、token、password、private key、certificate body、DSN、bus credential 或真实 material version。
- 真实 store、bus、backend、resolver、handoff target、telemetry sink 或 certificate 产品绑定。
- Rust trait / function signature、provider SDK 调用、zeroize crate、TLS library、loader 执行顺序或 adapter constructor 代码;Step 9 / `07` 承接私有实现。
- runtime config hot reload、adapter hot swap、tenant / region overlay、remote config center、admin / emergency override或last-known-good。
- 立即推送式 revocation callback。当前无相应 port / flow;若未来需要,必须先回写 `03`。
- 实现仓、部署命令、密钥挂载、轮换 runbook、测试结果、验收签署或真实 evidence。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供 S01~S08、S04 独立 lane、ordinary source 只选 opaque ref、raw material 不回流 snapshot 和 provider unavailable no-fallback 规则 |
| `04_config_step_06_environment_profiles_matrix.md` | reviewed | 提供 P01~P04 禁真实 S04、P05 非生产 material、P06 real-like 条件绑定、P07 inactive target |
| `04_config_step_07_config_items.md` | reviewed_passed_to_step_8 | 提供 101 个 item、40 个 sensitive item、23 个 `M` lane item、P0 registry、17 类 deny floor 和代码绑定点 |
| `projects/L4-sandbox/00-需求文档.md` | current formal baseline | 提供隔离基础定位、输出 / 观测材料安全捕获、安全红线和相邻仓 truth / body 排除 |
| `projects/L4-sandbox/01-架构设计.md` | current formal baseline | 提供产品中立 adapter、fail-closed、no weak fallback、capture / handoff / observability 分层和 redline containment |
| `projects/L4-sandbox/02-概要设计.md` | current formal baseline | 提供配置不可改变 security guard、raw body 排除和详细设计承接边界 |
| `projects/L4-sandbox/03-详细设计.md` §13 / §14 | current formal baseline | 提供 `infra/config.rs` 唯一 raw owner、sanitized summary、builder / adapter 边界、日志 / audit / report 禁止字段 |
| `03_ddd_step_14_config_external_binding.md` | direct carrier input | 提供 config -> validated refs -> runtime builder -> concrete adapter 的装配顺序和外部 binding |
| `03_ddd_step_15_observability_audit.md` | direct output boundary | 提供 config validation、adapter availability、formal audit、diagnostic 和 forbidden observability carrier |
| L2 tools/runtime/member-service 与 L1 identity/work 当前文档 | upstream reference | 只确认 sibling collaboration / secret 不得反向成为 sandbox truth 或 Cargo 业务依赖;不继承其 provider 产品或 credential |
| L1 governance / artifact Step 8 | granularity reference | 参考分级、读取图、逐项表、profile、错误、停审和泄露审计粒度;不复制其配置项或业务边界 |

---

## 4. SOP 问题回答

| SOP 问题 | 本 Step 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret | Step 7 有 40 个 `sensitive` item:23 个 material-capable、15 个 reference-only、2 个 test-only。普通 JSON 中 `secret` item 数量固定为 0。真实认证、私钥和连接 credential material 属 `secret`,只存在于 S04 provider / adapter 私有内存边界。 |
| 敏感配置如何存储,是否允许明文 | 普通 JSON / allowlisted env 只保存 opaque ref、closed map 或 ref list。registry descriptor 只保存 material class、activation predicate 和 provider binding marker,不保存 material。raw material 不得明文进入 JSON、env、argv、entry input、config snapshot、summary、truth store、audit、report、artifact 或 diagnostic。 |
| 敏感配置如何轮换 | config ref 变化必须形成新 validated snapshot并通过冷重启生效。同 ref 的 material version 轮换由 provider 产生新 version;当前基线不承诺 hot adapter swap,默认通过新 runtime generation重新解析。adapter-private bounded lease only 可在声明能力时续租,不得越过 expiry / revocation。 |
| 读取和变更是否需要审计 | 需要。provider 必须审计 resolve / renew / revoke-deny;L4-sandbox 只记录 slot family、profile、config ref、redacted binding marker、outcome、safe reason和时间ref。变更审计由 Step 10记录old/new redacted marker、change reason、validation result和生效 generation,不得记录full ref或material。 |
| 日志、错误返回、审计中如何避免泄露 | 全部载体执行 I094 redaction profile 和 I095 17 类 deny floor。允许 stable code、adapter slot、material class、availability state、redacted marker和safe reason ref;禁止 full sensitive ref、provider path、material version原文、endpoint、topic、secret、SDK / HTTP body和stack。 |
| 每项是否回指 Step 7、来源、加载和变更 | 是。§9.5逐项回指I013~I101;§9.6为23个M item定义slot条件;Step 5统一为S02/S03 ref -> S04;§9.12给Step 9 / 10承接。 |
| 每个敏感配置是否通过停审 | 完成§9.11逐项停审和机械覆盖校验后才标记通过。 |
| 是否存在raw secret、误归类、泄露或轮换缺口 | 当前无raw value入文档。provider产品和立即推送式吊销能力未选择,被登记为profile activation blocker / future `03` reopen trigger,不伪装为当前能力。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 8 前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 `sensitive` 标签 | store / adapter / target / route / safety profile都标为sensitive,容易被实现成统一secret字符串 | 拆成23个material-capable、15个reference-only和2个test-only;只有前者可声明S04 slot |
| `M` 简写 | 只表示real registry entry可声明slot,尚无slot metadata和activation算法 | 定义infra-private descriptor、resolve request/outcome、activation predicate和material class |
| S04 carrier | 现有`SandboxRuntimeConfigPort`不能输出raw material,也没有public secret port | S04固定在`infra/config.rs` / registry / concrete adapter构造内部;不修改public port、DTO或summary |
| provider产品 | 未选择 | 保持产品中立;provider qualification进入P05/P06/P07 activation gate,不写虚构endpoint / credential |
| cache / lease | 未定义raw material是否可缓存和过期后fallback | 禁止共享 / 持久化明文cache;只允许adapter-scoped bounded lease,过期/吊销不得继续或fallback |
| rotation | ref rotation、same-ref version rotation和config reload可能混写 | 分三类处理;当前只支持新snapshot / restart和声明过的adapter-private lease renew,不声称hot reload |
| audit | Step 15已有config / availability audit,但未定义secret access字段 | provider native audit负责material access;L4只复用config validation / availability surface和safe markers,不新增business audit kind |
| full sensitive ref | Step 7禁止原样输出,但未定义允许替代 | 只允许registry生成的redacted binding marker、slot family和safe reason;禁止截尾、plain hash或错误字符串回显 |
| test fixture | P02/P04有fake marker,可能被误装真实material | I098/I101只进S06 test harness;P05~P07出现即reject,fixture不调用真实S04 |

---

## 6. 改动前后对比

| 维度 | Step 8 前 | Step 8 后 |
|---|---|---|
| sensitive inventory | 40项只有敏感级别和来源简写 | 每项有存储、明文、轮换、审计和禁止输出规则 |
| material eligibility | 23项写`M`,没有统一slot契约 | 每项映射material class、cardinality、required-when、consumer和失败面 |
| P0行为 | 知道P01~04不调用S04 | 明确P0 registry entry不得声明真实slot,任何slot出现都profile reject |
| P1行为 | 知道P05~07按需S04 | 形成provider qualification、lease、rotation、revocation和activation veto |
| runtime carrier | builder消费validated refs | S04解析保持infra-private,lease只进入concrete adapter,summary / application / domain不可见 |
| no-fallback | 禁raw file/env和fake fallback | 扩展到provider unavailable、type mismatch、expired、revoked、denied和audit unavailable |
| redaction | 17类deny floor | 映射到config、provider、adapter、log、metric、audit、report、error和test artifact全部载体 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| 是否把40个sensitive item都送S04 | A. 全部解析;B. 只有`M` item可声明slot | 采用B。安全profile ref / policy ref本身不是secret;滥用S04会掩盖配置类型错误。 |
| S04是否新增public port | A. 新增application port;B. infra-private facility | 采用B。现有application/domain/contracts不得接触config / secret;public port会破坏`03`边界。 |
| 是否锁定provider产品 | A. 当前选型;B. provider-neutral qualification | 采用B。上游未给产品事实,P0也不需要真实provider;真实选型留ADR / `07` / 运维。 |
| provider ref是否放项目JSON | A. 新增provider key;B. registry-side binding marker | 采用B。Step 7没有provider key;静默新增会跳过配置项清单并形成raw source第二真相源。 |
| 是否缓存解密material | A. shared process cache;B. adapter-scoped bounded lease | 采用B。禁止跨slot共享、disk cache和snapshot回写;只允许当前adapter必要的受控内存生命周期。 |
| provider暂时不可用是否使用过期material | A. stale fallback;B. 只用仍在有效期内的现有lease | 采用B。有效lease不是fallback;过期、吊销或类型不匹配后必须停止使用。 |
| same-ref rotation是否等于config reload | A. 等价;B. 分离 | 采用B。provider version可变不等于raw config变更;当前默认新runtime generation重新解析,不承诺hot swap。 |
| 是否记录full ref或plain digest | A. 便于排障;B. registry redacted marker | 采用B。full ref暴露拓扑,plain digest对低熵ref可枚举;只能使用registry生成的非material marker。 |
| material access是否写business audit | A. 新audit event;B. provider audit + existing config/availability surface | 采用B。secret read不是sandbox accepted truth,不得伪造`SandboxAuditTrace`。 |
| immediate revocation callback | A. 当前定义;B. future reopen | 采用B。现有`03`无callback / adapter hot-stop flow;当前通过bounded lease + restart / runtime termination处理。 |

---

## 8. Step 内执行记录

| 序号 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、配置flow和Step 7 | done | 确认用户只放行Step 8 |
| 2 | 读取Step 8 SOP、书写规范§5.8和安全上游 | done | 固定必出表、读取图、停审和泄露审计 |
| 3 | 提取40个sensitive item与23个M item | done | 形成material-capable / reference-only / test-only闭集 |
| 4 | 复核`03` config / builder / observability carrier | done | S04保持infra-private,当前无需public contract回写 |
| 5 | 定义taxonomy、slot、material class和resolve outcome | done | §9.1~§9.4已闭合 |
| 6 | 逐项定义存储、轮换、审计和禁止输出 | done | §9.5~§9.6已闭合 |
| 7 | 定义profile、生命周期、输出和错误矩阵 | done | §9.7~§9.10已闭合 |
| 8 | 逐项停审、跨项审计和`03`影响判定 | done | §9.11~§10无unresolved conflict或当前回写项 |
| 9 | 机械校验、状态更新并停审 | done | 全部门禁通过;未创建Step 9或正式`04` |

---

## 9. 结构化中间产物

### 9.1 敏感级别与处理类别

| 规范级别 / 类别 | 数量 | 本项目含义 | 是否进入S04 | 处理要求 |
|---|---:|---|---:|---|
| `internal` | 61 item | 数值、bool、cadence、retention、safe output deny floor等内部参数 | 否 | 可进ordinary config;安全关键项仍需Step 10变更审计 |
| `sensitive/material-capable` | 23 item | real store / adapter / source / route / target / sink binding ref;registry entry可声明material slot | 条件是 | ordinary配置只存ref;只有activation成立且entry声明slot时解析 |
| `sensitive/reference-only` | 15 item | retry / policy / boundary / material / guard / scope / audit / diagnostic / redaction profile ref | 否 | 校验family与registry语义;不得因名称含profile/ref就送provider |
| `sensitive/test-only` | 2 item | I098 fixture set、I101 failure scenario refs | 否 | 只进S06 test harness;P05~P07禁止 |
| `secret material` | 0 ordinary item | token、password、private key、certificate private material、connection / transport credential等 | 仅S04 | 不可序列化为本项目JSON字段,不可进入任何正式输出载体 |

Reference-only 15项为 I013、I033、I036、I039、I040、I046、I053、I061、I065、I069、I072、I083、I091、I092、I094。Test-only 2项为 I098、I101。其余23项的M资格见§9.6。I048、I074、I088~I090、I095虽不是sensitive material,但属于启用 / 观测 / redaction安全控制,必须参与交叉校验和变更审计。

本 Step 使用以下逻辑术语,它们是infra-private配置语义,不是新增public DTO / domain object:

| 逻辑术语 | 含义 | 禁止误用 |
|---|---|---|
| `SensitiveBindingRef` | Step 7已验证family、profile和registry membership的full ref;只在infra内存中可见 | 输出到log / audit / report,或当作secret material |
| `SecureMaterialSlotDescriptor` | registry entry声明的material class、consumer、required-when、provider marker和lease policy | 放入项目JSON、public summary或application service |
| `ResolvedMaterialLease` | S04返回给单一concrete adapter的非序列化、受有效期约束的使用权 | clone到多个adapter、写disk、写snapshot或跨family共享 |
| `RedactedBindingMarker` | registry生成的非material、不可逆排障标记 | 字符串截尾、plain hash、full ref或provider path |
| `MaterialVersionMarker` | provider内部版本 / lease关联标记;默认仍按sensitive处理 | 输出原文、作为业务truth ref或metric label |

### 9.2 敏感配置读取图

#### 敏感配置读取图: L4-sandbox ref 选择、S04解析与adapter消费

```text
[S01 safe fake defaults / S02 JSON / S03 allowlisted env]
                         |
                         | opaque refs only
                         v
              [infra/config.rs parse + validate]
                         |
              +----------+-----------+
              |                      |
      [reference-only item]   [material-capable item]
              |                      |
       [validated registry]   [activation predicate]
                                     |
                           disabled -+-> [do not resolve]
                                     |
                                   enabled
                                     v
                         [slot descriptor lookup]
                                     |
                              [S04 resolve]
                                     |
                      [ResolvedMaterialLease]
                                     |
                         [one concrete adapter]
                                     |
                     [runtime handle / availability]

[sanitized summary / config audit / diagnostics]
  <- profile + slot family + redacted marker + outcome only
```

关键说明:

- S01~S03只选择ref;S04不是更高优先级,不得覆盖或修正ordinary配置。
- `infra/config.rs`先完成unknown / duplicate / family / profile / activation校验,未通过时不得调用provider。
- P01~P04 entry不得声明真实slot;fake / fixture永不调用S04。
- disabled binding不解析material;adapter ref存在本身不等于启用,继续遵守FC-01~06和I048/I056/I074启用源。
- lease只交给声明consumer family的一个concrete adapter;application、domain、contracts、API DTO、worker/job input不可见。
- provider raw error必须映射到stable outcome + safe reason ref;不得进入domain state或public error正文。

### 9.3 S04 Registry 与解析契约

#### 9.3.1 `SecureMaterialSlotDescriptor` 字段语义

| 字段 | 类型 / 值域 | 来源 | 是否敏感 | 规则 |
|---|---|---|---:|---|
| `owner_item_id` | `SBX-CFG-I017`~`I087`闭集中的23个M item | Step 7 item定义 | internal | 必须唯一回指配置项,不得由provider自造 |
| `binding_family` | store / adapter / source / route / target / sink family | validated registry entry | internal | 必须与Step 7 ref family一致 |
| `selected_binding_ref` | `SensitiveBindingRef` | S02 / S03 merge后的validated value | sensitive | descriptor内存关联,不得序列化到summary / audit |
| `material_class` | §9.4 `SBX-MC-01~10` | registry entry | internal | exact class mismatch必须拒绝,不得猜测转换 |
| `required_when` | Step 7 profile + feature + binding activation predicate | I001 / FC-01~06 / I048 / I056 / I074等 | internal | false时不得解析;true时缺slot或material fail-fast |
| `consumer_family` | concrete store / adapter family | Step 7 code binding | internal | lease只交给相同family consumer |
| `provider_binding_marker` | opaque provider-side marker | approved registry provisioning | sensitive | 不进入项目JSON;只允许输出其redacted marker |
| `lease_policy` | `constructor-only`或`adapter-bounded` | approved registry entry | internal | 未声明时默认constructor-only;不得自定义unbounded / stale policy |
| `audit_required` | 固定`true` | design invariant | internal | provider不能审计resolve / renew / deny则binding不qualified |

Descriptor是registry-side metadata,不是第102个项目配置项。新增项目JSON key、env mapping或public summary字段必须回到Step 7 / `03`重开,不能借descriptor绕过清单。

#### 9.3.2 Provider-neutral resolve request / outcome

| 逻辑输入 | 必须内容 | 禁止内容 |
|---|---|---|
| resolve context | config ref、profile ref、owner item ID、binding family、material class、purpose(`startup-build` / `adapter-rebuild` / `lease-renew`) | actor业务正文、command DTO、raw config body、trace / idempotency key |
| provider selector | registry私有provider marker | 项目JSON中的provider endpoint/path/token |
| binding selector | infra内存中的validated full ref | 日志或错误中的full ref |

| Outcome | 含义 | runtime处理 |
|---|---|---|
| `Resolved` | material class匹配且返回有效adapter-scoped lease | 仅交给声明consumer,随后检查adapter availability |
| `Unavailable` | provider暂不可达且无有效lease | required binding阻断startup / adapter rebuild;不得raw env/fake fallback |
| `Denied` | provider授权拒绝 | fail-closed并记录safe reason;不得重试成其他provider |
| `TypeMismatch` | material class / binding family不符 | config / registry defect,startup fail-fast |
| `Expired` | material或lease已过期 | 不得延长或使用stale material;adapter unavailable / runtime blocked |
| `Revoked` | provider确认当前version被吊销 | 立即禁止新使用;当前baseline通过adapter stop / runtime termination / restart收束 |
| `AuditUnavailable` | provider无法形成required access audit | binding不qualified,按required material不可用处理 |
| `ProviderError` | 未分类provider failure | 只输出stable category和safe reason ref,不得输出SDK / HTTP body |

### 9.4 Secret Material Class 闭集

| Class ID / 类别 | Material用途 | 对应item | 允许consumer | 明确禁止 |
|---|---|---|---|---|
| SBX-MC-01 `StoreAccessMaterial` | durable truth / projection / derived / reference / relay / replay store连接与认证 | I017~I022 | 对应logical store adapter | DSN、password、certificate private material进入config summary / repository row |
| SBX-MC-02 `ContextResolverAccessMaterial` | context reference source访问 | I028 | context resolver adapter | sibling正文、raw response、identity/work/runtime truth |
| SBX-MC-03 `PolicyCapabilityAccessMaterial` | policy summary与backend capability source访问 | I031、I035 | policy / capability adapter | policy DSL、approval body、allowlist truth、本地default allow |
| SBX-MC-04 `IsolationBackendControlMaterial` | real isolation backend establish / inspect / release control面认证 | I041、I071 | isolation / release adapter | host-run fallback、root credential输出、绕过coherent boundary |
| SBX-MC-05 `ExecutionCaptureAccessMaterial` | real capture adapter访问受控输出面 | I044 | execution capture adapter | stdout/stderr body写truth/log、credential与capture body混存 |
| SBX-MC-06 `InboundSourceAccessMaterial` | enabled inbound source / quarantine binding访问 | I049 | 对应consumer source / quarantine adapter | event payload body、raw topic、dedup key或source credential输出 |
| SBX-MC-07 `EventTransportAccessMaterial` | publisher与topic-neutral route背后的transport访问 | I050、I051 | event publisher / route adapter | raw topic / endpoint、payload、publish response或truth rollback |
| SBX-MC-08 `MaterialHandoffAccessMaterial` | candidate material handoff adapter / target访问 | I055、I056 | material handoff adapter | artifact/evidence truth、package body或receipt升格 |
| SBX-MC-09 `ObservabilityInvestigationAccessMaterial` | observability与investigation handoff adapter / target访问 | I057~I060 | 对应handoff adapter | observability ledger / investigation body、receipt解除guard |
| SBX-MC-10 `TelemetrySinkAccessMaterial` | real log / metric sink访问 | I086、I087 | infra-private telemetry sink | secret作为log field / metric label、sink替代formal audit |

Class只约束material用途和consumer,不定义provider payload schema。若具体产品要求一个slot同时提供多个class或跨consumer共享lease,默认拒绝;需要安全评审并回写本Step,若改变adapter / port边界则先回写`03`。

### 9.5 敏感配置逐项表

表内“存储”只描述配置与registry承载,不表示raw material被持久化。所有行的“明文”均指项目JSON、env、argv、config snapshot、summary、truth / projection / relay / replay store、audit、report、artifact、diagnostic和受控workload环境。

| 配置项 | 敏感级别 / 类别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| I013 `jobEnvelope.retryPolicyRef` | sensitive / reference-only | ordinary config保存registered retry policy ref | 否;不得展开算法私有参数 | 新ref + cold restart;new job只消费新snapshot | policy family、redacted marker、validation result;不记full ref |
| I017 `truthStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否;不得保存DSN / credential / endpoint | 新ref + restart;provider version按§9.8 | truth store slot、profile、redacted marker、UoW/audit capability validation |
| I018 `projectionStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否 | 新ref + restart;不得用旧material重建新projection adapter | projection slot、marker、availability result |
| I019 `derivedStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否 | 新ref + restart | derived slot、marker、no-truth-repair validation |
| I020 `referenceStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否;external body同样禁止 | 新ref + restart | reference slot、marker、body-free capability result |
| I021 `relayStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否 | 新ref + restart;已有relay truth不得删除 | relay store slot、marker、no-rollback validation |
| I022 `replayStore.profileRef` | sensitive / material-capable | ordinary ref + real registry optional S04 slot | 否 | 新ref + restart;retention / stored replay compatibility必须重验 | replay slot、marker、idempotency parity result |
| I028 `contextSource.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否;不得保存resolver response body | 新ref + restart;runtime lease loss使resolver unavailable | resolver slot、marker、availability / body-free validation |
| I031 `policySource.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否;不得保存policy body / allowlist | 新ref + restart;runtime loss始终fail-closed | policy slot、marker、denied/unavailable category |
| I033 `policySource.highRiskProfileRef` | sensitive / reference-only | ordinary strict policy profile ref | 否;profile不是approval credential | 新ref + restart;不得原地放宽 | old/new redacted marker、strictness validation |
| I035 `backendCapability.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否;不得保存probe response | 新ref + restart | capability slot、marker、freshness / unsupported result |
| I036 `backendCapability.backendProfileRefs` | sensitive / reference-only | G12 closed ref list | 否;不得编码产品endpoint / capability secret | 新list + restart;顺序canonicalize后验证 | changed family set、redacted list marker、fake/no-fallback check |
| I039 `boundaryEnforcement.boundaryProfileRef` | sensitive / reference-only | ordinary strict boundary profile ref | 否 | 新ref + restart;禁止原地放宽 | boundary slot、marker、coherence validation |
| I040 `boundaryEnforcement.limitTemplateRef` | sensitive / reference-only | ordinary coherent template ref | 否;不得包含host path正文 | 新ref + restart;四维整体重验 | template marker、resource/fs/network/process coverage result |
| I041 `isolationBackend.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否;不得注入guest/workload | 新ref + restart;material version不得切换弱backend | backend slot、marker、qualification / no-host-fallback result |
| I044 `executionCapture.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否;不得与captured body共存 | 新ref + restart;lease loss形成capture unavailable / failed | capture slot、marker、body-free / size-class validation |
| I046 `executionCapture.materialClassRef` | sensitive / reference-only | ordinary registered material-class ref | 否;class不包含material body | 新ref + restart;不得把candidate升级artifact truth | class marker、allowed kinds、body-free validation |
| I049 `inboundEvents.bindings` | sensitive / material-capable | G12 closed map保存source/quarantine refs;每个real entry独立slot | 否;不得保存raw topic / payload / credential | map change + restart;new loop只用frozen registry | consumer key、binding slot、redacted markers、schema / quarantine completeness |
| I050 `eventPublisher.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否 | 新ref + restart;publish failure不回滚truth | publisher slot、marker、I014 / availability result |
| I051 `eventRoutes.bindings` | sensitive / material-capable | G12 13-key map保存route refs;每个real route可独立slot | 否;value不得是raw topic / endpoint | route map change + restart;enabled event group完整重验 | changed formal keys、redacted route markers、FC-01~06 coverage |
| I053 `eventRelay.publishRetryPolicyRef` | sensitive / reference-only | ordinary registered retry policy ref | 否 | 新ref + restart;new relay run读取新snapshot | relay retry family、marker、no-payload-rebuild check |
| I055 `materialHandoff.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否 | 新ref + restart;I056非空时required | handoff adapter slot、marker、target compatibility result |
| I056 `materialHandoff.targetRefs` | sensitive / material-capable | G12 0~16 target refs;每个real target独立slot | 否;不得保存package / artifact body | target list change + restart;new job只选frozen子集 | changed target count、redacted markers、class compatibility;不记full target |
| I057 `observabilityHandoff.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否 | 新ref + restart;I048=true时required | observability handoff slot、marker、redaction / availability result |
| I058 `observabilityHandoff.targetRefs` | sensitive / material-capable | G12 0~16 safe target refs;每个real target独立slot | 否;不得保存ledger body | target list change + restart;I048/list双向校验 | target count、redacted markers、safe target class |
| I059 `investigationHandoff.adapterProfileRef` | sensitive / material-capable | ordinary adapter ref + registry slot | 否 | 新ref + restart;I074=true时required | investigation adapter slot、marker、guard-preserving result |
| I060 `investigationHandoff.targetRefs` | sensitive / material-capable | G12 0~16 approved target refs;每个real target独立slot | 否;不得保存investigation body | target list change + restart;new maintenance run只选frozen子集 | target count、redacted markers、approval class;receipt不解除guard |
| I061 `handoffDelivery.retryPolicyRef` | sensitive / reference-only | ordinary registered retry policy ref | 否 | 新ref + restart;new retry job读取新snapshot | retry family、marker、no-source-truth-change validation |
| I065 `leaseSafety.leaseProfileRef` | sensitive / reference-only | ordinary guarded lease profile ref | 否;不得包含backend handle credential | 新ref + restart;既有boundary / handle继续使用已保存lease window,新boundary establishment使用新generation snapshot | lease profile marker、guard coverage;不记handle/body |
| I069 `cleanupSafety.retentionGuardProfileRef` | sensitive / reference-only | ordinary strict cleanup guard ref | 否 | 新ref + restart;禁止改为force-clean | guard marker、evidence/investigation/redline coverage |
| I071 `backendRelease.adapterProfileRef` | sensitive / material-capable | null或ordinary adapter ref + optional registry slot | 否 | null/non-null或ref变化均需restart;null复用I041能力 | release slot、marker、cleanup/redline guard和capability result |
| I072 `backendRelease.retryPolicyRef` | sensitive / reference-only | ordinary release retry policy ref | 否 | 新ref + restart | policy marker、no-guard-bypass / no-fake-release validation |
| I083 `derivedMaintenance.comparisonScopeRef` | sensitive / reference-only | ordinary registered scope ref | 否;不得编码backend credential / policy body | 新ref + restart;E只选frozen scope | scope family、redacted marker、no-truth-promotion check |
| I086 `runtimeTelemetry.logSinkProfileRef` | sensitive / material-capable | ordinary sink ref + real registry optional S04 slot | 否;sink credential不得成为log field | 新ref + restart;runtime provider loss按safe degraded处理 | sink slot、marker、safe local diagnostic availability |
| I087 `runtimeTelemetry.metricSinkProfileRef` | sensitive / material-capable | ordinary sink ref + real registry optional S04 slot | 否;credential不得成为label | 新ref + restart | sink slot、marker、low-cardinality / audit-independence result |
| I091 `auditTrace.routeProfileRef` | sensitive / reference-only | ordinary mandatory same-UoW route ref | 否;不是external sink credential | 新ref + restart;任何异步 / disable profile拒绝 | route marker、truth store UoW identity、atomicity result |
| I092 `diagnostics.surfaceProfileRef` | sensitive / reference-only | ordinary redacted surface profile ref | 否 | 新ref + restart;不得切external raw surface | surface marker、allowed carrier、redaction validation |
| I094 `safeOutput.redactionProfileRef` | sensitive / reference-only | ordinary mandatory redaction profile ref | 否 | 新ref + restart;只能保持或加强,不能debug-relax | profile marker、I095 floor coverage、all-carrier activation |
| I098 `testFixtures.fixtureSetRef` | sensitive / test-only | S06 test registry ref | 否;不得保存真实credential | 仅new test run;P05~P07禁止 | test case / fixture marker;不得进入runtime audit |
| I101 `testFixtures.failureScenarioRefs` | sensitive / test-only | S06 0~64 registered failure refs | 否;scenario不得带raw provider error/body | 仅new test/simulation run | scenario family / count / safe outcome;不得伪造真实provider审计 |

### 9.6 Material-capable Item 到 Slot 映射

`slot cardinality`是当前runtime generation最多需要解析的独立slot数,不是material字段数。相同provider marker出现在多个slot时也不得自动复用lease;跨consumer共享默认拒绝。

| Item | Slot cardinality | Material class | Required when | Consumer | 不可用 / 不匹配处理 |
|---|---:|---|---|---|---|
| I017 truth store | 0..1 | SBX-MC-01 | selected real entry声明slot;truth/UoW总是装配 | truth store / UoW adapter | profile startup fail-fast;accepted mutation不可开始 |
| I018 projection store | 0..1 | SBX-MC-01 | selected real entry声明slot | projection store adapter | startup fail-fast或profile不qualified;不得fallback memory |
| I019 derived store | 0..1 | SBX-MC-01 | selected real entry声明slot | derived / reconciliation store | startup fail-fast;不得fallback truth store |
| I020 reference store | 0..1 | SBX-MC-01 | selected real entry声明slot | reference store adapter | startup fail-fast / resolver unavailable;不得保存body |
| I021 relay store | 0..1 | SBX-MC-01 | selected real entry声明slot且relay store装配 | relay store adapter | I014=true时startup fail-fast;source truth不回滚 |
| I022 replay store | 0..1 | SBX-MC-01 | selected real entry声明slot | idempotency / stored-result adapter | startup fail-fast;duplicate不得重算 |
| I028 context source | 0..1 | SBX-MC-02 | real resolver entry声明slot且adapter装配 | context resolver | startup/profile blocked;runtime lease loss -> unresolved / unavailable |
| I031 policy source | 0..1 | SBX-MC-03 | real policy entry声明slot | policy adapter | startup/profile blocked;runtime loss始终fail-closed |
| I035 capability source | 0..1 | SBX-MC-03 | real capability entry声明slot | backend capability adapter | startup/profile blocked;boundary reject/degraded |
| I041 isolation backend | 0..1 | SBX-MC-04 | P05/P06 real backend entry声明slot | isolation backend adapter | profile不qualified / boundary or launch reject;无host fallback |
| I044 execution capture | 0..1 | SBX-MC-05 | real capture entry声明slot | capture adapter | activation失败或capture `Unavailable/Failed`;不伪success |
| I049 inbound bindings | 0..18 | SBX-MC-06 | 每个enabled real source / quarantine entry声明slot | corresponding consumer adapter | loop不注册 / event delayed or quarantined;无fixture fallback |
| I050 event publisher | 0..1 | SBX-MC-07 | I014=true且real publisher entry声明slot | publisher adapter | startup fail-fast;publish runtime no-rollback |
| I051 event routes | 0..13 | SBX-MC-07 | FC-01~06激活的real route entry声明slot | publisher route adapter | activated group缺slot startup fail-fast |
| I055 material handoff adapter | 0..1 | SBX-MC-08 | I056非空且real adapter entry声明slot | material handoff adapter | startup fail-fast;runtime failure retryable / failed |
| I056 material targets | 0..16 | SBX-MC-08 | 每个active real target entry声明slot | material target adapter | startup fail-fast / current job reject;receipt不升格truth |
| I057 observability adapter | 0..1 | SBX-MC-09 | I048=true且real adapter entry声明slot | observability handoff adapter | startup fail-fast;runtime degraded handoff,formal audit不变 |
| I058 observability targets | 0..16 | SBX-MC-09 | I048=true且每个real target声明slot | observability target adapter | startup fail-fast;不得保存ledger body |
| I059 investigation adapter | 0..1 | SBX-MC-09 | I074=true且real adapter entry声明slot | investigation handoff adapter | startup fail-fast;runtime保持pending / contained |
| I060 investigation targets | 0..16 | SBX-MC-09 | I074=true且每个real target声明slot | investigation target adapter | startup fail-fast;receipt不得解除cleanup/redline guard |
| I071 backend release | 0..1 | SBX-MC-04 | non-null real override声明slot;null时复用I041 capability | release adapter | startup fail-fast或release unavailable;orphan保持blocked |
| I086 log sink | 0..1 | SBX-MC-10 | selected external sink entry声明slot | infra-private log sink | invalid startup fail-fast;runtime loss仅safe degraded且local diagnostic保留 |
| I087 metric sink | 0..1 | SBX-MC-10 | selected external sink entry声明slot | infra-private metric sink | invalid startup fail-fast;runtime lossdegraded,不得影响audit/truth |

### 9.7 Profile 敏感配置与Provider资格矩阵

| Profile | 允许的sensitive ref | S04 / material规则 | Cache / lease | Rotation / revocation | 不可用策略 |
|---|---|---|---|---|---|
| PROFILE-01 `local-contract` | P0内建fake / disabled refs | 禁止真实slot和provider调用 | none | 不适用;ref变化restart | 出现slot或真实material声明即profile reject |
| PROFILE-02 `ci-contract` | fake refs + I098/I101 test refs | 禁止真实S04;failure scenario只能模拟outcome | none | per-test fixture reset | 真实credential / provider marker出现即test startup fail |
| PROFILE-03 `integration-seam` | controlled fake / registered seam refs | 不解析生产或真实provider material | none | new test runtime / scenario | seam未注册reject;不得fallback真实或host资源 |
| PROFILE-04 `operations-simulation` | simulation / replay refs | 禁止真实S04和historical raw body | none | new simulation run | 真实release / target / sink material出现即reject |
| PROFILE-05 `backend-conformance` | candidate backend、lab store、controlled target refs | 只允许dedicated environment非生产material;provider必须满足§9.3和§9.9 | 默认constructor-only;adapter-bounded须显式资格 | new ref / version默认新runtime generation;revoked立即停止新使用 | required material/provider audit不可用 -> profile / case fail-closed;无fake fallback |
| PROFILE-06 `staging-like` | qualified real-like refs | 仅受控非生产material;所有active slot完整且provider qualified | constructor-only或经批准adapter-bounded;禁止unbounded | ref change restart;version renew不得越expiry/revocation;无hot config claim | 任一required slot失败 -> startup reject或已定义adapter unavailable;profile不qualified |
| PROFILE-07 `production-like` | future approved refs only | 当前禁止激活和配置真实production material | not applicable current | future需provider/adapter/ops专项 | selector即reject;不得用P05/06 material冒充production |

Provider / binding进入P05或P06前必须同时满足:

1. 能按slot和material class做最小权限授权,不能用一个全局credential覆盖全部store / adapter / target。
2. resolve / renew / deny / revoke-detect拥有provider-side audit,且审计正文不含material。
3. 支持明确expiry / version语义;没有expiry信息时只能使用`constructor-only`并通过新runtime generation轮换。
4. 不把raw material写临时文件、项目JSON、env回显、argv、core dump artifact、diagnostic或SDK error正文。
5. adapter只能消费自己声明的class;不得把backend control material传给controlled workload或handoff target。
6. provider不可用、audit不可用、type mismatch、expired、revoked和denied都能映射为§9.3 stable outcome。
7. 具备受控销毁 / release语义;runtime shutdown后lease不可继续被新operation使用。
8. 真实产品、权限主体和部署绑定已经由ADR / `07` / 运维文档登记;本Step不伪造其存在。

### 9.8 Material 读取、缓存、轮换与吊销生命周期

#### 9.8.1 生命周期状态与动作

| 阶段 | 输入 | 动作 | 输出 | 禁止事项 |
|---|---|---|---|---|
| ref selection | S01~S03 ordinary values | merge并选择唯一ref / map / list | merged candidate | raw material、provider path、multiple active refs |
| ref validation | merged candidate + profile | family、registry、profile、activation、D43 completeness | `SensitiveBindingRef` | high-invalid fallback、unknown ref猜测 |
| slot decision | validated ref + activation predicate | lookup descriptor;disabled则short-circuit | no-slot或required descriptor | disabled binding仍resolve、P0真实slot |
| provider resolve | descriptor + purpose | request exact class和consumer lease | §9.3 outcome | 输出SDK body、retry其他provider、class coercion |
| adapter construction | resolved lease | 只交给one concrete adapter并检查availability | adapter runtime handle | application/domain持有lease、跨family共享 |
| operation use | adapter handle + still-valid lease | 最小权限使用 | formal adapter outcome | 传入guest env/argv/fs/process、写truth / report |
| renew | adapter-bounded policy + expiry window | provider重新验证same slot / class | new valid lease或failure | silently extend expiry、use revoked version |
| config ref rotation | new ordinary ref | newsnapshot全量validate并构建new runtime generation | old/new generation切换由Step10/运维承接 | in-place改旧snapshot、partial adapter hot swap |
| same-ref version rotation | provider publishes new version | current baseline在new generation解析;qualified bounded adapter可renew | new lease/version marker | 宣称config hot reload、沿用expired lease |
| revoke / expire | provider outcome或lease expiry | 阻止新使用,adapter unavailable;必要时terminate runtime并重建 | safe diagnostic / availability marker | stale fallback、切fake、把revoked material写证据 |
| shutdown | runtime / adapter drop | 释放provider lease,清除adapter-private material memory | provider audit / safe marker | dump / persist / reuse lease |

#### 9.8.2 Cache / Lease策略

| Policy | 允许行为 | 生命周期 | 适用范围 | 禁止行为 |
|---|---|---|---|---|
| `none` | 不解析真实material | 无 | P01~P04 | 调用provider、fake credential解密 |
| `constructor-only` | startup / adapter rebuild解析一次;只在构造所需最短内存窗口可见 | adapter构建后raw buffer清除;adapter内部client按产品安全能力持有必要状态 | P05默认;无renew能力的P06 binding | shared cache、disk cache、snapshot回写、过期后继续 |
| `adapter-bounded` | adapter持有不可序列化lease handle;到期前按同slot / class renew | 不得超过provider expiry;revoke / denied立即失败 | 仅provider与adapter均完成资格的P05/P06 | unbounded TTL、跨slot / consumer共享、renew时切provider |

共同规则:

- 不定义全局 decrypted-material cache。即使多个route/target指向同provider marker,每个slot仍独立授权、审计和lease。
- 若具体SDK只能接收raw bytes,bytes只能存在于concrete adapter最小内存边界并在替换 / drop时受控清除;不得传回builder summary。
- 当前不保证OS swap、core-dump产品能力已经配置;P05/P06环境资格必须在`05/06/07/09`补对应platform gate,未满足不得声明qualified。
- 有效期内现有lease可继续使用到其明确expiry,这不是last-known-good;provider不得把不可达自动解释为延长有效期。
- immediate revocation通知若需要新增callback、runtime stop flow或adapter hot swap,必须先回写`03`;当前由provider deny / expiry和运维终止runtime收束。
- S04 material绝不属于controlled workload secret injection。本项目没有把credential写入guest env、argv、workspace、mount、filesystem、network payload或spawned process的配置通道。

### 9.9 禁止输出、持久化与审计规则

#### 9.9.1 Immutable deny floor

所有profile必须原样承接I095的17类deny floor:`rawConfig`、`rawSecret`、`credential`、`privateKey`、`rawEndpoint`、`rawTopic`、`externalBody`、`sdkResponse`、`processOutput`、`stackTrace`、`sqlText`、`httpBody`、`rawIdempotencyKey`、`rawDedupKey`、`artifactPackageBody`、`observabilityLedgerBody`、`investigationBody`。S02只能增加后续正式定义的deny class,不得删除、改名或通过allow exception抵消。

以下内容在本Step额外按sensitive输出处理,即使不属于raw secret也不得输出原文:

- `SensitiveBindingRef`、provider binding marker、provider path / namespace、material version marker。
- real store / adapter / source / route / target / sink的完整ref、拓扑和产品标识组合。
- provider principal、authorization scope、lease handle、expiry token和renew response。
- redaction / audit / cleanup guard profile的完整ref,防止泄露安全配置拓扑。

#### 9.9.2 Carrier边界表

| Carrier | 允许内容 | 禁止内容 | Failure handling |
|---|---|---|---|
| S02 project JSON | Step 7 exact opaque ref / closed map / ref list | raw material、provider path、endpoint credential、unknown secret key | parse / schema reject;不得fallback |
| S03 allowlisted env | exact scalar或single opaque ref only | raw token/password/key/cert/DSN、map/list body、provider response | present-invalid startup fail-fast |
| infra merged / validated config | full sensitive refs仅限process memory;typed activation metadata | raw material、provider SDK object | validation failure sanitized |
| `SandboxRuntimeConfigSummary` | profile/config refs、adapter kind/status、redacted markers | full sensitive ref、slot descriptor、material/version/endpoint | summary construction fail-fast |
| `SandboxRuntimeConfigPort` | sanitized summary和availability state | S04 request、lease、provider handle、raw error | contract violation;必须回写修正 |
| concrete adapter | one matching lease / minimal credential state | unrelated slot、full raw config、business DTO body | adapter construction / availability failed |
| controlled workload | typed launch / policy / boundary / workspace inputs | 任意S04 material、provider ref、credential、lease handle | boundary / launch reject;security diagnostic |
| runtime log / diagnostic | item ID、slot family、material class、outcome、redacted marker、safe reason ref | full ref、material、provider path、SDK/HTTP/stack/process body | redaction gate drops unsafe field;security diagnostic |
| metric label | adapter / slot / material class、result category、profile class | marker/ref/version、free text、secret、endpoint/topic | label validation reject;metric not emitted |
| `SandboxAuditTrace` | existing config / adapter availability subject refs和safe reason | material access body、provider response、new secret-read business event | do not append invalid audit;source truth rules unchanged |
| provider native audit | slot family、consumer family、action、result、provider-side redacted binding/version marker、time、principal class | material body、private key、token、full sandbox config | binding not qualified if audit unavailable or unsafe |
| `SandboxJobReportDto` / receipt | item/adapter result、safe reason / diagnostic refs、counts | full target/route/provider refs、material、SDK error | report mapping fails safe / item failed |
| public error | existing error kind、retryable、safe reason、diagnostic / trace ref | provider status body、full ref、secret、endpoint、stack | map to stable unavailable / validation category |
| test artifact / report | fixture IDs、formal outcome、redaction check result | real material、production ref、simulated raw secret echo | test fails;unsafe artifact not promoted |

#### 9.9.3 Provider Access Audit最小字段

Provider native audit必须至少能证明以下事实,但L4-sandbox只接收其safe marker / availability结果,不复制provider audit正文:

| 字段语义 | 要求 | 禁止 |
|---|---|---|
| operation | resolve / renew / deny / revoke-detect / release | free-text SDK operation body |
| owner item / slot family | I017~I087中的M item + binding family | full selected ref |
| consumer family | exact store / adapter / target / sink family | application actor业务正文 |
| purpose | startup-build / adapter-rebuild / lease-renew | command / event payload |
| result | resolved / unavailable / denied / mismatch / expired / revoked / audit-unavailable / provider-error | raw provider error |
| binding / version marker | provider-side redacted marker | provider path、material version原文 |
| time / principal | provider可信时间和principal class | token、principal credential、private identity body |

Provider audit不替代`SandboxAuditTrace`。L4 config validation在store可用前只写sanitized local log / metric / diagnostic;store可用后可复用`SandboxConfigValidationAudit`和`SandboxAdapterAvailabilityAudit`意图,不得新增secret-read accepted audit。

#### 9.9.4 Step 10变更审计最小承接

Step 10必须对sensitive ref / descriptor变化至少记录:change request ref、operator safe ref、profile、owner item ID、binding family、old/new `RedactedBindingMarker`、material class是否变化、activation predicate是否变化、validation result、new runtime generation ref、apply / rollback disposition和safe reason ref。不得记录full ref、provider marker原文、material version原文或raw material。

### 9.10 敏感配置错误模式与处理表

| Error ID / 场景 | 检测阶段 | System behavior | Safe surface | 禁止fallback |
|---|---|---|---|---|
| SEC-01 ordinary source出现secret-like字段 / raw material | parse / schema | startup fail-fast / current entry reject | item path class + `ForbiddenSecretMaterial` safe reason | 读取该值、移入S04、回退低层 |
| SEC-02 sensitive ref unknown / family mismatch | ref validation | startup fail-fast | item ID、expected family、redacted issue ref | substring猜family、换fake ref |
| SEC-03 P01~P04出现真实slot / provider marker | profile validation | profile reject | profile + owner item + forbidden source category | 调真实provider或忽略slot |
| SEC-04 reference-only item声明material slot | registry validation | startup fail-fast / registry unqualified | item ID + slot category mismatch | 把profile ref当credential |
| SEC-05 active M item缺descriptor / required slot | activation validation | startup / loop / job registration blocked | item / slot family + missing marker | disabled假装、raw env、fake fallback |
| SEC-06 multiple provider markers / ambiguous slot | registry validation | fail-fast | owner item + ambiguity category | 任选一个provider |
| SEC-07 provider unavailable且无valid lease | S04 resolve / renew | required adapter unavailable;按item失败面处理 | stable unavailable + safe reason ref | stale / expired material、other provider |
| SEC-08 provider denied | S04 resolve / renew | fail-closed;profile not qualified or operation unavailable | denied category + redacted marker | retry成更高权限principal |
| SEC-09 material class / consumer mismatch | resolve / adapter build | startup fail-fast;registry defect | expected/actual class IDs,无material | coercion、跨consumer共享 |
| SEC-10 material expired | operation / renew | stop new use;adapter unavailable;runtime rebuild required | expired category + time class | 延长expiry、继续使用 |
| SEC-11 material revoked | provider / operation | stop new use;adapter stop / runtime termination / restart | revoked category + safe incident ref | silent continue、切fake/host |
| SEC-12 provider audit unavailable / unsafe | qualification / resolve | binding unqualified;按required material不可用 | audit-unavailable category | 无审计继续读material |
| SEC-13 lease renew failure while old lease still valid | renew | 可继续到明确expiry;不得延长;提前暴露degraded marker | renew-failed + expiry-state class | 把暂时错误改成无限有效 |
| SEC-14 full ref / material进入log、metric、audit、report或error | output gate | unsafe field拒绝 / redacted;产生security diagnostic;相关test fail | carrier + forbidden class + diagnostic ref | 截尾后输出、plain hash、保留原body |
| SEC-15 S04 material注入controlled workload | builder / launch boundary | startup / launch reject;security redline diagnostic | material class + attempted carrier,无值 | 通过guest env/argv/fs/network/process传递 |
| SEC-16 runtime shutdown lease release失败 | adapter shutdown | 标记provider release failure,阻止lease复用于new runtime | slot family + release-failed marker | 忽略并复用handle |
| SEC-17 telemetry sink material失效 | runtime adapter | external sink degraded;safe local diagnostic保留;formal audit/truth不变 | sink kind + degraded category | 关闭redaction / audit或输出credential排障 |
| SEC-18 config ref轮换只构建部分adapter | apply precheck | reject new generation;旧generation是否继续由Step10裁决 | generation + failed slot set markers | mixed-generation partial hot swap |

### 9.11 敏感配置逐项停审记录

停审列固定检查:存储方式、明文禁止、轮换、读取 / 变更审计、log / error / audit / report输出。`通过`仅表示设计闭合,不表示provider、代码、测试、部署或验收已完成。

| 配置项 | 存储 / 明文 | 轮换 | 审计 | 禁止输出 | 结论 / 修正 |
|---|---:|---:|---:|---:|---|
| I013 | 是 | 是 | 是 | 是 | 通过;retry profile为reference-only |
| I017 | 是 | 是 | 是 | 是 | 通过;truth store slot不得破坏audit/UoW |
| I018 | 是 | 是 | 是 | 是 | 通过;projection real binding无memory fallback |
| I019 | 是 | 是 | 是 | 是 | 通过;derived material不取得truth权限 |
| I020 | 是 | 是 | 是 | 是 | 通过;reference store仍body-free |
| I021 | 是 | 是 | 是 | 是 | 通过;relay material失败no-rollback |
| I022 | 是 | 是 | 是 | 是 | 通过;replay credential不进入stored result |
| I028 | 是 | 是 | 是 | 是 | 通过;resolver response / material双重排除 |
| I031 | 是 | 是 | 是 | 是 | 通过;provider failure仍fail-closed |
| I033 | 是 | 是 | 是 | 是 | 通过;high-risk profile不是approval secret |
| I035 | 是 | 是 | 是 | 是 | 通过;capability probe body不输出 |
| I036 | 是 | 是 | 是 | 是 | 通过;backend refs为reference-only闭集 |
| I039 | 是 | 是 | 是 | 是 | 通过;boundary profile不得热放宽 |
| I040 | 是 | 是 | 是 | 是 | 通过;template不保存host path正文 |
| I041 | 是 | 是 | 是 | 是 | 通过;backend material不进controlled workload |
| I044 | 是 | 是 | 是 | 是 | 通过;capture material与captured body分离 |
| I046 | 是 | 是 | 是 | 是 | 通过;material class ref不是material body |
| I049 | 是 | 是 | 是 | 是 | 通过;source/quarantine每binding独立slot |
| I050 | 是 | 是 | 是 | 是 | 通过;publisher material失败不回滚truth |
| I051 | 是 | 是 | 是 | 是 | 通过;route ref不是raw topic |
| I053 | 是 | 是 | 是 | 是 | 通过;relay retry profile reference-only |
| I055 | 是 | 是 | 是 | 是 | 通过;adapter slot由I056激活 |
| I056 | 是 | 是 | 是 | 是 | 通过;target material不升格artifact truth |
| I057 | 是 | 是 | 是 | 是 | 通过;observability adapter由I048激活 |
| I058 | 是 | 是 | 是 | 是 | 通过;target不得保存ledger body |
| I059 | 是 | 是 | 是 | 是 | 通过;investigation adapter由I074激活 |
| I060 | 是 | 是 | 是 | 是 | 通过;receipt不得解除guard |
| I061 | 是 | 是 | 是 | 是 | 通过;handoff retry profile reference-only |
| I065 | 是 | 是 | 是 | 是 | 通过;lease profile不含handle credential |
| I069 | 是 | 是 | 是 | 是 | 通过;cleanup guard不可force-clean |
| I071 | 是 | 是 | 是 | 是 | 通过;null复用与override slot互斥明确 |
| I072 | 是 | 是 | 是 | 是 | 通过;release retry不绕guard |
| I083 | 是 | 是 | 是 | 是 | 通过;comparison scope不含backend secret |
| I086 | 是 | 是 | 是 | 是 | 通过;log sink credential不成为log field |
| I087 | 是 | 是 | 是 | 是 | 通过;metric sink credential不成为label |
| I091 | 是 | 是 | 是 | 是 | 通过;audit route不是external credential |
| I092 | 是 | 是 | 是 | 是 | 通过;diagnostic surface只输出safe carrier |
| I094 | 是 | 是 | 是 | 是 | 通过;redaction profile mandatory/no relax |
| I098 | 是 | 是 | 是 | 是 | 通过;test-only且不调用真实S04 |
| I101 | 是 | 是 | 是 | 是 | 通过;scenario只注入formal outcome |

### 9.12 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 证据 / 修正 | unresolved缺口 |
|---|---|---|---|
| Step 7 sensitive item是否全覆盖 | 是 | §9.5和§9.11各40行,I013~I101闭集 | 无 |
| M item是否全覆盖 | 是 | §9.6共23行,与Step 7来源列含M的item一致 | 无 |
| ordinary secret item是否仍为零 | 是 | secret只作为§9.4 material class内部内容,无JSON key / env mapping | 无 |
| reference-only是否误送S04 | 否 | §9.1列15项;SEC-04强制拒绝slot | 无 |
| test-only是否进入real-like | 否 | I098/I101只进S06;P05~P07出现即reject | 无 |
| P01~P04是否调用真实provider | 否 | §9.7 profile矩阵固定`none` | 无 |
| raw material是否进入ordinary source | 否 | S02/S03仅ref;SEC-01 fail-fast | 无 |
| raw material是否进入sanitized summary / public port | 否 | §9.2 / §9.9 carrier表;S04在infra-private边界 | 无 |
| material是否可能进入controlled workload | 否 | §9.8明确guest env/argv/fs/network/process全禁止;SEC-15 reject | 无 |
| provider unavailable是否weak fallback | 否 | §9.3 outcome / SEC-07;无raw env、fake、host或other provider fallback | 无 |
| expired / revoked material是否可继续 | 否 | 只允许明确有效期内lease;expiry/revoke停止新使用 | immediate callback为future reopen,不伪造当前能力 |
| 是否存在shared decrypted cache | 否 | §9.8只允许constructor-only / adapter-bounded,每slot独立 | 无 |
| rotation是否伪装成hot config reload | 否 | ref change构建new generation;same-ref version默认new generation | 无 |
| provider access是否误写business audit | 否 | provider native audit + existing config/availability surface;无新trace kind | 无 |
| full sensitive ref是否进入输出 | 否 | 只允许registry redacted marker;禁止截尾/plain hash | Step 9定义exact marker生成 / validation顺序 |
| 17类deny floor是否完整 | 是 | §9.9.1逐字承接I095;只能增加不能删除 | 无 |
| telemetry失效是否影响formal audit | 否 | SEC-17只降级external sink,safe local diagnostic / audit invariants不变 | 无 |
| handoff credential是否改变truth/guard | 否 | I055~I060停审:no rollback/no truth promotion/no receipt release | 无 |
| provider产品是否被伪造成已选择 | 否 | 只定义qualification;产品、endpoint、principal均未写 | P05/P06激活前必须ADR/07/09闭合 |
| 是否伪造测试 / evidence / 验收 | 否 | 无run_id、result、evidence alias、signature或qualification claim | 无 |

### 9.13 Historical Material / Blocker 记录

| ID | 类型 | 状态 | 冲突 / 缺口 | 本 Step处理 |
|---|---|---|---|---|
| SBX-CFG-SECRET-001 | design gap | resolved_for_cfg_step_8 | Step 7只有sensitive标签和M lane,尚无逐项存储、轮换、审计、禁止输出和生命周期 | 本文件已闭合40项、23 slot和SEC-01~18 |
| SBX-CFG-SECRET-CARRIER-001 | carrier watch | resolved_no_writeback | S04 exact public port不存在 | 固定为infra-private registry / provider / adapter construction阶段;不修改`SandboxRuntimeConfigPort` / builder public signature |
| SBX-CFG-SECRET-PROVIDER-001 | profile activation blocker | open_for_p05_p06_p07_activation | provider产品、principal、endpoint和真实binding未选择 | 不阻塞Step 8/P0;P05/P06/P07激活前由ADR/07/09登记并通过§9.7资格 |
| SBX-CFG-SECRET-REVOCATION-001 | future reopen trigger | contained_by_current_baseline | immediate push revocation / adapter hot-stop callback无`03` port / flow | 当前用bounded lease + provider deny/expiry + runtime termination/restart;要求callback时先回写`03` |
| SBX-CFG-SECRET-PLATFORM-001 | downstream qualification gap | open_for_05_06_07_09 | swap/core dump/SDK memory/zeroization/provider audit等平台事实未验证 | 不伪造通过;P05/P06资格必须测试、验收、实施和运维闭合 |
| SBX-CFG-SECRET-HIST-001 | historical_material | contained | 旧README/05/06的host runtime、产品、env或调试线索可能诱导raw credential / guest injection | 未继承产品或host路径;明确S04 material不进controlled workload |
| SBX-DOC-GAP-TEST-001 | downstream document gap | open | 正式`05`仍是旧材料 | 不阻塞Step 8;后续按SEC-01~18和§9.12重建negative tests |
| SBX-DOC-GAP-ACCEPT-001 | downstream document gap | open | 正式`06`仍是旧材料 | 不阻塞Step 8;provider / leak / fallback / workload injection进入veto候选 |

当前未发现阻塞Step 8完成的上游blocker。Provider产品缺失、立即吊销callback和平台anti-leak能力都是P05+激活 / 下游资格缺口,不是可由本Step伪造的当前事实。

### 9.14 对下游文档的影响总表

| 下游 | 从本 Step接收 | 本 Step不提供 |
|---|---|---|
| `04` Step 9 | 40项分类、23 slot descriptor、activation predicate、S04 outcome、lease policy、SEC-01~18和carrier规则 | Rust函数 / trait、provider SDK、parse / resolve执行顺序、exact error enum |
| `04` Step 10 | ref / material version rotation、new generation、old/new redacted marker和变更审计最小字段 | 审批流、apply / rollback算法、drift处置 |
| `04` Step 11 | unavailable / denied / mismatch / expired / revoked / audit-unavailable / leak failure语义 | 完整告警、恢复矩阵和operations disposition |
| `04` Step 12 | provider / adapter / redaction / negative test与运维承接边界 | 测试用例、验收阈值、implementation boundary或runbook |
| `05-测试方案.md` | 40项覆盖、23 slot、SEC-01~18、no-provider P0、no-fallback、no-workload-injection、redaction scan输入 | 真实结果、run_id、evidence alias、产品qualification |
| `06-验收标准.md` | raw material leak、full ref leak、expired/revoked use、provider audit缺失、fake/host fallback、guest injection veto候选 | 验收签署、风险接受、真实evidence |
| `07-实施计划.md` | infra-private S04 boundary、registry descriptor、provider adapter、lease ownership、redaction / audit implementation职责 | 具体phase / commit、implementation ledger、planned skeleton、产品已存在事实 |
| `09-部署与运维手册.md` | provider qualification、least privilege、ref provisioning、restart rotation、revocation/runtime termination和anti-leak平台门禁 | provider命令、secret path、credential、挂载、runbook和排班 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| 40项sensitive分类和23项M闭集 | 否 | 细化Step 7 raw schema与来源,不改变对象 / port / DTO / flow | 不适用 | no_writeback |
| `SecureMaterialSlotDescriptor`为registry-side metadata | 否 | 不新增项目JSON key、public summary field或application/domain object | 不适用 | no_writeback |
| S04 provider-neutral resolve / lease语义 | 否 | 作为`infra/config.rs`与concrete adapter factory内部阶段;public builder signature不变 | 不适用 | resolved_watch_no_writeback |
| provider native access audit + existing config/availability surface | 否 | 不新增`SandboxTraceKind`、business audit object或accepted truth flow | 不适用 | no_writeback |
| ref rotation通过new runtime generation | 否 | 承接当前startup frozen / no reload边界 | Step 10细化 | no_writeback |
| immediate revocation callback / adapter hot-stop | 是,若启用 | 需要新增infra callback、runtime disposition和可能的worker/job flow | `03` Step 7 / 9 / 12 / 14 / 15 | future_reopen_trigger |
| S04跨application/domain暴露或进入DTO/summary/report | 是,禁止当前启用 | 会改变port / object / public surface并破坏secret边界 | `03` Step 6 / 7 / 8 / 14 / 15 | blocker_if_requested |
| shared decrypted cache / dynamic provider switch / hot adapter swap | 是,若启用 | 改变builder、runtime state、一致性、审计和rollback | `03` Step 6 / 7 / 10 / 12 / 14 | future_reopen_trigger |

本 Step没有`待回写`或`阻塞待确认`项。当前no-writeback成立的前提是S04始终infra-private、普通配置继续ref-only、P01~P04不调用真实provider、P05+未完成资格前不激活。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“敏感配置逐项表”“Material-capable Item到Slot映射”“Profile矩阵”“Material生命周期”“Carrier边界”“错误模式”“逐项停审”和“跨敏感配置泄露风险审计”,确认ordinary ref与raw material为何必须分层。

正式`04-配置设计.md` §8应回填:

1. `internal`、material-capable、reference-only、test-only和secret material分级;明确40 / 23 / 15 / 2 / 0计数。
2. S02/S03 opaque ref -> validated registry -> activation -> S04 -> adapter-scoped lease -> concrete adapter读取图。
3. `SecureMaterialSlotDescriptor`、S04 provider-neutral outcome和SBX-MC-01~10 class闭集。
4. I013~I101 40项敏感配置表,不得删掉存储、明文、轮换和审计列。
5. 23项M slot cardinality、required-when、consumer和不可用处理。
6. PROFILE-01~07 S04资格、provider最低能力和P05/P06非生产material限制。
7. constructor-only / adapter-bounded cache策略、ref rotation、version rotation、expiry、revocation和shutdown规则。
8. I095 17类deny floor、full sensitive ref附加禁令和全部carrier边界。
9. SEC-01~18、逐项停审、跨项泄露审计和`03`影响判定。

回填不得:

- 写任何真实provider、endpoint、path、principal、credential、material version、secret value或部署挂载。
- 把`SensitiveBindingRef`、descriptor或lease加入public DTO / summary / domain object。
- 把provider access伪装成sandbox accepted business audit。
- 把valid-lease使用写成last-known-good,或把same-ref rotation写成配置hot reload。
- 宣称P05/P06/P07 provider、anti-leak平台、revocation callback或生产资格已经实现 / 测试 / 验收。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 8 | 后续处理 |
|---|---|---:|---|
| P05/P06/P07 provider产品与principal模型 | intentionally_unselected | 否 | profile激活前由ADR / 07 / 09选择并满足§9.7 |
| provider-side redacted marker生成方式 | provider qualification input | 否 | Step 9定义validator接受面;禁止plain hash / string truncation |
| P06哪些binding可用adapter-bounded renew | product capability unknown | 否 | 默认constructor-only;产品选定后逐slot批准 |
| immediate revocation callback / adapter hot-stop | future_reopen_trigger | 否 | 需要时先回写`03`,当前bounded lease + runtime termination/restart |
| swap/core dump/SDK memory/zeroization平台门禁 | open_downstream | 否 | `05/06/07/09`形成测试、验收、实施和运维资格 |
| provider audit retention / reader / export | operations-owned detail | 否 | 09定义;L4只要求可审计和safe marker,不复制正文 |
| production-like material | currently forbidden | 否 | P07 inactive;未来需重新走Step 8~14和验收 |
| 正式旧`05/06`冲突 | open_downstream | 否 | full-restart重建,不得继承host runtime / raw env /旧产品结论 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 7 | 通过 | 本次确认只放行Step 8 |
| 40个sensitive item全部有存储 / 明文 / 轮换 / 审计 | 通过 | §9.5 / §9.11各40行,与Step 7集合一致 |
| 23个M item全部有slot / class / activation / consumer / failure | 通过 | §9.6共23行,与Step 7 M集合一致 |
| secret ordinary item数量保持0 | 通过 | §9.1 / Step 7 item表一致 |
| P01~P04不调用真实S04 | 通过 | §9.7固定none |
| S04不新增public port / DTO / summary field | 通过 | §9.2 / §9.3 / §10 |
| cache / rotation / expiry / revocation / shutdown闭合 | 通过 | §9.8 |
| 17类deny floor和carrier边界闭合 | 通过 | §9.9逐类扫描通过 |
| SEC-01~18错误模式闭合 | 通过 | §9.10编号连续性通过 |
| 逐项停审与跨泄露审计无unresolved conflict | 通过 | §9.11 / §9.12覆盖与表结构校验通过 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future trigger已登记 |
| Step 9未在本Step审查前提前创建 | 通过 | 正式`04`仍缺失;Step 9在用户确认本Step后才创建 |

```text
current_document = `04-配置设计.md`
current_step = Step 8 `定义敏感配置与密钥管理`
gate_status = passed_to_step_9
next_allowed_action = Step 9已按门禁创建并完成;当前等待用户审查`04_config_step_09_loading_validation_activation.md`
formal_document_write = not_started
commit_required = no
```
