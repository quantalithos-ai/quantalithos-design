# Step 1. 确认测试输入边界

## 1. Step状态

completed / pass_with_external_slots；正式05不可写。

## 2. 本步输入

正式00/01/02/03/04、03 Step16测试切口、03 Step10状态、03 Step8/9协议与flow、04配置项/失效策略、项目台账；05/06/07尚未创建，仅记录承接方向。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 承接什么 | FR/BR、14入口、16对象、状态矩阵、事务/幂等、WorkspaceLimits、profile与fail-closed姿态。 |
| 哪些不能测试为本地truth | owner授权/正文、事件生产、archive/runtime/tools执行、真实部署与跨仓schema。 |
| 当前阻塞 | WS-UP-001~008/006-S、WS-LOCAL-001~003；外部正向用例只能blocked。 |

## 4. 当前材料诊断

03已给出测试发现入口但未形成需求覆盖、数据、环境、门禁和证据策略；04给出逻辑profile但无真实环境值。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 仅有测试文件路径和切口 | 建立需求/设计/配置/证据输入边界 |
| 外部缺口可能被fake掩盖 | blocked正向、可执行本地负向明确区分 |

## 6. 取舍

采用contract→unit→application→adapter→entry→planned integration分层；fake仅证明本地规则，不能证明owner authority、bus replay或生产driver。

## 7. 结构化输入映射

| 输入 | 测试用途 | 回填 |
|---|---|---|
| 00/01/02 | 目标、边界、FR/BR追溯 | §1/2/5 |
| 03 Step6~16 | 对象、协议、flow、状态、事务、切口 | §3~6/10 |
| 04 Step1~14 | profile、limits、secret、失效 | §7~9/12 |
| 上游blocker | blocked矩阵与残余风险 | §10/14 |

## 8. 对详细设计/配置影响判定

| 结论 | 影响03/04 | 处理 |
|---|---|---|
| 仅组织既有测试切口 | 承接 | 无回写 |
| 新增协议、状态或配置字段 | 会影响 | 禁止在05静默新增；阻塞待确认 |
| 外部owner正向fixture | 不改变truth | blocked，不伪造 |

## 9. 回填草稿

正式§1列输入边界、阻塞项和不再回答的问题。

## 10. 待确认与门禁

外部与本地blocker保持开放；输入边界闭合，允许Step2。
