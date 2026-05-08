# stages — 六阶段设计

> **目录定位**:Phase 1 遗留的**六阶段流程设计**文档。A 方案下定位已调整 —— 不再作为"路线图",仅作为**过程能力族的参考素材**。

---

## ⚠️ 状态说明

本目录文档产出于 Phase 1(2026-04 前后),当时的设计思路是:
- 项目按"固定六阶段"推进(阶段 0-5)
- 阶段边界硬性对齐 BPMN ProcessInstance 主心骨

**A 方案下,这套六阶段不再作为**路线图或阶段规划**的依据**,理由:

1. A 方案把"生命周期模型"升级为 **24748-2 的 8 种参考模型**(瀑布 / V / 增量 / 演进 / 迭代 / 螺旋 / Agile / DevOps),六阶段只是其中一种
2. A 方案的"产品能力"按**能力族(去阶段化)**组织(见 `product/最终目的.md` §六)
3. 项目级的阶段编排由 `ProcessTemplate → ProcessProfile → ProcessInstance` 三段式承载,不在仓库硬编码

---

## 一、目录构成

```
阶段0-项目启动.md                         立项 / 需求摸底 / 资源盘点
阶段0-1-2前置步骤补点映射.md              阶段 0-1-2 的衔接补点
阶段1-需求理解.md                         需求分析与澄清
阶段2-方案拆解与实施准备.md               设计 / 技术选型 / 任务分解
阶段3-迭代开发与测试.md                   开发 / 评审 / 测试流水线
阶段4-验收、发布准备与最终确认.md         UAT / 发布准备
阶段5-发布执行、发布后观察与回退控制.md   发布 / 监控 / 回滚
```

---

## 二、A 方案下的使用方式

**仅作为参考素材**,不是权威文档。具体场景:

- **设计 ProcessTemplate 时**:从本目录借鉴阶段命名和活动颗粒度
- **设计 Gate 时**:参考本目录的"进入下一阶段的 Gate 条件"
- **编写端到端协作场景时**:本目录的描述比 `product/最终目的.md` §五更详细

**不可作为权威的情况**:

- ❌ 路线图规划 → 用 `architecture/开发路线图与优先级.md`
- ❌ 项目能力族组织 → 用 `product/最终目的.md` §六
- ❌ 过程模板承载 → 未来 method-library 仓的 Template 定义

---

## 三、与 A 方案的映射

| 本目录阶段 | A 方案对应 |
|---|---|
| 阶段 0 项目启动 | 工作域 Project(draft → active)+ kickoff Gate |
| 阶段 1 需求理解 | 过程域 requirements-elicitation Activity |
| 阶段 2 方案拆解 | 过程域 design-and-planning Activity |
| 阶段 3 迭代开发 | 过程域 implementation Activities(可并行)+ Kanban Flow |
| 阶段 4 验收 | governance.Gate(acceptance-confirm)+ 制品域 Baseline |
| 阶段 5 发布 + 观察 + 回退 | governance.Gate(release-confirm)+ 观测横切 + 回退流程 |

---

## 四、未来规划

- 本目录**长期保留**作为历史设计源
- 不加 legacy/ banner,因为内容仍有价值
- 若将来某份阶段文档整体被 `domain/process/` 的 Template 定义替代,才考虑移入 legacy/

---

> **提示**:阅读本目录文档时,心里要把"阶段"翻译为"迭代/敏捷下的 Sprint 主题"或"过程模板里的 Stage"。不要把它们当作 A 方案的路线图或阶段规划。
