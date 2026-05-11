# quantalithos-bridges

> **仓使命**:外部平台桥接 —— 让用户**不离开既有团队协作平台**(Mattermost / Telegram / Slack / Discord)就能使用 AI 员工。

---

## 仓定位

- **层**:L6 生态层
- **技术栈**:Python(主)+ TypeScript(Slack App)—— 按平台特性选
- **产品归属**:⑧ Bridges(`产品矩阵.md` §6.1)

---

## 主要对齐

- **ISO 42001 §A.10**(第三方治理)
- **ISO 25010 Compatibility Interoperability**
- **ISO 9001 供应商管理**(Mattermost / Slack 等视作外部平台)
- **AG-UI 17 事件 → 各平台原生事件**(双向翻译)

---

## 支持平台

- **Mattermost Plugin**(用户在 MM Channel 里 @ 员工)
- **Telegram Bot**(用户和员工的私聊 / 群组)
- **Slack App**(用户在 Slack Channel 里协作)
- **Discord Bot**(类似 Slack)

---

## 核心映射

```
[Quantalithos 内]         [外部平台]
  Conversation             Channel / Group / DM
  Turn                     Message
  Mention                  @user
  GateCard                 Rich message / Interactive button(简化版)
  Artifact 预览            Attachment / Link preview
  GlobalMember             Bot account / User
```

---

## 关键依赖

### 上游
- `@quantalithos/sdk-python`(主)+ `@quantalithos/sdk-typescript`(Slack)
- 外部:各平台 SDK(mattermost-api / python-telegram-bot / slack-sdk / discord.py)
- 映射配置(external_id ↔ GlobalMember)的持久化

### 下游(通过 sdk 调)
- Server 的 ConversationService(主)+ GovernanceService(Gate 渲染)+ IdentityService(external_id 映射)

---

## 目录结构

```
quantalithos-bridges/
├── pyproject.toml            (monorepo,pnpm-workspace 或 poetry workspaces)
├── bridges/
│   ├── mattermost/
│   │   ├── plugin/           MM plugin
│   │   └── bot/              Server-side bot
│   ├── telegram/
│   ├── slack/                TypeScript(部分)
│   └── discord/
├── common/
│   ├── mapping/              external_id ↔ GlobalMember
│   ├── bridged_turn/         Turn 双向翻译
│   └── gate_renderer/        简化 GateCard(外部平台展示)
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` BR 条目 + `子项目遵循规范清单.md` BR:
- **BR1** 权限边界:外部平台操作不得绕过 Policy 和 Gate
- **BR2** external_id → GlobalMember 映射由组织明确授权(不自动创建)
- **BR3** 敏感 Gate 不在外部平台渲染完整内容,提示"打开 Chat 审批"
- **BR4** Turn 的 author=bridged 必填 bridged_from 来源
- **BR5** 外部 Bot 账号的所有操作发事件进 observability(标记桥接来源)
- **BR6** 外部 API Key 加密存储,轮换机制完备

---

## 详细设计参考

- `产品遵循规范清单.md` §八.⑧ Bridges
- `domain/conversation/README.md` §6.3(桥接映射章节)
- `methodology/standards-discussion/ISO-42001.md` §A.10

---

## 开放问题

- Bridged conversation lifecycle 同步(`domain/conversation` §十 Q5)
- 各平台的速率限制与 Quantalithos 事件流协调
- 机器翻译(用户 @ 员工用外文时)

---

## 安全

- 外部 API Key 走 KMS,不落盘明文
- OAuth 接入(优先)+ API Key(fallback)
- 机密事件(release / impact-assessment Gate)不向外部平台完整推送
