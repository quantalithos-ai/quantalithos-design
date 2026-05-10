# 段 2 · 设计补全 · 完结文档

> **状态**:**完结**(Ready for Phase 3)
> **日期**:2026-05-10
> **总产出**:11 份 ADR + 1 份讨论笔记 + 7 份域设计 + 事件契约主表 + 架构契约三件套骨架
> **下一步**:段 3 · 代码实施

---

## 一、段 2 的目标与完成情况

### 1.1 原始目标

> 段 1 完成了蓝图(产品叙事 + 六域模型 + 26 仓拆分 + 标准对齐)。段 2 的目标是**让蓝图变成可以写代码的设计**。

具体衡量:
- ✅ 六个 L1 域 + method-library 域每个有"可以写代码"粒度的 README
- ✅ 关键跨域契约(事件总线 / proto / SDK)有骨架设计
- ✅ 关键决策有 ADR 锁定
- ✅ 三红线(可审计性 / 可追溯性 / 可裁剪性)贯穿每份文档
- ✅ 14 份标准 + Research 结论全部对齐

### 1.2 实际完成度

**域 README**:七个域(identity / conversation / work / process / governance / artifact / method-library)全部到位,累计 9,040 行。

**ADR**:11 份(ADR-0001 ~ ADR-0011)+ 1 份 drafts 讨论笔记(ADR-0012 输入),累计 2,605 行。

**架构契约**:
- `architecture/bus-draft/README.md`(919 行)+ `event-catalog.md`(466 行,147 事件)
- `architecture/proto-draft/`(7 个 proto 文件,共 ~3,200 行)
- `architecture/sdk-draft/README.md`(983 行)
- `architecture/repo-readmes-draft/`(26 个仓 README)
- `architecture/部署架构.md`(973 行)

**判断**:段 2 目标**全部达成**。部分 Proposed 状态的 ADR 留到段 3 实施阶段转正,这是合理的"延迟决策"而非缺口。

---

## 二、本段产出清单

### 2.1 ADR 清单(11 份 + 1 笔记)

| ADR | 状态 | 主题 | 行数 |
|---|---|---|---|
| 0001 | Accepted | 多模型调用架构决策 | 253 |
| 0002 | Accepted | 设计决策记录(元 ADR)| 55 |
| 0003 | Accepted | identity 仓 Rust 技术栈 | 117 |
| 0004 | Accepted | GlobalMember vs ProjectMember 双层分离 | 138 |
| 0005 | Accepted | Role → Image 映射 | 164 |
| 0006 | Accepted | Memory 持久化归 identity | 185 |
| 0007 | Accepted | Checkpoint 持久化归 process + 大 blob 外置 | 251 |
| **0008** | **Accepted** | **Activity.completion_policy 配置化 + 两轨独立** | **307** |
| **0009** | **Accepted** | **ViewProfile 归 method-library + L1 全量返** | **300** |
| **0010** | **Proposed** | **Template 刚度三级** | **375** |
| **0011** | **Proposed** | **流程嵌套机制 SubProcess/CallActivity + CallPolicy** | **460** |
| drafts/0012 | 讨论笔记 | ActivityDeviation 机制 Q1~Q8 推演 | 615 |

**粗体**为本轮新增。

### 2.2 域设计清单(7 份域 README)

| 域 | 行数 | 聚合根 | 主对齐标准 |
|---|---|---|---|
| identity | 1,171 | GlobalMember + Role + Capability | SPEM + 42001 + 9001 |
| conversation | 972 | Conversation + Turn | BPMN Collaboration + AG-UI |
| work | 1,776 | Project + ProjectMember + Backlog + WorkItem + Iteration | 12207 + Scrum + Kanban |
| process | 1,706 | ProcessTemplate + ProcessProfile + ProcessInstance + Activity + Token | BPMN 2.0 + SPEM + 24748-2 + 29110 |
| governance | 1,798 | Gate + Approval + Policy + Control + AIIA + SoA + Nonconformity | 42001 全套 + 9001 §10 |
| artifact | 1,074 | Artifact + ArtifactRelation + Baseline + DatasetArtifact | 15288 SoI + 9001 + 25010 + 24748-2 |
| method-library | **1,543** | MethodContent(6 子类)+ MethodPlugin + MethodConfiguration | SPEM 2.0 + 24748-2 + 29110 + 42001 §5.2 |

**method-library** 是本轮新建,闭合段 2 的域设计完整性。

### 2.3 架构契约文档

- `architecture/bus-draft/README.md`(919 行)—— 事件总线抽象 + 多后端适配 + Outbox 协议
- `architecture/bus-draft/event-catalog.md`(**本轮新增 466 行**)—— **147 个事件的单一真相源**
- `architecture/sdk-draft/README.md`(983 行)—— 三语言 SDK 规范
- `architecture/proto-draft/`(7 个 proto,共 ~3,200 行)—— RPC + message 契约
- `architecture/repo-readmes-draft/`(26 个仓 README)—— 段 3 每仓初始化模板

---

## 三、本段解决的关键问题

### 3.1 Activity / WorkItem 关系(ADR-0008)

**问题**:BPMN 的 Activity 和 Scrum 的 WorkItem 是两套标准的概念,状态机不同步会引发一系列矛盾。

**结论**:**严格独立两轨**
- WorkItem 是业务真相,项目完成看它
- Activity 是流程节拍,completed 不等于 WorkItem done
- `ActivityDef.completion_policy` 四种策略(auto_complete / enforce_workitems_done / raise_gate / try_auto_then_gate)
- AutoAction 默认禁止,需 Policy 授权(复用 autonomy_level)
- 不新增 stage-exit kind,复用 quality-gate / design-choice / release-confirm

### 3.2 视图与数据分离(ADR-0009)

**问题**:不同 Role 看同一对象时需要不同字段可见性,是在 L1 域做过滤还是前端各自实现?

**结论**:**L1 全量返 + ViewProfile 归 method-library**
- L1 域 Get/List/Query 不按 Role 过滤,返全量
- ViewProfile 作为 SPEM Method Content 第四类资产,归 method-library
- UI 仓按 (user.role, object.kind) 查 ResolveViewProfile,本地渲染
- 派生字段在 UI 仓执行,不回 L1

### 3.3 Template 定位(ADR-0010,Proposed)

**问题**:Template 是严格剧本还是范式指引?

**结论**:**三级刚度**
- STRICT 剧本级 —— 偏离必经 change-request Gate
- GUIDED 范式级(推荐默认)—— 偏离允许但留痕
- ADVISORY 建议级 —— 不追踪 Activity 状态
- ExecutionMode 三档(BPMN_ENFORCED / CHECKPOINT_BASED / REFERENCE_ONLY)
- 8 种家族默认刚度分配(瀑布 STRICT / 敏捷 GUIDED / DevOps ADVISORY)
- **前置**:ADR-0012 Deviation 机制需段 3 起草

### 3.4 流程嵌套(ADR-0011,Proposed)

**问题**:现实里大流程嵌套小流程是常态,SubProcess / CallActivity 何时用?父子生命周期如何同步?

**结论**:**边界清晰的嵌套机制**
- SubProcess 内联(同 Instance,紧耦合)
- CallActivity 独立子 Instance(跨 Template 复用,松耦合)
- CallPolicy 三种(synchronous_bound / synchronous_detached / fire_and_forget)
- 嵌套深度 ≤ 5
- Checkpoint 深度优先恢复
- root_trace_id + parent_trace_id 让 observability 反查整棵调用树

### 3.5 事件契约一致性(event-catalog.md)

**问题**:七个域各自定义事件,跨域契约是否一致?

**结论**:**147 个事件登记 + 5 处命名漂移修正 + 下游订阅补齐**
- `event-catalog.md` 作为单一真相源
- 命名约定 + severity 四级 + 幂等 key 公式 + 保留期分类
- 5 个幽灵事件全部修正(process.profile.activated / work.member_tool_scope_updated /
  artifact.work_product_kind.added / identity.role.catalog_updated / identity.role.retired)
- 维护纪律 + 与 proto / bus-draft 的引用链锁定

---

## 四、Proposed 状态 ADR 的转正条件

段 2 有两份 ADR 保持 Proposed 状态。转 Accepted 的前置:

### ADR-0010 · Template 刚度分层(Proposed)

**转正前置**:
1. Aris 本人确认方向(方法论层面的判断,不只是技术)
2. **ADR-0012 · ActivityDeviation** 起草至可实施水平
   - 已有讨论笔记:`architecture/adr/drafts/0012-deviation-discussion-notes.md`(615 行,Q1~Q8 推演)
   - 待段 3 process 仓实施到"需要 GUIDED 模式支持"时触发
3. 至少跑通 3 个 GUIDED Template(如 agile-scrum / iterative-standard / evolutionary-discovery),验证刚度分级的实际适用性

### ADR-0011 · 流程嵌套机制(Proposed)

**转正前置**:
1. Aris 本人确认方向
2. 实施 CallActivity 子 Instance 场景至少 2 个(内部代码评审流程 + 跨项目复用流程)
3. Checkpoint 深度优先恢复的压力测试通过

---

## 五、段 3 推荐入口

### 5.1 推荐顺序

段 3 不建议从头写代码,应该**挑一个域先跑通端到端**,其他域参考复制。

**推荐顺序**:

```
1. identity 仓(首选)
   理由:最独立、ADR-0003/0004/0005/0006 最完整、依赖少
   目标:跑通"招聘 Member → 分配到项目 → retired"端到端
   代码量估计:~5000 行 Rust(含测试)
   时间估计:3-4 周

2. bus 仓(第二)
   理由:所有域都要用,先跑通 in-memory 后端,够 dev 环境使用
   依赖:identity 有实际事件产出
   代码量估计:~3000 行 Rust
   时间估计:2 周

3. conversation 仓(第三)
   理由:UI 层首先需要的域,Chat / Console 的数据源
   依赖:identity 的 Member + bus 的事件传播
   代码量估计:~4000 行 Rust
   时间估计:2-3 周

4. work 仓(第四)
   理由:业务核心,Project / WorkItem / Iteration 齐全
   依赖:identity + conversation + bus
   代码量估计:~6000 行 Rust
   时间估计:4 周

5. process + governance + artifact + method-library(并行)
   前置:上面四仓已 alpha
   时间估计:8-10 周
```

### 5.2 不推荐的起点

- ❌ 先搞 bus 仓 —— bus 独立跑不通,要和某个域联动才能验证
- ❌ 先搞 method-library —— 上层没消费者,验证不了 ViewProfile / Plugin
- ❌ 先搞 governance —— 依赖所有其他域,反向依赖图底层
- ❌ 一次搞多个域 —— 契约随时在动,多域并行会大量返工

### 5.3 段 3 开发者的入口文档

当段 3 开发者(或未来的 Claude 实例)开工时,按以下顺序读:

```
1. product/最终目的.md            —— 产品叙事(30 分钟)
2. product/六域模型.md             —— 六域架构(1 小时)
3. product/产品矩阵.md             —— 10 产品定位(30 分钟)
4. architecture/架构设计.md        —— 架构决策理论(1 小时)
5. architecture/仓库拆分方案.md    —— 26 仓定位
6. architecture/标准对齐全景图.md  —— 14 标准对齐
7. architecture/adr/0001 ~ 0011   —— 11 份 ADR(按顺序)
8. domain/identity/README.md       —— 第一个要实施的域(详细)
9. architecture/bus-draft/event-catalog.md —— 事件契约主表
10. architecture/repo-readmes-draft/L1-identity/README.md —— 仓库初始化模板
```

预计阅读时间:**8-12 小时**,熟练后 3-4 小时。

---

## 六、段 3 待办清单

### 6.1 ADR 起草清单(段 3 实施阶段触发)

| ADR | 触发条件 | 输入 |
|---|---|---|
| **ADR-0012 · ActivityDeviation** | process 仓实施 GUIDED 模式需求 | `architecture/adr/drafts/0012-deviation-discussion-notes.md`(615 行,Q1~Q8 推演完整) |
| **ADR-0013 · Outbox 部署形态** | bus 仓初始化完成,第一个 L1 域接入 | `architecture/bus-draft/README.md` §5.3 三候选 + Q1 倾向 A |
| **ADR-0014 · 表达式 DSL 选型** | ViewProfile 派生字段 / EventFilter / Policy rules 遇到第一个实际表达式需求 | ADR-0009 Q1 + bus-draft Q5 + governance Q2 三处需求汇总 |
| 域 Q 独立决策 | 各域实施阶段 | 各域 README §十 开放问题(Q1~Q7)|

### 6.2 未深化的域(段 3 中后期)

以下域段 2 未深化,依赖实施中形成的真实需求:

- **capability-hub**(L3)—— MCP / A2A 工具调用承载,等 L2 runtime 有实际需求触发
- **observability**(L4)—— 审计核心,三红线第 1 条技术载体,等多域实施后统一设计
- **archive**(L4)—— 合规归档,等 work.project.dissolved / baseline 场景实施后触发
- **sandbox**(L4)—— 代码执行隔离,等 L2 runtime 第一次跑用户代码前触发
- UI 层(L5)—— chat / console / runner / website,等 L1 域实施完成后触发

### 6.3 未收敛的问题(留给未来讨论)

来自本轮讨论中未落地的观察:

- **事务流 / 轻量流承载**(讨论"只有大 Template 够不够")—— 等段 3 发现实际需求
- **软依赖 vs 硬依赖**(WorkItem DAG 的复杂场景)—— 等段 3 WorkItem 实施遇到
- **Kanban 模式的执行语义**(无 Sprint 边界)—— 等 process 仓实施到 kanban 家族
- **外部 API 集成"类流程"**(capability-hub 边界)—— 等 capability-hub 域启动

---

## 七、本段遵循的架构原则(自审)

### 7.1 三红线全程对齐

- ✅ **可审计性**:每份 ADR 含 "Audit trail";事件契约含 severity + 保留期;fingerprint drift 检测机制
- ✅ **可追溯性**:trace_id / root_trace_id / parent_trace_id 贯穿跨域;ADR 互相引用链
- ✅ **可裁剪性**:method-library 的 MethodPlugin + Variability + ProfileGroup + ADR-0010 刚度,多层裁剪

### 7.2 14 份标准对齐

BPMN 2.0 / SPEM 2.0 / ISO 12207 / 15288 / 24748-2 / 29110 / 9001 / 42001 / 25010 / CMMI / SPICE / 330xx / Scrum / Kanban —— **全部在 architecture/标准对齐全景图.md 有落点**。

### 7.3 Research 结论对齐

LangGraph / Temporal / Anthropic Workflow / MCP / A2A / AG-UI / 14 种失败模式 / 记忆三层 / 自主性 5 级等 —— **全部在对应 ADR 或域 README 有对齐章节**。

### 7.4 六域平权

- ✅ 身份 / 对话 / 工作 / 过程 / 治理 / 制品 六域平权,无主从关系
- ✅ method-library 作为横切方法能力层(L3),不破坏六域平权
- ✅ L1 六域不做 Role 过滤(ADR-0009),视图策略归 method-library

---

## 八、段 2 期间重要的"否决"决策

**同样重要的是:段 2 期间**明确**否决了以下方向**,留作历史记录避免段 3 重犯:

1. **否决:Activity 和 WorkItem 强同步**
   - 理由:两套独立标准,强同步破坏 BPMN / Scrum 各自语义
   - 替代:ADR-0008 两轨独立 + completion_policy 配置化

2. **否决:L1 域按 Role 过滤字段**
   - 理由:破坏六域平权,L1 耦合 identity 的 Role 概念
   - 替代:ADR-0009 ViewProfile 归 method-library

3. **否决:新增 stage-exit Gate kind**
   - 理由:kind 膨胀无收益
   - 替代:复用 quality-gate / design-choice / release-confirm

4. **否决:Template 一种严格度通吃**
   - 理由:合规场景和日常协作场景截然不同,不能一刀切
   - 替代:ADR-0010 刚度三级

5. **否决:现在起草 ADR-0012 Deviation**
   - 理由:缺乏实际场景验证,过早锁定细节会导致段 3 返工
   - 替代:存档 drafts/0012 讨论笔记,段 3 触发时起草

6. **否决:现在穷举 6 种 DeviationType / 状态机 / Gate 冲突规则**
   - 理由:Q1~Q8 推演过度超前,用户实质参与只有 2 次
   - 反思:设计颗粒度要和当前决策颗粒度匹配,不要因为"顺手"而深化

---

## 九、段 2 期间的反思

### 9.1 正面经验

- **分批提交 + 每批 commit 信息详细**:6 次提交,每次 message 清晰,历史可追
- **过程中引入"分段落盘 tmp 再拼接"**:大文档(> 200 行)分段写,降低失败概率
- **ADR 互相引用 + 不变量编号**:形成设计决策网,不是孤立文档
- **讨论笔记归 drafts/**:保留思考过程,不污染正式 ADR

### 9.2 需要警惕的(段 3 避免)

- **过度设计倾向**:遇到问题就想"一次把细节定完",但段 X 不等于段 X+1
  - 例:本轮后半段 Q1~Q8 Deviation 推演被用户喊停
- **推演颗粒度 > 决策颗粒度**:自己推得热,用户实质参与降到 2/8
- **因为"顺手"而加码**:已经写了 A,B 看起来顺手就加,但 B 可能过早
- **回复长度失控**:多次触发 token 上限截断,要主动控长

### 9.3 段 3 的纪律建议

- **每次决策前确认颗粒度**:是"方向锁定"还是"细节穷举"?两者策略不同
- **长回复先落盘 /tmp**:主对话只发结论摘要
- **实际场景驱动 ADR**:不要先写 ADR 再找场景
- **定期回头看用户参与度**:连续"同意"3 次以上,主动停下来重新对齐

---

## 十、下一步(给 Aris 或未来 Claude 实例)

### 当你接手段 3 时

1. 读本文件(`SEGMENT-2-COMPLETE.md`)—— 2 小时
2. 按 §5.3 的顺序读入口文档 —— 8-12 小时
3. 按 §5.1 挑 **identity 仓**起步
4. 按 `architecture/repo-readmes-draft/L1-identity/README.md` 初始化仓库
5. 不要立刻起 ADR-0012 / 0013 / 0014,让实施驱动

### 记忆引用

本段产出已登记到:
- `~/.claude/projects/-home-aris-Projects-quantalithos-design/memory/project_status.md`
- `~/.claude/projects/-home-aris-Projects-quantalithos-design/memory/feedback_*.md`(规范红线)

### 关键文件清单

核心决策:
- `architecture/adr/0008-activity-completion-policy.md`
- `architecture/adr/0009-viewprofile-in-method-library.md`
- `architecture/adr/0010-template-rigidity-levels.md`(Proposed)
- `architecture/adr/0011-process-nesting.md`(Proposed)
- `architecture/adr/drafts/0012-deviation-discussion-notes.md`

核心契约:
- `architecture/bus-draft/event-catalog.md`

域设计全集:
- `domain/{identity,conversation,work,process,governance,artifact,method-library}/README.md`

---

> **本段收口**:2026-05-10
>
> **累计工作量**:6 次提交 · 5,500+ 行新增 · 11 份 ADR · 7 份域设计 · 1 份事件契约主表
>
> **状态**:Ready for Phase 3
