# quantalithos-sandbox

> **仓使命**:代码执行隔离 —— 为 Runtime Tool 调用 / Runner App 提供安全沙箱。至少 Docker + gVisor 两种隔离后端。  

---

## 仓定位

- **层**:L4 基础设施层
- **同层兄弟**:observability / archive
- **技术栈**:Rust(性能敏感 + 贴近底层 syscall)

---

## 主要对齐

- **Research 沙箱逃逸防御**(Docker 不够,gVisor / Firecracker 加固)
- **ISO 25010 Security Resistance**
- **ISO 42001 §A.6 Operation**(运行期隔离)
- **ISO 27001**(访问控制)

---

## 核心职责

- **隔离执行** Runtime 要跑的代码 / 工具
- **资源限制**:CPU / 内存 / 磁盘 / 网络出口
- **默认无出网**,白名单出网必须 Policy 授权
- **审计事件**:SandboxInvoked / SandboxExited / SandboxEscapeDetected
- **共享接口**:Runner App 复用同一套 sandbox(不重造)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-sdk`
- 外部:Docker / containerd / gVisor / Firecracker / runc

### 下游
- `quantalithos-tools`(危险 Tool 走 sandbox)
- `quantalithos-runner`(跑 AI 产出的 App)
- `quantalithos-capability-hub`(Policy 授权出网)

---

## 目录结构

```
quantalithos-sandbox/
├── Cargo.toml
├── src/
│   ├── backends/
│   │   ├── docker/
│   │   ├── gvisor/
│   │   ├── firecracker/       (未来)
│   │   └── local_process/     (测试)
│   ├── api/                   SandboxService trait
│   ├── limits/                资源 / 时限 / 出网策略
│   ├── audit/                 审计事件发布
│   └── rpc/
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` SB 条目:
- **SB1** 至少 Docker + gVisor 两后端
- **SB2** 默认无出网,白名单出网必须 Policy
- **SB3** 发 SandboxInvoked / SandboxExited 事件 + 资源用量
- **SB4** 执行时限 + 内存上限 + 磁盘上限(硬约束)
- **SB5** Runner 与 Member 共用同一套 sandbox 接口(DRY)

---

## 详细设计参考

- `architecture/ai-member设计.md` §5.1.1(Tools 与 sandbox 关系)
- `architecture/标准对齐全景图.md` sandbox 对齐

---

## 开放问题

- Firecracker 加入时机(需求触发)
- sandbox 多层嵌套(Runner 内跑 sandbox 子 Runtime 的场景)
- 网络白名单的粒度(domain / IP / port)

---

## 性能目标

- 沙箱启动 < 1s(Docker)/ < 2s(gVisor)
- 容器销毁 < 500ms
- 出网延迟开销 < 5ms(白名单检查)

---

## 安全基线

- 容器用户非 root
- Seccomp + AppArmor profile 默认启用
- /proc / /sys 只读挂载
- 禁用 `CAP_SYS_ADMIN` 等高危 cap
- 网络:默认 drop all,白名单 allow
