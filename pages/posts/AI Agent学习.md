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
  
## llm_fundamentals  
  了解什么是 `llm`、`prompt`，并开始独立完成自己搭建的第一个 agent
  
### 了解 LLM
  LLM（Large Language Model），即大语言模型。LLM可以说是 agent 最核心的大脑，没有大脑无法组织起一个 agent 热河的行为，要使用大语言模型，就要获取 api-key 作为接口，在本地自由调用 ai。
  
  LLM 模型分为很多类，比如视觉模型、深度思考、蒸馏模型等等。本地想要部署 LLM一般是蒸馏版用来自己玩玩，微调需要大量的算力资源。
### LLM 怎么调用
  











  参考：[agent-craft](https://github.com/Annyfee/agent-craft)