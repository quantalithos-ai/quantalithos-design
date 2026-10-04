# L6-bridges 02 Step 11：配置影响轮廓

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§11。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step4~10；SOP11/规范4.11已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done |
| 结构化/复杂度 | done |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step4~10；SOP11/规范4.11；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1. 安装配置、四adapter、private material/secret、路由、job/window/预算、repository/UoW与safe view受运行装配影响。2. Domain只接收qualified snapshot/typed value，不读全局config/环境变量。3. 所有权、授权、required refs、阶段分离、immutable effect、no-body、unknown/one-use/cursor与query no-write均禁止配置化。4. 03收口RuntimeConfig/AdapterConfig/JobConfig、loader/validator/错误与builder注入方向，名称仅承接线索不是当前对象新增。5. 04才定义具体项/默认值/profile/pin/secret引用填写及检查，不在02写值/键名/JSON。

## 4. 当前文档问题诊断

“配置支持某平台”不能证明具体安装能力；OAuth/API Key/KMS/route产品也不能被默认值偷偷选定。预算可保守收紧，不能放大平台等待窗口或内部许可，热更新不能变原effect或回活one-use。

## 5. 改动前后对比

| 运行seam | 本Step轮廓 | 保留边界 |
|---|---|---|
| adapter/config/secret/route | 影响类别与03实现合同方向 | 不给产品、值或完整constructor |
| domain状态guard | 间接消费qualified values | 无skip-gate、rawlog、自动绑定开关 |

## 6. 设计取舍

采用影响/禁止两表与03/04分工，不补图：config来源与主体关系已经在§4层图、§7port清楚，额外图没有新信息。思考done，配置只装配已有seam，不新增owner或业务模块。

## 7. 结构化中间产物

### 配置影响轮廓

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| U1 BridgeInstallation / C01 / J05 | 是 | installation/platform/environment、capability/config revision、enabled方向、route/profile | AdapterConfig/ConfigValidator与qualification failure、revision/generation隔离，缺配置不激活 |
| U1 binding / identity-location-message mapping | 间接受影响 | qualified安装/方向/action与新basis读取装配 | 只注入qualification snapshot，授权/双端定位仍正式owner，不由config补内部target |
| U2 PlatformIngressPort / E01 | 是 | 平台入口模式、source验证、ACK期限/安全接管、method/installation | 四adapter入口/验证与safe ref/window；raw输入private生命周期，不造durable inbox |
| U3 PresentationQualificationPort / PrivateMaterialPort | 是 | qualified外显/附件ref来源、私有读取endpoint/timeout | scoped/versioned material resolver、必要/省略资格、fail-closed，敏感Gate正文永不配置放行 |
| U3 PlatformDeliveryPort / J01 | 是 | method/endpoint、capability profile、private credential绑定、IO timeout | AdapterConfig/builder；receipt/no-effect/unknown分类与禁止SDK隐藏retry |
| U4 CallbackVerificationPort / E03 | 是 | 入口认证、action/source绑定、合法expiry与one-use来源 | Callback adapter config、私有context寿命、owner responsibility/action source绑定，不由平台身份授权 |
| U5 DispatchLane / J01 | 间接受影响 | 局部lane范围、平台动态bucket/global bounds、retry budget/window | JobConfig与typed RateLimitQualification/RetryEligibility；值不得缩短平台下界或绕current basis |
| U5 cursor/gap / J03 | 间接受影响 | stream/epoch/comparator/coverage source、page/window资格 | source-qualified cursor carrier与JobConfig；无来源不可比较/自动complete |
| U5 dedup/recovery / C06/J02 | 是 | namespace/保留/重放/预算与权威probe装配 | local continuity config/JobConfig、expire/manual与unknown tombstone；不是删除键后重执行 |
| U6 canonical handoff / E04/O01/J04 | 是 | schema/admission/consumer endpoint、有限材料/保留窗口 | producer binding/typed safe payload与consumer source合同，缺canonical/admission audit-only/blocked |
| U6 Query / BridgeLocalView | 间接受影响 | SDK page/consistency、qualified read provider、可用性显示 | query DTO/view/read qualification，所有窗口只影响只读scope，不触发repair/refresh |
| SecretResolutionPort | 是 | opaque provider/ref/version、scope/rotation/revoke、private读取装配 | Secret binding/PrivateSecretHandle与有限错误；产品未选，值不进日志/证据 |
| ConfigQualificationPort / route | 是 | profile/endpoint-kind/installation isolation、capability pin | ConfigLoader/Validator、RoutePolicyRef与builder seam；禁止默认channel和未鉴定私有URL |
| LocalUnitOfWorkPort / repositories | 是 | persistence driver/transaction能力、qualified connection/timeout | Transaction/repository trait装配与同UoW原子性验证；产品未选，Domain不读driver config |
| 全部局部Domain不变量 | 否 | 不适用 | 保持代码/guard固定语义，变更必须回00/01/02重新审，而非feature开关 |

### 禁止配置化边界

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| 自动external_id -> GlobalMember/内部actor/Conversation | 身份与owner truth越权 | 00/01及Identity/human正式owner，不可config实现 |
| skip Policy/Gate/visibility、默认低敏感approve | 平台认证不授内部操作/外显 | 00/01及Governance合同 |
| raw body/token/secret/敏感Gate/rawerror/私有callback日志或证据 | 保密不变量，不受debug flag例外 | 00/01安全边界与对应owner，不给开关 |
| ACK=Turn、HTTP=delivery、local audit=consumer/evidence | 阶段owner不同，不能折叠 | 00/01结果语义 |
| unknown盲重试、新effect/target/material代替原effect | 可能双发/越权 | 00/01 continuity，02/03权威probe合同 |
| one-use/terminal复活、old generation跳过当前核验 | action和撤销约束失效 | 01/02状态/授权，再审后03变更 |
| timestamp/裸ID全局cursor、跨epoch强比较、partial coverage关gap | 来源连续性不能由阈值证明 | source owner合同及01/02，缺来源保gap |
| 缩短平台rate-limit下界、无界预算/replay | 违外部服务/授权窗口 | 平台正式安装合同及00/01/02，04只能保守值 |
| 移除dedup/result/subject/audit同UoW或先发后无记录 | 本地一致性与恢复基础破坏 | 01/02事务边界，03实施carrier/driver |
| Query写audit/idempotency/refresh/repair/replay/probe | 读写性质与权限扩大 | 01/02接口类别；必须显式维护入口而非开关 |
| count/ref/私有URL默认开放、不可见当empty | 信息泄漏/失败失真 | 00/01 owner visibility与02 query合同 |
| 安装支持/产品默认已选、测试/evidence/ready默认通过 | 事实无来源 | 03/04资格核验；真实执行另授权，不经配置制造 |

### 详细设计承接

本章只识别影响轮廓，不定义config项清单、默认值、JSON/YAML、环境变量名、secret名称、RuntimeConfig字段全集、ConfigError全集或完整adapter constructor。03必须闭合loader/validator/typed runtime binding/私有生命周期/错误与current qualification，04再给具体profile/pin/opaque secret ref填写、校验和使用。缺basis/capability/secret/route/pin时waiting/blocked，不将配置接纳当运行激活。


## 8. 回填草稿

正式§11回填影响/禁止两表与03/04承接声明；无配置值或secret名称。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

自检pass；gate_status=pass；gate_reason=config_impact_and_non_configurable_guards_closed；next_allowed_action=step12_detailed_handoff；formal_backfill_allowed=after_step14；commit_required=false。
