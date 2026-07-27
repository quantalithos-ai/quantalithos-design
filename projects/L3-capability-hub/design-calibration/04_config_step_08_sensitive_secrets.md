# L3-capability-hub 04 配置设计 Step 8：敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §8
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_08_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 `定义敏感配置与密钥管理` |
| 输入基线 | 04 Steps 5~7；formal 00/01/03 security boundary；DDD Step 15 redaction/observer rules |
| 本步产物 | sensitivity normalization、ref/provider boundary、resolution/injection、rotation、output suppression、audit、profile/failure matrix |
| 当前结论 | completed；ordinary config only carries protected metadata/ref，raw secret only exists behind deployment-injected provider boundary |
| 03 影响 | `无回写`；不新增 secret Port、typed root field、adapter callable、error、state 或 observer surface |
| 上游 blocker | 0；具体 secret provider/product 是 implementation/deployment prerequisite，不是当前设计 blocker |

## 2. 本步目标、输出与限制

本 Step 将 Step 7 中分散的 store、adapter、feed、actor、route、transport、endpoint、credential、TLS 和 fixture reference 归一为可执行的敏感配置合同，并固定真实秘密材料从 provider 到 concrete adapter 的最短生命周期边界。

本 Step 必须回答：

1. 哪些 raw paths 是 public、internal、sensitive metadata 或 forbidden secret。
2. 哪些值可存在于受保护 JSON，哪些只能以 symbolic ref 出现。
3. credential/TLS material 如何在 startup 解析、注入和丢弃配置来源。
4. P0 restart-only 模式下如何轮换、审计和回滚。
5. log/error/metric/span/report/event/audit/config digest 如何避免泄露。
6. provider 不可用、ref 过期、kind mismatch 或 observer 违规时如何 fail-fast/fail-closed。

本 Step 不选择 KMS/Vault/cloud secret manager、数据库、broker、HTTP client 或 certificate product，不定义 provider API、部署挂载、权限申请、证书签发、值班 runbook、hot reload 或真实 secret。它不把 secret provider 变成 Hub application Port，也不把 SecretReferencePort 误用为配置 credential provider：前者解析部署凭据，后者只解析 Hub 业务协议中的 body-free secret reference observation。

## 3. 本步输入

| 输入 | 本步承接 | 禁止推导 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | ordinary source只承载ref；invalid high-priority value不fallback；config center/admin unsupported | raw secret env/CLI、secret precedence layer |
| `04_config_step_06_environment_profiles_matrix.md` | Local/Integration/Deployment及fake/configured/disabled matrix | 环境名扩展profile、Deployment fake |
| `04_config_step_07_config_items.md` | 18 modules、sensitive paths、provider/credential/TLS refs、bounded env deny | 新raw key、generic settings、unbounded locator |
| formal `00/01` | body-free data ownership、相邻仓/外部正文隔离、安全边界 | provider secret/cost/runtime execution owner |
| formal `03` §§13~14 | immutable root、adapter-private material、Off/Redacted、observer不改业务结果 | secret进入root/application、observer形成业务truth |
| DDD Step 15 §§111~151 | 10 material classes、pre-sink redaction、required/optional projection、non-recursive observer failure | whole actor/ref、raw cause/body、backend product |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret？ | Endpoint address、store/adapter/feed/actor/route/transport/TLS/credential/fixture refs 和 actor refs 是 sensitive metadata；timeout/count/profile/family/constructor/schema是public或internal。token/password/connection credential、private key、certificate/trust-bundle body、raw DSN、userinfo、provider response和external body是secret/forbidden，不是普通配置项。 |
| 如何存储，是否允许明文？ | 受访问控制的JSON可清晰保存bounded symbolic ref和无userinfo的endpoint metadata；不得在普通JSON/env/CLI/fixture metadata中保存raw secret。secret material只由部署注入的provider根据`credentialRefs`解析，并直接进入同一startup adapter/transport constructor。 |
| 如何轮换？ | P0无hot reload。生成新locator/version/ref或完成provider-side material rotation后，更新受控配置并完整restart；新进程重新解析、解析provider material、构造graph和通过activation gate后才替换旧进程。旧进程不承诺自动取新值。 |
| 读取和变更是否审计？ | provider读取由provider/deployment owner审计；Hub只允许value-free configured family、credential kind、ref digest、result class等observer投影。配置变更由release/config owner记录actor/change ref、old/new redacted digest、scope、validation/activation/rollback outcome，不创建Hub业务audit truth。 |
| 如何避免输出泄露？ | `Off`不构造observer字段；`Redacted`只输出DDD Step 15 exact allowlist。full ref、endpoint、actor list、locator/version、provider response、secret body、raw config、serialized request/response及raw error source一律reject/omit，不能hash secret后输出。 |
| 是否回指 Step 7/5/9/10？ | §8逐项回指Step 7 path与Step 5 source；§9定义Step 9 loader handoff；§10定义Step 10 change/audit handoff。 |
| 每项是否停审？ | §12按五类敏感surface逐项检查storage/plaintext/rotation/audit/output/failure，全部pass。 |
| 是否存在raw secret、误归类、泄露或轮换缺口？ | 跨项审计为0 unresolved：raw secret path=0、secret env=0、full-value output=0、hot rotation claim=0、SecretReferencePort/provider混用=0。 |

## 5. 当前问题诊断

| 位置 | 风险 | 本步处置 |
|---|---|---|
| Step 7 `sensitive-ref` | 标签没有区分可存metadata和禁止secret | 归一为四级并逐path定义明文边界 |
| `credentialRefs.providerRef` | 易被误解为Hub business Port或已选KMS产品 | 固定为deployment-injected private registration；产品未选择 |
| endpoint address | 配置必须能读取，但暴露会泄漏拓扑 | 可存在受保护文件；禁止env覆盖和所有observer clear-text输出 |
| secret locator/version | 虽不是secret body，仍可能暴露key inventory | 归为sensitive；只记录path class/ref digest |
| TLS refs | cert/key/trust bundle容易被当普通string | 只存credential ref；material body不入JSON/root |
| actor refs | safe opaque actor不是credential，但可泄漏协作身份 | 归为sensitive metadata；matcher内消费，不输出whole list |
| fixture artifact ref | 测试ref可能暴露数据集或被当evidence | 归为sensitive；不代表真实结果/evidence/signoff |
| provider-side rotation | 易被写成runtime hot reload | P0仅restart；provider原地变化对旧进程无承诺 |

## 6. 改动前后对比

| 维度 | Step 8 前 | Step 8 后 | 原因 |
|---|---|---|---|
| sensitivity | public/sensitive-ref分散 | public/internal/sensitive/secret四级 | 让loader/audit/output可判定 |
| secret source | ref-only原则 | exact provider resolution/injection boundary | 避免root/application持有raw secret |
| plaintext | raw secret禁止但metadata未分层 | protected JSON metadata可清晰保存；secret body全source禁止 | 兼顾可配置性与泄露边界 |
| lifetime | startup-only总原则 | resolve -> constructor -> adapter-private handle；无root回流 | 缩短secret material传播面 |
| rotation | 未展开 | new ref/version + full restart + activation-before-cutover | 与无hot reload一致 |
| audit | observer redaction原则 | provider-read与config-change audit owner分离 | 不创建第二业务authority |
| failure | wrong ref fail-fast | parse/kind/provider/material/constructor/observer逐阶段策略 | 支撑Step 9/11 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决 |
|---|---|---|
| provider产品 | 固定KMS/Vault；deployment-injected registration | 采用后者；产品选择留07/09运维前置及受控reopen |
| secret进入root | 保存decrypted value；adapter-local direct injection | 采用后者；root只保留validated metadata/ref |
| endpoint明文 | 完全不入配置；受保护JSON允许bounded address | 采用后者；constructor需要地址，但所有输出clear-text禁止 |
| env secret | raw secret env；env只覆盖非secret allowlist | 采用后者；Step 7不存在credential/endpoint env leaf |
| rotation | live refresh；full restart | 采用full restart；当前没有atomic graph swap或secret watcher |
| logging | full ref便于排障；path class + redacted digest | 采用后者；full ref可泄露topology/inventory |
| secret hash | hash后可输出；仍视为secret-derived禁止 | 采用后者；低熵token/password可能被离线猜测 |
| `SecretReferencePort` | 复用为config provider；保持业务resolver独立 | 保持独立，防止配置secret与body-free业务reference合并 |

## 8. 结构化中间产物

### 8.1 Sensitivity normalization

| Level | Exact meaning | Step 7 examples | Storage / output rule |
|---|---|---|---|
| `public` | closed schema/family/technical value with no topology or credential identity | profile、entry、kind、constructorRef、timeouts/counts、compatibility、diagnostic mode | internal config and safe allowlisted output as declared |
| `internal` | non-secret operational structure whose uncontrolled change is risky | selected ref path、registry cardinality、TLS mode、config path class | protected config；output only fixed low-cardinality category |
| `sensitive` | metadata/ref revealing topology、identity、credential inventory、route或fixture inventory | endpoint address、store/adapter/feed/actor/route/transport/TLS/credential/fixture refs、actorRefs、provider/locator/version refs | protected file only；no full value in log/error/audit/report/event/metric/span |
| `secret` | value granting access or exposing protected body | token、password、DSN credential、private key、cert/trust body、decrypted provider response、raw external body | forbidden in JSON/env/CLI/doc/fixture metadata/root/output；provider-to-constructor only |

Safe symbolic grammar prevents path/URI syntax for most config names, but it does not make their identity public. Sensitivity follows operational meaning, not string validation alone.

### 8.2 Sensitive material flow

#### Sensitive material flow: ref-only startup injection

```text
[protected strict JSON]
  -> [bounded metadata/ref parse]
  -> [family/kind/reachability/profile validation]
  -> [deployment-injected provider registration lookup]
  -> [credential/TLS material resolution]
  -> [same-family adapter/transport constructor]
  -> [adapter-private runtime handle]
  -> [complete graph activation]

Never enters:
  CapabilityRuntimeConfig / application / domain / contracts
  log / error / metric / span / report / event / config audit body
```

关键说明：

1. Parser读取的是ref和endpoint metadata，不读取或保存secret body。
2. Provider registration在composition boundary注入，不由JSON下载plugin或创建动态Port。
3. Material只交给引用它的exact constructor；不得放入generic bag或application service。
4. 任一required material无法解析或constructor失败时，丢弃partial graph并阻断activation。
5. Disabled/fake branch不解析production credential；Configured failure不得fallback到fake/disabled。

### 8.3 Sensitive configuration catalog

| Step 7 path / group | Level | Storage | Plain text in protected JSON | Rotation | Audit minimum |
|---|---|---|---|---|---|
| `localPersistence.binding.storeRef`、selected store name | sensitive | symbolic config name | yes, as ref only | new ref + restart | path class、old/new ref digest、profile、result |
| `localPersistence.stores.*.transportRef` | sensitive | symbolic transport ref | yes, ref only | new ref + restart | store slot + ref digest |
| `externalPorts.*.adapterRef` | sensitive | symbolic adapter ref | yes, ref only | new ref + restart | exact Port family + ref digest |
| `externalPorts.*.fixtureRef` | sensitive | symbolic fixture ref | yes, ref only | new fixture ref + restart/test rerun | family + artifact-ref digest；no evidence claim |
| Worker `feedRef` / `trustedActorRef` | sensitive | symbolic refs | yes, refs only | new refs + restart | source family + two independent digests |
| `trustedActors.*.actorRefs` | sensitive | bounded safe opaque actor refs | yes, only in protected file | new matcher section/ref + restart | family、set digest、count；never values |
| collaboration `routeRefs` / `outboundRoutes.*.transportRef` | sensitive | symbolic route/transport refs | yes, refs only | complete ten-route update + restart | changed family set + digest |
| all `configuredAdapters/inboundFeeds/outboundRoutes.*.transportRef` | sensitive | symbolic transport ref | yes, ref only | new transport ref + restart | consumer family + ref digest |
| `transports.*.endpointRef/credentialRef/tlsPolicyRef` | sensitive | symbolic refs | yes, refs only | new refs + restart | transport kind + per-ref digest |
| `endpoints.*.address` | sensitive | bounded no-userinfo URI in protected file | yes, non-secret address only | new endpoint section/ref + restart | scheme category + address digest；never clear address |
| `credentialRefs.*.providerRef` | sensitive | deployment registration name | yes, ref only | new registration/ref + restart | credential kind + provider-ref digest |
| `credentialRefs.*.secretLocatorRef/versionRef` | sensitive | opaque locator/version refs | yes, ref only | provider-side new version/ref + restart | locator/version digest + resolution class |
| `tlsPolicies.*` refs | sensitive | credential refs only | yes, refs only | new cert/key/trust refs + restart | mode + ref digests + validation result |
| `fixtures.*.artifactRef` | sensitive | test-owned artifact ref | yes, ref only | new artifact ref + restart/test rerun | kind/schema/ref digest；no body/result |
| raw token/password/DSN credential/key/cert/trust body | secret | provider only | no | provider rotation + validated restart | provider-owned access audit; Hub receives no value field |

Constructor refs、family、kind、schema version和numeric policy仍为public/internal，不因与sensitive section同处一个object而自动变成secret。审计不得记录整个object。

### 8.4 Credential kind to consumer matrix

| Credential kind | Legal consumer | Material boundary | Wrong-kind result |
|---|---|---|---|
| `token` | configured transport constructor declaring token support | provider -> exact constructor | startup reject; no alternate kind lookup |
| `password` | configured transport/store constructor declaring password support | provider -> exact constructor | startup reject |
| `connectionCredential` | durable/request/stream/route constructor declaring compound credential support | provider -> exact constructor | startup reject; no raw DSN in endpoint |
| `trustBundle` | TLS server-auth or mTLS constructor | provider -> TLS/transport constructor | startup reject |
| `clientCertificate` | mTLS constructor only | provider -> same mTLS constructor | startup reject |
| `privateKey` | mTLS constructor paired with selected certificate | provider -> same mTLS constructor | startup reject |

Configuration cannot coerce one kind to another, concatenate fields into a DSN, derive a credential from endpoint userinfo or let a constructor query an arbitrary locator not selected by the validated graph.

### 8.5 Resolution, injection and lifetime rules

| Phase | Allowed material | Owner | Retention | Failure behavior |
|---|---|---|---|---|
| parse/merge | bounded refs and non-secret endpoint metadata | `infra/config.rs` | candidate lifetime | raw-secret pattern/forbidden key rejects value-free |
| graph validation | refs、kind、family、reachability、profile | config validator | validated metadata/root as formal 03 permits | mismatch/orphan/cycle rejects |
| provider lookup | registration handle + credential ref metadata | composition root/private builder | startup operation only | registration missing/unavailable blocks configured graph |
| material resolution | provider-owned secret material | provider + exact constructor boundary | minimum constructor-required lifetime | unavailable/expired/forbidden blocks；no lower source/fake fallback |
| adapter construction | resolved material and validated endpoint/TLS | concrete adapter/transport constructor | only inside opaque runtime handle as product requires | constructor/probe failure drops whole partial graph |
| application handoff | exact trait object only | runtime builder | process lifetime | no ref/material/root crosses boundary |
| shutdown/replacement | opaque adapter handles | entry/runtime owner | release with old process | no config dump or secret-derived report |

Implementation-specific memory protection、zeroization、provider session and certificate object APIs require the concrete product boundary and must be closed in its implementation boundary before code. Their absence from current design is not permission to retain copies.

### 8.6 Rotation and rollback contract

| Change | Preparation | Activation | Success gate | Rollback |
|---|---|---|---|---|
| endpoint/ref rotation | create new named section/ref; preserve old approved document | start new process with complete validation | graph complete and entry activation barrier passes | stop new process; retain/restart previous approved config |
| credential locator/version rotation | rotate provider material or create new locator/version; update ref metadata | full restart; old process has no refresh claim | provider resolve + kind/TLS/constructor validation pass | restore previous ref/version and restart; never print either value |
| trust bundle rotation | publish new trust material and ref/version | restart transport graph | required endpoint handshake/probe contract passes when product supports a startup probe | previous trust ref + restart |
| mTLS cert/key pair rotation | stage matching cert/key refs atomically in one config change | one new-process build | pair compatibility + constructor gate passes | restore previous pair as one unit |
| actor matcher rotation | replace actor section/ref | restart all affected source runners | all six source decisions and actor refinements validate | previous matcher ref + restart |
| route/transport rotation | update complete affected route/transport graph | restart collaboration graph | ten-route completeness and constructor gates pass | previous complete graph; no partial per-route live swap |
| fixture rotation | new schema-compatible artifact ref | restart/test rerun | fixture kind/schema/parity construction passes | previous fixture ref; no production use |

No row claims a real handshake, probe, test, evidence or rollout occurred. “Passes” defines a future activation predicate only.

### 8.7 Forbidden output rules

| Output surface | Allowed | Forbidden |
|---|---|---|
| config validation issue | stable issue category、path class、expected type/kind、profile、redacted ref digest | raw value、full path member name when sensitive、endpoint、locator、actor、secret-derived digest |
| structured log | exact configured family/slot、profile、binding kind、safe issue code/ref、low-cardinality outcome | full config/ref、endpoint、actor list、provider/locator/version、secret/body、raw cause |
| public/internal error | existing error category and safe diagnostic ref | config contents、secret/provider error body、endpoint、credential identity |
| metric | low-cardinality family/profile/result counts from exact allowlist | ref/address/actor/locator labels、secret-derived hash、high-cardinality free text |
| span/event | DDD Step 15 exact field schema only | raw config/secret/body、whole actor/ref、remote provider response、baggage with material |
| Job/consumer report or receipt | existing body-free typed refs and dispositions | config refs、provider details、secret/TLS/endpoint material、fake artifact body |
| outbound event/capture | immutable formal protocol payload only | route/transport/credential/TLS/config identity |
| config change audit | path class、actor/change ref、redacted old/new config/ref digests、outcome、rollback ref | raw old/new document、secret material、full sensitive ref、provider response |
| generated evidence/index | future evidence alias and digest only when actually produced by owner | fabricated alias/result、raw config、secret、endpoint inventory |

`Redacted` is not “hash every forbidden value.” Secret-derived hashes are forbidden; sensitive metadata digests may be emitted only where the exact profile declares that digest source. `Off` performs a pre-construction no-op for optional diagnostics.

### 8.8 Audit ownership and minimum record

| Audit concern | Owner | Minimum safe fields | Explicitly not asserted |
|---|---|---|---|
| provider access/read | selected provider/deployment security control | provider-side actor/session ref、locator digest、kind、outcome、time according product policy | Hub durable audit record or successful read evidence |
| config proposal/change | release/config control plane | actor ref、change request/ref、profile、path classes、old/new canonical redacted digest、reason ref | concrete ticket product or approval body |
| validation/activation | startup owner | document digest、schema/profile/entry、validation outcome、safe issue refs、activation outcome | runtime readiness until actually executed |
| rollback | release/config control plane | rollback ref、from/to redacted digest、reason、validation/activation outcome | successful rollback until run completes |
| rejected forbidden material | security/config owner | path class、forbidden category、safe issue ref、actor/change ref | forbidden value or its hash |

These are future record contracts. This design creates no audit row, evidence alias, run_id, ticket, signature or sign-off. Step 10 defines review level and rollback linkage; Step 12 hands evidence contracts downstream.

### 8.9 Profile-sensitive handling

| Profile/use | Allowed | Forbidden | Unavailable behavior |
|---|---|---|---|
| Local/local development | explicit fixture refs、inMemory、protected non-production endpoint/ref | raw production credential、secret body、implicit configured-to-fake fallback | selected ref/fixture invalid blocks startup |
| Local/CI deterministic | de-identified fixture artifact refs、deterministic clock/id | production provider ref/material、real secret in CI env/config | fixture missing/wrong schema fails test startup; no evidence claim |
| Integration/integration-like | controlled endpoint/credential/TLS refs or explicit fake/disabled | raw material、actor derived from credential/topic、configured failure fallback | configured provider/material/constructor failure blocks graph |
| Integration/operations replay | de-identified fixture/historical refs selected by approved test input | raw historical payload/secret/evidence package | invalid ref rejects run/startup according owner |
| Deployment/staging-like | approved provider/locator/version refs、authenticated network TLS | inMemory、fake、TLS downgrade、raw secret | fail-fast before exposure |
| Deployment/production-like | same ref-only rule and complete configured/disabled graph | test fixture、raw secret/env、unapproved provider/product assumption | fail-fast; no last-known-good inside same process |

### 8.10 Sensitive failure matrix

| Failure | Phase | Result | Fallback prohibited |
|---|---|---|---|
| raw secret/credential/userinfo appears in JSON/env/CLI | parse/forbidden-surface | reject with value-free security category | do not trim/redact-and-continue |
| sensitive ref grammar/bound invalid | parse/type | reject | no lower-priority JSON after invalid env |
| ref target missing/wrong kind/orphan/cycle | cross-field | reject | no sibling family or name guess |
| provider registration missing | assembly | configured graph fails | no environment lookup, SecretReferencePort or fake |
| provider unavailable/forbidden/expired | material resolution | configured graph fails closed | no cached unknown value or Disabled conversion |
| TLS cert/key/trust mismatch | constructor | whole graph fails | no TLS downgrade or one-sided pair update |
| endpoint contains userinfo/query not approved | validation | reject | no credential extraction |
| required redaction projection fails | observer | drop emission; at most existing non-recursive safe fallback | business flow not cancelled/reclassified; no raw fallback |
| optional redaction field unavailable | observer | omit field | no placeholder from raw value |
| observer sink fails | observer | non-cancelling/non-recursive observer failure rule | no retry queue/business state/evidence fabrication |

### 8.11 Step 5/7/9/10 handoff matrix

| Sensitive group | Step 5 source rule | Step 7 path | Step 9 loading obligation | Step 10 change obligation |
|---|---|---|---|---|
| store/adapter/feed/route refs | file-only named graph；selected scalar store ref may bounded env | exact registries and refs | grammar/family/reachability then constructor resolution | medium/high review, digest audit, restart rollback |
| actor refs | file-only | `trustedActors.*` | bound/count/family/refinement compile | high review; actor-set digest only |
| endpoint/transport | file-only | `transports/endpoints` | URI/no-userinfo/kind/TLS compatibility | high review; topology value suppressed |
| credential/TLS refs | file-only; no env secret | `credentialRefs/tlsPolicies` | provider lookup, kind/pair/TLS validation, exact injection | critical/high review; atomic pair rotation |
| fixture refs | explicit fixture lane | `fixtures` and fake branches | profile/kind/schema/artifact validation | test-owner review; Deployment veto |
| diagnostics | bounded mode env only | `diagnostics.mode` | Off/Redacted exact allowlist | redaction relaxation veto/design reopen |

### 8.12 Sensitive configuration stop review

| Group | Storage | Plaintext boundary | Rotation | Audit | Output/failure | Result |
|---|---|---|---|---|---|---|
| store/adapter/feed/route refs | closed | ref only | restart | digest/category | fail-fast/no full value | pass |
| endpoint/transport metadata | closed | protected non-secret metadata | restart | digest/scheme category | no clear output | pass |
| actor/fixture refs | closed | protected refs only | restart/test rerun | set/artifact digest | no identity/body/evidence claim | pass |
| credential/TLS refs | closed | ref only；material provider-only | atomic ref update + restart | provider/config owners separated | fail-closed/no downgrade | pass |
| raw secret/body | forbidden | no ordinary source | provider-side + restart | provider owner only | never output/hash | pass |

### 8.13 Cross-sensitive leakage audit

| Audit item | Result | Fixed rule |
|---|---|---|
| raw secret paths in Step 7 schema | 0 | ref-only registries |
| raw secret in examples | 0 | placeholder refs only |
| secret env/CLI allowlist | 0 | reserved-prefix unknown rejects |
| endpoint userinfo/query acceptance | 0 | userinfo forbidden；query gated until implementation closure |
| full sensitive ref output | 0 | category + approved digest only |
| secret-derived hash output | 0 | forbidden |
| provider response/error body output | 0 | stable failure class only |
| `SecretReferencePort` as provider | 0 | business resolver remains independent |
| configured-to-fake/disabled fallback | 0 | startup fail-closed |
| TLS downgrade | 0 | Deployment authenticated TLS; no fallback |
| live secret reload claim | 0 | restart-only P0 |
| audit owner ambiguity | 0 | provider read vs config change separated |
| observer changes business outcome | 0 | non-cancelling; no second authority |
| fake/test artifact as evidence | 0 | no evidence/signoff claim |
| 03 writeback gap | 0 | no typed/callable delta |

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| sensitive metadata四级归类 | 否 | config-only classification | formal 03 §§13~14 | 无回写 |
| provider-to-constructor secret injection | 否 | formal 03 delegated secret injection detail；不跨existing adapter boundary | §13.2/13.12 handoff | 无回写 |
| restart-only rotation | 否 | existing startup-only lifetime | §13.1/13.9 | 无回写 |
| Off/Redacted output suppression | 否 | exact Step 15 observer contract reuse | formal 03 §14 | 无回写 |
| future concrete provider API/memory carrier | 触发时是 | private constructor/code-contract change | DDD Step 14/15 and implementation boundary | 当前未引入；受控回开 |

Current impact: `待回写=0`, `阻塞待确认=0`。本 Step 新增 Rust declaration/struct/field/enum/variant/trait/method/callable=`0`，Rustdoc增量=`0`。未来provider或adapter private carrier若新增，struct及每个field、enum variant/payload、trait/method/callable均必须有英文 `///`。

## 10. Formal §8 回填草稿

正式 §8 应装配：

1. public/internal/sensitive/secret四级定义；
2. sensitive material flow和provider/constructor owner boundary；
3. Step 7 sensitive path catalog与credential-kind consumer matrix；
4. resolution/injection/lifetime、rotation/rollback和profile rules；
5. forbidden output、audit ownership和failure matrix；
6. cross-sensitive audit和03 controlled-reopen gate。

正式章节不得出现真实endpoint、actor、provider、locator、token、password、DSN、key/cert/trust body或产品名；不得宣称provider读取、handshake、rotation、test、evidence、signoff或rollback已执行。

## 11. 待确认事项

| 事项 | 当前状态 | 是否阻塞 Step 9 | 处理 |
|---|---|---|---|
| concrete secret provider/product | unselected | no | 07 prerequisite / implementation boundary；选定后按变化范围回开03/04 |
| provider memory/zeroization/session API | product-dependent | no | concrete boundary必须在code前闭合并满足最短lifetime |
| startup probe capability by transport | constructor-dependent | no | Step 9只定义capability gate，不伪造所有产品都可probe |
| certificate issuance/rotation runbook | operations-owned | no | 09 deployment/operations manual |
| config change audit backend | unselected | no | Step 10定义product-neutral record，backend留实施/运维 |

这些事项是implementation/deployment prerequisites或controlled-reopen triggers，不是当前upstream blocker。

## 12. 进入下一步条件

| Gate | 结果 |
|---|---|
| sensitive/secret inventory complete | pass |
| storage/plaintext/rotation/audit/output rules complete | pass |
| Step 7 paths and Step 5 sources traced | pass |
| Step 9/10 handoff complete | pass |
| raw secret/body in document | 0 |
| leakage audit unresolved | 0 |
| 03 writeback/blocker | 0 |

Step 8 is complete. Next allowed action: read SOP Step 9、writing standard §5.9、Steps 5~8、formal 03 runtime builder Stage 0~7 and existing validation/error carrier；then define exact source selection、parse、merge、validation、provider resolution、assembly and activation order without adding a second raw reader or hot reload.
