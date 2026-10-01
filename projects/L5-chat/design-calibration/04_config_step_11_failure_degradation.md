# L5-chat 04 · Step 11 定义失效模式与降级策略

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；已通过Step10及相关前序配置域结论；配置SOP Step11和书写规范§5.11；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. required缺失阻当前startup，不自动生产defaults。
2. malformed/类型/上限/版本/禁项错误invalid_input，全配置不生效；不存在部分成功。
3. Chat不读KMS/secret，SDK资格缺失dependency_unbound封锁对应能力；暂失效dependency_unavailable，command effect未知只probe。
4. 没有config center，配置中心失效不适用；尝试提供remote字段作为unknownreject。
5. startup冻结防runtime漂移；外部ref/版本/权限漂移重新qualified，旧代次失效隐藏；source文件变化不live生效。

## 4. 当前材料问题诊断

必须区分config格式非法与合格config缺外部binding，不把坏配置当依赖暂失效，也不能因缺sink或native能力发布fake成功。日志/metrics backend仍blocked，告警不能虚构。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义失效模式与降级策略 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用invalid配置fail-fast+外部缺资格fail-closed/degraded；不silent fallback、不自动LKG、不重发业务命令。

## 7. 结构化中间产物

| 失效模式 | 影响 | 系统行为/错误 | 是否告警 | planned测试切口 |
|---|---|---|---|---|
| source不可读/不存在 | 无完整输入 | storage_unavailable，blocked启动，不能读另一个profile兜底 | 安全本地状态；无后台告警 | 缺source/拒读取/无rawpath |
| required模块/叶子缺失 | 配置不完整 | invalid_input全量拒绝，仅三安全缺叶子可default | 同上 | 每域逐缺项 |
| JSON重复/注释/语法错/危险键 | parser不可信 | invalid_input；不回显坏值 | 同上 | nested重复/注释/原型污染 |
| null/数组/字符串数值/NaN/无界/0/超上限 | 本地资源错误 | invalid_input，不coerce/clamp | 同上 | 1/上限/上下越界/safeinteger |
| outer/app版本不1/不一致 | schema无法解释 | invalid_input，不旧格式迁移猜测 | 同上 | 双版本错/未知键 |
| profile/platform/hostnull不匹配 | 错平台/来源 | invalid_input，不默认切Desktop | 同上 | 六catalog/preview带host |
| profile alias缺正式registry/export/schema | 业务能力未绑定 | dependency_unbound，相关面blocked；其他获准部分不受权力扩张 | 同上 | format合法但registry空 |
| 已bound SDK暂失效 | 当前safe材料不新鲜 | dependency_unavailable→unavailable/stale/partial；只安全read恢复 | 同上 | readtimeout/独立section失败 |
| dispatch后断线/旧composition销毁 | effect不能判断 | unknown，formal probe/query/wait；不retry | 本地等待状态，不业务成功提示 | profile换时late命令/ACK |
| native批准origin/window/权限缺失 | host能力不合格 | 对应HostBoundaryError安全拒绝；Platform unavailable/restricted；缺bound dependency_unbound | 同上 | 无trustedorigin/越权IPC |
| 目录文本超额 | 新搜索非法 | invalid_input，保留当前合法状态；不发SDK | 同上 | UTF-16/IME/字符边界 |
| Process safe图节点/边超预算 | 无法保有完整图 | unsupported_material；不ready残图，不显示hiddencounts；等价列表同safe材料 | 同上 | fork/join/loop及graph/list |
| consumed/context/cache达到上限 | 内存/连续性受限 | source/slot先失效→正式重取；缓存版本化清理；不丢去重后fresh | 同上 | cap/full/late/delete失败 |
| diagnostic启用但sink不可用 | 支持交付不可行 | blocked/unknown，零automatic retry；不影响owner结果 | 同上 | disabled/unknown/reconnect |
| 文件被替换/配置版本漂移 | 当前startup仍旧immutable | 不热读；下一批准启动重新validate；有安全revoke立即隐藏 | 同上 | 中途变文件/旧slot拒绝 |
| rollback文件已不兼容/权限已撤销 | 旧版不再安全 | 拒绝或blocked，不恢复旧refs/结果/稿 | 同上 | rollback+撤销 |
| remoteconfig/KMS/secret被塞入JSON | 当前不支持 | unknown键invalid_input；SDKprovider问题由SDK边界处理 | 同上 | 注入未定义来源 |

“告警”当前仅受控本地可访问状态；backend logs/metrics/handoff自动输出没有正式binding，因此不声称告警已发送。UI错误从existing code本地化，不能输出profile/rawJSON/secret/title/count。configfail-fast发生在composition之前；合格配置的个别能力blocked不能绕authority，本地shell可显示安全降级。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §11仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step12 SOP/对应书写规范。无代码、应用测试或commit。
