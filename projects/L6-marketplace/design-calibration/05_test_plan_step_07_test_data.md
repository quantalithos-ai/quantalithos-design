# Step 7：设计测试数据

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（数据设计）。输入Step6全部98TC及03 schema/state/PG契约；输出13个DS、确定性builder、13CUT数据停审与隔离/清理规则。不创建fixture文件、asset、secret、digest或run。

Step内计划：逐TC数据需求→基础/异常/并发/恢复构造→逐CUT隔离清理停审→跨污染审计；完成。所有构造路径是未来测试设计，数据实际不存在。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_06_cases.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入

[Step6](05_test_plan_step_06_cases.md)及其49入口/13CUT附录；03 Step6/8完整字段、Step10矩阵、[Step11](03_ddd_step_11_persistence_transactions.md)/[Step13](03_ddd_step_13_concurrency_idempotency.md)、04§6/8/9；SOP Step7与书写规范§5.7。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 基础数据？ | trusted Core actor/delegate、current scope、typed ref及合法状态、完整original result/plan/checkpoint；13DS如下。 |
| 边界/异常/并发/恢复？ | 每DS有效基底后单维变异；故障和竞争是单独builder variant，不复用happy result。 |
| 跨run隔离？ | run/case/subcase命名空间仅测试harness；不新增domain run_id字段。PG每run独立临时DB/schema且凭据仅test权限。 |
| 清理？ | 内存drop；PG关闭所有连接后验证本run所有权、销毁测试隔离资源；失败先产redacted raw/report，不删除责任后才观察。 |
| 外部替身？ | 同公开ports typed fake/stub/spy；真实PG必须actual；owner staging real-like仍需正式非生产资格。 |
| 每P0可稳定构造？ | Step6每行DS均在§7.1；TC到DS可反查，不依赖人工补ref或真实asset。 |
| 独立异常数据？ | `variant`明确valid/field-missing/hidden/stale/wrong-binding/fault/race/recovery；非法序列不写入生产。 |
| 逐CUT停审？ | §7.3列13CUT构造/清理/替身结论，全部设计pass。 |
| 跨污染审计？ | §7.4；PG真实多Tx不包在test总rollback，外部fixture不读写生产truth。 |

## 4. 当前文档问题诊断

初稿DS名称与TC未一一匹配；将每case包进单Tx会遮蔽commit顺序/A-B/晚结果；readonly也需要有界可见fixture。旧basis fixture使Draft提前冻结，恢复fixture只列Unknown泛称。现在使用正式state与原完整数据。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| family级dataset | 每TC明确DS，13CUT反查 | 防无数据断言 |
| 每case transaction | pure/fake隔离与PG多连接commit分开 | 不掩盖真实原子性 |
| 人工/真实包候选 | deterministic typed builder+fault scenario | 不伪asset/资格 |

## 6. 测试设计取舍

采用`builder(schema_version,seed,namespace,variant)`作为测试harness设计接口，具体Rust/TS函数在07/实现阶段落代码，不是新业务DTO。未采用一份mutable global fixture：它易使scope/state/原result跨case污染。对PG允许schema-only负例与真实事务seed分层；不可通过private fake map构造应用看不到的字段。

## 7. 结构化中间产物

### 7.1 数据集与TC绑定

下列DS编号省略`DS-`；所有builder依03正式类型/factory/rehydrate，malformed codec负例在wire/row边界单独构造，不绕业务factory接受非法truth。每TC唯一主DS见Step6全表，以下关联列为代表入口；完整关联由Step6按DS列反查，不能用代表替代所有TC前置。

| DS | 内容/用途 | 构造方式与异常变体 | 替身 | 隔离/清理 | 关联TC代表 |
|---|---|---|---|---|---|
| BASE | Core actor/meta、43对象/14carrier/49协议/33canonical | typed schema inventory builder；每叶字段/guard/state/pair；完整results/reports | pure+同公开port spy | run/case/subcase内存；drop | CROSS-001/002/005/011～014/018/020/023 |
| SOURCE | 五类来源、publisher/material资格 | formal slice controlled valid；缺digest/visibility/材料、AI冒充human、release/CAS | Source/Publisher/Material typed fake | 同命名空间；drop | SOURCE-001～006 |
| REVIEW | Draft/Submitted/Terminated、basis/review/decision | Draft basis/review None；Submit后freeze；matched approved/rejected/失效；A/B faults | Governance fullbinding/probe fake | 原basis/report不可变，case终了drop | REVIEW-001～010 |
| CATALOG | 多listing/version/category、safe projection | same type multiplelisting、各scope/hidden/withdrawn/shortZH/literal SQL字符；环/duplicate | 当前owner/scope fake+实际PG | 独立PG namespace；先观察再clean | CATALOG-001～010、CROSS-004 |
| DISTRIBUTION | exact target/intent/relation/attempt/outcome | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked；wrongbinding、cancel/late | Receiver/probe full typed fake | 原intent/permission冻结；drop或隔离PG | DISTRIBUTION-001～010 |
| WITHDRAWAL | disposition/Impact/NoticeIntent | Partial/KnownScopeComplete、fixedupper两族多页、upper后late、ordered targets/unknown notice | Notice/probe fake+local store | 跨case不共享upper/plan；drop | WITHDRAWAL-001～010 |
| RECOVERY | operation/context/fullresult/checkpoint/permission | Completed完整、Reserved不足、wrongkind/缺本体、expired claim/oldfence、finite targets | fault spy+正式typed inspection fake | 原auditset/report保持；多Tx先留故障职责再观察 | RECOVERY-001～011、CROSS-019 |
| REFERENCE | safe snapshots、完整projection plan/items/body | Qualified/Stale/Unavailable，Rendered/Omitted、missing/duplicate/requiredempty、kind高水位 | owner slice fake+真实PG | body-free历史与manifest同namespace | REFERENCE-001～006 |
| CONFIG | strict JSON六域/七字段/八slot/profile | duplicate token JSON、unknown/type/null/ref/budget/locale/origin变异；不同source选择 | test provider/ref stub；builder fault | 每case临时配置输入缓冲及句柄drop；不写生产config | CONFIG-001～006/008～012、CROSS-009/022 |
| SECURITY | secret/body/URL/high-cardinality sentinel | 合成unique sentinel，不是真凭据；日志/trace/error/metric/bundle/report多sink | capture sink+typed error stub | 每case独立capture；原secret sentinel不保存artifact | CONFIG-007、CROSS-006/007 |
| PG | frame/CAS/as-of/lock/late/atomicity | 独立seed commit；多连接barrier安排两种次序/rollback/commit disconnect；history missing | 实际隔离PG，SDK typed fake | run独占临时DB/schema；commit不总rollback；收集后owner-checked清理 | CROSS-003/015/016/017 |
| WEB | DTO/readsurface/操作进度/locale | TS builder镜像正式schema；所有页面/empty/loading/degraded/unknown/denied/非法DTO | test API/组件stub或isolated实际API | 每case独立browser context/storage/locale；关闭context | CROSS-008/021 |
| EVIDENCE | schema/path/pairing/digest/redaction负例 | 合成in-memory元数据，不标真实run；生成器未来计算test bytes checksum再单维破坏 | test report generator inputs | 临时test artifact namespace，不进入正式evidence index | CROSS-010 |

### 7.2 可重复构造与故障次序

`seed`由suite version+TC+subcase标签确定并记录在未来meta，实际IDs带测试namespace但仍满足typed validator；不同run之间无碰撞，同seed可复现结构。业务fingerprint由真实被测canonical函数计算，test不预填正确hash；asset_digest只是不透明schema合法测试值，标为synthetic，绝非资产包摘要。formal decision/scan/signature/notice仅controlled binding分支，无真实证据声称。

| variant | 确定性构造/操作 | 独立断言 |
|---|---|---|
| valid/readonly | builder先生成完整可见及隐藏两组，只读预置后冻结 | Q/replay资源spy计数前后，数据本身不得被query补齐 |
| field/codec boundary | required缺一个、unknown key、wrongkind/tag、u64边界/null | 精确错误来源，不以随机exception通过 |
| state/guard boundary | 逐正式pair，guard单条件false、terminal、conditionref缺 | R无变更；S不盲重试；factory不算pair |
| A/B fault | barrier在具体port调用前后触发，不用随机sleep判时序 | 每phase preserved checkpoint/result/work；A unknown无effect |
| race | 两writer+observer、explicit rendezvous、两commit次序 | frame锁/CAS/withdraw与late duty，可重复而非调度运气 |
| recovery | fixture seed原immutable checkpoint+permission，故障后新worker/newfence | 原intentprobe、B新load、no-report等待、不覆盖原result |
| negative evidence | 标记synthetic test-input，仅验证validator reject | 负例不得流入真实acceptance/evidence |

清理失败为infra defect/failed suite，不悄悄复用dirty namespace。恢复case先保存必要redacted诊断再清理，不能为了tear-down把DeferredWork置Settled或删unknown后声称安全恢复。

### 7.3 逐切口数据停审

| CUT-MP | 数据前置与代表TC | 隔离/替身/清理核验 | 设计结论 |
|---|---|---|---|
| 01 | BASE wire variants/CROSS-011 | 每field独立、无真实body、内存drop | pass |
| 02 | BASE state/Row/CROSS-012/013、REVIEW | factory与非法codec分开、无全局state污染 | pass |
| 03 | 七U DS+CROSS-014 | 同17ports接口、spy/fault独立、无private补口 | pass |
| 04 | PG+CROSS-015 | 真实连接commit/observer、原write set故障逐点 | pass |
| 05 | REVIEW/DISTRIBUTION/WITHDRAWAL/RECOVERY | 明确phase barrier与原probe、故障职责观察后清理 | pass |
| 06 | BASE/RECOVERY+CROSS-001/002 | exact key/seed、immutable result不被预期代码改写 | pass |
| 07 | PG/CATALOG+CROSS-017 | scope/selector/visible anchor与非paged数据区分 | pass |
| 08 | PG/WITHDRAWAL+CROSS-016 | 多connection两顺序+late多个disposition，无随机sleep | pass |
| 09 | REFERENCE/PG+CROSS-004 | as-of历史/manifest完整与各负变体分开 | pass |
| 10 | CONFIG/SECURITY | strict parser原字节可重复，provider stub不过度资格 | pass |
| 11 | SECURITY/RECOVERY/PG | sentinel capture与auditset完整，原敏感值不归档 | pass |
| 12 | BASE及七U只读fixture | freeze before Q/replay，全可变资源spy | pass |
| 13 | WEB/CONFIG | 独立browser context，默认En不受旧localstorage污染 | pass |

### 7.4 跨数据审计

| 项 | 结论/防污染约束 |
|---|---|
| TC→DS | Step6全部98行DS均在本表，不存在“先手工创建”前置 |
| run isolation | harness run/case/subcase唯一，不私加domain字段；PG角色无生产权限 |
| cleanup | 先证明故障责任、收集redacted raw/report再清理；不用broad目录/生产表truncate |
| shared fixtures | immutable模板可复用，mutable对象每case拷贝/重建；相同key测试只在该case共享 |
| external seams | fake/stub同正式port；PG actual；real-like owner须获资格，当前blocked |
| retention/history | case期间不GC terminal/Unknown/as-of；未来测试临时资源清理不等业务GC授权 |
| secret/artifact | 合成值仅capture内存，持久输出只有redacted结构；不读取真实secret |

## 8. 回填草稿

正式§7采用13DS表、builder/variant规则、PG与fake隔离清理边界；逐CUT停审与污染诊断留本文件。运行路径与证据归档由Step9/13统一，不在此创建test目录。

## 9. 待确认事项

exact owner schema/consumer、test PG资源与profile、容量baseline仍pending/blocked。无PackageRelease/InstallRecord/EntitlementView/payment fixture新truth。详细设计影响判定：数据只沿已定义schema，不需新增字段；若公开ports无法构造前置或故障，则回03，不在fixture补隐式接口。

## 10. 进入下一步条件

98TC前置DS可定位，13CUT数据设计独立停审、跨隔离清理无未记录冲突。下一读SOP Step8/规范§5.8、01依赖裁剪及04全profile/config，不提交commit。
