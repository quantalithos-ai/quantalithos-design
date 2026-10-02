# Step 6：数据边界与架构红线验收

## 1. Step 状态

SOP Step6/规范5.6；正式§6；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=八项独立停审及跨边界审计完成；next_allowed_action=Step7接口同步。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取输入 | done | §2 |
| SOP问题 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6八单元先思考 |
| 结构化/逐项停审 | done | §7 |
| 复杂度 | done | 八项留主控，不另造truth schema |
| 草稿 | done | §8 |
| 跨项自检 | done | §10 |

## 2. 本步输入

source_files：[Step5](06_acceptance_step_05_function_gate.md)/item reviews的界限、失败影响、external缺口；01依赖/ownership、0343对象/Step11/13/15、04禁止配置、05CROSS/REFERENCE/CONFIG。00G01/G02及五VETO为canonical authority。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 不得保存哪些？ | Method/Role/ProcessTemplate正文、Registry/Adapter truth、image body、Artifact body/lineage、Identity/authtruth、Gov approval及credential/raw材料。 |
| 下游能反写吗？ | Web/console/receiver/notification只经已有入口，不能直接DB或授权改变市场/ownertruth；SDKconsumer无权补owner。 |
| projection/cache呢？ | 完整manifest由committed facts重建，只读currentfilter；不以缓存授权、index修源truth或查询写入。 |
| P1污染？ | rating/ranking/install/payment/Archive/event等不能成P0成立前置或零成本开关，新增先00/01确认。 |
| 红线失败否决吗？ | 按五VETO对应事实触发S/总体不通过；依赖/readonly/config结构不符合也至少P0阻断，不能假造第六VETO。 |

## 4. 当前文档问题诊断

旧06以entitlement/install/ranking truth为既定边界，当前43对象无此类对象。仅文档ownership口号不足，要检查actual schema/依赖/结果/索引/log/report写面；不能靠展示隐藏body而保数据库第二truth。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| “不反写真相”笼统 | 八项实际写面/依赖/只读/配置负例 | 可裁决而非口号 |
| 只检DB | DB/DTO/index/日志/报告/Web全sink | 防旁路与复制 |
| 环境label当资格 | 正式adapter资格及test-only fake | scope不能配置出来 |

## 6. 设计取舍与单元先思考

| GT | 风险问题 | 采用/未采用 |
|---|---|---|
| GT-MP-B01 | metadata ref滑为body第二truth | owner immutable refs；不复制或重算asset digest |
| GT-MP-B02 | 授权/Gov被SDK/AI/scan代替 | exact formal authority；不接受标签/ACK |
| GT-MP-B03 | public/cache/index绕current | items/count/token同current；不信旧projection资格 |
| GT-MP-B04 | Query/replay副作用隐形 | 九可变资源spy+PG；不只查业务row数 |
| GT-MP-B05 | Web/owner源码归并或跨owner事务 | Core/SDKcompile+SDKadapter；不直依赖服务源码 |
| GT-MP-B06 | 恢复/重建删历史或修源 | committed facts/原report；不任意SQL/forcecomplete |
| GT-MP-B07 | config打开财务/事件/Archive或fake | strict keys/static invariants；不silent ignore |
| GT-MP-B08 | safe材料经诊断重新泄漏 | 所有sink finite allowlist；不归档rawsecret证明扫描 |

## 7. 结构化中间产物

每行在§6相同编号先思考后独立审查。report/raw唯一展开规则见[Step5§7](06_acceptance_step_05_function_gate.md#7-结构化中间产物)，用完整EV-ID定位同run EV MD/JSON及其required主TC raw/report；GT只回指canonical AC，不写进05 `ac_refs`。

| GT/AC | 正式设计/检查面 | 通过条件 | 失败条件/裁决 | TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-B01 / AC-MP-101/102/G01 | 03U1/43factory、owner refs/DTO/store/index | 五type immutable元数据与材料ref保持原值，无正文/血缘/credential第二truth | body复制/自产资格命VETO-MP-1；其余P0阻断 | TC-SOURCE-003→EV-DOMAIN-003；TC-CROSS-012→EV-DOMAIN-027；design-stop/pass |
| GT-MP-B02 / AC-MP-202/401/G01 | 03U1/2/4、Coremeta/Gov binding | human/org/auth正式owner、current批准、exactscope唯一 | AI/scan/signature/ACK/配置代资格VETO-MP-1/2/3 | TC-SOURCE-005→EV-DOMAIN-005；TC-REVIEW-008→EV-DOMAIN-014；TC-CROSS-007→EV-API-002；design-stop/pass |
| GT-MP-B03 / AC-MP-301/302/303 | 03U3/U7、items/count/token/current/as-of | visibility先筛选、投影只候选，隐藏无存在性 | UI/public/旧index绕scope/撤回VETO-MP-3 | TC-CATALOG-008→EV-PG-008；TC-CROSS-017→EV-PG-021；design-stop/pass |
| GT-MP-B04 / AC-MP-302/G02 | 03§8.4/12、16Q/33replay | writeTx/ID/Clock/context/audit/work/O/P/owner effect九项零，原payload整体披露或拒绝 | 任一新副作用P0阻断；篡truth/history命VETO-MP-5 | TC-CROSS-005→EV-API-001；TC-RECOVERY-001→EV-RECOVERY-001；design-stop/pass |
| GT-MP-B05 / AC-MP-G01/G02 | 01依赖；03crate/SDKadapter/Tx | 六Rustmember+Web；只Core/SDKcompile，owner经SDK；无跨owner事务；listing独立 | 合并Hub/Method/直owner path/Billing/Archive/Bus lane为P0或相应truth VETO | TC-CROSS-020→EV-UNIT-005；TC-CROSS-014→EV-UNIT-004；design-stop/pass |
| GT-MP-B06 / AC-MP-504/G02 | 03U6/7原result/checkpoint/plan | 原intent/probe、committed truth与complete manifest重建，历史保留 | force success/删改history/反写ownerVETO-MP-5 | TC-RECOVERY-004→EV-RECOVERY-004；TC-REFERENCE-004→EV-PG-014；design-stop/pass |
| GT-MP-B07 / AC-MP-G01/G03/402 | 04strict keys/profile、03静态不变量 | fake仅test；缺slot Blocked；无hot/admin、财务/Archive/event/skipgate键 | 生产fake/unknown键P0；财务伪truthVETO-MP-4，approval/visibility绕过按VETO2/3 | TC-CONFIG-012→EV-CONFIG-012；TC-CROSS-009→EV-CONFIG-013；TC-CROSS-022→EV-CONFIG-014；design-stop/pass |
| GT-MP-B08 / AC-MP-503/G01 | 03观测/04secret/05schema全sink | safe refs-only/finite labels，失败与生成报告也redact | 原body/secret/stack/URL/locator泄漏VETO-MP-1；伪evidence按VETO-MP-5/P0 | TC-CROSS-006→EV-REDACTION-001；TC-CONFIG-007→EV-CONFIG-007；TC-CROSS-010→EV-RELEASE-001；design-stop/pass |

| 跨边界审计 | 结论/后续 |
|---|---|
| ownership/依赖无反向 | 八项从current03/04映射，Method/Hub旧commerce归属不授权财务 |
| 宽泛架构词与正式类型 | 01“notice attempt”语义由03NoticeIntent/明确许可承载，不新增NoticeAttempt |
| P0/P1 | 八项全部P0，未新增功能、不降级98TC |
| VETO与过程门禁 | 触发事实回五VETO，无第六编号；结构缺口仍P0阻断不可risk accept |
| 证据边界 | 多门禁共享EV不增计数；actual编译/扫描/PG/捕获待实施，不伪称已通过 |

## 8. 回填草稿

正式§6采用八GT→AC红线表及固定证据展开，保证数据库/DTO/index/log/report/Web均无owner第二truth，Query/replay零写、依赖裁剪、配置不可绕、有限恢复。八项都是未来运行裁决，不是扫描结果。

## 9. 待确认事项

exact owner/SDK/PG/provider/auth等qualification仍挂起；结构审查不代表已编译/扫描/脱敏。MP-SRC-003标签沿03解释，不修04。

## 10. 进入下一步条件

自检：五SOP问题、八项先思考/独立停审、canonical AC/VETO引用、完整TC-EV/paths及跨边界审计齐备，无authority/幽灵schema。Step6设计pass，下一读SOP Step7/规范5.7、49入口field index/03ports/protocol/flow、八SDKslot和owner资格；无commit。
