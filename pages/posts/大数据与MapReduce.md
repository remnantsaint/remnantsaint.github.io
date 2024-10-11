---
layout: post
title: 大数据与MapReduce
date: 2024-10-10 14:02:50
cover: 
top: 
tags: 
  - 机器学习
categories: 
  - 人工智能
  - 机器学习
# author: @Remsait
---
## 大数据
### 大数据 概述
&emsp; 数据很大，本地存不下，用云端多台电脑存，收集到的数据远远超出我们的处理能力
### 大数据 场景
```text
假如你为一家网络购物商店工作，很多用户访问该网站，其中有些人会购买商品，有些人则随意浏览后就离开。
对于你来说，可能很想识别那些有购物意愿的用户。
那么问题就来了，数据集可能会非常大，在单机上训练要运行好几天。
接下来: 我们讲讲 MapRedece 如何来解决这样的问题
```

## MapReduce
### Hadoop 概述
&emsp; Hadoop 是 MapReduce 框架的一个免费开源实现  
&emsp; MapReduce: 分布式的计算框架，可以将单个计算作业分配给多台计算机执行。  

### MapReduce 原理
#### MapReduce 工作原理
- 主节点控制 MapReduce 的作业流程
- MapReduce 的作业可以分成 map 任务和 reduce 任务
- map 任务之间不做数据交流，reduce 任务之间也一样
- 在 map 和 reduce 阶段中间，有一个 sort 和 combine 阶段
- 数据被重复放在不同的机器上，以防止某个机器失效
- mapper 和 reducer 传输的数据形式为 key/value 对
![](https://cloudflare.remsait.com/img/mapreduce.png)
#### MapReduce 特点
- 优点：使程序以并行的方式执行，可在短时间内完成大量工作
- 缺点：算法必须经过重写，需要对系统工程有一定的理解
- 适用数据类型：数值型和标称型数据

### Hadoop 流（Python 调用）
#### 理论简介

&emsp; 例如：Hadoop流可以像linux命令一样执行
```shell
cat inputFile.txt | python mapper.py | sort | python reducer.py > outputFile.txt
```
&emsp; 类似的 Hadoop 流就可以在多台机器上分布式执行，用户可以通过 Linux 命令才测试 Python 语言编写的 MapReduce 脚本
#### 实战脚本

```shell
# 测试 Mapper
# Linux
cat data/15.BigData_MapReduce/inputFile.txt | python src/python/15.BigData_MapReduce/mrMeanMapper.py
# Window
# python src/python/15.BigData_MapReduce/mrMeanMapper.py < data/15.BigData_MapReduce/inputFile.txt

# 测试 Reducer
# Linux
cat data/15.BigData_MapReduce/inputFile.txt | python src/python/15.BigData_MapReduce/mrMeanMapper.py | python src/python/15.BigData_MapReduce/mrMeanReducer.py
# Window
# python src/python/15.BigData_MapReduce/mrMeanMapper.py < data/15.BigData_MapReduce/inputFile.txt | python src/python/15.BigData_MapReduce/mrMeanReducer.py
```

### MapReduce机器学习
#### Mahout in Action
1. 简单贝叶斯：属于为数不多的可以很自然的使用 MapReduce 的算法，通过统计在某个类别下某特征的概率
2. k-近邻算法：高维数据下（如文本、图像和视频）流行的近邻查找方法是局部敏感哈希算法。
3. 支持向量机（SVM）：使用随机梯度下降算法求解，如 Pegasos 算法
4. 奇异值分解：Lanczos 算法是一个有效的求解近似特征值的算法
5. k-均值分类：canopy 算法初始化 k 个簇，然后再运行 k-均值 求解结果

### 使用 mrjob库 将 MapReduce 自动化
#### 理论简介
- MapReduce 作业流自动化的框架：Cascading 和 Oozie
- mrjob 是一个不错的学习工具，于2010年底开源，来自于 Yelp 网站

```shell
python src/python/15.BigData_MapReduce/mrMean.py < data/15.BigData_MapReduce/inputFile.txt > data/15.BigData_MapReduce/myOut.txt
```
#### 实战脚本
```shell
# 测试 mrjob的案例
# 先测试一下mapper方法
# python src/python/15.BigData_MapReduce/mrMean.py --mapper < data/15.BigData_MapReduce/inputFile.txt
# 运行整个程序，移除 --mapper 就行
python src/python/15.BigData_MapReduce/mrMean.py < data/15.BigData_MapReduce/inputFile.txt
```











## Reference 
<https://github.com/apachecn/ailearning/blob/master/docs/ml/15.md>