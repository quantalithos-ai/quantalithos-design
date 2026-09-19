# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节：`04-配置设计.md` §11
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与术语

本 Step 为配置缺失、错误、不可达、过期、漂移和装配后依赖失效给出明确姿态。配置失败不得被压成 owner不存在、权限拒绝、业务失败或 readiness结论。

| 策略 | 本项目含义 |
|---|---|
| `fail-fast` | whole-document或mandatory bootstrap无效时不构造新runtime |
| `fail-closed` | 合同/guard/依赖不足时拒绝protected view/action或保持pending/blocked/unknown |
| `disabled` | optional invalidation/diagnostic未启用或前置未满足，不影响显式Query核心路径 |
| `restricted/minimal` | runtime已安全构造但formal/host/state依赖按03只能呈现受限壳 |
| `reject-new-value` | 新artifact未通过校验，当前已运行实例不被热改；不存在online fallback activation |
| `last-known-good` | P0不支持online LKG。只有外部owner可选择previous approved artifact并重新校验、新bootstrap |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填缺失？ | profile/external document缺失→fail-fast；不隐式local-fake。 |
| 类型/范围/cross-field错？ | whole-document fail-fast/reject；不回退低优先级。 |
| secret/KMS/Vault不可用？ | 当前不调用、不配置；发现secret-like material立即reject。未来provider不可用需先设计。 |
| config center不可达？ | P0无config center；任何实现依赖remote center属于unsupported设计。 |
| 配置漂移/过期？ | 外部owner比较approved artifact ref/redacted digest；Console runtime只使用启动冻结快照。发现不一致时阻止新bootstrap或外部发布，不用UI状态自动修复。 |

## 3. 失效模式表

| 失效模式 | 影响 | 系统行为 | 告警/记录 | 测试切口 |
|---|---|---|---|---|
| external document缺失/不可读 | 无required profile | 新runtime fail-fast；无partial runtime | 外部config/release error，safe source ref only | missing/unreadable source |
| malformed JSON/duplicate key | shape不可判定 | reject whole document | safe parse issue；no raw body | malformed/duplicate/trailing/comment negative |
| unknown section/field/alias | schema漂移/历史污染 | reject whole document | safe module/key class | unknown/legacy key |
| profile缺失/unknown | runtime姿态不明 | fail-fast；不default fake | profile issue class | required/enum tests |
| binding非数组/元素字段错 | registry不可信 | reject whole document | slot/shape class | type/unknown/extra field |
| duplicate `(profile,slot)` | binding歧义 | reject | safe slot class | duplicate binding |
| bindingRef空/URL/secret/body | 安全边界破坏 | security reject；不回显 | forbidden class only | opaque ref/forbidden-body |
| binding profile mismatch | 跨profile偷渡 | cross-field reject | profile+slot class | mismatch matrix |
| invalidation=true且合同/slot缺失 | 不安全consumer | reject new runtime；保持false配置才可启动 | pending-contract class | positive/negative prerequisite |
| diagnostics=true且sink/profile不允许 | 泄露/错误耦合风险 | reject；false→disabled | safe sink posture | fake-only/production reject |
| injected mandatory host/dependency缺失 | shell/guard无法装配 | builder fail-closed；restricted/minimal或fail-fast按03 entry requirement | safe facet/posture | dependency partial availability |
| owner adapter runtime unavailable | 对应partition不可读/写 | per-owner unavailable/partial/blocked；无关区域继续 | body-free diagnostic可选 | partition isolation |
| diagnostic sink runtime失败 | 辅助诊断丢失 | diagnostic `failed/disabled`；业务结果不变；不递归 | safe error kind only | sink failure/cancel recursion |
| invalidation hint runtime unavailable | 无异步提示 | disabled/unavailable；显式Query/revalidation仍为主链 | safe posture | hint absent/unavailable |
| state carrier unavailable | 交互连续性受损 | reload/clear/minimal shell；不恢复formal positive，不重发command | safe carrier posture | carrier unavailable/ambiguous |
| approved artifact drift/digest mismatch | 发布输入不可复核 | 外部release gate阻断新bootstrap；不自动切换 | external audit/alert; digest refs | drift compare |
| config过期/removed schema | schema compatibility不成立 | unknown/removed key reject | migration issue class | migration negative |
| remote config/admin/hot key出现 | unsupported控制面 | reject | design violation class | unsupported source/control |

## 4. 按域失败策略

| 域 | 缺失 | 非法 | 运行依赖失败 | 不允许的silent fallback |
|---|---|---|---|---|
| runtime | profile缺失fail-fast | unknown enum fail-fast | profile本身不探测健康；依赖按facet降级 | 隐式local-fake/production-ready |
| bindings | missing→`[]`安全pending | malformed/duplicate/forbidden reject | per-slot pending/unavailable/unknown | fake替formal、route/package→bound |
| invalidation | missing→false | unsupported true reject | disabled/unavailable；显式Query继续 | 私有bus/direct refresh/positive recovery |
| diagnostics | missing→false | unsupported true reject | disabled/failed且业务隔离 | raw console log临时替sink、audit/evidence |

## 5. 告警/安全记录规则

| 场景 | 是否记录/告警 | 安全字段 | 禁止字段 |
|---|---|---|---|
| parse/schema/cross-field reject | yes，由host/config owner | source/artifact ref、module/key class、issue kind、profile class | raw document/value/path/URL |
| forbidden secret/body | security/error | forbidden class、issue ref | detected material |
| builder mandatory dependency failure | yes | facet/posture/local operation ref | credential/SDK exception/body |
| optional diagnostic/invalidation disabled | 默认不作为业务错误；可聚合 | facet/posture | payload/ref raw value |
| config drift | external release gate | expected/actual redacted digest refs、profile | full config |
| per-owner runtime unavailable | 可按03 diagnostic聚合 | owner key、facet、safe outcome | response/body/error text |

## 6. 测试切口

| 切口 | 最小断言 |
|---|---|
| missing/parse | 无profile或坏JSON不构造runtime；无implicit fake |
| strict schema | duplicate/unknown/alias/extra field rejected |
| types | enum/boolean/array/object/ref类型全负向 |
| cross-field | profile/binding/flag prerequisite不一致被拒绝 |
| secret/body | rejected且issue不回显材料 |
| optional defaults | missing bindings/flags→empty/false，保持pending/disabled |
| partial dependency | owner partition isolated；无全局ready/healthy推断 |
| state failure | minimal/reload/clear，不恢复positive或重发command |
| diagnostic failure | business invariant + no recursion |
| drift/rollback | previous artifact必须重新验证；无online LKG声明 |

## 7. 停审与跨失效审计

| 审计项 | 结论 |
|---|---|
| 每个P0项缺失/非法/运行失败有策略 | pass |
| 高风险失败是否silent fallback | no |
| fail-fast与fail-closed是否混淆 | no；document无效fail-fast，facet不足fail-closed |
| optional disabled是否影响核心Query | no |
| runtime dependency失败是否被写成config无效 | no；明确分层 |
| config错误是否变成owner业务错误 | no |
| secret/config正文是否进入告警 | no |
| 是否伪造alert/evidence | no；只定义下游要求 |

## 8. 对详细设计的影响判定

| 结论 | 是否影响03 | 类型 | 回写位置 | 状态 |
|---|---|---|---|---|
| document错误fail-fast，facet缺口fail-closed | 否 | 配置failure对齐现有entry/error姿态 | N/A | 无回写 |
| optional paths disabled/failed与业务隔离 | 否 | 承接03 invalidation/diagnostic合同 | N/A | 无回写 |
| state unavailable使用既有reload/minimal规则 | 否 | 承接03 carrier/error flow | N/A | 无回写 |
| future onlineLKG/remote config/provider health | 是 | runtime lifecycle/error/observability | 03 Step 7/9/12/13/14/15 | 当前排除 |

## 9. 回填、待确认与门禁

正式§11应保留策略术语、失效表、域失败表和安全记录规则，明确测试切口不是结果。

| 待确认 | 当前处理 |
|---|---|
| 外部alert平台与级别 | 留09；04仅规定安全字段/触发语义 |
| production mandatory facet集合 | exact合同到达前按partition pending；不由04猜造 |

| 进入Step 12条件 | 结论 |
|---|---|
| P0失效模式与策略完整 | pass |
| 无silent fallback | pass |
| 测试切口可交05 | pass |
| 无03待回写 | pass |

Step 11 `done / pass / self_reviewed`；允许串行进入 Step 12。
