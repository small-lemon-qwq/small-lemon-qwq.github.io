---
title: Fast IO
date: 2026-07-30 20:30:09
---

勿要外传！
{% note info %}
#### note
```cpp
char*__restrict _IO_iptr;
_IO_iptr=(char*)mmap(0,s.st_size,1,2,0,0);
// use (*_IO_iptr++) to getchar.

char _IO_buf[IO_buffer_size+100];
unsigned _IO_optr=0;
#define IO_flush() (fwrite(_IO_buf,1,_IO_optr,stdout),IO_optr=0)
// use (_IO_buf[_IO_optr++]='a') to putchar.
```

```cpp
const char _IO_imp[0x8000]={/*...*/};
const unsigned _IO_omp[10000]={/*...*/};
//two tables.
```

```cpp
#define IO_auto_jump_space //auto jump space
#undef IO_auto_jump_space //jump space by yourself

#define IO_no_special //there is only numbers and spaces in input the input
#undef IO_no_special //may read letters or others

#define IO_buffer_size (1<<16) //set output buffer size by yourself
#ifndef IO_buffer_size
#define IO_buffer_size (1u<<20)
#endif
```

```cpp
IO_pc('a'); //putchar
_IO_pc_nochk('a'); //putchar and not check the buffer
IO_flush(); //fflush(stdout)
IO_pui(1235),IO_pi(-1235); //put (unsigned) int
IO_pull(1235),IO_pll(-1235); //put (unsigned) long long
int x=IO_gui(),y=IO_gi(); //read (unsigned) int
int x=IO_gull(),y=IO_gll(); //read (unsigned) long long
IO_next(2); //jump 2 spaces
```
{% endnote %}
```cpp
#ifdef __unix__
#define _GNU_SOURCE //for fwrite_unlocked
#include<sys/mman.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>
#else
#include<windows.h>
#endif
// #define IO_auto_jump_space
#include<time.h>
#ifndef __cplusplus
#include<ctype.h>
#include<stdio.h>
#include<stdint.h>
#include<stdlib.h>
#else
#include<cctype>
#include<cstdio>
#include<cstdint>
#include<cstdlib>
#endif
#pragma region IO input
char*__restrict _IO_iptr;
#define IO_no_special
__attribute__((constructor))static void _IO_init(){
#ifdef __unix__
	struct stat s;
	fstat(0,&s);
	_IO_iptr=(char*)mmap(0,s.st_size,1,2,0,0);
#else
	HANDLE hFile,hMap;
	hFile=GetStdHandle(STD_INPUT_HANDLE);
	if(hFile==INVALID_HANDLE_VALUE||hFile==0)exit(1);
	hMap=CreateFileMappingA(hFile,0,PAGE_READONLY,0,0,0);
	if(hMap==0)exit(1);
	_IO_iptr=(char*)MapViewOfFile(hMap,FILE_MAP_READ,0,0,0);
#endif
	if(!_IO_iptr)exit(1);
}
#define gc() (*_IO_iptr++)
#define N 0,0,0,0,0,0,0,0,0,0,
#define W N N N N N N N N N N
#define Z W W W W W W W W W W
#define Q Z Z Z Z Z Z Z Z Z Z
#define D(a) a+1,1##a+1,2##a+1,3##a+1,4##a+1,5##a+1,6##a+1,7##a+1,8##a+1,9##a+1,
#define _ W W N N N N 0,0,0,0,0,0,
const char _IO_imp[0x8000]={Q Z Z W W W N N N 0,0,0,0,0,0,D(0)_ D(1)_ D(2)_ D(3)_ D(4)_ D(5)_ D(6)_ D(7)_ D(8)_ D(9)0};
#undef N
#undef W
#undef Z
#undef Q
#undef D
#undef _
#ifdef IO_no_special
#define isdigit(c) ((c)&16)
#else
#define isdigit(c) ((c)>47&(c)<58)
#endif
#define S _IO_imp[*tmp]&&(v=v*100+_IO_imp[*tmp++]-1),
static inline __attribute__((always_inline,hot))int IO_gi(){
	unsigned v=0;
#ifdef IO_auto_jump_space
	int f=0;
	while(__builtin_expect(!isdigit(*_IO_iptr),0))f=*_IO_iptr++==45;
#else
	static int f;
	_IO_iptr+=f=*_IO_iptr==45;
#endif
	uint16_t*tmp=(uint16_t*)_IO_iptr;
	__builtin_expect(_IO_imp[*tmp],1)&&(v=_IO_imp[*tmp++]-1),
	S S S S
	_IO_iptr=(char*)tmp;
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return f?-v:v;
}
static inline __attribute__((always_inline,hot))unsigned IO_gui(){
	unsigned v=0;
#ifdef IO_auto_jump_space
	while(!isdigit(*_IO_iptr))*_IO_iptr++;
#endif
	uint16_t*tmp=(uint16_t*)_IO_iptr;
	__builtin_expect(_IO_imp[*tmp],1)&&(v=_IO_imp[*tmp++]-1),
	S S S S
	_IO_iptr=(char*)tmp;
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return v;
}
static inline __attribute__((always_inline,hot))long long IO_gll(){
	unsigned long long v=0;
#ifdef IO_auto_jump_space
	int f=0;
	while(!isdigit(*_IO_iptr))f=*_IO_iptr++==45;
#else
	static int f;
	_IO_iptr+=f=*_IO_iptr==45;
#endif
	uint16_t*tmp=(uint16_t*)_IO_iptr;
	__builtin_expect(_IO_imp[*tmp],1)&&(v=_IO_imp[*tmp++]-1),
	S S S S S S S S
	_IO_iptr=(char*)tmp;
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return f?-(unsigned long long)v:v;
}
static inline __attribute__((always_inline,hot))unsigned long long IO_gull(){
	unsigned long long v=0;
#ifdef IO_auto_jump_space
	while(!isdigit(*_IO_iptr))*_IO_iptr++;
#endif
	uint16_t*tmp=(uint16_t*)_IO_iptr;
	__builtin_expect(_IO_imp[*tmp],1)&&(v=_IO_imp[*tmp++]-1),
	S S S S S S S S S
	_IO_iptr=(char*)tmp;
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return v;
}
#undef S
#define IO_next(cnt) (_IO_iptr+=cnt)
#undef gc
#undef isdigit
#undef isspace
#pragma endregion
#pragma region IO output
#include<string.h>
#ifndef IO_buffer_size
#define IO_buffer_size (1u<<20)
#endif
char _IO_buf[IO_buffer_size+100];
unsigned _IO_optr=0;
#ifdef __unix__
#define IO_flush() (fwrite_unlocked(_IO_buf,1,_IO_optr,stdout),_IO_optr=0)
#else
#define IO_flush() (fwrite(_IO_buf,1,_IO_optr,stdout),_IO_optr=0)
#endif
#define _IO_chk() (_IO_optr<IO_buffer_size||IO_flush())
#define _IO_pc_nochk(x) (_IO_buf[_IO_optr++]=(x))
static inline __attribute__((always_inline))void IO_pc(char x){_IO_pc_nochk(x),_IO_chk();}
#define A(x) x|48<<24,x|49<<24,x|50<<24,x|51<<24,x|52<<24,x|53<<24,x|54<<24,x|55<<24,x|56<<24,x|57<<24,
#define B(x) A(x|48<<16)A(x|49<<16)A(x|50<<16)A(x|51<<16)A(x|52<<16)A(x|53<<16)A(x|54<<16)A(x|55<<16)A(x|56<<16)A(x|57<<16)
#define C(x) B(x|48<<8)B(x|49<<8)B(x|50<<8)B(x|51<<8)B(x|52<<8)B(x|53<<8)B(x|54<<8)B(x|55<<8)B(x|56<<8)B(x|57<<8)
const unsigned _IO_omp[10000]={C(48)C(49)C(50)C(51)C(52)C(53)C(54)C(55)C(56)C(57)};
#undef A
#undef B
#undef C
#define S _IO_buf+_IO_optr
static inline __attribute__((always_inline,hot))void IO_pui(unsigned y){
	unsigned a=y/100000000u;
	unsigned b=y%100000000u/10000u;
	if(a){
		unsigned c=y%10000u;
		if(a>=10)memcpy(S,(char*)(_IO_omp+a)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(a|48);
		memcpy(S,_IO_omp+b,4),memcpy(S+4,_IO_omp+c,4);
		_IO_optr+=8;
	}else if(b){
		unsigned c=y%10000u;
		if(b>=1000u)memcpy(S,_IO_omp+b,4),_IO_optr+=4;
		else if(b>=100u)memcpy(S,(char*)(_IO_omp+b)+1,3),_IO_optr+=3;
		else if(b>=10u)memcpy(S,(char*)(_IO_omp+b)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(b|48);
		memcpy(S,_IO_omp+c,4);
		_IO_optr+=4;
	}else{
		if(y>=1000u)memcpy(S,_IO_omp+y,4),_IO_optr+=4;
		else if(y>=100u)memcpy(S,(char*)(_IO_omp+y)+1,3),_IO_optr+=3;
		else if(y>=10u)memcpy(S,(char*)(_IO_omp+y)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(y|48);
	}_IO_chk();
}
static inline __attribute__((always_inline,hot))void IO_pi(int x){
	unsigned y;
	if(__builtin_expect(x<0,0))_IO_pc_nochk('-'),y=-(unsigned)x;
	else y=x;
	IO_pui(y);
}
static inline __attribute__((always_inline,hot))void IO_pull(unsigned long long y){
	unsigned a=y/10000000000000000ull;
	unsigned b=y%10000000000000000ull/1000000000000ull;
	unsigned c=y%1000000000000ull/100000000;
	unsigned d=y%100000000/10000;
	unsigned e=y%10000;
	if(a){
		if(a>=1000u)memcpy(S,_IO_omp+a,4),_IO_optr+=4;
		else if(a>=100u)memcpy(S,(char*)(_IO_omp+a)+1,3),_IO_optr+=3;
		else if(a>=10u)memcpy(S,(char*)(_IO_omp+a)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(a|48);
		memcpy(S,_IO_omp+b,4),memcpy(S+4,_IO_omp+c,4),memcpy(S+8,_IO_omp+d,4),memcpy(S+12,_IO_omp+e,4);
		_IO_optr+=16;
	}else if(b){
		if(b>=1000u)memcpy(S,_IO_omp+b,4),_IO_optr+=4;
		else if(b>=100u)memcpy(S,(char*)(_IO_omp+b)+1,3),_IO_optr+=3;
		else if(b>=10u)memcpy(S,(char*)(_IO_omp+b)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(b|48);
		memcpy(S,_IO_omp+c,4),memcpy(S+4,_IO_omp+d,4),memcpy(S+8,_IO_omp+e,4);
		_IO_optr+=12;
	}else if(c){
		if(c>=1000u)memcpy(S,_IO_omp+c,4),_IO_optr+=4;
		else if(c>=100u)memcpy(S,(char*)(_IO_omp+c)+1,3),_IO_optr+=3;
		else if(c>=10u)memcpy(S,(char*)(_IO_omp+c)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(c|48);
		memcpy(S,_IO_omp+d,4),memcpy(S+4,_IO_omp+e,4);
		_IO_optr+=8;
	}else if(d){
		if(d>=1000u)memcpy(S,_IO_omp+d,4),_IO_optr+=4;
		else if(d>=100u)memcpy(S,(char*)(_IO_omp+d)+1,3),_IO_optr+=3;
		else if(d>=10u)memcpy(S,(char*)(_IO_omp+d)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(d|48);
		memcpy(S,_IO_omp+e,4);
		_IO_optr+=4;
	}else{
		if(e>=1000u)memcpy(S,_IO_omp+e,4),_IO_optr+=4;
		else if(e>=100u)memcpy(S,(char*)(_IO_omp+e)+1,3),_IO_optr+=3;
		else if(e>=10u)memcpy(S,(char*)(_IO_omp+e)+2,2),_IO_optr+=2;
		else _IO_pc_nochk(e|48);
	}_IO_chk();
}
static inline __attribute__((always_inline,hot))void IO_pll(long long x){
	unsigned long long y;
	if(__builtin_expect(x<0,0))_IO_pc_nochk('-'),y=-(unsigned long long)x;
	else y=x;
	IO_pull(y);
}
#undef S
#undef _IO_chk
// #undef _IO_pc_nochk
__attribute__((always_inline,destructor))static void _IO_flusher(){IO_flush();}
#pragma endregion
```