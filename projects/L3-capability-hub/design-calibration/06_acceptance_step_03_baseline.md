# L3-capability-hub 06 验收标准 Step 3: 固定验收基线

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/验收标准书写规范.md` §5.3
> 回填章节: `06-验收标准.md` §3
> Step 状态: `completed-designed / continuous execution`
> 日期: 2026-07-26

## 1. Step 状态、目标与输出

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 输入 | Step 1 输入边界、Step 2 范围、正式 `00`~`05`、对应 SOP/书写规范 |
| 输出 | 本文件的基线矩阵、路径合同、变更规则和正式 §3 回填草稿 |
| 当前状态 | `completed-designed`; 未建立任何真实送验事实 |
| 正式文档 | 正式 `06-验收标准.md` 仍保持 historical material，直到 Step 15 整体装配 |
| 下一步 | Step 4 定义进入条件与退出条件 |

本 Step 固定“未来验收必须绑定什么”，不把设计期已有的文件计为执行证据。`commit`、build、image digest、config digest、environment readiness、`run_id`、artifact、report、evidence instance、review、risk decision 和 signature 当前均为未建立状态。

## 2. 本步输入与权威顺序

| 输入 | 权威用途 | 本 Step 读取结论 |
|---|---|---|
| `00-需求文档.md` | 需求、边界、37 AC、13 VF、非功能与禁止责任 | active formal requirement |
| `01-架构设计.md` | bounded ownership、依赖方向、数据/安全红线 | active formal architecture |
| `02-概要设计.md` | 组件、对象、接口、流程、状态骨架 | active formal HLD |
| `03-详细设计.md` | 字段级对象、250 protocols、36 Ports、83 flows、24/111/638 states、TX/BIND/OBS | exact implementation contract |
| `04-配置设计.md` | strict source、3 profiles、entries、catalog、binding、activation/failure | exact configuration contract |
| `05-测试方案.md` | 189 TC/DS/EV、10 suites、5 gates、9 checks、4 builders、固定路径 | exact test/evidence contract |
| `06_acceptance_step_01_input_boundary.md` | acceptance authority and must-answer/non-answer | upstream acceptance boundary |
| `06_acceptance_step_02_scope.md` | P0 semantic、P1 selected、R4 release、P2 operations | upstream acceptance scope |
| standards | 15-Step sequence、基线字段、路径与真实性规则 | governing process |

旧正式 `06-验收标准.md`、旧 README 和任何 restart 前版本只用于 historical diagnosis，不得提供 active baseline value。

## 3. SOP 问题回答

| SOP 问题 | L3-capability-hub 固定回答 |
|---|---|
| 按哪一版需求和设计验收？ | 按本轮 active formal `00`、`01`、`02`、`03`、`04`、`05`，并在送验 manifest 中分别记录 source ref 或 design commit。不能只引用 `02/03/05` 摘要。 |
| 按哪一版测试方案和测试结果裁决？ | 按当前 `05-测试方案.md` 的 189 个 canonical TC/DS/EV contract；结果必须属于一个显式 `run_id`，并由同 run raw artifact、run report、check report 和 acceptance handoff 推导。 |
| 送验 build / commit / image 是什么？ | 当前没有送验交付物。未来必须同时固定 implementation source revision、build identifier、必要时 image digest，以及 `L0-core`/core-contracts source ref；任何字段缺失都不能进入正式验收。 |
| 环境、配置、数据和依赖是什么？ | P0 使用 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的明确定义 profile；每次 run 固定 profile、entry、config digest、fixture/replay root、dependency boundary 和 run namespace。选定真实产品只属于 P1 或 R4 manifest。 |
| 基线变化如何处理？ | 影响 AC/VF、设计契约、TC/DS/EV、config graph、suite/check/report schema 或责任边界的变化，必须按 `05` §14 选择受影响回归或完整 R2，并建立新 `run_id`；旧 run 不得被覆盖或改写。 |
| 本轮固定的 `run_id` 是什么？ | 设计阶段没有真实值。正式验收前必须分配唯一、非 `latest`、不可复用的 run ID，并写入 baseline manifest、raw root、report root、evidence index 和 acceptance handoff。 |
| raw evidence 放在哪里？ | 固定为 `artifacts/test/<run_id>/...`，禁止项目名二级嵌套、临时路径和 `latest` 别名。 |
| 人类可读报告放在哪里？ | 固定为 `reports/runs/<run_id>/...`，必须从该 run 的 raw artifact 生成并保留 digest pairing。 |
| acceptance handoff 放在哪里？ | 固定为 `reports/acceptance/`，至少包含 `handoff.md`、`veto-checklist.md`、`open-issues.md`；有条件通过候选才允许生成并审查 `risk-acceptance.md`。 |
| 是否存在非法基线引用？ | 存在。`latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、无 digest 的 report、静态 pass JSON、泛化 test/staging 名称和跨 run 拼接均无效。 |

## 4. 旧材料诊断与处置

| 旧材料 | 冲突 | 处置 |
|---|---|---|
| 旧 `06` 的“当前文档批次”表述 | 未绑定本轮 active source refs | 不迁移；由本 Step 的 source matrix 替代 |
| 旧 `06` 的 test/staging、PG、bus、KMS/Vault 组合 | 未选择产品且可能吸收外部 owner | 仅保留 historical；P0 使用正式 profile 和 adapter kind |
| 旧的 API/DB/log/model-review 证据词 | 没有 TC/DS/EV、run、digest、pairing | 替换为 `EV-CH-*` contract 与同 run instance predicate |
| 旧 P95、30s、100% 等数字 | 已被当前 formal 00/05 标记为未评估或不适用 | 禁止重新进入 numeric verdict；只保留结构性 gate |
| 旧“空白签署”单元格 | 可能被误读为待签署或默认通过 | 只在 Step 14 定义 schema；不填任何人、时间或签名 |
| 旧 Provider/MCP/A2A/approval/cost 主语 | 越过 Hub identity/registry/descriptor/seam/relation/exposure ownership | 不改名迁移；记录为 historical material |

## 5. 验收基线矩阵

### 5.1 文档与标准基线

| 基线类型 | 固定内容 | 送验标识 | 验收用途 | 当前事实 |
|---|---|---|---|---|
| 需求 | `projects/L3-capability-hub/00-需求文档.md` | source ref / design commit | 5 core closures、16 FR、37 BR、20 NFR、37 AC、13 VF | 文件存在；source ref 未固定 |
| 架构 | `projects/L3-capability-hub/01-架构设计.md` | source ref / design commit | ownership、dependency、data/security redlines | 文件存在；source ref 未固定 |
| 概要 | `projects/L3-capability-hub/02-概要设计.md` | source ref / design commit | 8 components、43 objects、interface/flow/state skeleton | 文件存在；source ref 未固定 |
| 详细 | `projects/L3-capability-hub/03-详细设计.md` | source ref / design commit | 7 modules、250 protocols、36 Ports、83 flows、24/111/638 states | 文件存在；source ref 未固定 |
| 配置 | `projects/L3-capability-hub/04-配置设计.md` | source ref / design commit + config digest | 18/27/21 catalog、3 profiles/entries、binding and failure contracts | 文件存在；config digest 未建立 |
| 测试 | `projects/L3-capability-hub/05-测试方案.md` | source ref / design commit | 189 TC/DS/EV、10 suites、5 gates、9 checks、4 builders | contract 已定义；未执行 |
| 标准 | 06 SOP、06 writing standard、truth-source standard、dependency standard | standards source ref | 控制验收生成顺序和真实性 | 已读取；送验 ref 未固定 |

### 5.2 交付、核心依赖和运行基线

| 基线类型 | 必填字段 | 约束 | 当前事实 |
|---|---|---|---|
| implementation source | implementation repository/ref、commit or immutable source revision | 与本次 run 一一绑定 | 未建立 |
| build | build identifier、toolchain/material digest | 不允许只写“构建成功” | 未建立 |
| image/package | image digest 或 package artifact digest（适用时） | tag 不能替代 immutable digest | 未建立 |
| core-contracts | `L0-core`/core-contracts source ref or package version | 只能依赖正式允许的 compile-time surface | 未建立 |
| design source bundle | `00`~`05` source refs + calibration manifest | source 变化触发新 run | 未建立 |
| config | profile、entry、immutable config artifact、config digest | strict source/graph/activation validation | 未建立 |
| environment | environment ID、profile、adapter kinds、toolchain | 每个 run 显式声明，不使用“当前环境” | 未建立 |
| data | DS set、fixture/replay root、seed/snapshot digest、cleanup result | 脱敏、可重复、run-isolated | 未建立 |
| dependency | selected external ref、fake/controlled/disabled kind、dependency-boundary result | 不把外部内部结果写入 Hub acceptance | 未建立 |

### 5.3 Canonical denominator baseline

| 维度 | 固定分母 | 基线要求 |
|---|---:|---|
| canonical test cases | 189 | 11 families，唯一 primary owner，缺失/额外/重复均为 invalid |
| canonical test data | 189 | `TC -> DS -> EV` 一对一 owner chain，DS identity 不因执行环境改变 |
| formal evidence contracts | 189 | `EV-CH-*` 是合同，不是 evidence instance；每个实际 instance 必须 same-run |
| state pair registry | 638 | `239 current + 98 reserved + 301 illegal`，24 families，不能采样 |
| flows | 83 | `26 C + 33 Q + 6 I + 10 O + 8 J`，每条 flow 保留正式名称和 phase/effect oracle |
| suites/gates/checks/builders | 10 / 5 / 9 / 4 | inventory 和 digest 进入 run manifest；check 不增加 EV 分母 |
| acceptance consumers | 37 AC / 13 VF | AC 有 primary owner；VF 全部 non-waivable |

任何分母差异都必须回开对应的 00~05 设计 source；06 不能用裁决文字修复计数。

## 6. 固定 artifact、report 与 acceptance 路径

### 6.1 路径合同

| 入口 | 固定路径 | 必须绑定 | 禁止 |
|---|---|---|---|
| raw artifact root | `artifacts/test/<run_id>/` | explicit run ID、run manifest、artifact digest | `latest`、项目嵌套、跨 run 合并 |
| run report root | `reports/runs/<run_id>/` | 同 run raw root、source/config digest、report digest | `reports/<project>`、手工复制结果 |
| acceptance handoff | `reports/acceptance/handoff.md` | baseline、scope、run、open issues、review refs | 静态“passed”模板 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 13 VF、negative evidence、redaction/dependency checks | 空 checklist 默认通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | eligible residual、authorized acceptor、action、expiry/trigger | 设计期预填姓名或接受结论 |
| open issues | `reports/acceptance/open-issues.md` | defect/retest/residual identity and status | 只写“无问题” |
| review notes | `reports/review/reviewer-notes.md`、`agent-review.md` | review version、source refs、evidence refs | 无 run 的泛化评语 |

### 6.2 Minimum report contents

`reports/runs/<run_id>/` 至少应由未来 report builder 生成：`run-manifest.json`、`summary.md`、`gate-summary.md`、10 suite reports、9 check reports、`evidence-index.md`、`redaction-check.md`、`dependency-boundary.md`、`report-generation-audit.md`，以及对非 pass 结果的 raw artifact 链接。文件名、schema 和 digest 必须来自 `05`，不得在验收阶段另造平行报告格式。

## 7. 基线变化与新 run 规则

| 变化面 | 最低处理 | 是否允许复用旧 run |
|---|---|---|
| `00`~`05` 的 AC/VF、ownership、flow/state/TX/BIND/OBS 契约 | 重新审计受影响 Step；按 `05` 选择 R1/R2/R4 | 否，除非明确证明不影响且由正式流程记录 |
| implementation source/build/image | 新 source/build manifest；至少重跑受影响 suite | 默认否 |
| core-contracts version | 重跑 dependency-boundary、contract/domain 和受影响 suite | 否 |
| profile/entry/config digest | 重跑 config failure、binding、runtime assembly 和 affected suite | 否 |
| fixture/data/replay root | 重建 DS/data digest pairing，受影响 cases 重跑 | 否 |
| suite/gate/check/report builder | 重跑对应 gate 和 report-generation-audit；必要时 R2 | 否 |
| artifact/report/evidence schema | 新 run，重新生成 evidence index | 否 |
| selected P1 product | 更新 selected manifest 和 residual；不改变 P0 denominator | P0 run 不可冒充 selected run |
| acceptance/review content only | 新 review version；不能回写 raw result | raw run 可复用但必须显式引用 |

新 run 必须满足：ID 唯一；raw/report 目录不存在预存内容；source/config/data manifest 在执行前冻结；失败、取消、重试和非 pass artifact 不覆盖；任何跨 run 拼接在 evidence audit 中判定 invalid。

## 8. 非法基线与无效化规则

| 非法引用或状态 | 判定 | 处理 |
|---|---|---|
| `latest` / “当前版本” / “最新报告” | 不可定位 | 阻断进入验收，重新固定 explicit ref |
| `artifacts/test/<project>/<run_id>` | root topology 错误 | 迁移或新 run，不能通过别名解释 |
| `reports/<project>/...` | report root 错误 | 重新生成正式 run report |
| report 没有同 run raw digest | evidence provenance 断裂 | invalid bundle，不能裁决 |
| EV/VF 由静态 JSON 或手工 pass 字段产生 | 非真实 evidence | invalid，必须由 raw 推导 |
| P1 unavailable 被标成 P0 not applicable | scope 污染 | 改为 blocked/selected residual；不能计 P0 pass |
| source/config 在 run 中途变化 | baseline drift | 保留原始材料并使 run invalid；新 run |
| acceptance draft 缺 review/authorization | 不是 verdict 或 risk decision | 保持 `not_evaluated`/`not_decided` |
| numeric threshold 未有 active source | 不可判定数字结论 | 保留 `not_evaluated`，不得继承历史数字 |

## 9. 正式 §3 回填草稿

正式 `06-验收标准.md` §3 只保留以下裁决信息，不复制本 Step 的讨论过程：

1. 验收必须绑定 active formal `00`~`05`、标准 source refs、implementation source/build/image、core-contracts ref、profile/entry/config digest、data/fixture/replay ref。
2. canonical denominator 固定为 `189 TC / 189 DS / 189 EV contracts`、`638 state pairs`、`83 flows`、`10 suites / 5 gates / 9 checks / 4 builders`、`37 AC / 13 VF`。
3. raw artifact 固定为 `artifacts/test/<run_id>`；run report 固定为 `reports/runs/<run_id>`；acceptance/review 固定为 `reports/acceptance/*` 和 `reports/review/*`。
4. `EV-CH-*` 仅是 evidence contract；实际裁决必须使用 explicit same-run instance，不能把设计文件、目录存在或空模板解释为通过。
5. 基线变化必须生成新 run；`latest`、错误 root、无 digest pairing、静态 pass、跨 run 拼接、泛化环境和历史数字均无效。
6. 当前未建立真实交付、环境、run、artifact、report、review、risk decision 或 signature，因此当前不产生 acceptance verdict。

## 10. 待确认事项与当前阻塞

| 待确认事项 | 当前状态 | 影响 |
|---|---|---|
| implementation source/build/image | 未建立 | 正式验收进入条件阻断 |
| core-contracts source ref | 未建立 | dependency-boundary 未完成 |
| profile/entry/config digest | 未建立 | config/binding readiness 未完成 |
| fixture/replay/data digest | 未建立 | DS execution 未完成 |
| explicit `run_id` | 未建立 | 所有 EV instance/report 不能生成 |
| acceptance/review documents | 未建立 | 不能进入结论或风险接受 |
| 上游设计 blocker | 未发现 | 不阻塞继续设计 Steps 4~15 |

这些是 future execution prerequisites，不是当前设计 blocker，也不应被伪造为 failed 或 passed。

## 11. Step 4 进入门禁

| 条件 | 结果 | 依据 |
|---|---|---|
| SOP 十个问题均有闭合回答 | `pass-designed` | §3 |
| 文档/标准/交付/环境/数据基线字段完整 | `pass-designed` | §5 |
| canonical denominator 与上游一致 | `pass-designed` | §5.3 |
| artifact/report/acceptance/review 路径固定 | `pass-designed` | §6 |
| 基线变化和新 run 规则可执行 | `pass-designed` | §7 |
| 非法引用和 invalidation 明确 | `pass-designed` | §8 |
| 未伪造任何执行事实 | `pass-designed` | §1、§10 |
| unresolved upstream blocker | `0` | 当前无 blocker |
| 下一步 | `enter_06_step_04_entry_exit` | 进入 Step 4 |

## 12. 追溯与审计声明

本 Step 回填来源为 `06_acceptance_step_03_baseline.md`。后续 Step 4~14 只能消费本 Step 已固定的 baseline/path/change semantics，不得另行发明 run root、evidence identity、numeric threshold、selected product 或 acceptance role。正式 06 §3 装配前必须保持本 Step 状态为 completed-designed。
