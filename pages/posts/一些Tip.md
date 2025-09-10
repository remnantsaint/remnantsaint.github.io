---
categories: 其他
cover: 
date: 2023-03-29 21:41:37
updated: 2025-09-09
image: 
layout: post
tags: 
time_warning: true
title: 一些tips
top: 
---

  定义比较大的数组的时候（例如1e5），要放在全局变量，否则ide会提示段错误

  ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);清除内存，超内存超时时用，大数据集快不少

  力扣上说的头结点意思是首元结点，带有数据域，若要删除首元结点，就需要定义一个虚拟头节点dummynode，别忘了分配空间。（翻译问题？）

  如果从头结点开始遍历，一般让p->next!=NULL；从首元结点开始遍历就让p!=NULL

  用`vector<vector<int>> result`来创建二维数组的时候，如果要用到创建 n 行 m 列，那么就得写成 `vector<vector<int>> result(n, vecotr<int>(m));`，注意列用到了`vector<int>()`   

  pow(2 , k) 是用于计算 2的k次方，返回的是浮点数 double ，但是当 k 特别大时，会出现计算错误，这时要用 `1ULL << k` 来计算 2的k次方，其中 1ULL 表示 `unsigned long long` 类型的数值1  
  
  所有 STL 容器的 size() 返回的都是无符号整数，而 min() 等函数内的类型必须一样，所以要比较首先是用 (int)st.size() 转换一下

  

  