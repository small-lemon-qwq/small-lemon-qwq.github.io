---
title: SIMD 神力！！！！！
date: 2026-07-31 16:12:44
tags: [Algorithm]
---
注意到：

> 请使用常数较小的写法或者比较好的**科技**去过本题。

考虑什么是科技，那应该就是 SIMD 了。

{% note info 无关 %}

推荐阅读：[SIMD 神力！！！！！](https://cloudspots.github.io/hexo/2026/07/16/simd-power/)。

这个数据范围非常小啊，我们考虑暴力能不能过。

唉不是我的 $O(n\sqrt{n\log n}\times\log V)$ 咋没过啊？？？咋只有 $20$ 分啊？？？换了个 $O(n^{\frac 53}\times\log V)$ 做法，终于 $100$ 了，唉不是 hack 数据咋没过，不管了我要打暴力。然后我打了个[《SIMD 神力！！！！！》](https://cloudspots.github.io/hexo/2026/07/16/simd-power/) 中不加优化的 $O(n^2\log V)$ 做法（其实是我先想到的），又没过。

{% endnote %}

这个二分太菜了，我们考虑有没有 $O(n^2)$ 且便于 SIMD 优化的做法。

我们沿用[这个](https://small-lemon-qwq.github.io/hexo/2026/07/22/luogu-P2617/)的 $O(n^2)$ 做法的思路，但是强制在线且有插入，所以不能维护值域下每个元素的位置，不过我们可以考虑维护一个 `vector<pair<int,int>>`，其中 `pair<int,int>` 的 `first` 是值，从小到大排序，`second` 是下标，查询的时候才用，然后查询就很简单了，从这个 `vector` 的第一个元素开始扫即可。

插入也很简单，扫一遍 `vector`，下标在插入元素之后的下标直接加一，然后再插入，没了。

修改拆成一次删除，一次插入，删除与插入同理，也做完了。

实现时，为了方便 SIMD，我们将 `vector<pair<int,int>>` 拆为两个 `vector<int>`。

写完一交，怎么 $20$ 分，这题有除了 $\color{red}0$，$\color{red}20$，$\color{red}100$，$\color{green}100$ 之外的分数吗？

好吧，一看汇编，插入，修改操作都有自动 SIMD 优化，但是对于查询，编译器太菜了，没有 SIMD 优化，所以我们自己写一个。

写完一交，怎么 $\color{red}100$ 分，没关系，我们充分发扬人类智慧，当 $k\ge \frac{r-l+1}{2}$（或当前整个序列长度除以 $2$）时，我们倒着扫 `vector`，然后就过了。

时间复杂度：$O(n^2)$，若各操作次数同阶，为 $\Theta(n^2)$。

```cpp
#pragma GCC target("avx2,popcnt")
#include<bits/stdc++.h>
#include<immintrin.h>
using namespace std;
int n,q;
vector<int>a,b;
void insert(int x,int y){
	for(int&i:a)i+=i>=x;
	auto t=upper_bound(b.begin(),b.end(),y)-b.begin();
	a.insert(a.begin()+t,x);
	b.insert(b.begin()+t,y);
}
int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);cout.tie(0);
	cin>>n;
	a.reserve(70000);
	b.reserve(70000);
	for(int i=1;i<=n;i++){
		int x;
		cin>>x;
		insert(i,x);
	}
	cin>>q;
	int lst=0;
	while(q--){
		char op;
		int x,y,k;
		cin>>op>>x>>y;
		x^=lst;
		y^=lst;
		if(op=='Q'){
			cin>>k;
			k^=lst;
			const __m256i vx=_mm256_set1_epi32(x-1);
			const __m256i vy=_mm256_set1_epi32(y+1);
			if(k<=(y-x+1)/2){
				int i=0,cnt=0;
				while(i+8<=a.size()){
					const __m256i v=_mm256_loadu_si256((__m256i*)(a.data()+i));
					const __m256i a=_mm256_cmpgt_epi32(v,vx);
					const __m256i b=_mm256_cmpgt_epi32(vy,v);
					const __m256i t=_mm256_and_si256(a,b);
					int x=__builtin_popcount(_mm256_movemask_ps(_mm256_castsi256_ps(t)));
					cnt+=x;
					if(cnt>=k){
						cnt-=x;
						break;
					}
					i+=8;
				}
				while(cnt!=k){
					cnt+=(a[i]>=x&a[i]<=y);
					i++;
				}
				cout<<(lst=b[i-1])<<'\n';
			}else{
				k=y-x+1-k+1;
				int i=a.size(),cnt=0;
				while(i>=8){
					const __m256i v=_mm256_loadu_si256((__m256i*)(a.data()+i-8));
					const __m256i a=_mm256_cmpgt_epi32(v,vx);
					const __m256i b=_mm256_cmpgt_epi32(vy,v);
					const __m256i t=_mm256_and_si256(a,b);
					int x=__builtin_popcount(_mm256_movemask_ps(_mm256_castsi256_ps(t)));
					cnt+=x;
					if(cnt>=k){
						cnt-=x;
						break;
					}
					i-=8;
				}
				while(cnt^k){
					--i;
					cnt+=(a[i]>=x&a[i]<=y);
				}
				cout<<(lst=b[i])<<'\n';
			}
		}else if(op=='M'){
			int i=0;
			for(;a[i]^x;i++);
			a.erase(a.begin()+i);
			b.erase(b.begin()+i);
			auto t=upper_bound(b.begin(),b.end(),y)-b.begin();
			a.insert(a.begin()+t,x);
			b.insert(b.begin()+t,y);
		}else{
			insert(x,y);
		}
	}
	return 0;
}
```