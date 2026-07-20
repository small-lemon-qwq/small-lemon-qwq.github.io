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

{% note info no-icon <!--recall--> %}
Hello!
{% note info no-icon recall %}
Goodbye!
{% endnote %}
{% endnote %}

{% iframe https://www.desmos.com/calculator/byiyxrfdv4 600px 400px%}