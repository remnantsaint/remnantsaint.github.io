---
categories: 其他
comments: 
cover: 
date: 2023-03-29 21:41:37
image: 
layout: post
tags: 
time_warning: true
title: 一些tips
top: 
---

1.定义比较大的数组的时候（例如1e5），要放在全局变量，否则ide会提示段错误
2.ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);清除内存，超内存超时时用，大数据集快不少
3.力扣上说的头结点意思是首元结点，带有数据域，若要删除首元结点，就需要定义一个虚拟头节点dummynode，别忘了分配空间。（翻译问题？）
4.如果从头结点开始遍历，一般让p->next!=NULL；从首元结点开始遍历就让p!=NULL