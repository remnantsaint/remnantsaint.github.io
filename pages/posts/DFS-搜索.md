---
categories: 搜索
comments: 
cover: 
date: 2023-04-11 12:22:11
image: 
layout: post
tags: 
time_warning: true
title: DFS(搜索)
top: 
---

&emsp; DFS为图论中的概念，详见[DFS(图论)]()页面。在**搜索算法**中，该词常指利用递归函数方便地暴力枚举的算法，与图论中的DFS算法有一定相似之处，但并不完全相同
&emsp; 比如一种例题，n 等于 m 个数相加之和，每个解从小到大排序，列举出解集。暴力求解是用m层循环，每层循环确定一个数，这样显然效率太低，就要用到**递归搜索**。
&emsp; 该类算法的特点在于，将要搜索的目标分成若干层，每层基于前几层的状态进行决策，直到达到目标状态。考虑上述问题，即将正整数 n 分解成小于等于 m 个正整数之和，且排在后面的数必须**大于等于**前面的数
&emsp; 设一组方案将正整数分解成k个正整数$a_1,a_2,.....,a_k$的和
&emsp; 我们将问题分层，第 i 层决定$a_i$。则为了进行第 i 层决策，我们需要记录三个状态变量：后面所有正整数的和（$n-\sum_{j=1}^i{a_j}$）、前一层的正整数（$a_{i-1}$）确保正整数递增；以及$i_{i}$确保最多输出m个正整数。
&emsp; 为了方便记录方案，我们用arr数组，用第 i 项表示$a_i$，注意到arr实际上是一个长度为 i 的栈
&emsp; 代码如下：
```c++
int m, arr[103];
void dfs(int n,int i,int a){//i是元素已有的个数，a是当前元素的值
	if(n == 0){
		for(int j = 1; j <= i -1; j ++){
			printf("%d ",arr[j]);
		}
		printf("%\n");
	}
	if(i <= m){
		for(int j = a; j <= n; j ++){//遍历a之后的元素
			arr[i] = j;
			dfs(n - j, i + 1, j);
		}
	}
}
scanf("%d%d", &n, &m);
dfs(n, 1, 1);
```

例题：[LeetCode 17. Letter Combinations of a Phone Number](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)
难度：中等
题意：模拟九键拼音，输入2~9，每个按键对应三个英文字母，输入一个数字序列[123]，输出对应的所有英文组合
题解：
&emsp; 力扣上的基础搜索回溯题
```c++
class Solution {
public:
    vector<string> letterCombinations(string digits) {
        vector<string> combinations;
        if (digits.empty()) {
            return combinations;
        }
        unordered_map<char, string> phoneMap{
            {'2', "abc"},
            {'3', "def"},
            {'4', "ghi"},
            {'5', "jkl"},
            {'6', "mno"},
            {'7', "pqrs"},
            {'8', "tuv"},
            {'9', "wxyz"}
        };//已经将key和value加入哈希表
        string combination;
        backtrack(combinations, phoneMap, digits, 0, combination);
        return combinations;//返回包含所有符合的string向量
    }
    //注意函数参数的写法
    void backtrack(vector<string>& combinations, const unordered_map<char, string>& phoneMap, const string& digits, int index, string& combination) {
        if (index == digits.length()) {
            combinations.push_back(combination);
        } else {
            char digit = digits[index];
            string letters = phoneMap.at(digit);
            for (char letter: letters) {
                combination.push_back(letter);
                backtrack(combinations, phoneMap, digits, index + 1, combination);
                combination.pop_back();
            }
        }
    }
};

				简化编写（建议学习正规写法）
class Solution {
private: 
    unordered_map<char, string> phoneMap{
        {'2', "abc"},
        {'3', "def"},
        {'4', "ghi"},
        {'5', "jkl"},
        {'6', "mno"},
        {'7', "pqrs"},
        {'8', "tuv"},
        {'9', "wxyz"}
    };//已经将key和value加入哈希表
public:
    vector<string> letterCombinations(string digits) {
        vector<string> combinations;
        if (digits.empty()) {
            return combinations;
        }
        
        string combination;
        backtrack(combinations, digits, 0, combination);
        return combinations;//返回包含所有符合的string向量
    }
    //注意函数参数的写法
    void backtrack(vector<string>& combinations, string digits, int index, string combination) {
        if (index == digits.length()) {
            combinations.push_back(combination);
        } else {
            char digit = digits[index];
            string letters = phoneMap[digit];
            for (char letter: letters) {//循环
                combination.push_back(letter);//string也能用push_back和pop_back来加减元素
                backtrack(combinations, digits, index + 1, combination);
                combination.pop_back();
            }
        }
    }
};

```
参考：[OI Wiki](https://oi-wiki.org/search/dfs/)