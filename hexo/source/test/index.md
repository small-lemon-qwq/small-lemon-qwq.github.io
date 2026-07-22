---
title: Markdown Test
date: 2026-07-18 14:53:13
---
{% mermaid graph TD %}
A[This is a example of mermaid graph] --> B[Can it work?]
B -->|Yes| C[That's Great!]
B -->|No| D[Fix it!]
{% endmermaid %}

# These
## are
### many
#### titles

这是一张图片：

![图片描述](/hexo/test/a.png)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	cout<<"Hello World!";
	return 0;
}
```

~~AAA~~ __BBB__ _CCC_ *DDD* **EEE**

```markdown
~~AAA~~ __BBB__ _CCC_ *DDD* **EEE**
```

{% note info 禁止 %}
{% note danger 滥用 %}
{% note warning 嵌套 %}
{% note primary 否则 %}
{% note default 会被 %}
{% note success cz %}
{% note info 封号 %}
！
{% endnote %}
{% endnote %}
{% endnote %}
{% endnote %}
{% endnote %}
{% endnote %}
{% endnote %}

{% iframe https://www.desmos.com/calculator/byiyxrfdv4 600px 400px%}

{% pdf /sqrt.pdf %}
