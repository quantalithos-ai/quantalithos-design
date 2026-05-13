# architecture/legacy/ — Phase 1 架构文档归档

> 本目录存放 Quantalithos Phase 1 阶段的架构文档。这些文档已被 A 方案(六域 × 26 仓 × 7 层)替代,**不作为任何新设计的权威引用**。  
>
> 保留的目的:
> - 追溯 A 方案的推演来源(理解"为什么这样做"需要看旧方案的问题)
> - 供团队新成员对照,避免引用到过时文档
> - 作为 Phase 1 的历史快照,未来可能需要复盘

---

## 目录里有什么

### 已被 A 方案直接替代(核心架构)

| 旧文档 | A 方案承接 | 失效原因 |
|---|---|---|
| `仓库拆分方案-phase1.md` | `architecture/仓库拆分方案.md` | 8 子项目 / 15 仓 → 26 仓 × 7 层 |
| `开发路线图与优先级-phase1.md` | `architecture/开发路线图与优先级.md` | Phase 1-4 分期 → N0-N9 节点 |

### 已被 A 方案吸收(核心思路保留,对象体系重构)

| 旧文档 | A 方案承接 | 吸收方式 |
|---|---|---|
| `Agent统一模型与三级控制设计.md` | 过程域 ProcessProfile + 治理域 Gate 5 级自主性 | 三级控制概念升级为 5 级 |
| `AI中的确认式执行与人工门禁.md` | 治理域 Gate 六段式 + Runtime Tool Invoker policy check | 门禁升级为一等对象 |
| `单runtime单agent落地设计.md` | L2 Member 运行层 5 仓 | "flow 作 supervisor" 被 Member 容器化 + member-service 编排取代 |
| `phase2-grpc升级方案.md` | 直接跳过(见 ADR 决策 Q1) | Phase 2 gRPC 阶段不存在,直达 Phase 2B |
| `agent部署拓扑与群组协作讨论.md` | L2 Member 运行层 + 对话域 | D1 决策已演进到容器化 |
| `设计优化方案.md` | `product/最终目的.md` §3.2 | "模板→瞬间实例化"被"员工是持久实体"替代 |
| `项目配置驱动架构.md` | L3 method-library 仓承载 Role 定义 | 不再"配置驱动+按需拉取",改 SPEM Method Content |
| `AI开发团队-外出远程开发工作台架构.md` | L5 chat + sync + runner 三仓协作 | "外出远程开发"场景被一般化 |

### 错位归档(本来不是架构文档,但历史上放在 architecture/)

| 文档 | 实际归属 |
|---|---|
| `高级开发者UI设计开发方案.md` | 方法论讨论(UI 产线如何用 AI),属于生产力问题,不是架构决策 |

---

## 阅读建议

- **如果想理解 A 方案是怎么来的**:先看 `discussions/2026-05-07-标准与建模.md`(9 轮推演),然后回看本目录里被引用的旧方案
- **如果想迁移某个设计到 A 方案**:每份旧文档顶部都有 banner 指向 A 方案的对应位置
- **如果你在写新设计**:**不要引用**本目录任何文档作为权威。如果新设计确实需要引用旧概念,应在新文档里明确"承自 legacy/xxx.md,升级方式如下"

---

## 权威文档的位置

所有 A 方案权威文档在以下位置:

- `product/最终目的.md` — 产品叙事
- `product/六域模型.md`(待写)— 领域模型
- `product/产品矩阵.md`(待写)— 10 产品
- `architecture/架构设计.md` — 架构设计方法论基础(任何设计前必读)
- `architecture/仓库拆分方案.md` — 26 仓 × 7 层
- `architecture/开发路线图与优先级.md` — 节点交付顺序
- `architecture/member-容器化架构.md` — L2 Member 运行层的推演来源(定位已调整)
- `architecture/ai-member设计.md`(待写)— L2 五仓详细设计
- `architecture/adr/` — 架构决策记录(ADR-0003 起为 A 方案 ADR)

---

**本目录不再更新**。任何对这些文件的修改都应反映到 A 方案的对应文档里。
