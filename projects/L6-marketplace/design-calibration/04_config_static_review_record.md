# L6-marketplace 04 配置设计静态审查记录

## 1. 审查元信息

| 项 | 结果 |
|---|---|
| 日期 | 2026-10-02 |
| 文档 | `04-配置设计.md` |
| 范围 | 本项目04正式文档、04 calibration、中间产物和项目执行台账 |
| 方法 | Markdown结构、链接目标、表格/围栏、配置字段和状态静态检查 |
| 未执行 | 代码编译、测试、部署、外部调用、secret读取、资产/扫描/支付/evidence生成 |
| 结论 | `pass_with_external_blockers / stop_review` |

## 2. Step与来源检查

| 检查项 | 结果 | 证据 |
|---|---|---|
| Step1～15均有独立中间产物 | pass | `04_config_step_01...15_*.md` |
| 每个Step包含状态、输入、问题回答、诊断/取舍、结构化产物、影响判定、回填/门禁 | pass | Step1～15逐文件静态核对 |
| 正式04固定15章主链 | pass | `04-配置设计.md` §1～§15 |
| 每章有具体校准来源和延伸阅读 | pass | 正式正文各章开头 |
| Step15明确停审和05门禁 | pass | Step15§6；flow§5 |

## 3. 配置闭环检查

| 检查项 | 结果 | 结论 |
|---|---|---|
| 配置域 | pass | 仅`api`、`storage`、`sdk`、`owner`、`worker`、`web` |
| RuntimeConfig映射 | pass | 仅03已有七字段；`schema_version/profile`是envelope metadata |
| Web边界 | pass | `VITE_MARKETPLACE_API_BASE`为build-time；locale只展示 |
| owner slot | pass | 八kind；ref不等Bound；无Billing/Archive/Bus |
| 默认值 | pass | 仅`default_locale=En`安全默认；服务项无生产数值默认 |
| source priority | pass | 静态不变量→JSON→路径选择/ref解析；无逐项env覆盖 |
| hot/reload | pass | server startup、Web build-time；hot/reload不适用/禁用 |
| sensitive | pass | JSON只存opaque ref；raw secret不进文件、日志、RuntimeConfig或Web |
| forbidden keys | pass | approval/visibility/state/幂等/retry-all/installed/paid等拒绝 |
| failure | pass | 配置错误fail-fast；资格缺口Blocked/Unavailable；不伪造成功 |

## 4. 七字段映射核对

| 03字段 | 04路径 | 核对 |
|---|---|---|
| `api_bind` | `api.bind` | pass |
| `postgres_config_ref` | `storage.postgres_config_ref` | pass |
| `sdk_profile_ref` | `sdk.profile_ref` | pass |
| `owner_bindings` | `owner.bindings[]` | pass |
| `worker_batch_limit` | `worker.batch_limit` | pass |
| `lease_millis` | `worker.lease_millis` | pass |
| `default_locale` | `web.default_locale` | pass |

`web.api_base`只属于Web build-time边界，不装配进服务RuntimeConfig。正式配置未新增`cursor_key_ref`、TLS/auth字段、Billing/Archive字段或任何业务开关。

## 5. 外部资格与真实性边界

| 项 | 状态 | 处理 |
|---|---|---|
| `MP-UP-001～008` | pending/blocked/affected | 不用配置文件自证Bound；正向adapter保持受影响 |
| `MP-SRC-003/010/013` | pending/affected/future | publisher/Governance/material/供应链合同未关闭 |
| `Q-MP-01` | blocked | 不填写容量、timeout或production baseline |
| provider/PG/SDK exact mapping | pending | 只定义ref/校验和失败姿态 |
| Billing/payment/subscription/revenue/cross-border | future/blocker | 不创建交易truth或配置域 |
| Archive/event/outbox lane | future/blocker | 保持0 active lane |

## 6. 链接与格式审计

| 检查 | 结果 |
|---|---|
| 本项目相对链接目标存在 | pass（静态目标扫描） |
| 代码围栏闭合 | pass |
| 表格列数稳定 | pass |
| ASCII图有标题和图示说明 | pass |
| 未引用其他项目正式文档作为修改目标 | pass；仅作只读上游输入 |
| 未修改项目外文件 | pass（以本轮路径范围为准；工作区其他既有dirty未处理） |

## 7. 审查结论与恢复点

04正式设计可以停审，结论为`completed / selfcheck_done / stop_review / waiting_user_confirmation`。这不是实现ready或外部资格通过。

当前恢复点：

```text
project_execution_ledger.md
  -> 04_config_calibration_flow.md
     -> 04_config_step_15_formal_document_assembly.md
        -> 04_config_static_review_record.md
```

下一动作只能是等待用户确认04；确认前不读取05 SOP、不创建05 calibration、不创建implementation ledger或boundary skeleton，不提交commit。
