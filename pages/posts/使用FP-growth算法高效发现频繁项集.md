---
layout: post
title: 使用FP-growth算法高效发现频繁项集
date: 2024-09-25 10:18:49
cover: 
top: 
tags: 
  - 机器学习
categories: 
  - 人工智能
  - 机器学习
# author: @Remsait
---
## 前言
在[使用Apriori算法进行关联分析](https://remsait.com/posts/%E4%BD%BF%E7%94%A8Apriori%E7%AE%97%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%85%B3%E8%81%94%E5%88%86%E6%9E%90)中已经介绍了用`Apriori`算法发现 频繁项集 与 关联规则。本文继续关注发现 频繁项集 这一任务，并使用 `FP-growth`算法更有效的挖掘 频繁项集。

## FP-growth 算法
### FP-growth 算法简介
- 一种非常好的发现频繁项集的算法
- 基于 Apriori 算法构建，但是数据结构不同，使用叫做`FP树`的数据结构来存储集合，下面介绍这种数据结构

### FP-growth 算法步骤
- 基于数据构建FP树
- 从FP树中挖掘频繁项集

### FP树 介绍
- FP树的结点结构如下：

```python
class treeNode:
    def __init__(self, nameValue, numOccur, parentNode):
        self.name = nameValue     # 节点名称
        self.count = numOccur     # 节点出现次数
        self.nodeLink = None      # 不同项集的相同项通过nodeLink连接在一起
        # needs to be updated
        self.parent = parentNode  # 指向父节点
        self.children = {}        # 存储叶子节点
```

### FP-growth 原理
&emsp; 基于数据构建FP树
- 步骤1：
	1. 便利所有的数据集合，计算所有项的支持度
	2. 丢弃非频繁的项（图中丢掉支持度小于3的项）
	3. 基于 支持度 降序排列所有的项
![](https://cloudflare.remsait.com/img/FP1.png)
	4. 所有数据集合按照得到的顺序重新整理
	5. 重新整理完成后，丢弃每个集合末尾非频繁的项
![](https://cloudflare.remsait.com/img/FP2.png)

- 步骤2：   
	6. 读取每个集合插入 FP树 中，同时用一个头部链表数据结构维护不同集合的相同项
![](https://cloudflare.remsait.com/img/FP3.png)
&emsp; 解释：
	- 每一个事务都会根据频繁项排序后的结果插入到 FP 树中。
	- 如果某个事务与已有的路径共享前缀，则共享部分合并；如果没有共享部分，则创建新的节点。例如，图中的第一个事务 `{z, r, y, s, t}` 创建了一条路径：`z → r → y → s → t`。
	- 插入下一个事务时，如果存在共享前缀部分，则复用前缀节点，并更新节点的计数。例如，插入 `{z, x, y, s, t}` 时，z 已经存在，所以 z 的计数增加，而 x 是新出现的，所以在 z 后添加了新的节点 x。
&emsp; 最终得到下面这样一棵树：
![](https://cloudflare.remsait.com/img/FP4.png)
&emsp; 从 FP树 中挖掘出频繁项集
- 步骤3：
	1. 对头部链表进行降序排序
	2. 对头部链表节点进行从小到大遍历（从最底层倒推），得到条件模式基，同时获得一个频繁项集
&emsp; 如上图，从头部链表 t 节点开始遍历，t 节点加入到频繁项集，找到以 t 节点为结尾的路径如下：  
![](https://cloudflare.remsait.com/img/FP5.png)
&emsp; 去掉FP树中的t节点，得到条件模式基<左边路径, 右边是值>[z,x,y,s,t]:2，[z,x,y,r,t]:1 。条件模式基的值取决于末尾节点 t ，因为 t 的出现次数最小，一个频繁项集的支持度由支持度最小的项决定。所以 t 节点的条件模式基的值可以理解为对于以 t 节点为末尾的前缀路径出现次数。（条件模式基是指包含 `t` 的所有前缀路径，但不包括 `t` 本身）
	3. 条件模式基继续构造条件 FP树， 得到频繁项集，和之前的频繁项组合起来，这是一个递归遍历头部链表生成FP树的过程，递归截止条件是生成的FP树的头部链表为空。 根据步骤 2 得到的条件模式基 [z,x,y,s,t]:2，[z,x,y,r,t]:1 作为数据集继续构造出一棵FP树，计算支持度，去除非频繁项，集合按照支持度降序排序，重复上面构造FP树的步骤。最后得到下面 t-条件FP树 :
![](https://cloudflare.remsait.com/img/FP6.png)
&emsp; 然后根据 t-条件FP树 的头部链表进行遍历，从 y 开始。得到频繁项集 ty 。然后又得到 y 的条件模式基，构造出 ty的条件FP树，即 ty-条件FP树。继续遍历ty-条件FP树的头部链表，得到频繁项集 tyx，然后又得到频繁项集 tyxz. 然后得到构造tyxz-条件FP树的头部链表是空的，终止遍历。我们得到的频繁项集有 t->ty->tyx->tyxz，这只是一小部分。
- 条件模式基：头部链表中的某一点的前缀路径组合就是条件模式基，条件模式基的值取决于末尾节点的值
- 条件FP树：以条件模式基为数据集构造的FP树叫做条件FP树

### FP-growth 算法优缺点
```
* 优点:  1. 因为 FP-growth 算法只需要对数据集遍历两次，所以速度更快。
        2. FP树将集合按照支持度降序排序，不同路径如果有相同前缀路径共用存储空间，使得数据得到了压缩。
        3. 不需要生成候选集。
        4. 比Apriori更快。
* 缺点:  1. FP-Tree第二次遍历会存储很多中间过程的值，会占用很多内存。
        2. 构建FP-Tree是比较昂贵的。
* 适用数据类型: 标称型数据(离散型数据)。
```












## Reference
<https://github.com/apachecn/ailearning/blob/master/docs/ml/12.md>