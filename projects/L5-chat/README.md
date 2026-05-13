# quantalithos-chat

> **仓使命**:协作入口 —— 桌面 / Web / Mobile 多端客户端。用户看到的 Quantalithos 的**脸**。  

---

## 仓定位

- **层**:L5 UI 层
- **技术栈**:TypeScript + React/Svelte(Web) + Tauri(桌面)+ React Native(Mobile,可选)
- **产品归属**:① Chat(`产品矩阵.md` §3.1)

---

## 主要对齐

- **25010 Interaction Capability 6 子特性**(核心)
- **AG-UI 17 事件**(实时推送)
- **BPMN 2.0 Collaboration**(群聊/频道抽象)
- **WCAG 2.2 AA**(Accessibility 基线)

---

## 核心交互模块

- 群聊视图(Conversation kind=group)
- 频道侧边栏(kind=channel)
- 私聊列表(kind=dm)
- 线程弹窗(kind=thread)
- GateCard(六段式交互审批)
- 员工登录(查看某 Member 当前状态)
- 项目进度栏
- Artifact 预览 + 引用

---

## 关键依赖

### 上游
- `@quantalithos/sdk-core`(TypeScript)
- `@quantalithos/sdk-events`(AG-UI 17 事件)
- 外部:React / Svelte / Tauri / Electron / React Native

### 下游
- Server 的 ConversationService / GovernanceService / WorkService 等(通过 sdk)

---

## 目录结构

```
quantalithos-chat/
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── web/                 Web / PWA
│   ├── desktop/             Tauri app
│   └── mobile/              (可选)
├── packages/
│   ├── chat-ui/             共享 UI 组件
│   ├── chat-state/          状态管理
│   ├── gate-card/           GateCard 六段渲染
│   └── artifact-preview/
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` CH 条目 + `子项目遵循规范清单.md` CH(UI 侧):
- 四形态 UI 完整
- Turn 五 kind 各自有明确渲染
- GateCard 六段式完整展示
- 员工登录实时 / 可进可出
- WCAG 2.2 AA
- AG-UI 17 事件实时推送
- 对话历史永久可查

---

## 详细设计参考

- `产品遵循规范清单.md` §一.① Chat
- `domain/conversation/README.md`
- `architecture/sdk-draft/` §14.1 Chat 集成范式

---

## 开放问题

- 多端同步策略(桌面 / Web / Mobile 共享对话状态)
- 离线模式
- 大群(500+ 参与者)性能优化
