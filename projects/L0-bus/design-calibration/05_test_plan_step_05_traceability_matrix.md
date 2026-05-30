# L0-bus 05 测试方案 Step 5: 需求追溯与覆盖矩阵

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 5 中间产物。
> 本步建立需求、规则、设计依据、测试场景、用例编号和证据编号之间的追溯关系。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 建立需求追溯与覆盖矩阵 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §5 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §7~§10 / §14 | 已完成 | 提取 CL-001~CL-006、F-001~F-008、BR-001~BR-012 和验收方向 |
| `05_test_plan_step_03_test_objects_slices.md` | 已确认 | 提取测试对象、测试切口和风险 |
| `05_test_plan_step_04_strategy_layers.md` | 已确认 | 提取测试层级、自动化门禁和失败阻断策略 |
| `02-概要设计.md` §5~§11 | 已完成 | 提取主要组成部分、对象、接口、处理流、状态机和异常边界 |
| `03-详细设计.md` §5~§15 | 已完成 | 提取模块、协议、处理流、事务、错误、幂等、配置和观测测试切口 |
| `04-配置设计.md` §12 | 已完成 | 提取配置测试、redaction、reports / artifacts 承接 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 需求对应哪些设计章节?

| 需求 ID | 设计依据 | 说明 |
|---|---|---|
| CL-001 | `02` §5.4 / §8.3 / §8.4、`03` §7 / §8.1、`04` §12 | 契约化输入承接由 publication acceptance 与 outbox relay 共同证明 |
| CL-002 | `02` §5.4 / §6.5 / §6.22、`03` §8.5 / §13、`04` §6~§7 | 统一传递语义由 transport semantic、backend capability 和默认配置路径证明 |
| CL-003 | `02` §5.5 / §8.5、`03` §8.1 / §9、`03` §15 | delivery 推进由 delivery lifecycle、backend port 和 worker / job 证明 |
| CL-004 | `02` §5.6 / §6.10~§6.12、`03` §10~§12、`03` §14 | 结果留痕由 feedback、idempotency、history、audit 和 UoW 证明 |
| CL-005 | `02` §5.7 / §8.9~§8.12、`03` §9 / §11、`03` §15 | 失败恢复由 retry、DLQ、replay preparation 和 recovery policy 证明 |
| CL-006 | `02` §5.8 / §8.13~§8.17、`03` §14 / §15、`04` §12 | 只读输出由 projection、tap、failure material、redaction 和 reports 证明 |
| F-001~F-008 | `02` §5~§11、`03` §5~§15、`04` §12 | 功能需求均可追溯到具体对象、接口、处理流和测试切口 |
| BR-001~BR-012 | `02` §10 / §11、`03` §9~§15、`04` §8~§12 | 边界规则均以 negative / boundary / redaction / consistency 测试覆盖 |

### 3.2 每个 P0 需求至少有哪些测试场景?

本轮使用稳定场景编号 `TS-BUS-xxx`,后续 Step 6 再把场景展开成具体用例。

| 场景 ID | 场景名称 | 覆盖主线 |
|---|---|---|
| TS-BUS-001 | 契约绑定发布材料接入 | CL-001、F-001、BR-001、BR-002 |
| TS-BUS-002 | 平台级传递语义形成 | CL-002、F-002、BR-003、BR-012 |
| TS-BUS-003 | delivery 推进与默认可验证路径 | CL-003、F-003、F-008、BR-006、BR-012 |
| TS-BUS-004 | feedback、history 与幂等锚点 | CL-004、F-004、BR-004、BR-006、BR-011 |
| TS-BUS-005 | retry、DLQ 与 replay preparation | CL-005、F-005、BR-004、BR-005、BR-008、BR-011 |
| TS-BUS-006 | audit、tap、transport view 与 failure material | CL-006、F-006、BR-007、BR-008、BR-009、BR-011 |
| TS-BUS-007 | Outbox relay 边界承接 | CL-001、CL-002、F-007、BR-010 |
| TS-BUS-008 | backend adapter 接缝与 capability | CL-002、CL-003、F-008、BR-003、BR-012 |
| TS-BUS-009 | 配置控制面与 runtime graph | `04` §12、F-008、BR-002、BR-012 |
| TS-BUS-010 | redaction、reports 与 artifacts 证据 | CL-006、BR-002、BR-007、BR-011、`04` §12 |

### 3.3 哪些场景必须自动化?

| 场景 ID | 自动化要求 | 原因 |
|---|---|---|
| TS-BUS-001~TS-BUS-008 | 必须自动化 | 覆盖 P0 / P0-min 主链和边界,不能只靠人工确认 |
| TS-BUS-009 | 必须自动化 | 配置加载、校验和 runtime graph 是所有测试的前置 |
| TS-BUS-010 | 必须自动化 + 报告检查 | redaction 和证据归档是验收红线 |

结论: P0 / P0-min 场景必须至少有自动化用例;人工审查只能作为补充说明,不能替代自动化证据。

### 3.4 每个场景的证据如何编号?

| 编号类型 | 格式 | 示例 | 说明 |
|---|---|---|---|
| 测试场景 | `TS-BUS-xxx` | `TS-BUS-005` | 需求追溯和用例分组 |
| 测试用例 | `TC-BUS-<AREA>-xxx` | `TC-BUS-REC-003` | Step 6 具体展开 |
| 证据 | `EV-BUS-<AREA>-xxx` | `EV-BUS-REC-003` | Step 13 映射到 artifacts / reports |
| 报告 | `RP-BUS-<TYPE>-xxx` | `RP-BUS-RED-001` | redaction、summary、coverage 报告 |

Area 建议值:

| Area | 含义 |
|---|---|
| `PUB` | publication acceptance |
| `SEM` | transport semantic |
| `DLV` | delivery progression |
| `FDB` | feedback / idempotency |
| `REC` | recovery |
| `OUT` | read-only output / audit |
| `OBX` | outbox relay |
| `BND` | backend boundary |
| `CFG` | config |
| `RED` | redaction / evidence |

### 3.5 哪些需求暂未覆盖,原因是什么?

当前 P0 / P0-min 需求没有覆盖空洞。

| 项 | 状态 | 说明 |
|---|---|---|
| CL-001~CL-006 | 已覆盖 | 每个闭环节点至少对应一个自动化场景 |
| F-001~F-008 | 已覆盖 | 每个功能需求至少对应一个场景、用例族和证据族 |
| BR-001~BR-012 | 已覆盖 | 每条规则至少对应 positive / negative / boundary / redaction / consistency 测试之一 |
| P1 production adapter | 延后 | 当前只覆盖 port / adapter 接缝,真实产品适配进入 P1 专项 |
| P2 config center / hot reload / multi-backend | 延后 | 当前不进入测试矩阵,作为 Step 14 残余风险 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 缺少新版需求追溯 | 没有按 CL / F / BR 建立矩阵 | 用例无法证明需求覆盖 | 本步建立需求到场景、用例、证据的矩阵 |
| 旧 `05` 没有证据编号体系 | 测试结果难以交给 `06` 裁决 | 验收无法引用稳定证据 | 本步定义 TS / TC / EV / RP 编号 |
| P0-min 边界容易遗漏 | Outbox relay 和 backend default path 可能被当作后续增强 | P0 主链缺少支撑 | 本步把 F-007 / F-008 纳入覆盖矩阵 |
| BR 规则容易只靠人工审查 | 边界红线未绑定自动化用例 | core / payload / replay / read-only / redaction 风险后移 | 本步要求 BR-001~BR-012 均有自动化或扫描证据 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 覆盖口径 | 旧用例散列 | CL / F / BR 到场景、用例、证据的追溯矩阵 | 可评审、可验收 |
| 编号体系 | 未稳定 | `TS-BUS`、`TC-BUS`、`EV-BUS`、`RP-BUS` | 后续 Step 6 / 13 可直接引用 |
| 自动化要求 | 不清晰 | P0 / P0-min 场景必须自动化 | 防止人工确认替代测试 |
| 未覆盖项 | 未显式列出 | P0 无空洞,P1/P2 延后项进入风险 | 防止需求静默消失 |
| 验收承接 | 测试和验收弱关联 | 每项需求都有证据族 | 支撑 `06-验收标准.md` |

---

## 6. 测试设计取舍

### 6.1 是否把 US 用户故事也放进主矩阵

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 主矩阵覆盖 CL / F / BR,US 通过 F 间接覆盖 | 矩阵稳定,直接对应可测试需求 | 用户故事不逐行列出 | 采用 |
| B. CL / US / F / BR 全部混在一张大表 | 覆盖看似完整 | 表格过宽,重复关系多 | 不采用 |
| C. 只覆盖 F | 简洁 | 闭环节点和边界规则追溯不足 | 不采用 |

结论: 主矩阵以 CL / F / BR 为主;US 的覆盖通过 F 表中的“支撑故事”间接成立。

### 6.2 是否要求每条 BR 都有独立用例

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每条 BR 都独立用例 | 追溯最直观 | 用例重复度高 | 不采用 |
| B. 每条 BR 至少绑定一个场景和证据,可与 F 用例复用 | 覆盖完整且避免重复 | 需要矩阵标清复用关系 | 采用 |
| C. BR 只人工审查 | 成本低 | 不符合 P0 自动化要求 | 不采用 |

结论: BR 可以复用功能用例,但必须在矩阵中明确证据。

### 6.3 是否把 evidence 编号提前固定

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. Step 5 固定证据编号族,Step 13 再落文件 | 追溯链提前稳定 | Step 13 仍需细化文件名 | 采用 |
| B. Step 13 才首次编号 | Step 5 更轻 | Step 6 用例无法稳定引用证据 | 不采用 |
| C. 不设证据编号 | 简单 | 验收引用困难 | 不采用 |

结论: Step 5 固定证据编号族,Step 13 再映射到 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。

---

## 7. 结构化中间产物

### 7.1 追溯链路图

```text
+------------------+
| CL / F / BR      |
+--------+---------+
         |
         v
+--------+---------+
| Design basis     |
| 02 / 03 / 04     |
+--------+---------+
         |
         v
+--------+---------+
| Test scenario    |
| TS-BUS-xxx       |
+--------+---------+
         |
         v
+--------+---------+
| Test case        |
| TC-BUS-AREA-xxx  |
+--------+---------+
         |
         v
+--------+---------+
| Evidence         |
| EV-BUS / RP-BUS  |
+------------------+
```

图后说明：

- `CL / F / BR` 是需求和规则源头。
- `Design basis` 只引用 `02 / 03 / 04`,不重新定义设计。
- `TS-BUS` 是场景分组,`TC-BUS` 是 Step 6 的可执行用例。
- `EV-BUS / RP-BUS` 是 Step 13 的证据和报告编号。

### 7.2 核心能力闭环覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| CL-001 | `02` §5.4 / §8.3 / §8.4、`03` §8.1 | TS-BUS-001、TS-BUS-007 | TC-BUS-PUB-001、TC-BUS-OBX-001 | 是 | EV-BUS-PUB-001、EV-BUS-OBX-001 | 已覆盖 |
| CL-002 | `02` §6.5 / §6.22、`03` §13 | TS-BUS-002、TS-BUS-008 | TC-BUS-SEM-001、TC-BUS-BND-001 | 是 | EV-BUS-SEM-001、EV-BUS-BND-001 | 已覆盖 |
| CL-003 | `02` §5.5 / §8.5、`03` §9 | TS-BUS-003、TS-BUS-008 | TC-BUS-DLV-001、TC-BUS-BND-002 | 是 | EV-BUS-DLV-001、EV-BUS-BND-002 | 已覆盖 |
| CL-004 | `02` §5.6、`03` §10~§12 | TS-BUS-004 | TC-BUS-FDB-001、TC-BUS-FDB-002 | 是 | EV-BUS-FDB-001 | 已覆盖 |
| CL-005 | `02` §5.7 / §8.9~§8.12、`03` §11 | TS-BUS-005 | TC-BUS-REC-001、TC-BUS-REC-002、TC-BUS-REC-003 | 是 | EV-BUS-REC-001 | 已覆盖 |
| CL-006 | `02` §5.8 / §8.13~§8.17、`03` §14、`04` §12 | TS-BUS-006、TS-BUS-010 | TC-BUS-OUT-001、TC-BUS-RED-001 | 是 | EV-BUS-OUT-001、RP-BUS-RED-001 | 已覆盖 |

### 7.3 功能需求覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| F-001 | `02` §5.4 / §6.3~§6.6、`03` §8.1 | TS-BUS-001 | TC-BUS-PUB-001、TC-BUS-PUB-002 | 是 | EV-BUS-PUB-001 | 已覆盖 |
| F-002 | `02` §6.5 / §8.3、`03` §13 | TS-BUS-002 | TC-BUS-SEM-001、TC-BUS-SEM-002 | 是 | EV-BUS-SEM-001 | 已覆盖 |
| F-003 | `02` §5.5 / §8.5、`03` §9 | TS-BUS-003 | TC-BUS-DLV-001、TC-BUS-DLV-002 | 是 | EV-BUS-DLV-001 | 已覆盖 |
| F-004 | `02` §5.6 / §6.10~§6.12、`03` §12 | TS-BUS-004 | TC-BUS-FDB-001、TC-BUS-FDB-002、TC-BUS-FDB-003 | 是 | EV-BUS-FDB-001 | 已覆盖 |
| F-005 | `02` §5.7 / §8.9~§8.12、`03` §11 | TS-BUS-005 | TC-BUS-REC-001、TC-BUS-REC-002、TC-BUS-REC-003 | 是 | EV-BUS-REC-001 | 已覆盖 |
| F-006 | `02` §5.8 / §6.18~§6.21、`03` §14 | TS-BUS-006、TS-BUS-010 | TC-BUS-OUT-001、TC-BUS-OUT-002、TC-BUS-RED-001 | 是 | EV-BUS-OUT-001、RP-BUS-RED-001 | 已覆盖 |
| F-007 | `02` §8.4、`03` §8.1 / §12 | TS-BUS-007 | TC-BUS-OBX-001、TC-BUS-OBX-002 | 是 | EV-BUS-OBX-001 | 已覆盖 |
| F-008 | `02` §6.22~§6.23、`03` §13、`04` §6~§7 | TS-BUS-003、TS-BUS-008、TS-BUS-009 | TC-BUS-BND-001、TC-BUS-CFG-001 | 是 | EV-BUS-BND-001、EV-BUS-CFG-001 | 已覆盖 |

### 7.4 业务规则覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| BR-001 | `02` §10.5、`03` §7 | TS-BUS-001 | TC-BUS-PUB-002 | 是 | EV-BUS-PUB-002 | 已覆盖 |
| BR-002 | `02` §6.6 / §10.5、`03` §14、`04` §8 | TS-BUS-001、TS-BUS-010 | TC-BUS-PUB-003、TC-BUS-RED-001 | 是 | EV-BUS-PUB-003、RP-BUS-RED-001 | 已覆盖 |
| BR-003 | `02` §6.5、`03` §13 | TS-BUS-002、TS-BUS-008 | TC-BUS-SEM-002、TC-BUS-BND-001 | 是 | EV-BUS-SEM-002 | 已覆盖 |
| BR-004 | `02` §9、`03` §9~§11 | TS-BUS-004、TS-BUS-005 | TC-BUS-FDB-001、TC-BUS-REC-001 | 是 | EV-BUS-FDB-001、EV-BUS-REC-001 | 已覆盖 |
| BR-005 | `02` §8.12 / §9.4、`03` §11 | TS-BUS-005 | TC-BUS-REC-003 | 是 | EV-BUS-REC-003 | 已覆盖 |
| BR-006 | `02` §6.11、`03` §12 | TS-BUS-004 | TC-BUS-FDB-002、TC-BUS-FDB-003 | 是 | EV-BUS-FDB-002 | 已覆盖 |
| BR-007 | `02` §6.21 / §8.16、`03` §14 | TS-BUS-006 | TC-BUS-OUT-001、TC-BUS-OUT-002 | 是 | EV-BUS-OUT-001 | 已覆盖 |
| BR-008 | `02` §5.7 / §5.8、`03` §7 / §14 | TS-BUS-005、TS-BUS-006 | TC-BUS-REC-003、TC-BUS-OUT-003 | 是 | EV-BUS-REC-003、EV-BUS-OUT-003 | 已覆盖 |
| BR-009 | `02` §6.16 / §10.5、`03` §14 | TS-BUS-006 | TC-BUS-OUT-004 | 是 | EV-BUS-OUT-004 | 已覆盖 |
| BR-010 | `02` §8.4、`03` §12 | TS-BUS-007 | TC-BUS-OBX-001、TC-BUS-OBX-002 | 是 | EV-BUS-OBX-001 | 已覆盖 |
| BR-011 | `02` §6.12 / §6.18、`03` §10 / §14 | TS-BUS-004、TS-BUS-006 | TC-BUS-FDB-001、TC-BUS-OUT-005 | 是 | EV-BUS-FDB-001、EV-BUS-OUT-005 | 已覆盖 |
| BR-012 | `02` §6.23、`03` §13、`04` §11 | TS-BUS-002、TS-BUS-008、TS-BUS-009 | TC-BUS-BND-001、TC-BUS-CFG-002 | 是 | EV-BUS-BND-001、EV-BUS-CFG-002 | 已覆盖 |

### 7.5 未覆盖项清单

| 项 | 覆盖状态 | 处理 |
|---|---|---|
| P0 / P0-min 需求 | 无未覆盖项 | 进入 Step 6 展开可执行用例 |
| P1 production MQ / durable store adapter | 当前不覆盖完整产品行为 | Step 14 记录残余风险,后续 P1 专项补矩阵 |
| P2 config center / hot reload / multi-tenant | 当前不覆盖 | Step 14 记录残余风险 |
| DLQ Console UI / observability dashboard / SDK convenience | 当前不覆盖完整产品行为 | 属于其他仓或产品层测试方案 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_05_traceability_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“测试设计取舍”和“未覆盖项清单”小节，了解本章需求追溯、用例编号和证据编号如何收敛。

本测试方案使用 `TS-BUS-xxx` 表示测试场景,`TC-BUS-<AREA>-xxx` 表示测试用例,`EV-BUS-<AREA>-xxx` 表示测试证据,`RP-BUS-<TYPE>-xxx` 表示测试报告。P0 / P0-min 需求必须至少对应一个自动化测试场景和一个证据族,人工审查只能作为补充说明。

当前 CL-001~CL-006、F-001~F-008、BR-001~BR-012 均已建立到设计依据、测试场景、用例编号和证据编号的追溯关系。P1 production adapter 和 P2 config center / hot reload / multi-tenant 不进入当前覆盖矩阵,作为残余风险或后续专项测试范围。

---

## 9. 待确认事项

当前没有阻塞进入 Step 6 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把 US 用户故事放入主矩阵 | A. 主矩阵只放 CL / F / BR;B. CL / US / F / BR 全放;C. 只放 F | 采用 A | US 已通过 F 的支撑故事间接覆盖,主矩阵保持可测试对象清晰 |
| 是否允许一条用例覆盖多条 BR | A. 允许并在矩阵标注;B. 不允许;C. BR 只人工审查 | 采用 A | 边界规则常和功能场景共用触发路径,复用能减少重复 |
| 是否提前固定 evidence 编号 | A. 固定编号族;B. Step 13 再编号;C. 不编号 | 采用 A | Step 6 用例和 Step 13 证据归档需要稳定引用 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个 P0 / P0-min 功能需求已有设计依据 | 已满足 |
| 每个 P0 / P0-min 功能需求已有测试场景 | 已满足 |
| P0 / P0-min 场景均有自动化要求 | 已满足 |
| 每个场景已有用例编号和证据编号族 | 已满足 |
| 未覆盖项已显式列出并说明原因 | 已满足 |

结论: 可以进入 Step 6,设计测试场景与用例矩阵。
