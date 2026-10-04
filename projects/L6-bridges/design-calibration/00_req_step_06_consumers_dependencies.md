# L6-bridges 00 Step 6：使用方与依赖

> 状态：done / pass；回填00 §6；full-restart。

## 1. 状态与 Step 内计划

开工确认：六标准、台账/flow、Step2/5与平台附录、需求SOP Step6、书写规范§4.6、全局规则§2/4.1/5/6已读；补核Core00 §2。进入条件pass；依赖图不表示调用顺序；只编译期边可进package dependency。

| 单元 | 思考 | 写入 | 自检 |
|---|---|---|---|
| 内部/外部关系裁剪 | done | done | pass |
| 三表与ASCII | done | done | pass |
| adapter/config/secret seam | done | done | pass |

## 2. 输入

全局规则§4 L6-bridges行与§4.1 Layer5；专项正式00 §2/12及必要03；Step1来源状态；Step5附录PS-01~14。L5-chat未停审内容排除。

## 3. SOP 逐项问题回答

| 问题 | 回答 |
|---|---|
| 向谁提供？ | 向Conversation交接合规桥接来源，向平台提供允许外显的协作结果，向Observability交接安全材料；产品只可未来消费局部状态。 |
| 依赖谁？ | Core/SDK正式契约；Conversation事实/接纳；Identity AI锚点与正式actor责任链；Governance适用性；条件Artifact、Workspace、Observability；平台与secret解析。 |
| 全局哪些边？ | 基础Core/SDK、外部API、映射到内部正式边界；专项owner为运行/事件/ref消费，不扩编译图。 |
| 保留/裁剪？ | 保留当前外部接入所需合同；裁剪Chat等待链、直接Runtime/Tools执行、跨平台广播和无关业务仓。 |
| 三类依赖？ | Core及选定官方SDK客户端是compile candidate；领域服务与平台是runtime；Bus参与时是event；ref是材料边界，不第四种package类型。 |
| 闭环前置？ | 合规来源、目标、授权与secret是相关方向前置；附件、Workspace读/export和审计接收按分支前置。 |
| 失效后果？ | 对应分支blocked/不可外呼；不从缓存或显示名称补授权，不伪造内部提交或handoff接受。 |
| 消费与强阻塞？ | Workspace是只读上下文消费；独立owner可见性可验证时不强制绕Workspace。敏感外显/操作资格与主体链缺失强阻塞相关路径。 |
| 非前置关系？ | Chat、Console等产品未停审输入不是前置；Bus后端、SDK包装库、KMS和路由产品未选，不证明接入运行完成。 |

## 4. 诊断

draft把Workspace视为授权owner；旧00把运行服务写成RPC/stream既成事实、SDK固定Python/TS与虚构SLA。PS资料只说明平台协议能力，不提供本仓安装授权；外部SDK/OAuth/KMS不得因概览列表直接定案。

## 5. 前后对比

通用“依赖服务” -> compile/runtime/event分类；强制等待Chat -> Layer5并行消费owner；统一secret/路由产品 -> 可验证seam及等待状态。

## 6. 取舍与复杂度

采用固定内部/外部两表、三裁剪表、依赖ASCII；附加seam复核表留calibration，不混入角色、API签名或状态机。运行合同与包依赖分开，不采用直接链接L1业务crate或跨库事务。分批结构化，无需新附录。

## 7. 结构化中间产物

### 7.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | L0-core / L0-sdk | 共享引用、错误、上下文及正式客户端接入 | 是，限已证明兼容的范围 | 不得本地复制owner契约 |
| 输入 | L1-conversation | 目标对话、参与/可见性、接纳结果、已提交事实与安全消费材料 | 是 | 对应入出站不可形成有效交接 |
| 输出 | L1-conversation | 经授权且带来源的外部协作材料交接 | 是 | 不能把平台接收确认称为内部提交 |
| 输入 | L1-identity | 正式AI成员身份锚点与安全引用 | 身份相关分支 | 不得用外部账号推造GlobalMember |
| 输入 | L1-governance | 适用Policy/Gate、责任链、外显及操作依据 | 是，按操作适用性 | 缺依据不允许相关外部操作 |
| 输入 | L1-artifact | 附件准入与授权可消费引用 | 附件分支 | 附件不可用；不公开或复制正文 |
| 输入 | L1-workspace | 带owner来源的只读协作语境 | 仅选用的read/export分支 | 该分支受阻；不可用投影替代授权 |
| 输出 | L4-observability | body-free桥接审计与交接材料 | 审计接收分支；强制审计操作按准入依据 | 不得冒称接收或形成真实证据 |
| 输入 | L0-bus | 已选事件传输的协作语义 | 仅event接入分支 | 事件接入受阻；不改Bus投递truth |

内部human认证/actor责任依据必须来自正式入口与owning chain；现无已闭合的统一provider，不把Identity或Governance写成统一认证中心，相关正向路径仍BR-UP-002/003。

### 7.2 外部系统依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入/输出 | Slack | 授权安装中的事件、消息与交互协议 | Slack分支 | 该安装接入/交付不可用，不影响其他绑定的truth |
| 输入/输出 | Mattermost | 指定实例/版本的事件、帖子与交互协议 | Mattermost分支 | 该实例分支不可用；不默认支持最新Blocks |
| 输入/输出 | Telegram Bot API | 选定bot安装的更新、消息与callback协议 | Telegram分支 | 保留gap/不可用；不承诺完整历史/普通删除通知 |
| 输入/输出 | Discord | 指定应用安装的Gateway/HTTP交互与消息协议 | Discord分支 | 权限/intent/session受限分支不可用 |
| 输入 | 已授权secret resolver | OAuth/PAT/API key/bot/webhook材料的opaque ref解析与版本有效性 | 对应外呼/验证分支 | 缺失、撤销或版本不明不得外呼；provider未选 |

### 7.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 基础共享契约 | 依赖方 | 编译期候选 | 是 | 只消费正式共享类型 |
| L0-sdk | 正式客户端主入口 | 依赖方 | 编译期候选/运行期 | 是 | 包选择依语言/兼容合同；服务调用仍runtime |
| L1-conversation | 内部正式边界 | 协作方 | 运行期/事件协作 | 是 | 入站接纳与已提交事实消费 |
| L1-identity | 身份锚点 | 依赖方 | 运行期/事件协作 | 是 | 仅AI身份与安全引用，不含认证授权 |
| L1-governance | Policy/Gate治理边界 | 协作方 | 运行期/事件协作 | 是 | 不旁路正式适用性与责任链 |
| L1-artifact | 可消费制品引用 | 协作方 | 运行期/事件协作 | 是，条件分支 | 附件交接不迁移正文 |
| L1-workspace | 只读上下文消费 | 依赖方 | 运行期/事件协作 | 是，条件分支 | 不设为授权或频道owner |
| L4-observability | 审计材料消费者 | 协作方 | 运行期/事件协作 | 是，受blocker控制 | 接收合同不证明真实运行 |
| L0-bus | 事件传输协作 | 依赖方 | 事件协作 | 是，条件分支 | 后端未选；transport truth不归本仓 |
| 四平台 / secret resolver | 外部API与秘密材料 | 依赖方 | 运行期 | 是，按平台独立 | adapter/config/secret seam隔离 |
| L5-chat | Layer5并行产品入口 | 潜在协作方 | 运行期候选 | 否 | 未停审内容reference_only，不作为前置 |
| L2-runtime / L2-tools / L3-capability-hub | 间接执行/能力消费 | 非直接依赖方 | 运行期背景 | 否 | 不为外部按钮开直接执行入口 |

### 7.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | L0-core、选定L0-sdk客户端包 | 共享类型/客户端contract候选；不链接领域仓实现 | 01/03/07选型与依赖闭包 |
| 运行期依赖 | 专项owner、四平台、secret resolver | 通过正式服务/adapter消费授权能力；ref不是数据库共享 | 01/02/03/04合同与配置 |
| 事件协作依赖 | L0-bus及已闭合source/consumer | 已提交来源与安全交接；不把业务仓当package dependency | 02/03/05/06协议与反例 |

### 7.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Bridges直接链接/读写L1业务内部表 | 形成第二真相或跨仓事务 | 正式SDK/query/command/event/ref |
| 依赖未停审Chat正文决定审批入口/路由 | 并行窗口串线 | owner正式合同；安全入口缺失时仅无动作提示或blocked |
| external account/channel推导内部成员/权限 | 隐式授权 | 显式binding与主体责任、target/source校验 |
| 平台adapter直接执行工具或批准Gate | 绕过Policy/Gate | 验证后交接owner，记录独立结果 |
| 将平台SDK/OAuth/KMS/路由产品植入领域truth | 环境选型穿透owner | adapter/config/secret引用及版本核验 |

#### 依赖裁剪图: L6-bridges

```text
Global baseline (Layer 5 window)
  |
  | crop only related edges
  v
+---------------------+
| L6-bridges          |
+----------+----------+
           +--[compile]------------> L0-core / L0-sdk package (candidate)
           +--[runtime]-----------> Conversation / Identity / Governance
           +--[runtime]-----------> Artifact / Workspace / Observability
           +--[event]-------------> L0-bus + authorized source/consumer
           +--[runtime]-----------> Slack / MM / Telegram / Discord
           +--[runtime]-----------> secret resolver

L5-chat: parallel reference_only, not an input edge
```

图示说明：只画本仓相关消费/协作边；compile是候选不是已pin依赖；runtime/event不得写成package依赖；箭头不是调用、事件传播或实施顺序。所有ref/visibility仍回指各owner。

### 7.6 seam复核（calibration，不是产品选择）

| seam | 重新核验内容 | 当前状态 / 缺失行为 |
|---|---|---|
| 平台SDK或直接API | 生命周期维护、协议版本、验签覆盖、retry默认值、redaction、许可、语言兼容 | not_selected；未经核验不继承SDK默认重试 |
| Slack安装OAuth | bot/user scope、安装主体/租户、redirect/state、grant版本、撤销/rotation | 公开来源已读，grant not_established |
| Mattermost plugin/PAT/OAuth | 实例版本、插件可信入口、启用与account权限、Blocks/legacy | 形式not_selected；不得使用管理员PAT默认全权 |
| Telegram bot token/webhooksecret | bot安装、入口互斥、secret header、cloud contract版本/时限 | source_partially_verified；官网限制待复核 |
| Discord安装OAuth/bot/HTTP或Gateway | guild/user install、scope与channel权限、privileged intent、interaction入口、token时效 | 公开来源已读，安装/intent not_established |
| KMS/secret provider | opaque ref的owner/版本/expiry/撤销、最小解析权、轮换后的effect continuity | not_selected；不把opaque ref本身当secret可用证明 |
| 路由/网关产品 | 配置目标allowlist、tenant边界、HTTP/Gateway生命周期、SSRF/重定向、callback受控目的地 | not_selected；禁止未经绑定动态跳目标 |

## 8. 回填草稿

正式§6采用§7.1~7.5和ASCII。§7.6只作延伸阅读及后续配置输入；不固化包名、版本、provider或API签名。

## 9. 待确认

BR-UP-001~009开放；上游台账不证明Bridges可调用；平台/SDK/provider/pin未选，BR-UP-010保持reference_only。

## 10. 进入下一步条件

自检：固定三表、内部/外部方向、前置与失效影响齐全；ASCII标题/标签/说明符合全局规则；SDK候选与runtime分开；Chat未入主链；seam未被伪造为可用。允许Step7。

Step17格式复核：将图的`[compile candidate]`标签规范为`[compile]`，candidate保留在节点说明；只是满足全局图标签格式，不改变编译资格或依赖方向。

```text
gate_status = pass
next_allowed_action = sequential_capability_cards_step_07
commit_required = false
```
