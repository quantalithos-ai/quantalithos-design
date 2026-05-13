# quantalithos-runner

> **仓使命**:一键运行 AI 产出软件的独立 App。让**非开发者用户**不用懂部署 / 环境 / 依赖就能把 AI 团队产出的软件跑起来。  

---

## 仓定位

- **层**:L5 UI 层
- **技术栈**:Rust + Tauri(桌面主)+ CLI(后备)
- **产品归属**:② Runner(`产品矩阵.md` §3.2)

---

## 主要对齐

- **ISO 25010 Portability**(Adaptability / Installability / Replaceability)
- **ISO 25010 Reliability**(Availability / Recoverability)
- **Research 沙箱加固**(Runner 本身不允许逃逸主机)
- **ISO 42001 §A.6 Operation**(运行期隔离)

---

## 核心职责

- **Release 包管理**:列出用户项目的 Release(artifact.kind=release)
- **拉取内容**:从 artifact 仓下载 Release 包
- **沙箱启动**:通过 L4 sandbox 在本机启动
- **资源看板**:多项目同时运行的资源用量
- **本地日志**:运行失败时收集日志(可选回传 Chat 给 Assistant 分析)
- **一键停止 / 清理**

---

## 关键依赖

### 上游
- `@quantalithos/sdk-rust`
- `quantalithos-sandbox`(共享 L4 sandbox 实现)
- 外部:Tauri / Docker daemon(或 gVisor / Firecracker)

### 下游
- Server 的 ArtifactService(下载 Release)+ WorkService(项目验证)

---

## 目录结构

```
quantalithos-runner/
├── Cargo.toml
├── src-tauri/            Tauri 主进程
├── src/                  Rust 业务
├── web/                  前端(React/Svelte)
├── cli/                  CLI 版本
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` RN 条目 + `子项目遵循规范清单.md` RN:
- 只运行 approved / baselined Release
- 沙箱隔离(必须)
- 运行日志上报 observability
- 用户不可修改 Release 内容
- 版本选择必须显式(禁用 "latest")
- 一键停 / 清理资源

---

## 详细设计参考

- `产品遵循规范清单.md` §二.② Runner
- `架构设计.md` Adaptability / Installability 对齐

---

## 开放问题

- 跨平台 GUI 统一(macOS / Windows / Linux)的 Tauri 还是 Electron
- 多 Release 并发运行时的端口冲突处理
- 分享运行(生成临时访问链接给朋友)

---

## 性能

- 冷启动(首次拉 Release + 启 sandbox)< 30s
- 热启动(已有本地 cache)< 5s
- 多项目并发 ≥ 10 个(参考 CPU 8 核 16GB 开发机)
