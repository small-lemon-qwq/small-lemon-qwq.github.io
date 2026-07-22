---
title: 最优解：Dynamic Rankings
date: 2026-07-22 21:38:25
tags: [Algorithm]
---

{% btn https://www.luogu.com.cn/problem/P2617, 题目传送门, question fa-question-circle, 洛谷 P2617 %}


已经有两分块题解了（加上一个莫队套分块的，应该是三个），但是我的做法很不一样，时空复杂度都很神秘。

首先我们将值域离散化，并确保离散化之后每个值都不同，我们有一个很简单的做法：维护值域下每个元素的位置，查询时从在值域上 $1$ 开始扫，如果遇到一个数且这个数正好在当前区间内，计数器加一，加到 $k$ 时输出答案，这样做是 $O(n^2)$ 的，且最坏时间复杂度为 $\Theta(n^2)$，~~但是它过了~~。

{% note info AC code %}
```cpp
#include<bits/stdc++.h>
using namespace std;
constexpr int N=100005;
int n,m,a[N],pos[2*N];
struct query{
	char op;
	int a,b,k;
}b[100005];
vector<array<int,2>>V;
int main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++)cin>>a[i],V.push_back({a[i],-i});
	for(int i=1;i<=m;i++){
		cin>>b[i].op>>b[i].a>>b[i].b;
		if(b[i].op=='Q')cin>>b[i].k;
		else V.push_back({b[i].b,i});
	}
	sort(V.begin(),V.end());
	for(int j=0;j<V.size();j++){
		int i=V[j][1];
		if(i<0)a[-i]=j+1;
		else b[i].b=j+1;
	}
	for(int i=1;i<=n;i++)pos[a[i]]=i;
	for(int i=1;i<=m;i++){
		if(b[i].op=='Q'){
			int L=0,k=0;
			while(k<b[i].k){
				L++;
				k+=(pos[L]>=b[i].a&pos[L]<=b[i].b);//DO NOT use `&&`
			}
			cout<<V[L-1][0]<<'\n';
		}else{
			pos[a[b[i].a]]=0;
			a[b[i].a]=b[i].b;
			pos[b[i].b]=b[i].a;
		}
	}
	return 0;
}
```
{% endnote %}

~~完结撒花/hec~~

好吧让我来说说正解，在值域上取 $O(w)$ 个关键点，令 $B=O(\frac nw)$，那么关键点就是 $B,2B,\cdots$，对于关键点 $x$，记录一个长度为 $n$ 的 bitset，第 $i$ 为若为 $1$，则表示 $a_i\le x$，否则 $a_i>x$，这显然是好维护的，修改时只需要 $O(w)$ 的时间复杂度。现在考虑查询怎么做，我们可以先二分求出答案在哪两个关键点之间（如果把两个关键点之间看作是一个块，那么这里本质上就是对值域经行的分块），这一步的时间复杂度为 $O(\log w\times \frac nw)$。然后，我们已经确定了答案的大致范围，如果直接套用上一个暴力的做法，那么我们可以接着在 $O(\frac nw)$ 的时间复杂度内求出答案，这样一个正解就做完了，稍微卡一卡，就比之前的最优解快了。

{% tabs qwq, 1 %}
<!-- tab 时间复杂度总和 -->
修改时间复杂度：$O(w)$；

查询时间复杂度：$O(\log w\times\frac nw)$；

因此，总和为 $O(n\times\log w\times\frac nw)$。
<!-- endtab -->

<!-- tab 块长最优取值 -->
这里的块长是指外层相邻两个关键点的跨度，设为 $B$。

修改时间复杂度：$O(\frac nB)$；

查询时间复杂度：$O(\log\frac nB\times\frac nw+B)$；

那么我们要最小化 $O(\max(\frac nB,\log\frac nB\times\frac nw+B))$，而在时间复杂度的情况下，$\max$ 可以转为 $+$，因此，这等价于最小化 $O(\frac nB+\log\frac nB\times\frac nw+B)$。

1. 若 $B\le O(\sqrt{n})$，那么这个东西分析出来应该是 $O(\frac nB+\log\frac nB\times\frac nw)$，显然 $B$ 增大，该式变小，取 $B=\sqrt{n}$ 最优，得到时间复杂度为 $\frac{n\log n}w$。
2. 否则，这个东西分析出来应该是 $O(B+\log\frac nB\times\frac nw)$，这等价于 $O(\max(B,\log\frac nB\times\frac nw))$，显然，$\max$ 的后者一定大于 $\frac nw$，因此我们可以放心地让 $B\ge O(\frac nw)$。下证该 $\max$ 一定不小于 $O(\log w\times\frac nw)$。若不然，则一定有 $B<O(\log w\times\frac nw)$，而此时 $\max$ 的后者大于 $O(\log w\times\frac nw)$，矛盾！证毕。

综上，$B=O(\frac nw)$ 时可以取到最优（注意还有其它可以取到等的）。
<!-- endtab -->

<!-- tab 空间复杂度 -->
我们有 $w$ 个 bitset，每个 bitset 空间复杂度为 $O(\frac nw)$，总空间复杂度为 $O(n)$，这是线性的！
<!-- endtab -->
{% endtabs %}

接下来，我们考虑如何优化，对于每个 bitset，操作为单点修改，区间查询 $1$ 的个数，而映射到 bitset 上，这就形如单点 $\operatorname{popcount}$ 加或减 $1$，区间 $\operatorname{popcount}$ 和，我们发现这是简单分块题，分块可以做到 $O(1)$ 单点修改，$O(\sqrt{\frac nw})$ 区间查询，注意因为底层有一个 bitset，分块的长度会变小。

然后就做完了，我们令 $B=\sqrt n$（这里不除以 $w$），可得最优时间复杂度：$O(n\sqrt n+\sqrt\frac nw\log n)$（推导略去），在 WORD-RAM 模型下，若设 $w=O(\log n)$，时间复杂度为 $O(n\sqrt{n\log\log n})$。感觉 $\sqrt{\log\log n}$ 可以当常数处理，算一下还不到 $3$。