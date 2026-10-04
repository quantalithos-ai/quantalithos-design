# L6-bridges 04 Step11：失效与安全降级

## 1. Step状态与开工确认

2026-10-04；前序Step10已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S11 | done | done | done | done | pass | enter_step12 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step5来源/Step7项/Step9加载/Step10cold失败；03 finite reason/error、NoIo/NoEffect/原unknown与read visibility；配置SOP Step11和书写§5.11。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 缺失 | 必填/selected required缺失阻候选startup；runtime当前资格缺失阻对应IO，原事实不改。 |
| 2 错型/交叉 | exit2/3有限理由，不补默认、不部分publish；size/private/resource cap先限量再处理。 |
| 3 secret不可用 | fail-closed；已possible effect保unknown，未IO不造已送达；无ENV/API Key/latest fallback。 |
| 4 config center不可达 | 本轮未选remote/admin，根schema不支持，不能用不可达当放宽理由。 |
| 5 漂移/过期 | every IO current核actual source/version/scope/route/private/secret；disk内容只cold新snapshot，不watch；expiry拒执行不删unknown。 |

## 4. 当前文档问题诊断

统一写“重试/降级”会混淆未发生IO、known拒绝、external unknown和local commit unknown。降级不能公开附件/审批或回退旧权限；告警不能旁路Observability缺失规则。配置文件变化不自动变更内存或取得新authority。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 分散CF/冷失败条件 | 27失效类具名行为/影响/告警限制/planned测试切口 |
| degraded可能被当宽松fallback | degraded仅未选功能/已合法current裁剪，unknown和缺权限不变成功 |
| expiry依赖job维护风险 | IO即时current拒绝，不等J05且不物理删原事实 |

## 6. 设计取舍与复杂度

采用parse fail-fast、runtime current fail-closed、unknown original保留与有限只读解释；未采用授权LKG、default-fallback、复用旧token/默认target、错误cause继承或以“告警已发送”掩盖缺准入。告警是后续合格通道的要求，当前无alert/test/run事实。按27类失效收口，不新增统一success/error DTO。

## 7. 结构化中间产物

### 7.1 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | planned测试切口 |
|---|---|---|---|---|
| F01 无--config/路径不存在/非授权file | 整个候选宿主 | fail-fast exit2；不猜CWD/HOME/default | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | L01/L02路径负例；未执行 |
| F02 非UTF8/BOM/size/depth/元素超限 | parse/资源 | fail-fast exit2；不读无限bytes、不吐片段 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | hard cap边界/流式超限；未执行 |
| F03 duplicate/unknown/missing key、注释/尾值 | schema | fail-fast exit2；不能last-wins或merge | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 每级duplicate/未知根/嵌套错键；未执行 |
| F04 enum/int/selector错型/越限/@缺版本 | 字段/checked conversion | fail-fast exit2；不转字符串/float/指数/截断 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 整数边界与所有enum/selector；未执行 |
| F05 CLI/ENV不同值/重复flag/未知prefix | 本进程来源 | fail-fast exit2；不静默override、未知key不读取值 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 三flag/ENV/七bin；未执行 |
| F06 选用项null/空数组或多余source/namespace | selected required | exit2/3；未消费才null，不能selected silent fallback | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 全部条件required与CF05~11；未执行 |
| F07 basis/profile/environment/build/scope漂移 | 整体qualified候选 | exit3；无self批准或fixture→prod | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | crossenv/source/profile元组；未执行 |
| F08 预算为0/超cap/未被profile批准/overflow | 执行与private buffer | exit2/3或runtime有限拒绝；不扩大/无限wait | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 五数值/checked累计bytes；未执行 |
| F09 旧draft未C01接纳/错revision/content | 安装配置/runtime | exit3；不自动C01/CAS或runtime补记录 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 首次Management-only与新old内容；未执行 |
| F10 SDK/driver/pin/method未选/不兼容 | 平台选用能力 | NotSelected/NotEstablished/Unsupported；exit3不绑定，runtime阻该能力 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 十二method/hidden retry/raw日志/复制行为；未执行 |
| F11 source双模式/Telegram group非原子/错family | 来源与gap | exit3；不先开新source；换epoch保持gap/unknown | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 两family八mode排他与disconnect；未执行 |
| F12 secret/provider/KMS不可达/撤销/expiry | 受影响IO | fail-closed；无rawENV/latest/API Key/新身份fallback；可能已触发的original保持unknown | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 五用途/resolve/revalidate/最后IO撤销；未执行 |
| F13 route/TLS/SSRF/proxy/redirect不合格 | 平台/owner/private运输 | 拒binding或IO；不跟未经授权redirect，不回显URL/DSN | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | fixed route/证书/私有target；未执行 |
| F14 Actor/双端绑定/Policy/Gate/action/current缺失 | 关系/外显/owner动作 | fail-closed拒；签名/OAuth/PAT不授权，secret不能替actor | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | external_id/旧generation/低敏默认approve负例；未执行 |
| F15 必要material/附件grant失效或Workspace未核 | payload/投影 | fail-closed MissingMaterial/Unavailable；只有正式可省略/RefOnly资格才有限展示，不造空成功/公共URL | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 附件必要/可省略、WS十二未决；未执行 |
| F16 mandatory规则/producer/schema/admission缺失 | 受保护mutation/IO | 先blocked；不默audit-only、不伪canonical/evidence；通道缺失不宣alert送达 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | OwnerMandatory与nonrecursive规则；未执行 |
| F17 local driver/CAS/unique/schema/whole commit故障 | 本地局部写入 | actual known拒/rollback按原proof；indeterminate原mutation同driver probe，不换库/新begin | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 19collection/all-or-none与崩溃点；未执行 |
| F18 429/rate scope未知或not_before超本地wait | lane/自动dispatch | 全部scope取max；预算到期仍waiting/blocked，不提前重试，不暴露token/bucket原值 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | global/method/resource/bucket+Retry-After；未执行 |
| F19 RetryBudget/原attempt窗口耗尽/NoEffect不成立 | 原subject恢复/重交 | 停止自动路径manual/blocked；timeout/lease/NoIo不伪NoEffect，不重置used或换effect | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 原used/CAS/unknown/SDK零hidden retry；未执行 |
| F20 comparator/coverage缺失/partial/跨epoch | cursor/gap/replay | incomparable/gap/manual；不用ID/time/partial推进owner stage | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | same stream/stage/epoch与full coverage；未执行 |
| F21 retention过期但maintenance/Gate proof缺失 | dedup expiry/J05 | 拒迁移；即时阻新不合格IO；timer/TTL不清key/result/tombstone/unknown | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | expiry proof窗口与原到期窗口分离；未执行 |
| F22 cold候选失败/旧profile/provider已撤销 | 配置更新/回退 | new不publish；旧actual只current成立可继续，否则blocked；新revision语义回退 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 旧文件/C01已提交与撤销；未执行 |
| F23 shutdown clock/profile不可核或deadline到期 | scoped work/停止 | 阻新IO、隔离/取消保actual unknown；不虚构deadline/StoppedLocal/NoEffect，不无限drain | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | CFG-03-001 same tuple/stop-time budget；未执行 |
| F24 config center/admin override不存在/不可达 | 未选来源 | 无该配置域/来源；不尝试读取、无fallback，也不创造remote产品 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 拒隐式remote/env覆盖；未执行 |
| F25 trusted invocation/page/source资格过期 | Jobs/worker | 拒执行、保原candidate/plan/op身份；不造operator上下文或新subject | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 五J kind/current/page/取消；未执行 |
| F26 诊断/SDK raw error/secret存在性泄漏风险 | 所有出口 | finite sanitizer拒原cause，禁止Debug/error-source/dump；不合格库不绑定 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 全面出口扫描/拒泄露；未执行 |
| F27 provider/producer/平台结果未知或late result | 原operation/效果 | known immutable优先；indeterminate(original)保key/op；late已知结果只原finalize，有current且不重发 | 需要安全诊断；仅03已合格fixed allowlist通道，缺失不宣alert送达 | 原claim/receipt/本地finalize与真实结果分阶段；未执行 |

### 7.2 失效策略边界

| 策略 | 本轮适用 / 不适用 | 必须保持 |
|---|---|---|
| fail-fast | startup parse/shape/required/actual binding错误，候选整体不发布 | 不造partial ConfigQualified/Active |
| fail-closed | 运行authority/source/material/secret/route/limit/current缺失，mutation/IO之前拒绝 | 原known/unknown/key/effect/target独立，不假无效果 |
| last-known-good | 不提供authority/secret/source LKG；旧宿主只在其原actual/current仍合法时独立继续，不是新值失败自动fallback | revoked/expired即阻IO；已C01接纳内容须匹配新revision语义 |
| default-fallback | P0无，只有--validate-config缺省false的entry模式不是业务默认 | provider/token/target/budget不能默认 |
| degraded | 明确未消费条件模块不影响其他合格宿主；已获准RefOnly/安全提示、Query受权stale阶段解释可有限展示 | 不取缺权限空body/hidden count、public附件或默认审批 |
| reject-new-value | 无hot/reload；cold候选失败不publish，旧actual资格另核 | 不把拒候选当回滚已提交C01或外部效果 |

protocol ACK只按03 actual qualified private driver和原ProtocolAckPlan语义执行：未满足其durable接管条件不能宣成功durable ACK；若协议允许安全拒绝/收到信号，则仍不证明owner accepted/Turn/送达。失败不把raw body缓存待回放，恢复只按正式safe refs/完整source资格与original生命周期。

漂移通过已建actual来源/资格当前读取发现，time/clock不是授权；configuration文件新内容未cold接纳不影响已载入immutable snapshot。若正式basis/current source已撤销，立即阻后续相关IO，不等watcher/Job/下一次restart，也不抹历史结果。有限诊断只固定field/类别/finite reason，不暴露实际index、内部存在性/ref/count或原secret/URL/cause。

### 7.3 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 27失效类按原finite错误/current/unknown处理 | 否 | 既有03分支配置触发映射，无新app error DTO | 03§7/9/11~14，不改 | 无回写 |
| actual shutdown无old seed复用 | 是，前步已处理 | CFG-03-001继承 | 03§5/6/9/13 | 已回写 |

## 8. 回填草稿

正式§11逐字装配§7.1~7.3；P0缺失/错误/过期/漂移/不可达与原unknown都有明确安全出口。没有授权LKG/default-fallback，degraded只限已获准材料/未消费功能；protocol ACK/current漂移/告警边界必须保留，全部切口planned/未执行。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；27类失败覆盖缺失/错型/跨域/过期/漂移/不可达/unknown，策略与82项/C01/current/原finite结果一致。

self_review=pass_design_static；下一仅enter_step12。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
