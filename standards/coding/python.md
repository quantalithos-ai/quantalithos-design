# Google Python 编码规范（中文版 + 正误示例）

> 来源：[Google 开源项目风格指南 - Python](https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/contents.html)
> 本文档在原文基础上，为每条规则补充了**正确做法 ✅** 与**错误做法 ❌** 的对照示例。

---

## 一、Python 语言规范

---

### 1. Lint（代码检查）

> **规则：一定要用 pylint 检查代码**

使用 [pylintrc](https://google.github.io/styleguide/pylintrc) 运行 pylint。抑制不恰当的警告，以免其他问题被淹没。

✅ **正确做法**

```python
# 用行注释抑制有理由的警告，并附上原因
def do_PUT(self):  # WSGI 接口名, 所以 pylint: disable=invalid-name
    ...

# 未使用的参数：在函数体开头用 del 删除并注释
def viking_cafe_order(spam: str, beans: str, eggs: str | None = None) -> str:
    del beans, eggs  # 未被维京人使用.
    return spam + spam + spam
```

❌ **错误做法**

```python
# 全局禁用 pylint 或完全忽略警告
# pylint: disable=all

# 未使用的参数留在函数签名中不做处理
def viking_cafe_order(spam, beans, eggs=None):
    return spam + spam + spam  # beans 和 eggs 从未使用
```

---

### 2. 导入（Import）

> **规则：只导入包和模块，不单独导入函数或类**

| 导入方式 | 说明 |
|---------|------|
| `import x` | 导入包/模块 |
| `from x import y` | y 是不带前缀的模块名 |
| `from x import y as z` | 有命名冲突或名称过长时使用，z 必须是标准缩写 |

**禁止使用相对包名**，即使模块在同一个包中也要用完整包名。

例外：`typing`、`collections.abc`、`typing_extensions`、`six.moves`。

✅ **正确做法**

```python
import absl.flags
from absl import flags
from doctor.who import jodie
from sound.effects import echo

echo.EchoFilter(input, output, delay=0.7, atten=4)

# 标准缩写
import numpy as np
```

❌ **错误做法**

```python
# 单独导入函数或类
from os.path import join  # ❌ 应该 import os.path, 然后用 os.path.join

# 使用相对包名
from . import echo  # ❌ 应该用完整包名 from sound.effects import echo

# 非标准缩写
import numpy as n  # ❌ 标准缩写是 np
```

---

### 3. 包（Package）

> **规则：使用每个模块的完整路径名来导入模块**

不要臆测 `sys.path` 包含主程序所在目录。

✅ **正确做法**

```python
# 引用完整名称
import absl.flags
from doctor.who import jodie

_FOO = absl.flags.DEFINE_string(...)
```

```python
# 仅引用模块名（常见情况）
from absl import flags
from doctor.who import jodie

_FOO = flags.DEFINE_string(...)
```

❌ **错误做法**

```python
# 没有清晰地表达作者想要导入的模块和最终导入的模块
# 实际导入的模块取决于由外部环境控制的 sys.path
import jodie  # ❌ 到底是哪个 jodie?
```

---

### 4. 异常（Exception）

> **规则：允许使用异常，但必须谨慎使用**

核心要点：
1. 优先使用内置异常类（如 `ValueError`）
2. 不要用 `assert` 验证公开 API 的参数值，应用 `raise`
3. 永远不要使用 `except:` 捕获所有异常
4. 最小化 `try/except` 代码块中的代码量
5. 用 `finally` 清理资源

✅ **正确做法**

```python
def connect_to_next_port(self, minimum: int) -> int:
    """连接到下一个可用的端口."""
    if minimum < 1024:
        # 公开 API 参数校验用 raise，不用 assert
        raise ValueError(f'最小端口号至少为 1024，不能是 {minimum}.')
    port = self._find_next_open_port(minimum)
    if port is None:
        raise ConnectionError(
            f'未能通过 {minimum} 或更高的端口号连接到服务.')
    # assert 用于保证内部正确性
    assert port >= minimum, (
        f'意外的端口号 {port}, 端口号不应小于 {minimum}.')
    return port
```

```python
# 自定义异常：继承已有异常类，以 Error 为后缀
class MyModuleError(Exception):
    """MyModule 的基础异常."""

class DataParseError(MyModuleError):
    """数据解析失败."""
```

```python
# finally 用于清理资源
f = open('data.txt')
try:
    process(f)
finally:
    f.close()
```

❌ **错误做法**

```python
def connect_to_next_port(self, minimum: int) -> int:
    assert minimum >= 1024, '最小端口号至少为 1024.'  # ❌ 公开 API 不应用 assert
    port = self._find_next_open_port(minimum)
    assert port is not None  # ❌ 应该用 raise 抛出明确的异常
    return port
```

```python
# 裸捕获：捕获所有异常
try:
    do_something()
except:  # ❌ 会捕获一切，包括 Ctrl+C、sys.exit()、拼写错误等
    pass
```

```python
# try 范围过大
try:
    connect()
    parse_data()    # ❌ parse_data 的异常也被吞了
    write_result()  # ❌ write_result 的异常也被吞了
except IOError:
    log_error()
```

---

### 5. 全局变量

> **规则：避免全局变量**

特殊情况需要时：名称前加 `_` 表示内部状态，外部访问通过公有函数。鼓励使用模块级常量（全大写 + 下划线）。

✅ **正确做法**

```python
# 模块级常量
_MAX_HOLY_HANDGRENADE_COUNT = 3          # 内部常量
SIR_LANCELOTS_FAVORITE_COLOR = "blue"    # 公开 API 常量

# 需要的全局状态通过函数访问
_db_connection = None

def get_db_connection():
    """获取数据库连接."""
    global _db_connection
    if _db_connection is None:
        _db_connection = create_connection()
    return _db_connection
```

❌ **错误做法**

```python
# 裸全局变量，无封装
db_connection = create_connection()  # ❌ 谁都可以直接修改

# 可变全局状态
cache = {}  # ❌ 无保护的共享可变状态

# 用全局变量管理连接，导致无法同时连接两个数据库
current_db = "production"  # ❌ 破坏封装
```

---

### 6. 嵌套/局部/内部类和函数

> **规则：可以谨慎使用，除非需要捕获局部变量**

不要仅仅为了隐藏函数而使用嵌套，应在模块级别定义并加 `_` 前缀。

✅ **正确做法**

```python
# 需要捕获局部变量的嵌套函数
def make_multiplier(factor: float) -> Callable[[float], float]:
    def multiply(x: float) -> float:
        return x * factor  # 捕获了 factor
    return multiply

# 仅需隐藏的函数 → 模块级别 + _ 前缀
def _internal_helper(data):
    """内部辅助函数，可通过 _ 前缀在测试中访问."""
    ...
```

❌ **错误做法**

```python
# 仅为隐藏而嵌套，且不捕获局部变量
def process_items(items):
    def _validate(item):  # ❌ 没有捕获外部变量，应放到模块级别
        return item is not None
    return [_validate(i) for i in items]

# 过深的嵌套
def outer():
    class InnerA:          # ❌ 嵌套类让外层函数膨胀
        class InnerB:      # ❌ 更深的嵌套
            pass
    pass
```

---

### 7. 推导式和生成式

> **规则：适用于简单情况，禁止多重 for 和多层过滤**

每个部分（映射表达式、for 语句、过滤表达式）不应超过一行。复杂情况用循环。

✅ **正确做法**

```python
result = [mapping_expr for value in iterable if filter_expr]

result = [{'key': value} for value in iterable if a_long_filter_expression(value)]

# 复杂情况 → 使用循环
result = []
for x in range(10):
    for y in range(5):
        if x * y > 10:
            result.append((x, y))

# 字典推导式
return {x: complicated_transform(x) for x in long_generator_function(parameter) if x is not None}

# 生成器表达式
squares_generator = (x**2 for x in range(10))

# 集合推导式
unique_names = {user.name for user in users if user is not None}
```

❌ **错误做法**

```python
# 多重 for 语句
result = [(x, y) for x in range(10) for y in range(5) if x * y > 10]  # ❌

# 映射表达式跨行
result = [complicated_transform(
    x, some_argument=x+1) for x in iterable if predicate(x)]  # ❌

# 多层过滤 + 多重 for
return ((x, y, z) for x in range(5) for y in range(5) if x != y
        for z in range(5) if y != z)  # ❌
```

---

### 8. 默认迭代器和操作符

> **规则：使用列表、字典和文件等类型的默认迭代器和操作符**

优先使用返回迭代器的方法，而非返回列表的方法。

✅ **正确做法**

```python
for key in adict: ...
if obj in alist: ...
for line in afile: ...
for k, v in adict.items(): ...      # 返回迭代器
```

❌ **错误做法**

```python
for key in adict.keys(): ...         # ❌ 不需要 .keys()
for line in afile.readlines(): ...   # ❌ 一次读取所有行到内存
```

---

### 9. 生成器（Generator）

> **规则：按需使用生成器**

文档字符串中使用 **"Yields:"** 而非 "Returns:"。大量资源占用时用上下文管理器包裹。

✅ **正确做法**

```python
def fibonacci(limit: int) -> Iterator[int]:
    """生成斐波那契数列.

    Yields:
        斐波那契数列中的整数.
    """
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b
```

❌ **错误做法**

```python
def fibonacci(limit: int) -> list[int]:
    """生成斐波那契数列.

    Returns:       # ❌ 生成器应该用 Yields
        斐波那契数列.
    """
    result = []
    a, b = 0, 1
    while a < limit:
        result.append(a)
        a, b = b, a + b
    return result  # ❌ 一次生成整个列表，浪费内存
```

---

### 10. Lambda 函数

> **规则：适用于单行函数（60-80 字符以内），超长用常规函数**

用 `operator` 模块代替常见操作的 lambda。

✅ **正确做法**

```python
# 单行 lambda
sorted(names, key=lambda x: x.lower())

# 用 operator 模块
from operator import mul
result = map(mul, range(10), range(10))  # 代替 lambda x, y: x * y

# 超长逻辑 → 定义常规函数
def sort_key(item):
    return item.last_updated.timestamp()

sorted(items, key=sort_key)
```

❌ **错误做法**

```python
# lambda 过长
sorted(names, key=lambda x: x.lower().strip().replace(' ', '_') if x else '')  # ❌

# 常见操作不用 operator
from functools import reduce
reduce(lambda x, y: x * y, numbers)  # ❌ 应该用 operator.mul
```

---

### 11. 条件表达式（三元运算符）

> **规则：适用于简单情况，每部分不超过一行**

✅ **正确做法**

```python
one_line = 'yes' if predicate(value) else 'no'

slightly_split = ('yes' if predicate(value) else 'no, nein, nyet')

the_longest_ternary_style_that_can_be_done = (
    'yes, true, affirmative, confirmed, correct'
    if predicate(value)
    else 'no, false, negative, nay')
```

❌ **错误做法**

```python
bad_line_breaking = ('yes' if predicate(value) else 'no')  # ❌ 换行位置错误

portion_too_long = ('yes' if some_long_module.some_long_predicate_function(
    really_long_variable_name) else 'no, false, negative, nay')  # ❌ 条件部分过长

# 嵌套三元运算符
result = 'a' if x > 0 else 'b' if x < 0 else 'c'  # ❌ 难以理解
```

---

### 12. 默认参数值

> **规则：默认参数不能是可变对象**

函数和方法的默认值不能是可变（mutable）对象。

✅ **正确做法**

```python
def foo(a, b=None):
    if b is None:
        b = []

def foo(a, b: Optional[Sequence] = None):
    if b is None:
        b = []

def foo(a, b: Sequence = ()):
    # 允许空元组，因为元组是不可变的
    ...
```

❌ **错误做法**

```python
def foo(a, b=[]):        # ❌ 可变默认值，多次调用间共享状态
    ...

def foo(a, b=time.time()):  # ❌ 在模块导入时求值，不是调用时
    ...

def foo(a, b: Mapping = {}):  # ❌ 可变默认值
    ...
```

---

### 13. 特性（Properties）

> **规则：用 `@property` 实现涉及简单计算或逻辑的属性，但不能仅用于获取/设置内部属性**

特性必须和属性一样满足：轻量、直白、明确。

✅ **正确做法**

```python
class Circle:
    """圆."""

    def __init__(self, radius: float):
        self.radius = radius

    @property
    def area(self) -> float:
        """计算圆的面积（简单衍生值）."""
        return 3.14159 * self.radius ** 2

    @property
    def diameter(self) -> float:
        """直径."""
        return self.radius * 2
```

❌ **错误做法**

```python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius

    @property
    def radius(self) -> float:       # ❌ 纯粹的 getter，没有计算
        return self._radius

    @radius.setter
    def radius(self, value: float):  # ❌ 纯粹的 setter，没有逻辑
        self._radius = value
    # 如果只是简单存取，应该直接使用公有属性 self.radius
```

---

### 14. True/False 的求值

> **规则：尽可能使用"隐式"假值**

核心要点：
1. 一定要用 `if foo is None:` 检测 `None` 值
2. 永远不要用 `==` 比较布尔值与 `False`
3. 利用空序列是假值的特点
4. 处理整数时要小心，可以显式比较与 0 的关系

✅ **正确做法**

```python
if not users:
    print('无用户')

if i % 10 == 0:
    self.handle_multiple_of_ten()

def f(x=None):
    if x is None:          # 正确检测 None
        x = []

if foo is not None:        # 正确区分 None 和 False
    ...
```

❌ **错误做法**

```python
if len(users) == 0:        # ❌ 应该用 if not users:
    print('无用户')

if not i % 10:             # ❌ 整数隐式求值容易出错，可能把 None 当 0
    self.handle_multiple_of_ten()

def f(x=None):
    x = x or []            # ❌ 如果传入空列表 []，也会被替换为 []

if foo == False:           # ❌ 应该用 if not foo:
    ...
if foo == None:            # ❌ 应该用 if foo is None:
    ...
```

---

### 15. 词法作用域（Lexical Scoping）

> **规则：可以使用，但要注意变量绑定陷阱**

嵌套函数可以引用外层变量，但不能对其赋值。赋值操作会让 Python 将该标识符的所有引用变为局部变量。

✅ **正确做法**

```python
def get_adder(summand1: float) -> Callable[[float], float]:
    """返回一个函数，该函数会给一个数字加上指定的值."""
    def adder(summand2: float) -> float:
        return summand1 + summand2  # 只读访问外层变量
    return adder
```

❌ **错误做法**

```python
i = 4
def foo(x: Iterable[int]):
    def bar():
        print(i, end='')  # 期望打印 4，实际打印循环中的 i
    for i in x:           # 赋值让 i 变为 foo 的局部变量，bar 中的 i 也受影响
        print(i, end='')
        bar()
# foo([1, 2, 3]) 输出 "1 2 3 3"，而非 "1 2 3 4"
```

---

### 16. 函数与方法装饰器

> **规则：仅在有显著优势时审慎使用，避免 `staticmethod`，减少 `classmethod`**

装饰器 pydoc 应清楚说明是装饰器。避免装饰器自身依赖外部资源。不得使用 `staticmethod`（除非兼容老代码）。

✅ **正确做法**

```python
# 有显著优势的装饰器：缓存、权限检查
import functools

def memoize(func):
    """缓存函数返回值的装饰器."""
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def expensive_computation(n):
    return sum(i * i for i in range(n))

# classmethod 用于具名构造函数
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_str: str) -> 'Date':
        """具名构造函数."""
        y, m, d = date_str.split('-')
        return cls(int(y), int(m), int(d))
```

❌ **错误做法**

```python
# 不必要的 staticmethod → 改为模块级函数
class MathUtils:
    @staticmethod
    def add(a, b):  # ❌ 应该直接定义为模块级函数
        return a + b

# 装饰器依赖外部资源
def requires_db(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        db = connect_to_database()  # ❌ 导入模块时可能无法连接
        ...
    return wrapper
```

---

### 17. 线程（Threading）

> **规则：不要依赖内置类型的原子性**

优先使用 `queue` 模块的 `Queue` 进行线程间数据传递。优先用条件变量和 `threading.Condition` 替代低级锁。

✅ **正确做法**

```python
import queue
import threading

# 使用 Queue 进行线程间通信
task_queue = queue.Queue()

def worker():
    while True:
        item = task_queue.get()  # 线程安全
        process(item)
        task_queue.task_done()

# 使用 threading.Condition
condition = threading.Condition()
shared_state = {}

def producer():
    with condition:
        shared_state['data'] = compute()
        condition.notify_all()
```

❌ **错误做法**

```python
# 依赖内置类型的原子性
counter = 0  # ❌ 自增 counter += 1 不是原子操作

def increment():
    global counter
    counter += 1  # ❌ 多线程下可能丢失更新

# 用低级锁而非 Condition
lock = threading.Lock()
data = None
ready = False

def consumer():
    while True:
        lock.acquire()
        if ready:         # ❌ 忙等待，应使用 Condition.wait()
            process(data)
            break
        lock.release()
```

---

### 18. 威力过大的功能

> **规则：避开这些功能**

避免使用：自定义元类、读取字节码、即时编译、动态继承、对象基类重设、导入技巧、反射（`getattr()`）、系统内部状态修改、`__del__` 自定义清理等。

✅ **正确做法**

```python
# 使用标准库中基于这些功能封装好的类
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum

@dataclass
class Point:
    x: float
    y: float

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...
```

❌ **错误做法**

```python
# 自定义元类
class MyMeta(type):
    def __new__(mcs, name, bases, dct):
        dct['magic'] = True  # ❌ 过于复杂，难以理解和调试
        return super().__new__(mcs, name, bases, dct)

# 反射滥用
obj = getattr(module, class_name)()   # ❌ 可读性差，IDE 无法分析
method = getattr(obj, method_name)()  # ❌

# __del__ 自定义清理
class Resource:
    def __del__(self):  # ❌ __del__ 的调用时机不可预测
        self.close()
```

---

### 19. 现代 Python: from \_\_future\_\_ imports

> **规则：鼓励使用 `from __future__ import` 提前使用新语法**

当不再需要支持老版本时，请自行删除这些导入语句。

✅ **正确做法**

```python
from __future__ import annotations  # 使用延迟注解求值

def greet(name: str) -> str:
    return f"Hello, {name}"
```

❌ **错误做法**

```python
# 不使用 future，在老版本上直接用新语法
def greet(name: str) -> str:   # ❌ 在 Python 3.8 以下可能报错
    return f"Hello, {name}"

# 已经支持新版本却保留不必要的 future 导入
# 如果项目已确定运行在 Python 3.10+，以下导入就是多余的
from __future__ import generator_stop  # ❌ 已经是默认行为，应删除
```

---

### 20. 代码类型注释

> **规则：推荐使用类型注解**

遵循 PEP-484，为公开 API 添加类型注解。

✅ **正确做法**

```python
from typing import Sequence, Mapping, Optional

def fetch_rows(
    table_handle: smalltable.Table,
    keys: Sequence[bytes | str],
    require_all_keys: bool = False,
) -> Mapping[bytes, tuple[str, ...]]:
    """从 Smalltable 获取数据行."""
    ...
```

❌ **错误做法**

```python
# 无类型注解
def fetch_rows(table_handle, keys, require_all_keys=False):
    # ❌ 参数和返回值的类型不明确
    ...
```

---

## 二、Python 风格规范

---

### 1. 分号

> **规则：不要在行尾加分号，也不要用分号合并语句**

✅ **正确做法**

```python
x = 1
y = 2
```

❌ **错误做法**

```python
x = 1;   # ❌ 行尾不要加分号
y = 2; z = 3  # ❌ 不要用分号合并语句
```

---

### 2. 行宽

> **规则：最大行宽 80 个字符**

使用圆括号、中括号、花括号的**隐式续行**，禁止反斜杠显式续行。

例外：长 import、注释中的 URL/路径、不便换行的长字符串常量、pylint 禁用注释。

✅ **正确做法**

```python
# 隐式续行
foo_bar(self, width, height, color='黑', design=None,
        x='foo', emphasis=None, highlight=0)

# 在最外层语法结构上分行
bridgekeeper.answer(
    name="亚瑟",
    quest=questlib.find(owner="亚瑟", perilous=True))

answer = (a_long_line().of_chained_methods()
          .that_eventually_provides().an_answer())

if (config is None
        or 'editor.language' not in config
        or config['editor.language'].use_spaces is False):
    use_tabs()

# 字符串隐式续行
x = ('这是一个很长很长很长很长很长很长'
     '很长很长很长很长很长的字符串')

# 注释中的长 URL 独立成行
# 详情参见
# https://www.example.com/us/developer/documentation/api/content/v2.0/csv_file_name_extension_full_specification.html
```

❌ **错误做法**

```python
# 反斜杠续行
if width == 0 and height == 0 and \
   color == '红' and emphasis == '加粗':  # ❌ 禁止反斜杠续行

bridge_questions.clarification_on \
    .average_airspeed_of.unladen_swallow = '美国的还是欧洲的?'  # ❌

# 换行不在最外层语法结构
bridgekeeper.answer(name="亚瑟", quest=questlib.find(
    owner="亚瑟", perilous=True))  # ❌ 应该在最外层分行

# 注释中 URL 用反斜杠续行
# 详情参见 https://www.example.com/us/developer/documentation/api/content/\
# v2.0/csv_file_name_extension_full_specification.html  # ❌
```

---

### 3. 括号

> **规则：宁缺毋滥**

不要在返回语句或条件语句中使用括号，除非用于隐式续行或表示元组。

✅ **正确做法**

```python
if foo:
    bar()
while x:
    x = bar()
if x and y:
    bar()
if not x:
    bar()
onesie = (foo,)           # 单元素元组
return foo
return spam, beans
return (spam, beans)      # 元组
for (x, y) in dict.items(): ...
```

❌ **错误做法**

```python
if (x):          # ❌ 不必要的括号
    bar()
if not(x):       # ❌ not 和 x 之间应有空格
    bar()
return (foo)     # ❌ 不是元组，不必要的括号
```

---

### 4. 缩进

> **规则：用 4 个空格缩进，禁止制表符**

隐式续行时：括起来的元素垂直对齐，或添加 4 个空格悬挂缩进。右括号可置于表达式结尾或另起一行。

✅ **正确做法**

```python
# 与左括号对齐
foo = long_function_name(var_one, var_two,
                         var_three, var_four)

# 4 个空格悬挂缩进；首行没有元素
foo = long_function_name(
    var_one, var_two,
    var_three, var_four)

# 右括号另起一行
foo = long_function_name(
    var_one, var_two,
    var_three, var_four
)

# 字典悬挂缩进
foo = {
    'long_dictionary_key': long_dictionary_value,
    ...
}
```

❌ **错误做法**

```python
# 首行有元素 + 悬挂缩进混用
foo = long_function_name(var_one, var_two,
    var_three, var_four)  # ❌ 首行有元素时应对齐

# 2 个空格的悬挂缩进
foo = long_function_name(
  var_one, var_two,  # ❌ 应该是 4 个空格
  var_three)

# 字典没有悬挂缩进
foo = {
    'long_dictionary_key': long_dictionary_value,
    ...  # ❌ 应与字典的左括号对齐或使用 4 空格悬挂缩进
}
```

---

### 5. 序列尾部逗号

> **规则：仅当 `]`、`)`、`}` 和最后一个元素不在同一行时，推荐添加尾部逗号**

✅ **正确做法**

```python
# 多行序列加尾部逗号
FOO = (
    'a',
    'b',
    'c',       # ✅ 推荐尾部逗号
)

# 单行序列不需要
FOO = ('a', 'b', 'c')  # ✅ 无尾部逗号
```

❌ **错误做法**

```python
# 多行序列无尾部逗号（容易产生合并冲突）
FOO = (
    'a',
    'b',
    'c'        # ❌ 添加新元素时，这行必须修改，Git diff 不干净
)

# 单行序列加尾部逗号
FOO = ('a', 'b', 'c',)  # ❌ 单行无需尾部逗号
```

---

### 6. Shebang 行

> **规则：大部分 .py 文件不必以 `#!` 开始**

仅主程序文件可以添加 `#!/usr/bin/env python3`。

✅ **正确做法**

```python
#!/usr/bin/env python3
"""主程序入口."""
def main():
    ...

if __name__ == '__main__':
    main()
```

❌ **错误做法**

```python
# 库模块不需要 shebang
#!/usr/bin/env python3       # ❌ 非主程序文件不需要
"""工具库模块."""
def helper():
    ...
```

---

### 7. 注释和文档字符串（Docstring）

> **规则：模块、函数、方法的文档字符串和内部注释必须采用正确风格**

文档字符串用三重双引号 `"""`。第一行是概述（≤80 字符，以句号结尾）。函数文档字符串包含 `Args:`、`Returns:`、`Raises:` 小节。

✅ **正确做法**

```python
def fetch_smalltable_rows(
    table_handle: smalltable.Table,
    keys: Sequence[bytes | str],
    require_all_keys: bool = False,
) -> Mapping[bytes, tuple[str, ...]]:
    """从 Smalltable 获取数据行.

    从 table_handle 代表的 Table 实例中检索指定键值对应的行.
    如果键值是字符串, 字符串将用 UTF-8 编码.

    参数:
        table_handle: 处于打开状态的 smalltable.Table 实例.
        keys: 一个字符串序列, 代表要获取的行的键值.
        require_all_keys: 如果为 True, 只返回那些所有键值都有对应数据的行.

    返回:
        一个字典, 把键值映射到行数据上. 行数据是字符串构成的元组.

    抛出:
        IOError: 访问 smalltable 时出现错误.
    """
    ...
```

```python
# 类文档字符串
class SampleClass:
    """样本类的概述.

    属性:
        likes_spam: 布尔值, 表示我们是否喜欢午餐肉.
        eggs: 用整数记录的下蛋的数量.
    """

    def __init__(self, likes_spam=False):
        self.likes_spam = likes_spam
        self.eggs = 0
```

```python
# 块注释：在复杂操作前写上若干行注释
# 我们用加权的字典搜索, 寻找 i 在数组中的位置.
# 我们基于数组中的最大值和数组长度, 推断一个位置,
# 然后用二分搜索获得最终准确的结果.
if i & (i - 1) == 0:  # 如果 i 是 0 或者 2 的整数次幂, 则为真.
    ...
```

❌ **错误做法**

```python
# 无文档字符串
def fetch_rows(table_handle, keys):  # ❌ 公开 API 必须有文档字符串
    ...

# 文档字符串描述了代码实现而非功能
def calculate(x):
    """遍历数组 b, 确保每次 i 出现时, 下一个元素是 i+1."""  # ❌ 不要描述代码，解释意图
    ...

# 注释无意义
class SampleClass:
    """一个描述样本的类."""  # ❌ 无意义的重复（"一个描述...的类"）

class OutOfCheeseError(Exception):
    """在没有可用的奶酪时抛出."""  # ❌ 应该描述异常代表什么，而非抛出环境
```

---

### 8. 标点符号、拼写和语法

> **规则：注释应该和记叙文一样可读**

使用恰当的大小写和标点。完整句子比残缺句更可读。

✅ **正确做法**

```python
# 返回前必须验证用户权限, 否则可能导致数据泄露.
if not user.has_permission('read'):
    raise PermissionError('用户缺少读取权限.')
```

❌ **错误做法**

```python
# 需验证权限 否则数据泄露  # ❌ 无标点，难以阅读
if not user.has_permission('read'):
    raise PermissionError('没权限')  # ❌ 不专业的错误信息
```

---

### 9. 字符串

> **规则：用 f-string、% 或 format 格式化字符串；禁止在循环中用 + 堆积字符串；同一文件保持引号一致；日志用占位符而非 f-string**

✅ **正确做法**

```python
# 格式化
x = f'名称: {name}; 分数: {n}'
x = '%s, %s!' % (imperative, expletive)
x = '{}, {}'.format(first, second)
x = a + b  # 单次拼接可以

# 循环中拼接字符串 → 用 join
items = ['<table>']
for last_name, first_name in employee_list:
    items.append('<tr><td>%s, %s</td></tr>' % (last_name, first_name))
items.append('</table>')
employee_table = ''.join(items)

# 引号一致
Python('为什么你要捂眼睛?')
Gollum("I'm scared of lint errors.")  # 内部有单引号时用双引号
Narrator('"很好!" 一个开心的 Python 审稿人心想.')

# 日志：用占位符
import logging
logging.info('TensorFlow 的版本是: %s', tf.__version__)

# 错误信息：精确、可分辨、便于 grepping
if not 0 <= p <= 1:
    raise ValueError(f'这不是概率值: {p!r}')
```

❌ **错误做法**

```python
# 用 + 格式化
x = '名称: ' + name + '; 分数: ' + str(n)  # ❌ 应用格式化方法

# 循环中用 + 堆积字符串
employee_table = '<table>'
for last_name, first_name in employee_list:
    employee_table += '<tr><td>%s, %s</td></tr>' % (last_name, first_name)  # ❌ O(n²)
employee_table += '</table>'

# 引号不一致
Python("为什么你要捂眼睛?")      # ❌ 同一文件应用一致的引号风格
Gollum('格式检查器. 它在闪耀.')   # ❌

# 日志用 f-string
logging.info(f'TensorFlow 的版本是: {tf.__version__}')  # ❌ 日志应用占位符

# 不精确的错误信息
raise ValueError('Invalid input')  # ❌ 信息不够精确
```

---

### 10. 文件、Socket 等有状态资源

> **规则：使用完后必须关闭资源，推荐 `with` 语句**

✅ **正确做法**

```python
# with 语句自动关闭
with open('data.txt', 'r') as f:
    content = f.read()

# socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(('localhost', 8080))
    s.sendall(b'Hello')
```

❌ **错误做法**

```python
# 手动打开不关闭
f = open('data.txt', 'r')  # ❌ 如果中间抛异常，文件不会被关闭
content = f.read()
f.close()

# 忽略上下文管理器
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('localhost', 8080))
s.sendall(b'Hello')
# ❌ 没有 s.close()
```

---

### 11. TODO 注释

> **规则：格式为 `TODO(作者): 待办事项内容`**

✅ **正确做法**

```python
# TODO(kl@gmail.com): 使用 "*" 代替下面的循环.
# FIXME(zhangsan): 该方法在二进制数据下会崩溃.
```

❌ **错误做法**

```python
# TODO: 以后优化       # ❌ 没有作者信息
# HACK: 临时方案       # ❌ 不是标准 TODO 格式
# XXX                  # ❌ 无描述
```

---

### 12. Import 语句格式

> **规则：每行只导入一个模块，按顺序分组，组间空一行**

顺序：
1. Python 标准库
2. 第三方库
3. 本地库

✅ **正确做法**

```python
# 1. 标准库
import os
import sys
from typing import List, Optional

# 2. 第三方库
import numpy as np
from absl import flags

# 3. 本地库
from myproject import mymodule
from myproject.another import thing
```

❌ **错误做法**

```python
# 混合导入
import os, sys  # ❌ 每行只导入一个模块

# 不分组
import numpy as np
import os          # ❌ 标准库应放在第三方库前面
from myproject import mymodule
from absl import flags  # ❌ 第三方库和本地库混在一起
```

---

### 13. 语句

> **规则：每行一个语句**

✅ **正确做法**

```python
if foo:
    bar()

# 极其简单的 if 可以同一行
if foo: bar()
```

❌ **错误做法**

```python
if foo: bar(); baz()   # ❌ 一行多个语句
x = 1; y = 2           # ❌ 分号合并
```

---

### 14. 访问器（Getter/Setter）

> **规则：简单属性直接使用公有属性，需要额外行为时用 `@property`**

✅ **正确做法**

```python
class Person:
    def __init__(self, name: str):
        self.name = name          # ✅ 简单属性直接公有

class Temperature:
    def __init__(self, celsius: float):
        self._celsius = celsius

    @property
    def fahrenheit(self) -> float:  # ✅ 涉及计算的属性用 property
        return self._celsius * 9 / 5 + 32
```

❌ **错误做法**

```python
class Person:
    def __init__(self, name: str):
        self._name = name

    def get_name(self):           # ❌ Python 不用 Java 风格的 getter
        return self._name

    def set_name(self, name):     # ❌ Python 不用 Java 风格的 setter
        self._name = name
```

---

### 15. 命名规范

> **规则：遵循下表命名约定**

| 类型 | 规范 | 示例 |
|------|------|------|
| 模块文件 | `lower_with_under.py` | `my_module.py` |
| 包 | `lower_with_under` | `my_package` |
| 类 | `CapWords` | `MyClass` |
| 异常 | `CapWordsError` | `ValueError` |
| 函数/方法 | `lower_with_under()` | `my_function()` |
| 变量/参数 | `lower_with_under` | `my_variable` |
| 常量 | `CAPS_WITH_UNDER` | `MAX_COUNT` |
| 内部变量 | `_leading_under` | `_internal_var` |
| 名称修饰 | `__double_under` | `__private_attr` |

✅ **正确做法**

```python
# 常量
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30

# 类
class HttpRequestHandler:
    """HTTP 请求处理器."""

    # 类方法
    @classmethod
    def from_config(cls, config: dict) -> 'HttpRequestHandler':
        ...

    # 实例方法
    def handle_request(self, request: Request) -> Response:
        ...

# 函数
def calculate_total(items: list) -> float:
    ...

# 内部属性
class Server:
    def __init__(self):
        self._connection_pool = []  # 内部属性
```

❌ **错误做法**

```python
# 类名不用 CapWords
class http_request_handler:   # ❌ 应该是 HttpRequestHandler
    pass

# 函数名用 camelCase
def calculateTotal(items):    # ❌ 应该是 calculate_total
    ...

# 常量不用全大写
max_connections = 100         # ❌ 应该是 MAX_CONNECTIONS

# 变量用单字母（非循环变量）
c = Customer()                # ❌ 应该用 customer 或更有意义的名字
```

---

### 16. 主程序

> **规则：使用 `if __name__ == '__main__'` 惯用法**

✅ **正确做法**

```python
def main():
    """主程序入口."""
    args = parse_args()
    run(args)

if __name__ == '__main__':
    main()
```

❌ **错误做法**

```python
# 直接在模块级别执行逻辑
args = parse_args()   # ❌ 导入模块时会执行
run(args)             # ❌ 导入模块时会执行

# 不使用 main 函数
if __name__ == '__main__':
    args = parse_args()  # ❌ 应封装在 main() 中
    run(args)
```

---

### 17. 函数长度

> **规则：保持函数短小精悍，建议 40 行以内（文档字符串除外）**

✅ **正确做法**

```python
def parse_config(config_path: str) -> dict:
    """解析配置文件.

    参数:
        config_path: 配置文件路径.

    返回:
        解析后的配置字典.

    抛出:
        FileNotFoundError: 配置文件不存在.
    """
    raw = _read_file(config_path)        # 拆分小函数
    validated = _validate_config(raw)     # 每个函数职责单一
    return _normalize_config(validated)
```

❌ **错误做法**

```python
def parse_config(config_path: str) -> dict:
    """解析配置文件."""
    # 200 行代码全部塞在一个函数中  # ❌ 函数过长
    with open(config_path) as f:
        raw = f.read()
    lines = raw.split('\n')
    result = {}
    for line in lines:
        if line.startswith('#'):
            continue
        if '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        value = value.strip()
        if key in RESERVED_KEYS:
            raise ValueError(f'保留键: {key}')
        # ... 还有 180 行 ...
    return result
```

---

### 18. 类型注解（Type Annotation）

> **规则：推荐使用类型注解提高代码可读性**

遵循 PEP-484。为公开 API 添加类型注解。

✅ **正确做法**

```python
from typing import Sequence, Mapping, Optional, Callable

def fetch_smalltable_rows(
    table_handle: smalltable.Table,
    keys: Sequence[bytes | str],
    require_all_keys: bool = False,
) -> Mapping[bytes, tuple[str, ...]]:
    """从 Smalltable 获取数据行."""
    ...

# 使用 TypeAlias
Point: TypeAlias = tuple[float, float]

# 泛型
def first(items: Sequence[T]) -> Optional[T]:
    return items[0] if items else None
```

❌ **错误做法**

```python
# 无类型注解
def fetch_rows(table_handle, keys, require_all_keys=False):  # ❌
    ...

# 使用过时的 Optional 写法（如果项目已使用 Python 3.10+）
def foo(x: Optional[str] = None):  # 在 3.10+ 中应使用 x: str | None = None
    ...

# 注释中的内联类型（旧风格）
def foo(x):  # type: str -> str  # ❌ 应使用函数注解
    ...
```

---

## 三、临别赠言

> **请保持代码的一致性和可读性！**
>
> 风格指南的核心目的是让代码更易读、易维护。当遇到指南中没有覆盖的情况时，请运用最佳判断，并保持与项目现有代码风格一致。

---

## 参考资源

| 资源 | 链接 |
|------|------|
| Google Style Guide 英文原版 | https://github.com/google/styleguide |
| 中文版 | https://zh-google-styleguide.readthedocs.io/ |
| 自动格式化：Black | https://github.com/psf/black |
| 自动格式化：Pyink | https://github.com/google/pyink |
| Vim 配置文件 | https://github.com/google/styleguide/blob/gh-pages/google_python_style.vim |
| PEP-484 类型注解 | https://peps.python.org/pep-0484/ |
| PEP-257 文档字符串 | https://peps.python.org/pep-0257/ |
