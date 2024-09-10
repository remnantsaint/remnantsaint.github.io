---
categories: 
  - 刷题计划
  - 链表
cover: 
date: 2023-04-10 19:37:40
image: 
layout: post
tags:
  - 链表
  - 哈希
time_warning: true
title: LRU缓存
top: 
---

![](https://cdn.jsdelivr.net/gh/remnantsaint/hexoImage@main/20230410194125.png)
难度：中等
链接：[LeetCode 146. LRU Cache](https://leetcode.cn/problems/lru-cache/)
题意：实现一个最近最少使用缓存的数据结构，事先给出缓存区大小，进来一个元素，如果是满的就把最长时间未用的元素挤出去
题解：
&emsp; 手写一个双向链表来存储结点，用哈希表unorder_map（便于查找）来定位<key,value>对，其中value是双向链表的结点。靠近头部的是最新的，靠近尾部的是最久未使用的。
&emsp; 先用哈希表定位，然后找出缓存项的位置，然后操作
&emsp; 对于get操作，若存在，用哈希表定位位置（DLinkedNode *node = cache[key]），然后移动到头结点（注意移动操作是先删除结点后插入到头结点，所以时间复杂度为$O(1)$），最后返回该结点的值
&emsp; 对于put操作，若存在，和get类似，需要更新value；若不存在，创建一个新结点插入到头结点，若size超量，删除尾结点，并erase对应项
```c++
//手写双向链表
struct DLinkedNode {
	int key,value;
	DLinkedNode *prev;
	DLinkedNode *next;
	DLinkedNode(): key(0),value(0),prev(NULL),next(NULL){}
	DLinkedNode(int _key,int _value): key(_key),value(_value),prev(NULL), next(NULL){}
};

class LRUCache {
	private:
		//unordered_map内部实现是哈希表，无序的，优点便于查找
		unordered_map<int,DLinkedNode*> cache;//前数值后结点
		DLinkedNode *head;//虚拟头节点
		DLinkedNode* tail;//虚拟尾结点
		int size;
		int capacity;
		
	public:
		LRUCache(int _capacity): capacity(_capacity),size(0) {
			//初始化
			head = new DLinkedNode();
			tail = new DLinkedNode();
			head->next = tail;
			tail->next = head;
		}
		
		int get(int key) {
			//map的count(key)函数判断是否存在元素
			//区别是即使元素=0，count也返回1
			//对应的erase(key)函数是清除记录
			if(!cache.count(key)){
				return -1;
			}
			//如果存在，先通过哈希表定位，再转移到头部（更新）
			DLinkedNode *node = cache[key];
			moveToHead(node);
			return node->value;
		}
		
		void put(int key, int value) {
			if(!cache.count(key)){
				//如果不存在，创建一个新的结点
				DLinkedNode *node = new DLinkedNode(key,value);
				//添加进哈希表
				cache[key] = node;
				//添加至双向链表的头部
				addToHead(node);
				size++;
				
				if(size > capacity){
					//如果超出容量，删除双向链表的尾部结点
					DLinkedNode *removed = removeTail();
					//删除哈希表中对应的项
					cache.erase(removed->key);
					//防止内存泄漏
					delete removed;
					size--;
				}
			}
			else {
				//若存在，先通过哈希表定位，再更新value，并转移到头部
				DLinkedNode *node = cache[key];
				node->value = value;
				moveToHead(node);
			}
		}
		
		void addToHead(DLinkedNode *node){
			//将node添加到双向链表头结点
			node->prev = head;
			node->next = head->next;
			head->next->prev = node;
			head->next = node;
		}
		
		void removeNode(DLinkedNode *node){
			//删除结点
			node->prev->next = node->next;
			node->next->prev = node->prev;
		}
		
		void moveToHead(DLinkedNode *node){
			//将结点移到头结点，直接删除和添加结点，所以是O(1)
			removeNode(node);
			addToHead(node);
		}
		
		DLinkedNode *removeTail(){
			//删除尾结点
			DLinkedNode *node = tail->prev;
			removeNode(node);
			return node;
		}
};
```