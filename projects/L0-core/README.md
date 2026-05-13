# quantalithos-core

> **仓使命**:Quantalithos 的**共享契约基石** —— Proto schema + CloudEvents 1.0 包络 + W3C Trace Context + 全平台 ErrorCode 枚举。所有仓编译期依赖本仓。  

---

## 仓定位

- **层**:L0 共享契约层
- **同层兄弟**:`quantalithos-bus` / `quantalithos-sdk`
- **稳定性**:最稳定;breaking change 必须走 v2 路径 + 过渡期

---

## 主要对齐

- **CloudEvents 1.0 Spec**(事件包络)
- **W3C Trace Context**(trace 贯穿)
- **OTel GenAI 语义约定**(事件字段命名)
- **buf 风格**(proto 命名 / breaking check)

---

## 关键依赖

### 上游(本仓的依赖)

- 无(L0 最底层)

### 下游(依赖本仓的仓)

所有 26 仓都依赖 core(编译期)。特别高频消费者:

- `quantalithos-bus` — 消费 CloudEvent 包络
- `quantalithos-sdk` — 生成三语言 binding
- 所有 L1 六域服务 — 实现 proto service
- L2/L3/L4/L5/L6 — 事件订阅 + RPC 调用

---

## 目录结构

```
quantalithos-core/
├── README.md                         本文
├── buf.yaml                          buf 配置
├── buf.lock                          依赖锁
├── buf.gen.yaml                      生成器默认配置
├── proto/
│   ├── common/v1/
│   │   ├── ids.proto                 ULID / TraceContext / Semver
│   │   ├── audit.proto               ActorContext / AuditLogRef / Severity / AutonomyLevel
│   │   ├── events.proto              CloudEvent 1.0 包络 + EventMetadata
│   │   ├── timestamps.proto          DateRange / RetentionPolicy / CadenceSpec
│   │   └── errors.proto              ErrorCode + ErrorDetails
│   ├── identity/v1/identity_service.proto
│   ├── conversation/v1/conversation_service.proto
│   ├── work/v1/work_service.proto
│   ├── process/v1/process_service.proto
│   ├── governance/v1/governance_service.proto
│   └── artifact/v1/artifact_service.proto
├── docs/
│   ├── versioning-policy.md
│   ├── breaking-change-policy.md
│   └── event-naming-convention.md
└── .github/workflows/
    ├── buf-lint.yml
    ├── buf-breaking.yml               PR 时检查 breaking change
    └── release.yml                    tag 后触发 sdk / 各服务同步
```

---

## 版本策略

- **语义**:严格 semver
- **路径**:`<domain>/v<N>/`,v1 起步;breaking → 开 v2 路径并行两个版本
- **过渡期**:breaking change 发布后,至少 2 个 minor 保留旧版
- **字段号约定**:1-15 高频 / 16-2047 常规 / 19000-19999 保留

详见 `docs/versioning-policy.md`。

---

## 构建与测试

```bash
# 安装 buf(首次)
brew install bufbuild/buf/buf

# Lint
buf lint

# Breaking change 检测(相对主干)
buf breaking --against '.git#branch=main'

# 本地生成三语言 binding(仅用于 design/debug)
buf generate

# 发 tag(CI 会触发下游同步)
git tag v1.2.3 && git push --tags
```

---

## 维护纪律

对齐 `standards/子项目遵循规范清单.md` §一 L0 的 CR 条目:

- **CR1** 一切跨仓契约必须经过本仓
- **CR2** proto 版本号遵循 buf breaking-change 检测
- **CR3** 事件命名 `<domain>.<aggregate>.<verb>` 过去式
- **CR4** 新事件类型必须 ADR
- **CR5** 三语言 binding 通过 buf generate 派生,不手写
- **CR6** 错误码 enum 集中在 `common/v1/errors.proto`

跨仓事件 schema 的新增 / 修改必须走 ADR(即使是 non-breaking)。

---

## 详细设计参考

**在 design 仓**:
- `architecture/proto-draft/` — 本仓设计态 proto 草案(段 3 产出,段 3 末迁入本仓)
- `architecture/proto-draft/README.md` — 版本策略 / CloudEvents 包络 / 扩展流程
- `domain/*/README.md` §三(RPC proto 草案)— 每域 service 骨架
- `domain/*/README.md` §四(事件 schema 细节)— 每域事件 type 清单
- `architecture/标准对齐全景图.md` §一 core 仓对齐

---

## 开放问题

- **类型别名 vs 原生 string**:当前 `MemberId { string value = 1 }` 是嵌套消息。是否直接用 `string member_id`?前者类型安全,后者更简洁。待 ADR。
- **proto 插件选型**:Python(buf.build/protocolbuffers/python)/ Rust(tonic)/ TypeScript(bufbuild/protobuf-es)是否长期稳定。
- **gRPC-Web / Connect**:TypeScript 客户端用 pure gRPC 还是 Connect RPC(buf 官方)?

---

## 联系 / 贡献

- Issues / PR 走 GitHub
- 设计决策走 `quantalithos-design` 仓的 `architecture/adr/`
