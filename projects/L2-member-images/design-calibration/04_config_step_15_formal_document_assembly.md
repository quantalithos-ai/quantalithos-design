# L2-member-images 04 配置设计 Step 15：正式文档装配与总审计

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 15
> 输出正式文档：`projects/L2-member-images/04-配置设计.md`
> 当前状态：`completed_stop_review`
> 文档模式：`full-restart`

## 1. Step 状态与边界

| 项目 | 当前记录 |
|---|---|
| 前置条件 | Step 1~14 已完成；Step 14 已确认当前 P0 没有对 `03-详细设计.md` 的 `待回写` 或 `阻塞待确认` 项。 |
| 本步目标 | 将已完成的 Step 1~14 按配置设计书写规范的固定 15 章主链装配为正式 `04-配置设计.md`，并完成章节、配置域、配置项、来源、profile、安全、失效和下游边界的总审计。 |
| 本步允许 | 创建本 Step 中间产物、创建正式 04、更新 04 flow 和项目台账、进行只读静态审计。 |
| 本步禁止 | 新增配置契约、回写 03、创建 05~07/09 正文、implementation ledger、planned boundary skeleton、实现、测试执行、证据、运行记录或 commit。 |
| 当前外部边界 | `MI-UP-*`、`Q-MI-*`、`DDD-*` 与 `PF-*` 仍是受影响正向能力的 blocker；它们不被装配动作关闭。 |

## 2. 输入与装配原则

| 输入 | 状态 | 本步限定用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` ~ `04_config_step_14_risks_open_questions.md` | completed | 正式 04 各章节的唯一校准来源。 |
| 重建版 `00~03` 和 03 的配置/风险校准材料 | 当前正式基线 | 复核配置承接不改变既有 carrier、builder、slot、error、port、flow 或状态边界。 |
| `配置设计书写规范.md`、`配置设计讨论流程_SOP.md`、中间产物规范 | normative | 固定 15 章主链、章节来源、装配门禁和停审方式。 |
| `L1-governance` 的 04 与 Step 15 | 格式/粒度参考 | 仅参考正式装配、审计表和停审表达；不继承治理领域对象、产品、运行事实或配置项。 |
| README、旧 05/06、draft | historical material | 仅维持污染隔离；不得成为 schema、迁移、环境、测试、验收或运维事实。 |

装配遵循以下原则：

1. 正式正文只收录已在 Step 1~14 收敛的结论；诊断、取舍、过程门禁和停审细节继续留在 calibration。
2. 正式正文的每一章都必须指向具体 Step 文件和可继续阅读的小节。
3. P0 只覆盖五个功能域、21 个 startup-only 配置项和既有 private infra composition；不把 local assembly 或 slot marker 升格为外部正向结果。
4. `safe absence < project JSON < allowlisted environment selector` 是唯一普通来源优先级；严格 JSON、非法高优先级拒绝整份 effective configuration、无 silent fallback 的结论必须跨章一致。
5. 跨 owner/sibling/input 的未闭合事项只以 `Blocked`、`Unknown`、`Gap`、`Unavailable`、`ConsumerHandoffGap` 或 `ReopenRequired` 等保守语义呈现。

## 3. 15 章装配映射

| 正式章节 | 主要校准来源 | 装配要点 | 当前状态 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 权威输入、历史隔离、owner/sibling pending、03 回写边界 | 已装配 |
| §2 本次配置设计目标与范围 | Step 2 | P0/P1/P2、非范围和产品中立控制面 | 已装配 |
| §3 配置控制面总览 | Step 3 | 唯一 raw reader、builder、五域和模块可见性 | 已装配 |
| §4 配置分类与边界 | Step 4 | startup-only、禁止配置化不变量和 static/live 边界 | 已装配 |
| §5 配置来源、优先级与冲突处理 | Step 5 | JSON/env、严格冲突规则、无未授权来源 | 已装配 |
| §6 环境、部署 profile 与配置矩阵 | Step 6 | 五 profile、P0/P1/P2、fake 和外部 seam 隔离 | 已装配 |
| §7 配置项清单 | Step 7 | 五域 21 key、严格 JSON 示例和组合不变量 | 已装配 |
| §8 敏感配置与密钥管理 | Step 8 | opaque selector、固定 redaction floor、禁止输出与轮换边界 | 已装配 |
| §9 配置加载、校验与生效机制 | Step 9 | source merge、strict validation、builder assembly 和 startup freeze | 已装配 |
| §10 配置变更、审计与回滚 | Step 10 | high-risk 离线变更、安全审计面、fresh validation + restart | 已装配 |
| §11 失效模式与降级 / fail-fast 策略 | Step 11 | source/slot/sensitive/external/drift 失败语义 | 已装配 |
| §12 测试、验收、实施与运维承接 | Step 12 | 05/06/07/09 的 planned handoff 与禁止重定义项 | 已装配 |
| §13 配置迁移、废弃与演进 | Step 13 | 当前无迁移基线、生命周期和 future trigger | 已装配 |
| §14 风险与待确认事项 | Step 14 | owner/blocker、03 回写审计和重开规则 | 已装配 |
| §15 参考 | Step 1~14、flow、规范 | 规范、当前正式基线、校准链和 owner input | 已装配 |

## 4. 当前文档问题诊断与取舍

| 议题 | 装配前风险 | 本 Step 处理 |
|---|---|---|
| 正式 04 缺失 | 后续测试、验收、实施和运维无可引用的配置控制面入口。 | 仅从 Step 1~14 重建，不从旧 README/05/06 拼接。 |
| 配置项细节分散 | 可能遗漏来源、敏感性、生效、回退或失效规则。 | §5~§11 按同一五域、21 key、startup-only 语义装配。 |
| external seam 被误读为成功 | selector 或 `Assembled` 易被误解为构建、制品或 consumer 链路已经成立。 | 所有相关章节重复限制为 local composition / conservative marker，不形成正向事实。 |
| future 能力提前进入 | config center、secret provider、hot reload 或生产 profile 容易被伪装成 disabled P0 key。 | 仅列作 `design-change-required`；先回写 03，再重开受影响 04 Step。 |
| 下游未重写 | 可被误写为已测试、已裁决、已实施或已运维。 | §12 只交付 planned handoff，不创建下游正文或任何执行性材料。 |

| 取舍 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| 正式文档粒度 | 正文收录收口结论并回链 Step | 复制全部讨论过程 | 保持正式入口可读，同时保留可审计的讨论证据。 |
| JSON 示例 | 严格 JSON 与 `opaque-ref:*` 文档符号 | JSONC、真实 selector 或产品配置 | 保持可校验性、无密钥泄露和产品中立。 |
| 正向外部能力 | 保守 marker 与 owner gap | fake/default/缓存补齐 | 本仓不拥有外部 truth 或 release/consumer 裁决权。 |
| 03 影响 | 当前无回写；future 触发重开 | 静默扩展 builder/port/error/flow | 配置设计不能替代详细设计。 |

## 5. 写入前自检

| 检查项 | 结论 | 依据 |
|---|---|---|
| 项目级台账是否允许装配 04 | 通过 | `project_execution_ledger.md` 的 current restore point。 |
| 文档级 flow 是否允许 Step 15 | 通过 | `04_config_calibration_flow.md` 的 Step 15 gate。 |
| Step 14 是否允许正式回填 | 通过 | 当前 P0 无 `待回写` / `阻塞待确认`。 |
| 固定 15 章是否已建立映射 | 通过 | 本文件 §3。 |
| 是否会新建 key、source、产品或代码契约 | 不会 | 本步仅装配已确认结论。 |
| 是否会越过 04 进入下游或实施 | 不会 | 仅记录 planned handoff。 |

## 6. 对详细设计的影响判定

| 装配结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 正式 04 按 Step 1~14 装配 | 否 | 文档收口 | 不适用 | 无回写 |
| 五域、21 key、严格 JSON、profile、startup-only、safe audit 与 failure 语义 | 否 | 承接既有 config/builder/slot 边界 | 不适用 | 无回写 |
| future remote source、provider、online control、公开契约或 lifecycle 改变 | 是（future 条件） | config carrier、builder、adapter、port、error、flow、state/observability 可能变化 | 触发时回写 03 §4~§15 并重开对应 04 Step | 无回写（当前未触发） |

## 7. 待完成装配后的审计清单

- [x] 正式 `04-配置设计.md` 存在且仅有固定 15 章。
- [x] §1~§15 每章都有具体 calibration 来源与延伸阅读。
- [x] 五个配置域的 key 数为 `3 + 3 + 11 + 3 + 1 = 21`。
- [x] 21 个 P0 key 都有类型、默认值/安全缺省、必填性、来源、作用域、生效、敏感性、失败策略和关联模块。
- [x] 严格 JSON 示例不含注释、trailing comma、未知字段、真实凭据或外部正文。
- [x] `Assembled`、fake、opaque ref 和 optional external marker 未被表达为外部构建、制品、consumer、运行、容器或发布结论。
- [x] 不存在当前 P0 对 03 的 `待回写` 或 `阻塞待确认` 项。
- [x] 05/06/07/09 仅为 planned handoff，未生成实施、测试执行或实际产物事实。
- [x] flow 和项目台账在审计后进入 `completed_stop_review`，下一动作仅等待用户确认后进入 05。

## 8. Step 15 总审计结论与停审门禁

本 Step 已完成正式 `04-配置设计.md` 的总装配与静态审计：正式文档包含固定 15 个 `##` 主章节；五个 P0 配置域共 `3 + 3 + 11 + 3 + 1 = 21` 个 key；章节来源块、严格 JSON 示例、来源优先级、profile、敏感/脱敏、startup-only 生效、变更/回滚、失效、迁移和风险语义彼此一致。审计确认没有把 `Assembled`、opaque ref、TestOnly fake 或 optional external marker 写成 build、digest、Artifact、consumer、runtime、container、release 或 readiness 事实。

当前未发现需要回写 `03-详细设计.md` 的 P0 项；所有 `MI-UP-*`、`Q-MI-*`、`DDD-*` 与 `PF-*` 未闭合事项仍保持 pending/blocker，不能由配置装配关闭。05/06/07/09 尚未重写，本 Step 没有创建实现台账、planned boundary skeleton、测试执行、报告、证据、run、digest、verdict、signoff 或 commit。

`document_status = completed_stop_review`。正式 04 已写入并停止审阅；下一动作仅为等待用户明确确认后进入 05。当前不允许继续写入正式 04、创建 05~07 或实施/执行材料。
