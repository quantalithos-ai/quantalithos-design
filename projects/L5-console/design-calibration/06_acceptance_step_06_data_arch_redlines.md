# Step 6. 定义数据边界与架构红线验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6  
> 回填章节：`06-验收标准.md` §6 数据边界与架构红线验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 数据边界与架构红线 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 00 §10～§12/§14.3；01 §8～§10；03 §4/§10/§13～§15；05 ARCH/SEC/CONFIG TC |
| 输出文件 | `design-calibration/06_acceptance_step_06_data_arch_redlines.md` |
| 实际结果 | `not_evaluated` |
| 下一动作 | 只允许进入 Step 7 |

## 2. 本步计划与目标

本步把 Console 所有/只引用/禁止保存的数据边界、SDK-only 依赖方向、架构 absence、配置不可越权和外围防污染转为可检查红线，并明确每条红线与正式 VETO 的关系。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00` BR/DR/AC | truth、forbidden-body、资格、主题与数据归属 |
| `01` §8～§10 | compile/runtime/event 裁剪、owner boundary、一致性与通信红线 |
| `03` §4/§10/§13～§15 | 文件/模块 absence、carrier、binding、diagnostic/audit 边界 |
| `04` | 配置不得改变权限/truth/状态/依赖 |
| `05` | ARCH/VIEW/ADAPTER/STATE/DIAG/SEC/CONFIG 检查与 future EV |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得保存？ | credential/secret/授权证明、raw/hidden body、owner 完整对象/规则/正文、governance/artifact/evidence/audit/report/capability/archive/sandbox 正文，以及可恢复上述正文的材料。 |
| 哪些下游不得反向改写真相？ | 所有 Query、view composition、diagnostic、invalidation、report/evidence tooling、host/a11y side path 均不得写 owner truth；唯一 owner write 是受控 `OwnerCommandPort.submit`。 |
| projection/cache 不得如何反写？ | Console 不得拥有 projection/cursor/rebuild/cache truth；owner-safe snapshot/view model 只可失效、撤除或随新 formal observation 更新，不能补造/修复 owner。 |
| P1 能力如何防污染 P0？ | 未启用 positive facet 必须 disabled/read-only/partial/blocked；fake/selected/peripheral 不得进入 production binding、P0 positive 或 readiness。 |
| 红线失败是否 VETO？ | 与 `VETO-CON-001/002/004/005/007` 对应的失败直接一票否决；其他 P0 架构/配置/evidence integrity failure 至少 S 级并阻断，不另造产品 VETO。 |

## 5. 当前文档问题诊断

| 旧问题 | 处理 |
|---|---|
| 只写“workspace/panel 不反写 source truth” | 扩展为正式 owner 分类、快照/ref/forbidden body 与写边界 |
| 用 DB compare 作红线证据 | Console 不访问 DB，改用 dependency/file/export/call graph、Port ledger 和 redaction evidence |
| Provider Contract/RBAC/前端 store 暗示本地 authority | 全部删除；资格只来自 formal owner |
| 无 Event/Job/后台 absence 检查 | 加入 5+16+1、0 Event/Job 和 forbidden unit 静态门禁 |
| 配置可暗中启用能力 | strict whole-document 与 contract-dependent activation 红线 |

## 6. 改动前后对比

| 项 | 旧 | 新 |
|---|---|---|
| 数据边界 | workspace/domain 二分 | Console truth / owner snapshot / safe ref / forbidden body 四类 |
| 依赖检查 | source compare/DB | SDK package/Port + static dependency/call graph |
| 持久化 | 泛化 saved layout/store | 唯一 session-volatile exact-scope carrier；无 DB/repository |
| 写边界 | quick action dispatch | 16 Query write=0；唯一 owner write=`OwnerCommandPort.submit` |
| P1/P2 | 未约束 | enabled manifest + profile isolation + no fake positive |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否要求 DB snapshot 证明无越界 | 否；本仓禁止 DB，静态依赖与 call ledger 更符合边界 |
| client state 是否可作为 owner cache | 否；只承载 Console interaction truth/safe scoped shadow |
| owner-safe snapshot 是否归 Console | 否；是可失效影子，不改变正式 owner |
| configuration 能否授予资格/active | 否；仅请求装配，formal facets 仍需验证 |
| evidence/report 是否可含 owner body | 否；只允许 body-free refs/enums/count/digest/safe reasons |

## 8. 结构化中间产物

### 8.1 数据分类与保存上限

| 类别 | 允许形态 | 生命周期上限 | 证明重点 |
|---|---|---|---|
| Console interaction truth | session shell、navigation/layout/filter/window、draft、request presentation、recovery/a11y、偏好 | exact scope；当前 session-volatile；语境变化清理/收紧 | state/carrier TC |
| owner-safe snapshot/view | context/qualification、安全摘要、source axes、topic partitions | 随 owner/context/visibility 失效；不可成为第二 truth | VIEW/TOPIC/STATE TC |
| safe reference | object/version/receipt/result/decision/evidence/audit/report/capability/archive/sandbox typed ref | invalid/revoked/not-visible 时撤除/blocked | VIEW/ADAPTER TC |
| forbidden body | credential/secret/raw/hidden/full owner/governance/evidence/audit/report/execution body | 无 Console 生命周期 | SEC/redaction/config TC |

### 8.2 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 | 裁决影响 |
|---|---|---|---|---|---|
| `AR-CON-001` | owner truth 单一 | Console 只拥有 interaction truth；snapshot/ref 明示 owner/source/status | 本地对象/view/cache 被用作正式成员、项目、治理、能力、归档、运行 truth | `TC-VIEW-004`,`TC-TOPIC-004～012`,`TC-SEC-003～005`; FLOW/SECURITY | VETO-001/005/007 候选；不通过 |
| `AR-CON-002` | SDK/正式边界唯一 | compile 仅正式 shared/SDK；runtime 经 SDK/narrow adapter；无 sibling private source | DB/repository/private API/bus/source/BFF 旁路 | `TC-ARCH-001～002`,`TC-ADAPTER-001～004`; ARCH/CONTRACT | VETO-001；不通过 |
| `AR-CON-003` | 禁止正文进入生命周期 | 对 forbidden material whole reject、no echo、state/diagnostic/artifact/report 零正文 | 任一 secret/raw/hidden/owner body 被存储、显示、日志/诊断/报告携带 | `TC-VIEW-003`,`TC-ADAPTER-002～003`,`TC-DIAG-002`,`TC-SEC-002`,`TC-CONFIG-003`; SECURITY/RELEASE | VETO-004；不通过 |
| `AR-CON-004` | Query/side-path 零业务写 | 16 Query owner/carrier write=0；diagnostic/consumer/host/a11y 不改业务 | Query、invalidation、diagnostic、report 或 page path 写 owner/local formal-derived state | `TC-VIEW-009`,`TC-ADAPTER-005～006`,`TC-DIAG-003～004`,`TC-ARCH-004`; FLOW/ARCH | VETO-001/005；不通过 |
| `AR-CON-005` | 协议/实现单元 absence | 恰好十模块、5 Command、16 Query、1 conditional consumer、0 Event、0 Job；无 service-side units | 额外业务 protocol/write、DB/repo/UoW/outbox/projection/BFF/worker/job/admin server | `TC-ARCH-001～004`; ARCH/RELEASE | VETO-001 或 S；不通过 |
| `AR-CON-006` | 客户端 carrier 有界 | exact-scope、whole-record、single-writer、session-volatile；malformed whole reject | scope migration、partial salvage、durability/current/confirmed 推导、跨 tab CAS 假设 | `TC-STATE-001～008`,`TC-CONSISTENCY-001/006`; UNIT/CONTRACT/INTEGRATION | P0/S；不通过 |
| `AR-CON-007` | 权限/Policy/Gate 不可本地复制 | context/visibility/qualification formal-derived，本地只收紧；配置/route/role/flag 不授权 | local rule/RBAC/control copy、绕 Gate、撤销后沿用 allow | `TC-CTX-003`,`TC-NAV-004`,`TC-SEC-001/004`,`TC-CONFIG-005～007`; SECURITY | VETO-002/005；不通过 |
| `AR-CON-008` | 配置不可改变设计真相 | 恰好四项、三 profile、strict/startup-only；flag/binding 不证明 active/ready | secret/endpoint/authority key、silent fallback、partial runtime、fake 跨 profile、hot patch | `TC-CONFIG-001～011`; UNIT/SECURITY/RELEASE | S；相关 VETO-002/004/005；不通过 |
| `AR-CON-009` | 跨 owner 不伪装原子/统一结论 | partition 独立、canonical、状态轴保真；局部 failure 明示 | 一源失败扩散/被掩盖，或合成 health/compliance/readiness | `TC-TOPIC-001～003`,`TC-CONSISTENCY-003/008`,`TC-SEC-005`; INTEGRATION/SECURITY | VETO-005/007；不通过 |
| `AR-CON-010` | P1/P2/外围不污染 P0 | 未启用保持 disabled/blocked；fake/test binding 只在允许 profile；selected 不生成 P0 positive | 无合同启用、blocked 记 pass、fake 进入 production、外围成为主链前置 | `TC-INTENT-005～006`,`TC-ADAPTER-004～006`,`TC-CONFIG-005～009`; CONTRACT/INTEGRATION | P0/S；可能 VETO-005 |
| `AR-CON-011` | client diagnostic ≠ audit/evidence | body-free whitelist；sink failure 隔离；receipt/emitted 不作 audit/evidence | diagnostic 生成 owner history、proof、signoff/readiness 或影响业务 | `TC-DIAG-001～004`,`TC-SEC-003`; UNIT/SECURITY | VETO-004/005；不通过 |
| `AR-CON-012` | 证据边界不反向改 truth | report/evidence 只读取真实 raw outcome，保持 failed/blocked，禁止静态修补 | 手写 pass、改 raw outcome、缺 pair/digest、报告触发业务写 | report-pairing/no-static-evidence/release audit | S/送验无效；不另造 VETO |

### 8.3 不得进入 Console 的正文清单

- credential、token、cookie、password、private key、DSN 或授权证明。
- identity/role/scope 定义、Policy/Gate 内部规则、资格证明或受限对象存在性正文。
- member/project/work/process/workspace/method 的 raw/hidden/full objects。
- Governance/SoA/AIIA/Control/Gate 内部裁决正文和 Artifact evidence/lineage/report body。
- Observability audit/metric/report body、Capability registration body、Archive package、Sandbox execution body。
- HTTP/SDK private error/status/body/stack、任意 free text、URL、完整 opaque ref，以及由其派生的诊断/导出/报告正文。

### 8.4 P1/P2 防污染规则

| 场景 | P0 合法姿态 | 污染判定 |
|---|---|---|
| owner exact surface 缺失 | blocked/read-only/partial + no call | fixture 猜 DTO 或写 positive pass |
| invalidation contract 缺失 | false/disabled/zero-write | true 后私有 bus/cursor/replay |
| production diagnostic 缺失 | disabled 或 approved fake-only | fake sink/emit receipt 当 production audit |
| browser/AT authority 缺失 | semantic P0；matrix residual | 宣称具体兼容 verdict |
| quantitative authority 缺失 | structural sample only | 旧 P95/SLA 作为 gate |
| L5/L6 未停审 | link disabled/pending | 私有 deep-link/state 成为主链 |

### 8.5 跨红线审计

| 审计项 | 结论 |
|---|---|
| Console-owned 数据是否限于交互 truth | pass |
| snapshot/ref 是否保留 owner 与失效语义 | pass |
| forbidden body 是否覆盖所有生命周期 | pass |
| 编译/运行/事件依赖是否正确 | pass |
| 16 Query/no side-path write 是否可检查 | pass |
| 0 Event/Job 与 forbidden units 是否明确 | pass |
| 配置/P1/P2 是否可能放宽红线 | no |
| 红线与七项 VETO 是否冲突或重复造号 | no；AR 是门禁，VETO 仍只用正式七项 |

## 9. 回填草稿

正式 §6 应使用 `AR-CON-001～012` 门禁表，强调 Console truth、owner snapshot/ref、forbidden body 四类边界，SDK-only、5+16+1/0/0、唯一 owner write、session-volatile carrier、配置/diagnostic/evidence 红线。AR 失败按表触发正式 VETO 或 S；不得以 DB snapshot 作为本仓验收证据。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| exact safe-field/ref contracts | `CON-Q-034～043`，blocked/conditional |
| carrier medium/durability | `CON-Q-044`，当前 session-volatile |
| production diagnostic/browser/AT/quantitative | `CON-Q-045～046`，selected residual |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 数据所有/快照/ref/forbidden 四类闭合 | pass |
| 架构红线可静态/动态检查 | pass |
| VETO 与 S 边界清楚 | pass |
| P1/P2 防污染规则明确 | pass |
| 允许进入 Step 7 | yes |
| 允许修改正式 06 | no |
