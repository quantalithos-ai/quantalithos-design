# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
> 回填章节：`04-配置设计.md` §5
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_05_sources_priority_conflicts.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与关键取舍

本 Step 将 Step 3 的来源预览收口为可判定规则。考虑 Console 是浏览器客户端、host delivery 未锁定且不存在 raw secret 配置，P0 不开放 env/CLI叶子覆盖、远程配置中心或 admin override。

| SOP问题 | 收口回答 |
|---|---|
| 来源优先级？ | `safe code defaults < one host-provided strict JSON document`。host/deployment可在进程/构建外选择整个文档，但进入 Console 后只有一个文档，不存在多文档逐键合并。 |
| 同名多处？ | external document 覆盖 default；文档内 duplicate key/alias/unknown key 均 reject。高优先级非法不得回退 default。 |
| 必填缺失？ | `runtime.profile` 必填且无隐式 default；其它域可由安全 default补齐。 |
| 外部来源不可用？ | external document 不可读/缺失/解析失败→bootstrap fail-fast。defaults 只补 `bindings=[]` 与两个 `false`，不提供必填 profile，因而不能单独组成 runtime，更不能隐式进入 `local-fake`。 |
| secret系统不可用？ | 当前无 secret/credential config，也不调用 secret provider；若文档出现 raw secret类字段/值则 reject。 |
| 哪些来源不能覆盖？ | 任何来源均不能覆盖 static design boundaries；URL/query/hash/DOM/cookie/browser storage/SDK response不得作为config source。 |

## 2. 诊断、对比与取舍

| 候选 | 判定 | 理由 |
|---|---|---|
| default < file < env | 不直接采用 | 通用服务端模型会为浏览器暴露未定义 env/叶子覆盖语义 |
| 多个外部 JSON overlay | P0否决 | 增加不可审计逐键漂移与 alias冲突 |
| URL query/localStorage override | 否决 | 用户可控/陈旧状态不能控制安全装配 |
| invalid external值回退default | 否决 | 会隐藏配置错误和虚假启用 |
| profile缺失使用local-fake | 否决 | 明确选择运行姿态，避免意外 fake |
| bindings缺失使用空数组、flags缺失false | 采用 | 安全 default：pending/disabled，非正向能力 |

## 3. 结构化中间产物

### 3.1 来源优先级

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用策略 |
|---|---:|---|---|---|
| safe code defaults | 1 | `bindings=[]`、两个 `enabled=false`；不为 profile提供隐式值 | 被 external document 同名字段覆盖 | defaults自身须通过 validator；单独使用因缺profile而fail-fast |
| one host-provided strict JSON document | 2 | 四域全部；`runtime.profile` 必填 | 覆盖 defaults；非法/unknown/duplicate/alias均whole-document reject | 未提供、不可取得或parse失败→bootstrap fail-fast |
| host/deployment document selector | source-of-source，不进入叶子优先级 | 未来07/09选择哪个完整artifact | 不允许同时向Console传多份文档 | selector错误阻断当前bootstrap |
| env / CLI leaf override | P0 unsupported | 无 | 出现/尝试映射为叶子覆盖→拒绝设计/实现 | 不适用 |
| URL/query/hash/DOM/cookie/browser storage | forbidden | 无 | 绝不合并 | 检测到即拒绝 |
| config center/admin override/hot patch | P2 unsupported | 无 | 不能进入P0 | 需要先回写03/04 |
| secret provider/raw secret | 当前不适用/forbidden | 无P0 secret item | raw material不得进入document | 检测到即安全拒绝 |

### 3.2 冲突处理

| 冲突/错误场景 | 规则 | 阻断 |
|---|---|---|
| external合法字段与default同名 | external覆盖default | 否 |
| 高优先级值类型/enum/ref非法 | 不回退default，reject whole document | 是 |
| `runtime.profile`缺失 | required-field reject | 是 |
| `bindings`缺失 | default `[]` | 否 |
| invalidation/diagnostics `enabled`缺失 | default `false` | 否 |
| JSON duplicate key | strict parser reject | 是 |
| 同义 alias/旧key | unknown/removed field reject | 是 |
| unknown section/field | strict schema reject | 是 |
| 同一 `(profile, slot)` 重复 | ambiguity reject；当前外部 item 不含 owner，单个 `bindingRef` 关联该 slot 的 registry family | 是 |
| slot不属于封闭union或 owner 使用不合法 | reject | 是 |
| item.profile != runtime.profile | cross-field reject | 是 |
| `bindingRef`空白、URL、secret、credential或正文 | reject | 是 |
| flag=true但 profile/slot/正式合同不允许 | cross-field/availability reject；不降级为true-but-disabled | 是 |
| forbidden boundary key | security/design violation reject | 是 |
| external doc缺失或不可用 | defaults缺少profile；不使用旧缓存或隐式fake | 是 |

### 3.3 按域来源覆盖

| 域 | default | external允许覆盖 | 禁止来源/值 | 不可用/非法策略 |
|---|---|---|---|---|
| runtime | 无profile default | exact enum | URL/DOM/storage/unknown profile | fail-fast |
| bindings | `[]` | whole array | private schema/endpoint/secret/method；partial patch | reject whole document |
| invalidation | false | boolean | dynamic event/bus/topic fields | unsupported true→reject；false safe |
| diagnostics | false | boolean | endpoint/sampling/body fields | unsupported true→reject；false safe |

### 3.4 域内停审与跨来源审计

| 域 | 优先级唯一 | 冲突可判定 | 不可用明确 | 结论 |
|---|---|---|---|---|
| runtime | yes | exact enum + required | fail-fast | pass |
| bindings | yes | whole-array/unique/ref guards | empty safe；invalid reject | pass with contract blockers |
| invalidation | yes | boolean + prerequisites | false/disabled | pass with blocker |
| diagnostics | yes | boolean + prerequisites | false/disabled | pass with blocker |

| 跨来源审计项 | 结论 |
|---|---|
| raw secret是否可被普通来源覆盖 | no；无secret item，raw value reject |
| 高优先级非法是否silent fallback | no |
| 环境差异是否通过多个overlay漂移 | no；单document + profile明确 |
| test override是否可能进入production-pending | validator拒绝不兼容binding/flag |
| URL/DOM/state是否成为authority | no |
| 是否新增03 source-loader/port contract | no；delivery mechanism留07/09 |

## 4. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 状态 |
|---|---|---|---|---|
| defaults + one external document 映射既有对象 | 否 | 来源/优先级语义 | N/A | 无回写 |
| profile required，array/flags安全default | 否 | default/必填性 | N/A | 无回写 |
| env/CLI leaf、remote/admin/hot unsupported | 否 | P0来源边界 | N/A | 无回写 |
| 若未来实现online source/reload/LKG | 是 | loader/builder/lifecycle/error变更 | 03 Step 7/9/12/13/14 | 当前排除 |

## 5. 回填、待确认与门禁

正式 §5 应保留来源表和冲突表，明确“host-provided document”是抽象来源角色而非已实现机制；不得发明env key、path、endpoint或缓存位置。

| 待确认 | 当前处理 |
|---|---|
| host document delivery | 07/09承接；当前只测试 source abstraction |
| strict duplicate-key detector/tooling | 07实现选择；行为契约已确定 |

| 进入Step 6条件 | 结论 |
|---|---|
| 覆盖顺序唯一 | pass |
| 必填/冲突/不可用可判定 | pass |
| 每域停审完成 | pass / explicit blocker |
| 跨来源无 unresolved冲突 | pass |
| 无03待回写 | pass |

Step 5 `done / pass / self_reviewed`；允许串行进入 Step 6。正式04仍不可写。
