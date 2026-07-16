---
title: 题解：由乃救爷爷
date: 2026-07-15 20:32:39
tags: [Algorithm]
---
来发个 ST 表题解。

众所周知，普通的 ST 表会爆空间，如果我们认为普通的 ST 表是 2-base 的，那我们可以用 32-base 来确保不会爆空间。32-base ST 表就是令 $f_{i,j}=\max\limits_{k=j}^{j+32^i-1} a_k$，$a$ 是原数组，这样查询的时候就要访问至多 $32$ 个 $f$ 的值。

<!-- more -->

但是，虽然 $32\times 2\times 10^7$ 看似只有大约 $6\times 10^8$，由于访问不连续，所以效果并不理想。

考虑不定 base ST 表，即每个 $f_{i,j}$ 所对应的区间长度和 $i$ 有关，因为数据随机，所以抽到大区间概率更高，可以让 $i$ 较大的区间长度较大，这样总查询时间压缩到了约三秒，但预处理时间也有三秒左右，加起来还是过不了。

考虑优化预处理，假设我们 $f$ 每一层的长度都是 $2$ 的幂。我们考虑仍然跑一遍普通 ST 表，可以使用滚动数组优化，遇到一个需要记录的长度就记录一下，这样预处理常数就降下来了。

最大点小于四秒。

```c
#include<stdio.h>
#pragma GCC target("avx2")
#include<immintrin.h>
int n,f[6][20000001];
unsigned z1,z2,z3,z4,b;
unsigned rand_(){
	b=((z1<<6)^z1)>>13;
	z1=((z1&4294967294U)<<18)^b;
	b=((z2<<2)^z2)>>27;
	z2=((z2&4294967288U)<<2)^b;
	b=((z3<<13)^z3)>>21;
	z3=((z3&4294967280U)<<7)^b;
	b=((z4<<3)^z4)>>12;
	z4=((z4&4294967168U)<<13)^b;
	return(z1^z2^z3^z4)&32767;
}
void srand(unsigned x){
	z1=x;z2=(~x)^0x233333333U;z3=x^0x1234598766U;z4=(~x)+51;
}
const int B[5]={10,16,19,21,23};
inline int read(){return(rand_()<<15)+rand_();}
signed main(){
	int q,s;
	scanf("%d%d%d",&n,&q,&s);
	srand(s);
	for(int i=1;i<=n;i++){
		f[0][i]=read();
	}
	{//0
		int len=1;
		for(int i=(len<<1);i<=n;i++){
			int x=f[0][i],y=f[0][i-len];
			f[1][i]=x>y?x:y;
		}
		for(int t=1;t<B[0];t++){
			len<<=1;
			for(int i=n;i>=(len<<1);i--){
				int y=f[1][i-len];
				if(f[1][i]<y)f[1][i]=y;
			}
		}
	}
	{//1
		int len=1<<B[0];
		for(int i=(len<<1);i<=n;i++){
			int x=f[1][i],y=f[1][i-len];
			f[2][i]=x>y?x:y;
		}
		for(int t=1;t<B[1]-B[0];t++){
			len<<=1;
			for(int i=n;i>=(len<<1);i--){
				int y=f[2][i-len];
				if(f[2][i]<y)f[2][i]=y;
			}
		}
	}
	{//2
		int len=1<<B[1];
		for(int i=(len<<1);i<=n;i++){
			int x=f[2][i],y=f[2][i-len];
			f[3][i]=x>y?x:y;
		}
		for(int t=1;t<B[2]-B[1];t++){
			len<<=1;
			for(int i=n;i>=(len<<1);i--){
				int y=f[3][i-len];
				if(f[3][i]<y)f[3][i]=y;
			}
		}
	}
	{//3
		int len=1<<B[2];
		for(int i=(len<<1);i<=n;i++){
			int x=f[3][i],y=f[3][i-len];
			f[4][i]=x>y?x:y;
		}
		for(int t=1;t<B[3]-B[2];t++){
			len<<=1;
			for(int i=n;i>=(len<<1);i--){
				int y=f[4][i-len];
				if(f[4][i]<y)f[4][i]=y;
			}
		}
	}
	{//4
		int len=1<<B[3];
		for(int i=(len<<1);i<=n;i++){
			int x=f[4][i],y=f[4][i-len];
			f[5][i]=x>y?x:y;
		}
		for(int t=1;t<B[4]-B[3];t++){
			len<<=1;
			for(int i=n;i>=(len<<1);i--){
				int y=f[5][i-len];
				if(f[5][i]<y)f[5][i]=y;
			}
		}
	}
	unsigned long long sum=0;
	while(q--){
		int l=read()%n+1,r=read()%n+1;
		if(l>r)l^=r^=l^=r;
		int i=0,k=1,tmp=0;
		if(__builtin_expect(r-l>(1<<B[3]),1)){
			i=4+(r-l>(1<<B[4]));
			k=1<<B[i-1];
		}else{
			r-l>(1<<B[0])&&(i=1,k=1<<B[0]);
			r-l>(1<<B[1])&&(i=2,k=1<<B[1]);
			r-l>(1<<B[2])&&(i=3,k=1<<B[2]);
		}
		l--;
		while((l+=k)<=r){
			tmp<f[i][l]&&(tmp=f[i][l]);
		}
		sum+=tmp>f[i][r]?tmp:f[i][r];
	}
	printf("%llu",sum);
	return 0;
}
```