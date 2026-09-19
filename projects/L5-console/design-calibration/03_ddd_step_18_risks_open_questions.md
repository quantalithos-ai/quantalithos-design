# Step 18. 风险与待确认事项

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18  
> 回填章节：未来正式 `03-详细设计.md` §17  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与边界

本 Step 只汇总 Step 1～17 后仍会影响正式移交、代码实现或 production integration 的风险，逐项说明影响、阻塞范围、确认方和未确认处理。它不新增对象、字段、协议、状态、配置默认值、产品选择、测试/验收编号、phase 或 commit boundary。

详细设计内部的 fail-closed 主链已经闭合；“闭合”不等于 production adapter、owner integration、兼容性、性能、测试、evidence 或 readiness 已成立。旧正式 `03/05/06` 仍只作历史污染输入，目标实现仓仍未创建。

## 2. 输入、批次与 SOP 回答

| 输入 | 状态 | 用途 |
|---|---|---|
| Step 1～10 | done | 上游、范围、模块、对象、port、protocol、flow、state 风险 |
| Step 11～16 | done | carrier/error/concurrency/config/diagnostic/test 风险 |
| Step 17 | done | 跨文档预审、冲突、实施阅读和 blocker 分类 |
| `CON-Q-034～047` | open/pending | 保持上游可追溯，不虚假关闭 |

| 批次 | 内容 | 状态 |
|---|---|---|
| 18.1 | 目标、问题回答、诊断与已关闭项 | done |
| 18.2 | 风险和待确认事项表 | done |
| 18.3 | 未确认处理、回填与门禁 | done |

| SOP 问题 | 回答 |
|---|---|
| 哪些问题仍影响实现？ | 正式文档链、目标仓/工具、exact owner contracts、安全/资格/idempotency/invalidation、state/host/diagnostic/量化 authority。 |
| 哪些阻塞、哪些仅影响后续？ | 正式 `03～07` 和目标仓阻塞正式开工；exact contract 按 facet 阻塞 positive integration；框架/storage/兼容/量化按目标 boundary 阻塞。fail-closed纯类型/guard skeleton 可设计，但仍不能绕过正式 07 开工门禁。 |
| 谁确认？ | 详细设计/下游文档维护者、各 owner 与 SDK 维护者、架构/配置/测试/验收/运维负责人，以及目标仓实施计划维护者。 |
| 未确认前怎么办？ | fail closed，保持 pending/blocked/read-only/partial/unknown/disabled；不得从历史文档、SDK `unknown`、fake、route、config 或 UI 状态补真相。 |

## 3. 当前诊断与取舍

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧正式 03 与 Step 1～17 冲突 | 无正式新版实现入口 | Step 19 全量重建，不修补旧结构 |
| 正式 04/07 缺失、05/06 历史口径 | 配置/测试/验收/phase 无可信门禁 | 后续严格 full-restart，不提前写 |
| exact owner contracts 缺失 | client shell 可定义、positive mapping 不可实现 | 保持 facet-level blocker，不把整个安全设计误判为 ready |
| 用户要求从 Step 5 审查 | 摘要审查不足以证明粒度 | Step 16/17 已从 Step 5 逐层反查；Step 19 再做装配审查 |
| 通用服务端风险模板 | 会引入 DB/bus/job 不适用风险 | 只保留 Console 真实风险；不列 durable DB/DLQ/job 等伪需求 |

采用“只保留仍开放且影响明确的风险”。已闭合的对象归属、client字段来源、port骨架、5+16+1 inventory、flow、状态、carrier边界、错误/unknown、single-flight、binding、diagnostic whitelist 和最小测试入口不再重复写成风险。

## 4. 已关闭风险不再列入

| 已关闭项 | 关闭依据 | 结论上限 |
|---|---|---|
| 十模块职责和依赖方向 | Step 5/6/7 | client module skeleton closed；framework仍 pending |
| client-owned字段/状态来源 | Step 6 + Step 17 §8 | local/formal source 或缺失处理明确；owner exact schema未关闭 |
| public protocol inventory/flow coverage | Step 8/9/16 | 5 Command、16 Query、1 consumer逐名覆盖；positive contract按项 blocked |
| client状态合法/非法迁移 | Step 10/16/17 | detailed-design internal closure pass；下游 05/06/07待对齐 |
| persistence applicability | Step 11 | scoped carrier closed；DB/repository/UoW/outbox/projection明确 N/A |
| error/recovery/concurrency safety | Step 12/13 | typed/fail-closed/no replay/single-writer规则闭合；owner语义待合同 |
| config/diagnostic代码绑定点 | Step 14/15 | typed seam closed；具体配置/sink/阈值待后续 |
| 最小测试入口 | Step 16 | planned cuts齐全；未执行、无结果/evidence |

## 5. 风险表

| 风险 | 影响 | 阻塞范围 | 缓解 / 未确认处理 | 负责人 / 待确认方 |
|---|---|---|---|---|
| Step 19 正式 03 装配状态 | 装配前旧 03 不能作为实现入口；本项已由 Step 19 关闭 | 不再构成开放 blocker | 已按 18 章重建并从 Step 5 审查；关闭证据见 Step 19 assembly/review | 详细设计维护者 / 用户 |
| 正式 04/05/06/07 尚未按新版主链完成 | config、测试、验收、phase/commit 与 evidence 无正式来源 | 阻塞实现 agent 开工和交付 | 后续严格 `04→05→06→07` full-restart；不沿用旧 05/06 | 对应文档维护者 |
| 目标仓 `/home/aris/Projects/quantalithos-console` 不存在 | 无 package/tooling/git事实，不能写代码/测试/提交 | 阻塞任何实现写入 | 由未来 07 前置门禁确认创建方式、目标仓规范和 baseline | 实施计划维护者 / 实现者 |
| `CON-Q-034` exact Query/Command/Result/Ref/activation 未闭口 | positive adapter、delegated submit 和 active posture 无 schema | 阻塞对应 production integration；不阻塞 blocked skeleton | 仅实现 typed seam/fail-closed；owner+SDK合同到达后回改 Step 7～10 | owner / SDK 维护者 |
| `CON-Q-035～037` scope/visibility/qualification/safe-field/redaction/axes 未闭口 | verified/visible/qualified/safe view 的精确映射不可判定 | 阻塞对应 positive presentation/action | unresolved/restricted/minimal/blocked；不解析正文或复制规则 | identity/Policy/Gate/各 owner/SDK |
| `CON-Q-038` reconciliation/idempotency/dispatch boundary 未闭口 | command 可能重复副作用或伪终态 | 阻塞 positive owner command/replay | 无 exact contract 不 submit；ambiguous→unknown；只允许 formal reconcile | command owner / SDK |
| `CON-Q-039～043` Workspace/Method/Capability/Observability/Archive/Sandbox 专项 seam 未闭口 | 相应管理主题的来源、动作、状态或结果不完整 | 按主题阻塞 read/write/activation/integration | owner 分区保持 pending/read-only/partial/blocked；不复制 owner truth | 对应 owner 维护者 |
| SDK invalidation envelope/id/version/order/dedup 缺失 | consumer 无法安全激活，无法判重复/先后 | 阻塞 conditional consumer positive branch | disabled/no-write；继续显式 Query；合同到达后回改 Step 7/8/9/13 | SDK / event owner |
| `CON-Q-044` state medium/serialization/TTL/capacity/migration/cross-session 未闭口 | 无法承诺持久偏好/草稿/请求连续性或并发安全 | 阻塞 configured durable carrier；不阻塞 session-volatile skeleton | 只允许 session-volatile、whole-record、single-writer；未来 04 确认 | 产品/架构/配置维护者 |
| framework/router/bundler/package manager/host contract 未选择 | 无法确定 concrete UI/component/build/router wiring | 阻塞具体 host/UI implementation | 保持 framework-neutral module/page/host ports；正式 authority 后回 Step 3/4/14 | 架构 / 实施计划维护者 |
| `CON-Q-046` browser/a11y matrix、diagnostic envelope/sink/vocabulary 未闭口 | 无法证明具体组合兼容或绑定生产诊断 | 阻塞 compatibility/production diagnostics/对应验收 | 只固定语义等价和 body-free facade；sink 可 disabled，不声称已验证 | 测试/验收/运维/产品 |
| `CON-Q-045` 性能/可用率/负载 authority 缺失 | 无场景、环境、窗口、责任和阈值依据 | 阻塞性能验收/SLO/优化门禁 | 不写数字；保持有界 fan-out、局部隔离、可归因 | 产品/架构/测试/运维 |
| `CON-Q-047` 未停审 L5/L6 link/ref 合同 | 外围导航可能耦合私有页面/状态 | 阻塞对应外围 link/deep-link | 不进入主链、不消费私有状态；等待双方正式停审 | 相邻项目维护者 |
| 历史 Provider Contract、固定控制项/指标/阈值、技术框架回流 | 产生第二真相和无 authority 实现 | 阻塞 Step 19 审查通过 | 以 Step 1 污染审计和 Step 5～18 正式名词清除 | 详细设计维护者 |

## 6. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| 正式 03 装配与粒度审查 | 无新版正式入口 | 详细设计维护者 / 用户 | 继续 Step 19；不得按旧 03 开工 |
| 后续 04/05/06/07 full-restart | 无配置/验证/实施门禁 | 对应维护者 / 用户逐文档授权 | 正式 03 后立即停审；不越级创建 |
| 目标仓、package/build/target-repo git config | 无实现环境事实 | 实施计划维护者 / 实现者 | 不创建仓/代码；未来 07 核实 |
| exact owner/SDK surface 与版本策略 | positive adapters无实现依据 | 各 owner + SDK | 缺一个 facet 就保持对应 blocked，不以 `unknown` 形状替代 |
| scope/visibility/qualification/safe-field | protected view/action无法正向判定 | 正式安全 owner | fail closed、最小披露、客户端只收紧 |
| command idempotency/reconciliation/cancel | delegated write不安全 | command owner + SDK | no submit/replay；unknown/wait/exit |
| invalidation activation合同 | local stale提示无可靠顺序 | SDK/event owner | disabled；显式 requery |
| client state生命周期与介质 | durable/cross-session行为未知 | 产品/架构/配置 | session-volatile；context/session cleanup |
| framework/host/browser/a11y/diagnostic | concrete implementation与兼容未知 | 架构/产品/测试/运维 | framework-neutral、semantic equivalence、diagnostic disabled allowed |
| 性能/兼容/量化阈值 | 无合法验收数字 | 产品/测试/运维 | 不写数字或 readiness |
| 未停审 L5/L6 links | 外围入口不可稳定 | 相邻项目双方 | 不进入 main route/action truth |

## 7. 未确认前实现与移交规则

| 场景 | 处理规则 |
|---|---|
| 正式 03 未生成 | 不恢复旧 03；不移交实现；继续 Step 19 |
| 04/05/06/07 未同步 | 不把旧配置、测试、验收、phase 或 evidence 交给实现者 |
| 目标仓/工具/提交规范未确认 | 不写代码、测试、脚本或实现仓 commit |
| 字段/DTO/状态/flow 缺口 | 回写对应 Step；不由实现者补 placeholder/别名 |
| owner contract/SDK surface 缺失 | 对应 adapter/feature 保持 blocked；允许 safe fake only，不伪造 integration |
| 命令可能已 dispatch 但结果未知 | 标 `unknown`，只走 formal reconciliation/wait/exit；禁止自动 replay |
| carrier 写入完成未知 | reload/minimal shell；不得假定旧/新记录或重发 owner command |
| invalidation contract 缺失 | disabled/no-write；不直连 bus、不保存 event/cursor |
| 运行期 owner/host/sink 不可用 | per-owner/host partial/unavailable/failed；保持无关区域安全，不生成 readiness |
| 量化/浏览器/a11y/诊断 authority 缺失 | 只保留结构/语义边界；不写阈值、兼容通过或 evidence |

## 8. Step 19 回填与进入条件

正式 `03-详细设计.md` §17 应包含：风险基线、风险表、待确认表、未确认处理规则、旧材料污染隔离、`CON-Q-034～047` 的逐项阻塞范围，以及“本 Step 不伪造 production/integration/evidence/readiness”的事实声明。已由 Step 5～17 闭合的内部契约不得重复写成未确认。

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有仍开放事项有影响/阻塞范围/确认方/处理方式 | 通过 | §5～7 |
| 不确定项未被写成已确认契约 | 通过 | 本 Step 不新增 schema/state/config/phase |
| 历史材料和其他项目 pending 已隔离 | 通过 | 旧 03/README/draft 仅诊断；未停审 L5/L6 不入主链 |
| 可进入 Step 19 | 通过 | 仅允许正式 03 装配与 Step 5 起的最终粒度审查 |

Step 18 `done / pass / self_reviewed`。未创建实现仓、实现台账、boundary skeleton、测试、artifact、report、evidence、verdict、signoff 或 readiness；未提交 commit。下一步更新 flow/ledger 后进入 Step 19。
