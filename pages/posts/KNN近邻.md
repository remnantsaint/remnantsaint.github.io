---
categories: 人工智能
cover: 
date: 2024-09-06 09:33:39
image: 
layout: post
tags: 机器学习
time_warning: true
title: KNN近邻
top: 
---

#### KNN算法原理
1. 一句话总结：“近朱者赤近墨者黑”
2. KNN是一个简单的无显示学习过程，非泛化学习的监督学习模型。在分类和回归中均有应用。
3. 先给出已知的数据集，计算未知数据与每个已知数据集的`距离`（欧氏距离），取前`K`个数据（K一般小于等于20）
4. 在这K个数据中，多数属于某个类，就把该输入实例分为这个类

#### KNN开发流程
1. 收集数据：任何方法
2. 准备数据：距离计算所需要的数值，最好是结构化的数据格式
3. 分析数据：任何方法
4. 训练算法：此步骤不适用于k-近邻算法（因为测试数据每一次都要与所有训练数据进行比较，所以这个过程是没必要的）
5. 测试算法：计算错误率
6. 使用算法：输入样本数据和结构化的输出结果，然后运行k-近邻算法判断输入数据分类属于哪个分类，最后计算出分类执行后续处理

#### KNN算法特点
1. 优点：精度高、对异常值不敏感、无数据输入假定
2. 缺点：计算复杂度高、空间复杂度高
3. 适用数据范围：数值型和标称型

#### KNN三要素
1. K的取值  
&emsp;&emsp;K取值过小：近似误差小，估计误差大，容易过拟合，预测出错
&emsp;&emsp;K取值过大：近似误差大，估计误差小，模型变简单，预测容易错误
2. 距离度量  
&emsp;&emsp;距离度量通常是欧氏距离，也可以是曼哈顿距离或者Minkowski距离，也可以是地理空间中的一些距离公式。
3. 分类决策：  
&emsp;&emsp;分类决策在分类问题中通常为少数服从多数，选取票数最多的标签，在回归问题中通常为K个最邻点的标签的平均值

#### KNN算法伪代码：
对于每一个在数据集中的数据点:   
&emsp;&emsp;计算目标的数据点（需要分类的数据点）与该数据点的距离   
&emsp;&emsp;将距离排序: 从小到大   
&emsp;&emsp;选取前K个最短距离   
&emsp;&emsp;选取这K个中最多的分类类别   
&emsp;&emsp;返回该类别来作为目标数据点的预测值       

``` python
def classify0(inX, dataSet, labels, k):
    dataSetSize = dataSet.shape[0]
    #距离度量 度量公式为欧氏距离
    diffMat = tile(inX, (dataSetSize,1)) – dataSet
    sqDiffMat = diffMat**2
    sqDistances = sqDiffMat.sum(axis=1)
    distances = sqDistances**0.5
    
    #将距离排序: 从小到大
    sortedDistIndicies = distances.argsort()
    #选取前K个最短距离， 选取这K个中最多的分类类别
    classCount={}
    for i in range(k): 
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel,0) + 1 
    sortedClassCount = sorted(classCount.iteritems(), key=operator.itemgetter(1), reverse=True)
    return sortedClassCount[0][0]
```

#### 参考链接：<https://github.com/remnantsaint/ailearning/blob/master/docs/ml/2.md>