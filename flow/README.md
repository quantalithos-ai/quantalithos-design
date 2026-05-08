# flow — 流程引擎专题

> **目录定位**:流程引擎的**独立专题讨论**。讨论在哪些层面建模流程、动态编排、运行时控制。

---

## ⚠️ 状态说明

本目录文档产出于 Phase 1,当时把"流程引擎"当作核心组件独立展开讨论。

**A 方案下,流程引擎的职责已经落到**具体仓库:
- 过程建模 → `quantalithos-process` 仓的 ProcessTemplate / ProcessInstance
- 方法内容 → `quantalithos-method-library`(SPEM)
- 编排执行 → `quantalithos-process` 内的 BPMN 引擎
- 动态分发 → `quantalithos-bus` + 事件驱动

本目录作为**设计思考的历史源**保留,不是权威文档。

---

## 一、目录构成

```
流程模型与动态编排抽象.md    流程模型抽象 + 动态编排讨论(Phase 1 产物)
```

---

## 二、A 方案下的使用方式

- **设计 ProcessTemplate 的抽象结构时**:本目录的"流程模型抽象"有历史参考价值
- **BPMN 引擎选型时**:本目录讨论过的"动态编排 vs 静态编排"考虑仍然有效
- **新功能的流程建模**:参考本目录,但以 `product/六域模型.md` §六 过程域为准

---

## 三、与 A 方案的映射

| 本目录概念 | A 方案对应 |
|---|---|
| 流程模型抽象 | 过程域 ProcessTemplate(SPEM Method Content 承载) |
| 动态编排 | 过程域 ProcessInstance(BPMN 引擎运行)+ 事件驱动 |
| 执行上下文 | L2 Member 运行层的 runtime / checkpoint |
| 门禁节点 | 治理域 Gate(一等对象,六段式) |

---

## 四、未来规划

- 本目录可能会新增"BPMN 引擎选型 ADR"(归 `architecture/adr/`)
- 若内容被 `domain/process/` 的设计替代,考虑移入 architecture/legacy
