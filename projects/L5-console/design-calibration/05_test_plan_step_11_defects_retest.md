# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节：`05-测试方案.md` §11
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_11_defects_retest.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 定义 Console planned test 发现的问题如何分级、阻断、复验和关闭。缺陷记录、run、artifact、report、evidence 都是未来执行产物；本轮不创建缺陷系统、不填写真实状态、不生成修复结果。S/A/B/R 是测试管理分类，不是业务状态，也不改变 owner truth。

## 2. 输入与 Console 专属规则

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §13～§14 | NFR、AC、七项 `VETO-CON-*` 与不可接受红线 |
| Step 5～10 | traceability、96 TC、数据、环境、suite、专项和 candidate/residual |
| `03-详细设计.md` §7～§15 | 5 Command/16 Query/consumer、state、no-write、错误、并发、诊断和架构边界 |
| `04-配置设计.md` §9～§11 | strict/fail-fast/fail-closed/disabled/partial 失败语义 |
| Step 9 planned paths | future suite、check、artifact/report pairing 和 no-static-evidence |

缺陷不得把 UI 结果、诊断 sink、local state、静态扫描或 report candidate解释为 owner acceptance、audit、evidence、verdict 或 readiness。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些是 S 级阻断？ | 任一 `VETO-CON-001～007` 命中；SDK/private boundary 绕过；Query 写入或唯一 owner write 约束破坏；forbidden body/secret 泄露；unknown 自动 replay；局部 owner failure 被掩盖；配置 silent fallback/partial protected runtime；redaction、dependency、artifact/report pairing 或 static-evidence check 失守，均为 S。 |
| 哪些可风险接受？ | 只有 P1/P2 selected unavailable、无 authority 的量化 sample、具体浏览器/AT 矩阵、未来真实 owner adapter、非核心可读性和范围外能力；必须进入 residual 并指定角色待确认。P0 safety、VETO、redaction、dependency、config fail-fast、evidence integrity 不可接受。 |
| 修复后跑什么？ | 原失败 TC + 同 family 的正/负/partial/no-write 代表 + 受影响 suite + 邻接红线 check；协议、状态、配置、redaction、依赖或 evidence 结构变更触发全量 P0。 |
| 关闭需什么？ | 未来固定 run 的失败/修复前后 artifact/report、TC/suite 关系、影响说明、复验结果、redaction/dependency/pairing check（相关时）和防回归决定；没有真实执行就不能关闭为 passed。 |
| 何时新增自动化？ | 手工发现 P0、release smoke 发现底层未覆盖、redaction/dependency/report audit 漏检、重复/late/unknown 复现或 P1 升级 P0 时，必须新增/下沉 deterministic assertion 或 check。 |

## 4. 缺陷分级表

| 级别 | 定义 | Console 示例 | 处理 | 阻断 |
|---|---|---|---|---|
| S | VETO/P0 safety、truth boundary、redaction、dependency、config fail-closed 或证据真实性破坏 | Query 写 carrier；route 产生 qualification；raw body 进入 artifact；unknown replay；静态 JSON 宣告 EV；production-pending 装配 fake | 必须修复；全量相关 suite/check；不可风险接受 | 是 |
| A | P0 suite/flow 失败但未命中 S，或实现/runner 使安全语义无法稳定证明 | 某 topic canonical order 错；recovery ceiling 断言不稳定；report 字段缺失但 raw boundary intact | 修复；测试负责人可在不影响 P0 的证明下临时接受，release 通常阻断 | 视影响 |
| B | 非 P0、局部可读性/维护性或 selected 流程问题 | P1 browser matrix unavailable；报告叙述不清但可追溯 | 排期或风险接受 | 否 |
| R | 已知范围外/未来 authority 风险 | production capacity、真实 owner adapter 深度、长期 retention | residual + 接受角色/待确认 | 否 |

## 5. S 级不可降级矩阵

| 触发 | 依据 | 判定 |
|---|---|---|
| 任何 `VETO-CON-001～007` | `00` §14 | S |
| DB/repository/private bus/BFF/owner source/sibling import 或第二 truth | `01/03` boundary | S |
| context/visibility/qualification invalid 仍披露或 submit | C-CON-1/2; NFR-CON-004/009 | S |
| receipt/toast/cache/diagnostic→confirmed/active/ready 或 unknown replay | C-CON-4; NFR-CON-014 | S |
| forbidden body/secret/full ref 进入 object/state/diagnostic/artifact/report | NFR-CON-008/012; 04 redaction | S |
| Query/diagnostic/event side path 改写 owner/local truth | 03 §8～§15 | S |
| partial/empty/failed partition 被合成为 normal/readiness/verdict | C-CON-3/5/6 | S |
| invalid config silent fallback、profile isolation violation、partial protected runtime | 04 §5/9/11 | S |
| raw artifact/report 缺失、run mismatch、静态 evidence/VETO pass | Step 9/13 planned checks | S |

## 6. 复验触发矩阵

| 变更/缺陷面 | 原失败与同 family | 受影响 suite/check | 全量 P0 触发 |
|---|---|---|---|
| context/access/visibility/navigation | `TC-CTX-*`、`TC-NAV-*`、`TC-SEC-001/004` | `console-module-flow`、`console-pure-contract`、semantic a11y | 语境/资格/披露语义改变时 |
| views/Query/no-write | `TC-VIEW-*`、代表 16 Query | `console-module-flow`、`console-port-adapter`、redaction | Query surface、owner write或safe-field改变时 |
| Command/result/reconcile | `TC-INTENT-*`、`TC-CONSISTENCY-004～007` | flow、port-adapter、concurrency、release smoke | command/result/unknown/submit语义改变时 |
| topic partition/activation | `TC-TOPIC-*`、`TC-SEC-005` | controlled-composition、recovery、release safety | owner partition/activation contract改变时 |
| state/carrier | `TC-STATE-*`、`TC-CONSISTENCY-001/002/006/007` | pure-contract、concurrency、controlled-composition | medium/scope/TTL/whole-record语义改变时 |
| error/recovery/a11y | `TC-RECOVERY-*`、`TC-A11Y-*` | recovery-matrix、semantic-a11y、redaction | recovery ceiling、error union或核心 a11y改变时 |
| config/binding | `TC-CONFIG-*`、`TC-ADAPTER-004/005` | config-redline、architecture、release config | 四项 schema/profile/failure改变时 |
| diagnostics/redaction | `TC-DIAG-*`、`TC-SEC-002/003` | redaction、report audit、release redaction | candidate fields/sink/report scan改变时 |
| architecture/protocol count | `TC-ARCH-*` | architecture-static、dependency/report audit | module/protocol/dependency/owner write改变时 |
| gate/report/evidence tooling | representative affected TC | report-pairing、no-static-evidence、release audit | artifact schema、EV derivation或blocking分类改变时 |

## 7. 缺陷关闭证据（future contract）

| 关闭输入 | S | A | B/R |
|---|---|---|---|
| 缺陷记录、影响面、原始 TC/suite | 必需 | 必需 | 必需 |
| 失败 run_id、artifact/report ref | 必需（执行后） | 必需（执行后） | 有执行才需 |
| 修复说明与设计回写引用 | 必需 | 必需 | 变更相关时 |
| 修复后 suite/check report | 必需 | 必需 | 可选 |
| redaction/dependency/pairing check | 相关时必需；安全/证据类必需 | 相关时必需 | 可选 |
| 新增防回归断言或无新增理由 | 必需 | 必需 | 可选 |
| 风险接受人 | 不允许 | 接受时必需 | 必需 |

所有路径必须遵循 `artifacts/test/<run_id>/` 和 `reports/runs/<run_id>/`；Step 13 再定义正式 EV 归档，不能以本表静态关闭证据。

## 8. 自动化防回归规则与停审

| 触发 | 要求 |
|---|---|
| 手工或 release 发现 P0 | 将断言下沉到最小可重复 suite，补充 TC/future candidate 映射 |
| redaction 漏检 | 扩展 isolated leak corpus、deny rules 和 release scan |
| dependency 漏检 | 扩展 generated graph/static check |
| report/evidence pairing 漏检 | 扩展 pairing/no-static-evidence check，并跑受影响 suite |
| duplicate/late/unknown 复现 | 增加 deterministic scheduler/call-ledger case |
| P1/P2 升级 P0 | 先回写 Step 2/8/9/10、环境和 gate，再新增自动化 |

跨缺陷审计：S 级不可风险接受；P1/P2 unavailable 不计 P0 pass；无正式性能阈值不产生 S/A；所有 P0 复验均要求原 TC、同 family、相关 gate/check 和 future run-bound evidence。结论 `pass` 仅是设计规则审查，不是测试 verdict。

## 9. 回填草稿与门禁

正式 §11 应回填 S/A/B/R 分级、S 级不可降级矩阵、复验触发、关闭证据和自动化防回归规则。

> 校准来源：`design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读：建议继续阅读本文件的“缺陷分级表”“S 级不可降级矩阵”“复验触发矩阵”“缺陷关闭证据”和“自动化防回归规则”。

| 进入 Step 12 条件 | 结论 |
|---|---|
| 缺陷分级可判定 | pass |
| P0/VETO/redaction/dependency/evidence 不可风险接受 | pass |
| 复验覆盖原 TC、同 family、suite/check | pass |
| 关闭证据和防回归可执行 | pass |

Step 11 `done / pass / self_reviewed`；未创建缺陷、未执行复验、未生成 artifact/report/evidence 或 verdict。
