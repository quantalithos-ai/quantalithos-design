# Step 2. 明确目标、范围和非范围

## 1. Step状态

completed / pass_with_external_slots；本步按配置SOP独立完成，未执行代码或部署。

## 2. 本步输入

承接前一步产物、正式03 §13~16、配置SOP对应Step和配置书写规范；05/06/07尚未创建的部分只记为后续承接方向。

## 3. SOP问题回答

控制面覆盖limits、timeouts、crypto binding、adapter availability和运行profile；不配置业务语义、授权、事件内容、游标真相、projection状态或下游协议。

## 4. 当前材料问题诊断

03给出typed技术契约但未给出本步配置收口；历史草稿和示例没有authority，不能继承为默认值。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 配置结论分散或未定义 | 形成可追溯的明确目标、范围和非范围结论 |
| 外部缺口可能被默认值掩盖 | 未闭合项标记blocked |

## 6. 配置设计取舍

采用typed、显式、fail-closed配置；不以JSON/String/默认Bound补齐缺口。配置只控制技术运行行为，不改变workspace truth、授权或协议。

## 7. 结构化中间产物

| 配置域/结论 | 来源 | 作用域 | 敏感性 | 生效/失败 |
|---|---|---|---|---|
| resource limits/timeouts | 03 §13 / Step14 | profile | non-secret | startup validate；超限拒绝 |
| storage/owner/bus binding | 03 Step4/14 | profile | ref/secret | capability gate；缺失Unavailable |
| cursor crypto | 03 §13/Step14 | global key ref | secret | startup/load；不可降级 |
| observability redaction | 03 §14/15 | process | non-secret | startup；不影响业务 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 既有WorkspaceLimits与fail-closed语义 | 是（承接） | 配置语义 | 03 §13 | 无回写 |
| 具体外部driver/transport/provider | 是 | adapter/builder绑定 | 03 §13、Step7 | 阻塞待确认 |
| 新业务授权/状态配置 | 是 | truth/flow | 不允许 | 无回写（禁止配置化） |

## 9. 回填草稿

正式04 §2回填本步结论，并链接本Step作为字段级来源。

## 10. 待确认与门禁

WS-UP-001~008/006-S、WS-LOCAL-001~003持续开放；本步无新增待回写项，允许进入下一Step。
