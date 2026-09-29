# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 正式回填：`05-测试方案.md` §11
> 日期：2026-09-13
> 状态：`completed / defect_and_retest_rules_executable / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 将 102 个 planned TC、五类 VETO、13 suites 与专项风险转成可执行的缺陷分级、升级、复验和关闭证据规则 |
| 输入 | 05 Step 5～10；正式 00 §14.1/15；03 §11～17；04 §11～14 |
| gate_status | `completed / defect_and_retest_rules_executable` |
| gate_reason | S/A/B/R 分级、VETO 不可降级、修复后最小/扩展回归、关闭证据和 blocked-lane 处理均可判定 |
| next_allowed_action | 按连续授权创建并完成 Step 12 |
| source_files | 05 Step 5～10；测试方案书写规范 §5.11；正式 00 §14.1；03 §11～17；04 §11～14 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 缺陷分类与定级 | §3～§6.2 | done | VETO、安全、主链、工具/环境不混同 |
| 升级与风险接受 | §6.3 | done | P0 红线不可接受；owner 明确 |
| 复验矩阵 | §6.4～§6.5 | done | 原 case、同 family、相关 suite/check 可定位 |
| 关闭证据 | §6.6～§6.7 | done | failed/fixed run 配对；无静态关闭 |
| 停审与跨缺陷审计 | §6.8～§10 | done | blocked 不冒 defect/pass，正式事实未生成 |

## 2. 本步输入与缺陷事实边界

| 输入 | 使用 |
|---|---|
| Step 5/6 | F/BR/NFR/VETO 追溯、102 个正式 TC ID 和断言 |
| Step 9 | 13 suites、5 gates、14 planned scripts、raw/report 输出与状态分类 |
| Step 10 | qualitative P0、numeric/real-seam blocked、故障注入和五类 VETO |
| 00 §14.1 | 跨域写、状态越级、缺 basis 成功、fake/ref 冒真相、不可追溯/盲重放五类一票否决 |
| 03/04 | 正式 error、state、UoW、config、redaction、dependency 和 blocker 语义 |

本文只定义未来缺陷记录合同，不创建缺陷、不声称已修复。`blocked` 表示正式前置缺失，不自动等于产品缺陷；`failed` 表示 case 断言未满足；`infrastructure_failed` 表示测试基础设施意外失效；三者不得互相改写以调整通过率。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些属于 S 级阻断？ | 任一 VETO 命中；cross-domain write；false global state；authority fail-open；raw secret/body 泄漏；blind external retry；Query 写入；半提交/duplicate second effect；production fake；SDK/provider/outbound 偷渡；静态/跨 run 造 EV。 |
| 哪些可以风险接受？ | 只有已证明不影响 P0 truth/security/consistency/evidence 的 A，或 P1/P2/future 的 B/R；必须由明确 owning role 记录范围、期限、缓解和再触发条件。S 不允许接受。 |
| 修复后回归哪些用例？ | 原失败 TC + 同 family 正/负/边界代表项 + 直接 suite；触碰 UoW/effect/authority/restore/config/security/report 时追加对应横切 suite/check；S 修复触发全量 P0。 |
| 关闭需要哪些证据？ | 缺陷记录、失败固定 run/raw/report、根因与变更范围、修复固定 run/raw/report、相关 checks、追溯到 TC/EV family；无真实执行时只能保持 open/planned。 |
| 是否需要新增自动化？ | 手工发现 P0、release 才发现、同类复发或 scanner/gate 漏检均必须新增/强化 TC、assertion、fixture 或 check；不能只留回归备注。 |
| blocked real seam 如何登记？ | 记录 prerequisite/blocker ID、受影响 TC/lane 和 closure proof 要求，不创建“失败缺陷”或“风险接受通过”；解阻后首次正式执行失败才按断言定级。 |
| infrastructure failure 如何处理？ | 不算 case pass，也不直接推定产品失败；阻断受影响 gate，修复 harness/environment 后用新 run 复验，并保留原失败材料。 |
| 缺陷能否改变正式状态名/owner？ | 不能。若暴露设计缺口，暂停实现/测试并回写 owning 正式文档及受影响 05 Step 后再复验。 |

## 4. Historical material 诊断与改动前后对比

| 历史口径 | 问题 | 当前处置 |
|---|---|---|
| S/A/B 只给示例，无 VETO 映射 | 可把跨域写或误删降级 | 五类 VETO 全部固定 S |
| hold/purge、cold query 等旧对象定级 | 已非当前对象/协议真相 | 改按当前 26 objects、30/32 surfaces、18 states 和 CUT 定级 |
| A 可口头接受 | 无接受人、期限或证据 | 只允许具名角色、范围、理由、到期和重新触发条件 |
| 修复后只重跑原 case | 横切缺陷易在相邻面复发 | 原 case + family + suite/check；S 全量 P0 |
| 关闭看“已修复”说明 | 无失败/修复证据配对 | 固定 run raw/report 配对；无运行不可关闭 |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 分类 | 严重程度口述 | S/A/B/R + failed/blocked/infra 状态正交 |
| VETO | 测试尾部人工审查 | S 级、不可接受、release 阻断 |
| 复验 | 原 case | 变更影响图驱动的 family/suite/check |
| 自动化 | 可选 | P0 漏检/复发必须补防回归 |
| 关闭 | 文字结论 | failed run→change→fixed run→evidence 链 |

## 5. 缺陷管理设计取舍

1. `R` 表示记录型风险/改进，不等于执行状态 `blocked` 或 residual risk acceptance；避免用“不是 bug”删除 required lane。
2. S 级由影响决定而非触发层决定：unit 中发现的跨域写仍是 S，formal seam 中的环境缺失仍是 blocked 而不是 S。
3. A 级风险接受只能在证据证明未碰 P0 红线时发生；未知影响默认阻断，不先降级。
4. 修复不能删除或改写失败 raw；新固定 run 作为复验证据，报告连接两个 run。
5. 缺陷系统、人员姓名和 SLA 产品未选，本文只定义必需字段和角色，不私造工具或时限数字。

## 6. 结构化中间产物

### 6.1 缺陷分级表

| 级别 | 定义 | L4-archive 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 命中一票否决，破坏 truth/security/authority/consistency/evidence 基础，或可能产生不可逆跨域副作用 | 写 owner DB；Sealed/Succeeded→restored；缺 hold 仍删除；secret/body 泄漏；MayHaveDispatched 盲重派；静态 EV；production fake | 立即停止受影响 gate/release；必须修复、补自动化、全量 P0 复验；不得风险接受 | 是 |
| A | P0 主线/断言失败但已证明未命中 S，或可恢复的完整性、可用性、兼容性、进度/报告错误 | 合法状态边错误、partial item 漏报、safe Query 错误姿态、required suite failure | 默认阻断相关 gate/release；修复并做影响回归；例外接受需正式角色、证据、期限和 06 裁决 | 是；明确接受后才可能条件放行 |
| B | 非 P0、局部可诊断且不影响 truth/security/required evidence 的缺陷 | P1 hardening 组合失败、非关键报告排版但 raw/追溯完整 | 排期修复；运行证据和影响范围可追溯 | 否，除非升级 |
| R | 未达无正式阈值的候选目标、future 能力或设计外风险 | P2 吞吐/RTO 未测、provider 未选、产品 UI 非范围 | 登记 residual/blocker owner、解锁条件和触发点；不得计 passed | 否；required formal lane仍保持 blocked |

### 6.2 S 级 / VETO 判定矩阵

| S 类别 | 触发 | 关联 TC / check | 关闭最低要求 |
|---|---|---|---|
| 跨域写 | 任一 owner DB/业务 command/项目状态/governance truth 被 Archive 直接改写 | `TC-AR-VETO-001`;AUTHORITY-005;dependency | 移除写权 + 原/同族/全量 P0 + source graph evidence |
| 状态越级 | local/axis 状态传播为 archived/restored/global complete | `TC-AR-VETO-002`;STATE-* | 正式状态断言、18 状态族、release VETO 全通过 |
| fail-open | 缺 source/decision/hold/integrity/storage/receiver/schema 仍成功/effect | `TC-AR-VETO-003`;CONFIG/AUTHORITY/EFFECT/RESTORE | negative 全通过，formal required lane仍 blocked或真实通过 |
| 冒充真相 | workspace projection、artifact ref、audit summary、fake 升格 | `TC-AR-VETO-004`;AUTHORITY/DEPENDENCY | 8 source classification + production fake absence + formal limitation |
| 不可追溯/盲重放 | result/history/effect key缺失仍 complete/retry；static/cross-run EV | `TC-AR-VETO-005`;IDEMP/EFFECT/REPORT | relation/probe/pairing/no-static checks + 全量 P0 |
| 泄漏 | raw secret/body/key/digest/location/selector/provider response 进入公开/证据面 | SECURITY-001;redaction check | denylist扩展、canary回归、fixed raw/report clean |
| 依赖/出站偷渡 | SDK/provider sibling compile、ready outbound surface | DEPENDENCY-001/002 | graph/config scan、outbound absence、架构回查 |

### 6.3 升级、降级与风险接受规则

| 情形 | 动作 |
|---|---|
| 任一 S 触发 | 不允许降级；若定级争议，按 S 阻断直到反证完成 |
| A 触及 owner truth、安全、unknown finality、evidence authenticity | 升 S |
| B/R 后续进入 P0 scope 或正式 threshold | 回写 Step 2/5/10/12/14，再按 A/S 重新定级 |
| formal prerequisite 缺失 | 保持 blocked + blocker，不以缺陷/waiver 关闭 requiredness |
| fake 与 durable/formal vector 不一致 | 至少 A；若造成假成功/readiness 则 S |
| risk acceptance | 仅 A/B/R；记录 accepter role、scope、basis evidence、expiry/trigger、mitigation；06 拥有最终裁决 |
| 设计缺口 | 记录 owning document/section，暂停相关实现或测试；回写后重新建立 TC/EV 追溯 |

### 6.4 修复后复验矩阵

| 变更/缺陷面 | 必跑原与同族 | 追加 suite / check | 全量 P0 触发 |
|---|---|---|---|
| contract/DTO/ref/schema | 原 TC + CONTRACT family +受影响 entry | contract-domain、entry-worker；必要时 redaction | public shape、authority、evidence schema改变时是 |
| 26 objects / 18 states | 原 OBJECT/STATE +相邻合法/非法边 | contract-domain、service-flow | 状态传播/不变量/VETO 时是 |
| Command/Query | 原入口正负/duplicate；Query telemetry 两组 | service-flow、consistency；authority/security checks | UoW/no-write/owner boundary 时是 |
| Consumer/Job | 原入口 + envelope/claim/fence/report/duplicate | entry-worker、consistency、report audit | ACK/finality/phase/owner 边界时是 |
| UoW/store/idempotency | UOW/IDEMP/EFFECT + fault/barrier | consistency-replay、resource/report | commit/replay/effect 时是 |
| source/governance/storage/restore adapter | AUTHORITY/EFFECT/RESTORE + related J/E | authority-negative、formal-seam、consistency | fail-open/unknown/cross-domain write 时是 |
| config/runtime builder | CONFIG-001～004 + affected capability | config-boundary、dependency、security | required-set/fake/source priority时是 |
| telemetry/redaction | SECURITY/OBSERVE + representative entry failure | security-observe、redaction/report checks | leak/non-interference时是 |
| evidence/report scripts | REPORT-001/002 + failed/blocked samples | report-audit、no-static/link/blocked-lane | EV schema/pairing/status聚合时是 |
| dependency/outbound | DEPENDENCY-001/002 + VETO | dependency check、release | sibling compile/ready outbound时是 |

### 6.5 自动化防回归新增规则

| 触发 | 必须补充 |
|---|---|
| 手工或评审首次发现 P0 缺陷 | 新正式 TC 或现有 TC 下的独立 assertion/vector；不得只留 issue 文本 |
| release/formal 层发现而低层未发现 | 把可局部判定的断言下沉至 contract/domain/service/controlled suite |
| duplicate/commit-unknown/partial 缺陷复发 | deterministic fault/barrier/probe vector |
| source/owner/receiver 分类漏检 | owner-versioned vector 或 negative mismatch/Auxiliary corpus |
| redaction 泄漏漏检 | 扩展 synthetic canary class、扫描路径和否定断言；禁止保存原泄漏值 |
| dependency/outbound 漏检 | 扩展 source-derived graph/config/surface check |
| static/cross-run evidence 漏检 | 扩展 no-static、link、schema/digest 和 blocked-lane checks |
| formal seam 缺口关闭 | 添加正式 conformance vector 及 negative parity；不删除原 blocked 历史 |

### 6.6 缺陷记录与关闭证据合同

| 字段/材料 | S | A | B/R |
|---|---:|---:|---:|
| stable defect ref、发现时间、发现 gate/suite/TC | 必需 | 必需 | 必需（若执行发现） |
| severity 与 VETO/blocker/requirement/design refs | 必需 | 必需 | 必需 |
| safe symptom、actual/expected、影响分母/owner/phase | 必需 | 必需 | 必需 |
| failed fixed `run_id` + raw/report refs | 必需 | 必需 | 有运行则必需 |
| root cause、changed files/symbols、回写文档 refs | 必需 | 必需 | 按影响 |
| retest scope（原 TC/family/suite/check） | 必需 | 必需 | 按影响 |
| fixed fixed `run_id` + raw/report refs | 必需 | 必需 | 关闭执行缺陷时必需 |
| new regression assertion/vector | 必需 | P0 必需 | 复发风险时必需 |
| risk acceptance role/basis/expiry | 禁止 | 条件必需 | 条件必需 |
| closure state | 只可 `open/fixed_pending_retest/closed_after_retest` | 同左或 `accepted_with_conditions` | `planned/accepted/closed` |

所有路径必须绑定固定 run；失败 raw 不得覆盖。当前没有真实 run，故本文没有 closed defect、risk acceptance 或修复事实。

### 6.7 缺陷处理流

```text
[failed assertion / review finding / blocked prerequisite]
                    |
                    v
       [classify execution state first]
       failed | infrastructure_failed | blocked
          |             |                 |
          v             v                 v
    [S/A/B defect] [repair harness] [retain blocker]
          |             |                 |
          +------> [fixed change + impact scope]
                           |
                           v
             [original TC + family + suite/check]
                           |
             failed ------+------ passed with fixed raw/report
                                          |
                                          v
                              [review closure / future 06]
```

关键说明：blocked prerequisite 不进入缺陷通过率；infrastructure failure 不能被当预期负向；复验只由新 fixed run 关闭，报告或人工评论不能改写 raw status。

### 6.8 缺陷停审与跨复验审计

| 审计项 | 结论 | 缺口 / 上限 |
|---|---|---|
| S/A/B/R 可判定 | 通过 | 未绑定缺陷工具或时限数字 |
| 五类 VETO 降级 | 禁止 | 全部 S 且不可接受 |
| blocked/failed/infra 混淆 | 无 | 三类先分流 |
| 102 TC 复验入口 | 通过 | family/suite/check 映射完整 |
| formal positive | 保留 | blocker 不能用 waiver/fake 关闭 |
| failed/fixed evidence | 通过设计 | 当前无真实实例 |
| 自动化漏检 | 有补强规则 | 不允许只手工复验 P0 |
| 设计回写 | 明确 | 新字段/state/flow/config 先回 owning document |
| 当前缺陷事实 | 0 | 不声明 open/closed 数量或 readiness |

## 7. 复杂度判断

S/A/B/R 与执行状态正交，可覆盖本地失败、formal blocked、基础设施故障和 future risk，而不依赖具体缺陷平台。复验按 10 类变更面映射现有 13 suites，避免为每个 TC 重复一套管理流程。

## 8. 回填草稿

正式 §11 应保留分级表、S/VETO 判定、升级/接受、复验矩阵、防回归规则、关闭证据和处理流。必须强调：S 不得风险接受；blocked real seam 不是 pass 或可删除缺陷；修复必须以新 fixed run 的 raw/report 与原失败 run 配对，当前没有任何缺陷关闭事实。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；缺陷规则未新增 product error/state/config/schema |
| 新 blocker | 无 |
| 持续 blocker/pending | 全部 12 upstream + 6 local 保留；formal prerequisite 仍按 blocker 管理 |
| 待 06 收口 | risk accepter 的最终角色/授权、conditional acceptance、verdict 和 signoff |
| 待 07 承接 | 缺陷/复验脚本与 suite 实施 boundary；当前不创建 |

## 10. 进入 Step 12 门禁

- [x] S/A/B/R、执行状态和 VETO 判定可执行。
- [x] S 级不可降级或风险接受，formal blocker 不被伪装成缺陷关闭。
- [x] 每类修复都有原 TC、同 family、suite/check 和全量触发规则。
- [x] 关闭证据必须使用 failed/fixed fixed run raw/report，不接受文字或静态表。
- [x] 防回归新增和设计回写条件明确。
- [x] 允许进入 Step 12。
