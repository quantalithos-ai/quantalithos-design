# L2-member 00 需求 Step 5: 用户与角色

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 5 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 用户与角色 |
| 输出文件 | `design-calibration/00_req_step_05_users_roles.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.5:角色表,不写仓际依赖 / 故事 / 接口动作;权限矩阵按需) |
| 已读取前序输入 | yes(Step 2 边界、Step 4 目标) |
| 当前模式 | full-restart |
| 进入条件 | Step 4 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| SOP 问题回答 | done | 五项回答 | pass |
| 诊断(旧角色章) | done | 差异表 | pass |
| 设计取舍 | done | 取舍表 | pass |
| 结构化产物 | done | 人类 / 系统角色表 | pass |
| 回填草稿 | done | 第 5 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- Step 2 边界判定口径;Step 4 目标。
- L2-runtime 00 §5(人类 / 系统角色二分与"角色不授予 authorization"口径)。
- 旧 00 §4(historical,审计用)。

## 3. SOP 问题回答

1. 本仓有哪些主要角色?

   回答: 人类三类(维护 / 运维者、安全边界审查者、交互问题调查者),系统五类(运行决策协作方、宿主编排协作方、入站事实提供方、出站材料消费方、摘要 / 能力出口消费方)。

2. 哪些是人类角色,哪些是系统角色?

   回答: 见 §6 表,逐行标注。

3. 这些角色分别在什么场景下接触本仓?

   回答: 见 §6 表使用场景列;均为能力级场景,不含接口动作。

4. 是否存在管理、审计或维护类角色?

   回答: 存在——维护 / 运维者与安全边界审查者;审计类查看经由摘要 / 观测材料消费,不设独立"审计角色仓内特权"。

5. 是否需要进一步补权限矩阵?

   回答: 不需要。member 的角色差异主要体现为"接触哪类能力面",不体现为同一操作的多角色权限分级;且 effective authorization owner 未闭口(`L2M-UP-007` 关联),权限矩阵在需求层无法成立,写了反而伪造裁决语义。

## 4. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §4.1 | 把 Runtime / member-service / governance 等仓直接写成"用户" | 仓际依赖混入角色章;仓关系移到 Step 6,本章只写角色职责语境。 |
| 旧 00 §4.2 | 权限矩阵含"校验 launch_token ✅/❌"等接口动作 | 接口动作 + 未闭口凭据形态;废弃矩阵,改为角色不授权声明。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 角色只写职责与接触场景,不写权限矩阵(采用) | 不伪造 authorization;与 Runtime 00 一致 | 权限差异后移 | 采用 |
| 保留旧权限矩阵 | 直观 | 授权 owner 未闭口,矩阵是伪裁决 | 不采用 |

## 6. 结构化中间产物

### 6.1 人类角色

| 角色 | 类型 | 使用场景 |
|---|---|---|
| member 维护 / 运维者 | 人类角色 | 维护成员门面的订阅范围、出站边界与在场诊断入口;处理 degraded / blocked 状态,不修改相邻仓 truth。 |
| 安全 / 边界审查者 | 人类角色 | 审查入站筛选结论的来源回链、forbidden body 是否越界、出站材料是否 body-free、是否存在自建 allowlist 或 fail-open。 |
| 交互问题调查者 | 人类角色 | 沿入站记录、投递决定、Runtime 受理 ref、出站尝试 / gap 关联定位丢失、误拦截、重复或未送达问题,区分 member / Runtime / bus / 下游各层责任。 |

### 6.2 系统角色

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 运行决策协作方 | 系统角色 | 容器内消费 member 投递的入站语境,返回受理 / 拒绝 / 状态,并交回 committed safe material 供出站承接。 |
| 宿主编排协作方 | 系统角色 | 提供项目型执行主语与启动语境,接收 member 的注册请求 / 存活信号 / 状态报告;注册接受、endpoint registry、host session、健康判定与编排 truth 留在其自身。 |
| 入站事实提供方 | 系统角色 | 经事件主干向成员送达已提交事实;delivery truth 归其自身。 |
| 出站材料消费方 | 系统角色 | 消费 member 发布的 body-free 交互材料与观测材料,不据此反写 member truth。 |
| 摘要 / 能力出口消费方 | 系统角色 | 只读消费成员状态摘要与能力出口安全视图,理解成员当前可承接范围。 |

### 6.3 角色边界声明(候选正文)

角色表只描述职责与接触场景,不授予 authorization。具体 principal、scope、allow / deny 必须来自 Governance / Identity 等正式 owner;任何角色都不得声明 delivered、observed、accepted 或健康裁决结论。

## 7. 回填草稿

按 6.1~6.3 回填第 5 章;不设权限矩阵,并写明原因(操作差异不显著且授权 owner 未闭口)。

## 8. 待确认事项

- 无新增。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 人类 / 系统角色已区分 | pass |
| 未把仓际依赖写成角色(系统角色写职责语境而非仓名) | pass |
| 使用场景无接口动作 / 故事句式 | pass |
| 角色不授予 authorization 已声明 | pass |
| Step 6 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_06_consumers_dependencies
formal_document_write_allowed = false
```
