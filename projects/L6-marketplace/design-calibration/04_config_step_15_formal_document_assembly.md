# 04 Step 15：正式配置设计文档装配

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review / waiting_user_confirmation`。Step1～14均已完成，正式`04-配置设计.md`已按15章主链装配并完成静态审查；未经用户确认不进入05。

## 2. 本步目标

**目标**：将已停审的Step产物转译为正式配置设计正文，保留追溯入口和外部blocker，不引入中间产物之外的新事实。

### 本步输入

- `04_config_step_01_upstream_boundary.md`～`04_config_step_14_risks_open_questions.md`。
- 正式[00需求](../00-需求文档.md)、[01架构](../01-架构设计.md)、[02概要](../02-概要设计.md)、[03详细设计](../03-详细设计.md)。
- 配置设计SOP、配置设计书写规范、中间产物规范和项目执行台账。

### 本步输出

正式`04-配置设计.md`、`04_config_static_review_record.md`、更新flow/ledger为04完成停审。

### 当前材料问题诊断与取舍

旧04正式文档不存在可作为当前authority；draft和历史材料没有完整来源、profile、secret和失败闭环。按“先15章骨架、再逐Step回填、最后静态审计”的方式装配，只吸收已停审结论，不继承历史默认值或外部完成状态。

### 改动前后对比

| 之前 | 本Step后 |
|---|---|
| 没有当前正式04基线 | 15章正式配置设计和逐章来源映射 |
| 配置语义分散在03/draft | 六域、七字段、八slot和JSON demo闭环 |
| 外部资格可能被静态文档掩盖 | pending/blocked/future和证据上限原样保留 |

### SOP问题回答

1. **正式文档按什么结构装配？** 使用配置书写规范固定的15章主链，每章列具体Step来源和延伸阅读。
2. **哪些内容可以进入正文？** 只进入Step1～14已停审的配置结论；问题回答、诊断、取舍和停审日志留在calibration。
3. **装配后是否进入05？** 否。完成静态审查后立即停在`waiting_user_confirmation`，用户确认前不读取05 SOP。

## 3. 装配规则

1. 正式文档固定使用§1～§15主链，不把SOP问题回答、旧材料诊断或模块停审记录搬进正文。
2. 每章正文开头列出具体`design-calibration/04_config_step_*.md`校准来源，并说明延伸阅读小节。
3. 只写六个配置域、七个RuntimeConfig字段、八个owner slot和Web build-time API base；`schema_version`/`profile`只作envelope metadata。
4. 不写真实DSN、secret、部署命令、数值baseline、provider名称、测试run、资产包、digest、扫描/签名/支付结果、evidence、verdict、signoff或readiness。
5. Step14的MP-UP/MP-SRC/Q和provider/平台风险必须保留；外部`pending/blocked`不改写为本地`ready`。
6. 由于本项目原有正式04不存在，先创建15章骨架再按100～300行写入批次装配；不继承旧README/draft作为authority。

## 4. 正式章节与来源映射

| 正式章节 | 主要校准来源 | 回填状态 |
|---|---|---|
| §1 上游关系 | Step1 | ready |
| §2 目标范围 | Step2 | ready |
| §3 控制面 | Step3 | ready |
| §4 分类边界 | Step4 | ready |
| §5 来源优先级 | Step5 | ready |
| §6 profile矩阵 | Step6 | ready |
| §7 配置项 | Step7 | ready |
| §8 敏感配置 | Step8 | ready |
| §9 加载校验 | Step9 | ready |
| §10 变更审计 | Step10 | ready |
| §11 失效降级 | Step11 | ready |
| §12 下游承接 | Step12 | ready |
| §13 演进 | Step13 | ready |
| §14 风险 | Step14 | ready |
| §15 参考 | 本Step + 上游正式文档 | ready |

## 5. 正式文档静态审查计划与结果

| 审查项 | 结果 | 记录 |
|---|---|---|
| 15章标题和顺序 | pass | 与配置书写规范主链一致 |
| 每章具体校准来源 | pass | 指向Step1～14文件，含延伸阅读 |
| 七字段映射 | pass | §7逐项核对；无第八业务字段 |
| 六配置域 | pass | api/storage/sdk/owner/worker/web；无泛化域 |
| 八slot | pass | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation |
| JSON/JSONC demos | pass | §7模块demo与完整说明demo；占位符明确不可运行 |
| secret/redaction | pass | §8引用、provider、轮换和禁止输出闭合 |
| startup/build-time/hot | pass | server startup、Web build-time、hot/reload not_applicable |
| 禁止配置化 | pass | approval/visibility/state/幂等/证据/财务/Archive等均列出 |
| 03影响审计 | pass | 各Step无`待回写`；不新增字段/port/error/flow |
| 外部真实性 | pass | pending/blocked/future保留；无伪造证据 |
| 链接/围栏/表格 | pass | 仅做静态文本检查；无实现测试 |

## 6. 完成门禁

正式04完成后同步：

- `04_config_calibration_flow.md`：Step1～15 `completed / selfcheck_done / stop_review`，当前文档`waiting_user_confirmation`。
- `project_execution_ledger.md`：当前恢复点切到04 Step15/静态审查；04→05保持blocked until user confirmation。
- `04_config_static_review_record.md`：记录章节、字段、链接、禁止项和范围内diff检查。

不创建05 calibration、不读取05 SOP、不创建implementation ledger或boundary skeleton；后两者仍等正式07。实现和运行状态继续为planned/not-run/blocked。

## 7. 详细设计影响判定

正式装配只转译Step1～14已收口内容；没有新增RuntimeConfig字段、adapter constructor、port、error、DTO、state或flow，处理状态为`无回写`。

### 进入下一步的条件

Step15完成后不自动进入下一文档；保持`waiting_user_confirmation`，等待用户明确确认04。确认前不得读取05 SOP或创建05产物。

## 7. 待确认事项

用户需要审阅正式04中的六域、七字段、八slot、profile、secret和fail-fast口径。确认前不得进入05；若用户要求更改导致RuntimeConfig、port、error、flow或scope变化，必须回写03并重开受影响Step。
