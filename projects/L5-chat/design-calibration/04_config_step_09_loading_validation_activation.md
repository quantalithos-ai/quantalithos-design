# L5-chat 04 · Step 9 定义配置加载、校验与生效机制

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step8及相关前序配置域结论；配置SOP Step9和书写规范§5.9；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. startup先唯一source.read，LocalConfigInput结构与profilecatalog检查；支持读取已解析对象但源文本parse必须保留重复键检测。
2. strict JSON拒注释/NaN/Infinity/duplicate/extra/prototype/非对象；数字不得字符串coerce，之后唯一映射flat14字段。
3. outer/schema/app=1，profile↔platform↔hostnull，refs正式注册资格独立；不发明nodes/edges数学约束。
4. 全startup无hot/reload；nativepolicy build-time。
5. malformed/missing invalid_input blockedstartup；缺SDK/host资格dependency_unbound阻相关能力，未初始化root不暴露旧材料。
6～7. 各域parse/type/range/cross/target一致，immutable全量提交。
8. 模块JSON映射/unit/strictparse影响03loader，必须回写既有§5.9/§13及Step6/14；保留签名和14字段。

## 4. 当前材料问题诊断

ConfigLoader.validate(input:unknown)没有明确模块外部形状。若只写04 nestedJSON而保持03flatparser，会产生两种合法格式；需明确外部模块输入、pure mapping与trustedsource校验位置。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置加载、校验与生效机制 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用既有ConfigLoader内部pure normalize+validate一次；不增加第二publicport或config状态机。八域全校验后才能创建immutable对象，禁止逐域生效；先03回写再完成此Step。

## 7. 结构化中间产物

### 7.1 配置加载流程图: Chat启动全量校验与冻结

```text
[approved composition source selector]
 -> [LocalConfigSource.read / strict JSON parse, reject duplicates]
 -> [LocalConfigInput factory + schema/profile catalog]
 -> [ConfigLoader.validate(value) / exact eight modules]
 -> [types/literals/required/ranges + cross-field checks]
 -> [pure 14-leaf mapping -> immutable ClientConfig]
 -> [formal SDK / native profile qualification, independently]
 -> [new epoch + immutable root + typed deps + page callbacks]
failure -> [safe blocked startup or independently blocked capability]
```

关键说明：
- 没有半有效配置或模块提前激活；旧composition不能被live mutation。
- 只有三安全缺叶子能default，显式非法/额外键不吞掉。
- SDK/host资格独立检查，ref格式通过不是authority；unknown effect不会因此重发。

### 7.2 全量与交叉校验

| 阶段 | 输入/检查 | 输出或失败 |
|---|---|---|
| source.read | 一次批准source；JSON文本拒duplicate/comments/nonfinite/prototype，注入对象只plain data properties | LocalConfigInput或storage_unavailable/invalid_input；无raw反馈 |
| outer | schemaVersion=1；profileId属于六catalog，不能作为任意path | 合格value，非法invalid_input |
| strict roots | 八域必填plain object；未知/数组/null/flatroot/extra字段拒绝 | 仅批准叶子 |
| defaults | 仅app.schemaVersion/local_state.memoryOnly/diagnostic.mode缺叶子补1/true/disabled | 原显式非法拒绝 |
| types/ranges | 数值safeinteger1..该字段上限；ref格式≤128，平台及诊断finite enum | 不coerce/clamp；invalid_input |
| cross-field | 外壳schema与app同1；profile对应platform；desktop hostref非空/preview显式null | 不“修正”profile或推断权限 |
| normalize | Step7十四路径1:1映射到existing flat字段 | immutable ClientConfig |
| SDK qualification | profile/exports/schema/真实owner映射正式证明；未知binding保持blocked | dependency_unbound，禁privatefallback |
| native qualification | hostref匹配批准buildpolicy+可信window/origin+逐能力probe | 缺权限/可信origin则blocked/restricted；无默认grant |
| activate | 全config校验先于session/root/coordinator/UI注册；同一composition一次 | 新epoch；无subscriber双重注册 |
| replace | dispose旧composition后新加载；先hide/invalidate→stop/unsubscribe→clear | 不继承refs/slots/draft/unknown命令权限 |

profileId只标识批准来源，不是任意SDK/host DTO；ConfigLoader.validate签名不变，外壳catalog检查由load先完成。规范source对parsed对象仍需检查own properties/不可调用getter；读取源文本不能用普通JSON.parse后才尝试发现丢失的重复键。配置非法只existing invalid_input；没有ConfigError新enum。preview不得接nativepolicy；形式通过也不能fake注册session。

### 7.3 native批准域与版本门禁

native HostBoundaryGuard仍构造new(approved_windows,approved_origins)，两非空精确allowlist由native批准buildprofile提供；未取得确值/可信invocation origin则拒绝，不从ordinaryJSON/header/request.window推断。只Lifecycle/Accessibility probe既有有限请求，controlled_preview/safe_storage执行当前仍blocked。窗口、origin、CSP、capabilities/main.json和Tauri bundle权限逐OS闭口后才可启用相应技术能力，不新增shell/file/http/plugin万能权限。

Tauri2/React/TS/Vite方向保留；精准patch/SDKexport-dist compatibility/OS批准origin未验证，production binding gate继续blocked。配置文件例不包含native策略或lock，07真实文件生成与05测试后可记录实际批准版本。

### app加载小循环

问题：app.schemaVersion、app.platform如何进入ConfigLoader/ApplicationComposition？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| app | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | schemaVersion,platform→ConfigLoader/ApplicationComposition | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### sdk加载小循环

问题：sdk.profileRef如何进入SdkCapabilityBinding/SDK adapters？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；SDK正式绑定独立检查。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| sdk | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | sdkProfileRef→SdkCapabilityBinding/SDK adapters | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### platform加载小循环

问题：platform.hostProfileRef如何进入DesktopPlatformAdapter/HostBoundaryGuard？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；hostbuildpolicy独立批准。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| platform | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | hostProfileRef→DesktopPlatformAdapter/HostBoundaryGuard | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### intents加载小循环

问题：intents.maxTextUnits、intents.maxAttachmentRefs如何进入DraftPolicy/冻结输入工厂？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| intents | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | maxTextUnits,maxAttachmentRefs→DraftPolicy/冻结输入工厂 | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### local_state加载小循环

问题：local_state.maxCachedEntries、local_state.memoryOnly如何进入PersistenceSafetyGuard/repository？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| local_state | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | maxCachedEntries,memoryOnly→PersistenceSafetyGuard/repository | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### continuity加载小循环

问题：continuity.maxConsumedChanges、continuity.maxConsumptionContexts如何进入reducer/consumer slots/cleanup？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| continuity | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | maxConsumedChanges,maxConsumptionContexts→reducer/consumer slots/cleanup | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### collaboration加载小循环

问题：collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges如何进入search factory/Process renderer/safe topology？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| collaboration | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | maxDirectoryQueryUnits,maxVisibleProcessNodes,maxVisibleProcessEdges→search factory/Process renderer/safe topology | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### diagnostic加载小循环

问题：diagnostic.mode如何进入DiagnosticHandoffAdapter？由唯一loader完成本域type/range后和其它域一起生成flatconfig。
诊断：逐域提前生效或容忍坏字段会使composition分裂；ref/value不可自授资格。
取舍：startup全量freeze，无reload；只注入必要typed参数。

| 域 | parse/type/cross校验 | assemble target | 失败/生效 |
|---|---|---|---|
| diagnostic | Step7本域精确keys/types/单位/限值；Step6profile匹配；safe defaults仅已列叶子 | diagnosticMode→DiagnosticHandoffAdapter | invalid_input阻装配；真实资格不足blocked；startup |

回填：§9加载表。本域校验/消费者/失败码可回指03；local gate通过。

### 7.4 回写与跨加载审查

03正式§5.9.1.1、§13以及03 Step6/14已原位同步外部8域JSON→flat14字段、duplicate/source检查、UTF-16单位和全量freeze。无新增signature/type/field/state。Step7影响行已由待回写变已回写；没有未处理active契约变更。所有域必填/范围/交叉/缺项一致，native批准策略与ordinaryJSON隔离；没有hot rollback漏洞或half-config。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 八域JSON→flat14字段、strict duplicate/plain-data检查、文本单位及全量freeze | 是 | loader/validation语义；无签名变化 | 03 §5.9.1.1/§13；03 Step6/14 | 已回写 |
| 数字范围、profile catalog、来源与敏感级别 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §9仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step10 SOP/对应书写规范。无代码、应用测试或commit。
