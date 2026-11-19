---
title: 题解：P12922 [POI 2021/2022 R3] 流星 / Meteory
date: 2026-11-19 13:17:32
tags: [Algorithm]
---

{% btn https://www.luogu.com.cn/problem/P12922, 题目传送门, question fa-question-circle, 洛谷 P12922 %}

我们充分发扬数学直觉，容易猜到答案乘以 $2$ 后一定是一个非负**整数**，所以我们将所有位置乘以 $2$ 避免实数计算。

容易想到二分答案。考虑 `check` 怎么写。

假设当前 `check(z)`，我们将所有流星按照时间排序，对于第一个流星，在其坠落时，Bajtazar 可以到达区间 $[-2t_1,2t_1]$ 内的所有位置，但在坠落的那一刻，区间 $(x_1-z,x_1+z)$ 内的所有位置都不可以被访问。根据上面的分析，我们可以考虑维护 Bajtazar 可以到达的位置的情况，当某一时刻没有 Bajtazar 可以到达的位置时，说明这个 $z$ 无解，否则有解。使用类似 ODT 的东西维护可以到达的位置，将 Bajtazar 可以到达的位置表示为若干个区间，用 `set` 存储，我们发现一段区间的左右端点随着时间的变化会向左右延伸，但这是个经典 `trick`，强制假设每个区间都是在时刻 $0$ 被加入的，然后取出区间时将左端点减 $2t$，右端点加 $2t$ 即可。

注意我写代码的时候脑抽了，和上面的文字表述不太一样，代码中 `set` 维护的是**不能**到达的位置，本质相同，还开了两个 `set` 让左右端点都有序（实际上区间无交，所以一个 `set` 够了）。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n;
pair<int,int>a[200005];
bool check(int z){
	if(z==0)return 1;
	set<pair<int,int>>st={{-(int)1e18,0},{0,(int)1e18}},st2={{0,-(int)1e18},{(int)1e18,0}};
	for(int i=1;i<=n;i++){
		int t=a[i].first,x=a[i].second;
		int l=x-z,r=x+z;
		while(1){
			auto it=st2.upper_bound(make_pair(l+2*t,(int)1e18));
			if(it!=st2.end()&&(it->second+2*t)>=(it->first-2*t)){
				st.erase(make_pair(it->second,it->first));
				st2.erase(it);
				continue;
			}
			if(it==st2.end()||(it->second+2*t)>=r){
				break;
			}
			r=max(r,it->first-2*t);
			l=min(l,it->second+2*t);
			st.erase(make_pair(it->second,it->first));
			st2.erase(it);
		}
		while(1){
			auto it=st.lower_bound(make_pair(l-2*t,-(int)1e18));
			if(it==st.end()||it->second-2*t>l){
				break;
			}
			st2.erase(make_pair(it->second,it->first));
			st.erase(it);
		}
		st.insert({l-2*t,r+2*t});
		st2.insert({r+2*t,l-2*t});
		if(st.size()==1){
			return 0;
		}
	}
	return 1;
}
signed main(){
	// freopen("met.in","r",stdin);
	// freopen("met.out","w",stdout);
	ios::sync_with_stdio(0);
	cin.tie(0);cout.tie(0);
	cin>>n;
	for(int i=1;i<=n;i++){
		cin>>a[i].first>>a[i].second;
		a[i].second*=2;
	}
	sort(a+1,a+n+1);
	int l=0,r=1e18;
	while(l<=r){
		int mid=(l+r>>1);
		if(check(mid)){
			l=mid+1;
		}else{
			r=mid-1;
		}
	}
	cout<<r/2<<"."<<r%2*5;
	return 0;
}//rp++
```