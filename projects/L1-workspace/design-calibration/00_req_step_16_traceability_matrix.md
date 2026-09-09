# L1-workspace 00 需求 Step 16：需求追溯矩阵

> 状态：`done / pass`；回填位置：正式 §16

## 1. 主追溯矩阵（功能为主轴）

| 功能 | 能力 | 故事 | 规则 | 数据 | 接口/NFR/验收 |
|---|---|---|---|---|---|
| FR-WS-001/002 | C1 | US-WS-001/002 | BR-WS-003 | Partition/VisibilityBinding | Query、安全、AC |
| FR-WS-003 | C2 | US-WS-001/002/004 | BR-WS-002/010 | source snapshot/ref | Query、一致性、AC |
| FR-WS-004 | C3 | US-WS-005/007 | BR-WS-004/005/006 | cursor/application record | Event、一致性、AC |
| FR-WS-005/006 | C4 | US-WS-001/002/004 | BR-WS-001/003/010 | Projection/revision/coverage | Query、可追溯、AC |
| FR-WS-007/008 | C5 | US-WS-003 | BR-WS-008/009 | Inbox/read/local state | Change、可用性、AC |
| FR-WS-009 | C6 | US-WS-005/006 | BR-WS-007/010/011 | Generation/rebuild | Background、可演进、AC |
| FR-WS-010 | C4/C6 | US-WS-004/006 | BR-WS-001/010/012 | read/export snapshot | Reference、可追溯、AC |

## 2. 漏项检查

| 检查项 | 结果 |
|---|---|
| 每个核心能力有故事、功能、规则、数据、接口和验收 | pass |
| 每个功能可回指能力和故事 | pass |
| 规则未创造上游 truth | pass |
| 数据已区分 truth/snapshot/ref/forbidden body | pass |
| 接口未滑入协议/实现 | pass |
| blocker 已进入风险和验收上限 | pass |
| 孤儿功能/故事/规则/数据/接口/验收 | none found |

## 3. 门禁

```text
gate_status = pass
next_allowed_action = create_step_17_formal_document_assembly
```
