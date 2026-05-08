# references — 外部参考原文

> **目录定位**:Quantalithos 引用的**国际标准原文 PDF + 元模型源文件**。本目录**不包含 Quantalithos 自产内容**,只存外部权威资料。

---

## 一、目录构成

```
pdfs/      51 份 ISO / IEEE / OMG 标准 PDF 原文(约 800 MB)
specs/     BPMN / SPEM / DMN 等元模型源文件(cmof / xsd / xsl)
```

---

## 二、pdfs/ 里的标准清单

按领域分类(51 份,部分有多版本):

### 过程标准
- BPMN 2.0 Specification
- SPEM 2.0 Specification
- IEEE 12207(2017, 2026)
- IEEE 15288(2023)
- IEEE 15289(2019)文档化信息
- ISO/IEC 29110 多 Part
- ISO/IEC 24765(2017)术语词汇
- ISO/IEC/IEEE 24748-2(2012, 2024)本轮新增

### 评估标准
- CMMI V3 Development View
- ISO/IEC 15504 Part 2-5
- ISO/IEC 330xx 系列(33001-33020)

### 质量管理
- ISO 9001(2000)

### 执行方法
- Scrum Guide 2020
- Kanban Guide

### 需求 / 架构 / 测试
- ISO/IEC/IEEE 29148(2018-2011 redline)需求工程
- ISO/IEC/IEEE 42010(2022-2011 redline)架构描述
- ISO/IEC/IEEE 29119 软件测试

### AI / 质量专项(待补)
- ⚠ ISO/IEC 42001:2023(待购入)
- ⚠ ISO/IEC 25010:2023(待购入)
- ⚠ ISO/IEC 23894 AI 风险(待购入)

---

## 三、specs/ 里的元模型

```
BPMN20.cmof       BPMN 2.0 元模型源文件
BPMNDI.cmof       BPMN Diagram Interchange
DI.cmof           OMG Diagram Interchange
...
```

这些文件是 XML 序列化的 MOF 模型,BPMN 引擎实现时直接引用。

---

## 四、使用纪律

- **不得修改** 本目录的任何文件(外部权威原件)
- 引用原文时**标注准确页码 / 章节**
- 本目录不使用 git-lfs(目前,若体积影响克隆可考虑启用)
- 如需新增标准 PDF,直接 copy 进 `pdfs/`,同步到 `feedback_research_principles.md` 的"必须遵循的标准"清单

---

## 五、与 methodology/ 的关系

```
references/pdfs/<std>.pdf        (外部原文,不动)
          │
          │ 学习 + 提炼
          ▼
methodology/standards-discussion/<std>.md  (Quantalithos 视角的讨论与对象抽象)
          │
          │ 对齐 Quantalithos 设计
          ▼
architecture/标准对齐全景图.md   (映射到 26 仓 + 整体架构)
```

查任何一份讨论文档(methodology/standards-discussion/*.md)末尾,都有对应 PDF 在本目录的路径。

---

## 六、体积管理

当前 51 份 PDF 总计约 800 MB。若克隆速度受影响:
- 方案 A:启用 git-lfs(首选)
- 方案 B:把 `references/` 拆成独立仓,通过 submodule 引用

这两种方案都需要走 ADR。
