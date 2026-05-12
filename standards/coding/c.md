# CS50 C 编码规范（中文版 + 正误示例）

> 来源：[CS50 Style Guide for C](https://cs50.readthedocs.io/style/c/)
> 本文档参考原始指南整理，并为主要规则补充了**正确做法 ✅**与**错误做法 ❌**的对照示例。
> 本规范重点强调：**可读性、一致性、可被工具稳定检查**。

---

## 一、基础原则

---

### 1. 行宽控制

> **规则：代码建议控制在 80 列以内，100 列以内是硬上限**

CS50 将 `80` 列视为传统且推荐的阅读宽度，同时通过 `style50` 等工具对超过 `100` 列的代码进行严格约束。若一行已经超过 `100` 列，通常说明变量命名、表达式结构或整体设计需要重新审视。

✅ **正确做法**

```c
int first = get_int("First integer: ");
int second = get_int("Second integer: ");
int product = first * second;
```

```c
if (first > 0 &&
    second > 0 &&
    product > 0)
{
    printf("All values are positive.\n");
}
```

❌ **错误做法**

```c
int first_collected_integer_value_from_user = get_int("Integer please: "); int second_collected_integer_value_from_user = get_int("Another integer please: "); int product_of_the_two_integer_values_from_user = first_collected_integer_value_from_user * second_collected_integer_value_from_user;
```

---

### 2. 注释应该解释代码块，而不是淹没代码

> **规则：注释应适量，通常每几个关键代码块写一次，说明“做什么”或“为什么这样做”**

注释过少会让代码难懂，注释过多会让代码像“文字墙”。比较好的做法是：对有意义的代码块写简短注释，并尽量回答两个问题：
1. 这个代码块在做什么？
2. 为什么要这样实现？

✅ **正确做法**

```c
// Calculate the average score
float average = (score1 + score2 + score3) / 3.0;
```

```c
// Keep asking until the user enters a positive number
int n;
do
{
    n = get_int("Positive integer: ");
}
while (n < 1);
```

❌ **错误做法**

```c
// calculate the average score
float average = (score1 + score2 + score3) / 3.0;  // ❌ 首字母未大写
```

```c
//Calculate the average score
float average = (score1 + score2 + score3) / 3.0;  // ❌ // 后缺少空格
```

```c
float average = (score1 + score2 + score3) / 3.0; // Calculate the average score
// ❌ CS50 更推荐将块内注释放在对应代码上方，而不是行尾
```

---

### 3. 文件头和函数头都应有摘要注释

> **规则：`.c` 和 `.h` 文件顶部应有摘要注释；除 `main` 外，函数顶部通常也要有摘要注释**

文件顶部的注释说明“这个程序/文件是干什么的”，函数顶部的注释说明“这个函数返回什么或完成什么工作”。

✅ **正确做法**

```c
// Says hello to the world
```

```c
// Returns the square of n
int square(int n)
{
    return n * n;
}
```

❌ **错误做法**

```c
int square(int n)
{
    return n * n;
}
// ❌ 没有函数摘要，不利于快速理解接口
```

```c
// this file has some code
// ❌ 文件头注释过于含糊，不能有效概括内容
```

---

### 4. 头文件按字母序排列

> **规则：所有 `#include` 的库头文件按字母顺序排列**

按字母序排列可以让读者更快发现是否缺失某个头文件，也能降低重复包含和乱序维护的成本。

✅ **正确做法**

```c
#include <cs50.h>
#include <stdio.h>
#include <string.h>
```

❌ **错误做法**

```c
#include <string.h>
#include <cs50.h>
#include <stdio.h>
```

---

## 二、控制流规范

---

### 1. 条件语句格式

> **规则：`if`、`else if`、`else` 的花括号各自独占一行，关键字后保留一个空格，条件两侧保持紧凑**

核心要求：
- `if` 后面有一个空格
- `(` 后和 `)` 前不要留空格
- 比较运算符两边各一个空格
- 分支体缩进 4 个空格
- 花括号位置整齐清晰

✅ **正确做法**

```c
if (x > 0)
{
    printf("x is positive\n");
}
else if (x < 0)
{
    printf("x is negative\n");
}
else
{
    printf("x is zero\n");
}
```

❌ **错误做法**

```c
if (x < 0) {
    printf("x is negative\n");
}
else if (x > 0) {
    printf("x is positive\n");
}
// ❌ CS50 不推荐把左花括号放在条件同行末尾
```

```c
if (x < 0)  {
    printf("x is negative\n");
} else  {
    printf("x is nonnegative\n");
}
// ❌ 多余空格破坏一致性
```

```c
if( x < 0 )
{
    printf("x is negative\n");
}
// ❌ if 后缺少空格，括号内部又有不必要空格
```

---

### 2. `switch` 语句格式

> **规则：`switch` 与 `case` 层次清晰，`case` 缩进 4 空格，语句体再额外缩进 4 空格，每个 `case` 以 `break` 结束**

✅ **正确做法**

```c
switch (n)
{
    case -1:
        printf("n is -1\n");
        break;

    case 1:
        printf("n is 1\n");
        break;

    default:
        printf("n is neither -1 nor 1\n");
        break;
}
```

❌ **错误做法**

```c
switch(n) {
case -1:
printf("n is -1\n");
break;
default:
printf("other\n");
}
// ❌ 缺少空格、花括号位置不统一、缩进混乱、default 缺少 break
```

---

## 三、函数规范

---

### 1. `main` 的声明必须规范

> **规则：使用标准 C11 风格声明 `main`，不要写 `main()`、`void main()` 或省略返回类型**

允许的形式包括：
- `int main(void)`
- `int main(int argc, char *argv[])`
- `int main(int argc, char **argv)`
- 若使用 CS50 Library，也可以用 `string argv[]`

✅ **正确做法**

```c
int main(void)
{
    printf("hello, world\n");
}
```

```c
int main(int argc, char *argv[])
{
    printf("Argument count: %i\n", argc);
}
```

```c
#include <cs50.h>

int main(int argc, string argv[])
{
    printf("Argument count: %i\n", argc);
}
```

❌ **错误做法**

```c
int main()
{
    return 0;
}
// ❌ 不应省略 void
```

```c
void main()
{
}
// ❌ main 的返回类型不应为 void
```

```c
main()
{
}
// ❌ 省略返回类型属于不规范写法
```

---

### 2. 自定义函数也要保持与 `main` 一致的格式

> **规则：返回类型与函数名同行，花括号独占一行，函数体缩进 4 空格**

✅ **正确做法**

```c
int add(int a, int b)
{
    return a + b;
}
```

```c
bool is_even(int n)
{
    return n % 2 == 0;
}
```

❌ **错误做法**

```c
int add(int a, int b) {
    return a + b;
}
// ❌ 左花括号不应放在函数声明同行末尾
```

```c
int
add(int a, int b)
{
    return a + b;
}
// ❌ 返回类型与函数名应在同一行
```

---

## 四、缩进与循环规范

---

### 1. 每层缩进 4 个空格

> **规则：统一使用 4 个空格缩进；如果按 Tab，编辑器也必须自动转换成 4 个空格**

不同编辑器对 `\t` 的显示宽度可能不同，所以代码的“视觉结构”不能依赖制表符本身。

✅ **正确做法**

```c
for (int i = 0; i < argc; i++)
{
    printf("%s\n", argv[i]);
}
```

❌ **错误做法**

```c
for (int i = 0; i < argc; i++)
{
  printf("%s\n", argv[i]);
}
// ❌ 只缩进了 2 个空格
```

```c
for (int i = 0; i < argc; i++)
{
	printf("%s\n", argv[i]);
}
// ❌ 依赖 tab 显示，不够稳定
```

---

### 2. `for` 循环中临时迭代变量优先使用 `i`、`j`、`k`

> **规则：常规循环变量按 `i`、`j`、`k` 使用；若更具体名称更清晰，则使用更清晰名称**

如果一个逻辑需要四层以上嵌套循环，往往说明设计本身需要优化。

✅ **正确做法**

```c
for (int i = 0; i < height; i++)
{
    for (int j = 0; j < width; j++)
    {
        printf("#");
    }
    printf("\n");
}
```

```c
for (int row = 0; row < height; row++)
{
    for (int column = 0; column < width; column++)
    {
        printf("#");
    }
    printf("\n");
}
// ✅ 在更强调含义时，row/column 反而更清楚
```

❌ **错误做法**

```c
for (int first_dimension_loop_index = 0;
     first_dimension_loop_index < height;
     first_dimension_loop_index++)
{
    // ❌ 名字过长，反而降低可读性
}
```

---

### 3. `while` 循环格式

> **规则：`while` 后加一个空格，括号内部紧凑，花括号各自独占一行**

✅ **正确做法**

```c
while (condition)
{
    // Do something
}
```

❌ **错误做法**

```c
while(condition) {
    // Do something
}
// ❌ 缺少空格，左花括号位置不符合推荐风格
```

---

### 4. `do ... while` 循环格式

> **规则：`do` 的花括号各自独占一行，`while` 与条件保持标准间距**

✅ **正确做法**

```c
do
{
    // Do something
}
while (condition);
```

❌ **错误做法**

```c
do {
    // Do something
} while(condition);
// ❌ 左花括号位置和 while 空格都不符合推荐风格
```

---

## 五、指针与变量规范

---

### 1. 指针声明时，`*` 靠近变量名

> **规则：写成 `int *p;`，不要写成 `int* p;`**

CS50 风格更强调“星号属于变量”，这样在多处声明时不容易让读者误解。

✅ **正确做法**

```c
int *p;
char *buffer;
node *next;
```

❌ **错误做法**

```c
int* p;
char* buffer;
node* next;
```

---

### 2. 变量在真正需要时再声明，作用域尽量小

> **规则：不要把所有变量堆在函数开头；变量应在最靠近使用处声明**

CS50 采用 C11，因此鼓励在需要的地方再定义变量，尤其是循环变量要放在循环内部。

✅ **正确做法**

```c
for (int i = 0; i < LIMIT; i++)
{
    printf("%i\n", i);
}
```

```c
int sum = 0;
for (int i = 0; i < n; i++)
{
    sum += values[i];
}
```

❌ **错误做法**

```c
int i;
for (i = 0; i < LIMIT; i++)
{
    printf("%i\n", i);
}
// ❌ 如果 i 只在循环中使用，就应缩小作用域
```

```c
int i;
int j;
int sum;
int average;
// ❌ 还没用就全部提前堆在函数顶部
```

---

### 3. 变量命名要具体；多词变量使用下划线连接

> **规则：除了循环变量 `i/j/k` 外，变量名应尽量表达真实含义；多词用下划线分隔**

✅ **正确做法**

```c
int sum = 0;
bool is_ready = true;
float average_score = 0.0;
```

❌ **错误做法**

```c
int s = 0;          // ❌ 含义不明确
bool readyflag = 1; // ❌ 命名不够自然
float averagescore; // ❌ 多词未分隔，可读性差
```

---

### 4. 同类型变量可以同一行声明，但不要“部分初始化”

> **规则：多个同类型普通变量可一起声明；但不要一部分初始化、一部分不初始化**

✅ **正确做法**

```c
int quarters, dimes, nickels, pennies;
```

```c
int quarters = 0;
int dimes = 0;
int nickels = 0;
int pennies = 0;
```

❌ **错误做法**

```c
int quarters, dimes = 0, nickels = 0, pennies;
// ❌ 部分初始化会让变量状态不清晰
```

---

### 5. 指针变量不要和非指针变量混在同一行声明

> **规则：指针和非指针分开写，避免误解**

✅ **正确做法**

```c
int *p;
int n;
```

❌ **错误做法**

```c
int *p, n;
// ❌ 很容易让人误读为 p 和 n 都是指针
```

---

## 六、结构体规范

---

### 1. 普通结构体的声明格式

> **规则：`typedef struct` 的花括号各自独占一行，成员缩进 4 空格，类型名另起一行**

✅ **正确做法**

```c
typedef struct
{
    string name;
    string dorm;
}
student;
```

```c
typedef struct
{
    int id;
    float score;
}
record;
```

❌ **错误做法**

```c
typedef struct {
string name;
string dorm;
} student;
// ❌ 花括号和缩进都不符合推荐格式
```

---

### 2. 链表等自引用结构体的声明格式

> **规则：如果结构体成员里包含指向同类型结构体的指针，应给 `struct` 一个与类型名相同的标签**

✅ **正确做法**

```c
typedef struct node
{
    int n;
    struct node *next;
}
node;
```

❌ **错误做法**

```c
typedef struct
{
    int n;
    node *next;
}
node;
// ❌ 在 typedef 尚未完成前直接使用 node，不够规范也可能出错
```

---

## 七、推荐检查清单

---

### 1. 提交前自查

> **规则：在提交前，用统一的格式审视代码是否满足基础可读性要求**

建议至少检查以下几点：
- 是否有超过 `100` 列的代码行
- 文件顶部是否有摘要注释
- 非 `main` 函数是否有摘要注释
- `#include` 是否按字母序排列
- `if` / `switch` / `while` / `do ... while` 花括号是否统一
- 缩进是否统一为 `4` 个空格
- 指针声明是否写成 `type *name`
- 变量是否在真正需要时才声明
- 结构体格式是否清晰一致

✅ **正确做法**

```c
// 在提交前统一检查风格和格式，确保代码对他人可读。
```

❌ **错误做法**

```c
// 代码能跑就行，格式以后再说。
// ❌ 这类想法通常会让后续维护成本迅速上升
```

---

## 八、临别赠言

> **请保持代码清晰、整洁、稳定可读！**
>
> C 的语法本身已经足够简洁，因此风格问题往往更容易直接影响“能否快速看懂”。CS50 这份规范的核心，不是追求某种唯一美学，而是让代码在教学、审阅、协作和工具检查时都能保持一致。
>
> 如果你拿不准某种写法是否合适，就优先选择：**更短、更清晰、更容易让别人一眼看懂的版本**。

---

## 参考资源

| 资源 | 链接 |
|------|------|
| CS50 C 风格指南 | https://cs50.readthedocs.io/style/c/ |
| C11 标准简介 | https://en.wikipedia.org/wiki/C11_(C_standard_revision) |
| style50 | https://cs50.readthedocs.io/projects/style50/ |
