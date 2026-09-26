---
title: 题解：P14558 [ROI 2013 Day2] 大规模预测
date: 2026-09-26 19:10:17
tags:
---

{% btn https://www.luogu.com.cn/problem/P14558, 题目传送门, question fa-question-circle, 洛谷 P14558 %}

根号分治才是最厉害的。

考虑对于单个颜色（候选人）$x$，如何算贡献，设 $c_i$ 是前 $i$ 个人中颜色 $x$ 的出现次数，那么要求出 $c_r-c_{l-1}>\frac{r-l+1}2$ 的个数，这等价于 $2c_r-r>2c_{l-1}-(l-1)$，令 $f_i=2c_i-i$，于是需要对序列 $f$ 求逆序对数，这只有 $O(n\log n)$ 做法（我认为），但是我们发现一个性质：$f_i-f_{i-1}=\pm1$，所以我们考虑类似树状数组求逆序对数，动态维护 $\sum\limits_{j<f_i}t_j$，然后每次将 $t_{f_i}$ 加 $1$，显然每次 $i$ 加 $1$ 只需要 $O(1)$ 的时间复杂度，于是得到一个 $O(nk)$ 的做法。

<!--more-->

考虑根号分治。

对于出现次数大于 $B$ 的颜色，上面的做法已经解决，而对于出现次数较小的颜色，可以考虑平方做法，可以枚举区间内最左侧和最右侧出现这个颜色的位置，设为 $(x,y)$，那么先检查区间 $[x,y]$ 是否是答案，如果不是，那说明 $(x,y)$ 不可能提供贡献，跳过。否则，由于是最左侧和最右侧的颜色，从 $[x,y]$ 开始向左和向右扩展，扩展到的一定不是这个颜色，于是可以算出左边和右边加起来最多能扩展多少，注意要防止扩展到其它的 $x$ 或 $y$，所以还有左右两边分别可扩展的最大值，然后这三个限制直接大力推式子可以 $O(1)$ 计算。

时间复杂度 $O(\frac{n^2}B+nB)$，取 $B=O(\sqrt n)$，常数极小，可以通过。

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,k,a[500005],t[1000005],f[500005];
constexpr int B=4000;
vector<int>v[500005];
signed main(){
	// freopen("prediction.in","r",stdin);
	// freopen("prediction.out","w",stdout);
	ios::sync_with_stdio(0);
	cin.tie(0);cout.tie(0);
	cin>>n>>k;
	for(int i=1;i<=n;i++){
		cin>>a[i];
		v[a[i]].push_back(i);
	}
	long long ans=0;
	for(int i=1;i<=k;i++){
		if(v[i].size()<B)continue;
		memset(t,0,sizeof(t));
		int cnt=0;
		t[n]++;
		int lst=0,sum=0;
		for(int j=1;j<=n;j++){
			cnt+=(a[j]==i);
			f[j]=2*cnt-j+n;
			while(lst<f[j]-1)sum+=t[++lst];
			while(lst>f[j]-1)sum-=t[lst--];
			ans+=sum;
			t[f[j]]++;
		}
	}
	for(int i=1;i<=k;i++){
		if(v[i].size()<B){
			for(int x=0;x<v[i].size();x++){
				for(int y=x;y<v[i].size();y++){
					int l=v[i][x]-(x==0?0:v[i][x-1])-1;
					int r=(y==v[i].size()-1?n+1:v[i][y+1])-v[i][y]-1;
					int c=2*(y-x+1)-(v[i][y]-v[i][x]+1)-1;
					if(c<0)continue;
					l=min(l,c);
					r=min(r,c);
					if(c-r<=l)ans+=1ll*(c-l+r)*(l+r-c+1)/2;
					ans+=1ll*(min(c-r-1,l)+1)*r+l+1;
				}
			}
		}
	}
	cout<<ans;
	return 0;
}//rp++
```