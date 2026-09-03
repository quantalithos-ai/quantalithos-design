# Step 5. 限界上下文与子域划分

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `bounded_context_subdomains` | pass | 4 个核心子域、1 个支撑子域和 4 类本地影子结构已逐项停审;跨上下文无职责重叠、truth 反转或统一语言冲突 | 进入 Step 6 容器 / 部署架构 | `01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;正式 00 C-MI-1~5 |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 3~4、架构 SOP Step 5 与书写规范 §4.6。
- [x] 从 C-MI-1~5 和职责边界推导语义上下文候选。
- [x] 区分核心子域、支撑子域和本地索引 / 投影 / 引用。
- [x] 为每个上下文收敛职责、非职责、统一语言和本地影子边界。
- [x] 每个上下文完成后立即执行单上下文停审。
- [x] 形成内部上下文关系图及 2~5 条说明。
- [x] 后置比较 draft 九组件、单一大上下文和逐对象上下文方案。
- [x] 执行职责重叠、核心误归类、影子 truth 化、术语冲突和 pending 审计。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 3 职责边界 | 镜像定义 / 装配、候选、资格、供给与外部 owner 红线 |
| Step 4 系统上下文 | 正式输入、输出、协作对象和依赖失效上限 |
| 正式 00 C-MI-1~5 | 内部语义主链和进入 / 退出条件 |
| 正式 00 四类数据口径 | 真相、快照、引用与禁止正文的分类依据 |
| L1-governance 架构粒度 | 核心 / 支撑 / 本地影子三层表达参考;不继承其业务对象 |
| MI-UP / Q register | 未闭口 seam 对本地影子和核心退出条件的限制 |

## 3. SOP 问题回答

1. 本仓内部有哪些子域或本地上下文?

   回答:四个核心子域分别是“镜像定义与装配基线”“构建意图与候选形成”“Provenance 与资格”“供给与实例化入口”;一个支撑子域是“外部引用与派生维护”;另有 mapping 来源、component / seed、执行 / evidence、Artifact / consumer 四类本地影子结构。

2. 哪些是核心子域?

   回答:直接决定 C-MI-1~5 是否成立的前四个语义单元是核心。C-MI-1 与 C-MI-2 共享同一 revision 生命周期和完整性边界,合并为镜像定义与装配基线;C-MI-3、C-MI-4、C-MI-5 因 outcome、gate、availability 生命周期不同而分别保留。

3. 哪些是支撑子域?

   回答:外部引用与派生维护负责稳定承接 external refs / snapshots / safe conclusions、提供一致性解释和 gap / history 读取,但不独立生成 definition、candidate、eligibility 或 availability,因此是支撑子域。

4. 哪些只是本地索引 / 投影 / 引用?

   回答:Role mapping source view、component / seed ref catalog、external execution / evidence conclusion references、Artifact / consumer handoff references 都是外部 truth 的本地影子,只保存身份、版本、来源状态、ref 或安全摘要。

5. 上下文映射关系是什么?

   回答:核心链按“定义 / baseline -> intent / candidate -> provenance / eligibility -> availability / entry”单向推进;外部引用与派生维护支撑全部核心上下文,但不得反向创造核心事实;影子结构只向支撑子域和对应核心提供已验证来源。

6. 为什么不能混成一个上下文?

   回答:装配 revision、build attempt、eligibility evaluation 和 availability transition 的成立条件、失败上限与外部 owner 都不同。混成一个上下文会让 builder success 自动发布、Artifact gap 反写资格、consumer failure 反写 availability,并使回滚无法定位责任阶段。

7. 每个上下文是否已停审,跨上下文是否存在冲突?

   回答:5 个正式上下文和 4 类影子结构均已独立检查分类、职责、非职责、统一语言与系统边界;跨上下文审计未发现 unresolved 冲突,所有 exact seam 缺口仍由原 MI-UP / Q 承载。

## 4. 当前材料问题诊断

| 候选划分 | 问题 | 当前处理 |
|---|---|---|
| Definition Catalog / Manifest Assembly / Build Orchestrator 等九组件 | 混合领域、application、adapter 和 persistence 粒度 | 不继承组件名;重新推导 5 个语义上下文 |
| 每个 F-MI 功能一个上下文 | 退化为功能清单,生命周期过碎 | 按共同 truth / invariant 聚合 |
| 全部镜像生命周期一个核心上下文 | candidate、eligibility、availability 失败边界会互相污染 | 拆为 4 个核心子域 |
| Registry catalog 作为核心子域 | 外部 backend projection 被误写为 supply truth | Registry 只进入执行 / ref 影子层 |
| Artifact formalization 作为核心子域 | 形成 Artifact 第二 owner | 仅作为 handoff reference / gap |
| Consumer confirmation 作为 supply 状态 | 下游 observed truth 反写本仓 | 只保留 handoff / consumer-gap 引用 |

## 5. 改动前后对比

| 维度 | 候选 / 旧思路 | 当前划分 |
|---|---|---|
| 主轴 | 九个实现组件或流水线步骤 | 四个领域核心 + 一个支撑上下文 |
| Definition / assembly | 分开后可能失去 revision 完整性 | 合并在同一装配基线语境 |
| Build / eligibility / supply | success 后连续自动推进 | 三个独立成立、fail-closed 的核心边界 |
| 外部数据 | 复制为内部对象 | 单列本地索引 / 投影 / 引用层 |
| 维护 / trace | 散落在各组件 | 支撑子域提供派生读取,不反写真相 |
| 模块含义 | 近似代码与部署单元 | 仅表达统一语言和语义责任 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 单一 `Member Image Lifecycle` 上下文 | 简单 | 各阶段 owner / failure / consistency 无法隔离 | 不采用 |
| 九个实现导向上下文 | 细致 | 过早锁定 application / adapter / persistence 结构 | 不采用 |
| 四核心 + 一支撑 + 本地影子层 | 兼顾领域主线和 owner 隔离 | 后续概要仍需展开代码主体 | 采用 |
| 将 definition 与 assembly 分成两个核心 | 来源边界更显眼 | 二者共享 variant revision 和完整性不变量,拆分会产生跨上下文半成品 | 不采用 |
| 将 Artifact handoff 并入资格核心 | 流程短 | Artifact gap 会污染 image eligibility | 不采用 |

## 7. 结构化中间产物

### 7.1 架构单元 / 子域划分

| ID / 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| `BC-MI-01` 镜像定义与装配基线 | 核心子域 | 承载 image family / variant / persona assembly identity、完整 pinned baseline 和 derivation / revision 语义。 | 是核心链入口;消费 mapping / component / seed 影子,向 BC-MI-02 提供完整 revision。 |
| `BC-MI-02` 构建意图与候选形成 | 核心子域 | 承载受控 intent、attempt、immutable input snapshot、外部执行 outcome 与 candidate formation 语义。 | 只消费完整 revision,向 BC-MI-03 提供可验证 candidate;不因 handoff success 自动成立。 |
| `BC-MI-03` Provenance 与资格 | 核心子域 | 承载 digest / provenance binding、applicable gate evaluation 和 image eligibility 语义。 | 消费 candidate 与安全结论,向 BC-MI-04 提供独立资格;不拥有 Artifact truth。 |
| `BC-MI-04` 供给与实例化入口 | 核心子域 | 承载 availability、publish / replace / rollback / retire history 和 pinned entry 语义。 | 只消费合格候选,向下游提供入口或 gap;不拥有 container / consumer truth。 |
| `BC-MI-05` 外部引用与派生维护 | 支撑子域 | 承载外部 ref / snapshot / safe conclusion 的稳定消费、gap 解释和跨核心历史读取语义。 | 支撑 BC-MI-01~04,只能派生解释或维护材料,不得创建核心 positive truth。 |
| `LS-MI-01` Mapping 来源视图 | 本地索引 / 投影 / 引用 | 为定义校准提供 Role mapping source identity、版本与验证状态。 | 依附 BC-MI-05 并服务 BC-MI-01;不拥有 Role / mapping body。 |
| `LS-MI-02` Component / seed 引用目录 | 本地索引 / 投影 / 引用 | 为装配完整性提供 component、extras、base、template ref 和 safe summary。 | 依附 BC-MI-05 并服务 BC-MI-01 / 02;不拥有外部 release / template body。 |
| `LS-MI-03` 执行 / registry / evidence 结论引用 | 本地索引 / 投影 / 引用 | 为 candidate 和 eligibility 提供 adapter outcome、immutable ref、evidence ref / safe conclusion。 | 依附 BC-MI-05 并服务 BC-MI-02 / 03;不拥有 backend job / report body。 |
| `LS-MI-04` Artifact / consumer 交接引用 | 本地索引 / 投影 / 引用 | 为资格、供给和恢复解释提供 Artifact ref / gap、handoff 与 consumer gap。 | 依附 BC-MI-05 并服务 BC-MI-03 / 04;不拥有 Artifact / container / observed truth。 |

### 7.2 上下文关系图

图类型:内部限界上下文关系图

图标题:L2-member-images 核心、支撑与本地影子层

```text
+----------------------------+     +----------------------------+
| BC-MI-01                   | --> | BC-MI-02                   |
| 镜像定义与装配基线          |     | 构建意图与候选形成          |
+----------------------------+     +-------------+--------------+
                                                    |
                                                    v
+----------------------------+     +-------------+--------------+
| BC-MI-04                   | <-- | BC-MI-03                   |
| 供给与实例化入口            |     | Provenance 与资格           |
+-------------+--------------+     +----------------------------+
              |
              v
+-------------+------------------------------------------------+
| BC-MI-05 外部引用与派生维护                                |
+-------------+------------------------------------------------+
              |
              v
+--------------------------------------------------------------+
| 本地索引 / 投影 / 引用层                                    |
| Mapping 来源 | Component / seed | 执行 / evidence | handoff   |
+--------------------------------------------------------------+
```

说明:

- 四个核心子域按能力成立前置连接,箭头不表示接口调用或执行时序。
- BC-MI-05 服务全部核心子域;图中向下箭头表示主要依附层级,不表示核心 truth 可由影子层反写。
- 本地影子结构只保存 ref、snapshot、safe conclusion 或 gap,不拥有外部正文和生命周期。
- 图中节点是语义上下文,不是服务、crate、数据库、worker 或部署单元。

### 7.3 逐上下文职责 / 非职责 / 统一语言

| 上下文 | 正式职责 | 明确非职责 | 统一语言核心 |
|---|---|---|---|
| BC-MI-01 | 定义、source binding、assembly baseline、revision / derivation | Role / mapping body、component release body、live state | image family;variant;persona assembly;assembly baseline;variant revision;derivation |
| BC-MI-02 | build intent、attempt、input snapshot、outcome 分层、candidate binding | scheduler / builder / registry job truth | build intent;build attempt;input snapshot;candidate;failed;blocked;unknown |
| BC-MI-03 | provenance binding、applicable gate、image eligibility | policy / approval、evidence body、Artifact version / lineage | candidate digest;provenance binding;applicable gate;image eligibility |
| BC-MI-04 | availability transition、pinned entry、local handoff / gap | registry truth、container lifecycle、consumer confirmation | supply availability;publish;replace;rollback;retire;instantiable entry;consumer gap |
| BC-MI-05 | ref / snapshot / conclusion intake、derived trace、gap / maintenance explanation | 任何核心 positive state 或外部 body | source ref;safe snapshot;safe conclusion;contract gap;derived trace |

### 7.4 单上下文停审记录

| 单元 | 分类正确 | 职责 / 非职责清楚 | 与 Step 4 一致 | 无实现化 | gate_status |
|---|---|---|---|---|---|
| BC-MI-01 | pass | pass | pass | pass | pass |
| BC-MI-02 | pass | pass | pass | pass | pass |
| BC-MI-03 | pass | pass | pass | pass | pass |
| BC-MI-04 | pass | pass | pass | pass | pass |
| BC-MI-05 | pass | pass | pass | pass | pass |
| LS-MI-01 | pass | pass | pass | pass | pass |
| LS-MI-02 | pass | pass | pass | pass | pass |
| LS-MI-03 | pass | pass | pass | pass | pass |
| LS-MI-04 | pass | pass | pass | pass | pass |

### 7.5 跨上下文语义边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 职责重叠 | pass | Revision、attempt、eligibility、availability 各有唯一核心 owner。 |
| 核心误归类 | pass | BC-MI-01~04 均直接决定 C-MI-1~5;BC-MI-05 不产生核心 positive truth。 |
| 影子 truth 化 | pass | LS-MI-01~04 均明确 body / lifecycle 禁止项。 |
| 统一语言冲突 | pass | Candidate、eligibility、availability、Artifact gap、consumer gap 不互作同义词。 |
| Static / live 混写 | pass | 无 live state 进入任何上下文。 |
| Pending 丢失 | pass | MI-UP / Q 继续限制影子来源和核心退出条件。 |
| 实现结构泄漏 | pass | 未定义服务、进程、存储、目录、接口或字段。 |

## 8. 回填草稿

正式 01 §6 回填 §7.1 划分表、§7.2 关系图、§7.3 统一语言摘要和 §7.5 边界审计结论。单上下文停审记录保留在本文件,正式章不把 BC / LS 编号推导为代码模块编号。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- BC-MI-01~05 是当前架构语义单元,不是未来概要设计必须一一映射的代码包或进程。
- MI-UP-001~007 使相应 LS 来源 / positive exit 保持 pending,不改变上下文分类。
- Conditional / future 能力正式启用时应重开 BC-MI-01 / 04 和影子层范围审计。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 核心 / 支撑 / 本地影子三类是否完整且无悬空节点 | pass |
| 每个上下文是否完成职责、非职责、语言和停审 | pass |
| 跨上下文是否无 owner、影子 truth 或术语冲突 | pass |
| 关系图是否只表达内部语义层次 | pass |
| 是否未预设代码 / 容器 / 数据 / 协议实现 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 6,不得跳到 Step 7 或修改正式 01。
