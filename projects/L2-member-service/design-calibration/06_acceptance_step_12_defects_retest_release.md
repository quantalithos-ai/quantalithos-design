# Step 12. 定义缺陷分级、复验与放行规则 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节：`06-验收标准.md` §12 缺陷分级、复验与放行规则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 缺陷分级、复验与放行规则 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 5~11；`05-测试方案.md` §11、§12、§14；`00` VF-MS-001~009 |
| 输出文件 | `design-calibration/06_acceptance_step_12_defects_retest_release.md` |
| 真实执行状态 | 未执行；没有实际缺陷、复验 run 或放行结论 |
| gate_status | `pass_with_upstream_blockers` |
| gate_reason | S/A/B/R 分级、VETO 升级、复验范围、关闭证据和三值放行条件已固定；上游正向合同仍影响可执行性 |
| next_allowed_action | 进入 Step 13，定义风险接受与遗留项 |

### 1.1 Step 内计划

- [x] 对齐 `05` 缺陷分级、进入 / 退出和回归规则。
- [x] 固定 VETO、P0、证据、上游 blocker 和一般问题的分级边界。
- [x] 定义最小复验、扩展复验、全量 P0 回归和关闭证据。
- [x] 定义缺陷状态、放行条件及 `not_evaluable` 处理。
- [x] 完成缺陷 / 复验停审和与 VETO、风险接受的交叉审计。

## 2. 本步目标

本步回答“发现问题后如何决定是否阻断验收、需要重跑什么、何时可以关闭，以及哪些问题不能被风险接受”。验收缺陷不是实现任务清单；它必须绑定 AC/VF、TC、EV、固定 run、raw artifact 和 report。

`not_evaluable`、`blocked`、`waiting`、`unavailable` 和 `not_run` 都不是通过。只有真实复验证据证明原失败已消除，且相关门禁没有新的失败，缺陷才能进入 `verified/closed`。本步不填写任何实际缺陷编号、数量、状态或结果。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| P0 功能、红线、状态和 NFR 验收项 | Step 5~9 | 识别缺陷影响面 |
| 证据与 VETO 门禁 | Step 10~11 | 识别证据不完整、VETO 命中和审计失败 |
| 测试缺陷与回归规则 | `05` §11、§14 | 复用 S/A/B/R、最小回归和全量回归触发 |
| 三值结论规则 | `验收标准书写规范.md` §4.2、§5.12~§5.14 | 把缺陷状态连接到通过 / 有条件通过 / 不通过 |

## 4. SOP 问题回答

| 问题 | 回答 | 裁决依据 |
|---|---|---|
| S/A/B/R 如何定义？ | S 是 VETO 或不可接受硬边界；A 是未命中 VETO 但影响 P0 主线 / 证据的重大缺陷；B 是不阻断 P0 的一般问题；R 是上游合同、产品、容量或 future residual。 | `05` §11；§8.1 |
| 每级缺陷如何影响结论？ | S 或 VETO 未关闭只能“不通过”；未接受 A 级阻断；已严格限制且有正式接受人的 A 可“有条件通过”；B/R 可进入风险接受，但不能改写 P0 证据状态。 | Step 11；Step 13 输入 |
| 修复后如何复验？ | 先跑原 TC / 原 suite，再按影响扩展同族用例、相关 blocking suite、redaction/dependency/report audit；涉及 P0 truth、schema、state、UoW、key fence 或输出边界时默认全量 P0。 | `05` §14 |
| 哪些问题可以风险接受？ | 仅 B/R 以及不影响 P0 truth、安全、证据和依赖硬边界的、经过限制的 A；必须有 impact、reason、owner、acceptor、deadline/trigger 和 follow-up。 | 书写规范 §5.13 |
| 哪些问题不可接受？ | VETO、S、forbidden-body、owner truth 越界、required seam fail-open、second current、Query/Job truth repair、依赖伪装、静态证据或 P0 profile 伪 passed。 | Step 11 |
| 上游 blocker 是缺陷还是风险？ | 正向合同未闭合通常记录为 R / blocked / waiting；若本仓把它伪装为 ready 或 passed，则升级为 S / VF-MS-009 或相关 VETO。 | `00` §14.7；Step 11 |
| 证据缺失如何处理？ | 相关 AC/VF 标为 `not_evaluable`，送验暂停或不通过；不得创建“缺证据”缺陷后直接关闭，也不得视为未触发。 | Step 10~11 |
| failed suite 是否可以删除后重跑？ | 不可以。原失败 run、artifact、report 和 safe failure reason 必须保留，修复后使用新固定 run。 | `05` §13.8 |
| 同一缺陷重复出现如何处理？ | 保留原缺陷关联和历史 run，新增复验记录；不能覆盖失败证据或换 key 隐藏重复。 | `03` §12；`05` §11 |
| 何时允许放行？ | 全部 P0 AC 有结论且通过、VETO 均经真实证据判定未触发、S=0、证据完整；有条件通过还需逐项风险接受。 | Step 14 预备规则 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 `06` | 缺陷只描述“修复后再测”，没有级别和结论影响。 | 固定 S/A/B/R、复验和三值放行矩阵。 |
| `05` §11 | 测试缺陷规则与验收结论的连接不够显式。 | 明确 VETO/S/A/B/R 如何映射到通过、条件通过和不通过。 |
| evidence gap | 缺 raw/report 容易被当作“无失败”。 | 引入 `not_evaluable`，保留原始材料和 report-audit 触发。 |
| upstream blocker | 正向 unavailable 可能被写成 defect fixed。 | 统一记录 R + blocker_status，不得伪造修复或 ready。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 级别 | S/A/B/R 说明分散 | 单一分级表和升级规则 | 可一致裁决 |
| 复验 | 只说相关测试 | 原 TC → 同族 → blocking suite → 全量 P0 的分层矩阵 | 防止局部重跑遗漏 |
| 证据 gap | 可能人工补表 | `not_evaluable`，原 run 保留 | 证据诚实 |
| 放行 | 模糊“修复后可发” | 三值矩阵，VETO/S 不可接受 | 连接 Step 11/13/14 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| A 级是否可条件放行？ | A. 一律不行；B. 仅不影响 P0 硬边界、证据完整且有正式接受人时可条件放行 | 采用 B；实际每项单独审查。 |
| R 级 upstream blocker 是否标 defect fixed？ | A. 是；B. 保持 blocked/waiting/unavailable | 采用 B。 |
| 缺 artifact/report 如何结论？ | A. 默认 passed；B. `not_evaluable` / 不通过 | 采用 B。 |
| 修复是否复用旧 run？ | A. 覆盖；B. 新 run 且保留旧失败材料 | 采用 B。 |
| VETO 是否可用局部复验关闭？ | A. 可以；B. 按影响触发同族和全量 P0 | 采用 B。 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | 典型触发 | 对验收结论 | 关闭 / 复验 |
|---|---|---|---|---|
| S | VETO 命中或破坏 Host Truth、owner、安全、证据、依赖硬边界 | VF-MS-001~009；forbidden body；second current；Query/Job repair；static evidence | 未关闭只能“不通过”；不可风险接受 | 修复设计 / 实现后跑原 TC、同族 blocking suite、全量 P0 和相关审计；新 run 证明未再触发 |
| A | 未命中 VETO 但影响 P0 主线、sidecar、状态、UoW、幂等或关键报告 | accepted truth 缺 sidecar；old generation marker 覆盖；partial material；关键 report 不完整 | 默认阻断；仅在不影响硬边界且有正式接受人时“有条件通过” | 原 TC + 相关 suite + 影响范围回归；保留 fixed run 和 reviewer note |
| B | 不影响 P0 truth / 安全 / 证据的局部质量问题 | 非关键排序、可读性、非阻断诊断字段 | 可进入风险接受，不阻断 P0 | 定向复验或后续维护；不得改 P0 结果 |
| R | 外部合同、真实产品、容量、保留策略或 future 能力未闭合 | MSVC-UP-001~008；真实 provider unavailable；无性能 authority | 记录为 residual；若是本轮必需前置则暂停 / 不通过 | 合同 / 产品 / authority 闭合后新基线和 selected/full run；不得标 fixed |

### 8.2 S 级与 VETO 升级表

| 触发面 | 最低级别 | 升级条件 | 禁止降级 |
|---|---|---|---|
| 核心闭环 / 主语 | S | C-MS-1~5 断裂、隐式 host 或越权 lifecycle | 不得降为 A/B |
| owner / body | S | 写入 sibling truth、raw body、secret、endpoint 或外部正文 | 不得用 redaction 后说明替代 |
| readiness / seam | S | required unavailable/unknown 仍 Ready、fallback 或 fake positive | 不得以 timeout / adapter Ok 解释 |
| consistency | S | duplicate / unknown / late 形成第二 current、第二 effect 或历史抹写 | 不得换 key 或删历史 |
| result layering | S | attempt / receipt / snapshot 推导 delivered / observed / accepted | 不得以最终报告补写 |
| dependency | S | non-Core sibling compile edge 或分类伪装 | 不得以运行时实际未调用辩护 |
| evidence | S | 静态造证据、orphan EV、缺 pair 被标 passed | 不得删除失败材料 |

### 8.3 复验矩阵

| 缺陷区域 | 原 TC / 最小复验 | 必须追加 | 主要 EV / report |
|---|---|---|---|
| subject / intent / decision | `TC-INTENT-*`、`TC-DECISION-*`、`TC-IDEMP-001~003` | 影响 owner / state 时全量 P0 | `EV-MS-CMD-001`、`EV-MS-CONTRACT-001`、service-flow report |
| qualification / assembly / readiness | `TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-DOMAIN-003`、`TC-CONFIG-*` | no-bypass 或 required seam 变化时全量 P0 | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001` |
| registration / session | `TC-REG-*`、`TC-SESSION-*`、`TC-CONSUMER-002` | generation / single-active 变化时全量 P0 | `EV-MS-CONSUMER-001`、`EV-MS-DOMAIN-001` |
| health / recovery | `TC-HEALTH-*`、`TC-RECOVERY-*`、`TC-IDEMP-005~008` | restart / unknown 变化时 operations replay | `EV-MS-DOMAIN-001`、`EV-MS-IDEMP-001` |
| closure / cleanup / reconciliation | `TC-CLOSE-*`、`TC-JOB-003/004/007` | external completion layering 变化时全量 P0 | `EV-MS-JOB-001`、`EV-MS-MATERIAL-001` |
| material / outbox / projection | `TC-MATERIAL-*`、`TC-JOB-005/006`、`TC-IDEMP-009/010` | cursor / immutable payload 变化时全量 P0 | `EV-MS-MATERIAL-001`、`EV-MS-JOB-001` |
| Query no-write / Job no-repair | `TC-QUERY-001~006`、`TC-QUERY-NEG-001`、`TC-JOB-NEG-001` | 任一 write-audit 变化时全量 P0 | `EV-MS-QUERY-001`、`EV-MS-JOB-001` |
| config / redaction / dependency | `TC-CONFIG-*`、`TC-REDACTION-*`、`TC-ARCH-001` | 任一硬门禁变化时全量 P0 | `EV-MS-CONFIG-001`、`EV-MS-REDACTION-001`、`EV-MS-ARCH-001` |
| report / evidence integrity | report-audit checks、`TC-REPORT-*` | 全部 blocking suite + evidence index | `EV-MS-REPORT-001`、`reports/runs/<run_id>/report-audit.md` |

### 8.4 缺陷状态和关闭证据

```text
opened -> triaged -> (blocked / waiting / in_progress)
                         |
                         v
                       fixed
                         |
                         v
                    re_tested
                    /       \
               verified    failed_again
                  |             |
                closed <---------+
```

关键说明：

- `fixed` 只表示责任人声明已修复，不等于验收通过；必须有新固定 run 的复验证据。
- `blocked / waiting` 不能被关闭；上游合同未闭合时保持 R 级 residual。
- 失败再次出现时保留原始 run 和关联，不能用新 key 隐藏重复。

### 8.5 放行判定矩阵

| 条件 | 通过 | 有条件通过 | 不通过 / 暂停 |
|---|---|---|---|
| P0 AC | 全部通过 | 全部通过 | 任一失败或 not_evaluable |
| VETO | 全部真实判定未触发 | 全部真实判定未触发 | 任一 triggered 或无法核验 |
| S 级 | 0 | 0 | >0 或未复验 |
| A 级 | 0 | 已逐项接受且不影响硬边界 | 未接受或影响 P0 |
| B/R residual | 无或无影响 | 有 owner/acceptor/reason/action/deadline | 未记录、影响 P0 或伪装成 pass |
| 证据 | raw/report/index/audit 完整 | 同上 | 缺失、静态、orphan、redaction/dependency/report audit failed |

### 8.6 缺陷 / 复验停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 定义无重叠 | 通过 | VETO / P0 / residual 分层明确 |
| VETO 命中转 S | 通过 | 不得风险接受或降级 |
| `not_evaluable` 不等于 pass | 通过 | 缺证据 / unresolved contract 需暂停或不通过 |
| 复验保留原失败 run | 通过 | 新 run 追加，不覆盖历史 |
| 关闭需要真实证据 | 通过 | TC、artifact、report、EV、reviewer note 必须回链 |
| 放行与三值结论一致 | 通过 | Step 14 继续约束最终签署 |
| 当前实际缺陷状态 | 未执行 | 无 defect、run、artifact、report 或 verdict |

### 8.7 跨缺陷 / VETO / 风险审计

| 审计项 | 结论 | 后续要求 |
|---|---|---|
| VETO 被降级 | 已禁止 | report / defect review 检查 S 级 |
| A 级批量接受 | 已禁止 | 逐项列 impact、acceptor、deadline |
| R 级伪修复 | 已禁止 | 合同闭合后重基线、重跑 |
| evidence gap 静默通过 | 已禁止 | `not_evaluable` 阻断 |
| fixed run 与原失败 run 配对 | 已固定 | 关闭记录必须双向回链 |

## 9. 回填草稿

正式 §12 应写明 S/A/B/R 定义；VETO 或安全、owner、证据、依赖硬边界命中时为 S 级且不可风险接受；A 级默认阻断，只有不影响 P0 硬边界并有正式接受人时才可有条件通过；B/R 进入风险清单。缺 artifact/report、未闭合合同或未运行用例标为 `not_evaluable` / blocked，不得当作通过。修复必须使用新固定 run，保留原失败材料，按原 TC、同族 suite、相关审计和影响范围回归；只有真实复验后才可关闭并进入三值放行判定。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 缺陷系统的实际 ID / 状态字段 | 影响执行记录 | 06 固定语义和必填关联，工具字段由实施计划 / 测试环境确定 |
| 全量 P0 回归的并发 / 时间预算 | 影响执行排程 | 由实施与测试阶段确定，不降低门禁范围 |
| A 级接受人的组织角色 | 影响有条件通过 | Step 13 固定必填 acceptor，具体姓名待真实验收填写 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| S/A/B/R 与 VETO 关系清楚 | 通过 | 见 §8.1~§8.2 |
| 复验矩阵和关闭证据可执行 | 通过 | 见 §8.3~§8.4 |
| 三值放行条件明确 | 通过 | 见 §8.5 |
| 风险接受不覆盖 VETO/S | 通过 | 留给 Step 13 细化 |
| 可进入 Step 13 | 允许 | 定义风险接受与遗留项 |
