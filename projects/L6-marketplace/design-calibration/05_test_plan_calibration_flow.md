# L6-marketplace 05 测试方案校准流

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 书写规范：`standards/document/测试方案书写规范.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 真相源闭环：`standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档：`projects/L6-marketplace/05-测试方案.md`
> 创建日期：2026-10-02
> 执行方式：full-restart / single-agent / no implementation

## 1. 本轮目标

将当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md` 中已经收稳的契约转译为可落码、可追溯、可失败的测试方案。旧 `05-测试方案.md` 与旧 `06-验收标准.md` 只作为 `historical_material`，不得提供当前对象、状态、用例或证据真相。

本轮只定义测试设计、测试数据形状、环境姿态、自动化门禁、证据 schema 和残余风险；不实现代码，不运行测试，不创建真实 artifact/report/evidence，不把测试方案写成验收 verdict 或 readiness。

## 2. 权威输入和禁止回写

| 输入 | 权威用途 | 当前状态 |
|---|---|---|
| `00-需求文档.md` | C-MP-1～5、FR/BR/NFR/AC/VETO、数据归属和边界 | 正式输入 |
| `01-架构设计.md` | 运行单元、依赖裁剪、所有权、禁止反向依赖 | 正式输入 |
| `02-概要设计.md` | 七个 U、组件、对象、接口骨架、处理流和状态概览 | 正式输入 |
| `03-详细设计.md` | 43 对象、17 ports/146 methods、21C/16Q/12J、49 flows、14 carriers、事务/错误/幂等/观测和 Step16 切口 | 直接测试真相源 |
| `03_ddd_step_16_test_cuts.md` | 最小模块、入口、状态、一致性、安全和配置切口 | 直接测试切口 |
| `04-配置设计.md` | 严格 JSON、六域、七字段、八 slot、四 profile、加载/失效/回滚 | 直接配置测试真相源 |
| 旧 `05/06` | 只用于识别旧 commerce/install/payment 口径和验收方向 | historical_material |

测试方案不得补造对象字段、DTO、port、state、error、version、id、payload source、evidence source、owner approval、支付或安装真相。发现无法 1:1 落码或无法生成可审计证据的缺口时，记录为 blocker 并回指 03/04，不能在 05 私自修补。

## 3. Step 状态和停审规则

当前恢复点：Step1～15已按实际产物完成设计回核，正式05旧稿删除后重建15章并分批装配，最终静态审查完成；design completed / selfcheck_done / confirmed input。2026-10-02用户明确“现在完成全部 06”，解除05→06等待；历史停审记录保留，不作为运行或签核事实。[最终静态记录](05_test_plan_static_review_record.md)仅文档核对。

| Step | 主题 | 中间产物 | 状态 |
|---:|---|---|---|
| 01 | 测试输入边界 | `05_test_plan_step_01_input_boundary.md` | completed / gate_status=pass |
| 02 | 测试目标、范围、非范围 | `05_test_plan_step_02_scope.md` | completed / gate_status=pass |
| 03 | 测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | completed / gate_status=pass |
| 04 | 测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | completed / gate_status=pass |
| 05 | 需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | completed / gate_status=pass |
| 06 | 测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | completed / gate_status=pass |
| 07 | 测试数据 | `05_test_plan_step_07_test_data.md` | completed / gate_status=pass |
| 08 | 测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | completed / gate_status=pass |
| 09 | 自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | completed / gate_status=pass |
| 10 | 专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | completed / gate_status=pass |
| 11 | 缺陷管理与复验 | `05_test_plan_step_11_defects_retest.md` | completed / gate_status=pass |
| 12 | 进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | completed / gate_status=pass |
| 13 | 测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | completed / gate_status=pass |
| 14 | 回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | completed / gate_status=pass |
| 15 | 正式文档装配 | `05_test_plan_step_15_formal_document_assembly.md` | completed / selfcheck_done / stop_review / waiting_user_confirmation |

每个 Step 产物均独立保留：Step 状态、本步目标、输入/输出、SOP 问题回答、材料诊断、前后对比、取舍、结构化产物、回填草稿、待确认事项、详细设计影响判定和下一步条件。每个 P0 测试切口在 Step 3/6 中单独列出并停审；全部 P0 切口完成后在 Step 6/15 做跨切口审计。

### 3.1 文档级恢复/装配门禁

| 字段 | 当前值 |
|---|---|
| gate_status | pass（05→06设计授权；外部资格不变） |
| gate_reason | 用户明确授权全部06，05作为confirmed input；不是运行通过 |
| next_allowed_action | 读取06 SOP/规范并严格执行06 Step1～15；不进入07 |
| source_files | 下表逐Step输入+各Step§2具体source及Step6/13规范性附录 |
| 当前工作证明 | 15章/104需求/98唯一TC-EV/49入口字段/13CUT/11suite/13DS；schema可解析；静态记录完成，无actual run |

### 3.2 总流程计划与前序依赖

共同输入：测试SOP/书写规范、中间产物规范与闭环标准适用段；每行输出为§3同编号主Step，复杂部分附录必须随主控读取。当前状态以§3状态表为准；完成门禁只针对设计，不关闭external blocker。

| Step | source_files/前序依赖 | 完成门禁/下一许可 |
|---|---|---|
| 01 | 当前00～04、03 Step16；用户授权全部05 | 权威/历史/资格上限确定→02 |
| 02 | Step01诊断/取舍/待确认、00目标/BR/AC | P0/P1/P2/非范围明确→03 |
| 03 | Step02、03对象/协议/矩阵/Step16 | 43/49/14/13CUT来源齐备→04 |
| 04 | Step03、03模块、04profile | 风险分层/11suite/时机→05 |
| 05 | Step04、00全部104ID、03/04 | 正反/TC/EV/反向CUT候选闭包→06 |
| 06 | Step05、03七U/ports/flow/state/error | 98TC+49字段索引+13CUT独立停审→07 |
| 07 | Step06、03字段/Row/PG、04secret | 13DS/隔离/清理/13CUT数据停审→08 |
| 08 | Step07、01依赖裁剪、03runtime、04 | 四profile/七字段/八slot/不可用→09 |
| 09 | Step08、Step04/06、固定paths | 11suite/98主TC/scripts/失败raw-report→10 |
| 10 | Step09、00NFR/VETO、03一致性/观测 | 硬不变量与candidate测量分离→11 |
| 11 | Step10/06、VETO/风险 | S/A/B/复验与证据失效可判定→12 |
| 12 | Step11/07/08/09 | scope/进入退出条件无模糊/无伪勾选→13 |
| 13 | Step12/06/09、00AC、闭环§7 | strict schema/DAG/EV/raw/report/成熟度→14 |
| 14 | Step13/11、03§17/04风险 | 回归/12开放项/authority/重开明确→15 |
| 15 | 前14Step及全部规范性附录、书写规范15章 | 三层门禁→删除/骨架/分章装配→静态审计→stop_review，不自动进入06 |

正式 `05-测试方案.md` 只在 Step 15 由 Step 1～14 装配。完成正式 05 后立即设置 `stop_review / waiting_user_confirmation`，不得读取或进入 06 的正式工作流，除非用户另行确认。

## 4. 固定测试和证据编号

### 4.1 测试用例编号

```text
TC-<MODULE>-<三位序号>
```

模块值固定为 `SOURCE`、`REVIEW`、`CATALOG`、`DISTRIBUTION`、`WITHDRAWAL`、`RECOVERY`、`REFERENCE`、`CONFIG`、`CROSS`。同一编号只能对应一个断言集合；用例重命名必须保留变更记录，不得复用旧 commerce/install 编号。

### 4.2 证据编号

```text
EV-<LEVEL>-<三位序号>
```

`LEVEL` 只能使用 `UNIT`、`DOMAIN`、`API`、`WORKER`、`PG`、`WEB`、`CONFIG`、`RECOVERY`、`REDACTION`、`RELEASE`。本轮只规划编号和 schema，不创建真实证据实例。

### 4.3 固定路径

```text
artifacts/test/<run_id>/
reports/runs/<run_id>/
reports/acceptance/
scripts/gates/*.sh
scripts/checks/*.sh
scripts/reports/*.sh
```

禁止项目名重复目录、`latest` 引用、把脚本放进报告目录、跨 run 拼接证据或用静态表格代替 raw artifact。任何未来 evidence 必须同一 `run_id` 绑定 case、suite、raw、report、design refs 和 redaction/integrity 状态。

## 5. 固定 P0 红线

以下事项命中即阻断后续验收准备，不得以 P1、界面演示、ACK、扫描、签名、fake 结果或配置标签覆盖：

1. 复制 owner 正文、Artifact 正文/血缘、Identity truth、Governance approval 或 credential。
2. Marketplace 自行生成/推断 approval，或用签名、扫描、ACK、摘要 fresh 代替正式 Governance 决定。
3. 查询、索引、Web、缓存或配置绕过 scope、visibility、撤回、版本和 current disclosure。
4. 把 distribution ACK 当 installed、把获取当 paid/subscribed、或没有 Billing owner 却生成财务结果。
5. 撤回后放行新分发、Unknown 当成功、blind retry、删除历史或恢复外部 truth。
6. Query/replay 写入业务真相，Observation/审计递归，日志/trace/report 泄露 raw body、secret 或高基数标签。
7. 生产 fake fallback、静态 evidence、缺 raw artifact/report pairing、或把 blocked/unavailable 写成 pass/ready。

## 6. 当前外部资格与证明上限

`MP-UP-001～008`、`MP-SRC-003/010/013`、`Q-MP-01` 以及受影响 owner/SDK/provider/PG/TLS/auth 资格继续为 `pending / blocked / affected / future`。因此：

- P0 可以计划并验证本地 contracts/domain/application、controlled/fake seam、PG 原子性、API/Worker/Web 映射、配置 fail-fast、redaction 和失败恢复；
- 正式 owner/SDK positive integration、真实 publisher/organization 资格、Governance binding、receiver/notice/observation producer、签名/扫描材料、安装/支付/送达结果只能进入 blocked 或 future；
- 文档完成不等于测试执行完成，不生成 run、commit、digest、扫描、签名、支付、evidence、verdict、signoff 或 readiness。

## 7. 进入 06 的唯一条件

只有用户明确确认本轮正式05，才可按06 SOP重新启动。2026-10-02用户“现在完成全部 06”已满足文档切换授权；06状态见[06 flow](06_acceptance_calibration_flow.md)，07仍not_started。原完成时的停审点保留为历史，不重写静态审查事实。
