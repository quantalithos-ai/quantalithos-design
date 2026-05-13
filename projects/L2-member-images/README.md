# quantalithos-member-images

> **仓使命**:按 Role 预构建的 Docker 镜像集合(CI 产出仓)。每 Role 一镜像,供 member-service 拉取运行。  

---

## 仓定位

- **层**:L2 Member 运行层
- **形态**:**CI 产出仓**,不是运行时代码
- **技术栈**:Dockerfile + CI(GitHub Actions / GitLab CI)+ buildx

---

## 主要对齐

- **ADR-0005**(镜像按 Role 预构建)
- **ISO 42001 §A.4 Tooling Resources**(镜像作为工具清单具象)
- **SPEM 2.0 RoleDefinition → image_variant 映射**
- **Research 沙箱加固**(未来 gVisor / Firecracker 基础镜像)

---

## 镜像集合

```
ai-member-base:<semver>           所有 Role 共享
  ├─ python:3.12-slim
  ├─ quantalithos-member(Rust 静态二进制)
  ├─ quantalithos-runtime(Python)
  ├─ quantalithos-tools 核心
  └─ supervisord 配置

ai-member-assistant:<semver>
ai-member-tech-lead:<semver>
ai-member-backend-dev:<semver>
ai-member-frontend-dev:<semver>
ai-member-qa:<semver>
ai-member-ux:<semver>
ai-member-devops:<semver>
ai-member-auditor:<semver>        ISO 42001 内部审计
ai-member-observer:<semver>       只读
```

---

## 关键依赖

### 上游
- `quantalithos-member`(Rust 二进制产物)
- `quantalithos-runtime`(Python 包)
- `quantalithos-tools`(Python 包)
- method-library 的 RoleDefinition(决定 image_variant 字段)

### 下游
- `quantalithos-member-service`(按 Role 拉取启动)

---

## 目录结构

```
quantalithos-member-images/
├── README.md
├── base/
│   ├── Dockerfile
│   └── supervisord/
│       ├── supervisord.conf
│       ├── member.conf
│       └── runtime.conf
├── roles/
│   ├── assistant/Dockerfile
│   ├── tech-lead/Dockerfile
│   ├── backend-dev/Dockerfile
│   ├── frontend-dev/Dockerfile
│   ├── qa/Dockerfile
│   ├── ux/Dockerfile
│   ├── devops/Dockerfile
│   ├── auditor/Dockerfile
│   └── observer/Dockerfile
├── scripts/
│   ├── build-all.sh
│   ├── scan.sh              Trivy / Grype 扫描
│   ├── sign.sh              cosign 签名
│   └── push.sh
├── .github/workflows/
│   ├── nightly.yml          每晚构建
│   ├── on-runtime-tag.yml   runtime 发 tag 触发
│   └── on-tools-tag.yml     tools 发 tag 触发
└── BOM/                      Bill of Materials,每次构建产出
    └── <role>-<ver>.json     全依赖清单(apt / pip / npm)
```

---

## 构建流水线

```
每晚 CI:
1. 拉 runtime / tools / member 最新 tag
2. 检查 IPC schema 兼容性(member ↔ runtime 的 proto 版本)
3. 构建 ai-member-base(带 cache)
4. 基于 base 构建 9 个 Role 镜像(并行)
5. 安全扫描(Trivy + Grype)—— 严重漏洞阻塞
6. 生成 BOM(所有依赖清单)
7. cosign 签名
8. 推到 registry(支持 amd64 + arm64)
9. 通知 member-service 可选启用新版本(不自动升级)
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` MI 条目:
- **MI1** 一 Role 一镜像,`ai-member-<role>:<semver>`
- **MI2** ai-member-base 作为所有 Role 的基础
- **MI3** 镜像 CI 每晚,版本 pinned 到 runtime + tools 的版本
- **MI4** digest 签名 + BOM + 安全扫描
- **MI5** 镜像不得内置 API Key / credential
- **MI6** 禁止 `latest` tag 用于生产

**安全补丁**必须即时发(不等定期构建)。

---

## 详细设计参考

- `architecture/ai-member设计.md` §5.2
- `architecture/adr/0005-member-image-per-role.md`
- `产品遵循规范清单.md` AM 条目(AI Members 产品强制项)

---

## 开放问题

Auditor Role 是否用特殊只读镜像(`domain/governance` §Q6 / ai-member 设计 §十一 Q6)。

---

## 运维

- 镜像 registry 多区域部署
- 每个 tag 保留至少 90 天(即使已被更新版本替代)
- retired Role 镜像归档至少 1 年(审计用)
