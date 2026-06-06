# Step 13. 定义配置迁移、废弃与演进

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 13 中间产物。
> 本步定义配置如何新增、废弃、迁移和演进。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
- 回填章节: `projects/L1-process/04-配置设计.md` §13 配置迁移、废弃与演进

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 配置项清单 | 当前基线 | 当前无已发布旧配置,因此无迁移项 |
| Step 10 变更审计 | 定义迁移治理 | 新增 / 废弃 / 移除必须审计 |
| 配置 SOP 反向校准规则 | 判断是否回写 `03` | 改变 runtime config 字段必须回写 `03` |

## 3. SOP 问题回答

当前 L1-process `04-配置设计.md` 是首版配置基线,没有已发布旧配置需要兼容迁移。未来新增配置必须按以下规则处理:

- 只改变默认值、来源、优先级、profile、敏感级别、失败策略: 更新 `04`,并同步 `05/06/07`。
- 改变 `ProcessRuntimeConfig` 字段、runtime builder、adapter constructor、trait / port、error、DTO 或函数流: 先回写 `03`,再更新 `04`。
- 废弃配置必须有兼容窗口和 fail-fast / warning 策略。
- 移除配置前必须确认实现、测试、验收和运维引用已迁移。

## 4. 结构化中间产物

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前首版配置基线 | 不适用 | 不适用 | 不适用 |

### 4.1 未来演进规则

| 演进类型 | 是否需回写 03 | 04 处理 | 下游同步 |
|---|---|---|---|
| 调整默认值 | 否,除非改变安全 / 状态语义 | 更新配置项表和风险 | 同步 05 / 06 / 07 |
| 新增已有 section 内配置项 | 可能;若字段不存在必须回写 03 | 等 03 定义字段后更新 | 同步测试 / 实施 |
| 新增 top-level section | 是 | 先回写 03 `ProcessRuntimeConfig` | 同步所有下游 |
| 新增 production adapter product fields | 是,若影响 adapter constructor | 先补 03 / 04 P1 专项 | 同步部署运维 |
| 启用 remote config / hot reload | 是 | 需要 03 runtime contract + 04 reload strategy | 同步测试 / 验收 / 运维 |
| 废弃配置项 | 视字段是否仍存在 | 标注 deprecated、兼容窗口和移除条件 | 同步实施和运维 |
| 移除配置项 | 是,若移除 runtime config 字段 | 先回写 03,再更新 04 | 同步所有下游 |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 首版配置基线 | 无 | 无回写 |
| 新增 / 移除 runtime config 字段必须先回写 03 | 否 | 规则声明 | 无 | 无回写 |
| remote config / hot reload 后续需回写 03 | 否 | 演进规则 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §13 应说明当前是首版配置基线,无已发布旧配置迁移项。未来新增、废弃或移除配置必须根据是否改变 `ProcessRuntimeConfig`、runtime builder、adapter constructor、trait、error、DTO 或函数流判断是否先回写 `03`。remote config 和 hot reload 是 P2 演进,当前不得实现。

## 7. 待确认事项

- 无阻塞 Step 14 的待确认事项。
- future production adapter fields 需要在实施或运维阶段重新打开配置设计。

## 8. 进入下一步条件

- 当前迁移状态明确。
- 未来演进规则明确。
- 详细设计影响判定为无回写。
