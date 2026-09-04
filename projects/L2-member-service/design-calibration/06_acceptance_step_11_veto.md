# Step 11. 定义一票否决项 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节：`06-验收标准.md` §11 一票否决项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 一票否决项 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | `00-需求文档.md` §14.6 VF-MS-001~009；Step 6、8、9、10；`05-测试方案.md` §11、§13、§14 |
| 输出文件 | `design-calibration/06_acceptance_step_11_veto.md` |
| 真实执行状态 | 未执行；未生成 VETO checklist、defect、verdict 或 signoff |
| gate_status | `pass_with_upstream_blockers` |
| gate_reason | 9 个需求级 VF 均已映射到正式红线、检查证据、report path 和不可风险接受口径；真实触发状态须由未来 run 裁决 |
| next_allowed_action | 进入 Step 12，定义缺陷分级、复验与放行规则 |

### 1.1 Step 内计划

- [x] 读取需求一票否决项、架构红线、状态 / 一致性和证据门禁。
- [x] 为每个 VF 固定检查方式、正式 EV 和 report 入口。
- [x] 区分 VETO 命中、证据不可裁决和普通 residual。
- [x] 固定不可风险接受与复验触发口径。
- [x] 完成 VETO 停审和跨覆盖审计。

## 2. 本步目标

本步把 `VF-MS-001~009` 转成可检查、不可被风险接受覆盖的一票否决门禁。VETO 是验收裁决，不是测试结果：VETO 只有在真实证据、缺陷或报告审查中确认命中时才成立；证据缺失或无法核验时是 `not_evaluable` / 暂停，不得被当作“未触发”。

本步不增加新的需求级 VF，也不把 P1/P2 质量偏好、无 authority 的性能数字或 sibling 未闭合的正向集成误写成 VETO。为便于正式 §11 阅读，定义 `VETO-MS-001~009` 作为 acceptance alias，分别一对一映射 `VF-MS-001~009`；唯一规范来源仍是 `00` 的 VF。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 9 个需求级 VF | `00-需求文档.md` §14.6 | 固定否决条件的唯一需求来源 |
| 数据 / 架构红线 | `01` owner / dependency；Step 6 | 固定 owner、body、依赖和 no-bypass 检查 |
| 状态 / 事务 / 幂等 | `03` §9~§12；Step 8 | 固定 second current、unknown、Query / Job repair 红线 |
| NFR / 证据门禁 | Step 9、Step 10；`05` §13 | 固定 redaction、report、artifact 和 evidence honesty 检查 |
| 缺陷规则 | `05` §11、§14 | 固定 VETO → S 级和复验边界 |

## 4. SOP 问题回答

| 问题 | 回答 | 裁决依据 |
|---|---|---|
| 哪些失败直接导致不通过？ | 任一 VF-MS-001~009 命中；包括核心闭环断裂、主语越权、owner truth 反写、required seam fail-open、forbidden body、重复 / unknown 盲重放、结果层级升格、依赖伪装和证据伪造。 | `00` §14.6 |
| 每个 VETO 来自哪个红线？ | 每项均回指 `00` 的 VF，并列出对应 BR / D / NFR、`03` 不变量或 `05` 证据规则；不从测试意见临时新增。 | §8.1 |
| VETO 如何检查？ | 以固定 TC 族、14 个 P0 EV 实例、raw artifact、run report、redaction / dependency / report audit 和 `reports/acceptance/veto-checklist.md` 交叉检查。 | Step 10；`05` §13 |
| 缺证据是否等于 VETO？ | 不直接等同。缺证据使相关 AC / VETO `not_evaluable`，验收暂停或不通过；不得写成“VETO 未触发”。若缺证据被故意伪装为 passed，则命中 VF-MS-009。 | Step 10；`05` §13.8 |
| VETO 是否允许风险接受？ | 不允许。命中 VETO 或其检查不可裁决时，不能用 risk acceptance、P1 residual 或口头确认覆盖。 | 06 书写规范 §5.11、§5.13 |
| VETO 是否可降级为 A/B/R？ | 不可。VETO 命中固定为 S 级阻断；只有经修复、影响分析和新固定 run 证明未再命中，才可关闭。 | `05` §11 |
| pending sibling 正向未完成是否自动触发 VETO？ | 不自动触发。只要本仓安全接缝、blocked / waiting / unknown 和 no-fallback 证据真实，正向能力可作为 residual；把 pending 伪装成 ready 或 passed 才命中 VF-MS-004/009。 | `00` §14.7；Step 10 |
| 性能没有 authority 是否触发 VETO？ | 无 authority 的数值不作为 VETO。缺少必需的结构性 sample 或借无来源数字宣告达标，分别进入不可裁决或 VF-MS-009。 | Step 9；`00` NFR-MS-001~003 |
| 一个失败可否同时命中多个 VETO？ | 可以。记录 primary VETO 与所有 affected VETO，不能通过只归档其中一项来降低影响。 | `05` §11、§14 |
| 如何处理 unknown / late / duplicate？ | 按正式 key、generation、revision 和 disposition 检查；任何盲重放、第二 current 或历史抹写命中 VF-MS-006；正确保留 unknown / gap 不命中。 | `03` §9、§12；Step 8 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 `06` | 否决项围绕旧主线，缺少新版 Host Truth / project scope / handoff 红线。 | 完全按 `VF-MS-001~009` 重建，不继承旧主语。 |
| Step 6 | 红线只写“可能触发”，未固定触发后结论。 | 每项固定命中即不通过、不可风险接受，并绑定 S 级复验。 |
| Step 10 | evidence integrity 与 VETO 关系容易被静态表覆盖。 | VF-MS-009 覆盖伪造 / 静态 passed；缺证据本身标 `not_evaluable`。 |
| 证据编号 | 早期材料出现未固定的 SESSION/HEALTH/CLOSURE/BOUNDARY 实例。 | 本步只引用 `05 §13.2` 的固定 EV；逻辑主题不创建新的 evidence instance。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| VETO 分母 | 需求红线与测试 gate 混在一起 | `VF-MS-001~009` 唯一需求分母，`VETO-MS-001~009` 仅作一对一阅读 alias | 防止重复或扩张 |
| 缺证据 | 容易写成未触发 | `not_evaluable` / 暂停；伪造才命中 VF-MS-009 | 保持证据诚实 |
| 正向 blocker | 可能被误判为产品失败 | 保留 blocked / waiting / residual；伪 ready 才否决 | 对齐跨项目边界 |
| VETO 处理 | 可被风险接受或降级 | 命中即不通过、S 级、不可风险接受 | 硬门禁生效 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否新增 evidence / performance VETO 编号？ | A. 扩充分母；B. 将其作为 VF-MS-004/005/009 的检查条件 | 采用 B；不扩充 `VF-MS-001~009`。 |
| 缺 raw artifact 时如何裁决？ | A. 默认未触发；B. `not_evaluable`，暂停或不通过 | 采用 B。 |
| VETO 是否能由风险接受覆盖？ | A. 可以；B. 不可以 | 采用 B。 |
| pending sibling positive 是否直接否决？ | A. 是；B. 只限制正向结论，伪装 ready 才否决 | 采用 B。 |
| VETO 命中是否只修复单用例？ | A. 单用例；B. 原 TC、同族、blocking suite、审计和相关 AC/VF 全量复验 | 采用 B。 |

## 8. 结构化中间产物

### 8.1 VETO 闭环表

| VETO alias | 规范 VF 来源 | 一票否决条件 | 检查证据 / report | 命中后裁决 | 风险接受 |
|---|---|---|---|---|---|
| `VETO-MS-001` | `VF-MS-001` | C-MS-1~5 任一核心节点缺失，却宣告核心闭环或实现 ready | `EV-MS-CORE-001`、`EV-MS-CMD-001`、`reports/runs/<run_id>/suites/release-main-smoke.md` | 不通过；S 级；重跑核心主链 | 不可 |
| `VETO-MS-002` | `VF-MS-002` | 非项目主语、无正式 actor、越权或 Query / signal 隐式创建、启动、停止、重启或迁移宿主 | `EV-MS-CONTRACT-001`、`EV-MS-CMD-001`、`EV-MS-DOMAIN-001`；service-flow report | 不通过；S 级；修复主语 / scope 后复验 | 不可 |
| `VETO-MS-003` | `VF-MS-003` | 本仓创建、修改或反推 Identity、Work、Member、Runtime、Images、Tools、Sandbox、Governance、Observability 或基础设施 owner truth | `EV-MS-DOMAIN-001`、`EV-MS-REDACTION-001`、`EV-MS-ARCH-001`；redaction / dependency report | 不通过；S 级；清除越界写源并复验 | 不可 |
| `VETO-MS-004` | `VF-MS-004` | required pinned asset、credential、binding、授权或正向 seam 缺失 / unknown 时 default allow、host fallback 或声明 Ready | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001`、`EV-MS-CMD-001`；config / service reports | 不通过；S 级；补齐拒绝 / blocked / unknown 语义后复验 | 不可 |
| `VETO-MS-005` | `VF-MS-005` | secret、credential、外部正文、manifest、endpoint、evidence / report body 进入 truth、输出或证据材料 | `EV-MS-REDACTION-001`、`reports/runs/<run_id>/redaction-check.md` | 不通过；S 级；停止泄漏并全范围扫描 | 不可 |
| `VETO-MS-006` | `VF-MS-006` | duplicate、concurrent、late、replay 或 unknown 形成第二 current / session、盲重放不可逆动作或历史抹写 | `EV-MS-IDEMP-001`、`EV-MS-CONSUMER-001`、`EV-MS-CMD-001`；service / replay report | 不通过；S 级；保留原 key / generation 并重验 | 不可 |
| `VETO-MS-007` | `VF-MS-007` | partial、attempt、receipt、timeout、snapshot 或 local association 被写成整体 Ready、external cleanup completed、delivered、observed 或 accepted | `EV-MS-MATERIAL-001`、`EV-MS-JOB-001`、`EV-MS-QUERY-001`；operations / service report | 不通过；S 级；恢复四层独立性并复验 | 不可 |
| `VETO-MS-008` | `VF-MS-008` | 非 Core / SDK sibling 成为源码依赖，或 runtime / event / ref / adapter 被伪装成 compile seam | `EV-MS-ARCH-001`、`reports/runs/<run_id>/dependency-boundary.md` | 不通过；S 级；修正依赖图和构建边界 | 不可 |
| `VETO-MS-009` | `VF-MS-009` | planned / blocked / waiting / not_run / placeholder / fake-qualified 被伪装成真实 artifact、report、evidence、verdict、signoff、readiness 或通过 | `EV-MS-REPORT-001`、`EV-MS-CONFIG-001`、`EV-MS-REDACTION-001`；report-audit / config / redaction report | 不通过；S 级；保留原始材料并重建固定 run | 不可 |

### 8.2 VETO 检查与证据矩阵

| 检查项 | 必须读取 | 通过含义 | 不通过含义 |
|---|---|---|---|
| VF 来源 | `00 §14.6`、对应 BR/D/NFR | 规则文本与当前 AC / 设计契约一致 | 出现未来源或扩大解释 |
| 真实 EV | `reports/runs/<run_id>/evidence-index.md` + 14 个固定 EV | EV 有真实 status、TC、artifact、report、digest | 缺 EV、orphan、静态生成或跨 run 拼接 |
| raw/report pairing | `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` | 失败、部分、不可用均保留原始材料 | 删除失败材料、手写补 passed |
| hard scan | redaction / dependency / report-audit | 检查范围完整且 clean | scan failed、范围遗漏或结果被忽略 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 每项有真实依据和结论 | 默认全 passed 或缺来源 |
| 缺陷关联 | `open-issues.md` / defect record | 命中转 S，关闭需 fixed run | VETO 被降级、无复验或无原始失败 run |

### 8.3 VETO 状态转换

```text
candidate / planned
        |
        v
not_evaluable  <--- missing raw/report/digest or unresolved contract
        |
        +--> triggered ----> S defect ----> 不通过
        |
        +--> not_triggered (only after real evidence review)
```

关键说明：

- 图表达 VETO 从候选到真实检查结论的状态关系，不代表当前已有运行结果。
- `not_evaluable` 不是 `not_triggered`，也不是通过；它要求暂停或补齐证据。
- `VETO-MS-*` 是本文件阅读 alias，实际证据仍使用 `EV-MS-*` 和 `VF-MS-*`。

### 8.4 一票否决项停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| VF-MS-001~009 分母稳定 | 通过 | 未新增需求级 VF；VETO alias 一对一映射 |
| 每项有正式来源 | 通过 | 回指 `00 §14.6` 和对应设计 / 测试契约 |
| 每项有 EV / report 入口 | 通过（计划层） | 只引用 `05 §13.2` 固定实例；真实 status 待执行 |
| VETO 与 S 级一致 | 通过 | 命中即不通过，不得降级 |
| VETO 与风险接受隔离 | 通过 | Step 13 只能接受 B/R 或严格受限 A，不得接受 VETO |
| 缺证据的处理 | 通过 | `not_evaluable` / 暂停，不默认未触发 |
| 当前真实触发状态 | 未执行 | 无 checklist、run、defect 或 verdict |

### 8.5 跨 VETO 覆盖审计表

| 审计项 | 结论 | 后续要求 |
|---|---|---|
| P0 核心闭环覆盖 | 已覆盖 | VETO-MS-001 连接 AC-MS-001~005 和 release smoke |
| 主语 / owner / body 覆盖 | 已覆盖 | VETO-MS-002~005 连接 Step 6 红线 |
| duplicate / result-layer 覆盖 | 已覆盖 | VETO-MS-006~007 连接 Step 8 |
| dependency 覆盖 | 已覆盖 | VETO-MS-008 连接 ARCH report |
| evidence honesty 覆盖 | 已覆盖 | VETO-MS-009 连接 Step 10 report audit |
| P1/P2 越界 | 未发现 | P1/P2 只有伪装为 P0 或破坏红线时才触发 |
| 风险接受冲突 | 未发现 | Step 13 必须保留不可接受清单 |

## 9. 回填草稿

正式 §11 应固定 `VETO-MS-001~009` 与 `VF-MS-001~009` 一对一关系：任一 VETO 命中时总体结论只能为“不通过”，并创建 S 级缺陷；VETO 不得被风险接受、P1/P2 residual 或人工口头确认覆盖。缺少 raw artifact、report、digest 或上游 exact contract 时，状态为 `not_evaluable`，必须暂停或补证据；只有真实 evidence review 后才能判定 `not_triggered`。`reports/acceptance/veto-checklist.md` 不得默认全 passed。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| VETO checklist 的实际生成脚本 | 影响执行便利性 | 由实施 / 测试计划承接；06 只固定输入、输出和审查规则 |
| 上游 exact contract | 影响部分正向检查 | `MSVC-UP-001~008` 继续 blocked / waiting；只验安全接缝和伪 ready |
| 缺陷系统 ID 规则 | 影响复验索引 | Step 12 固定 S/A/B/R 语义，具体工具 ID 待实施阶段确定 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每个 VF 有正式来源和明确触发条件 | 通过 | 见 §8.1 |
| 每个 VETO 有 EV / report 检查入口 | 通过（计划层） | 见 §8.2 |
| VETO 不可风险接受且命中转 S | 通过 | 见 §8.4 |
| 缺证据不默认未触发 | 通过 | 见 §8.3 |
| 跨 VETO 覆盖无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 12 | 允许 | 定义缺陷、复验与放行规则 |
