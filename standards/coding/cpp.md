# Google C++ 编码规范（中文版 + 正误示例）

> 来源：[Google 开源项目风格指南 - C++](https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/)
> 本文档参考原始指南整理，并为主要规则补充了**正确做法 ✅**与**错误做法 ❌**的对照示例。
> 默认目标版本以 **C++20** 为基础；除特别说明外，**禁止使用非标准扩展**。

---

## 一、C++ 语言与工程规范

---

### 1. C++ 版本与编译器扩展

> **规则：以项目约定的标准版本为准，默认按 C++20 编写，禁止依赖非标准扩展**

如果项目目标版本是 `C++20`，就不要提前使用 `C++23` 特性。可移植性优先于“抢先体验”。诸如 `#pragma once`、编译器私有关键字、平台专属语法糖，都应谨慎甚至避免使用。

✅ **正确做法**

```cpp
#include <span>
#include <string_view>

std::string_view GetName(std::span<const char> buffer) {
  return std::string_view(buffer.data(), buffer.size());
}
```

❌ **错误做法**

```cpp
// 依赖更新标准或编译器私有扩展，导致构建环境不一致。
#if __cplusplus > 202002L
import std;  // ❌ 若项目还未统一支持模块，则不应使用。
#endif

#pragma once  // ❌ Google 风格更强调使用传统 include guard。
```

---

### 2. 头文件必须自给自足

> **规则：头文件应能被独立包含并独立编译**

头文件必须自行包含其所依赖的声明，不应要求使用者“先 include 另一个头”才能正常工作。模板、内联函数如果在头文件中声明，通常也必须在头文件中提供定义。

✅ **正确做法**

```cpp
#ifndef PROJECT_NET_HTTP_CLIENT_H_
#define PROJECT_NET_HTTP_CLIENT_H_

#include <string>
#include <vector>

class HttpClient {
 public:
  std::string Get(const std::string& url) const;
  std::vector<std::string> BatchGet(const std::vector<std::string>& urls) const;
};

#endif  // PROJECT_NET_HTTP_CLIENT_H_
```

❌ **错误做法**

```cpp
// user.h
#ifndef PROJECT_USER_USER_H_
#define PROJECT_USER_USER_H_

class User {
 public:
  std::string name() const;  // ❌ 这里使用了 std::string，却没有 include <string>
};

#endif  // PROJECT_USER_USER_H_
```

---

### 3. 所有头文件都使用防护符

> **规则：使用基于项目路径的 include guard，避免重复包含**

防护符通常基于“项目名 + 路径 + 文件名”生成，统一使用全大写加下划线，并以 `_H_` 结尾。

✅ **正确做法**

```cpp
#ifndef PROJECT_STORAGE_CACHE_LRU_CACHE_H_
#define PROJECT_STORAGE_CACHE_LRU_CACHE_H_

class LruCache {
 public:
  void Clear();
};

#endif  // PROJECT_STORAGE_CACHE_LRU_CACHE_H_
```

❌ **错误做法**

```cpp
#ifndef CACHE_H_  // ❌ 过于宽泛，容易冲突
#define CACHE_H_

class LruCache {};

#endif
```

---

### 4. Include What You Use，谨慎使用前向声明

> **规则：直接包含你实际依赖的头文件，尽量避免用前向声明替代真实依赖**

如果当前文件使用了某个符号，就应直接包含其定义所在的头文件。前向声明虽然能减少编译量，但也会隐藏真实依赖，并可能在 API 变化后悄悄出错。

✅ **正确做法**

```cpp
#include "project/model/order.h"

class OrderPrinter {
 public:
  void Print(const Order& order);
};
```

```cpp
#include "project/model/order.h"

void OrderPrinter::Print(const Order& order) {
  // 直接使用 Order 的完整定义。
}
```

❌ **错误做法**

```cpp
class Order;  // ❌ 为了省 include 盲目前向声明

class OrderPrinter {
 public:
  void Print(const Order& order);
};

// 之后如果需要访问 Order 的成员，就会被迫补 include，
// 且调用语义还可能因为不完整类型而改变。
```

---

### 5. `#include` 路径与顺序要统一

> **规则：路径相对项目源码根目录，分组排序，组间空行**

推荐顺序：
1. 配套头文件
2. C 系统头
3. C++ 标准库头
4. 第三方库头
5. 本项目其他头

每组内部按字母序排序，不使用 `.` 或 `..` 形式的相对路径。

✅ **正确做法**

```cpp
#include "project/service/user_service.h"

#include <sys/types.h>
#include <unistd.h>

#include <string>
#include <vector>

#include "absl/strings/string_view.h"

#include "project/model/user.h"
#include "project/storage/user_repo.h"
```

❌ **错误做法**

```cpp
#include "../model/user.h"           // ❌ 使用 ..
#include <vector>
#include "project/service/user_service.h"  // ❌ 配套头不在最前面
#include <unistd.h>
#include "absl/strings/string_view.h"
#include <string>
```

---

### 6. 使用命名空间，避免污染全局作用域

> **规则：除少数特殊情况外，代码应位于命名空间内；禁止 `using namespace`**

命名空间用于隔离符号，防止冲突。头文件中不应随意暴露命名空间别名；更不应使用 `using namespace foo;` 把整个命名空间导入当前作用域。

✅ **正确做法**

```cpp
namespace project::auth {

class TokenVerifier {
 public:
  bool Verify(const std::string& token) const;
};

}  // namespace project::auth
```

```cpp
namespace project::auth {

void LogResult() {
  using ::std::string;
  string message = "ok";  // 局部 using 声明可接受
}

}  // namespace project::auth
```

❌ **错误做法**

```cpp
using namespace std;  // ❌ 污染当前作用域
using namespace project::auth;  // ❌ 头文件中尤其禁止

class TokenVerifier {
 public:
  bool Verify(const string& token) const;
};
```

---

### 7. `.cc` 内部实现使用内部链接

> **规则：仅供当前 `.cc` 使用的符号，放进匿名命名空间或声明为 `static`**

不要把只在一个实现文件内使用的辅助函数暴露成全局符号；但也不要在头文件中使用匿名命名空间或 `static` 来制造多个副本。

✅ **正确做法**

```cpp
namespace {

bool IsExpired(int64_t now_ms, int64_t deadline_ms) {
  return now_ms > deadline_ms;
}

}  // namespace

void SessionCleaner::Clean() {
  if (IsExpired(NowMs(), deadline_ms_)) {
    RemoveExpiredSession();
  }
}
```

❌ **错误做法**

```cpp
// util.h
static bool IsExpired(int64_t now_ms, int64_t deadline_ms) {  // ❌ 头文件中 static
  return now_ms > deadline_ms;
}
```

---

### 8. 缩小局部变量作用域，并在声明时初始化

> **规则：变量越晚声明越好，声明时就初始化**

这样读者更容易理解变量的类型、初值和用途，也能减少“先声明后赋值”造成的状态不清晰问题。

✅ **正确做法**

```cpp
void Process(const std::vector<int>& values) {
  const int total = values.size();
  for (int i = 0; i < total; ++i) {
    const int current = values[i];
    Consume(current);
  }
}
```

❌ **错误做法**

```cpp
void Process(const std::vector<int>& values) {
  int total;
  int current;
  total = values.size();  // ❌ 声明与初始化分离
  for (int i = 0; i < total; i++) {
    current = values[i];
    Consume(current);
  }
}
```

---

### 9. 静态、全局与 `thread_local` 变量要极度谨慎

> **规则：避免复杂的静态存储期对象；`thread_local` 只能用编译期常量初始化的全局形式**

静态对象的初始化和析构顺序复杂，容易引入跨编译单元依赖、析构期访问悬垂对象等问题。若必须使用：
- 优先使用真正常量
- 优先函数内局部静态，而非命名空间级动态初始化对象
- `thread_local` 全局变量必须可由编译期常量初始化

✅ **正确做法**

```cpp
constexpr int kMaxRetryCount = 3;

int GetConnectionLimit() {
  static const int* limit = new int(128);  // 生命周期覆盖整个进程
  return *limit;
}
```

```cpp
ABSL_CONST_INIT thread_local int tls_request_id = 0;
```

❌ **错误做法**

```cpp
std::string g_service_name = ComputeServiceName();  // ❌ 动态初始化全局对象
std::map<int, int> g_cache = {{1, 2}};             // ❌ 非平凡析构全局对象
thread_local std::string tls_user = LoadUser();    // ❌ 动态初始化 thread_local
```

---

### 10. 构造函数中不要做易失败逻辑，也不要调用虚函数

> **规则：构造函数只做可靠初始化；不要在构造中调用虚函数**

构造函数很难表达失败，且对象尚未完全构建完成。若初始化可能失败，优先考虑工厂函数或显式 `Init()` 阶段。

✅ **正确做法**

```cpp
class ConfigLoader {
 public:
  static std::unique_ptr<ConfigLoader> Create(const std::string& path) {
    auto loader = std::unique_ptr<ConfigLoader>(new ConfigLoader(path));
    if (!loader->Init()) {
      return nullptr;
    }
    return loader;
  }

 private:
  explicit ConfigLoader(const std::string& path) : path_(path) {}

  bool Init() {
    return ReadFile(path_, &content_);
  }

  std::string path_;
  std::string content_;
};
```

❌ **错误做法**

```cpp
class Base {
 public:
  Base() { Initialize(); }  // ❌ 构造函数中调用虚函数
  virtual void Initialize() = 0;
};

class ConfigLoader {
 public:
  ConfigLoader() {
    ConnectRemoteServer();  // ❌ 易失败逻辑放在构造函数中
    ParseConfig();
  }
};
```

---

### 11. 单参数构造函数和类型转换运算符要用 `explicit`

> **规则：禁止隐式类型转换，除非语义极其明确且确有必要**

隐式转换会隐藏真实类型，增加重载解析的复杂度。普通单参数构造函数和自定义转换运算符都应标记为 `explicit`。

✅ **正确做法**

```cpp
class UserId {
 public:
  explicit UserId(int value) : value_(value) {}

 private:
  int value_;
};

void Process(UserId id);

Process(UserId(42));
```

❌ **错误做法**

```cpp
class UserId {
 public:
  UserId(int value) : value_(value) {}  // ❌ 允许 int 隐式转 UserId

 private:
  int value_;
};

void Process(UserId id);

Process(42);  // ❌ 调用点看不出发生了隐式转换
```

---

### 12. 明确声明类的拷贝/移动语义

> **规则：类的公有接口必须明确它是可拷贝、仅可移动，还是都不允许**

如果类型可拷贝，就显式 `= default`；如果只允许移动或完全禁止，则用 `= delete` 明确表达意图。

✅ **正确做法**

```cpp
class CopyableConfig {
 public:
  CopyableConfig(const CopyableConfig&) = default;
  CopyableConfig& operator=(const CopyableConfig&) = default;
};

class MoveOnlyHandle {
 public:
  MoveOnlyHandle(MoveOnlyHandle&&) = default;
  MoveOnlyHandle& operator=(MoveOnlyHandle&&) = default;

  MoveOnlyHandle(const MoveOnlyHandle&) = delete;
  MoveOnlyHandle& operator=(const MoveOnlyHandle&) = delete;
};
```

❌ **错误做法**

```cpp
class FileLock {
 public:
  FileLock() = default;
  // ❌ 既没显式声明复制/移动语义，也没有禁止复制
  // 读者无法快速判断这个类型是否应该被拷贝。
};
```

---

### 13. `struct` 只用于被动数据，其他情况使用 `class`

> **规则：只有纯数据对象、无复杂不变式约束时才使用 `struct`**

如果对象有封装、约束、行为语义、可见性控制需求，应使用 `class`。

✅ **正确做法**

```cpp
struct Point {
  int x;
  int y;
};

class Account {
 public:
  void Deposit(int amount);
  int balance() const { return balance_; }

 private:
  int balance_ = 0;
};
```

❌ **错误做法**

```cpp
struct Account {  // ❌ 有明显业务约束和行为，却暴露所有状态
  int balance;

  void Deposit(int amount) {
    balance += amount;
  }
};
```

---

### 14. 组合优于继承，继承优先表达 “is-a”

> **规则：优先使用组合；必须继承时，使用 `public` 继承并明确 `override`**

实现复用并不一定等于继承。若只是“用到某个对象”，通常应组合而不是继承。重写虚函数时显式使用 `override`，不再重复写 `virtual`。

✅ **正确做法**

```cpp
class Engine {
 public:
  void Start();
};

class Car {
 public:
  void Start() { engine_.Start(); }

 private:
  Engine engine_;
};
```

```cpp
class Shape {
 public:
  virtual ~Shape() = default;
  virtual int Area() const = 0;
};

class Rectangle final : public Shape {
 public:
  int Area() const override { return width_ * height_; }

 private:
  int width_ = 0;
  int height_ = 0;
};
```

❌ **错误做法**

```cpp
class Logger {
 public:
  void Info(const std::string& message);
};

class UserService : public Logger {  // ❌ “会记录日志” 不是 “是一个 Logger”
};
```

```cpp
class Rectangle : public Shape {
 public:
  int Area() const { return width_ * height_; }  // ❌ 未显式 override

 private:
  int width_ = 0;
  int height_ = 0;
};
```

---

### 15. 运算符重载要少而清晰

> **规则：仅在语义自然、行为直观时重载运算符；禁止自定义字面量**

像 `==`、`=`、输出运算符等往往有自然语义；但不要为了“炫技”去重载不直观的运算符，更不要让重载隐藏昂贵操作。

✅ **正确做法**

```cpp
class UserId {
 public:
  explicit UserId(int value) : value_(value) {}

  friend bool operator==(const UserId& lhs, const UserId& rhs) {
    return lhs.value_ == rhs.value_;
  }

 private:
  int value_;
};
```

❌ **错误做法**

```cpp
class Query {
 public:
  Query operator|(const Query& rhs) const;  // ❌ 用 | 表示业务管道，语义不自然
};

long double operator"" _uid(unsigned long long value);  // ❌ 自定义字面量禁止
```

---

### 16. 所有权要清晰，优先 `std::unique_ptr`

> **规则：动态分配对象必须有清晰所有权；默认单一所有权，不滥用共享所有权**

如果不需要共享，就不要用 `std::shared_ptr`。若只是临时借用对象，优先传引用或裸指针，而不是传递所有权。

✅ **正确做法**

```cpp
std::unique_ptr<Foo> CreateFoo();

void UseFoo(const Foo& foo);           // 只读借用
void UpdateFoo(Foo* foo);              // 可为空或可修改借用
void ConsumeFoo(std::unique_ptr<Foo> foo);  // 明确转移所有权
```

❌ **错误做法**

```cpp
std::shared_ptr<Foo> CreateFoo();  // ❌ 默认返回 shared_ptr，会模糊所有权边界

void Process(std::shared_ptr<Foo> foo);  // ❌ 仅使用对象却强行共享所有权
```

---

### 17. 函数设计优先返回值，输出参数放后面

> **规则：优先按值返回；必要时使用引用输出参数；避免用原始指针表示非空输出**

输入参数通常用值或 `const&`，输出参数通常用非常量引用；如果输出可缺省，才考虑指针。纯输入参数应排在输出参数之前。

✅ **正确做法**

```cpp
std::string BuildPath(absl::string_view dir, absl::string_view file);

bool ParseUser(absl::string_view text, User* user);  // user 可为空时才用指针

bool SplitName(absl::string_view full_name,
               std::string* first_name,
               std::string* last_name);
```

❌ **错误做法**

```cpp
void BuildPath(const std::string& dir, const std::string& file, std::string* out);
// ❌ 明明可以直接返回 string，却强行用输出参数

void ParseUser(User& user, const std::string& text);  // ❌ 输出参数放在输入参数前
```

---

### 18. 函数应简短，重载和默认参数应克制

> **规则：优先写短函数；重载必须让调用点一眼就懂；默认参数仅在收益明显时使用**

超过约 `40` 行的函数应考虑拆分。若多个重载让读者很难判断调用的是哪一个，最好直接改函数名。

✅ **正确做法**

```cpp
void AppendString(std::string* out, absl::string_view text);
void AppendInt(std::string* out, int value);
```

```cpp
class RetryOptions {
 public:
  RetryOptions() = default;
  int max_retry = 3;
  int timeout_ms = 1000;
};

void SendRequest(const Request& request, const RetryOptions& options);
```

❌ **错误做法**

```cpp
void Append(const std::string& text);
void Append(const char* text);
void Append(int value);  // ❌ 重载太多，调用点不直观
```

```cpp
void SendRequest(const Request& request,
                 int max_retry = GetDynamicRetry(),   // ❌ 默认参数不稳定
                 int timeout_ms = 1000);
```

---

### 19. 后置返回类型仅在确有必要时使用

> **规则：普通函数使用传统写法；只有 lambda 或复杂模板推导时才使用尾置返回类型**

普通函数 `int Foo()` 更直观；复杂模板中若后置返回类型能显著提升可读性，则可以使用。

✅ **正确做法**

```cpp
int CountUsers();

auto MakeAdder(int base) -> std::function<int(int)> {
  return [base](int value) { return base + value; };
}
```

❌ **错误做法**

```cpp
auto CountUsers() -> int;  // ❌ 普通函数没必要写成尾置返回类型
```

---

### 20. 右值引用、友元与“高风险特性”要慎用

> **规则：右值引用主要用于移动语义；友元仅用于合理封装；禁止异常、RTTI、VLA 和 `alloca()`**

核心要点：
- `&&` 主要用于移动构造和移动赋值
- `friend` 可用于 builder 或测试，但不应成为绕过封装的常规手段
- 不使用 C++ 异常
- 尽量避免 RTTI
- 禁止变长数组和 `alloca()`

✅ **正确做法**

```cpp
class Buffer {
 public:
  Buffer(Buffer&& other) = default;
  Buffer& operator=(Buffer&& other) = default;

  Buffer(const Buffer&) = delete;
  Buffer& operator=(const Buffer&) = delete;
};
```

```cpp
class User {
  friend class UserBuilder;

 private:
  explicit User(std::string name) : name_(std::move(name)) {}
  std::string name_;
};
```

```cpp
std::vector<int> values(size);
```

❌ **错误做法**

```cpp
void Handle() {
  throw std::runtime_error("boom");  // ❌ Google 风格中不使用异常
}
```

```cpp
if (typeid(*base) == typeid(Derived)) {  // ❌ RTTI 不是常规方案
  ...
}
```

```cpp
int n = GetSize();
int values[n];      // ❌ VLA 禁止
char* buf = (char*)alloca(n);  // ❌ alloca() 禁止
```

---

### 21. 使用 C++ 风格 cast；流仅用于日志；迭代器优先前置 `++`

> **规则：用 `static_cast`/`const_cast`/`reinterpret_cast`；避免普通流 I/O；模板与迭代器优先 `++i`**

这些规则都服务于一个目标：让代码意图更明确，避免隐藏成本与语义歧义。

✅ **正确做法**

```cpp
int value = static_cast<int>(ratio);
const char* raw = const_cast<const char*>(buffer.data());
```

```cpp
for (auto it = users.begin(); it != users.end(); ++it) {
  Handle(*it);
}
```

```cpp
LOG(INFO) << "loaded users: " << users.size();
```

❌ **错误做法**

```cpp
int value = (int)ratio;  // ❌ C 风格 cast
```

```cpp
for (auto it = users.begin(); it != users.end(); it++) {  // ❌ 对迭代器优先 ++it
  Handle(*it);
}
```

```cpp
std::cout << "loaded users: " << users.size() << std::endl;  // ❌ 非日志场景避免流式 I/O
```

---

### 22. 善用 `const` 与 `constexpr`

> **规则：任何不会变的值、引用、方法尽量加 `const`；真正的编译期常量使用 `constexpr`**

`const` 能让接口更可信，`constexpr` 能明确表达“编译期就能确定”的真正常量。

✅ **正确做法**

```cpp
class UserStore {
 public:
  const User* FindById(int id) const;

 private:
  std::vector<User> users_;
};

constexpr int kMaxBatchSize = 1024;
```

❌ **错误做法**

```cpp
class UserStore {
 public:
  User* FindById(int id);  // ❌ 若不修改对象状态，应声明为 const 方法
};

const int kMaxBatchSize = GetConfig();  // ❌ 这不是编译期常量
```

---

### 23. 整型、无符号类型与 64 位可移植性要谨慎

> **规则：一般整数优先用 `int`；需要确定宽度时用 `int32_t`/`int64_t`；不要滥用无符号类型**

无符号整数容易与隐式提升、比较和循环逻辑结合出错。打印 64 位值时也要使用正确格式化方式。

✅ **正确做法**

```cpp
int count = 0;
int64_t total_bytes = 0;

for (int i = 0; i < items.size(); ++i) {
  Process(items[i]);
}
```

```cpp
printf("total=%" PRId64 "\n", total_bytes);
```

❌ **错误做法**

```cpp
unsigned int i;
for (i = items.size() - 1; i >= 0; --i) {  // ❌ 永远不会结束
  Process(items[i]);
}
```

```cpp
long total_bytes = GetLargeSize();  // ❌ long 在不同平台宽度不一致
```

---

### 24. 宏要非常谨慎，优先常量、枚举与内联函数

> **规则：除头文件防护、条件编译等少数场景外，尽量不要定义宏**

宏没有类型系统、没有作用域，展开后经常让调试与阅读都变差。

✅ **正确做法**

```cpp
constexpr double kPi = 3.1415926;

inline int Square(int x) {
  return x * x;
}
```

❌ **错误做法**

```cpp
#define PI 3.1415926          // ❌ 用 constexpr 更好
#define SQUARE(x) x * x       // ❌ 缺少括号，副作用风险大
#define USER_ID int           // ❌ 用宏做类型别名可读性差
```

---

### 25. 指针用 `nullptr`，空字符用 `'\0'`

> **规则：不要再用 `NULL` 或字面量 `0` 表示空指针**

`nullptr` 更类型安全，也能让读者一眼看出这是“指针为空”，不是普通整数字面量。

✅ **正确做法**

```cpp
User* user = nullptr;
char end = '\0';
```

❌ **错误做法**

```cpp
User* user = NULL;  // ❌ 老风格
User* other = 0;    // ❌ 不够清晰
char end = 0;       // ❌ 应写成 '\0'
```

---

### 26. `sizeof` 优先写变量名而不是类型名

> **规则：优先 `sizeof(var)`，让类型变化时代码自动保持正确**

这样重构变量类型时不用同步修改 `sizeof(Type)`。

✅ **正确做法**

```cpp
Record record;
memset(&record, 0, sizeof(record));
```

❌ **错误做法**

```cpp
Record record;
memset(&record, 0, sizeof(Record));  // ❌ 类型改了，这里可能忘记同步修改
```

---

### 27. `auto` 只在局部且类型清晰时使用

> **规则：`auto` 仅用于局部变量；当类型从初始化表达式能明显看出时才使用**

如果读者必须跳回几百行外才能知道类型是什么，那就不该用 `auto`。

✅ **正确做法**

```cpp
std::vector<std::string> users;
auto it = users.begin();
const auto& first_user = users.front();
```

❌ **错误做法**

```cpp
auto status = service.Lookup(key);  // ❌ 类型不明显

auto ids = {1, 2, 3};  // ❌ auto + 列表初始化容易推导成 initializer_list
```

---

### 28. 可以使用列表初始化和 lambda，但必须保持可读性

> **规则：列表初始化可用；lambda 应短小、显式且优先明确捕获**

对于会逃逸当前作用域的 lambda，优先显式写出捕获对象，避免悬垂引用。

✅ **正确做法**

```cpp
std::vector<std::string> names{"alice", "bob"};
std::map<int, std::string> code_to_name{{1, "ok"}, {2, "fail"}};
```

```cpp
Foo foo;
executor->Schedule([&foo] { Frobnicate(foo); });
```

```cpp
std::sort(values.begin(), values.end(), [](int lhs, int rhs) {
  return lhs < rhs;
});
```

❌ **错误做法**

```cpp
auto ids = {1, 2, 3};  // ❌ 容易产生误解
```

```cpp
Foo foo;
executor->Schedule([&] { Frobnicate(foo); });  // ❌ 默认引用捕获不够显式
```

```cpp
auto handler = [&, this, manager, config, user, request, response](int code) {
  // ❌ 捕获过多、体量过大，lambda 已失去可读性
  ...
};
```

---

## 二、命名与注释规范

---

### 1. 命名总则：描述性优先，少用缩写

> **规则：名称应表达真实语义，不要让读者猜**

少用项目内部黑话式缩写；允许 `i`、`j`、`T` 这类约定俗成的短名，但业务变量、类型与函数应尽量完整表达含义。

✅ **正确做法**

```cpp
int num_dns_connections = 0;
std::string customer_id;
int price_count_reader = 0;
```

❌ **错误做法**

```cpp
int n = 0;             // ❌ 含义不明
std::string cstmr_id;  // ❌ 生造缩写
int wgc = 0;           // ❌ 只有团队内部才知道是什么意思
```

---

### 2. 文件、类型、变量、常量、函数等命名规范

> **规则：遵循统一命名约定，让名字本身成为“类型提示”**

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | 全小写，推荐下划线 | `user_service.cc` |
| 头文件 | `.h` 结尾 | `user_service.h` |
| 类型名 | `CapWords` | `HttpClient` |
| 普通变量/参数 | `lower_with_under` | `retry_count` |
| 类成员变量 | `lower_with_under_` | `retry_count_` |
| 结构体成员 | `lower_with_under` | `retry_count` |
| 常量 | `kMixedCase` | `kMaxRetryCount` |
| 函数名 | `CapWords` | `BuildRequest()` |
| getter/setter | 与属性名匹配 | `count()`, `set_count()` |
| 命名空间 | 全小写 | `project::storage` |
| 枚举值 | `kEnumName` 优先 | `kTimeout` |
| 宏 | 全大写下划线 | `PROJECT_INTERNAL_FOO_H_` |

✅ **正确做法**

```cpp
class HttpRequestHandler {
 public:
  void HandleRequest();

 private:
  int retry_count_ = 0;
};

struct UserInfo {
  std::string user_name;
  int age = 0;
};

constexpr int kDefaultTimeoutMs = 1000;
```

❌ **错误做法**

```cpp
class http_request_handler {};   // ❌ 类型名不用小写蛇形
int RetryCount = 0;             // ❌ 普通变量不应使用大写开头
int default_timeout = 1000;     // ❌ 常量不符合 kMixedCase
void handle_request();          // ❌ Google C++ 风格常规函数名不是 snake_case
```

---

### 3. 注释风格：解释“为什么”，不是翻译代码

> **规则：注释应补充意图、约束和背景，而不是复述显而易见的代码**

优先让代码自解释；只有当名称和结构不足以表达意图时，才用注释说明原因、边界条件、性能考虑、并发要求等。

✅ **正确做法**

```cpp
// Delay cleanup until after the callback finishes, otherwise the callback
// may observe partially-destroyed state.
CleanupAfterCallback();
```

❌ **错误做法**

```cpp
// Call CleanupAfterCallback.
CleanupAfterCallback();  // ❌ 只是把代码再说一遍
```

---

### 4. 文件、类、函数和变量注释要写在最有价值的位置

> **规则：声明处说明用途，定义处说明实现；成员变量和全局变量在必要时解释含义与约束**

核心要点：
- 文件注释说明该文件包含什么，不在 `.h` 与 `.cc` 之间重复复制
- 类注释说明用途、使用方式、线程安全约束
- 函数声明注释说明输入、输出、所有权、性能风险
- 函数定义注释说明实现技巧，而不是复制接口注释
- 对带哨兵值的成员变量应补充注释

✅ **正确做法**

```cpp
// Iterates over all active sessions in creation order.
// Not thread-safe.
class SessionIterator {
 public:
  // Returns true if there are more sessions to visit.
  bool HasNext() const;
};
```

```cpp
class SessionTable {
 private:
  // -1 means the table size has not been loaded yet.
  int num_total_entries_ = -1;
};
```

❌ **错误做法**

```cpp
class SessionIterator {
 public:
  bool HasNext() const;  // ❌ 对非显而易见接口没有任何说明
};
```

```cpp
// Increase i by one.
++i;  // ❌ 翻译代码而非解释意图
```

---

### 5. TODO 与 DEPRECATED 注释使用标准格式

> **规则：临时方案写 `TODO(标识): ...`；弃用接口写 `DEPRECATED(标识): ...` 并给迁移指引**

注释要可追踪、可搜索、可行动。

✅ **正确做法**

```cpp
// TODO(alice): Replace linear scan with binary search after the input is sorted.
// DEPRECATED(bob): Use BuildRequestV2() instead. Remove after all callers migrate.
```

❌ **错误做法**

```cpp
// TODO: later          // ❌ 缺少责任人/标识
// XXX                  // ❌ 无说明
// deprecated           // ❌ 不规范，也没有迁移建议
```

---

## 三、C++ 格式规范

---

### 1. 行宽与编码

> **规则：代码行宽不超过 80；尽量避免非 ASCII 字符，确需使用时统一用 UTF-8**

注释中的 URL、长路径、头文件防护符可适当超过 `80` 列，但普通代码应控制长度。

✅ **正确做法**

```cpp
if (request.IsCritical() &&
    request.retry_count() > kMaxRetryCount) {
  Reject(request);
}
```

❌ **错误做法**

```cpp
if (request.IsCritical() && request.retry_count() > kMaxRetryCount && request.user().region() == "east-1" && request.metadata().priority() > 10) { Reject(request); }  // ❌ 过长
```

---

### 2. 缩进只用空格，每层 2 个空格

> **规则：禁止 tab，统一使用空格缩进**

✅ **正确做法**

```cpp
if (ready) {
  Run();
}
```

❌ **错误做法**

```cpp
if (ready) {
	Run();  // ❌ tab
}
```

---

### 3. 函数声明与定义格式要稳定统一

> **规则：返回类型与函数名尽量同行；左括号紧跟函数名；左大括号不另起一行**

参数放不下时，要么与首参数对齐，要么整体换行并缩进四格。

✅ **正确做法**

```cpp
ReturnType ClassName::FunctionName(Type arg1, Type arg2) {
  DoSomething();
}
```

```cpp
ReturnType LongClassName::VeryLongFunctionName(
    Type arg1, Type arg2, Type arg3) {
  DoSomething();
}
```

❌ **错误做法**

```cpp
ReturnType ClassName::FunctionName (Type arg1, Type arg2)
{
  DoSomething();
}  // ❌ 函数名和 ( 之间有空格，{ 另起一行
```

---

### 4. Lambda 与函数调用的换行方式应和普通函数一致

> **规则：调用要么一行写完，要么按参数结构清晰换行；lambda 捕获列表紧凑清晰**

✅ **正确做法**

```cpp
DoSomething(argument1, argument2, argument3);
```

```cpp
DoSomething(
    argument1, argument2,
    argument3, argument4);
```

```cpp
std::sort(values.begin(), values.end(), [&weight](int lhs, int rhs) {
  return lhs * weight < rhs * weight;
});
```

❌ **错误做法**

```cpp
DoSomething(argument1,
argument2,
        argument3);  // ❌ 缩进混乱
```

```cpp
auto fn = [ & weight ] ( int x ) { return x * weight; };  // ❌ 空格风格混乱
```

---

### 5. 列表初始化格式按函数调用来处理

> **规则：`{}` 的断行和缩进遵循与函数调用相同的思路**

✅ **正确做法**

```cpp
std::vector<int> values{1, 2, 3};
```

```cpp
SomeType value{
    first, second,
    third, fourth};
```

❌ **错误做法**

```cpp
SomeType value{first,
second,
          third};  // ❌ 换行和缩进不一致
```

---

### 6. 条件语句格式保持一致

> **规则：`if`/`else` 关键字后加空格；圆括号与条件之间通常不加额外空格；分支风格保持一致**

短单行分支只在极简单且没有 `else` 时使用。一旦某个分支用了大括号，其他分支也必须使用。

✅ **正确做法**

```cpp
if (condition) {
  Handle();
} else {
  Recover();
}
```

```cpp
if (x == kFoo) return BuildFoo();
```

❌ **错误做法**

```cpp
if(condition){  // ❌ 缺空格
  Handle();
}
```

```cpp
if (condition) {
  Handle();
} else
  Recover();  // ❌ 一边有括号一边没有
```

---

### 7. 循环、`switch` 与空循环体要写清楚

> **规则：`switch` 可用大括号包住 case 块；空循环体用 `{}` 或 `continue`，不要裸分号**

✅ **正确做法**

```cpp
switch (state) {
  case kInit: {
    Init();
    break;
  }
  case kRunning: {
    Run();
    break;
  }
  default: {
    LOG(FATAL) << "unexpected state";
  }
}
```

```cpp
while (condition) {
}
```

❌ **错误做法**

```cpp
while (condition);  // ❌ 很像误写
```

```cpp
switch (state) {
case kInit:
Init();  // ❌ 缩进混乱
break;
}
```

---

### 8. 指针/引用表达式与布尔表达式要整洁

> **规则：`.` / `->` 前后不留空格；`*` / `&` 不要两边都留空格；长布尔表达式统一换行**

✅ **正确做法**

```cpp
x = *ptr;
ptr = &x;
value = node->value;
```

```cpp
if (is_ready &&
    has_permission &&
    !is_expired) {
  Proceed();
}
```

❌ **错误做法**

```cpp
value = node -> value;   // ❌ -> 两边有空格
char * ptr;              // ❌ * 两边都有空格
```

```cpp
if (is_ready && has_permission
&& !is_expired) {  // ❌ 换行风格不统一
  Proceed();
}
```

---

### 9. `return`、初始化与预处理指令写法要规范

> **规则：`return` 不加多余括号；初始化风格在文件内保持一致；预处理指令从行首开始**

✅ **正确做法**

```cpp
return result;
return (lhs && rhs);  // 复杂表达式可加括号增强可读性
```

```cpp
int x = 3;
std::string name{"alice"};
```

```cpp
#if defined(PROJECT_ENABLE_CACHE)
EnableCache();
#endif
```

❌ **错误做法**

```cpp
return(result);  // ❌ return 不是函数
return (value);  // ❌ 简单值不需要括号
```

```cpp
  #if defined(PROJECT_ENABLE_CACHE)  // ❌ 预处理指令不应缩进
EnableCache();
  #endif
```

---

### 10. 类格式、构造函数初始化列表与命名空间格式要统一

> **规则：访问控制顺序 `public` → `protected` → `private`；关键词缩进 1 个空格；命名空间内容不额外缩进**

✅ **正确做法**

```cpp
class UserService : public BaseService {
 public:
  UserService() = default;
  explicit UserService(int timeout_ms);

  void Run();

 private:
  int timeout_ms_ = 0;
};
```

```cpp
UserService::UserService(int timeout_ms)
    : timeout_ms_(timeout_ms) {}
```

```cpp
namespace project::storage {

void Save() {
  Flush();
}

}  // namespace project::storage
```

❌ **错误做法**

```cpp
class UserService {
private:   // ❌ private 放在 public 前面
 public:
  UserService(int timeout_ms)
      : timeout_ms_(timeout_ms),
timeout_retry_(3) {}  // ❌ 初始化列表缩进混乱
};
```

```cpp
namespace project::storage {
  void Save() {  // ❌ 命名空间内容额外缩进
    Flush();
  }
}
```

---

### 11. 水平与垂直留白越少越好，但要有边界感

> **规则：避免行尾空格；不要滥用空行；同类代码块适当紧凑，逻辑分段适当留白**

✅ **正确做法**

```cpp
void Process() {
  Validate();
  Normalize();

  Execute();
  Commit();
}
```

❌ **错误做法**

```cpp
void Process() {


  Validate();

  Normalize();


  Execute();

}
```

---

## 四、规则特例

---

### 1. 修改历史代码时，局部一致性优先

> **规则：改动旧代码时，可在局部范围内尊重原有风格，但新代码不应继续扩散坏风格**

✅ **正确做法**

```cpp
// 在一个旧文件里做小修复时，保留其已有的括号或空格风格，
// 同时避免引入更大的风格混乱。
```

❌ **错误做法**

```cpp
// 在同一个旧文件里半数代码按旧风格，半数代码按新风格，
// 导致文件内部出现两套规则并存。
```

---

### 2. Windows 代码是少数例外，但也要尽量贴近统一风格

> **规则：即使在 Windows 平台，也尽量维持 Google C++ 风格；不得已的特例应局部化**

核心要点：
- 不使用匈牙利命名法
- 仍使用 `.cc` / `.h`
- 不使用 `#pragma once`
- 尽量通过宏隔离 `__declspec(...)`
- 与 COM / ATL / WTL 交互时，少数规则可以局部豁免

✅ **正确做法**

```cpp
#ifdef _WIN32
#define PROJECT_EXPORT __declspec(dllexport)
#else
#define PROJECT_EXPORT
#endif

class PROJECT_EXPORT WinAdapter {
 public:
  void Initialize();
};
```

❌ **错误做法**

```cpp
class CUserMgr {  // ❌ 匈牙利命名法
 public:
  void Init();
};

#pragma once  // ❌ 与统一头文件策略不一致
```

---

## 五、临别赠言

> **请保持代码的一致性和可读性！**
>
> 风格指南的目标不是把代码写得“更像规定”，而是让代码更容易被理解、维护、调试与重构。真正重要的不是某一条格式细节本身，而是整个项目的可读性、一致性和工程稳定性。
>
> 当规则没有覆盖到具体场景时，请优先考虑：**读者是否容易理解、接口是否表达清晰、长期维护成本是否更低**。

---

## 参考资源

| 资源 | 链接 |
|------|------|
| Google Style Guide 英文原版 | https://github.com/google/styleguide |
| Google C++ 风格指南（中文版） | https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/ |
| C++ 参考文档 | https://en.cppreference.com/ |
| cpplint | https://github.com/google/styleguide/tree/gh-pages/cpplint |
| clang-format | https://clang.llvm.org/docs/ClangFormat.html |
| Abseil C++ Tips | https://abseil.io/tips/ |
