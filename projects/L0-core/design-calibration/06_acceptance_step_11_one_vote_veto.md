# Step 11. 定义一票否决项

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-core/06-验收标准.md` §11

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §14 | 需求层一票否决项 | 定义否决项来源 |
| Step 6 | 数据边界与架构红线 | 抽取禁止正文、raw secret、相邻仓职责、truth 反写等否决项 |
| Step 8 | 状态、事务与一致性 | 抽取半提交、audit 静默失败、引用 fail open 等否决项 |
| Step 9 | 非功能门禁 | 抽取安全、职责、fail closed 和 release gate 阻断项 |
| Step 10 | 证据门禁 | 抽取 P0 EV 缺失、证据泄露和 release gate 证据缺失 |
| `05-测试方案.md` §10 / §11 | 一票否决专项、缺陷分级 | 对齐测试方案中的 S 级缺陷口径 |

依赖的前序 Step：Step 1~10 已确认。

## 3. SOP 问题回答

1. 哪些失败会直接导致不通过?

   回答：核心闭环任一节点缺失、L0-core 不能作为共享契约正式来源成立、相邻仓职责进入本仓、禁止正文或 raw secret 入仓、truth 被下游 / 投影 / 快照反写、truth + audit + outbox 半提交、audit 静默失败、失败伪成功、引用失败默认放行、发布基线不可追溯、P0 EV 缺失或证据泄露,都会直接导致不通过。

2. 否决项来自哪个需求或设计红线?

   回答：否决项主要来自 `00-需求文档.md` §14.2、Step 6 的 AC-RED、Step 8 的 AC-CONS、Step 9 的 AC-NFR 和 Step 10 的 AC-EVID。Step 11 不新增新的红线,只把前序已经确认的红线抽取为不可风险接受的最终否决项。

3. 否决项如何检查?

   回答：通过 05 的 P0 TC / EV、API surface scan、security scan、audit / trace evidence、transaction / outbox report、config fail closed report、evidence archive scan 和 release gate 证据检查。不能用口头确认替代。

4. 否决项是否允许风险接受?

   回答：不允许。一票否决项一旦触发,最终结论只能是“不通过”或“送验不成立”。风险接受只能处理 P1 / P2 残余风险或非阻断缺陷,不能覆盖一票否决。

5. 否决项是否覆盖所有 P0 红线?

   回答：本步覆盖核心闭环、数据边界、安全、职责边界、一致性、引用 fail closed、证据完整性和 release gate。P0 功能普通失败不一定全部列为一票否决,但会在 Step 5~10 导致“不通过”;一票否决只列不可被风险接受覆盖的红线。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §8 | 缺陷分级里混写旧 S 级缺陷,没有单独一票否决章节 | 否决项不够正式,容易被风险接受覆盖 |
| `06-验收标准.md` §7 | 安全与治理门禁仍围绕 rich model / primitive registry | 不覆盖 raw secret、禁止正文、fail open、证据泄露等新版红线 |
| `06-验收标准.md` 全文 | 没有说明一票否决不得风险接受 | 有条件通过可能错误覆盖红线 |
| `06-验收标准.md` 全文 | 否决项没有证据 / 检查方式 | 无法执行裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 否决项位置 | 分散在缺陷和治理门禁 | 单独 §11 一票否决项 | 对齐新版 SOP |
| 否决项内容 | rich model admitted、rejected primitive consumed | 核心闭环、安全、职责、truth、事务、引用、证据、release gate | 对齐 00~05 |
| 风险接受 | 未说明 | 一票否决不得风险接受 | 防止误判有条件通过 |
| 检查方式 | 泛化描述 | 绑定 TC / EV / scan / evidence | 支撑可执行验收 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 把所有 P0 失败都写成一票否决 | 简单严格 | 一票否决过宽,缺陷分级失去作用 | 不采用 |
| B. 只保留安全泄露为一票否决 | 清晰 | 漏掉 truth / 一致性 / 发布基线等底座红线 | 不采用 |
| C. 只抽取不可风险接受的核心红线作为一票否决 | 边界清楚,可执行 | 需要与缺陷分级配合 | 采用 |

## 7. 结构化中间产物

### 7.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| AC-BLOCKER-001 | L0-core 不能作为跨仓共享契约正式来源成立 | 本仓根定位失败,后续仓无稳定契约底座 | AC-FUNC-001~004、AC-RED-001、EV-SCOPE-001、EV-E2E-001 |
| AC-BLOCKER-002 | 核心闭环任一节点缺失 | 范围、语义、演进、下游消费任一缺失都会破坏共享契约来源仓 | AC-FUNC-001~004、AC-FUNC-008、EV-SVC-001、EV-E2E-001 |
| AC-BLOCKER-003 | 相邻仓职责进入本仓核心职责 | 事件投递、SDK 高层、L1 业务、观测存储、归档恢复、认证授权会污染仓边界 | AC-RED-004、AC-NFR-005、EV-SCOPE-001 |
| AC-BLOCKER-004 | 禁止正文入仓或进入证据 | 业务、事件实例、观测、归档、运行、外部正文进入本仓会破坏数据所有权 | AC-RED-002、AC-NFR-003、AC-EVID-008、EV-SEC-001 |
| AC-BLOCKER-005 | raw secret / token / credential 泄露 | 凭据进入配置、日志、审计、outbox、trace 或 evidence 是安全红线 | AC-RED-003、AC-NFR-004、AC-EVID-008、EV-SEC-002 |
| AC-BLOCKER-006 | 下游、投影、快照、工具链反向改写真相 | 破坏 L0-core 的契约真相归属 | AC-RED-001、AC-RED-005、AC-RED-006、EV-INT-001 |
| AC-BLOCKER-007 | truth + audit + outbox 半提交 | 已提交事实不可追溯或不可恢复传播 | AC-CONS-004、AC-CONS-006、EV-INT-001、EV-AUDIT-001 |
| AC-BLOCKER-008 | audit 静默失败 | 高影响变化不可追溯 | AC-CONS-005、AC-EVID-003、EV-AUDIT-001 |
| AC-BLOCKER-009 | 失败伪成功 | gate、reference、toolchain、publisher、projection 失败却返回成功会制造错误基线 | AC-RED-010、AC-CONS-002、AC-CONS-011、EV-CONFIG-001、EV-WORKER-001 |
| AC-BLOCKER-010 | 引用失败默认放行或补造正文 | 外部正文引用失效不能被伪装为有效契约输入 | AC-RED-009、AC-CONS-011、EV-CONFIG-001、EV-WORKER-001 |
| AC-BLOCKER-011 | 发布基线不可追溯 | 发布事实缺少 gate、fingerprint、audit、trace 或 evidence 会破坏契约演进 | AC-FUNC-003、AC-EVID-003、AC-EVID-004、EV-AUDIT-001、EV-TRACE-001 |
| AC-BLOCKER-012 | P0 EV 缺失或证据不可复查 | 验收结论无法审计和复现 | AC-EVID-001、AC-EVID-010、P0 EV 清单 |
| AC-BLOCKER-013 | release gate 证据缺失或失败 | 发布候选缺少最小闭环裁决依据 | AC-EVID-006、EV-E2E-001 |
| AC-BLOCKER-014 | 一票否决项被风险接受覆盖 | 风险接受不能替代红线修复 | Step 13 风险表审查、签署记录 |

### 7.2 不允许风险接受清单

| 不允许接受的情况 | 处理 |
|---|---|
| raw secret 或禁止正文泄露 | 清理、修复、重跑证据;未修复不得通过 |
| truth / audit / outbox 半提交 | 修复事务边界并复验;未修复不得通过 |
| 失败伪成功或引用 fail open | 修复 fail closed 和错误映射;未修复不得通过 |
| 相邻仓职责进入 L0-core | 移出职责并复查 API / config / object surface |
| P0 EV 缺失 | 补证并重验;不得口头确认 |
| release gate 缺失 | 补跑 release gate;不得条件通过 |

### 7.3 否决项触发后的结论

| 情况 | 结论 |
|---|---|
| 任一 AC-BLOCKER 触发 | 不通过 |
| 证据不足以判断是否触发 AC-BLOCKER | 送验不成立或不通过 |
| AC-BLOCKER 已修复但未复验 | 不通过 |
| AC-BLOCKER 已修复且复验通过 | 可重新进入完整验收裁决 |

## 8. 回填草稿

```md
## 11. 一票否决项

> 校准来源：
> - `design-calibration/06_acceptance_step_11_one_vote_veto.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“一票否决项表”“不允许风险接受清单”和“否决项触发后的结论”小节,了解哪些问题不能被风险接受覆盖。

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| AC-BLOCKER-001 | L0-core 不能作为跨仓共享契约正式来源成立 | 根定位失败 | AC-FUNC-001~004、AC-RED-001、EV-SCOPE-001、EV-E2E-001 |
| AC-BLOCKER-002 | 核心闭环任一节点缺失 | 共享契约来源仓闭环失败 | AC-FUNC-001~004、AC-FUNC-008、EV-SVC-001、EV-E2E-001 |
| AC-BLOCKER-003 | 相邻仓职责进入本仓核心职责 | 仓边界被污染 | AC-RED-004、AC-NFR-005、EV-SCOPE-001 |
| AC-BLOCKER-004 | 禁止正文入仓或进入证据 | 数据所有权被破坏 | AC-RED-002、AC-NFR-003、AC-EVID-008、EV-SEC-001 |
| AC-BLOCKER-005 | raw secret / token / credential 泄露 | 安全红线 | AC-RED-003、AC-NFR-004、AC-EVID-008、EV-SEC-002 |
| AC-BLOCKER-006 | 下游、投影、快照、工具链反向改写真相 | 契约真相归属被破坏 | AC-RED-001、AC-RED-005、AC-RED-006、EV-INT-001 |
| AC-BLOCKER-007 | truth + audit + outbox 半提交 | 事实不可追溯或不可恢复传播 | AC-CONS-004、AC-CONS-006、EV-INT-001、EV-AUDIT-001 |
| AC-BLOCKER-008 | audit 静默失败 | 高影响变化不可追溯 | AC-CONS-005、AC-EVID-003、EV-AUDIT-001 |
| AC-BLOCKER-009 | 失败伪成功 | 制造错误基线 | AC-RED-010、AC-CONS-002、AC-CONS-011、EV-CONFIG-001、EV-WORKER-001 |
| AC-BLOCKER-010 | 引用失败默认放行或补造正文 | 外部引用失效被伪装为有效 | AC-RED-009、AC-CONS-011、EV-CONFIG-001、EV-WORKER-001 |
| AC-BLOCKER-011 | 发布基线不可追溯 | 契约演进不可审计 | AC-FUNC-003、AC-EVID-003、AC-EVID-004、EV-AUDIT-001、EV-TRACE-001 |
| AC-BLOCKER-012 | P0 EV 缺失或证据不可复查 | 验收结论不可审计 | AC-EVID-001、AC-EVID-010、P0 EV 清单 |
| AC-BLOCKER-013 | release gate 证据缺失或失败 | 发布候选缺少最小闭环依据 | AC-EVID-006、EV-E2E-001 |
| AC-BLOCKER-014 | 一票否决项被风险接受覆盖 | 风险接受不能替代红线修复 | Step 13 风险表审查、签署记录 |
```

## 9. 待确认事项

- 是否接受一票否决项触发后不得给出“有条件通过”。
- 是否接受普通 P0 功能失败不全部列入一票否决,但仍会导致“不通过”。
- 是否接受 AC-BLOCKER-014 作为防止误用风险接受的元否决项。

## 10. 进入下一步条件

- [x] 否决项清楚且可检查。
- [x] 否决项均绑定来源门禁或证据。
- [x] 已明确一票否决不得被风险接受覆盖。
- [x] 可以进入 Step 12 定义缺陷分级、复验与放行规则。
