# ADR-0009:ViewProfile 归 method-library —— L1 域全量返数据、视图策略外置

> Status: **Accepted**
> Date: 2026-05-09
> Deciders: Aris
> Consulted: `product/六域模型.md` §9.3 方法库横切 / `domain/work/README.md` §3 / `domain/process/README.md` §3 / `domain/governance/README.md` §3 / `product/产品矩阵.md`
> Informed: method-library 仓 / console 仓 / chat 仓 / 各 L1 域

---

## 1. 背景

六域模型的一个核心承诺是**六域平权**:身份 / 对话 / 工作 / 过程 / 治理 / 制品,没有主从关系,平等交换事件。但"看板 / 审批卡片 / 时间线"这些视图面板,在不同 Role(PM / Tech Lead / Developer / Auditor / User)眼里需要看到的字段、派生信息、脱敏程度**不一样**:

- **PM** 看项目时关心进度、Velocity、风险清单
- **开发** 看项目时关心 assigned WorkItem、Blocker、当前 Sprint
- **Auditor** 看项目时关心 Gate / Nonconformity / baseline 轨迹,不关心日常任务细节
- **External User** 可能只看到公共摘要,敏感配置 / 内部讨论不可见

"视图与数据要不要分离"既往在 process / work / governance 的 README 都没有正式锁定,实际实现容易走向两种歧路:

### 1.1 两种歧路

**歧路 A:L1 域按 Role 过滤数据**
- 如 `WorkService.GetProject(role=developer)` 返回被裁剪的 Project
- **问题 1**:L1 域耦合了 identity 域的 Role 概念,破坏六域平权
- **问题 2**:过滤规则分散在 6 个 L1 域,组织换视图策略要改多个仓
- **问题 3**:反可裁剪性 —— 策略硬编码进业务逻辑,不同组织无法各自调整

**歧路 B:前端各自脱敏**
- 每个 UI 仓(Console / Chat / Mobile)各自实现"看到哪些字段"的规则
- **问题 1**:策略重复三份,不一致
- **问题 2**:合规审计要求"视图策略有统一源",多份实现不可审计

需要正式锁定视图与数据的分离方式,并把视图策略放到合适的承载位置。

---

## 2. 决策

**采用"L1 全量返回 + ViewProfile 作为 SPEM Method Content 归 method-library + UI 仓消费"三层架构**:

### 2.1 三层职责

```
[L1 域(work / process / governance / ...)]
    职责:返回聚合根的**全量数据**,不做 Role 过滤,不感知 Role 概念
    输入:聚合根 ID + 调用者 actor(仅用于审计 / 鉴权,不用于过滤)
    输出:完整字段集

        ↓ UI 仓消费时 ↓

[method-library 仓 · ViewProfile 资产]
    职责:定义"某 Role 看某 kind 的对象时,可见字段 + 派生字段 + 脱敏规则"
    产物:结构化 ViewProfile 文档(类似 SPEM Method Content)
    生命周期:与其他 Method Content 同(draft / published / retired)

        ↓ 按 (actor.role, object.kind) 匹配 ↓

[UI 仓(console / chat / mobile / marketplace)]
    职责:按 ViewProfile 渲染页面
    输入:L1 全量数据 + 从 method-library 拉取的 ViewProfile
    输出:渲染后的 UI 视图
```

### 2.2 ViewProfile 数据结构

```
ViewProfile {
    view_profile_id:        ULID,

    // 标识
    name:                   String,                    // "pm-default-project-view"
    display_name:           String,
    version:                Semver,

    // 匹配条件
    applies_to_role:        RoleRef,                   // identity Role 引用
    applies_to_object_kind: ObjectKind,                // project / workitem / activity / gate / artifact / ...
    scope:                  ProfileScope,              // organization / project / role-specific

    // 字段可见性(核心)
    visible_fields:         Vec<FieldSelector>,        // 白名单字段路径
    hidden_fields:          Vec<FieldSelector>,        // 黑名单(优先级高于 visible)
    masked_fields:          Vec<MaskRule>,             // 脱敏(如 email 显示首尾)

    // 派生字段
    derived_fields:         Vec<DerivedField>,         // summary / progress_pct / risk_label

    // 排序与分组(看板级)
    default_grouping:       Option<FieldPath>,
    default_sorting:        Vec<SortRule>,
    default_filters:        Vec<FilterRule>,

    // 生命周期
    lifecycle:              MethodContentLifecycle,    // draft / published / deprecated / retired
    published_at:           Option<Timestamp>,
    retired_at:             Option<Timestamp>,

    // 审计
    created_by:             ActorRef,
    approved_by:            Option<ActorRef>,
    approved_via_gate:      Option<GateRef>,
    trace_id:               TraceId,
    audit_log_ref:          AuditLogRef,
}

FieldSelector = String             // JSONPath 风格:"project.backlog.items[].priority"
MaskRule = { path: FieldPath, strategy: MaskStrategy }  // partial / hash / redact
DerivedField = {
    name:                   String,
    expression:             DerivationExpr,            // 表达式(L1 返的全量字段 → 派生值)
    description:            String,
}
```
### 2.3 三个关键不变量

**INV-V1** 所有 L1 域的 Get / List / Query 类 RPC,**不接受 Role 参数**,不按 Role 做字段过滤。actor 仅用于鉴权(有没有权限读取整个对象)和审计留痕。

**INV-V2** ViewProfile 的 visible_fields / hidden_fields 冲突时,**hidden_fields 优先**(安全默认,宁可漏看不可漏脱敏)。

**INV-V3** 没有匹配 ViewProfile 的 (Role, ObjectKind) 组合,UI 仓**降级为全量展示**(开发期可用)或**拒绝渲染**(生产期安全默认)。生产期的默认行为由组织级 Policy 决定。

### 2.4 归属 method-library 的理由

ViewProfile **是方法资产**,和 RoleDefinition / TaskDefinition / WorkProductDefinition 并列:

| 方法资产 | 回答的问题 |
|---|---|
| RoleDefinition | 谁来做(Role 的职责、能力、权限) |
| TaskDefinition | 做什么(任务步骤、输入输出) |
| WorkProductDefinition | 产出什么(制品形态、验收标准) |
| **ViewProfile** | **怎么看**(Role 看某对象时的视角) |

这四者都是 SPEM 2.0 Method Content 的合法范畴(Method Content 广义包括 Role/Task/WorkProduct/Guidance,Guidance 里天然容纳视图约定)。

### 2.5 发布与消费流程

```
[组织 / Template 作者在 method-library 编辑 ViewProfile]
    │
    │ 草稿 → 发布需经 Gate(kind=custom + metadata.gate_subkind=method-content-publish)
    ▼
[method-library.view_profile.published] 事件
    │
    │ 订阅:console / chat / mobile 等 UI 仓的 view-config 缓存
    ▼
[UI 仓从 method-library 定期拉最新 ViewProfile]
    │
    │ 本地缓存(带 TTL + fingerprint 校验)
    ▼
[用户访问页面 → UI 仓按 (当前 user.role, 对象 kind) 匹配 ViewProfile]
    │
    │ 调 L1 域 RPC 拿全量数据
    ▼
[按 ViewProfile 的 visible_fields / hidden_fields / derived_fields 渲染]
```

派生字段的计算**在 UI 仓**执行,不回 L1。L1 不感知派生逻辑存在,保持纯净。

---

## 3. 理由

### 3.1 为什么 L1 域不做 Role 过滤

- **六域平权**:Role 是 identity 域的概念,让 work / process / governance 去理解 Role → 反向耦合 identity,破坏平权
- **单一真相**:同一份数据不应根据调用者 Role 返回不同形态,否则"我和你看的不是同一个 Project"会导致跨域协同困难
- **可测试性**:L1 域的 API 契约固定,不因 Role 变化,单测和集成测试稳定
- **审计可追溯**:审计人员问"这个字段当时是什么值",答案固定,不依赖"当时谁看的"

### 3.2 为什么不放在前端各自实现

- **策略一致性**:三红线第 1 条(可审计性)要求视图策略有统一源,否则"某 Role 能不能看某字段"有三份不一致的答案,无法合规解释
- **组织定制**:不同组织的视图策略可能完全不同,硬编码在前端就无法定制
- **部署成本**:视图策略变更不应触发 UI 发版,通过 method-library 发布新版本即可

### 3.3 为什么归 method-library 而非 identity 或 governance

- **不归 identity**:Role 定义在 identity,但"某 Role 看某对象的视角"是**方法论资产**,不是身份属性。把视图策略放 identity 会让 identity 膨胀成"身份 + 权限 + 视图"混合体
- **不归 governance**:governance 管"决策 / Policy / 合规"。视图策略虽然有合规属性(脱敏规则),但主体是**可复用的方法资产**,Policy 只是对 ViewProfile 的引用和强制
- **归 method-library 天然契合**:
  - SPEM Method Content 概念原生支持视图约定(Guidance)
  - 与 RoleDefinition / TaskDefinition 共用 Publish / Tailoring / 版本管理机制
  - Marketplace 机制可复用(不同组织可分享 ViewProfile 预设)

### 3.4 为什么派生字段在 UI 仓计算而非 L1

- **L1 纯净性**:L1 只负责业务事实,派生字段是 UI 表达,不是业务真相
- **灵活性**:UI 仓可能需要不同派生字段(桌面 Console vs 移动 App),不强求统一
- **性能**:派生字段往往是小开销计算(进度百分比、标签染色),在 UI 仓做延迟最低

---

## 4. 后果

### 4.1 正面

- **L1 域简洁**:work / process / governance 的 RPC 不用管 Role,接口稳定
- **视图策略统一**:method-library 单一源,改一处全生效
- **可审计**:ViewProfile 有版本 + Gate 审批 + fingerprint,哪个 Role 在哪个时刻看到什么,可追溯
- **可裁剪**:不同组织自定义 ViewProfile,通过 Profile 机制继承 / 覆盖
- **Marketplace 潜力**:优秀的 ViewProfile 预设(如"PM 经典看板")可以作为市场资产分发

### 4.2 负面

- **UI 仓复杂度上升**:要消费 method-library、缓存、按 Profile 渲染
- **ViewProfile 设计成本**:初期需要为常用 (Role, ObjectKind) 组合准备预设,否则组织开箱即用体验差
- **跨仓延迟**:UI 仓首次渲染要两次调用(ViewProfile + L1 数据),需要并发 + 缓存优化
- **调试难度**:用户反馈"看不到字段"要分辨是权限不足、ViewProfile 过滤还是真没数据,日志需要详尽

### 4.3 风险缓解

- **预设 ViewProfile 套件**:method-library 随首版发布"6 Role × 常用 ObjectKind"的默认 Profile 套件,覆盖 80% 场景
- **UI 开发模式**:开发环境允许"绕过 ViewProfile,全量展示"以便调试,生产环境强制校验
- **缓存策略**:ViewProfile 在 UI 仓本地缓存,TTL 5 分钟,fingerprint 不匹配立即失效
- **日志规范**:UI 仓在隐藏字段时打可见日志"字段 X 因 ViewProfile Y 被隐藏",便于用户和支持排查
---

## 5. 约束与边界

### 本 ADR 锁定

- L1 域(work / process / governance / artifact / identity / conversation)的 Get / List / Query 类 RPC **不接受 Role 参数**,不按 Role 过滤
- ViewProfile 作为 SPEM Method Content 的一种,归 method-library 仓承载
- ViewProfile 结构按 §2.2 定义(visible / hidden / masked / derived / 分组排序)
- UI 仓按 (user.role, object.kind) 匹配 ViewProfile 渲染
- 派生字段的计算在 UI 仓,不回 L1
- hidden_fields 优先级高于 visible_fields(安全默认)
- 无匹配 ViewProfile 时生产环境默认拒绝渲染,由组织级 Policy 决定降级策略

### 本 ADR 不锁定

- **ViewProfile DSL / 表达式引擎的具体实现**:由 method-library 仓决策
- **ViewProfile 的存储与索引细节**:由 method-library 仓决策
- **UI 仓的缓存策略细节**:各 UI 仓可按需定制
- **Marketplace 中 ViewProfile 的商业化形式**:由 Marketplace 设计决策
- **移动端是否允许"本地自定义 ViewProfile 覆盖组织下发"**:未来 UX 讨论

### 与权限的关系

**ViewProfile 不是权限系统**。权限仍由 identity + governance 共同决定:
- identity 决定用户有没有资格读取某个对象
- governance 的 Policy 决定组织级访问限制
- **ViewProfile 只在用户已有权限读取对象的前提下,决定"怎么渲染"**

如果用户无权读取对象,L1 域应直接返回 PermissionDenied,轮不到 ViewProfile 过滤。

---

## 6. 标准对齐

- **SPEM 2.0**:ViewProfile 作为 Method Content 之一(Guidance 范畴的延伸),与 Role / Task / WorkProduct 并列
- **ISO 24748-2 Tailoring**:组织可通过 ProcessProfile 继承 method-library 的 ViewProfile 并 Tailoring,保持裁剪路径统一
- **ISO 42001 A.7 Data Management**:脱敏规则在 ViewProfile 中显式定义,可审计
- **ISO 25010 Accessibility / Usability**:不同 Role 的视图适配是 Usability 的一部分,正式纳入方法论
- **架构红线**:
  - **可审计性**:ViewProfile 有版本、Gate 审批、fingerprint,所有裁剪都可回放
  - **可追溯性**:UI 渲染日志记录 ViewProfile 版本,"当时看到了什么"可追查
  - **可裁剪性**:ViewProfile 是方法资产,不同组织可自定义、继承、覆盖

---

## 7. 后续行动

1. **本 ADR 接受后**:
   - 新建 `domain/method-library/README.md`(段 2 漏项)完整写方法库域,ViewProfile 作为其中一节
   - 订正 `domain/identity/README.md`(未来)引入"Role → ViewProfile 匹配"的接入点说明
   - 各 L1 README(work / process / governance / artifact)的 RPC 章节在"权限与认证"子节明确"Get 类 RPC 不按 Role 过滤字段"
   - `product/六域模型.md` §9.3 方法库横切补 ViewProfile 为方法资产第四类

2. **短期(段 3)**:
   - method-library 仓搭起骨架,提供 ViewProfile 的 CRUD + Publish Gate + fingerprint
   - Console 仓实现 ViewProfile 消费 + 缓存 + 渲染管线
   - 发布首版 ViewProfile 预设:(6 Role × 10 常用 ObjectKind) 共 60 份
   - 新增事件:`method_library.view_profile.drafted / published / deprecated / retired`

3. **中期**:
   - Chat 仓接入 ViewProfile(移动对话视图)
   - Mobile App 接入
   - Marketplace 支持 ViewProfile 上架

4. **长期**:
   - 观察 ViewProfile 使用数据,决定是否引入"ViewProfile 继承链"(基础 Profile + Role-specific 覆盖)
   - 若派生字段表达式复杂度失控,考虑独立 DSL 规范

---

## 8. 参考

- `product/六域模型.md` §9.3 方法库横切 / §2.3 八条原则(Definition vs Use 分离)
- `product/产品矩阵.md` §方法库 / §Marketplace
- `domain/work/README.md` §3 RPC / §一 边界(不做的事)
- `domain/process/README.md` §3 RPC / §一 边界
- `domain/governance/README.md` §3 RPC / §一 边界
- `methodology/standards-discussion/SPEM-2.0.md`(Method Content / Guidance)
- `methodology/standards-discussion/ISO-42001.md`(A.7 Data Management 脱敏)
- `methodology/standards-discussion/ISO-25010.md`(Usability / Accessibility)
- Research:视图与数据分离在现代 SaaS 平台的常见实践(Salesforce Profile / Jira Field Configuration Scheme 的对比)
- 相关 ADR:ADR-0008(Activity.completion_policy,同批配置化思路)
