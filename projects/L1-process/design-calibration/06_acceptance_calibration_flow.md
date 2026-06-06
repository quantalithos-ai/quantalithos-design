# L1-process 06 验收标准校准流程

> SOP: `standards/document/验收标准讨论流程_SOP.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 目标文档: `projects/L1-process/06-验收标准.md`
> 上游输入: `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. 流程状态

| Step | 文件 | 状态 | 回填章节 |
|---|---|---|---|
| Step 1 | `06_acceptance_step_01_input_boundary.md` | Completed | §1 |
| Step 2 | `06_acceptance_step_02_scope.md` | Completed | §2 |
| Step 3 | `06_acceptance_step_03_baseline.md` | Completed | §3 |
| Step 4 | `06_acceptance_step_04_entry_exit.md` | Completed | §4 |
| Step 5 | `06_acceptance_step_05_function_gate.md` | Completed | §5 |
| Step 6 | `06_acceptance_step_06_data_architecture_redline.md` | Completed | §6 |
| Step 7 | `06_acceptance_step_07_interface_event_sync.md` | Completed | §7 |
| Step 8 | `06_acceptance_step_08_state_transaction_consistency.md` | Completed | §8 |
| Step 9 | `06_acceptance_step_09_non_functional_gate.md` | Completed | §9 |
| Step 10 | `06_acceptance_step_10_observability_evidence.md` | Completed | §10 |
| Step 11 | `06_acceptance_step_11_veto.md` | Completed | §11 |
| Step 12 | `06_acceptance_step_12_defect_retest_release.md` | Completed | §12 |
| Step 13 | `06_acceptance_step_13_risk_acceptance.md` | Completed | §13 |
| Step 14 | `06_acceptance_step_14_conclusion_signoff.md` | Completed | §14 |
| Step 15 | `06_acceptance_step_15_formal_document_assembly.md` | Completed | 全文 |

---

## 2. 执行纪律

- 正式 `06-验收标准.md` 必须先删除旧版,再按新版 15 章主链重建。
- 每章必须引用具体 `design-calibration/06_acceptance_step_*.md` 来源。
- `06` 只裁决通过 / 有条件通过 / 不通过,不定义测试步骤、实现 phase、DTO 字段或部署命令。
- P0 门禁必须回指 `AC-PROC-*`、`TC-PROC-*`、`EV-*`、design contract 和固定 report path。
- `latest`、旧 `TC-001`、旧性能硬阈值和旧 10 章验收结构不得进入新版正式文档。

---

## 3. 当前输入事实

| 来源 | 状态 | 对 06 的约束 |
|---|---|---|
| `00-需求文档.md` | 已重建 | 提供 `AC-PROC-001`~`029`、`VF-PROC-001`~`008`、C-1~C-5 和边界红线 |
| `01-架构设计.md` | 已重建 | 提供 Process truth center、唯一编译期依赖、外部正文排除和数据所有权 |
| `02-概要设计.md` | 已重建 | 提供主要组成、关键对象、处理流和状态边界 |
| `03-详细设计.md` | 已装配 | 提供 13 Command、11 Query、7 inbound、10 outbound、7 job、16 状态机和事务 / 幂等 / 错误契约 |
| `04-配置设计.md` | 已装配 | 提供 P0 profile、38 个 P0 配置项、source priority、ref-only sensitive 和 fail-fast 规则 |
| `05-测试方案.md` | 已装配 | 提供 `TC-PROC-*`、`EV-*`、suite、artifact / report path 和缺陷 / 退出准则 |
| `07-实施计划.md` | 待生成 | 不作为当前验收输入,只在后续承接门禁 |

---

## 4. 正式文档装配完成检查

- Step 1~14 均已形成中间产物。
- 正式 `06-验收标准.md` 已按 15 章主链重建。
- 每章均有校准来源。
- 一票否决项不可风险接受。
- 风险接受要求接受人、owner、后续动作、截止时间和 tracking ref。
- 正式文档不写真实测试执行结论,送验时再填 implementation commit、build、run_id 和签署结果。
