# Step 2. 明确实施目标、范围和非范围

## 1. Step 状态

`completed / no_code_scope`。

## 2. 实施目标

| 目标 | 结果 |
|---|---|
| 建立 contracts/domain/application/infra/api/worker/jobs 技术 role | 可按 03 文件布局形成边界 |
| 先完成 local 可验证机制 | 对象、状态、Query no-write、局部事务/幂等 |
| 再接入正式 owner/bus/durable seam | 缺 seam 时保留 blocked |
| 嵌入 05/06 门禁与证据路径 | 每 boundary 可验证、可暂停、可回退 |

## 3. P0 实施范围

P0 为 typed contract、16对象/状态、2 Command、6 Query、2 Consumer、4 Operation、局部 store/UoW/CAS、projection/gap/unknown/idempotency/recovery、config/redaction/dependency checks、tests/reports boundary。P1 为 downstream compatibility 和 selected hardening；P2 为 workload/容量/长稳/retention，均不得替代 P0。

## 4. 非范围与禁止

不实现 owner truth、authorization engine、正文、event producer、bus delivery、runtime/tools/capability/sandbox、SDK/cache/UI、archive truth、outbox、outbound publisher 或跨仓共享表。不得以 fallback/fake 把 blocked 写成 ready。

## 5. 回填与进入下一步

正式 §2 采用功能纵切范围表；允许 Step3。
