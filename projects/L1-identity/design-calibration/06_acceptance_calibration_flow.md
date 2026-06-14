# L1-identity 验收标准校准工作台

> 对应正式文档: `projects/L1-identity/06-验收标准.md`
> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03/04/05` 重建 `L1-identity` 的 `06-验收标准.md`
> 当前状态: Step 15 formal document assembly 已审核通过

---

## 1. 本轮重写原则

- 新版 `06` 必须承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和已审核通过的 `05-测试方案.md`。
- 旧版 `06-验收标准.md` 只作为历史诊断输入,不得直接继承旧章节、旧验收项、旧对象名、旧 evidence 口径、旧基线或旧通过条件。
- 验收标准是裁决文档,只回答“通过 / 有条件通过 / 不通过”的判定条件,不替代测试方案、测试报告、实施计划或运维 runbook。
- 每个 P0 验收项必须闭环到正式需求 / 设计契约、测试用例、证据 ID、固定 report path、通过条件、失败条件和裁决影响。
- `VETO-ID-001~006` 命中不得风险接受,不得通过“有条件通过”绕开。
- 证据必须绑定固定 `<run_id>`,优先引用 `reports/runs/<run_id>/...` 和 `reports/acceptance/...`,不得引用 `latest`。
- 正式 `06-验收标准.md` 只能在 Step 15 由 Step 1~14 中间产物装配生成,不得提前直接改写正式文档。
- 本轮按“大文件先建框架、再逐 Step / 逐章节写入”执行:总流程计划可以一次列全,未来 Step 文件只能在对应 Step 到达时创建。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 新版正式输入 | C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID、数据归属和一票否决来源 |
| `projects/L1-identity/01-架构设计.md` | 新版正式输入 | truth boundary、dependency boundary、data ownership、cross-repo collaboration 和架构红线来源 |
| `projects/L1-identity/02-概要设计.md` | 新版正式输入 | 组件、关键对象、接口骨架、处理流、状态边界和异常边界来源 |
| `projects/L1-identity/03-详细设计.md` | 新版正式输入 | object/protocol/flow/state/transaction/error/idempotency/config/observability/test cuts 的正式契约来源 |
| `projects/L1-identity/04-配置设计.md` | 新版正式输入 | profile、source priority、strict JSON、redaction、runtime builder、adapter mode、failure/degraded 和 rollback digest 来源 |
| `projects/L1-identity/05-测试方案.md` | Step 15 已审核通过 | TC、EV、suite、artifact/report、redaction、dependency、evidence index、risk residual 和测试退出口径来源 |
| `projects/L1-identity/06-验收标准.md` | 旧 / 待重建草案 | 只作为历史诊断输入;不得作为新版验收基线 |
| `standards/document/验收标准讨论流程_SOP.md` | 当前流程标准 | Step 1~15 执行依据 |
| `standards/document/验收标准书写规范.md` | 当前书写标准 | 正式 `06` 15 章主链、证据引用和三值结论规则来源 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前中间产物标准 | Step 文件结构、停审、追溯和大文件分批写作纪律来源 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认验收输入边界 | 新版 `00/01/02/03/04/05`、旧 `06`、验收 SOP / 规范 | `06_acceptance_step_01_input_boundary.md` | 无 | 已审核通过 | 验收输入、边界、必须回答 / 不再回答和上游缺口判断明确 | 已进入 Step 2 |
| 2 | 明确验收目标与范围 | Step 1、`00` AC / VETO、`05` 测试范围 | `06_acceptance_step_02_scope.md` | Step 1 | 已审核通过 | 验收目标、范围、非范围和 P0/P1/P2 裁决边界闭合 | 已进入 Step 3 |
| 3 | 固定验收基线 | Step 2、送验版本、测试 run、环境配置 | `06_acceptance_step_03_baseline.md` | Step 2 | 已审核通过 | 需求 / 设计 / 测试 / 交付 / 环境 / 数据 / evidence run 基线可定位 | 已进入 Step 4 |
| 4 | 定义进入条件与退出条件 | Step 3、`05` entry/exit | `06_acceptance_step_04_entry_exit.md` | Step 3 | 已审核通过 | 验收进入 / 退出条件可判定,无口头条件 | 已进入 Step 5 |
| 5 | 定义功能验收门禁 | Step 2~4、`00` FR/BR/AC、`03` flows、`05` TC/EV | `06_acceptance_step_05_function_gate.md` | Step 4 | 已审核通过 | P0 功能验收项完成设计契约、TC、EV、report path 和裁决影响闭环 | 已进入 Step 6 |
| 6 | 定义数据边界与架构红线验收 | Step 5、`00/01/03` 数据和架构红线、`05` redaction/dependency evidence | `06_acceptance_step_06_boundary_gate.md` | Step 5 | 已审核通过 | 数据所有权、forbidden material、dependency boundary 和 no-write 红线可检查 | 已进入 Step 7 |
| 7 | 定义接口、事件与跨仓同步验收 | Step 5~6、`03` protocols、`05` suite / evidence | `06_acceptance_step_07_interface_sync_gate.md` | Step 6 | 已审核通过 | Command / Query / Event / Job / cross-repo seam 的验收口径闭合 | 已进入 Step 8 |
| 8 | 定义状态机、事务与一致性验收 | Step 5~7、`03` state/transaction/idempotency、`05` consistency tests | `06_acceptance_step_08_state_tx_consistency.md` | Step 7 | 已审核通过 | 状态、事务、幂等、并发、副作用断言和非法转换证据闭合 | 已进入 Step 9 |
| 9 | 定义非功能验收门禁 | Step 5~8、`00` NFR、`04` config、`05` NFR evidence | `06_acceptance_step_09_nonfunctional.md` | Step 8 | 已审核通过 | 性能 sample、availability/degraded、安全、redaction、observability 的裁决口径明确 | 已进入 Step 10 |
| 10 | 定义可观测性、审计与证据门禁 | Step 5~9、`03` observability、`05` evidence/report schema | `06_acceptance_step_10_evidence_audit.md` | Step 9 | 已审核通过 | audit/trace/log/metric/report/evidence index/acceptance handoff 门禁闭合 | 已进入 Step 11 |
| 11 | 定义一票否决项 | Step 5~10、`00` VETO、`01/03/05` 红线和检查证据 | `06_acceptance_step_11_blockers.md` | Step 10 | 已审核通过 | `VETO-ID-001~006` 来源、检查证据、report path 和触发裁决闭合 | 已进入 Step 12 |
| 12 | 定义缺陷分级、复验与放行规则 | Step 11、`05` defect/retest、evidence gate | `06_acceptance_step_12_defects_release.md` | Step 11 | 已审核通过 | S/A/B 缺陷、复验、放行和阻断规则与 VETO 一致 | 已进入 Step 13 |
| 13 | 定义风险接受与遗留项 | Step 12、`05` residual risk、待确认事项 | `06_acceptance_step_13_risk_acceptance.md` | Step 12 | 已审核通过 | 有条件通过风险接受具备接受人、理由、后续动作和截止时间 | 已进入 Step 14 |
| 14 | 定义最终结论与签署口径 | Step 5~13 全部门禁 | `06_acceptance_step_14_conclusion_signoff.md` | Step 13 | 已审核通过 | 三值结论、签署角色、风险接受关系和下一阶段许可闭合 | 已进入 Step 15 |
| 15 | 整理正式验收标准文档 | Step 1~14、书写规范 | `06_acceptance_step_15_formal_document_assembly.md` 与 `../06-验收标准.md` | Step 14 | 已审核通过 | 正式 `06` 15 章主链、校准来源、跨门禁裁决总审计和旧口径清理完成 | 本轮验收标准重建完成 |

---

## 4. Step 内统一执行模板

每个 `06_acceptance_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步目标
3. 本步输入
4. SOP 问题回答
5. 当前文档问题诊断
6. 改动前后对比
7. 验收裁决取舍
8. 结构化中间产物
9. 对上游 / 下游文档的影响判定
10. 回填草稿
11. 待确认事项
12. 进入下一步条件

涉及 P0 验收项的 Step 必须按以下小循环展开,不得先生成全局门禁总表再事后补证据:

```text
验收主题 / 范围项
  -> 验收项
  -> 设计契约
  -> 测试用例
  -> 证据 ID / report path
  -> 通过条件 / 失败条件
  -> 裁决影响
  -> 验收项停审
```

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ID-ACCEPT-WATCH-001 | 旧 `06` 早于新版 `03/04/05`,含旧对象、旧流程、旧证据和旧章节结构 | 旧 `06` 诊断 | Step 1 降级为历史诊断输入;Step 15 重建正式文档 |
| ID-ACCEPT-WATCH-002 | 新版 `05` 已固定 TC / EV / suite / artifact / report 结构 | `05` §6 / §9 / §13 | Step 5~11 必须消费这些证据结构,不得另造 evidence schema |
| ID-ACCEPT-WATCH-003 | 正式验收基线需要固定 `<run_id>`、送验版本、环境和数据 | 验收 SOP Step 3 | Step 3 闭合;Step 1 不提前发明具体 run |
| ID-ACCEPT-WATCH-004 | P1 selected-run、真实产品、production capacity 不属于 P0 必过 | `05` §14 | Step 2 / Step 9 / Step 13 明确 residual 或条件通过口径 |
| ID-ACCEPT-WATCH-005 | VETO 不得被风险接受覆盖 | `00` §14 / `05` §14.5 | Step 11 / Step 13 强制审计 |
| ID-ACCEPT-WATCH-006 | 正式 `06` 每章必须标注具体校准来源 | 验收书写规范 §3.1 | Step 15 装配时逐章写入 |
| ID-ACCEPT-WATCH-007 | 验收标准不能记录测试执行流水账 | 验收 SOP / 书写规范 | Step 3 只固定基线,Step 10 只定义证据门禁,不粘贴日志 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `06-验收标准.md` | Step 15 已按 Step 1~14 中间产物重建并审核通过 |
| 当前完成 Step | Step 15 formal document assembly 已审核通过 |
| 当前下一步 | 本轮 `06-验收标准.md` 重建完成 |
| 是否创建 / 替换未来 Step 文件 | 未创建未来 Step 文件 |
| 旧 `06-验收标准.md` 如何处理 | 已在 Step 15 按 Step 1~14 结果重建正式文档 |
