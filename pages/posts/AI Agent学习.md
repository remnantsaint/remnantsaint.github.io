---
layout: post
title: AI Agent学习
date: 2026-08-09 12:39:54
updated: 2026-09-01
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
























  参考：[agent-craft](https://github.com/Annyfee/agent-craft)