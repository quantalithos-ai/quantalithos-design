# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5  
> 回填章节：`05-测试方案.md` §5

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / design_coverage_only |
| 输入 | Step2~4；FR-WS-001~010；BR-WS-001~012；03/04 正式契约 |
| 输出 | FR、BR、CUT 双向覆盖；候选 TC/EV 注册表；覆盖审计 |
| 事实边界 | “covered”仅指设计映射闭合，不表示用例已实现/执行/通过 |

## 2. 本步目标与输入

建立需求/规则→设计→CUT→TC 候选→EV 候选的正向链，以及 CUT→需求/规则/设计的反向链。Step6 才展开可执行用例，Step13 才固定证据结构；本步候选编号只用于防止后续冲突。

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §9/§10/§13~§16 | 10 FR、12 BR、六 NFR 类和否决条件 |
| `03-详细设计.md` §6~§15 | 对象、14 入口、状态、事务、错误、并发、配置、观测 |
| Step3 | 15 个稳定 CUT ID 与 blocked 边界 |
| Step4 | 每个 CUT 的首要发现层与 suite |
| `04-配置设计.md` §7~§14 | 配置、secret、失效和 pending baseline |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 需求有哪些设计依据？ | FR 表逐项回指 03 对象/入口/flow/state；BR 表逐项回指 00/03/04 边界与横切合同。 |
| 每个 P0 需求是否有场景和用例候选？ | 是；10 FR 与 12 BR 均至少映射一个 `TC-WS-*`，具体前置/操作/断言在 Step6 展开。 |
| 哪些必须自动化？ | P0 local contract/domain/service/entry/config/redaction/dependency 均是自动化候选；正式外部 seam 仍要求自动化或受控 integration，但当前 blocked。 |
| 证据如何编号？ | 每个 TC 候选一对一预留同序 `EV-WS-*`；这里只是证据槽位，不代表 artifact/report/evidence 已存在。 |
| 暂未可执行项有哪些？ | owner scope/query/visibility/attention/event/replay、durable driver、secret/transport、下游合同和量化 baseline；设计覆盖但执行 blocked/pending。 |
| CUT 是否都有需求或规则来源？ | 是；见 §7.5，技术 CUT 至少映射 BR/NFR 和具体 03/04 契约。 |
| 有无 P0 覆盖空洞？ | 未发现设计映射空洞；真实 seam 不是覆盖成功，均显式标 blocked。 |

## 4. 当前材料问题诊断

| 首稿问题 | 风险 | 修正 |
|---|---|---|
| FR 分组而非逐项 | FR-WS-005/006 等无法单独反查 | 10 FR 逐行映射 |
| BR 只写“映射到 no-write”等 | 12 条规则可能静默遗漏 | 12 BR 逐行映射 |
| 无 TC/EV 唯一编号 | Step6/9/13 易产生冲突 | 建立 59 个候选 TC/EV 注册表 |
| “覆盖”含义未限定 | 容易被误读为测试结果 | 使用 design-covered/planned/blocked |
| CUT 无反向矩阵 | 孤儿技术测试不可见 | 增加 15 CUT 反查 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| FR | 6 组 | 10 项逐一覆盖 |
| BR | 一句概括 | 12 项逐一覆盖 |
| CUT | 无反向追溯 | 15 项均回链需求/规则/设计 |
| 编号 | 无 | 59 个 TC 与 59 个 EV 候选一对一 |
| 状态 | “覆盖”模糊 | planned/blocked/pending 与执行事实分离 |

## 6. 测试设计取舍

1. TC ID 按风险族编号，而非按 FR 编号；同一精确用例可支撑多个 FR/BR，避免重复执行。
2. EV ID 与 TC ID 一对一同后缀，便于 Step13 生成 evidence index；它不是静态文档证据，也不是验收编号。
3. Step5 只给场景摘要，不提前挤压 Step6 的前置、操作、预期、断言、自动化候选。
4. 外部正向用例仍注册，因为它们是 P0 证明链的一部分；状态写 `blocked`，不得从矩阵删除或以 fake 替代。
5. 06 尚未创建，因此“验收引用”只能记 `pending_06`，不能发明 AC 编号。

## 7. 结构化中间产物

### 7.1 FR-WS-001~010 正向覆盖矩阵

| FR | 设计依据 | 场景/切口 | TC 候选 | 自动化 | EV 候选 | 设计覆盖状态 |
|---|---|---|---|---|---|---|
| FR-WS-001 scope 解析 | 03 §6/§7/§8；ScopeService | typed Personal/Project resolve；actor/scope mismatch；缺正式 resolver | TC-WS-SCOPE-001~003 | 是 | EV-WS-SCOPE-001~003 | planned + positive blocked WS-UP-005 |
| FR-WS-002 visibility 裁剪 | 03 §8/§11；VisibilityBinding | current allow、missing/conflict/revoked、hidden metadata | TC-WS-VIS-001~003 | 是 | EV-WS-VIS-001~003 | planned + positive blocked WS-UP-003 |
| FR-WS-003 no-write 查询聚合 | 03 §7.2/§8；六 Query | materialized/transient、partial/stale/blocked、seven-write spy | TC-WS-QRY-001~006 | 是 | EV-WS-QRY-001~006 | planned + owner positive blocked |
| FR-WS-004 projection 维护 | 03 §8/§10~§12 | applicable/late/duplicate/gap/conflict/unknown、原子 apply | TC-WS-SRC-001~006；TC-WS-TXN-001 | 是 | 同序 EV | planned + event positive blocked |
| FR-WS-005 Personal read model | GetWorkspaceView/ListInbox；scope/visibility | Personal materialized/transient、安全退化、分页绑定 | TC-WS-QRY-001/002；TC-WS-PAGE-001/002 | 是 | 同序 EV | planned + WS-UP-001/003/005 blocked |
| FR-WS-006 Project read model | 同上；Project scope | Project safe refs、稳定 scope、撤权、覆盖姿态 | TC-WS-SCOPE-001；TC-WS-VIS-001/002；TC-WS-QRY-001 | 是 | 同序 EV | planned + blocked seams |
| FR-WS-007 InboxItem 投影 | InboxItem/InboxProjector；Step10 B | 明示 attention、Withdrawn/reopen、重复不增 unread | TC-WS-INBOX-001~003 | 是 | EV-WS-INBOX-001~003 | local negative planned + positive blocked WS-UP-004 |
| FR-WS-008 local state | ChangeLocal/ListInbox/GetLocal | initialize/CAS/stream 分离/override/零隐式写 | TC-WS-LOCAL-001~004；TC-WS-QRY-003 | 是 | 同序 EV | planned + relation positive blocked |
| FR-WS-009 refresh/rebuild | 四 Operation；Step10 C~E | request、逐 phase advance、cutover、supersede、invalidate、terminal | TC-WS-REC-001~006 | 是 | EV-WS-REC-001~006 | local planned + baseline positive blocked |
| FR-WS-010 read/export | 六 Query；Export flow | schema v1、provenance/status、token kind、无 archive/outbound | TC-WS-QRY-006；TC-WS-PAGE-001；TC-WS-BOUND-001 | 是 | 同序 EV | planned + downstream contract blocked |

### 7.2 BR-WS-001~012 规则覆盖矩阵

| BR | 设计依据 | 场景/切口 | TC 候选 | 自动化 | EV 候选 | 设计覆盖状态 |
|---|---|---|---|---|---|---|
| BR-WS-001 read-model owner | 03 §5/§10 | store/protocol 无 owner truth/body；只存 ref/snapshot | TC-WS-BOUND-001/002 | 是 | EV-WS-BOUND-001/002 | planned |
| BR-WS-002 source Query no-write | SourceReadService；Query flows | owner read 与六 Query 无 local/source mutation | TC-WS-QRY-001~006 | 是 | 同序 EV | planned；real owner query blocked |
| BR-WS-003 owner 决定/fail-closed | VisibilityBinding；错误映射 | missing/conflict/revoked 不展示且不泄漏元信息 | TC-WS-VIS-001~003 | 是 | 同序 EV | negative planned；positive blocked |
| BR-WS-004 cursor 分离 | Step6/8/10/14 | source/view/read/operation/page 轴不互换 | TC-WS-CONTRACT-002；TC-WS-PAGE-001/002 | 是 | 同序 EV | planned |
| BR-WS-005 duplicate 幂等 | terminal/operation records | same key/digest 精确原值；不重复投影/unread/version | TC-WS-IDEM-001~003 | 是 | EV-WS-IDEM-001~003 | planned |
| BR-WS-006 乱序不猜补 | SourceRelation/Coverage | late、gap、不可比较、bridge 缺失 | TC-WS-SRC-002/004/005 | 是 | 同序 EV | local classification planned；proof blocked |
| BR-WS-007 显式失效/重建/cutover | recovery state/records | generation/attempt/invalidation 可追溯、cutover fence | TC-WS-REC-001~006 | 是 | 同序 EV | planned + positive blocked |
| BR-WS-008 local principal/scope | LocalAttentionState | cross principal/scope 拒绝；local CAS | TC-WS-LOCAL-001/002/004 | 是 | 同序 EV | planned |
| BR-WS-009 Inbox 只来自明示输入 | InboxProjector | 文本推测拒绝；formal attention 才 derive/reopen | TC-WS-INBOX-001~003 | 是 | 同序 EV | negative planned；positive blocked |
| BR-WS-010 降级可区分 | read posture/错误 | stale/partial/blocked/unavailable/unknown 正交 | TC-WS-QRY-005；TC-WS-STATE-003 | 是 | 同序 EV | planned |
| BR-WS-011 禁止反写上游 | port/module/flow | Query/projection/maintenance/export 无 owner write/outbound/archive | TC-WS-BOUND-001~003 | 是 | EV-WS-BOUND-001~003 | planned |
| BR-WS-012 依赖分类 | 00 §6；03 §5/§13 | 非 core sibling 无 compile；fake 无 production fallback/readiness | TC-WS-DEP-001/002 | 是/脚本候选 | EV-WS-DEP-001/002 | planned；L0-core slot pending |

### 7.3 NFR 与一票否决覆盖

| 方向 | 设计依据 | TC 候选 | 执行状态 |
|---|---|---|---|
| 正确性/可追溯 | provenance/coverage/revision/records | TC-WS-STATE-001~003；TC-WS-QRY-001/005 | planned |
| 一致性/幂等 | txn/idempotency/unknown/cutover | TC-WS-TXN-001~003；TC-WS-IDEM-001~003；TC-WS-REC-003 | planned；durable proof blocked |
| 可用性/退化 | read/error/adapter posture | TC-WS-QRY-005；TC-WS-CONFIG-003 | planned |
| 安全/数据最小化 | current visibility/redaction/cursor | TC-WS-VIS-001~003；TC-WS-SEC-001~003；TC-WS-PAGE-002 | planned + owner positive blocked |
| 可演进/依赖边界 | typed adapters/config schema | TC-WS-CONTRACT-001/002；TC-WS-DEP-001/002 | planned |
| 资源有界 | 04 limits | TC-WS-RES-001~003 | planned；量化 baseline pending |

一票否决全部由以下候选族承接：`TC-WS-BOUND-*`（truth/反写/archive）、`TC-WS-VIS-*`（fail-closed）、`TC-WS-QRY-*`（no-write/stale）、`TC-WS-SRC-*`（gap/duplicate/unknown）、`TC-WS-REC-*`（generation/cutover）、`TC-WS-DEP-*`（fake/依赖）、`TC-WS-SEC-*`（正文/secret）。

### 7.4 候选 TC / EV 注册表

每个候选 EV 只表示未来一次可归档测试结果的槽位。`planned` 不等于已产生证据；`blocked` 不得生成假 artifact 填槽。

| 候选族 | TC 范围 | EV 范围 | 数量 | 主验证面 | 当前执行状态 |
|---|---|---|---:|---|---|
| contract | TC-WS-CONTRACT-001~003 | EV-WS-CONTRACT-001~003 | 3 | DTO/digest/type/version | planned |
| scope | TC-WS-SCOPE-001~003 | EV-WS-SCOPE-001~003 | 3 | scope resolution | negative planned / positive blocked |
| visibility | TC-WS-VIS-001~003 | EV-WS-VIS-001~003 | 3 | current decision/fail-closed | negative planned / positive blocked |
| query | TC-WS-QRY-001~006 | EV-WS-QRY-001~006 | 6 | six Query 独立主例 | planned / external positive blocked |
| source | TC-WS-SRC-001~006 | EV-WS-SRC-001~006 | 6 | source change/invalidation classification | planned / exact event blocked |
| inbox | TC-WS-INBOX-001~003 | EV-WS-INBOX-001~003 | 3 | attention lifecycle | negative planned / positive blocked |
| local | TC-WS-LOCAL-001~004 | EV-WS-LOCAL-001~004 | 4 | local state/CAS/read cursor | planned |
| recovery | TC-WS-REC-001~006 | EV-WS-REC-001~006 | 6 | four Operations + phase/cutover | planned / baseline blocked |
| state | TC-WS-STATE-001~003 | EV-WS-STATE-001~003 | 3 | all state families/illegal transitions | planned |
| transaction | TC-WS-TXN-001~003 | EV-WS-TXN-001~003 | 3 | atomicity/fanout/unknown | controlled planned / durable blocked |
| idempotency | TC-WS-IDEM-001~003 | EV-WS-IDEM-001~003 | 3 | same/different digest/replay | planned |
| page/cursor | TC-WS-PAGE-001~002 | EV-WS-PAGE-001~002 | 2 | binding axes/tamper/no-write | planned / crypto binding blocked |
| config | TC-WS-CONFIG-001~003 | EV-WS-CONFIG-001~003 | 3 | schema/profile/binding failure | planned |
| security | TC-WS-SEC-001~003 | EV-WS-SEC-001~003 | 3 | redaction/sink/metadata non-leak | planned |
| dependency | TC-WS-DEP-001~002 | EV-WS-DEP-001~002 | 2 | dependency/fake boundary | planned |
| resource | TC-WS-RES-001~003 | EV-WS-RES-001~003 | 3 | limit/relationship/no truncation | planned |
| boundary | TC-WS-BOUND-001~003 | EV-WS-BOUND-001~003 | 3 | no owner write/outbound/archive truth | planned |

总计 17 个候选族、59 个 TC 候选和 59 个一对一 EV 候选。Step6 不得另造重复 ID；如需拆分，只能在本注册表增补并重新审计唯一性。

### 7.5 CUT 反向追溯矩阵

| CUT | 需求/规则 | 设计契约 | TC 候选 | 状态 |
|---|---|---|---|---|
| CUT-CONTRACT | FR-001/003/010；BR-004/012 | 03 §7；Step6-A/8 | CONTRACT-001~003 | planned |
| CUT-OBJECT | FR-004/007~009；BR-001/008/009 | 16 对象；Step6-B | STATE-001~003 + 对应入口族 | planned / external constructors blocked |
| CUT-STATE | FR-004/007~009；BR-004~010 | Step10 全状态矩阵 | STATE-001~003 | planned |
| CUT-SCOPE-VIS | FR-001/002/005/006；BR-003 | Scope/Visibility ports | SCOPE-001~003；VIS-001~003 | positive blocked |
| CUT-QUERY | FR-003/005/006/010；BR-002/003/010/011 | 六 Query flows | QRY-001~006 | planned + external blocked |
| CUT-COMMAND | FR-001/008；BR-005/008 | 两 Command flows | SCOPE-001；LOCAL-001~004；IDEM-* | planned |
| CUT-SOURCE | FR-004/007/009；BR-004~007/009 | 两 Consumer flows/receipts | SRC-001~006；INBOX-* | exact event blocked |
| CUT-RECOVERY | FR-009；BR-007/010/011 | 四 Operation/状态/cutover | REC-001~006 | planned + baseline blocked |
| CUT-TRANSACTION | FR-004/008/009；BR-005~008 | Step11 七 commit | TXN-001~003 | controlled planned / durable blocked |
| CUT-IDEMPOTENCY | FR-004/008/009；BR-005 | Step12/13 records/key/digest | IDEM-001~003 | planned |
| CUT-CURSOR | FR-003/005/006/010；BR-004 | WorkspacePageCursor/codec | PAGE-001~002 | planned / real crypto blocked |
| CUT-CONFIG | all affected FR；BR-010/012 | 04 §7~§13 | CONFIG-001~003 | planned |
| CUT-OBSERVE | NFR安全/可追溯；BR-001/011 | 03 §14；04 §8 | SEC-001~003 | planned |
| CUT-DEPENDENCY | BR-001/002/011/012 | 00 §6；03 §5/§13 | DEP-001~002；BOUND-* | planned |
| CUT-RESOURCE | NFR可用性；BR-010 | WorkspaceLimits/04 §7 | RES-001~003 | planned / numeric baseline pending |

### 7.6 覆盖项停审记录

| 覆盖项 | 需求有设计依据 | 设计有 TC 候选 | EV 唯一预留 | 自动化判断 | 结论 |
|---|---|---|---|---|---|
| FR-WS-001~010 | pass | pass | pass | P0 自动化候选；外部正向 blocked | pass_with_external_slots |
| BR-WS-001~012 | pass | pass | pass | P0 自动化候选 | pass_with_external_slots |
| NFR/否决方向 | pass | pass | pass | 数字性能除外 pending | pass_with_pending_baseline |
| CUT-CONTRACT~RESOURCE | pass | pass | pass | 主发现层已定 | pass_with_external_slots |

### 7.7 跨覆盖项审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 孤儿 FR | none；10/10 有设计/CUT/TC/EV |
| 孤儿 BR | none；12/12 有设计/CUT/TC/EV |
| 孤儿 CUT | none；15/15 可反查需求/规则/设计 |
| 重复 TC ID | none；17 族区间互斥，共 59 个 |
| 重复 EV ID | none；与 TC 一对一，共 59 个 |
| P0 自动化缺口 | 无静默缺口；real seam 显式 blocked，量化 baseline pending |
| phase 越界 | none；Export 无 archive、Consumer 无 ACK、Gap 非 terminal、Query 无 refresh |
| 验收引用 | `pending_06`；未创建 AC ID，不伪造验收消费 |

## 8. 对 03/04 的影响判定

追溯可由现有正式对象、协议、状态和配置形成，没有发现必须回写的设计空洞。候选 TC/EV 是 05 测试设计标识，不增加生产 DTO、状态、存储或配置。

## 9. 回填草稿

正式 §5 回填 FR、BR、NFR/否决、CUT 反向矩阵与候选编号事实声明。为保持正文可读，可把注册表完整保留并说明所有 EV 均为 planned slot；不得写“已覆盖/已通过”。

## 10. 待确认事项与进入下一步条件

- 06 的 AC ID、真实 artifact/report/run 与 evidence alias 均不存在，保持 pending。
- WS-UP-001~008、WS-UP-006-S、WS-LOCAL-001~003 未关闭，无新增 blocker。
- FR/BR/CUT 双向设计覆盖无空洞，候选编号唯一；Step5 通过，允许 Step6 逐切口展开用例。
