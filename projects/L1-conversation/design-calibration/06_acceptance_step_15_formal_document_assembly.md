# L1-conversation 06 验收标准 Step 15: 整理正式验收标准文档

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` 全文
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 15 |
| 主题 | 整理正式验收标准文档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 是 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_15_formal_document_assembly.md` |
| 正式文档位置 | `projects/L1-conversation/06-验收标准.md` |

本步已删除旧版正式 `06-验收标准.md`,并按 `验收标准书写规范.md` 的 15 章主链重建。正式文档不再继承旧 Turn / StreamEvents / projection 主线,改为承接新版 Conversation truth center、space / scope、fact、authorized consumption、manifestation、handoff、outbox、jobs、configuration、reports / artifacts 和 redaction。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `验收标准书写规范.md` | 正式 15 章主链、三值结论、引用 `design-calibration` 规则 | 作为正式文档结构来源 |
| `验收标准讨论流程_SOP.md` Step 15 | 正式文档组装和自审问题 | 作为本步执行来源 |
| `06_acceptance_step_01_input_boundary.md` ~ `06_acceptance_step_14_final_conclusion.md` | 各章节回填草稿和结构化产物 | 作为正式文档内容来源 |
| 旧 `06-验收标准.md` | 历史问题诊断 | 已删除,未继承旧主线 |
| 新 `06-验收标准.md` | 正式输出 | 已重建 |

## 3. SOP 问题回答

### 3.1 正式文档是否按 15 章主链组织?

是。正式文档使用以下章节:

```text
1. 与上游文档的关系声明
2. 验收目标与范围
3. 验收基线
4. 进入条件与退出条件
5. 功能验收门禁
6. 数据边界与架构红线验收
7. 接口、事件与跨仓同步验收
8. 状态机、事务与一致性验收
9. 非功能验收门禁
10. 可观测性、审计与证据门禁
11. 一票否决项
12. 缺陷分级、复验与放行规则
13. 风险接受与遗留项
14. 最终结论与签署
15. 参考
```

### 3.2 是否删除了 SOP 问题原文?

是。正式文档没有保留 Step 中间产物中的“应问的问题”“当前文档问题诊断”“改动前后对比”等 SOP 工作台内容,只保留正式验收标准、门禁、结论和引用。

### 3.3 每条 P0 门禁是否有通过条件、失败条件和证据来源?

是。正式文档 §5~§10 将 `AC-FUNC-*`、`AC-RED-*`、`AC-SYNC-*`、`AC-STATE-*`、`AC-TX-*`、`AC-CONS-*`、`AC-IDEM-*`、`AC-NFR-*`、`AC-OBS-*`、`AC-AUDIT-*` 和 `AC-EVID-*` 绑定到通过条件、失败条件或失败影响、TC / EV / report 路径。

### 3.4 一票否决项是否真实生效?

是。正式文档 §11 固定 `VETO-CONV-001~014`,并明确任一命中时最终结论只能是不通过,不得进入风险接受。§12、§13、§14 继续承接该规则,防止用缺陷分级、风险接受或签署覆盖一票否决。

### 3.5 每条 P0 门禁是否能回指设计契约、测试用例和 evidence ID?

是。正式文档的 AC 表中保留了 `TC-CONV-*`、`EV-CONV-*`、`reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md` 和 `reports/acceptance/*` 等证据入口。设计契约来源通过各章的校准来源和对应中间产物继续追溯到 `03-详细设计.md` 及 `03_ddd_*` 产物。

### 3.6 状态、字段、接口、事件名是否与详细设计和测试方案一致?

本步按 Step 7、Step 8 和 Step 10 的已确认口径写入正式协议族、状态族、事务、幂等和证据名。正式文档继续要求实现和报告使用 `03-详细设计.md` 与 `design-calibration/03_ddd_*` 中的正式名称,不得回流旧 Turn / StreamEvents / AG-UI 主语。

### 3.7 风险接受是否有接受人和后续动作?

是。正式文档 §13 要求所有可接受风险必须写明影响、接受理由、后续动作、责任人、接受人和截止时间。`待送验填写` 只允许作为设计阶段模板占位,不能在真实送验报告中留空。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧稿 185 行,主线仍围绕旧 conversation / turn / stream / projection | 已删除旧文件并重建 |
| Step 1~14 中间产物 | 已逐 Step 完成,具备正式回填草稿 | 汇总为正式 `06` |
| 正式 `06` | 需要按规范标注校准来源和延伸阅读 | 每章已标注 |
| 送验执行证据 | 尚未产生真实 commit / build / run_id | 正式文档保留 `待送验填写` 和裁决前状态 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 文件处理方式 | 旧文件存在 | 旧文件已删除后重建 |
| 章节结构 | 旧稿非规范 06 主链 | 使用 15 章主链 |
| 验收主语 | Turn、StreamEvents、旧 projection | Conversation truth center 和新版 `00~05` 主线 |
| 证据路径 | 泛写测试报告 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 结论口径 | 可被旧稿污染 | 固定通过 / 有条件通过 / 不通过 |
| 风险接受 | 旧稿不完整 | 明确 owner、接受人、动作和截止时间 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否保留旧 06 局部内容 | 保留并改写 | 删除旧文件后重建 | B | 防止旧验收主语污染新版 AC |
| 是否把所有 Step 表格完整搬入正式文档 | 全量搬入 | 摘录正式裁决所需的关键表和规则 | B | 正式文档应可读,细节可通过校准来源追溯 |
| 是否在设计阶段给出真实通过结论 | 给出预设通过 | 保留 `待送验填写` | B | 缺真实 run_id 和报告时不能通过 |
| 是否允许第四种最终结论 | 加入送验不成立 | 送验不成立只作为裁决前状态 | B | 书写规范要求三值结论 |
| 是否压缩 evidence / veto / risk | 大幅压缩 | 保留稳定 ID 与报告入口 | B | 验收必须可追溯和可复查 |

## 7. 结构化中间产物

### 7.1 正式文档组装清单

| 正式章节 | 校准来源 | 组装状态 |
|---|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` | 已组装 |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` | 已组装 |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` | 已组装 |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | 已组装 |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | 已组装 |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_architecture_redlines.md` | 已组装 |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_event_sync.md` | 已组装 |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | 已组装 |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional_gate.md` | 已组装 |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | 已组装 |
| §11 一票否决项 | `06_acceptance_step_11_veto_items.md` | 已组装 |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | 已组装 |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | 已组装 |
| §14 最终结论与签署 | `06_acceptance_step_14_final_conclusion.md` | 已组装 |
| §15 参考 | `06_acceptance_step_15_formal_document_assembly.md` | 已组装 |

### 7.2 自审结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 正式文档按 15 章主链组织 | 通过 | 章节名与书写规范一致 |
| 每章标注具体 `design-calibration` 来源 | 通过 | §1~§15 均已标注 |
| 每章有延伸阅读 | 通过 | 均指向对应中间产物的小节 |
| 未保留 SOP 工作台问题原文 | 通过 | 正式文档只保留裁决内容 |
| P0 AC 有证据入口 | 通过 | AC 表均绑定 TC、EV 或 report |
| 一票否决项有效 | 通过 | 任一 VETO 命中只能不通过 |
| 风险接受显式 | 通过 | §13 要求 owner、接受人、动作和截止时间 |
| 最终结论三值 | 通过 | §14 只允许通过 / 有条件通过 / 不通过 |
| 未引用 `latest` 作为正式基线 | 通过 | `latest` 只作为禁止项出现 |
| 正式文档未宣称实际通过 | 通过 | 使用 `待送验填写` |

### 7.3 追溯引用检查

| 检查对象 | 结果 |
|---|---|
| `AC-FUNC-*` | 可追溯到 Step 5、`FR-CONV-*`、TC 和 EV |
| `AC-RED-*` | 可追溯到 Step 6、数据归属 / 架构红线、TC 和 EV |
| `AC-SYNC-*` | 可追溯到 Step 7、协议族、跨仓依赖类型、TC 和 EV |
| `AC-STATE-*` / `AC-TX-*` / `AC-CONS-*` / `AC-IDEM-*` | 可追溯到 Step 8、状态矩阵、事务一致性、幂等规则、TC 和 EV |
| `AC-NFR-*` | 可追溯到 Step 9、NFR、专项测试和风险缺口 |
| `AC-EVID-*` | 可追溯到 Step 10、EV、report、redaction 和 handoff |
| `VETO-CONV-*` | 可追溯到 Step 11、前序 AC 和 EV |
| S0 / S1 / S2 / S3 | 可追溯到 Step 12 |
| `RISK-CONV-*` | 可追溯到 Step 13 |
| 最终结论表 | 可追溯到 Step 14 |

## 8. 回填草稿

本步已经完成正式文档回填,无需再提供独立回填草稿。正式输出为:

```text
projects/L1-conversation/06-验收标准.md
```

## 9. 待确认事项

无阻塞继续后续 `07-实施计划.md` 或实现交接的待确认事项。

后续真实送验前必须补齐:

- design repo commit hash。
- `/home/aris/Projects/quantalithos-conversation` implementation commit hash、build id / artifact digest、必要 image digest。
- 固定 `<run_id>`。
- `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。
- 签署角色、结论和日期。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 旧正式文档已删除 | 通过 | 已按新文件标准重建 |
| 新正式文档已生成 | 通过 | `06-验收标准.md` 已存在 |
| 15 章主链完整 | 通过 | §1~§15 已完成 |
| 校准来源和延伸阅读完整 | 通过 | 每章均已标注 |
| 自审清单完成 | 通过 | 见 §7.2 |
| 可以作为实施计划和发布准备门禁输入 | 通过 | 后续仍需真实送验证据才能裁决通过 |
