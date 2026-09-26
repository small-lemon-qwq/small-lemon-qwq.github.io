---
title: 题解：P8997 [CEOI 2022] Homework
date: 2026-08-22 08:32:52
tags: [Algorithm]
---

{% btn https://www.luogu.com.cn/problem/P8997, 题目传送门, question fa-question-circle, 洛谷 P8997 %}
怎么都要建表达式树，人类呢？？？

<!--more-->

设函数 `run` 的功能是从当前输入位置开始，继续输入，直到读入了一个完整的合法表达式，并返回这个表达式的答案，注意计算时 $N$ 要用这个表达式的 $N$。

代码大概长这样：

```cpp
int run(){
	char a,b;
	cin>>a;
	if(a=='?')return 1;
	cin>>b>>a>>a;
	int x=run();cin>>a;
	int y=run();cin>>a;
	return 0;
}
int main(){
	cout<<run();
}
```

但这个不是很好转移，因为最好要存下哪些位置可以被取到，直接存复杂度大概率会爆，因此可以结合样例猜到答案是一段区间。

假设当前位置是 `max(...,...)`，要对于此处的 $N$，分配一些值给左边，其余给右边，并保证相对顺序不变。

计算此处可取值的最小值：设左侧的最小值为 $l_1$，右侧的是 $l_2$，模拟一下不难得到答案为 $l_1+l_2$。

计算此处可取值的最大值：显然，计算最大值的最大值，直接贪心，将右边一整段都放在左边前，或反过来。设左侧的最大值为 $r_1$，右侧的是 $r_2$，长度分别为 $len_1$ 和 $len_2$，答案为 $\max\{r_1+len_2,r_2+len_1\}$。

如果当前位置是 `min(...,...)`，与 `max` 是同理的，不说了。

```cpp
#include<bits/stdc++.h>
using namespace std;
struct dp{int l,r,len;};
dp run(){
	char a,b;
	cin>>a;
	if(a=='?')return{1,1,1};
	cin>>b>>a>>a;
	dp x=run();cin>>a;
	dp y=run();cin>>a;
	if(b=='a')return{x.l+y.l,max(x.len+y.r,y.len+x.r),x.len+y.len};
	else return{min(x.l,y.l),x.r+y.r-1,x.len+y.len};
}
int main(){
	dp x=run();
	cout<<x.r-x.l+1;
	return 0;
}
```