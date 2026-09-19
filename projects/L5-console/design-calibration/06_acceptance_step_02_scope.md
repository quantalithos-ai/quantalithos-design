# Step 2. 明确验收目标与范围

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2  
> 回填章节：`06-验收标准.md` §2 验收目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 1；正式 00 §2/§7/§14/§15；正式 03 §5～§15；正式 04；正式 05 §2/§5/§14 |
| 输出文件 | `design-calibration/06_acceptance_step_02_scope.md` |
| 正式正文权限 | 关闭 |
| 下一动作 | 只允许进入 Step 3 |

## 2. 本步计划与目标

本步依次固定核心裁决目标、P0/P1/P2、facet 启用规则、下游只验接缝范围、非范围和 VETO 候选边界。重点避免两种错误：把未闭口 positive integration 当当前 P0 已具备，或把安全 disabled/blocked 误写成产品功能成功。

## 3. 本步输入

| 输入 | 提供内容 |
|---|---|
| Step 1 | 正式输入、历史隔离、当前 `not_entered` 事实 |
| `00` §2/§7/§14 | Console ownership、C1～C6、45 个 AC 与七项 VETO |
| `03` §5～§15 | 十模块、5+16+1、状态/一致性/错误/a11y/diagnostic 正式名 |
| `04` | 三 profile、四配置、当前 disabled/pending positive posture |
| `05` §2/§5/§14 | P0 safety、conditional positive、selected slice、TC/EV 和 residual |
| 全局依赖规则 §2/§4.1 | compile/runtime/event 类型与 Layer 5 并行真相限制 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心裁决目标是什么？ | 裁决 Console 是否只作为组织治理与管理客户端，可信地消费 owner truth、控制意图边界、局部降级并保持可访问，而不产生第二 truth、授权、verdict 或 readiness。 |
| P0/P1/P2 如何划分？ | P0 是当前声明范围内的 deterministic safety/negative/semantic/static/evidence integrity；P1 是 baseline 明确启用且合同已闭合的 formal/selected positive；P2 是量化、生产诊断、具体 browser/AT、durability、外围和相邻产品深链。 |
| 哪些下游只验接缝？ | identity、member-service、work、process、workspace、method-library、governance、artifact、observability、capability-hub、archive、sandbox 均只验 SDK/narrow Port、安全映射、分区和 failure posture，不验内部 truth/DB/规则。 |
| 哪些非范围影响最终结论？ | 未声明 enabled 的 conditional facet 不影响核心 P0 通过，但必须诚实 disabled/read-only/partial/blocked；一旦 baseline 声明 enabled，缺 positive evidence 会阻断对应范围和总体结论。 |
| 哪些可能成为 VETO？ | 私有旁路/第二 truth、非 current context 披露、伪完成/重放、forbidden body、UI 推导 verdict/readiness、核心 a11y 不等价、owner 故障扩散/掩盖，恰好对应七项正式 VETO。 |
| 哪些必须使用正式名？ | 十模块、5 Command、16 Query、`ConsumeSdkInvalidationHint`、正式状态 variants、四项 config、三个 profile、96 TC、八 EV family。 |

## 5. 当前文档问题诊断

| 旧问题 | 处理 |
|---|---|
| 将 workspace/panel/quick action 当验收主范围 | 删除，以 C1～C6 与正式协议重建 |
| 无 P0 safety 与 conditional positive 分界 | 引入 baseline-declared facet 规则 |
| “非范围”未说明对 verdict 的影响 | 逐类给出 residual、blocked 或 design-change-required |
| 把真实 owner E2E 当 Console 全范围 | 只验公开接缝，不验 owner 内部实现 |
| 旧 fixed controls/metrics/threshold | 无 authority，不进入当前门禁 |

## 6. 改动前后对比

| 项 | 旧 | 新 | 原因 |
|---|---|---|---|
| 裁决对象 | 工作台对象和页面动作 | 可信上下文、owner-safe view、controlled intent、八主题、恢复/a11y | 对齐需求与详细设计 |
| P0 | 泛化全部功能 | safety/negative/semantic/static/evidence integrity | 当前可诚实设计和未来执行 |
| positive integration | 默认要求或默认通过 | facet enabled 后才 required；否则 blocked/conditional | 保持 blocker 真值 |
| owner 范围 | 可能穿透服务内部 | 只验 SDK/Port boundary | 保持所有权 |
| production | profile/阈值暗示 ready | 明确非当前结论 | 无 baseline/authority |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| P0 是否要求真实 DB/owner service | 否；P0 不依赖私有实现，使用合格 deterministic/contract-derived 证据 |
| fake safety 能否证明正式集成 | 否；只证明客户端契约与安全上限 |
| disabled facet 能否计为 positive pass | 否；只能证明 disabled 边界正确 |
| disabled facet 是否必然导致总体不通过 | 否；若 baseline 未声明 enabled 且需求允许 read-only/partial/blocked，可满足当前边界 |
| baseline 声明 enabled 后仍缺 positive | 失败/阻断；不得用 negative/fake evidence 替代 |
| selected browser/AT、量化与生产诊断 | 未被正式 release baseline 选中时为 residual；选中后必须有 authority 与证据 |

## 8. 结构化中间产物

### 8.1 验收目标

| 目标 | 正式来源 | 裁决口径 |
|---|---|---|
| `AGO-CON-01` 可信语境与权限收紧 | C1/C2；`AC-CON-001～002` | current formal context/visibility/qualification；本地只能收紧 |
| `AGO-CON-02` owner-safe 只读消费 | C3；`AC-CON-003` | 16 Query no-write，来源/五轴/空值语义保真 |
| `AGO-CON-03` controlled intent | C4；`AC-CON-004` | phase 分层、唯一 owner write、unknown no replay |
| `AGO-CON-04` 八管理主题安全组织 | C5；`AC-CON-005` | owner partition、局部降级、无 verdict/readiness |
| `AGO-CON-05` 恢复与 a11y 等价 | C6；`AC-CON-006～007` | typed one-action recovery、三通道同 guard/outcome |
| `AGO-CON-06` 架构/配置/证据真实性 | AC-BR/DR/NFR/VETO；04/05 | SDK-only、四配置、固定 run、无伪证据 |

### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---:|---|---|
| context/session/navigation/access | core client | P0 | fail-closed、旧 scope 清理、route/menu 不授权 | 不签发 identity/scope |
| owner-safe views + 16 Query | read boundary | P0 | safe mapping、五轴、strict empty、zero-write | 不验 owner DB/规则 |
| drafts + 5 Command | intent boundary | P0 safety；positive conditional | local/formal phase、single-flight、no replay | exact submit 受 `CON-Q-034/038` |
| eight management topics | composition | P0 safety；per-owner positive conditional | canonical partitions、partial isolation、诚实 posture | 不验 owner 完整 UI/生命周期 |
| recovery + semantic a11y | resilience | P0 | typed recovery ceiling、同 action/guard/outcome | 具体兼容矩阵 selected |
| adapter/formal seams | runtime boundary | P0 safety；P1 positive | narrow Port parity、typed error、safe mapper | exact formal binding conditional |
| state carrier | client state | P0 session | exact scope、whole record、single writer | durable/cross-session P2 |
| invalidation consumer | optional event seam | P0 disabled；P1 observed | disabled zero-write；enabled 后只单调收紧 | 当前 envelope/order/dedup blocked |
| diagnostics | optional side path | P0 disabled/fake safety | whitelist/redaction/isolation | production sink/envelope P2 |
| config/profile | control plane | P0 | 恰好四项、三 profile、strict/startup-only | profile 不等 readiness |
| architecture/absence | static | P0 | 十模块、5+16+1、0 Event/Job、唯一 owner write | 无 DB/BFF/private bus/worker |
| evidence integrity | adjudication support | P0 | fixed-run pair/digest/no-static-evidence | 不自动签署 |
| quantitative/browser/AT/production | selected | P2/authority-required | 仅 authority 选中后形成门禁 | 当前无阈值/verdict |
| peripheral E01～E03 / L5/L6 links | future | P2 | 合同具备后逐项启用 | 当前不进入主链 |

### 8.3 Conditional positive 规则

| Baseline 声明 | 安全姿态 | Positive evidence | 裁决上限 |
|---|---|---|---|
| facet 未启用 / 合同未闭口 | 必须 disabled/read-only/partial/blocked 且不误导 | 不要求、不允许伪造 | 可满足当前 safety 边界，不证明功能已集成 |
| facet enabled 且 exact contract 已固定 | 安全姿态仍必需 | contract-derived TC/EV instance 必需 | 缺失或失败则对应门禁失败 |
| facet enabled 但 contract/evidence 缺失 | fail-closed / no call | 无合格 positive | 不得进入或不得通过 |
| fake/controlled safety 通过 | 可证明本地不变量 | 不能替代 formal positive | 不产生 integration/production readiness |

### 8.4 下游只验接缝

| Owner 群 | 验收接缝 | 不验收 |
|---|---|---|
| identity/member | context/member safe view、visibility/qualification、ref | credential、RBAC、member lifecycle truth |
| work/process/workspace | 分 owner safe view、coverage/ref | projection/cursor/rebuild、进度/readiness |
| method/artifact/governance | version/status/decision/evidence safe refs | 正文、审批、verdict 生成 |
| observability | audit/metric/report safe refs | 阈值裁决、正式 audit/evidence truth |
| capability/archive/sandbox | owner axes/ref/受控入口 | registration、archive/restore/run truth、readiness |

### 8.5 非范围与结论影响

| 非范围 | 当前影响 |
|---|---|
| owner 内部实现/数据库/规则 | 不影响 Console P0；若 Console 依赖则触发红线 |
| 正向 surface 尚未闭口 | 维持 blocked/conditional；baseline 未启用时不构成失败 |
| 实现仓、CI、真实 run 当前不存在 | 阻断实际进入验收，不阻断 06 合同设计 |
| 量化、具体兼容、production diagnostics | residual；不得给 positive verdict |
| 未停审 L5/L6 link | pending；不进入主线、不作 evidence |

## 9. 回填草稿

正式 §2 应以六个验收目标和范围表定义：当前核心 P0 是安全/负向/语义/静态/证据真实性；formal positive 按 baseline enabled 状态升级；owner 只验接缝；P2 数字、生产和外围能力不冒充当前 readiness。任何 P0 红线失败不可由 pending/selected 状态抵消。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 某次送验究竟启用哪些 owner facet | 决定 positive evidence 必需集合 | Step 3 作为 baseline manifest 必填 |
| browser/AT、量化和 production diagnostic 是否升级 release scope | 决定 selected gate | 未获 authority 前保持 residual |
| 相邻 Layer 5/6 link | 决定 peripheral scope | 双方停审前 pending |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| P0/P1/P2 与 conditional positive 分界可判定 | pass |
| 下游只验接缝且无 owner truth 越界 | pass |
| 七项 VETO 候选与正式需求一致 | pass |
| 非范围对 verdict 的影响明确 | pass |
| 允许进入 Step 3 | yes |
| 允许修改正式 06 | no |
