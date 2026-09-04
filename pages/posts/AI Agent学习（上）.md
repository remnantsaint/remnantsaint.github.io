---
layout: post
title: AI Agent学习（上）
date: 2026-08-09 12:39:54
updated: 2026-09-04
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
  本节为智能体加入调用外部函数与功能，让它获得更强的自主性。
### 什么是 function_callings
  前面学的 ai 有局限性，无法知道最新发生的某件事，也没法动手做事，就需要为它加上手，也就是 **function calling**

  function 是函数， calling 是调用，即从外部调用函数给 agent

  上面看起来是局限的事情，有了调用函数的方法后立刻变得简单起来，比如加一个可以联网搜索的 api 接口，或者链接数据库等等。总而言之，当我们为它配备一个函数库，原先那些它无法解决的事情就会通过调用函数库的方式来完成回应。

  function calling 就是 agent 智能体开发的基础。
### 自定义函数调用
  写一个假的小函数作为工具让 agent 调用：
```python
def get_weather(location):
    # 模拟获得天气信息
    return f"{location}当前天气：23℃，晴，风力2级"
```
  封装完后，还需要将其改一下 agent 接受的固定格式：
```python
# 以下格式为固定写法，一般仅需改description与name
get_weather_func = {
    "name": "get_weather",  # 函数名称
    "description": "获取指定城市的天气情况",  # 对该函数的描述
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",  # 该参数类型
                "description": "城市名称，如北京、上海等"  # 对该参数的描述
            }
        },
        "required": ["location"] # 声明必填
    }
}
```
  看起来很复杂，但里面的格式都是固定的，其中需要更改的只有 name， description， paramenters与参数 location。最后的 required 就是要哪些参数加进去。

  封装好 get_weather_func 后就可以将它扔给 tools 作为一个工具了
```python
# 固定写法，有多少个tool就往里追加多少个
tools = [
    {
        "type": "function",
        "function": get_weather_func
    }
]
```
  紧接着，我们就需要让 response 接收这个工具：
```python
def chat_loop(agent_client, tools):
    messages = [
        {"role": "system", "content": "你是一个善解人意会热心回答人问题的助手。如果你感觉你回答不了当前问题，就会调用函数来回答。"},
        {"role": "user", "content": "北京今天的天气怎么样?"}
    ]
    response = agent_client.chat.completions.create(
        model="deepseek-chat",
        messages=messages, # 左边是参数名，右边是自定义变量
        tools=tools,  # 传参
        tool_choice="auto"  # 模型自主选择是否调用工具
    )
    message = response.choices[0].message
```
  对比之前，这里加入了 tools = tools ， tool_choice = "auto"。这里是让 agent 知道可以调用 tools ，auto 是让 agent 选择它是否要调用外部工具来解决问题。

  ai 调用工具与否肯定按两套方式输出：没调直接输出 或 调用了按调用后的输出。但是 ai 返回肯定是第一次只能返回它是否要调用，第二次才能返回它调用后的输出结果，所以这里我们要**二次调用**才能最终生成答案，因此完整代码构建如下：
```python
from config import OPENAI_API_KEY
from openai import OpenAI
import json

def create_client():
    return OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.deepseek.com")

def get_weather(location):
    # 模拟获得天气信息
    return f"{location}当前天气：23℃，晴，风力2级"

# 以下格式为固定写法，一般仅需改description与name
get_weather_func = {
    "name": "get_weather",  # 函数名称
    "description": "获取指定城市的天气情况",  # 对该函数的描述
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",  # 该参数类型
                "description": "城市名称，如北京、上海等"  # 对该参数的描述
            }
        },
        "required": ["location"]  # 声明必填
    }
}

# 固定写法，有多少个tool就往里追加多少个
tools = [
    {
        "type": "function",
        "function": get_weather_func
    }
]

def chat_loop(agent_client, tools):
    messages = [
        {"role": "system",
         "content": "你是一个善解人意会热心回答人问题的助手。如果你感觉你回答不了当前问题，就会调用函数来回答。"},
        {"role": "user", "content": "北京今天的天气怎么样?"}
    ]
    # 第一次调用 api，告诉 ai 可以调用工具
    response = agent_client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        tools=tools,  # 调用工具
        tool_choice="auto"  # 模型自主选择是否调用工具
    )
    if not response.choices or response.choices[0].message is None:
        raise ValueError("LLM returned empty or filtered response")
    message = response.choices[0].message
    # 如果有该参数，证明ai调用了工具
    if message.tool_calls:
        # 对每个可能要调用的工具进行循环
        for tool_call in message.tool_calls:
            if tool_call.function.name == "get_weather":
                # 解析参数
                args = json.loads(tool_call.function.arguments)  # 模型返回的arguments是JSON字符串，用json.loads转成python字典
                location = args.get("location", "未知地点") # 从字典取出location，如果没有就填"未知地点"

                # 在本地运行这个函数
                weather_info = get_weather(location)

                # 将函数执行结果以"tool"角色传给模型，等待后面二次调用
                messages.append(message)  # 先添加模型的原始响应
                messages.append({ # 构造一条 role=tool 的笑稀，把本地函数运行结果加进去
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_call.function.name,
                    "content": weather_info
                })
        # 第二次调用，让模型基于工具返回的结果再生成最终答案
        final_res = agent_client.chat.completions.create(
            model="deepseek-chat",
            messages=messages
        )
        print('已调用工具...')
        if not final_res.choices or final_res.choices[0].message is None:
            raise ValueError("LLM returned empty or filtered response")
        print(f'回答:{final_res.choices[0].message.content}')
    else:
        # 模型没有要调用工具, 直接返回
        print('未调用工具...')
        if not response.choices or response.choices[0].message is None:
            raise ValueError("LLM returned empty or filtered response")
        print(f'回答:{response.choices[0].message.content}')

if __name__ == '__main__':
    client = create_client()
    chat_loop(client, tools)
```
  总结一下流程：
```python 
User Input
    ↓
LLM (第一次调用) → 决定调用哪个工具
    ↓
执行函数（get_weather）
    ↓
把结果以 "tool" 角色塞回去
    ↓
LLM (第二次调用) → 生成最终回答
```
### API 调用
  上面写的是自己虚构的函数，下面接入一个真实存在的 api 测试。与上述流程大同小异，需要注意下新加的工具的 api 的文档使用方法，传入 api 与使用时的格式也要注意。

  ipapi 这个网站能获取 ip 地址与对应城市，且不需要 api-key，直接向对应地址发送请求即可：
```python
def get_addr():
    res_ip = requests.get('https://ipapi.co/ip/').text
    res_city = requests.get('https://ipapi.co/city/').text
    return f'ip地址:{res_ip},所在城市:{res_city}'

if tool_call.function.name == "get_addr":
    # 解析参数
    # args = json.loads(tool_call.function.arguments)  # 获取用户关键词的参数
    # location = args.get("location")
    # 调用真实参数
    # your_info = get_weather(location)
    # 这里无参数，直接调用函数就行
    your_info = get_addr()
    
get_addr_func = {
    "name": "get_addr",  # 函数名称
    "description": "获取用户的ip地址与城市",  # 对该函数的描述
    "parameters": {
        "type": "object",
        "properties": {}, # 参数为空，那么这两个地方也是空的
        "required": []  
    }
}
```
  完整代码如下：
```python
from config import OPENAI_API_KEY
from openai import OpenAI
import requests

def create_client():
    return OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.deepseek.com")

# 通过api调用获得当前ip与位置
def get_addr():
    res_ip = requests.get('https://ipapi.co/ip/').text
    res_city = requests.get('https://ipapi.co/city/').text
    return f'ip地址:{res_ip},所在城市:{res_city}'

get_addr_func = {
    "name": "get_addr",  # 函数名称
    "description": "获取用户的ip地址与城市",  # 对该函数的描述
    "parameters": {
        "type": "object",
        "properties": {}, # 参数为空，那么这两个地方也是空的
        "required": []
    }
}

tools = [
    {
        "type":"function",
        "function":get_addr_func
    }
]

def chat_loop(agent_client,tools):
    messages = [
        {"role": "system","content": "你是一个善解人意会热心回答人问题的助手。如果你感觉你回答不了当前问题，就会调用函数来回答。"},
        {"role": "user", "content": "我现在在哪个城市，ip地址是多少?"}
    ]
    response = agent_client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        tools=tools,
        tool_choice="auto"
    )
    if not response.choices or response.choices[0].message is None:
        raise ValueError("LLM returned empty or filtered response")
    message = response.choices[0].message
    if message.tool_calls:
        for tool_call in message.tool_calls:
            if tool_call.function.name == "get_addr":
                # 解析参数
                # args = json.loads(tool_call.function.arguments)  # 获取用户关键词的参数
                # location = args.get("location")
                # 调用真实参数
                # your_info = get_weather(location)

                # 这里无参数，直接调用函数就行
                your_info = get_addr()
                messages.append(message)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_call.function.name,
                    "content": your_info
                })
                final_res = agent_client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages
                )
                print('已调用工具...')
                if not final_res.choices or final_res.choices[0].message is None:
                    raise ValueError("LLM returned empty or filtered response")
                print(f'回答:{final_res.choices[0].message.content}')
    else:
        # 模型没有要调用工具，直接返回
        print('未调用工具...')
        if not response.choices or response.choices[0].message is None:
            raise ValueError("LLM returned empty or filtered response")
        print(f'回答:{response.choices[0].message.content}')

if __name__ == '__main__':
    client = create_client()
    chat_loop(client, tools)
```
  这个过程很繁琐，里面很多工具都是可以封装的，后面会讲**langchain**，在这个框架中，早就封装好了这些复杂的东西。

## langchain_basics
  经过前几章的学习，已经能靠自己造轮子搭建 agent。但是存在很多问题：比如封装方式不统一、接口五花八门、鲁棒性差等等。用 `Langchain`可以帮我们干完造轮子的活，并统一接口，提高代码的复用性等。

  Langchain 是当前最知名的 agent 框架。
### 了解 Langchain（语言链
  Langchain 作为一个模块，它的其中一个核心就是链：把不同的重要模块用链连接起来，作为一个统一的接口一起输出。

  本节以做出一个基于 Langchain 的智能体为目标，帮助尽快了解并学会使用 Langchain。[官方文档](https://docs.langchain.com/oss/python/langchain/overview)
### 六大核心模块概述
  Langchain 很多核心模块，就是对前面几章的内容，只不过换了种写法。

#### Models
  就是 LLM，只是更规范了，就是之前调用的大模型。调用方式几乎一致，主要变化是：导入路径变了（from langchain_openai import ChatOpenAI）；接口更统一：（所有模型都支持 .invoke()），本质还是 输入消息->返回回复。

  Models 是"标准化的 LLM 调用方式"
#### Prompt
  名字没变，用法也基本一样，变化在于：支持更多格式；可以与 Messanges 集成；和 Chain 无缝组合。它不再是字符串拼接工具，而是 “可执行的模板"

  Prompt 是"会说话的输入"
#### Chain
  表面作用：把 Prompt、LLM、Parser(解析器) 等模块串起来形成流水线

  核心作用：统一接口，实现"可组合编程"。所有模块都实现 .invoke()、.stream() 等方法；用 `|`操作符自由连接，像搭积木一样构建应用，一切皆为 Runnable(可运行接口)。

  Chain 不是功能，而是通信协议，让 AI 组件能即插即用。
#### Memory
  功能还是记住上下文，但不再靠手动 messages.append({})。

  LangChain 提供了：标准的记忆管理；自动注入 prompt、支持长期记忆、摘要、向量记忆等高级模式；使用方式从"脚本式"变为"声明式’。

  Memory 是"可插拔的记忆系统"
#### Agents
  本质是就是前面写的 Function Calling —— 让 AI 调用外部工具，但是我们自己写时，要手动判断调用哪个函数、手动解析参数、控制流程、容错低。

  Langchain 的 Agents：把这些重复的工作封装了，引入 ReAct 框架（Thought->Action->Observation）、支持多步推理、自动循环、错误恢复，成为一个自主决策系统。

  Agents 是会自己做决定的 AI
#### RAG
  一句话理解：AI 在回答前，先从资料库中找答案，然后看着找到的内容来回答，确保不瞎编。

  技术上：把文档切片->向量化->存入向量数据库；用户提问时，检索最相关的文本片段；拼入 prompt，让 LLM 基于此生成回答。

  它不是简单的 ”导入文件"，而是一套 语义检索+上下文增强 的系统。

  RAG 是"开卷考试"模式，让 AI 基于你的数据回答问题。

---
  以上就是 Langchain 的六大核心模块，其中 Models、Prompt、Chain、Memory 相对知识点较少，会在本节中讲完。
### Models
  代码实现：
```python
from langchain_openai import ChatOpenAI
# 初始化模型
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
# 调用模型
response = llm.invoke('你好喵')
print(response.content)
```
  说明： llm 是一个"可调用对象"；`.invoke()`是 LangChain 的统一接口。

  Langchain价值：把不同厂商的 LLM 调用接口合并为 .invoke()，方便后续组合
### Prompt
  代码实现：
```python
from langchain_core.prompts import ChatPromptTemplate
# 定义提示词模板(推荐写法)
prompt = ChatPromptTemplate.from_messages([
        ("system","你是一个猫娘，说完话后面都会带个喵"),
        ("human","{input}") # {input}:占位符
])
# 格式化输出
formatted_prompt = prompt.invoke({"input":"你好呀"})
print(formatted_prompt) # 输出的是发给大模型的请求消息，没有调用LLM，需要 llm.invoke(formatted_prompt)
```
  说明：`ChatPromptTemplate.from_messages` 是最通用、最推荐的写法，支持 system、human、ai 角色；{input} 是变量，后续可被 Chain 自动填充；返回的是 PromptVlaue ，可直接传给LLM

  这里的作用可以理解为是把提示词写完，仅仅是写提示词，如果想使用的话，得再接入 llm。
### Chain
  逻辑构思：这里的 Chain 就需要我们分好几步，依次按照之前我们讲的模块顺序输出即可。
  1. 定义提示词模板
```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "你非常可爱，说话末尾会带个喵"),
    ("human", "{input}")  # {input}:占位符
])
```
  2. 初始化模型
```python
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
```
  3. 定义解析器
```python
parser = StrOutputParser()
```
  LLM 返回格式一般是像我们之前所见的 AIMessage[{xxx}]... 之类的看起来非常繁琐的格式。parser 这里确定好解析器，相当于直接对其 .content，拿到其中最重要的东西，并指定一个想最终输出的格式类型。比如这里要求的是 StrOutputParser，输出就是 Str 类。

  4. 组成 chain 并输出
```python
# 组成Chain
chain = prompt|llm|parser

# 最终调用
result = chain.invoke({"input":"你好喵"})
print(result)
```
  此处 chain 内的 | 顺序不能调换，格式必须固定。管道符 | 就是从左向右执行。简化了很多。

### Memory
  chain 的动作是线性的：prompt 给 ai 写问题，llm 让 ai 回答， parser 确定输出格式。

  而 Memory 的逻辑则不同，它是要独立出去，作为一种状态存在，持续记录上下文。

  所以我们写法就得与 chain 独立开来：
```python
# ...
prompt = ChatPromptTemplate.from_messages([
    ("system", "你非常可爱，说话末尾会带个喵"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")  # {input}:占位符
])
# ...
```
  我们在 system 与 human 中间新增了个 `MessagePlacehoolder`，叫作 history 的占位符，它的作用就是在其中加入以往的历史对话，让它拥有记忆功能。其他地方 llm 与 parser 等跟之前一样。

  再者，我们需要存储对应的会话历史，需要专门写一个函数存储，同时还希望这个会话能隔离不同用户对话记录：
```python
# 存储所有会话历史(可用数据库替换)
# 此处用字典模拟，也可替换成Redis、SQL等
store = {}
 
def get_session_history(session_id:str):
    """根据session_id获取该用户的聊天历史"""
    if session_id not in store:
        store[session_id] = ChatMessageHistory() # 创建新的历史记录
    return store[session_id]
```
  这里的 store 可以自主改成某个数据库链接，get_session_history 是目前较基础的记录聊天历史功能。后续想扩展长期存储、或对接数据库存储都可以再做延伸。

  最后我们将其包装成一个带记忆的 Runnable：
```python
# 包装成带记忆的Runnable
runnable_with_memory = RunnableWithMessageHistory(
    runnable=chain,
    get_session_history=get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)
```
  **runable**：我们之前做好的 chain；**get_session_history**：获取聊天记录的函数；**input_messages_key**：用户提问的占位符：**history_messages_key**：提示词中间的聊天历史记录占位符。

  全部写完后就可以写个 while 1 函数测试一下，假设好某个用户的 session_id：
```python
session_id = 'user_123'
while 1:
    user_input = input("\n你:")
    if user_input=="quit":
        print('拜拜喵!')
        break
    response = runnable_with_memory.invoke(
        {"input":user_input},
        config={"configurable":{"session_id":session_id}}
    )
    print(f'AI:{response}')
```
### 实战
  如下是一个用 Langchain 搭建的一个 Agent，有固定人设，能记住用户对话内容，可以多轮对话，不调用工具与查阅资料，基于 Langchain 框架完成的 Agent。
```python
from config import OPENAI_API_KEY
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import RunnableWithMessageHistory
def create_bot(llm,sys_prompt):
    """
    :param sys_prompt: 系统提示词
    :param llm: 已配置好的语言模型实例
    :return:
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system",sys_prompt),
        MessagesPlaceholder(variable_name="history"),
        ("human","{input}")
    ])
    parser = StrOutputParser()
    chain = prompt | llm | parser
    store = {} # 全局字典，存储所有对话
 
    def get_session_history(session_id):
        return store.setdefault(session_id,ChatMessageHistory())
 
    return RunnableWithMessageHistory(
        runnable=chain,
        get_session_history=get_session_history,
        input_messages_key="input",
        history_messages_key="history"
    )
 
def main():
    # 此处集中配置LLM
    llm = ChatOpenAI(
        model="deepseek-chat",
        api_key=OPENAI_API_KEY,
        base_url="https://api.deepseek.com"
    )
    prompt = """你是‘小智’，一位专业、耐心且记忆力出色的 AI 助手。
    你善于倾听，能记住用户之前提到的信息，并在后续对话中自然提及。
    回答时简洁明了，避免冗余。"""
    bot = create_bot(llm,prompt)
    session_id = '123'
    while 1:
        user_input = input('\n你:')
        if user_input == "quit":
            print('拜拜')
            break
        response = bot.invoke({"input":user_input},config={"configurable":{"session_id":session_id}})
        print("AI:",response)
 
 
if __name__ == '__main__':
    main()
```
## langchain_advanced
  本节主要讲让 Agent 会调用函数，也就是 langchain 的 Agents 模块。
### ReAct 循环与 @tool
  在第三章中就已经手动造轮子，知道其原理与过程，Langchain 的 Agents 模块的思路大体也是一致的，只是使用方法变更了下。在学习 Agents 之前，需要先了解 Agents 的关键零件。

  1. 零件一：ReAct 循环——agent 的大脑

    ReAct = Reason（推理/思考） + Action（行动），以下是 Agent 内部思考的逻辑循环：
```
思考：LLM 分析任务（我要查看天气）
行动：调用 find_weather 函数
观察：Langchain 自动调用该工具函数并返回数据
思考：LLM 观察到结果，并思考（已经拿到数据，可以回复用户）
行动：回复用户今天天
```
  如果想看到这个流程，可以在输出时候带上 verbose = True，来看看 ai 内部的思考过程
  2. 零件二：工具——@tool

    Agent 的手和脚，用以定义 Agent 能做什么

  Langchain 为我们封装了一个 @tool 装饰器，可以一键将任意 python 函数封装为 Agent 可用的工具，下面用一段代码演示：
```python
from langchain_core.tools import tool
 
@tool
def get_weather(location):
    """模拟获得天气信息"""
    return f"{location}当前天气：23℃，晴，风力2级"
@tool
def get_user_name(user):
    """模拟获得用户名字"""
    return f'用户名字是:{user}'
 
# 封装好我们要用的工具
tools = [get_weather,get_user_name]
print('工具箱已封装完毕!')
```
  当用 @tool 封装某个函数作为工具时，必须要用 `"""xxx"""` 来为其添加描述信息。这段描述信息不是注释，而是这个工具的提示词，如果不添加就会直接报错。添加完后，llm 就会根据该提示词来判断是否调用这个工具。
### 通用 Agent
  当我们构建一个涵盖 Agents（工具调用）模块的智能体时，我们就必须借助一些新的创建 agent 的函数了。`create_xxx_agent`有几个不同的函数，这里我们只拿出两个最为常用的来说。

  `create_tool_calling_agent`：它返回结构化的 tool_calls 请求，稳定且准确

  组成顺序：1. LLM；2. Prompt；3. Tools（工具列表）；4. create_tool_calling_agent：把上面三个组装成 agent（大脑）；5. AgentExecutor：Agent 的执行体（身体），负责真正运行 ReAct 循环

  Prompt 配置需要注意：
```python
# prompt配置
prompt = ChatPromptTemplate.from_messages([
    ("system","你是一个聪明的智能助手。当你遇到解决不了的问题时，会调用工具来解决问题。"),
    ("human","{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad") # 必加，Agent的思考过程
])
```
  当使用 create_tool_calling_agent 时，必须加上这行`MessagesPlaceholder(variable_name="agent_scratchpad")`，它代表一个临时记事本，会记录整个 ReAct 流程（思考-动作-观察），并将整个思考过程再让 llm 看到，从而做出下步决策。

  tools 配置也跟之前差不多，这里要记一下 agent 与 agent_executor 的创建流程：
```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

# ---------------------- 1. 定义工具 ----------------------
@tool
def get_weather(location):
    """模拟获得天气信息
    Args:
        location: 城市名称
    """
    return f"{location}当前天气：23℃，晴，风力2级"

@tool
def get_user_name(user):
    """模拟获得用户名字
    Args:
        user: 用户id
    """
    return f'用户名字是:{user}'

tools = [get_weather, get_user_name]

# ---------------------- 2. 实例化 llm ----------------------
llm = ChatOpenAI(
    api_key="你的key",
    base_url="https://api.deepseek.com",  # deepseek；换成qwen也可以
    model="deepseek-chat",
    temperature=0
)

# ----------------------3. 构建agent需要的prompt ----------------------
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是有用的助手，可以调用工具解决用户问题"),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),  # ✅工具调用agent必备占位符！存思考+工具中间结果
])

# ----------------------4. 创建agent大脑 + 执行器 ----------------------
agent = create_tool_calling_agent(llm=llm, prompt=prompt, tools=tools)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# ----------------------5. 运行 ----------------------
response = agent_executor.invoke({
    "input": "今天北京的天气怎么样？"
})

print("\n====完整response字典====")
print(response)
print("\n====最终输出给用户的文字====")
print(response["output"])

```
  整个输出流程是：`lm - prompt - tools - create_tool_calling_agent - AgentExecutor`

  chain 模块已经被封装在 create_tool_calling_agent 里面了，就是`agent = create_tool_calling_agent(llm=llm,prompt=prompt,tools=tools)`

  这个函数将 Chain 作为内部推理核心环节，并在此基础上构建了一个支持记忆、工具调用和循环决策的智能体框架。虽然之后不会再显示创建 Chain ，但实际上仍在沿用 chain 的思想。

  这种事通用 Agent，可以根据场景选择 diy 工具调用，是一个可扩展 Agent 框架，足以应付我们绝大多数场景的工具使用。但是有些场景需要特化 Agent。
### SQL 专用 Agent
  领域专用 Agent 的封装要求极高，需场景广泛、接口标准、结构清晰，SQL 查询是完美范例。

  它高频、规范、结构明确，却重复繁琐，如果每次都要手动构建工具链，效率会相当差。`create_sql_agent`正是为此而生——开箱即用，一键实现自然语言查数据库，大幅简化开发流程。 

  不需要手动定义 tools，只需要给一个 db 连接；它会自动“反思”：先查表结构，再编写 sql，执行 sql，再根据结果回答；它的 Prompt 已经高度优化，能处理复杂的 SQL 逻辑。

  代码编写如下：
```python
from langchain_openai import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent

llm = ChatOpenAI(
    api_key="xxx",
    base_url="xxx",
    model="xxx"
)

db_uri = f'sqlite:///{db_file}'
db = SQLDatabase.from_uri(db_uri)

agent_executor = create_sql_agent(
    llm=llm,
    db=db,
    agent_type="openai-tools",
    verbose=True
)

response = agent_executor.invoke({"input":"告诉我Alice多大了？"})
print(response['output'])

```
  可以看出，我们仅配置了 llm 与 db，其他啥都没干，就做好了 sql_agent。
### 融合工具与记忆
  拿本节的通用 Agent 为例，我们为其加入记忆功能。
```python
# 配置prompt(新增俩占位符 一个为对话历史记录，一个为agent的思考过程)
prompt = ChatPromptTemplate.from_messages([
    ('system','你是小智，一个帮助他人的智能助手。当你无法解答当前问题时，会调用工具来解决问题。'),
    MessagesPlaceholder(variable_name="history"),
    ('human','{input}'),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])
```
  Prompt 这里就是俩占位符都需要，分别作为记忆与工具查询使用。
```python
from config import OPENAI_API_KEY
from langchain_openai import ChatOpenAI
from langchain_classic.agents import AgentExecutor
from langchain_classic.agents import create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool # 导入 @tool
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import RunnableWithMessageHistory

# 配置llm
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
# 配置prompt(新增俩占位符 一个为对话历史记录，一个为agent的思考过程)
prompt = ChatPromptTemplate.from_messages([
    ('system','你是小智，一个帮助他人的智能助手。当你无法解答当前问题时，会调用工具来解决问题。'),
    MessagesPlaceholder(variable_name="history"),
    ('human','{input}'),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

# 配置tool
@tool
def get_weather(location):
    """模拟获得天气信息"""
    return f"{location}当前天气：23℃，晴，风力2级"

tools = [get_weather]
# 配置agent
agent = create_tool_calling_agent(llm=llm,prompt=prompt,tools=tools)
# 配置AgentExecutor
agent_executor = AgentExecutor(agent=agent,tools=tools) # 这里没加verbose=True，想打印日志看思考链的可以自行打印


# 记忆存储--包装agent_executor
store = {}
def get_session_history(session_id:str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# 添加记忆功能
agent_with_memory = RunnableWithMessageHistory(
    runnable=agent_executor,
    get_session_history=get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)
# 打印测试
session_id = 'user123'
if __name__ == '__main__':
    while 1:
        user_input = input('\n你:')
        if user_input == 'quit':
            print('拜拜~')
            break
        response = agent_with_memory.invoke(
            {'input': user_input},
            config={'configurable': {'session_id': session_id}}
        )
        print(f"AI:{response['output']}")
```
### 高阶技巧：缓存&流式
  现在所作的 Agent 已经很不错，但是还有两个致命问题：每次运行 Invoke 都在烧钱；用户每次运行都必须等整个 ReAct 跑完才能得到想要的答案。下面我们依次解决这俩问题：

  1. 缓存

    你写好了一个比较复杂的项目Agent，有七八个重要组件，你需要确定它们都能成功运行。于是你开始调试，调试了二三十次，确定满意没有问题了。接着一看 llm 的 token 调用：也花了二三十次的 token 钱...

  简单讲就是跳过 llm 调用这一环节，优先保证其他所有模块测试都没啥问题，等其他都完毕后再去掉缓存测试一遍 llm 调用，这样只用花费一次 token 调用的钱。当问题完全一样时，直接从缓存拿答案。

  所以在开发测试时推荐加入该功能，但是在真正生产端环境必须去掉，毕竟它只是回答结果复用，没有任何智能，使用方法也简单：`set_llm_cache(InMemoryCache())`
```python
# 设置全局缓存
set_llm_cache(InMemoryCache())
 
# 第一次调用llm(会远程请求)
query = "用中文写一句关于猫的五言诗。"
start_time = time.time()
response1 = llm.invoke(query).content
print(f"第一次调用结果: {response1}")
print(f"第一次运行时间: {time.time() - start_time:.4f} 秒")
print('')
 
# 第二次调用llm(会命中缓存)
start_time = time.time()
response2 = llm.invoke(query).content
print(f"第二次调用结果: {response2}")
print(f"第二次运行时间 (已缓存): {time.time() - start_time:.4f} 秒")
 
# 清理
set_llm_cache(None) # 关闭缓存，以免影响后续实例
print('缓存清理完成')
```
  如上，当缓存命中时几乎不费时

  2. 流式

  回想一下，当在网页用 ai 时，它们输出都是一点点排列出来的，这就是流式输出，像流水一样。

  而我们目前的输出必须完整跑完才能看到答案，接下来就为其加入流式输出：
```python
# 配置llm
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com",
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)
```
  这里注意一下 llm 的配置：`streaming = True`即允许流式输出；`callback = [StreamingStdOutCallbackHandler()]`一个回调处理器，当 llm 每生成一个 token 时，自动将其打印到终端上。其他代码不用动，最后循环时稍微改一下：
```python
if __name__ == '__main__':
    while 1:
        user_input = input('\n你:')
        if user_input == 'quit':
            print('拜拜~')
            break
        # 用于标记"AI:"这个内容
        # flush=True保证"AI:"立即输出，而不是等缓存区存满再输出
        print("AI: ", end="", flush=True) # end=""取消换行
        response = agent_with_memory.invoke(
            {'input': user_input},
            config={'configurable': {'session_id': session_id}}
        )
        print() # 输出换行符
```
 这里不需要`print(response['output'])`，因为 callbacks 做到了生成 token 时自动打印到终端。

 同时不能像`print(f"AI:{response['output']}")`这样写 AI： 了，得单独列出来写一下。
## rag_basics
  rag 能让 agent 访问本地知识库，智能检索出我们想要的某个数据。
### Rag 概念与它的核心流程
#### Rag 概念
  Rag（Retrieval-Augumented Generation）：检索增强生成
```
检索（Retrieval）：从外部知识库中寻找与问题相关的信息
增强（Augmented）：将检索到的信息作为上下文，提供给大模型（LLM）
生成（Generation）：LLM 结合检索到的信息，生成更准确、更可靠的回答
```
  它的最大功能就是让 llm 能“开卷考试”，也就是让他能查询知识库。本节关注点就是检索，有了合理的检索，才能增强（给 LLM 学习），并生成（LLM 给回答）。
#### Rag 核心流程
  我们可以拆分出 rag 两条线的运行流程：
  1. 模块 A：rag 的“离线准备”（Offline Indexing）  

    把你的文档全部读一遍，拆成“知识卡片”（Chunks），并为每张卡片贴上“语义标签”，再把这些有“语义标签”的卡片上架到向量数据库。这个阶段没有 LLM 参与，纯数据处理，它可能很慢，但是只需做一次。
  2. 模块B：RAG 的“在线运行（Online R-A-G Flow）  

    当用户提问时，去智能图书馆里检索，找出相关的”知识卡片“，然后把”卡片“和”问题“一起交给 LLM（生成）。这个阶段 LLM 才会参与，每次提问时都会执行。

  模块 A 的”离线操作“是 R-A-G 中的 R（检索）前提，完成这个离线操作才能进行检索；模块 B 的”在线运行“才是完整的 R-A-G 流程。   

  所以我们会先讲这个”离线操作“的模块 A 的三大组件：加载与分块 & 向量化 & 存储

  学会这三步后才能做好这个”智能图书馆“，模块 B 的”在线运行“的 R-A-G 才能围绕着这个图书馆运行起来。同时，我们的检索精准与否，完全与这个图书馆内部的三大组件息息相关。
### 核心组件一：加载与分块（Load & split）-（准备“知识卡片”）
#### 加载与分块的必要性
  1. 加载（Load）  

    我们“私有知识”的来源五花八门，可能是 .txt 文本、pdf 报告、csv 表格，甚至可能使网页或者 Notion 笔记。所以，确定一套统一的阅读器（loader）来读懂这些格式，并最终转化为 Langchain 认识的标准格式（Document对象），这就是加载的价值。  

  2. 分块（Split）  

    加载进来的 Document 可能非常大，但 LLM 的“桌子“（上下文长度）是有限的，比如 4k、8k、128k tokens，我们不可能将整本书都塞给他，必然要对其进行优化处理。因此，我们做法就是：将整本书切成一块块的”知识卡片“（Chunks）。

  关键参数 `- chunk_size` ：切好的”知识卡片“的大小上限
  * 权衡：切好的”知识卡片“的大小上限。如果 size 太小，会使得语义割裂，答案被切割成两半；太大则会出现上下文噪点（llm 找不到重点）。
  * 硬约束：必须小于使用的 Embedding 模型最大 Token 上限（比如 bge-small-zh-v1.5 为 512 token）。
  * 数据约束：在主流中文向量模型中，1 中文字符约为 1 token，所以设 chunk_size = 250-300 是一个很安全的上限。

  关键参数`- chunk_overlap`：不同”知识卡片“可重叠的字符大小
  * 目的：如果分块造成”语义割裂”，chunk_overlap 可以允许一定字符进行“知识卡片”间的拼接，确保语义不丢失。
  * 通常设定：一般为 chunk_size 的 10%-20%

  这俩关键参数必须留意，建议根据具体情况配置。同时这里俩参数调优的性价比与其他模块相比非常高，所以单独讲一下。Rag 的开头找数据这里如果没配置好，那么智能是“垃圾进，垃圾出”，后面的检索也没有任何意义了。
#### 工具
  对于“加载”与“分块”，Langchain 都提供了专业的加载器与分割器：

  Document Loaders（加载器）：
  * TextLoader：对应 .txt 文件
  * PyPDFLoader：对应 .pdf 文件（需要 pypdf 库）
  * CSVLoader：对应 .csv 文件，它会将每一行视为一个独立的 Document。

  Text Splitters（分割器）：
  * RecursiveCharacterTextSplitter：最推荐最智能的默认分割器
  * 它就是“造轮子”的“最终版”，它会自动按 ["\n\n", "\n", " ", ""] 的优先级列表来分割，最大限度地保留语义的完整性。
  * 实战配置（针对TXT）：我们的 txt 文本是高度结构化的，以 \n 作为模块自然分割，最长文本“模块05”约为190字符；设定 chunk_size = 250，它小于 Embedding 设置的 512 token 限制，非常安全，且大于任何一个单独模块（如190字符的），保持每个模块的语义完整；设定 chunk_overlap = 40，设置其为 chunk_size 的15%-20%，作为“安全垫”，防止未来某个模块超过 250 字符，即设定“知识卡片”最高可有 290 个字符。

  以下是具体加载与分割的代码：
```python
import os
from langchain_community.document_loaders import TextLoader # 加载
from langchain_text_splitters import RecursiveCharacterTextSplitter # 分割
 
# 创建一个演示txt文件
knowledge_base_content = """
### 模块 01 — Agent 入门 & 环境搭建
- **目标**：理解 Agent 概念，完成环境配置与首次调用。
- **内容**：环境依赖｜API Key 配置｜最小可运行 Agent
### 模块 02 — LLM 基础调用
- **目标**：掌握模型调用逻辑，初步构建智能体能力。
- **内容**：LLM了解与调用｜Prompt编写与逻辑构思｜多轮对话记忆｜独立搭建一个智能体
### 模块 03 — Function Calling 与工具调用
- **目标**：实现 LLM 调用外部函数，赋予模型“执行力”。
- **内容**：Function calling原理｜工具函数封装｜API接入实践｜多轮调用流程｜Agent能力扩展
### 模块 04 — LangChain 基础篇
- **目标**：认识Langchain六大模块，学会用Langchain构建智能体。
- **内容**：LLM 调用｜Prompt 设计｜Chain 构建｜Memory 记忆｜实战练习
### 模块 05 — LangChain 进阶篇
- **目标**：掌握Langchain Agents的核心机制，构建能调用工具、持续思考、具备记忆的智能体。
- **内容**：Function Calling｜@tool 工具封装｜ReAct 循环｜Agent 构建｜SQL Agent｜记忆+流式｜开发优化
"""
 
with open('knowledge_base.txt','w',encoding='utf8') as f:
    f.write(knowledge_base_content)
 
# 1.加载
# TextLoader 读取.txt文件，并将其转换为Document对象
loader = TextLoader('knowledge_base.txt',encoding='utf8')
docs = loader.load()
print(f'{docs}已加载完成!')
 
# 2.分割
text_splitter = RecursiveCharacterTextSplitter(
    # 本节重点
    chunk_size=250, # 设定的chunk块大小(字符数),
    chunk_overlap=40 # 设定的重叠大小(字符数)
)# 创建分割器的配置模板
splits = text_splitter.split_documents(docs) # 切割成chunk块
 
print(f'分块结果:{len(splits)}')
 
for i,doc in enumerate(splits):
    print(f'片段{i+1}(长度:{len(doc.page_content)})')
    print(doc.page_content)
    print('-'*100+'\n')
 
# 观察：
# 我们的文本被分割成了四块，没有一块的长度超过250.
# 所以没有用到overlap(重叠)，这是最好的结果
```
  chunk_overlap 本来作用就是兜底，没有用到证明“分块”策略成功，理想情况下应该是闲置的。

### 核心组件二：向量化（Embedding）-（贴上语义标签）
#### 理论：什么是 Embedding
  我们已经把知识切分成了小卡片（chunk），接下来我们还要为它贴上“语义标签”，这样计算机才能看懂它是什么意思。

  传统搜索：如果用关键词匹配，搜“小狗”就永远也找不到“金毛犬”卡片。  
  语义搜索：我们希望计算机立结“小狗”和金毛“是相似的概念。  
  Embedding（向量化）的作用：Embedding 模型在此刻就能作为一个”翻译官“，把任何一段文字（知识卡片）转换为一串独特的数字，这些数字就是“向量”。  
  “向量”就是“语义坐标”，小狗 和 金毛 在语义坐标上是非常接近的，所以计算机能认出他们是相似概念。

  另外，不同 Embedding 模型产生的向量在语义表达能力、维度、上下文感知能力、长度支持等方面是不同的，有些模型专门适配短文本，有些适合长文本，有些适合情感分析，又有些适合专门领域如法律等。选模型也是一门学问。
#### 工具：Langchain 的 Embedding 方案
  所谓 Embedding 方案，说简单点就是 如何将文本转换为向量 的解决方案。

  对于社区已经有的 云/本地 方案，我们可以自行选择：

  * 方案1（在线 API）：如 BaichuanTextEmbeddings 或 OpenAIEmbeddings
    * 优点：效果好，速度快，不占本地资源
    * 缺点：需要API Key，并且按 Token 收费

  * 方案2（本地模型）：HuggingFaceEmbeddings
    * 优点：完全免费，数据 100% 在本地，保护隐私
    * 缺点：第一次运行需要下载模型，并且会消耗本地 CPU/GPU 资源

  本片我们首选开源本地模型 HuggingFaceEmbeddings 使用，代码如下：
```python
from embeddings import get_embeddings
 
# 首次运行可能时间较久 -- 同时运行本文件需要梯子，不然无法加载到本地
print('---正在加载本地嵌入模型(bge-small-zh-v1.5)...---')
 
# 理论：有embedding的向量模型
embeddings_model = get_embeddings("bge-small-zh-v1.5")
print('嵌入模型载入完毕')
 
# 演示：将文本转换为向量
text = "模块05的目标是什么"
query_embedding = embeddings_model.embed_query(text)
 
# 验证：向量存在，而且有具体数值
print(f'文本:{text}')
print(f'向量(前五维):{query_embedding[:5]}')
print(f'向量维度:{len(query_embedding)}')

"""
---正在加载本地嵌入模型(bge-small-zh-v1.5)...---
嵌入模型载入完毕
文本:模块05的目标是什么
向量(前五维):[0.023142, 0.057231, -0.012413, 0.041251, -0.033627]
向量维度:512
"""
```
  如上，我们成功用工具完成了小段文本的向量化工作，后续我们再想要完成类似操作，也这样做即可。

  如下是从 embeggings.py 搬运过来的 get_embeddings 这个文件：（教程作者自己封装）
```python
# 本文件用于下载并获取embedding向量化模型
 
from pathlib import Path
from langchain_huggingface import HuggingFaceEmbeddings
 
# 获取embeddings模型 - 首次调用时自动下载
def get_embeddings(model_name="BAAI/bge-small-zh-v1.5",device="cpu",**kwargs):
    # 支持更换其他向量化模型
    local_dir = Path("models")/model_name.replace("/", "_")
    if not local_dir.exists():
        print(f'⚠️ 首次使用嵌入模型，正在下载到{local_dir.absolute()}')
        print("💡 提示：需要联网(必需梯子)，完成后可离线使用")
        from huggingface_hub import snapshot_download
        # 模型下载工具
        snapshot_download(
            repo_id = model_name,
            local_dir = local_dir,
        )
        print('✅ 下载完成！')
 
    # 构造参数字典
    model_kwargs =  {
            "device":device,
            "local_files_only": True,  # 仅使用本地文件
        }
 
    # 此处实例化时，把kwargs传入
    _EMBEDDINGS = HuggingFaceEmbeddings(
        model_name = str(local_dir), # 使用本地已下载的模型
        model_kwargs = model_kwargs,
        **kwargs # 允许传入参数
    )
    return _EMBEDDINGS
```
  此代码用于 首次下载与加载向量化模型（必须开梯子下载），首次下载完成后会存在本地，之后会从本地加载，不需要重复下载。之后所有 RAG 相关会非常频繁的引入该 embeddings.py 文件使用。
### 核心组件三：存储（Store）-（建造”智能图书馆“）
  如果说上步的 Embeddings 目标是如何把文字变成向量，那么这一步的存储的目标则是有了向量后，如何快速找到最相似的那个。

  我们已经有了文档切片（splits）和向量化（Embedding），接着就要为这些向量构建一个高效的搜索索引。
#### 理论：向量搜索
  在向量化的世界里，一切的核心都是向量（Vector），每个 split（知识片段）都被 embeddings_model 转换成了一个高维知识向量，未来用户的 query（问题）也会被转换成一个查询向量。

  我们的目标是：在由成千上万个”知识向量“构成的空间中，找到与”查询向量“语义最相似的那几个。很明显，如果用暴力搜索去存储并检索，for 循环检索速度能极慢。所以我们肯定还是需要借助工具：向量索引（Vector Index）

  （离线阶段）建索引：向量索引工具会分析所有知识向量的分布，并构建一个高效的内部结构（如图、树或哈希表），这个过程可能耗时，但只需做一次。

  （在线阶段）检索：当一个新的查询向量到来时，它会利用索引结构进行”跳跃式“搜索，直接定位到最可能相关的区域，将复杂度降低到非常小的级别。（具体算法如近似最近邻、余弦相似度等）

#### 框架：选择你的向量索引工具 FAISS & Chroma
  FAISS（Facebook AI Similarity Search）

  * 定位：一个极致轻量的向量搜索库，专注于高性能的索引构建与搜索
  * 优点：
    * 速度快：专为高性能向量搜索设计
    * 纯本地：数据和索引完全在您自己的机器上，安全且无需网络
    * 简单高效：API 直观，非常适合学习和快速原型开发
  * 缺点：
    * 功能相对基础，主要用于”建索引 + 搜索“，不擅长复杂的文档生命周期管理（如增删改查）。
  * 适合场景：适合基础使用，快速体验 RAG 的核心离线流程。

  Chroma

  * 定位：一个功能完整的向量数据库，内置了索引能力
  * 优点：
    * 支持文档的增删改查，API 更友好
    * 支持持久化存储（重启后数据不丢失）
    * 可以作为独立服务运行
  * 适合场景：当需要更复杂的文档管理时

  本章中我们选用 FAISS 来构建并保存一个本地的向量索引，为后续的实时检索做好准备，以下是完整的初始化向量数据库构建的代码：
```python
# 仅负责: 切片 -> 向量化 -> 构建索引 -> 保存到磁盘
# 运行一次即可，无需每次检索都运行
from embeddings import get_embeddings
import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
 
# 准备知识库内容
knowledge_base_content = """
### 模块 01 — Agent 入门 & 环境搭建
- **目标**：理解 Agent 概念，完成环境配置与首次调用。
- **内容**：环境依赖｜API Key 配置｜最小可运行 Agent
### 模块 02 — LLM 基础调用
- **目标**：掌握模型调用逻辑，初步构建智能体能力。
- **内容**：LLM了解与调用｜Prompt编写与逻辑构思｜多轮对话记忆｜独立搭建一个智能体
### 模块 03 — Function Calling 与工具调用
- **目标**：实现 LLM 调用外部函数，赋予模型“执行力”。
- **内容**：Function calling原理｜工具函数封装｜API接入实践｜多轮调用流程｜Agent能力扩展
### 模块 04 — LangChain 基础篇
- **目标**：认识Langchain六大模块，学会用Langchain构建智能体。
- **内容**：LLM 调用｜Prompt 设计｜Chain 构建｜Memory 记忆｜实战练习
### 模块 05 — LangChain 进阶篇
- **目标**：掌握Langchain Agents的核心机制，构建能调用工具、持续思考、具备记忆的智能体。
- **内容**：Function Calling｜@tool 工具封装｜ReAct 循环｜Agent 构建｜SQL Agent｜记忆+流式｜开发优化
"""
 
with open("knowledge_base.txt",'w',encoding='utf8') as f:
    f.write(knowledge_base_content)
 
 
# 1. 加载并切分文档 (Load&Split)
loader = TextLoader("knowledge_base.txt",encoding='utf8')
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=250,chunk_overlap=40) # 载入切分器模板
splits = text_splitter.split_documents(docs) # 运行切分器
print(f'p1完成，文档已切分成{len(splits)}个片段\n')
 
# 2. 向量化(Embedding)
embeddings_model = get_embeddings() # 载入向量化模型
print(f'p2完成，Embedding模型已准备\n') #
 
# 3. 存储(Store)
db = FAISS.from_documents(splits,embeddings_model) # 将分割块与向量化的模型传递给FAISS，FAISS会使用它们并完成最终向量数据库的构建。
 
db.save_local("faiss_index")
print(f'p3完成，向量数据库{db}已构建')
 
# 清理临时文件
os.remove("knowledge_base.txt")
 
print('---所有阶段已经完成!---')
```
  运行后会构建一个向量数据库，目录是`faiss_index`，里面包含 index.faiss 和 index.pkl 

  前三步的初始化（离线模块）已完成，在正式进入 RAG 前，我们再把这个离线的三步流程梳理一遍：

    第一步：文本通过加载与分割（chunking，含 overlap）
    第二步：对每个 chunk 进行向量化（embedding）
    第三步：将向量 + 原文 + 元数据存入向量数据库 

  其中向量数据库这里不用做过多考虑，对不同文本的操作而言，主要得在前两步思考：切割与向量化。

  向量模型是针对切片 chunk 做向量化的，而不是整个文本。所以 chunk 的 token 数应尽可能接近 embedding 模型的最大支持长度，但必须 <= 上限。

  最后总结一下，设计 RAG 时，应：
  1. 先分析原始文本长度和结构
  2. 选择支持足够上下文长度的 embeddging 模型
  3. 设定 chunk_size ≈ 模型最大长度（但要≤），并加入合理 overlap
  4. 确保每个 chunk（含 overlap）都不超过模型上限；
  5. 向量数据库只需匹配向量维度，无需过多关注（当成一个存储用的仓库）

### 让 Agent "开卷考试"：检索+生成的完美闭环
  拥有向量数据库后，我们就可以正式开始 RAG 的”在线运行“（Online R-A-G Flow）

  1. R-A-G 流程拆解

  回顾 chain 思想，我们学过 LCEL 的 | 管道符，这个链条正好完美对应了 R-A-G 三个词：

  * R（Retrieval - 检索）：retriever = db.as_retriever()
    * 我们把前文构建的 db 变成一个 retriever（检索器）对象。
  * A（Augmented - 增强）：prompt = ChatPromptTemplate.from_template(...)
    * 我们定义一个 Prompt 模板，它包含两个变量：{context}（来自 R）和{question}（来自用户）
  * G（Generation - 生成）：llm = ChatOpenAI(...)(...)
    * 最后，把”增强后“的 Prompt 交给 LLM 去”生成“答案

  2. format-docs：数据的适配器

  按上述做法，我们会遇到数据格式冲突的问题：

  * R（Retriever）的输出时：List[Document]（一个 Document 对象的列表，即一叠文档）。
  * A（Prompt）的 {context} 槽位需要的是：str（一个字符串，即一段连续的文本）。

  RAG 最终只接收用户的一句话问题，但 Prompt 同时需要两份东西。如果直接输出的话，格式可能是：
```python
docs = [
    Document(page_content="模块05的目标是掌握LangChain Agents的核心机制"),
    Document(page_content="构建能调用工具、持续思考、具备记忆的智能体")
]
```
  format-docs 函数就是用来解决这个冲突的”适配器“：输入 LIst[Document] -> 输出 str。
```python
# 4. 辅助函数：将检索到的Doc原始文档对象格式化为字符串
def format_docs(docs):
    # 遍历 List[Document]，取出每个 doc 的 page_content，用换行符 \n 拼成一个大字符串
    return "\n".join(doc.page_content for doc in docs)
```
  这样原文就会变成：
```
模块05的目标是掌握LangChain Agents的核心机制
构建能调用工具、持续思考、具备记忆的智能体
```
  3. 用一个输入，驱动整个 RAG 流程

  在 RAG 中，Prompt 需要两个变量：

  * {context}：来自向量检索
  * {question}：用户的原始提问

  但是我们调用链时只会传入一个输入：`rag_chain.invoke("模块05的目标是什么？")`

  如何让这个单一输入，能同时满足“检索用的问题”与“LLM要的问题”？

  关键在于这个机制：`{"context": retrieve | format_docs, "question": RunnablePassthrough()}`

  它做了一个“双线逻辑”：一条线走“context”：将传入的问题向量化，再通过去文档进行检索，并将结果格式化再返回；一条线走“question”：将传入的问题不向量化，直接返回给 LLM 作为提问内容。

    用户问题
    ├─检索 → 格式化 → context
    └─question 原样传给 LLM

  这样，我们就能用一个输入，生成一个包含两个字段的字典，完美匹配 Prompt 的需求。

  RunnablePassthrough() 的本质是：保留原始输入，让它不被检索链“吃掉”

  同时还要额外注意下：LCEL 时图执行模式。RunnablePassthrough() 不是让链跑两遍，而是让同一个输入生成两路数据，形成 R 与 G 的闭环。

  综上，完整 RAG 链条代码如下：
```python
from embeddings import get_embeddings
from config import OPENAI_API_KEY
import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
 
# --- 模块A (离线操作) ---
# 1. 加载&分割 2. 向量化 3. 存储
KNOWLEDGE_BASE_CONTENT = """
### 模块 01 - Agent 入门 & 环境搭建
- **目标**: 理解 Agent 概念, 完成环境配置与首次调用。
- **内容**: 环境依赖 | API Key 配置 | 最小可运行 Agent
### 模块 02 - LLM 基础调用
- **目标**: 掌握模型调用逻辑, 初步构建智能体能力。
- **内容**: LLM 了解与调用 | Prompt 编写与逻辑构思 | 多轮对话记忆 | 独立构建一个智能体
### 模块 03 - Function Calling 与工具调用
- **目标**: 实现 LLM 调用外部函数, 赋予模型“执行力”。
- **内容**: Function calling 原理 | 工具函数封装 | API 接入实践 | 多轮调用流程 | Agent 能力扩展
### 模块 04 - LangChain 基础篇
- **目标**: 认识 LangChain 六大模块, 学会用 LangChain 构建智能体。
- **内容**: LLM 调用 | Prompt 设计 | Chain 构建 | Memory 记忆 | 实战练习
### 模块 05 - LangChain 进阶篇
- **目标**: 掌握 LangChain Agents 的核心机制, 构建能调用工具、持续思考、具备记忆的智能体。
- **内容**: Function Calling | @tool 工具封装 | ReAct 循环 | Agent 构建 | SQL Agent | 记忆+流式 | 开发优化
"""
with open("knowledge_base.txt", "w", encoding="utf-8") as f:
    f.write(KNOWLEDGE_BASE_CONTENT)
 
loader = TextLoader('knowledge_base.txt',encoding='utf8')
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=250,chunk_overlap=40)
splits = text_splitter.split_documents(docs)
embedding_model = get_embeddings("bge-small-zh-v1.5")
db = FAISS.from_documents(splits,embedding_model) # 在内存中构建向量索引，但不持久化到本地文件
print('---模块A(Indexing)完成---\n')
 
# --- 模块B (在线运行:Online R-A-G Flow) ---
print('--- 模块B R-A-G正在构建---\n')
 
# 1. R (Retrieval - 检索)
retrieve = db.as_retriever(search_kwarg={"k":1}) # 只返回最相关的1个
 
# 2. A (Augmented - 增强)
system = """
请你扮演一个 Ai Agent 教学助手。
请你只根据下面提供的“上下文”来回答问题。
如果上下文中没有提到，请回答“对不起，我不知道”。
[上下文]:
{context}
[问题]:
{question}
"""
prompt = ChatPromptTemplate.from_messages([
    ('system',system),
    ('human','{question}')
])
 
# 3. G (Generation - 生成)
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
 
# 4. 辅助函数：将检索到的Doc原始文档对象格式化为字符串，让llm能读懂
def format_docs(docs):
    return "\n".join(doc.page_content for doc in docs)
 
 
# 5. 组装 RAG 链条(LCEL)
rag_chain = (
    {"context":retrieve | format_docs,"question":RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
 
# --- 运行 RAG 链 ---
 
question = '模块05的目标是什么？'
response = rag_chain.invoke(question)
print(f'提问:{question}')
print(f'回答:{response}\n')
 
question = 'Langchain进阶篇讲了什么？'
response = rag_chain.invoke(question)
print(f'提问:{question}')
print(f'回答:{response}\n')
 
question = '今天天气怎么样？'  # 知识库中没有
response = rag_chain.invoke(question)
print(f'提问:{question}')
print(f'回答:{response}\n')
 
# 清理临时文件
os.remove("knowledge_base.txt")
```
## rag_advanced
  上一篇我们遗留了几个痛点：FAISS 知识个玩具，它是个内存索引，重启就会丢失，且无法增删改；搜索结果不准，“相似度搜索”只是海选，返回的结果可能不精确，LLM 容易被误导；没有记忆，不理解上下文，说了上句忘记下句；与之前的 agent 割裂

  综上，本篇会分别从“强化 RAG 立案条件”与“扩展 RAG 应用能力”两个场景来解决这四大痛点。最终打造一个“健壮“、”智能“、”集成”的终极 RAG Agent。

  本篇使用 3.2MB 的《战争与和平》（war_and_peace.txt）作为知识库测试。
### 升级智能图书馆：从 FAISS 到 Chroma
  FAISS 本质上是一个内存向量索引库，虽然支持通过 save_local() 将索引保存在磁盘，但它的持久化能力非常有限：保存的是一次性的静态快照，无法进行后续的增删改（CRUD）；一旦知识库需要更新，只能重新建整个索引；原始文本、元数据和向量需手动分别管理，容易出错且难维护。

  这在需要持续迭代、动态扩展的 RAG 系统中是不可接受的。相比之下，Chroma 是一个真正的轻量级向量数据库：通过 persist_directory 将向量、原始文档和元数据统一持久化到磁盘；支持后续增量添加、删除或更新数据，无需重建；加载已构建的索引只需一行代码，极大简化了“离线构建+在线查询”的过程。

  虽然 FAISS 在纯检索性能上可能略优，但 Chroma 在工程易用性、可维护性和可扩展性上更适合实际 RAG 应用。通过拆分构建与查询阶段，我们不仅避免了重复向量化，还未未来功能扩展打下了坚实基础。

| 特性 | FAISS | Chroma |
| --- | --- | --- |
| 能否保存？ | 能，使用 `db.save_local()` | 能，使用 `persist_directory` 和 `.persist()` |
| 保存的是什么？ | 一个静态快照：向量索引 + 嵌入时的文档副本 | 一个可读写的数据库目录，包含向量、文档、元数据、集合信息 |
| 能否后续增删改？ | 不方便，需要自行维护并重新保存索引 | 能，支持 `.add_documents()`、`.delete(ids=...)`、`.update()` |
| 是否自动持久化？ | 否，需要手动调用 `save_local()` | 可在操作后自动持久化，也可手动调用 `.persist()` |
| 适合场景 | 一次性构建、只读检索 | 需要动态更新、长期维护的知识库 |

  以下是 build_index.py，在索引构建阶段创建好 Chroma 向量数据库，为后续 rag 流程做准备。只需运行一次
```python
import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from embeddings import get_embeddings
 
knowledge_base_file = "war_and_peace.txt"
# 持久化目录: Chroma会把所有数据(向量+文本+元数据)都存到这个文件夹
persist_directory = './chroma_db_war_and_peace_bge_small_en_v1.5'
model_name_str = 'BAAI/bge-small-en-v1.5' # 如果愿意等待，可以换成模型"BAAI/bge-m3"，效果更好更适合长文，但下载时间也更久(2.2G)
chunk_size = 500
chunk_overlap = 75
 
# 检查是否已创建
if os.path.exists(persist_directory):
    print(f"检测到已存在的向量数据库: {persist_directory}")
    print("跳过索引构建。如需重新构建，请手动删除该目录。")
    exit()
 
if not os.path.exists(knowledge_base_file):
    print(f"错误: 知识库文件 {knowledge_base_file} 未找到。")
    print("请从 https://www.gutenberg.org/ebooks/2600.txt.utf-8 下载")
    print("并重命名为 war_and_peace.txt 放在当前目录。")
    exit()
 
print('---正在构建索引---')
 
# 1. 加载
loader = TextLoader(knowledge_base_file,encoding='utf8')
docs = loader.load()
print('加载完成...\n')
# 2. 分割
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size,
    chunk_overlap=chunk_overlap
)
splits = text_splitter.split_documents(docs)
print('分割完成...\n')
# 3. 向量化 -- 第一次运行会下载模型,预计耗时2分钟
print(f'正在加载/下载模型{model_name_str}...')
embedding_model = get_embeddings(
    model_name=model_name_str,
    device='cpu', # 强制模型在cpu上运行
    encode_kwargs={'batch_size':64} # 每次处理64个文本片段
)
print('Embedding模型加载完成...\n')
# 4. 存储
print('正在构建Chroma索引...(注：此步耗时较久，预计要3min)\n')
db = Chroma(
    persist_directory=persist_directory,
    embedding_function=embedding_model
)
 
#   分批添加切片chunks（每批不超过 5000）
batch_size = 5000  # 必须 < 5461
for i in range(0, len(splits), batch_size):
    batch = splits[i:i + batch_size]
    db.add_documents(batch)
    print(f"已插入 {min(i + batch_size, len(splits))} / {len(splits)} 条")
 
print(f'✅ 索引构建完毕，共 {len(splits)} 条，已保存到 {persist_directory}')
```
  运行后会生成向量数据库文件夹：`chroma_db_war_and_peace_bge_small_en_v1.5`，另外，Langchain 默认会一次性把所有 chunk 全部丢给 Chroma，但 Chroma 一次只能接收至多 5461 条记录，所以我们得专门注意下分开传，本质是 Langchain 与 Chroma 的集成不太好。

  然后实际用代码对接这个向量数据库，运行 RAG 链条，看效果如何：
```python
from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from embeddings import get_embeddings
from config import OPENAI_API_KEY
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
 
Persist_directory = './chroma_db_war_and_peace_bge_small_en_v1.5'
model_name_str = 'BAAI/bge-small-en-v1.5'
 
if not os.path.exists(Persist_directory):
    print(f"错误: 知识库文件 {Persist_directory} 未找到。")
    print("请先运行'00_build_index.py'生成向量数据库，再运行该文件")
    exit()
 
print('---加载本地向量数据库---')
 
# 模块A:链接本地Chroma向量数据库
# 1. 加载 Embedding 模型
# 把“用户提问”转成向量，用于后续检索
print(f'正在加载/下载模型{model_name_str}...')
embeddings_model = get_embeddings(
    model_name=model_name_str,
    device='cpu'
)
 
# 2. 从本地目录加载Chroma DB
db = Chroma(
    persist_directory=Persist_directory,
    embedding_function=embeddings_model
)
print(f'Chroma数据库已从本地加载(共{db._collection.count()}条)\n')
 
# 模块B:R-A-G Flow
# 1. R-检索
retriever = db.as_retriever(search_kwargs={"k": 5})  # 召回5条相关数据
 
# 2. A-增强
sys_prompt = """
你是一个博学的历史学家和文学评论家。
请根据以下上下文回答问题。如果上下文**强烈暗示**了答案，即使未明说，也可推理回答。
如果完全无关，请回答“对不起，根据所提供的上下文我不知道”。
[上下文]: {context}
[问题]: {question}
"""

prompt = ChatPromptTemplate.from_messages([
    ('system', sys_prompt),
    ('human', '{question}')
])
 
# 3. G-生成
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
 
# 4. 辅助函数
def format_docs(docs):
    return "\n".join(doc.page_content for doc in docs)
 
 
# 5. 组装RAG链条(LCEL)
rag_chain = (
    {"context":retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
# 运行RAG链
print('---正在运行RAG链条---')
question = '莫斯科大火发生在小说的哪一部分？有哪些角色亲历了这场灾难？'
response = rag_chain.invoke(question)
print(f'提问:{question}')
print(f'回答:{response}')
```
```
用户问题
  -> Embedding 模型转向量
  -> Chroma 找 5 段最相近的《战争与和平》文本
  -> 文本拼接为 context
  -> context + 原问题发送给 DeepSeek
  -> DeepSeek 输出最终回答
```
  注意：需要把 Prompt 提示词写松一点，如果提示词写的非常死，它哪怕看到了很多关键信息，也会因为限制太死板不会正确输出。如果写的稍微松一点，LLM 可以很轻松的根据相应内容判断出答案是什么。

  可以看出，除了在开头加载一下已经构建好的向量数据库，其他操作几乎都和 FAISS 时差不多，但这个 RAG 链条的性能还是比基奥羸弱，比如问一些不是强语义的信号，不是文中反复提及的问题，这个 RAG 可能就检索不到。下面就来加强这个索引能力。

### 升级“检索质量”：引入 Reranker 精排机制
#### 为什么需要升级？
  在基础 RAG 流程中，我们通常直接使用向量数据库的相似度检索结果：`retriever = db.as_retriever(search_kwargs={"k": 3})  # 召回3条相关数据`，这种做法存在明显局限：

  * 仅依赖向量距离判断相关性，无法理解语义匹配的深层逻辑
  * 召回结果可能“语义相近但事实无关”
  * 容易导致“垃圾进，垃圾出”—— LLM 基于不准确或不想管的上下文生成错误答案

  为解决这一问题，我们需要在“粗召回”后增加一个精排序（Re-ranking）步骤

  升级方案：三步构建高质量检索管道，我们将原始的单步检索拆解为以下三个阶段：

  1. 粗召回  
    扩大初始召回范围，获取更多候选文档
```python
base_retriever = db.as_retriever(search_kwargs={"k": 50})  # 海选前五十
```
  2. 精排序  
    引入交叉编码器（Cross-Encoder）对候选文档进行查询-文档对级别的相关性重打分：
```python
encoder = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
reranker = CrossEncoderReranker(model=encoder, top_n=5)  # 精选 Top-50
```
  3. 管道封装（Pipeline Integration）  
    使用 ContextualCompressionRetriever 将粗召回与精排序无缝串联
```python
compression_retriever = ContextualCompressionRetriever(
    base_retriever=base_retriever,   # 负责广度覆盖
    base_compressor=reranker         # 负责精度筛选
)
retriever = compression_retriever
```
  这样就既保留了足够多的候选信息（避免漏检），又通过更强的语义模型过滤噪声，显著提升最终上下文的相关性。

#### RAG核心参数剖析：k 与 top_n 的博弈
  这里再详细剖析一下这个 k 与 top_n，它是一个 rag 检索中极其重要的一个知识点。

  我们假设这是个面试：

  第一步（海选）：Chroma 向量数据库（Vector Store）会通过向量相似度算法，对公司收到的10000份简历（数据库里的所有切片），让HR（Base Retriever）用关键词快速扫一眼，挑选出了前50个人（k=50）。（此处没用到reranker模型，速度极快）

  第二步（面试）：海选出来的50个人（k=50）被送到面试官（Reranker）的房间，面试官必须逐一面完这五十个人并给其打分。（所以k的数量直接定义了Reranker的工作量，它是耗时最久的部分）

  第三步（录取）：将五十人按分数从高到低，录取前6个人（top_n=6）给老板（LLM）看。

  很明显，从 rag 检索流程来看，其最终返回结构准确与否，极大程度上取决于最终录取者质量是否合格。而这又与 k 和 top_n 的数值非常强相关。文本越大，自然可以认为我们需要更多的 k 和 top_n ，但如何针对不同的文本进行数量的优化也是个问题。

  * k —— 算力与时间的消耗（Latency）RAG 的主要耗时就在 Reranker 这一步，耗时随着 k 的增加呈线性增长，在 CPU 环境下，大约每增加 1 个 k ，耗时增加 0.05s。
    * k越大，召回率越高，但也越慢
  * top_n —— 金钱与 Token 的消耗（Cost）最终录取的 top_n 是要喂给 LLM 的，假设切片大小（chunk_size）为 500 字符，top_n = 6 意味着要输入 3000 个字符（约 2000 Tokens）
    * top_n 越大，信息越丰富，但越贵

  综上，k 和 top_n 构成了 RAG 质量的双重保险。不怕花时间（追求召回率），就大幅提升 k ，让 reranker 加班，保证不错过任何蛛丝马迹。不怕花钱（追求全能），就适当提升 top_n，给 LLM 投喂更多上下文。

  k 几乎是越大越好，但 top_n 不是，过大的人 top_n 会导致**中间迷失效应**（Lost in the Middle），即噪声太多反而干扰了 LLM 对关键信息的提取。

  R部分完整代码：（其他部分保持不变）
```python
# 1. R-检索--强化版
# 1.1 基础检索器(Base Retriever) - '粗召回'
base_retriever = db.as_retriever(search_kwargs={"k":50}) # K调大到60
# 1.2 Reranker (重排器) - "精排序" -- 首次运行需要耗时下载
print('正在加载 Reranker模型 (bge-reranker-base)...')
encoder = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base") # 加载Ranker模型
reranker = CrossEncoderReranker(model=encoder,top_n=6) # 对检索结果进行精排
# 1.3 创建管道封装器
compression_retriever = ContextualCompressionRetriever(
    base_retriever=base_retriever, # 用Chroma做 海选
    base_compressor=reranker # 用Reranker做 精选
)
retriever = compression_retriever
 
print('--检索器已升级为Reranker模式--\n')
```
#### RAG 优化小节
  至此， RAG 的基础与进阶优化基本完成，作为 Agent 系统中最关键也最容易被低估的模块之一，RAG 的构建质量直接决定了整个系统是否可用、可信、好用。

  尤其注意，没有通用的 RAG 配置，应根据文本规模、领域特性与查询复杂度，动态选择：

  * 合适的 Embedding 模型（如小文本可用 bge-small，大文档或专业领域建议 bge-large 或 bge-m3）；
  * 匹配的检索策略（如是否引入 Reranker、是否结合关键词搜索、是否采用 Parent-Document 等高级模式）
  * 适当的 k 与 top_n （如在确保 rag 检索返回质量，k 与 top_n 的总量足够的情况下，协调好两者比例）

  对于几十 MB 甚至更大的文档集，若向量模型能力不足或分块/检索策略不当，整个 RAG 链条将形同虚设——“垃圾进，垃圾出” 在大规模场景下会被急剧方法。

  因此，在构建 Agent 时，务必对 RAG 环节反复验证、持续调优。它不是一次性配置，而是需要随数据和任务演进的核心能力。
### RAG 的工具化
  为何需要封装为工具？ Agent 本身并不具备主动调用 RAG 的能力，如果不加封装， RAG 只是一个固定的问答流程，无法融入 Agent 的自主决策循环。

  通过将其封装为 Tool ，我们实现两个关键目标：
  1. 解耦：将“知识检索”从主逻辑中剥离，使其成为可插拔的能力模块；
  2. 赋能：让 Agent 能在运行时自主判断当前问题是否需要查询知识库，并决定何时调用工具。

  换句话说，我们不是在“用 RAG 回答问题”，而是在“给 Agent 配备一本可随时查阅的智能参考书”

  实现在代码上很简单，但是思想上很重要，我们把上文的“Chroma + Reranker”的强化版 RAG 链条完整的封装成一个 py 函数 `search_war_and_peace()`，然后用上一大节学到的 `@tool` 装饰器给他注册成 Agent 即可。
```python
# (1) 构建一个可复用的 RAG链条 (P1+P2)
def build_rag_chain(llm_instance):
   ...
#    初始化RAG链
rag_chain_instance = build_rag_chain(llm)
 
# (2) 封装为标准 Langchain Tool
@tool
def search_war_and_peace(query):
    """查询《战争与和平》小说中的内容，包括人物、情节、历史事件等"""
    print(f'\n正在检索《战争与和平》:{query}')
    return rag_chain_instance.invoke(query)
```
  很显然，这里并没有直接将其封装为 @tool 工具，而是走了一个初始化链层，这么做是出于性能考虑。

  封装进 @tool 后，每次被 llm 调用时，这个 tool 都会运行一次，如果将整个 rag 链封装金去，那么每问一个问题都相当于重启一次 rag 系统（加载 embedding 模型、打开 Chroma 数据库、初始化各种组件）

  所以我们启动时，一次性构架完整 RAG 链，运行时，工具只调用已构建好的链即可。

  完整代码如下：
```python
import os
from config import OPENAI_API_KEY
from embeddings import get_embeddings
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
from langchain_core.tools import tool
 
 
# 全局 LLM (供Agent和Rag共用)
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=OPENAI_API_KEY,
    base_url="https://api.deepseek.com"
)
 
# (1) 构建一个可复用的 RAG链条 (P1+P2)
def build_rag_chain(llm_instance):
    print('---正在构建RAG链条...---\n')
 
    persist_directory = './chroma_db_war_and_peace_bge_small_en_v1.5'
    embedding_model_name = 'BAAI/bge-small-en-v1.5'
    encoder_model_name = "BAAI/bge-reranker-base"
 
    if not os.path.exists(persist_directory):
        raise FileNotFoundError(f'索引目录{persist_directory}未找到，请先运行 build_index.py')
 
    print(f'正在加载/下载 Embedding模型：{embedding_model_name}')
    embeddings_model = get_embeddings(model_name=embedding_model_name,device='cpu')
    db = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings_model
    )
 
    # 1. R-检索--强化版
    base_retriever = db.as_retriever(search_kwargs={"k":50})
 
    print(f'正在加载 Reranker模型:{encoder_model_name}...')
    encoder = HuggingFaceCrossEncoder(model_name=encoder_model_name)
    reranker = CrossEncoderReranker(model=encoder,top_n=6)
    compression_retriever=ContextualCompressionRetriever(
        base_retriever=base_retriever,
        base_compressor=reranker
    )
    retriever = compression_retriever
 
    # 2. A-增强
    sys_prompt = """
    你是一个博学的历史学家和文学评论家。
    请根据以下上下文回答问题。如果上下文**强烈暗示**了答案，即使未明说，也可推理回答。
    如果完全无关，请回答“对不起，根据所提供的上下文我不知道”。
    
    [上下文]: {context}
    [问题]: {question}
    """
 
    prompt = ChatPromptTemplate.from_messages([
        ('system',sys_prompt),
        ('human','{question}')
    ])
    # 3.G-生成(llm已在全局生成)
 
    # 4. 辅助函数
    def format_docs(docs):
        return '\n'.join(doc.page_content for doc in docs)
 
    # 5.组装RAG链条
    rag_chain = (
        {'context':retriever | format_docs, 'question': RunnablePassthrough()}
        | prompt
        | llm_instance
        | StrOutputParser()
    )
    print('---RAG链条构建完毕!---\n')
    return rag_chain
 
 
#    初始化RAG链
rag_chain_instance = build_rag_chain(llm)
 
# (2) 封装为标准 Langchain Tool
@tool
def search_war_and_peace(query):
    """查询《战争与和平》小说中的内容，包括人物、情节、历史事件等"""
    print(f'\n正在检索《战争与和平》:{query}')
    return rag_chain_instance.invoke(query)
 
# 也可以与其他工具并列使用
@tool
def get_weather(location):
    """模拟获得天气信息"""
    return f"{location}当前天气：23℃，晴，风力2级"
 
 
tools = [search_war_and_peace,get_weather]
 
 
# 运行
if __name__ == '__main__':
    question = "皮埃尔是共济会成员吗？他在其中扮演什么角色？"
    res = search_war_and_peace.invoke(question)
    print(f'问题:{question}')
    print(f'回答:{res}')
```
  RAG 至此已经可以完整封装进 tool 工具内了，接下来我们就可以尝试真正构建一个涵盖六大模块的智能体。
### 最终形态：Langchain 六大模块的 “大一统”
#### 为何整合？
  在这个脚本中，我们首次将 LangChain 的六大核心模块完整融合到一个统一的智能体（Agent）实例中：

  1. LLM（第02篇）：使用 ChatOpenAI 作为 Agent 的“大脑”，负责推理与生成
  2. Prompt（第04篇）：通过 ChatPromptTemplate 与 MessagesPlaceholder 精准控制 Agent 的行为逻辑
  3. Chain（第04篇）：AgentExecutor 和 RunnableWithMessageHistory 本质上都是Chain（即 Runnable），我们借助 LCEL（LangChain Expression Language）思想将它们无缝串联。
  4. Memory（第04篇）：利用 RunnableWithMessageHistory 与 ChatMessageHistory 实现对话历史的记忆能力
  5. Agents（第05篇）：通过 create_tool_calling_agent 与 AgentExecutor 构建完整的 ReAct 循环，支持工具自动调用。
  6. RAG（第06/07篇）：将封装好的 RAG 链作为工具（search_war_and_peace）注入 Agent，使其具备访问私有知识库的能力。

#### 如何实现？
  我们复用第 05 篇中已验证的 带记忆的Agent 框架（基于 RunnableWithMessageHistory），一举解决两个关键痛点：RAG 本身无记忆，现在由 Agent 统一管理上下文；RAG 与原有 Agent 割裂，现在 RAG 以工具形式深度集成

  LLM 在 ReAct 的“思考”阶段，结合对话历史，自主决定如何调用工具，并生成一个更精准、语义完整、适合检索的查询字符串，该字符串作为工具参数传递给 RAG 工具，从何实现对上下文敏感的知识搜索。

  我们无需为 RAG 单独实现记忆机制，Agent 本身（尤其是 create_tool_calling_agent）已经天然具备“基于历史改写查询”能力，这标志着 RAG 成功融入原生 Agent 架构，真正实现了“知识+推理+记忆”三位一体。

  代码实现如下，只需在原有 Agent 框架中注入 RAG 工具即可——build_rag_chain 函数保持不变，其余结构沿用前文记忆型 Agent：
```python
def create_agent_with_memory():
    # LLm
    llm = ChatOpenAI(
        model="deepseek-chat",
        api_key=OPENAI_API_KEY,
        base_url="https://api.deepseek.com"
    )
    # Prompt
    prompt = ChatPromptTemplate.from_messages([
        ('system','你是一个强大的助手。你能查天气，也能查《战争与和平》。请尽力回答用户所提的所有问题。'),
        MessagesPlaceholder(variable_name="history"), # 05篇所学:记忆占位符
        ('human','{input}'),
        MessagesPlaceholder(variable_name="agent_scratchpad") # 05篇所学:ReAct 思考链，使其能够调用工具
    ])
 
    # Tool
    rag_chain_instance = build_rag_chain(llm_instance=llm)
 
 
    @tool
    def search_war_and_peace(query):
        """查询《战争与和平》小说中的内容，包括人物、情节、历史事件等"""
        print(f'\n正在检索《战争与和平》:{query}')
        return rag_chain_instance.invoke(query)
 
    @tool
    def get_weather(location):
        """模拟获得天气信息"""
        return f"{location}当前天气：23℃，晴，风力2级"
 
    tools = [get_weather,search_war_and_peace]
# 先创建“会调用工具的 Agent”，再给它加“对话记忆”。
    # 创建Agent
    agent = create_tool_calling_agent(llm=llm,tools=tools,prompt=prompt)
    agent_executor = AgentExecutor(agent=agent,tools=tools,verbose=False)
 
    # 封装Memory
    store = {}
 
    def get_session_history(session_id:int):
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]
 
 
    # 添加记忆功能
    agent_with_memory = RunnableWithMessageHistory(
        runnable=agent_executor,
        get_session_history=get_session_history,
        input_messages_key="input",
        history_messages_key="history"
    )
    return agent_with_memory
 
 
# 测试
 
if __name__ == '__main__':
    session_id = 'user123'
    agent = create_agent_with_memory()
    while 1:
        user_input = input('\n你:')
        if user_input=='quit':
            print('拜拜~')
            exit()
        response = agent.invoke(
            {'input':user_input},
            config={'configurable':{'session_id':session_id}}
        )
        print(f"AI:{response['output']}")
```












































































  参考：[agent-craft](https://github.com/Annyfee/agent-craft)