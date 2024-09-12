---
categories: 其他
cover: 
date: 2022-12-29 16:27:29
image: 
layout: post
tags: 
time_warning: true
title: markdown的基础用法
top: 
---

#### 1.标题
&emsp;使用#后接空格表示标题,一共六级
&emsp;例如 # 一级标题 ## 二级标题  
#### 2.字体
&emsp;(1)斜体：`*123*`或者`_123_` 效果为 *123*
&emsp;(2)粗体：`**123**`或者`__123__` 效果为 **123**
&emsp;(3)粗斜体：`***123***`或者`___123___` 效果为 ***123***
&emsp;(4)删除线：`~~123~~`效果为~~123~~
&emsp;(5)下划线：`<u>123</u>`效果为 <u>123</u>

#### 3.分割线
&emsp; 用三个以上的星号、减号来建立一个分割线，行内不能有其他东西，也可以在型号活减号中插入空格，即`***`或`---`
示例：
***
#### 4.列表
&emsp;markdown支持有序列表和无序列表   
&emsp; (1)无序列表用*或+或-在一行的开头，后接空格，示例：      

* 123
&emsp; (2)有序列表用数字和.在一行的开头，后接空格，示例：   
1. 123

想要多级列表的话，就 tab 再加列表

#### 5.特殊符号
&emsp;使用`&emsp;`来在markdown中创建全角空格
#### 6.区块
&emsp;区块引用是再段落开头使用>符号，后面紧跟空格符号，既可以引用嵌套，也可以和列表互相嵌套。列表嵌套在引用中用> \*，引用嵌套在列表中用*后每一行一个>，例如；
> 123

#### 7.代码
&emsp;(1)段落上的一段代码可以用单反引号\`包起来，例如：\`printf()\`，显示为`printf()`，在markdown文档中用来把演示代码圈起来很方便。
&emsp;(2)区块代码通常用三个反引号包起来，并指定一种语言显示为：
```c++
123
```
#### 8.链接
&emsp;(1)直接用<>将链接地址包起来，例如`<https://remsait.com>`
&emsp;(2)若需要自定义链接名称，用`[连接名称](链接地址)`来表示，例如：`[我的博客](https://remnantsaint.github.io)`，注意用`https://`
&emsp;(3)高级链接：用1作为变量：`[Goole][1]`，最后在结尾加上`[1]: http://www.goole.com/`
#### 9.图片
(1)用法：`![alt 属性文本](图片地址 "可选标题")`，其中属性文本是替代文字，可选标题可以没有。高级用法和链接一样。
(2)markdown无法指定图片的高度和宽度，可以用普通的`<img>`标签：`<img decoding="async" src="http://static.runoob.com/images/runoob-logo.png" width="50%">`

#### 10.表格
&emsp;markdown制作表格用|来分隔不同的单元格，使用-分隔表头和其他行，例如：
```c++
|  表头   | 表头  |
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |
```
显示为：

|  表头   | 表头  |
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |

在第二行的`---`中，使用`-:`表示居右对齐、使用`:-`表示居左对齐、使用`:-:`表示居中对齐
#### 11.数学公式
&emsp; 1.上标`$O(n^2)$`，效果为$O(n^2)$   
&emsp; 2.下标`$O(n_2)$`，效果为$O(n_2)$  
&emsp; 3.分数`$\frac{\text{分子}}{\ text{分母}}$`，效果为$\frac{\text{分子}}{\text{分母}}$   
&emsp; 4.累加`$\sum\limits_{i=1}^k a_i$`，效果为$\sum\limits_{i=1}^k a_i$    
&emsp; 5.约等于`$\approx$`，效果为$\approx$     
&emsp; 6.公式居中：用两个$$包裹起来，如`$$  $$`

#### 12.引用
&emsp; 在一行的前面加上`>`后带空格，就会有引用的效果，如下：
> 这是一条引用


#### 注意
&emsp;(1)在使用vscode编辑markdown时，因为用了markdownlint插件导致html标签有黄色波浪线，右键选择命令面板，打开用户设置，输入以下代码：
```c++
  "markdownlint.config": {
    "default": true,
    "MD033": {
      "allowed_elements": [
        "font",
        "li",
        "table",
        "tr",
        "td",
        "u" //自己添加html标签
      ]
    }
  },
```
&emsp;(2)我的package.json文件中hexo-renderer-marked渲染器版本是"^6.0.0"，在浏览器中不会把`&emsp;`变为空格，会显示`&emsp;`文本样式，通过更改渲染器来解决问题：
```python
npm un hexo-renderer-marked --save
npm i hexo-renderer-markdown-it --save
npm i markdown-it-checkbox
npm i markdown-it-imsize
npm i markdown-it-expandable
（该解决方法已改变，更改为kramed，具体看hexo初建站文章中数学公式问题）
```
参考：
&emsp;<https://www.runoob.com/markdown/md-tutorial.html>
&emsp;<https://blog.csdn.net/qq_42951560/article/details/123596899>