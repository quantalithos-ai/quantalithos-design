# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 正式回填：`05-测试方案.md` §2
> 日期：2026-09-13
> 状态：`completed / pass_with_required_blocked_positive_lanes / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 固定测试要证明什么、P0/P1/P2、执行状态、非范围和一票否决关联 |
| 输入 | Step 1、正式 00 §4/7/9/10/13/14、03 §15/17、04 §12/14 |
| gate_status | `completed / pass_with_required_blocked_positive_lanes` |
| gate_reason | P0、非范围和 VETO 方向可判定；外部 positive 不删除但保持 blocked |
| next_allowed_action | 创建并完成 Step 3 |
| source_files | `05_test_plan_step_01_input_boundary.md`、正式 00/03/04 |

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 目标抽取 | §3/§6.1 | done | A1～A9 与安全边界均有证明目标 |
| 范围双轴 | §6.2～6.3 | done | priority 与 execution status 不混用 |
| 非范围/风险归属 | §6.4 | done | 相邻仓内部、产品与无基线量化项明确 |
| 一票否决 | §6.5 | done | 每项后续可映射 CUT/TC/EV |
| historical 诊断/取舍 | §4～5 | done | 未继承旧五主线或固定数字 |
| 复杂度/回填/影响 | §7～10 | done | 不补设计，不产生执行事实 |

## 2. 本步输入

| 输入 | 用途 | 约束 |
|---|---|---|
| Step 1 缺口转译 | 决定哪些 P0 正向 lane 为 blocked | blocked 不等 P1/非范围 |
| 正式 00 的 G/F/BR/NFR/VETO | 固定证明目标与业务优先级 | 不新增需求编号 |
| 正式 03 的模块/协议/状态/切口 | 固定当前可验证对象和 phase | 不测试未定义 future surface |
| 正式 04 的 profile/config/failure | 固定配置与装配测试范围 | 不填实际值/provider |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 主链要证明什么？ | 本地请求/作业、逐源 binding/capture、manifest closure、多轴 assessment/placement/lifecycle、只读查询、per-owner restore/handoff、幂等/unknown/reconcile 均按正式契约执行且不越权。 |
| P1/P2 如何处理？ | P1 是正式 provider/owner/SDK 产品级加固或额外兼容组合；P2 是有 workload/baseline 后的量化容量、长稳、RTO/RPO。二者不能替代 P0 红线。 |
| 哪些下游只测接缝？ | 所有 L1 owner、governance、artifact、workspace、observability、Bus、storage/integrity/receiver、SDK/Console/Sync 只测 Archive 侧 typed seam、mapping、失败与依赖分类，不测对方内部实现。 |
| 哪些非范围有残余风险？ | provider/算法/部署/真实凭证、owner 内部状态机、跨区域灾备、产品 UI、SDK cache、通用观测后端、量化 SLO 均有 owner 或 baseline 风险，进入 §14。 |
| 哪些与一票否决相关？ | owner truth 写入、状态越级、缺 authority/integrity 仍成功、Auxiliary/fake 冒充 canonical/real、commit unknown 盲重放、secret/body 泄漏、静态证据冒充通过。 |

## 4. 当前材料问题诊断与前后对比

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧 05 将 snapshot/index/retention/review 五条旧主线全部列 P0 | 与 6 CP/30 入口不一致 | 改按正式能力、协议和风险分层 |
| 旧 05 把 real-like storage/governance fake 当测试依赖 | 可能伪造 authority/commit | fake 只进入 controlled lane；formal positive 仍 blocked |
| 旧 05 将 P95、100% 成功率作为阈值 | 无正式来源 | 删除数值；只验证有界、显式状态和未来 baseline gate |
| 旧 05 未区分 planned/blocked/passed | 设计表可被误读为测试结果 | 建立 priority × execution-status 双轴 |

| 项 | 改动前 | 改动后 |
|---|---|---|
| P0 | 旧对象 happy path | 正式主线、安全、一致性和负向红线；外部 positive 仍 P0 required/blocked |
| P1 | 相邻系统内部 | 正式选型后的接缝组合/兼容加固 |
| P2 | 固定性能数字 | workload authority 后的量化与长稳 |
| 完成 | “自动化=是”易被当通过 | planned/blocked/not_run 均明确不算通过 |

## 5. 测试设计取舍

| 议题 | 采用结论 | 理由 |
|---|---|---|
| 外部 positive 因 blocker 是否从 P0 删除 | 不删除；`P0 + blocked` | 需求风险仍是 P0，缺合同不应降低重要性 |
| 全部对象逐字段是否都列范围 | 26 对象全覆盖，具体字段按风险/协议/状态在 Step 3/6 展开 | 保持分母完整且避免本 Step 越位 |
| Outbound 三候选是否测试发布 | 只测 absence/blocked；无 positive publish | `AR-HLD-Q-001` 未关闭 |
| 量化性能是否给临时阈值 | 不给；以 L/L+1 和 bounded behavior 为当前 P0 | `AR-HLD-Q-002` 未关闭 |
| 手工审查能否替代 P0 自动化 | 不能；只作 evidence/review 补充 | 红线必须可重复验证 |

## 6. 结构化中间产物

### 6.1 测试目标

| 目标 | 必须证明 | 完成上限 |
|---|---|---|
| Archive truth 正确 | 26 对象、18 状态、不可变 revision/history、local result 可判定 | 不证明 owner truth 正确 |
| Source authority 不越权 | 八类来源保持 owner/material class/fence/coverage；workspace 永为 Auxiliary | 不证明未闭合 owner export 成功 |
| Protocol 与 flow 可执行 | 30 logical/32 surfaces 使用正式 DTO/error/phase，Query 零写 | transport/provider 未选不算 ready |
| 一致性与幂等 | UoW/CAS/read-set/fence、完整 replay、local/external unknown 恢复 | durable finality 须真实 adapter |
| 外部 effect 安全 | intent-before-effect、ACK≠commit、exact probe/reconcile、per-owner isolation | 不推导 archived/restored |
| 配置/装配安全 | 55 key、来源优先级、exact slots、fake 隔离、fail-closed | assembly Ready 不等产品 readiness |
| 安全与证据 | no raw body/secret、高/低权威信号分层、fixed-run raw→report→EV | 当前不产生任何真实 EV |

### 6.2 优先级口径

| 优先级 | 定义 | 当前包含 |
|---|---|---|
| P0 | 主线、不变量、权限/所有权、数据安全、一致性、证据真实性与 VETO | 全 30 入口、26 对象分组、18 状态、UoW/幂等/unknown、55 key、source authority、restore boundary |
| P1 | 正式 provider/产品选定后的附加组合、兼容与下游 hardening | 多 provider、SDK/Console/Sync 兼容、可选 observability material handoff |
| P2 | 需要 workload、长期环境或跨区域设计的量化验证 | 性能容量、长稳、RTO/RPO、跨区域恢复 |

### 6.3 执行状态与范围表

| 执行状态 | 含义 | 能否算通过 |
|---|---|---:|
| `planned` | 已设计，尚未实现/执行 | 否 |
| `blocked` | 正式合同、实现、环境或 authority 不具备 | 否 |
| `pending` | 等后续选择、baseline 或 06/07 | 否 |
| `not_run` | runner/suite 未执行 | 否 |
| `infrastructure_failed` | harness/环境未能完成测试 | 否 |
| `passed/failed` | 只由固定 run 的真实 raw artifact 产生 | 当前不存在 |

| 范围项 | 类型 | 优先级 | 当前状态 | 验证目标 / 非目标 |
|---|---|---:|---|---|
| 6 crates / 26 objects / 18 states | object/state | P0 | planned | 本地契约与非法迁移；不测 owner 内部 |
| 3 Command / 5 Query / 5 Consumer / 17 Job | protocol/flow | P0 | planned；外部 positive 部分 blocked | 全入口、phase、error、replay/no-write |
| 7 port families / fake-durable parity | integration | P0 | fake planned；durable/external blocked | mapping/UoW/unknown；不选 backend/provider |
| 8 source classes / manifest closure | authority/closure | P0 | negative planned；formal positive blocked | 不升格 Auxiliary/ref/summary |
| integrity/storage/governance/restore seams | external effect | P0 | positive blocked | fail-closed、intent/probe；不测 provider 内部 |
| 12 config domains / 55 keys | config | P0 | planned；真实 binding blocked | strict parse/source/cross-field/assembly |
| telemetry/redaction/evidence pipeline | security/evidence | P0 | planned；sink/handoff blocked | 不泄漏、不造静态 EV |
| 三 outbound candidates | event | P0 boundary | blocked by design | 只证明无 publish/outbox/topic/delivery |
| 产品/多 provider/SDK compatibility | hardening | P1 | blocked/pending | 仅正式合同后 selected run |
| 性能/容量/长稳/RTO/RPO | nonfunctional | P2 | pending baseline | 不发明数字 |

### 6.4 非范围与风险归属

| 非范围 | 原因 / owner | 当前测试边界 |
|---|---|---|
| 各 L1 owner 内部真相/状态/授权算法 | owning domain | 只验证 Archive 输入/输出 seam 与无反写 |
| Governance policy/hold/delete/risk 决策正确性 | governance/明确 owner | 只验证正式 decision 缺失/冲突/变化时的阻断 |
| Artifact 正文/血缘与 observability backend | L1-artifact/L4-observability | 只验证获准 material/ref 与边界 |
| Storage/KMS/signature/compression 产品内部 | infrastructure/security owner | 只验证 typed adapter outcome/unknown |
| Bus delivery truth | L0-bus | receipt/ACK 不冒充 delivery/commit |
| SDK cache、产品 UI、runtime/tools/sandbox/marketplace | 对应项目 | 只保留依赖/下游接口边界 |
| 真实部署、凭证、跨区 DR | 09/运维/基础设施 | 后续环境和演练；当前不创建 |

### 6.5 一票否决方向（正式编号留 06）

| VETO 方向 | P0 阻断条件 | 后续测试族 |
|---|---|---|
| owner truth/write authority | Archive 写任何 L1/workspace/observability DB/state/decision | SOURCE/RESTORE/DEPENDENCY |
| state semantic escalation | sealed/verified/ACK/item success 推 archived/restored/global success | STATE/JOB/CONSUMER |
| fail-open completeness | 缺 source/fence/coverage/integrity/authority 仍 Complete/Sealed/Ready | SOURCE/MANIFEST/ASSESS |
| Auxiliary/fake elevation | workspace/ref/summary/fake 被当 canonical/real | CONTRACT/SOURCE/CONFIG |
| duplicate/unknown unsafe effect | result 重算、blind retry、wrong probe、重复 dispatch | IDEM/UOW/EFFECT |
| Query side effect/disclosure | Query 写、repair、external call，或 hidden metadata 泄漏 | QUERY/SECURITY |
| config/dependency bypass | 非 Core sibling compile、production fake、非法 winner fallback | CONFIG/DEPENDENCY |
| evidence fabrication/leakage | static pass、跨 run 拼接、无 raw EV、secret/body 出现在输出 | REPORT/SECURITY |

## 7. 复杂度判断

Step 2 只固定范围轴，不拆模块文件；但正式 §2 必须保留 priority 与 execution status 两张独立表，否则 `P0 blocked` 会被误读成“降级为 P1”或“已经通过”。具体测试对象和用例留 Step 3/6。

## 8. 回填草稿

正式 §2 应保留七个证明目标、P0/P1/P2、planned/blocked/pending/not_run/infrastructure_failed/passed/failed 双轴、范围表、非范围和八类 VETO 方向。明确当前 0 个已执行用例和 0 个真实证据，required-but-blocked positive lane 不得删除或由 fake 替代。

## 9. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 新需求/对象/协议/config | 无 |
| 03/04 回写 | 无；范围完全承接正式设计 |
| 新 blocker | 无 |
| 持续待确认 | 12 上游 blocker、6 local pending、正式 06 的 AC/VETO 编号、正式 07 的实施安排 |

## 10. 进入下一步条件

- [x] P0/P1/P2 与执行状态双轴明确。
- [x] 全部 P0 主链和一票否决方向可定位。
- [x] 外部 positive 保持 required/blocked，未被删除或 fake 关闭。
- [x] 非范围均有 owner/风险归属。
- [x] 未写入运行、证据或验收事实。
- [x] 允许进入 Step 3。
