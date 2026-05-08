# quantalithos-console

> **仓使命**:组织治理中心 —— 企业管理者 / 合规官 / 方法论制定者的 Web 操作台。与 Chat 互补:Chat 是协作视角,Console 是治理视角。

---

## 仓定位

- **层**:L5 UI 层
- **技术栈**:TypeScript + React/Svelte SPA
- **产品归属**:⑤ Console(`产品矩阵.md` §4.1)

---

## 主要对齐

- **ISO 42001 §9.3**(管理评审 UI)
- **ISO 42001 SoA + Control + AIIA**(合规面板)
- **ISO 25010 Interaction Capability**(管理员效率)
- **DORA / EBM 指标**(仪表板)
- **CMMI / SPICE**(能力成熟度可视化,未来)

---

## 核心交互模块

- 员工管理(identity:招聘 / 编辑 / 暂停 / 退休)
- 项目监控(work:跨项目看板 + 指标)
- 方法库编辑(method-library:Role / Template / Policy)
- 治理面板(governance:Gate 总览 + SoA + Control + AIIA)
- 审计日志(observability:事件回放 + 哈希链验证)
- 指标看板(DORA / EBM / 自定义)
- 能力池管理(MCP Registry + Provider Contract)
- 权限 / RBAC 配置

---

## 关键依赖

### 上游
- `@quantalithos/sdk-core`(TypeScript)
- 外部:React 或 Svelte + 图表库(ECharts / D3)+ Tailwind

### 下游
- Server 全量 L1 + L3 + L4 API

---

## 目录结构

```
quantalithos-console/
├── package.json
├── src/
│   ├── pages/
│   │   ├── members/
│   │   ├── projects/
│   │   ├── method-library/
│   │   ├── governance/
│   │   ├── audit/
│   │   ├── metrics/
│   │   └── capability-hub/
│   ├── components/
│   └── state/
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` CS 条目 + `子项目遵循规范清单.md` CS:
- Management Review UI 完整
- SoA 编辑必须覆盖 38 控制项
- AIIA 面板含项目维度 + 审批状态 + 残余风险
- 审计事件可按时间窗口 / project / member / domain 过滤回放
- 哈希链完整性一键验证 + 生成报告
- 所有管理操作留痕(不允许静默修改)
- 权限模型显式(谁能看审计 / 谁能改 Role / 谁能发 Policy)

---

## 详细设计参考

- `产品遵循规范清单.md` §五.⑤ Console
- `domain/governance/README.md`
- `methodology/standards-discussion/ISO-42001.md` §9.3

---

## 开放问题

- 管理评审的自动化程度(governance §十 Q6)
- 多租户面板切换
- 导出 ISO 42001 审计包给第三方审计人

---

## 刻意不做

- 不做日常协作(那是 Chat)
- 不做代码编辑
- 不做项目立项(用户在 Chat dm 发起)
