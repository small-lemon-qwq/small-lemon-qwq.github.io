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

{% callout info 你 %}
{% callout info 这 %}
{% callout info 个 %}
{% callout info 支 %}
{% callout info 持 %}
{% callout info 嵌 %}
{% callout info 套 %}
{% callout info 吗 %}
没被 hack 吧 qwq
{% endcallout %}
{% endcallout %}
{% endcallout %}
{% endcallout %}
{% endcallout %}
{% endcallout %}
{% endcallout %}
{% endcallout %}

{% iframe https://www.luogu.com.cn/ 100% 1200px %}