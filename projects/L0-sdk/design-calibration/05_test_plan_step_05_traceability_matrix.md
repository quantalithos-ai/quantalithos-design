# L0-sdk 05 测试方案 Step 5:建立需求追溯与覆盖矩阵

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §5 需求追溯与覆盖矩阵
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 建立需求追溯与覆盖矩阵 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_05_traceability_matrix.md` |

本步建立需求、规则、设计、测试场景、用例编号和证据编号之间的追溯关系。具体前置条件、输入、操作、断言和自动化脚本映射留给 Step 6~Step 9。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `00-需求文档.md` §9 / §10 / §13 / §14 / §16 | 提取 F-001~F-010、BR-001~BR-014、非功能、一票否决和需求追溯基线 |
| `05_test_plan_step_03_test_objects_slices.md` | 提取测试对象和切口 |
| `05_test_plan_step_04_strategy_layers.md` | 提取测试层级和阻断策略 |
| `02-概要设计.md` §5~§11 | 作为主要组成部分、对象、接口、流程、状态和配置影响的设计依据 |
| `03-详细设计.md` §5~§15 | 作为模块、协议、函数流、状态、事务、错误、幂等、配置和观测的设计依据 |
| `04-配置设计.md` §6~§12 | 作为 profile、配置项、敏感配置、加载校验、失效模式和下游测试承接的设计依据 |

## 3. SOP 问题回答

### 3.1 每个 P0 需求对应哪些设计章节?

| 需求 ID | 主要设计依据 |
|---|---|
| F-001 | `02` §5 / §6 / §8 / §9；`03` §5 / §6 / §7 / §8 / §9 / §15 |
| F-002 | `02` §5 / §6 / §7；`03` §5 / §6 / §7 / §15 |
| F-003 | `02` §5 / §7 / §8 / §10；`03` §5 / §7 / §8 / §11 / §13 / §15 |
| F-004 | `02` §5 / §7 / §8 / §10；`03` §5 / §7 / §8 / §11 / §13 / §15 |
| F-005 | `02` §5 / §6 / §10；`03` §5 / §6 / §11 / §14 / §15 |
| F-006 | `02` §5 / §6 / §10 / §11；`03` §6 / §11 / §13 / §14 / §15；`04` §8 / §11 / §12 |
| F-007 | `02` §5 / §8 / §9 / §10；`03` §5 / §8 / §9 / §10 / §15；`04` §6 / §7 / §12 |
| F-008 | `02` §5 / §8 / §10；`03` §7 / §8 / §15；`04` §6 / §12 |
| F-009 | `02` §5 / §6 / §8 / §9；`03` §6 / §8 / §9 / §12 / §15 |
| F-010 | `02` §5 / §6 / §8 / §9 / §10；`03` §6 / §8 / §9 / §11 / §15 |

### 3.2 每个 P0 需求至少有哪些测试场景?

| 需求 ID | 测试场景 |
|---|---|
| F-001 | `TS-SDK-001` 上游 truth consumption 与 derived view 一致性 |
| F-002 | `TS-SDK-002` 三语言 semantic baseline 与 package surface 一致性 |
| F-003 | `TS-SDK-003` formal API / fake boundary 最小 service capability 接入 |
| F-004 | `TS-SDK-004` bus event client view 与 event semantic mapping |
| F-005 | `TS-SDK-005` error mapping 与 trace propagation 一致性 |
| F-006 | `TS-SDK-006` redaction、credential protection 与 forbidden body guard |
| F-007 | `TS-SDK-007` local package candidate 生成、安装与验证 |
| F-008 | `TS-SDK-008` quickstart、docstring 与 docs example 可运行 |
| F-009 | `TS-SDK-009` cross-language smoke 与 evidence 记录 |
| F-010 | `TS-SDK-010` compatibility decision、deprecated lifecycle 与 migration ref |

### 3.3 哪些场景必须自动化?

全部 P0 场景必须自动化。允许人工审查的只包括报告解释、风险接受和后续 P1/P2 决策，但不能替代 P0 自动化证据。

| 场景 | 自动化层级 |
|---|---|
| `TS-SDK-001` | contract + service + integration |
| `TS-SDK-002` | unit + contract + smoke |
| `TS-SDK-003` | service + integration + smoke |
| `TS-SDK-004` | unit + service + contract |
| `TS-SDK-005` | unit + contract + smoke |
| `TS-SDK-006` | unit + integration + CI redaction gate |
| `TS-SDK-007` | service + integration + local candidate gate |
| `TS-SDK-008` | integration + docs gate |
| `TS-SDK-009` | smoke + evidence gate |
| `TS-SDK-010` | unit + service + local candidate gate |

### 3.4 每个场景的证据如何编号?

证据编号按 `EV-SDK-<主题>-<序号>` 组织。Step 5 只定义证据方向，Step 13 再定义报告与归档格式。

| 场景 | 证据 ID | 证据方向 |
|---|---|---|
| `TS-SDK-001` | `EV-SDK-CONTRACT-001` | snapshot ref、contract compare、freshness result、derived view evidence |
| `TS-SDK-002` | `EV-SDK-SEMANTIC-001` | semantic baseline report、language surface diff、concept map smoke |
| `TS-SDK-003` | `EV-SDK-BOUNDARY-001` | service capability receipt、fake / formal marker、diagnostic ref |
| `TS-SDK-004` | `EV-SDK-EVENT-001` | event mapping report、bus semantic compare、publish / subscribe boundary receipt |
| `TS-SDK-005` | `EV-SDK-TRACE-001` | error mapping report、trace propagation report |
| `TS-SDK-006` | `EV-SDK-SECURITY-001` | redaction check report、credential ref-only report、forbidden body scan |
| `TS-SDK-007` | `EV-SDK-CANDIDATE-001` | candidate receipt、artifact digest、install verification result |
| `TS-SDK-008` | `EV-SDK-DOCS-001` | docs runner result、quickstart execution report |
| `TS-SDK-009` | `EV-SDK-SMOKE-001` | Rust / Python / TypeScript smoke result、evidence result / redaction status |
| `TS-SDK-010` | `EV-SDK-COMPAT-001` | compatibility decision、deprecated record、migration guide ref |

### 3.5 哪些需求暂未覆盖,原因是什么?

| 项 | 结论 |
|---|---|
| F-001~F-010 | 均已覆盖 |
| BR-001~BR-014 | 均被功能场景或规则场景覆盖 |
| P0 非功能 | 均进入性能测量、安全、可追溯、可用性或证据场景 |
| P1/P2 能力 | 不作为 P0 覆盖缺口，进入风险或后续专项 |

当前无 P0 需求空洞。公共 registry、remote config、hot reload、完整 MCP / REST / GraphQL / REPL、全量 L1/L2/L3/L4 client coverage 是明确非范围或 P1/P2,不算 P0 未覆盖。

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 旧追溯矩阵按旧规则和旧对象组织，不能覆盖 F-001~F-010 与 BR-001~BR-014 |
| `00-需求文档.md` §16 | 已有需求到验收的上游追溯，可作为测试追溯输入，但还缺“测试场景 / 用例 / 证据”层 |
| `03-详细设计.md` §15 | 已提供测试切口，但还未回指到需求和业务规则 |
| 本 Step | 补齐需求 / 规则到测试场景、用例编号和证据编号的桥接 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 追溯对象 | 旧 binding / wrapper / subscription / release manifest | F-001~F-010、BR-001~BR-014、P0 非功能和一票否决 |
| 设计依据 | 旧概要 / 旧测试口径 | 新版 `02/03/04` 章节 |
| 场景编号 | 旧 `TC-001` 等直接写用例 | 先定义 `TS-SDK-*` 场景，再由 Step 6 细化 `TC-SDK-*` 用例 |
| 证据编号 | artifact / descriptor / manifest 粗粒度证据 | `EV-SDK-*` 证据族，后续 Step 13 归档 |
| 覆盖空洞 | 未系统检查 | P0 无空洞；P1/P2 明确不算 P0 缺口 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否为每个用户故事单独建测试场景 | 不单独建 | US 通过 F 和 BR 覆盖；直接按用户故事建场景会重复 |
| 是否为每条 BR 单独建完整用例 | 不全部单独建 | BR 作为规则切口进入功能场景；一票否决规则单列规则场景 |
| 是否在 Step 5 定义具体输入和断言 | 不定义 | Step 5 只做追溯，Step 6 再写前置、输入、操作、预期结果和断言 |
| 是否允许 P0 需求只人工确认 | 不允许 | SOP 要求 P0 不得只写人工确认 |
| 是否把 P1/P2 非范围列为未覆盖 | 不列为未覆盖 | 它们已在 Step 2 定义为非范围或后续专项 |

## 7. 结构化中间产物

### 7.1 功能需求覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| F-001 | `02` §5/§6/§8/§9；`03` §5/§7/§8/§9/§15 | `TS-SDK-001` 上游 truth consumption | `TC-SDK-CONTRACT-001~003` | 是 | `EV-SDK-CONTRACT-001` | 已覆盖 |
| F-002 | `02` §5/§6/§7；`03` §5/§6/§7/§15 | `TS-SDK-002` 三语言 semantic baseline | `TC-SDK-SEMANTIC-001~003` | 是 | `EV-SDK-SEMANTIC-001` | 已覆盖 |
| F-003 | `02` §5/§7/§8/§10；`03` §7/§8/§11/§13/§15 | `TS-SDK-003` 最小 service capability 接入 | `TC-SDK-BOUNDARY-001~003` | 是 | `EV-SDK-BOUNDARY-001` | 已覆盖 |
| F-004 | `02` §5/§7/§8/§10；`03` §7/§8/§11/§13/§15 | `TS-SDK-004` bus event client view | `TC-SDK-EVENT-001~003` | 是 | `EV-SDK-EVENT-001` | 已覆盖 |
| F-005 | `02` §5/§6/§10；`03` §6/§11/§14/§15 | `TS-SDK-005` error / trace 一致性 | `TC-SDK-TRACE-001~003` | 是 | `EV-SDK-TRACE-001` | 已覆盖 |
| F-006 | `02` §5/§6/§10/§11；`03` §6/§11/§13/§14/§15；`04` §8/§11/§12 | `TS-SDK-006` redaction / credential / forbidden body | `TC-SDK-SECURITY-001~004` | 是 | `EV-SDK-SECURITY-001` | 已覆盖 |
| F-007 | `02` §5/§8/§9；`03` §8/§9/§10/§15；`04` §6/§7/§12 | `TS-SDK-007` local package candidate | `TC-SDK-CANDIDATE-001~004` | 是 | `EV-SDK-CANDIDATE-001` | 已覆盖 |
| F-008 | `02` §5/§8/§10；`03` §7/§8/§15；`04` §6/§12 | `TS-SDK-008` docs example validation | `TC-SDK-DOCS-001~003` | 是 | `EV-SDK-DOCS-001` | 已覆盖 |
| F-009 | `02` §5/§6/§8/§9；`03` §6/§8/§9/§12/§15 | `TS-SDK-009` cross-language smoke | `TC-SDK-SMOKE-001~004` | 是 | `EV-SDK-SMOKE-001` | 已覆盖 |
| F-010 | `02` §5/§6/§8/§9/§10；`03` §6/§8/§9/§11/§15 | `TS-SDK-010` compatibility / deprecated | `TC-SDK-COMPAT-001~004` | 是 | `EV-SDK-COMPAT-001` | 已覆盖 |

### 7.2 业务规则覆盖矩阵

| 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| BR-001 / BR-002 | `02` §3 / §5 / §10；`03` §7 / §13 / §15 | `TS-SDK-001`、`TS-SDK-004` | `TC-SDK-CONTRACT-001`、`TC-SDK-EVENT-001` | 是 | `EV-SDK-CONTRACT-001`、`EV-SDK-EVENT-001` | 已覆盖 |
| BR-003 | `02` §5 / §6；`03` §6 / §15 | `TS-SDK-002`、`TS-SDK-009` | `TC-SDK-SEMANTIC-001`、`TC-SDK-SMOKE-001` | 是 | `EV-SDK-SEMANTIC-001`、`EV-SDK-SMOKE-001` | 已覆盖 |
| BR-004 / BR-011 | `01` §8 / §9；`02` §10；`03` §8 / §13 | `TS-SDK-003` | `TC-SDK-BOUNDARY-001~003` | 是 | `EV-SDK-BOUNDARY-001` | 已覆盖 |
| BR-005 / BR-006 | `00` §4 / §10；`01` §13；`02` §3 | `TS-SDK-003`、`TS-SDK-006` | `TC-SDK-BOUNDARY-003`、`TC-SDK-SECURITY-004` | 是 | `EV-SDK-BOUNDARY-001`、`EV-SDK-SECURITY-001` | 已覆盖 |
| BR-007 | `02` §10 / §11；`03` §11 / §14 / §15；`04` §8 / §12 | `TS-SDK-006` | `TC-SDK-SECURITY-001~004` | 是 | `EV-SDK-SECURITY-001` | 已覆盖 |
| BR-008 / BR-014 | `02` §9 / §10；`03` §9 / §11 / §15 | `TS-SDK-001`、`TS-SDK-010` | `TC-SDK-CONTRACT-003`、`TC-SDK-COMPAT-001~004` | 是 | `EV-SDK-CONTRACT-001`、`EV-SDK-COMPAT-001` | 已覆盖 |
| BR-009 | `02` §9 / §10；`03` §9 / §11 | `TS-SDK-010` | `TC-SDK-COMPAT-003~004` | 是 | `EV-SDK-COMPAT-001` | 已覆盖 |
| BR-010 / BR-012 | `00` §4 / §10 / §13；`01` §14；`04` §7 / §13 | `TS-SDK-007`、`TS-SDK-009` | `TC-SDK-CANDIDATE-004`、`TC-SDK-SMOKE-004` | 是 | `EV-SDK-CANDIDATE-001`、`EV-SDK-SMOKE-001` | 已覆盖 |
| BR-013 | `00` §10 / §13；`03` §14 / §15 | `TS-SDK-006`、`TS-SDK-009` | `TC-SDK-SECURITY-004`、`TC-SDK-SMOKE-003` | 是 | `EV-SDK-SECURITY-001`、`EV-SDK-SMOKE-001` | 已覆盖 |

### 7.3 未覆盖项清单

| 项 | 覆盖状态 | 说明 |
|---|---|---|
| F-001~F-010 | 已覆盖 | 均有测试场景、用例编号范围、自动化要求和证据 ID |
| BR-001~BR-014 | 已覆盖 | 通过规则分组矩阵覆盖 |
| P0 非功能 | 已覆盖 | 性能测量、安全、可追溯、可用性和观测进入对应场景 |
| P1/P2 非范围 | 不纳入 P0 覆盖 | public registry、remote config、hot reload、MCP、REST / GraphQL、REPL、offline cache、全量服务覆盖后移 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §5 时摘录。

```markdown
## 5. 需求追溯与覆盖矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_05_traceability_matrix.md`

本章把 `00-需求文档.md` 中的 F-001~F-010、BR-001~BR-014 和 P0 非功能目标追溯到新版 `02/03/04` 设计依据、测试场景、用例编号范围和证据编号。全部 P0 需求必须自动化验证，不允许只以人工确认作为覆盖结果。

当前 P0 覆盖无空洞。public registry、remote config、hot reload、完整 MCP / REST / GraphQL / REPL、offline cache 和全量 L1/L2/L3/L4 client coverage 已在 Step 2 定义为非范围或 P1/P2,不作为 P0 未覆盖项。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| Step 6 是否沿用 `TC-SDK-*` 编号族 | 是 | Step 5 已建立追溯占位，Step 6 应细化而不是重新编号 |
| Step 13 是否沿用 `EV-SDK-*` 证据编号族 | 是 | 验收标准需要稳定引用证据 ID |
| 是否需要为每条 BR 单独一条用例 | 不需要 | BR 已分组覆盖；一票否决类规则进入具体负向用例 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| F-001~F-010 均有设计依据 | 已满足 |
| F-001~F-010 均有测试场景 | 已满足 |
| F-001~F-010 均有用例编号范围 | 已满足 |
| F-001~F-010 均有证据 ID | 已满足 |
| BR-001~BR-014 均有覆盖 | 已满足 |
| P0 未覆盖项已检查 | 已满足 |

Step 6 可以在本文件被确认后开始,主题是设计测试场景与用例矩阵。
