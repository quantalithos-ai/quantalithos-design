# L5-chat 04 · Step 10 定义配置变更、审计与回滚

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step9及相关前序配置域结论；配置SOP Step10和书写规范§5.10；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 批准source变更由客户端/release维护者发起，用户配置输入不能改变安全权限。
2. ref/platform/预算提升诊断启用和nativepolicy属高风险，安全及SDK/host责任方评审；普通减少预算仍核对UX/恢复。
3. 全部startup；先校验候选，旧composition不live更新，新配置建立新epoch。
4. 变更审计在外部release/change流程记录版本/字段/理由/批准/回滚，Chat不新增AuditPort或自动采集。
5. 回滚使用已评审兼容旧配置重新启动，但不得恢复旧authority/confirmed/unknown/draft；LKG不是运行时自动机制。
6～8. 八域按风险完成变更/审核/生效/审计/回滚停审，失败面Step11，不要求指定工单产品。

## 4. 当前材料问题诊断

保留旧JSON版本不等可恢复旧session；撤销或provider变更后即使旧文件合法，也必须重新正式资格化。诊断模式rollback不能自动再次交付unknown请求。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置变更、审计与回滚 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用发布管理可审的startup替换；不新增configchange业务事件/审计schema/热回滚API。候选校验失败不装配，必要安全撤销始终优先。

## 7. 结构化中间产物

### 7.1 变更审计链图: 配置发布管理与客户端重启

```text
[proposed JSON version + changed field names + reason]
 -> [configuration / security / SDK-host review]
 -> [strict candidate validation + compatibility gate]
 -> [approved release record, rollback pointer]
 -> [hide/invalidate old composition -> stop/unsubscribe -> clear]
 -> [new load / epoch / independent formal qualification]
 -> [safe local status; future actual validation record]
rollback -> [reviewed compatible previous JSON -> same new-load gate]
```

关键说明：
- 图是release管理流程，未实现Chat审计backend、工单系统或reportAPI。
- 回滚不恢复旧session/refs/命令结果，也不解除revoke或重发unknown。
- 配置变更记录只字段/受控版本，不包含config全文、secret/ref值或raworigin。

| 变更类型 | 发起方 | 评审 | 生效 | 审计记录 | 回滚 |
|---|---|---|---|---|---|
| SDK/hostref、platform | 客户端发布维护者 | SDK/host+安全责任方，exact registry/OS适用性 | 新composition/epoch；nativepolicy改动需新build | 受控配置/包版本、字段名、理由、批准与回滚指针 | 兼容批准旧配置重加载/重新资格化 |
| 资源上限变更 | 客户端维护者 | 质量/UX；提升评内存/图/覆盖风险，降低评超额恢复 | startup；不截断fake完整/忘去重后fresh | 字段名/变更范围/评审/版本，禁止默认把数值写runtime日志 | 新composition；旧material不复活 |
| diagnostic.mode启用 | 维护者+正式sink责任方 | 安全/隐私；六字段+显式支持+sink资格 | startup选择模式，不自动send | 受控版本/字段名/批准；无交付材料 | 关闭模式后新composition，不重发unknown诊断 |
| native窗口/origin/CSP/权限 | native发布维护者 | native安全/OS兼容审查 | build-time新release，ordinaryJSON不能覆盖 | native受控policy版本/批准范围/rollback指针 | 回滚兼容bundle且重新probe |
| 禁配/未知键/secret项 | 无普通变更权 | 直接reject；需新设计审议才可能引入合法功能 | 不生效 | 外部有限拒绝类别，不记raw坏值 | 继续合法版本或安全blocked启动 |

### app变更小循环

问题回答：app.schemaVersion、app.platform只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### sdk变更小循环

问题回答：sdk.profileRef只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：旧ref有效性会受当前正式provider/OS批准状态影响。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### platform变更小循环

问题回答：platform.hostProfileRef只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：旧ref有效性会受当前正式provider/OS批准状态影响。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### intents变更小循环

问题回答：intents.maxTextUnits、intents.maxAttachmentRefs只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### local_state变更小循环

问题回答：local_state.maxCachedEntries、local_state.memoryOnly只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：memoryOnly=false永远拒绝，容量变化仍版本化清理，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### continuity变更小循环

问题回答：continuity.maxConsumedChanges、continuity.maxConsumptionContexts只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### collaboration变更小循环

问题回答：collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：复用全量startup校验与新epoch，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

### diagnostic变更小循环

问题回答：diagnostic.mode只可经批准新source/release改变，不允许UI/runtime覆盖。
诊断：重启失去memory-only草稿/展示缓存，不能声称无损切换。
取舍：启用模式需安全/sink审核，不触发send，回滚不使用旧资格。
结构化结论：本域按上表对应类型评审；变更元信息留外部受控记录；失败拒新配置/blocked；无后台审计IO。
回填：§10。本域权限、审核、审计/rollback和敏感输出闭合，local gate通过。

跨变更审查：全部startup；没有未定义hot API/LKG缓存或自动撤销回滚。高风险字段都有外部审查及兼容rollback；当前内存稿/缓存重启丢失是明确产品限制，不能加持久化兜底。用户有unknown业务effect时重启仍不可声称未提交；只能当前获准SDK正式probe/query，不能按配置变更再dispatch。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §10仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step11 SOP/对应书写规范。无代码、应用测试或commit。
