# Quantalithos AI

> AI 驱动的软件研发协作平台 — 所有员工都是 AI Agent,用户以管理者身份通过群聊委派任务,由 AI 团队在可观察的协作过程中自主完成软件项目。

这个仓库是 **Quantalithos AI 的文档总仓**。代码将分散在 26 个子项目仓库中,本仓库只承载设计、方法论、规范、调研与讨论。

---

## 顶层目录速览

```
product/            产品定义 — WHY / WHAT(愿景、最终目的、产品矩阵、六域模型)
methodology/        方法论 — 过程标准的学习与吸收(含 11 份国际标准讨论)
architecture/       架构 — 系统分解、Member 容器化、ADR
stages/             六阶段详细设计(阶段 0 ~ 阶段 5)
standards/          规范 — 必须遵守的(文档规范 / 编码规范 / 流程图规范)
flow/               流程引擎专题
research/           调研 — Agent 模式、框架、协议、竞品、专题
references/         外部参考原文 — ISO/IEEE 标准 PDF + BPMN/SPEM 元模型源文件
implementation/     实施与交付(环境搭建、测试策略、故障排查等)
review/             代码审查(总则 + 分阶段报告)
acceptance/         验收标准与结果
discussions/        对话与讨论记录(按日期归档)
```

---

## 阅读路径

**第一次来 — 想理解这个产品是什么**
1. `product/vision.md` — 愿景
2. `product/基础想法.md` — 最初的产品构想
3. `product/overview.md` — 整体概览
4. `architecture/member-容器化架构.md` — 当前权威架构

**想理解我们参考的过程标准与方法论**
1. `methodology/开发流程标准综述.md` — 全景对比(四层模型)
2. `methodology/standards-discussion/` — 11 份"讨论与对象抽象"
3. `discussions/2026-05-07-标准与建模.md` — 标准 → 领域模型 → 仓库拆分 → 产品矩阵的完整推演

**想看具体阶段怎么跑**
1. `stages/` — 阶段 0 到阶段 5 的详细设计
2. `methodology/流程全景图.md` — 六阶段全景
3. `methodology/端到端流程说明.md` — 一次项目走完的具体时间线

**写设计 / 写代码前必读**
1. `standards/document/设计文档编写通则.md`
2. `standards/coding/` — 编程语言规范
3. `standards/diagram/` — 流程图规范

---

## 分支约定

```
archive/phase-1     Phase 1 的完整历史(含代码 + 旧 docs)快照,永久保留
main                (已不再维护)旧主干,保留用作对照
dev                 当前主分支 — 仅包含重构后的文档
```

## 目录命名约定

- 一级目录:英文小写短名
- 二级及以下目录:英文或中文均可
- 文件名:允许中英混合,与内容主题对齐

## 引用外部标准

`references/pdfs/` 下含 51 份 ISO / IEEE / OMG 标准 PDF 原文(约 800 MB)。若仓库体积影响克隆,后续考虑启用 git-lfs。在此之前,建议按需浅克隆或单独管理。

---

## 与旧仓库结构的映射

```
docs/OVERVIEW.md                            → product/overview.md
docs/vision.md                              → product/vision.md
docs/architecture/*                         → architecture/*  (+ 部分 design/* 汇入)
docs/design/阶段*.md                         → stages/*
docs/design/*讨论与对象抽象.md                → methodology/standards-discussion/*
docs/design/*编码规范.md                     → standards/coding/*
docs/design/*书写规范.md                     → standards/document/*
docs/design/流程图标准-*.md                  → standards/diagram/*
docs/design/*.pdf / *.cmof / *.xsd           → references/pdfs/ 或 references/specs/
docs/research/*                              → research/*(按子类分目录)
docs/dev/*                                   → implementation/*
docs/review/*                                → review/*
docs/acceptance/*                            → acceptance/*
```

完整映射参见 `discussions/2026-05-07-标准与建模.md`。
