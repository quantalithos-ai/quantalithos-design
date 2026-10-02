# 04 Step 8：定义敏感配置与密钥管理

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步仅定义secret reference边界和provider行为，不选择具体供应商、不填写凭据、不新增`RuntimeConfig`字段。

## 2. 本步目标

**目标**：将普通运行参数、敏感引用和真实秘密材料分层，闭合存储、读取、轮换、审计和禁止输出规则。

### 本步输入

Step4敏感分类、Step5来源规则、Step7配置项清单、03§3/§13/§14的redaction与adapter边界。

### 本步输出

敏感级别表、ref解析流程、轮换与审计规则、禁止输出表，回填正式04§8。

## 3. 应问的问题与SOP回答

1. **哪些项是敏感的？** `storage.postgres_config_ref`、`sdk.profile_ref`和八个owner `configuration_ref`本身是sensitive reference；provider返回的DSN、password、token、private key等是真实`secret`，不进入JSON或RuntimeConfig。
2. **是否有独立cursor/TLS key配置？** 当前03七字段没有独立cursor key、TLS private key或auth token字段；不得在04私造第八字段。若未来需要，必须先回写03并重开04。
3. **谁读取秘密？** 只有infra loader/adapter builder通过正式provider按ref读取；contracts/domain/application/Web不读文件、env、provider或raw secret。
4. **如何轮换？** 通过provider版本和受控重启/重新装配轮换；旧版本兼容窗口由provider和owner合同决定，不能在Marketplace配置里伪造。
5. **如何审计？** 只记录引用类型、slot、profile、revision/结果和redacted错误类别，不记录secret、完整ref、DSN、body或凭据。

## 4. 当前材料问题诊断与取舍

draft和原型没有安全配置语义；把DSN或token直接放在环境变量会使Web、日志或错误链泄露。采用“普通JSON仅保存opaque ref、provider内解引用、内存最小暴露、统一redaction”的方案。provider名称、轮换API、KMS/Vault实现和TLS/auth合同尚未闭合，作为风险而不是伪造依赖。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| raw DSN/token可能进入环境或日志 | 普通JSON只存opaque ref，raw secret仅provider内部 |
| secret轮换和输出边界不明 | 受控重启轮换，日志/DTO/Web统一禁止输出 |
| 未来密钥字段容易静默新增 | 当前不新增cursor/TLS/auth字段，变化须重开03/04 |

## 5. 敏感级别与存储边界

| 级别 | 含义 | Marketplace示例 | 存储/传递规则 | 审计与日志 |
|---|---|---|---|---|
| `public` | 可公开展示且不影响运行权限 | locale值、公开分类标签（若进入配置则仍受schema） | 可进入严格JSON | 可记录有限枚举 |
| `internal` | 内部运行参数 | bind、batch、lease、profile名称 | JSON快照，不能进Web bundle或公开API | 仅记录键名/结果 |
| `sensitive` | 暴露会带来运营或连接风险 | `postgres_config_ref`、SDK/owner ref | 只保留opaque ref；provider受控读取 | 不记录完整ref/value |
| `secret` | 真实秘密材料 | raw DSN、password、token、private key | 不进入普通JSON、CLI、Web、RuntimeConfig或domain | 永不输出；失败只记分类 |

`configuration_ref`可以是URI形状的opaque字符串，但URI不代表provider已存在，也不证明slot已Bound。引用的可见文本仍按sensitive处理，日志需截断或分类化。

## 6. 解析、使用和轮换流程

```text
[strict JSON contains opaque ref]
                |
                v
        [loader schema check]
                |
                v
 [infra provider resolves ref by approved identity]
                |
                v
 [typed resource kept inside adapter/builder scope]
                |
                v
 [RuntimeConfig + validated ports; domain sees no raw secret]
```

图示说明：

- JSON只表达ref，不表达secret值、provider凭据或owner正文。
- provider失败不能用空字符串、公共默认值或fake凭据补齐。
- 轮换采用新快照/受控重启；不热替换业务状态、audit、cursor或operation。
- 图不表达部署命令或密钥供应商的事实，具体provider待确认。

| 场景 | 规则 | 失败策略 |
|---|---|---|
| ref为空、格式非法或指向错误profile | schema/typed validation拒绝 | 相关配置快照fail-fast |
| provider不可达 | 不缓存明文、不重试到无界；按依赖等级处理 | PG关键依赖拒装配；owner/SDK slot Blocked |
| provider返回过期/不兼容版本 | 不自动降级到未知版本 | 相关adapter Unavailable/Blocked |
| 密钥轮换 | 新ref或provider版本经校验后重启装配 | 新版本失败保留旧已验证快照；不回滚业务truth |
| 旧密钥兼容窗口结束 | 由provider/owner合同确认后撤销 | 旧token无法解码时安全Unavailable，不明文降级 |
| secret进入日志/错误 | redaction拦截，记录有限错误类别 | 视为安全缺陷，禁止继续发布 |

## 7. 禁止输出与访问边界

| 表面 | 禁止内容 | 允许内容 |
|---|---|---|
| API/Web DTO | DSN、token、provider ref、owner凭据 | 有界能力状态、不可用原因类别、locale |
| 日志/trace/metric | raw value、完整ref、URL query、响应body、actor secret | 有限slot、阶段、结果、错误code |
| 配置审计 | secret/value/body、密钥材料 | profile、域、slot、版本化结果、redacted摘要 |
| CLI/process | secret argv、shell history中的raw凭据 | 配置文件路径选择器 |
| domain/application | 文件/env/provider读取 | 已校验的typed ports和资源句柄 |
| Web bundle | DB、SDK profile、owner endpoint、任何credential | build-time公共API base、En/Zh资源 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 仅保存opaque ref，provider内解析raw secret | 否 | 敏感级别与读取边界 | 03§13/§14已有 | 无回写 |
| 不新增cursor/TLS/auth字段 | 否 | 字段闭合 | 03§13七字段约束 | 无回写 |
| 轮换走新快照/重启，不启hot secret reload | 否 | 生效/失败策略 | 03§13已有startup边界 | 无回写 |

## 9. 回填草稿、待确认与进入下一步条件

正式§8回填敏感级别、ref流程、轮换和禁止输出表；不写provider名称、真实secret、KMS路径或轮换结果。待确认事项：secret provider正式合同、rotation兼容窗口、TLS/auth owner和外部凭据生命周期，进入Step14；这些不阻塞配置语义装配，但会阻塞positive运行。

进入Step9条件：每个sensitive项都有存储、读取、轮换、审计和失败策略；没有raw secret进入正式JSON、RuntimeConfig或Web bundle。
