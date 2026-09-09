# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11  
> 回填章节：`05-测试方案.md` §11  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / defect_rules_planned |
| 输入基线 | Step5/6/9/10；00 一票否决；03/04 正式契约 |
| 本步输出 | S/A/B 分级、升级、风险接受、复验、关闭证据与防回归规则 |
| 事实边界 | 未执行测试、未发现或创建真实 defect ID、未关闭任何 blocker |
| 下一动作 | Step12 定义完全可判定的进入/退出/暂停准则 |

## 2. 本步目标与输入

本步定义未来测试失败如何分类、升级、修复、复验和关闭。缺陷严重性描述已观察到的实现或测试系统偏差；`blocked/pending/not_run` 描述前置条件或执行事实不足，两者不得互相冒充。

| 输入 | 本步用途 |
|---|---|
| `00-需求文档.md` §10/§14 | 固定 workspace 一票否决红线 |
| Step5/6 | 固定 59 TC/EV 槽位、14 入口及精确断言 |
| Step9 | 固定 P0 suite/gate、失败/重跑和 planned 输出 |
| Step10 | 固定安全、事务、恢复、资源、观测专项与无数字基线边界 |
| 测试规范 §5.11 | 固定 S/A/B 分级和复验要求 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断？ | 任一一票否决命中；越权/默认展示；Query 写；gap 静默越过；stale 冒 fresh/complete；owner/outbound/archive 反写；owner truth/body/secret 泄漏；generation/cursor 混轴；Unknown 盲重做；fake 或静态证据伪造 readiness；P0 raw/report 被篡改或无法追溯。 |
| 哪些缺陷可风险接受？ | S 不可接受。A 仅能在不命中红线、受影响能力不被宣称可用、固定接受角色与到期/复验条件时临时接受；不得据此满足退出。B 可排期，但若影响 P0 断言、证据真实性或安全则必须升级。既有 external blocker 不是缺陷豁免。 |
| 修复后必须回归哪些用例？ | 原失败 TC + 同族 TC + 共享 CUT 的相邻族 + 受影响 suite/check；安全/契约/事务/配置/报告层变更需扩大至所有消费面，不能只跑单例。 |
| 缺陷关闭需要哪些证据？ | 原失败固定 run 引用（若曾执行）、修复范围、修复后新 run 的 raw case/suite/report、相关 redaction/dependency/integrity check、无回归结论、是否补自动化。没有实现和运行时不得标关闭。 |
| 何时新增自动化？ | 手工或上层发现 P0 而底层未捕获、复发、scanner漏检、边界图漏检、unknown/gap/race未覆盖，均必须下沉或扩展自动化；新增 TC ID 需回到 Step5/6 注册并重审唯一性。 |

## 4. 当前材料问题诊断

| 旧模板问题 | 风险 | 本步修正 |
|---|---|---|
| 用 P0/P1 代替 S/A/B | 测试优先级与缺陷严重性混轴 | 固定 TC 优先级、执行状态、缺陷级别三轴 |
| 只给“原用例+全量回归” | 无法判断扩大范围 | 按 CUT/共享合同映射复验范围 |
| 没有 infrastructure/blocked 区分 | seam 缺失可能被误报 defect 或 pass | blocked 保留 blocker；harness failure 单独分类且仍不通过 |
| 未定义关闭事实 | planned EV 可能被当关闭证据 | 关闭必须来自固定 run 的真实 raw/report，新 run 不覆写旧失败 |
| 没有升级/重开规则 | 低估安全、证据和重复缺陷 | 定义自动升级及相同根因重开 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 分级 | 安全=P0、配置=P1 | S/A/B 依据影响；优先级仍独立 |
| blocker | 与 defect 混写 | external blocker、not_run、harness failure、product defect 分开 |
| 复验 | 宽泛 | 原 TC→同族→CUT→suite/check 的可执行选择 |
| 关闭 | 无最小材料 | 失败前后固定 run/raw/report + 修复与防回归说明 |
| 风险接受 | 未定义角色/边界 | S 禁止；A/B 有条件且不能伪造退出 |

## 6. 缺陷管理设计取舍

| 议题 | 采用方案 | 未采用方案及原因 |
|---|---|---|
| 所有 P0 suite 失败是否均 S | 按实际影响分级，命中红线必为 S；测试基础设施故障为 A 但 gate 仍非通过 | 不将 runner 配置错误等同产品越权，也不让其变成 pass |
| external blocker 是否建 defect | 作为 blocker/pending；若实现违反已闭合合同才建 defect | 未闭合合同不是已观察实现偏差 |
| A 级是否允许退出 | 不满足正常退出；只能由 06 定义的正式裁决流程另行处理 | 05 不预授权 risk waiver 或 signoff |
| 复验是否原地改 run | 每次复验新 run_id，保留原失败 | 禁止重跑覆盖首次失败或 N 次取一成功 |
| 新用例如何编号 | 回开 Step5/6 注册并重审 59 基线 | 不在 defect 工单里私造 TC/EV |

## 7. 结构化中间产物

### 7.1 三轴分类

| 轴 | 值 | 回答的问题 | 不得替代 |
|---|---|---|---|
| 用例优先级 | P0/P1/P2 | 风险有多重要 | 缺陷严重性 |
| 执行状态 | planned/blocked/pending/not_run/passed/failed | 是否具备并完成执行 | 设计覆盖或缺陷关闭 |
| 缺陷级别 | S/A/B | 已观察偏差影响有多大 | blocker、验收 verdict |

当前没有实际执行，因此没有真实 failed case 或 defect；本表只约束未来分类。

### 7.2 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、安全/所有权/一致性终局或证据真实性被破坏 | 未授权数据展示；Query 写；Gap terminal；Unknown 二次 apply；secret/body 泄漏；fake/静态 EV 冒充正式通过 | 必须修复；不得风险接受；复验全部受影响 P0 面并留真实证据 | 是 |
| A | P0 主线或门禁无法正确/稳定证明，但未观察到 S 红线后果 | 合法 local write 错版本；recovery phase 错；P0 suite/harness 持续失败；report 缺非伪造必填项 | 必须修复；复验原族和相邻 CUT；正常退出前为 0 | 是 |
| B | 不影响 P0 正确性、安全、边界和证据真实性的一般问题 | P1 selected hardening、非阻断报告可读性、无正式阈值的 sample 异常 | 排期或由具名角色接受；不得提升为已验证能力 | 否；升级条件除外 |

### 7.3 S 级一票否决判定

| 触发 | 对应测试族 / 检查 | 判定 |
|---|---|---|
| workspace 保存/决定 identity、conversation、work、process、governance、artifact、runtime/archive truth | BOUND-001~003、DEP-001 | S |
| visibility 缺失/冲突/撤销仍展示或泄露 hidden metadata | VIS-002/003、SEC-003 | S |
| 六 Query 任一写方法被调用或隐式 refresh/read-cursor update | QRY-001~006、BOUND-001 | S |
| source/view/read cursor 混用；gap 静默 advance；stale 冒 fresh/Complete | CONTRACT-002、SRC-004、STATE-003、PAGE-001 | S |
| duplicate 产生第二效果；commit unknown 被当 rollback/新写 | IDEM-001~003、SRC-005、TXN-* | S |
| unsafe cutover、generation 混读或恢复终态复活 | REC-002/003/006、STATE-002 | S |
| owner mutation/outbound event/outbox/archive handoff 出现 | BOUND-001/003、QRY-006 | S |
| raw secret/token/credential/完整正文或隐私 ID 泄漏 | SEC-001/003、BOUND-002、redaction check | S |
| production fake fallback、非 core sibling compile dependency | DEP-001/002、CONFIG-003 | S |
| EV/report 静态造 pass、缺真实 raw、blocked/not_run 被改 passed | report-integrity-check | S |

### 7.4 非产品失败与升级规则

| 情况 | 初始记录 | 门禁姿态 | 升级 / 下一动作 |
|---|---|---|---|
| 正式 seam/credential/namespace 尚未闭合 | blocker + blocked | 非通过 | 解除 blocker 后新 run；不建虚假产品 defect |
| suite 无法启动、fixture/builder/runner 损坏 | infrastructure_failed + A | 非通过 | 修复 harness 后新 run；若隐藏 S 后果则升级 S |
| test ignored/skipped | not_run | P0 未满足 | 恢复执行；不得记 defect closed/pass |
| assertion 与正式设计冲突 | design/test inconsistency pending | 停止受影响面 | 回源 03/04/05；不得擅改 expected |
| 无 workload/baseline | pending | 数值项无 verdict | 保留残余风险，不建“性能失败” |
| 同根因复发或 A 影响扩大到红线 | reopened / upgraded | 阻断 | 升级 S，扩大复验与根因审查 |

### 7.5 修复后复验矩阵

| 触发面 | 必跑 TC / suite | 扩大条件 | 必跑 check / 证明 |
|---|---|---|---|
| typed contract/digest/cursor | 原 TC + CONTRACT/PAGE 全族；contracts-protocol | public DTO/error/codec 变化时跑全部 entry suite | dependency + redaction + raw/report integrity |
| 对象/状态/projector | 原 TC + STATE 全族及使用该对象的入口族；domain-invariants | 状态/不变量共享时加 maintenance/query/jobs | snapshot 前后与非法 self 不变 |
| scope/visibility/query | 原 TC + SCOPE/VIS/QRY 全族；query-no-write | public error或safe DTO变化时加 api-read-surface/formal seam | seven-write audit + redaction |
| Command/local/operation | 原族 + IDEM/TXN；maintenance-consistency | key/digest/store carrier变化时跑所有写入口 | stored original、原子 snapshot、report integrity |
| Consumer/Inbox | SRC/INBOX/IDEM/TXN；worker-consumer-boundary | envelope/order/gap变化时加 formal seam/recovery | receipt非ACK、无terminal gap、无outbound |
| recovery/cutover | REC/STATE/TXN/IDEM；jobs-recovery-boundary | generation/store/baseline变化时加 durable/formal seam | basis、pointer、role/safety原子断言 |
| config/secret/adapter | CONFIG/RES/PAGE/SEC；infra-adapter-contract | production composition或key ring变化时全profile | config-redaction + dependency |
| telemetry/redaction | SEC/BOUND；config-redaction-check | logger/report schema变化时扫描所有 raw/report | forbidden canary=0；sink failure不改业务 |
| dependency/composition | DEP/BOUND；read-model-boundary | manifest/module/feature变化时全 entry composition | dependency graph + fake production isolation |
| report/evidence | 59 TC涉及的 suite + report-integrity-check | index/generator/schema变化时全固定 run重生成 | raw digest/path、EV唯一、blocked保留 |

### 7.6 风险接受规则

| 项目 | 可接受性 | 条件 / 限制 |
|---|---|---|
| S 缺陷、一票否决 | 禁止 | 必须修复并通过复验 |
| A 缺陷 | 不满足正常退出 | 只有 06 后续正式定义裁决角色/时限/范围时才可讨论例外；05 不预签字 |
| B 缺陷 | 可条件接受 | 具名角色、理由、影响、到期/触发、缓解和复验计划齐全 |
| external blocked P0 | 不是风险接受 | 保持 blocked；不能填 EV 或宣称 readiness |
| 数字性能 baseline 缺失 | 可作为残余风险 | 不形成 failed/pass；baseline 闭合后执行新 run |
| P1/P2 selected-run 未执行 | 可保持 pending/not_run | 不能替代 P0 正式 seam 或一票否决验证 |

接受角色只能写角色，不伪造个人签署：实现负责人提出处置；测试负责人确认覆盖与复验；安全/数据 owner 审查安全边界；验收负责人在 06 作最终裁决。当前这些角色均未 signoff。

### 7.7 缺陷生命周期、升级与关闭

```text
observed failure
  -> classify: product | harness | blocker | design inconsistency
  -> severity S/A/B (only for observed defect)
  -> contain affected capability; preserve first-run raw
  -> fix design/implementation/harness at owning boundary
  -> new run: original TC -> family/CUT -> suite/check
  -> compare fixed-run raw/report with original failure
  -> close | reopen/upgrade | retain explicit residual risk
```

| 关闭条件 | S | A | B |
|---|---|---|---|
| 影响/根因/owner 已记录 | 必需 | 必需 | 必需 |
| 首次失败固定 run/raw/report 保留 | 必需 | 必需 | 若曾执行则必需 |
| 修复后新 fixed run | 必需 | 必需 | 视是否可执行 |
| 原 TC + 扩大回归通过 | 必需 | 必需 | 相关范围 |
| redaction/dependency/integrity | 相关即必需；证据类全部必需 | 相关即必需 | 相关即必需 |
| 防回归新增判断 | 必需 | 必需 | 建议 |
| 风险接受/signoff | 不允许替代修复 | 不构成正常退出 | 具名角色后才可 |

### 7.8 自动化防回归规则

| 触发 | 必须动作 |
|---|---|
| 手工或 real-seam 发现 P0，而低层未发现 | 将最小断言下沉到 contract/domain/service/controlled suite，并保留 real-seam例 |
| 同根因第二次出现 | 新增故障注入/变异用例并扩大该 CUT 回归 |
| redaction scanner 漏掉 forbidden 内容 | 扩展 canary/扫描面，复扫 raw、stdout/stderr、reports、acceptance 草案 |
| dependency/fake 边界漏检 | 扩展 manifest/import/feature/composition 静态检查 |
| Unknown/Gap/Race 只在偶现中暴露 | 增加确定性 barrier/fault schedule，不接受 flaky N 次重跑 |
| 新 TC/EV 需要拆分 | 回开 Step5 注册 ID、Step6 定义断言、Step7数据、Step9 suite、Step13证据，再重审唯一性 |

### 7.9 停审与跨规则审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B 是否可判定 | pass | 三轴已分离 |
| 一票否决能否降级 | no | 全部固定 S，禁止风险接受 |
| blocker 是否误作 defect/pass | no | blocked/pending 独立 |
| harness failure 是否可跳过 | no | A 且 gate 非通过 |
| 复验是否覆盖原 TC、同族、CUT、suite/check | pass | §7.5 |
| 关闭是否可由 planned EV 完成 | no | 必须真实 fixed run/raw/report |
| 自动化补洞是否会私造编号 | no | 回开 Step5~13 |
| 当前真实 defect/closed/signoff | none | 本步只设计规则 |

## 8. 对详细设计 / 配置的影响判定

当前未发现需要回写 03/04 的新设计缺口。未来若测试 expected 与正式字段/状态/phase 不一致，应停止并回源；若只是实现或 harness 偏差，按本步管理，不修改设计来迎合失败。

## 9. 回填草稿

正式 §11 回填三轴、S/A/B、S 级判定、非产品失败、复验矩阵、风险接受、生命周期/关闭和防回归规则。不得填真实 defect ID、修复状态、run 或 signoff。

## 10. 待确认事项与进入下一步条件

- 缺陷平台、SLA、个人负责人和审批系统未确定，不在 05 发明。
- 06 尚未定义最终验收角色/例外裁决；05 只固定 S 禁止接受与正常退出条件。
- 缺陷分级、升级、复验和关闭均可执行且无事实伪造；Step11 通过，允许进入 Step12。
