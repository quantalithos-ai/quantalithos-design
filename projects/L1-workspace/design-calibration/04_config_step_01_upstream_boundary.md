# Step 1. 确认配置输入边界

## 1. Step状态

in_progress / pass_with_external_slots；仅完成本步边界盘点，正式04不可写。

## 2. 本步输入

正式00/01/02/03、03 Step14配置绑定、Step15观测、Step16测试、项目台账、配置SOP Step1、配置书写规范§5.1。05/06/07尚未创建，仅记录其承接方向。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 承接哪些输入 | FR/BR中的资源有界、安全、可恢复和环境差异；03 WorkspaceLimits、cursor codec、adapter availability、runtime builder。 |
| 哪些需进入04 | 限额、超时、并发上限、密钥引用、transport/driver/owner slot绑定、profile来源和生效策略。 |
| 哪些不重定义 | 03对象/trait/flow、owner授权、事件schema、业务版本、archive接缝。 |
| 上游缺口 | WS-UP各项和LOCAL-001~003均会阻塞受影响正向配置，不阻止边界设计。 |

## 4. 当前材料诊断

03已给出typed配置字段但未给来源/环境/默认值；外部owner schema和具体driver未闭合。旧draft中的配置示例不具备authority，不能直接继承。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 仅有字段名和算法约束 | 建立配置输入、排除项和后续承接表 |
| 外部slot混在实现前置 | 明确逐项pending与影响范围 |

## 6. 取舍

采用“配置控制面先行、具体值后置”；不因缺少05/06草案而伪造测试或验收事实。配置只控制技术行为，不改变workspace truth。

## 7. 结构化输入映射

| 来源 | 配置输入 | 回填 |
|---|---|---|
| 03 §13 / Step14 | limits、timeout、cursor加密、builder capability | §3/7/8/9 |
| 03 §10~12 | driver隔离、commit unknown、并发预算 | §7/9/11 |
| 03 §14~16 | telemetry/redaction、测试切口 | §10/12 |
| WS-UP/LOCAL | owner endpoint/schema、driver、密钥来源 | §5/6/8；保持blocked |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 既有WorkspaceLimits字段进入来源/校验 | 是（引用既有契约） | 语义补充 | 03 §13 | 无回写 |
| 具体driver/transport schema | 是 | constructor/adapter契约 | 03 §13、Step7/14 | 阻塞待确认 |
| 业务授权、source事件字段 | 否（配置禁止承接） | 外部truth | 不适用 | 无回写 |

## 9. 回填草稿

正式§1列出输入、authority、未闭合slot和不再回答的问题。

## 10. 待确认与门禁

WS-UP-001~008/006-S、LOCAL-001~003进入后续步骤。上游输入边界完整且不越权，允许Step2；本步未关闭任何owner blocker。
