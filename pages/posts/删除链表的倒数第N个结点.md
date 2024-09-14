---
categories: 
  - 刷题计划
  - 链表
cover: 
date: 2023-04-01 07:28:59
image: 
layout: post
tags: 链表
time_warning: true
title: 删除链表的倒数第N个结点
top: 
---

![](https://cloudflare.remsait.com/img/20230401072816.png)
用一趟扫描实现：
题解：本题是力扣上的题，注意力扣上说的头结点是指首元结点，带有数据域，那么就需要设置一个虚拟头结点来指向首元结点，用双指针遍历，first遍历到结尾时与second正好相差n个元素
```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {

    ListNode *dummyhead=new ListNode();//设置虚拟头节点
    dummyhead->next=head;

    ListNode *first,*second;
    first=second=dummyhead;
    while(n--){
        first=first->next;//双指针相差n个，
    }
    //此时first与second相差n个，但是当first到结尾时second->next才是要删除的
    while(first->next!=NULL){//遍历到结尾
        first=first->next;
        second=second->next;
    }
    second->next=second->next->next;//删除second->next
    return dummyhead->next;//返回dummyhead->next，因为有可能首元结点被删去，需要用虚拟头结点
    }
};
```
[题目链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china&orderBy=most_votes)