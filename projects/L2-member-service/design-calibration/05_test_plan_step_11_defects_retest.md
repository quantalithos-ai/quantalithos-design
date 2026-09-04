# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节：`05-测试方案.md` §11

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 缺陷管理与复验 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 一票否决红线不可降级；修复必须有针对性复验和真实证据 |
| 停审结论 | S/A/B/R 分级、升级与复验可执行；不填写实际缺陷状态 |

## 2. 缺陷分级

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 破坏 VF-MS 或核心 truth / safety boundary | 非项目主语创建 host；required binding 缺失仍 ready；外部正文/secret 泄漏；Query/Job 反写真相；duplicate 盲重放 | 立即阻断；修复设计/实现并全量 P0 复验；不得风险接受替代 | 是 |
| A | P0 主线或一致性严重缺陷但未直接触发永久红线 | accepted command 漏 sidecar、old generation 覆盖 marker、UoW rollback 泄漏、publisher snapshot 可变 | 修复后相关 suite + release smoke 通过；需要 owner 复核 | 是，直到复验 |
| B | 非核心功能或可解释的局部质量缺陷 | safe view 非关键排序、非阻断诊断字段、P1 controlled seam 映射缺口 | 建立 issue、限定修复窗口；不得影响 P0 证据 | 否 |
| R | 设计 / 外部合同未闭合导致的 residual/blocker | MSVC-UP-001~008 正向联调 unavailable、性能 authority 缺失、真实产品未选 | 标记 blocked/waiting/unavailable，指定 owner 和触发条件；不得写成 defect fixed 或 pass | 视其是否涉及当前 P0；正向外部路径通常阻断对应验收 |

## 3. S 级阻断判定

以下任一条件必须判为 S，不得通过改名、静态报告或人工说明降级：

- `VF-MS-001~009` 任一条件被违反。
- Host Truth、external owner truth、attempt、receipt、delivery、observed、accepted 或 projection 语义混层。
- ProjectMemberRef / GlobalMemberRef / scope / authorization 边界被绕过。
- forbidden body、secret、manifest、endpoint、stack 或外部正文进入任一 public/output/evidence 面。
- duplicate、concurrent、late、unknown 导致第二 current host、第二 active session、第二不可逆 effect 或历史抹写。
- 证据静态伪造、缺 raw artifact/report、orphan EV 或失败 suite 被手写为通过。

## 4. 复验矩阵

| 缺陷区域 | 必须重跑的最小用例 | 是否需要全量 P0 | 额外证据 |
|---|---|---|---|
| subject / control / decision | `TC-INTENT-*`、`TC-DECISION-*`、`TC-IDEMP-001~003` | 是，若影响 owner / state | core + command evidence |
| qualification / assembly / readiness | `TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-DOMAIN-003`、`TC-CONFIG-*` | 是，若影响 no-bypass | assembly + config evidence |
| registration / session | `TC-REG-*`、`TC-SESSION-*`、`TC-CONSUMER-002`、`TC-IDEMP-007` | 是，若影响 generation/single-active | session + recovery evidence |
| health / recovery | `TC-STATE-*` health、`TC-RECOVERY-*`、`TC-IDEMP-005~008` | 是 | health + recovery evidence |
| closure / cleanup / reconciliation | `TC-CLOSE-*`、`TC-JOB-003/004/007` | 是，若影响 external completion layering | closure + handoff evidence |
| material / outbox / projection | `TC-MATERIAL-*`、`TC-JOB-005/006`、`TC-IDEMP-009/010` | 是 | outbox/projection evidence |
| query no-write / job no-repair | `TC-QUERY-001~006`、`TC-QUERY-NEG-001`、`TC-JOB-NEG-001` | 是 | write-audit evidence |
| config / redaction / dependency | `TC-CONFIG-*`、`TC-REDACTION-*`、`TC-ARCH-001` | 是 | config/redaction/arch evidence |
| report / evidence integrity | `TC-REPORT-*` or report audit checks | 是 | report-audit evidence |

## 5. 复验与关闭规则

1. 缺陷记录必须引用原始 suite、case、`run_id`、artifact path、report path 和 safe failure reason；不得只引用截图或聊天结论。
2. 修复后先重跑最小相关 suite，再按影响范围扩展到全量 P0；涉及 static boundary、schema、UoW、state 或 redaction 的修复默认触发全量 P0。
3. 若原失败属于 `MSVC-UP` 或产品未锁定，不得标记“修复”；应转为 R 级 blocked/waiting，并保留 unavailable evidence。
4. 同一缺陷重新出现时保留原缺陷关联，不覆盖历史；新 run 产生新的 artifact/report/evidence 实例。
5. 关闭缺陷必须同时具备：复验 suite 结果、raw artifact、run report、evidence index 更新、受影响 AC/VF 追溯和 reviewer note（若需）。
6. 任何 S 级缺陷、forbidden output、静态证据造假或 owner truth 越界不得风险接受。

## 6. 自动化防回归规则

| 规则 | 触发变更 | 防回归入口 |
|---|---|---|
| no implicit host | subject / intent / lifecycle 变更 | `TC-INTENT-*` + `TC-ARCH-001` |
| no fallback readiness | qualification / binding / config 变更 | `TC-QUAL-*` + `TC-ASSEMBLY-*` + `TC-CONFIG-004~006` |
| no runtime truth | session / mapper 变更 | `TC-SESSION-*` + redaction scan |
| generation / key fence | host / attempt / feedback 变更 | `TC-STATE-003` + `TC-IDEMP-007/008` |
| query/job no-write | read / job / projection 变更 | `TC-QUERY-NEG-001` + `TC-JOB-NEG-001` |
| immutable material | history/material/outbox 变更 | `TC-MATERIAL-001` + `TC-JOB-005` |
| no forbidden output | contracts/log/report/config 变更 | `TC-REDACTION-*` + `redaction-boundary` |
| evidence authenticity | gate/report scripts 变更 | report-audit checks |

## 7. 缺陷停审与回填草稿

| 审计项 | 结论 |
|---|---|
| S 级红线不可降级 | pass |
| A 级有明确复验 | pass |
| R 级 blocker 不伪装 defect fixed | pass |
| 关闭需要真实 artifact/report | pass |

正式 §11 应写 S/A/B/R 分级、S 级阻断、复验矩阵、关闭证据和防回归规则；不填写实际 issue、缺陷数量或修复结果。

- [x] 缺陷分级可判定。
- [x] 复验范围可追溯。
- [x] 可进入 Step 12。
