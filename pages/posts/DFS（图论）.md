---
categories: 图论
comments: 
cover: 
date: 2023-05-09 22:19:58
image: 
layout: post
tags: 
time_warning: true
title: DFS（图论）
top: 
---

#### 引入

DFS全称是[Depth First Search](https://en.wikipedia.org/wiki/Depth-first_search)，中文名是深度优先搜索，是一种用于遍历或搜索树或图的算法。深度优先就是每次都尝试向更深的节点走。

该算法和常与BFS并列，但两者除了都能遍历图的连通块意外，用途完全不同，很少能混用两种算法

DFS常常用来代指用递归函数实现的搜索，但实际上两者并不一样，有关参考[DFS(搜索)](https://www.remsait.com/2023/04/11/DFS-%E6%90%9C%E7%B4%A2/)

#### 过程

DFS 最显著的特征在于其**递归调用自身**。同时与BFS类似，DFS会对其访问过的点打上标记，在遍历图时跳过已打标记的点，以确保**每个点仅访问一次**，符合以上两点便是广义上的DFS

具体地说，DFS大致结构如下：

```python
//只包含DFS必须的主要结构，实际的DFS会在以上代码基础上加入一些代码，利用DFS性质进行其它操作
DFS(v) // v 可以是图中的一个顶点，也可以是抽象的概念，如 dp 状态等。
  在 v 上打访问标记
  for u in v 的相邻节点
    if u 没有打过访问标记 then
      DFS(u)
    end
  end
end

```

#### 性质

该算法通常的时间复杂度为$O(n+m)$，空间复杂度为$O(n)$，其中$n$表示点数，$m$表示边数。


参考：[OI.wiki](https://oi.wiki)