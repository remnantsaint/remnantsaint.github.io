---
layout: post
title: Transformer文献精读
date: 2025-09-13 09:34:51
updated: 2025-09-13
time_warning: true 
cover: 
top: 
tags: 
 - transformer
 - 深度学习
categories: 
 - 深度学习
# author: @Remsait
---
## 摘要
  提出了一种新的简单网络架构 Transformer，它仅基于注意力机制，完全省去了循环和卷积
  
  做了两个机器翻译的实验，效果特别好，并行度更好，训练时间更少

## 结论
  介绍了 Transformer 模型，第一个全部基于注意力的序列转录模型，把编码器-解码器架构中最常用的循环层换成了多头自注意力  
  
  除了机器翻译，以后可以用来别的工作  

## 导言
  RNN 是从头往后一个一个单词计算的，对第 t 个词，会计算一个隐藏状态 $h_t$ ，这个隐藏状态由前一个单词的 $h_{t-1}$ 和当前第 t 个词本身决定的，这样就能把前面学到的历史信息通过 $h_{t-1}$ 放到当下，然后和当前的词计算得到输出。
  
  RNN是时序的一步一步计算的过程，但是这样会导致难以并行  
  
  Attention 已经成功用在了编码器和解码器之间，它主要是用在怎么把编码器的东西有效的传给解码器  
  
  纯用注意力机制，并行度较高  
  
## 相关工作
  卷积神经网络难以对长的序列进行建模，因为在比较长的序列中，需要很多层卷积层才能把两个点一起看。
  
  使用注意力机制的情况下，每一次能看到所有的像素。
  
  卷积比较好的地方是可以做多个输出通道（一层内的多个通道），一个输出通道可以认为识别不一样的模式，Transoformer 提出要做多头注意力机制
  
  自注意力机制很重要，但是不是作者首创，Transformer 是第一个只依赖于自注意力机制的来做编码器解码器的模型
  
## 模型
  编码器-解码器架构是比较好的一个架构。
  
  比如输入一个长为 n 的序列，编码器会将输入的 n 个值转化为对应的向量，这就是编码器的输出。解码器会拿到编码器的输出，生成一个长为 m 的序列，在解码器中的词是一个一个生成的（自回归 auto-regressive 模型，输入又是输出），在最开始给定的 z ，生成第一个输出 y1 ，拿到 y1 后能生成 y2，要生成 y_t 的话要把前面所有的 y 都拿到。所以过去时刻的输出，会作为当前时刻的输入，叫做自回归  
  
  Transformer 是遵循了编码器-解码器的架构，由多层自注意力和逐点的全连接层堆叠而成，如下图所示
![](https://cloudflare.remsait.com/img/Transformer1-202509131115524.png)
  图中左侧是编码器，右侧是解码器，编码器的输入就是要翻译的句子，解码器的输入是之前的输出  
  
  Input Embedding 是一个嵌入层，要把词变为向量，Nx 是指有 N 个层堆叠在一起，每层包括一个注意力层加一个前馈神经网络（MLP），还用到了残差连接，Normalization 归一化每个样本在特征维度上的分布，编码器的输出作为解码器中间的输入
  
  解码器比编码器多了一个 Masked 的多头注意力机制  ，解码器的输出进入一个 Linear 输出层，再做一个 softmax 就会得到输出
  
### 编码器 Encoder 和 解码器 Decoder
#### 编码器 
  编码器是由 N = 6 个完全一样的层，每层会有两个子层，第一个叫做 multi-head elf-attetion mechanism，第二个叫做 positionwise fully connected feed-forward network (简单MLP)，对每一个子层用了残差链接，最后还用了 layer normalizatoin，公式就是 $LayerNorm(x + Sublayer(x))$ 
  
  为了方便残差链接，模型中所有子层以及嵌入曾都有产生 维度 $d_{model} = 512$ 的输出，d 是模型的隐藏维度，也就是每个 token 特征向量的维度数（这样就用到了 N 和 d 两个参数，方便调参）
  
  LayerNorm(层归一化) 和 BatchNorm(批归一化) 有所不同，批归一化是对每一层输入的特征，在一个 mini-batch 内计算均值和方差，再做标准化，层归一化是对单个样本的所有特征维度做标准化，而不是在 batch 维度上。Layer 不需要全局，因为样本固定，那么 norm 的形式就是固定的，不会因为分 batch 不同而反复变化  
  
  batch 是对特征 norm ，layer 是对样本 norm
  
#### 解码器
  解码器也由 N = 6 个同样的层构成，每个层有两个跟编码器一样的子层，不一样的在于编码器用了第三个子层，同样是多头注意力机制。
  
  在解码器训练过程中，在预测第 t 个时刻的输出的时候不应该看到 t 时刻以后那些输入，通过一个带掩码的注意力机制实现
  
### 注意力
  注意力函数是将一个 query 和 一些 key-value 对映射成一个输出的一个函数，所有的 query, key-value, output 都是向量，output 是 value 的一个加权和（维度一样），对于每一个 value 的权重是由这个 value 对应的 key 和 query 的相似度算来的。
  
  不同的输出，key value 不变，随着 query 的改变，权重也改变，导致输出不同  
  
### Transformer 用的注意力 Scaled Dot-Product Attention
  query 和 key 的长度是等长的，都为 $d_k$ ，value 的长度是 $d_v$ 
  
  对每一个 query 和 key 做内积作为相似度（内积越大夹角越小代表相似度越高，内积为0代表正交无相似度，内积为负就是负相关），做内积后除以 $\sqrt{d_{k}}$ （向量的长度），在用一个 softmax 来得到权重，把权重放在 value 上面就会得到输出，公式如下
  
  $$ Attention(Q, K, V) = softmax(\frac{QK^T}{\sqrt{d_k}} )V $$ 
  
  还有两种常用的注意力机制，一种是加性注意力机制，可以处理 query 和 key 不等长的情况，另外一个叫做点积的注意力机制，除了 $\sqrt{d_k}$ 不同以外，其他都相同  
  
  当 $\sqrt{d_k}$ 比较小时，两种机制的性能相似，但加性注意力（不除）的表现优于点积的注意力，无需缩放。
  
  当 $\sqrt{d_k}$ 比较大时，向量较长，这样做点积和的值就会较大，相对差距更大， 这会导致值会更加向两端靠拢（大的更大小的更小），这样算梯度的时候就会发现梯度比较小，就会跑不动
  
  整个注意力机制计算如下图所示：
  ![](https://cloudflare.remsait.com/img/Transformer2-202509131530116.png)
  Q 和 K 先做矩阵乘法，然后再除以 $\sqrt{d_k}$ ，再做一个上三角 mask，然后 softmax ，结果和 V 做矩阵乘法
  
  mask 是为了避免在 t 时间看到以后时间的东西，比如对于 $Q_t$，只能看到 $K_1, K_2......K_{t-1}$ ，不应该看 $K_t$ 和之后的东西
  
  但是公式是 Q 和 K 相乘，所以我们只能保证不用到后面的东西，具体来说就是加了个 mask掩码，把 $K_t$ 和之后的东西都变为非常大的负数，进入 softmax 后就会变为 0，这样相乘就影响不到了  
  
### 多头注意力 Multi-Head Attention
  与其做一个单个的注意力函数，不如把整个的 query, key, value 投影到低维 h 次，再做 h 次的注意力函数，每一个函数的输出并在一起，再投影得到最终的输出，如下图所示：
  ![](https://cloudflare.remsait.com/img/Transformer3-202509131539576.png)
  原始的 V, K, Q 进入一个线性层 Linear 投影到比较低的维度（原来的维度是 512，进入线性层后可能就是 64）（线性层是一个简单的矩阵乘法+偏置，降低维度）
  
  投影后在做一个 Scanled Dot-Product Attention（公式）h 次，得到 h 个输出向量全部合并，最后做一次线性的投影回到原来的维度  
  
  为什么用多头？加性的有额外的参数可以训练（其他公式），然后单头的点积注意力没有显式的训练参数（Q 和 V 本身是不变的），用多头的话，等于多组 Q, K, V 投影，每组有独立的 W_Q, W_K, W_V，这样每个 head 可以学到不同的注意力模式，公式如下所示
  $$\begin{align*}
\text{MultiHead}(Q, K, V) &= \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O \\
\text{where } \text{head}_i &= \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)
\end{align*}$$
  作者用的 h = 8 ，投影的时候应该投影到 $d_{model} / h$ 维度
  
### Transformer 如何使用注意力
  看最开始的架构图，黄色的部分就是注意力机制 
  
  编码器的注意力有三个输入，分别是 key, value, query ，因为箭头从一个地方来，所以同样的东西即作为 key, value 也作为 query，叫做自注意力机制，有 n 个 value 就有 n 个输出，如果是单头一个输出实际上就是输入的加权和，权重来自自己本身和各个向量的相似度，如果是多头的话输出会有点差别
  
  解码器的第一个大部分是一样的，只是要用到 masked， 也就是说一个输出就是这个输出对应输入的前面的加权和，后面都为 0
  
  解码器的第二个部分不再是自注意力，key, value 来自编码器的输出，query 来自编码器上面那个注意力的输出，这样这个注意力就能有效的把编码器的一些输出根据解码器上一个的 query 想要的东西拎出来，也就是说根据解码器的输入不同，根据当前的向量去编码器的输出挑感兴趣的东西，那些没那么感兴趣的就忽略掉
  
  编码器是把输入序列转化成一组上下文相关的表示，也就是 embedding ，编码了哪个位置和哪个位置相关以及全局上下文如何
  
### Transformer 如何使用 Position-wise Feed-Forward Networks
  其实就是一个全连接前馈网络，就是 MLP，让每一个 MLP 对对应的一个词作用
  $$FFN(x) = max(0, xW_1 + b_1)W_2 + b_2$$
  $W_1$ 线性变换会让输入投影到 2048 维度，因为还需要残差链接，所以 $W_2$ 又把 2048 投影回了512，所以这就是一个单隐藏层的 MLP
  
### Embeddings and Softmax
  Embeddings 就是给任何一个词都学习一个长为 d 的一个向量来表示它，除了编码器和解码器输入需要 embeddings，softmax 前也需要一个 Projection线性变换 （embedding 把词转化为向量，softmax 前 projection 需要把向量映射回词表空间，本质为互逆操作），它们共用一组权重矩阵。
  
  embeding 的权重初始通常比较小，导致后面点积小，进而导致梯度小，所以要乘 $\sqrt{d_{model}}$（缩放技巧），让embedding 的数量级和后续计算更匹配 
  
### 位置编码 Positional Encoding
  attention 不会有时序信息，也就是说矩阵乘法和点积不区分 token 的先后顺序  
  
  所以需要把时序信息加进来，在输入里面加入长为 512 的时序信息，具体公式略
  
  这样打乱句子顺序后，embedding 本身一样，但是位置编码不一样，这样 Attention 就会感知到顺序变化

## 为什么使用注意力
| Layer Type                 | Complexity per Layer      | Sequential Operations | Maximum Path Length |
|-----------------------------|---------------------------|-----------------------|----------------------|
| Self-Attention              | $O(n^2 \cdot d)$          | $O(1)$                | $O(1)$               |
| Recurrent                   | $O(n \cdot d^2)$          | $O(n)$                | $O(n)$               |
| Convolutional               | $O(k \cdot n \cdot d^2)$  | $O(1)$                | $O(\log_k(n))$       |
| Self-Attention (restricted) | $O(r \cdot n \cdot d)$    | $O(1)$                | $O(n/r)$             |

  自注意力层中，计算复杂度是 QK^T，每个都是长度为 n 的 d 维向量，也就是 $n^2 \cdot d$ ；顺序的计算因为是矩阵乘法，并行度较高是 O(1)；信息从一个数据点走到另外一个数据点要多远，在自注意力里面，一个 query 可以跟所有的 key 做运算，输出是所有的 value 的甲醛和，所以 query 跟所有的都有关系   
    
## 实验
略


















参考：[Transformer论文逐段精读——李沐](https://www.bilibili.com/video/BV1pu411o7BE/?spm_id_from=333.337.search-card.all.click&vd_source=347f13f5fa5482e399ed65cf8891aa7b)  











