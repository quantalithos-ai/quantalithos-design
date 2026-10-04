# L6-bridges 04 Step13：迁移、废弃与演进

## 1. Step状态与开工确认

2026-10-04；前序Step12已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S13 | done | done | done | done | pass | enter_step14 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step7 schema version1/Step10冷变更及原unknown保护；旧README/05/06只在独立结论后历史冲突扫描；配置SOP Step13和书写§5.13。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 旧迁移 | 当前无已核已发布配置迁移项；旧README/旧05/06只是历史设计，不当生产实例或可迁移runtime schema。 |
| 2 新引入 | schema版本/功能域/consumer/完整十列/demo/typed/current/失效与03影响先校准；不允许unknown key当自由扩展。 |
| 3 废弃 | 只有确认已发布字段才deprecate并给新版本/受控转换/下游验证；当前无此事实，不伪造窗口。 |
| 4 兼容窗口 | version1没有旧alias/automatic translator；未来窗口需正式发布/source/原op/probe/secret/current资格才能批准。 |
| 5 移除 | 合法recovery/read/tombstone/old source还被引用则不能仅TTL删除；不可物理删原key/result/unknown或复活terminal。 |

## 4. 当前文档问题诊断

历史README Python/TS SDK、OAuth优先/API Key fallback、KMS预选、external_id→GlobalMember/GateCard与“打开Chat”路径若自动迁入，会重引未核provider/身份/路由。旧05/06的BridgeRequest/PayloadEnvelope/ReplayRequest及100%样本承诺也不是新03schema或实测SLA。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 旧材料可能成为兼容默认 | 明确无已核发布迁移，历史仅扫描，不提供runtime别名 |
| 新字段/版本需如何增加含混 | 03影响→04校准→下游测试/实施/运维正式变更顺序 |
| 保留窗口容易被当GC授权 | 旧ref/history与key/unknown/pointer保留分开，物理GC不由配置TTL允许 |

## 6. 设计取舍与复杂度

采用版本严格拒绝与有来源的演进，没有实际旧部署证明就不写迁移完成或兼容日期。未采用历史配置自动翻译、known effect回滚、旧secret值备份、forward-compatible arbitrary map或根据timer删typed记录。

旧README全文及旧05/06关键词扫描只在独立配置结论后实际读取；不改历史文件，不正式消费Chat内容。将新public type/function/DTO/state/key变化回03/更上游，普通file key语义回04；未来实现/脚本/迁移命令等07/09另获授权。

## 7. 结构化中间产物

### 7.1 配置迁移 / 废弃

| 旧配置 / 材料 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 已核已发布runtime配置 | 无已证实对象 | 当前无迁移项；published_configuration_verified=not_established | 未建立，不编日期 | 不创建迁移程序/命令或migration成功记录 | 需先获得真实schema/source/环境/原op清单与正式准入 |
| 旧README Python/TS SDK与具体平台包 | 03Rust计划/04typed driver seam | historical_material，不是配置版本 | 不提供别名 | 产品重新核pin/依赖/private/retry/平台能力，不自动迁入 | 不改README；未来如更新须另获范围授权 |
| OAuth优先/API Key fallback、KMS默认 | credential_use/provider与exact secret binding | 历史候选，无运行资格 | 无 | 禁fallback/明文；seam逐用途/pin/current重核 | 新正式设计不继承；不宣原secret已删除/轮换 |
| external_id↔GlobalMember / GateCard / Chat入口 | 03显式relation/三mapping/safe projection/action/current | 历史概括，不作本地config truth | 无 | 显式owner双端/主体basis，敏感Gate仅获准安全材料，不消费Chat未停审入口 | 无自动映射或路径；真实合同缺失blocked |
| 旧05/06 BridgeRequest/PayloadEnvelope/ReplayRequest与100%指标 | 新03 original key/effect/state与04有限配置切口 | historical_material，非已运行证据 | 无 | 05/06未来full-restart，不用旧case补外部成功/ready | 本轮不修改旧05/06；等用户文档切换授权 |
| schema_version=1的82项设计 | 尚无版本2 | 当前新设计基线，不等发布 | 当前仅exact1 | 未来新增/rename需新设计记录与完整准入矩阵，未知版本现在拒绝 | 不静默删除已发布字段；若无发布事实则仍标未建立 |

### 7.2 演进规则

| 变化类型 | 校准/反校准要求 | 禁止 |
|---|---|---|
| 新字段/模块/enum/file格式/来源 | 回04 Step3~11全链；schema版本、十列/demo/default/current/错误/下游测试齐 | arbitrary map、旧key fallback、环境偷偷异schema |
| 改RuntimeConfig/type/ctor/trait/DTO/error/flow/guard | 先03对应Step/正式具名回写重审再定稿04；若touch truth/授权/key/BC先00/01/02/owner | 在04只给一个新setter或测试stub先实现 |
| 新产品/pin/SDK/provider/router | 具体版本/features/依赖闭包、所有原方法/private/错误/retry/route/secret/current核；core path/runtime/event类型不混 | latest/tag伪pin、runtime owner写Cargo dependency |
| 平台API/source method变化 | installation/capability/version/family/mode/auth/ACK/edit/delete/thread/附件/rate/probe/comparator逐项重判 | “兼容Slack即可所有平台”；新session自动关gap |
| 普通值/profile变化 | 硬范围/批准tuple/current/C01/cold/原subject预算与测试切口重新核 | 文件写值当批准、加大原budget/used归零 |
| store/schema或canonical/key codec变化 | 原drivercommit unknown/probe与不可变key/op/effect/history迁移读取/唯一约束必须具名设计 | 新库NotFound当NoEffect、新key覆盖旧unknown |
| 废弃/删除selector或旧driver | 确认真实published用途、所有原subject恢复/read/probe/typed审计消费需求可满足，owner retention批准 | 只TTL/零调用次数删除key/result/tombstone/unknown、备份raw secret |
| 脚本/report/gate新增 | 05/07先完整脚本参数/输入输出/错误/路径回03 Step4/16，07 planned boundary | 临时工具当正式实现/运行证据或本轮创建ledger |

旧selector退役只删除可替换的配置选择入口，不意味着可删durable原operation引用；secret值生命周期由provider权限和private合同，安全pointer/history的保留不能成为存raw secret的理由。原owner/platform/internal truth、current授权、immutable known/unknown、Query no-write和全出口材料边界始终不被migration放宽。

### 7.3 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| exact schema1/无已核旧配置迁移/未来反校准规则 | 否 | 配置演进，未引入converter/new field/public API | 原03§13/16~17不改 | 无回写 |

## 8. 回填草稿

正式§13逐字装配§7.1~7.3；当前无已核发布迁移项，不把历史材料当版本兼容/外部产品事实。新增或废弃都按具名consumer/current/原subject保护闭口，不能alias fallback或TTL删未知；无迁移实现/脚本/成功记录。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；旧README实际全文与旧05/06定点冲突扫描保historical，current无已核发布迁移项，不删历史文件/原key或创建converter。

self_review=pass_design_static；下一仅enter_step14。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
