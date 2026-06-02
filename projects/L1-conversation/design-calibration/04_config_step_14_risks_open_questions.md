# Step 14. 定义风险与待确认事项

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 14 中间产物。
> 本步记录配置设计阶段仍未关闭、会影响详细设计、测试、验收、实施或运维的风险和待确认事项。
> 本步同时汇总 Step 1 ~ Step 13 的详细设计影响判定。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
- 回填章节: `projects/L1-conversation/04-配置设计.md` §14 风险与待确认事项

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 ~ Step 13 中间产物 | 已确认配置输入边界、范围、控制面、分类、来源、profile、配置项、安全、加载、变更、失效、承接和演进 | 汇总风险和待确认事项 |
| `04_config_calibration_flow.md` 详细设计影响判定总览 | Step 1 ~ Step 13 均为无回写 | 判断是否允许进入 Step 15 |
| `03-详细设计.md` §13 / §15 / §17 | 配置绑定、脚本契约和风险承接 | 判断是否存在未处理的详细设计影响 |
| 当前旧 `05/06` | 尚未按新版 04 重校准 | 作为下游风险记录 |

已确认结论:

```text
Step 1 ~ Step 13 没有产生需要回写 `03-详细设计.md` 的配置结论。
当前不存在 `待回写` 或 `阻塞待确认` 的详细设计影响项。
可以进入 Step 15 组装正式 `04-配置设计.md`。
```

## 3. SOP 问题回答

### 3.1 哪些配置问题仍可能影响落地?

主要风险集中在 P1/P2 外部集成和下游重校准,不阻塞 P0 配置设计定稿:

- production DB / event bus / source resolver / handoff endpoint / KMS 产品字段全集尚未设计。
- real identity / work / governance / artifact / runtime / bridge adapter 字段需要后续逐仓对齐。
- config center、admin override、hot reload 当前为 P2 候选,不能进入 P0。
- 当前 `05-测试方案.md`、`06-验收标准.md` 仍需按新版 04 重校准。
- 实施阶段若发现现有 `RuntimeProfile` 或 config type 无法表达 Step 7 字段,必须回写 03。

### 3.2 哪些事项会阻塞测试、验收、实施或运维?

| 事项 | 阻塞范围 | 当前处理 |
|---|---|---|
| P0 配置项缺失或 JSON demo 不完整 | 阻塞测试 / 实施 | Step 7 已补齐 |
| raw secret 或 forbidden body 进入配置 / 报告 | 阻塞验收 | Step 8 / Step 11 设为一票否决输入 |
| loader / validator 行为不清 | 阻塞实施 | Step 9 已收口 |
| 05/06 未重校准 | 阻塞后续测试 / 验收文档完成 | 记录为下游任务,不阻塞 04 定稿 |
| P1/P2 真实外部依赖字段未定义 | 阻塞生产化 / 运维 | 留给后续 adapter / 运维专项 |

### 3.3 每个待确认事项需要谁确认?

当前没有阻塞 Step 15 的待确认事项。P1/P2 事项需要后续由对应子项目 owner、实施 agent、测试 / 验收文档和运维文档确认。

### 3.4 未确认前应如何处理?

未确认的 P1/P2 内容不得写成 P0 active 配置项。正式 `04` 只写为候选、风险或后续承接方向。

### 3.5 哪些配置结论改变了 `03-详细设计.md` 的代码契约?

当前无。

### 3.6 这些影响是否已经回写到 `03-详细设计.md`,还是需要标为阻塞待确认?

当前无需回写,也没有阻塞待确认。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 1 ~ Step 13 | 已分别记录 03 影响判定,但未集中汇总 | Step 15 前需要统一判断是否可定稿 |
| 当前旧 `05/06` | 未按新版 04 重校准 | 下游测试验收存在旧口径风险 |
| P1/P2 外部依赖 | 当前只保留接缝,未定义产品字段全集 | 生产化和运维后续需要专项补齐 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险 | 分散在前序 Step | 汇总为风险表和待确认事项表 | Step 15 前需要统一检查 |
| 03 回写 | 分散在每个 Step | 汇总确认当前无待回写 / 阻塞待确认 | 判断是否可定稿 |
| 下游风险 | 只在 Step 12 提到 | 明确旧 05/06 需后续重校准 | 防止误以为测试验收已完成 |
| P1/P2 风险 | 分散在范围和演进章节 | 集中记录真实外部依赖字段后移 | 防止 P0 被扩大 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 等 P1/P2 全部确认后再定稿 04 | 最完整 | 会阻塞 P0 默认可验证路径 | 不采用 |
| 方案 B: P0 先定稿,P1/P2 作为风险和候选承接 | 支撑当前实现和测试,边界清楚 | 后续生产化仍需补文档 | 采用 |
| 方案 C: 把所有 P1/P2 候选直接写成 active 配置 | 看似完整 | 虚构字段,扩大实现范围 | 不采用 |

推荐方案 B。

原因:

- 当前配置设计的目标是支撑 P0 default path 和后续测试 / 实施承接。
- P1/P2 真实外部依赖字段必须等相邻仓和运维方案稳定后再进入 active 配置。

## 7. 结构化中间产物

### 7.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| production DB / event bus / endpoint / KMS 字段全集未定义 | 影响生产化和运维,不影响 P0 | P0 只保留接缝;P1/P2 专项补齐 | 后续实施 / 运维 / 对应 adapter owner |
| real source resolver / handoff adapter 字段需逐仓对齐 | P1 接入时可能新增配置字段 | 进入候选配置演进表,需要先核对相邻仓 | 对应子项目 owner |
| config center / admin override / hot reload 未设计 | 若误用会破坏冷更新和审计边界 | P0 标为 unsupported / rejected | 后续 P2 设计 owner |
| 旧 `05/06` 尚未重校准 | 测试验收文档可能仍按旧口径 | 配置定稿后重写 / 校准 05/06 | 测试 / 验收文档 owner |
| 实施阶段发现 config type 不足 | 可能需要回写 03 | 实施 agent 必须按冲突规则暂停并回报 | 实施 agent / 设计 owner |
| 运维文档尚未创建 | 真实部署、secret provider、告警、轮换无落地 | 04 只给边界,后续创建运维文档 | 运维文档 owner |

### 7.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| P1 durable store 产品字段 | 不影响 P0 | adapter / 运维 owner | 不进入 active 配置项 |
| P1 real event bus publisher / consumer endpoint 字段 | 不影响 P0 | bus / conversation adapter owner | 继续使用 fake / configured ref 接缝 |
| P1 real source resolver 参数 | 不影响 P0 | identity / work / governance / artifact / runtime / bridge owner | 继续使用 fake / configured ref 接缝 |
| P1 observability / archive handoff 参数 | 不影响 P0 | observability / archive owner | 继续使用 fake / configured ref 接缝 |
| P2 config center / hot reload | 不影响 P0 | 平台配置治理 owner | P0 unsupported |
| 当前 `05/06` 何时重校准 | 不影响 04 定稿,影响测试验收完成 | 文档 owner / 后续 agent | 在配置定稿后继续执行 |

### 7.3 详细设计回写清单

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 1 ~ Step 13 的配置结论 | 否 | 均为配置说明、文档边界、失败策略或下游承接规则 | 无 | 无回写 |
| 当前 P1/P2 候选配置 | 否 | 未进入 active 配置项 | 无 | 无回写 |
| 当前无旧配置迁移项 | 否 | 配置设计基线说明 | 无 | 无回写 |

当前状态:

```text
不存在 `待回写`。
不存在 `阻塞待确认`。
允许进入 Step 15。
```

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 14 汇总确认 Step 1 ~ Step 13 无 03 待回写项 | 否 | 汇总判定 | 无 | 无回写 |
| P1/P2 风险只作为候选和后续承接,不写入 active 配置契约 | 否 | 范围控制 | 无 | 无回写 |
| 允许进入 Step 15 组装正式配置设计文档 | 否 | 流程状态 | 无 | 无回写 |

## 9. 回填草稿

正式 `04-配置设计.md` §14 建议采用以下结构:

```text
14. 风险与待确认事项
  14.1 风险表
  14.2 待确认事项表
  14.3 详细设计回写清单
  14.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §14.1 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.1 |
| §14.2 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.2 |
| §14.3 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.3 |
| §14.4 | `design-calibration/04_config_step_14_risks_open_questions.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 15 的待确认事项。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 风险表已形成 | 通过 | §7.1 |
| 待确认事项表已形成 | 通过 | §7.2 |
| 详细设计回写清单已形成 | 通过 | §7.3 |
| 不存在 `待回写` 或 `阻塞待确认` | 通过 | §7.3 |
| 可以进入 Step 15 | 通过 | 下一步组装正式 `04-配置设计.md` |
