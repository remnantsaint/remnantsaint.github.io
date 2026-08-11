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
  在 deepseek [官方文档](https://api-docs.deepseek.com/zh-cn/)会写如何调用，例子如下：  
```python
from config import OPENAI_API_KEY
from openai import OpenAI

client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a cat girl"}, # 提示词角色
        {"role": "user", "content": "Hello"}, # 用户输入的对话
    ],
    stream=False # 非流式输出, 只会等语句全部生成才返回
)

if not response.choices or response.choices[0].message is None:
    raise ValueError("LLM returned empty or filtered response")
print(response.choices[0].message.content)
```
### Prompt 基础逻辑
  prompt(提示词)是 agent 构建中极其重要德一环，提示 ai 是一个什么身份，在这个身份下应该干什么事情。  
  
  一个 agent 好不好，一定程度上取决于提示词写的好不好，实际上会写更复杂来适应业务，如下：
```
你是一个智能生活助手，具备以下能力：
1. 调用 weather_api(location) 获取指定城市的天气数据
2. 根据温度、降水概率给出穿衣建议
 
请按以下步骤执行：
1. 理解用户需求，确定城市
2. 调用 weather_api 获取天气
3. 分析数据，生成建议
4. 用友好语气回复用户
 
输出规则：
- 如果需要调用工具，只输出 JSON 格式的工具调用指令
- 否则，正常回复用户
 
示例：
用户：北京今天穿什么？
AI：{"tool": "weather_api", "args": {"location": "北京"}}
```
  如上有角色、有流程、有能力（调用工具）、可以自动化，才是 prompt 的正确用法。
  
  prompt 的几个关键概念：
  * Zero/Few-shot：（控制模型生成方式）不给/给几个实例，让模型回答/模仿回答
  * Few-shot 实操：在提示词内直接加几行实例即可（请仿照下列文本格式输出...）
  * Cot（Chain-of-thought）：让模型思考步骤，提高复杂推理准确定
  * Cot 实操：在提示词强调-请逐步思考/思考步骤如下....

### 简单交互实例（多轮问答 agent）
  搭建第一个 agent，先确定好思路：让 ai 当一个老师，教我们历史知识，同时希望它能保持记忆，记住上下文对话。大模型在初始状态下不会保存与用户的对话记忆。
  
```
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"},
    ]
```
  以上除了提供各种角色身份外，它同样有个非常重要的特点：消息列表
  
  这意味着，如果我们想要多轮对话，让 ai 能记住我们的上下文，就可以通过不断往里面追加代码，让 messages 变得越来越多
  
  所以，我们可以通过 `while 1: ` 无限循环的方式不断往里面加 messages 来实现我们的目的。
```python
    while 1:
        response = agent_client.chat.completions.create( # 返回结果存到变量 reponse，这是 api 返回的完整 Json 封装对象
            model="deepseek-chat",
            messages=messages  # 将完整对话传给模型
        )
        answer = response.choices[0].message.content # 取模型返回的第一条模型回答
        print(f'回答:{answer}')
 
        # 询问是否还有其他问题
        user_input =input('您还有其他想继续问的吗 | (exit退出)\n') # 输入字符串存入 user_input
        if user_input == "exit":
            break
 
        # 继续记录对话(涵盖用户追问 + ai上句回答)
        messages.append({"role":"user","content":user_input}) # 把用户新的提问存入历史
        messages.append({"role":"assistant","content":answer}) # 把刚刚 ai 回答存入历史
```
  这里新加了一个新 role： assistant，即助手。它表示的身份是助手，即 ai 大模型自己，所以这里为其添加的 content 是answer。`user`用户说的话；`assistant`ai大模型输出；`system`系统提示词，给模型下达的人设、规则指令（最开头用）；`content`实际对话文本内容。
  
  这样的写法只是 demo，只拥有短期记忆，正规开发的写法不会这么简单，之后会学习用什么样的方式让其有性能更优的长期存储方法。
  
  实例如下：
```python
from config import OPENAI_API_KEY
from openai import OpenAI

client = OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.deepseek.com")
msg = [{"role": "user", "content": "请用一句话生动形象地描述量子力学的奇妙之处。"}]

response_low_temperature = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个科学解说员，请用生动形象的语言回答问题。"}, # 提示词角色
        {"role": "user", "content": "请用一句话描述量子力学的奇妙之处。"}, # 用户输入的对话
    ],
    temperature=0.1
)

response_high_temperature = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个科学解说员，请用生动形象的语言回答问题。"}, # 提示词角色
        {"role": "user", "content": "请用一句话描述量子力学的奇妙之处。"}, # 用户输入的对话
    ],
    temperature=1.3
)


# 测试1：低温度 (稳定)
if not response_low_temperature.choices or response_low_temperature.choices[0].message is None:
    raise ValueError("LLM returned empty or filtered response")
print(f"温度 0.1: {response_low_temperature.choices[0].message.content}")

# 测试2：高温度 (随机)
if not response_high_temperature.choices or response_high_temperature.choices[0].message is None:
    raise ValueError("LLM returned empty or filtered response")
print(f"温度 1.3: {response_high_temperature.choices[0].message.content}")

```
  temperature 合法范围：[0,2] ，数值越高，随机性越强，越容易幻觉，默认1.0，需要严谨时建议调到[0.0,0.3]
## function_calling_tools





  参考：[agent-craft](https://github.com/Annyfee/agent-craft)