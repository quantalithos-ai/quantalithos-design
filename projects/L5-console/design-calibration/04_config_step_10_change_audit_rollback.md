# Step 10. 定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节：`04-配置设计.md` §10
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与边界

本 Step 定义 startup-only 配置如何被提出、评审、验证、切换与整文档回滚。Console runtime 不拥有配置管理系统或正式审计 truth；变更记录与 artifact 版本归 host / release / configuration owner。本文只规定其必须提供的安全语义，不指定工单、平台或命令。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 谁可变更？ | 经项目配置/发布边界授权的维护者；Console 页面、用户、route、owner response和runtime code不得自行改变配置。具体组织角色留实施/运维。 |
| 哪些需评审？ | 所有配置artifact变更均需评审；profile、bindings和任一flag从false→true属于高风险，必须包含安全/合同owner审查。 |
| 如何生效？ | 生成一个完整新文档→离线/启动校验→新runtime bootstrap。无leaf patch、无hot update、无当前runtime原地交换。 |
| 如何审计？ | 外部变更记录保存artifact ref/version、旧/新redacted digest、变更key class、actor/reviewer/reason refs、validation outcome与rollback ref；禁止保存raw document/value/secret/body。 |
| 如何回滚？ | 选择上一份仍被批准且在当前authority下重新校验通过的完整文档，重建runtime；不能将内存状态或未校验缓存当LKG。 |

## 3. 当前诊断与取舍

| 风险候选 | 收口 |
|---|---|
| runtime内提供admin toggle | 否决；会新增控制面和授权/audit契约 |
| 只回滚单个key | 否决；可能破坏cross-field一致性 |
| 解析失败继续旧runtime | 当前运行实例可保持其冻结配置直至生命周期结束，但新bootstrap必须失败；不得声称online LKG切换 |
| rollback直接信任旧artifact | 否；须以当前schema/authority重新校验 |
| Console生成正式config audit | 否；Console只可输出安全本地diagnostic，正式audit归外部owner |
| audit保存完整diff | 否；只保存key class和redacted digest/ref |

## 4. 变更 actor 与评审层级

| 变更类别 | 发起边界 | 最低评审语义 | 额外确认 |
|---|---|---|---|
| optional字段保持安全default | configuration/release maintainer | schema/validator review | 无，但仍需artifact review |
| runtime profile变化 | configuration/release maintainer | architecture + implementation review | local-fake→pending profile需测试/安全确认 |
| adapterBindings增加/替换/删除 | configuration/release maintainer | adapter contract + security review | 对应 SDK/owner合同维护者确认；缺合同不得批准positive binding |
| invalidation false→true | configuration/release maintainer | SDK event contract + consistency review | envelope/id/order/dedup owner确认；当前不可批准 |
| diagnostics false→true | configuration/release maintainer | privacy/redaction + sink contract review | observability/host owner确认；production当前不可批准 |
| schema/source/lifecycle扩展 | design maintainer | 先重开03/04 | 架构、安全、测试、运维按影响确认 |

## 5. 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| profile | 外部配置/发布维护者 | enum、环境映射、fake isolation、依赖完整性 | 新runtime startup | old/new digest、profile class、review refs、validation outcome | previous approved whole document + restart |
| binding array | 外部配置/发布维护者 | slot/profile/ref、唯一性、contract/registry availability、安全边界 | 新registry/runtime startup | changed slot classes、redacted digest、contract review ref | previous approved whole document + revalidation |
| invalidation flag | 外部配置/发布维护者 | false→true需正式event合同；true→false确认核心Query仍可用 | 新runtime startup | flag class、review refs、validation result | restore false document + restart |
| diagnostics flag | 外部配置/发布维护者 | false→true需sink/redaction合同；业务隔离复核 | 新runtime startup | flag class、privacy/contract review refs | restore false document + restart |
| rollback | 外部配置/发布维护者 | 目标artifact仍批准且当前schema/authority有效 | 新runtime startup | rollback-from/to refs、reason、validation outcome | 若回滚也失败，保持新bootstrap blocked；不连续猜版本 |

## 6. 审计记录安全规则

| 允许字段类别 | 禁止字段类别 |
|---|---|
| artifact/version ref、redacted canonical digest、safe key/module class、actor/reviewer/reason ref、validation outcome kind、activation posture class、rollback ref、time由外部audit owner记录 | raw JSON/value、bindingRef opaque value、endpoint/URL、credential/secret、owner body、SDK response/error/stack、用户输入、diagnostic payload、formal业务result |

“redacted canonical digest”是外部配置管理语义，不是当前 runtime config 字段，也不规定算法。实现/运维必须选择不会把 secret/body写入材料的计算与存储方式；本设计未生成任何 audit record、artifact或digest。

## 7. 回滚规则矩阵

| 失败阶段 | 当前runtime | 新runtime | 回滚规则 |
|---|---|---|---|
| source/parse/type/cross-field失败 | 已运行实例继续使用其冻结配置；不热改 | 不构造 | 修正文档或选择previous approved document，重新校验再bootstrap |
| builder/mandatory dependency失败 | 已运行实例不被新发布隐式修改 | 新实例不暴露protected runtime | rollback完整document；不得只删失败slot后绕过review |
| optional runtime dependency later unavailable | 当前实例按03 partial/disabled/failed姿态 | N/A | 这不是配置rollback触发器；先走formal recovery/host处置，禁止自动换config提升状态 |
| 新配置效果异常但仍合法 | 当前实例生命周期由host/release控制 | 新实例可停止/替换 | 经评审回滚整文档并新bootstrap；不把UI状态当判据 |
| previous artifact已不兼容 | 保持安全停止/当前冻结实例 | 不构造 | 不强行回滚；产生新的经批准修复文档 |

## 8. 域内停审与跨变更审计

| 域 | 发起/评审 | 生效 | 审计 | 回滚 | 结论 |
|---|---|---|---|---|---|
| runtime | external owner + architecture review | startup | profile class/digests/refs | whole document | pass |
| bindings | contract/security review | startup | slot classes/no raw refs | whole document | pass with contract blockers |
| invalidation | SDK/event owner | startup | flag/review refs | false document | pass; true currently blocked |
| diagnostics | privacy/sink owner | startup | flag/review refs | false document | pass; production true blocked |

| 跨变更审计 | 结论 |
|---|---|
| high-risk是否有评审/审计/回滚 | yes |
| 是否假设具体工单/平台 | no |
| 是否允许leaf patch或hot change | no |
| 敏感材料是否进入audit | no |
| rollback是否绕过current validation | no |
| Console是否冒充formal audit owner | no |
| 是否生成了audit/evidence | no |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 状态 |
|---|---|---|---|---|
| 变更只以新startup runtime生效 | 否 | 承接startup-only边界 | N/A | 无回写 |
| config audit由外部owner持有，Console不创建formal audit | 否 | truth边界细化 | N/A | 无回写 |
| whole-document rollback并重新validation | 否 | 配置管理语义 | N/A | 无回写 |
| future runtime admin/hot rollback/online LKG | 是 | port/builder/lifecycle/audit/security变更 | 03 Step 7/9/13/14/15 | 当前排除 |

## 10. 回填、待确认与门禁

正式§10应包含变更表、audit安全规则和回滚矩阵，明确其为外部configuration/release责任且没有已生成证据。

| 待确认 | 当前处理 |
|---|---|
| configuration/release owner的具体系统与角色 | 留07/09；本文只定义语义要求 |
| digest算法/artifact store | 留实施/运维；不得进入runtime schema |
| online LKG | unsupported/design-change-required |

| 进入Step 11条件 | 结论 |
|---|---|
| 每类变更的actor/评审/生效/audit/rollback明确 | pass |
| 敏感变更无泄露 | pass |
| 跨变更无unresolved内部冲突 | pass |
| 无当前03待回写 | pass |

Step 10 `done / pass / self_reviewed`；允许串行进入 Step 11。
