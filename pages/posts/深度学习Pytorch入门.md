---
layout: post
title: 深度学习Pytorch入门
date: 2025-03-03 13:18:03
updated: 2025-09-17
time_warning: true
cover: 
top: 
tags: 
 - 深度学习
categories: 
 - 深度学习
# author: @Remsait
---
## 环境准备
  首先要在jupyter上能进行`import pytorch`，实验室电脑不支持CUDA，所以下CPU版的pytorch  
```bash
#先创建环境
  conda create -n pytorch python=3.6 -y
  activate pytorch
#安装CPU版pytorch
  conda install pytorch torchvision cpuonly -c pytorch
#安装 Jupyter 并让 mytorch 在 Jupyter Notebook 中可用
  conda install jupyter -y
#重新启动jupyter并选择已存在内核
```
  注意不要既用`conda`来安装包，又用`pip`安装包，会导致依赖发生问题  

  在 Anaconda prompt 中输入 `jupyter notebook D:` 就能打开了  
  用 jupyter 前先在Anaconda中切换到pytorch环境，再打开 jupyter 换内核
```python
import sys
import torch
# 查看Python版本
print(f"Python版本: {sys.version}")
# 查看PyTorch版本
print(f"PyTorch版本: {torch.__version__}")
# 查看当前Python解释器路径（确认是否为目标环境）
print(f"Python解释器路径: {sys.executable}")
```
## 基本知识
  `dir()`函数能让我们知道工具箱，以及工具箱中都有什么东西，比如 dir(torch)  
  `help()`函数能让我们知道每个工具的使用方法,比如 help(torch.cuda.is_available)  

  运行 python 代码的三种方式：python文件、pycharm python console、jupyter notebook  
### Python 中魔法方法的用法
  __call__ 是 python 中的魔法方法，可以让类的实例具备像函数一样被调用的能力  
  比如定义一个 person = Person() 的实例，用 `person()` 就能调用 __call__ 方法  

  __init__ 是初始化方法，在最初的 person = Person() 的 () 内可以输出参数来初始化  

  可以自己重写一些魔法方法再应用
## PyTorch 加载数据
  两个类：Dataset , Dataloader  

  Dataset 提供一种方式去获取数据及其 label  
  Dataloader 为后面网络提供不同的数据形式  
`read_data.py`代码如下：
```python
from torch.utils.data import Dataset
from PIL import Image
import os

class MyData(Dataset):
    def __init__(self, root_dir, label_dir): # 初始化定义一些变量
        # root_dir = "dataset/train"  label_dir = "ants"
        # 这样组合是为了更好的分开蚂蚁和蜜蜂，也就是标签
        self.root_dir = root_dir
        self.label_dir = label_dir
        self.path = os.path.join(self.root_dir, self.label_dir)
        self.img_path = os.listdir(self.path) # 从文件夹内容获取列表 img_path

    # __开头和结尾的都是魔法方法，不用调用，在初始化时会自动调用
    def __getitem__(self, idx):
        img_name = self.img_path[idx]
        img_item_path = os.path.join(self.root_dir, self.label_dir, img_name) # 图像的文件路径
        img= Image.open(img_item_path) # 打开图像
        label= self.label_dir
        return img, label  # 返回单个图像和其标签

    def __len__(self):
        return len(self.img_path) # len(列表) 返回列表的长度

root_dir = "data/hymenoptera_data/train"
ants_label_dir = "ants"
bees_label_dir = "bees"
ants_dataset = MyData(root_dir, ants_label_dir) # 创建一个蚂蚁数据集
bees_dataset = MyData(root_dir, bees_label_dir) # 创建一个蜜蜂数据集
'''
ants_dataset[0][0].show() # 第一个0是索引，指第一个文件；第二个0是自动返回的img，
print(ants_dataset[0][1]) # [0][1]就是label
'''
img, label = ants_dataset[0]
img.show()

train_dataset = ants_dataset + bees_dataset 
# 只有定义了__len__方法，才能相加
# 顺序是前后两个数据集的拼接
print(len(train_dataset))
```
## TensorBoard 的使用
### TensorBoard 安装
  `conda install tensorboard -y`
### 使用
  首先安装 opencv ：`conda install -c conda-forge opencv -y`  

  PIL提取的文件类型不符合`add_image()`函数的要求，但是 opencv 符合（可以用 numpy 把 PIL 提取的转变为 array  

`test_tb.py`代码如下：  
```python
from torch.utils.tensorboard import SummaryWriter
import numpy as np
from PIL import Image
import os

writer = SummaryWriter("logs") # 创建日志文件夹
# 在终端用 tensorboard --logdir=logs --port=6007 运行查看

image_path = os.path.join("data", "train", "ants_image", "0013035.jpg")
img_PIL = Image.open(image_path)
img_array = np.array(img_PIL)
writer.add_image("test", img_array, 1, dataformats='HWC') # 添加图像
# 用 HWC 是因为 array 的 shape 中通道是最后一个参数
# 如果换张图片再运行，网页就能看到 step2 是第二张图片了

for i in range(100):
    writer.add_scalar("y=3x", 3*i, i) # 第一个参数是标签，第二个参数是 y，第三个参数是 x

# 左上角切换 scalars 和 images

writer.close()

# 观察训练时候，给 model 用了哪些数据，或者对 model 测试时看每一阶段的输出结果
```
## torchvision 中的 transforms
  trasforms 主要是对图片进行一些变换
### 结构及用法
  先创建一个具体的工具，比如 tool = transforms.ToTensor()  
  然后用这个 tool ：result = tool(imput)  
```python
from PIL import Image
from torchvision import transforms
from torch.utils.tensorboard import SummaryWriter

"""
python 的用法 -> tensor数据类型
通过 transforms.ToTensor 去解决两个问题

2. 为什么需要 Tensor 数据类型
深度学习模型无法直接处理 PIL 图像/python 数组，必须输入torch.Tensor类型
tensor 支持GPU加速、自动求导,并且"C H W"格式更符合计算逻辑
"""
# 绝对路径 E:\tobebetter\learn_pytorch\data\train\ants_image\0013035.jpg
# 相对路径 data\train\ants_image\0013035.jpg
img_path = "data/train/ants_image/0013035.jpg"
img = Image.open(img_path)

writer = SummaryWriter("logs")

# 1. transforms 应该如何使用
tensor_trans = transforms.ToTensor()
tensor_img = tensor_trans(img)
# 输出图片的张量，三通道，每个通道每个元素是一个像素的归一化值

writer.add_image("Tensor_img", tensor_img)

writer.close()
```
### 常见的 Transforms
  Image.open() 输入的是 PIL 格式  
  ToTensor() 输出的是 tensor 张量
  cv.imread() 输出的是 narrays 格式

  方法中有 `ToTensor()、Normalize()、Resize()、Compose()`，具体使用方法如代码所示：
```python
from PIL import Image
from torchvision import transforms
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("logs")
img = Image.open("E:\\tobebetter\\learn_pytorch\\data\\train\\ants_image\\0013035.jpg")
# print(img)   size = 768 × 512 宽 高

"""
oooo = transforms.xxxx()都是创建一个xxxx实例 并用__init__初始化
yyyy = oooo(kk)就是调用 __call__ 方法
用 ctrl+左键 来查看官方文档的说明 输入的参数看__init__默认的不用输 变量需要输入
"""

# ToTensor() 使用方法 转换为张量
trans_totensor = transforms.ToTensor()
img_tensor = trans_totensor(img)
# print(img_tensor.shape) shape = 3 512 768 通道 高 宽
# print(img_tensor)
writer.add_image("totensor", img_tensor)
print("——————————————")

# Normalize() 使用方法 标准化
# output[channel] = (input[channel] - mean[channel]) / std[channel]  三通道对应分别计算
# mean 是均值， std 是标准差，Normalize()的参数就是均值和标准差
trans_norm = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
img_norm = trans_norm(img_tensor)
# print(img_norm)
# img_tensor 是图像的张量，数值分布是 [0, 1]
# img_norm 是图像的张量标准化后，数值分布是 均值为0，标准差为1 
print(img_tensor[0][0][0])
print(img_norm[0][0][0])
writer.add_image("norm", img_norm)
# 未标准化前的tensor图像因为比例相同，图像没啥变化
# 标准化后每个像素都改变了，所以肉眼看颜色变化了，但是方便计算机识别
print("——————————————")

# Resize() 使用方法 改变高和宽
print(img.size)
trans_resize = transforms.Resize((768, 512)) # 高 宽
# img PIL -> resize -> img_resize PIL
img_resize = trans_resize(img)
# img_resize PIL -> totensor -> img_resize tens-or
img_resize = trans_totensor(img_resize)
print(img_resize.shape)
print("——————————————")

# Compose() 使用方法，合并功能，按写的transforms变换0列表执行流程
# compose() 需要一个包含 transforms类型的列表
trans_resize_2 = transforms.Resize((800,400)) # 只有一个参数x,将图片短边缩放至x,长宽比不变
trans_compose = transforms.Compose([trans_resize_2, trans_totensor])
img_resize_2= trans_compose(img)
print(img_resize_2.shape)
writer.add_image("Compose", img_resize_2, 1)

# RandomCrop() 使用方法 随机裁剪
trans_random = transforms.RandomCrop(50) # 随机裁剪 50×50 像素的正方形区域，如果指定两个值(50,100)就是高和宽
trans_compose_2 = transforms.Compose([trans_random, trans_totensor]) # 裁剪完变成张量
for i in range(10):
    img_crop = trans_compose_2(img)
    writer.add_image("Random", img_crop, i)

writer.close()
```
## torchvision 中的数据集使用
### datasets 的使用
  使用 torchvision 中的 datasets工具包，能自己下载官方有的数据集  
代码如下：  
```python
from torchvision import transforms, datasets
from torch.utils.tensorboard import SummaryWriter

dataset_transform = transforms.Compose([
    transforms.Resize((512,512)),
    transforms.ToTensor()
])
# train=True代表划分的是训练集，false代表是测试集   transform参数是用到的变换
train_set = datasets.CIFAR10("./dataset", train=True, download=True, transform=dataset_transform)
test_set = datasets.CIFAR10("./dataset", train=False, download=True, transform=dataset_transform)

# img, target = test_set[0]
# print(test_set.classes)
# print(target) # 标签
# print(test_set.classes[target])
# img.show()

writer = SummaryWriter("logs")
# tensorboard --logdir=logs
for i in range(10):
    img, target = test_set[i]
    writer.add_image("test_set", img, i) # img已经转换为了张量

writer.close()
```
## DataLoader 的使用
  datasets 只是告诉我们数据集的位置，dataloader 能将数据加载到神经网络中  
```python
from torch.utils.data import DataLoader
from torch.utils.tensorboard.writer import SummaryWriter
from torchvision import datasets, transforms

# 准备的测试集
test_data = datasets.CIFAR10("./dataset", train=False, download=True, transform=transforms.ToTensor())

# num_workers=0单进程 drop_last=False最后数据不够batch数量是否丢弃
# shuffle=True打乱每轮 Epoch 顺序
test_loader = DataLoader(dataset=test_data, batch_size=64, shuffle=True, num_workers=0, drop_last=False)

# 测试数据集中第一张图片及target\
img, target = test_data[0] # getitem() 方法直接返回 img 和 target
print(img.shape)
print(target)

writer = SummaryWriter("logs")
# test_loader设置批数量后，imgs targets 会进行打包
# TensorBoard 不会显示所有的 step，为了节省显存和前端性能，它会进行采样，只显示部分 step
for epoch in range(2):
    step = 0
    for data in test_loader:
        imgs, targets = data
        # print(imgs.shape) # 第一个值是 batch_size 大小
        # print(targets)
        # imgs 形状为 (N, C, H, W)，用于批量可视化应使用 add_images
        writer.add_images("Epoch: {}".format(epoch), imgs, step)
        step += 1

writer.close()
```
## 神经网络的基本骨架——nn.Module的使用
  nn 即是 Neural network 神经网络  
  前向传播：输入进入神经网络中，最后产生输出  
### 简单的 python 函数
简单的 python 函数代码如下：  
```python
from torch import nn
import torch

class Test(nn.Module): 
    def __init__(self):
        super().__init__()

    def forward(self, input):
        output = input + 1
        return output

test = Test()
x = torch.tensor(1.0)
output= test(x)
print(output)
```
## 卷积神经网络
### 简单卷积运算 F.conv2d
  卷积运算就是把一个小一点的卷积核放到图像上每个位置相乘后全部相加，然后滑动  
```python
from torch import nn
import torch.nn.functional as F
import torch
input = torch.tensor([[1, 2, 0, 3, 1],
                      [0, 1, 2, 3, 1],
                      [1, 2, 1, 0, 0],
                      [5, 2, 3, 1, 1],
                      [2, 1, 0, 1, 1]])
kernel = torch.tensor([[1, 2, 1],
                       [0, 1, 0],
                       [2, 1, 0]])
input = torch.reshape(input, (1, 1, 5, 5)) # minibatch图片数量 channels通道数
kernel = torch.reshape(kernel, (1, 1, 3, 3))
output = F.conv2d(input, kernel, stride=1) # 进行卷积运算
print(output)
output2 = F.conv2d(input, kernel, stride=2)
print(output2)
output3 = F.conv2d(input, kernel, stride=1, padding=1) # 外填充1层0，5,5变成 7,7
print(output3)
```
### 卷积层 torch.nn.Conv2d
  `class torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding=0, dilation=1, groups=1, bias=True, padding_mode='zeros', device=None, dtype=None)`  
  
  其中 out_channels 与卷积核数量相同；in_channels 与 上一层输出数量和一开始的输入是什么有关  
```python
from torch import nn
from torch.nn import Conv2d
from torch.utils.data import DataLoader
from torch.utils.tensorboard.writer import SummaryWriter
from torchvision import datasets
import torchvision
import torch

dataset = datasets.CIFAR10("./dataset", train=False, transform=torchvision.transforms.ToTensor(), download=True)
dataloader = DataLoader(dataset, batch_size=64, shuffle=True, drop_last=False, num_workers=0)

class Conv(nn.Module):
    def __init__(self) -> None:
        super().__init__() # 调用父类的构造函数
        self.conv1 = Conv2d(in_channels=3, out_channels=6, kernel_size=3, stride=1, padding=0) # 进行一次卷积变换
    
    def forward(self, x):
        x = self.conv1(x)
        return x

conv = Conv()

writer = SummaryWriter("logs")

step = 0
# 输入图片像素是 32×32
for data in dataloader:
    imgs, targets = data
    output = conv(imgs) # __call__ 方法自动调用前向
    # print(imgs.shape)
    # print(output.shape) # [图片数量，通道数，卷积操作后的高宽]
    writer.add_images("input", imgs, step)
    output = torch.reshape(output,(-1, 3, 30, 30)) # 因为压缩了通道数，-1被计算成128
    writer.add_images("output", output, step)
    step += 1

writer.close()
```
### 最大池化的使用 torch.nn.MaxPool2d
  池化层：用于降低特征图的空间维度，减少计算量和参数数量，同时保留最重要的特征信息  
  
  最大池化就是设定一个池化核，然后放到输入图像，每个核覆盖的范围只会取最大值  
  
  `torch.nn.MaxPool2d(kernel_size, stride=None, padding=0, dilation=1, return_indices=False, ceil_mode=False)[source]`  
  
  其中 stride 默认和 kernel_size 相同，return_indices 是最大池化时返回下标索引，ceil_mode 是当剩下的位置不能填满 kernel 的话，就舍弃，当 ceil_mode 为 True 的时候，就不舍弃  
  
  池化层的输入输出如下：  
* $Input:（N，C，H_{in}，W_{in}）$
* $Output:（N，C，H_{out}，W_{out}）$ , where
  $$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} + 2 \times \text{padding}[0] - \text{dilation}[0] \times (\text{kernel\_size}[0] - 1) - 1}{\text{stride}[0]} + 1 \right\rfloor$$

  $$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} + 2 \times \text{padding}[1] - \text{dilation}[1] \times (\text{kernel\_size}[1] - 1) - 1}{\text{stride}[1]} + 1 \right\rfloor$$
  
  就像打了马赛克一样，代码如下：
```python
import torch
from torch import nn
from torch.nn import Conv2d, MaxPool2d
from torch.utils.data import DataLoader
from torch.utils.tensorboard.writer import SummaryWriter
from torchvision import datasets
import torchvision

dataset = datasets.CIFAR10("./dataset", train=False, transform=torchvision.transforms.ToTensor(), download=True)
dataloader = DataLoader(dataset, batch_size=64, shuffle=True, drop_last=False, num_workers=0)
# input = torch.tensor([[1, 2, 0, 3, 1],
#                       [0, 1, 2, 3, 1],
#                       [1, 2, 1, 0, 0],
#                       [5, 2, 3, 1, 1],
#                       [2, 1, 0, 1, 1]], dtype=torch.float32)
# input = torch.reshape(input, (-1, 1, 5, 5)) # -1被计算成 1
# print(input.shape)

class Conv(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.maxpool1 = MaxPool2d(kernel_size=3, ceil_mode=True) # stride 默认等于 kernel_size
        # 池化操作只支持浮点类型（float32/float64）或者半精度（float16/bfloat16）
    def forward(self, x):
        output = self.maxpool1(x)
        return output

conv = Conv()
writer = SummaryWriter("logs")
step = 0
for data in dataloader:
    imgs, targets = data
    writer.add_images("input", imgs, step)
    output = conv(imgs) # 池化操作通道数不变
    writer.add_images("output", output, step)
    print(imgs.shape, " ", output.shape)
    step += 1

writer.close()
```
### 非线性激活 
  $$ReLU(x) = (x)^+ = max(0, x)$$  
  $$Sigmoid(x) = \sigma (x) = \frac{1}{1 + exp(-x)} $$  
  
  ReLU 中的 inplace 参数的意思是是否覆盖原值，如果为 false 需要设置一个值去接  
  
```python
import torch
from torch import nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard.writer import SummaryWriter
from torchvision import datasets
import torchvision

input = torch.tensor([[1.0, -0.5],[-1, 3]])
input = torch.reshape(input, (-1, 1, 2, 2))

dataset = datasets.CIFAR10("./dataset", train=False, transform=torchvision.transforms.ToTensor(), download=True)
dataloader = DataLoader(dataset, batch_size=64, shuffle=True, drop_last=False, num_workers=0)

class Nen(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.relu1 = nn.ReLU()
        self.sigmoid1 = nn.Sigmoid()
    
    def forward(self, x):
        output = self.sigmoid1(x)
        return output

nen = Nen()
# output = relu(input) # 正数不变，负数为0
# print(output)

step = 0
writer = SummaryWriter("logs")
for data in dataloader:
    imgs, targets = data
    writer.add_images("input", imgs, step)
    output = nen(imgs)
    writer.add_images("output", output, step)
    step += 1
writer.close()
```
### 线性层及其他层介绍
  Normalization 归一化层 ：进行归一化，参数是通道数量，均值为 0，方差为 1， torch.nn.BatchNorm2d  
  Recurrent 循环层：RNN LSTM 之类的  
  Transformer 层  
  Linear 线性层：nn.Linear ，$y = xA^T + b$ ，输入核输出是全连接层的神经元数量，权重和偏置自动计算  
  Dropout 层：随机失活  
  Sparse 稀疏层：nn.Embedding  
  
  线性层代码如下：
```c++
import torch
from torch.nn import Linear
from torch.utils.data import DataLoader
import torchvision

dataset = torchvision.datasets.CIFAR10("./dataset", train=True, transform=torchvision.transforms.ToTensor(), download=True)
dataloader = DataLoader(dataset, batch_size=64, drop_last=True)

class Remsait(torch.nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.linear1 = Linear(196608, 10)
    def forward(self, x):
        output = self.linear1(x)
        return output

remsait = Remsait()
for data in dataloader:
    imgs, targets = data
    # print(imgs.shape)
    # output = torch.reshape(imgs, (1, 1, 1, -1))
    output = torch.flatten(imgs) # 线性层要求是二维向量，所以要先展平（正确应该是保留batchsize
    # output = torch.flatten(imgs, start_dim=1)  # 从第1维开始展平，保留 batch 维度
    # print(output.shape)
    output = remsait(output)
    print(output.shape)
```
## 神经网络搭建小实战与 Sequential 的使用
