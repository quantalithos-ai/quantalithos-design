# quantalithos-sync

> **仓使命**:工作区同步 CLI —— 让开发者把 AI 产出代码同步到本地 IDE,修改后推回走 review Gate。  

---

## 仓定位

- **层**:L5 UI 层
- **技术栈**:Rust(主 CLI)+ 可选小型 GUI(Tauri)
- **产品归属**:③ Sync(`产品矩阵.md` §3.3)

---

## 主要对齐

- **ISO 25010 Compatibility Interoperability**(与 git 共存)
- **ISO 42001 §A.7 Data Provenance**(双向同步必须记录溯源)

---

## 核心职责

- `qs-sync clone <project>` — 把项目代码同步到本地(底层用 git)
- `qs-sync pull` — 拉最新
- `qs-sync push-review` — 本地修改走 review Gate,不直进主分支
- **不自动合并**,冲突必须人类决策
- **溯源元数据**:`.qs-sync/metadata.json` 永久保留(不可删除)

---

## 关键依赖

### 上游
- `@quantalithos/sdk-rust`
- 外部:git / 文件系统

### 下游
- Server 的 ArtifactService(code kind)+ WorkService(权限验证)+ GovernanceService(review Gate)

---

## 目录结构

```
quantalithos-sync/
├── Cargo.toml
├── src/
│   ├── cli/
│   ├── git_wrapper/
│   ├── metadata/            .qs-sync 维护
│   └── sync_engine/
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` SY 条目 + `子项目遵循规范清单.md` SY:
- 仅允许用户有权限的 Project 同步
- push-back 必须进 review Gate
- 冲突不自动合并(人类决策)
- `.qs-sync/metadata.json` 不可删
- 不自动推送(必须明示 `push-review`)

---

## 详细设计参考

- `产品遵循规范清单.md` §三.③ Sync
- `domain/artifact/README.md`(code kind)
- `domain/governance/README.md`(review Gate)

---

## 开放问题

- Web IDE 集成(打开 URL 直连 Sync 工作目录)
- 大 Repo 性能(Git LFS / 浅克隆)
- 多用户协作同一项目的本地同步策略

---

## 刻意不做

- 不替代 git(git 仍是底层)
- 不做自动合并 / rebase
- 不做跨项目同步
