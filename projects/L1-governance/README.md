# quantalithos-governance

> **仓使命**:治理域服务 —— Gate / Policy / Control / AIIA / SoA / Nonconformity。Quantalithos 对齐 ISO 42001 AIMS 的**核心技术载体**。  

---

## 仓定位

- **层**:L1 六域服务层
- **技术栈**:Rust + PostgreSQL(强一致 + 高可用)

---

## 主要对齐

- **ISO 42001 整套**(AIMS §4-§10 + 附录 A 38 控制项)
- **ISO 24748-2 Decision Gate**(Gate 六段式)
- **ISO 9001 PDCA + §10.1**(Nonconformity + Corrective Action)
- **Research 自主性 5 级**(autonomy_level)
- **Research 指令优先级**(shared_rules 最高不可覆盖)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- `quantalithos-artifact`(AIIA / SoA / ComplianceDeclaration 双身份)
- 外部:PG

### 下游(订阅本仓事件)
- **所有六域**(gate.decided 驱动 Artifact / WorkItem / Activity / Member 状态)
- `quantalithos-conversation`(发 gate Turn)
- L2 runtime Policy Cache
- capability-hub(MCP 白名单)
- work(tool_scope 重评)
- observability(全量审计)

---

## 目录结构

```
quantalithos-governance/
├── Cargo.toml
├── src/
│   ├── domain/             Gate / Policy / Control / AIIA / SoA / Nonconformity + Approval
│   ├── rpc/                GovernanceService 实现
│   ├── policy/             Policy DSL 解析 + 下发机制(fingerprint)
│   ├── subscriptions/      订阅 process/work/artifact/identity 事件
│   └── infra/
├── migrations/             6 聚合 + Approval + Outbox
├── tests/                  覆盖率 ≥ 95%(治理域要求更严)
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` GV 条目:
- **GV1** Gate 六段式必须完整(缺一拒绝决策)
- **GV2** audit_trail 只 append
- **GV3** decided 后 resolution 不可修改
- **GV4** autonomy_level=5 必须 policy_auto 授权
- **GV5** shared_rules 不被低 scope 覆盖
- **GV6** Control 遵循 42001 附录 A 编号
- **GV7** AIIA 双身份与 artifact 同步
- **GV8** Rust 栈

**47 条不变量(INV-1 到 INV-47)** 必须硬编码 + 测试覆盖。治理域的单元覆盖率要求 ≥ 95%(比其他域更严)。

---

## 详细设计参考

- `domain/governance/README.md`(1778 行,最长 domain 文档)
- `methodology/standards-discussion/ISO-42001.md` 整套
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(Decision Gate)
- `methodology/standards-discussion/ISO-9001.md`(PDCA + 纠正措施)
- `architecture/proto-draft/governance/v1/governance_service.proto`

---

## 开放问题

Gate kind 扩展机制 / Policy DSL 选型(CEL/Rego)/ AIIA 自动化 / 多组织继承 / Nonconformity 阈值 / 管理评审自动化 / Gate 决策回滚。

---

## 性能目标

- RaiseGate P95 < 150ms / DecideGate P95 < 200ms
- GetApplicablePolicies P95 < 50ms(高频,Runtime 调用)
- Policy 下发到 Runtime 生效 P95 < 30s
- Availability ≥ 99.95%(治理域可用性比其他域更高)
- 200w Gate / 1000w Policy 记录(含历史)

---

## 合规

- **ISO 42001** 认证就绪(SoA 覆盖 38 控制项是硬约束)
- **ISO 9001** PDCA 循环完整
- **GDPR / HIPAA / EU AI Act** 对接由 Policy 配置
