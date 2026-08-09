---
layout: post
title: AI Agent学习
date: 2026-08-09 12:39:54
updated: 2026-08-09
time_warning: true 
cover: 
top: 
tags: 
- AI
categories: 
 - 人工智能
draft: 
# author: @Remsait
---
## agent introduction
  将 chatgpt 理解成一个懂得很多的实习生，但是不知道怎么干活，Agent 就是为 chatgpt装上了手和眼，让其能够操作电脑。
  
  在 agent 中，我们要做的就是在开始和结束节点中间，插入各种我们想要的接口、大语言模型、工具等给 ai 调用，同时给 ai 写足够的提示词，指示 ai 要做什么，怎么做。

  搭建环境需要安装`pip install langchain_openai`，然后在 deepseek 获取`api-key`，创建一个智能体，如下：  
  
```python
# 让ai说一句话
from langchain_openai import ChatOpenAI

# 配置deepseek
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key="your_api_key",
    base_url="https://api.deepseek.com"
)

# 调用模型
response = llm.invoke("你好~")
print(response.content)
```
  更改`api_key`后运行，就能看到deepseek回答的结果。
  
  












  参考：[agent-craft](https://github.com/Annyfee/agent-craft)