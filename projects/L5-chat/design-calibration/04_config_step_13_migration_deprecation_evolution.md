# L5-chat 04 · Step 13 定义配置迁移、废弃与演进

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；已通过Step12及相关前序配置域结论；配置SOP Step13和书写规范§5.13；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 当前没有已发布/运行配置事实，旧flat设计不是已发布版本，无自动迁移。
2. 当前首次module schemaVersion=1；新增字段必须走owner03/04影响审议，不允许unknown透传。
3～4. 未来已发布版本变更需明确schema/兼容窗口、受控offline迁移和回滚，不能以安全default猜转换。
5. 移除已发布字段先证用户/环境不再使用且rollback兼容，再正式审议；现在不伪造发布日期或窗口。

## 4. 当前材料问题诊断

JSON格式变更容易写成自动支持两种schema；本轮full-restart旧flat只历史。资源上限变化不是数据迁移，却影响renderer/连续性/本地稿损失，需要评审。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置迁移、废弃与演进 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用首次v1单格式strict拒旧flat；未来版本显式迁移，不添加runtimelegacy兼容开关或dualtruth。

## 7. 结构化中间产物

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 历史flat字段demo/README/旧草案 | 八域module JSON / schemaVersion1 | historical→当前设计；无已发布事实 | 无运行兼容窗口 | 本轮人工按14路径重填；loader拒flat根键，不静默迁移 | 历史只审计，未作source |
| 当前schemaVersion1字段 | 未来v2新增/调整域 | design-change-required | 未来发布时具体定义，当前未授权 | 先03接口/flow及04来源/约束审议、兼容/回滚矩阵 | 新版验证与迁移覆盖旧使用者 |
| 六profile catalog/ref变更 | 批准新source/ref版本 | startup配置变化 | release管理记录 | 全校验+新composition/epoch+独立资格 | 当前批准/回滚可用，不能沿用被撤销ref |
| 资源limits变化 | 同v1显式新值 | startup配置变化 | 不以旧缓存作为兼容证据 | 质量/安全评审；内存稿/cache不跨重启恢复 | 超额/图/list/去重恢复验证 |
| remote/env/CLI/hot/durable/mobile/provider新键 | 无当前对应项 | unsupported，非disabled活动键 | 无 | 先00～03/04新设计，不能unknown透传 | 正式新增schema/ports/安全与测试门禁完成 |
| 已发布配置废弃 | 当前无已发布迁移项 | 尚无运行事实 | 不编造日期 | 未来必须通知/兼容/rollback并记录实际版本 | 所有使用者迁移且回滚策略审定 |

schemaVersion与文档版本独立：本文首次配置schema=1，文档修订不自行使runtime接收新schema。若只是新增说明不改变实际fields，仍v1；如改变解析/类型/语义/单位/允许值，必须审兼容和03影响，不能“未知字段先忽略”。生产sizing调整不能以示例值自动替换已批准值。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §13仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step14 SOP/对应书写规范。无代码、应用测试或commit。
