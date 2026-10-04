# L6-bridges 01 Step 7：依赖方向与层间约束

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step5/6 pass；已读全局依赖§2/4.1/5/6、SOP Step7、规范§4.8，以及00§6/12。按架构责任角色及U1~U6逐单元收敛，每个单元完成后停审，最后跨依赖审计；不写API、DDL、调用链或package实现。

| 单元 | 思考 | 写入 | 停审 | gate_status / 下一动作 |
|---|---|---|---|---|
| U1 绑定映射 | done | done | done | pass / U1_dependency_boundary_stopped |
| U2 入站交接 | done | done | done | pass / U2_dependency_boundary_stopped |
| U3 外显交付 | done | done | done | pass / U3_dependency_boundary_stopped |
| U4 交互责任 | done | done | done | pass / U4_dependency_boundary_stopped |
| U5 连续性恢复 | done | done | done | pass / U5_dependency_boundary_stopped |
| U6 安全读取追溯 | done | done | done | pass / U6_dependency_boundary_stopped |

## 2. 责任层与总方向

#### 依赖方向图: Bridges责任角色

```text
      +====================================================+
      |              L6-bridges dependency boundary        |
      |                                                    |
      |  external seam roles                               |
      |  platform / owner / secret / bus boundaries        |
      |                    | boundary access               |
      |                    v                               |
      |  orchestration / handoff roles                     |
      |  inbound / outbound / callback / recovery          |
      |                    | allowed dependency            |
      |                    v                               |
      |  core semantic roles                               |
      |  binding / mapping / stage / effect invariants     |
      |                                                    |
      |  technical support roles                           |
      |  local state / id / clock / rate / transport       |
      +====================================================+
```

图示说明：

- 箭头只表示依赖边界：外部接缝经正式边界进入承接角色，承接角色受核心语义约束；不表示运行时顺序。
- 技术承载只能支持局部语义，不能反向决定owner、授权、状态或材料边界。
- 运行期和事件协作关系不进入package dependency；只有L0-core及经兼容核验的L0-sdk才是compile候选。

## 3. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 内部层次？ | 核心语义、编排/交接、外部接缝、技术承载四类责任角色；不是代码目录。 |
| 允许方向？ | seam→orchestration→core；orchestration可依赖技术支撑；core只依赖稳定共享契约/抽象边界，不依赖平台或owner实现。 |
| 禁止反向？ | core→平台/owner私表，技术层→业务授权，外部回调→Decision/Tools，query→维护，运行期仓→源码package。 |
| 外部如何接入？ | 平台adapter、owner SDK/API/event、secret private seam、Bus event边界及Observability handoff。 |
| 主链跨仓边？ | L0-core compile候选；L0-sdk compile/runtime候选；Conversation/Identity/Governance/Artifact/Workspace/Observability runtime/event；L0-bus event；平台/secret runtime。 |
| 哪些裁剪？ | L5-chat未停审，不入主链；L2/L3执行能力为背景，不直接依赖。 |
| 哪些倒置？ | core不认识具体adapter/provider；交接用port/typed boundary；配置只能在装配/seam读；owner结果与平台receipt由边界返回。 |
| 最易失控规则？ | 把runtime写成源码依赖、把source actor当human、把bus ACK/HTTP2xx当业务结果、让fallback换target/effect、让query刷新。 |

## 4. 当前材料诊断与取舍

旧01§7把mapping/authz、turn translation、gate projection和adapter混写为直接依赖，并把Governance/Identity/Observability当可写内部模块。当前按全局关系裁剪，禁止同仓私表/源码链接；采用端口/adapter/event/reference边界，不采用直接共享数据库或平台SDK侵入核心。

## 5. 逐单元依赖校准

### 5.1 U1绑定映射

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| L0-core共享ref/error；L0-sdk兼容客户端；Identity AI ref；Governance basis；平台installation/capability；secret resolver | Identity认证表、Governance裁决表、Workspace权限表；显示名推断；直接平台SDK绑定核心 | typed binding/basis/secret/capability port；平台/owner只返回验证引用与版本 | pass |

### 5.2 U2入站交接

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| U1 mapping/generation；平台验证；Conversation正式交接边界；Artifact material ref；Governance visibility/action依据 | 直接写Conversation/Turn/Participant表；以ACK创建事实；raw body持久化 | owner handoff boundary显式target mode/actor/kind/digest；adapter只供可信source | pass |

### 5.3 U3安全外显交付

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| committed owner ref；U1 current mapping；Governance外显/Policy/Gate依据；Artifact传播ref；平台adapter；secret/限流支撑 | 直接改Conversation truth；平台message查询替授权；callback直接批准；跨平台广播 | delivery intent/attempt/receipt port；平台业务结果经adapter回传；material只读ref | pass |

### 5.4 U4交互责任

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| U1 source/action mapping；平台签名/交互验证；Identity AI锚点与正式human责任owner ref；Governance owner action | Identity认证实现；本地Gate/Decision；Runtime/Tools直连；私有callback写观测正文 | verified interaction → owner action handoff port；owner二次核验返回独立结果，human责任owner仍待BR-UP-002确认 | pass |

### 5.5 U5连续性恢复

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| U1~U4 operation/effect refs；平台限流/探测能力；owner结果查询；本地状态/时钟/claim支撑 | 跨namespace裸cursor；默认retry库；以时间/HTTP推无效果；改owner/platform truth | comparator/retention/probe作为正式边界输入；无证据保持unknown/manual | pass |

### 5.6 U6安全读取追溯

| 允许依赖 | 禁止依赖 | 倒置/接入边界 | 停审 |
|---|---|---|---|
| 本仓局部状态；Observability安全handoff；owner safe ref；scope/visibility只读判定 | 直接写Observability证据；读触发repair/replay；body/secret日志；consumer接受推断 | body-free handoff/read port；consumer disposition只返回真实状态/unknown | pass |

## 6. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 基础共享契约 | 依赖方 | 编译期候选 | 是 | 只消费正式共享类型/错误/metadata。 |
| L0-sdk | Layer5正式客户端入口 | 依赖方 | 编译期候选/运行期 | 是 | 包和版本未核验，服务调用仍是runtime。 |
| L1-conversation | 对话真相边界 | 协作方 | 运行期/事件协作 | 是 | owner交接及committed来源。 |
| L1-identity | AI身份锚点 | 依赖方 | 运行期/事件协作 | 是 | 不承接human认证授权。 |
| L1-governance | 治理决策边界 | 协作方 | 运行期/事件协作 | 是 | Policy/Gate/action basis。 |
| L1-artifact | 制品与附件边界 | 协作方 | 运行期/事件协作 | 是，条件 | 只消费授权ref。 |
| L1-workspace | 跨域只读视图 | 依赖方 | 运行期/事件协作 | 是，条件 | 不替权限/频道owner。 |
| L4-observability | 安全观察消费者 | 协作方 | 运行期/事件协作 | 是，受资格 | 不把handoff当evidence。 |
| L0-bus | 事件传输主干 | 协作方 | 事件协作 | 是，条件 | 不拥有业务接纳/效果truth。 |
| 四平台 | 外部协议边界 | 依赖方 | 运行期 | 是，逐安装 | 不把平台truth迁入。 |
| secret resolver/KMS | 私有材料边界 | 依赖方 | 运行期 | 是，条件 | provider/KMS未选，不存raw secret。 |
| L5-chat | Layer5并行产品 | 潜在协作方 | 运行期候选 | 否 | 未停审，不能作为输入或审批入口。 |
| L2-runtime/L2-tools/L3-capability-hub | 间接执行能力 | 背景方 | 运行期背景 | 否 | Bridges不提供直接执行入口。 |

## 7. 依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | L0-core、经核验的L0-sdk包 | 共享契约/客户端候选 | 02/03/07依赖闭包 |
| 运行期依赖 | Conversation、Identity、Governance、Artifact、Workspace、四平台、secret resolver、Observability | 经正式API/SDK/adapter/handoff消费能力 | 01/02/03/04/05 |
| 事件协作依赖 | L0-bus及授权owner来源/消费者 | 事件来源、交接、观察材料；传输不拥有业务truth | 02/03/05/06 |

## 8. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| 直接链接/读写任一L1内部表 | 形成第二truth和跨仓事务 | formal API/SDK/query/command/event/ref |
| 运行期仓写Cargo/package path | 把runtime/event误作compile | adapter/event/projection/handoff |
| 平台SDK进入核心语义 | 平台变化穿透边界 | per-platform seam返回typed能力/结果 |
| external ID推GlobalMember/权限 | 隐式授权和身份串线 | 显式binding与owner责任ref |
| callback直批Gate或调Runtime/Tools | 绕过Policy/Gate和执行owner | owner action handoff |
| query刷新/修复/重放 | 破坏no-write与阶段解释 | 显式维护/恢复命令 |
| L5-chat未停审路由 | 并行窗口串线 | owner正式合同，当前保持reference_only |

### 8.1 全局裁剪图（装配复核）

Step16复核补齐全局规则§6要求的独立裁剪图；图仅重组§6~§8已确认边，不增加依赖或产品选择。

#### 依赖裁剪图: L6-bridges

```text
Global dependency baseline
  |
  | crop only Bridges-related edges
  v
+---------------------+
| L6-bridges          |
+----------+----------+
           |
           +--> [compile] L0-core / L0-sdk (compatibility candidates)
           |
           +--> [runtime] L0-sdk -> formal owner boundaries
           |             Conversation / Identity / Governance
           |             Artifact / Workspace / Observability
           |
           +--> [runtime] Slack / Mattermost / Telegram / Discord
           |             authorized secret resolver
           |
           +--> [event]   L0-bus / eligible owner event boundaries
```

图示说明：

- 只展示Bridges相关边；compile仅为兼容候选，未据图声明包或版本已选。
- runtime与event不进入owner源码package；条件owner/Bus/secret分支须相应资格成立。
- 箭头表示依赖/消费/协作，不表示调用、事件传播或实施顺序；L5-chat无正式输入边。

表示层补图自检pass：依赖类型、三表、禁止依赖及图一致；未选产品、BR-UP和并行来源限制保持不变。

Step16全文复核将U4中过宽的Identity责任引用限定为AI锚点，human责任仍由尚待确认的正式owner提供；依据Step1/5、00 Step15与Identity正式01§4。修正未任命human owner或关闭BR-UP-002，责任层图墙线及标题已与正式§8统一。

## 9. 回填草稿、待确认与跨审

正式§8摘录§2、§5~§8及裁剪图；图后说明只表达边界，不写函数。跨审：U1~U6没有反向依赖；所有runtime/event边均标明非package；L0-core/SDK compile候选仍需兼容核验；BR-UP-001~009未关闭。旧01的authz/turn/gate模块仅后置差异材料。

## 10. 自检与门禁

自检：责任层、单元允许/禁止/倒置、三张裁剪表、禁止表和图均已结构化；未把adapter/repository/handler写成架构层，未把Chat或L2/L3背景升级主链。当前agent设计自检pass。

gate_status=pass；gate_reason=dependency_roles_and_crop_audit_passed；next_allowed_action=read_step_08_then_create；source_files=Step5/6/00/全局依赖§2/4.1/5/6/SOP7/规范4.8；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
