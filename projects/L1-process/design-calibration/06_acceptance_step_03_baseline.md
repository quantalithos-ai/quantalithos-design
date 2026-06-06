# Step 3. 固定验收基线

> 回填章节: `06-验收标准.md` §3 验收基线
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `05` §12~§13 | entry / exit、artifact 和 report path |
| 验收规范 | run_id、reports 和 acceptance handoff 规则 |

## 2. SOP 问题回答

1. 文档基线如何固定?
   回答:正式送验时填写 `00`~`06` 对应 design commit 或 version。
2. 实现基线如何固定?
   回答:正式送验时填写 `/home/aris/Projects/quantalithos-process` implementation commit、build id 或 image digest。
3. 证据基线如何固定?
   回答:必须固定 `<run_id>`,不得使用 `latest`。

## 3. 当前文档问题诊断

旧文档未固定 implementation commit、run_id、artifact root、report root 和 acceptance handoff,不具备真实裁决能力。

## 4. 改动前后对比

| 项 | 旧版 | 新版 |
|---|---|---|
| run_id | 未定义 | 必填且不得为 `latest` |
| report path | 泛化测试报告 | `reports/runs/<run_id>` / `reports/acceptance/*` |
| implementation | 未固定 | `<implementation_commit>` 必填 |

## 5. 结构化中间产物

| 基线类型 | 必填标识 | 说明 |
|---|---|---|
| 文档基线 | `<design_commit_or_version>` | 覆盖 `00`~`06` |
| 实现基线 | `<implementation_commit>` | 目标实现仓 commit |
| 构建基线 | `<build_id_or_image_digest>` | 有构建产物时必填 |
| 依赖基线 | `<core_contracts_commit>` | 唯一 compile dependency |
| 配置基线 | `<config_digest>` | runtime config digest |
| 数据基线 | `<dataset_id_or_digest>` | fixture / replay bundle |
| 测试运行基线 | `<run_id>` | artifact / report 目录 key |

## 6. 回填草稿

§3 列出文档、实现、构建、依赖、环境、配置、数据和测试运行基线,并固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`。

## 7. 待确认事项

真实送验前补齐具体 commit、build、config digest、dataset 和 run_id。
