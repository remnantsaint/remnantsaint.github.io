---
layout: post
title: 删除链表的倒数第N个节点
date: 2025-08-07 13:16:10
cover: 
top: 
tags: 
 - 链表
categories: 
 - 算法基础
 - 链表
# author: @Remsait
---
## 19. 删除链表的倒数第 N 个结点
[题目链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/)  
给一个链表，删除链表的倒数第 n 个结点，并返回链表的头结点  
使用一趟扫描实现  
### 思路
双指针的经典应用，先让快慢指针拉开 n 个距离，然后一同前进，快指针到结尾的时候，慢指针指的就是倒数第 n 个结点  
定义虚拟头结点 dummyNode 很常用！！！ 不论如何，定义一个虚拟头结点总没错   
代码如下：  
```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        int m = n - 1;
        ListNode* dummyNode = new ListNode(-1);
        dummyNode->next = head;
        ListNode* f = head;
        ListNode* l = dummyNode;
        while(m--){
            f = f->next;
        }
        while(f->next != nullptr){
            f = f->next;
            l = l->next;
        }
        ListNode* q = l->next;
        l->next = q->next;
        delete q;
        q = nullptr;
        return dummyNode->next;
    }
};
```






参考：[代码随想录](https://programmercarl.com/0019.%E5%88%A0%E9%99%A4%E9%93%BE%E8%A1%A8%E7%9A%84%E5%80%92%E6%95%B0%E7%AC%ACN%E4%B8%AA%E8%8A%82%E7%82%B9.html#%E6%80%9D%E8%B7%AF)