# proto-draft — core 仓 proto + CloudEvents schema 草案

> **文档定位**:Quantalithos A 方案段 3 第一件产出 —— `quantalithos-core` 仓的 proto 与 CloudEvents schema **设计态草案**。  
>
> **最终归属**:本目录内容在段 3 末将迁移到 `quantalithos-core` 独立仓(26 仓之一)。当前放在 `design` 仓的 `architecture/proto-draft/` 下是设计期工件,便于跨 domain 统一审视。
>
> **上游依据**:
> - `domain/identity/README.md` §三(RPC 骨架)+ §四(事件 schema)
> - `domain/conversation/README.md` §三 + §四
> - `domain/work/README.md` §三 + §四
> - `domain/process/README.md` §三 + §四
> - `domain/governance/README.md` §三 + §四
> - `domain/artifact/README.md` §三 + §四
> - `architecture/ai-member设计.md` §三(Member Process 的 ExternalRPC)
> - ADR-0003 / 0004 / 0005 / 0006 / 0007
> - `architecture/标准对齐全景图.md` §一 L0 core 仓对齐
> - CloudEvents 1.0 Spec / W3C Trace Context
>
> **下游承接**:
> - `quantalithos-sdk` 仓(三语言 binding 从此处 proto 生成)
> - 6 个 L1 域仓(各自实现对应 service)
> - 所有事件订阅方(schema 契约来源)
> - 段 3 其他产出(bus / observability / member-service 等)

---

## 一、目录结构

```
proto-draft/
├── README.md                          (本文)
│
├── common/v1/                         跨域共享类型
│   ├── ids.proto                      标识符 + Trace Context
│   ├── audit.proto                    ActorContext / AuditLogRef / Severity
│   ├── events.proto                   CloudEvents 1.0 包络
│   ├── timestamps.proto               Timestamp / Duration / DateRange
│   └── errors.proto                   ErrorCode 枚举 + ErrorDetails
│
├── identity/v1/
│   └── identity_service.proto         IdentityService + GlobalMember + Role + Capability
│
├── conversation/v1/
│   └── conversation_service.proto     ConversationService + Conversation + Turn
│
├── work/v1/
│   └── work_service.proto             WorkService + Project + ProjectMember + WorkItem + Iteration + Backlog
│
├── process/v1/
│   └── process_service.proto          ProcessService + Template + Profile + Instance + Activity + Token
│
├── governance/v1/
│   └── governance_service.proto       GovernanceService + Gate + Policy + Control + AIIA + SoA + Nonconformity
│
└── artifact/v1/
    └── artifact_service.proto         ArtifactService + Artifact + Baseline + DatasetArtifact + ArtifactRelation
```

---

## 二、版本策略

### 2.1 版本路径

- **路径形态**:`<domain>/v<N>/`
- **起始版本**:所有 proto 从 `v1` 开始
- **breaking change**:开 `v2` 新路径,**两版本并存**一段时间(至少 2 个 minor 过渡期,见 `standards/子项目遵循规范清单.md` SK7)
- **non-breaking change**:在同一 `v<N>` 路径内添加字段 / 方法

### 2.2 字段编号约定

- **字段号 1-15** 供高频字段(proto3 用 1 byte 编码)
- **字段号 16-2047** 供常规字段
- **字段号 19000-19999** 保留给 proto 内部
- 删除字段 **不回收字段号**(标记 `reserved`)

### 2.3 Enum 约定

- 每个 enum 第一项为 `*_UNSPECIFIED = 0`(proto3 要求)
- enum 添加新值是 non-breaking;改名 / 删除是 breaking
- enum 值的实际语义变更(如重新诠释)必须走 ADR

### 2.4 消息命名约定

- **Request / Response**:`<Verb><Noun>Request` / `<Verb><Noun>Response`(如 `HireMemberRequest`)
- **事件 data**:`<Domain><Verb>EventData`(如 `MemberHiredEventData`)
- **聚合根消息**:直接用聚合根名(`GlobalMember` / `Conversation`)
- **值对象 / 枚举嵌入类型**:PascalCase 语义命名

---

## 三、CloudEvents 1.0 包络

所有跨域事件**必须**使用 `quantalithos.common.v1.CloudEvent` 包装。约定字段:

| CloudEvents 字段 | 本平台规则 |
|---|---|
| `specversion` | `"1.0"` |
| `type` | `<domain>.<aggregate>.<verb>` 过去式,如 `identity.member.hired` |
| `source` | `service:quantalithos-<service>` |
| `subject` | 聚合根 ID(如 member_id) |
| `id` | ULID(全局唯一,用于订阅方幂等去重) |
| `time` | RFC 3339 时间戳 |
| `datacontenttype` | `application/vnd.quantalithos.<domain>.<event>.v1+json` |
| `traceparent` | W3C Trace Context(强制) |
| `tracestate` | W3C Trace State(可选) |
| `data` | 业务 payload(按事件类型定义) |

### 3.1 扩展属性

除 CloudEvents 标准字段外,本平台统一附加:

- `actor_id` — 触发 actor 的 ID(UserId / MemberId / "system")
- `actor_kind` — actor 类型(`user` / `member` / `system`)
- `severity` — 事件严重性(`normal` / `major` / `critical`)
- `tenant_id` — 多租户 ID(SaaS 场景,自托管可空)

### 3.2 事件命名规范

- **动作型**(最常见):`identity.member.hired` / `work.workitem.state_changed`
- **状态型**(聚合状态变化):`conversation.archived` / `process.instance.completed`
- **副事件**(由主事件派生,供专项订阅):`conversation.mention_triggered`(由 `turn_posted` 派生)
- **审计严重事件**:以 `.critical` 结尾或 severity=critical,如 `artifact.content_tampered`

---

## 四、W3C Trace Context 贯穿

所有 RPC 请求 / 事件均携带 `traceparent` 和 `tracestate`:

- **RPC**:放在 gRPC metadata(`traceparent` / `tracestate`)
- **事件**:CloudEvents 扩展字段 `traceparent` / `tracestate`
- **数据库**:每张表都有 `trace_id` 字段(从 traceparent 提取 trace_id 部分)

W3C Trace Context 与 OpenTelemetry SDK 原生兼容,Runtime / Member / observability 都走 OTel GenAI 语义约定。

---

## 五、Proto 文件骨架预览

具体 proto 内容见各子目录文件。主要 service 与消息:

### 5.1 common/v1

| 文件 | 主要内容 |
|---|---|
| `ids.proto` | `Ulid` / `TraceContext` / `TenantId` |
| `audit.proto` | `ActorContext` / `AuditLogRef` / `Severity` |
| `events.proto` | `CloudEvent` 包络 + `EventMetadata` |
| `timestamps.proto` | 导入 `google.protobuf.Timestamp` + `Duration` / `DateRange` |
| `errors.proto` | `ErrorCode` 枚举 + `ErrorDetails` |

### 5.2 各域 service

| 域 | Service | 主要聚合根 | 事件族 |
|---|---|---|---|
| identity | `IdentityService` | GlobalMember / Role / Capability | `identity.member.*` / `identity.role.*` |
| conversation | `ConversationService` | Conversation / Turn | `conversation.*` + AG-UI 17 事件映射 |
| work | `WorkService` | Project / ProjectMember / WorkItem / Iteration / Backlog | `work.project.*` / `work.workitem.*` / `work.iteration.*` |
| process | `ProcessService` | Template / Profile / Instance / Activity | `process.template.*` / `process.profile.*` / `process.instance.*` / `process.activity.*` |
| governance | `GovernanceService` | Gate / Policy / Control / AIIA / SoA / Nonconformity | `governance.gate.*` / `governance.policy.*` / `governance.control.*` / `governance.aiia.*` / `governance.soa.*` / `governance.nonconformity.*` |
| artifact | `ArtifactService` | Artifact / Baseline / DatasetArtifact | `artifact.*` / `baseline.*` |

---

## 六、使用方式

### 6.1 设计期(段 2/3)

- 本草案作为 **所有 domain RPC 接口的单一真相源**
- 域内设计 / 跨域事件订阅 时引用本草案字段
- 修订走 ADR(若 breaking)

### 6.2 实施期(段 3 后 → 真实仓库)

- 本草案在段 3 末迁移到 `quantalithos-core` 仓(git submodule 或独立 clone)
- 使用 `buf` 做 lint / breaking change 检测
- CI 自动生成三语言 binding(Python / Rust / TypeScript)给 SDK 仓
- 各 L1 服务 server 端实现 service;各客户端 binding consumer

### 6.3 扩展流程

- 域内**新增字段**:域仓 PR,non-breaking,不需要 ADR
- 域内**新增方法**:PR + 在 domain README 更新契约
- 域内**删除 / 重命名 / 语义变更**:**breaking change**,必须 ADR + 走 v2 路径 + 过渡期
- **跨域类型变更**(common/v1):必须 ADR,影响面大

---

## 七、当前草案的完整性

本草案覆盖:

- ✅ 六域 service RPC 骨架(按 domain README §三)
- ✅ 所有聚合根 proto 消息
- ✅ 事件 type 命名清单(按 domain README §四)
- ✅ common/v1 基础类型
- ⚠ **不包含** 每个事件的 data payload 完整字段(需要时从 domain README §四 的"核心事件 schema"取)
- ⚠ **不包含** gRPC status detail 详细绑定(段 3 实施时补)

**完整性标记**:每个域 proto 文件开头标注"草案阶段"与"下一步动作"。

---

## 八、与标准对齐

| 标准 | 本草案体现 |
|---|---|
| **CloudEvents 1.0** | common/v1/events.proto |
| **W3C Trace Context** | 所有 RPC + 事件携带 traceparent |
| **OTel GenAI 语义约定** | 事件字段与 OTel 规范对齐 |
| **buf 风格** | 字段 / 消息 / service 命名一致 |
| **gRPC** | 协议默认 gRPC,REST 走 grpc-gateway |
| **三红线** | 审计字段(ActorContext / trace_id)强制 |

---

## 九、修订纪律

- **common/v1 类型** 修改必须 ADR(影响所有域)
- **域内 breaking change** 必须 ADR + v2 路径
- **新增字段 / 方法** 走常规 PR
- 本 README 的结构变更必须 ADR
- 整体 proto 文件从本目录迁到 `quantalithos-core` 仓时(段 3 末)走 ADR

---

> 本草案是段 3 第一件产出。在 `quantalithos-core` 独立仓建立前,本目录作为**跨域 proto 的临时家**。下游所有 SDK / server / consumer 必须对齐本草案。
